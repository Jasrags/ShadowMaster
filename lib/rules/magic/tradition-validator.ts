/**
 * Tradition Validation Service
 *
 * Provides validation for magical tradition selection and
 * magical path consistency checking.
 */

import type { Character } from "@/lib/types/character";
import type {
  TraditionValidationResult,
  MagicValidationError,
  MagicValidationWarning,
} from "@/lib/types/magic";
import type { LoadedRuleset, TraditionData, TraditionSpiritTypes } from "../loader-types";
import { extractTraditions } from "../loader";

// =============================================================================
// TRADITION VALIDATION
// =============================================================================

/**
 * Validate tradition eligibility for a character
 *
 * Checks:
 * - Character has a magical path that supports traditions
 * - Tradition exists in the ruleset
 * - Character meets any tradition-specific requirements
 *
 * @param character - The character to validate
 * @param traditionId - The tradition ID to validate
 * @param ruleset - The loaded ruleset containing tradition data
 * @returns Validation result with errors, warnings, and drain attributes if valid
 */
export function validateTraditionEligibility(
  character: Partial<Character>,
  traditionId: string,
  ruleset: LoadedRuleset
): TraditionValidationResult {
  const errors: MagicValidationError[] = [];
  const warnings: MagicValidationWarning[] = [];

  // Check magical path supports traditions
  const magicalPath = character.magicalPath;
  const pathsSupportingTraditions = ["full-mage", "aspected-mage", "mystic-adept"];

  if (!magicalPath) {
    errors.push({
      code: "NO_MAGICAL_PATH",
      message: "Character must have a magical path before selecting a tradition",
      field: "magicalPath",
    });
    return { valid: false, errors, warnings };
  }

  if (!pathsSupportingTraditions.includes(magicalPath)) {
    errors.push({
      code: "PATH_NO_TRADITION",
      message: `Magical path "${magicalPath}" does not use traditions`,
      field: "magicalPath",
    });
    return { valid: false, errors, warnings };
  }

  // Check Magic rating
  const magicRating = character.specialAttributes?.magic ?? 0;
  if (magicRating <= 0) {
    errors.push({
      code: "NO_MAGIC_RATING",
      message: "Character must have a Magic rating greater than 0 to select a tradition",
      field: "specialAttributes.magic",
    });
    return { valid: false, errors, warnings };
  }

  // Find tradition in ruleset
  const traditions = extractTraditions(ruleset);
  const tradition = traditions.find((t) => t.id === traditionId);

  if (!tradition) {
    errors.push({
      code: "TRADITION_NOT_FOUND",
      message: `Tradition "${traditionId}" not found in ruleset`,
      field: "tradition",
      itemId: traditionId,
    });
    return { valid: false, errors, warnings };
  }

  // Validate drain attributes exist on character
  const [drainAttr1, drainAttr2] = getDrainAttributes(tradition, character as Character);
  const attr1Value = getAttributeValue(character, drainAttr1);
  const attr2Value = getAttributeValue(character, drainAttr2);

  if (attr1Value === undefined || attr2Value === undefined) {
    warnings.push({
      code: "DRAIN_ATTR_MISSING",
      message: `Drain attributes (${drainAttr1}, ${drainAttr2}) not fully defined on character`,
      field: "attributes",
      suggestion: "Ensure all attributes are set before finalizing tradition selection",
    });
  }

  return {
    valid: true,
    errors,
    warnings,
    drainAttributes: [drainAttr1, drainAttr2],
  };
}

/**
 * Get drain attributes for a tradition
 * Handles drain variants (e.g., Black Magic using different attributes for harmful spells)
 *
 * @param tradition - The tradition data
 * @param character - The character (used for variant resolution)
 * @returns Tuple of [attribute1, attribute2] for drain resistance
 */
export function getDrainAttributes(
  tradition: TraditionData,
  _character?: Character
): [string, string] {
  // For now, return the primary drain attributes
  // Future: handle drainVariant based on spell type or character state
  return tradition.drainAttributes;
}

/**
 * Get spirit types for a tradition
 *
 * @param tradition - The tradition data
 * @returns Spirit type mappings for each spell category
 */
export function getTraditionSpiritTypes(tradition: TraditionData): TraditionSpiritTypes {
  return tradition.spiritTypes;
}

/**
 * Validate magical path consistency
 *
 * Ensures character's magical content matches their path:
 * - Mundane: no magic, no spells, no adept powers
 * - Adept: adept powers only, no spells
 * - Full Mage: spells, can summon, can astral project
 * - Mystic Adept: both spells and adept powers
 * - Technomancer: resonance, not magic
 *
 * @param character - The character to validate
 * @param ruleset - The loaded ruleset
 * @returns Validation result
 */
export function validateMagicalPathConsistency(
  character: Partial<Character>,
  _ruleset: LoadedRuleset
): TraditionValidationResult {
  const errors: MagicValidationError[] = [];
  const warnings: MagicValidationWarning[] = [];
  const magicalPath = character.magicalPath;

  if (!magicalPath) {
    errors.push({
      code: "NO_MAGICAL_PATH",
      message: "Character must have a defined magical path",
      field: "magicalPath",
    });
    return { valid: false, errors, warnings };
  }

  const hasSpells = (character.spells?.length ?? 0) > 0;
  const hasAdeptPowers = (character.adeptPowers?.length ?? 0) > 0;
  const hasTradition = !!character.tradition;
  const hasMagic = (character.specialAttributes?.magic ?? 0) > 0;
  const hasResonance = (character.specialAttributes?.resonance ?? 0) > 0;

  switch (magicalPath) {
    case "mundane":
      if (hasMagic) {
        errors.push({
          code: "MUNDANE_HAS_MAGIC",
          message: "Mundane characters cannot have a Magic rating",
          field: "specialAttributes.magic",
        });
      }
      if (hasResonance) {
        errors.push({
          code: "MUNDANE_HAS_RESONANCE",
          message: "Mundane characters cannot have a Resonance rating",
          field: "specialAttributes.resonance",
        });
      }
      if (hasSpells) {
        errors.push({
          code: "MUNDANE_HAS_SPELLS",
          message: "Mundane characters cannot have spells",
          field: "spells",
        });
      }
      if (hasAdeptPowers) {
        errors.push({
          code: "MUNDANE_HAS_POWERS",
          message: "Mundane characters cannot have adept powers",
          field: "adeptPowers",
        });
      }
      if (hasTradition) {
        errors.push({
          code: "MUNDANE_HAS_TRADITION",
          message: "Mundane characters cannot have a tradition",
          field: "tradition",
        });
      }
      break;

    case "adept":
      if (!hasMagic) {
        errors.push({
          code: "ADEPT_NO_MAGIC",
          message: "Adepts must have a Magic rating",
          field: "specialAttributes.magic",
        });
      }
      if (hasSpells) {
        errors.push({
          code: "ADEPT_HAS_SPELLS",
          message: "Adepts cannot cast spells (only adept powers)",
          field: "spells",
        });
      }
      if (hasTradition) {
        // Adepts don't need traditions, but some may choose one
        warnings.push({
          code: "ADEPT_WITH_TRADITION",
          message: "Adepts typically do not select a tradition",
          field: "tradition",
          suggestion: "Tradition selection is optional for adepts",
        });
      }
      break;

    case "full-mage":
    case "aspected-mage":
      if (!hasMagic) {
        errors.push({
          code: "MAGE_NO_MAGIC",
          message: "Mages must have a Magic rating",
          field: "specialAttributes.magic",
        });
      }
      if (!hasTradition && hasMagic) {
        warnings.push({
          code: "MAGE_NO_TRADITION",
          message: "Mages should select a magical tradition",
          field: "tradition",
          suggestion: "Select a tradition to define drain attributes and spirit types",
        });
      }
      if (hasAdeptPowers) {
        errors.push({
          code: "MAGE_HAS_ADEPT_POWERS",
          message: "Full mages cannot have adept powers (use Mystic Adept path)",
          field: "adeptPowers",
        });
      }
      break;

    case "mystic-adept":
      if (!hasMagic) {
        errors.push({
          code: "MYSTIC_NO_MAGIC",
          message: "Mystic adepts must have a Magic rating",
          field: "specialAttributes.magic",
        });
      }
      if (!hasTradition && hasMagic) {
        warnings.push({
          code: "MYSTIC_NO_TRADITION",
          message: "Mystic adepts should select a magical tradition",
          field: "tradition",
          suggestion: "Select a tradition to define drain attributes",
        });
      }
      // Mystic adepts can have both spells and powers - no error
      break;

    case "technomancer":
      if (!hasResonance) {
        errors.push({
          code: "TECHNO_NO_RESONANCE",
          message: "Technomancers must have a Resonance rating",
          field: "specialAttributes.resonance",
        });
      }
      if (hasMagic) {
        errors.push({
          code: "TECHNO_HAS_MAGIC",
          message: "Technomancers cannot have a Magic rating",
          field: "specialAttributes.magic",
        });
      }
      if (hasSpells) {
        errors.push({
          code: "TECHNO_HAS_SPELLS",
          message: "Technomancers cannot have spells (use complex forms)",
          field: "spells",
        });
      }
      if (hasAdeptPowers) {
        errors.push({
          code: "TECHNO_HAS_POWERS",
          message: "Technomancers cannot have adept powers",
          field: "adeptPowers",
        });
      }
      if (hasTradition) {
        errors.push({
          code: "TECHNO_HAS_TRADITION",
          message: "Technomancers do not use magical traditions",
          field: "tradition",
        });
      }
      break;

    case "explorer":
      // Explorer path is for characters with latent magical potential
      // They have neither full magic nor technomancer abilities initially
      if (hasSpells) {
        warnings.push({
          code: "EXPLORER_HAS_SPELLS",
          message: "Explorer path characters typically develop magic through play",
          field: "spells",
        });
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if a character can use magic
 *
 * @param character - The character to check
 * @returns True if character can use magical abilities
 */
export function canUseMagic(character: Partial<Character>): boolean {
  const magicalPath = character.magicalPath;
  const magicRating = character.specialAttributes?.magic ?? 0;

  // Must have a magical path
  if (!magicalPath || magicalPath === "mundane" || magicalPath === "technomancer") {
    return false;
  }

  // Must have positive Magic rating
  if (magicRating <= 0) {
    return false;
  }

  return true;
}

/**
 * Check if a character can cast spells
 *
 * @param character - The character to check
 * @returns True if character can cast spells
 */
export function canCastSpells(character: Partial<Character>): boolean {
  if (!canUseMagic(character)) {
    return false;
  }

  const magicalPath = character.magicalPath;
  const spellcastingPaths = ["full-mage", "aspected-mage", "mystic-adept"];

  return spellcastingPaths.includes(magicalPath!);
}

/**
 * Check if a character can use adept powers
 *
 * @param character - The character to check
 * @returns True if character can use adept powers
 */
export function canUseAdeptPowers(character: Partial<Character>): boolean {
  if (!canUseMagic(character)) {
    return false;
  }

  const magicalPath = character.magicalPath;
  const adeptPaths = ["adept", "mystic-adept"];

  return adeptPaths.includes(magicalPath!);
}

/**
 * Check if a character can summon spirits
 *
 * @param character - The character to check
 * @returns True if character can summon spirits
 */
export function canSummonSpirits(character: Partial<Character>): boolean {
  if (!canUseMagic(character)) {
    return false;
  }

  const magicalPath = character.magicalPath;
  // Full mages and mystic adepts can summon
  // Aspected mages may be conjurers (future: check aspect type)
  const summoningPaths = ["full-mage", "mystic-adept"];

  return summoningPaths.includes(magicalPath!);
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get attribute value from character, handling various attribute key formats
 */
function getAttributeValue(character: Partial<Character>, attrCode: string): number | undefined {
  const normalizedCode = attrCode.toLowerCase();

  // Check regular attributes
  const attrValue = character.attributes?.[normalizedCode];
  if (attrValue !== undefined) {
    return attrValue;
  }

  // Check special attributes
  const specialAttrs = character.specialAttributes;
  if (specialAttrs) {
    if (normalizedCode === "edg" || normalizedCode === "edge") {
      return specialAttrs.edge;
    }
    if (normalizedCode === "ess" || normalizedCode === "essence") {
      return specialAttrs.essence;
    }
    if (normalizedCode === "mag" || normalizedCode === "magic") {
      return specialAttrs.magic;
    }
    if (normalizedCode === "res" || normalizedCode === "resonance") {
      return specialAttrs.resonance;
    }
  }

  return undefined;
}

/**
 * Find tradition by ID in ruleset
 */
export function findTradition(
  traditionId: string,
  ruleset: LoadedRuleset
): TraditionData | undefined {
  const traditions = extractTraditions(ruleset);
  return traditions.find((t) => t.id === traditionId);
}

/**
 * Get all available traditions from ruleset
 */
export function getAvailableTraditions(ruleset: LoadedRuleset): TraditionData[] {
  return extractTraditions(ruleset);
}
