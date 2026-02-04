/**
 * Complex Form Validator Tests
 *
 * Tests for complex form allocation validation for technomancers.
 */

import { describe, it, expect } from "vitest";
import {
  validateComplexFormAllocation,
  canUseComplexForms,
  getComplexFormDefinition,
  getAllComplexForms,
} from "../complex-form-validator";
import type { Character } from "@/lib/types/character";
import type { LoadedRuleset, ComplexFormData } from "../../loader-types";
import type { BookPayload } from "@/lib/types/edition";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockComplexForm(overrides: Partial<ComplexFormData> = {}): ComplexFormData {
  return {
    id: "cleaner",
    name: "Cleaner",
    target: "persona",
    duration: "permanent",
    fading: "L+1",
    description: "Test complex form",
    ...overrides,
  };
}

function createMockRuleset(complexForms?: ComplexFormData[]): LoadedRuleset {
  return {
    edition: {} as LoadedRuleset["edition"],
    books: [
      {
        id: "core-rulebook",
        title: "Core Rulebook",
        isCore: true,
        loadOrder: 0,
        payload: {
          meta: {
            id: "core-rulebook",
            editionCode: "sr5",
            name: "Core Rulebook",
            category: "core",
            releaseYear: 2013,
          },
          modules: {
            magic: complexForms
              ? {
                  mergeStrategy: "override" as const,
                  payload: { complexForms },
                }
              : undefined,
          },
        } as unknown as BookPayload,
      },
    ],
    modules: {},
  } as unknown as LoadedRuleset;
}

function createMockCharacter(overrides: Partial<Character> = {}): Partial<Character> {
  return {
    magicalPath: "technomancer",
    specialAttributes: { resonance: 4, edge: 2, essence: 6 },
    ...overrides,
  };
}

// =============================================================================
// TESTS: canUseComplexForms
// =============================================================================

describe("canUseComplexForms", () => {
  it("returns true for technomancers", () => {
    expect(canUseComplexForms({ magicalPath: "technomancer" })).toBe(true);
  });

  it("returns false for mundane characters", () => {
    expect(canUseComplexForms({ magicalPath: "mundane" })).toBe(false);
  });

  it("returns false for full mages", () => {
    expect(canUseComplexForms({ magicalPath: "full-mage" })).toBe(false);
  });

  it("returns false for adepts", () => {
    expect(canUseComplexForms({ magicalPath: "adept" })).toBe(false);
  });

  it("returns false for mystic adepts", () => {
    expect(canUseComplexForms({ magicalPath: "mystic-adept" })).toBe(false);
  });

  it("returns false when magicalPath is undefined", () => {
    expect(canUseComplexForms({})).toBe(false);
  });
});

// =============================================================================
// TESTS: validateComplexFormAllocation
// =============================================================================

describe("validateComplexFormAllocation", () => {
  const form1 = createMockComplexForm({ id: "cleaner", name: "Cleaner" });
  const form2 = createMockComplexForm({ id: "editor", name: "Editor" });
  const form3 = createMockComplexForm({ id: "resonance-spike", name: "Resonance Spike" });

  it("validates valid allocation", () => {
    const character = createMockCharacter();
    const ruleset = createMockRuleset([form1, form2, form3]);

    const result = validateComplexFormAllocation(character, ["cleaner", "editor"], 5, ruleset);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.budgetRemaining).toBe(3);
    expect(result.budgetTotal).toBe(5);
  });

  it("rejects non-technomancer characters", () => {
    const character = createMockCharacter({ magicalPath: "full-mage" });
    const ruleset = createMockRuleset([form1]);

    const result = validateComplexFormAllocation(character, ["cleaner"], 5, ruleset);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: "CF_CANNOT_USE" }));
    expect(result.budgetRemaining).toBe(0);
    expect(result.budgetTotal).toBe(0);
  });

  it("detects form limit exceeded", () => {
    const character = createMockCharacter();
    const ruleset = createMockRuleset([form1, form2, form3]);

    const result = validateComplexFormAllocation(
      character,
      ["cleaner", "editor", "resonance-spike"],
      2,
      ruleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: "CF_LIMIT_EXCEEDED" }));
  });

  it("detects forms not found in catalog", () => {
    const character = createMockCharacter();
    const ruleset = createMockRuleset([form1]);

    const result = validateComplexFormAllocation(
      character,
      ["cleaner", "nonexistent-form"],
      5,
      ruleset
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: "CF_NOT_FOUND" }));
  });

  it("detects duplicate forms", () => {
    const character = createMockCharacter();
    const ruleset = createMockRuleset([form1, form2]);

    const result = validateComplexFormAllocation(character, ["cleaner", "cleaner"], 5, ruleset);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: "CF_DUPLICATE" }));
  });

  it("handles empty form list", () => {
    const character = createMockCharacter();
    const ruleset = createMockRuleset([form1]);

    const result = validateComplexFormAllocation(character, [], 5, ruleset);

    expect(result.valid).toBe(true);
    expect(result.budgetRemaining).toBe(5);
  });

  it("handles empty catalog", () => {
    const character = createMockCharacter();
    const ruleset = createMockRuleset([]);

    const result = validateComplexFormAllocation(character, ["cleaner"], 5, ruleset);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: "CF_NOT_FOUND" }));
  });

  it("calculates budget remaining correctly with duplicates", () => {
    const character = createMockCharacter();
    const ruleset = createMockRuleset([form1, form2]);

    const result = validateComplexFormAllocation(
      character,
      ["cleaner", "cleaner", "editor"],
      5,
      ruleset
    );

    // Budget remaining is based on unique count (2), not total (3)
    expect(result.budgetRemaining).toBe(3);
  });
});

// =============================================================================
// TESTS: getComplexFormDefinition
// =============================================================================

describe("getComplexFormDefinition", () => {
  it("returns form when found", () => {
    const form = createMockComplexForm({ id: "cleaner", name: "Cleaner" });
    const ruleset = createMockRuleset([form]);

    const result = getComplexFormDefinition("cleaner", ruleset);

    expect(result).not.toBeNull();
    expect(result!.id).toBe("cleaner");
    expect(result!.name).toBe("Cleaner");
  });

  it("returns null when not found", () => {
    const ruleset = createMockRuleset([]);

    const result = getComplexFormDefinition("nonexistent", ruleset);

    expect(result).toBeNull();
  });
});

// =============================================================================
// TESTS: getAllComplexForms
// =============================================================================

describe("getAllComplexForms", () => {
  it("returns all forms from ruleset", () => {
    const form1 = createMockComplexForm({ id: "cleaner" });
    const form2 = createMockComplexForm({ id: "editor" });
    const ruleset = createMockRuleset([form1, form2]);

    const result = getAllComplexForms(ruleset);

    expect(result).toHaveLength(2);
  });

  it("returns empty array when no magic module", () => {
    const ruleset = createMockRuleset();

    const result = getAllComplexForms(ruleset);

    expect(result).toHaveLength(0);
  });
});
