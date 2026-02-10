"use client";

import { DisplayCard } from "./DisplayCard";
import { Home } from "lucide-react";
import type { Lifestyle } from "@/lib/types";

interface LifestylesDisplayProps {
  lifestyles: Lifestyle[];
  primaryLifestyleId?: string;
}

export function LifestylesDisplay({ lifestyles, primaryLifestyleId }: LifestylesDisplayProps) {
  if (!lifestyles || lifestyles.length === 0) return null;

  return (
    <DisplayCard title="Lifestyles" icon={<Home className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-3">
        {lifestyles.map((lifestyle, index) => {
          const isPrimary = primaryLifestyleId === lifestyle.id;
          return (
            <div
              key={`lifestyle-${index}`}
              className={`p-3 rounded border-l-2 transition-colors ${
                isPrimary
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/50"
                  : "bg-zinc-50 dark:bg-zinc-800/30 border-zinc-300 dark:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 capitalize">
                    {lifestyle.type}
                  </span>
                  {isPrimary && (
                    <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded uppercase font-mono tracking-tighter">
                      Primary
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono text-emerald-500 dark:text-emerald-400">
                  ¥{lifestyle.monthlyCost.toLocaleString()}/mo
                </span>
              </div>
              {lifestyle.location && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {lifestyle.location}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
