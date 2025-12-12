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
  Book,
  BookPayload,
  RuleModuleType,
  CreationMethod,
  MergedRuleset,
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
  hasRating?: boolean;
  maxRating?: number;
  essencePerRating?: boolean;
  costPerRating?: boolean;
  capacity?: number;
  capacityCost?: number;
  capacityPerRating?: boolean;
  attributeBonuses?: Record<string, number>;
  attributeBonusesPerRating?: Record<string, number>;
  maxAttributeBonus?: number;
  initiativeDiceBonus?: number;
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
  hasRating?: boolean;
  maxRating?: number;
  essencePerRating?: boolean;
  costPerRating?: boolean;
  attributeBonuses?: Record<string, number>;
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
