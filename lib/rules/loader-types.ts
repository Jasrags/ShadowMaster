/**
 * Type definitions for ruleset loader data structures
 *
 * This file contains only type definitions with no runtime dependencies.
 * It can be safely imported by client components without pulling in server-only code.
 */

import type {
  ID,
  Edition,
  EditionCode,
  BookPayload,
  CreationMethod,
  SpiritType,
  SpiritPower,
  CatalogItemRatingSpec,
  CyberwareCategory,
  BiowareCategory,
  ContactTemplateData,
} from "../types";

// =============================================================================
// LOADER CONFIGURATION TYPES
// =============================================================================

/**
 * Configuration for loading a ruleset
 */
export interface RulesetLoadConfig {
  editionCode: EditionCode;

  /**
   * Specific book IDs to include. If empty/undefined, all books are loaded.
   */
  bookIds?: ID[];

  /**
   * Whether to include the core rulebook (always true by default)
   */
  includeCore?: boolean;
}

/**
 * A loaded ruleset before merging - contains all the raw data
 * from the edition and books, organized for the merge engine.
 */
export interface LoadedRuleset {
  edition: Edition;
  books: LoadedBook[];
  creationMethods: CreationMethod[];
}

/**
 * A loaded book with its payload parsed and ready
 */
export interface LoadedBook {
  id: ID;
  title: string;
  isCore: boolean;
  payload: BookPayload;
  loadOrder: number;
}

/**
 * Result of loading a ruleset
 */
export interface LoadResult {
  success: boolean;
  ruleset?: LoadedRuleset;
  error?: string;
}

// =============================================================================
// METATYPE DATA TYPES
// =============================================================================

/**
 * Metatype data structure from the metatypes module
 */
export interface MetatypeData {
  id: string;
  name: string;
  baseMetatype: string | null;
  description?: string;
  attributes: Record<string, { min: number; max: number } | { base: number }>;
  racialTraits: string[];
  priorityAvailability?: Record<string, { specialAttributePoints: number }>;
}

// =============================================================================
// SKILL DATA TYPES
// =============================================================================

/**
 * Skill data structure
 */
export interface SkillData {
  id: string;
  name: string;
  linkedAttribute: string;
  group: string | null;
  canDefault: boolean;
  category: string;
  requiresMagic?: boolean;
  requiresResonance?: boolean;
}

/**
 * Skill group data structure
 */
export interface SkillGroupData {
  id: string;
  name: string;
  skills: string[];
}

/**
 * Knowledge skill category data structure
 */
export interface KnowledgeCategoryData {
  id: string;
  name: string;
  linkedAttribute: string;
}

/**
 * Skill creation limits data structure
 */
export interface SkillCreationLimitsData {
  maxSkillRating: number;
  maxSkillRatingWithAptitude: number;
  freeKnowledgePoints: string; // Formula like "(LOG + INT) × 2"
  nativeLanguageRating: number;
}

/**
 * Example knowledge skill data structure
 */
export interface ExampleKnowledgeSkillData {
  name: string;
  category: "academic" | "interests" | "professional" | "street";
}

/**
 * Example language data structure
 */
export interface ExampleLanguageData {
  name: string;
  region?: string;
}

// =============================================================================
// QUALITY DATA TYPES
// =============================================================================

/**
 * Quality data structure
 *
 * This interface matches the Quality type from the spec but is kept
 * separate for backward compatibility with existing code.
 * @see Quality in @/lib/types/qualities for the complete type definition
 */
export interface QualityData {
  id: string;
  name: string;
  karmaCost?: number;
  karmaBonus?: number;
  summary: string;
  description?: string;
  perRating?: boolean;
  maxRating?: number;
  requiresMagic?: boolean;
  isRacial?: boolean;
  levels?: Array<{ level: number; name: string; karma: number; effects?: unknown[] }>;
  statModifiers?: Record<string, number | boolean>;
  requiresSpecification?: boolean;
  specificationLabel?: string;
  /** Source of specification options - e.g., "mentorSpirits" to pull from mentorSpirits data */
  specificationSource?: string;
  specificationOptions?: string[];
  limit?: number;
  tags?: string[];
  prerequisites?: unknown; // Will be QualityPrerequisites when fully implemented
  incompatibilities?: string[];
  effects?: unknown[]; // Will be QualityEffect[] when fully implemented
  source?: { book: string; page: number };
  dynamicState?: string; // Will be DynamicStateType when fully implemented
}

// =============================================================================
// PRIORITY TABLE DATA TYPES
// =============================================================================

/**
 * Priority table data structure
 */
export interface PriorityTableData {
  levels: string[];
  categories: Array<{ id: string; name: string; description?: string }>;
  table: Record<string, Record<string, unknown>>;
}

// =============================================================================
// MAGIC PATH DATA TYPES
// =============================================================================

/**
 * Magic path data structure
 */
export interface MagicPathData {
  id: string;
  name: string;
  description?: string;
  hasMagic: boolean;
  hasResonance: boolean;
  canAstralProject?: boolean;
  canCastSpells?: boolean;
  canSummonSpirits?: boolean;
  hasAdeptPowers?: boolean;
}

// =============================================================================
// LIFESTYLE DATA TYPES
// =============================================================================

/**
 * Lifestyle data structure
 */
export interface LifestyleData {
  id: string;
  name: string;
  monthlyCost: number;
  startingNuyen: string;
}

/**
 * Lifestyle subscription catalog item
 */
export interface LifestyleSubscriptionCatalogItem {
  id: string;
  name: string;
  monthlyCost?: number;
  yearlyCost?: number;
  costPerRating?: boolean;
  minRating?: number;
  maxRating?: number;
  category?: string;
  description?: string;
}

/**
 * Lifestyle subscriptions catalog data structure
 */
export interface LifestyleSubscriptionsCatalogData {
  subscriptions: LifestyleSubscriptionCatalogItem[];
}

// =============================================================================
// GEAR DATA TYPES
// =============================================================================

/**
 * Base gear item data structure
 */
export interface GearItemData {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  rating?: number;
  description?: string;

  /**
   * Unified rating specification (preferred over legacy properties)
   * @see CatalogItemRatingSpec
   */
  ratingSpec?: CatalogItemRatingSpec;

  /**
   * @deprecated Use ratingSpec.rating.hasRating instead
   */
  hasRating?: boolean;
  /**
   * @deprecated Use ratingSpec.rating.maxRating instead
   */
  maxRating?: number;
  /**
   * @deprecated Use ratingSpec.costScaling.perRating instead
   */
  costPerRating?: boolean;
  capacity?: number;
  /**
   * @deprecated Use ratingSpec.capacityCostScaling.perRating instead
   */
  capacityPerRating?: boolean;
}

/**
 * Weapon data structure (extends GearItemData)
 */
export interface WeaponData extends GearItemData {
  damage: string;
  ap: number;
  reach?: number;
  accuracy?: number;
  mode?: string[];
  rc?: number;
  ammo?: number;
  blast?: string;
}

/**
 * Armor data structure (extends GearItemData)
 */
export interface ArmorData extends GearItemData {
  armorRating: number;
}

/**
 * Commlink data structure (extends GearItemData)
 */
export interface CommlinkData extends GearItemData {
  deviceRating: number;
}

/**
 * Cyberdeck data structure (extends GearItemData)
 */
export interface CyberdeckData extends GearItemData {
  deviceRating: number;
  attributes: {
    attack: number;
    sleaze: number;
    dataProcessing: number;
    firewall: number;
  };
  programs: number;
}

/**
 * Gear catalog data structure
 */
export interface GearCatalogData {
  categories: Array<{ id: string; name: string }>;
  weapons: {
    melee: WeaponData[];
    pistols: WeaponData[];
    smgs: WeaponData[];
    rifles: WeaponData[];
    shotguns: WeaponData[];
    sniperRifles: WeaponData[];
    throwingWeapons: WeaponData[];
    grenades: WeaponData[];
  };
  armor: ArmorData[];
  commlinks: CommlinkData[];
  cyberdecks: CyberdeckData[];
  electronics: GearItemData[];
  tools: GearItemData[];
  survival: GearItemData[];
  medical: GearItemData[];
  security: GearItemData[];
  miscellaneous: GearItemData[];
  ammunition: GearItemData[];
}

// =============================================================================
// SPELL AND COMPLEX FORM DATA TYPES
// =============================================================================

/**
 * Spell data structure
 */
export interface SpellData {
  id: string;
  name: string;
  category: "combat" | "detection" | "health" | "illusion" | "manipulation";
  type: "mana" | "physical";
  range: string;
  duration: string;
  drain: string;
  damage?: string;
  description?: string;
}

/**
 * Complex form data structure
 */
export interface ComplexFormData {
  id: string;
  name: string;
  target: string;
  duration: string;
  fading: string;
  description?: string;
}

/**
 * Sprite type data structure for technomancers
 */
export interface SpriteTypeData {
  id: string;
  name: string;
  description: string;
  attributes: {
    attack: string;
    sleaze: string;
    dataProcessing: string;
    firewall: string;
  };
  initiative: {
    formula: string;
    dice: number;
  };
  resonance: string;
  skills: string[];
  powers: string[];
}

/**
 * Sprite power data structure
 */
export interface SpritePowerData {
  id: string;
  name: string;
  description: string;
}

/**
 * Spells catalog data structure
 */
export interface SpellsCatalogData {
  combat: SpellData[];
  detection: SpellData[];
  health: SpellData[];
  illusion: SpellData[];
  manipulation: SpellData[];
}

// =============================================================================
// CYBERWARE AND BIOWARE DATA TYPES
// =============================================================================

/**
 * Cyberware grade data structure (from ruleset)
 */
export interface CyberwareGradeData {
  id: string;
  name: string;
  essenceMultiplier: number;
  costMultiplier: number;
  availabilityModifier: number;
}

/**
 * Cyberware catalog item data structure (from ruleset)
 */
export interface CyberwareCatalogItemData {
  id: string;
  name: string;
  category: CyberwareCategory;
  essenceCost: number;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;

  /**
   * Unified rating specification (preferred over legacy properties)
   * @see CatalogItemRatingSpec
   */
  ratingSpec?: CatalogItemRatingSpec;

  /**
   * @deprecated Use ratingSpec.rating.hasRating instead
   */
  hasRating?: boolean;
  /**
   * @deprecated Use ratingSpec.rating.maxRating instead
   */
  maxRating?: number;
  /**
   * @deprecated Use ratingSpec.essenceScaling.perRating instead
   */
  essencePerRating?: boolean;
  /**
   * @deprecated Use ratingSpec.costScaling.perRating instead
   */
  costPerRating?: boolean;
  capacity?: number;
  capacityCost?: number;
  /**
   * @deprecated Use ratingSpec.capacityCostScaling.perRating instead
   */
  capacityPerRating?: boolean;
  attributeBonuses?: Record<string, number>;
  /**
   * @deprecated Use ratingSpec.attributeBonusScaling instead
   */
  attributeBonusesPerRating?: Record<string, number>;
  maxAttributeBonus?: number;
  initiativeDiceBonus?: number;
  /**
   * @deprecated Consider using ratingSpec.attributeBonusScaling if applicable
   */
  initiativeDiceBonusPerRating?: number;
  description?: string;
  wirelessBonus?: string;
  page?: number;
  source?: string;
  parentType?: string;
  requirements?: string[];
}

/**
 * Augmentation rules data structure
 */
export interface AugmentationRulesData {
  maxEssence: number;
  maxAttributeBonus: number;
  maxAvailabilityAtCreation: number;
  trackEssenceHoles: boolean;
  magicReductionFormula: "roundUp" | "roundDown" | "exact";
}

/**
 * Cyberware catalog data structure
 */
export interface CyberwareCatalogData {
  rules: AugmentationRulesData;
  grades: CyberwareGradeData[];
  catalog: CyberwareCatalogItemData[];
}

/**
 * Bioware grade data structure (from ruleset)
 */
export interface BiowareGradeData {
  id: string;
  name: string;
  essenceMultiplier: number;
  costMultiplier: number;
  availabilityModifier: number;
}

/**
 * Bioware catalog item data structure (from ruleset)
 */
export interface BiowareCatalogItemData {
  id: string;
  name: string;
  category: BiowareCategory;
  essenceCost: number;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;

  /**
   * Unified rating specification (preferred over legacy properties)
   * @see CatalogItemRatingSpec
   */
  ratingSpec?: CatalogItemRatingSpec;

  /**
   * @deprecated Use ratingSpec.rating.hasRating instead
   */
  hasRating?: boolean;
  /**
   * @deprecated Use ratingSpec.rating.maxRating instead
   */
  maxRating?: number;
  /**
   * @deprecated Use ratingSpec.essenceScaling.perRating instead
   */
  essencePerRating?: boolean;
  /**
   * @deprecated Use ratingSpec.costScaling.perRating instead
   */
  costPerRating?: boolean;
  attributeBonuses?: Record<string, number>;
  /**
   * @deprecated Use ratingSpec.attributeBonusScaling instead
   */
  attributeBonusesPerRating?: Record<string, number>;
  maxAttributeBonus?: number;
  initiativeDiceBonus?: number;
  description?: string;
  page?: number;
  source?: string;
  requirements?: string[];
}

/**
 * Bioware catalog data structure
 */
export interface BiowareCatalogData {
  grades: BiowareGradeData[];
  catalog: BiowareCatalogItemData[];
}

// =============================================================================
// ADEPT POWER DATA TYPES
// =============================================================================

/**
 * Adept power catalog item from ruleset data
 */
export interface AdeptPowerCatalogItem {
  id: string;
  name: string;
  cost: number | null;
  costType: "fixed" | "perLevel" | "table";
  maxLevel?: number;
  activation?: "free" | "simple" | "complex" | "interrupt";
  description: string;
  requiresSkill?: boolean;
  validSkills?: string[];
  requiresAttribute?: boolean;
  validAttributes?: string[];
  requiresLimit?: boolean;
  validLimits?: string[];
  levels?: Array<{ level: number; cost: number; bonus: string }>;
  variants?: Array<{ id: string; name: string; bonus?: string }>;
}

// =============================================================================
// TRADITION DATA TYPES
// =============================================================================

/**
 * Spirit type mapping for a tradition
 */
export interface TraditionSpiritTypes {
  combat: string;
  detection: string;
  health: string;
  illusion: string;
  manipulation: string;
}

/**
 * Drain variant for traditions with conditional drain attributes
 */
export interface DrainVariant {
  condition: string;
  alternateAttributes: [string, string];
}

/**
 * Tradition data structure from ruleset
 */
export interface TraditionData {
  id: string;
  name: string;
  drainAttributes: [string, string];
  spiritTypes: TraditionSpiritTypes;
  description: string;
  source?: string;
  isPossessionTradition?: boolean;
  drainVariant?: DrainVariant;
}

// =============================================================================
// MENTOR SPIRIT DATA TYPES
// =============================================================================

/**
 * Mentor spirit advantages by character type
 */
export interface MentorSpiritAdvantages {
  all: string;
  magician?: string;
  adept?: string;
}

/**
 * Mentor spirit data structure from ruleset
 */
export interface MentorSpiritData {
  id: string;
  name: string;
  description: string;
  karmaCost: number;
  advantages: MentorSpiritAdvantages;
  disadvantage: string;
  source?: string;
}

// =============================================================================
// RITUAL DATA TYPES
// =============================================================================

/**
 * Ritual keyword data structure
 */
export interface RitualKeywordData {
  id: string;
  name: string;
  description: string;
}

/**
 * Minion stats for rituals that create minions (Watcher, Homunculus)
 */
export interface MinionStatsData {
  attributes: {
    body?: string | number | null;
    agility?: string | number | null;
    reaction?: string | number | null;
    strength?: string | number | null;
    willpower?: string | number | null;
    logic?: string | number | null;
    intuition?: string | number | null;
    charisma?: string | number | null;
  };
  initiative?: string;
  astralInitiative?: string;
  movement?: string;
  skills: string[];
  powers: string[];
  notes?: string;
}

/**
 * Ritual data structure from ruleset
 */
export interface RitualData {
  id: string;
  name: string;
  keywords: string[];
  /** For spell rituals, which spell category it works with */
  spellCategory?: "combat" | "detection" | "health" | "illusion" | "manipulation";
  description: string;
  duration: string;
  /** Whether this ritual can be made permanent with karma */
  canBePermanent?: boolean;
  /** Karma cost formula to make permanent (e.g., "Force") */
  permanentKarmaCost?: string;
  /** Stats for minion rituals (Watcher, Homunculus) */
  minionStats?: MinionStatsData;
  source?: string;
}

// =============================================================================
// VEHICLE, DRONE, RCC, AND AUTOSOFT DATA TYPES
// =============================================================================

/**
 * Vehicle category metadata
 */
export interface VehicleCategoryData {
  id: string;
  name: string;
  description?: string;
}

/**
 * Drone size category metadata
 */
export interface DroneSizeData {
  id: string;
  name: string;
  bodyRange: string;
  description?: string;
}

/**
 * Handling rating - can be single value or on-road/off-road pair
 */
export type HandlingRatingData = number | { onRoad: number; offRoad: number };

/**
 * Vehicle catalog item from ruleset data
 */
export interface VehicleCatalogItemData {
  id: string;
  name: string;
  category: string;
  handling: HandlingRatingData;
  speed: number;
  acceleration: number;
  body: number;
  armor: number;
  pilot: number;
  sensor: number;
  seats?: number;
  deviceRating?: number;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  description?: string;
  page?: number;
  source?: string;
}

/**
 * Drone weapon mount configuration
 */
export interface DroneWeaponMountsData {
  standard?: number;
  heavy?: number;
}

/**
 * Drone catalog item from ruleset data
 */
export interface DroneCatalogItemData {
  id: string;
  name: string;
  size: string;
  droneType: string;
  handling: number;
  speed: number;
  acceleration: number;
  body: number;
  armor: number;
  pilot: number;
  sensor: number;
  canFly?: boolean;
  isAquatic?: boolean;
  weaponMounts?: DroneWeaponMountsData;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  description?: string;
  page?: number;
  source?: string;
}

/**
 * RCC (Rigger Command Console) catalog item from ruleset data
 */
export interface RCCCatalogItemData {
  id: string;
  name: string;
  deviceRating: number;
  dataProcessing: number;
  firewall: number;
  cost: number;
  availability: number;
  restricted?: boolean;
  description?: string;
  page?: number;
  source?: string;
}

/**
 * Autosoft catalog item from ruleset data
 */
export interface AutosoftCatalogItemData {
  id: string;
  name: string;
  category: string;
  maxRating: number;
  costPerRating: number;
  availabilityPerRating: number;
  requiresTarget?: boolean;
  targetType?: "weapon" | "vehicle";
  description?: string;
  page?: number;
  source?: string;
}

/**
 * Complete vehicles module data from ruleset
 */
export interface VehiclesCatalogData {
  categories: VehicleCategoryData[];
  droneSizes: DroneSizeData[];
  groundcraft: VehicleCatalogItemData[];
  watercraft: VehicleCatalogItemData[];
  aircraft: VehicleCatalogItemData[];
  drones: DroneCatalogItemData[];
  rccs: RCCCatalogItemData[];
  autosofts: AutosoftCatalogItemData[];
}

// =============================================================================
// PROGRAM DATA TYPES
// =============================================================================

/**
 * Program catalog item data returned from loader
 */
export interface ProgramCatalogItemData {
  id: string;
  name: string;
  category: "common" | "hacking" | "agent";
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  minRating?: number;
  maxRating?: number;
  costPerRating?: number;
  description?: string;
  effects?: string;
  page?: number;
  source?: string;
}

/**
 * Programs module data from ruleset
 */
export interface ProgramsCatalogData {
  common: ProgramCatalogItemData[];
  hacking: ProgramCatalogItemData[];
  agents: ProgramCatalogItemData[];
}

// =============================================================================
// FOCI DATA TYPES
// =============================================================================

/**
 * Focus catalog item data structure
 */
export interface FocusCatalogItemData {
  id: string;
  name: string;
  type: string;
  costMultiplier: number;
  bondingKarmaMultiplier: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  description?: string;
  page?: number;
  source?: string;
}

// =============================================================================
// SPIRIT DATA TYPES
// =============================================================================

/**
 * Spirit type data structure
 */
export interface SpiritTypeData {
  type: SpiritType;
  name: string;
  basePowers: SpiritPower[];
  weaknesses?: string[];
}

/**
 * Spirits catalog data structure
 */
export interface SpiritsCatalogData {
  spiritTypes: SpiritTypeData[];
  optionalPowers: SpiritPower[];
}

// =============================================================================
// GEAR MODIFICATION DATA TYPES
// =============================================================================

/**
 * Weapon modification catalog item data structure
 */
export interface WeaponModificationCatalogItemData {
  id: string;
  name: string;
  /** Mount point required (undefined means no mount needed) */
  mount?: "top" | "under" | "side" | "barrel" | "stock" | "internal";
  /** Weapon types this mod is compatible with */
  compatibleWeapons?: string[];
  /** Weapon types this mod is NOT compatible with */
  incompatibleWeapons?: string[];
  /** Minimum weapon size */
  minimumWeaponSize?: string;
  /** Base cost in nuyen */
  cost?: number;
  /** Whether cost is a multiplier of weapon cost */
  costMultiplier?: number;

  /**
   * Unified rating specification (preferred over legacy properties)
   * @see CatalogItemRatingSpec
   */
  ratingSpec?: CatalogItemRatingSpec;

  /**
   * Whether the mod has a rating
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
  /** Page reference */
  page?: number;
  /** Source book */
  source?: string;
}

/**
 * Armor modification catalog item data structure
 */
export interface ArmorModificationCatalogItemData {
  id: string;
  name: string;
  /** Capacity cost */
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
   * Whether the mod has a rating
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
  /** Page reference */
  page?: number;
  /** Source book */
  source?: string;
}

/**
 * Cyberware modification catalog item data structure
 */
export interface CyberwareModificationCatalogItemData {
  id: string;
  name: string;
  /** Capacity cost */
  capacityCost: number;
  /** Whether capacity cost scales with rating */
  capacityPerRating?: boolean;
  /** Whether this uses no capacity (bracketed in rulebook) */
  noCapacityCost?: boolean;
  /** Whether the mod has a rating */
  hasRating?: boolean;
  /** Maximum rating if applicable */
  maxRating?: number;
  /** Base cost in nuyen */
  cost: number;
  /** Whether cost scales with rating */
  costPerRating?: boolean;
  /** Base availability */
  availability: number;
  /** Whether availability is Restricted */
  restricted?: boolean;
  /** Whether availability is Forbidden */
  forbidden?: boolean;
  /** Applicable cyberware categories/subcategories */
  applicableCategories?: string[];
  /** Parent type (e.g., "cyberlimb" for cyberlimb enhancements) */
  parentType?: string;
  /** Attribute bonuses provided */
  attributeBonuses?: Record<string, number>;
  /** Attribute bonuses per rating */
  attributeBonusesPerRating?: Record<string, number>;
  /** Requirements */
  requirements?: string[];
  /** Description */
  description?: string;
  /** Page reference */
  page?: number;
  /** Source book */
  source?: string;
}

/**
 * Gear modification catalog item data structure
 */
export interface GearModificationCatalogItemData {
  id: string;
  name: string;
  /** Capacity cost */
  capacityCost: number;
  /** Whether capacity cost scales with rating */
  capacityPerRating?: boolean;
  /** Whether the mod has a rating */
  hasRating?: boolean;
  /** Maximum rating if applicable */
  maxRating?: number;
  /** Base cost in nuyen */
  cost: number;
  /** Whether cost scales with rating */
  costPerRating?: boolean;
  /** Base availability */
  availability: number;
  /** Whether availability is Restricted */
  restricted?: boolean;
  /** Whether availability is Forbidden */
  forbidden?: boolean;
  /** Applicable gear categories/subcategories (e.g., "audio") */
  applicableCategories?: string[];
  /** Description */
  description?: string;
  /** Page reference */
  page?: number;
  /** Source book */
  source?: string;
}

/**
 * Complete modifications catalog data structure
 */
export interface ModificationsCatalogData {
  weaponMods: WeaponModificationCatalogItemData[];
  armorMods: ArmorModificationCatalogItemData[];
  cyberwareMods?: CyberwareModificationCatalogItemData[];
  gearMods?: GearModificationCatalogItemData[];
}

