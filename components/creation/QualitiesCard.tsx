"use client";

/**
 * QualitiesCard
 *
 * Card for quality selection in sheet-driven creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
 *
 * Features:
 * - Dual budget progress bars (Positive costs / Negative gains)
 * - Two sections with [+ Add] buttons
 * - Selected qualities as removable cards with descriptions
 * - Modal selection with search and category grouping
 * - Specification selection for qualities that require it
 * - Level selection for leveled qualities
 */

import { useMemo, useCallback, useState } from "react";
import { useQualities } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader-types";
import { hasUnifiedRatings, getRatingTableValue, getAvailableRatings } from "@/lib/types/ratings";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "./shared";
import { Plus, Search, AlertTriangle, X, Check, ChevronDown } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_POSITIVE_KARMA = 25;
const MAX_NEGATIVE_KARMA = 25;

// Categories for grouping qualities in the modal
const QUALITY_CATEGORIES = ["physical", "mental", "social", "magical", "other"] as const;
type QualityCategory = (typeof QUALITY_CATEGORIES)[number];

const CATEGORY_LABELS: Record<QualityCategory, string> = {
  physical: "Physical",
  mental: "Mental",
  social: "Social",
  magical: "Magical",
  other: "Other",
};

// Map quality tags to categories
function getQualityCategory(quality: QualityData): QualityCategory {
  const name = quality.name.toLowerCase();
  const summary = (quality.summary || "").toLowerCase();

  // Magic-related
  if (quality.requiresMagic || name.includes("astral") || name.includes("magic") || name.includes("spirit")) {
    return "magical";
  }

  // Physical traits
  if (
    name.includes("ambidextrous") ||
    name.includes("catlike") ||
    name.includes("double-jointed") ||
    name.includes("pain") ||
    name.includes("natural") ||
    name.includes("allergy") ||
    name.includes("addiction") ||
    summary.includes("physical") ||
    summary.includes("body")
  ) {
    return "physical";
  }

  // Mental traits
  if (
    name.includes("analytical") ||
    name.includes("codeslinger") ||
    name.includes("photographic") ||
    name.includes("aptitude") ||
    name.includes("exceptional") ||
    summary.includes("logic") ||
    summary.includes("memory") ||
    summary.includes("mental")
  ) {
    return "mental";
  }

  // Social traits
  if (
    name.includes("first impression") ||
    name.includes("blandness") ||
    name.includes("sinner") ||
    name.includes("prejudiced") ||
    name.includes("fame") ||
    summary.includes("social") ||
    summary.includes("charisma")
  ) {
    return "social";
  }

  return "other";
}

interface QualitiesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

interface SelectedQuality {
  id: string;
  specification?: string;
  level?: number;
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
    <div
      className={`rounded-lg border p-3 ${
        isOver
          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</div>
        <div
          className={`text-lg font-bold ${
            isOver
              ? "text-red-600 dark:text-red-400"
              : remaining === 0
              ? "text-emerald-600 dark:text-emerald-400"
              : isPositive
              ? "text-blue-600 dark:text-blue-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {used}
        </div>
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {description}
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
// SELECTED QUALITY CARD COMPONENT
// =============================================================================

function SelectedQualityCard({
  quality,
  selection,
  isPositive,
  cost,
  onRemove,
}: {
  quality: QualityData;
  selection: SelectedQuality;
  isPositive: boolean;
  cost: number;
  onRemove: () => void;
}) {
  // Get level name if quality has named levels (legacy format only)
  // Unified ratings don't have named levels, just numeric ratings
  const levelName = selection.level && quality.levels
    ? quality.levels.find((l) => l.level === selection.level)?.name
    : null;

  const displayName = selection.specification
    ? `${quality.name} (${selection.specification})`
    : selection.level
    ? `${quality.name} (${levelName || `Rating ${selection.level}`})`
    : quality.name;

  return (
    <div
      className={`rounded-lg border p-3 ${
        isPositive
          ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
          : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {displayName}
            </span>
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {isPositive ? `${cost} karma` : `+${cost} karma`}
            </span>
          </div>

          {/* Description */}
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{quality.summary}</p>

          {/* Specification display */}
          {selection.specification && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              {quality.specificationLabel}: {selection.specification}
            </p>
          )}
        </div>

        <button
          onClick={onRemove}
          className="ml-2 text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
          title="Remove quality"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// QUALITY SELECTION MODAL
// =============================================================================

function QualitySelectionModal({
  isOpen,
  onClose,
  isPositive,
  qualities,
  selectedIds,
  usedKarma,
  maxKarma,
  karmaBalance,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  isPositive: boolean;
  qualities: QualityData[];
  selectedIds: string[];
  usedKarma: number;
  maxKarma: number;
  karmaBalance: number;
  onAdd: (qualityId: string, specification?: string, level?: number) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQualityId, setSelectedQualityId] = useState<string | null>(null);
  const [specification, setSpecification] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);

  const selectedQuality = selectedQualityId
    ? qualities.find((q) => q.id === selectedQualityId)
    : null;

  // Filter and group qualities by category
  const filteredQualities = useMemo(() => {
    let filtered = qualities.filter((q) => !q.isRacial && !selectedIds.includes(q.id));
    if (searchQuery) {
      filtered = filtered.filter((q) => q.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  }, [qualities, selectedIds, searchQuery]);

  const qualitiesByCategory = useMemo(() => {
    const grouped: Record<QualityCategory, QualityData[]> = {
      physical: [],
      mental: [],
      social: [],
      magical: [],
      other: [],
    };
    filteredQualities.forEach((q) => {
      const category = getQualityCategory(q);
      grouped[category].push(q);
    });
    return grouped;
  }, [filteredQualities]);

  const remainingKarma = maxKarma - usedKarma;

  // Get cost for a quality at a specific level
  // Supports unified ratings table (preferred) and legacy levels array
  const getQualityCost = (quality: QualityData, level?: number): number => {
    // Check unified ratings table first
    if (hasUnifiedRatings(quality)) {
      const ratingValue = getRatingTableValue(quality, level || 1);
      if (ratingValue?.karmaCost !== undefined) {
        return Math.abs(ratingValue.karmaCost);
      }
    }

    // Fall back to legacy levels array
    if (quality.levels && quality.levels.length > 0) {
      const levelData = quality.levels.find((l) => l.level === (level || 1));
      return levelData ? Math.abs(levelData.karma) : quality.karmaCost || 0;
    }

    return quality.karmaCost || quality.karmaBonus || 0;
  };

  // Check if quality has levels (unified or legacy)
  const hasLevels = (quality: QualityData): boolean => {
    if (hasUnifiedRatings(quality)) return true;
    return !!(quality.levels && quality.levels.length > 0);
  };

  // Get available levels for a quality (unified or legacy)
  const getQualityLevels = (quality: QualityData): Array<{ level: number; name?: string; karma: number }> => {
    // Check unified ratings first
    if (hasUnifiedRatings(quality)) {
      const ratings = getAvailableRatings(quality);
      return ratings.map((rating) => {
        const ratingValue = getRatingTableValue(quality, rating);
        return {
          level: rating,
          name: undefined, // Unified ratings don't have named levels
          karma: ratingValue?.karmaCost ?? 0,
        };
      });
    }

    // Fall back to legacy levels
    if (quality.levels && quality.levels.length > 0) {
      return quality.levels.map((l) => ({
        level: l.level,
        name: l.name,
        karma: l.karma,
      }));
    }

    return [];
  };

  const handleSelectQuality = (qualityId: string) => {
    const quality = qualities.find((q) => q.id === qualityId);
    setSelectedQualityId(qualityId);
    setSpecification("");
    setSelectedLevel(1);

    // If no specification or levels needed, we can add immediately
    if (quality && !quality.requiresSpecification && !hasLevels(quality)) {
      // Will add on confirm
    }
  };

  const handleAdd = () => {
    if (!selectedQuality) return;

    const needsSpec = selectedQuality.requiresSpecification && !specification;
    if (needsSpec) return;

    onAdd(
      selectedQuality.id,
      specification || undefined,
      hasLevels(selectedQuality) ? selectedLevel : undefined
    );
    setSelectedQualityId(null);
    setSpecification("");
    setSelectedLevel(1);
    onClose();
  };

  const canAdd = useMemo(() => {
    if (!selectedQuality) return false;
    if (selectedQuality.requiresSpecification && !specification) return false;

    const cost = getQualityCost(selectedQuality, selectedLevel);
    if (isPositive) {
      return usedKarma + cost <= maxKarma && karmaBalance >= cost;
    }
    return usedKarma + cost <= maxKarma;
  }, [selectedQuality, specification, selectedLevel, isPositive, usedKarma, maxKarma, karmaBalance]);

  const selectedCost = selectedQuality ? getQualityCost(selectedQuality, selectedLevel) : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Add {isPositive ? "Positive" : "Negative"} Quality
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search and budget info */}
        <div className="shrink-0 border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search qualities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {remainingKarma} karma available for {isPositive ? "positive" : "negative"} qualities (
            {usedKarma} of {maxKarma} max used)
          </p>
        </div>

        {/* Quality list - scrollable */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {QUALITY_CATEGORIES.filter((cat) => qualitiesByCategory[cat].length > 0).map(
            (category) => (
              <div key={category} className="mb-4">
                <h4 className="mb-2 border-b border-zinc-200 pb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  {CATEGORY_LABELS[category]}
                </h4>
                <div className="space-y-2">
                  {qualitiesByCategory[category].map((quality) => {
                    const cost = getQualityCost(quality, 1);
                    const canAfford = isPositive
                      ? usedKarma + cost <= maxKarma && karmaBalance >= cost
                      : usedKarma + cost <= maxKarma;
                    const isSelected = selectedQualityId === quality.id;

                    return (
                      <button
                        key={quality.id}
                        onClick={() => handleSelectQuality(quality.id)}
                        disabled={!canAfford && !isSelected}
                        className={`w-full rounded-lg border p-3 text-left transition-all ${
                          isSelected
                            ? isPositive
                              ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30"
                              : "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/30"
                            : canAfford
                            ? "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                            : "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
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
                            {hasLevels(quality) && (
                              <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                                levels
                              </span>
                            )}
                            {quality.requiresSpecification && (
                              <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                                requires choice
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isPositive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {isPositive ? `${cost} karma` : `+${cost} karma`}
                          </span>
                        </div>
                        <p className="mt-1 pl-7 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {quality.summary}
                        </p>
                        {!canAfford && !isSelected && (
                          <p className="mt-1 pl-7 text-xs text-amber-600 dark:text-amber-400">
                            Exceeds budget
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>

        {/* Specification/Level selection (if needed) */}
        {selectedQuality && (selectedQuality.requiresSpecification || hasLevels(selectedQuality)) && (
          <div className="shrink-0 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
            {selectedQuality.requiresSpecification && (
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {selectedQuality.specificationLabel || "Specification"}
                </label>
                {selectedQuality.specificationOptions ? (
                  <div className="relative">
                    <select
                      value={specification}
                      onChange={(e) => setSpecification(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-zinc-300 py-2 pl-3 pr-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      <option value="">Select {selectedQuality.specificationLabel}...</option>
                      {selectedQuality.specificationOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={specification}
                    onChange={(e) => setSpecification(e.target.value)}
                    placeholder={`Enter ${selectedQuality.specificationLabel || "specification"}...`}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                )}
              </div>
            )}

            {hasLevels(selectedQuality) && (() => {
              const levels = getQualityLevels(selectedQuality);
              const hasNamedLevels = levels.some((l) => l.name);

              return (
                <div>
                  <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {/* Use "Option" for qualities with named levels, "Rating" otherwise */}
                    {hasNamedLevels ? "Option" : "Rating"}
                  </label>
                  {/* Use dropdown for qualities with named levels or many levels */}
                  {hasNamedLevels || levels.length > 4 ? (
                    <div className="relative">
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                        className="w-full appearance-none rounded-lg border border-zinc-300 py-2 pl-3 pr-10 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                      >
                        {levels.map((level) => {
                          const levelCost = Math.abs(level.karma);
                          const canAffordLevel = isPositive
                            ? usedKarma + levelCost <= maxKarma && karmaBalance >= levelCost
                            : usedKarma + levelCost <= maxKarma;

                          return (
                            <option
                              key={level.level}
                              value={level.level}
                              disabled={!canAffordLevel}
                            >
                              {level.name || `Rating ${level.level}`} ({isPositive ? levelCost : `+${levelCost}`} karma)
                              {!canAffordLevel ? " - cannot afford" : ""}
                            </option>
                          );
                        })}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {levels.map((level) => {
                        const levelCost = Math.abs(level.karma);
                        const canAffordLevel = isPositive
                          ? usedKarma + levelCost <= maxKarma && karmaBalance >= levelCost
                          : usedKarma + levelCost <= maxKarma;

                        return (
                          <button
                            key={level.level}
                            onClick={() => setSelectedLevel(level.level)}
                            disabled={!canAffordLevel}
                            className={`flex-1 rounded-lg border px-3 py-2 text-center transition-colors ${
                              selectedLevel === level.level
                                ? isPositive
                                  ? "border-blue-400 bg-blue-100 text-blue-700 dark:border-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                                  : "border-amber-400 bg-amber-100 text-amber-700 dark:border-amber-600 dark:bg-amber-900/50 dark:text-amber-300"
                                : canAffordLevel
                                ? "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                                : "cursor-not-allowed border-zinc-200 opacity-50 dark:border-zinc-700"
                            }`}
                          >
                            <div className="text-sm font-medium">{level.level}</div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              {isPositive ? `${levelCost}` : `+${levelCost}`} karma
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {selectedQuality ? (
              <>
                Selected: {selectedQuality.name} (
                {isPositive ? `${selectedCost} karma` : `+${selectedCost} karma`})
              </>
            ) : (
              "Select a quality to add"
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                canAdd
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
              }`}
            >
              Add Quality
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function QualitiesCard({ state, updateState }: QualitiesCardProps) {
  const { positive: positiveQualities, negative: negativeQualities } = useQualities();
  const { getBudget } = useCreationBudgets();
  const karmaBudget = getBudget("karma");

  const [showPositiveModal, setShowPositiveModal] = useState(false);
  const [showNegativeModal, setShowNegativeModal] = useState(false);

  // Get selected qualities from state (now stored with specifications/levels)
  const selectedPositive = useMemo(() => {
    const selections = state.selections.positiveQualities;
    if (!selections) return [];
    // Handle both old format (string[]) and new format (SelectedQuality[])
    if (Array.isArray(selections) && typeof selections[0] === "string") {
      return (selections as string[]).map((id) => ({ id }));
    }
    return selections as SelectedQuality[];
  }, [state.selections.positiveQualities]);

  const selectedNegative = useMemo(() => {
    const selections = state.selections.negativeQualities;
    if (!selections) return [];
    if (Array.isArray(selections) && typeof selections[0] === "string") {
      return (selections as string[]).map((id) => ({ id }));
    }
    return selections as SelectedQuality[];
  }, [state.selections.negativeQualities]);

  // Get cost of a quality selection
  // Supports unified ratings table (preferred) and legacy levels array
  const getSelectionCost = useCallback(
    (selection: SelectedQuality, qualityList: QualityData[]) => {
      const quality = qualityList.find((q) => q.id === selection.id);
      if (!quality) return 0;

      // Check unified ratings table first
      if (hasUnifiedRatings(quality) && selection.level) {
        const ratingValue = getRatingTableValue(quality, selection.level);
        if (ratingValue?.karmaCost !== undefined) {
          return Math.abs(ratingValue.karmaCost);
        }
      }

      // Fall back to legacy levels array
      if (quality.levels && selection.level) {
        const levelData = quality.levels.find((l) => l.level === selection.level);
        return levelData ? Math.abs(levelData.karma) : quality.karmaCost || 0;
      }

      return quality.karmaCost || quality.karmaBonus || 0;
    },
    []
  );

  // Calculate karma spent/gained
  const positiveKarmaSpent = useMemo(() => {
    return selectedPositive.reduce((sum, sel) => sum + getSelectionCost(sel, positiveQualities), 0);
  }, [selectedPositive, positiveQualities, getSelectionCost]);

  const negativeKarmaGained = useMemo(() => {
    return selectedNegative.reduce((sum, sel) => sum + getSelectionCost(sel, negativeQualities), 0);
  }, [selectedNegative, negativeQualities, getSelectionCost]);

  const startingKarma = karmaBudget?.total || 25;
  const karmaBalance = startingKarma + negativeKarmaGained - positiveKarmaSpent;
  const isPositiveOver = positiveKarmaSpent > MAX_POSITIVE_KARMA;
  const isNegativeOver = negativeKarmaGained > MAX_NEGATIVE_KARMA;

  // Add a quality
  const handleAddQuality = useCallback(
    (qualityId: string, isPositive: boolean, specification?: string, level?: number) => {
      const newSelection: SelectedQuality = { id: qualityId };
      if (specification) newSelection.specification = specification;
      if (level) newSelection.level = level;

      const currentList = isPositive ? selectedPositive : selectedNegative;
      const newList = [...currentList, newSelection];

      // Calculate new karma values
      const qualityList = isPositive ? positiveQualities : negativeQualities;
      const newKarma = newList.reduce((sum, sel) => sum + getSelectionCost(sel, qualityList), 0);

      updateState({
        selections: {
          ...state.selections,
          positiveQualities: isPositive ? newList : selectedPositive,
          negativeQualities: isPositive ? selectedNegative : newList,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-positive": isPositive ? newKarma : positiveKarmaSpent,
          "karma-gained-negative": isPositive ? negativeKarmaGained : newKarma,
        },
      });
    },
    [
      selectedPositive,
      selectedNegative,
      positiveQualities,
      negativeQualities,
      getSelectionCost,
      state.selections,
      state.budgets,
      positiveKarmaSpent,
      negativeKarmaGained,
      updateState,
    ]
  );

  // Remove a quality
  const handleRemoveQuality = useCallback(
    (qualityId: string, isPositive: boolean) => {
      const currentList = isPositive ? selectedPositive : selectedNegative;
      const newList = currentList.filter((sel) => sel.id !== qualityId);

      const qualityList = isPositive ? positiveQualities : negativeQualities;
      const newKarma = newList.reduce((sum, sel) => sum + getSelectionCost(sel, qualityList), 0);

      updateState({
        selections: {
          ...state.selections,
          positiveQualities: isPositive ? newList : selectedPositive,
          negativeQualities: isPositive ? selectedNegative : newList,
        },
        budgets: {
          ...state.budgets,
          "karma-spent-positive": isPositive ? newKarma : positiveKarmaSpent,
          "karma-gained-negative": isPositive ? negativeKarmaGained : newKarma,
        },
      });
    },
    [
      selectedPositive,
      selectedNegative,
      positiveQualities,
      negativeQualities,
      getSelectionCost,
      state.selections,
      state.budgets,
      positiveKarmaSpent,
      negativeKarmaGained,
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

        {/* Positive Qualities Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Positive Qualities
            </h4>
            <button
              onClick={() => setShowPositiveModal(true)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {selectedPositive.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No positive qualities selected.</p>
            ) : (
              selectedPositive.map((selection) => {
                const quality = positiveQualities.find((q) => q.id === selection.id);
                if (!quality) return null;
                const cost = getSelectionCost(selection, positiveQualities);

                return (
                  <SelectedQualityCard
                    key={selection.id}
                    quality={quality}
                    selection={selection}
                    isPositive={true}
                    cost={cost}
                    onRemove={() => handleRemoveQuality(selection.id, true)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Negative Qualities Section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Negative Qualities
            </h4>
            <button
              onClick={() => setShowNegativeModal(true)}
              className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {selectedNegative.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No negative qualities selected.</p>
            ) : (
              selectedNegative.map((selection) => {
                const quality = negativeQualities.find((q) => q.id === selection.id);
                if (!quality) return null;
                const cost = getSelectionCost(selection, negativeQualities);

                return (
                  <SelectedQualityCard
                    key={selection.id}
                    quality={quality}
                    selection={selection}
                    isPositive={false}
                    cost={cost}
                    onRemove={() => handleRemoveQuality(selection.id, false)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Karma balance summary */}
        <div className="rounded-lg bg-zinc-100 p-3 text-center dark:bg-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Karma Balance</div>
          <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
            {startingKarma} (starting) − {positiveKarmaSpent} (positive) + {negativeKarmaGained}{" "}
            (negative) ={" "}
            <span
              className={`font-bold ${
                karmaBalance >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {karmaBalance} karma
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QualitySelectionModal
        isOpen={showPositiveModal}
        onClose={() => setShowPositiveModal(false)}
        isPositive={true}
        qualities={positiveQualities}
        selectedIds={selectedPositive.map((s) => s.id)}
        usedKarma={positiveKarmaSpent}
        maxKarma={MAX_POSITIVE_KARMA}
        karmaBalance={karmaBalance}
        onAdd={(id, spec, level) => handleAddQuality(id, true, spec, level)}
      />

      <QualitySelectionModal
        isOpen={showNegativeModal}
        onClose={() => setShowNegativeModal(false)}
        isPositive={false}
        qualities={negativeQualities}
        selectedIds={selectedNegative.map((s) => s.id)}
        usedKarma={negativeKarmaGained}
        maxKarma={MAX_NEGATIVE_KARMA}
        karmaBalance={karmaBalance}
        onAdd={(id, spec, level) => handleAddQuality(id, false, spec, level)}
      />
    </CreationCard>
  );
}
