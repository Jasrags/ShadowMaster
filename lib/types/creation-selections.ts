/**
 * Typed interfaces for character creation selections.
 *
 * Phase 4.3: Provides type-safe access to CreationState.selections,
 * replacing the generic Record<string, unknown> with specific interfaces.
 */

import type {
  AdeptPower,
  ArmorItem,
  BiowareItem,
  CharacterAutosoft,
  CharacterCommlink,
  CharacterCyberdeck,
  CharacterDrone,
  CharacterRCC,
  Contact,
  CyberwareItem,
  GearItem,
  Identity,
  KnowledgeSkill,
  LanguageSkill,
  Lifestyle,
  Weapon,
} from "./index";

// =============================================================================
// ATTRIBUTE IDS
// =============================================================================

/**
 * Core (physical/mental) attribute identifiers
 */
export type CoreAttributeId =
  | "body"
  | "agility"
  | "reaction"
  | "strength"
  | "willpower"
  | "logic"
  | "intuition"
  | "charisma";

/**
 * Special attribute identifiers
 */
export type SpecialAttributeId = "edge" | "magic" | "resonance";

// =============================================================================
// SELECTION INTERFACES
// =============================================================================

/**
 * Character info selections
 */
export interface CharacterInfoSelections {
  characterName?: string;
  description?: string;
  background?: string;
  gender?: string;
}

/**
 * Metatype selection
 */
export interface MetatypeSelections {
  metatype?: string;
}

/**
 * Known magical path values used in the UI (differs slightly from MagicalPath type)
 */
export type MagicalPathValue =
  | "mundane"
  | "magician"
  | "aspected-mage"
  | "mystic-adept"
  | "adept"
  | "technomancer";

/**
 * Magical path selection and related quality data
 */
export interface MagicalPathSelections {
  "magical-path"?: MagicalPathValue | string; // Allow string for flexibility
  /** Specifications for qualities that require additional info (e.g., tradition name) */
  qualitySpecifications?: Record<string, string>;
  /** Levels for qualities that have multiple levels */
  qualityLevels?: Record<string, number>;
}

/**
 * Attribute point allocations
 */
export interface AttributeSelections {
  /** Core attribute values (body, agility, etc.) - partial as not all may be set */
  attributes?: Partial<Record<CoreAttributeId, number>>;
  /** Special attribute allocated points (edge, magic, resonance) - partial as not all may be set */
  specialAttributes?: Partial<Record<SpecialAttributeId, number>>;
  /** Total core attribute points spent (derived by context, stored for efficiency) */
  coreAttributePointsSpent?: number;
}

/**
 * Skill group value - supports both legacy (number) and new (object) formats
 * Legacy format: number (rating)
 * New format: { rating: number; isBroken: boolean }
 */
export type SkillGroupValue = number | { rating: number; isBroken: boolean };

/**
 * Skill allocations
 */
export interface SkillSelections {
  /** Individual skill ratings */
  skills?: Record<string, number>;
  /** Skill group ratings - supports both number and { rating, isBroken } formats */
  skillGroups?: Record<string, SkillGroupValue>;
  /** Skill specializations (skill ID -> array of specialization names) */
  skillSpecializations?: Record<string, string[]>;
  /** Track karma spent on skills during creation (for group breaking, etc.) */
  skillKarmaSpent?: {
    /** Karma spent raising individual skills beyond group rating */
    skillRaises: Record<string, number>;
    /** Total karma spent on specializations (7 karma each) */
    specializations: number;
  };
}

/**
 * Quality selection with optional specification and level
 */
export interface SelectedQuality {
  id: string;
  /** Optional specification for qualities that need additional info */
  specification?: string;
  /** Level for qualities with multiple levels */
  level?: number;
  /** Karma cost/value for this selection (Phase 4.2: used by CreationBudgetContext) */
  karma?: number;
  /** Original karma before any modifications */
  originalKarma?: number;
}

/**
 * Quality selection value - can be just ID or full object
 * Some components use string[], others use SelectedQuality[]
 */
export type QualitySelectionValue = string | SelectedQuality;

/**
 * Quality selections
 * NOTE: Components may store either string[] (just IDs) or SelectedQuality[] (full objects)
 */
export interface QualitySelections {
  positiveQualities?: QualitySelectionValue[];
  negativeQualities?: QualitySelectionValue[];
}

/**
 * Knowledge and language skill selections
 */
export interface KnowledgeLanguageSelections {
  languages?: LanguageSkill[];
  knowledgeSkills?: KnowledgeSkill[];
}

/**
 * Spell selection object with optional attribute selection for parameterized spells.
 */
export interface SpellSelectionObject {
  /** Catalog spell ID */
  id: string;
  /**
   * Selected attribute for parameterized spells (e.g., Increase/Decrease [Attribute]).
   * Uses attribute codes: body, agility, reaction, strength, willpower, logic, intuition, charisma
   */
  selectedAttribute?: string;
}

/**
 * Spell selection (can be just ID string or full object with attribute selection)
 */
export type SpellSelection = string | SpellSelectionObject;

/**
 * Focus selection during creation
 * Base interface that components extend with additional properties
 */
export interface CreationFocusBase {
  catalogId: string;
  name: string;
  type: string;
  force: number;
  cost: number;
  availability: number;
  bonded?: boolean;
  linkedSpellId?: string;
  linkedSpiritType?: string;
}

/**
 * Magic-related selections (spells, powers, complex forms, foci)
 * Foci uses unknown[] since different components store different structures
 */
export interface MagicSelections {
  spells?: SpellSelection[];
  adeptPowers?: AdeptPower[];
  complexForms?: string[];
  /** Foci array - structure varies by component (extends CreationFocusBase) */
  foci?: unknown[];
}

/**
 * Contact selections
 */
export interface ContactSelections {
  contacts?: Contact[];
}

/**
 * Identity and lifestyle selections
 */
export interface IdentitySelections {
  identities?: Identity[];
  lifestyles?: Lifestyle[];
}

/**
 * Gear, weapons, and armor selections
 */
export interface GearSelections {
  gear?: GearItem[];
  weapons?: Weapon[];
  armor?: ArmorItem[];
  commlinks?: CharacterCommlink[];
  cyberdecks?: CharacterCyberdeck[];
}

/**
 * Augmentation (cyberware/bioware) selections
 */
export interface AugmentationSelections {
  cyberware?: CyberwareItem[];
  bioware?: BiowareItem[];
}

/**
 * Vehicle selection during creation - base interface
 */
export interface CreationVehicleBase {
  catalogId: string;
  name: string;
  category: string;
  cost: number;
  availability: number;
  legality?: string;
}

/**
 * Vehicle and drone selections
 * Uses unknown[] for vehicles since different components store different structures
 */
export interface VehicleSelections {
  /** Vehicles array - structure varies by component (extends CreationVehicleBase) */
  vehicles?: unknown[];
  drones?: CharacterDrone[];
  rccs?: CharacterRCC[];
  autosofts?: CharacterAutosoft[];
}

// =============================================================================
// COMBINED CREATION SELECTIONS
// =============================================================================

/**
 * Complete typed interface for CreationState.selections
 *
 * This interface combines all selection categories into a single type.
 * Components should use the appropriate selection interface or type guards
 * when accessing specific sections.
 */
export interface CreationSelections
  extends
    CharacterInfoSelections,
    MetatypeSelections,
    MagicalPathSelections,
    AttributeSelections,
    SkillSelections,
    QualitySelections,
    KnowledgeLanguageSelections,
    MagicSelections,
    ContactSelections,
    IdentitySelections,
    GearSelections,
    AugmentationSelections,
    VehicleSelections {
  /** Allow additional properties for extensibility */
  [key: string]: unknown;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Type guard to check if selections has character info
 */
export function hasCharacterInfo(
  selections: CreationSelections
): selections is CreationSelections & Required<CharacterInfoSelections> {
  return typeof selections.characterName === "string";
}

/**
 * Type guard to check if a metatype is selected
 */
export function hasMetatypeSelection(
  selections: CreationSelections
): selections is CreationSelections & Required<MetatypeSelections> {
  return typeof selections.metatype === "string" && selections.metatype.length > 0;
}

/**
 * Type guard to check if attributes are allocated
 */
export function hasAttributeSelections(
  selections: CreationSelections
): selections is CreationSelections & Required<Pick<AttributeSelections, "attributes">> {
  return selections.attributes !== undefined && Object.keys(selections.attributes).length > 0;
}

/**
 * Type guard to check if skills are allocated
 */
export function hasSkillSelections(
  selections: CreationSelections
): selections is CreationSelections & Required<Pick<SkillSelections, "skills">> {
  return selections.skills !== undefined && Object.keys(selections.skills).length > 0;
}

/**
 * Type guard to check if any qualities are selected
 */
export function hasQualitySelections(selections: CreationSelections): boolean {
  const hasPositive =
    Array.isArray(selections.positiveQualities) && selections.positiveQualities.length > 0;
  const hasNegative =
    Array.isArray(selections.negativeQualities) && selections.negativeQualities.length > 0;
  return hasPositive || hasNegative;
}

/**
 * Type guard to check if a magical path is selected (non-mundane)
 */
export function hasMagicalPath(
  selections: CreationSelections
): selections is CreationSelections & { "magical-path": Exclude<MagicalPathValue, "mundane"> } {
  const path = selections["magical-path"];
  return typeof path === "string" && path !== "mundane";
}

/**
 * Type guard to check if character is a spellcaster (magician, mystic adept)
 */
export function isSpellcaster(selections: CreationSelections): boolean {
  const path = selections["magical-path"];
  return path === "magician" || path === "mystic-adept";
}

/**
 * Type guard to check if character is an adept (adept or mystic adept)
 */
export function isAdept(selections: CreationSelections): boolean {
  const path = selections["magical-path"];
  return path === "adept" || path === "mystic-adept";
}

/**
 * Type guard to check if character is a technomancer
 */
export function isTechnomancer(selections: CreationSelections): boolean {
  return selections["magical-path"] === "technomancer";
}

/**
 * Type guard to check if character has any gear selections
 */
export function hasGearSelections(selections: CreationSelections): boolean {
  const hasGear = Array.isArray(selections.gear) && selections.gear.length > 0;
  const hasWeapons = Array.isArray(selections.weapons) && selections.weapons.length > 0;
  const hasArmor = Array.isArray(selections.armor) && selections.armor.length > 0;
  return hasGear || hasWeapons || hasArmor;
}

/**
 * Type guard to check if character has augmentations
 */
export function hasAugmentationSelections(selections: CreationSelections): boolean {
  const hasCyberware = Array.isArray(selections.cyberware) && selections.cyberware.length > 0;
  const hasBioware = Array.isArray(selections.bioware) && selections.bioware.length > 0;
  return hasCyberware || hasBioware;
}

/**
 * Type guard to check if character has vehicle selections
 */
export function hasVehicleSelections(selections: CreationSelections): boolean {
  const hasVehicles = Array.isArray(selections.vehicles) && selections.vehicles.length > 0;
  const hasDrones = Array.isArray(selections.drones) && selections.drones.length > 0;
  return hasVehicles || hasDrones;
}

// =============================================================================
// ACCESSOR HELPERS
// =============================================================================

/**
 * Safely get core attributes with defaults
 */
export function getAttributes(
  selections: CreationSelections
): Partial<Record<CoreAttributeId, number>> {
  return selections.attributes || {};
}

/**
 * Safely get special attributes with defaults
 */
export function getSpecialAttributes(
  selections: CreationSelections
): Partial<Record<SpecialAttributeId, number>> {
  return selections.specialAttributes || {};
}

/**
 * Safely get skills with defaults
 */
export function getSkills(selections: CreationSelections): Record<string, number> {
  return (selections.skills || {}) as Record<string, number>;
}

/**
 * Safely get skill groups with defaults
 * Returns the raw skill group values (may be numbers or objects with isBroken)
 */
export function getSkillGroups(selections: CreationSelections): Record<string, SkillGroupValue> {
  return (selections.skillGroups || {}) as Record<string, SkillGroupValue>;
}

/**
 * Safely get positive qualities (as stored - may be string[] or SelectedQuality[])
 */
export function getPositiveQualities(selections: CreationSelections): QualitySelectionValue[] {
  return selections.positiveQualities || [];
}

/**
 * Safely get negative qualities (as stored - may be string[] or SelectedQuality[])
 */
export function getNegativeQualities(selections: CreationSelections): QualitySelectionValue[] {
  return selections.negativeQualities || [];
}

/**
 * Extract quality ID from a selection value
 */
export function getQualityId(selection: QualitySelectionValue): string {
  return typeof selection === "string" ? selection : selection.id;
}

/**
 * Get all positive quality IDs
 */
export function getPositiveQualityIds(selections: CreationSelections): string[] {
  return getPositiveQualities(selections).map(getQualityId);
}

/**
 * Get all negative quality IDs
 */
export function getNegativeQualityIds(selections: CreationSelections): string[] {
  return getNegativeQualities(selections).map(getQualityId);
}

/**
 * Safely get spells
 */
export function getSpells(selections: CreationSelections): SpellSelection[] {
  return (selections.spells || []) as SpellSelection[];
}

/**
 * Type guard to check if a spell selection is an object (not just ID string)
 */
export function isSpellSelectionObject(
  selection: SpellSelection
): selection is SpellSelectionObject {
  return typeof selection === "object" && selection !== null && "id" in selection;
}

/**
 * Extract spell ID from a selection value
 */
export function getSpellId(selection: SpellSelection): string {
  return typeof selection === "string" ? selection : selection.id;
}

/**
 * Get all spell IDs from selections
 */
export function getSpellIds(selections: CreationSelections): string[] {
  return getSpells(selections).map(getSpellId);
}

/**
 * Get selected attribute for a spell (if parameterized)
 */
export function getSpellSelectedAttribute(selection: SpellSelection): string | undefined {
  if (isSpellSelectionObject(selection)) {
    return selection.selectedAttribute;
  }
  return undefined;
}

/**
 * Normalize a spell selection to object form.
 * Converts legacy string format to SpellSelectionObject.
 * Useful for migration or when object form is required.
 */
export function normalizeSpellSelection(selection: SpellSelection): SpellSelectionObject {
  if (typeof selection === "string") {
    return { id: selection };
  }
  return selection;
}

/**
 * Normalize all spell selections to object form.
 * Converts any legacy string selections to SpellSelectionObject.
 */
export function normalizeSpellSelections(selections: SpellSelection[]): SpellSelectionObject[] {
  return selections.map(normalizeSpellSelection);
}

/**
 * Safely get adept powers
 */
export function getAdeptPowers(selections: CreationSelections): AdeptPower[] {
  return (selections.adeptPowers || []) as AdeptPower[];
}

/**
 * Safely get cyberware
 */
export function getCyberware(selections: CreationSelections): CyberwareItem[] {
  return (selections.cyberware || []) as CyberwareItem[];
}

/**
 * Safely get bioware
 */
export function getBioware(selections: CreationSelections): BiowareItem[] {
  return (selections.bioware || []) as BiowareItem[];
}

/**
 * Safely get gear
 */
export function getGear(selections: CreationSelections): GearItem[] {
  return (selections.gear || []) as GearItem[];
}

/**
 * Safely get weapons
 */
export function getWeapons(selections: CreationSelections): Weapon[] {
  return (selections.weapons || []) as Weapon[];
}

/**
 * Safely get armor
 */
export function getArmor(selections: CreationSelections): ArmorItem[] {
  return (selections.armor || []) as ArmorItem[];
}

/**
 * Safely get vehicles (returns unknown[] - cast in component as needed)
 */
export function getVehicles(selections: CreationSelections): unknown[] {
  return selections.vehicles || [];
}

/**
 * Safely get foci (returns unknown[] - cast in component as needed)
 */
export function getFoci(selections: CreationSelections): unknown[] {
  return selections.foci || [];
}

/**
 * Safely get contacts
 */
export function getContacts(selections: CreationSelections): Contact[] {
  return (selections.contacts || []) as Contact[];
}
