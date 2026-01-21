/**
 * Edition, Book, and Rule Module types
 *
 * These types define the ruleset architecture that allows
 * multiple Shadowrun editions to coexist with modular,
 * book-based rule extensions and overrides.
 */

import type { ID, ISODateString, Metadata, ItemLegality } from "./core";
import type { CyberwareCategory, BiowareCategory } from "./character";
import type { CatalogItemRatingSpec, RatingTable } from "./ratings";
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
export type EditionCode = "sr1" | "sr2" | "sr3" | "sr4" | "sr4a" | "sr5" | "sr6" | "anarchy";

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
  | "actions" // Action definitions for combat and other activities
  | "categoryModificationDefaults"; // Default modification capabilities per gear category

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
  /** Base essence cost (modified by grade) - used when ratings table not present */
  essenceCost: number;

  // -------------------------------------------------------------------------
  // UNIFIED RATINGS TABLE (Preferred Approach)
  // -------------------------------------------------------------------------

  /**
   * Whether this item has selectable ratings.
   * When true with ratings table, use ratings[rating] for all values.
   */
  hasRating?: boolean;

  /** Minimum rating (defaults to 1) */
  minRating?: number;

  /** Maximum rating */
  maxRating?: number;

  /**
   * Unified ratings table with explicit per-rating values.
   * PREFERRED over ratingSpec for new data.
   * When present, this takes precedence over computed values.
   * @see docs/plans/unified-ratings-tables-migration.md
   */
  ratings?: RatingTable;

  // -------------------------------------------------------------------------
  // LEGACY: Formula-Based Scaling (Deprecated)
  // -------------------------------------------------------------------------

  /**
   * Formula-based rating specification
   * @deprecated Use ratings table instead for explicit per-rating values
   * @see CatalogItemRatingSpec
   */
  ratingSpec?: CatalogItemRatingSpec;

  /**
   * Whether essence cost scales with rating
   * @deprecated Use ratings table or ratingSpec.essenceScaling.perRating instead
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
  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;
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
  /**
   * List of augmentation IDs that are incompatible with this cyberware.
   * e.g., Skillwires is incompatible with Reflex Recorder bioware.
   */
  incompatibleWith?: string[];
}

/**
 * Bioware catalog item in ruleset data
 */
export interface BiowareCatalogItem {
  id: string;
  name: string;
  category: BiowareCategory;
  /** Base essence cost (modified by grade) - used when ratings table not present */
  essenceCost: number;

  // -------------------------------------------------------------------------
  // UNIFIED RATINGS TABLE (Preferred Approach)
  // -------------------------------------------------------------------------

  /**
   * Whether this item has selectable ratings.
   * When true with ratings table, use ratings[rating] for all values.
   */
  hasRating?: boolean;

  /** Minimum rating (defaults to 1) */
  minRating?: number;

  /** Maximum rating */
  maxRating?: number;

  /**
   * Unified ratings table with explicit per-rating values.
   * PREFERRED over ratingSpec for new data.
   * When present, this takes precedence over computed values.
   * @see docs/plans/unified-ratings-tables-migration.md
   */
  ratings?: RatingTable;

  // -------------------------------------------------------------------------
  // LEGACY: Formula-Based Scaling (Deprecated)
  // -------------------------------------------------------------------------

  /**
   * Formula-based rating specification
   * @deprecated Use ratings table instead for explicit per-rating values
   * @see CatalogItemRatingSpec
   */
  ratingSpec?: CatalogItemRatingSpec;
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
  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;
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

  // -------------------------------------------------------------------------
  // COMPATIBILITY & SKILL-LINKED BIOWARE
  // -------------------------------------------------------------------------

  /**
   * List of augmentation IDs that are incompatible with this bioware.
   * e.g., Reflex Recorder is incompatible with Skillwires.
   */
  incompatibleWith?: string[];

  /**
   * Whether this bioware requires selecting a target skill.
   * When true, user must choose a skill during purchase.
   * The bioware then provides its bonus to that specific skill.
   */
  requiresSkillTarget?: boolean;

  /**
   * Filter for which skill attributes are valid targets.
   * Only skills with a linkedAttribute in this list can be selected.
   * e.g., ["agility", "body", "reaction", "strength"] for Physical skills
   */
  skillAttributeFilter?: string[];

  /**
   * Bonus to apply to the target skill rating.
   * Defaults to 1 if not specified (e.g., Reflex Recorder gives +1).
   */
  skillBonus?: number;
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
// CYBERLIMB CATALOG TYPES (for ruleset data)
// =============================================================================

/**
 * Cyberlimb type classification
 */
export type CyberlimbType =
  | "full-arm"
  | "lower-arm"
  | "hand"
  | "full-leg"
  | "lower-leg"
  | "foot"
  | "torso"
  | "skull";

/**
 * Cyberlimb appearance classification
 */
export type CyberlimbAppearance = "obvious" | "synthetic";

/**
 * Cyberlimb catalog item in ruleset data.
 * Extends CyberwareCatalogItem with cyberlimb-specific fields.
 */
export interface CyberlimbCatalogItem extends CyberwareCatalogItem {
  /** Type classification of this limb */
  limbType: CyberlimbType;
  /** Appearance (obvious or synthetic) */
  appearance: CyberlimbAppearance;
  /** Base Strength (always 3) */
  baseStrength: 3;
  /** Base Agility (always 3) */
  baseAgility: 3;
  /**
   * Physical Condition Monitor bonus.
   * Full limbs: 1, Partial limbs: 0.5, Hands/feet: 0
   */
  physicalCMBonus: number;
  /**
   * Base capacity for this limb type.
   * Synthetic limbs have reduced capacity compared to obvious.
   */
  capacity: number;
}

/**
 * Enhancement type for cyberlimb enhancements
 */
export type CyberlimbEnhancementType = "agility" | "strength" | "armor";

/**
 * Cyberlimb enhancement catalog item in ruleset data.
 * Includes Agility Enhancement, Strength Enhancement, and Armor Enhancement.
 */
export interface CyberlimbEnhancementCatalogItem extends CyberwareCatalogItem {
  /** Enhancement type for stacking validation */
  enhancementType: CyberlimbEnhancementType;
  /** Parent limb types this can be installed in (if restricted) */
  compatibleLimbs?: CyberlimbType[];
}

/**
 * Cyberlimb accessory catalog item in ruleset data.
 * Includes gyromount, holster, slide, hydraulic jacks, smuggling compartment.
 */
export interface CyberlimbAccessoryCatalogItem extends CyberwareCatalogItem {
  /** Parent limb types this can be installed in */
  compatibleLimbs?: CyberlimbType[];
  /**
   * Whether this accessory requires a matching pair (e.g., hydraulic jacks).
   * If true, both legs must have the same rating.
   */
  requiresPair?: boolean;
  /** Body area where pair is required (e.g., "legs") */
  pairLocation?: "legs";
}

/**
 * Cyber implant weapon catalog item in ruleset data.
 * Includes cyberguns (hold-out to SMG) and cyber melee weapons (razors, blades, spurs).
 */
export interface CyberImplantWeaponCatalogItem extends CyberwareCatalogItem {
  /** Damage string (e.g., "(STR+2)P", "7P") */
  damage?: string;
  /** Armor penetration */
  ap?: number;
  /** Reach for melee weapons */
  reach?: number;
  /** Fire modes for ranged weapons */
  mode?: string[];
  /** Magazine capacity for ranged weapons */
  ammoCapacity?: number;
  /** Accuracy for ranged weapons */
  accuracy?: number;
  /** Recoil compensation */
  recoilCompensation?: number;
}

// =============================================================================
// QUALITY CATALOG TYPES (re-exported for convenience)
// =============================================================================

/**
 * Quality catalog item in ruleset data
 * @see Quality in ./qualities.ts for full type definition
 */
export type {
  Quality,
  QualityCatalog,
  QualityEffect,
  QualityPrerequisites,
  QualityLevel,
  SourceReference,
  DynamicStateType,
};

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
  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;
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
// CRITTER POWER TYPES
// =============================================================================

/**
 * Critter power type - mana or physical
 * Mana powers do not affect nonliving targets
 * Physical powers cannot be used in astral space
 */
export type CritterPowerType = "mana" | "physical";

/**
 * Action required to activate a critter power
 */
export type CritterPowerAction =
  | "auto" // Always on, no action required
  | "free" // Free Action
  | "simple" // Simple Action
  | "complex" // Complex Action
  | "special"; // Special conditions (see description)

/**
 * Range of a critter power
 */
export type CritterPowerRange =
  | "self" // Affects only the critter itself
  | "touch" // Requires physical contact
  | "los" // Line of Sight
  | "los-a" // Line of Sight (Area)
  | "special"; // Special range (see description)

/**
 * Duration of a critter power effect
 */
export type CritterPowerDuration =
  | "always" // Constantly active (Auto action powers)
  | "instant" // Takes effect and ends immediately
  | "sustained" // Maintained at no cost, up to Magic in sustained powers
  | "permanent" // Must be maintained until effects become permanent
  | "special"; // Special duration (see description)

/**
 * Category of critter power
 */
export type CritterPowerCategory =
  | "standard" // Standard critter powers (Core)
  | "spirit" // Spirit-specific powers (Street Grimoire)
  | "free-spirit" // Free spirit powers
  | "greater-spirit"; // Greater spirit powers

/**
 * Critter power catalog item in ruleset data
 * Based on SR5 Core Rulebook pp. 394-401 and Street Grimoire
 */
export interface CritterPowerCatalogItem {
  /** Unique kebab-case identifier */
  id: string;
  /** Display name */
  name: string;
  /** Power type: mana or physical */
  type: CritterPowerType;
  /** Action required to activate */
  action: CritterPowerAction;
  /** Power range */
  range: CritterPowerRange;
  /** Effect duration */
  duration: CritterPowerDuration;
  /** Power category */
  category: CritterPowerCategory;
  /** Full mechanical description */
  description: string;
  /** Short summary for display */
  summary?: string;
  /** Element type for elemental powers */
  element?: string;
  /** Whether power requires a subtype selection */
  requiresSelection?: boolean;
  /** Label for the selection input */
  selectionLabel?: string;
  /** Valid selection options */
  selectionOptions?: string[];
  /** Whether power scales with Magic/Force */
  scalesWithForce?: boolean;
  /** Source page number */
  page?: number;
  /** Source book reference */
  source?: string;
}

/**
 * Critter powers payload structure for ruleset module
 */
export interface CritterPowersPayload {
  powers: CritterPowerCatalogItem[];
  categories: Record<
    CritterPowerCategory,
    {
      name: string;
      description: string;
    }
  >;
}

// =============================================================================
// CRITTER WEAKNESS TYPES
// =============================================================================

/**
 * Critter weakness type classification
 * Based on SR5 Core Rulebook pp. 401-402
 */
export type CritterWeaknessType =
  | "allergy" // Allergic to substance (sunlight, silver, etc.)
  | "dietary-requirement" // Must consume specific substance to survive
  | "essence-loss" // Loses Essence under certain conditions
  | "induced-dormancy" // Enters dormant state under conditions
  | "reduced-senses" // Has impaired sensory abilities
  | "uneducated" // Lacks formal education (for sapient critters)
  | "vulnerability"; // Takes extra damage from specific source

/**
 * Critter weakness catalog item in ruleset data
 * Based on SR5 Core Rulebook pp. 401-402
 */
export interface CritterWeaknessCatalogItem {
  /** Unique kebab-case identifier */
  id: string;
  /** Display name */
  name: string;
  /** Weakness type classification */
  type: CritterWeaknessType;
  /** Full description of the weakness mechanics */
  description: string;
  /** Short summary for display */
  summary?: string;
  /** Source page number */
  page: number;
  /** Source book reference */
  source: string;
}

/**
 * Critter weaknesses payload structure for ruleset module
 */
export interface CritterWeaknessesPayload {
  weaknesses: CritterWeaknessCatalogItem[];
}

// =============================================================================
// CRITTER TYPES
// =============================================================================

/**
 * Critter type classification
 * Based on SR5 Core Rulebook
 */
export type CritterType =
  | "mundane" // Non-magical animals (dog, horse, shark)
  | "paracritter" // Awakened creatures with magical powers
  | "dracoform" // Dragons (eastern, western, feathered serpent)
  | "spirit" // Spirits (handled separately in spirits module)
  | "infected"; // HMHVV-infected creatures (ghouls, vampires)

/**
 * Critter attributes block
 */
export interface CritterAttributes {
  body: number;
  agility: number;
  reaction: number;
  strength: number;
  willpower: number;
  logic: number;
  intuition: number;
  charisma: number;
  edge: number;
  /** Essence - can be number or string for dice notation (e.g., "2D6") */
  essence: number | string;
  /** Magic rating (if magical) */
  magic?: number;
}

/**
 * Critter movement rates
 * Values are multipliers for walking/running and +meters for sprinting
 */
export interface CritterMovement {
  /** Walking multiplier */
  walk: number;
  /** Running multiplier */
  run: number;
  /** Sprint bonus (+meters per hit) */
  sprint: number;
  /** Swimming movement (if different from base) */
  swim?: { walk: number; run: number; sprint: number };
  /** Flight movement (if capable of flying) */
  flight?: { walk: number; run: number; sprint: number };
  /** Special movement notes (e.g., "As base metatype") */
  special?: string;
}

/**
 * Critter limits
 */
export interface CritterLimits {
  physical: number;
  mental: number;
  /** Social limit - can be string for variable limits (e.g., "5-9 (depending on Essence)") */
  social: number | string;
}

/**
 * Critter condition monitor boxes
 */
export interface CritterConditionMonitor {
  physical: number;
  stun: number;
}

/**
 * Critter skill entry
 */
export interface CritterSkill {
  /** Skill name */
  name: string;
  /** Skill rating */
  rating: number;
  /** Specialization (if any) */
  specialization?: string;
  /** Bonus from specialization (typically +2) */
  bonus?: number;
}

/**
 * Critter natural weapon (claws, bite, etc.)
 */
export interface CritterNaturalWeapon {
  /** Weapon name (e.g., "Claws/Bite", "Kick") */
  name: string;
  /** Weapon type */
  type: "melee" | "ranged";
  /** Damage string (e.g., "(STR+2)P", "8P") */
  damage: string;
  /** Armor penetration (number or "—" for none) */
  ap: number | string;
  /** Reach modifier (can be negative for small creatures) */
  reach?: number;
}

/**
 * Reference to a critter weakness with optional details
 */
export interface CritterWeaknessRef {
  /** ID of the weakness from critterWeaknesses module */
  id: string;
  /** Specific details (e.g., "Sunlight, Severe" or "Own Gaze") */
  details?: string;
}

/**
 * Reference to a critter power with optional rating/details
 */
export interface CritterPowerRef {
  /** ID of the power from critterPowers module */
  id: string;
  /** Power rating (for powers like "Armor 3") */
  rating?: number;
  /** Additional details (e.g., "Fire" for Elemental Attack) */
  details?: string;
}

/**
 * Dragon-specific hardened armor notation
 */
export interface DragonArmor {
  /** Physical hardened armor value (e.g., "17H") */
  physical: string;
  /** Mystic hardened armor value (e.g., "9H") */
  mystic: string;
}

/**
 * Critter catalog item in ruleset data
 * Based on SR5 Core Rulebook pp. 402-407
 */
export interface CritterCatalogItem {
  /** Unique kebab-case identifier */
  id: string;
  /** Display name */
  name: string;
  /** Critter type classification */
  type: CritterType;
  /** Attribute block */
  attributes: CritterAttributes;
  /** Initiative string (e.g., "8 + 1D6") */
  initiative: string;
  /** Movement rates */
  movement: CritterMovement;
  /** Condition monitor boxes */
  conditionMonitor: CritterConditionMonitor;
  /** Limit values */
  limits: CritterLimits;
  /** Armor rating (number or DragonArmor for dragons) */
  armor: number | DragonArmor;
  /** Skills the critter possesses */
  skills: CritterSkill[];
  /** Critter powers (references to critterPowers module) */
  powers: CritterPowerRef[];
  /** Critter weaknesses (references to critterWeaknesses module) */
  weaknesses?: CritterWeaknessRef[];
  /** Natural weapons */
  naturalWeapons?: CritterNaturalWeapon[];
  /** Inherent reach modifier (e.g., +1 for sasquatch, +2 for dragons) */
  reach?: number;
  /** Physical description */
  description?: string;
  /** Natural habitat */
  habitat?: string;
  /** Additional notes (e.g., magic rules, variants) */
  notes?: string;
  /** Source page number */
  page: number;
  /** Source book reference */
  source: string;
}

/**
 * Critters payload structure for ruleset module
 */
export interface CrittersPayload {
  critters: CritterCatalogItem[];
}

// =============================================================================
// MODIFICATION TYPES (for ruleset data)
// =============================================================================

/**
 * Mount points for weapon accessories
 */
export type WeaponMountType =
  | "top" // Top rail mount
  | "under" // Underbarrel mount
  | "side" // Side mount
  | "barrel" // Barrel modifications
  | "stock" // Stock modifications
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
  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;
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
  /** Legality status: "restricted" (R) or "forbidden" (F) */
  legality?: ItemLegality;
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
// MODIFICATION CAPABILITY SYSTEM
// =============================================================================

/**
 * Capability modes for equipment modification support.
 *
 * - "none": Item does not support modifications
 * - "mount-based": Uses mount points (top, under, barrel, etc.) - typical for ranged weapons
 * - "capacity-based": Uses capacity slots (armor capacity) - typical for armor
 * - "slot-based": Uses named slots with type constraints - for melee weapons and special items
 */
export type ModificationCapabilityMode = "none" | "mount-based" | "capacity-based" | "slot-based";

/**
 * A named modification slot for slot-based modification systems.
 * Used primarily for melee weapons where specific parts can be modified.
 */
export interface ModificationSlot {
  /** Unique identifier for this slot */
  slotId: string;
  /** Type of slot (e.g., "grip", "blade-coating", "guard", "pommel") */
  slotType: string;
  /** Display label for the slot */
  label: string;
  /** Whether this slot must be filled (default: false) */
  required?: boolean;
  /** Maximum number of mods in this slot (default: 1) */
  maxCount?: number;
  /** Modification categories that can be installed in this slot */
  acceptsCategories?: string[];
  /** Specific modification IDs that can be installed in this slot */
  acceptsModifications?: string[];
}

/**
 * Declares what modification systems an item or category supports.
 * This is the core type for the equipment modification capability system.
 *
 * Resolution order:
 * 1. Item-level capability (explicit override)
 * 2. Category defaults (from categoryModificationDefaults module)
 * 3. None (no modification support)
 *
 * @example Mount-based (ranged weapons)
 * ```typescript
 * {
 *   capabilityMode: "mount-based",
 *   availableMounts: ["top", "under", "barrel"]
 * }
 * ```
 *
 * @example Capacity-based (armor)
 * ```typescript
 * {
 *   capabilityMode: "capacity-based",
 *   capacity: 12
 * }
 * ```
 *
 * @example Slot-based (melee weapons)
 * ```typescript
 * {
 *   capabilityMode: "slot-based",
 *   slots: [
 *     { slotId: "grip", slotType: "grip", label: "Grip" },
 *     { slotId: "blade", slotType: "blade-coating", label: "Blade Coating" }
 *   ]
 * }
 * ```
 */
export interface ModificationCapability {
  /** How modification support is defined */
  capabilityMode: ModificationCapabilityMode;

  /** For mount-based: available mount points */
  availableMounts?: WeaponMountType[];

  /** For capacity-based: total modification capacity */
  capacity?: number;

  /** For slot-based: named slots with type constraints */
  slots?: ModificationSlot[];

  /** Whitelist: only these mod IDs are compatible */
  allowedModifications?: string[];

  /** Blacklist: these mod IDs are explicitly incompatible */
  disallowedModifications?: string[];

  /** Category restrictions (e.g., "weapon-accessory", "melee-enhancement") */
  allowedModCategories?: string[];
}

/**
 * Maps gear subcategories to their default modification capabilities.
 * This is a ruleset-level configuration that sourcebooks can extend.
 *
 * @example
 * ```typescript
 * {
 *   "melee": { capabilityMode: "none" },
 *   "heavy-pistol": { capabilityMode: "mount-based", availableMounts: ["top", "under", "barrel"] },
 *   "armor": { capabilityMode: "capacity-based" }
 * }
 * ```
 */
export type CategoryModificationDefaults = Record<string, ModificationCapability>;

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
