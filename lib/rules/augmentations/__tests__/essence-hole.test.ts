/**
 * Essence Hole Management Tests
 *
 * Tests for essence hole tracking for magical and resonance characters.
 * Validates that magic loss is properly tracked and persists after augmentation removal.
 */

import { describe, it, expect } from "vitest";
import {
  shouldTrackEssenceHole,
  calculateEssenceHole,
  calculateMagicLoss,
  getEffectiveEssenceLoss,
  createEssenceHole,
  updateEssenceHoleOnInstall,
  updateEssenceHoleOnRemoval,
  updateEssenceHoleOnGradeUpgrade,
  getCharacterEssenceHole,
  getEssenceMagicSummary,
  formatEssenceHole,
  getMagicLossWarning,
} from "../essence-hole";
import type { Character, EssenceHole } from "@/lib/types/character";

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createTestCharacter(overrides: Partial<Character> = {}): Partial<Character> {
  return {
    magicalPath: "full-mage",
    specialAttributes: {
      edge: 3,
      essence: 6.0,
      magic: 6,
    },
    cyberware: [],
    bioware: [],
    ...overrides,
  };
}

// =============================================================================
// SHOULD TRACK ESSENCE HOLE
// =============================================================================

describe("shouldTrackEssenceHole", () => {
  it("returns true for full mage", () => {
    const char = createTestCharacter({ magicalPath: "full-mage" });
    expect(shouldTrackEssenceHole(char)).toBe(true);
  });

  it("returns true for aspected mage", () => {
    const char = createTestCharacter({ magicalPath: "aspected-mage" });
    expect(shouldTrackEssenceHole(char)).toBe(true);
  });

  it("returns true for mystic adept", () => {
    const char = createTestCharacter({ magicalPath: "mystic-adept" });
    expect(shouldTrackEssenceHole(char)).toBe(true);
  });

  it("returns true for adept", () => {
    const char = createTestCharacter({ magicalPath: "adept" });
    expect(shouldTrackEssenceHole(char)).toBe(true);
  });

  it("returns true for technomancer", () => {
    const char = createTestCharacter({
      magicalPath: "technomancer",
      specialAttributes: { edge: 3, essence: 6.0, resonance: 6 },
    });
    expect(shouldTrackEssenceHole(char)).toBe(true);
  });

  it("returns false for mundane", () => {
    const char = createTestCharacter({ magicalPath: "mundane" });
    expect(shouldTrackEssenceHole(char)).toBe(false);
  });

  it("returns false for undefined magical path", () => {
    const char = createTestCharacter({ magicalPath: undefined });
    expect(shouldTrackEssenceHole(char)).toBe(false);
  });
});

// =============================================================================
// ESSENCE HOLE CALCULATION
// =============================================================================

describe("calculateEssenceHole", () => {
  it("returns 0 when current equals peak", () => {
    expect(calculateEssenceHole(2.0, 2.0)).toBe(0);
  });

  it("calculates hole when current is less than peak", () => {
    // Had 2.0 loss, now have 1.0 loss (removed augmentation)
    // Hole = 2.0 - 1.0 = 1.0
    expect(calculateEssenceHole(2.0, 1.0)).toBe(1.0);
  });

  it("returns 0 when current exceeds peak (shouldn't happen normally)", () => {
    expect(calculateEssenceHole(1.0, 2.0)).toBe(0);
  });

  it("maintains 2 decimal precision", () => {
    expect(calculateEssenceHole(1.55, 0.75)).toBe(0.8);
  });
});

// =============================================================================
// MAGIC LOSS CALCULATION
// =============================================================================

describe("calculateMagicLoss", () => {
  describe("roundUp formula (SR5 standard)", () => {
    it("rounds up any essence loss to magic loss", () => {
      expect(calculateMagicLoss(0.1, "roundUp")).toBe(1);
      expect(calculateMagicLoss(0.9, "roundUp")).toBe(1);
      expect(calculateMagicLoss(1.0, "roundUp")).toBe(1);
      expect(calculateMagicLoss(1.1, "roundUp")).toBe(2);
    });

    it("handles zero essence loss", () => {
      expect(calculateMagicLoss(0, "roundUp")).toBe(0);
    });
  });

  describe("roundDown formula", () => {
    it("only counts full points of essence loss", () => {
      expect(calculateMagicLoss(0.9, "roundDown")).toBe(0);
      expect(calculateMagicLoss(1.0, "roundDown")).toBe(1);
      expect(calculateMagicLoss(1.9, "roundDown")).toBe(1);
      expect(calculateMagicLoss(2.0, "roundDown")).toBe(2);
    });
  });

  describe("exact formula", () => {
    it("returns exact essence loss value", () => {
      expect(calculateMagicLoss(1.5, "exact")).toBe(1.5);
      expect(calculateMagicLoss(0.3, "exact")).toBe(0.3);
    });
  });
});

// =============================================================================
// ESSENCE HOLE STATE MANAGEMENT
// =============================================================================

describe("createEssenceHole", () => {
  it("creates initial state with no loss", () => {
    const hole = createEssenceHole();
    expect(hole.peakEssenceLoss).toBe(0);
    expect(hole.currentEssenceLoss).toBe(0);
    expect(hole.essenceHole).toBe(0);
    expect(hole.magicLost).toBe(0);
  });

  it("creates state with initial loss", () => {
    const hole = createEssenceHole(1.5);
    expect(hole.peakEssenceLoss).toBe(1.5);
    expect(hole.currentEssenceLoss).toBe(1.5);
    expect(hole.essenceHole).toBe(0);
    expect(hole.magicLost).toBe(2); // roundUp(1.5) = 2
  });
});

describe("updateEssenceHoleOnInstall", () => {
  it("creates new state if none exists", () => {
    const result = updateEssenceHoleOnInstall(undefined, 1.0);
    expect(result.essenceHole.peakEssenceLoss).toBe(1.0);
    expect(result.essenceHole.currentEssenceLoss).toBe(1.0);
    expect(result.essenceHole.magicLost).toBe(1);
    expect(result.hadPermanentLoss).toBe(true);
    expect(result.additionalMagicLost).toBe(1);
  });

  it("updates existing state on install", () => {
    const initial: EssenceHole = {
      peakEssenceLoss: 1.0,
      currentEssenceLoss: 1.0,
      essenceHole: 0,
      magicLost: 1,
    };

    const result = updateEssenceHoleOnInstall(initial, 0.5);
    expect(result.essenceHole.currentEssenceLoss).toBe(1.5);
    expect(result.essenceHole.peakEssenceLoss).toBe(1.5);
    expect(result.essenceHole.magicLost).toBe(2);
    expect(result.additionalMagicLost).toBe(1);
  });

  it("tracks peak even when current is lower", () => {
    // Character had 2.0 loss, removed to 1.0, now adding 0.3
    const initial: EssenceHole = {
      peakEssenceLoss: 2.0,
      currentEssenceLoss: 1.0,
      essenceHole: 1.0,
      magicLost: 2,
    };

    const result = updateEssenceHoleOnInstall(initial, 0.3);
    expect(result.essenceHole.currentEssenceLoss).toBe(1.3);
    expect(result.essenceHole.peakEssenceLoss).toBe(2.0); // Still 2.0
    expect(result.essenceHole.essenceHole).toBe(0.7);
    expect(result.additionalMagicLost).toBe(0); // No new magic lost
  });
});

describe("updateEssenceHoleOnRemoval", () => {
  it("decreases current loss but maintains peak", () => {
    const initial: EssenceHole = {
      peakEssenceLoss: 2.0,
      currentEssenceLoss: 2.0,
      essenceHole: 0,
      magicLost: 2,
    };

    const result = updateEssenceHoleOnRemoval(initial, 1.0);
    expect(result.essenceHole.currentEssenceLoss).toBe(1.0);
    expect(result.essenceHole.peakEssenceLoss).toBe(2.0); // Peak stays same!
    expect(result.essenceHole.essenceHole).toBe(1.0); // Now there's a hole
    expect(result.essenceHole.magicLost).toBe(2); // Magic loss stays same!
    expect(result.hadPermanentLoss).toBe(false);
  });

  it("essence hole persists after augmentation removal", () => {
    // This is the key test for the essence hole mechanic
    const initial: EssenceHole = {
      peakEssenceLoss: 1.5,
      currentEssenceLoss: 1.5,
      essenceHole: 0,
      magicLost: 2,
    };

    // Remove all augmentations
    const result = updateEssenceHoleOnRemoval(initial, 1.5);

    expect(result.essenceHole.currentEssenceLoss).toBe(0);
    expect(result.essenceHole.peakEssenceLoss).toBe(1.5); // Peak remembered
    expect(result.essenceHole.essenceHole).toBe(1.5); // Hole equals peak
    expect(result.essenceHole.magicLost).toBe(2); // Magic loss is PERMANENT
  });

  it("clamps current loss to minimum 0", () => {
    const initial: EssenceHole = {
      peakEssenceLoss: 1.0,
      currentEssenceLoss: 0.5,
      essenceHole: 0.5,
      magicLost: 1,
    };

    const result = updateEssenceHoleOnRemoval(initial, 1.0);
    expect(result.essenceHole.currentEssenceLoss).toBe(0);
  });
});

describe("updateEssenceHoleOnGradeUpgrade", () => {
  it("reduces current loss but maintains peak and magic loss", () => {
    const initial: EssenceHole = {
      peakEssenceLoss: 2.0, // Original install at standard
      currentEssenceLoss: 2.0,
      essenceHole: 0,
      magicLost: 2,
    };

    // Upgrading from standard (1.0x) to alpha (0.8x) on 2.0 base
    // Old cost: 2.0, New cost: 1.6, Diff: 0.4
    const result = updateEssenceHoleOnGradeUpgrade(initial, 2.0, 1.6);

    expect(result.essenceHole.currentEssenceLoss).toBe(1.6);
    expect(result.essenceHole.peakEssenceLoss).toBe(2.0); // Peak stays!
    expect(result.essenceHole.essenceHole).toBe(0.4);
    expect(result.essenceHole.magicLost).toBe(2); // Magic loss permanent
    expect(result.hadPermanentLoss).toBe(false);
  });
});

// =============================================================================
// CHARACTER INTEGRATION
// =============================================================================

describe("getCharacterEssenceHole", () => {
  it("returns existing essence hole if present", () => {
    const existingHole: EssenceHole = {
      peakEssenceLoss: 1.5,
      currentEssenceLoss: 1.0,
      essenceHole: 0.5,
      magicLost: 2,
    };

    const char = createTestCharacter({ essenceHole: existingHole });
    const hole = getCharacterEssenceHole(char);

    expect(hole).toEqual(existingHole);
  });

  it("creates from current essence if no tracked state", () => {
    const char = createTestCharacter({
      specialAttributes: { edge: 3, essence: 4.5, magic: 6 },
    });

    const hole = getCharacterEssenceHole(char);

    expect(hole.currentEssenceLoss).toBe(1.5);
    expect(hole.peakEssenceLoss).toBe(1.5);
  });
});

describe("getEssenceMagicSummary", () => {
  it("provides complete summary for magical character", () => {
    const char = createTestCharacter({
      specialAttributes: { edge: 3, essence: 4.5, magic: 6 },
      essenceHole: {
        peakEssenceLoss: 2.0,
        currentEssenceLoss: 1.5,
        essenceHole: 0.5,
        magicLost: 2,
      },
    });

    const summary = getEssenceMagicSummary(char);

    expect(summary.currentEssence).toBe(4.5);
    expect(summary.totalEssenceLoss).toBe(1.5);
    expect(summary.peakEssenceLoss).toBe(2.0);
    expect(summary.essenceHole).toBe(0.5);
    expect(summary.baseMagic).toBe(6);
    expect(summary.effectiveMagic).toBe(4); // 6 - 2 = 4
    expect(summary.tracksEssenceHole).toBe(true);
  });

  it("provides summary for mundane character", () => {
    const char = createTestCharacter({
      magicalPath: "mundane",
      specialAttributes: { edge: 3, essence: 4.5 },
    });

    const summary = getEssenceMagicSummary(char);

    expect(summary.tracksEssenceHole).toBe(false);
    expect(summary.effectiveMagic).toBe(0);
  });
});

// =============================================================================
// FORMATTING AND WARNINGS
// =============================================================================

describe("formatEssenceHole", () => {
  it("formats no hole correctly", () => {
    const hole: EssenceHole = {
      peakEssenceLoss: 1.0,
      currentEssenceLoss: 1.0,
      essenceHole: 0,
      magicLost: 1,
    };

    expect(formatEssenceHole(hole)).toBe("No essence hole");
  });

  it("formats existing hole correctly", () => {
    const hole: EssenceHole = {
      peakEssenceLoss: 2.0,
      currentEssenceLoss: 1.0,
      essenceHole: 1.0,
      magicLost: 2,
    };

    expect(formatEssenceHole(hole)).toContain("1.00");
    expect(formatEssenceHole(hole)).toContain("2 Magic lost permanently");
  });
});

describe("getMagicLossWarning", () => {
  it("returns null for mundane character", () => {
    const char = createTestCharacter({ magicalPath: "mundane" });
    const warning = getMagicLossWarning(char, 1.0);
    expect(warning).toBeNull();
  });

  it("returns null when no additional magic would be lost", () => {
    const char = createTestCharacter({
      essenceHole: {
        peakEssenceLoss: 1.5,
        currentEssenceLoss: 0.5,
        essenceHole: 1.0,
        magicLost: 2,
      },
    });

    // Adding 0.3 would bring current to 0.8, still below peak of 1.5
    const warning = getMagicLossWarning(char, 0.3);
    expect(warning).toBeNull();
  });

  it("warns when magic would be lost", () => {
    const char = createTestCharacter();
    const warning = getMagicLossWarning(char, 1.5);

    expect(warning).not.toBeNull();
    expect(warning).toContain("Magic");
    expect(warning).toContain("2");
  });

  it("gives burn out warning when magic would reach 0", () => {
    const char = createTestCharacter({
      specialAttributes: { edge: 3, essence: 3.0, magic: 3 },
      essenceHole: {
        peakEssenceLoss: 3.0,
        currentEssenceLoss: 3.0,
        essenceHole: 0,
        magicLost: 3,
      },
    });

    // Installing 1.0 more essence would make peak 4.0, causing 4 magic loss
    // Character only has 3 magic, so they'd burn out
    const warning = getMagicLossWarning(char, 1.0);

    expect(warning).not.toBeNull();
    expect(warning).toContain("WARNING");
    expect(warning).toContain("0");
  });

  it("uses Resonance for technomancers", () => {
    const char = createTestCharacter({
      magicalPath: "technomancer",
      specialAttributes: { edge: 3, essence: 6.0, resonance: 6 },
    });

    const warning = getMagicLossWarning(char, 1.0);
    expect(warning).toContain("Resonance");
  });
});
