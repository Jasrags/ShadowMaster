"use client";

/**
 * QualitiesCard
 *
 * Compact card for quality selection in sheet-driven creation.
 * Shows positive and negative qualities with karma tracking.
 *
 * Features:
 * - Positive/negative quality lists
 * - Karma balance display
 * - Incompatibility warnings
 * - Quality search and filtering
 */

import { useMemo, useCallback, useState } from "react";
import { useQualities } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader-types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Check, Search, Plus as PlusIcon, Minus as MinusIcon, X } from "lucide-react";

const MAX_POSITIVE_KARMA = 25;
const MAX_NEGATIVE_KARMA = 25;

interface QualitiesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

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
  const karmaRemaining = startingKarma + negativeKarmaGained - positiveKarmaSpent;

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
        // Remove quality
        newSelected = newSelected.filter((id) => id !== qualityId);
        delete newLevels[qualityId];
      } else {
        // Check karma limits
        const cost = getQualityCost(quality, qualityId);
        if (isPositive) {
          if (positiveKarmaSpent + cost > MAX_POSITIVE_KARMA) return;
          if (karmaRemaining < cost) return;
        } else {
          if (negativeKarmaGained + cost > MAX_NEGATIVE_KARMA) return;
        }
        newSelected.push(qualityId);
        if (quality.levels) {
          newLevels[qualityId] = 1;
        }
      }

      // Calculate new budgets
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

      const newSelections = {
        ...state.selections,
        positiveQualities: isPositive ? newSelected : selectedPositive,
        negativeQualities: isPositive ? selectedNegative : newSelected,
        qualityLevels: newLevels,
      };

      updateState({
        selections: newSelections,
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
      karmaRemaining,
      state.selections,
      state.budgets,
      updateState,
    ]
  );

  // Get validation status
  const validationStatus = useMemo(() => {
    if (positiveKarmaSpent > MAX_POSITIVE_KARMA || negativeKarmaGained > MAX_NEGATIVE_KARMA) {
      return "error";
    }
    if (selectedPositive.length > 0 || selectedNegative.length > 0) {
      return "valid";
    }
    return "pending";
  }, [positiveKarmaSpent, negativeKarmaGained, selectedPositive, selectedNegative]);

  // Render quality item
  const renderQuality = (quality: QualityData, isPositive: boolean) => {
    const isSelected = isPositive
      ? selectedPositive.includes(quality.id)
      : selectedNegative.includes(quality.id);
    const cost = getQualityCost(quality, quality.id);

    // Check if can be added
    const canAdd = isPositive
      ? positiveKarmaSpent + cost <= MAX_POSITIVE_KARMA && karmaRemaining >= cost
      : negativeKarmaGained + cost <= MAX_NEGATIVE_KARMA;

    return (
      <button
        key={quality.id}
        onClick={() => toggleQuality(quality.id, isPositive)}
        disabled={!isSelected && !canAdd}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
          isSelected
            ? isPositive
              ? "bg-blue-50 ring-1 ring-blue-300 dark:bg-blue-900/30 dark:ring-blue-700"
              : "bg-red-50 ring-1 ring-red-300 dark:bg-red-900/30 dark:ring-red-700"
            : canAdd
            ? "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800"
            : "cursor-not-allowed bg-zinc-50 opacity-50 dark:bg-zinc-800/50"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
              isSelected
                ? isPositive
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-red-500 bg-red-500 text-white"
                : "border-zinc-300 dark:border-zinc-600"
            }`}
          >
            {isSelected && <Check className="h-3 w-3" />}
          </div>
          <div>
            <span className="text-sm text-zinc-900 dark:text-zinc-100">{quality.name}</span>
            {quality.levels && quality.levels.length > 0 && (
              <span className="ml-1 text-xs text-zinc-400">(levels)</span>
            )}
          </div>
        </div>
        <span
          className={`text-xs font-medium ${
            isPositive
              ? "text-blue-600 dark:text-blue-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? `-${cost}` : `+${cost}`} karma
        </span>
      </button>
    );
  };

  return (
    <CreationCard
      title="Qualities"
      description="Select positive and negative traits"
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Karma summary */}
        <div className="grid gap-2 sm:grid-cols-3">
          <BudgetIndicator
            label="Karma"
            remaining={karmaRemaining}
            total={startingKarma + negativeKarmaGained}
            compact
          />
          <div className="flex items-center gap-1 text-xs">
            <PlusIcon className="h-3 w-3 text-blue-500" />
            <span className="text-zinc-500">Positive:</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {positiveKarmaSpent}/{MAX_POSITIVE_KARMA}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <MinusIcon className="h-3 w-3 text-red-500" />
            <span className="text-zinc-500">Negative:</span>
            <span className="font-medium text-red-600 dark:text-red-400">
              {negativeKarmaGained}/{MAX_NEGATIVE_KARMA}
            </span>
          </div>
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
                ? "bg-white text-red-600 shadow dark:bg-zinc-700 dark:text-red-400"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            Negative ({filteredNegative.length})
          </button>
        </div>

        {/* Quality list */}
        <div className="max-h-64 space-y-1 overflow-y-auto">
          {activeTab === "positive"
            ? filteredPositive.map((q) => renderQuality(q, true))
            : filteredNegative.map((q) => renderQuality(q, false))}
        </div>

        {/* Selected qualities summary */}
        {(selectedPositive.length > 0 || selectedNegative.length > 0) && (
          <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Selected Qualities
            </h4>
            <div className="mt-2 flex flex-wrap gap-1">
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
              {selectedNegative.map((id) => {
                const q = negativeQualities.find((x) => x.id === id);
                return q ? (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900/50 dark:text-red-300"
                  >
                    {q.name}
                    <button
                      onClick={() => toggleQuality(id, false)}
                      className="hover:text-red-900 dark:hover:text-red-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </CreationCard>
  );
}
