/**
 * Contact Budget Validator Tests
 *
 * Tests for contact point budget enforcement during character creation.
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
      attributes: {
        body: 3,
        agility: 3,
        reaction: 3,
        strength: 3,
        willpower: 3,
        logic: 3,
        intuition: 3,
        charisma: 4,
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

describe("contactBudgetValidator", () => {
  it("passes with valid contacts within budget", async () => {
    const context = createContext({
      creationState: {
        selections: {
          contacts: [
            { name: "Fixer Joe", connection: 3, loyalty: 2 },
            { name: "Street Doc", connection: 2, loyalty: 3 },
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "CONTACT_INVALID_CONNECTION")).toBe(false);
    expect(result.errors.some((e) => e.code === "CONTACT_INVALID_LOYALTY")).toBe(false);
  });

  it("reports info when contacts exceed free pool", async () => {
    // CHA 4 → free pool = 12
    const context = createContext({
      creationState: {
        selections: {
          contacts: [
            { name: "Mr. Big", connection: 6, loyalty: 6 }, // 12 points
            { name: "Another", connection: 1, loyalty: 1 }, // 2 more → total 14 > 12
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    const infoIssues = [...result.errors, ...result.warnings].filter(
      (i) => i.code === "CONTACT_KARMA_OVERFLOW"
    );
    expect(infoIssues).toHaveLength(1);
    expect(infoIssues[0].severity).toBe("info");
  });

  it("reports error for connection below minimum", async () => {
    const context = createContext({
      creationState: {
        selections: {
          contacts: [{ name: "Bad Contact", connection: 0, loyalty: 2 }],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "CONTACT_INVALID_CONNECTION")).toBe(true);
  });

  it("reports error for loyalty below minimum", async () => {
    const context = createContext({
      creationState: {
        selections: {
          contacts: [{ name: "Disloyal Contact", connection: 2, loyalty: 0 }],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "CONTACT_INVALID_LOYALTY")).toBe(true);
  });

  it("warns when no contacts at finalization", async () => {
    const context = createContext({
      mode: "finalization",
      creationState: {
        selections: {
          contacts: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.warnings.some((w) => w.code === "CONTACT_NONE_SELECTED")).toBe(true);
  });

  it("does not warn about no contacts during creation mode", async () => {
    const context = createContext({
      mode: "creation",
      creationState: {
        selections: {
          contacts: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.warnings.some((w) => w.code === "CONTACT_NONE_SELECTED")).toBe(false);
  });

  it("handles missing creationState gracefully", async () => {
    const context = createContext({
      creationState: undefined,
    });

    const result = await validateCharacter(context);

    // Should not crash, no contact-related errors
    expect(result.errors.some((e) => e.code === "CONTACT_INVALID_CONNECTION")).toBe(false);
    expect(result.errors.some((e) => e.code === "CONTACT_INVALID_LOYALTY")).toBe(false);
  });

  it("calculates overflow correctly with charisma", async () => {
    // CHA 2 → free pool = 6
    const context = createContext({
      character: {
        name: "Low CHA",
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
          charisma: 2,
        },
        identities: [{ name: "SIN", type: "fake", rating: 4 }],
        lifestyles: [{ name: "Low", monthlyCost: 2000, type: "low" }],
      } as unknown as Character,
      creationState: {
        selections: {
          contacts: [
            { name: "Contact 1", connection: 3, loyalty: 3 }, // 6 points
            { name: "Contact 2", connection: 2, loyalty: 2 }, // 4 more → total 10, overflow 4
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    const overflow = [...result.errors, ...result.warnings].find(
      (i) => i.code === "CONTACT_KARMA_OVERFLOW"
    );
    expect(overflow).toBeDefined();
    expect(overflow!.message).toContain("4"); // overflow amount
  });
});
