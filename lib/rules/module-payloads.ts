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
  EntertainmentOptionCatalogItem,
  NeighborhoodZoneData,
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
 * modifiers, subscriptions, modifications, entertainment options, and
 * neighborhood zone classifications.
 *
 * Accessed by: extractLifestyles, extractLifestyleModifiers,
 * extractLifestyleSubscriptions, extractLifestyleModifications,
 * extractEntertainmentOptions, extractNeighborhoodZones
 */
export interface LifestyleModulePayload {
  lifestyles?: LifestyleData[];
  metatypeModifiers?: Record<string, number>;
  subscriptions?: LifestyleSubscriptionCatalogItem[];
  modifications?: LifestyleModificationCatalogItem[];
  entertainmentOptions?: EntertainmentOptionCatalogItem[];
  neighborhoodZones?: NeighborhoodZoneData[];
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
  /** Points granted by taking this negative option */
  pointsGranted?: number;
  /** Points consumed by taking this positive option */
  pointsCost?: number;
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
// EQUIPMENT PACKS MODULE PAYLOAD
// =============================================================================

/**
 * Category of an equipment pack
 */
export type EquipmentPackCategory =
  | "core"
  | "weapon"
  | "armor"
  | "cyber"
  | "lifestyle"
  | "color"
  | "vehicle"
  | "decker"
  | "drone"
  | "magic";

/**
 * A single item within an equipment pack, referencing a catalog entry
 */
export interface EquipmentPackItem {
  /** Reference to the catalog item ID (gear, weapon, armor, cyberware, etc.) */
  itemId: string;
  /** Display name for the item */
  itemName: string;
  /** Number of this item in the pack */
  quantity: number;
  /** Rating for items that have ratings */
  rating?: number;
  /** Modification IDs to install on this item */
  modifications?: string[];
}

/**
 * A pre-built equipment pack from the Run Faster sourcebook (pp. 228-251).
 * Packs have fixed nuyen costs divisible by 2,000 and can be purchased
 * with Karma at a 1:2,000 ratio.
 */
export interface EquipmentPackCatalogItem {
  id: string;
  name: string;
  category: EquipmentPackCategory;
  /** Total nuyen cost (always divisible by 2,000) */
  nuyenCost: number;
  /** Karma equivalent (always nuyenCost / 2000) */
  karmaCost: number;
  /** Highest availability rating among pack contents */
  maxAvailability: number;
  /** Legality of the most restricted item in the pack */
  availabilityType?: "R" | "F";
  /** Total essence cost for cyber/bioware packs */
  essenceCost?: number;
  /** Prerequisites (e.g., "Requires a Skilljack") */
  prerequisites?: string[];
  /** Items included in this pack */
  contents: EquipmentPackItem[];
  /** IDs of sub-packs included in composite packs */
  includedPacks?: string[];
  /** Source book identifier */
  source: string;
  /** Page number in source book */
  page: number;
}

/**
 * Equipment packs module payload.
 *
 * Accessed by: extractEquipmentPacks
 */
export interface EquipmentPacksModulePayload {
  packs: EquipmentPackCatalogItem[];
}

// =============================================================================
// JOHNSON PROFILES MODULE PAYLOAD
// =============================================================================

/**
 * Faction category for Mr. Johnson employers (Run Faster pp. 196-211)
 */
export type JohnsonFactionCategory = "megacorporate" | "syndicate" | "extremist" | "amateur";

/**
 * Severity of a Johnson betrayal scenario
 */
export type BetrayalSeverity = "moderate" | "severe" | "lethal";

/**
 * A Johnson faction profile describing a typical employer organization
 */
export interface JohnsonFactionData {
  id: string;
  name: string;
  category: JohnsonFactionCategory;
  description: string;
  typicalJobs?: string[];
  /** Betrayal risk level for this faction (Run Faster pp. 202-211) */
  betrayalRisk?: import("../types/contacts").BetrayalRiskLevel;
  /** GM-facing notes about betrayal tendencies */
  betrayalNotes?: string;
  source: string;
  page: number;
}

/**
 * An action that triggers notoriety gain during runs
 */
export interface NotorietyTriggerData {
  id: string;
  name: string;
  description: string;
  notorietyChange: number;
  phase?: string;
  source: string;
  page: number;
}

/**
 * A phase in the run lifecycle (Meet, Run, Handoff)
 */
export interface RunPhaseData {
  id: string;
  name: string;
  description: string;
  keyConsiderations?: string[];
  source: string;
  page: number;
}

/**
 * A type of Johnson betrayal scenario
 */
export interface BetrayalTypeData {
  id: string;
  name: string;
  description: string;
  severity: BetrayalSeverity;
  warningSignals?: string[];
  source: string;
  page: number;
}

/**
 * Johnson profiles module payload — Mr. Johnson faction profiles,
 * notoriety triggers, run lifecycle phases, and betrayal types.
 *
 * Accessed by: extractJohnsonProfiles, extractJohnsonFactions,
 * extractNotorietyTriggers, extractRunPhases, extractBetrayalTypes
 */
export interface JohnsonProfilesModulePayload {
  factions: JohnsonFactionData[];
  notorietyTriggers: NotorietyTriggerData[];
  runPhases: RunPhaseData[];
  betrayalTypes: BetrayalTypeData[];
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
  equipmentPacks: EquipmentPacksModulePayload;
  metagenics: Record<string, unknown>;
  shapeshifters: Record<string, unknown>;
  johnsonProfiles: JohnsonProfilesModulePayload;
}
