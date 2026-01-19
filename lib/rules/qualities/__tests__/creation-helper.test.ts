/**
 * Tests for quality creation helper functions
 *
 * Tests the buildCharacterFromCreationState function which converts
 * CreationState to a partial Character for validation purposes.
 */

import { describe, it, expect } from "vitest";
import type { CreationState, CreationSelections } from "@/lib/types";
import { buildCharacterFromCreationState } from "../creation-helper";

// Helper to create minimal CreationState for testing
function createMinimalState(overrides: Partial<CreationState> = {}): CreationState {
  return {
    characterId: "test-char-1",
    creationMethodId: "priority",
    currentStep: 0,
    completedSteps: [],
    budgets: {},
    selections: {} as CreationSelections,
    errors: [],
    warnings: [],
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("buildCharacterFromCreationState", () => {
  describe("basic character fields", () => {
    it("should set characterId from state", () => {
      const state = createMinimalState({ characterId: "my-char-id" });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.id).toBe("my-char-id");
    });

    it("should handle missing characterId", () => {
      const state = createMinimalState({ characterId: undefined as unknown as string });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.id).toBe("");
    });

    it("should set editionCode from parameter", () => {
      const state = createMinimalState();
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.editionCode).toBe("sr5");
    });

    it("should always set status to draft", () => {
      const state = createMinimalState();
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.status).toBe("draft");
    });
  });

  describe("metatype and attributes", () => {
    it("should set metatype from selections", () => {
      const state = createMinimalState({
        selections: { metatype: "elf" } as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.metatype).toBe("elf");
    });

    it("should handle undefined metatype", () => {
      const state = createMinimalState({
        selections: {} as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.metatype).toBeUndefined();
    });

    it("should set attributes from selections", () => {
      const state = createMinimalState({
        selections: {
          attributes: { bod: 3, agi: 4, rea: 3, str: 2 },
        } as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.attributes).toEqual({ bod: 3, agi: 4, rea: 3, str: 2 });
    });

    it("should set skills from selections", () => {
      const state = createMinimalState({
        selections: {
          skills: { pistols: 4, sneaking: 3 },
        } as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.skills).toEqual({ pistols: 4, sneaking: 3 });
    });
  });

  describe("special attributes", () => {
    it("should extract edge from attributes", () => {
      const state = createMinimalState({
        selections: {
          attributes: { bod: 3, edg: 4 },
        } as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.specialAttributes?.edge).toBe(4);
    });

    it("should default edge to 1 when not provided", () => {
      const state = createMinimalState({
        selections: {
          attributes: { bod: 3 },
        } as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.specialAttributes?.edge).toBe(1);
    });

    it("should set essence to 6 (default)", () => {
      const state = createMinimalState();
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.specialAttributes?.essence).toBe(6);
    });
  });

  describe("magical path handling", () => {
    it("should set magic to undefined for mundane path", () => {
      const state = createMinimalState({
        selections: {
          "magical-path": "mundane",
        } as unknown as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.specialAttributes?.magic).toBeUndefined();
      expect(result.magicalPath).toBe("mundane");
    });

    it("should set magic to 1 for full mage", () => {
      const state = createMinimalState({
        selections: {
          "magical-path": "full-mage",
        } as unknown as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.specialAttributes?.magic).toBe(1);
      expect(result.magicalPath).toBe("full-mage");
    });

    it("should set resonance to 1 for technomancer", () => {
      const state = createMinimalState({
        selections: {
          "magical-path": "technomancer",
        } as unknown as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.specialAttributes?.resonance).toBe(1);
      expect(result.specialAttributes?.magic).toBe(1);
      expect(result.magicalPath).toBe("technomancer");
    });

    it("should handle mystic-adept path", () => {
      const state = createMinimalState({
        selections: {
          "magical-path": "mystic-adept",
        } as unknown as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.specialAttributes?.magic).toBe(1);
      expect(result.magicalPath).toBe("mystic-adept");
    });

    it("should default to mundane when magical-path not set", () => {
      const state = createMinimalState({
        selections: {} as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.magicalPath).toBe("mundane");
    });
  });

  describe("quality mapping", () => {
    it("should map positive qualities as array of quality objects", () => {
      const state = createMinimalState({
        selections: {
          positiveQualities: ["quality-1", "quality-2"],
        } as unknown as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.positiveQualities).toHaveLength(2);
      expect(result.positiveQualities?.[0]).toEqual({
        qualityId: "quality-1",
        id: "quality-1",
        rating: undefined,
        specification: undefined,
        source: "creation",
        active: true,
      });
      expect(result.positiveQualities?.[1]).toEqual({
        qualityId: "quality-2",
        id: "quality-2",
        rating: undefined,
        specification: undefined,
        source: "creation",
        active: true,
      });
    });

    it("should map negative qualities as array of quality objects", () => {
      const state = createMinimalState({
        selections: {
          negativeQualities: ["neg-quality-1"],
        } as unknown as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.negativeQualities).toHaveLength(1);
      expect(result.negativeQualities?.[0]).toEqual({
        qualityId: "neg-quality-1",
        id: "neg-quality-1",
        rating: undefined,
        specification: undefined,
        source: "creation",
        active: true,
      });
    });

    it("should include quality ratings from qualityLevels", () => {
      const state = createMinimalState({
        selections: {
          positiveQualities: ["quality-1"],
          qualityLevels: { "quality-1": 3 },
        } as unknown as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.positiveQualities?.[0]?.rating).toBe(3);
    });

    it("should include quality specifications from qualitySpecifications", () => {
      const state = createMinimalState({
        selections: {
          negativeQualities: ["allergy"],
          qualitySpecifications: { allergy: "Cats" },
        } as unknown as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.negativeQualities?.[0]?.specification).toBe("Cats");
    });

    it("should handle empty quality arrays", () => {
      const state = createMinimalState({
        selections: {
          positiveQualities: [],
          negativeQualities: [],
        } as unknown as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.positiveQualities).toEqual([]);
      expect(result.negativeQualities).toEqual([]);
    });

    it("should handle undefined quality arrays", () => {
      const state = createMinimalState({
        selections: {} as CreationSelections,
      });
      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.positiveQualities).toEqual([]);
      expect(result.negativeQualities).toEqual([]);
    });
  });

  describe("complete character conversion", () => {
    it("should build complete character from full creation state", () => {
      const state = createMinimalState({
        characterId: "full-char",
        selections: {
          metatype: "troll",
          attributes: { bod: 5, agi: 3, rea: 3, str: 5, wil: 3, log: 2, int: 3, cha: 2, edg: 2 },
          skills: { clubs: 4, intimidation: 3 },
          "magical-path": "mundane",
          positiveQualities: ["natural-immunity"],
          negativeQualities: ["prejudiced"],
          qualityLevels: { "natural-immunity": 2 },
          qualitySpecifications: { prejudiced: "Elves" },
        } as unknown as CreationSelections,
      });

      const result = buildCharacterFromCreationState(state, "sr5");

      expect(result.id).toBe("full-char");
      expect(result.editionCode).toBe("sr5");
      expect(result.metatype).toBe("troll");
      expect(result.attributes).toEqual({
        bod: 5,
        agi: 3,
        rea: 3,
        str: 5,
        wil: 3,
        log: 2,
        int: 3,
        cha: 2,
        edg: 2,
      });
      expect(result.specialAttributes?.edge).toBe(2);
      expect(result.specialAttributes?.essence).toBe(6);
      expect(result.specialAttributes?.magic).toBeUndefined();
      expect(result.magicalPath).toBe("mundane");
      expect(result.skills).toEqual({ clubs: 4, intimidation: 3 });
      expect(result.positiveQualities?.[0]).toMatchObject({
        qualityId: "natural-immunity",
        rating: 2,
      });
      expect(result.negativeQualities?.[0]).toMatchObject({
        qualityId: "prejudiced",
        specification: "Elves",
      });
      expect(result.status).toBe("draft");
    });
  });
});
