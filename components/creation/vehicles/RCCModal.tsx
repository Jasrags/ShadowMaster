"use client";

/**
 * RCCModal
 *
 * Two-column modal for adding Rigger Command Consoles during character creation.
 * Left pane shows grouped RCC list (by rating tier), right pane shows selected RCC details.
 *
 * Uses BaseModal for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback } from "react";
import { useRCCs, type RCCCatalogItemData } from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Wifi, Check, AlertTriangle } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

const RCC_TIERS = [
  { id: "all", label: "All" },
  { id: "entry", label: "Entry (1-2)" },
  { id: "professional", label: "Professional (3-4)" },
  { id: "elite", label: "Elite (5-6)" },
] as const;

type RCCTier = (typeof RCC_TIERS)[number]["id"];

const TIER_DISPLAY_NAMES: Record<string, string> = {
  entry: "Entry Level (Rating 1-2)",
  professional: "Professional (Rating 3-4)",
  elite: "Elite Grade (Rating 5-6)",
};

function getRatingTier(rating: number): string {
  if (rating <= 2) return "entry";
  if (rating <= 4) return "professional";
  return "elite";
}

// =============================================================================
// TYPES
// =============================================================================

export interface RCCSelection {
  catalogId: string;
  name: string;
  deviceRating: number;
  dataProcessing: number;
  firewall: number;
  cost: number;
  availability: number;
  legality?: ItemLegality;
}

interface RCCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (rcc: RCCSelection) => void;
  remainingNuyen: number;
  ownedRCCIds?: string[];
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

function isItemAvailable(availability: number): boolean {
  return availability <= MAX_AVAILABILITY;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function RCCModal({
  isOpen,
  onClose,
  onAdd,
  remainingNuyen,
  ownedRCCIds = [],
}: RCCModalProps) {
  const rccs = useRCCs();

  // Filter state (preserved across items)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<RCCTier>("all");

  // Selection state (cleared after each add)
  const [selectedRCCId, setSelectedRCCId] = useState<string | null>(null);

  // Session tracking
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Reset state when modal closes
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedTier("all");
    setSelectedRCCId(null);
    setAddedThisSession(0);
  }, []);

  // Partial reset after adding (preserves search/filters)
  const resetForNextItem = useCallback(() => {
    setSelectedRCCId(null);
  }, []);

  // Filter RCCs
  const filteredRCCs = useMemo(() => {
    let items = [...rccs];

    // Filter by availability
    items = items.filter((r) => isItemAvailable(r.availability));

    // Filter by tier
    if (selectedTier !== "all") {
      items = items.filter((r) => getRatingTier(r.deviceRating) === selectedTier);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((r) => r.name.toLowerCase().includes(query));
    }

    return items;
  }, [rccs, selectedTier, searchQuery]);

  // Group RCCs by tier
  const rccsByTier = useMemo(() => {
    const grouped: Record<string, RCCCatalogItemData[]> = {};
    filteredRCCs.forEach((rcc) => {
      const tier = getRatingTier(rcc.deviceRating);
      if (!grouped[tier]) grouped[tier] = [];
      grouped[tier].push(rcc);
    });
    // Sort RCCs within each tier by device rating, then by name
    Object.values(grouped).forEach((rccList) => {
      rccList.sort((a, b) => {
        if (a.deviceRating !== b.deviceRating) return a.deviceRating - b.deviceRating;
        return a.name.localeCompare(b.name);
      });
    });
    return grouped;
  }, [filteredRCCs]);

  // Get selected RCC data
  const selectedRCC = useMemo(() => {
    if (!selectedRCCId) return null;
    return rccs.find((r) => r.id === selectedRCCId) || null;
  }, [rccs, selectedRCCId]);

  // Handle add RCC
  const handleAddRCC = useCallback(() => {
    if (!selectedRCC) return;
    const canAfford = selectedRCC.cost <= remainingNuyen;
    if (!canAfford) return;

    const selection: RCCSelection = {
      catalogId: selectedRCC.id,
      name: selectedRCC.name,
      deviceRating: selectedRCC.deviceRating,
      dataProcessing: selectedRCC.dataProcessing,
      firewall: selectedRCC.firewall,
      cost: selectedRCC.cost,
      availability: selectedRCC.availability,
      legality: selectedRCC.legality,
    };
    onAdd(selection);
    setAddedThisSession((prev) => prev + 1);
    resetForNextItem();
  }, [selectedRCC, remainingNuyen, onAdd, resetForNextItem]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Calculate if selected RCC can be afforded
  const canAffordSelected = selectedRCC ? selectedRCC.cost <= remainingNuyen : false;
  const isAlreadyOwned = selectedRCC ? ownedRCCIds.includes(selectedRCC.id) : false;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add RCC" onClose={close}>
            <Wifi className="h-5 w-5 text-blue-500" />
          </ModalHeader>

          {/* Search and Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search RCCs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {/* Tier Filter */}
            <div className="mt-3 flex flex-wrap gap-2">
              {RCC_TIERS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedTier === tier.id
                      ? "bg-blue-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane - RCC List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {Object.entries(rccsByTier).map(([tier, rccList]) => (
                  <div key={tier}>
                    <div className="sticky top-0 z-10 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {TIER_DISPLAY_NAMES[tier] || tier}
                    </div>
                    {rccList.map((rcc) => {
                      const isSelected = selectedRCCId === rcc.id;
                      const isOwned = ownedRCCIds.includes(rcc.id);
                      const canAfford = rcc.cost <= remainingNuyen;
                      const isDisabled = isOwned;

                      return (
                        <button
                          key={rcc.id}
                          onClick={() => !isDisabled && setSelectedRCCId(rcc.id)}
                          disabled={isDisabled}
                          className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : isOwned
                                ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
                                : !canAfford
                                  ? "text-red-400 dark:text-red-500"
                                  : "rounded-md text-zinc-700 hover:outline hover:outline-1 hover:outline-blue-400 dark:text-zinc-300 dark:hover:outline-blue-500"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={isOwned ? "line-through" : ""}>{rcc.name}</span>
                            <span className="text-xs text-zinc-400">R{rcc.deviceRating}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs ${!canAfford && !isOwned ? "text-red-400" : "text-zinc-400"}`}
                            >
                              {formatCurrency(rcc.cost)}¥
                            </span>
                            {isOwned && <Check className="h-4 w-4 text-emerald-500" />}
                            {!canAfford && !isOwned && (
                              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
                {Object.keys(rccsByTier).length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">No RCCs found</div>
                )}
              </div>

              {/* Right Pane - RCC Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedRCC ? (
                  <div className="space-y-6">
                    {/* RCC Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedRCC.name}
                      </h3>
                      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Rigger Command Console
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Device Rating
                        </div>
                        <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {selectedRCC.deviceRating}
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Data Processing
                        </div>
                        <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                          {selectedRCC.dataProcessing}
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Firewall
                        </div>
                        <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                          {selectedRCC.firewall}
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Availability</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {getAvailabilityDisplay(selectedRCC.availability, selectedRCC.legality)}
                        </span>
                      </div>
                    </div>

                    {/* Features Info */}
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        RCC Features
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                        <li>• Share up to {selectedRCC.deviceRating} autosofts with drones</li>
                        <li>
                          • Control up to {selectedRCC.deviceRating * 3} drones simultaneously
                        </li>
                        <li>• Noise reduction: {selectedRCC.deviceRating}</li>
                      </ul>
                    </div>

                    {/* Description if available */}
                    {selectedRCC.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedRCC.description}
                      </p>
                    )}

                    {/* Cost Card */}
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Cost
                        </span>
                        <span
                          className={`text-lg font-semibold ${
                            !canAffordSelected
                              ? "text-red-600 dark:text-red-400"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {formatCurrency(selectedRCC.cost)}¥
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Remaining</span>
                        <span
                          className={`font-medium ${
                            remainingNuyen - selectedRCC.cost < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {formatCurrency(remainingNuyen - selectedRCC.cost)}¥
                        </span>
                      </div>
                    </div>

                    {/* Already owned warning */}
                    {isAlreadyOwned && (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                        <Check className="h-4 w-4" />
                        <span>You already own this RCC</span>
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
                    <Wifi className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select an RCC from the list</p>
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
                onClick={handleAddRCC}
                disabled={!selectedRCC || !canAffordSelected || isAlreadyOwned}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedRCC && canAffordSelected && !isAlreadyOwned
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Add RCC
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
