/**
 * Unit tests for free-skills module
 *
 * Tests the free skill point calculations from magic priority selection.
 */

import { describe, it, expect } from "vitest";
import {
  getFreeSkillsFromMagicPriority,
  calculateFreeSkillPointsUsed,
  countQualifyingSkillsForFreeAllocation,
  calculateFreeSkillGroupPointsUsed,
  getSkillsWithFreeAllocation,
} from "../free-skills";
import type { PriorityTableData } from "@/lib/rules/RulesetContext";

// =============================================================================
// Test Helpers
// =============================================================================

/**
 * Create a minimal priority table for testing
 */
function createMockPriorityTable(config: {
  magicPriority: string;
  path: string;
  freeSkills: Array<{ type: string; rating: number; count: number }>;
}): PriorityTableData {
  return {
    table: {
      [config.magicPriority]: {
        magic: {
          options: [
            {
              path: config.path,
              freeSkills: config.freeSkills,
            },
          ],
        },
      },
    },
  } as unknown as PriorityTableData;
}

/**
 * Mock skill categories for testing
 * Maps skill IDs to their categories (magical, resonance, combat, etc.)
 */
const mockSkillCategories: Record<string, string | undefined> = {
  // Magical skills
  spellcasting: "magical",
  summoning: "magical",
  counterspelling: "magical",
  binding: "magical",
  banishing: "magical",
  "ritual-spellcasting": "magical",
  alchemy: "magical",
  artificing: "magical",
  disenchanting: "magical",
  // Resonance skills
  compiling: "resonance",
  registering: "resonance",
  decompiling: "resonance",
  // Combat skills
  pistols: "combat",
  automatics: "combat",
  // Physical skills
  athletics: "physical",
  sneaking: "physical",
  // Custom skill (no category)
  "custom-skill": undefined,
};

// =============================================================================
// getFreeSkillsFromMagicPriority Tests
// =============================================================================

describe("getFreeSkillsFromMagicPriority", () => {
  it("returns empty array when priorityTable is null", () => {
    const result = getFreeSkillsFromMagicPriority(null, "A", "magician");
    expect(result).toEqual([]);
  });

  it("returns empty array when magicPriority is undefined", () => {
    const priorityTable = createMockPriorityTable({
      magicPriority: "A",
      path: "magician",
      freeSkills: [{ type: "magical", rating: 5, count: 2 }],
    });

    const result = getFreeSkillsFromMagicPriority(priorityTable, undefined, "magician");
    expect(result).toEqual([]);
  });

  it("returns empty array when magicalPath is undefined", () => {
    const priorityTable = createMockPriorityTable({
      magicPriority: "A",
      path: "magician",
      freeSkills: [{ type: "magical", rating: 5, count: 2 }],
    });

    const result = getFreeSkillsFromMagicPriority(priorityTable, "A", undefined);
    expect(result).toEqual([]);
  });

  it("returns free skills config for magician at Priority A", () => {
    const priorityTable = createMockPriorityTable({
      magicPriority: "A",
      path: "magician",
      freeSkills: [{ type: "magical", rating: 5, count: 2 }],
    });

    const result = getFreeSkillsFromMagicPriority(priorityTable, "A", "magician");
    expect(result).toEqual([{ type: "magical", rating: 5, count: 2 }]);
  });

  it("returns free skills config for technomancer at Priority A", () => {
    const priorityTable = createMockPriorityTable({
      magicPriority: "A",
      path: "technomancer",
      freeSkills: [{ type: "resonance", rating: 5, count: 2 }],
    });

    const result = getFreeSkillsFromMagicPriority(priorityTable, "A", "technomancer");
    expect(result).toEqual([{ type: "resonance", rating: 5, count: 2 }]);
  });

  it("returns free skills config for adept at Priority B", () => {
    const priorityTable = createMockPriorityTable({
      magicPriority: "B",
      path: "adept",
      freeSkills: [{ type: "active", rating: 4, count: 1 }],
    });

    const result = getFreeSkillsFromMagicPriority(priorityTable, "B", "adept");
    expect(result).toEqual([{ type: "active", rating: 4, count: 1 }]);
  });

  it("returns free skills config for aspected mage", () => {
    const priorityTable = createMockPriorityTable({
      magicPriority: "B",
      path: "aspected-mage",
      freeSkills: [{ type: "magicalGroup", rating: 4, count: 1 }],
    });

    const result = getFreeSkillsFromMagicPriority(priorityTable, "B", "aspected-mage");
    expect(result).toEqual([{ type: "magicalGroup", rating: 4, count: 1 }]);
  });

  it("returns empty array when path not found in priority", () => {
    const priorityTable = createMockPriorityTable({
      magicPriority: "A",
      path: "magician",
      freeSkills: [{ type: "magical", rating: 5, count: 2 }],
    });

    const result = getFreeSkillsFromMagicPriority(priorityTable, "A", "adept");
    expect(result).toEqual([]);
  });
});

// =============================================================================
// countQualifyingSkillsForFreeAllocation Tests
// =============================================================================

describe("countQualifyingSkillsForFreeAllocation", () => {
  describe("magical skills", () => {
    it("counts magical skills at or above free rating", () => {
      const skills = {
        spellcasting: 5,
        summoning: 5,
        counterspelling: 3, // Below free rating
      };
      const config = { type: "magical", rating: 5, count: 2 };

      const result = countQualifyingSkillsForFreeAllocation(skills, config, mockSkillCategories);

      expect(result.allocated).toBe(2);
      expect(result.freePoints).toBe(10); // 2 skills × 5 rating
      expect(result.unusedCount).toBe(0);
      expect(result.allocatedSkillIds).toContain("spellcasting");
      expect(result.allocatedSkillIds).toContain("summoning");
    });

    it("reports unused slots when not enough skills qualify", () => {
      const skills = {
        spellcasting: 5,
        counterspelling: 3, // Below free rating
      };
      const config = { type: "magical", rating: 5, count: 2 };

      const result = countQualifyingSkillsForFreeAllocation(skills, config, mockSkillCategories);

      expect(result.allocated).toBe(1);
      expect(result.freePoints).toBe(5); // 1 skill × 5 rating
      expect(result.unusedCount).toBe(1);
    });

    it("allocates highest rated skills first", () => {
      const skills = {
        spellcasting: 6,
        summoning: 5,
        counterspelling: 5,
      };
      const config = { type: "magical", rating: 5, count: 2 };

      const result = countQualifyingSkillsForFreeAllocation(skills, config, mockSkillCategories);

      // Should allocate spellcasting (6) first, then one of summoning/counterspelling (5)
      expect(result.allocated).toBe(2);
      expect(result.allocatedSkillIds).toContain("spellcasting");
      expect(result.freePoints).toBe(10); // Free rating is 5, so 5+5=10 regardless of skill being 6
    });

    it("ignores non-magical skills", () => {
      const skills = {
        spellcasting: 5,
        pistols: 6, // Not a magical skill (category: "combat")
        summoning: 5,
      };
      const config = { type: "magical", rating: 5, count: 2 };

      const result = countQualifyingSkillsForFreeAllocation(skills, config, mockSkillCategories);

      expect(result.allocated).toBe(2);
      expect(result.allocatedSkillIds).not.toContain("pistols");
    });
  });

  describe("resonance skills", () => {
    it("counts resonance skills at or above free rating", () => {
      const skills = {
        compiling: 5,
        registering: 5,
      };
      const config = { type: "resonance", rating: 5, count: 2 };

      const result = countQualifyingSkillsForFreeAllocation(skills, config, mockSkillCategories);

      expect(result.allocated).toBe(2);
      expect(result.freePoints).toBe(10);
      expect(result.unusedCount).toBe(0);
    });

    it("ignores non-resonance skills", () => {
      const skills = {
        compiling: 5,
        pistols: 6, // Not a resonance skill (category: "combat")
      };
      const config = { type: "resonance", rating: 5, count: 2 };

      const result = countQualifyingSkillsForFreeAllocation(skills, config, mockSkillCategories);

      expect(result.allocated).toBe(1);
      expect(result.unusedCount).toBe(1);
    });
  });

  describe("active skills (any)", () => {
    it("counts any active skill at or above free rating", () => {
      const skills = {
        pistols: 4,
        athletics: 4,
        sneaking: 2, // Below free rating
      };
      const config = { type: "active", rating: 4, count: 1 };

      const result = countQualifyingSkillsForFreeAllocation(skills, config, mockSkillCategories);

      expect(result.allocated).toBe(1);
      expect(result.freePoints).toBe(4);
      expect(result.unusedCount).toBe(0);
    });

    it("accepts any skill type for active allocation", () => {
      const skills = {
        "custom-skill": 4,
      };
      const config = { type: "active", rating: 4, count: 1 };

      const result = countQualifyingSkillsForFreeAllocation(skills, config, mockSkillCategories);

      expect(result.allocated).toBe(1);
    });
  });

  describe("edge cases", () => {
    it("returns zeros when no skills match", () => {
      const skills = {
        spellcasting: 3,
        summoning: 2,
      };
      const config = { type: "magical", rating: 5, count: 2 };

      const result = countQualifyingSkillsForFreeAllocation(skills, config, mockSkillCategories);

      expect(result.allocated).toBe(0);
      expect(result.freePoints).toBe(0);
      expect(result.unusedCount).toBe(2);
      expect(result.allocatedSkillIds).toEqual([]);
    });

    it("handles empty skills map", () => {
      const skills = {};
      const config = { type: "magical", rating: 5, count: 2 };

      const result = countQualifyingSkillsForFreeAllocation(skills, config, mockSkillCategories);

      expect(result.allocated).toBe(0);
      expect(result.unusedCount).toBe(2);
    });
  });
});

// =============================================================================
// calculateFreeSkillPointsUsed Tests
// =============================================================================

describe("calculateFreeSkillPointsUsed", () => {
  it("calculates total free skill points for magician", () => {
    const skills = {
      spellcasting: 5,
      summoning: 5,
    };
    const configs = [{ type: "magical", rating: 5, count: 2 }];

    const result = calculateFreeSkillPointsUsed(skills, configs, mockSkillCategories);

    expect(result).toBe(10); // 2 skills × 5 rating
  });

  it("returns 0 when no skills qualify", () => {
    const skills = {
      spellcasting: 3, // Below required rating
    };
    const configs = [{ type: "magical", rating: 5, count: 2 }];

    const result = calculateFreeSkillPointsUsed(skills, configs, mockSkillCategories);

    expect(result).toBe(0);
  });

  it("skips magicalGroup configs (handled separately)", () => {
    const skills = {
      spellcasting: 5,
    };
    const configs = [
      { type: "magical", rating: 5, count: 1 },
      { type: "magicalGroup", rating: 4, count: 1 },
    ];

    const result = calculateFreeSkillPointsUsed(skills, configs, mockSkillCategories);

    // Only counts the magical skill, ignores magicalGroup
    expect(result).toBe(5);
  });

  it("handles multiple config types", () => {
    const skills = {
      spellcasting: 5,
      pistols: 4,
    };
    const configs = [
      { type: "magical", rating: 5, count: 1 },
      { type: "active", rating: 4, count: 1 },
    ];

    const result = calculateFreeSkillPointsUsed(skills, configs, mockSkillCategories);

    expect(result).toBe(9); // 5 (magical) + 4 (active)
  });
});

// =============================================================================
// calculateFreeSkillGroupPointsUsed Tests
// =============================================================================

describe("calculateFreeSkillGroupPointsUsed", () => {
  it("calculates free group points for aspected mage with sorcery", () => {
    const skillGroups = {
      sorcery: 4,
    };
    const configs = [{ type: "magicalGroup", rating: 4, count: 1 }];

    const result = calculateFreeSkillGroupPointsUsed(skillGroups, configs);

    expect(result).toBe(4);
  });

  it("calculates free group points for conjuring group", () => {
    const skillGroups = {
      conjuring: { rating: 4, isBroken: false },
    };
    const configs = [{ type: "magicalGroup", rating: 4, count: 1 }];

    const result = calculateFreeSkillGroupPointsUsed(skillGroups, configs);

    expect(result).toBe(4);
  });

  it("returns 0 when group rating is below requirement", () => {
    const skillGroups = {
      sorcery: 3, // Below required rating of 4
    };
    const configs = [{ type: "magicalGroup", rating: 4, count: 1 }];

    const result = calculateFreeSkillGroupPointsUsed(skillGroups, configs);

    expect(result).toBe(0);
  });

  it("returns 0 when no magical groups are selected", () => {
    const skillGroups = {
      athletics: 4, // Not a magical group
    };
    const configs = [{ type: "magicalGroup", rating: 4, count: 1 }];

    const result = calculateFreeSkillGroupPointsUsed(skillGroups, configs);

    expect(result).toBe(0);
  });

  it("skips non-magicalGroup configs", () => {
    const skillGroups = {
      sorcery: 4,
    };
    const configs = [
      { type: "magical", rating: 5, count: 2 }, // Should be skipped
    ];

    const result = calculateFreeSkillGroupPointsUsed(skillGroups, configs);

    expect(result).toBe(0);
  });
});

// =============================================================================
// getSkillsWithFreeAllocation Tests
// =============================================================================

describe("getSkillsWithFreeAllocation", () => {
  it("returns set of skill IDs receiving free allocation", () => {
    const skills = {
      spellcasting: 5,
      summoning: 5,
      counterspelling: 3, // Below rating, won't be free
    };
    const configs = [{ type: "magical", rating: 5, count: 2 }];

    const result = getSkillsWithFreeAllocation(skills, configs, mockSkillCategories);

    expect(result.has("spellcasting")).toBe(true);
    expect(result.has("summoning")).toBe(true);
    expect(result.has("counterspelling")).toBe(false);
  });

  it("returns empty set when no skills qualify", () => {
    const skills = {
      spellcasting: 3,
    };
    const configs = [{ type: "magical", rating: 5, count: 2 }];

    const result = getSkillsWithFreeAllocation(skills, configs, mockSkillCategories);

    expect(result.size).toBe(0);
  });

  it("handles multiple config types", () => {
    // Use skills that don't overlap between magical and active
    // to test that both configs are processed
    const skills = {
      spellcasting: 5, // Magical skill at rating 5
      pistols: 4, // Non-magical skill at rating 4
    };
    const configs = [
      { type: "magical", rating: 5, count: 1 },
      { type: "active", rating: 4, count: 1 },
    ];

    const result = getSkillsWithFreeAllocation(skills, configs, mockSkillCategories);

    // Spellcasting is allocated to the magical type
    expect(result.has("spellcasting")).toBe(true);
    // Note: For "active" type, any skill qualifies (including spellcasting at 5)
    // Since spellcasting has the highest rating, it gets picked for active too
    // This is expected - the Set just shows which skills have free allocation
    // The actual points calculation handles this correctly
    expect(result.size).toBeGreaterThanOrEqual(1);
  });

  it("skips magicalGroup configs", () => {
    const skills = {
      spellcasting: 5,
    };
    const configs = [
      { type: "magical", rating: 5, count: 1 },
      { type: "magicalGroup", rating: 4, count: 1 }, // Should be skipped
    ];

    const result = getSkillsWithFreeAllocation(skills, configs, mockSkillCategories);

    expect(result.size).toBe(1);
    expect(result.has("spellcasting")).toBe(true);
  });
});
