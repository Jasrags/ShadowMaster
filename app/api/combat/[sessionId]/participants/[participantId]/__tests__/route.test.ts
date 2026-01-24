/**
 * Tests for /api/combat/[sessionId]/participants/[participantId] endpoint
 *
 * Tests participant removal (DELETE) functionality including
 * authentication, authorization, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as combatModule from "@/lib/storage/combat";
import type { User, CombatSession, CombatParticipant } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/combat");

// Helper to create a NextRequest
function createMockRequest(url: string, method = "GET"): NextRequest {
  return new NextRequest(url, { method });
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

// Route params helper
function createRouteParams(sessionId: string, participantId: string) {
  return { params: Promise.resolve({ sessionId, participantId }) };
}

describe("DELETE /api/combat/[sessionId]/participants/[participantId]", () => {
  const mockUser = createMockUser();
  const mockParticipant = createMockParticipant();
  const mockSession = createMockCombatSession({
    participants: [mockParticipant],
    initiativeOrder: [mockParticipant.id],
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should remove participant successfully", async () => {
    const updatedSession = createMockCombatSession({
      participants: [],
      initiativeOrder: [],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.removeParticipant).mockResolvedValue(updatedSession);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants/test-participant-id",
      "DELETE"
    );
    const response = await DELETE(
      request,
      createRouteParams("test-session-id", "test-participant-id")
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Test Character");
    expect(data.session.participants).toHaveLength(0);
    expect(combatModule.removeParticipant).toHaveBeenCalledWith(
      "test-session-id",
      "test-participant-id"
    );
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants/test-participant-id",
      "DELETE"
    );
    const response = await DELETE(
      request,
      createRouteParams("test-session-id", "test-participant-id")
    );
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
    expect(combatModule.removeParticipant).not.toHaveBeenCalled();
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants/test-participant-id",
      "DELETE"
    );
    const response = await DELETE(
      request,
      createRouteParams("test-session-id", "test-participant-id")
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
    expect(combatModule.removeParticipant).not.toHaveBeenCalled();
  });

  it("should return 404 when session not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/nonexistent-session/participants/test-participant-id",
      "DELETE"
    );
    const response = await DELETE(
      request,
      createRouteParams("nonexistent-session", "test-participant-id")
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Combat session not found");
    expect(combatModule.removeParticipant).not.toHaveBeenCalled();
  });

  it("should return 403 when user is not the owner", async () => {
    const otherUserSession = createMockCombatSession({
      ownerId: "other-user-id",
      participants: [mockParticipant],
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(otherUserSession);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants/test-participant-id",
      "DELETE"
    );
    const response = await DELETE(
      request,
      createRouteParams("test-session-id", "test-participant-id")
    );
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Access denied");
    expect(combatModule.removeParticipant).not.toHaveBeenCalled();
  });

  it("should return 404 when participant not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants/nonexistent-participant",
      "DELETE"
    );
    const response = await DELETE(
      request,
      createRouteParams("test-session-id", "nonexistent-participant")
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Participant not found");
    expect(combatModule.removeParticipant).not.toHaveBeenCalled();
  });

  it("should return 500 when removeParticipant fails", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.removeParticipant).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants/test-participant-id",
      "DELETE"
    );
    const response = await DELETE(
      request,
      createRouteParams("test-session-id", "test-participant-id")
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to remove participant");
  });

  it("should return 500 on exception", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id/participants/test-participant-id",
      "DELETE"
    );
    const response = await DELETE(
      request,
      createRouteParams("test-session-id", "test-participant-id")
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to remove participant");

    consoleErrorSpy.mockRestore();
  });
});
