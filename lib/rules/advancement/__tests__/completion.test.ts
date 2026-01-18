/**
 * Tests for training completion logic
 *
 * Tests completeTraining, getActiveTraining, and getCompletedTraining functions.
 */

import { describe, it, expect } from "vitest";
import type { TrainingPeriod, AdvancementRecord } from "@/lib/types";
import { completeTraining, getActiveTraining, getCompletedTraining } from "../completion";
import { createMockCharacter } from "@/__tests__/mocks/storage";

// Helper to create mock training period
function createMockTrainingPeriod(overrides?: Partial<TrainingPeriod>): TrainingPeriod {
  return {
    id: "training-" + Math.random().toString(36).substr(2, 9),
    advancementRecordId: "advancement-123",
    type: "attribute",
    targetId: "body",
    targetName: "Body",
    requiredTime: 28,
    timeSpent: 28, // Full time spent by default
    startDate: "2024-01-01T00:00:00Z",
    status: "in-progress",
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

// Helper to create mock advancement record
function createMockAdvancementRecord(overrides?: Partial<AdvancementRecord>): AdvancementRecord {
  return {
    id: "advancement-123",
    type: "attribute",
    targetId: "body",
    targetName: "Body",
    previousValue: 3,
    newValue: 4,
    karmaCost: 20,
    karmaSpentAt: "2024-01-01T00:00:00Z",
    trainingRequired: true,
    trainingStatus: "in-progress",
    gmApproved: false,
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("Training Completion", () => {
  describe("completeTraining", () => {
    it("should update training period status to completed", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord({ trainingStatus: "in-progress" });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        attributes: { body: 3 },
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = completeTraining(character, "t1");

      expect(result.completedTrainingPeriod.status).toBe("completed");
      expect(result.completedTrainingPeriod.actualCompletionDate).toBeDefined();
    });

    it("should update advancement record to completed", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord({ trainingStatus: "in-progress" });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        attributes: { body: 3 },
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = completeTraining(character, "t1");

      expect(result.completedAdvancementRecord.trainingStatus).toBe("completed");
      expect(result.completedAdvancementRecord.completedAt).toBeDefined();
    });

    it("should apply stat changes to character via applyAdvancement", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord({
        type: "attribute",
        targetId: "body",
        newValue: 4,
        trainingStatus: "in-progress",
      });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        attributes: { body: 3, agility: 4 },
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = completeTraining(character, "t1");

      expect(result.updatedCharacter.attributes.body).toBe(4);
      expect(result.updatedCharacter.attributes.agility).toBe(4); // Unchanged
    });

    it("should remove training from activeTraining", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord({ trainingStatus: "in-progress" });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const otherTraining = createMockTrainingPeriod({ id: "t2", status: "pending" });

      const character = createMockCharacter({
        attributes: { body: 3 },
        activeTraining: [trainingPeriod, otherTraining],
        advancementHistory: [advancementRecord],
      });

      const result = completeTraining(character, "t1");

      expect(result.updatedCharacter.activeTraining).toHaveLength(1);
      expect(result.updatedCharacter.activeTraining?.[0].id).toBe("t2");
    });

    it("should throw if training not found", () => {
      const character = createMockCharacter({
        activeTraining: [],
        advancementHistory: [],
      });

      expect(() => completeTraining(character, "nonexistent")).toThrow(
        "Training period nonexistent not found or not active"
      );
    });

    it("should throw if training already completed", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "completed" });
      const advancementRecord = createMockAdvancementRecord();
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      expect(() => completeTraining(character, "t1")).toThrow(
        "Training period t1 is already completed"
      );
    });

    it("should throw if training is interrupted", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "interrupted" });
      const advancementRecord = createMockAdvancementRecord();
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      expect(() => completeTraining(character, "t1")).toThrow(
        "Training period t1 is interrupted and must be resumed first"
      );
    });

    it("should throw if GM approval required but missing (Req 9)", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord({
        trainingStatus: "in-progress",
        gmApproved: false,
      });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      // Character in a campaign requires GM approval
      const character = createMockCharacter({
        campaignId: "campaign-123",
        attributes: { body: 3 },
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      expect(() => completeTraining(character, "t1")).toThrow(
        "requires GM approval before it can be completed"
      );
    });

    it("should allow completion when GM approved", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord({
        trainingStatus: "in-progress",
        gmApproved: true,
      });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        campaignId: "campaign-123",
        attributes: { body: 3 },
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = completeTraining(character, "t1");

      expect(result.completedTrainingPeriod.status).toBe("completed");
    });

    it("should allow completion for non-campaign characters without GM approval", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord({
        trainingStatus: "in-progress",
        gmApproved: false,
      });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      // Character not in a campaign
      const character = createMockCharacter({
        campaignId: undefined,
        attributes: { body: 3 },
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = completeTraining(character, "t1");

      expect(result.completedTrainingPeriod.status).toBe("completed");
    });

    it("should complete skill advancement correctly", () => {
      const trainingPeriod = createMockTrainingPeriod({
        id: "t1",
        status: "in-progress",
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
      });
      const advancementRecord = createMockAdvancementRecord({
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        previousValue: 3,
        newValue: 4,
        trainingStatus: "in-progress",
      });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        skills: { firearms: 3 },
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = completeTraining(character, "t1");

      expect(result.updatedCharacter.skills.firearms).toBe(4);
    });

    it("should complete pending training", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "pending" });
      const advancementRecord = createMockAdvancementRecord({
        trainingStatus: "pending",
      });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        attributes: { body: 3 },
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = completeTraining(character, "t1");

      expect(result.completedTrainingPeriod.status).toBe("completed");
    });

    it("should throw if advancement record not found", () => {
      const trainingPeriod = createMockTrainingPeriod({
        id: "t1",
        status: "in-progress",
        advancementRecordId: "nonexistent-record",
      });

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [],
      });

      expect(() => completeTraining(character, "t1")).toThrow(
        "Advancement record nonexistent-record not found"
      );
    });
  });

  describe("getActiveTraining", () => {
    it("should return pending and in-progress training only", () => {
      const character = createMockCharacter({
        activeTraining: [
          createMockTrainingPeriod({ id: "t1", status: "pending" }),
          createMockTrainingPeriod({ id: "t2", status: "in-progress" }),
          createMockTrainingPeriod({ id: "t3", status: "completed" }),
          createMockTrainingPeriod({ id: "t4", status: "interrupted" }),
        ],
      });

      const result = getActiveTraining(character);

      expect(result).toHaveLength(2);
      expect(result.map((t) => t.id)).toContain("t1");
      expect(result.map((t) => t.id)).toContain("t2");
    });

    it("should return empty array for character with no active training", () => {
      const character = createMockCharacter({
        activeTraining: [],
      });

      const result = getActiveTraining(character);

      expect(result).toHaveLength(0);
    });

    it("should return empty array for undefined activeTraining", () => {
      const character = createMockCharacter({
        activeTraining: undefined,
      });

      const result = getActiveTraining(character);

      expect(result).toHaveLength(0);
    });

    it("should exclude completed training", () => {
      const character = createMockCharacter({
        activeTraining: [
          createMockTrainingPeriod({ id: "t1", status: "completed" }),
          createMockTrainingPeriod({ id: "t2", status: "completed" }),
        ],
      });

      const result = getActiveTraining(character);

      expect(result).toHaveLength(0);
    });

    it("should exclude interrupted training", () => {
      const character = createMockCharacter({
        activeTraining: [createMockTrainingPeriod({ id: "t1", status: "interrupted" })],
      });

      const result = getActiveTraining(character);

      expect(result).toHaveLength(0);
    });
  });

  describe("getCompletedTraining", () => {
    it("should return completed advancement records with trainingRequired=true", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({
            id: "a1",
            trainingStatus: "completed",
            trainingRequired: true,
          }),
          createMockAdvancementRecord({
            id: "a2",
            trainingStatus: "completed",
            trainingRequired: true,
          }),
          createMockAdvancementRecord({
            id: "a3",
            trainingStatus: "in-progress",
            trainingRequired: true,
          }),
          createMockAdvancementRecord({
            id: "a4",
            trainingStatus: "completed",
            trainingRequired: false,
          }),
        ],
      });

      const result = getCompletedTraining(character);

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.advancementRecord.id)).toContain("a1");
      expect(result.map((r) => r.advancementRecord.id)).toContain("a2");
    });

    it("should return empty array when no completed training", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({
            trainingStatus: "pending",
            trainingRequired: true,
          }),
          createMockAdvancementRecord({
            trainingStatus: "in-progress",
            trainingRequired: true,
          }),
        ],
      });

      const result = getCompletedTraining(character);

      expect(result).toHaveLength(0);
    });

    it("should return empty array for character with no advancement history", () => {
      const character = createMockCharacter({
        advancementHistory: undefined,
      });

      const result = getCompletedTraining(character);

      expect(result).toHaveLength(0);
    });

    it("should exclude non-training advancements (trainingRequired=false)", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({
            id: "a1",
            trainingStatus: "completed",
            trainingRequired: false,
          }),
        ],
      });

      const result = getCompletedTraining(character);

      expect(result).toHaveLength(0);
    });

    it("should return advancement records with advancementRecord property", () => {
      const character = createMockCharacter({
        advancementHistory: [
          createMockAdvancementRecord({
            id: "a1",
            trainingStatus: "completed",
            trainingRequired: true,
            targetName: "Body",
          }),
        ],
      });

      const result = getCompletedTraining(character);

      expect(result[0].advancementRecord).toBeDefined();
      expect(result[0].advancementRecord.id).toBe("a1");
      expect(result[0].advancementRecord.targetName).toBe("Body");
    });
  });
});
