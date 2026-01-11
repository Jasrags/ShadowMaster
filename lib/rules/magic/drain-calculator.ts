/**
 * Drain Calculator
 *
 * Provides drain calculation for all magical actions including
 * spellcasting, summoning, binding, and rituals.
 */

import type { Character } from "@/lib/types/character";
import type { DrainResult, DrainBreakdown, DrainModifier, DrainAction } from "@/lib/types/magic";
import type { LoadedRuleset } from "../loader-types";
import { findTradition, getDrainAttributes } from "./tradition-validator";
import { getSpellDefinition } from "./spell-validator";

// =============================================================================
// DRAIN CALCULATION INPUT TYPES
// =============================================================================

/**
 * Input for drain calculation
 */
export interface DrainCalculationInput {
  /** Type of magical action causing drain */
  action: DrainAction;

  /** Force of the spell/summoning/ritual */
  force: number;

  /** Spell ID for spellcasting */
  spellId?: string;

  /** Spell category for spellcasting */
  spellCategory?: "combat" | "detection" | "health" | "illusion" | "manipulation";

  /** For summoning: type of spirit */
  spiritType?: string;

  /** For rituals: ritual ID */
  ritualId?: string;

  /** For adept powers: specified power */
  adeptPowerId?: string;

  /** Whether edge was used (may affect drain) */
  edgeUsed?: boolean;

  /** Custom drain formula override (for testing or house rules) */
  customDrainFormula?: string;

  /** Number of hits on the casting test (for sustained spells) */
  castingHits?: number;
}

// =============================================================================
// MAIN DRAIN CALCULATION
// =============================================================================

/**
 * Calculate drain for a magical action
 *
 * @param character - The character performing the action
 * @param input - Drain calculation input parameters
 * @param ruleset - The loaded ruleset
 * @returns Drain calculation result with value, type, and breakdown
 */
export function calculateDrain(
  character: Partial<Character>,
  input: DrainCalculationInput,
  ruleset: LoadedRuleset
): DrainResult {
  const modifiers: DrainModifier[] = [];

  // Get the base drain formula based on action type
  const baseFormula = input.customDrainFormula || getBaseDrainFormula(input, ruleset);

  // Parse the drain formula with the force value
  let drainValue = parseDrainFormula(baseFormula, input.force);

  // Apply modifiers
  const mentorModifier = getMentorSpiritModifier(character, input);
  if (mentorModifier !== 0) {
    modifiers.push({
      source: "mentor-spirit",
      value: mentorModifier,
      reason: "Mentor spirit drain modifier",
    });
    drainValue += mentorModifier;
  }

  // Focus modifier (if applicable - reduces sustaining penalty, not drain directly)
  // Note: Focus effects on drain are typically quality-based, not standard

  // Edge modifier (if pushed limit on casting)
  if (input.edgeUsed) {
    // In SR5, using Edge doesn't directly modify drain value
    // but we note it for tracking purposes
    modifiers.push({
      source: "edge",
      value: 0,
      reason: "Edge used - no drain modification",
    });
  }

  // Minimum drain is always at least 2 (per SR5 rules)
  if (drainValue < 2) {
    modifiers.push({
      source: "minimum-drain",
      value: 2 - drainValue,
      reason: "Minimum drain is 2",
    });
    drainValue = 2;
  }

  // Determine drain type (stun vs physical)
  const magicRating = character.specialAttributes?.magic ?? 0;
  const drainType = getDrainType(drainValue, magicRating);

  // Calculate resistance pool
  const resistancePool = calculateDrainResistance(character, ruleset);

  // Build breakdown (available for extended result if needed)
  const _breakdown: DrainBreakdown = {
    baseFormula,
    forceValue: input.force,
    modifiers,
    finalValue: drainValue,
  };

  return {
    drainValue,
    drainType,
    resistancePool,
    drainFormula: baseFormula,
  };
}

/**
 * Calculate drain resistance pool based on tradition
 *
 * @param character - The character
 * @param ruleset - The loaded ruleset
 * @returns The dice pool for resisting drain
 */
export function calculateDrainResistance(
  character: Partial<Character>,
  ruleset: LoadedRuleset
): number {
  const traditionId = character.tradition;
  if (!traditionId) {
    // Default to WIL + CHA if no tradition (shouldn't happen normally)
    const wil = getAttributeValue(character, "wil") ?? 0;
    const cha = getAttributeValue(character, "cha") ?? 0;
    return wil + cha;
  }

  const tradition = findTradition(traditionId, ruleset);
  if (!tradition) {
    // Tradition not found, use default
    const wil = getAttributeValue(character, "wil") ?? 0;
    const cha = getAttributeValue(character, "cha") ?? 0;
    return wil + cha;
  }

  const [attr1Code, attr2Code] = getDrainAttributes(tradition);
  const attr1Value = getAttributeValue(character, attr1Code) ?? 0;
  const attr2Value = getAttributeValue(character, attr2Code) ?? 0;

  return attr1Value + attr2Value;
}

/**
 * Parse a drain formula and calculate the result
 *
 * Supports formulas like:
 * - "F" (equal to Force)
 * - "F-3" (Force minus 3)
 * - "F+2" (Force plus 2)
 * - "F/2" (Force divided by 2, rounded up)
 * - "F/2+1" (Force/2 plus 1)
 * - "F-2" or "F - 2" (with optional spaces)
 *
 * @param formula - The drain formula string
 * @param force - The force value to substitute for F
 * @returns The calculated drain value (minimum 2)
 */
export function parseDrainFormula(formula: string, force: number): number {
  // Normalize the formula
  const normalized = formula.toUpperCase().replace(/\s/g, "");

  // Handle simple "F" case
  if (normalized === "F") {
    return Math.max(2, force);
  }

  // Handle division first (F/2, F/2+1, etc.)
  if (normalized.includes("/")) {
    const divMatch = normalized.match(/^F\/(\d+)(.*)$/);
    if (divMatch) {
      const divisor = parseInt(divMatch[1], 10);
      const remainder = divMatch[2];

      // Apply division (round up for drain)
      let result = Math.ceil(force / divisor);

      // Handle additional operations
      if (remainder) {
        const addMatch = remainder.match(/^([+-])(\d+)$/);
        if (addMatch) {
          const operator = addMatch[1];
          const operand = parseInt(addMatch[2], 10);
          result = operator === "+" ? result + operand : result - operand;
        }
      }

      return Math.max(2, result);
    }
  }

  // Handle addition/subtraction (F-3, F+2, etc.)
  const opMatch = normalized.match(/^F([+-])(\d+)$/);
  if (opMatch) {
    const operator = opMatch[1];
    const operand = parseInt(opMatch[2], 10);
    const result = operator === "+" ? force + operand : force - operand;
    return Math.max(2, result);
  }

  // If we can't parse it, return force as default
  console.warn(`Unable to parse drain formula: ${formula}, using Force value`);
  return Math.max(2, force);
}

/**
 * Determine if drain is physical or stun
 *
 * In Shadowrun 5th Edition:
 * - If drain value exceeds Magic rating, it's Physical damage
 * - Otherwise, it's Stun damage
 *
 * @param drainValue - The calculated drain value
 * @param magicRating - The character's Magic attribute
 * @returns "physical" or "stun"
 */
export function getDrainType(drainValue: number, magicRating: number): "stun" | "physical" {
  return drainValue > magicRating ? "physical" : "stun";
}

// =============================================================================
// SPECIFIC ACTION DRAIN LOOKUPS
// =============================================================================

/**
 * Get the base drain formula for a magical action
 */
function getBaseDrainFormula(input: DrainCalculationInput, ruleset: LoadedRuleset): string {
  switch (input.action) {
    case "spellcasting":
      return getSpellDrainFormula(input, ruleset);

    case "summoning":
      // Summoning drain is typically Force * 2 - hits
      // Since we don't have hits at calculation time, we use Force
      return "F";

    case "banishing":
      // Banishing drain is typically spirit's Force
      return "F";

    case "binding":
      // Binding drain is typically Force * 2
      return "F";

    case "ritual":
      return getRitualDrainFormula(input, ruleset);

    case "adept-power":
      // Most adept powers don't cause drain
      // Some exceptions exist in specific qualities
      return "0";

    case "counterspelling":
      // Counterspelling doesn't cause drain in SR5
      return "0";

    default:
      return "F";
  }
}

/**
 * Get drain formula for a specific spell
 */
function getSpellDrainFormula(input: DrainCalculationInput, ruleset: LoadedRuleset): string {
  if (!input.spellId) {
    // Default spell drain if no specific spell
    return "F-2";
  }

  const spell = getSpellDefinition(input.spellId, input.spellCategory, ruleset);
  if (!spell) {
    return "F-2";
  }

  return spell.drain;
}

/**
 * Get drain formula for a specific ritual
 */
function getRitualDrainFormula(_input: DrainCalculationInput, _ruleset: LoadedRuleset): string {
  // TODO: Look up ritual drain from ruleset
  // For now, use default ritual drain
  return "F";
}

/**
 * Get mentor spirit drain modifier
 */
function getMentorSpiritModifier(
  _character: Partial<Character>,
  _input: DrainCalculationInput
): number {
  // TODO: Implement mentor spirit bonuses/penalties
  // e.g., Cat gives bonus to Illusion drain, penalty to Combat
  // For now, return 0
  return 0;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get attribute value from character
 */
function getAttributeValue(character: Partial<Character>, attrCode: string): number | undefined {
  const normalizedCode = attrCode.toLowerCase();

  // Check regular attributes first
  if (character.attributes) {
    // Map attribute codes to attribute names
    const attrMap: Record<string, string> = {
      bod: "body",
      body: "body",
      agi: "agility",
      agility: "agility",
      rea: "reaction",
      reaction: "reaction",
      str: "strength",
      strength: "strength",
      wil: "willpower",
      willpower: "willpower",
      log: "logic",
      logic: "logic",
      int: "intuition",
      intuition: "intuition",
      cha: "charisma",
      charisma: "charisma",
    };

    const attrName = attrMap[normalizedCode];
    if (attrName && character.attributes[attrName] !== undefined) {
      return character.attributes[attrName];
    }
  }

  // Check special attributes
  if (character.specialAttributes) {
    if (normalizedCode === "edg" || normalizedCode === "edge") {
      return character.specialAttributes.edge;
    }
    if (normalizedCode === "ess" || normalizedCode === "essence") {
      return character.specialAttributes.essence;
    }
    if (normalizedCode === "mag" || normalizedCode === "magic") {
      return character.specialAttributes.magic;
    }
    if (normalizedCode === "res" || normalizedCode === "resonance") {
      return character.specialAttributes.resonance;
    }
  }

  return undefined;
}

// =============================================================================
// BATCH CALCULATIONS (for previewing multiple spells)
// =============================================================================

/**
 * Calculate drain preview for multiple spells at once
 * Useful for spell selection UI
 */
export function calculateDrainPreview(
  character: Partial<Character>,
  spellIds: string[],
  force: number,
  ruleset: LoadedRuleset
): Map<string, DrainResult> {
  const results = new Map<string, DrainResult>();

  for (const spellId of spellIds) {
    const result = calculateDrain(
      character,
      {
        action: "spellcasting",
        force,
        spellId,
      },
      ruleset
    );
    results.set(spellId, result);
  }

  return results;
}

/**
 * Get a human-readable drain summary
 */
export function formatDrainSummary(result: DrainResult): string {
  const typeLabel = result.drainType === "physical" ? "Physical" : "Stun";
  return `${result.drainValue} ${typeLabel} (resist with ${result.resistancePool} dice)`;
}
