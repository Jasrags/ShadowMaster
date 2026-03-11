import { describe, it, expect } from "vitest";
import {
  validatePointBuyBudget,
  calculatePointBuyKarmaSpent,
  calculateGearKarmaSpent,
  getMetatypeKarmaCost,
  calculateAttributeAdvancementCost,
  calculateSkillAdvancementCost,
  POINT_BUY_KARMA_BUDGET,
  POINT_BUY_MAX_GEAR_KARMA,
  POINT_BUY_NUYEN_PER_KARMA,
  POINT_BUY_MAX_LEFTOVER_NUYEN,
  POINT_BUY_METATYPE_COSTS,
  POINT_BUY_MAGIC_QUALITY_COSTS,
} from "@/lib/rules/point-buy-validation";
import type { PointBuyKarmaData } from "@/lib/rules/point-buy-validation";
import type { CreationConstraint } from "@/lib/types";
import type { ValidationContext } from "@/lib/rules/constraint-validation";

// =============================================================================
// HELPERS
// =============================================================================

function makeConstraint(overrides: Partial<CreationConstraint> = {}): CreationConstraint {
  return {
    id: "point-buy-budget",
    type: "point-buy-budget",
    description: "Karma budget must not exceed 800.",
    severity: "error",
    params: {
      totalBudget: 800,
      maxGearKarma: 200,
      nuyenPerKarma: 2000,
      maxLeftoverNuyen: 5000,
      metatypeCosts: {
        human: 0,
        elf: 40,
        dwarf: 50,
        ork: 50,
        troll: 90,
      },
      magicQualityCosts: {
        adept: 20,
        "aspected-magician": 15,
        magician: 30,
        "mystic-adept": 35,
        technomancer: 15,
      },
    },
    ...overrides,
  };
}

function makeContext(
  budgets: Record<string, number>,
  selections: Record<string, unknown> = {},
  overrides: Partial<ValidationContext> = {}
): ValidationContext {
  return {
    character: { metatype: "human", name: "Test" } as ValidationContext["character"],
    ruleset: {} as ValidationContext["ruleset"],
    creationState: {
      characterId: "test-char",
      creationMethodId: "point-buy",
      currentStep: 0,
      completedSteps: [],
      budgets,
      selections: selections as ValidationContext["creationState"] extends {
        selections: infer S;
      }
        ? S
        : never,
      errors: [],
      warnings: [],
      updatedAt: "2025-01-01T00:00:00.000Z",
    },
    creationMethod: {
      id: "point-buy",
      editionId: "sr5",
      editionCode: "sr5" as const,
      name: "Point Buy",
      type: "point-buy",
      version: "1.0.0",
      steps: [],
      budgets: [],
      constraints: [],
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    ...overrides,
  };
}

function makeContextUndefined(overrides: Partial<ValidationContext> = {}): ValidationContext {
  return {
    character: { metatype: "human", name: "Test" } as ValidationContext["character"],
    ruleset: {} as ValidationContext["ruleset"],
    creationState: undefined,
    ...overrides,
  };
}

// =============================================================================
// CONSTANTS
// =============================================================================

describe("POINT_BUY constants", () => {
  it("has correct karma budget", () => {
    expect(POINT_BUY_KARMA_BUDGET).toBe(800);
  });

  it("has correct max gear karma", () => {
    expect(POINT_BUY_MAX_GEAR_KARMA).toBe(200);
  });

  it("has correct nuyen per karma", () => {
    expect(POINT_BUY_NUYEN_PER_KARMA).toBe(2000);
  });

  it("has correct max leftover nuyen", () => {
    expect(POINT_BUY_MAX_LEFTOVER_NUYEN).toBe(5000);
  });

  it("has correct metatype costs", () => {
    expect(POINT_BUY_METATYPE_COSTS).toEqual({
      human: 0,
      elf: 40,
      dwarf: 50,
      ork: 50,
      troll: 90,
    });
  });

  it("has correct magic quality costs", () => {
    expect(POINT_BUY_MAGIC_QUALITY_COSTS).toEqual({
      adept: 20,
      "aspected-magician": 15,
      magician: 30,
      "mystic-adept": 35,
      technomancer: 15,
    });
  });
});

// =============================================================================
// getMetatypeKarmaCost
// =============================================================================

describe("getMetatypeKarmaCost", () => {
  it("returns 0 for human", () => {
    expect(getMetatypeKarmaCost("human")).toBe(0);
  });

  it("returns 40 for elf", () => {
    expect(getMetatypeKarmaCost("elf")).toBe(40);
  });

  it("returns 50 for dwarf", () => {
    expect(getMetatypeKarmaCost("dwarf")).toBe(50);
  });

  it("returns 50 for ork", () => {
    expect(getMetatypeKarmaCost("ork")).toBe(50);
  });

  it("returns 90 for troll", () => {
    expect(getMetatypeKarmaCost("troll")).toBe(90);
  });

  it("returns null for unknown metatype", () => {
    expect(getMetatypeKarmaCost("pixie")).toBeNull();
  });

  it("uses custom cost table", () => {
    const custom = { human: 10, pixie: 5 };
    expect(getMetatypeKarmaCost("pixie", custom)).toBe(5);
    expect(getMetatypeKarmaCost("human", custom)).toBe(10);
  });
});

// =============================================================================
// calculateAttributeAdvancementCost
// =============================================================================

describe("calculateAttributeAdvancementCost", () => {
  it("returns 0 when target equals base", () => {
    expect(calculateAttributeAdvancementCost(3, 3)).toBe(0);
  });

  it("returns 0 when target is below base", () => {
    expect(calculateAttributeAdvancementCost(3, 1)).toBe(0);
  });

  it("calculates cost for raising 1 to 2 (2 × 5 = 10)", () => {
    expect(calculateAttributeAdvancementCost(1, 2)).toBe(10);
  });

  it("calculates cost for raising 1 to 3 (2×5 + 3×5 = 25)", () => {
    expect(calculateAttributeAdvancementCost(1, 3)).toBe(25);
  });

  it("calculates cost for raising 1 to 6 (2+3+4+5+6)×5 = 100", () => {
    expect(calculateAttributeAdvancementCost(1, 6)).toBe(100);
  });

  it("calculates cost for raising 3 to 6 (4+5+6)×5 = 75", () => {
    expect(calculateAttributeAdvancementCost(3, 6)).toBe(75);
  });

  it("uses custom multiplier", () => {
    // Raising 1 to 3 with multiplier 3: (2×3 + 3×3 = 15)
    expect(calculateAttributeAdvancementCost(1, 3, 3)).toBe(15);
  });
});

// =============================================================================
// calculateSkillAdvancementCost
// =============================================================================

describe("calculateSkillAdvancementCost", () => {
  it("returns 0 for rating 0", () => {
    expect(calculateSkillAdvancementCost(0)).toBe(0);
  });

  it("returns 0 for negative rating", () => {
    expect(calculateSkillAdvancementCost(-1)).toBe(0);
  });

  it("calculates cost for rating 1 (1×2 = 2)", () => {
    expect(calculateSkillAdvancementCost(1)).toBe(2);
  });

  it("calculates cost for rating 3 (1+2+3)×2 = 12", () => {
    expect(calculateSkillAdvancementCost(3)).toBe(12);
  });

  it("calculates cost for rating 6 (1+2+3+4+5+6)×2 = 42", () => {
    expect(calculateSkillAdvancementCost(6)).toBe(42);
  });

  it("uses custom multiplier (skill group: ×5)", () => {
    // Rating 3: (1+2+3)×5 = 30
    expect(calculateSkillAdvancementCost(3, 5)).toBe(30);
  });
});

// =============================================================================
// calculateGearKarmaSpent
// =============================================================================

describe("calculateGearKarmaSpent", () => {
  it("returns 0 when no gear karma tracked", () => {
    expect(calculateGearKarmaSpent({})).toBe(0);
  });

  it("returns gear karma value", () => {
    expect(calculateGearKarmaSpent({ gearKarma: 150 })).toBe(150);
  });

  it("returns 0 for undefined gear karma", () => {
    expect(calculateGearKarmaSpent({ gearKarma: undefined })).toBe(0);
  });
});

// =============================================================================
// calculatePointBuyKarmaSpent
// =============================================================================

describe("calculatePointBuyKarmaSpent", () => {
  it("returns 0 for empty data", () => {
    expect(calculatePointBuyKarmaSpent({})).toBe(0);
  });

  it("includes metatype cost for human (0)", () => {
    expect(calculatePointBuyKarmaSpent({ metatypeId: "human" })).toBe(0);
  });

  it("includes metatype cost for troll (90)", () => {
    expect(calculatePointBuyKarmaSpent({ metatypeId: "troll" })).toBe(90);
  });

  it("includes magic quality cost", () => {
    expect(calculatePointBuyKarmaSpent({ magicalPath: "magician" })).toBe(30);
  });

  it("sums all karma sources", () => {
    const data: PointBuyKarmaData = {
      metatypeId: "elf", // 40
      magicalPath: "adept", // 20
      attributeKarma: 100,
      skillKarma: 50,
      qualityKarma: 10,
      contactKarma: 15,
      gearKarma: 100,
      spellKarma: 25,
      powerPointKarma: 0,
    };
    // 40 + 20 + 100 + 50 + 10 + 15 + 100 + 25 + 0 = 360
    expect(calculatePointBuyKarmaSpent(data)).toBe(360);
  });

  it("ignores undefined values", () => {
    const data: PointBuyKarmaData = {
      metatypeId: "human",
      attributeKarma: undefined,
      skillKarma: undefined,
    };
    expect(calculatePointBuyKarmaSpent(data)).toBe(0);
  });

  it("handles unknown metatype (costs 0)", () => {
    expect(calculatePointBuyKarmaSpent({ metatypeId: "pixie" })).toBe(0);
  });

  it("uses custom metatype costs from params", () => {
    const params = { metatypeCosts: { human: 10 } };
    expect(calculatePointBuyKarmaSpent({ metatypeId: "human" }, params)).toBe(10);
  });

  it("uses custom magic quality costs from params", () => {
    const params = { magicQualityCosts: { magician: 50 } };
    expect(calculatePointBuyKarmaSpent({ magicalPath: "magician" }, params)).toBe(50);
  });
});

// =============================================================================
// validatePointBuyBudget
// =============================================================================

describe("validatePointBuyBudget", () => {
  it("returns null when no creation state", () => {
    const context = makeContextUndefined();
    expect(validatePointBuyBudget(makeConstraint(), context)).toBeNull();
  });

  it("returns null when under budget", () => {
    const context = makeContext(
      { "point-buy-attributes": 200, "point-buy-skills": 100 },
      { metatypeId: "human" }
    );
    expect(validatePointBuyBudget(makeConstraint(), context)).toBeNull();
  });

  it("returns null when exactly at budget (800)", () => {
    const context = makeContext(
      {
        "point-buy-attributes": 280,
        "point-buy-skills": 200,
        "point-buy-qualities": 50,
        "point-buy-contacts": 50,
        "point-buy-gear": 100,
      },
      { metatypeId: "troll", magicalPath: "magician" }
      // troll=90, magician=30, 280+200+50+50+100 = 680, total = 800
    );
    expect(validatePointBuyBudget(makeConstraint(), context)).toBeNull();
  });

  it("returns error when over budget", () => {
    const context = makeContext(
      {
        "point-buy-attributes": 400,
        "point-buy-skills": 200,
        "point-buy-gear": 200,
      },
      { metatypeId: "troll" }
    );
    // troll=90, 400+200+200 = 800, total = 890 > 800
    const result = validatePointBuyBudget(makeConstraint(), context);
    expect(result).not.toBeNull();
    expect(result!.severity).toBe("error");
    expect(result!.field).toBe("karma-budget");
    expect(result!.message).toContain("890");
    expect(result!.message).toContain("800");
  });

  it("returns error when gear karma exceeds cap", () => {
    const context = makeContext({ "point-buy-gear": 250 }, { metatypeId: "human" });
    const result = validatePointBuyBudget(makeConstraint(), context);
    expect(result).not.toBeNull();
    expect(result!.field).toBe("gear-karma");
    expect(result!.message).toContain("250");
    expect(result!.message).toContain("200");
  });

  it("checks total budget before gear cap", () => {
    // Both over total and over gear cap — total is checked first
    const context = makeContext(
      {
        "point-buy-attributes": 600,
        "point-buy-gear": 250,
      },
      { metatypeId: "human" }
    );
    const result = validatePointBuyBudget(makeConstraint(), context);
    expect(result).not.toBeNull();
    expect(result!.field).toBe("karma-budget");
  });

  it("uses custom errorMessage from constraint", () => {
    const context = makeContext({ "point-buy-attributes": 900 }, { metatypeId: "human" });
    const constraint = makeConstraint({
      errorMessage: "Too much karma, omae!",
    });
    const result = validatePointBuyBudget(constraint, context);
    expect(result).not.toBeNull();
    expect(result!.message).toBe("Too much karma, omae!");
  });

  it("uses custom totalBudget from params", () => {
    const constraint = makeConstraint({
      params: {
        totalBudget: 500,
        maxGearKarma: 200,
      },
    });
    const context = makeContext({ "point-buy-attributes": 501 }, { metatypeId: "human" });
    const result = validatePointBuyBudget(constraint, context);
    expect(result).not.toBeNull();
    expect(result!.message).toContain("501");
    expect(result!.message).toContain("500");
  });

  it("uses custom maxGearKarma from params", () => {
    const constraint = makeConstraint({
      params: {
        totalBudget: 800,
        maxGearKarma: 100,
      },
    });
    const context = makeContext({ "point-buy-gear": 150 }, { metatypeId: "human" });
    const result = validatePointBuyBudget(constraint, context);
    expect(result).not.toBeNull();
    expect(result!.field).toBe("gear-karma");
    expect(result!.message).toContain("150");
    expect(result!.message).toContain("100");
  });

  it("returns null for gear karma exactly at cap", () => {
    const context = makeContext({ "point-buy-gear": 200 }, { metatypeId: "human" });
    expect(validatePointBuyBudget(makeConstraint(), context)).toBeNull();
  });

  it("validates realistic troll street samurai build", () => {
    const context = makeContext(
      {
        "point-buy-attributes": 250,
        "point-buy-skills": 150,
        "point-buy-qualities": 15,
        "point-buy-contacts": 20,
        "point-buy-gear": 175,
      },
      { metatypeId: "troll" }
    );
    // troll=90, 250+150+15+20+175 = 610, total = 700 (under 800)
    expect(validatePointBuyBudget(makeConstraint(), context)).toBeNull();
  });
});
