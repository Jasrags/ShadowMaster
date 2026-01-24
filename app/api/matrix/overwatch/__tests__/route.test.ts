/**
 * Tests for /api/matrix/overwatch endpoint
 *
 * Tests overwatch score tracking including recording events,
 * checking status, and ending sessions with convergence handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET, DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as charactersModule from "@/lib/storage/characters";
import type { Character } from "@/lib/types";
import type { User } from "@/lib/types/user";
import { OVERWATCH_THRESHOLD } from "@/lib/types/matrix";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/characters");

// Helper to create a NextRequest with JSON body (POST/DELETE)
function createMockRequest(body?: unknown, method = "POST"): NextRequest {
  const headers = new Headers();
  if (body) {
    headers.set("Content-Type", "application/json");
  }

  const request = new NextRequest("http://localhost:3000/api/matrix/overwatch", {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

// Helper to create a GET request with query params
function createGetRequest(params?: Record<string, string>): NextRequest {
  const url = new URL("http://localhost:3000/api/matrix/overwatch");
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }
  return new NextRequest(url.toString(), { method: "GET" });
}

// Mock data factories
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "hashed-password",
    role: ["user"],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
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

function createMockCharacter(overrides?: Partial<Character>): Character {
  return {
    id: "test-char-id",
    ownerId: "test-user-id",
    name: "Test Decker",
    editionCode: "sr5",
    creationMethod: "priority",
    attributesPurchased: {
      body: 3,
      agility: 3,
      reaction: 4,
      strength: 2,
      willpower: 4,
      logic: 6,
      intuition: 4,
      charisma: 2,
      edge: 3,
    },
    attributesAugmented: {},
    skills: {},
    qualities: [],
    contacts: [],
    inventory: [],
    karma: { available: 0, spent: 0, total: 0 },
    nuyen: 5000,
    essence: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    ...overrides,
  } as Character;
}

describe("/api/matrix/overwatch", () => {
  const mockUserId = "test-user-id";
  const mockUser = createMockUser({ id: mockUserId });
  const mockCharacter = createMockCharacter();

  // Counter for unique character IDs to avoid session state bleeding between tests
  let testCounter = 0;
  function getUniqueCharId() {
    return `test-char-${Date.now()}-${++testCounter}`;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =============================================================================
  // POST - Record Overwatch Event
  // =============================================================================

  describe("POST /api/matrix/overwatch (Record Event)", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(null);

      const request = createMockRequest({
        characterId: "test-char-id",
        action: "Hack on the Fly",
        scoreAdded: 2,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(null);

      const request = createMockRequest({
        characterId: "test-char-id",
        action: "Hack on the Fly",
        scoreAdded: 2,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });

    it("should return 400 when characterId missing", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);

      const request = createMockRequest({
        action: "Hack on the Fly",
        scoreAdded: 2,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("characterId is required");
    });

    it("should return 400 when action missing", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);

      const request = createMockRequest({
        characterId: "test-char-id",
        scoreAdded: 2,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("action is required");
    });

    it("should return 400 when scoreAdded missing or negative", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);

      const request = createMockRequest({
        characterId: "test-char-id",
        action: "Hack on the Fly",
        scoreAdded: -5,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("scoreAdded must be a non-negative number");
    });

    it("should return 404 when character not found", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(null);

      const request = createMockRequest({
        characterId: "non-existent-id",
        action: "Hack on the Fly",
        scoreAdded: 2,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user doesn't own character", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue({
        ...mockCharacter,
        ownerId: "different-user-id",
      });

      const request = createMockRequest({
        characterId: "test-char-id",
        action: "Hack on the Fly",
        scoreAdded: 2,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized to record overwatch for this character");
    });

    it("should record first event and create session", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest({
        characterId: "test-char-id",
        action: "Hack on the Fly",
        scoreAdded: 5,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.currentScore).toBe(5);
      expect(data.threshold).toBe(OVERWATCH_THRESHOLD);
      expect(data.convergenceTriggered).toBe(false);
      expect(data.events).toHaveLength(1);
      expect(data.events[0].action).toBe("Hack on the Fly");
      expect(data.events[0].scoreAdded).toBe(5);
    });

    it("should record subsequent events in existing session", async () => {
      const charId = getUniqueCharId();
      const charForTest = { ...mockCharacter, id: charId };

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(charForTest);

      // First event
      const request1 = createMockRequest({
        characterId: charId,
        action: "Hack on the Fly",
        scoreAdded: 5,
      });
      await POST(request1);

      // Second event
      const request2 = createMockRequest({
        characterId: charId,
        action: "Brute Force",
        scoreAdded: 10,
      });
      const response = await POST(request2);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.currentScore).toBe(15);
      expect(data.events).toHaveLength(2);
    });

    it("should update currentScore correctly", async () => {
      const charId = getUniqueCharId();
      const charForTest = { ...mockCharacter, id: charId };

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(charForTest);

      // Multiple events to accumulate score
      await POST(
        createMockRequest({
          characterId: charId,
          action: "Action 1",
          scoreAdded: 10,
        })
      );
      await POST(
        createMockRequest({
          characterId: charId,
          action: "Action 2",
          scoreAdded: 15,
        })
      );
      const response = await POST(
        createMockRequest({
          characterId: charId,
          action: "Action 3",
          scoreAdded: 7,
        })
      );
      const data = await response.json();

      expect(data.currentScore).toBe(32);
    });

    it("should trigger convergence at threshold (40)", async () => {
      const charId = getUniqueCharId();
      const charForTest = { ...mockCharacter, id: charId };

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(charForTest);

      // Get to just below threshold
      await POST(
        createMockRequest({
          characterId: charId,
          action: "Big Action",
          scoreAdded: 35,
        })
      );

      // Push over threshold
      const response = await POST(
        createMockRequest({
          characterId: charId,
          action: "Final Action",
          scoreAdded: 10,
        })
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.currentScore).toBe(45);
      expect(data.convergenceTriggered).toBe(true);
    });

    it("should start new session after convergence", async () => {
      const charId = getUniqueCharId();
      const charForTest = { ...mockCharacter, id: charId };

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(charForTest);

      // Trigger convergence
      const convergeResponse = await POST(
        createMockRequest({
          characterId: charId,
          action: "Massive Action",
          scoreAdded: 50,
        })
      );
      const convergeData = await convergeResponse.json();
      expect(convergeData.convergenceTriggered).toBe(true);

      // Recording a new event should start a fresh session
      // (route auto-creates new session after convergence)
      const response = await POST(
        createMockRequest({
          characterId: charId,
          action: "Fresh Start",
          scoreAdded: 5,
        })
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.currentScore).toBe(5); // New session, starts from this event only
      expect(data.convergenceTriggered).toBe(false);
      expect(data.events).toHaveLength(1);
    });

    it("should handle scoreAdded=0 correctly", async () => {
      const charId = getUniqueCharId();
      const charForTest = { ...mockCharacter, id: charId };

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(charForTest);

      const request = createMockRequest({
        characterId: charId,
        action: "Legal Action",
        scoreAdded: 0,
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.currentScore).toBe(0);
      expect(data.events).toHaveLength(1);
    });
  });

  // =============================================================================
  // GET - Check Overwatch Status
  // =============================================================================

  describe("GET /api/matrix/overwatch (Check Status)", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(null);

      const request = createGetRequest({ characterId: "test-char-id" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 400 when characterId query param missing", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);

      const request = createGetRequest({});
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("characterId query parameter is required");
    });

    it("should return 403 when user doesn't own character", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue({
        ...mockCharacter,
        ownerId: "different-user-id",
      });

      const request = createGetRequest({ characterId: "test-char-id" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized");
    });

    it("should return empty state when no session exists", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue({
        ...mockCharacter,
        id: "new-char-id", // Different char, no session
      });

      const request = createGetRequest({ characterId: "new-char-id" });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.currentScore).toBe(0);
      expect(data.threshold).toBe(OVERWATCH_THRESHOLD);
      expect(data.convergenceTriggered).toBe(false);
      expect(data.events).toEqual([]);
    });

    it("should return current session state with events", async () => {
      const charId = getUniqueCharId();
      const charForTest = { ...mockCharacter, id: charId };

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(charForTest);

      // Create a session with some events
      await POST(
        createMockRequest({
          characterId: charId,
          action: "Hack on the Fly",
          scoreAdded: 5,
        })
      );
      await POST(
        createMockRequest({
          characterId: charId,
          action: "Data Spike",
          scoreAdded: 8,
        })
      );

      // Check status
      const request = createGetRequest({ characterId: charId });
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.currentScore).toBe(13);
      expect(data.threshold).toBe(OVERWATCH_THRESHOLD);
      expect(data.convergenceTriggered).toBe(false);
      expect(data.events).toHaveLength(2);
    });
  });

  // =============================================================================
  // DELETE - End Overwatch Session
  // =============================================================================

  describe("DELETE /api/matrix/overwatch (End Session)", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(null);

      const request = createMockRequest(
        {
          characterId: "test-char-id",
          reason: "jacked_out",
        },
        "DELETE"
      );
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(null);

      const request = createMockRequest(
        {
          characterId: "test-char-id",
          reason: "jacked_out",
        },
        "DELETE"
      );
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });

    it("should return 400 when characterId missing", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);

      const request = createMockRequest(
        {
          reason: "jacked_out",
        },
        "DELETE"
      );
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("characterId is required");
    });

    it("should return 404 when character not found", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(null);

      const request = createMockRequest(
        {
          characterId: "non-existent-id",
          reason: "jacked_out",
        },
        "DELETE"
      );
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user doesn't own character", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue({
        ...mockCharacter,
        ownerId: "different-user-id",
      });

      const request = createMockRequest(
        {
          characterId: "test-char-id",
          reason: "jacked_out",
        },
        "DELETE"
      );
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized");
    });

    it("should return 404 when no active session", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue({
        ...mockCharacter,
        id: "char-without-session",
      });

      const request = createMockRequest(
        {
          characterId: "char-without-session",
          reason: "jacked_out",
        },
        "DELETE"
      );
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("No active session found");
    });

    it("should end session with jacked_out reason", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);

      // Create a session first
      await POST(
        createMockRequest({
          characterId: "test-char-id",
          action: "Hack on the Fly",
          scoreAdded: 10,
        })
      );

      // End the session
      const request = createMockRequest(
        {
          characterId: "test-char-id",
          reason: "jacked_out",
        },
        "DELETE"
      );
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.session.endReason).toBe("jacked_out");
      expect(data.convergence).toBeUndefined();
    });

    it("should end session with converged reason and return convergence result", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);

      // Create a session and trigger convergence
      await POST(
        createMockRequest({
          characterId: "test-char-id",
          action: "Big Hack",
          scoreAdded: 50,
        })
      );

      // End the session as converged
      const request = createMockRequest(
        {
          characterId: "test-char-id",
          reason: "converged",
        },
        "DELETE"
      );
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.session.endReason).toBe("converged");
      expect(data.session.converged).toBe(true);
      expect(data.convergence).toBeDefined();
      expect(data.convergence.osReset).toBe(true);
      expect(data.convergence.personaDestroyed).toBe(true);
    });

    it("should end session with session_ended reason", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);

      // Create a session
      await POST(
        createMockRequest({
          characterId: "test-char-id",
          action: "Some Action",
          scoreAdded: 5,
        })
      );

      // End the session
      const request = createMockRequest(
        {
          characterId: "test-char-id",
          reason: "session_ended",
        },
        "DELETE"
      );
      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.session.endReason).toBe("session_ended");
    });
  });
});
