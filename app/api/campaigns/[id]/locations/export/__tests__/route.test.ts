/**
 * Tests for /api/campaigns/[id]/locations/export endpoint
 *
 * Tests location export (GET) functionality.
 * Export is restricted to GM-only (issue #683).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as locationStorage from "@/lib/storage/locations";
import type { Location } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign");
vi.mock("@/lib/storage/locations");

function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, { method: "GET" });
  Object.defineProperty(request, "nextUrl", { value: urlObj, writable: false });
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

describe("GET /api/campaigns/[id]/locations/export", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations/export"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should export locations successfully for GM", async () => {
    const locations = [createMockLocation({ id: "loc-1" }), createMockLocation({ id: "loc-2" })];
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: null,
      role: "gm",
      error: undefined,
      status: 200,
    });
    vi.mocked(locationStorage.exportLocations).mockResolvedValue(locations);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations/export"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.locations).toHaveLength(2);
  });

  it("should return 403 for player (GM-only endpoint)", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: "player",
      error: "GM access required",
      status: 403,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations/export"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 403 when not a member", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Not a member of this campaign",
      status: 403,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations/export"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Campaign not found",
      status: 404,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent/locations/export"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
  });

  it("should call authorizeCampaign with requireGM: true", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: null,
      role: "gm",
      error: undefined,
      status: 200,
    });
    vi.mocked(locationStorage.exportLocations).mockResolvedValue([]);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations/export"
    );
    await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(campaignAuth.authorizeCampaign).toHaveBeenCalledWith("test-campaign-id", "test-gm-id", {
      requireGM: true,
    });
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/locations/export"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
