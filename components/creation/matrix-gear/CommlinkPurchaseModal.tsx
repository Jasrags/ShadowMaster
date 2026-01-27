"use client";

/**
 * CommlinkPurchaseModal
 *
 * Modal for browsing and purchasing commlinks during character creation.
 * Shows device rating, cost, and availability for each commlink.
 */

import { useState, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCommlinks, type CommlinkData } from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { BaseModalRoot } from "@/components/ui";
import { Search, X, Smartphone } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

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

interface CommlinkPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
  onPurchase: (commlink: CommlinkData) => void;
}

// =============================================================================
// COMMLINK LIST ITEM
// =============================================================================

function CommlinkListItem({
  commlink,
  isSelected,
  canAfford,
  onClick,
}: {
  commlink: CommlinkData;
  isSelected: boolean;
  canAfford: boolean;
  onClick: () => void;
}) {
  const isDisabled = !canAfford;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full rounded-lg border p-2.5 text-left transition-all ${
        isSelected
          ? "border-cyan-400 bg-cyan-50 dark:border-cyan-600 dark:bg-cyan-900/30"
          : !isDisabled
            ? "border-zinc-200 bg-white hover:border-cyan-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-cyan-500"
            : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-cyan-500" />
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {commlink.name}
            </span>
            <span className="rounded bg-cyan-100 px-1.5 py-0.5 text-[10px] font-medium text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400">
              DR {commlink.deviceRating}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Avail: {getAvailabilityDisplay(commlink.availability, commlink.legality)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(commlink.cost)}¥
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CommlinkPurchaseModal({
  isOpen,
  onClose,
  remaining,
  onPurchase,
}: CommlinkPurchaseModalProps) {
  const commlinks = useCommlinks({ maxAvailability: MAX_AVAILABILITY });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommlink, setSelectedCommlink] = useState<CommlinkData | null>(null);

  // Filter by search
  const filteredCommlinks = useMemo(() => {
    let items = [...commlinks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(query));
    }

    // Sort by device rating then name
    return items.sort((a, b) => a.deviceRating - b.deviceRating || a.name.localeCompare(b.name));
  }, [commlinks, searchQuery]);

  // Virtualization setup
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredCommlinks.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  const canAfford = selectedCommlink ? selectedCommlink.cost <= remaining : false;
  const canPurchase = canAfford && selectedCommlink;

  // Reset selection when modal opens/closes
  const handleClose = () => {
    setSearchQuery("");
    setSelectedCommlink(null);
    onClose();
  };

  const handlePurchase = () => {
    if (selectedCommlink && canPurchase) {
      onPurchase(selectedCommlink);
      setSelectedCommlink(null);
    }
  };

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="2xl">
      {({ close }) => (
        <div className="flex max-h-[85vh] flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Purchase Commlink
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {formatCurrency(remaining)}¥ available
              </p>
            </div>
            <button
              onClick={close}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search commlinks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Content - Split Pane */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Commlink List - Virtualized */}
            <div
              ref={scrollContainerRef}
              className="w-1/2 overflow-y-auto border-r border-zinc-100 p-4 dark:border-zinc-800"
            >
              {filteredCommlinks.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No commlinks found</p>
              ) : (
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const commlink = filteredCommlinks[virtualRow.index];
                    return (
                      <div
                        key={commlink.id}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                          padding: "4px 0",
                        }}
                      >
                        <CommlinkListItem
                          commlink={commlink}
                          isSelected={selectedCommlink?.id === commlink.id}
                          canAfford={commlink.cost <= remaining}
                          onClick={() => setSelectedCommlink(commlink)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Detail Preview */}
            <div className="w-1/2 overflow-y-auto p-4">
              {selectedCommlink ? (
                <div className="space-y-4">
                  {/* Commlink Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedCommlink.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Commlink</p>
                  </div>

                  {/* Description */}
                  {selectedCommlink.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedCommlink.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Statistics
                    </span>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Device Rating</span>
                      <span className="font-medium text-cyan-600 dark:text-cyan-400">
                        {selectedCommlink.deviceRating}
                      </span>
                    </div>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Data Processing</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {selectedCommlink.deviceRating}
                      </span>
                    </div>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Firewall</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {selectedCommlink.deviceRating}
                      </span>
                    </div>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Cost</span>
                      <span
                        className={`font-medium ${
                          !canAfford
                            ? "text-red-600 dark:text-red-400"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {formatCurrency(selectedCommlink.cost)}¥{!canAfford && " (over budget)"}
                      </span>
                    </div>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                      <span
                        className={`font-medium ${
                          selectedCommlink.legality === "forbidden"
                            ? "text-red-600 dark:text-red-400"
                            : selectedCommlink.legality === "restricted"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {getAvailabilityDisplay(
                          selectedCommlink.availability,
                          selectedCommlink.legality
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <div className="pt-2">
                    <button
                      onClick={handlePurchase}
                      disabled={!canPurchase}
                      className={`w-full rounded-lg py-3 text-sm font-medium transition-colors ${
                        canPurchase
                          ? "bg-cyan-500 text-white hover:bg-cyan-600"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                      }`}
                    >
                      {!canAfford
                        ? `Cannot Afford (${formatCurrency(selectedCommlink.cost)}¥)`
                        : `Purchase - ${formatCurrency(selectedCommlink.cost)}¥`}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-500">
                  <p className="text-sm">Select a commlink to see details</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3 dark:border-zinc-700">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {filteredCommlinks.length} items available
            </div>
            <button
              onClick={close}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </BaseModalRoot>
  );
}
