import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import {
  recordViolation,
  getViolationById,
  getViolationsByCharacter,
  getViolationsByCampaign,
  queryViolations,
  getViolationCountsByType,
  createViolationFromValidation,
  type ViolationRecordInput,
} from "../violation-record";

describe("violation-record", () => {
  const DATA_DIR = path.join(process.cwd(), "data", "violations");

  // Track created violation IDs for cleanup
  let createdIds: string[] = [];

  beforeEach(async () => {
    createdIds = [];
  });

  afterEach(async () => {
    // Cleanup created violations
    for (const id of createdIds) {
      try {
        await fs.unlink(path.join(DATA_DIR, `${id}.json`));
      } catch {
        // Ignore if file doesn't exist
      }
    }

    // Reset index to empty array if it exists
    try {
      const indexPath = path.join(DATA_DIR, "_index.json");
      const index = JSON.parse(await fs.readFile(indexPath, "utf-8"));
      const filteredIndex = index.filter((entry: { id: string }) => !createdIds.includes(entry.id));
      await fs.writeFile(indexPath, JSON.stringify(filteredIndex, null, 2) + "\n");
    } catch {
      // Ignore if index doesn't exist
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
      createdIds.push(record.id);

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
      createdIds.push(record.id);

      // Verify file exists
      const filePath = path.join(DATA_DIR, `${record.id}.json`);
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
      createdIds.push(created.id);

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
      const characterId = `test-char-${Date.now()}`;

      // Create two violations for the same character
      const v1 = await recordViolation({
        characterId,
        violationType: "creation",
        severity: "error",
        constraintId: "test-1",
        details: { attemptedAction: "Action 1", rejectReason: "Reason 1" },
      });
      createdIds.push(v1.id);

      const v2 = await recordViolation({
        characterId,
        violationType: "advancement",
        severity: "error",
        constraintId: "test-2",
        details: { attemptedAction: "Action 2", rejectReason: "Reason 2" },
      });
      createdIds.push(v2.id);

      const violations = await getViolationsByCharacter(characterId);

      expect(violations.length).toBeGreaterThanOrEqual(2);
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
      createdIds.push(record.id);

      expect(record.campaignId).toBe("campaign-123");
      expect(record.details.rulesetSnapshotId).toBe("snapshot-abc");
      expect(record.details.enabledBookIds).toContain("core");
    });
  });

  describe("getViolationCountsByType", () => {
    it("should return counts by violation type", async () => {
      const charId = `count-test-${Date.now()}`;

      const v1 = await recordViolation({
        characterId: charId,
        violationType: "creation",
        severity: "error",
        constraintId: "c1",
        details: { attemptedAction: "a", rejectReason: "r" },
      });
      createdIds.push(v1.id);

      const v2 = await recordViolation({
        characterId: charId,
        violationType: "creation",
        severity: "error",
        constraintId: "c2",
        details: { attemptedAction: "a", rejectReason: "r" },
      });
      createdIds.push(v2.id);

      const v3 = await recordViolation({
        characterId: charId,
        violationType: "advancement",
        severity: "error",
        constraintId: "c3",
        details: { attemptedAction: "a", rejectReason: "r" },
      });
      createdIds.push(v3.id);

      const counts = await getViolationCountsByType(charId);

      expect(counts.creation).toBeGreaterThanOrEqual(2);
      expect(counts.advancement).toBeGreaterThanOrEqual(1);
    });
  });
});
