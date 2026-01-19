/**
 * Tests for /api/campaigns/[id]/characters endpoint
 *
 * Tests campaign character listing (GET) functionality including
 * authentication, authorization, and filtering by role.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import * as characterStorage from "@/lib/storage/characters";
import type { Campaign, Character } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/characters");

// Helper to create a NextRequest
function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj);

  Object.defineProperty(request, "nextUrl", {
    value: urlObj,
    writable: false,
  });

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
    playerIds: ["player-1", "player-2"],
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
    ownerId: "test-owner-id",
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

describe("GET /api/campaigns/[id]/characters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return all characters for GM", async () => {
    const mockCampaign = createMockCampaign({
      gmId: "test-gm-id",
      playerIds: ["player-1"],
    });
    const gmCharacter = createMockCharacter({
      id: "char-gm",
      ownerId: "test-gm-id",
      campaignId: "test-campaign-id",
    });
    const playerCharacter = createMockCharacter({
      id: "char-player",
      ownerId: "player-1",
      campaignId: "test-campaign-id",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getUserCharacters)
      .mockResolvedValueOnce([gmCharacter]) // GM's characters
      .mockResolvedValueOnce([playerCharacter]); // Player's characters

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toHaveLength(2);
  });

  it("should return only own characters for player", async () => {
    const mockCampaign = createMockCampaign({
      gmId: "test-gm-id",
      playerIds: ["player-1"],
    });
    const gmCharacter = createMockCharacter({
      id: "char-gm",
      ownerId: "test-gm-id",
      campaignId: "test-campaign-id",
    });
    const playerCharacter = createMockCharacter({
      id: "char-player",
      ownerId: "player-1",
      campaignId: "test-campaign-id",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getUserCharacters)
      .mockResolvedValueOnce([gmCharacter]) // GM's characters
      .mockResolvedValueOnce([playerCharacter]); // Player's characters

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toHaveLength(1);
    expect(data.characters[0].ownerId).toBe("player-1");
  });

  it("should return 403 when user is not a member", async () => {
    const mockCampaign = createMockCampaign({
      gmId: "test-gm-id",
      playerIds: ["player-1"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Access denied");
    expect(characterStorage.getUserCharacters).not.toHaveBeenCalled();
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id/characters"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "nonexistent-id" }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should filter characters by campaignId", async () => {
    const mockCampaign = createMockCampaign({
      id: "test-campaign-id",
      gmId: "test-gm-id",
      playerIds: [],
    });
    const campaignCharacter = createMockCharacter({
      id: "char-1",
      ownerId: "test-gm-id",
      campaignId: "test-campaign-id",
    });
    const otherCharacter = createMockCharacter({
      id: "char-2",
      ownerId: "test-gm-id",
      campaignId: "other-campaign-id",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getUserCharacters).mockResolvedValue([
      campaignCharacter,
      otherCharacter,
    ]);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.characters).toHaveLength(1);
    expect(data.characters[0].campaignId).toBe("test-campaign-id");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});
