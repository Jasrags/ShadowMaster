"use client";

/**
 * WeaponModificationModal
 *
 * Modal for adding modifications to a weapon.
 * Shows compatible mods based on weapon type and available mount points.
 * Displays which mounts are already occupied.
 */

import { useState, useMemo } from "react";
import {
  useWeaponModifications,
  getAvailableMountsForWeaponType,
  type WeaponModificationCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { Weapon, WeaponMount, ItemLegality } from "@/lib/types";
import { X, Search, AlertTriangle, Check, Minus, Plus } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

const MOUNT_LABELS: Record<string, string> = {
  top: "Top",
  under: "Under",
  side: "Side",
  barrel: "Barrel",
  stock: "Stock",
  internal: "Internal",
};

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

function getModCost(
  mod: WeaponModificationCatalogItemData,
  weaponCost: number,
  rating?: number
): number {
  // Cost multiplier (e.g., smartgun internal = weapon cost * 2)
  if (mod.costMultiplier) {
    return Math.round(weaponCost * mod.costMultiplier);
  }

  // Rating-based cost
  if (mod.hasRating && mod.costPerRating && rating) {
    return (mod.cost || 0) * rating;
  }

  // Rating spec based cost
  if (mod.ratingSpec?.costScaling?.perRating && rating) {
    return (mod.ratingSpec.costScaling.baseValue || mod.cost || 0) * rating;
  }

  return mod.cost || 0;
}

function getModAvailability(
  mod: WeaponModificationCatalogItemData,
  rating?: number
): number {
  // Rating-based availability
  if (mod.ratingSpec?.availabilityScaling?.perRating && rating) {
    return (mod.ratingSpec.availabilityScaling.baseValue || mod.availability || 0) * rating;
  }

  return mod.availability || 0;
}

function isModCompatible(
  mod: WeaponModificationCatalogItemData,
  weapon: Weapon,
  occupiedMounts: WeaponMount[]
): { compatible: boolean; reason?: string } {
  // Check compatible weapons list
  if (mod.compatibleWeapons && mod.compatibleWeapons.length > 0) {
    const weaponSub = weapon.subcategory?.toLowerCase() || "";
    const isCompatible = mod.compatibleWeapons.some(
      (w) => w.toLowerCase() === weaponSub || weapon.catalogId?.includes(w)
    );
    if (!isCompatible) {
      return { compatible: false, reason: "Incompatible weapon type" };
    }
  }

  // Check incompatible weapons list
  if (mod.incompatibleWeapons && mod.incompatibleWeapons.length > 0) {
    const weaponSub = weapon.subcategory?.toLowerCase() || "";
    const isIncompatible = mod.incompatibleWeapons.some(
      (w) => w.toLowerCase() === weaponSub
    );
    if (isIncompatible) {
      return { compatible: false, reason: "Incompatible weapon type" };
    }
  }

  // Check mount availability
  if (mod.mount) {
    const availableMounts = getAvailableMountsForWeaponType(weapon.subcategory);
    if (!availableMounts.includes(mod.mount)) {
      return { compatible: false, reason: `No ${MOUNT_LABELS[mod.mount]} mount` };
    }
    if (occupiedMounts.includes(mod.mount)) {
      return { compatible: false, reason: `${MOUNT_LABELS[mod.mount]} mount occupied` };
    }
  }

  return { compatible: true };
}

// =============================================================================
// TYPES
// =============================================================================

interface WeaponModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  weapon: Weapon;
  remaining: number;
  onInstall: (mod: WeaponModificationCatalogItemData, rating?: number) => void;
}

// =============================================================================
// MOD LIST ITEM
// =============================================================================

function ModListItem({
  mod,
  isSelected,
  compatibility,
  canAfford,
  onClick,
}: {
  mod: WeaponModificationCatalogItemData;
  isSelected: boolean;
  compatibility: { compatible: boolean; reason?: string };
  canAfford: boolean;
  onClick: () => void;
}) {
  const isDisabled = !compatibility.compatible || !canAfford;

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
            {mod.mount && (
              <span className="text-[10px] bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                {MOUNT_LABELS[mod.mount]}
              </span>
            )}
          </div>
          {!compatibility.compatible && (
            <div className="mt-0.5 text-xs text-red-500 dark:text-red-400">
              {compatibility.reason}
            </div>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {mod.costMultiplier ? `×${mod.costMultiplier}` : `${formatCurrency(mod.cost || 0)}¥`}
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

export function WeaponModificationModal({
  isOpen,
  onClose,
  weapon,
  remaining,
  onInstall,
}: WeaponModificationModalProps) {
  const allMods = useWeaponModifications({ maxAvailability: MAX_AVAILABILITY });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMod, setSelectedMod] = useState<WeaponModificationCatalogItemData | null>(null);
  const [selectedRating, setSelectedRating] = useState(1);

  // Get occupied mounts from weapon
  const occupiedMounts = useMemo(
    () => (weapon.occupiedMounts || []) as WeaponMount[],
    [weapon.occupiedMounts]
  );

  // Get available mounts for this weapon type
  const availableMounts = useMemo(
    () => getAvailableMountsForWeaponType(weapon.subcategory),
    [weapon.subcategory]
  );

  // Filter and check compatibility for each mod
  const modsWithCompatibility = useMemo(() => {
    return allMods.map((mod) => ({
      mod,
      compatibility: isModCompatible(mod, weapon, occupiedMounts),
    }));
  }, [allMods, weapon, occupiedMounts]);

  // Filter by search
  const filteredMods = useMemo(() => {
    if (!searchQuery) return modsWithCompatibility;
    const query = searchQuery.toLowerCase();
    return modsWithCompatibility.filter((item) =>
      item.mod.name.toLowerCase().includes(query)
    );
  }, [modsWithCompatibility, searchQuery]);

  // Sort: compatible first, then by name
  const sortedMods = useMemo(() => {
    return [...filteredMods].sort((a, b) => {
      if (a.compatibility.compatible && !b.compatibility.compatible) return -1;
      if (!a.compatibility.compatible && b.compatibility.compatible) return 1;
      return a.mod.name.localeCompare(b.mod.name);
    });
  }, [filteredMods]);

  // Calculate selected mod cost
  const selectedModCost = useMemo(() => {
    if (!selectedMod) return 0;
    return getModCost(selectedMod, weapon.cost, selectedRating);
  }, [selectedMod, weapon.cost, selectedRating]);

  const selectedModAvail = useMemo(() => {
    if (!selectedMod) return 0;
    return getModAvailability(selectedMod, selectedRating);
  }, [selectedMod, selectedRating]);

  const canAffordSelected = selectedModCost <= remaining && selectedModAvail <= MAX_AVAILABILITY;

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

  // Reset selection when modal opens
  const handleClose = () => {
    setSearchQuery("");
    setSelectedMod(null);
    setSelectedRating(1);
    onClose();
  };

  const handleInstall = () => {
    if (selectedMod && canAffordSelected) {
      onInstall(selectedMod, ratingBounds.hasRating ? selectedRating : undefined);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Add Modification
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {weapon.name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mount Status */}
        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Mounts:
            </span>
            {availableMounts.length === 0 ? (
              <span className="text-xs text-zinc-400">No mounts available</span>
            ) : (
              availableMounts.map((mount) => {
                const isOccupied = occupiedMounts.includes(mount);
                return (
                  <span
                    key={mount}
                    className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                      isOccupied
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    }`}
                  >
                    {isOccupied ? (
                      <Check className="h-3 w-3" />
                    ) : null}
                    {MOUNT_LABELS[mount]}
                  </span>
                );
              })
            )}
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
                sortedMods.map(({ mod, compatibility }) => {
                  const cost = getModCost(mod, weapon.cost);
                  return (
                    <ModListItem
                      key={mod.id}
                      mod={mod}
                      isSelected={selectedMod?.id === mod.id}
                      compatibility={compatibility}
                      canAfford={cost <= remaining}
                      onClick={() => {
                        setSelectedMod(mod);
                        setSelectedRating(ratingBounds.min);
                      }}
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
                  {selectedMod.mount && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Requires {MOUNT_LABELS[selectedMod.mount]} mount
                    </p>
                  )}
                </div>

                {/* Description */}
                {selectedMod.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {selectedMod.description}
                  </p>
                )}

                {/* Stats */}
                <div className="space-y-2">
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

                {/* Effects */}
                {(selectedMod.accuracyModifier || selectedMod.recoilCompensation || selectedMod.concealabilityModifier) && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Effects
                    </span>
                    <div className="space-y-1">
                      {selectedMod.accuracyModifier && (
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">
                          +{selectedMod.accuracyModifier} Accuracy
                        </div>
                      )}
                      {selectedMod.recoilCompensation && (
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">
                          +{selectedMod.recoilCompensation} Recoil Compensation
                        </div>
                      )}
                      {selectedMod.concealabilityModifier && (
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">
                          {selectedMod.concealabilityModifier} Concealability
                        </div>
                      )}
                    </div>
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
                    disabled={!canAffordSelected}
                    className={`w-full py-3 rounded-lg text-sm font-medium transition-colors ${
                      canAffordSelected
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500"
                    }`}
                  >
                    {canAffordSelected
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
          </div>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
