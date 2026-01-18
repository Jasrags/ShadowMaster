/**
 * Tests for wireless bonus calculator
 *
 * Tests all wireless bonus calculation functions including state checks,
 * effect collection, and aggregation calculations.
 */

import { describe, it, expect } from "vitest";
import type { Character, CyberwareItem, Weapon, BiowareItem } from "@/lib/types";
import type { WirelessEffect } from "@/lib/types/wireless-effects";
import {
  isGlobalWirelessEnabled,
  isItemWirelessActive,
  isCyberwareWirelessActive,
  collectCyberwareEffects,
  collectBiowareEffects,
  collectWeaponModEffects,
  calculateWirelessBonuses,
  calculateContextualWirelessBonuses,
  getWirelessInitiativeBonus,
  getWirelessInitiativeDiceBonus,
  getWirelessAttributeBonus,
  getWirelessAttackBonus,
  getWirelessDefenseBonus,
  getWirelessLimitBonus,
  getWirelessBonusSummary,
} from "../bonus-calculator";

// Helper to create minimal Character for testing
function createMinimalCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "test-char",
    userId: "test-user",
    name: "Test Character",
    editionCode: "sr5",
    metatype: "human",
    attributes: {},
    specialAttributes: { edge: 1, essence: 6 },
    magicalPath: "mundane",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

// Helper to create cyberware item with wireless effects
function createCyberware(
  id: string,
  effects: WirelessEffect[],
  overrides: Partial<CyberwareItem> = {}
): CyberwareItem {
  return {
    catalogId: id,
    name: id,
    category: "headware",
    grade: "standard",
    baseEssenceCost: 0.1,
    essenceCost: 0.1,
    cost: 1000,
    availability: 4,
    wirelessEffects: effects,
    ...overrides,
  } as CyberwareItem;
}

describe("Wireless Bonus Calculator", () => {
  // ===========================================================================
  // WIRELESS STATE CHECKS
  // ===========================================================================

  describe("isGlobalWirelessEnabled", () => {
    it("should return true when wirelessBonusesEnabled is not set (default)", () => {
      const character = createMinimalCharacter();
      expect(isGlobalWirelessEnabled(character)).toBe(true);
    });

    it("should return true when wirelessBonusesEnabled is true", () => {
      const character = createMinimalCharacter({ wirelessBonusesEnabled: true });
      expect(isGlobalWirelessEnabled(character)).toBe(true);
    });

    it("should return false when wirelessBonusesEnabled is false", () => {
      const character = createMinimalCharacter({ wirelessBonusesEnabled: false });
      expect(isGlobalWirelessEnabled(character)).toBe(false);
    });
  });

  describe("isItemWirelessActive", () => {
    it("should return true when both global and item wireless are enabled", () => {
      const character = createMinimalCharacter({ wirelessBonusesEnabled: true });
      const item = { wirelessEnabled: true };
      expect(isItemWirelessActive(item, character)).toBe(true);
    });

    it("should return true when item wirelessEnabled is not set (defaults to true)", () => {
      const character = createMinimalCharacter({ wirelessBonusesEnabled: true });
      const item = {};
      expect(isItemWirelessActive(item, character)).toBe(true);
    });

    it("should return false when global wireless is disabled", () => {
      const character = createMinimalCharacter({ wirelessBonusesEnabled: false });
      const item = { wirelessEnabled: true };
      expect(isItemWirelessActive(item, character)).toBe(false);
    });

    it("should return false when item wireless is disabled", () => {
      const character = createMinimalCharacter({ wirelessBonusesEnabled: true });
      const item = { wirelessEnabled: false };
      expect(isItemWirelessActive(item, character)).toBe(false);
    });
  });

  describe("isCyberwareWirelessActive", () => {
    it("should return true for cyberware with wireless enabled and effects", () => {
      const character = createMinimalCharacter();
      const cyberware = createCyberware("test", [{ type: "initiative", modifier: 1 }]);
      expect(isCyberwareWirelessActive(cyberware, character)).toBe(true);
    });

    it("should return false when global wireless is disabled", () => {
      const character = createMinimalCharacter({ wirelessBonusesEnabled: false });
      const cyberware = createCyberware("test", [{ type: "initiative", modifier: 1 }]);
      expect(isCyberwareWirelessActive(cyberware, character)).toBe(false);
    });

    it("should return false when cyberware has no effects", () => {
      const character = createMinimalCharacter();
      const cyberware = createCyberware("test", []);
      expect(isCyberwareWirelessActive(cyberware, character)).toBe(false);
    });

    it("should return false when cyberware wireless is disabled", () => {
      const character = createMinimalCharacter();
      const cyberware = createCyberware("test", [{ type: "initiative", modifier: 1 }], {
        wirelessEnabled: false,
      });
      expect(isCyberwareWirelessActive(cyberware, character)).toBe(false);
    });

    it("should return false when wirelessEffects is undefined", () => {
      const character = createMinimalCharacter();
      const cyberware = createCyberware("test", []);
      cyberware.wirelessEffects = undefined;
      expect(isCyberwareWirelessActive(cyberware, character)).toBe(false);
    });
  });

  // ===========================================================================
  // EFFECT COLLECTION
  // ===========================================================================

  describe("collectCyberwareEffects", () => {
    it("should return empty array when no cyberware", () => {
      const character = createMinimalCharacter();
      expect(collectCyberwareEffects(character)).toEqual([]);
    });

    it("should collect effects from single cyberware item", () => {
      const effects: WirelessEffect[] = [
        { type: "initiative", modifier: 1 },
        { type: "attribute", attribute: "reaction", modifier: 2 },
      ];
      const character = createMinimalCharacter({
        cyberware: [createCyberware("wired-reflexes", effects)],
      });

      const result = collectCyberwareEffects(character);
      expect(result).toHaveLength(2);
      expect(result).toEqual(effects);
    });

    it("should collect effects from multiple cyberware items", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("wired-reflexes", [{ type: "initiative", modifier: 1 }]),
          createCyberware("muscle-toner", [
            { type: "attribute", attribute: "agility", modifier: 1 },
          ]),
        ],
      });

      const result = collectCyberwareEffects(character);
      expect(result).toHaveLength(2);
    });

    it("should skip cyberware with disabled wireless", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("wired-reflexes", [{ type: "initiative", modifier: 1 }], {
            wirelessEnabled: false,
          }),
          createCyberware("muscle-toner", [
            { type: "attribute", attribute: "agility", modifier: 1 },
          ]),
        ],
      });

      const result = collectCyberwareEffects(character);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ type: "attribute", attribute: "agility", modifier: 1 });
    });

    it("should collect effects from cyberware enhancements", () => {
      const enhancementEffects: WirelessEffect[] = [{ type: "attack_pool", modifier: 1 }];
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware(
            "cyberlimb",
            [{ type: "attribute", attribute: "strength", modifier: 1 }],
            {
              enhancements: [
                {
                  catalogId: "enhanced-agility",
                  name: "Enhanced Agility",
                  category: "cyberlimb-enhancement",
                  grade: "standard",
                  baseEssenceCost: 0,
                  essenceCost: 0,
                  cost: 1000,
                  availability: 4,
                  wirelessEffects: enhancementEffects,
                },
              ],
            }
          ),
        ],
      });

      const result = collectCyberwareEffects(character);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({ type: "attribute", attribute: "strength", modifier: 1 });
      expect(result).toContainEqual({ type: "attack_pool", modifier: 1 });
    });
  });

  describe("collectBiowareEffects", () => {
    it("should return empty array when no bioware", () => {
      const character = createMinimalCharacter();
      expect(collectBiowareEffects(character)).toEqual([]);
    });

    it("should collect effects from bioware with wireless fields", () => {
      const bioware: BiowareItem[] = [
        {
          catalogId: "synaptic-booster",
          name: "Synaptic Booster",
          grade: "standard",
          baseEssenceCost: 0.5,
          essenceCost: 0.5,
          cost: 5000,
          availability: 8,
          wirelessEnabled: true,
          wirelessEffects: [{ type: "initiative", modifier: 1 }],
        } as BiowareItem & { wirelessEnabled: boolean; wirelessEffects: WirelessEffect[] },
      ];
      const character = createMinimalCharacter({ bioware });

      const result = collectBiowareEffects(character);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ type: "initiative", modifier: 1 });
    });

    it("should skip bioware without wirelessEffects", () => {
      const bioware: BiowareItem[] = [
        {
          catalogId: "muscle-toner",
          name: "Muscle Toner",
          grade: "standard",
          baseEssenceCost: 0.2,
          essenceCost: 0.2,
          cost: 3000,
          availability: 6,
        } as BiowareItem,
      ];
      const character = createMinimalCharacter({ bioware });

      const result = collectBiowareEffects(character);
      expect(result).toEqual([]);
    });
  });

  describe("collectWeaponModEffects", () => {
    it("should return empty array when no weapons", () => {
      const character = createMinimalCharacter();
      expect(collectWeaponModEffects(character)).toEqual([]);
    });

    it("should collect smartgun effects from weapons", () => {
      const weapons: Weapon[] = [
        {
          id: "weapon-1",
          catalogId: "ares-predator",
          name: "Ares Predator V",
          modifications: [{ catalogId: "smartgun-internal" }],
        } as Weapon,
      ];
      const character = createMinimalCharacter({ weapons });

      const result = collectWeaponModEffects(character);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "attack_pool",
        modifier: 2,
        condition: "ranged_attack",
        isDicePool: true,
      });
    });

    it("should collect from both internal and external smartgun", () => {
      const weapons: Weapon[] = [
        {
          id: "weapon-1",
          catalogId: "ares-predator",
          name: "Ares Predator V",
          modifications: [{ catalogId: "smartgun-internal" }],
        } as Weapon,
        {
          id: "weapon-2",
          catalogId: "remington-roomsweeper",
          name: "Remington Roomsweeper",
          modifications: [{ catalogId: "smartgun-external" }],
        } as Weapon,
      ];
      const character = createMinimalCharacter({ weapons });

      const result = collectWeaponModEffects(character);
      expect(result).toHaveLength(2);
    });

    it("should skip stored weapons", () => {
      const weapons: Weapon[] = [
        {
          id: "weapon-1",
          catalogId: "ares-predator",
          name: "Ares Predator V",
          modifications: [{ catalogId: "smartgun-internal" }],
          state: { readiness: "stored" },
        } as Weapon,
      ];
      const character = createMinimalCharacter({ weapons });

      const result = collectWeaponModEffects(character);
      expect(result).toEqual([]);
    });

    it("should skip weapons with wireless disabled", () => {
      const weapons: Weapon[] = [
        {
          id: "weapon-1",
          catalogId: "ares-predator",
          name: "Ares Predator V",
          modifications: [{ catalogId: "smartgun-internal" }],
          state: { wirelessEnabled: false },
        } as Weapon,
      ];
      const character = createMinimalCharacter({ weapons });

      const result = collectWeaponModEffects(character);
      expect(result).toEqual([]);
    });

    it("should handle weapons without modifications", () => {
      const weapons: Weapon[] = [
        {
          id: "weapon-1",
          catalogId: "katana",
          name: "Katana",
        } as Weapon,
      ];
      const character = createMinimalCharacter({ weapons });

      const result = collectWeaponModEffects(character);
      expect(result).toEqual([]);
    });
  });

  // ===========================================================================
  // BONUS CALCULATION
  // ===========================================================================

  describe("calculateWirelessBonuses", () => {
    it("should return empty bonuses when global wireless is disabled", () => {
      const character = createMinimalCharacter({
        wirelessBonusesEnabled: false,
        cyberware: [createCyberware("wired-reflexes", [{ type: "initiative", modifier: 3 }])],
      });

      const result = calculateWirelessBonuses(character);
      expect(result.initiative).toBe(0);
    });

    it("should aggregate initiative bonuses", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("wired-reflexes", [{ type: "initiative", modifier: 2 }]),
          createCyberware("synaptic-acceleration", [{ type: "initiative", modifier: 1 }]),
        ],
      });

      const result = calculateWirelessBonuses(character);
      expect(result.initiative).toBe(3);
    });

    it("should aggregate initiative dice bonuses", () => {
      const character = createMinimalCharacter({
        cyberware: [createCyberware("wired-reflexes", [{ type: "initiative_dice", modifier: 2 }])],
      });

      const result = calculateWirelessBonuses(character);
      expect(result.initiativeDice).toBe(2);
    });

    it("should aggregate attribute bonuses", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("muscle-toner", [
            { type: "attribute", attribute: "agility", modifier: 1 },
          ]),
          createCyberware("enhanced-agility", [
            { type: "attribute", attribute: "agility", modifier: 1 },
          ]),
        ],
      });

      const result = calculateWirelessBonuses(character);
      expect(result.attributes.agility).toBe(2);
    });

    it("should aggregate attack pool bonuses", () => {
      const weapons: Weapon[] = [
        {
          id: "weapon-1",
          catalogId: "ares-predator",
          name: "Ares Predator V",
          modifications: [{ catalogId: "smartgun-internal" }],
        } as Weapon,
      ];
      const character = createMinimalCharacter({ weapons });

      const result = calculateWirelessBonuses(character);
      expect(result.attackPool).toBe(2);
    });

    it("should aggregate multiple effect types", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("multi-effect", [
            { type: "initiative", modifier: 2 },
            { type: "attribute", attribute: "reaction", modifier: 1 },
            { type: "defense_pool", modifier: 1 },
          ]),
        ],
      });

      const result = calculateWirelessBonuses(character);
      expect(result.initiative).toBe(2);
      expect(result.attributes.reaction).toBe(1);
      expect(result.defensePool).toBe(1);
    });
  });

  describe("calculateContextualWirelessBonuses", () => {
    it("should include unconditional effects", () => {
      const character = createMinimalCharacter({
        cyberware: [createCyberware("wired-reflexes", [{ type: "initiative", modifier: 2 }])],
      });

      const result = calculateContextualWirelessBonuses(character, "ranged_attack");
      expect(result.initiative).toBe(2);
    });

    it("should include effects matching the context", () => {
      const weapons: Weapon[] = [
        {
          id: "weapon-1",
          catalogId: "ares-predator",
          name: "Ares Predator V",
          modifications: [{ catalogId: "smartgun-internal" }],
        } as Weapon,
      ];
      const character = createMinimalCharacter({ weapons });

      const result = calculateContextualWirelessBonuses(character, "ranged_attack");
      expect(result.attackPool).toBe(2);
    });

    it("should exclude effects not matching the context", () => {
      const weapons: Weapon[] = [
        {
          id: "weapon-1",
          catalogId: "ares-predator",
          name: "Ares Predator V",
          modifications: [{ catalogId: "smartgun-internal" }],
        } as Weapon,
      ];
      const character = createMinimalCharacter({ weapons });

      // Smartgun bonus only applies to ranged attacks, not melee
      const result = calculateContextualWirelessBonuses(character, "melee_attack");
      expect(result.attackPool).toBe(0);
    });

    it("should handle defense context", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("defense-system", [
            { type: "defense_pool", modifier: 2, condition: "defense" },
          ]),
        ],
      });

      const resultDefense = calculateContextualWirelessBonuses(character, "defense");
      expect(resultDefense.defensePool).toBe(2);

      const resultAttack = calculateContextualWirelessBonuses(character, "ranged_attack");
      expect(resultAttack.defensePool).toBe(0);
    });
  });

  // ===========================================================================
  // CONVENIENCE FUNCTIONS
  // ===========================================================================

  describe("getWirelessInitiativeBonus", () => {
    it("should return total initiative bonus", () => {
      const character = createMinimalCharacter({
        cyberware: [createCyberware("wired-reflexes", [{ type: "initiative", modifier: 3 }])],
      });

      expect(getWirelessInitiativeBonus(character)).toBe(3);
    });

    it("should return 0 when no bonuses", () => {
      const character = createMinimalCharacter();
      expect(getWirelessInitiativeBonus(character)).toBe(0);
    });
  });

  describe("getWirelessInitiativeDiceBonus", () => {
    it("should return total initiative dice bonus", () => {
      const character = createMinimalCharacter({
        cyberware: [createCyberware("wired-reflexes", [{ type: "initiative_dice", modifier: 2 }])],
      });

      expect(getWirelessInitiativeDiceBonus(character)).toBe(2);
    });

    it("should return 0 when no bonuses", () => {
      const character = createMinimalCharacter();
      expect(getWirelessInitiativeDiceBonus(character)).toBe(0);
    });
  });

  describe("getWirelessAttributeBonus", () => {
    it("should return bonus for specified attribute", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("muscle-toner", [
            { type: "attribute", attribute: "agility", modifier: 2 },
          ]),
        ],
      });

      expect(getWirelessAttributeBonus(character, "agility")).toBe(2);
    });

    it("should return 0 for attribute without bonus", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("muscle-toner", [
            { type: "attribute", attribute: "agility", modifier: 2 },
          ]),
        ],
      });

      expect(getWirelessAttributeBonus(character, "strength")).toBe(0);
    });
  });

  describe("getWirelessAttackBonus", () => {
    it("should return ranged attack bonus by default", () => {
      const weapons: Weapon[] = [
        {
          id: "weapon-1",
          catalogId: "ares-predator",
          name: "Ares Predator V",
          modifications: [{ catalogId: "smartgun-internal" }],
        } as Weapon,
      ];
      const character = createMinimalCharacter({ weapons });

      expect(getWirelessAttackBonus(character)).toBe(2);
      expect(getWirelessAttackBonus(character, true)).toBe(2);
    });

    it("should return melee attack bonus when specified", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("melee-enhancer", [
            { type: "attack_pool", modifier: 1, condition: "melee_attack" },
          ]),
        ],
      });

      expect(getWirelessAttackBonus(character, false)).toBe(1);
    });

    it("should return 0 when no matching bonuses", () => {
      const character = createMinimalCharacter();
      expect(getWirelessAttackBonus(character)).toBe(0);
    });
  });

  describe("getWirelessDefenseBonus", () => {
    it("should return defense pool bonus", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("defense-system", [
            { type: "defense_pool", modifier: 2, condition: "defense" },
          ]),
        ],
      });

      expect(getWirelessDefenseBonus(character)).toBe(2);
    });

    it("should return 0 when no defense bonuses", () => {
      const character = createMinimalCharacter();
      expect(getWirelessDefenseBonus(character)).toBe(0);
    });
  });

  describe("getWirelessLimitBonus", () => {
    it("should return bonus for specified limit", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("cerebral-booster", [{ type: "limit", limit: "mental", modifier: 1 }]),
        ],
      });

      expect(getWirelessLimitBonus(character, "mental")).toBe(1);
    });

    it("should return 0 for limit without bonus", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("cerebral-booster", [{ type: "limit", limit: "mental", modifier: 1 }]),
        ],
      });

      expect(getWirelessLimitBonus(character, "physical")).toBe(0);
    });
  });

  // ===========================================================================
  // SUMMARY GENERATION
  // ===========================================================================

  describe("getWirelessBonusSummary", () => {
    it("should return empty array when no bonuses", () => {
      const character = createMinimalCharacter();
      expect(getWirelessBonusSummary(character)).toEqual([]);
    });

    it("should include initiative bonus in summary", () => {
      const character = createMinimalCharacter({
        cyberware: [createCyberware("wired-reflexes", [{ type: "initiative", modifier: 2 }])],
      });

      const summary = getWirelessBonusSummary(character);
      expect(summary).toContainEqual({
        category: "Initiative",
        description: "Wireless bonus to Initiative",
        modifier: "+2",
      });
    });

    it("should include initiative dice bonus in summary", () => {
      const character = createMinimalCharacter({
        cyberware: [createCyberware("wired-reflexes", [{ type: "initiative_dice", modifier: 1 }])],
      });

      const summary = getWirelessBonusSummary(character);
      expect(summary).toContainEqual({
        category: "Initiative Dice",
        description: "Wireless bonus Initiative Dice",
        modifier: "+1D6",
      });
    });

    it("should include attribute bonuses in summary", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("muscle-toner", [
            { type: "attribute", attribute: "agility", modifier: 1 },
          ]),
        ],
      });

      const summary = getWirelessBonusSummary(character);
      expect(summary).toContainEqual({
        category: "Attribute",
        description: "Wireless bonus to agility",
        modifier: "+1",
      });
    });

    it("should include attack pool bonus in summary", () => {
      const weapons: Weapon[] = [
        {
          id: "weapon-1",
          catalogId: "ares-predator",
          name: "Ares Predator V",
          modifications: [{ catalogId: "smartgun-internal" }],
        } as Weapon,
      ];
      const character = createMinimalCharacter({ weapons });

      const summary = getWirelessBonusSummary(character);
      expect(summary).toContainEqual({
        category: "Attack",
        description: "Wireless bonus to attack pools",
        modifier: "+2",
      });
    });

    it("should include defense pool bonus in summary", () => {
      const character = createMinimalCharacter({
        cyberware: [createCyberware("defense-system", [{ type: "defense_pool", modifier: 2 }])],
      });

      const summary = getWirelessBonusSummary(character);
      expect(summary).toContainEqual({
        category: "Defense",
        description: "Wireless bonus to defense pools",
        modifier: "+2",
      });
    });

    it("should include noise reduction in summary", () => {
      const character = createMinimalCharacter({
        cyberware: [createCyberware("signal-scrubber", [{ type: "noise_reduction", modifier: 2 }])],
      });

      const summary = getWirelessBonusSummary(character);
      expect(summary).toContainEqual({
        category: "Matrix",
        description: "Noise reduction",
        modifier: "-2",
      });
    });

    it("should include multiple bonuses in summary", () => {
      const character = createMinimalCharacter({
        cyberware: [
          createCyberware("multi-effect", [
            { type: "initiative", modifier: 2 },
            { type: "attribute", attribute: "reaction", modifier: 1 },
          ]),
        ],
      });

      const summary = getWirelessBonusSummary(character);
      expect(summary).toHaveLength(2);
    });
  });
});
