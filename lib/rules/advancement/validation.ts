/**
 * Validation functions for character advancement
 *
 * Validates advancement requests against character state and rules.
 */

import type { Character, MergedRuleset, AdvancementType, CampaignEvent } from "@/lib/types";
import { calculateAdvancementCost } from "./costs";
import { validateDowntimeLimits } from "./downtime";

/**
 * Result of advancement validation
 */
export interface AdvancementValidationResult {
  valid: boolean;
  errors: Array<{ message: string; field?: string }>;
  cost?: number;
}

/**
 * Validate that character has sufficient karma for advancement
 *
 * @param character - Character to validate
 * @param cost - Karma cost of advancement
 * @returns Validation result
 */
export function validateKarmaAvailability(
  character: Character,
  cost: number
): { valid: boolean; error?: string } {
  if (character.karmaCurrent < cost) {
    return {
      valid: false,
      error: `Not enough karma. Need ${cost}, have ${character.karmaCurrent}`,
    };
  }
  return { valid: true };
}

/**
 * Get metatype attribute limits
 * Accesses modules directly to avoid importing from merge.ts (which would pull in loader.ts)
 */
function getMetatypeAttributeLimits(
  metatypeId: string,
  ruleset: MergedRuleset
): Record<string, { min: number; max: number }> | null {
  // Access modules directly to avoid importing from merge.ts (which imports server-only code)
  const metatypesModule = ruleset.modules.metatypes as {
    metatypes: Array<{
      id: string;
      attributes: Record<string, { min: number; max: number } | { base: number }>;
    }>;
  } | undefined;

  if (!metatypesModule) return null;

  const metatype = metatypesModule.metatypes.find(
    (m) => m.id.toLowerCase() === metatypeId.toLowerCase()
  );

  if (!metatype) return null;

  // Convert to consistent format
  const limits: Record<string, { min: number; max: number }> = {};
  for (const [attrId, value] of Object.entries(metatype.attributes)) {
    if ("min" in value && "max" in value) {
      limits[attrId] = { min: value.min, max: value.max };
    }
  }

  return limits;
}

/**
 * Get maximum attribute rating for a character based on metatype limits
 *
 * @param character - Character to check
 * @param attributeId - Attribute ID (e.g., "bod", "agi")
 * @param ruleset - Merged ruleset
 * @returns Maximum rating allowed
 */
export function getAttributeMaximum(
  character: Character,
  attributeId: string,
  ruleset: MergedRuleset
): number {
  const limits = getMetatypeAttributeLimits(character.metatype, ruleset);
  if (!limits || !limits[attributeId]) {
    // Default to 6 if no limits found
    return 6;
  }
  return limits[attributeId].max;
}

/**
 * Validate attribute advancement (rating within limits, sufficient karma)
 *
 * @param character - Character to validate
 * @param attributeId - Attribute ID to advance
 * @param newRating - Target rating
 * @param ruleset - Merged ruleset
 * @param downtimePeriodId - Optional downtime period ID for limit validation
 * @param campaignEvents - Optional campaign events for downtime validation
 * @returns Validation result
 */
export function validateAttributeAdvancement(
  character: Character,
  attributeId: string,
  newRating: number,
  ruleset: MergedRuleset,
  downtimePeriodId?: string,
  campaignEvents?: CampaignEvent[]
): AdvancementValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];

  // Get current rating
  const currentRating = character.attributes[attributeId] || 0;

  // Validate new rating is higher than current
  if (newRating <= currentRating) {
    errors.push({
      message: `New rating (${newRating}) must be higher than current rating (${currentRating})`,
      field: "rating",
    });
  }

  // Validate rating is within metatype limits
  const maxRating = getAttributeMaximum(character, attributeId, ruleset);
  if (newRating > maxRating) {
    errors.push({
      message: `Rating ${newRating} exceeds maximum for this metatype (${maxRating})`,
      field: "rating",
    });
  }

  // Validate rating is at least 1
  if (newRating < 1) {
    errors.push({
      message: "Rating must be at least 1",
      field: "rating",
    });
  }

  // Validate downtime limits if downtime period is provided
  if (downtimePeriodId && campaignEvents) {
    const downtimeLimitCheck = validateDowntimeLimits(
      character,
      downtimePeriodId,
      "attribute"
    );
    if (!downtimeLimitCheck.valid) {
      errors.push({
        message: downtimeLimitCheck.error || "Downtime limit exceeded",
        field: "downtime",
      });
    }
  }

  // Calculate cost and validate karma
  const cost = calculateAdvancementCost("attribute", newRating);
  const karmaCheck = validateKarmaAvailability(character, cost);
  if (!karmaCheck.valid) {
    errors.push({
      message: karmaCheck.error || "Not enough karma",
      field: "karma",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    cost: errors.length === 0 ? cost : undefined,
  };
}

/**
 * Get maximum skill rating for a character
 * Base maximum is 6, 7 if character has Aptitude quality for this skill
 * During advancement (post-creation), maximum is 12 (13 with Aptitude)
 *
 * @param character - Character to check
 * @param skillId - Skill ID (for checking Aptitude specification)
 * @param ruleset - Merged ruleset (for checking Aptitude quality)
 * @returns Maximum rating allowed
 */
 
export function getSkillMaximum(
  character: Character,
  skillId: string,
  _ruleset: MergedRuleset
): number {
  void _ruleset; // Parameter kept for interface compatibility
  // Check if character has Aptitude quality for this skill
  const hasAptitude = character.positiveQualities?.some((q) => {
    const qualityId = q.qualityId || q.id;
    if (qualityId !== "aptitude") {
      return false;
    }
    // Check if specification matches (if Aptitude has a specification)
    if (q.specification) {
      return q.specification === skillId;
    }
    // If no specification, Aptitude applies to all skills (but typically it requires one)
    // For now, we'll require specification match to be safe
    return false;
  });

  // During advancement (post-creation), max is 12 (13 with Aptitude)
  return hasAptitude ? 13 : 12;
}

/**
 * Validate skill advancement (rating within limits, sufficient karma)
 *
 * @param character - Character to validate
 * @param skillId - Skill ID to advance
 * @param newRating - Target rating
 * @param ruleset - Merged ruleset
 * @param downtimePeriodId - Optional downtime period ID for limit validation
 * @param campaignEvents - Optional campaign events for downtime validation
 * @returns Validation result
 */
export function validateSkillAdvancement(
  character: Character,
  skillId: string,
  newRating: number,
  ruleset: MergedRuleset,
  downtimePeriodId?: string,
  campaignEvents?: CampaignEvent[]
): AdvancementValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];

  // Get current rating
  const currentRating = character.skills[skillId] || 0;

  // Validate new rating is higher than current
  if (newRating <= currentRating) {
    errors.push({
      message: `New rating (${newRating}) must be higher than current rating (${currentRating})`,
      field: "rating",
    });
  }

  // Validate rating is within maximum limits
  const maxRating = getSkillMaximum(character, skillId, ruleset);
  if (newRating > maxRating) {
    errors.push({
      message: `Rating ${newRating} exceeds maximum for skills (${maxRating})`,
      field: "rating",
    });
  }

  // Validate rating is at least 1
  if (newRating < 1) {
    errors.push({
      message: "Rating must be at least 1",
      field: "rating",
    });
  }

  // Validate downtime limits if downtime period is provided
  if (downtimePeriodId && campaignEvents) {
    const downtimeLimitCheck = validateDowntimeLimits(
      character,
      downtimePeriodId,
      "skill"
    );
    if (!downtimeLimitCheck.valid) {
      errors.push({
        message: downtimeLimitCheck.error || "Downtime limit exceeded",
        field: "downtime",
      });
    }
  }

  // Calculate cost and validate karma
  const cost = calculateAdvancementCost("skill", newRating);
  const karmaCheck = validateKarmaAvailability(character, cost);
  if (!karmaCheck.valid) {
    errors.push({
      message: karmaCheck.error || "Not enough karma",
      field: "karma",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    cost: errors.length === 0 ? cost : undefined,
  };
}

/**
 * Validate specialization learning (requires skill rating 4+)
 *
 * @param character - Character to validate
 * @param skillId - Skill ID for specialization
 * @param _ruleset - Merged ruleset (currently unused, kept for interface compatibility)
 * @returns Validation result
 */
export function validateSpecializationAdvancement(
  character: Character,
  skillId: string,
  _ruleset: MergedRuleset
): AdvancementValidationResult {
  void _ruleset; // Parameter kept for interface compatibility
  const errors: Array<{ message: string; field?: string }> = [];

  // Get current skill rating
  const currentRating = character.skills[skillId] || 0;

  // Validate skill rating is at least 4
  if (currentRating < 4) {
    errors.push({
      message: `Skill rating must be at least 4 to learn specializations (current: ${currentRating})`,
      field: "skillRating",
    });
  }

  // Calculate cost and validate karma
  const cost = calculateAdvancementCost("specialization");
  const karmaCheck = validateKarmaAvailability(character, cost);
  if (!karmaCheck.valid) {
    errors.push({
      message: karmaCheck.error || "Not enough karma",
      field: "karma",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    cost: errors.length === 0 ? cost : undefined,
  };
}

/**
 * Validate character is not a draft (draft characters cannot advance)
 *
 * @param character - Character to validate
 * @returns Validation result
 */
export function validateCharacterNotDraft(
  character: Character
): { valid: boolean; error?: string } {
  if (character.status === "draft") {
    return {
      valid: false,
      error: "Cannot advance during character creation",
    };
  }
  return { valid: true };
}

/**
 * General advancement validation (combines common checks)
 *
 * @param character - Character to validate
 * @param type - Type of advancement
 * @param cost - Karma cost
 * @returns Validation result
 */
export function validateAdvancement(
  character: Character,
  type: AdvancementType,
  cost: number
): AdvancementValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];

  // Check character is not a draft
  const draftCheck = validateCharacterNotDraft(character);
  if (!draftCheck.valid) {
    errors.push({
      message: draftCheck.error || "Cannot advance during character creation",
      field: "character",
    });
  }

  // Validate karma availability
  const karmaCheck = validateKarmaAvailability(character, cost);
  if (!karmaCheck.valid) {
    errors.push({
      message: karmaCheck.error || "Not enough karma",
      field: "karma",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    cost: errors.length === 0 ? cost : undefined,
  };
}

