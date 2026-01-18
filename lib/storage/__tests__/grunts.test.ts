/**
 * Unit tests for grunts.ts storage module
 *
 * Tests grunt team CRUD and combat state operations with VI mocks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type {
  GruntTeam,
  CreateGruntTeamRequest,
  IndividualGrunts,
  ProfessionalRating,
} from "@/lib/types/grunts";

// Mock the base storage module
vi.mock("../base", () => {
  const storage = new Map<string, unknown>();
  return {
    ensureDirectory: vi.fn().mockResolvedValue(undefined),
    readJsonFile: vi
      .fn()
      .mockImplementation((path: string) => Promise.resolve(storage.get(path) || null)),
    writeJsonFile: vi.fn().mockImplementation((path: string, data: unknown) => {
      storage.set(path, data);
      return Promise.resolve();
    }),
    deleteFile: vi.fn().mockImplementation((path: string) => {
      const existed = storage.has(path);
      storage.delete(path);
      return Promise.resolve(existed);
    }),
    listJsonFiles: vi.fn().mockImplementation(() => {
      const ids: string[] = [];
      for (const key of storage.keys()) {
        if (key.includes("grunt-teams") && key.endsWith(".json") && !key.includes(".combat")) {
          const match = key.match(/\/([^/]+)\.json$/);
          if (match) ids.push(match[1]);
        }
      }
      return Promise.resolve(ids);
    }),
    readAllJsonFiles: vi.fn().mockResolvedValue([]),
    __storage: storage,
    __clearStorage: () => storage.clear(),
  };
});

// Import after mocking
import * as gruntStorage from "../grunts";
import * as base from "../base";

// =============================================================================
// TEST FIXTURES
// =============================================================================

const TEST_CAMPAIGN_ID = "test-campaign";

function createMockGruntTeamRequest(
  overrides: Partial<CreateGruntTeamRequest> = {}
): CreateGruntTeamRequest {
  return {
    name: "Street Gang",
    description: "A group of street toughs",
    professionalRating: 1 as ProfessionalRating,
    initialSize: 4,
    baseGrunts: {
      attributes: {
        body: 3,
        agility: 3,
        reaction: 3,
        strength: 3,
        willpower: 2,
        logic: 2,
        intuition: 3,
        charisma: 2,
      },
      essence: 6,
      skills: {
        firearms: 2,
        "unarmed combat": 2,
      },
      gear: [],
      weapons: [],
      armor: [],
      conditionMonitorSize: 10,
    },
    ...overrides,
  };
}

function createMockGruntTeam(overrides: Partial<GruntTeam> = {}): GruntTeam {
  return {
    id: `team-${Date.now()}`,
    campaignId: TEST_CAMPAIGN_ID,
    name: "Street Gang",
    description: "A group of street toughs",
    professionalRating: 1 as ProfessionalRating,
    groupEdge: 1,
    groupEdgeMax: 1,
    initialSize: 4,
    baseGrunts: {
      attributes: {
        body: 3,
        agility: 3,
        reaction: 3,
        strength: 3,
        willpower: 2,
        logic: 2,
        intuition: 3,
        charisma: 2,
      },
      essence: 6,
      skills: {
        firearms: 2,
        "unarmed combat": 2,
      },
      gear: [],
      weapons: [],
      armor: [],
      conditionMonitorSize: 10,
    },
    state: {
      activeCount: 4,
      casualties: 0,
      moraleBroken: false,
    },
    visibility: { showToPlayers: false },
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// =============================================================================
// SETUP
// =============================================================================

beforeEach(() => {
  vi.clearAllMocks();
  const baseMock = base as typeof base & { __clearStorage: () => void };
  baseMock.__clearStorage();
});

// =============================================================================
// CREATE GRUNT TEAM TESTS
// =============================================================================

describe("createGruntTeam", () => {
  it("should create a new grunt team with generated ID", async () => {
    const request = createMockGruntTeamRequest();

    const result = await gruntStorage.createGruntTeam(TEST_CAMPAIGN_ID, request);

    expect(result.id).toBeDefined();
    expect(result.campaignId).toBe(TEST_CAMPAIGN_ID);
    expect(result.name).toBe("Street Gang");
    expect(result.professionalRating).toBe(1);
  });

  it("should set groupEdge equal to professional rating", async () => {
    const request = createMockGruntTeamRequest({ professionalRating: 3 as ProfessionalRating });

    const result = await gruntStorage.createGruntTeam(TEST_CAMPAIGN_ID, request);

    expect(result.groupEdge).toBe(3);
    expect(result.groupEdgeMax).toBe(3);
  });

  it("should initialize team state", async () => {
    const request = createMockGruntTeamRequest({ initialSize: 6 });

    const result = await gruntStorage.createGruntTeam(TEST_CAMPAIGN_ID, request);

    expect(result.state.activeCount).toBe(6);
    expect(result.state.casualties).toBe(0);
    expect(result.state.moraleBroken).toBe(false);
  });

  it("should process specialists with generated IDs", async () => {
    const request = createMockGruntTeamRequest({
      specialists: [
        { type: "Sniper", description: "Long-range specialist" },
        { type: "Heavy", description: "Machine gunner" },
      ],
    });

    const result = await gruntStorage.createGruntTeam(TEST_CAMPAIGN_ID, request);

    expect(result.specialists).toHaveLength(2);
    expect(result.specialists![0].id).toBeDefined();
    expect(result.specialists![1].id).toBeDefined();
    expect(result.specialists![0].id).not.toBe(result.specialists![1].id);
  });

  it("should set createdAt timestamp", async () => {
    const beforeTime = new Date().toISOString();

    const result = await gruntStorage.createGruntTeam(
      TEST_CAMPAIGN_ID,
      createMockGruntTeamRequest()
    );

    const afterTime = new Date().toISOString();

    expect(result.createdAt >= beforeTime).toBe(true);
    expect(result.createdAt <= afterTime).toBe(true);
  });
});

// =============================================================================
// GET GRUNT TEAM TESTS
// =============================================================================

describe("getGruntTeam", () => {
  it("should return team by ID with campaignId", async () => {
    const team = createMockGruntTeam({ id: "team-123" });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);

    const result = await gruntStorage.getGruntTeam("team-123", TEST_CAMPAIGN_ID);

    expect(result).toEqual(team);
  });

  it("should return null for non-existent team", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await gruntStorage.getGruntTeam("non-existent", TEST_CAMPAIGN_ID);

    expect(result).toBeNull();
  });
});

// =============================================================================
// UPDATE GRUNT TEAM TESTS
// =============================================================================

describe("updateGruntTeam", () => {
  it("should update team properties", async () => {
    const team = createMockGruntTeam({ id: "team-123" });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);

    const result = await gruntStorage.updateGruntTeam(
      "team-123",
      { name: "Updated Gang", description: "New description" },
      TEST_CAMPAIGN_ID
    );

    expect(result.name).toBe("Updated Gang");
    expect(result.description).toBe("New description");
    expect(result.updatedAt).toBeDefined();
  });

  it("should preserve immutable fields", async () => {
    const team = createMockGruntTeam({ id: "team-123", createdAt: "2024-01-01T00:00:00Z" });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);

    const result = await gruntStorage.updateGruntTeam(
      "team-123",
      { id: "different-id", campaignId: "different-campaign" } as Partial<GruntTeam>,
      TEST_CAMPAIGN_ID
    );

    expect(result.id).toBe("team-123");
    expect(result.campaignId).toBe(TEST_CAMPAIGN_ID);
    expect(result.createdAt).toBe("2024-01-01T00:00:00Z");
  });

  it("should recalculate groupEdgeMax when PR changes", async () => {
    const team = createMockGruntTeam({
      id: "team-123",
      professionalRating: 2 as ProfessionalRating,
      groupEdge: 2,
      groupEdgeMax: 2,
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);

    const result = await gruntStorage.updateGruntTeam(
      "team-123",
      { professionalRating: 4 as ProfessionalRating },
      TEST_CAMPAIGN_ID
    );

    expect(result.professionalRating).toBe(4);
    expect(result.groupEdgeMax).toBe(4);
  });

  it("should cap groupEdge to new groupEdgeMax", async () => {
    const team = createMockGruntTeam({
      id: "team-123",
      professionalRating: 4 as ProfessionalRating,
      groupEdge: 4,
      groupEdgeMax: 4,
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);

    const result = await gruntStorage.updateGruntTeam(
      "team-123",
      { professionalRating: 2 as ProfessionalRating },
      TEST_CAMPAIGN_ID
    );

    expect(result.groupEdge).toBe(2);
    expect(result.groupEdgeMax).toBe(2);
  });

  it("should throw error for non-existent team", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    await expect(
      gruntStorage.updateGruntTeam("non-existent", { name: "New Name" }, TEST_CAMPAIGN_ID)
    ).rejects.toThrow(/not found/);
  });
});

// =============================================================================
// DELETE GRUNT TEAM TESTS
// =============================================================================

describe("deleteGruntTeam", () => {
  it("should delete team and return true", async () => {
    const team = createMockGruntTeam({ id: "team-123" });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);
    vi.mocked(base.deleteFile).mockResolvedValue(true);

    const result = await gruntStorage.deleteGruntTeam("team-123", TEST_CAMPAIGN_ID);

    expect(result).toBe(true);
    expect(base.deleteFile).toHaveBeenCalled();
  });

  it("should return false for non-existent team", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await gruntStorage.deleteGruntTeam("non-existent", TEST_CAMPAIGN_ID);

    expect(result).toBe(false);
  });

  it("should also delete combat state file", async () => {
    const team = createMockGruntTeam({ id: "team-123" });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);
    vi.mocked(base.deleteFile).mockResolvedValue(true);

    await gruntStorage.deleteGruntTeam("team-123", TEST_CAMPAIGN_ID);

    expect(base.deleteFile).toHaveBeenCalledTimes(2);
  });
});

// =============================================================================
// GET GRUNT TEAMS BY CAMPAIGN TESTS
// =============================================================================

describe("getGruntTeamsByCampaign", () => {
  it("should return all teams for campaign", async () => {
    const teams = [
      createMockGruntTeam({ id: "team-1", name: "Alpha" }),
      createMockGruntTeam({ id: "team-2", name: "Bravo" }),
    ];
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(["team-1", "team-2"]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(teams[0]).mockResolvedValueOnce(teams[1]);

    const result = await gruntStorage.getGruntTeamsByCampaign(TEST_CAMPAIGN_ID);

    expect(result).toHaveLength(2);
  });

  it("should filter by Professional Rating", async () => {
    const teams = [
      createMockGruntTeam({ id: "team-1", professionalRating: 1 as ProfessionalRating }),
      createMockGruntTeam({ id: "team-2", professionalRating: 2 as ProfessionalRating }),
    ];
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(["team-1", "team-2"]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(teams[0]).mockResolvedValueOnce(teams[1]);

    const result = await gruntStorage.getGruntTeamsByCampaign(TEST_CAMPAIGN_ID, {
      professionalRating: 2 as ProfessionalRating,
    });

    expect(result).toHaveLength(1);
    expect(result[0].professionalRating).toBe(2);
  });

  it("should filter by search string", async () => {
    const teams = [
      createMockGruntTeam({ id: "team-1", name: "Street Gang", description: "Thugs" }),
      createMockGruntTeam({ id: "team-2", name: "Corporate Security", description: "Guards" }),
    ];
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(["team-1", "team-2"]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(teams[0]).mockResolvedValueOnce(teams[1]);

    const result = await gruntStorage.getGruntTeamsByCampaign(TEST_CAMPAIGN_ID, {
      search: "street",
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Street Gang");
  });

  it("should filter by encounterId", async () => {
    const teams = [
      createMockGruntTeam({ id: "team-1", encounterId: "encounter-1" }),
      createMockGruntTeam({ id: "team-2", encounterId: "encounter-2" }),
    ];
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(["team-1", "team-2"]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(teams[0]).mockResolvedValueOnce(teams[1]);

    const result = await gruntStorage.getGruntTeamsByCampaign(TEST_CAMPAIGN_ID, {
      encounterId: "encounter-1",
    });

    expect(result).toHaveLength(1);
    expect(result[0].encounterId).toBe("encounter-1");
  });

  it("should sort by name", async () => {
    const teams = [
      createMockGruntTeam({ id: "team-1", name: "Zulu Squad" }),
      createMockGruntTeam({ id: "team-2", name: "Alpha Team" }),
    ];
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(["team-1", "team-2"]);
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(teams[0]).mockResolvedValueOnce(teams[1]);

    const result = await gruntStorage.getGruntTeamsByCampaign(TEST_CAMPAIGN_ID);

    expect(result[0].name).toBe("Alpha Team");
    expect(result[1].name).toBe("Zulu Squad");
  });
});

// =============================================================================
// GET GRUNT TEAMS BY ENCOUNTER TESTS
// =============================================================================

describe("getGruntTeamsByEncounter", () => {
  it("should return teams linked to encounter", async () => {
    const teams = [
      createMockGruntTeam({ id: "team-1", encounterId: "encounter-1" }),
      createMockGruntTeam({ id: "team-2", encounterId: "encounter-1" }),
      createMockGruntTeam({ id: "team-3", encounterId: "encounter-2" }),
    ];
    vi.mocked(base.listJsonFiles).mockResolvedValueOnce(["team-1", "team-2", "team-3"]);
    vi.mocked(base.readJsonFile)
      .mockResolvedValueOnce(teams[0])
      .mockResolvedValueOnce(teams[1])
      .mockResolvedValueOnce(teams[2]);

    const result = await gruntStorage.getGruntTeamsByEncounter("encounter-1", TEST_CAMPAIGN_ID);

    expect(result).toHaveLength(2);
  });
});

// =============================================================================
// INITIALIZE INDIVIDUAL GRUNTS TESTS
// =============================================================================

describe("initializeIndividualGrunts", () => {
  it("should create individual grunt records", () => {
    const team = createMockGruntTeam({ initialSize: 3 });

    const result = gruntStorage.initializeIndividualGrunts(team);

    expect(Object.keys(result.grunts)).toHaveLength(3);
    Object.values(result.grunts).forEach((grunt) => {
      expect(grunt.id).toBeDefined();
      expect(grunt.conditionMonitor).toHaveLength(10);
      expect(grunt.currentDamage).toBe(0);
      expect(grunt.isStunned).toBe(false);
      expect(grunt.isDead).toBe(false);
    });
  });

  it("should create lieutenant record if present", () => {
    const team = createMockGruntTeam({
      lieutenant: {
        attributes: {
          body: 4,
          agility: 4,
          reaction: 4,
          strength: 4,
          willpower: 4,
          logic: 3,
          intuition: 4,
          charisma: 3,
        },
        essence: 6,
        skills: {},
        gear: [],
        weapons: [],
        armor: [],
        conditionMonitorSize: 11,
        canBoostProfessionalRating: true,
        usesIndividualInitiative: true,
      },
    });

    const result = gruntStorage.initializeIndividualGrunts(team);

    expect(result.lieutenant).toBeDefined();
    expect(result.lieutenant!.id).toBeDefined();
    expect(result.lieutenant!.conditionMonitor).toHaveLength(11);
  });

  it("should create specialist records if present", () => {
    const team = createMockGruntTeam({
      specialists: [
        { id: "spec-1", type: "Sniper", description: "Long-range marksman" },
        { id: "spec-2", type: "Heavy", description: "Heavy weapons specialist" },
      ],
    });

    const result = gruntStorage.initializeIndividualGrunts(team);

    expect(result.specialists).toBeDefined();
    expect(Object.keys(result.specialists!)).toHaveLength(2);
    expect(result.specialists!["spec-1"]).toBeDefined();
    expect(result.specialists!["spec-2"]).toBeDefined();
  });
});

// =============================================================================
// GET/SAVE INDIVIDUAL GRUNTS TESTS
// =============================================================================

describe("getIndividualGrunts", () => {
  it("should return null if not initialized", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    const result = await gruntStorage.getIndividualGrunts("team-123", TEST_CAMPAIGN_ID);

    expect(result).toBeNull();
  });

  it("should return existing combat state", async () => {
    const combatState: IndividualGrunts = {
      grunts: {
        "grunt-1": {
          id: "grunt-1",
          conditionMonitor: [],
          currentDamage: 0,
          isStunned: false,
          isDead: false,
        },
      },
    };
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(combatState);

    const result = await gruntStorage.getIndividualGrunts("team-123", TEST_CAMPAIGN_ID);

    expect(result).toEqual(combatState);
  });
});

describe("saveIndividualGrunts", () => {
  it("should save combat state", async () => {
    const combatState: IndividualGrunts = {
      grunts: {
        "grunt-1": {
          id: "grunt-1",
          conditionMonitor: [],
          currentDamage: 0,
          isStunned: false,
          isDead: false,
        },
      },
    };

    await gruntStorage.saveIndividualGrunts("team-123", TEST_CAMPAIGN_ID, combatState);

    expect(base.writeJsonFile).toHaveBeenCalled();
  });
});

// =============================================================================
// UPDATE INDIVIDUAL GRUNT TESTS
// =============================================================================

describe("updateIndividualGrunt", () => {
  it("should update grunt in grunts collection", async () => {
    const combatState: IndividualGrunts = {
      grunts: {
        "grunt-1": {
          id: "grunt-1",
          conditionMonitor: [false, false],
          currentDamage: 0,
          isStunned: false,
          isDead: false,
        },
      },
    };
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(combatState);

    const result = await gruntStorage.updateIndividualGrunt(
      "team-123",
      TEST_CAMPAIGN_ID,
      "grunt-1",
      { currentDamage: 5, isStunned: true }
    );

    expect(result.currentDamage).toBe(5);
    expect(result.isStunned).toBe(true);
  });

  it("should update lieutenant", async () => {
    const combatState: IndividualGrunts = {
      grunts: {},
      lieutenant: {
        id: "lt-1",
        conditionMonitor: [],
        currentDamage: 0,
        isStunned: false,
        isDead: false,
      },
    };
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(combatState);

    const result = await gruntStorage.updateIndividualGrunt("team-123", TEST_CAMPAIGN_ID, "lt-1", {
      isDead: true,
    });

    expect(result.isDead).toBe(true);
  });

  it("should throw error if grunt not found", async () => {
    const combatState: IndividualGrunts = { grunts: {} };
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(combatState);

    await expect(
      gruntStorage.updateIndividualGrunt("team-123", TEST_CAMPAIGN_ID, "non-existent", {})
    ).rejects.toThrow(/not found/);
  });

  it("should throw error if combat state not initialized", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    await expect(
      gruntStorage.updateIndividualGrunt("team-123", TEST_CAMPAIGN_ID, "grunt-1", {})
    ).rejects.toThrow(/not initialized/);
  });
});

// =============================================================================
// UPDATE GRUNT TEAM STATE TESTS
// =============================================================================

describe("updateGruntTeamState", () => {
  it("should update team combat state", async () => {
    const team = createMockGruntTeam({ id: "team-123" });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);

    const result = await gruntStorage.updateGruntTeamState(
      "team-123",
      { casualties: 2, activeCount: 2 },
      TEST_CAMPAIGN_ID
    );

    expect(result.state.casualties).toBe(2);
    expect(result.state.activeCount).toBe(2);
  });
});

// =============================================================================
// SPEND/REFRESH GROUP EDGE TESTS
// =============================================================================

describe("spendGroupEdge", () => {
  it("should spend edge from pool", async () => {
    const team = createMockGruntTeam({ id: "team-123", groupEdge: 3 });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);

    const result = await gruntStorage.spendGroupEdge("team-123", 2, TEST_CAMPAIGN_ID);

    expect(result.groupEdge).toBe(1);
  });

  it("should throw error if insufficient edge", async () => {
    const team = createMockGruntTeam({ id: "team-123", groupEdge: 1 });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);

    await expect(gruntStorage.spendGroupEdge("team-123", 3, TEST_CAMPAIGN_ID)).rejects.toThrow(
      /Insufficient Group Edge/
    );
  });
});

describe("refreshGroupEdge", () => {
  it("should refresh edge to maximum", async () => {
    const team = createMockGruntTeam({ id: "team-123", groupEdge: 1, groupEdgeMax: 4 });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);

    const result = await gruntStorage.refreshGroupEdge("team-123", TEST_CAMPAIGN_ID);

    expect(result.groupEdge).toBe(4);
  });
});

// =============================================================================
// RESET COMBAT STATE TESTS
// =============================================================================

describe("resetCombatState", () => {
  it("should reset team state for new encounter", async () => {
    const team = createMockGruntTeam({
      id: "team-123",
      groupEdge: 1,
      groupEdgeMax: 3,
      state: { activeCount: 2, casualties: 2, moraleBroken: true },
    });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(team);

    const result = await gruntStorage.resetCombatState("team-123", TEST_CAMPAIGN_ID);

    expect(result.groupEdge).toBe(3);
    expect(result.state.activeCount).toBe(team.initialSize);
    expect(result.state.casualties).toBe(0);
    expect(result.state.moraleBroken).toBe(false);
  });
});

// =============================================================================
// DUPLICATE GRUNT TEAM TESTS
// =============================================================================

describe("duplicateGruntTeam", () => {
  it("should create copy with new ID", async () => {
    const original = createMockGruntTeam({ id: "original-team", name: "Original" });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(original);

    const result = await gruntStorage.duplicateGruntTeam(
      "original-team",
      undefined,
      TEST_CAMPAIGN_ID
    );

    expect(result.id).not.toBe("original-team");
    expect(result.name).toBe("Copy of Original");
    expect(result.campaignId).toBe(TEST_CAMPAIGN_ID);
  });

  it("should use custom name if provided", async () => {
    const original = createMockGruntTeam({ id: "original-team", name: "Original" });
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(original);

    const result = await gruntStorage.duplicateGruntTeam(
      "original-team",
      "New Name",
      TEST_CAMPAIGN_ID
    );

    expect(result.name).toBe("New Name");
  });

  it("should throw error if original not found", async () => {
    vi.mocked(base.readJsonFile).mockResolvedValueOnce(null);

    await expect(
      gruntStorage.duplicateGruntTeam("non-existent", undefined, TEST_CAMPAIGN_ID)
    ).rejects.toThrow(/not found/);
  });
});
