/**
 * Tests for /api/campaigns/[id]/advancements/[recordId]/approve endpoint
 *
 * Tests advancement approval (POST) functionality for GMs.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import * as characterStorage from "@/lib/storage/characters";
import * as advancementApproval from "@/lib/rules/advancement/approval";
import type { Campaign, Character, AdvancementRecord } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/advancement/approval");

function createMockRequest(url: string, body?: unknown): NextRequest {
  const headers = new Headers();
  if (body) headers.set("Content-Type", "application/json");
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });
  Object.defineProperty(request, "nextUrl", { value: urlObj, writable: false });
  if (body) (request as { json: () => Promise<unknown> }).json = async () => body;
  return request;
}

function createMockAdvancementRecord(overrides?: Partial<AdvancementRecord>): AdvancementRecord {
  return {
    id: "test-record-id",
    type: "attribute",
    description: "Body 3 -> 4",
    karmaCost: 20,
    createdAt: new Date().toISOString(),
    gmApproved: false,
    ...overrides,
  } as AdvancementRecord;
}

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
    advancementHistory: [createMockAdvancementRecord()],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

function createMockCampaign(overrides?: Partial<Campaign>): Campaign {
  return {
    id: "test-campaign-id",
    gmId: "test-gm-id",
    title: "Test Campaign",
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

describe("POST /api/campaigns/[id]/advancements/[recordId]/approve", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/test-record-id/approve",
      { characterId: "test-character-id" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", recordId: "test-record-id" }),
    });
    expect(response.status).toBe(401);
  });

  it("should approve advancement successfully", async () => {
    const mockCampaign = createMockCampaign();
    const mockCharacter = createMockCharacter();
    const approvedCharacter = {
      ...mockCharacter,
      advancementHistory: [{ ...mockCharacter.advancementHistory![0], gmApproved: true }],
    };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(advancementApproval.approveAdvancement).mockReturnValue({
      updatedCharacter: approvedCharacter,
      updatedAdvancementRecord: { ...mockCharacter.advancementHistory![0], gmApproved: true },
    });
    vi.mocked(characterStorage.updateCharacter).mockResolvedValue(approvedCharacter);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/test-record-id/approve",
      { characterId: "test-character-id" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", recordId: "test-record-id" }),
    });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(characterStorage.updateCharacter).toHaveBeenCalled();
  });

  it("should return 400 when characterId is missing", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/test-record-id/approve",
      {}
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", recordId: "test-record-id" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("characterId");
  });

  it("should return 403 when not GM", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/test-record-id/approve",
      { characterId: "test-character-id" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", recordId: "test-record-id" }),
    });
    expect(response.status).toBe(403);
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent/advancements/test-record-id/approve",
      { characterId: "test-character-id" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "nonexistent", recordId: "test-record-id" }),
    });
    expect(response.status).toBe(404);
  });

  it("should return 404 when character not found", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/test-record-id/approve",
      { characterId: "nonexistent-character" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", recordId: "test-record-id" }),
    });
    expect(response.status).toBe(404);
  });

  it("should return 404 when character not in campaign", async () => {
    const mockCampaign = createMockCampaign();
    const mockCharacter = createMockCharacter({ campaignId: "different-campaign" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getCharacterById).mockResolvedValue(mockCharacter);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/test-record-id/approve",
      { characterId: "test-character-id" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", recordId: "test-record-id" }),
    });
    expect(response.status).toBe(404);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/test-record-id/approve",
      { characterId: "test-character-id" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id", recordId: "test-record-id" }),
    });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
