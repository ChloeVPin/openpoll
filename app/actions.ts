"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { CreatePollSchema, CreatePollInput } from "@/lib/types";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { checkBotId } from "botid/server";

export async function createPollAction(data: CreatePollInput) {
  // Vercel BotID verification
  const { isBot } = await checkBotId();
  if (isBot) {
    return { error: "Access denied. Bot activity detected." };
  }

  const result = CreatePollSchema.safeParse(data);
  if (!result.success) {
    return { error: "Invalid data" };
  }

  const supabase = createServiceClient();

  // Generate a random slug and admin token
  const slug = nanoid(8);
  const admin_token = nanoid(16);

  // Hash password if provided
  let admin_password = null;
  if (result.data.admin_password) {
    admin_password = await bcrypt.hash(result.data.admin_password, 10);
  }

  // Calculate expires_at
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + result.data.duration_hours);

  const { error } = await supabase.from("polls").insert({
    slug,
    question: result.data.question,
    options: result.data.options,
    is_public: result.data.is_public,
    allow_multiple: result.data.allow_multiple,
    admin_token,
    admin_password,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("Error creating poll:", error);
    return { error: "Failed to create poll" };
  }

  return { slug, admin_token };
}

async function verifyAdminAccess(
  slug: string,
  admin_token?: string | null,
  password?: string | null,
) {
  const supabase = createServiceClient();

  // Service-role client can read admin_token and admin_password
  const { data: poll, error } = await supabase
    .from("polls")
    .select("admin_token, admin_password")
    .eq("slug", slug)
    .single();

  if (error || !poll) return false;

  // Check token match
  if (admin_token && poll.admin_token === admin_token) return true;

  // Check password match
  if (password && poll.admin_password) {
    const isValid = await bcrypt.compare(password, poll.admin_password);
    return isValid;
  }

  return false;
}

export async function verifyPasswordAction(slug: string, password: string) {
  const isValid = await verifyAdminAccess(slug, null, password);
  return { success: isValid };
}

export async function endPollAction(
  slug: string,
  admin_token?: string | null,
  password?: string | null,
) {
  const isAuthorized = await verifyAdminAccess(slug, admin_token, password);
  if (!isAuthorized) return { error: "Unauthorized" };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("polls")
    .update({ expires_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) return { error: "Failed to end poll" };

  revalidatePath(`/p/${slug}`);
  return { success: true };
}

export async function extendPollAction(
  slug: string,
  days: number,
  admin_token?: string | null,
  password?: string | null,
) {
  const isAuthorized = await verifyAdminAccess(slug, admin_token, password);
  if (!isAuthorized) return { error: "Unauthorized" };

  const supabase = createServiceClient();
  const { data: poll } = await supabase
    .from("polls")
    .select("expires_at")
    .eq("slug", slug)
    .single();

  if (!poll) return { error: "Poll not found" };

  const currentExpires = poll.expires_at
    ? new Date(poll.expires_at)
    : new Date();
  // Ensure we don't extend past 14 days from NOW
  const maxExpires = new Date();
  maxExpires.setDate(maxExpires.getDate() + 14);

  const newExpires = new Date(currentExpires);
  newExpires.setDate(newExpires.getDate() + days);

  const finalExpires = newExpires > maxExpires ? maxExpires : newExpires;

  const { error } = await supabase
    .from("polls")
    .update({ expires_at: finalExpires.toISOString() })
    .eq("slug", slug);

  if (error) return { error: "Failed to extend poll" };

  revalidatePath(`/p/${slug}`);
  return { success: true, expires_at: finalExpires.toISOString() };
}

export async function deletePollAction(
  slug: string,
  admin_token?: string | null,
  password?: string | null,
) {
  // Vercel BotID verification
  const { isBot } = await checkBotId();
  if (isBot) {
    return { error: "Access denied. Bot activity detected." };
  }

  const isAuthorized = await verifyAdminAccess(slug, admin_token, password);
  if (!isAuthorized) return { error: "Unauthorized" };

  const supabase = createServiceClient();
  const { error } = await supabase.from("polls").delete().eq("slug", slug);
  if (error) return { error: "Failed to delete poll" };

  return { success: true };
}
