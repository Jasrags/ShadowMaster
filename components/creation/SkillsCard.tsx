"use client";

/**
 * SkillsCard
 *
 * Card for skill allocation in sheet-driven creation.
 * Matches UI mocks from docs/prompts/design/character-sheet-creation-mode.md
 *
 * Features:
 * - Dual budget progress bars (Skill Points + Group Points)
 * - Skills grouped by category with section headers
 * - Skill rows with linked attribute and group info
 * - MAX badge when at maximum rating
 * - Specialization support
 * - Karma conversion for over-budget
 */

import { useMemo, useCallback, useState } from "react";
import { useSkills } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "./shared";
import { Lock, Minus, Plus, Search, ChevronDown, ChevronRight, Star, AlertTriangle } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

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

const CATEGORY_ORDER: SkillCategory[] = ["combat", "physical", "social", "technical", "vehicle", "magical", "resonance"];

const MAX_SKILL_RATING = 6;
const KARMA_PER_SKILL_POINT = 2;

interface SkillsCardProps {
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
  karmaPerPoint,
  compact = false,
}: {
  label: string;
  description: string;
  spent: number;
  total: number;
  isOver: boolean;
  karmaPerPoint?: number;
  compact?: boolean;
}) {
  const remaining = total - spent;
  const percentage = total > 0 ? Math.min(100, (spent / total) * 100) : 0;

  if (total === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </div>
        <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          No points available
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-3 ${
      isOver
        ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20"
        : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50"
    }`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </div>
        <div className={`text-lg font-bold ${
          isOver
            ? "text-amber-600 dark:text-amber-400"
            : remaining === 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-zinc-900 dark:text-zinc-100"
        }`}>
          {remaining}
        </div>
      </div>

      {!compact && (
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {description}
        </div>
      )}

      <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="float-right">of {total}</span>
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
      {isOver && karmaPerPoint && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>
            {Math.abs(remaining)} over → {Math.abs(remaining) * karmaPerPoint} karma
          </span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SKILL ROW COMPONENT
// =============================================================================

function SkillRow({
  name,
  linkedAttribute,
  groupName,
  rating,
  hasSpec,
  isFreeSkill,
  freeRating,
  isAtMax,
  canIncrease,
  canDecrease,
  onIncrease,
  onDecrease,
}: {
  name: string;
  linkedAttribute: string;
  groupName?: string;
  rating: number;
  hasSpec: boolean;
  isFreeSkill: boolean;
  freeRating?: number;
  isAtMax: boolean;
  canIncrease: boolean;
  canDecrease: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {name}
          </span>
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {linkedAttribute}
          </span>
          {hasSpec && (
            <span title="Has specialization">
              <Star className="h-3.5 w-3.5 text-amber-500" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isFreeSkill && freeRating && (
            <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
              Free {freeRating}
            </span>
          )}
          {isAtMax && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              MAX
            </span>
          )}
        </div>
      </div>

      {/* Group info */}
      {groupName && (
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Group: {groupName}
        </div>
      )}

      {/* Controls */}
      <div className="mt-2 flex items-center justify-end gap-2">
        <button
          onClick={onDecrease}
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
          {rating}
        </div>

        <button
          onClick={onIncrease}
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
// MAIN COMPONENT
// =============================================================================

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
  const [showGroups, setShowGroups] = useState(true);

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
  const isSkillsOverBudget = skillPointsRemaining < 0;
  const isGroupsOverBudget = groupPointsRemaining < 0;

  // Filter skills based on magic/resonance access and search
  const filteredSkills = useMemo(() => {
    return activeSkills.filter((skill) => {
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
  }, [activeSkills, hasMagic, hasResonance, selectedCategory, searchQuery]);

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, typeof filteredSkills> = {};
    filteredSkills.forEach((skill) => {
      const cat = skill.category || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(skill);
    });
    return grouped;
  }, [filteredSkills]);

  // Filter skill groups
  const filteredGroups = useMemo(() => {
    return skillGroups.filter((group) => {
      if (["sorcery", "conjuring", "enchanting"].includes(group.id) && !hasMagic) return false;
      if (group.id === "tasking" && !hasResonance) return false;
      return true;
    });
  }, [skillGroups, hasMagic, hasResonance]);

  // Get group name for a skill
  const getSkillGroupName = useCallback(
    (skillId: string): string | undefined => {
      const group = skillGroups.find((g) => g.skills.includes(skillId));
      return group?.name;
    },
    [skillGroups]
  );

  // Handle skill rating change
  const handleSkillChange = useCallback(
    (skillId: string, delta: number) => {
      const currentRating = skills[skillId] || 0;
      const newRating = currentRating + delta;

      if (newRating < 0 || newRating > MAX_SKILL_RATING) return;

      const newSkills = { ...skills };
      if (newRating === 0) {
        delete newSkills[skillId];
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
            "skill-points-spent": skillPointsSpent + delta - (specializations[skillId] ? 1 : 0),
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
    [skills, specializations, skillPointsSpent, state.selections, state.budgets, updateState]
  );

  // Handle skill group rating change
  const handleGroupChange = useCallback(
    (groupId: string, delta: number) => {
      const currentRating = groups[groupId] || 0;
      const newRating = currentRating + delta;

      if (newRating < 0 || newRating > MAX_SKILL_RATING) return;

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
    [groups, groupPointsSpent, state.selections, state.budgets, updateState]
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
    if (isSkillsOverBudget || isGroupsOverBudget) return "warning";
    if (skillPointsRemaining === 0 && groupPointsRemaining === 0) return "valid";
    if (skillPointsSpent > 0 || groupPointsSpent > 0) return "warning";
    return "pending";
  }, [isSkillsOverBudget, isGroupsOverBudget, skillPointsRemaining, groupPointsRemaining, skillPointsSpent, groupPointsSpent]);

  // Check if priority is set
  const hasPriority = !!state.priorities?.skills;

  if (!hasPriority) {
    return (
      <CreationCard title="Skills" description="Awaiting priority" status="pending">
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Skill Points
              </div>
              <div className="mt-1 text-xs text-zinc-400">Set skills priority to unlock</div>
              <div className="mt-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Skill Group Points
              </div>
              <div className="mt-1 text-xs text-zinc-400">For skill groups</div>
              <div className="mt-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            </div>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Skills locked until priorities are configured.
          </p>
        </div>
      </CreationCard>
    );
  }

  return (
    <CreationCard
      title="Skills"
      description={
        skillPointsRemaining === 0 && groupPointsRemaining === 0
          ? "All points allocated"
          : `${skillPointsRemaining} skill pts, ${groupPointsRemaining} group pts remaining`
      }
      status={validationStatus}
    >
      <div className="space-y-4">
        {/* Budget indicators */}
        <div className="grid gap-2 sm:grid-cols-2">
          <BudgetProgressBar
            label="Skill Points"
            description="For individual skills"
            spent={skillPointsSpent}
            total={skillPoints}
            isOver={isSkillsOverBudget}
            karmaPerPoint={KARMA_PER_SKILL_POINT}
          />
          <BudgetProgressBar
            label="Skill Group Points"
            description="For skill groups"
            spent={groupPointsSpent}
            total={skillGroupPoints}
            isOver={isGroupsOverBudget}
            karmaPerPoint={KARMA_PER_SKILL_POINT}
          />
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
            <button
              onClick={() => setShowGroups(!showGroups)}
              className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              {showGroups ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Skill Groups
            </button>

            {showGroups && (
              <div className="space-y-2 text-sm">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Increase all skills in a group at once. Cannot have individual ratings.
                </p>
                {filteredGroups.map((group) => {
                  const rating = groups[group.id] || 0;
                  const isExpanded = expandedGroups.has(group.id);
                  const isAtMax = rating >= MAX_SKILL_RATING;
                  const canIncrease = rating < MAX_SKILL_RATING;
                  const canDecrease = rating > 0;

                  return (
                    <div key={group.id} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleGroupExpand(group.id)}
                          className="flex items-center gap-2 text-left"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-zinc-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-zinc-400" />
                          )}
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {group.name}
                          </span>
                        </button>

                        <div className="flex items-center gap-2">
                          {isAtMax && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                              MAX
                            </span>
                          )}
                          <button
                            onClick={() => handleGroupChange(group.id, -1)}
                            disabled={!canDecrease}
                            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                              canDecrease
                                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                            }`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <div className="flex h-8 w-10 items-center justify-center rounded bg-zinc-100 text-base font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                            {rating}
                          </div>
                          <button
                            onClick={() => handleGroupChange(group.id, 1)}
                            disabled={!canIncrease || groupPointsRemaining <= 0}
                            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                              canIncrease && groupPointsRemaining > 0
                                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
                            }`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-2 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            Skills: {group.skills.map((s) => {
                              const skill = activeSkills.find((sk) => sk.id === s);
                              return skill?.name;
                            }).filter(Boolean).join(", ")}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Individual Skills by Category */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Active Skills
          </h4>

          <div className="max-h-96 space-y-4 overflow-y-auto">
            {CATEGORY_ORDER.filter((cat) => skillsByCategory[cat]?.length > 0).map((category) => (
              <div key={category}>
                <div className="mb-2 border-b border-zinc-200 pb-1 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                  {CATEGORY_LABELS[category]}
                </div>
                <div className="space-y-2">
                  {skillsByCategory[category].map((skill) => {
                    const rating = skills[skill.id] || 0;
                    const hasSpec = !!specializations[skill.id];
                    const groupName = getSkillGroupName(skill.id);
                    const isAtMax = rating >= MAX_SKILL_RATING;
                    const canIncrease = rating < MAX_SKILL_RATING;
                    const canDecrease = rating > 0;

                    return (
                      <SkillRow
                        key={skill.id}
                        name={skill.name}
                        linkedAttribute={skill.linkedAttribute?.toUpperCase().slice(0, 3) || ""}
                        groupName={groupName}
                        rating={rating}
                        hasSpec={hasSpec}
                        isFreeSkill={false}
                        isAtMax={isAtMax}
                        canIncrease={canIncrease}
                        canDecrease={canDecrease}
                        onIncrease={() => handleSkillChange(skill.id, 1)}
                        onDecrease={() => handleSkillChange(skill.id, -1)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        {(Object.keys(skills).length > 0 || Object.keys(groups).length > 0) && (
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
