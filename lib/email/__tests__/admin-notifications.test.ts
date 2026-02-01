/**
 * Admin Notification Email Tests
 *
 * Tests for admin notification email templates and send functions.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@react-email/components";
import { AdminNotificationEmailTemplate, getAdminNotificationSubject } from "../templates";
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

describe("Admin Notification Email Templates", () => {
  describe("getAdminNotificationSubject", () => {
    it("returns correct subject for new user", () => {
      expect(getAdminNotificationSubject("new_user")).toBe("Shadow Master: New User Registration");
    });

    it("returns correct subject for lockout", () => {
      expect(getAdminNotificationSubject("lockout")).toBe("Shadow Master: Account Lockout Alert");
    });

    it("returns correct subject for password reset", () => {
      expect(getAdminNotificationSubject("password_reset")).toBe(
        "Shadow Master: Password Reset Requested"
      );
    });
  });

  describe("AdminNotificationEmailTemplate - new_user", () => {
    it("renders with correct content", async () => {
      const props = {
        type: "new_user" as const,
        userEmail: "newuser@example.com",
        username: "NewRunner",
        eventTime: "Monday, January 15, 2024 at 3:30 PM EST",
      };

      const html = await render(AdminNotificationEmailTemplate(props));

      expect(html).toContain("New User Registration");
      expect(html).toContain("NewRunner");
      expect(html).toContain("newuser@example.com");
      expect(html).toContain("3:30 PM");
      expect(html).toContain("new user has registered");
    });
  });

  describe("AdminNotificationEmailTemplate - lockout", () => {
    it("renders with correct content", async () => {
      const props = {
        type: "lockout" as const,
        userEmail: "lockeduser@example.com",
        username: "LockedRunner",
        eventTime: "Monday, January 15, 2024 at 3:30 PM EST",
        failedAttempts: 5,
      };

      const html = await render(AdminNotificationEmailTemplate(props));

      expect(html).toContain("Account Lockout");
      expect(html).toContain("LockedRunner");
      expect(html).toContain("lockeduser@example.com");
      // React Email adds HTML comments in interpolations
      expect(html).toMatch(/Failed Attempts:.*5/);
      expect(html).toContain("brute-force");
    });

    it("shows N/A when failedAttempts not provided", async () => {
      const props = {
        type: "lockout" as const,
        userEmail: "user@example.com",
        username: "User",
        eventTime: "Now",
      };

      const html = await render(AdminNotificationEmailTemplate(props));

      // React Email adds HTML comments in interpolations
      expect(html).toMatch(/Failed Attempts:.*N\/A/);
    });
  });

  describe("AdminNotificationEmailTemplate - password_reset", () => {
    it("renders with correct content", async () => {
      const props = {
        type: "password_reset" as const,
        userEmail: "resetuser@example.com",
        username: "ResetRunner",
        eventTime: "Monday, January 15, 2024 at 3:30 PM EST",
        ipAddress: "192.168.1.100",
      };

      const html = await render(AdminNotificationEmailTemplate(props));

      expect(html).toContain("Password Reset Requested");
      expect(html).toContain("ResetRunner");
      expect(html).toContain("resetuser@example.com");
      expect(html).toContain("3:30 PM");
      expect(html).toContain("192.168.1.100");
    });

    it("omits IP when not provided", async () => {
      const props = {
        type: "password_reset" as const,
        userEmail: "user@example.com",
        username: "User",
        eventTime: "Now",
      };

      const html = await render(AdminNotificationEmailTemplate(props));

      expect(html).not.toContain("IP Address");
    });
  });
});

describe("Admin Notification Config Functions", () => {
  const originalEnv = process.env.ADMIN_NOTIFICATION_EMAIL;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.ADMIN_NOTIFICATION_EMAIL;
    } else {
      process.env.ADMIN_NOTIFICATION_EMAIL = originalEnv;
    }
  });

  describe("getAdminEmails", () => {
    it("returns empty array when not configured", async () => {
      delete process.env.ADMIN_NOTIFICATION_EMAIL;
      const { getAdminEmails } = await import("../admin-notifications");
      expect(getAdminEmails()).toEqual([]);
    });

    it("returns empty array for empty string", async () => {
      process.env.ADMIN_NOTIFICATION_EMAIL = "";
      const { getAdminEmails } = await import("../admin-notifications");
      expect(getAdminEmails()).toEqual([]);
    });

    it("returns single email", async () => {
      process.env.ADMIN_NOTIFICATION_EMAIL = "admin@example.com";
      const { getAdminEmails } = await import("../admin-notifications");
      expect(getAdminEmails()).toEqual(["admin@example.com"]);
    });

    it("returns multiple emails from comma-separated list", async () => {
      process.env.ADMIN_NOTIFICATION_EMAIL = "admin1@example.com,admin2@example.com";
      const { getAdminEmails } = await import("../admin-notifications");
      expect(getAdminEmails()).toEqual(["admin1@example.com", "admin2@example.com"]);
    });

    it("trims whitespace from emails", async () => {
      process.env.ADMIN_NOTIFICATION_EMAIL = " admin1@example.com , admin2@example.com ";
      const { getAdminEmails } = await import("../admin-notifications");
      expect(getAdminEmails()).toEqual(["admin1@example.com", "admin2@example.com"]);
    });

    it("filters out empty entries", async () => {
      process.env.ADMIN_NOTIFICATION_EMAIL = "admin@example.com,,other@example.com";
      const { getAdminEmails } = await import("../admin-notifications");
      expect(getAdminEmails()).toEqual(["admin@example.com", "other@example.com"]);
    });
  });

  describe("isAdminNotificationEnabled", () => {
    it("returns false when not configured", async () => {
      delete process.env.ADMIN_NOTIFICATION_EMAIL;
      const { isAdminNotificationEnabled } = await import("../admin-notifications");
      expect(isAdminNotificationEnabled()).toBe(false);
    });

    it("returns true when configured", async () => {
      process.env.ADMIN_NOTIFICATION_EMAIL = "admin@example.com";
      const { isAdminNotificationEnabled } = await import("../admin-notifications");
      expect(isAdminNotificationEnabled()).toBe(true);
    });
  });
});

describe("Admin Notification Send Functions", () => {
  const mockConfig: EmailConfig = {
    transport: "mock",
    from: { email: "noreply@test.com", name: "Shadow Master" },
  };

  const originalEnv = process.env.ADMIN_NOTIFICATION_EMAIL;

  beforeEach(() => {
    EmailService.resetInstance();
    clearConfigCache();
    clearMockTransport();
    vi.clearAllMocks();
    process.env.ADMIN_NOTIFICATION_EMAIL = "admin@example.com";
  });

  afterEach(() => {
    EmailService.resetInstance();
    clearMockTransport();
    if (originalEnv === undefined) {
      delete process.env.ADMIN_NOTIFICATION_EMAIL;
    } else {
      process.env.ADMIN_NOTIFICATION_EMAIL = originalEnv;
    }
  });

  describe("sendAdminNewUserNotification", () => {
    it("sends notification to admin email", async () => {
      const service = EmailService.getInstance(mockConfig);
      const transport = service.getTransport() as MockTransport;

      const { sendAdminNewUserNotification } = await import("../admin-notifications");

      await sendAdminNewUserNotification(
        "user-123",
        "newuser@example.com",
        "NewUser",
        new Date("2024-01-15T15:30:00Z")
      );

      const emails = transport.getSentEmails();
      expect(emails).toHaveLength(1);
      expect(emails[0].message.to).toEqual({ email: "admin@example.com" });
      expect(emails[0].message.subject).toBe("Shadow Master: New User Registration");
    });

    it("sends to multiple admin emails", async () => {
      process.env.ADMIN_NOTIFICATION_EMAIL = "admin1@example.com,admin2@example.com";
      const service = EmailService.getInstance(mockConfig);
      const transport = service.getTransport() as MockTransport;

      const { sendAdminNewUserNotification } = await import("../admin-notifications");

      await sendAdminNewUserNotification("user-123", "newuser@example.com", "NewUser", new Date());

      const emails = transport.getSentEmails();
      expect(emails).toHaveLength(2);
    });

    it("logs audit event on success", async () => {
      EmailService.getInstance(mockConfig);
      const { AuditLogger } = await import("@/lib/security/audit-logger");
      const { sendAdminNewUserNotification } = await import("../admin-notifications");

      await sendAdminNewUserNotification("user-123", "newuser@example.com", "NewUser", new Date());

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "admin_notification.new_user_sent",
          userId: "user-123",
          email: "newuser@example.com",
        })
      );
    });

    it("does nothing when admin email not configured", async () => {
      delete process.env.ADMIN_NOTIFICATION_EMAIL;
      const service = EmailService.getInstance(mockConfig);
      const transport = service.getTransport() as MockTransport;

      const { sendAdminNewUserNotification } = await import("../admin-notifications");

      await sendAdminNewUserNotification("user-123", "newuser@example.com", "NewUser", new Date());

      expect(transport.getSentEmails()).toHaveLength(0);
    });

    it("handles errors gracefully without throwing", async () => {
      const service = EmailService.getInstance(mockConfig);
      const transport = service.getTransport() as MockTransport;
      transport.simulateFailure("Test failure");

      const { sendAdminNewUserNotification } = await import("../admin-notifications");

      // Should not throw
      await expect(
        sendAdminNewUserNotification("user-123", "newuser@example.com", "NewUser", new Date())
      ).resolves.toBeUndefined();
    });
  });

  describe("sendAdminLockoutNotification", () => {
    it("sends notification with failed attempts", async () => {
      const service = EmailService.getInstance(mockConfig);
      const transport = service.getTransport() as MockTransport;

      const { sendAdminLockoutNotification } = await import("../admin-notifications");

      await sendAdminLockoutNotification(
        "user-123",
        "locked@example.com",
        "LockedUser",
        new Date(),
        5
      );

      const emails = transport.getSentEmails();
      expect(emails).toHaveLength(1);
      expect(emails[0].message.subject).toBe("Shadow Master: Account Lockout Alert");
      // React Email adds HTML comments in interpolations
      expect(emails[0].message.html).toMatch(/Failed Attempts:.*5/);
    });

    it("logs audit event with failed attempts", async () => {
      EmailService.getInstance(mockConfig);
      const { AuditLogger } = await import("@/lib/security/audit-logger");
      const { sendAdminLockoutNotification } = await import("../admin-notifications");

      await sendAdminLockoutNotification(
        "user-123",
        "locked@example.com",
        "LockedUser",
        new Date(),
        5
      );

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "admin_notification.lockout_sent",
          metadata: expect.objectContaining({
            failedAttempts: 5,
          }),
        })
      );
    });
  });

  describe("sendAdminPasswordResetNotification", () => {
    it("sends notification with IP address", async () => {
      const service = EmailService.getInstance(mockConfig);
      const transport = service.getTransport() as MockTransport;

      const { sendAdminPasswordResetNotification } = await import("../admin-notifications");

      await sendAdminPasswordResetNotification(
        "user-123",
        "reset@example.com",
        "ResetUser",
        new Date(),
        "192.168.1.100"
      );

      const emails = transport.getSentEmails();
      expect(emails).toHaveLength(1);
      expect(emails[0].message.subject).toBe("Shadow Master: Password Reset Requested");
      expect(emails[0].message.html).toContain("192.168.1.100");
    });

    it("logs audit event with IP address", async () => {
      EmailService.getInstance(mockConfig);
      const { AuditLogger } = await import("@/lib/security/audit-logger");
      const { sendAdminPasswordResetNotification } = await import("../admin-notifications");

      await sendAdminPasswordResetNotification(
        "user-123",
        "reset@example.com",
        "ResetUser",
        new Date(),
        "192.168.1.100"
      );

      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "admin_notification.password_reset_sent",
          ip: "192.168.1.100",
        })
      );
    });

    it("works without IP address", async () => {
      const service = EmailService.getInstance(mockConfig);
      const transport = service.getTransport() as MockTransport;

      const { sendAdminPasswordResetNotification } = await import("../admin-notifications");

      await sendAdminPasswordResetNotification(
        "user-123",
        "reset@example.com",
        "ResetUser",
        new Date()
      );

      const emails = transport.getSentEmails();
      expect(emails).toHaveLength(1);
    });
  });
});
