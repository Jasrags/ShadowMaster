/**
 * Dice Engine for Action Resolution
 *
 * Core dice rolling logic with hit/glitch calculation,
 * sorting for display, and statistical analysis.
 */

import type { DiceResult, EditionDiceRules } from "@/lib/types";

// =============================================================================
// DEFAULT RULES (SR5)
// =============================================================================

/**
 * Default SR5 dice rules for when edition rules are not available
 */
export const DEFAULT_DICE_RULES: EditionDiceRules = {
  hitThreshold: 5,
  glitchThreshold: 0.5,
  criticalGlitchRequiresZeroHits: true,
  allowExplodingSixes: false,
  maxDicePool: 50,
  minDicePool: 1,
  edgeActions: {
    "push-the-limit": {
      name: "Push the Limit",
      description: "Add Edge to your dice pool, roll, and any 6s explode.",
      cost: 1,
      preRoll: true,
      postRoll: false,
      addsDice: true,
      explodingSixes: true,
    },
    "second-chance": {
      name: "Second Chance",
      description: "Reroll all dice that did not score a hit. Keep your original hits.",
      cost: 1,
      preRoll: false,
      postRoll: true,
      allowsReroll: true,
    },
    "seize-the-initiative": {
      name: "Seize the Initiative",
      description: "Go first in an Initiative Pass.",
      cost: 1,
      preRoll: false,
      postRoll: false,
    },
    blitz: {
      name: "Blitz",
      description: "Roll 5d6 for Initiative.",
      cost: 1,
      preRoll: true,
      postRoll: false,
      addsDice: true,
    },
    "close-call": {
      name: "Close Call",
      description: "Negate a glitch or critical glitch.",
      cost: 1,
      preRoll: false,
      postRoll: true,
    },
    "dead-mans-trigger": {
      name: "Dead Man's Trigger",
      description: "Act when incapacitated.",
      cost: 1,
      preRoll: false,
      postRoll: false,
    },
  },
  woundModifiers: {
    boxesPerPenalty: 3,
    maxPenalty: -4,
  },
};

// =============================================================================
// DICE ROLLING
// =============================================================================

/**
 * Roll a single d6 using cryptographically secure random if available
 */
export function rollD6(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint8Array(1);
    crypto.getRandomValues(array);
    return (array[0] % 6) + 1;
  }
  // Fallback for environments without crypto
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Roll multiple d6 and return individual results
 */
export function rollDice(
  poolSize: number,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): DiceResult[] {
  const effectivePoolSize = Math.max(
    rules.minDicePool ?? 1,
    Math.min(rules.maxDicePool ?? 50, poolSize)
  );

  const dice: DiceResult[] = [];

  for (let i = 0; i < effectivePoolSize; i++) {
    const value = rollD6();
    dice.push({
      value,
      isHit: value >= rules.hitThreshold,
      isOne: value === 1,
    });
  }

  return dice;
}

/**
 * Roll dice with exploding sixes (for Push the Limit)
 * Sixes add an additional die that can also explode
 */
export function rollDiceExploding(
  poolSize: number,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): DiceResult[] {
  const dice: DiceResult[] = [];
  let diceToRoll = Math.max(rules.minDicePool ?? 1, Math.min(rules.maxDicePool ?? 50, poolSize));

  // Maximum explosions to prevent infinite loops (rare but possible)
  const maxExplosions = 100;
  let explosions = 0;

  while (diceToRoll > 0 && explosions < maxExplosions) {
    let newSixes = 0;

    for (let i = 0; i < diceToRoll; i++) {
      const value = rollD6();
      const isHit = value >= rules.hitThreshold;
      const isSix = value === 6;

      dice.push({
        value,
        isHit,
        isOne: value === 1,
      });

      if (isSix && rules.allowExplodingSixes) {
        newSixes++;
      }
    }

    diceToRoll = newSixes;
    explosions += newSixes;
  }

  return dice;
}

// =============================================================================
// HIT CALCULATION
// =============================================================================

/**
 * Count hits in a dice pool
 */
export function calculateHits(dice: DiceResult[], hitThreshold: number = 5): number {
  return dice.filter((d) => d.value >= hitThreshold).length;
}

/**
 * Count hits with a limit applied
 */
export function calculateHitsWithLimit(
  dice: DiceResult[],
  hitThreshold: number = 5,
  limit?: number
): { hits: number; rawHits: number; limitApplied: boolean } {
  const rawHits = calculateHits(dice, hitThreshold);

  if (limit !== undefined && limit > 0 && rawHits > limit) {
    return {
      hits: limit,
      rawHits,
      limitApplied: true,
    };
  }

  return {
    hits: rawHits,
    rawHits,
    limitApplied: false,
  };
}

// =============================================================================
// GLITCH CALCULATION
// =============================================================================

/**
 * Result of glitch calculation
 */
export interface GlitchResult {
  isGlitch: boolean;
  isCriticalGlitch: boolean;
  ones: number;
  glitchThresholdValue: number;
}

/**
 * Calculate glitch status for a dice pool
 *
 * A glitch occurs when more than half the dice show 1s.
 * A critical glitch is a glitch with zero hits.
 */
export function calculateGlitch(
  dice: DiceResult[],
  hits: number,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): GlitchResult {
  const ones = dice.filter((d) => d.isOne).length;
  const glitchThresholdValue = Math.floor(dice.length * rules.glitchThreshold);

  // Glitch: more than half are 1s (strictly greater than)
  const isGlitch = ones > glitchThresholdValue;

  // Critical glitch: glitch AND zero hits
  const isCriticalGlitch = isGlitch && (rules.criticalGlitchRequiresZeroHits ? hits === 0 : true);

  return {
    isGlitch,
    isCriticalGlitch,
    ones,
    glitchThresholdValue,
  };
}

// =============================================================================
// DICE SORTING FOR DISPLAY
// =============================================================================

/**
 * Sort dice for display: hits first, then by value descending, ones last
 */
export function sortDiceForDisplay(dice: DiceResult[]): DiceResult[] {
  return [...dice].sort((a, b) => {
    // Hits first
    if (a.isHit && !b.isHit) return -1;
    if (!a.isHit && b.isHit) return 1;

    // Ones last
    if (a.isOne && !b.isOne) return 1;
    if (!a.isOne && b.isOne) return -1;

    // Otherwise by value descending
    return b.value - a.value;
  });
}

// =============================================================================
// REROLL LOGIC
// =============================================================================

/**
 * Reroll non-hits while preserving hits (Second Chance)
 */
export function rerollNonHits(
  originalDice: DiceResult[],
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): DiceResult[] {
  return originalDice.map((die) => {
    if (die.isHit) {
      // Keep hits, mark as not rerolled
      return die;
    }

    // Reroll non-hits
    const value = rollD6();
    return {
      value,
      isHit: value >= rules.hitThreshold,
      isOne: value === 1,
      wasRerolled: true,
      originalValue: die.value,
    };
  });
}

// =============================================================================
// FULL ROLL EXECUTION
// =============================================================================

/**
 * Complete result of a dice roll
 */
export interface RollExecutionResult {
  dice: DiceResult[];
  hits: number;
  rawHits: number;
  ones: number;
  isGlitch: boolean;
  isCriticalGlitch: boolean;
  limitApplied: boolean;
  poolSize: number;
}

/**
 * Execute a complete dice roll with all calculations
 */
export function executeRoll(
  poolSize: number,
  rules: EditionDiceRules = DEFAULT_DICE_RULES,
  options: {
    explodingSixes?: boolean;
    limit?: number;
  } = {}
): RollExecutionResult {
  // Roll dice
  const dice = options.explodingSixes
    ? rollDiceExploding(poolSize, rules)
    : rollDice(poolSize, rules);

  // Calculate hits
  const { hits, rawHits, limitApplied } = calculateHitsWithLimit(
    dice,
    rules.hitThreshold,
    options.limit
  );

  // Calculate glitch
  const glitchResult = calculateGlitch(dice, hits, rules);

  // Sort for display
  const sortedDice = sortDiceForDisplay(dice);

  return {
    dice: sortedDice,
    hits,
    rawHits,
    ones: glitchResult.ones,
    isGlitch: glitchResult.isGlitch,
    isCriticalGlitch: glitchResult.isCriticalGlitch,
    limitApplied,
    poolSize: dice.length,
  };
}

/**
 * Execute a reroll (Second Chance) on an existing result
 */
export function executeReroll(
  originalDice: DiceResult[],
  rules: EditionDiceRules = DEFAULT_DICE_RULES,
  limit?: number
): RollExecutionResult {
  // Reroll non-hits
  const dice = rerollNonHits(originalDice, rules);

  // Calculate hits
  const { hits, rawHits, limitApplied } = calculateHitsWithLimit(dice, rules.hitThreshold, limit);

  // Calculate glitch (on new dice, not original)
  const glitchResult = calculateGlitch(dice, hits, rules);

  // Sort for display
  const sortedDice = sortDiceForDisplay(dice);

  return {
    dice: sortedDice,
    hits,
    rawHits,
    ones: glitchResult.ones,
    isGlitch: glitchResult.isGlitch,
    isCriticalGlitch: glitchResult.isCriticalGlitch,
    limitApplied,
    poolSize: dice.length,
  };
}

// =============================================================================
// STATISTICS
// =============================================================================

/**
 * Calculate expected hits for a given pool size
 */
export function expectedHits(poolSize: number, hitThreshold: number = 5): number {
  // For d6, hits on 5-6 = 2/6 = 1/3 probability
  const hitProbability = (7 - hitThreshold) / 6;
  return poolSize * hitProbability;
}

/**
 * Calculate probability of glitching for a given pool size
 */
export function glitchProbability(poolSize: number, glitchThreshold: number = 0.5): number {
  // Probability of rolling a 1 on d6 = 1/6
  const oneProbability = 1 / 6;
  const threshold = Math.floor(poolSize * glitchThreshold);

  // Sum probability of getting more than threshold 1s
  // This is a binomial distribution calculation
  let probability = 0;
  for (let k = threshold + 1; k <= poolSize; k++) {
    probability += binomialProbability(poolSize, k, oneProbability);
  }

  return probability;
}

/**
 * Calculate binomial probability P(X = k) for n trials with probability p
 */
function binomialProbability(n: number, k: number, p: number): number {
  return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/**
 * Calculate binomial coefficient "n choose k"
 */
function binomialCoefficient(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;

  let result = 1;
  for (let i = 0; i < k; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return result;
}
