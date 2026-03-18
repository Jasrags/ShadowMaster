/**
 * Tests for contact relationship maintenance (Run Faster p. 177)
 *
 * Characters must interact with contacts every (Loyalty) months or risk
 * losing Loyalty. Missed interactions trigger a Loyalty(2) test — failure
 * means Loyalty −1, and Loyalty 0 means the contact is lost.
 */

import { describe, it, expect } from "vitest";
import {
  getMaintenanceDeadline,
  checkMaintenanceStatus,
  resolveMaintenanceCheck,
  getOverdueContacts,
  type MaintenanceStatus,
} from "../contact-maintenance";
import type { SocialContact } from "@/lib/types";

// =============================================================================
// HELPERS
// =============================================================================

function createMockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: "contact-1",
    name: "Test Contact",
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

// =============================================================================
// getMaintenanceDeadline
// =============================================================================

describe("getMaintenanceDeadline", () => {
  it("should return date (Loyalty) months after last contact", () => {
    // Loyalty 3 → deadline is 3 months from last contact
    const lastContacted = "2024-01-15T00:00:00Z";
    const deadline = getMaintenanceDeadline(lastContacted, 3);

    expect(deadline).toBe("2024-04-15T00:00:00.000Z");
  });

  it("should handle Loyalty 1 (monthly interaction required)", () => {
    const lastContacted = "2024-06-01T00:00:00Z";
    const deadline = getMaintenanceDeadline(lastContacted, 1);

    expect(deadline).toBe("2024-07-01T00:00:00.000Z");
  });

  it("should handle Loyalty 6 (half-year interval)", () => {
    const lastContacted = "2024-01-01T00:00:00Z";
    const deadline = getMaintenanceDeadline(lastContacted, 6);

    expect(deadline).toBe("2024-07-01T00:00:00.000Z");
  });

  it("should handle year boundary crossing", () => {
    const lastContacted = "2024-11-15T00:00:00Z";
    const deadline = getMaintenanceDeadline(lastContacted, 3);

    expect(deadline).toBe("2025-02-15T00:00:00.000Z");
  });
});

// =============================================================================
// checkMaintenanceStatus
// =============================================================================

describe("checkMaintenanceStatus", () => {
  it("should return 'current' when within maintenance window", () => {
    const contact = createMockContact({
      loyalty: 3,
      lastContactedAt: "2024-01-01T00:00:00Z",
    });
    // Check 2 months later — still within 3-month window
    const result = checkMaintenanceStatus(contact, "2024-03-01T00:00:00Z");

    expect(result.status).toBe("current");
    expect(result.overdue).toBe(false);
  });

  it("should return 'overdue' when past maintenance deadline", () => {
    const contact = createMockContact({
      loyalty: 2,
      lastContactedAt: "2024-01-01T00:00:00Z",
    });
    // Check 3 months later — past 2-month window
    const result = checkMaintenanceStatus(contact, "2024-04-01T00:00:00Z");

    expect(result.status).toBe("overdue");
    expect(result.overdue).toBe(true);
  });

  it("should return 'current' on exact deadline date", () => {
    const contact = createMockContact({
      loyalty: 2,
      lastContactedAt: "2024-01-01T00:00:00Z",
    });
    // Check exactly 2 months later — still on time
    const result = checkMaintenanceStatus(contact, "2024-03-01T00:00:00Z");

    expect(result.status).toBe("current");
  });

  it("should include deadline in result", () => {
    const contact = createMockContact({
      loyalty: 4,
      lastContactedAt: "2024-01-01T00:00:00Z",
    });
    const result = checkMaintenanceStatus(contact, "2024-03-01T00:00:00Z");

    expect(result.deadline).toBe("2024-05-01T00:00:00.000Z");
  });

  it("should treat contact with no lastContactedAt as overdue using createdAt", () => {
    const contact = createMockContact({
      loyalty: 1,
      lastContactedAt: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    });
    // 2 months later with Loyalty 1 = overdue
    const result = checkMaintenanceStatus(contact, "2024-03-01T00:00:00Z");

    expect(result.overdue).toBe(true);
  });

  it("should skip non-active contacts", () => {
    const contact = createMockContact({
      loyalty: 1,
      status: "burned",
      lastContactedAt: "2020-01-01T00:00:00Z",
    });
    const result = checkMaintenanceStatus(contact, "2024-01-01T00:00:00Z");

    expect(result.status).toBe("not-applicable");
    expect(result.overdue).toBe(false);
  });

  it("should return 'at-risk' when contact has Loyalty 0", () => {
    const contact = createMockContact({
      loyalty: 0,
      lastContactedAt: "2024-01-01T00:00:00Z",
    });
    const result = checkMaintenanceStatus(contact, "2024-02-01T00:00:00Z");

    expect(result.status).toBe("at-risk");
    expect(result.contactLost).toBe(true);
  });
});

// =============================================================================
// resolveMaintenanceCheck
// =============================================================================

describe("resolveMaintenanceCheck", () => {
  it("should pass when roll meets threshold (2)", () => {
    const result = resolveMaintenanceCheck(3, 2);

    expect(result.success).toBe(true);
    expect(result.loyaltyChange).toBe(0);
  });

  it("should pass when roll exceeds threshold", () => {
    const result = resolveMaintenanceCheck(3, 4);

    expect(result.success).toBe(true);
    expect(result.loyaltyChange).toBe(0);
  });

  it("should fail when roll is below threshold", () => {
    const result = resolveMaintenanceCheck(3, 1);

    expect(result.success).toBe(false);
    expect(result.loyaltyChange).toBe(-1);
  });

  it("should fail when roll is 0", () => {
    const result = resolveMaintenanceCheck(3, 0);

    expect(result.success).toBe(false);
    expect(result.loyaltyChange).toBe(-1);
  });

  it("should flag contact as lost when loyalty would reach 0", () => {
    const result = resolveMaintenanceCheck(1, 0);

    expect(result.success).toBe(false);
    expect(result.loyaltyChange).toBe(-1);
    expect(result.contactLost).toBe(true);
    expect(result.newLoyalty).toBe(0);
  });

  it("should not flag contact as lost when loyalty remains above 0", () => {
    const result = resolveMaintenanceCheck(3, 0);

    expect(result.contactLost).toBe(false);
    expect(result.newLoyalty).toBe(2);
  });
});

// =============================================================================
// getOverdueContacts
// =============================================================================

describe("getOverdueContacts", () => {
  it("should return only overdue active contacts", () => {
    const contacts = [
      createMockContact({
        id: "c1",
        loyalty: 1,
        lastContactedAt: "2024-01-01T00:00:00Z",
      }),
      createMockContact({
        id: "c2",
        loyalty: 6,
        lastContactedAt: "2024-01-01T00:00:00Z",
      }),
      createMockContact({
        id: "c3",
        loyalty: 2,
        lastContactedAt: "2024-01-01T00:00:00Z",
      }),
    ];

    // Check at 2024-04-01: c1 (1mo) overdue, c2 (6mo) ok, c3 (2mo) overdue
    const overdue = getOverdueContacts(contacts, "2024-04-01T00:00:00Z");

    expect(overdue).toHaveLength(2);
    expect(overdue.map((r) => r.contact.id)).toContain("c1");
    expect(overdue.map((r) => r.contact.id)).toContain("c3");
  });

  it("should return empty array when no contacts are overdue", () => {
    const contacts = [
      createMockContact({
        id: "c1",
        loyalty: 6,
        lastContactedAt: "2024-01-01T00:00:00Z",
      }),
    ];

    const overdue = getOverdueContacts(contacts, "2024-02-01T00:00:00Z");
    expect(overdue).toHaveLength(0);
  });

  it("should exclude non-active contacts", () => {
    const contacts = [
      createMockContact({
        id: "c1",
        loyalty: 1,
        status: "burned",
        lastContactedAt: "2020-01-01T00:00:00Z",
      }),
      createMockContact({
        id: "c2",
        loyalty: 1,
        status: "deceased",
        lastContactedAt: "2020-01-01T00:00:00Z",
      }),
    ];

    const overdue = getOverdueContacts(contacts, "2024-01-01T00:00:00Z");
    expect(overdue).toHaveLength(0);
  });

  it("should return empty array for empty contacts list", () => {
    expect(getOverdueContacts([], "2024-01-01T00:00:00Z")).toHaveLength(0);
  });
});
