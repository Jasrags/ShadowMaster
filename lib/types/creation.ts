/**
 * Character Creation Method types
 *
 * Defines the structure for edition-specific character creation systems.
 * Each creation method is a versioned, plug-in module that defines
 * workflows, budgets, constraints, and validation rules.
 */

import type { ID, ISODateString, Metadata } from "./core";
import type { EditionCode } from "./edition";
import type { CreationSelections } from "./creation-selections";

// =============================================================================
// CREATION METHOD
// =============================================================================

/**
 * Known creation method types across editions
 */
export type CreationMethodType =
  | "priority" // SR1-SR3, SR5-SR6: Priority system (A-E)
  | "sum-to-ten" // SR3 variant
  | "point-buy" // SR5 Run Faster
  | "build-points" // SR4/SR4A: BP system
  | "karma-gen" // SR4 variant
  | "life-modules" // SR5 Run Faster
  | "anarchy-cue"; // Anarchy: Narrative cue system

/**
 * A CreationMethod defines how characters are built for an edition.
 * It specifies the workflow steps, resource budgets, and constraints.
 */
export interface CreationMethod {
  id: ID;
  editionId: ID;
  editionCode: EditionCode;

  /** Source book that provides this method (optional, core book if undefined) */
  bookId?: ID;

  name: string; // "Priority System"
  type: CreationMethodType;
  description?: string;
  version: string; // For tracking changes

  /**
   * Ordered steps in the creation workflow.
   * UI renders these sequentially.
   */
  steps: CreationStep[];

  /**
   * Resource budgets available during creation.
   * These are tracked and validated throughout the process.
   */
  budgets: CreationBudget[];

  /**
   * Global constraints that must be satisfied for a valid character.
   */
  constraints: CreationConstraint[];

  /**
   * Optional rules that can be toggled on/off by GM
   */
  optionalRules?: OptionalRule[];

  /** Whether this method is deprecated */
  deprecated?: boolean;

  createdAt: ISODateString;
  updatedAt?: ISODateString;

  metadata?: Metadata;
}

// =============================================================================
// CREATION STEPS
// =============================================================================

/**
 * Types of steps in the creation workflow
 */
export type CreationStepType =
  | "select" // Select from options (metatype, tradition)
  | "priority" // Assign priorities (A-E grid)
  | "allocate" // Allocate points (attributes, skills)
  | "choose" // Choose items from a list (qualities, gear)
  | "purchase" // Spend resources (nuyen for gear)
  | "info" // Information display only
  | "validate"; // Final validation step

/**
 * A single step in the character creation workflow.
 * The UI dynamically renders based on step type and payload.
 */
export interface CreationStep {
  id: string; // Unique within the creation method
  title: string;
  description?: string;
  type: CreationStepType;

  /** Whether this step can be skipped */
  optional?: boolean;

  /**
   * Step-specific configuration payload.
   * Structure depends on step type.
   */
  payload: CreationStepPayload;

  /**
   * Constraints specific to this step
   */
  constraints?: CreationConstraint[];

  /**
   * Dependencies on other steps or budgets
   */
  dependencies?: StepDependency[];
}

/**
 * Payload types for different step types
 */
export type CreationStepPayload =
  | SelectStepPayload
  | PriorityStepPayload
  | AllocateStepPayload
  | ChooseStepPayload
  | PurchaseStepPayload
  | InfoStepPayload
  | ValidateStepPayload;

export interface SelectStepPayload {
  type: "select";

  /** What is being selected */
  target: "metatype" | "magical-path" | "tradition" | "stream" | string;

  /** Whether multiple selections are allowed */
  multiple?: boolean;

  /** Minimum/maximum selections */
  min?: number;
  max?: number;

  /** Key in ruleset modules to pull options from */
  optionsSource?: string;
}

export interface PriorityStepPayload {
  type: "priority";

  /** Priority categories to assign */
  categories: PriorityCategory[];

  /** Available priority levels */
  levels: string[]; // ["A", "B", "C", "D", "E"]
}

export interface PriorityCategory {
  id: string; // "metatype", "attributes", etc.
  name: string;
  description?: string;
}

export interface AllocateStepPayload {
  type: "allocate";

  /** What is being allocated */
  target: "attributes" | "skills" | "special-attributes" | string;

  /** Budget ID to draw points from */
  budgetId: string;

  /** Maximum rating per item at creation */
  maxRating?: number;

  /** Minimum rating per item (if required) */
  minRating?: number;
}

export interface ChooseStepPayload {
  type: "choose";

  /** What is being chosen */
  target: "qualities" | "spells" | "powers" | "complex-forms" | "contacts" | string;

  /** Budget ID for karma/points cost */
  budgetId?: string;

  /** Whether items have costs */
  hasCosts?: boolean;

  /** Key in ruleset modules to pull options from */
  optionsSource?: string;
}

export interface PurchaseStepPayload {
  type: "purchase";

  /** What is being purchased */
  target: "gear" | "cyberware" | "bioware" | "vehicles" | string;

  /** Budget ID for currency */
  budgetId: string; // Usually "nuyen"

  /** Availability limit at creation */
  availabilityLimit?: number;

  /** Key in ruleset modules to pull items from */
  optionsSource?: string;
}

export interface InfoStepPayload {
  type: "info";

  /** Markdown content to display */
  content: string;
}

export interface ValidateStepPayload {
  type: "validate";

  /** Validation rules to run */
  validations: string[];
}

// =============================================================================
// CREATION BUDGETS
// =============================================================================

/**
 * A resource budget that tracks available points during creation.
 */
export interface CreationBudget {
  id: string; // "attribute-points", "skill-points", "karma", "nuyen"
  label: string;
  description?: string;

  /**
   * Initial value - may be fixed or determined by priority/choices.
   * If determined dynamically, use initialValueFormula instead.
   */
  initialValue?: number;

  /**
   * Formula for calculating initial value based on priority or other factors.
   * e.g., "priorities.attributes" to look up from priority table
   */
  initialValueFormula?: string;

  /** Minimum allowed value (usually 0) */
  min?: number;

  /** Maximum allowed value (if capped) */
  max?: number;

  /** Whether going negative is allowed (with penalties) */
  allowNegative?: boolean;

  /** Display format */
  displayFormat?: "number" | "currency" | "percentage";
}

// =============================================================================
// CREATION CONSTRAINTS
// =============================================================================

/**
 * Types of constraints
 */
export type ConstraintType =
  | "attribute-limit" // Attribute cannot exceed a value
  | "skill-limit" // Skill cannot exceed a value
  | "budget-balance" // Budget must be >= 0 (or specific value)
  | "required-selection" // Must select at least N items
  | "forbidden-combination" // Cannot have X and Y together
  | "required-combination" // Must have X if you have Y
  | "essence-minimum" // Essence cannot drop below value
  | "equipment-rating" // Equipment ratings must be valid
  | "special-attribute-init" // Edge/Magic/Resonance starting values
  | "custom"; // Custom validation function name

/**
 * A constraint that must be satisfied for valid character creation.
 */
export interface CreationConstraint {
  id: string;
  type: ConstraintType;
  description: string;

  /** Severity of violation */
  severity: "error" | "warning";

  /** Constraint-specific parameters */
  params: Record<string, unknown>;

  /** Error message to display when violated */
  errorMessage?: string;
}

// =============================================================================
// DEPENDENCIES
// =============================================================================

/**
 * Dependency on another step or condition
 */
export interface StepDependency {
  /** Type of dependency */
  type: "step-completed" | "budget-available" | "selection-made" | "condition";

  /** ID of the step, budget, or selection this depends on */
  targetId: string;

  /** For conditions, the condition expression */
  condition?: string;
}

// =============================================================================
// OPTIONAL RULES
// =============================================================================

/**
 * Optional rule that can be toggled by GM
 */
export interface OptionalRule {
  id: string;
  name: string;
  description: string;
  source?: string; // Book/page reference

  /** Default state */
  enabledByDefault: boolean;

  /** Effects when enabled (modifications to budgets, constraints, etc.) */
  effects: OptionalRuleEffect[];
}

export interface OptionalRuleEffect {
  type: "modify-budget" | "add-constraint" | "remove-constraint" | "modify-options";
  targetId: string;
  modification: Record<string, unknown>;
}

// =============================================================================
// PRIORITY TABLE (SR5 Specific)
// =============================================================================

/**
 * SR5 Priority table structure.
 * This would be part of the "priorities" rule module payload.
 */
export interface SR5PriorityTable {
  levels: SR5PriorityLevel[];
}

export interface SR5PriorityLevel {
  level: "A" | "B" | "C" | "D" | "E";
  metatype: SR5MetatypePriority;
  attributes: number; // Attribute points
  magic: SR5MagicPriority;
  skills: SR5SkillsPriority;
  resources: number; // Starting nuyen
}

export interface SR5MetatypePriority {
  available: string[]; // Metatype IDs available at this priority
  specialAttributePoints: number; // Points for Edge/Magic/Resonance
}

export interface SR5MagicPriority {
  available: string[]; // Magical paths available at this priority
  magicRating?: number;
  resonanceRating?: number;
  spells?: number;
  complexForms?: number;
  skills?: { rating: number; count: number }; // Free magic skills
}

export interface SR5SkillsPriority {
  skillPoints: number;
  skillGroupPoints: number;
}

// =============================================================================
// FREE SKILL ALLOCATIONS
// =============================================================================

/**
 * Tracks free skill allocations from priority table (Magic/Resonance priority)
 */
export interface FreeSkillAllocation {
  type: "magical" | "resonance" | "active" | "magicalGroup";
  rating: number;
  count: number;
  allocated: Array<{
    skillId?: string; // For individual skills
    groupId?: string; // For skill groups
    rating: number;
  }>;
}

// =============================================================================
// CREATION STATE (Runtime)
// =============================================================================

/**
 * Runtime state during character creation.
 * Tracks current step, budget usage, and selections.
 */
export interface CreationState {
  characterId: ID;
  creationMethodId: ID;

  /** Current step index */
  currentStep: number;

  /** Completed step IDs */
  completedSteps: string[];

  /** Current budget values (remaining) */
  budgets: Record<string, number>;

  /** Selections made per step (typed interface for type-safe access) */
  selections: CreationSelections;

  /** Priority assignments (for priority system) */
  priorities?: Record<string, string>; // { "metatype": "B", "attributes": "A", ... }

  /** Validation errors */
  errors: ValidationError[];

  /** Validation warnings */
  warnings: ValidationError[];

  /** Last updated timestamp */
  updatedAt: ISODateString;
}

export interface ValidationError {
  constraintId: string;
  stepId?: string;
  field?: string;
  message: string;
  severity: "error" | "warning";
}

