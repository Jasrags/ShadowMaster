/**
 * Wireless Effect Types
 *
 * Types for structured wireless bonus effects that enable mechanical
 * calculation without text parsing.
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

// =============================================================================
// WIRELESS EFFECT TYPES
// =============================================================================

/**
 * Types of bonuses wireless connectivity can provide.
 */
export type WirelessEffectType =
  | "attribute" // Bonus to an attribute (e.g., +1 Agility)
  | "initiative" // Bonus to Initiative Score
  | "initiative_dice" // Bonus Initiative Dice
  | "attack_pool" // Bonus to attack dice pools
  | "defense_pool" // Bonus to defense dice pools
  | "damage_resist" // Bonus to damage resistance tests
  | "armor" // Bonus to armor rating
  | "limit" // Bonus to a limit (Physical, Mental, Social)
  | "recoil" // Recoil compensation bonus
  | "skill" // Bonus to specific skill
  | "perception" // Bonus to perception tests
  | "noise_reduction" // Reduce Matrix noise
  | "special"; // Complex effect requiring custom handling

/**
 * Attribute keys for attribute-type effects.
 */
export type AttributeKey =
  | "body"
  | "agility"
  | "reaction"
  | "strength"
  | "willpower"
  | "logic"
  | "intuition"
  | "charisma"
  | "edge"
  | "magic"
  | "resonance";

/**
 * Limit keys for limit-type effects.
 */
export type LimitKey = "physical" | "mental" | "social";

/**
 * Conditions under which an effect applies.
 */
export type EffectConditionType =
  | "always" // Always active when wireless enabled
  | "ranged_attack" // Only during ranged attacks
  | "melee_attack" // Only during melee attacks
  | "defense" // Only during defense tests
  | "matrix_action" // Only during Matrix actions
  | "vehicle_test" // Only during vehicle tests
  | "perception_test" // Only during perception tests
  | "stealth_test" // Only during stealth tests
  | "combat"; // Only during combat

// =============================================================================
// WIRELESS EFFECT STRUCTURE
// =============================================================================

/**
 * Structured wireless bonus effect.
 * Designed for mechanical calculation without text parsing.
 */
export interface WirelessEffect {
  /** Type of effect */
  type: WirelessEffectType;

  /** Numeric modifier (positive for bonus, negative for penalty) */
  modifier: number;

  // Conditional fields based on effect type

  /** For 'attribute' type: which attribute is affected */
  attribute?: AttributeKey;

  /** For 'limit' type: which limit is affected */
  limit?: LimitKey;

  /** For 'skill' type: skill ID or category affected */
  skill?: string;

  /** Condition under which this effect applies */
  condition?: EffectConditionType;

  /** For 'special' type: human-readable description of the effect */
  description?: string;

  /** Whether this is a dice pool bonus (true) or flat modifier (false) */
  isDicePool?: boolean;
}

// =============================================================================
// CATALOG DATA EXTENSIONS
// =============================================================================

/**
 * Wireless bonus data for catalog items.
 * Added to items that provide wireless bonuses.
 */
export interface WirelessBonusData {
  /** Human-readable wireless bonus description (for UI display) */
  wirelessBonus: string;

  /** Machine-readable wireless effects (for calculation) */
  wirelessEffects?: WirelessEffect[];
}

// =============================================================================
// AGGREGATED WIRELESS BONUSES
// =============================================================================

/**
 * Aggregated wireless bonuses from all active items.
 * Calculated from all equipped, wireless-enabled items.
 */
export interface ActiveWirelessBonuses {
  /** Total initiative bonus */
  initiative: number;

  /** Total initiative dice bonus */
  initiativeDice: number;

  /** Attribute bonuses by attribute */
  attributes: Partial<Record<AttributeKey, number>>;

  /** Total attack pool bonus */
  attackPool: number;

  /** Total defense pool bonus */
  defensePool: number;

  /** Total damage resistance bonus */
  damageResist: number;

  /** Total armor bonus */
  armor: number;

  /** Total recoil compensation bonus */
  recoil: number;

  /** Limit bonuses by limit type */
  limits: Partial<Record<LimitKey, number>>;

  /** Skill bonuses by skill ID */
  skills: Record<string, number>;

  /** Noise reduction bonus */
  noiseReduction: number;

  /** Perception bonus */
  perception: number;

  /** Special effects that need custom handling */
  specialEffects: WirelessEffect[];
}

/**
 * Default/empty wireless bonuses.
 */
export const EMPTY_WIRELESS_BONUSES: ActiveWirelessBonuses = {
  initiative: 0,
  initiativeDice: 0,
  attributes: {},
  attackPool: 0,
  defensePool: 0,
  damageResist: 0,
  armor: 0,
  recoil: 0,
  limits: {},
  skills: {},
  noiseReduction: 0,
  perception: 0,
  specialEffects: [],
};

// =============================================================================
// COMMON WIRELESS EFFECTS (Reference Data)
// =============================================================================

/**
 * Pre-defined wireless effects for common items.
 * These are reference implementations for the most common effects.
 */
export const COMMON_WIRELESS_EFFECTS: Record<string, WirelessEffect[]> = {
  // Smartgun System: +2 dice pool to ranged attacks
  "smartgun-system": [
    {
      type: "attack_pool",
      modifier: 2,
      condition: "ranged_attack",
      isDicePool: true,
    },
  ],

  // Wired Reflexes Rating 1-3: +1/2/3 Initiative
  "wired-reflexes-1": [{ type: "initiative", modifier: 1 }],
  "wired-reflexes-2": [{ type: "initiative", modifier: 2 }],
  "wired-reflexes-3": [{ type: "initiative", modifier: 3 }],

  // Synaptic Booster 1-3: +1/2/3 Initiative Dice (wireless adds +1 Initiative)
  "synaptic-booster-1": [{ type: "initiative", modifier: 1 }],
  "synaptic-booster-2": [{ type: "initiative", modifier: 1 }],
  "synaptic-booster-3": [{ type: "initiative", modifier: 1 }],

  // Muscle Toner: +1 Agility (wireless)
  "muscle-toner": [
    { type: "attribute", attribute: "agility", modifier: 1 },
  ],

  // Muscle Replacement: +1 Strength (wireless)
  "muscle-replacement": [
    { type: "attribute", attribute: "strength", modifier: 1 },
  ],

  // Reaction Enhancers: +1 Reaction (wireless)
  "reaction-enhancers": [
    { type: "attribute", attribute: "reaction", modifier: 1 },
  ],

  // Cybereyes with vision enhancement: +1 to visual perception
  "cybereyes-vision-enhancement": [
    {
      type: "perception",
      modifier: 1,
      condition: "perception_test",
      description: "Visual perception only",
    },
  ],

  // Vehicle Sensor: Extends sensor range (special handling)
  "vehicle-sensor": [
    {
      type: "special",
      modifier: 0,
      description: "Extended sensor range and sharing",
    },
  ],
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if an effect applies in the given context.
 */
export function effectAppliesInContext(
  effect: WirelessEffect,
  context: EffectConditionType
): boolean {
  // 'always' effects always apply
  if (!effect.condition || effect.condition === "always") {
    return true;
  }

  // 'combat' context includes attack and defense
  if (effect.condition === "combat") {
    return (
      context === "combat" ||
      context === "ranged_attack" ||
      context === "melee_attack" ||
      context === "defense"
    );
  }

  return effect.condition === context;
}

/**
 * Merge multiple wireless bonus objects into one.
 */
export function mergeWirelessBonuses(
  ...bonuses: ActiveWirelessBonuses[]
): ActiveWirelessBonuses {
  const result: ActiveWirelessBonuses = { ...EMPTY_WIRELESS_BONUSES };
  result.attributes = {};
  result.limits = {};
  result.skills = {};
  result.specialEffects = [];

  for (const bonus of bonuses) {
    result.initiative += bonus.initiative;
    result.initiativeDice += bonus.initiativeDice;
    result.attackPool += bonus.attackPool;
    result.defensePool += bonus.defensePool;
    result.damageResist += bonus.damageResist;
    result.armor += bonus.armor;
    result.recoil += bonus.recoil;
    result.noiseReduction += bonus.noiseReduction;
    result.perception += bonus.perception;

    // Merge attribute bonuses
    for (const [attr, value] of Object.entries(bonus.attributes)) {
      const key = attr as AttributeKey;
      result.attributes[key] = (result.attributes[key] ?? 0) + (value ?? 0);
    }

    // Merge limit bonuses
    for (const [limit, value] of Object.entries(bonus.limits)) {
      const key = limit as LimitKey;
      result.limits[key] = (result.limits[key] ?? 0) + (value ?? 0);
    }

    // Merge skill bonuses
    for (const [skill, value] of Object.entries(bonus.skills)) {
      result.skills[skill] = (result.skills[skill] ?? 0) + value;
    }

    // Collect special effects
    result.specialEffects.push(...bonus.specialEffects);
  }

  return result;
}

/**
 * Apply a single wireless effect to a bonuses object.
 */
export function applyWirelessEffect(
  bonuses: ActiveWirelessBonuses,
  effect: WirelessEffect
): ActiveWirelessBonuses {
  const result = { ...bonuses };

  switch (effect.type) {
    case "initiative":
      result.initiative += effect.modifier;
      break;
    case "initiative_dice":
      result.initiativeDice += effect.modifier;
      break;
    case "attack_pool":
      result.attackPool += effect.modifier;
      break;
    case "defense_pool":
      result.defensePool += effect.modifier;
      break;
    case "damage_resist":
      result.damageResist += effect.modifier;
      break;
    case "armor":
      result.armor += effect.modifier;
      break;
    case "recoil":
      result.recoil += effect.modifier;
      break;
    case "perception":
      result.perception += effect.modifier;
      break;
    case "noise_reduction":
      result.noiseReduction += effect.modifier;
      break;
    case "attribute":
      if (effect.attribute) {
        result.attributes = { ...result.attributes };
        result.attributes[effect.attribute] =
          (result.attributes[effect.attribute] ?? 0) + effect.modifier;
      }
      break;
    case "limit":
      if (effect.limit) {
        result.limits = { ...result.limits };
        result.limits[effect.limit] =
          (result.limits[effect.limit] ?? 0) + effect.modifier;
      }
      break;
    case "skill":
      if (effect.skill) {
        result.skills = { ...result.skills };
        result.skills[effect.skill] =
          (result.skills[effect.skill] ?? 0) + effect.modifier;
      }
      break;
    case "special":
      result.specialEffects = [...result.specialEffects, effect];
      break;
  }

  return result;
}
