"use client";

/**
 * GearPurchaseModal
 *
 * Split-pane modal for browsing and purchasing gear.
 * Left side: Category filters, search, and gear list
 * Right side: Selected gear details with rating selection
 */

import { useState, useMemo } from "react";
import {
  useGear,
  type GearItemData,
  type GearCatalogData,
} from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { X, Search, Minus, Plus, AlertTriangle } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

type GearCategory =
  | "all"
  | "electronics"
  | "tools"
  | "survival"
  | "medical"
  | "security"
  | "miscellaneous";

const GEAR_CATEGORIES: Array<{ id: GearCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "electronics", label: "Electronics" },
  { id: "tools", label: "Tools" },
  { id: "medical", label: "Medical" },
  { id: "security", label: "Security" },
  { id: "survival", label: "Survival" },
  { id: "miscellaneous", label: "Misc" },
];

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
 * Extract all gear from catalog into flat array with category info
 */
function getAllGear(catalog: GearCatalogData | null): GearItemData[] {
  if (!catalog) return [];
  return [
    ...catalog.electronics,
    ...catalog.tools,
    ...catalog.survival,
    ...catalog.medical,
    ...catalog.security,
    ...catalog.miscellaneous,
  ];
}

/**
 * Get gear by category
 */
function getGearByCategory(
  catalog: GearCatalogData | null,
  category: GearCategory
): GearItemData[] {
  if (!catalog) return [];
  if (category === "all") return getAllGear(catalog);
  return catalog[category] || [];
}

/**
 * Calculate cost for a gear item, optionally with rating
 */
function getGearCost(gear: GearItemData, rating?: number): number {
  if (gear.ratingSpec?.costScaling?.perRating && rating) {
    return (gear.ratingSpec.costScaling.baseValue || gear.cost) * rating;
  }
  if (gear.costPerRating && rating) {
    return gear.cost * rating;
  }
  return gear.cost;
}

/**
 * Calculate availability for a gear item, optionally with rating
 */
function getGearAvailability(gear: GearItemData, rating?: number): number {
  if (gear.ratingSpec?.availabilityScaling?.perRating && rating) {
    return (
      (gear.ratingSpec.availabilityScaling.baseValue || gear.availability) *
      rating
    );
  }
  return gear.availability;
}

/**
 * Check if gear has rating
 */
function hasRating(gear: GearItemData): boolean {
  return !!(gear.hasRating || gear.ratingSpec?.rating?.hasRating);
}

/**
 * Get rating bounds for gear
 */
function getRatingBounds(gear: GearItemData): {
  min: number;
  max: number;
  hasRating: boolean;
} {
  if (gear.ratingSpec?.rating?.hasRating) {
    return {
      min: gear.ratingSpec.rating.minRating || 1,
      max: gear.ratingSpec.rating.maxRating || 6,
      hasRating: true,
    };
  }
  if (gear.hasRating) {
    return {
      min: 1,
      max: gear.maxRating || 6,
      hasRating: true,
    };
  }
  return { min: 1, max: 1, hasRating: false };
}

// =============================================================================
// TYPES
// =============================================================================

interface GearPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
  onPurchase: (gear: GearItemData, rating?: number) => void;
}

// =============================================================================
// GEAR LIST ITEM
// =============================================================================

function GearListItem({
  gear,
  isSelected,
  canAfford,
  onClick,
}: {
  gear: GearItemData;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
}) {
  const isDisabled = !canAfford;
  const gearHasRating = hasRating(gear);
  const ratingBounds = getRatingBounds(gear);

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
              {gear.name}
            </span>
            {gearHasRating && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                R1-{ratingBounds.max}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="capitalize">{gear.category}</span>
            <span>
              Avail: {getAvailabilityDisplay(gear.availability, gear.legality)}
              {gear.ratingSpec?.availabilityScaling?.perRating && "/R"}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(gear.cost)}¥
            {(gear.costPerRating ||
              gear.ratingSpec?.costScaling?.perRating) &&
              "/R"}
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GearPurchaseModal({
  isOpen,
  onClose,
  remaining,
  onPurchase,
}: GearPurchaseModalProps) {
  const gearCatalog = useGear();

  const [selectedCategory, setSelectedCategory] =
    useState<GearCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGear, setSelectedGear] = useState<GearItemData | null>(null);
  const [selectedRating, setSelectedRating] = useState(1);

  // Get gear for current category
  const categoryGear = useMemo(
    () => getGearByCategory(gearCatalog, selectedCategory),
    [gearCatalog, selectedCategory]
  );

  // Category counts
  const categoryCounts = useMemo(() => {
    if (!gearCatalog) return {};
    return {
      all: getAllGear(gearCatalog).filter(
        (g) => g.availability <= MAX_AVAILABILITY
      ).length,
      electronics: gearCatalog.electronics.filter(
        (g) => g.availability <= MAX_AVAILABILITY
      ).length,
      tools: gearCatalog.tools.filter((g) => g.availability <= MAX_AVAILABILITY)
        .length,
      survival: gearCatalog.survival.filter(
        (g) => g.availability <= MAX_AVAILABILITY
      ).length,
      medical: gearCatalog.medical.filter(
        (g) => g.availability <= MAX_AVAILABILITY
      ).length,
      security: gearCatalog.security.filter(
        (g) => g.availability <= MAX_AVAILABILITY
      ).length,
      miscellaneous: gearCatalog.miscellaneous.filter(
        (g) => g.availability <= MAX_AVAILABILITY
      ).length,
    };
  }, [gearCatalog]);

  // Filter by search and availability
  const filteredGear = useMemo(() => {
    let items = categoryGear.filter((g) => g.availability <= MAX_AVAILABILITY);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (g) =>
          g.name.toLowerCase().includes(query) ||
          g.category.toLowerCase().includes(query)
      );
    }

    // Sort alphabetically
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [categoryGear, searchQuery]);

  // Get rating bounds for selected gear
  const ratingBounds = useMemo(() => {
    if (!selectedGear) return { min: 1, max: 1, hasRating: false };
    return getRatingBounds(selectedGear);
  }, [selectedGear]);

  // Calculate selected gear values with rating
  const selectedGearCost = useMemo(() => {
    if (!selectedGear) return 0;
    return getGearCost(
      selectedGear,
      ratingBounds.hasRating ? selectedRating : undefined
    );
  }, [selectedGear, selectedRating, ratingBounds.hasRating]);

  const selectedGearAvail = useMemo(() => {
    if (!selectedGear) return 0;
    return getGearAvailability(
      selectedGear,
      ratingBounds.hasRating ? selectedRating : undefined
    );
  }, [selectedGear, selectedRating, ratingBounds.hasRating]);

  const canAfford = selectedGearCost <= remaining;
  const availabilityOk = selectedGearAvail <= MAX_AVAILABILITY;
  const canPurchase = canAfford && availabilityOk;

  // Reset selection when modal opens/closes
  const handleClose = () => {
    setSearchQuery("");
    setSelectedGear(null);
    setSelectedRating(1);
    setSelectedCategory("all");
    onClose();
  };

  const handlePurchase = () => {
    if (selectedGear && canPurchase) {
      onPurchase(
        selectedGear,
        ratingBounds.hasRating ? selectedRating : undefined
      );
      setSelectedGear(null);
      setSelectedRating(1);
    }
  };

  // Reset rating when selecting new gear
  const handleSelectGear = (gear: GearItemData) => {
    setSelectedGear(gear);
    setSelectedRating(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative mx-4 flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Purchase Gear
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {formatCurrency(remaining)}¥ available
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
          {GEAR_CATEGORIES.map((category) => {
            const count =
              categoryCounts[category.id as keyof typeof categoryCounts] || 0;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedGear(null);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-amber-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                {category.label}
                <span
                  className={`ml-1 ${
                    selectedCategory === category.id
                      ? "text-amber-100"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Content - Split Pane */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Gear List */}
          <div className="w-1/2 overflow-y-auto border-r border-zinc-100 p-4 dark:border-zinc-800">
            <div className="space-y-2">
              {filteredGear.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">
                  No gear found
                </p>
              ) : (
                filteredGear.map((gear) => {
                  const cost = getGearCost(gear);
                  return (
                    <GearListItem
                      key={gear.id}
                      gear={gear}
                      isSelected={selectedGear?.id === gear.id}
                      canAfford={cost <= remaining}
                      onClick={() => handleSelectGear(gear)}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Detail Preview */}
          <div className="w-1/2 overflow-y-auto p-4">
            {selectedGear ? (
              <div className="space-y-4">
                {/* Gear Name */}
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {selectedGear.name}
                  </h3>
                  <p className="text-sm capitalize text-zinc-500 dark:text-zinc-400">
                    {selectedGear.category}
                    {selectedGear.subcategory &&
                      ` • ${selectedGear.subcategory}`}
                  </p>
                </div>

                {/* Description */}
                {selectedGear.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {selectedGear.description}
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
                          setSelectedRating(
                            Math.max(ratingBounds.min, selectedRating - 1)
                          )
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
                          setSelectedRating(
                            Math.min(ratingBounds.max, selectedRating + 1)
                          )
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
                    <span className="text-zinc-500 dark:text-zinc-400">
                      Cost
                    </span>
                    <span
                      className={`font-medium ${
                        !canAfford
                          ? "text-red-600 dark:text-red-400"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {formatCurrency(selectedGearCost)}¥
                      {!canAfford && " (over budget)"}
                    </span>
                  </div>
                  <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      Availability
                    </span>
                    <span
                      className={`font-medium ${
                        selectedGear.legality === "forbidden"
                          ? "text-red-600 dark:text-red-400"
                          : selectedGear.legality === "restricted"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {getAvailabilityDisplay(
                        selectedGearAvail,
                        selectedGear.legality
                      )}
                    </span>
                  </div>
                  {selectedGear.capacity && (
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        Capacity
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {selectedGear.capacity}
                      </span>
                    </div>
                  )}
                </div>

                {/* Legality Warning */}
                {(selectedGear.legality === "restricted" ||
                  selectedGear.legality === "forbidden") && (
                  <div
                    className={`rounded-lg p-3 ${
                      selectedGear.legality === "forbidden"
                        ? "bg-red-50 dark:bg-red-900/20"
                        : "bg-amber-50 dark:bg-amber-900/20"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 text-sm font-medium ${
                        selectedGear.legality === "forbidden"
                          ? "text-red-700 dark:text-red-300"
                          : "text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      {selectedGear.legality === "forbidden"
                        ? "Forbidden"
                        : "Restricted"}
                    </div>
                  </div>
                )}

                {/* Availability Warning */}
                {!availabilityOk && (
                  <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                    <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300">
                      <AlertTriangle className="h-4 w-4" />
                      Availability exceeds {MAX_AVAILABILITY} for character
                      creation
                    </div>
                  </div>
                )}

                {/* Purchase Button */}
                <div className="pt-2">
                  <button
                    onClick={handlePurchase}
                    disabled={!canPurchase}
                    className={`w-full rounded-lg py-3 text-sm font-medium transition-colors ${
                      canPurchase
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                    }`}
                  >
                    {!canAfford
                      ? `Cannot Afford (${formatCurrency(selectedGearCost)}¥)`
                      : !availabilityOk
                        ? `Availability Too High (${selectedGearAvail})`
                        : `Purchase - ${formatCurrency(selectedGearCost)}¥`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-500">
                <p className="text-sm">Select gear to see details</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3 dark:border-zinc-700">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {filteredGear.length} items available
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
