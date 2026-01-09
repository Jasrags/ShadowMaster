"use client";

/**
 * VehicleModal
 *
 * Modal for adding vehicles during character creation.
 */

import { useMemo, useState } from "react";
import {
  useVehicles,
  formatHandlingRating,
  type VehicleCatalogItemData,
  type HandlingRatingData,
} from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { X, Search, Car, Plus } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

// =============================================================================
// TYPES
// =============================================================================

export interface VehicleSelection {
  catalogId: string;
  name: string;
  category: string;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  handling: HandlingRatingData;
  speed: number;
  acceleration: number;
  body: number;
  armor: number;
  pilot: number;
  sensor: number;
  seats?: number;
}

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (vehicle: VehicleSelection) => void;
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

function getAvailabilityDisplay(
  availability: number,
  legality?: ItemLegality
): string {
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

export function VehicleModal({
  isOpen,
  onClose,
  onAdd,
  remainingNuyen,
}: VehicleModalProps) {
  const vehicles = useVehicles();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    let items = [...vehicles];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((v) => v.name.toLowerCase().includes(query));
    }
    return items.filter((v) => isItemAvailable(v.availability));
  }, [vehicles, searchQuery]);

  // Handle add
  const handleAdd = (vehicle: VehicleCatalogItemData) => {
    const selection: VehicleSelection = {
      catalogId: vehicle.id,
      name: vehicle.name,
      category: vehicle.category,
      cost: vehicle.cost,
      availability: vehicle.availability,
      legality: vehicle.legality,
      handling: vehicle.handling,
      speed: vehicle.speed,
      acceleration: vehicle.acceleration,
      body: vehicle.body,
      armor: vehicle.armor,
      pilot: vehicle.pilot,
      sensor: vehicle.sensor,
      seats: vehicle.seats,
    };
    onAdd(selection);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Add Vehicle
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Budget */}
        <div className="border-b border-zinc-200 px-4 py-2 dark:border-zinc-700">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Budget:{" "}
            <span className={`font-medium ${remainingNuyen < 0 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
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
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Vehicle list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredVehicles.map((vehicle) => {
              const canAfford = vehicle.cost <= remainingNuyen;
              return (
                <div
                  key={vehicle.id}
                  className={`rounded-lg border p-3 ${
                    canAfford
                      ? "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                      : "border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-800/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {vehicle.name}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{vehicle.category}</span>
                        <span>Hand: {formatHandlingRating(vehicle.handling)}</span>
                        <span>Spd: {vehicle.speed}</span>
                        <span>B/A: {vehicle.body}/{vehicle.armor}</span>
                        <span>P/S: {vehicle.pilot}/{vehicle.sensor}</span>
                        <span>Avail: {getAvailabilityDisplay(vehicle.availability, vehicle.legality)}</span>
                      </div>
                    </div>
                    <div className="ml-3 flex flex-col items-end gap-2">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(vehicle.cost)}¥
                      </span>
                      <button
                        onClick={() => handleAdd(vehicle)}
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
            {filteredVehicles.length === 0 && (
              <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No vehicles found
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
