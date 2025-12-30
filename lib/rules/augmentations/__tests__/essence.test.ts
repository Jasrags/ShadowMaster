/**
 * Essence Calculation Tests
 *
 * Tests for the core essence calculation utilities.
 * Validates precision handling, grade applications, and viability checks.
 */

import { describe, it, expect } from "vitest";
import {
  roundEssence,
  formatEssence,
  calculateCyberwareEssence,
  calculateBiowareEssence,
  calculateTotalEssenceLoss,
  calculateRemainingEssence,
  getCurrentEssence,
  validateEssenceViability,
  validateAugmentationEssence,
  calculateEssenceImpact,
  ESSENCE_PRECISION,
  MAX_ESSENCE,
  ESSENCE_MIN_VIABLE,
} from "../essence";
import type { CyberwareCatalogItem, BiowareCatalogItem } from "@/lib/types/edition";
import type { CyberwareItem, BiowareItem } from "@/lib/types/character";

// =============================================================================
// PRECISION TESTS
// =============================================================================

describe("Essence Precision", () => {
  describe("roundEssence", () => {
    it("rounds to exactly 2 decimal places", () => {
      expect(roundEssence(5.125)).toBe(5.13);
      expect(roundEssence(5.124)).toBe(5.12);
      expect(roundEssence(5.1)).toBe(5.1);
      expect(roundEssence(5)).toBe(5);
    });

    it("handles small values correctly", () => {
      expect(roundEssence(0.01)).toBe(0.01);
      expect(roundEssence(0.001)).toBe(0);
      expect(roundEssence(0.005)).toBe(0.01);
      expect(roundEssence(0.004)).toBe(0);
    });

    it("handles edge cases near rounding boundaries", () => {
      expect(roundEssence(0.125)).toBe(0.13);
      expect(roundEssence(0.115)).toBe(0.12);
      expect(roundEssence(5.995)).toBe(6);
    });

    it("avoids floating-point accumulation errors", () => {
      // 0.1 + 0.2 = 0.30000000000000004 in floating point
      const result = roundEssence(0.1 + 0.2);
      expect(result).toBe(0.3);

      // Multiple small additions
      let accumulated = 0;
      for (let i = 0; i < 10; i++) {
        accumulated += 0.1;
      }
      expect(roundEssence(accumulated)).toBe(1);
    });
  });

  describe("formatEssence", () => {
    it("formats with exactly 2 decimal places", () => {
      expect(formatEssence(5.7)).toBe("5.70");
      expect(formatEssence(5)).toBe("5.00");
      expect(formatEssence(5.123)).toBe("5.12");
      expect(formatEssence(0.1)).toBe("0.10");
    });

    it("formats zero correctly", () => {
      expect(formatEssence(0)).toBe("0.00");
    });

    it("formats maximum essence correctly", () => {
      expect(formatEssence(6)).toBe("6.00");
      expect(formatEssence(MAX_ESSENCE)).toBe("6.00");
    });
  });
});

// =============================================================================
// CYBERWARE ESSENCE CALCULATIONS
// =============================================================================

describe("Cyberware Essence Calculations", () => {
  const datajack: CyberwareCatalogItem = {
    id: "datajack",
    name: "Datajack",
    category: "headware",
    essenceCost: 0.1,
    cost: 1000,
    availability: 4,
  };

  const wiredReflexes: CyberwareCatalogItem = {
    id: "wired-reflexes",
    name: "Wired Reflexes",
    category: "bodyware",
    essenceCost: 2.0,
    hasRating: true,
    maxRating: 3,
    essencePerRating: true,
    cost: 39000,
    availability: 8,
  };

  describe("calculateCyberwareEssence", () => {
    it("calculates standard grade essence correctly", () => {
      const essence = calculateCyberwareEssence(datajack, "standard");
      expect(essence).toBe(0.1);
    });

    it("applies used grade multiplier (1.25x)", () => {
      const essence = calculateCyberwareEssence(datajack, "used");
      expect(essence).toBe(0.13); // 0.1 * 1.25 = 0.125, rounded to 0.13
    });

    it("applies alpha grade multiplier (0.8x)", () => {
      const essence = calculateCyberwareEssence(datajack, "alpha");
      expect(essence).toBe(0.08); // 0.1 * 0.8 = 0.08
    });

    it("applies beta grade multiplier (0.6x)", () => {
      const essence = calculateCyberwareEssence(datajack, "beta");
      expect(essence).toBe(0.06); // 0.1 * 0.6 = 0.06
    });

    it("applies delta grade multiplier (0.5x)", () => {
      const essence = calculateCyberwareEssence(datajack, "delta");
      expect(essence).toBe(0.05); // 0.1 * 0.5 = 0.05
    });

    it("scales rated items by rating", () => {
      // Rating 2 wired reflexes = 2.0 * 2 = 4.0 base
      const essence = calculateCyberwareEssence(wiredReflexes, "standard", 2);
      expect(essence).toBe(4.0);
    });

    it("applies grade to rated items", () => {
      // Rating 2 at alpha grade = 2.0 * 2 * 0.8 = 3.2
      const essence = calculateCyberwareEssence(wiredReflexes, "alpha", 2);
      expect(essence).toBe(3.2);
    });
  });
});

// =============================================================================
// BIOWARE ESSENCE CALCULATIONS
// =============================================================================

describe("Bioware Essence Calculations", () => {
  const muscleReplacement: BiowareCatalogItem = {
    id: "muscle-replacement",
    name: "Muscle Replacement",
    category: "basic",
    essenceCost: 1.0,
    hasRating: true,
    maxRating: 4,
    essencePerRating: true,
    cost: 25000,
    availability: 12,
  };

  describe("calculateBiowareEssence", () => {
    it("calculates standard grade essence correctly", () => {
      const essence = calculateBiowareEssence(muscleReplacement, "standard", 1);
      expect(essence).toBe(1.0);
    });

    it("applies alpha grade multiplier (0.8x)", () => {
      const essence = calculateBiowareEssence(muscleReplacement, "alpha", 1);
      expect(essence).toBe(0.8);
    });

    it("scales rated items by rating", () => {
      const essence = calculateBiowareEssence(muscleReplacement, "standard", 2);
      expect(essence).toBe(2.0);
    });

    it("applies grade to rated items", () => {
      // Rating 3 at beta grade = 1.0 * 3 * 0.6 = 1.8
      const essence = calculateBiowareEssence(muscleReplacement, "beta", 3);
      expect(essence).toBe(1.8);
    });
  });
});

// =============================================================================
// TOTAL ESSENCE CALCULATIONS
// =============================================================================

describe("Total Essence Calculations", () => {
  const cyberwareList: CyberwareItem[] = [
    {
      catalogId: "datajack",
      name: "Datajack",
      category: "headware",
      grade: "standard",
      baseEssenceCost: 0.1,
      essenceCost: 0.1,
      cost: 1000,
      availability: 4,
    },
    {
      catalogId: "smartlink",
      name: "Smartlink",
      category: "eyeware",
      grade: "alpha",
      baseEssenceCost: 0.2,
      essenceCost: 0.16, // 0.2 * 0.8
      cost: 8000,
      availability: 6,
    },
  ];

  const biowareList: BiowareItem[] = [
    {
      catalogId: "muscle-toner",
      name: "Muscle Toner",
      category: "basic",
      grade: "standard",
      baseEssenceCost: 0.2,
      essenceCost: 0.4, // Rating 2
      rating: 2,
      cost: 16000,
      availability: 8,
    },
  ];

  describe("calculateTotalEssenceLoss", () => {
    it("calculates combined essence loss", () => {
      const loss = calculateTotalEssenceLoss(cyberwareList, biowareList);
      // 0.1 + 0.16 + 0.4 = 0.66
      expect(loss).toBe(0.66);
    });

    it("handles empty arrays", () => {
      expect(calculateTotalEssenceLoss([], [])).toBe(0);
    });

    it("handles only cyberware", () => {
      const loss = calculateTotalEssenceLoss(cyberwareList, []);
      expect(loss).toBe(0.26);
    });

    it("handles only bioware", () => {
      const loss = calculateTotalEssenceLoss([], biowareList);
      expect(loss).toBe(0.4);
    });
  });

  describe("calculateRemainingEssence", () => {
    it("calculates remaining essence correctly", () => {
      const remaining = calculateRemainingEssence(6.0, 0.66);
      expect(remaining).toBe(5.34);
    });

    it("clamps to zero when loss exceeds base", () => {
      const remaining = calculateRemainingEssence(6.0, 7.0);
      expect(remaining).toBe(0);
    });

    it("maintains precision", () => {
      const remaining = calculateRemainingEssence(6.0, 0.13);
      expect(remaining).toBe(5.87);
    });
  });

  describe("getCurrentEssence", () => {
    it("calculates current essence from augmentations", () => {
      const essence = getCurrentEssence(cyberwareList, biowareList);
      expect(essence).toBe(5.34);
    });

    it("returns max essence with no augmentations", () => {
      const essence = getCurrentEssence([], []);
      expect(essence).toBe(6.0);
    });
  });
});

// =============================================================================
// VALIDATION TESTS
// =============================================================================

describe("Essence Validation", () => {
  describe("validateEssenceViability", () => {
    it("validates viable essence", () => {
      const result = validateEssenceViability(5.5);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("validates minimum viable essence", () => {
      const result = validateEssenceViability(ESSENCE_MIN_VIABLE);
      expect(result.valid).toBe(true);
    });

    it("rejects essence below minimum threshold", () => {
      const result = validateEssenceViability(0.009);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("below minimum viable threshold");
    });

    it("rejects zero essence", () => {
      const result = validateEssenceViability(0);
      expect(result.valid).toBe(false);
    });

    it("rejects negative essence", () => {
      const result = validateEssenceViability(-1);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("cannot be negative");
    });
  });

  describe("validateAugmentationEssence", () => {
    it("allows valid augmentation", () => {
      const result = validateAugmentationEssence(6.0, 2.0);
      expect(result.valid).toBe(true);
      expect(result.projectedEssence).toBe(4.0);
    });

    it("rejects augmentation that would kill character", () => {
      const result = validateAugmentationEssence(0.5, 0.5);
      expect(result.valid).toBe(false);
      expect(result.projectedEssence).toBe(0);
    });

    it("allows augmentation leaving minimum viable essence", () => {
      const result = validateAugmentationEssence(1.0, 0.99);
      expect(result.valid).toBe(true);
      expect(result.projectedEssence).toBe(0.01);
    });
  });
});

// =============================================================================
// FULL CALCULATION TESTS
// =============================================================================

describe("calculateEssenceImpact", () => {
  it("calculates complete impact for standard grade", () => {
    const result = calculateEssenceImpact(6.0, 0.1, 1.0);

    expect(result.baseEssenceCost).toBe(0.1);
    expect(result.gradeMultiplier).toBe(1.0);
    expect(result.finalEssenceCost).toBe(0.1);
    expect(result.currentEssence).toBe(6.0);
    expect(result.newEssence).toBe(5.9);
    expect(result.isViable).toBe(true);
  });

  it("calculates impact for alpha grade", () => {
    const result = calculateEssenceImpact(6.0, 2.0, 0.8);

    expect(result.finalEssenceCost).toBe(1.6);
    expect(result.newEssence).toBe(4.4);
    expect(result.isViable).toBe(true);
  });

  it("identifies non-viable installation", () => {
    const result = calculateEssenceImpact(0.5, 1.0, 1.0);

    expect(result.newEssence).toBe(0);
    expect(result.isViable).toBe(false);
  });
});
