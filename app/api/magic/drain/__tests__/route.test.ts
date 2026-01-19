/**
 * Tests for /api/magic/drain endpoint
 *
 * Tests drain calculation for magical actions (spellcasting, summoning, binding)
 * including authentication, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as charactersModule from "@/lib/storage/characters";
import * as magicModule from "@/lib/rules/magic";
import type { Character, MagicalPath, DrainResult } from "@/lib/types";
import type { LoadedRuleset } from "@/lib/rules/loader-types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/loader", () => ({
  loadRuleset: vi.fn(),
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
    name: "Test Mage",
    editionCode: "sr5",
    creationMethod: "priority",
    magicalPath: "full-mage" as MagicalPath,
    tradition: "hermetic",
    attributesPurchased: {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 5,
      logic: 6,
      intuition: 4,
      charisma: 3,
      edge: 2,
      magic: 6,
    },
    attributesAugmented: {},
    skills: {},
    qualities: [],
    spells: ["manabolt", "stunbolt"],
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

function createMockDrainResult(overrides?: Partial<DrainResult>): DrainResult {
  return {
    drainValue: 5,
    drainType: "stun",
    resistancePool: 11,
    drainFormula: "F-1",
    ...overrides,
  };
}

describe("POST /api/magic/drain", () => {
  const mockUser = "test-user-id";
  const mockCharacter = createMockCharacter();
  const mockRuleset = createMockRuleset();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default successful mock for calculateDrain
    vi.mocked(magicModule.calculateDrain).mockReturnValue(createMockDrainResult());
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "spellcasting",
      force: 5,
      editionCode: "sr5",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 400 when action missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      force: 5,
      editionCode: "sr5",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Action and force are required");
  });

  it("should return 400 when force missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "spellcasting",
      editionCode: "sr5",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Action and force are required");
  });

  it("should return 400 when editionCode missing (no characterId)", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "spellcasting",
      force: 5,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Edition code is required");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "spellcasting",
      force: 5,
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

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "spellcasting",
      force: 5,
      editionCode: "sr5",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to load ruleset");
  });

  it("should calculate drain for spellcasting with spellId", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    vi.mocked(magicModule.calculateDrain).mockReturnValue(
      createMockDrainResult({
        drainValue: 4,
        drainType: "stun",
        resistancePool: 11,
        drainFormula: "F-2",
      })
    );

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "spellcasting",
      force: 6,
      spellId: "manabolt",
      editionCode: "sr5",
      traditionId: "hermetic",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.drainValue).toBe(4);
    expect(data.drainType).toBe("stun");
    expect(data.resistancePool).toBe(11);
    expect(data.formula).toBe("F-2");
    expect(magicModule.calculateDrain).toHaveBeenCalledWith(
      expect.objectContaining({ tradition: "hermetic" }),
      expect.objectContaining({
        action: "spellcasting",
        force: 6,
        spellId: "manabolt",
      }),
      mockRuleset
    );
  });

  it("should calculate drain for summoning with spiritType", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    vi.mocked(magicModule.calculateDrain).mockReturnValue(
      createMockDrainResult({
        drainValue: 5,
        drainType: "stun",
        resistancePool: 11,
        drainFormula: "F",
      })
    );

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "summoning",
      force: 5,
      spiritType: "fire",
      editionCode: "sr5",
      traditionId: "hermetic",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.drainValue).toBe(5);
    expect(data.formula).toBe("F");
    expect(magicModule.calculateDrain).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "summoning",
        force: 5,
        spiritType: "fire",
      }),
      mockRuleset
    );
  });

  it("should calculate drain for binding action", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    vi.mocked(magicModule.calculateDrain).mockReturnValue(
      createMockDrainResult({
        drainValue: 8,
        drainType: "physical",
        resistancePool: 11,
        drainFormula: "2F",
      })
    );

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "binding",
      force: 4,
      spiritType: "earth",
      editionCode: "sr5",
      traditionId: "shamanic",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.drainValue).toBe(8);
    expect(data.drainType).toBe("physical");
    expect(data.formula).toBe("2F");
  });

  it("should return physical drain type when drain exceeds magic", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    vi.mocked(magicModule.calculateDrain).mockReturnValue(
      createMockDrainResult({
        drainValue: 10,
        drainType: "physical",
        resistancePool: 11,
        drainFormula: "F+4",
      })
    );

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "spellcasting",
      force: 6,
      spellId: "powerbolt",
      editionCode: "sr5",
      traditionId: "hermetic",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.drainType).toBe("physical");
  });

  it("should use character data when characterId provided", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    vi.mocked(magicModule.calculateDrain).mockReturnValue(createMockDrainResult());

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "spellcasting",
      force: 5,
      spellId: "manabolt",
      characterId: mockCharacter.id,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(magicModule.calculateDrain).toHaveBeenCalledWith(
      mockCharacter,
      expect.objectContaining({
        action: "spellcasting",
        force: 5,
        spellId: "manabolt",
      }),
      mockRuleset
    );
    expect(loadRuleset).toHaveBeenCalledWith(
      expect.objectContaining({
        editionCode: mockCharacter.editionCode,
        bookIds: mockCharacter.attachedBookIds,
      })
    );
  });

  it("should use traditionId from body when no character", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset as LoadedRuleset,
    });

    vi.mocked(magicModule.calculateDrain).mockReturnValue(createMockDrainResult());

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "spellcasting",
      force: 5,
      editionCode: "sr5",
      traditionId: "shamanic",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(magicModule.calculateDrain).toHaveBeenCalledWith(
      expect.objectContaining({ tradition: "shamanic" }),
      expect.anything(),
      mockRuleset
    );
  });

  it("should return 500 on unexpected exception with error message", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser);

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockRejectedValue(new Error("Unexpected database failure"));

    const request = createMockRequest("http://localhost:3000/api/magic/drain", {
      action: "spellcasting",
      force: 5,
      editionCode: "sr5",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unexpected database failure");

    consoleErrorSpy.mockRestore();
  });
});
