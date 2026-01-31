"use client";

/**
 * KnowledgeLanguagesCard
 *
 * Card for knowledge skills and language allocation in sheet-driven creation.
 *
 * Features:
 * - Knowledge points budget based on (INT + LOG) × 2
 * - Languages section with native and learned languages
 * - Knowledge skills grouped by category
 * - Add modals for new languages and knowledge skills
 */

import { useMemo, useCallback, useState } from "react";
import type { CreationState, KnowledgeSkill, LanguageSkill } from "@/lib/types";
import { CreationCard, BudgetIndicator, SummaryFooter } from "../shared";
import { Plus } from "lucide-react";
import { MAX_SKILL_RATING } from "./constants";
import type { KnowledgeCategory } from "./types";
import { LanguageRow } from "./LanguageRow";
import { KnowledgeSkillRow } from "./KnowledgeSkillRow";
import { AddLanguageModal } from "./AddLanguageModal";
import { AddKnowledgeSkillModal } from "./AddKnowledgeSkillModal";
import { KnowledgeSkillSpecModal } from "./KnowledgeSkillSpecModal";
import { SPEC_KNOWLEDGE_POINT_COST } from "./constants";

interface KnowledgeLanguagesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export function KnowledgeLanguagesCard({ state, updateState }: KnowledgeLanguagesCardProps) {
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);
  const [specModalSkillIndex, setSpecModalSkillIndex] = useState<number | null>(null);

  // Get attributes for knowledge points calculation
  const attributes = useMemo(() => {
    return (state.selections.attributes || {}) as Record<string, number>;
  }, [state.selections.attributes]);

  const intuition = attributes.intuition || 1;
  const logic = attributes.logic || 1;

  // Knowledge points = (INT + LOG) × 2
  const knowledgePointsTotal = (intuition + logic) * 2;

  // Get current languages and knowledge skills from state
  const languages = useMemo(() => {
    return (state.selections.languages || []) as LanguageSkill[];
  }, [state.selections.languages]);

  const knowledgeSkills = useMemo(() => {
    return (state.selections.knowledgeSkills || []) as KnowledgeSkill[];
  }, [state.selections.knowledgeSkills]);

  // Calculate points spent (languages + knowledge skills ratings + specializations)
  // Native language is free
  const knowledgePointsSpent = useMemo(() => {
    const langPoints = languages.filter((l) => !l.isNative).reduce((sum, l) => sum + l.rating, 0);
    const skillPoints = knowledgeSkills.reduce((sum, s) => sum + s.rating, 0);
    const specPoints =
      knowledgeSkills.filter((s) => s.specialization).length * SPEC_KNOWLEDGE_POINT_COST;
    return langPoints + skillPoints + specPoints;
  }, [languages, knowledgeSkills]);

  const knowledgePointsRemaining = knowledgePointsTotal - knowledgePointsSpent;
  const isOverBudget = knowledgePointsRemaining < 0;

  // Handle language rating change
  const handleLanguageRatingChange = useCallback(
    (index: number, delta: number) => {
      const newLanguages = [...languages];
      const lang = newLanguages[index];
      if (lang.isNative) return;

      const newRating = lang.rating + delta;
      if (newRating < 1 || newRating > MAX_SKILL_RATING) return;

      newLanguages[index] = { ...lang, rating: newRating };
      updateState({
        selections: {
          ...state.selections,
          languages: newLanguages,
        },
      });
    },
    [languages, state.selections, updateState]
  );

  // Handle remove language (including native languages)
  const handleRemoveLanguage = useCallback(
    (index: number) => {
      const newLanguages = languages.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          languages: newLanguages,
        },
      });
    },
    [languages, state.selections, updateState]
  );

  // Handle add language
  const handleAddLanguage = useCallback(
    (name: string, rating: number, isNative: boolean) => {
      const newLanguage: LanguageSkill = {
        name,
        rating: isNative ? 0 : rating, // Native languages have no rating
        isNative,
      };
      updateState({
        selections: {
          ...state.selections,
          languages: [...languages, newLanguage],
        },
      });
    },
    [languages, state.selections, updateState]
  );

  // Check if character has Bilingual quality (allows 2 native languages)
  const hasBilingualQuality = useMemo(() => {
    // Qualities are stored separately as positiveQualities and negativeQualities
    // Bilingual is a positive quality
    const positiveQualities = state.selections.positiveQualities;
    if (!positiveQualities || !Array.isArray(positiveQualities)) return false;
    // Handle both old format (string[]) and new format (SelectedQuality[])
    return positiveQualities.some((q) => {
      if (typeof q === "string") return q === "bilingual";
      return q.id === "bilingual";
    });
  }, [state.selections.positiveQualities]);

  // Count native languages and check if max reached
  const nativeLanguageCount = useMemo(() => {
    return languages.filter((l) => l.isNative).length;
  }, [languages]);

  // Max native languages: 2 if Bilingual, 1 otherwise
  const maxNativeLanguages = hasBilingualQuality ? 2 : 1;
  const hasMaxNativeLanguages = nativeLanguageCount >= maxNativeLanguages;

  // Handle knowledge skill rating change
  const handleKnowledgeRatingChange = useCallback(
    (index: number, delta: number) => {
      const newSkills = [...knowledgeSkills];
      const skill = newSkills[index];

      const newRating = skill.rating + delta;
      if (newRating < 1 || newRating > MAX_SKILL_RATING) return;

      newSkills[index] = { ...skill, rating: newRating };
      updateState({
        selections: {
          ...state.selections,
          knowledgeSkills: newSkills,
        },
      });
    },
    [knowledgeSkills, state.selections, updateState]
  );

  // Handle remove knowledge skill
  const handleRemoveKnowledge = useCallback(
    (index: number) => {
      const newSkills = knowledgeSkills.filter((_, i) => i !== index);
      updateState({
        selections: {
          ...state.selections,
          knowledgeSkills: newSkills,
        },
      });
    },
    [knowledgeSkills, state.selections, updateState]
  );

  // Handle add knowledge skill
  const handleAddKnowledge = useCallback(
    (name: string, category: KnowledgeCategory, rating: number, specialization?: string) => {
      const newSkill: KnowledgeSkill = {
        name,
        category,
        rating,
        ...(specialization && { specialization }),
      };
      updateState({
        selections: {
          ...state.selections,
          knowledgeSkills: [...knowledgeSkills, newSkill],
        },
      });
    },
    [knowledgeSkills, state.selections, updateState]
  );

  // Handle open specialization modal
  const handleOpenSpecModal = useCallback((index: number) => {
    setSpecModalSkillIndex(index);
  }, []);

  // Handle add specialization to a knowledge skill
  const handleAddSpecialization = useCallback(
    (spec: string) => {
      if (specModalSkillIndex === null) return;
      const newSkills = [...knowledgeSkills];
      newSkills[specModalSkillIndex] = {
        ...newSkills[specModalSkillIndex],
        specialization: spec,
      };
      updateState({
        selections: {
          ...state.selections,
          knowledgeSkills: newSkills,
        },
      });
      setSpecModalSkillIndex(null);
    },
    [specModalSkillIndex, knowledgeSkills, state.selections, updateState]
  );

  // Handle remove specialization from a knowledge skill
  const handleRemoveSpecialization = useCallback(
    (index: number) => {
      const newSkills = [...knowledgeSkills];
      const { specialization: _, ...skillWithoutSpec } = newSkills[index];
      newSkills[index] = skillWithoutSpec as KnowledgeSkill;
      updateState({
        selections: {
          ...state.selections,
          knowledgeSkills: newSkills,
        },
      });
    },
    [knowledgeSkills, state.selections, updateState]
  );

  // Get validation status
  const validationStatus = useMemo(() => {
    if (isOverBudget) return "error";
    if (knowledgePointsRemaining === 0) return "valid";
    if (languages.length > 0 || knowledgeSkills.length > 0) return "warning";
    return "pending";
  }, [isOverBudget, knowledgePointsRemaining, languages.length, knowledgeSkills.length]);

  // Check if attributes are set
  const hasAttributes = intuition > 1 || logic > 1;

  return (
    <CreationCard title="Knowledge & Languages" status={validationStatus}>
      <div className="space-y-4">
        {/* Budget indicator */}
        <BudgetIndicator
          label="Knowledge Points"
          tooltip={`Based on (INT ${intuition} + LOG ${logic}) × 2`}
          spent={knowledgePointsSpent}
          total={knowledgePointsTotal}
          note={
            isOverBudget
              ? `${Math.abs(knowledgePointsTotal - knowledgePointsSpent)} points over budget`
              : undefined
          }
          noteStyle="warning"
          mode="compact"
        />

        {!hasAttributes && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set attributes to see your knowledge point budget.
          </p>
        )}

        {/* Languages section */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Languages
            </h4>
            <button
              onClick={() => setShowAddLanguage(true)}
              className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
            >
              <Plus className="h-3.5 w-3.5" />
              Language
            </button>
          </div>
          {languages.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No languages added</p>
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-700 dark:bg-zinc-900">
              {languages.map((lang, index) => (
                <LanguageRow
                  key={`${lang.name}-${index}`}
                  language={lang}
                  onRatingChange={(delta) => handleLanguageRatingChange(index, delta)}
                  onRemove={() => handleRemoveLanguage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Knowledge Skills section */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Knowledge Skills
            </h4>
            <button
              onClick={() => setShowAddKnowledge(true)}
              className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
            >
              <Plus className="h-3.5 w-3.5" />
              Skill
            </button>
          </div>
          {knowledgeSkills.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">No knowledge skills added</p>
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-700 dark:bg-zinc-900">
              {knowledgeSkills.map((skill, index) => (
                <KnowledgeSkillRow
                  key={`${skill.name}-${index}`}
                  skill={skill}
                  onRatingChange={(delta) => handleKnowledgeRatingChange(index, delta)}
                  onRemove={() => handleRemoveKnowledge(index)}
                  onAddSpecialization={() => handleOpenSpecModal(index)}
                  onRemoveSpecialization={() => handleRemoveSpecialization(index)}
                  canAddSpecialization={
                    !skill.specialization && knowledgePointsRemaining >= SPEC_KNOWLEDGE_POINT_COST
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <SummaryFooter
          count={languages.length + knowledgeSkills.length}
          total={`${knowledgePointsSpent} pts`}
          label="item"
        />
      </div>

      {/* Modals */}
      <AddLanguageModal
        isOpen={showAddLanguage}
        onClose={() => setShowAddLanguage(false)}
        onAdd={handleAddLanguage}
        existingLanguages={languages.map((l) => l.name)}
        hasNativeLanguage={hasMaxNativeLanguages}
        pointsRemaining={knowledgePointsRemaining}
      />

      <AddKnowledgeSkillModal
        isOpen={showAddKnowledge}
        onClose={() => setShowAddKnowledge(false)}
        onAdd={handleAddKnowledge}
        pointsRemaining={knowledgePointsRemaining}
      />

      {specModalSkillIndex !== null && (
        <KnowledgeSkillSpecModal
          isOpen={true}
          onClose={() => setSpecModalSkillIndex(null)}
          onAdd={handleAddSpecialization}
          skillName={knowledgeSkills[specModalSkillIndex]?.name ?? ""}
          pointsRemaining={knowledgePointsRemaining}
        />
      )}
    </CreationCard>
  );
}
