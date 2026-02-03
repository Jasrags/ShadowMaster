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
import { getGroupRating, isGroupBroken } from "@/lib/rules/skills/group-utils";
import {
  calculateSkillRaiseKarmaCost,
  calculateSkillGroupRaiseKarmaCost,
} from "@/lib/rules/skills/group-utils";
import type { CreationState } from "@/lib/types";
import type { SkillGroupValue } from "@/lib/types/creation-selections";
import { useCreationBudgets } from "@/lib/contexts";
import { CreationCard, BudgetIndicator, Stepper, pluralize } from "./shared";
import {
  SkillModal,
  SkillGroupModal,
  SkillListItem,
  SkillCustomizeModal,
  SkillGroupBreakModal,
  SkillKarmaConfirmModal,
  SkillGroupKarmaConfirmModal,
  SkillSpecModal,
  FreeSkillsPanel,
  FreeSkillDesignationModal,
  useSkillDesignations,
  useGroupBreaking,
  useKarmaPurchase,
  getKarmaSpent,
} from "./skills";
import { Plus, Users, X, AlertTriangle, Star, RefreshCw } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_SKILL_RATING = 6;
const MAX_SKILL_RATING_WITH_APTITUDE = 7;
const MAX_GROUP_RATING = 6;
const SKILL_POINTS_PER_SPECIALIZATION = 1;
const MAX_SPECS_PER_SKILL = 1;

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
  canIncreaseWithKarma,
  isBroken,
  canRestore,
  onRatingChange,
  onKarmaIncrease,
  onRemove,
  onRestore,
}: {
  groupName: string;
  skills: { id: string; name: string; linkedAttribute: string }[];
  rating: number;
  maxRating: number;
  canIncrease: boolean;
  canIncreaseWithKarma?: boolean;
  isBroken: boolean;
  canRestore: boolean;
  onRatingChange: (delta: number) => void;
  onKarmaIncrease?: () => void;
  onRemove: () => void;
  onRestore?: () => void;
}) {
  const isAtMax = rating >= maxRating;
  const canIncrement = canIncrease || canIncreaseWithKarma;
  const isKarmaMode = canIncreaseWithKarma && !canIncrease;

  return (
    <div className={`py-1.5 ${isBroken ? "opacity-60" : ""}`}>
      {/* Line 1: Group name and controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users className={`h-3.5 w-3.5 ${isBroken ? "text-zinc-400" : "text-purple-500"}`} />
          <span
            className={`text-sm font-medium ${isBroken ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}
          >
            {groupName}
          </span>
          {isBroken && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              Broken
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Show MAX badge only for non-broken groups */}
          {!isBroken && isAtMax && (
            <span className="rounded bg-emerald-100 px-1 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              MAX
            </span>
          )}

          {/* Rating controls - hidden for broken groups */}
          {!isBroken && (
            <Stepper
              value={rating}
              min={1}
              max={maxRating}
              onChange={(newValue) => {
                const delta = newValue - rating;
                if (delta > 0 && isKarmaMode) {
                  // Karma purchase mode - open confirmation modal
                  onKarmaIncrease?.();
                } else {
                  // Normal group point mode
                  onRatingChange(delta);
                }
              }}
              canIncrement={canIncrement && !isAtMax}
              accentColor={isKarmaMode ? "amber" : "purple"}
              valueColor="purple"
              showMaxBadge={false}
              name={`${groupName} skill group`}
            />
          )}

          {/* Show rating badge for broken groups (read-only) */}
          {isBroken && (
            <div className="flex h-7 w-8 items-center justify-center rounded bg-zinc-200 text-sm font-bold text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
              {rating}
            </div>
          )}

          {/* Restore button for broken groups that can be restored */}
          {isBroken && canRestore && onRestore && (
            <button
              onClick={onRestore}
              className="flex items-center gap-1 rounded bg-emerald-500 px-2 py-1 text-[10px] font-medium text-white transition-colors hover:bg-emerald-600"
            >
              <RefreshCw className="h-3 w-3" />
              Restore
            </button>
          )}

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
      <div
        className={`ml-5 mt-0.5 text-xs ${isBroken ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-500 dark:text-zinc-400"}`}
      >
        {isBroken ? (
          <span className="italic">Skills managed individually</span>
        ) : (
          skills.map((skill) => skill.name).join(" • ")
        )}
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
  const karmaBudget = getBudget("karma");

  const skillPoints = skillBudget?.total || 0;
  const skillGroupPoints = groupBudget?.total || 0;
  const karmaRemaining = karmaBudget?.remaining || 0;

  // Basic modal states
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Specialization modal state (for individual skills)
  const [specModalTarget, setSpecModalTarget] = useState<string | null>(null);

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

  // Destructure designation hook values
  const {
    freeSkillConfigs,
    freeSkillDesignations,
    designatedSkillIds,
    freeSkillAllocationStatuses,
    hasFreeSkillConfigs,
    freeSkillIds,
    freeSkillDesignationModal,
    handleOpenDesignationModal,
    handleConfirmDesignations,
    handleUndesignateSkill,
    handleDesignateSkillFromList,
    canSkillBeDesignated,
    getSkillFreeRating: getDesignatedSkillFreeRating,
    closeDesignationModal: setFreeSkillDesignationModal,
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

  // Destructure group breaking hook values
  const {
    customizeTarget,
    pendingChanges,
    isBreakModalOpen,
    handleOpenCustomize,
    handleCloseCustomize,
    handleCustomizeApply,
    handleConfirmBreak,
    handleCancelBreak,
    handleRestoreGroup,
  } = groupBreaking;

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

  // Destructure karma purchase hook values
  const {
    getPurchaseMode,
    getGroupPurchaseMode,
    karmaSkillPurchase,
    karmaGroupPurchase,
    handleOpenKarmaConfirm,
    handleConfirmKarmaPurchase,
    closeSkillKarmaConfirm: setKarmaSkillPurchase,
    handleOpenGroupKarmaConfirm,
    handleConfirmGroupKarmaPurchase,
    closeGroupKarmaConfirm: setKarmaGroupPurchase,
  } = karmaPurchase;

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

  // Handle adding a skill from modal
  const handleAddSkill = useCallback(
    (skillId: string, rating: number, specs: string[], karmaSpent?: number) => {
      const newSkills = { ...skills, [skillId]: rating };
      const newSpecs = { ...specializations };
      if (specs.length > 0) {
        newSpecs[skillId] = specs;
      }

      // Track karma spent if skill was added using karma
      if (karmaSpent && karmaSpent > 0) {
        const currentKarmaSpent = (state.selections.skillKarmaSpent as {
          skillRaises: Record<string, number>;
          skillRatingPoints: number;
          specializations: number;
        }) || { skillRaises: {}, skillRatingPoints: 0, specializations: 0 };

        const newKarmaSpent = {
          skillRaises: {
            ...currentKarmaSpent.skillRaises,
            [skillId]: karmaSpent,
          },
          // Track rating points purchased with karma (entire skill rating when adding new skill)
          skillRatingPoints: currentKarmaSpent.skillRatingPoints + rating,
          specializations: currentKarmaSpent.specializations,
        };

        updateState({
          selections: {
            ...state.selections,
            skills: newSkills,
            skillSpecializations: newSpecs,
            skillKarmaSpent: newKarmaSpent,
          },
        });
      } else {
        updateState({
          selections: {
            ...state.selections,
            skills: newSkills,
            skillSpecializations: newSpecs,
          },
        });
      }
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

      // Track karma refunds for skills being replaced by the group
      const currentKarmaSpent = (state.selections.skillKarmaSpent as {
        skillRaises: Record<string, number>;
        skillRatingPoints: number;
        specializations: number;
      }) || { skillRaises: {}, skillRatingPoints: 0, specializations: 0 };

      let karmaRatingPointsToRefund = 0;
      const newKarmaRaises = { ...currentKarmaSpent.skillRaises };

      if (group) {
        group.skills.forEach((skillId) => {
          // If karma was spent on this skill, refund it
          if (newKarmaRaises[skillId]) {
            const skillRating = skills[skillId] || 0;
            karmaRatingPointsToRefund += Math.min(
              skillRating,
              currentKarmaSpent.skillRatingPoints || 0
            );
            delete newKarmaRaises[skillId];
          }
          delete newSkills[skillId];
          delete newSpecs[skillId];
        });
      }

      const newKarmaSpent =
        karmaRatingPointsToRefund > 0 ||
        Object.keys(newKarmaRaises).length !== Object.keys(currentKarmaSpent.skillRaises).length
          ? {
              ...currentKarmaSpent,
              skillRaises: newKarmaRaises,
              skillRatingPoints: Math.max(
                0,
                (currentKarmaSpent.skillRatingPoints || 0) - karmaRatingPointsToRefund
              ),
            }
          : undefined;

      updateState({
        selections: {
          ...state.selections,
          skillGroups: newGroups,
          skills: newSkills,
          skillSpecializations: newSpecs,
          ...(newKarmaSpent && { skillKarmaSpent: newKarmaSpent }),
        },
      });
      setIsGroupModalOpen(false);
    },
    [groups, skills, specializations, skillGroups, state.selections, updateState]
  );

  // Handle skill rating change (with karma refund support)
  const handleSkillRatingChange = useCallback(
    (skillId: string, delta: number) => {
      const currentRating = skills[skillId] || 0;
      const newRating = currentRating + delta;

      if (newRating < 1 || newRating > MAX_SKILL_RATING) return;

      const newSkills = { ...skills, [skillId]: newRating };

      // Check if we need to refund karma when reducing rating
      const currentKarmaSpent = (state.selections.skillKarmaSpent as {
        skillRaises: Record<string, number>;
        skillRatingPoints: number;
        specializations: number;
      }) || { skillRaises: {}, skillRatingPoints: 0, specializations: 0 };

      const karmaSpentOnSkill = currentKarmaSpent.skillRaises[skillId] || 0;

      // If reducing rating and karma was spent on this skill, refund it
      if (delta < 0 && karmaSpentOnSkill > 0) {
        // Calculate karma to refund: cost of the rating being removed
        // E.g., reducing from 4 to 3 refunds 4 × 2 = 8 karma
        const karmaToRefund = Math.min(currentRating * 2, karmaSpentOnSkill);

        const newKarmaSpent = {
          ...currentKarmaSpent,
          skillRaises: { ...currentKarmaSpent.skillRaises },
          // Decrement rating points purchased with karma (1 rating point refunded)
          skillRatingPoints: Math.max(0, currentKarmaSpent.skillRatingPoints - 1),
        };

        const remainingKarma = karmaSpentOnSkill - karmaToRefund;
        if (remainingKarma <= 0) {
          delete newKarmaSpent.skillRaises[skillId];
        } else {
          newKarmaSpent.skillRaises[skillId] = remainingKarma;
        }

        updateState({
          selections: {
            ...state.selections,
            skills: newSkills,
            skillKarmaSpent: newKarmaSpent,
          },
        });
      } else {
        updateState({
          selections: {
            ...state.selections,
            skills: newSkills,
          },
        });
      }
    },
    [skills, state.selections, updateState]
  );

  // Handle skill group rating change
  const handleGroupRatingChange = useCallback(
    (groupId: string, delta: number) => {
      const groupValue = groups[groupId];
      if (!groupValue) return;

      const currentRating = getGroupRating(groupValue);
      const newRating = currentRating + delta;

      if (newRating < 1 || newRating > MAX_GROUP_RATING) return;

      // Preserve the isBroken state if it exists
      const isBroken = isGroupBroken(groupValue);
      const newGroups = {
        ...groups,
        [groupId]: isBroken ? { rating: newRating, isBroken: true } : newRating,
      };
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
      const skillRating = skills[skillId] || 0;
      const newSkills = { ...skills };
      delete newSkills[skillId];

      const newSpecs = { ...specializations };
      delete newSpecs[skillId];

      // Check if karma was spent on this skill and clean it up
      const currentKarmaSpent = (state.selections.skillKarmaSpent as {
        skillRaises: Record<string, number>;
        skillRatingPoints: number;
        specializations: number;
      }) || { skillRaises: {}, skillRatingPoints: 0, specializations: 0 };

      const karmaSpentOnSkill = currentKarmaSpent.skillRaises[skillId] || 0;

      if (karmaSpentOnSkill > 0) {
        // Calculate how many rating points were purchased with karma
        // Using the formula: karma = sum of (level * 2) for each level
        // We need to find how many levels K karma buys starting from 0
        // K = 2 + 4 + 6 + ... + 2n = 2(1 + 2 + ... + n) = n(n+1)
        // So n = (-1 + sqrt(1 + 4K)) / 2
        // But this assumes all levels were karma-purchased. In practice,
        // we track skillRatingPoints separately, so we use the skill's rating
        // as a reasonable estimate when the skill is being fully removed.
        const karmaRatingPointsToRefund = Math.min(
          skillRating,
          currentKarmaSpent.skillRatingPoints || 0
        );

        const newKarmaSpent = {
          ...currentKarmaSpent,
          skillRaises: { ...currentKarmaSpent.skillRaises },
          skillRatingPoints: Math.max(
            0,
            (currentKarmaSpent.skillRatingPoints || 0) - karmaRatingPointsToRefund
          ),
        };
        delete newKarmaSpent.skillRaises[skillId];

        updateState({
          selections: {
            ...state.selections,
            skills: newSkills,
            skillSpecializations: newSpecs,
            skillKarmaSpent: newKarmaSpent,
          },
        });
      } else {
        updateState({
          selections: {
            ...state.selections,
            skills: newSkills,
            skillSpecializations: newSpecs,
          },
        });
      }
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

  // Handle opening spec modal for individual skills
  const handleOpenSpecModal = useCallback((skillId: string) => {
    setSpecModalTarget(skillId);
  }, []);

  // Handle adding a specialization from the spec modal
  const handleAddSpecFromModal = useCallback(
    (skillId: string, spec: string, karmaSpent?: number) => {
      const newSpecs = { ...specializations, [skillId]: [spec] };

      // Track karma spent if purchased with karma
      if (karmaSpent && karmaSpent > 0) {
        const currentKarmaSpent = (state.selections.skillKarmaSpent as {
          skillRaises: Record<string, number>;
          skillRatingPoints: number;
          specializations: number;
        }) || { skillRaises: {}, skillRatingPoints: 0, specializations: 0 };

        const newKarmaSpent = {
          ...currentKarmaSpent,
          specializations: (currentKarmaSpent.specializations || 0) + karmaSpent,
        };

        updateState({
          selections: {
            ...state.selections,
            skillSpecializations: newSpecs,
            skillKarmaSpent: newKarmaSpent,
          },
        });
      } else {
        updateState({
          selections: {
            ...state.selections,
            skillSpecializations: newSpecs,
          },
        });
      }
      setSpecModalTarget(null);
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

  // Get max rating for a skill (considering Aptitude quality)
  const getMaxRating = useCallback(
    (skillId: string): number => {
      if (aptitudeSkillId === skillId) {
        return MAX_SKILL_RATING_WITH_APTITUDE;
      }
      return MAX_SKILL_RATING;
    },
    [aptitudeSkillId]
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

  // Use hook values for restorable groups
  const { restorableGroups, hasRestorableGroups } = groupBreaking;

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
                  {Object.entries(groups).map(([groupId, groupValue]) => {
                    const groupData = getGroupData(groupId);
                    if (!groupData) return null;

                    const broken = isGroupBroken(groupValue);
                    const rating = getGroupRating(groupValue);
                    const skillsInGroup = groupData.skills
                      .map((skillId) => getSkillData(skillId))
                      .filter(Boolean) as {
                      id: string;
                      name: string;
                      linkedAttribute: string;
                    }[];

                    // Check if this broken group can be restored
                    const canRestore =
                      broken && restorableGroups.some((g) => g.groupId === groupId);

                    // Determine purchase mode for this group
                    const groupPurchaseInfo = getGroupPurchaseMode(
                      rating,
                      rating >= MAX_GROUP_RATING
                    );

                    return (
                      <SkillGroupCard
                        key={groupId}
                        groupName={groupData.name}
                        skills={skillsInGroup}
                        rating={rating}
                        maxRating={MAX_GROUP_RATING}
                        canIncrease={groupPurchaseInfo.mode === "group-points"}
                        canIncreaseWithKarma={groupPurchaseInfo.mode === "karma"}
                        isBroken={broken}
                        canRestore={canRestore}
                        onRatingChange={(delta) => handleGroupRatingChange(groupId, delta)}
                        onKarmaIncrease={() => handleOpenGroupKarmaConfirm(groupId)}
                        onRemove={() => handleRemoveGroup(groupId)}
                        onRestore={canRestore ? () => handleRestoreGroup(groupId) : undefined}
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
                  const skillMaxRating = getMaxRating(entry.skillId);
                  const isAtMax = entry.rating >= skillMaxRating;

                  // Determine purchase mode for individual skills
                  const purchaseInfo = isGroupSkill
                    ? { mode: "disabled" as const, disabledReason: undefined }
                    : getPurchaseMode(entry.rating, isAtMax);

                  // Check if this skill is designated for free allocation
                  const isDesignated = designatedSkillIds.has(entry.skillId);
                  const freeRating = isDesignated
                    ? getDesignatedSkillFreeRating(entry.skillId)
                    : undefined;
                  const canDesignate =
                    !isGroupSkill && hasFreeSkillConfigs && canSkillBeDesignated(entry.skillId);

                  return (
                    <SkillListItem
                      key={entry.skillId}
                      skillName={skillData.name}
                      linkedAttribute={skillData.linkedAttribute}
                      rating={entry.rating}
                      maxRating={skillMaxRating}
                      specializations={entry.specializations}
                      isGroupSkill={isGroupSkill}
                      groupName={entry.source.type === "group" ? entry.source.groupName : undefined}
                      canIncrease={!isGroupSkill && purchaseInfo.mode === "skill-points"}
                      canIncreaseWithKarma={!isGroupSkill && purchaseInfo.mode === "karma"}
                      disabledReason={purchaseInfo.disabledReason}
                      isFreeAllocation={
                        !isGroupSkill && !isDesignated && freeSkillIds.has(entry.skillId)
                      }
                      isDesignated={isDesignated}
                      freeRating={freeRating}
                      canDesignate={canDesignate}
                      onDesignate={
                        canDesignate ? () => handleDesignateSkillFromList(entry.skillId) : undefined
                      }
                      onUndesignate={
                        isDesignated
                          ? () => {
                              // Find which type this skill is designated under
                              for (const status of freeSkillAllocationStatuses) {
                                if (status.designatedSkillIds.includes(entry.skillId)) {
                                  handleUndesignateSkill(entry.skillId, status.type);
                                  break;
                                }
                              }
                            }
                          : undefined
                      }
                      onRatingChange={
                        isGroupSkill
                          ? undefined
                          : (delta) => handleSkillRatingChange(entry.skillId, delta)
                      }
                      onKarmaIncrease={
                        isGroupSkill ? undefined : () => handleOpenKarmaConfirm(entry.skillId)
                      }
                      onRemove={isGroupSkill ? undefined : () => handleRemoveSkill(entry.skillId)}
                      onRemoveSpecialization={(spec) =>
                        handleRemoveSpecialization(entry.skillId, spec)
                      }
                      // Specialization props for individual skills without specs
                      onAddSpecialization={
                        !isGroupSkill && entry.specializations.length === 0
                          ? () => handleOpenSpecModal(entry.skillId)
                          : undefined
                      }
                      canAddSpecialization={
                        !isGroupSkill &&
                        entry.specializations.length === 0 &&
                        (skillPointsRemaining > 0 || karmaRemaining >= 7)
                      }
                      specRequiresKarma={
                        !isGroupSkill &&
                        entry.specializations.length === 0 &&
                        skillPointsRemaining <= 0 &&
                        karmaRemaining >= 7
                      }
                      // Customization props for group skills
                      onCustomize={
                        isGroupSkill && entry.source.type === "group"
                          ? () => {
                              const source = entry.source as {
                                type: "group";
                                groupId: string;
                                groupName: string;
                              };
                              handleOpenCustomize(entry.skillId, source.groupId);
                            }
                          : undefined
                      }
                      canCustomize={isGroupSkill && karmaRemaining > 0}
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
        karmaRemaining={karmaRemaining}
        incompetentGroupId={incompetentGroupId}
        aptitudeSkillId={aptitudeSkillId}
        magicalPath={magicPath}
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

      {/* Skill Customization Modal (for group skills) */}
      {customizeTarget &&
        (() => {
          const skillData = getSkillData(customizeTarget.skillId);
          const groupData = getGroupData(customizeTarget.groupId);
          const groupValue = groups[customizeTarget.groupId];

          if (!skillData || !groupData || !groupValue) return null;

          const groupRating = getGroupRating(groupValue);

          return (
            <SkillCustomizeModal
              isOpen={true}
              onClose={handleCloseCustomize}
              onApply={handleCustomizeApply}
              skillId={customizeTarget.skillId}
              skillName={skillData.name}
              currentRating={groupRating}
              maxRating={MAX_SKILL_RATING}
              suggestedSpecializations={skillData.suggestedSpecializations || []}
              availableKarma={karmaRemaining}
              availableSkillPoints={skillPointsRemaining}
              groupId={customizeTarget.groupId}
              groupName={groupData.name}
            />
          );
        })()}

      {/* Break Confirmation Modal */}
      {customizeTarget &&
        pendingChanges &&
        (() => {
          const skillData = getSkillData(customizeTarget.skillId);
          const groupData = getGroupData(customizeTarget.groupId);
          const groupValue = groups[customizeTarget.groupId];

          if (!skillData || !groupData || !groupValue) return null;

          const groupRating = getGroupRating(groupValue);
          const memberSkills = groupData.skills
            .map((id) => {
              const data = getSkillData(id);
              return data ? { id, name: data.name } : null;
            })
            .filter(Boolean) as Array<{ id: string; name: string }>;

          return (
            <SkillGroupBreakModal
              isOpen={isBreakModalOpen}
              onClose={handleCancelBreak}
              onConfirm={handleConfirmBreak}
              skillName={skillData.name}
              skillId={customizeTarget.skillId}
              groupName={groupData.name}
              groupId={customizeTarget.groupId}
              currentRating={groupRating}
              memberSkills={memberSkills}
              changes={pendingChanges}
              availableKarma={karmaRemaining}
            />
          );
        })()}

      {/* Karma Purchase Confirmation Modal (for individual skills) */}
      {karmaSkillPurchase && (
        <SkillKarmaConfirmModal
          isOpen={true}
          onClose={setKarmaSkillPurchase}
          onConfirm={handleConfirmKarmaPurchase}
          skillName={karmaSkillPurchase.skillName}
          currentRating={karmaSkillPurchase.currentRating}
          newRating={karmaSkillPurchase.currentRating + 1}
          karmaCost={calculateSkillRaiseKarmaCost(
            karmaSkillPurchase.currentRating,
            karmaSkillPurchase.currentRating + 1
          )}
          karmaRemaining={karmaRemaining}
        />
      )}

      {/* Karma Purchase Confirmation Modal (for skill groups) */}
      {karmaGroupPurchase && (
        <SkillGroupKarmaConfirmModal
          isOpen={true}
          onClose={setKarmaGroupPurchase}
          onConfirm={handleConfirmGroupKarmaPurchase}
          groupName={karmaGroupPurchase.groupName}
          skillCount={karmaGroupPurchase.skillCount}
          currentRating={karmaGroupPurchase.currentRating}
          newRating={karmaGroupPurchase.currentRating + 1}
          karmaCost={calculateSkillGroupRaiseKarmaCost(
            karmaGroupPurchase.currentRating,
            karmaGroupPurchase.currentRating + 1
          )}
          karmaRemaining={karmaRemaining}
        />
      )}

      {/* Specialization Modal (for individual skills) */}
      {specModalTarget &&
        (() => {
          const skillData = getSkillData(specModalTarget);
          if (!skillData) return null;

          return (
            <SkillSpecModal
              isOpen={true}
              onClose={() => setSpecModalTarget(null)}
              onAdd={(spec, karmaSpent) =>
                handleAddSpecFromModal(specModalTarget, spec, karmaSpent)
              }
              skillName={skillData.name}
              suggestedSpecializations={skillData.suggestedSpecializations || []}
              availableSkillPoints={skillPointsRemaining}
              availableKarma={karmaRemaining}
            />
          );
        })()}

      {/* Free Skill Designation Modal */}
      {freeSkillDesignationModal && (
        <FreeSkillDesignationModal
          isOpen={true}
          onClose={setFreeSkillDesignationModal}
          onConfirm={(selectedIds) =>
            handleConfirmDesignations(freeSkillDesignationModal.type, selectedIds)
          }
          freeSkillType={freeSkillDesignationModal.type}
          typeLabel={freeSkillDesignationModal.label}
          freeRating={freeSkillDesignationModal.freeRating}
          totalSlots={freeSkillDesignationModal.totalSlots}
          currentDesignations={freeSkillDesignationModal.currentDesignations}
          availableSkills={activeSkills}
          skillCategories={skillCategories}
          currentSkillRatings={skills}
          hasMagic={!!hasMagic}
          hasResonance={!!hasResonance}
        />
      )}
    </>
  );
}
