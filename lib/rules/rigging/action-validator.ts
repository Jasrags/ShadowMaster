/**
 * Vehicle Action Validator
 *
 * Validates vehicle/drone actions based on control mode, hardware requirements,
 * and rigging state. Enforces control protocols and action economy rules.
 *
 * Based on SR5 Core Rulebook Chapter 11: Riggers
 */

import type { Character } from "@/lib/types/character";
import type {
  RiggingState,
  ControlMode,
  VehicleActionType,
  VehicleTestType,
  RiggingValidationError,
  RiggingValidationWarning,
  SlavedDrone,
  SharedAutosoft,
} from "@/lib/types/rigging";
import type { AutosoftCategory } from "@/lib/types/vehicles";
import { hasVehicleControlRig } from "./vcr-validator";
import { hasRCC } from "./rcc-validator";

// =============================================================================
// VALIDATION RESULT TYPES
// =============================================================================

/**
 * Bonus applied to an action from various sources
 */
export interface ActionBonus {
  /** Source of the bonus */
  source: string;
  /** Attribute providing bonus (if applicable) */
  attribute?: string;
  /** Skill providing bonus (if applicable) */
  skill?: string;
  /** Autosoft providing bonus (if applicable) */
  autosoft?: string;
  /** Value of the bonus */
  value: number;
}

/**
 * Result of validating a vehicle action
 */
export interface VehicleActionValidation {
  /** Whether the action is valid */
  valid: boolean;
  /** Validation errors (action cannot proceed) */
  errors: RiggingValidationError[];
  /** Validation warnings (action can proceed but with caveats) */
  warnings: RiggingValidationWarning[];
  /** Determined control mode for this action */
  controlMode: ControlMode;
  /** Bonuses applicable to this action */
  applicableBonuses: ActionBonus[];
  /** Current noise penalty */
  noisePenalty: number;
  /** Whether action requires jumped-in status */
  requiresJumpedIn: boolean;
}

// =============================================================================
// ACTION REQUIREMENTS
// =============================================================================

/** Actions that require the character to be jumped into the vehicle */
const JUMPED_IN_REQUIRED_ACTIONS: VehicleActionType[] = ["stunt", "ram", "evasive_driving"];

/** Actions that can be performed remotely but with penalties */
const REMOTE_CAPABLE_ACTIONS: VehicleActionType[] = [
  "accelerate",
  "decelerate",
  "turn",
  "catch_up",
  "cut_off",
  "fire_weapon",
  "sensor_targeting",
];

/** Mapping of action types to vehicle test types */
const ACTION_TO_TEST_TYPE: Record<VehicleActionType, VehicleTestType> = {
  accelerate: "control",
  decelerate: "control",
  turn: "control",
  catch_up: "chase",
  cut_off: "chase",
  ram: "ramming",
  stunt: "stunt",
  fire_weapon: "gunnery",
  sensor_targeting: "sensor",
  evasive_driving: "control",
};

/** Mapping of action types to required skills */
const ACTION_TO_SKILL: Record<VehicleActionType, string> = {
  accelerate: "pilot",
  decelerate: "pilot",
  turn: "pilot",
  catch_up: "pilot",
  cut_off: "pilot",
  ram: "pilot",
  stunt: "pilot",
  fire_weapon: "gunnery",
  sensor_targeting: "perception",
  evasive_driving: "pilot",
};

/** Mapping of action types to relevant autosoft categories */
const ACTION_TO_AUTOSOFT_CATEGORY: Partial<Record<VehicleActionType, AutosoftCategory[]>> = {
  accelerate: ["movement"],
  decelerate: ["movement"],
  turn: ["movement"],
  catch_up: ["movement"],
  cut_off: ["movement"],
  stunt: ["movement"],
  evasive_driving: ["movement", "defense"],
  fire_weapon: ["combat"],
  sensor_targeting: ["perception"],
  ram: ["combat"],
};

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Check if an action requires jumped-in status
 */
export function requiresJumpedIn(actionType: VehicleActionType): boolean {
  return JUMPED_IN_REQUIRED_ACTIONS.includes(actionType);
}

/**
 * Check if an action can be performed remotely
 */
export function canPerformRemotely(actionType: VehicleActionType): boolean {
  return REMOTE_CAPABLE_ACTIONS.includes(actionType);
}

/**
 * Get the vehicle test type for an action
 */
export function getTestTypeForAction(actionType: VehicleActionType): VehicleTestType {
  return ACTION_TO_TEST_TYPE[actionType];
}

/**
 * Get the required skill for an action
 */
export function getSkillForAction(actionType: VehicleActionType): string {
  return ACTION_TO_SKILL[actionType];
}

/**
 * Get relevant autosoft categories for an action
 */
export function getAutosoftCategoriesForAction(actionType: VehicleActionType): AutosoftCategory[] {
  return ACTION_TO_AUTOSOFT_CATEGORY[actionType] || [];
}

/**
 * Validate that a character can perform a vehicle action
 *
 * Checks:
 * - Hardware requirements (VCR, RCC)
 * - Control mode appropriateness
 * - Jumped-in requirements
 * - Rigging state validity
 */
export function validateVehicleAction(
  character: Character,
  riggingState: RiggingState | undefined,
  actionType: VehicleActionType,
  targetId: string
): VehicleActionValidation {
  const errors: RiggingValidationError[] = [];
  const warnings: RiggingValidationWarning[] = [];
  const applicableBonuses: ActionBonus[] = [];
  let controlMode: ControlMode = "manual";
  let noisePenalty = 0;

  const actionRequiresJumpedIn = requiresJumpedIn(actionType);

  // Check for rigging state
  if (!riggingState) {
    // No rigging state means manual control only
    if (actionRequiresJumpedIn) {
      errors.push({
        code: "NO_RIGGING_STATE",
        message: `Action '${actionType}' requires jumped-in status but no rigging session is active`,
      });
    }
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      controlMode: "manual",
      applicableBonuses,
      noisePenalty: 0,
      requiresJumpedIn: actionRequiresJumpedIn,
    };
  }

  // Determine control mode
  if (riggingState.jumpedInState?.isActive) {
    if (riggingState.jumpedInState.targetId === targetId) {
      controlMode = "jumped-in";

      // Add VCR control bonus
      const vcrBonus = riggingState.jumpedInState.controlBonus;
      if (vcrBonus > 0) {
        applicableBonuses.push({
          source: "Vehicle Control Rig",
          value: vcrBonus,
        });
      }
    } else {
      // Character is jumped into a different vehicle
      warnings.push({
        code: "JUMPED_INTO_OTHER_VEHICLE",
        message: `Character is jumped into a different vehicle (${riggingState.jumpedInState.targetName})`,
      });
      controlMode = "remote";
    }
  } else if (riggingState.rccConfig) {
    controlMode = "remote";
  }

  // Check if action requires jumped-in status
  if (actionRequiresJumpedIn && controlMode !== "jumped-in") {
    errors.push({
      code: "REQUIRES_JUMPED_IN",
      message: `Action '${actionType}' requires jumped-in control mode`,
    });
  }

  // Check VCR for jumped-in actions
  if (controlMode === "jumped-in" && !hasVehicleControlRig(character)) {
    errors.push({
      code: "MISSING_VCR",
      message: "Vehicle Control Rig required for jumped-in control mode",
    });
  }

  // Check RCC for remote actions
  if (controlMode === "remote" && !hasRCC(character)) {
    errors.push({
      code: "MISSING_RCC",
      message: "Rigger Command Console required for remote control mode",
    });
  }

  // Calculate noise penalty for remote control
  if (controlMode === "remote" && riggingState.droneNetwork) {
    const drone = riggingState.droneNetwork.slavedDrones.find((d) => d.droneId === targetId);
    if (drone) {
      noisePenalty = drone.noisePenalty;
      if (noisePenalty > 0) {
        warnings.push({
          code: "NOISE_PENALTY",
          message: `Signal noise penalty: -${noisePenalty} dice`,
        });
      }
    } else {
      // Target is not a slaved drone
      warnings.push({
        code: "NOT_SLAVED",
        message: "Target is not slaved to RCC network; may incur additional penalties",
      });
    }
  }

  // Check for applicable autosofts
  if (controlMode === "remote" && riggingState.droneNetwork) {
    const applicableCategories = getAutosoftCategoriesForAction(actionType);
    const drone = riggingState.droneNetwork.slavedDrones.find((d) => d.droneId === targetId);

    if (drone && applicableCategories.length > 0) {
      const autosoftBonuses = getApplicableAutosofts(
        actionType,
        drone,
        riggingState.droneNetwork.sharedAutosofts
      );

      for (const autosoft of autosoftBonuses) {
        applicableBonuses.push({
          source: autosoft.name,
          autosoft: autosoft.autosoftId,
          value: autosoft.rating,
        });
      }
    }
  }

  // Add control mode bonus if jumped in
  if (controlMode === "jumped-in") {
    const controlBonus = getControlModeBonus(controlMode, riggingState.vcr?.rating);
    if (controlBonus > 0) {
      applicableBonuses.push({
        source: "Jumped-In Control Mode",
        value: controlBonus,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    controlMode,
    applicableBonuses,
    noisePenalty,
    requiresJumpedIn: actionRequiresJumpedIn,
  };
}

/**
 * Get control mode bonus for vehicle tests
 *
 * - Manual: No bonus
 * - Remote: No bonus (but can use autosofts)
 * - Jumped-in: +VCR rating to all vehicle tests
 */
export function getControlModeBonus(controlMode: ControlMode, vcrRating?: number): number {
  if (controlMode === "jumped-in" && vcrRating) {
    return vcrRating;
  }
  return 0;
}

/**
 * Get applicable autosofts for a vehicle action
 *
 * Returns autosofts that could apply to this action, checking both
 * installed autosofts on the drone and shared autosofts from RCC.
 * Uses the highest rating available for each autosoft type.
 */
export function getApplicableAutosofts(
  action: VehicleActionType,
  drone: SlavedDrone,
  sharedAutosofts: SharedAutosoft[]
): SharedAutosoft[] {
  const applicableCategories = getAutosoftCategoriesForAction(action);

  if (applicableCategories.length === 0) {
    return [];
  }

  // Combine installed and shared autosofts
  const allAutosofts: SharedAutosoft[] = [
    // Convert installed autosofts to SharedAutosoft format
    ...drone.installedAutosofts.map((a) => ({
      autosoftId: a.autosoftId,
      name: a.name,
      rating: a.rating,
      category: a.category,
      target: a.target,
    })),
    ...sharedAutosofts,
  ];

  // Filter by applicable categories
  const applicableAutosofts = allAutosofts.filter((a) => applicableCategories.includes(a.category));

  // Deduplicate by type, keeping highest rating
  const autosoftMap = new Map<string, SharedAutosoft>();
  for (const autosoft of applicableAutosofts) {
    const key = `${autosoft.category}-${autosoft.target || "generic"}`;
    const existing = autosoftMap.get(key);
    if (!existing || existing.rating < autosoft.rating) {
      autosoftMap.set(key, autosoft);
    }
  }

  return Array.from(autosoftMap.values());
}

/**
 * Check if a character can perform any rigging actions
 *
 * Returns true if character has VCR or RCC for rigging control.
 */
export function canPerformRiggingActions(character: Character): boolean {
  return hasVehicleControlRig(character) || hasRCC(character);
}

/**
 * Validate a drone command action
 */
export function validateDroneCommand(
  character: Character,
  riggingState: RiggingState | undefined,
  droneId: string,
  _command: string
): VehicleActionValidation {
  const errors: RiggingValidationError[] = [];
  const warnings: RiggingValidationWarning[] = [];

  if (!riggingState) {
    errors.push({
      code: "NO_RIGGING_STATE",
      message: "No active rigging session",
    });
    return {
      valid: false,
      errors,
      warnings,
      controlMode: "manual",
      applicableBonuses: [],
      noisePenalty: 0,
      requiresJumpedIn: false,
    };
  }

  if (!riggingState.droneNetwork) {
    errors.push({
      code: "NO_DRONE_NETWORK",
      message: "No drone network configured",
    });
    return {
      valid: false,
      errors,
      warnings,
      controlMode: "remote",
      applicableBonuses: [],
      noisePenalty: 0,
      requiresJumpedIn: false,
    };
  }

  const drone = riggingState.droneNetwork.slavedDrones.find((d) => d.droneId === droneId);

  if (!drone) {
    errors.push({
      code: "DRONE_NOT_SLAVED",
      message: `Drone ${droneId} is not slaved to the network`,
    });
    return {
      valid: false,
      errors,
      warnings,
      controlMode: "remote",
      applicableBonuses: [],
      noisePenalty: 0,
      requiresJumpedIn: false,
    };
  }

  // Check if drone is operational
  const isDroneOperational = drone.conditionDamageTaken < drone.conditionMonitorMax;
  if (!isDroneOperational) {
    errors.push({
      code: "DRONE_DESTROYED",
      message: `Drone ${drone.name} is destroyed and cannot receive commands`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    controlMode: "remote",
    applicableBonuses: [],
    noisePenalty: drone.noisePenalty,
    requiresJumpedIn: false,
  };
}

/**
 * Get the limit type for a vehicle test
 */
export function getLimitTypeForTest(testType: VehicleTestType): "handling" | "speed" | "sensor" {
  switch (testType) {
    case "control":
    case "stunt":
    case "crash_avoidance":
    case "chase":
      return "handling";
    case "ramming":
      return "speed";
    case "sensor":
    case "gunnery":
      return "sensor";
    default:
      return "handling";
  }
}

/**
 * Get a human-readable description for a control mode
 */
export function getControlModeDescription(controlMode: ControlMode): string {
  switch (controlMode) {
    case "manual":
      return "Manual Control";
    case "remote":
      return "Remote Control (AR)";
    case "jumped-in":
      return "Jumped In (VR)";
  }
}

/**
 * Get a human-readable description for an action type
 */
export function getActionTypeDescription(actionType: VehicleActionType): string {
  switch (actionType) {
    case "accelerate":
      return "Accelerate";
    case "decelerate":
      return "Decelerate";
    case "turn":
      return "Turn";
    case "catch_up":
      return "Catch Up / Overtake";
    case "cut_off":
      return "Cut Off";
    case "ram":
      return "Ram";
    case "stunt":
      return "Stunt";
    case "fire_weapon":
      return "Fire Vehicle Weapon";
    case "sensor_targeting":
      return "Sensor Targeting";
    case "evasive_driving":
      return "Evasive Driving";
  }
}
