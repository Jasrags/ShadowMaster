"use client";

/**
 * AugmentationsCard
 *
 * Compact card for augmentation selection in sheet-driven creation.
 * Option A: Unified List with Type Badges
 *
 * Features:
 * - Unified list showing both cyberware and bioware with type badges
 * - Two add buttons: [+ Add Cyberware] [+ Add Bioware]
 * - Essence bar with magic/resonance loss warnings
 * - Items with capacity show capacity usage and enhancement button
 * - Modal-driven item selection
 */

import { useMemo, useCallback, useState } from "react";
import {
  useAugmentationRules,
  calculateMagicLoss,
} from "@/lib/rules/RulesetContext";
import type { CreationState, CyberwareItem, BiowareItem } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import {
  CreationCard,
  KarmaConversionModal,
  useKarmaConversionPrompt,
} from "./shared";
import {
  AugmentationModal,
  CyberwareEnhancementModal,
  type AugmentationSelection,
  type AugmentationType,
  type CyberwareEnhancementSelection,
  type InstalledCyberlimb,
} from "./augmentations";
import {
  type CyberlimbLocation,
  type CyberlimbType,
  LOCATION_SIDE,
  wouldReplaceExisting,
} from "@/lib/types/cyberlimb";
import {
  Lock,
  X,
  AlertTriangle,
  Cpu,
  Heart,
  Plus,
  Zap,
  ChevronDown,
  ChevronRight,
  Shield,
} from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const GRADE_DISPLAY: Record<string, string> = {
  used: "Used",
  standard: "Std",
  alpha: "Alpha",
  beta: "Beta",
  delta: "Delta",
};

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

function formatEssence(value: number): string {
  return value.toFixed(2);
}

// =============================================================================
// TYPES
// =============================================================================

interface AugmentationsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// AUGMENTATION ITEM COMPONENT
// =============================================================================

function AugmentationItem({
  item,
  type,
  onRemove,
  onAddEnhancement,
  onRemoveEnhancement,
}: {
  item: CyberwareItem | BiowareItem;
  type: "cyberware" | "bioware";
  onRemove: () => void;
  onAddEnhancement?: () => void;
  onRemoveEnhancement?: (enhancementIndex: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCyberware = type === "cyberware";
  const cyberItem = item as CyberwareItem;
  const hasCapacity = isCyberware && cyberItem.capacity && cyberItem.capacity > 0;
  const remainingCapacity = hasCapacity
    ? (cyberItem.capacity || 0) - (cyberItem.capacityUsed || 0)
    : 0;
  const enhancementCount = cyberItem.enhancements?.length || 0;

  // Format item name with rating
  const displayName = useMemo(() => {
    // Check if name already contains rating info like "(Rating X)" and convert to RX
    const ratingMatch = item.name.match(/\(Rating (\d+)\)/);
    if (ratingMatch) {
      return item.name.replace(/\s*\(Rating (\d+)\)/, ` R${ratingMatch[1]}`);
    }
    return item.name;
  }, [item.name]);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
      {/* Collapsed Header */}
      <div className="flex w-full items-center gap-2 p-3">
        {/* Expand/Collapse Button (only for items with capacity, enhancements, or bonuses) */}
        {(hasCapacity || enhancementCount > 0 || (item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0) || item.armorBonus) ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex flex-1 items-center gap-2 text-left"
          >
            {/* Expand/Collapse Icon */}
            <div className="text-zinc-400">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>

            {/* Type badge */}
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${
                isCyberware
                  ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400"
                  : "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400"
              }`}
            >
              {isCyberware ? <Cpu className="h-3.5 w-3.5" /> : <Heart className="h-3.5 w-3.5" />}
            </div>

            {/* Name, grade, and quick stats */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {displayName}
                </span>
                <span className="shrink-0 rounded bg-zinc-100 px-1 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {GRADE_DISPLAY[item.grade]}
                </span>
                {enhancementCount > 0 && (
                  <span className="shrink-0 rounded bg-blue-100 px-1 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                    {enhancementCount} mod{enhancementCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {hasCapacity && (
                <div className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <Zap className="h-3 w-3" />
                  <span>Cap {cyberItem.capacityUsed || 0}/{cyberItem.capacity}</span>
                </div>
              )}
            </div>
          </button>
        ) : (
          /* Non-expandable items */
          <div className="flex flex-1 items-center gap-2">
            {/* Type badge */}
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${
                isCyberware
                  ? "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400"
                  : "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400"
              }`}
            >
              {isCyberware ? <Cpu className="h-3.5 w-3.5" /> : <Heart className="h-3.5 w-3.5" />}
            </div>

            {/* Name and grade */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {displayName}
                </span>
                <span className="shrink-0 rounded bg-zinc-100 px-1 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {GRADE_DISPLAY[item.grade]}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Essence and cost */}
        <div className="shrink-0 text-right">
          <div
            className={`text-xs font-medium ${
              isCyberware
                ? "text-cyan-600 dark:text-cyan-400"
                : "text-pink-600 dark:text-pink-400"
            }`}
          >
            {formatEssence(item.essenceCost)} ESS
          </div>
          <div className="text-[10px] text-zinc-400">{formatCurrency(item.cost)}¥</div>
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="shrink-0 rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Collapsed preview: bonuses shown inline */}
      {!isExpanded && ((item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0) || item.armorBonus) && (
        <div className="flex flex-wrap gap-1 border-t border-zinc-100 px-3 pb-2 pt-2 dark:border-zinc-800">
          {item.armorBonus && (
            <span className="flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              <Shield className="h-3 w-3" />
              +{item.armorBonus} Armor
            </span>
          )}
          {item.attributeBonuses && Object.entries(item.attributeBonuses).map(([attr, bonus]) => (
            <span
              key={attr}
              className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
            >
              {attr.toUpperCase()}: +{bonus}
            </span>
          ))}
        </div>
      )}

      {/* Collapsed preview: enhancements shown as tags */}
      {!isExpanded && hasCapacity && cyberItem.enhancements && cyberItem.enhancements.length > 0 && (
        <div className="flex flex-wrap gap-1 border-t border-zinc-100 px-3 pb-2 pt-2 dark:border-zinc-800">
          {cyberItem.enhancements.map((enh, idx) => (
            <span
              key={`${enh.catalogId}-${idx}`}
              className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {enh.name}
              {enh.rating && ` R${enh.rating}`}
            </span>
          ))}
        </div>
      )}

      {/* Expanded Detail View */}
      {isExpanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          <div className="space-y-3 p-3">
            {/* Bonuses (Armor and Attributes) */}
            {((item.attributeBonuses && Object.keys(item.attributeBonuses).length > 0) || item.armorBonus) && (
              <div>
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Bonuses
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.armorBonus && (
                    <span className="flex items-center gap-1 rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                      <Shield className="h-3.5 w-3.5" />
                      +{item.armorBonus} Armor
                    </span>
                  )}
                  {item.attributeBonuses && Object.entries(item.attributeBonuses).map(([attr, bonus]) => (
                    <span
                      key={attr}
                      className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                    >
                      {attr.toUpperCase()}: +{bonus}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Capacity Bar */}
            {hasCapacity && (
              <div className="rounded-lg bg-zinc-50 p-2.5 dark:bg-zinc-800/50">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Modification Capacity
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {cyberItem.capacityUsed || 0} / {cyberItem.capacity} used
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className={`h-full rounded-full transition-all ${
                      remainingCapacity === 0
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(100, ((cyberItem.capacityUsed || 0) / (cyberItem.capacity || 1)) * 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                  {remainingCapacity} capacity remaining
                </div>
              </div>
            )}

            {/* Enhancements List */}
            {hasCapacity && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Modifications
                  </span>
                  {remainingCapacity > 0 && onAddEnhancement && (
                    <button
                      onClick={onAddEnhancement}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3 w-3" />
                      Add Mod
                    </button>
                  )}
                </div>
                {cyberItem.enhancements && cyberItem.enhancements.length > 0 ? (
                  <div className="space-y-1">
                    {cyberItem.enhancements.map((enh, idx) => (
                      <div
                        key={`${enh.catalogId}-${idx}`}
                        className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1.5 text-sm dark:bg-zinc-800"
                      >
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {enh.name}
                          {enh.rating && (
                            <span className="ml-1 text-xs text-zinc-400">R{enh.rating}</span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">
                            {formatCurrency(enh.cost)}¥
                          </span>
                          {onRemoveEnhancement && (
                            <button
                              onClick={() => onRemoveEnhancement(idx)}
                              className="rounded p-0.5 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs italic text-zinc-400 dark:text-zinc-500">
                    No modifications installed
                  </p>
                )}
                {remainingCapacity === 0 && (
                  <p className="mt-1.5 text-[10px] text-amber-600 dark:text-amber-400">
                    No capacity remaining for additional modifications
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function AugmentationsCard({ state, updateState }: AugmentationsCardProps) {
  const augmentationRules = useAugmentationRules();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");
  const karmaBudget = getBudget("karma");

  const [isAugModalOpen, setIsAugModalOpen] = useState(false);
  const [augModalType, setAugModalType] = useState<AugmentationType>("cyberware");
  const [enhancementModalCyberware, setEnhancementModalCyberware] = useState<CyberwareItem | null>(
    null
  );

  // Get selections from state
  const selectedCyberware = useMemo(
    () => (state.selections?.cyberware || []) as CyberwareItem[],
    [state.selections?.cyberware]
  );
  const selectedBioware = useMemo(
    () => (state.selections?.bioware || []) as BiowareItem[],
    [state.selections?.bioware]
  );

  // Extract installed cyberlimbs for conflict checking
  const installedCyberlimbs = useMemo((): InstalledCyberlimb[] => {
    return selectedCyberware
      .filter((item) => item.category === "cyberlimb" && "location" in item && "limbType" in item)
      .map((item) => ({
        id: item.id || item.catalogId,
        name: item.name,
        location: (item as CyberwareItem & { location: CyberlimbLocation }).location,
        limbType: (item as CyberwareItem & { limbType: CyberlimbType }).limbType,
      }));
  }, [selectedCyberware]);

  // Check if character is magical or technomancer
  const magicPath = (state.selections?.["magical-path"] as string) || "mundane";
  const isAwakened = ["magician", "mystic-adept", "aspected-mage", "adept"].includes(magicPath);
  const isTechnomancer = magicPath === "technomancer";

  // Get special attribute values
  const specialAttributes = (state.selections?.specialAttributes || {}) as Record<string, number>;
  const magicRating = specialAttributes.magic || 0;
  const resonanceRating = specialAttributes.resonance || 0;

  // Calculate nuyen budget
  const baseNuyen = nuyenBudget?.total || 0;
  const karmaConversion = (state.budgets?.["karma-spent-gear"] as number) || 0;
  const convertedNuyen = karmaConversion * 2000;
  const totalNuyen = baseNuyen + convertedNuyen;

  // Calculate total spent across all gear categories
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
  const cyberwareSpent = selectedCyberware.reduce((sum, item) => sum + item.cost, 0);
  const biowareSpent = selectedBioware.reduce((sum, item) => sum + item.cost, 0);
  const lifestyleSpent = (state.budgets?.["nuyen-spent-lifestyle"] as number) || 0;
  const totalSpent = gearSpent + cyberwareSpent + biowareSpent + lifestyleSpent;
  const remainingNuyen = totalNuyen - totalSpent;

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
    remaining: remainingNuyen,
    karmaRemaining,
    currentConversion: karmaConversion,
    onConvert: handleKarmaConvert,
  });

  // Calculate essence
  const maxEssence = augmentationRules.maxEssence;
  const cyberwareEssence = selectedCyberware.reduce((sum, item) => sum + item.essenceCost, 0);
  const biowareEssence = selectedBioware.reduce((sum, item) => sum + item.essenceCost, 0);
  const totalEssenceLoss = Math.round((cyberwareEssence + biowareEssence) * 100) / 100;
  const remainingEssence = Math.round((maxEssence - totalEssenceLoss) * 100) / 100;

  // Calculate magic/resonance loss
  const magicLoss = isAwakened
    ? calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula)
    : 0;
  const resonanceLoss = isTechnomancer
    ? calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula)
    : 0;

  // Calculate attribute bonuses
  const attributeBonuses = useMemo(() => {
    const bonuses: Record<string, number> = {};
    for (const item of selectedCyberware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }
    for (const item of selectedBioware) {
      if (item.attributeBonuses) {
        for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
          bonuses[attr] = (bonuses[attr] || 0) + bonus;
        }
      }
    }
    return bonuses;
  }, [selectedCyberware, selectedBioware]);

  // Open augmentation modal
  const openAugModal = useCallback((type: AugmentationType) => {
    setAugModalType(type);
    setIsAugModalOpen(true);
  }, []);

  // Add augmentation (actual implementation)
  const actuallyAddAugmentation = useCallback(
    (selection: AugmentationSelection) => {
      // Build the base item
      const baseItem = {
        id: `${selection.catalogId}-${Date.now()}`,
        catalogId: selection.catalogId,
        name: selection.name,
        category: selection.category,
        grade: selection.grade,
        baseEssenceCost: selection.baseEssenceCost,
        essenceCost: selection.essenceCost,
        cost: selection.cost,
        availability: selection.availability,
        legality: selection.legality,
        attributeBonuses: selection.attributeBonuses,
        armorBonus: selection.armorBonus,
      };

      const newItem =
        selection.type === "cyberware"
          ? ({
              ...baseItem,
              capacity: selection.capacity,
              capacityUsed: 0,
              enhancements: [],
              initiativeDiceBonus: selection.initiativeDiceBonus,
              wirelessBonus: selection.wirelessBonus,
              // Add cyberlimb-specific fields if present
              ...(selection.location && { location: selection.location }),
              ...(selection.limbType && { limbType: selection.limbType }),
              ...(selection.appearance && { appearance: selection.appearance }),
              ...(selection.baseStrength && { baseStrength: selection.baseStrength }),
              ...(selection.baseAgility && { baseAgility: selection.baseAgility }),
            } as CyberwareItem)
          : (baseItem as BiowareItem);

      if (selection.type === "cyberware") {
        // For cyberlimbs, remove any limbs that would be replaced
        let updatedCyberware = [...selectedCyberware];

        if (selection.location && selection.limbType) {
          const newSide = LOCATION_SIDE[selection.location];

          // Filter out any cyberlimbs that would be replaced
          updatedCyberware = updatedCyberware.filter((item) => {
            // Skip non-cyberlimbs
            if (item.category !== "cyberlimb" || !("location" in item) || !("limbType" in item)) {
              return true;
            }

            const existingItem = item as CyberwareItem & { location: CyberlimbLocation; limbType: CyberlimbType };
            const existingSide = LOCATION_SIDE[existingItem.location];

            // Only check items on the same side
            if (existingSide !== newSide) {
              return true;
            }

            // Check if the new limb would replace this one
            // Same location = direct replacement
            if (existingItem.location === selection.location) {
              return false;
            }

            // Hierarchy replacement (e.g., full-arm replaces lower-arm and hand)
            if (selection.limbType && wouldReplaceExisting(selection.limbType, existingItem.limbType)) {
              return false;
            }

            return true;
          });
        }

        updateState({
          selections: {
            ...state.selections,
            cyberware: [...updatedCyberware, newItem as CyberwareItem],
          },
        });
      } else {
        updateState({
          selections: {
            ...state.selections,
            bioware: [...selectedBioware, newItem as BiowareItem],
          },
        });
      }
    },
    [selectedCyberware, selectedBioware, state.selections, updateState]
  );

  // Add augmentation (with karma conversion prompt if needed)
  const handleAddAugmentation = useCallback(
    (selection: AugmentationSelection) => {
      // Check if already affordable
      if (selection.cost <= remainingNuyen) {
        actuallyAddAugmentation(selection);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(selection.cost);
      if (conversionInfo?.canConvert) {
        karmaConversionPrompt.promptConversion(selection.name, selection.cost, () => {
          actuallyAddAugmentation(selection);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [remainingNuyen, actuallyAddAugmentation, karmaConversionPrompt]
  );

  // Remove cyberware
  const removeCyberware = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          cyberware: selectedCyberware.filter((item) => item.id !== id),
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Remove bioware
  const removeBioware = useCallback(
    (id: string) => {
      updateState({
        selections: {
          ...state.selections,
          bioware: selectedBioware.filter((item) => item.id !== id),
        },
      });
    },
    [selectedBioware, state.selections, updateState]
  );

  // Remove enhancement from cyberware
  const removeEnhancement = useCallback(
    (cyberwareId: string, enhancementIndex: number) => {
      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== cyberwareId) return item;

        const enhancements = item.enhancements || [];
        const removedEnhancement = enhancements[enhancementIndex] as CyberwareItem & { capacityCost?: number };
        if (!removedEnhancement) return item;

        // Get the capacity cost that was used by this enhancement
        // Use stored capacityCost, fall back to rating for legacy data
        const capacityToRestore = removedEnhancement.capacityCost ?? removedEnhancement.rating ?? 1;

        return {
          ...item,
          capacityUsed: Math.max(0, (item.capacityUsed || 0) - capacityToRestore),
          enhancements: enhancements.filter((_, idx) => idx !== enhancementIndex),
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });
    },
    [selectedCyberware, state.selections, updateState]
  );

  // Add enhancements to cyberware (actual implementation - handles batch)
  const actuallyAddEnhancements = useCallback(
    (enhancements: CyberwareEnhancementSelection[]) => {
      if (!enhancementModalCyberware || enhancements.length === 0) return;

      const updatedCyberware = selectedCyberware.map((item) => {
        if (item.id !== enhancementModalCyberware.id) return item;

        // Build all new enhancements
        const newEnhancements = enhancements.map((enhancement) => ({
          catalogId: enhancement.catalogId,
          name: enhancement.name,
          category: enhancement.category as CyberwareItem["category"],
          grade: item.grade, // Inherit parent grade
          baseEssenceCost: 0,
          essenceCost: 0,
          cost: enhancement.cost,
          availability: enhancement.availability,
          legality: enhancement.legality,
          rating: enhancement.rating,
          capacityCost: enhancement.capacityCost, // Store for removal
        } as CyberwareItem));

        // Calculate total capacity used
        const totalCapacityCost = enhancements.reduce((sum, e) => sum + e.capacityCost, 0);

        return {
          ...item,
          capacityUsed: (item.capacityUsed || 0) + totalCapacityCost,
          enhancements: [...(item.enhancements || []), ...newEnhancements],
        };
      });

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
      });

      setEnhancementModalCyberware(null);
    },
    [enhancementModalCyberware, selectedCyberware, state.selections, updateState]
  );

  // Add enhancements to cyberware (with karma conversion prompt if needed)
  const handleAddEnhancements = useCallback(
    (enhancements: CyberwareEnhancementSelection[]) => {
      if (!enhancementModalCyberware || enhancements.length === 0) return;

      // Calculate total cost
      const totalCost = enhancements.reduce((sum, e) => sum + e.cost, 0);

      // Check if already affordable
      if (totalCost <= remainingNuyen) {
        actuallyAddEnhancements(enhancements);
        return;
      }

      // Check if karma conversion could help
      const conversionInfo = karmaConversionPrompt.checkPurchase(totalCost);
      if (conversionInfo?.canConvert) {
        const itemNames = enhancements.map((e) => e.name).join(", ");
        karmaConversionPrompt.promptConversion(itemNames, totalCost, () => {
          actuallyAddEnhancements(enhancements);
        });
        return;
      }

      // Can't afford even with max karma conversion - do nothing
    },
    [enhancementModalCyberware, remainingNuyen, actuallyAddEnhancements, karmaConversionPrompt]
  );

  // Get remaining capacity for enhancement modal
  const enhancementRemainingCapacity = useMemo(() => {
    if (!enhancementModalCyberware) return 0;
    return (
      (enhancementModalCyberware.capacity || 0) - (enhancementModalCyberware.capacityUsed || 0)
    );
  }, [enhancementModalCyberware]);

  // Validation status
  const validationStatus = useMemo(() => {
    if (remainingEssence < 0) return "error";
    if (remainingNuyen < 0) return "error";
    if ((isAwakened && magicLoss > 0) || (isTechnomancer && resonanceLoss > 0)) return "warning";
    if (selectedCyberware.length > 0 || selectedBioware.length > 0) return "valid";
    return "pending";
  }, [
    remainingEssence,
    remainingNuyen,
    isAwakened,
    isTechnomancer,
    magicLoss,
    resonanceLoss,
    selectedCyberware.length,
    selectedBioware.length,
  ]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard
        title="Augmentations"
        description="Install cyberware and bioware"
        status="pending"
      >
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Set priorities first</p>
        </div>
      </CreationCard>
    );
  }

  const totalAugmentations = selectedCyberware.length + selectedBioware.length;

  return (
    <>
      <CreationCard
        title="Augmentations"
        description={`${formatEssence(remainingEssence)} / ${maxEssence} Essence`}
        status={validationStatus}
      >
        <div className="space-y-4">
          {/* Essence bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600 dark:text-zinc-400">Essence</span>
              <span
                className={`font-medium ${
                  remainingEssence < 1
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {formatEssence(remainingEssence)} / {maxEssence}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`h-full transition-all ${
                  remainingEssence < 1 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.max(0, (remainingEssence / maxEssence) * 100)}%` }}
              />
            </div>
          </div>

          {/* Magic/Resonance warning */}
          {isAwakened && magicLoss > 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-amber-800 dark:text-amber-200">
                Magic reduced by {magicLoss} (now {Math.max(0, magicRating - magicLoss)})
              </div>
            </div>
          )}
          {isTechnomancer && resonanceLoss > 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-xs dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-amber-800 dark:text-amber-200">
                Resonance reduced by {resonanceLoss} (now{" "}
                {Math.max(0, resonanceRating - resonanceLoss)})
              </div>
            </div>
          )}

          {/* Total attribute bonuses */}
          {Object.keys(attributeBonuses).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(attributeBonuses).map(([attr, bonus]) => (
                <span
                  key={attr}
                  className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                >
                  {attr.toUpperCase()}: +{bonus}
                </span>
              ))}
            </div>
          )}

          {/* Add buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => openAugModal("cyberware")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-cyan-300 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700 transition-colors hover:border-cyan-400 hover:bg-cyan-100 dark:border-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300 dark:hover:border-cyan-600 dark:hover:bg-cyan-900/30"
            >
              <Cpu className="h-3.5 w-3.5" />
              Add Cyberware
            </button>
            <button
              onClick={() => openAugModal("bioware")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-dashed border-pink-300 bg-pink-50 px-3 py-2 text-xs font-medium text-pink-700 transition-colors hover:border-pink-400 hover:bg-pink-100 dark:border-pink-700 dark:bg-pink-900/20 dark:text-pink-300 dark:hover:border-pink-600 dark:hover:bg-pink-900/30"
            >
              <Heart className="h-3.5 w-3.5" />
              Add Bioware
            </button>
          </div>

          {/* Unified augmentation list */}
          {totalAugmentations > 0 && (
            <div className="space-y-2">
              {selectedCyberware.map((item) => (
                <AugmentationItem
                  key={item.id}
                  item={item}
                  type="cyberware"
                  onRemove={() => item.id && removeCyberware(item.id)}
                  onAddEnhancement={
                    item.capacity && item.capacity > 0
                      ? () => setEnhancementModalCyberware(item)
                      : undefined
                  }
                  onRemoveEnhancement={
                    item.id && item.capacity && item.capacity > 0
                      ? (idx) => removeEnhancement(item.id!, idx)
                      : undefined
                  }
                />
              ))}
              {selectedBioware.map((item) => (
                <AugmentationItem
                  key={item.id}
                  item={item}
                  type="bioware"
                  onRemove={() => item.id && removeBioware(item.id)}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {totalAugmentations === 0 && (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Augmentations reduce Essence. Each point lost reduces Magic/Resonance by 1.
              </p>
            </div>
          )}

          {/* Summary */}
          {totalAugmentations > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Total: {totalAugmentations} augmentation
                {totalAugmentations !== 1 ? "s" : ""}
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(cyberwareSpent + biowareSpent)}¥
              </span>
            </div>
          )}
        </div>
      </CreationCard>

      {/* Augmentation Modal */}
      <AugmentationModal
        isOpen={isAugModalOpen}
        onClose={() => setIsAugModalOpen(false)}
        onAdd={handleAddAugmentation}
        augmentationType={augModalType}
        remainingEssence={remainingEssence}
        remainingNuyen={remainingNuyen}
        isAwakened={isAwakened}
        isTechnomancer={isTechnomancer}
        currentMagic={magicRating}
        currentResonance={resonanceRating}
        installedCyberlimbs={installedCyberlimbs}
      />

      {/* Enhancement Modal */}
      {enhancementModalCyberware && (
        <CyberwareEnhancementModal
          isOpen={!!enhancementModalCyberware}
          onClose={() => setEnhancementModalCyberware(null)}
          onAdd={handleAddEnhancements}
          parentCyberware={enhancementModalCyberware}
          remainingCapacity={enhancementRemainingCapacity}
          remainingNuyen={remainingNuyen}
        />
      )}

      {/* Karma Conversion Modal */}
      {karmaConversionPrompt.modalState && (
        <KarmaConversionModal
          isOpen={karmaConversionPrompt.modalState.isOpen}
          onClose={karmaConversionPrompt.closeModal}
          onConfirm={karmaConversionPrompt.confirmConversion}
          itemName={karmaConversionPrompt.modalState.itemName}
          itemCost={karmaConversionPrompt.modalState.itemCost}
          currentRemaining={remainingNuyen}
          karmaToConvert={karmaConversionPrompt.modalState.karmaToConvert}
          karmaAvailable={karmaRemaining}
          currentKarmaConversion={karmaConversion}
          maxKarmaConversion={10}
        />
      )}
    </>
  );
}
