"use client";

/**
 * AutosoftModal
 *
 * Modal for adding autosofts during character creation.
 * Autosofts have ratings, so this modal includes a rating selector.
 */

import { useMemo, useState } from "react";
import { useAutosofts, type AutosoftCatalogItemData } from "@/lib/rules/RulesetContext";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Cpu, Plus, Minus } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

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

function isItemAvailable(availabilityPerRating: number, rating: number): boolean {
  return availabilityPerRating * rating <= MAX_AVAILABILITY;
}

function getMaxAvailableRating(availabilityPerRating: number, maxRating: number): number {
  if (availabilityPerRating === 0) return maxRating;
  const maxByAvailability = Math.floor(MAX_AVAILABILITY / availabilityPerRating);
  return Math.min(maxRating, maxByAvailability);
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AutosoftModal({ isOpen, onClose, onAdd, remainingNuyen }: AutosoftModalProps) {
  const autosofts = useAutosofts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRatings, setSelectedRatings] = useState<Record<string, number>>({});

  // Filter autosofts
  const filteredAutosofts = useMemo(() => {
    let items = [...autosofts];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((a) => a.name.toLowerCase().includes(query));
    }
    // Filter out items with no available ratings
    return items.filter((a) => getMaxAvailableRating(a.availabilityPerRating, a.maxRating) >= 1);
  }, [autosofts, searchQuery]);

  // Get current rating for an autosoft
  const getRating = (
    autosoftId: string,
    maxRating: number,
    availabilityPerRating: number
  ): number => {
    const maxAvailable = getMaxAvailableRating(availabilityPerRating, maxRating);
    return selectedRatings[autosoftId] || Math.min(1, maxAvailable);
  };

  // Update rating
  const updateRating = (
    autosoftId: string,
    delta: number,
    maxRating: number,
    availabilityPerRating: number
  ) => {
    const maxAvailable = getMaxAvailableRating(availabilityPerRating, maxRating);
    const currentRating = getRating(autosoftId, maxRating, availabilityPerRating);
    const newRating = Math.max(1, Math.min(maxAvailable, currentRating + delta));
    setSelectedRatings((prev) => ({ ...prev, [autosoftId]: newRating }));
  };

  // Handle add
  const handleAdd = (autosoft: AutosoftCatalogItemData) => {
    const rating = getRating(autosoft.id, autosoft.maxRating, autosoft.availabilityPerRating);
    const cost = autosoft.costPerRating * rating;
    const availability = autosoft.availabilityPerRating * rating;

    const selection: AutosoftSelection = {
      catalogId: autosoft.id,
      name: autosoft.name,
      category: autosoft.category,
      rating,
      cost,
      availability,
      requiresTarget: autosoft.requiresTarget,
      targetType: autosoft.targetType,
    };
    onAdd(selection);
  };

  return (
    <BaseModalRoot isOpen={isOpen} onClose={onClose} size="2xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Autosoft" onClose={close}>
            <Cpu className="h-5 w-5 text-emerald-500" />
          </ModalHeader>

          {/* Budget */}
          <div className="border-b border-zinc-200 px-4 py-2 dark:border-zinc-700">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Budget:{" "}
              <span
                className={`font-medium ${remainingNuyen < 0 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}
              >
                {formatCurrency(remainingNuyen)}¥
              </span>{" "}
              remaining
            </span>
          </div>

          {/* Search */}
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search autosofts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <ModalBody className="p-4">
            <div className="space-y-2">
              {filteredAutosofts.map((autosoft) => {
                const maxAvailable = getMaxAvailableRating(
                  autosoft.availabilityPerRating,
                  autosoft.maxRating
                );
                const rating = getRating(
                  autosoft.id,
                  autosoft.maxRating,
                  autosoft.availabilityPerRating
                );
                const cost = autosoft.costPerRating * rating;
                const availability = autosoft.availabilityPerRating * rating;
                const canAfford = cost <= remainingNuyen;

                return (
                  <div
                    key={autosoft.id}
                    className={`rounded-lg border p-3 ${
                      canAfford
                        ? "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                        : "border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {autosoft.name}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>{autosoft.category}</span>
                          <span>Avail: {availability}</span>
                          {autosoft.requiresTarget && (
                            <span className="text-amber-600 dark:text-amber-400">
                              Requires {autosoft.targetType}
                            </span>
                          )}
                        </div>
                        {/* Rating selector */}
                        <div className="mt-2 flex items-center gap-1">
                          <span className="mr-2 text-xs text-zinc-500 dark:text-zinc-400">
                            1-{maxAvailable}
                          </span>
                          <button
                            onClick={() =>
                              updateRating(
                                autosoft.id,
                                -1,
                                autosoft.maxRating,
                                autosoft.availabilityPerRating
                              )
                            }
                            disabled={rating <= 1}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-300 disabled:opacity-30 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <div className="flex h-7 w-8 items-center justify-center rounded-lg bg-zinc-200 text-sm font-medium text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100">
                            {rating}
                          </div>
                          <button
                            onClick={() =>
                              updateRating(
                                autosoft.id,
                                1,
                                autosoft.maxRating,
                                autosoft.availabilityPerRating
                              )
                            }
                            disabled={rating >= maxAvailable}
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:opacity-30"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="ml-3 flex flex-col items-end gap-2">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(cost)}¥
                        </span>
                        <button
                          onClick={() => handleAdd(autosoft)}
                          disabled={!canAfford}
                          className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                            canAfford
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                          }`}
                        >
                          <Plus className="h-3 w-3" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredAutosofts.length === 0 && (
                <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No autosofts found
                </div>
              )}
            </div>
          </ModalBody>

          <ModalFooter className="justify-end">
            <button
              onClick={close}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Close
            </button>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
