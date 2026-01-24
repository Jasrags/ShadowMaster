/**
 * Tests for /api/campaigns endpoint
 *
 * Tests campaign listing (GET) and creation (POST) functionality
 * including authentication, filtering, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign, User } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");

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

describe("GET /api/campaigns", () => {
  const mockUser = createMockUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/campaigns");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
    expect(campaignStorage.getCampaignsByUserId).not.toHaveBeenCalled();
  });

  it("should list all campaigns for the user", async () => {
    const mockCampaigns = [
      createMockCampaign({ id: "campaign-1", title: "Campaign 1" }),
      createMockCampaign({ id: "campaign-2", title: "Campaign 2" }),
    ];

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignStorage.getCampaignsByUserId).mockResolvedValue(mockCampaigns);

    const request = createMockRequest("http://localhost:3000/api/campaigns");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaigns).toHaveLength(2);
    expect(campaignStorage.getCampaignsByUserId).toHaveBeenCalledWith(mockUser.id);
  });

  it("should filter campaigns by status", async () => {
    const mockCampaigns = [
      createMockCampaign({ id: "campaign-1", status: "active" }),
      createMockCampaign({ id: "campaign-2", status: "paused" }),
      createMockCampaign({ id: "campaign-3", status: "active" }),
    ];

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignStorage.getCampaignsByUserId).mockResolvedValue(mockCampaigns);

    const request = createMockRequest("http://localhost:3000/api/campaigns?status=active");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaigns).toHaveLength(2);
    expect(data.campaigns.every((c: Campaign) => c.status === "active")).toBe(true);
  });

  it("should filter campaigns by role=gm", async () => {
    const mockCampaigns = [
      createMockCampaign({ id: "campaign-1", gmId: mockUser.id, playerIds: [] }),
      createMockCampaign({ id: "campaign-2", gmId: "other-user", playerIds: [mockUser.id] }),
    ];

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignStorage.getCampaignsByUserId).mockResolvedValue(mockCampaigns);

    const request = createMockRequest("http://localhost:3000/api/campaigns?role=gm");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaigns).toHaveLength(1);
    expect(data.campaigns[0].gmId).toBe(mockUser.id);
  });

  it("should filter campaigns by role=player", async () => {
    const mockCampaigns = [
      createMockCampaign({ id: "campaign-1", gmId: mockUser.id, playerIds: [] }),
      createMockCampaign({ id: "campaign-2", gmId: "other-user", playerIds: [mockUser.id] }),
    ];

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignStorage.getCampaignsByUserId).mockResolvedValue(mockCampaigns);

    const request = createMockRequest("http://localhost:3000/api/campaigns?role=player");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaigns).toHaveLength(1);
    expect(data.campaigns[0].playerIds).toContain(mockUser.id);
  });

  it("should combine status and role filters", async () => {
    const mockCampaigns = [
      createMockCampaign({ id: "campaign-1", gmId: mockUser.id, status: "active" }),
      createMockCampaign({ id: "campaign-2", gmId: mockUser.id, status: "paused" }),
      createMockCampaign({
        id: "campaign-3",
        gmId: "other-user",
        status: "active",
        playerIds: [mockUser.id],
      }),
    ];

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignStorage.getCampaignsByUserId).mockResolvedValue(mockCampaigns);

    const request = createMockRequest("http://localhost:3000/api/campaigns?status=active&role=gm");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaigns).toHaveLength(1);
    expect(data.campaigns[0].id).toBe("campaign-1");
  });

  it("should return empty array when no campaigns exist", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignStorage.getCampaignsByUserId).mockResolvedValue([]);

    const request = createMockRequest("http://localhost:3000/api/campaigns");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaigns).toEqual([]);
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignStorage.getCampaignsByUserId).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest("http://localhost:3000/api/campaigns");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/campaigns", () => {
  const mockUser = createMockUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const requestBody = {
      title: "New Campaign",
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: ["priority"],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should create a campaign successfully", async () => {
    const mockCampaign = createMockCampaign({ title: "New Campaign" });
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignStorage.createCampaign).mockResolvedValue(mockCampaign);

    const requestBody = {
      title: "New Campaign",
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: ["priority"],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaign).toBeDefined();
    expect(data.userRole).toBe("gm");
    expect(campaignStorage.createCampaign).toHaveBeenCalledWith(mockUser.id, requestBody);
  });

  it("should return 400 when title is too short", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);

    const requestBody = {
      title: "Ab",
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: ["priority"],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Title must be between 3 and 100 characters");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when title is too long", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);

    const requestBody = {
      title: "A".repeat(101),
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: ["priority"],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Title must be between 3 and 100 characters");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when title is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);

    const requestBody = {
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: ["priority"],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Title must be between 3 and 100 characters");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when editionCode is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);

    const requestBody = {
      title: "New Campaign",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: ["priority"],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Edition code is required");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when enabledBookIds is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);

    const requestBody = {
      title: "New Campaign",
      editionCode: "sr5",
      enabledCreationMethodIds: ["priority"],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("At least one book must be enabled");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when enabledBookIds is empty", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);

    const requestBody = {
      title: "New Campaign",
      editionCode: "sr5",
      enabledBookIds: [],
      enabledCreationMethodIds: ["priority"],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("At least one book must be enabled");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when enabledCreationMethodIds is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);

    const requestBody = {
      title: "New Campaign",
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("At least one creation method must be enabled");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when enabledCreationMethodIds is empty", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);

    const requestBody = {
      title: "New Campaign",
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: [],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("At least one creation method must be enabled");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when gameplayLevel is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);

    const requestBody = {
      title: "New Campaign",
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: ["priority"],
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Gameplay level is required");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when visibility is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);

    const requestBody = {
      title: "New Campaign",
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: ["priority"],
      gameplayLevel: "street",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Visibility is required");
    expect(campaignStorage.createCampaign).not.toHaveBeenCalled();
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(campaignStorage.createCampaign).mockRejectedValue(new Error("Storage error"));

    const requestBody = {
      title: "New Campaign",
      editionCode: "sr5",
      enabledBookIds: ["core-rulebook"],
      enabledCreationMethodIds: ["priority"],
      gameplayLevel: "street",
      visibility: "private",
    };

    const request = createMockRequest("http://localhost:3000/api/campaigns", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Storage error");

    consoleErrorSpy.mockRestore();
  });
});
