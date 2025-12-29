/**
 * Magic Advancement Validation and Costs
 *
 * Handles karma cost calculations and validation for magical advancement:
 * - Spell learning
 * - Initiation
 * - Adept power purchases
 */

import type { Character, MergedRuleset, AdeptPower } from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";
import type { AdvancementRulesData, LoadedRuleset, SpellData } from "@/lib/rules/loader-types";
import { extractSpellsCatalog, extractAdeptPowersCatalog } from "@/lib/rules/magic";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of advancement validation
 */
export interface MagicAdvancementValidationResult {
  valid: boolean;
  errors: Array<{ message: string; field?: string }>;
  cost?: number;
  warnings?: string[];
}

/**
 * Proposed adept power for advancement validation
 */
export interface AdeptPowerAdvancement {
  id: string;
  rating: number;
  specification?: string;
}

// =============================================================================
// SPELL ADVANCEMENT
// =============================================================================

/**
 * Calculate karma cost for learning a new spell
 *
 * Per SR5: Spells cost 5 karma each to learn post-creation
 *
 * @param settings - Optional campaign settings
 * @param ruleset - Optional ruleset defaults
 * @returns Karma cost
 */
export function calculateSpellLearningCost(
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  return settings?.spellKarmaCost ?? ruleset?.spellKarmaCost ?? 5;
}

/**
 * Validate spell learning advancement
 *
 * @param character - Character learning the spell
 * @param spellId - ID of the spell to learn
 * @param ruleset - Loaded ruleset
 * @returns Validation result
 */
export function validateSpellAdvancement(
  character: Character,
  spellId: string,
  ruleset: LoadedRuleset
): MagicAdvancementValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];
  const warnings: string[] = [];

  // Check character can cast spells
  const magicalPath = character.magicalPath;
  if (!magicalPath || magicalPath === "mundane" || magicalPath === "technomancer" || magicalPath === "adept") {
    errors.push({
      message: "Character cannot learn spells with this magical path",
      field: "magicalPath",
    });
    return { valid: false, errors };
  }

  // Check the spell exists in the ruleset
  const spellsCatalog = extractSpellsCatalog(ruleset);
  const allSpells: SpellData[] = [
    ...spellsCatalog.combat,
    ...spellsCatalog.detection,
    ...spellsCatalog.health,
    ...spellsCatalog.illusion,
    ...spellsCatalog.manipulation,
  ];
  const spell = allSpells.find((s) => s.id === spellId);
  if (!spell) {
    errors.push({
      message: "Spell not found in ruleset",
      field: "spellId",
    });
    return { valid: false, errors };
  }

  // Check if character already knows the spell (spells is string[])
  const knownSpells = character.spells || [];
  if (knownSpells.includes(spellId)) {
    errors.push({
      message: "Character already knows this spell",
      field: "spellId",
    });
    return { valid: false, errors };
  }

  const cost = calculateSpellLearningCost();

  // Check karma availability (karmaCurrent field)
  const availableKarma = character.karmaCurrent ?? 0;
  if (availableKarma < cost) {
    errors.push({
      message: `Insufficient karma (need ${cost}, have ${availableKarma})`,
      field: "karma",
    });
    return { valid: false, errors, cost };
  }

  return { valid: true, errors: [], cost, warnings };
}

// =============================================================================
// INITIATION ADVANCEMENT
// =============================================================================

/**
 * Calculate karma cost for initiation
 *
 * Per SR5: 10 + (new grade × 3) for solo initiation
 * Ordeal reduces cost by 3 karma
 * Group initiation reduces cost by 2 karma
 *
 * @param currentGrade - Current initiation grade (0 for uninitiated)
 * @param ordealUsed - Whether an ordeal is used
 * @param groupInitiation - Whether initiating with a group
 * @returns Karma cost
 */
export function calculateInitiationKarmaCost(
  currentGrade: number,
  ordealUsed: boolean = false,
  groupInitiation: boolean = false
): number {
  const newGrade = currentGrade + 1;
  let baseCost = 10 + newGrade * 3;

  // Apply modifiers
  if (ordealUsed) {
    baseCost -= 3;
  }
  if (groupInitiation) {
    baseCost -= 2;
  }

  return Math.max(1, baseCost); // Minimum cost of 1
}

/**
 * Validate initiation advancement
 *
 * Note: Character doesn't currently track initiateGrade, so we pass it in
 * as a parameter. This could be added to Character type in the future.
 *
 * @param character - Character initiating
 * @param currentGrade - Current initiation grade
 * @param ordealUsed - Whether an ordeal is used
 * @param groupInitiation - Whether initiating with a group
 * @param _ruleset - Merged ruleset
 * @returns Validation result
 */
export function validateInitiationAdvancement(
  character: Character,
  currentGrade: number,
  ordealUsed: boolean,
  groupInitiation: boolean,
  _ruleset: MergedRuleset
): MagicAdvancementValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];
  const warnings: string[] = [];

  // Check character has Magic attribute
  const magicRating = character.specialAttributes?.magic ?? 0;
  if (magicRating <= 0) {
    errors.push({
      message: "Character must have Magic rating to initiate",
      field: "magic",
    });
    return { valid: false, errors };
  }

  // Check magical path allows initiation
  const magicalPath = character.magicalPath;
  if (!magicalPath || magicalPath === "mundane" || magicalPath === "technomancer") {
    errors.push({
      message: "Character must be Awakened to initiate",
      field: "magicalPath",
    });
    return { valid: false, errors };
  }

  const cost = calculateInitiationKarmaCost(currentGrade, ordealUsed, groupInitiation);

  // Check karma availability
  const availableKarma = character.karmaCurrent ?? 0;
  if (availableKarma < cost) {
    errors.push({
      message: `Insufficient karma (need ${cost}, have ${availableKarma})`,
      field: "karma",
    });
    return { valid: false, errors, cost };
  }

  // Warn about initiation without ordeal
  if (!ordealUsed) {
    warnings.push(
      `Using an ordeal would reduce the cost from ${cost} to ${calculateInitiationKarmaCost(currentGrade, true, groupInitiation)} karma`
    );
  }

  return { valid: true, errors: [], cost, warnings };
}

// =============================================================================
// ADEPT POWER ADVANCEMENT
// =============================================================================

/**
 * Calculate karma cost for adept power purchase
 *
 * Per SR5: PP cost × 5 karma per PP
 *
 * @param ppCost - Power Point cost of the power
 * @param _settings - Optional campaign settings (reserved for future use)
 * @param _ruleset - Optional ruleset defaults (reserved for future use)
 * @returns Karma cost
 */
export function calculateAdeptPowerKarmaCost(
  ppCost: number,
  _settings?: CampaignAdvancementSettings,
  _ruleset?: AdvancementRulesData
): number {
  // Default: 5 karma per PP
  const karmaPerPP = 5;
  return Math.ceil(ppCost * karmaPerPP);
}

/**
 * Validate adept power advancement
 *
 * @param character - Character purchasing the power
 * @param power - Proposed power to purchase
 * @param ruleset - Loaded ruleset
 * @returns Validation result
 */
export function validateAdeptPowerAdvancement(
  character: Character,
  power: AdeptPowerAdvancement,
  ruleset: LoadedRuleset
): MagicAdvancementValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];
  const warnings: string[] = [];

  // Check character is an adept or mystic adept
  const magicalPath = character.magicalPath;
  if (magicalPath !== "adept" && magicalPath !== "mystic-adept") {
    errors.push({
      message: "Character must be an Adept or Mystic Adept to purchase adept powers",
      field: "magicalPath",
    });
    return { valid: false, errors };
  }

  // Get the power from the catalog
  const powersCatalog = extractAdeptPowersCatalog(ruleset);
  const powerDef = powersCatalog.find((p) => p.id === power.id);
  if (!powerDef) {
    errors.push({
      message: "Power not found in ruleset",
      field: "powerId",
    });
    return { valid: false, errors };
  }

  // Calculate PP cost
  const baseCost = powerDef.cost ?? 0;
  const ppCost = powerDef.costType === "perLevel" ? baseCost * power.rating : baseCost;

  // Check if character already has this power (AdeptPower has 'rating' field)
  const existingPowers: AdeptPower[] = character.adeptPowers || [];
  const existingPower = existingPowers.find((p) => p.id === power.id);
  if (existingPower) {
    if (powerDef.costType !== "perLevel") {
      errors.push({
        message: "Character already has this power",
        field: "powerId",
      });
      return { valid: false, errors };
    }
    // For leveled powers, they need to be upgrading
    if (power.rating <= (existingPower.rating ?? 0)) {
      errors.push({
        message: "New rating must be higher than current rating",
        field: "rating",
      });
      return { valid: false, errors };
    }
  }

  // Calculate karma cost
  const karmaCost = calculateAdeptPowerKarmaCost(ppCost);

  // Check karma availability
  const availableKarma = character.karmaCurrent ?? 0;
  if (availableKarma < karmaCost) {
    errors.push({
      message: `Insufficient karma (need ${karmaCost}, have ${availableKarma})`,
      field: "karma",
    });
    return { valid: false, errors, cost: karmaCost };
  }

  // Check Magic attribute
  const magicRating = character.specialAttributes?.magic ?? 0;
  if (magicRating <= 0) {
    errors.push({
      message: "Character must have Magic rating to use adept powers",
      field: "magic",
    });
    return { valid: false, errors, cost: karmaCost };
  }

  return { valid: true, errors: [], cost: karmaCost, warnings };
}

// =============================================================================
// RITUAL ADVANCEMENT
// =============================================================================

/**
 * Calculate karma cost for learning a ritual
 *
 * Per SR5: Rituals cost 5 karma (same as spells)
 */
export function calculateRitualLearningCost(
  settings?: CampaignAdvancementSettings,
  ruleset?: AdvancementRulesData
): number {
  // Rituals use the same cost as spells
  return settings?.spellKarmaCost ?? ruleset?.spellKarmaCost ?? 5;
}

/**
 * Validate ritual learning advancement
 *
 * @param character - Character learning the ritual
 * @param ritualId - ID of the ritual to learn
 * @param existingRitualIds - List of ritual IDs already known
 * @returns Validation result
 */
export function validateRitualAdvancement(
  character: Character,
  ritualId: string,
  existingRitualIds: string[]
): MagicAdvancementValidationResult {
  const errors: Array<{ message: string; field?: string }> = [];

  // Check character can perform rituals
  const magicalPath = character.magicalPath;
  if (!magicalPath || magicalPath === "mundane" || magicalPath === "technomancer" || magicalPath === "adept") {
    errors.push({
      message: "Character cannot learn rituals with this magical path",
      field: "magicalPath",
    });
    return { valid: false, errors };
  }

  // Check if already known
  if (existingRitualIds.includes(ritualId)) {
    errors.push({
      message: "Character already knows this ritual",
      field: "ritualId",
    });
    return { valid: false, errors };
  }

  const cost = calculateRitualLearningCost();

  // Check karma
  const availableKarma = character.karmaCurrent ?? 0;
  if (availableKarma < cost) {
    errors.push({
      message: `Insufficient karma (need ${cost}, have ${availableKarma})`,
      field: "karma",
    });
    return { valid: false, errors, cost };
  }

  return { valid: true, errors: [], cost };
}

// =============================================================================
// METAMAGIC UTILITY
// =============================================================================

/**
 * Get available metamagics for a character's initiation grade
 *
 * @param initiateGrade - Character's initiation grade
 * @param knownMetamagics - List of metamagic IDs already known
 * @returns List of available metamagic IDs
 */
export function getAvailableMetamagics(
  initiateGrade: number,
  knownMetamagics: string[]
): string[] {
  if (initiateGrade <= 0) {
    return [];
  }

  // Each initiation grants access to one metamagic
  // Character can select from the full list but can only have (grade) metamagics
  const canSelectNew = knownMetamagics.length < initiateGrade;

  if (!canSelectNew) {
    return []; // Already have max metamagics for current grade
  }

  // Standard metamagics list
  const allMetamagics = [
    "centering",
    "flexible-signature",
    "masking",
    "power-point",
    "quickening",
    "shielding",
    "spell-shaping",
  ];

  return allMetamagics.filter((m) => !knownMetamagics.includes(m));
}
