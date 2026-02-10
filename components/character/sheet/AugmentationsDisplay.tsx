"use client";

import type { Character, CyberwareItem, BiowareItem } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Cpu } from "lucide-react";

interface AugmentationsDisplayProps {
  character: Character;
}

function AugmentationCard({ item }: { item: CyberwareItem | BiowareItem }) {
  const isCyber = "grade" in item && (item as CyberwareItem).grade !== undefined;
  const grade = isCyber ? (item as CyberwareItem).grade : (item as BiowareItem).grade;

  return (
    <div
      className={`p-3 rounded transition-all group border bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 ${
        isCyber ? "border-cyan-500/30" : "border-emerald-500/30"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-bold text-zinc-900 dark:text-zinc-100 transition-colors ${
                isCyber ? "group-hover:text-cyan-500" : "group-hover:text-emerald-500"
              }`}
            >
              {item.name}
            </span>
            <span
              className={`text-[9px] font-mono uppercase tracking-tighter px-1.5 py-0.5 border rounded ${
                isCyber
                  ? "border-cyan-500/30 text-cyan-500 bg-cyan-500/5"
                  : "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
              }`}
            >
              {grade}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono uppercase text-zinc-500 dark:text-zinc-400 opacity-70">
            <span>{item.category}</span>
            {item.rating && <span>Rating: {item.rating}</span>}
          </div>
          {item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {Object.entries(item.attributeBonuses).map(([attr, bonus]) => (
                <span
                  key={attr}
                  className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-emerald-400 rounded"
                >
                  {attr.toUpperCase()} +{bonus}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-mono leading-none mb-1">
            Essence
          </div>
          <div className="text-sm font-mono text-zinc-700 dark:text-zinc-300 font-bold leading-none">
            {(item.essenceCost ?? 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AugmentationsDisplay({ character }: AugmentationsDisplayProps) {
  const hasCyber = (character.cyberware?.length || 0) > 0;
  const hasBio = (character.bioware?.length || 0) > 0;

  if (!hasCyber && !hasBio) return null;

  return (
    <DisplayCard title="Augmentations" icon={<Cpu className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-4">
        {hasCyber && (
          <div>
            <span className="text-xs font-mono text-cyan-500 uppercase mb-2 block">Cyberware</span>
            <div className="space-y-3">
              {character.cyberware!.map((item, idx) => (
                <AugmentationCard key={`cyber-${idx}`} item={item} />
              ))}
            </div>
          </div>
        )}
        {hasBio && (
          <div>
            <span className="text-xs font-mono text-emerald-500 uppercase mb-2 block">Bioware</span>
            <div className="space-y-3">
              {character.bioware!.map((item, idx) => (
                <AugmentationCard key={`bio-${idx}`} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DisplayCard>
  );
}
