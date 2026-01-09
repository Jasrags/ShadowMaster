"use client";

/**
 * CyberlimbWeaponModal
 *
 * Modal for adding implant weapons to cyberlimbs (hand razors, spurs, cyberguns, etc.).
 * Features:
 * - Filters weapons that can be installed in cyberlimbs
 * - Capacity tracking
 * - Cost preview
 * - Cart/queue for multi-select
 */

import { useMemo, useState, useCallback } from "react";
import { useCyberware } from "@/lib/rules/RulesetContext";
import type { CyberlimbItem, ItemLegality } from "@/lib/types";
import { X, Search, Plus, Crosshair, ShoppingCart } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

// =============================================================================
// TYPES
// =============================================================================

export interface CyberlimbWeaponSelection {
  catalogId: string;
  name: string;
  capacityCost: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  description?: string;
  damage?: string;
  ap?: number;
}

interface CyberlimbWeaponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (weapons: CyberlimbWeaponSelection[]) => void;
  parentCyberlimb: CyberlimbItem;
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

function getLegalityBadge(legality?: ItemLegality) {
  if (!legality) return null;
  if (legality === "restricted") {
    return (
      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
        R
      </span>
    );
  }
  if (legality === "forbidden") {
    return (
      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-medium text-red-700 dark:bg-red-900/50 dark:text-red-300">
        F
      </span>
    );
  }
  return null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CyberlimbWeaponModal({
  isOpen,
  onClose,
  onAdd,
  parentCyberlimb,
  remainingCapacity,
  remainingNuyen,
  maxAvailability = MAX_AVAILABILITY,
}: CyberlimbWeaponModalProps) {
  const cyberwareCatalog = useCyberware({ excludeForbidden: false });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CyberlimbWeaponSelection[]>([]);

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
    setSearchQuery("");
    setCart([]);
  }, []);

  // Filter catalog items to only show valid weapons
  const availableWeapons = useMemo(() => {
    if (!cyberwareCatalog?.catalog) return [];

    return cyberwareCatalog.catalog.filter((item) => {
      // Must be cybernetic-weapon category
      if (item.category !== "cybernetic-weapon") return false;

      // Must have capacityCost to be installable in cyberlimb
      if (item.capacityCost === undefined) return false;

      // Filter by availability (allow restricted but not forbidden for creation)
      if ((item.availability ?? 0) > maxAvailability && item.legality !== "restricted") return false;

      return true;
    });
  }, [cyberwareCatalog, maxAvailability]);

  // Filter by search query
  const filteredWeapons = useMemo(() => {
    if (!searchQuery) return availableWeapons;

    const query = searchQuery.toLowerCase();
    return availableWeapons.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }, [availableWeapons, searchQuery]);

  // Selected item details
  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return availableWeapons.find((i) => i.id === selectedItemId);
  }, [selectedItemId, availableWeapons]);

  // Calculate costs for selected item
  const calculatedCosts = useMemo(() => {
    if (!selectedItem) return null;

    const capacityCost = selectedItem.capacityCost || 0;
    const cost = selectedItem.cost || 0;
    const availability = selectedItem.availability || 0;

    return { capacityCost, cost, availability };
  }, [selectedItem]);

  // Validation checks
  const canAfford = calculatedCosts ? calculatedCosts.cost <= effectiveRemainingNuyen : true;
  const fitsCapacity = calculatedCosts ? calculatedCosts.capacityCost <= effectiveRemainingCapacity : true;
  const meetsAvailability = calculatedCosts ? calculatedCosts.availability <= maxAvailability : true;
  const canAddToCart = selectedItem && canAfford && fitsCapacity && (meetsAvailability || selectedItem.legality === "restricted");

  // Add to cart
  const handleAddToCart = useCallback(() => {
    if (!selectedItem || !calculatedCosts || !canAddToCart) return;

    const weapon: CyberlimbWeaponSelection = {
      catalogId: selectedItem.id,
      name: selectedItem.name,
      capacityCost: calculatedCosts.capacityCost,
      cost: calculatedCosts.cost,
      availability: calculatedCosts.availability,
      legality: selectedItem.legality,
      description: selectedItem.description,
    };

    setCart((prev) => [...prev, weapon]);
    setSelectedItemId(null);
  }, [selectedItem, calculatedCosts, canAddToCart]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Add Implant Weapons
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {parentCyberlimb.name} —{" "}
              <span className={effectiveRemainingCapacity < remainingCapacity ? "text-red-600 dark:text-red-400" : ""}>
                {effectiveRemainingCapacity}
              </span>
              {effectiveRemainingCapacity < remainingCapacity && (
                <span className="text-zinc-400"> (was {remainingCapacity})</span>
              )}{" "}
              capacity remaining
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
                  placeholder="Search weapons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Weapon List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredWeapons.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No compatible weapons found
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredWeapons.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    const itemCapacity = item.capacityCost || 0;
                    const fits = itemCapacity <= effectiveRemainingCapacity;

                    const inCartCount = cart.filter((c) => c.catalogId === item.id).length;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        disabled={!fits}
                        className={`flex w-full items-start justify-between rounded-lg p-3 text-left transition-colors ${
                          isSelected
                            ? "border border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20"
                            : !fits
                              ? "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {item.name}
                            </span>
                            {getLegalityBadge(item.legality)}
                            {inCartCount > 0 && (
                              <span className="shrink-0 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                {inCartCount} in cart
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                            <span className="text-red-600 dark:text-red-400">
                              [{item.capacityCost}]
                            </span>
                            <span>{formatCurrency(item.cost)}¥</span>
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
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedItem.name}
                    </h3>
                    {getLegalityBadge(selectedItem.legality)}
                  </div>

                  {selectedItem.description && (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedItem.description}
                    </p>
                  )}

                  {/* Stats Grid */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Capacity</div>
                      <div
                        className={`mt-1 text-xl font-bold ${
                          fitsCapacity
                            ? "text-red-600 dark:text-red-400"
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
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {getAvailabilityDisplay(calculatedCosts.availability, selectedItem.legality)}
                      </div>
                    </div>
                  </div>

                  {/* Remaining capacity preview */}
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 dark:bg-red-900/20">
                    <Crosshair className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-700 dark:text-red-300">
                      Capacity after adding: {effectiveRemainingCapacity - calculatedCosts.capacityCost}
                    </span>
                  </div>

                  {/* Legality warning */}
                  {selectedItem.legality === "forbidden" && (
                    <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                      <strong>Forbidden:</strong> This weapon is illegal and may not be available during character creation.
                    </div>
                  )}
                  {selectedItem.legality === "restricted" && (
                    <div className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                      <strong>Restricted:</strong> Requires a license to own legally.
                    </div>
                  )}

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
                </div>

                {/* Add to Cart Button */}
                <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
                  <button
                    onClick={handleAddToCart}
                    disabled={!canAddToCart}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      canAddToCart
                        ? "bg-red-500 text-white hover:bg-red-600"
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
                  <Crosshair className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                  <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                    Select a weapon from the list
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
                    </span>
                    <span className="text-[10px] text-red-600 dark:text-red-400">
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
                Add weapons to the cart, then install all at once
              </p>
            )}
          </div>

          {/* Install All Button */}
          <div className="flex gap-3 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <button
              onClick={handleClose}
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
              <Crosshair className="h-4 w-4" />
              Install {cart.length > 0 ? `All (${cart.length})` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
