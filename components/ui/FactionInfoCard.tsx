"use client";

import React from "react";
import type { JohnsonFactionData } from "@/lib/rules/loader-types";

interface FactionInfoCardProps {
  faction: JohnsonFactionData;
}

export function FactionInfoCard({ faction }: FactionInfoCardProps) {
  return (
    <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-amber-400 font-mono font-bold">{faction.name}</span>
        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] uppercase font-mono">
          {faction.category}
        </span>
      </div>
      <p className="text-muted-foreground leading-relaxed">{faction.description}</p>
      {faction.typicalJobs && faction.typicalJobs.length > 0 && (
        <div>
          <span className="text-amber-400/70 font-mono text-[10px] uppercase">Typical Jobs:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {faction.typicalJobs.map((job, idx) => (
              <span
                key={`${job}-${idx}`}
                className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[10px]"
              >
                {job}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
