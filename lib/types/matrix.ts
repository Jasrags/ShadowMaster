/**
 * Matrix Operations types for Shadowrun 5E
 *
 * Types for matrix state management, personas, overwatch tracking,
 * and matrix action resolution.
 *
 * Based on SR5 Core Rulebook Chapter 10: The Matrix
 */

import type { ID, ISODateString, ItemLegality } from "./core";
import type { DeviceCondition, GearState } from "./gear-state";

// =============================================================================
// MATRIX CONSTANTS
// =============================================================================

/** Default Overwatch Score threshold before convergence */
export const OVERWATCH_THRESHOLD = 40;

/** Maximum marks that can be placed on a single target */
export const MAX_MARKS = 3;

/** Base matrix condition monitor formula: Device Rating + 8 */
export const MATRIX_CONDITION_BASE = 8;

// =============================================================================
// MATRIX CONNECTION
// =============================================================================

/**
 * Matrix connection mode
 * - ar: Augmented Reality (no VR bonuses, physical awareness)
 * - cold-sim-vr: Cold-sim VR (+1 initiative die, biofeedback causes stun)
 * - hot-sim-vr: Hot-sim VR (+2 initiative dice, biofeedback causes physical)
 */
export type MatrixMode = "ar" | "cold-sim-vr" | "hot-sim-vr";

/**
 * Device type for matrix operations
 * - cyberdeck: Full hacking capability, reconfigurable ASDF
 * - commlink: Basic matrix access, fixed attributes
 * - rcc: Rigger command console for drone control
 * - technomancer-living-persona: Technomancer's innate matrix presence
 */
export type MatrixDeviceType = "cyberdeck" | "commlink" | "rcc" | "technomancer-living-persona";

// =============================================================================
// CYBERDECK ATTRIBUTE CONFIGURATION
// =============================================================================

/**
 * Cyberdeck attribute configuration (ASDF)
 * Cyberdecks have an attribute array that can be assigned to:
 * - Attack: Offensive matrix actions
 * - Sleaze: Covert matrix actions
 * - Data Processing: Speed and data handling
 * - Firewall: Defensive matrix actions
 */
export interface CyberdeckAttributeConfig {
  attack: number;
  sleaze: number;
  dataProcessing: number;
  firewall: number;
}

// =============================================================================
// MATRIX PERSONA
// =============================================================================

/**
 * Matrix persona representation
 * The persona is the character's digital self in the Matrix
 */
export interface MatrixPersona {
  /** Unique persona identifier for this session */
  personaId: string;

  /** Optional custom icon description */
  iconDescription?: string;

  /** Persona attributes (derived from deck config + programs) */
  attack: number;
  sleaze: number;
  dataProcessing: number;
  firewall: number;

  /** Device Rating (determines matrix condition monitor size) */
  deviceRating: number;
}

// =============================================================================
// LOADED PROGRAMS
// =============================================================================

/**
 * Program effect types
 */
export type ProgramEffectType =
  | "attribute_bonus" // Bonus to ASDF attribute
  | "action_bonus" // Bonus to specific action
  | "defense_bonus" // Bonus to defense tests
  | "damage_bonus" // Bonus to matrix damage
  | "special"; // Special effects (described in description)

/**
 * Program effect on matrix stats
 */
export interface ProgramEffect {
  type: ProgramEffectType;
  /** Target attribute or action */
  target?: string;
  /** Numeric bonus value */
  value?: number;
  /** Description of effect */
  description?: string;
}

/**
 * A program currently loaded and running on a device
 */
export interface LoadedProgram {
  /** Unique ID for this loaded instance */
  programId: string;

  /** Reference to program catalog ID */
  catalogId: string;

  /** Program name */
  name: string;

  /** Program category */
  category: "common" | "hacking" | "agent";

  /** Rating (for agent programs) */
  rating?: number;

  /** Whether the program is currently running */
  isRunning: boolean;

  /** Calculated effects from this program */
  effects?: ProgramEffect[];
}

// =============================================================================
// MATRIX MARKS
// =============================================================================

/**
 * Target types for matrix marks
 */
export type MarkTargetType =
  | "device" // Hardware device
  | "persona" // User's matrix presence
  | "file" // Data file
  | "host" // Matrix host
  | "ic"; // Intrusion Countermeasures

/**
 * Matrix mark (authorization level)
 * Marks represent access levels on matrix entities
 * 1 mark = User access
 * 2 marks = Security access
 * 3 marks = Admin access
 */
export interface MatrixMark {
  /** Unique mark identifier */
  id: string;

  /** ID of the marked target */
  targetId: string;

  /** Type of target */
  targetType: MarkTargetType;

  /** Display name of target */
  targetName: string;

  /** Number of marks (1-3) */
  markCount: number;

  /** When the mark was placed */
  placedAt: ISODateString;

  /** When the mark expires (if applicable) */
  expiresAt?: ISODateString;
}

// =============================================================================
// OVERWATCH SCORE
// =============================================================================

/**
 * Overwatch Score event for audit trail
 * Tracks each action that increased the decker's OS
 */
export interface OverwatchEvent {
  /** When the event occurred */
  timestamp: ISODateString;

  /** Action that triggered OS increase */
  action: string;

  /** Amount of OS added */
  scoreAdded: number;

  /** Total OS after this event */
  totalScore: number;

  /** Whether this event triggered convergence */
  triggeredConvergence?: boolean;
}

/**
 * Session-level Overwatch tracking
 * OS is ephemeral - it resets when the decker jacks out
 */
export interface OverwatchSession {
  /** Unique session identifier */
  sessionId: string;

  /** Character being tracked */
  characterId: string;

  /** When the matrix session started */
  startedAt: ISODateString;

  /** Current Overwatch Score */
  currentScore: number;

  /** Threshold for convergence (default: 40) */
  threshold: number;

  /** History of OS events */
  events: OverwatchEvent[];

  /** Whether convergence has been triggered */
  converged: boolean;

  /** When convergence was triggered */
  convergedAt?: ISODateString;

  /** Reason for session end */
  endReason?: "jacked_out" | "converged" | "session_ended" | "link_locked";
}

// =============================================================================
// MATRIX HOST (Reference types for runtime)
// =============================================================================

/**
 * Host authorization levels
 */
export type HostAuthLevel = "outsider" | "user" | "security" | "admin";

// =============================================================================
// MATRIX STATE
// =============================================================================

/**
 * Character's current matrix state (ephemeral, session-level)
 * This tracks the runtime state of a character's matrix presence
 */
export interface MatrixState {
  // Connection status
  /** Whether connected to the Matrix */
  isConnected: boolean;

  /** Current connection mode */
  connectionMode: MatrixMode;

  // Active hardware
  /** ID of active matrix device */
  activeDeviceId?: string;

  /** Type of active device */
  activeDeviceType?: MatrixDeviceType;

  // Cyberdeck configuration (for deckers)
  /** Current ASDF configuration */
  attributeConfig?: CyberdeckAttributeConfig;

  // Persona state
  /** Current matrix persona */
  persona: MatrixPersona;

  // Running programs
  /** Programs currently loaded */
  loadedPrograms: LoadedProgram[];

  /** Number of program slots used */
  programSlotsUsed: number;

  /** Maximum program slots available */
  programSlotsMax: number;

  // Matrix condition
  /** Size of matrix condition monitor (Device Rating + 8) */
  matrixConditionMonitor: number;

  /** Matrix damage taken */
  matrixDamageTaken: number;

  // Overwatch Score (session-level)
  /** Current Overwatch Score */
  overwatchScore: number;

  /** Threshold for convergence (default: 40) */
  overwatchThreshold: number;

  /** Whether convergence has occurred */
  overwatchConverged: boolean;

  // Marks
  /** Marks this persona has placed on other targets */
  marksHeld: MatrixMark[];

  /** Marks other entities have placed on this persona */
  marksReceived: MatrixMark[];

  // Location in matrix
  /** Current grid (if any) */
  currentGrid?: string;

  /** Current host (if inside one) */
  currentHost?: string;

  /** Authorization level in current host */
  hostAuthLevel?: HostAuthLevel;

  // Session tracking
  /** When the matrix session started */
  sessionStartedAt?: ISODateString;
}

// =============================================================================
// CONVERGENCE
// =============================================================================

/**
 * IC spawn data when convergence occurs
 */
export interface ICSpawnData {
  /** Type of IC being spawned */
  icType: string;

  /** Rating of the IC */
  rating: number;

  /** Initiative score */
  initiative?: number;
}

/**
 * Result of convergence handling
 */
export interface ConvergenceResult {
  /** Whether OS was reset */
  osReset: boolean;

  /** Whether dump shock was triggered */
  dumpshockTriggered: boolean;

  /** Whether persona was destroyed */
  personaDestroyed: boolean;

  /** IC spawned by GOD */
  icDispatched: ICSpawnData[];

  /** Damage dealt (if any) */
  damageDealt?: number;

  /** Damage type */
  damageType?: "stun" | "physical";
}

// =============================================================================
// MATRIX ACTION TYPES
// =============================================================================

/**
 * Categories of matrix actions
 */
export type MatrixActionCategory =
  | "attack" // Offensive actions (Brute Force, Data Spike)
  | "sleaze" // Covert actions (Hack on the Fly, Snoop)
  | "device" // Device control (Control Device, Format Device)
  | "file" // File manipulation (Edit File, Crash Program)
  | "persona" // Persona actions (Matrix Perception, Jack Out)
  | "complex_form"; // Technomancer abilities

/**
 * Whether an action is legal or illegal
 * Illegal actions increase Overwatch Score
 */
export type MatrixActionLegality = "legal" | "illegal";

/**
 * Matrix action definition for validation
 */
export interface MatrixAction {
  /** Action identifier */
  id: string;

  /** Action name */
  name: string;

  /** Action category */
  category: MatrixActionCategory;

  /** Whether this is a legal or illegal action */
  legality: MatrixActionLegality;

  /** Marks required on target (0-3) */
  marksRequired: number;

  /** Attribute used for limit */
  limitAttribute: "attack" | "sleaze" | "dataProcessing" | "firewall";

  /** Skill used (typically "hacking" or "computer") */
  skill: string;

  /** Attribute used with skill */
  attribute: string;

  /** Programs that provide bonuses */
  relevantPrograms?: string[];

  /** Description of the action */
  description?: string;
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

/**
 * Validation error for matrix operations
 */
export interface MatrixValidationError {
  code: string;
  message: string;
  field?: string;
}

/**
 * Validation warning for matrix operations
 */
export interface MatrixValidationWarning {
  code: string;
  message: string;
  field?: string;
}

// =============================================================================
// CHARACTER MATRIX EQUIPMENT
// =============================================================================

/**
 * Cyberdeck owned by a character
 */
export interface CharacterCyberdeck {
  id?: ID;

  /** Reference to catalog cyberdeck ID */
  catalogId: string;

  /** Base name from catalog */
  name: string;

  /** Custom name given by player */
  customName?: string;

  /** Device Rating */
  deviceRating: number;

  /** Attribute array from catalog (values to assign to ASDF) */
  attributeArray: number[];

  /** Current attribute assignment */
  currentConfig: CyberdeckAttributeConfig;

  /** Max program slots */
  programSlots: number;

  /** IDs of currently loaded programs */
  loadedPrograms: string[];

  /** Cost in nuyen */
  cost: number;

  /** Availability rating */
  availability: number;

  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;

  /** Player notes */
  notes?: string;

  // -------------------------------------------------------------------------
  // Inventory State (ADR-010)
  // -------------------------------------------------------------------------

  /**
   * Equipment state: readiness, wireless
   */
  state?: GearState;

  /**
   * Device condition for Matrix damage tracking.
   * Bricked devices cannot be used until repaired.
   * @default "functional"
   */
  condition?: DeviceCondition;
}

/**
 * Commlink owned by a character (simpler than cyberdeck)
 */
export interface CharacterCommlink {
  id?: ID;

  /** Reference to catalog commlink ID */
  catalogId: string;

  /** Base name from catalog */
  name: string;

  /** Custom name given by player */
  customName?: string;

  /** Device Rating */
  deviceRating: number;

  /** Data Processing (derived from device rating in SR5) */
  dataProcessing: number;

  /** Firewall (derived from device rating in SR5) */
  firewall: number;

  /** Cost in nuyen */
  cost: number;

  /** Availability rating */
  availability: number;

  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;

  /** Running programs (limited functionality) */
  loadedPrograms?: string[];

  /** Player notes */
  notes?: string;

  // -------------------------------------------------------------------------
  // Inventory State (ADR-010)
  // -------------------------------------------------------------------------

  /**
   * Equipment state: readiness, wireless
   */
  state?: GearState;

  /**
   * Device condition for Matrix damage tracking.
   * Bricked devices cannot be used until repaired.
   * @default "functional"
   */
  condition?: DeviceCondition;
}

// =============================================================================
// CATALOG TYPES (for ruleset data)
// =============================================================================

/**
 * Cyberdeck catalog item in ruleset data
 */
export interface CyberdeckCatalogItem {
  id: string;
  name: string;

  /** Device Rating (determines matrix condition monitor) */
  deviceRating: number;

  /** Attribute values to distribute to ASDF */
  attributes: CyberdeckAttributeConfig;

  /** Number of program slots */
  programs: number;

  /** Cost in nuyen */
  cost: number;

  /** Availability rating */
  availability: number;

  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;

  /** Description */
  description?: string;

  /** Page reference */
  page?: number;

  /** Source book */
  source?: string;
}

/**
 * Commlink catalog item in ruleset data
 */
export interface CommlinkCatalogItem {
  id: string;
  name: string;

  /** Device Rating (determines DP and Firewall in SR5) */
  deviceRating: number;

  /** Cost in nuyen */
  cost: number;

  /** Availability rating */
  availability: number;

  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;

  /** Description */
  description?: string;

  /** Page reference */
  page?: number;

  /** Source book */
  source?: string;
}

/**
 * Matrix actions module in ruleset data
 */
export interface MatrixActionsModule {
  /** All defined matrix actions */
  actions: MatrixAction[];
}

// =============================================================================
// API TYPES
// =============================================================================

/**
 * Request to update matrix state
 */
export interface UpdateMatrixStateRequest {
  /** Programs to load */
  loadPrograms?: string[];

  /** Programs to unload */
  unloadPrograms?: string[];

  /** New deck configuration */
  deckConfig?: CyberdeckAttributeConfig;

  /** Connect to matrix */
  connect?: {
    mode: MatrixMode;
    deviceId: string;
  };

  /** Disconnect from matrix */
  disconnect?: boolean;
}

/**
 * Response with matrix equipment and state
 */
export interface MatrixEquipmentResponse {
  cyberdecks: CharacterCyberdeck[];
  commlinks: CharacterCommlink[];
  programs: {
    catalogId: string;
    name: string;
    category: string;
    loaded: boolean;
  }[];
  matrixState?: MatrixState;
}

/**
 * Request to validate matrix configuration
 */
export interface ValidateMatrixConfigRequest {
  characterId: string;
  deckId: string;
  programIds: string[];
  config: CyberdeckAttributeConfig;
}

/**
 * Response from matrix validation
 */
export interface ValidateMatrixConfigResponse {
  valid: boolean;
  errors: MatrixValidationError[];
  warnings: MatrixValidationWarning[];
  effectiveStats: CyberdeckAttributeConfig;
}

/**
 * Request to record overwatch event
 */
export interface RecordOverwatchRequest {
  characterId: string;
  sessionId: string;
  action: string;
  scoreAdded: number;
}

/**
 * Response from overwatch recording
 */
export interface OverwatchResponse {
  currentScore: number;
  threshold: number;
  convergenceTriggered: boolean;
  events: OverwatchEvent[];
}
