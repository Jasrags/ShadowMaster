/**
 * Tests for /api/campaigns/[id]/sessions endpoint
 *
 * Tests session listing (GET) and creation (POST) functionality
 * including authentication, authorization, and validation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign, CampaignSession } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign");
vi.mock("@/lib/storage/campaigns");
vi.mock("uuid", () => ({
  v4: () => "new-session-id",
}));
vi.mock("@/lib/storage/activity", () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/storage/notifications", () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}));

// Helper to create a NextRequest
function createMockRequest(url: string, body?: unknown, method = "GET"): NextRequest {
  const headers = new Headers();
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method,
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
    sessions: [],
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

// Mock session factory
function createMockSession(overrides?: Partial<CampaignSession>): CampaignSession {
  return {
    id: "test-session-id",
    title: "Test Session",
    scheduledAt: new Date().toISOString(),
    durationMinutes: 180,
    status: "scheduled",
    attendeeIds: ["player-1"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("GET /api/campaigns/[id]/sessions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should list sessions for campaign member", async () => {
    const mockSessions = [
      createMockSession({ id: "session-1", title: "Session 1" }),
      createMockSession({ id: "session-2", title: "Session 2" }),
    ];
    const mockCampaign = createMockCampaign({ sessions: mockSessions });

    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "player",
      status: 200,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.sessions).toHaveLength(2);
  });

  it("should return empty array when no sessions", async () => {
    const mockCampaign = createMockCampaign({ sessions: [] });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.sessions).toEqual([]);
  });

  it("should return 403 when not a member", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Access denied: campaign membership required",
      status: 403,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions"
    );
    const response = await GET(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions"
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

describe("POST /api/campaigns/[id]/sessions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions",
      { title: "New Session", scheduledAt: new Date().toISOString() },
      "POST"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should create session successfully", async () => {
    const mockCampaign = createMockCampaign({ sessions: [] });
    const scheduledAt = new Date().toISOString();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions",
      { title: "New Session", scheduledAt },
      "POST"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.session).toBeDefined();
    expect(data.session.title).toBe("New Session");
    expect(data.session.durationMinutes).toBe(180); // Default
  });

  it("should create session with custom duration", async () => {
    const mockCampaign = createMockCampaign({ sessions: [] });
    const scheduledAt = new Date().toISOString();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions",
      { title: "New Session", scheduledAt, durationMinutes: 240 },
      "POST"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.session.durationMinutes).toBe(240);
  });

  it("should return 400 when title is missing", async () => {
    const mockCampaign = createMockCampaign();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions",
      { scheduledAt: new Date().toISOString() },
      "POST"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Title and scheduledAt are required");
  });

  it("should return 400 when scheduledAt is missing", async () => {
    const mockCampaign = createMockCampaign();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions",
      { title: "New Session" },
      "POST"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Title and scheduledAt are required");
  });

  it("should return 403 when user is not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: "player",
      error: "Only the GM can perform this action",
      status: 403,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions",
      { title: "New Session", scheduledAt: new Date().toISOString() },
      "POST"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(campaignStorage.updateCampaign).not.toHaveBeenCalled();
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions",
      { title: "New Session", scheduledAt: new Date().toISOString() },
      "POST"
    );
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
