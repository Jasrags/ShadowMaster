/**
 * Rigger Command Console (RCC) Validator
 *
 * Validates RCC configuration and drone slaving limits.
 * RCC allows remote control of drones and sharing autosofts.
 *
 * SR5 Core Rulebook p. 265-269
 */

import type {
  Character,
  CharacterRCC,
  CharacterDrone,
  CharacterAutosoft,
} from "@/lib/types/character";
import type {
  RCCConfiguration,
  RiggingValidationError,
  RiggingValidationWarning,
  RunningAutosoft,
} from "@/lib/types/rigging";
import { DRONE_SLAVE_LIMIT_MULTIPLIER } from "@/lib/types/rigging";

// =============================================================================
// VALIDATION RESULT TYPES
// =============================================================================

export interface RCCValidationResult {
  valid: boolean;
  errors: RiggingValidationError[];
  warnings: RiggingValidationWarning[];
  maxDrones: number;
  currentDrones: number;
  noiseReduction: number;
  dataProcessing: number;
  firewall: number;
}

export interface DroneSlaveValidationResult {
  valid: boolean;
  errors: RiggingValidationError[];
  warnings: RiggingValidationWarning[];
  currentCount: number;
  maxCount: number;
  remainingSlots: number;
}

export interface AutosoftValidationResult {
  valid: boolean;
  errors: RiggingValidationError[];
  warnings: RiggingValidationWarning[];
}

// =============================================================================
// RCC CALCULATIONS
// =============================================================================

/**
 * Calculate maximum slaved drones for RCC
 * Formula: Data Processing × 3
 */
export function calculateMaxSlavedDrones(dataProcessing: number): number {
  return dataProcessing * DRONE_SLAVE_LIMIT_MULTIPLIER;
}

/**
 * Calculate noise reduction from RCC
 * RCC provides noise reduction equal to its device rating
 */
export function calculateNoiseReduction(deviceRating: number): number {
  return deviceRating;
}

/**
 * Calculate sharing bonus from RCC
 * Slaved drones can use the RCC's Firewall instead of their own Device Rating
 */
export function calculateSharingBonus(firewall: number): number {
  return firewall;
}

// =============================================================================
// RCC DETECTION & RETRIEVAL
// =============================================================================

/**
 * Check if character has an RCC
 */
export function hasRCC(character: Character): boolean {
  return !!character.rccs && character.rccs.length > 0;
}

/**
 * Get active RCC from character (first one if multiple)
 */
export function getActiveRCC(character: Character): CharacterRCC | null {
  if (!character.rccs || character.rccs.length === 0) {
    return null;
  }
  return character.rccs[0];
}

/**
 * Build RCC configuration from character RCC
 * Note: runningAutosofts are just IDs - caller should resolve from character's autosofts
 */
export function buildRCCConfiguration(
  rcc: CharacterRCC,
  autosofts?: CharacterAutosoft[]
): RCCConfiguration {
  // Resolve running autosoft IDs to full autosoft data
  const runningAutosoftIds = rcc.runningAutosofts ?? [];
  const runningAutosofts: RunningAutosoft[] = runningAutosoftIds
    .map((autosoftId) => {
      // Find the autosoft in character's owned autosofts
      const autosoft = autosofts?.find(
        (a) => a.id === autosoftId || a.catalogId === autosoftId
      );
      if (!autosoft) {
        // Return placeholder if not found
        return {
          autosoftId,
          name: autosoftId,
          rating: 1,
          category: "perception" as const,
          target: undefined,
        };
      }
      return {
        autosoftId: autosoft.catalogId,
        name: autosoft.name,
        rating: autosoft.rating,
        category: autosoft.category,
        target: autosoft.target,
      };
    });

  return {
    rccId: rcc.catalogId,
    name: rcc.customName ?? rcc.name,
    deviceRating: rcc.deviceRating,
    dataProcessing: rcc.dataProcessing,
    firewall: rcc.firewall,
    maxSlavedDrones: calculateMaxSlavedDrones(rcc.dataProcessing),
    slavedDroneIds: [],
    runningAutosofts,
    noiseReduction: calculateNoiseReduction(rcc.deviceRating),
    sharingBonus: calculateSharingBonus(rcc.firewall),
  };
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate RCC configuration
 */
export function validateRCCConfig(
  rcc: CharacterRCC,
  slavedDroneCount: number
): RCCValidationResult {
  const { deviceRating, dataProcessing, firewall } = rcc;
  const errors: RiggingValidationError[] = [];
  const warnings: RiggingValidationWarning[] = [];

  const maxDrones = calculateMaxSlavedDrones(dataProcessing);

  // Validate device rating
  if (deviceRating < 1 || deviceRating > 6) {
    warnings.push({
      code: "INVALID_DEVICE_RATING",
      message: `Device rating ${deviceRating} is unusual (expected 1-6)`,
      field: "deviceRating",
    });
  }

  // Validate data processing
  if (dataProcessing < 1) {
    errors.push({
      code: "INVALID_DATA_PROCESSING",
      message: "Data Processing must be at least 1",
      field: "dataProcessing",
    });
  }

  // Validate firewall
  if (firewall < 1) {
    errors.push({
      code: "INVALID_FIREWALL",
      message: "Firewall must be at least 1",
      field: "firewall",
    });
  }

  // Check drone slave limit
  if (slavedDroneCount > maxDrones) {
    errors.push({
      code: "EXCEEDED_SLAVE_LIMIT",
      message: `Cannot slave ${slavedDroneCount} drones; maximum is ${maxDrones} (DP ${dataProcessing} × 3)`,
      field: "slavedDrones",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    maxDrones,
    currentDrones: slavedDroneCount,
    noiseReduction: calculateNoiseReduction(deviceRating),
    dataProcessing,
    firewall,
  };
}

/**
 * Validate drone slaving to RCC
 */
export function validateDroneSlaving(
  dataProcessing: number,
  currentSlavedIds: string[],
  droneToSlaveId: string
): DroneSlaveValidationResult {
  const errors: RiggingValidationError[] = [];
  const warnings: RiggingValidationWarning[] = [];

  const maxDrones = calculateMaxSlavedDrones(dataProcessing);
  const currentCount = currentSlavedIds.length;

  // Check if already slaved
  if (currentSlavedIds.includes(droneToSlaveId)) {
    warnings.push({
      code: "ALREADY_SLAVED",
      message: "Drone is already slaved to this RCC",
      field: "droneId",
    });
  }

  // Check capacity
  if (currentCount >= maxDrones) {
    errors.push({
      code: "SLAVE_LIMIT_REACHED",
      message: `Cannot slave more drones; limit is ${maxDrones} (DP ${dataProcessing} × 3)`,
      field: "slavedDrones",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    currentCount,
    maxCount: maxDrones,
    remainingSlots: Math.max(0, maxDrones - currentCount),
  };
}

/**
 * Validate that an autosoft can run on RCC
 * Autosofts running on RCC are shared to all slaved drones
 */
export function validateAutosoftOnRCC(
  autosoft: CharacterAutosoft,
  deviceRating: number
): AutosoftValidationResult {
  const errors: RiggingValidationError[] = [];
  const warnings: RiggingValidationWarning[] = [];

  // Check if autosoft rating exceeds device rating
  if (autosoft.rating > deviceRating) {
    errors.push({
      code: "RATING_EXCEEDS_DEVICE",
      message: `Autosoft rating ${autosoft.rating} cannot exceed device rating ${deviceRating}`,
      field: "rating",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// DRONE OWNERSHIP HELPERS
// =============================================================================

/**
 * Get all owned drones for a character
 */
export function getOwnedDrones(character: Character): CharacterDrone[] {
  return character.drones ?? [];
}

/**
 * Get all owned autosofts for a character
 */
export function getOwnedAutosofts(character: Character): CharacterAutosoft[] {
  return character.autosofts ?? [];
}

/**
 * Check if a drone exists in character's inventory
 * Checks both id and catalogId fields
 */
export function hasDrone(character: Character, droneId: string): boolean {
  const drones = getOwnedDrones(character);
  return drones.some((d) => d.id === droneId || d.catalogId === droneId);
}

/**
 * Check if an autosoft exists in character's inventory
 * Checks both id and catalogId fields
 */
export function hasAutosoft(character: Character, autosoftId: string): boolean {
  const autosofts = getOwnedAutosofts(character);
  return autosofts.some((a) => a.id === autosoftId || a.catalogId === autosoftId);
}

// =============================================================================
// RCC CAPABILITY CHECKS
// =============================================================================

/**
 * Check if RCC can support remote vehicle control
 * RCC always supports remote control of slaved drones
 */
export function canRemoteControl(
  _dataProcessing: number,
  slavedDroneCount: number
): boolean {
  return slavedDroneCount > 0;
}

/**
 * Get effective firewall for a slaved drone
 * Slaved drones use the higher of their Device Rating or RCC's Firewall
 */
export function getEffectiveFirewall(
  droneDeviceRating: number,
  rccFirewall: number
): number {
  return Math.max(droneDeviceRating, rccFirewall);
}

/**
 * Check if RCC is at capacity
 */
export function isRCCAtCapacity(
  dataProcessing: number,
  slavedDroneCount: number
): boolean {
  const maxDrones = calculateMaxSlavedDrones(dataProcessing);
  return slavedDroneCount >= maxDrones;
}
