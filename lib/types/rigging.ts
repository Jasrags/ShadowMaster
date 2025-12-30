/**
 * Rigging Control types for Shadowrun 5E
 *
 * Types for rigger state management, vehicle control, drone networks,
 * and jumped-in status tracking.
 *
 * Based on SR5 Core Rulebook Chapter 11: Riggers
 */

import type { ID, ISODateString } from "./core";
import type { AutosoftCategory } from "./vehicles";

// =============================================================================
// RIGGING CONSTANTS
// =============================================================================

/** Maximum drones that can be slaved to an RCC based on Data Processing */
export const DRONE_SLAVE_LIMIT_MULTIPLIER = 3; // DP × 3

/** Jumped-in initiative bonus (cold-sim equivalent) */
export const JUMPED_IN_INITIATIVE_BONUS = 1; // +1D6

/** Hot-sim jumped-in initiative bonus */
export const JUMPED_IN_HOTSIM_INITIATIVE_BONUS = 2; // +2D6

/** Base vehicle condition monitor formula: Body ÷ 2 + 8 */
export const VEHICLE_CONDITION_BASE = 8;

/** Dumpshock damage for riggers */
export const DUMPSHOCK_DAMAGE = 6; // 6S for cold-sim, 6P for hot-sim

// =============================================================================
// CONTROL MODES
// =============================================================================

/**
 * Vehicle/drone control mode
 * - manual: Physical controls, no VCR required
 * - remote: AR/Matrix remote control via RCC
 * - jumped-in: Full VR immersion, requires VCR
 */
export type ControlMode = "manual" | "remote" | "jumped-in";

/**
 * VR mode for jumped-in riggers
 * - cold-sim: +1D6 initiative, biofeedback causes stun
 * - hot-sim: +2D6 initiative, biofeedback causes physical
 */
export type RiggerVRMode = "cold-sim" | "hot-sim";

/**
 * Drone command type for coordinated actions
 */
export type DroneCommandType =
  | "watch" // Passive surveillance
  | "defend" // Defensive positioning
  | "attack" // Offensive action
  | "pursue" // Follow target
  | "return" // Return to rigger
  | "hold" // Maintain position
  | "custom"; // Custom command

// =============================================================================
// VEHICLE CONTROL RIG (VCR)
// =============================================================================

/**
 * Vehicle Control Rig augmentation
 * Required for jumping into vehicles/drones
 */
export interface VehicleControlRig {
  /** VCR rating (1-3) */
  rating: number;

  /** Control bonus from VCR (+rating to vehicle tests when jumped in) */
  controlBonus: number;

  /** Initiative dice bonus when jumped in (rating in cold-sim, rating+1 in hot-sim) */
  initiativeDiceBonus: number;

  /** Essence cost */
  essenceCost: number;

  /** Cyberware grade affects essence cost */
  grade?: "standard" | "alpha" | "beta" | "delta" | "used";

  /** Reference to cyberware catalog item */
  catalogId?: string;
}

// =============================================================================
// RIGGER COMMAND CONSOLE (RCC) CONFIGURATION
// =============================================================================

/**
 * Active RCC configuration for a rigger session
 */
export interface RCCConfiguration {
  /** Reference to owned RCC */
  rccId: string;

  /** RCC name for display */
  name: string;

  /** Device rating */
  deviceRating: number;

  /** Data Processing attribute */
  dataProcessing: number;

  /** Firewall attribute */
  firewall: number;

  /** Maximum drones that can be slaved (DP × 3) */
  maxSlavedDrones: number;

  /** Currently slaved drone IDs */
  slavedDroneIds: string[];

  /** Autosofts running on RCC (shared to all drones) */
  runningAutosofts: RunningAutosoft[];

  /** Noise reduction rating from RCC */
  noiseReduction: number;

  /** Sharing bonus (RCC rating provides bonus to slaved drones) */
  sharingBonus: number;
}

/**
 * Autosoft currently running on RCC
 */
export interface RunningAutosoft {
  /** Reference to owned autosoft */
  autosoftId: string;

  /** Autosoft name */
  name: string;

  /** Rating */
  rating: number;

  /** Category */
  category: AutosoftCategory;

  /** Target for Maneuvering/Targeting autosofts */
  target?: string;
}

// =============================================================================
// DRONE NETWORK (WAN)
// =============================================================================

/**
 * Drone network state (Wide Area Network of slaved drones)
 */
export interface DroneNetwork {
  /** Network identifier for this session */
  networkId: string;

  /** RCC controlling this network */
  rccId: string;

  /** Drones currently slaved to network */
  slavedDrones: SlavedDrone[];

  /** Maximum drones allowed (RCC DP × 3) */
  maxDrones: number;

  /** Shared autosofts from RCC */
  sharedAutosofts: SharedAutosoft[];

  /** Network-wide base noise level */
  baseNoise: number;
}

/**
 * A drone slaved to an RCC network
 */
export interface SlavedDrone {
  /** Reference to owned drone */
  droneId: string;

  /** Reference to catalog drone for stats */
  catalogId: string;

  /** Drone name for display */
  name: string;

  /** Drone pilot rating (autopilot) */
  pilotRating: number;

  /** Current control mode */
  controlMode: ControlMode;

  /** Whether rigger is currently jumped into this drone */
  isJumpedIn: boolean;

  /** Current condition (damage taken) */
  conditionDamageTaken: number;

  /** Maximum condition monitor (Body ÷ 2 + 8, rounded up) */
  conditionMonitorMax: number;

  /** Current orders/command */
  currentCommand?: DroneCommandType;

  /** Custom command description */
  customCommandDescription?: string;

  /** Distance from rigger in meters (for noise calculation) */
  distanceFromRigger: number;

  /** Current noise penalty for this drone */
  noisePenalty: number;

  /** Autosofts installed directly on drone */
  installedAutosofts: InstalledAutosoft[];
}

/**
 * Autosoft installed directly on a drone
 */
export interface InstalledAutosoft {
  /** Reference to owned autosoft */
  autosoftId: string;

  /** Autosoft name */
  name: string;

  /** Rating */
  rating: number;

  /** Category */
  category: AutosoftCategory;

  /** Target for targeting autosofts */
  target?: string;
}

/**
 * Autosoft being shared from RCC to drones
 */
export interface SharedAutosoft {
  /** Autosoft ID from RCC */
  autosoftId: string;

  /** Autosoft name */
  name: string;

  /** Rating */
  rating: number;

  /** Category */
  category: AutosoftCategory;

  /** Target vehicle/weapon type (if applicable) */
  target?: string;
}

// =============================================================================
// JUMPED-IN STATE
// =============================================================================

/**
 * Jumped-in rigger state
 * Tracks the rigger's immersion in a vehicle or drone
 */
export interface JumpedInState {
  /** Whether currently jumped in */
  isActive: boolean;

  /** ID of vehicle/drone jumped into */
  targetId: string;

  /** Type of target */
  targetType: "vehicle" | "drone";

  /** Display name of target */
  targetName: string;

  /** VR mode (affects initiative and biofeedback) */
  vrMode: RiggerVRMode;

  /** When jumped in */
  jumpedInAt: ISODateString;

  /** VCR rating being used */
  vcrRating: number;

  /** Control bonus from VCR */
  controlBonus: number;

  /** Initiative dice bonus */
  initiativeDiceBonus: number;

  /** Whether rigger body is vulnerable (always true when jumped in) */
  bodyVulnerable: boolean;
}

// =============================================================================
// RIGGING SESSION STATE
// =============================================================================

/**
 * Complete rigging session state (ephemeral, scene-level)
 * Tracks all active rigging operations for a character
 */
export interface RiggingState {
  // Session info
  /** Session identifier */
  sessionId: string;

  /** Character ID */
  characterId: string;

  /** When session started */
  startedAt: ISODateString;

  // Hardware state
  /** VCR if installed */
  vcr?: VehicleControlRig;

  /** Active RCC configuration */
  rccConfig?: RCCConfiguration;

  // Drone network
  /** Active drone network */
  droneNetwork?: DroneNetwork;

  // Jumped-in state
  /** Current jumped-in state (if any) */
  jumpedInState?: JumpedInState;

  // Condition tracking
  /** Biofeedback damage taken this session */
  biofeedbackDamageTaken: number;

  /** Whether biofeedback is stun or physical (based on VR mode) */
  biofeedbackDamageType: "stun" | "physical";

  // Session tracking
  /** Whether session is active */
  isActive: boolean;

  /** Reason for session end */
  endReason?: "disconnected" | "dumpshock" | "session_ended";
}

// =============================================================================
// ACTIVE VEHICLE STATE
// =============================================================================

/**
 * Active vehicle state (when being controlled)
 */
export interface ActiveVehicleState {
  /** Reference to owned vehicle */
  vehicleId: string;

  /** Reference to catalog vehicle */
  catalogId: string;

  /** Display name */
  name: string;

  /** Current control mode */
  controlMode: ControlMode;

  /** Who is controlling (rigger jumped in, pilot autopilot, remote, or manual) */
  controlledBy: "rigger" | "pilot" | "remote" | "manual";

  /** Current speed (in meters per combat turn) */
  currentSpeed: number;

  /** Maximum speed */
  maxSpeed: number;

  /** Current handling modifier (from conditions, damage, etc.) */
  handlingModifier: number;

  /** Condition damage taken */
  conditionDamageTaken: number;

  /** Maximum condition monitor (Body ÷ 2 + 8, rounded up) */
  conditionMonitorMax: number;

  /** Active modifiers affecting vehicle stats */
  activeModifiers: VehicleModifierEffect[];
}

/**
 * Effect from vehicle modification, damage, or condition
 */
export interface VehicleModifierEffect {
  /** Source of the modifier */
  source: string;

  /** Affected attribute */
  attribute: "handling" | "speed" | "acceleration" | "body" | "armor" | "pilot" | "sensor";

  /** Modifier value (positive or negative) */
  modifier: number;
}

// =============================================================================
// NOISE CALCULATION
// =============================================================================

/**
 * Distance bands for noise calculation (SR5 p. 231)
 */
export type DistanceBand =
  | "close" // 0-100m: 0 noise
  | "near" // 101m-1km: 1 noise
  | "medium" // 1-10km: 3 noise
  | "far" // 10-100km: 5 noise
  | "extreme"; // 100km+: 8 noise

/**
 * Terrain modifier types for noise
 */
export type TerrainModifier =
  | "dense_foliage" // +1
  | "faraday_cage" // +variable
  | "jamming" // +variable
  | "spam_zone" // +1-3
  | "static_zone"; // +1-3

/**
 * Noise calculation breakdown
 */
export interface NoiseCalculation {
  /** Distance band */
  distanceBand: DistanceBand;

  /** Base distance noise */
  distanceNoise: number;

  /** Terrain/interference noise */
  terrainNoise: number;

  /** Spam zone noise */
  spamZoneNoise: number;

  /** Static zone noise */
  staticZoneNoise: number;

  /** Noise reduction from RCC */
  noiseReduction: number;

  /** Final noise value (minimum 0) */
  totalNoise: number;
}

// =============================================================================
// VEHICLE TEST TYPES
// =============================================================================

/**
 * Types of vehicle tests
 */
export type VehicleTestType =
  | "control" // Basic vehicle control
  | "chase" // Pursuit/evasion
  | "stunt" // Trick maneuvers
  | "crash_avoidance" // Avoiding crashes
  | "ramming" // Vehicle attacks
  | "sensor" // Sensor operations
  | "gunnery"; // Vehicle-mounted weapons

/**
 * Types of vehicle actions
 */
export type VehicleActionType =
  | "accelerate"
  | "decelerate"
  | "turn"
  | "catch_up"
  | "cut_off"
  | "ram"
  | "stunt"
  | "fire_weapon"
  | "sensor_targeting"
  | "evasive_driving";

// =============================================================================
// VALIDATION TYPES
// =============================================================================

/**
 * Validation error for rigging operations
 */
export interface RiggingValidationError {
  code: string;
  message: string;
  field?: string;
}

/**
 * Validation warning for rigging operations
 */
export interface RiggingValidationWarning {
  code: string;
  message: string;
  field?: string;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Request to start a rigging session
 */
export interface StartRiggingSessionRequest {
  characterId: string;
  rccId?: string;
}

/**
 * Request to update rigging state
 */
export interface UpdateRiggingStateRequest {
  /** Slave drones to RCC */
  slaveDrones?: string[];

  /** Release drones from RCC */
  releaseDrones?: string[];

  /** Jump into vehicle/drone */
  jumpIn?: {
    targetId: string;
    targetType: "vehicle" | "drone";
    vrMode: RiggerVRMode;
  };

  /** Jump out of current vehicle/drone */
  jumpOut?: boolean;

  /** Issue command to drone */
  droneCommand?: {
    droneId: string;
    command: DroneCommandType;
    customDescription?: string;
  };

  /** Load autosoft on RCC */
  loadAutosoft?: string;

  /** Unload autosoft from RCC */
  unloadAutosoft?: string;

  /** Update drone distance (for noise calculation) */
  updateDroneDistance?: {
    droneId: string;
    distanceMeters: number;
  };
}

/**
 * Response with rigging equipment and state
 */
export interface RiggingEquipmentResponse {
  /** Owned vehicles */
  vehicles: Array<{
    id: string;
    catalogId: string;
    name: string;
    customName?: string;
  }>;

  /** Owned drones */
  drones: Array<{
    id: string;
    catalogId: string;
    name: string;
    customName?: string;
    pilotRating: number;
  }>;

  /** Owned RCCs */
  rccs: Array<{
    id: string;
    catalogId: string;
    name: string;
    customName?: string;
    deviceRating: number;
    dataProcessing: number;
    firewall: number;
  }>;

  /** Owned autosofts */
  autosofts: Array<{
    id: string;
    catalogId: string;
    name: string;
    rating: number;
    category: AutosoftCategory;
    target?: string;
  }>;

  /** VCR if installed */
  vcr?: VehicleControlRig;

  /** Current rigging state (if active session) */
  riggingState?: RiggingState;
}

/**
 * Request to jump into a vehicle or drone
 */
export interface JumpInRequest {
  characterId: string;
  targetId: string;
  targetType: "vehicle" | "drone";
  vrMode: RiggerVRMode;
}

/**
 * Response from jump-in attempt
 */
export interface JumpInResponse {
  success: boolean;
  jumpedInState?: JumpedInState;
  errors?: RiggingValidationError[];
  warnings?: RiggingValidationWarning[];
}

/**
 * Request to validate a vehicle action
 */
export interface ValidateVehicleActionRequest {
  characterId: string;
  vehicleId: string;
  actionType: VehicleActionType;
}

/**
 * Response from vehicle action validation
 */
export interface ValidateVehicleActionResponse {
  valid: boolean;
  errors: RiggingValidationError[];
  warnings: RiggingValidationWarning[];
  dicePool?: number;
  limit?: number;
  controlMode?: ControlMode;
  noisePenalty?: number;
}

/**
 * Request to slave a drone to RCC
 */
export interface SlaveDroneRequest {
  characterId: string;
  droneId: string;
}

/**
 * Response from drone slaving
 */
export interface SlaveDroneResponse {
  success: boolean;
  network?: DroneNetwork;
  errors?: RiggingValidationError[];
}

/**
 * Biofeedback damage result
 */
export interface BiofeedbackResult {
  damage: number;
  damageType: "stun" | "physical";
  source: "vehicle_damage" | "dumpshock" | "forced_disconnect";
}

/**
 * Dumpshock result when forcibly disconnected
 */
export interface DumpshockResult {
  damage: number;
  damageType: "stun" | "physical";
  disoriented: boolean;
  riggingState: RiggingState;
}
