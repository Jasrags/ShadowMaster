"use client";

/**
 * ArmorPurchaseModal
 *
 * Split-pane modal for browsing and purchasing armor.
 * Left side: Category list with armor items
 * Right side: Detail preview of selected armor
 */

import { useState, useMemo, useCallback } from "react";
import type { ArmorData } from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { isLegalAtCreation, CREATION_CONSTRAINTS } from "@/lib/rules/gear/validation";
import { BaseModalRoot, ModalFooter } from "@/components/ui";
import { Search, Shield, AlertTriangle, X, Plus, Shirt } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = CREATION_CONSTRAINTS.maxAvailabilityAtCreation;

const ARMOR_CATEGORIES = [
  { id: "all", label: "All Armor" },
  { id: "body", label: "Body Armor" },
  { id: "clothing", label: "Clothing" },
  { id: "helmets", label: "Helmets" },
  { id: "shields", label: "Shields" },
  { id: "fba", label: "Full Body" },
  { id: "accessories", label: "Accessories" },
] as const;

type ArmorCategory = (typeof ARMOR_CATEGORIES)[number]["id"];

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
 * Categorize armor based on subcategory field or name heuristics
 */
function categorizeArmor(armor: ArmorData): ArmorCategory {
  const name = armor.name.toLowerCase();

  // Use explicit subcategory if available
  if (armor.subcategory === "clothing") return "clothing";

  // Shields
  if (name.includes("shield")) return "shields";

  // Helmets
  if (name.includes("helmet")) return "helmets";

  // Full Body Armor
  if (name.includes("full body") || name.includes("security armor") || name.includes("mil-spec")) {
    return "fba";
  }

  // Accessories (armorModifier items that aren't shields/helmets)
  if (armor.armorModifier) return "accessories";

  // Clothing fallback (low/zero armor rating or clothing in name)
  if (armor.armorRating <= 2 || name.includes("clothing") || name.includes("clothes")) {
    return "clothing";
  }

  // Default: Body Armor
  return "body";
}

// =============================================================================
// TYPES
// =============================================================================

/** Custom clothing item for free-form naming and pricing */
export interface CustomClothingItem {
  name: string;
  cost: number;
}

interface ArmorPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  armorCatalog: ArmorData[];
  remaining: number;
  onPurchase: (armor: ArmorData) => void;
  onPurchaseCustom?: (item: CustomClothingItem) => void;
}

// =============================================================================
// CUSTOM CLOTHING FORM
// =============================================================================

function CustomClothingForm({
  remaining,
  onAdd,
}: {
  remaining: number;
  onAdd: (item: CustomClothingItem) => void;
}) {
  const [name, setName] = useState("");
  const [costInput, setCostInput] = useState("");

  const cost = parseInt(costInput, 10) || 0;
  const canAfford = cost > 0 && cost <= remaining;
  const isValid = name.trim().length > 0 && cost > 0;

  const handleSubmit = () => {
    if (isValid && canAfford) {
      onAdd({ name: name.trim(), cost });
      setName("");
      setCostInput("");
    }
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <Shirt className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
          Custom Clothing
        </span>
      </div>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Name (e.g., Black Suit)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Cost"
              value={costInput}
              onChange={(e) => setCostInput(e.target.value)}
              min="1"
              className="w-full rounded border border-zinc-200 bg-white px-2.5 py-1.5 pr-6 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
              ¥
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isValid || !canAfford}
            className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              isValid && canAfford
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500"
            }`}
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
        {cost > 0 && !canAfford && (
          <p className="text-[10px] text-red-500">Cannot afford ({formatCurrency(cost)}¥)</p>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// ARMOR LIST ITEM
// =============================================================================

function ArmorListItem({
  armor,
  isSelected,
  canAfford,
  onClick,
}: {
  armor: ArmorData;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full text-left p-2.5 rounded-lg border transition-all ${
        isSelected
          ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
          : canAfford
            ? "border-zinc-200 bg-white hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-500/50"
            : "border-zinc-200 bg-zinc-100 opacity-50 cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm truncate">
              {armor.name}
            </span>
            {armor.armorModifier && (
              <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-1 py-0.5 rounded flex-shrink-0">
                +{armor.armorRating}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {armor.armorRating}
            </span>
            <span>Cap {armor.capacity ?? armor.armorRating}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(armor.cost)}¥
          </div>
          <div className="text-xs text-zinc-500">
            {getAvailabilityDisplay(armor.availability, armor.legality)}
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ArmorPurchaseModal({
  isOpen,
  onClose,
  armorCatalog,
  remaining,
  onPurchase,
  onPurchaseCustom,
}: ArmorPurchaseModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyLegal, setShowOnlyLegal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ArmorCategory>("all");
  const [selectedArmor, setSelectedArmor] = useState<ArmorData | null>(null);

  // Track how many items were added in this session
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Show custom clothing form when in clothing category
  const showCustomClothingForm = selectedCategory === "clothing" && onPurchaseCustom;

  // Reset for adding another item - preserves search/category
  const resetForNextItem = useCallback(() => {
    setSelectedArmor(null);
  }, []);

  // Full reset on close
  const resetState = useCallback(() => {
    setSearchQuery("");
    setShowOnlyLegal(false);
    setSelectedCategory("all");
    setSelectedArmor(null);
    setAddedThisSession(0);
  }, []);

  // Handle custom clothing purchase
  const handleCustomClothingAdd = (item: CustomClothingItem) => {
    if (onPurchaseCustom) {
      onPurchaseCustom(item);
      setAddedThisSession((prev) => prev + 1);
    }
  };

  // Filter armor by category, search, and legality
  const filteredArmor = useMemo(() => {
    let items = armorCatalog;

    // Filter by category
    if (selectedCategory !== "all") {
      items = items.filter((a) => categorizeArmor(a) === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((a) => a.name.toLowerCase().includes(query));
    }

    // Filter by availability
    items = items.filter((a) => a.availability <= MAX_AVAILABILITY);

    // Filter by legality
    if (showOnlyLegal) {
      items = items.filter((a) => isLegalAtCreation(a.availability, a.legality));
    }

    // Sort by name
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [armorCatalog, selectedCategory, searchQuery, showOnlyLegal]);

  // Count items per category for badges
  const categoryCounts = useMemo(() => {
    const counts: Record<ArmorCategory, number> = {
      all: 0,
      body: 0,
      clothing: 0,
      helmets: 0,
      shields: 0,
      fba: 0,
      accessories: 0,
    };

    armorCatalog
      .filter((a) => a.availability <= MAX_AVAILABILITY)
      .forEach((armor) => {
        counts.all++;
        counts[categorizeArmor(armor)]++;
      });

    return counts;
  }, [armorCatalog]);

  // Group filtered armor by category for sticky headers (only when showing "all")
  const armorByCategory = useMemo(() => {
    if (selectedCategory !== "all") {
      // When filtering by specific category, no grouping needed
      return null;
    }
    const grouped: Partial<Record<ArmorCategory, ArmorData[]>> = {};
    filteredArmor.forEach((armor) => {
      const cat = categorizeArmor(armor);
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat]!.push(armor);
    });
    return grouped;
  }, [filteredArmor, selectedCategory]);

  // Category display order and labels
  const categoryOrder: ArmorCategory[] = [
    "body",
    "clothing",
    "helmets",
    "shields",
    "fba",
    "accessories",
  ];
  const categoryLabels: Record<ArmorCategory, string> = {
    all: "All Armor",
    body: "Body Armor",
    clothing: "Clothing",
    helmets: "Helmets",
    shields: "Shields",
    fba: "Full Body Armor",
    accessories: "Accessories",
  };

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Handle purchase - stays open for bulk-add
  const handlePurchase = useCallback(() => {
    if (selectedArmor && selectedArmor.cost <= remaining) {
      onPurchase(selectedArmor);
      setAddedThisSession((prev) => prev + 1);
      resetForNextItem();
    }
  }, [selectedArmor, remaining, onPurchase, resetForNextItem]);

  const canAffordSelected = selectedArmor ? selectedArmor.cost <= remaining : false;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="2xl">
      {({ close }) => (
        <div className="flex max-h-[85vh] flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Add Armor</h2>
            <button
              onClick={close}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 space-y-3">
            {/* Search + Legal Filter */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search armor..."
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

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {ARMOR_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.label}
                  {categoryCounts[cat.id] > 0 && (
                    <span className="ml-1 opacity-70">({categoryCounts[cat.id]})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content - Split Pane */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Armor List */}
            <div className="w-1/2 border-r border-zinc-100 dark:border-zinc-800 overflow-y-auto">
              {/* Custom Clothing Form */}
              {showCustomClothingForm && (
                <div className="p-4 pb-0">
                  <CustomClothingForm remaining={remaining} onAdd={handleCustomClothingAdd} />
                </div>
              )}

              {filteredArmor.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">No armor found</p>
              ) : armorByCategory ? (
                // Grouped by category with sticky headers (when "all" is selected)
                categoryOrder
                  .filter((cat) => armorByCategory[cat]?.length)
                  .map((category) => (
                    <div key={category}>
                      <div className="sticky top-0 z-10 bg-zinc-100 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {categoryLabels[category]}
                      </div>
                      <div className="space-y-2 px-4 py-2">
                        {armorByCategory[category]!.map((armor) => (
                          <ArmorListItem
                            key={armor.id}
                            armor={armor}
                            isSelected={selectedArmor?.id === armor.id}
                            canAfford={armor.cost <= remaining}
                            onClick={() => setSelectedArmor(armor)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
              ) : (
                // Flat list when filtering by specific category
                <div className="space-y-2 p-4">
                  {filteredArmor.map((armor) => (
                    <ArmorListItem
                      key={armor.id}
                      armor={armor}
                      isSelected={selectedArmor?.id === armor.id}
                      canAfford={armor.cost <= remaining}
                      onClick={() => setSelectedArmor(armor)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Detail Preview */}
            <div className="w-1/2 overflow-y-auto p-4">
              {selectedArmor ? (
                <div className="space-y-4">
                  {/* Armor Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedArmor.name}
                    </h3>
                    {selectedArmor.armorModifier && (
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Accessory - Adds to worn armor (max +STR)
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  {selectedArmor.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedArmor.description}
                    </p>
                  )}

                  {/* Stats Grid */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Statistics
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                        <span className="text-zinc-500 dark:text-zinc-400">Armor Rating</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {selectedArmor.armorModifier
                            ? `+${selectedArmor.armorRating}`
                            : selectedArmor.armorRating}
                        </span>
                      </div>
                      <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                        <span className="text-zinc-500 dark:text-zinc-400">Capacity</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {selectedArmor.capacity ?? selectedArmor.armorRating}
                        </span>
                      </div>
                      <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                        <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                        <span
                          className={`font-medium ${
                            selectedArmor.legality === "forbidden"
                              ? "text-red-600 dark:text-red-400"
                              : selectedArmor.legality === "restricted"
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {getAvailabilityDisplay(
                            selectedArmor.availability,
                            selectedArmor.legality
                          )}
                        </span>
                      </div>
                      {selectedArmor.weight && (
                        <div className="flex justify-between bg-zinc-50 dark:bg-zinc-800 rounded px-3 py-2">
                          <span className="text-zinc-500 dark:text-zinc-400">Weight</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedArmor.weight} kg
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Capacity Info */}
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      <Shield className="h-4 w-4" />
                      Modification Capacity
                    </div>
                    <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                      This armor has {selectedArmor.capacity ?? selectedArmor.armorRating} capacity
                      slots for modifications like Fire Resistance, Chemical Protection, and more.
                    </p>
                  </div>

                  {/* Legality Warning */}
                  {(selectedArmor.legality === "restricted" ||
                    selectedArmor.legality === "forbidden") && (
                    <div
                      className={`rounded-lg p-3 ${
                        selectedArmor.legality === "forbidden"
                          ? "bg-red-50 dark:bg-red-900/20"
                          : "bg-amber-50 dark:bg-amber-900/20"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                          selectedArmor.legality === "forbidden"
                            ? "text-red-700 dark:text-red-300"
                            : "text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {selectedArmor.legality === "forbidden" ? "Forbidden" : "Restricted"}
                      </div>
                      <p
                        className={`mt-1 text-xs ${
                          selectedArmor.legality === "forbidden"
                            ? "text-red-600 dark:text-red-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {selectedArmor.legality === "forbidden"
                          ? "Illegal to own. Possession triggers serious legal consequences."
                          : "Requires a license. May draw law enforcement attention."}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-500">
                  <p className="text-sm">Select armor to see details</p>
                </div>
              )}
            </div>
          </div>

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
                disabled={!canAffordSelected}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  canAffordSelected
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                {canAffordSelected && selectedArmor
                  ? `Add Armor (${formatCurrency(selectedArmor.cost)}¥)`
                  : "Add Armor"}
              </button>
            </div>
          </ModalFooter>
        </div>
      )}
    </BaseModalRoot>
  );
}
