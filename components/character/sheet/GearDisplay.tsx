"use client";

import { DisplayCard } from "./DisplayCard";
import { Package } from "lucide-react";

interface GearItem {
  name: string;
  category: string;
  quantity: number;
  rating?: number;
}

interface GearDisplayProps {
  gear: GearItem[];
}

export function GearDisplay({ gear }: GearDisplayProps) {
  return (
    <DisplayCard title="General Gear" icon={<Package className="h-4 w-4 text-zinc-400" />}>
      {!gear || gear.length === 0 ? (
        <p className="text-sm text-zinc-500 italic">No gear acquired</p>
      ) : (
        <div className="space-y-2">
          {gear.map((item, index) => (
            <div
              key={`gear-${index}`}
              className="flex items-center justify-between py-2 px-3 bg-zinc-50 dark:bg-zinc-800/30 rounded border-l-2 transition-all border-indigo-500/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 group"
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                    {item.name}
                  </span>
                  {item.rating && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-px rounded-sm text-indigo-400 bg-indigo-500/10">
                      R{item.rating}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              {item.quantity > 1 && (
                <span className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                  ×{item.quantity}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </DisplayCard>
  );
}
