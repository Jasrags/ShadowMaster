"use client";

import { DisplayCard } from "./DisplayCard";
import { Zap } from "lucide-react";
import type { AdeptPower } from "@/lib/types";

interface AdeptPowersDisplayProps {
  adeptPowers: AdeptPower[];
}

function PowerRow({ power }: { power: AdeptPower }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t border-zinc-200 dark:border-zinc-800/50">
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
            {power.name}
          </span>
          {power.rating && power.rating > 0 && (
            <span className="bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono text-[11px] font-semibold px-1.5 rounded">
              {power.rating}
            </span>
          )}
        </div>
        {power.specification && (
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 italic">
            {power.specification}
          </span>
        )}
      </div>
      <span className="inline-flex items-center justify-center min-w-[32px] h-7 rounded-md font-mono font-bold text-[13px] bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-2 shrink-0 ml-3">
        {power.powerPointCost} PP
      </span>
    </div>
  );
}

export function AdeptPowersDisplay({ adeptPowers }: AdeptPowersDisplayProps) {
  if (!adeptPowers || adeptPowers.length === 0) return null;

  return (
    <DisplayCard title="Adept Powers" icon={<Zap className="h-4 w-4 text-amber-400" />}>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        {adeptPowers.map((power, idx) => (
          <PowerRow key={power.id || idx} power={power} />
        ))}
      </div>
    </DisplayCard>
  );
}
