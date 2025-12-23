/**
 * Quality system types
 *
 * Types for the Shadowrun qualities system including catalog definitions,
 * character selections, prerequisites, effects, and dynamic state management.
 */

import type { ISODateString, MagicalPath } from "./core";

// =============================================================================
// QUALITY CATALOG TYPES
// =============================================================================

/**
 * Source reference for a quality (book and page)
 */
export interface SourceReference {
  book: string; // e.g., "sr5-core", "run-faster"
  page: number;
}

/**
 * Quality level for per-rating qualities
 */
export interface QualityLevel {
  level: number; // Rating level (1, 2, 3, etc.)
  name: string; // Display name (e.g., "Rating 2")
  karma: number; // Karma cost/bonus at this level
  effects?: QualityEffect[]; // Level-specific effects
}

/**
 * Prerequisites for taking a quality
 */
export interface QualityPrerequisites {
  // Attribute requirements (e.g., { "wil": { min: 4 } })
  attributes?: Record<string, { min?: number; max?: number }>;

  // Magical path restrictions
  magicalPaths?: MagicalPath[]; // Must be one of these
  magicalPathsExcluded?: MagicalPath[]; // Cannot be any of these

  // Metatype restrictions
  metatypes?: string[]; // Must be one of these (empty = all)
  metatypesExcluded?: string[]; // Cannot be any of these

  // Quality dependencies
  requiredQualities?: string[]; // Must have all of these
  requiredAnyQualities?: string[]; // Must have at least one of these

  // Skill requirements
  skills?: Record<string, { min?: number }>;

  // Special attribute requirements
  hasMagic?: boolean; // Must have Magic attribute
  hasResonance?: boolean; // Must have Resonance attribute

  // Custom validation function reference
  customValidator?: string;
}

/**
 * Catalog entry for a quality available in the ruleset
 */
export interface Quality {
  id: string; // Unique identifier (e.g., "high-pain-tolerance")
  name: string; // Display name (e.g., "High Pain Tolerance")
  type: "positive" | "negative"; // Quality category
  karmaCost?: number; // Karma spent to acquire (for positive)
  karmaBonus?: number; // Karma gained when taken (for negative)
  summary: string; // Short description (1-2 sentences)
  description?: string; // Extended text with full mechanics
  source?: SourceReference; // Book and page reference
  tags?: string[]; // Categorization tags
  prerequisites?: QualityPrerequisites; // Requirements to take this quality
  incompatibilities?: string[]; // Quality IDs that cannot coexist
  levels?: QualityLevel[]; // For per-rating qualities
  maxRating?: number; // Maximum rating if per-rating
  limit?: number; // How many times quality can be taken (default: 1)
  requiresSpecification?: boolean; // Whether player must specify details
  specificationLabel?: string; // Label for specification input
  specificationSource?: string; // Catalog to pull options from
  specificationOptions?: string[]; // Fixed list of valid options
  effects?: QualityEffect[]; // Gameplay effects
  dynamicState?: DynamicStateType; // For qualities with changing state
}

/**
 * Container for the master list of qualities in a ruleset
 */
export interface QualityCatalog {
  positive: Quality[];
  negative: Quality[];
  racial?: Quality[]; // Metatype-specific qualities
}

// =============================================================================
// QUALITY EFFECTS TYPES
// =============================================================================

/**
 * Types of quality effects
 */
export type EffectType =
  | "dice-pool-modifier"
  | "limit-modifier"
  | "threshold-modifier"
  | "wound-modifier"
  | "attribute-modifier"
  | "attribute-maximum"
  | "resistance-modifier"
  | "initiative-modifier"
  | "healing-modifier"
  | "karma-cost-modifier"
  | "nuyen-cost-modifier"
  | "time-modifier"
  | "signature-modifier"
  | "glitch-modifier"
  | "special";

/**
 * Triggers for when effects apply
 */
export type EffectTrigger =
  | "always"
  | "skill-test"
  | "attribute-test"
  | "combat-action"
  | "defense-test"
  | "resistance-test"
  | "social-test"
  | "first-meeting"
  | "magic-use"
  | "matrix-action"
  | "healing"
  | "damage-taken"
  | "fear-intimidation"
  | "withdrawal"
  | "on-exposure";

/**
 * Target of an effect
 */
export interface EffectTarget {
  // Target a specific stat
  stat?: "wound-threshold" | "overflow" | "initiative" | "edge-max" | string;

  // Target a limit
  limit?: "physical" | "mental" | "social" | "astral";

  // Target an attribute
  attribute?: string;

  // Target a skill or skill group
  skill?: string;
  skillGroup?: string;

  // Target a category of tests
  testCategory?: "combat" | "social" | "technical" | "magic" | "matrix";

  // Target specific action
  matrixAction?: string;

  // Self or others
  affectsOthers?: boolean; // e.g., Quick Healer affects healing on self
}

/**
 * Conditions for effect application
 */
export interface EffectCondition {
  // Only applies in certain environments
  environment?: string[]; // e.g., ["dim-light", "darkness"]

  // Only applies against certain targets
  targetType?: string[]; // e.g., ["spirit", "awakened"]

  // Only when character has certain state
  characterState?: string[]; // e.g., ["astrally-projecting"]

  // Opposed test conditions
  opposedBy?: string; // e.g., "assensing"

  // Custom condition reference
  customCondition?: string;
}

/**
 * Quality effect structure
 */
export interface QualityEffect {
  id: string; // Unique effect identifier
  type: EffectType; // Category of effect
  trigger: EffectTrigger; // When effect applies
  target: EffectTarget; // What the effect modifies
  value: number | string; // Modifier value or formula
  condition?: EffectCondition; // Optional conditions
  description?: string; // Human-readable description
}

// =============================================================================
// QUALITY SELECTION TYPES (Character Data)
// =============================================================================

/**
 * How a quality was acquired
 */
export type AcquisitionSource =
  | "creation" // During character creation
  | "advancement" // Purchased with Karma post-creation
  | "story" // Granted by GM during gameplay
  | "racial" // Innate from metatype
  | "initiation" // From magical initiation
  | "submersion"; // From technomancer submersion

/**
 * Selection of a quality on a character
 */
export interface QualitySelection {
  /** @deprecated Use qualityId instead */
  id?: string;
  qualityId: string; // References catalog Quality.id
  rating?: number; // Chosen rating for per-rating qualities
  specification?: string; // Player-specified detail (e.g., skill name)
  specificationId?: string; // ID when specification references another catalog
  source: AcquisitionSource; // How/when quality was acquired
  acquisitionDate?: ISODateString; // When quality was acquired
  originalKarma?: number; // Original karma value (for buy-off calculations)
  variant?: string; // For qualities with variants (e.g., Addiction severity)
  notes?: string; // Player/GM annotations
  active?: boolean; // Whether quality is currently active (default: true)
  gmApproved?: boolean; // Whether acquisition has been approved by GM
  dynamicState?: QualityDynamicState; // Current state for dynamic qualities
}

// =============================================================================
// DYNAMIC QUALITY STATE TYPES
// =============================================================================

/**
 * Type of dynamic state a quality can have
 */
export type DynamicStateType =
  | "addiction"
  | "allergy"
  | "dependent"
  | "reputation"
  | "code-of-honor"
  | "custom";

/**
 * Dynamic state for Addiction quality
 */
export interface AddictionState {
  // What the character is addicted to
  substance: string;
  substanceType: "physiological" | "psychological" | "both";

  // Current severity (can change during play)
  severity: "mild" | "moderate" | "severe" | "burnout";
  originalSeverity: "mild" | "moderate" | "severe" | "burnout";

  // Timing
  lastDose: ISODateString;
  nextCravingCheck: ISODateString;

  // Current state
  cravingActive: boolean;
  withdrawalActive: boolean;
  withdrawalPenalty: number; // 0-6 dice penalty

  // Recovery tracking
  daysClean: number;
  recoveryAttempts: number;
}

/**
 * Dynamic state for Allergy quality
 */
export interface AllergyState {
  allergen: string;
  prevalence: "uncommon" | "common";
  severity: "mild" | "moderate" | "severe" | "extreme";

  // Current exposure
  currentlyExposed: boolean;
  exposureStartTime?: ISODateString;
  exposureDuration?: number; // minutes

  // Damage tracking (for severe/extreme)
  damageAccumulated: number;
  lastDamageTime?: ISODateString;
}

/**
 * Dynamic state for Dependents quality
 */
export interface DependentState {
  name: string;
  relationship: string; // "child", "spouse", "parent", etc.
  tier: 1 | 2 | 3; // Nuisance / Demanding / Inescapable

  // Current status
  currentStatus: "safe" | "needs-attention" | "in-danger" | "missing";
  lastCheckedIn: ISODateString;

  // Resource drain
  lifestyleCostModifier: number; // +10% / +20% / +30%
  timeCommitmentHours: number; // per week
}

/**
 * Dynamic state for Code of Honor quality
 */
export interface CodeOfHonorState {
  codeName: string;
  description: string;
  protectedGroups?: string[];

  // Violation tracking
  violations: Array<{
    date: ISODateString;
    description: string;
    karmaLost: number;
  }>;
  totalKarmaLost: number;
}

/**
 * Union type for all dynamic state types
 */
export type QualityDynamicState =
  | { type: "addiction"; state: AddictionState }
  | { type: "allergy"; state: AllergyState }
  | { type: "dependent"; state: DependentState }
  | { type: "code-of-honor"; state: CodeOfHonorState }
  | { type: "reputation"; state: Record<string, unknown> }
  | { type: "custom"; state: Record<string, unknown> };

