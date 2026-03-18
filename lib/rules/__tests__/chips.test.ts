/**
 * Tests for chip economy mechanics (Run Faster pp. 177-178)
 *
 * The chip system tracks mutual obligations between characters and contacts.
 * Chips are gained/lost through favors and can be spent on dice bonuses
 * or loyalty improvements.
 */

import { describe, it, expect } from "vitest";
import {
  calculateChipGain,
  calculateRepaymentCost,
  getDebtTimeframe,
  calculateChipDiceBonus,
  calculateLoyaltyImprovementCost,
  isSecondaryServiceUse,
} from "../chips";
import type { SocialContact, FavorServiceDefinition, ContactArchetype } from "@/lib/types";

// =============================================================================
// MOCK FACTORIES
// =============================================================================

function createMockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: "contact-1",
    name: "Test Contact",
    connection: 4,
    loyalty: 3,
    archetype: "Fixer",
    archetypeId: "fixer",
    status: "active",
    favorBalance: 0,
    group: "personal",
    visibility: {
      playerVisible: true,
      showConnection: true,
      showLoyalty: true,
      showFavorBalance: true,
      showSpecializations: true,
    },
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  } as SocialContact;
}

function createMockService(
  overrides: Partial<FavorServiceDefinition> = {}
): FavorServiceDefinition {
  return {
    id: "service-1",
    name: "Test Service",
    description: "A test service",
    minimumConnection: 1,
    minimumLoyalty: 1,
    favorCost: 1,
    riskLevel: "low",
    burnRiskOnFailure: false,
    opposedTest: false,
    typicalTime: "1 hour",
    canRush: false,
    ...overrides,
  };
}

// =============================================================================
// CHIP GAIN/LOSS
// =============================================================================

describe("calculateChipGain", () => {
  it("should grant contact chips equal to favor rating when character requests favor", () => {
    const result = calculateChipGain({ favorRating: 3, direction: "character-requests" });
    // Contact gains chips (negative for character = character owes)
    expect(result).toBe(-3);
  });

  it("should grant character chips when completing work for contact", () => {
    const result = calculateChipGain({ favorRating: 2, direction: "character-provides" });
    // Character gains chips (positive = contact owes character)
    expect(result).toBe(2);
  });

  it("should handle zero favor rating", () => {
    expect(calculateChipGain({ favorRating: 0, direction: "character-requests" })).toBe(0);
    expect(calculateChipGain({ favorRating: 0, direction: "character-provides" })).toBe(0);
  });

  it("should return 0 for negative favor rating", () => {
    expect(calculateChipGain({ favorRating: -2, direction: "character-requests" })).toBe(0);
    expect(calculateChipGain({ favorRating: -1, direction: "character-provides" })).toBe(0);
  });
});

// =============================================================================
// REPAYMENT COST (2× MULTIPLIER)
// =============================================================================

describe("calculateRepaymentCost", () => {
  it("should require 2× the chip value for repayment", () => {
    expect(calculateRepaymentCost(3)).toBe(6);
  });

  it("should handle single chip", () => {
    expect(calculateRepaymentCost(1)).toBe(2);
  });

  it("should handle zero chips", () => {
    expect(calculateRepaymentCost(0)).toBe(0);
  });

  it("should handle negative input by using absolute value", () => {
    expect(calculateRepaymentCost(-3)).toBe(6);
  });
});

describe("calculateRepaymentCost with nuyen", () => {
  it("should calculate cash repayment at 2× market value", () => {
    const result = calculateRepaymentCost(3, { marketValuePerChip: 500 });
    expect(result).toBe(3000); // 3 chips × 500¥/chip × 2
  });

  it("should return nuyen amount for cash payment", () => {
    const result = calculateRepaymentCost(1, { marketValuePerChip: 1000 });
    expect(result).toBe(2000); // 1 × 1000 × 2
  });

  it("should fall back to chip-based cost when marketValuePerChip is 0", () => {
    // Zero market value is invalid — falls back to chip multiplier
    const result = calculateRepaymentCost(3, { marketValuePerChip: 0 });
    expect(result).toBe(6); // 3 × 2 (chip-based, not nuyen-based)
  });
});

// =============================================================================
// DEBT TIMEFRAMES
// =============================================================================

describe("getDebtTimeframe", () => {
  it("should return 4 weeks for debts ≤100¥", () => {
    expect(getDebtTimeframe(50)).toBe(4);
    expect(getDebtTimeframe(100)).toBe(4);
  });

  it("should return 3 weeks for debts 101-1,000¥", () => {
    expect(getDebtTimeframe(101)).toBe(3);
    expect(getDebtTimeframe(500)).toBe(3);
    expect(getDebtTimeframe(1000)).toBe(3);
  });

  it("should return 2 weeks for debts 1,001-10,000¥", () => {
    expect(getDebtTimeframe(1001)).toBe(2);
    expect(getDebtTimeframe(5000)).toBe(2);
    expect(getDebtTimeframe(10000)).toBe(2);
  });

  it("should return 1 week for debts 10,001-100,000¥", () => {
    expect(getDebtTimeframe(10001)).toBe(1);
    expect(getDebtTimeframe(50000)).toBe(1);
    expect(getDebtTimeframe(100000)).toBe(1);
  });

  it("should return 1 week for debts over 100,000¥", () => {
    expect(getDebtTimeframe(100001)).toBe(1);
    expect(getDebtTimeframe(1000000)).toBe(1);
  });

  it("should return 4 weeks for zero debt", () => {
    expect(getDebtTimeframe(0)).toBe(4);
  });
});

// =============================================================================
// CHIP DICE BONUS
// =============================================================================

describe("calculateChipDiceBonus", () => {
  it("should grant +1 die per chip spent", () => {
    expect(calculateChipDiceBonus(1)).toBe(1);
    expect(calculateChipDiceBonus(2)).toBe(2);
    expect(calculateChipDiceBonus(3)).toBe(3);
  });

  it("should cap at +4 dice maximum", () => {
    expect(calculateChipDiceBonus(4)).toBe(4);
    expect(calculateChipDiceBonus(5)).toBe(4);
    expect(calculateChipDiceBonus(10)).toBe(4);
  });

  it("should return 0 for zero chips", () => {
    expect(calculateChipDiceBonus(0)).toBe(0);
  });

  it("should return 0 for negative chips", () => {
    expect(calculateChipDiceBonus(-1)).toBe(0);
  });
});

// =============================================================================
// LOYALTY IMPROVEMENT VIA CHIPS
// =============================================================================

describe("calculateLoyaltyImprovementCost", () => {
  it("should require chips equal to target loyalty level", () => {
    // Improving from Loyalty 2 → 3 costs 3 chips
    const result = calculateLoyaltyImprovementCost(2, 3);
    expect(result.valid).toBe(true);
    expect(result.chipsRequired).toBe(3);
  });

  it("should require downtime weeks equal to target loyalty level", () => {
    const result = calculateLoyaltyImprovementCost(2, 3);
    expect(result.downtimeWeeks).toBe(3);
  });

  it("should reject multi-level jumps (must improve one level at a time)", () => {
    const result = calculateLoyaltyImprovementCost(1, 4);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("one level at a time");
  });

  it("should reject invalid improvements (same level)", () => {
    const result = calculateLoyaltyImprovementCost(3, 3);
    expect(result.valid).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it("should reject invalid improvements (decrease)", () => {
    const result = calculateLoyaltyImprovementCost(4, 2);
    expect(result.valid).toBe(false);
  });

  it("should reject improvements above max loyalty (6)", () => {
    const result = calculateLoyaltyImprovementCost(6, 7);
    expect(result.valid).toBe(false);
  });

  it("should reject currentLoyalty below minimum (1)", () => {
    const result = calculateLoyaltyImprovementCost(0, 1);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("at least 1");
  });

  it("should allow improvement to max loyalty (6)", () => {
    const result = calculateLoyaltyImprovementCost(5, 6);
    expect(result.valid).toBe(true);
    expect(result.chipsRequired).toBe(6);
    expect(result.downtimeWeeks).toBe(6);
  });

  it("should correctly price each single-step improvement", () => {
    // Verify the full ladder: 1→2=2, 2→3=3, 3→4=4, 4→5=5, 5→6=6
    for (let current = 1; current < 6; current++) {
      const result = calculateLoyaltyImprovementCost(current, current + 1);
      expect(result.valid).toBe(true);
      expect(result.chipsRequired).toBe(current + 1);
      expect(result.downtimeWeeks).toBe(current + 1);
    }
  });
});

// =============================================================================
// SECONDARY SERVICE USE (generates chips)
// =============================================================================

describe("isSecondaryServiceUse", () => {
  it("should return false when service matches contact primary type", () => {
    const contact = createMockContact({ archetypeId: "fixer" });
    const service = createMockService({ archetypeIds: ["fixer"] });

    expect(isSecondaryServiceUse(contact, service)).toBe(false);
  });

  it("should return true when service does not match contact primary type", () => {
    const contact = createMockContact({ archetypeId: "fixer" });
    const service = createMockService({ archetypeIds: ["street-doc"] });

    expect(isSecondaryServiceUse(contact, service)).toBe(true);
  });

  it("should return false when service has no archetype restriction", () => {
    const contact = createMockContact({ archetypeId: "fixer" });
    const service = createMockService({ archetypeIds: undefined });

    expect(isSecondaryServiceUse(contact, service)).toBe(false);
  });

  it("should return false when service lists multiple archetypes including contact", () => {
    const contact = createMockContact({ archetypeId: "fixer" });
    const service = createMockService({ archetypeIds: ["fixer", "street-doc", "mr-johnson"] });

    expect(isSecondaryServiceUse(contact, service)).toBe(false);
  });
});
