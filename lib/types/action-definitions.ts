/**
 * Action Definition Types
 *
 * Types for defining actions in the Shadowrun action economy.
 * Actions are data-driven definitions that specify costs, prerequisites,
 * effects, and validation rules. The actual action definitions are
 * loaded from edition-specific JSON files.
 */

import type { ID } from "./core";
import type { ActionType } from "./combat";
import type { PoolModifier } from "./action-resolution";

// =============================================================================
// EXECUTION DOMAIN TYPES
// =============================================================================

/**
 * Domain/category of an action
 */
export type ExecutionDomain =
  | "combat" // Physical combat actions
  | "magic" // Spellcasting, summoning, etc.
  | "matrix" // Hacking, Matrix combat
  | "social" // Social skill tests
  | "vehicle" // Vehicle/drone operations
  | "general"; // General actions (perception, etc.)

/**
 * Sub-category for more specific filtering
 */
export type ActionSubcategory =
  // Combat subcategories
  | "melee"
  | "ranged"
  | "defense"
  | "movement"
  | "tactical"
  // Magic subcategories
  | "spellcasting"
  | "summoning"
  | "banishing"
  | "ritual"
  | "enchanting"
  | "astral"
  // Matrix subcategories
  | "hacking"
  | "cybercombat"
  | "electronic-warfare"
  | "technomancer"
  // Social subcategories
  | "influence"
  | "performance"
  | "intimidation"
  // General subcategories
  | "perception"
  | "knowledge"
  | "technical"
  | "physical";

// =============================================================================
// ACTION COST TYPES
// =============================================================================

/**
 * Resource type that can be spent
 */
export type ResourceType =
  | "edge"
  | "initiative"
  | "ammunition"
  | "reagent"
  | "complex_form_fade"
  | "spell_drain"
  | "stun"
  | "karma"
  | "nuyen";

/**
 * Cost in terms of a specific resource
 */
export interface ResourceCost {
  /** Type of resource consumed */
  type: ResourceType;
  /** Amount consumed (can be a formula) */
  amount: number | string;
  /** Description of the cost */
  description?: string;
  /** Whether this is optional (e.g., Edge for Push the Limit) */
  optional?: boolean;
}

/**
 * Complete cost specification for an action
 */
export interface ActionCost {
  /** Action economy cost (free/simple/complex/interrupt) */
  actionType: ActionType;
  /** Initiative score penalty for interrupt actions */
  initiativeCost?: number;
  /** Additional resource costs */
  resourceCosts?: ResourceCost[];
}

// =============================================================================
// PREREQUISITE TYPES
// =============================================================================

/**
 * Type of prerequisite that must be met
 */
export type PrerequisiteType =
  | "skill" // Must have a specific skill
  | "skill_rating" // Must have skill at minimum rating
  | "attribute" // Must have a specific attribute
  | "attribute_rating" // Must have attribute at minimum rating
  | "quality" // Must have a specific quality
  | "equipment" // Must have specific equipment available
  | "equipment_ready" // Equipment must be readied/drawn
  | "state" // Must be in a specific state (standing, not surprised, etc.)
  | "condition" // Must have/not have a condition
  | "resource" // Must have minimum resource (ammo, Edge, etc.)
  | "target" // Must have valid target
  | "magic" // Must be Awakened
  | "technomancer" // Must be a Technomancer
  | "vehicle"; // Must be controlling a vehicle

/**
 * A prerequisite that must be met to attempt an action
 */
export interface ActionPrerequisite {
  /** Type of prerequisite */
  type: PrerequisiteType;
  /** What is required (skill name, attribute code, equipment type, etc.) */
  requirement: string;
  /** Minimum value if applicable (rating, amount, etc.) */
  minimumValue?: number;
  /** Whether this is a "must NOT have" requirement */
  negated?: boolean;
  /** Human-readable description of the requirement */
  description?: string;
}

// =============================================================================
// EFFECT TYPES
// =============================================================================

/**
 * Type of effect an action can produce
 */
export type ActionEffectType =
  | "damage" // Deal damage to target
  | "heal" // Restore damage
  | "condition" // Apply a condition
  | "condition_remove" // Remove a condition
  | "resource_modify" // Modify a resource (Edge, ammo, etc.)
  | "state_change" // Change character state
  | "pool_modifier" // Apply a dice pool modifier
  | "initiative_modifier" // Modify initiative score
  | "movement" // Move the character
  | "terrain" // Modify terrain/environment
  | "summon" // Summon a spirit/sprite
  | "dismiss" // Dismiss a summoned entity
  | "mark" // Place a Matrix mark
  | "device_action"; // Perform an action on a device

/**
 * What the effect targets
 */
export type EffectTargetType =
  | "self" // Affects the acting character
  | "target" // Affects a single target
  | "area" // Affects an area
  | "all_allies" // Affects all allies
  | "all_enemies" // Affects all enemies
  | "device" // Affects a device
  | "vehicle"; // Affects a vehicle

/**
 * How the effect is calculated
 */
export interface EffectCalculation {
  /** Base value for the effect */
  baseValue?: number;
  /** Formula to calculate value (can reference net hits, attributes, etc.) */
  formula?: string;
  /** Attribute to add to calculation */
  attribute?: string;
  /** Multiplier for net hits */
  netHitsMultiplier?: number;
  /** Whether net hits are added to base */
  addNetHits?: boolean;
  /** Minimum value */
  minimum?: number;
  /** Maximum value */
  maximum?: number;
}

/**
 * An effect that occurs when an action is successfully executed
 */
export interface ActionEffect {
  /** Type of effect */
  type: ActionEffectType;
  /** What this effect targets */
  targetType: EffectTargetType;
  /** How to calculate the effect value */
  calculation: EffectCalculation;
  /** For damage effects: physical or stun */
  damageType?: "physical" | "stun";
  /** For condition effects: the condition to apply/remove */
  conditionId?: string;
  /** Duration in rounds (undefined = permanent until removed) */
  duration?: number;
  /** Description of the effect */
  description?: string;
  /** Whether this effect is optional */
  optional?: boolean;
}

// =============================================================================
// OPPOSED TEST CONFIGURATION
// =============================================================================

/**
 * Configuration for an opposed test
 */
export interface OpposedTestConfig {
  /** Whether this action can be opposed */
  canBeOpposed: boolean;
  /** Default skill used for defense (if applicable) */
  defaultDefenseSkill?: string;
  /** Default attribute used for defense */
  defaultDefenseAttribute?: string;
  /** Alternative defense options */
  alternativeDefenses?: {
    name: string;
    skill?: string;
    attribute?: string;
    description: string;
  }[];
  /** Whether defender can use Full Defense */
  allowFullDefense?: boolean;
  /** Whether defender can use Block/Parry (melee) */
  allowBlockParry?: boolean;
  /** Interrupt actions available to defender */
  availableInterrupts?: string[];
}

// =============================================================================
// ACTION DEFINITION
// =============================================================================

/**
 * Modifier that applies to the action's dice pool
 */
export interface ActionModifier {
  /** Source of the modifier */
  source: string;
  /** Condition that triggers this modifier */
  condition?: string;
  /** Value of the modifier */
  value: number;
  /** Description */
  description: string;
}

/**
 * Complete definition of an action
 */
export interface ActionDefinition {
  /** Unique identifier for this action */
  id: string;
  /** Display name */
  name: string;
  /** Detailed description */
  description: string;
  /** Action type in the economy */
  type: ActionType;
  /** Execution domain */
  domain: ExecutionDomain;
  /** Sub-category for filtering */
  subcategory?: ActionSubcategory;
  /** Cost specification */
  cost: ActionCost;
  /** Prerequisites to attempt this action */
  prerequisites: ActionPrerequisite[];
  /** Standard modifiers that apply to this action */
  modifiers: ActionModifier[];
  /** What skill/attribute to use for the roll */
  rollConfig?: {
    /** Skill to use */
    skill?: string;
    /** Skill options (player chooses) */
    skillOptions?: string[];
    /** Attribute to use */
    attribute?: string;
    /** Attribute options (player chooses) */
    attributeOptions?: string[];
    /** Limit type (Physical, Mental, Social, weapon accuracy, etc.) */
    limitType?: string;
    /** Whether this is an extended test */
    extended?: boolean;
    /** Threshold for success (if not opposed) */
    threshold?: number;
    /** Interval for extended tests */
    interval?: string;
  };
  /** Opposed test configuration */
  opposedBy?: OpposedTestConfig;
  /** Effects on success */
  effects: ActionEffect[];
  /** Effects on glitch */
  glitchEffects?: ActionEffect[];
  /** Effects on critical glitch */
  criticalGlitchEffects?: ActionEffect[];
  /** Whether this action can be used as an interrupt */
  canBeInterrupt?: boolean;
  /** Source book reference */
  source?: {
    book: string;
    page: number;
  };
  /** Tags for categorization and filtering */
  tags?: string[];
  /** Whether this action is available during character's turn only */
  turnOnly?: boolean;
  /** Whether this action ends the character's turn */
  endsTurn?: boolean;
}

// =============================================================================
// ACTION CATALOG TYPES
// =============================================================================

/**
 * Collection of action definitions organized by domain
 */
export interface ActionCatalog {
  /** Combat actions */
  combat: ActionDefinition[];
  /** Magic actions */
  magic: ActionDefinition[];
  /** Matrix actions */
  matrix: ActionDefinition[];
  /** Social actions */
  social: ActionDefinition[];
  /** Vehicle actions */
  vehicle: ActionDefinition[];
  /** General/common actions */
  general: ActionDefinition[];
}

/**
 * Filters for querying available actions
 */
export interface ActionFilters {
  /** Filter by domain */
  domain?: ExecutionDomain;
  /** Filter by subcategory */
  subcategory?: ActionSubcategory;
  /** Filter by action type */
  actionType?: ActionType;
  /** Filter by tags */
  tags?: string[];
  /** Only show actions character can currently perform */
  onlyEligible?: boolean;
  /** Search query */
  search?: string;
}

/**
 * Summary of an action for display in lists
 */
export interface ActionSummary {
  /** Action ID */
  id: string;
  /** Display name */
  name: string;
  /** Action type */
  type: ActionType;
  /** Domain */
  domain: ExecutionDomain;
  /** Whether character meets prerequisites */
  eligible: boolean;
  /** Why not eligible (if applicable) */
  ineligibleReason?: string;
  /** Estimated pool size */
  estimatedPool?: number;
  /** Brief description */
  shortDescription?: string;
}

// =============================================================================
// API TYPES
// =============================================================================

/**
 * Request to get available actions
 */
export interface GetAvailableActionsRequest {
  characterId: ID;
  combatSessionId?: ID;
  filters?: ActionFilters;
}

/**
 * Response with available actions
 */
export interface GetAvailableActionsResponse {
  success: boolean;
  error?: string;
  actions?: ActionSummary[];
  totalCount?: number;
}

/**
 * Request to get action details
 */
export interface GetActionDetailsRequest {
  actionId: string;
  characterId?: ID;
}

/**
 * Response with action details
 */
export interface GetActionDetailsResponse {
  success: boolean;
  error?: string;
  action?: ActionDefinition;
  /** Pool breakdown if character specified */
  poolBreakdown?: PoolModifier[];
  /** Total pool size */
  totalPool?: number;
  /** Whether character can perform this action */
  canPerform?: boolean;
  /** Reasons character cannot perform (if applicable) */
  blockers?: string[];
}
