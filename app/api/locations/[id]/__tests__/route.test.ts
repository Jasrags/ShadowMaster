/**
 * Tests for /api/locations/[id] endpoint
 *
 * Tests location retrieval (GET), update (PUT), and deletion (DELETE) functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PUT, DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as locationsStorage from "@/lib/storage/locations";
import type { Campaign, Location } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/locations");
vi.mock("@/lib/storage/campaigns", () => ({
  getCampaignsByUserId: vi.fn(),
}));
vi.mock("@/lib/storage/activity", () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}));

function createMockRequest(url: string, body?: unknown, method = "GET"): NextRequest {
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

describe("GET /api/locations/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Authentication required");
  });

  it("should return 404 when location not found", async () => {
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/locations/nonexistent");
    const response = await GET(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Location not found");
  });

  it("should return full location data for GM", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({
      gmNotes: "Secret GM notes",
      gmOnlyContent: { npcIds: ["secret-npc"] },
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.location.gmNotes).toBe("Secret GM notes");
    expect(data.location.gmOnlyContent).toBeDefined();
  });

  it("should strip GM content for players", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({
      gmNotes: "Secret GM notes",
      gmOnlyContent: { npcIds: ["secret-npc"] },
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([
      createMockCampaign({ gmId: "other-gm", playerIds: ["player-1"] }),
    ]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.location.gmNotes).toBeUndefined();
    expect(data.location.gmOnlyContent).toBeUndefined();
  });

  it("should return 404 for gm-only location when user is not GM", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({ visibility: "gm-only" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([
      createMockCampaign({ gmId: "other-gm", playerIds: ["player-1"] }),
    ]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(404);
  });

  it("should include related locations", async () => {
    const campaignsModule = await getCampaignsModule();
    const childLocation = createMockLocation({ id: "child-loc", name: "Child Location" });
    const relatedLocation = createMockLocation({ id: "related-loc", name: "Related Location" });
    const mockLocation = createMockLocation({
      childLocationIds: ["child-loc"],
      relatedLocationIds: ["related-loc"],
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockImplementation(async (_cId, lId) => {
      if (lId === "test-location-id") return mockLocation;
      if (lId === "child-loc") return childLocation;
      if (lId === "related-loc") return relatedLocation;
      return null;
    });

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.relatedLocations).toHaveLength(2);
    expect(data.relatedLocations.map((l: Location) => l.id)).toContain("child-loc");
    expect(data.relatedLocations.map((l: Location) => l.id)).toContain("related-loc");
  });

  it("should filter out gm-only related locations for players", async () => {
    const campaignsModule = await getCampaignsModule();
    const childLocation = createMockLocation({
      id: "child-loc",
      name: "Child Location",
      visibility: "gm-only",
    });
    const relatedLocation = createMockLocation({
      id: "related-loc",
      name: "Related Location",
      visibility: "players",
    });
    const mockLocation = createMockLocation({
      childLocationIds: ["child-loc"],
      relatedLocationIds: ["related-loc"],
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([
      createMockCampaign({ gmId: "other-gm", playerIds: ["player-1"] }),
    ]);
    vi.mocked(locationsStorage.getLocation).mockImplementation(async (_cId, lId) => {
      if (lId === "test-location-id") return mockLocation;
      if (lId === "child-loc") return childLocation;
      if (lId === "related-loc") return relatedLocation;
      return null;
    });

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.relatedLocations).toHaveLength(1);
    expect(data.relatedLocations[0].id).toBe("related-loc");
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest("http://localhost:3000/api/locations/test-location-id");
    const response = await GET(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});

describe("PUT /api/locations/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { name: "Updated Name" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return 404 when location not found", async () => {
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/nonexistent",
      { name: "Updated" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "nonexistent" }) });
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
      "http://localhost:3000/api/locations/test-location-id",
      { name: "Updated" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toContain("GM");
  });

  it("should update location successfully", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const updatedLocation = { ...mockLocation, name: "Updated Name" };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.updateLocation).mockResolvedValue(updatedLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { name: "Updated Name" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.location.name).toBe("Updated Name");
  });

  it("should return 400 when name is empty", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { name: "" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Name");
  });

  it("should return 400 when name is too long", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { name: "a".repeat(201) },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Name");
  });

  it("should return 400 when security rating is below 1", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { securityRating: 0 },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Security rating");
  });

  it("should return 400 when security rating is above 10", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { securityRating: 15 },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Security rating");
  });

  it("should return 400 when coordinates latitude is invalid", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { coordinates: { latitude: 100, longitude: 0 } },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("coordinates");
  });

  it("should return 400 when coordinates longitude is invalid", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { coordinates: { latitude: 45, longitude: 200 } },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("coordinates");
  });

  it("should return 400 when astral mana level is invalid", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { astralProperties: { manaLevel: "invalid-level" } },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("mana level");
  });

  it("should return 400 when background count is out of range", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { astralProperties: { backgroundCount: 25 } },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Background count");
  });

  it("should log activity when visibility changes", async () => {
    const campaignsModule = await getCampaignsModule();
    const activityModule = await import("@/lib/storage/activity");
    const mockLocation = createMockLocation({ visibility: "players" });
    const updatedLocation = { ...mockLocation, visibility: "gm-only" };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.updateLocation).mockResolvedValue(updatedLocation as Location);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { visibility: "gm-only" },
      "PUT"
    );
    await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(activityModule.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "location_updated",
        description: expect.stringContaining("Visibility"),
      })
    );
  });

  it("should log activity when security rating changes", async () => {
    const campaignsModule = await getCampaignsModule();
    const activityModule = await import("@/lib/storage/activity");
    const mockLocation = createMockLocation({ securityRating: 3 });
    const updatedLocation = { ...mockLocation, securityRating: 7 };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.updateLocation).mockResolvedValue(updatedLocation as Location);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { securityRating: 7 },
      "PUT"
    );
    await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(activityModule.logActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "location_updated",
        description: expect.stringContaining("Security Rating"),
      })
    );
  });

  it("should accept valid astral properties", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const updatedLocation = {
      ...mockLocation,
      astralProperties: { manaLevel: "high", backgroundCount: 5 },
    };
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.updateLocation).mockResolvedValue(updatedLocation as Location);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { astralProperties: { manaLevel: "high", backgroundCount: 5 } },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      { name: "Updated" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});

describe("DELETE /api/locations/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      undefined,
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
      "http://localhost:3000/api/locations/nonexistent",
      undefined,
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
      "http://localhost:3000/api/locations/test-location-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toContain("GM");
  });

  it("should delete location successfully", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.deleteLocation).mockResolvedValue(undefined);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(locationsStorage.deleteLocation).toHaveBeenCalledWith(
      "test-campaign-id",
      "test-location-id"
    );
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
