/**
 * Tests for /api/users/[id]/resend-verification endpoint
 *
 * Tests admin ability to resend verification emails.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../route";
import * as middlewareModule from "@/lib/auth/middleware";
import * as storageModule from "@/lib/storage/users";
import * as emailVerificationModule from "@/lib/auth/email-verification";
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
vi.mock("@/lib/auth/email-verification");
vi.mock("@/lib/storage/user-audit");

// Create a mock rate limiter that we can control per test
// Use vi.hoisted so the variable is available when the mock factory runs
const { mockIsRateLimited } = vi.hoisted(() => ({
  mockIsRateLimited: vi.fn().mockReturnValue(false),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  RateLimiter: {
    get: vi.fn().mockReturnValue({
      isRateLimited: mockIsRateLimited,
      getRemaining: vi.fn().mockReturnValue(3),
      reset: vi.fn(),
    }),
  },
}));

describe("Resend Verification API", () => {
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
    // Reset rate limiter to allow requests by default
    mockIsRateLimited.mockReturnValue(false);
  });

  describe("POST /api/users/[id]/resend-verification", () => {
    it("should resend verification email for unverified user", async () => {
      const unverifiedUser = createUnverifiedUser();
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(stripPasswordHash(mockAdminUser));
      vi.mocked(storageModule.getUserById).mockResolvedValue(unverifiedUser);
      vi.mocked(emailVerificationModule.sendVerificationEmail).mockResolvedValue({ success: true });
      vi.mocked(userAuditModule.createUserAuditEntry).mockResolvedValue({
        id: "audit-id",
        timestamp: new Date().toISOString(),
        action: "user_verification_admin_resent",
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
      expect(emailVerificationModule.sendVerificationEmail).toHaveBeenCalledWith(
        unverifiedUser.id,
        unverifiedUser.email,
        unverifiedUser.username,
        expect.any(String)
      );
      expect(userAuditModule.createUserAuditEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "user_verification_admin_resent",
          actor: { userId: mockAdminUser.id, role: "admin" },
          targetUserId: "unverified-user-id",
        })
      );
    });

    it("should return 400 if user email is already verified", async () => {
      const verifiedUser = createVerifiedUser();
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(stripPasswordHash(mockAdminUser));
      vi.mocked(storageModule.getUserById).mockResolvedValue(verifiedUser);

      const request = {} as NextRequest;
      const { params } = createMockParams("verified-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("already verified");
      expect(emailVerificationModule.sendVerificationEmail).not.toHaveBeenCalled();
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

    it("should return 429 if rate limited", async () => {
      const unverifiedUser = createUnverifiedUser();
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(stripPasswordHash(mockAdminUser));
      vi.mocked(storageModule.getUserById).mockResolvedValue(unverifiedUser);
      // Set rate limiter to return true (rate limited)
      mockIsRateLimited.mockReturnValue(true);

      const request = {} as NextRequest;
      const { params } = createMockParams("unverified-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Too many");
      expect(emailVerificationModule.sendVerificationEmail).not.toHaveBeenCalled();
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

    it("should return 500 if email sending fails", async () => {
      const unverifiedUser = createUnverifiedUser();
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(stripPasswordHash(mockAdminUser));
      vi.mocked(storageModule.getUserById).mockResolvedValue(unverifiedUser);
      vi.mocked(emailVerificationModule.sendVerificationEmail).mockResolvedValue({
        success: false,
        error: "SMTP error",
      });

      const request = {} as NextRequest;
      const { params } = createMockParams("unverified-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toContain("SMTP error");
    });
  });
});
