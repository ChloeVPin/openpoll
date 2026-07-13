"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Internal logging for production monitoring
    console.error("Route Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center gap-6 bg-[#fcfeff] relative">
      <div className="absolute inset-0 bg-red-500/5 blur-[120px] rounded-full opacity-60 mix-blend-multiply pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md">
        <div className="p-4 bg-red-100 text-red-600 rounded-full">
          <AlertCircle className="size-10" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Something went wrong
        </h2>
        <p className="text-zinc-500">
          An unexpected error occurred while loading this section. You can try
          recovering the page.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-zinc-50 hover:bg-zinc-800 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
