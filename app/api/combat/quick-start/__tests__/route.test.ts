/**
 * Tests for /api/combat/quick-start endpoint
 *
 * Tests quick combat session creation (POST) with character already added
 * including initiative rolling, wound modifier calculation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
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
    status: "active",
    attributes: {
      reaction: 4,
      intuition: 3,
    },
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

describe("POST /api/combat/quick-start", () => {
  const mockUser = createMockUser();
  const mockCharacter = createMockCharacter();
  const mockParticipant = createMockParticipant();
  const mockSession = createMockCombatSession();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create quick combat session and roll initiative", async () => {
    const sessionWithParticipant = createMockCombatSession({
      participants: [mockParticipant],
    });
    const finalSession = { ...sessionWithParticipant, currentPhase: "action" as const };

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(finalSession);

    const requestBody = {
      characterId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.session).toBeDefined();
    expect(data.participant).toBeDefined();
    expect(data.initiative).toBeDefined();
    expect(data.initiative.base).toBe(7); // reaction(4) + intuition(3)
    expect(data.initiative.dice).toHaveLength(1);
    expect(data.message).toContain("Test Character");

    expect(combatModule.createCombatSession).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: mockUser.id,
        editionCode: "sr5",
        status: "active",
      })
    );
    expect(combatModule.updateCombatSession).toHaveBeenCalledWith(mockSession.id, {
      currentPhase: "action",
    });
  });

  it("should use character's edition if not provided", async () => {
    const characterWithEdition = createMockCharacter({ editionCode: "sr6" });
    const sessionWithParticipant = createMockCombatSession({
      participants: [mockParticipant],
      editionCode: "sr6",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(characterWithEdition);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(
      createMockCombatSession({ editionCode: "sr6" })
    );
    vi.mocked(combatModule.addParticipant).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(sessionWithParticipant);

    const requestBody = {
      characterId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    await POST(request);

    expect(combatModule.createCombatSession).toHaveBeenCalledWith(
      expect.objectContaining({
        editionCode: "sr6",
      })
    );
  });

  it("should use provided editionCode over character's edition", async () => {
    const sessionWithParticipant = createMockCombatSession({
      participants: [mockParticipant],
      editionCode: "sr4",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(
      createMockCombatSession({ editionCode: "sr4" })
    );
    vi.mocked(combatModule.addParticipant).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(sessionWithParticipant);

    const requestBody = {
      characterId: "test-character-id",
      editionCode: "sr4",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    await POST(request);

    expect(combatModule.createCombatSession).toHaveBeenCalledWith(
      expect.objectContaining({
        editionCode: "sr4",
      })
    );
  });

  it("should calculate wound modifier from character damage", async () => {
    const woundedCharacter = createMockCharacter({
      condition: {
        physicalDamage: 6, // -2 modifier (6/3)
        stunDamage: 3, // -1 modifier (3/3)
      },
    });
    const sessionWithParticipant = createMockCombatSession({
      participants: [mockParticipant],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(woundedCharacter);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(sessionWithParticipant);

    const requestBody = {
      characterId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    await POST(request);

    expect(combatModule.addParticipant).toHaveBeenCalledWith(
      mockSession.id,
      expect.objectContaining({
        woundModifier: -3, // -2 (physical) + -1 (stun)
      })
    );
  });

  it("should not roll initiative when rollInitiative is false", async () => {
    const sessionWithParticipant = createMockCombatSession({
      participants: [mockParticipant],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(sessionWithParticipant);

    const requestBody = {
      characterId: "test-character-id",
      rollInitiative: false,
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.initiative.base).toBe(7);
    expect(data.initiative.dice).toEqual([]);
    expect(data.initiative.total).toBe(7); // Just base, no dice roll
  });

  it("should use custom session name", async () => {
    const sessionWithParticipant = createMockCombatSession({
      participants: [mockParticipant],
      name: "Custom Combat Name",
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(sessionWithParticipant);

    const requestBody = {
      characterId: "test-character-id",
      name: "Custom Combat Name",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    await POST(request);

    expect(combatModule.createCombatSession).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Custom Combat Name",
      })
    );
  });

  it("should apply custom environment", async () => {
    const sessionWithParticipant = createMockCombatSession({
      participants: [mockParticipant],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(sessionWithParticipant);

    const requestBody = {
      characterId: "test-character-id",
      environment: {
        lighting: "dark",
        weather: "rain",
      },
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    await POST(request);

    expect(combatModule.createCombatSession).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: expect.objectContaining({
          lighting: "dark",
          weather: "rain",
        }),
      })
    );
  });

  it("should return 400 when characterId is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);

    const requestBody = {};

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Missing required field: characterId");
    expect(combatModule.createCombatSession).not.toHaveBeenCalled();
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(null);

    const requestBody = {
      characterId: "nonexistent-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
    expect(combatModule.createCombatSession).not.toHaveBeenCalled();
  });

  it("should return 403 when character not owned by user", async () => {
    const otherUserCharacter = createMockCharacter({ ownerId: "other-user-id" });
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(otherUserCharacter);

    const requestBody = {
      characterId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Access denied");
    expect(combatModule.createCombatSession).not.toHaveBeenCalled();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const requestBody = {
      characterId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const requestBody = {
      characterId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 500 when addParticipant fails", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(null);

    const requestBody = {
      characterId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to add participant");
  });

  it("should return 500 on exception", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockRejectedValue(new Error("Database error"));

    const requestBody = {
      characterId: "test-character-id",
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to start quick combat");

    consoleErrorSpy.mockRestore();
  });

  it("should handle character with missing attributes", async () => {
    const characterWithoutAttrs = createMockCharacter({
      attributes: {},
    });
    const sessionWithParticipant = createMockCombatSession({
      participants: [mockParticipant],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(characterWithoutAttrs);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.addParticipant).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(sessionWithParticipant);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(sessionWithParticipant);

    const requestBody = {
      characterId: "test-character-id",
      rollInitiative: false,
    };

    const request = createMockRequest(
      "http://localhost:3000/api/combat/quick-start",
      requestBody,
      "POST"
    );
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    // Should default to 1 for missing attributes
    expect(data.initiative.base).toBe(2); // reaction(1) + intuition(1)
  });
});
