/**
 * Karma cost calculations for character advancement
 *
 * Implements the karma cost formulas for various advancement types
 * as documented in Shadowrun 5e rules.
 */

import type { AdvancementType } from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";
import type { AdvancementRulesData } from "@/lib/rules/loader-types";

/**
 * Calculate karma cost to advance an attribute
 * Cost: new rating × multiplier
 *
 * @param newRating - The target rating (after advancement)
 * @param settings - Optional campaign settings (overrides ruleset)
 * @param ruleset - Optional ruleset defaults
 * @returns Karma cost
 */
export function calculateAttributeCost(
  newRating: number,
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  if (newRating < 1) {
    throw new Error("Attribute rating must be at least 1");
  }
  const multiplier =
    settings?.attributeKarmaMultiplier ?? ruleset?.attributeKarmaMultiplier ?? 5;
  return newRating * multiplier;
}

/**
 * Calculate karma cost to advance an active skill
 * Cost: new rating × multiplier
 *
 * @param newRating - The target rating (after advancement)
 * @param settings - Optional campaign settings (overrides ruleset)
 * @param ruleset - Optional ruleset defaults
 * @returns Karma cost
 */
export function calculateActiveSkillCost(
  newRating: number,
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  if (newRating < 1) {
    throw new Error("Skill rating must be at least 1");
  }
  const multiplier =
    settings?.skillKarmaMultiplier ?? ruleset?.skillKarmaMultiplier ?? 2;
  return newRating * multiplier;
}

/**
 * Calculate karma cost to advance a knowledge or language skill
 * Cost: new rating × multiplier
 *
 * @param newRating - The target rating (after advancement)
 * @param settings - Optional campaign settings (overrides ruleset)
 * @param ruleset - Optional ruleset defaults
 * @returns Karma cost
 */
export function calculateKnowledgeSkillCost(
  newRating: number,
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  if (newRating < 1) {
    throw new Error("Skill rating must be at least 1");
  }
  const multiplier =
    settings?.knowledgeSkillKarmaMultiplier ??
    ruleset?.knowledgeSkillKarmaMultiplier ??
    1;
  return newRating * multiplier;
}

/**
 * Calculate karma cost to advance a skill group
 * Cost: new rating × multiplier
 *
 * @param newRating - The target rating (after advancement)
 * @param settings - Optional campaign settings (overrides ruleset)
 * @param ruleset - Optional ruleset defaults
 * @returns Karma cost
 */
export function calculateSkillGroupCost(
  newRating: number,
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  if (newRating < 1) {
    throw new Error("Skill group rating must be at least 1");
  }
  const multiplier =
    settings?.skillGroupKarmaMultiplier ?? ruleset?.skillGroupKarmaMultiplier ?? 5;
  return newRating * multiplier;
}

/**
 * Calculate karma cost for a specialization
 *
 * @param settings - Optional campaign settings (overrides ruleset)
 * @param ruleset - Optional ruleset defaults
 * @returns Karma cost
 */
export function calculateSpecializationCost(
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  return settings?.specializationKarmaCost ?? ruleset?.specializationKarmaCost ?? 7;
}

/**
 * Calculate karma cost to advance Edge
 * Cost: new rating × multiplier
 *
 * @param newRating - The target rating (after advancement)
 * @param settings - Optional campaign settings (overrides ruleset)
 * @param ruleset - Optional ruleset defaults
 * @returns Karma cost
 */
export function calculateEdgeCost(
  newRating: number,
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  if (newRating < 1) {
    throw new Error("Edge rating must be at least 1");
  }
  const multiplier =
    settings?.attributeKarmaMultiplier ?? ruleset?.attributeKarmaMultiplier ?? 5;
  return newRating * multiplier;
}

/**
 * Calculate karma cost for a new knowledge or language skill
 * Cost: 1 karma (fixed in SR5, but could be configurable)
 *
 * @returns Karma cost
 */
export function calculateNewKnowledgeSkillCost(): number {
  return 1;
}

/**
 * Calculate karma cost for learning a new spell, ritual, or preparation
 *
 * @param settings - Optional campaign settings (overrides ruleset)
 * @param ruleset - Optional ruleset defaults
 * @returns Karma cost
 */
export function calculateSpellCost(
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  return settings?.spellKarmaCost ?? ruleset?.spellKarmaCost ?? 5;
}

/**
 * Calculate karma cost for learning a new complex form
 *
 * @param settings - Optional campaign settings (overrides ruleset)
 * @param ruleset - Optional ruleset defaults
 * @returns Karma cost
 */
export function calculateComplexFormCost(
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  return settings?.complexFormKarmaCost ?? ruleset?.complexFormKarmaCost ?? 4;
}

/**
 * Calculate karma cost based on advancement type
 *
 * @param type - Type of advancement
 * @param newRating - New rating/value (for rated advancements)
 * @param settings - Optional campaign settings (overrides ruleset)
 * @param ruleset - Optional ruleset defaults
 * @returns Karma cost
 */
export function calculateAdvancementCost(
  type: AdvancementType,
  newRating?: number,
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  switch (type) {
    case "attribute":
    case "edge":
      if (newRating === undefined) {
        throw new Error("Rating required for attribute/edge advancement");
      }
      return calculateAttributeCost(newRating, settings, ruleset);

    case "skill":
      if (newRating === undefined) {
        throw new Error("Rating required for skill advancement");
      }
      return calculateActiveSkillCost(newRating, settings);

    case "skillGroup":
      if (newRating === undefined) {
        throw new Error("Rating required for skill group advancement");
      }
      return calculateSkillGroupCost(newRating, settings);

    case "knowledgeSkill":
    case "languageSkill":
      if (newRating === undefined) {
        throw new Error("Rating required for knowledge/language skill advancement");
      }
      return calculateKnowledgeSkillCost(newRating, settings);

    case "specialization":
      return calculateSpecializationCost(settings);

    case "spell":
    case "ritual":
      return calculateSpellCost(settings);

    case "complexForm":
      return calculateComplexFormCost(settings);

    case "focus":
      // Focus bonding cost varies by type - this is a placeholder
      // Actual implementation will need focus type information
      throw new Error("Focus bonding cost calculation requires focus type");

    case "initiation":
      // Initiation cost: 10 + (grade × 3) - requires grade information
      throw new Error("Initiation cost calculation requires grade");

    case "quality":
      // Quality costs handled separately in quality advancement module
      throw new Error("Quality costs are handled by quality advancement module");

    default:
      throw new Error(`Unknown advancement type: ${type}`);
  }
}

