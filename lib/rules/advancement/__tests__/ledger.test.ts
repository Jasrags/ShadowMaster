/**
 * Tests for karma transaction ledger
 *
 * Tests spendKarma and earnKarma functions for karma management.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { spendKarma, earnKarma } from "../ledger";
import { createMockCharacter } from "@/__tests__/mocks/storage";

// Mock uuid to get predictable IDs
vi.mock("uuid", () => ({
  v4: vi.fn(() => "test-uuid-" + Math.random().toString(36).substr(2, 9)),
}));

describe("Karma Ledger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("spendKarma", () => {
    it("should deduct karma correctly", () => {
      const character = createMockCharacter({
        karmaCurrent: 50,
        karmaTotal: 100,
      });

      const result = spendKarma(character, "attribute", "body", "Body", 20, 3, 4);

      expect(result.updatedCharacter.karmaCurrent).toBe(30);
    });

    it("should create advancement record with correct fields", () => {
      const character = createMockCharacter({
        karmaCurrent: 50,
        karmaTotal: 100,
        advancementHistory: [],
      });

      const result = spendKarma(character, "attribute", "body", "Body", 20, 3, 4);

      expect(result.record.id).toBeDefined();
      expect(result.record.type).toBe("attribute");
      expect(result.record.targetId).toBe("body");
      expect(result.record.targetName).toBe("Body");
      expect(result.record.karmaCost).toBe(20);
      expect(result.record.previousValue).toBe(3);
      expect(result.record.newValue).toBe(4);
      expect(result.record.karmaSpentAt).toBeDefined();
      expect(result.record.createdAt).toBeDefined();
    });

    it("should throw error on insufficient karma (Req 35)", () => {
      const character = createMockCharacter({
        karmaCurrent: 10,
      });

      expect(() => spendKarma(character, "attribute", "body", "Body", 20, 3, 4)).toThrow(
        "Insufficient karma. Required: 20, available: 10"
      );
    });

    it("should set completedAt for non-training advancements", () => {
      const character = createMockCharacter({
        karmaCurrent: 50,
      });

      const result = spendKarma(character, "edge", "edge", "Edge", 15, 2, 3, {
        trainingRequired: false,
      });

      expect(result.record.completedAt).toBeDefined();
      expect(result.record.trainingStatus).toBe("completed");
    });

    it("should not set completedAt for training-required advancements", () => {
      const character = createMockCharacter({
        karmaCurrent: 50,
      });

      const result = spendKarma(character, "attribute", "body", "Body", 20, 3, 4, {
        trainingRequired: true,
      });

      expect(result.record.completedAt).toBeUndefined();
      expect(result.record.trainingStatus).toBe("pending");
    });

    it("should set trainingStatus to pending when trainingRequired is true", () => {
      const character = createMockCharacter({
        karmaCurrent: 50,
      });

      const result = spendKarma(character, "skill", "firearms", "Firearms", 8, 3, 4, {
        trainingRequired: true,
      });

      expect(result.record.trainingRequired).toBe(true);
      expect(result.record.trainingStatus).toBe("pending");
    });

    it("should allow explicit trainingStatus override", () => {
      const character = createMockCharacter({
        karmaCurrent: 50,
      });

      const result = spendKarma(character, "skill", "firearms", "Firearms", 8, 3, 4, {
        trainingRequired: true,
        trainingStatus: "in-progress",
      });

      expect(result.record.trainingStatus).toBe("in-progress");
    });

    it("should append to existing advancement history", () => {
      const existingRecord = {
        id: "existing-id",
        type: "skill" as const,
        targetId: "athletics",
        targetName: "Athletics",
        previousValue: 2,
        newValue: 3,
        karmaCost: 6,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed" as const,
        gmApproved: false,
        createdAt: new Date().toISOString(),
      };
      const character = createMockCharacter({
        karmaCurrent: 50,
        advancementHistory: [existingRecord],
      });

      const result = spendKarma(character, "skill", "firearms", "Firearms", 8, 3, 4);

      expect(result.updatedCharacter.advancementHistory).toHaveLength(2);
      expect(result.updatedCharacter.advancementHistory?.[0].id).toBe("existing-id");
    });

    it("should include optional fields when provided", () => {
      const character = createMockCharacter({
        karmaCurrent: 50,
      });

      const result = spendKarma(character, "attribute", "body", "Body", 20, 3, 4, {
        notes: "Training with instructor",
        campaignSessionId: "session-123",
        downtimePeriodId: "downtime-456",
        gmApproved: true,
      });

      expect(result.record.notes).toBe("Training with instructor");
      expect(result.record.campaignSessionId).toBe("session-123");
      expect(result.record.downtimePeriodId).toBe("downtime-456");
      expect(result.record.gmApproved).toBe(true);
    });

    it("should default gmApproved to false", () => {
      const character = createMockCharacter({
        karmaCurrent: 50,
      });

      const result = spendKarma(character, "attribute", "body", "Body", 20, 3, 4);

      expect(result.record.gmApproved).toBe(false);
    });

    it("should not modify karmaTotal", () => {
      const character = createMockCharacter({
        karmaCurrent: 50,
        karmaTotal: 100,
      });

      const result = spendKarma(character, "attribute", "body", "Body", 20, 3, 4);

      expect(result.updatedCharacter.karmaTotal).toBe(100);
    });

    it("should handle exactly enough karma", () => {
      const character = createMockCharacter({
        karmaCurrent: 20,
      });

      const result = spendKarma(character, "attribute", "body", "Body", 20, 3, 4);

      expect(result.updatedCharacter.karmaCurrent).toBe(0);
    });
  });

  describe("earnKarma", () => {
    it("should add to both karmaTotal and karmaCurrent", () => {
      const character = createMockCharacter({
        karmaCurrent: 10,
        karmaTotal: 50,
      });

      const result = earnKarma(character, 15, "Session 12");

      expect(result.karmaCurrent).toBe(25);
      expect(result.karmaTotal).toBe(65);
    });

    it("should append to privateNotes", () => {
      const character = createMockCharacter({
        karmaCurrent: 10,
        karmaTotal: 50,
        privateNotes: "Existing notes",
      });

      const result = earnKarma(character, 15, "Session 12");

      expect(result.privateNotes).toContain("Existing notes");
      expect(result.privateNotes).toContain("[KARMA EARNED] +15 from Session 12");
    });

    it("should handle empty privateNotes", () => {
      const character = createMockCharacter({
        karmaCurrent: 10,
        karmaTotal: 50,
        privateNotes: "",
      });

      const result = earnKarma(character, 15, "Session 12");

      expect(result.privateNotes).toBe("[KARMA EARNED] +15 from Session 12");
    });

    it("should handle undefined privateNotes", () => {
      const character = createMockCharacter({
        karmaCurrent: 10,
        karmaTotal: 50,
      });
      delete (character as Partial<typeof character>).privateNotes;

      const result = earnKarma(character, 15, "Session 12");

      expect(result.privateNotes).toBe("[KARMA EARNED] +15 from Session 12");
    });

    it("should throw on negative amount", () => {
      const character = createMockCharacter({
        karmaCurrent: 10,
      });

      expect(() => earnKarma(character, -5, "Invalid")).toThrow("Cannot earn negative karma");
    });

    it("should allow earning zero karma", () => {
      const character = createMockCharacter({
        karmaCurrent: 10,
        karmaTotal: 50,
      });

      // Zero karma should not throw, though it's unusual
      const result = earnKarma(character, 0, "Participation award");

      expect(result.karmaCurrent).toBe(10);
      expect(result.karmaTotal).toBe(50);
    });

    it("should return a new character object (immutability)", () => {
      const character = createMockCharacter({
        karmaCurrent: 10,
        karmaTotal: 50,
      });

      const result = earnKarma(character, 15, "Session 12");

      expect(result).not.toBe(character);
    });

    it("should not mutate the original character", () => {
      const character = createMockCharacter({
        karmaCurrent: 10,
        karmaTotal: 50,
      });
      const originalCurrent = character.karmaCurrent;
      const originalTotal = character.karmaTotal;

      earnKarma(character, 15, "Session 12");

      expect(character.karmaCurrent).toBe(originalCurrent);
      expect(character.karmaTotal).toBe(originalTotal);
    });
  });
});
