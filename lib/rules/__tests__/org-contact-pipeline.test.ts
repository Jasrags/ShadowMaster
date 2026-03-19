/**
 * Integration tests: organization contact validation pipeline
 *
 * Validates that org contact restrictions are enforced at every layer:
 * - validateContact() rejects org contacts with Loyalty > 1
 * - canCallFavor() blocks org contacts from calling favors
 * - isLoyaltyImprovementAllowed() blocks org contacts
 * - validateLoyaltyUpdate() enforces Loyalty ≤ 1 for org contacts
 * - validateOrgContactKarmaBudget() enforces quality karma limit
 */

import { describe, it, expect } from "vitest";
import {
  validateContact,
  isLoyaltyImprovementAllowed,
  validateLoyaltyUpdate,
  validateOrgContactKarmaBudget,
} from "../contacts";
import { canCallFavor } from "../favors";
import { canOrganizationCallFavor, isAllowedServiceForOrganization } from "../group-contacts";
import type { SocialContact, FavorServiceDefinition } from "@/lib/types";
import type { Character } from "@/lib/types";

// =============================================================================
// MOCK FACTORIES
// =============================================================================

function createOrgContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: "org-1",
    name: "Street Gang",
    connection: 3,
    loyalty: 1,
    archetype: "Organization",
    status: "active",
    favorBalance: 0,
    group: "organization",
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

function createPersonalContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: "contact-1",
    name: "Fixer",
    connection: 4,
    loyalty: 3,
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
  } as SocialContact;
}

function createService(overrides: Partial<FavorServiceDefinition> = {}): FavorServiceDefinition {
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

function createCharacter(): Character {
  return {
    id: "char-1",
    userId: "user-1",
    name: "Runner",
    editionCode: "sr5",
    nuyen: 5000,
    karmaCurrent: 10,
    karmaTotal: 10,
  } as unknown as Character;
}

// =============================================================================
// validateContact — organization contact validation
// =============================================================================

describe("validateContact — org contacts", () => {
  it("rejects org contacts with Loyalty > 1", () => {
    const result = validateContact(
      {
        name: "Street Gang",
        connection: 3,
        loyalty: 2,
        archetype: "Organization",
        group: "organization",
      } as Partial<SocialContact>,
      "sr5"
    );

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.toLowerCase().includes("loyalty"))).toBe(true);
  });

  it("accepts org contacts with Loyalty = 1", () => {
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

  it("does not apply org restrictions to personal contacts", () => {
    const result = validateContact(
      {
        name: "Fixer",
        connection: 3,
        loyalty: 4,
        archetype: "Fixer",
        group: "personal",
      } as Partial<SocialContact>,
      "sr5"
    );

    expect(result.valid).toBe(true);
  });

  it("suppresses loyalty=1 betrayal warning for org contacts", () => {
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

    // Org contacts at loyalty 1 should NOT get the "may betray" warning
    expect(result.warnings).not.toEqual(
      expect.arrayContaining([expect.stringContaining("betray")])
    );
  });
});

// =============================================================================
// canCallFavor — org contact blocked
// =============================================================================

describe("canCallFavor — org contacts", () => {
  it("blocks org contacts from calling any favor", () => {
    const contact = createOrgContact();
    const service = createService();
    const character = createCharacter();

    const result = canCallFavor(contact, service, character);

    expect(result.allowed).toBe(false);
    expect(result.reasons.some((r) => r.includes("Organization"))).toBe(true);
  });

  it("allows personal contacts to call favors", () => {
    const contact = createPersonalContact();
    const service = createService();
    const character = createCharacter();

    const result = canCallFavor(contact, service, character);

    expect(result.allowed).toBe(true);
  });
});

// =============================================================================
// canOrganizationCallFavor — direct check
// =============================================================================

describe("canOrganizationCallFavor", () => {
  it("blocks organization contacts", () => {
    const contact = createOrgContact();
    const result = canOrganizationCallFavor(contact);

    expect(result.allowed).toBe(false);
    expect(result.reason).toBeDefined();
  });

  it("allows non-organization contacts", () => {
    const contact = createPersonalContact();
    const result = canOrganizationCallFavor(contact);

    expect(result.allowed).toBe(true);
  });
});

// =============================================================================
// isAllowedServiceForOrganization — service type filtering
// =============================================================================

describe("isAllowedServiceForOrganization", () => {
  it("allows legwork for org contacts", () => {
    expect(isAllowedServiceForOrganization("legwork")).toBe(true);
  });

  it("allows networking for org contacts", () => {
    expect(isAllowedServiceForOrganization("networking")).toBe(true);
  });

  it("blocks swag for org contacts", () => {
    expect(isAllowedServiceForOrganization("swag")).toBe(false);
  });

  it("blocks shadow-service for org contacts", () => {
    expect(isAllowedServiceForOrganization("shadow-service")).toBe(false);
  });

  it("blocks personal-favor for org contacts", () => {
    expect(isAllowedServiceForOrganization("personal-favor")).toBe(false);
  });

  it("blocks support for org contacts", () => {
    expect(isAllowedServiceForOrganization("support")).toBe(false);
  });
});

// =============================================================================
// isLoyaltyImprovementAllowed — org contacts blocked
// =============================================================================

describe("isLoyaltyImprovementAllowed — org contacts", () => {
  it("blocks loyalty improvement for organization contacts", () => {
    const contact = createOrgContact();
    expect(isLoyaltyImprovementAllowed(contact)).toBe(false);
  });

  it("allows loyalty improvement for personal contacts", () => {
    const contact = createPersonalContact();
    expect(isLoyaltyImprovementAllowed(contact)).toBe(true);
  });

  it("blocks loyalty improvement when loyaltyImprovementBlocked is set", () => {
    const contact = createPersonalContact({ loyaltyImprovementBlocked: true });
    expect(isLoyaltyImprovementAllowed(contact)).toBe(false);
  });
});

// =============================================================================
// validateLoyaltyUpdate — org loyalty cap
// =============================================================================

describe("validateLoyaltyUpdate", () => {
  it("blocks org contacts from exceeding Loyalty 1", () => {
    const contact = createOrgContact();
    const result = validateLoyaltyUpdate(contact, 2, "sr5");

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Organization");
  });

  it("allows org contacts to remain at Loyalty 1", () => {
    const contact = createOrgContact();
    const result = validateLoyaltyUpdate(contact, 1, "sr5");

    expect(result.allowed).toBe(true);
  });

  it("allows personal contacts to improve loyalty", () => {
    const contact = createPersonalContact({ loyalty: 3 });
    const result = validateLoyaltyUpdate(contact, 4, "sr5");

    expect(result.allowed).toBe(true);
  });

  it("blocks loyalty above edition max for personal contacts", () => {
    const contact = createPersonalContact({ loyalty: 6 });
    const result = validateLoyaltyUpdate(contact, 7, "sr5");

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("cannot exceed 6");
  });

  it("blocks loyalty below minimum", () => {
    const contact = createPersonalContact({ loyalty: 1 });
    const result = validateLoyaltyUpdate(contact, 0, "sr5");

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("less than 1");
  });

  it("blocks negative loyalty", () => {
    const contact = createPersonalContact({ loyalty: 1 });
    const result = validateLoyaltyUpdate(contact, -1, "sr5");

    expect(result.allowed).toBe(false);
  });
});

// =============================================================================
// validateOrgContactKarmaBudget — quality limit enforcement
// =============================================================================

describe("validateOrgContactKarmaBudget", () => {
  it("allows org contact when karma budget has room", () => {
    const result = validateOrgContactKarmaBudget("street-gang", 10);

    expect(result.allowed).toBe(true);
    expect(result.karmaCost).toBe(5); // street-gang costs 5 karma
  });

  it("blocks org contact when karma budget exceeded", () => {
    const result = validateOrgContactKarmaBudget("lone-star-god", 20);

    // lone-star-god costs 12, only 5 remaining (25 - 20)
    expect(result.allowed).toBe(false);
    expect(result.karmaCost).toBe(12);
    expect(result.reason).toContain("exceeds remaining");
  });

  it("allows org contact when exact budget remaining", () => {
    // humanis-policlub costs 10, 10 remaining (25 - 15)
    const result = validateOrgContactKarmaBudget("humanis-policlub", 15);

    expect(result.allowed).toBe(true);
    expect(result.karmaCost).toBe(10);
  });

  it("rejects unknown organization ID", () => {
    const result = validateOrgContactKarmaBudget("nonexistent-org", 0);

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Unknown organization");
  });

  it("handles zero existing karma spent", () => {
    const result = validateOrgContactKarmaBudget("lone-star-god", 0);

    expect(result.allowed).toBe(true);
    expect(result.karmaCost).toBe(12);
  });

  it("rejects negative karma spent value", () => {
    const result = validateOrgContactKarmaBudget("street-gang", -5);

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Invalid karma spent");
  });
});
