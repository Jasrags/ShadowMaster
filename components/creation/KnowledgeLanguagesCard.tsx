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
import { useSkills } from "@/lib/rules";
import { CreationCard, BudgetIndicator } from "./shared";
import { Minus, Plus, X, Book, Languages, AlertTriangle } from "lucide-react";

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

// Abbreviated category labels for compact display
const CATEGORY_ABBREVS: Record<KnowledgeCategory, string> = {
  academic: "Acad",
  interests: "Int",
  professional: "Prof",
  street: "Str",
};

interface KnowledgeLanguagesCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// LANGUAGE ROW COMPONENT (Compact single-row layout)
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
    <div className="flex items-center justify-between py-1.5">
      {/* Language info */}
      <div className="flex items-center gap-1.5">
        <Languages className="h-3.5 w-3.5 text-emerald-500" />
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {language.name}
        </span>
        {isNative && (
          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-semibold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
            Native
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {isNative ? (
          <>
            <div className="flex h-7 w-8 items-center justify-center rounded bg-purple-100 text-sm font-bold text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
              N
            </div>
            <button
              onClick={onRemove}
              aria-label={`Remove ${language.name}`}
              className="ml-1 rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
              title="Remove native language"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onRatingChange(-1)}
              disabled={!canDecrease}
              aria-label={`Decrease ${language.name} rating`}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                canDecrease
                  ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Minus className="h-3 w-3" aria-hidden="true" />
            </button>
            <div className="flex h-7 w-8 items-center justify-center rounded bg-zinc-100 text-sm font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
              {language.rating}
            </div>
            <button
              onClick={() => onRatingChange(1)}
              disabled={!canIncrease}
              aria-label={`Increase ${language.name} rating`}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                canIncrease
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              <Plus className="h-3 w-3" aria-hidden="true" />
            </button>
            <button
              onClick={onRemove}
              aria-label={`Remove ${language.name}`}
              className="ml-1 rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
              title="Remove language"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// KNOWLEDGE SKILL ROW COMPONENT (Compact single-row layout)
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
  const isAtMax = skill.rating >= MAX_SKILL_RATING;

  return (
    <div className="flex items-center justify-between py-1.5">
      {/* Skill info */}
      <div className="flex items-center gap-1.5">
        <Book className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{skill.name}</span>
        <span
          className="text-[10px] text-zinc-400 dark:text-zinc-500"
          title={CATEGORY_LABELS[skill.category]}
        >
          {CATEGORY_ABBREVS[skill.category]}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {isAtMax && (
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
            MAX
          </span>
        )}
        <button
          onClick={() => onRatingChange(-1)}
          disabled={!canDecrease}
          aria-label={`Decrease ${skill.name} rating`}
          className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
            canDecrease
              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
        >
          <Minus className="h-3 w-3" aria-hidden="true" />
        </button>
        <div className="flex h-7 w-8 items-center justify-center rounded bg-zinc-100 text-sm font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
          {skill.rating}
        </div>
        <button
          onClick={() => onRatingChange(1)}
          disabled={!canIncrease}
          aria-label={`Increase ${skill.name} rating`}
          className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
            canIncrease
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
          }`}
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
        </button>
        <button
          onClick={onRemove}
          aria-label={`Remove ${skill.name}`}
          className="ml-1 rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          title="Remove skill"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// ADD LANGUAGE MODAL
// =============================================================================

interface AddLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, rating: number, isNative: boolean) => void;
  existingLanguages: string[];
  hasNativeLanguage: boolean;
  pointsRemaining: number;
}

function AddLanguageModal({
  isOpen,
  onClose,
  onAdd,
  existingLanguages,
  hasNativeLanguage,
  pointsRemaining,
}: AddLanguageModalProps) {
  const [name, setName] = useState("");
  const { exampleLanguages } = useSkills();

  // Filter out already-added languages
  const availableExamples = useMemo(() => {
    if (!exampleLanguages) return [];
    return exampleLanguages.filter((lang) => !existingLanguages.includes(lang.name));
  }, [exampleLanguages, existingLanguages]);

  const handleSelectFromDropdown = (langName: string) => {
    setName(langName);
  };

  const handleAddAsNative = () => {
    if (name.trim()) {
      onAdd(name.trim(), 0, true);
      setName("");
      onClose();
    }
  };

  const handleAdd = () => {
    if (name.trim() && pointsRemaining > 0) {
      onAdd(name.trim(), 1, false);
      setName("");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">Add Language</h3>
          <button
            onClick={handleClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Quick select dropdown */}
            {availableExamples.length > 0 && (
              <div>
                <select
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-amber-600 dark:bg-zinc-800 dark:text-zinc-100"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSelectFromDropdown(e.target.value);
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="" disabled>
                    Quick select from examples...
                  </option>
                  {availableExamples.map((lang) => (
                    <option key={lang.name} value={lang.name}>
                      {lang.name}
                      {lang.region ? ` (${lang.region})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom input with buttons */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Or type custom language..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddAsNative}
                  disabled={!name.trim() || hasNativeLanguage}
                  className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    name.trim() && !hasNativeLanguage
                      ? "bg-zinc-600 text-white hover:bg-zinc-700"
                      : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                  }`}
                >
                  Add as Native
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!name.trim() || pointsRemaining <= 0}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    name.trim() && pointsRemaining > 0
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                  }`}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Info text */}
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {!hasNativeLanguage ? (
                <p>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Native language
                  </span>{" "}
                  is free and has no rating. Other languages cost 1 point per rating.
                </p>
              ) : (
                <p>
                  Languages cost 1 knowledge point per rating level.{" "}
                  <span className="font-medium">{pointsRemaining} points remaining.</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <button
            onClick={handleClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ADD KNOWLEDGE SKILL MODAL
// =============================================================================

interface AddKnowledgeSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, category: KnowledgeCategory, rating: number) => void;
  pointsRemaining: number;
}

function AddKnowledgeSkillModal({
  isOpen,
  onClose,
  onAdd,
  pointsRemaining,
}: AddKnowledgeSkillModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory>("academic");
  const { exampleKnowledgeSkills, knowledgeCategories } = useSkills();

  const handleSelectFromDropdown = (skillName: string) => {
    const selected = exampleKnowledgeSkills?.find((s) => s.name === skillName);
    if (selected) {
      setName(selected.name);
      setCategory(selected.category as KnowledgeCategory);
    }
  };

  const handleAdd = () => {
    if (name.trim() && pointsRemaining > 0) {
      onAdd(name.trim(), category, 1);
      setName("");
      setCategory("academic");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setCategory("academic");
    onClose();
  };

  if (!isOpen) return null;

  // Use ruleset categories if available, otherwise fallback
  const categoryOptions =
    knowledgeCategories?.length > 0
      ? knowledgeCategories
      : [
          { id: "academic", name: "Academic" },
          { id: "interests", name: "Interests" },
          { id: "professional", name: "Professional" },
          { id: "street", name: "Street" },
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-400">
            Add Knowledge Skill
          </h3>
          <button
            onClick={handleClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Quick select dropdown */}
            {exampleKnowledgeSkills && exampleKnowledgeSkills.length > 0 && (
              <div>
                <select
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-amber-600 dark:bg-zinc-800 dark:text-zinc-100"
                  defaultValue=""
                  disabled={pointsRemaining <= 0}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSelectFromDropdown(e.target.value);
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="" disabled>
                    Quick add from examples...
                  </option>
                  <optgroup label="Academic">
                    {exampleKnowledgeSkills
                      .filter((s) => s.category === "academic")
                      .map((skill) => (
                        <option key={skill.name} value={skill.name}>
                          {skill.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Interests">
                    {exampleKnowledgeSkills
                      .filter((s) => s.category === "interests")
                      .map((skill) => (
                        <option key={skill.name} value={skill.name}>
                          {skill.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Professional">
                    {exampleKnowledgeSkills
                      .filter((s) => s.category === "professional")
                      .map((skill) => (
                        <option key={skill.name} value={skill.name}>
                          {skill.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Street">
                    {exampleKnowledgeSkills
                      .filter((s) => s.category === "street")
                      .map((skill) => (
                        <option key={skill.name} value={skill.name}>
                          {skill.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>
            )}

            {/* Custom input with category and add button */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Or type custom skill name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAdd}
                  disabled={!name.trim() || pointsRemaining <= 0}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    name.trim() && pointsRemaining > 0
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
                  }`}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Info text */}
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              <p>
                Knowledge skills cost 1 point per rating level.{" "}
                <span className="font-medium">{pointsRemaining} points remaining.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-zinc-200 px-4 py-3 dark:border-zinc-700">
          <button
            onClick={handleClose}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function KnowledgeLanguagesCard({ state, updateState }: KnowledgeLanguagesCardProps) {
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
    const langPoints = languages.filter((l) => !l.isNative).reduce((sum, l) => sum + l.rating, 0);
    const skillPoints = knowledgeSkills.reduce((sum, s) => sum + s.rating, 0);
    return langPoints + skillPoints;
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
          compact
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
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No languages added. Add your native language first.
            </p>
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
            <p className="text-sm text-zinc-500 dark:text-zinc-400">No knowledge skills added.</p>
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white px-3 py-1 dark:border-zinc-700 dark:bg-zinc-900">
              {knowledgeSkills.map((skill, index) => (
                <KnowledgeSkillRow
                  key={`${skill.name}-${index}`}
                  skill={skill}
                  onRatingChange={(delta) => handleKnowledgeRatingChange(index, delta)}
                  onRemove={() => handleRemoveKnowledge(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {(languages.length > 0 || knowledgeSkills.length > 0) && (
          <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Total:{" "}
              {languages.length > 0 &&
                `${languages.length} language${languages.length !== 1 ? "s" : ""}`}
              {languages.length > 0 && knowledgeSkills.length > 0 && ", "}
              {knowledgeSkills.length > 0 &&
                `${knowledgeSkills.length} skill${knowledgeSkills.length !== 1 ? "s" : ""}`}
            </span>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {knowledgePointsSpent} pts
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
        hasNativeLanguage={hasMaxNativeLanguages}
        pointsRemaining={knowledgePointsRemaining}
      />

      <AddKnowledgeSkillModal
        isOpen={showAddKnowledge}
        onClose={() => setShowAddKnowledge(false)}
        onAdd={handleAddKnowledge}
        pointsRemaining={knowledgePointsRemaining}
      />
    </CreationCard>
  );
}
