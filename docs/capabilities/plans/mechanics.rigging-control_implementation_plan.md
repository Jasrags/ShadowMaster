# Implementation Plan: Rigging Control System

## Goal Description

Implement a complete Rigging Control system that governs vehicle interactions, drone coordination, and rigger-interface safety. This capability ensures that all rigging actions are governed by edition-specific vehicle control rig (VCR) protocols, jumping-in requirements, and sensor-driven resolution, providing a stable and verifiable state for vehicle-bound entities and their coordinated drone networks.

**Target Capability:** `mechanics.rigging-control.md`

**Current State:** The codebase has comprehensive type definitions for vehicles, drones, RCCs, and autosofts in `/lib/types/vehicles.ts`. The SR5 core-rulebook.json includes vehicle catalogs, drone catalogs, RCC specifications, and autosoft definitions. Character types support vehicle/drone/RCC ownership. However, there is no enforcement of VCR requirements, no "Jumped In" state management, no drone WAN coordination, no biofeedback handling for riggers, and no integration with vehicle action resolution.

---

## User Review Required

> [!WARNING]
> **VCR Requirement Scope**: Should VCR validation be enforced at character creation (must own VCR to purchase drones), or only at action time (can own drones but can't jump in without VCR)? Recommendation: Enforce at action time for flexibility—characters may acquire VCR later.

> [!WARNING]
> **Jumped-In State Persistence**: Should Jumped-In state persist between sessions, or reset per scene? Recommendation: Ephemeral (scene-level)—rigger is vulnerable while jumped in, state resets when they "return" to meat body.

> [!WARNING]
> **Drone Damage Model**: Should drone damage be tracked on the drone entity, or centralized in a "fleet condition" tracker? Recommendation: Track per-drone with condition monitors derived from Body rating.

> [!WARNING]
> **RCC Program Sharing**: Should autosofts running on RCC be automatically shared to all slaved drones, or require explicit assignment? Recommendation: Automatic sharing per SR5 rules—RCC autosofts apply to all slaved drones.

> [!WARNING]
> **Biofeedback Integration**: Should rigger biofeedback damage integrate with existing character condition tracking or be a separate "link damage" pool? Recommendation: Integrate with existing condition tracking, similar to matrix biofeedback.

---

## Architectural Decisions (Pending Approval)

The following architectural decisions require user approval:

| Decision                     | Proposed Choice                                 | Rationale                                               |
| ---------------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| **VCR Validation**           | Validated at action time, not gear purchase     | Allows character flexibility; VCR can be acquired later |
| **Jumped-In State**          | Ephemeral (scene-level, not persisted)          | Rigger vulnerable state should reset between sessions   |
| **Drone Condition Tracking** | Per-drone with Body-derived condition monitors  | Matches SR5 rules; each drone has its own damage track  |
| **RCC Autosoft Sharing**     | Automatic to all slaved drones                  | Per SR5 rules; simplifies management                    |
| **Biofeedback Damage**       | Integrates with character condition tracking    | Consistent with matrix biofeedback handling             |
| **Noise Calculation**        | Calculated at action time from distance/terrain | Dynamic based on scenario; not persisted                |

---

## Proposed Changes

### Phase 1: Core Type Definitions

#### 1.1 Rigging State Types

**File:** [NEW] `/lib/types/rigging.ts`

Define comprehensive types for rigging state management:

```typescript
/**
 * Rigging Control types for Shadowrun 5E
 *
 * Types for rigger state management, vehicle control, drone networks,
 * and jumped-in status tracking.
 *
 * Based on SR5 Core Rulebook Chapter 11: Riggers
 */

import type { ID, ISODateString } from "./core";

// =============================================================================
// RIGGING CONSTANTS
// =============================================================================

/** Maximum drones that can be slaved to an RCC based on Data Processing */
export const DRONE_SLAVE_LIMIT_MULTIPLIER = 3; // DP × 3

/** Jumped-in initiative bonus (VR equivalent) */
export const JUMPED_IN_INITIATIVE_BONUS = 1; // +1D6

/** Hot-sim jumped-in initiative bonus */
export const JUMPED_IN_HOTSIM_INITIATIVE_BONUS = 2; // +2D6

/** Base vehicle condition monitor formula: Body ÷ 2 + 8 */
export const VEHICLE_CONDITION_BASE = 8;

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

  /** Whether VCR provides control bonuses */
  controlBonus: number; // +rating to vehicle tests

  /** Initiative dice bonus when jumped in */
  initiativeDiceBonus: number;

  /** Essence cost */
  essenceCost: number;

  /** Whether it's a used/alpha/beta/delta grade */
  grade?: "standard" | "alpha" | "beta" | "delta" | "used";
}

// =============================================================================
// RIGGER COMMAND CONSOLE (RCC)
// =============================================================================

/**
 * Active RCC configuration for a rigger session
 */
export interface RCCConfiguration {
  /** Reference to owned RCC */
  rccId: string;

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
  runningAutosofts: string[];

  /** Noise reduction rating */
  noiseReduction: number;

  /** Sharing bonus (RCC provides this to slaved drones) */
  sharingBonus: number;
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

  /** Network-wide noise level */
  currentNoise: number;
}

/**
 * A drone slaved to an RCC network
 */
export interface SlavedDrone {
  /** Reference to owned drone */
  droneId: string;

  /** Drone name for display */
  name: string;

  /** Current control mode */
  controlMode: ControlMode;

  /** Whether rigger is currently jumped into this drone */
  isJumpedIn: boolean;

  /** Current condition (damage taken) */
  conditionDamageTaken: number;

  /** Maximum condition monitor */
  conditionMonitorMax: number;

  /** Current orders/command */
  currentCommand?: DroneCommandType;

  /** Custom command description */
  customCommandDescription?: string;

  /** Distance from rigger (for noise calculation) */
  distanceFromRigger?: number;

  /** Current noise penalty for this drone */
  noisePenalty: number;

  /** Autosofts installed directly on drone */
  installedAutosofts: string[];
}

/**
 * Autosoft being shared from RCC to drones
 */
export interface SharedAutosoft {
  /** Autosoft catalog ID */
  catalogId: string;

  /** Autosoft name */
  name: string;

  /** Rating */
  rating: number;

  /** Category */
  category: "perception" | "defense" | "movement" | "combat" | "electronic-warfare" | "stealth";

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

  /** Whether rigger body is vulnerable */
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

  /** Whether biofeedback is stun or physical */
  biofeedbackDamageType: "stun" | "physical";

  // Action tracking
  /** Remaining actions for coordinated drone commands */
  droneActionsRemaining: number;

  /** Whether complex action was used this turn */
  complexActionUsed: boolean;
}

// =============================================================================
// VEHICLE STATE
// =============================================================================

/**
 * Active vehicle state (when being controlled)
 */
export interface ActiveVehicleState {
  /** Reference to owned vehicle */
  vehicleId: string;

  /** Display name */
  name: string;

  /** Current control mode */
  controlMode: ControlMode;

  /** Controller (rigger jumped in, or pilot program) */
  controlledBy: "rigger" | "pilot" | "remote" | "manual";

  /** Current speed (in meters per combat turn) */
  currentSpeed: number;

  /** Maximum speed */
  maxSpeed: number;

  /** Current handling modifier */
  handlingModifier: number;

  /** Condition damage taken */
  conditionDamageTaken: number;

  /** Maximum condition monitor */
  conditionMonitorMax: number;

  /** Active vehicle modifications affecting stats */
  activeModifiers: VehicleModifierEffect[];
}

/**
 * Effect from vehicle modification or condition
 */
export interface VehicleModifierEffect {
  source: string;
  attribute: string;
  modifier: number;
}

// =============================================================================
// NOISE CALCULATION
// =============================================================================

/**
 * Noise calculation breakdown
 */
export interface NoiseCalculation {
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

  /** Final noise value */
  totalNoise: number;
}

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
// API TYPES
// =============================================================================

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
}

/**
 * Response with rigging equipment and state
 */
export interface RiggingEquipmentResponse {
  vehicles: OwnedVehicle[];
  drones: OwnedDrone[];
  rccs: OwnedRCC[];
  autosofts: OwnedAutosoft[];
  vcr?: VehicleControlRig;
  riggingState?: RiggingState;
}
```

**Satisfies:**

- Guarantee: "Rigger identity and presence MUST be authoritative and bound to a specific vehicle control interface or drone command node"
- Requirement: "The system MUST enforce mandatory hardware-specific attribute requirements"

---

#### 1.2 Export Types

**File:** [MODIFY] `/lib/types/index.ts`

Add exports for rigging types:

```typescript
// Rigging types
export type {
  ControlMode,
  RiggerVRMode,
  DroneCommandType,
  VehicleControlRig,
  RCCConfiguration,
  DroneNetwork,
  SlavedDrone,
  SharedAutosoft,
  JumpedInState,
  RiggingState,
  ActiveVehicleState,
  VehicleModifierEffect,
  NoiseCalculation,
  RiggingValidationError,
  RiggingValidationWarning,
  UpdateRiggingStateRequest,
  RiggingEquipmentResponse,
} from "./rigging";

export {
  DRONE_SLAVE_LIMIT_MULTIPLIER,
  JUMPED_IN_INITIATIVE_BONUS,
  JUMPED_IN_HOTSIM_INITIATIVE_BONUS,
  VEHICLE_CONDITION_BASE,
} from "./rigging";
```

---

### Phase 2: Hardware Validation Services

#### 2.1 VCR Validator

**File:** [NEW] `/lib/rules/rigging/vcr-validator.ts`

```typescript
export interface VCRValidationResult {
  valid: boolean;
  errors: RiggingValidationError[];
  warnings: RiggingValidationWarning[];
  vcrRating: number;
  controlBonus: number;
  initiativeBonus: number;
}

/**
 * Check if character has a valid VCR installed
 */
export function hasVehicleControlRig(character: Character): boolean;

/**
 * Get VCR details from character's augmentations
 */
export function getVehicleControlRig(character: Character): VehicleControlRig | null;

/**
 * Validate VCR requirements for jumping in
 */
export function validateJumpInRequirements(
  character: Character,
  targetType: "vehicle" | "drone"
): VCRValidationResult;

/**
 * Calculate control bonuses from VCR rating
 */
export function calculateVCRBonuses(
  vcrRating: number,
  vrMode: RiggerVRMode
): { controlBonus: number; initiativeDice: number };
```

**Satisfies:**

- Constraint: "A character MUST NOT engage in rigging control without a valid VCR or RCC interface"
- Requirement: "The system MUST enforce mandatory hardware-specific attribute requirements"

---

#### 2.2 RCC Validator

**File:** [NEW] `/lib/rules/rigging/rcc-validator.ts`

```typescript
export interface RCCValidationResult {
  valid: boolean;
  errors: RiggingValidationError[];
  warnings: RiggingValidationWarning[];
  maxDrones: number;
  noiseReduction: number;
  dataProcessing: number;
  firewall: number;
}

/**
 * Validate RCC configuration
 */
export function validateRCCConfig(rcc: OwnedRCC, slavedDroneCount: number): RCCValidationResult;

/**
 * Calculate maximum slaved drones for RCC
 */
export function calculateMaxSlavedDrones(dataProcessing: number): number;

/**
 * Validate drone slaving to RCC
 */
export function validateDroneSlaving(
  rcc: OwnedRCC,
  currentSlaved: string[],
  droneToSlave: string
): RCCValidationResult;

/**
 * Check if autosoft can run on RCC
 */
export function validateAutosoftOnRCC(
  rcc: OwnedRCC,
  autosoftId: string,
  ruleset: LoadedRuleset
): RCCValidationResult;
```

**Satisfies:**

- Requirement: "Control interfaces MUST be uniquely identified and linked to a verifiable source of command authority"
- Requirement: "Hardware-specific limits MUST be automatically applied to all relevant rigging actions"

---

#### 2.3 Noise Calculator

**File:** [NEW] `/lib/rules/rigging/noise-calculator.ts`

```typescript
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
 * Calculate noise based on distance and conditions
 */
export function calculateNoise(
  distanceMeters: number,
  terrainModifiers: TerrainModifier[],
  rccNoiseReduction: number
): NoiseCalculation;

/**
 * Get distance band from meters
 */
export function getDistanceBand(distanceMeters: number): DistanceBand;

/**
 * Apply noise to dice pool
 */
export function applyNoiseToPool(basePool: number, noise: number): number;
```

---

### Phase 3: Drone Network Management

#### 3.1 Drone Network Manager

**File:** [NEW] `/lib/rules/rigging/drone-network.ts`

```typescript
export interface DroneNetworkResult {
  success: boolean;
  network: DroneNetwork | null;
  errors: RiggingValidationError[];
}

/**
 * Create a new drone network for RCC
 */
export function createDroneNetwork(characterId: string, rccId: string, rcc: OwnedRCC): DroneNetwork;

/**
 * Slave a drone to the network
 */
export function slaveDroneToNetwork(
  network: DroneNetwork,
  drone: OwnedDrone,
  rcc: OwnedRCC
): DroneNetworkResult;

/**
 * Release a drone from the network
 */
export function releaseDroneFromNetwork(network: DroneNetwork, droneId: string): DroneNetwork;

/**
 * Share autosoft from RCC to all slaved drones
 */
export function shareAutosoftToNetwork(
  network: DroneNetwork,
  autosoft: OwnedAutosoft
): DroneNetwork;

/**
 * Get effective autosoft rating for a drone
 * (higher of installed vs shared from RCC)
 */
export function getEffectiveAutosoftRating(
  drone: SlavedDrone,
  autosoftType: string,
  sharedAutosofts: SharedAutosoft[]
): number;

/**
 * Issue command to all drones in network
 */
export function issueNetworkCommand(
  network: DroneNetwork,
  command: DroneCommandType,
  customDescription?: string
): DroneNetwork;

/**
 * Update drone position and recalculate noise
 */
export function updateDronePosition(
  network: DroneNetwork,
  droneId: string,
  distanceMeters: number
): DroneNetwork;
```

**Satisfies:**

- Guarantee: "Drone network (WAN) states MUST be persistent, governing the coordination and limits of multiple subordinate entities"
- Requirement: "Coordinated drone actions MUST be constrained by RCC-specific processing limits and active program sets"

---

#### 3.2 Drone Condition Tracker

**File:** [NEW] `/lib/rules/rigging/drone-condition.ts`

```typescript
export interface DroneConditionResult {
  conditionMonitorMax: number;
  currentDamage: number;
  damageModifier: number;
  isDestroyed: boolean;
}

/**
 * Calculate drone condition monitor from Body
 */
export function calculateDroneConditionMonitor(body: number): number;

/**
 * Apply damage to drone
 */
export function applyDroneDamage(
  drone: SlavedDrone,
  damage: number,
  damageType: "physical"
): SlavedDrone;

/**
 * Repair drone damage
 */
export function repairDroneDamage(drone: SlavedDrone, healAmount: number): SlavedDrone;

/**
 * Get damage modifier for drone (wound penalties)
 */
export function getDroneDamageModifier(drone: SlavedDrone): number;

/**
 * Check if drone is destroyed
 */
export function isDroneDestroyed(drone: SlavedDrone): boolean;
```

---

### Phase 4: Jumped-In State Tracking

#### 4.1 Jumped-In Manager

**File:** [NEW] `/lib/rules/rigging/jumped-in-manager.ts`

```typescript
export interface JumpInResult {
  success: boolean;
  jumpedInState: JumpedInState | null;
  errors: RiggingValidationError[];
  warnings: RiggingValidationWarning[];
}

/**
 * Attempt to jump into a vehicle or drone
 */
export function jumpIn(
  character: Character,
  targetId: string,
  targetType: "vehicle" | "drone",
  vrMode: RiggerVRMode
): JumpInResult;

/**
 * Jump out of current vehicle/drone
 */
export function jumpOut(riggingState: RiggingState): RiggingState;

/**
 * Handle forced ejection (dumpshock)
 */
export interface EjectionResult {
  riggingState: RiggingState;
  dumpshockDamage: number;
  damageType: "stun" | "physical";
  disoriented: boolean;
}

export function handleForcedEjection(
  riggingState: RiggingState,
  reason: "vehicle_destroyed" | "link_severed" | "jammed"
): EjectionResult;

/**
 * Calculate initiative when jumped in
 */
export function calculateJumpedInInitiative(
  baseInitiative: number,
  vcrRating: number,
  vrMode: RiggerVRMode
): { initiative: number; initiativeDice: number };

/**
 * Check if rigger body is vulnerable
 */
export function isRiggerBodyVulnerable(jumpedInState: JumpedInState): boolean;
```

**Satisfies:**

- Guarantee: "The system MUST enforce authoritative 'Biofeedback' resolution to ensure rigger safety and state integrity during digital-physical transitions"
- Requirement: "'Jumped In' status MUST be persistent and verifiable, impacting both the rigger's physical state and the vehicle's maneuverability"

---

#### 4.2 Biofeedback Handler

**File:** [NEW] `/lib/rules/rigging/biofeedback-handler.ts`

```typescript
export interface BiofeedbackResult {
  damage: number;
  damageType: "stun" | "physical";
  applied: boolean;
  characterCondition: {
    stunDamage: number;
    physicalDamage: number;
    overflow: number;
  };
}

/**
 * Calculate biofeedback damage for rigger
 */
export function calculateBiofeedbackDamage(
  vehicleDamage: number,
  vrMode: RiggerVRMode,
  vcrRating: number
): BiofeedbackResult;

/**
 * Apply biofeedback damage to character
 */
export function applyBiofeedbackDamage(
  character: Character,
  damage: number,
  damageType: "stun" | "physical"
): Character;

/**
 * Determine damage type from VR mode
 */
export function getBiofeedbackDamageType(vrMode: RiggerVRMode): "stun" | "physical";

/**
 * Calculate dumpshock damage
 */
export function calculateDumpshockDamage(vrMode: RiggerVRMode): {
  damage: number;
  damageType: "stun" | "physical";
};
```

---

### Phase 5: Vehicle Action Integration

#### 5.1 Vehicle Action Validator

**File:** [NEW] `/lib/rules/rigging/action-validator.ts`

```typescript
export interface VehicleActionValidation {
  valid: boolean;
  errors: RiggingValidationError[];
  warnings: RiggingValidationWarning[];
  controlMode: ControlMode;
  applicableBonuses: ActionBonus[];
  noisePenalty: number;
}

export interface ActionBonus {
  source: string;
  attribute?: string;
  value: number;
}

/**
 * Validate that a vehicle action can be performed
 */
export function validateVehicleAction(
  character: Character,
  riggingState: RiggingState,
  actionType: VehicleActionType,
  targetVehicle: string
): VehicleActionValidation;

/**
 * Get control mode bonuses for action
 */
export function getControlModeBonus(controlMode: ControlMode, vcrRating?: number): number;

/**
 * Check if action requires jumped-in status
 */
export function requiresJumpedIn(actionType: VehicleActionType): boolean;

/**
 * Get applicable autosofts for action
 */
export function getApplicableAutosofts(
  action: VehicleActionType,
  drone: SlavedDrone,
  sharedAutosofts: SharedAutosoft[]
): SharedAutosoft[];
```

**Satisfies:**

- Guarantee: "Vehicle interactions MUST adhere to strictly defined control protocols and action economy rules"
- Requirement: "The system MUST provide Authoritative resolution for rigging actions"

---

#### 5.2 Vehicle Dice Pool Calculator

**File:** [NEW] `/lib/rules/rigging/dice-pool-calculator.ts`

```typescript
export interface VehicleDicePoolResult {
  pool: number;
  formula: string;
  breakdown: DicePoolComponent[];
  limit: number;
  limitType: "handling" | "speed" | "sensor";
}

export interface DicePoolComponent {
  source: string;
  attribute?: string;
  skill?: string;
  autosoft?: string;
  modifier?: number;
  value: number;
}

/**
 * Calculate dice pool for vehicle test
 */
export function calculateVehicleDicePool(
  character: Character,
  riggingState: RiggingState,
  testType: VehicleTestType,
  vehicle: OwnedVehicle | SlavedDrone
): VehicleDicePoolResult;

/**
 * Calculate dice pool for drone using autosofts
 */
export function calculateDroneDicePool(
  drone: SlavedDrone,
  testType: VehicleTestType,
  sharedAutosofts: SharedAutosoft[],
  pilotRating: number
): VehicleDicePoolResult;

/**
 * Calculate vehicle limit for test
 */
export function calculateVehicleLimit(
  vehicle: OwnedVehicle | SlavedDrone,
  testType: VehicleTestType
): number;

/**
 * Apply control mode bonus to pool
 */
export function applyControlModeBonus(
  pool: number,
  controlMode: ControlMode,
  vcrRating?: number
): number;

/**
 * Apply sensor targeting bonus
 */
export function applySensorBonus(
  pool: number,
  sensorRating: number,
  hasTargetingAutosoft: boolean
): number;
```

**Satisfies:**

- Requirement: "Hardware-specific limits MUST be automatically applied to all relevant rigging actions"
- Requirement: "The system MUST automatically update rigger potential based on active sensor modifications and hardware state transitions"

---

### Phase 6: Ruleset Content Management

#### 6.1 Rigging Hooks

**File:** [MODIFY] `/lib/rules/RulesetContext.tsx`

Add hooks for rigging content:

```typescript
/**
 * Hook to get all vehicles from the ruleset
 */
export function useVehicles(): VehicleCatalogItem[];

/**
 * Hook to get vehicles by category
 */
export function useVehiclesByCategory(category: VehicleCategory): VehicleCatalogItem[];

/**
 * Hook to get all drones from the ruleset
 */
export function useDrones(): DroneCatalogItem[];

/**
 * Hook to get drones by size
 */
export function useDronesBySize(size: DroneSize): DroneCatalogItem[];

/**
 * Hook to get all RCCs from the ruleset
 */
export function useRCCs(): RCCCatalogItem[];

/**
 * Hook to get all autosofts from the ruleset
 */
export function useAutosofts(): AutosoftCatalogItem[];

/**
 * Hook to get autosofts by category
 */
export function useAutosoftsByCategory(category: AutosoftCategory): AutosoftCatalogItem[];

/**
 * Hook to get vehicle modifications
 */
export function useVehicleModifications(): VehicleModificationCatalogItem[];
```

---

#### 6.2 Ruleset Content Extraction

**File:** [MODIFY] `/lib/rules/loader.ts`

Add extraction functions for rigging content:

```typescript
/**
 * Extract vehicles from a loaded ruleset
 */
export function extractVehicles(ruleset: LoadedRuleset): VehicleCatalogItem[];

/**
 * Extract drones from a loaded ruleset
 */
export function extractDrones(ruleset: LoadedRuleset): DroneCatalogItem[];

/**
 * Extract RCCs from a loaded ruleset
 */
export function extractRCCs(ruleset: LoadedRuleset): RCCCatalogItem[];

/**
 * Extract autosofts from a loaded ruleset
 */
export function extractAutosofts(ruleset: LoadedRuleset): AutosoftCatalogItem[];

/**
 * Extract vehicle modifications from a loaded ruleset
 */
export function extractVehicleModifications(
  ruleset: LoadedRuleset
): VehicleModificationCatalogItem[];
```

---

### Phase 7: API Layer

#### 7.1 Rigging State API

**File:** [NEW] `/app/api/characters/[characterId]/rigging/route.ts`

```typescript
// GET: Get character's rigging equipment and current state
// Response: { vehicles, drones, rccs, autosofts, vcr?, riggingState? }

// PATCH: Update rigging state (slave drones, jump in/out, commands)
// Request: UpdateRiggingStateRequest
// Response: { riggingState, errors?, warnings? }
```

---

#### 7.2 Drone Network API

**File:** [NEW] `/app/api/characters/[characterId]/rigging/drones/route.ts`

```typescript
// GET: Get drone network status
// Response: { network, slavedDrones, maxDrones }

// POST: Slave drone to network
// Request: { droneId }
// Response: { success, network, errors? }

// DELETE: Release drone from network
// Request: { droneId }
// Response: { success, network }
```

---

#### 7.3 Jump-In API

**File:** [NEW] `/app/api/characters/[characterId]/rigging/jump/route.ts`

```typescript
// POST: Jump into vehicle/drone
// Request: { targetId, targetType, vrMode }
// Response: { success, jumpedInState, errors?, warnings? }

// DELETE: Jump out
// Response: { success, riggingState }
```

---

#### 7.4 Vehicle Validation API

**File:** [NEW] `/app/api/rigging/validate/route.ts`

```typescript
// POST: Validate vehicle action
// Request: { characterId, vehicleId, actionType }
// Response: { valid, errors, warnings, dicePool, limit }
```

---

### Phase 8: UI Components

#### 8.1 Rigging Summary Panel

**File:** [NEW] `/components/character/RiggingSummary.tsx`

Display on character sheet:

- VCR status and rating
- Active RCC and attributes
- Drone network count (slaved/max)
- Current jumped-in status (if any)
- Quick action buttons

---

#### 8.2 Drone Network Manager

**File:** [NEW] `/components/character/DroneNetworkManager.tsx`

- List of owned drones with slave status
- Slave/release controls
- Drone condition monitors
- Command issuance interface
- Distance/noise display

---

#### 8.3 Jump-In Control

**File:** [NEW] `/components/character/JumpInControl.tsx`

- Available vehicles/drones to jump into
- VR mode selection (cold-sim/hot-sim)
- VCR bonus display
- Current vehicle stats when jumped in
- Jump out button with confirmation

---

#### 8.4 Vehicle Actions Panel

**File:** [NEW] `/components/character/VehicleActions.tsx`

- Available vehicle actions by category
- Dice pool preview with autosofts
- Control mode bonus display
- Noise penalty indicator
- Quick-action buttons

---

#### 8.5 Autosoft Manager

**File:** [NEW] `/components/character/AutosoftManager.tsx`

- Owned autosofts list
- Load/unload on RCC
- Target assignment for autosofts
- Rating display
- Sharing indicator (RCC → drones)

---

## Verification Plan

### Automated Tests

#### Unit Tests

**File:** [NEW] `/lib/rules/rigging/__tests__/vcr-validator.test.ts`

| Test Case                              | Capability Reference                                    |
| -------------------------------------- | ------------------------------------------------------- |
| Validates VCR presence for jump-in     | Constraint: "MUST NOT engage without valid VCR"         |
| Calculates VCR control bonus correctly | Requirement: "hardware-specific attribute requirements" |
| Validates VR mode affects initiative   | Requirement: "Jumped In status impacts maneuverability" |
| Rejects jump-in without VCR            | Constraint: "MUST NOT engage without valid VCR"         |

**File:** [NEW] `/lib/rules/rigging/__tests__/rcc-validator.test.ts`

| Test Case                         | Capability Reference                              |
| --------------------------------- | ------------------------------------------------- |
| Validates RCC drone slave limit   | Requirement: "constrained by RCC-specific limits" |
| Calculates max drones from DP × 3 | Requirement: "RCC Data Processing limits"         |
| Validates autosoft compatibility  | Requirement: "active program sets"                |
| Rejects exceeding slave limit     | Requirement: "constrained by RCC-specific limits" |

**File:** [NEW] `/lib/rules/rigging/__tests__/drone-network.test.ts`

| Test Case                   | Capability Reference                              |
| --------------------------- | ------------------------------------------------- |
| Creates network correctly   | Guarantee: "WAN states MUST be persistent"        |
| Slaves drones within limit  | Requirement: "constrained by RCC-specific limits" |
| Shares autosofts to network | Requirement: "coordinated drone actions"          |
| Issues network commands     | Requirement: "coordinated drone actions"          |

**File:** [NEW] `/lib/rules/rigging/__tests__/jumped-in-manager.test.ts`

| Test Case                        | Capability Reference                           |
| -------------------------------- | ---------------------------------------------- |
| Tracks jumped-in state correctly | Requirement: "persistent and verifiable"       |
| Handles forced ejection          | Guarantee: "Biofeedback resolution"            |
| Calculates biofeedback correctly | Guarantee: "Biofeedback resolution"            |
| Marks body as vulnerable         | Requirement: "impacts rigger's physical state" |

**File:** [NEW] `/lib/rules/rigging/__tests__/noise-calculator.test.ts`

| Test Case                       | Capability Reference                    |
| ------------------------------- | --------------------------------------- |
| Calculates distance noise bands | Requirement: "hardware-specific limits" |
| Applies RCC noise reduction     | Requirement: "RCC Noise Reduction"      |
| Combines terrain modifiers      | Requirement: "hardware-specific limits" |

**File:** [NEW] `/lib/rules/rigging/__tests__/dice-pool-calculator.test.ts`

| Test Case                     | Capability Reference                    |
| ----------------------------- | --------------------------------------- |
| Calculates vehicle test pools | Requirement: "Authoritative resolution" |
| Applies control mode bonus    | Requirement: "control protocols"        |
| Includes autosoft ratings     | Requirement: "sensor modifications"     |
| Applies noise penalty         | Requirement: "hardware-specific limits" |

---

#### Integration Tests

**File:** [NEW] `/lib/rules/rigging/__tests__/rigging-flow.integration.test.ts`

| Test Case                           | Capability Reference                       |
| ----------------------------------- | ------------------------------------------ |
| Full rigger with VCR + RCC + drones | Full system integration                    |
| Drone network session lifecycle     | Guarantee: "WAN states MUST be persistent" |
| Jump-in/out with biofeedback        | Guarantee: "Biofeedback resolution"        |
| Vehicle destruction handling        | Guarantee: "rigger safety"                 |

---

#### API Tests

**File:** [NEW] `/app/api/characters/[characterId]/rigging/__tests__/route.test.ts`

| Test Case                 | Capability Reference                        |
| ------------------------- | ------------------------------------------- |
| Returns rigging equipment | Requirement: "hardware-specific attributes" |
| Updates rigging state     | Requirement: "control protocols"            |
| Requires authentication   | Security requirement                        |

---

### Manual Verification Checklist

1. **Hardware Configuration**
   - [ ] Create rigger character with VCR and RCC
   - [ ] Verify VCR rating affects control bonuses
   - [ ] Verify RCC limits drone slaving correctly
   - [ ] Attempt to exceed drone limit (should fail)

2. **Drone Network Management**
   - [ ] Slave drones to RCC up to limit
   - [ ] Load autosofts on RCC
   - [ ] Verify autosofts shared to all drones
   - [ ] Release drones from network

3. **Jump-In Operations**
   - [ ] Jump into vehicle with VCR
   - [ ] Verify initiative bonus applied
   - [ ] Verify body vulnerability status
   - [ ] Jump out and verify state reset
   - [ ] Test forced ejection (dumpshock)

4. **Vehicle Actions**
   - [ ] Perform vehicle test while jumped in
   - [ ] Verify control mode bonus applied
   - [ ] Verify handling limit applied
   - [ ] Test with noise penalty

5. **Drone Commands**
   - [ ] Issue command to single drone
   - [ ] Issue command to entire network
   - [ ] Verify autosofts apply to drone tests
   - [ ] Track drone damage correctly

6. **Character Sheet Display**
   - [ ] Verify Rigging Summary shows VCR/RCC
   - [ ] Verify drone network displays correctly
   - [ ] Verify dice pool previews are accurate

---

## Implementation Order

```
Phase 1: Core Type Definitions
├── 1.1 Rigging State Types (/lib/types/rigging.ts)
└── 1.2 Export Types (/lib/types/index.ts)

Phase 2: Hardware Validation Services
├── 2.1 VCR Validator
├── 2.2 RCC Validator
└── 2.3 Noise Calculator

Phase 3: Drone Network Management
├── 3.1 Drone Network Manager
└── 3.2 Drone Condition Tracker

Phase 4: Jumped-In State Tracking
├── 4.1 Jumped-In Manager
└── 4.2 Biofeedback Handler

Phase 5: Vehicle Action Integration
├── 5.1 Vehicle Action Validator
└── 5.2 Vehicle Dice Pool Calculator

Phase 6: Ruleset Content Management
├── 6.1 Rigging Hooks (RulesetContext.tsx)
└── 6.2 Ruleset Content Extraction (loader.ts)

Phase 7: API Layer
├── 7.1 Rigging State API
├── 7.2 Drone Network API
├── 7.3 Jump-In API
└── 7.4 Vehicle Validation API

Phase 8: UI Components
├── 8.1 Rigging Summary Panel
├── 8.2 Drone Network Manager
├── 8.3 Jump-In Control
├── 8.4 Vehicle Actions Panel
└── 8.5 Autosoft Manager
```

---

## Dependencies

### Required Before Implementation

- `ruleset.integrity` ✅ - For authoritative ruleset data access
- `character.management` ✅ - For character state management
- Vehicles/Drones catalog in core-rulebook.json ✅ - Exists
- Vehicle types in `/lib/types/vehicles.ts` ✅ - Exists

### Recommended Before Implementation

- `mechanics.action-resolution` ✅ - For vehicle action dice pool integration
- `mechanics.matrix-operations` ✅ - For RCC as matrix device integration

### Will Integrate With

- `mechanics.action-execution` ✅ - For vehicle action execution flow
- `character.advancement` ✅ - For skill advancement (Pilot Ground/Air/Water, Gunnery)
- `mechanics.encounter-governance` - For vehicle combat encounters (future)

---

## Future Phases (Out of Scope)

The following are explicitly out of scope for this implementation:

1. **Vehicle Combat Resolution** - Full vehicular combat with pursuit rules
2. **Drone AI Behavior** - Autonomous drone decision-making when not commanded
3. **Vehicle Modification Workflow** - Installing/removing vehicle mods
4. **Swarm Rules** - Drone swarm coordination beyond RCC slaving
5. **Electronic Warfare** - Full EW rules for signal jamming/spoofing
6. **Repair Mechanics** - Detailed vehicle/drone repair rules
7. **Pilot Program Behavior** - Autonomous pilot program actions
8. **Sensor Array Operations** - Detailed sensor sweep mechanics
