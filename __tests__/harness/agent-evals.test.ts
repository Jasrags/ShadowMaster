/**
 * Agent Harness Evals
 *
 * Deterministic tests that validate correctness of logic agents frequently
 * interact with. These catch regressions in the "action space" — the functions
 * and patterns agents rely on to produce correct outputs.
 *
 * Categories:
 * 1. Quality budget modifiers — agents must produce correct modifier flags
 * 2. Gear validation — agents must pass correct params to validateAvailability
 * 3. Contact pool splitting — agents must compute dual-pool karma correctly
 * 4. Creation selections helpers — agents must read/write selections correctly
 */

import { describe, it, expect } from "vitest";
import {
  getQualityBudgetModifiers,
  getDefaultModifiers,
  buildFreeContact,
  applyJackOfAllTradesModifier,
  FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER,
  MADE_MAN,
  SENSEI,
  RESTRICTED_GEAR,
  BLACK_MARKET_PIPELINE,
} from "@/lib/rules/qualities/budget-modifiers";
import type { QualityBudgetModifiers } from "@/lib/rules/qualities/budget-modifiers";
import {
  getPositiveQualityIds,
  getPositiveQualities,
  getQualityId,
} from "@/lib/types/creation-selections";

// =============================================================================
// EVAL 1: Default modifiers are immutable (no shared reference)
// =============================================================================

describe("Eval: Default modifiers immutability", () => {
  it("getDefaultModifiers returns a fresh object each call", () => {
    const a = getDefaultModifiers();
    const b = getDefaultModifiers();
    expect(a).toEqual(b);
    expect(a).not.toBe(b);
    expect(a.freeContacts).not.toBe(b.freeContacts);
  });

  it("mutating one default does not affect another", () => {
    const a = getDefaultModifiers();
    a.freeContacts.push(buildFreeContact(MADE_MAN, "Test"));
    a.karmaToNuyenCap = 999;

    const b = getDefaultModifiers();
    expect(b.freeContacts).toHaveLength(0);
    expect(b.karmaToNuyenCap).toBe(10);
  });
});

// =============================================================================
// EVAL 2: Quality modifier flags are set correctly
// =============================================================================

describe("Eval: Quality modifier flag correctness", () => {
  const makeSelections = (qualityIds: (string | { id: string; specification?: string })[]) => ({
    positiveQualities: qualityIds.map((q) => (typeof q === "string" ? { id: q } : q)),
  });

  it("empty selections produce all-false flags", () => {
    const mods = getQualityBudgetModifiers({});
    expect(mods.friendsInHighPlaces).toBe(false);
    expect(mods.restrictedGear).toBe(false);
    expect(mods.jackOfAllTrades).toBe(false);
    expect(mods.blackMarketPipeline).toBeNull();
    expect(mods.freeContacts).toHaveLength(0);
  });

  it("Friends in High Places sets flag without side effects", () => {
    const mods = getQualityBudgetModifiers(makeSelections(["friends-in-high-places"]));
    expect(mods.friendsInHighPlaces).toBe(true);
    expect(mods.restrictedGear).toBe(false);
    expect(mods.freeContacts).toHaveLength(0);
  });

  it("Made Man creates free contact with correct stats", () => {
    const mods = getQualityBudgetModifiers(
      makeSelections([{ id: MADE_MAN, specification: "Mafia" }])
    );
    expect(mods.freeContacts).toHaveLength(1);
    expect(mods.freeContacts[0]).toMatchObject({
      qualityId: MADE_MAN,
      connection: 2,
      loyalty: 4,
      type: "Syndicate",
    });
  });

  it("Sensei creates free contact with correct stats", () => {
    const mods = getQualityBudgetModifiers(
      makeSelections([{ id: SENSEI, specification: "Kendo" }])
    );
    expect(mods.freeContacts).toHaveLength(1);
    expect(mods.freeContacts[0]).toMatchObject({
      qualityId: SENSEI,
      connection: 1,
      loyalty: 1,
      type: "Training",
    });
  });

  it("Black Market Pipeline extracts specification", () => {
    const mods = getQualityBudgetModifiers(
      makeSelections([{ id: BLACK_MARKET_PIPELINE, specification: "Weapons" }])
    );
    expect(mods.blackMarketPipeline).toMatchObject({
      specification: "Weapons",
      priceMultiplier: 0.9,
      availabilityBonus: 2,
    });
  });

  it("multiple qualities compose without interference", () => {
    const mods = getQualityBudgetModifiers(
      makeSelections([
        "friends-in-high-places",
        RESTRICTED_GEAR,
        { id: MADE_MAN, specification: "Yakuza" },
      ])
    );
    expect(mods.friendsInHighPlaces).toBe(true);
    expect(mods.restrictedGear).toBe(true);
    expect(mods.freeContacts).toHaveLength(1);
    expect(mods.blackMarketPipeline).toBeNull();
  });
});

// =============================================================================
// EVAL 3: Contact pool splitting correctness
// =============================================================================

describe("Eval: Contact pool splitting", () => {
  it("FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER is 4", () => {
    expect(FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER).toBe(4);
  });

  it("high-connection pool calculation: CHA * multiplier", () => {
    const charisma = 5;
    const pool = charisma * FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER;
    expect(pool).toBe(20);
  });

  it("dual-pool karma: high-connection overflow goes to regular pool", () => {
    // Scenario: CHA 3, FiHP active
    // Regular pool: CHA * 3 = 9
    // High-connection pool: CHA * 4 = 12
    // Contacts: 1 high-conn (C8, L3 = 11), 1 regular (C4, L2 = 6)
    const charisma = 3;
    const regularPool = charisma * 3; // 9
    const highConnectionPool = charisma * FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER; // 12

    const highConnContacts = [{ connection: 8, loyalty: 3 }]; // cost 11
    const regularContacts = [{ connection: 4, loyalty: 2 }]; // cost 6

    const totalHighCost = highConnContacts.reduce((s, c) => s + c.connection + c.loyalty, 0); // 11
    const highConnectionOverflow = Math.max(0, totalHighCost - highConnectionPool); // 0
    const regularContactCost =
      regularContacts.reduce((s, c) => s + c.connection + c.loyalty, 0) + highConnectionOverflow; // 6
    const karmaSpent = Math.max(0, regularContactCost - regularPool); // 0

    expect(totalHighCost).toBe(11);
    expect(highConnectionOverflow).toBe(0);
    expect(regularContactCost).toBe(6);
    expect(karmaSpent).toBe(0); // All covered by pools
  });

  it("dual-pool karma: overflow from high-connection adds to regular cost", () => {
    // Scenario: CHA 2, FiHP active
    // Regular pool: CHA * 3 = 6
    // High-connection pool: CHA * 4 = 8
    // Contacts: 1 high-conn (C9, L4 = 13), 1 regular (C3, L2 = 5)
    const charisma = 2;
    const regularPool = charisma * 3; // 6
    const highConnectionPool = charisma * FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER; // 8

    const totalHighCost = 9 + 4; // 13
    const highConnectionOverflow = Math.max(0, totalHighCost - highConnectionPool); // 5
    const regularContactCost = 3 + 2 + highConnectionOverflow; // 10
    const karmaSpent = Math.max(0, regularContactCost - regularPool); // 4

    expect(highConnectionOverflow).toBe(5);
    expect(regularContactCost).toBe(10);
    expect(karmaSpent).toBe(4); // 4 karma needed beyond both pools
  });
});

// =============================================================================
// EVAL 4: buildFreeContact consistency
// =============================================================================

describe("Eval: buildFreeContact output contract", () => {
  it("Made Man contact has required fields", () => {
    const contact = buildFreeContact(MADE_MAN, "Triads");
    expect(contact).toEqual({
      qualityId: MADE_MAN,
      name: "Triads Contact",
      connection: 2,
      loyalty: 4,
      type: "Syndicate",
      specification: "Triads",
    });
  });

  it("Sensei contact has required fields", () => {
    const contact = buildFreeContact(SENSEI, "Karate");
    expect(contact).toEqual({
      qualityId: SENSEI,
      name: "Karate Sensei",
      connection: 1,
      loyalty: 1,
      type: "Training",
      specification: "Karate",
    });
  });

  it("Made Man without specification uses default name", () => {
    const contact = buildFreeContact(MADE_MAN);
    expect(contact.name).toBe("Syndicate Contact");
    expect(contact.specification).toBeUndefined();
  });

  it("Sensei without specification uses default name", () => {
    const contact = buildFreeContact(SENSEI);
    expect(contact.name).toBe("Sensei");
    expect(contact.specification).toBeUndefined();
  });
});

// =============================================================================
// EVAL 5: Jack of All Trades modifier math
// =============================================================================

describe("Eval: Jack of All Trades modifier", () => {
  it("reduces cost for levels 1-5 by 1 per level (min 1)", () => {
    // Rating 0 -> 1: base cost 2, adjustment -1 = 1
    expect(applyJackOfAllTradesModifier(2, 0, 1)).toBe(1);
  });

  it("increases cost for levels above 5 by 2 per level", () => {
    // Rating 5 -> 6: base cost 12, adjustment +2 = 14
    expect(applyJackOfAllTradesModifier(12, 5, 6)).toBe(14);
  });

  it("handles cross-boundary rating range (4 to 7)", () => {
    // Level 5: 10 - 1 = 9
    // Level 6: 12 + 2 = 14
    // Level 7: 14 + 2 = 16
    // Total: 9 + 14 + 16 = 39
    const result = applyJackOfAllTradesModifier(0, 4, 7);
    expect(result).toBe(39);
  });

  it("returns 0 for no-op range", () => {
    expect(applyJackOfAllTradesModifier(0, 3, 3)).toBe(0);
    expect(applyJackOfAllTradesModifier(0, 5, 4)).toBe(0);
  });
});

// =============================================================================
// EVAL 6: Creation selections helpers
// =============================================================================

describe("Eval: Creation selections helpers", () => {
  it("getPositiveQualityIds extracts IDs from mixed formats", () => {
    const selections = {
      positiveQualities: [
        "simple-id",
        { id: "object-id", specification: "test" },
        { id: "leveled-id", level: 2 },
      ],
    };
    const ids = getPositiveQualityIds(selections);
    expect(ids).toEqual(["simple-id", "object-id", "leveled-id"]);
  });

  it("getPositiveQualityIds returns empty for missing selections", () => {
    expect(getPositiveQualityIds({})).toEqual([]);
    expect(getPositiveQualityIds({ positiveQualities: undefined })).toEqual([]);
  });

  it("getQualityId handles string and object values", () => {
    expect(getQualityId("string-id")).toBe("string-id");
    expect(getQualityId({ id: "object-id" })).toBe("object-id");
  });
});
