import { describe, it, expect } from "vitest";
import { validateHouseRules } from "../validation";

describe("validateHouseRules", () => {
  it("returns no errors for an empty object", () => {
    expect(validateHouseRules({})).toEqual([]);
  });

  it("returns error for non-object input", () => {
    expect(validateHouseRules("string")).toEqual(["houseRules must be an object"]);
    expect(validateHouseRules(null)).toEqual(["houseRules must be an object"]);
    expect(validateHouseRules(42)).toEqual(["houseRules must be an object"]);
  });

  it("rejects unknown keys", () => {
    const errors = validateHouseRules({ unknownField: true });
    expect(errors).toContain("houseRules: unknown key 'unknownField'");
  });

  it("validates boolean toggles", () => {
    expect(validateHouseRules({ trackEssenceHoles: true })).toEqual([]);
    expect(validateHouseRules({ trackEssenceHoles: "yes" })).toEqual([
      "houseRules.trackEssenceHoles must be a boolean",
    ]);
  });

  it("validates number toggles", () => {
    expect(validateHouseRules({ hitThreshold: 5 })).toEqual([]);
    expect(validateHouseRules({ hitThreshold: "five" })).toEqual([
      "houseRules.hitThreshold must be a finite number",
    ]);
  });

  it("validates number range", () => {
    // hitThreshold: min 3, max 6
    expect(validateHouseRules({ hitThreshold: 2 })).toEqual([
      "houseRules.hitThreshold must be >= 3",
    ]);
    expect(validateHouseRules({ hitThreshold: 7 })).toEqual([
      "houseRules.hitThreshold must be <= 6",
    ]);
  });

  it("validates enum toggles", () => {
    expect(validateHouseRules({ diceMode: "app-roll" })).toEqual([]);
    expect(validateHouseRules({ diceMode: "invalid" })).toEqual([
      "houseRules.diceMode must be one of: app-roll, manual-entry",
    ]);
  });

  it("validates string toggles", () => {
    expect(validateHouseRules({ freeformNotes: "no edge rerolls" })).toEqual([]);
    expect(validateHouseRules({ freeformNotes: 42 })).toEqual([
      "houseRules.freeformNotes must be a string",
    ]);
  });

  it("validates string-array toggles", () => {
    expect(validateHouseRules({ disabledEdgeActionIds: ["push-the-limit"] })).toEqual([]);
    expect(validateHouseRules({ disabledEdgeActionIds: "push-the-limit" })).toEqual([
      "houseRules.disabledEdgeActionIds must be an array of strings",
    ]);
    expect(validateHouseRules({ disabledEdgeActionIds: [42] })).toEqual([
      "houseRules.disabledEdgeActionIds must be an array of strings",
    ]);
  });

  it("collects multiple errors", () => {
    const errors = validateHouseRules({
      hitThreshold: "bad",
      diceMode: "invalid",
      unknownKey: true,
    });
    expect(errors.length).toBe(3);
  });

  it("accepts a fully-populated valid object", () => {
    const valid = {
      diceMode: "manual-entry",
      limitEnforcement: "off",
      hitThreshold: 4,
      glitchThreshold: 0.5,
      woundBoxesPerPenalty: 2,
      woundMaxPenalty: 6,
      creationMaxAttributesAtMax: 2,
      creationSkillCap: 7,
      gearRestrictionLevel: "relaxed",
      maxGearAvailability: 18,
      positiveQualityKarmaCap: 35,
      negativeQualityKarmaCap: 35,
      karmaToNuyenCap: 20,
      nuyenCarryoverCap: 10000,
      karmaCarryoverCap: 15,
      maxContactConnection: 8,
      maxContactLoyalty: 8,
      contactKarmaMultiplier: 4,
      magicReductionFormula: "round-down",
      trackEssenceHoles: false,
      allowedAugmentationGrades: ["standard", "alpha"],
      cyberlimbAttributeBonusCap: 6,
      minimumDrain: 1,
      overwatchCriticalGlitchBonus: 2,
      sumToTenBudget: 12,
      pointBuyKarmaBudget: 1000,
      lifeModulesKarmaBudget: 900,
      freeformNotes: "Custom rules for this campaign",
      disabledEdgeActionIds: [],
    };
    expect(validateHouseRules(valid)).toEqual([]);
  });
});
