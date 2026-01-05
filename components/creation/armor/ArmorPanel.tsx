"use client";

/**
 * ArmorPanel
 *
 * Card for armor purchasing in sheet-driven creation.
 * Provides enhanced armor management with:
 * - Expandable armor rows with full stats
 * - Capacity-based modification system
 * - Armor accessories support (helmets, shields)
 *
 * Shares budget with GearCard and WeaponsPanel via state.budgets["nuyen"]
 */

import { useMemo, useCallback, useState } from "react";
import {
  useGear,
  type ArmorData,
  type GearCatalogData,
  type ArmorModificationCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { CreationState, ArmorItem } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "../shared";
import { ArmorRow } from "./ArmorRow";
import { ArmorPurchaseModal } from "./ArmorPurchaseModal";
import { ArmorModificationModal } from "./ArmorModificationModal";
import { Lock, Plus, Shield } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const KARMA_TO_NUYEN_RATE = 2000;

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

// Extract armor catalog
function getArmorCatalog(catalog: GearCatalogData | null): ArmorData[] {
  if (!catalog?.armor) {
    return [];
  }
  return catalog.armor;
}

// =============================================================================
// TYPES
// =============================================================================

interface ArmorPanelProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// BUDGET DISPLAY COMPONENT
// =============================================================================

function BudgetDisplay({
  spent,
  total,
  remaining,
  isOver,
}: {
  spent: number;
  total: number;
  remaining: number;
  isOver: boolean;
}) {
  const percentage = Math.min(100, (spent / total) * 100);

  return (
    <div className={`rounded-lg border p-3 ${
      isOver
        ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
        : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
    }`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Armor Budget</span>
        <span className={`font-bold ${
          isOver
            ? "text-red-600 dark:text-red-400"
            : remaining === 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-900 dark:text-zinc-100"
        }`}>
          {formatCurrency(remaining)}¥
          <span className="font-normal text-zinc-400"> remaining</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all ${
            isOver
              ? "bg-red-500"
              : remaining === 0
                ? "bg-emerald-500"
                : "bg-amber-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ArmorPanel({ state, updateState }: ArmorPanelProps) {
  const gearCatalog = useGear();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [modifyingArmorId, setModifyingArmorId] = useState<string | null>(null);

  // Get armor catalog
  const armorCatalog = useMemo(
    () => getArmorCatalog(gearCatalog),
    [gearCatalog]
  );

  // Get selected armor from state
  const selectedArmor = useMemo(
    () => (state.selections?.armor || []) as ArmorItem[],
    [state.selections?.armor]
  );

  // Calculate budget (shared with GearCard and WeaponsPanel)
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const baseNuyen = nuyenBudget?.total || 0;
  const convertedNuyen = karmaConversion * KARMA_TO_NUYEN_RATE;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate total spent across all gear categories
  const selectedGear = (state.selections?.gear || []) as Array<{ cost: number; quantity: number }>;
  const selectedWeapons = (state.selections?.weapons || []) as Array<{
    cost: number;
    quantity: number;
    modifications?: Array<{ cost: number }>;
    purchasedAmmunition?: Array<{ cost: number; quantity: number }>;
  }>;
  const selectedFoci = (state.selections?.foci || []) as Array<{ cost: number }>;
  const selectedCyberware = (state.selections?.cyberware || []) as Array<{ cost: number }>;
  const selectedBioware = (state.selections?.bioware || []) as Array<{ cost: number }>;

  const armorSpent = selectedArmor.reduce((sum, a) => {
    const baseCost = a.cost * a.quantity;
    const modCost = a.modifications?.reduce((m, mod) => m + mod.cost, 0) || 0;
    return sum + baseCost + modCost;
  }, 0);
  const weaponsSpent = selectedWeapons.reduce((sum, w) => {
    const baseCost = w.cost * w.quantity;
    const modCost = w.modifications?.reduce((m, mod) => m + mod.cost, 0) || 0;
    const ammoCost = w.purchasedAmmunition?.reduce((a, ammo) => a + ammo.cost * ammo.quantity, 0) || 0;
    return sum + baseCost + modCost + ammoCost;
  }, 0);
  const gearSpent = selectedGear.reduce((sum, g) => sum + g.cost * g.quantity, 0);
  const fociSpent = selectedFoci.reduce((sum, f) => sum + f.cost, 0);
  const augmentationSpent =
    selectedCyberware.reduce((s, i) => s + i.cost, 0) +
    selectedBioware.reduce((s, i) => s + i.cost, 0);
  const lifestyleSpent = (state.budgets?.["nuyen-spent-lifestyle"] as number) || 0;

  const totalSpent = armorSpent + weaponsSpent + gearSpent + fociSpent + augmentationSpent + lifestyleSpent;
  const remaining = totalNuyen - totalSpent;
  const isOverBudget = remaining < 0;

  // Add armor
  const addArmor = useCallback(
    (armorData: ArmorData) => {
      if (armorData.cost > remaining) return;

      const newArmor: ArmorItem = {
        id: `${armorData.id}-${Date.now()}`,
        catalogId: armorData.id,
        name: armorData.name,
        category: "armor",
        armorRating: armorData.armorRating,
        armorModifier: armorData.armorModifier,
        capacity: armorData.capacity ?? armorData.armorRating,
        capacityUsed: 0,
        cost: armorData.cost,
        availability: armorData.availability,
        quantity: 1,
        modifications: [],
        equipped: false,
        legality: armorData.legality,
        weight: armorData.weight,
      };

      updateState({
        selections: {
          ...state.selections,
          armor: [...selectedArmor, newArmor],
        },
      });

      // Close modal after purchase
      setIsPurchaseModalOpen(false);
    },
    [remaining, selectedArmor, state.selections, updateState]
  );

  // Remove armor
  const removeArmor = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          armor: selectedArmor.filter((a) => a.id !== id),
        },
      });
    },
    [selectedArmor, state.selections, updateState]
  );

  // Get the armor being modified
  const modifyingArmor = useMemo(
    () => selectedArmor.find((a) => a.id === modifyingArmorId) || null,
    [selectedArmor, modifyingArmorId]
  );

  // Open modification modal for armor
  const handleAddMod = useCallback((armorId: string) => {
    setModifyingArmorId(armorId);
  }, []);

  // Remove a modification from armor
  const handleRemoveMod = useCallback(
    (armorId: string, modIndex: number) => {
      const armorIndex = selectedArmor.findIndex((a) => a.id === armorId);
      if (armorIndex === -1) return;

      const armor = selectedArmor[armorIndex];
      const mods = armor.modifications || [];
      const modToRemove = mods[modIndex];

      // Calculate capacity freed
      const capacityFreed = modToRemove?.capacityUsed || 0;

      // Create updated armor
      const updatedArmor: ArmorItem = {
        ...armor,
        modifications: mods.filter((_, i) => i !== modIndex),
        capacityUsed: (armor.capacityUsed || 0) - capacityFreed,
      };

      // Update armor array
      const newArmor = [...selectedArmor];
      newArmor[armorIndex] = updatedArmor;

      updateState({
        selections: {
          ...state.selections,
          armor: newArmor,
        },
      });
    },
    [selectedArmor, state.selections, updateState]
  );

  // Install a modification on armor
  const handleInstallMod = useCallback(
    (mod: ArmorModificationCatalogItemData, rating?: number) => {
      if (!modifyingArmorId) return;

      const armorIndex = selectedArmor.findIndex((a) => a.id === modifyingArmorId);
      if (armorIndex === -1) return;

      const armor = selectedArmor[armorIndex];

      // Calculate capacity cost
      let capacityCost = mod.capacityCost || 0;
      if (mod.noCapacityCost) {
        capacityCost = 0;
      } else if (mod.ratingSpec?.capacityCostScaling?.perRating && rating) {
        capacityCost = (mod.ratingSpec.capacityCostScaling.baseValue || mod.capacityCost || 0) * rating;
      } else if (mod.capacityPerRating && rating) {
        capacityCost = (mod.capacityCost || 0) * rating;
      }

      // Calculate cost
      let modCost = mod.cost || 0;
      if (mod.ratingSpec?.costScaling?.perRating && rating) {
        modCost = (mod.ratingSpec.costScaling.baseValue || mod.cost || 0) * rating;
      } else if (mod.costPerRating && rating) {
        modCost = (mod.cost || 0) * rating;
      }

      // Check capacity
      const totalCapacity = armor.capacity ?? armor.armorRating;
      const usedCapacity = armor.capacityUsed ?? 0;
      if (capacityCost > totalCapacity - usedCapacity) return;

      // Check budget
      if (modCost > remaining) return;

      // Calculate availability
      let modAvailability = mod.availability || 0;
      if (mod.ratingSpec?.availabilityScaling?.perRating && rating) {
        modAvailability = (mod.ratingSpec.availabilityScaling.baseValue || mod.availability || 0) * rating;
      }

      // Create installed mod
      const installedMod = {
        catalogId: mod.id,
        name: mod.name,
        rating: rating,
        capacityUsed: capacityCost,
        cost: modCost,
        availability: modAvailability,
        legality: mod.legality,
      };

      // Update armor
      const updatedArmor: ArmorItem = {
        ...armor,
        modifications: [...(armor.modifications || []), installedMod],
        capacityUsed: usedCapacity + capacityCost,
      };

      // Update armor array
      const newArmor = [...selectedArmor];
      newArmor[armorIndex] = updatedArmor;

      updateState({
        selections: {
          ...state.selections,
          armor: newArmor,
        },
      });

      // Close modal
      setModifyingArmorId(null);
    },
    [modifyingArmorId, selectedArmor, remaining, state.selections, updateState]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (isOverBudget) return "error";
    if (selectedArmor.length > 0) return "valid";
    return "pending";
  }, [isOverBudget, selectedArmor.length]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard title="Armor" description="Purchase armor" status="pending">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
            <Lock className="h-5 w-5 text-zinc-400" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Set priorities first
            </p>
          </div>
        </div>
      </CreationCard>
    );
  }

  return (
    <>
      <CreationCard
        title="Armor"
        description={`${selectedArmor.length} item${selectedArmor.length !== 1 ? "s" : ""}`}
        status={validationStatus}
        headerAction={
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Armor
          </button>
        }
      >
        <div className="space-y-4">
          {/* Budget Display */}
          <BudgetDisplay
            spent={armorSpent}
            total={totalNuyen}
            remaining={remaining}
            isOver={isOverBudget}
          />

          {/* Armor List */}
          {selectedArmor.length > 0 ? (
            <div className="space-y-2">
              {selectedArmor.map((armor) => (
                <ArmorRow
                  key={armor.id}
                  armor={armor}
                  onRemove={removeArmor}
                  onAddMod={handleAddMod}
                  onRemoveMod={handleRemoveMod}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 p-8 dark:border-zinc-700">
              <Shield className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                No armor purchased
              </p>
              <button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
              >
                <Plus className="h-4 w-4" />
                Add your first armor
              </button>
            </div>
          )}

          {/* Armor Spent Summary */}
          {selectedArmor.length > 0 && (
            <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span>Total spent on armor</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(armorSpent)}¥
              </span>
            </div>
          )}
        </div>
      </CreationCard>

      {/* Purchase Modal */}
      <ArmorPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        armorCatalog={armorCatalog}
        remaining={remaining}
        onPurchase={addArmor}
      />

      {/* Modification Modal */}
      {modifyingArmor && (
        <ArmorModificationModal
          isOpen={!!modifyingArmorId}
          onClose={() => setModifyingArmorId(null)}
          armor={modifyingArmor}
          remaining={remaining}
          onInstall={handleInstallMod}
        />
      )}
    </>
  );
}
