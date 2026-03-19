/**
 * Tests for contact rules and validation (lib/rules/contacts.ts)
 *
 * Covers:
 * - validateContact() basic validation
 * - validateContact() organization contact integration
 * - Loyalty improvement blocked checks
 * - validateContactAgainstCampaign()
 */

import { describe, it, expect } from "vitest";
import {
  validateContact,
  validateContactAgainstCampaign,
  isLoyaltyImprovementAllowed,
  getMaxConnection,
  getMaxLoyalty,
} from "../contacts";
import type { SocialContact, SocialCapital, CreateContactRequest } from "@/lib/types/contacts";

// =============================================================================
// HELPERS
// =============================================================================

function createMockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: "contact-1",
    name: "Mr. Johnson",
    connection: 3,
    loyalty: 2,
    archetype: "Fixer",
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
  };
}

function createMockSocialCapital(overrides: Partial<SocialCapital> = {}): SocialCapital {
  return {
    characterId: "test-char",
    maxContactPoints: 20,
    usedContactPoints: 5,
    availableContactPoints: 15,
    totalContacts: 3,
    activeContacts: 2,
    burnedContacts: 0,
    inactiveContacts: 1,
    networkingBonus: 0,
    socialLimitModifier: 0,
    loyaltyBonus: 0,
    updatedAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

// =============================================================================
// BASIC VALIDATION
// =============================================================================

describe("validateContact", () => {
  it("should validate a valid contact", () => {
    const result = validateContact(
      { name: "Fixer", connection: 3, loyalty: 2, archetype: "Fixer" },
      "sr5"
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should reject missing name", () => {
    const result = validateContact(
      { name: "", connection: 3, loyalty: 2, archetype: "Fixer" },
      "sr5"
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Contact name is required");
  });

  it("should reject connection above max for edition", () => {
    const result = validateContact(
      { name: "Test", connection: 13, loyalty: 2, archetype: "Fixer" },
      "sr5"
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/cannot exceed 12/);
  });

  it("should reject loyalty above max for edition", () => {
    const result = validateContact(
      { name: "Test", connection: 3, loyalty: 7, archetype: "Fixer" },
      "sr5"
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/cannot exceed 6/);
  });

  // ---------------------------------------------------------------------------
  // Organization contact integration
  // ---------------------------------------------------------------------------

  describe("organization contact validation", () => {
    it("should add organization errors when group is 'organization' and loyalty > 1", () => {
      const result = validateContact(
        {
          name: "Street Gang",
          connection: 3,
          loyalty: 3,
          archetype: "Organization",
          group: "organization",
        } as Partial<SocialContact>,
        "sr5"
      );
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.toLowerCase().includes("loyalty"))).toBe(true);
    });

    it("should pass organization validation when loyalty is 1", () => {
      const result = validateContact(
        {
          name: "Street Gang",
          connection: 3,
          loyalty: 1,
          archetype: "Organization",
          group: "organization",
        } as Partial<SocialContact>,
        "sr5"
      );
      expect(result.valid).toBe(true);
    });

    it("should not run organization checks for personal contacts", () => {
      const result = validateContact(
        {
          name: "Mr. Johnson",
          connection: 3,
          loyalty: 4,
          archetype: "Fixer",
          group: "personal",
        } as Partial<SocialContact>,
        "sr5"
      );
      expect(result.valid).toBe(true);
    });
  });
});

// =============================================================================
// LOYALTY IMPROVEMENT BLOCKED
// =============================================================================

describe("isLoyaltyImprovementAllowed", () => {
  it("should allow loyalty improvement for normal contacts", () => {
    const contact = createMockContact({ loyaltyImprovementBlocked: false });
    expect(isLoyaltyImprovementAllowed(contact)).toBe(true);
  });

  it("should block loyalty improvement when loyaltyImprovementBlocked is true", () => {
    const contact = createMockContact({ loyaltyImprovementBlocked: true });
    expect(isLoyaltyImprovementAllowed(contact)).toBe(false);
  });

  it("should allow loyalty improvement when field is undefined (default)", () => {
    const contact = createMockContact();
    // Field not set — should default to allowed
    expect(isLoyaltyImprovementAllowed(contact)).toBe(true);
  });
});

// =============================================================================
// CAMPAIGN VALIDATION
// =============================================================================

describe("validateContactAgainstCampaign", () => {
  it("should reject when campaign contact limit reached", () => {
    const socialCapital = createMockSocialCapital({
      campaignContactLimit: 5,
      activeContacts: 5,
    });
    const result = validateContactAgainstCampaign(
      { connection: 3, loyalty: 2, name: "Test", archetype: "Fixer" },
      socialCapital
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/contact limit/);
  });

  it("should reject when connection exceeds campaign max", () => {
    const socialCapital = createMockSocialCapital({
      campaignMaxConnection: 6,
    });
    const result = validateContactAgainstCampaign(
      { connection: 8, loyalty: 2, name: "Test", archetype: "Fixer" },
      socialCapital
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/exceeds campaign limit/);
  });
});
