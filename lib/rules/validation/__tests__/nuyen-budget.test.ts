/**
 * Nuyen Budget Validator Integration Tests
 *
 * Tests for server-side nuyen budget validation during character finalization.
 */

import { describe, it, expect } from "vitest";
import { validateCharacter } from "../character-validator";
import type { CharacterValidationContext } from "../types";
import type { Character } from "@/lib/types/character";
import type { MergedRuleset } from "@/lib/types";
import type { CreationState } from "@/lib/types/creation";
import type { PriorityTableData } from "@/lib/rules/loader-types";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockPriorityTable(resourceNuyen: number): PriorityTableData {
  return {
    levels: ["A", "B", "C", "D", "E"],
    categories: [{ id: "resources", name: "Resources" }],
    table: {
      A: { resources: 450000 },
      B: { resources: 275000 },
      C: { resources: resourceNuyen },
      D: { resources: 50000 },
      E: { resources: 6000 },
    },
  } as PriorityTableData;
}

function createMockRuleset(resourceNuyen = 140000): MergedRuleset {
  return {
    snapshotId: "test-snapshot",
    editionId: "sr5",
    editionCode: "sr5",
    bookIds: ["core-rulebook"],
    modules: {
      priorities: createMockPriorityTable(resourceNuyen),
    },
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

describe("nuyenBudgetValidator", () => {
  it("passes when nuyen spent is within budget", async () => {
    const context = createContext({
      creationState: {
        priorities: { resources: "C" }, // 140,000¥
        selections: {
          gear: [{ cost: 1000, quantity: 1 }],
          weapons: [{ cost: 500, quantity: 1 }],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "NUYEN_BUDGET_EXCEEDED")).toBe(false);
    expect(result.errors.some((e) => e.code === "NUYEN_CALCULATION_MISMATCH")).toBe(false);
  });

  it("reports error when nuyen spent exceeds budget", async () => {
    const context = createContext({
      ruleset: createMockRuleset(10000), // Low budget
      creationState: {
        priorities: { resources: "C" }, // 10,000¥ (from mock)
        selections: {
          gear: [{ cost: 5000, quantity: 3 }], // 15,000¥ exceeds 10,000¥
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "NUYEN_BUDGET_EXCEEDED")).toBe(true);
  });

  it("includes karma-to-nuyen conversion in budget", async () => {
    const context = createContext({
      ruleset: createMockRuleset(10000), // Base 10,000¥
      creationState: {
        priorities: { resources: "C" },
        selections: {
          gear: [{ cost: 18000, quantity: 1 }], // 18,000¥ - exceeds base but fits with conversion
        },
        budgets: {
          "karma-spent-gear": 5, // 5 karma × 2,000¥ = 10,000¥ extra
        },
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    // 10,000 base + 10,000 conversion = 20,000 total
    // 18,000 spent < 20,000 available
    expect(result.errors.some((e) => e.code === "NUYEN_BUDGET_EXCEEDED")).toBe(false);
  });

  it("reports error when spending exceeds budget including conversion", async () => {
    const context = createContext({
      ruleset: createMockRuleset(10000),
      creationState: {
        priorities: { resources: "C" },
        selections: {
          gear: [{ cost: 25000, quantity: 1 }], // 25,000¥ exceeds total budget
        },
        budgets: {
          "karma-spent-gear": 5, // +10,000¥ = 20,000 total
        },
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "NUYEN_BUDGET_EXCEEDED")).toBe(true);
  });

  it("only runs at finalization mode", async () => {
    const context = createContext({
      mode: "creation", // Not finalization
      ruleset: createMockRuleset(1000),
      creationState: {
        priorities: { resources: "C" },
        selections: {
          gear: [{ cost: 5000, quantity: 1 }], // Exceeds budget
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    // Should not report nuyen budget errors during creation mode
    expect(result.errors.some((e) => e.code === "NUYEN_BUDGET_EXCEEDED")).toBe(false);
  });

  it("handles missing priority table gracefully", async () => {
    const context = createContext({
      ruleset: {
        snapshotId: "test",
        editionId: "sr5",
        editionCode: "sr5",
        bookIds: [],
        modules: {}, // No priorities module
        createdAt: new Date().toISOString(),
      } as unknown as MergedRuleset,
      creationState: {
        priorities: { resources: "C" },
        selections: {
          gear: [{ cost: 5000, quantity: 1 }],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    // Should not crash, no nuyen errors since can't validate without table
    expect(result.errors.some((e) => e.code === "NUYEN_BUDGET_EXCEEDED")).toBe(false);
  });

  it("handles missing creationState gracefully", async () => {
    const context = createContext({
      creationState: undefined,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "NUYEN_BUDGET_EXCEEDED")).toBe(false);
    expect(result.errors.some((e) => e.code === "NUYEN_CALCULATION_MISMATCH")).toBe(false);
  });

  it("handles missing resources priority gracefully", async () => {
    const context = createContext({
      creationState: {
        priorities: {}, // No resources priority assigned
        selections: {
          gear: [{ cost: 5000, quantity: 1 }],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    // Should not crash
    expect(result.errors.some((e) => e.code === "NUYEN_BUDGET_EXCEEDED")).toBe(false);
  });
});
