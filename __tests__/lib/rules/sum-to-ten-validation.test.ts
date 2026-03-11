import { describe, it, expect } from "vitest";
import {
  calculatePriorityPointTotal,
  validateSumToTenBudget,
  SUM_TO_TEN_POINT_VALUES,
  SUM_TO_TEN_TOTAL,
} from "@/lib/rules/sum-to-ten-validation";
import type { CreationConstraint } from "@/lib/types";
import type { ValidationContext } from "@/lib/rules/constraint-validation";

// =============================================================================
// HELPERS
// =============================================================================

function makeConstraint(overrides: Partial<CreationConstraint> = {}): CreationConstraint {
  return {
    id: "sum-to-ten-budget",
    type: "sum-to-ten-budget",
    description: "Priority points must total exactly 10.",
    severity: "error",
    params: {
      totalBudget: 10,
      pointValues: { A: 4, B: 3, C: 2, D: 1, E: 0 },
      categories: ["metatype", "attributes", "magic", "skills", "resources"],
    },
    ...overrides,
  };
}

function makeContext(
  priorities: Record<string, string> | undefined,
  overrides: Partial<ValidationContext> = {}
): ValidationContext {
  return {
    character: { metatype: "human", name: "Test" } as ValidationContext["character"],
    ruleset: {} as ValidationContext["ruleset"],
    creationState: priorities
      ? {
          characterId: "test-char",
          creationMethodId: "sum-to-ten",
          currentStep: 0,
          completedSteps: [],
          budgets: {},
          selections: {} as ValidationContext["creationState"] extends { selections: infer S }
            ? S
            : never,
          priorities,
          errors: [],
          warnings: [],
          updatedAt: "2025-01-01T00:00:00.000Z",
        }
      : undefined,
    creationMethod: {
      id: "sum-to-ten",
      editionId: "sr5",
      editionCode: "sr5" as const,
      name: "Sum to Ten",
      type: "sum-to-ten",
      version: "1.0.0",
      steps: [
        {
          id: "priorities",
          title: "Assign Priorities",
          type: "priority" as const,
          payload: {
            type: "priority" as const,
            categories: ["metatype", "attributes", "magic", "skills", "resources"],
            levels: ["A", "B", "C", "D", "E"],
            pointValues: { A: 4, B: 3, C: 2, D: 1, E: 0 },
            totalBudget: 10,
            allowDuplicates: true,
          },
        },
      ],
      budgets: [],
      constraints: [],
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    ...overrides,
  };
}

// =============================================================================
// calculatePriorityPointTotal
// =============================================================================

describe("calculatePriorityPointTotal", () => {
  it("calculates standard priority total (A+B+C+D+E = 10)", () => {
    const priorities = {
      metatype: "A",
      attributes: "B",
      magic: "C",
      skills: "D",
      resources: "E",
    };
    expect(calculatePriorityPointTotal(priorities)).toBe(10);
  });

  it("calculates balanced build (B+B+B+D+E = 10)", () => {
    const priorities = {
      metatype: "B",
      attributes: "B",
      magic: "B",
      skills: "D",
      resources: "E",
    };
    expect(calculatePriorityPointTotal(priorities)).toBe(10);
  });

  it("calculates specialist build (A+C+C+C+E = 10)", () => {
    const priorities = {
      metatype: "A",
      attributes: "C",
      magic: "C",
      skills: "C",
      resources: "E",
    };
    expect(calculatePriorityPointTotal(priorities)).toBe(10);
  });

  it("detects over-budget (A+A+B+E+E = 11)", () => {
    const priorities = {
      metatype: "A",
      attributes: "A",
      magic: "B",
      skills: "E",
      resources: "E",
    };
    expect(calculatePriorityPointTotal(priorities)).toBe(11);
  });

  it("detects under-budget (E+E+E+E+E = 0)", () => {
    const priorities = {
      metatype: "E",
      attributes: "E",
      magic: "E",
      skills: "E",
      resources: "E",
    };
    expect(calculatePriorityPointTotal(priorities)).toBe(0);
  });

  it("returns null for unknown priority level", () => {
    const priorities = {
      metatype: "A",
      attributes: "X",
      magic: "C",
      skills: "D",
      resources: "E",
    };
    expect(calculatePriorityPointTotal(priorities)).toBeNull();
  });

  it("works with custom point values", () => {
    const customPoints = { A: 5, B: 4, C: 3, D: 2, E: 1 };
    const priorities = { metatype: "A", attributes: "E" };
    expect(calculatePriorityPointTotal(priorities, customPoints)).toBe(6);
  });

  it("handles empty priorities", () => {
    expect(calculatePriorityPointTotal({})).toBe(0);
  });
});

// =============================================================================
// validateSumToTenBudget
// =============================================================================

describe("validateSumToTenBudget", () => {
  it("returns null for valid sum-to-ten (A+B+C+D+E = 10)", () => {
    const context = makeContext({
      metatype: "A",
      attributes: "B",
      magic: "C",
      skills: "D",
      resources: "E",
    });
    expect(validateSumToTenBudget(makeConstraint(), context)).toBeNull();
  });

  it("returns null for valid duplicate levels (B+B+B+D+E = 10)", () => {
    const context = makeContext({
      metatype: "B",
      attributes: "B",
      magic: "B",
      skills: "D",
      resources: "E",
    });
    expect(validateSumToTenBudget(makeConstraint(), context)).toBeNull();
  });

  it("returns null for valid specialist build (A+C+C+C+E = 10)", () => {
    const context = makeContext({
      metatype: "A",
      attributes: "C",
      magic: "C",
      skills: "C",
      resources: "E",
    });
    expect(validateSumToTenBudget(makeConstraint(), context)).toBeNull();
  });

  it("returns null for valid all-C build (C+C+C+C+C = 10)", () => {
    const context = makeContext({
      metatype: "C",
      attributes: "C",
      magic: "C",
      skills: "C",
      resources: "C",
    });
    expect(validateSumToTenBudget(makeConstraint(), context)).toBeNull();
  });

  it("returns error when total exceeds 10 (A+A+B+E+E = 11)", () => {
    const context = makeContext({
      metatype: "A",
      attributes: "A",
      magic: "B",
      skills: "E",
      resources: "E",
    });
    const result = validateSumToTenBudget(makeConstraint(), context);
    expect(result).not.toBeNull();
    expect(result!.severity).toBe("error");
    expect(result!.message).toContain("currently 11");
  });

  it("returns error when total is under 10 (D+D+D+D+D = 5)", () => {
    const context = makeContext({
      metatype: "D",
      attributes: "D",
      magic: "D",
      skills: "D",
      resources: "D",
    });
    const result = validateSumToTenBudget(makeConstraint(), context);
    expect(result).not.toBeNull();
    expect(result!.message).toContain("currently 5");
  });

  it("returns error when categories are missing", () => {
    const context = makeContext({
      metatype: "A",
      attributes: "B",
      // magic, skills, resources not assigned
    });
    const result = validateSumToTenBudget(makeConstraint(), context);
    expect(result).not.toBeNull();
    expect(result!.message).toContain("Missing");
    expect(result!.message).toContain("magic");
  });

  it("returns null when no priorities assigned yet (skip early)", () => {
    const context = makeContext(undefined);
    expect(validateSumToTenBudget(makeConstraint(), context)).toBeNull();
  });

  it("returns null when priorities is empty object (skip early)", () => {
    const context = makeContext({});
    expect(validateSumToTenBudget(makeConstraint(), context)).toBeNull();
  });

  it("returns error for unknown priority level", () => {
    const context = makeContext({
      metatype: "A",
      attributes: "B",
      magic: "C",
      skills: "D",
      resources: "Z",
    });
    const result = validateSumToTenBudget(makeConstraint(), context);
    expect(result).not.toBeNull();
    expect(result!.message).toContain("Unknown priority level");
  });

  it("uses custom errorMessage from constraint", () => {
    const context = makeContext({
      metatype: "A",
      attributes: "A",
      magic: "A",
      skills: "A",
      resources: "A",
    });
    const constraint = makeConstraint({
      errorMessage: "Points must equal 10, chummer!",
    });
    const result = validateSumToTenBudget(constraint, context);
    expect(result).not.toBeNull();
    expect(result!.message).toBe("Points must equal 10, chummer!");
  });

  it("uses constraint params for totalBudget override", () => {
    const constraint = makeConstraint({
      params: {
        totalBudget: 12,
        pointValues: { A: 4, B: 3, C: 2, D: 1, E: 0 },
        categories: ["metatype", "attributes", "magic", "skills", "resources"],
      },
    });
    // A+B+C+D+E = 10, but totalBudget is 12
    const context = makeContext({
      metatype: "A",
      attributes: "B",
      magic: "C",
      skills: "D",
      resources: "E",
    });
    const result = validateSumToTenBudget(constraint, context);
    expect(result).not.toBeNull();
    expect(result!.message).toContain("12");
  });
});

// =============================================================================
// CONSTANTS
// =============================================================================

describe("SUM_TO_TEN constants", () => {
  it("has correct point values", () => {
    expect(SUM_TO_TEN_POINT_VALUES).toEqual({
      A: 4,
      B: 3,
      C: 2,
      D: 1,
      E: 0,
    });
  });

  it("has correct total", () => {
    expect(SUM_TO_TEN_TOTAL).toBe(10);
  });

  it("standard priority assignment sums to total", () => {
    const standardTotal =
      SUM_TO_TEN_POINT_VALUES.A +
      SUM_TO_TEN_POINT_VALUES.B +
      SUM_TO_TEN_POINT_VALUES.C +
      SUM_TO_TEN_POINT_VALUES.D +
      SUM_TO_TEN_POINT_VALUES.E;
    expect(standardTotal).toBe(SUM_TO_TEN_TOTAL);
  });
});
