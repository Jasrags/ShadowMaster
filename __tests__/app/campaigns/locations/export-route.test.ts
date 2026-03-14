/**
 * Tests for location export endpoint security
 *
 * Verifies that the export endpoint restricts access to GM-only,
 * preventing GM-only locations and notes from leaking to players.
 * See: GitHub issue #683
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies before imports
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/auth/campaign", () => ({
  authorizeCampaign: vi.fn(),
}));

vi.mock("@/lib/storage/locations", () => ({
  exportLocations: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { authorizeCampaign } from "@/lib/auth/campaign";
import { exportLocations } from "@/lib/storage/locations";
import { GET } from "@/app/api/campaigns/[id]/locations/export/route";

// =============================================================================
// TEST DATA
// =============================================================================

const GM_ID = "gm-user-1";
const PLAYER_ID = "player-user-2";
const OUTSIDER_ID = "outsider-user-3";
const CAMPAIGN_ID = "campaign-1";

const mockLocations = [
  {
    id: "loc-1",
    campaignId: CAMPAIGN_ID,
    name: "Public Bar",
    type: "commercial",
    visibility: "visible",
    description: "A seedy bar",
  },
  {
    id: "loc-2",
    campaignId: CAMPAIGN_ID,
    name: "Secret Base",
    type: "residential",
    visibility: "gm-only",
    gmNotes: "This is where the BBEG hides",
    gmOnlyContent: { npcIds: ["npc-secret"] },
  },
];

function createRequest(): NextRequest {
  return new NextRequest(`http://localhost:3000/api/campaigns/${CAMPAIGN_ID}/locations/export`);
}

function createParams(): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id: CAMPAIGN_ID }) };
}

// =============================================================================
// TESTS
// =============================================================================

describe("GET /api/campaigns/[id]/locations/export", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------------------------

  it("should return 401 when not authenticated", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const response = await GET(createRequest(), createParams());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error).toContain("Authentication");
  });

  // ---------------------------------------------------------------------------
  // Authorization - GM only
  // ---------------------------------------------------------------------------

  it("should return 403 when a player tries to export", async () => {
    vi.mocked(getSession).mockResolvedValue(PLAYER_ID);
    vi.mocked(authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: "player",
      error: "Only the GM can perform this action",
      status: 403,
    });

    const response = await GET(createRequest(), createParams());
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(authorizeCampaign).toHaveBeenCalledWith(CAMPAIGN_ID, PLAYER_ID, { requireGM: true });
  });

  it("should return 403 when a non-member tries to export", async () => {
    vi.mocked(getSession).mockResolvedValue(OUTSIDER_ID);
    vi.mocked(authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Only the GM can perform this action",
      status: 403,
    });

    const response = await GET(createRequest(), createParams());
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
  });

  it("should return 404 when campaign does not exist", async () => {
    vi.mocked(getSession).mockResolvedValue(GM_ID);
    vi.mocked(authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Campaign not found",
      status: 404,
    });

    const response = await GET(createRequest(), createParams());
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // Successful GM export
  // ---------------------------------------------------------------------------

  it("should return all locations including GM-only when GM exports", async () => {
    vi.mocked(getSession).mockResolvedValue(GM_ID);
    vi.mocked(authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: { id: CAMPAIGN_ID, gmId: GM_ID, playerIds: [PLAYER_ID] } as never,
      role: "gm",
      status: 200,
    });
    vi.mocked(exportLocations).mockResolvedValue(mockLocations as never);

    const response = await GET(createRequest(), createParams());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.locations).toHaveLength(2);
    // GM should see gm-only locations with all fields
    expect(body.locations[1].visibility).toBe("gm-only");
    expect(body.locations[1].gmNotes).toBe("This is where the BBEG hides");
  });

  it("should call authorizeCampaign with requireGM: true", async () => {
    vi.mocked(getSession).mockResolvedValue(GM_ID);
    vi.mocked(authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: { id: CAMPAIGN_ID, gmId: GM_ID, playerIds: [] } as never,
      role: "gm",
      status: 200,
    });
    vi.mocked(exportLocations).mockResolvedValue([]);

    await GET(createRequest(), createParams());

    expect(authorizeCampaign).toHaveBeenCalledWith(CAMPAIGN_ID, GM_ID, { requireGM: true });
  });
});
