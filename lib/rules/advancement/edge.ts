/**
 * Edge advancement logic
 *
 * Handles advancing character Edge post-creation.
 * Edge advancement has no training time (no downtime required).
 */

import type { Character, MergedRuleset, AdvancementRecord } from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";
import type { AdvancementRulesData } from "@/lib/rules/loader-types";
import { validateAttributeAdvancement } from "./validation";
import { spendKarma } from "./ledger";

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
  // Extract advancement rules
  const advancementRules = ruleset.modules.advancement as unknown as AdvancementRulesData;

  // Validate advancement
  const validation = validateAttributeAdvancement(
    character,
    "edge",
    newRating,
    ruleset,
    {
      settings: options.settings,
      ruleset: advancementRules,
    }
  );
  if (!validation.valid) {
    throw new Error(
      `Cannot advance Edge: ${validation.errors.map((e) => e.message).join(", ")}`
    );
  }

  const cost = validation.cost;
  if (cost === undefined) {
    throw new Error("Cost calculation failed");
  }
  const currentRating = character.specialAttributes?.edge || 0;

  // Use ledger to spend karma
  const { updatedCharacter: characterWithKarmaSpent, record: advancementRecord } = spendKarma(
    character,
    "edge",
    "edge",
    "Edge",
    cost,
    currentRating,
    newRating,
    {
      notes: options.notes,
      campaignSessionId: options.campaignSessionId,
      gmApproved: options.gmApproved,
      trainingRequired: false,
      trainingStatus: "completed",
    }
  );

  // Update character (karma spent, advancement record added, Edge updated immediately)
  const updatedCharacter: Character = {
    ...characterWithKarmaSpent,
    specialAttributes: {
      ...characterWithKarmaSpent.specialAttributes,
      edge: newRating,
    },
  };

  return {
    advancementRecord,
    updatedCharacter,
  };
}

