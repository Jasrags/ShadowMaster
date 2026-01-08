"use client";

/**
 * GearRow
 *
 * Displays a purchased gear item in collapsed or expanded state.
 * Collapsed: Shows name, category, rating (if any), cost, remove button
 * Expanded: Shows full stats, description, capacity details if applicable
 */

import { useState } from "react";
import type { GearItem } from "@/lib/types";
import { ChevronDown, ChevronRight, X, Backpack, Plus } from "lucide-react";

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
  // Capitalize first letter of each word
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

export function GearRow({
  gear,
  onRemove,
  onAddMod,
  onRemoveMod,
}: GearRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate total cost including modifications
  const modCost =
    gear.modifications?.reduce((sum, m) => sum + m.cost, 0) || 0;
  const totalCost = gear.cost + modCost;

  // Capacity tracking
  const hasCapacity = gear.capacity !== undefined && gear.capacity > 0;
  const capacityUsed = gear.capacityUsed || 0;
  const capacityRemaining = hasCapacity ? gear.capacity! - capacityUsed : 0;

  // Count installed mods
  const modCount = gear.modifications?.length || 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Collapsed Header */}
      <div className="flex w-full items-center gap-3 p-3">
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="-m-2 flex flex-1 items-center gap-3 rounded p-2 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        >
          {/* Expand/Collapse Icon */}
          <div className="text-zinc-400">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>

          {/* Gear Name & Quick Stats */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                {gear.name}
              </span>
              {gear.rating && (
                <span className="flex-shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  R{gear.rating}
                </span>
              )}
              {gear.quantity > 1 && (
                <span className="flex-shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  x{gear.quantity}
                </span>
              )}
              {modCount > 0 && (
                <span className="flex-shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  {modCount} mod{modCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Backpack className="h-3 w-3" />
                {getCategoryDisplay(gear.category)}
              </span>
              {hasCapacity && (
                <span>Cap {capacityUsed}/{gear.capacity}</span>
              )}
              {gear.availability !== undefined && gear.availability > 0 && (
                <span>Avail {gear.availability}</span>
              )}
            </div>
          </div>
        </button>

        {/* Cost - outside button for consistent positioning */}
        <span className="flex-shrink-0 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {formatCurrency(totalCost)}¥
        </span>

        {/* Remove Button */}
        <button
          onClick={() => {
            if (gear.id) onRemove(gear.id);
          }}
          className="flex-shrink-0 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded Detail Flyout */}
      {isExpanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="space-y-4 p-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Category
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {getCategoryDisplay(gear.category)}
                </span>
              </div>
              {gear.rating && (
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Rating
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {gear.rating}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Availability
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {gear.availability || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Quantity
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {gear.quantity}
                </span>
              </div>
              {gear.weight && (
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Weight
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {gear.weight} kg
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Base Cost
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(gear.cost)}¥
                </span>
              </div>
            </div>

            {/* Capacity (if applicable) */}
            {hasCapacity && (
              <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Modification Capacity
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {capacityUsed} / {gear.capacity} used
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${Math.min(100, (capacityUsed / gear.capacity!) * 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {capacityRemaining} capacity remaining
                </div>
              </div>
            )}

            {/* Installed Modifications */}
            {hasCapacity && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
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
                        className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1.5 text-sm dark:bg-zinc-800"
                      >
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {mod.name}
                          {mod.rating && (
                            <span className="ml-1.5 text-xs text-zinc-400">
                              (Rating {mod.rating})
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-400">
                            Cap: {mod.capacityUsed}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {formatCurrency(mod.cost)}¥
                          </span>
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
                  <p className="text-xs italic text-zinc-400 dark:text-zinc-500">
                    No modifications installed
                  </p>
                )}
                {onAddMod && capacityRemaining === 0 && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                    No capacity remaining for additional modifications
                  </p>
                )}
              </div>
            )}

            {/* Notes (if any) */}
            {gear.notes && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Notes
                </span>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {gear.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
