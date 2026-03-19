/**
 * Integration tests: chip economy wired into favor transaction flow
 *
 * Validates the full pipeline from favor request through chip cost
 * calculation, relationship quality adjustments, and organization blocking.
 */

import { describe, it, expect } from "vitest";
import { calculateFavorCost, canCallFavor, resolveFavorCall } from "../favors";
import { calculateChipDiceBonus, calculateLoyaltyImprovementCost } from "../chips";
import { getChipCostModifier } from "../relationship-qualities";
import type { SocialContact, FavorServiceDefinition } from "@/lib/types";
import type { Character } from "@/lib/types";

// =============================================================================
// MOCK FACTORIES
// =============================================================================

function createContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: "contact-1",
    name: "Test Contact",
    connection: 4,
    loyalty: 3,
    archetype: "Fixer",
    archetypeId: "fixer",
    status: "active",
    favorBalance: 5,
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

function createService(overrides: Partial<FavorServiceDefinition> = {}): FavorServiceDefinition {
  return {
    id: "service-1",
    name: "Test Service",
    description: "A test service",
    minimumConnection: 1,
    minimumLoyalty: 1,
    favorCost: 2,
    riskLevel: "low",
    burnRiskOnFailure: false,
    opposedTest: false,
    typicalTime: "1 hour",
    canRush: false,
    archetypeIds: ["fixer"],
    ...overrides,
  };
}

function createCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    userId: "user-1",
    name: "Test Runner",
    editionCode: "sr5",
    nuyen: 10000,
    karmaCurrent: 25,
    karmaTotal: 25,
    ...overrides,
  } as Character;
}

// =============================================================================
// FULL FAVOR FLOW WITH CHIP ADJUSTMENTS
// =============================================================================

describe("Chip-Favor Integration", () => {
  describe("full favor flow with chip adjustments", () => {
    it("calculates chip cost, then resolves with adjusted cost", () => {
      const contact = createContact({ archetypeId: "fixer" });
      const service = createService({ favorCost: 2, archetypeIds: ["fixer"] });
      const character = createCharacter();

      const costs = calculateFavorCost(service, contact, character);
      expect(costs.chipCostBreakdown.finalChipCost).toBe(2);

      const resolution = resolveFavorCall(
        contact,
        service,
        character,
        3, // successful roll
        undefined,
        costs.chipCostBreakdown.finalChipCost
      );

      expect(resolution.success).toBe(true);
      expect(resolution.favorConsumed).toBe(2);
    });
  });

  describe("blackmail: 0-cost favor", () => {
    it("makes favor free regardless of base cost", () => {
      const contact = createContact({
        relationshipQualities: ["blackmail"],
      });
      const service = createService({ favorCost: 5 });
      const character = createCharacter();

      const costs = calculateFavorCost(service, contact, character);
      expect(costs.chipCostBreakdown.finalChipCost).toBe(0);
      expect(costs.chipCostBreakdown.qualityAdjustment.reason).toContain("blackmail");

      const resolution = resolveFavorCall(
        contact,
        service,
        character,
        3,
        undefined,
        costs.chipCostBreakdown.finalChipCost
      );

      expect(resolution.favorConsumed).toBe(0);
    });
  });

  describe("family: -1 discount with secondary surcharge", () => {
    it("applies surcharge first then family discount", () => {
      const contact = createContact({
        archetypeId: "street-doc",
        relationshipQualities: ["family"],
      });
      const service = createService({
        favorCost: 2,
        archetypeIds: ["fixer"], // street-doc != fixer → secondary
      });
      const character = createCharacter();

      const costs = calculateFavorCost(service, contact, character);

      // 2 base + 1 surcharge = 3, then family -1 = 2
      expect(costs.chipCostBreakdown.secondarySurcharge).toBe(1);
      expect(costs.chipCostBreakdown.finalChipCost).toBe(2);
    });
  });

  describe("organization: blocked", () => {
    it("prevents organization contacts from calling favors", () => {
      const contact = createContact({ group: "organization" });
      const service = createService();
      const character = createCharacter();

      const check = canCallFavor(contact, service, character);

      expect(check.allowed).toBe(false);
      expect(check.reasons.some((r) => r.includes("Organization"))).toBe(true);
    });
  });

  describe("dice bonus: spend + cap at 4", () => {
    it("caps dice bonus at 4 even when spending more chips", () => {
      expect(calculateChipDiceBonus(1)).toBe(1);
      expect(calculateChipDiceBonus(3)).toBe(3);
      expect(calculateChipDiceBonus(4)).toBe(4);
      expect(calculateChipDiceBonus(5)).toBe(4); // capped
      expect(calculateChipDiceBonus(10)).toBe(4); // capped
    });
  });

  describe("loyalty improvement: chip cost with family discount", () => {
    it("calculates base cost then applies family discount", () => {
      // Improving from loyalty 3 → 4 costs 4 chips
      const baseCost = calculateLoyaltyImprovementCost(3, 4);
      expect(baseCost.valid).toBe(true);
      expect(baseCost.chipsRequired).toBe(4);

      // Family quality reduces cost by 1
      const familyAdj = getChipCostModifier(baseCost.chipsRequired, ["family"]);
      expect(familyAdj.adjustedCost).toBe(3); // 4 - 1
    });

    it("blackmail makes loyalty improvement free", () => {
      const baseCost = calculateLoyaltyImprovementCost(3, 4);
      expect(baseCost.chipsRequired).toBe(4);

      const blackmailAdj = getChipCostModifier(baseCost.chipsRequired, ["blackmail"]);
      expect(blackmailAdj.adjustedCost).toBe(0);
    });
  });
});
