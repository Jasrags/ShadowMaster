"use client";

import { useState } from "react";
import type { ArmorItem } from "@/lib/types";
import { DisplayCard } from "./DisplayCard";
import { ChevronDown, ChevronRight, Shield } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isWorn(a: ArmorItem): boolean {
  return a.state?.readiness === "worn" || (!a.state && a.equipped);
}

function formatLegality(legality: string): string {
  if (legality === "restricted") return "R";
  if (legality === "forbidden") return "F";
  return "";
}

// ---------------------------------------------------------------------------
// Section config
// ---------------------------------------------------------------------------

const ARMOR_SECTIONS = [
  { key: "worn" as const, label: "Worn" },
  { key: "stored" as const, label: "Stored" },
];

// ---------------------------------------------------------------------------
// ArmorRow
// ---------------------------------------------------------------------------

function ArmorRow({ item }: { item: ArmorItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      data-testid="armor-row"
      className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Collapsed row: Chevron + Name + Accessory badge + Rating pill */}
      <div className="flex min-w-0 items-center gap-1.5">
        <span data-testid="expand-button" className="shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
          {item.name}
        </span>
        {item.subcategory && (
          <span
            data-testid="subcategory-label"
            className="truncate text-[10px] text-zinc-400 dark:text-zinc-500"
          >
            ({item.subcategory.charAt(0).toUpperCase() + item.subcategory.slice(1)})
          </span>
        )}
        <span
          data-testid="rating-pill"
          className="ml-auto shrink-0 rounded border border-sky-500/20 bg-sky-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-sky-600 dark:text-sky-300"
        >
          {item.armorRating}
        </span>
      </div>

      {/* Expanded section */}
      {isExpanded && (
        <div
          data-testid="expanded-content"
          className="ml-5 mt-2 space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Stats row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
            {item.availability != null && (
              <span data-testid="stat-availability">
                Avail{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.availability}
                  {item.legality ? formatLegality(item.legality) : ""}
                </span>
              </span>
            )}
            {item.weight != null && (
              <span data-testid="stat-weight">
                Weight{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.weight}kg
                </span>
              </span>
            )}
          </div>

          {/* Capacity (non-custom items only) */}
          {!item.isCustom && (
            <div
              data-testid="capacity-section"
              className="text-xs text-zinc-500 dark:text-zinc-400"
            >
              Capacity{" "}
              <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                {item.capacityUsed ?? 0}/{item.capacity ?? item.armorRating}
              </span>
            </div>
          )}

          {/* Modifications */}
          {item.modifications && item.modifications.length > 0 && (
            <div data-testid="modifications-section">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Modifications
              </div>
              <div className="space-y-0.5">
                {item.modifications.map((mod, idx) => (
                  <div
                    key={`${mod.catalogId}-${idx}`}
                    data-testid="mod-row"
                    className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{mod.name}</span>
                    {mod.rating != null && (
                      <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-500">
                        {mod.rating}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ArmorDisplay
// ---------------------------------------------------------------------------

interface ArmorDisplayProps {
  armor: ArmorItem[];
}

export function ArmorDisplay({ armor }: ArmorDisplayProps) {
  if (armor.length === 0) return null;

  const grouped: Record<"worn" | "stored", ArmorItem[]> = {
    worn: armor.filter(isWorn),
    stored: armor.filter((a) => !isWorn(a)),
  };

  return (
    <DisplayCard
      id="sheet-armor"
      title="Armor"
      icon={<Shield className="h-4 w-4 text-zinc-400" />}
      collapsible
    >
      <div className="space-y-3">
        {ARMOR_SECTIONS.map(({ key, label }) => {
          if (grouped[key].length === 0) return null;
          return (
            <div key={key}>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </div>
              <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                {grouped[key].map((item, idx) => (
                  <ArmorRow key={`${item.name}-${idx}`} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DisplayCard>
  );
}
