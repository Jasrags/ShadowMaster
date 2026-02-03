"use client";

/**
 * useKarmaPurchase Hook
 *
 * Manages karma purchase mode detection and confirmation for skills and skill groups.
 * Determines whether skill/group rating increases should use points or karma,
 * and handles the karma purchase confirmation flow.
 */

import { useCallback, useState } from "react";
import type { CreationState } from "@/lib/types";
import type { SkillGroupValue } from "@/lib/types/creation-selections";
import {
  calculateSkillRaiseKarmaCost,
  calculateSkillGroupRaiseKarmaCost,
  getGroupRating,
  isGroupBroken,
} from "@/lib/rules/skills/group-utils";
import type { SkillGroupData, SkillData } from "@/lib/rules";
import { getKarmaSpent } from "./utils";

export type PurchaseMode = "skill-points" | "karma" | "disabled";
export type GroupPurchaseMode = "group-points" | "karma" | "disabled";

export interface SkillKarmaPurchaseState {
  skillId: string;
  skillName: string;
  currentRating: number;
}

export interface GroupKarmaPurchaseState {
  groupId: string;
  groupName: string;
  skillCount: number;
  currentRating: number;
}

export interface UseKarmaPurchaseResult {
  /** Determine purchase mode for a skill */
  getPurchaseMode: (
    currentRating: number,
    isAtMax: boolean
  ) => { mode: PurchaseMode; disabledReason?: string };
  /** Determine purchase mode for a group */
  getGroupPurchaseMode: (
    currentRating: number,
    isAtMax: boolean
  ) => { mode: GroupPurchaseMode; disabledReason?: string };
  /** Current skill karma purchase state */
  karmaSkillPurchase: SkillKarmaPurchaseState | null;
  /** Current group karma purchase state */
  karmaGroupPurchase: GroupKarmaPurchaseState | null;
  /** Open karma confirmation for a skill */
  handleOpenKarmaConfirm: (skillId: string) => void;
  /** Confirm karma purchase for a skill */
  handleConfirmKarmaPurchase: () => void;
  /** Close skill karma confirmation */
  closeSkillKarmaConfirm: () => void;
  /** Open karma confirmation for a group */
  handleOpenGroupKarmaConfirm: (groupId: string) => void;
  /** Confirm karma purchase for a group */
  handleConfirmGroupKarmaPurchase: () => void;
  /** Close group karma confirmation */
  closeGroupKarmaConfirm: () => void;
}

export function useKarmaPurchase(
  state: CreationState,
  updateState: (updates: Partial<CreationState>) => void,
  skills: Record<string, number>,
  groups: Record<string, SkillGroupValue>,
  skillGroups: SkillGroupData[],
  activeSkills: SkillData[],
  skillPointsRemaining: number,
  groupPointsRemaining: number,
  karmaRemaining: number
): UseKarmaPurchaseResult {
  // Karma purchase confirmation states
  const [karmaSkillPurchase, setKarmaSkillPurchase] = useState<SkillKarmaPurchaseState | null>(
    null
  );
  const [karmaGroupPurchase, setKarmaGroupPurchase] = useState<GroupKarmaPurchaseState | null>(
    null
  );

  /**
   * Determine the purchase mode for increasing a skill's rating.
   * - 'skill-points': Use skill points (green + button)
   * - 'karma': Use karma (amber + button, opens confirmation modal)
   * - 'disabled': Cannot increase (gray + button with tooltip)
   */
  const getPurchaseMode = useCallback(
    (currentRating: number, isAtMax: boolean): { mode: PurchaseMode; disabledReason?: string } => {
      if (isAtMax) {
        return { mode: "disabled", disabledReason: "Maximum rating reached" };
      }
      if (skillPointsRemaining > 0) {
        return { mode: "skill-points" };
      }
      // Skill points exhausted - check if karma purchase is possible
      const karmaCost = calculateSkillRaiseKarmaCost(currentRating, currentRating + 1);
      if (karmaRemaining >= karmaCost) {
        return { mode: "karma" };
      }
      return {
        mode: "disabled",
        disabledReason: `No skill points. Need ${karmaCost} karma (have ${karmaRemaining})`,
      };
    },
    [skillPointsRemaining, karmaRemaining]
  );

  /**
   * Determine the purchase mode for increasing a skill group's rating.
   * - 'group-points': Use group points (purple + button)
   * - 'karma': Use karma (amber + button, opens confirmation modal)
   * - 'disabled': Cannot increase (gray + button with tooltip)
   */
  const getGroupPurchaseMode = useCallback(
    (
      currentRating: number,
      isAtMax: boolean
    ): { mode: GroupPurchaseMode; disabledReason?: string } => {
      if (isAtMax) {
        return { mode: "disabled", disabledReason: "Maximum rating reached" };
      }
      if (groupPointsRemaining > 0) {
        return { mode: "group-points" };
      }
      // Group points exhausted - check if karma purchase is possible
      const karmaCost = calculateSkillGroupRaiseKarmaCost(currentRating, currentRating + 1);
      if (karmaRemaining >= karmaCost) {
        return { mode: "karma" };
      }
      return {
        mode: "disabled",
        disabledReason: `No group points. Need ${karmaCost} karma (have ${karmaRemaining})`,
      };
    },
    [groupPointsRemaining, karmaRemaining]
  );

  // Handle opening karma confirmation modal for skill
  const handleOpenKarmaConfirm = useCallback(
    (skillId: string) => {
      const skillData = activeSkills.find((s) => s.id === skillId);
      const currentRating = skills[skillId] || 0;
      if (skillData) {
        setKarmaSkillPurchase({
          skillId,
          skillName: skillData.name,
          currentRating,
        });
      }
    },
    [activeSkills, skills]
  );

  // Handle confirming karma purchase for skill
  const handleConfirmKarmaPurchase = useCallback(() => {
    if (!karmaSkillPurchase) return;

    const { skillId, currentRating } = karmaSkillPurchase;
    const newRating = currentRating + 1;
    const karmaCost = calculateSkillRaiseKarmaCost(currentRating, newRating);

    // Update skill rating
    const newSkills = { ...skills, [skillId]: newRating };

    // Track karma spent on skill raises
    const currentKarmaSpent = getKarmaSpent(state.selections);

    const newKarmaSpent = {
      skillRaises: {
        ...currentKarmaSpent.skillRaises,
        [skillId]: (currentKarmaSpent.skillRaises[skillId] || 0) + karmaCost,
      },
      // Track that 1 more rating point was purchased with karma
      skillRatingPoints: currentKarmaSpent.skillRatingPoints + 1,
      specializations: currentKarmaSpent.specializations,
    };

    updateState({
      selections: {
        ...state.selections,
        skills: newSkills,
        skillKarmaSpent: newKarmaSpent,
      },
    });

    setKarmaSkillPurchase(null);
  }, [karmaSkillPurchase, skills, state.selections, updateState]);

  // Close skill karma confirmation
  const closeSkillKarmaConfirm = useCallback(() => {
    setKarmaSkillPurchase(null);
  }, []);

  // Handle opening karma confirmation modal for skill group
  const handleOpenGroupKarmaConfirm = useCallback(
    (groupId: string) => {
      const groupData = skillGroups.find((g) => g.id === groupId);
      const groupValue = groups[groupId];
      if (groupData && groupValue) {
        setKarmaGroupPurchase({
          groupId,
          groupName: groupData.name,
          skillCount: groupData.skills.length,
          currentRating: getGroupRating(groupValue),
        });
      }
    },
    [skillGroups, groups]
  );

  // Handle confirming karma purchase for skill group
  const handleConfirmGroupKarmaPurchase = useCallback(() => {
    if (!karmaGroupPurchase) return;

    const { groupId, currentRating } = karmaGroupPurchase;
    const newRating = currentRating + 1;
    const karmaCost = calculateSkillGroupRaiseKarmaCost(currentRating, newRating);

    // Update group rating (preserve isBroken state if applicable)
    const groupValue = groups[groupId];
    const isBroken = isGroupBroken(groupValue);
    const newGroups = {
      ...groups,
      [groupId]: isBroken ? { rating: newRating, isBroken: true } : newRating,
    };

    // Track karma spent on group raises
    const currentKarmaSpent = getKarmaSpent(state.selections);

    const newKarmaSpent = {
      ...currentKarmaSpent,
      groupRaises: {
        ...(currentKarmaSpent.groupRaises || {}),
        [groupId]: ((currentKarmaSpent.groupRaises || {})[groupId] || 0) + karmaCost,
      },
      // Track that 1 more group rating point was purchased with karma
      groupRatingPoints: (currentKarmaSpent.groupRatingPoints || 0) + 1,
    };

    updateState({
      selections: {
        ...state.selections,
        skillGroups: newGroups,
        skillKarmaSpent: newKarmaSpent,
      },
    });

    setKarmaGroupPurchase(null);
  }, [karmaGroupPurchase, groups, state.selections, updateState]);

  // Close group karma confirmation
  const closeGroupKarmaConfirm = useCallback(() => {
    setKarmaGroupPurchase(null);
  }, []);

  return {
    getPurchaseMode,
    getGroupPurchaseMode,
    karmaSkillPurchase,
    karmaGroupPurchase,
    handleOpenKarmaConfirm,
    handleConfirmKarmaPurchase,
    closeSkillKarmaConfirm,
    handleOpenGroupKarmaConfirm,
    handleConfirmGroupKarmaPurchase,
    closeGroupKarmaConfirm,
  };
}
