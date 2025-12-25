import { v4 as uuidv4 } from "uuid";
import type { Character, QualitySelection, MergedRuleset, AdvancementRecord } from "@/lib/types";
import type { Quality } from "@/lib/types";
import { getQualityDefinition } from "./utils";
import { canTakeQuality, validateQualitySelection } from "./validation";
import { calculateQualityCost } from "./karma";
import { initializeDynamicState } from "./dynamic-state";

/**
 * Options for acquiring a quality post-creation
 */
export interface AcquireQualityOptions {
  rating?: number;
  specification?: string;
  specificationId?: string;
  variant?: string;
  notes?: string;
  gmApproved?: boolean;
  acquisitionDate?: string;
}

/**
 * Result of quality acquisition validation
 */
export interface AcquisitionValidationResult {
  valid: boolean;
  errors: Array<{ message: string; field?: string }>;
  cost?: number;
}

/**
 * Validate if a quality can be acquired post-creation
 */
export function validateQualityAcquisition(
  character: Character,
  qualityId: string,
  ruleset: MergedRuleset,
  options: AcquireQualityOptions = {}
): AcquisitionValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];

  // Get quality definition
  const quality = getQualityDefinition(ruleset, qualityId);
  if (!quality) {
    return {
      valid: false,
      errors: [{ message: `Quality '${qualityId}' not found in ruleset` }],
    };
  }

  // Check if character can take this quality (prerequisites, incompatibilities, limits)
  const canTake = canTakeQuality(quality, character, ruleset);
  if (!canTake.allowed) {
    return {
      valid: false,
      errors: [{ message: canTake.reason || "Cannot acquire this quality" }],
    };
  }

  // Validate selection structure (rating, specification, etc.)
  const selection: QualitySelection = {
    qualityId,
    rating: options.rating,
    specification: options.specification,
    specificationId: options.specificationId,
    variant: options.variant,
    source: "advancement",
  };

  const selectionValidation = validateQualitySelection(selection, quality, character);
  if (!selectionValidation.valid) {
    return {
      valid: false,
      errors: selectionValidation.errors,
    };
  }

  // Check if character has enough karma
  const cost = calculatePostCreationCost(quality, options.rating);
  if (character.karmaCurrent < cost) {
    errors.push({
      message: `Not enough karma. Need ${cost}, have ${character.karmaCurrent}`,
      field: "karma",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    cost,
  };
}

/**
 * Calculate post-creation cost for a quality (2× normal cost)
 */
export function calculatePostCreationCost(quality: Quality, rating?: number): number {
  return calculateQualityCost(quality, rating, true); // isPostCreation = true
}

/**
 * Acquire a quality post-creation
 *
 * This function creates the quality selection but does NOT update the character.
 * The caller is responsible for updating the character and spending karma.
 */
export function acquireQuality(
  character: Character,
  qualityId: string,
  ruleset: MergedRuleset,
  options: AcquireQualityOptions = {}
): {
  selection: QualitySelection;
  cost: number;
  updatedCharacter: Character;
  quality: Quality;
  advancementRecord: AdvancementRecord;
} {
  // Validate acquisition
  const validation = validateQualityAcquisition(character, qualityId, ruleset, options);
  if (!validation.valid) {
    throw new Error(
      `Cannot acquire quality: ${validation.errors.map((e) => e.message).join(", ")}`
    );
  }

  if (!validation.cost) {
    throw new Error("Cost calculation failed");
  }

  // Check karma
  if (character.karmaCurrent < validation.cost) {
    throw new Error(
      `Not enough karma. Need ${validation.cost}, have ${character.karmaCurrent}`
    );
  }

  // Get quality definition
  const quality = getQualityDefinition(ruleset, qualityId);
  if (!quality) {
    throw new Error(`Quality '${qualityId}' not found`);
  }

  // Create quality selection
  const selection: QualitySelection = {
    qualityId,
    rating: options.rating,
    specification: options.specification,
    specificationId: options.specificationId,
    variant: options.variant,
    source: "advancement",
    acquisitionDate: options.acquisitionDate || new Date().toISOString(),
    originalKarma: validation.cost, // Store the cost paid (2× rate)
    notes: options.notes,
    gmApproved: options.gmApproved,
    active: true,
  };

  // Initialize dynamic state if needed
  if (quality.dynamicState) {
    const dynamicState = initializeDynamicState(quality, selection);
    if (dynamicState) {
      selection.dynamicState = dynamicState;
    }
  }

  // Create advancement record
  const now = new Date().toISOString();
  const advancementRecord: AdvancementRecord = {
    id: uuidv4(),
    type: "quality",
    targetId: quality.id,
    targetName: quality.name,
    newValue: selection.rating || 1,
    karmaCost: validation.cost,
    karmaSpentAt: now,
    trainingRequired: false,
    trainingStatus: "completed",
    gmApproved: options.gmApproved || false,
    notes: options.notes,
    createdAt: now,
    completedAt: now,
  };

  // Add to appropriate quality list
  const updatedCharacter: Character = {
    ...character,
    karmaCurrent: character.karmaCurrent - validation.cost,
    karmaTotal: character.karmaTotal,
    advancementHistory: [
      ...(character.advancementHistory || []),
      advancementRecord,
    ],
  };

  if (quality.type === "positive") {
    updatedCharacter.positiveQualities = [
      ...(character.positiveQualities || []),
      selection,
    ];
  } else {
    updatedCharacter.negativeQualities = [
      ...(character.negativeQualities || []),
      selection,
    ];
  }

  return {
    selection,
    cost: validation.cost,
    updatedCharacter,
    quality,
    advancementRecord,
  };
}

/**
 * Result of quality removal validation
 */
export interface RemovalValidationResult {
  valid: boolean;
  errors: Array<{ message: string; field?: string }>;
  cost?: number;
}

/**
 * Validate if a quality can be removed (bought off)
 */
export function validateQualityRemoval(
  character: Character,
  qualityId: string,
  ruleset: MergedRuleset
): RemovalValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];

  // Find the quality selection
  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  const selection = allQualities.find(
    (q) => (q.qualityId || q.id)?.toLowerCase() === qualityId.toLowerCase()
  );

  if (!selection) {
    return {
      valid: false,
      errors: [{ message: `Quality '${qualityId}' not found on character` }],
    };
  }

  // Get quality definition
  const quality = getQualityDefinition(ruleset, qualityId);
  if (!quality) {
    return {
      valid: false,
      errors: [{ message: `Quality '${qualityId}' not found in ruleset` }],
    };
  }

  // Can only buy off negative qualities
  if (quality.type === "positive") {
    return {
      valid: false,
      errors: [{ message: "Cannot buy off positive qualities" }],
    };
  }

  // Calculate buy-off cost (2× original karma bonus)
  const cost = calculateBuyOffCost(quality, selection.originalKarma);

  // Check if character has enough karma
  if (character.karmaCurrent < cost) {
    errors.push({
      message: `Not enough karma to buy off. Need ${cost}, have ${character.karmaCurrent}`,
      field: "karma",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    cost,
  };
}

/**
 * Calculate buy-off cost for a negative quality (2× original karma bonus)
 */
export function calculateBuyOffCost(
  quality: Quality,
  originalKarma?: number
): number {
  // If we have the original karma value, use that
  if (originalKarma !== undefined && originalKarma !== null) {
    return Math.abs(originalKarma) * 2;
  }

  // Otherwise calculate from quality definition
  // For negative qualities, karmaBonus is positive (karma gained)
  const baseBonus = quality.karmaBonus || 0;
  return Math.abs(baseBonus) * 2;
}

/**
 * Remove a quality (buy off)
 *
 * This function removes the quality selection but does NOT update the character.
 * The caller is responsible for updating the character and spending karma.
 */
export function removeQuality(
  character: Character,
  qualityId: string,
  ruleset: MergedRuleset,
  _reason?: string
): {
  cost: number;
  updatedCharacter: Character;
  quality: Quality;
  advancementRecord: AdvancementRecord;
} {
  void _reason; // Parameter kept for interface compatibility
  // Validate removal
  const validation = validateQualityRemoval(character, qualityId, ruleset);
  if (!validation.valid) {
    throw new Error(
      `Cannot remove quality: ${validation.errors.map((e) => e.message).join(", ")}`
    );
  }

  if (!validation.cost) {
    throw new Error("Cost calculation failed");
  }

  // Check karma
  if (character.karmaCurrent < validation.cost) {
    throw new Error(
      `Not enough karma. Need ${validation.cost}, have ${character.karmaCurrent}`
    );
  }

  // Get quality definition
  const quality = getQualityDefinition(ruleset, qualityId);
  if (!quality) {
    throw new Error(`Quality '${qualityId}' not found`);
  }

  // Create advancement record for removal
  const now = new Date().toISOString();
  const advancementRecord: AdvancementRecord = {
    id: uuidv4(),
    type: "quality",
    targetId: quality.id,
    targetName: `${quality.name} (Removed)`,
    newValue: 0,
    karmaCost: validation.cost,
    karmaSpentAt: now,
    trainingRequired: false,
    trainingStatus: "completed",
    gmApproved: true, // Buy-off is usually approved if karma is spent
    notes: _reason,
    createdAt: now,
    completedAt: now,
  };

  // Find and remove the quality selection
  const updatedCharacter: Character = {
    ...character,
    karmaCurrent: character.karmaCurrent - validation.cost,
    advancementHistory: [
      ...(character.advancementHistory || []),
      advancementRecord,
    ],
  };

  if (quality.type === "positive") {
    updatedCharacter.positiveQualities = (
      character.positiveQualities || []
    ).filter(
      (q) => (q.qualityId || q.id)?.toLowerCase() !== qualityId.toLowerCase()
    );
  } else {
    updatedCharacter.negativeQualities = (
      character.negativeQualities || []
    ).filter(
      (q) => (q.qualityId || q.id)?.toLowerCase() !== qualityId.toLowerCase()
    );
  }

  return {
    cost: validation.cost,
    updatedCharacter,
    quality,
    advancementRecord,
  };
}

