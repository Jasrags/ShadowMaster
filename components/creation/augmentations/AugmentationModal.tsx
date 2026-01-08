"use client";

/**
 * AugmentationModal
 *
 * Split-pane modal for adding cyberware or bioware during character creation.
 * Features:
 * - Category filtering
 * - Grade selection with cost/essence multipliers
 * - Search functionality
 * - Real-time cost, essence, availability preview
 * - Magic/Resonance loss warning for awakened characters
 */

import { useMemo, useState, useCallback, useEffect } from "react";
import {
  useCyberware,
  useBioware,
  useCyberwareGrades,
  useBiowareGrades,
  calculateCyberwareEssenceCost,
  calculateCyberwareCost,
  calculateCyberwareAvailability,
  calculateBiowareEssenceCost,
  calculateBiowareCost,
  calculateBiowareAvailability,
  type CyberwareCatalogItemData,
  type BiowareCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { CyberwareGrade, BiowareGrade, ItemLegality } from "@/lib/types";
import { hasUnifiedRatings, getRatingTableValue } from "@/lib/types/ratings";
import { X, Search, Cpu, Heart, AlertTriangle, Zap, Plus } from "lucide-react";
import { RatingSelector } from "../shared";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

const GRADE_DISPLAY: Record<string, string> = {
  used: "Used",
  standard: "Standard",
  alpha: "Alpha",
  beta: "Beta",
  delta: "Delta",
};

const CYBERWARE_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "headware", name: "Headware" },
  { id: "eyeware", name: "Eyeware" },
  { id: "earware", name: "Earware" },
  { id: "bodyware", name: "Bodyware" },
  { id: "cyberlimb", name: "Cyberlimbs" },
  { id: "cybernetic-weapon", name: "Weapons" },
];

const BIOWARE_CATEGORIES = [
  { id: "all", name: "All" },
  { id: "basic", name: "Basic" },
  { id: "cultured", name: "Cultured" },
  { id: "cosmetic", name: "Cosmetic" },
];

// =============================================================================
// TYPES
// =============================================================================

export type AugmentationType = "cyberware" | "bioware";

export interface AugmentationSelection {
  type: AugmentationType;
  catalogId: string;
  name: string;
  category: string;
  grade: CyberwareGrade | BiowareGrade;
  baseEssenceCost: number;
  essenceCost: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  capacity?: number;
  rating?: number;
  attributeBonuses?: Record<string, number>;
  initiativeDiceBonus?: number;
  wirelessBonus?: string;
}

interface AugmentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (augmentation: AugmentationSelection) => void;
  augmentationType: AugmentationType;
  maxAvailability?: number;
  remainingEssence: number;
  remainingNuyen: number;
  isAwakened?: boolean;
  isTechnomancer?: boolean;
  currentMagic?: number;
  currentResonance?: number;
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

function formatEssence(value: number): string {
  return value.toFixed(2);
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

export function AugmentationModal({
  isOpen,
  onClose,
  onAdd,
  augmentationType,
  maxAvailability = MAX_AVAILABILITY,
  remainingEssence,
  remainingNuyen,
  isAwakened,
  isTechnomancer,
  currentMagic = 0,
  currentResonance = 0,
}: AugmentationModalProps) {
  const cyberwareCatalog = useCyberware({ excludeForbidden: false });
  const biowareCatalog = useBioware({ excludeForbidden: false });
  const cyberwareGrades = useCyberwareGrades();
  const biowareGrades = useBiowareGrades();

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [grade, setGrade] = useState<CyberwareGrade | BiowareGrade>("standard");
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState<number>(1);

  const isCyberware = augmentationType === "cyberware";
  const categories = isCyberware ? CYBERWARE_CATEGORIES : BIOWARE_CATEGORIES;
  const TypeIcon = isCyberware ? Cpu : Heart;

  // Reset state when modal opens/closes or type changes
  const resetState = useCallback(() => {
    setSelectedItemId(null);
    setGrade("standard");
    setCategory("all");
    setSearchQuery("");
    setSelectedRating(1);
  }, []);

  // Available grades based on type
  const availableGrades = useMemo(() => {
    if (isCyberware) {
      return cyberwareGrades;
    }
    // Bioware can't have "used" grade
    return biowareGrades.filter((g) => g.id !== "used");
  }, [isCyberware, cyberwareGrades, biowareGrades]);

  // Filter catalog items
  const filteredItems = useMemo(() => {
    const catalog = isCyberware ? cyberwareCatalog?.catalog : biowareCatalog?.catalog;
    if (!catalog) return [];

    let items = [...catalog];

    // Filter by category
    if (category !== "all") {
      items = items.filter((item) => item.category === category);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Filter by availability (exclude forbidden)
    // For unified ratings, check minimum rating's availability
    items = items.filter((item) => {
      if (item.legality === "forbidden") return false;

      // For unified ratings items, check the minimum rating's availability
      if (hasUnifiedRatings(item)) {
        const minRating = item.minRating ?? 1;
        const ratingValue = getRatingTableValue(item, minRating);
        const minAvailability = ratingValue?.availability ?? 0;
        return minAvailability <= maxAvailability;
      }

      // Legacy items - check top-level availability
      return (item.availability ?? 0) <= maxAvailability;
    });

    return items;
  }, [isCyberware, cyberwareCatalog, biowareCatalog, category, searchQuery, maxAvailability]);

  // Get the raw catalog item (for checking hasRating)
  const rawSelectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    const catalog = isCyberware ? cyberwareCatalog?.catalog : biowareCatalog?.catalog;
    return catalog?.find((i) => i.id === selectedItemId) ?? null;
  }, [selectedItemId, isCyberware, cyberwareCatalog, biowareCatalog]);

  // Reset rating when item changes
  useEffect(() => {
    if (rawSelectedItem && hasUnifiedRatings(rawSelectedItem)) {
      setSelectedRating(rawSelectedItem.minRating ?? 1);
    } else {
      setSelectedRating(1);
    }
  }, [rawSelectedItem]);

  // Selected item with calculated values (including rating-based values)
  const selectedItem = useMemo(() => {
    if (!rawSelectedItem) return null;

    let baseEssenceCost: number;
    let baseCost: number;
    let baseAvailability: number;
    let capacity: number | undefined;

    // Check if item uses unified ratings table
    if (hasUnifiedRatings(rawSelectedItem)) {
      const ratingValue = getRatingTableValue(rawSelectedItem, selectedRating);
      if (!ratingValue) {
        // Fall back to first available rating
        const firstRating = rawSelectedItem.minRating ?? 1;
        const firstValue = getRatingTableValue(rawSelectedItem, firstRating);
        baseEssenceCost = firstValue?.essenceCost ?? 0;
        baseCost = firstValue?.cost ?? 0;
        baseAvailability = firstValue?.availability ?? 0;
        capacity = firstValue?.capacity;
      } else {
        baseEssenceCost = ratingValue.essenceCost ?? 0;
        baseCost = ratingValue.cost ?? 0;
        baseAvailability = ratingValue.availability ?? 0;
        capacity = ratingValue.capacity;
      }
    } else {
      // Legacy item without unified ratings
      baseEssenceCost = rawSelectedItem.essenceCost ?? 0;
      baseCost = rawSelectedItem.cost ?? 0;
      baseAvailability = rawSelectedItem.availability ?? 0;
      capacity = isCyberware ? (rawSelectedItem as CyberwareCatalogItemData).capacity : undefined;
    }

    // Apply grade modifiers
    let essenceCost: number;
    let cost: number;
    let availability: number;

    if (isCyberware) {
      essenceCost = calculateCyberwareEssenceCost(
        baseEssenceCost,
        grade as CyberwareGrade,
        cyberwareGrades
      );
      cost = calculateCyberwareCost(baseCost, grade as CyberwareGrade, cyberwareGrades);
      availability = calculateCyberwareAvailability(
        baseAvailability,
        grade as CyberwareGrade,
        cyberwareGrades
      );
    } else {
      essenceCost = calculateBiowareEssenceCost(
        baseEssenceCost,
        grade as BiowareGrade,
        biowareGrades
      );
      cost = calculateBiowareCost(baseCost, grade as BiowareGrade, biowareGrades);
      availability = calculateBiowareAvailability(
        baseAvailability,
        grade as BiowareGrade,
        biowareGrades
      );
    }

    return {
      ...rawSelectedItem,
      essenceCost,
      cost,
      availability,
      capacity,
      baseEssenceCost,
    };
  }, [
    rawSelectedItem,
    selectedRating,
    grade,
    isCyberware,
    cyberwareGrades,
    biowareGrades,
  ]);

  // Calculate magic/resonance loss
  const projectedMagicLoss = useMemo(() => {
    if (!selectedItem) return 0;
    if (!isAwakened && !isTechnomancer) return 0;

    // Default formula: floor(essenceLoss)
    // Uses augmentationRules.magicReductionFormula for rule variations
    return Math.floor(selectedItem.essenceCost);
  }, [selectedItem, isAwakened, isTechnomancer]);

  // Validation checks
  const canAfford = selectedItem ? selectedItem.cost <= remainingNuyen : true;
  const hasEssence = selectedItem ? selectedItem.essenceCost <= remainingEssence : true;
  const meetsAvailability = selectedItem ? selectedItem.availability <= maxAvailability : true;
  const canAdd = selectedItem && canAfford && hasEssence && meetsAvailability;

  // Handle add
  const handleAdd = useCallback(() => {
    if (!selectedItem || !canAdd || !rawSelectedItem) return;

    // Build the display name - include rating if rated item
    const isRatedItem = hasUnifiedRatings(rawSelectedItem);
    const displayName = isRatedItem
      ? `${rawSelectedItem.name} (Rating ${selectedRating})`
      : rawSelectedItem.name;

    const selection: AugmentationSelection = {
      type: augmentationType,
      catalogId: rawSelectedItem.id,
      name: displayName,
      category: rawSelectedItem.category,
      grade,
      baseEssenceCost: selectedItem.baseEssenceCost,
      essenceCost: selectedItem.essenceCost,
      cost: selectedItem.cost,
      availability: selectedItem.availability,
      legality: rawSelectedItem.legality,
      capacity: selectedItem.capacity,
      rating: isRatedItem ? selectedRating : undefined,
      attributeBonuses: rawSelectedItem.attributeBonuses,
      initiativeDiceBonus: isCyberware
        ? (rawSelectedItem as CyberwareCatalogItemData).initiativeDiceBonus
        : undefined,
      wirelessBonus: isCyberware
        ? (rawSelectedItem as CyberwareCatalogItemData).wirelessBonus
        : undefined,
    };

    onAdd(selection);
    resetState();
    onClose();
  }, [
    selectedItem,
    rawSelectedItem,
    canAdd,
    isCyberware,
    selectedRating,
    augmentationType,
    grade,
    onAdd,
    resetState,
    onClose,
  ]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-lg p-2 ${
                isCyberware
                  ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300"
                  : "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-300"
              }`}
            >
              <TypeIcon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Add {isCyberware ? "Cyberware" : "Bioware"}
            </h2>
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
            {/* Search and Filters */}
            <div className="space-y-3 border-b border-zinc-100 p-4 dark:border-zinc-800">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder={`Search ${isCyberware ? "cyberware" : "bioware"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      category === cat.id
                        ? isCyberware
                          ? "bg-cyan-500 text-white"
                          : "bg-pink-500 text-white"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Grade Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Grade:</span>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as CyberwareGrade | BiowareGrade)}
                  className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {availableGrades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {GRADE_DISPLAY[g.id]} ({g.essenceMultiplier}x ESS, {g.costMultiplier}x cost)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredItems.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No {isCyberware ? "cyberware" : "bioware"} found
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItemId === item.id;
                    const isRatedItem = hasUnifiedRatings(item);

                    // Get base values - for rated items, show minimum rating values
                    let baseEssence: number;
                    let baseCost: number;
                    let baseAvail: number;

                    if (isRatedItem) {
                      const minRating = item.minRating ?? 1;
                      const ratingValue = getRatingTableValue(item, minRating);
                      baseEssence = ratingValue?.essenceCost ?? 0;
                      baseCost = ratingValue?.cost ?? 0;
                      baseAvail = ratingValue?.availability ?? 0;
                    } else {
                      baseEssence = item.essenceCost ?? 0;
                      baseCost = item.cost ?? 0;
                      baseAvail = item.availability ?? 0;
                    }

                    // Calculate display values with grade modifiers
                    let displayEssence: number;
                    let displayCost: number;
                    let displayAvail: number;

                    if (isCyberware) {
                      displayEssence = calculateCyberwareEssenceCost(
                        baseEssence,
                        grade as CyberwareGrade,
                        cyberwareGrades
                      );
                      displayCost = calculateCyberwareCost(
                        baseCost,
                        grade as CyberwareGrade,
                        cyberwareGrades
                      );
                      displayAvail = calculateCyberwareAvailability(
                        baseAvail,
                        grade as CyberwareGrade,
                        cyberwareGrades
                      );
                    } else {
                      displayEssence = calculateBiowareEssenceCost(
                        baseEssence,
                        grade as BiowareGrade,
                        biowareGrades
                      );
                      displayCost = calculateBiowareCost(
                        baseCost,
                        grade as BiowareGrade,
                        biowareGrades
                      );
                      displayAvail = calculateBiowareAvailability(
                        baseAvail,
                        grade as BiowareGrade,
                        biowareGrades
                      );
                    }

                    const affordable = displayCost <= remainingNuyen;
                    const fitsEssence = displayEssence <= remainingEssence;
                    const isDisabled = !affordable || !fitsEssence;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItemId(item.id)}
                        disabled={isDisabled}
                        className={`flex w-full items-start justify-between rounded-lg p-3 text-left transition-colors ${
                          isSelected
                            ? isCyberware
                              ? "border border-cyan-500 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-900/20"
                              : "border border-pink-500 bg-pink-50 dark:border-pink-400 dark:bg-pink-900/20"
                            : isDisabled
                              ? "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {item.name}
                            {isRatedItem && (
                              <span className="ml-1 text-xs font-normal text-zinc-500 dark:text-zinc-400">
                                (R{item.minRating}-{item.maxRating})
                              </span>
                            )}
                          </span>
                          <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                            <span
                              className={
                                isCyberware
                                  ? "text-cyan-600 dark:text-cyan-400"
                                  : "text-pink-600 dark:text-pink-400"
                              }
                            >
                              {formatEssence(displayEssence)}{isRatedItem ? "+" : ""} ESS
                            </span>
                            <span>{formatCurrency(displayCost)}{isRatedItem ? "+" : ""}¥</span>
                            <span>Avail {getAvailabilityDisplay(displayAvail, item.legality)}{isRatedItem ? "+" : ""}</span>
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
            {selectedItem ? (
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

                  {/* Rating Selector for rated items */}
                  {rawSelectedItem && hasUnifiedRatings(rawSelectedItem) && (
                    <div className="mt-4">
                      <RatingSelector
                        item={rawSelectedItem}
                        selectedRating={selectedRating}
                        onRatingChange={setSelectedRating}
                        maxAvailability={maxAvailability}
                        showCostPreview={false}
                        showEssencePreview={false}
                        label="Rating"
                      />
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-zinc-50 p-3 text-center dark:bg-zinc-800">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Essence</div>
                      <div
                        className={`mt-1 text-xl font-bold ${
                          hasEssence
                            ? isCyberware
                              ? "text-cyan-600 dark:text-cyan-400"
                              : "text-pink-600 dark:text-pink-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formatEssence(selectedItem.essenceCost)}
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
                        {formatCurrency(selectedItem.cost)}¥
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
                        {getAvailabilityDisplay(selectedItem.availability, selectedItem.legality)}
                      </div>
                    </div>
                  </div>

                  {/* Capacity info for cyberware */}
                  {isCyberware && (selectedItem as CyberwareCatalogItemData).capacity && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        Capacity: {(selectedItem as CyberwareCatalogItemData).capacity} - Can install
                        enhancements
                      </span>
                    </div>
                  )}

                  {/* Attribute bonuses */}
                  {selectedItem.attributeBonuses &&
                    Object.keys(selectedItem.attributeBonuses).length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Attribute Bonuses
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Object.entries(selectedItem.attributeBonuses).map(([attr, bonus]) => (
                            <span
                              key={attr}
                              className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                            >
                              {attr}: +{bonus}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Wireless bonus */}
                  {isCyberware && (selectedItem as CyberwareCatalogItemData).wirelessBonus && (
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        Wireless Bonus
                      </h4>
                      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                        {(selectedItem as CyberwareCatalogItemData).wirelessBonus}
                      </p>
                    </div>
                  )}

                  {/* Magic/Resonance warning */}
                  {(isAwakened || isTechnomancer) && projectedMagicLoss > 0 && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      <div className="text-xs text-amber-800 dark:text-amber-200">
                        <p className="font-medium">
                          {isAwakened ? "Magic" : "Resonance"} will be reduced by {projectedMagicLoss}
                        </p>
                        <p className="mt-0.5">
                          New rating: {Math.max(0, (isAwakened ? currentMagic : currentResonance) - projectedMagicLoss)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Validation errors */}
                  {!canAfford && (
                    <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                      Not enough nuyen ({formatCurrency(remainingNuyen)}¥ remaining)
                    </div>
                  )}
                  {!hasEssence && (
                    <div className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                      Not enough essence ({formatEssence(remainingEssence)} remaining)
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
                        ? isCyberware
                          ? "bg-cyan-500 text-white hover:bg-cyan-600"
                          : "bg-pink-500 text-white hover:bg-pink-600"
                        : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    Add {isCyberware ? "Cyberware" : "Bioware"}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center">
                <div>
                  <TypeIcon className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                  <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                    Select {isCyberware ? "cyberware" : "bioware"} from the list to see details
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
