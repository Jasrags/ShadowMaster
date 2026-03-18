/**
 * Quality gameplay integration
 *
 * Central integration functions for applying quality effects to gameplay systems.
 * This module provides convenient wrappers that combine quality effects with
 * base calculations for wound modifiers, dice pools, limits, etc.
 *
 * As of the Phase 1 unification (#741), these functions use the unified
 * effects pipeline (`lib/rules/effects/`) for gathering and context matching
 * instead of the legacy quality-only pipeline. The unified pipeline gathers
 * effects from ALL sources (qualities, gear, cyberware, bioware, adept powers,
 * active modifiers).
 */

import type { Character, MergedRuleset, EffectResolutionContext } from "@/lib/types";
import {
  gatherEffectSources,
  EffectContextBuilder,
  buildCharacterStateFlags,
  effectApplies,
} from "../effects";
import type { SourcedEffect } from "../effects";
import { calculateTotalLifestyleModifier } from "./dynamic-state/dependents";

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

/** Resolved effect with source metadata and computed value. */
interface ResolvedEffectEntry {
  source: SourcedEffect["source"];
  effect: SourcedEffect["effect"];
  resolvedValue: number;
}

/**
 * Gather all applicable effects for a character in a given context,
 * resolving per-rating values. Returns flat array of resolved effects
 * with their source metadata and computed numeric values.
 */
function getApplicableEffects(
  character: Character,
  ruleset: MergedRuleset,
  context: EffectResolutionContext
): ResolvedEffectEntry[] {
  const allSources = gatherEffectSources(character, ruleset);
  const applicable = allSources.filter((s) => effectApplies(s.effect, context));
  return resolveSourcedEffects(applicable);
}

/**
 * Gather ALL effects from a character, resolved but unfiltered by context.
 * Used for effect types like wound-modifier and healing-modifier that don't
 * map to a specific EffectActionContext but need to be found by type.
 */
function getAllResolvedEffects(
  character: Character,
  ruleset: MergedRuleset
): ResolvedEffectEntry[] {
  const allSources = gatherEffectSources(character, ruleset);
  return resolveSourcedEffects(allSources);
}

/**
 * Resolve a list of sourced effects into entries with computed values.
 */
function resolveSourcedEffects(sources: SourcedEffect[]): ResolvedEffectEntry[] {
  return sources.map(({ effect, source }) => {
    let resolvedValue: number;
    if (typeof effect.value === "number") {
      resolvedValue = effect.value;
    } else if (
      typeof effect.value === "object" &&
      effect.value !== null &&
      typeof effect.value.perRating === "number"
    ) {
      resolvedValue = effect.value.perRating * (source.rating ?? 1);
    } else {
      resolvedValue = 0;
    }

    if (effect.requiresWireless && !source.wirelessEnabled) {
      resolvedValue = 0;
    }

    if (source.wirelessEnabled && effect.wirelessOverride?.bonusValue) {
      resolvedValue += effect.wirelessOverride.bonusValue;
    }

    return { source, effect, resolvedValue };
  });
}

/**
 * Sum resolved values for effects matching a specific effect type.
 */
function sumByType(
  effects: Array<{ effect: SourcedEffect["effect"]; resolvedValue: number }>,
  effectType: string
): number {
  return effects
    .filter((e) => e.effect.type === effectType)
    .reduce((sum, e) => sum + e.resolvedValue, 0);
}

/**
 * Sum resolved values for effects matching a specific effect type AND target.
 */
function sumByTypeAndTarget(
  effects: Array<{ effect: SourcedEffect["effect"]; resolvedValue: number }>,
  effectType: string,
  targetKey: string,
  targetValue: string
): number {
  return effects
    .filter(
      (e) =>
        e.effect.type === effectType &&
        e.effect.target &&
        (e.effect.target as Record<string, unknown>)[targetKey] === targetValue
    )
    .reduce((sum, e) => sum + e.resolvedValue, 0);
}

// =============================================================================
// PUBLIC API
// =============================================================================

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

  // Gather all effects unfiltered — wound-modifier effects use triggers like
  // "damage-taken" that don't map to a specific EffectActionContext type.
  // We match by effect type directly instead.
  const effects = getAllResolvedEffects(character, ruleset);

  // Extract wound modifier data
  let boxesIgnored = 0;
  const penaltyInterval = 3; // Default: 3 boxes per -1 modifier

  for (const { effect, resolvedValue } of effects) {
    if (effect.type === "wound-modifier") {
      boxesIgnored += resolvedValue;
    }
  }

  // Calculate effective damage (after ignoring boxes)
  const effectiveDamage = Math.max(0, damage - boxesIgnored);

  // Calculate modifier: -1 per interval
  return -Math.floor(effectiveDamage / penaltyInterval);
}

/**
 * Calculate skill dice pool with quality effects
 *
 * Uses the unified effects pipeline which gathers effects from ALL sources
 * (qualities, gear, cyberware, bioware, adept powers) and handles
 * state-dependent triggers (withdrawal, allergy exposure) automatically.
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

  // Build unified effect context
  const ctxBuilder = EffectContextBuilder.forSkillTest(skill)
    .withAttribute(attribute)
    .withCharacterState(buildCharacterStateFlags(character));

  if (context.testCategory) {
    ctxBuilder.withSkillCategory(context.testCategory);
  }

  const effectContext = ctxBuilder.build();
  const effects = getApplicableEffects(character, ruleset, effectContext);

  // Apply dice pool modifiers
  pool += sumByType(effects, "dice-pool-modifier");

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
      const logic = character.attributes.logic || 1;
      const intuition = character.attributes.intuition || 1;
      const willpower = character.attributes.willpower || 1;
      baseLimit = Math.ceil((logic * 2 + intuition + willpower) / 3);
      break;
    }
  }

  // Use unified pipeline for limit modifiers
  const context = EffectContextBuilder.forSkillTest("")
    .withCharacterState(buildCharacterStateFlags(character))
    .build();
  const effects = getApplicableEffects(character, ruleset, context);

  const limitModifier = sumByTypeAndTarget(effects, "limit-modifier", "limit", limitType);

  return Math.max(1, baseLimit + limitModifier); // Limit cannot go below 1
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
  // Use unified pipeline for cost modifiers
  const context = EffectContextBuilder.forSkillTest("")
    .withCharacterState(buildCharacterStateFlags(character))
    .build();
  const effects = getApplicableEffects(character, ruleset, context);

  // Accumulate nuyen-cost-modifier as percentage multiplier
  let qualityMultiplier = 1.0;
  for (const { effect, resolvedValue } of effects) {
    if (effect.type === "nuyen-cost-modifier") {
      qualityMultiplier += resolvedValue / 100;
    }
  }

  // Get dependents modifiers (from dynamic state)
  const dependentsModifier = calculateTotalLifestyleModifier(character);
  const dependentsMultiplier = 1 + dependentsModifier / 100;

  // Apply modifiers
  const totalCost = baseCost * qualityMultiplier * dependentsMultiplier;

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
  // Gather all effects unfiltered — healing effects use the "healing" trigger
  // which doesn't map to a specific EffectActionContext type.
  // We match by effect type directly instead.
  const effects = getAllResolvedEffects(character, ruleset);

  // Sum healing modifiers
  const modifier = sumByType(effects, "healing-modifier");

  return Math.max(0, basePool + modifier);
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

  // Use unified pipeline — attribute modifiers match via "always" trigger
  const context = EffectContextBuilder.forSkillTest("")
    .withAttribute(attribute)
    .withCharacterState(buildCharacterStateFlags(character))
    .build();
  const effects = getApplicableEffects(character, ruleset, context);

  const modifier = sumByTypeAndTarget(effects, "attribute-modifier", "attribute", attribute);

  return Math.max(0, baseValue + modifier);
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
  // Use unified pipeline
  const context = EffectContextBuilder.forSkillTest("")
    .withAttribute(attribute)
    .withCharacterState(buildCharacterStateFlags(character))
    .build();
  const effects = getApplicableEffects(character, ruleset, context);

  // Sum attribute-maximum effects targeting this attribute
  let maxModifier = 0;
  for (const { effect, resolvedValue } of effects) {
    if (effect.type === "attribute-maximum") {
      const target = effect.target as Record<string, unknown> | undefined;
      if (target?.attribute === attribute || target?.stat === attribute) {
        maxModifier += resolvedValue;
      }
    }
  }

  return baseMaximum + maxModifier;
}
