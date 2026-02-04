/**
 * Skill Group Constraint Validator Tests
 *
 * Tests that individual skill points cannot be allocated to skills
 * in an active (non-broken) group during character creation.
 */

import { describe, it, expect } from "vitest";
import { validateCharacter } from "../character-validator";
import type { CharacterValidationContext } from "../types";
import type { Character } from "@/lib/types/character";
import type { MergedRuleset } from "@/lib/types";
import type { CreationState } from "@/lib/types/creation";
import type { SkillGroupData } from "../../loader-types";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockRuleset(skillGroups: SkillGroupData[] = []): MergedRuleset {
  return {
    snapshotId: "test-snapshot",
    editionId: "sr5",
    editionCode: "sr5",
    bookIds: ["core-rulebook"],
    modules: {
      skills: {
        skillGroups,
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
    ...overrides,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("skillGroupConstraintValidator", () => {
  const firearmGroupDef: SkillGroupData = {
    id: "firearms",
    name: "Firearms",
    skills: ["automatics", "longarms", "pistols"],
  };

  it("reports error when individual skill has points in an active group (no karma)", async () => {
    const ruleset = createMockRuleset([firearmGroupDef]);
    const context = createContext({
      ruleset,
      mode: "creation",
      creationState: {
        selections: {
          skillGroups: { firearms: 3 }, // Active, not broken
          skills: { automatics: 5 }, // Individual points in group member
          skillKarmaSpent: { skillRaises: {}, skillRatingPoints: 0, specializations: 0 },
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "SG_INDIVIDUAL_SKILL_IN_GROUP")).toBe(true);
  });

  it("allows individual skill raise with karma in active group", async () => {
    const ruleset = createMockRuleset([firearmGroupDef]);
    const context = createContext({
      ruleset,
      mode: "creation",
      creationState: {
        selections: {
          skillGroups: { firearms: 3 },
          skills: { automatics: 5 },
          skillKarmaSpent: {
            skillRaises: { automatics: 20 }, // Karma spent to raise
            skillRatingPoints: 2,
            specializations: 0,
          },
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "SG_INDIVIDUAL_SKILL_IN_GROUP")).toBe(false);
  });

  it("allows individual skill allocation in broken group", async () => {
    const ruleset = createMockRuleset([firearmGroupDef]);
    const context = createContext({
      ruleset,
      mode: "creation",
      creationState: {
        selections: {
          skillGroups: { firearms: { rating: 3, isBroken: true } },
          skills: { automatics: 5, longarms: 4 },
          skillKarmaSpent: { skillRaises: {}, skillRatingPoints: 0, specializations: 0 },
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "SG_INDIVIDUAL_SKILL_IN_GROUP")).toBe(false);
  });

  it("passes when no skill groups are selected", async () => {
    const ruleset = createMockRuleset([firearmGroupDef]);
    const context = createContext({
      ruleset,
      mode: "creation",
      creationState: {
        selections: {
          skillGroups: {},
          skills: { automatics: 5 },
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "SG_INDIVIDUAL_SKILL_IN_GROUP")).toBe(false);
  });

  it("passes when active group has no individual member skills", async () => {
    const ruleset = createMockRuleset([firearmGroupDef]);
    const context = createContext({
      ruleset,
      mode: "creation",
      creationState: {
        selections: {
          skillGroups: { firearms: 3 },
          skills: { computer: 4 }, // Not a member of firearms group
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "SG_INDIVIDUAL_SKILL_IN_GROUP")).toBe(false);
  });

  it("skips groups with rating 0", async () => {
    const ruleset = createMockRuleset([firearmGroupDef]);
    const context = createContext({
      ruleset,
      mode: "creation",
      creationState: {
        selections: {
          skillGroups: { firearms: 0 },
          skills: { automatics: 5 },
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "SG_INDIVIDUAL_SKILL_IN_GROUP")).toBe(false);
  });

  it("reports errors for multiple members in the same group", async () => {
    const ruleset = createMockRuleset([firearmGroupDef]);
    const context = createContext({
      ruleset,
      mode: "creation",
      creationState: {
        selections: {
          skillGroups: { firearms: 3 },
          skills: { automatics: 5, longarms: 4 }, // Two members with individual points
          skillKarmaSpent: { skillRaises: {}, skillRatingPoints: 0, specializations: 0 },
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    const sgErrors = result.errors.filter((e) => e.code === "SG_INDIVIDUAL_SKILL_IN_GROUP");
    expect(sgErrors).toHaveLength(2);
  });

  it("runs in finalization mode", async () => {
    const ruleset = createMockRuleset([firearmGroupDef]);
    const context = createContext({
      ruleset,
      mode: "finalization",
      creationState: {
        selections: {
          skillGroups: { firearms: 3 },
          skills: { automatics: 5 },
          skillKarmaSpent: { skillRaises: {}, skillRatingPoints: 0, specializations: 0 },
        },
        budgets: {},
      } as unknown as CreationState,
    });

    const result = await validateCharacter(context);

    expect(result.errors.some((e) => e.code === "SG_INDIVIDUAL_SKILL_IN_GROUP")).toBe(true);
  });
});
