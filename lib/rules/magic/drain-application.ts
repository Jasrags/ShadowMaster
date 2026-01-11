/**
 * Drain Application Service
 *
 * Handles the application of drain damage to characters after
 * the resistance roll has been made.
 */

import type { Character } from "@/lib/types/character";
import type { DrainResult } from "@/lib/types/magic";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of applying drain to a character
 */
export interface DrainApplicationResult {
  /** Amount of damage actually applied after resistance */
  damageApplied: number;

  /** Type of damage (stun or physical) */
  damageType: "stun" | "physical";

  /** Number of hits from resistance roll */
  resistanceHits: number;

  /** Updated character condition */
  characterCondition: {
    stunDamage: number;
    physicalDamage: number;
    woundModifier: number;
  };

  /** Warning if character is close to incapacitation */
  burnoutWarning?: boolean;

  /** Character is unconscious (stun track filled) */
  unconscious?: boolean;

  /** Character is dying (physical track filled) */
  dying?: boolean;

  /** Overflow damage (damage beyond physical track) */
  overflowDamage?: number;
}

/**
 * Drain history entry for tracking
 */
export interface DrainHistoryEntry {
  timestamp: string;
  action: string;
  drainValue: number;
  drainType: "stun" | "physical";
  resistanceHits: number;
  damageApplied: number;
  spellId?: string;
  force?: number;
}

/**
 * Drain session for tracking cumulative drain
 */
export interface DrainSession {
  sessionId: string;
  characterId: string;
  drainHistory: DrainHistoryEntry[];
  totalDrainTaken: number;
  startedAt: string;
}

// =============================================================================
// DRAIN APPLICATION
// =============================================================================

/**
 * Apply drain damage after resistance roll
 *
 * @param character - The character taking drain
 * @param drainResult - The calculated drain result
 * @param resistanceHits - Number of hits from resistance roll
 * @param currentDamage - Current damage state (optional, uses character state if not provided)
 * @returns Application result with updated condition
 */
export function applyDrain(
  character: Partial<Character>,
  drainResult: DrainResult,
  resistanceHits: number,
  currentDamage?: { stun: number; physical: number }
): DrainApplicationResult {
  // Calculate net drain after resistance
  const netDrain = Math.max(0, drainResult.drainValue - resistanceHits);

  // Get current damage state
  const stunDamage = currentDamage?.stun ?? 0;
  const physicalDamage = currentDamage?.physical ?? 0;

  // Calculate track sizes (based on Body for physical, Willpower for stun)
  const body = character.attributes?.body ?? 3;
  const willpower = character.attributes?.willpower ?? 3;
  const physicalTrackSize = Math.ceil(body / 2) + 8;
  const stunTrackSize = Math.ceil(willpower / 2) + 8;

  // Apply damage based on drain type
  let newStunDamage = stunDamage;
  let newPhysicalDamage = physicalDamage;
  let unconscious = false;
  let dying = false;
  let overflowDamage = 0;

  if (drainResult.drainType === "stun") {
    newStunDamage += netDrain;

    // Check for stun overflow (becomes physical)
    if (newStunDamage > stunTrackSize) {
      const overflow = newStunDamage - stunTrackSize;
      newStunDamage = stunTrackSize;
      newPhysicalDamage += overflow;
      unconscious = true;
    }
  } else {
    newPhysicalDamage += netDrain;
  }

  // Check for physical overflow (dead/dying)
  if (newPhysicalDamage > physicalTrackSize) {
    overflowDamage = newPhysicalDamage - physicalTrackSize;
    dying = true;
  }

  // Calculate wound modifier (-1 per 3 boxes of damage)
  const totalDamage = newStunDamage + newPhysicalDamage;
  const woundModifier = -Math.floor(totalDamage / 3);

  // Check for burnout risk (close to incapacitation)
  const burnoutWarning = checkBurnoutRisk(
    { stun: newStunDamage, physical: newPhysicalDamage },
    { stunTrack: stunTrackSize, physicalTrack: physicalTrackSize }
  );

  return {
    damageApplied: netDrain,
    damageType: drainResult.drainType,
    resistanceHits,
    characterCondition: {
      stunDamage: newStunDamage,
      physicalDamage: newPhysicalDamage,
      woundModifier,
    },
    burnoutWarning,
    unconscious,
    dying,
    overflowDamage: overflowDamage > 0 ? overflowDamage : undefined,
  };
}

/**
 * Check for burnout condition (close to incapacitation)
 *
 * Returns true if character is within 3 boxes of filling either track
 */
export function checkBurnoutRisk(
  currentDamage: { stun: number; physical: number },
  trackSizes: { stunTrack: number; physicalTrack: number }
): boolean {
  const stunRemaining = trackSizes.stunTrack - currentDamage.stun;
  const physicalRemaining = trackSizes.physicalTrack - currentDamage.physical;

  // Warn if within 3 boxes of filling either track
  return stunRemaining <= 3 || physicalRemaining <= 3;
}

/**
 * Check if a proposed drain would incapacitate the character
 *
 * @param character - The character
 * @param pendingDrain - The drain value before resistance
 * @param drainType - Stun or physical
 * @param expectedResistance - Expected resistance hits (estimate)
 * @returns True if the drain could reasonably incapacitate
 */
export function wouldIncapacitate(
  character: Partial<Character>,
  pendingDrain: number,
  drainType: "stun" | "physical",
  expectedResistance: number = 0
): boolean {
  const body = character.attributes?.body ?? 3;
  const willpower = character.attributes?.willpower ?? 3;
  const physicalTrackSize = Math.ceil(body / 2) + 8;
  const stunTrackSize = Math.ceil(willpower / 2) + 8;

  const netDrain = Math.max(0, pendingDrain - expectedResistance);

  // Get current damage from character (if available)
  // TODO: Access character's current condition monitor state
  const currentStun = 0;
  const currentPhysical = 0;

  if (drainType === "stun") {
    return currentStun + netDrain >= stunTrackSize;
  } else {
    return currentPhysical + netDrain >= physicalTrackSize;
  }
}

// =============================================================================
// DRAIN SESSION MANAGEMENT
// =============================================================================

/**
 * Create a new drain tracking session
 */
export function createDrainSession(sessionId: string, characterId: string): DrainSession {
  return {
    sessionId,
    characterId,
    drainHistory: [],
    totalDrainTaken: 0,
    startedAt: new Date().toISOString(),
  };
}

/**
 * Add a drain entry to the session
 */
export function recordDrainEvent(
  session: DrainSession,
  entry: Omit<DrainHistoryEntry, "timestamp">
): DrainSession {
  const newEntry: DrainHistoryEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  return {
    ...session,
    drainHistory: [...session.drainHistory, newEntry],
    totalDrainTaken: session.totalDrainTaken + entry.damageApplied,
  };
}

/**
 * Get drain summary for a session
 */
export function getDrainSessionSummary(session: DrainSession): {
  totalDrainTaken: number;
  stunDrainTaken: number;
  physicalDrainTaken: number;
  drainEvents: number;
  averageDrainPerEvent: number;
} {
  const stunDrain = session.drainHistory
    .filter((e) => e.drainType === "stun")
    .reduce((sum, e) => sum + e.damageApplied, 0);

  const physicalDrain = session.drainHistory
    .filter((e) => e.drainType === "physical")
    .reduce((sum, e) => sum + e.damageApplied, 0);

  const eventCount = session.drainHistory.length;

  return {
    totalDrainTaken: session.totalDrainTaken,
    stunDrainTaken: stunDrain,
    physicalDrainTaken: physicalDrain,
    drainEvents: eventCount,
    averageDrainPerEvent: eventCount > 0 ? session.totalDrainTaken / eventCount : 0,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calculate expected drain resistance hits
 * Uses average (pool / 3) for estimation
 */
export function estimateResistanceHits(resistancePool: number): number {
  return Math.floor(resistancePool / 3);
}

/**
 * Format damage condition for display
 */
export function formatDamageCondition(
  condition: DrainApplicationResult["characterCondition"]
): string {
  const parts: string[] = [];

  if (condition.stunDamage > 0) {
    parts.push(`${condition.stunDamage}S`);
  }
  if (condition.physicalDamage > 0) {
    parts.push(`${condition.physicalDamage}P`);
  }
  if (condition.woundModifier < 0) {
    parts.push(`${condition.woundModifier} WM`);
  }

  return parts.length > 0 ? parts.join(", ") : "Healthy";
}
