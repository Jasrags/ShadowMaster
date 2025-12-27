/**
 * Weapon Handler for Combat Actions
 *
 * Handles weapon-based attack calculations including:
 * - Attack pool calculation with weapon modifiers
 * - Defense pool calculation for targets
 * - Recoil tracking and progressive penalties
 * - Ammunition management
 * - Firing mode bonuses and penalties
 * - Range modifiers
 */

import type {
  Character,
  Weapon,
  ActionPool,
  PoolModifier,
  EditionDiceRules,
} from "@/lib/types";
import {
  buildActionPool,
  buildDefensePool,
  getAttributeValue,
  getSkillRating,
  addModifiersToPool,
} from "../pool-builder";
import { DEFAULT_DICE_RULES } from "../dice-engine";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Firing modes supported by weapons
 */
export type FiringMode = "SS" | "SA" | "BF" | "FA";

/**
 * Attack type classification
 */
export type AttackType = "ranged" | "melee" | "thrown";

/**
 * Range categories for ranged combat
 */
export type RangeCategory = "short" | "medium" | "long" | "extreme";

/**
 * Called shot types
 */
export type CalledShotType =
  | "vitals"
  | "head"
  | "limb"
  | "weapon"
  | "specific"
  | "knockdown"
  | "disarm"
  | "trick_shot";

/**
 * Request for a weapon attack
 */
export interface WeaponAttackRequest {
  /** ID of the weapon being used */
  weaponId: string;
  /** Firing mode for ranged weapons */
  firingMode?: FiringMode;
  /** Target character ID */
  targetId: string;
  /** Distance to target in meters */
  range?: number;
  /** Called shot type if any */
  calledShot?: CalledShotType;
  /** Accumulated aim bonus from Take Aim actions */
  aimBonus?: number;
  /** Number of shots fired previously this turn (for recoil) */
  previousShots?: number;
  /** Whether defender is using Full Defense */
  defenderFullDefense?: boolean;
  /** Whether defender is in cover */
  defenderInCover?: boolean;
  /** Cover quality (2-4 dice bonus) */
  coverQuality?: number;
  /** Environmental modifiers */
  environmentModifiers?: PoolModifier[];
}

/**
 * Result of a weapon attack calculation
 */
export interface WeaponAttackResult {
  /** Attack pool for the attacker */
  attackPool: ActionPool;
  /** Defense pool for the defender */
  defensePool: ActionPool;
  /** Net hits (after opposed test) */
  netHits?: number;
  /** Parsed damage value from weapon */
  baseDamage: number;
  /** Damage type (physical or stun) */
  damageType: "physical" | "stun";
  /** Armor penetration value */
  armorPenetration: number;
  /** Modified damage (base + net hits) */
  modifiedDamage?: number;
  /** Amount of ammunition consumed */
  ammoExpended: number;
  /** Recoil penalty applied to this attack */
  recoilPenalty: number;
  /** Progressive recoil for next attack */
  progressiveRecoil: number;
}

/**
 * Recoil state for tracking across multiple shots
 */
export interface RecoilState {
  /** Shots fired this turn */
  shotsFired: number;
  /** Current recoil compensation used */
  recoilCompensationUsed: number;
  /** Base recoil compensation from weapon + mods + strength */
  baseRecoilCompensation: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Ammunition consumption by firing mode
 */
export const AMMO_CONSUMPTION: Record<FiringMode, number> = {
  SS: 1,
  SA: 2,
  BF: 3,
  FA: 10,
};

/**
 * Attack bonus by firing mode
 */
export const FIRING_MODE_ATTACK_BONUS: Record<FiringMode, number> = {
  SS: 0,
  SA: 0,
  BF: 2,
  FA: 5, // Narrow burst; wide burst is 9
};

/**
 * Defense penalty by firing mode (applied to defender)
 */
export const FIRING_MODE_DEFENSE_PENALTY: Record<FiringMode, number> = {
  SS: 0,
  SA: 0,
  BF: -2,
  FA: -5, // Narrow burst; wide burst is -9
};

/**
 * Recoil by firing mode (additional recoil beyond progressive)
 */
export const FIRING_MODE_RECOIL: Record<FiringMode, number> = {
  SS: 0,
  SA: 1, // -1 for second shot in SA mode
  BF: 2,
  FA: 5,
};

/**
 * Range modifier thresholds (meters) and corresponding modifiers
 * These are approximate defaults; actual values depend on weapon type
 */
export const DEFAULT_RANGE_MODIFIERS: Record<RangeCategory, number> = {
  short: 0,
  medium: -1,
  long: -3,
  extreme: -6,
};

/**
 * Called shot penalties
 */
export const CALLED_SHOT_PENALTIES: Record<CalledShotType, number> = {
  vitals: -4,
  head: -4,
  limb: -2,
  weapon: -4,
  specific: -4,
  knockdown: -4,
  disarm: -4,
  trick_shot: -6,
};

// =============================================================================
// WEAPON SKILL MAPPING
// =============================================================================

/**
 * Map weapon subcategory to appropriate skill
 */
export function getWeaponSkill(weapon: Weapon): string {
  const subcategory = weapon.subcategory?.toLowerCase() ?? "";

  // Ranged weapons - order matters! More specific checks first

  // Heavy weapons (check before generic "machine" or "gun" matches)
  if (
    subcategory.includes("machine gun") ||
    subcategory.includes("machine_gun") ||
    subcategory.includes("machinegun") ||
    subcategory.includes("lmg") ||
    subcategory.includes("hmg") ||
    subcategory.includes("assault cannon") ||
    subcategory.includes("grenade launcher") ||
    subcategory.includes("missile")
  ) {
    return "heavy_weapons";
  }

  // Longarms (check before generic "rifle" match)
  if (
    subcategory.includes("shotgun") ||
    subcategory.includes("sniper") ||
    subcategory.includes("sport rifle") ||
    subcategory.includes("sport_rifle") ||
    subcategory.includes("hunting rifle") ||
    subcategory.includes("hunting_rifle")
  ) {
    return "longarms";
  }

  // Pistols
  if (
    subcategory.includes("pistol") ||
    subcategory.includes("holdout") ||
    subcategory.includes("taser")
  ) {
    return "pistols";
  }

  // SMGs and automatics
  if (
    subcategory.includes("smg") ||
    subcategory.includes("submachine") ||
    subcategory.includes("machine pistol") ||
    subcategory.includes("assault rifle") ||
    subcategory.includes("assault_rifle") ||
    subcategory.includes("rifle") ||
    subcategory.includes("carbine")
  ) {
    return "automatics";
  }
  if (subcategory.includes("bow") || subcategory.includes("crossbow")) {
    return "archery";
  }
  if (subcategory.includes("throwing") || subcategory.includes("shuriken")) {
    return "throwing_weapons";
  }

  // Melee weapons
  if (
    subcategory.includes("blade") ||
    subcategory.includes("sword") ||
    subcategory.includes("knife") ||
    subcategory.includes("katana")
  ) {
    return "blades";
  }
  if (
    subcategory.includes("club") ||
    subcategory.includes("mace") ||
    subcategory.includes("staff") ||
    subcategory.includes("baton")
  ) {
    return "clubs";
  }

  // Default to unarmed if no weapon-specific skill
  return "unarmed_combat";
}

/**
 * Determine attack type from weapon
 */
export function getAttackType(weapon: Weapon): AttackType {
  const subcategory = weapon.subcategory?.toLowerCase() ?? "";

  if (subcategory.includes("throwing") || subcategory.includes("grenade")) {
    return "thrown";
  }

  // Check for melee-style weapons
  if (
    subcategory.includes("blade") ||
    subcategory.includes("club") ||
    subcategory.includes("sword") ||
    subcategory.includes("knife") ||
    subcategory.includes("katana") ||
    subcategory.includes("staff") ||
    subcategory.includes("baton") ||
    subcategory.includes("mace") ||
    weapon.reach !== undefined
  ) {
    return "melee";
  }

  // Default to ranged for firearms
  return "ranged";
}

// =============================================================================
// DAMAGE PARSING
// =============================================================================

/**
 * Parse damage string (e.g., "8P", "6S", "12P(f)")
 */
export function parseDamage(damageString: string): {
  value: number;
  type: "physical" | "stun";
  special?: string;
} {
  const match = damageString.match(/(\d+)([PS])(?:\(([^)]+)\))?/i);

  if (!match) {
    return { value: 0, type: "stun" };
  }

  return {
    value: parseInt(match[1], 10),
    type: match[2].toUpperCase() === "P" ? "physical" : "stun",
    special: match[3],
  };
}

// =============================================================================
// RECOIL CALCULATION
// =============================================================================

/**
 * Calculate base recoil compensation from character and weapon
 */
export function calculateRecoilCompensation(
  character: Character,
  weapon: Weapon
): number {
  // Base: 1 (everyone gets 1 free)
  let compensation = 1;

  // Add Strength / 3 (rounded down)
  const strength = getAttributeValue(character, "strength");
  compensation += Math.floor(strength / 3);

  // Add weapon recoil compensation (from recoil stat, positive = good)
  if (weapon.recoil && weapon.recoil > 0) {
    compensation += weapon.recoil;
  }

  // Note: Modifications that provide recoil compensation would need
  // to be looked up in the catalog. For now, we rely on the weapon's
  // base recoil stat which should include any modification bonuses
  // when the weapon is assembled.

  return compensation;
}

/**
 * Calculate recoil penalty for an attack
 */
export function calculateRecoilPenalty(
  weapon: Weapon,
  firingMode: FiringMode,
  previousShots: number,
  recoilCompensation: number
): { penalty: number; progressiveRecoil: number } {
  // Progressive recoil = total shots fired this turn
  const shotsThisMode = AMMO_CONSUMPTION[firingMode];
  const totalShots = previousShots + shotsThisMode;

  // Recoil penalty = total shots - recoil compensation
  // But only penalize if over compensation
  const rawPenalty = totalShots - recoilCompensation;
  const penalty = rawPenalty > 0 ? -rawPenalty : 0;

  return {
    penalty,
    progressiveRecoil: totalShots,
  };
}

// =============================================================================
// RANGE CALCULATION
// =============================================================================

/**
 * Determine range category based on weapon and distance
 */
export function getRangeCategory(
  _weapon: Weapon,
  distance: number
): RangeCategory {
  // Default ranges (should ideally come from weapon data)
  // Short: 0-50m, Medium: 51-100m, Long: 101-250m, Extreme: 251+m
  if (distance <= 50) return "short";
  if (distance <= 100) return "medium";
  if (distance <= 250) return "long";
  return "extreme";
}

/**
 * Get range modifier for a given distance
 */
export function getRangeModifier(weapon: Weapon, distance: number): number {
  const category = getRangeCategory(weapon, distance);
  return DEFAULT_RANGE_MODIFIERS[category];
}

// =============================================================================
// POOL CALCULATION
// =============================================================================

/**
 * Calculate the attack pool for a weapon attack
 */
export function calculateAttackPool(
  character: Character,
  weapon: Weapon,
  request: WeaponAttackRequest,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  const skill = getWeaponSkill(weapon);
  const modifiers: PoolModifier[] = [];

  // Get weapon accuracy as limit
  const accuracy = weapon.accuracy ?? 6;

  // Calculate recoil penalty for ranged weapons
  let recoilPenalty = 0;
  if (request.firingMode) {
    const recoilComp = calculateRecoilCompensation(character, weapon);
    const recoilResult = calculateRecoilPenalty(
      weapon,
      request.firingMode,
      request.previousShots ?? 0,
      recoilComp
    );
    recoilPenalty = recoilResult.penalty;

    if (recoilPenalty < 0) {
      modifiers.push({
        source: "situational",
        value: recoilPenalty,
        description: `Recoil penalty`,
      });
    }

    // Add firing mode attack bonus
    const firingModeBonus = FIRING_MODE_ATTACK_BONUS[request.firingMode];
    if (firingModeBonus > 0) {
      modifiers.push({
        source: "situational",
        value: firingModeBonus,
        description: `${request.firingMode} mode bonus`,
      });
    }
  }

  // Add aim bonus
  if (request.aimBonus && request.aimBonus > 0) {
    modifiers.push({
      source: "situational",
      value: Math.min(request.aimBonus, 3), // Max +3 from aiming (without scope)
      description: "Take Aim bonus",
    });
  }

  // Add called shot penalty
  if (request.calledShot) {
    modifiers.push({
      source: "situational",
      value: CALLED_SHOT_PENALTIES[request.calledShot],
      description: `Called shot: ${request.calledShot}`,
    });
  }

  // Add range modifier for ranged attacks
  if (request.range !== undefined && getAttackType(weapon) === "ranged") {
    const rangeMod = getRangeModifier(weapon, request.range);
    if (rangeMod !== 0) {
      modifiers.push({
        source: "situational",
        value: rangeMod,
        description: `Range: ${getRangeCategory(weapon, request.range)}`,
      });
    }
  }

  // Add environment modifiers
  if (request.environmentModifiers) {
    modifiers.push(...request.environmentModifiers);
  }

  // Build the base pool with attribute + skill
  return buildActionPool(
    character,
    {
      attribute: "agility",
      skill,
      limit: accuracy,
      limitSource: "Weapon Accuracy",
      situationalModifiers: modifiers,
    },
    rules
  );
}

/**
 * Calculate the defense pool for a target
 */
export function calculateDefensePool(
  defender: Character,
  attackType: AttackType,
  request: WeaponAttackRequest,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): ActionPool {
  const modifiers: PoolModifier[] = [];

  // Add firing mode defense penalty
  if (request.firingMode) {
    const defensePenalty = FIRING_MODE_DEFENSE_PENALTY[request.firingMode];
    if (defensePenalty < 0) {
      modifiers.push({
        source: "situational",
        value: defensePenalty,
        description: `${request.firingMode} mode defense penalty`,
      });
    }
  }

  // Add full defense bonus (Willpower)
  if (request.defenderFullDefense) {
    const willpower = getAttributeValue(defender, "willpower");
    modifiers.push({
      source: "situational",
      value: willpower,
      description: "Full Defense (Willpower)",
    });
  }

  // Add cover bonus
  if (request.defenderInCover && request.coverQuality) {
    modifiers.push({
      source: "situational",
      value: request.coverQuality,
      description: `Cover bonus`,
    });
  }

  // Build defense pool (Reaction + Intuition + modifiers)
  return buildDefensePool(defender, modifiers, rules);
}

/**
 * Process a complete weapon attack
 */
export function processWeaponAttack(
  attacker: Character,
  defender: Character,
  weapon: Weapon,
  request: WeaponAttackRequest,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): WeaponAttackResult {
  const attackType = getAttackType(weapon);

  // Calculate attack pool
  const attackPool = calculateAttackPool(attacker, weapon, request, rules);

  // Calculate defense pool
  const defensePool = calculateDefensePool(
    defender,
    attackType,
    request,
    rules
  );

  // Parse damage
  const damage = parseDamage(weapon.damage);

  // Calculate ammo expended
  const ammoExpended =
    request.firingMode ? AMMO_CONSUMPTION[request.firingMode] : 0;

  // Calculate recoil for this attack
  const recoilComp = calculateRecoilCompensation(attacker, weapon);
  const recoilResult = calculateRecoilPenalty(
    weapon,
    request.firingMode ?? "SS",
    request.previousShots ?? 0,
    recoilComp
  );

  return {
    attackPool,
    defensePool,
    baseDamage: damage.value,
    damageType: damage.type,
    armorPenetration: weapon.ap ?? 0,
    ammoExpended,
    recoilPenalty: recoilResult.penalty,
    progressiveRecoil: recoilResult.progressiveRecoil,
  };
}

/**
 * Finalize attack result with actual dice results
 */
export function finalizeWeaponAttack(
  attackResult: WeaponAttackResult,
  attackerHits: number,
  defenderHits: number,
  attackerStrength?: number
): WeaponAttackResult {
  const netHits = Math.max(0, attackerHits - defenderHits);

  // Calculate modified damage (base damage + net hits)
  // For melee, also add strength
  let modifiedDamage = attackResult.baseDamage + netHits;
  if (attackerStrength !== undefined) {
    modifiedDamage += attackerStrength;
  }

  return {
    ...attackResult,
    netHits,
    modifiedDamage,
  };
}

// =============================================================================
// AMMUNITION MANAGEMENT
// =============================================================================

/**
 * Check if weapon has enough ammunition for firing mode
 */
export function hasEnoughAmmo(weapon: Weapon, firingMode: FiringMode): boolean {
  const required = AMMO_CONSUMPTION[firingMode];
  const available = weapon.currentAmmo ?? 0;
  return available >= required;
}

/**
 * Consume ammunition from weapon
 */
export function consumeAmmo(
  weapon: Weapon,
  firingMode: FiringMode
): { success: boolean; ammoRemaining: number; ammoConsumed: number } {
  const required = AMMO_CONSUMPTION[firingMode];
  const available = weapon.currentAmmo ?? 0;

  if (available < required) {
    return {
      success: false,
      ammoRemaining: available,
      ammoConsumed: 0,
    };
  }

  return {
    success: true,
    ammoRemaining: available - required,
    ammoConsumed: required,
  };
}

/**
 * Reload weapon to full capacity
 */
export function reloadWeapon(weapon: Weapon): {
  ammoLoaded: number;
  clipRequired: boolean;
} {
  const capacity = weapon.ammoCapacity ?? 0;
  return {
    ammoLoaded: capacity,
    clipRequired: true,
  };
}

// =============================================================================
// REACH & MELEE
// =============================================================================

/**
 * Calculate reach differential modifier for melee
 */
export function calculateReachDifferential(
  attackerWeapon: Weapon,
  defenderWeapon?: Weapon
): number {
  const attackerReach = attackerWeapon.reach ?? 0;
  const defenderReach = defenderWeapon?.reach ?? 0;

  // Positive = attacker has advantage
  return attackerReach - defenderReach;
}

/**
 * Get melee damage with strength modifier
 */
export function getMeleeDamage(
  character: Character,
  weapon: Weapon
): { value: number; type: "physical" | "stun" } {
  const damage = parseDamage(weapon.damage);
  const strength = getAttributeValue(character, "strength");

  // Melee damage = weapon damage + strength
  return {
    value: damage.value + strength,
    type: damage.type,
  };
}
