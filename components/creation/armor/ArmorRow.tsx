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
import { LegalityBadge } from "@/components/creation/shared/LegalityBadge";
import { ChevronDown, ChevronRight, X, Plus, Shirt } from "lucide-react";

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
    <div>
      {/* Ultra-Compact Header: Name + Cost only */}
      <div className="flex items-center gap-2 py-1.5">
        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Name */}
        <span
          className="flex-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100"
          title={armor.name}
        >
          {armor.isCustom && (
            <Shirt className="inline-block h-3.5 w-3.5 mr-1 text-amber-500 dark:text-amber-400" />
          )}
          {armor.name}
          {modCount > 0 && (
            <span className="ml-1.5 text-[10px] font-normal text-amber-600 dark:text-amber-400">
              +{modCount} mod{modCount !== 1 ? "s" : ""}
            </span>
          )}
        </span>

        <LegalityBadge legality={armor.legality} availability={armor.availability} />

        {/* Cost */}
        <span className="shrink-0 font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
          ¥{formatCurrency(totalCost)}
        </span>

        {/* Separator */}
        <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600 shrink-0" />

        {/* Remove Button */}
        <button
          onClick={() => {
            if (armor.id) onRemove(armor.id);
          }}
          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          title="Remove armor"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="ml-6 mb-2 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
          {/* Custom Clothing Notice */}
          {armor.isCustom && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 mb-2">
              <Shirt className="h-3.5 w-3.5" />
              <span>Custom clothing item</span>
            </div>
          )}

          {/* Stats Row - compact inline */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400 mb-2">
            <span>
              <span className="text-zinc-400 dark:text-zinc-500">Rating</span>{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {armor.armorRating}
              </span>
            </span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span>
              <span className="text-zinc-400 dark:text-zinc-500">Avail</span>{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {armor.availability || 0}
                {armor.legality === "restricted" ? "R" : armor.legality === "forbidden" ? "F" : ""}
              </span>
            </span>
            {!armor.isCustom && (
              <>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span>
                  <span className="text-zinc-400 dark:text-zinc-500">Capacity</span>{" "}
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {capacityUsed}/{capacity}
                  </span>
                </span>
              </>
            )}
            {armor.weight && (
              <>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span>
                  <span className="text-zinc-400 dark:text-zinc-500">Weight</span>{" "}
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {armor.weight}kg
                  </span>
                </span>
              </>
            )}
            {armor.armorModifier && (
              <>
                <span className="text-zinc-300 dark:text-zinc-600">•</span>
                <span className="text-blue-600 dark:text-blue-400">Accessory</span>
              </>
            )}
          </div>

          {/* Capacity Bar & Modifications - only for non-custom items */}
          {!armor.isCustom && (
            <>
              {/* Capacity Bar - compact */}
              <div className="mb-3">
                <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getCapacityColor(capacityPercentage)}`}
                    style={{ width: `${capacityPercentage}%` }}
                  />
                </div>
                <div className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                  {capacityRemaining} capacity remaining
                </div>
              </div>

              {/* Modifications Section */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Modifications
                </span>
                {onAddMod && capacityRemaining > 0 && (
                  <button
                    onClick={() => armor.id && onAddMod(armor.id)}
                    className="flex items-center gap-0.5 text-[10px] text-amber-600 hover:text-amber-700 dark:text-amber-400"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                )}
              </div>
              {armor.modifications && armor.modifications.length > 0 ? (
                <div className="space-y-1">
                  {armor.modifications.map((mod, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {mod.name}
                        {mod.rating && <span className="ml-1 text-zinc-400">(R{mod.rating})</span>}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-400">[{mod.capacityUsed}]</span>
                        <span className="text-zinc-500">¥{formatCurrency(mod.cost)}</span>
                        {onRemoveMod && (
                          <button
                            onClick={() => armor.id && onRemoveMod(armor.id, idx)}
                            className="rounded p-0.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic">
                  No modifications installed
                </p>
              )}
              {onAddMod && capacityRemaining === 0 && (
                <p className="mt-1.5 text-[10px] text-amber-600 dark:text-amber-400">
                  No capacity remaining
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
