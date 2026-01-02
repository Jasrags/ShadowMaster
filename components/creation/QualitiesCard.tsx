"use client";

/**
 * QualitiesCard
 *
 * Card for quality selection in sheet-driven creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
 *
 * Features:
 * - Dual budget progress bars (Positive costs / Negative gains)
 * - Tabbed selection with search
 * - Quality cards with descriptions
 * - Karma balance summary
 * - Over-limit warnings
 */

import { useMemo, useCallback, useState } from "react";
import { useQualities } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader-types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "./shared";
import { Check, Search, AlertTriangle, X } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_POSITIVE_KARMA = 25;
const MAX_NEGATIVE_KARMA = 25;

interface QualitiesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// BUDGET PROGRESS BAR COMPONENT
// =============================================================================

function QualityBudgetBar({
  label,
  description,
  used,
  max,
  isOver,
  isPositive,
}: {
  label: string;
  description: string;
  used: number;
  max: number;
  isOver: boolean;
  isPositive: boolean;
}) {
  const remaining = max - used;
  const percentage = max > 0 ? Math.min(100, (used / max) * 100) : 0;

  return (
    <div className={`rounded-lg border p-3 ${
      isOver
        ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
        : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
    }`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </div>
        <div className={`text-lg font-bold ${
          isOver
            ? "text-red-600 dark:text-red-400"
            : remaining === 0
              ? "text-emerald-600 dark:text-emerald-400"
              : isPositive
                ? "text-blue-600 dark:text-blue-400"
                : "text-amber-600 dark:text-amber-400"
        }`}>
          {used}
        </div>
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {description}
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="float-right">of {max} max</span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all ${
            isOver
              ? "bg-red-500"
              : remaining === 0
                ? "bg-emerald-500"
                : isPositive
                  ? "bg-blue-500"
                  : "bg-amber-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Over budget warning */}
      {isOver && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{Math.abs(remaining)} karma over limit</span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// QUALITY ROW COMPONENT
// =============================================================================

function QualityRow({
  quality,
  isSelected,
  isPositive,
  cost,
  canAdd,
  onToggle,
}: {
  quality: QualityData;
  isSelected: boolean;
  isPositive: boolean;
  cost: number;
  canAdd: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={!isSelected && !canAdd}
      className={`w-full rounded-lg border p-3 text-left transition-all ${
        isSelected
          ? isPositive
            ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/30"
            : "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/30"
          : canAdd
          ? "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
          : "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-900"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Checkbox */}
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
              isSelected
                ? isPositive
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-amber-500 bg-amber-500 text-white"
                : "border-zinc-300 dark:border-zinc-600"
            }`}
          >
            {isSelected && <Check className="h-3 w-3" />}
          </div>

          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {quality.name}
          </span>

          {quality.levels && quality.levels.length > 0 && (
            <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
              levels
            </span>
          )}
        </div>

        <span className={`text-sm font-medium ${
          isPositive
            ? "text-blue-600 dark:text-blue-400"
            : "text-amber-600 dark:text-amber-400"
        }`}>
          {isPositive ? `${cost} karma` : `+${cost} karma`}
        </span>
      </div>

      {/* Description */}
      {quality.description && (
        <p className="mt-1 pl-7 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {quality.description}
        </p>
      )}
    </button>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function QualitiesCard({ state, updateState }: QualitiesCardProps) {
  const { positive: positiveQualities, negative: negativeQualities } = useQualities();
  const { getBudget } = useCreationBudgets();
  const karmaBudget = getBudget("karma");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"positive" | "negative">("positive");

  // Get selected qualities from state
  const selectedPositive = useMemo(() => {
    return (state.selections.positiveQualities || []) as string[];
  }, [state.selections.positiveQualities]);

  const selectedNegative = useMemo(() => {
    return (state.selections.negativeQualities || []) as string[];
  }, [state.selections.negativeQualities]);

  const qualityLevels = useMemo(() => {
    return (state.selections.qualityLevels || {}) as Record<string, number>;
  }, [state.selections.qualityLevels]);

  // Get cost of a quality
  const getQualityCost = useCallback(
    (quality: QualityData, id: string) => {
      if (quality.levels && quality.levels.length > 0) {
        const levelIdx = qualityLevels[id] || 1;
        const levelData = quality.levels.find((l) => l.level === levelIdx);
        return levelData ? Math.abs(levelData.karma) : quality.karmaCost || 0;
      }
      return quality.karmaCost || quality.karmaBonus || 0;
    },
    [qualityLevels]
  );

  // Calculate karma spent/gained
  const positiveKarmaSpent = useMemo(() => {
    return selectedPositive.reduce((sum, id) => {
      const quality = positiveQualities.find((q) => q.id === id);
      if (!quality) return sum;
      return sum + getQualityCost(quality, id);
    }, 0);
  }, [selectedPositive, positiveQualities, getQualityCost]);

  const negativeKarmaGained = useMemo(() => {
    return selectedNegative.reduce((sum, id) => {
      const quality = negativeQualities.find((q) => q.id === id);
      if (!quality) return sum;
      return sum + getQualityCost(quality, id);
    }, 0);
  }, [selectedNegative, negativeQualities, getQualityCost]);

  const startingKarma = karmaBudget?.total || 25;
  const karmaBalance = startingKarma + negativeKarmaGained - positiveKarmaSpent;
  const isPositiveOver = positiveKarmaSpent > MAX_POSITIVE_KARMA;
  const isNegativeOver = negativeKarmaGained > MAX_NEGATIVE_KARMA;

  // Filter qualities
  const filterQualities = useCallback(
    (qualities: QualityData[]) => {
      let filtered = qualities.filter((q) => !q.isRacial);
      if (searchQuery) {
        filtered = filtered.filter((q) =>
          q.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return filtered;
    },
    [searchQuery]
  );

  const filteredPositive = useMemo(
    () => filterQualities(positiveQualities),
    [positiveQualities, filterQualities]
  );
  const filteredNegative = useMemo(
    () => filterQualities(negativeQualities),
    [negativeQualities, filterQualities]
  );

  // Toggle quality selection
  const toggleQuality = useCallback(
    (qualityId: string, isPositive: boolean) => {
      const list = isPositive ? positiveQualities : negativeQualities;
      const quality = list.find((q) => q.id === qualityId);
      if (!quality) return;

      const currentList = isPositive ? selectedPositive : selectedNegative;
      const isSelected = currentList.includes(qualityId);

      let newSelected = [...currentList];
      const newLevels = { ...qualityLevels };

      if (isSelected) {
        newSelected = newSelected.filter((id) => id !== qualityId);
        delete newLevels[qualityId];
      } else {
        const cost = getQualityCost(quality, qualityId);
        if (isPositive) {
          if (positiveKarmaSpent + cost > MAX_POSITIVE_KARMA) return;
          if (karmaBalance < cost) return;
        } else {
          if (negativeKarmaGained + cost > MAX_NEGATIVE_KARMA) return;
        }
        newSelected.push(qualityId);
        if (quality.levels) {
          newLevels[qualityId] = 1;
        }
      }

      const newPosSpent = isPositive
        ? newSelected.reduce((sum, id) => {
            const q = positiveQualities.find((x) => x.id === id);
            if (!q) return sum;
            return sum + getQualityCost(q, id);
          }, 0)
        : positiveKarmaSpent;

      const newNegGained = !isPositive
        ? newSelected.reduce((sum, id) => {
            const q = negativeQualities.find((x) => x.id === id);
            if (!q) return sum;
            return sum + getQualityCost(q, id);
          }, 0)
        : negativeKarmaGained;

      updateState({
        selections: {
          ...state.selections,
          positiveQualities: isPositive ? newSelected : selectedPositive,
          negativeQualities: isPositive ? selectedNegative : newSelected,
          qualityLevels: newLevels,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-positive": isPositive ? newPosSpent : positiveKarmaSpent,
          "karma-gained-negative": isPositive ? negativeKarmaGained : newNegGained,
        },
      });
    },
    [
      positiveQualities,
      negativeQualities,
      selectedPositive,
      selectedNegative,
      qualityLevels,
      getQualityCost,
      positiveKarmaSpent,
      negativeKarmaGained,
      karmaBalance,
      state.selections,
      state.budgets,
      updateState,
    ]
  );

  // Get validation status
  const validationStatus = useMemo(() => {
    if (isPositiveOver || isNegativeOver) return "error";
    if (selectedPositive.length > 0 || selectedNegative.length > 0) return "valid";
    return "pending";
  }, [isPositiveOver, isNegativeOver, selectedPositive, selectedNegative]);

  return (
    <CreationCard
      title="Qualities"
      description={
        selectedPositive.length + selectedNegative.length > 0
          ? `${selectedPositive.length} positive, ${selectedNegative.length} negative`
          : "Optional traits"
      }
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Budget indicators */}
        <div className="grid gap-2 sm:grid-cols-2">
          <QualityBudgetBar
            label="Positive Qualities"
            description="Cost karma to acquire"
            used={positiveKarmaSpent}
            max={MAX_POSITIVE_KARMA}
            isOver={isPositiveOver}
            isPositive={true}
          />
          <QualityBudgetBar
            label="Negative Qualities"
            description="Grant karma when taken"
            used={negativeKarmaGained}
            max={MAX_NEGATIVE_KARMA}
            isOver={isNegativeOver}
            isPositive={false}
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search qualities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
          <button
            onClick={() => setActiveTab("positive")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "positive"
                ? "bg-white text-blue-600 shadow dark:bg-zinc-700 dark:text-blue-400"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            Positive ({filteredPositive.length})
          </button>
          <button
            onClick={() => setActiveTab("negative")}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === "negative"
                ? "bg-white text-amber-600 shadow dark:bg-zinc-700 dark:text-amber-400"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            Negative ({filteredNegative.length})
          </button>
        </div>

        {/* Quality list */}
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {activeTab === "positive"
            ? filteredPositive.map((quality) => {
                const isSelected = selectedPositive.includes(quality.id);
                const cost = getQualityCost(quality, quality.id);
                const canAdd = positiveKarmaSpent + cost <= MAX_POSITIVE_KARMA && karmaBalance >= cost;

                return (
                  <QualityRow
                    key={quality.id}
                    quality={quality}
                    isSelected={isSelected}
                    isPositive={true}
                    cost={cost}
                    canAdd={canAdd}
                    onToggle={() => toggleQuality(quality.id, true)}
                  />
                );
              })
            : filteredNegative.map((quality) => {
                const isSelected = selectedNegative.includes(quality.id);
                const cost = getQualityCost(quality, quality.id);
                const canAdd = negativeKarmaGained + cost <= MAX_NEGATIVE_KARMA;

                return (
                  <QualityRow
                    key={quality.id}
                    quality={quality}
                    isSelected={isSelected}
                    isPositive={false}
                    cost={cost}
                    canAdd={canAdd}
                    onToggle={() => toggleQuality(quality.id, false)}
                  />
                );
              })}
        </div>

        {/* Karma balance summary */}
        <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Karma Balance</div>
          <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
            {startingKarma} (starting) − {positiveKarmaSpent} (positive) + {negativeKarmaGained} (negative) ={" "}
            <span className={`font-bold ${karmaBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {karmaBalance} karma
            </span>
          </div>
        </div>

        {/* Selected qualities summary */}
        {(selectedPositive.length > 0 || selectedNegative.length > 0) && (
          <div className="space-y-2">
            {selectedPositive.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedPositive.map((id) => {
                  const q = positiveQualities.find((x) => x.id === id);
                  return q ? (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                    >
                      {q.name}
                      <button
                        onClick={() => toggleQuality(id, true)}
                        className="hover:text-blue-900 dark:hover:text-blue-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
            {selectedNegative.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedNegative.map((id) => {
                  const q = negativeQualities.find((x) => x.id === id);
                  return q ? (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                    >
                      {q.name}
                      <button
                        onClick={() => toggleQuality(id, false)}
                        className="hover:text-amber-900 dark:hover:text-amber-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </CreationCard>
  );
}
