"use client";

import { DisplayCard } from "./DisplayCard";
import { Pill } from "lucide-react";

interface DrugItem {
  name: string;
  quantity?: number;
  rating?: number;
}

interface DrugsDisplayProps {
  drugs: DrugItem[];
}

export function DrugsDisplay({ drugs }: DrugsDisplayProps) {
  if (drugs.length === 0) return null;

  return (
    <DisplayCard title="Drugs & Toxins" icon={<Pill className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-2">
        {drugs.map((drug, idx) => (
          <div
            key={`drug-${idx}`}
            className="flex items-center justify-between py-2 px-3 bg-zinc-50 dark:bg-zinc-800/30 rounded border-l-2 border-amber-500/40"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {drug.name}
              </span>
              {drug.rating && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-px rounded-sm text-amber-400 bg-amber-500/10">
                  R{drug.rating}
                </span>
              )}
            </div>
            {drug.quantity && drug.quantity > 1 && (
              <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                ×{drug.quantity}
              </span>
            )}
          </div>
        ))}
      </div>
    </DisplayCard>
  );
}
