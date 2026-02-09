"use client";

/**
 * GearPurchaseModal
 *
 * Split-pane modal for browsing and purchasing gear.
 * Left side: Category filters, search, and gear list with sticky headers
 * Right side: Selected gear details with rating selection
 *
 * Follows the two-column bulk-add pattern:
 * - Modal stays open after adding items for bulk purchases
 * - Already-added items show strikethrough + checkmark
 * - Footer shows "Done" and "Add Gear" buttons
 */

import { useState, useMemo, useCallback } from "react";
import { useGear, type GearItemData, type GearCatalogData } from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { hasUnifiedRatings, getRatingTableValue } from "@/lib/types/ratings";
import { isLegalAtCreation, CREATION_CONSTRAINTS } from "@/lib/rules/gear/validation";
import { BaseModalRoot, ModalFooter } from "@/components/ui";
import { Search, Minus, Plus, AlertTriangle, X, Check } from "lucide-react";
import { BulkQuantitySelector } from "@/components/creation/shared/BulkQuantitySelector";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = CREATION_CONSTRAINTS.maxAvailabilityAtCreation;

type GearCategory =
  | "all"
  | "electronics"
  | "tools"
  | "survival"
  | "medical"
  | "security"
  | "miscellaneous"
  | "rfidTags";

const GEAR_CATEGORIES: Array<{ id: GearCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "electronics", label: "Electronics" },
  { id: "tools", label: "Tools" },
  { id: "medical", label: "Medical" },
  { id: "security", label: "Security" },
  { id: "survival", label: "Survival" },
  { id: "rfidTags", label: "RFID Tags" },
  { id: "miscellaneous", label: "Misc" },
];

/** Labels for sticky category headers */
const CATEGORY_LABELS: Record<GearCategory, string> = {
  all: "All Gear",
  electronics: "Electronics",
  tools: "Tools",
  survival: "Survival",
  medical: "Medical",
  security: "Security",
  miscellaneous: "Miscellaneous",
  rfidTags: "RFID Tags",
};

/** Category display order for grouped view */
const CATEGORY_ORDER: GearCategory[] = [
  "electronics",
  "tools",
  "medical",
  "security",
  "survival",
  "rfidTags",
  "miscellaneous",
];

/** Map sub-categories to their parent display category for grouped view */
function getDisplayCategory(category: string): GearCategory {
  switch (category) {
    case "audio-devices":
    case "optical-devices":
    case "imaging-devices":
      return "electronics";
    case "restraints":
      return "tools";
    case "grapple-gun":
      return "survival";
    case "rfid-tags":
      return "rfidTags";
    case "electronics":
    case "tools":
    case "medical":
    case "security":
    case "survival":
    case "rfidTags":
      return category as GearCategory;
    default:
      return "miscellaneous";
  }
}

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
    ...(catalog.rfidTags || []),
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
  // Unified ratings - look up from table
  if (hasUnifiedRatings(gear)) {
    const r = rating ?? gear.minRating ?? 1;
    const ratingValue = getRatingTableValue(gear, r);
    return ratingValue?.cost ?? 0;
  }

  // Legacy ratingSpec
  if (gear.ratingSpec?.costScaling?.perRating && rating) {
    return (gear.ratingSpec.costScaling.baseValue || gear.cost) * rating;
  }
  if (gear.costPerRating && rating) {
    return gear.cost * rating;
  }
  return gear.cost ?? 0;
}

/**
 * Calculate availability for a gear item, optionally with rating
 */
function getGearAvailability(gear: GearItemData, rating?: number): number {
  // Unified ratings - look up from table
  if (hasUnifiedRatings(gear)) {
    const r = rating ?? gear.minRating ?? 1;
    const ratingValue = getRatingTableValue(gear, r);
    return ratingValue?.availability ?? 0;
  }

  // Legacy ratingSpec
  if (gear.ratingSpec?.availabilityScaling?.perRating && rating) {
    return (gear.ratingSpec.availabilityScaling.baseValue || gear.availability) * rating;
  }
  return gear.availability ?? 0;
}

/**
 * Get minimum availability for filtering (availability at minimum rating)
 */
function getMinimumAvailability(gear: GearItemData): number {
  // Unified ratings - get availability at minimum rating
  if (hasUnifiedRatings(gear)) {
    const minRating = gear.minRating ?? 1;
    const ratingValue = getRatingTableValue(gear, minRating);
    return ratingValue?.availability ?? 0;
  }

  // Legacy - use base availability
  return gear.availability ?? 0;
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
  // Unified ratings
  if (hasUnifiedRatings(gear)) {
    return {
      min: gear.minRating ?? 1,
      max: gear.maxRating ?? 6,
      hasRating: true,
    };
  }

  // Legacy ratingSpec
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
  onPurchase: (
    gear: GearItemData,
    rating?: number,
    quantity?: number,
    specification?: string
  ) => void;
  /** IDs of gear already purchased (for already-added visual state) */
  purchasedGearIds?: string[];
}

// =============================================================================
// GEAR LIST ITEM
// =============================================================================

function GearListItem({
  gear,
  isSelected,
  canAfford,
  isAlreadyAdded,
  onClick,
}: {
  gear: GearItemData;
  isSelected: boolean;
  canAfford: boolean;
  isAlreadyAdded: boolean;
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
          ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
          : isAlreadyAdded
            ? "cursor-not-allowed border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
            : !canAfford
              ? "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
              : "border-zinc-200 bg-white hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-500/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`truncate text-sm font-medium ${
                isAlreadyAdded
                  ? "text-zinc-400 line-through dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {gear.name}
            </span>
            {gearHasRating && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                R1-{ratingBounds.max}
              </span>
            )}
            {isAlreadyAdded && <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />}
          </div>
          <div
            className={`mt-0.5 flex flex-wrap gap-x-2 text-xs ${
              isAlreadyAdded
                ? "text-zinc-400 dark:text-zinc-500"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <span className="capitalize">{gear.category}</span>
            <span>
              Avail: {getAvailabilityDisplay(getGearAvailability(gear), gear.legality)}
              {gear.ratingSpec?.availabilityScaling?.perRating && "/R"}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div
            className={`font-mono text-sm font-medium ${
              isAlreadyAdded
                ? "text-zinc-400 dark:text-zinc-500"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {formatCurrency(getGearCost(gear))}¥
            {(gear.costPerRating || gear.ratingSpec?.costScaling?.perRating) && "/R"}
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
  purchasedGearIds = [],
}: GearPurchaseModalProps) {
  const gearCatalog = useGear();

  const [selectedCategory, setSelectedCategory] = useState<GearCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyLegal, setShowOnlyLegal] = useState(false);
  const [selectedGear, setSelectedGear] = useState<GearItemData | null>(null);
  const [selectedRating, setSelectedRating] = useState(1);
  const [selectedPacks, setSelectedPacks] = useState(1);
  const [specification, setSpecification] = useState("");
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Get gear for current category
  const categoryGear = useMemo(
    () => getGearByCategory(gearCatalog, selectedCategory),
    [gearCatalog, selectedCategory]
  );

  // Category counts
  const categoryCounts = useMemo(() => {
    if (!gearCatalog) return {};
    return {
      all: getAllGear(gearCatalog).filter((g) => getMinimumAvailability(g) <= MAX_AVAILABILITY)
        .length,
      electronics: gearCatalog.electronics.filter(
        (g) => getMinimumAvailability(g) <= MAX_AVAILABILITY
      ).length,
      tools: gearCatalog.tools.filter((g) => getMinimumAvailability(g) <= MAX_AVAILABILITY).length,
      survival: gearCatalog.survival.filter((g) => getMinimumAvailability(g) <= MAX_AVAILABILITY)
        .length,
      medical: gearCatalog.medical.filter((g) => getMinimumAvailability(g) <= MAX_AVAILABILITY)
        .length,
      security: gearCatalog.security.filter((g) => getMinimumAvailability(g) <= MAX_AVAILABILITY)
        .length,
      rfidTags: (gearCatalog.rfidTags || []).filter(
        (g) => getMinimumAvailability(g) <= MAX_AVAILABILITY
      ).length,
      miscellaneous: gearCatalog.miscellaneous.filter(
        (g) => getMinimumAvailability(g) <= MAX_AVAILABILITY
      ).length,
    };
  }, [gearCatalog]);

  // Filter by search, availability, and legality
  const filteredGear = useMemo(() => {
    let items = categoryGear.filter((g) => getMinimumAvailability(g) <= MAX_AVAILABILITY);

    if (showOnlyLegal) {
      items = items.filter((g) => isLegalAtCreation(getMinimumAvailability(g), g.legality));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (g) => g.name.toLowerCase().includes(query) || g.category.toLowerCase().includes(query)
      );
    }

    // Sort alphabetically
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [categoryGear, searchQuery, showOnlyLegal]);

  // Get rating bounds for selected gear
  const ratingBounds = useMemo(() => {
    if (!selectedGear) return { min: 1, max: 1, hasRating: false };
    return getRatingBounds(selectedGear);
  }, [selectedGear]);

  // Check if selected gear is stackable
  const isStackable = selectedGear?.stackable === true;

  // Get pack size for stackable items (default 1 if not specified)
  const packSize = selectedGear?.quantity ?? 1;

  // Get unit label based on category
  const unitLabel = useMemo(() => {
    if (!selectedGear) return "units";
    if (selectedGear.category === "rfidTags") return "tags";
    return "units";
  }, [selectedGear]);

  // Calculate selected gear values with rating
  // Note: catalog cost is per unit for stackable items
  const selectedGearUnitCost = useMemo(() => {
    if (!selectedGear) return 0;
    return getGearCost(selectedGear, ratingBounds.hasRating ? selectedRating : undefined);
  }, [selectedGear, selectedRating, ratingBounds.hasRating]);

  // For stackable items: cost per pack = unit cost × pack size
  const pricePerPack = isStackable ? selectedGearUnitCost * packSize : selectedGearUnitCost;

  // Total cost including quantity for stackable items
  const selectedGearCost = isStackable ? pricePerPack * selectedPacks : selectedGearUnitCost;

  const selectedGearAvail = useMemo(() => {
    if (!selectedGear) return 0;
    return getGearAvailability(selectedGear, ratingBounds.hasRating ? selectedRating : undefined);
  }, [selectedGear, selectedRating, ratingBounds.hasRating]);

  const canAfford = selectedGearCost <= remaining;
  const availabilityOk = selectedGearAvail <= MAX_AVAILABILITY;
  const specificationOk = !selectedGear?.requiresSpecification || specification.trim().length > 0;
  const canPurchase = canAfford && availabilityOk && specificationOk && selectedGear !== null;

  // Group filtered gear by category for sticky headers (only when showing "all")
  const gearByCategory = useMemo(() => {
    if (selectedCategory !== "all") {
      // When filtering by specific category, no grouping needed
      return null;
    }
    const grouped: Partial<Record<GearCategory, GearItemData[]>> = {};
    filteredGear.forEach((gear) => {
      const cat = getDisplayCategory(gear.category);
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat]!.push(gear);
    });
    return grouped;
  }, [filteredGear, selectedCategory]);

  // Full reset on close
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setShowOnlyLegal(false);
    setSelectedGear(null);
    setSelectedRating(1);
    setSelectedPacks(1);
    setSpecification("");
    setAddedThisSession(0);
  }, []);

  // Partial reset after adding (preserves search/category)
  const resetForNextItem = useCallback(() => {
    setSelectedGear(null);
    setSelectedRating(1);
    setSelectedPacks(1);
    setSpecification("");
    // PRESERVE: searchQuery, selectedCategory, addedThisSession
  }, []);

  // Handle close with full reset
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Handle purchase - stays open for bulk-add
  const handlePurchase = useCallback(() => {
    if (selectedGear && canPurchase) {
      // For stackable items, pass the quantity (number of packs)
      // The parent component will multiply by pack size if needed
      const quantity = isStackable ? selectedPacks : undefined;
      const spec = selectedGear.requiresSpecification ? specification.trim() : undefined;
      onPurchase(selectedGear, ratingBounds.hasRating ? selectedRating : undefined, quantity, spec);
      setAddedThisSession((prev) => prev + 1);
      resetForNextItem(); // Keep modal open for bulk adding
    }
  }, [
    selectedGear,
    canPurchase,
    isStackable,
    selectedPacks,
    specification,
    onPurchase,
    ratingBounds.hasRating,
    selectedRating,
    resetForNextItem,
  ]);

  // Reset rating and packs when selecting new gear
  const handleSelectGear = useCallback((gear: GearItemData) => {
    setSelectedGear(gear);
    setSelectedRating(1);
    setSelectedPacks(1);
    setSpecification("");
  }, []);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="2xl">
      {({ close }) => (
        <div className="flex max-h-[85vh] flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Purchase Gear
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(remaining)}¥
                </span>{" "}
                available
              </p>
            </div>
            <button
              onClick={close}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5 border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            {GEAR_CATEGORIES.map((category) => {
              const count = categoryCounts[category.id as keyof typeof categoryCounts] || 0;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSelectedGear(null);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {category.label}
                  <span
                    className={`ml-1 ${
                      selectedCategory === category.id
                        ? "text-emerald-100"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + Legal Filter */}
          <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search gear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
              <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={showOnlyLegal}
                  onChange={(e) => setShowOnlyLegal(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-600"
                />
                Legal only
              </label>
            </div>
          </div>

          {/* Content - Split Pane */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Gear List with Sticky Headers */}
            <div className="w-1/2 overflow-y-auto border-r border-zinc-100 dark:border-zinc-800">
              {filteredGear.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No gear found</p>
              ) : gearByCategory ? (
                // Grouped by category with sticky headers (when "all" is selected)
                CATEGORY_ORDER.filter((cat) => gearByCategory[cat]?.length).map((category) => (
                  <div key={category}>
                    <div className="sticky top-0 z-10 bg-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {CATEGORY_LABELS[category]}
                    </div>
                    <div className="space-y-2 px-4 py-2">
                      {gearByCategory[category]!.map((gear) => {
                        const cost = getGearCost(gear);
                        const isAlreadyAdded =
                          !gear.requiresSpecification && purchasedGearIds.includes(gear.id);
                        return (
                          <GearListItem
                            key={gear.id}
                            gear={gear}
                            isSelected={selectedGear?.id === gear.id}
                            canAfford={cost <= remaining}
                            isAlreadyAdded={isAlreadyAdded}
                            onClick={() => handleSelectGear(gear)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                // Flat list when filtering by specific category
                <div className="space-y-2 p-4">
                  {filteredGear.map((gear) => {
                    const cost = getGearCost(gear);
                    const isAlreadyAdded =
                      !gear.requiresSpecification && purchasedGearIds.includes(gear.id);
                    return (
                      <GearListItem
                        key={gear.id}
                        gear={gear}
                        isSelected={selectedGear?.id === gear.id}
                        canAfford={cost <= remaining}
                        isAlreadyAdded={isAlreadyAdded}
                        onClick={() => handleSelectGear(gear)}
                      />
                    );
                  })}
                </div>
              )}
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
                      {selectedGear.subcategory && ` • ${selectedGear.subcategory}`}
                    </p>
                  </div>

                  {/* Description */}
                  {selectedGear.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedGear.description}
                    </p>
                  )}

                  {/* Specification Input */}
                  {selectedGear.requiresSpecification && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {selectedGear.specificationLabel || "Specification"}
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={specification}
                        onChange={(e) => setSpecification(e.target.value)}
                        placeholder={`Enter ${(selectedGear.specificationLabel || "specification").toLowerCase()}...`}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                      {specification.trim().length === 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          {selectedGear.specificationLabel || "Specification"} is required
                        </p>
                      )}
                    </div>
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
                        <div className="flex h-10 w-12 items-center justify-center rounded bg-zinc-100 text-lg font-mono font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
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

                  {/* Bulk Quantity Selector for Stackable Items */}
                  {isStackable && (
                    <BulkQuantitySelector
                      packSize={packSize}
                      unitLabel={unitLabel}
                      pricePerPack={pricePerPack}
                      remaining={remaining}
                      selectedPacks={selectedPacks}
                      onPacksChange={setSelectedPacks}
                    />
                  )}

                  {/* Stats */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Statistics
                    </span>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Cost</span>
                      <span
                        className={`font-mono font-medium ${
                          !canAfford
                            ? "text-red-600 dark:text-red-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {formatCurrency(selectedGearCost)}¥{!canAfford && " (over budget)"}
                      </span>
                    </div>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                      <span
                        className={`font-medium ${
                          selectedGear.legality === "forbidden"
                            ? "text-red-600 dark:text-red-400"
                            : selectedGear.legality === "restricted"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {getAvailabilityDisplay(selectedGearAvail, selectedGear.legality)}
                      </span>
                    </div>
                    {selectedGear.capacity && (
                      <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                        <span className="text-zinc-500 dark:text-zinc-400">Capacity</span>
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
                        {selectedGear.legality === "forbidden" ? "Forbidden" : "Restricted"}
                      </div>
                    </div>
                  )}

                  {/* Availability Warning */}
                  {!availabilityOk && (
                    <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                      <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-300">
                        <AlertTriangle className="h-4 w-4" />
                        Availability exceeds {MAX_AVAILABILITY} for character creation
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-500">
                  <p className="text-sm">Select gear to see details</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {addedThisSession > 0 && (
                <span className="mr-2 text-emerald-600 dark:text-emerald-400">
                  {addedThisSession} added
                </span>
              )}
              <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(remaining)}¥
              </span>{" "}
              remaining
            </div>
            <div className="flex gap-3">
              <button
                onClick={close}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Done
              </button>
              <button
                onClick={handlePurchase}
                disabled={!canPurchase}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  canPurchase
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                {canPurchase && selectedGear
                  ? isStackable
                    ? `Add Gear (${selectedPacks * packSize} ${unitLabel} - ${formatCurrency(selectedGearCost)}¥)`
                    : `Add Gear (${formatCurrency(selectedGearCost)}¥)`
                  : "Add Gear"}
              </button>
            </div>
          </ModalFooter>
        </div>
      )}
    </BaseModalRoot>
  );
}
