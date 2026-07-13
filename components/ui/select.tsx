import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Option {
  value: number;
  label: string;
}

interface CustomSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  className,
  placeholder = "Select an option...",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-2 text-base text-zinc-950 font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#1a83db] active:scale-[0.99] cursor-pointer",
          isOpen && "ring-2 ring-[#1a83db] border-transparent",
        )}
      >
        <span className={cn(!selectedOption && "text-zinc-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="size-5 text-zinc-500" />
      </button>

      <AnimatePresence>
        {isOpen &&
          portalTarget &&
          createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop: Light blur, no dark overlay box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(false)}
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
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  {options.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
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
            </div>,
            portalTarget,
          )}
      </AnimatePresence>
    </div>
  );
}
