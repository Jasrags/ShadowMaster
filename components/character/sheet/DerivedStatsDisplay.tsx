"use client";

import { DisplayCard } from "./DisplayCard";
import { Calculator } from "lucide-react";

interface DerivedStatsDisplayProps {
  physicalLimit: number;
  mentalLimit: number;
  socialLimit: number;
  initiative: number;
}

export function DerivedStatsDisplay({
  physicalLimit,
  mentalLimit,
  socialLimit,
  initiative,
}: DerivedStatsDisplayProps) {
  return (
    <DisplayCard title="Derived Stats" icon={<Calculator className="h-4 w-4 text-zinc-400" />}>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded">
          <span className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase">
            Physical
          </span>
          <span className="text-xl font-mono font-bold text-red-500">{physicalLimit}</span>
        </div>
        <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded">
          <span className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase">
            Mental
          </span>
          <span className="text-xl font-mono font-bold text-blue-400">{mentalLimit}</span>
        </div>
        <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded">
          <span className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase">
            Social
          </span>
          <span className="text-xl font-mono font-bold text-pink-400">{socialLimit}</span>
        </div>
        <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded">
          <span className="block text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase">
            Initiative
          </span>
          <span className="text-xl font-mono font-bold text-emerald-400">{initiative}+1d6</span>
        </div>
      </div>
    </DisplayCard>
  );
}
