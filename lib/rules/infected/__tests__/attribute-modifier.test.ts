/**
 * Tests for HMHVV infected attribute modifier functions
 */

import { describe, it, expect } from "vitest";
import { applyInfectedAttributeBonuses, getAttributeBonusBreakdown } from "../attribute-modifier";
import type { InfectedTypeData } from "../types";

const mockVampire: InfectedTypeData = {
  id: "vampire",
  name: "Vampire",
  source: { book: "run-faster", page: 154 },
  hmhvvStrain: "hmhvv-i",
  baseMetatypes: ["human"],
  karmaCost: 27,
  physicalAttributeBonus: 2,
  mentalAttributeBonus: 1,
  mandatoryPowers: ["enhanced-senses"],
  optionalPowers: [],
  weaknesses: ["allergy-sunlight-severe"],
};

const mockGhoul: InfectedTypeData = {
  id: "ghoul",
  name: "Ghoul",
  source: { book: "run-faster", page: 150 },
  hmhvvStrain: "hmhvv-iii",
  baseMetatypes: ["any"],
  karmaCost: 29,
  physicalAttributeBonus: 1,
  mentalAttributeBonus: 0,
  mandatoryPowers: ["dual-natured"],
  optionalPowers: [],
  weaknesses: ["allergy-sunlight-mild"],
};

describe("applyInfectedAttributeBonuses", () => {
  it("returns a new object (does not mutate original)", () => {
    const original = {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 4,
      intuition: 3,
      charisma: 3,
    };
    const originalCopy = { ...original };

    const result = applyInfectedAttributeBonuses(original, mockVampire);

    // Original should not be mutated
    expect(original).toEqual(originalCopy);
    // Result should be a different object
    expect(result).not.toBe(original);
  });

  it("applies physical attribute bonuses correctly", () => {
    const attributes = {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 4,
      intuition: 3,
      charisma: 3,
    };

    const result = applyInfectedAttributeBonuses(attributes, mockVampire);

    // Physical attributes should each increase by 2
    expect(result.body).toBe(5);
    expect(result.agility).toBe(6);
    expect(result.reaction).toBe(5);
    expect(result.strength).toBe(5);
  });

  it("applies mental attribute bonuses correctly", () => {
    const attributes = {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 4,
      intuition: 3,
      charisma: 3,
    };

    const result = applyInfectedAttributeBonuses(attributes, mockVampire);

    // Mental attributes should each increase by 1
    expect(result.willpower).toBe(4);
    expect(result.logic).toBe(5);
    expect(result.intuition).toBe(4);
    expect(result.charisma).toBe(4);
  });

  it("handles zero bonuses correctly", () => {
    const attributes = {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 4,
      intuition: 3,
      charisma: 3,
    };

    const result = applyInfectedAttributeBonuses(attributes, mockGhoul);

    // Physical attributes should increase by 1
    expect(result.body).toBe(4);
    // Mental attributes should not change (bonus is 0)
    expect(result.willpower).toBe(3);
    expect(result.logic).toBe(4);
  });

  it("preserves non-standard attributes", () => {
    const attributes = {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 4,
      intuition: 3,
      charisma: 3,
      edge: 2,
      essence: 6,
    };

    const result = applyInfectedAttributeBonuses(attributes, mockVampire);

    // Edge and Essence should remain unchanged
    expect(result.edge).toBe(2);
    expect(result.essence).toBe(6);
  });
});

describe("getAttributeBonusBreakdown", () => {
  it("returns correct physical and mental bonuses", () => {
    const breakdown = getAttributeBonusBreakdown(mockVampire);
    expect(breakdown.physical).toBe(2);
    expect(breakdown.mental).toBe(1);
  });

  it("returns zero for types with no mental bonus", () => {
    const breakdown = getAttributeBonusBreakdown(mockGhoul);
    expect(breakdown.physical).toBe(1);
    expect(breakdown.mental).toBe(0);
  });
});
