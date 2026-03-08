/**
 * Tests for /api/campaigns/[id]/characters/pending-review endpoint
 *
 * Tests GM-only access to list characters in pending-review status.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as userStorage from "@/lib/storage/users";
import * as campaignStorage from "@/lib/storage/campaigns";
import * as characterStorage from "@/lib/storage/characters";
import type { Campaign, Character, User } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/characters");

function createMockRequest(url: string): NextRequest {
  return new NextRequest(new URL(url));
}

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

function createMockCharacter(overrides?: Partial<Character>): Character {
  return {
    id: "test-character-id",
    ownerId: "player-1",
    campaignId: "test-campaign-id",
    name: "Test Character",
    editionId: "sr5-edition-id",
    editionCode: "sr5",
    metatype: "human",
    attributes: {},
    skills: {},
    gear: [],
    nuyen: 5000,
    status: "pending-review",
    approvalStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

function createMockUser(): User {
  return {
    id: "test-gm-id",
    username: "testgm",
    email: "gm@test.com",
    passwordHash: "hash",
    createdAt: new Date().toISOString(),
  } as User;
}

describe("GET /api/campaigns/[id]/characters/pending-review", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/pending-review"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("should return 403 when user is not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(userStorage.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(
      createMockCampaign({ gmId: "other-gm-id" })
    );

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/pending-review"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
  });

  it("should return pending characters for GM", async () => {
    const pendingChar = createMockCharacter({
      id: "pending-char-1",
      name: "Pending Runner",
      status: "pending-review",
      campaignId: "test-campaign-id",
    });
    const activeChar = createMockCharacter({
      id: "active-char-1",
      name: "Active Runner",
      status: "active",
      campaignId: "test-campaign-id",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(createMockCampaign());
    vi.mocked(characterStorage.getUserCharacters).mockImplementation(async (userId) => {
      // GM has no characters, player-1 has the characters
      if (userId === "player-1") return [pendingChar, activeChar];
      return [];
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/pending-review"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.count).toBe(1);
    expect(data.pendingCharacters).toHaveLength(1);
    expect(data.pendingCharacters[0].characterName).toBe("Pending Runner");
  });

  it("should return empty list when no pending characters", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(createMockCampaign());
    vi.mocked(characterStorage.getUserCharacters).mockResolvedValue([]);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/characters/pending-review"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.count).toBe(0);
    expect(data.pendingCharacters).toHaveLength(0);
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent/characters/pending-review"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "nonexistent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });
});
