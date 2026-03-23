import { describe, test, expect } from "vitest";
import {
  calculateComponentLevelCost,
  calculateExpandedLifestyleCost,
  calculateLifestyleTotalCost,
} from "../cost";
import type { LifestyleData } from "../../loader-types";
import type { LifestyleComponentSelections } from "../../../types/character";

// =============================================================================
// FACTORIES
// =============================================================================

function makeMediumLifestyle(overrides: Partial<LifestyleData> = {}): LifestyleData {
  return {
    id: "middle",
    name: "Middle",
    monthlyCost: 5000,
    startingNuyen: "4d6 × 100",
    components: {
      comfortsAndNecessities: { base: 3, limit: 4 },
      security: { base: 3, limit: 4 },
      neighborhood: { base: 4, limit: 5 },
    },
    points: 4,
    ...overrides,
  };
}

function makeStreetLifestyle(): LifestyleData {
  return {
    id: "street",
    name: "Street",
    monthlyCost: 0,
    startingNuyen: "1d6 × 20",
    components: {
      comfortsAndNecessities: { base: 0, limit: 1 },
      security: { base: 0, limit: 1 },
      neighborhood: { base: 0, limit: 1 },
    },
    points: 2,
    costPerLevelFlat: 50,
  };
}

function makeBaseComponents(lifestyle: LifestyleData): LifestyleComponentSelections {
  return {
    comfortsAndNecessities: lifestyle.components!.comfortsAndNecessities.base,
    security: lifestyle.components!.security.base,
    neighborhood: lifestyle.components!.neighborhood.base,
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("calculateComponentLevelCost", () => {
  test("returns 0 when no components on lifestyle", () => {
    const lifestyle: LifestyleData = {
      id: "low",
      name: "Low",
      monthlyCost: 2000,
      startingNuyen: "3d6 × 60",
    };
    const components: LifestyleComponentSelections = {
      comfortsAndNecessities: 2,
      security: 2,
      neighborhood: 2,
    };
    expect(calculateComponentLevelCost(lifestyle, components)).toBe(0);
  });

  test("returns 0 when all components at base", () => {
    const lifestyle = makeMediumLifestyle();
    const components = makeBaseComponents(lifestyle);
    expect(calculateComponentLevelCost(lifestyle, components)).toBe(0);
  });

  test("raises one category by 1 costs 10% of base", () => {
    const lifestyle = makeMediumLifestyle();
    const components = {
      ...makeBaseComponents(lifestyle),
      comfortsAndNecessities: 4, // raised by 1 from base 3
    };
    // 5000 × 0.1 = 500
    expect(calculateComponentLevelCost(lifestyle, components)).toBe(500);
  });

  test("raises multiple categories costs 10% per raised level", () => {
    const lifestyle = makeMediumLifestyle();
    const components: LifestyleComponentSelections = {
      comfortsAndNecessities: 4, // +1
      security: 4, // +1
      neighborhood: 5, // +1
    };
    // 3 raised levels × 500 = 1500
    expect(calculateComponentLevelCost(lifestyle, components)).toBe(1500);
  });

  test("Street lifestyle uses flat cost per level", () => {
    const lifestyle = makeStreetLifestyle();
    const components: LifestyleComponentSelections = {
      comfortsAndNecessities: 1, // +1
      security: 1, // +1
      neighborhood: 1, // +1
    };
    // 3 raised levels × 50¥ = 150
    expect(calculateComponentLevelCost(lifestyle, components)).toBe(150);
  });

  test("does not count levels below base", () => {
    const lifestyle = makeMediumLifestyle();
    const components: LifestyleComponentSelections = {
      comfortsAndNecessities: 2, // below base 3 — counts as 0
      security: 3, // at base
      neighborhood: 4, // at base
    };
    expect(calculateComponentLevelCost(lifestyle, components)).toBe(0);
  });
});

describe("calculateExpandedLifestyleCost", () => {
  test("returns base cost with no extras", () => {
    const lifestyle = makeMediumLifestyle();
    expect(calculateExpandedLifestyleCost({ lifestyleData: lifestyle })).toBe(5000);
  });

  test("includes component level cost", () => {
    const lifestyle = makeMediumLifestyle();
    expect(
      calculateExpandedLifestyleCost({
        lifestyleData: lifestyle,
        components: {
          comfortsAndNecessities: 4,
          security: 3,
          neighborhood: 4,
        },
      })
    ).toBe(5500); // 5000 + 500 (1 raised level)
  });

  test("includes entertainment option costs", () => {
    const lifestyle = makeMediumLifestyle();
    expect(
      calculateExpandedLifestyleCost({
        lifestyleData: lifestyle,
        entertainmentOptions: [
          { catalogId: "gym", name: "Gym", quantity: 1 },
          { catalogId: "local-bar-patron", name: "Local Bar", quantity: 2 },
        ],
        entertainmentCatalog: [
          {
            id: "gym",
            name: "Gym",
            type: "asset",
            points: 2,
            monthlyCost: 300,
            minLifestyle: "middle",
            purchasableMultipleTimes: false,
          },
          {
            id: "local-bar-patron",
            name: "Local Bar Patron",
            type: "outing",
            points: 1,
            monthlyCost: 25,
            minLifestyle: "low",
            purchasableMultipleTimes: true,
          },
        ],
      })
    ).toBe(5350); // 5000 + 300 + (25 × 2)
  });

  test("includes positive percentage modification", () => {
    const lifestyle = makeMediumLifestyle();
    expect(
      calculateExpandedLifestyleCost({
        lifestyleData: lifestyle,
        modifications: [{ type: "positive", modifier: 20, modifierType: "percentage" }],
      })
    ).toBe(6000); // 5000 + 1000 (20%)
  });

  test("includes negative percentage modification", () => {
    const lifestyle = makeMediumLifestyle();
    expect(
      calculateExpandedLifestyleCost({
        lifestyleData: lifestyle,
        modifications: [{ type: "negative", modifier: 10, modifierType: "percentage" }],
      })
    ).toBe(4500); // 5000 - 500 (10%)
  });

  test("includes flat modification", () => {
    const lifestyle = makeMediumLifestyle();
    expect(
      calculateExpandedLifestyleCost({
        lifestyleData: lifestyle,
        modifications: [{ type: "positive", modifier: 1000, modifierType: "flat" }],
      })
    ).toBe(6000); // 5000 + 1000
  });

  test("combines all cost components", () => {
    const lifestyle = makeMediumLifestyle();
    expect(
      calculateExpandedLifestyleCost({
        lifestyleData: lifestyle,
        components: {
          comfortsAndNecessities: 4, // +1 = +500
          security: 3,
          neighborhood: 4,
        },
        entertainmentOptions: [{ catalogId: "gym", name: "Gym", quantity: 1 }],
        entertainmentCatalog: [
          {
            id: "gym",
            name: "Gym",
            type: "asset",
            points: 2,
            monthlyCost: 300,
            minLifestyle: "middle",
            purchasableMultipleTimes: false,
          },
        ],
        modifications: [{ type: "positive", modifier: 20, modifierType: "percentage" }],
        customExpenses: 100,
        customIncome: 50,
      })
    ).toBe(6850); // 5000 + 500 + 300 + 1000 + 100 - 50
  });

  test("floors at zero", () => {
    const lifestyle = makeMediumLifestyle();
    expect(
      calculateExpandedLifestyleCost({
        lifestyleData: lifestyle,
        customIncome: 999999,
      })
    ).toBe(0);
  });
});

// =============================================================================
// calculateLifestyleTotalCost
// =============================================================================

describe("calculateLifestyleTotalCost", () => {
  test("simple lifestyle uses base cost + modifications + subscriptions", () => {
    const cost = calculateLifestyleTotalCost({
      lifestyle: {
        type: "middle",
        monthlyCost: 5000,
        modifications: [
          { name: "Garage", type: "positive", modifier: 20, modifierType: "percentage" },
        ],
        subscriptions: [{ name: "DocWagon", monthlyCost: 5000 }],
      },
    });
    // 5000 + 1000 (20%) + 5000 (sub) = 11000
    expect(cost).toBe(11000);
  });

  test("simple lifestyle includes custom expenses and income", () => {
    const cost = calculateLifestyleTotalCost({
      lifestyle: {
        type: "low",
        monthlyCost: 2000,
        customExpenses: 500,
        customIncome: 200,
      },
    });
    // 2000 + 500 - 200 = 2300
    expect(cost).toBe(2300);
  });

  test("expanded lifestyle uses catalog data for component costs", () => {
    const catalog = [makeMediumLifestyle()];
    const cost = calculateLifestyleTotalCost({
      lifestyle: {
        type: "middle",
        monthlyCost: 5000,
        components: {
          comfortsAndNecessities: 4, // +1 from base 3
          security: 3,
          neighborhood: 4,
        },
      },
      lifestyleCatalog: catalog,
    });
    // 5000 + 500 (1 raised level × 10%) = 5500
    expect(cost).toBe(5500);
  });

  test("applies metatype modifier", () => {
    const cost = calculateLifestyleTotalCost({
      lifestyle: {
        type: "middle",
        monthlyCost: 5000,
      },
      metatypeModifier: 2, // troll
    });
    // 5000 × 2 = 10000
    expect(cost).toBe(10000);
  });

  test("metatype modifier applies to expanded cost", () => {
    const catalog = [makeMediumLifestyle()];
    const cost = calculateLifestyleTotalCost({
      lifestyle: {
        type: "middle",
        monthlyCost: 5000,
        components: {
          comfortsAndNecessities: 4,
          security: 3,
          neighborhood: 4,
        },
      },
      lifestyleCatalog: catalog,
      metatypeModifier: 1.2, // dwarf
    });
    // (5000 + 500) × 1.2 = 6600
    expect(cost).toBe(6600);
  });

  test("defaults metatype modifier to 1 when not provided", () => {
    const cost = calculateLifestyleTotalCost({
      lifestyle: { type: "low", monthlyCost: 2000 },
    });
    expect(cost).toBe(2000);
  });

  test("floors at zero before metatype modifier", () => {
    const cost = calculateLifestyleTotalCost({
      lifestyle: {
        type: "low",
        monthlyCost: 2000,
        customIncome: 999999,
      },
      metatypeModifier: 2,
    });
    expect(cost).toBe(0);
  });

  test("falls back to simple calculation when no catalog provided", () => {
    const cost = calculateLifestyleTotalCost({
      lifestyle: {
        type: "middle",
        monthlyCost: 5000,
        components: {
          comfortsAndNecessities: 4,
          security: 3,
          neighborhood: 4,
        },
      },
      // No lifestyleCatalog — can't look up base levels
    });
    // Falls back to simple: just base cost
    expect(cost).toBe(5000);
  });
});
