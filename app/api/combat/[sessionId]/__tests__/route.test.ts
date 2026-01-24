/**
 * Tests for /api/combat/[sessionId] endpoint
 *
 * Tests combat session retrieval (GET), updates (PATCH), and deletion (DELETE)
 * including authentication, authorization, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH, DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as combatModule from "@/lib/storage/combat";
import type { User, CombatSession } from "@/lib/types";

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
function createRouteParams(sessionId: string) {
  return { params: Promise.resolve({ sessionId }) };
}

describe("GET /api/combat/[sessionId]", () => {
  const mockUser = createMockUser();
  const mockSession = createMockCombatSession();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return combat session details", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.session).toEqual(mockSession);
    expect(combatModule.getCombatSession).toHaveBeenCalledWith("test-session-id");
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 404 when session not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/combat/nonexistent-session");
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

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id");
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

    const request = createMockRequest("http://localhost:3000/api/combat/test-session-id");
    const response = await GET(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get combat session");

    consoleErrorSpy.mockRestore();
  });
});

describe("PATCH /api/combat/[sessionId]", () => {
  const mockUser = createMockUser();
  const mockSession = createMockCombatSession();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update session status", async () => {
    const updatedSession = { ...mockSession, status: "paused" as const };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(updatedSession);

    const requestBody = { status: "paused" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      requestBody,
      "PATCH"
    );
    const response = await PATCH(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.session.status).toBe("paused");
    expect(combatModule.updateCombatSession).toHaveBeenCalledWith(
      "test-session-id",
      expect.objectContaining({ status: "paused" })
    );
  });

  it("should update session name", async () => {
    const updatedSession = { ...mockSession, name: "New Name" };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(updatedSession);

    const requestBody = { name: "New Name" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      requestBody,
      "PATCH"
    );
    const response = await PATCH(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(combatModule.updateCombatSession).toHaveBeenCalledWith(
      "test-session-id",
      expect.objectContaining({ name: "New Name" })
    );
  });

  it("should update environment conditions", async () => {
    const updatedSession = {
      ...mockSession,
      environment: { ...mockSession.environment, lighting: "dark" },
    };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.updateEnvironment).mockResolvedValue(updatedSession);

    const requestBody = { environment: { lighting: "dark" } };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      requestBody,
      "PATCH"
    );
    const response = await PATCH(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(combatModule.updateEnvironment).toHaveBeenCalledWith(
      "test-session-id",
      expect.objectContaining({ lighting: "dark" })
    );
  });

  it("should update multiple fields at once", async () => {
    const updatedSession = { ...mockSession, status: "paused" as const, name: "Updated Combat" };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.updateCombatSession).mockResolvedValue(updatedSession);

    const requestBody = { status: "paused", name: "Updated Combat" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      requestBody,
      "PATCH"
    );
    const response = await PATCH(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(combatModule.updateCombatSession).toHaveBeenCalledWith(
      "test-session-id",
      expect.objectContaining({ status: "paused", name: "Updated Combat" })
    );
  });

  it("should return 400 for invalid status", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);

    const requestBody = { status: "invalid-status" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      requestBody,
      "PATCH"
    );
    const response = await PATCH(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid status. Use 'active' or 'paused'");
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const requestBody = { status: "paused" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      requestBody,
      "PATCH"
    );
    const response = await PATCH(request, createRouteParams("test-session-id"));
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

    const requestBody = { status: "paused" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      requestBody,
      "PATCH"
    );
    const response = await PATCH(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Access denied");
  });

  it("should return 404 when session not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(null);

    const requestBody = { status: "paused" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/nonexistent-session",
      requestBody,
      "PATCH"
    );
    const response = await PATCH(request, createRouteParams("nonexistent-session"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Combat session not found");
  });

  it("should return 500 on exception", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.updateCombatSession).mockRejectedValue(new Error("Database error"));

    const requestBody = { status: "paused" };
    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      requestBody,
      "PATCH"
    );
    const response = await PATCH(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to update combat session");

    consoleErrorSpy.mockRestore();
  });
});

describe("DELETE /api/combat/[sessionId]", () => {
  const mockUser = createMockUser();
  const mockSession = createMockCombatSession();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should end session as completed by default", async () => {
    const endedSession = { ...mockSession, status: "completed" as const };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.endCombatSession).mockResolvedValue(endedSession);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Combat session completed");
    expect(data.session.status).toBe("completed");
    expect(combatModule.endCombatSession).toHaveBeenCalledWith("test-session-id", "completed");
  });

  it("should end session as abandoned when reason specified", async () => {
    const abandonedSession = { ...mockSession, status: "abandoned" as const };
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.endCombatSession).mockResolvedValue(abandonedSession);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id?action=end&reason=abandoned",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Combat session abandoned");
    expect(combatModule.endCombatSession).toHaveBeenCalledWith("test-session-id", "abandoned");
  });

  it("should permanently delete session when action=delete", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.deleteCombatSession).mockResolvedValue(true);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id?action=delete",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Combat session deleted");
    expect(combatModule.deleteCombatSession).toHaveBeenCalledWith("test-session-id");
    expect(combatModule.endCombatSession).not.toHaveBeenCalled();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 404 when session not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/combat/nonexistent-session",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, createRouteParams("nonexistent-session"));
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
      "http://localhost:3000/api/combat/test-session-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, createRouteParams("test-session-id"));
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
    vi.mocked(combatModule.endCombatSession).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(
      "http://localhost:3000/api/combat/test-session-id",
      undefined,
      "DELETE"
    );
    const response = await DELETE(request, createRouteParams("test-session-id"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to delete combat session");

    consoleErrorSpy.mockRestore();
  });
});
