"use client";

import { useMemo, useCallback, useState } from "react";
import { useSkills } from "@/lib/rules";
import type { CreationState, KnowledgeSkill, LanguageSkill } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

type SkillCategory = "combat" | "physical" | "social" | "technical" | "vehicle" | "magical" | "resonance";
type KnowledgeCategory = "academic" | "interests" | "professional" | "street";
type TabType = "active" | "knowledge" | "language";

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  combat: "Combat",
  physical: "Physical",
  social: "Social",
  technical: "Technical",
  vehicle: "Vehicle",
  magical: "Magical",
  resonance: "Resonance",
};

const KNOWLEDGE_CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  academic: "Academic",
  interests: "Interests",
  professional: "Professional",
  street: "Street",
};

const MAX_SKILL_RATING = 6; // At character creation

export function SkillsStep({ state, updateState, budgetValues }: StepProps) {
  const { activeSkills, skillGroups, knowledgeCategories, creationLimits } = useSkills();
  const skillPoints = budgetValues["skill-points"] || 0;
  const skillGroupPoints = budgetValues["skill-group-points"] || 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | "all">("all");
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [newKnowledgeSkill, setNewKnowledgeSkill] = useState({ name: "", category: "academic" as KnowledgeCategory });
  const [newLanguage, setNewLanguage] = useState("");

  // Get current skill values from state
  const skills = useMemo(() => {
    return (state.selections.skills || {}) as Record<string, number>;
  }, [state.selections.skills]);

  // Get current skill group values from state
  const groups = useMemo(() => {
    return (state.selections.skillGroups || {}) as Record<string, number>;
  }, [state.selections.skillGroups]);

  // Get current knowledge skills from state
  const knowledgeSkills = useMemo(() => {
    return (state.selections.knowledgeSkills || []) as KnowledgeSkill[];
  }, [state.selections.knowledgeSkills]);

  // Get current languages from state
  const languages = useMemo(() => {
    return (state.selections.languages || []) as LanguageSkill[];
  }, [state.selections.languages]);

  // Calculate attribute values for free knowledge points
  const intuition = useMemo(() => {
    const attrs = (state.selections.attributes || {}) as Record<string, number>;
    return (attrs.intuition || 0) + 1; // Add 1 for metatype minimum
  }, [state.selections.attributes]);

  const logic = useMemo(() => {
    const attrs = (state.selections.attributes || {}) as Record<string, number>;
    return (attrs.logic || 0) + 1; // Add 1 for metatype minimum
  }, [state.selections.attributes]);

  // Calculate free knowledge/language points: (LOG + INT) × 2
  const freeKnowledgePoints = useMemo(() => {
    return (logic + intuition) * 2;
  }, [logic, intuition]);

  // Calculate points spent
  const skillPointsSpent = useMemo(() => {
    return Object.values(skills).reduce((sum, val) => sum + val, 0);
  }, [skills]);

  const groupPointsSpent = useMemo(() => {
    return Object.values(groups).reduce((sum, val) => sum + val, 0);
  }, [groups]);

  const knowledgePointsSpent = useMemo(() => {
    return knowledgeSkills.reduce((sum, skill) => sum + skill.rating, 0) +
           languages.filter(lang => !lang.isNative).reduce((sum, lang) => sum + lang.rating, 0);
  }, [knowledgeSkills, languages]);

  const skillPointsRemaining = skillPoints - skillPointsSpent;
  const groupPointsRemaining = skillGroupPoints - groupPointsSpent;
  const knowledgePointsRemaining = freeKnowledgePoints - knowledgePointsSpent;

  // Filter skills by category and search
  const filteredSkills = useMemo(() => {
    return activeSkills.filter((skill) => {
      // Check search query
      if (searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Check category
      if (selectedCategory !== "all" && skill.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [activeSkills, searchQuery, selectedCategory]);

  // Group filtered skills by their skill group
  const groupedSkills = useMemo(() => {
    const grouped: Record<string, typeof filteredSkills> = {};
    const ungrouped: typeof filteredSkills = [];

    filteredSkills.forEach((skill) => {
      if (skill.group) {
        if (!grouped[skill.group]) {
          grouped[skill.group] = [];
        }
        grouped[skill.group].push(skill);
      } else {
        ungrouped.push(skill);
      }
    });

    // Sort skills within each group by name
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.name.localeCompare(b.name));
    });
    ungrouped.sort((a, b) => a.name.localeCompare(b.name));

    // Create ordered array of groups based on skillGroups order
    const orderedGroups: Array<{ groupId: string; groupName: string; skills: typeof filteredSkills }> = [];

    skillGroups.forEach((sg) => {
      if (grouped[sg.id] && grouped[sg.id].length > 0) {
        orderedGroups.push({
          groupId: sg.id,
          groupName: sg.name,
          skills: grouped[sg.id],
        });
      }
    });

    // Add ungrouped at the end
    if (ungrouped.length > 0) {
      orderedGroups.push({
        groupId: "ungrouped",
        groupName: "Ungrouped Skills",
        skills: ungrouped,
      });
    }

    return orderedGroups;
  }, [filteredSkills, skillGroups]);

  // Get available categories
  const availableCategories = useMemo(() => {
    const categories = new Set<SkillCategory>();
    activeSkills.forEach((skill) => {
      if (skill.category) {
        categories.add(skill.category as SkillCategory);
      }
    });
    return Array.from(categories).sort();
  }, [activeSkills]);

  // Handle individual skill change
  const handleSkillChange = useCallback(
    (skillId: string, newValue: number) => {
      const currentValue = skills[skillId] || 0;
      const valueDiff = newValue - currentValue;

      // Check if we have enough points for increase
      if (valueDiff > 0 && valueDiff > skillPointsRemaining) {
        return;
      }

      // Clamp to limits
      const clampedValue = Math.max(0, Math.min(MAX_SKILL_RATING, newValue));

      const newSkills = { ...skills };
      if (clampedValue === 0) {
        delete newSkills[skillId];
      } else {
        newSkills[skillId] = clampedValue;
      }

      const newSpent = Object.values(newSkills).reduce((sum, val) => sum + val, 0);

      updateState({
        selections: {
          ...state.selections,
          skills: newSkills,
        },
        budgets: {
          ...state.budgets,
          "skill-points-spent": newSpent,
          "skill-points-total": skillPoints,
        },
      });
    },
    [skills, skillPointsRemaining, state.selections, state.budgets, updateState, skillPoints]
  );

  // Handle skill group change
  const handleGroupChange = useCallback(
    (groupId: string, newValue: number) => {
      const currentValue = groups[groupId] || 0;
      const valueDiff = newValue - currentValue;

      // Check if we have enough points for increase
      if (valueDiff > 0 && valueDiff > groupPointsRemaining) {
        return;
      }

      // Clamp to limits
      const clampedValue = Math.max(0, Math.min(MAX_SKILL_RATING, newValue));

      const newGroups = { ...groups };
      if (clampedValue === 0) {
        delete newGroups[groupId];
      } else {
        newGroups[groupId] = clampedValue;
      }

      const newSpent = Object.values(newGroups).reduce((sum, val) => sum + val, 0);

      updateState({
        selections: {
          ...state.selections,
          skillGroups: newGroups,
        },
        budgets: {
          ...state.budgets,
          "skill-group-points-spent": newSpent,
          "skill-group-points-total": skillGroupPoints,
        },
      });
    },
    [groups, groupPointsRemaining, state.selections, state.budgets, updateState, skillGroupPoints]
  );

  // Handle adding a knowledge skill
  const handleAddKnowledgeSkill = useCallback(() => {
    if (!newKnowledgeSkill.name.trim()) return;
    if (knowledgePointsRemaining <= 0) return;

    const newSkill: KnowledgeSkill = {
      name: newKnowledgeSkill.name.trim(),
      category: newKnowledgeSkill.category,
      rating: 1,
    };

    const updatedKnowledgeSkills = [...knowledgeSkills, newSkill];

    updateState({
      selections: {
        ...state.selections,
        knowledgeSkills: updatedKnowledgeSkills,
      },
      budgets: {
        ...state.budgets,
        "knowledge-points-spent": knowledgePointsSpent + 1,
        "knowledge-points-total": freeKnowledgePoints,
      },
    });

    setNewKnowledgeSkill({ name: "", category: "academic" });
  }, [newKnowledgeSkill, knowledgeSkills, knowledgePointsRemaining, knowledgePointsSpent, freeKnowledgePoints, state.selections, state.budgets, updateState]);

  // Handle changing knowledge skill rating
  const handleKnowledgeSkillChange = useCallback(
    (index: number, newRating: number) => {
      const skill = knowledgeSkills[index];
      const currentRating = skill.rating;
      const ratingDiff = newRating - currentRating;

      // Check if we have enough points
      if (ratingDiff > 0 && ratingDiff > knowledgePointsRemaining) {
        return;
      }

      const clampedRating = Math.max(1, Math.min(MAX_SKILL_RATING, newRating));
      const updatedSkills = [...knowledgeSkills];
      updatedSkills[index] = { ...skill, rating: clampedRating };

      const newSpent = updatedSkills.reduce((sum, s) => sum + s.rating, 0) +
                       languages.filter(l => !l.isNative).reduce((sum, l) => sum + l.rating, 0);

      updateState({
        selections: {
          ...state.selections,
          knowledgeSkills: updatedSkills,
        },
        budgets: {
          ...state.budgets,
          "knowledge-points-spent": newSpent,
          "knowledge-points-total": freeKnowledgePoints,
        },
      });
    },
    [knowledgeSkills, languages, knowledgePointsRemaining, freeKnowledgePoints, state.selections, state.budgets, updateState]
  );

  // Handle removing a knowledge skill
  const handleRemoveKnowledgeSkill = useCallback(
    (index: number) => {
      const updatedSkills = knowledgeSkills.filter((_, i) => i !== index);
      const newSpent = updatedSkills.reduce((sum, s) => sum + s.rating, 0) +
                       languages.filter(l => !l.isNative).reduce((sum, l) => sum + l.rating, 0);

      updateState({
        selections: {
          ...state.selections,
          knowledgeSkills: updatedSkills,
        },
        budgets: {
          ...state.budgets,
          "knowledge-points-spent": newSpent,
          "knowledge-points-total": freeKnowledgePoints,
        },
      });
    },
    [knowledgeSkills, languages, freeKnowledgePoints, state.selections, state.budgets, updateState]
  );

  // Handle adding a language
  const handleAddLanguage = useCallback(
    (isNative: boolean) => {
      if (!newLanguage.trim()) return;

      // Check if adding a native language (free) or regular language
      if (!isNative && knowledgePointsRemaining <= 0) return;

      // Check if we already have a native language
      const hasNative = languages.some(l => l.isNative);
      if (isNative && hasNative) return;

      const lang: LanguageSkill = {
        name: newLanguage.trim(),
        rating: isNative ? creationLimits.nativeLanguageRating : 1,
        isNative,
      };

      const updatedLanguages = [...languages, lang];

      const newSpent = knowledgeSkills.reduce((sum, s) => sum + s.rating, 0) +
                       updatedLanguages.filter(l => !l.isNative).reduce((sum, l) => sum + l.rating, 0);

      updateState({
        selections: {
          ...state.selections,
          languages: updatedLanguages,
        },
        budgets: {
          ...state.budgets,
          "knowledge-points-spent": newSpent,
          "knowledge-points-total": freeKnowledgePoints,
        },
      });

      setNewLanguage("");
    },
    [newLanguage, languages, knowledgeSkills, knowledgePointsRemaining, creationLimits.nativeLanguageRating, freeKnowledgePoints, state.selections, state.budgets, updateState]
  );

  // Handle changing language rating
  const handleLanguageChange = useCallback(
    (index: number, newRating: number) => {
      const lang = languages[index];
      if (lang.isNative) return; // Can't change native language rating

      const currentRating = lang.rating;
      const ratingDiff = newRating - currentRating;

      if (ratingDiff > 0 && ratingDiff > knowledgePointsRemaining) {
        return;
      }

      const clampedRating = Math.max(1, Math.min(MAX_SKILL_RATING, newRating));
      const updatedLanguages = [...languages];
      updatedLanguages[index] = { ...lang, rating: clampedRating };

      const newSpent = knowledgeSkills.reduce((sum, s) => sum + s.rating, 0) +
                       updatedLanguages.filter(l => !l.isNative).reduce((sum, l) => sum + l.rating, 0);

      updateState({
        selections: {
          ...state.selections,
          languages: updatedLanguages,
        },
        budgets: {
          ...state.budgets,
          "knowledge-points-spent": newSpent,
          "knowledge-points-total": freeKnowledgePoints,
        },
      });
    },
    [languages, knowledgeSkills, knowledgePointsRemaining, freeKnowledgePoints, state.selections, state.budgets, updateState]
  );

  // Handle removing a language
  const handleRemoveLanguage = useCallback(
    (index: number) => {
      const updatedLanguages = languages.filter((_, i) => i !== index);
      const newSpent = knowledgeSkills.reduce((sum, s) => sum + s.rating, 0) +
                       updatedLanguages.filter(l => !l.isNative).reduce((sum, l) => sum + l.rating, 0);

      updateState({
        selections: {
          ...state.selections,
          languages: updatedLanguages,
        },
        budgets: {
          ...state.budgets,
          "knowledge-points-spent": newSpent,
          "knowledge-points-total": freeKnowledgePoints,
        },
      });
    },
    [languages, knowledgeSkills, freeKnowledgePoints, state.selections, state.budgets, updateState]
  );

  // Check if character has a native language
  const hasNativeLanguage = useMemo(() => {
    return languages.some(l => l.isNative);
  }, [languages]);

  // Render skill row
  const renderSkill = (skill: { id: string; name: string; linkedAttribute: string; group?: string | null }) => {
    const value = skills[skill.id] || 0;
    const canIncrease = value < MAX_SKILL_RATING && skillPointsRemaining > 0;
    const canDecrease = value > 0;

    // Check if this skill is covered by a group
    const groupRating = skill.group ? (groups[skill.group] || 0) : 0;
    const effectiveRating = Math.max(value, groupRating);

    return (
      <div
        key={skill.id}
        className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
          value > 0
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
            : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50"
        }`}
      >
        {/* Skill info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-zinc-50 truncate">{skill.name}</span>
            <span className="flex-shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
              {skill.linkedAttribute?.toUpperCase().slice(0, 3)}
            </span>
          </div>
          {skill.group && (
            <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Group: {skillGroups.find((g) => g.id === skill.group)?.name || skill.group}
              {groupRating > 0 && (
                <span className="ml-1 text-emerald-600 dark:text-emerald-400">(+{groupRating} from group)</span>
              )}
            </div>
          )}
        </div>

        {/* Value controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleSkillChange(skill.id, value - 1)}
            disabled={!canDecrease}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              canDecrease
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <div
            className={`flex h-8 w-10 items-center justify-center rounded text-sm font-bold ${
              effectiveRating > 0
                ? "bg-emerald-500 text-white"
                : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
            }`}
          >
            {effectiveRating}
          </div>

          <button
            onClick={() => handleSkillChange(skill.id, value + 1)}
            disabled={!canIncrease}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              canIncrease
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Render skill group
  const renderGroup = (group: { id: string; name: string; skills: string[] }) => {
    const value = groups[group.id] || 0;
    const canIncrease = value < MAX_SKILL_RATING && groupPointsRemaining > 0;
    const canDecrease = value > 0;

    return (
      <div
        key={group.id}
        className={`flex items-center gap-3 rounded-lg border p-3 ${
          value > 0
            ? "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20"
            : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50"
        }`}
      >
        <div className="flex-1">
          <div className="font-medium text-zinc-900 dark:text-zinc-50">{group.name}</div>
          <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            Includes: {group.skills.map((s) => activeSkills.find((as) => as.id === s)?.name || s).join(", ")}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleGroupChange(group.id, value - 1)}
            disabled={!canDecrease}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              canDecrease
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <div
            className={`flex h-8 w-10 items-center justify-center rounded text-sm font-bold ${
              value > 0
                ? "bg-purple-500 text-white"
                : "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
            }`}
          >
            {value}
          </div>

          <button
            onClick={() => handleGroupChange(group.id, value + 1)}
            disabled={!canIncrease}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              canIncrease
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Render Active Skills tab content
  const renderActiveSkillsTab = () => (
    <>
      {/* Points remaining indicators */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Skill Points</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">For individual skills</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{skillPointsRemaining}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">of {skillPoints}</div>
            </div>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-200 dark:bg-emerald-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${skillPoints > 0 ? (skillPointsSpent / skillPoints) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Skill Group Points</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">For skill groups</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{groupPointsRemaining}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">of {skillGroupPoints}</div>
            </div>
          </div>
          {skillGroupPoints > 0 && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-purple-200 dark:bg-purple-800">
              <div
                className="h-full rounded-full bg-purple-500 transition-all duration-300"
                style={{ width: `${(groupPointsSpent / skillGroupPoints) * 100}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Skill Groups */}
      {skillGroupPoints > 0 && skillGroups.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Skill Groups
          </h3>
          <div className="space-y-2">
            {skillGroups.map(renderGroup)}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
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
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as SkillCategory | "all")}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        >
          <option value="all">All Categories</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat] || cat}
            </option>
          ))}
        </select>
      </div>

      {/* Individual Skills - Grouped by Skill Group */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Active Skills ({filteredSkills.length})
        </h3>

        {groupedSkills.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No skills match your search.
          </p>
        ) : (
          <div className="space-y-6">
            {groupedSkills.map(({ groupId, groupName, skills: groupSkills }) => (
              <div key={groupId}>
                {/* Group Header */}
                <div className="mb-2 flex items-center gap-2">
                  <div className={`h-px flex-1 ${groupId === "ungrouped" ? "bg-zinc-300 dark:bg-zinc-600" : "bg-purple-300 dark:bg-purple-700"}`} />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    groupId === "ungrouped"
                      ? "text-zinc-500 dark:text-zinc-400"
                      : "text-purple-600 dark:text-purple-400"
                  }`}>
                    {groupName}
                    {groupId !== "ungrouped" && groups[groupId] > 0 && (
                      <span className="ml-1.5 rounded bg-purple-100 px-1.5 py-0.5 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        Group Rating: {groups[groupId]}
                      </span>
                    )}
                  </span>
                  <div className={`h-px flex-1 ${groupId === "ungrouped" ? "bg-zinc-300 dark:bg-zinc-600" : "bg-purple-300 dark:bg-purple-700"}`} />
                </div>

                {/* Skills in this group */}
                <div className="space-y-2">
                  {groupSkills.map(renderSkill)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // Render Knowledge Skills tab content
  const renderKnowledgeSkillsTab = () => (
    <>
      {/* Points indicator */}
      <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-amber-800 dark:text-amber-200">Knowledge Points</div>
            <div className="text-xs text-amber-600 dark:text-amber-400">
              (Logic {logic} + Intuition {intuition}) × 2 = {freeKnowledgePoints}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{knowledgePointsRemaining}</div>
            <div className="text-xs text-amber-600 dark:text-amber-400">remaining</div>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200 dark:bg-amber-800">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${freeKnowledgePoints > 0 ? (knowledgePointsSpent / freeKnowledgePoints) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Add new knowledge skill */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h4 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add Knowledge Skill</h4>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Skill name (e.g., Corporate Politics, Matrix Security)"
            value={newKnowledgeSkill.name}
            onChange={(e) => setNewKnowledgeSkill({ ...newKnowledgeSkill, name: e.target.value })}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <select
            value={newKnowledgeSkill.category}
            onChange={(e) => setNewKnowledgeSkill({ ...newKnowledgeSkill, category: e.target.value as KnowledgeCategory })}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {(knowledgeCategories.length > 0 ? knowledgeCategories : [
              { id: "academic", name: "Academic" },
              { id: "interests", name: "Interests" },
              { id: "professional", name: "Professional" },
              { id: "street", name: "Street" },
            ]).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddKnowledgeSkill}
            disabled={!newKnowledgeSkill.name.trim() || knowledgePointsRemaining <= 0}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              newKnowledgeSkill.name.trim() && knowledgePointsRemaining > 0
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
            }`}
          >
            Add
          </button>
        </div>
      </div>

      {/* Knowledge skills list */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Knowledge Skills ({knowledgeSkills.length})
        </h3>

        {knowledgeSkills.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No knowledge skills added yet. Add skills that represent your character&apos;s background and interests.
          </p>
        ) : (
          <div className="space-y-2">
            {knowledgeSkills.map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50 truncate">{skill.name}</span>
                    <span className="flex-shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-800 dark:text-amber-300">
                      {KNOWLEDGE_CATEGORY_LABELS[skill.category] || skill.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleKnowledgeSkillChange(index, skill.rating - 1)}
                    disabled={skill.rating <= 1}
                    className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                      skill.rating > 1
                        ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                        : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                    }`}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>

                  <div className="flex h-8 w-10 items-center justify-center rounded bg-amber-500 text-sm font-bold text-white">
                    {skill.rating}
                  </div>

                  <button
                    onClick={() => handleKnowledgeSkillChange(index, skill.rating + 1)}
                    disabled={skill.rating >= MAX_SKILL_RATING || knowledgePointsRemaining <= 0}
                    className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                      skill.rating < MAX_SKILL_RATING && knowledgePointsRemaining > 0
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                    }`}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleRemoveKnowledgeSkill(index)}
                    className="ml-2 flex h-7 w-7 items-center justify-center rounded bg-red-100 text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  // Render Language Skills tab content
  const renderLanguageSkillsTab = () => (
    <>
      {/* Points indicator */}
      <div className="rounded-lg bg-sky-50 p-4 dark:bg-sky-900/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-sky-800 dark:text-sky-200">Knowledge Points</div>
            <div className="text-xs text-sky-600 dark:text-sky-400">
              Shared with Knowledge Skills
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">{knowledgePointsRemaining}</div>
            <div className="text-xs text-sky-600 dark:text-sky-400">of {freeKnowledgePoints} remaining</div>
          </div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sky-200 dark:bg-sky-800">
          <div
            className="h-full rounded-full bg-sky-500 transition-all duration-300"
            style={{ width: `${freeKnowledgePoints > 0 ? (knowledgePointsSpent / freeKnowledgePoints) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Native language note */}
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 dark:border-sky-800 dark:bg-sky-900/20">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 flex-shrink-0 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-sky-800 dark:text-sky-200">
            <p className="font-medium">Native Language</p>
            <p className="mt-1 text-sky-600 dark:text-sky-400">
              Every character gets one native language at rating {creationLimits.nativeLanguageRating} for free.
              Additional languages cost points from your Knowledge pool.
            </p>
          </div>
        </div>
      </div>

      {/* Add new language */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <h4 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add Language</h4>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Language name (e.g., English, Japanese, Or'zet)"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            onClick={() => handleAddLanguage(true)}
            disabled={!newLanguage.trim() || hasNativeLanguage}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              newLanguage.trim() && !hasNativeLanguage
                ? "bg-sky-600 text-white hover:bg-sky-700"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
            }`}
          >
            Add as Native
          </button>
          <button
            onClick={() => handleAddLanguage(false)}
            disabled={!newLanguage.trim() || knowledgePointsRemaining <= 0}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              newLanguage.trim() && knowledgePointsRemaining > 0
                ? "bg-sky-500 text-white hover:bg-sky-600"
                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-700"
            }`}
          >
            Add
          </button>
        </div>
        {hasNativeLanguage && (
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            You already have a native language. Additional languages will start at rating 1.
          </p>
        )}
      </div>

      {/* Languages list */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Languages ({languages.length})
        </h3>

        {languages.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No languages added yet. Add your native language first, then any additional languages you know.
          </p>
        ) : (
          <div className="space-y-2">
            {languages.map((lang, index) => (
              <div
                key={`${lang.name}-${index}`}
                className={`flex items-center gap-3 rounded-lg border p-3 ${
                  lang.isNative
                    ? "border-sky-300 bg-sky-100 dark:border-sky-700 dark:bg-sky-900/30"
                    : "border-sky-200 bg-sky-50 dark:border-sky-800 dark:bg-sky-900/20"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50 truncate">{lang.name}</span>
                    {lang.isNative && (
                      <span className="flex-shrink-0 rounded bg-sky-200 px-1.5 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-800 dark:text-sky-200">
                        Native
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {lang.isNative ? (
                    <div className="flex h-8 w-10 items-center justify-center rounded bg-sky-600 text-sm font-bold text-white">
                      N
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleLanguageChange(index, lang.rating - 1)}
                        disabled={lang.rating <= 1}
                        className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                          lang.rating > 1
                            ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                            : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                        }`}
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>

                      <div className="flex h-8 w-10 items-center justify-center rounded bg-sky-500 text-sm font-bold text-white">
                        {lang.rating}
                      </div>

                      <button
                        onClick={() => handleLanguageChange(index, lang.rating + 1)}
                        disabled={lang.rating >= MAX_SKILL_RATING || knowledgePointsRemaining <= 0}
                        className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                          lang.rating < MAX_SKILL_RATING && knowledgePointsRemaining > 0
                            ? "bg-sky-500 text-white hover:bg-sky-600"
                            : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                        }`}
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleRemoveLanguage(index)}
                    className="ml-2 flex h-7 w-7 items-center justify-center rounded bg-red-100 text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("active")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
              activeTab === "active"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            Active Skills
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              activeTab === "active"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}>
              {skillPointsRemaining}/{skillPoints}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
              activeTab === "knowledge"
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            Knowledge Skills
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              activeTab === "knowledge"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}>
              {knowledgeSkills.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("language")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
              activeTab === "language"
                ? "border-sky-500 text-sky-600 dark:text-sky-400"
                : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            Languages
            <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              activeTab === "language"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}>
              {languages.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "active" && renderActiveSkillsTab()}
        {activeTab === "knowledge" && renderKnowledgeSkillsTab()}
        {activeTab === "language" && renderLanguageSkillsTab()}
      </div>
    </div>
  );
}
