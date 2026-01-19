/**
 * Tests for /api/characters/[characterId]/sync/shield endpoint
 *
 * Tests stability shield status retrieval (GET) including
 * authentication, character lookup, and shield status reporting.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as characterStorageModule from "@/lib/storage/characters";
import * as legalityValidatorModule from "@/lib/rules/sync/legality-validator";

import type { Character, StabilityShield } from "@/lib/types";
import { createMockCharacter } from "@/__tests__/mocks/storage";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/sync/legality-validator");
vi.mock("@/lib/storage/snapshot-cache", () => ({
  SnapshotCache: vi.fn().mockImplementation(function (this: Record<string, unknown>) {
    this.getRulesetSnapshot = vi.fn();
    this.getCurrentSnapshot = vi.fn();
    return this;
  }),
}));

// Helper to create a NextRequest
function createMockRequest(url: string): NextRequest {
  return new NextRequest(url, { method: "GET" });
}

// Mock data factory
function createMockShield(overrides?: Partial<StabilityShield>): StabilityShield {
  return {
    status: "green",
    label: "Synchronized",
    tooltip: "Character is synchronized with current ruleset",
    ...overrides,
  };
}

describe("GET /api/characters/[characterId]/sync/shield", () => {
  const userId = "test-user-id";
  const characterId = "test-character-id";
  let mockCharacter: Character;
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
      id: characterId,
      ownerId: userId,
      status: "active",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(legalityValidatorModule.getLegalityShield).mockResolvedValue(createMockShield());
  });

  afterEach(() => {
    if (consoleSpy) {
      consoleSpy.mockRestore();
    }
  });

  it("should return 401 when unauthenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync/shield`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null);

    const request = createMockRequest(`/api/characters/${characterId}/sync/shield`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Character not found");
  });

  it("should return green shield for valid character", async () => {
    vi.mocked(legalityValidatorModule.getLegalityShield).mockResolvedValue(
      createMockShield({
        status: "green",
        label: "Synchronized",
        tooltip: "Character is synchronized with current ruleset",
      })
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync/shield`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe("green");
  });

  it("should return yellow shield for draft", async () => {
    const draftCharacter = {
      ...mockCharacter,
      status: "draft" as const,
    };
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(draftCharacter);
    vi.mocked(legalityValidatorModule.getLegalityShield).mockResolvedValue(
      createMockShield({
        status: "yellow",
        label: "Draft",
        tooltip: "Character is in draft mode",
        actionRequired: "Complete character creation",
      })
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync/shield`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe("yellow");
  });

  it("should return red shield for invalid", async () => {
    vi.mocked(legalityValidatorModule.getLegalityShield).mockResolvedValue(
      createMockShield({
        status: "red",
        label: "Invalid",
        tooltip: "Character has validation errors",
        actionRequired: "Resolve synchronization issues",
      })
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync/shield`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe("red");
  });

  it("should return 500 on internal error", async () => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(legalityValidatorModule.getLegalityShield).mockRejectedValue(
      new Error("Validation error")
    );

    const request = createMockRequest(`/api/characters/${characterId}/sync/shield`);
    const response = await GET(request, { params: Promise.resolve({ characterId }) });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Failed to get shield status");
  });
});
