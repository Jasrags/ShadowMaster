/**
 * Tests for payment mechanics (Run Faster pp. 174, 178, 180)
 *
 * Covers corporate scrip exchange rates, barter value modifiers,
 * and the 2D6 payment preference table.
 */

import { describe, it, expect } from "vitest";
import {
  getScripExchangeRate,
  getScripExchangeRates,
  convertNuyenToScrip,
  convertScripToNuyen,
  calculateBarterValue,
  getPaymentPreference,
  getPaymentPreferenceTable,
  type ScripExchangeRate,
  type BarterModifiers,
} from "../payment-mechanics";

// =============================================================================
// CORPORATE SCRIP EXCHANGE RATES
// =============================================================================

describe("getScripExchangeRates", () => {
  it("should return all 9 corporate scrip rates", () => {
    const rates = getScripExchangeRates();
    expect(rates).toHaveLength(9);
  });

  it("should include Saeder-Krupp with best rate (0.8:1)", () => {
    const rates = getScripExchangeRates();
    const sk = rates.find((r) => r.id === "saeder-krupp");
    expect(sk).toBeDefined();
    expect(sk!.rateToOneNuyen).toBe(0.8);
  });

  it("should include Aztechnology with worst rate (20:1)", () => {
    const rates = getScripExchangeRates();
    const aztech = rates.find((r) => r.id === "aztechnology");
    expect(aztech).toBeDefined();
    expect(aztech!.rateToOneNuyen).toBe(20);
  });
});

describe("getScripExchangeRate", () => {
  it("should return rate by corporation ID", () => {
    const rate = getScripExchangeRate("shiawase");
    expect(rate).toBeDefined();
    expect(rate!.rateToOneNuyen).toBe(1);
  });

  it("should return undefined for unknown corporation", () => {
    expect(getScripExchangeRate("unknown-corp")).toBeUndefined();
  });
});

describe("convertNuyenToScrip", () => {
  it("should convert nuyen to scrip using exchange rate", () => {
    // 100¥ at 0.8:1 (Saeder-Krupp) = 80 scrip
    expect(convertNuyenToScrip(100, 0.8)).toBe(80);
  });

  it("should handle 1:1 rate (Shiawase)", () => {
    expect(convertNuyenToScrip(500, 1)).toBe(500);
  });

  it("should handle high exchange rates (Aztechnology 20:1)", () => {
    // 100¥ at 20:1 = 2000 scrip
    expect(convertNuyenToScrip(100, 20)).toBe(2000);
  });

  it("should return 0 for 0 nuyen", () => {
    expect(convertNuyenToScrip(0, 5)).toBe(0);
  });

  it("should throw for non-positive rate", () => {
    expect(() => convertNuyenToScrip(100, 0)).toThrow("rateToOneNuyen must be positive");
    expect(() => convertNuyenToScrip(100, -1)).toThrow("rateToOneNuyen must be positive");
  });
});

describe("convertScripToNuyen", () => {
  it("should convert scrip to nuyen using exchange rate", () => {
    // 80 scrip at 0.8:1 (Saeder-Krupp) = 100¥
    expect(convertScripToNuyen(80, 0.8)).toBe(100);
  });

  it("should handle 1:1 rate", () => {
    expect(convertScripToNuyen(500, 1)).toBe(500);
  });

  it("should handle high exchange rates (Aztechnology 20:1)", () => {
    // 2000 scrip at 20:1 = 100¥
    expect(convertScripToNuyen(2000, 20)).toBe(100);
  });

  it("should return 0 for 0 scrip", () => {
    expect(convertScripToNuyen(0, 5)).toBe(0);
  });

  it("should throw for division by zero rate", () => {
    expect(() => convertScripToNuyen(100, 0)).toThrow("rateToOneNuyen must be positive");
  });
});

// =============================================================================
// BARTER VALUE MODIFIERS
// =============================================================================

describe("calculateBarterValue", () => {
  it("should return base value with no modifiers", () => {
    expect(calculateBarterValue(1000, {})).toBe(1000);
  });

  it("should apply vintage modifier (+1% per decade, max 10%)", () => {
    // 2 decades = +2%
    expect(calculateBarterValue(1000, { vintageDecades: 2 })).toBe(1020);
  });

  it("should cap vintage at 10% (10 decades)", () => {
    expect(calculateBarterValue(1000, { vintageDecades: 15 })).toBe(1100);
  });

  it("should apply provenance 2x for recent/living", () => {
    expect(calculateBarterValue(1000, { provenance: "recent" })).toBe(2000);
  });

  it("should apply provenance 3x for historical/deceased", () => {
    expect(calculateBarterValue(1000, { provenance: "historical" })).toBe(3000);
  });

  it("should apply master crafted +20%", () => {
    expect(calculateBarterValue(1000, { masterCrafted: true })).toBe(1200);
  });

  it("should stack modifiers multiplicatively", () => {
    // 1000 base × 1.02 (vintage 2 decades) × 2 (provenance recent) × 1.2 (master crafted)
    const result = calculateBarterValue(1000, {
      vintageDecades: 2,
      provenance: "recent",
      masterCrafted: true,
    });
    expect(result).toBe(2448);
  });

  it("should handle 0 base value", () => {
    expect(calculateBarterValue(0, { masterCrafted: true })).toBe(0);
  });

  it("should handle 0 vintage decades", () => {
    expect(calculateBarterValue(1000, { vintageDecades: 0 })).toBe(1000);
  });

  it("should apply +1% for exactly 1 decade", () => {
    expect(calculateBarterValue(1000, { vintageDecades: 1 })).toBe(1010);
  });

  it("should cap at exactly 10% for 10 decades", () => {
    expect(calculateBarterValue(1000, { vintageDecades: 10 })).toBe(1100);
  });

  it("should throw for negative base value", () => {
    expect(() => calculateBarterValue(-500, {})).toThrow("baseValue must be non-negative");
  });

  it("should throw for NaN base value", () => {
    expect(() => calculateBarterValue(NaN, {})).toThrow("baseValue must be non-negative");
  });
});

// =============================================================================
// PAYMENT PREFERENCE TABLE (2D6)
// =============================================================================

describe("getPaymentPreferenceTable", () => {
  it("should return 11 entries (2D6 range 2-12)", () => {
    const table = getPaymentPreferenceTable();
    expect(table).toHaveLength(11);
  });

  it("should cover all rolls from 2 to 12", () => {
    const table = getPaymentPreferenceTable();
    const rolls = table.map((e) => e.roll);
    for (let i = 2; i <= 12; i++) {
      expect(rolls).toContain(i);
    }
  });
});

describe("getPaymentPreference", () => {
  it("should return cash-credstick for roll 7 (most common)", () => {
    const pref = getPaymentPreference(7);
    expect(pref).toBeDefined();
    expect(pref!.paymentType).toBe("cash-credstick");
  });

  it("should return cash-credstick for roll 8", () => {
    const pref = getPaymentPreference(8);
    expect(pref!.paymentType).toBe("cash-credstick");
  });

  it("should return cash-hard-currency for roll 2", () => {
    const pref = getPaymentPreference(2);
    expect(pref!.paymentType).toBe("cash-hard-currency");
  });

  it("should return cash-corporate-scrip for roll 4", () => {
    const pref = getPaymentPreference(4);
    expect(pref!.paymentType).toBe("cash-corporate-scrip");
  });

  it("should return cash-hard-currency for roll 12 (foreign electronic currency)", () => {
    const pref = getPaymentPreference(12);
    expect(pref!.paymentType).toBe("cash-hard-currency");
  });

  it("should return undefined for invalid rolls", () => {
    expect(getPaymentPreference(1)).toBeUndefined();
    expect(getPaymentPreference(13)).toBeUndefined();
  });
});
