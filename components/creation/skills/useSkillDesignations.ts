"use client";

/**
 * useSkillDesignations Hook
 *
 * Manages free skill designations from magic priority.
 * Handles opening designation modals, confirming designations, and auto-setting skill ratings.
 */

import { useMemo, useCallback, useState } from "react";
import { usePriorityTable } from "@/lib/rules";
import {
  getFreeSkillsFromMagicPriority,
  getSkillsWithFreeAllocation,
  getFreeSkillAllocationStatus,
  getDesignatedFreeSkills,
  getDesignatedSkillFreeRating,
  canDesignateForFreeSkill,
  type FreeSkillDesignations,
  type FreeSkillConfig,
} from "@/lib/rules/skills/free-skills";
import { FREE_SKILL_TYPE_LABELS } from "../magic-path/constants";
import type { CreationState } from "@/lib/types";
import type { SkillData } from "@/lib/rules";
import { addToDesignations, removeFromDesignations } from "./utils";

export interface FreeSkillDesignationModalState {
  type: string;
  label: string;
  freeRating: number;
  totalSlots: number;
  currentDesignations: string[];
}

export interface UseSkillDesignationsResult {
  /** Free skill configurations from magic priority */
  freeSkillConfigs: FreeSkillConfig[];
  /** Current free skill designations from state */
  freeSkillDesignations: FreeSkillDesignations | undefined;
  /** Whether explicit designations exist (new system) */
  hasExplicitDesignations: boolean;
  /** Set of designated skill IDs */
  designatedSkillIds: Set<string>;
  /** Allocation status for each free skill type */
  freeSkillAllocationStatuses: ReturnType<typeof getFreeSkillAllocationStatus>;
  /** Whether there are any free skill configs */
  hasFreeSkillConfigs: boolean;
  /** Set of skills with free allocation (legacy or designated) */
  freeSkillIds: Set<string>;
  /** Modal state for designation */
  freeSkillDesignationModal: FreeSkillDesignationModalState | null;
  /** Handler to open designation modal */
  handleOpenDesignationModal: (type: string) => void;
  /** Handler to confirm designations from modal */
  handleConfirmDesignations: (type: string, selectedSkillIds: string[]) => void;
  /** Handler to undesignate a skill */
  handleUndesignateSkill: (skillId: string, type: string) => void;
  /** Handler to designate a skill from the skill list */
  handleDesignateSkillFromList: (skillId: string) => void;
  /** Check if a skill can be designated */
  canSkillBeDesignated: (skillId: string) => boolean;
  /** Get free rating for a designated skill */
  getSkillFreeRating: (skillId: string) => number | undefined;
  /** Close the designation modal */
  closeDesignationModal: () => void;
}

export function useSkillDesignations(
  state: CreationState,
  updateState: (updates: Partial<CreationState>) => void,
  skillCategories: Record<string, string | undefined>,
  skills: Record<string, number>,
  activeSkills: SkillData[]
): UseSkillDesignationsResult {
  const priorityTable = usePriorityTable();

  // Modal state
  const [freeSkillDesignationModal, setFreeSkillDesignationModal] =
    useState<FreeSkillDesignationModalState | null>(null);

  // Get character's magical path
  const magicPath = state.selections["magical-path"] as string | undefined;

  // Get free skill configurations from magic priority
  const freeSkillConfigs = useMemo(() => {
    return getFreeSkillsFromMagicPriority(priorityTable, state.priorities?.magic, magicPath);
  }, [priorityTable, state.priorities?.magic, magicPath]);

  // Get explicit free skill designations from state
  const freeSkillDesignations = useMemo(() => {
    return state.selections.freeSkillDesignations as FreeSkillDesignations | undefined;
  }, [state.selections.freeSkillDesignations]);

  // Check if explicit designations exist (new system)
  const hasExplicitDesignations = useMemo(() => {
    return !!(
      freeSkillDesignations &&
      ((freeSkillDesignations.magical && freeSkillDesignations.magical.length > 0) ||
        (freeSkillDesignations.resonance && freeSkillDesignations.resonance.length > 0) ||
        (freeSkillDesignations.active && freeSkillDesignations.active.length > 0))
    );
  }, [freeSkillDesignations]);

  // Get set of designated skill IDs for quick lookup
  const designatedSkillIds = useMemo(() => {
    return getDesignatedFreeSkills(freeSkillDesignations);
  }, [freeSkillDesignations]);

  // Get free skill allocation status for UI display
  const freeSkillAllocationStatuses = useMemo(() => {
    return getFreeSkillAllocationStatus(
      skills,
      freeSkillConfigs,
      freeSkillDesignations,
      FREE_SKILL_TYPE_LABELS
    );
  }, [skills, freeSkillConfigs, freeSkillDesignations]);

  // Check if there are any free skill configs (show panel if so)
  const hasFreeSkillConfigs = useMemo(() => {
    return freeSkillConfigs.some((config) => config.type !== "magicalGroup");
  }, [freeSkillConfigs]);

  // Legacy: Get free skill IDs for automatic allocation (used when no explicit designations)
  const freeSkillIds = useMemo(() => {
    // If explicit designations exist, use those instead
    if (hasExplicitDesignations) {
      return designatedSkillIds;
    }
    // Fall back to automatic allocation
    return getSkillsWithFreeAllocation(skills, freeSkillConfigs, skillCategories);
  }, [hasExplicitDesignations, designatedSkillIds, skills, freeSkillConfigs, skillCategories]);

  // Handle opening the free skill designation modal for a specific type
  const handleOpenDesignationModal = useCallback(
    (type: string) => {
      const status = freeSkillAllocationStatuses.find((s) => s.type === type);
      if (!status) return;

      setFreeSkillDesignationModal({
        type,
        label: status.label,
        freeRating: status.freeRating,
        totalSlots: status.totalSlots,
        currentDesignations: status.designatedSkillIds,
      });
    },
    [freeSkillAllocationStatuses]
  );

  // Handle confirming free skill designations from modal
  const handleConfirmDesignations = useCallback(
    (type: string, selectedSkillIds: string[]) => {
      // Update designations for this type
      const newDesignations: FreeSkillDesignations = {
        ...freeSkillDesignations,
      };

      // Set the designations for this type
      switch (type) {
        case "magical":
          newDesignations.magical = selectedSkillIds;
          break;
        case "resonance":
          newDesignations.resonance = selectedSkillIds;
          break;
        case "active":
          newDesignations.active = selectedSkillIds;
          break;
      }

      // Find the config for this type to get the free rating
      const config = freeSkillConfigs.find((c) => c.type === type);
      const freeRating = config?.rating || 0;

      // Auto-set designated skills to free rating if they're lower
      const newSkills = { ...skills };
      for (const skillId of selectedSkillIds) {
        const currentRating = skills[skillId] || 0;
        if (currentRating < freeRating) {
          newSkills[skillId] = freeRating;
        }
      }

      updateState({
        selections: {
          ...state.selections,
          skills: newSkills,
          freeSkillDesignations: newDesignations,
        },
      });

      setFreeSkillDesignationModal(null);
    },
    [freeSkillDesignations, freeSkillConfigs, skills, state.selections, updateState]
  );

  // Handle undesignating a skill from the FreeSkillsPanel
  // Also removes the skill itself to keep states in sync
  const handleUndesignateSkill = useCallback(
    (skillId: string, type: string) => {
      const newDesignations = removeFromDesignations(freeSkillDesignations || {}, skillId, type);

      // Also remove the skill itself
      const newSkills = { ...skills };
      delete newSkills[skillId];

      // Remove any specializations for this skill
      const newSpecs = { ...(state.selections.skillSpecializations as Record<string, string[]>) };
      delete newSpecs[skillId];

      updateState({
        selections: {
          ...state.selections,
          skills: newSkills,
          skillSpecializations: newSpecs,
          freeSkillDesignations: newDesignations,
        },
      });
    },
    [freeSkillDesignations, skills, state.selections, updateState]
  );

  // Handle designating a skill directly from SkillListItem
  const handleDesignateSkillFromList = useCallback(
    (skillId: string) => {
      // Find the first free skill type that this skill qualifies for and has available slots
      const skillCategory = skillCategories[skillId];

      for (const status of freeSkillAllocationStatuses) {
        if (status.remainingSlots <= 0) continue;

        const { canDesignate } = canDesignateForFreeSkill(
          skillId,
          skillCategory,
          status.type,
          status.designatedSkillIds,
          status.totalSlots
        );

        if (canDesignate) {
          // Add to designations and auto-set rating
          const newDesignations = addToDesignations(
            freeSkillDesignations || {},
            skillId,
            status.type
          );

          // Auto-set skill to free rating if lower
          const newSkills = { ...skills };
          const currentRating = skills[skillId] || 0;
          if (currentRating < status.freeRating) {
            newSkills[skillId] = status.freeRating;
          }

          updateState({
            selections: {
              ...state.selections,
              skills: newSkills,
              freeSkillDesignations: newDesignations,
            },
          });
          return;
        }
      }
    },
    [
      skillCategories,
      freeSkillAllocationStatuses,
      freeSkillDesignations,
      skills,
      state.selections,
      updateState,
    ]
  );

  // Check if a skill can be designated (for SkillListItem button)
  const canSkillBeDesignated = useCallback(
    (skillId: string): boolean => {
      // Already designated?
      if (designatedSkillIds.has(skillId)) return false;

      const skillCategory = skillCategories[skillId];

      for (const status of freeSkillAllocationStatuses) {
        if (status.remainingSlots <= 0) continue;

        const { canDesignate } = canDesignateForFreeSkill(
          skillId,
          skillCategory,
          status.type,
          status.designatedSkillIds,
          status.totalSlots
        );

        if (canDesignate) return true;
      }

      return false;
    },
    [designatedSkillIds, skillCategories, freeSkillAllocationStatuses]
  );

  // Get free rating for a designated skill
  const getSkillFreeRating = useCallback(
    (skillId: string): number | undefined => {
      if (!designatedSkillIds.has(skillId)) return undefined;
      return getDesignatedSkillFreeRating(skillId, freeSkillConfigs, freeSkillDesignations);
    },
    [designatedSkillIds, freeSkillConfigs, freeSkillDesignations]
  );

  // Close the designation modal
  const closeDesignationModal = useCallback(() => {
    setFreeSkillDesignationModal(null);
  }, []);

  return {
    freeSkillConfigs,
    freeSkillDesignations,
    hasExplicitDesignations,
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
    getSkillFreeRating,
    closeDesignationModal,
  };
}
