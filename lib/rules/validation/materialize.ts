/**
 * Materialization of creation state selections to top-level character fields.
 *
 * During character creation, all data is stored in `metadata.creationState.selections`.
 * The auto-save only writes `creationState` and `name` to the character JSON,
 * leaving top-level fields (metatype, attributes, skills, etc.) at their defaults.
 *
 * This module provides `materializeFromCreationState()` which copies creation
 * selections to the character's top-level fields before validation and persistence.
 * This ensures:
 * 1. Validators that check top-level fields find the data they expect
 * 2. The finalized character stored to disk has proper top-level fields
 *    for post-creation use (advancement, combat, etc.)
 */

import type { Character, CharacterDraft } from "@/lib/types/character";
import type { CreationState } from "@/lib/types/creation";
import type { CreationSelections, QualitySelectionValue } from "@/lib/types/creation-selections";
import type { QualitySelection } from "@/lib/types/qualities";
import type { MagicalPath } from "@/lib/types/core";
import type { CharacterProgram } from "@/lib/types/programs";
import type { CharacterDataSoftware } from "@/lib/types/character";

// Map creation "magical-path" values to Character.magicalPath values
const MAGICAL_PATH_MAP: Record<string, MagicalPath> = {
  mundane: "mundane",
  magician: "full-mage",
  "aspected-mage": "aspected-mage",
  "mystic-adept": "mystic-adept",
  adept: "adept",
  technomancer: "technomancer",
  "full-mage": "full-mage",
  explorer: "explorer",
};

/**
 * Convert a creation QualitySelectionValue to the Character's QualitySelection format.
 */
function toCharacterQuality(value: QualitySelectionValue): QualitySelection {
  if (typeof value === "string") {
    return {
      qualityId: value,
      source: "creation",
    };
  }
  return {
    id: value.id,
    qualityId: value.id,
    specification: value.specification,
    rating: value.level,
    originalKarma: value.originalKarma ?? value.karma,
    source: "creation",
  };
}

/**
 * Convert creation software selections to CharacterProgram format.
 * Creation stores data software as CharacterDataSoftware[],
 * but the character model uses CharacterProgram[].
 */
function toCharacterPrograms(software: CharacterDataSoftware[]): CharacterProgram[] {
  return software.map((s) => ({
    id: s.id,
    catalogId: s.catalogId,
    name: s.displayName || s.name,
    category: "common" as const,
    rating: s.rating,
    cost: s.cost,
    availability: s.availability,
  }));
}

/**
 * Check if a value is empty/default and should be overwritten.
 * - Empty string → empty
 * - Empty object {} → empty
 * - Empty array [] → empty
 * - "mundane" (default magicalPath) → empty for overwrite purposes
 * - undefined/null → empty
 */
function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false;
}

/**
 * Materialize creation state selections onto a character's top-level fields.
 *
 * Returns a new character object with creation selections copied to top-level
 * fields. Only overwrites fields that are empty/default when selections has data.
 *
 * This must be called before validation during finalization so that validators
 * checking top-level character fields (e.g., `character.metatype`,
 * `character.attributes`) find the data entered during creation.
 */
export function materializeFromCreationState(
  character: Character | CharacterDraft,
  creationState: CreationState
): Character | CharacterDraft {
  const selections = creationState.selections as CreationSelections;
  if (!selections) return character;

  // Start with a shallow copy
  const result = { ...character };

  // --- Basic Info ---

  if (selections.metatype && isEmpty(result.metatype)) {
    result.metatype = selections.metatype;
  }

  if (selections.gender && !result.gender) {
    result.gender = selections.gender;
  }

  if (selections.description && !result.description) {
    result.description = selections.description;
  }

  if (selections.background && !result.background) {
    result.background = selections.background;
  }

  // --- Magical Path ---

  const magicalPathSelection = selections["magical-path"];
  if (magicalPathSelection && (!result.magicalPath || result.magicalPath === "mundane")) {
    const mapped = MAGICAL_PATH_MAP[magicalPathSelection];
    if (mapped) {
      result.magicalPath = mapped;
    }
  }

  if (selections.qualitySpecifications?.tradition && !result.tradition) {
    result.tradition = selections.qualitySpecifications.tradition;
  }

  // --- Attributes ---

  if (selections.attributes && isEmpty(result.attributes)) {
    // Creation selections use long-form keys (body, agility, etc.)
    // Character uses the same format
    result.attributes = { ...selections.attributes } as Record<string, number>;
  }

  if (selections.specialAttributes) {
    const currentSpecial = result.specialAttributes || { edge: 0, essence: 6 };
    const selSpecial = selections.specialAttributes;

    // Only overwrite if current values are at defaults (0 for edge/magic/resonance)
    const needsUpdate =
      currentSpecial.edge === 0 && !currentSpecial.magic && !currentSpecial.resonance;

    if (needsUpdate && Object.keys(selSpecial).length > 0) {
      result.specialAttributes = {
        edge: selSpecial.edge ?? currentSpecial.edge,
        essence: currentSpecial.essence, // Essence is calculated from augmentations, not set directly
        magic: selSpecial.magic ?? currentSpecial.magic,
        resonance: selSpecial.resonance ?? currentSpecial.resonance,
      };
    }
  }

  // --- Skills ---

  if (selections.skills && isEmpty(result.skills)) {
    result.skills = { ...selections.skills };
  }

  if (selections.skillSpecializations && isEmpty(result.skillSpecializations)) {
    result.skillSpecializations = { ...selections.skillSpecializations };
  }

  // --- Knowledge & Languages ---

  if (selections.knowledgeSkills && isEmpty(result.knowledgeSkills)) {
    result.knowledgeSkills = [...selections.knowledgeSkills];
  }

  if (selections.languages && isEmpty(result.languages)) {
    result.languages = [...selections.languages];
  }

  // --- Qualities ---

  if (selections.positiveQualities && isEmpty(result.positiveQualities)) {
    result.positiveQualities = selections.positiveQualities.map(toCharacterQuality);
  }

  if (selections.negativeQualities && isEmpty(result.negativeQualities)) {
    result.negativeQualities = selections.negativeQualities.map(toCharacterQuality);
  }

  // racialQualities is not on the typed CreationSelections interface but
  // may be present via the [key: string]: unknown index signature
  const racialQualities = selections["racialQualities"] as string[] | undefined;
  if (racialQualities && isEmpty(result.racialQualities)) {
    result.racialQualities = [...racialQualities];
  }

  // --- Identities & Lifestyles ---

  if (selections.identities && isEmpty(result.identities)) {
    result.identities = [...selections.identities];
  }

  if (selections.lifestyles && isEmpty(result.lifestyles)) {
    result.lifestyles = [...selections.lifestyles];
  }

  // --- Contacts ---

  if (selections.contacts && isEmpty(result.contacts)) {
    result.contacts = [...selections.contacts];
  }

  // --- Gear & Equipment ---

  if (selections.weapons && isEmpty(result.weapons)) {
    result.weapons = [...selections.weapons];
  }

  if (selections.armor && isEmpty(result.armor)) {
    result.armor = [...selections.armor];
  }

  if (selections.gear && isEmpty(result.gear)) {
    result.gear = [...selections.gear];
  }

  if (selections.cyberware && isEmpty(result.cyberware)) {
    result.cyberware = [...selections.cyberware];
  }

  if (selections.bioware && isEmpty(result.bioware)) {
    result.bioware = [...selections.bioware];
  }

  // --- Vehicles & Drones ---

  if (selections.vehicles && isEmpty(result.vehicles)) {
    // Vehicles in creation may have a different shape; cast to Character's Vehicle[]
    result.vehicles = [...selections.vehicles] as typeof result.vehicles;
  }

  if (selections.drones && isEmpty(result.drones)) {
    result.drones = [...selections.drones];
  }

  if (selections.rccs && isEmpty(result.rccs)) {
    result.rccs = [...selections.rccs];
  }

  if (selections.autosofts && isEmpty(result.autosofts)) {
    result.autosofts = [...selections.autosofts];
  }

  // --- Matrix Gear ---

  if (selections.commlinks && isEmpty(result.commlinks)) {
    result.commlinks = [...selections.commlinks];
  }

  if (selections.cyberdecks && isEmpty(result.cyberdecks)) {
    result.cyberdecks = [...selections.cyberdecks];
  }

  if (selections.software && isEmpty(result.programs)) {
    result.programs = toCharacterPrograms(selections.software);
  }

  return result;
}
