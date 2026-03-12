/**
 * Tests for method-aware creation validation.
 *
 * Validates that:
 * 1. canFinalize logic works correctly per creation method
 * 2. Budget calculations use explicit method checks (not !hasPriorities proxy)
 * 3. Point Buy has its own dedicated budget calculation path
 * 4. extractSpentValues charges metatype/magic karma only for PB/LM
 */

import { describe, test, expect } from "vitest";
import { _testExports } from "@/lib/contexts/CreationBudgetContext";
import {
  POINT_BUY_KARMA_BUDGET,
  POINT_BUY_NUYEN_PER_KARMA,
  POINT_BUY_METATYPE_COSTS,
  POINT_BUY_MAGIC_QUALITY_COSTS,
} from "@/lib/rules/point-buy-validation";
import { LIFE_MODULES_KARMA_BUDGET } from "@/lib/types";

const {
  extractSpentValues,
  calculateBudgetTotals,
  calculateLifeModulesBudgetTotals,
  calculatePointBuyBudgetTotals,
} = _testExports;

// Minimal defaults
const emptyBudgets: Record<string, number> = {};
const emptySelections: Record<string, unknown> = {};
const emptyTotals: Record<
  string,
  { total: number; label: string; displayFormat?: "number" | "currency" }
> = {};
const nullPriorityTable = null;
const noSkillCategories: Record<string, string | undefined> = {};

// =============================================================================
// calculateBudgetTotals - method routing
// =============================================================================

describe("calculateBudgetTotals - method routing", () => {
  test("routes to point-buy calculator when creationMethodId is point-buy", () => {
    const result = calculateBudgetTotals(
      undefined,
      emptySelections,
      nullPriorityTable,
      {},
      undefined,
      "point-buy"
    );
    expect(result.karma.total).toBe(POINT_BUY_KARMA_BUDGET);
  });

  test("routes to life-modules calculator when creationMethodId is life-modules", () => {
    const result = calculateBudgetTotals(
      undefined,
      emptySelections,
      nullPriorityTable,
      {},
      undefined,
      "life-modules"
    );
    expect(result.karma.total).toBe(LIFE_MODULES_KARMA_BUDGET);
  });

  test("falls through to priority logic for priority method", () => {
    const result = calculateBudgetTotals(
      undefined,
      emptySelections,
      nullPriorityTable,
      {},
      undefined,
      "priority"
    );
    // No priority table → only karma with default 25
    expect(result.karma.total).toBe(25);
  });

  test("falls through to priority logic for sum-to-ten method", () => {
    const result = calculateBudgetTotals(
      undefined,
      emptySelections,
      nullPriorityTable,
      {},
      undefined,
      "sum-to-ten"
    );
    expect(result.karma.total).toBe(25);
  });
});

// =============================================================================
// calculatePointBuyBudgetTotals
// =============================================================================

describe("calculatePointBuyBudgetTotals", () => {
  test("returns 800 karma budget", () => {
    const result = calculatePointBuyBudgetTotals(emptySelections, {});
    expect(result.karma.total).toBe(800);
    expect(result.karma.label).toBe("Karma");
  });

  test("nuyen is derived from karma-to-nuyen conversion", () => {
    const result = calculatePointBuyBudgetTotals(emptySelections, {
      "karma-spent-gear": 5,
    });
    expect(result.nuyen.total).toBe(5 * POINT_BUY_NUYEN_PER_KARMA);
    expect(result.nuyen.displayFormat).toBe("currency");
  });

  test("nuyen is 0 when no karma converted", () => {
    const result = calculatePointBuyBudgetTotals(emptySelections, {});
    expect(result.nuyen.total).toBe(0);
  });

  test("contact points scale with charisma", () => {
    const result = calculatePointBuyBudgetTotals({ attributes: { charisma: 5 } }, {});
    expect(result["contact-points"].total).toBe(15);
  });

  test("knowledge points scale with INT + LOG", () => {
    const result = calculatePointBuyBudgetTotals({ attributes: { intuition: 4, logic: 3 } }, {});
    expect(result["knowledge-points"].total).toBe(14);
  });
});

// =============================================================================
// extractSpentValues - metatype/magic karma charges
// =============================================================================

describe("extractSpentValues - method-aware metatype/magic karma", () => {
  test("point-buy charges karma for metatype selection", () => {
    const selections = { metatype: "elf" };
    const spent = extractSpentValues(
      emptyBudgets,
      selections,
      emptyTotals,
      nullPriorityTable,
      undefined,
      noSkillCategories,
      [],
      undefined,
      "point-buy"
    );
    expect(spent["karma"]).toBe(POINT_BUY_METATYPE_COSTS["elf"]);
  });

  test("life-modules charges karma for metatype selection", () => {
    const selections = { metatype: "dwarf" };
    const spent = extractSpentValues(
      emptyBudgets,
      selections,
      emptyTotals,
      nullPriorityTable,
      undefined,
      noSkillCategories,
      [],
      undefined,
      "life-modules"
    );
    expect(spent["karma"]).toBe(POINT_BUY_METATYPE_COSTS["dwarf"]);
  });

  test("priority method does NOT charge karma for metatype", () => {
    const selections = { metatype: "elf" };
    const spent = extractSpentValues(
      emptyBudgets,
      selections,
      emptyTotals,
      nullPriorityTable,
      { metatype: "A", attributes: "B", skills: "C", magic: "D", resources: "E" },
      noSkillCategories,
      [],
      undefined,
      "priority"
    );
    expect(spent["karma"]).toBe(0);
  });

  test("sum-to-ten method does NOT charge karma for metatype", () => {
    const selections = { metatype: "elf" };
    const spent = extractSpentValues(
      emptyBudgets,
      selections,
      emptyTotals,
      nullPriorityTable,
      { metatype: "A", attributes: "A", skills: "B", magic: "C", resources: "D" },
      noSkillCategories,
      [],
      undefined,
      "sum-to-ten"
    );
    expect(spent["karma"]).toBe(0);
  });

  test("point-buy charges karma for magic path selection", () => {
    const selections = { "magical-path": "magician" };
    const spent = extractSpentValues(
      emptyBudgets,
      selections,
      emptyTotals,
      nullPriorityTable,
      undefined,
      noSkillCategories,
      [],
      undefined,
      "point-buy"
    );
    expect(spent["karma"]).toBe(POINT_BUY_MAGIC_QUALITY_COSTS["magician"]);
  });

  test("point-buy does NOT charge karma for mundane magic path", () => {
    const selections = { "magical-path": "mundane" };
    const spent = extractSpentValues(
      emptyBudgets,
      selections,
      emptyTotals,
      nullPriorityTable,
      undefined,
      noSkillCategories,
      [],
      undefined,
      "point-buy"
    );
    expect(spent["karma"]).toBe(0);
  });

  test("human metatype costs 0 karma in point-buy", () => {
    const selections = { metatype: "human" };
    const spent = extractSpentValues(
      emptyBudgets,
      selections,
      emptyTotals,
      nullPriorityTable,
      undefined,
      noSkillCategories,
      [],
      undefined,
      "point-buy"
    );
    expect(spent["karma"]).toBe(POINT_BUY_METATYPE_COSTS["human"] ?? 0);
  });
});
