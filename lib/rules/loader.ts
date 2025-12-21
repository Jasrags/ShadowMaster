/**
 * Ruleset Loader
 *
 * Loads edition definitions and book payloads, preparing them
 * for the merge engine to produce a final MergedRuleset.
 */

import type {
  ID,
  Edition,
  EditionCode,
  BookPayload,
  RuleModuleType,
  CreationMethod,
  SpiritType,
  SpiritPower,
  CatalogItemRatingSpec,
} from "../types";
import {
  getEdition,
  getAllEditions,
  getBookPayload,
  getAllBookPayloads,
  getCreationMethod,
  getAllCreationMethods,
} from "../storage/editions";

// =============================================================================
// TYPES
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
// LOADER FUNCTIONS
// =============================================================================

/**
 * Load a complete ruleset for an edition with specified books.
 *
 * This is the main entry point for loading ruleset data.
 * The result can be passed to the merge engine.
 */
export async function loadRuleset(config: RulesetLoadConfig): Promise<LoadResult> {
  const { editionCode, bookIds, includeCore = true } = config;

  // Load the edition
  const edition = await getEdition(editionCode);
  if (!edition) {
    return {
      success: false,
      error: `Edition '${editionCode}' not found`,
    };
  }

  // Determine which books to load
  let booksToLoad: ID[];
  if (bookIds && bookIds.length > 0) {
    booksToLoad = bookIds;
    // Always include core if requested
    if (includeCore && !booksToLoad.includes("core-rulebook")) {
      booksToLoad = ["core-rulebook", ...booksToLoad];
    }
  } else {
    // Load all books defined in the edition
    booksToLoad = edition.bookIds;
  }

  // Load book payloads
  const loadedBooks: LoadedBook[] = [];
  for (let i = 0; i < booksToLoad.length; i++) {
    const bookId = booksToLoad[i];
    const payload = await getBookPayload(editionCode, bookId);

    if (!payload) {
      // Core book is required
      if (bookId === "core-rulebook" || bookId === edition.bookIds[0]) {
        return {
          success: false,
          error: `Core rulebook for edition '${editionCode}' not found`,
        };
      }
      // Other books are optional - log warning but continue
      console.warn(`Book '${bookId}' not found for edition '${editionCode}'`);
      continue;
    }

    loadedBooks.push({
      id: bookId,
      title: payload.meta.title,
      isCore: payload.meta.category === "core",
      payload,
      loadOrder: i,
    });
  }

  // Ensure we have at least the core book
  const hasCore = loadedBooks.some((b) => b.isCore);
  if (!hasCore) {
    return {
      success: false,
      error: `No core rulebook found for edition '${editionCode}'`,
    };
  }

  // Load creation methods
  const creationMethods = await getAllCreationMethods(editionCode);

  return {
    success: true,
    ruleset: {
      edition,
      books: loadedBooks,
      creationMethods,
    },
  };
}

/**
 * Load just the edition metadata
 */
export async function loadEdition(editionCode: EditionCode): Promise<Edition | null> {
  return getEdition(editionCode);
}

/**
 * Load all available editions
 */
export async function loadAllEditions(): Promise<Edition[]> {
  return getAllEditions();
}

/**
 * Load a single book's payload
 */
export async function loadBook(
  editionCode: EditionCode,
  bookId: ID
): Promise<BookPayload | null> {
  return getBookPayload(editionCode, bookId);
}

/**
 * Load all book payloads for an edition
 */
export async function loadAllBooks(editionCode: EditionCode): Promise<BookPayload[]> {
  return getAllBookPayloads(editionCode);
}

/**
 * Load a specific creation method
 */
export async function loadCreationMethod(
  editionCode: EditionCode,
  methodId: ID
): Promise<CreationMethod | null> {
  return getCreationMethod(editionCode, methodId);
}

/**
 * Load all creation methods for an edition
 */
export async function loadAllCreationMethods(
  editionCode: EditionCode
): Promise<CreationMethod[]> {
  return getAllCreationMethods(editionCode);
}

// =============================================================================
// MODULE EXTRACTION HELPERS
// =============================================================================

/**
 * Extract a specific module type from a loaded ruleset
 */
export function extractModule<T = Record<string, unknown>>(
  ruleset: LoadedRuleset,
  moduleType: RuleModuleType
): T | null {
  // Find the first book that has this module (core book first due to load order)
  for (const book of ruleset.books) {
    const moduleEntry = book.payload.modules?.[moduleType];
    if (moduleEntry?.payload) {
      return moduleEntry.payload as T;
    }
  }
  return null;
}

/**
 * Extract all instances of a module type from all books
 * (useful for seeing what each book contributes before merging)
 */
export function extractAllModules<T = Record<string, unknown>>(
  ruleset: LoadedRuleset,
  moduleType: RuleModuleType
): Array<{ bookId: ID; payload: T }> {
  const results: Array<{ bookId: ID; payload: T }> = [];

  for (const book of ruleset.books) {
    const moduleEntry = book.payload.modules?.[moduleType];
    if (moduleEntry?.payload) {
      results.push({
        bookId: book.id,
        payload: moduleEntry.payload as T,
      });
    }
  }

  return results;
}

/**
 * Get the list of module types present in a loaded ruleset
 */
export function getAvailableModuleTypes(ruleset: LoadedRuleset): RuleModuleType[] {
  const types = new Set<RuleModuleType>();

  for (const book of ruleset.books) {
    if (book.payload.modules) {
      for (const moduleType of Object.keys(book.payload.modules)) {
        types.add(moduleType as RuleModuleType);
      }
    }
  }

  return Array.from(types);
}

// =============================================================================
// CONVENIENCE LOADERS FOR SPECIFIC DATA
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

/**
 * Load metatypes from a ruleset
 */
export function extractMetatypes(ruleset: LoadedRuleset): MetatypeData[] {
  const ruleModule = extractModule<{ metatypes: MetatypeData[] }>(ruleset, "metatypes");
  return ruleModule?.metatypes || [];
}

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
 * Load skills from a ruleset
 */
export interface ExampleKnowledgeSkillData {
  name: string;
  category: "academic" | "interests" | "professional" | "street";
}

export interface ExampleLanguageData {
  name: string;
  region?: string;
}

export function extractSkills(ruleset: LoadedRuleset): {
  activeSkills: SkillData[];
  skillGroups: SkillGroupData[];
  knowledgeCategories: KnowledgeCategoryData[];
  creationLimits: SkillCreationLimitsData;
  exampleKnowledgeSkills: ExampleKnowledgeSkillData[];
  exampleLanguages: ExampleLanguageData[];
} {
  const ruleModule = extractModule<{
    activeSkills: SkillData[];
    skillGroups: SkillGroupData[];
    knowledgeCategories: KnowledgeCategoryData[];
    creationLimits: SkillCreationLimitsData;
    exampleKnowledgeSkills: ExampleKnowledgeSkillData[];
    exampleLanguages: ExampleLanguageData[];
  }>(ruleset, "skills");

  return {
    activeSkills: ruleModule?.activeSkills || [],
    skillGroups: ruleModule?.skillGroups || [],
    knowledgeCategories: ruleModule?.knowledgeCategories || [],
    creationLimits: ruleModule?.creationLimits || {
      maxSkillRating: 6,
      maxSkillRatingWithAptitude: 7,
      freeKnowledgePoints: "(LOG + INT) × 2",
      nativeLanguageRating: 6,
    },
    exampleKnowledgeSkills: ruleModule?.exampleKnowledgeSkills || [],
    exampleLanguages: ruleModule?.exampleLanguages || [],
  };
}

/**
 * Quality data structure
 */
export interface QualityData {
  id: string;
  name: string;
  karmaCost?: number;
  karmaBonus?: number;
  summary: string;
  perRating?: boolean;
  maxRating?: number;
  requiresMagic?: boolean;
  isRacial?: boolean;
  levels?: Array<{ level: number; name: string; karma: number }>;
  statModifiers?: Record<string, number | boolean>;
  requiresSpecification?: boolean;
  specificationLabel?: string;
  /** Source of specification options - e.g., "mentorSpirits" to pull from mentorSpirits data */
  specificationSource?: string;
  limit?: number;
}

/**
 * Load qualities from a ruleset
 */
export function extractQualities(ruleset: LoadedRuleset): {
  positive: QualityData[];
  negative: QualityData[];
} {
  const ruleModule = extractModule<{
    positive: QualityData[];
    negative: QualityData[];
  }>(ruleset, "qualities");

  return {
    positive: ruleModule?.positive || [],
    negative: ruleModule?.negative || [],
  };
}

/**
 * Priority table data structure
 */
export interface PriorityTableData {
  levels: string[];
  categories: Array<{ id: string; name: string; description?: string }>;
  table: Record<string, Record<string, unknown>>;
}

/**
 * Load priority table from a ruleset
 */
export function extractPriorityTable(ruleset: LoadedRuleset): PriorityTableData | null {
  return extractModule<PriorityTableData>(ruleset, "priorities");
}

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

/**
 * Load magic paths from a ruleset
 */
export function extractMagicPaths(ruleset: LoadedRuleset): MagicPathData[] {
  const ruleModule = extractModule<{ paths: MagicPathData[] }>(ruleset, "magic");
  return ruleModule?.paths || [];
}

/**
 * Lifestyle data structure
 */
export interface LifestyleData {
  id: string;
  name: string;
  monthlyCost: number;
  startingNuyen: string;
}

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

export interface LifestyleSubscriptionsCatalogData {
  subscriptions: LifestyleSubscriptionCatalogItem[];
}

/**
 * Load lifestyles from a ruleset
 */
export function extractLifestyles(ruleset: LoadedRuleset): LifestyleData[] {
  const ruleModule = extractModule<{ lifestyles: LifestyleData[] }>(ruleset, "lifestyle");
  return ruleModule?.lifestyles || [];
}

/**
 * Load lifestyle metatype modifiers from a ruleset
 */
export function extractLifestyleModifiers(ruleset: LoadedRuleset): Record<string, number> {
  const ruleModule = extractModule<{ metatypeModifiers: Record<string, number> }>(ruleset, "lifestyle");
  return ruleModule?.metatypeModifiers || {};
}

/**
 * Load lifestyle subscriptions from a ruleset
 */
export function extractLifestyleSubscriptions(ruleset: LoadedRuleset): LifestyleSubscriptionCatalogItem[] {
  const ruleModule = extractModule<LifestyleSubscriptionsCatalogData>(ruleset, "lifestyle");
  return ruleModule?.subscriptions || [];
}

// =============================================================================
// GEAR DATA TYPES AND LOADERS
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

/**
 * Load gear catalog from a ruleset
 */
export function extractGear(ruleset: LoadedRuleset): GearCatalogData | null {
  const ruleModule = extractModule<GearCatalogData>(ruleset, "gear");
  return ruleModule;
}

// =============================================================================
// SPELL AND COMPLEX FORM DATA TYPES AND LOADERS
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

/**
 * Load spells from a ruleset
 */
export function extractSpells(ruleset: LoadedRuleset): SpellsCatalogData | null {
  const ruleModule = extractModule<{ spells: SpellsCatalogData }>(ruleset, "magic");
  return ruleModule?.spells || null;
}

/**
 * Load complex forms from a ruleset
 */
export function extractComplexForms(ruleset: LoadedRuleset): ComplexFormData[] {
  const ruleModule = extractModule<{ complexForms: ComplexFormData[] }>(ruleset, "magic");
  return ruleModule?.complexForms || [];
}

/**
 * Load sprite types from a ruleset
 */
export function extractSpriteTypes(ruleset: LoadedRuleset): SpriteTypeData[] {
  const ruleModule = extractModule<{ spriteTypes: SpriteTypeData[] }>(ruleset, "magic");
  return ruleModule?.spriteTypes || [];
}

/**
 * Load sprite powers from a ruleset
 */
export function extractSpritePowers(ruleset: LoadedRuleset): SpritePowerData[] {
  const ruleModule = extractModule<{ spritePowers: SpritePowerData[] }>(ruleset, "magic");
  return ruleModule?.spritePowers || [];
}

// =============================================================================
// CYBERWARE AND BIOWARE DATA TYPES AND LOADERS
// =============================================================================

import type { CyberwareCategory, BiowareCategory } from "../types";

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

/**
 * Load cyberware catalog from a ruleset
 */
export function extractCyberware(ruleset: LoadedRuleset): CyberwareCatalogData | null {
  const ruleModule = extractModule<CyberwareCatalogData>(ruleset, "cyberware");
  if (!ruleModule) return null;

  return {
    rules: ruleModule.rules || {
      maxEssence: 6,
      maxAttributeBonus: 4,
      maxAvailabilityAtCreation: 12,
      trackEssenceHoles: true,
      magicReductionFormula: "roundUp",
    },
    grades: ruleModule.grades || [],
    catalog: ruleModule.catalog || [],
  };
}

/**
 * Load bioware catalog from a ruleset
 */
export function extractBioware(ruleset: LoadedRuleset): BiowareCatalogData | null {
  const ruleModule = extractModule<BiowareCatalogData>(ruleset, "bioware");
  if (!ruleModule) return null;

  return {
    grades: ruleModule.grades || [],
    catalog: ruleModule.catalog || [],
  };
}

/**
 * Load augmentation rules from cyberware module
 */
export function extractAugmentationRules(ruleset: LoadedRuleset): AugmentationRulesData {
  const cyberware = extractCyberware(ruleset);
  return (
    cyberware?.rules || {
      maxEssence: 6,
      maxAttributeBonus: 4,
      maxAvailabilityAtCreation: 12,
      trackEssenceHoles: true,
      magicReductionFormula: "roundUp",
    }
  );
}

// =============================================================================
// CONTACT TEMPLATE DATA TYPES AND LOADERS
// =============================================================================

import type { ContactTemplateData } from "../types";

/**
 * Load contact templates from a ruleset
 */
export function extractContactTemplates(ruleset: LoadedRuleset): ContactTemplateData[] {
  const ruleModule = extractModule<{ templates: ContactTemplateData[] }>(ruleset, "contactTemplates");
  return ruleModule?.templates || [];
}

// =============================================================================
// ADEPT POWER DATA TYPES AND LOADERS
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

/**
 * Load adept powers from a ruleset
 */
export function extractAdeptPowers(ruleset: LoadedRuleset): AdeptPowerCatalogItem[] {
  const ruleModule = extractModule<{ powers: AdeptPowerCatalogItem[] }>(ruleset, "adeptPowers");
  return ruleModule?.powers || [];
}

// =============================================================================
// TRADITION DATA TYPES AND LOADERS
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

/**
 * Load traditions from a ruleset
 */
export function extractTraditions(ruleset: LoadedRuleset): TraditionData[] {
  const ruleModule = extractModule<{ traditions: TraditionData[] }>(ruleset, "magic");
  return ruleModule?.traditions || [];
}

// =============================================================================
// MENTOR SPIRIT DATA TYPES AND LOADERS
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

/**
 * Load mentor spirits from a ruleset
 */
export function extractMentorSpirits(ruleset: LoadedRuleset): MentorSpiritData[] {
  const ruleModule = extractModule<{ mentorSpirits: MentorSpiritData[] }>(ruleset, "magic");
  return ruleModule?.mentorSpirits || [];
}

// =============================================================================
// RITUAL DATA TYPES AND LOADERS
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

/**
 * Load rituals from a ruleset
 */
export function extractRituals(ruleset: LoadedRuleset): RitualData[] {
  const ruleModule = extractModule<{ rituals: RitualData[] }>(ruleset, "magic");
  return ruleModule?.rituals || [];
}

/**
 * Load ritual keywords from a ruleset
 */
export function extractRitualKeywords(ruleset: LoadedRuleset): RitualKeywordData[] {
  const ruleModule = extractModule<{ ritualKeywords: RitualKeywordData[] }>(ruleset, "magic");
  return ruleModule?.ritualKeywords || [];
}

// =============================================================================
// VEHICLE, DRONE, RCC, AND AUTOSOFT DATA TYPES AND LOADERS
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

/**
 * Load vehicles catalog from a ruleset
 */
export function extractVehicles(ruleset: LoadedRuleset): VehicleCatalogItemData[] {
  const ruleModule = extractModule<VehiclesCatalogData>(ruleset, "vehicles");
  if (!ruleModule) return [];

  // Combine all vehicle types
  return [
    ...(ruleModule.groundcraft || []),
    ...(ruleModule.watercraft || []),
    ...(ruleModule.aircraft || []),
  ];
}

/**
 * Load vehicles by category from a ruleset
 */
export function extractVehiclesByCategory(ruleset: LoadedRuleset): {
  groundcraft: VehicleCatalogItemData[];
  watercraft: VehicleCatalogItemData[];
  aircraft: VehicleCatalogItemData[];
} {
  const ruleModule = extractModule<VehiclesCatalogData>(ruleset, "vehicles");
  return {
    groundcraft: ruleModule?.groundcraft || [],
    watercraft: ruleModule?.watercraft || [],
    aircraft: ruleModule?.aircraft || [],
  };
}

/**
 * Load vehicle categories metadata from a ruleset
 */
export function extractVehicleCategories(ruleset: LoadedRuleset): VehicleCategoryData[] {
  const ruleModule = extractModule<VehiclesCatalogData>(ruleset, "vehicles");
  return ruleModule?.categories || [];
}

/**
 * Load drones from a ruleset
 */
export function extractDrones(ruleset: LoadedRuleset): DroneCatalogItemData[] {
  const ruleModule = extractModule<VehiclesCatalogData>(ruleset, "vehicles");
  return ruleModule?.drones || [];
}

/**
 * Load drone size categories from a ruleset
 */
export function extractDroneSizes(ruleset: LoadedRuleset): DroneSizeData[] {
  const ruleModule = extractModule<VehiclesCatalogData>(ruleset, "vehicles");
  return ruleModule?.droneSizes || [];
}

/**
 * Load RCCs (Rigger Command Consoles) from a ruleset
 */
export function extractRCCs(ruleset: LoadedRuleset): RCCCatalogItemData[] {
  const ruleModule = extractModule<VehiclesCatalogData>(ruleset, "vehicles");
  return ruleModule?.rccs || [];
}

/**
 * Load autosofts from a ruleset
 */
export function extractAutosofts(ruleset: LoadedRuleset): AutosoftCatalogItemData[] {
  const ruleModule = extractModule<VehiclesCatalogData>(ruleset, "vehicles");
  return ruleModule?.autosofts || [];
}

/**
 * Load complete vehicles module data from a ruleset
 */
export function extractVehiclesCatalog(ruleset: LoadedRuleset): VehiclesCatalogData | null {
  return extractModule<VehiclesCatalogData>(ruleset, "vehicles");
}

// =============================================================================
// PROGRAM DATA EXTRACTORS
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

/**
 * Load all programs from a ruleset
 */
export function extractPrograms(ruleset: LoadedRuleset): ProgramCatalogItemData[] {
  const ruleModule = extractModule<ProgramsCatalogData>(ruleset, "programs");
  if (!ruleModule) return [];

  return [
    ...(ruleModule.common || []),
    ...(ruleModule.hacking || []),
    ...(ruleModule.agents || []),
  ];
}

/**
 * Load programs by category
 */
export function extractProgramsByCategory(ruleset: LoadedRuleset): {
  common: ProgramCatalogItemData[];
  hacking: ProgramCatalogItemData[];
  agents: ProgramCatalogItemData[];
} {
  const ruleModule = extractModule<ProgramsCatalogData>(ruleset, "programs");
  return {
    common: ruleModule?.common || [],
    hacking: ruleModule?.hacking || [],
    agents: ruleModule?.agents || [],
  };
}

/**
 * Load common programs from a ruleset
 */
export function extractCommonPrograms(ruleset: LoadedRuleset): ProgramCatalogItemData[] {
  const ruleModule = extractModule<ProgramsCatalogData>(ruleset, "programs");
  return ruleModule?.common || [];
}

/**
 * Load hacking programs from a ruleset
 */
export function extractHackingPrograms(ruleset: LoadedRuleset): ProgramCatalogItemData[] {
  const ruleModule = extractModule<ProgramsCatalogData>(ruleset, "programs");
  return ruleModule?.hacking || [];
}

/**
 * Load agent programs from a ruleset
 */
export function extractAgentPrograms(ruleset: LoadedRuleset): ProgramCatalogItemData[] {
  const ruleModule = extractModule<ProgramsCatalogData>(ruleset, "programs");
  return ruleModule?.agents || [];
}

/**
 * Load complete programs module data from a ruleset
 */
export function extractProgramsCatalog(ruleset: LoadedRuleset): ProgramsCatalogData | null {
  return extractModule<ProgramsCatalogData>(ruleset, "programs");
}

// =============================================================================
// FOCI DATA TYPES AND LOADERS
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

/**
 * Load foci from a ruleset
 */
export function extractFoci(ruleset: LoadedRuleset): FocusCatalogItemData[] {
  const ruleModule = extractModule<{ foci: FocusCatalogItemData[] }>(ruleset, "foci");
  return ruleModule?.foci || [];
}

// =============================================================================
// SPIRIT DATA TYPES AND LOADERS
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

/**
 * Load spirits from a ruleset
 */
export function extractSpirits(ruleset: LoadedRuleset): SpiritsCatalogData | null {
  const ruleModule = extractModule<SpiritsCatalogData>(ruleset, "spirits");
  return ruleModule || null;
}

// =============================================================================
// GEAR MODIFICATION DATA TYPES AND LOADERS
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

/**
 * Load weapon modifications from a ruleset
 */
export function extractWeaponModifications(ruleset: LoadedRuleset): WeaponModificationCatalogItemData[] {
  const ruleModule = extractModule<ModificationsCatalogData>(ruleset, "modifications");
  return ruleModule?.weaponMods || [];
}

/**
 * Load armor modifications from a ruleset
 */
export function extractArmorModifications(ruleset: LoadedRuleset): ArmorModificationCatalogItemData[] {
  const ruleModule = extractModule<ModificationsCatalogData>(ruleset, "modifications");
  return ruleModule?.armorMods || [];
}

/**
 * Load cyberware modifications from a ruleset
 */
export function extractCyberwareModifications(ruleset: LoadedRuleset): CyberwareModificationCatalogItemData[] {
  const ruleModule = extractModule<ModificationsCatalogData>(ruleset, "modifications");
  return ruleModule?.cyberwareMods || [];
}

/**
 * Load gear modifications from a ruleset
 */
export function extractGearModifications(ruleset: LoadedRuleset): GearModificationCatalogItemData[] {
  const ruleModule = extractModule<ModificationsCatalogData>(ruleset, "modifications");
  return ruleModule?.gearMods || [];
}

/**
 * Load complete modifications catalog from a ruleset
 */
export function extractModifications(ruleset: LoadedRuleset): ModificationsCatalogData | null {
  return extractModule<ModificationsCatalogData>(ruleset, "modifications");
}
