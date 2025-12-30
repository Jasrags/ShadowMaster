/**
 * Jumped-In State Manager
 *
 * Manages the rigger's "jumped in" state when directly controlling
 * a vehicle or drone through VCR interface.
 *
 * SR5 Core Rulebook p. 265-266
 */

import type { Character } from "@/lib/types/character";
import type {
  JumpedInState,
  RiggingState,
  RiggerVRMode,
  DroneNetwork,
  VehicleControlRig,
  RiggingValidationError,
  RiggingValidationWarning,
} from "@/lib/types/rigging";
import {
  JUMPED_IN_INITIATIVE_BONUS,
  JUMPED_IN_HOTSIM_INITIATIVE_BONUS,
} from "@/lib/types/rigging";
import { getVehicleControlRig, hasVehicleControlRig } from "./vcr-validator";
import { getDroneFromNetwork } from "./drone-network";

// =============================================================================
// RESULT TYPES
// =============================================================================

export interface JumpInResult {
  success: boolean;
  jumpedInState: JumpedInState | null;
  riggingState: RiggingState;
  errors: RiggingValidationError[];
  warnings: RiggingValidationWarning[];
}

export interface JumpOutResult {
  success: boolean;
  riggingState: RiggingState;
  previousState: JumpedInState | null;
}

export interface InitiativeResult {
  initiative: number;
  initiativeDice: number;
  breakdown: {
    base: number;
    reactionBonus: number;
    intuitionBonus: number;
    vcrBonus: number;
    vrModeBonus: number;
  };
}

// =============================================================================
// JUMP-IN VALIDATION
// =============================================================================

/**
 * Validate that character can jump into a target
 */
export function validateJumpIn(
  character: Character,
  riggingState: RiggingState,
  targetId: string,
  targetType: "vehicle" | "drone"
): { valid: boolean; errors: RiggingValidationError[]; warnings: RiggingValidationWarning[] } {
  const errors: RiggingValidationError[] = [];
  const warnings: RiggingValidationWarning[] = [];

  // Check for VCR
  if (!hasVehicleControlRig(character)) {
    errors.push({
      code: "NO_VCR",
      message: "Vehicle Control Rig required to jump into vehicles/drones",
      field: "cyberware",
    });
  }

  // Check if already jumped in
  if (riggingState.jumpedInState?.isActive) {
    errors.push({
      code: "ALREADY_JUMPED_IN",
      message: `Already jumped into "${riggingState.jumpedInState.targetName}". Jump out first.`,
      field: "jumpedInState",
    });
  }

  // For drones, check if it's slaved to the network
  if (targetType === "drone" && riggingState.droneNetwork) {
    const drone = getDroneFromNetwork(riggingState.droneNetwork, targetId);
    if (!drone) {
      errors.push({
        code: "DRONE_NOT_SLAVED",
        message: "Drone must be slaved to your RCC network before jumping in",
        field: "droneNetwork",
      });
    }
  }

  // Check for active RCC if targeting a drone
  if (targetType === "drone" && !riggingState.rccConfig) {
    warnings.push({
      code: "NO_RCC_FOR_DRONE",
      message: "No active RCC; jumping into drone directly via VCR",
    });
  }

  return { valid: errors.length === 0, errors, warnings };
}

// =============================================================================
// JUMP-IN OPERATIONS
// =============================================================================

/**
 * Create a new jumped-in state
 */
function createJumpedInState(
  targetId: string,
  targetType: "vehicle" | "drone",
  targetName: string,
  vrMode: RiggerVRMode,
  vcr: VehicleControlRig
): JumpedInState {
  const initiativeDiceBonus =
    vrMode === "hot-sim"
      ? JUMPED_IN_HOTSIM_INITIATIVE_BONUS
      : JUMPED_IN_INITIATIVE_BONUS;

  return {
    isActive: true,
    targetId,
    targetType,
    targetName,
    vrMode,
    jumpedInAt: new Date().toISOString(),
    vcrRating: vcr.rating,
    controlBonus: vcr.controlBonus,
    initiativeDiceBonus,
    bodyVulnerable: true, // Always vulnerable when jumped in
  };
}

/**
 * Jump into a vehicle or drone
 */
export function jumpIn(
  character: Character,
  riggingState: RiggingState,
  targetId: string,
  targetType: "vehicle" | "drone",
  targetName: string,
  vrMode: RiggerVRMode
): JumpInResult {
  // Validate
  const validation = validateJumpIn(character, riggingState, targetId, targetType);
  if (!validation.valid) {
    return {
      success: false,
      jumpedInState: null,
      riggingState,
      errors: validation.errors,
      warnings: validation.warnings,
    };
  }

  // Get VCR
  const vcr = getVehicleControlRig(character);
  if (!vcr) {
    return {
      success: false,
      jumpedInState: null,
      riggingState,
      errors: [{ code: "NO_VCR", message: "VCR not found" }],
      warnings: [],
    };
  }

  // Create jumped-in state
  const jumpedInState = createJumpedInState(
    targetId,
    targetType,
    targetName,
    vrMode,
    vcr
  );

  // Update drone network if jumping into a drone
  let updatedNetwork = riggingState.droneNetwork;
  if (targetType === "drone" && updatedNetwork) {
    updatedNetwork = {
      ...updatedNetwork,
      slavedDrones: updatedNetwork.slavedDrones.map((drone) =>
        drone.droneId === targetId
          ? { ...drone, isJumpedIn: true, controlMode: "jumped-in" as const }
          : drone
      ),
    };
  }

  // Update rigging state
  const updatedRiggingState: RiggingState = {
    ...riggingState,
    jumpedInState,
    droneNetwork: updatedNetwork,
    biofeedbackDamageType: vrMode === "hot-sim" ? "physical" : "stun",
  };

  return {
    success: true,
    jumpedInState,
    riggingState: updatedRiggingState,
    errors: [],
    warnings: validation.warnings,
  };
}

/**
 * Jump out of current vehicle/drone
 */
export function jumpOut(riggingState: RiggingState): JumpOutResult {
  const previousState = riggingState.jumpedInState ?? null;

  // Update drone network if was jumped into a drone
  let updatedNetwork = riggingState.droneNetwork;
  if (previousState?.targetType === "drone" && updatedNetwork) {
    updatedNetwork = {
      ...updatedNetwork,
      slavedDrones: updatedNetwork.slavedDrones.map((drone) =>
        drone.droneId === previousState.targetId
          ? { ...drone, isJumpedIn: false, controlMode: "remote" as const }
          : drone
      ),
    };
  }

  // Clear jumped-in state
  const updatedRiggingState: RiggingState = {
    ...riggingState,
    jumpedInState: undefined,
    droneNetwork: updatedNetwork,
    biofeedbackDamageTaken: 0, // Reset biofeedback on clean exit
  };

  return {
    success: true,
    riggingState: updatedRiggingState,
    previousState,
  };
}

// =============================================================================
// INITIATIVE CALCULATIONS
// =============================================================================

/**
 * Calculate initiative when jumped in
 *
 * Jumped-in initiative uses:
 * - Reaction + Intuition (mental attributes, not vehicle's)
 * - VR mode bonus dice (+1D6 cold-sim, +2D6 hot-sim)
 */
export function calculateJumpedInInitiative(
  reaction: number,
  intuition: number,
  vcrRating: number,
  vrMode: RiggerVRMode
): InitiativeResult {
  const vrModeBonus =
    vrMode === "hot-sim"
      ? JUMPED_IN_HOTSIM_INITIATIVE_BONUS
      : JUMPED_IN_INITIATIVE_BONUS;

  // Base initiative = Reaction + Intuition + Data Processing (use VCR rating as proxy)
  const baseInitiative = reaction + intuition + vcrRating;

  return {
    initiative: baseInitiative,
    initiativeDice: 1 + vrModeBonus, // Base 1D6 + VR mode bonus
    breakdown: {
      base: baseInitiative,
      reactionBonus: reaction,
      intuitionBonus: intuition,
      vcrBonus: vcrRating,
      vrModeBonus,
    },
  };
}

/**
 * Get initiative dice count for VR mode
 */
export function getInitiativeDice(vrMode: RiggerVRMode): number {
  return vrMode === "hot-sim"
    ? 1 + JUMPED_IN_HOTSIM_INITIATIVE_BONUS
    : 1 + JUMPED_IN_INITIATIVE_BONUS;
}

// =============================================================================
// STATE QUERIES
// =============================================================================

/**
 * Check if rigger is currently jumped in
 */
export function isJumpedIn(riggingState: RiggingState): boolean {
  return riggingState.jumpedInState?.isActive ?? false;
}

/**
 * Get the current jumped-in target
 */
export function getJumpedInTarget(
  riggingState: RiggingState
): { targetId: string; targetType: "vehicle" | "drone"; targetName: string } | null {
  const state = riggingState.jumpedInState;
  if (!state?.isActive) {
    return null;
  }
  return {
    targetId: state.targetId,
    targetType: state.targetType,
    targetName: state.targetName,
  };
}

/**
 * Get the current VR mode
 */
export function getCurrentVRMode(riggingState: RiggingState): RiggerVRMode | null {
  return riggingState.jumpedInState?.vrMode ?? null;
}

/**
 * Get the control bonus from VCR when jumped in
 */
export function getJumpedInControlBonus(riggingState: RiggingState): number {
  return riggingState.jumpedInState?.controlBonus ?? 0;
}

/**
 * Check if rigger's body is vulnerable
 */
export function isBodyVulnerable(riggingState: RiggingState): boolean {
  return riggingState.jumpedInState?.bodyVulnerable ?? false;
}

/**
 * Get time jumped in (in milliseconds)
 */
export function getJumpedInDuration(riggingState: RiggingState): number {
  const state = riggingState.jumpedInState;
  if (!state?.isActive || !state.jumpedInAt) {
    return 0;
  }
  return Date.now() - new Date(state.jumpedInAt).getTime();
}

// =============================================================================
// VR MODE UTILITIES
// =============================================================================

/**
 * Switch VR mode while jumped in
 * Note: This should require an action and may have consequences
 */
export function switchVRMode(
  riggingState: RiggingState,
  newMode: RiggerVRMode
): RiggingState {
  if (!riggingState.jumpedInState?.isActive) {
    return riggingState;
  }

  const initiativeDiceBonus =
    newMode === "hot-sim"
      ? JUMPED_IN_HOTSIM_INITIATIVE_BONUS
      : JUMPED_IN_INITIATIVE_BONUS;

  return {
    ...riggingState,
    jumpedInState: {
      ...riggingState.jumpedInState,
      vrMode: newMode,
      initiativeDiceBonus,
    },
    biofeedbackDamageType: newMode === "hot-sim" ? "physical" : "stun",
  };
}

/**
 * Check if using hot-sim (dangerous mode)
 */
export function isHotSim(riggingState: RiggingState): boolean {
  return riggingState.jumpedInState?.vrMode === "hot-sim";
}

/**
 * Check if using cold-sim (safer mode)
 */
export function isColdSim(riggingState: RiggingState): boolean {
  return riggingState.jumpedInState?.vrMode === "cold-sim";
}
