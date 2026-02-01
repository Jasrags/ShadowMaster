"use client";

/**
 * QualitiesCard
 *
 * Card for quality selection in sheet-driven creation.
 *
 * Features:
 * - Dual budget progress bars (Positive costs / Negative gains)
 * - Single [+ Add] button in header opens unified modal
 * - Selected qualities as removable cards with descriptions
 * - Unified modal selection with type toggle, search, and category grouping
 * - Specification selection for qualities that require it
 * - Level selection for leveled qualities
 */

import { useMemo, useCallback, useState } from "react";
import { useQualities, useSkills } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import type { QualityData } from "@/lib/rules/loader-types";
import { hasUnifiedRatings, getRatingTableValue } from "@/lib/types/ratings";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator, SummaryFooter } from "../shared";
import { Plus } from "lucide-react";
import { MAX_POSITIVE_KARMA, MAX_NEGATIVE_KARMA } from "./constants";
import { SelectedQualityCard } from "./SelectedQualityCard";
import { QualitySelectionModal } from "./QualitySelectionModal";
import type { SelectedQuality } from "./types";

interface QualitiesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export function QualitiesCard({ state, updateState }: QualitiesCardProps) {
  const { positive: positiveQualities, negative: negativeQualities } = useQualities();
  const { skillGroups } = useSkills();
  const { getBudget } = useCreationBudgets();
  const karmaBudget = getBudget("karma");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get existing skill and skill group selections for cross-validation
  const existingSkillIds = useMemo(() => {
    const skills = state.selections.skills;
    if (!skills || typeof skills !== "object") return [];
    return Object.keys(skills as Record<string, number>);
  }, [state.selections.skills]);

  const existingSkillGroupIds = useMemo(() => {
    const groups = state.selections.skillGroups;
    if (!groups || typeof groups !== "object") return [];
    return Object.keys(groups as Record<string, number>);
  }, [state.selections.skillGroups]);

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
  const getSelectionCost = useCallback((selection: SelectedQuality, qualityList: QualityData[]) => {
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
  }, []);

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

  // Open modal
  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Add a quality (callback from modal)
  // Phase 4.2: Store karma in each selection, context derives totals from selections
  const handleAddQuality = useCallback(
    (qualityId: string, isPositive: boolean, specification?: string, level?: number) => {
      const qualityList = isPositive ? positiveQualities : negativeQualities;

      // Create selection with karma value stored
      const newSelection: SelectedQuality = { id: qualityId };
      if (specification) newSelection.specification = specification;
      if (level) newSelection.level = level;

      // Calculate and store karma for this selection
      newSelection.karma = getSelectionCost(newSelection, qualityList);

      const currentList = isPositive ? selectedPositive : selectedNegative;
      const newList = [...currentList, newSelection];

      // Only update selections - context derives karma from selection karma values
      updateState({
        selections: {
          ...state.selections,
          positiveQualities: isPositive ? newList : selectedPositive,
          negativeQualities: isPositive ? selectedNegative : newList,
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
      updateState,
    ]
  );

  // Remove a quality
  // Phase 4.2: Only update selections, context derives karma totals
  const handleRemoveQuality = useCallback(
    (qualityId: string, isPositive: boolean) => {
      const currentList = isPositive ? selectedPositive : selectedNegative;
      const newList = currentList.filter((sel) => sel.id !== qualityId);

      // Only update selections - context derives karma from selection karma values
      updateState({
        selections: {
          ...state.selections,
          positiveQualities: isPositive ? newList : selectedPositive,
          negativeQualities: isPositive ? selectedNegative : newList,
        },
      });
    },
    [selectedPositive, selectedNegative, state.selections, updateState]
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
      status={validationStatus}
      headerAction={
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      }
    >
      <div className="space-y-3">
        {/* Budget indicators */}
        <div className="grid gap-3 sm:grid-cols-2">
          <BudgetIndicator
            label="Positive Qualities"
            tooltip="Cost karma to acquire (max 25)"
            spent={positiveKarmaSpent}
            total={MAX_POSITIVE_KARMA}
            variant="positive"
            mode="compact"
          />
          <BudgetIndicator
            label="Negative Qualities"
            tooltip="Grant karma when taken (max 25)"
            spent={negativeKarmaGained}
            total={MAX_NEGATIVE_KARMA}
            variant="negative"
            mode="compact"
          />
        </div>

        {/* Positive Qualities Section */}
        <div>
          <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Positive Qualities
          </h4>
          {selectedPositive.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                No positive qualities selected
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
              {selectedPositive.map((selection) => {
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
              })}
            </div>
          )}
        </div>

        {/* Negative Qualities Section */}
        <div>
          <h4 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Negative Qualities
          </h4>
          {selectedNegative.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                No negative qualities selected
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
              {selectedNegative.map((selection) => {
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
              })}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <SummaryFooter
          count={selectedPositive.length + selectedNegative.length}
          total={`${karmaBalance} karma`}
          label="quality"
        />
      </div>

      {/* Unified Modal */}
      <QualitySelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType="positive"
        positiveQualities={positiveQualities}
        negativeQualities={negativeQualities}
        selectedPositiveIds={selectedPositive.map((s) => s.id)}
        selectedNegativeIds={selectedNegative.map((s) => s.id)}
        positiveKarmaUsed={positiveKarmaSpent}
        negativeKarmaUsed={negativeKarmaGained}
        maxPositiveKarma={MAX_POSITIVE_KARMA}
        maxNegativeKarma={MAX_NEGATIVE_KARMA}
        karmaBalance={karmaBalance}
        onAdd={handleAddQuality}
        skillGroups={skillGroups}
        existingSkillIds={existingSkillIds}
        existingSkillGroupIds={existingSkillGroupIds}
      />
    </CreationCard>
  );
}
