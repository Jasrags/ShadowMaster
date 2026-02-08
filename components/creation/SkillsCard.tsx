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

import { useMemo, useState } from "react";
import { useSkills } from "@/lib/rules";
import { getGroupRating, isGroupBroken } from "@/lib/rules/skills/group-utils";
import type { CreationState } from "@/lib/types";
import type { SkillGroupValue } from "@/lib/types/creation-selections";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator, pluralize } from "./shared";
import {
  FreeSkillsPanel,
  useSkillDesignations,
  useGroupBreaking,
  useKarmaPurchase,
  getKarmaSpent,
} from "./skills";
import { AlertTriangle, Star, RefreshCw } from "lucide-react";
import { useSkillsCardHandlers, type SkillListEntry } from "./skills/useSkillsCardHandlers";
import { SkillsListSection } from "./skills/SkillsListSection";
import { SkillsModalsSection } from "./skills/SkillsModalsSection";

// =============================================================================
// CONSTANTS
// =============================================================================

const SKILL_POINTS_PER_SPECIALIZATION = 1;

// =============================================================================
// TYPES
// =============================================================================

interface SkillsCardProps {
  state: CreationState;
  updateState: (updates: Partial<CreationState>) => void;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SkillsCard({ state, updateState }: SkillsCardProps) {
  const { activeSkills, skillGroups } = useSkills();
  const { getBudget } = useCreationBudgets();
  const skillBudget = getBudget("skill-points");
  const groupBudget = getBudget("skill-group-points");
  const karmaBudget = getBudget("karma");

  const skillPoints = skillBudget?.total || 0;
  const skillGroupPoints = groupBudget?.total || 0;
  const karmaRemaining = karmaBudget?.remaining || 0;

  // Basic modal states
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

  // Get Aptitude skill ID from positive qualities
  // Aptitude allows one skill to reach rating 7 instead of 6
  const aptitudeSkillId = useMemo(() => {
    const positiveQualities = (state.selections.positiveQualities || []) as Array<{
      id?: string;
      qualityId?: string;
      specification?: string;
    }>;
    const aptitudeQuality = positiveQualities.find(
      (q) => q.qualityId === "aptitude" || q.id === "aptitude"
    );
    return aptitudeQuality?.specification || undefined;
  }, [state.selections.positiveQualities]);

  // Build skill categories map for designation hooks
  const skillCategories = useMemo(() => {
    const categories: Record<string, string | undefined> = {};
    for (const skill of activeSkills) {
      categories[skill.id] = skill.category;
    }
    return categories;
  }, [activeSkills]);

  // Map of skill ID to name for display
  const skillNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const skill of activeSkills) {
      map[skill.id] = skill.name;
    }
    return map;
  }, [activeSkills]);

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

  // Get current skill group values from state (supports new { rating, isBroken } format)
  const groups = useMemo(() => {
    return (state.selections.skillGroups || {}) as Record<string, SkillGroupValue>;
  }, [state.selections.skillGroups]);

  // Get specializations (now supports multiple per skill)
  const specializations = useMemo(() => {
    return (state.selections.skillSpecializations || {}) as Record<string, string[]>;
  }, [state.selections.skillSpecializations]);

  // Calculate points spent
  // Note: karmaRatingPoints are rating points purchased with karma, not counted as skill points
  const karmaRatingPoints = useMemo(() => {
    return getKarmaSpent(state.selections).skillRatingPoints || 0;
  }, [state.selections]);

  // Group rating points purchased with karma (not counted as group points)
  const karmaGroupRatingPoints = useMemo(() => {
    return getKarmaSpent(state.selections).groupRatingPoints || 0;
  }, [state.selections]);

  // Use budget context for spent values - it handles free skill points, karma purchases, etc.
  const skillPointsSpent = skillBudget?.spent ?? 0;
  const groupPointsSpent = groupBudget?.spent ?? 0;
  const skillPointsRemaining = skillPoints - skillPointsSpent;
  const groupPointsRemaining = skillGroupPoints - groupPointsSpent;

  // Use extracted hooks for skill designations, group breaking, and karma purchases
  const designations = useSkillDesignations(
    state,
    updateState,
    skillCategories,
    skills,
    activeSkills
  );

  const {
    freeSkillDesignations,
    designatedSkillIds,
    freeSkillAllocationStatuses,
    hasFreeSkillConfigs,
    freeSkillDesignationModal,
    handleOpenDesignationModal,
    handleConfirmDesignations,
    handleUndesignateSkill,
    closeDesignationModal,
  } = designations;

  const groupBreaking = useGroupBreaking(
    state,
    updateState,
    skills,
    groups,
    specializations,
    skillGroups,
    activeSkills,
    karmaRemaining
  );

  const { restorableGroups, hasRestorableGroups, handleRestoreGroup } = groupBreaking;

  const karmaPurchase = useKarmaPurchase(
    state,
    updateState,
    skills,
    groups,
    skillGroups,
    activeSkills,
    skillPointsRemaining,
    groupPointsRemaining,
    karmaRemaining
  );

  // Use extracted handlers hook
  const handlers = useSkillsCardHandlers(
    state,
    updateState,
    skills,
    groups,
    specializations,
    skillGroups,
    activeSkills,
    freeSkillDesignations,
    designatedSkillIds,
    aptitudeSkillId
  );

  const { getSkillData } = handlers;

  // Calculate total specializations (for display purposes)
  const totalSpecializations = useMemo(() => {
    return Object.values(specializations).reduce((sum, specs) => sum + specs.length, 0);
  }, [specializations]);

  const specializationSkillPointCost = totalSpecializations * SKILL_POINTS_PER_SPECIALIZATION;
  const isSkillsOverBudget = skillPointsRemaining < 0;
  const isGroupsOverBudget = groupPointsRemaining < 0;

  // Get existing skill IDs (skills that are in selected NON-BROKEN groups)
  // Broken groups have their skills managed individually, so they don't block adding
  const skillsInGroups = useMemo(() => {
    const skillIds: string[] = [];
    Object.entries(groups).forEach(([groupId, value]) => {
      // Skip broken groups - their skills are now individual
      if (isGroupBroken(value)) return;

      const group = skillGroups.find((g) => g.id === groupId);
      if (group) {
        skillIds.push(...group.skills);
      }
    });
    return skillIds;
  }, [groups, skillGroups]);

  // Merged and sorted list of all skills (individual + from non-broken groups)
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

    // Add skills from non-broken groups only
    // (broken group skills are already in individual skills)
    Object.entries(groups).forEach(([groupId, groupValue]) => {
      // Skip broken groups - their skills are now individual
      if (isGroupBroken(groupValue)) return;

      const groupData = skillGroups.find((g) => g.id === groupId);
      if (groupData) {
        const rating = getGroupRating(groupValue);
        groupData.skills.forEach((skillId) => {
          entries.push({
            skillId,
            rating,
            source: { type: "group", groupId, groupName: groupData.name },
            specializations: [], // Group skills don't have specializations (yet)
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

  // Detect conflicts between existing skills/groups and incompetent quality
  const incompetentConflicts = useMemo(() => {
    const conflicts: { skillIds: string[]; groupId: string | null } = {
      skillIds: [],
      groupId: null,
    };

    if (!incompetentGroupId) return conflicts;

    // Check if the incompetent group is selected as a skill group (and not broken)
    // Broken groups have their skills managed individually, so we only flag the skills
    const incompetentGroupValue = groups[incompetentGroupId];
    if (incompetentGroupValue && !isGroupBroken(incompetentGroupValue)) {
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
              mode="compact"
              note={karmaRatingPoints > 0 ? `+${karmaRatingPoints} via karma` : undefined}
              noteStyle="warning"
            />
            {skillGroupPoints > 0 && (
              <BudgetIndicator
                label="Group Points"
                tooltip="Points for skill groups"
                spent={groupPointsSpent}
                total={skillGroupPoints}
                mode="compact"
                note={
                  karmaGroupRatingPoints > 0 ? `+${karmaGroupRatingPoints} via karma` : undefined
                }
                noteStyle="warning"
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

          {/* Free Skills Panel (for magic priority free skills) */}
          <FreeSkillsPanel
            allocationStatuses={freeSkillAllocationStatuses}
            skillNames={skillNameMap}
            onDesignate={handleOpenDesignationModal}
            onUndesignate={handleUndesignateSkill}
            hasFreeSkills={hasFreeSkillConfigs}
          />

          {/* Restoration notification for broken groups */}
          {hasRestorableGroups && (
            <div className="space-y-2">
              {restorableGroups.map((group) => (
                <div
                  key={group.groupId}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <RefreshCw className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <div className="text-sm text-emerald-700 dark:text-emerald-300">
                        <strong>{group.groupName}</strong> can be restored! All skills are at rating{" "}
                        <strong>{group.currentRating}</strong>.
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestoreGroup(group.groupId)}
                      className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Restore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Specialization skill point cost */}
          {totalSpecializations > 0 && (
            <div className="rounded-lg bg-blue-50 p-2 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
              <Star className="mr-1 inline h-3.5 w-3.5" />
              {totalSpecializations} specialization
              {totalSpecializations !== 1 ? "s" : ""} = {specializationSkillPointCost} skill point
              {specializationSkillPointCost !== 1 ? "s" : ""} (included above)
            </div>
          )}

          {/* Skill Groups + Individual Skills */}
          <SkillsListSection
            skillGroupPoints={skillGroupPoints}
            groups={groups}
            allSkillsSorted={allSkillsSorted}
            handlers={handlers}
            groupBreaking={groupBreaking}
            karmaPurchase={karmaPurchase}
            designations={designations}
            skillPointsRemaining={skillPointsRemaining}
            karmaRemaining={karmaRemaining}
            onOpenGroupModal={() => setIsGroupModalOpen(true)}
            onOpenSkillModal={() => setIsSkillModalOpen(true)}
          />

          {/* Footer Summary */}
          <div className="flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-700">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Total: {Object.keys(groups).length === 1 ? "skill group" : pluralize("skill group")}{" "}
              {Object.keys(groups).length} /{" "}
              {Object.keys(skills).length === 1 ? "skill" : pluralize("skill")}{" "}
              {Object.keys(skills).length}
            </span>
          </div>
        </div>
      </CreationCard>

      {/* Modals */}
      <SkillsModalsSection
        isSkillModalOpen={isSkillModalOpen}
        onCloseSkillModal={() => setIsSkillModalOpen(false)}
        isGroupModalOpen={isGroupModalOpen}
        onCloseGroupModal={() => setIsGroupModalOpen(false)}
        handlers={handlers}
        groupBreaking={groupBreaking}
        karmaPurchase={karmaPurchase}
        freeSkillDesignationModal={freeSkillDesignationModal}
        onCloseFreeDesignationModal={closeDesignationModal}
        onConfirmDesignations={handleConfirmDesignations}
        skills={skills}
        groups={groups}
        skillsInGroups={skillsInGroups}
        skillGroups={skillGroups}
        activeSkills={activeSkills}
        skillCategories={skillCategories}
        hasMagic={!!hasMagic}
        hasResonance={!!hasResonance}
        magicPath={magicPath}
        incompetentGroupId={incompetentGroupId}
        aptitudeSkillId={aptitudeSkillId}
        skillPointsRemaining={skillPointsRemaining}
        groupPointsRemaining={groupPointsRemaining}
        karmaRemaining={karmaRemaining}
      />
    </>
  );
}
