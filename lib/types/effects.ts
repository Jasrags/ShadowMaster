/**
 * Unified Effect Type System
 *
 * Foundation types for defining and resolving mechanical effects from all
 * character sources: qualities, gear, cyberware, bioware, adept powers,
 * spells, and situational modifiers.
 *
 * @see /docs/plans/unified-effects-system.md
 * @see Issue #107
 */

import type { ISODateString } from "./core";

// =============================================================================
// EFFECT TYPES
// =============================================================================

/**
 * Types of mechanical effects.
 * Superset of the existing EffectType in qualities.ts — adds accuracy-modifier,
 * recoil-compensation, damage-resistance-modifier, armor-modifier.
 */
export type EffectType =
  | "dice-pool-modifier"
  | "limit-modifier"
  | "threshold-modifier"
  | "attribute-modifier"
  | "attribute-maximum"
  | "initiative-modifier"
  | "wound-modifier"
  | "resistance-modifier"
  | "healing-modifier"
  | "karma-cost-modifier"
  | "nuyen-cost-modifier"
  | "time-modifier"
  | "signature-modifier"
  | "glitch-modifier"
  | "accuracy-modifier"
  | "recoil-compensation"
  | "damage-resistance-modifier"
  | "armor-modifier"
  | "special";

/**
 * Triggers for when effects apply.
 * Superset of the existing EffectTrigger in qualities.ts — adds perception-audio,
 * perception-visual, ranged-attack, melee-attack, damage-resistance, full-defense.
 */
export type EffectTrigger =
  // Broad triggers
  | "always"
  | "skill-test"
  | "attribute-test"
  | "combat-action"
  | "defense-test"
  | "resistance-test"
  | "social-test"
  | "magic-use"
  | "matrix-action"
  | "healing"
  // Granular triggers
  | "perception-audio"
  | "perception-visual"
  | "ranged-attack"
  | "melee-attack"
  | "damage-resistance"
  | "full-defense"
  // Situational triggers
  | "first-meeting"
  | "damage-taken"
  | "fear-intimidation"
  | "withdrawal"
  | "on-exposure";

/**
 * Valid specific actions for fine-grained effect targeting.
 * Enumerated to prevent stringly-typed errors.
 */
export type SpecificAction =
  // Perception subtypes
  | "locate-sound-source"
  | "detect-ambush"
  | "read-lips"
  | "spot-hidden"
  // Combat subtypes
  | "called-shot"
  | "suppressive-fire"
  | "full-auto"
  // Social subtypes
  | "negotiate"
  | "intimidate"
  | "con"
  // Matrix subtypes
  | "hack-on-the-fly"
  | "brute-force"
  | "data-spike";

/**
 * Source types for stacking group resolution.
 */
export type EffectSourceType =
  | "quality"
  | "gear"
  | "cyberware"
  | "bioware"
  | "adept-power"
  | "spell"
  | "active-modifier";

// =============================================================================
// EFFECT DEFINITION (Catalog Items)
// =============================================================================

/**
 * Target of an effect.
 * Extends the existing EffectTarget in qualities.ts — adds limit:"accuracy",
 * perceptionType, weaponCategory, damageType, specificAction.
 */
export interface EffectTarget {
  /** Target a specific stat */
  stat?: string;

  /** Target a limit (includes "accuracy" for weapon limits) */
  limit?: "physical" | "mental" | "social" | "astral" | "accuracy";

  /** Target an attribute */
  attribute?: string;

  /** Target a skill */
  skill?: string;

  /** Target a skill group */
  skillGroup?: string;

  /** Target a category of tests */
  testCategory?: string;

  /** Target a specific matrix action */
  matrixAction?: string;

  /** Whether effect targets others rather than self */
  affectsOthers?: boolean;

  /** Perception subtype targeting */
  perceptionType?: "audio" | "visual" | "tactile" | "astral";

  /** Weapon category targeting */
  weaponCategory?: string[];

  /** Damage type targeting */
  damageType?: "physical" | "stun";

  /** Specific action targeting (typed enum) */
  specificAction?: SpecificAction;

  /** Target all skills in a category (e.g., "social", "combat") */
  skillCategory?: string;

  /** Target all attributes in a category (e.g., "physical", "mental") */
  attributeCategory?: string;
}

/**
 * Conditions for effect application.
 * Extends the existing EffectCondition in qualities.ts — adds requiresEquipment,
 * lightingCondition, noiseCondition.
 */
export interface EffectCondition {
  /** Only applies in certain environments */
  environment?: string[];

  /** Only applies against certain target types */
  targetType?: string[];

  /** Only when character has certain state */
  characterState?: string[];

  /** Opposed test conditions */
  opposedBy?: string;

  /** Custom condition reference */
  customCondition?: string;

  /** Required equipment IDs for effect to apply */
  requiresEquipment?: string[];

  /** Lighting condition requirement */
  lightingCondition?: "bright" | "dim" | "dark";

  /** Noise condition requirement */
  noiseCondition?: "quiet" | "normal" | "loud";
}

/**
 * Core unified effect definition.
 * Stored on catalog items in edition JSON files. Supports multi-trigger arrays,
 * per-rating scaling, stacking control, and wireless overrides.
 */
export interface Effect {
  /** Unique effect identifier */
  id: string;

  /** Category of effect */
  type: EffectType;

  /** When effect applies (multi-trigger array for explicit matching) */
  triggers: EffectTrigger[];

  /** What the effect modifies */
  target: EffectTarget;

  /** Modifier value — fixed number or per-rating scaling */
  value: number | { perRating: number };

  /** Optional conditions for effect application */
  condition?: EffectCondition;

  /** Human-readable description */
  description?: string;

  /** Stacking group name for stacking rule resolution */
  stackingGroup?: string;

  /** Priority within stacking group (higher wins) */
  stackingPriority?: number;

  /** Whether this effect requires wireless to be active */
  requiresWireless?: boolean;

  /** Wireless variant override (constrained fields only) */
  wirelessOverride?: {
    /** Can change effect type (e.g., limit → dice) */
    type?: EffectType;
    /** Additional value on top of base */
    bonusValue?: number;
    /** Wireless-specific description */
    description?: string;
  };
}

// =============================================================================
// RESOLVED EFFECT (Runtime)
// =============================================================================

/**
 * Source of a resolved effect, tracking where it came from.
 */
export interface EffectSource {
  /** Source category */
  type: EffectSourceType;

  /** Source item ID */
  id: string;

  /** Source item display name */
  name: string;

  /** Source item rating (for per-rating value resolution) */
  rating?: number;

  /** Whether wireless is enabled on source item */
  wirelessEnabled?: boolean;

  /** Parent item name (for mods installed on weapons/gear) */
  parentName?: string;

  /** Parent item ID (for mods installed on weapons/gear) */
  parentId?: string;
}

/**
 * An effect after resolution — with computed value and source tracking.
 *
 * Named UnifiedResolvedEffect to avoid conflict with the existing
 * ResolvedEffect in gameplay.ts (used by quality effect handlers).
 */
export interface UnifiedResolvedEffect {
  /** The original effect definition */
  effect: Effect;

  /** Source that produced this effect */
  source: EffectSource;

  /** Computed numeric value (after per-rating scaling) */
  resolvedValue: number;

  /** Which variant was applied */
  appliedVariant: "standard" | "wireless";
}

// =============================================================================
// RESOLUTION CONTEXT
// =============================================================================

/**
 * Action context for effect resolution.
 *
 * Named EffectActionContext to avoid conflict with the existing
 * ActionContext in action-resolution.ts (used by ActionPanel, ActionPoolBuilder).
 */
export interface EffectActionContext {
  /** Type of action being performed */
  type: "skill-test" | "attack" | "defense" | "resistance" | "initiative";

  /** Skill being tested */
  skill?: string;

  /** Attribute being tested */
  attribute?: string;

  /** Attack subtype */
  attackType?: "ranged" | "melee";

  /** Perception subtype */
  perceptionType?: "audio" | "visual";

  /** Specific action for fine-grained targeting */
  specificAction?: SpecificAction;

  /** Category of skill being tested (e.g., "social", "combat") */
  skillCategory?: string;

  /** Weapon ID for attack contexts */
  weaponId?: string;
}

/**
 * Environmental context for effect condition matching.
 */
export interface EnvironmentContext {
  /** Lighting conditions */
  lighting?: "bright" | "dim" | "dark";

  /** Noise level */
  noise?: "quiet" | "normal" | "loud";

  /** Terrain description */
  terrain?: string;

  /** Weather conditions */
  weather?: string;
}

/**
 * Character state flags for conditional triggers.
 *
 * Tracks dynamic states like withdrawal, exposure, and first-meeting
 * that activate state-dependent quality effects in the unified pipeline.
 */
export interface CharacterStateFlags {
  /** Addiction withdrawal is active */
  withdrawalActive?: boolean;
  /** Allergy exposure is active */
  exposureActive?: boolean;
  /** First meeting with NPC (session-level, not persisted) */
  firstMeeting?: boolean;
}

/**
 * Full resolution context combining action and environment.
 */
export interface EffectResolutionContext {
  /** Action being performed (required) */
  action: EffectActionContext;

  /** Environmental conditions (optional) */
  environment?: EnvironmentContext;

  /** Character state flags for conditional triggers (optional) */
  characterState?: CharacterStateFlags;
}

/**
 * Result of resolving all applicable effects for a context.
 * Groups effects by type, applies stacking rules, and provides totals.
 */
export interface EffectResolutionResult {
  /** Dice pool modifier effects */
  dicePoolModifiers: UnifiedResolvedEffect[];

  /** Limit modifier effects */
  limitModifiers: UnifiedResolvedEffect[];

  /** Threshold modifier effects */
  thresholdModifiers: UnifiedResolvedEffect[];

  /** Accuracy modifier effects */
  accuracyModifiers: UnifiedResolvedEffect[];

  /** Initiative modifier effects */
  initiativeModifiers: UnifiedResolvedEffect[];

  /** Armor modifier effects */
  armorModifiers: UnifiedResolvedEffect[];

  /** Wound modifier effects */
  woundModifiers: UnifiedResolvedEffect[];

  /** Total dice pool modifier (after stacking rules) */
  totalDicePoolModifier: number;

  /** Total limit modifier (after stacking rules) */
  totalLimitModifier: number;

  /** Total threshold modifier (after stacking rules) */
  totalThresholdModifier: number;

  /** Total accuracy modifier (after stacking rules) */
  totalAccuracyModifier: number;

  /** Total initiative modifier (after stacking rules) */
  totalInitiativeModifier: number;

  /** Total armor modifier (after stacking rules) */
  totalArmorModifier: number;

  /** Total wound modifier (after stacking rules) */
  totalWoundModifier: number;

  /** Effects excluded by stacking rules (for UI transparency) */
  excludedByStacking: UnifiedResolvedEffect[];
}

// =============================================================================
// ACTIVE MODIFIERS
// =============================================================================

/**
 * GM-applied or situational effect persisted on a character.
 * Survives page refreshes and allows GM review.
 */
export interface ActiveModifier {
  /** Unique modifier ID */
  id: string;

  /** Display name */
  name: string;

  /** Source of the modifier */
  source: "gm" | "environment" | "condition" | "temporary";

  /** The effect definition */
  effect: Effect;

  /** Expiration timestamp */
  expiresAt?: ISODateString;

  /** Number of uses before expiration */
  expiresAfterUses?: number;

  /** Remaining uses (decremented on application) */
  remainingUses?: number;

  /** User ID of GM who applied this modifier */
  appliedBy?: string;

  /** When this modifier was applied */
  appliedAt: ISODateString;

  /** GM/player notes */
  notes?: string;
}

// =============================================================================
// STACKING RULES
// =============================================================================

/**
 * Rule for how effects of a given type stack.
 */
export interface StackingRule {
  /** Which effect type this rule applies to */
  effectType: EffectType;

  /** How effects combine: sum all, take highest, or take lowest */
  behavior: "stack" | "highest" | "lowest";

  /** How to group effects before applying behavior */
  groupBy: "none" | "source-type" | "stacking-group";
}
