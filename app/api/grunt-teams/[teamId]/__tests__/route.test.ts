/**
 * Tests for /api/grunt-teams/[teamId] endpoint
 *
 * Tests grunt team GET, PUT, DELETE operations.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PUT, DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as gruntStorage from "@/lib/storage/grunts";
import * as gruntRules from "@/lib/rules/grunts";
import type { Campaign, GruntTeam, IndividualGrunts } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign");
vi.mock("@/lib/storage/grunts");
vi.mock("@/lib/rules/grunts");

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

function createMockIndividualGrunts(): IndividualGrunts {
  return {
    grunts: {
      "grunt-1": {
        id: "grunt-1",
        conditionMonitor: [false, false, false, false, false, false, false, false, false],
        currentDamage: 0,
        isStunned: false,
        isDead: false,
      },
      "grunt-2": {
        id: "grunt-2",
        conditionMonitor: [false, false, false, false, false, false, false, false, false],
        currentDamage: 0,
        isStunned: false,
        isDead: false,
      },
    },
  };
}

describe("GET /api/grunt-teams/[teamId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/grunt-teams/test-team-id");
    const response = await GET(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 404 when team not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/grunt-teams/nonexistent-team");
    const response = await GET(request, {
      params: Promise.resolve({ teamId: "nonexistent-team" }),
    });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Grunt team not found");
  });

  it("should return 403 when not a campaign member", async () => {
    const mockTeam = createMockGruntTeam();
    vi.mocked(sessionModule.getSession).mockResolvedValue("non-member");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Access denied",
      status: 403,
    });
    const request = createMockRequest("http://localhost:3000/api/grunt-teams/test-team-id");
    const response = await GET(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 403 when player tries to access hidden team", async () => {
    const mockTeam = createMockGruntTeam({ visibility: { showToPlayers: false } });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "player",
      status: 200,
    });
    const request = createMockRequest("http://localhost:3000/api/grunt-teams/test-team-id");
    const response = await GET(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Access denied");
  });

  it("should return 200 and full team for GM", async () => {
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
    const request = createMockRequest("http://localhost:3000/api/grunt-teams/test-team-id");
    const response = await GET(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.team).toEqual(mockTeam);
    expect(data.individualGrunts).toBeUndefined();
  });

  it("should return 200 and visible team for player", async () => {
    const mockTeam = createMockGruntTeam({ visibility: { showToPlayers: true } });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "player",
      status: 200,
    });
    const request = createMockRequest("http://localhost:3000/api/grunt-teams/test-team-id");
    const response = await GET(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.team).toEqual(mockTeam);
  });

  it("should return individualGrunts when GM requests includeCombatState=true", async () => {
    const mockTeam = createMockGruntTeam();
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id?includeCombatState=true"
    );
    const response = await GET(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.individualGrunts).toEqual(mockIndividuals);
  });

  it("should not return individualGrunts when player requests includeCombatState=true", async () => {
    const mockTeam = createMockGruntTeam({ visibility: { showToPlayers: true } });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "player",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id?includeCombatState=true"
    );
    const response = await GET(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.individualGrunts).toBeUndefined();
    expect(gruntStorage.getOrInitializeIndividualGrunts).not.toHaveBeenCalled();
  });

  it("should return 500 on internal error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockRejectedValue(new Error("Database error"));
    const request = createMockRequest("http://localhost:3000/api/grunt-teams/test-team-id");
    const response = await GET(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("An error occurred");
    consoleErrorSpy.mockRestore();
  });
});

describe("PUT /api/grunt-teams/[teamId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      { name: "Updated Team" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return 404 when team not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/nonexistent-team",
      { name: "Updated Team" },
      "PUT"
    );
    const response = await PUT(request, {
      params: Promise.resolve({ teamId: "nonexistent-team" }),
    });
    expect(response.status).toBe(404);
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
      "http://localhost:3000/api/grunt-teams/test-team-id",
      { name: "Updated Team" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 400 when validation fails", async () => {
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
    vi.mocked(gruntRules.validateGruntTeam).mockReturnValue({
      valid: false,
      errors: ["Invalid team configuration"],
      warnings: [],
    });
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      { name: "" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Invalid team configuration");
  });

  it("should return 200 and update team name", async () => {
    const mockTeam = createMockGruntTeam();
    const updatedTeam = createMockGruntTeam({ name: "Updated Team Name" });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntRules.validateGruntTeam).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(gruntStorage.updateGruntTeam).mockResolvedValue(updatedTeam);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      { name: "Updated Team Name" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.team.name).toBe("Updated Team Name");
  });

  it("should return 200 and update professionalRating", async () => {
    const mockTeam = createMockGruntTeam({ professionalRating: 2 });
    const updatedTeam = createMockGruntTeam({ professionalRating: 4 });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntRules.validateGruntTeam).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(gruntStorage.updateGruntTeam).mockResolvedValue(updatedTeam);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      { professionalRating: 4 },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.team.professionalRating).toBe(4);
  });

  it("should return 200 and update visibility", async () => {
    const mockTeam = createMockGruntTeam({ visibility: { showToPlayers: true } });
    const updatedTeam = createMockGruntTeam({ visibility: { showToPlayers: false } });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntRules.validateGruntTeam).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(gruntStorage.updateGruntTeam).mockResolvedValue(updatedTeam);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      { visibility: { showToPlayers: false } },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.team.visibility.showToPlayers).toBe(false);
  });

  it("should return 200 and set lieutenant to null", async () => {
    const mockTeam = createMockGruntTeam({
      lieutenant: {
        attributes: {
          body: 4,
          agility: 4,
          reaction: 4,
          strength: 4,
          willpower: 4,
          logic: 4,
          intuition: 4,
          charisma: 4,
        },
        essence: 6,
        skills: { firearms: 5 },
        gear: [],
        weapons: [],
        armor: [],
        conditionMonitorSize: 10,
        canBoostProfessionalRating: true,
        usesIndividualInitiative: true,
      },
    });
    const updatedTeam = createMockGruntTeam({ lieutenant: undefined });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntRules.validateGruntTeam).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(gruntStorage.updateGruntTeam).mockResolvedValue(updatedTeam);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      { lieutenant: null },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.team.lieutenant).toBeUndefined();
  });

  it("should return 200 and merge partial baseGrunts updates", async () => {
    const mockTeam = createMockGruntTeam();
    const updatedTeam = createMockGruntTeam({
      baseGrunts: {
        ...mockTeam.baseGrunts,
        conditionMonitorSize: 10,
      },
    });
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntRules.validateGruntTeam).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(gruntStorage.updateGruntTeam).mockResolvedValue(updatedTeam);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      { baseGrunts: { conditionMonitorSize: 10 } },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    expect(gruntRules.validateGruntTeam).toHaveBeenCalledWith(
      expect.objectContaining({
        baseGrunts: expect.objectContaining({ conditionMonitorSize: 10 }),
      })
    );
  });

  it("should return 500 on internal error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockTeam = createMockGruntTeam();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Database error"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      { name: "Updated" },
      "PUT"
    );
    const response = await PUT(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});

describe("DELETE /api/grunt-teams/[teamId]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return 404 when team not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/nonexistent-team",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, {
      params: Promise.resolve({ teamId: "nonexistent-team" }),
    });
    expect(response.status).toBe(404);
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
      "http://localhost:3000/api/grunt-teams/test-team-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 200 on successful delete", async () => {
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
    vi.mocked(gruntStorage.deleteGruntTeam).mockResolvedValue(true);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(gruntStorage.deleteGruntTeam).toHaveBeenCalledWith("test-team-id", "test-campaign-id");
  });

  it("should return 500 on internal error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockTeam = createMockGruntTeam();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Database error"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
