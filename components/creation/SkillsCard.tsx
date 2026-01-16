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
import { CreationCard, BudgetIndicator } from "./shared";
import { SkillModal, SkillGroupModal, SkillListItem } from "./skills";
import { Minus, Plus, Users, X, AlertTriangle, Star } from "lucide-react";

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

/** Unified entry for displaying all skills (individual and from groups) */
interface SkillListEntry {
  skillId: string;
  rating: number;
  source: { type: "individual" } | { type: "group"; groupId: string; groupName: string };
  specializations: string[];
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
  const isAtMax = rating >= maxRating;

  return (
    <div className="py-1.5">
      {/* Line 1: Group name and controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-purple-500" />
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{groupName}</span>
        </div>

        <div className="flex items-center gap-1">
          {isAtMax && (
            <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              MAX
            </span>
          )}
          <button
            onClick={() => onRatingChange(-1)}
            disabled={rating <= 1}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              rating > 1
                ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Minus className="h-3 w-3" />
          </button>
          <div className="flex h-7 w-8 items-center justify-center rounded bg-purple-100 text-sm font-bold text-purple-900 dark:bg-purple-900/50 dark:text-purple-100">
            {rating}
          </div>
          <button
            onClick={() => onRatingChange(1)}
            disabled={!canIncrease || isAtMax}
            className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
              canIncrease && !isAtMax
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "cursor-not-allowed bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600"
            }`}
          >
            <Plus className="h-3 w-3" />
          </button>
          {/* Separator */}
          <div className="mx-2 h-5 w-px bg-zinc-300 dark:bg-zinc-600" />
          <button
            onClick={onRemove}
            className="rounded p-1 text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Line 2: Skills in group (always visible) */}
      <div className="ml-5 mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
        {skills.map((skill) => skill.name).join(" • ")}
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

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Get character's magical path
  const magicPath = state.selections["magical-path"] as string | undefined;
  const hasMagic =
    magicPath && ["magician", "aspected-mage", "mystic-adept", "adept"].includes(magicPath);
  const hasResonance = magicPath === "technomancer";

  // Get incompetent group ID from negative qualities
  const incompetentGroupId = useMemo(() => {
    const negativeQualities = (state.selections.negativeQualities || []) as Array<{
      id?: string;
      qualityId: string;
      specification?: string;
    }>;
    const incompetentQuality = negativeQualities.find(
      (q) => q.qualityId === "incompetent" || q.id === "incompetent"
    );
    return incompetentQuality?.specification || undefined;
  }, [state.selections.negativeQualities]);

  // Get skills in the incompetent group (for conflict detection)
  const incompetentSkills = useMemo(() => {
    if (!incompetentGroupId) return new Set<string>();
    const group = skillGroups.find((g) => g.id === incompetentGroupId);
    return group ? new Set(group.skills) : new Set<string>();
  }, [incompetentGroupId, skillGroups]);

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
    return (state.selections.skillSpecializations || {}) as Record<string, string[]>;
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
    return Object.values(specializations).reduce((sum, specs) => sum + specs.length, 0);
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

  // Merged and sorted list of all skills (individual + from groups)
  const allSkillsSorted = useMemo((): SkillListEntry[] => {
    const entries: SkillListEntry[] = [];

    // Add individual skills
    Object.entries(skills).forEach(([skillId, rating]) => {
      entries.push({
        skillId,
        rating,
        source: { type: "individual" },
        specializations: specializations[skillId] || [],
      });
    });

    // Add skills from groups
    Object.entries(groups).forEach(([groupId, groupRating]) => {
      const groupData = skillGroups.find((g) => g.id === groupId);
      if (groupData) {
        groupData.skills.forEach((skillId) => {
          entries.push({
            skillId,
            rating: groupRating,
            source: { type: "group", groupId, groupName: groupData.name },
            specializations: [], // Group skills don't have specializations
          });
        });
      }
    });

    // Sort alphabetically by skill name
    entries.sort((a, b) => {
      const skillA = activeSkills.find((s) => s.id === a.skillId);
      const skillB = activeSkills.find((s) => s.id === b.skillId);
      const nameA = skillA?.name || "";
      const nameB = skillB?.name || "";
      return nameA.localeCompare(nameB);
    });

    return entries;
  }, [skills, groups, specializations, skillGroups, activeSkills]);

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

  // Detect conflicts between existing skills/groups and incompetent quality
  const incompetentConflicts = useMemo(() => {
    const conflicts: { skillIds: string[]; groupId: string | null } = {
      skillIds: [],
      groupId: null,
    };

    if (!incompetentGroupId) return conflicts;

    // Check if the incompetent group is selected as a skill group
    if (groups[incompetentGroupId]) {
      conflicts.groupId = incompetentGroupId;
    }

    // Check if any individual skills from the incompetent group are selected
    Object.keys(skills).forEach((skillId) => {
      if (incompetentSkills.has(skillId)) {
        conflicts.skillIds.push(skillId);
      }
    });

    return conflicts;
  }, [incompetentGroupId, incompetentSkills, skills, groups]);

  const hasIncompetentConflicts =
    incompetentConflicts.skillIds.length > 0 || incompetentConflicts.groupId !== null;

  // Get validation status
  const validationStatus = useMemo(() => {
    if (hasIncompetentConflicts) return "warning";
    if (isSkillsOverBudget || isGroupsOverBudget) return "warning";
    if (skillPointsRemaining === 0 && groupPointsRemaining === 0) return "valid";
    if (skillPointsSpent > 0 || groupPointsSpent > 0) return "warning";
    return "pending";
  }, [
    hasIncompetentConflicts,
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

  const hasSelectedGroups = Object.keys(groups).length > 0;

  return (
    <>
      <CreationCard title="Skills" status={validationStatus}>
        <div className="space-y-3">
          {/* Budget indicators */}
          <div className={`grid gap-3 ${skillGroupPoints > 0 ? "sm:grid-cols-2" : ""}`}>
            <BudgetIndicator
              label="Skill Points"
              tooltip="Points for individual skills"
              spent={skillPointsSpent}
              total={skillPoints}
              compact
            />
            {skillGroupPoints > 0 && (
              <BudgetIndicator
                label="Group Points"
                tooltip="Points for skill groups"
                spent={groupPointsSpent}
                total={skillGroupPoints}
                compact
              />
            )}
          </div>

          {/* Incompetent quality conflict warning */}
          {hasIncompetentConflicts && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                <div className="text-sm text-red-700 dark:text-red-300">
                  <strong>Incompetent Conflict:</strong> You have the Incompetent (
                  {skillGroups.find((g) => g.id === incompetentGroupId)?.name}) quality but have
                  selected skills from this group.
                  {incompetentConflicts.groupId && (
                    <div className="mt-1">
                      • Remove the{" "}
                      <strong>
                        {skillGroups.find((g) => g.id === incompetentConflicts.groupId)?.name}
                      </strong>{" "}
                      skill group
                    </div>
                  )}
                  {incompetentConflicts.skillIds.length > 0 && (
                    <div className="mt-1">
                      • Remove individual skill
                      {incompetentConflicts.skillIds.length !== 1 ? "s" : ""}:{" "}
                      {incompetentConflicts.skillIds
                        .map((id) => getSkillData(id)?.name || id)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Specialization karma cost */}
          {totalSpecializations > 0 && (
            <div className="rounded-lg bg-amber-50 p-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              <Star className="mr-1 inline h-3.5 w-3.5" />
              {totalSpecializations} specialization
              {totalSpecializations !== 1 ? "s" : ""} = {specializationKarmaCost} karma
            </div>
          )}

          {/* Skill Groups Section */}
          {skillGroupPoints > 0 && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Skill Groups
                </h4>
                <button
                  onClick={() => setIsGroupModalOpen(true)}
                  className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Group
                </button>
              </div>
              {hasSelectedGroups ? (
                <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
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
                        onRatingChange={(delta) => handleGroupRatingChange(groupId, delta)}
                        onRemove={() => handleRemoveGroup(groupId)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">No skill groups added</p>
                </div>
              )}
            </div>
          )}

          {/* Skills Section (Individual + Group Skills) */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Skills
              </h4>
              <button
                onClick={() => setIsSkillModalOpen(true)}
                className="flex items-center gap-1 rounded-lg bg-amber-500 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
              >
                <Plus className="h-3.5 w-3.5" />
                Skill
              </button>
            </div>
            {allSkillsSorted.length > 0 ? (
              <div className="max-h-80 divide-y divide-zinc-100 overflow-y-auto rounded-lg border border-zinc-200 px-3 dark:divide-zinc-800 dark:border-zinc-700">
                {allSkillsSorted.map((entry) => {
                  const skillData = getSkillData(entry.skillId);
                  if (!skillData) return null;

                  const isGroupSkill = entry.source.type === "group";

                  return (
                    <SkillListItem
                      key={entry.skillId}
                      skillName={skillData.name}
                      linkedAttribute={skillData.linkedAttribute}
                      rating={entry.rating}
                      maxRating={MAX_SKILL_RATING}
                      specializations={entry.specializations}
                      isGroupSkill={isGroupSkill}
                      groupName={entry.source.type === "group" ? entry.source.groupName : undefined}
                      canIncrease={!isGroupSkill && skillPointsRemaining > 0}
                      onRatingChange={
                        isGroupSkill
                          ? undefined
                          : (delta) => handleSkillRatingChange(entry.skillId, delta)
                      }
                      onRemove={isGroupSkill ? undefined : () => handleRemoveSkill(entry.skillId)}
                      onRemoveSpecialization={(spec) =>
                        handleRemoveSpecialization(entry.skillId, spec)
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-zinc-200 p-3 text-center dark:border-zinc-700">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">No skills added</p>
              </div>
            )}
          </div>

          {/* Summary */}
          {allSkillsSorted.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {allSkillsSorted.length} skill{allSkillsSorted.length !== 1 ? "s" : ""}
                {hasSelectedGroups && (
                  <span className="text-purple-500 dark:text-purple-400">
                    {" "}
                    ({Object.keys(groups).length} from group
                    {Object.keys(groups).length !== 1 ? "s" : ""})
                  </span>
                )}
                {totalSpecializations > 0 && (
                  <span className="text-amber-600 dark:text-amber-400">
                    , {totalSpecializations} spec{totalSpecializations !== 1 ? "s" : ""}
                  </span>
                )}
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {skillPointsSpent} skill pts
                {skillGroupPoints > 0 && <> / {groupPointsSpent} group pts</>}
              </span>
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
        incompetentGroupId={incompetentGroupId}
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
        incompetentGroupId={incompetentGroupId}
      />
    </>
  );
}
