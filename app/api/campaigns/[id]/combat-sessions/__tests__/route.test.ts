/**
 * Tests for /api/campaigns/[id]/combat-sessions endpoint
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as combatStorage from "@/lib/storage/combat";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign");
vi.mock("@/lib/storage/combat");

function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, { method: "GET" });
  Object.defineProperty(request, "nextUrl", { value: urlObj, writable: false });
  return request;
}

describe("GET /api/campaigns/[id]/combat-sessions", () => {
  const campaignId = "test-campaign-id";
  const params = Promise.resolve({ id: campaignId });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost/api/campaigns/${campaignId}/combat-sessions`
    );
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("should return 403 when not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("user-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: "player",
      error: "GM access required",
      status: 403,
    });

    const request = createMockRequest(
      `http://localhost/api/campaigns/${campaignId}/combat-sessions`
    );
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
  });

  it("should return active sessions for GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: { id: campaignId } as never,
      role: "gm",
      error: undefined,
      status: 200,
    });
    vi.mocked(combatStorage.getActiveSessionsForCampaign).mockResolvedValue([
      {
        id: "session-1",
        campaignId,
        name: "Test Combat",
      } as never,
    ]);

    const request = createMockRequest(
      `http://localhost/api/campaigns/${campaignId}/combat-sessions`
    );
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.sessions).toHaveLength(1);
    expect(data.sessions[0].name).toBe("Test Combat");
  });

  it("should return empty array when no active sessions", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: { id: campaignId } as never,
      role: "gm",
      error: undefined,
      status: 200,
    });
    vi.mocked(combatStorage.getActiveSessionsForCampaign).mockResolvedValue([]);

    const request = createMockRequest(
      `http://localhost/api/campaigns/${campaignId}/combat-sessions`
    );
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.sessions).toHaveLength(0);
  });
});
