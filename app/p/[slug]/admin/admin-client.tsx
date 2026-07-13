"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  endPollAction,
  extendPollAction,
  deletePollAction,
  verifyPasswordAction,
} from "@/app/actions";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ShieldAlert,
  Trash2,
  StopCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function AdminClient({
  slug,
  poll,
  initialToken,
  hasPassword,
}: {
  slug: string;
  poll: any;
  initialToken: string | null;
  hasPassword: boolean;
}) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(
    hasPassword ? null : initialToken,
  );
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsAuthenticating(true);
    try {
      const res = await verifyPasswordAction(slug, password);
      if (res.success) {
        setToken("password_auth"); // We use this flag locally, the actions will take the password
        toast.success("Authenticated");
      } else {
        toast.error("Incorrect password");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getAuthArgs = () => {
    if (token && token !== "password_auth") {
      return { token, password: null };
    }
    return { token: null, password };
  };

  const handleEndPoll = async () => {
    if (
      !confirm(
        "Are you sure you want to end this poll now? Voting will be disabled.",
      )
    )
      return;
    setIsProcessing(true);
    const auth = getAuthArgs();
    const res = await endPollAction(slug, auth.token, auth.password);
    setIsProcessing(false);

    if (res.error) toast.error(res.error);
    else {
      toast.success("Poll ended");
      router.refresh();
    }
  };

  const handleExtendPoll = async (days: number) => {
    setIsProcessing(true);
    const auth = getAuthArgs();
    const res = await extendPollAction(slug, days, auth.token, auth.password);
    setIsProcessing(false);

    if (res.error) toast.error(res.error);
    else {
      toast.success(`Poll extended by ${days} days`);
      router.refresh();
    }
  };

  const handleDeletePoll = async () => {
    if (
      !confirm(
        "CRITICAL: Are you sure you want to permanently delete this poll? This cannot be undone.",
      )
    )
      return;
    setIsProcessing(true);
    const auth = getAuthArgs();
    const res = await deletePollAction(slug, auth.token, auth.password);
    setIsProcessing(false);

    if (res.error) toast.error(res.error);
    else {
      toast.success("Poll deleted permanently");
      router.push("/");
    }
  };

  if (!token) {
    return (
      <div className="min-h-dvh flex flex-col bg-[#fcfeff] text-zinc-950">
        <header className="flex h-20 items-center px-6 lg:px-12 border-b border-zinc-200 bg-[#fcfeff]/85">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-all cursor-pointer"
          >
            <Logo size={30} />
            <span className="font-serif italic font-normal text-2xl text-zinc-950 pr-1">
              Open Poll
            </span>
          </Link>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-xl">
            <div className="size-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
              <ShieldAlert className="size-8" />
            </div>
            <h1 className="text-2xl font-semibold text-center mb-2 text-zinc-950">
              Admin Access Required
            </h1>
            <p className="text-zinc-500 text-center mb-8">
              {hasPassword
                ? "Enter your admin password to manage this poll."
                : "You must use your unique Admin Link to access this page."}
            </p>

            {hasPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-zinc-50"
                  autoFocus
                />
                <Button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full h-12 bg-[#1a83db] hover:bg-[#1a83db]/90 text-white rounded-xl"
                >
                  {isAuthenticating ? "Verifying..." : "Unlock"}
                </Button>
              </form>
            ) : (
              <Link
                href={`/p/${slug}`}
                className="flex items-center justify-center w-full h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium rounded-xl transition-colors"
              >
                Return to Poll
              </Link>
            )}
          </div>
        </main>
      </div>
    );
  }

  const isExpired = poll.expires_at
    ? new Date(poll.expires_at) < new Date()
    : false;

  return (
    <div className="min-h-dvh flex flex-col bg-[#fcfeff] text-zinc-950">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-8 lg:px-16 w-full bg-[#fcfeff]/80 backdrop-blur-md border-b border-zinc-200">
        <div className="flex items-center gap-4">
          <Link
            href={`/p/${slug}`}
            className="text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="h-6 w-px bg-zinc-200" />
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="font-medium text-zinc-950">Admin Panel</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-12 max-w-4xl mx-auto w-full space-y-8">
        <div>
          <h1 className="text-3xl font-serif italic text-zinc-950 mb-2 truncate">
            {poll.question}
          </h1>
          <p className="text-zinc-500">
            Manage your poll settings and lifecycle.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Card */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="font-semibold text-zinc-950 mb-4 flex items-center gap-2 shrink-0">
              <Clock className="size-5 text-[#1a83db]" /> Lifecycle
            </h3>
            <div className="flex-1 flex flex-col">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Status</span>
                  <span
                    className={`font-medium px-2.5 py-1 rounded-full text-xs ${isExpired ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                  >
                    {isExpired ? "Ended" : "Active"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Expires</span>
                  <span className="font-medium text-zinc-950">
                    {poll.expires_at
                      ? formatDistanceToNow(new Date(poll.expires_at), {
                          addSuffix: true,
                        })
                      : "Never"}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-transparent">
                {!isExpired ? (
                  <Button
                    onClick={handleEndPoll}
                    disabled={isProcessing}
                    variant="destructive"
                    className="w-full h-11 rounded-xl"
                  >
                    <StopCircle className="size-4 mr-2" /> End Poll Now
                  </Button>
                ) : (
                  <div className="h-11 w-full" />
                )}
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="font-semibold text-zinc-950 mb-4 flex items-center gap-2 shrink-0">
              <ShieldAlert className="size-5 text-amber-500" /> Administration
            </h3>
            <div className="flex-1 flex flex-col">
              <div className="space-y-3">
                <p className="text-sm text-zinc-500 mb-4">
                  Extend your poll duration up to a maximum of 14 days from
                  today.
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleExtendPoll(1)}
                    disabled={isProcessing}
                    className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-xl"
                  >
                    +1 Day
                  </Button>
                  <Button
                    onClick={() => handleExtendPoll(7)}
                    disabled={isProcessing}
                    className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-xl"
                  >
                    +7 Days
                  </Button>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-transparent">
                <Button
                  onClick={handleDeletePoll}
                  disabled={isProcessing}
                  variant="destructive"
                  className="w-full h-11 rounded-xl"
                >
                  <Trash2 className="size-4 mr-2" /> Permanently Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
