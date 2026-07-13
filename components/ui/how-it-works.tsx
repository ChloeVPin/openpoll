"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s % 3) + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto py-24 md:py-32 relative z-10 border-t border-zinc-200">
      <div className="text-center mb-16 md:mb-24">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4 text-zinc-950">
          How it works
        </h2>
        <p className="text-lg text-zinc-500 max-w-[500px] mx-auto">
          Three simple steps. Zero friction.
        </p>
      </div>
      <div className="relative flex flex-col gap-12 md:grid md:grid-cols-3 md:gap-12 text-left md:text-center w-full max-w-sm mx-auto md:max-w-none">
        {/* Timeline line connecting step numbers on mobile only */}
        <div className="absolute left-8 top-8 bottom-8 w-[2px] bg-zinc-100 md:hidden z-0" />

        {[
          {
            id: 1,
            title: "Type your question",
            desc: "Add your question and options. No account required.",
          },
          {
            id: 2,
            title: "Share the link",
            desc: "Send the URL to your audience anywhere on the internet.",
          },
          {
            id: 3,
            title: "Watch live",
            desc: "See votes roll in instantly with real-time websocket updates.",
          },
        ].map((step) => {
          const isActive = activeStep === step.id;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-row md:flex-col gap-6 md:gap-0 items-start md:items-center"
            >
              <div
                className={cn(
                  "size-16 rounded-full border-2 flex items-center justify-center text-xl font-bold md:mb-6 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shrink-0 z-10",
                  isActive
                    ? "bg-[#e8f3fc] border-[#1a83db]/40 text-[#1a83db] scale-110"
                    : "bg-white border-zinc-200 text-zinc-950 scale-100",
                )}
              >
                {step.id}
              </div>
              <div className="flex-1 md:mt-0">
                <h3 className="text-xl font-semibold text-zinc-950 mb-2 md:mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-500 max-w-[280px] md:max-w-none text-sm md:text-base leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
