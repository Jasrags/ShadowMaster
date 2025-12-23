/**
 * Gameplay context types
 *
 * Types for representing gameplay contexts when applying quality effects
 * during actual play (skill tests, combat, etc.)
 */

/**
 * Base context for effect application
 */
export interface GameplayContext {
  /** Current environment conditions */
  environment?: string[]; // e.g., ["dim-light", "darkness", "indoors"]

  /** Character's current state */
  characterState?: string[]; // e.g., ["astrally-projecting", "in-combat"]

  /** Target of the action (if applicable) */
  targetType?: string[]; // e.g., ["spirit", "awakened", "technomancer"]

  /** Whether this is an opposed test */
  opposedBy?: string; // e.g., "assensing", "perception"

  /** Additional context data */
  [key: string]: unknown;
}

/**
 * Context for skill/attribute tests
 */
export interface TestContext extends GameplayContext {
  /** Skill being tested */
  skill?: string;

  /** Skill group being tested */
  skillGroup?: string;

  /** Attribute being tested */
  attribute?: string;

  /** Category of test */
  testCategory?: "combat" | "social" | "technical" | "magic" | "matrix";

  /** Whether this is a resistance test */
  isResistanceTest?: boolean;

  /** Whether this is a defense test */
  isDefenseTest?: boolean;
}

/**
 * Context for combat actions
 */
export interface CombatContext extends GameplayContext {
  /** Type of combat action */
  actionType?: string; // e.g., "melee-attack", "ranged-attack", "defense"

  /** Whether character is defending */
  isDefending?: boolean;

  /** Whether character is attacking */
  isAttacking?: boolean;
}

/**
 * Context for magic use
 */
export interface MagicContext extends GameplayContext {
  /** Type of magic action */
  actionType?: "casting" | "summoning" | "ritual" | "enchanting";

  /** Whether spell is being sustained */
  isSustaining?: boolean;

  /** Spell category */
  spellCategory?: string;
}

/**
 * Context for matrix actions
 */
export interface MatrixContext extends GameplayContext {
  /** Matrix action being performed */
  matrixAction?: string;

  /** Whether in AR, VR Cold, or VR Hot */
  matrixMode?: "ar" | "vr-cold" | "vr-hot";
}

/**
 * Context for healing tests
 */
export interface HealingContext extends GameplayContext {
  /** Type of healing */
  healingType?: "natural" | "magical" | "first-aid" | "medicine";

  /** Whether healing self or others */
  affectsSelf?: boolean;
}

/**
 * Context for damage/wound calculations
 */
export interface DamageContext extends GameplayContext {
  /** Type of damage */
  damageType?: "physical" | "stun" | "matrix";

  /** Current wound boxes */
  woundBoxes?: number;

  /** Whether calculating wound modifier */
  calculatingWoundModifier?: boolean;
}

/**
 * Context for lifestyle/cost calculations
 */
export interface CostContext extends GameplayContext {
  /** Type of cost */
  costType?: "lifestyle" | "gear" | "karma";

  /** Base cost before modifiers */
  baseCost?: number;
}

/**
 * Resolved effect value
 */
export interface ResolvedEffect {
  /** The original effect */
  effect: import("./qualities").QualityEffect;

  /** Resolved numeric value (after template substitution) */
  value: number;

  /** Resolved target (after template substitution) */
  target: import("./qualities").EffectTarget;

  /** Quality that produced this effect */
  quality: import("./qualities").Quality;

  /** Quality selection on character */
  selection: import("./qualities").QualitySelection;
}

