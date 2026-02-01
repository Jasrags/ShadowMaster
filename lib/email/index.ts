/**
 * Email Infrastructure
 *
 * Provides email sending capabilities with multiple transport options:
 * - SMTP: Use with Mailpit (dev) or any SMTP server
 * - Resend: Cloud email service with generous free tier
 * - File: Local file storage (fallback/debugging)
 * - Mock: In-memory storage for testing
 *
 * @example
 * ```typescript
 * import { sendEmail } from '@/lib/email';
 *
 * await sendEmail({
 *   to: { email: 'user@example.com' },
 *   subject: 'Welcome!',
 *   text: 'Welcome to Shadow Master!',
 * });
 * ```
 */

// Types
export type {
  EmailAddress,
  EmailAttachment,
  EmailConfig,
  EmailMessage,
  EmailResult,
  EmailTransport,
  EmailTransportType,
  FileTransportConfig,
  ResendConfig,
  SmtpConfig,
  StoredEmail,
} from "./types";

// Configuration
export { loadEmailConfig, clearConfigCache, getCachedConfig, EmailConfigError } from "./config";

// Email Service
export { EmailService, sendEmail, sendEmailWithRetry } from "./email-service";

// Transports
export {
  createTransport,
  SmtpTransport,
  ResendTransport,
  FileTransport,
  MockTransport,
  getMockTransport,
  clearMockTransport,
} from "./transports";
export type { SentEmail } from "./transports";

// Templates
export { renderTemplate, BaseEmailLayout, EmailText, EmailButton, EmailInfoBox } from "./templates";
export type { RenderedTemplate, BaseEmailLayoutProps } from "./templates";

// Security Alerts
export {
  sendLockoutAlertEmail,
  sendPasswordChangedEmail,
  sendEmailChangedEmail,
} from "./security-alerts";

// Admin Notifications
export {
  getAdminEmails,
  isAdminNotificationEnabled,
  sendAdminNewUserNotification,
  sendAdminLockoutNotification,
  sendAdminPasswordResetNotification,
} from "./admin-notifications";
