"use client";

/**
 * AutosoftModal
 *
 * Two-column modal for adding autosofts during character creation.
 * Left pane shows grouped autosoft list (by category), right pane shows
 * selected autosoft details with rating selector.
 *
 * Uses BaseModal for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback } from "react";
import { useAutosofts, type AutosoftCatalogItemData } from "@/lib/rules/RulesetContext";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Cpu, Check, AlertTriangle, Plus, Minus, Info } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

const AUTOSOFT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "combat", label: "Combat" },
  { id: "perception", label: "Perception" },
  { id: "movement", label: "Movement" },
  { id: "defense", label: "Defense" },
  { id: "stealth", label: "Stealth" },
  { id: "electronic-warfare", label: "EW" },
] as const;

type AutosoftCategory = (typeof AUTOSOFT_CATEGORIES)[number]["id"];

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  combat: "Combat",
  perception: "Perception",
  movement: "Movement",
  defense: "Defense",
  stealth: "Stealth",
  "electronic-warfare": "Electronic Warfare",
};

// =============================================================================
// TYPES
// =============================================================================

export interface AutosoftSelection {
  catalogId: string;
  name: string;
  category: string;
  rating: number;
  cost: number;
  availability: number;
  requiresTarget?: boolean;
  targetType?: "weapon" | "vehicle";
  target?: string;
}

interface AutosoftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (autosoft: AutosoftSelection) => void;
  remainingNuyen: number;
  ownedAutosoftIds?: string[];
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

function getMaxAvailableRating(availabilityPerRating: number, maxRating: number): number {
  if (availabilityPerRating === 0) return maxRating;
  const maxByAvailability = Math.floor(MAX_AVAILABILITY / availabilityPerRating);
  return Math.min(maxRating, maxByAvailability);
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AutosoftModal({
  isOpen,
  onClose,
  onAdd,
  remainingNuyen,
  ownedAutosoftIds = [],
}: AutosoftModalProps) {
  const autosofts = useAutosofts();

  // Filter state (preserved across items)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AutosoftCategory>("all");

  // Selection state (cleared after each add)
  const [selectedAutosoftId, setSelectedAutosoftId] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(1);

  // Session tracking
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Reset state when modal closes
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAutosoftId(null);
    setSelectedRating(1);
    setAddedThisSession(0);
  }, []);

  // Partial reset after adding (preserves search/filters)
  const resetForNextItem = useCallback(() => {
    setSelectedAutosoftId(null);
    setSelectedRating(1);
  }, []);

  // Filter autosofts
  const filteredAutosofts = useMemo(() => {
    let items = [...autosofts];

    // Filter out items with no available ratings
    items = items.filter((a) => getMaxAvailableRating(a.availabilityPerRating, a.maxRating) >= 1);

    // Filter by category
    if (selectedCategory !== "all") {
      items = items.filter((a) => a.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (a) => a.name.toLowerCase().includes(query) || a.category.toLowerCase().includes(query)
      );
    }

    return items;
  }, [autosofts, selectedCategory, searchQuery]);

  // Group autosofts by category
  const autosoftsByCategory = useMemo(() => {
    const grouped: Record<string, AutosoftCatalogItemData[]> = {};
    filteredAutosofts.forEach((autosoft) => {
      const cat = autosoft.category || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(autosoft);
    });
    // Sort autosofts within each category by name
    Object.values(grouped).forEach((autosoftList) => {
      autosoftList.sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [filteredAutosofts]);

  // Get selected autosoft data
  const selectedAutosoft = useMemo(() => {
    if (!selectedAutosoftId) return null;
    return autosofts.find((a) => a.id === selectedAutosoftId) || null;
  }, [autosofts, selectedAutosoftId]);

  // Calculate max available rating and cost for selected autosoft
  const maxAvailableRating = selectedAutosoft
    ? getMaxAvailableRating(selectedAutosoft.availabilityPerRating, selectedAutosoft.maxRating)
    : 6;

  const currentCost = selectedAutosoft ? selectedAutosoft.costPerRating * selectedRating : 0;
  const currentAvailability = selectedAutosoft
    ? selectedAutosoft.availabilityPerRating * selectedRating
    : 0;

  // When selecting a new autosoft, reset rating to 1
  const handleSelectAutosoft = useCallback(
    (id: string) => {
      setSelectedAutosoftId(id);
      setSelectedRating(1);
    },
    [setSelectedAutosoftId, setSelectedRating]
  );

  // Handle rating change
  const handleRatingChange = useCallback(
    (delta: number) => {
      const newRating = Math.max(1, Math.min(maxAvailableRating, selectedRating + delta));
      setSelectedRating(newRating);
    },
    [maxAvailableRating, selectedRating]
  );

  // Handle add autosoft
  const handleAddAutosoft = useCallback(() => {
    if (!selectedAutosoft) return;
    const canAfford = currentCost <= remainingNuyen;
    if (!canAfford) return;

    const selection: AutosoftSelection = {
      catalogId: selectedAutosoft.id,
      name: selectedAutosoft.name,
      category: selectedAutosoft.category,
      rating: selectedRating,
      cost: currentCost,
      availability: currentAvailability,
      requiresTarget: selectedAutosoft.requiresTarget,
      targetType: selectedAutosoft.targetType,
    };
    onAdd(selection);
    setAddedThisSession((prev) => prev + 1);
    resetForNextItem();
  }, [
    selectedAutosoft,
    selectedRating,
    currentCost,
    currentAvailability,
    remainingNuyen,
    onAdd,
    resetForNextItem,
  ]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Calculate if selected autosoft can be afforded
  const canAffordSelected = currentCost <= remainingNuyen;
  const isAlreadyOwned = selectedAutosoft ? ownedAutosoftIds.includes(selectedAutosoft.id) : false;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Autosoft" onClose={close}>
            <Cpu className="h-5 w-5 text-blue-500" />
          </ModalHeader>

          {/* Search and Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search autosofts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {/* Category Filter */}
            <div className="mt-3 flex flex-wrap gap-2">
              {AUTOSOFT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-blue-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane - Autosoft List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {Object.entries(autosoftsByCategory).map(([category, autosoftList]) => (
                  <div key={category}>
                    <div className="sticky top-0 z-10 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {CATEGORY_DISPLAY_NAMES[category] || category}
                    </div>
                    {autosoftList.map((autosoft) => {
                      const isSelected = selectedAutosoftId === autosoft.id;
                      const isOwned = ownedAutosoftIds.includes(autosoft.id);
                      const minCost = autosoft.costPerRating; // Rating 1 cost
                      const canAffordMin = minCost <= remainingNuyen;
                      const isDisabled = isOwned;

                      return (
                        <button
                          key={autosoft.id}
                          onClick={() => !isDisabled && handleSelectAutosoft(autosoft.id)}
                          disabled={isDisabled}
                          className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : isOwned
                                ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
                                : !canAffordMin
                                  ? "text-red-400 dark:text-red-500"
                                  : "rounded-md text-zinc-700 hover:outline hover:outline-1 hover:outline-blue-400 dark:text-zinc-300 dark:hover:outline-blue-500"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={isOwned ? "line-through" : ""}>{autosoft.name}</span>
                            {autosoft.requiresTarget && (
                              <span className="text-[10px] text-amber-500">
                                ({autosoft.targetType})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs ${!canAffordMin && !isOwned ? "text-red-400" : "text-zinc-400"}`}
                            >
                              {formatCurrency(autosoft.costPerRating)}¥/R
                            </span>
                            {isOwned && <Check className="h-4 w-4 text-emerald-500" />}
                            {!canAffordMin && !isOwned && (
                              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
                {Object.keys(autosoftsByCategory).length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">No autosofts found</div>
                )}
              </div>

              {/* Right Pane - Autosoft Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedAutosoft ? (
                  <div className="space-y-6">
                    {/* Autosoft Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedAutosoft.name}
                      </h3>
                      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {CATEGORY_DISPLAY_NAMES[selectedAutosoft.category] ||
                          selectedAutosoft.category}
                      </div>
                    </div>

                    {/* Description */}
                    {selectedAutosoft.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedAutosoft.description}
                      </p>
                    )}

                    {/* Target Requirement Warning */}
                    {selectedAutosoft.requiresTarget && (
                      <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                        <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>
                          This autosoft requires a specific {selectedAutosoft.targetType} target.
                          You&apos;ll specify this when assigning to a drone.
                        </span>
                      </div>
                    )}

                    {/* Rating Selector */}
                    <div>
                      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Rating
                      </label>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() => handleRatingChange(-1)}
                          disabled={selectedRating <= 1}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                            selectedRating > 1
                              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-zinc-100 text-xl font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                          {selectedRating}
                        </div>
                        <button
                          onClick={() => handleRatingChange(1)}
                          disabled={
                            selectedRating >= maxAvailableRating ||
                            selectedAutosoft.costPerRating * (selectedRating + 1) > remainingNuyen
                          }
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                            selectedRating < maxAvailableRating &&
                            selectedAutosoft.costPerRating * (selectedRating + 1) <= remainingNuyen
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-zinc-400">Max: {maxAvailableRating}</span>
                      </div>
                    </div>

                    {/* Stats at current rating */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Availability
                        </div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {currentAvailability}
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Cost per Rating
                        </div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(selectedAutosoft.costPerRating)}¥
                        </div>
                      </div>
                    </div>

                    {/* Cost Card */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Cost (Rating {selectedRating})
                        </span>
                        <span
                          className={`text-lg font-semibold ${
                            !canAffordSelected
                              ? "text-red-600 dark:text-red-400"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {formatCurrency(currentCost)}¥
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Remaining</span>
                        <span
                          className={`font-medium ${
                            remainingNuyen - currentCost < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {formatCurrency(remainingNuyen - currentCost)}¥
                        </span>
                      </div>
                    </div>

                    {/* Already owned warning */}
                    {isAlreadyOwned && (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                        <Check className="h-4 w-4" />
                        <span>You already own this autosoft</span>
                      </div>
                    )}

                    {/* Can't afford warning */}
                    {!canAffordSelected && !isAlreadyOwned && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Insufficient funds</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                    <Cpu className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select an autosoft from the list</p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {addedThisSession > 0 && (
                <span className="mr-2 text-emerald-600 dark:text-emerald-400">
                  {addedThisSession} added
                </span>
              )}
              <span>
                Budget:{" "}
                <span
                  className={`font-medium ${remainingNuyen < 0 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}
                >
                  {formatCurrency(remainingNuyen)}¥
                </span>{" "}
                remaining
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
                onClick={handleAddAutosoft}
                disabled={!selectedAutosoft || !canAffordSelected || isAlreadyOwned}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedAutosoft && canAffordSelected && !isAlreadyOwned
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Add Autosoft
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
