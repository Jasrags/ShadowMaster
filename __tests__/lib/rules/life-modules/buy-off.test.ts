import { describe, it, expect } from "vitest";
import {
  getModuleGrantedNegativeQualities,
  calculateBuyOffCost,
  getEffectiveNegativeQualityKarma,
} from "@/lib/rules/life-modules/buy-off";
import type { LifeModuleQualityGrant } from "@/lib/types/life-modules";
import type { QualityData } from "@/lib/rules/loader-types";

// =============================================================================
// TEST FIXTURES
// =============================================================================

const makeQuality = (overrides: Partial<QualityData> & { id: string }): QualityData => ({
  name: overrides.id,
  summary: `Test quality: ${overrides.id}`,
  ...overrides,
});

const negativeQualities: readonly QualityData[] = [
  makeQuality({ id: "sinner-national", karmaBonus: 5 }),
  makeQuality({ id: "sinner-corporate", karmaBonus: 25 }),
  makeQuality({ id: "prejudiced-common-biased", karmaBonus: 3 }),
  makeQuality({ id: "addiction-mild", karmaBonus: 4 }),
];

const moduleGrantedQualities: readonly LifeModuleQualityGrant[] = [
  { id: "toughness", type: "positive" },
  { id: "sinner-national", type: "negative" },
  { id: "sinner-corporate", type: "negative" },
  { id: "prejudiced-common-biased", type: "negative" },
];

// =============================================================================
// getModuleGrantedNegativeQualities
// =============================================================================

describe("getModuleGrantedNegativeQualities", () => {
  it("returns only negative qualities from module grants", () => {
    const result = getModuleGrantedNegativeQualities(moduleGrantedQualities);
    expect(result).toEqual([
      { id: "sinner-national", type: "negative" },
      { id: "sinner-corporate", type: "negative" },
      { id: "prejudiced-common-biased", type: "negative" },
    ]);
  });

  it("returns empty array when no negative qualities", () => {
    const positiveOnly: readonly LifeModuleQualityGrant[] = [{ id: "toughness", type: "positive" }];
    expect(getModuleGrantedNegativeQualities(positiveOnly)).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    expect(getModuleGrantedNegativeQualities([])).toEqual([]);
  });

  it("excludes bought-off quality IDs when provided", () => {
    const result = getModuleGrantedNegativeQualities(moduleGrantedQualities, ["sinner-national"]);
    expect(result).toEqual([
      { id: "sinner-corporate", type: "negative" },
      { id: "prejudiced-common-biased", type: "negative" },
    ]);
  });
});

// =============================================================================
// calculateBuyOffCost
// =============================================================================

describe("calculateBuyOffCost", () => {
  it("returns karmaBonus for a negative quality (1x at creation)", () => {
    const quality = makeQuality({ id: "sinner-national", karmaBonus: 5 });
    expect(calculateBuyOffCost(quality)).toBe(5);
  });

  it("returns 0 when quality has no karmaBonus", () => {
    const quality = makeQuality({ id: "unknown" });
    expect(calculateBuyOffCost(quality)).toBe(0);
  });

  it("handles various karma values", () => {
    expect(calculateBuyOffCost(makeQuality({ id: "a", karmaBonus: 25 }))).toBe(25);
    expect(calculateBuyOffCost(makeQuality({ id: "b", karmaBonus: 3 }))).toBe(3);
    expect(calculateBuyOffCost(makeQuality({ id: "c", karmaBonus: 10 }))).toBe(10);
  });
});

// =============================================================================
// getEffectiveNegativeQualityKarma
// =============================================================================

describe("getEffectiveNegativeQualityKarma", () => {
  it("returns total negative quality karma with no buy-offs", () => {
    const result = getEffectiveNegativeQualityKarma(moduleGrantedQualities, [], negativeQualities);
    // sinner-national(5) + sinner-corporate(25) + prejudiced(3) = 33
    expect(result.totalNegativeKarma).toBe(33);
    expect(result.boughtOffKarma).toBe(0);
    expect(result.effectiveNegativeKarma).toBe(33);
  });

  it("subtracts bought-off quality karma from effective total", () => {
    const result = getEffectiveNegativeQualityKarma(
      moduleGrantedQualities,
      ["sinner-national"],
      negativeQualities
    );
    // total: 33, bought off: 5, effective: 28
    expect(result.totalNegativeKarma).toBe(33);
    expect(result.boughtOffKarma).toBe(5);
    expect(result.effectiveNegativeKarma).toBe(28);
  });

  it("handles buying off multiple qualities", () => {
    const result = getEffectiveNegativeQualityKarma(
      moduleGrantedQualities,
      ["sinner-national", "prejudiced-common-biased"],
      negativeQualities
    );
    // total: 33, bought off: 5+3=8, effective: 25
    expect(result.totalNegativeKarma).toBe(33);
    expect(result.boughtOffKarma).toBe(8);
    expect(result.effectiveNegativeKarma).toBe(25);
  });

  it("returns zeros for no negative qualities", () => {
    const positiveOnly: readonly LifeModuleQualityGrant[] = [{ id: "toughness", type: "positive" }];
    const result = getEffectiveNegativeQualityKarma(positiveOnly, [], negativeQualities);
    expect(result.totalNegativeKarma).toBe(0);
    expect(result.boughtOffKarma).toBe(0);
    expect(result.effectiveNegativeKarma).toBe(0);
  });

  it("ignores buy-off IDs not in the granted negatives", () => {
    const result = getEffectiveNegativeQualityKarma(
      moduleGrantedQualities,
      ["nonexistent-quality"],
      negativeQualities
    );
    expect(result.totalNegativeKarma).toBe(33);
    expect(result.boughtOffKarma).toBe(0);
    expect(result.effectiveNegativeKarma).toBe(33);
  });

  it("handles quality not found in catalog gracefully", () => {
    const grants: readonly LifeModuleQualityGrant[] = [{ id: "unknown-quality", type: "negative" }];
    const result = getEffectiveNegativeQualityKarma(grants, [], negativeQualities);
    // unknown quality not in catalog → 0 karma
    expect(result.totalNegativeKarma).toBe(0);
    expect(result.effectiveNegativeKarma).toBe(0);
  });
});
