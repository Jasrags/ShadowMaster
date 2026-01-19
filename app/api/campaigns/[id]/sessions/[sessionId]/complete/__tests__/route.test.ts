/**
 * Tests for /api/campaigns/[id]/sessions/[sessionId]/complete endpoint
 *
 * Tests session completion and reward distribution (PUT) functionality
 * including authentication, authorization, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { PUT } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import * as characterStorage from "@/lib/storage/characters";
import type { Campaign, CampaignSession, Character } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/characters");
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
    method: "PUT",
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

describe("PUT /api/campaigns/[id]/sessions/[sessionId]/complete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id/complete",
      {
        participantCharacterIds: [],
        karmaAward: 5,
        nuyenAward: 1000,
        distributeRewards: false,
      }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should complete session without distributing rewards", async () => {
    const mockCampaign = createMockCampaign();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id/complete",
      {
        participantCharacterIds: ["char-1"],
        karmaAward: 5,
        nuyenAward: 1000,
        recap: "Great session!",
        distributeRewards: false,
      }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.session.status).toBe("completed");
    expect(data.session.karmaAwarded).toBe(5);
    expect(data.session.nuyenAwarded).toBe(1000);
    expect(data.session.recap).toBe("Great session!");
    expect(characterStorage.awardKarma).not.toHaveBeenCalled();
    expect(characterStorage.awardNuyen).not.toHaveBeenCalled();
  });

  it("should complete session and distribute rewards", async () => {
    const mockCampaign = createMockCampaign();
    const mockCharacter = createMockCharacter({ id: "char-1" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.awardKarma).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.awardNuyen).mockResolvedValue(mockCharacter);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id/complete",
      {
        participantCharacterIds: ["char-1"],
        karmaAward: 5,
        nuyenAward: 1000,
        distributeRewards: true,
      }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.session.status).toBe("completed");
    expect(data.session.rewardsDistributed).toBe(true);
    expect(characterStorage.awardKarma).toHaveBeenCalledWith("player-1", "char-1", 5);
    expect(characterStorage.awardNuyen).toHaveBeenCalledWith("player-1", "char-1", 1000);
  });

  it("should distribute rewards to multiple participants", async () => {
    const mockCampaign = createMockCampaign();
    const mockCharacter1 = createMockCharacter({ id: "char-1", ownerId: "player-1" });
    const mockCharacter2 = createMockCharacter({ id: "char-2", ownerId: "player-2" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById)
      .mockResolvedValueOnce(mockCharacter1)
      .mockResolvedValueOnce(mockCharacter2);
    vi.mocked(characterStorage.awardKarma).mockResolvedValue(mockCharacter1);
    vi.mocked(characterStorage.awardNuyen).mockResolvedValue(mockCharacter1);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id/complete",
      {
        participantCharacterIds: ["char-1", "char-2"],
        karmaAward: 5,
        nuyenAward: 1000,
        distributeRewards: true,
      }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(characterStorage.awardKarma).toHaveBeenCalledTimes(2);
    expect(characterStorage.awardNuyen).toHaveBeenCalledTimes(2);
  });

  it("should return 403 when user is not GM", async () => {
    const mockCampaign = createMockCampaign({ gmId: "other-gm-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id/complete",
      {
        participantCharacterIds: [],
        karmaAward: 5,
        nuyenAward: 1000,
        distributeRewards: false,
      }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can complete sessions");
    expect(campaignStorage.updateCampaign).not.toHaveBeenCalled();
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id/sessions/test-session-id/complete",
      {
        participantCharacterIds: [],
        karmaAward: 5,
        nuyenAward: 1000,
        distributeRewards: false,
      }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "nonexistent-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should return 404 when session not found", async () => {
    const mockCampaign = createMockCampaign({ sessions: [] });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/nonexistent-session/complete",
      {
        participantCharacterIds: [],
        karmaAward: 5,
        nuyenAward: 1000,
        distributeRewards: false,
      }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "nonexistent-session" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Session not found");
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id/complete",
      {
        participantCharacterIds: [],
        karmaAward: 5,
        nuyenAward: 1000,
        distributeRewards: false,
      }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});
