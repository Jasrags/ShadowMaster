/**
 * Magic Validate API Tests
 * 
 * Tests for POST /api/magic/validate endpoint
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacterById: vi.fn(),
}));

vi.mock("@/lib/rules/loader", () => ({
  loadRuleset: vi.fn(),
  extractAugmentationRules: vi.fn(() => ({
    maxEssence: 6,
    maxAttributeBonus: 4,
    maxAvailabilityAtCreation: 12,
    trackEssenceHoles: false,
    magicReductionFormula: "roundUp",
  })),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacterById } from "@/lib/storage/characters";
import { loadRuleset } from "@/lib/rules/loader";

const mockSession = getSession as ReturnType<typeof vi.fn>;
const mockGetCharacter = getCharacterById as ReturnType<typeof vi.fn>;
const mockLoadRuleset = loadRuleset as ReturnType<typeof vi.fn>;

function createRequest(body: object): NextRequest {
  return new NextRequest("http://localhost/api/magic/validate", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/magic/validate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSession.mockResolvedValue("user-123");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should require authentication", async () => {
    mockSession.mockResolvedValue(null);

    const request = createRequest({
      editionCode: "sr5",
      traditionId: "hermetic",
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Unauthorized");
  });

  it("should require edition code", async () => {
    const request = createRequest({
      traditionId: "hermetic",
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toContain("Edition code");
  });

  it("should return 404 for non-existent character", async () => {
    mockGetCharacter.mockResolvedValue(null);

    const request = createRequest({
      characterId: "nonexistent",
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json.error).toBe("Character not found");
  });

  it("should validate tradition eligibility", async () => {
    const mockRuleset = {
      edition: { code: "sr5" },
      books: [{
        payload: {
          modules: {
            traditions: {
              payload: {
                traditions: [{
                  id: "hermetic",
                  name: "Hermetic",
                  drainAttributes: ["LOG", "WIL"],
                  spiritTypes: {},
                }],
              },
            },
            magic: {
              payload: {
                spells: { combat: [], detection: [], health: [], illusion: [], manipulation: [] },
              },
            },
          },
        },
      }],
    };

    mockLoadRuleset.mockResolvedValue({ success: true, ruleset: mockRuleset });

    const request = createRequest({
      editionCode: "sr5",
      traditionId: "hermetic",
      magicalPath: "full-mage",
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.valid).toBeDefined();
  });

  it("should validate spell allocation", async () => {
    const mockRuleset = {
      edition: { code: "sr5" },
      books: [{
        payload: {
          modules: {
            magic: {
              payload: {
                spells: {
                  combat: [{ id: "manabolt", name: "Manabolt" }],
                  detection: [],
                  health: [],
                  illusion: [],
                  manipulation: [],
                },
              },
            },
          },
        },
      }],
    };

    mockLoadRuleset.mockResolvedValue({ success: true, ruleset: mockRuleset });

    const request = createRequest({
      editionCode: "sr5",
      magicalPath: "full-mage",
      spellIds: ["manabolt"],
      spellLimit: 6,
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("should handle ruleset loading failure", async () => {
    mockLoadRuleset.mockResolvedValue({ success: false, error: "Ruleset not found" });

    const request = createRequest({
      editionCode: "invalid",
      traditionId: "hermetic",
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
  });

  it("should return essence-magic status for character", async () => {
    const mockCharacter = {
      id: "char-1",
      editionCode: "sr5",
      magicalPath: "full-mage",
      tradition: "hermetic",
      specialAttributes: { magic: 5, essence: 4.5 },
    };

    const mockRuleset = {
      edition: { code: "sr5" },
      books: [{
        payload: {
          modules: {},
        },
      }],
    };

    mockGetCharacter.mockResolvedValue(mockCharacter);
    mockLoadRuleset.mockResolvedValue({ success: true, ruleset: mockRuleset });

    const request = createRequest({
      characterId: "char-1",
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.essenceMagicStatus).toBeDefined();
    expect(json.essenceMagicStatus.effectiveMagic).toBeDefined();
  });
});
