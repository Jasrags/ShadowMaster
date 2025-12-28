/**
 * Combat Session Types
 *
 * Types for managing combat sessions, participants, and action economy.
 * Implements the action economy system (Free, Simple, Complex, Interrupt)
 * with server-side persistence for multiplayer campaign support.
 */

import type { ID, ISODateString } from "./core";

// =============================================================================
// COMBAT SESSION TYPES
// =============================================================================

/**
 * Status of a combat session
 */
export type CombatSessionStatus = "active" | "paused" | "completed" | "abandoned";

/**
 * Phase within a combat round
 */
export type CombatPhase =
  | "initiative" // Rolling/declaring initiative
  | "action" // Main action phase
  | "resolution"; // End of round cleanup

/**
 * Environment conditions that may affect combat
 */
export interface EnvironmentConditions {
  /** Lighting conditions */
  visibility?: "normal" | "dim" | "dark" | "pitch-black";
  /** Weather effects */
  weather?: "clear" | "rain" | "fog" | "storm" | "extreme";
  /** Terrain type */
  terrain?: "urban" | "wilderness" | "indoor" | "vehicle" | "water" | "astral";
  /** Background count for magic (negative = aspected against, positive = aspected for) */
  backgroundCount?: number;
  /** Noise level for Matrix (adds to Matrix actions threshold) */
  noise?: number;
  /** Custom modifiers */
  customModifiers?: EnvironmentModifier[];
}

/**
 * A custom environment modifier
 */
export interface EnvironmentModifier {
  name: string;
  description: string;
  /** Pool modifier (negative = penalty) */
  poolModifier: number;
  /** What actions this affects */
  affectsActions?: string[];
}

/**
 * A complete combat session
 */
export interface CombatSession {
  /** Unique identifier */
  id: ID;
  /** Campaign this combat belongs to (optional for standalone) */
  campaignId?: ID;
  /** User who created/owns the session */
  ownerId: ID;
  /** Edition code for rules lookup */
  editionCode: string;
  /** Display name for the combat */
  name?: string;
  /** All participants in this combat */
  participants: CombatParticipant[];
  /** Ordered list of participant IDs by initiative (highest first) */
  initiativeOrder: ID[];
  /** Current position in initiative order (0-indexed) */
  currentTurn: number;
  /** Current phase of combat */
  currentPhase: CombatPhase;
  /** Current round number (starts at 1) */
  round: number;
  /** Session status */
  status: CombatSessionStatus;
  /** Environment conditions */
  environment: EnvironmentConditions;
  /** When the session was created */
  createdAt: ISODateString;
  /** When the session was last updated */
  updatedAt: ISODateString;
  /** When the session ended (if completed/abandoned) */
  endedAt?: ISODateString;
  /** Notes about the combat */
  notes?: string;
}

// =============================================================================
// PARTICIPANT TYPES
// =============================================================================

/**
 * Status of a participant in combat
 */
export type ParticipantStatus =
  | "active" // Taking normal turns
  | "delayed" // Chose to delay action
  | "out" // Incapacitated, fled, or otherwise not participating
  | "waiting"; // Waiting for async response (e.g., defense roll)

/**
 * Type of entity participating in combat
 */
export type ParticipantType =
  | "character" // Player character
  | "npc" // Non-player character (full stats)
  | "grunt" // Grunt team (simplified rules)
  | "spirit" // Summoned spirit
  | "drone" // Autonomous drone
  | "device"; // Matrix device/IC

/**
 * A participant in a combat session
 */
export interface CombatParticipant {
  /** Unique identifier for this participation instance */
  id: ID;
  /** Type of participant */
  type: ParticipantType;
  /** ID of the character/NPC/grunt/etc. */
  entityId: ID;
  /** Display name for the participant */
  name: string;
  /** Current initiative score */
  initiativeScore: number;
  /** Initiative dice result breakdown */
  initiativeDice?: number[];
  /** Actions remaining this turn */
  actionsRemaining: ActionAllocation;
  /** Pending interrupt actions to resolve */
  interruptsPending: PendingInterrupt[];
  /** Current participant status */
  status: ParticipantStatus;
  /** User ID who controls this participant (for authorization) */
  controlledBy: ID;
  /** Whether this is a GM-controlled entity */
  isGMControlled: boolean;
  /** Current wound/damage state (cached for quick reference) */
  woundModifier: number;
  /** Active conditions affecting this participant */
  conditions: ActiveCondition[];
  /** Notes about this participant */
  notes?: string;
}

/**
 * An active condition affecting a participant
 */
export interface ActiveCondition {
  /** Condition identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of effect */
  description: string;
  /** Rounds remaining (undefined = permanent until removed) */
  roundsRemaining?: number;
  /** Pool modifier applied */
  poolModifier?: number;
  /** Whether this prevents actions */
  preventsActions?: boolean;
  /** Source of the condition */
  source?: string;
}

// =============================================================================
// ACTION ECONOMY TYPES
// =============================================================================

/**
 * Type of action in the SR5 action economy
 */
export type ActionType = "free" | "simple" | "complex" | "interrupt";

/**
 * Allocation of available actions for a participant's turn
 */
export interface ActionAllocation {
  /**
   * Free actions remaining
   * Typically unlimited, but some may have restrictions
   */
  free: number;
  /**
   * Simple actions remaining
   * Standard: 2 per turn (or can be used for 1 complex action)
   */
  simple: number;
  /**
   * Complex actions remaining
   * Standard: 1 per turn (consumes both simple actions)
   */
  complex: number;
  /**
   * Whether interrupt action is available
   * One interrupt per initiative pass, costs initiative score
   */
  interrupt: boolean;
}

/**
 * Default action allocation for a new turn
 */
export const DEFAULT_ACTION_ALLOCATION: ActionAllocation = {
  free: 999, // Effectively unlimited
  simple: 2,
  complex: 1,
  interrupt: true,
};

/**
 * A pending interrupt action that needs resolution
 */
export interface PendingInterrupt {
  /** Unique ID for this interrupt */
  id: ID;
  /** Type of interrupt (Block, Dodge, Full Defense, etc.) */
  interruptType: string;
  /** Participant who triggered the interrupt */
  triggeredBy: ID;
  /** Action that triggered this interrupt */
  triggeringActionId: ID;
  /** Initiative cost of this interrupt */
  initiativeCost: number;
  /** When the interrupt was declared */
  declaredAt: ISODateString;
  /** Whether the interrupt has been resolved */
  resolved: boolean;
}

// =============================================================================
// INITIATIVE TYPES
// =============================================================================

/**
 * Initiative roll result
 */
export interface InitiativeRoll {
  /** Base initiative (REA + INT + bonuses) */
  baseInitiative: number;
  /** Number of initiative dice */
  initiativeDice: number;
  /** Individual dice results */
  diceResults: number[];
  /** Total initiative score */
  total: number;
  /** Whether Edge was used (Blitz or Seize the Initiative) */
  edgeUsed?: "blitz" | "seize_the_initiative";
}

/**
 * Initiative pass tracking (for multiple passes in SR5)
 */
export interface InitiativePass {
  /** Pass number (1, 2, 3, etc.) */
  passNumber: number;
  /** Participants who have actions this pass */
  activeParticipants: ID[];
  /** Whether this pass is complete */
  completed: boolean;
}

// =============================================================================
// OPPOSED TEST TYPES
// =============================================================================

/**
 * Mode for resolving opposed tests
 */
export type OpposedTestMode =
  | "synchronous" // Both pools resolved together (solo/GM-controlled)
  | "asynchronous"; // Defender responds separately (real-time play)

/**
 * State of an opposed test
 */
export type OpposedTestState =
  | "pending_attacker" // Waiting for attacker roll
  | "pending_defender" // Waiting for defender roll
  | "resolved"; // Both sides rolled, result determined

/**
 * An opposed test between two participants
 */
export interface OpposedTest {
  /** Unique identifier */
  id: ID;
  /** Combat session this belongs to */
  combatSessionId: ID;
  /** Attacker/initiator participant ID */
  attackerId: ID;
  /** Defender/reactor participant ID */
  defenderId: ID;
  /** Resolution mode */
  mode: OpposedTestMode;
  /** Current state */
  state: OpposedTestState;
  /** Attacker's action result ID (when rolled) */
  attackerActionId?: ID;
  /** Attacker's hits */
  attackerHits?: number;
  /** Defender's action result ID (when rolled) */
  defenderActionId?: ID;
  /** Defender's hits */
  defenderHits?: number;
  /** Net hits (attacker - defender) */
  netHits?: number;
  /** When the test was initiated */
  initiatedAt: ISODateString;
  /** When the test was resolved */
  resolvedAt?: ISODateString;
  /** Timeout for async defender response (in seconds) */
  timeout?: number;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Request to create a new combat session
 */
export interface CreateCombatSessionRequest {
  campaignId?: ID;
  name?: string;
  environment?: EnvironmentConditions;
  participants?: CreateParticipantRequest[];
}

/**
 * Request to add a participant
 */
export interface CreateParticipantRequest {
  type: ParticipantType;
  entityId: ID;
  name: string;
  controlledBy: ID;
  isGMControlled?: boolean;
}

/**
 * Request to update a combat session
 */
export interface UpdateCombatSessionRequest {
  name?: string;
  status?: CombatSessionStatus;
  environment?: EnvironmentConditions;
  notes?: string;
}

/**
 * Request to roll initiative for a combat participant
 */
export interface CombatInitiativeRequest {
  participantId: ID;
  /** Manual initiative score (for NPCs/GM override) */
  manualScore?: number;
  /** Edge action to use */
  edgeAction?: "blitz" | "seize_the_initiative";
}

/**
 * Request to execute an action
 */
export interface ExecuteActionRequest {
  participantId: ID;
  actionDefinitionId: string;
  targetId?: ID;
  modifiers?: ActionModifierInput[];
  edgeAction?: string;
}

/**
 * Input modifier for an action
 */
export interface ActionModifierInput {
  source: string;
  value: number;
  description: string;
}

/**
 * Response for combat session operations
 */
export interface CombatSessionResponse {
  success: boolean;
  error?: string;
  session?: CombatSession;
}

/**
 * Response for listing combat sessions
 */
export interface CombatSessionsListResponse {
  success: boolean;
  error?: string;
  sessions?: CombatSession[];
}

/**
 * Response for initiative roll
 */
export interface InitiativeRollResponse {
  success: boolean;
  error?: string;
  roll?: InitiativeRoll;
  participant?: CombatParticipant;
  updatedOrder?: ID[];
}

/**
 * Response for action execution
 */
export interface ActionExecutionResponse {
  success: boolean;
  error?: string;
  actionId?: ID;
  hits?: number;
  isGlitch?: boolean;
  isCriticalGlitch?: boolean;
  actionsRemaining?: ActionAllocation;
  stateChanges?: StateChange[];
  opposedTest?: OpposedTest;
}

/**
 * A state change resulting from an action
 */
export interface StateChange {
  entityId: ID;
  entityType: ParticipantType | "combat_session";
  field: string;
  previousValue: unknown;
  newValue: unknown;
  description: string;
}

// =============================================================================
// ACTIVITY TYPES (for audit logging)
// =============================================================================

/**
 * Activity types for combat session audit logging
 */
export type CombatActivityType =
  | "combat_started"
  | "combat_ended"
  | "participant_added"
  | "participant_removed"
  | "initiative_rolled"
  | "turn_started"
  | "action_executed"
  | "interrupt_declared"
  | "interrupt_resolved"
  | "round_completed"
  | "environment_changed"
  | "participant_incapacitated";
