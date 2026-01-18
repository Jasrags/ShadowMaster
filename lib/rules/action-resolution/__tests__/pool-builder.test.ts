/**
 * Unit tests for pool-builder.ts
 *
 * Tests action pool building from character attributes, skills,
 * wound modifiers, limits, and external integrations.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  Character,
  ActionPool,
  PoolModifier,
  PoolBuildOptions,
  EditionDiceRules,
} from "@/lib/types";
import type { EncumbranceState } from "@/lib/types/gear-state";
import type { ActiveWirelessBonuses } from "@/lib/types/wireless-effects";

// Mock external dependencies
vi.mock("@/lib/rules/encumbrance/calculator", () => ({
  calculateEncumbrance: vi.fn(),
}));

vi.mock("@/lib/rules/wireless/bonus-calculator", () => ({
  calculateContextualWirelessBonuses: vi.fn(),
}));

import {
  calculateWoundModifier,
  createWoundModifier,
  getAttributeValue,
  getSkillRating,
  hasSpecialization,
  calculateLimit,
  buildActionPool,
  buildSimplePool,
  addModifiersToPool,
  applyLimitToPool,
  buildAttackPool,
  buildDefensePool,
  buildResistancePool,
  buildSpellcastingPool,
  buildPerceptionPool,
  createEncumbranceModifier,
  createWirelessModifiers,
  createCombinedWirelessModifier,
  buildEnhancedActionPool,
  buildEnhancedAttackPool,
  buildEnhancedDefensePool,
} from "../pool-builder";
import { DEFAULT_DICE_RULES } from "../dice-engine";
import { calculateEncumbrance } from "@/lib/rules/encumbrance/calculator";
import { calculateContextualWirelessBonuses } from "@/lib/rules/wireless/bonus-calculator";

// =============================================================================
// HELPERS
// =============================================================================

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    ownerId: "user-1",
    editionCode: "sr5",
    name: "Test Runner",
    status: "active",
    approvalStatus: "approved",
    karma: 0,
    totalKarma: 25,
    nuyen: 5000,
    totalNuyen: 10000,
    streetCred: 0,
    notoriety: 0,
    publicAwareness: 0,
    metatype: "human",
    attributes: {
      body: 4,
      agility: 5,
      reaction: 4,
      strength: 3,
      charisma: 3,
      intuition: 4,
      logic: 3,
      willpower: 4,
      edge: 3,
      magic: 0,
      resonance: 0,
      essence: 6,
    },
    skills: {
      firearms: 4,
      stealth: 3,
      perception: 3,
      spellcasting: 0,
    },
    knowledgeSkills: [
      { name: "Seattle Gangs", rating: 3 },
      { name: "Corporate Politics", rating: 2 },
    ],
    specializations: [],
    languageSkills: [],
    positiveQualities: [],
    negativeQualities: [],
    contacts: [],
    lifestyles: [],
    weapons: [],
    armor: [],
    gear: [],
    vehicles: [],
    cyberware: [],
    bioware: [],
    spells: [],
    complexForms: [],
    adeptPowers: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

// =============================================================================
// calculateWoundModifier TESTS
// =============================================================================

describe("calculateWoundModifier", () => {
  it("should return 0 for no damage", () => {
    expect(calculateWoundModifier(0, 0)).toBe(0);
  });

  it("should return 0 for less than 3 boxes of damage", () => {
    expect(calculateWoundModifier(1, 0)).toBe(0);
    expect(calculateWoundModifier(0, 2)).toBe(0);
    expect(calculateWoundModifier(1, 1)).toBe(0);
  });

  it("should return -1 for 3-5 boxes of damage", () => {
    expect(calculateWoundModifier(3, 0)).toBe(-1);
    expect(calculateWoundModifier(2, 1)).toBe(-1);
    expect(calculateWoundModifier(0, 5)).toBe(-1);
  });

  it("should return -2 for 6-8 boxes of damage", () => {
    expect(calculateWoundModifier(6, 0)).toBe(-2);
    expect(calculateWoundModifier(3, 3)).toBe(-2);
    expect(calculateWoundModifier(4, 4)).toBe(-2);
  });

  it("should combine physical and stun damage", () => {
    // 5P + 4S = 9 total = -3 penalty
    expect(calculateWoundModifier(5, 4)).toBe(-3);
  });

  it("should cap at max penalty (-4 by default)", () => {
    expect(calculateWoundModifier(15, 15)).toBe(-4);
    expect(calculateWoundModifier(100, 0)).toBe(-4);
  });

  it("should use custom max penalty from rules", () => {
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      woundModifiers: {
        boxesPerPenalty: 3,
        maxPenalty: -6,
      },
    };
    // 20 damage = -6 (capped, would be -6.67)
    expect(calculateWoundModifier(20, 0, rules)).toBe(-6);
  });

  it("should use custom boxes per penalty from rules", () => {
    const rules: EditionDiceRules = {
      ...DEFAULT_DICE_RULES,
      woundModifiers: {
        boxesPerPenalty: 2, // -1 per 2 damage
        maxPenalty: -10,
      },
    };
    // 6 damage / 2 = -3
    expect(calculateWoundModifier(6, 0, rules)).toBe(-3);
  });
});

// =============================================================================
// createWoundModifier TESTS
// =============================================================================

describe("createWoundModifier", () => {
  it("should return null for unwounded character", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 0, stunDamage: 0 },
    });
    expect(createWoundModifier(character)).toBeNull();
  });

  it("should return null for character with no condition", () => {
    const character = createMockCharacter();
    delete (character as Partial<Character>).condition;
    expect(createWoundModifier(character)).toBeNull();
  });

  it("should return modifier for wounded character", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 6, stunDamage: 0 },
    });
    const modifier = createWoundModifier(character);

    expect(modifier).not.toBeNull();
    expect(modifier?.source).toBe("wound");
    expect(modifier?.value).toBe(-2);
    expect(modifier?.description).toContain("6P");
  });

  it("should include both damage types in description", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 3, stunDamage: 3 },
    });
    const modifier = createWoundModifier(character);

    expect(modifier?.description).toContain("3P");
    expect(modifier?.description).toContain("3S");
  });
});

// =============================================================================
// getAttributeValue TESTS
// =============================================================================

describe("getAttributeValue", () => {
  const character = createMockCharacter();

  it("should return attribute value by full name", () => {
    expect(getAttributeValue(character, "body")).toBe(4);
    expect(getAttributeValue(character, "agility")).toBe(5);
    expect(getAttributeValue(character, "reaction")).toBe(4);
    expect(getAttributeValue(character, "strength")).toBe(3);
    expect(getAttributeValue(character, "willpower")).toBe(4);
    expect(getAttributeValue(character, "logic")).toBe(3);
    expect(getAttributeValue(character, "intuition")).toBe(4);
    expect(getAttributeValue(character, "charisma")).toBe(3);
    expect(getAttributeValue(character, "edge")).toBe(3);
    expect(getAttributeValue(character, "magic")).toBe(0);
    expect(getAttributeValue(character, "resonance")).toBe(0);
  });

  it("should return attribute value by abbreviation", () => {
    expect(getAttributeValue(character, "bod")).toBe(4);
    expect(getAttributeValue(character, "agi")).toBe(5);
    expect(getAttributeValue(character, "rea")).toBe(4);
    expect(getAttributeValue(character, "str")).toBe(3);
    expect(getAttributeValue(character, "wil")).toBe(4);
    expect(getAttributeValue(character, "log")).toBe(3);
    expect(getAttributeValue(character, "int")).toBe(4);
    expect(getAttributeValue(character, "cha")).toBe(3);
    expect(getAttributeValue(character, "mag")).toBe(0);
    expect(getAttributeValue(character, "res")).toBe(0);
  });

  it("should be case insensitive", () => {
    expect(getAttributeValue(character, "BODY")).toBe(4);
    expect(getAttributeValue(character, "Body")).toBe(4);
    expect(getAttributeValue(character, "AGI")).toBe(5);
  });

  it("should return 0 for unknown attribute", () => {
    expect(getAttributeValue(character, "unknown")).toBe(0);
    expect(getAttributeValue(character, "fake")).toBe(0);
  });

  it("should return 0 if character has no attributes", () => {
    const emptyChar = createMockCharacter();
    delete (emptyChar as Partial<Character>).attributes;
    expect(getAttributeValue(emptyChar, "body")).toBe(0);
  });
});

// =============================================================================
// getSkillRating TESTS
// =============================================================================

describe("getSkillRating", () => {
  const character = createMockCharacter();

  it("should return skill rating for active skills", () => {
    expect(getSkillRating(character, "firearms")).toBe(4);
    expect(getSkillRating(character, "stealth")).toBe(3);
  });

  it("should be case insensitive", () => {
    expect(getSkillRating(character, "FIREARMS")).toBe(4);
    expect(getSkillRating(character, "Firearms")).toBe(4);
  });

  it("should return 0 for unknown skill", () => {
    expect(getSkillRating(character, "nonexistent")).toBe(0);
  });

  it("should return rating from knowledge skills", () => {
    expect(getSkillRating(character, "Seattle Gangs")).toBe(3);
    expect(getSkillRating(character, "Corporate Politics")).toBe(2);
  });

  it("should be case insensitive for knowledge skills", () => {
    expect(getSkillRating(character, "seattle gangs")).toBe(3);
  });

  it("should return 0 if character has no skills", () => {
    const emptyChar = createMockCharacter();
    delete (emptyChar as Partial<Character>).skills;
    expect(getSkillRating(emptyChar, "firearms")).toBe(0);
  });
});

// =============================================================================
// hasSpecialization TESTS
// =============================================================================

describe("hasSpecialization", () => {
  it("should return false (placeholder implementation)", () => {
    const character = createMockCharacter();
    expect(hasSpecialization(character, "firearms", "pistols")).toBe(false);
  });
});

// =============================================================================
// calculateLimit TESTS
// =============================================================================

describe("calculateLimit", () => {
  it("should calculate physical limit correctly", () => {
    const character = createMockCharacter({
      attributes: {
        body: 4,
        agility: 5,
        reaction: 4,
        strength: 3, // (3 + 4 + 4) / 3 = 3.67 -> ceil = 4
        charisma: 3,
        intuition: 4,
        logic: 3,
        willpower: 4,
        edge: 3,
        magic: 0,
        resonance: 0,
        essence: 6,
      },
    });
    expect(calculateLimit(character, "physical")).toBe(4);
  });

  it("should calculate mental limit correctly", () => {
    const character = createMockCharacter({
      attributes: {
        body: 4,
        agility: 5,
        reaction: 4,
        strength: 3,
        charisma: 3,
        intuition: 4,
        logic: 3, // (3 + 4 + 4) / 3 = 3.67 -> ceil = 4
        willpower: 4,
        edge: 3,
        magic: 0,
        resonance: 0,
        essence: 6,
      },
    });
    expect(calculateLimit(character, "mental")).toBe(4);
  });

  it("should calculate social limit correctly", () => {
    const character = createMockCharacter({
      attributes: {
        body: 4,
        agility: 5,
        reaction: 4,
        strength: 3,
        charisma: 3, // (3 + 4 + 6) / 3 = 4.33 -> ceil = 5
        intuition: 4,
        logic: 3,
        willpower: 4,
        edge: 3,
        magic: 0,
        resonance: 0,
        essence: 6,
      },
      derivedStats: { essence: 6 },
    });
    expect(calculateLimit(character, "social")).toBe(5);
  });

  it("should use essence from derivedStats if available", () => {
    const character = createMockCharacter({
      attributes: {
        body: 4,
        agility: 5,
        reaction: 4,
        strength: 3,
        charisma: 3, // (3 + 4 + 3) / 3 = 3.33 -> ceil = 4
        intuition: 4,
        logic: 3,
        willpower: 4,
        edge: 3,
        magic: 0,
        resonance: 0,
        essence: 6,
      },
      derivedStats: { essence: 3 },
    });
    expect(calculateLimit(character, "social")).toBe(4);
  });

  it("should return 0 if no attributes", () => {
    const character = createMockCharacter();
    delete (character as Partial<Character>).attributes;
    expect(calculateLimit(character, "physical")).toBe(0);
  });

  it("should round up (ceil) the limit", () => {
    const character = createMockCharacter({
      attributes: {
        body: 1,
        agility: 1,
        reaction: 1,
        strength: 1, // (1 + 1 + 1) / 3 = 1
        charisma: 1,
        intuition: 1,
        logic: 1,
        willpower: 1,
        edge: 1,
        magic: 0,
        resonance: 0,
        essence: 6,
      },
    });
    expect(calculateLimit(character, "physical")).toBe(1);
  });
});

// =============================================================================
// buildActionPool TESTS
// =============================================================================

describe("buildActionPool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should build pool from attribute and skill", () => {
    const character = createMockCharacter();
    const pool = buildActionPool(character, {
      attribute: "agility",
      skill: "firearms",
    });

    expect(pool.basePool).toBe(9); // 5 AGI + 4 Firearms
    expect(pool.totalDice).toBe(9);
    expect(pool.attribute).toBe("agility");
    expect(pool.skill).toBe("firearms");
  });

  it("should use manualPool override", () => {
    const character = createMockCharacter();
    const pool = buildActionPool(character, {
      manualPool: 12,
    });

    expect(pool.basePool).toBe(12);
    expect(pool.totalDice).toBe(12);
  });

  it("should apply wound modifier by default", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 6, stunDamage: 0 },
    });
    const pool = buildActionPool(character, {
      attribute: "agility",
      skill: "firearms",
    });

    // 9 base - 2 wound = 7
    expect(pool.totalDice).toBe(7);
    expect(pool.modifiers).toContainEqual(expect.objectContaining({ source: "wound", value: -2 }));
  });

  it("should skip wound modifier when includeWoundModifiers is false", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 6, stunDamage: 0 },
    });
    const pool = buildActionPool(character, {
      attribute: "agility",
      skill: "firearms",
      includeWoundModifiers: false,
    });

    expect(pool.totalDice).toBe(9);
    expect(pool.modifiers.find((m) => m.source === "wound")).toBeUndefined();
  });

  it("should apply situational modifiers", () => {
    const character = createMockCharacter();
    const pool = buildActionPool(character, {
      attribute: "agility",
      skill: "firearms",
      situationalModifiers: [
        { source: "environmental", value: -2, description: "Cover" },
        { source: "equipment", value: 2, description: "Smartgun" },
      ],
    });

    expect(pool.totalDice).toBe(9); // Net 0 modifier
    expect(pool.modifiers).toHaveLength(2);
  });

  it("should include limit information", () => {
    const character = createMockCharacter();
    const pool = buildActionPool(character, {
      attribute: "agility",
      skill: "firearms",
      limit: 6,
      limitSource: "Weapon Accuracy",
    });

    expect(pool.limit).toBe(6);
    expect(pool.limitSource).toBe("Weapon Accuracy");
  });

  it("should not go below zero total dice", () => {
    const character = createMockCharacter();
    const pool = buildActionPool(character, {
      manualPool: 2,
      situationalModifiers: [{ source: "situational", value: -10, description: "Big penalty" }],
    });

    expect(pool.totalDice).toBe(0);
  });

  it("should handle attribute only (no skill)", () => {
    const character = createMockCharacter();
    const pool = buildActionPool(character, {
      attribute: "body",
    });

    expect(pool.basePool).toBe(4);
    expect(pool.totalDice).toBe(4);
  });

  it("should handle skill only (no attribute)", () => {
    const character = createMockCharacter();
    const pool = buildActionPool(character, {
      skill: "firearms",
    });

    expect(pool.basePool).toBe(4);
    expect(pool.totalDice).toBe(4);
  });
});

// =============================================================================
// buildSimplePool TESTS
// =============================================================================

describe("buildSimplePool", () => {
  it("should create pool with given dice count", () => {
    const pool = buildSimplePool(10);

    expect(pool.basePool).toBe(10);
    expect(pool.totalDice).toBe(10);
    expect(pool.modifiers).toEqual([]);
  });

  it("should not go below zero", () => {
    const pool = buildSimplePool(-5);

    expect(pool.totalDice).toBe(0);
  });
});

// =============================================================================
// addModifiersToPool TESTS
// =============================================================================

describe("addModifiersToPool", () => {
  it("should add modifiers to existing pool", () => {
    const pool: ActionPool = {
      basePool: 10,
      modifiers: [],
      totalDice: 10,
    };
    const modifier: PoolModifier = {
      source: "situational",
      value: 2,
      description: "High ground",
    };

    const result = addModifiersToPool(pool, modifier);

    expect(result.modifiers).toHaveLength(1);
    expect(result.totalDice).toBe(12);
  });

  it("should add multiple modifiers at once", () => {
    const pool: ActionPool = {
      basePool: 10,
      modifiers: [],
      totalDice: 10,
    };

    const result = addModifiersToPool(
      pool,
      { source: "situational", value: 2, description: "Bonus 1" },
      { source: "environmental", value: -1, description: "Penalty" }
    );

    expect(result.modifiers).toHaveLength(2);
    expect(result.totalDice).toBe(11);
  });

  it("should preserve existing modifiers", () => {
    const pool: ActionPool = {
      basePool: 10,
      modifiers: [{ source: "situational", value: 1, description: "Existing" }],
      totalDice: 11,
    };

    const result = addModifiersToPool(pool, {
      source: "other",
      value: 2,
      description: "New",
    });

    expect(result.modifiers).toHaveLength(2);
    expect(result.totalDice).toBe(13);
  });

  it("should not mutate original pool", () => {
    const pool: ActionPool = {
      basePool: 10,
      modifiers: [],
      totalDice: 10,
    };

    addModifiersToPool(pool, { source: "situational", value: 2, description: "Test" });

    expect(pool.modifiers).toHaveLength(0);
    expect(pool.totalDice).toBe(10);
  });

  it("should clamp totalDice to zero minimum", () => {
    const pool: ActionPool = {
      basePool: 2,
      modifiers: [],
      totalDice: 2,
    };

    const result = addModifiersToPool(pool, {
      source: "situational",
      value: -10,
      description: "Big penalty",
    });

    expect(result.totalDice).toBe(0);
  });
});

// =============================================================================
// applyLimitToPool TESTS
// =============================================================================

describe("applyLimitToPool", () => {
  it("should set limit on pool", () => {
    const pool: ActionPool = {
      basePool: 10,
      modifiers: [],
      totalDice: 10,
    };

    const result = applyLimitToPool(pool, 6, "Physical");

    expect(result.limit).toBe(6);
    expect(result.limitSource).toBe("Physical");
  });

  it("should preserve other pool properties", () => {
    const pool: ActionPool = {
      basePool: 10,
      modifiers: [{ source: "situational", value: 2, description: "Test" }],
      totalDice: 12,
      attribute: "agility",
      skill: "firearms",
    };

    const result = applyLimitToPool(pool, 5, "Mental");

    expect(result.basePool).toBe(10);
    expect(result.modifiers).toEqual(pool.modifiers);
    expect(result.totalDice).toBe(12);
    expect(result.attribute).toBe("agility");
    expect(result.skill).toBe("firearms");
  });
});

// =============================================================================
// buildAttackPool TESTS
// =============================================================================

describe("buildAttackPool", () => {
  it("should build attack pool with agility and skill", () => {
    const character = createMockCharacter();
    const pool = buildAttackPool(character, "firearms");

    expect(pool.attribute).toBe("agility");
    expect(pool.skill).toBe("firearms");
    expect(pool.basePool).toBe(9); // 5 AGI + 4 Firearms
  });

  it("should apply weapon accuracy as limit", () => {
    const character = createMockCharacter();
    const pool = buildAttackPool(character, "firearms", 5);

    expect(pool.limit).toBe(5);
    expect(pool.limitSource).toBe("Weapon Accuracy");
  });

  it("should apply situational modifiers", () => {
    const character = createMockCharacter();
    const pool = buildAttackPool(character, "firearms", undefined, [
      { source: "environmental", value: -2, description: "Long range" },
    ]);

    expect(pool.totalDice).toBe(7); // 9 - 2
  });
});

// =============================================================================
// buildDefensePool TESTS
// =============================================================================

describe("buildDefensePool", () => {
  it("should build defense pool with reaction + intuition", () => {
    const character = createMockCharacter();
    const pool = buildDefensePool(character);

    // REA 4 + INT 4 = 8
    expect(pool.basePool).toBe(8);
    expect(pool.totalDice).toBe(8);
  });

  it("should apply situational modifiers", () => {
    const character = createMockCharacter();
    const pool = buildDefensePool(character, [
      { source: "environmental", value: 2, description: "Cover" },
    ]);

    expect(pool.totalDice).toBe(10);
  });
});

// =============================================================================
// buildResistancePool TESTS
// =============================================================================

describe("buildResistancePool", () => {
  it("should build resistance pool with body + armor", () => {
    const character = createMockCharacter();
    const pool = buildResistancePool(character, 12);

    // BOD 4 + Armor 12 = 16
    expect(pool.basePool).toBe(4);
    expect(pool.totalDice).toBe(16);
  });

  it("should not apply wound modifiers", () => {
    const character = createMockCharacter({
      condition: { physicalDamage: 6, stunDamage: 0 },
    });
    const pool = buildResistancePool(character, 12);

    // Should still be 16 despite wounds
    expect(pool.totalDice).toBe(16);
    expect(pool.modifiers.find((m) => m.source === "wound")).toBeUndefined();
  });

  it("should include armor as equipment modifier", () => {
    const character = createMockCharacter();
    const pool = buildResistancePool(character, 12);

    expect(pool.modifiers).toContainEqual(
      expect.objectContaining({ source: "equipment", value: 12 })
    );
  });
});

// =============================================================================
// buildSpellcastingPool TESTS
// =============================================================================

describe("buildSpellcastingPool", () => {
  it("should build spellcasting pool with magic + skill", () => {
    const character = createMockCharacter({
      attributes: {
        body: 4,
        agility: 5,
        reaction: 4,
        strength: 3,
        charisma: 3,
        intuition: 4,
        logic: 3,
        willpower: 4,
        edge: 3,
        magic: 5,
        resonance: 0,
        essence: 6,
      },
      skills: {
        spellcasting: 4,
      },
    });
    const pool = buildSpellcastingPool(character, 6);

    expect(pool.attribute).toBe("magic");
    expect(pool.skill).toBe("spellcasting");
    expect(pool.basePool).toBe(9); // MAG 5 + Spellcasting 4
    expect(pool.limit).toBe(6);
    expect(pool.limitSource).toBe("Force");
  });
});

// =============================================================================
// buildPerceptionPool TESTS
// =============================================================================

describe("buildPerceptionPool", () => {
  it("should build perception pool with intuition + skill", () => {
    const character = createMockCharacter();
    const pool = buildPerceptionPool(character);

    expect(pool.attribute).toBe("intuition");
    expect(pool.skill).toBe("perception");
    expect(pool.basePool).toBe(7); // INT 4 + Perception 3
    expect(pool.limitSource).toBe("Mental Limit");
  });
});

// =============================================================================
// createEncumbranceModifier TESTS
// =============================================================================

describe("createEncumbranceModifier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when not encumbered", () => {
    vi.mocked(calculateEncumbrance).mockReturnValue({
      currentWeight: 10,
      maxCapacity: 30,
      overweightPenalty: 0,
      isEncumbered: false,
    });

    const character = createMockCharacter();
    const modifier = createEncumbranceModifier(character);

    expect(modifier).toBeNull();
  });

  it("should return modifier when encumbered", () => {
    vi.mocked(calculateEncumbrance).mockReturnValue({
      currentWeight: 35,
      maxCapacity: 30,
      overweightPenalty: -5,
      isEncumbered: true,
    });

    const character = createMockCharacter();
    const modifier = createEncumbranceModifier(character);

    expect(modifier).not.toBeNull();
    expect(modifier?.source).toBe("encumbrance");
    expect(modifier?.value).toBe(-5);
    expect(modifier?.description).toContain("35");
    expect(modifier?.description).toContain("30");
  });
});

// =============================================================================
// createWirelessModifiers TESTS
// =============================================================================

describe("createWirelessModifiers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty array when no bonuses", () => {
    vi.mocked(calculateContextualWirelessBonuses).mockReturnValue({
      attackPool: 0,
      defensePool: 0,
      recoil: 0,
      initiative: 0,
      initiativeDice: 0,
      noiseReduction: 0,
      damageResist: 0,
      armor: 0,
      perception: 0,
      attributes: {},
      limits: {},
      skills: {},
      specialEffects: [],
    });

    const character = createMockCharacter();
    const modifiers = createWirelessModifiers(character, { testType: "attack" });

    expect(modifiers).toEqual([]);
  });

  it("should return attack modifiers for attack context", () => {
    vi.mocked(calculateContextualWirelessBonuses).mockReturnValue({
      attackPool: 2,
      defensePool: 0,
      recoil: 1,
      initiative: 0,
      initiativeDice: 0,
      noiseReduction: 0,
      damageResist: 0,
      armor: 0,
      perception: 0,
      attributes: {},
      limits: {},
      skills: {},
      specialEffects: [],
    });

    const character = createMockCharacter();
    const modifiers = createWirelessModifiers(character, { testType: "attack" });

    expect(modifiers).toContainEqual(expect.objectContaining({ source: "wireless", value: 2 }));
    expect(modifiers).toContainEqual(
      expect.objectContaining({ value: 1, description: expect.stringContaining("recoil") })
    );
  });

  it("should return defense modifiers for defense context", () => {
    vi.mocked(calculateContextualWirelessBonuses).mockReturnValue({
      attackPool: 0,
      defensePool: 3,
      recoil: 0,
      initiative: 0,
      initiativeDice: 0,
      noiseReduction: 0,
      damageResist: 0,
      armor: 0,
      perception: 0,
      attributes: {},
      limits: {},
      skills: {},
      specialEffects: [],
    });

    const character = createMockCharacter();
    const modifiers = createWirelessModifiers(character, { testType: "defense" });

    expect(modifiers).toContainEqual(
      expect.objectContaining({ value: 3, description: expect.stringContaining("defense") })
    );
  });

  it("should always include initiative bonus if present", () => {
    vi.mocked(calculateContextualWirelessBonuses).mockReturnValue({
      attackPool: 0,
      defensePool: 0,
      recoil: 0,
      initiative: 2,
      initiativeDice: 0,
      noiseReduction: 0,
      damageResist: 0,
      armor: 0,
      perception: 0,
      attributes: {},
      limits: {},
      skills: {},
      specialEffects: [],
    });

    const character = createMockCharacter();
    const modifiers = createWirelessModifiers(character, { testType: "perception" });

    expect(modifiers).toContainEqual(
      expect.objectContaining({ value: 2, description: expect.stringContaining("initiative") })
    );
  });
});

// =============================================================================
// createCombinedWirelessModifier TESTS
// =============================================================================

describe("createCombinedWirelessModifier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when no bonuses", () => {
    vi.mocked(calculateContextualWirelessBonuses).mockReturnValue({
      attackPool: 0,
      defensePool: 0,
      recoil: 0,
      initiative: 0,
      initiativeDice: 0,
      noiseReduction: 0,
      damageResist: 0,
      armor: 0,
      perception: 0,
      attributes: {},
      limits: {},
      skills: {},
      specialEffects: [],
    });

    const character = createMockCharacter();
    const modifier = createCombinedWirelessModifier(character, { testType: "attack" });

    expect(modifier).toBeNull();
  });

  it("should combine multiple bonuses into one modifier", () => {
    vi.mocked(calculateContextualWirelessBonuses).mockReturnValue({
      attackPool: 2,
      defensePool: 0,
      recoil: 1,
      initiative: 1,
      initiativeDice: 0,
      noiseReduction: 0,
      damageResist: 0,
      armor: 0,
      perception: 0,
      attributes: {},
      limits: {},
      skills: {},
      specialEffects: [],
    });

    const character = createMockCharacter();
    const modifier = createCombinedWirelessModifier(character, { testType: "attack" });

    expect(modifier).not.toBeNull();
    expect(modifier?.source).toBe("wireless");
    expect(modifier?.value).toBe(4); // 2 + 1 + 1
  });
});

// =============================================================================
// buildEnhancedActionPool TESTS
// =============================================================================

describe("buildEnhancedActionPool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(calculateEncumbrance).mockReturnValue({
      currentWeight: 10,
      maxCapacity: 30,
      overweightPenalty: 0,
      isEncumbered: false,
    });
    vi.mocked(calculateContextualWirelessBonuses).mockReturnValue({
      attackPool: 0,
      defensePool: 0,
      recoil: 0,
      initiative: 0,
      initiativeDice: 0,
      noiseReduction: 0,
      damageResist: 0,
      armor: 0,
      perception: 0,
      attributes: {},
      limits: {},
      skills: {},
      specialEffects: [],
    });
  });

  it("should include encumbrance penalty when applicable", () => {
    vi.mocked(calculateEncumbrance).mockReturnValue({
      currentWeight: 35,
      maxCapacity: 30,
      overweightPenalty: -5,
      isEncumbered: true,
    });

    const character = createMockCharacter();
    const pool = buildEnhancedActionPool(character, {
      attribute: "agility",
      skill: "firearms",
    });

    expect(pool.modifiers).toContainEqual(expect.objectContaining({ source: "encumbrance" }));
  });

  it("should include wireless bonuses when context provided", () => {
    vi.mocked(calculateContextualWirelessBonuses).mockReturnValue({
      attackPool: 2,
      defensePool: 0,
      damageResist: 0,
      armor: 0,
      perception: 0,
      recoil: 0,
      initiative: 0,
      initiativeDice: 0,
      noiseReduction: 0,
      attributes: {},
      limits: {},
      skills: {},
      specialEffects: [],
    });

    const character = createMockCharacter();
    const pool = buildEnhancedActionPool(character, {
      attribute: "agility",
      skill: "firearms",
      wirelessContext: { testType: "attack" },
    });

    expect(pool.modifiers).toContainEqual(expect.objectContaining({ source: "wireless" }));
  });

  it("should skip encumbrance when includeEncumbrance is false", () => {
    vi.mocked(calculateEncumbrance).mockReturnValue({
      currentWeight: 35,
      maxCapacity: 30,
      overweightPenalty: -5,
      isEncumbered: true,
    });

    const character = createMockCharacter();
    const pool = buildEnhancedActionPool(character, {
      attribute: "agility",
      skill: "firearms",
      includeEncumbrance: false,
    });

    expect(pool.modifiers.find((m) => m.source === "encumbrance")).toBeUndefined();
  });
});

// =============================================================================
// buildEnhancedAttackPool TESTS
// =============================================================================

describe("buildEnhancedAttackPool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(calculateEncumbrance).mockReturnValue({
      currentWeight: 10,
      maxCapacity: 30,
      overweightPenalty: 0,
      isEncumbered: false,
    });
    vi.mocked(calculateContextualWirelessBonuses).mockReturnValue({
      attackPool: 0,
      defensePool: 0,
      recoil: 0,
      initiative: 0,
      initiativeDice: 0,
      noiseReduction: 0,
      damageResist: 0,
      armor: 0,
      perception: 0,
      attributes: {},
      limits: {},
      skills: {},
      specialEffects: [],
    });
  });

  it("should build attack pool with wireless context", () => {
    const character = createMockCharacter();
    const pool = buildEnhancedAttackPool(character, "firearms", 6);

    expect(pool.attribute).toBe("agility");
    expect(pool.skill).toBe("firearms");
    expect(pool.limit).toBe(6);
    expect(calculateContextualWirelessBonuses).toHaveBeenCalled();
  });
});

// =============================================================================
// buildEnhancedDefensePool TESTS
// =============================================================================

describe("buildEnhancedDefensePool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(calculateEncumbrance).mockReturnValue({
      currentWeight: 10,
      maxCapacity: 30,
      overweightPenalty: 0,
      isEncumbered: false,
    });
    vi.mocked(calculateContextualWirelessBonuses).mockReturnValue({
      attackPool: 0,
      defensePool: 0,
      recoil: 0,
      initiative: 0,
      initiativeDice: 0,
      noiseReduction: 0,
      damageResist: 0,
      armor: 0,
      perception: 0,
      attributes: {},
      limits: {},
      skills: {},
      specialEffects: [],
    });
  });

  it("should build defense pool with reaction + intuition and wireless context", () => {
    const character = createMockCharacter();
    const pool = buildEnhancedDefensePool(character);

    expect(pool.basePool).toBe(8); // REA 4 + INT 4
    expect(calculateContextualWirelessBonuses).toHaveBeenCalled();
  });
});
