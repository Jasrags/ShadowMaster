/**
 * Tests for /api/campaigns/public endpoint
 *
 * Tests public campaign search (GET) functionality
 * including filters and error handling. No authentication required.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/storage/campaigns");

// Helper to create a NextRequest with search params
function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj);

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

describe("GET /api/campaigns/public", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should search public campaigns without filters", async () => {
    const mockCampaigns = [
      createMockCampaign({ id: "campaign-1", title: "Campaign 1" }),
      createMockCampaign({ id: "campaign-2", title: "Campaign 2" }),
    ];

    vi.mocked(campaignStorage.searchCampaigns).mockResolvedValue(mockCampaigns);

    const request = createMockRequest("http://localhost:3000/api/campaigns/public");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaigns).toHaveLength(2);
    expect(campaignStorage.searchCampaigns).toHaveBeenCalledWith({
      query: undefined,
      editionCode: undefined,
      gameplayLevel: undefined,
      tags: undefined,
    });
  });

  it("should filter by query (q parameter)", async () => {
    const mockCampaigns = [createMockCampaign({ title: "Shadows Over Seattle" })];

    vi.mocked(campaignStorage.searchCampaigns).mockResolvedValue(mockCampaigns);

    const request = createMockRequest("http://localhost:3000/api/campaigns/public?q=Seattle");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.searchCampaigns).toHaveBeenCalledWith({
      query: "Seattle",
      editionCode: undefined,
      gameplayLevel: undefined,
      tags: undefined,
    });
  });

  it("should filter by edition", async () => {
    vi.mocked(campaignStorage.searchCampaigns).mockResolvedValue([]);

    const request = createMockRequest("http://localhost:3000/api/campaigns/public?edition=sr6");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.searchCampaigns).toHaveBeenCalledWith({
      query: undefined,
      editionCode: "sr6",
      gameplayLevel: undefined,
      tags: undefined,
    });
  });

  it("should filter by gameplay level", async () => {
    vi.mocked(campaignStorage.searchCampaigns).mockResolvedValue([]);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/public?level=prime-runner"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.searchCampaigns).toHaveBeenCalledWith({
      query: undefined,
      editionCode: undefined,
      gameplayLevel: "prime-runner",
      tags: undefined,
    });
  });

  it("should filter by tags", async () => {
    vi.mocked(campaignStorage.searchCampaigns).mockResolvedValue([]);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/public?tags=cyberpunk,noir"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.searchCampaigns).toHaveBeenCalledWith({
      query: undefined,
      editionCode: undefined,
      gameplayLevel: undefined,
      tags: ["cyberpunk", "noir"],
    });
  });

  it("should combine multiple filters", async () => {
    vi.mocked(campaignStorage.searchCampaigns).mockResolvedValue([]);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/public?q=Seattle&edition=sr5&level=street&tags=noir"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(campaignStorage.searchCampaigns).toHaveBeenCalledWith({
      query: "Seattle",
      editionCode: "sr5",
      gameplayLevel: "street",
      tags: ["noir"],
    });
  });

  it("should return empty array when no campaigns found", async () => {
    vi.mocked(campaignStorage.searchCampaigns).mockResolvedValue([]);

    const request = createMockRequest("http://localhost:3000/api/campaigns/public?q=nonexistent");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.campaigns).toEqual([]);
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(campaignStorage.searchCampaigns).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest("http://localhost:3000/api/campaigns/public");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to search campaigns");
    expect(data.campaigns).toEqual([]);

    consoleErrorSpy.mockRestore();
  });
});
