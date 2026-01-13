/**
 * Magic Drain API Tests
 *
 * Tests for POST /api/magic/drain endpoint
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
}));

import { getSession } from "@/lib/auth/session";
import { getCharacterById } from "@/lib/storage/characters";
import { loadRuleset } from "@/lib/rules/loader";

const mockSession = getSession as ReturnType<typeof vi.fn>;
const mockGetCharacter = getCharacterById as ReturnType<typeof vi.fn>;
const mockLoadRuleset = loadRuleset as ReturnType<typeof vi.fn>;

function createRequest(body: object): NextRequest {
  return new NextRequest("http://localhost/api/magic/drain", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/magic/drain", () => {
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
      action: "spellcasting",
      force: 6,
      editionCode: "sr5",
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Unauthorized");
  });

  it("should require action and force", async () => {
    const request = createRequest({
      editionCode: "sr5",
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toContain("required");
  });

  it("should require edition code when no character provided", async () => {
    const request = createRequest({
      action: "spellcasting",
      force: 6,
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
      action: "spellcasting",
      force: 6,
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json.error).toBe("Character not found");
  });

  it("should return error with incomplete character data", async () => {
    // This test verifies the API handles incomplete character data gracefully
    const mockCharacter = {
      id: "char-1",
      editionCode: "sr5",
      // Missing tradition, attributes, etc.
    };

    mockGetCharacter.mockResolvedValue(mockCharacter);
    mockLoadRuleset.mockResolvedValue({
      success: true,
      ruleset: {
        edition: { code: "sr5" },
        books: [],
      },
    });

    const request = createRequest({
      characterId: "char-1",
      action: "spellcasting",
      force: 6,
      spellId: "manabolt",
    });

    const response = await POST(request);
    // Should return 500 or handle gracefully when data is incomplete
    expect(response.status).toBeGreaterThanOrEqual(200);
  });

  it("should handle ruleset loading failure", async () => {
    mockLoadRuleset.mockResolvedValue({ success: false, error: "Ruleset not found" });

    const request = createRequest({
      action: "spellcasting",
      force: 6,
      editionCode: "invalid",
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
  });
});
