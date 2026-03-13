/**
 * Tests for HMHVV infected validator functions
 */

import { describe, it, expect } from "vitest";
import { isCharacterInfected, validateInfectedPrerequisites, getInfectedType } from "../validator";
import type { InfectedCatalogData } from "../types";

const mockCatalog: InfectedCatalogData = {
  types: [
    {
      id: "vampire",
      name: "Vampire",
      source: { book: "run-faster", page: 154 },
      hmhvvStrain: "hmhvv-i",
      baseMetatypes: ["human"],
      karmaCost: 27,
      karmaCostAwakened: 37,
      physicalAttributeBonus: 2,
      mentalAttributeBonus: 1,
      mandatoryPowers: ["enhanced-senses", "essence-drain"],
      optionalPowers: ["compulsion", "concealment"],
      weaknesses: ["allergy-sunlight-severe"],
      essenceDrain: { method: "essence-drain", description: "Drains Essence through bite." },
    },
    {
      id: "ghoul",
      name: "Ghoul",
      source: { book: "run-faster", page: 150 },
      hmhvvStrain: "hmhvv-iii",
      baseMetatypes: ["any"],
      karmaCost: 29,
      physicalAttributeBonus: 1,
      mentalAttributeBonus: 0,
      mandatoryPowers: ["dual-natured", "enhanced-senses"],
      optionalPowers: ["concealment"],
      weaknesses: ["allergy-sunlight-mild"],
    },
    {
      id: "banshee",
      name: "Banshee",
      source: { book: "run-faster", page: 148 },
      hmhvvStrain: "hmhvv-i",
      baseMetatypes: ["elf"],
      karmaCost: 32,
      physicalAttributeBonus: 2,
      mentalAttributeBonus: 1,
      mandatoryPowers: ["enhanced-senses", "essence-drain"],
      optionalPowers: ["compulsion"],
      weaknesses: ["allergy-sunlight-severe"],
    },
  ],
  diseaseStrains: [],
  optionalPowerCosts: {},
};

describe("isCharacterInfected", () => {
  it("returns true when character has hmhvv-infected quality", () => {
    const qualities = [{ qualityId: "toughness" }, { qualityId: "hmhvv-infected" }];
    expect(isCharacterInfected(qualities)).toBe(true);
  });

  it("returns false when character does not have hmhvv-infected quality", () => {
    const qualities = [{ qualityId: "toughness" }, { qualityId: "exceptional-attribute" }];
    expect(isCharacterInfected(qualities)).toBe(false);
  });

  it("returns false for empty qualities array", () => {
    expect(isCharacterInfected([])).toBe(false);
  });
});

describe("validateInfectedPrerequisites", () => {
  it("returns valid for correct metatype match", () => {
    const result = validateInfectedPrerequisites("vampire", "Human", mockCatalog);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("returns invalid for incorrect metatype", () => {
    const result = validateInfectedPrerequisites("vampire", "Elf", mockCatalog);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("human");
    expect(result.error).toContain("Elf");
  });

  it("returns valid for ghoul with any metatype", () => {
    const result = validateInfectedPrerequisites("ghoul", "Troll", mockCatalog);
    expect(result.valid).toBe(true);
  });

  it("returns valid for ghoul with human metatype", () => {
    const result = validateInfectedPrerequisites("ghoul", "Human", mockCatalog);
    expect(result.valid).toBe(true);
  });

  it("returns invalid for unknown infected type", () => {
    const result = validateInfectedPrerequisites("unknown-type", "Human", mockCatalog);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unknown infected type");
  });

  it("handles case-insensitive metatype comparison", () => {
    const result = validateInfectedPrerequisites("banshee", "ELF", mockCatalog);
    expect(result.valid).toBe(true);
  });
});

describe("getInfectedType", () => {
  it("returns the correct infected type by id", () => {
    const result = getInfectedType("vampire", mockCatalog);
    expect(result).toBeDefined();
    expect(result?.name).toBe("Vampire");
    expect(result?.karmaCost).toBe(27);
  });

  it("returns undefined for unknown id", () => {
    const result = getInfectedType("nonexistent", mockCatalog);
    expect(result).toBeUndefined();
  });

  it("returns type with awakened karma cost when present", () => {
    const result = getInfectedType("vampire", mockCatalog);
    expect(result?.karmaCostAwakened).toBe(37);
  });

  it("returns type without awakened karma cost when absent", () => {
    const result = getInfectedType("ghoul", mockCatalog);
    expect(result?.karmaCostAwakened).toBeUndefined();
  });
});
