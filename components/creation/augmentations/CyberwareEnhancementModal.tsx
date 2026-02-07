"use client";

/**
 * CyberwareEnhancementModal
 *
 * Modal for adding enhancements to cyberware with capacity (cybereyes, cyberears, cyberlimbs).
 * Features:
 * - Filters enhancements based on parent cyberware type
 * - Rating selection for rated enhancements
 * - Capacity tracking
 * - Cost preview
 * - Cart/queue for multi-select (add multiple enhancements before closing)
 */

import { useMemo, useState, useCallback } from "react";
import { useCyberware } from "@/lib/rules/RulesetContext";
import type { CyberwareItem, ItemLegality } from "@/lib/types";
import { hasUnifiedRatings, getRatingTableValue } from "@/lib/types/ratings";
import { BaseModalRoot } from "@/components/ui";
import { X, Search, Plus, Minus, Zap, ShoppingCart } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

// Map cyberware categories to enhancement categories that can be installed
const ENHANCEMENT_MAPPING: Record<string, { categories: string[]; parentType?: string }> = {
  eyeware: { categories: ["eyeware"] },
  earware: { categories: ["earware"] },
  cyberlimb: {
    categories: ["cyberlimb-enhancement", "cyberlimb-accessory"],
    parentType: "cyberlimb",
  },
  "cyberlimb-arm": {
    categories: ["cyberlimb-enhancement", "cyberlimb-accessory"],
    parentType: "cyberlimb",
  },
  "cyberlimb-leg": {
    categories: ["cyberlimb-enhancement", "cyberlimb-accessory"],
    parentType: "cyberlimb",
  },
  "cyberlimb-torso": {
    categories: ["cyberlimb-enhancement", "cyberlimb-accessory"],
    parentType: "cyberlimb",
  },
  "cyberlimb-skull": {
    categories: ["cyberlimb-enhancement", "cyberlimb-accessory"],
    parentType: "cyberlimb",
  },
  headware: { categories: ["headware"] },
};

// =============================================================================
// TYPES
// =============================================================================

export interface CyberwareEnhancementSelection {
  catalogId: string;
  name: string;
  category: string;
  capacityCost: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  rating?: number;
  description?: string;
}

interface CyberwareEnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (enhancements: CyberwareEnhancementSelection[]) => void;
  parentCyberware: CyberwareItem;
  remainingCapacity: number;
  remainingNuyen: number;
  maxAvailability?: number;
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

// =============================================================================
// COMPONENT
// =============================================================================

export function CyberwareEnhancementModal({
  isOpen,
  onClose,
  onAdd,
  parentCyberware,
  remainingCapacity,
  remainingNuyen,
  maxAvailability = MAX_AVAILABILITY,
}: CyberwareEnhancementModalProps) {
  const cyberwareCatalog = useCyberware({ excludeForbidden: false });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [rating, setRating] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CyberwareEnhancementSelection[]>([]);

  // Calculate cart totals
  const cartTotals = useMemo(() => {
    return cart.reduce(
      (acc, item) => ({
        capacity: acc.capacity + item.capacityCost,
        cost: acc.cost + item.cost,
      }),
      { capacity: 0, cost: 0 }
    );
  }, [cart]);

  // Remaining after cart items
  const effectiveRemainingCapacity = remainingCapacity - cartTotals.capacity;
  const effectiveRemainingNuyen = remainingNuyen - cartTotals.cost;

  // Reset state
  const resetState = useCallback(() => {
    setSelectedItemId(null);
    setRating(1);
    setSearchQuery("");
    setCart([]);
  }, []);

  // Get enhancement mapping for parent category
  const enhancementMapping = useMemo(() => {
    return ENHANCEMENT_MAPPING[parentCyberware.category] || { categories: [] };
  }, [parentCyberware.category]);

  // Filter catalog items to only show valid enhancements
  const availableEnhancements = useMemo(() => {
    if (!cyberwareCatalog?.catalog) return [];

    return cyberwareCatalog.catalog.filter((item) => {
      // Must have capacityCost to be an enhancement
      if (item.capacityCost === undefined) return false;

      // Filter by category or parentType
      if (enhancementMapping.parentType) {
        // For cyberlimbs, check parentType
        if (item.parentType !== enhancementMapping.parentType) return false;
      } else {
        // For other types, check category match
        if (!enhancementMapping.categories.includes(item.category)) return false;
      }

      // Filter by availability and legality
      if (item.legality === "forbidden") return false;

      // For unified ratings items, check the minimum rating's availability
      if (hasUnifiedRatings(item)) {
        const minRating = item.minRating ?? 1;
        const ratingValue = getRatingTableValue(item, minRating);
        const minAvailability = ratingValue?.availability ?? 0;
        return minAvailability <= maxAvailability;
      }

      // Legacy items - check top-level availability
      if ((item.availability ?? 0) > maxAvailability) return false;

      return true;
    });
  }, [cyberwareCatalog, enhancementMapping, maxAvailability]);

  // Filter by search query
  const filteredEnhancements = useMemo(() => {
    if (!searchQuery) return availableEnhancements;

    const query = searchQuery.toLowerCase();
    return availableEnhancements.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)
    );
  }, [availableEnhancements, searchQuery]);

  // Selected item details
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return availableEnhancements.find((i) => i.id === selectedItemId);
  }, [selectedItemId, availableEnhancements]);

  // Calculate costs for selected item with rating
  const calculatedCosts = useMemo(() => {
    if (!selectedItem) return null;

    let capacityCost = selectedItem.capacityCost || 0;
    let cost = selectedItem.cost || 0;
    let availability = selectedItem.availability || 0;

    // Apply rating multipliers if item has rating
    if (selectedItem.hasRating && rating > 1) {
      if (selectedItem.capacityPerRating) {
        capacityCost = capacityCost * rating;
      }
      if (selectedItem.costPerRating) {
        cost = cost * rating;
      }
      // Availability usually doesn't scale with rating, but check ratingSpec
      if (selectedItem.ratingSpec?.availabilityScaling?.perRating) {
        availability = availability * rating;
      }
    }

    return { capacityCost, cost, availability };
  }, [selectedItem, rating]);

  // Validation checks (against effective remaining after cart)
  const canAfford = calculatedCosts ? calculatedCosts.cost <= effectiveRemainingNuyen : true;
  const fitsCapacity = calculatedCosts
    ? calculatedCosts.capacityCost <= effectiveRemainingCapacity
    : true;
  const meetsAvailability = calculatedCosts
    ? calculatedCosts.availability <= maxAvailability
    : true;
  const canAddToCart = selectedItem && canAfford && fitsCapacity && meetsAvailability;

  // Add to cart
  const handleAddToCart = useCallback(() => {
    if (!selectedItem || !calculatedCosts || !canAddToCart) return;

    const enhancement: CyberwareEnhancementSelection = {
      catalogId: selectedItem.id,
      name: selectedItem.name,
      category: selectedItem.category,
      capacityCost: calculatedCosts.capacityCost,
      cost: calculatedCosts.cost,
      availability: calculatedCosts.availability,
      legality: selectedItem.legality,
      rating: selectedItem.hasRating ? rating : undefined,
      description: selectedItem.description,
    };

    setCart((prev) => [...prev, enhancement]);
    setSelectedItemId(null);
    setRating(1);
  }, [selectedItem, calculatedCosts, canAddToCart, rating]);

  // Remove from cart
  const handleRemoveFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Install all items in cart
  const handleInstallAll = useCallback(() => {
    if (cart.length === 0) return;
    onAdd(cart);
    resetState();
    onClose();
  }, [cart, onAdd, resetState, onClose]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="2xl">
      {({ close }) => (
        <div className="flex h-[85vh] flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Add Enhancements
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {parentCyberware.name} —{" "}
                <span
                  className={
                    effectiveRemainingCapacity < remainingCapacity
                      ? "text-cyan-600 dark:text-cyan-400"
                      : ""
                  }
                >
                  {effectiveRemainingCapacity}
                </span>
                {effectiveRemainingCapacity < remainingCapacity && (
                  <span className="text-zinc-400"> (was {remainingCapacity})</span>
                )}{" "}
                capacity remaining
              </p>
            </div>
            <button
              onClick={close}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content - Split Pane */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Panel - List */}
            <div className="flex w-1/2 flex-col border-r border-zinc-200 dark:border-zinc-700">
              {/* Search */}
              <div className="border-b border-zinc-100 p-4 dark:border-zinc-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search enhancements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* Enhancement List */}
              <div className="flex-1 overflow-y-auto p-2">
                {filteredEnhancements.length === 0 ? (
                  <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No compatible enhancements found
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredEnhancements.map((item) => {
                      const isSelected = selectedItemId === item.id;
                      const baseCapacity = item.capacityCost || 0;
                      const itemCapacity = item.capacityPerRating
                        ? baseCapacity * 1 // Base capacity for display (rating 1)
                        : baseCapacity;
                      const fits = itemCapacity <= effectiveRemainingCapacity;

                      // Check if already in cart
                      const inCartCount = cart.filter((c) => c.catalogId === item.id).length;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setRating(item.hasRating ? 1 : 1);
                          }}
                          disabled={!fits}
                          className={`flex w-full items-start justify-between rounded-lg p-3 text-left transition-colors ${
                            isSelected
                              ? "border border-cyan-500 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-900/20"
                              : !fits
                                ? "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                                : "border border-zinc-200 hover:border-cyan-400 dark:border-zinc-700 dark:hover:border-cyan-500"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {item.name}
                              </span>
                              {inCartCount > 0 && (
                                <span className="shrink-0 rounded-full bg-cyan-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                  {inCartCount} in cart
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                              <span className="text-blue-600 dark:text-blue-400">
                                [{item.capacityCost}
                                {item.capacityPerRating ? "/R" : ""}]
                              </span>
                              <span>
                                {formatCurrency(item.cost)}¥{item.costPerRating ? "/R" : ""}
                              </span>
                              {item.hasRating && (
                                <span className="text-amber-600 dark:text-amber-400">
                                  R1-{item.maxRating || 6}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Details */}
            <div className="flex w-1/2 flex-col">
              {selectedItem && calculatedCosts ? (
                <>
                  {/* Item Details */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedItem.name}
                    </h3>

                    {selectedItem.description && (
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedItem.description}
                      </p>
                    )}

                    {/* Rating Selector */}
                    {selectedItem.hasRating && (
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Rating
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setRating(Math.max(1, rating - 1))}
                            disabled={rating <= 1}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                              rating > 1
                                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                            }`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-zinc-100 text-xl font-mono font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                            {rating}
                          </div>
                          <button
                            onClick={() =>
                              setRating(Math.min(selectedItem.maxRating || 6, rating + 1))
                            }
                            disabled={rating >= (selectedItem.maxRating || 6)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                              rating < (selectedItem.maxRating || 6)
                                ? "bg-cyan-500 text-white hover:bg-cyan-600"
                                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                            }`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <span className="text-xs text-zinc-400">
                            Max: {selectedItem.maxRating || 6}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Capacity</div>
                        <div
                          className={`mt-1 text-xl font-mono font-bold ${
                            fitsCapacity
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          [{calculatedCosts.capacityCost}]
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Cost</div>
                        <div
                          className={`mt-1 text-xl font-mono font-bold ${
                            canAfford
                              ? "text-zinc-900 dark:text-zinc-100"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {formatCurrency(calculatedCosts.cost)}¥
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Availability</div>
                        <div
                          className={`mt-1 text-xl font-mono font-bold ${
                            meetsAvailability
                              ? "text-zinc-900 dark:text-zinc-100"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {getAvailabilityDisplay(
                            calculatedCosts.availability,
                            selectedItem.legality
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remaining capacity preview */}
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        Capacity after adding:{" "}
                        {effectiveRemainingCapacity - calculatedCosts.capacityCost}
                      </span>
                    </div>

                    {/* Validation errors */}
                    {!fitsCapacity && (
                      <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        Not enough capacity ({effectiveRemainingCapacity} remaining)
                      </div>
                    )}
                    {!canAfford && (
                      <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        Not enough nuyen ({formatCurrency(effectiveRemainingNuyen)}¥ remaining)
                      </div>
                    )}
                    {!meetsAvailability && (
                      <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        Exceeds availability limit ({maxAvailability})
                      </div>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
                    <button
                      onClick={handleAddToCart}
                      disabled={!canAddToCart}
                      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                        canAddToCart
                          ? "bg-cyan-500 text-white hover:bg-cyan-600"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center p-8 text-center">
                  <div>
                    <Zap className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                    <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                      Select an enhancement from the list
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Cart ({cart.length})
                  </span>
                  {cart.length > 0 && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      — [{cartTotals.capacity}] capacity, {formatCurrency(cartTotals.cost)}¥
                    </span>
                  )}
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-xs text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Cart Items */}
              {cart.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.catalogId}-${index}`}
                      className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm dark:bg-zinc-700"
                    >
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                        {item.name}
                        {item.rating && ` R${item.rating}`}
                      </span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400">
                        [{item.capacityCost}]
                      </span>
                      <button
                        onClick={() => handleRemoveFromCart(index)}
                        className="ml-0.5 rounded-full p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cart.length === 0 && (
                <p className="mt-1 text-xs italic text-zinc-400 dark:text-zinc-500">
                  Add enhancements to the cart, then install all at once
                </p>
              )}
            </div>

            {/* Install All Button */}
            <div className="flex gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
              <button
                onClick={close}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={handleInstallAll}
                disabled={cart.length === 0}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  cart.length > 0
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                <Zap className="h-4 w-4" />
                Install {cart.length > 0 ? `All (${cart.length})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </BaseModalRoot>
  );
}
