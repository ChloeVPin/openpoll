"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePollSchema, CreatePollInput } from "@/lib/types";
import { createPollAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ListPlus,
  Settings2,
  Copy,
  HelpCircle,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { CustomSelect } from "@/components/ui/select";

const STEPS = [
  { id: 1, title: "Question", icon: HelpCircle },
  { id: 2, title: "Options", icon: ListPlus },
  { id: 3, title: "Settings", icon: Settings2 },
];

export default function CreatePoll() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (step === 2) {
      setFocusedIndex(0);
    }
  }, [step]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDurationOpen(false);
    };
    if (isDurationOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDurationOpen]);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreatePollInput>({
    resolver: zodResolver(CreatePollSchema),
    defaultValues: {
      question: "",
      options: [
        { id: uuidv4(), text: "" },
        { id: uuidv4(), text: "" },
      ],
      is_public: true,
      allow_multiple: false,
      duration_hours: 24,
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    if (optionsContainerRef.current) {
      optionsContainerRef.current.scrollTop =
        optionsContainerRef.current.scrollHeight;
    }
  }, [fields.length]);

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger("question");
    } else if (step === 2) {
      isValid = await trigger("options");
    }

    if (isValid) {
      setStep((s) => Math.min(s + 1, 3));
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const [successData, setSuccessData] = useState<{
    slug: string;
    admin_token: string;
  } | null>(null);

  const onSubmit = async (data: CreatePollInput) => {
    setIsSubmitting(true);
    try {
      const res = await createPollAction(data);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      if (res?.slug && res?.admin_token) {
        toast.success("Poll created successfully!");
        setSuccessData({ slug: res.slug, admin_token: res.admin_token });
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[#fcfeff] text-zinc-950 overflow-x-hidden selection:bg-[#1a83db]/20 selection:text-zinc-950">
      <header className="sticky top-0 z-50 flex h-16 items-center px-8 lg:px-16 w-full bg-[#fcfeff]/80 backdrop-blur-md border-b border-zinc-200">
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

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[#1a83db]/5 blur-[120px] rounded-full opacity-60 mix-blend-multiply pointer-events-none" />

        <div className="w-full max-w-2xl relative z-10">
          {successData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-[2.5rem] p-10 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] flex flex-col items-center text-center"
            >
              <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="size-10" />
              </div>
              <h2 className="text-3xl font-serif italic font-normal text-zinc-950 mb-2">
                Poll Created
              </h2>
              <p className="text-zinc-500 mb-8 max-w-md">
                Your poll is live! Save your admin link below to edit or close
                this poll later.{" "}
                <strong className="text-zinc-950">
                  You will only see this once.
                </strong>
              </p>

              <div className="w-full space-y-4 mb-8">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-zinc-950 text-left block">
                    Public Share Link
                  </Label>
                  <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center justify-between gap-4">
                    <code className="text-sm text-zinc-700 truncate flex-1 text-left select-all">
                      {typeof window !== "undefined"
                        ? window.location.origin
                        : ""}
                      /p/{successData.slug}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/p/${successData.slug}`,
                        );
                        toast.success("Copied share link!");
                      }}
                      className="shrink-0 h-9 hover:bg-zinc-200"
                    >
                      <Copy className="size-4 mr-2" /> Copy
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-zinc-950 text-left block">
                    Admin Link{" "}
                    <span className="text-zinc-500 font-normal">
                      (Keep this safe!)
                    </span>
                  </Label>
                  <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center justify-between gap-4">
                    <code className="text-sm text-zinc-700 truncate flex-1 text-left select-all">
                      {typeof window !== "undefined"
                        ? window.location.origin
                        : ""}
                      /p/{successData.slug}/admin?token=
                      {successData.admin_token}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/p/${successData.slug}/admin?token=${successData.admin_token}`,
                        );
                        toast.success("Copied admin link!");
                      }}
                      className="shrink-0 h-9 hover:bg-zinc-200"
                    >
                      <Copy className="size-4 mr-2" /> Copy
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex w-full gap-4">
                <Button
                  type="button"
                  className="flex-1 h-12 rounded-xl bg-[#1a83db] text-white hover:bg-[#1a83db]/90 font-semibold shadow-none"
                  onClick={() => router.push(`/p/${successData.slug}`)}
                >
                  View Poll
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 font-semibold"
                  onClick={() =>
                    router.push(
                      `/p/${successData.slug}/admin?token=${successData.admin_token}`,
                    )
                  }
                >
                  Open Admin
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Progress Indicator */}
              <div className="mb-12">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-10 right-10 top-5 h-[1px] -z-10">
                    <div className="absolute inset-0 bg-zinc-200/40" />
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-[#1a83db] transition-all duration-500 ease-in-out"
                      style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />
                  </div>
                  {STEPS.map((s) => {
                    const Icon = s.icon;
                    const isActive = step === s.id;
                    const isPassed = step > s.id;
                    return (
                      <div
                        key={s.id}
                        className="flex flex-col items-center gap-2.5 bg-transparent px-2 z-10"
                      >
                        <div
                          className={cn(
                            "size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                            isActive
                              ? "border-[#1a83db] bg-[#fcfeff] text-[#1a83db] shadow-[0_0_0_4px_rgba(26,131,219,0.08)] scale-105"
                              : isPassed
                                ? "border-[#1a83db] bg-[#1a83db] text-white"
                                : "border-zinc-200 bg-[#fcfeff] text-zinc-400",
                          )}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="size-5 animate-in fade-in zoom-in-75 duration-300" />
                          ) : (
                            <Icon className="size-5" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300",
                            isActive
                              ? "text-[#1a83db] font-bold"
                              : isPassed
                                ? "text-zinc-700 font-semibold"
                                : "text-zinc-400 font-medium",
                          )}
                        >
                          {s.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Container */}
              <div className="bg-white/70 backdrop-blur-xl border border-zinc-200/60 rounded-[2.5rem] p-10 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] md:max-h-[85vh] flex flex-col">
                <form
                  onSubmit={(e) => {
                    if (step < 3) {
                      e.preventDefault();
                      return;
                    }
                    handleSubmit(onSubmit, (err) => {
                      console.error("Validation errors:", err);
                      toast.error("Please check the form for errors.");
                    })(e);
                  }}
                  className="flex flex-col min-h-0"
                >
                  <motion.div
                    layout
                    className="min-h-[160px] relative flex-1 md:overflow-y-auto overflow-y-visible overflow-x-hidden px-2 py-1"
                  >
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="mb-4">
                            <h2 className="text-4xl font-semibold tracking-tight text-zinc-950 mb-3">
                              What do you want to ask?
                            </h2>
                            <p className="text-lg text-zinc-500">
                              Keep it short and engaging.
                            </p>
                          </div>
                          <div className="relative pb-7">
                            <Input
                              id="question"
                              autoFocus
                              placeholder="e.g. What is your favorite framework?"
                              className={cn(
                                "text-2xl h-20 px-8 rounded-2xl bg-zinc-50/50 border-zinc-200 shadow-sm focus-visible:ring-[#1a83db]",
                                errors.question &&
                                  "border-red-500 focus-visible:ring-red-500",
                              )}
                              {...register("question")}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  nextStep();
                                }
                              }}
                            />
                            {errors.question && (
                              <p className="text-red-500 text-sm font-medium px-2 absolute bottom-0 left-0">
                                {errors.question.message}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="mb-4">
                            <h2 className="text-4xl font-semibold tracking-tight text-zinc-950 mb-3">
                              Add options
                            </h2>
                            <p className="text-lg text-zinc-500">
                              Give your audience some choices.
                            </p>
                          </div>
                          <div
                            ref={optionsContainerRef}
                            className="max-h-none overflow-y-visible md:max-h-[400px] md:overflow-y-scroll space-y-1.5 px-2 py-1 mb-4 scrollbar-thin"
                          >
                            <AnimatePresence>
                              {fields.map((field, index) => (
                                <motion.div
                                  key={field.id}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  transition={{
                                    duration: 0.15,
                                    ease: "easeOut",
                                  }}
                                  className="px-1.5 pt-0.5 pb-4 relative"
                                >
                                  <div className="relative w-full">
                                    <Input
                                      autoFocus={index === focusedIndex}
                                      placeholder={`Option ${index + 1}`}
                                      className={cn(
                                        "min-h-[4rem] h-16 py-4 px-6 pr-14 text-lg rounded-xl bg-zinc-50/50 border-zinc-200 shadow-sm focus-visible:ring-[#1a83db]",
                                        errors.options?.[index]?.text &&
                                          "border-red-500",
                                      )}
                                      {...register(
                                        `options.${index}.text` as const,
                                      )}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          if (
                                            index === fields.length - 1 &&
                                            fields.length < 50
                                          ) {
                                            append({ id: uuidv4(), text: "" });
                                            setFocusedIndex(fields.length);
                                          } else {
                                            nextStep();
                                          }
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      disabled={fields.length <= 2}
                                      className={cn(
                                        "absolute right-2 top-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 shrink-0 size-12 rounded-lg flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
                                        fields.length <= 2
                                          ? "opacity-0 pointer-events-none"
                                          : "cursor-pointer",
                                      )}
                                      onClick={() => remove(index)}
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </div>
                                  {errors.options?.[index]?.text && (
                                    <p className="text-red-500 text-xs font-medium px-2 absolute bottom-0 left-2">
                                      {errors.options[index].text.message}
                                    </p>
                                  )}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                            {errors.options &&
                              !Array.isArray(errors.options) && (
                                <p className="text-red-500 text-sm font-medium px-2">
                                  {(errors.options as any).message}
                                </p>
                              )}
                          </div>
                          {fields.length < 50 && (
                            <div className="px-3.5">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  append({ id: uuidv4(), text: "" });
                                  setFocusedIndex(fields.length);
                                }}
                                className="w-full h-14 rounded-xl border-dashed border-2 border-zinc-200 text-sm font-semibold text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                              >
                                <Plus className="size-4 mr-2" /> Add another
                                option
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="mb-4">
                            <h2 className="text-4xl font-semibold tracking-tight text-zinc-950 mb-3">
                              Final touches
                            </h2>
                            <p className="text-lg text-zinc-500">
                              Configure how your poll behaves.
                            </p>
                          </div>

                          <div className="space-y-6">
                            {/* Switches Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-50/50 border border-zinc-200/50 shadow-sm">
                                <div className="space-y-0.5">
                                  <Label
                                    htmlFor="is_public"
                                    className="text-sm font-semibold text-zinc-950"
                                  >
                                    Public Results
                                  </Label>
                                  <p className="text-xs text-zinc-500">
                                    Anyone can view results.
                                  </p>
                                </div>
                                <Controller
                                  control={control}
                                  name="is_public"
                                  render={({ field }) => (
                                    <Switch
                                      id="is_public"
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="data-[state=checked]:bg-[#1a83db] scale-95"
                                    />
                                  )}
                                />
                              </div>

                              <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-50/50 border border-zinc-200/50 shadow-sm">
                                <div className="space-y-0.5">
                                  <Label
                                    htmlFor="allow_multiple"
                                    className="text-sm font-semibold text-zinc-950"
                                  >
                                    Multiple Choice
                                  </Label>
                                  <p className="text-xs text-zinc-500">
                                    Select multiple options.
                                  </p>
                                </div>
                                <Controller
                                  control={control}
                                  name="allow_multiple"
                                  render={({ field }) => (
                                    <Switch
                                      id="allow_multiple"
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                      className="data-[state=checked]:bg-[#1a83db] scale-95"
                                    />
                                  )}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="flex flex-col gap-3 p-6 rounded-2xl bg-zinc-50/50 border border-zinc-200/50 shadow-sm">
                                <div className="space-y-0.5">
                                  <Label
                                    htmlFor="duration_hours"
                                    className="text-sm font-semibold text-zinc-950"
                                  >
                                    Poll Duration
                                  </Label>
                                  <p className="text-xs text-zinc-500">
                                    Active duration (max 14 days).
                                  </p>
                                </div>
                                <Controller
                                  control={control}
                                  name="duration_hours"
                                  render={({ field }) => (
                                    <button
                                      type="button"
                                      onClick={() => setIsDurationOpen(true)}
                                      className="flex min-h-[3.5rem] w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-3 text-base text-zinc-950 font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1a83db] active:scale-[0.99] cursor-pointer"
                                    >
                                      <span>
                                        {field.value === 1
                                          ? "1 Hour"
                                          : field.value === 24
                                            ? "24 Hours"
                                            : field.value === 72
                                              ? "3 Days"
                                              : field.value === 168
                                                ? "7 Days"
                                                : field.value === 336
                                                  ? "14 Days (Max)"
                                                  : "Select Duration"}
                                      </span>
                                      <ChevronDown className="size-5 text-zinc-500" />
                                    </button>
                                  )}
                                />
                              </div>

                              <div className="flex flex-col gap-3 p-6 rounded-2xl bg-zinc-50/50 border border-zinc-200/50 shadow-sm">
                                <div className="space-y-0.5">
                                  <Label
                                    htmlFor="admin_password"
                                    className="text-sm font-semibold text-zinc-950"
                                  >
                                    Admin Password{" "}
                                    <span className="text-zinc-400 font-normal">
                                      (Optional)
                                    </span>
                                  </Label>
                                  <p className="text-xs text-zinc-500">
                                    Secure your admin dashboard.
                                  </p>
                                </div>
                                <Input
                                  id="admin_password"
                                  type="password"
                                  placeholder="Password (optional)..."
                                  className="min-h-[3.5rem] px-5 py-3 rounded-xl bg-white border-zinc-200 focus-visible:ring-[#1a83db] text-base shadow-sm"
                                  {...register("admin_password")}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Navigation Actions */}
                  <div className="pt-10 mt-6 border-t border-zinc-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={step === 1}
                      className={cn(
                        "h-12 px-6 rounded-xl text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 font-semibold text-sm inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-0 disabled:pointer-events-none",
                        step === 1 && "opacity-0 pointer-events-none",
                      )}
                    >
                      <ArrowLeft className="size-4 mr-2" /> Back
                    </button>

                    {step < 3 ? (
                      <Button
                        key="continue-button"
                        type="button"
                        onClick={nextStep}
                        className="h-12 px-8 rounded-xl bg-[#1a83db] text-white hover:bg-[#1a83db]/90 font-semibold shadow-none active:scale-95 transition-all"
                      >
                        Continue <ArrowRight className="size-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        key="submit-button"
                        type="submit"
                        disabled={isSubmitting}
                        className="h-12 px-8 rounded-xl bg-[#1a83db] text-white hover:bg-[#1a83db]/90 font-semibold shadow-none active:scale-95 transition-all"
                      >
                        {isSubmitting ? "Creating..." : "Create Poll"}{" "}
                        <CheckCircle2 className="size-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isDurationOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop: Light blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDurationOpen(false)}
              className="absolute inset-0 bg-white/20 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
              className="relative w-full max-w-sm rounded-[2rem] border border-zinc-200/60 bg-white p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] flex flex-col gap-4 z-10"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-zinc-950">
                  Select Duration
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDurationOpen(false)}
                  className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {[
                  { value: 1, label: "1 Hour" },
                  { value: 24, label: "24 Hours" },
                  { value: 72, label: "3 Days" },
                  { value: 168, label: "7 Days" },
                  { value: 336, label: "14 Days (Max)" },
                ].map((option) => {
                  const isSelected = option.value === watch("duration_hours");
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setValue("duration_hours", option.value);
                        setIsDurationOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-4 py-3 text-base text-zinc-700 font-semibold transition-all hover:bg-zinc-50 hover:text-zinc-950 cursor-pointer text-left active:scale-[0.99]",
                        isSelected &&
                          "bg-[#1a83db]/5 text-[#1a83db] hover:bg-[#1a83db]/10 hover:text-[#1a83db]",
                      )}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <div className="size-5 rounded-full bg-[#1a83db] flex items-center justify-center animate-in scale-in duration-200">
                          <Check className="size-3 text-white stroke-[3px]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
