/**
 * Effects integration points
 *
 * Functions to be called by gameplay systems to get quality effect modifiers.
 * These provide convenient entry points for dice pools, limits, wound modifiers, etc.
 */

import type { Character } from "@/lib/types";
import type { MergedRuleset } from "@/lib/types";
import type {
  TestContext,
  CombatContext,
  MagicContext,
  MatrixContext,
  HealingContext,
  DamageContext,
  CostContext,
  ResolvedEffect,
} from "@/lib/types/gameplay";
import { getQualityDefinition } from "../utils";
import {
  getActiveEffects,
  filterEffectsByTrigger,
} from "../effects";
import { processEffect } from "./handlers";

/**
 * Get all active quality effects for a character in a given context
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param context - Gameplay context
 * @returns Array of resolved effects
 */
export function getAllCharacterEffects(
  character: Character,
  ruleset: MergedRuleset,
  context: TestContext | CombatContext | MagicContext | MatrixContext | HealingContext | DamageContext | CostContext
): ResolvedEffect[] {
  const allEffects: ResolvedEffect[] = [];

  // Process positive qualities
  for (const selection of character.positiveQualities || []) {
    const quality = getQualityDefinition(ruleset, selection.qualityId || selection.id || "");
    if (quality) {
      const effects = getActiveEffects(character, quality, selection, context);
      allEffects.push(...effects);
    }
  }

  // Process negative qualities
  for (const selection of character.negativeQualities || []) {
    const quality = getQualityDefinition(ruleset, selection.qualityId || selection.id || "");
    if (quality) {
      const effects = getActiveEffects(character, quality, selection, context);
      allEffects.push(...effects);
    }
  }

  return allEffects;
}

/**
 * Get dice pool modifiers for a skill test
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param skill - Skill name (optional)
 * @param skillGroup - Skill group name (optional)
 * @param context - Additional test context
 * @returns Total dice pool modifier
 */
export function getDicePoolModifiers(
  character: Character,
  ruleset: MergedRuleset,
  skill?: string,
  skillGroup?: string,
  context: Partial<TestContext> = {}
): number {
  const testContext: TestContext = {
    ...context,
    skill,
    skillGroup,
    testCategory: context.testCategory,
    isResistanceTest: context.isResistanceTest,
    isDefenseTest: context.isDefenseTest,
  };

  const effects = getAllCharacterEffects(character, ruleset, testContext);
  const skillTestEffects = filterEffectsByTrigger(effects, "skill-test");

  let totalModifier = 0;

  for (const resolved of skillTestEffects) {
    // Check if effect targets this skill or skill group
    const target = resolved.target;
    const matchesSkill = skill && target.skill === skill;
    const matchesSkillGroup = skillGroup && target.skillGroup === skillGroup;
    const matchesCategory = context.testCategory && target.testCategory === context.testCategory;

    if (matchesSkill || matchesSkillGroup || matchesCategory || !target.skill && !target.skillGroup && !target.testCategory) {
      if (resolved.effect.type === "dice-pool-modifier") {
        const processed = processEffect(resolved);
        if (typeof processed === "number") {
          totalModifier += processed;
        }
      }
    }
  }

  // Also check "always" trigger effects
  const alwaysEffects = filterEffectsByTrigger(effects, "always");
  for (const resolved of alwaysEffects) {
    if (resolved.effect.type === "dice-pool-modifier") {
      const target = resolved.target;
      const matchesSkill = skill && target.skill === skill;
      const matchesSkillGroup = skillGroup && target.skillGroup === skillGroup;
      const matchesCategory = context.testCategory && target.testCategory === context.testCategory;

      if (matchesSkill || matchesSkillGroup || matchesCategory) {
        const processed = processEffect(resolved);
        if (typeof processed === "number") {
          totalModifier += processed;
        }
      }
    }
  }

  return totalModifier;
}

/**
 * Get limit modifiers for a specific limit type
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param limitType - Limit type ("physical", "mental", "social", "astral")
 * @returns Total limit modifier
 */
export function getLimitModifiers(
  character: Character,
  ruleset: MergedRuleset,
  limitType: "physical" | "mental" | "social" | "astral"
): number {
  const effects = getAllCharacterEffects(character, ruleset, {});

  let totalModifier = 0;

  for (const resolved of effects) {
    if (resolved.effect.type === "limit-modifier") {
      const target = resolved.target;
      if (target.limit === limitType) {
        const processed = processEffect(resolved);
        if (typeof processed === "number") {
          totalModifier += processed;
        }
      }
    }
  }

  return totalModifier;
}

/**
 * Get wound modifier data
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param woundBoxes - Current wound boxes
 * @returns Wound modifier data
 */
export function getWoundModifierModifiers(
  character: Character,
  ruleset: MergedRuleset,
  woundBoxes: number
): {
  boxesIgnored: number;
  penaltyInterval: number | null;
} {
  const damageContext: DamageContext = {
    calculatingWoundModifier: true,
    woundBoxes,
  };

  const effects = getAllCharacterEffects(character, ruleset, damageContext);

  let boxesIgnored = 0;
  let penaltyInterval: number | null = null;

  for (const resolved of effects) {
    if (resolved.effect.type === "wound-modifier") {
      const processed = processEffect(resolved);

      if (typeof processed === "object" && processed !== null && !Array.isArray(processed)) {
        if ("type" in processed && processed.type === "boxes-ignored" && "value" in processed) {
          boxesIgnored += typeof processed.value === "number" ? processed.value : 0;
        } else if ("type" in processed && processed.type === "penalty-interval" && "value" in processed) {
          penaltyInterval = typeof processed.value === "number" ? processed.value : null;
        }
      }
    }
  }

  return {
    boxesIgnored,
    penaltyInterval,
  };
}

/**
 * Get attribute modifiers for a specific attribute
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param attribute - Attribute name
 * @returns Total attribute modifier
 */
export function getAttributeModifiers(
  character: Character,
  ruleset: MergedRuleset,
  attribute: string
): number {
  const effects = getAllCharacterEffects(character, ruleset, {});

  let totalModifier = 0;

  for (const resolved of effects) {
    if (resolved.effect.type === "attribute-modifier") {
      const target = resolved.target;
      if (target.attribute === attribute) {
        const processed = processEffect(resolved);
        if (typeof processed === "number") {
          totalModifier += processed;
        }
      }
    }
  }

  return totalModifier;
}

/**
 * Get attribute maximum modifiers
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param attribute - Attribute name
 * @returns Maximum modifier (added to base maximum)
 */
export function getAttributeMaximumModifiers(
  character: Character,
  ruleset: MergedRuleset,
  attribute: string
): number {
  const effects = getAllCharacterEffects(character, ruleset, {});

  let totalModifier = 0;

  for (const resolved of effects) {
    if (resolved.effect.type === "attribute-maximum") {
      const target = resolved.target;
      if (target.stat === attribute || target.attribute === attribute) {
        const processed = processEffect(resolved);
        if (typeof processed === "number") {
          totalModifier += processed;
        }
      }
    }
  }

  return totalModifier;
}

/**
 * Get lifestyle cost modifiers
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param baseCost - Base lifestyle cost
 * @returns Cost modifier (as multiplier, e.g., 1.1 for +10%)
 */
export function getLifestyleCostModifiers(
  character: Character,
  ruleset: MergedRuleset,
  baseCost: number
): number {
  const costContext: CostContext = {
    costType: "lifestyle",
    baseCost,
  };

  const effects = getAllCharacterEffects(character, ruleset, costContext);

  let multiplier = 1.0;

  for (const resolved of effects) {
    if (resolved.effect.type === "nuyen-cost-modifier") {
      const processed = processEffect(resolved);

      if (typeof processed === "object" && processed !== null && !Array.isArray(processed)) {
        if ("modifier" in processed && typeof processed.modifier === "number") {
          // Modifier might be percentage (e.g., 10 for +10%)
          multiplier += processed.modifier / 100;
        }
      }
    }
  }

  return multiplier;
}

/**
 * Get healing modifiers
 *
 * @param character - Character
 * @param ruleset - Merged ruleset
 * @param healingType - Type of healing
 * @param affectsSelf - Whether healing self
 * @returns Total healing modifier
 */
export function getHealingModifiers(
  character: Character,
  ruleset: MergedRuleset,
  healingType: "natural" | "magical" | "first-aid" | "medicine",
  affectsSelf: boolean
): number {
  const healingContext: HealingContext = {
    healingType,
    affectsSelf,
  };

  const effects = getAllCharacterEffects(character, ruleset, healingContext);
  const healingEffects = filterEffectsByTrigger(effects, "healing");

  let totalModifier = 0;

  for (const resolved of healingEffects) {
    if (resolved.effect.type === "healing-modifier") {
      const target = resolved.target;
      if (target.affectsOthers === !affectsSelf || target.affectsOthers === undefined) {
        const processed = processEffect(resolved);
        if (typeof processed === "number") {
          totalModifier += processed;
        }
      }
    }
  }

  return totalModifier;
}

