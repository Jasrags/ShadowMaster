/**
 * Drain Calculator Tests
 */

import { describe, it, expect } from "vitest";
import {
  calculateDrain,
  calculateDrainResistance,
  parseDrainFormula,
  getDrainType,
  calculateDrainPreview,
  formatDrainSummary,
} from "../drain-calculator";
import type { Character } from "@/lib/types/character";
import type { LoadedRuleset } from "../../loader-types";
import type { BookPayload } from "@/lib/types/edition";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockRuleset(): LoadedRuleset {
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
                traditions: [
                  {
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
                    description: "Test",
                  },
                ],
                spells: {
                  combat: [
                    {
                      id: "fireball",
                      name: "Fireball",
                      category: "combat",
                      type: "physical",
                      range: "LOS",
                      duration: "instant",
                      drain: "F-1",
                      description: "Test spell",
                    },
                    {
                      id: "stunball",
                      name: "Stunball",
                      category: "combat",
                      type: "mana",
                      range: "LOS(A)",
                      duration: "instant",
                      drain: "F-3",
                      description: "Test spell",
                    },
                  ],
                  detection: [],
                  health: [],
                  illusion: [],
                  manipulation: [],
                },
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
    tradition: "hermetic",
    specialAttributes: {
      edge: 3,
      essence: 6,
      magic: 5,
      resonance: 0,
    },
    attributes: {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 2,
      willpower: 5,
      logic: 6,
      intuition: 3,
      charisma: 3,
    },
    ...overrides,
  };
}

// =============================================================================
// PARSE DRAIN FORMULA
// =============================================================================

describe("parseDrainFormula", () => {
  describe("simple formulas", () => {
    it("should parse F (equal to force)", () => {
      expect(parseDrainFormula("F", 5)).toBe(5);
      expect(parseDrainFormula("F", 3)).toBe(3);
    });

    it("should enforce minimum drain of 2", () => {
      expect(parseDrainFormula("F", 1)).toBe(2);
    });
  });

  describe("subtraction formulas", () => {
    it("should parse F-1", () => {
      expect(parseDrainFormula("F-1", 5)).toBe(4);
    });

    it("should parse F-3", () => {
      expect(parseDrainFormula("F-3", 5)).toBe(2); // minimum 2
      expect(parseDrainFormula("F-3", 6)).toBe(3);
    });

    it("should handle spaces in formula", () => {
      expect(parseDrainFormula("F - 2", 5)).toBe(3);
    });

    it("should enforce minimum of 2 for negative results", () => {
      expect(parseDrainFormula("F-5", 3)).toBe(2);
    });
  });

  describe("addition formulas", () => {
    it("should parse F+1", () => {
      expect(parseDrainFormula("F+1", 5)).toBe(6);
    });

    it("should parse F+2", () => {
      expect(parseDrainFormula("F+2", 4)).toBe(6);
    });
  });

  describe("division formulas", () => {
    it("should parse F/2 (round up)", () => {
      expect(parseDrainFormula("F/2", 5)).toBe(3); // ceil(5/2) = 3
      expect(parseDrainFormula("F/2", 6)).toBe(3); // ceil(6/2) = 3
    });

    it("should parse F/2+1", () => {
      expect(parseDrainFormula("F/2+1", 6)).toBe(4); // 3 + 1
    });

    it("should parse F/2-1", () => {
      expect(parseDrainFormula("F/2-1", 6)).toBe(2); // 3 - 1 = 2
    });
  });

  describe("case insensitivity", () => {
    it("should handle lowercase f", () => {
      expect(parseDrainFormula("f-2", 5)).toBe(3);
    });
  });
});

// =============================================================================
// GET DRAIN TYPE
// =============================================================================

describe("getDrainType", () => {
  it("should return stun when drain <= Magic", () => {
    expect(getDrainType(3, 5)).toBe("stun");
    expect(getDrainType(5, 5)).toBe("stun");
  });

  it("should return physical when drain > Magic", () => {
    expect(getDrainType(6, 5)).toBe("physical");
    expect(getDrainType(10, 5)).toBe("physical");
  });

  it("should handle edge cases", () => {
    expect(getDrainType(1, 0)).toBe("physical");
    expect(getDrainType(0, 0)).toBe("stun");
  });
});

// =============================================================================
// CALCULATE DRAIN RESISTANCE
// =============================================================================

describe("calculateDrainResistance", () => {
  const mockRuleset = createMockRuleset();

  it("should calculate resistance based on tradition drain attributes", () => {
    const character = createMockCharacter({
      tradition: "hermetic",
      attributes: {
        body: 3,
        agility: 4,
        reaction: 3,
        strength: 2,
        willpower: 5, // WIL
        logic: 6, // LOG
        intuition: 3,
        charisma: 3,
      },
    });

    // Hermetic uses LOG + WIL
    const result = calculateDrainResistance(character, mockRuleset);
    expect(result).toBe(11); // 6 + 5
  });

  it("should default to WIL + CHA if no tradition", () => {
    const character = createMockCharacter({
      tradition: undefined,
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
    });

    const result = calculateDrainResistance(character, mockRuleset);
    expect(result).toBe(7); // WIL 4 + CHA 3
  });
});

// =============================================================================
// CALCULATE DRAIN
// =============================================================================

describe("calculateDrain", () => {
  const mockRuleset = createMockRuleset();

  it("should calculate drain for spellcasting with known spell", () => {
    const character = createMockCharacter();
    const result = calculateDrain(
      character,
      {
        action: "spellcasting",
        force: 5,
        spellId: "fireball",
        spellCategory: "combat",
      },
      mockRuleset
    );

    // Fireball has drain F-1, so 5-1=4
    expect(result.drainValue).toBe(4);
    expect(result.drainType).toBe("stun"); // 4 <= 5 (Magic)
    expect(result.drainFormula).toBe("F-1");
  });

  it("should calculate drain for spellcasting with default formula", () => {
    const character = createMockCharacter();
    const result = calculateDrain(
      character,
      {
        action: "spellcasting",
        force: 5,
        // No spellId - use default
      },
      mockRuleset
    );

    // Default spell drain is F-2
    expect(result.drainValue).toBe(3);
  });

  it("should mark physical drain when exceeding Magic", () => {
    const character = createMockCharacter({
      specialAttributes: {
        edge: 3,
        essence: 6,
        magic: 3, // Low magic
        resonance: 0,
      },
    });

    const result = calculateDrain(
      character,
      {
        action: "spellcasting",
        force: 8,
        customDrainFormula: "F-1",
      },
      mockRuleset
    );

    // 8-1=7, which is > 3 (Magic)
    expect(result.drainValue).toBe(7);
    expect(result.drainType).toBe("physical");
  });

  it("should enforce minimum drain of 2", () => {
    const character = createMockCharacter();
    const result = calculateDrain(
      character,
      {
        action: "spellcasting",
        force: 3,
        customDrainFormula: "F-5",
      },
      mockRuleset
    );

    // 3-5=-2 -> minimum 2
    expect(result.drainValue).toBe(2);
  });

  it("should include resistance pool in result", () => {
    const character = createMockCharacter();
    const result = calculateDrain(
      character,
      {
        action: "spellcasting",
        force: 5,
      },
      mockRuleset
    );

    // Should have resistance pool (LOG + WIL = 11)
    expect(result.resistancePool).toBe(11);
  });
});

// =============================================================================
// CALCULATE DRAIN PREVIEW
// =============================================================================

describe("calculateDrainPreview", () => {
  const mockRuleset = createMockRuleset();

  it("should calculate drain for multiple spells", () => {
    const character = createMockCharacter();
    const results = calculateDrainPreview(character, ["fireball", "stunball"], 5, mockRuleset);

    expect(results.size).toBe(2);

    const fireballResult = results.get("fireball");
    expect(fireballResult?.drainValue).toBe(4); // F-1 = 5-1

    const stunballResult = results.get("stunball");
    expect(stunballResult?.drainValue).toBe(2); // F-3 = 5-3 = 2 (minimum)
  });
});

// =============================================================================
// FORMAT DRAIN SUMMARY
// =============================================================================

describe("formatDrainSummary", () => {
  it("should format stun drain correctly", () => {
    const result = formatDrainSummary({
      drainValue: 4,
      drainType: "stun",
      resistancePool: 11,
      drainFormula: "F-1",
    });

    expect(result).toBe("4 Stun (resist with 11 dice)");
  });

  it("should format physical drain correctly", () => {
    const result = formatDrainSummary({
      drainValue: 7,
      drainType: "physical",
      resistancePool: 8,
      drainFormula: "F+2",
    });

    expect(result).toBe("7 Physical (resist with 8 dice)");
  });
});
