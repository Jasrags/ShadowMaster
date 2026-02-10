"use client";

import { DisplayCard } from "./DisplayCard";
import { Zap } from "lucide-react";
import type { AdeptPower } from "@/lib/types";

interface AdeptPowersDisplayProps {
  adeptPowers: AdeptPower[];
}

export function AdeptPowersDisplay({ adeptPowers }: AdeptPowersDisplayProps) {
  if (!adeptPowers || adeptPowers.length === 0) return null;

  return (
    <DisplayCard title="Adept Powers" icon={<Zap className="h-4 w-4 text-amber-400" />}>
      <div className="space-y-3">
        {adeptPowers.map((power, idx) => (
          <div
            key={power.id || idx}
            className="p-3 rounded transition-all group bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 border border-amber-500/30"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200 transition-colors group-hover:text-amber-500 dark:group-hover:text-amber-400">
                    {power.name}
                  </span>
                  {power.rating && (
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-tighter px-1.5 py-0.5 border border-amber-500/30 rounded bg-amber-500/5">
                      Level {power.rating}
                    </span>
                  )}
                </div>
                {power.specification && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono italic">
                    Spec: {power.specification}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono leading-none mb-1">
                  Cost
                </div>
                <div className="text-sm font-mono text-amber-500 dark:text-amber-400 font-bold leading-none">
                  {power.powerPointCost} PP
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DisplayCard>
  );
}
