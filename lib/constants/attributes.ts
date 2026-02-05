/**
 * Attribute Constants
 *
 * Centralized definitions for Shadowrun attribute names,
 * abbreviations, and normalization utilities.
 */

// =============================================================================
// ATTRIBUTE DEFINITIONS
// =============================================================================

export const PHYSICAL_ATTRIBUTES = ["body", "agility", "reaction", "strength"] as const;
export const MENTAL_ATTRIBUTES = ["willpower", "logic", "intuition", "charisma"] as const;
export const SPECIAL_ATTRIBUTES = ["edge", "magic", "resonance"] as const;

export const CORE_ATTRIBUTES = [...PHYSICAL_ATTRIBUTES, ...MENTAL_ATTRIBUTES] as const;
export const ALL_ATTRIBUTES = [...CORE_ATTRIBUTES, ...SPECIAL_ATTRIBUTES] as const;

export type PhysicalAttribute = (typeof PHYSICAL_ATTRIBUTES)[number];
export type MentalAttribute = (typeof MENTAL_ATTRIBUTES)[number];
export type SpecialAttribute = (typeof SPECIAL_ATTRIBUTES)[number];
export type CoreAttribute = (typeof CORE_ATTRIBUTES)[number];
export type Attribute = (typeof ALL_ATTRIBUTES)[number];

// =============================================================================
// ABBREVIATION MAPPING
// =============================================================================

/**
 * Map of common attribute abbreviations to full attribute names.
 * Supports both 3-letter Shadowrun abbreviations and common variations.
 */
export const ATTRIBUTE_ABBREVIATION_MAP: Record<string, Attribute> = {
  // Physical attributes
  bod: "body",
  agi: "agility",
  rea: "reaction",
  str: "strength",

  // Mental attributes
  wil: "willpower",
  log: "logic",
  int: "intuition",
  cha: "charisma",

  // Special attributes
  mag: "magic",
  res: "resonance",
  // Note: "edge" has no common abbreviation
};

// =============================================================================
// NORMALIZATION
// =============================================================================

/**
 * Normalize an attribute key to its canonical form.
 *
 * Converts abbreviated forms (bod, agi, etc.) and handles case-insensitivity.
 *
 * @param key - The attribute key to normalize (e.g., "BOD", "body", "agi")
 * @returns The normalized attribute name in lowercase, or the original lowercased key if not found
 *
 * @example
 * normalizeAttributeKey("BOD") // => "body"
 * normalizeAttributeKey("agi") // => "agility"
 * normalizeAttributeKey("charisma") // => "charisma"
 * normalizeAttributeKey("unknown") // => "unknown"
 */
export function normalizeAttributeKey(key: string): string {
  const lower = key.toLowerCase();
  return ATTRIBUTE_ABBREVIATION_MAP[lower] ?? lower;
}

/**
 * Check if a key represents a valid attribute (after normalization).
 */
export function isValidAttribute(key: string): key is Attribute {
  const normalized = normalizeAttributeKey(key);
  return (ALL_ATTRIBUTES as readonly string[]).includes(normalized);
}

/**
 * Check if a key represents a core (physical or mental) attribute.
 */
export function isCoreAttribute(key: string): key is CoreAttribute {
  const normalized = normalizeAttributeKey(key);
  return (CORE_ATTRIBUTES as readonly string[]).includes(normalized);
}

/**
 * Check if a key represents a special attribute (edge, magic, resonance).
 */
export function isSpecialAttribute(key: string): key is SpecialAttribute {
  const normalized = normalizeAttributeKey(key);
  return (SPECIAL_ATTRIBUTES as readonly string[]).includes(normalized);
}
