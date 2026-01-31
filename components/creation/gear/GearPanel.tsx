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
import { hasUnifiedRatings, getRatingTableValue } from "@/lib/types/ratings";
import { useCreationBudgets } from "@/lib/contexts";
import {
  CreationCard,
  EmptyState,
  SummaryFooter,
  KarmaConversionModal,
  useKarmaConversionPrompt,
} from "../shared";
import { GearRow } from "./GearRow";
import { GearPurchaseModal } from "./GearPurchaseModal";
import { GearModificationModal } from "./GearModificationModal";
import { Lock, Plus } from "lucide-react";
import { InfoTooltip } from "@/components/ui";

// =============================================================================
// CONSTANTS
// =============================================================================

const KARMA_TO_NUYEN_RATE = 2000;

// Gear category keys and labels for grouped display
type GearCategoryKey =
  | "electronics"
  | "tools"
  | "survival"
  | "medical"
  | "security"
  | "miscellaneous"
  | "rfidTags";

const GEAR_CATEGORY_LABELS: Record<GearCategoryKey, string> = {
  electronics: "Electronics",
  tools: "Tools",
  survival: "Survival",
  medical: "Medical",
  security: "Security",
  miscellaneous: "Miscellaneous",
  rfidTags: "RFID Tags",
};

// Get category from gear item
function getGearCategory(gear: GearItem): GearCategoryKey {
  const category = gear.category?.toLowerCase() || "";
  if (category === "electronics") return "electronics";
  if (category === "tools") return "tools";
  if (category === "survival") return "survival";
  if (category === "medical") return "medical";
  if (category === "security") return "security";
  if (category === "rfidtags" || category === "rfid-tags") return "rfidTags";
  return "miscellaneous";
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

// =============================================================================
// TYPES
// =============================================================================

interface GearPanelProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
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

  // Group gear by category for display
  const gearByCategory = useMemo(() => {
    const grouped: Record<GearCategoryKey, GearItem[]> = {
      electronics: [],
      tools: [],
      survival: [],
      medical: [],
      security: [],
      miscellaneous: [],
      rfidTags: [],
    };
    for (const gear of selectedGear) {
      grouped[getGearCategory(gear)].push(gear);
    }
    return grouped;
  }, [selectedGear]);

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

  // Local category cost (for card-specific footer display)
  const gearSpent = selectedGear.reduce((sum, g) => sum + g.cost * g.quantity, 0);

  // Use centralized nuyen spent from budget context for global budget tracker
  const totalSpent = nuyenBudget?.spent || 0;
  const remaining = totalNuyen - totalSpent;
  const isOverBudget = remaining < 0;

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
  const calculateGearCost = useCallback((gearData: GearItemData, rating?: number) => {
    // Unified ratings - look up from table
    if (hasUnifiedRatings(gearData)) {
      const r = rating ?? gearData.minRating ?? 1;
      const ratingValue = getRatingTableValue(gearData, r);
      return ratingValue?.cost ?? 0;
    }

    const hasRatingFlag = gearData.hasRating || gearData.ratingSpec?.rating?.hasRating;
    const effectiveRating = rating || 1;
    let cost = gearData.cost ?? 0;

    if (hasRatingFlag) {
      if (gearData.ratingSpec?.costScaling?.perRating) {
        cost = (gearData.ratingSpec.costScaling.baseValue || gearData.cost || 0) * effectiveRating;
      } else if (gearData.costPerRating) {
        cost = (gearData.cost || 0) * effectiveRating;
      }
    }

    return cost;
  }, []);

  // Add gear (actual implementation)
  const actuallyAddGear = useCallback(
    (gearData: GearItemData, rating?: number, quantity?: number) => {
      const hasRatingFlag = gearData.hasRating || gearData.ratingSpec?.rating?.hasRating;
      const effectiveRating = rating || 1;
      const effectiveQuantity = quantity || 1;
      let unitCost = gearData.cost ?? 0;
      let availability = gearData.availability ?? 0;
      let capacity = gearData.capacity;

      // Handle unified ratings - look up from table
      if (hasUnifiedRatings(gearData)) {
        const ratingValue = getRatingTableValue(gearData, effectiveRating);
        unitCost = ratingValue?.cost ?? 0;
        availability = ratingValue?.availability ?? 0;
        if (ratingValue?.capacity !== undefined) {
          capacity = ratingValue.capacity;
        } else if (gearData.capacityPerRating) {
          // Handle capacity scaling for unified ratings items
          capacity = (gearData.capacity ?? 0) * effectiveRating;
        }
      } else if (hasRatingFlag) {
        // Legacy cost scaling
        if (gearData.ratingSpec?.costScaling?.perRating) {
          unitCost =
            (gearData.ratingSpec.costScaling.baseValue || gearData.cost || 0) * effectiveRating;
        } else if (gearData.costPerRating) {
          unitCost = (gearData.cost || 0) * effectiveRating;
        }

        // Legacy availability scaling
        if (gearData.ratingSpec?.availabilityScaling?.perRating) {
          availability =
            (gearData.ratingSpec.availabilityScaling.baseValue || gearData.availability || 0) *
            effectiveRating;
        }
      }

      // For stackable items, calculate total units from packs
      // cost is per unit, quantity in catalog is pack size
      const packSize = gearData.quantity ?? 1;
      const totalUnits = gearData.stackable ? effectiveQuantity * packSize : effectiveQuantity;

      // Build the display name
      let displayName = gearData.name;
      if (hasRatingFlag || hasUnifiedRatings(gearData)) {
        displayName = `${gearData.name} (Rating ${effectiveRating})`;
      }

      const newGear: GearItem = {
        id: `${gearData.id}-${Date.now()}`,
        name: displayName,
        category: gearData.category,
        cost: unitCost,
        availability,
        quantity: totalUnits,
        rating: hasRatingFlag || hasUnifiedRatings(gearData) ? effectiveRating : gearData.rating,
        capacity,
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
    (gearData: GearItemData, rating?: number, quantity?: number) => {
      const unitCost = calculateGearCost(gearData, rating);
      const effectiveQuantity = quantity || 1;
      // For stackable items: quantity is number of packs, unitCost is per unit
      // Total cost = unitCost × packSize × numberOfPacks
      const packSize = gearData.quantity ?? 1;
      const totalCost = gearData.stackable ? unitCost * packSize * effectiveQuantity : unitCost;

      // Check if already affordable
      if (totalCost <= remaining) {
        actuallyAddGear(gearData, rating, quantity);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const hasRatingFlag = gearData.hasRating || gearData.ratingSpec?.rating?.hasRating;
        const effectiveRating = rating || 1;
        let itemName = gearData.name;
        if (hasRatingFlag) {
          itemName = `${gearData.name} (Rating ${effectiveRating})`;
        }
        if (gearData.stackable && effectiveQuantity > 1) {
          const packSize = gearData.quantity ?? 1;
          itemName = `${itemName} (${effectiveQuantity * packSize} units)`;
        }
        karmaConversionPrompt.promptConversion(itemName, totalCost, () => {
          actuallyAddGear(gearData, rating, quantity);
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
      const capacityRemaining = (modifyingGear.capacity || 0) - (modifyingGear.capacityUsed || 0);
      if (capacityCost > capacityRemaining) return;

      // Calculate cost
      let cost = mod.cost;
      if (mod.costPerRating && rating) {
        cost = mod.cost * effectiveRating;
      }

      const installedMod = {
        id: crypto.randomUUID(),
        catalogId: mod.id,
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
      const capacityRemaining = (modifyingGear.capacity || 0) - (modifyingGear.capacityUsed || 0);
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
        const modName = mod.hasRating ? `${mod.name} (Rating ${effectiveRating})` : mod.name;
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
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard title="Gear" description="Purchase equipment" status="pending">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 dark:border-zinc-700">
            <Lock className="h-5 w-5 text-zinc-400" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Set priorities first</p>
          </div>
        </div>
      </CreationCard>
    );
  }

  return (
    <>
      <CreationCard
        title="Gear"
        status={validationStatus}
        headerAction={
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        }
      >
        <div className="space-y-3">
          {/* Nuyen Budget Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                <span>Nuyen</span>
                <InfoTooltip content="Total nuyen spent on all gear" label="Nuyen budget info" />
                {karmaConversion > 0 && (
                  <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                    (+{(karmaConversion * KARMA_TO_NUYEN_RATE).toLocaleString()}¥ karma)
                  </span>
                )}
              </span>
              <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                {formatCurrency(totalSpent)} / {formatCurrency(totalNuyen)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-full transition-all ${isOverBudget ? "bg-red-500" : "bg-emerald-500"}`}
                style={{
                  width: `${Math.min(100, (totalSpent / totalNuyen) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Selected gear grouped by category */}
          {selectedGear.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Selected Gear ({selectedGear.length})
              </h4>

              {(Object.entries(gearByCategory) as [GearCategoryKey, GearItem[]][]).map(
                ([category, items]) =>
                  items.length > 0 && (
                    <div key={category}>
                      <h5 className="mb-2 text-xs font-medium uppercase text-zinc-400 dark:text-zinc-500">
                        {GEAR_CATEGORY_LABELS[category]}
                      </h5>
                      <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
                        {items.map((gear) => (
                          <GearRow
                            key={gear.id}
                            gear={gear}
                            onRemove={removeGear}
                            onAddMod={handleAddMod}
                            onRemoveMod={handleRemoveMod}
                          />
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <EmptyState message="No gear purchased" />
          )}

          {/* Footer Summary */}
          <SummaryFooter count={selectedGear.length} total={gearSpent} format="currency" />
        </div>
      </CreationCard>

      {/* Purchase Modal */}
      <GearPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        remaining={remaining}
        onPurchase={addGear}
        purchasedGearIds={selectedGear.map((g) => {
          // Extract catalog ID from "{catalogId}-{timestamp}" format
          // Timestamp is the last segment after the final hyphen
          const id = g.id || "";
          const lastHyphen = id.lastIndexOf("-");
          return lastHyphen > 0 ? id.slice(0, lastHyphen) : id;
        })}
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
