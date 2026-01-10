/**
 * Wireless Bonus Calculator
 *
 * Calculates active wireless bonuses from all character equipment
 * that has wireless enabled. Uses structured wirelessEffects data
 * for mechanical calculation.
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import type { Character, CyberwareItem } from "@/lib/types";
import type {
  WirelessEffect,
  ActiveWirelessBonuses,
  AttributeKey,
  LimitKey,
  EffectConditionType,
} from "@/lib/types/wireless-effects";
import {
  EMPTY_WIRELESS_BONUSES,
  applyWirelessEffect,
  effectAppliesInContext,
} from "@/lib/types/wireless-effects";

// =============================================================================
// WIRELESS STATE CHECKS
// =============================================================================

/**
 * Check if the global wireless toggle is enabled for the character.
 * If global is disabled, no item wireless bonuses apply.
 */
export function isGlobalWirelessEnabled(character: Character): boolean {
  // Default to true if not explicitly set
  return character.wirelessBonusesEnabled !== false;
}

/**
 * Check if an individual item has wireless enabled.
 * Respects both the item's toggle and the global toggle.
 */
export function isItemWirelessActive(
  item: { wirelessEnabled?: boolean },
  character: Character
): boolean {
  // Global must be enabled
  if (!isGlobalWirelessEnabled(character)) {
    return false;
  }

  // Item defaults to enabled if not explicitly set
  return item.wirelessEnabled !== false;
}

/**
 * Check if a cyberware item should contribute wireless bonuses.
 * Considers both wireless state and device condition (if applicable).
 */
export function isCyberwareWirelessActive(cyberware: CyberwareItem, character: Character): boolean {
  // Check basic wireless state
  if (!isItemWirelessActive(cyberware, character)) {
    return false;
  }

  // Cyberware without effects contributes nothing
  if (!cyberware.wirelessEffects || cyberware.wirelessEffects.length === 0) {
    return false;
  }

  return true;
}

// =============================================================================
// EFFECT COLLECTION
// =============================================================================

/**
 * Collect all wireless effects from cyberware.
 */
export function collectCyberwareEffects(character: Character): WirelessEffect[] {
  const cyberware = character.cyberware || [];
  const effects: WirelessEffect[] = [];

  for (const item of cyberware) {
    if (isCyberwareWirelessActive(item, character)) {
      effects.push(...(item.wirelessEffects || []));
    }

    // Also check enhancements (for modular cyberware like cyberlimbs)
    if (item.enhancements) {
      for (const enhancement of item.enhancements) {
        if (isCyberwareWirelessActive(enhancement, character)) {
          effects.push(...(enhancement.wirelessEffects || []));
        }
      }
    }
  }

  return effects;
}

/**
 * Collect wireless effects from bioware.
 * Note: Bioware items need wirelessEnabled and wirelessEffects fields.
 */
export function collectBiowareEffects(character: Character): WirelessEffect[] {
  const bioware = character.bioware || [];
  const effects: WirelessEffect[] = [];

  for (const item of bioware) {
    // BiowareItem may have wireless fields added
    const itemWithWireless = item as {
      wirelessEnabled?: boolean;
      wirelessEffects?: WirelessEffect[];
    };

    if (isItemWirelessActive(itemWithWireless, character) && itemWithWireless.wirelessEffects) {
      effects.push(...itemWithWireless.wirelessEffects);
    }
  }

  return effects;
}

/**
 * Collect wireless effects from weapon modifications (e.g., smartgun).
 * Only applies to readied or holstered weapons with wireless enabled.
 */
export function collectWeaponModEffects(character: Character): WirelessEffect[] {
  const weapons = character.weapons || [];
  const effects: WirelessEffect[] = [];

  for (const weapon of weapons) {
    // Weapon must be available (not stored) and have wireless
    if (weapon.state?.readiness === "stored" || weapon.state?.wirelessEnabled === false) {
      continue;
    }

    // Check for smartgun system in modifications
    if (weapon.modifications) {
      for (const mod of weapon.modifications) {
        // Support both catalogId (correct) and legacy modificationId field
        const modId = mod.catalogId || (mod as { modificationId?: string }).modificationId;
        // Smartgun system provides +2 attack pool when wireless
        if (modId === "smartgun-internal" || modId === "smartgun-external") {
          effects.push({
            type: "attack_pool",
            modifier: 2,
            condition: "ranged_attack",
            isDicePool: true,
          });
        }
      }
    }
  }

  return effects;
}

// =============================================================================
// BONUS CALCULATION
// =============================================================================

/**
 * Calculate all active wireless bonuses for a character.
 * Aggregates effects from all wireless-enabled equipment.
 */
export function calculateWirelessBonuses(character: Character): ActiveWirelessBonuses {
  // Start with empty bonuses
  let bonuses: ActiveWirelessBonuses = { ...EMPTY_WIRELESS_BONUSES };
  bonuses.attributes = {};
  bonuses.limits = {};
  bonuses.skills = {};
  bonuses.specialEffects = [];

  // If global wireless is disabled, return empty
  if (!isGlobalWirelessEnabled(character)) {
    return bonuses;
  }

  // Collect all effects
  const cyberwareEffects = collectCyberwareEffects(character);
  const biowareEffects = collectBiowareEffects(character);
  const weaponEffects = collectWeaponModEffects(character);

  const allEffects = [...cyberwareEffects, ...biowareEffects, ...weaponEffects];

  // Apply each effect to bonuses
  for (const effect of allEffects) {
    bonuses = applyWirelessEffect(bonuses, effect);
  }

  return bonuses;
}

/**
 * Calculate wireless bonuses that apply in a specific context.
 * Use this for context-specific pool calculations.
 */
export function calculateContextualWirelessBonuses(
  character: Character,
  context: EffectConditionType
): ActiveWirelessBonuses {
  // Start fresh for contextual calculation
  let contextBonuses: ActiveWirelessBonuses = { ...EMPTY_WIRELESS_BONUSES };
  contextBonuses.attributes = {};
  contextBonuses.limits = {};
  contextBonuses.skills = {};
  contextBonuses.specialEffects = [];

  // Collect all effects again to filter by context
  const cyberwareEffects = collectCyberwareEffects(character);
  const biowareEffects = collectBiowareEffects(character);
  const weaponEffects = collectWeaponModEffects(character);

  const allEffects = [...cyberwareEffects, ...biowareEffects, ...weaponEffects];

  // Only apply effects that match the context
  for (const effect of allEffects) {
    if (effectAppliesInContext(effect, context)) {
      contextBonuses = applyWirelessEffect(contextBonuses, effect);
    }
  }

  return contextBonuses;
}

/**
 * Get the total initiative bonus from wireless effects.
 */
export function getWirelessInitiativeBonus(character: Character): number {
  const bonuses = calculateWirelessBonuses(character);
  return bonuses.initiative;
}

/**
 * Get the total initiative dice bonus from wireless effects.
 */
export function getWirelessInitiativeDiceBonus(character: Character): number {
  const bonuses = calculateWirelessBonuses(character);
  return bonuses.initiativeDice;
}

/**
 * Get wireless bonus for a specific attribute.
 */
export function getWirelessAttributeBonus(character: Character, attribute: AttributeKey): number {
  const bonuses = calculateWirelessBonuses(character);
  return bonuses.attributes[attribute] ?? 0;
}

/**
 * Get wireless bonus for attack pools.
 * Optionally filter by ranged/melee context.
 */
export function getWirelessAttackBonus(character: Character, isRanged: boolean = true): number {
  const context = isRanged ? "ranged_attack" : "melee_attack";
  const bonuses = calculateContextualWirelessBonuses(character, context);
  return bonuses.attackPool;
}

/**
 * Get wireless bonus for defense pools.
 */
export function getWirelessDefenseBonus(character: Character): number {
  const bonuses = calculateContextualWirelessBonuses(character, "defense");
  return bonuses.defensePool;
}

/**
 * Get wireless bonus for a specific limit.
 */
export function getWirelessLimitBonus(character: Character, limit: LimitKey): number {
  const bonuses = calculateWirelessBonuses(character);
  return bonuses.limits[limit] ?? 0;
}

/**
 * Get a summary of all active wireless bonuses for UI display.
 */
export function getWirelessBonusSummary(
  character: Character
): { category: string; description: string; modifier: string }[] {
  const bonuses = calculateWirelessBonuses(character);
  const summary: { category: string; description: string; modifier: string }[] = [];

  if (bonuses.initiative > 0) {
    summary.push({
      category: "Initiative",
      description: "Wireless bonus to Initiative",
      modifier: `+${bonuses.initiative}`,
    });
  }

  if (bonuses.initiativeDice > 0) {
    summary.push({
      category: "Initiative Dice",
      description: "Wireless bonus Initiative Dice",
      modifier: `+${bonuses.initiativeDice}D6`,
    });
  }

  for (const [attr, value] of Object.entries(bonuses.attributes)) {
    if (value && value > 0) {
      summary.push({
        category: "Attribute",
        description: `Wireless bonus to ${attr}`,
        modifier: `+${value}`,
      });
    }
  }

  if (bonuses.attackPool > 0) {
    summary.push({
      category: "Attack",
      description: "Wireless bonus to attack pools",
      modifier: `+${bonuses.attackPool}`,
    });
  }

  if (bonuses.defensePool > 0) {
    summary.push({
      category: "Defense",
      description: "Wireless bonus to defense pools",
      modifier: `+${bonuses.defensePool}`,
    });
  }

  if (bonuses.noiseReduction > 0) {
    summary.push({
      category: "Matrix",
      description: "Noise reduction",
      modifier: `-${bonuses.noiseReduction}`,
    });
  }

  return summary;
}
