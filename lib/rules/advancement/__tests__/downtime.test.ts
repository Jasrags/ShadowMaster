/**
 * Tests for downtime-related advancement functions
 *
 * Tests downtime event queries and per-downtime limit validation.
 */

import { describe, it, expect } from "vitest";
import type { CampaignEvent, Character, AdvancementRecord } from "@/lib/types";
import {
  getDowntimeEvents,
  getDowntimeEventById,
  countDowntimeAdvancements,
  validateDowntimeLimits,
  getDowntimeTraining,
  getDowntimeAdvancements,
} from "../downtime";
import { createMockCharacter } from "@/__tests__/mocks/storage";

// Helper to create mock campaign events
function createMockEvent(overrides?: Partial<CampaignEvent>): CampaignEvent {
  return {
    id: "event-" + Math.random().toString(36).substr(2, 9),
    title: "Test Event",
    date: new Date().toISOString(),
    type: "session",
    createdBy: "user-123",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("Downtime Functions", () => {
  describe("getDowntimeEvents", () => {
    it("should filter and return only downtime events", () => {
      const events: CampaignEvent[] = [
        createMockEvent({ id: "e1", type: "session", date: "2024-01-01T00:00:00Z" }),
        createMockEvent({ id: "e2", type: "downtime", date: "2024-01-15T00:00:00Z" }),
        createMockEvent({ id: "e3", type: "deadline", date: "2024-02-01T00:00:00Z" }),
        createMockEvent({ id: "e4", type: "downtime", date: "2024-02-15T00:00:00Z" }),
        createMockEvent({ id: "e5", type: "other", date: "2024-03-01T00:00:00Z" }),
      ];

      const result = getDowntimeEvents(events);

      expect(result).toHaveLength(2);
      expect(result.every((e) => e.type === "downtime")).toBe(true);
    });

    it("should sort downtime events by date ascending", () => {
      const events: CampaignEvent[] = [
        createMockEvent({ id: "e1", type: "downtime", date: "2024-03-01T00:00:00Z" }),
        createMockEvent({ id: "e2", type: "downtime", date: "2024-01-01T00:00:00Z" }),
        createMockEvent({ id: "e3", type: "downtime", date: "2024-02-01T00:00:00Z" }),
      ];

      const result = getDowntimeEvents(events);

      expect(result[0].id).toBe("e2"); // Jan
      expect(result[1].id).toBe("e3"); // Feb
      expect(result[2].id).toBe("e1"); // Mar
    });

    it("should return empty array when no downtime events exist", () => {
      const events: CampaignEvent[] = [
        createMockEvent({ type: "session" }),
        createMockEvent({ type: "deadline" }),
      ];

      const result = getDowntimeEvents(events);

      expect(result).toHaveLength(0);
    });

    it("should return empty array for empty input", () => {
      const result = getDowntimeEvents([]);

      expect(result).toHaveLength(0);
    });
  });

  describe("getDowntimeEventById", () => {
    it("should find downtime event by ID", () => {
      const events: CampaignEvent[] = [
        createMockEvent({ id: "e1", type: "session" }),
        createMockEvent({ id: "downtime-123", type: "downtime", title: "March Break" }),
        createMockEvent({ id: "e3", type: "downtime" }),
      ];

      const result = getDowntimeEventById(events, "downtime-123");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("downtime-123");
      expect(result?.title).toBe("March Break");
    });

    it("should return null if downtime event not found", () => {
      const events: CampaignEvent[] = [
        createMockEvent({ id: "e1", type: "downtime" }),
        createMockEvent({ id: "e2", type: "downtime" }),
      ];

      const result = getDowntimeEventById(events, "nonexistent-id");

      expect(result).toBeNull();
    });

    it("should return null for non-downtime event with matching ID", () => {
      const events: CampaignEvent[] = [
        createMockEvent({ id: "session-123", type: "session" }),
        createMockEvent({ id: "downtime-456", type: "downtime" }),
      ];

      const result = getDowntimeEventById(events, "session-123");

      expect(result).toBeNull();
    });

    it("should return null for empty events array", () => {
      const result = getDowntimeEventById([], "any-id");

      expect(result).toBeNull();
    });
  });

  describe("countDowntimeAdvancements", () => {
    it("should count advancements of specified type for a downtime period", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({
            type: "attribute",
            downtimePeriodId: "dt-1",
            trainingStatus: "completed",
          }),
          createMockAdvancementRecord({
            type: "attribute",
            downtimePeriodId: "dt-1",
            trainingStatus: "completed",
          }),
          createMockAdvancementRecord({
            type: "skill",
            downtimePeriodId: "dt-1",
            trainingStatus: "completed",
          }),
          createMockAdvancementRecord({
            type: "attribute",
            downtimePeriodId: "dt-2",
            trainingStatus: "completed",
          }),
        ],
      });

      const result = countDowntimeAdvancements(character, "dt-1", "attribute");

      expect(result).toBe(2);
    });

    it("should exclude interrupted advancements from count", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({
            type: "attribute",
            downtimePeriodId: "dt-1",
            trainingStatus: "completed",
          }),
          createMockAdvancementRecord({
            type: "attribute",
            downtimePeriodId: "dt-1",
            trainingStatus: "interrupted",
          }),
          createMockAdvancementRecord({
            type: "attribute",
            downtimePeriodId: "dt-1",
            trainingStatus: "pending",
          }),
        ],
      });

      const result = countDowntimeAdvancements(character, "dt-1", "attribute");

      expect(result).toBe(2); // Excludes only interrupted
    });

    it("should return 0 for downtime with no matching advancements", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({ type: "skill", downtimePeriodId: "dt-1" }),
          createMockAdvancementRecord({ type: "attribute", downtimePeriodId: "dt-2" }),
        ],
      });

      const result = countDowntimeAdvancements(character, "dt-1", "attribute");

      expect(result).toBe(0);
    });

    it("should return 0 for character with no advancement history", () => {
      const character = createMockCharacter({
        advancementHistory: undefined,
      });

      const result = countDowntimeAdvancements(character, "dt-1", "attribute");

      expect(result).toBe(0);
    });

    it("should count skillGroup advancements correctly", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({ type: "skillGroup", downtimePeriodId: "dt-1" }),
        ],
      });

      const result = countDowntimeAdvancements(character, "dt-1", "skillGroup");

      expect(result).toBe(1);
    });
  });

  describe("validateDowntimeLimits", () => {
    it("should validate attribute limit (max 2 per downtime)", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({ type: "attribute", downtimePeriodId: "dt-1" }),
        ],
      });

      const result = validateDowntimeLimits(character, "dt-1", "attribute");

      expect(result.valid).toBe(true);
      expect(result.currentCount).toBe(1);
      expect(result.maxAllowed).toBe(2);
    });

    it("should reject when attribute limit exceeded", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({ type: "attribute", downtimePeriodId: "dt-1" }),
          createMockAdvancementRecord({ type: "attribute", downtimePeriodId: "dt-1" }),
        ],
      });

      const result = validateDowntimeLimits(character, "dt-1", "attribute");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Maximum 2 attributes");
      expect(result.currentCount).toBe(2);
    });

    it("should validate skill limit (max 3 per downtime)", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({ type: "skill", downtimePeriodId: "dt-1" }),
          createMockAdvancementRecord({ type: "skill", downtimePeriodId: "dt-1" }),
        ],
      });

      const result = validateDowntimeLimits(character, "dt-1", "skill");

      expect(result.valid).toBe(true);
      expect(result.currentCount).toBe(2);
      expect(result.maxAllowed).toBe(3);
    });

    it("should reject when skill limit exceeded", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({ type: "skill", downtimePeriodId: "dt-1" }),
          createMockAdvancementRecord({ type: "skill", downtimePeriodId: "dt-1" }),
          createMockAdvancementRecord({ type: "skill", downtimePeriodId: "dt-1" }),
        ],
      });

      const result = validateDowntimeLimits(character, "dt-1", "skill");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Maximum 3 skills");
    });

    it("should validate skillGroup limit (max 1 per downtime)", () => {
      const character = createMockCharacter({
        advancementHistory: [],
      });

      const result = validateDowntimeLimits(character, "dt-1", "skillGroup");

      expect(result.valid).toBe(true);
      expect(result.currentCount).toBe(0);
      expect(result.maxAllowed).toBe(1);
    });

    it("should reject when skillGroup limit exceeded", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({ type: "skillGroup", downtimePeriodId: "dt-1" }),
        ],
      });

      const result = validateDowntimeLimits(character, "dt-1", "skillGroup");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Maximum 1 skill groups");
    });

    it("should not count advancements from other downtime periods", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({ type: "attribute", downtimePeriodId: "dt-1" }),
          createMockAdvancementRecord({ type: "attribute", downtimePeriodId: "dt-1" }),
          createMockAdvancementRecord({ type: "attribute", downtimePeriodId: "dt-2" }),
          createMockAdvancementRecord({ type: "attribute", downtimePeriodId: "dt-2" }),
        ],
      });

      const result = validateDowntimeLimits(character, "dt-2", "attribute");

      expect(result.valid).toBe(false);
      expect(result.currentCount).toBe(2);
    });
  });

  describe("getDowntimeTraining", () => {
    it("should return training periods linked to a specific downtime", () => {
      const character = createMockCharacter({
        activeTraining: [
          {
            id: "t1",
            advancementRecordId: "a1",
            type: "attribute",
            targetId: "body",
            targetName: "Body",
            requiredTime: 28,
            timeSpent: 0,
            status: "pending",
            startDate: "2024-01-01",
            createdAt: "2024-01-01",
            downtimePeriodId: "dt-1",
          },
          {
            id: "t2",
            advancementRecordId: "a2",
            type: "skill",
            targetId: "firearms",
            targetName: "Firearms",
            requiredTime: 7,
            timeSpent: 0,
            status: "pending",
            startDate: "2024-01-01",
            createdAt: "2024-01-01",
            downtimePeriodId: "dt-1",
          },
          {
            id: "t3",
            advancementRecordId: "a3",
            type: "attribute",
            targetId: "agility",
            targetName: "Agility",
            requiredTime: 28,
            timeSpent: 0,
            status: "pending",
            startDate: "2024-01-01",
            createdAt: "2024-01-01",
            downtimePeriodId: "dt-2",
          },
        ],
      });

      const result = getDowntimeTraining(character, "dt-1");

      expect(result).toHaveLength(2);
      expect(result.map((t) => t.id)).toContain("t1");
      expect(result.map((t) => t.id)).toContain("t2");
    });

    it("should return empty array when no training for downtime", () => {
      const character = createMockCharacter({
        activeTraining: [
          {
            id: "t1",
            advancementRecordId: "a1",
            type: "attribute",
            targetId: "body",
            targetName: "Body",
            requiredTime: 28,
            timeSpent: 0,
            status: "pending",
            startDate: "2024-01-01",
            createdAt: "2024-01-01",
            downtimePeriodId: "dt-2",
          },
        ],
      });

      const result = getDowntimeTraining(character, "dt-1");

      expect(result).toHaveLength(0);
    });

    it("should return empty array for character with no active training", () => {
      const character = createMockCharacter({
        activeTraining: undefined,
      });

      const result = getDowntimeTraining(character, "dt-1");

      expect(result).toHaveLength(0);
    });
  });

  describe("getDowntimeAdvancements", () => {
    it("should return advancements linked to a specific downtime", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({ id: "a1", downtimePeriodId: "dt-1" }),
          createMockAdvancementRecord({ id: "a2", downtimePeriodId: "dt-1" }),
          createMockAdvancementRecord({ id: "a3", downtimePeriodId: "dt-2" }),
          createMockAdvancementRecord({ id: "a4" }), // No downtime
        ],
      });

      const result = getDowntimeAdvancements(character, "dt-1");

      expect(result).toHaveLength(2);
      expect(result.map((a) => a.id)).toContain("a1");
      expect(result.map((a) => a.id)).toContain("a2");
    });

    it("should return empty array when no advancements for downtime", () => {
      const character = createMockCharacter({
        advancementHistory: [createMockAdvancementRecord({ downtimePeriodId: "dt-other" })],
      });

      const result = getDowntimeAdvancements(character, "dt-1");

      expect(result).toHaveLength(0);
    });

    it("should return empty array for character with no advancement history", () => {
      const character = createMockCharacter({
        advancementHistory: undefined,
      });

      const result = getDowntimeAdvancements(character, "dt-1");

      expect(result).toHaveLength(0);
    });
  });
});

// Helper to create mock advancement records
function createMockAdvancementRecord(overrides?: Partial<AdvancementRecord>): AdvancementRecord {
  return {
    id: "record-" + Math.random().toString(36).substr(2, 9),
    type: "attribute",
    targetId: "body",
    targetName: "Body",
    previousValue: 3,
    newValue: 4,
    karmaCost: 20,
    karmaSpentAt: new Date().toISOString(),
    trainingRequired: true,
    trainingStatus: "completed",
    gmApproved: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
