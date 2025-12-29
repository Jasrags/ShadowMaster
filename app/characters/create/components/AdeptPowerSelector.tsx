"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, Flame, Plus, Minus } from "lucide-react";
import type { AdeptPowerCatalogItem } from "@/lib/rules/loader-types";

// =============================================================================
// TYPES
// =============================================================================

export interface SelectedAdeptPower {
  id: string;
  level: number;
  specification?: string;
}

export interface AdeptPowerSelectorProps {
  /** Available adept powers catalog */
  powers: AdeptPowerCatalogItem[];
  /** Total Power Points available */
  powerPointBudget: number;
  /** Currently selected powers with levels */
  selectedPowers: SelectedAdeptPower[];
  /** Callback when selection changes */
  onPowersChange: (powers: SelectedAdeptPower[]) => void;
  /** Whether the selector is in readonly mode */
  readonly?: boolean;
}

// =============================================================================
// POWER CARD
// =============================================================================

function PowerCard({
  power,
  selectedPower,
  onAdd,
  onRemove,
  onLevelChange,
  disabled,
  readonly,
}: {
  power: AdeptPowerCatalogItem;
  selectedPower?: SelectedAdeptPower;
  onAdd: () => void;
  onRemove: () => void;
  onLevelChange: (level: number) => void;
  disabled: boolean;
  readonly: boolean;
}) {
  const isSelected = !!selectedPower;
  const currentLevel = selectedPower?.level ?? 1;
  const isLeveled = power.costType === "perLevel";
  const maxLvl = power.maxLevel ?? 6;
  const baseCost = power.cost ?? 0;

  // Calculate effective cost
  const effectiveCost = isLeveled
    ? (baseCost * currentLevel).toFixed(2)
    : baseCost.toFixed(2);

  return (
    <div
      className={`rounded-lg border-2 p-3 transition-all ${
        isSelected
          ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/30"
          : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
            {power.name}
          </h4>
          <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              {effectiveCost} PP
            </span>
            {power.activation && (
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                {power.activation}
              </span>
            )}
            {isLeveled && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Leveled (max {maxLvl})
              </span>
            )}
          </div>
        </div>
        
        {!readonly && (
          <div className="flex items-center gap-1">
            {isSelected ? (
              <>
                {isLeveled && (
                  <div className="flex items-center gap-1 mr-2">
                    <button
                      onClick={() => currentLevel > 1 && onLevelChange(currentLevel - 1)}
                      disabled={currentLevel <= 1}
                      className="flex h-6 w-6 items-center justify-center rounded bg-zinc-200 text-zinc-600 hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-300"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {currentLevel}
                    </span>
                    <button
                      onClick={() => currentLevel < maxLvl && onLevelChange(currentLevel + 1)}
                      disabled={currentLevel >= maxLvl || disabled}
                      className="flex h-6 w-6 items-center justify-center rounded bg-zinc-200 text-zinc-600 hover:bg-zinc-300 disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-300"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={onRemove}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={onAdd}
                disabled={disabled}
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  disabled
                    ? "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                    : "bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                }`}
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {power.description && (
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {power.description}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// ADEPT POWER SELECTOR
// =============================================================================

export function AdeptPowerSelector({
  powers,
  powerPointBudget,
  selectedPowers,
  onPowersChange,
  readonly = false,
}: AdeptPowerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate spent Power Points
  const spentPP = useMemo(() => {
    return selectedPowers.reduce((total, selected) => {
      const power = powers.find((p) => p.id === selected.id);
      if (!power) return total;
      const cost = power.cost ?? 0;
      return total + cost * selected.level;
    }, 0);
  }, [selectedPowers, powers]);

  const remainingPP = powerPointBudget - spentPP;

  // Filter powers by search
  const filteredPowers = useMemo(() => {
    if (!searchQuery) return powers;
    const query = searchQuery.toLowerCase();
    return powers.filter(
      (power) =>
        power.name.toLowerCase().includes(query) ||
        power.description?.toLowerCase().includes(query)
    );
  }, [powers, searchQuery]);

  // Handlers
  const handleAddPower = useCallback(
    (powerId: string) => {
      if (readonly) return;
      const power = powers.find((p) => p.id === powerId);
      if (!power) return;

      // Check if we can afford it
      const cost = power.cost ?? 0;
      if (cost > remainingPP) return;

      onPowersChange([...selectedPowers, { id: powerId, level: 1 }]);
    },
    [powers, selectedPowers, onPowersChange, remainingPP, readonly]
  );

  const handleRemovePower = useCallback(
    (powerId: string) => {
      if (readonly) return;
      onPowersChange(selectedPowers.filter((p) => p.id !== powerId));
    },
    [selectedPowers, onPowersChange, readonly]
  );

  const handleLevelChange = useCallback(
    (powerId: string, newLevel: number) => {
      if (readonly) return;
      const power = powers.find((p) => p.id === powerId);
      if (!power) return;

      const currentSelected = selectedPowers.find((p) => p.id === powerId);
      if (!currentSelected) return;

      // Calculate the PP difference
      const ppCost = power.cost ?? 0;
      const currentPP = ppCost * currentSelected.level;
      const newPP = ppCost * newLevel;
      const ppChange = newPP - currentPP;

      // Check if we can afford the increase
      if (ppChange > remainingPP) return;

      onPowersChange(
        selectedPowers.map((p) =>
          p.id === powerId ? { ...p, level: newLevel } : p
        )
      );
    },
    [powers, selectedPowers, onPowersChange, remainingPP, readonly]
  );

  if (powers.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-zinc-500 dark:text-zinc-400">No adept powers available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with budget */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500" />
          Adept Powers
        </h3>
        <div className={`rounded-full px-3 py-1 text-sm font-medium ${
          remainingPP > 0
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
            : remainingPP === 0
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
        }`}>
          {spentPP.toFixed(1)} / {powerPointBudget.toFixed(1)} PP
        </div>
      </div>

      {/* Power Point bar */}
      <div className="space-y-1">
        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className={`h-full transition-all ${
              remainingPP >= 0 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${Math.min(100, (spentPP / powerPointBudget) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {remainingPP >= 0 
            ? `${remainingPP.toFixed(2)} Power Points remaining`
            : `Over budget by ${Math.abs(remainingPP).toFixed(2)} PP`}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search powers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {/* Powers list */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredPowers.map((power) => {
          const selectedPower = selectedPowers.find((p) => p.id === power.id);
          const canAfford = (power.cost ?? 0) <= remainingPP;

          return (
            <PowerCard
              key={power.id}
              power={power}
              selectedPower={selectedPower}
              onAdd={() => handleAddPower(power.id)}
              onRemove={() => handleRemovePower(power.id)}
              onLevelChange={(level) => handleLevelChange(power.id, level)}
              disabled={!canAfford}
              readonly={readonly}
            />
          );
        })}
        {filteredPowers.length === 0 && (
          <div className="col-span-2 py-8 text-center text-zinc-500 dark:text-zinc-400">
            No powers match your search
          </div>
        )}
      </div>

      {/* Selected powers summary */}
      {selectedPowers.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Active Powers ({selectedPowers.length}):
          </p>
          <div className="mt-2 space-y-1">
            {selectedPowers.map((selected) => {
              const power = powers.find((p) => p.id === selected.id);
              if (!power) return null;
              const powerCost = power.cost ?? 0;
              const cost = powerCost * selected.level;
              return (
                <div
                  key={selected.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-amber-700 dark:text-amber-300">
                    {power.name}
                    {power.costType === "perLevel" && ` (Level ${selected.level})`}
                  </span>
                  <span className="font-medium text-amber-800 dark:text-amber-200">
                    {cost.toFixed(2)} PP
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
