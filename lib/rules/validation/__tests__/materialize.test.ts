/**
 * Materialization Tests
 *
 * Tests for materializeFromCreationState() which copies creation state
 * selections to top-level character fields before finalization.
 */

import { describe, it, expect } from "vitest";
import { materializeFromCreationState } from "../materialize";
import type { Character } from "@/lib/types/character";
import type { CreationState } from "@/lib/types/creation";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createEmptyCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "test-char-1",
    ownerId: "test-user-1",
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "priority",
    rulesetSnapshotId: "snapshot-1",
    attachedBookIds: ["core-rulebook"],
    name: "Test Character",
    metatype: "",
    status: "draft",
    attributes: {},
    specialAttributes: { edge: 0, essence: 6 },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 0,
    startingNuyen: 0,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: { physicalDamage: 0, stunDamage: 0 },
    karmaTotal: 25,
    karmaCurrent: 25,
    karmaSpentAtCreation: 0,
    createdAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

function createCreationState(selectionsOverrides: Record<string, unknown> = {}): CreationState {
  return {
    characterId: "test-char-1",
    creationMethodId: "priority",
    currentStep: 0,
    completedSteps: [],
    budgets: {},
    selections: {
      ...selectionsOverrides,
    },
    priorities: { metatype: "C", attributes: "B", magic: "E", skills: "A", resources: "D" },
    errors: [],
    warnings: [],
    updatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// TESTS
// =============================================================================

describe("materializeFromCreationState", () => {
  describe("basic info", () => {
    it("should copy metatype from selections when character metatype is empty", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({ metatype: "Elf" });

      const result = materializeFromCreationState(character, state);

      expect(result.metatype).toBe("Elf");
    });

    it("should not overwrite metatype when character already has one", () => {
      const character = createEmptyCharacter({ metatype: "Dwarf" });
      const state = createCreationState({ metatype: "Elf" });

      const result = materializeFromCreationState(character, state);

      expect(result.metatype).toBe("Dwarf");
    });

    it("should copy gender from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({ gender: "Female" });

      const result = materializeFromCreationState(character, state);

      expect(result.gender).toBe("Female");
    });
  });

  describe("magical path", () => {
    it("should map 'magician' to 'full-mage'", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({ "magical-path": "magician" });

      const result = materializeFromCreationState(character, state);

      expect(result.magicalPath).toBe("full-mage");
    });

    it("should map 'adept' directly", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({ "magical-path": "adept" });

      const result = materializeFromCreationState(character, state);

      expect(result.magicalPath).toBe("adept");
    });

    it("should map 'technomancer' directly", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({ "magical-path": "technomancer" });

      const result = materializeFromCreationState(character, state);

      expect(result.magicalPath).toBe("technomancer");
    });

    it("should not overwrite non-mundane magicalPath", () => {
      const character = createEmptyCharacter({ magicalPath: "adept" });
      const state = createCreationState({ "magical-path": "magician" });

      const result = materializeFromCreationState(character, state);

      expect(result.magicalPath).toBe("adept");
    });

    it("should copy tradition from qualitySpecifications", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        "magical-path": "magician",
        qualitySpecifications: { tradition: "Hermetic" },
      });

      const result = materializeFromCreationState(character, state);

      expect(result.tradition).toBe("Hermetic");
    });
  });

  describe("attributes", () => {
    it("should copy attributes from selections when character attributes are empty", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        attributes: {
          body: 4,
          agility: 5,
          reaction: 3,
          strength: 3,
          willpower: 4,
          logic: 3,
          intuition: 4,
          charisma: 3,
        },
      });

      const result = materializeFromCreationState(character, state);

      expect(result.attributes).toEqual({
        body: 4,
        agility: 5,
        reaction: 3,
        strength: 3,
        willpower: 4,
        logic: 3,
        intuition: 4,
        charisma: 3,
      });
    });

    it("should not overwrite when character already has attributes", () => {
      const character = createEmptyCharacter({
        attributes: { body: 6 },
      });
      const state = createCreationState({
        attributes: { body: 4, agility: 5 },
      });

      const result = materializeFromCreationState(character, state);

      expect(result.attributes).toEqual({ body: 6 });
    });

    it("should copy special attributes when at defaults", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        specialAttributes: { edge: 3, magic: 5 },
      });

      const result = materializeFromCreationState(character, state);

      expect(result.specialAttributes?.edge).toBe(3);
      expect(result.specialAttributes?.magic).toBe(5);
      expect(result.specialAttributes?.essence).toBe(6); // preserved
    });
  });

  describe("skills", () => {
    it("should copy skills from selections when character skills are empty", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        skills: { pistols: 6, sneaking: 4, perception: 3 },
      });

      const result = materializeFromCreationState(character, state);

      expect(result.skills).toEqual({ pistols: 6, sneaking: 4, perception: 3 });
    });

    it("should copy skill specializations", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        skills: { pistols: 6 },
        skillSpecializations: { pistols: ["Semi-Automatics"] },
      });

      const result = materializeFromCreationState(character, state);

      expect(result.skillSpecializations).toEqual({ pistols: ["Semi-Automatics"] });
    });
  });

  describe("knowledge and languages", () => {
    it("should copy knowledge skills from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        knowledgeSkills: [{ name: "Seattle Gangs", category: "street", rating: 3 }],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.knowledgeSkills).toEqual([
        { name: "Seattle Gangs", category: "street", rating: 3 },
      ]);
    });

    it("should copy languages from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        languages: [
          { name: "English", rating: 0, isNative: true },
          { name: "Japanese", rating: 3 },
        ],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.languages).toHaveLength(2);
      expect(result.languages![0].name).toBe("English");
    });
  });

  describe("qualities", () => {
    it("should convert string quality IDs to QualitySelection format", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        positiveQualities: ["aptitude"],
        negativeQualities: ["bad-luck"],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.positiveQualities).toEqual([{ qualityId: "aptitude", source: "creation" }]);
      expect(result.negativeQualities).toEqual([{ qualityId: "bad-luck", source: "creation" }]);
    });

    it("should convert SelectedQuality objects to QualitySelection format", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        positiveQualities: [{ id: "aptitude", specification: "Pistols", karma: 14 }],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.positiveQualities).toEqual([
        {
          id: "aptitude",
          qualityId: "aptitude",
          specification: "Pistols",
          originalKarma: 14,
          source: "creation",
        },
      ]);
    });

    it("should not overwrite existing qualities", () => {
      const character = createEmptyCharacter({
        positiveQualities: [{ qualityId: "existing", source: "creation" }],
      } as Partial<Character>);
      const state = createCreationState({
        positiveQualities: ["aptitude"],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.positiveQualities).toEqual([{ qualityId: "existing", source: "creation" }]);
    });
  });

  describe("identities and lifestyles", () => {
    it("should copy identities from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        identities: [{ name: "John Smith", sin: { type: "fake", rating: 4 }, licenses: [] }],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.identities).toHaveLength(1);
      expect(result.identities![0].name).toBe("John Smith");
    });

    it("should copy lifestyles from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        lifestyles: [{ type: "medium", monthlyCost: 5000 }],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.lifestyles).toHaveLength(1);
      expect(result.lifestyles![0].type).toBe("medium");
    });
  });

  describe("contacts", () => {
    it("should copy contacts from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        contacts: [{ name: "Fixer Joe", connection: 4, loyalty: 3, type: "Fixer" }],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.contacts).toEqual([
        { name: "Fixer Joe", connection: 4, loyalty: 3, type: "Fixer" },
      ]);
    });
  });

  describe("gear and equipment", () => {
    it("should copy weapons from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        weapons: [
          {
            name: "Ares Predator V",
            damage: "8P",
            ap: -1,
            mode: ["SA"],
            cost: 725,
            quantity: 1,
            category: "pistols",
            subcategory: "heavy-pistols",
          },
        ],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.weapons).toHaveLength(1);
      expect(result.weapons![0].name).toBe("Ares Predator V");
    });

    it("should copy armor from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        armor: [
          {
            name: "Armor Jacket",
            armorRating: 12,
            cost: 1000,
            quantity: 1,
            category: "armor",
            equipped: true,
          },
        ],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.armor).toHaveLength(1);
      expect(result.armor![0].name).toBe("Armor Jacket");
    });

    it("should copy cyberware from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        cyberware: [
          {
            catalogId: "wired-reflexes",
            name: "Wired Reflexes",
            category: "bodyware",
            grade: "standard",
            baseEssenceCost: 2,
            essenceCost: 2,
            rating: 1,
            cost: 39000,
            availability: 8,
          },
        ],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.cyberware).toHaveLength(1);
      expect(result.cyberware![0].name).toBe("Wired Reflexes");
    });

    it("should copy commlinks from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        commlinks: [
          {
            id: "comm-1",
            catalogId: "meta-link",
            name: "Meta Link",
            deviceRating: 1,
            cost: 100,
            availability: 2,
          },
        ],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.commlinks).toHaveLength(1);
      expect(result.commlinks![0].name).toBe("Meta Link");
    });
  });

  describe("software to programs conversion", () => {
    it("should convert CharacterDataSoftware to CharacterProgram", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        software: [
          {
            id: "sw-1",
            catalogId: "datasoft",
            type: "datasoft",
            name: "Datasoft",
            displayName: "Datasoft (History)",
            cost: 120,
            availability: 1,
          },
        ],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.programs).toHaveLength(1);
      expect(result.programs![0].name).toBe("Datasoft (History)");
      expect(result.programs![0].category).toBe("common");
      expect(result.programs![0].cost).toBe(120);
    });
  });

  describe("immutability", () => {
    it("should return a new object without mutating the original", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({ metatype: "Elf" });

      const result = materializeFromCreationState(character, state);

      expect(result).not.toBe(character);
      expect(character.metatype).toBe("");
      expect(result.metatype).toBe("Elf");
    });
  });

  describe("no creation state data", () => {
    it("should return character unchanged when selections is empty", () => {
      const character = createEmptyCharacter();
      const state = createCreationState();

      const result = materializeFromCreationState(character, state);

      expect(result.metatype).toBe("");
      expect(result.attributes).toEqual({});
      expect(result.skills).toEqual({});
    });
  });

  describe("racial qualities", () => {
    it("should copy racialQualities from selections", () => {
      const character = createEmptyCharacter();
      const state = createCreationState({
        racialQualities: ["low-light-vision", "thermographic-vision"],
      });

      const result = materializeFromCreationState(character, state);

      expect(result.racialQualities).toEqual(["low-light-vision", "thermographic-vision"]);
    });
  });
});
