/**
 * Tests for /api/locations/[id]/link endpoint
 *
 * Tests linking (POST) and unlinking (DELETE) content to/from locations.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, DELETE } from "../route";
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
    npcIds: [],
    gruntTeamIds: [],
    encounterIds: [],
    sessionIds: [],
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

describe("POST /api/locations/[id]/link", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      type: "npc",
      targetId: "npc-1",
    });
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

    const request = createMockRequest("http://localhost:3000/api/locations/nonexistent/link", {
      type: "npc",
      targetId: "npc-1",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Location not found");
  });

  it("should return 403 when user is not GM", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([
      createMockCampaign({ gmId: "other-gm", playerIds: ["player-1"] }),
    ]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      type: "npc",
      targetId: "npc-1",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toContain("GM");
  });

  it("should return 400 when content type is invalid", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      type: "invalid-type",
      targetId: "target-1",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("content type");
  });

  it("should return 400 when content type is missing", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      targetId: "target-1",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("content type");
  });

  it("should return 400 when targetId is missing", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      type: "npc",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Target ID");
  });

  it("should link NPC to location successfully", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const updatedLocation = { ...mockLocation, npcIds: ["npc-1"] };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.linkContentToLocation).mockResolvedValue(
      updatedLocation as Location
    );

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      type: "npc",
      targetId: "npc-1",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(locationsStorage.linkContentToLocation).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-location-id",
      "npc",
      "npc-1",
      undefined
    );
  });

  it("should link grunt team to location successfully", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const updatedLocation = { ...mockLocation, gruntTeamIds: ["grunt-1"] };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.linkContentToLocation).mockResolvedValue(
      updatedLocation as Location
    );

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      type: "grunt",
      targetId: "grunt-1",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    expect(locationsStorage.linkContentToLocation).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-location-id",
      "grunt",
      "grunt-1",
      undefined
    );
  });

  it("should link encounter to location successfully", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const updatedLocation = { ...mockLocation, encounterIds: ["encounter-1"] };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.linkContentToLocation).mockResolvedValue(
      updatedLocation as Location
    );

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      type: "encounter",
      targetId: "encounter-1",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    expect(locationsStorage.linkContentToLocation).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-location-id",
      "encounter",
      "encounter-1",
      undefined
    );
  });

  it("should link session to location successfully", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const updatedLocation = { ...mockLocation, sessionIds: ["session-1"] };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.linkContentToLocation).mockResolvedValue(
      updatedLocation as Location
    );

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      type: "session",
      targetId: "session-1",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    expect(locationsStorage.linkContentToLocation).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-location-id",
      "session",
      "session-1",
      undefined
    );
  });

  it("should link content as hidden when hidden flag is true", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const updatedLocation = {
      ...mockLocation,
      gmOnlyContent: { npcIds: ["npc-1"] },
    };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.linkContentToLocation).mockResolvedValue(
      updatedLocation as Location
    );

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      type: "npc",
      targetId: "npc-1",
      hidden: true,
    });
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    expect(locationsStorage.linkContentToLocation).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-location-id",
      "npc",
      "npc-1",
      true
    );
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id/link", {
      type: "npc",
      targetId: "npc-1",
    });
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});

describe("DELETE /api/locations/[id]/link", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/link",
      { type: "npc", targetId: "npc-1" },
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return 404 when location not found", async () => {
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/nonexistent/link",
      { type: "npc", targetId: "npc-1" },
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
  });

  it("should return 403 when user is not GM", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([
      createMockCampaign({ gmId: "other-gm", playerIds: ["player-1"] }),
    ]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/link",
      { type: "npc", targetId: "npc-1" },
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toContain("GM");
  });

  it("should return 400 when content type is invalid", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/link",
      { type: "invalid-type", targetId: "target-1" },
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("content type");
  });

  it("should return 400 when targetId is missing", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/link",
      { type: "npc" },
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Target ID");
  });

  it("should unlink content from location successfully", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({ npcIds: ["npc-1", "npc-2"] });
    const updatedLocation = { ...mockLocation, npcIds: ["npc-2"] };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.unlinkContentFromLocation).mockResolvedValue(
      updatedLocation as Location
    );

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/link",
      { type: "npc", targetId: "npc-1" },
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(locationsStorage.unlinkContentFromLocation).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-location-id",
      "npc",
      "npc-1",
      undefined
    );
  });

  it("should unlink hidden content when hidden flag is true", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({
      gmOnlyContent: { npcIds: ["npc-1"] },
    });
    const updatedLocation = { ...mockLocation, gmOnlyContent: { npcIds: [] } };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.unlinkContentFromLocation).mockResolvedValue(
      updatedLocation as Location
    );

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/link",
      { type: "npc", targetId: "npc-1", hidden: true },
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    expect(locationsStorage.unlinkContentFromLocation).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-location-id",
      "npc",
      "npc-1",
      true
    );
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/link",
      { type: "npc", targetId: "npc-1" },
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
