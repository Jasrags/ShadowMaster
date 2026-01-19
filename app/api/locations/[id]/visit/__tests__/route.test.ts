/**
 * Tests for /api/locations/[id]/visit endpoint
 *
 * Tests recording character visits to locations.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as locationsStorage from "@/lib/storage/locations";
import type { Campaign, Location } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/locations");
vi.mock("@/lib/storage/campaigns", () => ({
  getCampaignsByUserId: vi.fn(),
}));

function createMockRequest(url: string, body?: unknown, method = "POST"): NextRequest {
  const headers = new Headers();
  if (body) headers.set("Content-Type", "application/json");
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });
  Object.defineProperty(request, "nextUrl", { value: urlObj, writable: false });
  if (body) (request as { json: () => Promise<unknown> }).json = async () => body;
  return request;
}

function createMockLocation(overrides?: Partial<Location>): Location {
  return {
    id: "test-location-id",
    campaignId: "test-campaign-id",
    name: "Test Location",
    type: "physical",
    visibility: "players",
    description: "A test location",
    visitCount: 0,
    visitedByCharacterIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Location;
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

async function getCampaignsModule() {
  return await import("@/lib/storage/campaigns");
}

describe("POST /api/locations/[id]/visit", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/visit",
      {
        characterId: "char-1",
      }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Authentication required");
  });

  it("should return 404 when location not found", async () => {
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/locations/nonexistent/visit", {
      characterId: "char-1",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Location not found");
  });

  it("should return 400 when characterId is missing", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/visit",
      {}
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Character ID");
  });

  it("should return 404 for gm-only location when user is not GM", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({ visibility: "gm-only" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([
      createMockCampaign({ gmId: "other-gm", playerIds: ["player-1"] }),
    ]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/visit",
      {
        characterId: "char-1",
      }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(404);
  });

  it("should record visit successfully", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const updatedLocation = {
      ...mockLocation,
      visitCount: 1,
      visitedByCharacterIds: ["char-1"],
      firstVisitedAt: new Date().toISOString(),
      lastVisitedAt: new Date().toISOString(),
    };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.recordLocationVisit).mockResolvedValue(updatedLocation as Location);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/visit",
      {
        characterId: "char-1",
      }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.location.visitCount).toBe(1);
    expect(locationsStorage.recordLocationVisit).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-location-id",
      "char-1",
      undefined
    );
  });

  it("should record visit with session association", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const updatedLocation = {
      ...mockLocation,
      visitCount: 1,
      visitedByCharacterIds: ["char-1"],
    };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.recordLocationVisit).mockResolvedValue(updatedLocation as Location);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/visit",
      {
        characterId: "char-1",
        sessionId: "session-1",
      }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    expect(locationsStorage.recordLocationVisit).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-location-id",
      "char-1",
      "session-1"
    );
  });

  it("should strip GM content from response for players", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({
      gmNotes: "Secret notes",
      gmOnlyContent: { npcIds: ["secret-npc"] },
    });
    const updatedLocation = {
      ...mockLocation,
      visitCount: 1,
      visitedByCharacterIds: ["char-1"],
    };
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([
      createMockCampaign({ gmId: "other-gm", playerIds: ["player-1"] }),
    ]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.recordLocationVisit).mockResolvedValue(updatedLocation as Location);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/visit",
      {
        characterId: "char-1",
      }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.location.gmNotes).toBeUndefined();
    expect(data.location.gmOnlyContent).toBeUndefined();
  });

  it("should include GM content in response for GM", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({
      gmNotes: "Secret notes",
      gmOnlyContent: { npcIds: ["secret-npc"] },
    });
    const updatedLocation = {
      ...mockLocation,
      visitCount: 1,
      visitedByCharacterIds: ["char-1"],
    };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.recordLocationVisit).mockResolvedValue(updatedLocation as Location);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/visit",
      {
        characterId: "char-1",
      }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.location.gmNotes).toBe("Secret notes");
    expect(data.location.gmOnlyContent).toBeDefined();
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/visit",
      {
        characterId: "char-1",
      }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
