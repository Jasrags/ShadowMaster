/**
 * Quality gameplay integration
 *
 * Central integration functions for applying quality effects to gameplay systems.
 * This module provides convenient wrappers that combine quality effects with
 * base calculations for wound modifiers, dice pools, limits, etc.
 */

import type { Character } from "@/lib/types";
import type { MergedRuleset } from "@/lib/types";
import {
  getDicePoolModifiers,
  getLimitModifiers,
  getWoundModifierModifiers,
  getLifestyleCostModifiers,
  getHealingModifiers,
  getAttributeModifiers,
  getAttributeMaximumModifiers,
} from "./effects/integration";
import { calculateWithdrawalPenalties } from "./dynamic-state/addiction";
import { calculateAllergyPenalties } from "./dynamic-state/allergy";
import { calculateTotalLifestyleModifier } from "./dynamic-state/dependents";

/**
 * Calculate wound modifier with quality effects
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param damageTrack - "physical" or "stun"
 * @returns Wound modifier (negative number, e.g., -2)
 */
export function calculateWoundModifier(
  character: Character,
  ruleset: MergedRuleset,
  damageTrack: "physical" | "stun"
): number {
  const damage = character.condition[damageTrack === "physical" ? "physicalDamage" : "stunDamage"];

  // Get quality effects for wound modifiers
  const woundModifiers = getWoundModifierModifiers(character, ruleset, damage);

  // Default interval is 3 boxes per -1 modifier
  const interval = woundModifiers.penaltyInterval || 3;
  const boxesIgnored = woundModifiers.boxesIgnored || 0;

  // Calculate effective damage (after ignoring boxes)
  const effectiveDamage = Math.max(0, damage - boxesIgnored);

  // Calculate modifier: -1 per interval
  return -Math.floor(effectiveDamage / interval);
}

/**
 * Calculate skill dice pool with quality effects
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param skill - Skill name
 * @param attribute - Attribute name
 * @param skillRating - Skill rating
 * @param context - Test context
 * @returns Total dice pool
 */
export function calculateSkillDicePool(
  character: Character,
  ruleset: MergedRuleset,
  skill: string,
  attribute: string,
  skillRating: number,
  context: {
    testCategory?: "combat" | "social" | "technical" | "magic" | "matrix";
    isResistanceTest?: boolean;
    isDefenseTest?: boolean;
    environment?: string[];
    characterState?: string[];
  } = {}
): number {
  // Base pool: attribute + skill
  const attributeValue = character.attributes[attribute] || 0;
  let pool = attributeValue + skillRating;

  // Get quality modifiers
  const qualityModifiers = getDicePoolModifiers(
    character,
    ruleset,
    skill,
    undefined, // skillGroup
    context
  );
  pool += qualityModifiers;

  // Apply withdrawal penalties (if applicable)
  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];
  for (const selection of allQualities) {
    if (selection.dynamicState?.type === "addiction") {
      const withdrawalPenalty = calculateWithdrawalPenalties(
        character,
        selection.qualityId || selection.id || ""
      );
      if (withdrawalPenalty > 0) {
        // Withdrawal penalties apply to Physical and Mental tests
        const isPhysicalOrMental =
          ["body", "agility", "reaction", "strength"].includes(attribute) ||
          ["logic", "intuition", "willpower"].includes(attribute);
        if (isPhysicalOrMental) {
          pool -= withdrawalPenalty;
        }
      }
    }
  }

  // Apply allergy penalties (if applicable)
  for (const selection of allQualities) {
    if (selection.dynamicState?.type === "allergy") {
      const allergyPenalty = calculateAllergyPenalties(
        character,
        selection.qualityId || selection.id || ""
      );
      if (allergyPenalty > 0) {
        pool -= allergyPenalty;
      }
    }
  }

  return Math.max(0, pool); // Pool cannot go below 0
}

/**
 * Calculate limit with quality effects
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param limitType - "physical", "mental", "social", or "astral"
 * @returns Total limit value
 */
export function calculateLimit(
  character: Character,
  ruleset: MergedRuleset,
  limitType: "physical" | "mental" | "social" | "astral"
): number {
  // Base limit calculation
  let baseLimit = 0;

  switch (limitType) {
    case "physical": {
      const strength = character.attributes.strength || 1;
      const body = character.attributes.body || 1;
      const reaction = character.attributes.reaction || 1;
      baseLimit = Math.ceil((strength * 2 + body + reaction) / 3);
      break;
    }
    case "mental": {
      const logic = character.attributes.logic || 1;
      const intuition = character.attributes.intuition || 1;
      const willpower = character.attributes.willpower || 1;
      baseLimit = Math.ceil((logic * 2 + intuition + willpower) / 3);
      break;
    }
    case "social": {
      const charisma = character.attributes.charisma || 1;
      const willpower = character.attributes.willpower || 1;
      const essence = Math.ceil(character.specialAttributes?.essence || 6);
      baseLimit = Math.ceil((charisma * 2 + willpower + essence) / 3);
      break;
    }
    case "astral": {
      // Astral limit is typically same as mental
      const logic = character.attributes.logic || 1;
      const intuition = character.attributes.intuition || 1;
      const willpower = character.attributes.willpower || 1;
      baseLimit = Math.ceil((logic * 2 + intuition + willpower) / 3);
      break;
    }
  }

  // Get quality modifiers
  const qualityModifiers = getLimitModifiers(character, ruleset, limitType);

  return Math.max(1, baseLimit + qualityModifiers); // Limit cannot go below 1
}

/**
 * Calculate lifestyle cost with quality effects
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param baseCost - Base lifestyle monthly cost
 * @returns Total monthly cost with modifiers
 */
export function calculateLifestyleCost(
  character: Character,
  ruleset: MergedRuleset,
  baseCost: number
): number {
  // Get quality modifiers (from effects system)
  const qualityMultiplier = getLifestyleCostModifiers(character, ruleset, baseCost);

  // Get dependents modifiers (from dynamic state)
  const dependentsModifier = calculateTotalLifestyleModifier(character);
  const dependentsMultiplier = 1 + dependentsModifier / 100;

  // Apply modifiers
  const totalCost = baseCost * qualityMultiplier * dependentsMultiplier;

  // Apply SINner tax rates (if applicable)
  // Note: SINner tax rates would be applied here if we had SINner quality effects
  // For now, this is a placeholder for future implementation

  return Math.max(0, totalCost);
}

/**
 * Calculate healing test dice pool with quality effects
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param healingType - Type of healing
 * @param affectsSelf - Whether healing self
 * @param basePool - Base dice pool (skill + attribute)
 * @returns Total dice pool
 */
export function calculateHealingDicePool(
  character: Character,
  ruleset: MergedRuleset,
  healingType: "natural" | "magical" | "first-aid" | "medicine",
  affectsSelf: boolean,
  basePool: number
): number {
  const qualityModifiers = getHealingModifiers(character, ruleset, healingType, affectsSelf);

  return Math.max(0, basePool + qualityModifiers);
}

/**
 * Calculate attribute value with quality modifiers
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param attribute - Attribute name
 * @returns Total attribute value (base + modifiers)
 */
export function calculateAttributeValue(
  character: Character,
  ruleset: MergedRuleset,
  attribute: string
): number {
  const baseValue = character.attributes[attribute] || 0;
  const qualityModifiers = getAttributeModifiers(character, ruleset, attribute);

  return Math.max(0, baseValue + qualityModifiers);
}

/**
 * Calculate attribute maximum with quality modifiers
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param attribute - Attribute name
 * @param baseMaximum - Base maximum (typically 6, or metatype-specific)
 * @returns Maximum attribute value
 */
export function calculateAttributeMaximum(
  character: Character,
  ruleset: MergedRuleset,
  attribute: string,
  baseMaximum: number
): number {
  const qualityModifiers = getAttributeMaximumModifiers(character, ruleset, attribute);

  return baseMaximum + qualityModifiers;
}
