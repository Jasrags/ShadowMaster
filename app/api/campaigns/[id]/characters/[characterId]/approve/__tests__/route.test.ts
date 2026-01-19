/**
 * Tests for /api/campaigns/[id]/characters/[characterId]/approve endpoint
 *
 * Tests character approval/rejection (POST) functionality including
 * authentication, authorization, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import * as characterStorage from "@/lib/storage/characters";
import type { Campaign, Character } from "@/lib/types";

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

// Helper to create a NextRequest with JSON body
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
    state: "draft",
    approvalStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

describe("POST /api/campaigns/[id]/characters/[characterId]/approve", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/test-character-id/approve",
      { action: "approve" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", characterId: "test-character-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should approve character successfully", async () => {
    const mockCampaign = createMockCampaign({ gmId: "test-gm-id" });
    const mockCharacter = createMockCharacter({
      campaignId: "test-campaign-id",
      approvalStatus: "pending",
    });
    const updatedCharacter = { ...mockCharacter, approvalStatus: "approved" as const };

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.updateCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/test-character-id/approve",
      { action: "approve" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", characterId: "test-character-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.character).toBeDefined();
    expect(characterStorage.updateCharacter).toHaveBeenCalledWith(
      mockCharacter.ownerId,
      "test-character-id",
      { approvalStatus: "approved", approvalFeedback: undefined }
    );
  });

  it("should reject character with feedback", async () => {
    const mockCampaign = createMockCampaign({ gmId: "test-gm-id" });
    const mockCharacter = createMockCharacter({
      campaignId: "test-campaign-id",
      approvalStatus: "pending",
    });
    const updatedCharacter = {
      ...mockCharacter,
      approvalStatus: "rejected" as const,
      approvalFeedback: "Needs more backstory",
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(characterStorage.updateCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/test-character-id/approve",
      { action: "reject", feedback: "Needs more backstory" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", characterId: "test-character-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(characterStorage.updateCharacter).toHaveBeenCalledWith(
      mockCharacter.ownerId,
      "test-character-id",
      { approvalStatus: "rejected", approvalFeedback: "Needs more backstory" }
    );
  });

  it("should return 400 when action is invalid", async () => {
    const mockCampaign = createMockCampaign({ gmId: "test-gm-id" });
    const mockCharacter = createMockCharacter({ campaignId: "test-campaign-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/test-character-id/approve",
      { action: "invalid" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", characterId: "test-character-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid action. Use 'approve' or 'reject'");
    expect(characterStorage.updateCharacter).not.toHaveBeenCalled();
  });

  it("should return 400 when action is missing", async () => {
    const mockCampaign = createMockCampaign({ gmId: "test-gm-id" });
    const mockCharacter = createMockCharacter({ campaignId: "test-campaign-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/test-character-id/approve",
      {}
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", characterId: "test-character-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid action. Use 'approve' or 'reject'");
  });

  it("should return 400 when character does not belong to campaign", async () => {
    const mockCampaign = createMockCampaign({ gmId: "test-gm-id" });
    const mockCharacter = createMockCharacter({ campaignId: "other-campaign-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/test-character-id/approve",
      { action: "approve" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", characterId: "test-character-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character does not belong to this campaign");
  });

  it("should return 403 when user is not GM", async () => {
    const mockCampaign = createMockCampaign({ gmId: "other-gm-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/test-character-id/approve",
      { action: "approve" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", characterId: "test-character-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can approve characters");
    expect(characterStorage.getCharacterById).not.toHaveBeenCalled();
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id/characters/test-character-id/approve",
      { action: "approve" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "nonexistent-id", characterId: "test-character-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should return 404 when character not found", async () => {
    const mockCampaign = createMockCampaign({ gmId: "test-gm-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/nonexistent-id/approve",
      { action: "approve" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", characterId: "nonexistent-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/test-character-id/approve",
      { action: "approve" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", characterId: "test-character-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});
