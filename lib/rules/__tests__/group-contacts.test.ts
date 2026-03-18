/**
 * Tests for group/organization contact restrictions (Run Faster p. 179)
 *
 * Organization contacts are faceless (Loyalty capped at 1), cannot use
 * favors/chips, and are limited to legwork and networking services only.
 */

import { describe, it, expect } from "vitest";
import {
  validateOrganizationContact,
  canOrganizationCallFavor,
  isAllowedServiceForOrganization,
  getOrganizationDefinition,
  getOrganizationDefinitions,
  type OrganizationDefinition,
} from "../group-contacts";
import type { SocialContact, ContactServiceType } from "@/lib/types";

// =============================================================================
// HELPERS
// =============================================================================

function createMockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: "contact-1",
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

// =============================================================================
// ORGANIZATION DEFINITIONS
// =============================================================================

describe("getOrganizationDefinitions", () => {
  it("should return all organization definitions", () => {
    const orgs = getOrganizationDefinitions();
    expect(orgs.length).toBeGreaterThanOrEqual(5);
  });

  it("should include Street Gang with correct values", () => {
    const orgs = getOrganizationDefinitions();
    const streetGang = orgs.find((o) => o.id === "street-gang");
    expect(streetGang).toBeDefined();
    expect(streetGang!.connectionBonus).toBe(1);
    expect(streetGang!.karmaCost).toBe(5);
  });

  it("should include Lone Star/GOD with highest connection bonus", () => {
    const orgs = getOrganizationDefinitions();
    const loneStar = orgs.find((o) => o.id === "lone-star-god");
    expect(loneStar).toBeDefined();
    expect(loneStar!.connectionBonus).toBe(3);
    expect(loneStar!.karmaCost).toBe(12);
  });
});

describe("getOrganizationDefinition", () => {
  it("should return definition by ID", () => {
    const org = getOrganizationDefinition("city-government");
    expect(org).toBeDefined();
    expect(org!.name).toBe("City Government");
    expect(org!.connectionBonus).toBe(1);
    expect(org!.karmaCost).toBe(3);
  });

  it("should return undefined for unknown ID", () => {
    expect(getOrganizationDefinition("unknown-org")).toBeUndefined();
  });
});

// =============================================================================
// VALIDATION
// =============================================================================

describe("validateOrganizationContact", () => {
  it("should pass for valid organization contact (Loyalty 1)", () => {
    const contact = createMockContact({ loyalty: 1, group: "organization" });
    const result = validateOrganizationContact(contact);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail if Loyalty exceeds 1", () => {
    const contact = createMockContact({ loyalty: 3, group: "organization" });
    const result = validateOrganizationContact(contact);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ field: "loyalty" }));
  });

  it("should pass for non-organization contacts without restriction", () => {
    const contact = createMockContact({ loyalty: 5, group: "personal" });
    const result = validateOrganizationContact(contact);
    expect(result.valid).toBe(true);
  });

  it("should allow Loyalty 0 for organization contacts", () => {
    const contact = createMockContact({ loyalty: 0, group: "organization" });
    const result = validateOrganizationContact(contact);
    expect(result.valid).toBe(true);
  });
});

// =============================================================================
// FAVOR/CHIP BLOCKING
// =============================================================================

describe("canOrganizationCallFavor", () => {
  it("should block all favor calls for organization contacts", () => {
    const contact = createMockContact({ group: "organization" });
    const result = canOrganizationCallFavor(contact);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("organization");
  });

  it("should allow favor calls for personal contacts", () => {
    const contact = createMockContact({ group: "personal" });
    const result = canOrganizationCallFavor(contact);
    expect(result.allowed).toBe(true);
  });

  it("should allow favor calls for shared contacts", () => {
    const contact = createMockContact({ group: "shared" });
    const result = canOrganizationCallFavor(contact);
    expect(result.allowed).toBe(true);
  });

  it("should allow favor calls for campaign contacts", () => {
    const contact = createMockContact({ group: "campaign" });
    const result = canOrganizationCallFavor(contact);
    expect(result.allowed).toBe(true);
  });
});

// =============================================================================
// SERVICE TYPE RESTRICTIONS
// =============================================================================

describe("isAllowedServiceForOrganization", () => {
  it("should allow legwork service", () => {
    expect(isAllowedServiceForOrganization("legwork")).toBe(true);
  });

  it("should allow networking service", () => {
    expect(isAllowedServiceForOrganization("networking")).toBe(true);
  });

  it("should block swag service", () => {
    expect(isAllowedServiceForOrganization("swag")).toBe(false);
  });

  it("should block shadow-service", () => {
    expect(isAllowedServiceForOrganization("shadow-service")).toBe(false);
  });

  it("should block personal-favor", () => {
    expect(isAllowedServiceForOrganization("personal-favor")).toBe(false);
  });

  it("should block support service", () => {
    expect(isAllowedServiceForOrganization("support")).toBe(false);
  });
});
