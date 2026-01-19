/**
 * Tests for /api/campaigns/[id]/grunt-teams endpoint
 *
 * Tests grunt team listing (GET) and creation (POST) functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as gruntStorage from "@/lib/storage/grunts";
import * as gruntTemplateStorage from "@/lib/storage/grunt-templates";
import * as gruntRules from "@/lib/rules/grunts";
import type { Campaign, GruntTeam, GruntTemplate } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign");
vi.mock("@/lib/storage/grunts");
vi.mock("@/lib/storage/grunt-templates");
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
    baseGrunts: {
      baseStats: {
        body: 3,
        agility: 3,
        reaction: 3,
        strength: 3,
        willpower: 3,
        logic: 3,
        intuition: 3,
        charisma: 3,
      },
      conditionMonitor: 9,
      armor: 6,
      skills: [{ name: "Pistols", rating: 3 }],
      equipment: [],
    },
    specialists: [],
    visibility: { showToPlayers: true },
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

describe("GET /api/campaigns/[id]/grunt-teams", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should return all teams for GM", async () => {
    const teams = [
      createMockGruntTeam({ visibility: { showToPlayers: true } }),
      createMockGruntTeam({ id: "hidden-team", visibility: { showToPlayers: false } }),
    ];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getGruntTeamsByCampaign).mockResolvedValue(teams);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.teams).toHaveLength(2);
  });

  it("should filter non-visible teams for players", async () => {
    const teams = [
      createMockGruntTeam({ visibility: { showToPlayers: true } }),
      createMockGruntTeam({ id: "hidden-team", visibility: { showToPlayers: false } }),
    ];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "player",
      status: 200,
    });
    vi.mocked(gruntStorage.getGruntTeamsByCampaign).mockResolvedValue(teams);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.teams).toHaveLength(1);
  });

  it("should filter by professional rating", async () => {
    const teams = [createMockGruntTeam({ professionalRating: 2 })];
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getGruntTeamsByCampaign).mockResolvedValue(teams);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams?professionalRating=2"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
    expect(gruntStorage.getGruntTeamsByCampaign).toHaveBeenCalledWith("test-campaign-id", {
      professionalRating: 2,
      search: undefined,
      encounterId: undefined,
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
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams"
    );
    const response = await GET(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/campaigns/[id]/grunt-teams", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams",
      { name: "New Team", baseGrunts: {} },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(401);
  });

  it("should create team with baseGrunts successfully", async () => {
    const mockCampaign = createMockCampaign();
    const mockTeam = createMockGruntTeam();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
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
    vi.mocked(gruntStorage.createGruntTeam).mockResolvedValue(mockTeam);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams",
      {
        name: "New Team",
        professionalRating: 2,
        baseGrunts: {
          baseStats: {
            body: 3,
            agility: 3,
            reaction: 3,
            strength: 3,
            willpower: 3,
            logic: 3,
            intuition: 3,
            charisma: 3,
          },
          conditionMonitor: 9,
          armor: 6,
          skills: [],
          equipment: [],
        },
      },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.team).toBeDefined();
  });

  it("should create team from template successfully", async () => {
    const mockCampaign = createMockCampaign();
    const mockTeam = createMockGruntTeam();
    const mockTemplate: GruntTemplate = {
      id: "template-id",
      name: "Gang Template",
      description: "A generic gang template",
      editionCode: "sr5",
      professionalRating: 2,
      moraleTier: { breakThreshold: 40, rallyCost: 2, canRally: true },
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
        skills: {},
        gear: [],
        weapons: [],
        armor: [],
        conditionMonitorSize: 9,
      },
    } as GruntTemplate;
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntTemplateStorage.getGruntTemplate).mockResolvedValue(mockTemplate);
    vi.mocked(gruntRules.validateGruntTeam).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(gruntStorage.createGruntTeam).mockResolvedValue(mockTeam);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams",
      { name: "New Team", templateId: "template-id" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(200);
  });

  it("should return 400 when neither baseGrunts nor templateId provided", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams",
      { name: "New Team" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
  });

  it("should return 400 when validation fails", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
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
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams",
      { name: "Bad Team", baseGrunts: {} },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(400);
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
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams",
      { name: "New Team", baseGrunts: {} },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 404 when template not found", async () => {
    const mockCampaign = createMockCampaign();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntTemplateStorage.getGruntTemplate).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams",
      { name: "New Team", templateId: "nonexistent-template" },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(404);
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Error"));
    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/grunt-teams",
      { name: "New Team", baseGrunts: {} },
      "POST"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "test-campaign-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
