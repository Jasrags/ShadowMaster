/**
 * Admin Notification Email Service
 *
 * Sends notification emails to administrators for key events:
 * - New user registration
 * - Account lockout
 * - Password reset requested
 *
 * All functions use fire-and-forget pattern: errors are logged but not thrown.
 * Application functionality should never be blocked by admin notification failures.
 *
 * Configuration:
 * - ADMIN_NOTIFICATION_EMAIL: Comma-separated list of admin email addresses
 */

import { sendEmail, renderTemplate } from "@/lib/email";
import { AdminNotificationEmailTemplate, getAdminNotificationSubject } from "@/lib/email/templates";
import { AuditLogger } from "@/lib/security/audit-logger";

/**
 * Format a date for display in emails
 */
function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/**
 * Parse admin email addresses from environment variable
 *
 * @returns Array of admin email addresses (empty if not configured)
 */
export function getAdminEmails(): string[] {
  const envValue = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!envValue || envValue.trim() === "") {
    return [];
  }

  return envValue
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);
}

/**
 * Check if admin notifications are enabled
 *
 * @returns true if ADMIN_NOTIFICATION_EMAIL is configured with at least one email
 */
export function isAdminNotificationEnabled(): boolean {
  return getAdminEmails().length > 0;
}

/**
 * Send admin notification for new user registration
 *
 * Notifies administrators when a new user signs up.
 * Uses fire-and-forget pattern - errors are logged but not thrown.
 *
 * @param userId - The new user's ID
 * @param email - The new user's email address
 * @param username - The new user's display name
 * @param registrationTime - When the user registered
 */
export async function sendAdminNewUserNotification(
  userId: string,
  email: string,
  username: string,
  registrationTime: Date | string
): Promise<void> {
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    return;
  }

  try {
    const { html, text } = await renderTemplate(
      AdminNotificationEmailTemplate({
        type: "new_user",
        userEmail: email,
        username,
        eventTime: formatDateTime(registrationTime),
      })
    );

    const subject = getAdminNotificationSubject("new_user");

    // Send to all configured admin emails
    const sendPromises = adminEmails.map((adminEmail) =>
      sendEmail({
        to: { email: adminEmail },
        subject,
        html,
        text,
      })
    );

    const results = await Promise.allSettled(sendPromises);
    const successCount = results.filter((r) => r.status === "fulfilled" && r.value.success).length;

    if (successCount > 0) {
      await AuditLogger.log({
        event: "admin_notification.new_user_sent",
        userId,
        email,
        metadata: {
          recipientCount: successCount,
          totalRecipients: adminEmails.length,
        },
      });
    }

    // Log any failures
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Failed to send admin notification to ${adminEmails[index]}:`, result.reason);
      } else if (!result.value.success) {
        console.error(
          `Failed to send admin notification to ${adminEmails[index]}:`,
          result.value.error
        );
      }
    });
  } catch (error) {
    console.error("Error sending admin new user notification:", error);
  }
}

/**
 * Send admin notification for account lockout
 *
 * Notifies administrators when an account is locked due to failed login attempts.
 * Uses fire-and-forget pattern - errors are logged but not thrown.
 *
 * @param userId - The locked user's ID
 * @param email - The locked user's email address
 * @param username - The locked user's display name
 * @param lockoutTime - When the lockout was triggered
 * @param failedAttempts - Number of failed login attempts
 */
export async function sendAdminLockoutNotification(
  userId: string,
  email: string,
  username: string,
  lockoutTime: Date | string,
  failedAttempts: number
): Promise<void> {
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    return;
  }

  try {
    const { html, text } = await renderTemplate(
      AdminNotificationEmailTemplate({
        type: "lockout",
        userEmail: email,
        username,
        eventTime: formatDateTime(lockoutTime),
        failedAttempts,
      })
    );

    const subject = getAdminNotificationSubject("lockout");

    // Send to all configured admin emails
    const sendPromises = adminEmails.map((adminEmail) =>
      sendEmail({
        to: { email: adminEmail },
        subject,
        html,
        text,
      })
    );

    const results = await Promise.allSettled(sendPromises);
    const successCount = results.filter((r) => r.status === "fulfilled" && r.value.success).length;

    if (successCount > 0) {
      await AuditLogger.log({
        event: "admin_notification.lockout_sent",
        userId,
        email,
        metadata: {
          failedAttempts,
          recipientCount: successCount,
          totalRecipients: adminEmails.length,
        },
      });
    }

    // Log any failures
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to send admin lockout notification to ${adminEmails[index]}:`,
          result.reason
        );
      } else if (!result.value.success) {
        console.error(
          `Failed to send admin lockout notification to ${adminEmails[index]}:`,
          result.value.error
        );
      }
    });
  } catch (error) {
    console.error("Error sending admin lockout notification:", error);
  }
}

/**
 * Send admin notification for password reset request
 *
 * Notifies administrators when a password reset is requested.
 * Uses fire-and-forget pattern - errors are logged but not thrown.
 *
 * @param userId - The user's ID
 * @param email - The user's email address
 * @param username - The user's display name
 * @param requestTime - When the reset was requested
 * @param ip - The requester's IP address (optional)
 */
export async function sendAdminPasswordResetNotification(
  userId: string,
  email: string,
  username: string,
  requestTime: Date | string,
  ip?: string
): Promise<void> {
  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    return;
  }

  try {
    const { html, text } = await renderTemplate(
      AdminNotificationEmailTemplate({
        type: "password_reset",
        userEmail: email,
        username,
        eventTime: formatDateTime(requestTime),
        ipAddress: ip,
      })
    );

    const subject = getAdminNotificationSubject("password_reset");

    // Send to all configured admin emails
    const sendPromises = adminEmails.map((adminEmail) =>
      sendEmail({
        to: { email: adminEmail },
        subject,
        html,
        text,
      })
    );

    const results = await Promise.allSettled(sendPromises);
    const successCount = results.filter((r) => r.status === "fulfilled" && r.value.success).length;

    if (successCount > 0) {
      await AuditLogger.log({
        event: "admin_notification.password_reset_sent",
        userId,
        email,
        ip,
        metadata: {
          recipientCount: successCount,
          totalRecipients: adminEmails.length,
        },
      });
    }

    // Log any failures
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to send admin reset notification to ${adminEmails[index]}:`,
          result.reason
        );
      } else if (!result.value.success) {
        console.error(
          `Failed to send admin reset notification to ${adminEmails[index]}:`,
          result.value.error
        );
      }
    });
  } catch (error) {
    console.error("Error sending admin password reset notification:", error);
  }
}
