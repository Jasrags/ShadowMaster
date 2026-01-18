/**
 * Tests for training interruption and resumption
 *
 * Tests interruptTraining and resumeTraining functions.
 */

import { describe, it, expect } from "vitest";
import type { TrainingPeriod, AdvancementRecord } from "@/lib/types";
import { interruptTraining, resumeTraining } from "../interruption";
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
    timeSpent: 14,
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

describe("Training Interruption", () => {
  describe("interruptTraining", () => {
    it("should set training status to interrupted", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord({
        id: "a1",
        trainingStatus: "in-progress",
      });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = interruptTraining(character, "t1");

      expect(result.interruptedTrainingPeriod.status).toBe("interrupted");
    });

    it("should record interruption date", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord();
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = interruptTraining(character, "t1");

      expect(result.interruptedTrainingPeriod.interruptionDate).toBeDefined();
    });

    it("should record interruption reason if provided", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord();
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = interruptTraining(character, "t1", "Run went sideways");

      expect(result.interruptedTrainingPeriod.interruptionReason).toBe("Run went sideways");
    });

    it("should update advancement record status", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord({ trainingStatus: "in-progress" });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = interruptTraining(character, "t1");

      expect(result.updatedAdvancementRecord.trainingStatus).toBe("interrupted");
    });

    it("should throw if training not found", () => {
      const character = createMockCharacter({
        activeTraining: [],
        advancementHistory: [],
      });

      expect(() => interruptTraining(character, "nonexistent")).toThrow(
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

      expect(() => interruptTraining(character, "t1")).toThrow(
        "Cannot interrupt completed training period t1"
      );
    });

    it("should throw if training already interrupted", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "interrupted" });
      const advancementRecord = createMockAdvancementRecord();
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      expect(() => interruptTraining(character, "t1")).toThrow(
        "Training period t1 is already interrupted"
      );
    });

    it("should return new character object (immutability)", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord();
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = interruptTraining(character, "t1");

      expect(result.updatedCharacter).not.toBe(character);
      expect(result.updatedCharacter.activeTraining).not.toBe(character.activeTraining);
      expect(result.updatedCharacter.advancementHistory).not.toBe(character.advancementHistory);
    });

    it("should update character training arrays correctly", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord();
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = interruptTraining(character, "t1");

      const updatedTraining = result.updatedCharacter.activeTraining?.find((t) => t.id === "t1");
      expect(updatedTraining?.status).toBe("interrupted");

      const updatedRecord = result.updatedCharacter.advancementHistory?.find(
        (a) => a.id === advancementRecord.id
      );
      expect(updatedRecord?.trainingStatus).toBe("interrupted");
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

      expect(() => interruptTraining(character, "t1")).toThrow(
        "Advancement record nonexistent-record not found"
      );
    });

    it("should allow interrupting pending training", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "pending" });
      const advancementRecord = createMockAdvancementRecord({ trainingStatus: "pending" });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = interruptTraining(character, "t1");

      expect(result.interruptedTrainingPeriod.status).toBe("interrupted");
    });
  });

  describe("resumeTraining", () => {
    it("should set training status to in-progress", () => {
      const trainingPeriod = createMockTrainingPeriod({
        id: "t1",
        status: "interrupted",
        interruptionDate: "2024-01-15T00:00:00Z",
      });
      const advancementRecord = createMockAdvancementRecord({ trainingStatus: "interrupted" });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = resumeTraining(character, "t1");

      expect(result.resumedTrainingPeriod.status).toBe("in-progress");
    });

    it("should update advancement record status", () => {
      const trainingPeriod = createMockTrainingPeriod({
        id: "t1",
        status: "interrupted",
      });
      const advancementRecord = createMockAdvancementRecord({ trainingStatus: "interrupted" });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = resumeTraining(character, "t1");

      expect(result.updatedAdvancementRecord.trainingStatus).toBe("in-progress");
    });

    it("should throw if training not interrupted", () => {
      const trainingPeriod = createMockTrainingPeriod({ id: "t1", status: "in-progress" });
      const advancementRecord = createMockAdvancementRecord();
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      expect(() => resumeTraining(character, "t1")).toThrow(
        "Training period t1 is not interrupted (status: in-progress)"
      );
    });

    it("should throw if training not found", () => {
      const character = createMockCharacter({
        activeTraining: [],
        advancementHistory: [],
      });

      expect(() => resumeTraining(character, "nonexistent")).toThrow(
        "Training period nonexistent not found or not active"
      );
    });

    it("should preserve interruption history", () => {
      const trainingPeriod = createMockTrainingPeriod({
        id: "t1",
        status: "interrupted",
        interruptionDate: "2024-01-15T00:00:00Z",
        interruptionReason: "Run went sideways",
      });
      const advancementRecord = createMockAdvancementRecord({ trainingStatus: "interrupted" });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = resumeTraining(character, "t1");

      // Interruption data should be preserved for history
      expect(result.resumedTrainingPeriod.interruptionDate).toBe("2024-01-15T00:00:00Z");
      expect(result.resumedTrainingPeriod.interruptionReason).toBe("Run went sideways");
    });

    it("should return new character object (immutability)", () => {
      const trainingPeriod = createMockTrainingPeriod({
        id: "t1",
        status: "interrupted",
      });
      const advancementRecord = createMockAdvancementRecord({ trainingStatus: "interrupted" });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = resumeTraining(character, "t1");

      expect(result.updatedCharacter).not.toBe(character);
    });

    it("should update character training arrays correctly", () => {
      const trainingPeriod = createMockTrainingPeriod({
        id: "t1",
        status: "interrupted",
      });
      const advancementRecord = createMockAdvancementRecord({ trainingStatus: "interrupted" });
      trainingPeriod.advancementRecordId = advancementRecord.id;

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [advancementRecord],
      });

      const result = resumeTraining(character, "t1");

      const updatedTraining = result.updatedCharacter.activeTraining?.find((t) => t.id === "t1");
      expect(updatedTraining?.status).toBe("in-progress");

      const updatedRecord = result.updatedCharacter.advancementHistory?.find(
        (a) => a.id === advancementRecord.id
      );
      expect(updatedRecord?.trainingStatus).toBe("in-progress");
    });

    it("should throw if advancement record not found", () => {
      const trainingPeriod = createMockTrainingPeriod({
        id: "t1",
        status: "interrupted",
        advancementRecordId: "nonexistent-record",
      });

      const character = createMockCharacter({
        activeTraining: [trainingPeriod],
        advancementHistory: [],
      });

      expect(() => resumeTraining(character, "t1")).toThrow(
        "Advancement record nonexistent-record not found"
      );
    });
  });
});
