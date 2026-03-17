/**
 * Shapeshifter Validator Tests
 *
 * Tests for shapeshifter-specific validation rules including
 * metahuman form selection, technomancer restriction, and resonance prohibition.
 */

import { describe, it, expect } from "vitest";
import { shapeshifterValidator, SHAPESHIFTER_ERROR_CODES } from "../shapeshifter-validator";
import type { CharacterValidationContext, ValidationIssue } from "../types";
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
    bookIds: ["core-rulebook", "run-faster"],
    modules: {},
    createdAt: new Date().toISOString(),
  } as MergedRuleset;
}

function createContext(
  overrides: Partial<CharacterValidationContext> = {}
): CharacterValidationContext {
  return {
    character: {
      name: "Test Shapeshifter",
      metatype: "shapeshifter-lupine",
      magicalPath: "magician",
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
      selections: {
        metatype: "shapeshifter-lupine",
        "magical-path": "magician",
        shapeshifterMetahumanForm: "human",
      },
    } as unknown as CreationState,
    ...overrides,
  };
}

function getIssueCodes(issues: ValidationIssue[]): string[] {
  return issues.map((i) => i.code);
}

// =============================================================================
// SKIP NON-SHAPESHIFTERS
// =============================================================================

describe("shapeshifterValidator - skip non-shapeshifters", () => {
  it("should return no issues for human metatype", async () => {
    const ctx = createContext({
      character: {
        ...createContext().character,
        metatype: "human",
      } as unknown as Character,
      creationState: {
        selections: { metatype: "human", "magical-path": "technomancer" },
      } as unknown as CreationState,
    });
    const issues = await shapeshifterValidator.validate(ctx);
    expect(issues).toHaveLength(0);
  });

  it("should return no issues for elf metatype", async () => {
    const ctx = createContext({
      character: { ...createContext().character, metatype: "elf" } as unknown as Character,
      creationState: {
        selections: { metatype: "elf" },
      } as unknown as CreationState,
    });
    const issues = await shapeshifterValidator.validate(ctx);
    expect(issues).toHaveLength(0);
  });

  it("should return no issues for metasapient", async () => {
    const ctx = createContext({
      character: { ...createContext().character, metatype: "centaur" } as unknown as Character,
      creationState: {
        selections: { metatype: "centaur" },
      } as unknown as CreationState,
    });
    const issues = await shapeshifterValidator.validate(ctx);
    expect(issues).toHaveLength(0);
  });

  it("should return no issues when metatype is undefined", async () => {
    const ctx = createContext({
      character: { ...createContext().character, metatype: undefined } as unknown as Character,
    });
    const issues = await shapeshifterValidator.validate(ctx);
    expect(issues).toHaveLength(0);
  });
});

// =============================================================================
// METAHUMAN FORM VALIDATION
// =============================================================================

describe("shapeshifterValidator - metahuman form", () => {
  it("should pass when valid metahuman form is selected", async () => {
    const ctx = createContext();
    const issues = await shapeshifterValidator.validate(ctx);
    const codes = getIssueCodes(issues);
    expect(codes).not.toContain(SHAPESHIFTER_ERROR_CODES.NO_METAHUMAN_FORM);
    expect(codes).not.toContain(SHAPESHIFTER_ERROR_CODES.INVALID_METAHUMAN_FORM);
  });

  it("should error when no metahuman form is selected", async () => {
    const ctx = createContext({
      creationState: {
        selections: {
          metatype: "shapeshifter-lupine",
          "magical-path": "magician",
        },
      } as unknown as CreationState,
    });
    const issues = await shapeshifterValidator.validate(ctx);
    const codes = getIssueCodes(issues);
    expect(codes).toContain(SHAPESHIFTER_ERROR_CODES.NO_METAHUMAN_FORM);
  });

  it("should error when invalid metahuman form is selected", async () => {
    const ctx = createContext({
      creationState: {
        selections: {
          metatype: "shapeshifter-lupine",
          "magical-path": "magician",
          shapeshifterMetahumanForm: "pixie",
        },
      } as unknown as CreationState,
    });
    const issues = await shapeshifterValidator.validate(ctx);
    const codes = getIssueCodes(issues);
    expect(codes).toContain(SHAPESHIFTER_ERROR_CODES.INVALID_METAHUMAN_FORM);
  });

  it("should accept all five valid metahuman forms", async () => {
    const validForms = ["human", "dwarf", "elf", "ork", "troll"];
    for (const form of validForms) {
      const ctx = createContext({
        creationState: {
          selections: {
            metatype: "shapeshifter-canine",
            "magical-path": "magician",
            shapeshifterMetahumanForm: form,
          },
        } as unknown as CreationState,
        character: {
          ...createContext().character,
          metatype: "shapeshifter-canine",
        } as unknown as Character,
      });
      const issues = await shapeshifterValidator.validate(ctx);
      const codes = getIssueCodes(issues);
      expect(codes).not.toContain(SHAPESHIFTER_ERROR_CODES.NO_METAHUMAN_FORM);
      expect(codes).not.toContain(SHAPESHIFTER_ERROR_CODES.INVALID_METAHUMAN_FORM);
    }
  });
});

// =============================================================================
// TECHNOMANCER RESTRICTION
// =============================================================================

describe("shapeshifterValidator - technomancer restriction", () => {
  it("should error when shapeshifter selects technomancer path", async () => {
    const ctx = createContext({
      creationState: {
        selections: {
          metatype: "shapeshifter-vulpine",
          "magical-path": "technomancer",
          shapeshifterMetahumanForm: "human",
        },
      } as unknown as CreationState,
      character: {
        ...createContext().character,
        metatype: "shapeshifter-vulpine",
      } as unknown as Character,
    });
    const issues = await shapeshifterValidator.validate(ctx);
    const codes = getIssueCodes(issues);
    expect(codes).toContain(SHAPESHIFTER_ERROR_CODES.TECHNOMANCER_FORBIDDEN);
  });

  it("should not error for non-technomancer magic paths", async () => {
    const validPaths = ["magician", "adept", "aspected-mage", "mystic-adept", "mundane"];
    for (const path of validPaths) {
      const ctx = createContext({
        creationState: {
          selections: {
            metatype: "shapeshifter-lupine",
            "magical-path": path,
            shapeshifterMetahumanForm: "human",
          },
        } as unknown as CreationState,
      });
      const issues = await shapeshifterValidator.validate(ctx);
      const codes = getIssueCodes(issues);
      expect(codes).not.toContain(SHAPESHIFTER_ERROR_CODES.TECHNOMANCER_FORBIDDEN);
    }
  });
});

// =============================================================================
// RESONANCE RESTRICTION
// =============================================================================

describe("shapeshifterValidator - resonance restriction", () => {
  it("should error when shapeshifter has resonance attribute", async () => {
    const ctx = createContext({
      character: {
        ...createContext().character,
        metatype: "shapeshifter-tigrine",
        attributes: {
          body: 3,
          agility: 3,
          reaction: 3,
          strength: 3,
          willpower: 3,
          logic: 3,
          intuition: 3,
          charisma: 3,
          resonance: 3,
        },
      } as unknown as Character,
      creationState: {
        selections: {
          metatype: "shapeshifter-tigrine",
          "magical-path": "magician",
          shapeshifterMetahumanForm: "human",
        },
      } as unknown as CreationState,
    });
    const issues = await shapeshifterValidator.validate(ctx);
    const codes = getIssueCodes(issues);
    expect(codes).toContain(SHAPESHIFTER_ERROR_CODES.RESONANCE_FORBIDDEN);
  });

  it("should not error when shapeshifter has no resonance attribute", async () => {
    const ctx = createContext();
    const issues = await shapeshifterValidator.validate(ctx);
    const codes = getIssueCodes(issues);
    expect(codes).not.toContain(SHAPESHIFTER_ERROR_CODES.RESONANCE_FORBIDDEN);
  });
});

// =============================================================================
// VALIDATOR METADATA
// =============================================================================

describe("shapeshifterValidator - metadata", () => {
  it("should have correct id", () => {
    expect(shapeshifterValidator.id).toBe("shapeshifter");
  });

  it("should run in creation and finalization modes", () => {
    expect(shapeshifterValidator.modes).toContain("creation");
    expect(shapeshifterValidator.modes).toContain("finalization");
  });

  it("should have all issues with error severity", async () => {
    const ctx = createContext({
      creationState: {
        selections: {
          metatype: "shapeshifter-lupine",
          "magical-path": "technomancer",
        },
      } as unknown as CreationState,
    });
    const issues = await shapeshifterValidator.validate(ctx);
    for (const issue of issues) {
      expect(issue.severity).toBe("error");
    }
  });
});
