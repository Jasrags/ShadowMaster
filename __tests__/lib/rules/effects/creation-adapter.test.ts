import { describe, it, expect } from "vitest";
import { buildCreationCharacter } from "@/lib/rules/effects/creation-adapter";
import type { CreationSelections } from "@/lib/types/creation-selections";
import type {
  CyberwareItem,
  BiowareItem,
  AdeptPower,
  GearItem,
  Weapon,
  ArmorItem,
} from "@/lib/types";

describe("buildCreationCharacter", () => {
  it("returns empty arrays for empty selections", () => {
    const selections: CreationSelections = {};
    const result = buildCreationCharacter(selections);

    expect(result.positiveQualities).toEqual([]);
    expect(result.negativeQualities).toEqual([]);
    expect(result.cyberware).toEqual([]);
    expect(result.bioware).toEqual([]);
    expect(result.adeptPowers).toEqual([]);
    expect(result.gear).toEqual([]);
    expect(result.weapons).toEqual([]);
    expect(result.armor).toEqual([]);
    expect(result.wirelessBonusesEnabled).toBe(true);
  });

  it("converts string quality selections to QualitySelection shape", () => {
    const selections: CreationSelections = {
      positiveQualities: ["catlike", "toughness"],
      negativeQualities: ["allergy-uncommon-mild"],
    };
    const result = buildCreationCharacter(selections);

    expect(result.positiveQualities).toEqual([
      { qualityId: "catlike", rating: undefined, source: "creation" },
      { qualityId: "toughness", rating: undefined, source: "creation" },
    ]);
    expect(result.negativeQualities).toEqual([
      { qualityId: "allergy-uncommon-mild", rating: undefined, source: "creation" },
    ]);
  });

  it("converts SelectedQuality objects with level to QualitySelection shape", () => {
    const selections: CreationSelections = {
      positiveQualities: [{ id: "exceptional-attribute", level: 2, specification: "Body" }],
    };
    const result = buildCreationCharacter(selections);

    expect(result.positiveQualities).toEqual([
      { qualityId: "exceptional-attribute", rating: 2, source: "creation" },
    ]);
  });

  it("passes through cyberware and bioware directly", () => {
    const cyberware = [
      {
        catalogId: "wired-reflexes",
        name: "Wired Reflexes",
        essenceCost: 2,
        cost: 39000,
        availability: 8,
        rating: 1,
        wirelessEnabled: true,
        category: "bodyware",
        grade: "standard",
        baseEssenceCost: 2,
      },
    ] as CyberwareItem[];
    const bioware = [
      {
        catalogId: "muscle-toner",
        name: "Muscle Toner",
        essenceCost: 0.4,
        cost: 16000,
        availability: 8,
        rating: 2,
        category: "basic",
        grade: "standard",
        baseEssenceCost: 0.4,
      },
    ] as BiowareItem[];

    const selections: CreationSelections = {
      cyberware,
      bioware,
    };
    const result = buildCreationCharacter(selections);

    expect(result.cyberware).toBe(cyberware);
    expect(result.bioware).toBe(bioware);
  });

  it("passes through adept powers directly", () => {
    const adeptPowers = [
      {
        id: "improved-reflexes-1",
        catalogId: "improved-reflexes",
        name: "Improved Reflexes",
        rating: 2,
        powerPointCost: 2.5,
      },
    ] as AdeptPower[];

    const selections: CreationSelections = { adeptPowers };
    const result = buildCreationCharacter(selections);

    expect(result.adeptPowers).toBe(adeptPowers);
  });

  it("passes through gear, weapons, and armor directly", () => {
    const gear = [
      { id: "medkit", name: "Medkit", cost: 500, rating: 3, category: "medical", quantity: 1 },
    ] as GearItem[];
    const weapons = [
      {
        catalogId: "ares-predator",
        name: "Ares Predator V",
        damage: "8P",
        ap: -1,
        availability: 5,
        cost: 725,
        mode: ["SA"],
        subcategory: "heavy-pistol",
        category: "firearms",
        quantity: 1,
      },
    ] as Weapon[];
    const armor = [
      {
        catalogId: "armor-jacket",
        name: "Armor Jacket",
        armorRating: 12,
        cost: 1000,
        availability: 2,
        equipped: true,
        category: "armor",
        quantity: 1,
      },
    ] as ArmorItem[];

    const selections: CreationSelections = { gear, weapons, armor };
    const result = buildCreationCharacter(selections);

    expect(result.gear).toBe(gear);
    expect(result.weapons).toBe(weapons);
    expect(result.armor).toBe(armor);
  });
});
