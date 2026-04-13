/**
 * House Rules Type Definitions
 *
 * Structured GM-configurable feature toggles stored on campaigns.
 * Each field is optional — undefined means "use the default."
 *
 * The `TOGGLE_REGISTRY` in `lib/rules/house-rules-registry.ts` maps
 * each key to its metadata (label, description, category, default).
 *
 * @see docs/gm-feature-toggle-candidates.md
 * @see lib/rules/house-rules-registry.ts
 */

// =============================================================================
// CATEGORIES
// =============================================================================

/**
 * Grouping categories for the settings UI.
 */
export type ToggleCategory =
  | "dice-combat"
  | "character-creation"
  | "contacts"
  | "augmentation"
  | "magic"
  | "matrix"
  | "creation-method";

// =============================================================================
// ENUM VALUE TYPES
// =============================================================================

/** Dice rolling mode: app generates rolls vs. players enter physical dice results */
export type DiceMode = "app-roll" | "manual-entry";

/** Limit enforcement: full (RAW), off (ignore limits), advisory (show but don't cap) */
export type LimitEnforcement = "on" | "off" | "advisory";

/** Gear restriction level at creation */
export type GearRestrictionLevel = "strict" | "relaxed" | "open";

/** Essence-magic reduction rounding formula */
export type MagicReductionFormula = "round-up" | "round-down" | "exact";

// =============================================================================
// HOUSE RULES INTERFACE
// =============================================================================

/**
 * Structured house rules for a campaign.
 *
 * Every field is optional. When a field is `undefined`, the system uses
 * the default value declared in the toggle registry. This keeps existing
 * campaigns backward-compatible — an empty `{}` object means "all defaults."
 */
export interface HouseRules {
  // ---------------------------------------------------------------------------
  // Dice & Combat (#845, #846, #847, #862, #863)
  // ---------------------------------------------------------------------------

  /** #845 — Dice rolling mode */
  diceMode?: DiceMode;

  /** #862 — Whether limits cap hits */
  limitEnforcement?: LimitEnforcement;

  /** #846 — Minimum die face that counts as a hit (default: 5) */
  hitThreshold?: number;

  /** #846 — Fraction of dice showing 1s that triggers a glitch (default: 0.5) */
  glitchThreshold?: number;

  /** #847 — Damage boxes per -1 wound penalty (default: 3) */
  woundBoxesPerPenalty?: number;

  /** #847 — Maximum wound modifier magnitude (default: 4, stored positive) */
  woundMaxPenalty?: number;

  /** #863 — Edge action IDs to disable (empty = all enabled) */
  disabledEdgeActionIds?: string[];

  // ---------------------------------------------------------------------------
  // Character Creation (#848–#854, #864)
  // ---------------------------------------------------------------------------

  /** #849 — Max attributes at metatype maximum during creation (default: 1) */
  creationMaxAttributesAtMax?: number;

  /** #850 — Max skill rating during creation (default: 6) */
  creationSkillCap?: number;

  /** #851 — Gear availability restriction level */
  gearRestrictionLevel?: GearRestrictionLevel;

  /** #851 — Max gear availability at creation (overrides gameplay level) */
  maxGearAvailability?: number;

  /** #852 — Max karma on positive qualities (default: 25) */
  positiveQualityKarmaCap?: number;

  /** #852 — Max karma from negative qualities (default: 25) */
  negativeQualityKarmaCap?: number;

  /** #853 — Max karma convertible to nuyen at creation (default: 10) */
  karmaToNuyenCap?: number;

  /** #854 — Max unspent nuyen carried from creation (default: 5000) */
  nuyenCarryoverCap?: number;

  /** #854 — Max unspent karma carried from creation (default: 7) */
  karmaCarryoverCap?: number;

  // ---------------------------------------------------------------------------
  // Contacts (#855, #856)
  // ---------------------------------------------------------------------------

  /** #855 — Max Connection rating for contacts */
  maxContactConnection?: number;

  /** #855 — Max Loyalty rating for contacts (default: 6) */
  maxContactLoyalty?: number;

  /** #856 — Contact karma budget multiplier override (default: use gameplay level) */
  contactKarmaMultiplier?: number;

  // ---------------------------------------------------------------------------
  // Augmentation (#857–#860)
  // ---------------------------------------------------------------------------

  /** #857 — How essence loss reduces Magic/Resonance */
  magicReductionFormula?: MagicReductionFormula;

  /** #858 — Track essence holes when removing augmentations */
  trackEssenceHoles?: boolean;

  /** #859 — Allowed augmentation grade IDs (undefined = all grades) */
  allowedAugmentationGrades?: string[];

  /** #860 — Max attribute bonus from cyberlimbs (default: 4) */
  cyberlimbAttributeBonusCap?: number;

  // ---------------------------------------------------------------------------
  // Magic (#861)
  // ---------------------------------------------------------------------------

  /** #861 — Minimum drain value for spellcasting (default: 2) */
  minimumDrain?: number;

  // ---------------------------------------------------------------------------
  // Matrix (#871)
  // ---------------------------------------------------------------------------

  /** #871 — Extra Overwatch Score on critical glitch (0 = off, 2 = common house rule) */
  overwatchCriticalGlitchBonus?: number;

  // ---------------------------------------------------------------------------
  // Creation Method Tuning (#865–#869)
  // ---------------------------------------------------------------------------

  /** #865 — Sum-to-Ten total budget (default: 10) */
  sumToTenBudget?: number;

  /** #866 — Point Buy starting karma (default: 800) */
  pointBuyKarmaBudget?: number;

  /** #868 — Life Modules starting karma (default: 750) */
  lifeModulesKarmaBudget?: number;

  // ---------------------------------------------------------------------------
  // Freeform Notes
  // ---------------------------------------------------------------------------

  /** Unstructured GM notes for house rules not covered by toggles */
  freeformNotes?: string;
}

// =============================================================================
// TOGGLE METADATA
// =============================================================================

/** The primitive shape a toggle value can take */
export type ToggleValueType = "boolean" | "number" | "enum" | "string" | "string-array";

/**
 * Metadata for a single toggle, used by the registry and rendered in the UI.
 */
export interface ToggleMeta {
  /** Key on the HouseRules interface */
  id: keyof HouseRules;

  /** Human-readable label */
  label: string;

  /** One-sentence description shown in the UI */
  description: string;

  /** UI grouping category */
  category: ToggleCategory;

  /** Default value when the toggle is unset */
  defaultValue: unknown;

  /** Primitive type for the UI renderer */
  valueType: ToggleValueType;

  /** For enum toggles: allowed values and their labels */
  options?: ReadonlyArray<{ value: string; label: string }>;

  /** For number toggles: minimum allowed value */
  min?: number;

  /** For number toggles: maximum allowed value */
  max?: number;

  /** Related GitHub issue number */
  issueNumber?: number;
}

// =============================================================================
// DEFAULTS
// =============================================================================

/**
 * Create an empty house rules object (all defaults).
 */
export function createDefaultHouseRules(): HouseRules {
  return {};
}
