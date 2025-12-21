/**
 * Addiction state management
 *
 * Functions for managing Addiction quality state during gameplay.
 * Handles craving checks, withdrawal, recovery, and penalties.
 */

import type { Character } from "@/lib/types";
import type { AddictionState } from "@/lib/types";
import { findQualitySelection } from "../utils";
import { updateDynamicState, getDynamicState } from "../dynamic-state";

/**
 * Check if craving is currently active for an addiction
 *
 * @param character - Character
 * @param addictionId - Quality ID for the addiction
 * @returns Whether craving is active
 */
export function checkAddictionCraving(
  character: Character,
  addictionId: string
): boolean {
  const state = getDynamicState(character, addictionId);
  if (state?.type !== "addiction") {
    return false;
  }

  const addictionState = state.state as AddictionState;
  return addictionState.cravingActive;
}

/**
 * Make a craving resistance test
 *
 * @param character - Character
 * @param addictionId - Quality ID for the addiction
 * @param testResult - Result of the resistance test (hits)
 * @param threshold - Threshold needed to resist (based on severity)
 * @returns Whether craving was resisted
 */
export function makeCravingTest(
  character: Character,
  addictionId: string,
  testResult: number,
  threshold: number
): boolean {
  const state = getDynamicState(character, addictionId);
  if (state?.type !== "addiction") {
    return false;
  }

  const addictionState = state.state as AddictionState;
  const resisted = testResult >= threshold;

  // Update state based on test result
  const updatedState: Partial<AddictionState> = {
    cravingActive: !resisted,
    lastDose: resisted ? addictionState.lastDose : new Date().toISOString(),
    nextCravingCheck: calculateNextCravingCheck(addictionState.severity),
  };

  if (!resisted) {
    // Failed test - must use or suffer withdrawal
    updatedState.withdrawalActive = false; // Using prevents withdrawal
  }

  updateDynamicState(character, addictionId, updatedState);
  return resisted;
}

/**
 * Begin withdrawal for an addiction
 *
 * @param character - Character
 * @param addictionId - Quality ID for the addiction
 * @returns Updated character (does not persist)
 */
export function beginWithdrawal(
  character: Character,
  addictionId: string
): Character {
  const state = getDynamicState(character, addictionId);
  if (state?.type !== "addiction") {
    return character;
  }

  const addictionState = state.state as AddictionState;
  const withdrawalPenalty = calculateWithdrawalPenalty(addictionState.severity, addictionState.daysClean);

  const updatedState: Partial<AddictionState> = {
    withdrawalActive: true,
    withdrawalPenalty,
    cravingActive: false,
  };

  return updateDynamicState(character, addictionId, updatedState);
}

/**
 * Record a dose of the substance
 *
 * @param character - Character
 * @param addictionId - Quality ID for the addiction
 * @param date - Date of dose (defaults to now)
 * @returns Updated character (does not persist)
 */
export function recordDose(
  character: Character,
  addictionId: string,
  date?: string
): Character {
  const state = getDynamicState(character, addictionId);
  if (state?.type !== "addiction") {
    return character;
  }

  const addictionState = state.state as AddictionState;
  const doseDate = date || new Date().toISOString();

  const updatedState: Partial<AddictionState> = {
    lastDose: doseDate,
    cravingActive: false,
    withdrawalActive: false,
    withdrawalPenalty: 0,
    daysClean: 0, // Reset clean days
    nextCravingCheck: calculateNextCravingCheck(addictionState.severity),
  };

  return updateDynamicState(character, addictionId, updatedState);
}

/**
 * Attempt to recover from addiction (reduce severity)
 *
 * @param character - Character
 * @param addictionId - Quality ID for the addiction
 * @param testResult - Result of recovery test (hits)
 * @param threshold - Threshold needed for recovery
 * @returns Whether recovery was successful
 */
export function attemptRecovery(
  character: Character,
  addictionId: string,
  testResult: number,
  threshold: number
): boolean {
  const state = getDynamicState(character, addictionId);
  if (state?.type !== "addiction") {
    return false;
  }

  const addictionState = state.state as AddictionState;
  const success = testResult >= threshold;

  if (success) {
    // Reduce severity
    const severityOrder: Array<"mild" | "moderate" | "severe" | "burnout"> = [
      "burnout",
      "severe",
      "moderate",
      "mild",
    ];
    const currentIndex = severityOrder.indexOf(addictionState.severity);
    if (currentIndex > 0) {
      const newSeverity = severityOrder[currentIndex - 1];
      const updatedState: Partial<AddictionState> = {
        severity: newSeverity,
        recoveryAttempts: addictionState.recoveryAttempts + 1,
        daysClean: 0, // Reset for next recovery attempt
      };
      updateDynamicState(character, addictionId, updatedState);
      return true;
    }
  } else {
    // Failed recovery attempt
    const updatedState: Partial<AddictionState> = {
      recoveryAttempts: addictionState.recoveryAttempts + 1,
    };
    updateDynamicState(character, addictionId, updatedState);
  }

  return false;
}

/**
 * Calculate withdrawal penalties based on severity and days clean
 *
 * @param character - Character
 * @param addictionId - Quality ID for the addiction
 * @returns Current withdrawal penalty (0-6 dice)
 */
export function calculateWithdrawalPenalties(
  character: Character,
  addictionId: string
): number {
  const state = getDynamicState(character, addictionId);
  if (state?.type !== "addiction") {
    return 0;
  }

  const addictionState = state.state as AddictionState;
  if (!addictionState.withdrawalActive) {
    return 0;
  }

  return addictionState.withdrawalPenalty;
}

/**
 * Calculate withdrawal penalty based on severity
 *
 * @param severity - Addiction severity
 * @param daysClean - Days since last dose
 * @returns Penalty dice (0-6)
 */
function calculateWithdrawalPenalty(
  severity: "mild" | "moderate" | "severe" | "burnout",
  daysClean: number
): number {
  // Base penalty by severity
  const basePenalties = {
    mild: 1,
    moderate: 2,
    severe: 4,
    burnout: 6,
  };

  const basePenalty = basePenalties[severity];

  // Penalty increases over time without dose
  const timeMultiplier = Math.min(1 + Math.floor(daysClean / 7), 2); // Max 2× after 7 days

  return Math.min(basePenalty * timeMultiplier, 6); // Cap at 6 dice
}

/**
 * Calculate next craving check time based on severity
 *
 * @param severity - Addiction severity
 * @returns ISO date string for next check
 */
function calculateNextCravingCheck(
  severity: "mild" | "moderate" | "severe" | "burnout"
): string {
  const now = new Date();
  let daysUntilCheck = 7; // Default: weekly

  switch (severity) {
    case "mild":
      daysUntilCheck = 7; // Weekly
      break;
    case "moderate":
      daysUntilCheck = 3; // Every 3 days
      break;
    case "severe":
      daysUntilCheck = 1; // Daily
      break;
    case "burnout":
      daysUntilCheck = 0.5; // Twice daily (12 hours)
      break;
  }

  const nextCheck = new Date(now.getTime() + daysUntilCheck * 24 * 60 * 60 * 1000);
  return nextCheck.toISOString();
}

