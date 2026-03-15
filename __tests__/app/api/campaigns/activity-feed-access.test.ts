/**
 * Tests for campaign activity feed access control (#692)
 *
 * Verifies that:
 * 1. Activity feed requires campaign membership regardless of visibility
 * 2. Only GMs can create posts with playerVisible: false
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import type { Campaign } from "@/lib/types/campaign";

// --- Shared mock state ---

let mockUserId: string | null = "user-1";
let mockCampaign: Campaign | null;
let mockActivities: unknown[] = [];
let capturedPost: Record<string, unknown> | undefined;

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(async () => mockUserId),
}));

vi.mock("@/lib/storage/users", () => ({
  getUserById: vi.fn(async (id: string) => ({ id, username: `user-${id}` })),
}));

vi.mock("@/lib/storage/campaigns", () => ({
  getCampaignById: vi.fn(async () => mockCampaign),
  getCampaignPosts: vi.fn(async () => []),
  createCampaignPost: vi.fn(async (_id: string, data: Record<string, unknown>) => {
    capturedPost = data;
    return { id: "post-1", ...data, createdAt: "2024-01-01", updatedAt: "2024-01-01" };
  }),
}));

vi.mock("@/lib/storage/activity", () => ({
  getCampaignActivity: vi.fn(async () => mockActivities),
  getCampaignActivityCount: vi.fn(async () => mockActivities.length),
  logActivity: vi.fn(async () => {}),
}));

vi.mock("@/lib/storage/notifications", () => ({
  createNotification: vi.fn(async () => {}),
}));

function makeCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: "campaign-1",
    gmId: "gm-user",
    title: "Test Campaign",
    status: "active",
    editionId: "sr5",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "street",
    visibility: "private",
    playerIds: ["player-1"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    ...overrides,
  } as Campaign;
}

function makeActivityRequest(): NextRequest {
  const url = new URL("http://localhost:3000/api/campaigns/campaign-1/activity");
  return { nextUrl: url } as unknown as NextRequest;
}

describe("Campaign activity feed access control (#692)", () => {
  beforeEach(() => {
    mockUserId = "user-1";
    mockCampaign = makeCampaign();
    mockActivities = [];
    capturedPost = undefined;
    vi.clearAllMocks();
  });

  describe("GET /api/campaigns/[id]/activity", () => {
    test("should deny access to non-members even on public campaigns", async () => {
      mockUserId = "outsider";
      mockCampaign = makeCampaign({ visibility: "public" });

      const { GET } = await import("@/app/api/campaigns/[id]/activity/route");

      const response = await GET(makeActivityRequest(), {
        params: Promise.resolve({ id: "campaign-1" }),
      });

      expect(response.status).toBe(403);
    });

    test("should allow access to campaign GM", async () => {
      mockUserId = "gm-user";
      mockCampaign = makeCampaign();

      const { GET } = await import("@/app/api/campaigns/[id]/activity/route");

      const response = await GET(makeActivityRequest(), {
        params: Promise.resolve({ id: "campaign-1" }),
      });

      expect(response.status).toBe(200);
    });

    test("should allow access to campaign player", async () => {
      mockUserId = "player-1";
      mockCampaign = makeCampaign();

      const { GET } = await import("@/app/api/campaigns/[id]/activity/route");

      const response = await GET(makeActivityRequest(), {
        params: Promise.resolve({ id: "campaign-1" }),
      });

      expect(response.status).toBe(200);
    });
  });

  describe("POST /api/campaigns/[id]/posts", () => {
    test("should restrict playerVisible: false to GM only", async () => {
      mockUserId = "player-1";
      mockCampaign = makeCampaign();

      const { POST } = await import("@/app/api/campaigns/[id]/posts/route");

      const request = new NextRequest("http://localhost/api/campaigns/campaign-1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Secret Post",
          content: "Hidden content",
          type: "announcement",
          playerVisible: false,
        }),
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: "campaign-1" }),
      });

      // Player should not be able to set playerVisible: false
      // The implementation should force playerVisible to true for non-GMs
      expect(response.status).toBe(200);
      expect(capturedPost?.playerVisible).toBe(true);
    });

    test("should allow GM to set playerVisible: false", async () => {
      mockUserId = "gm-user";
      mockCampaign = makeCampaign();

      const { POST } = await import("@/app/api/campaigns/[id]/posts/route");

      const request = new NextRequest("http://localhost/api/campaigns/campaign-1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "GM-Only Post",
          content: "Secret GM content",
          type: "announcement",
          playerVisible: false,
        }),
      });

      const response = await POST(request, {
        params: Promise.resolve({ id: "campaign-1" }),
      });

      expect(response.status).toBe(200);
      expect(capturedPost?.playerVisible).toBe(false);
    });
  });
});
