/**
 * Tests for /api/grunt-teams/[teamId]/damage/bulk endpoint
 *
 * Tests bulk damage application to multiple grunts.
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
      "grunt-3": {
        id: "grunt-3",
        conditionMonitor: [false, false, false, false, false, false, false, false, false],
        currentDamage: 0,
        isStunned: false,
        isDead: false,
      },
    },
    ...overrides,
  };
}

function createDamageResult(gruntId: string, overrides?: Partial<DamageResult>): DamageResult {
  return {
    gruntId,
    previousDamage: 0,
    newDamage: 3,
    damageApplied: 3,
    isStunned: false,
    isDead: false,
    conditionMonitor: [true, true, true, false, false, false, false, false, false],
    ...overrides,
  };
}

describe("POST /api/grunt-teams/[teamId]/damage/bulk", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1", "grunt-2"], damage: 3, damageType: "physical" }
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
      "http://localhost:3000/api/grunt-teams/nonexistent-team/damage/bulk",
      { gruntIds: ["grunt-1"], damage: 3, damageType: "physical" }
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
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1"], damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(403);
  });

  it("should return 400 when gruntIds is missing", async () => {
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
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("gruntIds must be a non-empty array");
  });

  it("should return 400 when gruntIds is empty", async () => {
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
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: [], damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("gruntIds must be a non-empty array");
  });

  it("should return 400 when gruntIds is not an array", async () => {
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
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: "grunt-1", damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("gruntIds must be a non-empty array");
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
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1"], damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
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
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1"], damage: -1, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
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
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1"], damage: 3, damageType: "invalid" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("Damage type must be 'physical' or 'stun'");
  });

  it("should return 200 and apply physical damage to multiple grunts", async () => {
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
    vi.mocked(gruntRules.applyDamage)
      .mockReturnValueOnce(createDamageResult("grunt-1"))
      .mockReturnValueOnce(createDamageResult("grunt-2"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1", "grunt-2"], damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.results).toHaveLength(2);
    expect(gruntRules.applyDamage).toHaveBeenCalledTimes(2);
  });

  it("should return 200 and apply stun damage to multiple grunts", async () => {
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
    vi.mocked(gruntRules.applyDamage).mockReturnValue(createDamageResult("grunt-1"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1"], damage: 3, damageType: "stun" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    expect(gruntRules.applyDamage).toHaveBeenCalledWith(expect.anything(), 3, "stun", 9);
  });

  it("should skip unknown gruntIds without error", async () => {
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
    vi.mocked(gruntRules.applyDamage).mockReturnValue(createDamageResult("grunt-1"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1", "nonexistent-grunt"], damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.results).toHaveLength(1);
  });

  it("should skip dead grunts without error", async () => {
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
    vi.mocked(gruntRules.applyDamage).mockReturnValue(createDamageResult("grunt-2"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1", "grunt-2"], damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.results).toHaveLength(1);
    expect(data.results[0].gruntId).toBe("grunt-2");
  });

  it("should use simplified damage rules when enabled", async () => {
    const mockTeam = createMockGruntTeam({
      options: { useSimplifiedRules: true },
    });
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
    vi.mocked(gruntRules.applySimplifiedDamage).mockReturnValue(
      createDamageResult("grunt-1", { isDead: true })
    );
    vi.mocked(gruntRules.checkMorale).mockReturnValue("steady");
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1"], damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    expect(gruntRules.applySimplifiedDamage).toHaveBeenCalled();
    expect(gruntRules.applyDamage).not.toHaveBeenCalled();
  });

  it("should apply damage to lieutenant in bulk", async () => {
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
    vi.mocked(gruntRules.applyDamage).mockReturnValue(createDamageResult("lieutenant-1"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["lieutenant-1"], damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.results).toHaveLength(1);
  });

  it("should apply damage to specialist in bulk", async () => {
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
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(gruntStorage.getOrInitializeIndividualGrunts).mockResolvedValue(mockIndividuals);
    vi.mocked(gruntRules.applyDamage).mockReturnValue(createDamageResult("specialist-1"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["specialist-1"], damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.results).toHaveLength(1);
  });

  it("should trigger morale check on deaths and update team state", async () => {
    const mockTeam = createMockGruntTeam({
      state: { activeCount: 3, casualties: 3, moraleBroken: false },
    });
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
    vi.mocked(gruntRules.applyDamage)
      .mockReturnValueOnce(createDamageResult("grunt-1", { isDead: true }))
      .mockReturnValueOnce(createDamageResult("grunt-2", { isDead: true }));
    vi.mocked(gruntRules.checkMorale).mockReturnValue("broken");
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1", "grunt-2"], damage: 9, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.teamState.casualties).toBe(5);
    expect(data.teamState.activeCount).toBe(1);
    expect(data.teamState.moraleBroken).toBe(true);
    expect(gruntRules.checkMorale).toHaveBeenCalled();
  });

  it("should save all individual grunt states after bulk damage", async () => {
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
    vi.mocked(gruntRules.applyDamage).mockReturnValue(createDamageResult("grunt-1"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1", "grunt-2"], damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(200);
    expect(gruntStorage.saveIndividualGrunts).toHaveBeenCalledWith(
      "test-team-id",
      "test-campaign-id",
      expect.anything()
    );
  });

  it("should return 500 on internal error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const mockTeam = createMockGruntTeam();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(gruntStorage.getGruntTeam).mockResolvedValue(mockTeam);
    vi.mocked(campaignAuth.authorizeCampaign).mockRejectedValue(new Error("Database error"));
    const request = createMockRequest(
      "http://localhost:3000/api/grunt-teams/test-team-id/damage/bulk",
      { gruntIds: ["grunt-1"], damage: 3, damageType: "physical" }
    );
    const response = await POST(request, { params: Promise.resolve({ teamId: "test-team-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
