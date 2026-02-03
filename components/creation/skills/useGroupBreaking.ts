"use client";

/**
 * useGroupBreaking Hook
 *
 * Manages skill group breaking and restoration logic.
 * Handles the customization flow for group skills including:
 * - Opening customization modal
 * - Breaking groups into individual skills
 * - Restoring broken groups when all skills have equal ratings
 */

import { useMemo, useCallback, useState } from "react";
import type { CreationState } from "@/lib/types";
import type { SkillGroupValue } from "@/lib/types/creation-selections";
import type { SkillCustomizeChanges } from "./SkillCustomizeModal";
import {
  getGroupRating,
  isGroupBroken,
  createBrokenGroup,
  createRestoredGroup,
  normalizeGroupValue,
  canRestoreGroup,
} from "@/lib/rules/skills/group-utils";
import type { SkillGroupData, SkillData } from "@/lib/rules";
import { getKarmaSpent } from "./utils";

export interface UseGroupBreakingResult {
  /** Currently targeted skill/group for customization */
  customizeTarget: { skillId: string; groupId: string } | null;
  /** Pending changes from customization modal */
  pendingChanges: SkillCustomizeChanges | null;
  /** Whether break confirmation modal is open */
  isBreakModalOpen: boolean;
  /** Groups that can be restored */
  restorableGroups: Array<{ groupId: string; groupName: string; currentRating: number }>;
  /** Whether there are any restorable groups */
  hasRestorableGroups: boolean;
  /** Open customization modal for a group skill */
  handleOpenCustomize: (skillId: string, groupId: string) => void;
  /** Close customization modal */
  handleCloseCustomize: () => void;
  /** Apply changes from customize modal - shows break confirmation */
  handleCustomizeApply: (changes: SkillCustomizeChanges) => void;
  /** Confirm breaking the group */
  handleConfirmBreak: () => void;
  /** Cancel break confirmation */
  handleCancelBreak: () => void;
  /** Restore a broken group */
  handleRestoreGroup: (groupId: string) => void;
}

export function useGroupBreaking(
  state: CreationState,
  updateState: (updates: Partial<CreationState>) => void,
  skills: Record<string, number>,
  groups: Record<string, SkillGroupValue>,
  specializations: Record<string, string[]>,
  skillGroups: SkillGroupData[],
  activeSkills: SkillData[],
  karmaRemaining: number
): UseGroupBreakingResult {
  // Customization flow state
  const [customizeTarget, setCustomizeTarget] = useState<{
    skillId: string;
    groupId: string;
  } | null>(null);
  const [pendingChanges, setPendingChanges] = useState<SkillCustomizeChanges | null>(null);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);

  // Detect broken groups that can be restored
  const restorableGroups = useMemo(() => {
    const restorable: Array<{
      groupId: string;
      groupName: string;
      currentRating: number;
    }> = [];

    Object.entries(groups).forEach(([groupId, value]) => {
      const normalized = normalizeGroupValue(value);
      if (!normalized.isBroken) return;

      const groupData = skillGroups.find((g) => g.id === groupId);
      if (!groupData) return;

      // Use canRestoreGroup helper to check if restoration is possible
      const { canRestore, commonRating } = canRestoreGroup(groupData.skills, skills);

      if (canRestore && commonRating !== undefined) {
        restorable.push({
          groupId,
          groupName: groupData.name,
          currentRating: commonRating,
        });
      }
    });

    return restorable;
  }, [groups, skills, skillGroups]);

  const hasRestorableGroups = restorableGroups.length > 0;

  // Open customization modal for a group skill
  const handleOpenCustomize = useCallback((skillId: string, groupId: string) => {
    setCustomizeTarget({ skillId, groupId });
  }, []);

  // Close customization modal
  const handleCloseCustomize = useCallback(() => {
    setCustomizeTarget(null);
    setPendingChanges(null);
  }, []);

  // User applied changes in customize modal - show break confirmation
  const handleCustomizeApply = useCallback((changes: SkillCustomizeChanges) => {
    setPendingChanges(changes);
    setIsBreakModalOpen(true);
  }, []);

  // User confirmed breaking the group - execute the break
  const handleConfirmBreak = useCallback(() => {
    if (!customizeTarget || !pendingChanges) return;

    const { skillId, groupId } = customizeTarget;
    const groupData = skillGroups.find((g) => g.id === groupId);
    if (!groupData) return;

    const currentGroupValue = groups[groupId];
    const groupRating = getGroupRating(currentGroupValue);

    // 1. Mark group as broken (keep it, don't delete - for budget tracking)
    const newGroups = {
      ...groups,
      [groupId]: createBrokenGroup(currentGroupValue),
    };

    // 2. Add all member skills as individual skills at group rating
    const newSkills = { ...skills };
    groupData.skills.forEach((memberSkillId) => {
      newSkills[memberSkillId] = groupRating;
    });

    // 3. Apply the triggering change (raised rating)
    if (pendingChanges.newRating) {
      newSkills[skillId] = pendingChanges.newRating;
    }

    // 4. Add specializations if any
    const newSpecs = { ...specializations };
    if (pendingChanges.specializations && pendingChanges.specializations.length > 0) {
      newSpecs[skillId] = [...(newSpecs[skillId] || []), ...pendingChanges.specializations];
    }

    // 5. Track karma spent
    const currentKarmaSpent = getKarmaSpent(state.selections);

    const newKarmaSpent = {
      skillRaises: { ...currentKarmaSpent.skillRaises },
      skillRatingPoints: currentKarmaSpent.skillRatingPoints,
      specializations: currentKarmaSpent.specializations,
    };

    // Calculate karma for skill raise
    if (pendingChanges.newRating && pendingChanges.newRating > groupRating) {
      // Karma cost for the raise portion only
      let raiseCost = 0;
      const ratingPointsRaised = pendingChanges.newRating - groupRating;
      for (let r = groupRating + 1; r <= pendingChanges.newRating; r++) {
        raiseCost += r * 2;
      }
      newKarmaSpent.skillRaises[skillId] = (newKarmaSpent.skillRaises[skillId] || 0) + raiseCost;
      // Track the number of rating points purchased with karma
      newKarmaSpent.skillRatingPoints += ratingPointsRaised;
    }

    updateState({
      selections: {
        ...state.selections,
        skillGroups: newGroups,
        skills: newSkills,
        skillSpecializations: newSpecs,
        skillKarmaSpent: newKarmaSpent,
      },
    });

    // Close modals
    setIsBreakModalOpen(false);
    setCustomizeTarget(null);
    setPendingChanges(null);
  }, [
    customizeTarget,
    pendingChanges,
    groups,
    skills,
    specializations,
    skillGroups,
    state.selections,
    updateState,
  ]);

  // Cancel break confirmation
  const handleCancelBreak = useCallback(() => {
    setIsBreakModalOpen(false);
    // Keep customize modal open so user can adjust
  }, []);

  // Restore a broken group when all member skills have equal ratings
  const handleRestoreGroup = useCallback(
    (groupId: string) => {
      const groupData = skillGroups.find((g) => g.id === groupId);
      if (!groupData) return;

      // Verify restoration is still valid
      const { canRestore, commonRating } = canRestoreGroup(groupData.skills, skills);
      if (!canRestore || commonRating === undefined) return;

      // Track karma refunds for skills being merged back into group
      const currentKarmaSpent = getKarmaSpent(state.selections);

      let karmaRatingPointsToRefund = 0;
      const newKarmaRaises = { ...currentKarmaSpent.skillRaises };

      // Remove member skills from individual skills
      const newSkills = { ...skills };
      const newSpecs = { ...specializations };
      groupData.skills.forEach((skillId) => {
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
        // Note: Per SR5 rules discussion, specializations prevent group restoration
        // However, we allow it here and just remove the specs
        delete newSpecs[skillId];
      });

      // Restore the group with the common rating
      const newGroups = {
        ...groups,
        [groupId]: createRestoredGroup(commonRating),
      };

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

  return {
    customizeTarget,
    pendingChanges,
    isBreakModalOpen,
    restorableGroups,
    hasRestorableGroups,
    handleOpenCustomize,
    handleCloseCustomize,
    handleCustomizeApply,
    handleConfirmBreak,
    handleCancelBreak,
    handleRestoreGroup,
  };
}
