"use client";

/**
 * GearPanel
 *
 * Card for general gear purchasing in sheet-driven creation.
 * Provides gear management with:
 * - Expandable gear rows with full stats
 * - Category-based purchase modal
 * - Rating selection for rated items
 *
 * Shares budget with WeaponsPanel, ArmorPanel, and other nuyen-spending panels
 * via state.budgets["nuyen"]
 */

import { useMemo, useCallback, useState } from "react";
import {
  useGear,
  type GearItemData,
  type GearModificationCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { CreationState, GearItem } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import {
  CreationCard,
  KarmaConversionModal,
  useKarmaConversionPrompt,
} from "../shared";
import { GearRow } from "./GearRow";
import { GearPurchaseModal } from "./GearPurchaseModal";
import { GearModificationModal } from "./GearModificationModal";
import { Lock, Plus, Backpack, Minus } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const KARMA_TO_NUYEN_RATE = 2000;
const MAX_KARMA_CONVERSION = 10;

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

// =============================================================================
// TYPES
// =============================================================================

interface GearPanelProps {
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
    <div
      className={`rounded-lg border p-3 ${
        isOver
          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
      }`}
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Gear Budget</span>
        <span
          className={`font-bold ${
            isOver
              ? "text-red-600 dark:text-red-400"
              : remaining === 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-zinc-900 dark:text-zinc-100"
          }`}
        >
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
// KARMA CONVERSION COMPONENT
// =============================================================================

function KarmaConversion({
  karmaConversion,
  karmaRemaining,
  convertedNuyen,
  onConvert,
}: {
  karmaConversion: number;
  karmaRemaining: number;
  convertedNuyen: number;
  onConvert: (delta: number) => void;
}) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Karma → Nuyen
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400">
            {formatCurrency(KARMA_TO_NUYEN_RATE)}¥ per karma (max{" "}
            {MAX_KARMA_CONVERSION})
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onConvert(-1)}
            disabled={karmaConversion <= 0}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              karmaConversion > 0
                ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-300"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex h-8 w-10 items-center justify-center rounded bg-white text-base font-bold text-amber-700 dark:bg-zinc-800 dark:text-amber-300">
            {karmaConversion}
          </div>
          <button
            onClick={() => onConvert(1)}
            disabled={
              karmaConversion >= MAX_KARMA_CONVERSION || karmaRemaining <= 0
            }
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              karmaConversion < MAX_KARMA_CONVERSION && karmaRemaining > 0
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      {convertedNuyen > 0 && (
        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          +{formatCurrency(convertedNuyen)}¥ from {karmaConversion} karma
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GearPanel({ state, updateState }: GearPanelProps) {
  const gearCatalog = useGear();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [modifyingGearId, setModifyingGearId] = useState<string | null>(null);

  // Get selected gear from state
  const selectedGear = useMemo(
    () => (state.selections?.gear || []) as GearItem[],
    [state.selections?.gear]
  );

  // Find gear being modified
  const modifyingGear = useMemo(
    () => selectedGear.find((g) => g.id === modifyingGearId) || null,
    [selectedGear, modifyingGearId]
  );

  // Karma-to-nuyen conversion
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const karmaRemaining = karmaBudget?.remaining || 0;

  // Calculate budget (shared with other panels)
  const baseNuyen = nuyenBudget?.total || 0;
  const convertedNuyen = karmaConversion * KARMA_TO_NUYEN_RATE;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate total spent across all gear categories
  const selectedWeapons = (state.selections?.weapons || []) as Array<{
    cost: number;
    quantity: number;
    modifications?: Array<{ cost: number }>;
    purchasedAmmunition?: Array<{ cost: number; quantity: number }>;
  }>;
  const selectedArmor = (state.selections?.armor || []) as Array<{
    cost: number;
    quantity: number;
    modifications?: Array<{ cost: number }>;
  }>;
  const selectedFoci = (state.selections?.foci || []) as Array<{ cost: number }>;
  const selectedCyberware = (state.selections?.cyberware || []) as Array<{
    cost: number;
  }>;
  const selectedBioware = (state.selections?.bioware || []) as Array<{
    cost: number;
  }>;

  const gearSpent = selectedGear.reduce(
    (sum, g) => sum + g.cost * g.quantity,
    0
  );
  const weaponsSpent = selectedWeapons.reduce((sum, w) => {
    const baseCost = w.cost * w.quantity;
    const modCost =
      w.modifications?.reduce((m, mod) => m + mod.cost, 0) || 0;
    const ammoCost =
      w.purchasedAmmunition?.reduce(
        (a, ammo) => a + ammo.cost * ammo.quantity,
        0
      ) || 0;
    return sum + baseCost + modCost + ammoCost;
  }, 0);
  const armorSpent = selectedArmor.reduce((sum, a) => {
    const baseCost = a.cost * a.quantity;
    const modCost =
      a.modifications?.reduce((m, mod) => m + mod.cost, 0) || 0;
    return sum + baseCost + modCost;
  }, 0);
  const fociSpent = selectedFoci.reduce((sum, f) => sum + f.cost, 0);
  const augmentationSpent =
    selectedCyberware.reduce((s, i) => s + i.cost, 0) +
    selectedBioware.reduce((s, i) => s + i.cost, 0);
  const lifestyleSpent =
    (state.budgets?.["nuyen-spent-lifestyle"] as number) || 0;

  const totalSpent =
    gearSpent +
    weaponsSpent +
    armorSpent +
    fociSpent +
    augmentationSpent +
    lifestyleSpent;
  const remaining = totalNuyen - totalSpent;
  const isOverBudget = remaining < 0;

  // Handle karma conversion (manual +/- buttons)
  const handleKarmaConversion = useCallback(
    (delta: number) => {
      const newConversion = Math.max(
        0,
        Math.min(MAX_KARMA_CONVERSION, karmaConversion + delta)
      );
      // Check if we have enough karma for increase
      if (delta > 0 && karmaRemaining + karmaConversion < newConversion) return;

      updateState({
        budgets: {
          ...state.budgets,
          "karma-spent-gear": newConversion,
        },
      });
    },
    [karmaConversion, karmaRemaining, state.budgets, updateState]
  );

  // Karma conversion hook for purchase prompts
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

  // Calculate gear cost based on rating
  const calculateGearCost = useCallback(
    (gearData: GearItemData, rating?: number) => {
      const hasRatingFlag =
        gearData.hasRating || gearData.ratingSpec?.rating?.hasRating;
      const effectiveRating = rating || 1;
      let cost = gearData.cost;

      if (hasRatingFlag) {
        if (gearData.ratingSpec?.costScaling?.perRating) {
          cost =
            (gearData.ratingSpec.costScaling.baseValue || gearData.cost) *
            effectiveRating;
        } else if (gearData.costPerRating) {
          cost = gearData.cost * effectiveRating;
        }
      }

      return cost;
    },
    []
  );

  // Add gear (actual implementation)
  const actuallyAddGear = useCallback(
    (gearData: GearItemData, rating?: number) => {
      const hasRatingFlag =
        gearData.hasRating || gearData.ratingSpec?.rating?.hasRating;
      const effectiveRating = rating || 1;
      let cost = gearData.cost;
      let availability = gearData.availability;

      if (hasRatingFlag) {
        if (gearData.ratingSpec?.costScaling?.perRating) {
          cost =
            (gearData.ratingSpec.costScaling.baseValue || gearData.cost) *
            effectiveRating;
        } else if (gearData.costPerRating) {
          cost = gearData.cost * effectiveRating;
        }

        if (gearData.ratingSpec?.availabilityScaling?.perRating) {
          availability =
            (gearData.ratingSpec.availabilityScaling.baseValue ||
              gearData.availability) * effectiveRating;
        }
      }

      const newGear: GearItem = {
        id: `${gearData.id}-${Date.now()}`,
        name: hasRatingFlag
          ? `${gearData.name} (Rating ${effectiveRating})`
          : gearData.name,
        category: gearData.category,
        cost,
        availability,
        quantity: 1,
        rating: hasRatingFlag ? effectiveRating : gearData.rating,
        capacity: gearData.capacity,
        capacityUsed: 0,
        modifications: [],
      };

      updateState({
        selections: {
          ...state.selections,
          gear: [...selectedGear, newGear],
        },
      });

      // Don't close modal - allow multiple purchases
    },
    [selectedGear, state.selections, updateState]
  );

  // Add gear (with karma conversion prompt if needed)
  const addGear = useCallback(
    (gearData: GearItemData, rating?: number) => {
      const cost = calculateGearCost(gearData, rating);

      // Check if already affordable
      if (cost <= remaining) {
        actuallyAddGear(gearData, rating);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(cost);
      if (conversionInfo?.canConvert) {
        const hasRatingFlag =
          gearData.hasRating || gearData.ratingSpec?.rating?.hasRating;
        const effectiveRating = rating || 1;
        const itemName = hasRatingFlag
          ? `${gearData.name} (Rating ${effectiveRating})`
          : gearData.name;
        karmaConversionPrompt.promptConversion(itemName, cost, () => {
          actuallyAddGear(gearData, rating);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remaining, calculateGearCost, actuallyAddGear, karmaConversionPrompt]
  );

  // Remove gear
  const removeGear = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          gear: selectedGear.filter((g) => g.id !== id),
        },
      });
    },
    [selectedGear, state.selections, updateState]
  );

  // Open mod modal for a gear item
  const handleAddMod = useCallback((gearId: string) => {
    setModifyingGearId(gearId);
  }, []);

  // Remove a mod from gear
  const handleRemoveMod = useCallback(
    (gearId: string, modIndex: number) => {
      const updatedGear = selectedGear.map((g) => {
        if (g.id !== gearId) return g;
        const mods = [...(g.modifications || [])];
        const removedMod = mods[modIndex];
        mods.splice(modIndex, 1);
        return {
          ...g,
          modifications: mods,
          capacityUsed: (g.capacityUsed || 0) - (removedMod?.capacityUsed || 0),
        };
      });

      updateState({
        selections: {
          ...state.selections,
          gear: updatedGear,
        },
      });
    },
    [selectedGear, state.selections, updateState]
  );

  // Install a mod on gear (actual implementation)
  const actuallyInstallMod = useCallback(
    (mod: GearModificationCatalogItemData, rating?: number) => {
      if (!modifyingGear) return;

      const effectiveRating = rating || 1;
      const capacityCost = mod.capacityPerRating
        ? (mod.capacityCost || 1) * effectiveRating
        : mod.capacityCost || 1;

      // Check capacity
      const capacityRemaining =
        (modifyingGear.capacity || 0) - (modifyingGear.capacityUsed || 0);
      if (capacityCost > capacityRemaining) return;

      // Calculate cost
      let cost = mod.cost;
      if (mod.costPerRating && rating) {
        cost = mod.cost * effectiveRating;
      }

      const installedMod = {
        id: mod.id,
        name: mod.hasRating ? `${mod.name} (Rating ${effectiveRating})` : mod.name,
        rating: mod.hasRating ? effectiveRating : undefined,
        cost,
        capacityUsed: capacityCost,
        availability: mod.availability || 0,
      };

      const updatedGear = selectedGear.map((g) => {
        if (g.id !== modifyingGear.id) return g;
        return {
          ...g,
          modifications: [...(g.modifications || []), installedMod],
          capacityUsed: (g.capacityUsed || 0) + capacityCost,
        };
      });

      updateState({
        selections: {
          ...state.selections,
          gear: updatedGear,
        },
      });
    },
    [modifyingGear, selectedGear, state.selections, updateState]
  );

  // Install a mod (with karma conversion prompt if needed)
  const handleInstallMod = useCallback(
    (mod: GearModificationCatalogItemData, rating?: number) => {
      if (!modifyingGear) return;

      const effectiveRating = rating || 1;
      const capacityCost = mod.capacityPerRating
        ? (mod.capacityCost || 1) * effectiveRating
        : mod.capacityCost || 1;

      // Check capacity first (this is a hard limit, not fixable by karma)
      const capacityRemaining =
        (modifyingGear.capacity || 0) - (modifyingGear.capacityUsed || 0);
      if (capacityCost > capacityRemaining) return;

      // Calculate cost
      let cost = mod.cost;
      if (mod.costPerRating && rating) {
        cost = mod.cost * effectiveRating;
      }

      // Check if already affordable
      if (cost <= remaining) {
        actuallyInstallMod(mod, rating);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(cost);
      if (conversionInfo?.canConvert) {
        const modName = mod.hasRating
          ? `${mod.name} (Rating ${effectiveRating})`
          : mod.name;
        karmaConversionPrompt.promptConversion(modName, cost, () => {
          actuallyInstallMod(mod, rating);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [modifyingGear, remaining, actuallyInstallMod, karmaConversionPrompt]
  );

  // Validation status
  const validationStatus = useMemo(() => {
    if (isOverBudget) return "error";
    if (selectedGear.length > 0) return "valid";
    return "pending";
  }, [isOverBudget, selectedGear.length]);

  // Check prerequisites
  const hasPriorities =
    state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard
        title="Gear"
        description="Purchase equipment"
        status="pending"
      >
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
        title="Gear"
        description={`${selectedGear.length} item${selectedGear.length !== 1 ? "s" : ""}`}
        status={validationStatus}
        headerAction={
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3.5 w-3.5" />
            Gear
          </button>
        }
      >
        <div className="space-y-4">
          {/* Budget Display */}
          <BudgetDisplay
            spent={gearSpent}
            total={totalNuyen}
            remaining={remaining}
            isOver={isOverBudget}
          />

          {/* Karma Conversion */}
          <KarmaConversion
            karmaConversion={karmaConversion}
            karmaRemaining={karmaRemaining}
            convertedNuyen={convertedNuyen}
            onConvert={handleKarmaConversion}
          />

          {/* Gear List */}
          {selectedGear.length > 0 ? (
            <div className="space-y-2">
              {selectedGear.map((gear) => (
                <GearRow
                  key={gear.id}
                  gear={gear}
                  onRemove={removeGear}
                  onAddMod={handleAddMod}
                  onRemoveMod={handleRemoveMod}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 p-8 dark:border-zinc-700">
              <Backpack className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                No gear purchased
              </p>
              <button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
              >
                <Plus className="h-4 w-4" />
                Add your first gear
              </button>
            </div>
          )}

          {/* Gear Spent Summary */}
          {selectedGear.length > 0 && (
            <div className="flex items-center justify-between border-t border-zinc-100 pt-2 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <span>Total spent on gear</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(gearSpent)}¥
              </span>
            </div>
          )}
        </div>
      </CreationCard>

      {/* Purchase Modal */}
      <GearPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        remaining={remaining}
        onPurchase={addGear}
      />

      {/* Modification Modal */}
      {modifyingGear && (
        <GearModificationModal
          isOpen={!!modifyingGearId}
          onClose={() => setModifyingGearId(null)}
          gear={modifyingGear}
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
