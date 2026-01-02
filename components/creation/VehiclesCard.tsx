"use client";

/**
 * VehiclesCard
 *
 * Compact card for vehicle and drone purchasing in sheet-driven creation.
 * Handles vehicles, drones, RCCs, and autosofts.
 *
 * Features:
 * - Vehicle/Drone/RCC/Autosoft tabs
 * - Search and filter by type/size
 * - Budget tracking
 * - Selected items display
 */

import { useMemo, useCallback, useState } from "react";
import {
  useVehicles,
  useDrones,
  useRCCs,
  useAutosofts,
  useDroneSizes,
  formatHandlingRating,
  calculateAutosoftCost,
  calculateAutosoftAvailability,
  type VehicleCatalogItemData,
  type DroneCatalogItemData,
  type RCCCatalogItemData,
  type AutosoftCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { CreationState, CharacterDrone, CharacterRCC, CharacterAutosoft } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Lock, Search, X, Car, Bot, Wifi, Code } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

type VehicleTab = "vehicles" | "drones" | "rccs" | "autosofts";

interface OwnedVehicle {
  id: string;
  catalogId: string;
  name: string;
  category: string;
  cost: number;
  availability: number;
  restricted?: boolean;
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
  restricted?: boolean,
  forbidden?: boolean
): string {
  let display = String(availability);
  if (restricted) display += "R";
  if (forbidden) display += "F";
  return display;
}

function isItemAvailable(availability: number, forbidden?: boolean): boolean {
  return availability <= MAX_AVAILABILITY && !forbidden;
}

let idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}-${++idCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

// =============================================================================
// TYPES
// =============================================================================

interface VehiclesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function VehiclesCard({ state, updateState }: VehiclesCardProps) {
  const vehicles = useVehicles();
  const drones = useDrones();
  const rccs = useRCCs();
  const autosofts = useAutosofts();
  const droneSizes = useDroneSizes();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");

  const [activeTab, setActiveTab] = useState<VehicleTab>("vehicles");
  const [searchQuery, setSearchQuery] = useState("");
  const [droneSizeFilter, setDroneSizeFilter] = useState<string>("all");
  const [autosoftRatings, setAutosoftRatings] = useState<Record<string, number>>({});

  // Get selections from state
  const selectedVehicles = useMemo(
    () => (state.selections?.vehicles || []) as OwnedVehicle[],
    [state.selections?.vehicles]
  );
  const selectedDrones = useMemo(
    () => (state.selections?.drones || []) as CharacterDrone[],
    [state.selections?.drones]
  );
  const selectedRCCs = useMemo(
    () => (state.selections?.rccs || []) as CharacterRCC[],
    [state.selections?.rccs]
  );
  const selectedAutosofts = useMemo(
    () => (state.selections?.autosofts || []) as CharacterAutosoft[],
    [state.selections?.autosofts]
  );

  // Calculate nuyen budget
  const baseNuyen = nuyenBudget?.total || 0;
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const convertedNuyen = karmaConversion * 2000;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate spent across all categories
  const gearSpent =
    ((state.selections?.weapons as Array<{ cost: number; quantity: number }>) || []).reduce(
      (s, i) => s + i.cost * i.quantity,
      0
    ) +
    ((state.selections?.armor as Array<{ cost: number; quantity: number }>) || []).reduce(
      (s, i) => s + i.cost * i.quantity,
      0
    ) +
    ((state.selections?.gear as Array<{ cost: number; quantity: number }>) || []).reduce(
      (s, i) => s + i.cost * i.quantity,
      0
    ) +
    ((state.selections?.foci as Array<{ cost: number }>) || []).reduce((s, i) => s + i.cost, 0);
  const augmentationSpent =
    ((state.selections?.cyberware as Array<{ cost: number }>) || []).reduce((s, i) => s + i.cost, 0) +
    ((state.selections?.bioware as Array<{ cost: number }>) || []).reduce((s, i) => s + i.cost, 0);
  const vehiclesSpent =
    selectedVehicles.reduce((sum, v) => sum + v.cost, 0) +
    selectedDrones.reduce((sum, d) => sum + d.cost, 0) +
    selectedRCCs.reduce((sum, r) => sum + r.cost, 0) +
    selectedAutosofts.reduce((sum, a) => sum + a.cost, 0);
  const lifestyleSpent = (state.budgets?.["nuyen-spent-lifestyle"] as number) || 0;
  const totalSpent = gearSpent + augmentationSpent + vehiclesSpent + lifestyleSpent;
  const remaining = totalNuyen - totalSpent;

  const totalItems = selectedVehicles.length + selectedDrones.length + selectedRCCs.length + selectedAutosofts.length;

  // Filter items
  const filteredVehicles = useMemo(() => {
    let items = [...vehicles];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((v) => v.name.toLowerCase().includes(query));
    }
    return items.filter((v) => isItemAvailable(v.availability, v.forbidden)).slice(0, 15);
  }, [vehicles, searchQuery]);

  const filteredDrones = useMemo(() => {
    let items = [...drones];
    if (droneSizeFilter !== "all") {
      items = items.filter((d) => d.size === droneSizeFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((d) => d.name.toLowerCase().includes(query));
    }
    return items.filter((d) => isItemAvailable(d.availability, d.forbidden)).slice(0, 15);
  }, [drones, droneSizeFilter, searchQuery]);

  const filteredRCCs = useMemo(() => {
    let items = [...rccs];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((r) => r.name.toLowerCase().includes(query));
    }
    return items.filter((r) => isItemAvailable(r.availability, false)).slice(0, 15);
  }, [rccs, searchQuery]);

  // Add vehicle
  const addVehicle = useCallback(
    (vehicle: VehicleCatalogItemData) => {
      if (vehicle.cost > remaining) return;

      const newVehicle: OwnedVehicle = {
        id: generateId("vehicle"),
        catalogId: vehicle.id,
        name: vehicle.name,
        category: vehicle.category,
        cost: vehicle.cost,
        availability: vehicle.availability,
        restricted: vehicle.restricted,
      };

      updateState({
        selections: {
          ...state.selections,
          vehicles: [...selectedVehicles, newVehicle],
        },
      });
    },
    [remaining, selectedVehicles, state.selections, updateState]
  );

  // Add drone
  const addDrone = useCallback(
    (drone: DroneCatalogItemData) => {
      if (drone.cost > remaining) return;

      const newDrone: CharacterDrone = {
        id: generateId("drone"),
        catalogId: drone.id,
        name: drone.name,
        size: drone.size as CharacterDrone["size"],
        handling: drone.handling,
        speed: drone.speed,
        acceleration: drone.acceleration,
        body: drone.body,
        armor: drone.armor,
        pilot: drone.pilot,
        sensor: drone.sensor,
        cost: drone.cost,
        availability: drone.availability,
        restricted: drone.restricted,
        forbidden: drone.forbidden,
      };

      updateState({
        selections: {
          ...state.selections,
          drones: [...selectedDrones, newDrone],
        },
      });
    },
    [remaining, selectedDrones, state.selections, updateState]
  );

  // Add RCC
  const addRCC = useCallback(
    (rcc: RCCCatalogItemData) => {
      if (rcc.cost > remaining) return;

      const newRCC: CharacterRCC = {
        id: generateId("rcc"),
        catalogId: rcc.id,
        name: rcc.name,
        deviceRating: rcc.deviceRating,
        dataProcessing: rcc.dataProcessing,
        firewall: rcc.firewall,
        cost: rcc.cost,
        availability: rcc.availability,
        restricted: rcc.restricted,
      };

      updateState({
        selections: {
          ...state.selections,
          rccs: [...selectedRCCs, newRCC],
        },
      });
    },
    [remaining, selectedRCCs, state.selections, updateState]
  );

  // Add autosoft
  const addAutosoft = useCallback(
    (autosoft: AutosoftCatalogItemData) => {
      const rating = autosoftRatings[autosoft.id] || 1;
      const cost = calculateAutosoftCost(autosoft.costPerRating, rating);
      const availability = calculateAutosoftAvailability(autosoft.availabilityPerRating, rating);

      if (cost > remaining || availability > MAX_AVAILABILITY) return;

      const newAutosoft: CharacterAutosoft = {
        id: generateId("autosoft"),
        catalogId: autosoft.id,
        name: autosoft.name,
        category: autosoft.category as CharacterAutosoft["category"],
        rating,
        cost,
        availability,
      };

      updateState({
        selections: {
          ...state.selections,
          autosofts: [...selectedAutosofts, newAutosoft],
        },
      });
    },
    [remaining, selectedAutosofts, autosoftRatings, state.selections, updateState]
  );

  // Remove items
  const removeVehicle = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          vehicles: selectedVehicles.filter((v) => v.id !== id),
        },
      });
    },
    [selectedVehicles, state.selections, updateState]
  );

  const removeDrone = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          drones: selectedDrones.filter((d) => d.id !== id),
        },
      });
    },
    [selectedDrones, state.selections, updateState]
  );

  const removeRCC = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          rccs: selectedRCCs.filter((r) => r.id !== id),
        },
      });
    },
    [selectedRCCs, state.selections, updateState]
  );

  const removeAutosoft = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          autosofts: selectedAutosofts.filter((a) => a.id !== id),
        },
      });
    },
    [selectedAutosofts, state.selections, updateState]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (remaining < 0) return "error";
    if (totalItems > 0) return "valid";
    return "pending";
  }, [remaining, totalItems]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard title="Vehicles & Drones" description="Purchase vehicles and drones" status="pending">
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set priorities first
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Vehicles & Drones"
      description={`${totalItems} items • ${formatCurrency(vehiclesSpent)}¥`}
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Budget indicator */}
        <BudgetIndicator
          label="Nuyen Remaining"
          remaining={remaining}
          total={totalNuyen}
          displayFormat="currency"
          compact
        />

        {/* Category tabs */}
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: "vehicles", label: "Vehicles", icon: Car, count: selectedVehicles.length },
            { id: "drones", label: "Drones", icon: Bot, count: selectedDrones.length },
            { id: "rccs", label: "RCCs", icon: Wifi, count: selectedRCCs.length },
            { id: "autosofts", label: "Soft", icon: Code, count: selectedAutosofts.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as VehicleTab);
                  setSearchQuery("");
                }}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`rounded-full px-1 text-[8px] ${
                    activeTab === tab.id
                      ? "bg-blue-400"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search and filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          {activeTab === "drones" && (
            <select
              value={droneSizeFilter}
              onChange={(e) => setDroneSizeFilter(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="all">All sizes</option>
              {droneSizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Item lists */}
        <div className="max-h-40 space-y-1 overflow-y-auto">
          {/* Vehicles */}
          {activeTab === "vehicles" &&
            filteredVehicles.map((vehicle) => {
              const canAfford = vehicle.cost <= remaining;
              return (
                <button
                  key={vehicle.id}
                  onClick={() => canAfford && addVehicle(vehicle)}
                  disabled={!canAfford}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                    canAfford
                      ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                      : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{vehicle.name}</span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span>{vehicle.category}</span>
                      <span>Hand: {formatHandlingRating(vehicle.handling)}</span>
                      <span>B/A: {vehicle.body}/{vehicle.armor}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(vehicle.cost)}¥
                  </span>
                </button>
              );
            })}

          {/* Drones */}
          {activeTab === "drones" &&
            filteredDrones.map((drone) => {
              const canAfford = drone.cost <= remaining;
              return (
                <button
                  key={drone.id}
                  onClick={() => canAfford && addDrone(drone)}
                  disabled={!canAfford}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                    canAfford
                      ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                      : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{drone.name}</span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span className="capitalize">{drone.size}</span>
                      <span>P{drone.pilot}/S{drone.sensor}</span>
                      <span>B/A: {drone.body}/{drone.armor}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(drone.cost)}¥
                  </span>
                </button>
              );
            })}

          {/* RCCs */}
          {activeTab === "rccs" &&
            filteredRCCs.map((rcc) => {
              const canAfford = rcc.cost <= remaining;
              return (
                <button
                  key={rcc.id}
                  onClick={() => canAfford && addRCC(rcc)}
                  disabled={!canAfford}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                    canAfford
                      ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                      : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{rcc.name}</span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span>DR: {rcc.deviceRating}</span>
                      <span>DP: {rcc.dataProcessing}</span>
                      <span>FW: {rcc.firewall}</span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    {formatCurrency(rcc.cost)}¥
                  </span>
                </button>
              );
            })}

          {/* Autosofts */}
          {activeTab === "autosofts" &&
            autosofts.slice(0, 15).map((autosoft) => {
              const rating = autosoftRatings[autosoft.id] || 1;
              const cost = calculateAutosoftCost(autosoft.costPerRating, rating);
              const availability = calculateAutosoftAvailability(autosoft.availabilityPerRating, rating);
              const canAfford = cost <= remaining && availability <= MAX_AVAILABILITY;

              return (
                <div
                  key={autosoft.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                    canAfford
                      ? "bg-zinc-50 dark:bg-zinc-800/50"
                      : "bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div className="flex-1">
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{autosoft.name}</span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span className="capitalize">{autosoft.category}</span>
                      <span>Avail: {availability}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={rating}
                      onChange={(e) => setAutosoftRatings({ ...autosoftRatings, [autosoft.id]: parseInt(e.target.value) })}
                      className="w-12 rounded border border-zinc-200 bg-white px-1 py-0.5 text-xs dark:border-zinc-700 dark:bg-zinc-800"
                    >
                      {Array.from({ length: autosoft.maxRating }, (_, i) => i + 1).map((r) => (
                        <option key={r} value={r}>
                          R{r}
                        </option>
                      ))}
                    </select>
                    <span className="w-16 text-right text-xs text-zinc-600 dark:text-zinc-400">
                      {formatCurrency(cost)}¥
                    </span>
                    <button
                      onClick={() => canAfford && addAutosoft(autosoft)}
                      disabled={!canAfford}
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        canAfford
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}

          {/* Empty states */}
          {activeTab === "vehicles" && filteredVehicles.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No vehicles found
            </div>
          )}
          {activeTab === "drones" && filteredDrones.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No drones found
            </div>
          )}
          {activeTab === "rccs" && filteredRCCs.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No RCCs found
            </div>
          )}
        </div>

        {/* Selected items */}
        {totalItems > 0 && (
          <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Selected ({totalItems})
            </h4>
            <div className="max-h-24 space-y-1 overflow-y-auto text-xs">
              {selectedVehicles.map((v) => (
                <div key={v.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Car className="h-3 w-3 text-blue-500" />
                    <span className="truncate">{v.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{formatCurrency(v.cost)}¥</span>
                    <button onClick={() => removeVehicle(v.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {selectedDrones.map((d) => (
                <div key={d.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Bot className="h-3 w-3 text-green-500" />
                    <span className="truncate">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{formatCurrency(d.cost)}¥</span>
                    <button onClick={() => removeDrone(d.id!)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {selectedRCCs.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-purple-500" />
                    <span className="truncate">{r.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{formatCurrency(r.cost)}¥</span>
                    <button onClick={() => removeRCC(r.id!)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {selectedAutosofts.map((a) => (
                <div key={a.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Code className="h-3 w-3 text-cyan-500" />
                    <span className="truncate">{a.name} R{a.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-500">{formatCurrency(a.cost)}¥</span>
                    <button onClick={() => removeAutosoft(a.id!)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 pt-2 dark:border-zinc-700">
              <div className="flex justify-between text-xs font-medium">
                <span>Total:</span>
                <span>{formatCurrency(vehiclesSpent)}¥</span>
              </div>
            </div>
          </div>
        )}

        {/* Help text */}
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
          RCCs and autosofts are useful for riggers controlling drones.
        </p>
      </div>
    </CreationCard>
  );
}
