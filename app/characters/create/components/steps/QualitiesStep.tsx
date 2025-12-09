"use client";

import { useMemo, useCallback, useState } from "react";
import { useQualities } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { QualityData } from "@/lib/rules/loader";

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

  const qualityLevels = useMemo(() => {
    return (state.selections.qualityLevels || {}) as Record<string, number>;
  }, [state.selections.qualityLevels]);

  const qualitySpecifications = useMemo(() => {
    return (state.selections.qualitySpecifications || {}) as Record<string, string>;
  }, [state.selections.qualitySpecifications]);

  // Helper to get cost of a quality instance
  const getQualityCost = useCallback((quality: QualityData, id: string) => {
    // Check if it has levels
    if (quality.levels && quality.levels.length > 0) {
      const levelIdx = qualityLevels[id] || 1; // Default to level 1 (1-based index usually, but data is 1-based in array?)
      // Array in data: [{level:1}, {level:2}]
      const levelData = quality.levels.find(l => l.level === levelIdx);
      return levelData ? Math.abs(levelData.karma) : (quality.karmaCost || 0); // Karma in levels can be negative for negative qualities, we just want magnitude here usually?
      // Wait, positive qualities cost positive numbers. Negative qualities give positive numbers (as "bonus" in data logic usually, or just karmaCost).
      // In current code:
      // Positive: cost = quality.karmaCost
      // Negative: cost = quality.karmaCost || quality.karmaBonus
    }
    return (quality.karmaCost || quality.karmaBonus || 0);
  }, [qualityLevels]);

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

  const karmaRemaining = startingKarma + negativeKarmaGained - positiveKarmaSpent;
  const canTakeMoreNegative = negativeKarmaGained < MAX_NEGATIVE_KARMA;
  const canSpendMoreOnPositive = positiveKarmaSpent < MAX_POSITIVE_KARMA;

  // Filter qualities by search and flags
  const filterQualities = useCallback((qualities: QualityData[]) => {
    let filtered = qualities.filter(q => !q.isRacial); // Filter out racial qualities

    if (searchQuery) {
      filtered = filtered.filter((q) =>
        q.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [searchQuery]);

  const filteredPositive = useMemo(() => filterQualities(positiveQualities), [positiveQualities, filterQualities]);
  const filteredNegative = useMemo(() => filterQualities(negativeQualities), [negativeQualities, filterQualities]);

  const handleSelectionChange = useCallback((
    newSelectedPositive: string[],
    newSelectedNegative: string[],
    newLevels: Record<string, number>,
    newSpecs: Record<string, string>
  ) => {
    // Recalculate budgets locally to update state
    // (This is redundant if we assume generic update, but safe)
    const newPosSpent = newSelectedPositive.reduce((sum, id) => {
      const q = positiveQualities.find(x => x.id === id);
      if (!q) return sum;
      // Calculate cost based on newLevels if applicable
      let cost = q.karmaCost || 0;
      if (q.levels) {
        const lvl = newLevels[id] || 1;
        const lData = q.levels.find(l => l.level === lvl);
        if (lData) cost = Math.abs(lData.karma);
      }
      return sum + cost;
    }, 0);

    const newNegGained = newSelectedNegative.reduce((sum, id) => {
      const q = negativeQualities.find(x => x.id === id);
      if (!q) return sum;
      let cost = q.karmaCost || q.karmaBonus || 0;
      if (q.levels) {
        const lvl = newLevels[id] || 1;
        const lData = q.levels.find(l => l.level === lvl);
        if (lData) cost = Math.abs(lData.karma);
      }
      return sum + cost;
    }, 0);

    updateState({
      selections: {
        ...state.selections,
        positiveQualities: newSelectedPositive,
        negativeQualities: newSelectedNegative,
        qualityLevels: newLevels,
        qualitySpecifications: newSpecs
      },
      budgets: {
        ...state.budgets,
        "karma-spent-positive": newPosSpent,
        "karma-gained-negative": newNegGained
      }
    });
  }, [positiveQualities, negativeQualities, state.selections, state.budgets, updateState]);

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
      const newSpecs = { ...qualitySpecifications };

      if (isSelected) {
        // Deselect
        newSelected = newSelected.filter((id) => id !== qualityId);
        delete newLevels[qualityId];
        delete newSpecs[qualityId];
      } else {
        // Select
        // Pre-check limits
        const cost = getQualityCost(quality, qualityId); // Will use default level 1
        if (isPositive) {
          if (positiveKarmaSpent + cost > MAX_POSITIVE_KARMA) return;
          if (karmaRemaining < cost) return;
        } else {
          if (negativeKarmaGained + cost > MAX_NEGATIVE_KARMA) return;
        }

        newSelected.push(qualityId);
        if (quality.levels) {
          newLevels[qualityId] = 1; // Default
        }
      }

      if (isPositive) {
        handleSelectionChange(newSelected, selectedNegative, newLevels, newSpecs);
      } else {
        handleSelectionChange(selectedPositive, newSelected, newLevels, newSpecs);
      }
    },
    [positiveQualities, negativeQualities, selectedPositive, selectedNegative, qualityLevels, qualitySpecifications, positiveKarmaSpent, negativeKarmaGained, karmaRemaining, getQualityCost, handleSelectionChange]
  );

  const updateLevel = useCallback((id: string, level: number, isPositive: boolean) => {
    const newLevels = { ...qualityLevels, [id]: level };
    if (isPositive) {
      handleSelectionChange(selectedPositive, selectedNegative, newLevels, qualitySpecifications);
    } else {
      handleSelectionChange(selectedPositive, selectedNegative, newLevels, qualitySpecifications);
    }
  }, [qualityLevels, qualitySpecifications, selectedPositive, selectedNegative, handleSelectionChange]);

  const updateSpec = useCallback((id: string, spec: string, isPositive: boolean) => {
    const newSpecs = { ...qualitySpecifications, [id]: spec };
    if (isPositive) {
      handleSelectionChange(selectedPositive, selectedNegative, qualityLevels, newSpecs);
    } else {
      handleSelectionChange(selectedPositive, selectedNegative, qualityLevels, newSpecs);
    }
  }, [qualityLevels, qualitySpecifications, selectedPositive, selectedNegative, handleSelectionChange]);


  // Render quality card
  const renderQuality = (quality: QualityData, isPositive: boolean) => {
    const isSelected = isPositive
      ? selectedPositive.includes(quality.id)
      : selectedNegative.includes(quality.id);

    const cost = getQualityCost(quality, quality.id); // Valid calculation for display? 
    // If not selected, shows base cost (level 1). If selected, shows actual cost.

    const canSelect = isPositive
      ? canSpendMoreOnPositive && karmaRemaining >= cost
      : canTakeMoreNegative;

    return (
      <div
        key={quality.id}
        className={`group relative w-full rounded-lg border-2 p-4 transition-all ${isSelected
          ? isPositive
            ? "border-emerald-500 bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-900/30"
            : "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/30"
          : !canSelect
            ? "border-zinc-200 bg-zinc-50 opacity-70 dark:border-zinc-700 dark:bg-zinc-800/50"
            : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
          }`}
      >
        <div
          className="cursor-pointer"
          onClick={() => toggleQuality(quality.id, isPositive)}
        >
          {/* Selection indicator */}
          {isSelected && (
            <div
              className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full ${isPositive ? "bg-emerald-500" : "bg-amber-500"
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
              className={`ml-2 flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${isPositive
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
        </div>

        {/* Extended Inputs (Levels/Specs) - only if selected */}
        {isSelected && (
          <div className="mt-4 space-y-3 border-t border-zinc-200/50 pt-3 dark:border-zinc-700/50">
            {/* Levels Selector */}
            {quality.levels && (
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Level</label>
                <div className="flex flex-wrap gap-2">
                  {quality.levels.map((lvl) => (
                    <button
                      key={lvl.level}
                      onClick={() => updateLevel(quality.id, lvl.level, isPositive)}
                      className={`rounded px-2 py-1 text-xs font-medium transition-colors ${qualityLevels[quality.id] === lvl.level
                        ? isPositive
                          ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                          : "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                        }`}
                    >
                      {lvl.name} ({lvl.karma > 0 && !isPositive ? "+" : ""}{isPositive ? -Math.abs(lvl.karma) : Math.abs(lvl.karma)})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specification Input */}
            {quality.requiresSpecification && (
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {quality.specificationLabel || "Specification"}
                </label>
                <input
                  type="text"
                  value={qualitySpecifications[quality.id] || ""}
                  onChange={(e) => updateSpec(quality.id, e.target.value, isPositive)}
                  className="w-full rounded border border-zinc-300 bg-white px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                  placeholder={quality.specificationLabel ? `e.g. ${quality.specificationLabel}` : "Specify..."}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Karma summary (unchanged) */}
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
        className={`rounded-lg p-4 text-center ${karmaRemaining >= 0
          ? "bg-blue-50 dark:bg-blue-900/20"
          : "bg-red-50 dark:bg-red-900/20"
          }`}
      >
        <div
          className={`text-sm ${karmaRemaining >= 0
            ? "text-blue-700 dark:text-blue-300"
            : "text-red-700 dark:text-red-300"
            }`}
        >
          Available Karma for Other Purchases
        </div>
        <div
          className={`mt-1 text-3xl font-bold ${karmaRemaining >= 0
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
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "positive"
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
          className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === "negative"
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
