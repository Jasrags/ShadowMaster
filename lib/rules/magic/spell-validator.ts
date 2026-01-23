/**
 * Spell and Power Validation Service
 *
 * Provides validation for spell allocation, adept power allocation,
 * and spell compatibility checking.
 */

import type { Character, AdeptPower } from "@/lib/types/character";
import type {
  SpellValidationResult,
  MagicValidationError,
  MagicValidationWarning,
  SpellCategory,
} from "@/lib/types/magic";
import type {
  LoadedRuleset,
  SpellData,
  SpellsCatalogData,
  AdeptPowerCatalogItem,
} from "../loader-types";
import { canCastSpells, canUseAdeptPowers } from "./tradition-validator";

// =============================================================================
// SPELL VALIDATION
// =============================================================================

/**
 * Validate spell allocation against character's magical budget
 *
 * @param character - The character to validate
 * @param spellIds - Array of spell IDs to validate
 * @param spellLimit - Maximum number of spells allowed
 * @param ruleset - The loaded ruleset containing spell data
 * @returns Validation result
 */
export function validateSpellAllocation(
  character: Partial<Character>,
  spellIds: string[],
  spellLimit: number,
  ruleset: LoadedRuleset
): SpellValidationResult {
  const errors: MagicValidationError[] = [];
  const warnings: MagicValidationWarning[] = [];

  // Check character can cast spells
  if (!canCastSpells(character)) {
    errors.push({
      code: "CANNOT_CAST_SPELLS",
      message: "Character's magical path does not allow spellcasting",
      field: "magicalPath",
    });
    return {
      valid: false,
      errors,
      warnings,
      budgetRemaining: 0,
      budgetTotal: 0,
    };
  }

  // Check spell limit
  if (spellIds.length > spellLimit) {
    errors.push({
      code: "SPELL_LIMIT_EXCEEDED",
      message: `Cannot select more than ${spellLimit} spells (selected: ${spellIds.length})`,
      field: "spells",
    });
  }

  // Validate each spell exists in ruleset
  const spellsCatalog = extractSpellsCatalog(ruleset);
  const invalidSpells: string[] = [];
  const duplicateSpells: string[] = [];
  const seenSpells = new Set<string>();

  for (const spellId of spellIds) {
    // Check for duplicates
    if (seenSpells.has(spellId)) {
      duplicateSpells.push(spellId);
    } else {
      seenSpells.add(spellId);
    }

    // Check spell exists
    const spell = findSpellInCatalog(spellId, spellsCatalog);
    if (!spell) {
      invalidSpells.push(spellId);
    }
  }

  if (invalidSpells.length > 0) {
    errors.push({
      code: "SPELLS_NOT_FOUND",
      message: `Spells not found in ruleset: ${invalidSpells.join(", ")}`,
      field: "spells",
    });
  }

  if (duplicateSpells.length > 0) {
    errors.push({
      code: "DUPLICATE_SPELLS",
      message: `Duplicate spells selected: ${duplicateSpells.join(", ")}`,
      field: "spells",
    });
  }

  const uniqueSpellCount = seenSpells.size;
  const budgetRemaining = Math.max(0, spellLimit - uniqueSpellCount);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    budgetRemaining,
    budgetTotal: spellLimit,
  };
}

/**
 * Validate adept power allocation against power point budget
 *
 * @param character - The character to validate
 * @param powers - Array of adept powers to validate
 * @param powerPointBudget - Total power points available
 * @param ruleset - The loaded ruleset containing power data
 * @returns Validation result
 */
export function validateAdeptPowerAllocation(
  character: Partial<Character>,
  powers: AdeptPower[],
  powerPointBudget: number,
  ruleset: LoadedRuleset
): SpellValidationResult {
  const errors: MagicValidationError[] = [];
  const warnings: MagicValidationWarning[] = [];

  // Check character can use adept powers
  if (!canUseAdeptPowers(character)) {
    errors.push({
      code: "CANNOT_USE_POWERS",
      message: "Character's magical path does not allow adept powers",
      field: "magicalPath",
    });
    return {
      valid: false,
      errors,
      warnings,
      budgetRemaining: 0,
      budgetTotal: 0,
    };
  }

  // Calculate total power points spent
  let totalSpent = 0;
  const powerCatalog = extractAdeptPowersCatalog(ruleset);

  for (const power of powers) {
    const catalogPower = powerCatalog.find((p) => p.id === power.catalogId);

    if (!catalogPower) {
      errors.push({
        code: "POWER_NOT_FOUND",
        message: `Adept power "${power.name}" (${power.catalogId}) not found in ruleset`,
        field: "adeptPowers",
        itemId: power.catalogId,
      });
      continue;
    }

    // Validate rating if leveled power
    // Prefer maxRating (new), fall back to maxLevel (deprecated)
    const maxRating = catalogPower.maxRating ?? catalogPower.maxLevel;
    if (maxRating !== undefined && power.rating !== undefined) {
      if (power.rating > maxRating) {
        errors.push({
          code: "POWER_LEVEL_EXCEEDED",
          message: `${power.name} cannot exceed level ${maxRating} (selected: ${power.rating})`,
          field: "adeptPowers",
          itemId: power.catalogId,
        });
      }
    }

    // Calculate cost for this power
    const powerCost = calculatePowerPointCost(power, catalogPower);
    totalSpent += powerCost;

    // Validate specification if required
    if (catalogPower.requiresSkill && !power.specification) {
      errors.push({
        code: "POWER_REQUIRES_SKILL",
        message: `${power.name} requires a skill specification`,
        field: "adeptPowers",
        itemId: power.catalogId,
      });
    }

    if (catalogPower.requiresAttribute && !power.specification) {
      errors.push({
        code: "POWER_REQUIRES_ATTRIBUTE",
        message: `${power.name} requires an attribute specification`,
        field: "adeptPowers",
        itemId: power.catalogId,
      });
    }
  }

  // Check budget
  if (totalSpent > powerPointBudget) {
    errors.push({
      code: "POWER_POINTS_EXCEEDED",
      message: `Power points exceeded: ${totalSpent.toFixed(2)} / ${powerPointBudget} available`,
      field: "adeptPowers",
    });
  }

  const budgetRemaining = Math.max(0, powerPointBudget - totalSpent);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    budgetRemaining,
    budgetTotal: powerPointBudget,
  };
}

/**
 * Check if a spell is compatible with the character
 * (All spells are generally compatible; future: check tradition-specific restrictions)
 *
 * @param spellId - The spell ID to check
 * @param character - The character
 * @param ruleset - The loaded ruleset
 * @returns True if spell is compatible
 */
export function isSpellCompatible(
  spellId: string,
  character: Partial<Character>,
  ruleset: LoadedRuleset
): boolean {
  // Check character can cast spells
  if (!canCastSpells(character)) {
    return false;
  }

  // Check spell exists
  const spellsCatalog = extractSpellsCatalog(ruleset);
  const spell = findSpellInCatalog(spellId, spellsCatalog);

  if (!spell) {
    return false;
  }

  // Future: Add tradition-specific restrictions
  // e.g., some traditions might not allow certain spell categories

  return true;
}

/**
 * Get spell definition from ruleset
 *
 * @param spellId - The spell ID to look up
 * @param category - Optional category to search in
 * @param ruleset - The loaded ruleset
 * @returns Spell data or null if not found
 */
export function getSpellDefinition(
  spellId: string,
  category: SpellCategory | undefined,
  ruleset: LoadedRuleset
): SpellData | null {
  const spellsCatalog = extractSpellsCatalog(ruleset);

  if (category) {
    const spells = spellsCatalog[category];
    return spells?.find((s) => s.id === spellId) ?? null;
  }

  return findSpellInCatalog(spellId, spellsCatalog);
}

/**
 * Get adept power definition from ruleset
 *
 * @param powerId - The power ID to look up
 * @param ruleset - The loaded ruleset
 * @returns Power catalog item or null if not found
 */
export function getAdeptPowerDefinition(
  powerId: string,
  ruleset: LoadedRuleset
): AdeptPowerCatalogItem | null {
  const powerCatalog = extractAdeptPowersCatalog(ruleset);
  return powerCatalog.find((p) => p.id === powerId) ?? null;
}

// =============================================================================
// CATALOG EXTRACTION
// =============================================================================

/**
 * Extract spells catalog from ruleset
 */
export function extractSpellsCatalog(ruleset: LoadedRuleset): SpellsCatalogData {
  const emptyResult: SpellsCatalogData = {
    combat: [],
    detection: [],
    health: [],
    illusion: [],
    manipulation: [],
  };

  // Find the magic module in the books
  for (const book of ruleset.books) {
    const magicModule = book.payload.modules.magic;
    if (magicModule?.payload) {
      const payload = magicModule.payload as { spells?: SpellsCatalogData };
      if (payload.spells) {
        // Merge with existing (for multiple books)
        return {
          combat: [...emptyResult.combat, ...(payload.spells.combat || [])],
          detection: [...emptyResult.detection, ...(payload.spells.detection || [])],
          health: [...emptyResult.health, ...(payload.spells.health || [])],
          illusion: [...emptyResult.illusion, ...(payload.spells.illusion || [])],
          manipulation: [...emptyResult.manipulation, ...(payload.spells.manipulation || [])],
        };
      }
    }
  }

  return emptyResult;
}

/**
 * Extract adept powers catalog from ruleset
 */
export function extractAdeptPowersCatalog(ruleset: LoadedRuleset): AdeptPowerCatalogItem[] {
  const powers: AdeptPowerCatalogItem[] = [];

  for (const book of ruleset.books) {
    const adeptPowersModule = book.payload.modules.adeptPowers;
    if (adeptPowersModule?.payload) {
      const payload = adeptPowersModule.payload as { powers?: AdeptPowerCatalogItem[] };
      if (payload.powers) {
        powers.push(...payload.powers);
      }
    }
  }

  return powers;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Find spell in catalog across all categories
 */
function findSpellInCatalog(spellId: string, catalog: SpellsCatalogData): SpellData | null {
  const categories: SpellCategory[] = ["combat", "detection", "health", "illusion", "manipulation"];

  for (const category of categories) {
    const spell = catalog[category]?.find((s) => s.id === spellId);
    if (spell) {
      return spell;
    }
  }

  return null;
}

/**
 * Calculate power point cost for an adept power
 */
function calculatePowerPointCost(power: AdeptPower, catalogPower: AdeptPowerCatalogItem): number {
  // New unified ratings approach - check ratings table first
  if (catalogPower.hasRating && catalogPower.ratings && power.rating !== undefined) {
    const ratingData = catalogPower.ratings[power.rating];
    return ratingData?.powerPointCost ?? 0;
  }
  // Non-rated power - use top-level powerPointCost
  return catalogPower.powerPointCost ?? 0;
}

/**
 * Get all spells of a specific category
 */
export function getSpellsByCategory(category: SpellCategory, ruleset: LoadedRuleset): SpellData[] {
  const catalog = extractSpellsCatalog(ruleset);
  return catalog[category] || [];
}

/**
 * Get all spells from the ruleset
 */
export function getAllSpells(ruleset: LoadedRuleset): SpellData[] {
  const catalog = extractSpellsCatalog(ruleset);
  return [
    ...catalog.combat,
    ...catalog.detection,
    ...catalog.health,
    ...catalog.illusion,
    ...catalog.manipulation,
  ];
}

/**
 * Get all adept powers from the ruleset
 */
export function getAllAdeptPowers(ruleset: LoadedRuleset): AdeptPowerCatalogItem[] {
  return extractAdeptPowersCatalog(ruleset);
}
