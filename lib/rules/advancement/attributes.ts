/**
 * Attribute advancement logic
 *
 * Handles advancing character attributes post-creation.
 */

import { v4 as uuidv4 } from "uuid";
import type { Character, MergedRuleset, AdvancementRecord, TrainingPeriod, CampaignEvent } from "@/lib/types";
import { calculateAdvancementCost } from "./costs";
import { calculateAdvancementTrainingTime } from "./training";
import { validateAttributeAdvancement } from "./validation";

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
  // Validate advancement (including downtime limits if applicable)
  const validation = validateAttributeAdvancement(
    character,
    attributeId,
    newRating,
    ruleset,
    options.downtimePeriodId,
    options.campaignEvents
  );
  if (!validation.valid) {
    throw new Error(
      `Cannot advance attribute: ${validation.errors.map((e) => e.message).join(", ")}`
    );
  }

  if (!validation.cost) {
    throw new Error("Cost calculation failed");
  }

  const cost = validation.cost;
  const currentRating = character.attributes[attributeId] || 0;

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

  // Calculate training time (attribute training: new rating × 1 week)
  const trainingTime = calculateAdvancementTrainingTime("attribute", newRating, {
    instructorBonus: options.instructorBonus,
    timeModifier: options.timeModifier,
  });

  const advancementRecord: AdvancementRecord = {
    id: advancementRecordId,
    type: "attribute",
    targetId: attributeId,
    targetName: getAttributeDisplayName(attributeId),
    previousValue: currentRating,
    newValue: newRating,
    karmaCost: cost,
    karmaSpentAt: now,
    trainingRequired: true,
    trainingStatus: trainingTime > 0 ? "pending" : "completed",
    downtimePeriodId: options.downtimePeriodId,
    campaignSessionId: options.campaignSessionId,
    gmApproved: options.gmApproved || false,
    notes: options.notes,
    createdAt: now,
    ...(trainingTime === 0 ? { completedAt: now } : {}),
  };

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
    ...character,
    karmaCurrent: karmaAfterSpending,
    advancementHistory: [
      ...(character.advancementHistory || []),
      advancementRecord,
    ],
    activeTraining: trainingPeriod
      ? [...(character.activeTraining || []), trainingPeriod]
      : character.activeTraining || [],
  };

  return {
    advancementRecord,
    trainingPeriod,
    updatedCharacter,
  };
}

