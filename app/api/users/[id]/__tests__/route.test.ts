/**
 * Tests for /api/users/[id] endpoint
 *
 * Tests admin user update (PUT) and delete (DELETE) functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { PUT, DELETE } from "../route";
import * as middlewareModule from "@/lib/auth/middleware";
import * as usersModule from "@/lib/storage/users";
import * as auditModule from "@/lib/storage/user-audit";
import * as validationModule from "@/lib/auth/validation";
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
vi.mock("@/lib/storage/user-audit");
vi.mock("@/lib/auth/validation");

describe("PUT /api/users/[id]", () => {
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
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
  };

  const mockTargetUser: User = {
    id: "target-user-id",
    email: "target@example.com",
    username: "target",
    passwordHash: "hashed",
    role: ["user"],
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
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
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
  };

  const createMockRequest = (body: object): NextRequest => {
    return {
      json: async () => body,
    } as NextRequest;
  };

  const createMockParams = (id: string) => ({
    params: Promise.resolve({ id }),
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Default validations pass
    vi.mocked(validationModule.isValidEmail).mockReturnValue(true);
    vi.mocked(validationModule.isValidUsername).mockReturnValue(true);
  });

  it("should return 403 when not authenticated", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
      new Error("Authentication required")
    );

    const request = createMockRequest({ email: "new@example.com" });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 403 when not admin", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
      new Error("Administrator access required")
    );

    const request = createMockRequest({ email: "new@example.com" });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Administrator access required");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest({ email: "new@example.com" });
    const { params } = createMockParams("nonexistent-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should update email with valid format", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(usersModule.updateUserEmail).mockResolvedValue({
      ...mockTargetUser,
      email: "new@example.com",
    });

    const request = createMockRequest({ email: "new@example.com" });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe("new@example.com");
    expect(usersModule.updateUserEmail).toHaveBeenCalledWith(
      "target-user-id",
      "new@example.com",
      "admin-user-id"
    );
  });

  it("should return 400 for invalid email format", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(validationModule.isValidEmail).mockReturnValue(false);

    const request = createMockRequest({ email: "invalid-email" });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid email format");
  });

  it("should update username with valid length", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(usersModule.updateUsername).mockResolvedValue({
      ...mockTargetUser,
      username: "newusername",
    });

    const request = createMockRequest({ username: "newusername" });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.username).toBe("newusername");
    expect(usersModule.updateUsername).toHaveBeenCalledWith(
      "target-user-id",
      "newusername",
      "admin-user-id"
    );
  });

  it("should return 400 for invalid username", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(validationModule.isValidUsername).mockReturnValue(false);

    const request = createMockRequest({ username: "ab" });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Username must be between 3 and 50 characters");
  });

  it("should update user roles", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue([mockAdminUser, mockTargetUser]);
    vi.mocked(usersModule.updateUserRoles).mockResolvedValue({
      ...mockTargetUser,
      role: ["user", "gamemaster"],
    });

    const request = createMockRequest({ role: ["user", "gamemaster"] });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.role).toContain("gamemaster");
    expect(usersModule.updateUserRoles).toHaveBeenCalledWith(
      "target-user-id",
      ["user", "gamemaster"],
      "admin-user-id"
    );
  });

  it("should return 400 when role not array", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);

    const request = createMockRequest({ role: "user" });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Role must be an array");
  });

  it("should return 400 when role array empty", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);

    const request = createMockRequest({ role: [] });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User must have at least one role");
  });

  it("should return 400 for invalid role values", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);

    const request = createMockRequest({ role: ["user", "superadmin"] });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Invalid role(s)");
  });

  it("should return 400 removing admin from last admin", async () => {
    const adminUser: User = { ...mockTargetUser, role: ["administrator"] };
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(adminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue([adminUser]); // Only one admin

    const request = createMockRequest({ role: ["user"] });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("last administrator");
  });

  it("should allow removing admin when others exist", async () => {
    const adminUser: User = { ...mockTargetUser, role: ["administrator"] };
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(adminUser);
    vi.mocked(usersModule.getAllUsers).mockResolvedValue([mockAdminUser, adminUser]); // Two admins
    vi.mocked(usersModule.updateUserRoles).mockResolvedValue({
      ...adminUser,
      role: ["user"],
    });

    const request = createMockRequest({ role: ["user"] });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.role).toContain("user");
  });

  it("should call audit functions with admin userId", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(usersModule.updateUserEmail).mockResolvedValue({
      ...mockTargetUser,
      email: "new@example.com",
    });

    const request = createMockRequest({ email: "new@example.com" });
    const { params } = createMockParams("target-user-id");
    await PUT(request, { params });

    expect(usersModule.updateUserEmail).toHaveBeenCalledWith(
      "target-user-id",
      "new@example.com",
      "admin-user-id"
    );
  });

  it("should return user without passwordHash", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(usersModule.updateUserEmail).mockResolvedValue({
      ...mockTargetUser,
      email: "new@example.com",
    });

    const request = createMockRequest({ email: "new@example.com" });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.user.passwordHash).toBeUndefined();
  });

  it("should return 500 on server error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest({ email: "new@example.com" });
    const { params } = createMockParams("target-user-id");
    const response = await PUT(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred while updating user");

    consoleErrorSpy.mockRestore();
  });
});

describe("DELETE /api/users/[id]", () => {
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
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
  };

  const mockTargetUser: User = {
    id: "target-user-id",
    email: "target@example.com",
    username: "target",
    passwordHash: "hashed",
    role: ["user"],
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
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
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
  };

  const createMockParams = (id: string) => ({
    params: Promise.resolve({ id }),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 403 when not authenticated", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
      new Error("Authentication required")
    );

    const request = {} as NextRequest;
    const { params } = createMockParams("target-user-id");
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should return 403 when not admin", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
      new Error("Administrator access required")
    );

    const request = {} as NextRequest;
    const { params } = createMockParams("target-user-id");
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Administrator access required");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = {} as NextRequest;
    const { params } = createMockParams("nonexistent-id");
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 400 deleting last administrator", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue({
      ...mockTargetUser,
      role: ["administrator"],
    });
    vi.mocked(usersModule.isLastAdmin).mockResolvedValue(true);

    const request = {} as NextRequest;
    const { params } = createMockParams("target-user-id");
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("last administrator");
  });

  it("should archive audit log before deletion", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(usersModule.isLastAdmin).mockResolvedValue(false);
    vi.mocked(auditModule.archiveUserAuditLog).mockResolvedValue(undefined);
    vi.mocked(usersModule.deleteUser).mockResolvedValue(undefined);

    const request = {} as NextRequest;
    const { params } = createMockParams("target-user-id");
    await DELETE(request, { params });

    expect(auditModule.archiveUserAuditLog).toHaveBeenCalledWith(
      "target-user-id",
      "admin-user-id",
      {
        email: "target@example.com",
        username: "target",
      }
    );
  });

  it("should delete user successfully", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(usersModule.isLastAdmin).mockResolvedValue(false);
    vi.mocked(auditModule.archiveUserAuditLog).mockResolvedValue(undefined);
    vi.mocked(usersModule.deleteUser).mockResolvedValue(undefined);

    const request = {} as NextRequest;
    const { params } = createMockParams("target-user-id");
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(usersModule.deleteUser).toHaveBeenCalledWith("target-user-id");
  });

  it("should return 500 on server error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(usersModule.getUserById).mockRejectedValue(new Error("Database error"));

    const request = {} as NextRequest;
    const { params } = createMockParams("target-user-id");
    const response = await DELETE(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred while deleting user");

    consoleErrorSpy.mockRestore();
  });
});
