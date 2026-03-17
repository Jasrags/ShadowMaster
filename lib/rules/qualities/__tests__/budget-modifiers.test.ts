import { describe, it, expect } from "vitest";
import type { CreationSelections, SelectedQuality } from "@/lib/types";
import {
  getQualityBudgetModifiers,
  applyJackOfAllTradesModifier,
  FRIENDS_IN_HIGH_PLACES,
  MADE_MAN,
  SENSEI,
  RESTRICTED_GEAR,
  BLACK_MARKET_PIPELINE,
} from "../budget-modifiers";

// =============================================================================
// HELPERS
// =============================================================================

function makeSelections(positiveQualities: (string | SelectedQuality)[] = []): CreationSelections {
  return { positiveQualities } as CreationSelections;
}

// =============================================================================
// getQualityBudgetModifiers
// =============================================================================

describe("getQualityBudgetModifiers", () => {
  it("returns defaults when no qualities selected", () => {
    const result = getQualityBudgetModifiers({} as CreationSelections);
    expect(result).toEqual({
      karmaToNuyenCap: 10,
      knowledgeCostMultipliers: { academic: 1, street: 1, professional: 1, interests: 1 },
      languageCostMultiplier: 1,
      jackOfAllTrades: false,
      friendsInHighPlaces: false,
      freeContacts: [],
      restrictedGear: false,
      blackMarketPipeline: null,
    });
  });

  it("returns defaults for empty quality array", () => {
    const result = getQualityBudgetModifiers(makeSelections([]));
    expect(result.karmaToNuyenCap).toBe(10);
    expect(result.jackOfAllTrades).toBe(false);
  });

  it("returns defaults for unrelated qualities", () => {
    const result = getQualityBudgetModifiers(
      makeSelections(["ambidextrous", "exceptional-attribute"])
    );
    expect(result.karmaToNuyenCap).toBe(10);
    expect(result.languageCostMultiplier).toBe(1);
  });

  // Born Rich
  it("Born Rich raises karma-to-nuyen cap to 40", () => {
    const result = getQualityBudgetModifiers(makeSelections(["born-rich"]));
    expect(result.karmaToNuyenCap).toBe(40);
  });

  // College Education
  it("College Education halves academic knowledge cost", () => {
    const result = getQualityBudgetModifiers(makeSelections(["college-education"]));
    expect(result.knowledgeCostMultipliers.academic).toBe(0.5);
    expect(result.knowledgeCostMultipliers.street).toBe(1);
    expect(result.knowledgeCostMultipliers.professional).toBe(1);
    expect(result.knowledgeCostMultipliers.interests).toBe(1);
  });

  // School of Hard Knocks
  it("School of Hard Knocks halves street knowledge cost", () => {
    const result = getQualityBudgetModifiers(makeSelections(["school-of-hard-knocks"]));
    expect(result.knowledgeCostMultipliers.street).toBe(0.5);
    expect(result.knowledgeCostMultipliers.academic).toBe(1);
  });

  // Technical School Education
  it("Technical School Education halves professional knowledge cost", () => {
    const result = getQualityBudgetModifiers(makeSelections(["technical-school-education"]));
    expect(result.knowledgeCostMultipliers.professional).toBe(0.5);
    expect(result.knowledgeCostMultipliers.academic).toBe(1);
  });

  // Linguist
  it("Linguist halves language cost", () => {
    const result = getQualityBudgetModifiers(makeSelections(["linguist"]));
    expect(result.languageCostMultiplier).toBe(0.5);
  });

  // Jack of All Trades
  it("Jack of All Trades sets flag", () => {
    const result = getQualityBudgetModifiers(makeSelections(["jack-of-all-trades"]));
    expect(result.jackOfAllTrades).toBe(true);
  });

  // Combinations
  it("handles multiple qualities together", () => {
    const result = getQualityBudgetModifiers(
      makeSelections([
        "born-rich",
        "college-education",
        "school-of-hard-knocks",
        "linguist",
        "jack-of-all-trades",
      ])
    );
    expect(result.karmaToNuyenCap).toBe(40);
    expect(result.knowledgeCostMultipliers.academic).toBe(0.5);
    expect(result.knowledgeCostMultipliers.street).toBe(0.5);
    expect(result.knowledgeCostMultipliers.professional).toBe(1);
    expect(result.languageCostMultiplier).toBe(0.5);
    expect(result.jackOfAllTrades).toBe(true);
  });

  // SelectedQuality format
  it("works with SelectedQuality objects", () => {
    const result = getQualityBudgetModifiers(
      makeSelections([
        { id: "born-rich", karma: 5 },
        { id: "linguist", karma: 4 },
      ])
    );
    expect(result.karmaToNuyenCap).toBe(40);
    expect(result.languageCostMultiplier).toBe(0.5);
  });

  // Mixed formats
  it("works with mixed string and SelectedQuality formats", () => {
    const result = getQualityBudgetModifiers(
      makeSelections(["college-education", { id: "jack-of-all-trades", karma: 2 }])
    );
    expect(result.knowledgeCostMultipliers.academic).toBe(0.5);
    expect(result.jackOfAllTrades).toBe(true);
  });

  // Friends in High Places
  it("Friends in High Places sets flag", () => {
    const result = getQualityBudgetModifiers(makeSelections([FRIENDS_IN_HIGH_PLACES]));
    expect(result.friendsInHighPlaces).toBe(true);
  });

  it("friendsInHighPlaces is false when not selected", () => {
    const result = getQualityBudgetModifiers(makeSelections(["born-rich"]));
    expect(result.friendsInHighPlaces).toBe(false);
  });

  // Made Man
  it("Made Man adds free syndicate contact (C2, L4)", () => {
    const result = getQualityBudgetModifiers(makeSelections([MADE_MAN]));
    expect(result.freeContacts).toHaveLength(1);
    expect(result.freeContacts[0]).toEqual({
      qualityId: MADE_MAN,
      name: "Syndicate Contact",
      connection: 2,
      loyalty: 4,
      type: "Syndicate",
      specification: undefined,
    });
  });

  it("Made Man uses specification in contact name", () => {
    const result = getQualityBudgetModifiers(
      makeSelections([{ id: MADE_MAN, specification: "Yakuza" }])
    );
    expect(result.freeContacts[0].name).toBe("Yakuza Contact");
    expect(result.freeContacts[0].specification).toBe("Yakuza");
  });

  // Sensei
  it("Sensei adds free training contact (C1, L1)", () => {
    const result = getQualityBudgetModifiers(makeSelections([SENSEI]));
    expect(result.freeContacts).toHaveLength(1);
    expect(result.freeContacts[0]).toEqual({
      qualityId: SENSEI,
      name: "Sensei",
      connection: 1,
      loyalty: 1,
      type: "Training",
      specification: undefined,
    });
  });

  it("Sensei uses specification in contact name", () => {
    const result = getQualityBudgetModifiers(
      makeSelections([{ id: SENSEI, specification: "Pistols" }])
    );
    expect(result.freeContacts[0].name).toBe("Pistols Sensei");
  });

  // Made Man + Sensei combined
  it("Made Man and Sensei produce separate free contacts", () => {
    const result = getQualityBudgetModifiers(makeSelections([MADE_MAN, SENSEI]));
    expect(result.freeContacts).toHaveLength(2);
    expect(result.freeContacts[0].qualityId).toBe(MADE_MAN);
    expect(result.freeContacts[1].qualityId).toBe(SENSEI);
  });

  // Restricted Gear
  it("Restricted Gear sets flag", () => {
    const result = getQualityBudgetModifiers(makeSelections([RESTRICTED_GEAR]));
    expect(result.restrictedGear).toBe(true);
  });

  it("restrictedGear is false when not selected", () => {
    const result = getQualityBudgetModifiers(makeSelections([]));
    expect(result.restrictedGear).toBe(false);
  });

  // Black Market Pipeline
  it("BMP returns discount info with specification", () => {
    const result = getQualityBudgetModifiers(
      makeSelections([{ id: BLACK_MARKET_PIPELINE, specification: "Electronics" }])
    );
    expect(result.blackMarketPipeline).toEqual({
      specification: "Electronics",
      priceMultiplier: 0.9,
      availabilityBonus: 2,
    });
  });

  it("BMP returns null without specification", () => {
    const result = getQualityBudgetModifiers(makeSelections([BLACK_MARKET_PIPELINE]));
    expect(result.blackMarketPipeline).toBeNull();
  });

  it("BMP returns null when not selected", () => {
    const result = getQualityBudgetModifiers(makeSelections([]));
    expect(result.blackMarketPipeline).toBeNull();
  });
});

// =============================================================================
// applyJackOfAllTradesModifier
// =============================================================================

describe("applyJackOfAllTradesModifier", () => {
  it("returns 0 for no change", () => {
    expect(applyJackOfAllTradesModifier(0, 3, 3)).toBe(0);
    expect(applyJackOfAllTradesModifier(0, 5, 4)).toBe(0);
  });

  // Ratings <= 5: -1 per level
  it("reduces cost by 1 per level for ratings <= 5", () => {
    // Raising from 0 to 1: base = 1*2 = 2, adjusted = max(1, 2-1) = 1
    expect(applyJackOfAllTradesModifier(2, 0, 1)).toBe(1);

    // Raising from 2 to 3: base = 3*2 = 6, adjusted = max(1, 6-1) = 5
    expect(applyJackOfAllTradesModifier(6, 2, 3)).toBe(5);

    // Raising from 4 to 5: base = 5*2 = 10, adjusted = max(1, 10-1) = 9
    expect(applyJackOfAllTradesModifier(10, 4, 5)).toBe(9);
  });

  it("enforces minimum 1 karma per level for low ratings", () => {
    // Raising from 0 to 1: base = 1*2 = 2, adjusted = max(1, 2-1) = 1
    // This is already 1, but the minimum ensures it never drops below 1
    expect(applyJackOfAllTradesModifier(2, 0, 1)).toBeGreaterThanOrEqual(1);
  });

  // Ratings > 5: +2 per level
  it("increases cost by 2 per level for ratings > 5", () => {
    // Raising from 5 to 6: base = 6*2 = 12, adjusted = 12+2 = 14
    expect(applyJackOfAllTradesModifier(12, 5, 6)).toBe(14);

    // Raising from 6 to 7: base = 7*2 = 14, adjusted = 14+2 = 16
    expect(applyJackOfAllTradesModifier(14, 6, 7)).toBe(16);
  });

  // Cross-boundary
  it("handles crossing the rating 5 boundary", () => {
    // Raising from 4 to 6:
    // Level 5: base = 5*2 = 10, adjusted = 10-1 = 9
    // Level 6: base = 6*2 = 12, adjusted = 12+2 = 14
    // Total = 9 + 14 = 23
    expect(applyJackOfAllTradesModifier(22, 4, 6)).toBe(23);
  });

  // Multi-level within <= 5
  it("handles multi-level raise within <= 5", () => {
    // Raising from 1 to 4:
    // Level 2: max(1, 4-1) = 3
    // Level 3: max(1, 6-1) = 5
    // Level 4: max(1, 8-1) = 7
    // Total = 3 + 5 + 7 = 15
    expect(applyJackOfAllTradesModifier(18, 1, 4)).toBe(15);
  });

  // Multi-level within > 5
  it("handles multi-level raise within > 5", () => {
    // Raising from 6 to 8:
    // Level 7: 14+2 = 16
    // Level 8: 16+2 = 18
    // Total = 16 + 18 = 34
    expect(applyJackOfAllTradesModifier(30, 6, 8)).toBe(34);
  });
});
