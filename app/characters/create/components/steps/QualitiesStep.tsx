"use client";

import { useMemo, useCallback, useState } from "react";
import { useQualities } from "@/lib/rules";
import type { CreationState } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

const MAX_POSITIVE_KARMA = 25;
const MAX_NEGATIVE_KARMA = 25;

export function QualitiesStep({ state, updateState, budgetValues }: StepProps) {
  const { positive: positiveQualities, negative: negativeQualities } = useQualities();
  const startingKarma = budgetValues["karma"] || 25;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"positive" | "negative">("positive");

  // Get selected qualities from state
  const selectedPositive = useMemo(() => {
    return (state.selections.positiveQualities || []) as string[];
  }, [state.selections.positiveQualities]);

  const selectedNegative = useMemo(() => {
    return (state.selections.negativeQualities || []) as string[];
  }, [state.selections.negativeQualities]);

  // Calculate karma spent/gained
  const positiveKarmaSpent = useMemo(() => {
    return selectedPositive.reduce((sum, id) => {
      const quality = positiveQualities.find((q) => q.id === id);
      return sum + (quality?.karmaCost || 0);
    }, 0);
  }, [selectedPositive, positiveQualities]);

  const negativeKarmaGained = useMemo(() => {
    return selectedNegative.reduce((sum, id) => {
      const quality = negativeQualities.find((q) => q.id === id);
      return sum + (quality?.karmaCost || 0);
    }, 0);
  }, [selectedNegative, negativeQualities]);

  const karmaRemaining = startingKarma + negativeKarmaGained - positiveKarmaSpent;
  const canTakeMoreNegative = negativeKarmaGained < MAX_NEGATIVE_KARMA;
  const canSpendMoreOnPositive = positiveKarmaSpent < MAX_POSITIVE_KARMA;

  // Filter qualities by search
  const filteredPositive = useMemo(() => {
    if (!searchQuery) return positiveQualities;
    return positiveQualities.filter((q) =>
      q.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [positiveQualities, searchQuery]);

  const filteredNegative = useMemo(() => {
    if (!searchQuery) return negativeQualities;
    return negativeQualities.filter((q) =>
      q.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [negativeQualities, searchQuery]);

  // Toggle quality selection
  const togglePositiveQuality = useCallback(
    (qualityId: string) => {
      const quality = positiveQualities.find((q) => q.id === qualityId);
      if (!quality) return;

      const isSelected = selectedPositive.includes(qualityId);
      let newSelected: string[];
      const cost = quality.karmaCost || 0;

      if (isSelected) {
        newSelected = selectedPositive.filter((id) => id !== qualityId);
      } else {
        // Check if we can afford it and haven't hit the max
        if (positiveKarmaSpent + cost > MAX_POSITIVE_KARMA) return;
        if (karmaRemaining < cost) return;
        newSelected = [...selectedPositive, qualityId];
      }

      const newSpent = newSelected.reduce((sum, id) => {
        const q = positiveQualities.find((pq) => pq.id === id);
        return sum + (q?.karmaCost || 0);
      }, 0);

      updateState({
        selections: {
          ...state.selections,
          positiveQualities: newSelected,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-positive": newSpent,
        },
      });
    },
    [selectedPositive, positiveQualities, positiveKarmaSpent, karmaRemaining, state.selections, state.budgets, updateState]
  );

  const toggleNegativeQuality = useCallback(
    (qualityId: string) => {
      const quality = negativeQualities.find((q) => q.id === qualityId);
      if (!quality) return;

      const isSelected = selectedNegative.includes(qualityId);
      let newSelected: string[];
      const cost = quality.karmaCost || 0;

      if (isSelected) {
        newSelected = selectedNegative.filter((id) => id !== qualityId);
      } else {
        // Check if we've hit the max negative karma
        if (negativeKarmaGained + cost > MAX_NEGATIVE_KARMA) return;
        newSelected = [...selectedNegative, qualityId];
      }

      const newGained = newSelected.reduce((sum, id) => {
        const q = negativeQualities.find((nq) => nq.id === id);
        return sum + (q?.karmaCost || 0);
      }, 0);

      updateState({
        selections: {
          ...state.selections,
          negativeQualities: newSelected,
        },
        budgets: {
          ...state.budgets,
          "karma-gained-negative": newGained,
        },
      });
    },
    [selectedNegative, negativeQualities, negativeKarmaGained, state.selections, state.budgets, updateState]
  );

  // Render quality card
  const renderQuality = (
    quality: { id: string; name: string; karmaCost?: number; summary?: string },
    isPositive: boolean
  ) => {
    const cost = quality.karmaCost || 0;
    const isSelected = isPositive
      ? selectedPositive.includes(quality.id)
      : selectedNegative.includes(quality.id);

    const canSelect = isPositive
      ? canSpendMoreOnPositive && karmaRemaining >= cost
      : canTakeMoreNegative;

    return (
      <button
        key={quality.id}
        onClick={() =>
          isPositive ? togglePositiveQuality(quality.id) : toggleNegativeQuality(quality.id)
        }
        disabled={!isSelected && !canSelect}
        className={`group relative w-full rounded-lg border-2 p-4 text-left transition-all ${
          isSelected
            ? isPositive
              ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/30"
              : "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/30"
            : !canSelect
            ? "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-800/50"
            : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
        }`}
      >
        {/* Selection indicator */}
        {isSelected && (
          <div
            className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full ${
              isPositive ? "bg-emerald-500" : "bg-amber-500"
            }`}
          >
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* Quality name and cost */}
        <div className="flex items-start justify-between pr-8">
          <h4 className="font-medium text-zinc-900 dark:text-zinc-50">{quality.name}</h4>
          <span
            className={`ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
              isPositive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
            }`}
          >
            {isPositive ? `-${cost}` : `+${cost}`}
          </span>
        </div>

        {/* Summary */}
        {quality.summary && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{quality.summary}</p>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Karma summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Starting Karma</div>
          <div className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{startingKarma}</div>
        </div>
        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-emerald-700 dark:text-emerald-300">Positive Qualities</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400">(max {MAX_POSITIVE_KARMA})</div>
          </div>
          <div className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
            -{positiveKarmaSpent}
          </div>
        </div>
        <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-amber-700 dark:text-amber-300">Negative Qualities</div>
            <div className="text-xs text-amber-600 dark:text-amber-400">(max {MAX_NEGATIVE_KARMA})</div>
          </div>
          <div className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">
            +{negativeKarmaGained}
          </div>
        </div>
      </div>

      {/* Net karma */}
      <div
        className={`rounded-lg p-4 text-center ${
          karmaRemaining >= 0
            ? "bg-blue-50 dark:bg-blue-900/20"
            : "bg-red-50 dark:bg-red-900/20"
        }`}
      >
        <div
          className={`text-sm ${
            karmaRemaining >= 0
              ? "text-blue-700 dark:text-blue-300"
              : "text-red-700 dark:text-red-300"
          }`}
        >
          Available Karma for Other Purchases
        </div>
        <div
          className={`mt-1 text-3xl font-bold ${
            karmaRemaining >= 0
              ? "text-blue-700 dark:text-blue-300"
              : "text-red-700 dark:text-red-300"
          }`}
        >
          {karmaRemaining}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search qualities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setActiveTab("positive")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "positive"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          Positive ({filteredPositive.length})
          {selectedPositive.length > 0 && (
            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              {selectedPositive.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("negative")}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "negative"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          Negative ({filteredNegative.length})
          {selectedNegative.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              {selectedNegative.length}
            </span>
          )}
        </button>
      </div>

      {/* Quality list */}
      <div className="space-y-3">
        {activeTab === "positive"
          ? filteredPositive.map((q) => renderQuality(q, true))
          : filteredNegative.map((q) => renderQuality(q, false))}
      </div>

      {((activeTab === "positive" && filteredPositive.length === 0) ||
        (activeTab === "negative" && filteredNegative.length === 0)) && (
        <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No qualities match your search.
        </p>
      )}

      {/* Info */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <span className="font-medium">Positive qualities</span> cost karma and provide benefits.{" "}
          <span className="font-medium">Negative qualities</span> give you karma but impose restrictions or drawbacks.
          You can take up to {MAX_POSITIVE_KARMA} karma of each type at character creation.
        </p>
      </div>
    </div>
  );
}
