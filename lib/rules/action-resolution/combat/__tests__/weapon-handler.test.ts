/**
 * Weapon Handler Tests
 *
 * Tests for weapon-based attack calculations including:
 * - Attack pool calculation
 * - Defense pool calculation
 * - Recoil tracking
 * - Ammunition management
 * - Firing mode bonuses
 * - Range modifiers
 */

import { describe, it, expect } from "vitest";
import type { Character, Weapon } from "@/lib/types";
import {
  getWeaponSkill,
  getAttackType,
  parseDamage,
  calculateRecoilCompensation,
  calculateRecoilPenalty,
  getRangeCategory,
  getRangeModifier,
  calculateAttackPool,
  calculateDefensePool,
  processWeaponAttack,
  finalizeWeaponAttack,
  hasEnoughAmmo,
  consumeAmmo,
  reloadWeapon,
  calculateReachDifferential,
  getMeleeDamage,
  AMMO_CONSUMPTION,
  FIRING_MODE_ATTACK_BONUS,
  FIRING_MODE_DEFENSE_PENALTY,
  CALLED_SHOT_PENALTIES,
} from "../weapon-handler";

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
    skills: {
      automatics: 4,
      pistols: 5,
      blades: 3,
      unarmed_combat: 2,
      gymnastics: 3,
      perception: 4,
    },
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

function createMockWeapon(overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: "weapon-1",
    name: "Ares Predator V",
    category: "weapon",
    subcategory: "heavy_pistol",
    cost: 725,
    availability: 5,
    damage: "8P",
    ap: -1,
    mode: ["SA", "SS"],
    recoil: 1,
    ammoCapacity: 15,
    currentAmmo: 15,
    accuracy: 5,
    ...overrides,
  } as Weapon;
}

function createMockMeleeWeapon(overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: "melee-1",
    name: "Combat Knife",
    category: "weapon",
    subcategory: "blade",
    cost: 300,
    availability: 4,
    damage: "6P",
    ap: -1,
    mode: [],
    reach: 0,
    accuracy: 6,
    ...overrides,
  } as Weapon;
}

// =============================================================================
// WEAPON SKILL MAPPING TESTS
// =============================================================================

describe("getWeaponSkill", () => {
  it("maps pistols correctly", () => {
    const weapon = createMockWeapon({ subcategory: "heavy_pistol" });
    expect(getWeaponSkill(weapon)).toBe("pistols");
  });

  it("maps holdout pistols to pistols", () => {
    const weapon = createMockWeapon({ subcategory: "holdout_pistol" });
    expect(getWeaponSkill(weapon)).toBe("pistols");
  });

  it("maps SMGs to automatics", () => {
    const weapon = createMockWeapon({ subcategory: "smg" });
    expect(getWeaponSkill(weapon)).toBe("automatics");
  });

  it("maps assault rifles to automatics", () => {
    const weapon = createMockWeapon({ subcategory: "assault_rifle" });
    expect(getWeaponSkill(weapon)).toBe("automatics");
  });

  it("maps shotguns to longarms", () => {
    const weapon = createMockWeapon({ subcategory: "shotgun" });
    expect(getWeaponSkill(weapon)).toBe("longarms");
  });

  it("maps sniper rifles to longarms", () => {
    const weapon = createMockWeapon({ subcategory: "sniper_rifle" });
    expect(getWeaponSkill(weapon)).toBe("longarms");
  });

  it("maps machine guns to heavy weapons", () => {
    const weapon = createMockWeapon({ subcategory: "machine_gun" });
    expect(getWeaponSkill(weapon)).toBe("heavy_weapons");
  });

  it("maps blades correctly", () => {
    const weapon = createMockMeleeWeapon({ subcategory: "blade" });
    expect(getWeaponSkill(weapon)).toBe("blades");
  });

  it("maps clubs correctly", () => {
    const weapon = createMockMeleeWeapon({ subcategory: "club" });
    expect(getWeaponSkill(weapon)).toBe("clubs");
  });

  it("defaults to unarmed for unknown types", () => {
    const weapon = createMockWeapon({ subcategory: "unknown" });
    expect(getWeaponSkill(weapon)).toBe("unarmed_combat");
  });
});

describe("getAttackType", () => {
  it("identifies ranged weapons", () => {
    const weapon = createMockWeapon();
    expect(getAttackType(weapon)).toBe("ranged");
  });

  it("identifies melee weapons", () => {
    const weapon = createMockMeleeWeapon();
    expect(getAttackType(weapon)).toBe("melee");
  });

  it("identifies thrown weapons", () => {
    const weapon = createMockWeapon({ subcategory: "throwing_knife" });
    expect(getAttackType(weapon)).toBe("thrown");
  });

  it("identifies grenades as thrown", () => {
    const weapon = createMockWeapon({ subcategory: "grenade" });
    expect(getAttackType(weapon)).toBe("thrown");
  });
});

// =============================================================================
// DAMAGE PARSING TESTS
// =============================================================================

describe("parseDamage", () => {
  it("parses physical damage correctly", () => {
    const result = parseDamage("8P");
    expect(result.value).toBe(8);
    expect(result.type).toBe("physical");
  });

  it("parses stun damage correctly", () => {
    const result = parseDamage("6S");
    expect(result.value).toBe(6);
    expect(result.type).toBe("stun");
  });

  it("parses damage with special effects", () => {
    const result = parseDamage("12P(f)");
    expect(result.value).toBe(12);
    expect(result.type).toBe("physical");
    expect(result.special).toBe("f");
  });

  it("handles lowercase damage codes", () => {
    const result = parseDamage("5p");
    expect(result.value).toBe(5);
    expect(result.type).toBe("physical");
  });

  it("handles invalid damage strings", () => {
    const result = parseDamage("invalid");
    expect(result.value).toBe(0);
    expect(result.type).toBe("stun");
  });
});

// =============================================================================
// RECOIL TESTS
// =============================================================================

describe("calculateRecoilCompensation", () => {
  it("includes base compensation of 1", () => {
    const character = createMockCharacter({ attributes: { strength: 0 } as Character["attributes"] });
    const weapon = createMockWeapon({ recoil: 0 });
    expect(calculateRecoilCompensation(character, weapon)).toBeGreaterThanOrEqual(1);
  });

  it("adds strength / 3 to compensation", () => {
    const character = createMockCharacter();
    const weapon = createMockWeapon({ recoil: 0 });
    // Strength 3 / 3 = 1, plus base 1 = 2
    expect(calculateRecoilCompensation(character, weapon)).toBe(2);
  });

  it("adds weapon recoil compensation", () => {
    const character = createMockCharacter();
    const weapon = createMockWeapon({ recoil: 2 });
    // Base 1 + Strength (3/3=1) + Weapon RC 2 = 4
    expect(calculateRecoilCompensation(character, weapon)).toBe(4);
  });
});

describe("calculateRecoilPenalty", () => {
  it("returns no penalty when under compensation", () => {
    const weapon = createMockWeapon();
    const result = calculateRecoilPenalty(weapon, "SS", 0, 3);
    expect(result.penalty).toBe(0);
  });

  it("calculates penalty when exceeding compensation", () => {
    const weapon = createMockWeapon();
    // 5 previous shots + 1 SS = 6 total, RC 3, penalty = -(6-3) = -3
    const result = calculateRecoilPenalty(weapon, "SS", 5, 3);
    expect(result.penalty).toBe(-3);
  });

  it("tracks progressive recoil correctly", () => {
    const weapon = createMockWeapon();
    const result = calculateRecoilPenalty(weapon, "BF", 3, 5);
    // 3 previous + 3 (BF) = 6 progressive
    expect(result.progressiveRecoil).toBe(6);
  });

  it("applies full-auto recoil correctly", () => {
    const weapon = createMockWeapon();
    // 0 previous + 10 (FA) = 10 total, RC 2, penalty = -8
    const result = calculateRecoilPenalty(weapon, "FA", 0, 2);
    expect(result.penalty).toBe(-8);
    expect(result.progressiveRecoil).toBe(10);
  });
});

// =============================================================================
// RANGE TESTS
// =============================================================================

describe("getRangeCategory", () => {
  it("returns short for close targets", () => {
    const weapon = createMockWeapon();
    expect(getRangeCategory(weapon, 20)).toBe("short");
  });

  it("returns medium for mid-range targets", () => {
    const weapon = createMockWeapon();
    expect(getRangeCategory(weapon, 75)).toBe("medium");
  });

  it("returns long for distant targets", () => {
    const weapon = createMockWeapon();
    expect(getRangeCategory(weapon, 150)).toBe("long");
  });

  it("returns extreme for very distant targets", () => {
    const weapon = createMockWeapon();
    expect(getRangeCategory(weapon, 300)).toBe("extreme");
  });
});

describe("getRangeModifier", () => {
  it("returns no modifier for short range", () => {
    const weapon = createMockWeapon();
    expect(getRangeModifier(weapon, 20)).toBe(0);
  });

  it("returns -1 for medium range", () => {
    const weapon = createMockWeapon();
    expect(getRangeModifier(weapon, 75)).toBe(-1);
  });

  it("returns -3 for long range", () => {
    const weapon = createMockWeapon();
    expect(getRangeModifier(weapon, 150)).toBe(-3);
  });

  it("returns -6 for extreme range", () => {
    const weapon = createMockWeapon();
    expect(getRangeModifier(weapon, 300)).toBe(-6);
  });
});

// =============================================================================
// ATTACK POOL TESTS
// =============================================================================

describe("calculateAttackPool", () => {
  it("calculates base pool from agility + skill", () => {
    const character = createMockCharacter();
    const weapon = createMockWeapon();
    const pool = calculateAttackPool(character, weapon, {
      weaponId: "weapon-1",
      targetId: "target-1",
    });

    // Agility 5 + Pistols 5 = 10
    expect(pool.basePool).toBe(10);
  });

  it("applies weapon accuracy as limit", () => {
    const character = createMockCharacter();
    const weapon = createMockWeapon({ accuracy: 5 });
    const pool = calculateAttackPool(character, weapon, {
      weaponId: "weapon-1",
      targetId: "target-1",
    });

    expect(pool.limit).toBe(5);
  });

  it("adds aim bonus", () => {
    const character = createMockCharacter();
    const weapon = createMockWeapon();
    const pool = calculateAttackPool(character, weapon, {
      weaponId: "weapon-1",
      targetId: "target-1",
      aimBonus: 2,
    });

    const aimMod = pool.modifiers.find((m) => m.description.includes("Take Aim"));
    expect(aimMod).toBeDefined();
    expect(aimMod?.value).toBe(2);
  });

  it("caps aim bonus at +3", () => {
    const character = createMockCharacter();
    const weapon = createMockWeapon();
    const pool = calculateAttackPool(character, weapon, {
      weaponId: "weapon-1",
      targetId: "target-1",
      aimBonus: 5, // More than max
    });

    const aimMod = pool.modifiers.find((m) => m.description.includes("Take Aim"));
    expect(aimMod?.value).toBe(3); // Capped
  });

  it("adds burst fire bonus", () => {
    const character = createMockCharacter();
    const weapon = createMockWeapon({ mode: ["BF"] });
    const pool = calculateAttackPool(character, weapon, {
      weaponId: "weapon-1",
      targetId: "target-1",
      firingMode: "BF",
    });

    const bfMod = pool.modifiers.find((m) => m.description.includes("BF mode"));
    expect(bfMod).toBeDefined();
    expect(bfMod?.value).toBe(2);
  });

  it("adds full-auto bonus", () => {
    const character = createMockCharacter();
    const weapon = createMockWeapon({ mode: ["FA"] });
    const pool = calculateAttackPool(character, weapon, {
      weaponId: "weapon-1",
      targetId: "target-1",
      firingMode: "FA",
    });

    const faMod = pool.modifiers.find((m) => m.description.includes("FA mode"));
    expect(faMod).toBeDefined();
    expect(faMod?.value).toBe(5);
  });

  it("applies called shot penalty", () => {
    const character = createMockCharacter();
    const weapon = createMockWeapon();
    const pool = calculateAttackPool(character, weapon, {
      weaponId: "weapon-1",
      targetId: "target-1",
      calledShot: "head",
    });

    const calledMod = pool.modifiers.find((m) => m.description.includes("Called shot"));
    expect(calledMod).toBeDefined();
    expect(calledMod?.value).toBe(-4);
  });

  it("applies range modifier", () => {
    const character = createMockCharacter();
    const weapon = createMockWeapon();
    const pool = calculateAttackPool(character, weapon, {
      weaponId: "weapon-1",
      targetId: "target-1",
      range: 200, // Long range
    });

    const rangeMod = pool.modifiers.find((m) => m.description.includes("Range"));
    expect(rangeMod).toBeDefined();
    expect(rangeMod?.value).toBe(-3);
  });

  it("applies wound modifiers", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 6, stunDamage: 0 },
    });
    const weapon = createMockWeapon();
    const pool = calculateAttackPool(character, weapon, {
      weaponId: "weapon-1",
      targetId: "target-1",
    });

    const woundMod = pool.modifiers.find((m) => m.source === "wound");
    expect(woundMod).toBeDefined();
    expect(woundMod?.value).toBe(-2); // 6 damage / 3 = -2
  });
});

// =============================================================================
// DEFENSE POOL TESTS
// =============================================================================

describe("calculateDefensePool", () => {
  it("calculates base pool from reaction + intuition", () => {
    const character = createMockCharacter();
    const pool = calculateDefensePool(character, "ranged", {
      weaponId: "weapon-1",
      targetId: "defender-1",
    });

    // Reaction 4 + Intuition 4 = 8
    expect(pool.basePool).toBe(8);
  });

  it("applies full defense bonus", () => {
    const character = createMockCharacter();
    const pool = calculateDefensePool(character, "ranged", {
      weaponId: "weapon-1",
      targetId: "defender-1",
      defenderFullDefense: true,
    });

    const fullDefMod = pool.modifiers.find((m) => m.description.includes("Full Defense"));
    expect(fullDefMod).toBeDefined();
    expect(fullDefMod?.value).toBe(4); // Willpower
  });

  it("applies cover bonus", () => {
    const character = createMockCharacter();
    const pool = calculateDefensePool(character, "ranged", {
      weaponId: "weapon-1",
      targetId: "defender-1",
      defenderInCover: true,
      coverQuality: 3,
    });

    const coverMod = pool.modifiers.find((m) => m.description.includes("Cover"));
    expect(coverMod).toBeDefined();
    expect(coverMod?.value).toBe(3);
  });

  it("applies burst fire defense penalty", () => {
    const character = createMockCharacter();
    const pool = calculateDefensePool(character, "ranged", {
      weaponId: "weapon-1",
      targetId: "defender-1",
      firingMode: "BF",
    });

    const bfMod = pool.modifiers.find((m) => m.description.includes("BF mode"));
    expect(bfMod).toBeDefined();
    expect(bfMod?.value).toBe(-2);
  });

  it("applies full-auto defense penalty", () => {
    const character = createMockCharacter();
    const pool = calculateDefensePool(character, "ranged", {
      weaponId: "weapon-1",
      targetId: "defender-1",
      firingMode: "FA",
    });

    const faMod = pool.modifiers.find((m) => m.description.includes("FA mode"));
    expect(faMod).toBeDefined();
    expect(faMod?.value).toBe(-5);
  });
});

// =============================================================================
// WEAPON ATTACK PROCESSING TESTS
// =============================================================================

describe("processWeaponAttack", () => {
  it("returns complete attack result", () => {
    const attacker = createMockCharacter();
    const defender = createMockCharacter();
    const weapon = createMockWeapon();

    const result = processWeaponAttack(attacker, defender, weapon, {
      weaponId: "weapon-1",
      targetId: "defender-1",
      firingMode: "SA",
    });

    expect(result.attackPool).toBeDefined();
    expect(result.defensePool).toBeDefined();
    expect(result.baseDamage).toBe(8);
    expect(result.damageType).toBe("physical");
    expect(result.armorPenetration).toBe(-1);
    expect(result.ammoExpended).toBe(2); // SA mode
  });

  it("tracks recoil penalty", () => {
    const attacker = createMockCharacter();
    const defender = createMockCharacter();
    const weapon = createMockWeapon({ recoil: 0 });

    const result = processWeaponAttack(attacker, defender, weapon, {
      weaponId: "weapon-1",
      targetId: "defender-1",
      firingMode: "FA",
      previousShots: 5,
    });

    // Total shots: 5 + 10 (FA) = 15
    // RC: 1 (base) + 1 (STR 3/3) = 2
    // Penalty: -(15 - 2) = -13
    expect(result.recoilPenalty).toBe(-13);
    expect(result.progressiveRecoil).toBe(15);
  });
});

describe("finalizeWeaponAttack", () => {
  it("calculates net hits and modified damage", () => {
    const attackResult: ReturnType<typeof processWeaponAttack> = {
      attackPool: { basePool: 10, modifiers: [], totalDice: 10 },
      defensePool: { basePool: 8, modifiers: [], totalDice: 8 },
      baseDamage: 8,
      damageType: "physical",
      armorPenetration: -1,
      ammoExpended: 1,
      recoilPenalty: 0,
      progressiveRecoil: 1,
    };

    const finalized = finalizeWeaponAttack(attackResult, 5, 2);

    expect(finalized.netHits).toBe(3);
    expect(finalized.modifiedDamage).toBe(11); // 8 + 3
  });

  it("adds strength for melee attacks", () => {
    const attackResult: ReturnType<typeof processWeaponAttack> = {
      attackPool: { basePool: 8, modifiers: [], totalDice: 8 },
      defensePool: { basePool: 6, modifiers: [], totalDice: 6 },
      baseDamage: 6,
      damageType: "physical",
      armorPenetration: -1,
      ammoExpended: 0,
      recoilPenalty: 0,
      progressiveRecoil: 0,
    };

    const finalized = finalizeWeaponAttack(attackResult, 4, 1, 3); // STR 3

    expect(finalized.netHits).toBe(3);
    expect(finalized.modifiedDamage).toBe(12); // 6 + 3 (net hits) + 3 (STR)
  });

  it("handles defender winning", () => {
    const attackResult: ReturnType<typeof processWeaponAttack> = {
      attackPool: { basePool: 10, modifiers: [], totalDice: 10 },
      defensePool: { basePool: 8, modifiers: [], totalDice: 8 },
      baseDamage: 8,
      damageType: "physical",
      armorPenetration: -1,
      ammoExpended: 1,
      recoilPenalty: 0,
      progressiveRecoil: 1,
    };

    const finalized = finalizeWeaponAttack(attackResult, 2, 5);

    expect(finalized.netHits).toBe(0);
    expect(finalized.modifiedDamage).toBe(8); // Just base damage
  });
});

// =============================================================================
// AMMUNITION TESTS
// =============================================================================

describe("hasEnoughAmmo", () => {
  it("returns true when enough ammo", () => {
    const weapon = createMockWeapon({ currentAmmo: 15 });
    expect(hasEnoughAmmo(weapon, "FA")).toBe(true);
  });

  it("returns false when not enough ammo", () => {
    const weapon = createMockWeapon({ currentAmmo: 2 });
    expect(hasEnoughAmmo(weapon, "BF")).toBe(false);
  });

  it("returns true for single shot with one round", () => {
    const weapon = createMockWeapon({ currentAmmo: 1 });
    expect(hasEnoughAmmo(weapon, "SS")).toBe(true);
  });
});

describe("consumeAmmo", () => {
  it("consumes correct amount for each mode", () => {
    expect(consumeAmmo(createMockWeapon({ currentAmmo: 15 }), "SS").ammoConsumed).toBe(1);
    expect(consumeAmmo(createMockWeapon({ currentAmmo: 15 }), "SA").ammoConsumed).toBe(2);
    expect(consumeAmmo(createMockWeapon({ currentAmmo: 15 }), "BF").ammoConsumed).toBe(3);
    expect(consumeAmmo(createMockWeapon({ currentAmmo: 15 }), "FA").ammoConsumed).toBe(10);
  });

  it("fails when not enough ammo", () => {
    const weapon = createMockWeapon({ currentAmmo: 5 });
    const result = consumeAmmo(weapon, "FA");
    expect(result.success).toBe(false);
    expect(result.ammoConsumed).toBe(0);
  });

  it("returns remaining ammo after consumption", () => {
    const weapon = createMockWeapon({ currentAmmo: 15 });
    const result = consumeAmmo(weapon, "BF");
    expect(result.ammoRemaining).toBe(12);
  });
});

describe("reloadWeapon", () => {
  it("reloads to full capacity", () => {
    const weapon = createMockWeapon({ ammoCapacity: 15, currentAmmo: 3 });
    const result = reloadWeapon(weapon);
    expect(result.ammoLoaded).toBe(15);
    expect(result.clipRequired).toBe(true);
  });
});

// =============================================================================
// MELEE TESTS
// =============================================================================

describe("calculateReachDifferential", () => {
  it("returns positive when attacker has longer reach", () => {
    const attackerWeapon = createMockMeleeWeapon({ reach: 2 });
    const defenderWeapon = createMockMeleeWeapon({ reach: 0 });
    expect(calculateReachDifferential(attackerWeapon, defenderWeapon)).toBe(2);
  });

  it("returns negative when defender has longer reach", () => {
    const attackerWeapon = createMockMeleeWeapon({ reach: 0 });
    const defenderWeapon = createMockMeleeWeapon({ reach: 2 });
    expect(calculateReachDifferential(attackerWeapon, defenderWeapon)).toBe(-2);
  });

  it("returns zero when reach is equal", () => {
    const attackerWeapon = createMockMeleeWeapon({ reach: 1 });
    const defenderWeapon = createMockMeleeWeapon({ reach: 1 });
    expect(calculateReachDifferential(attackerWeapon, defenderWeapon)).toBe(0);
  });

  it("handles unarmed defender", () => {
    const attackerWeapon = createMockMeleeWeapon({ reach: 1 });
    expect(calculateReachDifferential(attackerWeapon, undefined)).toBe(1);
  });
});

describe("getMeleeDamage", () => {
  it("adds strength to weapon damage", () => {
    const character = createMockCharacter();
    const weapon = createMockMeleeWeapon({ damage: "6P" });
    const result = getMeleeDamage(character, weapon);

    // 6 + STR 3 = 9
    expect(result.value).toBe(9);
    expect(result.type).toBe("physical");
  });

  it("handles stun damage weapons", () => {
    const character = createMockCharacter();
    const weapon = createMockMeleeWeapon({ damage: "4S" });
    const result = getMeleeDamage(character, weapon);

    expect(result.value).toBe(7); // 4 + 3
    expect(result.type).toBe("stun");
  });
});

// =============================================================================
// CONSTANT VERIFICATION TESTS
// =============================================================================

describe("constants", () => {
  it("has correct ammo consumption values", () => {
    expect(AMMO_CONSUMPTION.SS).toBe(1);
    expect(AMMO_CONSUMPTION.SA).toBe(2);
    expect(AMMO_CONSUMPTION.BF).toBe(3);
    expect(AMMO_CONSUMPTION.FA).toBe(10);
  });

  it("has correct firing mode attack bonuses", () => {
    expect(FIRING_MODE_ATTACK_BONUS.SS).toBe(0);
    expect(FIRING_MODE_ATTACK_BONUS.SA).toBe(0);
    expect(FIRING_MODE_ATTACK_BONUS.BF).toBe(2);
    expect(FIRING_MODE_ATTACK_BONUS.FA).toBe(5);
  });

  it("has correct firing mode defense penalties", () => {
    expect(FIRING_MODE_DEFENSE_PENALTY.SS).toBe(0);
    expect(FIRING_MODE_DEFENSE_PENALTY.SA).toBe(0);
    expect(FIRING_MODE_DEFENSE_PENALTY.BF).toBe(-2);
    expect(FIRING_MODE_DEFENSE_PENALTY.FA).toBe(-5);
  });

  it("has correct called shot penalties", () => {
    expect(CALLED_SHOT_PENALTIES.vitals).toBe(-4);
    expect(CALLED_SHOT_PENALTIES.head).toBe(-4);
    expect(CALLED_SHOT_PENALTIES.limb).toBe(-2);
    expect(CALLED_SHOT_PENALTIES.trick_shot).toBe(-6);
  });
});
