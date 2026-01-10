/**
 * Essence-Magic Link Tests
 */

import { describe, it, expect } from "vitest";
import {
  calculateEffectiveMagic,
  canStillUseMagic,
  validateEssenceForTradition,
  getEssenceMagicState,
  previewAugmentationMagicImpact,
  validateAugmentationForMagic,
  formatEssenceMagicState,
  getMagicDegradationSummary,
} from "../essence-magic-link";
import type { Character } from "@/lib/types/character";
import type { AugmentationRulesData } from "../../loader-types";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockCharacter(overrides: Partial<Character> = {}): Partial<Character> {
  return {
    id: "test-character",
    name: "Test Character",
    magicalPath: "full-mage",
    tradition: "hermetic",
    specialAttributes: {
      edge: 3,
      essence: 6.0,
      magic: 5,
      resonance: 0,
    },
    ...overrides,
  };
}

function createMockRules(
  formula: "roundUp" | "roundDown" | "exact" = "roundUp"
): AugmentationRulesData {
  return {
    maxEssence: 6,
    maxAttributeBonus: 4,
    maxAvailabilityAtCreation: 12,
    trackEssenceHoles: false,
    magicReductionFormula: formula,
  };
}

// =============================================================================
// CALCULATE EFFECTIVE MAGIC
// =============================================================================

describe("calculateEffectiveMagic", () => {
  describe("roundUp formula (default)", () => {
    it("should reduce Magic by ceiling of essence lost", () => {
      expect(calculateEffectiveMagic(5, 0.5)).toBe(4); // ceil(0.5) = 1
      expect(calculateEffectiveMagic(5, 1.0)).toBe(4); // ceil(1.0) = 1
      expect(calculateEffectiveMagic(5, 1.5)).toBe(3); // ceil(1.5) = 2
    });

    it("should not go below 0", () => {
      expect(calculateEffectiveMagic(3, 5.0)).toBe(0);
    });
  });

  describe("roundDown formula", () => {
    const rules = createMockRules("roundDown");

    it("should reduce Magic by floor of essence lost", () => {
      expect(calculateEffectiveMagic(5, 0.5, rules)).toBe(5); // floor(0.5) = 0
      expect(calculateEffectiveMagic(5, 1.0, rules)).toBe(4); // floor(1.0) = 1
      expect(calculateEffectiveMagic(5, 1.9, rules)).toBe(4); // floor(1.9) = 1
    });
  });

  describe("exact formula", () => {
    const rules = createMockRules("exact");

    it("should reduce Magic by exact essence lost", () => {
      expect(calculateEffectiveMagic(5, 0.5, rules)).toBe(4.5);
      expect(calculateEffectiveMagic(5, 1.5, rules)).toBe(3.5);
    });
  });
});

// =============================================================================
// CAN STILL USE MAGIC
// =============================================================================

describe("canStillUseMagic", () => {
  it("should return true for full-mage with Magic > 0", () => {
    const character = createMockCharacter();
    expect(canStillUseMagic(character)).toBe(true);
  });

  it("should return false for mundane", () => {
    const character = createMockCharacter({ magicalPath: "mundane" });
    expect(canStillUseMagic(character)).toBe(false);
  });

  it("should return false for technomancer", () => {
    const character = createMockCharacter({
      magicalPath: "technomancer",
      specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 5 },
    });
    expect(canStillUseMagic(character)).toBe(false);
  });

  it("should return false if Magic is 0", () => {
    const character = createMockCharacter({
      specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 0 },
    });
    expect(canStillUseMagic(character)).toBe(false);
  });

  it("should return true for adept with Magic > 0", () => {
    const character = createMockCharacter({ magicalPath: "adept" });
    expect(canStillUseMagic(character)).toBe(true);
  });
});

// =============================================================================
// VALIDATE ESSENCE FOR TRADITION
// =============================================================================

describe("validateEssenceForTradition", () => {
  it("should return true for essence > 0", () => {
    const character = createMockCharacter();
    expect(validateEssenceForTradition(character)).toBe(true);
  });

  it("should return false for essence <= 0", () => {
    const character = createMockCharacter({
      specialAttributes: { edge: 3, essence: 0, magic: 0, resonance: 0 },
    });
    expect(validateEssenceForTradition(character)).toBe(false);
  });

  it("should return true for low but positive essence", () => {
    const character = createMockCharacter({
      specialAttributes: { edge: 3, essence: 0.5, magic: 1, resonance: 0 },
    });
    expect(validateEssenceForTradition(character)).toBe(true);
  });
});

// =============================================================================
// GET ESSENCE MAGIC STATE
// =============================================================================

describe("getEssenceMagicState", () => {
  it("should calculate state for character with no essence loss", () => {
    const character = createMockCharacter();
    const state = getEssenceMagicState(character);

    expect(state.baseEssence).toBe(6);
    expect(state.currentEssence).toBe(6);
    expect(state.essenceLost).toBe(0);
    expect(state.baseMagicRating).toBe(5);
    expect(state.effectiveMagicRating).toBe(5);
    expect(state.magicLostToEssence).toBe(0);
  });

  it("should calculate state for character with essence loss", () => {
    const character = createMockCharacter({
      specialAttributes: { edge: 3, essence: 4.5, magic: 5, resonance: 0 },
    });
    const state = getEssenceMagicState(character);

    expect(state.essenceLost).toBe(1.5);
    expect(state.magicLostToEssence).toBe(2); // ceil(1.5)
    expect(state.effectiveMagicRating).toBe(3);
  });

  it("should use roundDown formula when specified", () => {
    const character = createMockCharacter({
      specialAttributes: { edge: 3, essence: 4.5, magic: 5, resonance: 0 },
    });
    const rules = createMockRules("roundDown");
    const state = getEssenceMagicState(character, rules);

    expect(state.magicLostToEssence).toBe(1); // floor(1.5)
    expect(state.effectiveMagicRating).toBe(4);
  });
});

// =============================================================================
// PREVIEW AUGMENTATION MAGIC IMPACT
// =============================================================================

describe("previewAugmentationMagicImpact", () => {
  it("should preview impact of proposed augmentation", () => {
    const character = createMockCharacter();
    const state = previewAugmentationMagicImpact(character, 1.5);

    expect(state.currentEssence).toBe(4.5); // 6.0 - 1.5
    expect(state.essenceLost).toBe(1.5);
    expect(state.magicLostToEssence).toBe(2); // ceil(1.5)
    expect(state.effectiveMagicRating).toBe(3);
  });

  it("should not go below 0 essence", () => {
    const character = createMockCharacter();
    const state = previewAugmentationMagicImpact(character, 10);

    expect(state.currentEssence).toBe(0);
    expect(state.effectiveMagicRating).toBe(0);
  });

  it("should stack with existing essence loss", () => {
    const character = createMockCharacter({
      specialAttributes: { edge: 3, essence: 5.0, magic: 5, resonance: 0 },
    });
    const state = previewAugmentationMagicImpact(character, 1.0);

    expect(state.currentEssence).toBe(4.0); // 5.0 - 1.0
    expect(state.essenceLost).toBe(2.0); // 6.0 - 4.0
    expect(state.magicLostToEssence).toBe(2);
  });
});

// =============================================================================
// VALIDATE AUGMENTATION FOR MAGIC
// =============================================================================

describe("validateAugmentationForMagic", () => {
  it("should detect burnout condition", () => {
    const character = createMockCharacter({
      specialAttributes: { edge: 3, essence: 2.0, magic: 2, resonance: 0 },
    });
    const result = validateAugmentationForMagic(character, 2.0);

    expect(result.wouldBurnOut).toBe(true);
    expect(result.advisable).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("should warn about magic loss", () => {
    const character = createMockCharacter();
    const result = validateAugmentationForMagic(character, 1.5);

    expect(result.wouldBurnOut).toBe(false);
    expect(result.magicLost).toBe(2);
    expect(result.warnings.some((w) => w.includes("reduce your Magic"))).toBe(true);
  });

  it("should be advisable for small augmentations", () => {
    const character = createMockCharacter();
    const result = validateAugmentationForMagic(character, 0.5);

    expect(result.advisable).toBe(true);
    expect(result.magicLost).toBeLessThanOrEqual(1);
  });

  it("should warn about low essence", () => {
    const character = createMockCharacter({
      specialAttributes: { edge: 3, essence: 2.0, magic: 2, resonance: 0 },
    });
    const result = validateAugmentationForMagic(character, 1.5);

    expect(result.warnings.some((w) => w.includes("drop to 1 or below"))).toBe(true);
  });
});

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

describe("formatEssenceMagicState", () => {
  it("should format state without degradation", () => {
    const state = {
      baseEssence: 6,
      currentEssence: 6,
      essenceLost: 0,
      essenceHole: 0,
      baseMagicRating: 5,
      effectiveMagicRating: 5,
      magicLostToEssence: 0,
    };
    const result = formatEssenceMagicState(state);
    expect(result).toBe("Essence: 6.00 | Magic: 5");
  });

  it("should format state with degradation", () => {
    const state = {
      baseEssence: 6,
      currentEssence: 4.5,
      essenceLost: 1.5,
      essenceHole: 0,
      baseMagicRating: 5,
      effectiveMagicRating: 3,
      magicLostToEssence: 2,
    };
    const result = formatEssenceMagicState(state);
    expect(result).toBe("Essence: 4.50 | Magic: 3 (base 5)");
  });
});

describe("getMagicDegradationSummary", () => {
  it("should report no degradation", () => {
    const character = createMockCharacter();
    const result = getMagicDegradationSummary(character);
    expect(result).toBe("No magic degradation from essence loss.");
  });

  it("should report degradation", () => {
    const character = createMockCharacter({
      specialAttributes: { edge: 3, essence: 4.5, magic: 5, resonance: 0 },
    });
    const result = getMagicDegradationSummary(character);
    expect(result).toContain("Magic degraded by 2");
    expect(result).toContain("1.50 essence lost");
  });
});
