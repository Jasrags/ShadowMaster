/**
 * Tests for /api/campaigns/[id]/leave endpoint
 *
 * Tests campaign leave (POST) functionality including authentication,
 * membership validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/users", () => ({
  getUserById: vi.fn().mockResolvedValue({ id: "test-user-id", username: "testuser" }),
}));
vi.mock("@/lib/storage/activity", () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/storage/notifications", () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}));

// Helper to create a NextRequest
function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method: "POST",
  });

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
    playerIds: ["test-user-id"],
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

describe("POST /api/campaigns/[id]/leave", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/leave");
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should leave campaign successfully", async () => {
    const mockCampaign = createMockCampaign({
      playerIds: ["test-user-id"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.removePlayerFromCampaign).mockResolvedValue({
      ...mockCampaign,
      playerIds: [],
    });

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/leave");
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.removePlayerFromCampaign).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-user-id"
    );
  });

  it("should return 400 when GM tries to leave their own campaign", async () => {
    const mockCampaign = createMockCampaign({
      gmId: "test-user-id",
      playerIds: [],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/leave");
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("GM cannot leave the campaign. Delete it instead.");
    expect(campaignStorage.removePlayerFromCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when user is not a member", async () => {
    const mockCampaign = createMockCampaign({
      gmId: "other-gm-id",
      playerIds: ["other-player-id"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/leave");
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("You are not a member of this campaign");
    expect(campaignStorage.removePlayerFromCampaign).not.toHaveBeenCalled();
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/campaigns/nonexistent-id/leave");
    const response = await POST(request, { params: Promise.resolve({ id: "nonexistent-id" }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/leave");
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });

  it("should return 500 when remove fails", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const mockCampaign = createMockCampaign({
      playerIds: ["test-user-id"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.removePlayerFromCampaign).mockRejectedValue(
      new Error("Remove failed")
    );

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/leave");
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});
