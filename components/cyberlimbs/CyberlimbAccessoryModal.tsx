"use client";

/**
 * CyberlimbAccessoryModal - Modal for adding accessories to a cyberlimb
 *
 * Features:
 * - Browse available cyberlimb accessories from catalog
 * - Search and filter
 * - Rating selection for rated accessories
 * - Capacity tracking
 * - Cost preview
 */

import { useMemo, useState, useCallback } from "react";
import { useCyberware } from "@/lib/rules/RulesetContext";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";
import type { CyberwareCatalogItem } from "@/lib/types/edition";
import { X, Search, Plus, Minus, Package, AlertTriangle } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

export interface CyberlimbAccessorySelection {
  catalogId: string;
  name: string;
  rating?: number;
  capacityCost: number;
  cost: number;
  availability: number;
}

interface CyberlimbAccessoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selection: CyberlimbAccessorySelection) => void;
  /** The cyberlimb to add accessory to */
  limb: CyberlimbItem;
  /** Available nuyen */
  availableNuyen: number;
  /** Max availability allowed */
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

function getAvailabilityDisplay(availability: number, legality?: string): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CyberlimbAccessoryModal({
  isOpen,
  onClose,
  onAdd,
  limb,
  availableNuyen,
  maxAvailability = 12,
}: CyberlimbAccessoryModalProps) {
  const cyberwareCatalog = useCyberware({ excludeForbidden: true });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [rating, setRating] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate remaining capacity
  const remainingCapacity = useMemo(() => {
    const used = limb.enhancements.reduce((sum, e) => sum + e.capacityUsed, 0) +
      limb.accessories.reduce((sum, a) => sum + a.capacityUsed, 0) +
      limb.weapons.reduce((sum, w) => sum + w.capacityUsed, 0);
    return limb.baseCapacity - used;
  }, [limb]);

  // Filter catalog to only show cyberlimb accessories
  const availableAccessories = useMemo(() => {
    if (!cyberwareCatalog?.catalog) return [];

    return cyberwareCatalog.catalog.filter((item) => {
      // Must be cyberlimb-accessory category
      if (item.category !== "cyberlimb-accessory") return false;

      // Must have capacity cost
      if (item.capacityCost === undefined) return false;

      // Check availability
      const baseAvail = item.availability ?? 0;
      if (baseAvail > maxAvailability) return false;

      return true;
    });
  }, [cyberwareCatalog, maxAvailability]);

  // Filter by search query
  const filteredAccessories = useMemo(() => {
    if (!searchQuery) return availableAccessories;

    const query = searchQuery.toLowerCase();
    return availableAccessories.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }, [availableAccessories, searchQuery]);

  // Selected item details
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return availableAccessories.find((i) => i.id === selectedItemId);
  }, [selectedItemId, availableAccessories]);

  // Calculate costs for selected item with rating
  const calculations = useMemo(() => {
    if (!selectedItem) return null;

    let capacityCost = selectedItem.capacityCost || 0;
    let cost = selectedItem.cost || 0;
    const availability = selectedItem.availability || 0;

    // Apply rating multipliers if item has rating
    if (selectedItem.hasRating && rating > 1) {
      if (selectedItem.capacityPerRating) {
        capacityCost = capacityCost * rating;
      }
      if (selectedItem.costPerRating) {
        cost = cost * rating;
      }
    }

    return { capacityCost, cost, availability };
  }, [selectedItem, rating]);

  // Validation
  const validation = useMemo(() => {
    if (!selectedItem || !calculations) {
      return { valid: false, errors: ["Select an accessory"] };
    }

    const errors: string[] = [];

    if (calculations.capacityCost > remainingCapacity) {
      errors.push(`Not enough capacity (need ${calculations.capacityCost}, have ${remainingCapacity})`);
    }
    if (calculations.cost > availableNuyen) {
      errors.push(`Not enough nuyen (need ${formatCurrency(calculations.cost)}¥)`);
    }
    if (calculations.availability > maxAvailability) {
      errors.push(`Exceeds availability limit (${calculations.availability} > ${maxAvailability})`);
    }

    return { valid: errors.length === 0, errors };
  }, [selectedItem, calculations, remainingCapacity, availableNuyen, maxAvailability]);

  // Handle add
  const handleAdd = useCallback(() => {
    if (!validation.valid || !selectedItem || !calculations) return;

    onAdd({
      catalogId: selectedItem.id,
      name: selectedItem.name,
      rating: selectedItem.hasRating ? rating : undefined,
      capacityCost: calculations.capacityCost,
      cost: calculations.cost,
      availability: calculations.availability,
    });
    onClose();
  }, [validation.valid, selectedItem, calculations, rating, onAdd, onClose]);

  // Reset state on close
  const handleClose = useCallback(() => {
    setSelectedItemId(null);
    setRating(1);
    setSearchQuery("");
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-zinc-900 shadow-2xl border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Add Accessory</h2>
            <p className="text-xs text-zinc-500">
              {limb.name} — [{remainingCapacity}] capacity remaining
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Split Pane */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - List */}
          <div className="flex w-1/2 flex-col border-r border-zinc-800">
            {/* Search */}
            <div className="border-b border-zinc-800 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Accessory List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredAccessories.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500">
                  No compatible accessories found
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredAccessories.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    const baseCapacity = item.capacityCost || 0;
                    const fits = baseCapacity <= remainingCapacity;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedItemId(item.id);
                          setRating(1);
                        }}
                        disabled={!fits}
                        className={`flex w-full items-start justify-between rounded-lg p-3 text-left transition-colors ${
                          isSelected
                            ? "border border-blue-500 bg-blue-500/10"
                            : !fits
                              ? "cursor-not-allowed bg-zinc-800/30 opacity-50"
                              : "hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-zinc-100">
                            {item.name}
                          </span>
                          <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-500">
                            <span className="text-blue-400">
                              [{item.capacityCost}{item.capacityPerRating ? "/R" : ""}]
                            </span>
                            <span>{formatCurrency(item.cost || 0)}¥{item.costPerRating ? "/R" : ""}</span>
                            {item.hasRating && (
                              <span className="text-amber-400">
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
            {selectedItem && calculations ? (
              <>
                {/* Item Details */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Package className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-100">
                      {selectedItem.name}
                    </h3>
                  </div>

                  {selectedItem.description && (
                    <p className="text-sm text-zinc-400 mb-4">
                      {selectedItem.description}
                    </p>
                  )}

                  {/* Rating Selector */}
                  {selectedItem.hasRating && (
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-zinc-300">
                        Rating
                        <span className="text-xs text-zinc-500 ml-2">(max {selectedItem.maxRating || 6})</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setRating(Math.max(1, rating - 1))}
                          disabled={rating <= 1}
                          className={`p-2 rounded-lg ${
                            rating > 1
                              ? "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                          }`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="w-14 h-12 flex items-center justify-center rounded-lg bg-zinc-800">
                          <span className="text-2xl font-bold font-mono text-zinc-100">
                            {rating}
                          </span>
                        </div>
                        <button
                          onClick={() => setRating(Math.min(selectedItem.maxRating || 6, rating + 1))}
                          disabled={rating >= (selectedItem.maxRating || 6)}
                          className={`p-2 rounded-lg ${
                            rating < (selectedItem.maxRating || 6)
                              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                          }`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase">Capacity</div>
                      <div className={`text-xl font-bold font-mono ${
                        calculations.capacityCost > remainingCapacity
                          ? "text-red-400"
                          : "text-blue-400"
                      }`}>
                        [{calculations.capacityCost}]
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase">Cost</div>
                      <div className={`text-xl font-bold font-mono ${
                        calculations.cost > availableNuyen
                          ? "text-red-400"
                          : "text-zinc-100"
                      }`}>
                        {formatCurrency(calculations.cost)}¥
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 text-center">
                      <div className="text-[10px] text-zinc-500 uppercase">Avail</div>
                      <div className={`text-xl font-bold font-mono ${
                        calculations.availability > maxAvailability
                          ? "text-red-400"
                          : "text-zinc-100"
                      }`}>
                        {getAvailabilityDisplay(calculations.availability, selectedItem.legality)}
                      </div>
                    </div>
                  </div>

                  {/* Capacity preview */}
                  <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 mb-4">
                    <Package className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-blue-300">
                      Capacity after adding: {remainingCapacity - calculations.capacityCost}
                    </span>
                  </div>

                  {/* Validation Errors */}
                  {!validation.valid && validation.errors.length > 0 && (
                    <div className="space-y-1">
                      {validation.errors.filter(e => e !== "Select an accessory").map((error, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-xs text-red-400">{error}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Button */}
                <div className="border-t border-zinc-800 p-4">
                  <button
                    onClick={handleAdd}
                    disabled={!validation.valid}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      validation.valid
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Add Accessory
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center">
                <div>
                  <Package className="mx-auto h-12 w-12 text-zinc-600" />
                  <p className="mt-4 text-sm text-zinc-500">
                    Select an accessory from the list
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
              bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
