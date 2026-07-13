import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Open Poll",
  description: "Read the Privacy Policy for Open Poll.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-zinc prose-a:text-[#1a83db] max-w-none">
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-zinc-950">
            1. No Tracking, No Accounts
          </h2>
          <p>
            Open Poll is built on the philosophy of minimal data collection. We
            do not require users to create accounts, and we do not use tracking
            cookies for advertising purposes. You own your data.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-zinc-950">
            2. Auto-Deletion (No Trace Left Behind)
          </h2>
          <p>
            Every poll created on Open Poll is temporary. When a poll expires
            (maximum 14 days), it is permanently and physically deleted from our
            database. We do not keep archives or hidden backups of your expired
            polls. Once it&apos;s gone, it&apos;s truly gone.
          </p>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-zinc-950">
            3. Data We Collect
          </h2>
          <p>
            We only collect the absolute minimum data required to make the
            service function:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>The content of your poll (questions and options)</li>
            <li>Vote counts and selection data</li>
            <li>
              A temporary, anonymized device fingerprint (hash) to prevent
              duplicate voting. This hash cannot be reverse-engineered to
              identify you.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-12 mb-4 text-zinc-950">
            4. Open Source Transparency
          </h2>
          <p>
            Open Poll is 100% open-source software. You can inspect our entire
            codebase on GitHub to verify our data practices and security
            architecture. If you prefer, you can even self-host your own
            instance of Open Poll.
          </p>
        </div>
      </main>
    </div>
  );
}
