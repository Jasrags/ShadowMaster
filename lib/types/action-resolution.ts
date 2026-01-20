/**
 * Action Resolution Types
 *
 * Types for the probabilistic action resolution system including
 * dice pools, results, Edge interventions, and audit history.
 */

import type { ID, ISODateString } from "./core";

// =============================================================================
// DICE RESULT TYPES
// =============================================================================

/**
 * Result of a single die roll
 */
export interface DiceResult {
  /** The value rolled (1-6 for d6) */
  value: number;
  /** Whether this die counts as a hit (value >= hitThreshold) */
  isHit: boolean;
  /** Whether this die shows a 1 (for glitch calculation) */
  isOne: boolean;
  /** Whether this die was rerolled via Edge */
  wasRerolled?: boolean;
  /** Original value before reroll (if rerolled) */
  originalValue?: number;
  /** Whether this die exploded (6 that was rerolled in Push the Limit) */
  isExploded?: boolean;
}

// =============================================================================
// POOL CONFIGURATION TYPES
// =============================================================================

/**
 * Source of a pool modifier
 */
export type PoolModifierSource =
  | "attribute"
  | "skill"
  | "specialization"
  | "wound"
  | "situational"
  | "equipment"
  | "quality"
  | "environmental"
  | "sustaining"
  | "edge"
  | "limit"
  | "encumbrance"
  | "wireless"
  | "other";

/**
 * A modifier applied to an action pool
 */
export interface PoolModifier {
  /** Source category of the modifier */
  source: PoolModifierSource;
  /** Numeric value of the modifier (can be negative) */
  value: number;
  /** Human-readable description */
  description: string;
}

/**
 * Configuration for an action pool before rolling
 */
export interface ActionPool {
  /** Base dice from attribute + skill (before modifiers) */
  basePool: number;
  /** Attribute used (if applicable) */
  attribute?: string;
  /** Skill used (if applicable) */
  skill?: string;
  /** Specialization applied (if any) */
  specialization?: string;
  /** All modifiers applied to the pool */
  modifiers: PoolModifier[];
  /** Final total dice to roll (basePool + sum of modifiers, minimum 0) */
  totalDice: number;
  /** Limit applied to hits (if any) */
  limit?: number;
  /** Source of the limit (Physical, Mental, Social, weapon accuracy, etc.) */
  limitSource?: string;
}

/**
 * Options for building an action pool
 */
export interface PoolBuildOptions {
  /** Attribute to use */
  attribute?: string;
  /** Skill to use */
  skill?: string;
  /** Specialization to apply (+2 dice) */
  specialization?: string;
  /** Manual base pool override (ignores attribute/skill) */
  manualPool?: number;
  /** Additional situational modifiers */
  situationalModifiers?: PoolModifier[];
  /** Whether to include wound modifiers (default: true) */
  includeWoundModifiers?: boolean;
  /** Limit to apply */
  limit?: number;
  /** Source of the limit */
  limitSource?: string;
}

// =============================================================================
// ACTION RESULT TYPES
// =============================================================================

/**
 * Context describing what action was attempted
 */
export interface ActionContext {
  /** Type of action (attack, defense, skill test, etc.) */
  actionType?: string;
  /** Skill used for the test */
  skillUsed?: string;
  /** Attribute used for the test */
  attributeUsed?: string;
  /** Threshold needed for success (if applicable) */
  threshold?: number;
  /** Whether this was an opposed test */
  isOpposed?: boolean;
  /** Description of what was attempted */
  description?: string;
  /** Target of the action (if applicable) */
  targetName?: string;
  /** Notes about the action */
  notes?: string;
  /** Tags for categorization */
  tags?: string[];
}

/**
 * Complete result of an action resolution
 */
export interface ActionResult {
  /** Unique identifier for this action */
  id: ID;
  /** Character who performed the action */
  characterId: ID;
  /** User who owns the character */
  userId: ID;
  /** Pool configuration used */
  pool: ActionPool;
  /** Individual dice results */
  dice: DiceResult[];
  /** Total hits scored (limited by pool.limit if set) */
  hits: number;
  /** Raw hits before limit applied */
  rawHits: number;
  /** Number of 1s rolled */
  ones: number;
  /** Whether a glitch occurred (>50% 1s) */
  isGlitch: boolean;
  /** Whether a critical glitch occurred (glitch + 0 hits) */
  isCriticalGlitch: boolean;
  /** Amount of Edge spent on this action */
  edgeSpent: number;
  /** Type of Edge action used (if any) */
  edgeAction?: EdgeActionType;
  /** Number of rerolls performed */
  rerollCount: number;
  /** When this action was performed */
  timestamp: ISODateString;
  /** Context about what was being attempted */
  context?: ActionContext;
  /** Previous result if this is a reroll */
  previousResultId?: ID;
}

// =============================================================================
// EDGE ACTION TYPES
// =============================================================================

/**
 * Types of Edge actions available
 */
export type EdgeActionType =
  | "push-the-limit" // Add Edge dice, exploding 6s
  | "second-chance" // Reroll failures
  | "seize-the-initiative" // Go first in combat
  | "blitz" // Extra initiative dice
  | "close-call" // Negate a glitch
  | "dead-mans-trigger"; // Act when incapacitated

/**
 * Configuration for an Edge action
 */
export interface EdgeActionConfig {
  /** Display name */
  name: string;
  /** Description of the effect */
  description: string;
  /** Edge cost (usually 1) */
  cost: number;
  /** Whether this can be used after rolling */
  postRoll: boolean;
  /** Whether this can be used before rolling */
  preRoll: boolean;
  /** Whether this adds dice */
  addsDice?: boolean;
  /** Whether this allows rerolling */
  allowsReroll?: boolean;
  /** Whether sixes explode (reroll and add) */
  explodingSixes?: boolean;
}

// =============================================================================
// EDITION DICE RULES
// =============================================================================

/**
 * Edition-specific dice mechanics configuration
 */
export interface EditionDiceRules {
  /** Minimum die value that counts as a hit (SR5: 5) */
  hitThreshold: number;
  /** Fraction of pool that must be 1s for glitch (SR5: 0.5 = more than half) */
  glitchThreshold: number;
  /** Whether critical glitch requires zero hits (SR5: true) */
  criticalGlitchRequiresZeroHits: boolean;
  /** Whether sixes explode in certain circumstances (SR4) */
  allowExplodingSixes?: boolean;
  /** Maximum dice that can be rolled in a single pool */
  maxDicePool?: number;
  /** Minimum dice (pools below this may auto-fail or use special rules) */
  minDicePool?: number;
  /** Available Edge actions for this edition */
  edgeActions: Record<EdgeActionType, EdgeActionConfig>;
  /** Wound modifier configuration */
  woundModifiers: {
    /** How many damage boxes per -1 penalty */
    boxesPerPenalty: number;
    /** Maximum wound penalty (negative number) */
    maxPenalty: number;
  };
}

// =============================================================================
// ACTION HISTORY TYPES
// =============================================================================

/**
 * Persistent history of actions for a character
 */
export interface ActionHistory {
  /** Character this history belongs to */
  characterId: ID;
  /** All action results, newest first */
  actions: ActionResult[];
  /** When the history was created */
  createdAt: ISODateString;
  /** When the history was last updated */
  updatedAt: ISODateString;
}

/**
 * Summary statistics for action history
 */
export interface ActionHistoryStats {
  /** Total actions recorded */
  totalActions: number;
  /** Total hits scored */
  totalHits: number;
  /** Total glitches */
  totalGlitches: number;
  /** Total critical glitches */
  totalCriticalGlitches: number;
  /** Total Edge spent */
  totalEdgeSpent: number;
  /** Average hits per roll */
  averageHits: number;
  /** Most used skill */
  mostUsedSkill?: string;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Request to perform an action roll
 */
export interface RollActionRequest {
  /** Pool configuration */
  pool: PoolBuildOptions | ActionPool;
  /** Context for the action */
  context?: ActionContext;
  /** Edge action to use (pre-roll) */
  edgeAction?: EdgeActionType;
}

/**
 * Request to reroll an action using Edge
 */
export interface RerollActionRequest {
  /** ID of the action to reroll */
  actionId: ID;
  /** Edge action type (must be post-roll capable) */
  edgeAction: EdgeActionType;
}

/**
 * Request to spend or restore Edge
 */
export interface EdgeRequest {
  /** Action: spend or restore */
  action: "spend" | "restore";
  /** Amount to spend/restore */
  amount: number;
  /** Reason for the change */
  reason?: string;
}

/**
 * Response for action roll
 */
export interface ActionResultResponse {
  /** Whether the operation succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** The action result */
  result?: ActionResult;
  /** Updated Edge balance */
  edgeCurrent?: number;
  /** Maximum Edge */
  edgeMaximum?: number;
}

/**
 * Response for action history query
 */
export interface ActionHistoryResponse {
  /** Whether the operation succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Action history */
  history?: ActionHistory;
  /** Summary statistics */
  stats?: ActionHistoryStats;
}

/**
 * Response for Edge operations
 */
export interface EdgeResponse {
  /** Whether the operation succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Current Edge balance */
  edgeCurrent?: number;
  /** Maximum Edge */
  edgeMaximum?: number;
}

// =============================================================================
// ACTIVITY TYPES (for audit logging)
// =============================================================================

/**
 * Activity types for action resolution audit logging
 */
export type ActionActivityType =
  | "action_rolled"
  | "action_rerolled"
  | "edge_spent"
  | "edge_restored"
  | "glitch_occurred"
  | "critical_glitch_occurred";
