/**
 * Karma transaction ledger service
 *
 * Centralized service for spending and tracking character karma.
 * Ensures all karma transactions are recorded in the advancement history.
 */

import { v4 as uuidv4 } from "uuid";
import type { Character, AdvancementRecord, AdvancementType } from "@/lib/types";

/**
 * Result of a karma transaction
 */
export interface KarmaTransactionResult {
  updatedCharacter: Character;
  record: AdvancementRecord;
}

/**
 * Spend karma for a character and record it in the ledger
 *
 * @param character - Character spending karma
 * @param type - Type of advancement
 * @param targetId - ID of the target (attribute code, skill ID, etc.)
 * @param targetName - Display name of the target
 * @param cost - Karma cost
 * @param previousValue - Previous rating/value
 * @param newValue - New rating/value
 * @param options - Additional record options
 * @returns Updated character and the created record
 */
export function spendKarma(
  character: Character,
  type: AdvancementType,
  targetId: string,
  targetName: string,
  cost: number,
  previousValue: number,
  newValue: number,
  options: {
    notes?: string;
    campaignSessionId?: string;
    downtimePeriodId?: string;
    trainingRequired?: boolean;
    trainingStatus?: AdvancementRecord["trainingStatus"];
    gmApproved?: boolean;
  } = {}
): KarmaTransactionResult {
  // Requirement 35: Resource expenditures MUST NOT result in a negative balance
  if (character.karmaCurrent < cost) {
    throw new Error(`Insufficient karma. Required: ${cost}, available: ${character.karmaCurrent}`);
  }

  const now = new Date().toISOString();
  const recordId = uuidv4();

  // Create the advancement record (Requirement 29: include state change)
  const record: AdvancementRecord = {
    id: recordId,
    type,
    targetId,
    targetName,
    previousValue,
    newValue,
    karmaCost: cost,
    karmaSpentAt: now,
    trainingRequired: options.trainingRequired ?? false,
    trainingStatus: options.trainingStatus ?? (options.trainingRequired ? "pending" : "completed"),
    downtimePeriodId: options.downtimePeriodId,
    campaignSessionId: options.campaignSessionId,
    gmApproved: options.gmApproved ?? false,
    notes: options.notes,
    createdAt: now,
    ...(options.trainingStatus === "completed" ||
    (!options.trainingRequired && !options.trainingStatus)
      ? { completedAt: now }
      : {}),
  };

  // Update character state
  const updatedCharacter: Character = {
    ...character,
    karmaCurrent: character.karmaCurrent - cost,
    advancementHistory: [...(character.advancementHistory || []), record],
  };

  return {
    updatedCharacter,
    record,
  };
}

/**
 * Earn karma for a character
 *
 * @param character - Character earning karma
 * @param amount - Amount of karma earned
 * @param source - Source of karma (e.g., "Session 12")
 * @returns Updated character
 */
export function earnKarma(character: Character, amount: number, source: string): Character {
  if (amount < 0) {
    throw new Error("Cannot earn negative karma");
  }

  // Record earning in audit log (since it's not an "advancement")
  // For now we just update the totals
  return {
    ...character,
    karmaTotal: character.karmaTotal + amount,
    karmaCurrent: character.karmaCurrent + amount,
    privateNotes:
      `${character.privateNotes || ""}\n[KARMA EARNED] +${amount} from ${source}`.trim(),
  };
}
