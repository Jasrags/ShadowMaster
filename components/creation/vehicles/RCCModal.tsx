"use client";

/**
 * RCCModal
 *
 * Modal for adding Rigger Command Consoles during character creation.
 */

import { useMemo, useState } from "react";
import { useRCCs, type RCCCatalogItemData } from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Wifi, Plus } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

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

export function RCCModal({ isOpen, onClose, onAdd, remainingNuyen }: RCCModalProps) {
  const rccs = useRCCs();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter RCCs
  const filteredRCCs = useMemo(() => {
    let items = [...rccs];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((r) => r.name.toLowerCase().includes(query));
    }
    return items.filter((r) => isItemAvailable(r.availability));
  }, [rccs, searchQuery]);

  // Handle add
  const handleAdd = (rcc: RCCCatalogItemData) => {
    const selection: RCCSelection = {
      catalogId: rcc.id,
      name: rcc.name,
      deviceRating: rcc.deviceRating,
      dataProcessing: rcc.dataProcessing,
      firewall: rcc.firewall,
      cost: rcc.cost,
      availability: rcc.availability,
      legality: rcc.legality,
    };
    onAdd(selection);
  };

  return (
    <BaseModalRoot isOpen={isOpen} onClose={onClose} size="2xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add RCC" onClose={close}>
            <Wifi className="h-5 w-5 text-cyan-500" />
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
                placeholder="Search RCCs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <ModalBody className="p-4">
            <div className="space-y-2">
              {filteredRCCs.map((rcc) => {
                const canAfford = rcc.cost <= remainingNuyen;
                return (
                  <div
                    key={rcc.id}
                    className={`rounded-lg border p-3 ${
                      canAfford
                        ? "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                        : "border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {rcc.name}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <span>Rating {rcc.deviceRating}</span>
                          <span>DP: {rcc.dataProcessing}</span>
                          <span>FW: {rcc.firewall}</span>
                          <span>
                            Avail: {getAvailabilityDisplay(rcc.availability, rcc.legality)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 flex flex-col items-end gap-2">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {formatCurrency(rcc.cost)}¥
                        </span>
                        <button
                          onClick={() => handleAdd(rcc)}
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
              {filteredRCCs.length === 0 && (
                <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No RCCs found
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
