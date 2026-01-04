"use client";

/**
 * AugmentationsCard
 *
 * Compact card for augmentation selection in sheet-driven creation.
 * Handles cyberware and bioware with essence tracking.
 *
 * Features:
 * - Cyberware/Bioware tabs
 * - Grade selection (used, standard, alpha, beta, delta)
 * - Essence tracking with progress bar
 * - Magic/Resonance loss warnings
 * - Attribute bonuses display
 */

import { useMemo, useCallback, useState } from "react";
import {
  useCyberware,
  useBioware,
  useCyberwareGrades,
  useBiowareGrades,
  useAugmentationRules,
  calculateCyberwareEssenceCost,
  calculateCyberwareCost,
  calculateCyberwareAvailability,
  calculateBiowareEssenceCost,
  calculateBiowareCost,
  calculateBiowareAvailability,
  calculateMagicLoss,
  type CyberwareCatalogItemData,
  type BiowareCatalogItemData,
} from "@/lib/rules/RulesetContext";
import type { CreationState, CyberwareItem, BiowareItem, CyberwareGrade, BiowareGrade, ItemLegality } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Lock, Search, X, AlertTriangle, Cpu, Heart } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_AVAILABILITY = 12;

type AugmentationTab = "cyberware" | "bioware";

const GRADE_DISPLAY: Record<string, string> = {
  used: "Used",
  standard: "Standard",
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

function getAvailabilityDisplay(
  availability: number,
  legality?: ItemLegality
): string {
  let display = String(availability);
  if (legality === "restricted") display += "R";
  if (legality === "forbidden") display += "F";
  return display;
}

// =============================================================================
// TYPES
// =============================================================================

interface AugmentationsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AugmentationsCard({ state, updateState }: AugmentationsCardProps) {
  const cyberwareCatalog = useCyberware({ excludeForbidden: false });
  const biowareCatalog = useBioware({ excludeForbidden: false });
  const cyberwareGrades = useCyberwareGrades();
  const biowareGrades = useBiowareGrades();
  const augmentationRules = useAugmentationRules();
  const { getBudget } = useCreationBudgets();
  const nuyenBudget = getBudget("nuyen");

  const [activeTab, setActiveTab] = useState<AugmentationTab>("cyberware");
  const [selectedGrade, setSelectedGrade] = useState<CyberwareGrade | BiowareGrade>("standard");
  const [searchQuery, setSearchQuery] = useState("");

  // Get selections from state
  const selectedCyberware = useMemo(
    () => (state.selections?.cyberware || []) as CyberwareItem[],
    [state.selections?.cyberware]
  );
  const selectedBioware = useMemo(
    () => (state.selections?.bioware || []) as BiowareItem[],
    [state.selections?.bioware]
  );

  // Check if character is magical or technomancer
  const magicPath = (state.selections?.["magical-path"] as string) || "mundane";
  const isAwakened = ["magician", "mystic-adept", "aspected-mage", "adept"].includes(magicPath);
  const isTechnomancer = magicPath === "technomancer";
  const hasSpecialAttribute = isAwakened || isTechnomancer;

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

  // Calculate essence
  const maxEssence = augmentationRules.maxEssence;
  const cyberwareEssence = selectedCyberware.reduce((sum, item) => sum + item.essenceCost, 0);
  const biowareEssence = selectedBioware.reduce((sum, item) => sum + item.essenceCost, 0);
  const totalEssenceLoss = Math.round((cyberwareEssence + biowareEssence) * 100) / 100;
  const remainingEssence = Math.round((maxEssence - totalEssenceLoss) * 100) / 100;

  // Calculate magic/resonance loss
  const magicLoss = isAwakened ? calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula) : 0;
  const resonanceLoss = isTechnomancer ? calculateMagicLoss(totalEssenceLoss, augmentationRules.magicReductionFormula) : 0;

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

  // Available grades
  const availableGrades = useMemo(() => {
    if (activeTab === "cyberware") {
      return cyberwareGrades;
    }
    return biowareGrades.filter((g) => g.id !== "used");
  }, [activeTab, cyberwareGrades, biowareGrades]);

  // Filter catalog items
  const filteredCyberware = useMemo(() => {
    if (!cyberwareCatalog) return [];
    let items = [...cyberwareCatalog.catalog];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }
    // Filter by availability
    items = items.filter((item) => item.availability <= MAX_AVAILABILITY && item.legality !== "forbidden");
    return items.slice(0, 20);
  }, [cyberwareCatalog, searchQuery]);

  const filteredBioware = useMemo(() => {
    if (!biowareCatalog) return [];
    let items = [...biowareCatalog.catalog];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }
    items = items.filter((item) => item.availability <= MAX_AVAILABILITY && item.legality !== "forbidden");
    return items.slice(0, 20);
  }, [biowareCatalog, searchQuery]);

  // Check if augmentation can be added
  const canAddAugmentation = useCallback(
    (cost: number, essenceCost: number, availability: number): boolean => {
      if (availability > MAX_AVAILABILITY) return false;
      if (cost > remainingNuyen) return false;
      if (essenceCost > remainingEssence) return false;
      return true;
    },
    [remainingNuyen, remainingEssence]
  );

  // Add cyberware
  const addCyberware = useCallback(
    (item: CyberwareCatalogItemData) => {
      const essenceCost = calculateCyberwareEssenceCost(
        item.essenceCost,
        selectedGrade as CyberwareGrade,
        cyberwareGrades
      );
      const cost = calculateCyberwareCost(item.cost, selectedGrade as CyberwareGrade, cyberwareGrades);
      const availability = calculateCyberwareAvailability(
        item.availability,
        selectedGrade as CyberwareGrade,
        cyberwareGrades
      );

      if (!canAddAugmentation(cost, essenceCost, availability)) return;

      const newItem: CyberwareItem = {
        id: `${item.id}-${Date.now()}`,
        catalogId: item.id,
        name: item.name,
        category: item.category as CyberwareItem["category"],
        grade: selectedGrade as CyberwareGrade,
        essenceCost,
        baseEssenceCost: item.essenceCost,
        cost,
        availability,
        capacity: item.capacity,
        capacityUsed: 0,
        enhancements: [],
        wirelessBonus: item.wirelessBonus,
        attributeBonuses: item.attributeBonuses,
        initiativeDiceBonus: item.initiativeDiceBonus,
      };

      updateState({
        selections: {
          ...state.selections,
          cyberware: [...selectedCyberware, newItem],
        },
      });
    },
    [selectedGrade, cyberwareGrades, canAddAugmentation, selectedCyberware, state.selections, updateState]
  );

  // Add bioware
  const addBioware = useCallback(
    (item: BiowareCatalogItemData) => {
      const essenceCost = calculateBiowareEssenceCost(
        item.essenceCost,
        selectedGrade as BiowareGrade,
        biowareGrades
      );
      const cost = calculateBiowareCost(item.cost, selectedGrade as BiowareGrade, biowareGrades);
      const availability = calculateBiowareAvailability(
        item.availability,
        selectedGrade as BiowareGrade,
        biowareGrades
      );

      if (!canAddAugmentation(cost, essenceCost, availability)) return;

      const newItem: BiowareItem = {
        id: `${item.id}-${Date.now()}`,
        catalogId: item.id,
        name: item.name,
        category: item.category as BiowareItem["category"],
        grade: selectedGrade as BiowareGrade,
        essenceCost,
        baseEssenceCost: item.essenceCost,
        cost,
        availability,
        attributeBonuses: item.attributeBonuses,
      };

      updateState({
        selections: {
          ...state.selections,
          bioware: [...selectedBioware, newItem],
        },
      });
    },
    [selectedGrade, biowareGrades, canAddAugmentation, selectedBioware, state.selections, updateState]
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

  // Validation status
  const validationStatus = useMemo(() => {
    if (remainingEssence < 0) return "error";
    if (remainingNuyen < 0) return "error";
    if (hasSpecialAttribute && (magicLoss > 0 || resonanceLoss > 0)) return "warning";
    if (selectedCyberware.length > 0 || selectedBioware.length > 0) return "valid";
    return "pending";
  }, [remainingEssence, remainingNuyen, hasSpecialAttribute, magicLoss, resonanceLoss, selectedCyberware.length, selectedBioware.length]);

  // Check prerequisites
  const hasPriorities = state.priorities?.metatype && state.priorities?.resources;
  if (!hasPriorities) {
    return (
      <CreationCard title="Augmentations" description="Install cyberware and bioware" status="pending">
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set priorities first
          </p>
        </div>
      </CreationCard>
    );
  }

  const totalAugmentations = selectedCyberware.length + selectedBioware.length;

  return (
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
            <span className={`font-medium ${remainingEssence < 1 ? "text-amber-600 dark:text-amber-400" : "text-zinc-900 dark:text-zinc-100"}`}>
              {formatEssence(remainingEssence)} / {maxEssence}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className={`h-full transition-all ${remainingEssence < 1 ? "bg-amber-500" : "bg-emerald-500"}`}
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
              Resonance reduced by {resonanceLoss} (now {Math.max(0, resonanceRating - resonanceLoss)})
            </div>
          </div>
        )}

        {/* Attribute bonuses */}
        {Object.keys(attributeBonuses).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(attributeBonuses).map(([attr, bonus]) => (
              <span
                key={attr}
                className="rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
              >
                {attr}: +{bonus}
              </span>
            ))}
          </div>
        )}

        {/* Type tabs */}
        <div className="flex gap-1">
          <button
            onClick={() => {
              setActiveTab("cyberware");
              setSelectedGrade("standard");
              setSearchQuery("");
            }}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "cyberware"
                ? "bg-cyan-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            Cyberware
          </button>
          <button
            onClick={() => {
              setActiveTab("bioware");
              setSelectedGrade("standard");
              setSearchQuery("");
            }}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "bioware"
                ? "bg-pink-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            Bioware
          </button>
        </div>

        {/* Grade selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Grade:</span>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as CyberwareGrade | BiowareGrade)}
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800"
          >
            {availableGrades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {GRADE_DISPLAY[grade.id]} ({grade.essenceMultiplier}x ESS, {grade.costMultiplier}x cost)
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Item list */}
        <div className="max-h-40 space-y-1 overflow-y-auto">
          {activeTab === "cyberware" &&
            filteredCyberware.map((item) => {
              const essenceCost = calculateCyberwareEssenceCost(
                item.essenceCost,
                selectedGrade as CyberwareGrade,
                cyberwareGrades
              );
              const cost = calculateCyberwareCost(item.cost, selectedGrade as CyberwareGrade, cyberwareGrades);
              const availability = calculateCyberwareAvailability(
                item.availability,
                selectedGrade as CyberwareGrade,
                cyberwareGrades
              );
              const canAdd = canAddAugmentation(cost, essenceCost, availability);

              return (
                <button
                  key={item.id}
                  onClick={() => canAdd && addCyberware(item)}
                  disabled={!canAdd}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                    canAdd
                      ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                      : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{item.name}</span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span className="text-cyan-600 dark:text-cyan-400">{formatEssence(essenceCost)} ESS</span>
                      <span>{formatCurrency(cost)}¥</span>
                      <span>Avail: {getAvailabilityDisplay(availability, item.legality)}</span>
                    </div>
                  </div>
                </button>
              );
            })}

          {activeTab === "bioware" &&
            filteredBioware.map((item) => {
              const essenceCost = calculateBiowareEssenceCost(
                item.essenceCost,
                selectedGrade as BiowareGrade,
                biowareGrades
              );
              const cost = calculateBiowareCost(item.cost, selectedGrade as BiowareGrade, biowareGrades);
              const availability = calculateBiowareAvailability(
                item.availability,
                selectedGrade as BiowareGrade,
                biowareGrades
              );
              const canAdd = canAddAugmentation(cost, essenceCost, availability);

              return (
                <button
                  key={item.id}
                  onClick={() => canAdd && addBioware(item)}
                  disabled={!canAdd}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                    canAdd
                      ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
                      : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
                  }`}
                >
                  <div>
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">{item.name}</span>
                    <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                      <span className="text-pink-600 dark:text-pink-400">{formatEssence(essenceCost)} ESS</span>
                      <span>{formatCurrency(cost)}¥</span>
                      <span>Avail: {getAvailabilityDisplay(availability, item.legality)}</span>
                    </div>
                  </div>
                </button>
              );
            })}

          {/* Empty states */}
          {activeTab === "cyberware" && filteredCyberware.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No cyberware found
            </div>
          )}
          {activeTab === "bioware" && filteredBioware.length === 0 && (
            <div className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No bioware found
            </div>
          )}
        </div>

        {/* Installed augmentations */}
        {totalAugmentations > 0 && (
          <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Installed ({totalAugmentations})
            </h4>
            <div className="max-h-24 space-y-1 overflow-y-auto text-xs">
              {selectedCyberware.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-cyan-500" />
                    <span className="truncate">{item.name}</span>
                    <span className="text-zinc-400">({GRADE_DISPLAY[item.grade]})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-600 dark:text-cyan-400">{formatEssence(item.essenceCost)}</span>
                    <button onClick={() => item.id && removeCyberware(item.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
              {selectedBioware.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-pink-500" />
                    <span className="truncate">{item.name}</span>
                    <span className="text-zinc-400">({GRADE_DISPLAY[item.grade]})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-pink-600 dark:text-pink-400">{formatEssence(item.essenceCost)}</span>
                    <button onClick={() => item.id && removeBioware(item.id)} className="text-red-500 hover:text-red-700">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-200 pt-2 dark:border-zinc-700">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Total Essence Loss:</span>
                <span className="font-medium">{formatEssence(totalEssenceLoss)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Total Cost:</span>
                <span className="font-medium">{formatCurrency(cyberwareSpent + biowareSpent)}¥</span>
              </div>
            </div>
          </div>
        )}

        {/* Help text */}
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
          Augmentations reduce Essence. Each point of Essence lost reduces Magic/Resonance by 1.
        </p>
      </div>
    </CreationCard>
  );
}
