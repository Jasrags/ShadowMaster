"use client";

import { useState, useMemo, useCallback } from "react";
import type { CreationState, CharacterDrone, CharacterRCC, CharacterAutosoft } from "@/lib/types";
import {
  useVehicles,
  useVehicleCategories,
  useDrones,
  useDroneSizes,
  useRCCs,
  useAutosofts,
  formatHandlingRating,
  calculateAutosoftCost,
  calculateAutosoftAvailability,
  type VehicleCatalogItemData,
  type DroneCatalogItemData,
  type RCCCatalogItemData,
  type AutosoftCatalogItemData,
} from "@/lib/rules/RulesetContext";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

// Types for owned items stored in state
interface OwnedVehicle {
  id: string;
  catalogId: string;
  name: string;
  category: string;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
}

type VehicleTab = "vehicles" | "drones" | "rccs" | "autosofts";
type VehicleType = "all" | "groundcraft" | "watercraft" | "aircraft";
type DroneSize = "all" | "micro" | "mini" | "small" | "medium" | "large" | "huge";

const MAX_AVAILABILITY = 12;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getAvailabilityDisplay(availability: number, restricted?: boolean, forbidden?: boolean): string {
  let display = String(availability);
  if (restricted) display += "R";
  if (forbidden) display += "F";
  return display;
}

function isItemAvailable(availability: number, forbidden?: boolean): boolean {
  return availability <= MAX_AVAILABILITY && !forbidden;
}

// Counter for generating unique IDs
let idCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}-${++idCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

export function VehiclesStep({ state, updateState, budgetValues }: StepProps) {
  const vehicles = useVehicles();
  const vehicleCategories = useVehicleCategories();
  const drones = useDrones();
  const droneSizes = useDroneSizes();
  const rccs = useRCCs();
  const autosofts = useAutosofts();

  const [activeTab, setActiveTab] = useState<VehicleTab>("vehicles");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<VehicleType>("all");
  const [vehicleCategoryFilter, setVehicleCategoryFilter] = useState<string>("all");
  const [droneSizeFilter, setDroneSizeFilter] = useState<DroneSize>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [autosoftRating, setAutosoftRating] = useState<Record<string, number>>({});

  // Get selections from state
  const selectedVehicles: OwnedVehicle[] = (state.selections?.vehicles as OwnedVehicle[]) || [];
  const selectedDrones: CharacterDrone[] = (state.selections?.drones as CharacterDrone[]) || [];
  const selectedRCCs: CharacterRCC[] = (state.selections?.rccs as CharacterRCC[]) || [];
  const selectedAutosofts: CharacterAutosoft[] = (state.selections?.autosofts as CharacterAutosoft[]) || [];

  // Calculate budget from gear step
  const baseNuyen = budgetValues["nuyen"] || 0;
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const convertedNuyen = karmaConversion * 2000;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate total spent
  const gearSpent = ((state.selections?.gear as Array<{ cost: number; quantity: number }>) || []).reduce(
    (sum, item) => sum + item.cost * item.quantity,
    0
  );
  const lifestyleCost = (state.selections?.lifestyle as { monthlyCost: number })?.monthlyCost || 0;
  const augmentationSpent = (state.budgets?.["nuyen-spent-augmentations"] as number) || 0;
  const vehiclesSpent =
    selectedVehicles.reduce((sum, v) => sum + v.cost, 0) +
    selectedDrones.reduce((sum, d) => sum + d.cost, 0) +
    selectedRCCs.reduce((sum, r) => sum + r.cost, 0) +
    selectedAutosofts.reduce((sum, a) => sum + a.cost, 0);
  const totalSpent = gearSpent + lifestyleCost + augmentationSpent + vehiclesSpent;
  const remaining = totalNuyen - totalSpent;

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    let items = [...vehicles];

    // Filter by vehicle type
    if (vehicleTypeFilter !== "all") {
      const typeMapping: Record<string, string[]> = {
        groundcraft: ["bikes", "cars", "trucks"],
        watercraft: ["boats", "submarines"],
        aircraft: ["fixed-wing", "rotorcraft", "vtol", "lav", "walkers"],
      };
      const categories = typeMapping[vehicleTypeFilter] || [];
      items = items.filter((v) => categories.includes(v.category));
    }

    // Filter by specific category
    if (vehicleCategoryFilter !== "all") {
      items = items.filter((v) => v.category === vehicleCategoryFilter);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((v) => v.name.toLowerCase().includes(query));
    }

    // Filter by availability
    if (!showUnavailable) {
      items = items.filter((v) => isItemAvailable(v.availability, v.forbidden));
    }

    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [vehicles, vehicleTypeFilter, vehicleCategoryFilter, searchQuery, showUnavailable]);

  // Filter drones
  const filteredDrones = useMemo(() => {
    let items = [...drones];

    // Filter by size
    if (droneSizeFilter !== "all") {
      items = items.filter((d) => d.size === droneSizeFilter);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((d) => d.name.toLowerCase().includes(query));
    }

    // Filter by availability
    if (!showUnavailable) {
      items = items.filter((d) => isItemAvailable(d.availability, d.forbidden));
    }

    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [drones, droneSizeFilter, searchQuery, showUnavailable]);

  // Filter RCCs
  const filteredRCCs = useMemo(() => {
    let items = [...rccs];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter((r) => r.name.toLowerCase().includes(query));
    }

    // Filter by availability
    if (!showUnavailable) {
      items = items.filter((r) => isItemAvailable(r.availability, false));
    }

    return items.sort((a, b) => a.deviceRating - b.deviceRating);
  }, [rccs, searchQuery, showUnavailable]);

  // Add vehicle
  const addVehicle = useCallback((vehicle: VehicleCatalogItemData) => {
    const newVehicle: OwnedVehicle = {
      id: generateId("vehicle"),
      catalogId: vehicle.id,
      name: vehicle.name,
      category: vehicle.category,
      cost: vehicle.cost,
      availability: vehicle.availability,
      restricted: vehicle.restricted,
      forbidden: vehicle.forbidden,
    };

    updateState({
      selections: {
        ...state.selections,
        vehicles: [...selectedVehicles, newVehicle],
      },
    });
  }, [state.selections, selectedVehicles, updateState]);

  // Remove vehicle
  const removeVehicle = useCallback((id: string) => {
    updateState({
      selections: {
        ...state.selections,
        vehicles: selectedVehicles.filter((v) => v.id !== id),
      },
    });
  }, [state.selections, selectedVehicles, updateState]);

  // Add drone
  const addDrone = useCallback((drone: DroneCatalogItemData) => {
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
  }, [state.selections, selectedDrones, updateState]);

  // Remove drone
  const removeDrone = useCallback((id: string) => {
    updateState({
      selections: {
        ...state.selections,
        drones: selectedDrones.filter((d) => d.id !== id),
      },
    });
  }, [state.selections, selectedDrones, updateState]);

  // Add RCC
  const addRCC = useCallback((rcc: RCCCatalogItemData) => {
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
  }, [state.selections, selectedRCCs, updateState]);

  // Remove RCC
  const removeRCC = useCallback((id: string) => {
    updateState({
      selections: {
        ...state.selections,
        rccs: selectedRCCs.filter((r) => r.id !== id),
      },
    });
  }, [state.selections, selectedRCCs, updateState]);

  // Add autosoft
  const addAutosoft = useCallback((autosoft: AutosoftCatalogItemData) => {
    const rating = autosoftRating[autosoft.id] || 1;
    const cost = calculateAutosoftCost(autosoft.costPerRating, rating);
    const availability = calculateAutosoftAvailability(autosoft.availabilityPerRating, rating);

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
  }, [state.selections, selectedAutosofts, autosoftRating, updateState]);

  // Remove autosoft
  const removeAutosoft = (id: string) => {
    updateState({
      selections: {
        ...state.selections,
        autosofts: selectedAutosofts.filter((a) => a.id !== id),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Budget</p>
            <p className="text-lg font-semibold">¥{formatCurrency(totalNuyen)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Vehicles/Drones</p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              ¥{formatCurrency(vehiclesSpent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Spent</p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              ¥{formatCurrency(totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Remaining</p>
            <p
              className={`text-lg font-semibold ${
                remaining < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              ¥{formatCurrency(remaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700">
        {[
          { id: "vehicles", label: "Vehicles", count: selectedVehicles.length },
          { id: "drones", label: "Drones", count: selectedDrones.length },
          { id: "rccs", label: "RCCs", count: selectedRCCs.length },
          { id: "autosofts", label: "Autosofts", count: selectedAutosofts.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as VehicleTab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-xs dark:bg-emerald-900">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-48 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showUnavailable}
            onChange={(e) => setShowUnavailable(e.target.checked)}
            className="rounded"
          />
          Show unavailable
        </label>
      </div>

      {/* Vehicles Tab */}
      {activeTab === "vehicles" && (
        <div className="space-y-4">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-1">
            {[
              { id: "all", label: "All Types" },
              { id: "groundcraft", label: "Ground" },
              { id: "watercraft", label: "Water" },
              { id: "aircraft", label: "Air" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setVehicleTypeFilter(type.id as VehicleType);
                  setVehicleCategoryFilter("all");
                }}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  vehicleTypeFilter === type.id
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          {vehicleTypeFilter !== "all" && (
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setVehicleCategoryFilter("all")}
                className={`rounded-full px-2 py-1 text-xs transition-colors ${
                  vehicleCategoryFilter === "all"
                    ? "bg-zinc-300 text-zinc-800 dark:bg-zinc-600"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                }`}
              >
                All
              </button>
              {vehicleCategories
                .filter((cat) => {
                  const typeMapping: Record<string, string[]> = {
                    groundcraft: ["bikes", "cars", "trucks"],
                    watercraft: ["boats", "submarines"],
                    aircraft: ["fixed-wing", "rotorcraft", "vtol", "lav", "walkers"],
                  };
                  return typeMapping[vehicleTypeFilter]?.includes(cat.id);
                })
                .map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setVehicleCategoryFilter(cat.id)}
                    className={`rounded-full px-2 py-1 text-xs transition-colors ${
                      vehicleCategoryFilter === cat.id
                        ? "bg-zinc-300 text-zinc-800 dark:bg-zinc-600"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>
          )}

          {/* Vehicle List */}
          <div className="max-h-80 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-3 py-2 text-left">Vehicle</th>
                  <th className="px-3 py-2 text-center">Hand</th>
                  <th className="px-3 py-2 text-center">Spd/Accel</th>
                  <th className="px-3 py-2 text-center">Body/Armor</th>
                  <th className="px-3 py-2 text-right">Cost</th>
                  <th className="px-3 py-2 text-center">Avail</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {filteredVehicles.map((vehicle) => {
                  const available = isItemAvailable(vehicle.availability, vehicle.forbidden);
                  const canAfford = vehicle.cost <= remaining;

                  return (
                    <tr
                      key={vehicle.id}
                      className={`${!available ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
                    >
                      <td className="px-3 py-2">
                        <p className="font-medium">{vehicle.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {vehicle.category} | Seats: {vehicle.seats || "-"} | P{vehicle.pilot}/S{vehicle.sensor}
                        </p>
                      </td>
                      <td className="px-3 py-2 text-center">{formatHandlingRating(vehicle.handling)}</td>
                      <td className="px-3 py-2 text-center">
                        {vehicle.speed}/{vehicle.acceleration}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {vehicle.body}/{vehicle.armor}
                      </td>
                      <td className="px-3 py-2 text-right">¥{formatCurrency(vehicle.cost)}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`${
                            vehicle.restricted
                              ? "text-amber-600 dark:text-amber-400"
                              : vehicle.forbidden
                                ? "text-red-600 dark:text-red-400"
                                : ""
                          }`}
                        >
                          {getAvailabilityDisplay(vehicle.availability, vehicle.restricted, vehicle.forbidden)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => addVehicle(vehicle)}
                          disabled={!available || !canAfford}
                          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                            available && canAfford
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                          }`}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-zinc-500">
                      No vehicles found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Selected Vehicles */}
          {selectedVehicles.length > 0 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
              <h4 className="mb-2 text-sm font-medium">Selected Vehicles ({selectedVehicles.length})</h4>
              <div className="space-y-1">
                {selectedVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between text-sm">
                    <span>{vehicle.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">¥{formatCurrency(vehicle.cost)}</span>
                      <button
                        onClick={() => removeVehicle(vehicle.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Drones Tab */}
      {activeTab === "drones" && (
        <div className="space-y-4">
          {/* Size Filter */}
          <div className="flex flex-wrap gap-1">
            {[
              { id: "all", label: "All Sizes" },
              ...droneSizes.map((size) => ({ id: size.id, label: size.name })),
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => setDroneSizeFilter(size.id as DroneSize)}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  droneSizeFilter === size.id
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>

          {/* Drone List */}
          <div className="max-h-80 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-3 py-2 text-left">Drone</th>
                  <th className="px-3 py-2 text-center">Size</th>
                  <th className="px-3 py-2 text-center">Body/Armor</th>
                  <th className="px-3 py-2 text-center">Pilot/Sensor</th>
                  <th className="px-3 py-2 text-right">Cost</th>
                  <th className="px-3 py-2 text-center">Avail</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {filteredDrones.map((drone) => {
                  const available = isItemAvailable(drone.availability, drone.forbidden);
                  const canAfford = drone.cost <= remaining;

                  return (
                    <tr
                      key={drone.id}
                      className={`${!available ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
                    >
                      <td className="px-3 py-2">
                        <p className="font-medium">{drone.name}</p>
                        {drone.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                            {drone.description}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center capitalize">{drone.size}</td>
                      <td className="px-3 py-2 text-center">
                        {drone.body}/{drone.armor}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {drone.pilot}/{drone.sensor}
                      </td>
                      <td className="px-3 py-2 text-right">¥{formatCurrency(drone.cost)}</td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`${
                            drone.restricted
                              ? "text-amber-600 dark:text-amber-400"
                              : drone.forbidden
                                ? "text-red-600 dark:text-red-400"
                                : ""
                          }`}
                        >
                          {getAvailabilityDisplay(drone.availability, drone.restricted, drone.forbidden)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => addDrone(drone)}
                          disabled={!available || !canAfford}
                          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                            available && canAfford
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                          }`}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredDrones.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-zinc-500">
                      No drones found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Selected Drones */}
          {selectedDrones.length > 0 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
              <h4 className="mb-2 text-sm font-medium">Selected Drones ({selectedDrones.length})</h4>
              <div className="space-y-1">
                {selectedDrones.map((drone) => (
                  <div key={drone.id} className="flex items-center justify-between text-sm">
                    <span>
                      {drone.name} ({drone.size})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">¥{formatCurrency(drone.cost)}</span>
                      <button
                        onClick={() => removeDrone(drone.id!)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RCCs Tab */}
      {activeTab === "rccs" && (
        <div className="space-y-4">
          <div className="max-h-80 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-3 py-2 text-left">RCC</th>
                  <th className="px-3 py-2 text-center">Device Rating</th>
                  <th className="px-3 py-2 text-center">DP/Firewall</th>
                  <th className="px-3 py-2 text-right">Cost</th>
                  <th className="px-3 py-2 text-center">Avail</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {filteredRCCs.map((rcc) => {
                  const available = isItemAvailable(rcc.availability, false);
                  const canAfford = rcc.cost <= remaining;

                  return (
                    <tr
                      key={rcc.id}
                      className={`${!available ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
                    >
                      <td className="px-3 py-2">
                        <p className="font-medium">{rcc.name}</p>
                        {rcc.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
                            {rcc.description}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">{rcc.deviceRating}</td>
                      <td className="px-3 py-2 text-center">
                        {rcc.dataProcessing}/{rcc.firewall}
                      </td>
                      <td className="px-3 py-2 text-right">¥{formatCurrency(rcc.cost)}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={rcc.restricted ? "text-amber-600 dark:text-amber-400" : ""}>
                          {getAvailabilityDisplay(rcc.availability, rcc.restricted, false)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => addRCC(rcc)}
                          disabled={!available || !canAfford}
                          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                            available && canAfford
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                          }`}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredRCCs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-zinc-500">
                      No RCCs found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Selected RCCs */}
          {selectedRCCs.length > 0 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
              <h4 className="mb-2 text-sm font-medium">Selected RCCs ({selectedRCCs.length})</h4>
              <div className="space-y-1">
                {selectedRCCs.map((rcc) => (
                  <div key={rcc.id} className="flex items-center justify-between text-sm">
                    <span>
                      {rcc.name} (DR{rcc.deviceRating})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">¥{formatCurrency(rcc.cost)}</span>
                      <button
                        onClick={() => removeRCC(rcc.id!)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Autosofts Tab */}
      {activeTab === "autosofts" && (
        <div className="space-y-4">
          <div className="max-h-80 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-3 py-2 text-left">Autosoft</th>
                  <th className="px-3 py-2 text-center">Category</th>
                  <th className="px-3 py-2 text-center">Rating</th>
                  <th className="px-3 py-2 text-right">Cost</th>
                  <th className="px-3 py-2 text-center">Avail</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {autosofts.map((autosoft) => {
                  const rating = autosoftRating[autosoft.id] || 1;
                  const cost = calculateAutosoftCost(autosoft.costPerRating, rating);
                  const availability = calculateAutosoftAvailability(autosoft.availabilityPerRating, rating);
                  const available = isItemAvailable(availability, false);
                  const canAfford = cost <= remaining;

                  return (
                    <tr
                      key={autosoft.id}
                      className={`${!available ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
                    >
                      <td className="px-3 py-2">
                        <p className="font-medium">{autosoft.name}</p>
                        {autosoft.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">{autosoft.description}</p>
                        )}
                        {autosoft.requiresTarget && (
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            Requires target ({autosoft.targetType})
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center capitalize">{autosoft.category}</td>
                      <td className="px-3 py-2 text-center">
                        <select
                          value={rating}
                          onChange={(e) =>
                            setAutosoftRating({ ...autosoftRating, [autosoft.id]: parseInt(e.target.value) })
                          }
                          className="w-16 rounded border border-zinc-300 bg-white px-1 py-0.5 text-center text-xs dark:border-zinc-600 dark:bg-zinc-800"
                        >
                          {Array.from({ length: autosoft.maxRating }, (_, i) => i + 1).map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 text-right">¥{formatCurrency(cost)}</td>
                      <td className="px-3 py-2 text-center">{availability}</td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => addAutosoft(autosoft)}
                          disabled={!available || !canAfford}
                          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                            available && canAfford
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                          }`}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Autosofts */}
          {selectedAutosofts.length > 0 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
              <h4 className="mb-2 text-sm font-medium">Selected Autosofts ({selectedAutosofts.length})</h4>
              <div className="space-y-1">
                {selectedAutosofts.map((autosoft) => (
                  <div key={autosoft.id} className="flex items-center justify-between text-sm">
                    <span>
                      {autosoft.name} R{autosoft.rating}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">¥{formatCurrency(autosoft.cost)}</span>
                      <button
                        onClick={() => removeAutosoft(autosoft.id!)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Maximum availability at creation: {MAX_AVAILABILITY}. Restricted (R) items require a license. Forbidden (F)
        items are not available at creation. Rigger-specific items like RCCs and autosofts are useful for characters
        with the Rigger quality or high Pilot skills.
      </p>
    </div>
  );
}
