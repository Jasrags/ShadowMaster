/**
 * Tests for /api/locations/[id]/create-template endpoint
 *
 * Tests creating location templates from existing locations.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as locationsStorage from "@/lib/storage/locations";
import type { Campaign, Location, LocationTemplate } from "@/lib/types";

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
    securityRating: 5,
    tags: ["downtown", "corporate"],
    npcIds: ["npc-1"],
    gruntTeamIds: ["grunt-1"],
    encounterIds: [],
    sessionIds: ["session-1"],
    visitedByCharacterIds: ["char-1"],
    visitCount: 3,
    firstVisitedAt: new Date().toISOString(),
    lastVisitedAt: new Date().toISOString(),
    parentLocationId: "parent-loc",
    childLocationIds: ["child-1"],
    relatedLocationIds: ["related-1"],
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

function createMockLocationTemplate(overrides?: Partial<LocationTemplate>): LocationTemplate {
  return {
    id: "template-id",
    name: "Test Template",
    description: "A test template",
    type: "physical",
    createdBy: "test-gm-id",
    isPublic: false,
    tags: ["downtown", "corporate"],
    templateData: {
      name: "Test Location",
      type: "physical",
      visibility: "players",
      description: "A test location",
      securityRating: 5,
      tags: ["downtown", "corporate"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as LocationTemplate;
}

async function getCampaignsModule() {
  return await import("@/lib/storage/campaigns");
}

describe("POST /api/locations/[id]/create-template", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/create-template",
      { name: "My Template", isPublic: false }
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

    const request = createMockRequest(
      "http://localhost:3000/api/locations/nonexistent/create-template",
      { name: "My Template", isPublic: false }
    );
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

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/create-template",
      { name: "My Template", isPublic: false }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toContain("GM");
  });

  it("should return 400 when name is missing", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/create-template",
      { isPublic: false }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("name");
  });

  it("should create template successfully", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const mockTemplate = createMockLocationTemplate();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.createLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/create-template",
      { name: "My Template", isPublic: false }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.template).toBeDefined();
  });

  it("should create template with custom description", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const mockTemplate = createMockLocationTemplate({ description: "Custom description" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.createLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/create-template",
      { name: "My Template", description: "Custom description", isPublic: false }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    expect(locationsStorage.createLocationTemplate).toHaveBeenCalledWith(
      "test-gm-id",
      expect.objectContaining({
        name: "My Template",
        description: "Custom description",
      })
    );
  });

  it("should create public template when isPublic is true", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation();
    const mockTemplate = createMockLocationTemplate({ isPublic: true });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.createLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/create-template",
      { name: "Public Template", isPublic: true }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(200);
    expect(locationsStorage.createLocationTemplate).toHaveBeenCalledWith(
      "test-gm-id",
      expect.objectContaining({
        isPublic: true,
      })
    );
  });

  it("should strip campaign-specific data from template", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({
      npcIds: ["npc-1", "npc-2"],
      gruntTeamIds: ["grunt-1"],
      sessionIds: ["session-1"],
      visitedByCharacterIds: ["char-1"],
      visitCount: 5,
      parentLocationId: "parent-loc",
      childLocationIds: ["child-1"],
    });
    const mockTemplate = createMockLocationTemplate();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.createLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/create-template",
      { name: "My Template", isPublic: false }
    );
    await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });

    expect(locationsStorage.createLocationTemplate).toHaveBeenCalledWith(
      "test-gm-id",
      expect.objectContaining({
        templateData: expect.not.objectContaining({
          id: expect.anything(),
          campaignId: expect.anything(),
          npcIds: expect.anything(),
          gruntTeamIds: expect.anything(),
          sessionIds: expect.anything(),
          visitedByCharacterIds: expect.anything(),
          visitCount: expect.anything(),
          parentLocationId: expect.anything(),
          childLocationIds: expect.anything(),
        }),
      })
    );
  });

  it("should preserve location properties in template", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({
      securityRating: 7,
      tags: ["barrens", "dangerous"],
      astralProperties: { manaLevel: "high", backgroundCount: 3 },
    });
    const mockTemplate = createMockLocationTemplate();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.createLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/create-template",
      { name: "My Template", isPublic: false }
    );
    await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });

    expect(locationsStorage.createLocationTemplate).toHaveBeenCalledWith(
      "test-gm-id",
      expect.objectContaining({
        type: "physical",
        tags: ["barrens", "dangerous"],
      })
    );
  });

  it("should use location description if custom description not provided", async () => {
    const campaignsModule = await getCampaignsModule();
    const mockLocation = createMockLocation({ description: "Original location description" });
    const mockTemplate = createMockLocationTemplate();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockResolvedValue([createMockCampaign()]);
    vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation);
    vi.mocked(locationsStorage.createLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/create-template",
      { name: "My Template", isPublic: false }
    );
    await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });

    expect(locationsStorage.createLocationTemplate).toHaveBeenCalledWith(
      "test-gm-id",
      expect.objectContaining({
        description: "Original location description",
      })
    );
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const campaignsModule = await getCampaignsModule();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignsModule.getCampaignsByUserId).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(
      "http://localhost:3000/api/locations/test-location-id/create-template",
      { name: "My Template", isPublic: false }
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-location-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
