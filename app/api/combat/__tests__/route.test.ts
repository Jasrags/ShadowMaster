/**
 * Tests for /api/combat endpoint
 *
 * Tests combat session listing (GET) and creation (POST) functionality
 * including authentication, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
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

describe("GET /api/combat", () => {
  const mockUser = createMockUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should list all combat sessions for the user", async () => {
    const mockSessions = [
      createMockCombatSession({ id: "session-1", name: "Combat 1" }),
      createMockCombatSession({ id: "session-2", name: "Combat 2" }),
    ];

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.listCombatSessions).mockResolvedValue(mockSessions);

    const request = createMockRequest("http://localhost:3000/api/combat");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.sessions).toHaveLength(2);
    expect(data.total).toBe(2);
    expect(combatModule.listCombatSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: mockUser.id,
        includeCompleted: false,
        limit: 20,
      })
    );
  });

  it("should filter sessions by campaignId", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.listCombatSessions).mockResolvedValue([]);

    const request = createMockRequest(
      "http://localhost:3000/api/combat?campaignId=test-campaign-id"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(combatModule.listCombatSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        campaignId: "test-campaign-id",
      })
    );
  });

  it("should filter sessions by status", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.listCombatSessions).mockResolvedValue([]);

    const request = createMockRequest("http://localhost:3000/api/combat?status=paused");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(combatModule.listCombatSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "paused",
      })
    );
  });

  it("should include completed sessions when requested", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.listCombatSessions).mockResolvedValue([]);

    const request = createMockRequest("http://localhost:3000/api/combat?includeCompleted=true");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(combatModule.listCombatSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        includeCompleted: true,
      })
    );
  });

  it("should respect limit parameter with max of 50", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.listCombatSessions).mockResolvedValue([]);

    const request = createMockRequest("http://localhost:3000/api/combat?limit=100");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(combatModule.listCombatSessions).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 50, // Capped at 50
      })
    );
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/combat");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
    expect(combatModule.listCombatSessions).not.toHaveBeenCalled();
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/combat");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
    expect(combatModule.listCombatSessions).not.toHaveBeenCalled();
  });

  it("should return 500 on exception", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.listCombatSessions).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest("http://localhost:3000/api/combat");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to list combat sessions");

    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/combat", () => {
  const mockUser = createMockUser();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a combat session with defaults", async () => {
    const mockSession = createMockCombatSession();
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(mockSession);

    const requestBody = {
      editionCode: "sr5",
    };

    const request = createMockRequest("http://localhost:3000/api/combat", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.session).toBeDefined();
    expect(combatModule.createCombatSession).toHaveBeenCalledWith(
      expect.objectContaining({
        ownerId: mockUser.id,
        editionCode: "sr5",
        status: "active",
        round: 1,
        currentTurn: 0,
        currentPhase: "initiative",
        participants: [],
        initiativeOrder: [],
        environment: expect.objectContaining({
          weather: "clear",
          terrain: "urban",
          backgroundCount: 0,
          noise: 0,
        }),
      })
    );
  });

  it("should create a combat session with custom name and campaignId", async () => {
    const mockSession = createMockCombatSession({
      name: "Boss Fight",
      campaignId: "campaign-123",
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(mockSession);

    const requestBody = {
      name: "Boss Fight",
      campaignId: "campaign-123",
      editionCode: "sr5",
    };

    const request = createMockRequest("http://localhost:3000/api/combat", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(combatModule.createCombatSession).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Boss Fight",
        campaignId: "campaign-123",
      })
    );
  });

  it("should create a combat session with custom environment", async () => {
    const mockSession = createMockCombatSession();
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.createCombatSession).mockResolvedValue(mockSession);

    const requestBody = {
      editionCode: "sr5",
      environment: {
        visibility: "dark",
        weather: "rain",
        terrain: "wilderness",
        backgroundCount: 2,
        noise: 3,
      },
    };

    const request = createMockRequest("http://localhost:3000/api/combat", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(combatModule.createCombatSession).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: expect.objectContaining({
          visibility: "dark",
          weather: "rain",
          terrain: "wilderness",
          backgroundCount: 2,
          noise: 3,
        }),
      })
    );
  });

  it("should return 400 when editionCode is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);

    const requestBody = {
      name: "Test Combat",
    };

    const request = createMockRequest("http://localhost:3000/api/combat", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Missing required field: editionCode");
    expect(combatModule.createCombatSession).not.toHaveBeenCalled();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const requestBody = {
      editionCode: "sr5",
    };

    const request = createMockRequest("http://localhost:3000/api/combat", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
    expect(combatModule.createCombatSession).not.toHaveBeenCalled();
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const requestBody = {
      editionCode: "sr5",
    };

    const request = createMockRequest("http://localhost:3000/api/combat", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
    expect(combatModule.createCombatSession).not.toHaveBeenCalled();
  });

  it("should return 500 on exception", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.createCombatSession).mockRejectedValue(new Error("Database error"));

    const requestBody = {
      editionCode: "sr5",
    };

    const request = createMockRequest("http://localhost:3000/api/combat", requestBody, "POST");
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to create combat session");

    consoleErrorSpy.mockRestore();
  });
});
