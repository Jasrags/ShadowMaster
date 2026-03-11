/**
 * Point Buy Validation
 *
 * Validates the Point Buy (Karma-based) character creation method from Run Faster.
 * Characters start with 800 Karma and purchase everything using advancement costs.
 *
 * Key rules:
 * - 800 Karma starting budget
 * - Metatype costs deducted from budget (Human: 0, Elf: 40, Dwarf: 50, Ork: 50, Troll: 90)
 * - Gear: 1 Karma per 2,000 nuyen, max 200 Karma on gear
 * - Only 1 Physical or Mental attribute at natural max (special attributes exempt)
 * - Leftover Karma cannot be carried over; max 5,000¥ leftover nuyen
 */

import type { CreationConstraint, CreationState, ValidationError } from "../types";
import type { ValidationContext } from "./constraint-validation";

/** Default starting Karma for Point Buy creation */
export const POINT_BUY_KARMA_BUDGET = 800;

/** Maximum Karma that can be spent on gear (converted to nuyen) */
export const POINT_BUY_MAX_GEAR_KARMA = 200;

/** Nuyen per 1 Karma when converting to gear */
export const POINT_BUY_NUYEN_PER_KARMA = 2000;

/** Maximum leftover nuyen at end of creation */
export const POINT_BUY_MAX_LEFTOVER_NUYEN = 5000;

/**
 * Metatype Karma costs for Point Buy creation (Run Faster p. 64)
 */
export const POINT_BUY_METATYPE_COSTS: Readonly<Record<string, number>> = {
  human: 0,
  elf: 40,
  dwarf: 50,
  ork: 50,
  troll: 90,
};

/**
 * Magic/Resonance quality Karma costs for Point Buy creation (Run Faster p. 65)
 */
export const POINT_BUY_MAGIC_QUALITY_COSTS: Readonly<Record<string, number>> = {
  adept: 20,
  "aspected-magician": 15,
  magician: 30,
  "mystic-adept": 35,
  technomancer: 15,
};

/**
 * Point Buy budget constraint parameters (from JSON data)
 */
interface PointBuyBudgetParams {
  readonly totalBudget?: number;
  readonly maxGearKarma?: number;
  readonly nuyenPerKarma?: number;
  readonly maxLeftoverNuyen?: number;
  readonly metatypeCosts?: Readonly<Record<string, number>>;
  readonly magicQualityCosts?: Readonly<Record<string, number>>;
}

/**
 * Karma spending data extracted from creation state budgets.
 * Each field represents karma spent in a category, tracked via creationState.budgets.
 */
export interface PointBuyKarmaData {
  readonly metatypeId?: string;
  readonly magicalPath?: string;
  readonly attributeKarma?: number;
  readonly skillKarma?: number;
  readonly qualityKarma?: number;
  readonly contactKarma?: number;
  readonly gearKarma?: number;
  readonly spellKarma?: number;
  readonly powerPointKarma?: number;
}

/**
 * Extract Point Buy karma data from CreationState budgets.
 */
function extractKarmaData(creationState: CreationState): PointBuyKarmaData {
  const { budgets, selections } = creationState;
  return {
    metatypeId: selections?.metatypeId as string | undefined,
    magicalPath: selections?.magicalPath as string | undefined,
    attributeKarma: budgets["point-buy-attributes"],
    skillKarma: budgets["point-buy-skills"],
    qualityKarma: budgets["point-buy-qualities"],
    contactKarma: budgets["point-buy-contacts"],
    gearKarma: budgets["point-buy-gear"],
    spellKarma: budgets["point-buy-spells"],
    powerPointKarma: budgets["point-buy-power-points"],
  };
}

/**
 * Validate the Point Buy karma budget.
 *
 * Checks that:
 * 1. Total karma spent does not exceed the budget (800)
 * 2. Gear karma spending does not exceed the cap (200)
 *
 * @param constraint - The constraint definition from the creation method
 * @param context - Validation context containing creation state
 * @returns ValidationError if invalid, null if valid
 */
export function validatePointBuyBudget(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { creationState } = context;

  // No state yet — skip (will be caught by required-selection constraints)
  if (!creationState) {
    return null;
  }

  const params = constraint.params as PointBuyBudgetParams;
  const totalBudget = params.totalBudget ?? POINT_BUY_KARMA_BUDGET;
  const maxGearKarma = params.maxGearKarma ?? POINT_BUY_MAX_GEAR_KARMA;

  const karmaData = extractKarmaData(creationState);

  // Calculate total karma spent
  const karmaSpent = calculatePointBuyKarmaSpent(karmaData, params);

  // Validate total budget
  if (karmaSpent > totalBudget) {
    return {
      constraintId: constraint.id,
      field: "karma-budget",
      message:
        constraint.errorMessage ||
        `Karma budget exceeded: spent ${karmaSpent} of ${totalBudget} Karma.`,
      severity: constraint.severity,
    };
  }

  // Validate gear karma cap
  const gearKarma = calculateGearKarmaSpent(karmaData);
  if (gearKarma > maxGearKarma) {
    return {
      constraintId: constraint.id,
      field: "gear-karma",
      message: `Gear karma cap exceeded: spent ${gearKarma} of ${maxGearKarma} maximum Karma on gear.`,
      severity: constraint.severity,
    };
  }

  return null;
}

/**
 * Calculate total Karma spent during Point Buy creation.
 *
 * Includes: metatype cost, attributes, skills, qualities, magic/resonance qualities,
 * contacts, gear (karma-to-nuyen), spells, power points.
 */
export function calculatePointBuyKarmaSpent(
  data: PointBuyKarmaData,
  params?: PointBuyBudgetParams
): number {
  const metatypeCosts = params?.metatypeCosts ?? POINT_BUY_METATYPE_COSTS;
  const magicQualityCosts = params?.magicQualityCosts ?? POINT_BUY_MAGIC_QUALITY_COSTS;

  let total = 0;

  // Metatype cost
  if (data.metatypeId) {
    total += metatypeCosts[data.metatypeId] ?? 0;
  }

  // Magic/Resonance quality cost
  if (data.magicalPath) {
    total += magicQualityCosts[data.magicalPath] ?? 0;
  }

  // Sum all numeric karma categories
  if (typeof data.attributeKarma === "number") total += data.attributeKarma;
  if (typeof data.skillKarma === "number") total += data.skillKarma;
  if (typeof data.qualityKarma === "number") total += data.qualityKarma;
  if (typeof data.contactKarma === "number") total += data.contactKarma;
  if (typeof data.spellKarma === "number") total += data.spellKarma;
  if (typeof data.powerPointKarma === "number") total += data.powerPointKarma;

  // Gear karma (karma-to-nuyen conversion)
  total += calculateGearKarmaSpent(data);

  return total;
}

/**
 * Calculate Karma spent on gear (nuyen conversion).
 * 1 Karma = 2,000¥ (configurable via params).
 */
export function calculateGearKarmaSpent(data: PointBuyKarmaData): number {
  return typeof data.gearKarma === "number" ? data.gearKarma : 0;
}

/**
 * Calculate the total Karma cost for a metatype.
 *
 * @param metatypeId - The metatype identifier (e.g., "human", "elf")
 * @param metatypeCosts - Optional override for metatype cost table
 * @returns Karma cost, or null if metatype is unknown
 */
export function getMetatypeKarmaCost(
  metatypeId: string,
  metatypeCosts: Readonly<Record<string, number>> = POINT_BUY_METATYPE_COSTS
): number | null {
  const cost = metatypeCosts[metatypeId];
  return cost !== undefined ? cost : null;
}

/**
 * Calculate the cumulative Karma cost to raise an attribute from a base rating
 * to a target rating using advancement costs (New Rating × multiplier).
 *
 * @param baseRating - Starting rating (metatype minimum)
 * @param targetRating - Desired rating
 * @param multiplier - Cost multiplier (default 5 for attributes)
 * @returns Total karma cost for all increases
 */
export function calculateAttributeAdvancementCost(
  baseRating: number,
  targetRating: number,
  multiplier: number = 5
): number {
  if (targetRating <= baseRating) return 0;
  let cost = 0;
  for (let rating = baseRating + 1; rating <= targetRating; rating++) {
    cost += rating * multiplier;
  }
  return cost;
}

/**
 * Calculate the cumulative Karma cost to raise a skill from 0 to a target rating
 * using advancement costs (New Rating × multiplier).
 *
 * @param targetRating - Desired skill rating
 * @param multiplier - Cost multiplier (default 2 for active skills)
 * @returns Total karma cost for all increases
 */
export function calculateSkillAdvancementCost(
  targetRating: number,
  multiplier: number = 2
): number {
  if (targetRating <= 0) return 0;
  let cost = 0;
  for (let rating = 1; rating <= targetRating; rating++) {
    cost += rating * multiplier;
  }
  return cost;
}
