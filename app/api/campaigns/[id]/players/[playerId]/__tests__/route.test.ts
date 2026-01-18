/**
 * Tests for /api/campaigns/[id]/players/[playerId] endpoint
 *
 * Tests player removal (DELETE) functionality including authentication,
 * authorization, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");

// Helper to create a NextRequest
function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method: "DELETE",
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
    playerIds: ["player-1", "player-2"],
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

describe("DELETE /api/campaigns/[id]/players/[playerId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/players/player-1"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", playerId: "player-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should remove player successfully when GM", async () => {
    const mockCampaign = createMockCampaign({
      gmId: "test-gm-id",
      playerIds: ["player-1", "player-2"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.removePlayerFromCampaign).mockResolvedValue({
      ...mockCampaign,
      playerIds: ["player-2"],
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/players/player-1"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", playerId: "player-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.removePlayerFromCampaign).toHaveBeenCalledWith(
      "test-campaign-id",
      "player-1"
    );
  });

  it("should return 403 when user is not the GM", async () => {
    const mockCampaign = createMockCampaign({
      gmId: "test-gm-id",
      playerIds: ["player-1", "test-user-id"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id"); // Not the GM
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/players/player-1"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", playerId: "player-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can remove players");
    expect(campaignStorage.removePlayerFromCampaign).not.toHaveBeenCalled();
  });

  it("should return 400 when player is not in the campaign", async () => {
    const mockCampaign = createMockCampaign({
      gmId: "test-gm-id",
      playerIds: ["player-1", "player-2"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/players/nonexistent-player"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", playerId: "nonexistent-player" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Player is not in this campaign");
    expect(campaignStorage.removePlayerFromCampaign).not.toHaveBeenCalled();
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id/players/player-1"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "nonexistent-id", playerId: "player-1" }),
    });
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
      "http://localhost:3000/api/campaigns/test-campaign-id/players/player-1"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", playerId: "player-1" }),
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
      gmId: "test-gm-id",
      playerIds: ["player-1"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignStorage.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(campaignStorage.removePlayerFromCampaign).mockRejectedValue(
      new Error("Remove failed")
    );

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/players/player-1"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ id: "test-campaign-id", playerId: "player-1" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});
