/**
 * Tests for Life Modules validation functions
 */
import { describe, expect, it } from "vitest";
import {
  validateLifeModulesBudget,
  validateLifeModulesSkillCap,
} from "@/lib/rules/life-modules-validation";
import type { CreationConstraint, CreationState } from "@/lib/types";
import type { ValidationContext } from "@/lib/rules/constraint-validation";

// =============================================================================
// TEST HELPERS
// =============================================================================

function makeConstraint(overrides: Partial<CreationConstraint> = {}): CreationConstraint {
  return {
    id: "test-constraint",
    type: "life-modules-budget",
    description: "Test constraint",
    severity: "error",
    params: {},
    ...overrides,
  };
}

function makeCreationState(overrides: Partial<CreationState> = {}): CreationState {
  return {
    characterId: "test-char",
    creationMethodId: "life-modules",
    currentStep: 0,
    completedSteps: [],
    budgets: {},
    selections: {},
    errors: [],
    warnings: [],
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeContext(creationState: CreationState | undefined = undefined): ValidationContext {
  return {
    creationState,
    character: undefined as never,
    ruleset: undefined as never,
  };
}

// =============================================================================
// validateLifeModulesBudget
// =============================================================================

describe("validateLifeModulesBudget", () => {
  it("returns null when no creation state exists", () => {
    const result = validateLifeModulesBudget(makeConstraint(), makeContext());
    expect(result).toBeNull();
  });

  it("returns null when no modules selected and no spending", () => {
    const state = makeCreationState();
    const result = validateLifeModulesBudget(makeConstraint(), makeContext(state));
    expect(result).toBeNull();
  });

  it("returns null when total karma spent is within budget", () => {
    const state = makeCreationState({
      selections: {
        lifeModules: [
          { moduleId: "ucas-seattle", phase: "nationality", karmaCost: 15 },
          { moduleId: "street-urchin", phase: "formative", karmaCost: 40 },
          { moduleId: "gang-warfare", phase: "teen", karmaCost: 50 },
        ],
      },
      budgets: {
        "karma-spent-attributes": 100,
        "karma-spent-skills": 50,
      },
    });

    const result = validateLifeModulesBudget(makeConstraint(), makeContext(state));
    expect(result).toBeNull();
  });

  it("returns error when karma budget is exceeded", () => {
    const state = makeCreationState({
      selections: {
        lifeModules: [
          { moduleId: "ucas-seattle", phase: "nationality", karmaCost: 15 },
          { moduleId: "street-urchin", phase: "formative", karmaCost: 40 },
          { moduleId: "gang-warfare", phase: "teen", karmaCost: 50 },
          { moduleId: "shadow-work", phase: "career", karmaCost: 100 },
          { moduleId: "drifter", phase: "career", karmaCost: 100 },
          { moduleId: "ucas-army", phase: "tour", karmaCost: 100 },
          { moduleId: "ucas-navy", phase: "tour", karmaCost: 100 },
        ],
      },
      budgets: {
        "karma-spent-attributes": 200,
        "karma-spent-skills": 100,
      },
    });

    const result = validateLifeModulesBudget(makeConstraint(), makeContext(state));
    expect(result).not.toBeNull();
    expect(result!.severity).toBe("error");
    expect(result!.message).toContain("exceeded");
  });

  it("returns error when gear karma exceeds maximum", () => {
    const state = makeCreationState({
      budgets: {
        "karma-spent-gear": 250,
      },
    });

    const result = validateLifeModulesBudget(makeConstraint(), makeContext(state));
    expect(result).not.toBeNull();
    expect(result!.message).toContain("Gear karma exceeded");
  });

  it("returns error when negative quality karma exceeds limit", () => {
    const state = makeCreationState({
      budgets: {
        "karma-negative-qualities": 30,
      },
    });

    const result = validateLifeModulesBudget(makeConstraint(), makeContext(state));
    expect(result).not.toBeNull();
    expect(result!.message).toContain("Negative quality karma exceeded");
  });

  it("respects custom budget parameter", () => {
    const state = makeCreationState({
      selections: {
        lifeModules: [{ moduleId: "ucas-seattle", phase: "nationality", karmaCost: 15 }],
      },
      budgets: {
        "karma-spent-attributes": 10,
      },
    });

    const constraint = makeConstraint({
      params: { totalBudget: 20 },
    });

    const result = validateLifeModulesBudget(constraint, makeContext(state));
    expect(result).not.toBeNull();
    expect(result!.message).toContain("25 / 20");
  });
});

// =============================================================================
// validateLifeModulesSkillCap
// =============================================================================

describe("validateLifeModulesSkillCap", () => {
  it("returns null when no creation state exists", () => {
    const constraint = makeConstraint({ type: "life-modules-skill-cap" });
    const result = validateLifeModulesSkillCap(constraint, makeContext());
    expect(result).toBeNull();
  });

  it("returns null when skills are within limits", () => {
    const state = makeCreationState({
      selections: {
        skills: {
          pistols: 6,
          sneaking: 7,
          perception: 4,
        },
      },
    });

    const constraint = makeConstraint({ type: "life-modules-skill-cap" });
    const result = validateLifeModulesSkillCap(constraint, makeContext(state));
    expect(result).toBeNull();
  });

  it("returns error when active skill exceeds max of 7", () => {
    const state = makeCreationState({
      selections: {
        skills: {
          pistols: 8,
        },
      },
    });

    const constraint = makeConstraint({ type: "life-modules-skill-cap" });
    const result = validateLifeModulesSkillCap(constraint, makeContext(state));
    expect(result).not.toBeNull();
    expect(result!.message).toContain("pistols");
    expect(result!.message).toContain("8");
    expect(result!.message).toContain("max is 7");
  });

  it("returns error when knowledge skill exceeds max of 9", () => {
    const state = makeCreationState({
      selections: {
        knowledgeSkills: [{ name: "Seattle Gangs", category: "street", rating: 10 }],
      },
    });

    const constraint = makeConstraint({ type: "life-modules-skill-cap" });
    const result = validateLifeModulesSkillCap(constraint, makeContext(state));
    expect(result).not.toBeNull();
    expect(result!.message).toContain("Seattle Gangs");
    expect(result!.message).toContain("10");
    expect(result!.message).toContain("max is 9");
  });

  it("respects custom skill cap parameters", () => {
    const state = makeCreationState({
      selections: {
        skills: {
          pistols: 6,
        },
      },
    });

    const constraint = makeConstraint({
      type: "life-modules-skill-cap",
      params: { maxActiveSkill: 5 },
    });

    const result = validateLifeModulesSkillCap(constraint, makeContext(state));
    expect(result).not.toBeNull();
    expect(result!.message).toContain("max is 5");
  });

  it("allows skills exactly at the maximum", () => {
    const state = makeCreationState({
      selections: {
        skills: {
          pistols: 7,
          sneaking: 7,
        },
        knowledgeSkills: [{ name: "Seattle History", category: "academic", rating: 9 }],
      },
    });

    const constraint = makeConstraint({ type: "life-modules-skill-cap" });
    const result = validateLifeModulesSkillCap(constraint, makeContext(state));
    expect(result).toBeNull();
  });
});
