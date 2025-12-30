/**
 * Vehicle Control Rig (VCR) Validator
 *
 * Validates VCR requirements for rigging operations.
 * VCR is required for jumping into vehicles/drones.
 *
 * SR5 Core Rulebook p. 452
 */

import type { Character, CyberwareItem } from "@/lib/types/character";
import type {
  VehicleControlRig,
  RiggerVRMode,
  RiggingValidationError,
  RiggingValidationWarning,
} from "@/lib/types/rigging";
import {
  JUMPED_IN_INITIATIVE_BONUS,
  JUMPED_IN_HOTSIM_INITIATIVE_BONUS,
} from "@/lib/types/rigging";

// =============================================================================
// CONSTANTS
// =============================================================================

/** VCR catalog IDs that match Vehicle Control Rig */
const VCR_CATALOG_PATTERNS = [
  "vehicle-control-rig",
  "vcr",
  "control-rig",
];

/** VCR name patterns to match */
const VCR_NAME_PATTERNS = [
  /vehicle control rig/i,
  /control rig/i,
  /vcr/i,
];

/** Essence cost per VCR rating */
const VCR_ESSENCE_COSTS: Record<number, number> = {
  1: 1.0,
  2: 2.0,
  3: 3.0,
};

// =============================================================================
// VALIDATION RESULT TYPE
// =============================================================================

export interface VCRValidationResult {
  valid: boolean;
  errors: RiggingValidationError[];
  warnings: RiggingValidationWarning[];
  vcrRating: number;
  controlBonus: number;
  initiativeBonus: number;
}

// =============================================================================
// VCR DETECTION
// =============================================================================

/**
 * Check if a cyberware item is a Vehicle Control Rig
 */
function isVCRItem(item: CyberwareItem): boolean {
  // Check catalog ID patterns
  const catalogId = item.catalogId.toLowerCase();
  if (VCR_CATALOG_PATTERNS.some((pattern) => catalogId.includes(pattern))) {
    return true;
  }

  // Check name patterns
  const name = item.name.toLowerCase();
  if (VCR_NAME_PATTERNS.some((pattern) => pattern.test(name))) {
    return true;
  }

  return false;
}

/**
 * Check if character has a valid VCR installed
 */
export function hasVehicleControlRig(character: Character): boolean {
  if (!character.cyberware || character.cyberware.length === 0) {
    return false;
  }

  return character.cyberware.some(isVCRItem);
}

/**
 * Get VCR details from character's augmentations
 */
export function getVehicleControlRig(
  character: Character
): VehicleControlRig | null {
  if (!character.cyberware || character.cyberware.length === 0) {
    return null;
  }

  const vcrItem = character.cyberware.find(isVCRItem);
  if (!vcrItem) {
    return null;
  }

  const rating = vcrItem.rating ?? 1;
  const essenceCost = vcrItem.essenceCost ?? VCR_ESSENCE_COSTS[rating] ?? 1.0;

  return {
    rating,
    controlBonus: rating, // VCR provides +Rating to vehicle tests when jumped in
    initiativeDiceBonus: rating, // Base initiative dice bonus (modified by VR mode)
    essenceCost,
    grade: vcrItem.grade,
    catalogId: vcrItem.catalogId,
  };
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate VCR requirements for jumping in
 */
export function validateJumpInRequirements(
  character: Character,
  targetType: "vehicle" | "drone"
): VCRValidationResult {
  const errors: RiggingValidationError[] = [];
  const warnings: RiggingValidationWarning[] = [];

  // Check for VCR
  const vcr = getVehicleControlRig(character);

  if (!vcr) {
    errors.push({
      code: "NO_VCR",
      message: `Cannot jump into ${targetType}: Vehicle Control Rig required`,
      field: "cyberware",
    });

    return {
      valid: false,
      errors,
      warnings,
      vcrRating: 0,
      controlBonus: 0,
      initiativeBonus: 0,
    };
  }

  // Validate VCR rating
  if (vcr.rating < 1 || vcr.rating > 3) {
    warnings.push({
      code: "INVALID_VCR_RATING",
      message: `VCR rating ${vcr.rating} is unusual (expected 1-3)`,
      field: "cyberware.rating",
    });
  }

  return {
    valid: true,
    errors,
    warnings,
    vcrRating: vcr.rating,
    controlBonus: vcr.controlBonus,
    initiativeBonus: vcr.initiativeDiceBonus,
  };
}

// =============================================================================
// BONUS CALCULATIONS
// =============================================================================

/**
 * Calculate control bonuses from VCR rating
 * Control bonus applies to all vehicle tests when jumped in
 */
export function calculateVCRControlBonus(vcrRating: number): number {
  // VCR provides +Rating to all vehicle tests when jumped in
  return Math.max(0, Math.min(3, vcrRating));
}

/**
 * Calculate initiative dice bonus based on VCR and VR mode
 *
 * SR5 p. 265:
 * - Cold-sim VR: +1D6 (same as matrix)
 * - Hot-sim VR: +2D6 (same as matrix)
 *
 * VCR adds its rating to the initiative dice bonus
 */
export function calculateVCRInitiativeBonus(
  vcrRating: number,
  vrMode: RiggerVRMode
): number {
  const baseBonus =
    vrMode === "hot-sim"
      ? JUMPED_IN_HOTSIM_INITIATIVE_BONUS
      : JUMPED_IN_INITIATIVE_BONUS;

  // VCR rating adds to initiative dice in some interpretations
  // Using standard SR5 rules: VR mode determines dice, VCR adds to initiative score
  return baseBonus;
}

/**
 * Calculate all VCR bonuses for a given VR mode
 */
export function calculateVCRBonuses(
  vcrRating: number,
  vrMode: RiggerVRMode
): { controlBonus: number; initiativeDice: number } {
  return {
    controlBonus: calculateVCRControlBonus(vcrRating),
    initiativeDice: calculateVCRInitiativeBonus(vcrRating, vrMode),
  };
}

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if character can perform rigging actions (has VCR or RCC)
 * VCR needed for jumping in, RCC needed for remote control
 */
export function canPerformRiggingActions(character: Character): boolean {
  // Check for VCR (required for jumping in)
  if (hasVehicleControlRig(character)) {
    return true;
  }

  // Check for RCC (allows remote control without VCR)
  if (character.rccs && character.rccs.length > 0) {
    return true;
  }

  // Check for drones owned (can use autopilot without VCR/RCC)
  if (character.drones && character.drones.length > 0) {
    return true;
  }

  return false;
}

/**
 * Get the maximum VCR rating from character's cyberware
 * (in case they somehow have multiple VCRs)
 */
export function getMaxVCRRating(character: Character): number {
  if (!character.cyberware || character.cyberware.length === 0) {
    return 0;
  }

  const vcrItems = character.cyberware.filter(isVCRItem);
  if (vcrItems.length === 0) {
    return 0;
  }

  return Math.max(...vcrItems.map((item) => item.rating ?? 1));
}
