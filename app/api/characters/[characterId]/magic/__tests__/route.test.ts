/**
 * Integration tests for Magic API endpoint
 *
 * Tests:
 * - GET /api/characters/[characterId]/magic - Get character's magical state
 * - PATCH /api/characters/[characterId]/magic - Update character's magical state
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  saveCharacter: vi.fn(),
}));

vi.mock("@/lib/rules/loader", () => ({
  loadRuleset: vi.fn(),
  extractAugmentationRules: vi.fn(),
}));

vi.mock("@/lib/rules/magic", () => ({
  getEssenceMagicState: vi.fn(),
  getSpellDefinition: vi.fn(),
  getAdeptPowerDefinition: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { loadRuleset, extractAugmentationRules } from "@/lib/rules/loader";
import {
  getEssenceMagicState,
  getSpellDefinition,
  getAdeptPowerDefinition,
} from "@/lib/rules/magic";
import { GET, PATCH } from "../route";
import type { Character } from "@/lib/types";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-789";

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Test Mage",
    status: "active",
    editionCode: "sr5",
    editionId: "sr5-edition-id",
    creationMethodId: "priority",
    attachedBookIds: ["core-rulebook"],
    metatype: "Human",
    attributes: {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 2,
      willpower: 5,
      logic: 4,
      intuition: 4,
      charisma: 3,
    },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "magician",
    nuyen: 5000,
    startingNuyen: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: {
      edge: 3,
      magic: 6,
      essence: 6,
    },
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
      overflowDamage: 0,
    },
    spells: ["fireball", "heal"],
    adeptPowers: [],
    initiateGrade: 0,
    metamagics: [],
    sustainedSpells: [],
    spirits: [],
    activeFoci: [],
    ...overrides,
  } as Character;
}

const mockRuleset = {
  edition: {
    id: "sr5-edition-id",
    name: "Shadowrun 5th Edition",
    shortCode: "sr5" as const,
    version: "1.0.0",
    releaseYear: 2013,
    bookIds: ["core-rulebook"],
    creationMethodIds: ["priority"],
    createdAt: new Date().toISOString(),
  },
  books: [],
  creationMethods: [],
};

const mockMagicState = {
  baseEssence: 6,
  currentEssence: 6,
  essenceLost: 0,
  essenceHole: 0,
  baseMagicRating: 6,
  effectiveMagicRating: 6,
  magicLostToEssence: 0,
};

function createMockGetRequest(): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/magic`;
  return new NextRequest(url, {
    method: "GET",
  });
}

function createMockPatchRequest(body: Record<string, unknown>): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/magic`;
  return new NextRequest(url, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

// =============================================================================
// GET TESTS
// =============================================================================

describe("GET /api/characters/[characterId]/magic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });
  });

  describe("Ruleset loading", () => {
    it("should return 500 when ruleset fails to load", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({ success: false });

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to load ruleset");
    });
  });

  describe("Success", () => {
    it("should return magic state for magical character", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({ success: true, ruleset: mockRuleset });
      vi.mocked(extractAugmentationRules).mockReturnValue({
        maxEssence: 6,
        maxAttributeBonus: 4,
        maxAvailabilityAtCreation: 12,
        trackEssenceHoles: true,
        magicReductionFormula: "roundUp",
      });
      vi.mocked(getEssenceMagicState).mockReturnValue(mockMagicState);
      vi.mocked(getSpellDefinition).mockImplementation((spellId) => ({
        id: spellId,
        name: spellId === "fireball" ? "Fireball" : "Heal",
        category: "combat",
        type: "physical",
        range: "LOS",
        duration: "I",
        drain: "F+2",
      }));

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.magicState).toBeDefined();
      expect(data.magicState.effectiveMagicRating).toBe(6);
      expect(data.magicState.initiateGrade).toBe(0);
      expect(data.spellsKnown).toHaveLength(2);
    });

    it("should include enriched spell data", async () => {
      const mockCharacter = createMockCharacter({ spells: ["fireball"] });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({ success: true, ruleset: mockRuleset });
      vi.mocked(extractAugmentationRules).mockReturnValue({
        maxEssence: 6,
        maxAttributeBonus: 4,
        maxAvailabilityAtCreation: 12,
        trackEssenceHoles: true,
        magicReductionFormula: "roundUp",
      });
      vi.mocked(getEssenceMagicState).mockReturnValue(mockMagicState);
      vi.mocked(getSpellDefinition).mockReturnValue({
        id: "fireball",
        name: "Fireball",
        category: "combat",
        type: "physical",
        range: "LOS",
        duration: "I",
        drain: "F+2",
      });

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.spellsKnown[0]).toEqual({
        id: "fireball",
        catalogId: "fireball",
        name: "Fireball",
        category: "combat",
        drain: "F+2",
        selectedAttribute: undefined,
      });
    });

    it("should handle unknown spells gracefully", async () => {
      const mockCharacter = createMockCharacter({ spells: ["unknown-spell"] });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({ success: true, ruleset: mockRuleset });
      vi.mocked(extractAugmentationRules).mockReturnValue({
        maxEssence: 6,
        maxAttributeBonus: 4,
        maxAvailabilityAtCreation: 12,
        trackEssenceHoles: true,
        magicReductionFormula: "roundUp",
      });
      vi.mocked(getEssenceMagicState).mockReturnValue(mockMagicState);
      vi.mocked(getSpellDefinition).mockReturnValue(null);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.spellsKnown[0]).toEqual({
        id: "unknown-spell",
        catalogId: "unknown-spell",
        unknown: true,
      });
    });

    it("should include enriched adept power data", async () => {
      const mockCharacter = createMockCharacter({
        magicalPath: "adept",
        adeptPowers: [
          {
            id: "power-1",
            catalogId: "improved-reflexes",
            name: "Improved Reflexes",
            rating: 2,
            powerPointCost: 3,
          },
        ],
        spells: [],
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({ success: true, ruleset: mockRuleset });
      vi.mocked(extractAugmentationRules).mockReturnValue({
        maxEssence: 6,
        maxAttributeBonus: 4,
        maxAvailabilityAtCreation: 12,
        trackEssenceHoles: true,
        magicReductionFormula: "roundUp",
      });
      vi.mocked(getEssenceMagicState).mockReturnValue(mockMagicState);
      vi.mocked(getAdeptPowerDefinition).mockReturnValue({
        id: "improved-reflexes",
        name: "Improved Reflexes",
        cost: 1.5,
        costType: "perLevel",
        description: "Increases reaction and initiative",
      });

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.powersKnown[0]).toMatchObject({
        catalogId: "improved-reflexes",
        rating: 2,
        name: "Improved Reflexes",
        baseCost: 1.5,
      });
    });

    it("should handle unknown adept powers gracefully", async () => {
      const mockCharacter = createMockCharacter({
        magicalPath: "adept",
        adeptPowers: [
          {
            id: "power-1",
            catalogId: "unknown-power",
            name: "Unknown Power",
            rating: 1,
            powerPointCost: 1,
          },
        ],
        spells: [],
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({ success: true, ruleset: mockRuleset });
      vi.mocked(extractAugmentationRules).mockReturnValue({
        maxEssence: 6,
        maxAttributeBonus: 4,
        maxAvailabilityAtCreation: 12,
        trackEssenceHoles: true,
        magicReductionFormula: "roundUp",
      });
      vi.mocked(getEssenceMagicState).mockReturnValue(mockMagicState);
      vi.mocked(getAdeptPowerDefinition).mockReturnValue(null);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.powersKnown[0]).toMatchObject({
        catalogId: "unknown-power",
        rating: 1,
        unknown: true,
      });
    });

    it("should include metamagics and initiate grade", async () => {
      const mockCharacter = createMockCharacter({
        initiateGrade: 2,
        metamagics: ["centering", "masking"],
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(loadRuleset).mockResolvedValue({ success: true, ruleset: mockRuleset });
      vi.mocked(extractAugmentationRules).mockReturnValue({
        maxEssence: 6,
        maxAttributeBonus: 4,
        maxAvailabilityAtCreation: 12,
        trackEssenceHoles: true,
        magicReductionFormula: "roundUp",
      });
      vi.mocked(getEssenceMagicState).mockReturnValue(mockMagicState);
      vi.mocked(getSpellDefinition).mockReturnValue(null);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.magicState.initiateGrade).toBe(2);
      expect(data.magicState.metamagics).toEqual(["centering", "masking"]);
    });
  });

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockRejectedValue(new Error("Storage error"));

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });
  });
});

// =============================================================================
// PATCH TESTS
// =============================================================================

describe("PATCH /api/characters/[characterId]/magic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockPatchRequest({ sustainedSpells: [] });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockPatchRequest({ sustainedSpells: [] });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });
  });

  describe("Update operations", () => {
    it("should update sustained spells", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);

      const sustainedSpells = [{ spellId: "fireball", force: 4 }];
      const request = createMockPatchRequest({ sustainedSpells });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.magicState.sustainedSpells).toEqual(sustainedSpells);
      expect(saveCharacter).toHaveBeenCalled();
    });

    it("should update bound spirits", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);

      const spirits = [{ type: "fire", force: 5, services: 3 }];
      const request = createMockPatchRequest({ spirits });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.magicState.spirits).toEqual(spirits);
    });

    it("should update active foci", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);

      const activeFoci = [{ focusId: "power-focus-1", karmaBinding: 4 }];
      const request = createMockPatchRequest({ activeFoci });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.magicState.activeFoci).toEqual(activeFoci);
    });

    it("should update metamagics", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);

      const metamagics = ["centering", "masking"];
      const request = createMockPatchRequest({ metamagics });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.magicState.metamagics).toEqual(metamagics);
    });

    it("should update initiate grade", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);

      const request = createMockPatchRequest({ initiateGrade: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.magicState.initiateGrade).toBe(3);
    });

    it("should update multiple fields at once", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(saveCharacter).mockResolvedValue(mockCharacter);

      const updates = {
        initiateGrade: 2,
        metamagics: ["centering"],
        sustainedSpells: [{ spellId: "armor", force: 3 }],
      };
      const request = createMockPatchRequest(updates);
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(saveCharacter).toHaveBeenCalled();
    });

    it("should return success with no changes when body is empty", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockPatchRequest({});
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("No changes applied");
      expect(saveCharacter).not.toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockRejectedValue(new Error("Storage error"));

      const request = createMockPatchRequest({ initiateGrade: 1 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });

    it("should return 500 when saveCharacter fails", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(saveCharacter).mockRejectedValue(new Error("Save failed"));

      const request = createMockPatchRequest({ initiateGrade: 1 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await PATCH(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Internal server error");
    });
  });
});
