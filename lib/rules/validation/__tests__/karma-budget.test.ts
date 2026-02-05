/**
 * Karma Budget Validator Integration Tests
 *
 * Tests for server-side karma budget validation during character finalization.
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
      name: "Test Character",
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
    mode: "finalization",
    ...overrides,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("karmaBudgetValidator", () => {
  it("passes when karma spent is within 25 karma budget", async () => {
    const context = createContext({
      creationState: {
        selections: {
          positiveQualities: [{ id: "quality1", karma: 10 }],
          negativeQualities: [{ id: "quality2", karma: 5 }],
          attributes: { charisma: 3 },
          contacts: [], // No overflow
        },
        budgets: {
          "karma-spent-gear": 3, // karma-to-nuyen conversion
        },
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    // 10 (positive) - 5 (negative) + 3 (gear) = 8 karma, under 25
    expect(result.errors.some((e) => e.code === "KARMA_BUDGET_EXCEEDED")).toBe(false);
    expect(result.errors.some((e) => e.code === "KARMA_CALCULATION_MISMATCH")).toBe(false);
  });

  it("reports error when karma spent exceeds 25", async () => {
    const context = createContext({
      creationState: {
        selections: {
          positiveQualities: [
            { id: "q1", karma: 15 },
            { id: "q2", karma: 15 },
          ], // 30 karma
          negativeQualities: [],
          attributes: { charisma: 3 },
          contacts: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "KARMA_BUDGET_EXCEEDED")).toBe(true);
  });

  it("reports error when karma-to-nuyen exceeds 10", async () => {
    const context = createContext({
      creationState: {
        selections: {
          positiveQualities: [],
          negativeQualities: [],
          attributes: { charisma: 3 },
          contacts: [],
        },
        budgets: {
          "karma-spent-gear": 15, // Exceeds 10 karma limit
        },
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "KARMA_TO_NUYEN_LIMIT_EXCEEDED")).toBe(true);
  });

  it("allows exactly 10 karma for nuyen conversion", async () => {
    const context = createContext({
      creationState: {
        selections: {
          positiveQualities: [],
          negativeQualities: [],
          attributes: { charisma: 3 },
          contacts: [],
        },
        budgets: {
          "karma-spent-gear": 10, // Exactly at limit
        },
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "KARMA_TO_NUYEN_LIMIT_EXCEEDED")).toBe(false);
  });

  it("accounts for negative qualities giving karma back", async () => {
    const context = createContext({
      creationState: {
        selections: {
          positiveQualities: [{ id: "pos", karma: 20 }],
          negativeQualities: [{ id: "neg", karma: 10 }], // Gives 10 karma back
          attributes: { charisma: 3 },
          contacts: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    // 20 (positive) - 10 (negative) = 10 net, under 25
    expect(result.errors.some((e) => e.code === "KARMA_BUDGET_EXCEEDED")).toBe(false);
  });

  it("includes contact overflow in karma calculation", async () => {
    const context = createContext({
      creationState: {
        selections: {
          positiveQualities: [{ id: "pos", karma: 20 }],
          negativeQualities: [],
          attributes: { charisma: 1 }, // Free pool = 3
          contacts: [
            { connection: 3, loyalty: 3 }, // 6 points, 3 overflow karma
            { connection: 3, loyalty: 3 }, // 6 more, total 12, 9 overflow
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    // 20 (positive) + 9 (contact overflow) = 29, exceeds 25
    expect(result.errors.some((e) => e.code === "KARMA_BUDGET_EXCEEDED")).toBe(true);
  });

  it("includes skill karma in calculation", async () => {
    const context = createContext({
      creationState: {
        selections: {
          positiveQualities: [{ id: "pos", karma: 10 }],
          negativeQualities: [],
          attributes: { charisma: 3 },
          contacts: [],
          skillKarmaSpent: {
            skillRaises: { pistols: 10 },
            specializations: 7, // 7 karma for specialization
          },
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    // 10 (quality) + 17 (skills) = 27, exceeds 25
    expect(result.errors.some((e) => e.code === "KARMA_BUDGET_EXCEEDED")).toBe(true);
  });

  it("only runs at finalization mode", async () => {
    const context = createContext({
      mode: "creation", // Not finalization
      creationState: {
        selections: {
          positiveQualities: [{ id: "q1", karma: 30 }], // Way over budget
          negativeQualities: [],
          attributes: { charisma: 3 },
          contacts: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    // Should not report karma budget errors during creation mode
    expect(result.errors.some((e) => e.code === "KARMA_BUDGET_EXCEEDED")).toBe(false);
  });

  it("handles missing creationState gracefully", async () => {
    const context = createContext({
      creationState: undefined,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "KARMA_BUDGET_EXCEEDED")).toBe(false);
    expect(result.errors.some((e) => e.code === "KARMA_CALCULATION_MISMATCH")).toBe(false);
    expect(result.errors.some((e) => e.code === "KARMA_TO_NUYEN_LIMIT_EXCEEDED")).toBe(false);
  });

  it("sums all karma sources correctly", async () => {
    const context = createContext({
      creationState: {
        selections: {
          positiveQualities: [{ id: "pos", karma: 5 }],
          negativeQualities: [{ id: "neg", karma: 3 }],
          attributes: { charisma: 1 }, // Free pool = 3
          contacts: [{ connection: 2, loyalty: 2 }], // 4 - 3 = 1 overflow
          skillKarmaSpent: {
            skillRaises: { pistols: 5 },
            specializations: 7,
            groupRaises: { firearms: 3 },
          },
        },
        budgets: {
          "karma-spent-gear": 2,
          "karma-spent-spells": 4,
          "karma-spent-power-points": 1,
          "karma-spent-attributes": 3,
          "karma-spent-foci": 2,
        },
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    // positiveQualities: 5
    // negativeQualities: -3
    // karmaToNuyen: 2
    // spells: 4
    // powerPoints: 1
    // attributes: 3
    // foci: 2
    // skills: 5+7+3 = 15
    // contacts: 1
    // Total: 5 - 3 + 2 + 4 + 1 + 3 + 2 + 15 + 1 = 30 (exceeds 25)
    expect(result.errors.some((e) => e.code === "KARMA_BUDGET_EXCEEDED")).toBe(true);
  });
});
