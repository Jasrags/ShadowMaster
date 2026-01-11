/**
 * Tradition Validator Tests
 *
 * Tests for tradition eligibility validation and magical path consistency.
 */

import { describe, it, expect } from "vitest";
import {
  validateTraditionEligibility,
  getDrainAttributes,
  validateMagicalPathConsistency,
  canUseMagic,
  canCastSpells,
  canUseAdeptPowers,
  canSummonSpirits,
  findTradition,
} from "../tradition-validator";
import type { Character, AdeptPower } from "@/lib/types/character";
import type { LoadedRuleset, TraditionData } from "../../loader-types";
import type { BookPayload } from "@/lib/types/edition";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockTradition(overrides: Partial<TraditionData> = {}): TraditionData {
  return {
    id: "hermetic",
    name: "Hermetic",
    drainAttributes: ["LOG", "WIL"],
    spiritTypes: {
      combat: "fire",
      detection: "air",
      health: "man",
      illusion: "water",
      manipulation: "earth",
    },
    description: "Test tradition",
    ...overrides,
  };
}

function createMockRuleset(traditions: TraditionData[] = []): LoadedRuleset {
  // We use type assertions here because we're creating minimal mock objects
  // that satisfy the parts of the interfaces our tests actually use
  return {
    edition: {} as LoadedRuleset["edition"],
    books: [
      {
        id: "core-rulebook",
        title: "Core Rulebook",
        isCore: true,
        loadOrder: 0,
        payload: {
          meta: {
            id: "core-rulebook",
            editionCode: "sr5",
            name: "Core Rulebook",
            category: "core",
            releaseYear: 2013,
          },
          modules: {
            magic: {
              mergeStrategy: "override" as const,
              payload: {
                traditions,
              },
            },
          },
        } as unknown as BookPayload,
      },
    ],
    creationMethods: [],
  } as LoadedRuleset;
}

function createMockCharacter(overrides: Partial<Character> = {}): Partial<Character> {
  return {
    id: "test-character",
    name: "Test Character",
    magicalPath: "full-mage",
    specialAttributes: {
      edge: 3,
      essence: 6,
      magic: 4,
      resonance: 0,
    },
    attributes: {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 2,
      willpower: 4,
      logic: 5,
      intuition: 3,
      charisma: 3,
    },
    ...overrides,
  };
}

function createMockAdeptPower(overrides: Partial<AdeptPower> = {}): AdeptPower {
  return {
    id: "power-1",
    catalogId: "improved-reflexes",
    name: "Improved Reflexes",
    powerPointCost: 1.5,
    ...overrides,
  };
}

// =============================================================================
// VALIDATE TRADITION ELIGIBILITY
// =============================================================================

describe("validateTraditionEligibility", () => {
  const hermeticTradition = createMockTradition({ id: "hermetic" });
  const shamanTradition = createMockTradition({
    id: "shaman",
    name: "Shaman",
    drainAttributes: ["CHA", "WIL"],
    spiritTypes: {
      combat: "beasts",
      detection: "water",
      health: "earth",
      illusion: "air",
      manipulation: "man",
    },
  });
  const mockRuleset = createMockRuleset([hermeticTradition, shamanTradition]);

  it("should return valid for eligible full-mage with tradition", () => {
    const character = createMockCharacter({ magicalPath: "full-mage" });
    const result = validateTraditionEligibility(character, "hermetic", mockRuleset);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.drainAttributes).toEqual(["LOG", "WIL"]);
  });

  it("should return valid for mystic-adept", () => {
    const character = createMockCharacter({ magicalPath: "mystic-adept" });
    const result = validateTraditionEligibility(character, "hermetic", mockRuleset);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should return valid for aspected-mage", () => {
    const character = createMockCharacter({ magicalPath: "aspected-mage" });
    const result = validateTraditionEligibility(character, "shaman", mockRuleset);

    expect(result.valid).toBe(true);
    expect(result.drainAttributes).toEqual(["CHA", "WIL"]);
  });

  it("should reject mundane character", () => {
    const character = createMockCharacter({
      magicalPath: "mundane",
      specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 0 },
    });
    const result = validateTraditionEligibility(character, "hermetic", mockRuleset);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: "PATH_NO_TRADITION" }));
  });

  it("should reject adept character", () => {
    const character = createMockCharacter({ magicalPath: "adept" });
    const result = validateTraditionEligibility(character, "hermetic", mockRuleset);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: "PATH_NO_TRADITION" }));
  });

  it("should reject technomancer", () => {
    const character = createMockCharacter({
      magicalPath: "technomancer",
      specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 4 },
    });
    const result = validateTraditionEligibility(character, "hermetic", mockRuleset);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: "PATH_NO_TRADITION" }));
  });

  it("should reject character without magical path", () => {
    const character = createMockCharacter({ magicalPath: undefined });
    const result = validateTraditionEligibility(character, "hermetic", mockRuleset);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: "NO_MAGICAL_PATH" }));
  });

  it("should reject character with zero Magic rating", () => {
    const character = createMockCharacter({
      magicalPath: "full-mage",
      specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 0 },
    });
    const result = validateTraditionEligibility(character, "hermetic", mockRuleset);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(expect.objectContaining({ code: "NO_MAGIC_RATING" }));
  });

  it("should reject non-existent tradition", () => {
    const character = createMockCharacter();
    const result = validateTraditionEligibility(character, "nonexistent-tradition", mockRuleset);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        code: "TRADITION_NOT_FOUND",
        itemId: "nonexistent-tradition",
      })
    );
  });
});

// =============================================================================
// GET DRAIN ATTRIBUTES
// =============================================================================

describe("getDrainAttributes", () => {
  it("should return drain attributes from tradition", () => {
    const tradition = createMockTradition({
      drainAttributes: ["LOG", "WIL"],
    });

    const result = getDrainAttributes(tradition);
    expect(result).toEqual(["LOG", "WIL"]);
  });

  it("should handle different attribute combinations", () => {
    const shamanTradition = createMockTradition({
      drainAttributes: ["CHA", "WIL"],
    });

    const result = getDrainAttributes(shamanTradition);
    expect(result).toEqual(["CHA", "WIL"]);
  });
});

// =============================================================================
// VALIDATE MAGICAL PATH CONSISTENCY
// =============================================================================

describe("validateMagicalPathConsistency", () => {
  const mockRuleset = createMockRuleset([createMockTradition()]);

  describe("mundane path", () => {
    it("should be valid with no magical content", () => {
      const character = createMockCharacter({
        magicalPath: "mundane",
        specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 0 },
        spells: [],
        adeptPowers: [],
        tradition: undefined,
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(true);
    });

    it("should reject mundane with Magic rating", () => {
      const character = createMockCharacter({
        magicalPath: "mundane",
        specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 0 },
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ code: "MUNDANE_HAS_MAGIC" }));
    });

    it("should reject mundane with spells", () => {
      const character = createMockCharacter({
        magicalPath: "mundane",
        specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 0 },
        spells: ["acid-stream"],
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ code: "MUNDANE_HAS_SPELLS" }));
    });
  });

  describe("adept path", () => {
    it("should be valid with adept powers only", () => {
      const character = createMockCharacter({
        magicalPath: "adept",
        specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 0 },
        spells: [],
        adeptPowers: [
          createMockAdeptPower({
            id: "ir-1",
            catalogId: "improved-reflexes",
            name: "Improved Reflexes",
            rating: 2,
            powerPointCost: 3,
          }),
        ],
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(true);
    });

    it("should reject adept with spells", () => {
      const character = createMockCharacter({
        magicalPath: "adept",
        spells: ["fireball"],
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ code: "ADEPT_HAS_SPELLS" }));
    });

    it("should reject adept without Magic rating", () => {
      const character = createMockCharacter({
        magicalPath: "adept",
        specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 0 },
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ code: "ADEPT_NO_MAGIC" }));
    });
  });

  describe("full-mage path", () => {
    it("should be valid with spells and tradition", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        tradition: "hermetic",
        spells: ["fireball", "invisibility"],
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(true);
    });

    it("should reject full-mage with adept powers", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        adeptPowers: [
          createMockAdeptPower({
            id: "kh-1",
            catalogId: "killing-hands",
            name: "Killing Hands",
            powerPointCost: 0.5,
          }),
        ],
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ code: "MAGE_HAS_ADEPT_POWERS" })
      );
    });

    it("should warn if full-mage has no tradition", () => {
      const character = createMockCharacter({
        magicalPath: "full-mage",
        tradition: undefined,
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(true);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({ code: "MAGE_NO_TRADITION" })
      );
    });
  });

  describe("mystic-adept path", () => {
    it("should be valid with both spells and adept powers", () => {
      const character = createMockCharacter({
        magicalPath: "mystic-adept",
        tradition: "hermetic",
        spells: ["fireball"],
        adeptPowers: [
          createMockAdeptPower({
            id: "kh-1",
            catalogId: "killing-hands",
            name: "Killing Hands",
            powerPointCost: 0.5,
          }),
        ],
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(true);
    });
  });

  describe("technomancer path", () => {
    it("should be valid with Resonance and no magic", () => {
      const character = createMockCharacter({
        magicalPath: "technomancer",
        specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 5 },
        spells: [],
        adeptPowers: [],
        tradition: undefined,
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(true);
    });

    it("should reject technomancer with Magic rating", () => {
      const character = createMockCharacter({
        magicalPath: "technomancer",
        specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 5 },
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ code: "TECHNO_HAS_MAGIC" }));
    });

    it("should reject technomancer with spells", () => {
      const character = createMockCharacter({
        magicalPath: "technomancer",
        specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 5 },
        spells: ["fireball"],
      });

      const result = validateMagicalPathConsistency(character, mockRuleset);
      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(expect.objectContaining({ code: "TECHNO_HAS_SPELLS" }));
    });
  });
});

// =============================================================================
// CAPABILITY CHECK FUNCTIONS
// =============================================================================

describe("canUseMagic", () => {
  it("should return true for full-mage with Magic", () => {
    const character = createMockCharacter({
      magicalPath: "full-mage",
      specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 0 },
    });
    expect(canUseMagic(character)).toBe(true);
  });

  it("should return true for adept with Magic", () => {
    const character = createMockCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 3, resonance: 0 },
    });
    expect(canUseMagic(character)).toBe(true);
  });

  it("should return false for mundane", () => {
    const character = createMockCharacter({
      magicalPath: "mundane",
      specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 0 },
    });
    expect(canUseMagic(character)).toBe(false);
  });

  it("should return false for technomancer", () => {
    const character = createMockCharacter({
      magicalPath: "technomancer",
      specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 5 },
    });
    expect(canUseMagic(character)).toBe(false);
  });

  it("should return false for mage with zero Magic", () => {
    const character = createMockCharacter({
      magicalPath: "full-mage",
      specialAttributes: { edge: 3, essence: 6, magic: 0, resonance: 0 },
    });
    expect(canUseMagic(character)).toBe(false);
  });
});

describe("canCastSpells", () => {
  it("should return true for full-mage", () => {
    const character = createMockCharacter({ magicalPath: "full-mage" });
    expect(canCastSpells(character)).toBe(true);
  });

  it("should return true for mystic-adept", () => {
    const character = createMockCharacter({ magicalPath: "mystic-adept" });
    expect(canCastSpells(character)).toBe(true);
  });

  it("should return true for aspected-mage", () => {
    const character = createMockCharacter({ magicalPath: "aspected-mage" });
    expect(canCastSpells(character)).toBe(true);
  });

  it("should return false for adept", () => {
    const character = createMockCharacter({ magicalPath: "adept" });
    expect(canCastSpells(character)).toBe(false);
  });
});

describe("canUseAdeptPowers", () => {
  it("should return true for adept", () => {
    const character = createMockCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 0 },
    });
    expect(canUseAdeptPowers(character)).toBe(true);
  });

  it("should return true for mystic-adept", () => {
    const character = createMockCharacter({ magicalPath: "mystic-adept" });
    expect(canUseAdeptPowers(character)).toBe(true);
  });

  it("should return false for full-mage", () => {
    const character = createMockCharacter({ magicalPath: "full-mage" });
    expect(canUseAdeptPowers(character)).toBe(false);
  });
});

describe("canSummonSpirits", () => {
  it("should return true for full-mage", () => {
    const character = createMockCharacter({ magicalPath: "full-mage" });
    expect(canSummonSpirits(character)).toBe(true);
  });

  it("should return true for mystic-adept", () => {
    const character = createMockCharacter({ magicalPath: "mystic-adept" });
    expect(canSummonSpirits(character)).toBe(true);
  });

  it("should return false for adept", () => {
    const character = createMockCharacter({
      magicalPath: "adept",
      specialAttributes: { edge: 3, essence: 6, magic: 4, resonance: 0 },
    });
    expect(canSummonSpirits(character)).toBe(false);
  });
});

// =============================================================================
// FIND TRADITION
// =============================================================================

describe("findTradition", () => {
  const traditions = [
    createMockTradition({ id: "hermetic", name: "Hermetic" }),
    createMockTradition({ id: "shaman", name: "Shaman" }),
  ];
  const mockRuleset = createMockRuleset(traditions);

  it("should find tradition by ID", () => {
    const result = findTradition("hermetic", mockRuleset);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Hermetic");
  });

  it("should return undefined for non-existent tradition", () => {
    const result = findTradition("nonexistent", mockRuleset);
    expect(result).toBeUndefined();
  });
});
