"use client";

/**
 * ArmorModificationModal
 *
 * Modal for adding modifications to armor.
 * Shows compatible mods based on available capacity.
 * Displays capacity usage with visual progress bar.
 */

import { useState, useMemo } from "react";
import {
  useArmorModifications,
  type ArmorModificationCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { ArmorItem, ItemLegality } from "@/lib/types";
import { BaseModalRoot } from "@/components/ui";
import { Search, AlertTriangle, Shield, Minus, Plus, X } from "lucide-react";

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

function getAvailabilityDisplay(
  availability: number,
  legality?: ItemLegality
): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

/**
 * Calculate the capacity cost for a mod, optionally with rating
 */
function getModCapacityCost(
  mod: ArmorModificationCatalogItemData,
  rating?: number
): number {
  // No capacity cost (bracketed in rulebook)
  if (mod.noCapacityCost) return 0;

  // Rating-based capacity using ratingSpec
  if (mod.ratingSpec?.capacityCostScaling?.perRating && rating) {
    return (mod.ratingSpec.capacityCostScaling.baseValue || mod.capacityCost || 0) * rating;
  }

  // Legacy rating-based capacity
  if (mod.capacityPerRating && rating) {
    return (mod.capacityCost || 0) * rating;
  }

  return mod.capacityCost || 0;
}

/**
 * Calculate the cost for a mod, optionally with rating
 */
function getModCost(mod: ArmorModificationCatalogItemData, rating?: number): number {
  // Rating-based cost using ratingSpec
  if (mod.ratingSpec?.costScaling?.perRating && rating) {
    return (mod.ratingSpec.costScaling.baseValue || mod.cost || 0) * rating;
  }

  // Legacy rating-based cost
  if (mod.costPerRating && rating) {
    return (mod.cost || 0) * rating;
  }

  return mod.cost || 0;
}

/**
 * Calculate the availability for a mod, optionally with rating
 */
function getModAvailability(
  mod: ArmorModificationCatalogItemData,
  rating?: number
): number {
  // Rating-based availability
  if (mod.ratingSpec?.availabilityScaling?.perRating && rating) {
    return (mod.ratingSpec.availabilityScaling.baseValue || mod.availability || 0) * rating;
  }

  return mod.availability || 0;
}

function getCapacityColor(percentage: number): string {
  if (percentage >= 90) return "bg-red-500";
  if (percentage >= 70) return "bg-amber-500";
  return "bg-emerald-500";
}

// =============================================================================
// TYPES
// =============================================================================

interface ArmorModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  armor: ArmorItem;
  remaining: number;
  onInstall: (mod: ArmorModificationCatalogItemData, rating?: number) => void;
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
  mod: ArmorModificationCatalogItemData;
  isSelected: boolean;
  canFit: boolean;
  canAfford: boolean;
  capacityCost: number;
  onClick: () => void;
}) {
  const isDisabled = !canFit || !canAfford;
  const hasRating = mod.hasRating || mod.ratingSpec?.rating?.hasRating;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full text-left p-2.5 rounded-lg border transition-all ${
        isSelected
          ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30"
          : !isDisabled
            ? "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
            : "border-zinc-200 bg-zinc-100 opacity-50 cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm truncate">
              {mod.name}
            </span>
            {hasRating && (
              <span className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 px-1.5 py-0.5 rounded">
                R1-{mod.ratingSpec?.rating?.maxRating || mod.maxRating || 6}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Cap: {mod.noCapacityCost ? "[0]" : capacityCost}</span>
            {!canFit && <span className="text-red-500">Exceeds capacity</span>}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(mod.cost || 0)}¥
            {(mod.costPerRating || mod.ratingSpec?.costScaling?.perRating) && "/R"}
          </div>
          <div className="text-xs text-zinc-500">
            {getAvailabilityDisplay(mod.availability || 0, mod.legality)}
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ArmorModificationModal({
  isOpen,
  onClose,
  armor,
  remaining,
  onInstall,
}: ArmorModificationModalProps) {
  const allMods = useArmorModifications({ maxAvailability: MAX_AVAILABILITY });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMod, setSelectedMod] = useState<ArmorModificationCatalogItemData | null>(null);
  const [selectedRating, setSelectedRating] = useState(1);

  // Calculate capacity
  const totalCapacity = armor.capacity ?? armor.armorRating;
  const usedCapacity = armor.capacityUsed ?? 0;
  const remainingCapacity = totalCapacity - usedCapacity;
  const capacityPercentage = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;

  // Filter mods by search and check if they fit
  const modsWithFitInfo = useMemo(() => {
    return allMods.map((mod) => {
      const capacityCost = getModCapacityCost(mod, 1);
      const canFit = capacityCost <= remainingCapacity || !!mod.noCapacityCost;
      return { mod, capacityCost, canFit };
    });
  }, [allMods, remainingCapacity]);

  // Filter by search
  const filteredMods = useMemo(() => {
    if (!searchQuery) return modsWithFitInfo;
    const query = searchQuery.toLowerCase();
    return modsWithFitInfo.filter((item) =>
      item.mod.name.toLowerCase().includes(query)
    );
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
    if (selectedMod.ratingSpec?.rating?.hasRating) {
      return {
        min: selectedMod.ratingSpec.rating.minRating || 1,
        max: selectedMod.ratingSpec.rating.maxRating || 6,
        hasRating: true,
      };
    }
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

  const selectedModAvail = useMemo(() => {
    if (!selectedMod) return 0;
    return getModAvailability(selectedMod, ratingBounds.hasRating ? selectedRating : undefined);
  }, [selectedMod, selectedRating, ratingBounds.hasRating]);

  const canFitSelected = selectedModCapacity <= remainingCapacity || selectedMod?.noCapacityCost;
  const canAffordSelected = selectedModCost <= remaining && selectedModAvail <= MAX_AVAILABILITY;
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
  const handleSelectMod = (mod: ArmorModificationCatalogItemData) => {
    setSelectedMod(mod);
    setSelectedRating(1);
  };

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="xl">
      {({ close }) => (
        <div className="flex max-h-[85vh] flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Add Modification
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {armor.name}
              </p>
            </div>
            <button
              onClick={close}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

        {/* Capacity Status */}
        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
              <Shield className="h-4 w-4" />
              Modification Capacity
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              {usedCapacity} / {totalCapacity} used
              <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                ({remainingCapacity} available)
              </span>
            </span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${getCapacityColor(capacityPercentage)}`}
              style={{ width: `${Math.min(100, capacityPercentage)}%` }}
            />
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800">
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
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Mod List */}
          <div className="w-1/2 border-r border-zinc-100 dark:border-zinc-800 overflow-y-auto p-4">
            <div className="space-y-2">
              {sortedMods.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">
                  No modifications found
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
                        onClick={() => setSelectedRating(Math.max(ratingBounds.min, selectedRating - 1))}
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
                        onClick={() => setSelectedRating(Math.min(ratingBounds.max, selectedRating + 1))}
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
                  <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2 text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Capacity Cost</span>
                    <span className={`font-medium ${
                      !canFitSelected
                        ? "text-red-600 dark:text-red-400"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}>
                      {selectedMod.noCapacityCost ? "[0]" : selectedModCapacity}
                      {!canFitSelected && " (exceeds)"}
                    </span>
                  </div>
                  <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2 text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Cost</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(selectedModCost)}¥
                    </span>
                  </div>
                  <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2 text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                    <span className={`font-medium ${
                      selectedMod.legality === "forbidden"
                        ? "text-red-600 dark:text-red-400"
                        : selectedMod.legality === "restricted"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-zinc-900 dark:text-zinc-100"
                    }`}>
                      {getAvailabilityDisplay(selectedModAvail, selectedMod.legality)}
                    </span>
                  </div>
                </div>

                {/* Requirements Warning */}
                {selectedMod.requirements && selectedMod.requirements.length > 0 && (
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                      <AlertTriangle className="h-4 w-4" />
                      Requirements
                    </div>
                    <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                      {selectedMod.requirements.join(", ")}
                    </p>
                  </div>
                )}

                {/* Legality Warning */}
                {(selectedMod.legality === "restricted" || selectedMod.legality === "forbidden") && (
                  <div className={`rounded-lg p-3 ${
                    selectedMod.legality === "forbidden"
                      ? "bg-red-50 dark:bg-red-900/20"
                      : "bg-amber-50 dark:bg-amber-900/20"
                  }`}>
                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      selectedMod.legality === "forbidden"
                        ? "text-red-700 dark:text-red-300"
                        : "text-amber-700 dark:text-amber-300"
                    }`}>
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
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                      canInstall
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500"
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
              <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-500">
                <p className="text-sm">Select a modification to see details</p>
              </div>
            )}
          </div>
        </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Budget: <span className="font-medium text-zinc-900 dark:text-zinc-100">{formatCurrency(remaining)}¥</span> remaining
              <span className="mx-2">•</span>
              Capacity: <span className="font-medium text-zinc-900 dark:text-zinc-100">{remainingCapacity}</span> available
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
