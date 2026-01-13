/**
 * Encumbrance Calculator
 *
 * Calculates character carrying capacity and encumbrance penalties
 * based on carried equipment weight and Strength attribute.
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import type { Character, Weapon, ArmorItem, GearItem } from "@/lib/types";
import type { EncumbranceState, EquipmentReadiness } from "@/lib/types/gear-state";
import { getAttributeValue } from "@/lib/rules/action-resolution/pool-builder";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Base capacity multiplier: Strength × this value = max capacity in kg */
export const STRENGTH_CAPACITY_MULTIPLIER = 10;

/** Penalty per kg over capacity (dice pool modifier) */
export const OVERWEIGHT_PENALTY_PER_KG = -1;

/** Maximum encumbrance penalty (prevents extreme penalties) */
export const MAX_ENCUMBRANCE_PENALTY = -10;

// =============================================================================
// WEIGHT CALCULATION
// =============================================================================

/**
 * Check if an item is currently being carried (not stored).
 * Stored items don't count toward encumbrance.
 */
export function isItemCarried(item: { state?: { readiness: EquipmentReadiness } }): boolean {
  if (!item.state) {
    // Legacy items without state default to carried
    return true;
  }
  return item.state.readiness !== "stored";
}

/**
 * Get the weight of a gear item.
 * Falls back to 0 if no weight specified.
 */
export function getItemWeight(item: { weight?: number }): number {
  return item.weight ?? 0;
}

/**
 * Calculate total weight from weapons.
 * Only includes carried weapons (not stored).
 */
export function calculateWeaponWeight(weapons: Weapon[]): number {
  return weapons.filter(isItemCarried).reduce((total, weapon) => total + getItemWeight(weapon), 0);
}

/**
 * Calculate total weight from armor.
 * Only includes carried armor (not stored).
 */
export function calculateArmorWeight(armor: ArmorItem[]): number {
  return armor.filter(isItemCarried).reduce((total, item) => total + getItemWeight(item), 0);
}

/**
 * Calculate total weight from general gear.
 * Only includes carried gear (not stored).
 */
export function calculateGearWeight(gear: GearItem[]): number {
  return gear
    .filter((item) => {
      // GearItem may not have state, check if it exists
      const gearWithState = item as { state?: { readiness: EquipmentReadiness } };
      return isItemCarried(gearWithState);
    })
    .reduce((total, item) => total + getItemWeight(item), 0);
}

/**
 * Calculate total weight of all ammunition.
 * Ammo weight is typically negligible but included for completeness.
 * Assumes 0.01 kg per round as default.
 */
export function calculateAmmunitionWeight(
  ammunition: { quantity: number; weight?: number }[] = []
): number {
  const WEIGHT_PER_ROUND = 0.01; // 10g per round default
  return ammunition.reduce((total, ammo) => {
    const weightPerRound = ammo.weight ?? WEIGHT_PER_ROUND;
    return total + ammo.quantity * weightPerRound;
  }, 0);
}

// =============================================================================
// CAPACITY CALCULATION
// =============================================================================

/**
 * Calculate maximum carrying capacity for a character.
 * Formula: Strength × 10 kg
 */
export function calculateMaxCapacity(character: Character): number {
  const strength = getAttributeValue(character, "strength");
  return strength * STRENGTH_CAPACITY_MULTIPLIER;
}

// =============================================================================
// ENCUMBRANCE PENALTY
// =============================================================================

/**
 * Calculate the dice pool penalty for being over capacity.
 * -1 per kg over capacity, capped at MAX_ENCUMBRANCE_PENALTY.
 */
export function calculateEncumbrancePenalty(currentWeight: number, maxCapacity: number): number {
  if (currentWeight <= maxCapacity) {
    return 0;
  }

  const overWeight = currentWeight - maxCapacity;
  const penalty = Math.floor(overWeight) * OVERWEIGHT_PENALTY_PER_KG;

  // Cap the penalty to prevent extreme values
  return Math.max(penalty, MAX_ENCUMBRANCE_PENALTY);
}

// =============================================================================
// MAIN CALCULATOR
// =============================================================================

/**
 * Calculate complete encumbrance state for a character.
 * Includes total weight, capacity, and any penalties.
 */
export function calculateEncumbrance(character: Character): EncumbranceState {
  // Calculate weights from all gear types
  const weaponWeight = calculateWeaponWeight(character.weapons || []);
  const armorWeight = calculateArmorWeight(character.armor || []);
  const gearWeight = calculateGearWeight(character.gear || []);
  const ammoWeight = calculateAmmunitionWeight(character.ammunition || []);

  const currentWeight = weaponWeight + armorWeight + gearWeight + ammoWeight;
  const maxCapacity = calculateMaxCapacity(character);
  const overweightPenalty = calculateEncumbrancePenalty(currentWeight, maxCapacity);
  const isEncumbered = currentWeight > maxCapacity;

  return {
    currentWeight: Math.round(currentWeight * 100) / 100, // Round to 2 decimal places
    maxCapacity,
    overweightPenalty,
    isEncumbered,
  };
}

/**
 * Get encumbrance status description for UI display.
 */
export function getEncumbranceStatus(encumbrance: EncumbranceState): {
  status: "light" | "normal" | "heavy" | "overloaded";
  description: string;
  color: string;
} {
  const ratio = encumbrance.currentWeight / encumbrance.maxCapacity;

  if (ratio <= 0.5) {
    return {
      status: "light",
      description: "Light load",
      color: "green",
    };
  } else if (ratio <= 0.75) {
    return {
      status: "normal",
      description: "Normal load",
      color: "blue",
    };
  } else if (ratio <= 1.0) {
    return {
      status: "heavy",
      description: "Heavy load",
      color: "yellow",
    };
  } else {
    return {
      status: "overloaded",
      description: `Overloaded (${encumbrance.overweightPenalty} penalty)`,
      color: "red",
    };
  }
}

/**
 * Check if a physical action should have encumbrance penalty applied.
 * Encumbrance affects all physical actions.
 */
export function shouldApplyEncumbrancePenalty(actionCategory: string): boolean {
  const physicalCategories = ["combat", "physical", "athletics", "stealth", "vehicle"];
  return physicalCategories.includes(actionCategory.toLowerCase());
}
