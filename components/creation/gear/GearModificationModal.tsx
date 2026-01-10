"use client";

/**
 * GearModificationModal
 *
 * Modal for adding modifications to gear items with capacity.
 * Filters mods by applicable categories (audio-devices, helmets, etc.)
 * Shows capacity usage with visual progress bar.
 */

import { useState, useMemo } from "react";
import {
  useGearModifications,
  type GearModificationCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { GearItem, ItemLegality } from "@/lib/types";
import { BaseModalRoot } from "@/components/ui";
import { Search, AlertTriangle, Backpack, Minus, Plus, X } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

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

function getAvailabilityDisplay(availability: number, legality?: ItemLegality): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

/**
 * Calculate the capacity cost for a mod, optionally with rating
 */
function getModCapacityCost(mod: GearModificationCatalogItemData, rating?: number): number {
  if (mod.capacityPerRating && rating) {
    return mod.capacityCost * rating;
  }
  return mod.capacityCost;
}

/**
 * Calculate the cost for a mod, optionally with rating
 */
function getModCost(mod: GearModificationCatalogItemData, rating?: number): number {
  if (mod.costPerRating && rating) {
    return mod.cost * rating;
  }
  return mod.cost;
}

function getCapacityColor(percentage: number): string {
  if (percentage >= 90) return "bg-red-500";
  if (percentage >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}

/**
 * Check if mod is applicable to this gear item's category
 */
function isModApplicable(mod: GearModificationCatalogItemData, gearCategory: string): boolean {
  // If no applicableCategories, mod applies to nothing specific
  if (!mod.applicableCategories || mod.applicableCategories.length === 0) {
    return true;
  }
  // Check if gear category matches any applicable category
  return mod.applicableCategories.some(
    (cat) =>
      gearCategory.toLowerCase().includes(cat.toLowerCase()) ||
      cat.toLowerCase().includes(gearCategory.toLowerCase())
  );
}

// =============================================================================
// TYPES
// =============================================================================

interface GearModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  gear: GearItem;
  remaining: number;
  onInstall: (mod: GearModificationCatalogItemData, rating?: number) => void;
}

// =============================================================================
// MOD LIST ITEM
// =============================================================================

function ModListItem({
  mod,
  isSelected,
  canFit,
  canAfford,
  capacityCost,
  onClick,
}: {
  mod: GearModificationCatalogItemData;
  isSelected: boolean;
  canFit: boolean;
  canAfford: boolean;
  capacityCost: number;
  onClick: () => void;
}) {
  const isDisabled = !canFit || !canAfford;
  const hasRating = mod.hasRating;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isSelected
          ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30"
          : !isDisabled
            ? "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
            : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {mod.name}
            </span>
            {hasRating && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                R1-{mod.maxRating || 6}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Cap: {capacityCost}</span>
            {!canFit && <span className="text-red-500">Exceeds capacity</span>}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(mod.cost)}¥{mod.costPerRating && "/R"}
          </div>
          <div className="text-xs text-zinc-500">
            {getAvailabilityDisplay(mod.availability, mod.legality)}
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GearModificationModal({
  isOpen,
  onClose,
  gear,
  remaining,
  onInstall,
}: GearModificationModalProps) {
  const allMods = useGearModifications({ maxAvailability: MAX_AVAILABILITY });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMod, setSelectedMod] = useState<GearModificationCatalogItemData | null>(null);
  const [selectedRating, setSelectedRating] = useState(1);

  // Calculate capacity
  const totalCapacity = gear.capacity || 0;
  const usedCapacity = gear.capacityUsed || 0;
  const remainingCapacity = totalCapacity - usedCapacity;
  const capacityPercentage = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;

  // Filter mods by applicable categories
  const applicableMods = useMemo(() => {
    return allMods.filter((mod) => isModApplicable(mod, gear.category));
  }, [allMods, gear.category]);

  // Filter mods by search and check if they fit
  const modsWithFitInfo = useMemo(() => {
    return applicableMods.map((mod) => {
      const capacityCost = getModCapacityCost(mod, 1);
      const canFit = capacityCost <= remainingCapacity;
      return { mod, capacityCost, canFit };
    });
  }, [applicableMods, remainingCapacity]);

  // Filter by search
  const filteredMods = useMemo(() => {
    if (!searchQuery) return modsWithFitInfo;
    const query = searchQuery.toLowerCase();
    return modsWithFitInfo.filter((item) => item.mod.name.toLowerCase().includes(query));
  }, [modsWithFitInfo, searchQuery]);

  // Sort: fitting first, then by name
  const sortedMods = useMemo(() => {
    return [...filteredMods].sort((a, b) => {
      if (a.canFit && !b.canFit) return -1;
      if (!a.canFit && b.canFit) return 1;
      return a.mod.name.localeCompare(b.mod.name);
    });
  }, [filteredMods]);

  // Get rating bounds for selected mod
  const ratingBounds = useMemo(() => {
    if (!selectedMod) return { min: 1, max: 1, hasRating: false };
    if (selectedMod.hasRating) {
      return {
        min: 1,
        max: selectedMod.maxRating || 6,
        hasRating: true,
      };
    }
    return { min: 1, max: 1, hasRating: false };
  }, [selectedMod]);

  // Calculate selected mod values with rating
  const selectedModCost = useMemo(() => {
    if (!selectedMod) return 0;
    return getModCost(selectedMod, ratingBounds.hasRating ? selectedRating : undefined);
  }, [selectedMod, selectedRating, ratingBounds.hasRating]);

  const selectedModCapacity = useMemo(() => {
    if (!selectedMod) return 0;
    return getModCapacityCost(selectedMod, ratingBounds.hasRating ? selectedRating : undefined);
  }, [selectedMod, selectedRating, ratingBounds.hasRating]);

  const canFitSelected = selectedModCapacity <= remainingCapacity;
  const canAffordSelected = selectedModCost <= remaining;
  const canInstall = canFitSelected && canAffordSelected;

  // Reset selection when modal opens
  const handleClose = () => {
    setSearchQuery("");
    setSelectedMod(null);
    setSelectedRating(1);
    onClose();
  };

  const handleInstall = () => {
    if (selectedMod && canInstall) {
      onInstall(selectedMod, ratingBounds.hasRating ? selectedRating : undefined);
      handleClose();
    }
  };

  // Reset rating when selecting a new mod
  const handleSelectMod = (mod: GearModificationCatalogItemData) => {
    setSelectedMod(mod);
    setSelectedRating(1);
  };

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="xl">
      {({ close }) => (
        <div className="flex max-h-[85vh] flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Add Modification
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{gear.name}</p>
            </div>
            <button
              onClick={close}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Capacity Status */}
          <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                <Backpack className="h-4 w-4" />
                Modification Capacity
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {usedCapacity} / {totalCapacity} used
                <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                  ({remainingCapacity} available)
                </span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-full rounded-full transition-all ${getCapacityColor(capacityPercentage)}`}
                style={{ width: `${Math.min(100, capacityPercentage)}%` }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search modifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Content - Split Pane */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Mod List */}
            <div className="w-1/2 overflow-y-auto border-r border-zinc-100 p-4 dark:border-zinc-800">
              <div className="space-y-2">
                {sortedMods.length === 0 ? (
                  <p className="py-8 text-center text-sm text-zinc-500">
                    No compatible modifications found
                  </p>
                ) : (
                  sortedMods.map(({ mod, capacityCost, canFit }) => {
                    const cost = getModCost(mod);
                    return (
                      <ModListItem
                        key={mod.id}
                        mod={mod}
                        isSelected={selectedMod?.id === mod.id}
                        canFit={canFit}
                        canAfford={cost <= remaining}
                        capacityCost={capacityCost}
                        onClick={() => handleSelectMod(mod)}
                      />
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Detail Preview */}
            <div className="w-1/2 overflow-y-auto p-4">
              {selectedMod ? (
                <div className="space-y-4">
                  {/* Mod Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedMod.name}
                    </h3>
                    {ratingBounds.hasRating && (
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Rating {ratingBounds.min}-{ratingBounds.max}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  {selectedMod.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedMod.description}
                    </p>
                  )}

                  {/* Rating Selector */}
                  {ratingBounds.hasRating && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Rating
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setSelectedRating(Math.max(ratingBounds.min, selectedRating - 1))
                          }
                          disabled={selectedRating <= ratingBounds.min}
                          className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                            selectedRating > ratingBounds.min
                              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="flex h-10 w-12 items-center justify-center rounded bg-zinc-100 text-lg font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                          {selectedRating}
                        </div>
                        <button
                          onClick={() =>
                            setSelectedRating(Math.min(ratingBounds.max, selectedRating + 1))
                          }
                          disabled={selectedRating >= ratingBounds.max}
                          className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                            selectedRating < ratingBounds.max
                              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Statistics
                    </span>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Capacity Cost</span>
                      <span
                        className={`font-medium ${
                          !canFitSelected
                            ? "text-red-600 dark:text-red-400"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {selectedModCapacity}
                        {!canFitSelected && " (exceeds)"}
                      </span>
                    </div>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Cost</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(selectedModCost)}¥
                      </span>
                    </div>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                      <span
                        className={`font-medium ${
                          selectedMod.legality === "forbidden"
                            ? "text-red-600 dark:text-red-400"
                            : selectedMod.legality === "restricted"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {getAvailabilityDisplay(selectedMod.availability, selectedMod.legality)}
                      </span>
                    </div>
                  </div>

                  {/* Applicable Categories */}
                  {selectedMod.applicableCategories &&
                    selectedMod.applicableCategories.length > 0 && (
                      <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                        <div className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          Compatible with: {selectedMod.applicableCategories.join(", ")}
                        </div>
                      </div>
                    )}

                  {/* Legality Warning */}
                  {(selectedMod.legality === "restricted" ||
                    selectedMod.legality === "forbidden") && (
                    <div
                      className={`rounded-lg p-3 ${
                        selectedMod.legality === "forbidden"
                          ? "bg-red-50 dark:bg-red-900/20"
                          : "bg-amber-50 dark:bg-amber-900/20"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                          selectedMod.legality === "forbidden"
                            ? "text-red-700 dark:text-red-300"
                            : "text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {selectedMod.legality === "forbidden" ? "Forbidden" : "Restricted"}
                      </div>
                    </div>
                  )}

                  {/* Install Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleInstall}
                      disabled={!canInstall}
                      className={`w-full rounded-lg py-3 text-sm font-medium transition-colors ${
                        canInstall
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                      }`}
                    >
                      {!canFitSelected
                        ? `Exceeds Capacity (needs ${selectedModCapacity})`
                        : canAffordSelected
                          ? `Install - ${formatCurrency(selectedModCost)}¥`
                          : `Cannot Afford (${formatCurrency(selectedModCost)}¥)`}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-500">
                  <p className="text-sm">Select a modification to see details</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3 dark:border-zinc-700">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Budget:{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(remaining)}¥
              </span>{" "}
              remaining
              <span className="mx-2">•</span>
              Capacity:{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {remainingCapacity}
              </span>{" "}
              available
            </div>
            <button
              onClick={close}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </BaseModalRoot>
  );
}
