/**
 * Pool Builder for Action Resolution
 *
 * Calculates action pools from character state including
 * attributes, skills, wound modifiers, and situational bonuses.
 */

import type {
  Character,
  ActionPool,
  PoolModifier,
  PoolBuildOptions,
  EditionDiceRules,
} from "@/lib/types";
import type { EncumbranceState } from "@/lib/types/gear-state";
import type { EffectConditionType, ActiveWirelessBonuses } from "@/lib/types/wireless-effects";
import { DEFAULT_DICE_RULES } from "./dice-engine";
import { calculateEncumbrance } from "../encumbrance/calculator";
import { calculateContextualWirelessBonuses } from "../wireless/bonus-calculator";
import { normalizeAttributeKey } from "@/lib/constants/attributes";

// =============================================================================
// WOUND MODIFIER CALCULATION
// =============================================================================

/**
 * Calculate wound modifier from current damage
 *
 * In SR5, for every 3 boxes of damage (Physical or Stun),
 * you take a cumulative -1 wound modifier to all tests.
 */
export function calculateWoundModifier(
  physicalDamage: number,
  stunDamage: number,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): number {
  const totalDamage = physicalDamage + stunDamage;
  const boxesPerPenalty = rules.woundModifiers?.boxesPerPenalty ?? 3;
  const maxPenalty = rules.woundModifiers?.maxPenalty ?? -4;

  const penaltyLevel = Math.floor(totalDamage / boxesPerPenalty);

  // No penalty if damage is below threshold (avoid -0)
  if (penaltyLevel === 0) {
    return 0;
  }

  const penalty = -penaltyLevel;

  // Clamp to max penalty (which is negative)
  return Math.max(penalty, maxPenalty);
}

/**
 * Create a wound modifier pool modifier if applicable
 */
export function createWoundModifier(
  character: Character,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): PoolModifier | null {
  const physicalDamage = character.condition?.physicalDamage ?? 0;
  const stunDamage = character.condition?.stunDamage ?? 0;

  const woundMod = calculateWoundModifier(physicalDamage, stunDamage, rules);

  if (woundMod < 0) {
    return {
      source: "wound",
      value: woundMod,
      description: `Wound modifier (${physicalDamage}P + ${stunDamage}S damage)`,
    };
  }

  return null;
}

// =============================================================================
// ATTRIBUTE & SKILL LOOKUP
// =============================================================================

/**
 * Get attribute value from character.
 * Uses normalizeAttributeKey to handle abbreviations (bod, agi, etc.).
 */
export function getAttributeValue(character: Character, attributeName: string): number {
  if (!character.attributes) return 0;

  const normalizedName = normalizeAttributeKey(attributeName);

  // Direct property access using normalized name
  const value = character.attributes[normalizedName as keyof typeof character.attributes];

  return typeof value === "number" ? value : 0;
}

/**
 * Get skill rating from character
 */
export function getSkillRating(character: Character, skillName: string): number {
  if (!character.skills) return 0;

  const normalizedName = skillName.toLowerCase();

  // Check active skills
  for (const [key, value] of Object.entries(character.skills)) {
    if (key.toLowerCase() === normalizedName) {
      return typeof value === "number" ? value : 0;
    }
  }

  // Check knowledge skills
  if (character.knowledgeSkills) {
    for (const skill of character.knowledgeSkills) {
      if (skill.name.toLowerCase() === normalizedName) {
        return skill.rating ?? 0;
      }
    }
  }

  return 0;
}

/**
 * Check if character has a specialization for a skill
 */
export function hasSpecialization(
  _character: Character,
  _skillName: string,
  _specialization: string
): boolean {
  // Specializations would typically be stored in character data
  // This is a placeholder - implement based on actual data structure
  // For now, return false (no specialization bonus)
  return false;
}

// =============================================================================
// LIMIT CALCULATION
// =============================================================================

/**
 * Calculate a limit value from character attributes
 */
export function calculateLimit(
  character: Character,
  limitType: "physical" | "mental" | "social"
): number {
  const attrs = character.attributes;
  if (!attrs) return 0;

  switch (limitType) {
    case "physical":
      // (Strength + Body + Reaction) / 3, rounded up
      return Math.ceil(((attrs.strength ?? 0) + (attrs.body ?? 0) + (attrs.reaction ?? 0)) / 3);
    case "mental":
      // (Logic + Intuition + Willpower) / 3, rounded up
      return Math.ceil(((attrs.logic ?? 0) + (attrs.intuition ?? 0) + (attrs.willpower ?? 0)) / 3);
    case "social":
      // (Charisma + Willpower + Essence) / 3, rounded up
      // Essence comes from derivedStats or defaults to 6
      const essence = character.derivedStats?.essence ?? 6;
      return Math.ceil(((attrs.charisma ?? 0) + (attrs.willpower ?? 0) + essence) / 3);
    default:
      return 0;
  }
}

// =============================================================================
// POOL BUILDING
// =============================================================================

/**
 * Build an action pool from character state and options
 */
export function buildActionPool(
  character: Character,
  options: PoolBuildOptions,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  const modifiers: PoolModifier[] = [];
  let basePool = 0;

  // Calculate base pool
  if (options.manualPool !== undefined) {
    // Use manual override
    basePool = options.manualPool;
  } else {
    // Calculate from attribute + skill
    if (options.attribute) {
      const attrValue = getAttributeValue(character, options.attribute);
      basePool += attrValue;
    }

    if (options.skill) {
      const skillRating = getSkillRating(character, options.skill);
      basePool += skillRating;

      // Check for specialization bonus (+2)
      if (
        options.specialization &&
        hasSpecialization(character, options.skill, options.specialization)
      ) {
        modifiers.push({
          source: "other",
          value: 2,
          description: `Specialization: ${options.specialization}`,
        });
      }
    }
  }

  // Add wound modifier if applicable
  if (options.includeWoundModifiers !== false) {
    const woundMod = createWoundModifier(character, rules);
    if (woundMod) {
      modifiers.push(woundMod);
    }
  }

  // Add situational modifiers
  if (options.situationalModifiers) {
    modifiers.push(...options.situationalModifiers);
  }

  // Calculate total
  const modifierTotal = modifiers.reduce((sum, m) => sum + m.value, 0);
  const totalDice = Math.max(0, basePool + modifierTotal);

  return {
    basePool,
    attribute: options.attribute,
    skill: options.skill,
    specialization: options.specialization,
    modifiers,
    totalDice,
    limit: options.limit,
    limitSource: options.limitSource,
  };
}

/**
 * Build a simple pool from just a number (for quick rolls)
 */
export function buildSimplePool(diceCount: number): ActionPool {
  return {
    basePool: diceCount,
    modifiers: [],
    totalDice: Math.max(0, diceCount),
  };
}

/**
 * Add modifiers to an existing pool
 */
export function addModifiersToPool(pool: ActionPool, ...newModifiers: PoolModifier[]): ActionPool {
  const allModifiers = [...pool.modifiers, ...newModifiers];
  const modifierTotal = allModifiers.reduce((sum, m) => sum + m.value, 0);

  return {
    ...pool,
    modifiers: allModifiers,
    totalDice: Math.max(0, pool.basePool + modifierTotal),
  };
}

/**
 * Apply a limit to a pool
 */
export function applyLimitToPool(pool: ActionPool, limit: number, limitSource: string): ActionPool {
  return {
    ...pool,
    limit,
    limitSource,
  };
}

// =============================================================================
// COMMON POOL BUILDERS
// =============================================================================

/**
 * Build an attack pool (Agility + Combat Skill)
 */
export function buildAttackPool(
  character: Character,
  skill: string,
  weaponAccuracy?: number,
  situationalModifiers?: PoolModifier[],
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  return buildActionPool(
    character,
    {
      attribute: "agility",
      skill,
      limit: weaponAccuracy,
      limitSource: "Weapon Accuracy",
      situationalModifiers,
    },
    rules
  );
}

/**
 * Build a defense pool (Reaction + Intuition)
 */
export function buildDefensePool(
  character: Character,
  situationalModifiers?: PoolModifier[],
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  const reaction = getAttributeValue(character, "reaction");
  const intuition = getAttributeValue(character, "intuition");

  return buildActionPool(
    character,
    {
      manualPool: reaction + intuition,
      situationalModifiers,
    },
    rules
  );
}

/**
 * Build a resistance pool (Body + Armor for physical damage)
 */
export function buildResistancePool(
  character: Character,
  armorValue: number,
  situationalModifiers?: PoolModifier[],
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  const body = getAttributeValue(character, "body");

  const pool = buildActionPool(
    character,
    {
      manualPool: body,
      situationalModifiers,
      includeWoundModifiers: false, // Resistance tests don't use wound modifiers
    },
    rules
  );

  return addModifiersToPool(pool, {
    source: "equipment",
    value: armorValue,
    description: "Armor",
  });
}

/**
 * Build a spellcasting pool (Magic + Spellcasting)
 */
export function buildSpellcastingPool(
  character: Character,
  forceLimit: number,
  situationalModifiers?: PoolModifier[],
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  return buildActionPool(
    character,
    {
      attribute: "magic",
      skill: "spellcasting",
      limit: forceLimit,
      limitSource: "Force",
      situationalModifiers,
    },
    rules
  );
}

/**
 * Build a perception pool (Intuition + Perception)
 */
export function buildPerceptionPool(
  character: Character,
  situationalModifiers?: PoolModifier[],
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  const mentalLimit = calculateLimit(character, "mental");

  return buildActionPool(
    character,
    {
      attribute: "intuition",
      skill: "perception",
      limit: mentalLimit,
      limitSource: "Mental Limit",
      situationalModifiers,
    },
    rules
  );
}

// =============================================================================
// ENCUMBRANCE MODIFIERS
// =============================================================================

/**
 * Calculate encumbrance modifier for a character.
 * Returns null if character is not encumbered.
 */
export function createEncumbranceModifier(character: Character): PoolModifier | null {
  const encumbrance = calculateEncumbrance(character);

  if (encumbrance.overweightPenalty < 0) {
    return {
      source: "encumbrance",
      value: encumbrance.overweightPenalty,
      description: `Encumbered (${encumbrance.currentWeight.toFixed(1)}/${encumbrance.maxCapacity.toFixed(1)} kg)`,
    };
  }

  return null;
}

/**
 * Get full encumbrance information for display.
 */
export { calculateEncumbrance };
export type { EncumbranceState };

// =============================================================================
// WIRELESS BONUS MODIFIERS
// =============================================================================

/**
 * Context type for wireless bonus calculation.
 * Maps to EffectConditionType from wireless-effects.
 */
export type WirelessContext = {
  testType: EffectConditionType | "attack" | "defense" | "perception";
};

/**
 * Get the appropriate EffectConditionType for a WirelessContext.
 */
function mapTestTypeToCondition(testType: WirelessContext["testType"]): EffectConditionType {
  switch (testType) {
    case "attack":
      return "ranged_attack"; // Default attack type
    case "defense":
      return "defense";
    case "perception":
      return "perception_test";
    default:
      return testType as EffectConditionType;
  }
}

/**
 * Create pool modifiers from active wireless bonuses.
 *
 * @param character - Character to analyze
 * @param context - What type of action is being performed
 * @returns Array of modifiers (may be empty if no bonuses apply)
 */
export function createWirelessModifiers(
  character: Character,
  context: WirelessContext
): PoolModifier[] {
  const conditionType = mapTestTypeToCondition(context.testType);
  const bonuses = calculateContextualWirelessBonuses(character, conditionType);
  const modifiers: PoolModifier[] = [];

  // Extract relevant bonuses based on test type
  if (
    context.testType === "attack" ||
    context.testType === "ranged_attack" ||
    context.testType === "melee_attack"
  ) {
    if (bonuses.attackPool > 0) {
      modifiers.push({
        source: "wireless",
        value: bonuses.attackPool,
        description: "Wireless attack bonus",
      });
    }
    if (bonuses.recoil > 0) {
      modifiers.push({
        source: "wireless",
        value: bonuses.recoil,
        description: "Wireless recoil compensation",
      });
    }
  }

  if (context.testType === "defense") {
    if (bonuses.defensePool > 0) {
      modifiers.push({
        source: "wireless",
        value: bonuses.defensePool,
        description: "Wireless defense bonus",
      });
    }
  }

  // Check for initiative bonuses (always relevant)
  if (bonuses.initiative > 0) {
    modifiers.push({
      source: "wireless",
      value: bonuses.initiative,
      description: "Wireless initiative bonus",
    });
  }

  return modifiers;
}

/**
 * Get a single combined wireless modifier for display simplicity.
 * Returns null if no wireless bonuses apply.
 */
export function createCombinedWirelessModifier(
  character: Character,
  context: WirelessContext
): PoolModifier | null {
  const modifiers = createWirelessModifiers(character, context);

  if (modifiers.length === 0) {
    return null;
  }

  const totalValue = modifiers.reduce((sum, m) => sum + m.value, 0);
  const sources = modifiers.map((m) => m.description).join(", ");

  return {
    source: "wireless",
    value: totalValue,
    description: `Wireless bonuses: ${sources}`,
  };
}

// Re-export types for convenience
export type { ActiveWirelessBonuses };

// =============================================================================
// ENHANCED POOL BUILDING
// =============================================================================

/**
 * Extended options for building pools with inventory state integration.
 */
export interface EnhancedPoolBuildOptions extends PoolBuildOptions {
  /** Include encumbrance penalty if applicable */
  includeEncumbrance?: boolean;
  /** Wireless context for bonus calculation */
  wirelessContext?: WirelessContext;
}

/**
 * Build an action pool with full inventory state integration.
 *
 * This enhanced version includes:
 * - Encumbrance penalties (if enabled)
 * - Wireless bonuses (if context provided)
 * - Standard wound modifiers
 * - Situational modifiers
 */
export function buildEnhancedActionPool(
  character: Character,
  options: EnhancedPoolBuildOptions,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  // Start with base pool
  let pool = buildActionPool(character, options, rules);

  // Add encumbrance penalty if applicable
  if (options.includeEncumbrance !== false) {
    const encumbranceMod = createEncumbranceModifier(character);
    if (encumbranceMod) {
      pool = addModifiersToPool(pool, encumbranceMod);
    }
  }

  // Add wireless bonuses if context provided
  if (options.wirelessContext) {
    const wirelessMods = createWirelessModifiers(character, options.wirelessContext);
    if (wirelessMods.length > 0) {
      pool = addModifiersToPool(pool, ...wirelessMods);
    }
  }

  return pool;
}

/**
 * Build an enhanced attack pool with smartgun/wireless bonuses.
 */
export function buildEnhancedAttackPool(
  character: Character,
  skill: string,
  weaponAccuracy?: number,
  situationalModifiers?: PoolModifier[],
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  return buildEnhancedActionPool(
    character,
    {
      attribute: "agility",
      skill,
      limit: weaponAccuracy,
      limitSource: "Weapon Accuracy",
      situationalModifiers,
      includeEncumbrance: true,
      wirelessContext: { testType: "attack" },
    },
    rules
  );
}

/**
 * Build an enhanced defense pool.
 */
export function buildEnhancedDefensePool(
  character: Character,
  situationalModifiers?: PoolModifier[],
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  const reaction = getAttributeValue(character, "reaction");
  const intuition = getAttributeValue(character, "intuition");

  return buildEnhancedActionPool(
    character,
    {
      manualPool: reaction + intuition,
      situationalModifiers,
      includeEncumbrance: true,
      wirelessContext: { testType: "defense" },
    },
    rules
  );
}
