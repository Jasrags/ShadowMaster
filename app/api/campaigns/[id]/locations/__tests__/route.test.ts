/**
 * Tests for /api/campaigns/[id]/locations endpoint
 *
 * Tests location listing (GET) with filters and creation (POST) functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as locationStorage from "@/lib/storage/locations";
import type { Campaign, Location } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign");
vi.mock("@/lib/storage/locations");
vi.mock("@/lib/storage/activity", () => ({
  logActivity: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("@/lib/storage/notifications", () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
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

describe("GET /api/campaigns/[id]/locations", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return all locations for GM", async () => {
    const locations = [
      createMockLocation({ id: "loc-1", visibility: "gm-only", gmNotes: "Secret notes" }),
      createMockLocation({ id: "loc-2", visibility: "players" }),
    ];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(locationStorage.getLocationsByCampaign).mockResolvedValue(locations);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.locations).toHaveLength(2);
  });

  it("should filter out gm-only locations for players", async () => {
    const locations = [
      createMockLocation({ id: "loc-1", visibility: "gm-only", gmNotes: "Secret notes" }),
      createMockLocation({ id: "loc-2", visibility: "players", gmNotes: "Player hidden notes" }),
    ];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "player",
      status: 200,
    });
    vi.mocked(locationStorage.getLocationsByCampaign).mockResolvedValue(locations);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.locations).toHaveLength(1);
    expect(data.locations[0].visibility).toBe("players");
    expect(data.locations[0].gmNotes).toBeUndefined();
  });

  it("should filter by type", async () => {
    const locations = [createMockLocation({ type: "physical" })];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(locationStorage.getLocationsByCampaign).mockResolvedValue(locations);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations?type=physical"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
    expect(locationStorage.getLocationsByCampaign).toHaveBeenCalledWith("test-campaign-id", {
      type: "physical",
      visibility: undefined,
      tags: undefined,
      search: undefined,
      parentId: undefined,
    });
  });

  it("should filter by visibility", async () => {
    const locations = [createMockLocation({ visibility: "players" })];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(locationStorage.getLocationsByCampaign).mockResolvedValue(locations);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations?visibility=players"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
    expect(locationStorage.getLocationsByCampaign).toHaveBeenCalledWith("test-campaign-id", {
      type: undefined,
      visibility: "players",
      tags: undefined,
      search: undefined,
      parentId: undefined,
    });
  });

  it("should filter by tags", async () => {
    const locations = [createMockLocation({ tags: ["downtown", "dangerous"] })];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(locationStorage.getLocationsByCampaign).mockResolvedValue(locations);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations?tags=downtown,dangerous"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
    expect(locationStorage.getLocationsByCampaign).toHaveBeenCalledWith("test-campaign-id", {
      type: undefined,
      visibility: undefined,
      tags: ["downtown", "dangerous"],
      search: undefined,
      parentId: undefined,
    });
  });

  it("should filter by search query", async () => {
    const locations = [createMockLocation({ name: "Downtown Bar" })];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(locationStorage.getLocationsByCampaign).mockResolvedValue(locations);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations?search=Downtown"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
    expect(locationStorage.getLocationsByCampaign).toHaveBeenCalledWith("test-campaign-id", {
      type: undefined,
      visibility: undefined,
      tags: undefined,
      search: "Downtown",
      parentId: undefined,
    });
  });

  it("should filter by parentId", async () => {
    const locations = [createMockLocation({ parentLocationId: "parent-id" })];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(locationStorage.getLocationsByCampaign).mockResolvedValue(locations);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations?parentId=parent-id"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
    expect(locationStorage.getLocationsByCampaign).toHaveBeenCalledWith("test-campaign-id", {
      type: undefined,
      visibility: undefined,
      tags: undefined,
      search: undefined,
      parentId: "parent-id",
    });
  });

  it("should return 403 when not a member", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Access denied",
      status: 403,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/campaigns/[id]/locations", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      { name: "Test", type: "physical", visibility: "players" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should create location successfully", async () => {
    const mockCampaign = createMockCampaign();
    const mockLocation = createMockLocation();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(locationStorage.createLocation).mockResolvedValue(mockLocation);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      { name: "Test Location", type: "physical", visibility: "players" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.location).toBeDefined();
  });

  it("should return 400 when name is missing", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      { type: "physical", visibility: "players" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Name");
  });

  it("should return 400 when name is too long", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      { name: "a".repeat(201), type: "physical", visibility: "players" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Name");
  });

  it("should return 400 when type is missing", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      { name: "Test", visibility: "players" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("type");
  });

  it("should return 400 when visibility is missing", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      { name: "Test", type: "physical" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Visibility");
  });

  it("should return 400 when security rating is out of range", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      { name: "Test", type: "physical", visibility: "players", securityRating: 15 },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Security rating");
  });

  it("should return 400 when security rating is below 1", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      { name: "Test", type: "physical", visibility: "players", securityRating: 0 },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Security rating");
  });

  it("should return 400 when coordinates are invalid", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      {
        name: "Test",
        type: "physical",
        visibility: "players",
        coordinates: { latitude: 100, longitude: 0 },
      },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("coordinates");
  });

  it("should return 400 when longitude is invalid", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      {
        name: "Test",
        type: "physical",
        visibility: "players",
        coordinates: { latitude: 45, longitude: 200 },
      },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("coordinates");
  });

  it("should accept valid coordinates", async () => {
    const mockCampaign = createMockCampaign();
    const mockLocation = createMockLocation({
      coordinates: { latitude: 47.6062, longitude: -122.3321 },
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(locationStorage.createLocation).mockResolvedValue(mockLocation);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      {
        name: "Seattle HQ",
        type: "physical",
        visibility: "players",
        coordinates: { latitude: 47.6062, longitude: -122.3321 },
      },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
  });

  it("should return 403 when not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: "player",
      error: "GM only",
      status: 403,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      { name: "Test", type: "physical", visibility: "players" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations",
      { name: "Test", type: "physical", visibility: "players" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
