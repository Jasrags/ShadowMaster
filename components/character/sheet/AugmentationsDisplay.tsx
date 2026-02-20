"use client";

import { useState } from "react";
import type { Character, CyberwareItem, BiowareItem } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Cpu } from "lucide-react";

// ---------------------------------------------------------------------------
// Section & variant configuration
// ---------------------------------------------------------------------------

const AUGMENTATION_SECTIONS = [
  { key: "cyber" as const, label: "Cyberware" },
  { key: "bio" as const, label: "Bioware" },
];

// ---------------------------------------------------------------------------
// AugmentationRow
// ---------------------------------------------------------------------------

function AugmentationRow({ item }: { item: CyberwareItem | BiowareItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      data-testid="augmentation-row"
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name + Rating */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
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
          onClick={(e) => e.stopPropagation()}
          className="ml-5 mt-2 space-y-1.5 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
        >
          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span data-testid="stat-essence">
              Essence{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {(item.essenceCost ?? 0).toFixed(2)}
              </span>
            </span>
            <span data-testid="stat-grade">
              Grade{" "}
              <span className="font-mono font-semibold capitalize text-zinc-700 dark:text-zinc-300">
                {item.grade}
              </span>
            </span>
            <span data-testid="stat-category">
              Category{" "}
              <span className="font-medium capitalize text-zinc-700 dark:text-zinc-300">
                {item.category.replace(/-/g, " ")}
              </span>
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
    <DisplayCard
      id="sheet-augmentations"
      title="Augmentations"
      icon={<Cpu className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <div className="space-y-3">
        {AUGMENTATION_SECTIONS.map(({ key, label }) => {
          if (items[key].length === 0) return null;
          return (
            <div key={key}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {items[key].map((item, idx) => (
                  <AugmentationRow key={`${key}-${idx}`} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
