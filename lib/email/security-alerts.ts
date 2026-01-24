/**
 * Security Alert Email Service
 *
 * Sends security-relevant email notifications to users for:
 * - Account lockout (too many failed login attempts)
 * - Password changes (self-service or reset)
 * - Email address changes (sent to old address)
 *
 * All functions use fire-and-forget pattern: errors are logged but not thrown.
 * Security actions should never be blocked by email failures.
 */

import { sendEmail, renderTemplate } from "@/lib/email";
import {
  LockoutAlertEmailTemplate,
  PasswordChangedEmailTemplate,
  EmailChangedEmailTemplate,
  maskEmail,
} from "@/lib/email/templates";
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
 * Send account lockout alert email
 *
 * Notifies the user when their account is locked due to failed login attempts.
 * Uses fire-and-forget pattern - errors are logged but not thrown.
 *
 * @param userId - The user's ID
 * @param email - The user's email address
 * @param username - The user's display name
 * @param lockoutTime - When the lockout was triggered
 * @param unlockTime - When the account will be unlocked
 * @param baseUrl - Application base URL (unused, kept for consistency)
 */
export async function sendLockoutAlertEmail(
  userId: string,
  email: string,
  username: string,
  lockoutTime: Date | string,
  unlockTime: Date | string,
  _baseUrl: string
): Promise<void> {
  try {
    const { html, text } = await renderTemplate(
      LockoutAlertEmailTemplate({
        username,
        lockoutTime: formatDateTime(lockoutTime),
        unlockTime: formatDateTime(unlockTime),
      })
    );

    const result = await sendEmail({
      to: { email, name: username },
      subject: "Security Alert: Your Shadow Master account has been locked",
      html,
      text,
    });

    if (result.success) {
      await AuditLogger.log({
        event: "security_email.lockout_sent",
        userId,
        email,
        metadata: {
          lockoutTime: typeof lockoutTime === "string" ? lockoutTime : lockoutTime.toISOString(),
          unlockTime: typeof unlockTime === "string" ? unlockTime : unlockTime.toISOString(),
        },
      });
    } else {
      console.error("Failed to send lockout alert email:", result.error);
    }
  } catch (error) {
    console.error("Error sending lockout alert email:", error);
  }
}

/**
 * Send password changed confirmation email
 *
 * Notifies the user when their password is changed (self-service or via reset).
 * Includes a reset link in case the change was unauthorized.
 * Uses fire-and-forget pattern - errors are logged but not thrown.
 *
 * @param userId - The user's ID
 * @param email - The user's email address
 * @param username - The user's display name
 * @param changeTime - When the password was changed
 * @param baseUrl - Application base URL for reset link
 */
export async function sendPasswordChangedEmail(
  userId: string,
  email: string,
  username: string,
  changeTime: Date | string,
  baseUrl: string
): Promise<void> {
  try {
    const resetPasswordUrl = `${baseUrl}/forgot-password`;

    const { html, text } = await renderTemplate(
      PasswordChangedEmailTemplate({
        username,
        changeTime: formatDateTime(changeTime),
        resetPasswordUrl,
      })
    );

    const result = await sendEmail({
      to: { email, name: username },
      subject: "Security Alert: Your Shadow Master password has been changed",
      html,
      text,
    });

    if (result.success) {
      await AuditLogger.log({
        event: "security_email.password_changed_sent",
        userId,
        email,
        metadata: {
          changeTime: typeof changeTime === "string" ? changeTime : changeTime.toISOString(),
        },
      });
    } else {
      console.error("Failed to send password changed email:", result.error);
    }
  } catch (error) {
    console.error("Error sending password changed email:", error);
  }
}

/**
 * Send email changed notification to old email address
 *
 * Notifies the OLD email address when a user changes their email.
 * This allows the user to take action if they didn't make the change.
 * Uses fire-and-forget pattern - errors are logged but not thrown.
 *
 * @param userId - The user's ID
 * @param oldEmail - The user's previous email address (recipient)
 * @param username - The user's display name
 * @param newEmail - The new email address (will be masked)
 * @param changeTime - When the email was changed
 * @param baseUrl - Application base URL (unused, kept for consistency)
 */
export async function sendEmailChangedEmail(
  userId: string,
  oldEmail: string,
  username: string,
  newEmail: string,
  changeTime: Date | string,
  _baseUrl: string
): Promise<void> {
  try {
    const { html, text } = await renderTemplate(
      EmailChangedEmailTemplate({
        username,
        changeTime: formatDateTime(changeTime),
        newEmail: maskEmail(newEmail),
        oldEmail,
      })
    );

    const result = await sendEmail({
      to: { email: oldEmail, name: username },
      subject: "Security Alert: Your Shadow Master email address has been changed",
      html,
      text,
    });

    if (result.success) {
      await AuditLogger.log({
        event: "security_email.email_changed_sent",
        userId,
        email: oldEmail,
        metadata: {
          newEmail: maskEmail(newEmail),
          changeTime: typeof changeTime === "string" ? changeTime : changeTime.toISOString(),
        },
      });
    } else {
      console.error("Failed to send email changed notification:", result.error);
    }
  } catch (error) {
    console.error("Error sending email changed notification:", error);
  }
}
