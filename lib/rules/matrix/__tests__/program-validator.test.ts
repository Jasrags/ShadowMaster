import { describe, it, expect, vi } from "vitest";
import {
  validateProgramAllocation,
  validateProgramExists,
  getProgramSlotLimit,
  isProgramCompatible,
  getLoadedPrograms,
  isProgramLoaded,
  getUnloadedPrograms,
  characterOwnsProgram,
  calculateEffectiveSlotsUsed,
} from "../program-validator";
import type { Character } from "@/lib/types";
import type { CharacterCyberdeck, MatrixDeviceType } from "@/lib/types/matrix";
import type { LoadedRuleset, ProgramCatalogItemData } from "../../loader-types";
import { createMockCharacter } from "@/__tests__/mocks/storage";

// =============================================================================
// MOCK HELPERS
// =============================================================================

function createMockCyberdeck(overrides?: Partial<CharacterCyberdeck>): CharacterCyberdeck {
  return {
    id: "deck-1",
    catalogId: "erika-mcd-1",
    name: "Erika MCD-1",
    deviceRating: 4,
    attributeArray: [5, 4, 3, 2],
    currentConfig: {
      attack: 5,
      sleaze: 4,
      dataProcessing: 3,
      firewall: 2,
    },
    programSlots: 5,
    loadedPrograms: [],
    cost: 49500,
    availability: 6,
    ...overrides,
  };
}

function createMockProgram(overrides?: Partial<ProgramCatalogItemData>): ProgramCatalogItemData {
  return {
    id: "program-test",
    name: "Test Program",
    category: "common",
    cost: 80,
    availability: 4,
    ...overrides,
  };
}

function createMockRuleset(programs: ProgramCatalogItemData[]): LoadedRuleset {
  return {
    edition: {
      id: "sr5",
      name: "Shadowrun 5th Edition",
      shortCode: "sr5" as const,
      version: "1.0.0",
      releaseYear: 2013,
      bookIds: ["sr5-core"],
      creationMethodIds: ["priority"],
      defaultCreationMethodId: "priority",
      createdAt: "2024-01-01T00:00:00Z",
    },
    books: [
      {
        id: "sr5-core",
        title: "Core Rulebook",
        isCore: true,
        loadOrder: 0,
        payload: {
          meta: {
            bookId: "sr5-core",
            title: "Core Rulebook",
            edition: "sr5",
            version: "1.0.0",
            category: "core",
          },
          modules: {
            programs: {
              payload: {
                common: programs.filter((p) => p.category === "common"),
                hacking: programs.filter((p) => p.category === "hacking"),
                agents: programs.filter((p) => p.category === "agent"),
              },
            },
          },
        },
      },
    ],
    creationMethods: [],
  };
}

function createCharacterWithCyberdeck(
  deck: CharacterCyberdeck,
  programs?: Array<{ catalogId: string; name: string; rating?: number }>
): Character {
  return createMockCharacter({
    cyberdecks: [deck],
    programs: programs?.map((p) => ({
      id: `prog-${p.catalogId}`,
      catalogId: p.catalogId,
      name: p.name,
      category: "common" as const,
      rating: p.rating,
      cost: 80,
      availability: 4,
    })),
  });
}

// =============================================================================
// TESTS
// =============================================================================

describe("program-validator", () => {
  describe("validateProgramAllocation", () => {
    it("should validate successful allocation within slot limit", () => {
      const deck = createMockCyberdeck({ programSlots: 5 });
      const character = createCharacterWithCyberdeck(deck);
      const programs = [
        createMockProgram({ id: "browse" }),
        createMockProgram({ id: "edit" }),
        createMockProgram({ id: "configurator" }),
      ];
      const ruleset = createMockRuleset(programs);

      const result = validateProgramAllocation(
        character,
        ["browse", "edit", "configurator"],
        ruleset
      );

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.slotsUsed).toBe(3);
      expect(result.slotsRemaining).toBe(2);
      expect(result.slotsMax).toBe(5);
    });

    it("should fail when exceeding program slots", () => {
      const deck = createMockCyberdeck({ programSlots: 2 });
      const character = createCharacterWithCyberdeck(deck);
      const programs = [
        createMockProgram({ id: "p1" }),
        createMockProgram({ id: "p2" }),
        createMockProgram({ id: "p3" }),
      ];
      const ruleset = createMockRuleset(programs);

      const result = validateProgramAllocation(character, ["p1", "p2", "p3"], ruleset);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "EXCEEDS_PROGRAM_SLOTS")).toBe(true);
    });

    it("should fail when no cyberdeck found", () => {
      const character = createMockCharacter({ cyberdecks: [] });
      const ruleset = createMockRuleset([]);

      const result = validateProgramAllocation(character, ["browse"], ruleset);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "NO_CYBERDECK")).toBe(true);
      expect(result.slotsMax).toBe(0);
    });

    it("should error when program not found in ruleset", () => {
      const deck = createMockCyberdeck();
      const character = createCharacterWithCyberdeck(deck);
      const ruleset = createMockRuleset([createMockProgram({ id: "browse" })]);

      const result = validateProgramAllocation(character, ["browse", "unknown-program"], ruleset);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "PROGRAM_NOT_FOUND")).toBe(true);
    });

    it("should warn about duplicate programs", () => {
      const deck = createMockCyberdeck();
      const character = createCharacterWithCyberdeck(deck);
      const programs = [createMockProgram({ id: "browse" })];
      const ruleset = createMockRuleset(programs);

      const result = validateProgramAllocation(character, ["browse", "browse"], ruleset);

      expect(result.warnings.some((w) => w.code === "DUPLICATE_PROGRAMS")).toBe(true);
    });
  });

  describe("validateProgramExists", () => {
    it("should return true for existing program", () => {
      const programs = [createMockProgram({ id: "browse" })];
      const ruleset = createMockRuleset(programs);

      expect(validateProgramExists("browse", ruleset)).toBe(true);
    });

    it("should return false for non-existent program", () => {
      const ruleset = createMockRuleset([]);

      expect(validateProgramExists("unknown", ruleset)).toBe(false);
    });

    it("should find programs in all categories", () => {
      const programs = [
        createMockProgram({ id: "browse", category: "common" }),
        createMockProgram({ id: "exploit", category: "hacking" }),
        createMockProgram({ id: "agent-1", category: "agent" }),
      ];
      const ruleset = createMockRuleset(programs);

      expect(validateProgramExists("browse", ruleset)).toBe(true);
      expect(validateProgramExists("exploit", ruleset)).toBe(true);
      expect(validateProgramExists("agent-1", ruleset)).toBe(true);
    });
  });

  describe("getProgramSlotLimit", () => {
    it("should return slot limit from cyberdeck", () => {
      const deck = createMockCyberdeck({ programSlots: 7 });
      const character = createCharacterWithCyberdeck(deck);

      expect(getProgramSlotLimit(character)).toBe(7);
    });

    it("should return 0 when no cyberdeck", () => {
      const character = createMockCharacter({ cyberdecks: [] });

      expect(getProgramSlotLimit(character)).toBe(0);
    });
  });

  describe("isProgramCompatible", () => {
    const ruleset = createMockRuleset([
      createMockProgram({ id: "common-prog", category: "common" }),
      createMockProgram({ id: "hacking-prog", category: "hacking" }),
      createMockProgram({ id: "agent-prog", category: "agent" }),
    ]);

    it("should allow all programs on cyberdeck", () => {
      expect(isProgramCompatible("common-prog", "cyberdeck", ruleset)).toBe(true);
      expect(isProgramCompatible("hacking-prog", "cyberdeck", ruleset)).toBe(true);
      expect(isProgramCompatible("agent-prog", "cyberdeck", ruleset)).toBe(true);
    });

    it("should only allow common programs on commlink", () => {
      expect(isProgramCompatible("common-prog", "commlink", ruleset)).toBe(true);
      expect(isProgramCompatible("hacking-prog", "commlink", ruleset)).toBe(false);
    });

    it("should not allow programs on RCC", () => {
      expect(isProgramCompatible("common-prog", "rcc", ruleset)).toBe(false);
      expect(isProgramCompatible("hacking-prog", "rcc", ruleset)).toBe(false);
    });

    it("should not allow programs on technomancer living persona", () => {
      expect(isProgramCompatible("common-prog", "technomancer-living-persona", ruleset)).toBe(
        false
      );
    });

    it("should return false for non-existent program", () => {
      expect(isProgramCompatible("not-exists", "cyberdeck", ruleset)).toBe(false);
    });
  });

  describe("getLoadedPrograms", () => {
    it("should return loaded programs from cyberdeck", () => {
      const deck = createMockCyberdeck({
        loadedPrograms: ["browse", "edit", "toolkit"],
      });
      const character = createCharacterWithCyberdeck(deck);

      const loaded = getLoadedPrograms(character);

      expect(loaded).toEqual(["browse", "edit", "toolkit"]);
    });

    it("should return empty array when no cyberdeck", () => {
      const character = createMockCharacter({ cyberdecks: [] });

      expect(getLoadedPrograms(character)).toEqual([]);
    });

    it("should return empty array when no programs loaded", () => {
      const deck = createMockCyberdeck({ loadedPrograms: [] });
      const character = createCharacterWithCyberdeck(deck);

      expect(getLoadedPrograms(character)).toEqual([]);
    });
  });

  describe("isProgramLoaded", () => {
    it("should return true for loaded program", () => {
      const deck = createMockCyberdeck({ loadedPrograms: ["browse", "edit"] });
      const character = createCharacterWithCyberdeck(deck);

      expect(isProgramLoaded(character, "browse")).toBe(true);
    });

    it("should return false for unloaded program", () => {
      const deck = createMockCyberdeck({ loadedPrograms: ["browse"] });
      const character = createCharacterWithCyberdeck(deck);

      expect(isProgramLoaded(character, "edit")).toBe(false);
    });
  });

  describe("getUnloadedPrograms", () => {
    it("should return owned programs not currently loaded", () => {
      const deck = createMockCyberdeck({ loadedPrograms: ["browse"] });
      const character = createCharacterWithCyberdeck(deck, [
        { catalogId: "browse", name: "Browse" },
        { catalogId: "edit", name: "Edit" },
        { catalogId: "toolkit", name: "Toolkit" },
      ]);

      const unloaded = getUnloadedPrograms(character);

      expect(unloaded).toHaveLength(2);
      expect(unloaded.some((p) => p.catalogId === "edit")).toBe(true);
      expect(unloaded.some((p) => p.catalogId === "toolkit")).toBe(true);
    });

    it("should return empty array when all programs loaded", () => {
      const deck = createMockCyberdeck({ loadedPrograms: ["browse", "edit"] });
      const character = createCharacterWithCyberdeck(deck, [
        { catalogId: "browse", name: "Browse" },
        { catalogId: "edit", name: "Edit" },
      ]);

      expect(getUnloadedPrograms(character)).toHaveLength(0);
    });

    it("should return empty array when no programs owned", () => {
      const deck = createMockCyberdeck();
      const character = createCharacterWithCyberdeck(deck);

      expect(getUnloadedPrograms(character)).toEqual([]);
    });
  });

  describe("characterOwnsProgram", () => {
    it("should return true for owned program", () => {
      const deck = createMockCyberdeck();
      const character = createCharacterWithCyberdeck(deck, [
        { catalogId: "browse", name: "Browse" },
      ]);

      expect(characterOwnsProgram(character, "browse")).toBe(true);
    });

    it("should return false for unowned program", () => {
      const deck = createMockCyberdeck();
      const character = createCharacterWithCyberdeck(deck, [
        { catalogId: "browse", name: "Browse" },
      ]);

      expect(characterOwnsProgram(character, "exploit")).toBe(false);
    });

    it("should return false when no programs owned", () => {
      const character = createMockCharacter();

      expect(characterOwnsProgram(character, "browse")).toBe(false);
    });
  });

  describe("calculateEffectiveSlotsUsed", () => {
    it("should count normal programs as 1 slot each", () => {
      const deck = createMockCyberdeck({ loadedPrograms: ["browse", "edit", "toolkit"] });
      const character = createCharacterWithCyberdeck(deck, [
        { catalogId: "browse", name: "Browse" },
        { catalogId: "edit", name: "Edit" },
        { catalogId: "toolkit", name: "Toolkit" },
      ]);
      const programs = [
        createMockProgram({ id: "browse", category: "common" }),
        createMockProgram({ id: "edit", category: "common" }),
        createMockProgram({ id: "toolkit", category: "common" }),
      ];
      const ruleset = createMockRuleset(programs);

      expect(calculateEffectiveSlotsUsed(character, ruleset)).toBe(3);
    });

    it("should count agent programs by their rating", () => {
      const deck = createMockCyberdeck({ loadedPrograms: ["agent-r3", "browse"] });
      const character = createCharacterWithCyberdeck(deck, [
        { catalogId: "agent-r3", name: "Agent Rating 3", rating: 3 },
        { catalogId: "browse", name: "Browse" },
      ]);
      const programs = [
        createMockProgram({ id: "agent-r3", category: "agent" }),
        createMockProgram({ id: "browse", category: "common" }),
      ];
      const ruleset = createMockRuleset(programs);

      // Agent (3 slots) + Browse (1 slot) = 4 slots
      expect(calculateEffectiveSlotsUsed(character, ruleset)).toBe(4);
    });

    it("should default agent rating to 1 if not specified", () => {
      const deck = createMockCyberdeck({ loadedPrograms: ["agent-no-rating"] });
      const character = createCharacterWithCyberdeck(deck, [
        { catalogId: "agent-no-rating", name: "Agent" },
      ]);
      const programs = [createMockProgram({ id: "agent-no-rating", category: "agent" })];
      const ruleset = createMockRuleset(programs);

      expect(calculateEffectiveSlotsUsed(character, ruleset)).toBe(1);
    });

    it("should return 0 when no programs loaded", () => {
      const deck = createMockCyberdeck({ loadedPrograms: [] });
      const character = createCharacterWithCyberdeck(deck);
      const ruleset = createMockRuleset([]);

      expect(calculateEffectiveSlotsUsed(character, ruleset)).toBe(0);
    });

    it("should handle programs not in ruleset as 1 slot", () => {
      const deck = createMockCyberdeck({ loadedPrograms: ["custom-program"] });
      const character = createCharacterWithCyberdeck(deck, [
        { catalogId: "custom-program", name: "Custom" },
      ]);
      const ruleset = createMockRuleset([]); // No programs in ruleset

      // Unknown programs should be counted as 1 slot
      expect(calculateEffectiveSlotsUsed(character, ruleset)).toBe(1);
    });
  });
});
