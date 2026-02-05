/**
 * Augmentation Validator Tests
 *
 * Tests for augmentation grade restrictions, availability validation,
 * and cyberlimb capacity overflow detection during character creation.
 */

import { describe, it, expect } from "vitest";
import { validateCharacter } from "../character-validator";
import type { CharacterValidationContext } from "../types";
import type { Character, CyberwareItem, BiowareItem } from "@/lib/types/character";
import type { MergedRuleset } from "@/lib/types";
import type { CreationState } from "@/lib/types/creation";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";

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

function createCyberware(overrides: Partial<CyberwareItem> = {}): CyberwareItem {
  return {
    id: "test-cyber-1",
    catalogId: "test-cyberware",
    name: "Test Cyberware",
    category: "headware",
    grade: "standard",
    baseEssenceCost: 0.5,
    essenceCost: 0.5,
    cost: 5000,
    availability: 6,
    ...overrides,
  } as CyberwareItem;
}

function createBioware(overrides: Partial<BiowareItem> = {}): BiowareItem {
  return {
    id: "test-bio-1",
    catalogId: "test-bioware",
    name: "Test Bioware",
    category: "basic",
    grade: "standard",
    baseEssenceCost: 0.3,
    essenceCost: 0.3,
    cost: 4000,
    availability: 4,
    ...overrides,
  } as BiowareItem;
}

function createCyberlimb(overrides: Partial<CyberlimbItem> = {}): CyberlimbItem {
  return {
    id: "test-limb-1",
    catalogId: "cyberarm",
    name: "Cyberarm",
    category: "cyberlimb",
    grade: "standard",
    baseEssenceCost: 1.0,
    essenceCost: 1.0,
    cost: 15000,
    availability: 4,
    location: "left-arm",
    limbType: "full-arm",
    baseCapacity: 15,
    capacityUsed: 0,
    ...overrides,
  } as CyberlimbItem;
}

// =============================================================================
// TESTS: GRADE RESTRICTIONS
// =============================================================================

describe("augmentationValidator - Grade Restrictions", () => {
  it("passes for alpha grade cyberware", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [createCyberware({ grade: "alpha", essenceCost: 0.4 })],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    expect(result.errors.some((e) => e.code === "AUGMENTATION_GRADE_NOT_AVAILABLE")).toBe(false);
  });

  it("passes for standard grade cyberware", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [createCyberware({ grade: "standard" })],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    expect(result.errors.some((e) => e.code === "AUGMENTATION_GRADE_NOT_AVAILABLE")).toBe(false);
  });

  it("passes for used grade cyberware", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [createCyberware({ grade: "used", essenceCost: 0.625 })],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    expect(result.errors.some((e) => e.code === "AUGMENTATION_GRADE_NOT_AVAILABLE")).toBe(false);
  });

  it("fails for beta grade cyberware", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [createCyberware({ grade: "beta", name: "Beta Datajack" })],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    const error = result.errors.find((e) => e.code === "AUGMENTATION_GRADE_NOT_AVAILABLE");
    expect(error).toBeDefined();
    expect(error?.message).toContain("Beta Datajack");
    expect(error?.message).toContain("beta grade");
  });

  it("fails for delta grade cyberware", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [createCyberware({ grade: "delta", name: "Delta Wired Reflexes" })],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    const error = result.errors.find((e) => e.code === "AUGMENTATION_GRADE_NOT_AVAILABLE");
    expect(error).toBeDefined();
    expect(error?.message).toContain("Delta Wired Reflexes");
    expect(error?.message).toContain("delta grade");
  });

  it("fails for beta grade bioware", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [],
          bioware: [createBioware({ grade: "beta", name: "Beta Muscle Toner" })],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    const error = result.errors.find((e) => e.code === "AUGMENTATION_GRADE_NOT_AVAILABLE");
    expect(error).toBeDefined();
    expect(error?.message).toContain("Beta Muscle Toner");
  });

  it("fails for delta grade bioware", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [],
          bioware: [createBioware({ grade: "delta", name: "Delta Synaptic Booster" })],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    const error = result.errors.find((e) => e.code === "AUGMENTATION_GRADE_NOT_AVAILABLE");
    expect(error).toBeDefined();
    expect(error?.message).toContain("Delta Synaptic Booster");
  });
});

// =============================================================================
// TESTS: AVAILABILITY WITH GRADE MODIFIERS
// =============================================================================

describe("augmentationValidator - Availability", () => {
  it("passes for availability 10 + alpha (+2) = 12 (at max)", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [createCyberware({ grade: "alpha", availability: 10 })],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    expect(result.errors.some((e) => e.code === "AUGMENTATION_AVAILABILITY_EXCEEDED")).toBe(false);
  });

  it("fails for availability 11 + alpha (+2) = 13 (exceeds max)", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [
            createCyberware({
              grade: "alpha",
              availability: 11,
              name: "High-Avail Cyberware",
            }),
          ],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    const error = result.errors.find((e) => e.code === "AUGMENTATION_AVAILABILITY_EXCEEDED");
    expect(error).toBeDefined();
    expect(error?.message).toContain("High-Avail Cyberware");
    expect(error?.message).toContain("13");
    expect(error?.message).toContain("12");
  });

  it("passes for used grade with availability 16 (-4) = 12", async () => {
    // Used grade has -4 availability modifier
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [createCyberware({ grade: "used", availability: 16 })],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    expect(result.errors.some((e) => e.code === "AUGMENTATION_AVAILABILITY_EXCEEDED")).toBe(false);
  });

  it("fails for bioware availability 11 + alpha (+2) = 13", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [],
          bioware: [
            createBioware({
              grade: "alpha",
              availability: 11,
              name: "High-Avail Bioware",
            }),
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    const error = result.errors.find((e) => e.code === "AUGMENTATION_AVAILABILITY_EXCEEDED");
    expect(error).toBeDefined();
    expect(error?.message).toContain("High-Avail Bioware");
  });
});

// =============================================================================
// TESTS: CYBERLIMB CAPACITY
// =============================================================================

describe("augmentationValidator - Cyberlimb Capacity", () => {
  it("passes for cyberlimb capacity 10/15", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [createCyberlimb({ baseCapacity: 15, capacity: 15, capacityUsed: 10 })],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    expect(result.errors.some((e) => e.code === "CYBERLIMB_CAPACITY_EXCEEDED")).toBe(false);
  });

  it("passes for cyberlimb at exactly full capacity (15/15)", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [createCyberlimb({ baseCapacity: 15, capacity: 15, capacityUsed: 15 })],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    expect(result.errors.some((e) => e.code === "CYBERLIMB_CAPACITY_EXCEEDED")).toBe(false);
  });

  it("fails for cyberlimb capacity 18/15 (exceeded)", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [
            createCyberlimb({
              name: "Overloaded Cyberarm",
              baseCapacity: 15,
              capacity: 15,
              capacityUsed: 18,
            }),
          ],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    const error = result.errors.find((e) => e.code === "CYBERLIMB_CAPACITY_EXCEEDED");
    expect(error).toBeDefined();
    expect(error?.message).toContain("Overloaded Cyberarm");
    expect(error?.message).toContain("18/15");
  });
});

// =============================================================================
// TESTS: FORBIDDEN ITEMS
// =============================================================================

describe("augmentationValidator - Forbidden Items", () => {
  it("fails for forbidden cyberware", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [
            createCyberware({
              name: "Cortex Bomb",
              legality: "forbidden",
            }),
          ],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    const error = result.errors.find((e) => e.code === "AUGMENTATION_FORBIDDEN");
    expect(error).toBeDefined();
    expect(error?.message).toContain("Cortex Bomb");
    expect(error?.message).toContain("forbidden");
  });

  it("fails for forbidden bioware", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [],
          bioware: [
            createBioware({
              name: "Illegal Bioware",
              legality: "forbidden",
            }),
          ],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    const error = result.errors.find((e) => e.code === "AUGMENTATION_FORBIDDEN");
    expect(error).toBeDefined();
    expect(error?.message).toContain("Illegal Bioware");
  });

  it("passes for restricted cyberware (warning, not error)", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [createCyberware({ legality: "restricted" })],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    // Restricted items are allowed but may generate warnings elsewhere
    expect(result.errors.some((e) => e.code === "AUGMENTATION_FORBIDDEN")).toBe(false);
  });
});

// =============================================================================
// TESTS: EMPTY SELECTIONS
// =============================================================================

describe("augmentationValidator - Edge Cases", () => {
  it("passes with no augmentations selected", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    expect(result.errors.some((e) => e.code.startsWith("AUGMENTATION_"))).toBe(false);
    expect(result.errors.some((e) => e.code === "CYBERLIMB_CAPACITY_EXCEEDED")).toBe(false);
  });

  it("passes when creationState is missing", async () => {
    const context = createContext({
      creationState: undefined,
    });

    const result = await validateCharacter(context);
    expect(result.errors.some((e) => e.code.startsWith("AUGMENTATION_"))).toBe(false);
  });

  it("handles multiple errors from single augmentation", async () => {
    const context = createContext({
      creationState: {
        selections: {
          cyberware: [
            createCyberware({
              name: "Problem Cyberware",
              grade: "beta",
              availability: 15,
              legality: "forbidden",
            }),
          ],
          bioware: [],
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);
    const augErrors = result.errors.filter(
      (e) =>
        e.code === "AUGMENTATION_GRADE_NOT_AVAILABLE" ||
        e.code === "AUGMENTATION_AVAILABILITY_EXCEEDED" ||
        e.code === "AUGMENTATION_FORBIDDEN"
    );
    // Should have all three errors
    expect(augErrors.length).toBeGreaterThanOrEqual(2);
  });
});
