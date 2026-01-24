/**
 * Security Alert Email Tests
 *
 * Tests for security alert email templates and send functions.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@react-email/components";
import {
  LockoutAlertEmailTemplate,
  PasswordChangedEmailTemplate,
  EmailChangedEmailTemplate,
  maskEmail,
} from "../templates";
import { EmailService } from "../email-service";
import { MockTransport, clearMockTransport } from "../transports/mock";
import { clearConfigCache } from "../config";
import type { EmailConfig } from "../types";

// Mock the audit logger
vi.mock("@/lib/security/audit-logger", () => ({
  AuditLogger: {
    log: vi.fn().mockResolvedValue(undefined),
  },
}));

describe("Security Alert Email Templates", () => {
  describe("maskEmail", () => {
    it("masks email with standard local part", () => {
      expect(maskEmail("john.doe@example.com")).toBe("j***e@example.com");
    });

    it("masks email with 2-character local part", () => {
      expect(maskEmail("ab@example.com")).toBe("a*b@example.com");
    });

    it("masks email with 1-character local part", () => {
      expect(maskEmail("a@example.com")).toBe("a***@example.com");
    });

    it("handles email without @ symbol", () => {
      expect(maskEmail("invalid")).toBe("invalid");
    });

    it("masks longer local parts correctly", () => {
      expect(maskEmail("username@domain.org")).toBe("u***e@domain.org");
    });
  });

  describe("LockoutAlertEmailTemplate", () => {
    it("renders with correct content", async () => {
      const props = {
        username: "TestRunner",
        lockoutTime: "Monday, January 15, 2024 at 3:30 PM EST",
        unlockTime: "Monday, January 15, 2024 at 3:45 PM EST",
      };

      const html = await render(LockoutAlertEmailTemplate(props));

      expect(html).toContain("TestRunner");
      expect(html).toContain("Account Locked");
      expect(html).toContain("3:30 PM");
      expect(html).toContain("3:45 PM");
      expect(html).toContain("multiple failed login attempts");
    });

    it("includes security advice", async () => {
      const props = {
        username: "TestUser",
        lockoutTime: "Now",
        unlockTime: "Later",
      };

      const html = await render(LockoutAlertEmailTemplate(props));

      expect(html).toContain("If this wasn");
      expect(html).toContain("Change your password");
    });
  });

  describe("PasswordChangedEmailTemplate", () => {
    it("renders with correct content", async () => {
      const props = {
        username: "TestRunner",
        changeTime: "Monday, January 15, 2024 at 3:30 PM EST",
        resetPasswordUrl: "https://app.test/forgot-password",
      };

      const html = await render(PasswordChangedEmailTemplate(props));

      expect(html).toContain("TestRunner");
      expect(html).toContain("Password Changed");
      expect(html).toContain("3:30 PM");
      expect(html).toContain("https://app.test/forgot-password");
    });

    it("includes warning for unauthorized changes", async () => {
      const props = {
        username: "TestUser",
        changeTime: "Now",
        resetPasswordUrl: "https://app.test/forgot-password",
      };

      const html = await render(PasswordChangedEmailTemplate(props));

      expect(html).toContain("Didn");
      expect(html).toContain("compromised");
      expect(html).toContain("Reset Password Now");
    });
  });

  describe("EmailChangedEmailTemplate", () => {
    it("renders with correct content", async () => {
      const props = {
        username: "TestRunner",
        changeTime: "Monday, January 15, 2024 at 3:30 PM EST",
        newEmail: "n***w@example.com",
        oldEmail: "old@example.com",
      };

      const html = await render(EmailChangedEmailTemplate(props));

      expect(html).toContain("TestRunner");
      expect(html).toContain("Email Address Changed");
      expect(html).toContain("3:30 PM");
      expect(html).toContain("n***w@example.com");
      expect(html).toContain("old@example.com");
    });

    it("includes security warning", async () => {
      const props = {
        username: "TestUser",
        changeTime: "Now",
        newEmail: "masked@test.com",
        oldEmail: "old@test.com",
      };

      const html = await render(EmailChangedEmailTemplate(props));

      expect(html).toContain("Didn");
      expect(html).toContain("compromised");
      expect(html).toContain("contact support");
    });
  });
});

describe("Security Alert Send Functions", () => {
  const mockConfig: EmailConfig = {
    transport: "mock",
    from: { email: "noreply@test.com", name: "Shadow Master" },
  };

  beforeEach(() => {
    EmailService.resetInstance();
    clearConfigCache();
    clearMockTransport();
    vi.clearAllMocks();
  });

  afterEach(() => {
    EmailService.resetInstance();
    clearMockTransport();
  });

  // Helper to set up mock transport and import fresh security-alerts module
  async function setupAndSend(
    sendFunction: "lockout" | "password" | "email"
  ): Promise<MockTransport> {
    // Create service with mock config first
    const service = EmailService.getInstance(mockConfig);
    const transport = service.getTransport() as MockTransport;

    // Import and call the security alert function
    const { sendLockoutAlertEmail, sendPasswordChangedEmail, sendEmailChangedEmail } =
      await import("../security-alerts");

    switch (sendFunction) {
      case "lockout":
        await sendLockoutAlertEmail(
          "user-123",
          "test@example.com",
          "TestUser",
          new Date("2024-01-15T15:30:00Z"),
          new Date("2024-01-15T15:45:00Z"),
          "http://localhost:3000"
        );
        break;
      case "password":
        await sendPasswordChangedEmail(
          "user-123",
          "test@example.com",
          "TestUser",
          new Date("2024-01-15T15:30:00Z"),
          "http://localhost:3000"
        );
        break;
      case "email":
        await sendEmailChangedEmail(
          "user-123",
          "old@example.com",
          "TestUser",
          "new@example.com",
          new Date("2024-01-15T15:30:00Z"),
          "http://localhost:3000"
        );
        break;
    }

    return transport;
  }

  describe("sendLockoutAlertEmail", () => {
    it("sends lockout alert email successfully", async () => {
      const transport = await setupAndSend("lockout");
      const emails = transport.getSentEmails();

      expect(emails).toHaveLength(1);
      expect(emails[0].message.to).toEqual({ email: "test@example.com", name: "TestUser" });
      expect(emails[0].message.subject).toContain("locked");
    });

    it("logs audit event on success", async () => {
      const { AuditLogger } = await import("@/lib/security/audit-logger");
      await setupAndSend("lockout");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "security_email.lockout_sent",
          userId: "user-123",
          email: "test@example.com",
        })
      );
    });

    it("handles errors gracefully without throwing", async () => {
      const { sendLockoutAlertEmail } = await import("../security-alerts");

      // Set up transport to simulate failure
      const service = EmailService.getInstance(mockConfig);
      const transport = service.getTransport() as MockTransport;
      transport.simulateFailure("Test failure");

      // Should not throw
      await expect(
        sendLockoutAlertEmail(
          "user-123",
          "test@example.com",
          "TestUser",
          new Date(),
          new Date(),
          "http://localhost:3000"
        )
      ).resolves.toBeUndefined();
    });
  });

  describe("sendPasswordChangedEmail", () => {
    it("sends password changed email successfully", async () => {
      const transport = await setupAndSend("password");
      const emails = transport.getSentEmails();

      expect(emails).toHaveLength(1);
      expect(emails[0].message.to).toEqual({ email: "test@example.com", name: "TestUser" });
      expect(emails[0].message.subject).toContain("password");
      expect(emails[0].message.html).toContain("forgot-password");
    });

    it("logs audit event on success", async () => {
      const { AuditLogger } = await import("@/lib/security/audit-logger");
      await setupAndSend("password");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "security_email.password_changed_sent",
          userId: "user-123",
          email: "test@example.com",
        })
      );
    });

    it("handles string date input", async () => {
      // Set up service with mock config
      const service = EmailService.getInstance(mockConfig);
      const transport = service.getTransport() as MockTransport;

      const { sendPasswordChangedEmail } = await import("../security-alerts");

      await sendPasswordChangedEmail(
        "user-123",
        "test@example.com",
        "TestUser",
        "2024-01-15T15:30:00Z",
        "http://localhost:3000"
      );

      const emails = transport.getSentEmails();
      expect(emails).toHaveLength(1);
    });
  });

  describe("sendEmailChangedEmail", () => {
    it("sends email changed notification to old address", async () => {
      const transport = await setupAndSend("email");
      const emails = transport.getSentEmails();

      expect(emails).toHaveLength(1);
      // Sent to OLD email
      expect(emails[0].message.to).toEqual({ email: "old@example.com", name: "TestUser" });
      expect(emails[0].message.subject).toContain("email address");
      // Contains masked new email
      expect(emails[0].message.html).toContain("n***w@example.com");
    });

    it("logs audit event with masked email", async () => {
      const { AuditLogger } = await import("@/lib/security/audit-logger");
      await setupAndSend("email");

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "security_email.email_changed_sent",
          userId: "user-123",
          email: "old@example.com",
          metadata: expect.objectContaining({
            newEmail: "n***w@example.com",
          }),
        })
      );
    });
  });
});
