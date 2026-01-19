/**
 * Tests for /api/magic/validate endpoint
 *
 * Tests magic configuration validation (tradition, spells, powers)
 * including authentication, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as charactersModule from "@/lib/storage/characters";
import * as magicModule from "@/lib/rules/magic";
import type { Character, MagicalPath } from "@/lib/types";
import type { LoadedRuleset } from "@/lib/rules/loader-types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/loader", () => ({
  loadRuleset: vi.fn(),
  extractAugmentationRules: vi.fn(() => ({
    maxEssence: 6,
    maxAttributeBonus: 4,
    maxAvailabilityAtCreation: 12,
    trackEssenceHoles: true,
    magicReductionFormula: "roundUp" as const,
  })),
}));
vi.mock("@/lib/rules/magic");

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = "POST"): NextRequest {
  const headers = new Headers();
  if (body) {
    headers.set("Content-Type", "application/json");
  }

  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

// Mock data factories
function createMockCharacter(overrides?: Partial<Character>): Character {
  return {
    id: "test-char-id",
    userId: "test-user-id",
    name: "Test Character",
    editionCode: "sr5",
    creationMethod: "priority",
    magicalPath: "full-mage" as MagicalPath,
    tradition: "hermetic",
    attributesPurchased: {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 4,
      logic: 5,
      intuition: 4,
      charisma: 3,
      edge: 2,
      magic: 6,
    },
    attributesAugmented: {},
    skills: {},
    qualities: [],
    spells: ["spell-1", "spell-2"],
    adeptPowers: [],
    contacts: [],
    inventory: [],
    karma: { available: 0, spent: 0, total: 0 },
    nuyen: 0,
    essence: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "draft",
    ...overrides,
  } as Character;
}

function createMockRuleset(): LoadedRuleset {
  return {
    edition: {} as LoadedRuleset["edition"],
    books: [],
    creationMethods: [],
  };
}

describe("POST /api/magic/validate", () => {
  const mockUser = "test-user-id";
  const mockCharacter = createMockCharacter();
  const mockRuleset = createMockRuleset();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default successful mocks
    vi.mocked(magicModule.validateTraditionEligibility).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(magicModule.validateSpellAllocation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(magicModule.validateAdeptPowerAllocation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(magicModule.getEssenceMagicState).mockReturnValue({
      baseEssence: 6,
      currentEssence: 6,
      essenceLost: 0,
      essenceHole: 0,
      baseMagicRating: 6,
      effectiveMagicRating: 6,
      magicLostToEssence: 0,
    });
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 400 when editionCode missing (no characterId)", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {});
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Edition code is required");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      characterId: "non-existent-id",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 500 when ruleset fails to load", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: false,
      error: "Failed to load ruleset",
    });

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to load ruleset");
  });

  it("should validate successfully with editionCode only (no character)", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
      magicalPath: "full-mage",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.valid).toBe(true);
    expect(data.errors).toEqual([]);
    expect(data.warnings).toEqual([]);
    expect(data.essenceMagicStatus).toBeNull();
  });

  it("should validate tradition when traditionId provided", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
      magicalPath: "full-mage",
      traditionId: "hermetic",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.valid).toBe(true);
    expect(magicModule.validateTraditionEligibility).toHaveBeenCalledWith(
      expect.objectContaining({ magicalPath: "full-mage" }),
      "hermetic",
      mockRuleset
    );
  });

  it("should return errors when tradition validation fails", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    vi.mocked(magicModule.validateTraditionEligibility).mockReturnValue({
      valid: false,
      errors: [{ code: "INVALID_TRADITION", message: "Tradition not available for this path" }],
      warnings: [],
    });

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
      magicalPath: "adept",
      traditionId: "hermetic",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.valid).toBe(false);
    expect(data.errors).toContain("Tradition not available for this path");
  });

  it("should validate spells when spellIds provided", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    const spellIds = ["spell-1", "spell-2", "spell-3"];

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
      magicalPath: "full-mage",
      spellIds,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(magicModule.validateSpellAllocation).toHaveBeenCalledWith(
      expect.objectContaining({ magicalPath: "full-mage" }),
      spellIds,
      6, // Default spell limit
      mockRuleset
    );
  });

  it("should use custom spellLimit when provided", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    const spellIds = ["spell-1"];
    const customLimit = 10;

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
      magicalPath: "full-mage",
      spellIds,
      spellLimit: customLimit,
    });
    const response = await POST(request);
    await response.json();

    expect(magicModule.validateSpellAllocation).toHaveBeenCalledWith(
      expect.anything(),
      spellIds,
      customLimit,
      mockRuleset
    );
  });

  it("should validate adept powers when adeptPowers provided", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    const adeptPowers = [
      { id: "improved-reflexes", rating: 2 },
      { id: "killing-hands", rating: 1 },
    ];

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
      magicalPath: "adept",
      adeptPowers,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(magicModule.validateAdeptPowerAllocation).toHaveBeenCalledWith(
      expect.objectContaining({ magicalPath: "adept" }),
      adeptPowers,
      6, // Default power point budget
      mockRuleset
    );
  });

  it("should use custom powerPointBudget when provided", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    const adeptPowers = [{ id: "improved-reflexes", rating: 1 }];
    const customBudget = 4;

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
      magicalPath: "mystic-adept",
      adeptPowers,
      powerPointBudget: customBudget,
    });
    const response = await POST(request);
    await response.json();

    expect(magicModule.validateAdeptPowerAllocation).toHaveBeenCalledWith(
      expect.anything(),
      adeptPowers,
      customBudget,
      mockRuleset
    );
  });

  it("should include essenceMagicStatus when character provided", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);

    const { loadRuleset, extractAugmentationRules } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });
    vi.mocked(extractAugmentationRules).mockReturnValue({
      maxEssence: 6,
      maxAttributeBonus: 4,
      maxAvailabilityAtCreation: 12,
      trackEssenceHoles: true,
      magicReductionFormula: "roundUp",
    });

    vi.mocked(magicModule.getEssenceMagicState).mockReturnValue({
      baseEssence: 6,
      currentEssence: 5.5,
      essenceLost: 0.5,
      essenceHole: 0.5,
      baseMagicRating: 6,
      effectiveMagicRating: 5,
      magicLostToEssence: 1,
    });

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      characterId: mockCharacter.id,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.essenceMagicStatus).toEqual({
      effectiveMagic: 5,
      magicLost: 1,
      isBurnedOut: false,
    });
    expect(magicModule.getEssenceMagicState).toHaveBeenCalledWith(
      mockCharacter,
      expect.objectContaining({
        maxEssence: 6,
        trackEssenceHoles: true,
      })
    );
  });

  it("should aggregate errors from multiple validations", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    vi.mocked(magicModule.validateTraditionEligibility).mockReturnValue({
      valid: false,
      errors: [{ code: "INVALID_TRADITION", message: "Invalid tradition" }],
      warnings: [],
    });
    vi.mocked(magicModule.validateSpellAllocation).mockReturnValue({
      valid: false,
      errors: [{ code: "SPELL_LIMIT_EXCEEDED", message: "Too many spells" }],
      warnings: [{ code: "COMBAT_HEAVY", message: "Too many combat spells" }],
    });
    vi.mocked(magicModule.validateAdeptPowerAllocation).mockReturnValue({
      valid: false,
      errors: [{ code: "PP_EXCEEDED", message: "Power points exceeded" }],
      warnings: [],
    });

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
      magicalPath: "mystic-adept",
      traditionId: "hermetic",
      spellIds: ["spell-1"],
      adeptPowers: [{ id: "power-1", rating: 1 }],
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.valid).toBe(false);
    expect(data.errors).toContain("Invalid tradition");
    expect(data.errors).toContain("Too many spells");
    expect(data.errors).toContain("Power points exceeded");
    expect(data.warnings).toContain("Too many combat spells");
  });

  it("should return 500 on unexpected exception", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockRejectedValue(new Error("Unexpected database error"));

    const request = createMockRequest("http://localhost:3000/api/magic/validate", {
      editionCode: "sr5",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Internal server error");

    consoleErrorSpy.mockRestore();
  });
});
