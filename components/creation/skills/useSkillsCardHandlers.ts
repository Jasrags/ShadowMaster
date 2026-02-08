"use client";

/**
 * useSkillsCardHandlers Hook
 *
 * Manages event handlers and data accessors for the SkillsCard component.
 * Extracts add, remove, rating change, and specialization handlers,
 * plus skill/group data lookup utilities.
 */

import { useCallback, useState } from "react";
import { getGroupRating, isGroupBroken } from "@/lib/rules/skills/group-utils";
import type { CreationState } from "@/lib/types";
import type { SkillGroupValue } from "@/lib/types/creation-selections";
import type { SkillGroupData, SkillData } from "@/lib/rules";
import type { FreeSkillDesignations } from "@/lib/rules/skills/free-skills";
import { removeFromDesignations } from "./utils";

// =============================================================================
// CONSTANTS
// =============================================================================

export const MAX_SKILL_RATING = 6;
export const MAX_SKILL_RATING_WITH_APTITUDE = 7;
export const MAX_GROUP_RATING = 6;

// =============================================================================
// TYPES
// =============================================================================

/** Unified entry for displaying all skills (individual and from groups) */
export interface SkillListEntry {
  skillId: string;
  rating: number;
  source: { type: "individual" } | { type: "group"; groupId: string; groupName: string };
  specializations: string[];
}

export interface UseSkillsCardHandlersResult {
  /** Handle adding a skill from modal */
  handleAddSkill: (skillId: string, rating: number, specs: string[], karmaSpent?: number) => void;
  /** Handle adding a skill group from modal */
  handleAddGroup: (groupId: string, rating: number) => void;
  /** Handle skill rating change (with karma refund support) */
  handleSkillRatingChange: (skillId: string, delta: number) => void;
  /** Handle skill group rating change */
  handleGroupRatingChange: (groupId: string, delta: number) => void;
  /** Handle removing a skill */
  handleRemoveSkill: (skillId: string) => void;
  /** Handle removing a skill group */
  handleRemoveGroup: (groupId: string) => void;
  /** Handle removing a specialization */
  handleRemoveSpecialization: (skillId: string, spec: string) => void;
  /** Open specialization modal for a skill */
  handleOpenSpecModal: (skillId: string) => void;
  /** Handle adding a specialization from modal */
  handleAddSpecFromModal: (skillId: string, spec: string, karmaSpent?: number) => void;
  /** Get skill data by ID */
  getSkillData: (skillId: string) => SkillData | undefined;
  /** Get max rating for a skill (considering Aptitude quality) */
  getMaxRating: (skillId: string) => number;
  /** Get group data by ID */
  getGroupData: (groupId: string) => SkillGroupData | undefined;
  /** Get group name for a skill */
  getSkillGroupName: (skillId: string) => string | undefined;
  /** Current specialization modal target skill ID */
  specModalTarget: string | null;
  /** Set specialization modal target */
  setSpecModalTarget: (target: string | null) => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useSkillsCardHandlers(
  state: CreationState,
  updateState: (updates: Partial<CreationState>) => void,
  skills: Record<string, number>,
  groups: Record<string, SkillGroupValue>,
  specializations: Record<string, string[]>,
  skillGroups: SkillGroupData[],
  activeSkills: SkillData[],
  freeSkillDesignations: FreeSkillDesignations | undefined,
  designatedSkillIds: Set<string>,
  aptitudeSkillId: string | undefined
): UseSkillsCardHandlersResult {
  const [specModalTarget, setSpecModalTarget] = useState<string | null>(null);

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

      // Clean up free skill designations if this skill was designated
      let newFreeSkillDesignations = freeSkillDesignations;
      if (designatedSkillIds.has(skillId) && newFreeSkillDesignations) {
        // Determine which type this skill was designated under and remove it
        if (newFreeSkillDesignations.magical?.includes(skillId)) {
          newFreeSkillDesignations = removeFromDesignations(
            newFreeSkillDesignations,
            skillId,
            "magical"
          );
        } else if (newFreeSkillDesignations.resonance?.includes(skillId)) {
          newFreeSkillDesignations = removeFromDesignations(
            newFreeSkillDesignations,
            skillId,
            "resonance"
          );
        } else if (newFreeSkillDesignations.active?.includes(skillId)) {
          newFreeSkillDesignations = removeFromDesignations(
            newFreeSkillDesignations,
            skillId,
            "active"
          );
        }
      }

      // Check if karma was spent on this skill and clean it up
      const currentKarmaSpent = (state.selections.skillKarmaSpent as {
        skillRaises: Record<string, number>;
        skillRatingPoints: number;
        specializations: number;
      }) || { skillRaises: {}, skillRatingPoints: 0, specializations: 0 };

      const karmaSpentOnSkill = currentKarmaSpent.skillRaises[skillId] || 0;

      if (karmaSpentOnSkill > 0) {
        // Calculate how many rating points were purchased with karma
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
            freeSkillDesignations: newFreeSkillDesignations,
          },
        });
      } else {
        updateState({
          selections: {
            ...state.selections,
            skills: newSkills,
            skillSpecializations: newSpecs,
            freeSkillDesignations: newFreeSkillDesignations,
          },
        });
      }
    },
    [
      skills,
      specializations,
      designatedSkillIds,
      freeSkillDesignations,
      state.selections,
      updateState,
    ]
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

  return {
    handleAddSkill,
    handleAddGroup,
    handleSkillRatingChange,
    handleGroupRatingChange,
    handleRemoveSkill,
    handleRemoveGroup,
    handleRemoveSpecialization,
    handleOpenSpecModal,
    handleAddSpecFromModal,
    getSkillData,
    getMaxRating,
    getGroupData,
    getSkillGroupName,
    specModalTarget,
    setSpecModalTarget,
  };
}
