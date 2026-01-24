/**
 * Tests for /api/combat/[sessionId]/participants endpoint
 *
 * Tests participant listing (GET) and adding (POST) functionality
 * including authentication, authorization, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as combatModule from "@/lib/storage/combat";
import * as charactersModule from "@/lib/storage/characters";
import type { User, CombatSession, CombatParticipant, Character } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/combat");
vi.mock("@/lib/storage/characters");

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
    sessionSecretHash: null,
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
    currentPhase: "initiative",
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
    status: "draft",
    attributes: {},
    specialAttributes: {
      edge: 1,
      essence: 6,
    },
    skills: {},
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

// Route params helper
function createRouteParams(sessionId: string) {
  return { params: Promise.resolve({ sessionId }) };
}

describe("GET /api/combat/[sessionId]/participants", () => {
  const mockUser = createMockUser();
  const mockParticipant = createMockParticipant();
  const mockSession = createMockCombatSession({
    participants: [mockParticipant],
    initiativeOrder: [mockParticipant.id],
    currentTurn: 0,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return participants list with initiative order", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants"
    );
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.participants).toHaveLength(1);
    expect(data.initiativeOrder).toEqual([mockParticipant.id]);
    expect(data.currentTurn).toBe(0);
    expect(data.currentParticipantId).toBe(mockParticipant.id);
  });

  it("should return null currentParticipantId when no participants", async () => {
    const emptySession = createMockCombatSession({ participants: [], initiativeOrder: [] });
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(emptySession);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants"
    );
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.participants).toHaveLength(0);
    expect(data.currentParticipantId).toBeUndefined();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants"
    );
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
      "http://localhost:3000/api/combat/nonexistent-session/participants"
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

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants"
    );
    const response = await GET(request, createRouteParams("test-session-id"));
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

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants"
    );
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get participants");

    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/combat/[sessionId]/participants", () => {
  const mockUser = createMockUser();
  const mockSession = createMockCombatSession();
  const mockCharacter = createMockCharacter();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add a character participant with name resolved from character", async () => {
    const newParticipant = createMockParticipant({ id: "new-participant-id" });
    const updatedSession = createMockCombatSession({
      participants: [newParticipant],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(updatedSession);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(updatedSession);

    const requestBody = {
      type: "character",
      entityId: "test-character-id",
      initiativeScore: 15,
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.participant).toBeDefined();
    expect(data.message).toContain("Test Character");
    expect(combatModule.addParticipant).toHaveBeenCalledWith(
      "test-session-id",
      expect.objectContaining({
        type: "character",
        entityId: "test-character-id",
        name: "Test Character",
      })
    );
  });

  it("should add a participant with custom name", async () => {
    const newParticipant = createMockParticipant({ id: "new-participant-id", name: "Custom Name" });
    const updatedSession = createMockCombatSession({
      participants: [newParticipant],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(updatedSession);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(updatedSession);

    const requestBody = {
      type: "npc",
      entityId: "test-npc-id",
      name: "Custom Name",
      initiativeScore: 12,
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(combatModule.addParticipant).toHaveBeenCalledWith(
      "test-session-id",
      expect.objectContaining({
        name: "Custom Name",
      })
    );
  });

  it("should set initiative score after adding participant", async () => {
    const newParticipant = createMockParticipant({ id: "new-participant-id" });
    const updatedSession = createMockCombatSession({
      participants: [newParticipant],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(updatedSession);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(updatedSession);

    const requestBody = {
      type: "character",
      entityId: "test-character-id",
      initiativeScore: 15,
      initiativeDice: [4, 5, 6],
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    await POST(request, createRouteParams("test-session-id"));

    expect(combatModule.setInitiativeScore).toHaveBeenCalledWith(
      "test-session-id",
      "new-participant-id",
      15,
      [4, 5, 6]
    );
  });

  it("should add GM-controlled participant", async () => {
    const newParticipant = createMockParticipant({
      id: "new-participant-id",
      isGMControlled: true,
    });
    const updatedSession = createMockCombatSession({
      participants: [newParticipant],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(updatedSession);

    const requestBody = {
      type: "grunt",
      entityId: "test-grunt-id",
      name: "Grunt Team",
      isGMControlled: true,
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(combatModule.addParticipant).toHaveBeenCalledWith(
      "test-session-id",
      expect.objectContaining({
        isGMControlled: true,
        controlledBy: mockUser.id,
      })
    );
  });

  it("should return 400 when type is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const requestBody = {
      entityId: "test-entity-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Missing required fields: type, entityId");
  });

  it("should return 400 when entityId is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const requestBody = {
      type: "character",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Missing required fields: type, entityId");
  });

  it("should return 400 when type is invalid", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const requestBody = {
      type: "invalid-type",
      entityId: "test-entity-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Invalid type");
  });

  it("should return 400 when entity is already participating", async () => {
    const existingParticipant = createMockParticipant({
      type: "character",
      entityId: "test-character-id",
    });
    const sessionWithParticipant = createMockCombatSession({
      participants: [existingParticipant],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(sessionWithParticipant);

    const requestBody = {
      type: "character",
      entityId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Entity is already participating in this combat");
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const requestBody = {
      type: "character",
      entityId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
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
    const otherUserSession = createMockCombatSession({ ownerId: "other-user-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(otherUserSession);

    const requestBody = {
      type: "character",
      entityId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Access denied");
  });

  it("should return 500 when addParticipant fails", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(null);

    const requestBody = {
      type: "character",
      entityId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to add participant");
  });

  it("should return 500 on exception", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockRejectedValue(new Error("Database error"));

    const requestBody = {
      type: "character",
      entityId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to add participant");

    consoleErrorSpy.mockRestore();
  });
});
