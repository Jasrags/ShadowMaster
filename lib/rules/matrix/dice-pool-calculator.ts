/**
 * Matrix Dice Pool Calculator
 *
 * Calculates dice pools for matrix actions using:
 * - Character skills (Hacking, Computer, Hardware, etc.)
 * - Character mental attributes (Logic, Intuition, Willpower)
 * - Cyberdeck ASDF configuration for limits
 * - Program bonuses
 * - Situational modifiers (noise, running silent, etc.)
 *
 * Integrates with the existing action resolution pool builder.
 */

import type { Character, PoolModifier, ActionPool } from "@/lib/types";
import type {
  MatrixState,
  MatrixAction,
  CyberdeckAttributeConfig,
  LoadedProgram,
} from "@/lib/types/matrix";
import type { LoadedRuleset, ProgramCatalogItemData } from "../loader-types";
import {
  buildActionPool,
  getSkillRating,
  getAttributeValue,
  addModifiersToPool,
  applyLimitToPool,
} from "../action-resolution/pool-builder";
import { DEFAULT_DICE_RULES } from "../action-resolution/dice-engine";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Breakdown of a dice pool component for display
 */
export interface DicePoolComponent {
  /** Label for this component */
  source: string;
  /** Attribute name if applicable */
  attribute?: string;
  /** Skill name if applicable */
  skill?: string;
  /** Program name if applicable */
  program?: string;
  /** Situational modifier description */
  situation?: string;
  /** Dice/modifier value */
  value: number;
}

/**
 * Complete result of matrix dice pool calculation
 */
export interface MatrixDicePoolResult {
  /** Final action pool ready for rolling */
  pool: ActionPool;
  /** Human-readable formula */
  formula: string;
  /** Detailed breakdown of pool components */
  breakdown: DicePoolComponent[];
  /** The limit value for this action */
  limit: number;
  /** Which ASDF attribute is the limit */
  limitType: "attack" | "sleaze" | "dataProcessing" | "firewall";
  /** Description of the limit source */
  limitSource: string;
}

// =============================================================================
// LIMIT CALCULATION
// =============================================================================

/**
 * Get ASDF attribute value from matrix state
 *
 * @param matrixState - Current matrix state
 * @param attribute - The ASDF attribute to get
 * @returns Attribute value
 */
export function getPersonaAttribute(
  matrixState: MatrixState,
  attribute: "attack" | "sleaze" | "dataProcessing" | "firewall"
): number {
  const persona = matrixState.persona;

  switch (attribute) {
    case "attack":
      return persona.attack;
    case "sleaze":
      return persona.sleaze;
    case "dataProcessing":
      return persona.dataProcessing;
    case "firewall":
      return persona.firewall;
  }
}

/**
 * Calculate the matrix limit for an action
 *
 * The limit depends on the action's limit attribute (ASDF).
 *
 * @param action - The matrix action
 * @param matrixState - Current matrix state
 * @returns Limit value
 */
export function calculateMatrixLimit(action: MatrixAction, matrixState: MatrixState): number {
  return getPersonaAttribute(matrixState, action.limitAttribute);
}

/**
 * Get human-readable name for ASDF attribute
 *
 * @param attribute - The ASDF attribute
 * @returns Display name
 */
function getASFDDisplayName(
  attribute: "attack" | "sleaze" | "dataProcessing" | "firewall"
): string {
  switch (attribute) {
    case "attack":
      return "Attack";
    case "sleaze":
      return "Sleaze";
    case "dataProcessing":
      return "Data Processing";
    case "firewall":
      return "Firewall";
  }
}

// =============================================================================
// PROGRAM BONUSES
// =============================================================================

/**
 * Calculate bonus from loaded programs
 *
 * Some programs provide flat bonuses to specific actions.
 *
 * @param action - The matrix action
 * @param matrixState - Current matrix state
 * @param ruleset - Loaded ruleset for program data
 * @returns Pool modifier from programs
 */
export function calculateProgramBonus(
  action: MatrixAction,
  matrixState: MatrixState,
  ruleset?: LoadedRuleset
): PoolModifier | null {
  const relevantPrograms = action.relevantPrograms ?? [];
  if (relevantPrograms.length === 0) {
    return null;
  }

  let totalBonus = 0;
  const programNames: string[] = [];

  for (const loadedProgram of matrixState.loadedPrograms) {
    if (!loadedProgram.isRunning) continue;

    // Check if this program is relevant to the action
    const isRelevant = relevantPrograms.some(
      (id) => id === loadedProgram.catalogId || id === loadedProgram.programId
    );

    if (isRelevant) {
      // Most programs give +2 to relevant actions in SR5
      // Agent programs give bonus equal to rating
      let bonus = 2;
      if (loadedProgram.category === "agent" && loadedProgram.rating) {
        bonus = loadedProgram.rating;
      }

      totalBonus += bonus;
      programNames.push(loadedProgram.name);
    }
  }

  if (totalBonus === 0) {
    return null;
  }

  return {
    source: "equipment",
    value: totalBonus,
    description: `Programs: ${programNames.join(", ")}`,
  };
}

// =============================================================================
// SITUATIONAL MODIFIERS
// =============================================================================

/**
 * Calculate noise penalty
 *
 * Noise reduces dice pools for matrix actions.
 * Sources include distance, spam zones, and static.
 *
 * @param noiseRating - Current noise level
 * @returns Pool modifier for noise (negative)
 */
export function calculateNoiseModifier(noiseRating: number): PoolModifier | null {
  if (noiseRating <= 0) {
    return null;
  }

  return {
    source: "environmental",
    value: -noiseRating,
    description: `Noise (${noiseRating})`,
  };
}

/**
 * Calculate modifier for running silent
 *
 * Running silent imposes a -2 penalty on all matrix actions.
 *
 * @param isRunningSilent - Whether character is running silent
 * @returns Pool modifier for running silent
 */
export function calculateRunningSilentModifier(isRunningSilent: boolean): PoolModifier | null {
  if (!isRunningSilent) {
    return null;
  }

  return {
    source: "situational",
    value: -2,
    description: "Running Silent",
  };
}

/**
 * Calculate modifier for hot-sim VR
 *
 * Hot-sim VR provides a +2 bonus to matrix actions.
 *
 * @param matrixState - Current matrix state
 * @returns Pool modifier for hot-sim
 */
export function calculateHotSimBonus(matrixState: MatrixState): PoolModifier | null {
  if (matrixState.connectionMode !== "hot-sim-vr") {
    return null;
  }

  return {
    source: "situational",
    value: 2,
    description: "Hot-Sim VR",
  };
}

// =============================================================================
// MAIN POOL CALCULATOR
// =============================================================================

/**
 * Calculate dice pool for a matrix action
 *
 * Combines character skill, attribute, persona config, programs,
 * and situational modifiers into a complete action pool.
 *
 * @param character - The character performing the action
 * @param matrixState - Current matrix state
 * @param action - The matrix action
 * @param options - Additional options (noise, running silent, etc.)
 * @param ruleset - Loaded ruleset for program data
 * @returns Complete dice pool result
 */
export function calculateMatrixDicePool(
  character: Character,
  matrixState: MatrixState,
  action: MatrixAction,
  options: {
    noiseRating?: number;
    isRunningSilent?: boolean;
    additionalModifiers?: PoolModifier[];
  } = {},
  ruleset?: LoadedRuleset
): MatrixDicePoolResult {
  const breakdown: DicePoolComponent[] = [];

  // Get attribute value
  const attributeValue = getAttributeValue(character, action.attribute);
  breakdown.push({
    source: "Attribute",
    attribute: action.attribute,
    value: attributeValue,
  });

  // Get skill value
  const skillRating = getSkillRating(character, action.skill);
  breakdown.push({
    source: "Skill",
    skill: action.skill,
    value: skillRating,
  });

  // Build base pool
  let pool = buildActionPool(
    character,
    {
      attribute: action.attribute,
      skill: action.skill,
    },
    DEFAULT_DICE_RULES
  );

  // Add program bonuses
  const programBonus = calculateProgramBonus(action, matrixState, ruleset);
  if (programBonus) {
    pool = addModifiersToPool(pool, programBonus);
    breakdown.push({
      source: "Programs",
      program: programBonus.description.replace("Programs: ", ""),
      value: programBonus.value,
    });
  }

  // Add hot-sim bonus
  const hotSimBonus = calculateHotSimBonus(matrixState);
  if (hotSimBonus) {
    pool = addModifiersToPool(pool, hotSimBonus);
    breakdown.push({
      source: "Hot-Sim VR",
      situation: "Connection mode bonus",
      value: hotSimBonus.value,
    });
  }

  // Add noise penalty
  if (options.noiseRating && options.noiseRating > 0) {
    const noiseMod = calculateNoiseModifier(options.noiseRating);
    if (noiseMod) {
      pool = addModifiersToPool(pool, noiseMod);
      breakdown.push({
        source: "Noise",
        situation: `Noise rating ${options.noiseRating}`,
        value: noiseMod.value,
      });
    }
  }

  // Add running silent penalty
  if (options.isRunningSilent) {
    const silentMod = calculateRunningSilentModifier(true);
    if (silentMod) {
      pool = addModifiersToPool(pool, silentMod);
      breakdown.push({
        source: "Running Silent",
        situation: "Stealth mode active",
        value: silentMod.value,
      });
    }
  }

  // Add any additional modifiers
  if (options.additionalModifiers) {
    pool = addModifiersToPool(pool, ...options.additionalModifiers);
    for (const mod of options.additionalModifiers) {
      breakdown.push({
        source: mod.source,
        situation: mod.description,
        value: mod.value,
      });
    }
  }

  // Calculate limit from ASDF
  const limit = calculateMatrixLimit(action, matrixState);
  const limitType = action.limitAttribute;
  const limitSource = getASFDDisplayName(limitType);

  pool = applyLimitToPool(pool, limit, limitSource);

  // Build formula string
  const formulaParts: string[] = [];
  formulaParts.push(`${action.attribute} (${attributeValue})`);
  formulaParts.push(`${action.skill} (${skillRating})`);

  for (const mod of pool.modifiers) {
    if (mod.value !== 0) {
      const sign = mod.value > 0 ? "+" : "";
      formulaParts.push(`${sign}${mod.value} (${mod.description})`);
    }
  }

  const formula = formulaParts.join(" + ");

  return {
    pool,
    formula,
    breakdown,
    limit,
    limitType,
    limitSource,
  };
}

// =============================================================================
// SPECIALIZED POOL BUILDERS
// =============================================================================

/**
 * Build pool for Hack on the Fly (Sleaze-based)
 */
export function buildHackOnTheFlyPool(
  character: Character,
  matrixState: MatrixState,
  options: {
    noiseRating?: number;
    isRunningSilent?: boolean;
  } = {}
): MatrixDicePoolResult {
  const action: MatrixAction = {
    id: "hack-on-the-fly",
    name: "Hack on the Fly",
    category: "sleaze",
    legality: "illegal",
    marksRequired: 0,
    limitAttribute: "sleaze",
    skill: "hacking",
    attribute: "logic",
  };

  return calculateMatrixDicePool(character, matrixState, action, options);
}

/**
 * Build pool for Brute Force (Attack-based)
 */
export function buildBruteForcePool(
  character: Character,
  matrixState: MatrixState,
  options: {
    noiseRating?: number;
    isRunningSilent?: boolean;
  } = {}
): MatrixDicePoolResult {
  const action: MatrixAction = {
    id: "brute-force",
    name: "Brute Force",
    category: "attack",
    legality: "illegal",
    marksRequired: 0,
    limitAttribute: "attack",
    skill: "cybercombat",
    attribute: "logic",
  };

  return calculateMatrixDicePool(character, matrixState, action, options);
}

/**
 * Build pool for Matrix Perception
 */
export function buildMatrixPerceptionPool(
  character: Character,
  matrixState: MatrixState,
  options: {
    noiseRating?: number;
  } = {}
): MatrixDicePoolResult {
  const action: MatrixAction = {
    id: "matrix-perception",
    name: "Matrix Perception",
    category: "persona",
    legality: "legal",
    marksRequired: 0,
    limitAttribute: "dataProcessing",
    skill: "computer",
    attribute: "intuition",
  };

  return calculateMatrixDicePool(character, matrixState, action, options);
}

/**
 * Build pool for Data Spike (Matrix combat attack)
 */
export function buildDataSpikePool(
  character: Character,
  matrixState: MatrixState,
  options: {
    noiseRating?: number;
    isRunningSilent?: boolean;
  } = {}
): MatrixDicePoolResult {
  const action: MatrixAction = {
    id: "data-spike",
    name: "Data Spike",
    category: "attack",
    legality: "illegal",
    marksRequired: 0,
    limitAttribute: "attack",
    skill: "cybercombat",
    attribute: "logic",
  };

  return calculateMatrixDicePool(character, matrixState, action, options);
}

/**
 * Build pool for Edit File
 */
export function buildEditFilePool(
  character: Character,
  matrixState: MatrixState,
  options: {
    noiseRating?: number;
  } = {}
): MatrixDicePoolResult {
  const action: MatrixAction = {
    id: "edit-file",
    name: "Edit File",
    category: "file",
    legality: "legal",
    marksRequired: 1,
    limitAttribute: "dataProcessing",
    skill: "computer",
    attribute: "logic",
  };

  return calculateMatrixDicePool(character, matrixState, action, options);
}

/**
 * Build pool for Snoop (intercept traffic)
 */
export function buildSnoopPool(
  character: Character,
  matrixState: MatrixState,
  options: {
    noiseRating?: number;
    isRunningSilent?: boolean;
  } = {}
): MatrixDicePoolResult {
  const action: MatrixAction = {
    id: "snoop",
    name: "Snoop",
    category: "sleaze",
    legality: "illegal",
    marksRequired: 1,
    limitAttribute: "sleaze",
    skill: "electronic-warfare",
    attribute: "intuition",
  };

  return calculateMatrixDicePool(character, matrixState, action, options);
}

// =============================================================================
// DEFENSE POOLS
// =============================================================================

/**
 * Build matrix defense pool
 *
 * Matrix defense uses Willpower + Firewall in SR5.
 *
 * @param character - The defending character
 * @param matrixState - Current matrix state
 * @returns Defense dice pool
 */
export function buildMatrixDefensePool(character: Character, matrixState: MatrixState): ActionPool {
  const willpower = getAttributeValue(character, "willpower");
  const firewall = getPersonaAttribute(matrixState, "firewall");

  const pool = buildActionPool(
    character,
    {
      manualPool: willpower + firewall,
    },
    DEFAULT_DICE_RULES
  );

  // Add wound modifiers
  pool.attribute = "willpower";

  return pool;
}

/**
 * Build matrix damage resistance pool
 *
 * Uses Willpower + Firewall (or Device Rating for devices).
 *
 * @param character - The defending character
 * @param matrixState - Current matrix state
 * @param isDevice - Whether defending a device (uses Device Rating instead)
 * @returns Resistance dice pool
 */
export function buildMatrixResistancePool(
  character: Character,
  matrixState: MatrixState,
  isDevice: boolean = false
): ActionPool {
  if (isDevice) {
    // Device resistance uses Device Rating x2
    const deviceRating = matrixState.persona.deviceRating;
    return buildActionPool(
      character,
      {
        manualPool: deviceRating * 2,
        includeWoundModifiers: false,
      },
      DEFAULT_DICE_RULES
    );
  }

  // Persona resistance uses Willpower + Firewall
  return buildMatrixDefensePool(character, matrixState);
}
