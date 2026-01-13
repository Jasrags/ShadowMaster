/**
 * Dependents state management
 *
 * Functions for managing Dependents quality state during gameplay.
 * Handles relationship status, lifestyle costs, and time commitments.
 */

import type { Character } from "@/lib/types";
import type { DependentState } from "@/lib/types";
import { getDynamicState, updateDynamicState } from "../dynamic-state";

/**
 * Update dependent status
 *
 * @param character - Character
 * @param dependentId - Quality ID for the dependent
 * @param status - New status
 * @returns Updated character (does not persist)
 */
export function updateDependentStatus(
  character: Character,
  dependentId: string,
  status: "safe" | "needs-attention" | "in-danger" | "missing"
): Character {
  const state = getDynamicState(character, dependentId);
  if (state?.type !== "dependent") {
    return character;
  }

  const updatedState: Partial<DependentState> = {
    currentStatus: status,
    lastCheckedIn: new Date().toISOString(),
  };

  return updateDynamicState(character, dependentId, updatedState);
}

/**
 * Calculate lifestyle cost modifier for a dependent
 *
 * @param character - Character
 * @param dependentId - Quality ID for the dependent
 * @returns Lifestyle cost modifier as percentage (e.g., 10 for +10%)
 */
export function calculateLifestyleModifier(character: Character, dependentId: string): number {
  const state = getDynamicState(character, dependentId);
  if (state?.type !== "dependent") {
    return 0;
  }

  const dependentState = state.state as DependentState;
  return dependentState.lifestyleCostModifier || 0;
}

/**
 * Calculate total lifestyle cost modifier for all dependents
 *
 * @param character - Character
 * @returns Total lifestyle cost modifier as percentage
 */
export function calculateTotalLifestyleModifier(character: Character): number {
  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  let totalModifier = 0;

  for (const selection of allQualities) {
    const state = selection.dynamicState;
    if (state?.type === "dependent") {
      const dependentState = state.state as DependentState;
      totalModifier += dependentState.lifestyleCostModifier || 0;
    }
  }

  return totalModifier;
}

/**
 * Calculate time commitment for a dependent
 *
 * @param character - Character
 * @param dependentId - Quality ID for the dependent
 * @returns Time commitment in hours per week
 */
export function calculateTimeCommitment(character: Character, dependentId: string): number {
  const state = getDynamicState(character, dependentId);
  if (state?.type !== "dependent") {
    return 0;
  }

  const dependentState = state.state as DependentState;
  return dependentState.timeCommitmentHours || 0;
}

/**
 * Calculate total time commitment for all dependents
 *
 * @param character - Character
 * @returns Total time commitment in hours per week
 */
export function calculateTotalTimeCommitment(character: Character): number {
  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  let totalHours = 0;

  for (const selection of allQualities) {
    const state = selection.dynamicState;
    if (state?.type === "dependent") {
      const dependentState = state.state as DependentState;
      totalHours += dependentState.timeCommitmentHours || 0;
    }
  }

  return totalHours;
}
