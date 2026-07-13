"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Layers,
  Cpu,
  Globe,
  Lock,
  ShieldCheck,
  Zap,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HeroMock } from "@/components/ui/hero-mock";
import { CountingPolls } from "@/components/ui/counting-polls";
import { HowItWorks } from "@/components/ui/how-it-works";
import { Logo } from "@/components/ui/logo";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useState, useEffect } from "react";

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-6, 6]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (isMobile) return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: isMobile ? "flat" : "preserve-3d",
        perspective: 1000,
      }}
      className={cn("transform-gpu", className)}
    >
      {children}
    </motion.div>
  );
}

// SVG Logos for Social Proof
function LogoVercel({
  className,
  height,
  ...props
}: React.SVGProps<SVGSVGElement> & { height?: number }) {
  return (
    <svg
      viewBox="0 0 75 65"
      fill="currentColor"
      height={height}
      className={className}
      style={{ height: height ? `${height}px` : undefined, width: "auto" }}
      {...props}
    >
      <path d="M37.593 0L75.187 65H0L37.593 0Z" />
    </svg>
  );
}

function LogoNextjs({
  className,
  height,
  ...props
}: React.SVGProps<SVGSVGElement> & { height?: number }) {
  return (
    <svg
      viewBox="0 0 128 128"
      height={height}
      className={className}
      style={{ height: height ? `${height}px` : undefined, width: "auto" }}
      {...props}
    >
      <circle cx="64" cy="64" r="64" fill="currentColor" />
      <path
        fill="url(#nextjs-a)"
        d="M106.317 112.014 49.167 38.4H38.4v51.179h8.614v-40.24l52.54 67.884a64.216 64.216 0 0 0 6.763-5.209z"
      />
      <path fill="url(#nextjs-b)" d="M81.778 38.4h8.533v51.2h-8.533z" />
      <defs>
        <linearGradient
          id="nextjs-a"
          x1="109"
          x2="144.5"
          y1="116.5"
          y2="160.5"
          gradientTransform="scale(.71111)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="nextjs-b"
          x1="121"
          x2="121"
          y1="54"
          y2="126"
          gradientTransform="scale(.71111)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LogoSupabase({
  className,
  height,
  ...props
}: React.SVGProps<SVGSVGElement> & { height?: number }) {
  return (
    <svg
      viewBox="0 0 109 113"
      fill="none"
      height={height}
      className={className}
      style={{ height: height ? `${height}px` : undefined, width: "auto" }}
      {...props}
    >
      <path
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
        fill="url(#paint1_linear)"
        fillOpacity="0.2"
      />
      <path
        d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
        fill="#3ECF8E"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="53.9738"
          y1="54.974"
          x2="94.1635"
          y2="71.8295"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#249361" />
          <stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="36.1558"
          y1="30.578"
          x2="54.4844"
          y2="65.0806"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LogoGithub({
  className,
  height,
  ...props
}: React.SVGProps<SVGSVGElement> & { height?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      height={height}
      className={className}
      style={{ height: height ? `${height}px` : undefined, width: "auto" }}
      {...props}
    >
      <path d="M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656" />
    </svg>
  );
}

// Geometric Trust Icons
function TrustIcon1() {
  return (
    <div className="size-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="size-4 text-blue-600"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    </div>
  );
}
function TrustIcon2() {
  return (
    <div className="size-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="size-4 text-indigo-600"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    </div>
  );
}
function TrustIcon3() {
  return (
    <div className="size-8 rounded-full border-2 border-white bg-violet-100 flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="size-4 text-violet-600"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    </div>
  );
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-[#fcfeff] text-zinc-950 selection:bg-[#1a83db]/20 selection:text-zinc-950 overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-8 lg:px-16 w-full bg-[#fcfeff]/80 backdrop-blur-md border-b border-zinc-200">
        <Link
          href="/"
          className="flex items-center gap-1.5 hover:opacity-80 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Logo size={30} />
          <span className="font-serif italic font-normal text-2xl text-zinc-950 pr-1">
            Open Poll
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/create"
            className={cn(
              buttonVariants({ size: "sm" }),
              "font-semibold bg-[#1a83db] text-white hover:bg-[#1a83db]/90 h-9 px-5 active:scale-[0.98] transition-all",
            )}
          >
            Create Poll
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center pt-24 md:pt-40 lg:pt-48 px-8 lg:px-12 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10"
        >
          <div className="flex flex-col items-start text-left max-w-[600px]">
            <motion.h1
              variants={fadeUpItem}
              className="font-serif italic font-normal text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight leading-[1.15] text-zinc-950 mb-8"
            >
              The fastest way <br className="hidden md:block" />
              to poll your audience.
            </motion.h1>
            <motion.p
              variants={fadeUpItem}
              className="text-lg md:text-xl text-zinc-500 mb-10 max-w-[480px] leading-relaxed"
            >
              Create and share instantly. Gather anonymous opinions with live
              updating results. No sign up required.
            </motion.p>
            <motion.div
              variants={fadeUpItem}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link
                href="/create"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto font-semibold min-h-[4rem] py-5 px-10 text-lg bg-[#1a83db] text-white hover:bg-[#1a83db]/90 active:scale-[0.98] transition-all",
                )}
              >
                Create your first poll
              </Link>
            </motion.div>

            {/* Trust Micro-Strip */}
            <motion.div
              variants={fadeUpItem}
              className="mt-12 flex items-center gap-4 text-sm font-medium text-zinc-500"
            >
              <div className="flex -space-x-2">
                <TrustIcon1 />
                <TrustIcon2 />
                <TrustIcon3 />
              </div>
              <p>
                Over <CountingPolls /> polls created
              </p>
            </motion.div>
          </div>

          {/* Interactive Visual / Mockup */}
          <motion.div
            variants={fadeUpItem}
            className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center lg:justify-center"
            style={{ perspective: 1200 }}
          >
            <div className="absolute inset-0 bg-[#1a83db]/10 blur-[120px] rounded-full opacity-60 mix-blend-multiply" />
            <div className="relative z-10 w-full max-w-[420px]">
              <HeroMock />
            </div>
          </motion.div>
        </motion.div>

        {/* Social Proof Logo Wall */}
        <div className="w-full max-w-5xl mx-auto py-16 md:py-24 border-b border-zinc-200 relative z-10 mt-10">
          <p className="text-center text-sm font-medium text-zinc-400 mb-8 uppercase tracking-widest">
            Built on modern infrastructure
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 text-zinc-400 opacity-60 grayscale">
            <LogoVercel height={28} />
            <LogoNextjs height={28} />
            <LogoSupabase height={28} />
            <LogoGithub height={28} />
          </div>
        </div>

        {/* Asymmetric Bento Feature Grid */}
        <section
          id="features"
          className="w-full max-w-6xl mx-auto py-32 md:py-48 relative z-10"
        >
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4 text-zinc-950">
              Everything you need
            </h2>
            <p className="text-lg text-zinc-500 max-w-[500px] mx-auto">
              Open Poll provides a premium polling experience without the bloat.
              Designed for speed and fairness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            {/* Large Feature 1 */}
            <TiltCard className="md:col-span-3 bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-[2.5rem] p-12 md:p-16 flex flex-col justify-end min-h-[420px] relative overflow-hidden group shadow-[0_16px_48px_-12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]">
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent z-10 opacity-80" />
              <div className="relative z-20">
                <div className="size-12 rounded-xl bg-[#1a83db]/10 flex items-center justify-center text-[#1a83db] mb-6">
                  <Activity className="size-6" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 mb-2">
                  Live Real-time Results
                </h3>
                <p className="text-zinc-500 leading-relaxed max-w-[400px]">
                  Watch votes come in live. Beautiful animated charts powered by
                  Supabase Realtime subscriptions.
                </p>
              </div>
            </TiltCard>

            {/* Small Feature 2 */}
            <TiltCard className="md:col-span-2 bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-[2.5rem] p-12 md:p-16 flex flex-col justify-end min-h-[420px] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]">
              <div className="size-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600 mb-6">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 mb-2">
                Anti-Cheat
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Device fingerprinting and server-side rate limiting to keep your
                polls fair and accurate.
              </p>
            </TiltCard>

            {/* Small Feature 3 */}
            <TiltCard className="md:col-span-2 bg-[#1a83db]/10 backdrop-blur-xl border border-[#1a83db]/20 rounded-[2.5rem] p-12 md:p-16 flex flex-col justify-end min-h-[420px] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]">
              <div className="size-12 rounded-xl bg-[#1a83db]/20 flex items-center justify-center text-[#1a83db] mb-6">
                <Zap className="size-6" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-[#1a83db] mb-2">
                Instant Creation
              </h3>
              <p className="text-[#1a83db]/80 leading-relaxed">
                Skip the sign up process. Type your question and get a shareable
                link immediately.
              </p>
            </TiltCard>

            {/* Large Feature 4 */}
            <TiltCard className="md:col-span-3 bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-[2.5rem] p-12 md:p-16 flex flex-col justify-end min-h-[420px] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]">
              <div className="size-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600 mb-6">
                <Globe className="size-6" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 mb-2">
                Global Edge Network
              </h3>
              <p className="text-zinc-500 leading-relaxed max-w-[400px]">
                Deployed on Next.js App Router and cached at the edge for
                blazing fast load times anywhere in the world.
              </p>
            </TiltCard>
          </div>
        </section>

        <HowItWorks />

        {/* Final CTA Section */}
        <section className="w-full max-w-5xl mx-auto py-32 md:py-48 relative z-10">
          <div className="bg-zinc-950 rounded-[3rem] p-16 md:p-24 flex flex-col items-center text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter text-white mb-6">
              Ready to ask your audience?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-[480px]">
              Stop fighting with bloated forms. Create your first poll right now
              in under 10 seconds.
            </p>
            <Link
              href="/create"
              className={cn(
                buttonVariants({ size: "lg" }),
                "font-semibold min-h-[4.5rem] py-5 px-12 text-xl bg-[#1a83db] text-white hover:bg-[#1a83db]/90 active:scale-[0.98] transition-all rounded-[1.25rem]",
              )}
            >
              Create your poll
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 px-8 lg:px-16 border-t border-zinc-200 relative z-10">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer">
            <Logo size={18} />
            <span className="font-serif italic font-normal text-base text-zinc-950 pr-1">
              Open Poll
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-zinc-950 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-zinc-950 transition-colors"
            >
              Terms
            </Link>
            <p>Released under the MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
