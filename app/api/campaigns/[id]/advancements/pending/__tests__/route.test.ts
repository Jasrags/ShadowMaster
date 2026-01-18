/**
 * Tests for /api/campaigns/[id]/advancements/pending endpoint
 *
 * Tests pending advancement listing with character context (GET) functionality for GMs.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as userStorage from "@/lib/storage/users";
import * as campaignStorage from "@/lib/storage/campaigns";
import * as characterStorage from "@/lib/storage/characters";
import type { Campaign, Character, User, AdvancementRecord } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/characters");

function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, { method: "GET" });
  Object.defineProperty(request, "nextUrl", { value: urlObj, writable: false });
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

function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-user-id",
    username: "testuser",
    passwordHash: "hash",
    email: "test@example.com",
    createdAt: new Date().toISOString(),
    ...overrides,
  } as User;
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
    advancementHistory: [],
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

describe("GET /api/campaigns/[id]/advancements/pending", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/pending"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return pending advancements with character context for GM", async () => {
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "test-gm-id" });
    const mockCharacter = createMockCharacter({
      advancementHistory: [createMockAdvancementRecord({ gmApproved: false })],
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getUserCharacters).mockResolvedValue([mockCharacter]);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/pending"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.pendingAdvancements).toBeDefined();
    expect(data.count).toBeDefined();
  });

  it("should return empty array when no pending advancements", async () => {
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "test-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(characterStorage.getUserCharacters).mockResolvedValue([]);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/pending"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.pendingAdvancements).toEqual([]);
    expect(data.count).toBe(0);
  });

  it("should return 403 when not GM", async () => {
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "player-1" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/pending"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/pending"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(404);
  });

  it("should return 404 when campaign not found", async () => {
    const mockUser = createMockUser({ id: "test-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent/advancements/pending"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/advancements/pending"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
