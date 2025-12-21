/**
 * Allergy state management
 *
 * Functions for managing Allergy quality state during gameplay.
 * Handles exposure tracking, penalties, and damage.
 */

import type { Character } from "@/lib/types";
import type { AllergyState } from "@/lib/types";
import { getDynamicState, updateDynamicState } from "../dynamic-state";

/**
 * Check if character is exposed to an allergen
 *
 * @param character - Character
 * @param allergyId - Quality ID for the allergy
 * @param allergen - Allergen to check against
 * @returns Whether character is exposed
 */
export function checkExposure(
  character: Character,
  allergyId: string,
  allergen: string
): boolean {
  const state = getDynamicState(character, allergyId);
  if (state?.type !== "allergy") {
    return false;
  }

  const allergyState = state.state as AllergyState;
  return allergyState.allergen.toLowerCase() === allergen.toLowerCase() && allergyState.currentlyExposed;
}

/**
 * Begin exposure to an allergen
 *
 * @param character - Character
 * @param allergyId - Quality ID for the allergy
 * @param startTime - Start time of exposure (defaults to now)
 * @returns Updated character (does not persist)
 */
export function beginExposure(
  character: Character,
  allergyId: string,
  startTime?: string
): Character {
  const state = getDynamicState(character, allergyId);
  if (state?.type !== "allergy") {
    return character;
  }

  const exposureStart = startTime || new Date().toISOString();

  const updatedState: Partial<AllergyState> = {
    currentlyExposed: true,
    exposureStartTime: exposureStart,
    exposureDuration: 0,
  };

  return updateDynamicState(character, allergyId, updatedState);
}

/**
 * End exposure to an allergen
 *
 * @param character - Character
 * @param allergyId - Quality ID for the allergy
 * @returns Updated character (does not persist)
 */
export function endExposure(
  character: Character,
  allergyId: string
): Character {
  const state = getDynamicState(character, allergyId);
  if (state?.type !== "allergy") {
    return character;
  }

  const allergyState = state.state as AllergyState;
  const exposureDuration = allergyState.exposureStartTime
    ? Math.floor((new Date().getTime() - new Date(allergyState.exposureStartTime).getTime()) / 1000 / 60) // minutes
    : 0;

  const updatedState: Partial<AllergyState> = {
    currentlyExposed: false,
    exposureDuration,
    exposureStartTime: undefined,
  };

  return updateDynamicState(character, allergyId, updatedState);
}

/**
 * Calculate current allergy penalties
 *
 * @param character - Character
 * @param allergyId - Quality ID for the allergy
 * @returns Penalty dice based on severity and exposure
 */
export function calculateAllergyPenalties(
  character: Character,
  allergyId: string
): number {
  const state = getDynamicState(character, allergyId);
  if (state?.type !== "allergy") {
    return 0;
  }

  const allergyState = state.state as AllergyState;
  if (!allergyState.currentlyExposed) {
    return 0;
  }

  // Penalties based on severity
  const penalties = {
    mild: 1,
    moderate: 2,
    severe: 3,
    extreme: 4,
  };

  return penalties[allergyState.severity] || 0;
}

/**
 * Apply allergy damage (for severe/extreme allergies)
 *
 * @param character - Character
 * @param allergyId - Quality ID for the allergy
 * @param exposureDuration - Duration of exposure in minutes
 * @returns Physical damage taken
 */
export function applyAllergyDamage(
  character: Character,
  allergyId: string,
  exposureDuration: number
): number {
  const state = getDynamicState(character, allergyId);
  if (state?.type !== "allergy") {
    return 0;
  }

  const allergyState = state.state as AllergyState;

  // Only severe and extreme allergies cause damage
  if (allergyState.severity !== "severe" && allergyState.severity !== "extreme") {
    return 0;
  }

  if (!allergyState.currentlyExposed) {
    return 0;
  }

  // Extreme: 1 Physical damage per 30 seconds
  // Severe: 1 Physical damage per minute
  const damageInterval = allergyState.severity === "extreme" ? 0.5 : 1; // minutes
  const damage = Math.floor(exposureDuration / damageInterval);

  // Update accumulated damage
  const updatedState: Partial<AllergyState> = {
    damageAccumulated: allergyState.damageAccumulated + damage,
    lastDamageTime: new Date().toISOString(),
  };

  updateDynamicState(character, allergyId, updatedState);

  return damage;
}

