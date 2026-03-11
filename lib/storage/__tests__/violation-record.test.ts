/**
 * Tests for violation record storage
 *
 * Tests violation CRUD operations with isolated temp directories.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

let testDir: string;

// Dynamic imports so we can set VIOLATION_DATA_DIR before module evaluation
let recordViolation: typeof import("../violation-record").recordViolation;
let getViolationById: typeof import("../violation-record").getViolationById;
let getViolationsByCharacter: typeof import("../violation-record").getViolationsByCharacter;
let getViolationsByCampaign: typeof import("../violation-record").getViolationsByCampaign;
let queryViolations: typeof import("../violation-record").queryViolations;
let getViolationCountsByType: typeof import("../violation-record").getViolationCountsByType;
let createViolationFromValidation: typeof import("../violation-record").createViolationFromValidation;
type ViolationRecordInput = import("../violation-record").ViolationRecordInput;

describe("violation-record", () => {
  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), "violation-storage-test-"));
    process.env.VIOLATION_DATA_DIR = testDir;

    vi.resetModules();
    const mod = await import("../violation-record");
    recordViolation = mod.recordViolation;
    getViolationById = mod.getViolationById;
    getViolationsByCharacter = mod.getViolationsByCharacter;
    getViolationsByCampaign = mod.getViolationsByCampaign;
    queryViolations = mod.queryViolations;
    getViolationCountsByType = mod.getViolationCountsByType;
    createViolationFromValidation = mod.createViolationFromValidation;
  });

  afterEach(async () => {
    delete process.env.VIOLATION_DATA_DIR;
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("recordViolation", () => {
    it("should create a violation record with generated id and timestamp", async () => {
      const input: ViolationRecordInput = {
        characterId: "char-123",
        violationType: "creation",
        severity: "error",
        constraintId: "test-constraint",
        details: {
          attemptedAction: "Add forbidden quality",
          rejectReason: "Quality not available in edition",
        },
      };

      const record = await recordViolation(input);

      expect(record.id).toBeDefined();
      expect(record.timestamp).toBeDefined();
      expect(record.characterId).toBe("char-123");
      expect(record.violationType).toBe("creation");
      expect(record.constraintId).toBe("test-constraint");
    });

    it("should save the record to disk", async () => {
      const input: ViolationRecordInput = {
        characterId: "char-456",
        violationType: "advancement",
        severity: "error",
        constraintId: "max-rating",
        details: {
          attemptedAction: "Increase skill to 14",
          rejectReason: "Exceeds maximum rating of 13",
        },
      };

      const record = await recordViolation(input);

      // Verify file exists
      const filePath = path.join(testDir, `${record.id}.json`);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const savedRecord = JSON.parse(fileContent);

      expect(savedRecord.id).toBe(record.id);
      expect(savedRecord.characterId).toBe("char-456");
    });
  });

  describe("getViolationById", () => {
    it("should retrieve a violation by ID", async () => {
      const input: ViolationRecordInput = {
        characterId: "char-789",
        violationType: "content_access",
        severity: "error",
        constraintId: "book-restriction",
        details: {
          attemptedAction: "Access Run & Gun content",
          rejectReason: "Book not enabled in campaign",
        },
      };

      const created = await recordViolation(input);

      const retrieved = await getViolationById(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(created.id);
      expect(retrieved!.characterId).toBe("char-789");
    });

    it("should return null for non-existent ID", async () => {
      const result = await getViolationById("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("getViolationsByCharacter", () => {
    it("should return violations for a specific character", async () => {
      const characterId = "test-char-violations";

      // Create two violations for the same character
      await recordViolation({
        characterId,
        violationType: "creation",
        severity: "error",
        constraintId: "test-1",
        details: { attemptedAction: "Action 1", rejectReason: "Reason 1" },
      });

      await recordViolation({
        characterId,
        violationType: "advancement",
        severity: "error",
        constraintId: "test-2",
        details: { attemptedAction: "Action 2", rejectReason: "Reason 2" },
      });

      const violations = await getViolationsByCharacter(characterId);

      expect(violations.length).toBe(2);
      expect(violations.every((v) => v.characterId === characterId)).toBe(true);
    });

    it("should return empty array for character with no violations", async () => {
      const violations = await getViolationsByCharacter("no-violations-char");
      expect(violations).toEqual([]);
    });
  });

  describe("createViolationFromValidation", () => {
    it("should create a violation with validation context", async () => {
      const record = await createViolationFromValidation({
        characterId: "char-val-test",
        campaignId: "campaign-123",
        violationType: "edition_mismatch",
        constraintId: "edition-check",
        attemptedAction: "Join SR6 campaign with SR5 character",
        rejectReason: "Edition mismatch",
        rulesetSnapshotId: "snapshot-abc",
        enabledBookIds: ["core", "run-faster"],
      });

      expect(record.campaignId).toBe("campaign-123");
      expect(record.details.rulesetSnapshotId).toBe("snapshot-abc");
      expect(record.details.enabledBookIds).toContain("core");
    });
  });

  describe("getViolationCountsByType", () => {
    it("should return counts by violation type", async () => {
      const charId = "count-test-char";

      await recordViolation({
        characterId: charId,
        violationType: "creation",
        severity: "error",
        constraintId: "c1",
        details: { attemptedAction: "a", rejectReason: "r" },
      });

      await recordViolation({
        characterId: charId,
        violationType: "creation",
        severity: "error",
        constraintId: "c2",
        details: { attemptedAction: "a", rejectReason: "r" },
      });

      await recordViolation({
        characterId: charId,
        violationType: "advancement",
        severity: "error",
        constraintId: "c3",
        details: { attemptedAction: "a", rejectReason: "r" },
      });

      const counts = await getViolationCountsByType(charId);

      expect(counts.creation).toBe(2);
      expect(counts.advancement).toBe(1);
    });
  });
});
