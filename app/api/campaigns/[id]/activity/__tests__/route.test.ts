/**
 * Tests for /api/campaigns/[id]/activity endpoint
 *
 * Tests campaign activity feed listing (GET) with pagination.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as userStorage from "@/lib/storage/users";
import * as campaignStorage from "@/lib/storage/campaigns";
import * as activityStorage from "@/lib/storage/activity";
import type { Campaign, User, CampaignActivityEvent } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/activity");

function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, { method: "GET" });
  Object.defineProperty(request, "nextUrl", { value: urlObj, writable: false });
  return request;
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

function createMockActivity(overrides?: Partial<CampaignActivityEvent>): CampaignActivityEvent {
  return {
    id: "test-activity-id",
    campaignId: "test-campaign-id",
    type: "character_created",
    actorId: "test-user-id",
    description: "A new character was created",
    createdAt: new Date().toISOString(),
    ...overrides,
  } as CampaignActivityEvent;
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

describe("GET /api/campaigns/[id]/activity", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/activity"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return activities for GM", async () => {
    const activities = [createMockActivity(), createMockActivity({ id: "activity-2" })];
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "test-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(activityStorage.getCampaignActivity).mockResolvedValue(activities);
    vi.mocked(activityStorage.getCampaignActivityCount).mockResolvedValue(2);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/activity"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.activities).toHaveLength(2);
    expect(data.total).toBe(2);
  });

  it("should return activities for player", async () => {
    const activities = [createMockActivity()];
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "player-1" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(activityStorage.getCampaignActivity).mockResolvedValue(activities);
    vi.mocked(activityStorage.getCampaignActivityCount).mockResolvedValue(1);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/activity"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.activities).toHaveLength(1);
  });

  it("should return activities for public campaign viewer", async () => {
    const activities = [createMockActivity()];
    const mockCampaign = createMockCampaign({ visibility: "public" });
    const mockUser = createMockUser({ id: "non-member" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(activityStorage.getCampaignActivity).mockResolvedValue(activities);
    vi.mocked(activityStorage.getCampaignActivityCount).mockResolvedValue(1);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/activity"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
  });

  it("should apply pagination with limit and offset", async () => {
    const activities = [createMockActivity()];
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "test-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(activityStorage.getCampaignActivity).mockResolvedValue(activities);
    vi.mocked(activityStorage.getCampaignActivityCount).mockResolvedValue(100);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/activity?limit=10&offset=20"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
    expect(activityStorage.getCampaignActivity).toHaveBeenCalledWith("test-campaign-id", 10, 20);
  });

  it("should use default pagination values", async () => {
    const activities = [createMockActivity()];
    const mockCampaign = createMockCampaign();
    const mockUser = createMockUser({ id: "test-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(activityStorage.getCampaignActivity).mockResolvedValue(activities);
    vi.mocked(activityStorage.getCampaignActivityCount).mockResolvedValue(1);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/activity"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
    expect(activityStorage.getCampaignActivity).toHaveBeenCalledWith("test-campaign-id", 50, 0);
  });

  it("should return 403 for private campaign non-member", async () => {
    const mockCampaign = createMockCampaign({ visibility: "private" });
    const mockUser = createMockUser({ id: "non-member" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/activity"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/activity"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(404);
  });

  it("should return 404 when campaign not found", async () => {
    const mockUser = createMockUser({ id: "test-gm-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockResolvedValue(mockUser);
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/campaigns/nonexistent/activity");
    const response = await GET(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(userStorage.getUserById).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/activity"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
