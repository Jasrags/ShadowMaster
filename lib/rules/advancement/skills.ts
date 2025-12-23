/**
 * Skill advancement logic
 *
 * Handles advancing character skills post-creation.
 */

import { v4 as uuidv4 } from "uuid";
import type { Character, MergedRuleset, AdvancementRecord, TrainingPeriod, CampaignEvent } from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";
import { calculateAdvancementTrainingTime } from "./training";
import { validateSkillAdvancement } from "./validation";

/**
 * Options for advancing a skill
 */
export interface AdvanceSkillOptions {
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
 * Result of skill advancement
 */
export interface AdvanceSkillResult {
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

  // The skills module structure can vary, but typically skills are keyed by ID
  // Try to find the skill directly by ID first
  const skill = skillsModule[skillId] as { name?: string; id?: string } | undefined;
  if (skill && skill.name) {
    return skill.name;
  }

  // If not found directly, try to search in nested structures
  // This is a fallback - ideally we'd use a helper function, but for now return the ID
  return skillId;
}

/**
 * Advance a skill for a character
 *
 * This function:
 * 1. Validates the advancement
 * 2. Spends karma immediately
 * 3. Creates an AdvancementRecord
 * 4. Creates a TrainingPeriod if training is required
 * 5. Returns updated character (but does NOT update character stats until training completes)
 *
 * @param character - Character to advance
 * @param skillId - Skill ID to advance
 * @param newRating - Target rating
 * @param ruleset - Merged ruleset
 * @param options - Advancement options
 * @returns Advancement result with record and updated character
 */
export function advanceSkill(
  character: Character,
  skillId: string,
  newRating: number,
  ruleset: MergedRuleset,
  options: AdvanceSkillOptions = {}
): AdvanceSkillResult {
  // Validate advancement (including downtime limits if applicable)
  const validation = validateSkillAdvancement(
    character,
    skillId,
    newRating,
    ruleset,
    {
      downtimePeriodId: options.downtimePeriodId,
      campaignEvents: options.campaignEvents,
      settings: options.settings
    }
  );
  if (!validation.valid) {
    throw new Error(
      `Cannot advance skill: ${validation.errors.map((e) => e.message).join(", ")}`
    );
  }

  if (!validation.cost) {
    throw new Error("Cost calculation failed");
  }

  const cost = validation.cost;
  const currentRating = character.skills[skillId] || 0;

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

  // Calculate training time (skill training varies by rating)
  const trainingTime = calculateAdvancementTrainingTime("skill", newRating, {
    instructorBonus: options.instructorBonus,
    timeModifier: options.timeModifier,
    settings: options.settings,
  });

  const skillName = getSkillDisplayName(skillId, ruleset);

  const advancementRecord: AdvancementRecord = {
    id: advancementRecordId,
    type: "skill",
    targetId: skillId,
    targetName: skillName,
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
      type: "skill",
      targetId: skillId,
      targetName: skillName,
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
  // NOTE: Character skill is NOT updated yet - that happens when training completes
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

