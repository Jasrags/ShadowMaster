/**
 * Notoriety Trigger Mechanics (Run Faster pp. 196-211)
 *
 * Notoriety tracks a runner's bad reputation from unprofessional behavior.
 * Certain actions during runs (e.g., using manipulation magic during a meet,
 * appearing heavily armed, killing a paying Johnson) trigger notoriety gains.
 *
 * Key mechanics:
 * - Triggers are defined in the Johnson Profiles module
 * - Each trigger has a fixed notorietyChange value (positive integer)
 * - Applied triggers are recorded in an immutable audit log
 * - GMs can reverse incorrectly applied triggers
 * - Reversal marks the original record rather than deleting it
 *
 * @see NotorietyTriggerData in lib/rules/module-payloads.ts
 */

import { v4 as uuidv4 } from "uuid";
import type { ID, ISODateString } from "../types/core";
import type { NotorietyTriggerRecord } from "../types/character";
import type { NotorietyTriggerData } from "./module-payloads";

// =============================================================================
// TYPES
// =============================================================================

/** Character reputation state (matches Character.reputation) */
export interface ReputationState {
  streetCred: number;
  notoriety: number;
  publicAwareness: number;
  notorietyLog?: NotorietyTriggerRecord[];
}

/** Result of applying a notoriety trigger */
export interface ApplyTriggerResult {
  success: true;
  reputation: ReputationState;
  record: NotorietyTriggerRecord;
}

/** Result of reversing a notoriety trigger */
export interface ReverseTriggerResult {
  success: true;
  reputation: ReputationState;
  record: NotorietyTriggerRecord;
}

/** Error result for trigger operations */
export interface TriggerError {
  success: false;
  error: string;
}

// =============================================================================
// APPLY TRIGGER
// =============================================================================

/**
 * Apply a notoriety trigger to a character's reputation.
 *
 * Creates an immutable record and increments the notoriety score.
 * Returns a new reputation object (never mutates the input).
 *
 * @param reputation - Current reputation state
 * @param trigger - The trigger data from the ruleset
 * @param actorId - User ID of the person applying the trigger
 * @param sessionNote - Optional context about when/why the trigger was applied
 */
export function applyNotorietyTrigger(
  reputation: ReputationState,
  trigger: NotorietyTriggerData,
  actorId: ID,
  sessionNote?: string
): ApplyTriggerResult | TriggerError {
  if (trigger.notorietyChange <= 0) {
    return { success: false, error: "Trigger must have a positive notoriety change" };
  }

  const now = new Date().toISOString() as ISODateString;
  const record: NotorietyTriggerRecord = {
    id: uuidv4(),
    triggerId: trigger.id,
    triggerName: trigger.name,
    notorietyChange: trigger.notorietyChange,
    appliedAt: now,
    appliedBy: actorId,
    ...(sessionNote ? { sessionNote } : {}),
  };

  const existingLog = reputation.notorietyLog ?? [];

  return {
    success: true,
    reputation: {
      ...reputation,
      notoriety: reputation.notoriety + trigger.notorietyChange,
      notorietyLog: [...existingLog, record],
    },
    record,
  };
}

// =============================================================================
// REVERSE TRIGGER
// =============================================================================

/**
 * Reverse a previously applied notoriety trigger.
 *
 * Marks the original record as reversed and decrements the notoriety score.
 * Returns a new reputation object (never mutates the input).
 * Notoriety cannot go below zero.
 *
 * @param reputation - Current reputation state
 * @param recordId - The ID of the NotorietyTriggerRecord to reverse
 * @param actorId - User ID of the person reversing the trigger
 */
export function reverseNotorietyTrigger(
  reputation: ReputationState,
  recordId: ID,
  actorId: ID
): ReverseTriggerResult | TriggerError {
  const existingLog = reputation.notorietyLog ?? [];
  const recordIndex = existingLog.findIndex((r) => r.id === recordId);

  if (recordIndex === -1) {
    return { success: false, error: "Trigger record not found" };
  }

  const originalRecord = existingLog[recordIndex];

  if (originalRecord.reversedAt) {
    return { success: false, error: "Trigger has already been reversed" };
  }

  const now = new Date().toISOString() as ISODateString;
  const updatedRecord: NotorietyTriggerRecord = {
    ...originalRecord,
    reversedAt: now,
    reversedBy: actorId,
  };

  const updatedLog = existingLog.map((r, i) => (i === recordIndex ? updatedRecord : r));
  const newNotoriety = Math.max(0, reputation.notoriety - originalRecord.notorietyChange);

  return {
    success: true,
    reputation: {
      ...reputation,
      notoriety: newNotoriety,
      notorietyLog: updatedLog,
    },
    record: updatedRecord,
  };
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Get active (non-reversed) trigger records from the notoriety log.
 */
export function getActiveTriggerRecords(
  log: readonly NotorietyTriggerRecord[]
): readonly NotorietyTriggerRecord[] {
  return log.filter((r) => !r.reversedAt);
}

/**
 * Calculate notoriety from trigger records only (excludes base notoriety).
 * Useful for displaying "X from triggers" breakdown.
 */
export function calculateTriggerNotoriety(log: readonly NotorietyTriggerRecord[]): number {
  return getActiveTriggerRecords(log).reduce((sum, r) => sum + r.notorietyChange, 0);
}
