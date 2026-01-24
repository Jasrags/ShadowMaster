/**
 * Tests for /api/auth/me endpoint
 *
 * Tests getting current authenticated user including session validation,
 * user retrieval, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import * as sessionModule from "@/lib/auth/session";
import * as storageModule from "@/lib/storage/users";
import type { User } from "@/lib/types/user";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");

describe("GET /api/auth/me", () => {
  const mockUser: User = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return current user when authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe(mockUser.id);
    expect(data.user.email).toBe(mockUser.email);
    expect(data.user.username).toBe(mockUser.username);
    expect(data.user.role).toEqual(mockUser.role);

    expect(sessionModule.getSession).toHaveBeenCalled();
    expect(storageModule.getUserById).toHaveBeenCalledWith("test-user-id");
  });

  it("should return 401 when not authenticated (no session)", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Not authenticated");
    expect(storageModule.getUserById).not.toHaveBeenCalled();
  });

  it("should return 404 when session exists but user was deleted", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("deleted-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
    expect(sessionModule.getSession).toHaveBeenCalled();
    expect(storageModule.getUserById).toHaveBeenCalledWith("deleted-user-id");
  });

  it("should return 500 when database error occurs", async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockRejectedValue(new Error("Database connection failed"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });

  it("should return 500 when session check fails", async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockRejectedValue(new Error("Session error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });

  it("should not include passwordHash in response", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);

    const response = await GET();
    const data = await response.json();

    expect(data.user.passwordHash).toBeUndefined();
  });

  it("should include all public user fields in response", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);

    const response = await GET();
    const data = await response.json();

    // Should include these public fields
    expect(data.user.id).toBeDefined();
    expect(data.user.email).toBeDefined();
    expect(data.user.username).toBeDefined();
    expect(data.user.role).toBeDefined();
    expect(data.user.createdAt).toBeDefined();
    expect(data.user.lastLogin).toBeDefined();
  });

  it("should return user with administrator role", async () => {
    const adminUser: User = {
      ...mockUser,
      role: ["user", "administrator"],
    };

    vi.mocked(sessionModule.getSession).mockResolvedValue("admin-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(adminUser);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user.role).toEqual(["user", "administrator"]);
  });
});
