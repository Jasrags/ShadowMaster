"use client";

import type { ArmorItem } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Shield } from "lucide-react";

interface ArmorDisplayProps {
  armor: ArmorItem[];
}

export function ArmorDisplay({ armor }: ArmorDisplayProps) {
  if (armor.length === 0) return null;

  return (
    <DisplayCard title="Armor" icon={<Shield className="h-4 w-4 text-zinc-400" />}>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700/50">
              <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px]">
                Name
              </th>
              <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-center">
                Rating
              </th>
              <th className="py-2 px-1 font-bold text-zinc-500 dark:text-zinc-400 uppercase text-[10px] text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {armor.map((a, idx) => (
              <tr
                key={`${a.name}-${idx}`}
                className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/10 transition-colors"
              >
                <td className="py-2 px-1">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{a.name}</span>
                </td>
                <td className="py-2 px-1 text-center">
                  <span className="text-blue-400 font-bold">{a.armorRating}</span>
                </td>
                <td className="py-2 px-1 text-right">
                  {a.equipped ? (
                    <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1 py-0.5 rounded uppercase font-bold">
                      Equipped
                    </span>
                  ) : (
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase">
                      Stored
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DisplayCard>
  );
}
