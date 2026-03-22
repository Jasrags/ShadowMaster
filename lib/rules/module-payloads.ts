/**
 * Rule Module Payload Types
 *
 * Defines the canonical type mapping from RuleModuleType keys to their
 * specific payload interfaces. This is the single source of truth for:
 * - MergedRuleset.modules (typed access to module data)
 * - getModule() / extractModule() (type-safe return types)
 * - Test factories (properly typed mock data)
 *
 * Composite payload interfaces consolidate the multiple partial shapes
 * used by different extractModule/getModule calls for the same module key.
 */

import type { ContactTemplateData, LifeModulesCatalog } from "../types";
import type { AdvancementRulesData } from "../types/campaign";
import type { InfectedCatalogData } from "./infected/types";
import type {
  MetatypeData,
  SkillData,
  SkillGroupData,
  KnowledgeCategoryData,
  SkillCreationLimitsData,
  ExampleKnowledgeSkillData,
  ExampleLanguageData,
  QualityData,
  MagicPathData,
  SpellsCatalogData,
  ComplexFormData,
  SpriteTypeData,
  SpritePowerData,
  TraditionData,
  MentorSpiritData,
  RitualData,
  RitualKeywordData,
  LifestyleData,
  LifestyleSubscriptionCatalogItem,
  GearCatalogData,
  ModificationsCatalogData,
  CyberwareCatalogData,
  BiowareCatalogData,
  VehiclesCatalogData,
  ProgramsCatalogData,
  DataSoftwareCatalogItemData,
  PriorityTableData,
  ActionsCatalogData,
  AdeptPowerCatalogItem,
  FocusCatalogItemData,
  SpiritsCatalogData,
} from "./loader-types";

// =============================================================================
// COMPOSITE MODULE PAYLOAD TYPES
// =============================================================================

// These interfaces define the complete payload shape for modules that are
// accessed via multiple partial types in extractModule/getModule calls.

/**
 * Magic module payload — the most complex module, containing spells,
 * complex forms, traditions, mentor spirits, rituals, and sprite data.
 *
 * Accessed by: extractMagicPaths, extractSpells, extractComplexForms,
 * extractSpriteTypes, extractSpritePowers, extractTraditions,
 * extractMentorSpirits, extractRituals, extractRitualKeywords
 */
export interface MagicModulePayload {
  paths?: MagicPathData[];
  spells?: SpellsCatalogData;
  complexForms?: ComplexFormData[];
  spriteTypes?: SpriteTypeData[];
  spritePowers?: SpritePowerData[];
  traditions?: TraditionData[];
  mentorSpirits?: MentorSpiritData[];
  rituals?: RitualData[];
  ritualKeywords?: RitualKeywordData[];
}

/**
 * Lifestyle module payload — contains lifestyle types, metatype cost
 * modifiers, subscriptions, and modifications.
 *
 * Accessed by: extractLifestyles, extractLifestyleModifiers,
 * extractLifestyleSubscriptions
 */
export interface LifestyleModulePayload {
  lifestyles?: LifestyleData[];
  metatypeModifiers?: Record<string, number>;
  subscriptions?: LifestyleSubscriptionCatalogItem[];
  modifications?: LifestyleModificationCatalogItem[];
}

/**
 * Lifestyle modification catalog item (used in lifestyle module payload).
 * Separate from the character-level LifestyleModification type.
 */
export interface LifestyleModificationCatalogItem {
  id: string;
  name: string;
  type: "positive" | "negative";
  modifier: number;
  modifierType: "percentage" | "flat";
  description?: string;
  effects?: string;
  page?: number;
  source?: string;
}

/**
 * Skills module payload — active skills, skill groups, knowledge categories,
 * and creation limits.
 *
 * Accessed by: extractSkills
 */
export interface SkillsModulePayload {
  activeSkills?: SkillData[];
  skillGroups?: SkillGroupData[];
  knowledgeCategories?: KnowledgeCategoryData[];
  creationLimits?: SkillCreationLimitsData;
  exampleKnowledgeSkills?: ExampleKnowledgeSkillData[];
  exampleLanguages?: ExampleLanguageData[];
}

/**
 * Programs module payload — matrix programs and data software.
 * Data software (datasofts, mapsofts, etc.) is stored alongside
 * regular programs in the same module.
 *
 * Accessed by: extractPrograms, extractDataSoftwareCatalog
 */
export interface ProgramsModulePayload extends ProgramsCatalogData {
  datasofts?: DataSoftwareCatalogItemData[];
  mapsofts?: DataSoftwareCatalogItemData[];
  shopsofts?: DataSoftwareCatalogItemData[];
  tutorsofts?: DataSoftwareCatalogItemData[];
}

// =============================================================================
// RULE MODULE PAYLOAD MAP
// =============================================================================

/**
 * Maps each RuleModuleType key to its specific payload interface.
 *
 * This is the canonical type mapping used by:
 * - MergedRuleset.modules (typed access to module data)
 * - getModule() / extractModule() (type-safe return types)
 * - Test factories (properly typed mock data)
 *
 * Modules with no typed usage yet use Record<string, unknown> as a
 * placeholder — these will be replaced as modules are implemented.
 */
export interface RuleModulePayloadMap {
  // --- Typed modules (have extractModule/getModule usage) ---
  metatypes: { metatypes: MetatypeData[] };
  skills: SkillsModulePayload;
  qualities: { positive: QualityData[]; negative: QualityData[] };
  magic: MagicModulePayload;
  gear: GearCatalogData;
  modifications: ModificationsCatalogData;
  cyberware: CyberwareCatalogData;
  bioware: BiowareCatalogData;
  vehicles: VehiclesCatalogData;
  programs: ProgramsModulePayload;
  lifestyle: LifestyleModulePayload;
  contactTemplates: { templates: ContactTemplateData[] };
  adeptPowers: { powers: AdeptPowerCatalogItem[] };
  foci: { foci: FocusCatalogItemData[] };
  spirits: SpiritsCatalogData;
  priorities: PriorityTableData;
  advancement: AdvancementRulesData;
  actions: ActionsCatalogData;
  infected: InfectedCatalogData;
  lifeModules: LifeModulesCatalog;

  // --- Placeholder modules (no typed usage yet) ---
  attributes: Record<string, unknown>;
  resonance: Record<string, unknown>;
  combat: Record<string, unknown>;
  matrix: Record<string, unknown>;
  contacts: Record<string, unknown>;
  contactArchetypes: Record<string, unknown>;
  favorServices: Record<string, unknown>;
  creationMethods: Record<string, unknown>;
  limits: Record<string, unknown>;
  diceRules: Record<string, unknown>;
  socialModifiers: Record<string, unknown>;
  categoryModificationDefaults: Record<string, unknown>;
  gameplayLevels: Record<string, unknown>;
  equipmentPacks: Record<string, unknown>;
  metagenics: Record<string, unknown>;
  shapeshifters: Record<string, unknown>;
  johnsonProfiles: Record<string, unknown>;
}
