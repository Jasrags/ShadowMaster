/**
 * Tests for calculateLifestyleMonthlyCost helper
 */

import { describe, test, expect } from "vitest";
import { calculateLifestyleMonthlyCost } from "@/components/character/sheet/LifestylesDisplay";
import type { Lifestyle } from "@/lib/types";

function makeLifestyle(overrides: Partial<Lifestyle> = {}): Lifestyle {
  return {
    type: "medium",
    monthlyCost: 5000,
    ...overrides,
  };
}

describe("calculateLifestyleMonthlyCost", () => {
  test("returns base cost for lifestyle with no extras", () => {
    const ls = makeLifestyle();
    expect(calculateLifestyleMonthlyCost(ls)).toBe(5000);
  });

  test("uses monthlyCost from the lifestyle object", () => {
    const ls = makeLifestyle({ type: "low", monthlyCost: 2000 });
    expect(calculateLifestyleMonthlyCost(ls)).toBe(2000);
  });

  test("adds positive percentage modification", () => {
    const ls = makeLifestyle({
      modifications: [
        {
          name: "Garage",
          type: "positive",
          modifier: 10,
          modifierType: "percentage",
        },
      ],
    });
    // medium base = 5000, +10% = +500
    expect(calculateLifestyleMonthlyCost(ls)).toBe(5500);
  });

  test("subtracts negative percentage modification", () => {
    const ls = makeLifestyle({
      modifications: [
        {
          name: "Cramped",
          type: "negative",
          modifier: 10,
          modifierType: "percentage",
        },
      ],
    });
    // medium base = 5000, -10% = -500
    expect(calculateLifestyleMonthlyCost(ls)).toBe(4500);
  });

  test("handles fixed modifier", () => {
    const ls = makeLifestyle({
      modifications: [
        {
          name: "Special Work Area",
          type: "positive",
          modifier: 1000,
          modifierType: "flat",
        },
      ],
    });
    expect(calculateLifestyleMonthlyCost(ls)).toBe(6000);
  });

  test("includes subscription costs", () => {
    const ls = makeLifestyle({
      subscriptions: [
        { name: "DocWagon Basic", monthlyCost: 250, category: "medical" },
        { name: "Food Service", monthlyCost: 100, category: "food" },
      ],
    });
    expect(calculateLifestyleMonthlyCost(ls)).toBe(5350);
  });

  test("adds custom expenses and subtracts custom income", () => {
    const ls = makeLifestyle({
      customExpenses: 500,
      customIncome: 200,
    });
    expect(calculateLifestyleMonthlyCost(ls)).toBe(5300);
  });

  test("combines all cost components", () => {
    const ls = makeLifestyle({
      modifications: [
        {
          name: "Garage",
          type: "positive",
          modifier: 10,
          modifierType: "percentage",
        },
      ],
      subscriptions: [{ name: "DocWagon", monthlyCost: 250 }],
      customExpenses: 100,
      customIncome: 50,
    });
    // 5000 + 500 (10%) + 250 + 100 - 50 = 5800
    expect(calculateLifestyleMonthlyCost(ls)).toBe(5800);
  });

  test("floors at zero when deductions exceed cost", () => {
    const ls = makeLifestyle({
      type: "squatter",
      monthlyCost: 500,
      customIncome: 10000,
    });
    expect(calculateLifestyleMonthlyCost(ls)).toBe(0);
  });

  test("street lifestyle has zero base cost", () => {
    const ls = makeLifestyle({ type: "street", monthlyCost: 0 });
    expect(calculateLifestyleMonthlyCost(ls)).toBe(0);
  });
});
