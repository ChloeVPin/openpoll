"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  motion,
  useSpring,
  useTransform,
  animate,
  AnimatePresence,
} from "motion/react";

const OPTIONS = [
  { id: "next", text: "Next.js", mockPercentage: 62 },
  { id: "svelte", text: "SvelteKit", mockPercentage: 24 },
  { id: "remix", text: "Remix", mockPercentage: 14 },
];

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
      setDisplayValue(0);
    }
  }, [value, isAnimating]);

  return (
    <span className="font-medium text-zinc-500 tabular-nums">
      {displayValue}%
    </span>
  );
}

export function HeroMock() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const handleVote = () => {
    if (!selected) return;
    setIsVoting(true);
    setTimeout(() => {
      setIsVoting(false);
      setHasVoted(true);
    }, 400);
  };

  return (
    <motion.div
      initial={
        isMobile
          ? { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 }
          : { rotateX: 12, rotateY: -16, rotateZ: 3, scale: 0.98 }
      }
      whileHover={
        isMobile
          ? { scale: 1.01 }
          : { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.02 }
      }
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
      style={isMobile ? {} : { transformStyle: "preserve-3d" }}
      className="w-full max-w-sm mx-auto bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-3xl p-8 flex flex-col gap-6 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,1)] transform-gpu"
    >
      <h3 className="font-medium text-xl tracking-tight text-zinc-950 leading-tight">
        What is your favorite framework?
      </h3>

      <div className="flex flex-col gap-3 relative min-h-[192px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {OPTIONS.map((option, i) => {
            const isSelected = selected === option.id;

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
                  className="relative h-14 w-full bg-zinc-50 rounded-2xl overflow-hidden flex items-center px-4 border border-zinc-200/50"
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
                    style={{ width: `${option.mockPercentage}%` }}
                  />
                  <div className="relative z-10 flex justify-between items-center w-full">
                    <span className="font-medium text-zinc-950">
                      {option.text}
                    </span>
                    <CountingNumber
                      value={option.mockPercentage}
                      isAnimating={hasVoted}
                    />
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={`option-${option.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => !isVoting && setSelected(option.id)}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98]",
                  isSelected
                    ? "border-[#1a83db]/30 bg-[#1a83db]/5"
                    : "border-zinc-200/60 bg-white/50 hover:bg-white hover:border-zinc-300",
                )}
              >
                <span
                  className={cn(
                    "font-medium transition-colors",
                    isSelected
                      ? "text-zinc-950"
                      : "text-zinc-600 group-hover:text-zinc-950",
                  )}
                >
                  {option.text}
                </span>
                <div
                  className={cn(
                    "size-5 rounded-full border-[1.5px] transition-colors flex items-center justify-center bg-white",
                    isSelected
                      ? "border-[#1a83db]"
                      : "border-zinc-300 group-hover:border-[#1a83db]/40",
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="selected-dot"
                      className="size-2.5 rounded-full bg-[#1a83db]"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {!hasVoted && (
        <Button
          className="w-full rounded-xl h-12 text-base font-semibold bg-[#1a83db] text-white hover:bg-[#1a83db]/90 active:scale-[0.98] transition-all shadow-none"
          onClick={handleVote}
          disabled={!selected || isVoting}
        >
          {isVoting ? "Voting..." : "Vote"}
        </Button>
      )}

      {hasVoted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            className="w-full rounded-xl h-12 text-base font-semibold border-zinc-200 text-zinc-950 hover:bg-zinc-50 active:scale-[0.98] transition-all bg-white"
            onClick={() => {
              setHasVoted(false);
              setSelected(null);
            }}
          >
            Reset Demo
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
