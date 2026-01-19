/**
 * Tests for legality validator module
 *
 * Tests character validation against locked ruleset versions.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateRulesLegality,
  canParticipateInEncounter,
  getLegalityShield,
  getQuickSyncStatus,
  getQuickLegalityStatus,
} from "../legality-validator";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import type { Character, DriftReport, MergedRuleset, RulesetVersionRef } from "@/lib/types";

// Mock drift analyzer
vi.mock("../drift-analyzer", () => ({
  analyzeCharacterDrift: vi.fn(),
  classifyDriftSeverity: vi.fn(),
}));

// Mock ruleset snapshot storage
vi.mock("@/lib/storage/ruleset-snapshots", () => ({
  getRulesetSnapshot: vi.fn(),
}));

import { analyzeCharacterDrift, classifyDriftSeverity } from "../drift-analyzer";
import { getRulesetSnapshot } from "@/lib/storage/ruleset-snapshots";

// =============================================================================
// MOCK FACTORIES
// =============================================================================

function createMockVersionRef(overrides?: Partial<RulesetVersionRef>): RulesetVersionRef {
  return {
    editionCode: "sr5",
    editionVersion: "1.0.0",
    bookVersions: { core: "1.0.0" },
    snapshotId: "snapshot-123",
    createdAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

function createMockDriftReport(overrides?: Partial<DriftReport>): DriftReport {
  return {
    id: "drift-report-123",
    characterId: "char-123",
    generatedAt: "2024-01-01T00:00:00Z",
    currentVersion: createMockVersionRef({ snapshotId: "old-snapshot" }),
    targetVersion: createMockVersionRef({ snapshotId: "new-snapshot" }),
    overallSeverity: "none",
    changes: [],
    recommendations: [],
    ...overrides,
  };
}

function createMockRulesetSnapshot(overrides?: Partial<MergedRuleset>): MergedRuleset {
  return {
    snapshotId: "snapshot-123",
    editionCode: "sr5",
    editionId: "edition-123",
    bookIds: ["core-rulebook"],
    createdAt: "2024-01-01T00:00:00Z",
    modules: {
      metatypes: {
        human: { id: "Human" },
        elf: { id: "Elf" },
      },
      skills: {
        firearms: { id: "firearms", maxRating: 6 },
        athletics: { id: "athletics", maxRating: 6 },
      },
      qualities: {
        ambidextrous: { id: "ambidextrous" },
        codeslinger: { id: "codeslinger" },
      },
      gear: {},
      magic: {},
      resonance: {},
      combat: {},
      matrix: {},
      attributes: {},
      modifications: {},
    },
    ...overrides,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("Legality Validator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(analyzeCharacterDrift).mockResolvedValue(createMockDriftReport());
    vi.mocked(classifyDriftSeverity).mockReturnValue("none");
    vi.mocked(getRulesetSnapshot).mockResolvedValue(createMockRulesetSnapshot());
  });

  // ===========================================================================
  // validateRulesLegality
  // ===========================================================================

  describe("validateRulesLegality", () => {
    it("should return legal status for character without rulesetSnapshotId (pre-snapshot)", async () => {
      const character = createMockCharacter({ status: "active" });
      delete (character as Partial<Character>).rulesetSnapshotId;

      const result = await validateRulesLegality(character);

      expect(result.isLegal).toBe(true);
      expect(result.status).toBe("rules-legal");
      expect(result.violations).toEqual([]);
    });

    it("should return draft status for draft character without snapshot", async () => {
      const character = createMockCharacter({ status: "draft" });
      delete (character as Partial<Character>).rulesetSnapshotId;

      const result = await validateRulesLegality(character);

      expect(result.status).toBe("draft");
    });

    it("should return invalid when snapshot not found", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "missing-snapshot",
      });
      vi.mocked(getRulesetSnapshot).mockResolvedValue(null);

      const result = await validateRulesLegality(character);

      expect(result.isLegal).toBe(false);
      expect(result.status).toBe("invalid");
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].type).toBe("missing_snapshot");
    });

    it("should validate metatype exists in snapshot", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "nonexistent-metatype",
      });

      const result = await validateRulesLegality(character);

      expect(result.isLegal).toBe(false);
      const metatypeViolation = result.violations.find((v) => v.type === "invalid_metatype");
      expect(metatypeViolation).toBeDefined();
      expect(metatypeViolation?.severity).toBe("error");
    });

    it("should accept valid metatype", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
      });

      const result = await validateRulesLegality(character);

      const metatypeViolation = result.violations.find((v) => v.type === "invalid_metatype");
      expect(metatypeViolation).toBeUndefined();
    });

    it("should validate skills exist in snapshot", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        skills: {
          firearms: 4,
          "nonexistent-skill": 3,
        },
      });

      const result = await validateRulesLegality(character);

      const skillViolation = result.violations.find(
        (v) => v.type === "invalid_skill" && v.description.includes("nonexistent-skill")
      );
      expect(skillViolation).toBeDefined();
    });

    it("should validate skill ratings do not exceed max", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        skills: {
          firearms: 10, // exceeds max of 6
        },
      });

      const result = await validateRulesLegality(character);

      const ratingViolation = result.violations.find((v) => v.type === "skill_out_of_range");
      expect(ratingViolation).toBeDefined();
      expect(ratingViolation?.description).toContain("10");
      expect(ratingViolation?.description).toContain("6");
    });

    it("should skip validation for zero-rated skills", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        skills: {
          "nonexistent-skill": 0,
        },
      });

      const result = await validateRulesLegality(character);

      const skillViolation = result.violations.find((v) => v.type === "invalid_skill");
      expect(skillViolation).toBeUndefined();
    });

    it("should validate qualities exist in snapshot", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        positiveQualities: [{ qualityId: "nonexistent-quality", source: "creation" }],
      });

      const result = await validateRulesLegality(character);

      const qualityViolation = result.violations.find((v) => v.type === "invalid_quality");
      expect(qualityViolation).toBeDefined();
    });

    it("should validate both positive and negative qualities", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        positiveQualities: [{ qualityId: "ambidextrous", source: "creation" }],
        negativeQualities: [{ qualityId: "bad-quality", source: "creation" }],
      });

      const result = await validateRulesLegality(character);

      const violations = result.violations.filter((v) => v.type === "invalid_quality");
      expect(violations).toHaveLength(1);
      expect(violations[0].description).toContain("bad-quality");
    });

    it("should validate essence is not negative", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        specialAttributes: {
          edge: 1,
          essence: -1, // invalid
        },
      });

      const result = await validateRulesLegality(character);

      const essenceViolation = result.violations.find((v) => v.type === "essence_violation");
      expect(essenceViolation).toBeDefined();
    });

    it("should add warning for pending migration", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        pendingMigration: "migration-123", // ID reference to pending migration
      });

      const result = await validateRulesLegality(character);

      const migrationWarning = result.violations.find((v) => v.type === "pending_migration");
      expect(migrationWarning).toBeDefined();
      expect(migrationWarning?.severity).toBe("warning");
    });

    it("should include drift report in result", async () => {
      const driftReport = createMockDriftReport({
        changes: [
          {
            id: "1",
            module: "skills",
            changeType: "modified",
            severity: "non-breaking",
            affectedItems: [],
            description: "Skill changed",
          },
        ],
        overallSeverity: "non-breaking",
      });
      vi.mocked(analyzeCharacterDrift).mockResolvedValue(driftReport);

      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
      });

      const result = await validateRulesLegality(character);

      expect(result.driftReport).toBeDefined();
      expect(result.driftReport?.changes).toHaveLength(1);
    });

    it("should add drift warning when changes detected", async () => {
      vi.mocked(analyzeCharacterDrift).mockResolvedValue(
        createMockDriftReport({
          changes: [
            {
              id: "1",
              module: "skills",
              changeType: "removed",
              severity: "breaking",
              affectedItems: [],
              description: "Skill removed",
            },
          ],
          overallSeverity: "breaking",
        })
      );

      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
      });

      const result = await validateRulesLegality(character);

      const driftViolation = result.violations.find((v) => v.type === "ruleset_drift");
      expect(driftViolation).toBeDefined();
      expect(driftViolation?.severity).toBe("warning");
    });

    it("should return legacy status when warnings but no errors", async () => {
      vi.mocked(analyzeCharacterDrift).mockResolvedValue(
        createMockDriftReport({
          changes: [
            {
              id: "1",
              module: "skills",
              changeType: "removed",
              severity: "breaking",
              affectedItems: [],
              description: "Breaking change",
            },
          ],
          overallSeverity: "breaking",
        })
      );

      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        status: "active",
      });

      const result = await validateRulesLegality(character);

      expect(result.isLegal).toBe(true);
      expect(result.status).toBe("legacy");
    });

    it("should return draft status for draft characters without errors", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        status: "draft",
      });

      const result = await validateRulesLegality(character);

      expect(result.status).toBe("draft");
    });

    it("should return rules-legal for valid active characters", async () => {
      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        status: "active",
      });

      const result = await validateRulesLegality(character);

      expect(result.isLegal).toBe(true);
      expect(result.status).toBe("rules-legal");
    });

    it("should use cache when provided", async () => {
      const mockCache = {
        getRulesetSnapshot: vi.fn().mockResolvedValue(createMockRulesetSnapshot()),
        getCurrentSnapshot: vi.fn(),
      };

      const character = createMockCharacter({
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
      });

      // @ts-expect-error - partial mock cache
      await validateRulesLegality(character, mockCache);

      expect(mockCache.getRulesetSnapshot).toHaveBeenCalledWith("snap-123");
      expect(getRulesetSnapshot).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // canParticipateInEncounter
  // ===========================================================================

  describe("canParticipateInEncounter", () => {
    it("should block retired characters", async () => {
      const character = createMockCharacter({
        status: "retired",
        rulesetSnapshotId: "snap-123",
      });

      const result = await canParticipateInEncounter(character);

      expect(result.canParticipate).toBe(false);
      expect(result.reason).toBe("Character is retired");
      expect(result.blockers).toContain("Character is retired");
    });

    it("should block draft characters", async () => {
      const character = createMockCharacter({
        status: "draft",
        rulesetSnapshotId: "snap-123",
      });

      const result = await canParticipateInEncounter(character);

      expect(result.canParticipate).toBe(false);
      expect(result.reason).toBe("Character is still a draft");
      expect(result.blockers).toContain("Character creation is not complete");
    });

    it("should allow active characters with valid legality", async () => {
      const character = createMockCharacter({
        status: "active",
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
      });

      const result = await canParticipateInEncounter(character);

      expect(result.canParticipate).toBe(true);
      expect(result.blockers).toHaveLength(0);
    });

    it("should block characters with validation errors", async () => {
      vi.mocked(getRulesetSnapshot).mockResolvedValue(null);

      const character = createMockCharacter({
        status: "active",
        rulesetSnapshotId: "missing-snapshot",
      });

      const result = await canParticipateInEncounter(character);

      expect(result.canParticipate).toBe(false);
      expect(result.blockers.length).toBeGreaterThan(0);
    });

    it("should add warning for migrating characters", async () => {
      const character = createMockCharacter({
        status: "active",
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        syncStatus: "migrating",
      });

      const result = await canParticipateInEncounter(character);

      expect(result.canParticipate).toBe(true);
      expect(result.warnings).toContain(
        "Character is currently migrating to a new ruleset version"
      );
    });

    it("should include warnings from validation", async () => {
      vi.mocked(analyzeCharacterDrift).mockResolvedValue(
        createMockDriftReport({
          changes: [
            {
              id: "1",
              module: "skills",
              changeType: "removed",
              severity: "breaking",
              affectedItems: [],
              description: "Skill removed",
            },
          ],
          overallSeverity: "breaking",
        })
      );

      const character = createMockCharacter({
        status: "active",
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
      });

      const result = await canParticipateInEncounter(character);

      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // getLegalityShield
  // ===========================================================================

  describe("getLegalityShield", () => {
    it("should return yellow for draft characters", async () => {
      const character = createMockCharacter({ status: "draft" });

      const shield = await getLegalityShield(character);

      expect(shield.status).toBe("yellow");
      expect(shield.label).toBe("Draft");
    });

    it("should return yellow for retired characters", async () => {
      const character = createMockCharacter({ status: "retired" });

      const shield = await getLegalityShield(character);

      expect(shield.status).toBe("yellow");
      expect(shield.label).toBe("Retired");
    });

    it("should return yellow for pending migration", async () => {
      const character = createMockCharacter({
        status: "active",
        pendingMigration: "migration-123", // ID reference
      });

      const shield = await getLegalityShield(character);

      expect(shield.status).toBe("yellow");
      expect(shield.label).toBe("Migration Pending");
      expect(shield.actionRequired).toBeDefined();
    });

    it("should return red for invalid sync status", async () => {
      const character = createMockCharacter({
        status: "active",
        syncStatus: "invalid",
      });

      const shield = await getLegalityShield(character);

      expect(shield.status).toBe("red");
      expect(shield.label).toBe("Invalid");
    });

    it("should return yellow for migrating status", async () => {
      const character = createMockCharacter({
        status: "active",
        syncStatus: "migrating",
      });

      const shield = await getLegalityShield(character);

      expect(shield.status).toBe("yellow");
      expect(shield.label).toBe("Migrating");
    });

    it("should return red when validation fails", async () => {
      vi.mocked(getRulesetSnapshot).mockResolvedValue(null);

      const character = createMockCharacter({
        status: "active",
        rulesetSnapshotId: "missing-snapshot",
      });

      const shield = await getLegalityShield(character);

      expect(shield.status).toBe("red");
      expect(shield.label).toBe("Invalid");
    });

    it("should return yellow for legacy status", async () => {
      const character = createMockCharacter({
        status: "active",
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
        pendingMigration: "migration-123", // ID reference
      });

      const shield = await getLegalityShield(character);

      expect(shield.status).toBe("yellow");
    });

    it("should return yellow when breaking drift detected", async () => {
      vi.mocked(analyzeCharacterDrift).mockResolvedValue(
        createMockDriftReport({
          changes: [
            {
              id: "1",
              module: "skills",
              changeType: "removed",
              severity: "breaking",
              affectedItems: [],
              description: "Skill removed",
            },
          ],
          overallSeverity: "breaking",
        })
      );
      vi.mocked(classifyDriftSeverity).mockReturnValue("breaking");

      const character = createMockCharacter({
        status: "active",
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
      });

      const shield = await getLegalityShield(character);

      // Breaking drift causes a warning in validation, which sets status to "legacy"
      // The "legacy" check happens before the drift check in getLegalityShield
      expect(shield.status).toBe("yellow");
      expect(shield.label).toBe("Legacy");
    });

    it("should return green for fully valid character", async () => {
      const character = createMockCharacter({
        status: "active",
        rulesetSnapshotId: "snap-123",
        metatype: "Human",
      });

      const shield = await getLegalityShield(character);

      expect(shield.status).toBe("green");
      expect(shield.label).toBe("Valid");
    });

    it("should return yellow with Unknown when validation throws", async () => {
      vi.mocked(getRulesetSnapshot).mockRejectedValue(new Error("Storage error"));

      const character = createMockCharacter({
        status: "active",
        rulesetSnapshotId: "snap-123",
      });

      const shield = await getLegalityShield(character);

      expect(shield.status).toBe("yellow");
      expect(shield.label).toBe("Unknown");
    });
  });

  // ===========================================================================
  // getQuickSyncStatus
  // ===========================================================================

  describe("getQuickSyncStatus", () => {
    it("should return explicitly set sync status", () => {
      const character = createMockCharacter({
        syncStatus: "outdated",
      });

      const status = getQuickSyncStatus(character);

      expect(status).toBe("outdated");
    });

    it("should return outdated when pending migration exists", () => {
      const character = createMockCharacter({
        pendingMigration: "migration-123", // ID reference
      });
      delete (character as Partial<Character>).syncStatus;

      const status = getQuickSyncStatus(character);

      expect(status).toBe("outdated");
    });

    it("should return synchronized by default", () => {
      const character = createMockCharacter();
      delete (character as Partial<Character>).syncStatus;
      delete (character as Partial<Character>).pendingMigration;

      const status = getQuickSyncStatus(character);

      expect(status).toBe("synchronized");
    });

    it("should prioritize explicit status over pending migration", () => {
      const character = createMockCharacter({
        syncStatus: "invalid",
        pendingMigration: "migration-123", // ID reference
      });

      const status = getQuickSyncStatus(character);

      expect(status).toBe("invalid");
    });
  });

  // ===========================================================================
  // getQuickLegalityStatus
  // ===========================================================================

  describe("getQuickLegalityStatus", () => {
    it("should return explicitly set legality status", () => {
      const character = createMockCharacter({
        legalityStatus: "invalid",
      });

      const status = getQuickLegalityStatus(character);

      expect(status).toBe("invalid");
    });

    it("should return draft for draft characters", () => {
      const character = createMockCharacter({
        status: "draft",
      });
      delete (character as Partial<Character>).legalityStatus;

      const status = getQuickLegalityStatus(character);

      expect(status).toBe("draft");
    });

    it("should return rules-legal by default", () => {
      const character = createMockCharacter({
        status: "active",
      });
      delete (character as Partial<Character>).legalityStatus;

      const status = getQuickLegalityStatus(character);

      expect(status).toBe("rules-legal");
    });

    it("should prioritize explicit status over draft check", () => {
      const character = createMockCharacter({
        status: "draft",
        legalityStatus: "legacy",
      });

      const status = getQuickLegalityStatus(character);

      expect(status).toBe("legacy");
    });
  });
});
