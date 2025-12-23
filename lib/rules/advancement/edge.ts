/**
 * Edge advancement logic
 *
 * Handles advancing character Edge post-creation.
 * Edge advancement has no training time (no downtime required).
 */

import { v4 as uuidv4 } from "uuid";
import type { Character, MergedRuleset, AdvancementRecord } from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";
import { calculateEdgeCost } from "./costs";

/**
 * Options for advancing Edge
 */
export interface AdvanceEdgeOptions {
  campaignSessionId?: string;
  gmApproved?: boolean;
  notes?: string;
  settings?: CampaignAdvancementSettings;
}

/**
 * Result of Edge advancement
 */
export interface AdvanceEdgeResult {
  advancementRecord: AdvancementRecord;
  updatedCharacter: Character;
}

/**
 * Validate Edge advancement
 *
 * @param character - Character to validate
 * @param newRating - Target Edge rating
 * @param settings - Campaign advancement settings
 * @returns Validation result
 */
function validateEdgeAdvancement(
  character: Character,
  newRating: number,
  settings?: CampaignAdvancementSettings
): { valid: boolean; errors: Array<{ message: string; field?: string }>; cost?: number } {
  const errors: Array<{ message: string; field?: string }> = [];
  const currentRating = character.specialAttributes?.edge || 0;

  // Validate rating is at least 1
  if (newRating < 1) {
    errors.push({
      message: "Edge rating must be at least 1",
      field: "rating",
    });
  }

  // Validate rating is higher than current
  if (newRating <= currentRating) {
    errors.push({
      message: `New Edge rating must be higher than current rating (current: ${currentRating})`,
      field: "rating",
    });
  }

  // Validate maximum Edge rating (typically 6, humans can have 7)
  // For now, we'll use a default max of 7 (can be enhanced with ruleset-based validation later)
  const maxEdge = 7;
  if (newRating > maxEdge) {
    errors.push({
      message: `Edge rating cannot exceed ${maxEdge}`,
      field: "rating",
    });
  }

  // Calculate cost and validate karma
  let cost: number | undefined;
  try {
    cost = calculateEdgeCost(newRating, settings);
    if (character.karmaCurrent < cost) {
      errors.push({
        message: `Not enough karma. Need ${cost}, have ${character.karmaCurrent}`,
        field: "karma",
      });
    }
  } catch (error) {
    errors.push({
      message: error instanceof Error ? error.message : "Cost calculation failed",
      field: "cost",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    cost,
  };
}

/**
 * Advance Edge for a character
 *
 * This function:
 * 1. Validates the advancement
 * 2. Spends karma immediately
 * 3. Creates an AdvancementRecord
 * 4. Updates character Edge immediately (no training required)
 *
 * @param character - Character to advance
 * @param newRating - Target Edge rating
 * @param ruleset - Merged ruleset (for future ruleset-based validation)
 * @param options - Advancement options
 * @returns Advancement result with record and updated character
 */
export function advanceEdge(
  character: Character,
  newRating: number,
  ruleset: MergedRuleset,
  options: AdvanceEdgeOptions = {}
): AdvanceEdgeResult {
  void ruleset; // Reserved for future ruleset-based validation

  // Validate advancement
  const validation = validateEdgeAdvancement(character, newRating, options.settings);
  if (!validation.valid) {
    throw new Error(
      `Cannot advance Edge: ${validation.errors.map((e) => e.message).join(", ")}`
    );
  }

  if (!validation.cost) {
    throw new Error("Cost calculation failed");
  }

  const cost = validation.cost;
  const currentRating = character.specialAttributes?.edge || 0;

  // Check karma availability
  if (character.karmaCurrent < cost) {
    throw new Error(
      `Not enough karma. Need ${cost}, have ${character.karmaCurrent}`
    );
  }

  // Spend karma immediately
  const karmaAfterSpending = character.karmaCurrent - cost;

  // Create advancement record
  const advancementRecordId = uuidv4();
  const now = new Date().toISOString();

  const advancementRecord: AdvancementRecord = {
    id: advancementRecordId,
    type: "edge",
    targetId: "edge",
    targetName: "Edge",
    previousValue: currentRating,
    newValue: newRating,
    karmaCost: cost,
    karmaSpentAt: now,
    trainingRequired: false, // Edge has no training time
    trainingStatus: "completed", // Immediately completed
    campaignSessionId: options.campaignSessionId,
    gmApproved: options.gmApproved || false,
    notes: options.notes,
    createdAt: now,
    completedAt: now, // Completed immediately
  };

  // Update character (karma spent, advancement record added, Edge updated immediately)
  const updatedCharacter: Character = {
    ...character,
    karmaCurrent: karmaAfterSpending,
    specialAttributes: {
      ...character.specialAttributes,
      edge: newRating,
    },
    advancementHistory: [
      ...(character.advancementHistory || []),
      advancementRecord,
    ],
  };

  return {
    advancementRecord,
    updatedCharacter,
  };
}

