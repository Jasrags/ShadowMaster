/**
 * Grade Application Tests
 *
 * Tests for cyberware and bioware grade multipliers and utilities.
 */

import { describe, it, expect } from "vitest";
import {
  getCyberwareGradeMultiplier,
  getCyberwareGradeCostMultiplier,
  getCyberwareGradeAvailabilityModifier,
  getCyberwareGradeMultipliers,
  getBiowareGradeMultiplier,
  getBiowareGradeCostMultiplier,
  getBiowareGradeAvailabilityModifier,
  getBiowareGradeMultipliers,
  applyGradeToEssence,
  applyGradeToCost,
  applyGradeToAvailability,
  applyGradeToAll,
  isValidCyberwareGrade,
  isValidBiowareGrade,
  getGradeDisplayName,
  getCyberwareGrades,
  getBiowareGrades,
  compareGrades,
  isValidGradeUpgrade,
  calculateGradeUpgradeEssenceRefund,
} from "../grades";

// =============================================================================
// CYBERWARE GRADE MULTIPLIERS
// =============================================================================

describe("Cyberware Grade Multipliers", () => {
  describe("getCyberwareGradeMultiplier", () => {
    it("returns correct essence multiplier for used (1.25)", () => {
      expect(getCyberwareGradeMultiplier("used")).toBe(1.25);
    });

    it("returns correct essence multiplier for standard (1.0)", () => {
      expect(getCyberwareGradeMultiplier("standard")).toBe(1.0);
    });

    it("returns correct essence multiplier for alpha (0.8)", () => {
      expect(getCyberwareGradeMultiplier("alpha")).toBe(0.8);
    });

    it("returns correct essence multiplier for beta (0.6)", () => {
      expect(getCyberwareGradeMultiplier("beta")).toBe(0.6);
    });

    it("returns correct essence multiplier for delta (0.5)", () => {
      expect(getCyberwareGradeMultiplier("delta")).toBe(0.5);
    });
  });

  describe("getCyberwareGradeCostMultiplier", () => {
    it("returns correct cost multiplier for used (0.75)", () => {
      expect(getCyberwareGradeCostMultiplier("used")).toBe(0.75);
    });

    it("returns correct cost multiplier for standard (1.0)", () => {
      expect(getCyberwareGradeCostMultiplier("standard")).toBe(1.0);
    });

    it("returns correct cost multiplier for alpha (2.0)", () => {
      expect(getCyberwareGradeCostMultiplier("alpha")).toBe(2.0);
    });

    it("returns correct cost multiplier for delta (10.0)", () => {
      expect(getCyberwareGradeCostMultiplier("delta")).toBe(10.0);
    });
  });

  describe("getCyberwareGradeAvailabilityModifier", () => {
    it("returns correct availability modifier for used (-4)", () => {
      expect(getCyberwareGradeAvailabilityModifier("used")).toBe(-4);
    });

    it("returns correct availability modifier for standard (0)", () => {
      expect(getCyberwareGradeAvailabilityModifier("standard")).toBe(0);
    });

    it("returns correct availability modifier for alpha (+2)", () => {
      expect(getCyberwareGradeAvailabilityModifier("alpha")).toBe(2);
    });

    it("returns correct availability modifier for delta (+8)", () => {
      expect(getCyberwareGradeAvailabilityModifier("delta")).toBe(8);
    });
  });

  describe("getCyberwareGradeMultipliers", () => {
    it("returns complete multiplier set for alpha", () => {
      const multipliers = getCyberwareGradeMultipliers("alpha");
      expect(multipliers.essenceMultiplier).toBe(0.8);
      expect(multipliers.costMultiplier).toBe(2.0);
      expect(multipliers.availabilityModifier).toBe(2);
    });
  });
});

// =============================================================================
// BIOWARE GRADE MULTIPLIERS
// =============================================================================

describe("Bioware Grade Multipliers", () => {
  describe("getBiowareGradeMultiplier", () => {
    it("returns correct essence multiplier for standard (1.0)", () => {
      expect(getBiowareGradeMultiplier("standard")).toBe(1.0);
    });

    it("returns correct essence multiplier for alpha (0.8)", () => {
      expect(getBiowareGradeMultiplier("alpha")).toBe(0.8);
    });

    it("returns correct essence multiplier for beta (0.6)", () => {
      expect(getBiowareGradeMultiplier("beta")).toBe(0.6);
    });

    it("returns correct essence multiplier for delta (0.5)", () => {
      expect(getBiowareGradeMultiplier("delta")).toBe(0.5);
    });
  });

  describe("getBiowareGradeMultipliers", () => {
    it("returns complete multiplier set for beta", () => {
      const multipliers = getBiowareGradeMultipliers("beta");
      expect(multipliers.essenceMultiplier).toBe(0.6);
      expect(multipliers.costMultiplier).toBe(4.0);
      expect(multipliers.availabilityModifier).toBe(4);
    });
  });
});

// =============================================================================
// GRADE APPLICATION
// =============================================================================

describe("Grade Application", () => {
  describe("applyGradeToEssence", () => {
    it("applies cyberware grade correctly", () => {
      expect(applyGradeToEssence(1.0, "alpha", true)).toBe(0.8);
      expect(applyGradeToEssence(1.0, "used", true)).toBe(1.25);
    });

    it("applies bioware grade correctly", () => {
      expect(applyGradeToEssence(1.0, "alpha", false)).toBe(0.8);
      expect(applyGradeToEssence(2.0, "delta", false)).toBe(1.0);
    });

    it("maintains 2 decimal precision", () => {
      expect(applyGradeToEssence(0.1, "used", true)).toBe(0.13);
    });
  });

  describe("applyGradeToCost", () => {
    it("applies cyberware cost multiplier correctly", () => {
      expect(applyGradeToCost(1000, "alpha", true)).toBe(2000);
      expect(applyGradeToCost(1000, "used", true)).toBe(750);
    });

    it("rounds to whole number", () => {
      expect(applyGradeToCost(333, "alpha", true)).toBe(666);
    });
  });

  describe("applyGradeToAvailability", () => {
    it("applies cyberware availability modifier correctly", () => {
      expect(applyGradeToAvailability(8, "alpha", true)).toBe(10);
      expect(applyGradeToAvailability(8, "used", true)).toBe(4);
    });

    it("clamps to minimum of 0", () => {
      expect(applyGradeToAvailability(2, "used", true)).toBe(0);
    });
  });

  describe("applyGradeToAll", () => {
    it("applies all multipliers correctly", () => {
      const result = applyGradeToAll(0.2, 4000, 8, "alpha", true);
      expect(result.essenceCost).toBe(0.16);
      expect(result.cost).toBe(8000);
      expect(result.availability).toBe(10);
    });
  });
});

// =============================================================================
// GRADE VALIDATION
// =============================================================================

describe("Grade Validation", () => {
  describe("isValidCyberwareGrade", () => {
    it("accepts valid cyberware grades", () => {
      expect(isValidCyberwareGrade("used")).toBe(true);
      expect(isValidCyberwareGrade("standard")).toBe(true);
      expect(isValidCyberwareGrade("alpha")).toBe(true);
      expect(isValidCyberwareGrade("beta")).toBe(true);
      expect(isValidCyberwareGrade("delta")).toBe(true);
    });

    it("rejects invalid grades", () => {
      expect(isValidCyberwareGrade("invalid")).toBe(false);
      expect(isValidCyberwareGrade("")).toBe(false);
    });
  });

  describe("isValidBiowareGrade", () => {
    it("accepts valid bioware grades", () => {
      expect(isValidBiowareGrade("standard")).toBe(true);
      expect(isValidBiowareGrade("alpha")).toBe(true);
      expect(isValidBiowareGrade("beta")).toBe(true);
      expect(isValidBiowareGrade("delta")).toBe(true);
    });

    it("rejects used grade for bioware", () => {
      expect(isValidBiowareGrade("used")).toBe(false);
    });
  });

  describe("getGradeDisplayName", () => {
    it("returns display names", () => {
      expect(getGradeDisplayName("used")).toBe("Used");
      expect(getGradeDisplayName("standard")).toBe("Standard");
      expect(getGradeDisplayName("alpha")).toBe("Alphaware");
      expect(getGradeDisplayName("beta")).toBe("Betaware");
      expect(getGradeDisplayName("delta")).toBe("Deltaware");
    });
  });

  describe("getCyberwareGrades", () => {
    it("returns all cyberware grades in order", () => {
      const grades = getCyberwareGrades();
      expect(grades).toEqual(["used", "standard", "alpha", "beta", "delta"]);
    });
  });

  describe("getBiowareGrades", () => {
    it("returns all bioware grades in order (no used)", () => {
      const grades = getBiowareGrades();
      expect(grades).toEqual(["standard", "alpha", "beta", "delta"]);
    });
  });
});

// =============================================================================
// GRADE COMPARISON
// =============================================================================

describe("Grade Comparison", () => {
  describe("compareGrades", () => {
    it("compares grades by quality", () => {
      expect(compareGrades("used", "standard")).toBeLessThan(0);
      expect(compareGrades("standard", "standard")).toBe(0);
      expect(compareGrades("delta", "alpha")).toBeGreaterThan(0);
    });
  });

  describe("isValidGradeUpgrade", () => {
    it("allows upgrading to higher grade", () => {
      expect(isValidGradeUpgrade("used", "standard")).toBe(true);
      expect(isValidGradeUpgrade("standard", "alpha")).toBe(true);
      expect(isValidGradeUpgrade("alpha", "delta")).toBe(true);
    });

    it("rejects downgrading", () => {
      expect(isValidGradeUpgrade("alpha", "standard")).toBe(false);
      expect(isValidGradeUpgrade("delta", "beta")).toBe(false);
    });

    it("rejects same grade", () => {
      expect(isValidGradeUpgrade("alpha", "alpha")).toBe(false);
    });
  });

  describe("calculateGradeUpgradeEssenceRefund", () => {
    it("calculates essence refund for upgrade", () => {
      // Upgrading from standard (1.0x) to alpha (0.8x)
      // Base 1.0 essence: 1.0 -> 0.8 = 0.2 refund
      const refund = calculateGradeUpgradeEssenceRefund(1.0, "standard", "alpha", true);
      expect(refund).toBe(0.2);
    });

    it("calculates larger refund for bigger upgrade", () => {
      // Upgrading from used (1.25x) to delta (0.5x)
      // Base 2.0 essence: 2.5 -> 1.0 = 1.5 refund
      const refund = calculateGradeUpgradeEssenceRefund(2.0, "used", "delta", true);
      expect(refund).toBe(1.5);
    });
  });
});
