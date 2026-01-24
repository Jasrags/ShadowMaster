/**
 * Magic Link Authentication Tests
 *
 * Tests for magic link token generation, sending, and verification.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { User } from "@/lib/types";
import {
  generateMagicLinkToken,
  sendMagicLinkEmail,
  requestMagicLink,
  verifyMagicLink,
  hasPendingMagicLink,
} from "../magic-link";

// Mock dependencies
vi.mock("@/lib/storage/users", () => ({
  getUserByMagicLinkToken: vi.fn(),
  setMagicLinkToken: vi.fn(),
  clearMagicLinkToken: vi.fn(),
  getUserById: vi.fn(),
  getUserByEmail: vi.fn(),
  resetFailedAttempts: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(),
  renderTemplate: vi.fn(),
}));

vi.mock("@/lib/email/templates/magic-link-email", () => ({
  MagicLinkEmailTemplate: vi.fn(),
}));

vi.mock("@/lib/security/audit-logger", () => ({
  AuditLogger: {
    log: vi.fn(),
  },
}));

import * as usersStorage from "@/lib/storage/users";
import * as email from "@/lib/email";
import { AuditLogger } from "@/lib/security/audit-logger";

describe("Magic Link Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("generateMagicLinkToken", () => {
    it("should generate a token with 32 bytes of entropy", async () => {
      const result = await generateMagicLinkToken();

      // Base64url encodes 32 bytes as 43 characters (no padding)
      expect(result.token.length).toBe(43);
      expect(result.token).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it("should generate a bcrypt hash of the token", async () => {
      const result = await generateMagicLinkToken();

      expect(result.tokenHash).toMatch(/^\$2[aby]?\$\d{2}\$/);
    });

    it("should set expiration to 15 minutes in the future", async () => {
      const beforeTime = Date.now();
      const result = await generateMagicLinkToken();
      const afterTime = Date.now();

      const expiresAt = new Date(result.expiresAt).getTime();

      // Should be between 14 and 16 minutes from now (allowing for test execution time)
      const fifteenMinutes = 15 * 60 * 1000;
      expect(expiresAt).toBeGreaterThanOrEqual(beforeTime + fifteenMinutes - 1000);
      expect(expiresAt).toBeLessThanOrEqual(afterTime + fifteenMinutes + 1000);
    });

    it("should generate unique tokens each time", async () => {
      const result1 = await generateMagicLinkToken();
      const result2 = await generateMagicLinkToken();

      expect(result1.token).not.toBe(result2.token);
      expect(result1.tokenHash).not.toBe(result2.tokenHash);
    });
  });

  describe("sendMagicLinkEmail", () => {
    const mockUser: User = {
      id: "user-123",
      email: "test@example.com",
      username: "testuser",
      passwordHash: "hash",
      role: ["user"],
      preferences: { theme: "system", navigationCollapsed: false },
      createdAt: new Date().toISOString(),
      lastLogin: null,
      characters: [],
      failedLoginAttempts: 0,
      lockoutUntil: null,
      sessionVersion: 1,
      sessionSecretHash: null,
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
      emailVerificationTokenPrefix: null,
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
      passwordResetTokenPrefix: null,
      magicLinkTokenHash: null,
      magicLinkTokenExpiresAt: null,
      magicLinkTokenPrefix: null,
    };

    beforeEach(() => {
      vi.mocked(usersStorage.getUserById).mockResolvedValue(mockUser);
      vi.mocked(usersStorage.clearMagicLinkToken).mockResolvedValue(mockUser);
      vi.mocked(usersStorage.setMagicLinkToken).mockResolvedValue(mockUser);
      vi.mocked(email.renderTemplate).mockResolvedValue({
        html: "<p>Test</p>",
        text: "Test",
      });
      vi.mocked(email.sendEmail).mockResolvedValue({
        success: true,
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
    });

    it("should clear existing token, generate new token, store hash, and send email", async () => {
      const result = await sendMagicLinkEmail(
        mockUser.id,
        mockUser.email,
        mockUser.username,
        "http://localhost:3000"
      );

      expect(result.success).toBe(true);
      expect(usersStorage.clearMagicLinkToken).toHaveBeenCalledWith(mockUser.id);
      expect(usersStorage.setMagicLinkToken).toHaveBeenCalledWith(
        mockUser.id,
        expect.any(String),
        expect.any(String),
        expect.any(String) // prefix
      );
      expect(email.sendEmail).toHaveBeenCalledWith({
        to: { email: mockUser.email, name: mockUser.username },
        subject: "Sign in to Shadow Master",
        html: expect.any(String),
        text: expect.any(String),
      });
    });

    it("should reject unverified email users", async () => {
      const unverifiedUser = { ...mockUser, emailVerified: false };
      vi.mocked(usersStorage.getUserById).mockResolvedValue(unverifiedUser);

      const result = await sendMagicLinkEmail(
        unverifiedUser.id,
        unverifiedUser.email,
        unverifiedUser.username,
        "http://localhost:3000"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("email_not_verified");
      expect(usersStorage.setMagicLinkToken).not.toHaveBeenCalled();
      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "magic_link.failed",
          metadata: { reason: "email_not_verified" },
        })
      );
    });

    it("should reject locked account users", async () => {
      const lockedUser = {
        ...mockUser,
        lockoutUntil: new Date(Date.now() + 3600000).toISOString(),
      };
      vi.mocked(usersStorage.getUserById).mockResolvedValue(lockedUser);

      const result = await sendMagicLinkEmail(
        lockedUser.id,
        lockedUser.email,
        lockedUser.username,
        "http://localhost:3000"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("account_locked");
      expect(usersStorage.setMagicLinkToken).not.toHaveBeenCalled();
    });

    it("should reject suspended account users", async () => {
      const suspendedUser = { ...mockUser, accountStatus: "suspended" as const };
      vi.mocked(usersStorage.getUserById).mockResolvedValue(suspendedUser);

      const result = await sendMagicLinkEmail(
        suspendedUser.id,
        suspendedUser.email,
        suspendedUser.username,
        "http://localhost:3000"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("account_suspended");
    });

    it("should log successful email send", async () => {
      await sendMagicLinkEmail(
        mockUser.id,
        mockUser.email,
        mockUser.username,
        "http://localhost:3000"
      );

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "magic_link.sent",
          userId: mockUser.id,
          email: mockUser.email,
        })
      );
    });

    it("should return error if email send fails", async () => {
      vi.mocked(email.sendEmail).mockResolvedValue({
        success: false,
        error: "SMTP connection failed",
        transport: "mock",
        timestamp: new Date().toISOString(),
      });

      const result = await sendMagicLinkEmail(
        mockUser.id,
        mockUser.email,
        mockUser.username,
        "http://localhost:3000"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("SMTP connection failed");
    });
  });

  describe("requestMagicLink", () => {
    const mockUser: User = {
      id: "user-123",
      email: "test@example.com",
      username: "testuser",
      passwordHash: "hash",
      role: ["user"],
      preferences: { theme: "system", navigationCollapsed: false },
      createdAt: new Date().toISOString(),
      lastLogin: null,
      characters: [],
      failedLoginAttempts: 0,
      lockoutUntil: null,
      sessionVersion: 1,
      sessionSecretHash: null,
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
      emailVerificationTokenPrefix: null,
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
      passwordResetTokenPrefix: null,
      magicLinkTokenHash: null,
      magicLinkTokenExpiresAt: null,
      magicLinkTokenPrefix: null,
    };

    beforeEach(() => {
      vi.mocked(usersStorage.getUserById).mockResolvedValue(mockUser);
      vi.mocked(usersStorage.getUserByEmail).mockResolvedValue(mockUser);
      vi.mocked(usersStorage.clearMagicLinkToken).mockResolvedValue(mockUser);
      vi.mocked(usersStorage.setMagicLinkToken).mockResolvedValue(mockUser);
      vi.mocked(email.renderTemplate).mockResolvedValue({
        html: "<p>Test</p>",
        text: "Test",
      });
      vi.mocked(email.sendEmail).mockResolvedValue({
        success: true,
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
    });

    it("should always return success (email enumeration prevention)", async () => {
      const result = await requestMagicLink(
        "test@example.com",
        "http://localhost:3000",
        "127.0.0.1"
      );

      expect(result.success).toBe(true);
    });

    it("should return success even for non-existent email", async () => {
      vi.mocked(usersStorage.getUserByEmail).mockResolvedValue(null);

      const result = await requestMagicLink(
        "nonexistent@example.com",
        "http://localhost:3000",
        "127.0.0.1"
      );

      expect(result.success).toBe(true);
      expect(email.sendEmail).not.toHaveBeenCalled();
    });

    it("should log the request for existing users", async () => {
      await requestMagicLink("test@example.com", "http://localhost:3000", "127.0.0.1");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "magic_link.requested",
          email: "test@example.com",
          ip: "127.0.0.1",
        })
      );
    });
  });

  describe("verifyMagicLink", () => {
    const mockUser: User = {
      id: "user-123",
      email: "test@example.com",
      username: "testuser",
      passwordHash: "hash",
      role: ["user"],
      preferences: { theme: "system", navigationCollapsed: false },
      createdAt: new Date().toISOString(),
      lastLogin: null,
      characters: [],
      failedLoginAttempts: 0,
      lockoutUntil: null,
      sessionVersion: 1,
      sessionSecretHash: null,
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
      emailVerificationTokenPrefix: null,
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
      passwordResetTokenPrefix: null,
      magicLinkTokenHash: "hash",
      magicLinkTokenExpiresAt: new Date(Date.now() + 900000).toISOString(), // 15 minutes from now
      magicLinkTokenPrefix: null,
    };

    beforeEach(() => {
      vi.mocked(usersStorage.clearMagicLinkToken).mockResolvedValue(mockUser);
      vi.mocked(usersStorage.resetFailedAttempts).mockResolvedValue(mockUser);
      vi.mocked(usersStorage.updateUser).mockResolvedValue(mockUser);
    });

    it("should return success for valid token", async () => {
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(mockUser);

      const result = await verifyMagicLink("valid-token");

      expect(result.success).toBe(true);
      expect(result.userId).toBe(mockUser.id);
      expect(result.sessionVersion).toBe(mockUser.sessionVersion);
    });

    it("should clear token after successful verification (single-use)", async () => {
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(mockUser);

      await verifyMagicLink("valid-token");

      expect(usersStorage.clearMagicLinkToken).toHaveBeenCalledWith(mockUser.id);
    });

    it("should reset failed login attempts on success", async () => {
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(mockUser);

      await verifyMagicLink("valid-token");

      expect(usersStorage.resetFailedAttempts).toHaveBeenCalledWith(mockUser.id);
    });

    it("should update last login on success", async () => {
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(mockUser);

      await verifyMagicLink("valid-token");

      expect(usersStorage.updateUser).toHaveBeenCalledWith(mockUser.id, {
        lastLogin: expect.any(String),
      });
    });

    it("should return invalid_link for non-existent token", async () => {
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(null);

      const result = await verifyMagicLink("invalid-token");

      expect(result.success).toBe(false);
      expect(result.error).toBe("invalid_link");
    });

    it("should return link_expired for expired token", async () => {
      const expiredUser = {
        ...mockUser,
        magicLinkTokenExpiresAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      };
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(expiredUser);

      const result = await verifyMagicLink("expired-token");

      expect(result.success).toBe(false);
      expect(result.error).toBe("link_expired");
      // Should clear expired token
      expect(usersStorage.clearMagicLinkToken).toHaveBeenCalledWith(expiredUser.id);
    });

    it("should return email_not_verified for unverified email", async () => {
      const unverifiedUser = { ...mockUser, emailVerified: false };
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(unverifiedUser);

      const result = await verifyMagicLink("valid-token");

      expect(result.success).toBe(false);
      expect(result.error).toBe("email_not_verified");
    });

    it("should return account_locked for locked accounts", async () => {
      const lockedUser = {
        ...mockUser,
        lockoutUntil: new Date(Date.now() + 3600000).toISOString(),
      };
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(lockedUser);

      const result = await verifyMagicLink("valid-token");

      expect(result.success).toBe(false);
      expect(result.error).toBe("account_locked");
    });

    it("should return account_suspended for suspended accounts", async () => {
      const suspendedUser = { ...mockUser, accountStatus: "suspended" as const };
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(suspendedUser);

      const result = await verifyMagicLink("valid-token");

      expect(result.success).toBe(false);
      expect(result.error).toBe("account_suspended");
    });

    it("should log successful verification", async () => {
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(mockUser);

      await verifyMagicLink("valid-token");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "magic_link.success",
          userId: mockUser.id,
          email: mockUser.email,
        })
      );
    });

    it("should log failed verification", async () => {
      vi.mocked(usersStorage.getUserByMagicLinkToken).mockResolvedValue(null);

      await verifyMagicLink("invalid-token");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "magic_link.failed",
          metadata: { reason: "invalid_link" },
        })
      );
    });
  });

  describe("hasPendingMagicLink", () => {
    it("should return true when user has valid magic link token", async () => {
      const userWithToken: User = {
        id: "user-123",
        email: "test@example.com",
        username: "testuser",
        passwordHash: "hash",
        role: ["user"],
        preferences: { theme: "system", navigationCollapsed: false },
        createdAt: new Date().toISOString(),
        lastLogin: null,
        characters: [],
        failedLoginAttempts: 0,
        lockoutUntil: null,
        sessionVersion: 1,
        sessionSecretHash: null,
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
        magicLinkTokenHash: "hash",
        magicLinkTokenExpiresAt: new Date(Date.now() + 900000).toISOString(), // 15 minutes from now
        emailVerificationTokenPrefix: null,
        passwordResetTokenPrefix: null,
        magicLinkTokenPrefix: "abc123",
      };
      vi.mocked(usersStorage.getUserById).mockResolvedValue(userWithToken);

      const result = await hasPendingMagicLink("user-123");

      expect(result).toBe(true);
    });

    it("should return false when user has no magic link token", async () => {
      const userWithoutToken: User = {
        id: "user-123",
        email: "test@example.com",
        username: "testuser",
        passwordHash: "hash",
        role: ["user"],
        preferences: { theme: "system", navigationCollapsed: false },
        createdAt: new Date().toISOString(),
        lastLogin: null,
        characters: [],
        failedLoginAttempts: 0,
        lockoutUntil: null,
        sessionVersion: 1,
        sessionSecretHash: null,
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
        emailVerificationTokenPrefix: null,
        passwordResetTokenPrefix: null,
        magicLinkTokenPrefix: null,
      };
      vi.mocked(usersStorage.getUserById).mockResolvedValue(userWithoutToken);

      const result = await hasPendingMagicLink("user-123");

      expect(result).toBe(false);
    });

    it("should return false when user does not exist", async () => {
      vi.mocked(usersStorage.getUserById).mockResolvedValue(null);

      const result = await hasPendingMagicLink("nonexistent-user");

      expect(result).toBe(false);
    });

    it("should return false when magic link token is expired", async () => {
      const userWithExpiredToken: User = {
        id: "user-123",
        email: "test@example.com",
        username: "testuser",
        passwordHash: "hash",
        role: ["user"],
        preferences: { theme: "system", navigationCollapsed: false },
        createdAt: new Date().toISOString(),
        lastLogin: null,
        characters: [],
        failedLoginAttempts: 0,
        lockoutUntil: null,
        sessionVersion: 1,
        sessionSecretHash: null,
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
        magicLinkTokenHash: "hash",
        magicLinkTokenExpiresAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        emailVerificationTokenPrefix: null,
        passwordResetTokenPrefix: null,
        magicLinkTokenPrefix: "abc123",
      };
      vi.mocked(usersStorage.getUserById).mockResolvedValue(userWithExpiredToken);

      const result = await hasPendingMagicLink("user-123");

      expect(result).toBe(false);
    });
  });
});
