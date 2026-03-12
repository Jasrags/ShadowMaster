/**
 * Unit tests for Life Modules budget integration in CreationBudgetContext
 *
 * Tests budget totals, karma spent extraction, and validation for the
 * Life Modules creation method (Run Faster pp. 65-84).
 */

import { describe, it, expect } from "vitest";
import { _testExports, type BudgetState } from "../CreationBudgetContext";
import type { CreationState } from "../../types/creation";
import {
  LIFE_MODULES_KARMA_BUDGET,
  LIFE_MODULES_MAX_GEAR_KARMA,
  LIFE_MODULES_MAX_NEGATIVE_QUALITIES,
  LIFE_MODULES_NUYEN_PER_KARMA,
} from "../../types";

const {
  calculateBudgetTotals,
  calculateLifeModulesBudgetTotals,
  extractSpentValues,
  validateBudgets,
} = _testExports;

// =============================================================================
// Test Helpers
// =============================================================================

function createLifeModulesState(overrides?: Partial<CreationState>): CreationState {
  return {
    characterId: "test-lm-1",
    creationMethodId: "life-modules",
    currentStep: 0,
    completedSteps: [],
    budgets: {},
    selections: {},
    priorities: {},
    errors: [],
    warnings: [],
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createBudgetState(total: number, spent: number, label: string): BudgetState {
  return {
    total,
    spent,
    remaining: total - spent,
    label,
    displayFormat: "number",
  };
}

const emptySkillCategories: Record<string, string | undefined> = {};

// =============================================================================
// calculateBudgetTotals — Life Modules branch
// =============================================================================

describe("calculateBudgetTotals — life-modules", () => {
  it("returns 750 karma budget for life-modules creation method", () => {
    const totals = calculateBudgetTotals(undefined, {}, null, {}, undefined, "life-modules");

    expect(totals.karma).toEqual({
      total: LIFE_MODULES_KARMA_BUDGET,
      label: "Karma",
      displayFormat: "number",
    });
  });

  it("returns nuyen total based on karma-spent-gear", () => {
    const totals = calculateBudgetTotals(
      undefined,
      {},
      null,
      { "karma-spent-gear": 50 },
      undefined,
      "life-modules"
    );

    expect(totals.nuyen).toEqual({
      total: 50 * LIFE_MODULES_NUYEN_PER_KARMA,
      label: "Nuyen",
      displayFormat: "currency",
    });
  });

  it("returns contact points based on charisma × 3", () => {
    const totals = calculateBudgetTotals(
      undefined,
      { attributes: { charisma: 5 } },
      null,
      {},
      undefined,
      "life-modules"
    );

    expect(totals["contact-points"]).toEqual({
      total: 15,
      label: "Contact Points",
      displayFormat: "number",
    });
  });

  it("returns knowledge points based on (INT + LOG) × 2", () => {
    const totals = calculateBudgetTotals(
      undefined,
      { attributes: { intuition: 4, logic: 3 } },
      null,
      {},
      undefined,
      "life-modules"
    );

    expect(totals["knowledge-points"]).toEqual({
      total: 14,
      label: "Knowledge Points",
      displayFormat: "number",
    });
  });

  it("does not include priority-based budgets (attribute-points, skill-points, etc.)", () => {
    const totals = calculateBudgetTotals(undefined, {}, null, {}, undefined, "life-modules");

    expect(totals["attribute-points"]).toBeUndefined();
    expect(totals["skill-points"]).toBeUndefined();
    expect(totals["skill-group-points"]).toBeUndefined();
    expect(totals["special-attribute-points"]).toBeUndefined();
    expect(totals["spell-slots"]).toBeUndefined();
    expect(totals["power-points"]).toBeUndefined();
  });

  it("falls back to CHA=1 when no attributes selected", () => {
    const totals = calculateBudgetTotals(undefined, {}, null, {}, undefined, "life-modules");

    expect(totals["contact-points"]?.total).toBe(3); // 1 × 3
  });
});

// =============================================================================
// calculateLifeModulesBudgetTotals (direct)
// =============================================================================

describe("calculateLifeModulesBudgetTotals", () => {
  it("sets 750 karma budget", () => {
    const totals = calculateLifeModulesBudgetTotals({}, {});
    expect(totals.karma.total).toBe(750);
  });

  it("calculates nuyen from gear karma", () => {
    const totals = calculateLifeModulesBudgetTotals({}, { "karma-spent-gear": 100 });
    expect(totals.nuyen.total).toBe(200_000);
  });

  it("returns zero nuyen when no gear karma", () => {
    const totals = calculateLifeModulesBudgetTotals({}, {});
    expect(totals.nuyen.total).toBe(0);
  });
});

// =============================================================================
// extractSpentValues — life module karma
// =============================================================================

describe("extractSpentValues — life module karma", () => {
  const emptyTotals: Record<
    string,
    { total: number; label: string; displayFormat?: "number" | "currency" }
  > = {};

  it("includes life module selection karma in total karma spent", () => {
    const selections = {
      lifeModules: [
        { moduleId: "ucas-seattle", phase: "nationality", karmaCost: 15 },
        { moduleId: "corporate", phase: "formative", karmaCost: 40 },
        { moduleId: "high-school", phase: "teen", karmaCost: 50 },
      ],
    };

    const spent = extractSpentValues(
      {},
      selections,
      emptyTotals,
      null,
      undefined,
      emptySkillCategories
    );

    expect(spent.karma).toBe(105); // 15 + 40 + 50
  });

  it("combines life module karma with other karma sources", () => {
    const stateBudgets = {
      "karma-spent-attributes": 30,
      "karma-spent-gear": 20,
    };
    const selections = {
      lifeModules: [{ moduleId: "ucas-seattle", phase: "nationality", karmaCost: 15 }],
    };

    const spent = extractSpentValues(
      stateBudgets,
      selections,
      emptyTotals,
      null,
      undefined,
      emptySkillCategories
    );

    expect(spent.karma).toBe(65); // 15 (modules) + 30 (attrs) + 20 (gear)
  });

  it("returns zero life module karma when no modules selected", () => {
    const spent = extractSpentValues({}, {}, emptyTotals, null, undefined, emptySkillCategories);

    expect(spent.karma).toBe(0);
  });

  it("subtracts negative quality karma from total", () => {
    const selections = {
      lifeModules: [{ moduleId: "ucas-seattle", phase: "nationality", karmaCost: 100 }],
      negativeQualities: [{ karma: 20 }],
    };

    const spent = extractSpentValues(
      {},
      selections,
      emptyTotals,
      null,
      undefined,
      emptySkillCategories
    );

    expect(spent.karma).toBe(80); // 100 - 20
  });
});

// =============================================================================
// validateBudgets — life-modules specifics
// =============================================================================

describe("validateBudgets — life-modules", () => {
  it("validates gear karma cap at 200 for life-modules", () => {
    const state = createLifeModulesState({
      budgets: { "karma-spent-gear": 210 },
    });

    const budgets = {
      karma: createBudgetState(750, 210, "Karma"),
    };

    const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

    const gearError = errors.find((e) => e.constraintId === "karma-conversion-limit");
    expect(gearError).toBeDefined();
    expect(gearError?.message).toContain("200");
  });

  it("allows gear karma up to 200 for life-modules", () => {
    const state = createLifeModulesState({
      budgets: { "karma-spent-gear": 200 },
    });

    const budgets = {
      karma: createBudgetState(750, 200, "Karma"),
    };

    const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

    const gearError = errors.find((e) => e.constraintId === "karma-conversion-limit");
    expect(gearError).toBeUndefined();
  });

  it("validates negative quality cap at 25 for life-modules", () => {
    const state = createLifeModulesState({
      budgets: { "negative-quality-karma-gained": 30 },
    });

    const budgets = {
      karma: createBudgetState(750, 0, "Karma"),
    };

    const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

    const negError = errors.find((e) => e.constraintId === "life-modules-negative-quality-limit");
    expect(negError).toBeDefined();
    expect(negError?.message).toContain("25");
  });

  it("allows negative quality karma up to 25 for life-modules", () => {
    const state = createLifeModulesState({
      budgets: { "negative-quality-karma-gained": 25 },
    });

    const budgets = {
      karma: createBudgetState(750, 0, "Karma"),
    };

    const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

    const negError = errors.find((e) => e.constraintId === "life-modules-negative-quality-limit");
    expect(negError).toBeUndefined();
  });

  it("does not add life-modules negative quality error for non-life-modules methods", () => {
    const state = createLifeModulesState({
      creationMethodId: "sr5-priority",
      budgets: { "negative-quality-karma-gained": 30 },
    });

    const budgets = {
      karma: createBudgetState(25, 0, "Karma"),
    };

    const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

    const lmNegError = errors.find((e) => e.constraintId === "life-modules-negative-quality-limit");
    expect(lmNegError).toBeUndefined();
  });

  it("reports overspent karma when life module selections exceed 750", () => {
    const state = createLifeModulesState();

    const budgets = {
      karma: createBudgetState(750, 800, "Karma"),
    };

    const { errors } = validateBudgets(budgets, state, null, emptySkillCategories);

    const overError = errors.find((e) => e.constraintId === "karma-overspent");
    expect(overError).toBeDefined();
    expect(overError?.message).toContain("overspent");
  });
});
