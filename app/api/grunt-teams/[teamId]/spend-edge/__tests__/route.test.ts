/**
 * Tests for /api/grunt-teams/[teamId]/spend-edge endpoint
 *
 * Tests Group Edge spending functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as gruntStorage from "@/lib/storage/grunts";
import * as gruntRules from "@/lib/rules/grunts";
import type { Campaign, GruntTeam } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign");
vi.mock("@/lib/storage/grunts");
vi.mock("@/lib/rules/grunts");

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

function createMockGruntTeam(overrides?: Partial<GruntTeam>): GruntTeam {
  return {
    id: "test-team-id",
    campaignId: "test-campaign-id",
    name: "Test Grunt Team",
    professionalRating: 2,
    groupEdge: 2,
    groupEdgeMax: 2,
    baseGrunts: {
      attributes: {
        body: 3,
        agility: 3,
        reaction: 3,
        strength: 3,
        willpower: 3,
        logic: 3,
        intuition: 3,
        charisma: 3,
      },
      essence: 6,
      skills: { firearms: 3 },
      gear: [],
      weapons: [],
      armor: [],
      conditionMonitorSize: 9,
    },
    initialSize: 6,
    specialists: [],
    visibility: { showToPlayers: true },
    state: {
      activeCount: 6,
      casualties: 0,
      moraleBroken: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as GruntTeam;
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

describe("POST /api/grunt-teams/[teamId]/spend-edge", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/spend-edge",
      { amount: 1 }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 404 when team not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/nonexistent-team/spend-edge",
      { amount: 1 }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "nonexistent-team" }),
    });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Grunt team not found");
  });

  it("should return 403 when not GM", async () => {
    const mockTeam = createMockGruntTeam();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: "player",
      error: "GM only",
      status: 403,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/spend-edge",
      { amount: 1 }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 400 when amount is missing", async () => {
    const mockTeam = createMockGruntTeam();
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/spend-edge",
      {}
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Amount must be at least 1");
  });

  it("should return 400 when amount is less than 1", async () => {
    const mockTeam = createMockGruntTeam();
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/spend-edge",
      { amount: 0 }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Amount must be at least 1");
  });

  it("should return 400 when insufficient edge", async () => {
    const mockTeam = createMockGruntTeam({ groupEdge: 1 });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntRules.canSpendEdge).mockReturnValue(false);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/spend-edge",
      { amount: 2 }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Insufficient Group Edge");
    expect(data.error).toContain("have 1");
    expect(data.error).toContain("need 2");
  });

  it("should return 200 and spend 1 edge successfully", async () => {
    const mockTeam = createMockGruntTeam({ groupEdge: 2, groupEdgeMax: 2 });
    const updatedTeam = createMockGruntTeam({ groupEdge: 1, groupEdgeMax: 2 });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntRules.canSpendEdge).mockReturnValue(true);
    vi.mocked(gruntStorage.spendGroupEdge).mockResolvedValue(updatedTeam);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/spend-edge",
      { amount: 1 }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.team.groupEdge).toBe(1);
    expect(gruntStorage.spendGroupEdge).toHaveBeenCalledWith("test-team-id", 1, "test-campaign-id");
  });

  it("should return 200 and spend all edge successfully", async () => {
    const mockTeam = createMockGruntTeam({ groupEdge: 3, groupEdgeMax: 3 });
    const updatedTeam = createMockGruntTeam({ groupEdge: 0, groupEdgeMax: 3 });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntRules.canSpendEdge).mockReturnValue(true);
    vi.mocked(gruntStorage.spendGroupEdge).mockResolvedValue(updatedTeam);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/spend-edge",
      { amount: 3 }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.team.groupEdge).toBe(0);
    expect(gruntStorage.spendGroupEdge).toHaveBeenCalledWith("test-team-id", 3, "test-campaign-id");
  });

  it("should return 500 on internal error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockTeam = createMockGruntTeam();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Database error"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/spend-edge",
      { amount: 1 }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
