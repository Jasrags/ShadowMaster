"use client";

/**
 * SkillsCard
 *
 * Compact card for skill allocation in sheet-driven creation.
 * Supports active skills, skill groups, and specializations.
 *
 * Features:
 * - Skill list with rating selectors
 * - Skill group section
 * - Specialization management
 * - Points remaining display (skill points + group points)
 */

import { useMemo, useCallback, useState } from "react";
import { useSkills } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator } from "./shared";
import { Lock, Minus, Plus, Search, ChevronDown, ChevronRight, Star } from "lucide-react";

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

const MAX_SKILL_RATING = 6;

interface SkillsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

export function SkillsCard({ state, updateState }: SkillsCardProps) {
  const { activeSkills, skillGroups } = useSkills();
  const { getBudget } = useCreationBudgets();
  const skillBudget = getBudget("skill-points");
  const groupBudget = getBudget("skill-group-points");

  const skillPoints = skillBudget?.total || 0;
  const skillGroupPoints = groupBudget?.total || 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | "all">("all");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Get character's magical path
  const magicPath = state.selections["magical-path"] as string | undefined;
  const hasMagic = magicPath && ["magician", "aspected-mage", "mystic-adept", "adept"].includes(magicPath);
  const hasResonance = magicPath === "technomancer";

  // Get current skill values from state
  const skills = useMemo(() => {
    return (state.selections.skills || {}) as Record<string, number>;
  }, [state.selections.skills]);

  // Get current skill group values from state
  const groups = useMemo(() => {
    return (state.selections.skillGroups || {}) as Record<string, number>;
  }, [state.selections.skillGroups]);

  // Get specializations
  const specializations = useMemo(() => {
    return (state.selections.skillSpecializations || {}) as Record<string, string>;
  }, [state.selections.skillSpecializations]);

  // Calculate points spent
  const skillPointsSpent = useMemo(() => {
    const skillsTotal = Object.values(skills).reduce((sum, rating) => sum + rating, 0);
    const specsTotal = Object.keys(specializations).length;
    return skillsTotal + specsTotal;
  }, [skills, specializations]);

  const groupPointsSpent = useMemo(() => {
    return Object.values(groups).reduce((sum, rating) => sum + rating, 0);
  }, [groups]);

  const skillPointsRemaining = skillPoints - skillPointsSpent;
  const groupPointsRemaining = skillGroupPoints - groupPointsSpent;

  // Filter skills based on magic/resonance access and search
  const filteredSkills = useMemo(() => {
    const filtered = activeSkills.filter((skill) => {
      // Filter by magic/resonance requirements
      if (skill.requiresMagic && !hasMagic) return false;
      if (skill.requiresResonance && !hasResonance) return false;

      // Filter by category
      if (selectedCategory !== "all" && skill.category !== selectedCategory) return false;

      // Filter by search
      if (searchQuery) {
        return skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    });

    return filtered;
  }, [activeSkills, hasMagic, hasResonance, selectedCategory, searchQuery]);

  // Filter skill groups
  const filteredGroups = useMemo(() => {
    return skillGroups.filter((group) => {
      // Filter magical/resonance skill groups
      if (["sorcery", "conjuring", "enchanting"].includes(group.id) && !hasMagic) return false;
      if (group.id === "tasking" && !hasResonance) return false;
      return true;
    });
  }, [skillGroups, hasMagic, hasResonance]);

  // Handle skill rating change
  const handleSkillChange = useCallback(
    (skillId: string, delta: number) => {
      const currentRating = skills[skillId] || 0;
      const newRating = currentRating + delta;

      // Validate
      if (newRating < 0 || newRating > MAX_SKILL_RATING) return;
      if (delta > 0 && skillPointsRemaining < delta) return;

      const newSkills = { ...skills };
      if (newRating === 0) {
        delete newSkills[skillId];
        // Also remove specialization if skill is removed
        const newSpecs = { ...specializations };
        delete newSpecs[skillId];
        updateState({
          selections: {
            ...state.selections,
            skills: newSkills,
            skillSpecializations: newSpecs,
          },
          budgets: {
            ...state.budgets,
            "skill-points-spent": skillPointsSpent + delta - (newSpecs[skillId] ? 1 : 0),
          },
        });
      } else {
        newSkills[skillId] = newRating;
        updateState({
          selections: {
            ...state.selections,
            skills: newSkills,
          },
          budgets: {
            ...state.budgets,
            "skill-points-spent": skillPointsSpent + delta,
          },
        });
      }
    },
    [skills, specializations, skillPointsRemaining, skillPointsSpent, state.selections, state.budgets, updateState]
  );

  // Handle skill group rating change
  const handleGroupChange = useCallback(
    (groupId: string, delta: number) => {
      const currentRating = groups[groupId] || 0;
      const newRating = currentRating + delta;

      if (newRating < 0 || newRating > MAX_SKILL_RATING) return;
      if (delta > 0 && groupPointsRemaining < delta) return;

      const newGroups = { ...groups };
      if (newRating === 0) {
        delete newGroups[groupId];
      } else {
        newGroups[groupId] = newRating;
      }

      updateState({
        selections: {
          ...state.selections,
          skillGroups: newGroups,
        },
        budgets: {
          ...state.budgets,
          "skill-group-points-spent": groupPointsSpent + delta,
        },
      });
    },
    [groups, groupPointsRemaining, groupPointsSpent, state.selections, state.budgets, updateState]
  );

  // Toggle group expansion
  const toggleGroupExpand = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // Get validation status
  const validationStatus = useMemo(() => {
    if (skillPointsRemaining === 0 && groupPointsRemaining === 0) return "valid";
    if (skillPointsSpent > 0 || groupPointsSpent > 0) return "warning";
    return "pending";
  }, [skillPointsRemaining, groupPointsRemaining, skillPointsSpent, groupPointsSpent]);

  // Check if priority is set
  const hasPriority = !!state.priorities?.skills;

  if (!hasPriority) {
    return (
      <CreationCard title="Skills" description="Allocate skill points" status="pending">
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-zinc-200 p-4 text-center dark:border-zinc-700">
          <Lock className="h-5 w-5 text-zinc-400" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Set Skills priority first
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Skills"
      description={`${filteredSkills.length} skills available`}
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Budget indicators */}
        <div className="grid gap-2 sm:grid-cols-2">
          <BudgetIndicator
            label="Skill Points"
            remaining={skillPointsRemaining}
            total={skillPoints}
            compact
          />
          {skillGroupPoints > 0 && (
            <BudgetIndicator
              label="Group Points"
              remaining={groupPointsRemaining}
              total={skillGroupPoints}
              compact
            />
          )}
        </div>

        {/* Search and filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as SkillCategory | "all")}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="all">All</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Skill Groups */}
        {skillGroupPoints > 0 && filteredGroups.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Skill Groups
            </h4>
            <div className="space-y-1">
              {filteredGroups.map((group) => {
                const rating = groups[group.id] || 0;
                const isExpanded = expandedGroups.has(group.id);

                return (
                  <div key={group.id}>
                    <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
                      <button
                        onClick={() => toggleGroupExpand(group.id)}
                        className="flex items-center gap-2 text-left"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3 w-3 text-zinc-400" />
                        ) : (
                          <ChevronRight className="h-3 w-3 text-zinc-400" />
                        )}
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {group.name}
                        </span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleGroupChange(group.id, -1)}
                          disabled={rating === 0}
                          className={`flex h-5 w-5 items-center justify-center rounded text-xs transition-colors ${
                            rating > 0
                              ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <div className="w-6 text-center text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {rating}
                        </div>
                        <button
                          onClick={() => handleGroupChange(group.id, 1)}
                          disabled={rating >= MAX_SKILL_RATING || groupPointsRemaining === 0}
                          className={`flex h-5 w-5 items-center justify-center rounded text-xs transition-colors ${
                            rating < MAX_SKILL_RATING && groupPointsRemaining > 0
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700">
                        {group.skills.map((skillId) => {
                          const skill = activeSkills.find((s) => s.id === skillId);
                          return skill ? (
                            <div
                              key={skillId}
                              className="flex items-center justify-between py-1 text-xs text-zinc-600 dark:text-zinc-400"
                            >
                              <span>{skill.name}</span>
                              <span className="text-zinc-400">{rating}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Individual Skills */}
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Active Skills ({filteredSkills.length})
          </h4>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {filteredSkills.map((skill) => {
              const rating = skills[skill.id] || 0;
              const hasSpec = !!specializations[skill.id];

              return (
                <div
                  key={skill.id}
                  className="flex items-center justify-between rounded bg-zinc-50 px-2 py-1.5 dark:bg-zinc-800/50"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-zinc-900 dark:text-zinc-100">
                      {skill.name}
                    </span>
                    {hasSpec && (
                      <span title="Has specialization">
                        <Star className="h-3 w-3 text-amber-500" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSkillChange(skill.id, -1)}
                      disabled={rating === 0}
                      className={`flex h-5 w-5 items-center justify-center rounded text-xs transition-colors ${
                        rating > 0
                          ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                      }`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <div className="w-6 text-center text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {rating}
                    </div>
                    <button
                      onClick={() => handleSkillChange(skill.id, 1)}
                      disabled={rating >= MAX_SKILL_RATING || skillPointsRemaining === 0}
                      className={`flex h-5 w-5 items-center justify-center rounded text-xs transition-colors ${
                        rating < MAX_SKILL_RATING && skillPointsRemaining > 0
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                      }`}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary of selected skills */}
        {Object.keys(skills).length > 0 && (
          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
              {Object.keys(skills).length} skill{Object.keys(skills).length !== 1 ? "s" : ""} selected
              {Object.keys(groups).length > 0 &&
                `, ${Object.keys(groups).length} group${Object.keys(groups).length !== 1 ? "s" : ""}`}
            </span>
          </div>
        )}
      </div>
    </CreationCard>
  );
}
