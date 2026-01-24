/**
 * Email Service
 *
 * Main service for sending emails with transport abstraction.
 * Provides singleton instance and convenience functions.
 */

import { loadEmailConfig, clearConfigCache } from "./config";
import { createTransport } from "./transports";
import type { EmailConfig, EmailMessage, EmailResult, EmailTransport } from "./types";

/**
 * Delay utility for retry logic
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Email Service class
 *
 * Manages email sending with configurable transports.
 * Uses singleton pattern for consistent state across the application.
 */
export class EmailService {
  private static instance: EmailService | null = null;

  private transport: EmailTransport;
  private config: EmailConfig;

  /**
   * Private constructor - use getInstance() instead
   */
  private constructor(config: EmailConfig) {
    this.config = config;
    this.transport = createTransport(config);
  }

  /**
   * Get the singleton EmailService instance
   *
   * Creates the instance on first call, reuses on subsequent calls.
   *
   * @param config - Optional config override (primarily for testing)
   */
  public static getInstance(config?: EmailConfig): EmailService {
    if (!EmailService.instance) {
      const effectiveConfig = config || loadEmailConfig();
      EmailService.instance = new EmailService(effectiveConfig);
    }
    return EmailService.instance;
  }

  /**
   * Reset the singleton instance
   *
   * Useful for testing when you need a fresh instance.
   */
  public static resetInstance(): void {
    if (EmailService.instance) {
      EmailService.instance.transport.close?.();
    }
    EmailService.instance = null;
    clearConfigCache();
  }

  /**
   * Create a new EmailService with custom config (for testing)
   *
   * Does NOT affect the singleton instance.
   */
  public static create(config: EmailConfig): EmailService {
    return new EmailService(config);
  }

  /**
   * Send an email
   *
   * @param message - The email to send
   * @returns Result of the send operation
   */
  public async send(message: EmailMessage): Promise<EmailResult> {
    return this.transport.send(message);
  }

  /**
   * Send an email with retry logic
   *
   * Retries with exponential backoff on failure.
   *
   * @param message - The email to send
   * @param maxRetries - Maximum number of retry attempts (default: 3)
   * @param initialDelayMs - Initial delay before first retry (default: 1000ms)
   * @returns Result of the send operation
   */
  public async sendWithRetry(
    message: EmailMessage,
    maxRetries = 3,
    initialDelayMs = 1000
  ): Promise<EmailResult> {
    let lastResult: EmailResult | null = null;
    let delayMs = initialDelayMs;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const result = await this.transport.send(message);

      if (result.success) {
        return result;
      }

      lastResult = result;

      if (attempt < maxRetries) {
        console.log(`[Email] Attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`);
        await delay(delayMs);
        delayMs *= 2; // Exponential backoff
      }
    }

    // Return the last failure result
    return lastResult!;
  }

  /**
   * Verify transport connection
   *
   * @returns true if the transport is connected and ready
   */
  public async verify(): Promise<boolean> {
    if (this.transport.verify) {
      return this.transport.verify();
    }
    return true;
  }

  /**
   * Get the current transport type
   */
  public getTransportType(): string {
    return this.transport.type;
  }

  /**
   * Get the current configuration
   */
  public getConfig(): EmailConfig {
    return { ...this.config };
  }

  /**
   * Get the underlying transport (for testing)
   */
  public getTransport(): EmailTransport {
    return this.transport;
  }
}

// ===== Convenience Functions =====

/**
 * Send an email using the default EmailService instance
 *
 * @param message - The email to send
 * @returns Result of the send operation
 *
 * @example
 * ```typescript
 * const result = await sendEmail({
 *   to: { email: 'user@example.com', name: 'User' },
 *   subject: 'Welcome!',
 *   text: 'Welcome to Shadow Master!',
 *   html: '<h1>Welcome to Shadow Master!</h1>',
 * });
 * ```
 */
export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  return EmailService.getInstance().send(message);
}

/**
 * Send an email with retry logic using the default EmailService instance
 *
 * @param message - The email to send
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @returns Result of the send operation
 */
export async function sendEmailWithRetry(
  message: EmailMessage,
  maxRetries = 3
): Promise<EmailResult> {
  return EmailService.getInstance().sendWithRetry(message, maxRetries);
}
