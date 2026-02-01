"use client";

/**
 * DroneModal
 *
 * Two-column modal for adding drones during character creation.
 * Left pane shows grouped drone list (by size), right pane shows selected drone details.
 *
 * Uses BaseModal for accessibility (focus trapping, keyboard handling).
 */

import { useMemo, useState, useCallback } from "react";
import { useDrones, type DroneCatalogItemData } from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { BaseModalRoot, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { Search, Bot, Check, AlertTriangle, Plane, Waves } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

const DRONE_SIZES = [
  { id: "all", label: "All" },
  { id: "micro", label: "Micro" },
  { id: "mini", label: "Mini" },
  { id: "small", label: "Small" },
  { id: "medium", label: "Medium" },
  { id: "large", label: "Large" },
] as const;

type DroneSize = (typeof DRONE_SIZES)[number]["id"];

const SIZE_DISPLAY_NAMES: Record<string, string> = {
  micro: "Micro Drones",
  mini: "Mini Drones",
  small: "Small Drones",
  medium: "Medium Drones",
  large: "Large Drones",
};

// =============================================================================
// TYPES
// =============================================================================

export interface DroneSelection {
  catalogId: string;
  name: string;
  size: string;
  droneType: string;
  cost: number;
  availability: number;
  legality?: ItemLegality;
  handling: number;
  speed: number;
  acceleration: number;
  body: number;
  armor: number;
  pilot: number;
  sensor: number;
  canFly?: boolean;
  isAquatic?: boolean;
}

interface DroneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (drone: DroneSelection) => void;
  remainingNuyen: number;
  ownedDroneIds?: string[];
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

export function DroneModal({
  isOpen,
  onClose,
  onAdd,
  remainingNuyen,
  ownedDroneIds = [],
}: DroneModalProps) {
  const drones = useDrones();

  // Filter state (preserved across items)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState<DroneSize>("all");

  // Selection state (cleared after each add)
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);

  // Session tracking
  const [addedThisSession, setAddedThisSession] = useState(0);

  // Reset state when modal closes
  const resetState = useCallback(() => {
    setSearchQuery("");
    setSelectedSize("all");
    setSelectedDroneId(null);
    setAddedThisSession(0);
  }, []);

  // Partial reset after adding (preserves search/filters)
  const resetForNextItem = useCallback(() => {
    setSelectedDroneId(null);
  }, []);

  // Filter drones
  const filteredDrones = useMemo(() => {
    let items = [...drones];

    // Filter by availability
    items = items.filter((d) => isItemAvailable(d.availability));

    // Filter by size
    if (selectedSize !== "all") {
      items = items.filter((d) => d.size === selectedSize);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.droneType.toLowerCase().includes(query) ||
          d.size.toLowerCase().includes(query)
      );
    }

    return items;
  }, [drones, selectedSize, searchQuery]);

  // Group drones by size
  const dronesBySize = useMemo(() => {
    const grouped: Record<string, DroneCatalogItemData[]> = {};
    filteredDrones.forEach((drone) => {
      const size = drone.size || "other";
      if (!grouped[size]) grouped[size] = [];
      grouped[size].push(drone);
    });
    // Sort drones within each size group by name
    Object.values(grouped).forEach((droneList) => {
      droneList.sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [filteredDrones]);

  // Get selected drone data
  const selectedDrone = useMemo(() => {
    if (!selectedDroneId) return null;
    return drones.find((d) => d.id === selectedDroneId) || null;
  }, [drones, selectedDroneId]);

  // Handle add drone
  const handleAddDrone = useCallback(() => {
    if (!selectedDrone) return;
    const canAfford = selectedDrone.cost <= remainingNuyen;
    if (!canAfford) return;

    const selection: DroneSelection = {
      catalogId: selectedDrone.id,
      name: selectedDrone.name,
      size: selectedDrone.size,
      droneType: selectedDrone.droneType,
      cost: selectedDrone.cost,
      availability: selectedDrone.availability,
      legality: selectedDrone.legality,
      handling: selectedDrone.handling,
      speed: selectedDrone.speed,
      acceleration: selectedDrone.acceleration,
      body: selectedDrone.body,
      armor: selectedDrone.armor,
      pilot: selectedDrone.pilot,
      sensor: selectedDrone.sensor,
      canFly: selectedDrone.canFly,
      isAquatic: selectedDrone.isAquatic,
    };
    onAdd(selection);
    setAddedThisSession((prev) => prev + 1);
    resetForNextItem();
  }, [selectedDrone, remainingNuyen, onAdd, resetForNextItem]);

  // Handle close
  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [resetState, onClose]);

  // Calculate if selected drone can be afforded
  const canAffordSelected = selectedDrone ? selectedDrone.cost <= remainingNuyen : false;
  const isAlreadyOwned = selectedDrone ? ownedDroneIds.includes(selectedDrone.id) : false;

  return (
    <BaseModalRoot isOpen={isOpen} onClose={handleClose} size="full" className="max-w-4xl">
      {({ close }) => (
        <>
          <ModalHeader title="Add Drone" onClose={close}>
            <Bot className="h-5 w-5 text-blue-500" />
          </ModalHeader>

          {/* Search and Filters */}
          <div className="border-b border-zinc-200 px-6 py-3 dark:border-zinc-700">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search drones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {/* Size Filter */}
            <div className="mt-3 flex flex-wrap gap-2">
              {DRONE_SIZES.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedSize === size.id
                      ? "bg-blue-500 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <ModalBody scrollable={false}>
            {/* Content - Split Pane */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Pane - Drone List */}
              <div className="w-1/2 overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
                {Object.entries(dronesBySize).map(([size, droneList]) => (
                  <div key={size}>
                    <div className="sticky top-0 z-10 bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      {SIZE_DISPLAY_NAMES[size] || size}
                    </div>
                    {droneList.map((drone) => {
                      const isSelected = selectedDroneId === drone.id;
                      const isOwned = ownedDroneIds.includes(drone.id);
                      const canAfford = drone.cost <= remainingNuyen;
                      const isDisabled = isOwned;

                      return (
                        <button
                          key={drone.id}
                          onClick={() => !isDisabled && setSelectedDroneId(drone.id)}
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
                            <span className={isOwned ? "line-through" : ""}>{drone.name}</span>
                            {drone.canFly && (
                              <span title="Can fly">
                                <Plane className="h-3 w-3 text-sky-400" />
                              </span>
                            )}
                            {drone.isAquatic && (
                              <span title="Aquatic">
                                <Waves className="h-3 w-3 text-cyan-400" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs ${!canAfford && !isOwned ? "text-red-400" : "text-zinc-400"}`}
                            >
                              {formatCurrency(drone.cost)}¥
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
                {Object.keys(dronesBySize).length === 0 && (
                  <div className="p-8 text-center text-sm text-zinc-500">No drones found</div>
                )}
              </div>

              {/* Right Pane - Drone Details */}
              <div className="w-1/2 overflow-y-auto p-6">
                {selectedDrone ? (
                  <div className="space-y-6">
                    {/* Drone Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedDrone.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                        <span className="capitalize">{selectedDrone.size}</span>
                        <span>•</span>
                        <span className="capitalize">{selectedDrone.droneType}</span>
                        {selectedDrone.canFly && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-sky-500">
                              <Plane className="h-3.5 w-3.5" />
                              Aerial
                            </span>
                          </>
                        )}
                        {selectedDrone.isAquatic && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-cyan-500">
                              <Waves className="h-3.5 w-3.5" />
                              Aquatic
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Handling
                        </div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {selectedDrone.handling}
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Speed / Accel
                        </div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {selectedDrone.speed} / {selectedDrone.acceleration}
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Body / Armor
                        </div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {selectedDrone.body} / {selectedDrone.armor}
                        </div>
                      </div>
                      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          Pilot / Sensor
                        </div>
                        <div className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {selectedDrone.pilot} / {selectedDrone.sensor}
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">Availability</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {getAvailabilityDisplay(
                            selectedDrone.availability,
                            selectedDrone.legality
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Description if available */}
                    {selectedDrone.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {selectedDrone.description}
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
                          {formatCurrency(selectedDrone.cost)}¥
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Remaining</span>
                        <span
                          className={`font-medium ${
                            remainingNuyen - selectedDrone.cost < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {formatCurrency(remainingNuyen - selectedDrone.cost)}¥
                        </span>
                      </div>
                    </div>

                    {/* Already owned warning */}
                    {isAlreadyOwned && (
                      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                        <Check className="h-4 w-4" />
                        <span>You already own this drone</span>
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
                    <Bot className="h-12 w-12" />
                    <p className="mt-4 text-sm">Select a drone from the list</p>
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
                onClick={handleAddDrone}
                disabled={!selectedDrone || !canAffordSelected || isAlreadyOwned}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedDrone && canAffordSelected && !isAlreadyOwned
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                Add Drone
              </button>
            </div>
          </ModalFooter>
        </>
      )}
    </BaseModalRoot>
  );
}
