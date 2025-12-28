/**
 * Ruleset Loader
 *
 * Loads edition definitions and book payloads, preparing them
 * for the merge engine to produce a final MergedRuleset.
 *
 * NOTE: Type definitions have been moved to ./loader-types.ts to avoid
 * pulling server-only storage code into client bundles.
 * Client components MUST import types from ./loader-types.ts directly.
 * This module (loader.ts) should only be imported in API routes and server components.
 *
 * IMPORTANT: This file does NOT re-export types to prevent Turbopack from
 * analyzing this file when types are imported. All type imports must go through
 * ./loader-types.ts directly.
 */

import type {
  ID,
  Edition,
  EditionCode,
  BookPayload,
  RuleModuleType,
  CreationMethod,
} from "../types";
import type { LoadedRuleset, LoadedBook, LoadResult, RulesetLoadConfig } from "./loader-types";
import {
  getEdition,
  getAllEditions,
  getBookPayload,
  getAllBookPayloads,
  getCreationMethod,
  getAllCreationMethods,
} from "../storage/editions";

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

import type { MetatypeData } from "./loader-types";

/**
 * Load metatypes from a ruleset
 */
export function extractMetatypes(ruleset: LoadedRuleset): MetatypeData[] {
  const ruleModule = extractModule<{ metatypes: MetatypeData[] }>(ruleset, "metatypes");
  return ruleModule?.metatypes || [];
}

import type {
  SkillData,
  SkillGroupData,
  KnowledgeCategoryData,
  SkillCreationLimitsData,
  ExampleKnowledgeSkillData,
  ExampleLanguageData,
} from "./loader-types";

/**
 * Load skills from a ruleset
 */
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

import type { QualityData } from "./loader-types";

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

import type { PriorityTableData } from "./loader-types";

/**
 * Load priority table from a ruleset
 */
export function extractPriorityTable(ruleset: LoadedRuleset): PriorityTableData | null {
  return extractModule<PriorityTableData>(ruleset, "priorities");
}

import type { MagicPathData } from "./loader-types";

/**
 * Load magic paths from a ruleset
 */
export function extractMagicPaths(ruleset: LoadedRuleset): MagicPathData[] {
  const ruleModule = extractModule<{ paths: MagicPathData[] }>(ruleset, "magic");
  return ruleModule?.paths || [];
}

import type {
  LifestyleData,
  LifestyleSubscriptionCatalogItem,
  LifestyleSubscriptionsCatalogData,
} from "./loader-types";

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

import type { GearCatalogData } from "./loader-types";

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

import type {
  ComplexFormData,
  SpriteTypeData,
  SpritePowerData,
  SpellsCatalogData,
} from "./loader-types";

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

import type {
  AugmentationRulesData,
  CyberwareCatalogData,
  BiowareCatalogData,
} from "./loader-types";

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

import type { AdeptPowerCatalogItem } from "./loader-types";

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

import type { TraditionData } from "./loader-types";

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

import type { MentorSpiritData } from "./loader-types";

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

import type { RitualData, RitualKeywordData } from "./loader-types";

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

import type {
  VehicleCategoryData,
  DroneSizeData,
  VehicleCatalogItemData,
  DroneCatalogItemData,
  RCCCatalogItemData,
  AutosoftCatalogItemData,
  VehiclesCatalogData,
} from "./loader-types";

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

import type { ProgramCatalogItemData, ProgramsCatalogData } from "./loader-types";

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

import type { FocusCatalogItemData } from "./loader-types";

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

import type { SpiritsCatalogData } from "./loader-types";

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

import type {
  WeaponModificationCatalogItemData,
  ArmorModificationCatalogItemData,
  CyberwareModificationCatalogItemData,
  GearModificationCatalogItemData,
  ModificationsCatalogData,
} from "./loader-types";

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

// =============================================================================
// ADVANCEMENT DATA EXTRACTORS
// =============================================================================

import type { AdvancementRulesData } from "./loader-types";

/**
 * Load advancement rules from a ruleset
 */
export function extractAdvancement(ruleset: LoadedRuleset): AdvancementRulesData {
  const ruleModule = extractModule<AdvancementRulesData>(ruleset, "advancement");

  return (
    ruleModule || {
      trainingTimeMultiplier: 1.0,
      attributeKarmaMultiplier: 5,
      skillKarmaMultiplier: 2,
      skillGroupKarmaMultiplier: 5,
      knowledgeSkillKarmaMultiplier: 1,
      specializationKarmaCost: 7,
      spellKarmaCost: 5,
      complexFormKarmaCost: 4,
      allowInstantAdvancement: false,
    }
  );
}

// =============================================================================
// ACTION DATA EXTRACTORS
// =============================================================================

import type { ActionDefinition } from "../types";

/**
 * Actions catalog organized by domain
 */
export interface ActionsCatalogData {
  combat: ActionDefinition[];
  general: ActionDefinition[];
  magic: ActionDefinition[];
  matrix: ActionDefinition[];
  social: ActionDefinition[];
  vehicle: ActionDefinition[];
}

/**
 * Extract actions from a ruleset
 */
export function extractActions(ruleset: LoadedRuleset): ActionsCatalogData | null {
  const ruleModule = extractModule<ActionsCatalogData>(ruleset, "actions");

  if (!ruleModule) return null;

  return {
    combat: ruleModule.combat || [],
    general: ruleModule.general || [],
    magic: ruleModule.magic || [],
    matrix: ruleModule.matrix || [],
    social: ruleModule.social || [],
    vehicle: ruleModule.vehicle || [],
  };
}

/**
 * Extract all actions as a flat array
 */
export function extractAllActions(ruleset: LoadedRuleset): ActionDefinition[] {
  const catalog = extractActions(ruleset);
  if (!catalog) return [];

  return [
    ...catalog.combat,
    ...catalog.general,
    ...catalog.magic,
    ...catalog.matrix,
    ...catalog.social,
    ...catalog.vehicle,
  ];
}
