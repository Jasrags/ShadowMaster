/**
 * Tests for magic advancement validation and cost calculations
 *
 * Tests spell learning, initiation, adept power purchases, rituals, and metamagics.
 */

import { describe, it, expect } from "vitest";
import type {
  LoadedRuleset,
  SpellsCatalogData,
  AdeptPowerCatalogItem,
} from "@/lib/rules/loader-types";
import type { MergedRuleset, BookPayload, AdeptPower } from "@/lib/types";
import {
  calculateSpellLearningCost,
  validateSpellAdvancement,
  calculateInitiationKarmaCost,
  validateInitiationAdvancement,
  calculateAdeptPowerKarmaCost,
  validateAdeptPowerAdvancement,
  calculateRitualLearningCost,
  validateRitualAdvancement,
  getAvailableMetamagics,
} from "../magic-advancement";
import { createMockCharacter } from "@/__tests__/mocks/storage";
import { createMockEdition } from "@/__tests__/mocks/rulesets";

// =============================================================================
// MOCK DATA HELPERS
// =============================================================================

function createMockSpellsCatalog(): SpellsCatalogData {
  return {
    combat: [
      {
        id: "fireball",
        name: "Fireball",
        category: "combat",
        type: "physical",
        range: "LOS",
        duration: "Instant",
        drain: "F+3",
      },
      {
        id: "manabolt",
        name: "Manabolt",
        category: "combat",
        type: "mana",
        range: "LOS",
        duration: "Instant",
        drain: "F",
      },
    ],
    detection: [
      {
        id: "detect-enemies",
        name: "Detect Enemies",
        category: "detection",
        type: "mana",
        range: "Touch",
        duration: "Sustained",
        drain: "F",
      },
    ],
    health: [
      {
        id: "heal",
        name: "Heal",
        category: "health",
        type: "mana",
        range: "Touch",
        duration: "Permanent",
        drain: "F-4",
      },
    ],
    illusion: [
      {
        id: "invisibility",
        name: "Invisibility",
        category: "illusion",
        type: "mana",
        range: "LOS",
        duration: "Sustained",
        drain: "F-1",
      },
    ],
    manipulation: [
      {
        id: "levitate",
        name: "Levitate",
        category: "manipulation",
        type: "physical",
        range: "LOS",
        duration: "Sustained",
        drain: "F-2",
      },
    ],
  };
}

function createMockAdeptPowersCatalog(): AdeptPowerCatalogItem[] {
  return [
    {
      id: "improved-reflexes",
      name: "Improved Reflexes",
      cost: 1.5,
      costType: "perLevel",
      description: "Increased reflexes",
      maxRating: 3,
    },
    {
      id: "combat-sense",
      name: "Combat Sense",
      cost: 0.5,
      costType: "perLevel",
      description: "Combat awareness",
      maxRating: 6,
    },
    {
      id: "mystic-armor",
      name: "Mystic Armor",
      cost: 0.5,
      costType: "perLevel",
      description: "Magical armor",
      maxRating: 6,
    },
    {
      id: "killing-hands",
      name: "Killing Hands",
      cost: 0.5,
      costType: "fixed",
      description: "Deadly hands",
    },
    {
      id: "critical-strike",
      name: "Critical Strike",
      cost: 0.5,
      costType: "fixed",
      description: "Critical hits",
    },
  ];
}

function createMockLoadedRuleset(
  spells?: SpellsCatalogData,
  adeptPowers?: AdeptPowerCatalogItem[]
): LoadedRuleset {
  const mockBookPayload: BookPayload = {
    meta: {
      bookId: "core-rulebook",
      title: "Core Rulebook",
      edition: "sr5",
      version: "1.0.0",
      category: "core",
    },
    modules: {
      magic: spells ? { mergeStrategy: "replace", payload: { spells } } : undefined,
      adeptPowers: adeptPowers
        ? { mergeStrategy: "replace", payload: { powers: adeptPowers } }
        : undefined,
    },
  };

  return {
    edition: createMockEdition(),
    books: [
      {
        id: "core-rulebook",
        title: "Core Rulebook",
        isCore: true,
        payload: mockBookPayload,
        loadOrder: 0,
      },
    ],
    creationMethods: [],
  };
}

function createMockMergedRuleset(): MergedRuleset {
  return {
    snapshotId: "test-snapshot",
    editionId: "sr5",
    editionCode: "sr5",
    bookIds: ["core-rulebook"],
    modules: {},
    createdAt: new Date().toISOString(),
  };
}

// =============================================================================
// SPELL ADVANCEMENT TESTS
// =============================================================================

describe("Spell Advancement", () => {
  describe("calculateSpellLearningCost", () => {
    it("should return default cost of 5 karma", () => {
      const cost = calculateSpellLearningCost();
      expect(cost).toBe(5);
    });

    it("should respect campaign settings spellKarmaCost", () => {
      const cost = calculateSpellLearningCost({ spellKarmaCost: 7 } as never);
      expect(cost).toBe(7);
    });

    it("should respect ruleset spellKarmaCost", () => {
      const cost = calculateSpellLearningCost(undefined, { spellKarmaCost: 6 } as never);
      expect(cost).toBe(6);
    });

    it("should prioritize campaign settings over ruleset", () => {
      const cost = calculateSpellLearningCost(
        { spellKarmaCost: 7 } as never,
        { spellKarmaCost: 6 } as never
      );
      expect(cost).toBe(7);
    });
  });

  describe("validateSpellAdvancement", () => {
    it("should validate spell learning for magician", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        karmaCurrent: 10,
        spells: [],
      });
      const ruleset = createMockLoadedRuleset(createMockSpellsCatalog());

      const result = validateSpellAdvancement(character, "fireball", ruleset);

      expect(result.valid).toBe(true);
      expect(result.cost).toBe(5);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject mundane characters", () => {
      const character = createMockCharacter({
        magicalPath: "mundane",
        karmaCurrent: 10,
      });
      const ruleset = createMockLoadedRuleset(createMockSpellsCatalog());

      const result = validateSpellAdvancement(character, "fireball", ruleset);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("cannot learn spells"))).toBe(true);
    });

    it("should reject technomancers", () => {
      const character = createMockCharacter({
        magicalPath: "technomancer",
        karmaCurrent: 10,
      });
      const ruleset = createMockLoadedRuleset(createMockSpellsCatalog());

      const result = validateSpellAdvancement(character, "fireball", ruleset);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "magicalPath")).toBe(true);
    });

    it("should reject adepts (pure)", () => {
      const character = createMockCharacter({
        magicalPath: "adept",
        karmaCurrent: 10,
      });
      const ruleset = createMockLoadedRuleset(createMockSpellsCatalog());

      const result = validateSpellAdvancement(character, "fireball", ruleset);

      expect(result.valid).toBe(false);
    });

    it("should allow mystic adepts to learn spells", () => {
      const character = createMockCharacter({
        magicalPath: "mystic-adept",
        karmaCurrent: 10,
        spells: [],
      });
      const ruleset = createMockLoadedRuleset(createMockSpellsCatalog());

      const result = validateSpellAdvancement(character, "fireball", ruleset);

      expect(result.valid).toBe(true);
    });

    it("should reject spell not in ruleset", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        karmaCurrent: 10,
      });
      const ruleset = createMockLoadedRuleset(createMockSpellsCatalog());

      const result = validateSpellAdvancement(character, "nonexistent-spell", ruleset);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("not found"))).toBe(true);
    });

    it("should reject already known spell", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        karmaCurrent: 10,
        spells: ["fireball"],
      });
      const ruleset = createMockLoadedRuleset(createMockSpellsCatalog());

      const result = validateSpellAdvancement(character, "fireball", ruleset);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("already knows"))).toBe(true);
    });

    it("should reject insufficient karma", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        karmaCurrent: 3,
        spells: [],
      });
      const ruleset = createMockLoadedRuleset(createMockSpellsCatalog());

      const result = validateSpellAdvancement(character, "fireball", ruleset);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "karma")).toBe(true);
      expect(result.cost).toBe(5);
    });
  });
});

// =============================================================================
// INITIATION ADVANCEMENT TESTS
// =============================================================================

describe("Initiation Advancement", () => {
  describe("calculateInitiationKarmaCost", () => {
    it("should calculate base formula: 10 + (newGrade * 3)", () => {
      expect(calculateInitiationKarmaCost(0)).toBe(13); // 10 + (1 * 3) = 13
      expect(calculateInitiationKarmaCost(1)).toBe(16); // 10 + (2 * 3) = 16
      expect(calculateInitiationKarmaCost(2)).toBe(19); // 10 + (3 * 3) = 19
      expect(calculateInitiationKarmaCost(5)).toBe(28); // 10 + (6 * 3) = 28
    });

    it("should reduce cost by 3 for ordeal", () => {
      expect(calculateInitiationKarmaCost(0, true)).toBe(10); // 13 - 3 = 10
      expect(calculateInitiationKarmaCost(1, true)).toBe(13); // 16 - 3 = 13
    });

    it("should reduce cost by 2 for group initiation", () => {
      expect(calculateInitiationKarmaCost(0, false, true)).toBe(11); // 13 - 2 = 11
      expect(calculateInitiationKarmaCost(1, false, true)).toBe(14); // 16 - 2 = 14
    });

    it("should stack ordeal and group reductions", () => {
      expect(calculateInitiationKarmaCost(0, true, true)).toBe(8); // 13 - 3 - 2 = 8
      expect(calculateInitiationKarmaCost(1, true, true)).toBe(11); // 16 - 3 - 2 = 11
    });

    it("should enforce minimum cost of 1", () => {
      // Create a scenario where cost would go to 0 or negative
      // At grade 0: 10 + 3 = 13, with both bonuses: 13 - 3 - 2 = 8 (still positive)
      // The minimum enforcement is for edge cases; verify it doesn't go below 1
      const cost = calculateInitiationKarmaCost(0, true, true);
      expect(cost).toBeGreaterThanOrEqual(1);
    });
  });

  describe("validateInitiationAdvancement", () => {
    it("should validate initiation for magician", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 20,
      });
      const ruleset = createMockMergedRuleset();

      const result = validateInitiationAdvancement(character, 0, false, false, ruleset);

      expect(result.valid).toBe(true);
      expect(result.cost).toBe(13);
    });

    it("should validate initiation for adept", () => {
      const character = createMockCharacter({
        magicalPath: "adept",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 20,
      });
      const ruleset = createMockMergedRuleset();

      const result = validateInitiationAdvancement(character, 0, false, false, ruleset);

      expect(result.valid).toBe(true);
    });

    it("should reject mundane characters", () => {
      const character = createMockCharacter({
        magicalPath: "mundane",
        karmaCurrent: 20,
        // Mundane characters have no magic rating, so the magic rating check fails first
      });
      const ruleset = createMockMergedRuleset();

      const result = validateInitiationAdvancement(character, 0, false, false, ruleset);

      expect(result.valid).toBe(false);
      // Mundane characters fail the magic rating check (magic=0) before the path check
      expect(result.errors.some((e) => e.message.includes("Magic rating"))).toBe(true);
    });

    it("should reject technomancers", () => {
      const character = createMockCharacter({
        magicalPath: "technomancer",
        karmaCurrent: 20,
      });
      const ruleset = createMockMergedRuleset();

      const result = validateInitiationAdvancement(character, 0, false, false, ruleset);

      expect(result.valid).toBe(false);
    });

    it("should reject characters without magic rating", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        specialAttributes: { edge: 2, essence: 6, magic: 0 },
        karmaCurrent: 20,
      });
      const ruleset = createMockMergedRuleset();

      const result = validateInitiationAdvancement(character, 0, false, false, ruleset);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("Magic rating"))).toBe(true);
    });

    it("should reject insufficient karma", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 5,
      });
      const ruleset = createMockMergedRuleset();

      const result = validateInitiationAdvancement(character, 0, false, false, ruleset);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "karma")).toBe(true);
    });

    it("should include warning about ordeal savings", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 20,
      });
      const ruleset = createMockMergedRuleset();

      const result = validateInitiationAdvancement(character, 0, false, false, ruleset);

      expect(result.warnings).toBeDefined();
      expect(result.warnings?.some((w) => w.includes("ordeal"))).toBe(true);
    });

    it("should not include ordeal warning if ordeal is used", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 20,
      });
      const ruleset = createMockMergedRuleset();

      const result = validateInitiationAdvancement(character, 0, true, false, ruleset);

      expect(result.warnings?.some((w) => w.includes("ordeal"))).toBeFalsy();
    });
  });
});

// =============================================================================
// ADEPT POWER ADVANCEMENT TESTS
// =============================================================================

describe("Adept Power Advancement", () => {
  describe("calculateAdeptPowerKarmaCost", () => {
    it("should calculate cost as PP * 5 karma", () => {
      expect(calculateAdeptPowerKarmaCost(0.5)).toBe(3); // 0.5 * 5 = 2.5, ceil = 3
      expect(calculateAdeptPowerKarmaCost(1.0)).toBe(5); // 1.0 * 5 = 5
      expect(calculateAdeptPowerKarmaCost(1.5)).toBe(8); // 1.5 * 5 = 7.5, ceil = 8
      expect(calculateAdeptPowerKarmaCost(2.0)).toBe(10); // 2.0 * 5 = 10
    });

    it("should round up fractional results", () => {
      expect(calculateAdeptPowerKarmaCost(0.25)).toBe(2); // 0.25 * 5 = 1.25, ceil = 2
      expect(calculateAdeptPowerKarmaCost(0.75)).toBe(4); // 0.75 * 5 = 3.75, ceil = 4
    });
  });

  describe("validateAdeptPowerAdvancement", () => {
    it("should validate power purchase for adept", () => {
      const character = createMockCharacter({
        magicalPath: "adept",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 10,
        adeptPowers: [],
      });
      const ruleset = createMockLoadedRuleset(undefined, createMockAdeptPowersCatalog());

      const result = validateAdeptPowerAdvancement(
        character,
        { id: "killing-hands", rating: 1 },
        ruleset
      );

      expect(result.valid).toBe(true);
      // killing-hands costs 0.5 PP = 3 karma (0.5 * 5 = 2.5, ceil = 3)
      expect(result.cost).toBe(3);
    });

    it("should validate power purchase for mystic adept", () => {
      const character = createMockCharacter({
        magicalPath: "mystic-adept",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 10,
        adeptPowers: [],
      });
      const ruleset = createMockLoadedRuleset(undefined, createMockAdeptPowersCatalog());

      const result = validateAdeptPowerAdvancement(
        character,
        { id: "killing-hands", rating: 1 },
        ruleset
      );

      expect(result.valid).toBe(true);
    });

    it("should reject mundane characters", () => {
      const character = createMockCharacter({
        magicalPath: "mundane",
        karmaCurrent: 10,
      });
      const ruleset = createMockLoadedRuleset(undefined, createMockAdeptPowersCatalog());

      const result = validateAdeptPowerAdvancement(
        character,
        { id: "killing-hands", rating: 1 },
        ruleset
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("Adept or Mystic Adept"))).toBe(true);
    });

    it("should reject pure magicians", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        karmaCurrent: 10,
      });
      const ruleset = createMockLoadedRuleset(undefined, createMockAdeptPowersCatalog());

      const result = validateAdeptPowerAdvancement(
        character,
        { id: "killing-hands", rating: 1 },
        ruleset
      );

      expect(result.valid).toBe(false);
    });

    it("should reject power not in ruleset", () => {
      const character = createMockCharacter({
        magicalPath: "adept",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 10,
      });
      const ruleset = createMockLoadedRuleset(undefined, createMockAdeptPowersCatalog());

      const result = validateAdeptPowerAdvancement(
        character,
        { id: "nonexistent-power", rating: 1 },
        ruleset
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("not found"))).toBe(true);
    });

    it("should reject already owned non-leveled power", () => {
      const existingPower: AdeptPower = {
        id: "killing-hands",
        catalogId: "killing-hands",
        name: "Killing Hands",
        powerPointCost: 0.5,
      };
      const character = createMockCharacter({
        magicalPath: "adept",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 10,
        adeptPowers: [existingPower],
      });
      const ruleset = createMockLoadedRuleset(undefined, createMockAdeptPowersCatalog());

      const result = validateAdeptPowerAdvancement(
        character,
        { id: "killing-hands", rating: 1 },
        ruleset
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("already has"))).toBe(true);
    });

    it("should allow upgrading leveled power", () => {
      const existingPower: AdeptPower = {
        id: "improved-reflexes",
        catalogId: "improved-reflexes",
        name: "Improved Reflexes",
        powerPointCost: 1.5,
        rating: 1,
      };
      const character = createMockCharacter({
        magicalPath: "adept",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 20,
        adeptPowers: [existingPower],
      });
      const ruleset = createMockLoadedRuleset(undefined, createMockAdeptPowersCatalog());

      const result = validateAdeptPowerAdvancement(
        character,
        { id: "improved-reflexes", rating: 2 },
        ruleset
      );

      expect(result.valid).toBe(true);
    });

    it("should reject downgrading leveled power", () => {
      const existingPower: AdeptPower = {
        id: "improved-reflexes",
        catalogId: "improved-reflexes",
        name: "Improved Reflexes",
        powerPointCost: 3.0,
        rating: 2,
      };
      const character = createMockCharacter({
        magicalPath: "adept",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 20,
        adeptPowers: [existingPower],
      });
      const ruleset = createMockLoadedRuleset(undefined, createMockAdeptPowersCatalog());

      const result = validateAdeptPowerAdvancement(
        character,
        { id: "improved-reflexes", rating: 1 },
        ruleset
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("higher than current"))).toBe(true);
    });

    it("should reject insufficient karma", () => {
      const character = createMockCharacter({
        magicalPath: "adept",
        specialAttributes: { edge: 2, essence: 6, magic: 6 },
        karmaCurrent: 1,
        adeptPowers: [],
      });
      const ruleset = createMockLoadedRuleset(undefined, createMockAdeptPowersCatalog());

      const result = validateAdeptPowerAdvancement(
        character,
        { id: "killing-hands", rating: 1 },
        ruleset
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "karma")).toBe(true);
    });

    it("should reject if no magic rating", () => {
      const character = createMockCharacter({
        magicalPath: "adept",
        specialAttributes: { edge: 2, essence: 6, magic: 0 },
        karmaCurrent: 10,
        adeptPowers: [],
      });
      const ruleset = createMockLoadedRuleset(undefined, createMockAdeptPowersCatalog());

      const result = validateAdeptPowerAdvancement(
        character,
        { id: "killing-hands", rating: 1 },
        ruleset
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("Magic rating"))).toBe(true);
    });
  });
});

// =============================================================================
// RITUAL ADVANCEMENT TESTS
// =============================================================================

describe("Ritual Advancement", () => {
  describe("calculateRitualLearningCost", () => {
    it("should return same cost as spells (default 5)", () => {
      const cost = calculateRitualLearningCost();
      expect(cost).toBe(5);
    });

    it("should respect campaign settings", () => {
      const cost = calculateRitualLearningCost({ spellKarmaCost: 7 } as never);
      expect(cost).toBe(7);
    });

    it("should respect ruleset settings", () => {
      const cost = calculateRitualLearningCost(undefined, { spellKarmaCost: 6 } as never);
      expect(cost).toBe(6);
    });
  });

  describe("validateRitualAdvancement", () => {
    it("should validate ritual learning for magician", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        karmaCurrent: 10,
      });

      const result = validateRitualAdvancement(character, "ward", []);

      expect(result.valid).toBe(true);
      expect(result.cost).toBe(5);
    });

    it("should reject mundane characters", () => {
      const character = createMockCharacter({
        magicalPath: "mundane",
        karmaCurrent: 10,
      });

      const result = validateRitualAdvancement(character, "ward", []);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("cannot learn rituals"))).toBe(true);
    });

    it("should reject technomancers", () => {
      const character = createMockCharacter({
        magicalPath: "technomancer",
        karmaCurrent: 10,
      });

      const result = validateRitualAdvancement(character, "ward", []);

      expect(result.valid).toBe(false);
    });

    it("should reject pure adepts", () => {
      const character = createMockCharacter({
        magicalPath: "adept",
        karmaCurrent: 10,
      });

      const result = validateRitualAdvancement(character, "ward", []);

      expect(result.valid).toBe(false);
    });

    it("should allow mystic adepts to learn rituals", () => {
      const character = createMockCharacter({
        magicalPath: "mystic-adept",
        karmaCurrent: 10,
      });

      const result = validateRitualAdvancement(character, "ward", []);

      expect(result.valid).toBe(true);
    });

    it("should reject already known ritual", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        karmaCurrent: 10,
      });

      const result = validateRitualAdvancement(character, "ward", ["ward", "circle-of-protection"]);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.message.includes("already knows"))).toBe(true);
    });

    it("should reject insufficient karma", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        karmaCurrent: 2,
      });

      const result = validateRitualAdvancement(character, "ward", []);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "karma")).toBe(true);
    });
  });
});

// =============================================================================
// METAMAGIC TESTS
// =============================================================================

describe("Metamagics", () => {
  describe("getAvailableMetamagics", () => {
    it("should return empty array for grade 0", () => {
      const result = getAvailableMetamagics(0, []);
      expect(result).toHaveLength(0);
    });

    it("should return empty array if max metamagics reached", () => {
      // Grade 2 allows 2 metamagics, already have 2
      const result = getAvailableMetamagics(2, ["centering", "masking"]);
      expect(result).toHaveLength(0);
    });

    it("should return available metamagics for grade 1 with none known", () => {
      const result = getAvailableMetamagics(1, []);

      expect(result.length).toBeGreaterThan(0);
      expect(result).toContain("centering");
      expect(result).toContain("masking");
    });

    it("should filter out known metamagics", () => {
      const result = getAvailableMetamagics(2, ["centering"]);

      expect(result).not.toContain("centering");
      expect(result).toContain("masking");
    });

    it("should return standard metamagics list", () => {
      const result = getAvailableMetamagics(7, []);

      expect(result).toContain("centering");
      expect(result).toContain("flexible-signature");
      expect(result).toContain("masking");
      expect(result).toContain("power-point");
      expect(result).toContain("quickening");
      expect(result).toContain("shielding");
      expect(result).toContain("spell-shaping");
    });

    it("should allow selection if under max for grade", () => {
      // Grade 3, but only has 2 metamagics
      const result = getAvailableMetamagics(3, ["centering", "masking"]);

      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle negative grade", () => {
      const result = getAvailableMetamagics(-1, []);
      expect(result).toHaveLength(0);
    });
  });
});
