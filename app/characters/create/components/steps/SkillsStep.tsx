"use client";

import { useMemo, useCallback, useState } from "react";
import { useSkills } from "@/lib/rules";
import type { CreationState } from "@/lib/types";

interface StepProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
  budgetValues: Record<string, number>;
}

type SkillCategory = "combat" | "physical" | "social" | "technical" | "vehicle" | "magical" | "resonance";

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  combat: "Combat",
  physical: "Physical",
  social: "Social",
  technical: "Technical",
  vehicle: "Vehicle",
  magical: "Magical",
  resonance: "Resonance",
};

const MAX_SKILL_RATING = 6; // At character creation

export function SkillsStep({ state, updateState, budgetValues }: StepProps) {
  const { activeSkills, skillGroups } = useSkills();
  const skillPoints = budgetValues["skill-points"] || 0;
  const skillGroupPoints = budgetValues["skill-group-points"] || 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | "all">("all");

  // Get current skill values from state
  const skills = useMemo(() => {
    return (state.selections.skills || {}) as Record<string, number>;
  }, [state.selections.skills]);

  // Get current skill group values from state
  const groups = useMemo(() => {
    return (state.selections.skillGroups || {}) as Record<string, number>;
  }, [state.selections.skillGroups]);

  // Calculate points spent
  const skillPointsSpent = useMemo(() => {
    return Object.values(skills).reduce((sum, val) => sum + val, 0);
  }, [skills]);

  const groupPointsSpent = useMemo(() => {
    return Object.values(groups).reduce((sum, val) => sum + val, 0);
  }, [groups]);

  const skillPointsRemaining = skillPoints - skillPointsSpent;
  const groupPointsRemaining = skillGroupPoints - groupPointsSpent;

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

  return (
    <div className="space-y-6">
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
              style={{ width: `${(skillPointsSpent / skillPoints) * 100}%` }}
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
    </div>
  );
}
