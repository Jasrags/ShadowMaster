/**
 * Integration tests for Modifier API endpoints
 *
 * Tests:
 * - GET /api/characters/[characterId]/modifiers - List active modifiers
 * - POST /api/characters/[characterId]/modifiers - Add a modifier
 * - DELETE /api/characters/[characterId]/modifiers/[modifierId] - Remove a modifier
 *
 * @see Issue #114
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  updateCharacterWithAudit: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { GET, POST } from "../route";
import { DELETE } from "../[modifierId]/route";
import type { Character } from "@/lib/types";
import type { ActiveModifier } from "@/lib/types/effects";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";
const TEST_MODIFIER_ID = "mod-789";

const mockModifier: ActiveModifier = {
  id: TEST_MODIFIER_ID,
  name: "Partial Cover",
  source: "environment",
  effect: {
    id: "partial-cover-effect",
    type: "dice-pool-modifier",
    triggers: ["ranged-attack"],
    target: {},
    value: -2,
  },
  appliedBy: TEST_USER_ID,
  appliedAt: "2025-06-15T12:00:00.000Z",
};

function createTestCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Test Runner",
    metatype: "Human",
    editionCode: "sr5",
    creationMethod: "priority",
    status: "active",
    magicalPath: "mundane",
    attributes: {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 3,
      intuition: 3,
      charisma: 3,
    },
    specialAttributes: { edge: 2, essence: 6 },
    skills: {},
    nuyen: 5000,
    karmaTotal: 25,
    karmaCurrent: 10,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    metadata: { version: 1, lastModifiedBy: TEST_USER_ID },
    auditLog: [],
    ...overrides,
  } as Character;
}

function makeRequest(method: string, body?: unknown): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/modifiers`;
  if (body) {
    return new NextRequest(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
  return new NextRequest(url, { method });
}

const mockParams = Promise.resolve({ characterId: TEST_CHARACTER_ID });
const mockParamsWithModifier = Promise.resolve({
  characterId: TEST_CHARACTER_ID,
  modifierId: TEST_MODIFIER_ID,
});

// =============================================================================
// TESTS
// =============================================================================

describe("GET /api/characters/[characterId]/modifiers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    const res = await GET(makeRequest("GET"), { params: mockParams });
    expect(res.status).toBe(401);
  });

  it("returns 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(null);
    const res = await GET(makeRequest("GET"), { params: mockParams });
    expect(res.status).toBe(404);
  });

  it("returns 403 when not the owner", async () => {
    vi.mocked(getSession).mockResolvedValue("different-user");
    vi.mocked(getCharacter).mockResolvedValue(createTestCharacter());
    const res = await GET(makeRequest("GET"), { params: mockParams });
    expect(res.status).toBe(403);
  });

  it("returns empty array when no modifiers", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createTestCharacter());
    const res = await GET(makeRequest("GET"), { params: mockParams });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.modifiers).toEqual([]);
  });

  it("returns existing modifiers", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(
      createTestCharacter({ activeModifiers: [mockModifier] })
    );
    const res = await GET(makeRequest("GET"), { params: mockParams });
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.modifiers).toHaveLength(1);
    expect(data.modifiers[0].name).toBe("Partial Cover");
  });
});

describe("POST /api/characters/[characterId]/modifiers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(updateCharacterWithAudit).mockResolvedValue(createTestCharacter());
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    const res = await POST(makeRequest("POST", {}), { params: mockParams });
    expect(res.status).toBe(401);
  });

  it("returns 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(null);
    const res = await POST(makeRequest("POST", {}), { params: mockParams });
    expect(res.status).toBe(404);
  });

  it("returns 403 when not the owner", async () => {
    vi.mocked(getSession).mockResolvedValue("different-user");
    vi.mocked(getCharacter).mockResolvedValue(createTestCharacter());
    const res = await POST(makeRequest("POST", {}), { params: mockParams });
    expect(res.status).toBe(403);
  });

  it("returns 400 on validation failure", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createTestCharacter());
    const res = await POST(makeRequest("POST", { source: "invalid", duration: "bad" }), {
      params: mockParams,
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.validationErrors).toBeDefined();
  });

  it("adds template modifier successfully", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createTestCharacter());
    const res = await POST(
      makeRequest("POST", {
        templateId: "partial-cover",
        source: "environment",
        duration: "scene",
      }),
      { params: mockParams }
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.modifier.name).toBe("Partial Cover");
    expect(data.modifier.source).toBe("environment");
  });

  it("adds custom modifier successfully", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createTestCharacter());
    const res = await POST(
      makeRequest("POST", {
        name: "Wind Penalty",
        source: "environment",
        effect: { type: "dice-pool-modifier", triggers: ["ranged-attack"], value: -3 },
        duration: "scene",
        notes: "Strong crosswind",
      }),
      { params: mockParams }
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.modifier.name).toBe("Wind Penalty");
    expect(data.modifier.notes).toBe("Strong crosswind");
  });

  it("calls updateCharacterWithAudit with modifier_applied", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createTestCharacter());
    await POST(
      makeRequest("POST", {
        templateId: "partial-cover",
        source: "environment",
        duration: "scene",
      }),
      { params: mockParams }
    );
    expect(updateCharacterWithAudit).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.objectContaining({ activeModifiers: expect.any(Array) }),
      expect.objectContaining({ action: "modifier_applied" })
    );
  });
});

describe("DELETE /api/characters/[characterId]/modifiers/[modifierId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(updateCharacterWithAudit).mockResolvedValue(createTestCharacter());
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    const res = await DELETE(makeRequest("DELETE"), { params: mockParamsWithModifier });
    expect(res.status).toBe(401);
  });

  it("returns 404 when character not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(null);
    const res = await DELETE(makeRequest("DELETE"), { params: mockParamsWithModifier });
    expect(res.status).toBe(404);
  });

  it("returns 403 when not the owner", async () => {
    vi.mocked(getSession).mockResolvedValue("different-user");
    vi.mocked(getCharacter).mockResolvedValue(createTestCharacter());
    const res = await DELETE(makeRequest("DELETE"), { params: mockParamsWithModifier });
    expect(res.status).toBe(403);
  });

  it("returns 404 when modifier not found", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(createTestCharacter({ activeModifiers: [] }));
    const res = await DELETE(makeRequest("DELETE"), { params: mockParamsWithModifier });
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Modifier not found");
  });

  it("removes modifier successfully", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(
      createTestCharacter({ activeModifiers: [mockModifier] })
    );
    const res = await DELETE(makeRequest("DELETE"), { params: mockParamsWithModifier });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("calls updateCharacterWithAudit with modifier_removed", async () => {
    vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(getCharacter).mockResolvedValue(
      createTestCharacter({ activeModifiers: [mockModifier] })
    );
    await DELETE(makeRequest("DELETE"), { params: mockParamsWithModifier });
    expect(updateCharacterWithAudit).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.objectContaining({ activeModifiers: [] }),
      expect.objectContaining({ action: "modifier_removed" })
    );
  });
});
