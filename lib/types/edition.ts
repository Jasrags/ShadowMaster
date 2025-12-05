/**
 * Edition, Book, and Rule Module types
 *
 * These types define the ruleset architecture that allows
 * multiple Shadowrun editions to coexist with modular,
 * book-based rule extensions and overrides.
 */

import type { ID, ISODateString, Metadata } from "./core";

// =============================================================================
// EDITION
// =============================================================================

/**
 * Supported Shadowrun edition identifiers
 */
export type EditionCode =
  | "sr1"
  | "sr2"
  | "sr3"
  | "sr4"
  | "sr4a"
  | "sr5"
  | "sr6"
  | "anarchy";

/**
 * An Edition represents a top-level ruleset for a specific
 * version of Shadowrun. Each edition is a self-contained
 * sandbox with no cross-contamination from other editions.
 */
export interface Edition {
  id: ID;
  name: string; // "Shadowrun 5th Edition"
  shortCode: EditionCode;
  version?: string; // e.g., "1.0" for internal versioning
  description?: string;
  releaseYear: number;

  /** IDs of books available for this edition */
  bookIds: ID[];

  /** IDs of creation methods available for this edition */
  creationMethodIds: ID[];

  /** Default creation method for new characters */
  defaultCreationMethodId?: ID;

  createdAt: ISODateString;
  updatedAt?: ISODateString;
}

// =============================================================================
// BOOK
// =============================================================================

/**
 * Category of book content
 */
export type BookCategory =
  | "core" // Core rulebook - required for edition
  | "sourcebook" // Optional rules, gear, spells, etc.
  | "adventure" // Narrative content with optional mechanics
  | "mission" // Episodic campaign content
  | "novel"; // Lore-only content

/**
 * A Book represents a physical or digital Shadowrun publication
 * that contains rule modules and/or overrides to existing rules.
 */
export interface Book {
  id: ID;
  editionId: ID;
  title: string; // "Shadowrun 5th Edition Core Rulebook"
  abbreviation?: string; // "SR5"
  publisher?: string; // "Catalyst Game Labs"
  releaseYear?: number;
  isbn?: string;

  /** Whether this is the core rulebook for the edition */
  isCore: boolean;

  /** Categories this book belongs to */
  categories: BookCategory[];

  /**
   * Path or storage key to the JSON payload file
   * containing this book's rule modules and overrides
   */
  payloadRef: string;

  /** Optional metadata for extensibility */
  metadata?: Metadata;

  createdAt: ISODateString;
  updatedAt?: ISODateString;
}

// =============================================================================
// RULE MODULE
// =============================================================================

/**
 * Types of rule modules that can be defined per edition
 */
export type RuleModuleType =
  | "metatypes" // Playable races and their stats
  | "attributes" // Core attributes (BOD, AGI, etc.)
  | "skills" // Skills and skill groups
  | "qualities" // Positive and negative qualities
  | "magic" // Magic system, traditions, spells
  | "resonance" // Technomancer abilities
  | "combat" // Combat rules and actions
  | "matrix" // Matrix/decking rules
  | "gear" // Equipment, weapons, armor
  | "cyberware" // Cyberware and essence costs
  | "bioware" // Bioware (edition-dependent)
  | "vehicles" // Vehicles and drones
  | "lifestyle" // Lifestyle costs and features
  | "contacts" // Contact rules and costs
  | "priorities" // Priority table for creation (SR5)
  | "creationMethods" // Available character creation methods
  | "advancement" // Karma advancement rules
  | "limits"; // Limit calculations (SR5-specific)

/**
 * A RuleModule encapsulates a specific domain of rules
 * (e.g., all skills, all combat rules) for an edition.
 *
 * The basePayload contains the actual rule data as a
 * flexible JSON structure specific to the module type.
 */
export interface RuleModule {
  id: ID;
  editionId: ID;
  moduleType: RuleModuleType;
  name?: string; // Human-readable name
  description?: string;

  /**
   * The actual rule data. Structure depends on moduleType.
   * Use specific payload interfaces for type safety when accessing.
   */
  basePayload: Record<string, unknown>;

  version?: string;
  createdAt: ISODateString;
  updatedAt?: ISODateString;
}

// =============================================================================
// RULE OVERRIDE
// =============================================================================

/**
 * Strategy for merging an override with base rules
 */
export type MergeStrategy =
  | "replace" // Completely replace the base value
  | "merge" // Deep merge objects, merge arrays by ID
  | "append" // Append to arrays or add new keys
  | "remove"; // Remove specified keys or array items

/**
 * A RuleOverride represents modifications to a base rule module
 * provided by a sourcebook or errata.
 */
export interface RuleOverride {
  id: ID;
  bookId: ID;
  moduleId: ID;

  /**
   * The override data to apply to the base module
   */
  overridePayload: Record<string, unknown>;

  /**
   * How to merge this override with the base module
   */
  mergeStrategy: MergeStrategy;

  /** Reason for the override (e.g., "errata", "expansion", "optional rule") */
  reason?: string;

  createdAt: ISODateString;
}

// =============================================================================
// BOOK PAYLOAD (JSON FILE STRUCTURE)
// =============================================================================

/**
 * Structure of a book's JSON payload file.
 * This is what gets stored at the book's payloadRef location.
 */
export interface BookPayload {
  meta: {
    bookId: ID;
    title: string;
    edition: EditionCode;
    version: string;
    category: BookCategory;
  };

  /**
   * Rule modules provided or modified by this book.
   * Key is the RuleModuleType.
   */
  modules: {
    [K in RuleModuleType]?: BookModuleEntry;
  };
}

/**
 * Entry for a single module within a book payload
 */
export interface BookModuleEntry {
  /** Merge strategy for this module's data */
  mergeStrategy?: MergeStrategy;

  /** Whether to replace entirely (shorthand for mergeStrategy: "replace") */
  replace?: boolean;

  /** Whether to append (shorthand for mergeStrategy: "append") */
  append?: boolean;

  /** The actual module data */
  payload: Record<string, unknown>;
}

// =============================================================================
// MERGED RULESET
// =============================================================================

/**
 * A MergedRuleset is the final, immutable result of combining
 * an edition's base rules with all enabled book overrides.
 *
 * This is what the validation engine and UI consume.
 */
export interface MergedRuleset {
  /** Unique identifier for this specific merged configuration */
  snapshotId: ID;

  /** The base edition */
  editionId: ID;
  editionCode: EditionCode;

  /** Books that were merged (in order) */
  bookIds: ID[];

  /** The merged rule modules, keyed by type */
  modules: {
    [K in RuleModuleType]?: Record<string, unknown>;
  };

  /** When this snapshot was created */
  createdAt: ISODateString;
}

