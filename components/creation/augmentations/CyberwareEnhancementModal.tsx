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
 */

import { useMemo, useState, useCallback } from "react";
import { useCyberware } from "@/lib/rules/RulesetContext";
import type { CyberwareItem, ItemLegality } from "@/lib/types";
import { X, Search, Plus, Minus, Zap } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

// Map cyberware categories to enhancement categories that can be installed
const ENHANCEMENT_MAPPING: Record<string, { categories: string[]; parentType?: string }> = {
  eyeware: { categories: ["eyeware"] },
  earware: { categories: ["earware"] },
  cyberlimb: { categories: ["cyberlimb-enhancement", "cyberlimb-accessory"], parentType: "cyberlimb" },
  "cyberlimb-arm": { categories: ["cyberlimb-enhancement", "cyberlimb-accessory"], parentType: "cyberlimb" },
  "cyberlimb-leg": { categories: ["cyberlimb-enhancement", "cyberlimb-accessory"], parentType: "cyberlimb" },
  "cyberlimb-torso": { categories: ["cyberlimb-enhancement", "cyberlimb-accessory"], parentType: "cyberlimb" },
  "cyberlimb-skull": { categories: ["cyberlimb-enhancement", "cyberlimb-accessory"], parentType: "cyberlimb" },
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
  onAdd: (enhancement: CyberwareEnhancementSelection) => void;
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

function getAvailabilityDisplay(
  availability: number,
  legality?: ItemLegality
): string {
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

  // Reset state
  const resetState = useCallback(() => {
    setSelectedItemId(null);
    setRating(1);
    setSearchQuery("");
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
      if (item.availability > maxAvailability) return false;
      if (item.legality === "forbidden") return false;

      return true;
    });
  }, [cyberwareCatalog, enhancementMapping, maxAvailability]);

  // Filter by search query
  const filteredEnhancements = useMemo(() => {
    if (!searchQuery) return availableEnhancements;

    const query = searchQuery.toLowerCase();
    return availableEnhancements.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
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

  // Validation checks
  const canAfford = calculatedCosts ? calculatedCosts.cost <= remainingNuyen : true;
  const fitsCapacity = calculatedCosts ? calculatedCosts.capacityCost <= remainingCapacity : true;
  const meetsAvailability = calculatedCosts ? calculatedCosts.availability <= maxAvailability : true;
  const canAdd = selectedItem && canAfford && fitsCapacity && meetsAvailability;

  // Handle add
  const handleAdd = useCallback(() => {
    if (!selectedItem || !calculatedCosts || !canAdd) return;

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

    onAdd(enhancement);
    resetState();
    onClose();
  }, [selectedItem, calculatedCosts, canAdd, rating, onAdd, resetState, onClose]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[70vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Add Enhancement
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {parentCyberware.name} - {remainingCapacity} capacity remaining
            </p>
          </div>
          <button
            onClick={handleClose}
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
                    const fits = itemCapacity <= remainingCapacity;

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
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {item.name}
                          </span>
                          <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                            <span className="text-blue-600 dark:text-blue-400">
                              [{item.capacityCost}
                              {item.capacityPerRating ? "/R" : ""}]
                            </span>
                            <span>{formatCurrency(item.cost)}¥{item.costPerRating ? "/R" : ""}</span>
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
                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-zinc-100 text-xl font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                          {rating}
                        </div>
                        <button
                          onClick={() => setRating(Math.min(selectedItem.maxRating || 6, rating + 1))}
                          disabled={rating >= (selectedItem.maxRating || 6)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                            rating < (selectedItem.maxRating || 6)
                              ? "bg-cyan-500 text-white hover:bg-cyan-600"
                              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-zinc-400">Max: {selectedItem.maxRating || 6}</span>
                      </div>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Capacity</div>
                      <div
                        className={`mt-1 text-xl font-bold ${
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
                        className={`mt-1 text-xl font-bold ${
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
                        className={`mt-1 text-xl font-bold ${
                          meetsAvailability
                            ? "text-zinc-900 dark:text-zinc-100"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {getAvailabilityDisplay(calculatedCosts.availability, selectedItem.legality)}
                      </div>
                    </div>
                  </div>

                  {/* Remaining capacity preview */}
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-blue-700 dark:text-blue-300">
                      Remaining capacity after install: {remainingCapacity - calculatedCosts.capacityCost}
                    </span>
                  </div>

                  {/* Validation errors */}
                  {!fitsCapacity && (
                    <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                      Not enough capacity ({remainingCapacity} remaining)
                    </div>
                  )}
                  {!canAfford && (
                    <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                      Not enough nuyen ({formatCurrency(remainingNuyen)}¥ remaining)
                    </div>
                  )}
                  {!meetsAvailability && (
                    <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                      Exceeds availability limit ({maxAvailability})
                    </div>
                  )}
                </div>

                {/* Add Button */}
                <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
                  <button
                    onClick={handleAdd}
                    disabled={!canAdd}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      canAdd
                        ? "bg-cyan-500 text-white hover:bg-cyan-600"
                        : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    Install Enhancement
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
      </div>
    </div>
  );
}
