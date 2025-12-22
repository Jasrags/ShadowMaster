/**
 * Karma cost calculations for character advancement
 *
 * Implements the karma cost formulas for various advancement types
 * as documented in Shadowrun 5e rules.
 */

import type { AdvancementType } from "@/lib/types";

/**
 * Calculate karma cost to advance an attribute
 * Cost: new rating × 5
 *
 * @param newRating - The target rating (after advancement)
 * @returns Karma cost
 */
export function calculateAttributeCost(newRating: number): number {
  if (newRating < 1) {
    throw new Error("Attribute rating must be at least 1");
  }
  return newRating * 5;
}

/**
 * Calculate karma cost to advance an active skill
 * Cost: new rating × 2
 *
 * @param newRating - The target rating (after advancement)
 * @returns Karma cost
 */
export function calculateActiveSkillCost(newRating: number): number {
  if (newRating < 1) {
    throw new Error("Skill rating must be at least 1");
  }
  return newRating * 2;
}

/**
 * Calculate karma cost to advance a knowledge or language skill
 * Cost: new rating × 1
 *
 * @param newRating - The target rating (after advancement)
 * @returns Karma cost
 */
export function calculateKnowledgeSkillCost(newRating: number): number {
  if (newRating < 1) {
    throw new Error("Skill rating must be at least 1");
  }
  return newRating * 1;
}

/**
 * Calculate karma cost to advance a skill group
 * Cost: new rating × 5
 *
 * @param newRating - The target rating (after advancement)
 * @returns Karma cost
 */
export function calculateSkillGroupCost(newRating: number): number {
  if (newRating < 1) {
    throw new Error("Skill group rating must be at least 1");
  }
  return newRating * 5;
}

/**
 * Calculate karma cost for a specialization
 * Cost: 7 karma (fixed)
 *
 * @returns Karma cost (always 7)
 */
export function calculateSpecializationCost(): number {
  return 7;
}

/**
 * Calculate karma cost to advance Edge
 * Cost: new rating × 5 (same as attributes, but no downtime required)
 *
 * @param newRating - The target rating (after advancement)
 * @returns Karma cost
 */
export function calculateEdgeCost(newRating: number): number {
  if (newRating < 1) {
    throw new Error("Edge rating must be at least 1");
  }
  return newRating * 5;
}

/**
 * Calculate karma cost for a new knowledge or language skill
 * Cost: 1 karma (fixed)
 *
 * @returns Karma cost (always 1)
 */
export function calculateNewKnowledgeSkillCost(): number {
  return 1;
}

/**
 * Calculate karma cost for learning a new spell, ritual, or preparation
 * Cost: 5 karma (fixed)
 *
 * @returns Karma cost (always 5)
 */
export function calculateSpellCost(): number {
  return 5;
}

/**
 * Calculate karma cost for learning a new complex form
 * Cost: 4 karma (fixed)
 *
 * @returns Karma cost (always 4)
 */
export function calculateComplexFormCost(): number {
  return 4;
}

/**
 * Calculate karma cost based on advancement type
 *
 * @param type - Type of advancement
 * @param newRating - New rating/value (for rated advancements)
 * @returns Karma cost
 */
export function calculateAdvancementCost(
  type: AdvancementType,
  newRating?: number
): number {
  switch (type) {
    case "attribute":
    case "edge":
      if (newRating === undefined) {
        throw new Error("Rating required for attribute/edge advancement");
      }
      return calculateAttributeCost(newRating);

    case "skill":
      if (newRating === undefined) {
        throw new Error("Rating required for skill advancement");
      }
      return calculateActiveSkillCost(newRating);

    case "skillGroup":
      if (newRating === undefined) {
        throw new Error("Rating required for skill group advancement");
      }
      return calculateSkillGroupCost(newRating);

    case "knowledgeSkill":
    case "languageSkill":
      if (newRating === undefined) {
        throw new Error("Rating required for knowledge/language skill advancement");
      }
      return calculateKnowledgeSkillCost(newRating);

    case "specialization":
      return calculateSpecializationCost();

    case "spell":
    case "ritual":
      return calculateSpellCost();

    case "complexForm":
      return calculateComplexFormCost();

    case "focus":
      // Focus bonding cost varies by type - this is a placeholder
      // Actual implementation will need focus type information
      throw new Error("Focus bonding cost calculation requires focus type");

    case "initiation":
      // Initiation cost: 10 + (grade × 3) - requires grade information
      throw new Error("Initiation cost calculation requires grade");

    case "quality":
      // Quality costs handled separately in quality advancement module
      throw new Error("Quality costs are handled by quality advancement module");

    default:
      throw new Error(`Unknown advancement type: ${type}`);
  }
}

