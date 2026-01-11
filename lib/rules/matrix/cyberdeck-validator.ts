/**
 * Cyberdeck Validation Service
 *
 * Validates cyberdeck attribute configuration and hardware requirements.
 * Ensures ASDF assignments match the deck's attribute array.
 */

import type { Character } from "@/lib/types";
import type {
  CyberdeckAttributeConfig,
  CharacterCyberdeck,
  MatrixValidationError,
  MatrixValidationWarning,
} from "@/lib/types/matrix";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of cyberdeck validation
 */
export interface CyberdeckValidationResult {
  valid: boolean;
  errors: MatrixValidationError[];
  warnings: MatrixValidationWarning[];
  effectiveAttributes: CyberdeckAttributeConfig;
}

// =============================================================================
// ATTRIBUTE CONFIGURATION VALIDATION
// =============================================================================

/**
 * Validate that ASDF configuration uses exactly the values from the attribute array
 *
 * Cyberdecks have an attribute array like [4, 3, 2, 1] that must be assigned
 * to Attack, Sleaze, Data Processing, and Firewall. Each value must be used
 * exactly once.
 *
 * @param config - The proposed ASDF configuration
 * @param attributeArray - The deck's attribute array values
 * @returns Validation result
 */
export function validateCyberdeckConfig(
  config: CyberdeckAttributeConfig,
  attributeArray: number[]
): CyberdeckValidationResult {
  const errors: MatrixValidationError[] = [];
  const warnings: MatrixValidationWarning[] = [];

  // Extract the assigned values
  const assignedValues = [config.attack, config.sleaze, config.dataProcessing, config.firewall];

  // Sort both arrays for comparison
  const sortedAssigned = [...assignedValues].sort((a, b) => b - a);
  const sortedArray = [...attributeArray].sort((a, b) => b - a);

  // Check if the arrays have the same length
  if (sortedArray.length !== 4) {
    errors.push({
      code: "INVALID_ATTRIBUTE_ARRAY",
      message: `Attribute array must contain exactly 4 values, got ${sortedArray.length}`,
    });
    return {
      valid: false,
      errors,
      warnings,
      effectiveAttributes: config,
    };
  }

  // Check if every value in the attribute array is used exactly once
  const arrayMatch =
    sortedAssigned.length === sortedArray.length &&
    sortedAssigned.every((val, idx) => val === sortedArray[idx]);

  if (!arrayMatch) {
    errors.push({
      code: "ATTRIBUTE_MISMATCH",
      message: `Configuration values [${assignedValues.join(", ")}] do not match attribute array [${attributeArray.join(", ")}]. Each array value must be assigned to exactly one attribute.`,
      field: "attributeConfig",
    });
  }

  // Validate individual attribute bounds
  for (const [attr, value] of Object.entries(config)) {
    if (value < 0) {
      errors.push({
        code: "NEGATIVE_ATTRIBUTE",
        message: `${attr} cannot be negative`,
        field: attr,
      });
    }
    if (value > 10) {
      warnings.push({
        code: "HIGH_ATTRIBUTE",
        message: `${attr} value of ${value} is unusually high`,
        field: attr,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    effectiveAttributes: config,
  };
}

/**
 * Create a default ASDF configuration from an attribute array
 *
 * Assigns values in descending order to: Data Processing, Firewall, Sleaze, Attack
 * This is a defensive default configuration.
 *
 * @param attributeArray - The deck's attribute array
 * @returns Default configuration
 */
export function createDefaultConfig(attributeArray: number[]): CyberdeckAttributeConfig {
  // Sort descending
  const sorted = [...attributeArray].sort((a, b) => b - a);

  // Default: prioritize defense (DP, FW) then stealth (Sleaze) then attack
  return {
    dataProcessing: sorted[0] ?? 1,
    firewall: sorted[1] ?? 1,
    sleaze: sorted[2] ?? 1,
    attack: sorted[3] ?? 1,
  };
}

/**
 * Create an offensive ASDF configuration from an attribute array
 *
 * Assigns values in descending order to: Attack, Sleaze, Data Processing, Firewall
 *
 * @param attributeArray - The deck's attribute array
 * @returns Offensive configuration
 */
export function createOffensiveConfig(attributeArray: number[]): CyberdeckAttributeConfig {
  const sorted = [...attributeArray].sort((a, b) => b - a);

  return {
    attack: sorted[0] ?? 1,
    sleaze: sorted[1] ?? 1,
    dataProcessing: sorted[2] ?? 1,
    firewall: sorted[3] ?? 1,
  };
}

/**
 * Create a stealthy ASDF configuration from an attribute array
 *
 * Assigns values in descending order to: Sleaze, Data Processing, Firewall, Attack
 *
 * @param attributeArray - The deck's attribute array
 * @returns Stealthy configuration
 */
export function createStealthyConfig(attributeArray: number[]): CyberdeckAttributeConfig {
  const sorted = [...attributeArray].sort((a, b) => b - a);

  return {
    sleaze: sorted[0] ?? 1,
    dataProcessing: sorted[1] ?? 1,
    firewall: sorted[2] ?? 1,
    attack: sorted[3] ?? 1,
  };
}

// =============================================================================
// CHARACTER HARDWARE VALIDATION
// =============================================================================

/**
 * Check if character has valid matrix hardware for hacking
 *
 * A character needs a cyberdeck to perform hacking actions.
 * Commlinks provide basic matrix access but not hacking capability.
 *
 * @param character - The character to check
 * @returns True if character has valid hacking hardware
 */
export function hasValidMatrixHardware(character: Character): boolean {
  // Check for cyberdecks in gear
  const cyberdecks = getCharacterCyberdecks(character);
  return cyberdecks.length > 0;
}

/**
 * Check if character has basic matrix access (commlink or better)
 *
 * @param character - The character to check
 * @returns True if character can access the matrix
 */
export function hasMatrixAccess(character: Character): boolean {
  const cyberdecks = getCharacterCyberdecks(character);
  const commlinks = getCharacterCommlinks(character);

  return cyberdecks.length > 0 || commlinks.length > 0;
}

/**
 * Get the active cyberdeck for a character
 *
 * Returns the first cyberdeck if no active device is set.
 *
 * @param character - The character to check
 * @returns The active cyberdeck or null
 */
export function getActiveCyberdeck(character: Character): CharacterCyberdeck | null {
  const cyberdecks = getCharacterCyberdecks(character);

  if (cyberdecks.length === 0) {
    return null;
  }

  // If character has an active device set, find it
  const activeDeviceId = character.activeMatrixDeviceId;
  if (activeDeviceId) {
    const active = cyberdecks.find(
      (deck) => deck.id === activeDeviceId || deck.catalogId === activeDeviceId
    );
    if (active) {
      return active;
    }
  }

  // Default to first cyberdeck
  return cyberdecks[0];
}

/**
 * Get all cyberdecks owned by a character
 *
 * @param character - The character
 * @returns Array of character cyberdecks
 */
export function getCharacterCyberdecks(character: Character): CharacterCyberdeck[] {
  // Cyberdecks may be stored in character.cyberdecks or in gear
  return character.cyberdecks ?? [];
}

/**
 * Get all commlinks owned by a character
 *
 * @param character - The character
 * @returns Array of character commlinks
 */
export function getCharacterCommlinks(character: Character): Array<{
  id?: string;
  catalogId: string;
  name: string;
  deviceRating: number;
}> {
  // Commlinks may be stored in character.commlinks or in gear
  return character.commlinks ?? [];
}

// =============================================================================
// DECK RECONFIGURATION
// =============================================================================

/**
 * Swap two attribute values in a configuration
 *
 * @param config - Current configuration
 * @param attr1 - First attribute to swap
 * @param attr2 - Second attribute to swap
 * @returns New configuration with swapped values
 */
export function swapAttributes(
  config: CyberdeckAttributeConfig,
  attr1: keyof CyberdeckAttributeConfig,
  attr2: keyof CyberdeckAttributeConfig
): CyberdeckAttributeConfig {
  return {
    ...config,
    [attr1]: config[attr2],
    [attr2]: config[attr1],
  };
}

/**
 * Calculate matrix condition monitor size for a device
 *
 * Formula: Device Rating + 8
 *
 * @param deviceRating - The device's rating
 * @returns Condition monitor size
 */
export function calculateMatrixConditionMonitor(deviceRating: number): number {
  return deviceRating + 8;
}

/**
 * Get initiative dice bonus for connection mode
 *
 * @param mode - Connection mode (ar, cold-sim-vr, hot-sim-vr)
 * @returns Number of bonus initiative dice
 */
export function getInitiativeDiceBonus(mode: "ar" | "cold-sim-vr" | "hot-sim-vr"): number {
  switch (mode) {
    case "ar":
      return 0;
    case "cold-sim-vr":
      return 1;
    case "hot-sim-vr":
      return 2;
  }
}

/**
 * Get biofeedback damage type for connection mode
 *
 * @param mode - Connection mode
 * @returns Damage type for biofeedback attacks
 */
export function getBiofeedbackDamageType(
  mode: "ar" | "cold-sim-vr" | "hot-sim-vr"
): "stun" | "physical" | null {
  switch (mode) {
    case "ar":
      return null; // No biofeedback in AR
    case "cold-sim-vr":
      return "stun";
    case "hot-sim-vr":
      return "physical";
  }
}
