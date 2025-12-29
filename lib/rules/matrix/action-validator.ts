/**
 * Matrix Action Validator
 *
 * Validates that matrix actions can be performed based on:
 * - Hardware requirements (cyberdeck vs commlink)
 * - Connection mode (AR, Cold VR, Hot VR)
 * - Mark requirements on targets
 * - Required programs
 * - Legality classification for Overwatch
 */

import type { Character } from "@/lib/types";
import type {
  MatrixState,
  MatrixAction,
  MatrixMark,
  MatrixValidationError,
  MatrixValidationWarning,
  MatrixDeviceType,
} from "@/lib/types/matrix";
import type { LoadedRuleset } from "../loader-types";
import { hasValidMatrixHardware, hasMatrixAccess } from "./cyberdeck-validator";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of matrix action validation
 */
export interface MatrixActionValidation {
  /** Whether the action can be performed */
  valid: boolean;
  /** Validation errors (prevent action) */
  errors: MatrixValidationError[];
  /** Validation warnings (allow but warn) */
  warnings: MatrixValidationWarning[];
  /** Marks required on target */
  requiredMarks: number;
  /** Current marks on target (if any) */
  currentMarks: number;
  /** Required program (if any) */
  requiredProgram?: string;
  /** Whether the action is illegal (increases OS) */
  isIllegalAction: boolean;
  /** Whether this action risks Overwatch increase */
  overwatchRisk: boolean;
  /** Whether the character meets hardware requirements */
  hasRequiredHardware: boolean;
  /** Whether the character is connected properly */
  isConnected: boolean;
}

// =============================================================================
// ACTION CLASSIFICATION
// =============================================================================

/**
 * Determine if an action is illegal (increases Overwatch Score)
 *
 * Illegal actions in SR5:
 * - Any action with legality "illegal"
 * - Any action in Attack or Sleaze category against non-owned devices
 *
 * @param action - The matrix action
 * @returns True if the action is illegal
 */
export function isIllegalAction(action: MatrixAction): boolean {
  return action.legality === "illegal";
}

/**
 * Check if an action requires marks on the target
 *
 * @param action - The matrix action
 * @returns Number of marks required (0-3)
 */
export function getMarkRequirement(action: MatrixAction): number {
  return action.marksRequired;
}

/**
 * Get the relevant ASDF attribute for this action's limit
 *
 * @param action - The matrix action
 * @returns The ASDF attribute used as limit
 */
export function getActionLimitAttribute(
  action: MatrixAction
): "attack" | "sleaze" | "dataProcessing" | "firewall" {
  return action.limitAttribute;
}

// =============================================================================
// HARDWARE VALIDATION
// =============================================================================

/**
 * Check if the character's hardware supports this action
 *
 * Some actions require specific device types:
 * - Hacking actions require cyberdeck
 * - Basic browsing works on commlink
 * - Rigging actions require RCC
 *
 * @param action - The matrix action
 * @param deviceType - The active device type
 * @returns True if device supports the action
 */
export function isActionSupportedByDevice(
  action: MatrixAction,
  deviceType: MatrixDeviceType
): boolean {
  switch (deviceType) {
    case "cyberdeck":
      // Cyberdecks support all matrix actions
      return true;

    case "commlink":
      // Commlinks only support legal actions
      return action.legality === "legal" && action.category !== "attack";

    case "rcc":
      // RCCs support device control actions (for drones)
      return action.category === "device" || action.category === "persona";

    case "technomancer-living-persona":
      // Technomancers use complex forms, not standard matrix actions
      // They can perform basic matrix actions but use different mechanics
      return action.category !== "complex_form";

    default:
      return false;
  }
}

/**
 * Check if the action requires VR mode
 *
 * Some actions require VR for full effectiveness or at all.
 *
 * @param action - The matrix action
 * @returns True if VR is required
 */
export function requiresVRMode(action: MatrixAction): boolean {
  // Currently no actions strictly require VR in SR5
  // But some have VR-only bonuses (not modeled here yet)
  return false;
}

// =============================================================================
// MARK VALIDATION
// =============================================================================

/**
 * Get the number of marks held on a specific target
 *
 * @param matrixState - Current matrix state
 * @param targetId - ID of the target to check
 * @returns Number of marks (0-3)
 */
export function getMarksOnTarget(
  matrixState: MatrixState,
  targetId: string
): number {
  const mark = matrixState.marksHeld.find((m) => m.targetId === targetId);
  return mark?.markCount ?? 0;
}

/**
 * Check if character has enough marks for an action
 *
 * @param matrixState - Current matrix state
 * @param targetId - ID of the target
 * @param requiredMarks - Number of marks required
 * @returns True if sufficient marks are held
 */
export function hasRequiredMarks(
  matrixState: MatrixState,
  targetId: string,
  requiredMarks: number
): boolean {
  if (requiredMarks === 0) {
    return true;
  }

  const currentMarks = getMarksOnTarget(matrixState, targetId);
  return currentMarks >= requiredMarks;
}

// =============================================================================
// PROGRAM VALIDATION
// =============================================================================

/**
 * Get programs that provide bonuses for an action
 *
 * @param action - The matrix action
 * @returns Array of program IDs that help this action
 */
export function getRelevantPrograms(action: MatrixAction): string[] {
  return action.relevantPrograms ?? [];
}

/**
 * Check if a specific program is loaded
 *
 * @param matrixState - Current matrix state
 * @param programId - Program to check
 * @returns True if program is loaded and running
 */
export function isProgramLoaded(
  matrixState: MatrixState,
  programId: string
): boolean {
  return matrixState.loadedPrograms.some(
    (p) => (p.catalogId === programId || p.programId === programId) && p.isRunning
  );
}

/**
 * Check which relevant programs are loaded for an action
 *
 * @param action - The matrix action
 * @param matrixState - Current matrix state
 * @returns Array of loaded program IDs
 */
export function getLoadedRelevantPrograms(
  action: MatrixAction,
  matrixState: MatrixState
): string[] {
  const relevant = getRelevantPrograms(action);
  return relevant.filter((programId) => isProgramLoaded(matrixState, programId));
}

// =============================================================================
// MAIN VALIDATION
// =============================================================================

/**
 * Validate that a matrix action can be performed
 *
 * Performs comprehensive validation including:
 * - Character has matrix hardware
 * - Character is connected to the matrix
 * - Device supports the action
 * - Sufficient marks on target
 * - Required programs are loaded
 *
 * @param character - The character attempting the action
 * @param matrixState - Current matrix state
 * @param action - The action to perform
 * @param targetId - Optional target ID (for mark checks)
 * @param ruleset - The loaded ruleset (for future program validation)
 * @returns Validation result
 */
export function validateMatrixAction(
  character: Character,
  matrixState: MatrixState,
  action: MatrixAction,
  targetId?: string,
  ruleset?: LoadedRuleset
): MatrixActionValidation {
  const errors: MatrixValidationError[] = [];
  const warnings: MatrixValidationWarning[] = [];

  // Check hardware
  const hasHardware = hasMatrixAccess(character);
  const hasHackingHardware = hasValidMatrixHardware(character);

  if (!hasHardware) {
    errors.push({
      code: "NO_MATRIX_HARDWARE",
      message: "Character has no matrix hardware (commlink or cyberdeck).",
    });
  }

  // Check connection
  const isConnected = matrixState.isConnected;
  if (!isConnected) {
    errors.push({
      code: "NOT_CONNECTED",
      message: "Character is not connected to the Matrix.",
    });
  }

  // Check device type compatibility
  let deviceSupportsAction = false;
  if (matrixState.activeDeviceType) {
    deviceSupportsAction = isActionSupportedByDevice(
      action,
      matrixState.activeDeviceType
    );

    if (!deviceSupportsAction) {
      errors.push({
        code: "DEVICE_INCOMPATIBLE",
        message: `${action.name} cannot be performed with a ${matrixState.activeDeviceType}.`,
        field: "deviceType",
      });
    }
  }

  // Check if hacking capability is needed
  if (action.legality === "illegal" && !hasHackingHardware) {
    errors.push({
      code: "NO_HACKING_HARDWARE",
      message: `${action.name} requires a cyberdeck or living persona.`,
    });
  }

  // Check marks requirement
  const requiredMarks = getMarkRequirement(action);
  let currentMarks = 0;

  if (requiredMarks > 0 && targetId) {
    currentMarks = getMarksOnTarget(matrixState, targetId);
    if (currentMarks < requiredMarks) {
      errors.push({
        code: "INSUFFICIENT_MARKS",
        message: `${action.name} requires ${requiredMarks} mark(s) on target. You have ${currentMarks}.`,
        field: "marks",
      });
    }
  } else if (requiredMarks > 0 && !targetId) {
    warnings.push({
      code: "NO_TARGET_SPECIFIED",
      message: `${action.name} requires ${requiredMarks} mark(s) on target. No target specified.`,
    });
  }

  // Check VR requirement
  if (requiresVRMode(action) && matrixState.connectionMode === "ar") {
    errors.push({
      code: "VR_REQUIRED",
      message: `${action.name} requires VR mode.`,
      field: "connectionMode",
    });
  }

  // Check for relevant programs (warning if missing, not error)
  const relevantPrograms = getRelevantPrograms(action);
  const loadedRelevant = getLoadedRelevantPrograms(action, matrixState);

  if (relevantPrograms.length > 0 && loadedRelevant.length === 0) {
    warnings.push({
      code: "NO_RELEVANT_PROGRAMS",
      message: `No programs that enhance ${action.name} are loaded. Consider loading: ${relevantPrograms.join(", ")}`,
    });
  }

  // Determine illegal status and overwatch risk
  const isIllegal = isIllegalAction(action);
  const overwatchRisk = isIllegal && !matrixState.overwatchConverged;

  // Add overwatch warning for illegal actions
  if (overwatchRisk) {
    const currentOS = matrixState.overwatchScore;
    const threshold = matrixState.overwatchThreshold;
    const remaining = threshold - currentOS;

    if (remaining <= 14) {
      // Average 2d6 roll is 7, so warn within ~2 rolls
      warnings.push({
        code: "CONVERGENCE_IMMINENT",
        message: `Overwatch Score is ${currentOS}/${threshold}. Convergence is imminent!`,
      });
    } else {
      warnings.push({
        code: "OVERWATCH_RISK",
        message: `This illegal action will increase your Overwatch Score. Current: ${currentOS}/${threshold}`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    requiredMarks,
    currentMarks,
    requiredProgram: relevantPrograms[0],
    isIllegalAction: isIllegal,
    overwatchRisk,
    hasRequiredHardware: hasHardware && (action.legality === "legal" || hasHackingHardware),
    isConnected,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get actions available to a character based on their current state
 *
 * Filters actions based on device type and connection status.
 *
 * @param matrixState - Current matrix state
 * @param allActions - All possible matrix actions
 * @returns Array of actions the character can attempt
 */
export function getAvailableActions(
  matrixState: MatrixState,
  allActions: MatrixAction[]
): MatrixAction[] {
  if (!matrixState.isConnected || !matrixState.activeDeviceType) {
    return [];
  }

  return allActions.filter((action) =>
    isActionSupportedByDevice(action, matrixState.activeDeviceType!)
  );
}

/**
 * Categorize actions by type for UI display
 *
 * @param actions - Array of matrix actions
 * @returns Actions grouped by category
 */
export function categorizeActions(
  actions: MatrixAction[]
): Record<string, MatrixAction[]> {
  const categories: Record<string, MatrixAction[]> = {};

  for (const action of actions) {
    const category = action.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(action);
  }

  return categories;
}

/**
 * Get a summary of action requirements
 *
 * @param action - The matrix action
 * @returns Human-readable requirements string
 */
export function getActionRequirementsSummary(action: MatrixAction): string {
  const parts: string[] = [];

  if (action.marksRequired > 0) {
    parts.push(`${action.marksRequired} mark${action.marksRequired > 1 ? "s" : ""}`);
  }

  if (action.legality === "illegal") {
    parts.push("Illegal (OS risk)");
  }

  if (action.relevantPrograms && action.relevantPrograms.length > 0) {
    parts.push(`Programs: ${action.relevantPrograms.join(", ")}`);
  }

  return parts.length > 0 ? parts.join(" | ") : "No special requirements";
}
