"use client";

/**
 * ArmorRow
 *
 * Displays a purchased armor item in collapsed or expanded state.
 * Collapsed: Shows name, armor rating, capacity bar, cost, remove button
 * Expanded: Shows full stats, capacity details, installed modifications
 */

import { useState } from "react";
import type { ArmorItem } from "@/lib/types";
import { ChevronDown, ChevronRight, X, Shield, Plus } from "lucide-react";

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

// =============================================================================
// TYPES
// =============================================================================

interface ArmorRowProps {
  armor: ArmorItem;
  onRemove: (id: string) => void;
  onAddMod?: (armorId: string) => void;
  onRemoveMod?: (armorId: string, modIndex: number) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ArmorRow({ armor, onRemove, onAddMod, onRemoveMod }: ArmorRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const capacity = armor.capacity ?? armor.armorRating;
  const capacityUsed = armor.capacityUsed ?? 0;
  const capacityRemaining = capacity - capacityUsed;
  const capacityPercentage = getCapacityPercentage(armor);

  // Calculate total cost including modifications
  const modCost = armor.modifications?.reduce((sum, m) => sum + m.cost, 0) || 0;
  const totalCost = armor.cost + modCost;

  // Count installed mods
  const modCount = armor.modifications?.length || 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Collapsed Header */}
      <div className="flex w-full items-center gap-3 p-3">
        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-1 items-center gap-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded -m-2 p-2"
        >
          {/* Expand/Collapse Icon */}
          <div className="text-zinc-400">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>

          {/* Armor Name & Quick Stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {armor.name}
              </span>
              {armor.armorModifier && (
                <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-1.5 py-0.5 rounded flex-shrink-0">
                  +{armor.armorRating}
                </span>
              )}
              {modCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 px-1.5 py-0.5 rounded flex-shrink-0">
                  {modCount} mod{modCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                {armor.armorRating}
              </span>
              <span>
                Cap {capacityUsed}/{capacity}
              </span>
              {armor.availability !== undefined && armor.availability > 0 && (
                <span>
                  Avail {armor.availability}
                  {armor.legality === "restricted"
                    ? "R"
                    : armor.legality === "forbidden"
                      ? "F"
                      : ""}
                </span>
              )}
            </div>
          </div>
        </button>

        {/* Cost - outside button for consistent positioning */}
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex-shrink-0">
          {formatCurrency(totalCost)}¥
        </span>

        {/* Separator */}
        <div className="mx-1 h-5 w-px bg-zinc-300 dark:bg-zinc-600 flex-shrink-0" />

        {/* Remove Button (outside expand button) */}
        <button
          onClick={() => {
            if (armor.id) onRemove(armor.id);
          }}
          className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 flex-shrink-0"
          title="Remove armor"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded Detail Flyout */}
      {isExpanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-4 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Armor Rating</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {armor.armorRating}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {armor.availability || 0}
                  {armor.legality === "restricted"
                    ? "R"
                    : armor.legality === "forbidden"
                      ? "F"
                      : ""}
                </span>
              </div>
              {armor.weight && (
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Weight</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {armor.weight} kg
                  </span>
                </div>
              )}
              {armor.armorModifier && (
                <div className="flex justify-between col-span-2">
                  <span className="text-zinc-500 dark:text-zinc-400">Type</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    Accessory (stacks with worn armor)
                  </span>
                </div>
              )}
            </div>

            {/* Capacity Bar */}
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  Modification Capacity
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {capacityUsed} / {capacity} used
                </span>
              </div>
              <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getCapacityColor(capacityPercentage)}`}
                  style={{ width: `${capacityPercentage}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {capacityRemaining} capacity remaining
              </div>
            </div>

            {/* Installed Modifications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Modifications
                </span>
                {onAddMod && capacityRemaining > 0 && (
                  <button
                    onClick={() => armor.id && onAddMod(armor.id)}
                    className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    <Plus className="h-3 w-3" />
                    Add Mod
                  </button>
                )}
              </div>
              {armor.modifications && armor.modifications.length > 0 ? (
                <div className="space-y-1">
                  {armor.modifications.map((mod, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded bg-zinc-50 dark:bg-zinc-800 px-2 py-1.5 text-sm"
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
                        <span className="text-[10px] text-zinc-400">Cap: {mod.capacityUsed}</span>
                        <span className="text-xs text-zinc-500">{formatCurrency(mod.cost)}¥</span>
                        {onRemoveMod && (
                          <button
                            onClick={() => armor.id && onRemoveMod(armor.id, idx)}
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
                <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                  No modifications installed
                </p>
              )}
              {onAddMod && capacityRemaining === 0 && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  No capacity remaining for additional modifications
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
