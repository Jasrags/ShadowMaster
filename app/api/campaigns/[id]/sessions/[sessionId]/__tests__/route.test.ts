/**
 * Tests for /api/campaigns/[id]/sessions/[sessionId] endpoint
 *
 * Tests session update (PUT) and deletion (DELETE) functionality
 * including authentication, authorization, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { PUT, DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign, CampaignSession } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");

// Helper to create a NextRequest
function createMockRequest(url: string, body?: unknown, method = "PUT"): NextRequest {
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
    sessions: [createMockSession()],
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

describe("PUT /api/campaigns/[id]/sessions/[sessionId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id",
      { title: "Updated Title" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should update session successfully", async () => {
    const mockCampaign = createMockCampaign();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id",
      { title: "Updated Title" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.session.title).toBe("Updated Title");
    expect(campaignStorage.updateCampaign).toHaveBeenCalled();
  });

  it("should update session status", async () => {
    const mockCampaign = createMockCampaign();

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id",
      { status: "cancelled" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.session.status).toBe("cancelled");
  });

  it("should return 403 when user is not GM", async () => {
    const mockCampaign = createMockCampaign({ gmId: "other-gm-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id",
      { title: "Updated Title" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can update sessions");
    expect(campaignStorage.updateCampaign).not.toHaveBeenCalled();
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id/sessions/test-session-id",
      { title: "Updated Title" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "nonexistent-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should return 404 when session not found", async () => {
    const mockCampaign = createMockCampaign({ sessions: [] });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/nonexistent-session",
      { title: "Updated Title" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "nonexistent-session" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Session not found");
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id",
      { title: "Updated Title" }
    );
    const response = await PUT(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});

describe("DELETE /api/campaigns/[id]/sessions/[sessionId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should delete session successfully", async () => {
    const mockCampaign = createMockCampaign({
      sessions: [createMockSession({ id: "test-session-id" })],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.updateCampaign).mockResolvedValue({
      ...mockCampaign,
      sessions: [],
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.updateCampaign).toHaveBeenCalledWith(
      "test-campaign-id",
      expect.objectContaining({ sessions: [] })
    );
  });

  it("should return 403 when user is not GM", async () => {
    const mockCampaign = createMockCampaign({ gmId: "other-gm-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can delete sessions");
    expect(campaignStorage.updateCampaign).not.toHaveBeenCalled();
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id/sessions/test-session-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "nonexistent-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should return 404 when session not found", async () => {
    const mockCampaign = createMockCampaign({ sessions: [] });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/nonexistent-session",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "nonexistent-session" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Session not found");
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/sessions/test-session-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", sessionId: "test-session-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});
