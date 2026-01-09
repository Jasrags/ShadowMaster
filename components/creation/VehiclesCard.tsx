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
import type { CreationState, CharacterDrone, CharacterRCC, CharacterAutosoft, ItemLegality } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import {
  CreationCard,
  KarmaConversionModal,
  useKarmaConversionPrompt,
} from "./shared";
import { Lock, Search, X, Car, Bot, Wifi, Code, Info, Plus } from "lucide-react";

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
  legality?: ItemLegality;
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
  const karmaBudget = getBudget("karma");

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

  // Karma conversion hook for purchase prompts
  const karmaRemaining = karmaBudget?.remaining ?? 0;

  const handleKarmaConvert = useCallback(
    (newTotalConversion: number) => {
      updateState({
        budgets: {
          ...state.budgets,
          "karma-spent-gear": newTotalConversion,
        },
      });
    },
    [state.budgets, updateState]
  );

  const karmaConversionPrompt = useKarmaConversionPrompt({
    remaining,
    karmaRemaining,
    currentConversion: karmaConversion,
    onConvert: handleKarmaConvert,
  });

  // Filter items
  const filteredVehicles = useMemo(() => {
    let items = [...vehicles];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((v) => v.name.toLowerCase().includes(query));
    }
    return items.filter((v) => isItemAvailable(v.availability)).slice(0, 15);
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
    return items.filter((d) => isItemAvailable(d.availability)).slice(0, 15);
  }, [drones, droneSizeFilter, searchQuery]);

  const filteredRCCs = useMemo(() => {
    let items = [...rccs];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((r) => r.name.toLowerCase().includes(query));
    }
    return items.filter((r) => isItemAvailable(r.availability)).slice(0, 15);
  }, [rccs, searchQuery]);

  // Add vehicle (actual implementation)
  const actuallyAddVehicle = useCallback(
    (vehicle: VehicleCatalogItemData) => {
      const newVehicle: OwnedVehicle = {
        id: generateId("vehicle"),
        catalogId: vehicle.id,
        name: vehicle.name,
        category: vehicle.category,
        cost: vehicle.cost,
        availability: vehicle.availability,
        legality: vehicle.legality,
      };

      updateState({
        selections: {
          ...state.selections,
          vehicles: [...selectedVehicles, newVehicle],
        },
      });
    },
    [selectedVehicles, state.selections, updateState]
  );

  // Add vehicle (with karma conversion prompt if needed)
  const addVehicle = useCallback(
    (vehicle: VehicleCatalogItemData) => {
      // Check if already affordable
      if (vehicle.cost <= remaining) {
        actuallyAddVehicle(vehicle);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(vehicle.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(vehicle.name, vehicle.cost, () => {
          actuallyAddVehicle(vehicle);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remaining, actuallyAddVehicle, karmaConversionPrompt]
  );

  // Add drone (actual implementation)
  const actuallyAddDrone = useCallback(
    (drone: DroneCatalogItemData) => {
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
        legality: drone.legality,
      };

      updateState({
        selections: {
          ...state.selections,
          drones: [...selectedDrones, newDrone],
        },
      });
    },
    [selectedDrones, state.selections, updateState]
  );

  // Add drone (with karma conversion prompt if needed)
  const addDrone = useCallback(
    (drone: DroneCatalogItemData) => {
      // Check if already affordable
      if (drone.cost <= remaining) {
        actuallyAddDrone(drone);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(drone.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(drone.name, drone.cost, () => {
          actuallyAddDrone(drone);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remaining, actuallyAddDrone, karmaConversionPrompt]
  );

  // Add RCC (actual implementation)
  const actuallyAddRCC = useCallback(
    (rcc: RCCCatalogItemData) => {
      const newRCC: CharacterRCC = {
        id: generateId("rcc"),
        catalogId: rcc.id,
        name: rcc.name,
        deviceRating: rcc.deviceRating,
        dataProcessing: rcc.dataProcessing,
        firewall: rcc.firewall,
        cost: rcc.cost,
        availability: rcc.availability,
        legality: rcc.legality,
      };

      updateState({
        selections: {
          ...state.selections,
          rccs: [...selectedRCCs, newRCC],
        },
      });
    },
    [selectedRCCs, state.selections, updateState]
  );

  // Add RCC (with karma conversion prompt if needed)
  const addRCC = useCallback(
    (rcc: RCCCatalogItemData) => {
      // Check if already affordable
      if (rcc.cost <= remaining) {
        actuallyAddRCC(rcc);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(rcc.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(rcc.name, rcc.cost, () => {
          actuallyAddRCC(rcc);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remaining, actuallyAddRCC, karmaConversionPrompt]
  );

  // Add autosoft (actual implementation)
  const actuallyAddAutosoft = useCallback(
    (autosoft: AutosoftCatalogItemData, rating: number, cost: number, availability: number) => {
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
    [selectedAutosofts, state.selections, updateState]
  );

  // Add autosoft (with karma conversion prompt if needed)
  const addAutosoft = useCallback(
    (autosoft: AutosoftCatalogItemData) => {
      const rating = autosoftRatings[autosoft.id] || 1;
      const cost = calculateAutosoftCost(autosoft.costPerRating, rating);
      const availability = calculateAutosoftAvailability(autosoft.availabilityPerRating, rating);

      // Availability check (can't bypass with karma)
      if (availability > MAX_AVAILABILITY) return;

      // Check if already affordable
      if (cost <= remaining) {
        actuallyAddAutosoft(autosoft, rating, cost, availability);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(`${autosoft.name} R${rating}`, cost, () => {
          actuallyAddAutosoft(autosoft, rating, cost, availability);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remaining, autosoftRatings, actuallyAddAutosoft, karmaConversionPrompt]
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
    <>
    <CreationCard
      title="Vehicles & Drones"
      description={`${totalItems} items • ${formatCurrency(vehiclesSpent)}¥`}
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Nuyen bar - compact style */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
              <span>Nuyen</span>
              <span className="group relative">
                <Info className="h-3 w-3 cursor-help text-zinc-400" />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-[10px] text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
                  Nuyen spent on vehicles, drones, RCCs, and autosofts
                </span>
              </span>
              {karmaConversion > 0 && (
                <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                  (+{(karmaConversion * 2000).toLocaleString()}¥ karma)
                </span>
              )}
            </span>
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {formatCurrency(totalSpent)} / {formatCurrency(totalNuyen)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-full transition-all ${
                remaining < 0 ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${Math.min(100, (totalSpent / totalNuyen) * 100)}%` }}
            />
          </div>
        </div>

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

        {/* VEHICLES Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Vehicles
              </span>
              {selectedVehicles.length > 0 && (
                <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  {selectedVehicles.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveTab("vehicles")}
              className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>
          {selectedVehicles.length > 0 ? (
            <div className="rounded-lg border border-zinc-200 p-2 dark:border-zinc-700">
              {selectedVehicles.map((v, index) => (
                <div key={v.id}>
                  {index > 0 && (
                    <div className="my-1.5 border-t border-zinc-100 dark:border-zinc-800" />
                  )}
                  <div className="flex items-center justify-between py-1">
                    <span className="truncate text-sm text-zinc-900 dark:text-zinc-100">{v.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">{formatCurrency(v.cost)}¥</span>
                      <button
                        onClick={() => removeVehicle(v.id)}
                        className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No vehicles purchased</p>
            </div>
          )}
        </div>

        {/* DRONES Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Drones
              </span>
              {selectedDrones.length > 0 && (
                <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                  {selectedDrones.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveTab("drones")}
              className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>
          {selectedDrones.length > 0 ? (
            <div className="rounded-lg border border-zinc-200 p-2 dark:border-zinc-700">
              {selectedDrones.map((d, index) => (
                <div key={d.id}>
                  {index > 0 && (
                    <div className="my-1.5 border-t border-zinc-100 dark:border-zinc-800" />
                  )}
                  <div className="flex items-center justify-between py-1">
                    <span className="truncate text-sm text-zinc-900 dark:text-zinc-100">{d.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">{formatCurrency(d.cost)}¥</span>
                      <button
                        onClick={() => removeDrone(d.id!)}
                        className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No drones purchased</p>
            </div>
          )}
        </div>

        {/* RCCS Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-3.5 w-3.5 text-purple-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                RCCs
              </span>
              {selectedRCCs.length > 0 && (
                <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  {selectedRCCs.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveTab("rccs")}
              className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>
          {selectedRCCs.length > 0 ? (
            <div className="rounded-lg border border-zinc-200 p-2 dark:border-zinc-700">
              {selectedRCCs.map((r, index) => (
                <div key={r.id}>
                  {index > 0 && (
                    <div className="my-1.5 border-t border-zinc-100 dark:border-zinc-800" />
                  )}
                  <div className="flex items-center justify-between py-1">
                    <span className="truncate text-sm text-zinc-900 dark:text-zinc-100">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">{formatCurrency(r.cost)}¥</span>
                      <button
                        onClick={() => removeRCC(r.id!)}
                        className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No RCCs purchased</p>
            </div>
          )}
        </div>

        {/* AUTOSOFTS Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-3.5 w-3.5 text-cyan-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Autosofts
              </span>
              {selectedAutosofts.length > 0 && (
                <span className="rounded-full bg-cyan-100 px-1.5 py-0.5 text-[10px] font-medium text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300">
                  {selectedAutosofts.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveTab("autosofts")}
              className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>
          {selectedAutosofts.length > 0 ? (
            <div className="rounded-lg border border-zinc-200 p-2 dark:border-zinc-700">
              {selectedAutosofts.map((a, index) => (
                <div key={a.id}>
                  {index > 0 && (
                    <div className="my-1.5 border-t border-zinc-100 dark:border-zinc-800" />
                  )}
                  <div className="flex items-center justify-between py-1">
                    <span className="truncate text-sm text-zinc-900 dark:text-zinc-100">
                      {a.name} R{a.rating}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">{formatCurrency(a.cost)}¥</span>
                      <button
                        onClick={() => removeAutosoft(a.id!)}
                        className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No autosofts purchased</p>
            </div>
          )}
        </div>

        {/* Summary - ContactsCard pattern */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Total: {selectedVehicles.length} vehicle{selectedVehicles.length !== 1 ? "s" : ""}, {selectedDrones.length} drone{selectedDrones.length !== 1 ? "s" : ""}, {selectedRCCs.length} RCC{selectedRCCs.length !== 1 ? "s" : ""}, {selectedAutosofts.length} autosoft{selectedAutosofts.length !== 1 ? "s" : ""}
            </span>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {formatCurrency(vehiclesSpent)}¥
            </span>
          </div>
        )}

        {/* Help text */}
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
          RCCs and autosofts are useful for riggers controlling drones.
        </p>
      </div>
    </CreationCard>

    {/* Karma Conversion Modal */}
    {karmaConversionPrompt.modalState && (
      <KarmaConversionModal
        isOpen={karmaConversionPrompt.modalState.isOpen}
        onClose={karmaConversionPrompt.closeModal}
        onConfirm={karmaConversionPrompt.confirmConversion}
        itemName={karmaConversionPrompt.modalState.itemName}
        itemCost={karmaConversionPrompt.modalState.itemCost}
        currentRemaining={remaining}
        karmaToConvert={karmaConversionPrompt.modalState.karmaToConvert}
        karmaAvailable={karmaRemaining}
        currentKarmaConversion={karmaConversion}
        maxKarmaConversion={10}
      />
    )}
  </>
  );
}
