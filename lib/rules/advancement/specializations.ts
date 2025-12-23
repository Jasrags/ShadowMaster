/**
 * Specialization advancement logic
 *
 * Handles learning skill specializations post-creation.
 * Specializations require skill rating 4+, cost 7 karma, and 30 days training.
 */

import { v4 as uuidv4 } from "uuid";
import type { Character, MergedRuleset, AdvancementRecord, TrainingPeriod, CampaignEvent } from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";
import { calculateAdvancementTrainingTime } from "./training";
import { validateSpecializationAdvancement } from "./validation";

/**
 * Options for learning a specialization
 */
export interface AdvanceSpecializationOptions {
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
 * Result of specialization advancement
 */
export interface AdvanceSpecializationResult {
  advancementRecord: AdvancementRecord;
  trainingPeriod?: TrainingPeriod;
  updatedCharacter: Character;
}

/**
 * Get skill display name from ruleset
 *
 * @param skillId - Skill ID
 * @param ruleset - Merged ruleset
 * @returns Display name or skillId if not found
 */
function getSkillDisplayName(skillId: string, ruleset: MergedRuleset): string {
  const skillsModule = ruleset.modules.skills as Record<string, unknown> | undefined;
  if (!skillsModule) {
    return skillId;
  }

  const skill = skillsModule[skillId] as { name?: string; id?: string } | undefined;
  if (skill && skill.name) {
    return skill.name;
  }

  return skillId;
}

/**
 * Advance a specialization for a character
 *
 * This function:
 * 1. Validates the advancement (skill rating 4+, specialization not already learned)
 * 2. Spends karma immediately
 * 3. Creates an AdvancementRecord
 * 4. Creates a TrainingPeriod (30 days)
 * 5. Returns updated character (but does NOT update character specialization until training completes)
 *
 * @param character - Character to advance
 * @param skillId - Skill ID for the specialization
 * @param specializationName - Name of the specialization to learn
 * @param ruleset - Merged ruleset
 * @param options - Advancement options
 * @returns Advancement result with record and updated character
 */
export function advanceSpecialization(
  character: Character,
  skillId: string,
  specializationName: string,
  ruleset: MergedRuleset,
  options: AdvanceSpecializationOptions = {}
): AdvanceSpecializationResult {
  // Validate advancement
  const validation = validateSpecializationAdvancement(
    character,
    skillId,
    ruleset,
    options.settings
  );
  if (!validation.valid) {
    throw new Error(
      `Cannot learn specialization: ${validation.errors.map((e) => e.message).join(", ")}`
    );
  }

  if (!validation.cost) {
    throw new Error("Cost calculation failed");
  }

  const cost = validation.cost;
  const currentRating = character.skills[skillId] || 0;

  // Check if specialization already exists
  const existingSpecializations = character.skillSpecializations?.[skillId] || [];
  if (existingSpecializations.includes(specializationName)) {
    throw new Error(
      `Character already knows the specialization "${specializationName}" for ${getSkillDisplayName(skillId, ruleset)}`
    );
  }

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

  // Calculate training time (specialization: 30 days, can be modified)
  const trainingTime = calculateAdvancementTrainingTime("specialization", undefined, {
    instructorBonus: options.instructorBonus,
    timeModifier: options.timeModifier,
  });

  const advancementRecord: AdvancementRecord = {
    id: advancementRecordId,
    type: "specialization",
    targetId: skillId,
    targetName: `${getSkillDisplayName(skillId, ruleset)} (${specializationName})`,
    previousValue: currentRating, // Store skill rating for reference
    newValue: currentRating, // Skill rating doesn't change, just adds specialization
    karmaCost: cost,
    karmaSpentAt: now,
    trainingRequired: true,
    trainingStatus: trainingTime > 0 ? "pending" : "completed",
    downtimePeriodId: options.downtimePeriodId,
    campaignSessionId: options.campaignSessionId,
    gmApproved: options.gmApproved || false,
    notes: options.notes || `Specialization: ${specializationName}`,
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
      type: "specialization",
      targetId: skillId,
      targetName: `${getSkillDisplayName(skillId, ruleset)} (${specializationName})`,
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
  // NOTE: Character specialization is NOT updated yet - that happens when training completes
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

