"use client";

import { use, useState, useEffect } from "react";
import { usePoll } from "@/hooks/use-poll";
import { useLiveVotes } from "@/hooks/use-live-votes";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { animate, motion, AnimatePresence } from "motion/react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

function CountingNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: [0.23, 1, 0.32, 1],
      onUpdate(v) {
        setDisplayValue(Math.round(v));
      },
    });
    return controls.stop;
  }, [value]);

  return (
    <span className="font-semibold text-zinc-900 text-xl tabular-nums">
      {displayValue}%
    </span>
  );
}

export default function PollResults({
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

  if (isPollLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-muted/20">
        <div className="w-full max-w-4xl space-y-4">
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <Skeleton className="h-[400px] w-full rounded-2xl mt-12" />
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

  const totalVotes = votes.length;

  // Aggregate votes
  const chartData = poll.options
    .map((option) => {
      const count = votes.filter((v) => v.option_id === option.id).length;
      const percentage =
        totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
      return {
        id: option.id,
        name: option.text,
        count,
        percentage,
      };
    })
    .sort((a, b) => b.count - a.count); // sort descending

  return (
    <div className="min-h-dvh flex flex-col bg-[#fcfeff] text-zinc-950 overflow-x-hidden selection:bg-[#1a83db]/20 selection:text-zinc-950">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-8 lg:px-16 w-full bg-[#fcfeff]/80 backdrop-blur-md border-b border-zinc-200">
        <Breadcrumbs
          items={[
            { label: "Poll", href: `/p/${slug}` },
            { label: "Live Results" },
          ]}
        />
      </header>

      <main className="flex-1 flex flex-col items-center pt-8 md:pt-12 px-6 pb-24 relative">
        <div className="absolute inset-0 bg-[#1a83db]/5 blur-[120px] rounded-full opacity-60 mix-blend-multiply pointer-events-none" />

        <div className="w-full max-w-3xl flex flex-col items-center text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/60 backdrop-blur border border-zinc-200/60 shadow-sm mb-6">
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              {isVotesLoading ? "..." : totalVotes}{" "}
              {totalVotes === 1 ? "Total Vote" : "Total Votes"}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-950 leading-tight">
            {poll.question}
          </h1>
        </div>

        <Card className="w-full max-w-3xl p-12 md:p-16 lg:p-20 border border-zinc-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] rounded-[3rem] bg-white/70 backdrop-blur-xl relative z-10">
          {totalVotes === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-zinc-500 text-lg">
              Waiting for the first vote...
            </div>
          ) : (
            <div className="flex flex-col gap-5 relative min-h-[240px]">
              <AnimatePresence mode="popLayout" initial={false}>
                {chartData.map((option, i) => {
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
                        style={{ width: `${option.percentage}%` }}
                      />
                      <div className="relative z-10 flex justify-between items-center w-full">
                        <span className="font-medium text-zinc-950 text-xl leading-snug break-words">
                          {option.name}
                        </span>
                        <CountingNumber value={option.percentage} />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
