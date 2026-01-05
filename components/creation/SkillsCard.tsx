"use client";

/**
 * SkillsCard
 *
 * Modal-based skill allocation for character creation.
 * Uses modals for adding skills/groups similar to Qualities.
 *
 * Features:
 * - Dual budget progress bars (Skill Points + Group Points)
 * - Modal-based skill/group selection
 * - Multi-specialization support with suggestions and custom entry
 * - Inline rating adjustment for selected skills
 * - Specialization karma cost tracking (7 karma each)
 */

import { useMemo, useCallback, useState } from "react";
import { useSkills } from "@/lib/rules";
import type { CreationState } from "@/lib/types";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard } from "./shared";
import { SkillModal, SkillGroupModal } from "./skills";
import {
  Minus,
  Plus,
  Users,
  BookOpen,
  X,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Star,
} from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_SKILL_RATING = 6;
const MAX_GROUP_RATING = 6;
const KARMA_PER_SPECIALIZATION = 7;

// =============================================================================
// TYPES
// =============================================================================

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
  overflowLabel,
}: {
  label: string;
  description: string;
  spent: number;
  total: number;
  isOver: boolean;
  overflowLabel?: string;
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
      {isOver && overflowLabel && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>{overflowLabel}</span>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SKILL GROUP CARD COMPONENT
// =============================================================================

function SkillGroupCard({
  groupName,
  skills,
  rating,
  maxRating,
  canIncrease,
  onRatingChange,
  onRemove,
}: {
  groupName: string;
  skills: { id: string; name: string; linkedAttribute: string }[];
  rating: number;
  maxRating: number;
  canIncrease: boolean;
  onRatingChange: (delta: number) => void;
  onRemove: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAtMax = rating >= maxRating;

  return (
    <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          <Users className="h-4 w-4 text-purple-500" />
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {groupName}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            ({skills.length} skills)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isAtMax && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              MAX
            </span>
          )}
          <button
            onClick={() => onRatingChange(-1)}
            disabled={rating <= 1}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              rating > 1
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex h-8 w-10 items-center justify-center rounded bg-white text-base font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            {rating}
          </div>
          <button
            onClick={() => onRatingChange(1)}
            disabled={!canIncrease || isAtMax}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              canIncrease && !isAtMax
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            className="ml-1 rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 border-t border-purple-200 pt-2 dark:border-purple-800">
          <div className="flex flex-wrap gap-1">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
              >
                {skill.name}{" "}
                <span className="text-purple-500">
                  ({skill.linkedAttribute.toUpperCase().slice(0, 3)})
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// INDIVIDUAL SKILL CARD COMPONENT
// =============================================================================

function IndividualSkillCard({
  skillName,
  linkedAttribute,
  groupName,
  rating,
  maxRating,
  specializations,
  canIncrease,
  onRatingChange,
  onRemoveSpecialization,
  onRemove,
}: {
  skillName: string;
  linkedAttribute: string;
  groupName?: string;
  rating: number;
  maxRating: number;
  specializations: string[];
  canIncrease: boolean;
  onRatingChange: (delta: number) => void;
  onRemoveSpecialization: (spec: string) => void;
  onRemove: () => void;
}) {
  const isAtMax = rating >= maxRating;
  const hasSpecs = specializations.length > 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-500" />
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {skillName}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {linkedAttribute.toUpperCase().slice(0, 3)}
          </span>
          {groupName && (
            <span className="text-xs text-zinc-400">({groupName})</span>
          )}
          {hasSpecs && (
            <span title="Has specializations">
              <Star className="h-3.5 w-3.5 text-amber-500" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAtMax && (
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              MAX
            </span>
          )}
          <button
            onClick={() => onRatingChange(-1)}
            disabled={rating <= 1}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              rating > 1
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
            onClick={() => onRatingChange(1)}
            disabled={!canIncrease || isAtMax}
            className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
              canIncrease && !isAtMax
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            className="ml-1 rounded p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Specializations */}
      {hasSpecs && (
        <div className="mt-2 flex flex-wrap gap-1">
          {specializations.map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
            >
              {spec}
              <button
                onClick={() => onRemoveSpecialization(spec)}
                className="ml-0.5 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
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

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Get character's magical path
  const magicPath = state.selections["magical-path"] as string | undefined;
  const hasMagic =
    magicPath &&
    ["magician", "aspected-mage", "mystic-adept", "adept"].includes(magicPath);
  const hasResonance = magicPath === "technomancer";

  // Get current skill values from state
  const skills = useMemo(() => {
    return (state.selections.skills || {}) as Record<string, number>;
  }, [state.selections.skills]);

  // Get current skill group values from state
  const groups = useMemo(() => {
    return (state.selections.skillGroups || {}) as Record<string, number>;
  }, [state.selections.skillGroups]);

  // Get specializations (now supports multiple per skill)
  const specializations = useMemo(() => {
    return (state.selections.skillSpecializations || {}) as Record<
      string,
      string[]
    >;
  }, [state.selections.skillSpecializations]);

  // Calculate points spent
  const skillPointsSpent = useMemo(() => {
    return Object.values(skills).reduce((sum, rating) => sum + rating, 0);
  }, [skills]);

  const groupPointsSpent = useMemo(() => {
    return Object.values(groups).reduce((sum, rating) => sum + rating, 0);
  }, [groups]);

  // Calculate specialization karma cost
  const totalSpecializations = useMemo(() => {
    return Object.values(specializations).reduce(
      (sum, specs) => sum + specs.length,
      0
    );
  }, [specializations]);

  const specializationKarmaCost = totalSpecializations * KARMA_PER_SPECIALIZATION;

  const skillPointsRemaining = skillPoints - skillPointsSpent;
  const groupPointsRemaining = skillGroupPoints - groupPointsSpent;
  const isSkillsOverBudget = skillPointsRemaining < 0;
  const isGroupsOverBudget = groupPointsRemaining < 0;

  // Get existing skill IDs (skills that are in selected groups)
  const skillsInGroups = useMemo(() => {
    const skillIds: string[] = [];
    Object.keys(groups).forEach((groupId) => {
      const group = skillGroups.find((g) => g.id === groupId);
      if (group) {
        skillIds.push(...group.skills);
      }
    });
    return skillIds;
  }, [groups, skillGroups]);

  // Handle adding a skill from modal
  const handleAddSkill = useCallback(
    (skillId: string, rating: number, specs: string[]) => {
      const newSkills = { ...skills, [skillId]: rating };
      const newSpecs = { ...specializations };
      if (specs.length > 0) {
        newSpecs[skillId] = specs;
      }

      updateState({
        selections: {
          ...state.selections,
          skills: newSkills,
          skillSpecializations: newSpecs,
        },
      });
      setIsSkillModalOpen(false);
    },
    [skills, specializations, state.selections, updateState]
  );

  // Handle adding a skill group from modal
  const handleAddGroup = useCallback(
    (groupId: string, rating: number) => {
      const newGroups = { ...groups, [groupId]: rating };

      // Remove any individual skills that are in this group
      const group = skillGroups.find((g) => g.id === groupId);
      const newSkills = { ...skills };
      const newSpecs = { ...specializations };

      if (group) {
        group.skills.forEach((skillId) => {
          delete newSkills[skillId];
          delete newSpecs[skillId];
        });
      }

      updateState({
        selections: {
          ...state.selections,
          skillGroups: newGroups,
          skills: newSkills,
          skillSpecializations: newSpecs,
        },
      });
      setIsGroupModalOpen(false);
    },
    [groups, skills, specializations, skillGroups, state.selections, updateState]
  );

  // Handle skill rating change
  const handleSkillRatingChange = useCallback(
    (skillId: string, delta: number) => {
      const currentRating = skills[skillId] || 0;
      const newRating = currentRating + delta;

      if (newRating < 1 || newRating > MAX_SKILL_RATING) return;

      const newSkills = { ...skills, [skillId]: newRating };
      updateState({
        selections: {
          ...state.selections,
          skills: newSkills,
        },
      });
    },
    [skills, state.selections, updateState]
  );

  // Handle skill group rating change
  const handleGroupRatingChange = useCallback(
    (groupId: string, delta: number) => {
      const currentRating = groups[groupId] || 0;
      const newRating = currentRating + delta;

      if (newRating < 1 || newRating > MAX_GROUP_RATING) return;

      const newGroups = { ...groups, [groupId]: newRating };
      updateState({
        selections: {
          ...state.selections,
          skillGroups: newGroups,
        },
      });
    },
    [groups, state.selections, updateState]
  );

  // Handle removing a skill
  const handleRemoveSkill = useCallback(
    (skillId: string) => {
      const newSkills = { ...skills };
      delete newSkills[skillId];

      const newSpecs = { ...specializations };
      delete newSpecs[skillId];

      updateState({
        selections: {
          ...state.selections,
          skills: newSkills,
          skillSpecializations: newSpecs,
        },
      });
    },
    [skills, specializations, state.selections, updateState]
  );

  // Handle removing a skill group
  const handleRemoveGroup = useCallback(
    (groupId: string) => {
      const newGroups = { ...groups };
      delete newGroups[groupId];

      updateState({
        selections: {
          ...state.selections,
          skillGroups: newGroups,
        },
      });
    },
    [groups, state.selections, updateState]
  );

  // Handle removing a specialization
  const handleRemoveSpecialization = useCallback(
    (skillId: string, spec: string) => {
      const currentSpecs = specializations[skillId] || [];
      const newSpecs = currentSpecs.filter((s) => s !== spec);

      const newSpecializations = { ...specializations };
      if (newSpecs.length === 0) {
        delete newSpecializations[skillId];
      } else {
        newSpecializations[skillId] = newSpecs;
      }

      updateState({
        selections: {
          ...state.selections,
          skillSpecializations: newSpecializations,
        },
      });
    },
    [specializations, state.selections, updateState]
  );

  // Get skill data by ID
  const getSkillData = useCallback(
    (skillId: string) => {
      return activeSkills.find((s) => s.id === skillId);
    },
    [activeSkills]
  );

  // Get group data by ID
  const getGroupData = useCallback(
    (groupId: string) => {
      return skillGroups.find((g) => g.id === groupId);
    },
    [skillGroups]
  );

  // Get group name for a skill
  const getSkillGroupName = useCallback(
    (skillId: string): string | undefined => {
      const group = skillGroups.find((g) => g.skills.includes(skillId));
      return group?.name;
    },
    [skillGroups]
  );

  // Get validation status
  const validationStatus = useMemo(() => {
    if (isSkillsOverBudget || isGroupsOverBudget) return "warning";
    if (skillPointsRemaining === 0 && groupPointsRemaining === 0) return "valid";
    if (skillPointsSpent > 0 || groupPointsSpent > 0) return "warning";
    return "pending";
  }, [
    isSkillsOverBudget,
    isGroupsOverBudget,
    skillPointsRemaining,
    groupPointsRemaining,
    skillPointsSpent,
    groupPointsSpent,
  ]);

  // Check if priority is set
  const hasPriority = !!state.priorities?.skills;

  if (!hasPriority) {
    return (
      <CreationCard
        title="Skills"
        description="Awaiting priority"
        status="pending"
      >
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
              <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Skill Points
              </div>
              <div className="mt-1 text-xs text-zinc-400">
                Set skills priority to unlock
              </div>
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

  const hasSelectedSkills = Object.keys(skills).length > 0;
  const hasSelectedGroups = Object.keys(groups).length > 0;

  return (
    <>
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
              overflowLabel={
                isSkillsOverBudget
                  ? `${Math.abs(skillPointsRemaining)} over budget`
                  : undefined
              }
            />
            <BudgetProgressBar
              label="Group Points"
              description="For skill groups"
              spent={groupPointsSpent}
              total={skillGroupPoints}
              isOver={isGroupsOverBudget}
              overflowLabel={
                isGroupsOverBudget
                  ? `${Math.abs(groupPointsRemaining)} over budget`
                  : undefined
              }
            />
          </div>

          {/* Specialization karma cost */}
          {totalSpecializations > 0 && (
            <div className="rounded-lg bg-amber-50 p-2 text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              <Star className="mr-1 inline h-4 w-4" />
              {totalSpecializations} specialization
              {totalSpecializations !== 1 ? "s" : ""} = {specializationKarmaCost}{" "}
              karma
            </div>
          )}

          {/* Add buttons */}
          <div className="flex gap-2">
            {skillGroupPoints > 0 && (
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-dashed border-purple-300 bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition-colors hover:border-purple-400 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:border-purple-600 dark:hover:bg-purple-900/30"
              >
                <Plus className="h-4 w-4" />
                Add Skill Group
              </button>
            )}
            <button
              onClick={() => setIsSkillModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:border-blue-400 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:border-blue-600 dark:hover:bg-blue-900/30"
            >
              <Plus className="h-4 w-4" />
              Add Skill
            </button>
          </div>

          {/* Skill Groups Section */}
          {hasSelectedGroups && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Skill Groups
              </h4>
              <div className="space-y-2">
                {Object.entries(groups).map(([groupId, rating]) => {
                  const groupData = getGroupData(groupId);
                  if (!groupData) return null;

                  const skillsInGroup = groupData.skills
                    .map((skillId) => getSkillData(skillId))
                    .filter(Boolean) as {
                    id: string;
                    name: string;
                    linkedAttribute: string;
                  }[];

                  return (
                    <SkillGroupCard
                      key={groupId}
                      groupName={groupData.name}
                      skills={skillsInGroup}
                      rating={rating}
                      maxRating={MAX_GROUP_RATING}
                      canIncrease={groupPointsRemaining > 0}
                      onRatingChange={(delta) =>
                        handleGroupRatingChange(groupId, delta)
                      }
                      onRemove={() => handleRemoveGroup(groupId)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Individual Skills Section */}
          {hasSelectedSkills && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Individual Skills
              </h4>
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {Object.entries(skills).map(([skillId, rating]) => {
                  const skillData = getSkillData(skillId);
                  if (!skillData) return null;

                  const skillSpecs = specializations[skillId] || [];
                  const groupName = getSkillGroupName(skillId);

                  return (
                    <IndividualSkillCard
                      key={skillId}
                      skillName={skillData.name}
                      linkedAttribute={skillData.linkedAttribute}
                      groupName={groupName}
                      rating={rating}
                      maxRating={MAX_SKILL_RATING}
                      specializations={skillSpecs}
                      canIncrease={skillPointsRemaining > 0}
                      onRatingChange={(delta) =>
                        handleSkillRatingChange(skillId, delta)
                      }
                      onRemoveSpecialization={(spec) =>
                        handleRemoveSpecialization(skillId, spec)
                      }
                      onRemove={() => handleRemoveSkill(skillId)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!hasSelectedSkills && !hasSelectedGroups && (
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-6 text-center dark:border-zinc-700">
              <BookOpen className="mx-auto h-8 w-8 text-zinc-400" />
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                No skills selected yet
              </p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                Use the buttons above to add skill groups or individual skills
              </p>
            </div>
          )}

          {/* Summary */}
          {(hasSelectedSkills || hasSelectedGroups) && (
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                {hasSelectedGroups && (
                  <span>
                    {Object.keys(groups).length} group
                    {Object.keys(groups).length !== 1 ? "s" : ""}
                  </span>
                )}
                {hasSelectedSkills && (
                  <span>
                    {Object.keys(skills).length} skill
                    {Object.keys(skills).length !== 1 ? "s" : ""}
                  </span>
                )}
                {totalSpecializations > 0 && (
                  <span className="text-amber-600 dark:text-amber-400">
                    {totalSpecializations} spec
                    {totalSpecializations !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </CreationCard>

      {/* Modals */}
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onAdd={handleAddSkill}
        existingSkillIds={[...Object.keys(skills), ...skillsInGroups]}
        existingGroupIds={Object.keys(groups)}
        skillGroups={skillGroups}
        hasMagic={!!hasMagic}
        hasResonance={!!hasResonance}
        remainingPoints={skillPointsRemaining}
      />

      <SkillGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onAdd={handleAddGroup}
        existingGroupIds={Object.keys(groups)}
        existingSkillIds={Object.keys(skills)}
        hasMagic={!!hasMagic}
        hasResonance={!!hasResonance}
        remainingGroupPoints={groupPointsRemaining}
      />
    </>
  );
}
