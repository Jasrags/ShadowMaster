/**
 * Tests for /api/campaigns/[id]/template endpoint
 *
 * Tests saving campaign as template (POST) functionality including
 * authentication, authorization, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign, CampaignTemplate } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");

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

// Mock template factory
function createMockTemplate(overrides?: Partial<CampaignTemplate>): CampaignTemplate {
  return {
    id: "test-template-id",
    name: "Test Template",
    description: "A test template",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "street",
    createdBy: "test-gm-id",
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("POST /api/campaigns/[id]/template", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/template",
      { name: "My Template" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should save campaign as template successfully", async () => {
    const mockCampaign = createMockCampaign({ gmId: "test-gm-id" });
    const mockTemplate = createMockTemplate({ name: "My Template" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.saveCampaignAsTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/template",
      { name: "My Template" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.template).toBeDefined();
    expect(campaignStorage.saveCampaignAsTemplate).toHaveBeenCalledWith(
      "test-campaign-id",
      "My Template",
      "test-gm-id"
    );
  });

  it("should return 400 when name is missing", async () => {
    const mockCampaign = createMockCampaign({ gmId: "test-gm-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/template",
      {}
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Template name must be at least 3 characters");
    expect(campaignStorage.saveCampaignAsTemplate).not.toHaveBeenCalled();
  });

  it("should return 400 when name is too short", async () => {
    const mockCampaign = createMockCampaign({ gmId: "test-gm-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/template",
      { name: "AB" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Template name must be at least 3 characters");
    expect(campaignStorage.saveCampaignAsTemplate).not.toHaveBeenCalled();
  });

  it("should return 403 when user is not GM", async () => {
    const mockCampaign = createMockCampaign({ gmId: "other-gm-id" });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/template",
      { name: "My Template" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can save this campaign as a template");
    expect(campaignStorage.saveCampaignAsTemplate).not.toHaveBeenCalled();
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id/template",
      { name: "My Template" }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "nonexistent-id" }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/template",
      { name: "My Template" }
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
