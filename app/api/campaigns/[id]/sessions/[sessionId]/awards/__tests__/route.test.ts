/**
 * Tests for /api/campaigns/[id]/sessions/[sessionId]/awards endpoint
 *
 * Tests mid-session individual award distribution (POST) functionality
 * including authentication, authorization, validation, and error handling.
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
  "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id/awards";

const defaultBody = {
  characterId: "test-character-id",
  karma: 3,
  nuyen: 500,
  reason: "Excellent roleplay",
};

describe("POST /api/campaigns/[id]/sessions/[sessionId]/awards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(BASE_URL, defaultBody);
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);

    const request = createMockRequest(BASE_URL, defaultBody);
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should return 403 when user is not GM", async () => {
    const mockCampaign = createMockCampaign({ gmId: "other-gm-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(BASE_URL, defaultBody);
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can give awards");
    expect(campaignStorage.updateCampaign).not.toHaveBeenCalled();
  });

  it("should return 404 when session not found", async () => {
    const mockCampaign = createMockCampaign({ sessions: [] });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(BASE_URL, defaultBody);
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Session not found");
  });

  it("should return 400 when session is completed", async () => {
    const mockCampaign = createMockCampaign({
      sessions: [createMockSession({ status: "completed" })],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(BASE_URL, defaultBody);
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Cannot award during a completed or cancelled session");
  });

  it("should return 400 when reason is empty", async () => {
    const mockCampaign = createMockCampaign();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(BASE_URL, { ...defaultBody, reason: "" });
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Reason is required");
  });

  it("should return 400 when both karma and nuyen are 0", async () => {
    const mockCampaign = createMockCampaign();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(BASE_URL, {
      ...defaultBody,
      karma: 0,
      nuyen: 0,
    });
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("At least one of karma or nuyen must be greater than 0");
  });

  it("should return 404 when character not found", async () => {
    const mockCampaign = createMockCampaign();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(null);

    const request = createMockRequest(BASE_URL, defaultBody);
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 404 when character belongs to a different campaign", async () => {
    const mockCampaign = createMockCampaign();
    const crossCampaignCharacter = createMockCharacter({
      id: "other-campaign-char",
      campaignId: "other-campaign-id",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(crossCampaignCharacter);

    const request = createMockRequest(BASE_URL, {
      ...defaultBody,
      characterId: "other-campaign-char",
    });
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
    expect(characterStorage.awardKarma).not.toHaveBeenCalled();
    expect(characterStorage.awardNuyen).not.toHaveBeenCalled();
  });

  it("should return 404 when character has no campaignId", async () => {
    const mockCampaign = createMockCampaign();
    const unassignedCharacter = createMockCharacter({
      id: "unassigned-char",
      campaignId: undefined,
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(unassignedCharacter);

    const request = createMockRequest(BASE_URL, {
      ...defaultBody,
      characterId: "unassigned-char",
    });
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
    expect(characterStorage.awardKarma).not.toHaveBeenCalled();
  });

  it("should award karma only", async () => {
    const mockCampaign = createMockCampaign();
    const mockCharacter = createMockCharacter();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.awardKarma).mockResolvedValue(mockCharacter);

    const request = createMockRequest(BASE_URL, {
      ...defaultBody,
      karma: 5,
      nuyen: 0,
    });
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.award.karma).toBe(5);
    expect(data.award.nuyen).toBe(0);
    expect(characterStorage.awardKarma).toHaveBeenCalledWith("player-1", "test-character-id", 5);
    expect(characterStorage.awardNuyen).not.toHaveBeenCalled();
  });

  it("should award nuyen only", async () => {
    const mockCampaign = createMockCampaign();
    const mockCharacter = createMockCharacter();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.awardNuyen).mockResolvedValue(mockCharacter);

    const request = createMockRequest(BASE_URL, {
      ...defaultBody,
      karma: 0,
      nuyen: 1000,
    });
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.award.karma).toBe(0);
    expect(data.award.nuyen).toBe(1000);
    expect(characterStorage.awardKarma).not.toHaveBeenCalled();
    expect(characterStorage.awardNuyen).toHaveBeenCalledWith("player-1", "test-character-id", 1000);
  });

  it("should award both karma and nuyen", async () => {
    const mockCampaign = createMockCampaign();
    const mockCharacter = createMockCharacter();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.awardKarma).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.awardNuyen).mockResolvedValue(mockCharacter);

    const request = createMockRequest(BASE_URL, defaultBody);
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.award.id).toBe("generated-uuid");
    expect(data.award.characterId).toBe("test-character-id");
    expect(data.award.characterName).toBe("Test Character");
    expect(data.award.karma).toBe(3);
    expect(data.award.nuyen).toBe(500);
    expect(data.award.reason).toBe("Excellent roleplay");
    expect(characterStorage.awardKarma).toHaveBeenCalledWith("player-1", "test-character-id", 3);
    expect(characterStorage.awardNuyen).toHaveBeenCalledWith("player-1", "test-character-id", 500);
  });

  it("should append to existing midSessionAwards array", async () => {
    const existingAward = {
      id: "existing-award-id",
      characterId: "other-char-id",
      characterName: "Other Character",
      karma: 2,
      nuyen: 0,
      reason: "Previous award",
      awardedBy: "test-gm-id",
      awardedAt: new Date().toISOString(),
    };

    const mockCampaign = createMockCampaign({
      sessions: [createMockSession({ midSessionAwards: [existingAward] })],
    });
    const mockCharacter = createMockCharacter();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.awardKarma).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.awardNuyen).mockResolvedValue(mockCharacter);

    const request = createMockRequest(BASE_URL, defaultBody);
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.session.midSessionAwards).toHaveLength(2);
    expect(data.session.midSessionAwards[0].id).toBe("existing-award-id");
    expect(data.session.midSessionAwards[1].id).toBe("generated-uuid");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest(BASE_URL, defaultBody);
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});
