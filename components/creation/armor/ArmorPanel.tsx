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
import {
  CreationCard,
  KarmaConversionModal,
  useKarmaConversionPrompt,
} from "../shared";
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
// COMPONENT
// =============================================================================

export function ArmorPanel({ state, updateState }: ArmorPanelProps) {
  const gearCatalog = useGear();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

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

  // Karma conversion hook
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

  // Add armor (actual implementation)
  const actuallyAddArmor = useCallback(
    (armorData: ArmorData) => {
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
    [selectedArmor, state.selections, updateState]
  );

  // Add armor (with karma conversion prompt if needed)
  const addArmor = useCallback(
    (armorData: ArmorData) => {
      // Check if already affordable
      if (armorData.cost <= remaining) {
        actuallyAddArmor(armorData);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(armorData.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(armorData.name, armorData.cost, () => {
          actuallyAddArmor(armorData);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remaining, actuallyAddArmor, karmaConversionPrompt]
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

  // Install a modification on armor (actual implementation)
  const actuallyInstallMod = useCallback(
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
    [modifyingArmorId, selectedArmor, state.selections, updateState]
  );

  // Install a modification (with karma conversion prompt if needed)
  const handleInstallMod = useCallback(
    (mod: ArmorModificationCatalogItemData, rating?: number) => {
      if (!modifyingArmorId) return;

      const armorIndex = selectedArmor.findIndex((a) => a.id === modifyingArmorId);
      if (armorIndex === -1) return;

      const armor = selectedArmor[armorIndex];

      // Calculate capacity cost for validation
      let capacityCost = mod.capacityCost || 0;
      if (mod.noCapacityCost) {
        capacityCost = 0;
      } else if (mod.ratingSpec?.capacityCostScaling?.perRating && rating) {
        capacityCost = (mod.ratingSpec.capacityCostScaling.baseValue || mod.capacityCost || 0) * rating;
      } else if (mod.capacityPerRating && rating) {
        capacityCost = (mod.capacityCost || 0) * rating;
      }

      // Check capacity first (this is a hard limit, not fixable by karma)
      const totalCapacity = armor.capacity ?? armor.armorRating;
      const usedCapacity = armor.capacityUsed ?? 0;
      if (capacityCost > totalCapacity - usedCapacity) return;

      // Calculate cost
      let modCost = mod.cost || 0;
      if (mod.ratingSpec?.costScaling?.perRating && rating) {
        modCost = (mod.ratingSpec.costScaling.baseValue || mod.cost || 0) * rating;
      } else if (mod.costPerRating && rating) {
        modCost = (mod.cost || 0) * rating;
      }

      // Check if already affordable
      if (modCost <= remaining) {
        actuallyInstallMod(mod, rating);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(modCost);
      if (conversionInfo?.canConvert) {
        const modName = rating ? `${mod.name} (Rating ${rating})` : mod.name;
        karmaConversionPrompt.promptConversion(modName, modCost, () => {
          actuallyInstallMod(mod, rating);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [modifyingArmorId, selectedArmor, remaining, actuallyInstallMod, karmaConversionPrompt]
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
        <div className="space-y-3">
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

          {/* Summary */}
          {selectedArmor.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Total: {selectedArmor.length} item{selectedArmor.length !== 1 ? "s" : ""}
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
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

      {/* Karma Conversion Modal */}
      <KarmaConversionModal
        isOpen={karmaConversionPrompt.modalState.isOpen}
        onClose={karmaConversionPrompt.closeModal}
        onConfirm={karmaConversionPrompt.confirmConversion}
        itemName={karmaConversionPrompt.modalState.itemName}
        itemCost={karmaConversionPrompt.modalState.itemCost}
        currentRemaining={karmaConversionPrompt.currentRemaining}
        karmaToConvert={karmaConversionPrompt.modalState.karmaToConvert}
        karmaAvailable={karmaConversionPrompt.karmaAvailable}
        currentKarmaConversion={karmaConversionPrompt.currentKarmaConversion}
        maxKarmaConversion={karmaConversionPrompt.maxKarmaConversion}
      />
    </>
  );
}
