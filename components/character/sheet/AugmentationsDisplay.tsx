"use client";

import { useState } from "react";
import type { Character, CyberwareItem, BiowareItem } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Cpu, Dna } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = VARIANT_COLORS[variant];

  return (
    <div
      data-testid="augmentation-row"
      className="px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name + Rating */}
      <div className="flex min-w-0 items-center gap-1.5">
        <button
          data-testid="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {item.name.replace(/\s*\(Rating \d+\)/, "")}
        </span>
        {item.rating != null && (
          <span
            data-testid="rating-pill"
            className="font-mono text-xs text-zinc-500 dark:text-zinc-500"
          >
            {item.rating}
          </span>
        )}
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          className="ml-5 mt-2 space-y-1.5 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Essence cost */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Essence:{" "}
            <span
              data-testid="essence-pill"
              className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold ${colors.pill}`}
            >
              {(item.essenceCost ?? 0).toFixed(2)}
            </span>
          </div>

          {/* Grade */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Grade:{" "}
            <span
              data-testid="grade-pill"
              className={`rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${colors.pill}`}
            >
              {item.grade}
            </span>
          </div>

          {/* Category */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Category:{" "}
            <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
              {item.category.replace(/-/g, " ")}
            </span>
          </div>

          {/* Attribute bonuses (conditional) */}
          {item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
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

          {/* Notes (conditional) */}
          {item.notes && (
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{item.notes}</p>
          )}
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
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
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
