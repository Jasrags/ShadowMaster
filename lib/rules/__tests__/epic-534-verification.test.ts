/**
 * Epic #534 Verification Tests
 *
 * Cross-references all implemented contact mechanics against the
 * extracted Run Faster reference data and the validation checklist
 * at docs/references/sr5-run-faster/who-you-know-contacts.md.
 *
 * This is NOT a unit test file — it is a manual verification suite
 * that validates data accuracy against the sourcebook extraction.
 */

import { describe, it, expect } from "vitest";

// Import all epic #534 modules
import {
  calculateChipGain,
  calculateRepaymentCost,
  getDebtTimeframe,
  calculateChipDiceBonus,
  calculateLoyaltyImprovementCost,
} from "../chips";
import {
  getMaintenanceDeadline,
  checkMaintenanceStatus,
  resolveMaintenanceCheck,
} from "../contact-maintenance";
import {
  getBlackmailModifiers,
  getFamilyModifiers,
  getEffectiveLoyaltyForTest,
  getChipCostModifier,
  calculateReputationLoyaltyCostModifier,
  resolveIntimidation,
  resolveConSeduction,
} from "../relationship-qualities";
import {
  calculateEdgeCost,
  validateIKnowAGuy,
  createEdgeContactSpec,
  calculateConfirmationKarmaCost,
} from "../i-know-a-guy";
import {
  validateOrganizationContact,
  canOrganizationCallFavor,
  isAllowedServiceForOrganization,
  getOrganizationDefinitions,
} from "../group-contacts";
import {
  getScripExchangeRates,
  calculateBarterValue,
  getPaymentPreference,
  getPaymentPreferenceTable,
} from "../payment-mechanics";
import { getNpcBuildTable, getNpcBuildEntry } from "../contact-npc";
import type { SocialContact } from "@/lib/types";

// =============================================================================
// HELPER
// =============================================================================

function mockOrgContact(loyalty: number): SocialContact {
  return {
    id: "org-1",
    name: "Test Org",
    connection: 3,
    loyalty,
    archetype: "Organization",
    status: "active",
    favorBalance: 0,
    group: "organization",
    visibility: {
      playerVisible: true,
      showConnection: true,
      showLoyalty: true,
      showFavorBalance: true,
      showSpecializations: true,
    },
    createdAt: "2024-01-01T00:00:00Z",
  } as SocialContact;
}

// =============================================================================
// 1. CHIP ECONOMY (Run Faster p. 177)
// =============================================================================

describe("Verification: Chip Economy", () => {
  it("contact gains chips equal to Rating of the favor", () => {
    // "contact gains chips = favor Rating"
    expect(calculateChipGain({ favorRating: 3, direction: "character-requests" })).toBe(-3);
    expect(calculateChipGain({ favorRating: 5, direction: "character-requests" })).toBe(-5);
  });

  it("repayment demands twice the value", () => {
    expect(calculateRepaymentCost(3)).toBe(6);
    expect(calculateRepaymentCost(1)).toBe(2);
  });

  it("repayment timeframe table: 4 tiers", () => {
    // ≤100¥ = 4 weeks
    expect(getDebtTimeframe(100)).toBe(4);
    // 101-1000¥ = 3 weeks
    expect(getDebtTimeframe(101)).toBe(3);
    expect(getDebtTimeframe(1000)).toBe(3);
    // 1001-10000¥ = 2 weeks
    expect(getDebtTimeframe(1001)).toBe(2);
    expect(getDebtTimeframe(10000)).toBe(2);
    // 10001-100000¥ = 1 week
    expect(getDebtTimeframe(10001)).toBe(1);
    expect(getDebtTimeframe(100000)).toBe(1);
  });

  it("each chip spent adds +1 die, max bonus of +4", () => {
    expect(calculateChipDiceBonus(1)).toBe(1);
    expect(calculateChipDiceBonus(4)).toBe(4);
    expect(calculateChipDiceBonus(5)).toBe(4); // capped
    expect(calculateChipDiceBonus(10)).toBe(4); // capped
  });

  it("improve relationship: chips = target loyalty, weeks = target loyalty", () => {
    // "chips + downtime weeks = target Loyalty level"
    const result = calculateLoyaltyImprovementCost(2, 3);
    expect(result.chipsRequired).toBe(3);
    expect(result.downtimeWeeks).toBe(3);
  });
});

// =============================================================================
// 2. RELATIONSHIP MAINTENANCE (Run Faster p. 177)
// =============================================================================

describe("Verification: Relationship Maintenance", () => {
  it("interact once every [Loyalty] months", () => {
    // Loyalty 3 → deadline 3 months out
    const deadline = getMaintenanceDeadline("2024-01-01T00:00:00Z", 3);
    expect(deadline).toBe("2024-04-01T00:00:00.000Z");
  });

  it("GM makes Loyalty(2) Test on missed interaction", () => {
    // Pass: hits >= 2
    expect(resolveMaintenanceCheck(3, 2).success).toBe(true);
    expect(resolveMaintenanceCheck(3, 2).loyaltyChange).toBe(0);

    // Fail: hits < 2 → Loyalty -1
    expect(resolveMaintenanceCheck(3, 1).success).toBe(false);
    expect(resolveMaintenanceCheck(3, 1).loyaltyChange).toBe(-1);
  });

  it("Loyalty 0 = contact lost by next job", () => {
    const result = resolveMaintenanceCheck(1, 0);
    expect(result.newLoyalty).toBe(0);
    expect(result.contactLost).toBe(true);
  });
});

// =============================================================================
// 3. RELATIONSHIP QUALITIES (Run Faster p. 177-178)
// =============================================================================

describe("Verification: Blackmail Quality", () => {
  it("favors are free, must use intimidation, costs +2 Karma", () => {
    const mods = getBlackmailModifiers();
    expect(mods.favorChipCostOverride).toBe(0);
    expect(mods.requiredSkill).toBe("intimidation");
    expect(mods.karmaCost).toBe(2);
  });

  it("contact cannot leave (Loyalty does not diminish voluntarily)", () => {
    expect(getBlackmailModifiers().contactCanLeave).toBe(false);
  });

  it("chip cost override to 0 for blackmail contacts", () => {
    const result = getChipCostModifier(5, ["blackmail"]);
    expect(result.adjustedCost).toBe(0);
  });
});

describe("Verification: Family Quality", () => {
  it("+1 effective Loyalty for tests, costs +1 Karma", () => {
    const mods = getFamilyModifiers();
    expect(mods.loyaltyTestBonus).toBe(1);
    expect(mods.karmaCost).toBe(1);
    expect(getEffectiveLoyaltyForTest(3, ["family"])).toBe(4);
  });

  it("-1 chip when improving loyalty", () => {
    expect(getFamilyModifiers().loyaltyImprovementChipDiscount).toBe(1);
    const result = getChipCostModifier(4, ["family"]);
    expect(result.adjustedCost).toBe(3);
  });

  it("-1 Loyalty for performing job", () => {
    expect(getFamilyModifiers().jobPerformanceLoyaltyPenalty).toBe(-1);
  });
});

describe("Verification: Social Mechanics", () => {
  it("Intimidation: reduces Loyalty by 1, removes ability to improve", () => {
    const result = resolveIntimidation(4);
    expect(result.loyaltyChange).toBe(-1);
    expect(result.newLoyalty).toBe(3);
    expect(result.loyaltyImprovementBlocked).toBe(true);
  });

  it("Con/Seduction: opposed test, failure = -1 Loyalty", () => {
    // Success: character hits > contact hits
    expect(resolveConSeduction(3, 3, 2).success).toBe(true);
    expect(resolveConSeduction(3, 3, 2).loyaltyChange).toBe(0);

    // Failure: character hits <= contact hits
    expect(resolveConSeduction(3, 1, 2).success).toBe(false);
    expect(resolveConSeduction(3, 1, 2).loyaltyChange).toBe(-1);
  });

  it("Notoriety penalty: +1 Karma or +2 chips per 2 excess points", () => {
    // Notoriety 6, Street Cred 2 → excess 4 → 2 increments
    const result = calculateReputationLoyaltyCostModifier(2, 6);
    expect(result.extraKarma).toBe(2);
    expect(result.extraChips).toBe(4);
  });
});

// =============================================================================
// 4. I KNOW A GUY (Run Faster p. 178)
// =============================================================================

describe("Verification: I Know a Guy", () => {
  it("costs Edge equal to 2× desired Connection Rating", () => {
    expect(calculateEdgeCost(3)).toBe(6);
    expect(calculateEdgeCost(6)).toBe(12);
  });

  it("Loyalty starts at 1", () => {
    const spec = createEdgeContactSpec({
      desiredConnection: 4,
      archetype: "Fixer",
      name: "Old Buddy",
    });
    expect(spec.loyalty).toBe(1);
  });

  it("Karma cost to keep = Connection + Loyalty (1)", () => {
    expect(calculateConfirmationKarmaCost(4)).toBe(5); // 4 + 1
    expect(calculateConfirmationKarmaCost(8)).toBe(9); // 8 + 1
  });

  it("validates Edge sufficiency", () => {
    expect(validateIKnowAGuy({ currentEdge: 5, desiredConnection: 3 }).allowed).toBe(false);
    expect(validateIKnowAGuy({ currentEdge: 6, desiredConnection: 3 }).allowed).toBe(true);
  });
});

// =============================================================================
// 5. ORGANIZATION CONTACTS (Run Faster p. 179)
// =============================================================================

describe("Verification: Organization Contacts", () => {
  it("Loyalty limited to 1", () => {
    expect(validateOrganizationContact(mockOrgContact(1)).valid).toBe(true);
    expect(validateOrganizationContact(mockOrgContact(2)).valid).toBe(false);
  });

  it("limited to legwork/networking, no favors, no chips", () => {
    expect(isAllowedServiceForOrganization("legwork")).toBe(true);
    expect(isAllowedServiceForOrganization("networking")).toBe(true);
    expect(isAllowedServiceForOrganization("swag")).toBe(false);
    expect(isAllowedServiceForOrganization("shadow-service")).toBe(false);
    expect(isAllowedServiceForOrganization("personal-favor")).toBe(false);
    expect(isAllowedServiceForOrganization("support")).toBe(false);
    expect(canOrganizationCallFavor(mockOrgContact(1)).allowed).toBe(false);
  });

  it("5 organizations with correct Connection bonuses and Karma costs", () => {
    const orgs = getOrganizationDefinitions();
    expect(orgs).toHaveLength(5);

    const byId = Object.fromEntries(orgs.map((o) => [o.id, o]));
    expect(byId["street-gang"]).toMatchObject({
      connectionBonus: 1,
      karmaCost: 5,
      sinnerRequired: false,
    });
    expect(byId["city-government"]).toMatchObject({
      connectionBonus: 1,
      karmaCost: 3,
      sinnerRequired: true,
    });
    expect(byId["humanis-policlub"]).toMatchObject({
      connectionBonus: 2,
      karmaCost: 10,
      sinnerRequired: false,
    });
    expect(byId["order-of-st-sylvester"]).toMatchObject({
      connectionBonus: 2,
      karmaCost: 8,
      sinnerRequired: true,
    });
    expect(byId["lone-star-god"]).toMatchObject({
      connectionBonus: 3,
      karmaCost: 12,
      sinnerRequired: true,
    });
  });
});

// =============================================================================
// 6. PAYMENT MECHANICS (Run Faster pp. 174, 180)
// =============================================================================

describe("Verification: Corporate Scrip Exchange Rates", () => {
  it("9 corporations with correct rates", () => {
    const rates = getScripExchangeRates();
    expect(rates).toHaveLength(9);

    const byId = Object.fromEntries(rates.map((r) => [r.id, r]));
    expect(byId["saeder-krupp"].rateToOneNuyen).toBe(0.8);
    expect(byId["shiawase"].rateToOneNuyen).toBe(1);
    expect(byId["mct"].rateToOneNuyen).toBe(1.01);
    expect(byId["wuxing"].rateToOneNuyen).toBe(3);
    expect(byId["ares"].rateToOneNuyen).toBe(3.5);
    expect(byId["evo"].rateToOneNuyen).toBe(5);
    expect(byId["renraku"].rateToOneNuyen).toBe(10);
    expect(byId["horizon"].rateToOneNuyen).toBe(15);
    expect(byId["aztechnology"].rateToOneNuyen).toBe(20);
  });
});

describe("Verification: Barter Modifiers", () => {
  it("Provenance 2×/3×, Vintage +1%/decade max 10%, Master Crafted +20%", () => {
    expect(calculateBarterValue(1000, { provenance: "recent" })).toBe(2000);
    expect(calculateBarterValue(1000, { provenance: "historical" })).toBe(3000);
    expect(calculateBarterValue(1000, { vintageDecades: 5 })).toBe(1050);
    expect(calculateBarterValue(1000, { vintageDecades: 10 })).toBe(1100);
    expect(calculateBarterValue(1000, { vintageDecades: 15 })).toBe(1100); // capped
    expect(calculateBarterValue(1000, { masterCrafted: true })).toBe(1200);
  });
});

describe("Verification: Payment Preference Table (2D6)", () => {
  it("11 entries covering rolls 2-12", () => {
    const table = getPaymentPreferenceTable();
    expect(table).toHaveLength(11);
    for (let roll = 2; roll <= 12; roll++) {
      expect(getPaymentPreference(roll)).toBeDefined();
    }
  });

  it("7/8 = credstick (most common)", () => {
    expect(getPaymentPreference(7)!.paymentType).toBe("cash-credstick");
    expect(getPaymentPreference(8)!.paymentType).toBe("cash-credstick");
  });
});

// =============================================================================
// 7. CONTACT NPC BUILD TABLE (Run Faster p. 180)
// =============================================================================

describe("Verification: Contact NPC Build Table", () => {
  it("12 Connection Rating rows with correct values", () => {
    const table = getNpcBuildTable();
    expect(table).toHaveLength(12);

    // Verify all 12 rows against extracted reference data
    const expected = [
      {
        connectionRating: 1,
        bonusAttributePoints: 0,
        totalSkillPoints: 14,
        specialAttributePoints: 0,
        nuyen: 6000,
      },
      {
        connectionRating: 2,
        bonusAttributePoints: 1,
        totalSkillPoints: 18,
        specialAttributePoints: 0,
        nuyen: 50000,
      },
      {
        connectionRating: 3,
        bonusAttributePoints: 2,
        totalSkillPoints: 22,
        specialAttributePoints: 2,
        nuyen: 140000,
      },
      {
        connectionRating: 4,
        bonusAttributePoints: 2,
        totalSkillPoints: 26,
        specialAttributePoints: 4,
        nuyen: 175000,
      },
      {
        connectionRating: 5,
        bonusAttributePoints: 3,
        totalSkillPoints: 26,
        specialAttributePoints: 4,
        nuyen: 225000,
      },
      {
        connectionRating: 6,
        bonusAttributePoints: 3,
        totalSkillPoints: 30,
        specialAttributePoints: 5,
        nuyen: 250000,
      },
      {
        connectionRating: 7,
        bonusAttributePoints: 2,
        totalSkillPoints: 34,
        specialAttributePoints: 5,
        nuyen: 275000,
      },
      {
        connectionRating: 8,
        bonusAttributePoints: 3,
        totalSkillPoints: 34,
        specialAttributePoints: 5,
        nuyen: 275000,
      },
      {
        connectionRating: 9,
        bonusAttributePoints: 3,
        totalSkillPoints: 38,
        specialAttributePoints: 5,
        nuyen: 300000,
      },
      {
        connectionRating: 10,
        bonusAttributePoints: 4,
        totalSkillPoints: 38,
        specialAttributePoints: 5,
        nuyen: 375000,
      },
      {
        connectionRating: 11,
        bonusAttributePoints: 2,
        totalSkillPoints: 42,
        specialAttributePoints: 8,
        nuyen: 450000,
      },
      {
        connectionRating: 12,
        bonusAttributePoints: 3,
        totalSkillPoints: 46,
        specialAttributePoints: 10,
        nuyen: 500000,
      },
    ];

    for (const row of expected) {
      const entry = getNpcBuildEntry(row.connectionRating);
      expect(entry).toEqual(row);
    }
  });
});
