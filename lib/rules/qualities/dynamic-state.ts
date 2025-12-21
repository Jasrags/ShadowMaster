/**
 * Dynamic quality state management
 *
 * Core functions for managing state for qualities that change during gameplay
 * (Addiction, Allergy, Dependents, Code of Honor, etc.)
 */

import type { Quality, QualitySelection, QualityDynamicState } from "@/lib/types";
import type { Character } from "@/lib/types";
import { findQualitySelection } from "./utils";

/**
 * Initialize dynamic state for a quality selection
 *
 * @param quality - Quality definition
 * @param selection - Quality selection
 * @returns Initialized dynamic state or null if quality doesn't have dynamic state
 */
export function initializeDynamicState(
  quality: Quality,
  selection: QualitySelection
): QualityDynamicState | null {
  if (!quality.dynamicState) {
    return null;
  }

  switch (quality.dynamicState) {
    case "addiction": {
      // Initialize addiction state from selection variant or default
      const severity = (selection.variant as "mild" | "moderate" | "severe" | "burnout") || "mild";
      const substance = selection.specification || "Unknown Substance";
      const substanceType = selection.specificationId || "both";

      return {
        type: "addiction",
        state: {
          substance,
          substanceType: substanceType as "physiological" | "psychological" | "both",
          severity,
          originalSeverity: severity,
          lastDose: new Date().toISOString(),
          nextCravingCheck: calculateNextCravingCheck(severity),
          cravingActive: false,
          withdrawalActive: false,
          withdrawalPenalty: 0,
          daysClean: 0,
          recoveryAttempts: 0,
        },
      };
    }

    case "allergy": {
      const allergen = selection.specification || "Unknown Allergen";
      const severity = (selection.variant as "mild" | "moderate" | "severe" | "extreme") || "mild";
      const prevalence = selection.specificationId || "uncommon";

      return {
        type: "allergy",
        state: {
          allergen,
          prevalence: prevalence as "uncommon" | "common",
          severity: severity as "mild" | "moderate" | "severe" | "extreme",
          currentlyExposed: false,
          damageAccumulated: 0,
        },
      };
    }

    case "dependent": {
      const name = selection.specification || "Unnamed Dependent";
      const relationship = selection.specificationId || "unknown";
      const tier = selection.rating || 1;

      return {
        type: "dependent",
        state: {
          name,
          relationship,
          tier: tier as 1 | 2 | 3,
          currentStatus: "safe",
          lastCheckedIn: new Date().toISOString(),
          lifestyleCostModifier: tier * 10, // 10%, 20%, 30%
          timeCommitmentHours: tier * 5, // 5, 10, 15 hours per week
        },
      };
    }

    case "code-of-honor": {
      const codeName = selection.specification || "Code of Honor";
      const description = selection.notes || "";

      return {
        type: "code-of-honor",
        state: {
          codeName,
          description,
          violations: [],
          totalKarmaLost: 0,
        },
      };
    }

    case "reputation":
    case "custom":
      // Generic state for reputation or custom dynamic qualities
      return {
        type: quality.dynamicState,
        state: {},
      };

    default:
      return null;
  }
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

/**
 * Update dynamic state for a quality
 *
 * @param character - Character
 * @param qualityId - Quality ID
 * @param updates - Partial state updates
 * @returns Updated character (does not persist - caller must save)
 */
export function updateDynamicState(
  character: Character,
  qualityId: string,
  updates: Partial<QualityDynamicState["state"]>
): Character {
  const selection = findQualitySelection(character, qualityId);
  if (!selection) {
    throw new Error(`Quality ${qualityId} not found on character`);
  }

  if (!selection.dynamicState) {
    throw new Error(`Quality ${qualityId} does not have dynamic state`);
  }

  // Merge updates into existing state, preserving the discriminated union type
  const updatedState = {
    type: selection.dynamicState.type,
    state: {
      ...selection.dynamicState.state,
      ...updates,
    },
  } as QualityDynamicState;

  // Update the selection in the character
  const updatedSelection: QualitySelection = {
    ...selection,
    dynamicState: updatedState,
  };

  // Update character's quality arrays
  const positiveQualities = character.positiveQualities || [];
  const negativeQualities = character.negativeQualities || [];

  const positiveIndex = positiveQualities.findIndex(
    (q) => (q.qualityId || q.id) === qualityId
  );
  const negativeIndex = negativeQualities.findIndex(
    (q) => (q.qualityId || q.id) === qualityId
  );

  if (positiveIndex >= 0) {
    const updatedPositive = [...positiveQualities];
    updatedPositive[positiveIndex] = updatedSelection;
    return {
      ...character,
      positiveQualities: updatedPositive,
    };
  }

  if (negativeIndex >= 0) {
    const updatedNegative = [...negativeQualities];
    updatedNegative[negativeIndex] = updatedSelection;
    return {
      ...character,
      negativeQualities: updatedNegative,
    };
  }

  throw new Error(`Quality ${qualityId} not found in character's qualities`);
}

/**
 * Get current dynamic state for a quality
 *
 * @param character - Character
 * @param qualityId - Quality ID
 * @returns Dynamic state or null if not found
 */
export function getDynamicState(
  character: Character,
  qualityId: string
): QualityDynamicState | null {
  const selection = findQualitySelection(character, qualityId);
  return selection?.dynamicState || null;
}

/**
 * Validate dynamic state consistency
 *
 * @param quality - Quality definition
 * @param state - Dynamic state to validate
 * @returns Validation result
 */
export function validateDynamicState(
  quality: Quality,
  state: QualityDynamicState | null
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!quality.dynamicState) {
    if (state) {
      errors.push("Quality does not support dynamic state");
    }
    return { valid: errors.length === 0, errors };
  }

  if (!state) {
    errors.push("Dynamic state is required for this quality");
    return { valid: false, errors };
  }

  if (state.type !== quality.dynamicState) {
    errors.push(`State type mismatch: expected ${quality.dynamicState}, got ${state.type}`);
  }

  // Type-specific validation
  switch (quality.dynamicState) {
    case "addiction": {
      if (state.type === "addiction") {
        const addictionState = state.state;
        if (!addictionState.severity || !["mild", "moderate", "severe", "burnout"].includes(addictionState.severity)) {
          errors.push("Invalid addiction severity");
        }
        if (addictionState.withdrawalPenalty < 0 || addictionState.withdrawalPenalty > 6) {
          errors.push("Withdrawal penalty must be 0-6");
        }
      }
      break;
    }

    case "allergy": {
      if (state.type === "allergy") {
        const allergyState = state.state;
        if (!allergyState.severity || !["mild", "moderate", "severe", "extreme"].includes(allergyState.severity)) {
          errors.push("Invalid allergy severity");
        }
        if (allergyState.damageAccumulated < 0) {
          errors.push("Damage accumulated cannot be negative");
        }
      }
      break;
    }

    case "dependent": {
      if (state.type === "dependent") {
        const dependentState = state.state;
        if (!dependentState.tier || ![1, 2, 3].includes(dependentState.tier)) {
          errors.push("Dependent tier must be 1, 2, or 3");
        }
        if (dependentState.lifestyleCostModifier < 0 || dependentState.lifestyleCostModifier > 100) {
          errors.push("Lifestyle cost modifier must be 0-100%");
        }
      }
      break;
    }

    case "code-of-honor": {
      if (state.type === "code-of-honor") {
        const codeState = state.state;
        if (codeState.totalKarmaLost < 0) {
          errors.push("Total karma lost cannot be negative");
        }
      }
      break;
    }
  }

  return { valid: errors.length === 0, errors };
}

