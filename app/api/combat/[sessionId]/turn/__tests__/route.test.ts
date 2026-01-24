/**
 * Tests for /api/combat/[sessionId]/turn endpoint
 *
 * Tests turn state retrieval (GET) and turn/round advancement (POST)
 * including authentication, authorization, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as combatModule from "@/lib/storage/combat";
import type { User, CombatSession, CombatParticipant } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/combat");

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

// Route params helper
function createRouteParams(sessionId: string) {
  return { params: Promise.resolve({ sessionId }) };
}

describe("GET /api/combat/[sessionId]/turn", () => {
  const mockUser = createMockUser();
  const mockParticipant = createMockParticipant();
  const mockSession = createMockCombatSession({
    participants: [mockParticipant],
    initiativeOrder: [mockParticipant.id],
    currentTurn: 0,
    currentPhase: "action",
    round: 1,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return turn state with current participant", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/turn");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.round).toBe(1);
    expect(data.phase).toBe("action");
    expect(data.turn).toBe(0);
    expect(data.initiativeOrder).toEqual([mockParticipant.id]);
    expect(data.currentParticipant).toBeDefined();
    expect(data.currentParticipant.id).toBe(mockParticipant.id);
    expect(data.currentParticipant.name).toBe("Test Character");
    expect(data.totalParticipants).toBe(1);
    expect(data.activeParticipants).toBe(1);
  });

  it("should return null currentParticipant when no current participant", async () => {
    const emptySession = createMockCombatSession({ participants: [], initiativeOrder: [] });
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(emptySession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/turn");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.currentParticipant).toBeNull();
  });

  it("should count active and waiting participants", async () => {
    const activeParticipant = createMockParticipant({ id: "active-1", status: "active" });
    const waitingParticipant = createMockParticipant({ id: "waiting-1", status: "waiting" });
    const outParticipant = createMockParticipant({ id: "out-1", status: "out" });

    const sessionWithMixedParticipants = createMockCombatSession({
      participants: [activeParticipant, waitingParticipant, outParticipant],
      initiativeOrder: [activeParticipant.id, waitingParticipant.id],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(sessionWithMixedParticipants);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(activeParticipant);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/turn");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.totalParticipants).toBe(3);
    expect(data.activeParticipants).toBe(2); // active + waiting
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/turn");
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

    const request = createMockRequest("http://localhost:3000/api/combat/nonexistent-session/turn");
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

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/turn");
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

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id/turn");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get turn state");

    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/combat/[sessionId]/turn", () => {
  const mockUser = createMockUser();
  const mockParticipant = createMockParticipant();
  const mockSession = createMockCombatSession({
    participants: [mockParticipant],
    initiativeOrder: [mockParticipant.id],
    currentTurn: 0,
    status: "active",
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should advance to next turn", async () => {
    const updatedSession = { ...mockSession, currentTurn: 1 };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.advanceTurn).mockResolvedValue(updatedSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);

    const requestBody = { action: "next" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Advanced to turn");
    expect(combatModule.advanceTurn).toHaveBeenCalledWith("test-session-id");
  });

  it("should advance to next round", async () => {
    const updatedSession = { ...mockSession, round: 2, currentTurn: 0 };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.advanceRound).mockResolvedValue(updatedSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);

    const requestBody = { action: "round" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Advanced to round 2");
    expect(combatModule.advanceRound).toHaveBeenCalledWith("test-session-id");
  });

  it("should change phase to initiative", async () => {
    const updatedSession = { ...mockSession, currentPhase: "initiative" as const };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(updatedSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);

    const requestBody = { action: "phase", phase: "initiative" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Changed phase to initiative");
    expect(combatModule.updateCombatSession).toHaveBeenCalledWith("test-session-id", {
      currentPhase: "initiative",
    });
  });

  it("should change phase to resolution", async () => {
    const updatedSession = { ...mockSession, currentPhase: "resolution" as const };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(updatedSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);

    const requestBody = { action: "phase", phase: "resolution" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Changed phase to resolution");
  });

  it("should set initiative for participant", async () => {
    const updatedSession = { ...mockSession };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.setInitiativeScore).mockResolvedValue(updatedSession);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(mockParticipant);

    const requestBody = {
      action: "initiative",
      participantId: "test-participant-id",
      initiativeScore: 15,
      initiativeDice: [4, 5, 6],
    };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Set initiative");
    expect(combatModule.setInitiativeScore).toHaveBeenCalledWith(
      "test-session-id",
      "test-participant-id",
      15,
      [4, 5, 6]
    );
  });

  it("should return 400 for invalid action", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const requestBody = { action: "invalid-action" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Invalid action");
  });

  it("should return 400 when action is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const requestBody = {};
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Invalid action");
  });

  it("should return 400 for invalid phase", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const requestBody = { action: "phase", phase: "invalid-phase" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Invalid phase");
  });

  it("should return 400 when initiative action missing participantId", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const requestBody = { action: "initiative", initiativeScore: 15 };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Missing required fields");
  });

  it("should return 400 when session is not active", async () => {
    const pausedSession = createMockCombatSession({ status: "paused" });
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(pausedSession);

    const requestBody = { action: "next" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Combat session is not active");
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const requestBody = { action: "next" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
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

    const requestBody = { action: "next" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
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
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.advanceTurn).mockRejectedValue(new Error("Database error"));

    const requestBody = { action: "next" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/turn",
      requestBody,
      "POST"
    );
    const response = await POST(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to advance turn");

    consoleErrorSpy.mockRestore();
  });
});
