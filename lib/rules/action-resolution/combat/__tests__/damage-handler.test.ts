/**
 * Damage Handler Tests
 *
 * Tests for damage calculation, resistance, and application including:
 * - Armor calculations
 * - Resistance pool calculation
 * - Damage application to condition monitors
 * - Wound modifier updates
 * - Overflow damage
 */

import { describe, it, expect } from "vitest";
import type { Character } from "@/lib/types";
import {
  calculatePhysicalMax,
  calculateStunMax,
  calculateOverflowMax,
  getConditionMonitorState,
  getArmorValue,
  calculateModifiedArmor,
  shouldConvertToStun,
  calculateResistancePool,
  buildStunResistancePool,
  applyDamageToMonitor,
  calculateWoundModifierFromState,
  processDamageApplication,
  applyHealing,
  canAct,
  getStatusDescription,
  BASE_PHYSICAL_BOXES,
  BASE_STUN_BOXES,
  KNOCKDOWN_THRESHOLD,
} from "../damage-handler";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    ownerId: "user-1",
    name: "Test Runner",
    editionCode: "sr5",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attributes: {
      body: 4,
      agility: 5,
      reaction: 4,
      strength: 3,
      willpower: 4,
      logic: 3,
      intuition: 4,
      charisma: 3,
      edge: 3,
    },
    skills: {},
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
    },
    armor: [
      {
        id: "armor-1",
        name: "Armor Jacket",
        armorRating: 12,
        equipped: true,
        quantity: 1,
        cost: 1000,
        availability: 2,
        category: "armor",
      },
    ],
    ...overrides,
  } as Character;
}

// =============================================================================
// CONDITION MONITOR CALCULATION TESTS
// =============================================================================

describe("calculatePhysicalMax", () => {
  it("calculates correctly for average body", () => {
    // 8 + ceil(4 / 2) = 8 + 2 = 10
    expect(calculatePhysicalMax(4)).toBe(10);
  });

  it("calculates correctly for high body", () => {
    // 8 + ceil(8 / 2) = 8 + 4 = 12
    expect(calculatePhysicalMax(8)).toBe(12);
  });

  it("calculates correctly for odd body", () => {
    // 8 + ceil(5 / 2) = 8 + 3 = 11
    expect(calculatePhysicalMax(5)).toBe(11);
  });

  it("calculates correctly for low body", () => {
    // 8 + ceil(1 / 2) = 8 + 1 = 9
    expect(calculatePhysicalMax(1)).toBe(9);
  });
});

describe("calculateStunMax", () => {
  it("calculates correctly for average willpower", () => {
    // 8 + ceil(4 / 2) = 8 + 2 = 10
    expect(calculateStunMax(4)).toBe(10);
  });

  it("calculates correctly for high willpower", () => {
    // 8 + ceil(6 / 2) = 8 + 3 = 11
    expect(calculateStunMax(6)).toBe(11);
  });
});

describe("calculateOverflowMax", () => {
  it("equals body attribute", () => {
    expect(calculateOverflowMax(4)).toBe(4);
    expect(calculateOverflowMax(8)).toBe(8);
  });
});

describe("getConditionMonitorState", () => {
  it("returns correct state for healthy character", () => {
    const character = createMockCharacter();
    const state = getConditionMonitorState(character);

    expect(state.physicalDamage).toBe(0);
    expect(state.stunDamage).toBe(0);
    expect(state.overflowDamage).toBe(0);
    expect(state.unconscious).toBe(false);
    expect(state.incapacitated).toBe(false);
    expect(state.dead).toBe(false);
  });

  it("returns correct state for wounded character", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 5, stunDamage: 3 },
    });
    const state = getConditionMonitorState(character);

    expect(state.physicalDamage).toBe(5);
    expect(state.stunDamage).toBe(3);
    expect(state.unconscious).toBe(false);
    expect(state.incapacitated).toBe(false);
  });

  it("returns correct state for unconscious character", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 0, stunDamage: 10 },
    });
    const state = getConditionMonitorState(character);

    expect(state.unconscious).toBe(true);
    expect(state.incapacitated).toBe(false);
  });

  it("returns correct state for incapacitated character", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 10, stunDamage: 0 },
    });
    const state = getConditionMonitorState(character);

    expect(state.incapacitated).toBe(true);
    expect(state.dead).toBe(false);
  });
});

// =============================================================================
// ARMOR TESTS
// =============================================================================

describe("getArmorValue", () => {
  it("returns total equipped armor", () => {
    const character = createMockCharacter();
    expect(getArmorValue(character)).toBe(12);
  });

  it("ignores unequipped armor", () => {
    const character = createMockCharacter({
      armor: [
        {
          id: "armor-1",
          name: "Armor Jacket",
          armorRating: 12,
          equipped: false,
          quantity: 1,
          cost: 1000,
          availability: 2,
          category: "armor",
        },
      ],
    });
    expect(getArmorValue(character)).toBe(0);
  });

  it("stacks multiple equipped armor pieces", () => {
    const character = createMockCharacter({
      armor: [
        {
          id: "armor-1",
          name: "Armor Jacket",
          armorRating: 12,
          equipped: true,
          quantity: 1,
          cost: 1000,
          availability: 2,
          category: "armor",
        },
        {
          id: "armor-2",
          name: "Helmet",
          armorRating: 2,
          equipped: true,
          quantity: 1,
          cost: 100,
          availability: 2,
          category: "armor",
        },
      ],
    });
    expect(getArmorValue(character)).toBe(14);
  });

  it("returns 0 for character with no armor", () => {
    const character = createMockCharacter({ armor: [] });
    expect(getArmorValue(character)).toBe(0);
  });
});

describe("calculateModifiedArmor", () => {
  it("reduces armor by AP (negative value)", () => {
    expect(calculateModifiedArmor(12, -4)).toBe(8);
  });

  it("does not increase armor for positive AP", () => {
    // AP should always be 0 or negative in SR5
    expect(calculateModifiedArmor(12, 2)).toBe(14);
  });

  it("cannot go below zero", () => {
    expect(calculateModifiedArmor(5, -10)).toBe(0);
  });
});

describe("shouldConvertToStun", () => {
  it("converts physical to stun when armor exceeds damage", () => {
    expect(shouldConvertToStun(15, 8, "physical")).toBe(true);
  });

  it("does not convert when damage exceeds armor", () => {
    expect(shouldConvertToStun(8, 15, "physical")).toBe(false);
  });

  it("does not convert stun damage", () => {
    expect(shouldConvertToStun(15, 8, "stun")).toBe(false);
  });

  it("does not convert when equal", () => {
    expect(shouldConvertToStun(10, 10, "physical")).toBe(false);
  });
});

// =============================================================================
// RESISTANCE POOL TESTS
// =============================================================================

describe("calculateResistancePool", () => {
  it("includes body + modified armor", () => {
    const character = createMockCharacter();
    const result = calculateResistancePool(character, {
      targetId: "target-1",
      damageType: "physical",
      damageValue: 10,
      armorPenetration: -2,
    });

    // Body 4 + (12 - 2) = 4 + 10 = 14
    expect(result.pool.basePool).toBe(4);
    expect(result.modifiedArmor).toBe(10);
    // Total should include armor as modifier
    expect(result.pool.totalDice).toBe(14);
  });

  it("detects when damage should convert to stun", () => {
    const character = createMockCharacter();
    const result = calculateResistancePool(character, {
      targetId: "target-1",
      damageType: "physical",
      damageValue: 8,
      armorPenetration: 0, // Armor 12 > damage 8
    });

    expect(result.damageConvertedToStun).toBe(true);
  });

  it("does not convert when damage exceeds armor", () => {
    const character = createMockCharacter();
    const result = calculateResistancePool(character, {
      targetId: "target-1",
      damageType: "physical",
      damageValue: 15,
      armorPenetration: -4,
    });

    expect(result.damageConvertedToStun).toBe(false);
  });
});

describe("buildStunResistancePool", () => {
  it("uses willpower + armor for stun", () => {
    const character = createMockCharacter();
    const pool = buildStunResistancePool(character);

    // Willpower 4 + Armor 12 = 16
    expect(pool.basePool).toBe(4);
    expect(pool.totalDice).toBe(16);
  });
});

// =============================================================================
// DAMAGE APPLICATION TESTS
// =============================================================================

describe("applyDamageToMonitor", () => {
  it("applies physical damage to physical track", () => {
    const state = {
      physicalDamage: 0,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    const newState = applyDamageToMonitor(state, 5, "physical");
    expect(newState.physicalDamage).toBe(5);
    expect(newState.stunDamage).toBe(0);
  });

  it("applies stun damage to stun track", () => {
    const state = {
      physicalDamage: 0,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    const newState = applyDamageToMonitor(state, 5, "stun");
    expect(newState.stunDamage).toBe(5);
    expect(newState.physicalDamage).toBe(0);
  });

  it("overflows physical damage to overflow track", () => {
    const state = {
      physicalDamage: 8,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    const newState = applyDamageToMonitor(state, 5, "physical");
    expect(newState.physicalDamage).toBe(10);
    expect(newState.overflowDamage).toBe(3);
    expect(newState.incapacitated).toBe(true);
  });

  it("converts overflow stun to physical (2:1)", () => {
    const state = {
      physicalDamage: 0,
      physicalMax: 10,
      stunDamage: 8,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    // 6 stun: 2 fill stun track, 4 overflow = 2 physical
    const newState = applyDamageToMonitor(state, 6, "stun");
    expect(newState.stunDamage).toBe(10);
    expect(newState.physicalDamage).toBe(2); // ceil(4/2) = 2
    expect(newState.unconscious).toBe(true);
  });

  it("sets dead flag when overflow is full", () => {
    const state = {
      physicalDamage: 10,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 3,
      overflowMax: 4,
      unconscious: false,
      incapacitated: true,
      dead: false,
    };

    const newState = applyDamageToMonitor(state, 5, "physical");
    expect(newState.overflowDamage).toBe(4);
    expect(newState.dead).toBe(true);
  });
});

describe("calculateWoundModifierFromState", () => {
  it("returns 0 for healthy character", () => {
    const state = {
      physicalDamage: 0,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    expect(calculateWoundModifierFromState(state)).toBe(0);
  });

  it("returns -1 for 3 boxes of damage", () => {
    const state = {
      physicalDamage: 3,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    expect(calculateWoundModifierFromState(state)).toBe(-1);
  });

  it("combines physical and stun damage", () => {
    const state = {
      physicalDamage: 3,
      physicalMax: 10,
      stunDamage: 3,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    expect(calculateWoundModifierFromState(state)).toBe(-2);
  });

  it("caps at -4", () => {
    const state = {
      physicalDamage: 9,
      physicalMax: 10,
      stunDamage: 9,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    expect(calculateWoundModifierFromState(state)).toBe(-4);
  });
});

// =============================================================================
// FULL DAMAGE PROCESSING TESTS
// =============================================================================

describe("processDamageApplication", () => {
  it("processes complete damage application", () => {
    const character = createMockCharacter();
    const result = processDamageApplication(
      character,
      {
        targetId: "target-1",
        damageType: "physical",
        damageValue: 10,
        armorPenetration: -4,
      },
      3 // 3 resistance hits
    );

    // Damage 10 - 3 hits = 7
    expect(result.damageDealt).toBe(7);
    expect(result.conditionMonitorState.physicalDamage).toBe(7);
  });

  it("tracks wound modifier changes", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 2, stunDamage: 0 },
    });

    const result = processDamageApplication(
      character,
      {
        targetId: "target-1",
        damageType: "physical",
        damageValue: 5,
        armorPenetration: 0,
      },
      2
    );

    // Started at 2 damage (0 modifier), added 3 = 5 damage (-1 modifier)
    expect(result.previousWoundModifier).toBe(0);
    expect(result.newWoundModifier).toBe(-1);
    expect(result.woundModifierChange).toBe(-1);
  });

  it("converts physical to stun when armor exceeds damage", () => {
    const character = createMockCharacter();

    const result = processDamageApplication(
      character,
      {
        targetId: "target-1",
        damageType: "physical",
        damageValue: 8, // Armor 12 > 8
        armorPenetration: 0,
      },
      5
    );

    expect(result.damageConverted).toBe(true);
    expect(result.conditionMonitorState.stunDamage).toBe(3);
    expect(result.conditionMonitorState.physicalDamage).toBe(0);
  });

  it("triggers knockdown for massive damage", () => {
    const character = createMockCharacter({ armor: [] }); // No armor

    const result = processDamageApplication(
      character,
      {
        targetId: "target-1",
        damageType: "physical",
        damageValue: 15,
        armorPenetration: 0,
      },
      2 // Only 2 resistance hits
    );

    // 15 - 2 = 13 damage dealt
    expect(result.damageDealt).toBe(13);
    expect(result.knockdown).toBe(true);
  });

  it("includes triggered effects for status changes", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 8, stunDamage: 0 },
    });

    const result = processDamageApplication(
      character,
      {
        targetId: "target-1",
        damageType: "physical",
        damageValue: 10,
        armorPenetration: -6,
      },
      2
    );

    expect(result.triggeredEffects).toContain("Target is now incapacitated");
  });

  it("prevents negative damage dealt", () => {
    const character = createMockCharacter();

    const result = processDamageApplication(
      character,
      {
        targetId: "target-1",
        damageType: "physical",
        damageValue: 5,
        armorPenetration: 0,
      },
      10 // More resistance than damage
    );

    expect(result.damageDealt).toBe(0);
    expect(result.conditionMonitorState.physicalDamage).toBe(0);
  });
});

// =============================================================================
// HEALING TESTS
// =============================================================================

describe("applyHealing", () => {
  it("heals physical damage", () => {
    const state = {
      physicalDamage: 5,
      physicalMax: 10,
      stunDamage: 3,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    const newState = applyHealing(state, 3, "physical");
    expect(newState.physicalDamage).toBe(2);
    expect(newState.stunDamage).toBe(3);
  });

  it("heals stun damage", () => {
    const state = {
      physicalDamage: 5,
      physicalMax: 10,
      stunDamage: 6,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    const newState = applyHealing(state, 4, "stun");
    expect(newState.stunDamage).toBe(2);
    expect(newState.physicalDamage).toBe(5);
  });

  it("cannot heal below zero", () => {
    const state = {
      physicalDamage: 3,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    const newState = applyHealing(state, 10, "physical");
    expect(newState.physicalDamage).toBe(0);
  });

  it("removes unconscious status when stun healed", () => {
    const state = {
      physicalDamage: 0,
      physicalMax: 10,
      stunDamage: 10,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: true,
      incapacitated: false,
      dead: false,
    };

    const newState = applyHealing(state, 3, "stun");
    expect(newState.stunDamage).toBe(7);
    expect(newState.unconscious).toBe(false);
  });
});

// =============================================================================
// STATUS TESTS
// =============================================================================

describe("canAct", () => {
  it("returns true for healthy character", () => {
    const state = {
      physicalDamage: 5,
      physicalMax: 10,
      stunDamage: 3,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    expect(canAct(state)).toBe(true);
  });

  it("returns false for unconscious character", () => {
    const state = {
      physicalDamage: 0,
      physicalMax: 10,
      stunDamage: 10,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: true,
      incapacitated: false,
      dead: false,
    };

    expect(canAct(state)).toBe(false);
  });

  it("returns false for incapacitated character", () => {
    const state = {
      physicalDamage: 10,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 2,
      overflowMax: 4,
      unconscious: false,
      incapacitated: true,
      dead: false,
    };

    expect(canAct(state)).toBe(false);
  });

  it("returns false for dead character", () => {
    const state = {
      physicalDamage: 10,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 4,
      overflowMax: 4,
      unconscious: false,
      incapacitated: true,
      dead: true,
    };

    expect(canAct(state)).toBe(false);
  });
});

describe("getStatusDescription", () => {
  it("returns Dead for dead character", () => {
    const state = {
      physicalDamage: 10,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 4,
      overflowMax: 4,
      unconscious: false,
      incapacitated: true,
      dead: true,
    };

    expect(getStatusDescription(state)).toBe("Dead");
  });

  it("returns Incapacitated for incapacitated character", () => {
    const state = {
      physicalDamage: 10,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 2,
      overflowMax: 4,
      unconscious: false,
      incapacitated: true,
      dead: false,
    };

    expect(getStatusDescription(state)).toBe("Incapacitated");
  });

  it("returns Unconscious for unconscious character", () => {
    const state = {
      physicalDamage: 0,
      physicalMax: 10,
      stunDamage: 10,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: true,
      incapacitated: false,
      dead: false,
    };

    expect(getStatusDescription(state)).toBe("Unconscious");
  });

  it("returns Wounded with modifier for wounded character", () => {
    const state = {
      physicalDamage: 6,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    const desc = getStatusDescription(state);
    expect(desc).toContain("Wounded");
    expect(desc).toContain("-2");
  });

  it("returns Healthy for undamaged character", () => {
    const state = {
      physicalDamage: 0,
      physicalMax: 10,
      stunDamage: 0,
      stunMax: 10,
      overflowDamage: 0,
      overflowMax: 4,
      unconscious: false,
      incapacitated: false,
      dead: false,
    };

    expect(getStatusDescription(state)).toBe("Healthy");
  });
});

// =============================================================================
// CONSTANT VERIFICATION TESTS
// =============================================================================

describe("constants", () => {
  it("has correct base physical boxes", () => {
    expect(BASE_PHYSICAL_BOXES).toBe(8);
  });

  it("has correct base stun boxes", () => {
    expect(BASE_STUN_BOXES).toBe(8);
  });

  it("has correct knockdown threshold", () => {
    expect(KNOCKDOWN_THRESHOLD).toBe(10);
  });
});
