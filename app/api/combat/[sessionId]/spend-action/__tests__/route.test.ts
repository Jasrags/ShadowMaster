/**
 * Tests for /api/combat/[sessionId]/spend-action endpoint
 *
 * Tests action economy spending for readiness changes.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as combatModule from "@/lib/storage/combat";
import type { User, CombatSession, CombatParticipant } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/combat");

function createMockRequest(body: unknown): NextRequest {
  const request = new NextRequest("http://localhost:3000/api/combat/session-1/spend-action", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  (request as { json: () => Promise<unknown> }).json = async () => body;
  return request;
}

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
    preferences: { theme: "system", navigationCollapsed: false },
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
    emailVerificationTokenPrefix: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    passwordResetTokenPrefix: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
    magicLinkTokenPrefix: null,
    ...overrides,
  };
}

function createMockParticipant(overrides?: Partial<CombatParticipant>): CombatParticipant {
  return {
    id: "p1",
    type: "character",
    entityId: "char-1",
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

function createMockSession(overrides?: Partial<CombatSession>): CombatSession {
  return {
    id: "session-1",
    ownerId: "test-user-id",
    editionCode: "sr5",
    participants: [createMockParticipant()],
    initiativeOrder: ["p1"],
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

function createRouteParams(sessionId = "session-1") {
  return { params: Promise.resolve({ sessionId }) };
}

describe("POST /api/combat/[sessionId]/spend-action", () => {
  const mockUser = createMockUser();
  const mockSession = createMockSession();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(mockSession);
    vi.mocked(combatModule.updateParticipantActions).mockResolvedValue(null);
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest({ participantId: "p1", actionType: "simple" });
    const response = await POST(request, createRouteParams());
    expect(response.status).toBe(401);
  });

  it("returns 404 when user not found", async () => {
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);
    const request = createMockRequest({ participantId: "p1", actionType: "simple" });
    const response = await POST(request, createRouteParams());
    expect(response.status).toBe(404);
  });

  it("returns 404 when session not found", async () => {
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(null);
    const request = createMockRequest({ participantId: "p1", actionType: "simple" });
    const response = await POST(request, createRouteParams());
    expect(response.status).toBe(404);
  });

  it("returns 403 when user does not own session", async () => {
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(
      createMockSession({ ownerId: "other-user" })
    );
    const request = createMockRequest({ participantId: "p1", actionType: "simple" });
    const response = await POST(request, createRouteParams());
    expect(response.status).toBe(403);
  });

  it("returns 400 when session is not active", async () => {
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(
      createMockSession({ status: "completed" })
    );
    const request = createMockRequest({ participantId: "p1", actionType: "simple" });
    const response = await POST(request, createRouteParams());
    expect(response.status).toBe(400);
  });

  it("returns 400 when required fields are missing", async () => {
    const request = createMockRequest({ participantId: "p1" });
    const response = await POST(request, createRouteParams());
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid actionType", async () => {
    const request = createMockRequest({ participantId: "p1", actionType: "interrupt" });
    const response = await POST(request, createRouteParams());
    expect(response.status).toBe(400);
  });

  it("returns 404 when participant not found", async () => {
    const request = createMockRequest({ participantId: "nonexistent", actionType: "simple" });
    const response = await POST(request, createRouteParams());
    expect(response.status).toBe(404);
  });

  it("successfully spends a simple action", async () => {
    const request = createMockRequest({ participantId: "p1", actionType: "simple" });
    const response = await POST(request, createRouteParams());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.actionsRemaining.simple).toBe(1);
    expect(vi.mocked(combatModule.updateParticipantActions)).toHaveBeenCalledTimes(1);
  });

  it("successfully spends a free action", async () => {
    const request = createMockRequest({ participantId: "p1", actionType: "free" });
    const response = await POST(request, createRouteParams());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.actionsRemaining.free).toBe(998);
  });

  it("successfully spends a complex action", async () => {
    const request = createMockRequest({ participantId: "p1", actionType: "complex" });
    const response = await POST(request, createRouteParams());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.actionsRemaining.complex).toBe(0);
    expect(data.actionsRemaining.simple).toBe(0);
  });

  it("returns 400 when no simple actions remaining", async () => {
    const noSimple = createMockParticipant({
      actionsRemaining: { free: 999, simple: 0, complex: 0, interrupt: true },
    });
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(
      createMockSession({ participants: [noSimple] })
    );
    const request = createMockRequest({ participantId: "p1", actionType: "simple" });
    const response = await POST(request, createRouteParams());
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("No simple actions remaining");
  });

  it("returns 400 when no complex actions remaining", async () => {
    const noComplex = createMockParticipant({
      actionsRemaining: { free: 999, simple: 0, complex: 0, interrupt: true },
    });
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(
      createMockSession({ participants: [noComplex] })
    );
    const request = createMockRequest({ participantId: "p1", actionType: "complex" });
    const response = await POST(request, createRouteParams());
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("No complex actions remaining");
  });

  it("spends complex via two simple actions when no complex slot", async () => {
    const noComplexSlot = createMockParticipant({
      actionsRemaining: { free: 999, simple: 2, complex: 0, interrupt: true },
    });
    vi.mocked(combatModule.getCombatSession).mockResolvedValue(
      createMockSession({ participants: [noComplexSlot] })
    );
    const request = createMockRequest({ participantId: "p1", actionType: "complex" });
    const response = await POST(request, createRouteParams());
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.actionsRemaining.simple).toBe(0);
  });
});
