/**
 * House Rules Toggle Registry
 *
 * Central catalog of all GM-configurable toggles. The UI iterates this
 * to render controls; rule-engine code reads values via `getToggleValue`.
 *
 * Pure functions, no side effects. Follows the optional-rules.ts pattern.
 *
 * @see lib/types/house-rules.ts
 * @see docs/gm-feature-toggle-candidates.md
 */

import type { HouseRules, ToggleCategory, ToggleMeta } from "../types/house-rules";

// =============================================================================
// REGISTRY
// =============================================================================

/**
 * Metadata for every toggle on the HouseRules interface.
 *
 * To add a new toggle:
 * 1. Add the field to `HouseRules` in `lib/types/house-rules.ts`
 * 2. Add an entry here with its default value
 * 3. Call `getToggleValue(campaign.houseRules, 'yourField')` in the rule check
 */
export const TOGGLE_REGISTRY: ReadonlyArray<ToggleMeta> = [
  // ---------------------------------------------------------------------------
  // Dice & Combat
  // ---------------------------------------------------------------------------
  {
    id: "diceMode",
    label: "Dice Rolling Mode",
    description: "App rolls dice automatically, or players enter results from physical dice.",
    category: "dice-combat",
    defaultValue: "app-roll",
    valueType: "enum",
    options: [
      { value: "app-roll", label: "App Roll (automatic)" },
      { value: "manual-entry", label: "Manual Entry (physical dice)" },
    ],
    issueNumber: 845,
  },
  {
    id: "limitEnforcement",
    label: "Limit Enforcement",
    description: "Whether Physical/Mental/Social limits cap hits on tests.",
    category: "dice-combat",
    defaultValue: "on",
    valueType: "enum",
    options: [
      { value: "on", label: "On (RAW — hits capped)" },
      { value: "off", label: "Off (limits ignored)" },
      { value: "advisory", label: "Advisory (show limit, don't cap)" },
    ],
    issueNumber: 862,
  },
  {
    id: "hitThreshold",
    label: "Hit Threshold",
    description: "Minimum die face that counts as a hit.",
    category: "dice-combat",
    defaultValue: 5,
    valueType: "number",
    min: 3,
    max: 6,
    issueNumber: 846,
  },
  {
    id: "glitchThreshold",
    label: "Glitch Threshold",
    description: "Fraction of dice showing 1s that triggers a glitch (0.5 = more than half).",
    category: "dice-combat",
    defaultValue: 0.5,
    valueType: "number",
    min: 0.1,
    max: 1.0,
    issueNumber: 846,
  },
  {
    id: "woundBoxesPerPenalty",
    label: "Wound Boxes per Penalty",
    description: "How many damage boxes cause a -1 dice pool modifier.",
    category: "dice-combat",
    defaultValue: 3,
    valueType: "number",
    min: 1,
    max: 6,
    issueNumber: 847,
  },
  {
    id: "woundMaxPenalty",
    label: "Max Wound Penalty",
    description: "Maximum total wound modifier magnitude (stored as positive number).",
    category: "dice-combat",
    defaultValue: 4,
    valueType: "number",
    min: 1,
    max: 10,
    issueNumber: 847,
  },
  {
    id: "disabledEdgeActionIds",
    label: "Disabled Edge Actions",
    description: "Edge actions disabled for this campaign (empty = all enabled).",
    category: "dice-combat",
    defaultValue: [],
    valueType: "string-array",
    issueNumber: 863,
  },

  // ---------------------------------------------------------------------------
  // Character Creation
  // ---------------------------------------------------------------------------
  {
    id: "creationMaxAttributesAtMax",
    label: "Attributes at Max (Creation)",
    description: "How many attributes can be at metatype maximum during creation.",
    category: "character-creation",
    defaultValue: 1,
    valueType: "number",
    min: 0,
    max: 10,
    issueNumber: 849,
  },
  {
    id: "creationSkillCap",
    label: "Skill Cap (Creation)",
    description: "Maximum skill rating during character creation (Aptitude adds +1).",
    category: "character-creation",
    defaultValue: 6,
    valueType: "number",
    min: 4,
    max: 12,
    issueNumber: 850,
  },
  {
    id: "gearRestrictionLevel",
    label: "Gear Restriction Level",
    description: "Whether Restricted/Forbidden gear is available at creation.",
    category: "character-creation",
    defaultValue: "strict",
    valueType: "enum",
    options: [
      { value: "strict", label: "Strict (no R/F items)" },
      { value: "relaxed", label: "Relaxed (R items with GM approval)" },
      { value: "open", label: "Open (all items available)" },
    ],
    issueNumber: 851,
  },
  {
    id: "maxGearAvailability",
    label: "Max Gear Availability",
    description: "Maximum availability rating for gear at creation (overrides gameplay level).",
    category: "character-creation",
    defaultValue: 12,
    valueType: "number",
    min: 4,
    max: 24,
    issueNumber: 851,
  },
  {
    id: "positiveQualityKarmaCap",
    label: "Positive Quality Karma Cap",
    description: "Maximum karma that can be spent on positive qualities at creation.",
    category: "character-creation",
    defaultValue: 25,
    valueType: "number",
    min: 0,
    max: 100,
    issueNumber: 852,
  },
  {
    id: "negativeQualityKarmaCap",
    label: "Negative Quality Karma Cap",
    description: "Maximum karma gained from negative qualities at creation.",
    category: "character-creation",
    defaultValue: 25,
    valueType: "number",
    min: 0,
    max: 100,
    issueNumber: 852,
  },
  {
    id: "karmaToNuyenCap",
    label: "Karma-to-Nuyen Cap",
    description: "Maximum karma convertible to nuyen at creation.",
    category: "character-creation",
    defaultValue: 10,
    valueType: "number",
    min: 0,
    max: 50,
    issueNumber: 853,
  },
  {
    id: "nuyenCarryoverCap",
    label: "Nuyen Carryover Cap",
    description: "Maximum unspent nuyen carried from creation (excess is lost).",
    category: "character-creation",
    defaultValue: 5000,
    valueType: "number",
    min: 0,
    max: 100000,
    issueNumber: 854,
  },
  {
    id: "karmaCarryoverCap",
    label: "Karma Carryover Cap",
    description: "Maximum unspent karma carried from creation (excess is lost).",
    category: "character-creation",
    defaultValue: 7,
    valueType: "number",
    min: 0,
    max: 50,
    issueNumber: 854,
  },

  // ---------------------------------------------------------------------------
  // Contacts
  // ---------------------------------------------------------------------------
  {
    id: "maxContactConnection",
    label: "Max Contact Connection",
    description: "Maximum Connection rating for contacts.",
    category: "contacts",
    defaultValue: 12,
    valueType: "number",
    min: 1,
    max: 20,
    issueNumber: 855,
  },
  {
    id: "maxContactLoyalty",
    label: "Max Contact Loyalty",
    description: "Maximum Loyalty rating for contacts.",
    category: "contacts",
    defaultValue: 6,
    valueType: "number",
    min: 1,
    max: 10,
    issueNumber: 855,
  },
  {
    id: "contactKarmaMultiplier",
    label: "Contact Karma Multiplier",
    description: "Multiplier for contact karma budget (0 = use gameplay level default).",
    category: "contacts",
    defaultValue: 0,
    valueType: "number",
    min: 0,
    max: 10,
    issueNumber: 856,
  },

  // ---------------------------------------------------------------------------
  // Augmentation
  // ---------------------------------------------------------------------------
  {
    id: "magicReductionFormula",
    label: "Magic Loss Formula",
    description: "How essence loss from augmentations reduces Magic/Resonance.",
    category: "augmentation",
    defaultValue: "round-up",
    valueType: "enum",
    options: [
      { value: "round-up", label: "Round Up (RAW, most punishing)" },
      { value: "round-down", label: "Round Down (lenient)" },
      { value: "exact", label: "Exact (fractional tracking)" },
    ],
    issueNumber: 857,
  },
  {
    id: "trackEssenceHoles",
    label: "Essence Hole Tracking",
    description: "Whether removing augmentations creates permanent essence holes.",
    category: "augmentation",
    defaultValue: true,
    valueType: "boolean",
    issueNumber: 858,
  },
  {
    id: "allowedAugmentationGrades",
    label: "Allowed Augmentation Grades",
    description: "Which augmentation grades are available (empty = all grades).",
    category: "augmentation",
    defaultValue: [],
    valueType: "string-array",
    issueNumber: 859,
  },
  {
    id: "cyberlimbAttributeBonusCap",
    label: "Cyberlimb Attribute Bonus Cap",
    description: "Maximum attribute bonus from cyberlimb enhancements.",
    category: "augmentation",
    defaultValue: 4,
    valueType: "number",
    min: 0,
    max: 10,
    issueNumber: 860,
  },

  // ---------------------------------------------------------------------------
  // Magic
  // ---------------------------------------------------------------------------
  {
    id: "minimumDrain",
    label: "Minimum Drain",
    description: "Minimum drain value for spellcasting.",
    category: "magic",
    defaultValue: 2,
    valueType: "number",
    min: 0,
    max: 6,
    issueNumber: 861,
  },

  // ---------------------------------------------------------------------------
  // Matrix
  // ---------------------------------------------------------------------------
  {
    id: "overwatchCriticalGlitchBonus",
    label: "Overwatch Critical Glitch Bonus",
    description: "Extra Overwatch Score on a critical glitch (0 = off).",
    category: "matrix",
    defaultValue: 0,
    valueType: "number",
    min: 0,
    max: 20,
    issueNumber: 871,
  },

  // ---------------------------------------------------------------------------
  // Creation Method Tuning
  // ---------------------------------------------------------------------------
  {
    id: "sumToTenBudget",
    label: "Sum-to-Ten Budget",
    description: "Total priority points for Sum-to-Ten creation.",
    category: "creation-method",
    defaultValue: 10,
    valueType: "number",
    min: 6,
    max: 15,
    issueNumber: 865,
  },
  {
    id: "pointBuyKarmaBudget",
    label: "Point Buy Karma Budget",
    description: "Starting karma for Point Buy character creation.",
    category: "creation-method",
    defaultValue: 800,
    valueType: "number",
    min: 400,
    max: 1500,
    issueNumber: 866,
  },
  {
    id: "lifeModulesKarmaBudget",
    label: "Life Modules Karma Budget",
    description: "Starting karma for Life Modules character creation.",
    category: "creation-method",
    defaultValue: 750,
    valueType: "number",
    min: 400,
    max: 1500,
    issueNumber: 868,
  },

  // ---------------------------------------------------------------------------
  // Freeform Notes (not a toggle — always rendered as a textarea)
  // ---------------------------------------------------------------------------
  {
    id: "freeformNotes",
    label: "Additional House Rules",
    description: "Freeform notes for house rules not covered by the toggles above.",
    category: "dice-combat", // Rendered separately in UI, category doesn't matter
    defaultValue: "",
    valueType: "string",
  },
] as const;

// =============================================================================
// LOOKUP INDEX (built once at module load)
// =============================================================================

const registryByKey: ReadonlyMap<keyof HouseRules, ToggleMeta> = new Map(
  TOGGLE_REGISTRY.map((meta) => [meta.id, meta])
);

// =============================================================================
// GETTERS
// =============================================================================

/**
 * Get the effective value of a toggle, falling back to its registry default.
 *
 * @param houseRules - Campaign house rules (may be undefined)
 * @param key - Toggle key on the HouseRules interface
 * @returns The stored value if set, otherwise the registry default
 */
export function getToggleValue<K extends keyof HouseRules>(
  houseRules: HouseRules | undefined,
  key: K
): NonNullable<HouseRules[K]> {
  if (houseRules !== undefined) {
    const value = houseRules[key];
    if (value !== undefined) {
      return value as NonNullable<HouseRules[K]>;
    }
  }

  const meta = registryByKey.get(key);
  if (!meta) {
    throw new Error(`Unknown house rule toggle: ${String(key)}`);
  }
  return meta.defaultValue as NonNullable<HouseRules[K]>;
}

/**
 * Get toggle metadata by key.
 */
export function getToggleMeta(key: keyof HouseRules): ToggleMeta | undefined {
  return registryByKey.get(key);
}

/**
 * Get all toggles for a given category, in registry order.
 */
export function getTogglesByCategory(category: ToggleCategory): ReadonlyArray<ToggleMeta> {
  return TOGGLE_REGISTRY.filter((meta) => meta.category === category);
}

/**
 * Get all unique categories in registry order (first occurrence).
 */
export function getToggleCategories(): ReadonlyArray<ToggleCategory> {
  const seen = new Set<ToggleCategory>();
  const result: ToggleCategory[] = [];

  for (const meta of TOGGLE_REGISTRY) {
    if (!seen.has(meta.category)) {
      seen.add(meta.category);
      result.push(meta.category);
    }
  }

  return result;
}

/**
 * Human-readable labels for each category.
 */
export const CATEGORY_LABELS: Readonly<Record<ToggleCategory, string>> = {
  "dice-combat": "Dice & Combat",
  "character-creation": "Character Creation",
  contacts: "Contacts",
  augmentation: "Augmentation",
  magic: "Magic",
  matrix: "Matrix",
  "creation-method": "Creation Method Tuning",
};
