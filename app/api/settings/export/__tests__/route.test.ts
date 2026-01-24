/**
 * Tests for /api/settings/export endpoint
 *
 * Tests user data export functionality including authentication,
 * data assembly, sensitive field filtering, and proper headers.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as charactersModule from "@/lib/storage/characters";
import type { User } from "@/lib/types/user";
import type { Character } from "@/lib/types/character";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/characters");

// Mock next/server with proper NextResponse for file downloads
vi.mock("next/server", () => {
  class MockNextResponse extends Response {
    constructor(body?: BodyInit | null, init?: ResponseInit) {
      super(body, init);
    }

    static json(data: unknown, init?: ResponseInit): MockNextResponse {
      const body = JSON.stringify(data);
      const headers = new Headers(init?.headers);
      headers.set("content-type", "application/json");
      return new MockNextResponse(body, { ...init, headers });
    }
  }

  return {
    NextResponse: MockNextResponse,
  };
});

// Import the route handler after mocks are set up
import { GET } from "../route";

describe("GET /api/settings/export", () => {
  const mockUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "secret-hashed-password",
    role: ["user"],
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: "2024-06-01T00:00:00.000Z",
    characters: ["char-1", "char-2"],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 3,
    preferences: {
      theme: "dark",
      navigationCollapsed: true,
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
  };

  const mockCharacters: Character[] = [
    {
      id: "char-1",
      userId: "test-user-id",
      name: "Test Runner",
      editionCode: "sr5",
      state: "active",
    } as unknown as Character,
    {
      id: "char-2",
      userId: "test-user-id",
      name: "Second Character",
      editionCode: "sr5",
      state: "draft",
    } as unknown as Character,
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date to get consistent filenames in tests
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(usersModule.getUserById).not.toHaveBeenCalled();
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("User not found");
  });

  it("should return correct Content-Type header", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getUserCharacters).mockResolvedValue(mockCharacters);

    const response = await GET();

    expect(response.headers.get("Content-Type")).toBe("application/json");
  });

  it("should return correct Content-Disposition header with date", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getUserCharacters).mockResolvedValue(mockCharacters);

    const response = await GET();

    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="shadow-master-export-2024-06-15.json"'
    );
  });

  it("should exclude passwordHash from exported user", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getUserCharacters).mockResolvedValue(mockCharacters);

    const response = await GET();
    const text = await response.text();
    const data = JSON.parse(text);

    expect(data.user.passwordHash).toBeUndefined();
    expect(data.user.email).toBe("test@example.com");
    expect(data.user.username).toBe("testuser");
  });

  it("should include all user characters", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getUserCharacters).mockResolvedValue(mockCharacters);

    const response = await GET();
    const text = await response.text();
    const data = JSON.parse(text);

    expect(response.status).toBe(200);
    expect(data.characters).toHaveLength(2);
    expect(data.characters[0].id).toBe("char-1");
    expect(data.characters[1].id).toBe("char-2");
    expect(charactersModule.getUserCharacters).toHaveBeenCalledWith("test-user-id");
  });

  it("should include meta section with date, version, and type", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getUserCharacters).mockResolvedValue(mockCharacters);

    const response = await GET();
    const text = await response.text();
    const data = JSON.parse(text);

    expect(data.meta).toBeDefined();
    expect(data.meta.date).toBe("2024-06-15T12:00:00.000Z");
    expect(data.meta.version).toBe("1.0");
    expect(data.meta.type).toBe("shadow-master-export");
  });

  it("should return 500 on server error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getUserCharacters).mockRejectedValue(new Error("Database error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");

    consoleErrorSpy.mockRestore();
  });
});
