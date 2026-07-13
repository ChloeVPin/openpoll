"use client";

import { useEffect } from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { AlertCircle } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Internal logging for production monitoring
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-primary selection:text-primary-foreground bg-[#fcfeff]">
        <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-center gap-6 relative">
          <div className="absolute inset-0 bg-red-500/5 blur-[120px] rounded-full opacity-60 mix-blend-multiply pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
            <div className="p-4 bg-red-100 text-red-600 rounded-full">
              <AlertCircle className="size-12" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              Something went critically wrong
            </h1>
            <p className="text-zinc-500">
              A fatal error occurred at the application root. Please try
              resetting the view or return later.
            </p>
            <button
              onClick={() => reset()}
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-8 text-sm font-medium text-zinc-50 hover:bg-zinc-800 transition-colors"
            >
              Recover Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
