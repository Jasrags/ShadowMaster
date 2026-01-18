/**
 * Tests for drift analyzer module
 *
 * Tests drift detection between character snapshots and current rulesets.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  analyzeCharacterDrift,
  analyzeMetatypeDrift,
  analyzeSkillDrift,
  analyzeQualityDrift,
  classifyDriftSeverity,
  isAutoResolvable,
} from "../drift-analyzer";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import type {
  Character,
  MergedRuleset,
  DriftChange,
  MetatypeSnapshot,
  SkillDefinitionSnapshot,
  QualityDefinitionSnapshot,
  RulesetVersionRef,
  MechanicalSnapshot,
  AttributeDefinitionSnapshot,
} from "@/lib/types";

// Mock uuid for predictable IDs
vi.mock("uuid", () => ({
  v4: vi.fn(() => "mock-uuid-123"),
}));

// Mock ruleset snapshot storage
vi.mock("@/lib/storage/ruleset-snapshots", () => ({
  getRulesetSnapshot: vi.fn(),
  getCurrentSnapshot: vi.fn(),
}));

import { getRulesetSnapshot, getCurrentSnapshot } from "@/lib/storage/ruleset-snapshots";

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

function createMockRuleset(overrides?: Partial<MergedRuleset>): MergedRuleset {
  return {
    snapshotId: "snapshot-123",
    editionCode: "sr5",
    editionId: "edition-123",
    bookIds: ["core-rulebook"],
    createdAt: "2024-01-01T00:00:00Z",
    modules: {
      metatypes: {},
      skills: {},
      qualities: {},
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

function createMockMetatypeSnapshot(overrides?: Partial<MetatypeSnapshot>): MetatypeSnapshot {
  return {
    id: "human",
    attributeModifiers: {},
    specialAbilities: [],
    racialQualities: [],
    ...overrides,
  };
}

function createMockAttributeDefinitionSnapshot(): AttributeDefinitionSnapshot {
  return {
    attributes: {
      body: { code: "body", name: "Body", min: 1, max: 6, karmaCostMultiplier: 5 },
      agility: { code: "agility", name: "Agility", min: 1, max: 6, karmaCostMultiplier: 5 },
    },
  };
}

function createMockSkillDefinitionSnapshot(
  skills?: Record<
    string,
    { id: string; name: string; attribute?: string; group?: string; maxRating?: number }
  >
): SkillDefinitionSnapshot {
  // Convert simple objects to proper SkillSnapshot format
  const formattedSkills: SkillDefinitionSnapshot["skills"] = {};
  if (skills) {
    for (const [key, value] of Object.entries(skills)) {
      formattedSkills[key] = {
        id: value.id,
        name: value.name,
        attribute: value.attribute ?? "agility",
        group: value.group,
        canDefault: true,
        karmaCostMultiplier: 2,
        maxRating: value.maxRating,
      };
    }
  }
  return { skills: formattedSkills };
}

function createMockQualityDefinitionSnapshot(
  qualities?: Record<string, { id: string; name: string; karmaCost?: number; effects?: unknown }>
): QualityDefinitionSnapshot {
  // Convert simple objects to proper QualitySnapshot format
  const formattedQualities: QualityDefinitionSnapshot["qualities"] = {};
  if (qualities) {
    for (const [key, value] of Object.entries(qualities)) {
      formattedQualities[key] = {
        id: value.id,
        name: value.name,
        type: "positive",
        karmaCost: value.karmaCost ?? 10,
        effects: typeof value.effects === "object" ? [JSON.stringify(value.effects)] : [],
      };
    }
  }
  return { qualities: formattedQualities };
}

function createMockMechanicalSnapshot(overrides?: Partial<MechanicalSnapshot>): MechanicalSnapshot {
  return {
    capturedAt: "2024-01-01T00:00:00Z",
    rulesetVersion: createMockVersionRef(),
    metatype: createMockMetatypeSnapshot(),
    attributeDefinitions: createMockAttributeDefinitionSnapshot(),
    skillDefinitions: createMockSkillDefinitionSnapshot(),
    qualityDefinitions: createMockQualityDefinitionSnapshot(),
    ...overrides,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("Drift Analyzer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // analyzeCharacterDrift
  // ===========================================================================

  describe("analyzeCharacterDrift", () => {
    it("should return empty report when no current snapshot exists for edition", async () => {
      const character = createMockCharacter({
        editionCode: "sr5",
        rulesetSnapshotId: "old-snapshot",
      });

      vi.mocked(getCurrentSnapshot).mockResolvedValue(null);

      const report = await analyzeCharacterDrift(character);

      expect(report.changes).toEqual([]);
      expect(report.overallSeverity).toBe("none");
    });

    it("should return empty report when character already on current snapshot", async () => {
      const character = createMockCharacter({
        editionCode: "sr5",
        rulesetSnapshotId: "current-snapshot",
      });

      vi.mocked(getCurrentSnapshot).mockResolvedValue(
        createMockVersionRef({ snapshotId: "current-snapshot" })
      );

      const report = await analyzeCharacterDrift(character);

      expect(report.changes).toEqual([]);
      expect(report.overallSeverity).toBe("none");
      // Should not load full snapshots
      expect(getRulesetSnapshot).not.toHaveBeenCalled();
    });

    it("should return empty report when character snapshot not found", async () => {
      const character = createMockCharacter({
        editionCode: "sr5",
        rulesetSnapshotId: "missing-snapshot",
      });

      vi.mocked(getCurrentSnapshot).mockResolvedValue(
        createMockVersionRef({ snapshotId: "new-snapshot" })
      );
      vi.mocked(getRulesetSnapshot).mockResolvedValue(null);

      const report = await analyzeCharacterDrift(character);

      expect(report.changes).toEqual([]);
      expect(report.overallSeverity).toBe("none");
    });

    it("should throw when current ruleset snapshot not found", async () => {
      const character = createMockCharacter({
        editionCode: "sr5",
        rulesetSnapshotId: "old-snapshot",
      });

      vi.mocked(getCurrentSnapshot).mockResolvedValue(
        createMockVersionRef({ snapshotId: "new-snapshot" })
      );
      vi.mocked(getRulesetSnapshot)
        .mockResolvedValueOnce(createMockRuleset()) // character snapshot
        .mockResolvedValueOnce(null); // current snapshot

      await expect(analyzeCharacterDrift(character)).rejects.toThrow(
        "Current ruleset snapshot not found"
      );
    });

    it("should analyze metatype drift when mechanical snapshot exists", async () => {
      const character = createMockCharacter({
        editionCode: "sr5",
        rulesetSnapshotId: "old-snapshot",
        mechanicalSnapshot: createMockMechanicalSnapshot({
          metatype: createMockMetatypeSnapshot({ id: "elf", attributeModifiers: { agility: 1 } }),
        }),
      });

      const currentRuleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          metatypes: {
            elf: { id: "elf", attributeModifiers: { agility: 2 } }, // Changed
          },
        },
      });

      vi.mocked(getCurrentSnapshot).mockResolvedValue(
        createMockVersionRef({ snapshotId: "new-snapshot" })
      );
      vi.mocked(getRulesetSnapshot)
        .mockResolvedValueOnce(createMockRuleset())
        .mockResolvedValueOnce(currentRuleset);

      const report = await analyzeCharacterDrift(character);

      expect(report.characterId).toBe(character.id);
      expect(report.changes.length).toBeGreaterThan(0);
    });

    it("should skip module drift when no mechanical snapshot", async () => {
      const character = createMockCharacter({
        editionCode: "sr5",
        rulesetSnapshotId: "old-snapshot",
      });
      delete (character as Partial<Character>).mechanicalSnapshot;

      vi.mocked(getCurrentSnapshot).mockResolvedValue(
        createMockVersionRef({ snapshotId: "new-snapshot" })
      );
      vi.mocked(getRulesetSnapshot).mockResolvedValue(createMockRuleset());

      const report = await analyzeCharacterDrift(character);

      // Should still complete without error
      expect(report).toBeDefined();
    });

    it("should deduplicate changes with same key", async () => {
      const character = createMockCharacter({
        editionCode: "sr5",
        rulesetSnapshotId: "old-snapshot",
        skills: { firearms: 4 },
        mechanicalSnapshot: createMockMechanicalSnapshot({
          skillDefinitions: createMockSkillDefinitionSnapshot({
            firearms: { id: "firearms", name: "Firearms", attribute: "agility" },
          }),
        }),
      });

      // Ruleset where firearms was removed
      const currentRuleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          skills: {}, // firearms removed
        },
      });

      vi.mocked(getCurrentSnapshot).mockResolvedValue(
        createMockVersionRef({ snapshotId: "new-snapshot" })
      );
      vi.mocked(getRulesetSnapshot)
        .mockResolvedValueOnce(
          createMockRuleset({
            modules: {
              ...createMockRuleset().modules,
              skills: { firearms: { id: "firearms", name: "Firearms" } },
            },
          })
        )
        .mockResolvedValueOnce(currentRuleset);

      const report = await analyzeCharacterDrift(character);

      // Should have at most one change per module+type+item combination
      const firearmChanges = report.changes.filter(
        (c) => c.affectedItems[0]?.itemId === "firearms"
      );
      expect(firearmChanges.length).toBeLessThanOrEqual(1);
    });

    it("should generate migration recommendations", async () => {
      const character = createMockCharacter({
        editionCode: "sr5",
        rulesetSnapshotId: "old-snapshot",
        skills: { athletics: 3 },
        mechanicalSnapshot: createMockMechanicalSnapshot({
          skillDefinitions: createMockSkillDefinitionSnapshot({
            athletics: { id: "athletics", name: "Athletics", attribute: "strength" },
          }),
        }),
      });

      vi.mocked(getCurrentSnapshot).mockResolvedValue(
        createMockVersionRef({ snapshotId: "new-snapshot" })
      );
      vi.mocked(getRulesetSnapshot)
        .mockResolvedValueOnce(
          createMockRuleset({
            modules: {
              ...createMockRuleset().modules,
              skills: { athletics: { id: "athletics", name: "Athletics", attribute: "strength" } },
            },
          })
        )
        .mockResolvedValueOnce(
          createMockRuleset({
            modules: {
              ...createMockRuleset().modules,
              skills: {}, // athletics removed
            },
          })
        );

      const report = await analyzeCharacterDrift(character);

      // Should generate recommendations for each change
      expect(report.recommendations.length).toBe(report.changes.length);
    });

    it("should use cache when provided", async () => {
      const character = createMockCharacter({
        editionCode: "sr5",
        rulesetSnapshotId: "same-snapshot",
      });

      const mockCache = {
        getCurrentSnapshot: vi
          .fn()
          .mockResolvedValue(createMockVersionRef({ snapshotId: "same-snapshot" })),
        getRulesetSnapshot: vi.fn(),
      };

      // @ts-expect-error - partial mock cache
      const report = await analyzeCharacterDrift(character, mockCache);

      expect(mockCache.getCurrentSnapshot).toHaveBeenCalled();
      expect(getCurrentSnapshot).not.toHaveBeenCalled();
      expect(report.overallSeverity).toBe("none");
    });
  });

  // ===========================================================================
  // analyzeMetatypeDrift
  // ===========================================================================

  describe("analyzeMetatypeDrift", () => {
    it("should return empty array when no metatypes in ruleset", () => {
      const snapshot = createMockMetatypeSnapshot({ id: "human" });
      const ruleset = createMockRuleset({
        modules: { ...createMockRuleset().modules, metatypes: undefined },
      });

      const changes = analyzeMetatypeDrift(snapshot, ruleset);

      expect(changes).toEqual([]);
    });

    it("should return empty array when no snapshot provided", () => {
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          metatypes: { human: { id: "human" } },
        },
      });

      // @ts-expect-error - testing null case
      const changes = analyzeMetatypeDrift(null, ruleset);

      expect(changes).toEqual([]);
    });

    it("should detect metatype removal", () => {
      const snapshot = createMockMetatypeSnapshot({ id: "pixie" });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          metatypes: { human: { id: "human" } }, // pixie not present
        },
      });

      const changes = analyzeMetatypeDrift(snapshot, ruleset);

      expect(changes).toHaveLength(1);
      expect(changes[0].changeType).toBe("removed");
      expect(changes[0].severity).toBe("breaking");
      expect(changes[0].description).toContain("pixie");
      expect(changes[0].description).toContain("removed");
    });

    it("should detect attribute modifier decrease (breaking)", () => {
      const snapshot = createMockMetatypeSnapshot({
        id: "elf",
        attributeModifiers: { agility: 2, charisma: 2 },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          metatypes: {
            elf: { id: "elf", attributeModifiers: { agility: 1, charisma: 2 } }, // agility decreased
          },
        },
      });

      const changes = analyzeMetatypeDrift(snapshot, ruleset);

      const agilityChange = changes.find((c) => c.description.includes("agility"));
      expect(agilityChange).toBeDefined();
      expect(agilityChange?.severity).toBe("breaking");
      expect(agilityChange?.description).toContain("decreased");
    });

    it("should detect attribute modifier increase (non-breaking)", () => {
      const snapshot = createMockMetatypeSnapshot({
        id: "dwarf",
        attributeModifiers: { body: 1 },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          metatypes: {
            dwarf: { id: "dwarf", attributeModifiers: { body: 2 } }, // increased
          },
        },
      });

      const changes = analyzeMetatypeDrift(snapshot, ruleset);

      const bodyChange = changes.find((c) => c.description.includes("body"));
      expect(bodyChange).toBeDefined();
      expect(bodyChange?.severity).toBe("non-breaking");
      expect(bodyChange?.description).toContain("increased");
    });

    it("should detect removed special abilities", () => {
      const snapshot = createMockMetatypeSnapshot({
        id: "troll",
        specialAbilities: ["Thermographic Vision", "Dermal Armor"],
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          metatypes: {
            troll: { id: "troll", specialAbilities: ["Thermographic Vision"] }, // Dermal Armor removed
          },
        },
      });

      const changes = analyzeMetatypeDrift(snapshot, ruleset);

      const abilityChange = changes.find((c) => c.description.includes("Dermal Armor"));
      expect(abilityChange).toBeDefined();
      expect(abilityChange?.changeType).toBe("removed");
      expect(abilityChange?.severity).toBe("breaking");
    });

    it("should detect added special abilities (non-breaking)", () => {
      const snapshot = createMockMetatypeSnapshot({
        id: "ork",
        specialAbilities: ["Low-Light Vision"],
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          metatypes: {
            ork: { id: "ork", specialAbilities: ["Low-Light Vision", "Built Tough"] }, // new ability
          },
        },
      });

      const changes = analyzeMetatypeDrift(snapshot, ruleset);

      const newAbility = changes.find((c) => c.description.includes("Built Tough"));
      expect(newAbility).toBeDefined();
      expect(newAbility?.changeType).toBe("added");
      expect(newAbility?.severity).toBe("non-breaking");
    });
  });

  // ===========================================================================
  // analyzeSkillDrift
  // ===========================================================================

  describe("analyzeSkillDrift", () => {
    it("should return empty array when no skills in ruleset", () => {
      const characterSkills = { firearms: 4 };
      const snapshot = createMockSkillDefinitionSnapshot({
        firearms: { id: "firearms", name: "Firearms" },
      });
      const ruleset = createMockRuleset({
        modules: { ...createMockRuleset().modules, skills: undefined },
      });

      const changes = analyzeSkillDrift(characterSkills, snapshot, ruleset);

      expect(changes).toEqual([]);
    });

    it("should return empty array when no snapshot provided", () => {
      const characterSkills = { firearms: 4 };
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          skills: { firearms: { id: "firearms" } },
        },
      });

      const changes = analyzeSkillDrift(characterSkills, undefined, ruleset);

      expect(changes).toEqual([]);
    });

    it("should skip skills with zero or negative rating", () => {
      const characterSkills = { firearms: 0, athletics: -1 };
      const snapshot = createMockSkillDefinitionSnapshot({
        firearms: { id: "firearms", name: "Firearms" },
        athletics: { id: "athletics", name: "Athletics" },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          skills: {}, // all removed
        },
      });

      const changes = analyzeSkillDrift(characterSkills, snapshot, ruleset);

      // Should not report changes for skills with 0 or negative ratings
      expect(changes).toEqual([]);
    });

    it("should detect skill removal", () => {
      const characterSkills = { blades: 5 };
      const snapshot = createMockSkillDefinitionSnapshot({
        blades: { id: "blades", name: "Blades", attribute: "agility" },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          skills: {}, // blades removed
        },
      });

      const changes = analyzeSkillDrift(characterSkills, snapshot, ruleset);

      expect(changes).toHaveLength(1);
      expect(changes[0].changeType).toBe("removed");
      expect(changes[0].severity).toBe("breaking");
      expect(changes[0].description).toContain("Blades");
    });

    it("should detect attribute change (breaking)", () => {
      const characterSkills = { hacking: 4 };
      const snapshot = createMockSkillDefinitionSnapshot({
        hacking: { id: "hacking", name: "Hacking", attribute: "logic" },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          skills: {
            hacking: { id: "hacking", name: "Hacking", attribute: "intuition" }, // changed
          },
        },
      });

      const changes = analyzeSkillDrift(characterSkills, snapshot, ruleset);

      const attrChange = changes.find((c) => c.description.includes("attribute"));
      expect(attrChange).toBeDefined();
      expect(attrChange?.severity).toBe("breaking");
      expect(attrChange?.description).toContain("logic");
      expect(attrChange?.description).toContain("intuition");
    });

    it("should detect group change (non-breaking)", () => {
      const characterSkills = { pistols: 3 };
      const snapshot = createMockSkillDefinitionSnapshot({
        pistols: { id: "pistols", name: "Pistols", group: "firearms" },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          skills: {
            pistols: { id: "pistols", name: "Pistols", group: "small-arms" }, // group changed
          },
        },
      });

      const changes = analyzeSkillDrift(characterSkills, snapshot, ruleset);

      const groupChange = changes.find((c) => c.description.includes("group"));
      expect(groupChange).toBeDefined();
      expect(groupChange?.severity).toBe("non-breaking");
    });

    it("should detect max rating decrease when character exceeds new max (breaking)", () => {
      const characterSkills = { running: 8 };
      const snapshot = createMockSkillDefinitionSnapshot({
        running: { id: "running", name: "Running", maxRating: 12 },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          skills: {
            running: { id: "running", name: "Running", maxRating: 6 }, // max decreased below character rating
          },
        },
      });

      const changes = analyzeSkillDrift(characterSkills, snapshot, ruleset);

      const maxChange = changes.find((c) => c.description.includes("max rating"));
      expect(maxChange).toBeDefined();
      expect(maxChange?.severity).toBe("breaking");
    });

    it("should detect max rating decrease when character within new max (non-breaking)", () => {
      const characterSkills = { running: 4 };
      const snapshot = createMockSkillDefinitionSnapshot({
        running: { id: "running", name: "Running", maxRating: 12 },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          skills: {
            running: { id: "running", name: "Running", maxRating: 6 }, // max decreased but character still within
          },
        },
      });

      const changes = analyzeSkillDrift(characterSkills, snapshot, ruleset);

      const maxChange = changes.find((c) => c.description.includes("max rating"));
      expect(maxChange).toBeDefined();
      expect(maxChange?.severity).toBe("non-breaking");
    });

    it("should detect max rating increase (non-breaking)", () => {
      const characterSkills = { swimming: 3 };
      const snapshot = createMockSkillDefinitionSnapshot({
        swimming: { id: "swimming", name: "Swimming", maxRating: 6 },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          skills: {
            swimming: { id: "swimming", name: "Swimming", maxRating: 9 }, // increased
          },
        },
      });

      const changes = analyzeSkillDrift(characterSkills, snapshot, ruleset);

      const maxChange = changes.find((c) => c.description.includes("max rating"));
      expect(maxChange).toBeDefined();
      expect(maxChange?.severity).toBe("non-breaking");
      expect(maxChange?.description).toContain("increased");
    });
  });

  // ===========================================================================
  // analyzeQualityDrift
  // ===========================================================================

  describe("analyzeQualityDrift", () => {
    it("should return empty array when no qualities in ruleset", () => {
      const characterQualities = [{ id: "ambidextrous" }];
      const snapshot = createMockQualityDefinitionSnapshot({
        ambidextrous: { id: "ambidextrous", name: "Ambidextrous" },
      });
      const ruleset = createMockRuleset({
        modules: { ...createMockRuleset().modules, qualities: undefined },
      });

      const changes = analyzeQualityDrift(characterQualities, snapshot, ruleset);

      expect(changes).toEqual([]);
    });

    it("should return empty array when no snapshot provided", () => {
      const characterQualities = [{ id: "ambidextrous" }];
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          qualities: { ambidextrous: { id: "ambidextrous" } },
        },
      });

      const changes = analyzeQualityDrift(characterQualities, undefined, ruleset);

      expect(changes).toEqual([]);
    });

    it("should detect quality removal", () => {
      const characterQualities = [{ id: "catlike" }];
      const snapshot = createMockQualityDefinitionSnapshot({
        catlike: { id: "catlike", name: "Catlike" },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          qualities: {}, // catlike removed
        },
      });

      const changes = analyzeQualityDrift(characterQualities, snapshot, ruleset);

      expect(changes).toHaveLength(1);
      expect(changes[0].changeType).toBe("removed");
      expect(changes[0].severity).toBe("breaking");
      expect(changes[0].description).toContain("Catlike");
    });

    it("should detect karma cost change (non-breaking)", () => {
      const characterQualities = [{ id: "tough" }];
      const snapshot = createMockQualityDefinitionSnapshot({
        tough: { id: "tough", name: "Tough", karmaCost: 10 },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          qualities: {
            tough: { id: "tough", name: "Tough", karmaCost: 12 }, // cost increased
          },
        },
      });

      const changes = analyzeQualityDrift(characterQualities, snapshot, ruleset);

      const costChange = changes.find((c) => c.description.includes("karma cost"));
      expect(costChange).toBeDefined();
      expect(costChange?.severity).toBe("non-breaking");
    });

    it("should detect effect changes (breaking)", () => {
      const characterQualities = [{ id: "aptitude" }];
      const snapshot = createMockQualityDefinitionSnapshot({
        aptitude: {
          id: "aptitude",
          name: "Aptitude",
          effects: { maxSkillRating: 7 },
        },
      });
      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          qualities: {
            aptitude: {
              id: "aptitude",
              name: "Aptitude",
              effects: { maxSkillRating: 8, bonusDice: 1 }, // effects changed
            },
          },
        },
      });

      const changes = analyzeQualityDrift(characterQualities, snapshot, ruleset);

      const effectChange = changes.find((c) => c.description.includes("effects"));
      expect(effectChange).toBeDefined();
      expect(effectChange?.severity).toBe("breaking");
    });

    it("should not report when effects are identical", () => {
      // Use pre-stringified effects that match what both snapshot and ruleset expect
      const effectsArray = ["bonus_dice:1"];
      const characterQualities = [{ id: "aptitude" }];

      // Create snapshot directly with the properly typed effects array
      const snapshot: QualityDefinitionSnapshot = {
        qualities: {
          aptitude: {
            id: "aptitude",
            name: "Aptitude",
            type: "positive",
            karmaCost: 10,
            effects: effectsArray,
          },
        },
      };

      const ruleset = createMockRuleset({
        modules: {
          ...createMockRuleset().modules,
          qualities: {
            aptitude: { id: "aptitude", name: "Aptitude", effects: effectsArray }, // same effects
          },
        },
      });

      const changes = analyzeQualityDrift(characterQualities, snapshot, ruleset);

      const effectChange = changes.find((c) => c.description.includes("effects"));
      expect(effectChange).toBeUndefined();
    });
  });

  // ===========================================================================
  // classifyDriftSeverity
  // ===========================================================================

  describe("classifyDriftSeverity", () => {
    it("should return 'none' for empty changes array", () => {
      const severity = classifyDriftSeverity([]);

      expect(severity).toBe("none");
    });

    it("should return 'non-breaking' when all changes are non-breaking", () => {
      const changes: DriftChange[] = [
        {
          id: "1",
          module: "skills",
          changeType: "added",
          severity: "non-breaking",
          affectedItems: [],
          description: "New skill added",
        },
        {
          id: "2",
          module: "qualities",
          changeType: "modified",
          severity: "non-breaking",
          affectedItems: [],
          description: "Cost changed",
        },
      ];

      const severity = classifyDriftSeverity(changes);

      expect(severity).toBe("non-breaking");
    });

    it("should return 'breaking' when any change is breaking", () => {
      const changes: DriftChange[] = [
        {
          id: "1",
          module: "skills",
          changeType: "added",
          severity: "non-breaking",
          affectedItems: [],
          description: "New skill added",
        },
        {
          id: "2",
          module: "metatypes",
          changeType: "removed",
          severity: "breaking",
          affectedItems: [],
          description: "Metatype removed",
        },
      ];

      const severity = classifyDriftSeverity(changes);

      expect(severity).toBe("breaking");
    });
  });

  // ===========================================================================
  // isAutoResolvable
  // ===========================================================================

  describe("isAutoResolvable", () => {
    it("should return true for non-breaking changes", () => {
      const change: DriftChange = {
        id: "1",
        module: "skills",
        changeType: "modified",
        severity: "non-breaking",
        affectedItems: [],
        description: "Minor change",
      };

      expect(isAutoResolvable(change)).toBe(true);
    });

    it("should return true for added changes (regardless of severity)", () => {
      const change: DriftChange = {
        id: "1",
        module: "qualities",
        changeType: "added",
        severity: "breaking", // Even if marked breaking, additions are auto-resolvable
        affectedItems: [],
        description: "New quality added",
      };

      expect(isAutoResolvable(change)).toBe(true);
    });

    it("should return false for breaking modified changes", () => {
      const change: DriftChange = {
        id: "1",
        module: "skills",
        changeType: "modified",
        severity: "breaking",
        affectedItems: [],
        description: "Attribute changed",
      };

      expect(isAutoResolvable(change)).toBe(false);
    });

    it("should return false for removed changes", () => {
      const change: DriftChange = {
        id: "1",
        module: "metatypes",
        changeType: "removed",
        severity: "breaking",
        affectedItems: [],
        description: "Metatype removed",
      };

      expect(isAutoResolvable(change)).toBe(false);
    });

    it("should return false for renamed changes", () => {
      const change: DriftChange = {
        id: "1",
        module: "skills",
        changeType: "renamed",
        severity: "breaking",
        affectedItems: [],
        description: "Skill renamed",
      };

      expect(isAutoResolvable(change)).toBe(false);
    });

    it("should return false for restructured changes", () => {
      const change: DriftChange = {
        id: "1",
        module: "gear",
        changeType: "restructured",
        severity: "breaking",
        affectedItems: [],
        description: "Gear structure changed",
      };

      expect(isAutoResolvable(change)).toBe(false);
    });
  });
});
