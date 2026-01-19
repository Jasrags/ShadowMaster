/**
 * Tests for /api/campaigns/[id]/regenerate-code endpoint
 *
 * Tests invite code regeneration (POST) functionality for GMs.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");

function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, { method: "POST" });
  Object.defineProperty(request, "nextUrl", { value: urlObj, writable: false });
  return request;
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
    inviteCode: "old-invite-code",
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

describe("POST /api/campaigns/[id]/regenerate-code", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/regenerate-code"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should regenerate invite code successfully", async () => {
    const mockCampaign = createMockCampaign();
    const updatedCampaign = createMockCampaign({ inviteCode: "new-invite-code" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.regenerateInviteCode).mockResolvedValue(updatedCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/regenerate-code"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaign).toBeDefined();
    expect(data.campaign.inviteCode).toBe("new-invite-code");
  });

  it("should return 403 when not GM", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/regenerate-code"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toContain("GM");
  });

  it("should return 403 when not a member", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/regenerate-code"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent/regenerate-code"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/regenerate-code"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
