/**
 * Biofeedback Handler for Riggers
 *
 * Handles biofeedback damage when a rigger is jumped into a vehicle/drone
 * that takes damage, or when they're forcibly disconnected (dumpshock).
 *
 * SR5 Core Rulebook p. 229 (Biofeedback), p. 265-266 (Rigger rules)
 */

import type { Character } from "@/lib/types/character";
import type {
  RiggingState,
  RiggerVRMode,
  BiofeedbackResult,
  DumpshockResult,
} from "@/lib/types/rigging";
import { DUMPSHOCK_DAMAGE } from "@/lib/types/rigging";

// =============================================================================
// RESULT TYPES
// =============================================================================

export interface BiofeedbackDamageResult {
  damage: number;
  damageType: "stun" | "physical";
  source: string;
  appliedToCharacter: boolean;
  characterStunDamage: number;
  characterPhysicalDamage: number;
  overflow: number;
  unconscious: boolean;
  dead: boolean;
}

export interface ForcedEjectionResult {
  riggingState: RiggingState;
  dumpshockDamage: number;
  damageType: "stun" | "physical";
  disoriented: boolean;
  previousTarget: string | null;
  reason: "vehicle_destroyed" | "link_severed" | "jammed" | "ic_attack";
}

// =============================================================================
// BIOFEEDBACK DAMAGE TYPE
// =============================================================================

/**
 * Determine biofeedback damage type based on VR mode
 * - Cold-sim: Stun damage
 * - Hot-sim: Physical damage
 */
export function getBiofeedbackDamageType(vrMode: RiggerVRMode): "stun" | "physical" {
  return vrMode === "hot-sim" ? "physical" : "stun";
}

/**
 * Get damage type from rigging state
 */
export function getCurrentBiofeedbackType(riggingState: RiggingState): "stun" | "physical" {
  return riggingState.biofeedbackDamageType;
}

// =============================================================================
// BIOFEEDBACK DAMAGE CALCULATION
// =============================================================================

/**
 * Calculate biofeedback damage when vehicle/drone takes damage
 *
 * Per SR5, when a jumped-in rigger's vehicle takes damage,
 * the rigger takes biofeedback damage equal to half the vehicle damage
 * (rounded down), as stun (cold-sim) or physical (hot-sim).
 */
export function calculateBiofeedbackFromVehicleDamage(
  vehicleDamage: number,
  vrMode: RiggerVRMode
): BiofeedbackResult {
  const damage = Math.floor(vehicleDamage / 2);
  const damageType = getBiofeedbackDamageType(vrMode);

  return {
    damage,
    damageType,
    source: "vehicle_damage",
  };
}

/**
 * Calculate dumpshock damage for forced disconnection
 *
 * Per SR5 p. 229, dumpshock causes 6 damage:
 * - 6S if using cold-sim
 * - 6P if using hot-sim
 */
export function calculateDumpshockDamage(vrMode: RiggerVRMode): BiofeedbackResult {
  return {
    damage: DUMPSHOCK_DAMAGE,
    damageType: getBiofeedbackDamageType(vrMode),
    source: "dumpshock",
  };
}

// =============================================================================
// DAMAGE APPLICATION
// =============================================================================

/**
 * Apply biofeedback damage to character
 *
 * Note: This function calculates the result but doesn't mutate the character.
 * The caller should update the character's condition based on the result.
 */
export function applyBiofeedbackDamage(
  character: Character,
  damage: number,
  damageType: "stun" | "physical",
  source: string
): BiofeedbackDamageResult {
  // Get current damage levels
  const currentStun = character.condition?.stunDamage ?? 0;
  const currentPhysical = character.condition?.physicalDamage ?? 0;

  // Calculate stun/physical condition monitor max
  // Stun: (Willpower / 2) + 8, rounded up
  // Physical: (Body / 2) + 8, rounded up
  const willpower = character.attributes?.willpower ?? 3;
  const body = character.attributes?.body ?? 3;
  const stunMax = Math.ceil(willpower / 2) + 8;
  const physicalMax = Math.ceil(body / 2) + 8;

  let newStun = currentStun;
  let newPhysical = currentPhysical;
  let overflow = 0;

  if (damageType === "stun") {
    newStun += damage;
    // Check for stun overflow -> physical
    if (newStun > stunMax) {
      const stunOverflow = newStun - stunMax;
      newStun = stunMax;
      newPhysical += stunOverflow;
    }
  } else {
    newPhysical += damage;
  }

  // Check for physical overflow (death)
  if (newPhysical > physicalMax) {
    overflow = newPhysical - physicalMax;
    newPhysical = physicalMax;
  }

  // Determine status
  const unconscious = newStun >= stunMax || newPhysical >= physicalMax;
  const dead = overflow >= body;

  return {
    damage,
    damageType,
    source,
    appliedToCharacter: true,
    characterStunDamage: newStun,
    characterPhysicalDamage: newPhysical,
    overflow,
    unconscious,
    dead,
  };
}

/**
 * Track biofeedback damage in rigging state (session-level)
 */
export function trackBiofeedbackDamage(riggingState: RiggingState, damage: number): RiggingState {
  return {
    ...riggingState,
    biofeedbackDamageTaken: riggingState.biofeedbackDamageTaken + damage,
  };
}

// =============================================================================
// FORCED EJECTION (DUMPSHOCK)
// =============================================================================

/**
 * Handle forced ejection from vehicle/drone
 *
 * This occurs when:
 * - Vehicle/drone is destroyed
 * - Link is severed (jammer, etc.)
 * - IC successfully crashes the connection
 */
export function handleForcedEjection(
  riggingState: RiggingState,
  reason: "vehicle_destroyed" | "link_severed" | "jammed" | "ic_attack"
): ForcedEjectionResult {
  const jumpedInState = riggingState.jumpedInState;
  const previousTarget = jumpedInState?.targetName ?? null;
  const vrMode = jumpedInState?.vrMode ?? "cold-sim";

  // Calculate dumpshock
  const dumpshock = calculateDumpshockDamage(vrMode);

  // Clear jumped-in state and update drone network
  let updatedNetwork = riggingState.droneNetwork;
  if (jumpedInState?.targetType === "drone" && updatedNetwork) {
    updatedNetwork = {
      ...updatedNetwork,
      slavedDrones: updatedNetwork.slavedDrones.map((drone) =>
        drone.droneId === jumpedInState.targetId
          ? { ...drone, isJumpedIn: false, controlMode: "remote" as const }
          : drone
      ),
    };
  }

  // Update rigging state
  const updatedRiggingState: RiggingState = {
    ...riggingState,
    jumpedInState: undefined,
    droneNetwork: updatedNetwork,
    biofeedbackDamageTaken: riggingState.biofeedbackDamageTaken + dumpshock.damage,
    endReason: "dumpshock",
    isActive: false,
  };

  return {
    riggingState: updatedRiggingState,
    dumpshockDamage: dumpshock.damage,
    damageType: dumpshock.damageType,
    disoriented: true, // Rigger is disoriented after dumpshock
    previousTarget,
    reason,
  };
}

/**
 * Create dumpshock result for API response
 */
export function createDumpshockResult(
  vrMode: RiggerVRMode,
  riggingState: RiggingState
): DumpshockResult {
  const dumpshock = calculateDumpshockDamage(vrMode);

  return {
    damage: dumpshock.damage,
    damageType: dumpshock.damageType,
    disoriented: true,
    riggingState,
  };
}

// =============================================================================
// DAMAGE RESISTANCE
// =============================================================================

/**
 * Calculate dice pool for biofeedback resistance
 *
 * Per SR5, biofeedback resistance uses Willpower + Firewall
 * For riggers, this uses the vehicle/drone's Firewall (device rating)
 */
export function calculateBiofeedbackResistancePool(
  willpower: number,
  deviceRating: number
): number {
  return willpower + deviceRating;
}

/**
 * Reduce biofeedback damage based on resistance hits
 */
export function reduceBiofeedbackDamage(baseDamage: number, resistanceHits: number): number {
  return Math.max(0, baseDamage - resistanceHits);
}

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get total biofeedback damage taken this session
 */
export function getTotalBiofeedbackDamage(riggingState: RiggingState): number {
  return riggingState.biofeedbackDamageTaken;
}

/**
 * Check if rigger is at risk of unconsciousness from biofeedback
 */
export function isBiofeedbackDangerous(riggingState: RiggingState, character: Character): boolean {
  const currentBiofeedback = riggingState.biofeedbackDamageTaken;
  const damageType = riggingState.biofeedbackDamageType;

  if (damageType === "stun") {
    const willpower = character.attributes?.willpower ?? 3;
    const stunMax = Math.ceil(willpower / 2) + 8;
    const currentStun = character.condition?.stunDamage ?? 0;
    return currentStun + currentBiofeedback >= stunMax * 0.75;
  } else {
    const body = character.attributes?.body ?? 3;
    const physicalMax = Math.ceil(body / 2) + 8;
    const currentPhysical = character.condition?.physicalDamage ?? 0;
    return currentPhysical + currentBiofeedback >= physicalMax * 0.75;
  }
}

/**
 * Get biofeedback warning level
 */
export function getBiofeedbackWarningLevel(
  riggingState: RiggingState,
  character: Character
): "safe" | "caution" | "danger" | "critical" {
  const currentBiofeedback = riggingState.biofeedbackDamageTaken;
  const damageType = riggingState.biofeedbackDamageType;

  const relevantAttr =
    damageType === "stun"
      ? (character.attributes?.willpower ?? 3)
      : (character.attributes?.body ?? 3);
  const monitorMax = Math.ceil(relevantAttr / 2) + 8;
  const currentDamage =
    damageType === "stun"
      ? (character.condition?.stunDamage ?? 0)
      : (character.condition?.physicalDamage ?? 0);

  const totalPotentialDamage = currentDamage + currentBiofeedback;
  const percentage = totalPotentialDamage / monitorMax;

  if (percentage < 0.25) return "safe";
  if (percentage < 0.5) return "caution";
  if (percentage < 0.75) return "danger";
  return "critical";
}

// =============================================================================
// HOT-SIM SPECIFIC WARNINGS
// =============================================================================

/**
 * Check if rigger should be warned about hot-sim dangers
 */
export function shouldWarnAboutHotSim(riggingState: RiggingState): boolean {
  const jumpedInState = riggingState.jumpedInState;
  if (!jumpedInState?.isActive) {
    return false;
  }
  return jumpedInState.vrMode === "hot-sim";
}

/**
 * Get hot-sim risk description
 */
export function getHotSimRiskDescription(): string {
  return (
    "Hot-sim VR provides +2D6 initiative but biofeedback causes PHYSICAL damage. " +
    "Dumpshock will cause 6P damage. Use with caution."
  );
}

/**
 * Get cold-sim benefits description
 */
export function getColdSimBenefitsDescription(): string {
  return (
    "Cold-sim VR provides +1D6 initiative and biofeedback causes stun damage. " +
    "Dumpshock will cause 6S damage. Safer for extended operations."
  );
}
