/**
 * Magic System Types
 *
 * Defines the structure for magical state, drain calculation,
 * and magical ability tracking for Shadowrun characters.
 */

import type { ID, ISODateString, MagicalPath } from "./core";
import type { FocusType, SpiritType } from "./edition";

// =============================================================================
// MAGICAL STATE
// =============================================================================

/**
 * Character's current magical state
 * Tracks tradition, ratings, active effects, and magical resources
 */
export interface MagicState {
  /** Character's magical path (mundane, full-mage, adept, etc.) */
  magicalPath: MagicalPath;

  /** Selected magical tradition (e.g., "hermetic", "shaman") */
  traditionId?: string;

  /** Mentor spirit (if quality selected) */
  mentorSpiritId?: string;

  // -------------------------------------------------------------------------
  // Core Ratings
  // -------------------------------------------------------------------------

  /** Current Magic attribute rating */
  magicRating: number;

  /** Initiation grade (0 = uninitiated) */
  initiateGrade: number;

  /** Metamagics acquired through initiation */
  metamagics: string[];

  // -------------------------------------------------------------------------
  // Active States
  // -------------------------------------------------------------------------

  /** Currently sustained spells */
  sustainedSpells: SustainedSpell[];

  /** Spirits currently bound or summoned */
  boundSpirits: BoundSpiritState[];

  /** Foci currently in use */
  activeFoci: ActiveFocus[];

  // -------------------------------------------------------------------------
  // Power Points (Adepts and Mystic Adepts)
  // -------------------------------------------------------------------------

  /** Total power points available (equals Magic rating for adepts) */
  powerPointsTotal: number;

  /** Power points currently allocated to powers */
  powerPointsSpent: number;
}

// =============================================================================
// SUSTAINED SPELL
// =============================================================================

/**
 * A spell currently being sustained by the character
 * Each sustained spell applies a -2 dice pool penalty
 */
export interface SustainedSpell {
  /** Reference ID for this sustained instance */
  id: ID;

  /** Spell ID from the catalog */
  spellId: string;

  /** Force at which the spell was cast */
  force: number;

  /** Target IDs affected by the spell */
  targets: string[];

  /** Dice pool penalty from sustaining (-2 per spell) */
  dicePoolPenalty: number;

  /** When the spell began being sustained */
  sustainedSince: ISODateString;

  /** Whether a focus is being used to sustain (removes penalty) */
  sustainedByFocus?: boolean;

  /** Focus ID if sustained by a focus */
  focusId?: string;
}

// =============================================================================
// BOUND SPIRIT STATE
// =============================================================================

/**
 * A spirit currently bound or summoned by the character
 */
export interface BoundSpiritState {
  /** Reference ID for this spirit instance */
  id: ID;

  /** Type of spirit (air, fire, man, etc.) */
  spiritType: SpiritType;

  /** Force of the spirit */
  force: number;

  /** Services remaining (bound spirits have multiple, summoned have 1) */
  servicesRemaining: number;

  /** True if bound (long-term), false if just summoned (temporary) */
  bound: boolean;

  /** Current tasks assigned to the spirit */
  tasks: SpiritTask[];

  /** When the spirit was bound/summoned */
  createdAt: ISODateString;
}

/**
 * A task currently assigned to a spirit
 */
export interface SpiritTask {
  /** Type of task being performed */
  type: "aid" | "remote-service" | "combat" | "sustain-spell" | "other";

  /** Description of the task */
  description: string;

  /** When the task was assigned */
  startedAt: ISODateString;

  /** Spell ID if sustaining a spell */
  spellId?: string;
}

// =============================================================================
// ACTIVE FOCUS
// =============================================================================

/**
 * A focus currently owned and potentially active
 */
export interface ActiveFocus {
  /** Reference to the focus in character's foci array */
  focusId: string;

  /** Type of focus */
  focusType: FocusType;

  /** Force of the focus */
  force: number;

  /** Whether the focus has been bonded (karma spent) */
  bonded: boolean;

  /** Whether the focus is currently active */
  active: boolean;

  /** Spell ID if this is a spell focus, and it's sustaining */
  sustainingSpellId?: string;
}

// =============================================================================
// DRAIN
// =============================================================================

/**
 * Types of magical actions that cause drain
 */
export type DrainAction =
  | "spellcasting"
  | "summoning"
  | "banishing"
  | "binding"
  | "ritual"
  | "adept-power"
  | "counterspelling";

/**
 * Result of a drain calculation
 */
export interface DrainResult {
  /** The calculated drain value (before resistance) */
  drainValue: number;

  /** Whether drain is stun or physical (physical if > Magic rating) */
  drainType: "stun" | "physical";

  /** Dice pool for resisting drain (tradition drain attributes) */
  resistancePool: number;

  /** Formula used for calculation (e.g., "F-3") */
  drainFormula: string;

  /** Hits from resistance roll (if already rolled) */
  resistanceHits?: number;

  /** Actual damage applied after resistance */
  damageApplied?: number;
}

/**
 * Breakdown of drain calculation for transparency
 */
export interface DrainBreakdown {
  /** Base formula from spell/action */
  baseFormula: string;

  /** Force value used in calculation */
  forceValue: number;

  /** Modifiers applied to drain */
  modifiers: DrainModifier[];

  /** Final calculated drain value */
  finalValue: number;
}

/**
 * A modifier applied to drain calculation
 */
export interface DrainModifier {
  /** Source of the modifier (e.g., "mentor-spirit", "focus") */
  source: string;

  /** Modifier value (negative reduces drain) */
  value: number;

  /** Description of why this modifier applies */
  reason: string;
}

// =============================================================================
// ESSENCE-MAGIC LINK
// =============================================================================

/**
 * Tracks the relationship between essence and magical potential
 */
export interface EssenceMagicState {
  /** Base essence (typically 6.0) */
  baseEssence: number;

  /** Current essence after augmentations */
  currentEssence: number;

  /** Total essence lost to augmentations */
  essenceLost: number;

  /**
   * Essence hole - tracks permanent Magic/Resonance loss
   * Even if augmentations are removed, this much Magic is permanently lost
   */
  essenceHole: number;

  /** Base Magic rating (from priority/karma) */
  baseMagicRating: number;

  /** Effective Magic rating after essence loss */
  effectiveMagicRating: number;

  /** Magic points lost due to essence loss */
  magicLostToEssence: number;
}

// =============================================================================
// VALIDATION TYPES
// =============================================================================

/**
 * Result of tradition validation
 */
export interface TraditionValidationResult {
  /** Whether the tradition selection is valid */
  valid: boolean;

  /** Blocking errors that prevent selection */
  errors: MagicValidationError[];

  /** Non-blocking warnings */
  warnings: MagicValidationWarning[];

  /** Drain attributes for this tradition */
  drainAttributes?: [string, string];
}

/**
 * Result of spell/power allocation validation
 */
export interface SpellValidationResult {
  /** Whether the spell allocation is valid */
  valid: boolean;

  /** Blocking errors */
  errors: MagicValidationError[];

  /** Non-blocking warnings */
  warnings: MagicValidationWarning[];

  /** Remaining budget after allocation */
  budgetRemaining?: number;

  /** Total budget available */
  budgetTotal?: number;
}

/**
 * Validation error for magic-related issues
 */
export interface MagicValidationError {
  /** Error code for programmatic handling */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Field or item causing the error */
  field?: string;

  /** ID of the problematic item (spell, power, etc.) */
  itemId?: string;
}

/**
 * Validation warning for magic-related issues
 */
export interface MagicValidationWarning {
  /** Warning code */
  code: string;

  /** Human-readable warning message */
  message: string;

  /** Field or item causing the warning */
  field?: string;

  /** Suggestion for resolution */
  suggestion?: string;
}

// =============================================================================
// SPELL CATEGORIES
// =============================================================================

/**
 * Categories of spells in Shadowrun
 */
export type SpellCategory =
  | "combat"
  | "detection"
  | "health"
  | "illusion"
  | "manipulation";

/**
 * Types of spell (mana vs physical targeting)
 */
export type SpellType = "mana" | "physical";
