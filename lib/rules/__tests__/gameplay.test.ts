/**
 * Tests for gameplay rating utilities
 *
 * Tests for effective rating calculations and gameplay effects.
 */

import { describe, it, expect } from "vitest";
import {
  getEffectiveRating,
  getRatingDiceBonus,
  getItemDiceBonus,
  getRatingThreshold,
  getEffectiveThreshold,
  getPerceptionBonus,
  getDefenseBonus,
  getAttackBonus,
} from "../gameplay";
import type { EffectiveRatingContext } from "../gameplay";

// =============================================================================
// EFFECTIVE RATING CALCULATIONS
// =============================================================================

describe("getEffectiveRating", () => {
  it("should return base rating when no context provided", () => {
    const item = { rating: 5 };
    expect(getEffectiveRating(item)).toBe(5);
  });

  it("should return 0 when rating is undefined", () => {
    const item = {};
    expect(getEffectiveRating(item)).toBe(0);
  });

  it("should apply wireless bonus when enabled", () => {
    const item = {
      rating: 3,
      wirelessBonus: "+Rating to Perception",
    };

    const context: EffectiveRatingContext = {
      wirelessEnabled: true,
    };

    // parseWirelessBonus returns 1 for "+Rating" pattern
    const result = getEffectiveRating(item, context);
    expect(result).toBe(4); // 3 + 1
  });

  it("should apply custom wireless bonus value", () => {
    const item = {
      rating: 3,
      wirelessBonus: "some description",
    };

    const context: EffectiveRatingContext = {
      wirelessEnabled: true,
      wirelessBonusValue: 2,
    };

    expect(getEffectiveRating(item, context)).toBe(5); // 3 + 2
  });

  it("should not apply wireless bonus when disabled", () => {
    const item = {
      rating: 3,
      wirelessBonus: "+Rating",
    };

    const context: EffectiveRatingContext = {
      wirelessEnabled: false,
    };

    expect(getEffectiveRating(item, context)).toBe(3);
  });

  it("should reduce rating based on Matrix damage", () => {
    const item = { rating: 6 };

    const context: EffectiveRatingContext = {
      matrixDamage: 3,
    };

    // Floor(3 / 3) = 1 reduction
    expect(getEffectiveRating(item, context)).toBe(5);
  });

  it("should reduce rating by correct amount for Matrix damage", () => {
    const item = { rating: 6 };

    const context: EffectiveRatingContext = {
      matrixDamage: 7,
    };

    // Floor(7 / 3) = 2 reduction
    expect(getEffectiveRating(item, context)).toBe(4);
  });

  it("should not reduce rating below 0 from Matrix damage", () => {
    const item = { rating: 2 };

    const context: EffectiveRatingContext = {
      matrixDamage: 10,
    };

    // Floor(10 / 3) = 3, but rating can't go below 0
    expect(getEffectiveRating(item, context)).toBe(0);
  });

  it("should apply environmental modifier", () => {
    const item = { rating: 4 };

    const context: EffectiveRatingContext = {
      environmentalModifier: 1,
    };

    expect(getEffectiveRating(item, context)).toBe(5);
  });

  it("should apply negative environmental modifier", () => {
    const item = { rating: 5 };

    const context: EffectiveRatingContext = {
      environmentalModifier: -2,
    };

    expect(getEffectiveRating(item, context)).toBe(3);
  });

  it("should not reduce rating below 0 from environmental modifier", () => {
    const item = { rating: 2 };

    const context: EffectiveRatingContext = {
      environmentalModifier: -5,
    };

    expect(getEffectiveRating(item, context)).toBe(0);
  });

  it("should combine all modifiers correctly", () => {
    const item = {
      rating: 4,
      wirelessBonus: "+Rating",
    };

    const context: EffectiveRatingContext = {
      wirelessEnabled: true,
      wirelessBonusValue: 1,
      matrixDamage: 3,
      environmentalModifier: 2,
    };

    // 4 (base) + 1 (wireless) - 1 (damage) + 2 (env) = 6
    expect(getEffectiveRating(item, context)).toBe(6);
  });

  it("should handle zero Matrix damage", () => {
    const item = { rating: 5 };

    const context: EffectiveRatingContext = {
      matrixDamage: 0,
    };

    expect(getEffectiveRating(item, context)).toBe(5);
  });
});

// =============================================================================
// DICE POOL BONUSES
// =============================================================================

describe("getRatingDiceBonus", () => {
  it("should return rating as bonus for all types", () => {
    const item = { rating: 3 };

    expect(getRatingDiceBonus(item, "perception")).toBe(3);
    expect(getRatingDiceBonus(item, "defense")).toBe(3);
    expect(getRatingDiceBonus(item, "attack")).toBe(3);
    expect(getRatingDiceBonus(item, "limit")).toBe(3);
  });

  it("should return 0 when rating is undefined", () => {
    const item = {};

    expect(getRatingDiceBonus(item, "perception")).toBe(0);
  });
});

describe("getItemDiceBonus", () => {
  it("should use effective rating when context provided", () => {
    const item = {
      rating: 3,
      wirelessBonus: "+Rating",
    };

    const context: EffectiveRatingContext = {
      wirelessEnabled: true,
      wirelessBonusValue: 1,
    };

    // Effective rating = 4, so bonus = 4
    expect(getItemDiceBonus(item, "perception", context)).toBe(4);
  });

  it("should use base rating when context not provided", () => {
    const item = { rating: 3 };
    expect(getItemDiceBonus(item, "perception")).toBe(3);
  });
});

describe("convenience helpers", () => {
  const item = {
    rating: 4,
    wirelessBonus: "+Rating",
  };

  const context: EffectiveRatingContext = {
    wirelessEnabled: true,
    wirelessBonusValue: 1,
  };

  it("getPerceptionBonus should return perception bonus", () => {
    expect(getPerceptionBonus(item, context)).toBe(5); // 4 + 1
  });

  it("getDefenseBonus should return defense bonus", () => {
    expect(getDefenseBonus(item, context)).toBe(5); // 4 + 1
  });

  it("getAttackBonus should return attack bonus", () => {
    expect(getAttackBonus(item, context)).toBe(5); // 4 + 1
  });

  it("should use base rating when context not provided", () => {
    expect(getPerceptionBonus(item)).toBe(4);
    expect(getDefenseBonus(item)).toBe(4);
    expect(getAttackBonus(item)).toBe(4);
  });
});

// =============================================================================
// TEST THRESHOLDS
// =============================================================================

describe("getRatingThreshold", () => {
  it("should return rating for detect tests", () => {
    const item = { rating: 4 };
    expect(getRatingThreshold(item, "detect")).toBe(4);
  });

  it("should return rating × 2 for analyze tests", () => {
    const item = { rating: 4 };
    expect(getRatingThreshold(item, "analyze")).toBe(8);
  });

  it("should return rating + 2 for bypass tests", () => {
    const item = { rating: 4 };
    expect(getRatingThreshold(item, "bypass")).toBe(6);
  });

  it("should handle zero rating", () => {
    const item = { rating: 0 };
    expect(getRatingThreshold(item, "detect")).toBe(0);
    expect(getRatingThreshold(item, "analyze")).toBe(0);
    expect(getRatingThreshold(item, "bypass")).toBe(2);
  });
});

describe("getEffectiveThreshold", () => {
  it("should use effective rating for threshold calculation", () => {
    const item = {
      rating: 3,
      wirelessBonus: "+Rating",
    };

    const context: EffectiveRatingContext = {
      wirelessEnabled: true,
      wirelessBonusValue: 1,
    };

    // Effective rating = 4, so detect threshold = 4
    expect(getEffectiveThreshold(item, "detect", context)).toBe(4);
    // Analyze threshold = 4 × 2 = 8
    expect(getEffectiveThreshold(item, "analyze", context)).toBe(8);
    // Bypass threshold = 4 + 2 = 6
    expect(getEffectiveThreshold(item, "bypass", context)).toBe(6);
  });

  it("should use base rating when context not provided", () => {
    const item = { rating: 5 };
    expect(getEffectiveThreshold(item, "detect")).toBe(5);
    expect(getEffectiveThreshold(item, "analyze")).toBe(10);
    expect(getEffectiveThreshold(item, "bypass")).toBe(7);
  });

  it("should handle Matrix damage reducing threshold", () => {
    const item = { rating: 6 };

    const context: EffectiveRatingContext = {
      matrixDamage: 6, // Reduces by Floor(6/3) = 2
    };

    // Effective rating = 4, so analyze = 8
    expect(getEffectiveThreshold(item, "analyze", context)).toBe(8);
  });
});
