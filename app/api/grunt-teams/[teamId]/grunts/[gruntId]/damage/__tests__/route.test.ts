/**
 * Tests for /api/grunt-teams/[teamId]/grunts/[gruntId]/damage endpoint
 *
 * Tests individual grunt damage application.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as gruntStorage from "@/lib/storage/grunts";
import * as gruntRules from "@/lib/rules/grunts";
import type { Campaign, GruntTeam, IndividualGrunts, DamageResult } from "@/lib/types";

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

function createDamageResult(overrides?: Partial<DamageResult>): DamageResult {
  return {
    gruntId: "grunt-1",
    previousDamage: 0,
    newDamage: 3,
    damageApplied: 3,
    isStunned: false,
    isDead: false,
    conditionMonitor: [true, true, true, false, false, false, false, false, false],
    ...overrides,
  };
}

describe("POST /api/grunt-teams/[teamId]/grunts/[gruntId]/damage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 404 when team not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/nonexistent-team/grunts/grunt-1/damage",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "nonexistent-team", gruntId: "grunt-1" }),
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
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(403);
  });

  it("should return 400 when damage is missing", async () => {
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
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Damage must be a non-negative number");
  });

  it("should return 400 when damage is negative", async () => {
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
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: -1, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Damage must be a non-negative number");
  });

  it("should return 400 when damageType is invalid", async () => {
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
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: 3, damageType: "invalid" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Damage type must be 'physical' or 'stun'");
  });

  it("should return 404 when grunt not found", async () => {
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
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/nonexistent-grunt/damage",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "nonexistent-grunt" }),
    });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Grunt not found");
  });

  it("should return 400 when grunt is already dead", async () => {
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
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Cannot apply damage to dead grunt");
  });

  it("should return 200 and apply physical damage successfully", async () => {
    const mockTeam = createMockGruntTeam();
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts();
    const damageResult = createDamageResult();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.applyDamage).mockReturnValue(damageResult);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.result).toEqual(damageResult);
    expect(gruntRules.applyDamage).toHaveBeenCalledWith(
      mockIndividuals.grunts["grunt-1"],
      3,
      "physical",
      9
    );
  });

  it("should return 200 and apply stun damage successfully", async () => {
    const mockTeam = createMockGruntTeam();
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts();
    const damageResult = createDamageResult();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.applyDamage).mockReturnValue(damageResult);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: 3, damageType: "stun" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(200);
    expect(gruntRules.applyDamage).toHaveBeenCalledWith(
      mockIndividuals.grunts["grunt-1"],
      3,
      "stun",
      9
    );
  });

  it("should use simplified damage rules when enabled", async () => {
    const mockTeam = createMockGruntTeam({
      options: { useSimplifiedRules: true },
    });
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts();
    const damageResult = createDamageResult({ isDead: true, newDamage: 9 });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.applySimplifiedDamage).mockReturnValue(damageResult);
    vi.mocked(gruntRules.checkMorale).mockReturnValue("steady");
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(200);
    expect(gruntRules.applySimplifiedDamage).toHaveBeenCalled();
    expect(gruntRules.applyDamage).not.toHaveBeenCalled();
  });

  it("should apply damage to lieutenant", async () => {
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
    const damageResult = createDamageResult({ gruntId: "lieutenant-1" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.applyDamage).mockReturnValue(damageResult);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/lieutenant-1/damage",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "lieutenant-1" }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("should apply damage to specialist", async () => {
    const mockTeam = createMockGruntTeam({
      specialists: [
        {
          id: "specialist-1",
          type: "heavy-weapons",
          description: "Heavy weapons specialist",
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
    const damageResult = createDamageResult({ gruntId: "specialist-1" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.applyDamage).mockReturnValue(damageResult);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/specialist-1/damage",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "specialist-1" }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("should increment casualties when grunt dies", async () => {
    const mockTeam = createMockGruntTeam({
      state: { activeCount: 6, casualties: 0, moraleBroken: false },
    });
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts();
    const damageResult = createDamageResult({ isDead: true, newDamage: 9 });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.applyDamage).mockReturnValue(damageResult);
    vi.mocked(gruntRules.checkMorale).mockReturnValue("steady");
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: 9, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.teamState.casualties).toBe(1);
    expect(data.teamState.activeCount).toBe(5);
    expect(gruntStorage.updateGruntTeamState).toHaveBeenCalledWith(
      "test-team-id",
      { casualties: 1, activeCount: 5 },
      "test-campaign-id"
    );
  });

  it("should trigger morale check when grunt dies and breaks morale", async () => {
    const mockTeam = createMockGruntTeam({
      state: { activeCount: 2, casualties: 4, moraleBroken: false },
    });
    const mockCampaign = createMockCampaign();
    const mockIndividuals = createMockIndividualGrunts();
    const damageResult = createDamageResult({ isDead: true, newDamage: 9 });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.applyDamage).mockReturnValue(damageResult);
    vi.mocked(gruntRules.checkMorale).mockReturnValue("broken");
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: 9, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.teamState.moraleBroken).toBe(true);
    expect(gruntRules.checkMorale).toHaveBeenCalled();
    // Should call updateGruntTeamState twice: once for casualties, once for morale
    expect(gruntStorage.updateGruntTeamState).toHaveBeenCalledTimes(2);
  });

  it("should return 500 on internal error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockTeam = createMockGruntTeam();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Database error"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/grunts/grunt-1/damage",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, {
      params: Promise.resolve({ teamId: "test-team-id", gruntId: "grunt-1" }),
    });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
