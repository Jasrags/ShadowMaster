import { describe, test, expect } from "vitest";
import { calculateComponentLevelCost, calculateExpandedLifestyleCost } from "../cost";
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
