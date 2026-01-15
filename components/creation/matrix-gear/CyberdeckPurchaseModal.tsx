"use client";

/**
 * CyberdeckPurchaseModal
 *
 * Modal for browsing and purchasing cyberdecks during character creation.
 * Shows device rating, ASDF attributes, program slots, cost, and availability.
 */

import { useState, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCyberdecks, type CyberdeckData } from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { BaseModalRoot } from "@/components/ui";
import { Search, X, Cpu, AlertTriangle } from "lucide-react";

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

function formatAttributeArray(deck: CyberdeckData): string {
  const attrs = deck.attributes;
  return `${attrs.attack}/${attrs.sleaze}/${attrs.dataProcessing}/${attrs.firewall}`;
}

// =============================================================================
// TYPES
// =============================================================================

interface CyberdeckPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
  onPurchase: (cyberdeck: CyberdeckData) => void;
}

// =============================================================================
// CYBERDECK LIST ITEM
// =============================================================================

function CyberdeckListItem({
  cyberdeck,
  isSelected,
  canAfford,
  onClick,
}: {
  cyberdeck: CyberdeckData;
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
          ? "border-purple-400 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/30"
          : !isDisabled
            ? "border-zinc-200 bg-white hover:border-purple-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-purple-500"
            : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-purple-500" />
            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {cyberdeck.name}
            </span>
            <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">
              DR {cyberdeck.deviceRating}
            </span>
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>ASDF: {formatAttributeArray(cyberdeck)}</span>
            <span>Programs: {cyberdeck.programs}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatCurrency(cyberdeck.cost)}¥
          </div>
          <div className="text-xs text-zinc-500">
            {getAvailabilityDisplay(cyberdeck.availability, cyberdeck.legality)}
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CyberdeckPurchaseModal({
  isOpen,
  onClose,
  remaining,
  onPurchase,
}: CyberdeckPurchaseModalProps) {
  const cyberdecks = useCyberdecks({ maxAvailability: MAX_AVAILABILITY });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCyberdeck, setSelectedCyberdeck] = useState<CyberdeckData | null>(null);

  // Filter by search
  const filteredCyberdecks = useMemo(() => {
    let items = [...cyberdecks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((c) => c.name.toLowerCase().includes(query));
    }

    // Sort by device rating then name
    return items.sort((a, b) => a.deviceRating - b.deviceRating || a.name.localeCompare(b.name));
  }, [cyberdecks, searchQuery]);

  // Virtualization setup
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredCyberdecks.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  const canAfford = selectedCyberdeck ? selectedCyberdeck.cost <= remaining : false;
  const canPurchase = canAfford && selectedCyberdeck;

  // Reset selection when modal opens/closes
  const handleClose = () => {
    setSearchQuery("");
    setSelectedCyberdeck(null);
    onClose();
  };

  const handlePurchase = () => {
    if (selectedCyberdeck && canPurchase) {
      onPurchase(selectedCyberdeck);
      setSelectedCyberdeck(null);
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
                Purchase Cyberdeck
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
                placeholder="Search cyberdecks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Content - Split Pane */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left: Cyberdeck List - Virtualized */}
            <div
              ref={scrollContainerRef}
              className="w-1/2 overflow-y-auto border-r border-zinc-100 p-4 dark:border-zinc-800"
            >
              {filteredCyberdecks.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500">No cyberdecks found</p>
              ) : (
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const cyberdeck = filteredCyberdecks[virtualRow.index];
                    return (
                      <div
                        key={cyberdeck.id}
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
                        <CyberdeckListItem
                          cyberdeck={cyberdeck}
                          isSelected={selectedCyberdeck?.id === cyberdeck.id}
                          canAfford={cyberdeck.cost <= remaining}
                          onClick={() => setSelectedCyberdeck(cyberdeck)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Detail Preview */}
            <div className="w-1/2 overflow-y-auto p-4">
              {selectedCyberdeck ? (
                <div className="space-y-4">
                  {/* Cyberdeck Name */}
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {selectedCyberdeck.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Cyberdeck</p>
                  </div>

                  {/* Description */}
                  {selectedCyberdeck.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {selectedCyberdeck.description}
                    </p>
                  )}

                  {/* Device Stats */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Device Statistics
                    </span>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Device Rating</span>
                      <span className="font-medium text-purple-600 dark:text-purple-400">
                        {selectedCyberdeck.deviceRating}
                      </span>
                    </div>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Program Slots</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {selectedCyberdeck.programs}
                      </span>
                    </div>
                  </div>

                  {/* ASDF Attributes */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Matrix Attributes (ASDF)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex justify-between rounded bg-red-50 px-3 py-2 text-sm dark:bg-red-900/20">
                        <span className="text-red-600 dark:text-red-400">Attack</span>
                        <span className="font-medium text-red-700 dark:text-red-300">
                          {selectedCyberdeck.attributes.attack}
                        </span>
                      </div>
                      <div className="flex justify-between rounded bg-yellow-50 px-3 py-2 text-sm dark:bg-yellow-900/20">
                        <span className="text-yellow-600 dark:text-yellow-400">Sleaze</span>
                        <span className="font-medium text-yellow-700 dark:text-yellow-300">
                          {selectedCyberdeck.attributes.sleaze}
                        </span>
                      </div>
                      <div className="flex justify-between rounded bg-blue-50 px-3 py-2 text-sm dark:bg-blue-900/20">
                        <span className="text-blue-600 dark:text-blue-400">Data Proc</span>
                        <span className="font-medium text-blue-700 dark:text-blue-300">
                          {selectedCyberdeck.attributes.dataProcessing}
                        </span>
                      </div>
                      <div className="flex justify-between rounded bg-green-50 px-3 py-2 text-sm dark:bg-green-900/20">
                        <span className="text-green-600 dark:text-green-400">Firewall</span>
                        <span className="font-medium text-green-700 dark:text-green-300">
                          {selectedCyberdeck.attributes.firewall}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cost & Availability */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Purchase Info
                    </span>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Cost</span>
                      <span
                        className={`font-medium ${
                          !canAfford
                            ? "text-red-600 dark:text-red-400"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {formatCurrency(selectedCyberdeck.cost)}¥
                        {!canAfford && " (over budget)"}
                      </span>
                    </div>
                    <div className="flex justify-between rounded bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-800">
                      <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                      <span
                        className={`font-medium ${
                          selectedCyberdeck.legality === "forbidden"
                            ? "text-red-600 dark:text-red-400"
                            : selectedCyberdeck.legality === "restricted"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {getAvailabilityDisplay(
                          selectedCyberdeck.availability,
                          selectedCyberdeck.legality
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Legality Warning */}
                  {(selectedCyberdeck.legality === "restricted" ||
                    selectedCyberdeck.legality === "forbidden") && (
                    <div
                      className={`rounded-lg p-3 ${
                        selectedCyberdeck.legality === "forbidden"
                          ? "bg-red-50 dark:bg-red-900/20"
                          : "bg-amber-50 dark:bg-amber-900/20"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                          selectedCyberdeck.legality === "forbidden"
                            ? "text-red-700 dark:text-red-300"
                            : "text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {selectedCyberdeck.legality === "forbidden"
                          ? "Forbidden - Illegal to possess"
                          : "Restricted - Requires license"}
                      </div>
                    </div>
                  )}

                  {/* Purchase Button */}
                  <div className="pt-2">
                    <button
                      onClick={handlePurchase}
                      disabled={!canPurchase}
                      className={`w-full rounded-lg py-3 text-sm font-medium transition-colors ${
                        canPurchase
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                      }`}
                    >
                      {!canAfford
                        ? `Cannot Afford (${formatCurrency(selectedCyberdeck.cost)}¥)`
                        : `Purchase - ${formatCurrency(selectedCyberdeck.cost)}¥`}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-zinc-400 dark:text-zinc-500">
                  <p className="text-sm">Select a cyberdeck to see details</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3 dark:border-zinc-700">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {filteredCyberdecks.length} items available
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
