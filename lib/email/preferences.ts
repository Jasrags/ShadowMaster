import { CommunicationPreferences } from "@/lib/types/user";
import { getUserById } from "@/lib/storage/users";
import { AuditLogger } from "@/lib/security/audit-logger";

/**
 * Email types categorized by their opt-out behavior
 */
export type EmailType =
  // Transactional - cannot be disabled
  | "verification"
  | "password-reset"
  | "magic-link"
  // Security alerts - mandatory (cannot opt out)
  | "lockout-alert"
  | "password-changed"
  | "email-changed"
  // Admin notifications - controlled by env config, not user preferences
  | "admin-new-user"
  | "admin-lockout"
  | "admin-password-reset"
  // Product updates - opt-in (default false)
  | "product-update"
  | "feature-announcement"
  | "tips"
  | "release-notes"
  // Campaign notifications - opt-out (default true)
  | "session-reminder"
  | "gm-message"
  | "campaign-update";

/**
 * Email categories for preference checking
 */
export type EmailCategory = "transactional" | "security" | "admin" | "product" | "campaign";

/**
 * Map email types to their categories
 */
const emailTypeCategories: Record<EmailType, EmailCategory> = {
  // Transactional
  verification: "transactional",
  "password-reset": "transactional",
  "magic-link": "transactional",
  // Security
  "lockout-alert": "security",
  "password-changed": "security",
  "email-changed": "security",
  // Admin
  "admin-new-user": "admin",
  "admin-lockout": "admin",
  "admin-password-reset": "admin",
  // Product
  "product-update": "product",
  "feature-announcement": "product",
  tips: "product",
  "release-notes": "product",
  // Campaign
  "session-reminder": "campaign",
  "gm-message": "campaign",
  "campaign-update": "campaign",
};

/**
 * Returns the default communication preferences for new users
 */
export function getDefaultCommunicationPreferences(): CommunicationPreferences {
  return {
    productUpdates: false, // Opt-in required
    campaignNotifications: true, // Opt-out available
  };
}

/**
 * Gets a user's communication preferences with defaults applied
 *
 * @param userId - The user's ID
 * @returns The user's communication preferences, or defaults if not found
 */
export async function getUserCommunicationPreferences(
  userId: string
): Promise<CommunicationPreferences> {
  const user = await getUserById(userId);

  if (!user) {
    return getDefaultCommunicationPreferences();
  }

  return {
    productUpdates: user.preferences?.communications?.productUpdates ?? false,
    campaignNotifications: user.preferences?.communications?.campaignNotifications ?? true,
  };
}

/**
 * Checks if a specific email type can be sent to a user based on their preferences
 *
 * @param userId - The user's ID
 * @param emailType - The type of email to check
 * @returns true if the email can be sent, false otherwise
 */
export async function canSendEmail(userId: string, emailType: EmailType): Promise<boolean> {
  const category = emailTypeCategories[emailType];

  // Transactional and security emails are always sent
  if (category === "transactional" || category === "security") {
    return true;
  }

  // Admin notifications are controlled by env config, not user preferences
  if (category === "admin") {
    return true;
  }

  const preferences = await getUserCommunicationPreferences(userId);

  // Check category preferences
  if (category === "product") {
    const allowed = preferences.productUpdates;
    if (!allowed) {
      await AuditLogger.log({
        event: "email.skipped_user_preference",
        userId,
        metadata: {
          emailType,
          category,
          reason: "User has opted out of product updates",
        },
      });
    }
    return allowed;
  }

  if (category === "campaign") {
    const allowed = preferences.campaignNotifications;
    if (!allowed) {
      await AuditLogger.log({
        event: "email.skipped_user_preference",
        userId,
        metadata: {
          emailType,
          category,
          reason: "User has opted out of campaign notifications",
        },
      });
    }
    return allowed;
  }

  // Default to allowing unknown categories
  return true;
}

/**
 * Gets the category for an email type
 */
export function getEmailCategory(emailType: EmailType): EmailCategory {
  return emailTypeCategories[emailType];
}
