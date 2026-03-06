"use client";

import { useEffect } from "react";
import { BookOpen } from "lucide-react";
import { useRuleReferenceContext } from "@/lib/contexts/RuleReferenceContext";
import { Tooltip } from "@/components/ui/Tooltip";

export function RuleReferenceTrigger() {
  const { isOpen, open, close } = useRuleReferenceContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, open, close]);

  return (
    <Tooltip content="Rule Reference (Cmd+/)" placement="left" delay={300}>
      <button
        onClick={() => open()}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all hover:bg-emerald-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:focus:ring-offset-zinc-950"
        aria-label="Open rule reference"
      >
        <BookOpen className="h-5 w-5" />
      </button>
    </Tooltip>
  );
}
