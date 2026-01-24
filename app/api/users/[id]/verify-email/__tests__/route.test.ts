/**
 * Tests for /api/users/[id]/verify-email endpoint
 *
 * Tests admin ability to manually verify user emails.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../route";
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

describe("Manual Verify Email API", () => {
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
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
  };

  const createUnverifiedUser = (): User => ({
    id: "unverified-user-id",
    email: "unverified@example.com",
    username: "unverifieduser",
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
    emailVerified: false,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
  });

  const createVerifiedUser = (): User => ({
    id: "verified-user-id",
    email: "verified@example.com",
    username: "verifieduser",
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
    emailVerifiedAt: new Date().toISOString(),
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
  });

  const createMockParams = (id: string) => ({
    params: Promise.resolve({ id }),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/users/[id]/verify-email", () => {
    it("should manually verify an unverified user email", async () => {
      const unverifiedUser = createUnverifiedUser();
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(stripPasswordHash(mockAdminUser));
      vi.mocked(storageModule.getUserById).mockResolvedValue(unverifiedUser);
      vi.mocked(storageModule.markEmailVerified).mockResolvedValue({
        ...unverifiedUser,
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
      });
      vi.mocked(userAuditModule.createUserAuditEntry).mockResolvedValue({
        id: "audit-id",
        timestamp: new Date().toISOString(),
        action: "user_email_admin_verified",
        actor: { userId: mockAdminUser.id, role: "admin" },
        targetUserId: unverifiedUser.id,
        details: {},
      });

      const request = {} as NextRequest;
      const { params } = createMockParams("unverified-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.emailVerified).toBe(true);
      expect(storageModule.markEmailVerified).toHaveBeenCalledWith("unverified-user-id");
      expect(userAuditModule.createUserAuditEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "user_email_admin_verified",
          actor: { userId: mockAdminUser.id, role: "admin" },
          targetUserId: "unverified-user-id",
        })
      );
    });

    it("should return success gracefully if user email is already verified", async () => {
      const verifiedUser = createVerifiedUser();
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(stripPasswordHash(mockAdminUser));
      vi.mocked(storageModule.getUserById).mockResolvedValue(verifiedUser);

      const request = {} as NextRequest;
      const { params } = createMockParams("verified-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.emailVerified).toBe(true);
      // Should not call markEmailVerified if already verified
      expect(storageModule.markEmailVerified).not.toHaveBeenCalled();
      // Should not create audit entry if already verified
      expect(userAuditModule.createUserAuditEntry).not.toHaveBeenCalled();
    });

    it("should return 404 if user not found", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(stripPasswordHash(mockAdminUser));
      vi.mocked(storageModule.getUserById).mockResolvedValue(null);

      const request = {} as NextRequest;
      const { params } = createMockParams("nonexistent-id");
      const response = await POST(request, { params });
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
      const { params } = createMockParams("unverified-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    it("should return 403 if not authenticated", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
        new Error("Authentication required")
      );

      const request = {} as NextRequest;
      const { params } = createMockParams("unverified-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });
});
