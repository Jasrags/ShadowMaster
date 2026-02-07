"use client";

/**
 * VehiclesCard
 *
 * Compact card for vehicle and drone purchasing in sheet-driven creation.
 * Handles vehicles, drones, RCCs, and autosofts via modals.
 *
 * Features:
 * - Modal-based item selection
 * - Budget tracking
 * - Selected items display with remove functionality
 */

import { useMemo, useCallback, useState } from "react";
import type {
  CreationState,
  CharacterDrone,
  CharacterRCC,
  CharacterAutosoft,
  ItemLegality,
} from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import {
  CreationCard,
  SummaryFooter,
  KarmaConversionModal,
  useKarmaConversionPrompt,
  LegalityWarnings,
  LegalityBadge,
} from "./shared";
import type { LegalityWarningItem } from "./shared";
import {
  VehicleSystemModal,
  type VehicleSystemSelection,
  type VehicleSelection,
  type DroneSelection,
  type RCCSelection,
  type AutosoftSelection,
} from "./vehicles";
import { Lock, X, Car, Bot, Wifi, Code, Plus } from "lucide-react";
import { InfoTooltip } from "@/components/ui";

// =============================================================================
// CONSTANTS
// =============================================================================

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
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Local category cost (for card-specific displays)
  const vehiclesSpent =
    selectedVehicles.reduce((sum, v) => sum + v.cost, 0) +
    selectedDrones.reduce((sum, d) => sum + d.cost, 0) +
    selectedRCCs.reduce((sum, r) => sum + r.cost, 0) +
    selectedAutosofts.reduce((sum, a) => sum + a.cost, 0);

  // Use centralized nuyen spent from budget context for global budget tracker
  const totalSpent = nuyenBudget?.spent || 0;
  const remaining = totalNuyen - totalSpent;

  const totalItems =
    selectedVehicles.length +
    selectedDrones.length +
    selectedRCCs.length +
    selectedAutosofts.length;

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

  // Add vehicle from modal
  const actuallyAddVehicle = useCallback(
    (vehicle: VehicleSelection) => {
      const newVehicle: OwnedVehicle = {
        id: generateId("vehicle"),
        catalogId: vehicle.catalogId,
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
    (vehicle: VehicleSelection) => {
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

  // Add drone from modal
  const actuallyAddDrone = useCallback(
    (drone: DroneSelection) => {
      const newDrone: CharacterDrone = {
        id: generateId("drone"),
        catalogId: drone.catalogId,
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
    (drone: DroneSelection) => {
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

  // Add RCC from modal
  const actuallyAddRCC = useCallback(
    (rcc: RCCSelection) => {
      const newRCC: CharacterRCC = {
        id: generateId("rcc"),
        catalogId: rcc.catalogId,
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
    (rcc: RCCSelection) => {
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

  // Add autosoft from modal
  const actuallyAddAutosoft = useCallback(
    (autosoft: AutosoftSelection) => {
      const newAutosoft: CharacterAutosoft = {
        id: generateId("autosoft"),
        catalogId: autosoft.catalogId,
        name: autosoft.name,
        category: autosoft.category as CharacterAutosoft["category"],
        rating: autosoft.rating,
        cost: autosoft.cost,
        availability: autosoft.availability,
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
    (autosoft: AutosoftSelection) => {
      // Check if already affordable
      if (autosoft.cost <= remaining) {
        actuallyAddAutosoft(autosoft);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(autosoft.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(
          `${autosoft.name} R${autosoft.rating}`,
          autosoft.cost,
          () => {
            actuallyAddAutosoft(autosoft);
          }
        );
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remaining, actuallyAddAutosoft, karmaConversionPrompt]
  );

  // Unified add handler for VehicleSystemModal
  const handleUnifiedAdd = useCallback(
    (selection: VehicleSystemSelection) => {
      switch (selection.type) {
        case "vehicle":
          addVehicle(selection.selection);
          break;
        case "drone":
          addDrone(selection.selection);
          break;
        case "rcc":
          addRCC(selection.selection);
          break;
        case "autosoft":
          addAutosoft(selection.selection);
          break;
      }
    },
    [addVehicle, addDrone, addRCC, addAutosoft]
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

  // Legality items for warnings (combine vehicles, drones, RCCs)
  const legalityItems: LegalityWarningItem[] = useMemo(() => {
    const items: LegalityWarningItem[] = [];

    for (const v of selectedVehicles) {
      items.push({ name: v.name, legality: v.legality, availability: v.availability });
    }
    for (const d of selectedDrones) {
      items.push({ name: d.name, legality: d.legality, availability: d.availability });
    }
    for (const r of selectedRCCs) {
      items.push({ name: r.name, legality: r.legality, availability: r.availability });
    }

    return items;
  }, [selectedVehicles, selectedDrones, selectedRCCs]);

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
      <CreationCard
        title="Vehicles & Drones"
        description="Purchase vehicles and drones"
        status="pending"
      >
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Set priorities first</p>
        </div>
      </CreationCard>
    );
  }

  return (
    <>
      <CreationCard
        title="Vehicles & Drones"
        status={validationStatus}
        headerAction={
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        }
      >
        <div className="space-y-4">
          {/* Nuyen bar - compact style */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                <span>Nuyen</span>
                <InfoTooltip
                  content="Nuyen spent on vehicles, drones, RCCs, and autosofts"
                  label="Nuyen budget info"
                />
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
                className={`h-full transition-all ${remaining < 0 ? "bg-red-500" : "bg-emerald-500"}`}
                style={{ width: `${Math.min(100, (totalSpent / totalNuyen) * 100)}%` }}
              />
            </div>
          </div>

          {/* Legality Warnings */}
          <LegalityWarnings items={legalityItems} />

          {/* Empty state */}
          {totalItems === 0 && (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                No vehicles or drones selected
              </p>
            </div>
          )}

          {/* VEHICLES Section */}
          {selectedVehicles.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Car className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Vehicles
                </span>
                <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  {selectedVehicles.length}
                </span>
              </div>
              <div className="rounded-lg border border-zinc-200 p-2 dark:border-zinc-700">
                {selectedVehicles.map((v, index) => (
                  <div key={v.id}>
                    {index > 0 && (
                      <div className="my-1.5 border-t border-zinc-100 dark:border-zinc-800" />
                    )}
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="truncate text-sm text-zinc-900 dark:text-zinc-100">
                          {v.name}
                        </span>
                        <LegalityBadge legality={v.legality} availability={v.availability} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="shrink-0 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          ¥{formatCurrency(v.cost)}
                        </span>
                        <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
                        <button
                          onClick={() => removeVehicle(v.id)}
                          className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          title="Remove vehicle"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DRONES Section */}
          {selectedDrones.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Bot className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Drones
                </span>
                <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                  {selectedDrones.length}
                </span>
              </div>
              <div className="rounded-lg border border-zinc-200 p-2 dark:border-zinc-700">
                {selectedDrones.map((d, index) => (
                  <div key={d.id}>
                    {index > 0 && (
                      <div className="my-1.5 border-t border-zinc-100 dark:border-zinc-800" />
                    )}
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="truncate text-sm text-zinc-900 dark:text-zinc-100">
                          {d.name}
                        </span>
                        <LegalityBadge legality={d.legality} availability={d.availability} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="shrink-0 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          ¥{formatCurrency(d.cost)}
                        </span>
                        <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
                        <button
                          onClick={() => removeDrone(d.id!)}
                          className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          title="Remove drone"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RCCS Section */}
          {selectedRCCs.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Wifi className="h-3.5 w-3.5 text-purple-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  RCCs
                </span>
                <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                  {selectedRCCs.length}
                </span>
              </div>
              <div className="rounded-lg border border-zinc-200 p-2 dark:border-zinc-700">
                {selectedRCCs.map((r, index) => (
                  <div key={r.id}>
                    {index > 0 && (
                      <div className="my-1.5 border-t border-zinc-100 dark:border-zinc-800" />
                    )}
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="truncate text-sm text-zinc-900 dark:text-zinc-100">
                          {r.name}
                        </span>
                        <LegalityBadge legality={r.legality} availability={r.availability} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="shrink-0 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          ¥{formatCurrency(r.cost)}
                        </span>
                        <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
                        <button
                          onClick={() => removeRCC(r.id!)}
                          className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          title="Remove RCC"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUTOSOFTS Section */}
          {selectedAutosofts.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Code className="h-3.5 w-3.5 text-cyan-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Autosofts
                </span>
                <span className="rounded-full bg-cyan-100 px-1.5 py-0.5 text-[10px] font-medium text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300">
                  {selectedAutosofts.length}
                </span>
              </div>
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
                      <div className="flex items-center gap-1">
                        <span className="shrink-0 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          ¥{formatCurrency(a.cost)}
                        </span>
                        <div className="mx-1 h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
                        <button
                          onClick={() => removeAutosoft(a.id!)}
                          className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          title="Remove autosoft"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Summary */}
          <SummaryFooter count={totalItems} total={vehiclesSpent} format="currency" label="item" />
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

      {/* Unified Vehicle System Modal */}
      <VehicleSystemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleUnifiedAdd}
        initialType="vehicle"
        remainingNuyen={remaining}
        ownedItems={{
          vehicleIds: selectedVehicles.map((v) => v.catalogId),
          droneIds: selectedDrones.map((d) => d.catalogId),
          rccIds: selectedRCCs.map((r) => r.catalogId),
          autosoftIds: selectedAutosofts.map((a) => a.catalogId),
        }}
      />
    </>
  );
}
