/**
 * Unit tests for CreationBudgetContext helper functions
 *
 * Tests validation and derivation logic for character creation budgets.
 */

import { describe, it, expect } from "vitest";
import { _testExports, type BudgetState } from "../CreationBudgetContext";
import type { CreationState } from "../../types/creation";

const { extractSpentValues, validateBudgets } = _testExports;

// =============================================================================
// Test Helpers
// =============================================================================

function createMinimalCreationState(overrides?: Partial<CreationState>): CreationState {
  return {
    characterId: "test-char-1",
    creationMethodId: "sr5-priority",
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

// =============================================================================
// extractSpentValues Tests
// =============================================================================

describe("extractSpentValues", () => {
  describe("contact points derivation", () => {
    it("derives contact points from selections.contacts array (within free pool)", () => {
      const stateBudgets = {};
      const selections = {
        attributes: { charisma: 4 }, // Free pool = 4 × 3 = 12
        contacts: [
          { connection: 3, loyalty: 2 }, // 5 points
          { connection: 4, loyalty: 3 }, // 7 points
        ],
      };

      const spent = extractSpentValues(stateBudgets, selections);

      // Total is 12, free pool is 12, so spent = 12
      expect(spent["contact-points"]).toBe(12);
    });

    it("caps contact points at free pool (CHA × 3)", () => {
      const stateBudgets = {};
      const selections = {
        attributes: { charisma: 3 }, // Free pool = 3 × 3 = 9
        contacts: [
          { connection: 3, loyalty: 2 }, // 5 points
          { connection: 4, loyalty: 3 }, // 7 points - total 12
        ],
      };

      const spent = extractSpentValues(stateBudgets, selections);

      // Total is 12, but free pool is 9, so spent is capped at 9
      // The extra 3 points go to karma, not contact points
      expect(spent["contact-points"]).toBe(9);
    });

    it("returns 0 when no contacts are selected", () => {
      const stateBudgets = {};
      const selections = {};

      const spent = extractSpentValues(stateBudgets, selections);

      expect(spent["contact-points"]).toBe(0);
    });

    it("handles empty contacts array", () => {
      const stateBudgets = {};
      const selections = { contacts: [] };

      const spent = extractSpentValues(stateBudgets, selections);

      expect(spent["contact-points"]).toBe(0);
    });
  });

  describe("spell slots derivation", () => {
    it("derives spell slots from selections.spells array length", () => {
      const stateBudgets = {};
      const selections = {
        spells: ["fireball", "lightning-bolt", "ice-shield"],
      };

      const spent = extractSpentValues(stateBudgets, selections);

      expect(spent["spell-slots"]).toBe(3);
    });

    it("handles spells as object array", () => {
      const stateBudgets = {};
      const selections = {
        spells: [{ id: "fireball" }, { id: "lightning-bolt" }],
      };

      const spent = extractSpentValues(stateBudgets, selections);

      expect(spent["spell-slots"]).toBe(2);
    });

    it("returns 0 when no spells are selected", () => {
      const stateBudgets = {};
      const selections = {};

      const spent = extractSpentValues(stateBudgets, selections);

      expect(spent["spell-slots"]).toBe(0);
    });
  });

  describe("lifestyle spending derivation", () => {
    it("derives lifestyle spending from selections.lifestyles", () => {
      const stateBudgets = {};
      const selections = {
        lifestyles: [
          { monthlyCost: 1000, prepaidMonths: 3 }, // 3000
          { monthlyCost: 500, prepaidMonths: 1 }, // 500
        ],
      };

      const spent = extractSpentValues(stateBudgets, selections);

      // Lifestyle is part of total nuyen spent
      // Check that it's included in the nuyen calculation
      expect(spent["nuyen"]).toBeGreaterThanOrEqual(3500);
    });

    it("defaults prepaidMonths to 1 when not specified", () => {
      const stateBudgets = {};
      const selections = {
        lifestyles: [{ monthlyCost: 2000 }],
      };

      const spent = extractSpentValues(stateBudgets, selections);

      expect(spent["nuyen"]).toBeGreaterThanOrEqual(2000);
    });
  });
});

// =============================================================================
// validateBudgets Tests
// =============================================================================

describe("validateBudgets", () => {
  describe("karma conversion limit validation", () => {
    it("allows up to 10 karma for nuyen conversion", () => {
      const budgets: Record<string, BudgetState> = {
        karma: createBudgetState(25, 10, "Karma"),
      };
      const state = createMinimalCreationState({
        budgets: { "karma-spent-gear": 10 },
      });

      const { errors } = validateBudgets(budgets, state);

      const conversionError = errors.find((e) => e.constraintId === "karma-conversion-limit");
      expect(conversionError).toBeUndefined();
    });

    it("returns error when karma conversion exceeds 10", () => {
      const budgets: Record<string, BudgetState> = {
        karma: createBudgetState(25, 11, "Karma"),
      };
      const state = createMinimalCreationState({
        budgets: { "karma-spent-gear": 11 },
      });

      const { errors } = validateBudgets(budgets, state);

      const conversionError = errors.find((e) => e.constraintId === "karma-conversion-limit");
      expect(conversionError).toBeDefined();
      expect(conversionError?.message).toContain("cannot exceed 10 karma");
      expect(conversionError?.message).toContain("currently 11");
    });

    it("does not error when no karma is converted", () => {
      const budgets: Record<string, BudgetState> = {
        karma: createBudgetState(25, 0, "Karma"),
      };
      const state = createMinimalCreationState({
        budgets: {},
      });

      const { errors } = validateBudgets(budgets, state);

      const conversionError = errors.find((e) => e.constraintId === "karma-conversion-limit");
      expect(conversionError).toBeUndefined();
    });
  });

  describe("budget overspend validation", () => {
    it("returns error when budget is overspent", () => {
      const budgets: Record<string, BudgetState> = {
        "attribute-points": createBudgetState(24, 26, "Attribute Points"),
      };
      const state = createMinimalCreationState();

      const { errors } = validateBudgets(budgets, state);

      const overspentError = errors.find((e) => e.constraintId === "attribute-points-overspent");
      expect(overspentError).toBeDefined();
      expect(overspentError?.message).toContain("overspent by 2");
    });
  });

  describe("nuyen carryover warning", () => {
    it("warns when nuyen remaining exceeds 5000", () => {
      const budgets: Record<string, BudgetState> = {
        nuyen: createBudgetState(50000, 40000, "Nuyen"),
      };
      const state = createMinimalCreationState();

      const { warnings } = validateBudgets(budgets, state);

      const carryoverWarning = warnings.find((w) => w.constraintId === "nuyen-carryover");
      expect(carryoverWarning).toBeDefined();
      expect(carryoverWarning?.message).toContain("5,000");
    });
  });

  describe("quality limits validation", () => {
    it("errors when positive qualities exceed 25 karma", () => {
      const budgets: Record<string, BudgetState> = {};
      const state = createMinimalCreationState({
        selections: {
          positiveQualities: [
            { id: "q1", karma: 15 },
            { id: "q2", karma: 15 },
          ],
        },
      });

      const { errors } = validateBudgets(budgets, state);

      const qualityError = errors.find((e) => e.constraintId === "positive-quality-limit");
      expect(qualityError).toBeDefined();
      expect(qualityError?.message).toContain("cannot exceed 25 karma");
    });
  });
});
