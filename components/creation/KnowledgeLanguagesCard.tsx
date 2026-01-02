"use client";

/**
 * KnowledgeLanguagesCard
 *
 * Card for knowledge skills and language allocation in sheet-driven creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
 *
 * Features:
 * - Knowledge points budget based on (INT + LOG) × 2
 * - Languages section with native and learned languages
 * - Knowledge skills grouped by category
 * - Add modals for new languages and knowledge skills
 */

import { useMemo, useCallback, useState } from "react";
import type { CreationState, KnowledgeSkill, LanguageSkill } from "@/lib/types";
import { CreationCard } from "./shared";
import {
  Minus,
  Plus,
  X,
  Book,
  Languages,
  AlertTriangle,
} from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

type KnowledgeCategory = "academic" | "interests" | "professional" | "street";

const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  academic: "Academic",
  interests: "Interests",
  professional: "Professional",
  street: "Street",
};

const CATEGORY_DESCRIPTIONS: Record<KnowledgeCategory, string> = {
  academic: "Scholarly and theoretical knowledge",
  interests: "Hobbies and personal interests",
  professional: "Career and job-related expertise",
  street: "Street-level and underground knowledge",
};

const COMMON_LANGUAGES = [
  "English",
  "Japanese",
  "Mandarin",
  "Spanish",
  "German",
  "French",
  "Russian",
  "Arabic",
  "Portuguese",
  "Korean",
  "Italian",
  "Or'zet",
  "Sperethiel",
  "Aztlaner Spanish",
  "Cantonese",
];

const MAX_SKILL_RATING = 6;

interface KnowledgeLanguagesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// BUDGET PROGRESS BAR COMPONENT
// =============================================================================

function BudgetProgressBar({
  label,
  description,
  spent,
  total,
  isOver,
}: {
  label: string;
  description: string;
  spent: number;
  total: number;
  isOver: boolean;
}) {
  const remaining = total - spent;
  const percentage = total > 0 ? Math.min(100, (spent / total) * 100) : 0;

  return (
    <div
      className={`rounded-lg border p-3 ${
        isOver
          ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
          : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </div>
        <div
          className={`text-lg font-bold ${
            isOver
              ? "text-amber-600 dark:text-amber-400"
              : remaining === 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-900 dark:text-zinc-100"
          }`}
        >
          {remaining}
        </div>
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {description}
        <span className="float-right">of {total} remaining</span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className={`h-full rounded-full transition-all ${
            isOver
              ? "bg-amber-500"
              : remaining === 0
              ? "bg-emerald-500"
              : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Over budget warning */}
      {isOver && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{Math.abs(remaining)} points over budget</span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// LANGUAGE ROW COMPONENT
// =============================================================================

function LanguageRow({
  language,
  onRatingChange,
  onRemove,
}: {
  language: LanguageSkill;
  onRatingChange: (delta: number) => void;
  onRemove: () => void;
}) {
  const isNative = language.isNative;
  const canIncrease = !isNative && language.rating < MAX_SKILL_RATING;
  const canDecrease = !isNative && language.rating > 1;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {language.name}
          </span>
          {isNative && (
            <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
              Native
            </span>
          )}
        </div>

        {!isNative && (
          <button
            onClick={onRemove}
            className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
            title="Remove language"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {isNative ? "Native language (free)" : "Learned language"}
      </div>

      {/* Rating controls */}
      <div className="mt-2 flex items-center justify-end gap-2">
        {isNative ? (
          <div className="flex h-8 w-10 items-center justify-center rounded bg-purple-100 text-base font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
            N
          </div>
        ) : (
          <>
            <button
              onClick={() => onRatingChange(-1)}
              disabled={!canDecrease}
              className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                canDecrease
                  ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="flex h-8 w-10 items-center justify-center rounded bg-zinc-100 text-base font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              {language.rating}
            </div>

            <button
              onClick={() => onRatingChange(1)}
              disabled={!canIncrease}
              className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                canIncrease
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// KNOWLEDGE SKILL ROW COMPONENT
// =============================================================================

function KnowledgeSkillRow({
  skill,
  onRatingChange,
  onRemove,
}: {
  skill: KnowledgeSkill;
  onRatingChange: (delta: number) => void;
  onRemove: () => void;
}) {
  const canIncrease = skill.rating < MAX_SKILL_RATING;
  const canDecrease = skill.rating > 1;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {skill.name}
          </span>
          <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {CATEGORY_LABELS[skill.category]}
          </span>
        </div>

        <button
          onClick={onRemove}
          className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400"
          title="Remove skill"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Knowledge skill
      </div>

      {/* Rating controls */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          onClick={() => onRatingChange(-1)}
          disabled={!canDecrease}
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            canDecrease
              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
        >
          <Minus className="h-4 w-4" />
        </button>

        <div className="flex h-8 w-10 items-center justify-center rounded bg-zinc-100 text-base font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
          {skill.rating}
        </div>

        <button
          onClick={() => onRatingChange(1)}
          disabled={!canIncrease}
          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
            canIncrease
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// ADD LANGUAGE MODAL
// =============================================================================

function AddLanguageModal({
  isOpen,
  onClose,
  onAdd,
  existingLanguages,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, rating: number) => void;
  existingLanguages: string[];
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(1);
  const [showCustom, setShowCustom] = useState(false);

  const availableLanguages = COMMON_LANGUAGES.filter(
    (lang) => !existingLanguages.includes(lang)
  );

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), rating);
      setName("");
      setRating(1);
      setShowCustom(false);
      onClose();
    }
  };

  const handleSelectLanguage = (lang: string) => {
    setName(lang);
    setShowCustom(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Add Language
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {!showCustom ? (
            <>
              <div className="max-h-48 space-y-1 overflow-y-auto">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleSelectLanguage(lang)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      name === lang
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCustom(true)}
                className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                + Enter custom language
              </button>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Language Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mandarin"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <button
                onClick={() => setShowCustom(false)}
                className="mt-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                ← Back to list
              </button>
            </div>
          )}

          {name && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Starting Rating
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="w-8 text-center text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {rating}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              name.trim()
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            Add Language
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ADD KNOWLEDGE SKILL MODAL
// =============================================================================

function AddKnowledgeSkillModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, category: KnowledgeCategory, rating: number) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory>("street");
  const [rating, setRating] = useState(1);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), category, rating);
      setName("");
      setCategory("street");
      setRating(1);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Add Knowledge Skill
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Skill Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Seattle Gangs"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Category
            </label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {(Object.keys(CATEGORY_LABELS) as KnowledgeCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    category === cat
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                      : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  }`}
                >
                  <div className="font-medium">{CATEGORY_LABELS[cat]}</div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {CATEGORY_DESCRIPTIONS[cat]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Starting Rating
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="6"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="w-8 text-center text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {rating}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              name.trim()
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
            }`}
          >
            Add Skill
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function KnowledgeLanguagesCard({
  state,
  updateState,
}: KnowledgeLanguagesCardProps) {
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);

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

  // Calculate points spent (languages + knowledge skills ratings)
  // Native language is free
  const knowledgePointsSpent = useMemo(() => {
    const langPoints = languages
      .filter((l) => !l.isNative)
      .reduce((sum, l) => sum + l.rating, 0);
    const skillPoints = knowledgeSkills.reduce((sum, s) => sum + s.rating, 0);
    return langPoints + skillPoints;
  }, [languages, knowledgeSkills]);

  const knowledgePointsRemaining = knowledgePointsTotal - knowledgePointsSpent;
  const isOverBudget = knowledgePointsRemaining < 0;

  // Group knowledge skills by category
  const skillsByCategory = useMemo(() => {
    const grouped: Record<KnowledgeCategory, KnowledgeSkill[]> = {
      street: [],
      professional: [],
      academic: [],
      interests: [],
    };
    knowledgeSkills.forEach((skill) => {
      grouped[skill.category].push(skill);
    });
    return grouped;
  }, [knowledgeSkills]);

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

  // Handle remove language
  const handleRemoveLanguage = useCallback(
    (index: number) => {
      const lang = languages[index];
      if (lang.isNative) return; // Can't remove native language

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
    (name: string, rating: number) => {
      const newLanguage: LanguageSkill = {
        name,
        rating,
        isNative: false,
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
    (name: string, category: KnowledgeCategory, rating: number) => {
      const newSkill: KnowledgeSkill = {
        name,
        category,
        rating,
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
    <CreationCard
      title="Knowledge & Languages"
      description={
        knowledgePointsRemaining === 0
          ? "All points allocated"
          : `${knowledgePointsRemaining} of ${knowledgePointsTotal} points remaining`
      }
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Budget indicator */}
        <BudgetProgressBar
          label="Knowledge Points"
          description={`Based on (INT ${intuition} + LOG ${logic}) × 2`}
          spent={knowledgePointsSpent}
          total={knowledgePointsTotal}
          isOver={isOverBudget}
        />

        {!hasAttributes && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set attributes to see your knowledge point budget.
          </p>
        )}

        {/* Languages section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Languages
            </h4>
          </div>

          <div className="space-y-2">
            {languages.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No languages added. Add your native language first.
              </p>
            ) : (
              languages.map((lang, index) => (
                <LanguageRow
                  key={`${lang.name}-${index}`}
                  language={lang}
                  onRatingChange={(delta) =>
                    handleLanguageRatingChange(index, delta)
                  }
                  onRemove={() => handleRemoveLanguage(index)}
                />
              ))
            )}
          </div>

          <button
            onClick={() => setShowAddLanguage(true)}
            className="mt-2 flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <Plus className="h-4 w-4" />
            Add Language
          </button>
        </div>

        {/* Knowledge Skills section */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Knowledge Skills
            </h4>
          </div>

          <div className="space-y-3">
            {knowledgeSkills.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No knowledge skills added.
              </p>
            ) : (
              (Object.keys(CATEGORY_LABELS) as KnowledgeCategory[]).map(
                (category) =>
                  skillsByCategory[category].length > 0 && (
                    <div key={category}>
                      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        {CATEGORY_LABELS[category]}
                      </div>
                      <div className="space-y-2">
                        {skillsByCategory[category].map((skill, idx) => {
                          const globalIndex = knowledgeSkills.findIndex(
                            (s) => s === skill
                          );
                          return (
                            <KnowledgeSkillRow
                              key={`${skill.name}-${idx}`}
                              skill={skill}
                              onRatingChange={(delta) =>
                                handleKnowledgeRatingChange(globalIndex, delta)
                              }
                              onRemove={() =>
                                handleRemoveKnowledge(globalIndex)
                              }
                            />
                          );
                        })}
                      </div>
                    </div>
                  )
              )
            )}
          </div>

          <button
            onClick={() => setShowAddKnowledge(true)}
            className="mt-2 flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <Plus className="h-4 w-4" />
            Add Knowledge Skill
          </button>
        </div>

        {/* Summary */}
        {(languages.length > 0 || knowledgeSkills.length > 0) && (
          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              {languages.filter((l) => !l.isNative).length > 0 &&
                `${languages.filter((l) => !l.isNative).length} language${
                  languages.filter((l) => !l.isNative).length !== 1 ? "s" : ""
                }`}
              {languages.filter((l) => !l.isNative).length > 0 &&
                knowledgeSkills.length > 0 &&
                ", "}
              {knowledgeSkills.length > 0 &&
                `${knowledgeSkills.length} knowledge skill${
                  knowledgeSkills.length !== 1 ? "s" : ""
                }`}
            </span>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddLanguageModal
        isOpen={showAddLanguage}
        onClose={() => setShowAddLanguage(false)}
        onAdd={handleAddLanguage}
        existingLanguages={languages.map((l) => l.name)}
      />

      <AddKnowledgeSkillModal
        isOpen={showAddKnowledge}
        onClose={() => setShowAddKnowledge(false)}
        onAdd={handleAddKnowledge}
      />
    </CreationCard>
  );
}
