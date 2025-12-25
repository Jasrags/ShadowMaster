/**
 * Training time calculations for character advancement
 *
 * Implements training time formulas for various advancement types
 * as documented in Shadowrun 5e rules.
 */

import type { AdvancementType } from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";
import type { AdvancementRulesData } from "@/lib/rules/loader-types";

/**
 * Calculate training time in days for an attribute advancement
 * Time: new rating × 1 week (7 days)
 *
 * @param newRating - The target rating (after advancement)
 * @returns Training time in days
 */
export function calculateAttributeTrainingTime(newRating: number): number {
  if (newRating < 1) {
    throw new Error("Attribute rating must be at least 1");
  }
  // 1 week = 7 days
  return newRating * 7;
}

/**
 * Calculate training time in days for an active skill advancement
 * Time varies by rating (SR5 standard):
 * - Ratings 1-4: new rating × 1 day
 * - Ratings 5-8: new rating × 1 week (7 days)
 * - Ratings 9-13: new rating × 2 weeks (14 days)
 *
 * @param newRating - The target rating (after advancement)
 * @returns Training time in days
 */
export function calculateActiveSkillTrainingTime(newRating: number): number {
  if (newRating < 1) {
    throw new Error("Skill rating must be at least 1");
  }

  if (newRating <= 4) {
    // Ratings 1-4: new rating × 1 day
    return newRating * 1;
  } else if (newRating <= 8) {
    // Ratings 5-8: new rating × 1 week (7 days)
    return newRating * 7;
  } else {
    // Ratings 9-13: new rating × 2 weeks (14 days)
    return newRating * 14;
  }
}

/**
 * Calculate training time in days for a knowledge or language skill
 * Uses the same formula as active skills
 *
 * @param newRating - The target rating (after advancement)
 * @returns Training time in days
 */
export function calculateKnowledgeSkillTrainingTime(newRating: number): number {
  return calculateActiveSkillTrainingTime(newRating);
}

/**
 * Calculate training time in days for a skill group advancement
 * Time: new rating × 2 weeks (14 days)
 *
 * @param newRating - The target rating (after advancement)
 * @returns Training time in days
 */
export function calculateSkillGroupTrainingTime(newRating: number): number {
  if (newRating < 1) {
    throw new Error("Skill group rating must be at least 1");
  }
  // 2 weeks = 14 days
  return newRating * 14;
}

/**
 * Calculate training time for a specialization
 * Time: 1 month (30 days)
 *
 * @returns Training time in days (always 30)
 */
export function calculateSpecializationTrainingTime(): number {
  // 1 month = 30 days (standard approximation)
  return 30;
}

/**
 * Apply instructor bonus (25% time reduction, round down)
 *
 * @param baseTime - Base training time in days
 * @returns Reduced training time in days
 */
export function applyInstructorBonus(baseTime: number): number {
  if (baseTime <= 0) {
    return baseTime;
  }
  // 25% reduction = multiply by 0.75, round down
  return Math.floor(baseTime * 0.75);
}

/**
 * Apply time modifier (e.g., +50% for Dependents quality)
 *
 * @param baseTime - Base training time in days
 * @param modifierPercent - Percentage modifier (e.g., 50 for +50%, -25 for -25%)
 * @returns Modified training time in days (rounded to nearest day)
 */
export function applyTimeModifier(
  baseTime: number,
  modifierPercent: number
): number {
  if (baseTime <= 0) {
    return baseTime;
  }
  const multiplier = 1 + modifierPercent / 100;
  return Math.round(baseTime * multiplier);
}

/**
 * Calculate final training time with all modifiers applied
 *
 * @param baseTime - Base training time in days
 * @param options - Modifier options
 * @returns Final training time in days
 */
export function calculateFinalTrainingTime(
  baseTime: number,
  options: {
    instructorBonus?: boolean;
    timeModifier?: number; // Percentage modifier
    settings?: CampaignAdvancementSettings;
    ruleset?: AdvancementRulesData;
  } = {}
): number {
  const allowInstant =
    options.settings?.allowInstantAdvancement ??
    options.ruleset?.allowInstantAdvancement ??
    false;

  if (allowInstant) {
    return 0;
  }

  let finalTime = baseTime;

  // Apply training time multiplier
  const multiplier =
    options.settings?.trainingTimeMultiplier ??
    options.ruleset?.trainingTimeMultiplier ??
    1.0;

  finalTime = finalTime * multiplier;

  // Apply instructor bonus first (25% reduction, round down)
  if (options.instructorBonus) {
    finalTime = applyInstructorBonus(finalTime);
  }

  // Apply additional time modifier (e.g., +50% for Dependents)
  if (options.timeModifier !== undefined) {
    finalTime = applyTimeModifier(finalTime, options.timeModifier);
  }

  return Math.max(1, finalTime); // Minimum 1 day
}

/**
 * Calculate training time based on advancement type
 *
 * @param type - Type of advancement
 * @param newRating - New rating/value (for rated advancements)
 * @param options - Training modifier options
 * @returns Training time in days
 */
export function calculateAdvancementTrainingTime(
  type: AdvancementType,
  newRating?: number,
  options: {
    instructorBonus?: boolean;
    timeModifier?: number;
    settings?: CampaignAdvancementSettings;
    ruleset?: AdvancementRulesData;
  } = {}
): number {
  let baseTime: number;

  switch (type) {
    case "attribute":
      if (newRating === undefined) {
        throw new Error("Rating required for attribute training time");
      }
      baseTime = calculateAttributeTrainingTime(newRating);
      break;

    case "skill":
      if (newRating === undefined) {
        throw new Error("Rating required for skill training time");
      }
      baseTime = calculateActiveSkillTrainingTime(newRating);
      break;

    case "skillGroup":
      if (newRating === undefined) {
        throw new Error("Rating required for skill group training time");
      }
      baseTime = calculateSkillGroupTrainingTime(newRating);
      break;

    case "knowledgeSkill":
    case "languageSkill":
      if (newRating === undefined) {
        throw new Error("Rating required for knowledge/language skill training time");
      }
      baseTime = calculateKnowledgeSkillTrainingTime(newRating);
      break;

    case "specialization":
      baseTime = calculateSpecializationTrainingTime();
      break;

    case "edge":
      // Edge has no training time
      return 0;

    case "spell":
    case "ritual":
      // Spell/ritual training time varies - placeholder for now
      // TODO: Implement spell training time calculation
      throw new Error("Spell/ritual training time calculation not yet implemented");

    case "complexForm":
      // Complex form training time varies - placeholder for now
      // TODO: Implement complex form training time calculation
      throw new Error("Complex form training time calculation not yet implemented");

    case "focus":
      // Focus bonding training time varies - placeholder for now
      // TODO: Implement focus bonding training time calculation
      throw new Error("Focus bonding training time calculation not yet implemented");

    case "initiation":
      // Initiation training time varies - placeholder for now
      // TODO: Implement initiation training time calculation
      throw new Error("Initiation training time calculation not yet implemented");

    case "quality":
      // Qualities don't require training time (instant)
      return 0;

    default:
      throw new Error(`Unknown advancement type: ${type}`);
  }

  return calculateFinalTrainingTime(baseTime, options);
}

