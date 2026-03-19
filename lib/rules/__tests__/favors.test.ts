/**
 * Tests for favor mechanics with chip economy integration
 *
 * Validates that calculateFavorCost applies secondary service surcharges,
 * relationship quality modifiers (blackmail=free, family=-1), and org
 * contact restrictions.
 */

import { describe, it, expect } from "vitest";
import { calculateFavorCost, canCallFavor, resolveFavorCall } from "../favors";
import type { SocialContact, FavorServiceDefinition } from "@/lib/types";
import type { Character } from "@/lib/types";

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

function createMockCharacter(overrides: Partial<Character> = {}): Character {
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
// calculateFavorCost — chip cost breakdown
// =============================================================================

describe("calculateFavorCost", () => {
  it("returns chipCostBreakdown with no modifiers applied", () => {
    const contact = createMockContact();
    const service = createMockService({ favorCost: 2 });
    const character = createMockCharacter();

    const result = calculateFavorCost(service, contact, character);

    expect(result.chipCostBreakdown).toBeDefined();
    expect(result.chipCostBreakdown.originalFavorCost).toBe(2);
    expect(result.chipCostBreakdown.secondarySurcharge).toBe(0);
    expect(result.chipCostBreakdown.qualityAdjustment.adjustedCost).toBe(2);
    expect(result.chipCostBreakdown.finalChipCost).toBe(2);
  });

  it("applies +1 secondary service surcharge for off-archetype use", () => {
    const contact = createMockContact({ archetypeId: "street-doc" });
    const service = createMockService({
      favorCost: 2,
      archetypeIds: ["fixer"], // contact is street-doc, not fixer
    });
    const character = createMockCharacter();

    const result = calculateFavorCost(service, contact, character);

    expect(result.chipCostBreakdown.secondarySurcharge).toBe(1);
    expect(result.chipCostBreakdown.originalFavorCost).toBe(2);
    // 2 + 1 surcharge = 3, then quality modifier (none) = 3
    expect(result.chipCostBreakdown.finalChipCost).toBe(3);
  });

  it("applies blackmail quality: cost becomes 0", () => {
    const contact = createMockContact({
      relationshipQualities: ["blackmail"],
    });
    const service = createMockService({ favorCost: 3 });
    const character = createMockCharacter();

    const result = calculateFavorCost(service, contact, character);

    expect(result.chipCostBreakdown.qualityAdjustment.adjustedCost).toBe(0);
    expect(result.chipCostBreakdown.qualityAdjustment.reason).toContain("blackmail");
    expect(result.chipCostBreakdown.finalChipCost).toBe(0);
  });

  it("applies family quality: -1 chip discount", () => {
    const contact = createMockContact({
      relationshipQualities: ["family"],
    });
    const service = createMockService({ favorCost: 3 });
    const character = createMockCharacter();

    const result = calculateFavorCost(service, contact, character);

    expect(result.chipCostBreakdown.qualityAdjustment.adjustedCost).toBe(2);
    expect(result.chipCostBreakdown.qualityAdjustment.reason).toContain("Family");
    expect(result.chipCostBreakdown.finalChipCost).toBe(2);
  });

  it("combines secondary surcharge with family discount", () => {
    const contact = createMockContact({
      archetypeId: "street-doc",
      relationshipQualities: ["family"],
    });
    const service = createMockService({
      favorCost: 2,
      archetypeIds: ["fixer"],
    });
    const character = createMockCharacter();

    const result = calculateFavorCost(service, contact, character);

    // 2 base + 1 surcharge = 3, then family -1 = 2
    expect(result.chipCostBreakdown.secondarySurcharge).toBe(1);
    expect(result.chipCostBreakdown.finalChipCost).toBe(2);
  });

  it("blackmail overrides secondary surcharge to 0", () => {
    const contact = createMockContact({
      archetypeId: "street-doc",
      relationshipQualities: ["blackmail"],
    });
    const service = createMockService({
      favorCost: 2,
      archetypeIds: ["fixer"],
    });
    const character = createMockCharacter();

    const result = calculateFavorCost(service, contact, character);

    // Blackmail makes everything free regardless of surcharge
    expect(result.chipCostBreakdown.finalChipCost).toBe(0);
  });

  it("family discount does not go below 0", () => {
    const contact = createMockContact({
      relationshipQualities: ["family"],
    });
    const service = createMockService({ favorCost: 1 });
    const character = createMockCharacter();

    const result = calculateFavorCost(service, contact, character);

    // 1 - 1 = 0, not negative
    expect(result.chipCostBreakdown.finalChipCost).toBe(0);
  });
});

// =============================================================================
// canCallFavor — organization contact gate
// =============================================================================

describe("canCallFavor", () => {
  it("blocks organization contacts from calling favors", () => {
    const contact = createMockContact({ group: "organization" });
    const service = createMockService();
    const character = createMockCharacter();

    const result = canCallFavor(contact, service, character);

    expect(result.allowed).toBe(false);
    expect(result.reasons).toEqual(
      expect.arrayContaining([expect.stringContaining("Organization contacts cannot use favors")])
    );
  });

  it("allows personal contacts to call favors", () => {
    const contact = createMockContact({ group: "personal" });
    const service = createMockService();
    const character = createMockCharacter();

    const result = canCallFavor(contact, service, character);

    expect(result.allowed).toBe(true);
  });

  it("allows shared contacts to call favors", () => {
    const contact = createMockContact({ group: "shared" });
    const service = createMockService();
    const character = createMockCharacter();

    const result = canCallFavor(contact, service, character);

    expect(result.allowed).toBe(true);
  });

  it("allows campaign contacts to call favors", () => {
    const contact = createMockContact({ group: "campaign" });
    const service = createMockService();
    const character = createMockCharacter();

    const result = canCallFavor(contact, service, character);

    expect(result.allowed).toBe(true);
  });
});

// =============================================================================
// resolveFavorCall — adjusted chip cost
// =============================================================================

describe("resolveFavorCall", () => {
  it("uses adjustedFavorCost when provided", () => {
    const contact = createMockContact();
    const service = createMockService({ favorCost: 3 });
    const character = createMockCharacter();

    const resolution = resolveFavorCall(contact, service, character, 2, undefined, 1);

    // adjustedFavorCost=1 is used instead of service.favorCost=3
    expect(resolution.favorConsumed).toBe(1);
  });

  it("falls back to service.favorCost when adjustedFavorCost not provided", () => {
    const contact = createMockContact();
    const service = createMockService({ favorCost: 3 });
    const character = createMockCharacter();

    const resolution = resolveFavorCall(contact, service, character, 2);

    expect(resolution.favorConsumed).toBe(3);
  });

  it("uses half of adjustedFavorCost on failure", () => {
    const contact = createMockContact();
    const service = createMockService({ favorCost: 3, threshold: 5 });
    const character = createMockCharacter();

    // diceRoll=1 < threshold=5, so failure
    const resolution = resolveFavorCall(contact, service, character, 1, undefined, 4);

    expect(resolution.success).toBe(false);
    // Math.floor(4 / 2) = 2
    expect(resolution.favorConsumed).toBe(2);
  });
});
