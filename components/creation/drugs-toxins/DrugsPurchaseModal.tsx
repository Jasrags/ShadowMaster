"use client";

/**
 * DrugsPurchaseModal
 *
 * Split-pane modal for browsing and purchasing drugs and toxins.
 * Left side: Tab filter (Drugs/Toxins), search, and item list
 * Right side: Selected item details with quantity selection
 *
 * Follows the bulk-add pattern: modal stays open after adding items.
 */

import { useState, useMemo, useCallback } from "react";
import {
  useDrugs,
  useToxins,
  type DrugCatalogItemData,
  type ToxinCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { isLegalAtCreation, CREATION_CONSTRAINTS } from "@/lib/rules/gear/validation";
import { BaseModalRoot, ModalFooter } from "@/components/ui";
import { Search, X, Check, AlertTriangle, Pill, FlaskConical } from "lucide-react";
import { BulkQuantitySelector } from "@/components/creation/shared/BulkQuantitySelector";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = CREATION_CONSTRAINTS.maxAvailabilityAtCreation;

type CatalogTab = "drugs" | "toxins";

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
// TYPES
// =============================================================================

type CatalogItem = DrugCatalogItemData | ToxinCatalogItemData;

interface DrugsPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
  onPurchaseDrug: (drug: DrugCatalogItemData, quantity: number) => void;
  onPurchaseToxin: (toxin: ToxinCatalogItemData, quantity: number) => void;
  purchasedDrugIds?: string[];
  purchasedToxinIds?: string[];
}

// =============================================================================
// LIST ITEM COMPONENT
// =============================================================================

function CatalogListItem({
  item,
  isSelected,
  canAfford,
  isAlreadyAdded,
  isOverAvailability,
  onClick,
}: {
  item: CatalogItem;
  isSelected: boolean;
  canAfford: boolean;
  isAlreadyAdded: boolean;
  isOverAvailability: boolean;
  onClick: () => void;
}) {
  const isDisabled = isOverAvailability || isAlreadyAdded;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isSelected
          ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/20"
          : isAlreadyAdded
            ? "cursor-not-allowed border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
            : isOverAvailability
              ? "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
              : "border-zinc-200 bg-white hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-500/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`truncate text-sm font-medium ${
                isAlreadyAdded || isOverAvailability
                  ? "text-zinc-400 line-through dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {item.name}
            </span>
            {isAlreadyAdded && <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />}
            {isOverAvailability && !isAlreadyAdded && (
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
            )}
          </div>
          <div
            className={`mt-0.5 flex flex-wrap gap-x-2 text-xs ${
              isAlreadyAdded || isOverAvailability
                ? "text-zinc-400 dark:text-zinc-500"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <span>{item.vector.join(", ")}</span>
            <span>Avail: {getAvailabilityDisplay(item.availability, item.legality)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div
            className={`font-mono text-sm font-medium ${
              isAlreadyAdded || isOverAvailability
                ? "text-zinc-400 dark:text-zinc-500"
                : !canAfford
                  ? "text-red-600 dark:text-red-400"
                  : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {formatCurrency(item.cost)}¥
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DrugsPurchaseModal({
  isOpen,
  onClose,
  remaining,
  onPurchaseDrug,
  onPurchaseToxin,
  purchasedDrugIds = [],
  purchasedToxinIds = [],
}: DrugsPurchaseModalProps) {
  const drugsCatalog = useDrugs();
  const toxinsCatalog = useToxins();

  const [activeTab, setActiveTab] = useState<CatalogTab>("drugs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [selectedPacks, setSelectedPacks] = useState(1);
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Get items for current tab
  const currentItems = useMemo(() => {
    const items = activeTab === "drugs" ? drugsCatalog : toxinsCatalog;
    let filtered = [...items];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.vector.some((v) => v.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [activeTab, drugsCatalog, toxinsCatalog, searchQuery]);

  // Calculate selected item cost
  const selectedItemCost = useMemo(() => {
    if (!selectedItem) return 0;
    return selectedItem.cost * selectedPacks;
  }, [selectedItem, selectedPacks]);

  const canAfford = selectedItemCost <= remaining;
  const availabilityOk = selectedItem ? selectedItem.availability <= MAX_AVAILABILITY : false;
  const canPurchase = canAfford && availabilityOk && selectedItem !== null;

  // Check purchased IDs
  const purchasedIds = activeTab === "drugs" ? purchasedDrugIds : purchasedToxinIds;

  // Full reset on close
  const resetState = useCallback(() => {
    setSearchQuery("");
    setActiveTab("drugs");
    setSelectedItem(null);
    setSelectedPacks(1);
    setAddedThisSession(0);
  }, []);

  // Partial reset after adding
  const resetForNextItem = useCallback(() => {
    setSelectedItem(null);
    setSelectedPacks(1);
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  const handlePurchase = useCallback(() => {
    if (!selectedItem || !canPurchase) return;

    if (activeTab === "drugs") {
      onPurchaseDrug(selectedItem as DrugCatalogItemData, selectedPacks);
    } else {
      onPurchaseToxin(selectedItem as ToxinCatalogItemData, selectedPacks);
    }
    setAddedThisSession((prev) => prev + 1);
    resetForNextItem();
  }, [
    selectedItem,
    canPurchase,
    activeTab,
    onPurchaseDrug,
    onPurchaseToxin,
    selectedPacks,
    resetForNextItem,
  ]);

  const handleSelectItem = useCallback((item: CatalogItem) => {
    setSelectedItem(item);
    setSelectedPacks(1);
  }, []);

  const handleTabChange = useCallback((tab: CatalogTab) => {
    setActiveTab(tab);
    setSelectedItem(null);
    setSelectedPacks(1);
  }, []);

  // Drug-specific detail rendering
  const isDrug = (item: CatalogItem): item is DrugCatalogItemData => {
    return "addictionType" in item;
  };

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="2xl">
      {({ close }) => (
        <div className="flex max-h-[85vh] flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Purchase Drugs & Toxins
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

          {/* Tab Filters */}
          <div className="flex gap-1.5 border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            <button
              onClick={() => handleTabChange("drugs")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "drugs"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <Pill className="h-3.5 w-3.5" />
              Drugs
              <span
                className={
                  activeTab === "drugs" ? "text-emerald-100" : "text-zinc-400 dark:text-zinc-500"
                }
              >
                ({drugsCatalog.length})
              </span>
            </button>
            <button
              onClick={() => handleTabChange("toxins")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "toxins"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <FlaskConical className="h-3.5 w-3.5" />
              Toxins
              <span
                className={
                  activeTab === "toxins" ? "text-emerald-100" : "text-zinc-400 dark:text-zinc-500"
                }
              >
                ({toxinsCatalog.length})
              </span>
            </button>
          </div>

          {/* Search */}
          <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Content - Split Pane */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Item List */}
            <div className="w-1/2 space-y-2 overflow-y-auto border-r border-zinc-100 p-4 dark:border-zinc-800">
              {currentItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No {activeTab} found</p>
              ) : (
                currentItems.map((item) => {
                  const isAlreadyAdded = purchasedIds.includes(item.id);
                  const isOverAvailability = item.availability > MAX_AVAILABILITY;
                  return (
                    <CatalogListItem
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      canAfford={item.cost <= remaining}
                      isAlreadyAdded={isAlreadyAdded}
                      isOverAvailability={isOverAvailability}
                      onClick={() => handleSelectItem(item)}
                    />
                  );
                })
              )}
            </div>

            {/* Right: Detail Preview */}
            <div className="w-1/2 overflow-y-auto p-4">
              {selectedItem ? (
                <div className="space-y-4">
                  {/* Item Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedItem.name}
                    </h3>
                    <p className="text-sm capitalize text-zinc-500 dark:text-zinc-400">
                      {selectedItem.category}
                    </p>
                  </div>

                  {/* Description */}
                  {selectedItem.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedItem.description}
                    </p>
                  )}

                  {/* Vector Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.vector.map((v) => (
                      <span
                        key={v}
                        className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {v}
                      </span>
                    ))}
                  </div>

                  {/* Drug-specific Details */}
                  {isDrug(selectedItem) && (
                    <>
                      {/* Addiction Info */}
                      <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                          Addiction
                        </span>
                        <div className="mt-1 grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-amber-600 dark:text-amber-400">Type</span>
                            <p className="font-medium capitalize text-amber-800 dark:text-amber-200">
                              {selectedItem.addictionType}
                            </p>
                          </div>
                          <div>
                            <span className="text-amber-600 dark:text-amber-400">Rating</span>
                            <p className="font-medium text-amber-800 dark:text-amber-200">
                              {selectedItem.addictionRating}
                            </p>
                          </div>
                          <div>
                            <span className="text-amber-600 dark:text-amber-400">Threshold</span>
                            <p className="font-medium text-amber-800 dark:text-amber-200">
                              {selectedItem.addictionThreshold}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Active Effects */}
                      {selectedItem.effects.active && (
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Active Effects
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {Object.entries(selectedItem.effects.active)
                              .filter(([key]) => key !== "description")
                              .map(([key, value]) => (
                                <span
                                  key={key}
                                  className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                >
                                  {key}: {String(value)}
                                </span>
                              ))}
                          </div>
                          {Boolean(
                            (selectedItem.effects.active as Record<string, unknown>).description
                          ) && (
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              {String(
                                (selectedItem.effects.active as Record<string, unknown>).description
                              )}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Crash Effects */}
                      {selectedItem.effects.crash && (
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                            Crash Effects
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {Object.entries(selectedItem.effects.crash)
                              .filter(([key]) => key !== "description")
                              .map(([key, value]) => (
                                <span
                                  key={key}
                                  className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                >
                                  {key}: {String(value)}
                                </span>
                              ))}
                          </div>
                          {Boolean(
                            (selectedItem.effects.crash as Record<string, unknown>).description
                          ) && (
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              {String(
                                (selectedItem.effects.crash as Record<string, unknown>).description
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Toxin-specific Details */}
                  {!isDrug(selectedItem) && (
                    <>
                      {/* Power & Penetration */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                          <span className="text-xs text-purple-600 dark:text-purple-400">
                            Power
                          </span>
                          <p className="text-lg font-mono font-bold text-purple-800 dark:text-purple-200">
                            {(selectedItem as ToxinCatalogItemData).power}
                          </p>
                        </div>
                        <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                          <span className="text-xs text-purple-600 dark:text-purple-400">
                            Penetration
                          </span>
                          <p className="text-lg font-mono font-bold text-purple-800 dark:text-purple-200">
                            {(selectedItem as ToxinCatalogItemData).penetration}
                          </p>
                        </div>
                      </div>

                      {/* Effects */}
                      {(selectedItem as ToxinCatalogItemData).effects.length > 0 && (
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Effects
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {(selectedItem as ToxinCatalogItemData).effects.map((effect) => (
                              <span
                                key={effect}
                                className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                              >
                                {effect.replace(/-/g, " ")}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Common Stats */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Statistics
                    </span>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Speed</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {selectedItem.speed}
                      </span>
                    </div>
                    {"duration" in selectedItem && selectedItem.duration && (
                      <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                        <span className="text-zinc-500 dark:text-zinc-400">Duration</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {selectedItem.duration}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                      <span
                        className={`font-medium ${
                          selectedItem.legality === "forbidden"
                            ? "text-red-600 dark:text-red-400"
                            : selectedItem.legality === "restricted"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {getAvailabilityDisplay(selectedItem.availability, selectedItem.legality)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <BulkQuantitySelector
                    packSize={1}
                    unitLabel="doses"
                    pricePerPack={selectedItem.cost}
                    remaining={remaining}
                    selectedPacks={selectedPacks}
                    onPacksChange={setSelectedPacks}
                    packLabel="dose"
                  />

                  {/* Legality Warning */}
                  {(selectedItem.legality === "restricted" ||
                    selectedItem.legality === "forbidden") && (
                    <div
                      className={`rounded-lg p-3 ${
                        selectedItem.legality === "forbidden"
                          ? "bg-red-50 dark:bg-red-900/20"
                          : "bg-amber-50 dark:bg-amber-900/20"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                          selectedItem.legality === "forbidden"
                            ? "text-red-700 dark:text-red-300"
                            : "text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {selectedItem.legality === "forbidden" ? "Forbidden" : "Restricted"}
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
                  <p className="text-sm">
                    Select {activeTab === "drugs" ? "a drug" : "a toxin"} to see details
                  </p>
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
                {canPurchase && selectedItem
                  ? `Add ${selectedPacks > 1 ? `${selectedPacks} doses` : "1 dose"} (${formatCurrency(selectedItemCost)}¥)`
                  : `Add ${activeTab === "drugs" ? "Drug" : "Toxin"}`}
              </button>
            </div>
          </ModalFooter>
        </div>
      )}
    </BaseModalRoot>
  );
}
