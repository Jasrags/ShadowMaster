/**
 * Tests for audit log management functions
 */

import { describe, it, expect } from "vitest";
import {
  queryAuditLog,
  getLatestAuditEntry,
  getAuditEntriesByAction,
  getAuditLogCount,
  hasModificationsSince,
  getAuditLogSummary,
} from "../audit";
import type { Character } from "@/lib/types/character";
import type { AuditEntry } from "@/lib/types/audit";

// Create a mock character with audit entries
function createMockCharacterWithAudit(entries: AuditEntry[]): Character {
  return {
    id: "char-1",
    ownerId: "user-1",
    name: "Test Character",
    metatype: "human",
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "priority",
    attachedBookIds: [],
    status: "active",
    attributes: { bod: 3, agi: 3, rea: 3, str: 3, cha: 3, int: 3, log: 3, wil: 3 },
    specialAttributes: { edge: 2, essence: 6, magic: 0, resonance: 0 },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 0,
    startingNuyen: 0,
    gear: [],
    contacts: [],
    derivedStats: { physicalLimit: 4, mentalLimit: 4, socialLimit: 4, initiative: 6 },
    condition: { physicalDamage: 0, stunDamage: 0 },
    karmaTotal: 0,
    karmaCurrent: 0,
    karmaSpentAtCreation: 0,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
    auditLog: entries,
  };
}

// Sample audit entries for testing
const sampleEntries: AuditEntry[] = [
  {
    id: "audit-1",
    timestamp: "2024-01-01T00:00:00Z",
    action: "created",
    actor: { userId: "user-1", role: "owner" },
    details: {},
  },
  {
    id: "audit-2",
    timestamp: "2024-01-02T00:00:00Z",
    action: "updated",
    actor: { userId: "user-1", role: "owner" },
    details: { field: "name" },
  },
  {
    id: "audit-3",
    timestamp: "2024-01-03T00:00:00Z",
    action: "finalized",
    actor: { userId: "user-1", role: "owner" },
    details: {},
    stateTransition: {
      fromStatus: "draft",
      toStatus: "active",
      validationPassed: true,
    },
  },
  {
    id: "audit-4",
    timestamp: "2024-01-04T00:00:00Z",
    action: "advancement_applied",
    actor: { userId: "user-1", role: "owner" },
    details: { type: "attribute", attribute: "body" },
  },
  {
    id: "audit-5",
    timestamp: "2024-01-05T00:00:00Z",
    action: "campaign_joined",
    actor: { userId: "gm-1", role: "gm" },
    details: { campaignId: "campaign-1" },
  },
];

describe("queryAuditLog", () => {
  it("should return all entries when no options provided", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = queryAuditLog(character);

    expect(result).toHaveLength(5);
  });

  it("should return empty array for character without audit log", () => {
    const character = createMockCharacterWithAudit([]);
    character.auditLog = undefined;
    const result = queryAuditLog(character);

    expect(result).toHaveLength(0);
  });

  it("should filter by action types", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = queryAuditLog(character, { actions: ["finalized", "retired"] });

    expect(result).toHaveLength(1);
    expect(result[0].action).toBe("finalized");
  });

  it("should filter by actor ID", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = queryAuditLog(character, { actorId: "gm-1" });

    expect(result).toHaveLength(1);
    expect(result[0].actor.userId).toBe("gm-1");
  });

  it("should filter by date range", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = queryAuditLog(character, {
      fromDate: "2024-01-02T00:00:00Z",
      toDate: "2024-01-04T00:00:00Z",
    });

    expect(result).toHaveLength(3);
    expect(result.every((e) =>
      new Date(e.timestamp) >= new Date("2024-01-02T00:00:00Z") &&
      new Date(e.timestamp) <= new Date("2024-01-04T00:00:00Z")
    )).toBe(true);
  });

  it("should sort in descending order by default", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = queryAuditLog(character);

    expect(result[0].timestamp).toBe("2024-01-05T00:00:00Z");
    expect(result[4].timestamp).toBe("2024-01-01T00:00:00Z");
  });

  it("should sort in ascending order when specified", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = queryAuditLog(character, { order: "asc" });

    expect(result[0].timestamp).toBe("2024-01-01T00:00:00Z");
    expect(result[4].timestamp).toBe("2024-01-05T00:00:00Z");
  });

  it("should limit results", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = queryAuditLog(character, { limit: 2 });

    expect(result).toHaveLength(2);
  });
});

describe("getLatestAuditEntry", () => {
  it("should return the most recent audit entry", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = getLatestAuditEntry(character);

    expect(result?.id).toBe("audit-5");
    expect(result?.timestamp).toBe("2024-01-05T00:00:00Z");
  });

  it("should return undefined for empty audit log", () => {
    const character = createMockCharacterWithAudit([]);
    const result = getLatestAuditEntry(character);

    expect(result).toBeUndefined();
  });
});

describe("getAuditEntriesByAction", () => {
  it("should return entries matching the specified action", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = getAuditEntriesByAction(character, "updated");

    expect(result).toHaveLength(1);
    expect(result[0].action).toBe("updated");
  });

  it("should return empty array when no matching action", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = getAuditEntriesByAction(character, "retired");

    expect(result).toHaveLength(0);
  });
});

describe("getAuditLogCount", () => {
  it("should return the count of audit entries", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const count = getAuditLogCount(character);

    expect(count).toBe(5);
  });

  it("should return 0 for empty audit log", () => {
    const character = createMockCharacterWithAudit([]);
    const count = getAuditLogCount(character);

    expect(count).toBe(0);
  });
});

describe("hasModificationsSince", () => {
  it("should return true if modifications exist after the date", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = hasModificationsSince(character, "2024-01-03T00:00:00Z");

    expect(result).toBe(true);
  });

  it("should return false if no modifications after the date", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const result = hasModificationsSince(character, "2024-01-06T00:00:00Z");

    expect(result).toBe(false);
  });
});

describe("getAuditLogSummary", () => {
  it("should return a complete summary of the audit log", () => {
    const character = createMockCharacterWithAudit(sampleEntries);
    const summary = getAuditLogSummary(character);

    expect(summary.totalEntries).toBe(5);
    expect(summary.createdAt).toBe("2024-01-01T00:00:00Z");
    expect(summary.lastModifiedAt).toBe("2024-01-05T00:00:00Z");
    expect(summary.lastModifiedBy?.userId).toBe("gm-1");
    expect(summary.stateTransitions).toBe(1);
    expect(summary.advancementEvents).toBe(1);
    expect(summary.campaignEvents).toBe(1);
  });

  it("should handle empty audit log", () => {
    const character = createMockCharacterWithAudit([]);
    const summary = getAuditLogSummary(character);

    expect(summary.totalEntries).toBe(0);
    expect(summary.createdAt).toBeUndefined();
    expect(summary.lastModifiedAt).toBeUndefined();
    expect(summary.stateTransitions).toBe(0);
  });
});
