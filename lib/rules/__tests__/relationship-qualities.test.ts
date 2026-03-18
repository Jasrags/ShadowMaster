/**
 * Tests for relationship quality mechanics (Run Faster pp. 177-178)
 *
 * Relationship qualities modify how the chip economy and social mechanics
 * work for specific contacts. Blackmail and Family are the two quality types.
 */

import { describe, it, expect } from "vitest";
import {
  getBlackmailModifiers,
  getFamilyModifiers,
  calculateReputationLoyaltyCostModifier,
  resolveIntimidation,
  resolveConSeduction,
  getEffectiveLoyaltyForTest,
  getChipCostModifier,
  type RelationshipQuality,
} from "../relationship-qualities";

// =============================================================================
// BLACKMAIL QUALITY
// =============================================================================

describe("getBlackmailModifiers", () => {
  it("should grant free favors (zero chip cost)", () => {
    const mods = getBlackmailModifiers();
    expect(mods.favorChipCostOverride).toBe(0);
  });

  it("should require Intimidation for interactions", () => {
    const mods = getBlackmailModifiers();
    expect(mods.requiredSkill).toBe("intimidation");
  });

  it("should prevent contact from leaving", () => {
    const mods = getBlackmailModifiers();
    expect(mods.contactCanLeave).toBe(false);
  });

  it("should cost 2 karma", () => {
    const mods = getBlackmailModifiers();
    expect(mods.karmaCost).toBe(2);
  });
});

// =============================================================================
// FAMILY QUALITY
// =============================================================================

describe("getFamilyModifiers", () => {
  it("should grant +1 loyalty for tests", () => {
    const mods = getFamilyModifiers();
    expect(mods.loyaltyTestBonus).toBe(1);
  });

  it("should reduce chip cost to improve loyalty by 1", () => {
    const mods = getFamilyModifiers();
    expect(mods.loyaltyImprovementChipDiscount).toBe(1);
  });

  it("should apply -1 loyalty for actual job performance", () => {
    const mods = getFamilyModifiers();
    expect(mods.jobPerformanceLoyaltyPenalty).toBe(-1);
  });

  it("should cost 1 karma", () => {
    const mods = getFamilyModifiers();
    expect(mods.karmaCost).toBe(1);
  });
});

// =============================================================================
// EFFECTIVE LOYALTY FOR TESTS
// =============================================================================

describe("getEffectiveLoyaltyForTest", () => {
  it("should return base loyalty when no qualities", () => {
    expect(getEffectiveLoyaltyForTest(3, [])).toBe(3);
  });

  it("should add +1 for family quality", () => {
    expect(getEffectiveLoyaltyForTest(3, ["family"])).toBe(4);
  });

  it("should not modify for blackmail quality", () => {
    expect(getEffectiveLoyaltyForTest(3, ["blackmail"])).toBe(3);
  });

  it("should cap at 6 even with bonus", () => {
    expect(getEffectiveLoyaltyForTest(6, ["family"])).toBe(6);
  });

  it("should handle empty qualities array", () => {
    expect(getEffectiveLoyaltyForTest(4, [])).toBe(4);
  });
});

// =============================================================================
// CHIP COST MODIFIER
// =============================================================================

describe("getChipCostModifier", () => {
  it("should return 0 cost for blackmail (free favors)", () => {
    const result = getChipCostModifier(3, ["blackmail"]);
    expect(result.adjustedCost).toBe(0);
    expect(result.reason).toContain("blackmail");
  });

  it("should return base cost when no qualities", () => {
    const result = getChipCostModifier(3, []);
    expect(result.adjustedCost).toBe(3);
  });

  it("should reduce loyalty improvement chip cost by 1 for family", () => {
    const result = getChipCostModifier(4, ["family"]);
    expect(result.adjustedCost).toBe(3);
  });

  it("should not reduce below 0 for family", () => {
    const result = getChipCostModifier(0, ["family"]);
    expect(result.adjustedCost).toBe(0);
  });

  it("should prioritize blackmail over family if both present", () => {
    const result = getChipCostModifier(3, ["blackmail", "family"]);
    expect(result.adjustedCost).toBe(0);
  });
});

// =============================================================================
// REPUTATION-BASED LOYALTY COST MODIFIER
// =============================================================================

describe("calculateReputationLoyaltyCostModifier", () => {
  it("should return no modifier when Street Cred >= Notoriety", () => {
    const result = calculateReputationLoyaltyCostModifier(5, 3);
    expect(result.extraKarma).toBe(0);
    expect(result.extraChips).toBe(0);
  });

  it("should return no modifier when equal", () => {
    const result = calculateReputationLoyaltyCostModifier(4, 4);
    expect(result.extraKarma).toBe(0);
    expect(result.extraChips).toBe(0);
  });

  it("should cost +1 karma or +2 chips per 2 points excess notoriety", () => {
    // Notoriety 6, Street Cred 2 → excess 4 → 2 increments → +2 karma or +4 chips
    const result = calculateReputationLoyaltyCostModifier(2, 6);
    expect(result.extraKarma).toBe(2);
    expect(result.extraChips).toBe(4);
  });

  it("should round down odd excess (1 excess = 0 increments)", () => {
    // Notoriety 4, Street Cred 3 → excess 1 → 0 increments
    const result = calculateReputationLoyaltyCostModifier(3, 4);
    expect(result.extraKarma).toBe(0);
    expect(result.extraChips).toBe(0);
  });

  it("should handle 2 excess (1 increment)", () => {
    // Notoriety 5, Street Cred 3 → excess 2 → 1 increment → +1 karma or +2 chips
    const result = calculateReputationLoyaltyCostModifier(3, 5);
    expect(result.extraKarma).toBe(1);
    expect(result.extraChips).toBe(2);
  });

  it("should handle large excess", () => {
    // Notoriety 10, Street Cred 0 → excess 10 → 5 increments → +5 karma or +10 chips
    const result = calculateReputationLoyaltyCostModifier(0, 10);
    expect(result.extraKarma).toBe(5);
    expect(result.extraChips).toBe(10);
  });
});

// =============================================================================
// INTIMIDATION RESOLUTION
// =============================================================================

describe("resolveIntimidation", () => {
  it("should immediately reduce loyalty by 1", () => {
    const result = resolveIntimidation(4);
    expect(result.loyaltyChange).toBe(-1);
    expect(result.newLoyalty).toBe(3);
  });

  it("should permanently block future loyalty improvement", () => {
    const result = resolveIntimidation(4);
    expect(result.loyaltyImprovementBlocked).toBe(true);
  });

  it("should flag contact as lost when loyalty reaches 0", () => {
    const result = resolveIntimidation(1);
    expect(result.newLoyalty).toBe(0);
    expect(result.contactLost).toBe(true);
  });

  it("should not flag contact as lost when loyalty stays above 0", () => {
    const result = resolveIntimidation(3);
    expect(result.contactLost).toBe(false);
  });
});

// =============================================================================
// CON/SEDUCTION RESOLUTION
// =============================================================================

describe("resolveConSeduction", () => {
  it("should maintain loyalty on success (hits > opposing)", () => {
    const result = resolveConSeduction(3, 4, 2);
    expect(result.success).toBe(true);
    expect(result.loyaltyChange).toBe(0);
  });

  it("should reduce loyalty by 1 on failure (hits <= opposing)", () => {
    const result = resolveConSeduction(3, 1, 3);
    expect(result.success).toBe(false);
    expect(result.loyaltyChange).toBe(-1);
    expect(result.newLoyalty).toBe(2);
  });

  it("should treat tie as failure", () => {
    const result = resolveConSeduction(3, 2, 2);
    expect(result.success).toBe(false);
    expect(result.loyaltyChange).toBe(-1);
  });

  it("should flag contact as lost when loyalty reaches 0", () => {
    const result = resolveConSeduction(1, 0, 3);
    expect(result.contactLost).toBe(true);
    expect(result.newLoyalty).toBe(0);
  });
});
