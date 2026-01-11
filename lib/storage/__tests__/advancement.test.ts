/**
 * Tests for advancement storage functions
 *
 * Tests advancement record and training period storage operations.
 * Uses actual file system like other storage tests.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { AdvancementRecord, TrainingPeriod } from "@/lib/types";
import {
  createCharacterDraft,
  getCharacter,
  finalizeCharacter,
  addAdvancementRecord,
  updateTrainingPeriod,
  updateAdvancementRecord,
  removeTrainingPeriod,
  getAdvancementHistory,
  getActiveTrainingPeriods,
  getTrainingPeriodById,
  getAdvancementRecordById,
} from "../characters";

const TEST_DATA_DIR = path.join(process.cwd(), "__tests__", "temp-characters");

describe("Advancement Storage Functions", () => {
  const timestamp = Date.now();
  const userId = `test-user-${timestamp}`;
  let characterId: string;

  beforeEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch {
      // Ignore
    }

    // Create a test character
    const draft = await createCharacterDraft(userId, "sr5", "sr5", "priority", "Test Character");
    characterId = draft.id;

    // Finalize character to make it active
    await finalizeCharacter(userId, characterId);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  describe("addAdvancementRecord", () => {
    it("should add an advancement record to character", async () => {
      const advancementRecord: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const updatedCharacter = await addAdvancementRecord(
        userId,
        characterId,
        advancementRecord,
        undefined,
        20
      );

      expect(updatedCharacter.advancementHistory).toHaveLength(1);
      expect(updatedCharacter.advancementHistory?.[0]).toEqual(advancementRecord);
      expect(updatedCharacter.karmaCurrent).toBe(-20); // Started with 0
    });

    it("should add advancement record with training period", async () => {
      const advancementRecord: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const trainingPeriod: TrainingPeriod = {
        id: uuidv4(),
        advancementRecordId: advancementRecord.id,
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        requiredTime: 28,
        timeSpent: 0,
        startDate: new Date().toISOString(),
        expectedCompletionDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const updatedCharacter = await addAdvancementRecord(
        userId,
        characterId,
        advancementRecord,
        trainingPeriod,
        20
      );

      expect(updatedCharacter.advancementHistory).toHaveLength(1);
      expect(updatedCharacter.activeTraining).toHaveLength(1);
      expect(updatedCharacter.activeTraining?.[0]).toEqual(trainingPeriod);
    });

    it("should append to existing advancement history", async () => {
      const record1: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        gmApproved: false,
      };

      const record2: AdvancementRecord = {
        id: uuidv4(),
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        previousValue: 2,
        newValue: 3,
        karmaCost: 6,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      await addAdvancementRecord(userId, characterId, record1);
      const updatedCharacter = await addAdvancementRecord(userId, characterId, record2);

      expect(updatedCharacter.advancementHistory).toHaveLength(2);
      expect(updatedCharacter.advancementHistory?.[0]).toEqual(record1);
      expect(updatedCharacter.advancementHistory?.[1]).toEqual(record2);
    });

    it("should throw error if character not found", async () => {
      const advancementRecord: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      await expect(
        addAdvancementRecord(userId, "non-existent-id", advancementRecord)
      ).rejects.toThrow("Character with ID non-existent-id not found");
    });
  });

  describe("updateTrainingPeriod", () => {
    it("should update training period status", async () => {
      const advancementRecord: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const trainingPeriod: TrainingPeriod = {
        id: uuidv4(),
        advancementRecordId: advancementRecord.id,
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        requiredTime: 28,
        timeSpent: 0,
        startDate: new Date().toISOString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await addAdvancementRecord(userId, characterId, advancementRecord, trainingPeriod);

      const updatedCharacter = await updateTrainingPeriod(userId, characterId, trainingPeriod.id, {
        status: "in-progress",
        timeSpent: 7,
      });

      const updatedTraining = updatedCharacter.activeTraining?.find(
        (t) => t.id === trainingPeriod.id
      );
      expect(updatedTraining?.status).toBe("in-progress");
      expect(updatedTraining?.timeSpent).toBe(7);
    });

    it("should throw error if training period not found", async () => {
      await expect(
        updateTrainingPeriod(userId, characterId, "non-existent-id", { status: "completed" })
      ).rejects.toThrow("Training period non-existent-id not found");
    });
  });

  describe("updateAdvancementRecord", () => {
    it("should update advancement record status", async () => {
      const advancementRecord: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      await addAdvancementRecord(userId, characterId, advancementRecord);

      const completedAt = new Date().toISOString();
      const updatedCharacter = await updateAdvancementRecord(
        userId,
        characterId,
        advancementRecord.id,
        { trainingStatus: "completed", completedAt }
      );

      const updatedRecord = updatedCharacter.advancementHistory?.find(
        (a) => a.id === advancementRecord.id
      );
      expect(updatedRecord?.trainingStatus).toBe("completed");
      expect(updatedRecord?.completedAt).toBe(completedAt);
    });

    it("should update GM approval status", async () => {
      const advancementRecord: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      await addAdvancementRecord(userId, characterId, advancementRecord);

      const updatedCharacter = await updateAdvancementRecord(
        userId,
        characterId,
        advancementRecord.id,
        { gmApproved: true, gmApprovedBy: "gm-user-id", gmApprovedAt: new Date().toISOString() }
      );

      const updatedRecord = updatedCharacter.advancementHistory?.find(
        (a) => a.id === advancementRecord.id
      );
      expect(updatedRecord?.gmApproved).toBe(true);
      expect(updatedRecord?.gmApprovedBy).toBe("gm-user-id");
    });

    it("should throw error if advancement record not found", async () => {
      await expect(
        updateAdvancementRecord(userId, characterId, "non-existent-id", {
          trainingStatus: "completed",
        })
      ).rejects.toThrow("Advancement record non-existent-id not found");
    });
  });

  describe("removeTrainingPeriod", () => {
    it("should remove training period from activeTraining", async () => {
      const advancementRecord: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const trainingPeriod: TrainingPeriod = {
        id: uuidv4(),
        advancementRecordId: advancementRecord.id,
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        requiredTime: 28,
        timeSpent: 28,
        startDate: new Date().toISOString(),
        status: "completed",
        createdAt: new Date().toISOString(),
      };

      await addAdvancementRecord(userId, characterId, advancementRecord, trainingPeriod);

      const updatedCharacter = await removeTrainingPeriod(userId, characterId, trainingPeriod.id);

      expect(updatedCharacter.activeTraining).toHaveLength(0);
    });

    it("should handle removing from multiple training periods", async () => {
      const record1: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const training1: TrainingPeriod = {
        id: uuidv4(),
        advancementRecordId: record1.id,
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        requiredTime: 28,
        timeSpent: 0,
        startDate: new Date().toISOString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const record2: AdvancementRecord = {
        id: uuidv4(),
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        previousValue: 2,
        newValue: 3,
        karmaCost: 6,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const training2: TrainingPeriod = {
        id: uuidv4(),
        advancementRecordId: record2.id,
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        requiredTime: 3,
        timeSpent: 0,
        startDate: new Date().toISOString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await addAdvancementRecord(userId, characterId, record1, training1);
      await addAdvancementRecord(userId, characterId, record2, training2);

      const updatedCharacter = await removeTrainingPeriod(userId, characterId, training1.id);

      expect(updatedCharacter.activeTraining).toHaveLength(1);
      expect(updatedCharacter.activeTraining?.[0].id).toBe(training2.id);
    });
  });

  describe("getAdvancementHistory", () => {
    it("should return all advancement history when no filters", async () => {
      const record1: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        gmApproved: false,
      };

      const record2: AdvancementRecord = {
        id: uuidv4(),
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        previousValue: 2,
        newValue: 3,
        karmaCost: 6,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      await addAdvancementRecord(userId, characterId, record1);
      await addAdvancementRecord(userId, characterId, record2);

      const character = await getCharacter(userId, characterId);
      expect(character).not.toBeNull();

      const history = getAdvancementHistory(character!);
      expect(history).toHaveLength(2);
    });

    it("should filter by type", async () => {
      const record1: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        gmApproved: false,
      };

      const record2: AdvancementRecord = {
        id: uuidv4(),
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        previousValue: 2,
        newValue: 3,
        karmaCost: 6,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      await addAdvancementRecord(userId, characterId, record1);
      await addAdvancementRecord(userId, characterId, record2);

      const character = await getCharacter(userId, characterId);
      expect(character).not.toBeNull();

      const attributeHistory = getAdvancementHistory(character!, { type: "attribute" });
      expect(attributeHistory).toHaveLength(1);
      expect(attributeHistory[0].type).toBe("attribute");

      const skillHistory = getAdvancementHistory(character!, { type: "skill" });
      expect(skillHistory).toHaveLength(1);
      expect(skillHistory[0].type).toBe("skill");
    });

    it("should filter by training status", async () => {
      const record1: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        gmApproved: false,
      };

      const record2: AdvancementRecord = {
        id: uuidv4(),
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        previousValue: 2,
        newValue: 3,
        karmaCost: 6,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      await addAdvancementRecord(userId, characterId, record1);
      await addAdvancementRecord(userId, characterId, record2);

      const character = await getCharacter(userId, characterId);
      expect(character).not.toBeNull();

      const completed = getAdvancementHistory(character!, { trainingStatus: "completed" });
      expect(completed).toHaveLength(1);
      expect(completed[0].trainingStatus).toBe("completed");

      const pending = getAdvancementHistory(character!, { trainingStatus: "pending" });
      expect(pending).toHaveLength(1);
      expect(pending[0].trainingStatus).toBe("pending");
    });

    it("should filter by targetId", async () => {
      const record1: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        gmApproved: false,
      };

      const record2: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "agility",
        targetName: "Agility",
        previousValue: 4,
        newValue: 5,
        karmaCost: 25,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      await addAdvancementRecord(userId, characterId, record1);
      await addAdvancementRecord(userId, characterId, record2);

      const character = await getCharacter(userId, characterId);
      expect(character).not.toBeNull();

      const bodyHistory = getAdvancementHistory(character!, { targetId: "body" });
      expect(bodyHistory).toHaveLength(1);
      expect(bodyHistory[0].targetId).toBe("body");
    });
  });

  describe("getActiveTrainingPeriods", () => {
    it("should return only active training periods", async () => {
      const record1: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const training1: TrainingPeriod = {
        id: uuidv4(),
        advancementRecordId: record1.id,
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        requiredTime: 28,
        timeSpent: 0,
        startDate: new Date().toISOString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const record2: AdvancementRecord = {
        id: uuidv4(),
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        previousValue: 2,
        newValue: 3,
        karmaCost: 6,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "in-progress",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const training2: TrainingPeriod = {
        id: uuidv4(),
        advancementRecordId: record2.id,
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        requiredTime: 3,
        timeSpent: 1,
        startDate: new Date().toISOString(),
        status: "in-progress",
        createdAt: new Date().toISOString(),
      };

      await addAdvancementRecord(userId, characterId, record1, training1);
      await addAdvancementRecord(userId, characterId, record2, training2);

      const character = await getCharacter(userId, characterId);
      expect(character).not.toBeNull();

      const activeTraining = getActiveTrainingPeriods(character!);
      expect(activeTraining).toHaveLength(2);
    });

    it("should filter by type", async () => {
      const record1: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const training1: TrainingPeriod = {
        id: uuidv4(),
        advancementRecordId: record1.id,
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        requiredTime: 28,
        timeSpent: 0,
        startDate: new Date().toISOString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const record2: AdvancementRecord = {
        id: uuidv4(),
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        previousValue: 2,
        newValue: 3,
        karmaCost: 6,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const training2: TrainingPeriod = {
        id: uuidv4(),
        advancementRecordId: record2.id,
        type: "skill",
        targetId: "firearms",
        targetName: "Firearms",
        requiredTime: 3,
        timeSpent: 0,
        startDate: new Date().toISOString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await addAdvancementRecord(userId, characterId, record1, training1);
      await addAdvancementRecord(userId, characterId, record2, training2);

      const character = await getCharacter(userId, characterId);
      expect(character).not.toBeNull();

      const attributeTraining = getActiveTrainingPeriods(character!, { type: "attribute" });
      expect(attributeTraining).toHaveLength(1);
      expect(attributeTraining[0].type).toBe("attribute");
    });
  });

  describe("getTrainingPeriodById", () => {
    it("should return training period by ID", async () => {
      const advancementRecord: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      const trainingPeriod: TrainingPeriod = {
        id: uuidv4(),
        advancementRecordId: advancementRecord.id,
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        requiredTime: 28,
        timeSpent: 0,
        startDate: new Date().toISOString(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await addAdvancementRecord(userId, characterId, advancementRecord, trainingPeriod);

      const character = await getCharacter(userId, characterId);
      expect(character).not.toBeNull();

      const found = getTrainingPeriodById(character!, trainingPeriod.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(trainingPeriod.id);
    });

    it("should return null if training period not found", async () => {
      const character = await getCharacter(userId, characterId);
      expect(character).not.toBeNull();

      const found = getTrainingPeriodById(character!, "non-existent-id");
      expect(found).toBeNull();
    });
  });

  describe("getAdvancementRecordById", () => {
    it("should return advancement record by ID", async () => {
      const advancementRecord: AdvancementRecord = {
        id: uuidv4(),
        type: "attribute",
        targetId: "body",
        targetName: "Body",
        previousValue: 3,
        newValue: 4,
        karmaCost: 20,
        karmaSpentAt: new Date().toISOString(),
        trainingRequired: true,
        trainingStatus: "pending",
        createdAt: new Date().toISOString(),
        gmApproved: false,
      };

      await addAdvancementRecord(userId, characterId, advancementRecord);

      const character = await getCharacter(userId, characterId);
      expect(character).not.toBeNull();

      const found = getAdvancementRecordById(character!, advancementRecord.id);
      expect(found).not.toBeNull();
      expect(found?.id).toBe(advancementRecord.id);
    });

    it("should return null if advancement record not found", async () => {
      const character = await getCharacter(userId, characterId);
      expect(character).not.toBeNull();

      const found = getAdvancementRecordById(character!, "non-existent-id");
      expect(found).toBeNull();
    });
  });
});
