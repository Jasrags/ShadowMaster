/**
 * Quality validation functions
 *
 * Functions for validating quality prerequisites, incompatibilities, and selections.
 */

import type { Character, QualitySelection } from "@/lib/types";
import type { Quality, MergedRuleset } from "@/lib/types";
import {
  getQualityDefinition,
  characterHasQuality,
  countQualityInstances,
  getAllQualityIds,
} from "./utils";

/**
 * Result of prerequisite validation
 */
export interface PrerequisiteValidationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Validate all prerequisites for a quality
 */
export function validatePrerequisites(
  quality: Quality,
  character: Character,
  _ruleset: MergedRuleset
): PrerequisiteValidationResult {
  const prerequisites = quality.prerequisites;
  if (!prerequisites) {
    return { allowed: true };
  }

  // Check metatype restrictions
  if (prerequisites.metatypes && prerequisites.metatypes.length > 0) {
    if (!character.metatype || !prerequisites.metatypes.includes(character.metatype)) {
      return {
        allowed: false,
        reason: `Requires metatype: ${prerequisites.metatypes.join(", ")}`,
      };
    }
  }

  // Check excluded metatypes
  if (prerequisites.metatypesExcluded?.includes(character.metatype || "")) {
    return {
      allowed: false,
      reason: `Not available to ${character.metatype}`,
    };
  }

  // Check magic requirements
  if (prerequisites.hasMagic) {
    if (!character.specialAttributes?.magic) {
      return {
        allowed: false,
        reason: "Requires Magic attribute",
      };
    }
  }

  // Check resonance requirements
  if (prerequisites.hasResonance) {
    if (!character.specialAttributes?.resonance) {
      return {
        allowed: false,
        reason: "Requires Resonance attribute",
      };
    }
  }

  // Check attribute requirements
  if (prerequisites.attributes) {
    for (const [attrId, req] of Object.entries(prerequisites.attributes)) {
      const currentValue = character.attributes?.[attrId] || 0;
      if (req.min !== undefined && currentValue < req.min) {
        return {
          allowed: false,
          reason: `Requires ${attrId} ${req.min}+ (current: ${currentValue})`,
        };
      }
      if (req.max !== undefined && currentValue > req.max) {
        return {
          allowed: false,
          reason: `Requires ${attrId} ≤${req.max} (current: ${currentValue})`,
        };
      }
    }
  }

  // Check skill requirements
  if (prerequisites.skills) {
    for (const [skillId, req] of Object.entries(prerequisites.skills)) {
      const currentRating = character.skills?.[skillId] || 0;
      if (req.min !== undefined && currentRating < req.min) {
        return {
          allowed: false,
          reason: `Requires ${skillId} skill ${req.min}+ (current: ${currentRating})`,
        };
      }
    }
  }

  // Check magical path restrictions
  if (prerequisites.magicalPaths && prerequisites.magicalPaths.length > 0) {
    if (!prerequisites.magicalPaths.includes(character.magicalPath)) {
      return {
        allowed: false,
        reason: `Requires magical path: ${prerequisites.magicalPaths.join(", ")}`,
      };
    }
  }

  // Check excluded magical paths
  if (prerequisites.magicalPathsExcluded?.includes(character.magicalPath)) {
    return {
      allowed: false,
      reason: `Not available to ${character.magicalPath}`,
    };
  }

  // Check required qualities (must have all)
  if (prerequisites.requiredQualities && prerequisites.requiredQualities.length > 0) {
    for (const reqQuality of prerequisites.requiredQualities) {
      if (!characterHasQuality(character, reqQuality)) {
        return {
          allowed: false,
          reason: `Requires quality: ${reqQuality}`,
        };
      }
    }
  }

  // Check required any qualities (must have at least one)
  if (
    prerequisites.requiredAnyQualities &&
    prerequisites.requiredAnyQualities.length > 0
  ) {
    const hasAny = prerequisites.requiredAnyQualities.some((reqQuality) =>
      characterHasQuality(character, reqQuality)
    );
    if (!hasAny) {
      return {
        allowed: false,
        reason: `Requires at least one of: ${prerequisites.requiredAnyQualities.join(", ")}`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Check for incompatible qualities
 */
export function checkIncompatibilities(
  quality: Quality,
  character: Character
): PrerequisiteValidationResult {
  if (!quality.incompatibilities || quality.incompatibilities.length === 0) {
    return { allowed: true };
  }

  const characterQualityIds = getAllQualityIds(character);

  for (const incompatibleId of quality.incompatibilities) {
    if (
      characterQualityIds.some(
        (id) => id.toLowerCase() === incompatibleId.toLowerCase()
      )
    ) {
      return {
        allowed: false,
        reason: `Incompatible with: ${incompatibleId}`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Check if a quality can be taken (prerequisites + incompatibilities + limits)
 */
export function canTakeQuality(
  quality: Quality,
  character: Character,
  ruleset: MergedRuleset,
  options?: { skipLimitCheck?: boolean }
): PrerequisiteValidationResult {
  // Check prerequisites
  const prerequisiteCheck = validatePrerequisites(quality, character, ruleset);
  if (!prerequisiteCheck.allowed) {
    return prerequisiteCheck;
  }

  // Check incompatibilities
  const incompatibilityCheck = checkIncompatibilities(quality, character);
  if (!incompatibilityCheck.allowed) {
    return incompatibilityCheck;
  }

  // Check quality limit (how many times it can be taken)
  // Skip this check when validating existing qualities
  if (!options?.skipLimitCheck) {
    const currentCount = countQualityInstances(character, quality.id);
    const limit = quality.limit || 1;
    if (currentCount >= limit) {
      return {
        allowed: false,
        reason: `Already have maximum instances (${limit})`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Validate a quality selection (rating, specification, etc.)
 */
export function validateQualitySelection(
  selection: QualitySelection,
  quality: Quality,
  _character: Character
): {
  valid: boolean;
  errors: Array<{ message: string; field?: string }>;
} {
  const errors: Array<{ message: string; field?: string }> = [];

  // Validate rating if quality has levels
  if (quality.levels && quality.levels.length > 0) {
    if (selection.rating === undefined || selection.rating === null) {
      errors.push({
        message: `${quality.name} requires a rating`,
        field: "rating",
      });
    } else {
      const maxRating = quality.maxRating || quality.levels.length;
      if (selection.rating < 1 || selection.rating > maxRating) {
        errors.push({
          message: `${quality.name} rating must be 1-${maxRating}`,
          field: "rating",
        });
      }
    }
  }

  // Validate specification if required
  if (quality.requiresSpecification) {
    if (!selection.specification || selection.specification.trim() === "") {
      errors.push({
        message: `${quality.name} requires a specification`,
        field: "specification",
      });
    }
  }

  // Validate specification against options if provided
  if (
    selection.specification &&
    quality.specificationOptions &&
    quality.specificationOptions.length > 0
  ) {
    if (!quality.specificationOptions.includes(selection.specification)) {
      errors.push({
        message: `${quality.name} specification must be one of: ${quality.specificationOptions.join(", ")}`,
        field: "specification",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all qualities on a character
 */
export function validateAllQualities(
  character: Character,
  ruleset: MergedRuleset
): {
  valid: boolean;
  errors: Array<{ qualityId: string; message: string; field?: string }>;
} {
  const errors: Array<{ qualityId: string; message: string; field?: string }> = [];
  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  for (const selection of allQualities) {
    const qualityId = selection.qualityId || selection.id;
    if (!qualityId) continue;

    const quality = getQualityDefinition(ruleset, qualityId);
    if (!quality) {
      errors.push({
        qualityId,
        message: `Quality not found in ruleset: ${qualityId}`,
      });
      continue;
    }

    // Validate prerequisites (character may have changed since selection)
    // Skip limit check since this quality is already selected
    const canTake = canTakeQuality(quality, character, ruleset, { skipLimitCheck: true });
    if (!canTake.allowed) {
      errors.push({
        qualityId,
        message: canTake.reason || "Quality prerequisites not met",
      });
    }

    // Validate selection structure
    const selectionValidation = validateQualitySelection(selection, quality, character);
    for (const error of selectionValidation.errors) {
      errors.push({
        qualityId,
        message: error.message,
        field: error.field,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

