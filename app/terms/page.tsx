import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Open Poll",
  description: "Read the Terms of Service for Open Poll.",
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#fcfeff] text-zinc-950">
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
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-20 text-zinc-800">
        <h1 className="text-4xl md:text-5xl font-serif italic text-zinc-950 mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-zinc prose-a:text-[#1a83db] max-w-none">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-zinc-950">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using Open Poll, you accept and agree to be bound
            by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-zinc-950">
            2. Description of Service
          </h2>
          <p>
            Open Poll provides a free, temporary, account-less polling service.
            The service is provided "as is" and "as available". We do not
            guarantee continuous, uninterrupted access to the platform.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-zinc-950">
            3. User Conduct
          </h2>
          <p>You agree not to use Open Poll to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              Create polls that contain illegal, abusive, or harassing content.
            </li>
            <li>
              Attempt to manipulate voting through bots or automated scripts.
            </li>
            <li>Impersonate any person or entity.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-zinc-950">
            4. Poll Deletion & Admin Links
          </h2>
          <p>
            All polls are automatically deleted after their expiration date (up
            to 14 days). Once deleted, data cannot be recovered. If you create a
            poll, you are responsible for securely storing the provided Admin
            Link and optional password. Open Poll cannot recover lost admin
            access links.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-zinc-950">
            5. Limitation of Liability
          </h2>
          <p>
            Open Poll shall not be liable for any direct, indirect, incidental,
            special, or consequential damages resulting from the use or
            inability to use the service.
          </p>
        </div>
      </main>
    </div>
  );
}
