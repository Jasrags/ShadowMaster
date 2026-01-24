/**
 * Tests for password reset functionality
 *
 * Tests token generation, validation, and password reset flow.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";
import {
  generatePasswordResetToken,
  sendPasswordResetEmail,
  validateResetToken,
  resetPassword,
  requestPasswordReset,
} from "../password-reset";
import * as usersStorage from "@/lib/storage/users";
import * as emailModule from "@/lib/email";
import { AuditLogger } from "@/lib/security/audit-logger";
import type { User } from "@/lib/types/user";

// Mock dependencies
vi.mock("@/lib/storage/users");
vi.mock("@/lib/email");
vi.mock("@/lib/security/audit-logger");

describe("password-reset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(AuditLogger.log).mockResolvedValue(undefined);
  });

  describe("generatePasswordResetToken", () => {
    it("should generate a token with 32 bytes of entropy", async () => {
      const result = await generatePasswordResetToken();

      // URL-safe base64 of 32 bytes = 43 characters
      expect(result.token.length).toBe(43);
      // Should not contain any URL-unsafe characters
      expect(result.token).not.toMatch(/[+/=]/);
    });

    it("should generate a bcrypt hash", async () => {
      const result = await generatePasswordResetToken();

      // bcrypt hashes start with $2a$ or $2b$
      expect(result.tokenHash).toMatch(/^\$2[ab]\$/);
    });

    it("should set expiration to 1 hour from now", async () => {
      const before = Date.now();
      const result = await generatePasswordResetToken();
      const after = Date.now();

      const expiresAt = new Date(result.expiresAt).getTime();
      const oneHourInMs = 60 * 60 * 1000;

      // Should expire roughly 1 hour from now (within 1 second tolerance)
      expect(expiresAt).toBeGreaterThanOrEqual(before + oneHourInMs - 1000);
      expect(expiresAt).toBeLessThanOrEqual(after + oneHourInMs + 1000);
    });

    it("should generate unique tokens", async () => {
      const results = await Promise.all([
        generatePasswordResetToken(),
        generatePasswordResetToken(),
        generatePasswordResetToken(),
      ]);

      const tokens = results.map((r) => r.token);
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(tokens.length);
    });
  });

  describe("sendPasswordResetEmail", () => {
    const mockUserId = "user-123";
    const mockEmail = "test@example.com";
    const mockUsername = "testuser";
    const mockBaseUrl = "http://localhost:3000";

    beforeEach(() => {
      vi.mocked(usersStorage.clearPasswordResetToken).mockResolvedValue({} as User);
      vi.mocked(usersStorage.setPasswordResetToken).mockResolvedValue({} as User);
    });

    it("should clear existing token before generating new one", async () => {
      vi.mocked(emailModule.sendEmail).mockResolvedValue({
        success: true,
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(emailModule.renderTemplate).mockResolvedValue({
        html: "<html></html>",
        text: "text",
      });

      await sendPasswordResetEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(usersStorage.clearPasswordResetToken).toHaveBeenCalledWith(mockUserId);
    });

    it("should store the token hash", async () => {
      vi.mocked(emailModule.sendEmail).mockResolvedValue({
        success: true,
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(emailModule.renderTemplate).mockResolvedValue({
        html: "<html></html>",
        text: "text",
      });

      await sendPasswordResetEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(usersStorage.setPasswordResetToken).toHaveBeenCalledWith(
        mockUserId,
        expect.stringMatching(/^\$2[ab]\$/), // bcrypt hash
        expect.any(String) // expiration timestamp
      );
    });

    it("should send email with reset link", async () => {
      vi.mocked(emailModule.sendEmail).mockResolvedValue({
        success: true,
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(emailModule.renderTemplate).mockResolvedValue({
        html: "<html></html>",
        text: "text",
      });

      await sendPasswordResetEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(emailModule.sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: { email: mockEmail, name: mockUsername },
          subject: "Reset your Shadow Master password",
        })
      );
    });

    it("should return success when email is sent", async () => {
      vi.mocked(emailModule.sendEmail).mockResolvedValue({
        success: true,
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(emailModule.renderTemplate).mockResolvedValue({
        html: "<html></html>",
        text: "text",
      });

      const result = await sendPasswordResetEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(result.success).toBe(true);
    });

    it("should log successful send", async () => {
      vi.mocked(emailModule.sendEmail).mockResolvedValue({
        success: true,
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(emailModule.renderTemplate).mockResolvedValue({
        html: "<html></html>",
        text: "text",
      });

      await sendPasswordResetEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "password_reset.sent",
          userId: mockUserId,
          email: mockEmail,
        })
      );
    });

    it("should return error when email sending fails", async () => {
      vi.mocked(emailModule.sendEmail).mockResolvedValue({
        success: false,
        error: "SMTP connection failed",
        transport: "smtp",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(emailModule.renderTemplate).mockResolvedValue({
        html: "<html></html>",
        text: "text",
      });

      const result = await sendPasswordResetEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(result.success).toBe(false);
      expect(result.error).toBe("SMTP connection failed");
    });
  });

  describe("validateResetToken", () => {
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
      emailVerifiedAt: null,
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
      passwordResetTokenHash: "hash",
      passwordResetTokenExpiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      magicLinkTokenHash: null,
      magicLinkTokenExpiresAt: null,
    };

    it("should return valid for a valid token", async () => {
      vi.mocked(usersStorage.getUserByPasswordResetToken).mockResolvedValue(mockUser);

      const result = await validateResetToken("valid-token");

      expect(result.valid).toBe(true);
      expect(result.userId).toBe(mockUser.id);
    });

    it("should return invalid for non-existent token", async () => {
      vi.mocked(usersStorage.getUserByPasswordResetToken).mockResolvedValue(null);

      const result = await validateResetToken("invalid-token");

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("invalid");
    });

    it("should return expired for expired token", async () => {
      const expiredUser = {
        ...mockUser,
        passwordResetTokenExpiresAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      };
      vi.mocked(usersStorage.getUserByPasswordResetToken).mockResolvedValue(expiredUser);

      const result = await validateResetToken("expired-token");

      expect(result.valid).toBe(false);
      expect(result.reason).toBe("expired");
    });
  });

  describe("resetPassword", () => {
    const mockUser: User = {
      id: "user-123",
      email: "test@example.com",
      username: "testuser",
      passwordHash: "old-hash",
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
      emailVerifiedAt: null,
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
      passwordResetTokenHash: "hash",
      passwordResetTokenExpiresAt: new Date(Date.now() + 3600000).toISOString(),
      magicLinkTokenHash: null,
      magicLinkTokenExpiresAt: null,
    };

    beforeEach(() => {
      vi.mocked(usersStorage.updateUserPassword).mockResolvedValue({
        ...mockUser,
        sessionVersion: 2,
      });
    });

    it("should return success for valid reset", async () => {
      vi.mocked(usersStorage.getUserByPasswordResetToken).mockResolvedValue(mockUser);

      const result = await resetPassword("valid-token", "NewPassword123!");

      expect(result.success).toBe(true);
      expect(result.userId).toBe(mockUser.id);
    });

    it("should update password with new hash", async () => {
      vi.mocked(usersStorage.getUserByPasswordResetToken).mockResolvedValue(mockUser);

      await resetPassword("valid-token", "NewPassword123!");

      expect(usersStorage.updateUserPassword).toHaveBeenCalledWith(
        mockUser.id,
        expect.stringMatching(/^\$2[ab]\$/) // bcrypt hash
      );
    });

    it("should log successful reset", async () => {
      vi.mocked(usersStorage.getUserByPasswordResetToken).mockResolvedValue(mockUser);

      await resetPassword("valid-token", "NewPassword123!");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "password_reset.success",
          userId: mockUser.id,
          email: mockUser.email,
        })
      );
    });

    it("should return error for invalid token", async () => {
      vi.mocked(usersStorage.getUserByPasswordResetToken).mockResolvedValue(null);

      const result = await resetPassword("invalid-token", "NewPassword123!");

      expect(result.success).toBe(false);
      expect(result.error).toBe("invalid_token");
    });

    it("should return error for expired token", async () => {
      const expiredUser = {
        ...mockUser,
        passwordResetTokenExpiresAt: new Date(Date.now() - 3600000).toISOString(),
      };
      vi.mocked(usersStorage.getUserByPasswordResetToken).mockResolvedValue(expiredUser);

      const result = await resetPassword("expired-token", "NewPassword123!");

      expect(result.success).toBe(false);
      expect(result.error).toBe("expired_token");
    });

    it("should log failed reset attempts", async () => {
      vi.mocked(usersStorage.getUserByPasswordResetToken).mockResolvedValue(null);

      await resetPassword("invalid-token", "NewPassword123!");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "password_reset.failed",
          metadata: expect.objectContaining({ reason: "invalid_token" }),
        })
      );
    });
  });

  describe("requestPasswordReset", () => {
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
      emailVerifiedAt: null,
      emailVerificationTokenHash: null,
      emailVerificationTokenExpiresAt: null,
      passwordResetTokenHash: null,
      passwordResetTokenExpiresAt: null,
      magicLinkTokenHash: null,
      magicLinkTokenExpiresAt: null,
    };

    beforeEach(() => {
      vi.mocked(usersStorage.clearPasswordResetToken).mockResolvedValue({} as User);
      vi.mocked(usersStorage.setPasswordResetToken).mockResolvedValue({} as User);
      vi.mocked(emailModule.sendEmail).mockResolvedValue({
        success: true,
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(emailModule.renderTemplate).mockResolvedValue({
        html: "<html></html>",
        text: "text",
      });
    });

    it("should always return success (prevent email enumeration)", async () => {
      vi.mocked(usersStorage.getUserByEmail).mockResolvedValue(null);

      const result = await requestPasswordReset("nonexistent@example.com", "http://localhost:3000");

      expect(result.success).toBe(true);
    });

    it("should send email when user exists", async () => {
      vi.mocked(usersStorage.getUserByEmail).mockResolvedValue(mockUser);

      await requestPasswordReset(mockUser.email, "http://localhost:3000");

      expect(emailModule.sendEmail).toHaveBeenCalled();
    });

    it("should not send email when user does not exist", async () => {
      vi.mocked(usersStorage.getUserByEmail).mockResolvedValue(null);

      await requestPasswordReset("nonexistent@example.com", "http://localhost:3000");

      expect(emailModule.sendEmail).not.toHaveBeenCalled();
    });

    it("should log all requests", async () => {
      vi.mocked(usersStorage.getUserByEmail).mockResolvedValue(null);

      await requestPasswordReset("test@example.com", "http://localhost:3000", "192.168.1.1");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "password_reset.requested",
          email: "test@example.com",
          ip: "192.168.1.1",
        })
      );
    });
  });
});
