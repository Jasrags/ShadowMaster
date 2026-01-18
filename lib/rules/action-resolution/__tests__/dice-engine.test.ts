/**
 * Unit tests for dice-engine.ts
 *
 * Tests the core dice rolling mechanics including hit calculation,
 * glitch detection, exploding dice, and rerolls.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { DiceResult, EditionDiceRules } from "@/lib/types";
import {
  DEFAULT_DICE_RULES,
  rollD6,
  rollDice,
  rollDiceExploding,
  calculateHits,
  calculateHitsWithLimit,
  calculateGlitch,
  sortDiceForDisplay,
  rerollNonHits,
  executeRoll,
  executeReroll,
  expectedHits,
  glitchProbability,
} from "../dice-engine";

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Create a mock DiceResult array from values
 */
function makeDice(values: number[], hitThreshold = 5): DiceResult[] {
  return values.map((value) => ({
    value,
    isHit: value >= hitThreshold,
    isOne: value === 1,
  }));
}

/**
 * Mock crypto.getRandomValues to return predictable dice rolls
 */
function mockCrypto(sequence: number[]): void {
  let index = 0;
  const originalCrypto = global.crypto;

  // Create mock crypto
  const mockCryptoObj = {
    getRandomValues: vi.fn((array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        // Convert 1-6 dice value to a byte that will produce that value
        // Since we do (byte % 6) + 1, we need (value - 1) as the byte
        const value = sequence[index % sequence.length];
        array[i] = value - 1;
        index++;
      }
      return array;
    }),
    randomUUID: () => "test-uuid",
    subtle: originalCrypto?.subtle,
  };

  Object.defineProperty(global, "crypto", {
    value: mockCryptoObj,
    writable: true,
    configurable: true,
  });
}

// =============================================================================
// DEFAULT_DICE_RULES TESTS
// =============================================================================

describe("DEFAULT_DICE_RULES", () => {
  it("should have SR5 default hit threshold of 5", () => {
    expect(DEFAULT_DICE_RULES.hitThreshold).toBe(5);
  });

  it("should have glitch threshold of 0.5 (more than half)", () => {
    expect(DEFAULT_DICE_RULES.glitchThreshold).toBe(0.5);
  });

  it("should require zero hits for critical glitch", () => {
    expect(DEFAULT_DICE_RULES.criticalGlitchRequiresZeroHits).toBe(true);
  });

  it("should have exploding sixes disabled by default", () => {
    expect(DEFAULT_DICE_RULES.allowExplodingSixes).toBe(false);
  });

  it("should have all standard Edge actions defined", () => {
    expect(DEFAULT_DICE_RULES.edgeActions).toHaveProperty("push_the_limit");
    expect(DEFAULT_DICE_RULES.edgeActions).toHaveProperty("second_chance");
    expect(DEFAULT_DICE_RULES.edgeActions).toHaveProperty("seize_the_initiative");
    expect(DEFAULT_DICE_RULES.edgeActions).toHaveProperty("blitz");
    expect(DEFAULT_DICE_RULES.edgeActions).toHaveProperty("close_call");
    expect(DEFAULT_DICE_RULES.edgeActions).toHaveProperty("dead_mans_trigger");
  });

  it("should have wound modifier rules", () => {
    expect(DEFAULT_DICE_RULES.woundModifiers?.boxesPerPenalty).toBe(3);
    expect(DEFAULT_DICE_RULES.woundModifiers?.maxPenalty).toBe(-4);
  });
});

// =============================================================================
// rollD6 TESTS
// =============================================================================

describe("rollD6", () => {
  let originalCrypto: Crypto;

  beforeEach(() => {
    originalCrypto = global.crypto;
  });

  afterEach(() => {
    Object.defineProperty(global, "crypto", {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });

  it("should return a value between 1 and 6 with crypto", () => {
    mockCrypto([3]); // Will produce 3
    const result = rollD6();
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  });

  it("should use crypto.getRandomValues when available", () => {
    mockCrypto([5]); // Will produce 5
    const result = rollD6();
    expect(result).toBe(5);
    expect(global.crypto.getRandomValues).toHaveBeenCalled();
  });

  it("should fall back to Math.random when crypto unavailable", () => {
    // Remove crypto temporarily
    Object.defineProperty(global, "crypto", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const mathRandomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);
    const result = rollD6();

    // Math.floor(0.5 * 6) + 1 = 4
    expect(result).toBe(4);
    expect(mathRandomSpy).toHaveBeenCalled();

    mathRandomSpy.mockRestore();
  });

  it("should produce all values 1-6 over multiple rolls", () => {
    mockCrypto([1, 2, 3, 4, 5, 6]);
    const results = new Set<number>();
    for (let i = 0; i < 6; i++) {
      results.add(rollD6());
    }
    expect(results).toEqual(new Set([1, 2, 3, 4, 5, 6]));
  });
});

// =============================================================================
// rollDice TESTS
// =============================================================================

describe("rollDice", () => {
  let originalCrypto: Crypto;

  beforeEach(() => {
    originalCrypto = global.crypto;
  });

  afterEach(() => {
    Object.defineProperty(global, "crypto", {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });

  it("should roll the correct number of dice", () => {
    mockCrypto([1, 2, 3, 4, 5, 6]);
    const result = rollDice(6);
    expect(result).toHaveLength(6);
  });

  it("should mark hits correctly (value >= 5)", () => {
    mockCrypto([1, 2, 3, 4, 5, 6]);
    const result = rollDice(6);

    // 5 and 6 should be hits
    expect(result.filter((d) => d.isHit)).toHaveLength(2);
    expect(result.find((d) => d.value === 5)?.isHit).toBe(true);
    expect(result.find((d) => d.value === 6)?.isHit).toBe(true);
  });

  it("should mark ones correctly", () => {
    mockCrypto([1, 1, 1, 4, 5, 6]);
    const result = rollDice(6);

    expect(result.filter((d) => d.isOne)).toHaveLength(3);
    expect(result.filter((d) => d.value === 1).every((d) => d.isOne)).toBe(true);
  });

  it("should respect maxDicePool limit", () => {
    mockCrypto([5, 5, 5, 5, 5]);
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      maxDicePool: 5,
    };
    const result = rollDice(100, rules);
    expect(result).toHaveLength(5);
  });

  it("should respect minDicePool limit", () => {
    mockCrypto([5]);
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      minDicePool: 1,
    };
    const result = rollDice(-5, rules);
    expect(result).toHaveLength(1);
  });

  it("should handle zero pool size with minDicePool", () => {
    mockCrypto([5]);
    const result = rollDice(0);
    expect(result).toHaveLength(1); // minDicePool default is 1
  });

  it("should use custom hit threshold", () => {
    mockCrypto([3, 3, 3, 3, 3]);
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      hitThreshold: 3, // 3+ hits
    };
    const result = rollDice(5, rules);
    expect(result.every((d) => d.isHit)).toBe(true);
  });
});

// =============================================================================
// rollDiceExploding TESTS
// =============================================================================

describe("rollDiceExploding", () => {
  let originalCrypto: Crypto;

  beforeEach(() => {
    originalCrypto = global.crypto;
  });

  afterEach(() => {
    Object.defineProperty(global, "crypto", {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });

  it("should not explode when allowExplodingSixes is false", () => {
    mockCrypto([6, 6, 6]);
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      allowExplodingSixes: false,
    };
    const result = rollDiceExploding(3, rules);
    expect(result).toHaveLength(3);
  });

  it("should explode sixes when allowExplodingSixes is true", () => {
    // First 3 dice: 6, 6, 5 -> 2 sixes explode
    // Next 2 dice: 6, 4 -> 1 six explodes
    // Next 1 die: 3 -> no explode
    mockCrypto([6, 6, 5, 6, 4, 3]);
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      allowExplodingSixes: true,
    };
    const result = rollDiceExploding(3, rules);
    // 3 initial + 2 from first explode + 1 from second explode = 6
    expect(result).toHaveLength(6);
  });

  it("should chain explosions correctly", () => {
    // Initial: 6 -> explodes to 6 -> explodes to 6 -> explodes to 3
    mockCrypto([6, 6, 6, 3]);
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      allowExplodingSixes: true,
    };
    const result = rollDiceExploding(1, rules);
    expect(result).toHaveLength(4);
  });

  it("should limit explosions to prevent infinite loops", () => {
    // All sixes would cause infinite explosions
    mockCrypto([6]);
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      allowExplodingSixes: true,
    };
    const result = rollDiceExploding(1, rules);
    // Should eventually stop (max 100 explosions)
    expect(result.length).toBeLessThanOrEqual(101);
  });

  it("should respect pool limits", () => {
    mockCrypto([5, 5, 5]);
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      maxDicePool: 3,
    };
    const result = rollDiceExploding(100, rules);
    expect(result).toHaveLength(3);
  });
});

// =============================================================================
// calculateHits TESTS
// =============================================================================

describe("calculateHits", () => {
  it("should count hits with default threshold of 5", () => {
    const dice = makeDice([1, 2, 3, 4, 5, 6]);
    expect(calculateHits(dice)).toBe(2);
  });

  it("should count all as hits when all dice >= threshold", () => {
    const dice = makeDice([5, 5, 6, 6, 5, 6]);
    expect(calculateHits(dice)).toBe(6);
  });

  it("should count zero hits when all dice < threshold", () => {
    const dice = makeDice([1, 2, 3, 4, 1, 2]);
    expect(calculateHits(dice)).toBe(0);
  });

  it("should use custom hit threshold", () => {
    const dice = makeDice([3, 3, 3, 3], 3);
    expect(calculateHits(dice, 3)).toBe(4);
  });

  it("should handle empty dice array", () => {
    expect(calculateHits([])).toBe(0);
  });
});

// =============================================================================
// calculateHitsWithLimit TESTS
// =============================================================================

describe("calculateHitsWithLimit", () => {
  it("should return raw hits when no limit", () => {
    const dice = makeDice([5, 5, 5, 5, 5]);
    const result = calculateHitsWithLimit(dice);

    expect(result.hits).toBe(5);
    expect(result.rawHits).toBe(5);
    expect(result.limitApplied).toBe(false);
  });

  it("should cap hits at limit", () => {
    const dice = makeDice([5, 5, 5, 5, 5]);
    const result = calculateHitsWithLimit(dice, 5, 3);

    expect(result.hits).toBe(3);
    expect(result.rawHits).toBe(5);
    expect(result.limitApplied).toBe(true);
  });

  it("should not apply limit when hits <= limit", () => {
    const dice = makeDice([5, 5, 3, 3, 3]);
    const result = calculateHitsWithLimit(dice, 5, 5);

    expect(result.hits).toBe(2);
    expect(result.rawHits).toBe(2);
    expect(result.limitApplied).toBe(false);
  });

  it("should handle limit of 0 (no cap)", () => {
    const dice = makeDice([5, 5, 5]);
    const result = calculateHitsWithLimit(dice, 5, 0);

    expect(result.hits).toBe(3);
    expect(result.limitApplied).toBe(false);
  });

  it("should handle undefined limit", () => {
    const dice = makeDice([5, 5, 5, 5, 5]);
    const result = calculateHitsWithLimit(dice, 5, undefined);

    expect(result.hits).toBe(5);
    expect(result.limitApplied).toBe(false);
  });
});

// =============================================================================
// calculateGlitch TESTS
// =============================================================================

describe("calculateGlitch", () => {
  it("should detect glitch when >50% are ones", () => {
    const dice = makeDice([1, 1, 1, 4]); // 3/4 = 75% ones
    const result = calculateGlitch(dice, 0);

    expect(result.isGlitch).toBe(true);
    expect(result.ones).toBe(3);
  });

  it("should not detect glitch when exactly 50% ones", () => {
    const dice = makeDice([1, 1, 5, 5]); // 2/4 = 50% ones
    const result = calculateGlitch(dice, 2);

    expect(result.isGlitch).toBe(false);
  });

  it("should not detect glitch when <50% ones", () => {
    const dice = makeDice([1, 2, 3, 4, 5, 6]); // 1/6 = 16% ones
    const result = calculateGlitch(dice, 2);

    expect(result.isGlitch).toBe(false);
    expect(result.ones).toBe(1);
  });

  it("should detect critical glitch when glitch + zero hits", () => {
    const dice = makeDice([1, 1, 1, 2]); // 75% ones, 0 hits
    const result = calculateGlitch(dice, 0);

    expect(result.isGlitch).toBe(true);
    expect(result.isCriticalGlitch).toBe(true);
  });

  it("should not be critical glitch when glitch + hits", () => {
    const dice = makeDice([1, 1, 1, 5]); // 75% ones, 1 hit
    const result = calculateGlitch(dice, 1);

    expect(result.isGlitch).toBe(true);
    expect(result.isCriticalGlitch).toBe(false);
  });

  it("should handle criticalGlitchRequiresZeroHits = false", () => {
    const dice = makeDice([1, 1, 1, 5]); // 75% ones, 1 hit
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      criticalGlitchRequiresZeroHits: false,
    };
    const result = calculateGlitch(dice, 1, rules);

    expect(result.isGlitch).toBe(true);
    expect(result.isCriticalGlitch).toBe(true); // Critical even with hits
  });

  it("should calculate glitch threshold value correctly", () => {
    const dice = makeDice([1, 1, 1, 1, 1, 1]); // 6 dice
    const result = calculateGlitch(dice, 0);

    // glitchThreshold 0.5 * 6 = 3
    expect(result.glitchThresholdValue).toBe(3);
  });

  it("should handle empty dice pool", () => {
    const result = calculateGlitch([], 0);

    expect(result.isGlitch).toBe(false);
    expect(result.isCriticalGlitch).toBe(false);
    expect(result.ones).toBe(0);
  });
});

// =============================================================================
// sortDiceForDisplay TESTS
// =============================================================================

describe("sortDiceForDisplay", () => {
  it("should put hits first", () => {
    const dice = makeDice([1, 5, 2, 6, 3, 5]);
    const sorted = sortDiceForDisplay(dice);

    // First 3 should be hits (5, 6, 5)
    expect(sorted[0].isHit).toBe(true);
    expect(sorted[1].isHit).toBe(true);
    expect(sorted[2].isHit).toBe(true);
  });

  it("should put ones last", () => {
    const dice = makeDice([1, 2, 3, 4, 5, 6]);
    const sorted = sortDiceForDisplay(dice);

    expect(sorted[sorted.length - 1].isOne).toBe(true);
  });

  it("should sort non-hits by value descending", () => {
    const dice = makeDice([2, 3, 4]); // No hits, no ones
    const sorted = sortDiceForDisplay(dice);

    expect(sorted[0].value).toBe(4);
    expect(sorted[1].value).toBe(3);
    expect(sorted[2].value).toBe(2);
  });

  it("should not mutate original array", () => {
    const dice = makeDice([1, 5, 2, 6]);
    const originalOrder = dice.map((d) => d.value);
    sortDiceForDisplay(dice);

    expect(dice.map((d) => d.value)).toEqual(originalOrder);
  });

  it("should handle array with all same values", () => {
    const dice = makeDice([3, 3, 3, 3]);
    const sorted = sortDiceForDisplay(dice);

    expect(sorted).toHaveLength(4);
    expect(sorted.every((d) => d.value === 3)).toBe(true);
  });

  it("should handle empty array", () => {
    expect(sortDiceForDisplay([])).toEqual([]);
  });
});

// =============================================================================
// rerollNonHits TESTS
// =============================================================================

describe("rerollNonHits", () => {
  let originalCrypto: Crypto;

  beforeEach(() => {
    originalCrypto = global.crypto;
  });

  afterEach(() => {
    Object.defineProperty(global, "crypto", {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });

  it("should keep hits unchanged", () => {
    mockCrypto([3]); // Reroll value
    const dice = makeDice([5, 6, 2]);
    const result = rerollNonHits(dice);

    // Hits should be preserved
    expect(result.filter((d) => d.value === 5 || d.value === 6)).toHaveLength(2);
    expect(result.find((d) => d.value === 5)?.wasRerolled).toBeUndefined();
    expect(result.find((d) => d.value === 6)?.wasRerolled).toBeUndefined();
  });

  it("should reroll non-hits", () => {
    mockCrypto([5]); // Reroll value becomes 5
    const dice = makeDice([5, 2, 3]); // One hit, two non-hits
    const result = rerollNonHits(dice);

    const rerolled = result.filter((d) => d.wasRerolled);
    expect(rerolled).toHaveLength(2);
  });

  it("should mark rerolled dice with wasRerolled flag", () => {
    mockCrypto([6]);
    const dice = makeDice([4]);
    const result = rerollNonHits(dice);

    expect(result[0].wasRerolled).toBe(true);
  });

  it("should store original value in rerolled dice", () => {
    mockCrypto([6]);
    const dice = makeDice([4]);
    const result = rerollNonHits(dice);

    expect(result[0].originalValue).toBe(4);
  });

  it("should update isHit and isOne after reroll", () => {
    mockCrypto([5, 1]); // First reroll becomes 5 (hit), second becomes 1 (one)
    const dice = makeDice([2, 3]);
    const result = rerollNonHits(dice);

    expect(result[0].isHit).toBe(true);
    expect(result[1].isOne).toBe(true);
  });

  it("should handle all hits (no rerolls)", () => {
    mockCrypto([3]); // Should not be used
    const dice = makeDice([5, 5, 6, 6]);
    const result = rerollNonHits(dice);

    expect(result.every((d) => !d.wasRerolled)).toBe(true);
  });

  it("should handle all non-hits (reroll all)", () => {
    mockCrypto([5, 5, 5, 5]);
    const dice = makeDice([1, 2, 3, 4]);
    const result = rerollNonHits(dice);

    expect(result.every((d) => d.wasRerolled)).toBe(true);
    expect(result.every((d) => d.isHit)).toBe(true);
  });
});

// =============================================================================
// executeRoll TESTS
// =============================================================================

describe("executeRoll", () => {
  let originalCrypto: Crypto;

  beforeEach(() => {
    originalCrypto = global.crypto;
  });

  afterEach(() => {
    Object.defineProperty(global, "crypto", {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });

  it("should return complete roll result", () => {
    mockCrypto([1, 2, 3, 4, 5, 6]);
    const result = executeRoll(6);

    expect(result.dice).toHaveLength(6);
    expect(result.hits).toBe(2);
    expect(result.rawHits).toBe(2);
    expect(result.ones).toBe(1);
    expect(result.poolSize).toBe(6);
    expect(typeof result.isGlitch).toBe("boolean");
    expect(typeof result.isCriticalGlitch).toBe("boolean");
  });

  it("should apply limit when provided", () => {
    mockCrypto([5, 5, 5, 5, 5, 5]);
    const result = executeRoll(6, DEFAULT_DICE_RULES, { limit: 3 });

    expect(result.hits).toBe(3);
    expect(result.rawHits).toBe(6);
    expect(result.limitApplied).toBe(true);
  });

  it("should use exploding sixes when option enabled", () => {
    mockCrypto([6, 6, 5, 3, 3]); // 2 sixes + 1 five + 2 non-exploding
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      allowExplodingSixes: true,
    };
    const result = executeRoll(3, rules, { explodingSixes: true });

    expect(result.poolSize).toBe(5); // 3 + 2 explodes
  });

  it("should sort dice for display", () => {
    mockCrypto([1, 2, 5, 6, 3, 4]);
    const result = executeRoll(6);

    // Hits should come first
    expect(result.dice[0].isHit).toBe(true);
    expect(result.dice[1].isHit).toBe(true);
  });

  it("should detect glitch correctly", () => {
    mockCrypto([1, 1, 1, 2]); // 75% ones, no hits
    const result = executeRoll(4);

    expect(result.isGlitch).toBe(true);
    expect(result.isCriticalGlitch).toBe(true);
  });
});

// =============================================================================
// executeReroll TESTS
// =============================================================================

describe("executeReroll", () => {
  let originalCrypto: Crypto;

  beforeEach(() => {
    originalCrypto = global.crypto;
  });

  afterEach(() => {
    Object.defineProperty(global, "crypto", {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });

  it("should keep original hits and reroll non-hits", () => {
    mockCrypto([5]); // Reroll becomes 5
    const originalDice = makeDice([5, 6, 2]); // 2 hits, 1 non-hit
    const result = executeReroll(originalDice);

    // Should have 3 hits total (2 original + 1 new)
    expect(result.hits).toBe(3);
  });

  it("should apply limit to reroll result", () => {
    mockCrypto([5, 5]); // Rerolls become hits
    const originalDice = makeDice([5, 5, 2, 3]); // 2 hits, 2 non-hits
    const result = executeReroll(originalDice, DEFAULT_DICE_RULES, 3);

    expect(result.hits).toBe(3);
    expect(result.rawHits).toBe(4);
    expect(result.limitApplied).toBe(true);
  });

  it("should recalculate glitch on new dice", () => {
    mockCrypto([1, 1, 1]); // Rerolls become all ones
    const originalDice = makeDice([5, 2, 3, 4]); // 1 hit, 3 non-hits
    const result = executeReroll(originalDice);

    // 4 dice total, 3 ones = 75% -> glitch
    expect(result.ones).toBe(3);
    expect(result.isGlitch).toBe(true);
  });

  it("should preserve poolSize", () => {
    mockCrypto([5, 5]);
    const originalDice = makeDice([5, 2, 3]);
    const result = executeReroll(originalDice);

    expect(result.poolSize).toBe(3);
  });

  it("should sort dice for display", () => {
    mockCrypto([5]); // Reroll becomes hit
    const originalDice = makeDice([5, 2]);
    const result = executeReroll(originalDice);

    // Both hits should be at the start
    expect(result.dice[0].isHit).toBe(true);
    expect(result.dice[1].isHit).toBe(true);
  });
});

// =============================================================================
// expectedHits TESTS
// =============================================================================

describe("expectedHits", () => {
  it("should calculate expected hits for standard threshold (5)", () => {
    // Probability of 5 or 6 on d6 = 2/6 = 1/3
    // Expected hits for pool of 6 = 6 * 1/3 = 2
    expect(expectedHits(6, 5)).toBeCloseTo(2, 5);
  });

  it("should scale linearly with pool size", () => {
    const poolOf6 = expectedHits(6, 5);
    const poolOf12 = expectedHits(12, 5);

    expect(poolOf12).toBeCloseTo(poolOf6 * 2, 5);
  });

  it("should adjust for different thresholds", () => {
    // Threshold 4: 4, 5, 6 = 3/6 = 50%
    expect(expectedHits(6, 4)).toBeCloseTo(3, 5);

    // Threshold 6: only 6 = 1/6
    expect(expectedHits(6, 6)).toBeCloseTo(1, 5);
  });

  it("should return 0 for pool of 0", () => {
    expect(expectedHits(0)).toBe(0);
  });
});

// =============================================================================
// glitchProbability TESTS
// =============================================================================

describe("glitchProbability", () => {
  it("should return 0 for empty pool", () => {
    expect(glitchProbability(0)).toBe(0);
  });

  it("should return probability between 0 and 1", () => {
    const prob = glitchProbability(6);
    expect(prob).toBeGreaterThanOrEqual(0);
    expect(prob).toBeLessThanOrEqual(1);
  });

  it("should decrease as pool size increases (law of large numbers)", () => {
    // Larger pools are less likely to glitch (more than half ones is harder)
    const prob4 = glitchProbability(4);
    const prob10 = glitchProbability(10);
    const prob20 = glitchProbability(20);

    // This isn't strictly monotonic but generally true for large pools
    expect(prob20).toBeLessThan(prob4);
    expect(prob10).toBeLessThan(prob4);
  });

  it("should be relatively high for small pools", () => {
    // Pool of 2: need 2 ones = (1/6)^2 = ~2.78%
    const prob2 = glitchProbability(2);
    expect(prob2).toBeGreaterThan(0.02);
    expect(prob2).toBeLessThan(0.05);
  });

  it("should match expected mathematical values", () => {
    // Pool of 1: can't have "more than half" ones with 1 die (1 > 0.5 is true but threshold floor is 0)
    // Actually floor(1 * 0.5) = 0, need > 0 ones, so 1 one = glitch
    // P(at least 1 one) = 1/6 = ~16.67%
    const prob1 = glitchProbability(1);
    expect(prob1).toBeCloseTo(1 / 6, 2);
  });
});
