/**
 * Tests for email preference utilities
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getDefaultCommunicationPreferences,
  getUserCommunicationPreferences,
  canSendEmail,
  getEmailCategory,
  EmailType,
} from "../preferences";
import * as usersModule from "@/lib/storage/users";
import * as auditModule from "@/lib/security/audit-logger";
import type { User, CommunicationPreferences, UserSettings } from "@/lib/types/user";

// Mock dependencies
vi.mock("@/lib/storage/users");
vi.mock("@/lib/security/audit-logger");

/**
 * Helper to create a mock user with minimal required fields
 */
function createMockUser(
  id: string,
  communications?: Partial<CommunicationPreferences>,
  settings?: Partial<UserSettings>
): User {
  return {
    id,
    email: `${id}@test.example.com`,
    username: id,
    passwordHash: "hash",
    role: ["user"],
    preferences: {
      theme: settings?.theme ?? "system",
      navigationCollapsed: settings?.navigationCollapsed ?? false,
      communications: communications
        ? {
            productUpdates: communications.productUpdates ?? false,
            campaignNotifications: communications.campaignNotifications ?? true,
          }
        : undefined,
    },
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
    emailVerificationTokenPrefix: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    passwordResetTokenPrefix: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
    magicLinkTokenPrefix: null,
  };
}

describe("email preferences utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDefaultCommunicationPreferences", () => {
    it("should return default preferences with productUpdates false and campaignNotifications true", () => {
      const defaults = getDefaultCommunicationPreferences();

      expect(defaults).toEqual({
        productUpdates: false,
        campaignNotifications: true,
      });
    });
  });

  describe("getUserCommunicationPreferences", () => {
    it("should return user preferences when user exists", async () => {
      vi.mocked(usersModule.getUserById).mockResolvedValue(
        createMockUser("user-1", { productUpdates: true, campaignNotifications: false })
      );

      const prefs = await getUserCommunicationPreferences("user-1");

      expect(prefs).toEqual({
        productUpdates: true,
        campaignNotifications: false,
      });
    });

    it("should return defaults when user has no communications preferences", async () => {
      vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser("user-1"));

      const prefs = await getUserCommunicationPreferences("user-1");

      expect(prefs).toEqual({
        productUpdates: false,
        campaignNotifications: true,
      });
    });

    it("should return defaults when user not found", async () => {
      vi.mocked(usersModule.getUserById).mockResolvedValue(null);

      const prefs = await getUserCommunicationPreferences("nonexistent");

      expect(prefs).toEqual({
        productUpdates: false,
        campaignNotifications: true,
      });
    });
  });

  describe("canSendEmail", () => {
    const mockAuditLog = vi.fn();

    beforeEach(() => {
      vi.mocked(auditModule.AuditLogger.log).mockImplementation(mockAuditLog);
    });

    describe("transactional emails", () => {
      const transactionalTypes: EmailType[] = ["verification", "password-reset", "magic-link"];

      it.each(transactionalTypes)(
        "should always allow %s emails regardless of preferences",
        async (emailType) => {
          vi.mocked(usersModule.getUserById).mockResolvedValue(
            createMockUser("user-1", { productUpdates: false, campaignNotifications: false })
          );

          const allowed = await canSendEmail("user-1", emailType);

          expect(allowed).toBe(true);
          expect(mockAuditLog).not.toHaveBeenCalled();
        }
      );
    });

    describe("security emails", () => {
      const securityTypes: EmailType[] = ["lockout-alert", "password-changed", "email-changed"];

      it.each(securityTypes)(
        "should always allow %s emails regardless of preferences",
        async (emailType) => {
          vi.mocked(usersModule.getUserById).mockResolvedValue(
            createMockUser("user-1", { productUpdates: false, campaignNotifications: false })
          );

          const allowed = await canSendEmail("user-1", emailType);

          expect(allowed).toBe(true);
          expect(mockAuditLog).not.toHaveBeenCalled();
        }
      );
    });

    describe("admin emails", () => {
      const adminTypes: EmailType[] = ["admin-new-user", "admin-lockout", "admin-password-reset"];

      it.each(adminTypes)(
        "should always allow %s emails (controlled by env config)",
        async (emailType) => {
          const allowed = await canSendEmail("user-1", emailType);
          expect(allowed).toBe(true);
        }
      );
    });

    describe("product update emails", () => {
      const productTypes: EmailType[] = [
        "product-update",
        "feature-announcement",
        "tips",
        "release-notes",
      ];

      it.each(productTypes)("should allow %s when productUpdates is true", async (emailType) => {
        vi.mocked(usersModule.getUserById).mockResolvedValue(
          createMockUser("user-1", { productUpdates: true, campaignNotifications: true })
        );

        const allowed = await canSendEmail("user-1", emailType);

        expect(allowed).toBe(true);
        expect(mockAuditLog).not.toHaveBeenCalled();
      });

      it.each(productTypes)(
        "should block %s when productUpdates is false and log it",
        async (emailType) => {
          vi.mocked(usersModule.getUserById).mockResolvedValue(
            createMockUser("user-1", { productUpdates: false, campaignNotifications: true })
          );

          const allowed = await canSendEmail("user-1", emailType);

          expect(allowed).toBe(false);
          expect(mockAuditLog).toHaveBeenCalledWith({
            event: "email.skipped_user_preference",
            userId: "user-1",
            metadata: {
              emailType,
              category: "product",
              reason: "User has opted out of product updates",
            },
          });
        }
      );
    });

    describe("campaign notification emails", () => {
      const campaignTypes: EmailType[] = ["session-reminder", "gm-message", "campaign-update"];

      it.each(campaignTypes)(
        "should allow %s when campaignNotifications is true",
        async (emailType) => {
          vi.mocked(usersModule.getUserById).mockResolvedValue(
            createMockUser("user-1", { productUpdates: false, campaignNotifications: true })
          );

          const allowed = await canSendEmail("user-1", emailType);

          expect(allowed).toBe(true);
          expect(mockAuditLog).not.toHaveBeenCalled();
        }
      );

      it.each(campaignTypes)(
        "should block %s when campaignNotifications is false and log it",
        async (emailType) => {
          vi.mocked(usersModule.getUserById).mockResolvedValue(
            createMockUser("user-1", { productUpdates: true, campaignNotifications: false })
          );

          const allowed = await canSendEmail("user-1", emailType);

          expect(allowed).toBe(false);
          expect(mockAuditLog).toHaveBeenCalledWith({
            event: "email.skipped_user_preference",
            userId: "user-1",
            metadata: {
              emailType,
              category: "campaign",
              reason: "User has opted out of campaign notifications",
            },
          });
        }
      );
    });
  });

  describe("getEmailCategory", () => {
    it("should return correct categories for all email types", () => {
      // Transactional
      expect(getEmailCategory("verification")).toBe("transactional");
      expect(getEmailCategory("password-reset")).toBe("transactional");
      expect(getEmailCategory("magic-link")).toBe("transactional");

      // Security
      expect(getEmailCategory("lockout-alert")).toBe("security");
      expect(getEmailCategory("password-changed")).toBe("security");
      expect(getEmailCategory("email-changed")).toBe("security");

      // Admin
      expect(getEmailCategory("admin-new-user")).toBe("admin");
      expect(getEmailCategory("admin-lockout")).toBe("admin");
      expect(getEmailCategory("admin-password-reset")).toBe("admin");

      // Product
      expect(getEmailCategory("product-update")).toBe("product");
      expect(getEmailCategory("feature-announcement")).toBe("product");
      expect(getEmailCategory("tips")).toBe("product");
      expect(getEmailCategory("release-notes")).toBe("product");

      // Campaign
      expect(getEmailCategory("session-reminder")).toBe("campaign");
      expect(getEmailCategory("gm-message")).toBe("campaign");
      expect(getEmailCategory("campaign-update")).toBe("campaign");
    });
  });
});
