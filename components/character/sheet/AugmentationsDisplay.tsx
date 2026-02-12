"use client";

import type { Character, CyberwareItem, BiowareItem } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { Cpu, Dna } from "lucide-react";

// ---------------------------------------------------------------------------
// Section & variant configuration
// ---------------------------------------------------------------------------

const AUGMENTATION_SECTIONS = [
  { key: "cyber" as const, label: "Cyberware", icon: Cpu, iconColor: "text-cyan-400" },
  { key: "bio" as const, label: "Bioware", icon: Dna, iconColor: "text-emerald-400" },
];

const VARIANT_COLORS = {
  cyber: {
    pill: "bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-400/12 dark:border-cyan-400/20 dark:text-cyan-300",
  },
  bio: {
    pill: "border border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
  },
};

// ---------------------------------------------------------------------------
// AugmentationRow
// ---------------------------------------------------------------------------

function AugmentationRow({
  item,
  variant,
}: {
  item: CyberwareItem | BiowareItem;
  variant: "cyber" | "bio";
}) {
  const colors = VARIANT_COLORS[variant];

  return (
    <div
      data-testid="augmentation-row"
      className="rounded px-1 py-[7px] transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Line 1: Name + grade pill ... essence pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
            {item.name}
          </span>
          <span
            data-testid="grade-pill"
            className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${colors.pill}`}
          >
            {item.grade}
          </span>
        </div>
        <span
          data-testid="essence-pill"
          className={`flex h-7 w-12 items-center justify-center rounded-md border font-mono text-sm font-bold ${colors.pill}`}
        >
          {(item.essenceCost ?? 0).toFixed(2)}
        </span>
      </div>

      {/* Line 2: Category + optional rating */}
      <div className="ml-0.5 mt-0.5 text-xs capitalize text-zinc-500 dark:text-zinc-400">
        {item.category.replace(/-/g, " ")}
        {item.rating != null && (
          <span className="text-zinc-400 dark:text-zinc-500"> &bull; Rating {item.rating}</span>
        )}
      </div>

      {/* Line 3: Attribute bonuses (conditional) */}
      {item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {Object.entries(item.attributeBonuses).map(([attr, bonus]) => (
            <span
              key={attr}
              data-testid="bonus-pill"
              className="inline-flex rounded-full bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            >
              {attr.toUpperCase()} +{bonus}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AugmentationsDisplay
// ---------------------------------------------------------------------------

interface AugmentationsDisplayProps {
  character: Character;
}

export function AugmentationsDisplay({ character }: AugmentationsDisplayProps) {
  const hasCyber = (character.cyberware?.length || 0) > 0;
  const hasBio = (character.bioware?.length || 0) > 0;

  if (!hasCyber && !hasBio) return null;

  const items: Record<"cyber" | "bio", (CyberwareItem | BiowareItem)[]> = {
    cyber: hasCyber
      ? [...character.cyberware!].sort((a, b) => (b.essenceCost ?? 0) - (a.essenceCost ?? 0))
      : [],
    bio: hasBio
      ? [...character.bioware!].sort((a, b) => (b.essenceCost ?? 0) - (a.essenceCost ?? 0))
      : [],
  };

  return (
    <DisplayCard title="Augmentations" icon={<Cpu className="h-4 w-4 text-zinc-400" />}>
      <div className="space-y-3">
        {AUGMENTATION_SECTIONS.map(({ key, label, icon: Icon, iconColor }) => {
          if (items[key].length === 0) return null;
          return (
            <div key={key}>
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                <Icon className={`h-3 w-3 ${iconColor}`} />
                {label}
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-950">
                {items[key].map((item, idx) => (
                  <AugmentationRow key={`${key}-${idx}`} item={item} variant={key} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
