/**
 * Tests for /api/campaigns/[id] endpoint
 *
 * Tests campaign retrieval (GET), update (PUT), and deletion (DELETE) functionality
 * including authentication, authorization, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PUT, DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign, User } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/storage/activity", () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}));

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = "GET"): NextRequest {
  const headers = new Headers();
  if (body) {
    headers.set("Content-Type", "application/json");
  }

  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  // Add nextUrl property that the route handler expects
  Object.defineProperty(request, "nextUrl", {
    value: urlObj,
    writable: false,
  });

  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

// Mock data factories
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "mock-hash",
    role: ["user"],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    sessionSecretHash: null,
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    emailVerified: true,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
    ...overrides,
  };
}

function createMockCampaign(overrides?: Partial<Campaign>): Campaign {
  return {
    id: "test-campaign-id",
    gmId: "test-user-id",
    title: "Test Campaign",
    description: "A test campaign",
    status: "active",
    editionId: "sr5-edition-id",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "street",
    visibility: "private",
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

describe("GET /api/campaigns/[id]", () => {
  const mockUser = createMockUser();
  const mockCampaign = createMockCampaign();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return campaign for GM access", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaign).toBeDefined();
    expect(data.userRole).toBe("gm");
    expect(campaignAuth.authorizeCampaign).toHaveBeenCalledWith("test-campaign-id", mockUser.id, {
      allowPublic: true,
    });
  });

  it("should return campaign for player access", async () => {
    const playerCampaign = createMockCampaign({
      gmId: "other-gm-id",
      playerIds: [mockUser.id],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: playerCampaign,
      role: "player",
      status: 200,
    });

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaign).toBeDefined();
    expect(data.userRole).toBe("player");
  });

  it("should return campaign for public campaign access", async () => {
    const publicCampaign = createMockCampaign({
      gmId: "other-gm-id",
      visibility: "public",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: publicCampaign,
      role: null,
      status: 200,
    });

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaign).toBeDefined();
  });

  it("should return 403 for private campaign when not member", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: mockCampaign,
      role: null,
      error: "Access denied",
      status: 403,
    });

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Access denied");
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Campaign not found",
      status: 404,
    });

    const request = createMockRequest("http://localhost:3000/api/campaigns/nonexistent-id");
    const response = await GET(request, { params: Promise.resolve({ id: "nonexistent-id" }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should return 500 on exception", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest("http://localhost:3000/api/campaigns/test-campaign-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});

describe("PUT /api/campaigns/[id]", () => {
  const mockUser = createMockUser();
  const mockCampaign = createMockCampaign();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const requestBody = { title: "Updated Title" };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 403 when user is not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: mockCampaign,
      role: "player",
      error: "Only the GM can perform this action",
      status: 403,
    });

    const requestBody = { title: "Updated Title" };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can perform this action");
    expect(campaignStorage.updateCampaign).not.toHaveBeenCalled();
  });

  it("should update campaign title successfully", async () => {
    const updatedCampaign = { ...mockCampaign, title: "Updated Title" };

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(updatedCampaign);

    const requestBody = { title: "Updated Title" };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaign.title).toBe("Updated Title");
    expect(data.userRole).toBe("gm");
  });

  it("should update campaign visibility successfully", async () => {
    const updatedCampaign = { ...mockCampaign, visibility: "public" as const };

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(updatedCampaign);

    const requestBody = { visibility: "public" };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaign.visibility).toBe("public");
  });

  it("should merge advancementSettings correctly", async () => {
    const updatedCampaign = {
      ...mockCampaign,
      advancementSettings: {
        ...mockCampaign.advancementSettings,
        attributeKarmaMultiplier: 6,
      },
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(updatedCampaign);

    const requestBody = { advancementSettings: { attributeKarmaMultiplier: 6 } };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.updateCampaign).toHaveBeenCalledWith(
      "test-campaign-id",
      expect.objectContaining({
        advancementSettings: expect.objectContaining({
          attributeKarmaMultiplier: 6,
          skillKarmaMultiplier: 2, // Original value preserved
        }),
      })
    );
  });

  it("should return 400 when title is too short", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const requestBody = { title: "Ab" };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Title must be between 3 and 100 characters");
    expect(campaignStorage.updateCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when title is too long", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const requestBody = { title: "A".repeat(101) };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Title must be between 3 and 100 characters");
  });

  it("should return 400 when enabledBookIds is empty", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const requestBody = { enabledBookIds: [] };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("At least one book must be enabled");
  });

  it("should return 400 when enabledCreationMethodIds is empty", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const requestBody = { enabledCreationMethodIds: [] };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("At least one creation method must be enabled");
  });

  it("should return 400 when maxPlayers is less than current player count", async () => {
    const campaignWithPlayers = createMockCampaign({
      playerIds: ["player-1", "player-2", "player-3"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: campaignWithPlayers,
      role: "gm",
      status: 200,
    });

    const requestBody = { maxPlayers: 2 };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Max players cannot be less than current player count");
  });

  it("should return 400 when karma multiplier is less than 1", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const requestBody = { advancementSettings: { attributeKarmaMultiplier: 0 } };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Karma multipliers must be at least 1");
  });

  it("should return 400 when attempting to change editionCode", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const requestBody = { editionCode: "sr6" };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Edition cannot be changed");
    expect(campaignStorage.updateCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when attempting to change editionId", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const requestBody = { editionId: "different-edition-id" };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Edition cannot be changed");
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Campaign not found",
      status: 404,
    });

    const requestBody = { title: "Updated Title" };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "nonexistent-id" }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.updateCampaign).mockRejectedValue(new Error("Storage error"));

    const requestBody = { title: "Updated Title" };
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      requestBody,
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Storage error");

    consoleErrorSpy.mockRestore();
  });
});

describe("DELETE /api/campaigns/[id]", () => {
  const mockUser = createMockUser();
  const mockCampaign = createMockCampaign();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 403 when user is not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: mockCampaign,
      role: "player",
      error: "Only the GM can perform this action",
      status: 403,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can perform this action");
    expect(campaignStorage.deleteCampaign).not.toHaveBeenCalled();
  });

  it("should delete campaign successfully", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.deleteCampaign).mockResolvedValue(undefined);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.deleteCampaign).toHaveBeenCalledWith("test-campaign-id");
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Campaign not found",
      status: 404,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "nonexistent-id" }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
    expect(campaignStorage.deleteCampaign).not.toHaveBeenCalled();
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.deleteCampaign).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});
