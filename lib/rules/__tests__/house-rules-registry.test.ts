import { describe, it, expect } from "vitest";
import type { HouseRules } from "../../types/house-rules";
import {
  TOGGLE_REGISTRY,
  getToggleValue,
  getToggleMeta,
  getTogglesByCategory,
  getToggleCategories,
  CATEGORY_LABELS,
} from "../house-rules-registry";

describe("TOGGLE_REGISTRY", () => {
  it("has no duplicate IDs", () => {
    const ids = TOGGLE_REGISTRY.map((m) => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("covers every key on HouseRules interface", () => {
    // Build a full HouseRules to get all keys
    const allKeys: (keyof HouseRules)[] = [
      "diceMode",
      "limitEnforcement",
      "hitThreshold",
      "glitchThreshold",
      "woundBoxesPerPenalty",
      "woundMaxPenalty",
      "disabledEdgeActionIds",
      "creationMaxAttributesAtMax",
      "creationSkillCap",
      "gearRestrictionLevel",
      "maxGearAvailability",
      "positiveQualityKarmaCap",
      "negativeQualityKarmaCap",
      "karmaToNuyenCap",
      "nuyenCarryoverCap",
      "karmaCarryoverCap",
      "maxContactConnection",
      "maxContactLoyalty",
      "contactKarmaMultiplier",
      "magicReductionFormula",
      "trackEssenceHoles",
      "allowedAugmentationGrades",
      "cyberlimbAttributeBonusCap",
      "minimumDrain",
      "overwatchCriticalGlitchBonus",
      "sumToTenBudget",
      "pointBuyKarmaBudget",
      "lifeModulesKarmaBudget",
      "freeformNotes",
    ];

    const registryIds = new Set(TOGGLE_REGISTRY.map((m) => m.id));
    for (const key of allKeys) {
      expect(registryIds.has(key)).toBe(true);
    }
  });

  it("every entry has a valid category", () => {
    const validCategories = Object.keys(CATEGORY_LABELS);
    for (const meta of TOGGLE_REGISTRY) {
      expect(validCategories).toContain(meta.category);
    }
  });

  it("every enum entry has options", () => {
    for (const meta of TOGGLE_REGISTRY) {
      if (meta.valueType === "enum") {
        expect(meta.options).toBeDefined();
        expect(meta.options!.length).toBeGreaterThan(0);
      }
    }
  });

  it("every number entry has min/max", () => {
    for (const meta of TOGGLE_REGISTRY) {
      if (meta.valueType === "number") {
        expect(meta.min).toBeDefined();
        expect(meta.max).toBeDefined();
        expect(meta.min!).toBeLessThanOrEqual(meta.max!);
      }
    }
  });

  it("default values match the declared valueType", () => {
    for (const meta of TOGGLE_REGISTRY) {
      const d = meta.defaultValue;
      switch (meta.valueType) {
        case "boolean":
          expect(typeof d).toBe("boolean");
          break;
        case "number":
          expect(typeof d).toBe("number");
          break;
        case "enum":
          expect(typeof d).toBe("string");
          break;
        case "string":
          expect(typeof d).toBe("string");
          break;
        case "string-array":
          expect(Array.isArray(d)).toBe(true);
          break;
      }
    }
  });
});

describe("getToggleValue", () => {
  it("returns default when houseRules is undefined", () => {
    expect(getToggleValue(undefined, "diceMode")).toBe("app-roll");
    expect(getToggleValue(undefined, "hitThreshold")).toBe(5);
    expect(getToggleValue(undefined, "trackEssenceHoles")).toBe(true);
  });

  it("returns default when houseRules is empty", () => {
    expect(getToggleValue({}, "limitEnforcement")).toBe("on");
    expect(getToggleValue({}, "positiveQualityKarmaCap")).toBe(25);
  });

  it("returns stored value when present", () => {
    const rules: HouseRules = { diceMode: "manual-entry", hitThreshold: 4 };
    expect(getToggleValue(rules, "diceMode")).toBe("manual-entry");
    expect(getToggleValue(rules, "hitThreshold")).toBe(4);
  });

  it("returns default for unset keys even when other keys are set", () => {
    const rules: HouseRules = { diceMode: "manual-entry" };
    expect(getToggleValue(rules, "hitThreshold")).toBe(5);
  });
});

describe("getToggleMeta", () => {
  it("returns metadata for known keys", () => {
    const meta = getToggleMeta("diceMode");
    expect(meta).toBeDefined();
    expect(meta!.label).toBe("Dice Rolling Mode");
    expect(meta!.valueType).toBe("enum");
  });

  it("returns undefined for unknown keys", () => {
    // Cast to test runtime behavior
    const meta = getToggleMeta("nonexistent" as keyof HouseRules);
    expect(meta).toBeUndefined();
  });
});

describe("getTogglesByCategory", () => {
  it("returns toggles for dice-combat category", () => {
    const toggles = getTogglesByCategory("dice-combat");
    expect(toggles.length).toBeGreaterThan(0);
    for (const t of toggles) {
      expect(t.category).toBe("dice-combat");
    }
  });

  it("returns toggles for character-creation category", () => {
    const toggles = getTogglesByCategory("character-creation");
    expect(toggles.length).toBeGreaterThan(0);
    for (const t of toggles) {
      expect(t.category).toBe("character-creation");
    }
  });

  it("returns empty for unknown category", () => {
    const toggles = getTogglesByCategory("nonexistent" as never);
    expect(toggles.length).toBe(0);
  });
});

describe("getToggleCategories", () => {
  it("returns all unique categories in order", () => {
    const categories = getToggleCategories();
    expect(categories.length).toBeGreaterThan(0);
    const unique = new Set(categories);
    expect(unique.size).toBe(categories.length);
  });

  it("first category is dice-combat (matches registry order)", () => {
    const categories = getToggleCategories();
    expect(categories[0]).toBe("dice-combat");
  });
});
