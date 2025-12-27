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
import { DEFAULT_DICE_RULES } from "./dice-engine";

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
 * Get attribute value from character
 */
export function getAttributeValue(
  character: Character,
  attributeName: string
): number {
  if (!character.attributes) return 0;

  const normalizedName = attributeName.toLowerCase();

  // Check common attribute names
  switch (normalizedName) {
    case "body":
    case "bod":
      return character.attributes.body ?? 0;
    case "agility":
    case "agi":
      return character.attributes.agility ?? 0;
    case "reaction":
    case "rea":
      return character.attributes.reaction ?? 0;
    case "strength":
    case "str":
      return character.attributes.strength ?? 0;
    case "willpower":
    case "wil":
      return character.attributes.willpower ?? 0;
    case "logic":
    case "log":
      return character.attributes.logic ?? 0;
    case "intuition":
    case "int":
      return character.attributes.intuition ?? 0;
    case "charisma":
    case "cha":
      return character.attributes.charisma ?? 0;
    case "edge":
      return character.attributes.edge ?? 0;
    case "magic":
    case "mag":
      return character.attributes.magic ?? 0;
    case "resonance":
    case "res":
      return character.attributes.resonance ?? 0;
    default:
      return 0;
  }
}

/**
 * Get skill rating from character
 */
export function getSkillRating(
  character: Character,
  skillName: string
): number {
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
  character: Character,
  skillName: string,
  specialization: string
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
      return Math.ceil(
        ((attrs.strength ?? 0) + (attrs.body ?? 0) + (attrs.reaction ?? 0)) / 3
      );
    case "mental":
      // (Logic + Intuition + Willpower) / 3, rounded up
      return Math.ceil(
        ((attrs.logic ?? 0) + (attrs.intuition ?? 0) + (attrs.willpower ?? 0)) /
          3
      );
    case "social":
      // (Charisma + Willpower + Essence) / 3, rounded up
      // Essence comes from derivedStats or defaults to 6
      const essence = character.derivedStats?.essence ?? 6;
      return Math.ceil(
        ((attrs.charisma ?? 0) + (attrs.willpower ?? 0) + essence) / 3
      );
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
export function addModifiersToPool(
  pool: ActionPool,
  ...newModifiers: PoolModifier[]
): ActionPool {
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
export function applyLimitToPool(
  pool: ActionPool,
  limit: number,
  limitSource: string
): ActionPool {
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
