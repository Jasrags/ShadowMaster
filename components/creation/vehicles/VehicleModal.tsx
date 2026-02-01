"use client";

/**
 * VehicleModal
 *
 * Two-column modal for adding vehicles during character creation.
 * Left pane shows grouped vehicle list, right pane shows selected vehicle details.
 *
 * Uses BaseModal for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback } from "react";
import {
  useVehicles,
  formatHandlingRating,
  type VehicleCatalogItemData,
  type HandlingRatingData,
} from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Car, Check, AlertTriangle } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

const VEHICLE_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "bikes", label: "Bikes" },
  { id: "cars", label: "Cars" },
  { id: "trucks", label: "Trucks" },
  { id: "boats", label: "Boats" },
  { id: "submarines", label: "Subs" },
  { id: "fixed-wing", label: "Fixed-Wing" },
  { id: "rotorcraft", label: "Rotorcraft" },
  { id: "vtol", label: "VTOL" },
  { id: "walkers", label: "Walkers" },
] as const;

type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number]["id"];

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  bikes: "Bikes",
  cars: "Cars",
  trucks: "Trucks & Vans",
  boats: "Boats",
  submarines: "Submarines",
  "fixed-wing": "Fixed-Wing Aircraft",
  rotorcraft: "Rotorcraft",
  vtol: "VTOL/LAV",
  walkers: "Walkers",
};

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
  ownedVehicleIds?: string[];
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

export function VehicleModal({
  isOpen,
  onClose,
  onAdd,
  remainingNuyen,
  ownedVehicleIds = [],
}: VehicleModalProps) {
  const vehicles = useVehicles();

  // Filter state (preserved across items)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>("all");

  // Selection state (cleared after each add)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Session tracking
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Reset state when modal closes
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedVehicleId(null);
    setAddedThisSession(0);
  }, []);

  // Partial reset after adding (preserves search/filters)
  const resetForNextItem = useCallback(() => {
    setSelectedVehicleId(null);
  }, []);

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    let items = [...vehicles];

    // Filter by availability
    items = items.filter((v) => isItemAvailable(v.availability));

    // Filter by category
    if (selectedCategory !== "all") {
      items = items.filter((v) => v.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (v) => v.name.toLowerCase().includes(query) || v.category.toLowerCase().includes(query)
      );
    }

    return items;
  }, [vehicles, selectedCategory, searchQuery]);

  // Group vehicles by category
  const vehiclesByCategory = useMemo(() => {
    const grouped: Record<string, VehicleCatalogItemData[]> = {};
    filteredVehicles.forEach((vehicle) => {
      const cat = vehicle.category || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(vehicle);
    });
    // Sort vehicles within each category by name
    Object.values(grouped).forEach((vehicleList) => {
      vehicleList.sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [filteredVehicles]);

  // Get selected vehicle data
  const selectedVehicle = useMemo(() => {
    if (!selectedVehicleId) return null;
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  // Handle add vehicle
  const handleAddVehicle = useCallback(() => {
    if (!selectedVehicle) return;
    const canAfford = selectedVehicle.cost <= remainingNuyen;
    if (!canAfford) return;

    const selection: VehicleSelection = {
      catalogId: selectedVehicle.id,
      name: selectedVehicle.name,
      category: selectedVehicle.category,
      cost: selectedVehicle.cost,
      availability: selectedVehicle.availability,
      legality: selectedVehicle.legality,
      handling: selectedVehicle.handling,
      speed: selectedVehicle.speed,
      acceleration: selectedVehicle.acceleration,
      body: selectedVehicle.body,
      armor: selectedVehicle.armor,
      pilot: selectedVehicle.pilot,
      sensor: selectedVehicle.sensor,
      seats: selectedVehicle.seats,
    };
    onAdd(selection);
    setAddedThisSession((prev) => prev + 1);
    resetForNextItem();
  }, [selectedVehicle, remainingNuyen, onAdd, resetForNextItem]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Calculate if selected vehicle can be afforded
  const canAffordSelected = selectedVehicle ? selectedVehicle.cost <= remainingNuyen : false;
  const isAlreadyOwned = selectedVehicle ? ownedVehicleIds.includes(selectedVehicle.id) : false;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Vehicle" onClose={close}>
            <Car className="h-5 w-5 text-blue-500" />
          </ModalHeader>

          {/* Search and Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {/* Category Filter */}
            <div className="mt-3 flex flex-wrap gap-2">
              {VEHICLE_CATEGORIES.map((cat) => (
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
              {/* Left Pane - Vehicle List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {Object.entries(vehiclesByCategory).map(([category, vehicleList]) => (
                  <div key={category}>
                    <div className="sticky top-0 z-10 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {CATEGORY_DISPLAY_NAMES[category] || category}
                    </div>
                    {vehicleList.map((vehicle) => {
                      const isSelected = selectedVehicleId === vehicle.id;
                      const isOwned = ownedVehicleIds.includes(vehicle.id);
                      const canAfford = vehicle.cost <= remainingNuyen;
                      const isDisabled = isOwned;

                      return (
                        <button
                          key={vehicle.id}
                          onClick={() => !isDisabled && setSelectedVehicleId(vehicle.id)}
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
                            <span className={isOwned ? "line-through" : ""}>{vehicle.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs ${!canAfford && !isOwned ? "text-red-400" : "text-zinc-400"}`}
                            >
                              {formatCurrency(vehicle.cost)}¥
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
                {Object.keys(vehiclesByCategory).length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">No vehicles found</div>
                )}
              </div>

              {/* Right Pane - Vehicle Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedVehicle ? (
                  <div className="space-y-6">
                    {/* Vehicle Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedVehicle.name}
                      </h3>
                      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {CATEGORY_DISPLAY_NAMES[selectedVehicle.category] ||
                          selectedVehicle.category}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Handling
                        </div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {formatHandlingRating(selectedVehicle.handling)}
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Speed / Accel
                        </div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {selectedVehicle.speed} / {selectedVehicle.acceleration}
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Body / Armor
                        </div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {selectedVehicle.body} / {selectedVehicle.armor}
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Pilot / Sensor
                        </div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {selectedVehicle.pilot} / {selectedVehicle.sensor}
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2">
                      {selectedVehicle.seats && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-zinc-600 dark:text-zinc-400">Seats</span>
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {selectedVehicle.seats}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Availability</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {getAvailabilityDisplay(
                            selectedVehicle.availability,
                            selectedVehicle.legality
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Description if available */}
                    {selectedVehicle.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedVehicle.description}
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
                          {formatCurrency(selectedVehicle.cost)}¥
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Remaining</span>
                        <span
                          className={`font-medium ${
                            remainingNuyen - selectedVehicle.cost < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {formatCurrency(remainingNuyen - selectedVehicle.cost)}¥
                        </span>
                      </div>
                    </div>

                    {/* Already owned warning */}
                    {isAlreadyOwned && (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                        <Check className="h-4 w-4" />
                        <span>You already own this vehicle</span>
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
                    <Car className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select a vehicle from the list</p>
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
                onClick={handleAddVehicle}
                disabled={!selectedVehicle || !canAffordSelected || isAlreadyOwned}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedVehicle && canAffordSelected && !isAlreadyOwned
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Add Vehicle
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
