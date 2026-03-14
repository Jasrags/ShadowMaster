/**
 * Tests for /api/campaigns/[id]/sessions/[sessionId]/edge-refresh endpoint
 *
 * Tests campaign membership validation for individual edge refresh
 * to prevent cross-campaign edge manipulation (issue #682).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import * as characterStorage from "@/lib/storage/characters";
import type { Campaign, CampaignSession, Character } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/characters");
vi.mock("uuid", () => ({
  v4: () => "generated-uuid",
}));
vi.mock("@/lib/storage/activity", () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/storage/notifications", () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}));

// Helper to create a NextRequest
function createMockRequest(url: string, body?: unknown): NextRequest {
  const headers = new Headers();
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
    headers,
  });

  Object.defineProperty(request, "nextUrl", {
    value: urlObj,
    writable: false,
  });

  if (body !== undefined) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

// Mock session factory
function createMockSession(overrides?: Partial<CampaignSession>): CampaignSession {
  return {
    id: "test-session-id",
    title: "Test Session",
    scheduledAt: new Date().toISOString(),
    durationMinutes: 180,
    status: "scheduled",
    attendeeIds: ["player-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// Mock campaign factory
function createMockCampaign(overrides?: Partial<Campaign>): Campaign {
  return {
    id: "test-campaign-id",
    gmId: "test-gm-id",
    title: "Test Campaign",
    description: "A test campaign",
    status: "active",
    editionId: "sr5-edition-id",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "street",
    visibility: "public",
    playerIds: ["player-1"],
    sessions: [createMockSession()],
    advancementSettings: {
      trainingTimeMultiplier: 1.0,
      attributeKarmaMultiplier: 5,
      skillKarmaMultiplier: 2,
      skillGroupKarmaMultiplier: 5,
      knowledgeSkillKarmaMultiplier: 1,
      specializationKarmaCost: 7,
      spellKarmaCost: 5,
      complexFormKarmaCost: 4,
      attributeRatingCap: 10,
      skillRatingCap: 13,
      allowInstantAdvancement: false,
      requireApproval: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

// Mock character factory
function createMockCharacter(overrides?: Partial<Character>): Character {
  return {
    id: "test-character-id",
    ownerId: "player-1",
    campaignId: "test-campaign-id",
    name: "Test Character",
    editionId: "sr5-edition-id",
    editionCode: "sr5",
    metatype: "human",
    gender: "male",
    age: 25,
    attributes: {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 3,
      logic: 3,
      intuition: 3,
      charisma: 3,
      edge: 2,
      essence: 6,
    },
    skills: [],
    qualities: [],
    gear: [],
    nuyen: 5000,
    karma: 0,
    state: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

const BASE_URL =
  "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id/edge-refresh";

describe("POST /api/campaigns/[id]/sessions/[sessionId]/edge-refresh", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 404 when individual character belongs to a different campaign", async () => {
    const mockCampaign = createMockCampaign();
    const crossCampaignCharacter = createMockCharacter({
      id: "other-campaign-char",
      campaignId: "other-campaign-id",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(crossCampaignCharacter);

    const request = createMockRequest(BASE_URL, {
      scope: "individual",
      characterId: "other-campaign-char",
      reason: "Edge refresh test",
    });
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
    expect(characterStorage.restoreFullEdge).not.toHaveBeenCalled();
  });

  it("should return 404 when individual character has no campaignId", async () => {
    const mockCampaign = createMockCampaign();
    const unassignedCharacter = createMockCharacter({
      id: "unassigned-char",
      campaignId: undefined,
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(unassignedCharacter);

    const request = createMockRequest(BASE_URL, {
      scope: "individual",
      characterId: "unassigned-char",
      reason: "Edge refresh test",
    });
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
    expect(characterStorage.restoreFullEdge).not.toHaveBeenCalled();
  });

  it("should allow edge refresh for character in same campaign", async () => {
    const mockCampaign = createMockCampaign();
    const mockCharacter = createMockCharacter();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.getCurrentEdge).mockReturnValue(1);
    vi.mocked(characterStorage.getMaxEdge).mockReturnValue(2);
    vi.mocked(characterStorage.restoreFullEdge).mockResolvedValue(mockCharacter);

    const request = createMockRequest(BASE_URL, {
      scope: "individual",
      characterId: "test-character-id",
      reason: "Edge refresh test",
    });
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(characterStorage.restoreFullEdge).toHaveBeenCalledWith("player-1", "test-character-id");
  });
});
