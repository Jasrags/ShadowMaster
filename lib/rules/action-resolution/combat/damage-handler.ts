/**
 * Damage Handler for Combat
 *
 * Handles damage calculation, resistance, and application including:
 * - Armor reduction based on AP and armor value
 * - Resistance roll calculation (Body + modified Armor)
 * - Damage application to condition monitors
 * - Wound modifier calculation
 * - Overflow damage tracking
 * - Knockdown and other damage effects
 */

import type {
  Character,
  ActionPool,
  PoolModifier,
  EditionDiceRules,
} from "@/lib/types";
import {
  buildActionPool,
  getAttributeValue,
  calculateWoundModifier,
} from "../pool-builder";
import { DEFAULT_DICE_RULES } from "../dice-engine";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Damage type classification
 */
export type DamageType = "physical" | "stun";

/**
 * Request to apply damage to a character
 */
export interface DamageApplication {
  /** Target character ID */
  targetId: string;
  /** Type of damage */
  damageType: DamageType;
  /** Base damage value (after net hits) */
  damageValue: number;
  /** Armor penetration from weapon */
  armorPenetration: number;
  /** Source of damage (for tracking) */
  source?: string;
  /** Whether this is elemental damage */
  elementType?: ElementType;
  /** Whether target can resist (some effects bypass resistance) */
  canResist?: boolean;
}

/**
 * Element types for special damage
 */
export type ElementType =
  | "fire"
  | "electricity"
  | "acid"
  | "cold"
  | "radiation"
  | "toxin";

/**
 * State of a condition monitor
 */
export interface ConditionMonitorState {
  /** Current physical damage */
  physicalDamage: number;
  /** Maximum physical boxes */
  physicalMax: number;
  /** Current stun damage */
  stunDamage: number;
  /** Maximum stun boxes */
  stunMax: number;
  /** Overflow damage (only after physical is full) */
  overflowDamage: number;
  /** Maximum overflow before death */
  overflowMax: number;
  /** Whether character is unconscious (stun filled) */
  unconscious: boolean;
  /** Whether character is incapacitated (physical filled) */
  incapacitated: boolean;
  /** Whether character is dead (overflow filled) */
  dead: boolean;
}

/**
 * Result of applying damage
 */
export interface DamageResult {
  /** Modified damage after armor (before resistance) */
  damageAfterArmor: number;
  /** Armor value used in calculation */
  armorUsed: number;
  /** Modified armor after AP */
  modifiedArmor: number;
  /** Resistance pool for the target */
  resistancePool: ActionPool;
  /** Final damage dealt (after resistance) */
  damageDealt: number;
  /** Change in wound modifier */
  woundModifierChange: number;
  /** Previous wound modifier */
  previousWoundModifier: number;
  /** New wound modifier */
  newWoundModifier: number;
  /** Updated condition monitor state */
  conditionMonitorState: ConditionMonitorState;
  /** Whether attack caused knockdown */
  knockdown: boolean;
  /** Overflow damage (if any) */
  overflow: number;
  /** Whether damage type was converted (stun overflow to physical) */
  damageConverted: boolean;
  /** Effects triggered by damage */
  triggeredEffects: string[];
}

/**
 * Result of a resistance calculation
 */
export interface ResistanceResult {
  /** Resistance pool */
  pool: ActionPool;
  /** Modified armor value */
  modifiedArmor: number;
  /** Whether damage is converted to stun (armor > modified damage) */
  damageConvertedToStun: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Base physical condition monitor boxes (added to Body / 2)
 */
export const BASE_PHYSICAL_BOXES = 8;

/**
 * Base stun condition monitor boxes (added to Willpower / 2)
 */
export const BASE_STUN_BOXES = 8;

/**
 * Damage threshold for knockdown check
 */
export const KNOCKDOWN_THRESHOLD = 10;

// =============================================================================
// CONDITION MONITOR CALCULATIONS
// =============================================================================

/**
 * Calculate maximum physical condition monitor boxes
 * Formula: 8 + (Body / 2), round up
 */
export function calculatePhysicalMax(body: number): number {
  return BASE_PHYSICAL_BOXES + Math.ceil(body / 2);
}

/**
 * Calculate maximum stun condition monitor boxes
 * Formula: 8 + (Willpower / 2), round up
 */
export function calculateStunMax(willpower: number): number {
  return BASE_STUN_BOXES + Math.ceil(willpower / 2);
}

/**
 * Calculate maximum overflow boxes
 * Formula: Body
 */
export function calculateOverflowMax(body: number): number {
  return body;
}

/**
 * Get current condition monitor state from character
 */
export function getConditionMonitorState(
  character: Character
): ConditionMonitorState {
  const body = getAttributeValue(character, "body");
  const willpower = getAttributeValue(character, "willpower");

  const physicalMax = calculatePhysicalMax(body);
  const stunMax = calculateStunMax(willpower);
  const overflowMax = calculateOverflowMax(body);

  const physicalDamage = character.condition?.physicalDamage ?? 0;
  const stunDamage = character.condition?.stunDamage ?? 0;
  const overflowDamage = character.condition?.overflowDamage ?? 0;

  return {
    physicalDamage,
    physicalMax,
    stunDamage,
    stunMax,
    overflowDamage,
    overflowMax,
    unconscious: stunDamage >= stunMax,
    incapacitated: physicalDamage >= physicalMax,
    dead: overflowDamage >= overflowMax,
  };
}

// =============================================================================
// ARMOR CALCULATIONS
// =============================================================================

/**
 * Get total armor value from character
 */
export function getArmorValue(character: Character): number {
  let totalArmor = 0;

  // Check equipped armor items
  if (character.armor) {
    for (const armorItem of character.armor) {
      if (armorItem.equipped) {
        totalArmor += armorItem.armorRating ?? 0;
      }
    }
  }

  // Add any armor from cyberware or qualities
  // This would need to be extended based on character data structure
  // For now, just return equipped armor total

  return totalArmor;
}

/**
 * Calculate modified armor after armor penetration
 */
export function calculateModifiedArmor(
  baseArmor: number,
  armorPenetration: number
): number {
  // AP is negative (e.g., -4), so we add it
  // Modified armor cannot go below 0
  return Math.max(0, baseArmor + armorPenetration);
}

/**
 * Check if armor converts physical to stun
 * If modified armor > modified damage, physical becomes stun
 */
export function shouldConvertToStun(
  modifiedArmor: number,
  damage: number,
  damageType: DamageType
): boolean {
  // Only physical damage can be converted
  if (damageType !== "physical") {
    return false;
  }

  // If armor exceeds damage, convert to stun
  return modifiedArmor > damage;
}

// =============================================================================
// RESISTANCE CALCULATION
// =============================================================================

/**
 * Calculate resistance pool for damage
 */
export function calculateResistancePool(
  character: Character,
  damageApplication: DamageApplication,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ResistanceResult {
  const modifiers: PoolModifier[] = [];
  const baseArmor = getArmorValue(character);
  const modifiedArmor = calculateModifiedArmor(
    baseArmor,
    damageApplication.armorPenetration
  );

  // Add armor to pool
  modifiers.push({
    source: "equipment",
    value: modifiedArmor,
    description: `Armor (${baseArmor}${damageApplication.armorPenetration < 0 ? ` ${damageApplication.armorPenetration} AP` : ""})`,
  });

  // Build resistance pool (Body + modified Armor)
  // Resistance tests do NOT include wound modifiers
  const pool = buildActionPool(
    character,
    {
      attribute: "body",
      situationalModifiers: modifiers,
      includeWoundModifiers: false,
    },
    rules
  );

  // Check for physical to stun conversion
  const damageConvertedToStun = shouldConvertToStun(
    modifiedArmor,
    damageApplication.damageValue,
    damageApplication.damageType
  );

  return {
    pool,
    modifiedArmor,
    damageConvertedToStun,
  };
}

/**
 * Build a simple resistance pool (for stun damage with no armor)
 */
export function buildStunResistancePool(
  character: Character,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  // Stun damage resistance: Willpower + Armor
  const modifiers: PoolModifier[] = [];
  const armor = getArmorValue(character);

  if (armor > 0) {
    modifiers.push({
      source: "equipment",
      value: armor,
      description: "Armor",
    });
  }

  return buildActionPool(
    character,
    {
      attribute: "willpower",
      situationalModifiers: modifiers,
      includeWoundModifiers: false,
    },
    rules
  );
}

// =============================================================================
// DAMAGE APPLICATION
// =============================================================================

/**
 * Apply damage to condition monitor
 */
export function applyDamageToMonitor(
  state: ConditionMonitorState,
  damage: number,
  damageType: DamageType
): ConditionMonitorState {
  const newState = { ...state };
  let remainingDamage = damage;
  let damageConverted = false;

  if (damageType === "physical") {
    // Apply to physical track
    const physicalRoom = newState.physicalMax - newState.physicalDamage;

    if (remainingDamage <= physicalRoom) {
      // All damage fits in physical track
      newState.physicalDamage += remainingDamage;
    } else {
      // Fill physical track, overflow goes to overflow
      newState.physicalDamage = newState.physicalMax;
      remainingDamage -= physicalRoom;

      // Apply to overflow
      newState.overflowDamage = Math.min(
        newState.overflowMax,
        newState.overflowDamage + remainingDamage
      );
    }
  } else {
    // Stun damage
    const stunRoom = newState.stunMax - newState.stunDamage;

    if (remainingDamage <= stunRoom) {
      // All damage fits in stun track
      newState.stunDamage += remainingDamage;
    } else {
      // Fill stun track, overflow converts to physical
      newState.stunDamage = newState.stunMax;
      remainingDamage -= stunRoom;
      damageConverted = true;

      // Convert excess stun to physical (2 stun = 1 physical)
      const convertedPhysical = Math.ceil(remainingDamage / 2);
      const physicalRoom = newState.physicalMax - newState.physicalDamage;

      if (convertedPhysical <= physicalRoom) {
        newState.physicalDamage += convertedPhysical;
      } else {
        newState.physicalDamage = newState.physicalMax;
        const overflowPhysical = convertedPhysical - physicalRoom;
        newState.overflowDamage = Math.min(
          newState.overflowMax,
          newState.overflowDamage + overflowPhysical
        );
      }
    }
  }

  // Update status flags
  newState.unconscious = newState.stunDamage >= newState.stunMax;
  newState.incapacitated = newState.physicalDamage >= newState.physicalMax;
  newState.dead = newState.overflowDamage >= newState.overflowMax;

  return newState;
}

/**
 * Calculate wound modifier from condition monitor state
 */
export function calculateWoundModifierFromState(
  state: ConditionMonitorState,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): number {
  return calculateWoundModifier(
    state.physicalDamage,
    state.stunDamage,
    rules
  );
}

/**
 * Process complete damage application
 */
export function processDamageApplication(
  character: Character,
  damageApplication: DamageApplication,
  resistanceHits: number,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): DamageResult {
  const triggeredEffects: string[] = [];

  // Calculate resistance
  const resistanceResult = calculateResistancePool(
    character,
    damageApplication,
    rules
  );

  // Get current state
  const currentState = getConditionMonitorState(character);
  const previousWoundModifier = calculateWoundModifierFromState(
    currentState,
    rules
  );

  // Calculate damage after armor (this is already factored into resistance)
  const damageAfterArmor = damageApplication.damageValue;

  // Calculate final damage (damage - resistance hits)
  const damageDealt = Math.max(0, damageAfterArmor - resistanceHits);

  // Determine actual damage type (may be converted from physical to stun)
  let actualDamageType = damageApplication.damageType;
  let damageConverted = false;

  if (resistanceResult.damageConvertedToStun) {
    actualDamageType = "stun";
    damageConverted = true;
    triggeredEffects.push("Armor converted physical damage to stun");
  }

  // Apply damage to condition monitor
  const newState = applyDamageToMonitor(
    currentState,
    damageDealt,
    actualDamageType
  );

  // Calculate new wound modifier
  const newWoundModifier = calculateWoundModifierFromState(newState, rules);
  const woundModifierChange = newWoundModifier - previousWoundModifier;

  // Check for status changes
  if (!currentState.unconscious && newState.unconscious) {
    triggeredEffects.push("Target is now unconscious");
  }
  if (!currentState.incapacitated && newState.incapacitated) {
    triggeredEffects.push("Target is now incapacitated");
  }
  if (!currentState.dead && newState.dead) {
    triggeredEffects.push("Target is now dead");
  }

  // Check for knockdown (10+ boxes of damage in one hit)
  const knockdown = damageDealt >= KNOCKDOWN_THRESHOLD;
  if (knockdown) {
    triggeredEffects.push("Knockdown: Target must make Body + Willpower test");
  }

  // Calculate overflow
  const overflow =
    newState.overflowDamage > currentState.overflowDamage
      ? newState.overflowDamage - currentState.overflowDamage
      : 0;

  return {
    damageAfterArmor,
    armorUsed: getArmorValue(character),
    modifiedArmor: resistanceResult.modifiedArmor,
    resistancePool: resistanceResult.pool,
    damageDealt,
    woundModifierChange,
    previousWoundModifier,
    newWoundModifier,
    conditionMonitorState: newState,
    knockdown,
    overflow,
    damageConverted,
    triggeredEffects,
  };
}

// =============================================================================
// HEALING
// =============================================================================

/**
 * Apply healing to condition monitor
 */
export function applyHealing(
  state: ConditionMonitorState,
  healing: number,
  damageType: DamageType
): ConditionMonitorState {
  const newState = { ...state };

  if (damageType === "physical") {
    newState.physicalDamage = Math.max(0, newState.physicalDamage - healing);
  } else {
    newState.stunDamage = Math.max(0, newState.stunDamage - healing);
  }

  // Update status flags
  newState.unconscious = newState.stunDamage >= newState.stunMax;
  newState.incapacitated = newState.physicalDamage >= newState.physicalMax;

  return newState;
}

/**
 * Calculate natural healing rate
 * Physical: 1 box per day with rest (Body + Willpower test for bonus)
 * Stun: 1 box per hour with rest (Body + Willpower test for bonus)
 */
export function calculateNaturalHealingPool(
  character: Character,
  damageType: DamageType,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  return buildActionPool(
    character,
    {
      attribute: "body",
      skill: undefined,
      manualPool:
        getAttributeValue(character, "body") +
        getAttributeValue(character, "willpower"),
      includeWoundModifiers: true,
    },
    rules
  );
}

// =============================================================================
// SPECIAL DAMAGE EFFECTS
// =============================================================================

/**
 * Check for elemental damage effects
 */
export function processElementalDamage(
  damageApplication: DamageApplication,
  damageDealt: number
): string[] {
  const effects: string[] = [];

  if (!damageApplication.elementType) {
    return effects;
  }

  switch (damageApplication.elementType) {
    case "fire":
      effects.push("Fire damage: Target may catch fire (opposed test)");
      break;
    case "electricity":
      effects.push(
        "Electrical damage: -1 to actions for (damage) rounds if damage exceeds armor"
      );
      break;
    case "acid":
      effects.push("Acid damage: Reduces armor by 1 per hit");
      break;
    case "cold":
      effects.push("Cold damage: Movement reduced by 25% per box");
      break;
    case "toxin":
      effects.push("Toxin damage: Separate toxin resistance test required");
      break;
    case "radiation":
      effects.push("Radiation damage: Long-term effects may apply");
      break;
  }

  return effects;
}

// =============================================================================
// CHARACTER STATE UPDATES
// =============================================================================

/**
 * Create updates for character condition after damage
 */
export function createConditionUpdates(
  damageResult: DamageResult
): {
  physicalDamage: number;
  stunDamage: number;
  overflowDamage: number;
} {
  return {
    physicalDamage: damageResult.conditionMonitorState.physicalDamage,
    stunDamage: damageResult.conditionMonitorState.stunDamage,
    overflowDamage: damageResult.conditionMonitorState.overflowDamage,
  };
}

/**
 * Check if character can act (not unconscious, incapacitated, or dead)
 */
export function canAct(state: ConditionMonitorState): boolean {
  return !state.unconscious && !state.incapacitated && !state.dead;
}

/**
 * Get status description from condition monitor state
 */
export function getStatusDescription(state: ConditionMonitorState): string {
  if (state.dead) return "Dead";
  if (state.incapacitated) return "Incapacitated";
  if (state.unconscious) return "Unconscious";

  const woundMod = calculateWoundModifierFromState(state);
  if (woundMod < 0) {
    return `Wounded (${woundMod} to all tests)`;
  }

  return "Healthy";
}
