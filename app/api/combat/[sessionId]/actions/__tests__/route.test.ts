/**
 * Tests for /api/combat/[sessionId]/actions endpoint
 *
 * Tests available actions retrieval (GET) and action execution (POST)
 * including action economy, validation, dice rolling, and damage application.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as combatModule from "@/lib/storage/combat";
import * as charactersModule from "@/lib/storage/characters";
import * as loaderModule from "@/lib/rules/loader";
import * as actionResolutionModule from "@/lib/rules/action-resolution";
import * as combatRulesModule from "@/lib/rules/action-resolution/combat";
import type {
  User,
  CombatSession,
  CombatParticipant,
  Character,
  ActionDefinition,
} from "@/lib/types";
import type { LoadedRuleset } from "@/lib/rules/loader-types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/combat");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/loader");
vi.mock("@/lib/rules/action-resolution");
vi.mock("@/lib/rules/action-resolution/combat");

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = "GET"): NextRequest {
  const headers = new Headers();
  if (body) {
    headers.set("Content-Type", "application/json");
  }

  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

// Mock data factories
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "mock-hash",
    role: ["user"],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    emailVerified: true,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
    ...overrides,
  };
}

function createMockParticipant(overrides?: Partial<CombatParticipant>): CombatParticipant {
  return {
    id: "test-participant-id",
    type: "character",
    entityId: "test-character-id",
    name: "Test Character",
    initiativeScore: 10,
    initiativeDice: [4],
    actionsRemaining: { free: 999, simple: 2, complex: 1, interrupt: true },
    interruptsPending: [],
    status: "active",
    controlledBy: "test-user-id",
    isGMControlled: false,
    woundModifier: 0,
    conditions: [],
    ...overrides,
  };
}

function createMockCombatSession(overrides?: Partial<CombatSession>): CombatSession {
  return {
    id: "test-session-id",
    ownerId: "test-user-id",
    editionCode: "sr5",
    participants: [],
    initiativeOrder: [],
    currentTurn: 0,
    currentPhase: "action",
    round: 1,
    status: "active",
    environment: {
      visibility: "normal",
      weather: "clear",
      terrain: "urban",
      backgroundCount: 0,
      noise: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockCharacter(overrides?: Partial<Character>): Character {
  return {
    id: "test-character-id",
    ownerId: "test-user-id",
    editionId: "test-edition-id",
    editionCode: "sr5",
    creationMethodId: "test-creation-method-id",
    rulesetSnapshotId: "test-snapshot-id",
    attachedBookIds: [],
    name: "Test Character",
    metatype: "Human",
    status: "active",
    attributes: {
      agility: 4,
      reaction: 4,
      intuition: 3,
      strength: 3,
      body: 3,
      willpower: 3,
      logic: 3,
      charisma: 3,
    },
    specialAttributes: {
      edge: 1,
      essence: 6,
    },
    skills: {
      firearms: 4,
    },
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 0,
    startingNuyen: 0,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
    },
    karmaTotal: 0,
    karmaCurrent: 0,
    karmaSpentAtCreation: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockAction(overrides?: Partial<ActionDefinition>): ActionDefinition {
  return {
    id: "test-action",
    name: "Test Action",
    description: "A test action",
    type: "simple",
    domain: "combat",
    cost: { actionType: "simple" },
    prerequisites: [],
    modifiers: [],
    ...overrides,
  } as ActionDefinition;
}

function createMockRuleset(): LoadedRuleset {
  return {
    edition: {
      id: "sr5",
      code: "sr5",
      name: "Shadowrun 5th Edition",
      version: "1.0.0",
      releaseYear: 2013,
      supportLevel: "active",
      books: ["sr5-core"],
      creationMethods: [],
    },
    books: [
      {
        id: "sr5-core",
        title: "Core Rulebook",
        isCore: true,
        loadOrder: 1,
        payload: {
          modules: {
            actions: {
              payload: {
                combat: [
                  createMockAction({
                    id: "shoot",
                    name: "Shoot",
                    type: "simple",
                    domain: "combat",
                    cost: { actionType: "simple" },
                  }),
                  createMockAction({
                    id: "full-burst",
                    name: "Full Burst",
                    type: "complex",
                    domain: "combat",
                    cost: { actionType: "complex" },
                  }),
                ],
                general: [
                  createMockAction({
                    id: "observe",
                    name: "Observe",
                    type: "free",
                    domain: "combat",
                    cost: { actionType: "free" },
                  }),
                ],
              },
            },
          },
        },
      },
    ],
    creationMethods: [],
  } as unknown as LoadedRuleset;
}

// Route params helper
function createRouteParams(sessionId: string) {
  return { params: Promise.resolve({ sessionId }) };
}

describe("GET /api/combat/[sessionId]/actions", () => {
  const mockUser = createMockUser();
  const mockParticipant = createMockParticipant();
  const mockCharacter = createMockCharacter();
  const mockSession = createMockCombatSession({
    participants: [mockParticipant],
    initiativeOrder: [mockParticipant.id],
  });
  const mockRuleset = createMockRuleset();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(actionResolutionModule.canPerformAction).mockReturnValue(true);
    vi.mocked(actionResolutionModule.getActionBlockers).mockReturnValue([]);
  });

  it("should return available actions for current participant", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/actions");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.participantId).toBe(mockParticipant.id);
    expect(data.participantName).toBe("Test Character");
    expect(data.actionsRemaining).toEqual(mockParticipant.actionsRemaining);
    expect(data.available).toBeDefined();
    expect(data.unavailable).toBeDefined();
  });

  it("should return actions for specific participant", async () => {
    const specificParticipant = createMockParticipant({
      id: "specific-participant",
      name: "Specific Character",
    });
    const sessionWithMultiple = createMockCombatSession({
      participants: [mockParticipant, specificParticipant],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(sessionWithMultiple);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions?participantId=specific-participant"
    );
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.participantId).toBe("specific-participant");
    expect(data.participantName).toBe("Specific Character");
  });

  it("should filter actions by category", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions?category=combat"
    );
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Only combat actions should be included
    const allActions = [...data.available, ...data.unavailable];
    expect(allActions.every((a: ActionDefinition) => a.domain === "combat" || !a.domain)).toBe(
      true
    );
  });

  it("should mark actions unavailable when no actions remaining", async () => {
    const participantWithNoSimple = createMockParticipant({
      actionsRemaining: { free: 999, simple: 0, complex: 0, interrupt: true },
    });
    const sessionWithExhausted = createMockCombatSession({
      participants: [participantWithNoSimple],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(sessionWithExhausted);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(participantWithNoSimple);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/actions");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    // Simple and complex actions should be unavailable
    const unavailableSimple = data.unavailable.find(
      (a: ActionDefinition & { blockers: string[] }) =>
        a.id === "shoot" && a.blockers.includes("No simple actions remaining")
    );
    expect(unavailableSimple).toBeDefined();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/actions");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when session not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/nonexistent-session/actions"
    );
    const response = await GET(request, createRouteParams("nonexistent-session"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Combat session not found");
  });

  it("should return 403 when user is not the owner", async () => {
    const otherUserSession = createMockCombatSession({ ownerId: "other-user-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(otherUserSession);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/actions");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Access denied");
  });

  it("should return 404 when participant not found", async () => {
    const emptySession = createMockCombatSession({ participants: [] });
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(emptySession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/actions");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Participant not found");
  });

  it("should return 500 when ruleset fails to load", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: false,
      error: "Failed to load",
    });

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/actions");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to load ruleset");
  });

  it("should return 500 on exception", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/actions");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get available actions");

    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/combat/[sessionId]/actions", () => {
  const mockUser = createMockUser();
  const mockParticipant = createMockParticipant();
  const mockCharacter = createMockCharacter();
  const mockSession = createMockCombatSession({
    participants: [mockParticipant],
    initiativeOrder: [mockParticipant.id],
    status: "active",
  });
  const mockRuleset = createMockRuleset();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(actionResolutionModule.validateAction).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(actionResolutionModule.consumeAction).mockReturnValue({
      free: 999,
      simple: 1,
      complex: 1,
      interrupt: true,
    });
    vi.mocked(actionResolutionModule.calculateStateModifiers).mockReturnValue([]);
    vi.mocked(actionResolutionModule.buildActionPool).mockReturnValue({
      basePool: 8,
      totalDice: 8,
      attribute: "agility",
      skill: "firearms",
      modifiers: [],
    });
    vi.mocked(actionResolutionModule.executeRoll).mockReturnValue({
      dice: [
        { value: 5, isHit: true, isOne: false },
        { value: 6, isHit: true, isOne: false },
        { value: 3, isHit: false, isOne: false },
        { value: 4, isHit: false, isOne: false },
      ],
      hits: 2,
      rawHits: 2,
      ones: 0,
      isGlitch: false,
      isCriticalGlitch: false,
      limitApplied: false,
      poolSize: 8,
    });
  });

  it("should execute action and consume action economy", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.updateParticipantActions).mockResolvedValue(mockParticipant);

    const requestBody = {
      actionId: "shoot",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.action).toBeDefined();
    expect(data.action.id).toBe("shoot");
    expect(data.actionsRemaining).toBeDefined();
    expect(combatModule.updateParticipantActions).toHaveBeenCalled();
  });

  it("should execute action for specific participant", async () => {
    const specificParticipant = createMockParticipant({
      id: "specific-participant",
      name: "Specific Character",
    });
    const sessionWithMultiple = createMockCombatSession({
      participants: [mockParticipant, specificParticipant],
      status: "active",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(sessionWithMultiple);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.updateParticipantActions).mockResolvedValue(mockParticipant);

    const requestBody = {
      actionId: "shoot",
      participantId: "specific-participant",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.participant.id).toBe("specific-participant");
  });

  it("should return roll results with dice and hits", async () => {
    const actionWithRoll = createMockAction({
      id: "shoot-with-roll",
      name: "Shoot with Roll",
      type: "simple",
      cost: { actionType: "simple" },
      rollConfig: {
        attribute: "agility",
        skill: "firearms",
        limitType: "physical",
      },
    });

    const rulesetWithRoll = {
      ...mockRuleset,
      books: [
        {
          ...mockRuleset.books[0],
          payload: {
            modules: {
              actions: {
                payload: {
                  combat: [actionWithRoll],
                },
              },
            },
          },
        },
      ],
    } as unknown as LoadedRuleset;

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: rulesetWithRoll,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.updateParticipantActions).mockResolvedValue(mockParticipant);

    const requestBody = {
      actionId: "shoot-with-roll",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.roll).toBeDefined();
    expect(data.roll.dice).toEqual([5, 6, 3, 4]);
    expect(data.roll.hits).toBe(2);
    expect(data.roll.glitch.isGlitch).toBe(false);
  });

  it("should return 400 when actionId is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);

    const requestBody = {};

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Missing required field: actionId");
  });

  it("should return 404 when action not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);

    const requestBody = {
      actionId: "nonexistent-action",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Action not found");
  });

  it("should return 400 when session is not active", async () => {
    const pausedSession = createMockCombatSession({
      participants: [mockParticipant],
      status: "paused",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(pausedSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);

    const requestBody = {
      actionId: "shoot",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Combat session is not active");
  });

  it("should return 400 when participant cannot act", async () => {
    const outParticipant = createMockParticipant({ status: "out" });
    const sessionWithOut = createMockCombatSession({
      participants: [outParticipant],
      status: "active",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(sessionWithOut);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(outParticipant);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);

    const requestBody = {
      actionId: "shoot",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Participant cannot act");
  });

  it("should return 400 when validation fails", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(actionResolutionModule.validateAction).mockReturnValue({
      valid: false,
      errors: [{ code: "MISSING_WEAPON", message: "Missing required weapon" }],
      warnings: [],
    });

    const requestBody = {
      actionId: "shoot",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Action validation failed");
    expect(data.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ message: "Missing required weapon" })])
    );
  });

  it("should return 400 when no actions remaining", async () => {
    const exhaustedParticipant = createMockParticipant({
      actionsRemaining: { free: 999, simple: 0, complex: 0, interrupt: true },
    });
    const sessionWithExhausted = createMockCombatSession({
      participants: [exhaustedParticipant],
      status: "active",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(sessionWithExhausted);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(exhaustedParticipant);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    // consumeAction returns same allocation when action cannot be consumed
    vi.mocked(actionResolutionModule.consumeAction).mockReturnValue({
      free: 999,
      simple: 0,
      complex: 0,
      interrupt: true,
    });

    const requestBody = {
      actionId: "shoot",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("No simple actions remaining");
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const requestBody = {
      actionId: "shoot",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 403 when user is not the owner", async () => {
    const otherUserSession = createMockCombatSession({
      ownerId: "other-user-id",
      status: "active",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(otherUserSession);

    const requestBody = {
      actionId: "shoot",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Access denied");
  });

  it("should return 500 on exception", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockRejectedValue(new Error("Database error"));

    const requestBody = {
      actionId: "shoot",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/actions",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to execute action");

    consoleErrorSpy.mockRestore();
  });
});
