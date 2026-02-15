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

function getCapacityPercentage(armor: ArmorItem): number {
  const total = armor.capacity ?? armor.armorRating;
  const used = armor.capacityUsed ?? 0;
  if (total === 0) return 0;
  return Math.min(100, (used / total) * 100);
}

function getCapacityColor(percentage: number): string {
  if (percentage >= 90) return "bg-red-500";
  if (percentage >= 70) return "bg-amber-500";
  return "bg-emerald-500";
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
  const totalCapacity = item.capacity ?? item.armorRating;
  const usedCapacity = item.capacityUsed ?? 0;
  const remaining = totalCapacity - usedCapacity;
  const pct = getCapacityPercentage(item);

  return (
    <div
      data-testid="armor-row"
      className="px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/30 [&+&]:border-t [&+&]:border-zinc-200 dark:[&+&]:border-zinc-800/50"
    >
      {/* Collapsed row: Chevron + Name + Accessory badge + Rating pill */}
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
          {item.name}
        </span>
        {item.armorModifier && (
          <span
            data-testid="accessory-badge"
            className="rounded border border-amber-500/20 bg-amber-500/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-300"
          >
            Accessory
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
            {item.cost != null && (
              <span data-testid="stat-cost">
                Cost{" "}
                <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                  {item.cost.toLocaleString()}&yen;
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

          {/* Capacity bar (non-custom items only) */}
          {!item.isCustom && (
            <div data-testid="capacity-section">
              <div className="mb-1 flex items-baseline justify-between text-[10px]">
                <span className="font-semibold uppercase tracking-wider text-zinc-500">
                  Capacity
                </span>
                <span className="font-mono text-zinc-500 dark:text-zinc-400">
                  {remaining}/{totalCapacity}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  data-testid="capacity-bar"
                  className={`h-full rounded-full transition-all ${getCapacityColor(pct)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
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
                      <span className="font-mono text-zinc-500">R{mod.rating}</span>
                    )}
                    <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                      [{mod.capacityUsed}]
                    </span>
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
    <DisplayCard title="Armor" icon={<Shield className="h-4 w-4 text-zinc-400" />}>
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
