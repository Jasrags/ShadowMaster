/**
 * Tests for calculateRemainingBudget — ensures the function throws
 * when creationState is absent instead of silently returning 0.
 *
 * Covers issue #654.
 */

import { describe, it, expect } from "vitest";
import { calculateRemainingBudget } from "@/lib/rules/constraint-validation";
import type { Character, CreationState } from "@/lib/types";

// Minimal character stub — only the fields the function signature requires
const stubCharacter = { id: "char-1" } as Character;

describe("calculateRemainingBudget", () => {
  it("returns the tracked budget value when creationState is present", () => {
    const creationState = {
      budgets: { karma: 25, resources: 50000 },
    } as unknown as CreationState;

    expect(calculateRemainingBudget("karma", stubCharacter, creationState)).toBe(25);
    expect(calculateRemainingBudget("resources", stubCharacter, creationState)).toBe(50000);
  });

  it("returns 0 for a known budget that has been fully spent", () => {
    const creationState = {
      budgets: { karma: 0 },
    } as unknown as CreationState;

    expect(calculateRemainingBudget("karma", stubCharacter, creationState)).toBe(0);
  });

  it("throws when creationState is undefined", () => {
    expect(() =>
      calculateRemainingBudget("karma", stubCharacter, undefined)
    ).toThrow();
  });

  it("throws when creationState is explicitly omitted (no second arg)", () => {
    expect(() =>
      calculateRemainingBudget("karma", stubCharacter)
    ).toThrow();
  });

  it("throws when creationState has no entry for the requested budgetId", () => {
    const creationState = {
      budgets: { resources: 100 },
    } as unknown as CreationState;

    expect(() =>
      calculateRemainingBudget("karma", stubCharacter, creationState)
    ).toThrow();
  });
});
