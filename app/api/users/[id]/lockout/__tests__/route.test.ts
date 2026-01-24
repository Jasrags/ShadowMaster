/**
 * Tests for /api/users/[id]/lockout endpoint
 *
 * Tests admin ability to clear login lockouts.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { DELETE } from "../route";
import * as middlewareModule from "@/lib/auth/middleware";
import * as storageModule from "@/lib/storage/users";
import * as userAuditModule from "@/lib/storage/user-audit";
import type { User } from "@/lib/types/user";

// Helper to create public user (strips passwordHash)
function stripPasswordHash(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
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

describe("User Lockout API", () => {
  const mockAdminUser: User = {
    id: "admin-user-id",
    email: "admin@example.com",
    username: "admin",
    passwordHash: "hashed",
    role: ["administrator"],
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
  };

  const createLockedUser = (): User => {
    const lockoutUntil = new Date();
    lockoutUntil.setMinutes(lockoutUntil.getMinutes() + 15); // 15 minutes in future
    return {
      id: "locked-user-id",
      email: "locked@example.com",
      username: "lockeduser",
      passwordHash: "hashed",
      role: ["user"],
      createdAt: new Date().toISOString(),
      lastLogin: null,
      characters: [],
      failedLoginAttempts: 5,
      lockoutUntil: lockoutUntil.toISOString(),
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
  };

  const createUnlockedUser = (): User => ({
    id: "unlocked-user-id",
    email: "unlocked@example.com",
    username: "unlockeduser",
    passwordHash: "hashed",
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
  });

  const createMockParams = (id: string) => ({
    params: Promise.resolve({ id }),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DELETE /api/users/[id]/lockout", () => {
    it("should unlock a locked user", async () => {
      const lockedUser = createLockedUser();
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(stripPasswordHash(mockAdminUser));
      vi.mocked(storageModule.getUserById).mockResolvedValue(lockedUser);
      vi.mocked(storageModule.resetFailedAttempts).mockResolvedValue({
        ...lockedUser,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      });
      vi.mocked(userAuditModule.createUserAuditEntry).mockResolvedValue({
        id: "audit-id",
        timestamp: new Date().toISOString(),
        action: "user_lockout_admin_cleared",
        actor: { userId: mockAdminUser.id, role: "admin" },
        targetUserId: lockedUser.id,
        details: {},
      });

      const request = {} as NextRequest;
      const { params } = createMockParams("locked-user-id");
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.failedLoginAttempts).toBe(0);
      expect(data.user.lockoutUntil).toBeNull();
      expect(storageModule.resetFailedAttempts).toHaveBeenCalledWith("locked-user-id");
      expect(userAuditModule.createUserAuditEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "user_lockout_admin_cleared",
          actor: { userId: mockAdminUser.id, role: "admin" },
          targetUserId: "locked-user-id",
        })
      );
    });

    it("should return success gracefully if user is not locked out", async () => {
      const unlockedUser = createUnlockedUser();
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(stripPasswordHash(mockAdminUser));
      vi.mocked(storageModule.getUserById).mockResolvedValue(unlockedUser);

      const request = {} as NextRequest;
      const { params } = createMockParams("unlocked-user-id");
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // Should not call resetFailedAttempts if not locked
      expect(storageModule.resetFailedAttempts).not.toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(stripPasswordHash(mockAdminUser));
      vi.mocked(storageModule.getUserById).mockResolvedValue(null);

      const request = {} as NextRequest;
      const { params } = createMockParams("nonexistent-id");
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain("not found");
    });

    it("should return 403 if not admin", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
        new Error("Administrator access required")
      );

      const request = {} as NextRequest;
      const { params } = createMockParams("locked-user-id");
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    it("should return 403 if not authenticated", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
        new Error("Authentication required")
      );

      const request = {} as NextRequest;
      const { params } = createMockParams("locked-user-id");
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });
});
