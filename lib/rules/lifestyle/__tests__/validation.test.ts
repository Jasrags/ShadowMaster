import { describe, test, expect } from "vitest";
import {
  validatePointBudget,
  validateComponentLevels,
  validateEntertainmentRequirements,
  meetsMinimumLifestyle,
  calculatePointsSpent,
} from "../validation";
import type { LifestyleData, EntertainmentOptionCatalogItem } from "../../loader-types";
import type { LifestyleModificationCatalogItem } from "../../module-payloads";
import type {
  LifestyleComponentSelections,
  LifestyleEntertainmentOption,
} from "../../../types/character";

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

const GYM_CATALOG: EntertainmentOptionCatalogItem = {
  id: "gym",
  name: "Gym",
  type: "asset",
  points: 2,
  monthlyCost: 300,
  minLifestyle: "middle",
  purchasableMultipleTimes: false,
};

const BAR_CATALOG: EntertainmentOptionCatalogItem = {
  id: "local-bar-patron",
  name: "Local Bar Patron",
  type: "outing",
  points: 1,
  monthlyCost: 25,
  minLifestyle: "low",
  purchasableMultipleTimes: true,
};

const ARMORY_CATALOG: EntertainmentOptionCatalogItem = {
  id: "armory",
  name: "Armory",
  type: "asset",
  points: 2,
  monthlyCost: 1000,
  minLifestyle: "high",
  purchasableMultipleTimes: false,
};

// =============================================================================
// meetsMinimumLifestyle
// =============================================================================

describe("meetsMinimumLifestyle", () => {
  test("'none' minimum is always met", () => {
    expect(meetsMinimumLifestyle("street", "none")).toBe(true);
  });

  test("same tier meets requirement", () => {
    expect(meetsMinimumLifestyle("middle", "middle")).toBe(true);
  });

  test("higher tier meets requirement", () => {
    expect(meetsMinimumLifestyle("high", "middle")).toBe(true);
  });

  test("lower tier does not meet requirement", () => {
    expect(meetsMinimumLifestyle("low", "middle")).toBe(false);
  });

  test("medium alias matches middle", () => {
    expect(meetsMinimumLifestyle("middle", "middle")).toBe(true);
  });
});

// =============================================================================
// calculatePointsSpent
// =============================================================================

describe("calculatePointsSpent", () => {
  test("returns 0 with no raises and no entertainment", () => {
    const lifestyle = makeMediumLifestyle();
    expect(
      calculatePointsSpent({
        lifestyleData: lifestyle,
        components: {
          comfortsAndNecessities: 3,
          security: 3,
          neighborhood: 4,
        },
      })
    ).toBe(0);
  });

  test("counts raised component levels", () => {
    const lifestyle = makeMediumLifestyle();
    expect(
      calculatePointsSpent({
        lifestyleData: lifestyle,
        components: {
          comfortsAndNecessities: 4, // +1
          security: 4, // +1
          neighborhood: 5, // +1
        },
      })
    ).toBe(3);
  });

  test("counts entertainment points", () => {
    const lifestyle = makeMediumLifestyle();
    expect(
      calculatePointsSpent({
        lifestyleData: lifestyle,
        entertainmentOptions: [
          { catalogId: "gym", name: "Gym", quantity: 1 },
          { catalogId: "local-bar-patron", name: "Bar", quantity: 2 },
        ],
        entertainmentCatalog: [GYM_CATALOG, BAR_CATALOG],
      })
    ).toBe(4); // 2 + (1 × 2)
  });
});

// =============================================================================
// validatePointBudget
// =============================================================================

describe("validatePointBudget", () => {
  test("valid when points spent equals available", () => {
    const lifestyle = makeMediumLifestyle(); // 4 points
    const result = validatePointBudget({
      lifestyleData: lifestyle,
      components: {
        comfortsAndNecessities: 4, // +1
        security: 4, // +1
        neighborhood: 4, // at base
      },
      entertainmentOptions: [{ catalogId: "gym", name: "Gym", quantity: 1 }],
      entertainmentCatalog: [GYM_CATALOG],
    });
    // 2 (components) + 2 (gym) = 4 spent, 4 available
    expect(result.valid).toBe(true);
  });

  test("invalid when points spent exceeds available", () => {
    const lifestyle = makeMediumLifestyle(); // 4 points
    const result = validatePointBudget({
      lifestyleData: lifestyle,
      components: {
        comfortsAndNecessities: 4, // +1
        security: 4, // +1
        neighborhood: 5, // +1
      },
      entertainmentOptions: [{ catalogId: "gym", name: "Gym", quantity: 1 }],
      entertainmentCatalog: [GYM_CATALOG],
    });
    // 3 (components) + 2 (gym) = 5 spent, 4 available
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Points spent \(5\) exceeds available \(4\)/);
  });

  test("negative options grant extra points", () => {
    const lifestyle = makeMediumLifestyle(); // 4 points
    const negMod: LifestyleModificationCatalogItem = {
      id: "hotel-california",
      name: "Hotel California",
      type: "negative",
      modifier: 0,
      modifierType: "flat",
      pointsGranted: 1,
    };
    const result = validatePointBudget({
      lifestyleData: lifestyle,
      components: {
        comfortsAndNecessities: 4, // +1
        security: 4, // +1
        neighborhood: 5, // +1
      },
      entertainmentOptions: [{ catalogId: "gym", name: "Gym", quantity: 1 }],
      entertainmentCatalog: [GYM_CATALOG],
      modifications: [negMod],
    });
    // 5 spent, 4 + 1 = 5 available
    expect(result.valid).toBe(true);
  });

  test("negative option points capped at 2× base", () => {
    const lifestyle = makeMediumLifestyle({ points: 2 });
    const negMods: LifestyleModificationCatalogItem[] = [
      { id: "a", name: "A", type: "negative", modifier: 0, modifierType: "flat", pointsGranted: 2 },
      { id: "b", name: "B", type: "negative", modifier: 0, modifierType: "flat", pointsGranted: 2 },
      { id: "c", name: "C", type: "negative", modifier: 0, modifierType: "flat", pointsGranted: 2 },
    ];
    const result = validatePointBudget({
      lifestyleData: lifestyle,
      modifications: negMods,
    });
    // 6 points granted but cap is 2 × 2 = 4
    expect(result.errors.some((e) => e.includes("maximum is 4"))).toBe(true);
  });

  test("positive options consume points from budget", () => {
    const lifestyle = makeMediumLifestyle(); // 4 points
    const posMod: LifestyleModificationCatalogItem = {
      id: "corporate-owned",
      name: "Corporate Owned",
      type: "positive",
      modifier: 0,
      modifierType: "flat",
      pointsCost: 3,
    };
    const result = validatePointBudget({
      lifestyleData: lifestyle,
      components: {
        comfortsAndNecessities: 4, // +1
        security: 3,
        neighborhood: 4,
      },
      modifications: [posMod],
    });
    // 1 spent on components, 4 base - 3 consumed = 1 available
    expect(result.valid).toBe(true);
  });

  test("dice formula points treated as 0 for validation", () => {
    const lifestyle = makeMediumLifestyle({ points: "1d6+2" });
    const result = validatePointBudget({
      lifestyleData: lifestyle,
    });
    // base points = 0 (string), no spending
    expect(result.valid).toBe(true);
  });
});

// =============================================================================
// validateComponentLevels
// =============================================================================

describe("validateComponentLevels", () => {
  test("valid when all at base", () => {
    const lifestyle = makeMediumLifestyle();
    const result = validateComponentLevels(lifestyle, {
      comfortsAndNecessities: 3,
      security: 3,
      neighborhood: 4,
    });
    expect(result.valid).toBe(true);
  });

  test("valid when all at limit", () => {
    const lifestyle = makeMediumLifestyle();
    const result = validateComponentLevels(lifestyle, {
      comfortsAndNecessities: 4,
      security: 4,
      neighborhood: 5,
    });
    expect(result.valid).toBe(true);
  });

  test("invalid when below base", () => {
    const lifestyle = makeMediumLifestyle();
    const result = validateComponentLevels(lifestyle, {
      comfortsAndNecessities: 2, // below base 3
      security: 3,
      neighborhood: 4,
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Comforts & Necessities/);
  });

  test("invalid when above limit", () => {
    const lifestyle = makeMediumLifestyle();
    const result = validateComponentLevels(lifestyle, {
      comfortsAndNecessities: 3,
      security: 5, // above limit 4
      neighborhood: 4,
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Security/);
  });

  test("valid when lifestyle has no components", () => {
    const lifestyle: LifestyleData = {
      id: "low",
      name: "Low",
      monthlyCost: 2000,
      startingNuyen: "3d6 × 60",
    };
    const result = validateComponentLevels(lifestyle, {
      comfortsAndNecessities: 5,
      security: 5,
      neighborhood: 5,
    });
    expect(result.valid).toBe(true);
  });

  test("reports multiple errors", () => {
    const lifestyle = makeMediumLifestyle();
    const result = validateComponentLevels(lifestyle, {
      comfortsAndNecessities: 0,
      security: 10,
      neighborhood: 0,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(3);
  });
});

// =============================================================================
// validateEntertainmentRequirements
// =============================================================================

describe("validateEntertainmentRequirements", () => {
  test("valid when requirements met", () => {
    const result = validateEntertainmentRequirements({
      lifestyleId: "middle",
      entertainmentOptions: [{ catalogId: "gym", name: "Gym", quantity: 1 }],
      entertainmentCatalog: [GYM_CATALOG],
    });
    expect(result.valid).toBe(true);
  });

  test("invalid when lifestyle too low", () => {
    const result = validateEntertainmentRequirements({
      lifestyleId: "low",
      entertainmentOptions: [{ catalogId: "armory", name: "Armory", quantity: 1 }],
      entertainmentCatalog: [ARMORY_CATALOG],
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/requires minimum lifestyle "high"/);
  });

  test("invalid when asset added to safehouse", () => {
    const result = validateEntertainmentRequirements({
      lifestyleId: "high",
      entertainmentOptions: [{ catalogId: "armory", name: "Armory", quantity: 1 }],
      entertainmentCatalog: [ARMORY_CATALOG],
      hasSafehouseOption: true,
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/cannot be added to a safehouse/);
  });

  test("invalid when non-multi item has quantity > 1", () => {
    const result = validateEntertainmentRequirements({
      lifestyleId: "middle",
      entertainmentOptions: [{ catalogId: "gym", name: "Gym", quantity: 3 }],
      entertainmentCatalog: [GYM_CATALOG],
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/can only be purchased once/);
  });

  test("valid for multi-purchasable item with quantity > 1", () => {
    const result = validateEntertainmentRequirements({
      lifestyleId: "middle",
      entertainmentOptions: [{ catalogId: "local-bar-patron", name: "Bar", quantity: 3 }],
      entertainmentCatalog: [BAR_CATALOG],
    });
    expect(result.valid).toBe(true);
  });

  test("reports error for unknown catalog item", () => {
    const result = validateEntertainmentRequirements({
      lifestyleId: "middle",
      entertainmentOptions: [{ catalogId: "nonexistent", name: "???", quantity: 1 }],
      entertainmentCatalog: [],
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Unknown entertainment option/);
  });
});
