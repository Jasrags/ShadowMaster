/**
 * Priority Consistency Validator Tests
 *
 * Tests for priority assignment validation: uniqueness, metatype validity,
 * and magic path validity against the priority table.
 */

import { describe, it, expect } from "vitest";
import { validateCharacter } from "../character-validator";
import type { CharacterValidationContext } from "../types";
import type { Character } from "@/lib/types/character";
import type { MergedRuleset } from "@/lib/types";
import type { CreationState } from "@/lib/types/creation";

// =============================================================================
// TEST FIXTURES
// =============================================================================

/**
 * Minimal SR5 priority table for testing.
 * Mirrors the real data structure from core-rulebook.json.
 */
function createMockPriorityTable() {
  return {
    A: {
      metatype: { available: ["human", "elf", "dwarf", "ork", "troll"] },
      magic: {
        options: [{ path: "magician" }, { path: "mystic-adept" }, { path: "technomancer" }],
      },
    },
    B: {
      metatype: { available: ["human", "elf", "dwarf", "ork", "troll"] },
      magic: {
        options: [
          { path: "magician" },
          { path: "mystic-adept" },
          { path: "technomancer" },
          { path: "adept" },
          { path: "aspected-mage" },
        ],
      },
    },
    C: {
      metatype: { available: ["human", "elf", "dwarf", "ork"] },
      magic: {
        options: [
          { path: "magician" },
          { path: "mystic-adept" },
          { path: "technomancer" },
          { path: "adept" },
          { path: "aspected-mage" },
        ],
      },
    },
    D: {
      metatype: { available: ["human", "elf"] },
      magic: {
        options: [{ path: "adept" }, { path: "aspected-mage" }],
      },
    },
    E: {
      metatype: { available: ["human"] },
      magic: { options: [] },
    },
  };
}

function createMockRuleset(): MergedRuleset {
  return {
    snapshotId: "test-snapshot",
    editionId: "sr5",
    editionCode: "sr5",
    bookIds: ["core-rulebook"],
    modules: {
      priorities: {
        table: createMockPriorityTable(),
      },
    },
    createdAt: new Date().toISOString(),
  } as unknown as MergedRuleset;
}

function createContext(
  overrides: Partial<CharacterValidationContext> = {}
): CharacterValidationContext {
  return {
    character: {
      name: "Test Runner",
      metatype: "human",
      magicalPath: "mundane",
      attributes: {
        body: 3,
        agility: 3,
        reaction: 3,
        strength: 3,
        willpower: 3,
        logic: 3,
        intuition: 3,
        charisma: 3,
      },
      identities: [{ name: "Fake SIN", type: "fake", rating: 4 }],
      lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
    } as unknown as Character,
    ruleset: createMockRuleset(),
    mode: "creation",
    creationState: {
      priorities: {
        metatype: "A",
        attributes: "B",
        magic: "C",
        skills: "D",
        resources: "E",
      },
      selections: {},
      budgets: {},
    } as unknown as CreationState,
    ...overrides,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("priorityConsistencyValidator", () => {
  // ---------------------------------------------------------------------------
  // Completeness & Uniqueness
  // ---------------------------------------------------------------------------

  describe("completeness", () => {
    it("passes with valid unique A-E priorities", async () => {
      const context = createContext();
      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code === "PRIORITY_INCOMPLETE")).toBe(false);
      expect(result.errors.some((e) => e.code === "PRIORITY_INVALID_LEVEL")).toBe(false);
      expect(result.errors.some((e) => e.code === "PRIORITY_DUPLICATE_LEVEL")).toBe(false);
    });

    it("warns when priorities are incomplete during creation", async () => {
      const context = createContext({
        mode: "creation",
        creationState: {
          priorities: {
            metatype: "A",
            attributes: "B",
            // missing magic, skills, resources
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      const incomplete = result.warnings.find((w) => w.code === "PRIORITY_INCOMPLETE");
      expect(incomplete).toBeDefined();
      expect(incomplete!.severity).toBe("warning");
    });

    it("errors when priorities are incomplete at finalization", async () => {
      const context = createContext({
        mode: "finalization",
        creationState: {
          priorities: {
            metatype: "A",
            attributes: "B",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      const incomplete = result.errors.find((e) => e.code === "PRIORITY_INCOMPLETE");
      expect(incomplete).toBeDefined();
      expect(incomplete!.severity).toBe("error");
    });

    it("errors for invalid level 'F'", async () => {
      const context = createContext({
        creationState: {
          priorities: {
            metatype: "A",
            attributes: "B",
            magic: "C",
            skills: "D",
            resources: "F",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code === "PRIORITY_INVALID_LEVEL")).toBe(true);
    });

    it("errors when two categories share the same level", async () => {
      const context = createContext({
        creationState: {
          priorities: {
            metatype: "A",
            attributes: "A",
            magic: "C",
            skills: "D",
            resources: "E",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code === "PRIORITY_DUPLICATE_LEVEL")).toBe(true);
    });

    it("returns no issues when creationState is undefined", async () => {
      const context = createContext({
        creationState: undefined,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code.startsWith("PRIORITY_"))).toBe(false);
      expect(result.warnings.some((w) => w.code.startsWith("PRIORITY_"))).toBe(false);
    });

    it("returns no issues when priorities are undefined", async () => {
      const context = createContext({
        creationState: {
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code.startsWith("PRIORITY_"))).toBe(false);
      expect(result.warnings.some((w) => w.code.startsWith("PRIORITY_"))).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Metatype Validation
  // ---------------------------------------------------------------------------

  describe("metatype validity", () => {
    it("passes for human at priority E", async () => {
      const context = createContext({
        character: {
          name: "Test",
          metatype: "human",
          magicalPath: "mundane",
          attributes: {
            body: 3,
            agility: 3,
            reaction: 3,
            strength: 3,
            willpower: 3,
            logic: 3,
            intuition: 3,
            charisma: 3,
          },
          identities: [{ name: "SIN", type: "fake", rating: 4 }],
          lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
        } as unknown as Character,
        creationState: {
          priorities: {
            metatype: "E",
            attributes: "A",
            magic: "B",
            skills: "C",
            resources: "D",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code === "PRIORITY_METATYPE_INVALID")).toBe(false);
    });

    it("errors for troll at priority D", async () => {
      const context = createContext({
        character: {
          name: "Test",
          metatype: "troll",
          magicalPath: "mundane",
          attributes: {
            body: 5,
            agility: 1,
            reaction: 1,
            strength: 5,
            willpower: 1,
            logic: 1,
            intuition: 1,
            charisma: 1,
          },
          identities: [{ name: "SIN", type: "fake", rating: 4 }],
          lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
        } as unknown as Character,
        creationState: {
          priorities: {
            metatype: "D",
            attributes: "A",
            magic: "B",
            skills: "C",
            resources: "E",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code === "PRIORITY_METATYPE_INVALID")).toBe(true);
    });

    it("errors for ork at priority E", async () => {
      const context = createContext({
        character: {
          name: "Test",
          metatype: "ork",
          magicalPath: "mundane",
          attributes: {
            body: 4,
            agility: 3,
            reaction: 3,
            strength: 3,
            willpower: 3,
            logic: 3,
            intuition: 3,
            charisma: 3,
          },
          identities: [{ name: "SIN", type: "fake", rating: 4 }],
          lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
        } as unknown as Character,
        creationState: {
          priorities: {
            metatype: "E",
            attributes: "A",
            magic: "B",
            skills: "C",
            resources: "D",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code === "PRIORITY_METATYPE_INVALID")).toBe(true);
    });

    it("skips metatype check when no metatype selected", async () => {
      const context = createContext({
        character: {
          name: "Test",
          metatype: "",
          magicalPath: "mundane",
          attributes: {},
        } as unknown as Character,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code === "PRIORITY_METATYPE_INVALID")).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Magic Path Validation
  // ---------------------------------------------------------------------------

  describe("magic path validity", () => {
    it("passes for magician at priority A", async () => {
      const context = createContext({
        character: {
          name: "Test Mage",
          metatype: "human",
          magicalPath: "full-mage",
          attributes: {
            body: 3,
            agility: 3,
            reaction: 3,
            strength: 3,
            willpower: 3,
            logic: 3,
            intuition: 3,
            charisma: 3,
          },
          identities: [{ name: "SIN", type: "fake", rating: 4 }],
          lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
        } as unknown as Character,
        creationState: {
          priorities: {
            metatype: "B",
            attributes: "C",
            magic: "A",
            skills: "D",
            resources: "E",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code === "PRIORITY_MAGIC_PATH_INVALID")).toBe(false);
    });

    it("errors for magician at priority D", async () => {
      const context = createContext({
        character: {
          name: "Test Mage",
          metatype: "human",
          magicalPath: "full-mage",
          attributes: {
            body: 3,
            agility: 3,
            reaction: 3,
            strength: 3,
            willpower: 3,
            logic: 3,
            intuition: 3,
            charisma: 3,
          },
          identities: [{ name: "SIN", type: "fake", rating: 4 }],
          lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
        } as unknown as Character,
        creationState: {
          priorities: {
            metatype: "A",
            attributes: "B",
            magic: "D",
            skills: "C",
            resources: "E",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code === "PRIORITY_MAGIC_PATH_INVALID")).toBe(true);
    });

    it("errors for technomancer at priority E", async () => {
      const context = createContext({
        character: {
          name: "Test Techno",
          metatype: "human",
          magicalPath: "technomancer",
          attributes: {
            body: 3,
            agility: 3,
            reaction: 3,
            strength: 3,
            willpower: 3,
            logic: 3,
            intuition: 3,
            charisma: 3,
          },
          identities: [{ name: "SIN", type: "fake", rating: 4 }],
          lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
        } as unknown as Character,
        creationState: {
          priorities: {
            metatype: "A",
            attributes: "B",
            magic: "E",
            skills: "C",
            resources: "D",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      expect(result.errors.some((e) => e.code === "PRIORITY_MAGIC_PATH_INVALID")).toBe(true);
    });

    it("maps full-mage to magician correctly for priority lookup", async () => {
      // "full-mage" is the character field value, "magician" is the priority table value
      const context = createContext({
        character: {
          name: "Test Mage",
          metatype: "elf",
          magicalPath: "full-mage",
          attributes: {
            body: 3,
            agility: 3,
            reaction: 3,
            strength: 3,
            willpower: 3,
            logic: 3,
            intuition: 3,
            charisma: 3,
          },
          identities: [{ name: "SIN", type: "fake", rating: 4 }],
          lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
        } as unknown as Character,
        creationState: {
          priorities: {
            metatype: "B",
            attributes: "C",
            magic: "A",
            skills: "D",
            resources: "E",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      // Should NOT error — "full-mage" maps to "magician" which is available at A
      expect(result.errors.some((e) => e.code === "PRIORITY_MAGIC_PATH_INVALID")).toBe(false);
    });

    it("warns for mundane character with non-E magic priority", async () => {
      const context = createContext({
        character: {
          name: "Mundane Sam",
          metatype: "human",
          magicalPath: "mundane",
          attributes: {
            body: 3,
            agility: 3,
            reaction: 3,
            strength: 3,
            willpower: 3,
            logic: 3,
            intuition: 3,
            charisma: 3,
          },
          identities: [{ name: "SIN", type: "fake", rating: 4 }],
          lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
        } as unknown as Character,
        creationState: {
          priorities: {
            metatype: "B",
            attributes: "C",
            magic: "A",
            skills: "D",
            resources: "E",
          },
          selections: {},
          budgets: {},
        } as unknown as CreationState,
      });

      const result = await validateCharacter(context);

      const wasted = result.warnings.find((w) => w.code === "PRIORITY_MAGIC_WASTED");
      expect(wasted).toBeDefined();
      expect(wasted!.severity).toBe("warning");
    });
  });
});
