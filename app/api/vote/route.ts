import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { checkBotId } from "botid/server";

// Initialize Redis only if env vars are present (fallback to no rate limit for local dev if missing)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 votes per minute per IP
      analytics: true,
    })
  : null;

export async function POST(req: Request) {
  try {
    // Vercel BotID verification
    const { isBot } = await checkBotId();
    if (isBot) {
      return NextResponse.json(
        { error: "Access denied. Bot activity detected." },
        { status: 403 },
      );
    }

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    if (ratelimit) {
      const { success } = await ratelimit.limit(`vote_${ip}`);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 },
        );
      }
    }

    const body = await req.json();
    const { poll_id, option_id, option_ids, fingerprint } = body;

    // Support both single option_id and array of option_ids for backward compatibility and multi-select
    const selectedOptions =
      option_ids && Array.isArray(option_ids)
        ? option_ids
        : option_id
          ? [option_id]
          : [];

    if (!poll_id || selectedOptions.length === 0 || !fingerprint) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();

    // 1. Validate that the poll exists, hasn't expired, and that option_id is valid
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .select("id, options, expires_at, allow_multiple")
      .eq("id", poll_id)
      .single();

    if (pollError || !poll) {
      return NextResponse.json({ error: "Poll not found." }, { status: 404 });
    }

    // 2. Check if the poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "This poll has ended." },
        { status: 410 },
      );
    }

    // 3. Validate multiple choice rules
    if (!poll.allow_multiple && selectedOptions.length > 1) {
      return NextResponse.json(
        { error: "Multiple choices are not allowed for this poll." },
        { status: 400 },
      );
    }

    // 4. Validate that all selected options are valid for this poll
    const options = poll.options as Array<{ id: string; text: string }>;
    const validOptionIds = new Set(options.map((opt) => opt.id));
    const allValid = selectedOptions.every((id) => validOptionIds.has(id));

    if (!allValid) {
      return NextResponse.json(
        { error: "Invalid option selected." },
        { status: 400 },
      );
    }

    // 5. ALWAYS check for existing vote by this fingerprint to prevent spam
    const { data: existingVote } = await supabase
      .from("votes")
      .select("id")
      .eq("poll_id", poll_id)
      .eq("fingerprint", fingerprint)
      .limit(1)
      .maybeSingle();

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted on this poll." },
        { status: 403 },
      );
    }

    // 6. Insert votes (batch insert)
    const votesToInsert = selectedOptions.map((id) => ({
      poll_id,
      option_id: id,
      fingerprint,
    }));

    const { error } = await supabase.from("votes").insert(votesToInsert);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You have already voted on this poll." },
          { status: 403 },
        );
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to cast vote." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
