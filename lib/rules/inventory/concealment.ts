/**
 * Concealment System
 *
 * Calculates concealment modifiers based on equipment readiness state.
 * These modify Perception tests to detect hidden items.
 *
 * Negative = harder to detect, Positive = easier to detect.
 *
 * @see docs/specifications/gear-location-and-loadouts.md#concealment-integration
 */

import type { Character, GearItem, Weapon, ArmorItem } from "@/lib/types";
import type { EquipmentReadiness } from "@/lib/types/gear-state";
import { normalizeReadiness } from "@/lib/types/gear-state";

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Concealment modifier by readiness state.
 * Negative values make items harder to find; positive values easier.
 */
export const CONCEALMENT_BY_READINESS: Record<string, number> = {
  stashed: 0, // N/A — not present
  carried: -4, // Hidden in bag
  stored: -4, // Legacy synonym for carried
  pocketed: -2, // In pocket
  holstered: 0, // Depends on holster (base modifier)
  worn: 2, // Visible
  readied: 4, // Obviously visible
};

// =============================================================================
// TYPES
// =============================================================================

export interface ConcealmentCheck {
  /** Base concealment modifier from item properties */
  baseModifier: number;
  /** Modifier from readiness/location */
  locationModifier: number;
  /** Combined total modifier to Perception test */
  totalModifier: number;
}

export interface ConcealedItemInfo {
  item: GearItem | Weapon | ArmorItem;
  check: ConcealmentCheck;
}

// =============================================================================
// FUNCTIONS
// =============================================================================

/**
 * Get the concealment modifier for a readiness state.
 */
export function getConcealmentModifier(readiness: EquipmentReadiness): number {
  const normalized = normalizeReadiness(readiness);
  return CONCEALMENT_BY_READINESS[normalized] ?? 0;
}

/**
 * Calculate the full concealment check for an item.
 * Combines the item's inherent concealability with its location modifier.
 */
export function calculateConcealmentCheck(item: {
  concealability?: number;
  state?: { readiness: EquipmentReadiness };
}): ConcealmentCheck {
  const baseModifier = (item as { concealability?: number }).concealability ?? 0;
  const readiness = item.state?.readiness ?? "carried";
  const locationModifier = getConcealmentModifier(readiness);

  return {
    baseModifier,
    locationModifier,
    totalModifier: baseModifier + locationModifier,
  };
}

/**
 * Get all items on a character that could potentially be detected,
 * along with their concealment checks.
 * Excludes stashed items (not present on the runner).
 */
export function getConcealedItems(character: Character): ConcealedItemInfo[] {
  const results: ConcealedItemInfo[] = [];

  const processItem = (item: GearItem | Weapon | ArmorItem) => {
    const readiness = item.state?.readiness ?? "carried";
    // Skip stashed items — they're not present
    if (readiness === "stashed") return;

    const check = calculateConcealmentCheck(item);
    results.push({ item, check });
  };

  for (const item of character.gear || []) processItem(item);
  for (const weapon of character.weapons || []) processItem(weapon);
  for (const armor of character.armor || []) processItem(armor);

  return results;
}
