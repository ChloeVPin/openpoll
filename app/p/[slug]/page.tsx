"use client";

import { use, useEffect, useState } from "react";
import { usePoll } from "@/hooks/use-poll";
import { useLiveVotes } from "@/hooks/use-live-votes";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import fpPromise from "@fingerprintjs/fingerprintjs";
import {
  BarChart2,
  Share2,
  AlertCircle,
  Clock,
  CheckCircle2,
  Check,
} from "lucide-react";
import { motion, animate, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function PollViewer({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const {
    data: poll,
    isLoading: isPollLoading,
    error: pollError,
  } = usePoll(slug);
  const { votes, isLoading: isVotesLoading } = useLiveVotes(poll?.id);

  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await fpPromise.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);
    };
    getFingerprint();
  }, []);

  // Check localStorage for vote status (client-side tracking since fingerprints are not exposed)
  useEffect(() => {
    if (poll?.id && fingerprint) {
      const votedPolls = JSON.parse(
        localStorage.getItem("openpoll_votes") || "{}",
      );
      if (votedPolls[poll.id]) {
        setHasVoted(true);
      }
    }
  }, [poll?.id, fingerprint]);

  if (isPollLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-muted/20">
        <div className="w-full max-w-2xl space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (pollError || !poll) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-muted/20 text-center gap-4">
        <AlertCircle className="size-12 text-destructive opacity-80" />
        <h1 className="text-2xl font-semibold">Poll not found</h1>
        <p className="text-muted-foreground">
          The poll you are looking for does not exist or has expired.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-4")}
        >
          Go Home
        </Link>
      </div>
    );
  }

  // Check if poll has expired
  const isExpired = poll.expires_at
    ? new Date(poll.expires_at) < new Date()
    : false;

  const handleVote = async (optionIdsToVote?: string[]) => {
    if (!fingerprint) {
      toast.error(
        "Unable to verify device identity. Please ensure cookies/scripts are allowed.",
      );
      return;
    }

    const payloadOptionIds = optionIdsToVote || selectedOptions;
    if (payloadOptionIds.length === 0) return;

    setIsVoting(true);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poll_id: poll.id,
          option_ids: payloadOptionIds,
          fingerprint,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          // Already voted - save to localStorage
          const votedPolls = JSON.parse(
            localStorage.getItem("openpoll_votes") || "{}",
          );
          votedPolls[poll.id] = true;
          localStorage.setItem("openpoll_votes", JSON.stringify(votedPolls));
          setHasVoted(true);
        }
        toast.error(data.error || "Failed to vote");
        return;
      }

      // Save successful vote to localStorage
      const votedPolls = JSON.parse(
        localStorage.getItem("openpoll_votes") || "{}",
      );
      votedPolls[poll.id] = true;
      localStorage.setItem("openpoll_votes", JSON.stringify(votedPolls));
      setHasVoted(true);

      toast.success("Vote recorded successfully!");
    } catch (e) {
      toast.error("A network error occurred");
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // Expired poll view
  if (isExpired) {
    return (
      <div className="min-h-dvh flex flex-col bg-[#fcfeff] text-zinc-950 overflow-x-hidden selection:bg-[#1a83db]/20 selection:text-zinc-950">
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-8 lg:px-16 w-full bg-[#fcfeff]/80 backdrop-blur-md border-b border-zinc-200">
          <Breadcrumbs items={[{ label: poll.question || "Poll" }]} />
        </header>
        <main className="flex-1 flex items-center justify-center p-6 relative">
          <div className="absolute inset-0 bg-zinc-500/5 blur-[120px] rounded-full opacity-60 mix-blend-multiply pointer-events-none" />
          <div className="w-full max-w-3xl bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-[3rem] p-12 md:p-16 lg:p-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] text-center space-y-10 relative z-10">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-zinc-100 text-zinc-500 mb-2">
              <Clock className="size-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-950">
              This poll has ended
            </h1>
            <p className="text-xl md:text-2xl text-zinc-500">{poll.question}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href={`/p/${slug}/results`}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto font-semibold bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-none rounded-xl",
                )}
              >
                View Final Results
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const totalVoters = poll.allow_multiple
    ? new Set(votes.map((v: any) => v.created_at)).size
    : votes.length;

  return (
    <div className="min-h-dvh flex flex-col bg-[#fcfeff] text-zinc-950 overflow-x-hidden selection:bg-[#1a83db]/20 selection:text-zinc-950">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-8 lg:px-16 w-full bg-[#fcfeff]/80 backdrop-blur-md border-b border-zinc-200">
        <Breadcrumbs items={[{ label: poll.question || "Poll" }]} />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[#1a83db]/5 blur-[120px] rounded-full opacity-60 mix-blend-multiply pointer-events-none" />
        <div className="w-full max-w-3xl bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-[3rem] p-12 md:p-16 lg:p-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] relative z-10">
          <div className="mb-14 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-950 leading-tight mb-6">
              {poll.question}
            </h1>
            <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">
              {isVotesLoading ? "..." : totalVoters}{" "}
              {totalVoters === 1 ? "Voter" : "Voters"} so far
            </p>
          </div>

          <div className="flex flex-col gap-5 relative min-h-[240px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {poll.options.map((option: any, i: number) => {
                const count = votes.filter(
                  (v: any) => v.option_id === option.id,
                ).length;
                const percentage =
                  totalVoters > 0 ? Math.round((count / totalVoters) * 100) : 0;

                if (hasVoted) {
                  return (
                    <motion.div
                      key={`result-${option.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.1,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                      className="relative min-h-[5.5rem] py-5 w-full bg-zinc-50 rounded-[1.25rem] overflow-hidden flex items-center px-8 border border-zinc-200/50"
                    >
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-[#1a83db]/20 origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.1,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative z-10 flex justify-between items-center w-full">
                        <span className="font-medium text-zinc-950 text-xl leading-snug break-words">
                          {option.text}
                        </span>
                        <CountingNumber
                          value={percentage}
                          isAnimating={hasVoted}
                        />
                      </div>
                    </motion.div>
                  );
                }

                const isSelected = selectedOptions.includes(option.id);

                return (
                  <motion.div
                    key={`option-${option.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      if (isVoting) return;
                      if (poll.allow_multiple) {
                        setSelectedOptions((prev) =>
                          prev.includes(option.id)
                            ? prev.filter((id) => id !== option.id)
                            : [...prev, option.id],
                        );
                      } else {
                        handleVote([option.id]);
                      }
                    }}
                    className={cn(
                      "group flex items-center justify-between p-8 rounded-[1.25rem] border transition-all cursor-pointer active:scale-[0.99]",
                      isSelected
                        ? "bg-[#1a83db]/5 border-[#1a83db]"
                        : "bg-white/50 border-zinc-200/60 hover:bg-white hover:border-zinc-300",
                    )}
                  >
                    <span
                      className={cn(
                        "text-xl leading-snug break-words font-medium transition-colors pr-4",
                        isSelected
                          ? "text-[#1a83db]"
                          : "text-zinc-950 group-hover:text-[#1a83db]",
                      )}
                    >
                      {option.text}
                    </span>
                    <div
                      className={cn(
                        "size-7 shrink-0 border-2 transition-colors flex items-center justify-center",
                        poll.allow_multiple ? "rounded-md" : "rounded-full",
                        isSelected
                          ? "border-[#1a83db] bg-[#1a83db] text-white"
                          : "border-zinc-300 group-hover:border-[#1a83db] bg-white",
                      )}
                    >
                      {isSelected && <Check className="size-4" />}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {poll.allow_multiple && !hasVoted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex justify-center"
            >
              <Button
                onClick={() => handleVote(selectedOptions)}
                disabled={selectedOptions.length === 0 || isVoting}
                className="w-full sm:w-auto min-w-[200px] h-14 text-lg font-semibold rounded-xl bg-[#1a83db] text-white hover:bg-[#1a83db]/90 shadow-none"
              >
                {isVoting ? "Submitting..." : "Cast Vote"}
              </Button>
            </motion.div>
          )}

          <div className="mt-10 flex justify-center">
            <Button
              variant="ghost"
              className="text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100/50 rounded-xl"
              onClick={handleShare}
            >
              <Share2 className="size-4 mr-2" /> Share this poll
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function CountingNumber({
  value,
  isAnimating,
}: {
  value: number;
  isAnimating: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: [0.23, 1, 0.32, 1],
        onUpdate(v) {
          setDisplayValue(Math.round(v));
        },
      });
      return controls.stop;
    } else {
      setDisplayValue(value);
    }
  }, [value, isAnimating]);

  return (
    <span className="font-semibold text-zinc-500 tabular-nums text-lg">
      {displayValue}%
    </span>
  );
}
