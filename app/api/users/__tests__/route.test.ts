/**
 * Tests for /api/users endpoint
 *
 * Tests admin user listing with filtering, sorting, and pagination.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";
import * as middlewareModule from "@/lib/auth/middleware";
import * as usersModule from "@/lib/storage/users";
import type { User, PublicUser } from "@/lib/types/user";

// Helper to strip passwordHash
function stripPasswordHash(user: User): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...publicUser } = user;
  return publicUser as PublicUser;
}

// Mock dependencies
vi.mock("@/lib/auth/middleware", async (importOriginal) => {
  const actual = await importOriginal<typeof middlewareModule>();
  return {
    ...actual,
    requireAdmin: vi.fn(),
    toPublicUser: (user: User) => stripPasswordHash(user),
  };
});
vi.mock("@/lib/storage/users");

describe("GET /api/users", () => {
  const mockAdminUser: User = {
    id: "admin-user-id",
    email: "admin@example.com",
    username: "admin",
    passwordHash: "hashed",
    role: ["administrator"],
    createdAt: "2024-01-01T00:00:00.000Z",
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
  };

  const mockUsers: User[] = [
    {
      id: "user-1",
      email: "alice@example.com",
      username: "alice",
      passwordHash: "hashed",
      role: ["user"],
      createdAt: "2024-01-01T00:00:00.000Z",
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
    },
    {
      id: "user-2",
      email: "bob@example.com",
      username: "bob",
      passwordHash: "hashed",
      role: ["user", "gamemaster"],
      createdAt: "2024-02-01T00:00:00.000Z",
      lastLogin: null,
      characters: [],
      failedLoginAttempts: 0,
      lockoutUntil: null,
      sessionVersion: 1,
      sessionSecretHash: null,
      preferences: { theme: "dark", navigationCollapsed: false },
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
    },
    {
      id: "user-3",
      email: "charlie@example.com",
      username: "charlie",
      passwordHash: "hashed",
      role: ["administrator"],
      createdAt: "2024-03-01T00:00:00.000Z",
      lastLogin: null,
      characters: [],
      failedLoginAttempts: 0,
      lockoutUntil: null,
      sessionVersion: 1,
      sessionSecretHash: null,
      preferences: { theme: "light", navigationCollapsed: true },
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
    },
  ];

  const createMockRequest = (params?: Record<string, string>): NextRequest => {
    const url = new URL("http://localhost:3000/api/users");
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    const request = new NextRequest(url);
    // Add nextUrl property
    Object.defineProperty(request, "nextUrl", {
      value: url,
      writable: false,
    });
    return request;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 403 when not authenticated", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
      new Error("Authentication required")
    );

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 403 when not admin", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
      new Error("Administrator access required")
    );

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Administrator access required");
  });

  it("should return paginated list of users", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue(mockUsers);

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.users).toHaveLength(3);
    expect(data.pagination.total).toBe(3);
    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(20);
  });

  it("should filter by search query (email)", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue(mockUsers);

    const request = createMockRequest({ search: "alice" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.users).toHaveLength(1);
    expect(data.users[0].email).toBe("alice@example.com");
  });

  it("should filter by search query (username)", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue(mockUsers);

    const request = createMockRequest({ search: "bob" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.users).toHaveLength(1);
    expect(data.users[0].username).toBe("bob");
  });

  it("should sort by email", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue(mockUsers);

    const request = createMockRequest({ sortBy: "email", sortOrder: "asc" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.users[0].email).toBe("alice@example.com");
    expect(data.users[1].email).toBe("bob@example.com");
    expect(data.users[2].email).toBe("charlie@example.com");
  });

  it("should sort by username", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue(mockUsers);

    const request = createMockRequest({ sortBy: "username", sortOrder: "desc" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.users[0].username).toBe("charlie");
    expect(data.users[2].username).toBe("alice");
  });

  it("should sort by createdAt", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue(mockUsers);

    const request = createMockRequest({ sortBy: "createdAt", sortOrder: "desc" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.users[0].email).toBe("charlie@example.com");
    expect(data.users[2].email).toBe("alice@example.com");
  });

  it("should respect sortOrder (asc/desc)", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue(mockUsers);

    // Test ascending
    const requestAsc = createMockRequest({ sortBy: "createdAt", sortOrder: "asc" });
    const responseAsc = await GET(requestAsc);
    const dataAsc = await responseAsc.json();

    expect(dataAsc.users[0].email).toBe("alice@example.com");

    // Test descending
    const requestDesc = createMockRequest({ sortBy: "createdAt", sortOrder: "desc" });
    const responseDesc = await GET(requestDesc);
    const dataDesc = await responseDesc.json();

    expect(dataDesc.users[0].email).toBe("charlie@example.com");
  });

  it("should apply default pagination", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue(mockUsers);

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(data.pagination.page).toBe(1);
    expect(data.pagination.limit).toBe(20);
  });

  it("should never expose passwordHash", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue(mockUsers);

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    data.users.forEach((user: PublicUser & { passwordHash?: string }) => {
      expect(user.passwordHash).toBeUndefined();
    });
  });

  it("should return correct pagination metadata", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue(mockUsers);

    const request = createMockRequest({ page: "2", limit: "1" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.pagination.page).toBe(2);
    expect(data.pagination.limit).toBe(1);
    expect(data.pagination.total).toBe(3);
    expect(data.pagination.totalPages).toBe(3);
    expect(data.users).toHaveLength(1);
  });

  it("should return 500 on server error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getAllUsers).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred while fetching users");

    consoleErrorSpy.mockRestore();
  });
});
