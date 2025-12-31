/**
 * Edition, Book, and Rule Module types
 *
 * These types define the ruleset architecture that allows
 * multiple Shadowrun editions to coexist with modular,
 * book-based rule extensions and overrides.
 */

import type { ID, ISODateString, Metadata } from "./core";
import type { CyberwareCategory, BiowareCategory } from "./character";
import type { CatalogItemRatingSpec } from "./ratings";
import type {
  Quality,
  QualityCatalog,
  QualityEffect,
  QualityPrerequisites,
  QualityLevel,
  SourceReference,
  DynamicStateType,
} from "./qualities";
import type { WirelessEffect } from "./wireless-effects";

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
  /**
   * Internal version string for this edition's ruleset data (semver format).
   * Used for drift detection and synchronization tracking.
   * @required for System Synchronization capability
   */
  version: string; // e.g., "1.0.0" for internal versioning
  description?: string;
  releaseYear: number;

  /** IDs of books available for this edition */
  bookIds: ID[];

  /** IDs of creation methods available for this edition */
  creationMethodIds: ID[];

  /** Default creation method for new characters */
  defaultCreationMethodId?: ID;

  // Discovery metadata (optional, for enhanced browsing)
  /** Game philosophy/design approach abstract */
  philosophy?: string;
  /** Key mechanical features of this edition */
  mechanicalHighlights?: string[];
  /** Types of content supported */
  supportedContentTypes?: BookCategory[];

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

  /**
   * Internal version string for this book's ruleset data (semver format).
   * Used for drift detection and synchronization tracking.
   * @required for System Synchronization capability
   */
  version: string; // e.g., "1.0.0"

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
  | "modifications" // Weapon, armor, and gear modifications
  | "cyberware" // Cyberware and essence costs
  | "bioware" // Bioware (edition-dependent)
  | "vehicles" // Vehicles and drones
  | "programs" // Matrix programs for cyberdecks
  | "lifestyle" // Lifestyle costs and features
  | "contacts" // Contact rules and costs
  | "contactTemplates" // Pre-defined contact templates
  | "contactArchetypes" // Contact archetype definitions
  | "favorServices" // Favor services and cost tables
  | "adeptPowers" // Adept magical abilities
  | "foci" // Magical foci catalog
  | "spirits" // Spirit types and powers
  | "priorities" // Priority table for creation (SR5)
  | "creationMethods" // Available character creation methods
  | "advancement" // Karma advancement rules
  | "limits" // Limit calculations (SR5-specific)
  | "diceRules" // Dice mechanics (hit thresholds, glitch rules, Edge actions)
  | "socialModifiers" // Social test modifiers
  | "actions"; // Action definitions for combat and other activities

/**
 * Rules governing character advancement post-creation.
 * These values serve as the edition-standard defaults.
 */
export interface AdvancementRules {
  /** Multiplier for training times (default: 1.0) */
  trainingTimeMultiplier: number;

  /** Karma multiplier for attribute advancement (new rating x multiplier, default: 5) */
  attributeKarmaMultiplier: number;

  /** Karma multiplier for active skill advancement (new rating x multiplier, default: 2) */
  skillKarmaMultiplier: number;

  /** Karma multiplier for skill group advancement (new rating x multiplier, default: 5) */
  skillGroupKarmaMultiplier: number;

  /** Karma multiplier for knowledge/language skill advancement (new rating x multiplier, default: 1) */
  knowledgeSkillKarmaMultiplier: number;

  /** Fixed karma cost for specializations (default: 7) */
  specializationKarmaCost: number;

  /** Fixed karma cost for spells/rituals (default: 5) */
  spellKarmaCost: number;

  /** Fixed karma cost for complex forms (default: 4) */
  complexFormKarmaCost: number;

  /** Maximum rating for physical/mental attributes (default: 10) */
  attributeRatingCap?: number;

  /** Maximum rating for active skills (default: 13) */
  skillRatingCap?: number;

  /** Whether training time requirement is skipped (default: false) */
  allowInstantAdvancement: boolean;
}

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
// CYBERWARE & BIOWARE CATALOG TYPES (for ruleset data)
// =============================================================================

/**
 * Cyberware catalog item in ruleset data
 * This is the template data, not the installed item
 */
export interface CyberwareCatalogItem {
  id: string;
  name: string;
  category: CyberwareCategory;
  /** Base essence cost (modified by grade) */
  essenceCost: number;

  /**
   * Unified rating specification (preferred over legacy properties)
   * @see CatalogItemRatingSpec
   */
  ratingSpec?: CatalogItemRatingSpec;

  /**
   * Whether the item has a rating (1-6 typically)
   * @deprecated Use ratingSpec.rating.hasRating instead
   */
  hasRating?: boolean;
  /**
   * Maximum rating if applicable
   * @deprecated Use ratingSpec.rating.maxRating instead
   */
  maxRating?: number;
  /**
   * Whether essence cost scales with rating
   * @deprecated Use ratingSpec.essenceScaling.perRating instead
   */
  essencePerRating?: boolean;
  /** Base cost in nuyen (modified by grade) */
  cost: number;
  /**
   * Whether cost scales with rating
   * @deprecated Use ratingSpec.costScaling.perRating instead
   */
  costPerRating?: boolean;
  /** Base availability */
  availability: number;
  /** Whether availability is Restricted */
  restricted?: boolean;
  /** Whether availability is Forbidden */
  forbidden?: boolean;
  /** Capacity this item provides (for cyberlimbs) */
  capacity?: number;
  /** Capacity slots this item requires (for enhancements) */
  capacityCost?: number;
  /**
   * Whether capacity cost scales with rating
   * @deprecated Use ratingSpec.capacityCostScaling.perRating instead
   */
  capacityPerRating?: boolean;
  /** Attribute bonuses provided */
  attributeBonuses?: Record<string, number>;
  /**
   * Attribute bonuses per rating
   * @deprecated Use ratingSpec.attributeBonusScaling instead
   */
  attributeBonusesPerRating?: Record<string, number>;
  /** Maximum attribute bonus (typically +4) */
  maxAttributeBonus?: number;
  /** Initiative dice bonus */
  initiativeDiceBonus?: number;
  /**
   * Initiative dice bonus per rating level
   * @deprecated Consider using ratingSpec.attributeBonusScaling if applicable
   */
  initiativeDiceBonusPerRating?: number;
  /** Description */
  description?: string;
  /** Wireless bonus description (human-readable) */
  wirelessBonus?: string;
  /**
   * Structured wireless effects for mechanical calculation.
   * @see WirelessEffect
   * @see ADR-010 Inventory State Management
   */
  wirelessEffects?: WirelessEffect[];
  /** Page reference in source material */
  page?: number;
  /** Source book reference */
  source?: string;
  /** Parent item ID for modular cyberware */
  parentType?: string;
  /** Special requirements or notes */
  requirements?: string[];
}

/**
 * Bioware catalog item in ruleset data
 */
export interface BiowareCatalogItem {
  id: string;
  name: string;
  category: BiowareCategory;
  /** Base essence cost (modified by grade) */
  essenceCost: number;

  /**
   * Unified rating specification (preferred over legacy properties)
   * @see CatalogItemRatingSpec
   */
  ratingSpec?: CatalogItemRatingSpec;

  /**
   * Whether the item has a rating
   * @deprecated Use ratingSpec.rating.hasRating instead
   */
  hasRating?: boolean;
  /**
   * Maximum rating if applicable
   * @deprecated Use ratingSpec.rating.maxRating instead
   */
  maxRating?: number;
  /**
   * Whether essence cost scales with rating
   * @deprecated Use ratingSpec.essenceScaling.perRating instead
   */
  essencePerRating?: boolean;
  /** Base cost in nuyen (modified by grade) */
  cost: number;
  /**
   * Whether cost scales with rating
   * @deprecated Use ratingSpec.costScaling.perRating instead
   */
  costPerRating?: boolean;
  /** Base availability */
  availability: number;
  /** Whether availability is Restricted */
  restricted?: boolean;
  /** Whether availability is Forbidden */
  forbidden?: boolean;
  /** Attribute bonuses provided */
  attributeBonuses?: Record<string, number>;
  /**
   * Attribute bonuses per rating
   * @deprecated Use ratingSpec.attributeBonusScaling instead
   */
  attributeBonusesPerRating?: Record<string, number>;
  /** Maximum attribute bonus */
  maxAttributeBonus?: number;
  /** Description */
  description?: string;
  /** Wireless bonus description (human-readable) */
  wirelessBonus?: string;
  /**
   * Structured wireless effects for mechanical calculation.
   * @see WirelessEffect
   * @see ADR-010 Inventory State Management
   */
  wirelessEffects?: WirelessEffect[];
  /** Page reference in source material */
  page?: number;
  /** Source book reference */
  source?: string;
  /** Special requirements or notes */
  requirements?: string[];
}

/**
 * Augmentation rules for an edition
 */
export interface AugmentationRules {
  /** Maximum essence (typically 6) */
  maxEssence: number;
  /** Maximum attribute bonus from augmentations (typically +4) */
  maxAttributeBonus: number;
  /** Maximum availability at character creation (typically 12) */
  maxAvailabilityAtCreation: number;
  /** Whether to track essence holes */
  trackEssenceHoles: boolean;
  /** Magic/Resonance reduction formula */
  magicReductionFormula: "roundUp" | "roundDown" | "exact";
}

// =============================================================================
// QUALITY CATALOG TYPES (re-exported for convenience)
// =============================================================================

/**
 * Quality catalog item in ruleset data
 * @see Quality in ./qualities.ts for full type definition
 */
export type { Quality, QualityCatalog, QualityEffect, QualityPrerequisites, QualityLevel, SourceReference, DynamicStateType };

// =============================================================================
// FOCI TYPES (for ruleset data)
// =============================================================================

/**
 * Types of magical foci from SR5 Core Rulebook
 */
export enum FocusType {
  Enchanting = "enchanting",
  Metamagic = "metamagic",
  Power = "power",
  Qi = "qi",
  Spell = "spell",
  Spirit = "spirit",
  Weapon = "weapon",
}

/**
 * Focus interface for magical foci
 * This represents a focus owned by a character
 */
export interface Focus {
  type: FocusType;
  force: number;
  bonded: boolean;
  karmaToBond: number;
  cost: number;
}

/**
 * Focus catalog item in ruleset data
 * This is the template data, not the owned item
 */
export interface FocusCatalogItem {
  id: string;
  name: string;
  type: FocusType;
  /** Cost multiplier (cost = Force × multiplier) */
  costMultiplier: number;
  /** Karma cost multiplier for bonding (karma = Force × multiplier) */
  bondingKarmaMultiplier: number;
  /** Base availability */
  availability: number;
  /** Whether availability is Restricted (R) or Forbidden (F) */
  restricted?: boolean;
  forbidden?: boolean;
  /** Description */
  description?: string;
  /** Page reference in source material */
  page?: number;
  /** Source book reference */
  source?: string;
}

// =============================================================================
// SPIRIT TYPES (for ruleset data)
// =============================================================================

/**
 * Types of spirits from SR5 Core Rulebook
 */
export enum SpiritType {
  Air = "air",
  Beasts = "beasts",
  Earth = "earth",
  Fire = "fire",
  Man = "man",
  Water = "water",
  Guardian = "guardian",
  Guidance = "guidance",
  Plant = "plant",
  Task = "task",
}

/**
 * Spirit power interface
 * Represents a power that a spirit can have
 */
export interface SpiritPower {
  name: string;
  description?: string;
  action?: string;
  range?: string;
  duration?: string;
}

/**
 * Spirit catalog data in ruleset
 * This represents the template data for spirits that can be summoned
 */
export interface Spirit {
  type: SpiritType;
  force: number;
  services: number;
  powers: SpiritPower[];
  optionalPowers?: SpiritPower[];
  weaknesses?: string[];
}

// =============================================================================
// MODIFICATION TYPES (for ruleset data)
// =============================================================================

/**
 * Mount points for weapon accessories
 */
export type WeaponMountType =
  | "top"       // Top rail mount
  | "under"     // Underbarrel mount
  | "side"      // Side mount
  | "barrel"    // Barrel modifications
  | "stock"     // Stock modifications
  | "internal"; // Internal modifications

/**
 * Types of gear that can be modified
 */
export type ModifiableGearType =
  | "weapon"
  | "armor"
  | "vehicle"
  | "drone"
  | "cyberdeck"
  | "commlink";

/**
 * Weapon modification catalog item in ruleset data
 * Based on SR5 Run & Gun and Core Rulebook
 */
export interface WeaponModificationCatalogItem {
  id: string;
  name: string;
  /** Mount point required (undefined means no mount needed) */
  mount?: WeaponMountType;
  /** Additional mount points occupied (for multi-slot accessories like bipods) */
  occupiedMounts?: WeaponMountType[];
  /** If true, this mod is built into specific weapons and cannot be removed */
  isBuiltIn?: boolean;
  /** Weapon types this mod is compatible with */
  compatibleWeapons?: string[];
  /** Weapon types this mod is NOT compatible with */
  incompatibleWeapons?: string[];
  /** Minimum weapon size (e.g., "rifle" for underbarrel attachments) */
  minimumWeaponSize?: "holdout" | "light-pistol" | "heavy-pistol" | "smg" | "rifle" | "heavy";
  /** Base cost in nuyen */
  cost: number;
  /** Whether cost is a multiplier of weapon cost */
  costMultiplier?: number;

  /**
   * Unified rating specification (preferred over legacy properties)
   * @see CatalogItemRatingSpec
   */
  ratingSpec?: CatalogItemRatingSpec;

  /**
   * Whether the mod has a rating (1-6 typically)
   * @deprecated Use ratingSpec.rating.hasRating instead
   */
  hasRating?: boolean;
  /**
   * Maximum rating if applicable
   * @deprecated Use ratingSpec.rating.maxRating instead
   */
  maxRating?: number;
  /**
   * Whether cost scales with rating
   * @deprecated Use ratingSpec.costScaling.perRating instead
   */
  costPerRating?: boolean;
  /** Base availability */
  availability: number;
  /** Whether availability is Restricted */
  restricted?: boolean;
  /** Whether availability is Forbidden */
  forbidden?: boolean;
  /** Recoil compensation provided */
  recoilCompensation?: number;
  /** Accuracy modifier */
  accuracyModifier?: number;
  /** Concealability modifier */
  concealabilityModifier?: number;
  /** Description */
  description?: string;
  /** Wireless bonus description */
  wirelessBonus?: string;
  /** Page reference in source material */
  page?: number;
  /** Source book reference */
  source?: string;
}

/**
 * Weapon size categories for compatibility checking
 */
export type WeaponSizeCategory =
  | "holdout"
  | "light-pistol"
  | "heavy-pistol"
  | "smg"
  | "rifle"
  | "heavy";

/**
 * Mount point configuration for a weapon subcategory
 */
export interface WeaponSubcategoryMountConfig {
  /** Available mount points for this subcategory */
  availableMounts: WeaponMountType[];
  /** Size category for compatibility checking */
  size?: WeaponSizeCategory;
}

/**
 * Registry mapping weapon subcategories to their mount point configurations.
 * This is the authoritative source for mount point availability per weapon type.
 */
export type WeaponSubcategoryMountRegistry = Record<string, WeaponSubcategoryMountConfig>;

/**
 * Armor modification catalog item in ruleset data
 * Based on SR5 Core Rulebook and Run & Gun
 */
export interface ArmorModificationCatalogItem {
  id: string;
  name: string;
  /** Capacity cost (can be flat or in brackets for no capacity use) */
  capacityCost: number;

  /**
   * Unified rating specification (preferred over legacy properties)
   * @see CatalogItemRatingSpec
   */
  ratingSpec?: CatalogItemRatingSpec;

  /**
   * Whether capacity cost scales with rating
   * @deprecated Use ratingSpec.capacityCostScaling.perRating instead
   */
  capacityPerRating?: boolean;
  /** Whether this uses no capacity (bracketed in rulebook) */
  noCapacityCost?: boolean;
  /**
   * Whether the mod has a rating (1-6 typically)
   * @deprecated Use ratingSpec.rating.hasRating instead
   */
  hasRating?: boolean;
  /**
   * Maximum rating if applicable
   * @deprecated Use ratingSpec.rating.maxRating instead
   */
  maxRating?: number;
  /** Base cost in nuyen */
  cost: number;
  /**
   * Whether cost scales with rating
   * @deprecated Use ratingSpec.costScaling.perRating instead
   */
  costPerRating?: boolean;
  /** Whether cost is a multiplier of armor cost */
  costMultiplier?: number;
  /** Base availability */
  availability: number;
  /** Availability modifier (adds to armor's base) */
  availabilityModifier?: number;
  /** Whether availability is Restricted */
  restricted?: boolean;
  /** Whether availability is Forbidden */
  forbidden?: boolean;
  /** Armor bonus provided */
  armorBonus?: number;
  /** Requirements (e.g., "full body armor", "helmet") */
  requirements?: string[];
  /** Description */
  description?: string;
  /** Wireless bonus description */
  wirelessBonus?: string;
  /** Page reference in source material */
  page?: number;
  /** Source book reference */
  source?: string;
}

/**
 * Complete modifications catalog structure
 */
export interface ModificationsCatalog {
  /** Weapon accessories and modifications */
  weaponMods: WeaponModificationCatalogItem[];
  /** Armor modifications */
  armorMods: ArmorModificationCatalogItem[];
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

