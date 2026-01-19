/**
 * Tests for /api/campaigns/[id]/join endpoint
 *
 * Tests campaign join (POST) functionality including authentication,
 * visibility rules, invite codes, and error handling.
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
    playerIds: [],
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

describe("POST /api/campaigns/[id]/join", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/join",
      {}
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should join a public campaign successfully", async () => {
    const mockCampaign = createMockCampaign({ visibility: "public" });
    const updatedCampaign = { ...mockCampaign, playerIds: ["test-user-id"] };

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.addPlayerToCampaign).mockResolvedValue(updatedCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/join",
      {}
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaign).toBeDefined();
    expect(data.userRole).toBe("player");
    expect(campaignStorage.addPlayerToCampaign).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-user-id"
    );
  });

  it("should join an invite-only campaign with valid invite code", async () => {
    const mockCampaign = createMockCampaign({
      visibility: "invite-only",
      inviteCode: "ABCD1234",
    });
    const updatedCampaign = { ...mockCampaign, playerIds: ["test-user-id"] };

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.addPlayerToCampaign).mockResolvedValue(updatedCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/join",
      { inviteCode: "abcd1234" } // lowercase to test case-insensitive comparison
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaign).toBeDefined();
  });

  it("should find campaign by invite code when not found by ID", async () => {
    const mockCampaign = createMockCampaign({
      id: "actual-campaign-id",
      visibility: "invite-only",
      inviteCode: "INVITECODE",
    });
    const updatedCampaign = { ...mockCampaign, playerIds: ["test-user-id"] };

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);
    vi.mocked(campaignStorage.getCampaignByInviteCode).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.addPlayerToCampaign).mockResolvedValue(updatedCampaign);

    const request = createMockRequest("http://localhost:3000/api/campaigns/unknown-id/join", {
      inviteCode: "INVITECODE",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "unknown-id" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.getCampaignByInviteCode).toHaveBeenCalledWith("INVITECODE");
  });

  it("should return 400 when already a member", async () => {
    const mockCampaign = createMockCampaign({
      playerIds: ["test-user-id"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/join",
      {}
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("You are already a member of this campaign");
    expect(campaignStorage.addPlayerToCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when GM tries to join their own campaign", async () => {
    const mockCampaign = createMockCampaign({
      gmId: "test-user-id",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/join",
      {}
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("You are the GM of this campaign");
    expect(campaignStorage.addPlayerToCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when invite code is required but not provided", async () => {
    const mockCampaign = createMockCampaign({
      visibility: "invite-only",
      inviteCode: "ABCD1234",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/join",
      {}
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invite code required");
  });

  it("should return 400 when invite code is invalid", async () => {
    const mockCampaign = createMockCampaign({
      visibility: "invite-only",
      inviteCode: "CORRECTCODE",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id/join", {
      inviteCode: "WRONGCODE",
    });
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid invite code");
  });

  it("should return 403 when campaign is private", async () => {
    const mockCampaign = createMockCampaign({
      visibility: "private",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/join",
      {}
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("This campaign is private");
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);
    vi.mocked(campaignStorage.getCampaignByInviteCode).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id/join",
      {}
    );
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

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/join",
      {}
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Storage error");

    consoleErrorSpy.mockRestore();
  });
});
