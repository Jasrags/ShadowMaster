"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { RuleReferenceCategory } from "@/lib/types";

interface RuleReferenceContextValue {
  isOpen: boolean;
  open: (context?: RuleReferenceCategory) => void;
  close: () => void;
  defaultCategory: RuleReferenceCategory | null;
}

const RuleReferenceContext = createContext<RuleReferenceContextValue | null>(null);

export function RuleReferenceProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultCategory, setDefaultCategory] = useState<RuleReferenceCategory | null>(null);

  const open = useCallback((context?: RuleReferenceCategory) => {
    setDefaultCategory(context ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setDefaultCategory(null);
  }, []);

  return (
    <RuleReferenceContext.Provider value={{ isOpen, open, close, defaultCategory }}>
      {children}
    </RuleReferenceContext.Provider>
  );
}

export function useRuleReferenceContext(): RuleReferenceContextValue {
  const ctx = useContext(RuleReferenceContext);
  if (!ctx) {
    throw new Error("useRuleReferenceContext must be used within RuleReferenceProvider");
  }
  return ctx;
}
