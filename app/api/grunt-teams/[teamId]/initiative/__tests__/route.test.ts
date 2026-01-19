/**
 * Tests for /api/grunt-teams/[teamId]/initiative endpoint
 *
 * Tests initiative rolling functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
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

function createMockIndividualGrunts(overrides?: Partial<IndividualGrunts>): IndividualGrunts {
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
    ...overrides,
  };
}

describe("POST /api/grunt-teams/[teamId]/initiative", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "group" }
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
      "http://localhost:3000/api/grunt-teams/nonexistent-team/initiative",
      { type: "group" }
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
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "group" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 400 when type is missing", async () => {
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
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      {}
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Type must be 'group' or 'individual'");
  });

  it("should return 400 when type is invalid", async () => {
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
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "invalid" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Type must be 'group' or 'individual'");
  });

  it("should return 200 and roll group initiative with deterministic die", async () => {
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
    vi.mocked(gruntRules.rollD6).mockReturnValue(4);
    vi.mocked(gruntRules.rollGroupInitiative).mockReturnValue(10);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "group" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.groupInitiative).toBe(10);
    expect(gruntRules.rollD6).toHaveBeenCalled();
    expect(gruntRules.rollGroupInitiative).toHaveBeenCalledWith(mockTeam.baseGrunts, 4);
    expect(gruntStorage.updateGruntTeamState).toHaveBeenCalledWith(
      "test-team-id",
      { groupInitiative: 10 },
      "test-campaign-id"
    );
  });

  it("should apply base modifier to group initiative", async () => {
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
    vi.mocked(gruntRules.rollD6).mockReturnValue(4);
    vi.mocked(gruntRules.rollGroupInitiative).mockReturnValue(10);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "group", baseModifier: 2 }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.groupInitiative).toBe(12); // 10 + 2
  });

  it("should roll individual initiative for each grunt", async () => {
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
    vi.mocked(gruntRules.rollD6)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(3);
    vi.mocked(gruntRules.rollGroupInitiative)
      .mockReturnValueOnce(10)
      .mockReturnValueOnce(11)
      .mockReturnValueOnce(9);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "individual" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.individualInitiatives).toBeDefined();
    expect(Object.keys(data.individualInitiatives)).toHaveLength(2);
    expect(gruntStorage.saveIndividualGrunts).toHaveBeenCalled();
  });

  it("should always roll individually for lieutenant", async () => {
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
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts({
      lieutenant: {
        id: "lieutenant-1",
        conditionMonitor: [false, false, false, false, false, false, false, false, false, false],
        currentDamage: 0,
        isStunned: false,
        isDead: false,
      },
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.rollD6).mockReturnValue(4);
    vi.mocked(gruntRules.rollGroupInitiative).mockReturnValue(10);
    vi.mocked(gruntRules.rollLieutenantInitiative).mockReturnValue(15);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "group" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.individualInitiatives?.["lieutenant-1"]).toBe(15);
    expect(gruntRules.rollLieutenantInitiative).toHaveBeenCalledWith(mockTeam.lieutenant, 4);
  });

  it("should roll individually for specialist with usesIndividualInitiative", async () => {
    const mockTeam = createMockGruntTeam({
      specialists: [
        {
          id: "specialist-1",
          type: "heavy-weapons",
          description: "Heavy weapons specialist",
          usesIndividualInitiative: true,
        },
      ],
    });
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts({
      specialists: {
        "specialist-1": {
          id: "specialist-1",
          conditionMonitor: [false, false, false, false, false, false, false, false, false],
          currentDamage: 0,
          isStunned: false,
          isDead: false,
        },
      },
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.rollD6).mockReturnValue(4);
    vi.mocked(gruntRules.rollGroupInitiative).mockReturnValue(10);
    vi.mocked(gruntRules.rollDice).mockReturnValue([5]);
    vi.mocked(gruntRules.rollSpecialistInitiative).mockReturnValue(12);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "group" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.individualInitiatives?.["specialist-1"]).toBe(12);
    expect(gruntRules.rollSpecialistInitiative).toHaveBeenCalledWith(
      mockTeam.specialists![0],
      mockTeam.baseGrunts,
      [5]
    );
  });

  it("should use group initiative for specialist without usesIndividualInitiative", async () => {
    const mockTeam = createMockGruntTeam({
      specialists: [
        {
          id: "specialist-1",
          type: "heavy-weapons",
          description: "Heavy weapons specialist",
          usesIndividualInitiative: false,
        },
      ],
    });
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts({
      specialists: {
        "specialist-1": {
          id: "specialist-1",
          conditionMonitor: [false, false, false, false, false, false, false, false, false],
          currentDamage: 0,
          isStunned: false,
          isDead: false,
        },
      },
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.rollD6).mockReturnValue(4);
    vi.mocked(gruntRules.rollGroupInitiative).mockReturnValue(10);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "group" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.individualInitiatives?.["specialist-1"]).toBe(10); // Uses group initiative
    expect(gruntRules.rollSpecialistInitiative).not.toHaveBeenCalled();
  });

  it("should skip dead grunts when rolling initiative", async () => {
    const mockTeam = createMockGruntTeam();
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts({
      grunts: {
        "grunt-1": {
          id: "grunt-1",
          conditionMonitor: [true, true, true, true, true, true, true, true, true],
          currentDamage: 9,
          isStunned: false,
          isDead: true,
        },
        "grunt-2": {
          id: "grunt-2",
          conditionMonitor: [false, false, false, false, false, false, false, false, false],
          currentDamage: 0,
          isStunned: false,
          isDead: false,
        },
      },
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.rollD6).mockReturnValue(4);
    vi.mocked(gruntRules.rollGroupInitiative).mockReturnValue(10);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "individual" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.individualInitiatives).toBeDefined();
    expect(data.individualInitiatives?.["grunt-1"]).toBeUndefined();
    expect(data.individualInitiatives?.["grunt-2"]).toBeDefined();
  });

  it("should skip dead lieutenant when rolling initiative", async () => {
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
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts({
      lieutenant: {
        id: "lieutenant-1",
        conditionMonitor: [true, true, true, true, true, true, true, true, true, true],
        currentDamage: 10,
        isStunned: false,
        isDead: true,
      },
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.rollD6).mockReturnValue(4);
    vi.mocked(gruntRules.rollGroupInitiative).mockReturnValue(10);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "group" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.individualInitiatives?.["lieutenant-1"]).toBeUndefined();
    expect(gruntRules.rollLieutenantInitiative).not.toHaveBeenCalled();
  });

  it("should return 500 on internal error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockTeam = createMockGruntTeam();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Database error"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/initiative",
      { type: "group" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
