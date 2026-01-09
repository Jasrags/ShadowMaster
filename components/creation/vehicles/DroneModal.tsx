"use client";

/**
 * DroneModal
 *
 * Modal for adding drones during character creation.
 */

import { useMemo, useState } from "react";
import {
  useDrones,
  type DroneCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { ItemLegality } from "@/lib/types";
import { X, Search, Bot, Plus } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

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

export function DroneModal({
  isOpen,
  onClose,
  onAdd,
  remainingNuyen,
}: DroneModalProps) {
  const drones = useDrones();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter drones
  const filteredDrones = useMemo(() => {
    let items = [...drones];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((d) => d.name.toLowerCase().includes(query));
    }
    return items.filter((d) => isItemAvailable(d.availability));
  }, [drones, searchQuery]);

  // Handle add
  const handleAdd = (drone: DroneCatalogItemData) => {
    const selection: DroneSelection = {
      catalogId: drone.id,
      name: drone.name,
      size: drone.size,
      droneType: drone.droneType,
      cost: drone.cost,
      availability: drone.availability,
      legality: drone.legality,
      handling: drone.handling,
      speed: drone.speed,
      acceleration: drone.acceleration,
      body: drone.body,
      armor: drone.armor,
      pilot: drone.pilot,
      sensor: drone.sensor,
      canFly: drone.canFly,
      isAquatic: drone.isAquatic,
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
            <Bot className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Add Drone
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
              placeholder="Search drones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Drone list */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredDrones.map((drone) => {
              const canAfford = drone.cost <= remainingNuyen;
              return (
                <div
                  key={drone.id}
                  className={`rounded-lg border p-3 ${
                    canAfford
                      ? "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                      : "border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-800/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {drone.name}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{drone.size}</span>
                        <span>{drone.droneType}</span>
                        <span>Hand: {drone.handling}</span>
                        <span>Spd: {drone.speed}</span>
                        <span>B/A: {drone.body}/{drone.armor}</span>
                        <span>P/S: {drone.pilot}/{drone.sensor}</span>
                        <span>Avail: {getAvailabilityDisplay(drone.availability, drone.legality)}</span>
                      </div>
                    </div>
                    <div className="ml-3 flex flex-col items-end gap-2">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(drone.cost)}¥
                      </span>
                      <button
                        onClick={() => handleAdd(drone)}
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
            {filteredDrones.length === 0 && (
              <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No drones found
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
