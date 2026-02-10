"use client";

import type { FocusItem } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Sparkles } from "lucide-react";

interface FociDisplayProps {
  foci: FocusItem[];
}

export function FociDisplay({ foci }: FociDisplayProps) {
  if (foci.length === 0) return null;

  return (
    <DisplayCard title="Foci" icon={<Sparkles className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-3">
        {foci.map((focus, idx) => (
          <div
            key={focus.id || `focus-${idx}`}
            className={`p-3 rounded border transition-all ${
              focus.bonded
                ? "border-violet-500/30 bg-violet-500/5"
                : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {focus.name}
                  </span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-violet-500/30 text-violet-400 bg-violet-500/5">
                    {focus.type}
                  </span>
                  {focus.bonded && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      Bonded
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono leading-none mb-1">
                  Force
                </div>
                <div className="text-sm font-mono text-violet-400 font-bold leading-none">
                  {focus.force}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DisplayCard>
  );
}
