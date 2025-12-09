"use client";

import { useState, useMemo, useCallback } from "react";
import type { CreationState, CyberwareItem, BiowareItem } from "@/lib/types";
import {
  useCyberware,
  useBioware,
  useAugmentationRules,
  useCyberwareGrades,
  useBiowareGrades,
  calculateCyberwareEssenceCost,
  calculateCyberwareCost,
  calculateCyberwareAvailability,
  calculateBiowareEssenceCost,
  calculateBiowareCost,
  calculateBiowareAvailability,
  calculateMagicLoss,
  type CyberwareCatalogItemData,
  type BiowareCatalogItemData,
  type CyberwareGradeData,
  type BiowareGradeData,
} from "@/lib/rules/RulesetContext";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

type AugmentationTab = "cyberware" | "bioware";

type CyberwareCategory =
  | "all"
  | "headware"
  | "eyeware"
  | "earware"
  | "bodyware"
  | "cyberlimb"
  | "cyberlimb-enhancement"
  | "cyberlimb-accessory";

type BiowareCategory = "all" | "basic" | "cultured";

const CYBERWARE_CATEGORIES: Array<{ id: CyberwareCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "headware", label: "Headware" },
  { id: "eyeware", label: "Eyeware" },
  { id: "earware", label: "Earware" },
  { id: "bodyware", label: "Bodyware" },
  { id: "cyberlimb", label: "Cyberlimbs" },
  { id: "cyberlimb-enhancement", label: "Enhancements" },
  { id: "cyberlimb-accessory", label: "Accessories" },
];

const BIOWARE_CATEGORIES: Array<{ id: BiowareCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "basic", label: "Basic" },
  { id: "cultured", label: "Cultured" },
];

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
  restricted?: boolean,
  forbidden?: boolean
): string {
  let display = String(availability);
  if (restricted) display += "R";
  if (forbidden) display += "F";
  return display;
}

export function AugmentationsStep({ state, updateState, budgetValues }: StepProps) {
  const cyberwareCatalog = useCyberware({ excludeForbidden: false });
  const biowareCatalog = useBioware({ excludeForbidden: false });
  const augmentationRules = useAugmentationRules();
  const cyberwareGrades = useCyberwareGrades();
  const biowareGrades = useBiowareGrades();

  const [activeTab, setActiveTab] = useState<AugmentationTab>("cyberware");
  const [cyberwareCategory, setCyberwareCategory] = useState<CyberwareCategory>("all");
  const [biowareCategory, setBiowareCategory] = useState<BiowareCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>({});

  // Get selections from state
  const selectedCyberware: CyberwareItem[] =
    (state.selections?.cyberware as CyberwareItem[]) || [];
  const selectedBioware: BiowareItem[] =
    (state.selections?.bioware as BiowareItem[]) || [];

  // Get magic path to check if character is magical
  const magicPath = (state.selections?.["magical-path"] as string) || "mundane";
  const isMagical = magicPath !== "mundane" && magicPath !== "technomancer";
  const isTechnomancer = magicPath === "technomancer";
  const hasSpecialAttribute = isMagical || isTechnomancer;

  // Calculate essence values
  const maxEssence = augmentationRules.maxEssence;
  const cyberwareEssence = selectedCyberware.reduce(
    (sum, item) => sum + item.essenceCost,
    0
  );
  const biowareEssence = selectedBioware.reduce(
    (sum, item) => sum + item.essenceCost,
    0
  );
  const totalEssenceLoss = Math.round((cyberwareEssence + biowareEssence) * 100) / 100;
  const remainingEssence = Math.round((maxEssence - totalEssenceLoss) * 100) / 100;

  // Calculate magic/resonance loss
  const magicLoss = calculateMagicLoss(
    totalEssenceLoss,
    augmentationRules.magicReductionFormula
  );

  // Calculate nuyen from budget (integrating with gear)
  const nuyenBudget = budgetValues["nuyen"] || 0;
  const gearSpent = (state.budgets?.["nuyen-spent-gear"] as number) || 0;
  const cyberwareSpent = selectedCyberware.reduce((sum, item) => sum + item.cost, 0);
  const biowareSpent = selectedBioware.reduce((sum, item) => sum + item.cost, 0);
  const augmentationSpent = cyberwareSpent + biowareSpent;
  const totalNuyenSpent = gearSpent + augmentationSpent;
  const remainingNuyen = nuyenBudget - totalNuyenSpent;

  // Calculate attribute bonuses from all augmentations
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

  // Get selected grade for an item
  const getItemGrade = useCallback(
    (itemId: string, defaultGrade: string = "standard"): string => {
      return selectedGrades[itemId] || defaultGrade;
    },
    [selectedGrades]
  );

  // Filter cyberware catalog
  const filteredCyberware = useMemo(() => {
    if (!cyberwareCatalog) return [];

    let items = [...cyberwareCatalog.catalog];

    // Filter by category
    if (cyberwareCategory !== "all") {
      items = items.filter((item) => item.category === cyberwareCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Filter by availability
    if (!showUnavailable) {
      items = items.filter((item) => {
        const grade = getItemGrade(item.id);
        const adjustedAvail = calculateCyberwareAvailability(
          item.availability,
          grade,
          cyberwareGrades
        );
        return (
          adjustedAvail <= augmentationRules.maxAvailabilityAtCreation &&
          !item.forbidden
        );
      });
    }

    // Sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [
    cyberwareCatalog,
    cyberwareCategory,
    searchQuery,
    showUnavailable,
    getItemGrade,
    cyberwareGrades,
    augmentationRules.maxAvailabilityAtCreation,
  ]);

  // Filter bioware catalog
  const filteredBioware = useMemo(() => {
    if (!biowareCatalog) return [];

    let items = [...biowareCatalog.catalog];

    // Filter by category
    if (biowareCategory !== "all") {
      items = items.filter((item) => item.category === biowareCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Filter by availability
    if (!showUnavailable) {
      items = items.filter((item) => {
        const grade = getItemGrade(item.id);
        const adjustedAvail = calculateBiowareAvailability(
          item.availability,
          grade,
          biowareGrades
        );
        return (
          adjustedAvail <= augmentationRules.maxAvailabilityAtCreation &&
          !item.forbidden
        );
      });
    }

    // Sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [
    biowareCatalog,
    biowareCategory,
    searchQuery,
    showUnavailable,
    getItemGrade,
    biowareGrades,
    augmentationRules.maxAvailabilityAtCreation,
  ]);

  // Check if item can be added
  const canAddItem = useCallback(
    (
      itemCost: number,
      essenceCost: number,
      availability: number,
      newBonuses?: Record<string, number>,
      forbidden?: boolean
    ): { allowed: boolean; reason?: string } => {
      // Check forbidden
      if (forbidden) {
        return { allowed: false, reason: "Forbidden items not allowed at creation" };
      }

      // Check availability
      if (availability > augmentationRules.maxAvailabilityAtCreation) {
        return {
          allowed: false,
          reason: `Availability ${availability} exceeds ${augmentationRules.maxAvailabilityAtCreation}`,
        };
      }

      // Check nuyen
      if (itemCost > remainingNuyen) {
        return { allowed: false, reason: "Insufficient nuyen" };
      }

      // Check essence
      if (essenceCost > remainingEssence) {
        return { allowed: false, reason: "Insufficient essence" };
      }

      // Check attribute bonuses
      if (newBonuses) {
        for (const [attr, bonus] of Object.entries(newBonuses)) {
          const currentBonus = attributeBonuses[attr] || 0;
          if (currentBonus + bonus > augmentationRules.maxAttributeBonus) {
            return {
              allowed: false,
              reason: `${attr} bonus would exceed +${augmentationRules.maxAttributeBonus}`,
            };
          }
        }
      }

      return { allowed: true };
    },
    [
      augmentationRules.maxAvailabilityAtCreation,
      augmentationRules.maxAttributeBonus,
      remainingNuyen,
      remainingEssence,
      attributeBonuses,
    ]
  );

  // Add cyberware
  const addCyberware = useCallback(
    (item: CyberwareCatalogItemData, grade: string, rating?: number) => {
      const essenceCost = calculateCyberwareEssenceCost(
        item.essenceCost,
        grade,
        cyberwareGrades,
        rating,
        item.essencePerRating
      );
      const cost = calculateCyberwareCost(
        item.cost,
        grade,
        cyberwareGrades,
        rating,
        item.costPerRating
      );
      const availability = calculateCyberwareAvailability(
        item.availability,
        grade,
        cyberwareGrades
      );

      // Calculate attribute bonuses for this item
      let itemBonuses: Record<string, number> | undefined;
      if (item.attributeBonuses || item.attributeBonusesPerRating) {
        itemBonuses = {};
        if (item.attributeBonuses) {
          for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
            itemBonuses[attr] = bonus;
          }
        }
        if (item.attributeBonusesPerRating && rating) {
          for (const [attr, bonus] of Object.entries(item.attributeBonusesPerRating)) {
            itemBonuses[attr] = (itemBonuses[attr] || 0) + bonus * rating;
          }
        }
      }

      const check = canAddItem(cost, essenceCost, availability, itemBonuses, item.forbidden);
      if (!check.allowed) return;

      const newItem: CyberwareItem = {
        id: crypto.randomUUID(),
        catalogId: item.id,
        name: item.name,
        category: item.category as CyberwareItem["category"],
        grade: grade as CyberwareItem["grade"],
        baseEssenceCost: item.essenceCost,
        essenceCost,
        rating,
        cost,
        availability,
        restricted: item.restricted,
        forbidden: item.forbidden,
        attributeBonuses: itemBonuses,
        initiativeDiceBonus: item.initiativeDiceBonus,
        capacity: item.capacity,
        capacityUsed: 0,
        wirelessBonus: item.wirelessBonus,
      };

      const updatedCyberware = [...selectedCyberware, newItem];

      updateState({
        selections: {
          ...state.selections,
          cyberware: updatedCyberware,
        },
        budgets: {
          ...state.budgets,
          "nuyen-spent-augmentations": augmentationSpent + cost,
          "essence-spent": totalEssenceLoss + essenceCost,
        },
      });
    },
    [
      cyberwareGrades,
      canAddItem,
      selectedCyberware,
      state.selections,
      state.budgets,
      updateState,
      augmentationSpent,
      totalEssenceLoss,
    ]
  );

  // Add bioware
  const addBioware = useCallback(
    (item: BiowareCatalogItemData, grade: string, rating?: number) => {
      const essenceCost = calculateBiowareEssenceCost(
        item.essenceCost,
        grade,
        biowareGrades,
        rating,
        item.essencePerRating
      );
      const cost = calculateBiowareCost(
        item.cost,
        grade,
        biowareGrades,
        rating,
        item.costPerRating
      );
      const availability = calculateBiowareAvailability(
        item.availability,
        grade,
        biowareGrades
      );

      // Calculate attribute bonuses for this item
      let itemBonuses: Record<string, number> | undefined;
      if (item.attributeBonuses || item.attributeBonusesPerRating) {
        itemBonuses = {};
        if (item.attributeBonuses) {
          for (const [attr, bonus] of Object.entries(item.attributeBonuses)) {
            itemBonuses[attr] = bonus;
          }
        }
        if (item.attributeBonusesPerRating && rating) {
          for (const [attr, bonus] of Object.entries(item.attributeBonusesPerRating)) {
            itemBonuses[attr] = (itemBonuses[attr] || 0) + bonus * rating;
          }
        }
      }

      const check = canAddItem(cost, essenceCost, availability, itemBonuses, item.forbidden);
      if (!check.allowed) return;

      const newItem: BiowareItem = {
        id: crypto.randomUUID(),
        catalogId: item.id,
        name: item.name,
        category: item.category as BiowareItem["category"],
        grade: grade as BiowareItem["grade"],
        baseEssenceCost: item.essenceCost,
        essenceCost,
        rating,
        cost,
        availability,
        restricted: item.restricted,
        forbidden: item.forbidden,
        attributeBonuses: itemBonuses,
      };

      const updatedBioware = [...selectedBioware, newItem];

      updateState({
        selections: {
          ...state.selections,
          bioware: updatedBioware,
        },
        budgets: {
          ...state.budgets,
          "nuyen-spent-augmentations": augmentationSpent + cost,
          "essence-spent": totalEssenceLoss + essenceCost,
        },
      });
    },
    [
      biowareGrades,
      canAddItem,
      selectedBioware,
      state.selections,
      state.budgets,
      updateState,
      augmentationSpent,
      totalEssenceLoss,
    ]
  );


  // Render cyberware item
  const renderCyberwareItem = (item: CyberwareCatalogItemData) => {
    const grade = getItemGrade(item.id);
    const essenceCost = calculateCyberwareEssenceCost(
      item.essenceCost,
      grade,
      cyberwareGrades,
      item.hasRating ? 1 : undefined,
      item.essencePerRating
    );
    const cost = calculateCyberwareCost(
      item.cost,
      grade,
      cyberwareGrades,
      item.hasRating ? 1 : undefined,
      item.costPerRating
    );
    const availability = calculateCyberwareAvailability(item.availability, grade, cyberwareGrades);

    const check = canAddItem(
      cost,
      essenceCost,
      availability,
      item.attributeBonuses,
      item.forbidden
    );

    return (
      <tr
        key={item.id}
        className={`${!check.allowed ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
      >
        <td className="px-3 py-2">
          <p className="font-medium">{item.name}</p>
          {item.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
              {item.description}
            </p>
          )}
          {item.attributeBonuses && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {Object.entries(item.attributeBonuses)
                .map(([attr, bonus]) => `+${bonus} ${attr.toUpperCase()}`)
                .join(", ")}
            </p>
          )}
          {item.initiativeDiceBonus && (
            <p className="text-xs text-blue-600 dark:text-blue-400">
              +{item.initiativeDiceBonus}D6 Initiative
            </p>
          )}
          {item.hasRating && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Rating 1-{item.maxRating || 6}
            </p>
          )}
        </td>
        <td className="px-3 py-2 text-center">
          <span className="text-amber-600 dark:text-amber-400">{formatEssence(essenceCost)}</span>
        </td>
        <td className="px-3 py-2 text-right">¥{formatCurrency(cost)}</td>
        <td className="px-3 py-2 text-center">
          <span
            className={`${
              item.restricted
                ? "text-amber-600 dark:text-amber-400"
                : item.forbidden
                ? "text-red-600 dark:text-red-400"
                : ""
            }`}
          >
            {getAvailabilityDisplay(availability, item.restricted, item.forbidden)}
          </span>
        </td>
        <td className="px-3 py-2">
          <select
            value={grade}
            onChange={(e) =>
              setSelectedGrades((prev) => ({ ...prev, [item.id]: e.target.value }))
            }
            className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-600 dark:bg-zinc-800"
          >
            {cyberwareGrades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </td>
        <td className="px-3 py-2 text-center">
          <button
            onClick={() => addCyberware(item, grade, item.hasRating ? 1 : undefined)}
            disabled={!check.allowed}
            title={check.reason}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              check.allowed
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
            }`}
          >
            Add
          </button>
        </td>
      </tr>
    );
  };

  // Render bioware item
  const renderBiowareItem = (item: BiowareCatalogItemData) => {
    const grade = getItemGrade(item.id);
    const essenceCost = calculateBiowareEssenceCost(
      item.essenceCost,
      grade,
      biowareGrades,
      item.hasRating ? 1 : undefined,
      item.essencePerRating
    );
    const cost = calculateBiowareCost(
      item.cost,
      grade,
      biowareGrades,
      item.hasRating ? 1 : undefined,
      item.costPerRating
    );
    const availability = calculateBiowareAvailability(item.availability, grade, biowareGrades);

    const check = canAddItem(
      cost,
      essenceCost,
      availability,
      item.attributeBonuses,
      item.forbidden
    );

    return (
      <tr
        key={item.id}
        className={`${!check.allowed ? "opacity-50" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
      >
        <td className="px-3 py-2">
          <p className="font-medium">{item.name}</p>
          {item.description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">
              {item.description}
            </p>
          )}
          {item.attributeBonuses && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              {Object.entries(item.attributeBonuses)
                .map(([attr, bonus]) => `+${bonus} ${attr.toUpperCase()}`)
                .join(", ")}
            </p>
          )}
          {item.hasRating && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Rating 1-{item.maxRating || 6}
            </p>
          )}
        </td>
        <td className="px-3 py-2 text-center">
          <span className="text-amber-600 dark:text-amber-400">{formatEssence(essenceCost)}</span>
        </td>
        <td className="px-3 py-2 text-right">¥{formatCurrency(cost)}</td>
        <td className="px-3 py-2 text-center">
          <span
            className={`${
              item.restricted
                ? "text-amber-600 dark:text-amber-400"
                : item.forbidden
                ? "text-red-600 dark:text-red-400"
                : ""
            }`}
          >
            {getAvailabilityDisplay(availability, item.restricted, item.forbidden)}
          </span>
        </td>
        <td className="px-3 py-2">
          <select
            value={grade}
            onChange={(e) =>
              setSelectedGrades((prev) => ({ ...prev, [item.id]: e.target.value }))
            }
            className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-600 dark:bg-zinc-800"
          >
            {biowareGrades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </td>
        <td className="px-3 py-2 text-center">
          <button
            onClick={() => addBioware(item, grade, item.hasRating ? 1 : undefined)}
            disabled={!check.allowed}
            title={check.reason}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              check.allowed
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
            }`}
          >
            Add
          </button>
        </td>
      </tr>
    );
  };

  if (!cyberwareCatalog || !biowareCatalog) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <p className="text-amber-800 dark:text-amber-200">Loading augmentation catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Essence and Budget Summary */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Essence</p>
            <p
              className={`text-lg font-semibold ${
                remainingEssence < 1
                  ? "text-red-600 dark:text-red-400"
                  : remainingEssence < 3
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatEssence(remainingEssence)} / {maxEssence}
            </p>
            {/* Essence bar */}
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-full transition-all ${
                  remainingEssence < 1
                    ? "bg-red-500"
                    : remainingEssence < 3
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${(remainingEssence / maxEssence) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Nuyen Remaining</p>
            <p
              className={`text-lg font-semibold ${
                remainingNuyen < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              ¥{formatCurrency(remainingNuyen)}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Augmentation Cost</p>
            <p className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              ¥{formatCurrency(augmentationSpent)}
            </p>
          </div>
          {hasSpecialAttribute && (
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {isTechnomancer ? "Resonance" : "Magic"} Loss
              </p>
              <p
                className={`text-lg font-semibold ${
                  magicLoss > 0 ? "text-red-600 dark:text-red-400" : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                -{magicLoss}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Magic/Resonance Warning */}
      {hasSpecialAttribute && magicLoss > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-medium">Warning:</span> Installing augmentations reduces your{" "}
            {isTechnomancer ? "Resonance" : "Magic"} rating. Current essence loss (
            {formatEssence(totalEssenceLoss)}) reduces {isTechnomancer ? "Resonance" : "Magic"} by{" "}
            {magicLoss}.
          </p>
        </div>
      )}

      {/* Attribute Bonuses Summary */}
      {Object.keys(attributeBonuses).length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Attribute Bonuses from Augmentations:
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {Object.entries(attributeBonuses).map(([attr, bonus]) => (
              <span
                key={attr}
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  bonus >= augmentationRules.maxAttributeBonus
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                }`}
              >
                +{bonus} {attr.charAt(0).toUpperCase() + attr.slice(1)}
                {bonus >= augmentationRules.maxAttributeBonus && " (max)"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setActiveTab("cyberware")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "cyberware"
                  ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Cyberware ({filteredCyberware.length})
              {selectedCyberware.length > 0 && (
                <span className="ml-2 rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300">
                  {selectedCyberware.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("bioware")}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "bioware"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Bioware ({filteredBioware.length})
              {selectedBioware.length > 0 && (
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/50 dark:text-green-300">
                  {selectedBioware.length}
                </span>
              )}
            </button>
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

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1">
            {activeTab === "cyberware"
              ? CYBERWARE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCyberwareCategory(cat.id)}
                    className={`rounded-full px-2 py-1 text-xs transition-colors ${
                      cyberwareCategory === cat.id
                        ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-100"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))
              : BIOWARE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setBiowareCategory(cat.id)}
                    className={`rounded-full px-2 py-1 text-xs transition-colors ${
                      biowareCategory === cat.id
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-400"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
          </div>

          {/* Item Table */}
          <div className="max-h-96 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-800">
                <tr>
                  <th className="px-3 py-2 text-left">Item</th>
                  <th className="px-3 py-2 text-center">Essence</th>
                  <th className="px-3 py-2 text-right">Cost</th>
                  <th className="px-3 py-2 text-center">Avail</th>
                  <th className="px-3 py-2 text-center w-24">Grade</th>
                  <th className="px-3 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {activeTab === "cyberware"
                  ? filteredCyberware.map(renderCyberwareItem)
                  : filteredBioware.map(renderBiowareItem)}
                {((activeTab === "cyberware" && filteredCyberware.length === 0) ||
                  (activeTab === "bioware" && filteredBioware.length === 0)) && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-zinc-500">
                      No items found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>

      {/* Help Text */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          <span className="font-medium">Augmentation Rules:</span> Maximum availability at creation:{" "}
          {augmentationRules.maxAvailabilityAtCreation}. Maximum attribute bonus from augmentations:{" "}
          +{augmentationRules.maxAttributeBonus}. Higher grades reduce essence cost but increase
          nuyen cost. Essence loss reduces Magic/Resonance for awakened/emerged characters.
        </p>
      </div>
    </div>
  );
}
