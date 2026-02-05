/**
 * Budget Calculator Tests
 *
 * Unit tests for server-side budget calculation functions.
 * Tests cover all 15 nuyen categories and 8 karma sources.
 */

import { describe, it, expect } from "vitest";
import {
  calculateNuyenSpent,
  calculateKarmaSpent,
  KARMA_TO_NUYEN_LIMIT,
  SR5_KARMA_BUDGET,
} from "../budget-calculator";
import type { CreationSelections } from "@/lib/types/creation-selections";

// =============================================================================
// TEST HELPERS
// =============================================================================

/**
 * Create selections with type override for testing.
 * Uses Record<string, unknown> to allow minimal test data.
 */
function sel(data: Record<string, unknown> = {}): CreationSelections {
  return data as CreationSelections;
}

/**
 * Create an empty budgets object for testing
 */
function createEmptyBudgets(): Record<string, unknown> {
  return {};
}

// =============================================================================
// NUYEN CALCULATION TESTS
// =============================================================================

describe("calculateNuyenSpent", () => {
  describe("empty selections", () => {
    it("returns zero for all categories when selections are empty", () => {
      const result = calculateNuyenSpent(sel());

      expect(result.total).toBe(0);
      expect(result.gear).toBe(0);
      expect(result.weapons).toBe(0);
      expect(result.armor).toBe(0);
      expect(result.cyberware).toBe(0);
      expect(result.bioware).toBe(0);
      expect(result.foci).toBe(0);
      expect(result.vehicles).toBe(0);
      expect(result.drones).toBe(0);
      expect(result.rccs).toBe(0);
      expect(result.autosofts).toBe(0);
      expect(result.lifestyles).toBe(0);
      expect(result.commlinks).toBe(0);
      expect(result.cyberdecks).toBe(0);
      expect(result.software).toBe(0);
      expect(result.identities).toBe(0);
    });

    it("returns zero when arrays are empty", () => {
      const result = calculateNuyenSpent(
        sel({
          gear: [],
          weapons: [],
          armor: [],
          cyberware: [],
          bioware: [],
          foci: [],
          vehicles: [],
          drones: [],
          rccs: [],
          autosofts: [],
          lifestyles: [],
          commlinks: [],
          cyberdecks: [],
          software: [],
          identities: [],
        })
      );

      expect(result.total).toBe(0);
    });
  });

  describe("gear calculations", () => {
    it("calculates gear cost with quantity", () => {
      const result = calculateNuyenSpent(sel({ gear: [{ cost: 100, quantity: 3 }] }));

      expect(result.gear).toBe(300);
      expect(result.total).toBe(300);
    });

    it("defaults quantity to 1 if not specified", () => {
      const result = calculateNuyenSpent(sel({ gear: [{ cost: 250, quantity: 1 }] }));

      expect(result.gear).toBe(250);
    });

    it("includes gear modifications cost", () => {
      const result = calculateNuyenSpent(
        sel({
          gear: [{ cost: 100, quantity: 1, modifications: [{ cost: 50 }, { cost: 25 }] }],
        })
      );

      expect(result.gear).toBe(175); // 100 + 50 + 25
    });

    it("handles multiple gear items", () => {
      const result = calculateNuyenSpent(
        sel({
          gear: [
            { cost: 100, quantity: 2 },
            { cost: 50, quantity: 1 },
          ],
        })
      );

      expect(result.gear).toBe(250); // (100 * 2) + 50
    });
  });

  describe("weapons calculations", () => {
    it("calculates weapon cost with quantity", () => {
      const result = calculateNuyenSpent(sel({ weapons: [{ cost: 500, quantity: 2 }] }));

      expect(result.weapons).toBe(1000);
    });

    it("includes weapon modifications", () => {
      const result = calculateNuyenSpent(
        sel({
          weapons: [{ cost: 350, quantity: 1, modifications: [{ cost: 100 }, { cost: 75 }] }],
        })
      );

      expect(result.weapons).toBe(525); // 350 + 100 + 75
    });

    it("includes ammunition cost", () => {
      const result = calculateNuyenSpent(
        sel({
          weapons: [
            {
              cost: 200,
              quantity: 1,
              purchasedAmmunition: [
                { cost: 10, quantity: 100 },
                { cost: 20, quantity: 50 },
              ],
            },
          ],
        })
      );

      expect(result.weapons).toBe(2200); // 200 + (10 * 100) + (20 * 50)
    });
  });

  describe("armor calculations", () => {
    it("calculates armor cost with quantity", () => {
      const result = calculateNuyenSpent(sel({ armor: [{ cost: 500, quantity: 1 }] }));

      expect(result.armor).toBe(500);
    });

    it("includes armor modifications", () => {
      const result = calculateNuyenSpent(
        sel({ armor: [{ cost: 1000, quantity: 1, modifications: [{ cost: 200 }] }] })
      );

      expect(result.armor).toBe(1200);
    });
  });

  describe("cyberware calculations", () => {
    it("calculates cyberware cost", () => {
      const result = calculateNuyenSpent(sel({ cyberware: [{ cost: 5000 }] }));

      expect(result.cyberware).toBe(5000);
    });

    it("includes cyberware enhancements", () => {
      const result = calculateNuyenSpent(
        sel({ cyberware: [{ cost: 3000, enhancements: [{ cost: 500 }, { cost: 750 }] }] })
      );

      expect(result.cyberware).toBe(4250); // 3000 + 500 + 750
    });

    it("handles missing cost gracefully", () => {
      const result = calculateNuyenSpent(sel({ cyberware: [{ cost: 0 }] }));

      expect(result.cyberware).toBe(0);
    });
  });

  describe("bioware calculations", () => {
    it("calculates bioware cost", () => {
      const result = calculateNuyenSpent(sel({ bioware: [{ cost: 2500 }, { cost: 1500 }] }));

      expect(result.bioware).toBe(4000);
    });
  });

  describe("foci calculations", () => {
    it("calculates foci cost", () => {
      const result = calculateNuyenSpent(sel({ foci: [{ cost: 3000 }, { cost: 6000 }] }));

      expect(result.foci).toBe(9000);
    });
  });

  describe("vehicles calculations", () => {
    it("calculates vehicle cost with quantity", () => {
      const result = calculateNuyenSpent(sel({ vehicles: [{ cost: 25000, quantity: 1 }] }));

      expect(result.vehicles).toBe(25000);
    });

    it("includes vehicle modifications", () => {
      const result = calculateNuyenSpent(
        sel({
          vehicles: [{ cost: 15000, quantity: 1, modifications: [{ cost: 2000 }, { cost: 1500 }] }],
        })
      );

      expect(result.vehicles).toBe(18500);
    });
  });

  describe("drones, RCCs, autosofts calculations", () => {
    it("calculates drone cost", () => {
      const result = calculateNuyenSpent(sel({ drones: [{ cost: 5000 }, { cost: 3000 }] }));

      expect(result.drones).toBe(8000);
    });

    it("calculates RCC cost", () => {
      const result = calculateNuyenSpent(sel({ rccs: [{ cost: 10000 }] }));

      expect(result.rccs).toBe(10000);
    });

    it("calculates autosoft cost", () => {
      const result = calculateNuyenSpent(sel({ autosofts: [{ cost: 500 }, { cost: 750 }] }));

      expect(result.autosofts).toBe(1250);
    });
  });

  describe("lifestyle calculations", () => {
    it("calculates lifestyle cost with prepaid months", () => {
      const result = calculateNuyenSpent(
        sel({ lifestyles: [{ monthlyCost: 5000, prepaidMonths: 3 }] })
      );

      expect(result.lifestyles).toBe(15000);
    });

    it("defaults to 1 month if prepaidMonths not specified", () => {
      const result = calculateNuyenSpent(sel({ lifestyles: [{ monthlyCost: 2000 }] }));

      expect(result.lifestyles).toBe(2000);
    });
  });

  describe("matrix gear calculations", () => {
    it("calculates commlink cost", () => {
      const result = calculateNuyenSpent(sel({ commlinks: [{ cost: 200 }, { cost: 500 }] }));

      expect(result.commlinks).toBe(700);
    });

    it("calculates cyberdeck cost", () => {
      const result = calculateNuyenSpent(sel({ cyberdecks: [{ cost: 50000 }] }));

      expect(result.cyberdecks).toBe(50000);
    });

    it("calculates software cost", () => {
      const result = calculateNuyenSpent(sel({ software: [{ cost: 250 }, { cost: 500 }] }));

      expect(result.software).toBe(750);
    });
  });

  describe("identity calculations", () => {
    it("calculates fake SIN cost (rating × 2,500¥)", () => {
      const result = calculateNuyenSpent(
        sel({ identities: [{ sin: { type: "fake", rating: 4 }, licenses: [] }] })
      );

      expect(result.identities).toBe(10000); // 4 × 2,500
    });

    it("calculates fake license cost (rating × 200¥)", () => {
      const result = calculateNuyenSpent(
        sel({
          identities: [
            {
              sin: { type: "fake", rating: 2 },
              licenses: [
                { type: "fake", rating: 4 },
                { type: "fake", rating: 3 },
              ],
            },
          ],
        })
      );

      // SIN: 2 × 2,500 = 5,000
      // Licenses: 4 × 200 + 3 × 200 = 800 + 600 = 1,400
      expect(result.identities).toBe(6400);
    });

    it("ignores non-fake SINs and licenses", () => {
      const result = calculateNuyenSpent(
        sel({
          identities: [
            {
              sin: { type: "real", rating: 6 },
              licenses: [{ type: "real", rating: 4 }],
            },
          ],
        })
      );

      expect(result.identities).toBe(0);
    });
  });

  describe("total calculations", () => {
    it("sums all categories correctly", () => {
      const result = calculateNuyenSpent(
        sel({
          gear: [{ cost: 100, quantity: 1 }],
          weapons: [{ cost: 200, quantity: 1 }],
          armor: [{ cost: 300, quantity: 1 }],
          cyberware: [{ cost: 400 }],
          bioware: [{ cost: 500 }],
          foci: [{ cost: 600 }],
          vehicles: [{ cost: 700, quantity: 1 }],
          drones: [{ cost: 800 }],
          rccs: [{ cost: 900 }],
          autosofts: [{ cost: 1000 }],
          lifestyles: [{ monthlyCost: 1100, prepaidMonths: 1 }],
          commlinks: [{ cost: 1200 }],
          cyberdecks: [{ cost: 1300 }],
          software: [{ cost: 1400 }],
          identities: [{ sin: { type: "fake", rating: 2 }, licenses: [] }], // 5000
        })
      );

      // 100+200+300+400+500+600+700+800+900+1000+1100+1200+1300+1400+5000 = 15500
      expect(result.total).toBe(15500);
    });
  });
});

// =============================================================================
// KARMA CALCULATION TESTS
// =============================================================================

describe("calculateKarmaSpent", () => {
  describe("empty selections", () => {
    it("returns zero for all sources when selections and budgets are empty", () => {
      const result = calculateKarmaSpent(sel(), createEmptyBudgets());

      expect(result.total).toBe(0);
      expect(result.positiveQualities).toBe(0);
      expect(result.negativeQualities).toBe(0);
      expect(result.karmaToNuyen).toBe(0);
      expect(result.spells).toBe(0);
      expect(result.powerPoints).toBe(0);
      expect(result.attributes).toBe(0);
      expect(result.foci).toBe(0);
      expect(result.skills).toBe(0);
      expect(result.contacts).toBe(0);
    });
  });

  describe("quality karma calculations", () => {
    it("calculates positive quality karma from selections with karma field", () => {
      const result = calculateKarmaSpent(
        sel({
          positiveQualities: [
            { id: "quality1", karma: 10 },
            { id: "quality2", karma: 15 },
          ],
        }),
        createEmptyBudgets()
      );

      expect(result.positiveQualities).toBe(25);
    });

    it("uses originalKarma if karma is undefined", () => {
      const result = calculateKarmaSpent(
        sel({ positiveQualities: [{ id: "quality1", originalKarma: 8 }] }),
        createEmptyBudgets()
      );

      expect(result.positiveQualities).toBe(8);
    });

    it("falls back to budgets when qualities lack karma field", () => {
      const result = calculateKarmaSpent(sel({ positiveQualities: [{ id: "quality1" }] }), {
        "karma-spent-positive": 20,
      });

      expect(result.positiveQualities).toBe(20);
    });

    it("calculates negative quality karma (gives karma back)", () => {
      const result = calculateKarmaSpent(
        sel({
          negativeQualities: [
            { id: "neg1", karma: 5 },
            { id: "neg2", karma: 10 },
          ],
        }),
        createEmptyBudgets()
      );

      expect(result.negativeQualities).toBe(15);
      // Negative qualities subtract from total
      expect(result.total).toBe(-15);
    });
  });

  describe("karma-to-nuyen conversion", () => {
    it("gets conversion from budgets", () => {
      const result = calculateKarmaSpent(sel(), { "karma-spent-gear": 5 });

      expect(result.karmaToNuyen).toBe(5);
      expect(result.total).toBe(5);
    });
  });

  describe("other karma sources", () => {
    it("gets spells karma from budgets", () => {
      const result = calculateKarmaSpent(sel(), { "karma-spent-spells": 10 });

      expect(result.spells).toBe(10);
    });

    it("gets power points karma from budgets", () => {
      const result = calculateKarmaSpent(sel(), { "karma-spent-power-points": 5 });

      expect(result.powerPoints).toBe(5);
    });

    it("gets attributes karma from budgets", () => {
      const result = calculateKarmaSpent(sel(), { "karma-spent-attributes": 25 });

      expect(result.attributes).toBe(25);
    });

    it("gets foci karma from budgets", () => {
      const result = calculateKarmaSpent(sel(), { "karma-spent-foci": 8 });

      expect(result.foci).toBe(8);
    });
  });

  describe("contact karma calculations", () => {
    it("calculates contact overflow karma (total cost - CHA×3)", () => {
      const result = calculateKarmaSpent(
        sel({
          attributes: { charisma: 3 }, // Free pool = 9
          contacts: [
            { connection: 4, loyalty: 3 }, // 7 points
            { connection: 3, loyalty: 2 }, // 5 points
          ],
        }),
        createEmptyBudgets()
      );

      // Total cost: 7 + 5 = 12
      // Free pool: 3 × 3 = 9
      // Overflow: 12 - 9 = 3
      expect(result.contacts).toBe(3);
    });

    it("returns zero when within free pool", () => {
      const result = calculateKarmaSpent(
        sel({
          attributes: { charisma: 5 }, // Free pool = 15
          contacts: [{ connection: 3, loyalty: 2 }], // 5 points
        }),
        createEmptyBudgets()
      );

      expect(result.contacts).toBe(0);
    });

    it("defaults charisma to 1 when not set", () => {
      const result = calculateKarmaSpent(
        sel({ contacts: [{ connection: 3, loyalty: 2 }] }), // 5 points
        createEmptyBudgets()
      );

      // Free pool: 1 × 3 = 3
      // Overflow: 5 - 3 = 2
      expect(result.contacts).toBe(2);
    });
  });

  describe("skill karma calculations", () => {
    it("calculates skill karma from skillKarmaSpent", () => {
      const result = calculateKarmaSpent(
        sel({
          skillKarmaSpent: {
            skillRaises: { pistols: 10, athletics: 5 },
            specializations: 7,
            skillRatingPoints: 0,
          },
        }),
        createEmptyBudgets()
      );

      expect(result.skills).toBe(22); // 10 + 5 + 7
    });

    it("includes group raises in skill karma", () => {
      const result = calculateKarmaSpent(
        sel({
          skillKarmaSpent: {
            skillRaises: { pistols: 5 },
            specializations: 0,
            skillRatingPoints: 0,
            groupRaises: { firearms: 10 },
          },
        }),
        createEmptyBudgets()
      );

      expect(result.skills).toBe(15); // 5 + 0 + 10
    });

    it("falls back to budgets when skillKarmaSpent not present", () => {
      const result = calculateKarmaSpent(sel(), { "karma-spent-skills": 12 });

      expect(result.skills).toBe(12);
    });
  });

  describe("total calculations", () => {
    it("calculates net karma correctly (positive - negative)", () => {
      const result = calculateKarmaSpent(
        sel({
          positiveQualities: [{ id: "pos", karma: 15 }],
          negativeQualities: [{ id: "neg", karma: 10 }],
        }),
        createEmptyBudgets()
      );

      // Net = 15 (positive) - 10 (negative) = 5
      expect(result.total).toBe(5);
    });

    it("sums all karma sources correctly", () => {
      const result = calculateKarmaSpent(
        sel({
          attributes: { charisma: 1 },
          positiveQualities: [{ id: "pos", karma: 10 }],
          negativeQualities: [{ id: "neg", karma: 5 }],
          contacts: [{ connection: 2, loyalty: 2 }], // 4 - 3 = 1 overflow
          skillKarmaSpent: {
            skillRaises: { pistols: 3 },
            specializations: 7,
            skillRatingPoints: 0,
          },
        }),
        {
          "karma-spent-gear": 2,
          "karma-spent-spells": 4,
          "karma-spent-power-points": 1,
          "karma-spent-attributes": 5,
          "karma-spent-foci": 3,
        }
      );

      // positiveQualities: 10
      // negativeQualities: -5
      // karmaToNuyen: 2
      // spells: 4
      // powerPoints: 1
      // attributes: 5
      // foci: 3
      // skills: 3 + 7 = 10
      // contacts: 1
      // Total: 10 - 5 + 2 + 4 + 1 + 5 + 3 + 10 + 1 = 31
      expect(result.total).toBe(31);
    });
  });

  describe("constants", () => {
    it("exports correct karma-to-nuyen limit", () => {
      expect(KARMA_TO_NUYEN_LIMIT).toBe(10);
    });

    it("exports correct SR5 karma budget", () => {
      expect(SR5_KARMA_BUDGET).toBe(25);
    });
  });
});
