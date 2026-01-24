import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import bcrypt from "bcryptjs";

// Mock the dependencies before importing the module
vi.mock("@/lib/storage/users", () => ({
  getUserByVerificationToken: vi.fn(),
  markEmailVerified: vi.fn(),
  setVerificationToken: vi.fn(),
  getUserById: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(),
  renderTemplate: vi.fn(),
}));

vi.mock("@/lib/security/audit-logger", () => ({
  AuditLogger: {
    log: vi.fn(),
  },
}));

vi.mock("@/lib/email/templates/verification-email", () => ({
  VerificationEmailTemplate: vi.fn(() => "mock-template"),
}));

import {
  generateVerificationToken,
  sendVerificationEmail,
  verifyEmailToken,
  isEmailVerified,
} from "../email-verification";
import {
  getUserByVerificationToken,
  markEmailVerified,
  setVerificationToken,
  getUserById,
} from "@/lib/storage/users";
import { sendEmail, renderTemplate } from "@/lib/email";
import { AuditLogger } from "@/lib/security/audit-logger";
import type { User } from "@/lib/types/user";

describe("email-verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("generateVerificationToken", () => {
    it("generates a token with at least 32 bytes of entropy", async () => {
      const { token } = await generateVerificationToken();

      // URL-safe base64 encoded 32 bytes = 43 characters
      expect(token.length).toBeGreaterThanOrEqual(43);
    });

    it("generates a URL-safe base64 encoded token", async () => {
      const { token } = await generateVerificationToken();

      // URL-safe base64 should only contain alphanumeric, -, and _
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it("generates a valid bcrypt hash", async () => {
      const { token, tokenHash } = await generateVerificationToken();

      // Hash should start with $2a$ or $2b$ (bcrypt prefix)
      expect(tokenHash).toMatch(/^\$2[ab]\$/);

      // Hash should verify against the original token
      const isValid = await bcrypt.compare(token, tokenHash);
      expect(isValid).toBe(true);
    });

    it("generates unique tokens on each call", async () => {
      const result1 = await generateVerificationToken();
      const result2 = await generateVerificationToken();

      expect(result1.token).not.toBe(result2.token);
      expect(result1.tokenHash).not.toBe(result2.tokenHash);
    });

    it("sets expiration to 24 hours from now", async () => {
      const before = new Date();
      const { expiresAt } = await generateVerificationToken();
      const after = new Date();

      const expiresAtDate = new Date(expiresAt);

      // Should be approximately 24 hours from now
      const minExpected = new Date(before);
      minExpected.setHours(minExpected.getHours() + 24);

      const maxExpected = new Date(after);
      maxExpected.setHours(maxExpected.getHours() + 24);

      expect(expiresAtDate.getTime()).toBeGreaterThanOrEqual(minExpected.getTime());
      expect(expiresAtDate.getTime()).toBeLessThanOrEqual(maxExpected.getTime());
    });

    it("returns an ISO 8601 formatted expiration date", async () => {
      const { expiresAt } = await generateVerificationToken();

      // Should be a valid ISO 8601 date string
      expect(new Date(expiresAt).toISOString()).toBe(expiresAt);
    });
  });

  describe("sendVerificationEmail", () => {
    const mockUserId = "user-123";
    const mockEmail = "test@example.com";
    const mockUsername = "testuser";
    const mockBaseUrl = "http://localhost:3000";

    beforeEach(() => {
      vi.mocked(renderTemplate).mockResolvedValue({
        html: "<html>test</html>",
        text: "test",
      });
    });

    it("generates and stores a verification token", async () => {
      vi.mocked(sendEmail).mockResolvedValue({
        success: true,
        messageId: "msg-123",
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(setVerificationToken).mockResolvedValue({} as User);

      await sendVerificationEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(setVerificationToken).toHaveBeenCalledWith(
        mockUserId,
        expect.stringMatching(/^\$2[ab]\$/), // bcrypt hash
        expect.any(String) // ISO date string
      );
    });

    it("sends an email with the verification URL", async () => {
      vi.mocked(sendEmail).mockResolvedValue({
        success: true,
        messageId: "msg-123",
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(setVerificationToken).mockResolvedValue({} as User);

      await sendVerificationEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: { email: mockEmail, name: mockUsername },
          subject: "Verify your Shadow Master account",
        })
      );
    });

    it("returns success when email is sent", async () => {
      vi.mocked(sendEmail).mockResolvedValue({
        success: true,
        messageId: "msg-123",
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(setVerificationToken).mockResolvedValue({} as User);

      const result = await sendVerificationEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(result.success).toBe(true);
    });

    it("logs successful email send to audit log", async () => {
      vi.mocked(sendEmail).mockResolvedValue({
        success: true,
        messageId: "msg-123",
        transport: "mock",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(setVerificationToken).mockResolvedValue({} as User);

      await sendVerificationEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "verification.sent",
          userId: mockUserId,
          email: mockEmail,
        })
      );
    });

    it("returns error when email sending fails", async () => {
      vi.mocked(sendEmail).mockResolvedValue({
        success: false,
        error: "SMTP connection failed",
        transport: "smtp",
        timestamp: new Date().toISOString(),
      });
      vi.mocked(setVerificationToken).mockResolvedValue({} as User);

      const result = await sendVerificationEmail(mockUserId, mockEmail, mockUsername, mockBaseUrl);

      expect(result.success).toBe(false);
      expect(result.error).toBe("SMTP connection failed");
    });
  });

  describe("verifyEmailToken", () => {
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
      accountStatus: "active",
      statusChangedAt: null,
      statusChangedBy: null,
      statusReason: null,
      lastRoleChangeAt: null,
      lastRoleChangeBy: null,
      emailVerified: false,
      emailVerifiedAt: null,
      emailVerificationTokenHash: "hash",
      emailVerificationTokenExpiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    };

    it("returns success for valid token", async () => {
      vi.mocked(getUserByVerificationToken).mockResolvedValue(mockUser);
      vi.mocked(markEmailVerified).mockResolvedValue({
        ...mockUser,
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
      });

      const result = await verifyEmailToken("valid-token");

      expect(result.success).toBe(true);
      expect(result.userId).toBe(mockUser.id);
    });

    it("calls markEmailVerified for valid token", async () => {
      vi.mocked(getUserByVerificationToken).mockResolvedValue(mockUser);
      vi.mocked(markEmailVerified).mockResolvedValue({
        ...mockUser,
        emailVerified: true,
      });

      await verifyEmailToken("valid-token");

      expect(markEmailVerified).toHaveBeenCalledWith(mockUser.id);
    });

    it("logs successful verification to audit log", async () => {
      vi.mocked(getUserByVerificationToken).mockResolvedValue(mockUser);
      vi.mocked(markEmailVerified).mockResolvedValue({
        ...mockUser,
        emailVerified: true,
      });

      await verifyEmailToken("valid-token");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "verification.success",
          userId: mockUser.id,
          email: mockUser.email,
        })
      );
    });

    it("returns invalid_token error for non-existent token", async () => {
      vi.mocked(getUserByVerificationToken).mockResolvedValue(null);

      const result = await verifyEmailToken("invalid-token");

      expect(result.success).toBe(false);
      expect(result.error).toBe("invalid_token");
    });

    it("logs failed verification for invalid token", async () => {
      vi.mocked(getUserByVerificationToken).mockResolvedValue(null);

      await verifyEmailToken("invalid-token");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "verification.failed",
          metadata: { reason: "invalid_token" },
        })
      );
    });

    it("returns expired_token error for expired token", async () => {
      const expiredUser: User = {
        ...mockUser,
        emailVerificationTokenExpiresAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      };
      vi.mocked(getUserByVerificationToken).mockResolvedValue(expiredUser);

      const result = await verifyEmailToken("expired-token");

      expect(result.success).toBe(false);
      expect(result.error).toBe("expired_token");
      expect(result.userId).toBe(expiredUser.id);
    });

    it("logs failed verification for expired token", async () => {
      const expiredUser: User = {
        ...mockUser,
        emailVerificationTokenExpiresAt: new Date(Date.now() - 3600000).toISOString(),
      };
      vi.mocked(getUserByVerificationToken).mockResolvedValue(expiredUser);

      await verifyEmailToken("expired-token");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "verification.failed",
          userId: expiredUser.id,
          metadata: { reason: "expired_token" },
        })
      );
    });

    it("returns already_verified error if user is already verified", async () => {
      const verifiedUser: User = {
        ...mockUser,
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
      };
      vi.mocked(getUserByVerificationToken).mockResolvedValue(verifiedUser);

      const result = await verifyEmailToken("some-token");

      expect(result.success).toBe(false);
      expect(result.error).toBe("already_verified");
      expect(result.userId).toBe(verifiedUser.id);
    });

    it("does not call markEmailVerified for already verified user", async () => {
      const verifiedUser: User = {
        ...mockUser,
        emailVerified: true,
      };
      vi.mocked(getUserByVerificationToken).mockResolvedValue(verifiedUser);

      await verifyEmailToken("some-token");

      expect(markEmailVerified).not.toHaveBeenCalled();
    });
  });

  describe("isEmailVerified", () => {
    it("returns true if user email is verified", async () => {
      vi.mocked(getUserById).mockResolvedValue({
        id: "user-123",
        emailVerified: true,
      } as User);

      const result = await isEmailVerified("user-123");

      expect(result).toBe(true);
    });

    it("returns false if user email is not verified", async () => {
      vi.mocked(getUserById).mockResolvedValue({
        id: "user-123",
        emailVerified: false,
      } as User);

      const result = await isEmailVerified("user-123");

      expect(result).toBe(false);
    });

    it("returns false if user does not exist", async () => {
      vi.mocked(getUserById).mockResolvedValue(null);

      const result = await isEmailVerified("nonexistent-user");

      expect(result).toBe(false);
    });
  });
});
