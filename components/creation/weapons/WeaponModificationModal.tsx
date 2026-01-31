"use client";

/**
 * WeaponModificationModal
 *
 * Modal for adding modifications to a weapon.
 * Shows compatible mods based on weapon type and available mount points.
 * Displays which mounts are already occupied.
 */

import { useState, useMemo, useCallback } from "react";
import {
  useWeaponModifications,
  useRuleset,
  type WeaponModificationCatalogItemData,
} from "@/lib/rules/RulesetContext";
import {
  canAcceptModifications,
  getAvailableMounts,
  type ModifiableItem,
} from "@/lib/rules/modifications";
import type { Weapon, WeaponMount, ItemLegality } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, AlertTriangle, Check, Minus, Plus, Ban, Wrench } from "lucide-react";

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

function getAvailabilityDisplay(availability: number, legality?: ItemLegality): string {
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

function getModAvailability(mod: WeaponModificationCatalogItemData, rating?: number): number {
  // Rating-based availability
  if (mod.ratingSpec?.availabilityScaling?.perRating && rating) {
    return (mod.ratingSpec.availabilityScaling.baseValue || mod.availability || 0) * rating;
  }

  return mod.availability || 0;
}

function isModCompatible(
  mod: WeaponModificationCatalogItemData,
  weapon: Weapon,
  occupiedMounts: WeaponMount[],
  availableMounts: WeaponMount[]
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
    const isIncompatible = mod.incompatibleWeapons.some((w) => w.toLowerCase() === weaponSub);
    if (isIncompatible) {
      return { compatible: false, reason: "Incompatible weapon type" };
    }
  }

  // Check mount availability (using pre-computed availableMounts from capability system)
  if (mod.mount) {
    if (!availableMounts.includes(mod.mount as WeaponMount)) {
      return { compatible: false, reason: `No ${MOUNT_LABELS[mod.mount]} mount` };
    }
    if (occupiedMounts.includes(mod.mount as WeaponMount)) {
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
            ? "border-zinc-200 bg-white hover:border-amber-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-amber-500"
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
  const { ruleset } = useRuleset();
  const allMods = useWeaponModifications({ maxAvailability: MAX_AVAILABILITY });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMod, setSelectedMod] = useState<WeaponModificationCatalogItemData | null>(null);
  const [selectedRating, setSelectedRating] = useState(1);
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Get occupied mounts from weapon
  const occupiedMounts = useMemo(
    () => (weapon.occupiedMounts || []) as WeaponMount[],
    [weapon.occupiedMounts]
  );

  // Create modifiable item for capability system
  const modifiableItem: ModifiableItem = useMemo(
    () => ({ subcategory: weapon.subcategory || "" }),
    [weapon.subcategory]
  );

  // Check if weapon can accept modifications using capability system
  const weaponCanAcceptMods = useMemo(() => {
    if (!ruleset) return false;
    return canAcceptModifications(modifiableItem, ruleset);
  }, [modifiableItem, ruleset]);

  // Get available mounts using capability system
  const availableMounts = useMemo(() => {
    if (!ruleset) return [];
    return getAvailableMounts(modifiableItem, ruleset) as WeaponMount[];
  }, [modifiableItem, ruleset]);

  // Filter and check compatibility for each mod
  const modsWithCompatibility = useMemo(() => {
    return allMods.map((mod) => ({
      mod,
      compatibility: isModCompatible(mod, weapon, occupiedMounts, availableMounts),
    }));
  }, [allMods, weapon, occupiedMounts, availableMounts]);

  // Filter by search
  const filteredMods = useMemo(() => {
    if (!searchQuery) return modsWithCompatibility;
    const query = searchQuery.toLowerCase();
    return modsWithCompatibility.filter((item) => item.mod.name.toLowerCase().includes(query));
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

  // Full reset on close
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedMod(null);
    setSelectedRating(1);
    setAddedThisSession(0);
  }, []);

  // Partial reset after adding (preserves search)
  const resetForNextMod = useCallback(() => {
    setSelectedMod(null);
    setSelectedRating(1);
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handleInstall = useCallback(() => {
    if (selectedMod && canAffordSelected) {
      onInstall(selectedMod, ratingBounds.hasRating ? selectedRating : undefined);
      setAddedThisSession((prev) => prev + 1);
      resetForNextMod();
    }
  }, [
    selectedMod,
    canAffordSelected,
    ratingBounds.hasRating,
    selectedRating,
    onInstall,
    resetForNextMod,
  ]);

  // If weapon can't accept modifications, show a simplified modal
  if (!weaponCanAcceptMods) {
    return (
      <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="md">
        {({ close }) => (
          <>
            <ModalHeader title="Add Modification" onClose={close}>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{weapon.name}</span>
            </ModalHeader>

            <ModalBody>
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <Ban className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Modifications Not Supported
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  This weapon type does not accept modifications.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <div />
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Close
              </button>
            </ModalFooter>
          </>
        )}
      </BaseModalRoot>
    );
  }

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Modification" onClose={close}>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{weapon.name}</span>
          </ModalHeader>

          {/* Mount Status & Search */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Mount Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Mounts:</span>
              {availableMounts.length === 0 ? (
                <span className="text-xs text-zinc-400">No mounts available</span>
              ) : (
                availableMounts.map((mount) => {
                  const isOccupied = occupiedMounts.includes(mount);
                  return (
                    <span
                      key={mount}
                      className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
                        isOccupied
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      }`}
                    >
                      {isOccupied ? <Check className="h-3 w-3" /> : null}
                      {MOUNT_LABELS[mount]}
                    </span>
                  );
                })
              )}
            </div>

            {/* Search */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search modifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane: Mod List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 p-4 dark:border-zinc-700">
                <div className="space-y-2">
                  {sortedMods.length === 0 ? (
                    <p className="text-sm text-zinc-500 text-center py-8">No modifications found</p>
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

              {/* Right Pane: Detail Preview */}
              <div className="w-1/2 overflow-y-auto p-6">
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
                        <span
                          className={`font-medium ${
                            selectedMod.legality === "forbidden"
                              ? "text-red-600 dark:text-red-400"
                              : selectedMod.legality === "restricted"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
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

                    {/* Effects */}
                    {(selectedMod.accuracyModifier ||
                      selectedMod.recoilCompensation ||
                      selectedMod.concealabilityModifier) && (
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

                    {/* Cost Indicator */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Cost
                        </span>
                        <span
                          className={`font-semibold ${
                            canAffordSelected
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(selectedModCost)}¥
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    <Wrench className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select a modification from the list</p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {addedThisSession > 0 && (
                <span className="mr-2 text-emerald-600 dark:text-emerald-400">
                  {addedThisSession} installed
                </span>
              )}
              <span>
                Budget:{" "}
                <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(remaining)}¥
                </span>
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Done
              </button>
              <button
                onClick={handleInstall}
                disabled={!selectedMod || !canAffordSelected}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedMod && canAffordSelected
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Install Mod
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
