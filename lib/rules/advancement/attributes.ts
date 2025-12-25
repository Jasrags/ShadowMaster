/**
 * Attribute advancement logic
 *
 * Handles advancing character attributes post-creation.
 */

import { v4 as uuidv4 } from "uuid";
import type {
  Character,
  MergedRuleset,
  AdvancementRecord,
  TrainingPeriod,
  CampaignEvent,
} from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";
import type { AdvancementRulesData } from "@/lib/rules/loader-types";
import { calculateAdvancementTrainingTime } from "./training";
import { validateAttributeAdvancement } from "./validation";
import { spendKarma } from "./ledger";

/**
 * Attribute display name mapping
 */
const ATTRIBUTE_DISPLAY_NAMES: Record<string, string> = {
  body: "Body",
  agility: "Agility",
  reaction: "Reaction",
  strength: "Strength",
  willpower: "Willpower",
  logic: "Logic",
  intuition: "Intuition",
  charisma: "Charisma",
};

/**
 * Get attribute display name
 *
 * @param attributeId - Attribute ID (e.g., "bod", "agi")
 * @returns Display name (e.g., "Body", "Agility")
 */
function getAttributeDisplayName(attributeId: string): string {
  return ATTRIBUTE_DISPLAY_NAMES[attributeId.toLowerCase()] || attributeId.toUpperCase();
}

/**
 * Options for advancing an attribute
 */
export interface AdvanceAttributeOptions {
  downtimePeriodId?: string;
  campaignSessionId?: string;
  gmApproved?: boolean;
  instructorBonus?: boolean;
  timeModifier?: number; // Percentage modifier (e.g., +50 for Dependents quality)
  notes?: string;
  campaignEvents?: CampaignEvent[]; // For downtime limit validation
  settings?: CampaignAdvancementSettings;
}

/**
 * Result of attribute advancement
 */
export interface AdvanceAttributeResult {
  advancementRecord: AdvancementRecord;
  trainingPeriod?: TrainingPeriod;
  updatedCharacter: Character;
}

/**
 * Advance an attribute for a character
 *
 * This function:
 * 1. Validates the advancement
 * 2. Spends karma immediately
 * 3. Creates an AdvancementRecord
 * 4. Creates a TrainingPeriod if training is required
 * 5. Returns updated character (but does NOT update character stats until training completes)
 *
 * @param character - Character to advance
 * @param attributeId - Attribute ID to advance (e.g., "bod", "agi")
 * @param newRating - Target rating
 * @param ruleset - Merged ruleset
 * @param options - Advancement options
 * @returns Advancement result with record and updated character
 */
export function advanceAttribute(
  character: Character,
  attributeId: string,
  newRating: number,
  ruleset: MergedRuleset,
  options: AdvanceAttributeOptions = {}
): AdvanceAttributeResult {
  // Extract advancement rules from ruleset
  const advancementRules = ruleset.modules.advancement as unknown as AdvancementRulesData;

  // Validate advancement (including downtime limits if applicable)
  const validation = validateAttributeAdvancement(
    character,
    attributeId,
    newRating,
    ruleset,
    {
      downtimePeriodId: options.downtimePeriodId,
      campaignEvents: options.campaignEvents,
      settings: options.settings,
      ruleset: advancementRules,
    }
  );
  if (!validation.valid) {
    throw new Error(
      `Cannot advance attribute: ${validation.errors.map((e) => e.message).join(", ")}`
    );
  }

  const cost = validation.cost;
  if (cost === undefined) {
    throw new Error("Cost calculation failed");
  }
  const currentRating = character.attributes[attributeId] || 0;

  // Calculate training time
  const trainingTime = calculateAdvancementTrainingTime("attribute", newRating, {
    instructorBonus: options.instructorBonus,
    timeModifier: options.timeModifier,
    settings: options.settings,
    ruleset: advancementRules,
  });

  // Use ledger to spend karma and create record
  const { updatedCharacter: characterWithKarmaSpent, record: advancementRecord } = spendKarma(
    character,
    "attribute",
    attributeId,
    getAttributeDisplayName(attributeId),
    cost,
    currentRating,
    newRating,
    {
      notes: options.notes,
      campaignSessionId: options.campaignSessionId,
      downtimePeriodId: options.downtimePeriodId,
      trainingRequired: true,
      trainingStatus: trainingTime > 0 ? "pending" : "completed",
      gmApproved: options.gmApproved,
    }
  );

  const advancementRecordId = advancementRecord.id;
  const now = advancementRecord.createdAt;

  // Create training period if training is required
  let trainingPeriod: TrainingPeriod | undefined;
  if (trainingTime > 0) {
    const trainingPeriodId = uuidv4();
    const expectedCompletionDate = new Date(Date.now() + trainingTime * 24 * 60 * 60 * 1000).toISOString();

    trainingPeriod = {
      id: trainingPeriodId,
      advancementRecordId: advancementRecordId,
      type: "attribute",
      targetId: attributeId,
      targetName: getAttributeDisplayName(attributeId),
      requiredTime: trainingTime,
      timeSpent: 0,
      startDate: now,
      expectedCompletionDate,
      status: "pending",
      downtimePeriodId: options.downtimePeriodId,
      instructorBonus: options.instructorBonus,
      timeModifier: options.timeModifier,
      createdAt: now,
    };

    advancementRecord.trainingPeriodId = trainingPeriodId;
    advancementRecord.trainingStatus = "pending";
  }

  // Update character (karma spent, advancement record added, training period added)
  // NOTE: Character attribute is NOT updated yet - that happens when training completes
  const updatedCharacter: Character = {
    ...characterWithKarmaSpent,
    activeTraining: trainingPeriod
      ? [...(characterWithKarmaSpent.activeTraining || []), trainingPeriod]
      : characterWithKarmaSpent.activeTraining || [],
  };

  return {
    advancementRecord,
    trainingPeriod,
    updatedCharacter,
  };
}

