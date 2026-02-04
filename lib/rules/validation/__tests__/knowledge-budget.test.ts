/**
 * Knowledge Budget Validator Tests
 *
 * Tests for knowledge point budget enforcement during character creation.
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

function createMockRuleset(): MergedRuleset {
  return {
    snapshotId: "test-snapshot",
    editionId: "sr5",
    editionCode: "sr5",
    bookIds: ["core-rulebook"],
    modules: {},
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
      // INT 4 + LOG 5 = 9, budget = 18
      attributes: {
        body: 3,
        agility: 3,
        reaction: 3,
        strength: 3,
        willpower: 3,
        logic: 5,
        intuition: 4,
        charisma: 3,
      },
      identities: [{ name: "Fake SIN", type: "fake", rating: 4 }],
      lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
    } as unknown as Character,
    ruleset: createMockRuleset(),
    mode: "creation",
    ...overrides,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("knowledgeBudgetValidator", () => {
  it("passes when knowledge spending is within budget", async () => {
    // Budget: (4 + 5) × 2 = 18
    const context = createContext({
      creationState: {
        selections: {
          languages: [
            { name: "English", rating: 6, isNative: true },
            { name: "Japanese", rating: 3 },
          ],
          knowledgeSkills: [
            { name: "Shadowrun History", category: "academic", rating: 4 },
            { name: "Seattle Gangs", category: "street", rating: 3 },
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "KNOWLEDGE_BUDGET_EXCEEDED")).toBe(false);
  });

  it("reports error when knowledge spending exceeds budget", async () => {
    // Budget: (4 + 5) × 2 = 18
    const context = createContext({
      creationState: {
        selections: {
          languages: [
            { name: "English", rating: 6, isNative: true }, // Free (native)
            { name: "Japanese", rating: 5 }, // 5 points
            { name: "Mandarin", rating: 4 }, // 4 points
          ],
          knowledgeSkills: [
            { name: "Matrix Security", category: "professional", rating: 5 }, // 5
            { name: "Seattle History", category: "academic", rating: 5 }, // 5 → total 19 > 18
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "KNOWLEDGE_BUDGET_EXCEEDED")).toBe(true);
  });

  it("excludes native languages from budget calculation", async () => {
    // Budget: (4 + 5) × 2 = 18
    // Without native exclusion, total would be 6 + 3 + 10 = 19 (over budget)
    // With native exclusion, total is 3 + 10 = 13 (within budget)
    const context = createContext({
      creationState: {
        selections: {
          languages: [
            { name: "English", rating: 6, isNative: true }, // Excluded
            { name: "Japanese", rating: 3 }, // 3 points
          ],
          knowledgeSkills: [
            { name: "Matrix Security", category: "professional", rating: 5 }, // 5
            { name: "Seattle History", category: "academic", rating: 5 }, // 5 → total 13
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "KNOWLEDGE_BUDGET_EXCEEDED")).toBe(false);
  });

  it("warns about no native language at finalization", async () => {
    const context = createContext({
      mode: "finalization",
      creationState: {
        selections: {
          languages: [{ name: "Japanese", rating: 3 }],
          knowledgeSkills: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.warnings.some((w) => w.code === "KNOWLEDGE_NO_NATIVE_LANGUAGE")).toBe(true);
  });

  it("does not warn about no native language during creation", async () => {
    const context = createContext({
      mode: "creation",
      creationState: {
        selections: {
          languages: [{ name: "Japanese", rating: 3 }],
          knowledgeSkills: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.warnings.some((w) => w.code === "KNOWLEDGE_NO_NATIVE_LANGUAGE")).toBe(false);
  });

  it("warns about unspent points at finalization", async () => {
    // Budget: 18, spending: 3 → 15 remaining
    const context = createContext({
      mode: "finalization",
      creationState: {
        selections: {
          languages: [
            { name: "English", rating: 6, isNative: true },
            { name: "Japanese", rating: 3 },
          ],
          knowledgeSkills: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.warnings.some((w) => w.code === "KNOWLEDGE_POINTS_REMAINING")).toBe(true);
  });

  it("does not warn about unspent points when fully spent", async () => {
    // Budget: 18, spending exactly 18
    const context = createContext({
      mode: "finalization",
      creationState: {
        selections: {
          languages: [
            { name: "English", rating: 6, isNative: true },
            { name: "Japanese", rating: 5 }, // 5
            { name: "Spanish", rating: 4 }, // 4
          ],
          knowledgeSkills: [
            { name: "History", category: "academic", rating: 5 }, // 5
            { name: "Street Gangs", category: "street", rating: 4 }, // 4 → total 18
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.warnings.some((w) => w.code === "KNOWLEDGE_POINTS_REMAINING")).toBe(false);
  });

  it("handles empty selections gracefully", async () => {
    const context = createContext({
      creationState: {
        selections: {},
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "KNOWLEDGE_BUDGET_EXCEEDED")).toBe(false);
  });

  it("handles missing creationState gracefully", async () => {
    const context = createContext({
      creationState: undefined,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "KNOWLEDGE_BUDGET_EXCEEDED")).toBe(false);
  });

  it("calculates budget correctly with different attribute values", async () => {
    // INT 2 + LOG 3 = 5, budget = 10
    const context = createContext({
      character: {
        name: "Low Mental",
        metatype: "ork",
        magicalPath: "mundane",
        attributes: {
          body: 5,
          agility: 3,
          reaction: 3,
          strength: 5,
          willpower: 3,
          logic: 3,
          intuition: 2,
          charisma: 2,
        },
        identities: [{ name: "SIN", type: "fake", rating: 4 }],
        lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
      } as unknown as Character,
      creationState: {
        selections: {
          languages: [
            { name: "Or'zet", rating: 6, isNative: true },
            { name: "English", rating: 4 }, // 4
          ],
          knowledgeSkills: [
            { name: "Brawling Tactics", category: "street", rating: 4 }, // 4
            { name: "Ork Underground", category: "interests", rating: 3 }, // 3 → total 11 > 10
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "KNOWLEDGE_BUDGET_EXCEEDED")).toBe(true);
  });
});
