/**
 * Lifestyle game mechanics functions.
 *
 * Pure functions for Run Faster lifestyle mechanics:
 * - Neighborhood zone classification lookup
 * - Fatigue DV calculation (Comforts & Necessities)
 * - Security threshold calculation (burglary tests)
 */

import type { NeighborhoodZoneData } from "../loader-types";

/**
 * Get the neighborhood zone classification for a given neighborhood level.
 * Returns undefined if no matching zone is found.
 */
export function getNeighborhoodZone(
  level: number,
  zones: NeighborhoodZoneData[]
): NeighborhoodZoneData | undefined {
  return zones.find((z) => z.level === level);
}

/**
 * Calculate the fatigue damage value for a lifestyle based on C&N level.
 *
 * Run Faster p. 218: Base Fatigue damage is 6S. For each level in the
 * Comforts & Necessities category, reduce the DV by 2.
 *
 * @param comfortsLevel - Current Comforts & Necessities level
 * @returns Fatigue DV (minimum 0)
 */
export function calculateFatigueDV(comfortsLevel: number): number {
  return Math.max(0, 6 - comfortsLevel * 2);
}

/**
 * Calculate the security dice pool for burglary tests.
 *
 * Run Faster p. 219: Roll a dice pool of (Security level × 2) against
 * the Sneaking + Agility of the burglars.
 *
 * @param securityLevel - Current Security level
 * @returns Dice pool for the security test
 */
export function calculateSecurityThreshold(securityLevel: number): number {
  return securityLevel * 2;
}
