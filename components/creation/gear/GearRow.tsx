"use client";

/**
 * GearRow
 *
 * Compact two-line display for purchased gear items.
 * Line 1: Name, badges (rating, quantity, mods), cost, remove
 * Line 2: Category • Availability • Capacity (if applicable)
 * Expandable for full stats and modification management.
 */

import { useState } from "react";
import type { GearItem } from "@/lib/types";
import { ChevronDown, ChevronRight, X, Plus } from "lucide-react";

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getCategoryDisplay(category: string): string {
  return category
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// =============================================================================
// TYPES
// =============================================================================

interface GearRowProps {
  gear: GearItem;
  onRemove: (id: string) => void;
  onAddMod?: (gearId: string) => void;
  onRemoveMod?: (gearId: string, modIndex: number) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GearRow({ gear, onRemove, onAddMod, onRemoveMod }: GearRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate total cost including modifications
  // Note: gear.cost is cost per unit, gear.quantity is total units owned
  const modCost = gear.modifications?.reduce((sum, m) => sum + m.cost, 0) || 0;
  const totalCost = gear.cost * gear.quantity + modCost;

  // Capacity tracking
  const hasCapacity = gear.capacity !== undefined && gear.capacity > 0;
  const capacityUsed = gear.capacityUsed || 0;
  const capacityRemaining = hasCapacity ? gear.capacity! - capacityUsed : 0;

  // Count installed mods
  const modCount = gear.modifications?.length || 0;

  // Check if expandable (has capacity for mods or has mods installed)
  const hasExpandableContent = hasCapacity || modCount > 0 || gear.notes;

  return (
    <div className="py-1.5">
      {/* Line 1: Name and controls */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          {/* Expand/Collapse */}
          {hasExpandableContent ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          ) : (
            <div className="w-3.5 shrink-0" />
          )}

          <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {gear.name}
          </span>

          {gear.rating && (
            <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              R{gear.rating}
            </span>
          )}
          {gear.quantity > 1 && (
            <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              x{gear.quantity}
            </span>
          )}
          {modCount > 0 && (
            <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {modCount} mod{modCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(totalCost)}¥
          </span>
          {/* Separator */}
          <div className="mx-2 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
          <button
            onClick={() => gear.id && onRemove(gear.id)}
            className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            title="Remove gear"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Line 2: Category, availability, capacity */}
      <div className="ml-5 mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
        {getCategoryDisplay(gear.category)}
        {gear.availability !== undefined &&
          gear.availability > 0 &&
          ` • Avail ${gear.availability}`}
        {hasCapacity && ` • Cap ${capacityUsed}/${gear.capacity}`}
      </div>

      {/* Expanded Details */}
      {isExpanded && hasExpandableContent && (
        <div className="ml-5 mt-2 space-y-3 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {gear.rating && (
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Rating</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{gear.rating}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {gear.availability || 0}
              </span>
            </div>
            {gear.quantity > 1 && (
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Quantity</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {gear.quantity}
                </span>
              </div>
            )}
            {gear.weight && (
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Weight</span>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {gear.weight} kg
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">Base Cost</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {formatCurrency(gear.cost)}¥
              </span>
            </div>
          </div>

          {/* Capacity (if applicable) */}
          {hasCapacity && (
            <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/50">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Modification Capacity
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {capacityUsed} / {gear.capacity} used
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${Math.min(100, (capacityUsed / gear.capacity!) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Installed Modifications */}
          {hasCapacity && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Modifications
                </span>
                {onAddMod && capacityRemaining > 0 && (
                  <button
                    onClick={() => gear.id && onAddMod(gear.id)}
                    className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    <Plus className="h-3 w-3" />
                    Add Mod
                  </button>
                )}
              </div>
              {gear.modifications && gear.modifications.length > 0 ? (
                <div className="space-y-1">
                  {gear.modifications.map((mod, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1 text-xs dark:bg-zinc-800"
                    >
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {mod.name}
                        {mod.rating && <span className="ml-1 text-zinc-400">(R{mod.rating})</span>}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-400">Cap: {mod.capacityUsed}</span>
                        <span className="text-zinc-500">{formatCurrency(mod.cost)}¥</span>
                        {onRemoveMod && (
                          <button
                            onClick={() => gear.id && onRemoveMod(gear.id, idx)}
                            className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  No modifications installed
                </p>
              )}
              {onAddMod && capacityRemaining === 0 && (
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  No capacity remaining
                </p>
              )}
            </div>
          )}

          {/* Notes (if any) */}
          {gear.notes && (
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Notes
              </span>
              <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">{gear.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
