/**
 * Core shared types used across the application
 */

/** UUID string type for entity identifiers */
export type ID = string;

/** ISO 8601 date string */
export type ISODateString = string;

/** Generic metadata object for extensibility */
export type Metadata = Record<string, unknown>;

/**
 * Magical or resonance path for a character
 */
export type MagicalPath =
  | "mundane"
  | "full-mage"
  | "aspected-mage"
  | "mystic-adept"
  | "adept"
  | "technomancer"
  | "explorer";

/**
 * Item legality status for availability
 * - "restricted": Requires license, marked with "R" suffix
 * - "forbidden": Illegal, marked with "F" suffix
 * - undefined: Legal, no suffix
 */
export type ItemLegality = "restricted" | "forbidden";
