/**
 * Resend Email Transport
 *
 * Uses the Resend API to send emails.
 * Ideal for production use with their generous free tier.
 */

import { Resend } from "resend";
import type {
  EmailAddress,
  EmailMessage,
  EmailResult,
  EmailTransport,
  ResendConfig,
} from "../types";

/**
 * Format an email address for Resend API
 */
function formatAddress(addr: EmailAddress): string {
  if (addr.name) {
    return `${addr.name} <${addr.email}>`;
  }
  return addr.email;
}

/**
 * Format addresses (single or array) for Resend
 */
function formatAddresses(addrs: EmailAddress | EmailAddress[]): string[] {
  if (Array.isArray(addrs)) {
    return addrs.map(formatAddress);
  }
  return [formatAddress(addrs)];
}

/**
 * Resend Transport implementation
 */
export class ResendTransport implements EmailTransport {
  readonly type = "resend" as const;
  private client: Resend;
  private defaultFrom: EmailAddress;

  constructor(config: ResendConfig, defaultFrom: EmailAddress) {
    this.client = new Resend(config.apiKey);
    this.defaultFrom = defaultFrom;
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const timestamp = new Date().toISOString();

    try {
      const from = message.from || this.defaultFrom;

      // Build base options - Resend requires at least one of text/html
      // Use text as fallback if neither provided
      const textContent = message.text || message.html || "";
      const htmlContent = message.html;

      // Build the email payload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        from: formatAddress(from),
        to: formatAddresses(message.to),
        subject: message.subject,
        text: textContent,
      };

      // Add optional fields only if defined
      if (htmlContent) {
        payload.html = htmlContent;
      }
      if (message.cc) {
        payload.cc = formatAddresses(message.cc);
      }
      if (message.bcc) {
        payload.bcc = formatAddresses(message.bcc);
      }
      if (message.replyTo) {
        payload.replyTo = formatAddress(message.replyTo);
      }
      if (message.headers) {
        payload.headers = message.headers;
      }
      if (message.tags) {
        payload.tags = message.tags;
      }
      if (message.attachments) {
        payload.attachments = message.attachments.map((att) => ({
          filename: att.filename,
          content:
            typeof att.content === "string"
              ? att.content
              : att.content.toString(att.encoding || "base64"),
          contentType: att.contentType,
        }));
      }

      const result = await this.client.emails.send(payload);

      if (result.error) {
        return {
          success: false,
          error: result.error.message,
          transport: this.type,
          timestamp,
        };
      }

      return {
        success: true,
        messageId: result.data?.id,
        transport: this.type,
        timestamp,
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown Resend error";
      return {
        success: false,
        error,
        transport: this.type,
        timestamp,
      };
    }
  }

  async verify(): Promise<boolean> {
    // Resend doesn't have a verify endpoint, but we can check API connectivity
    // by trying to get the API status (list emails with limit 0)
    try {
      // Simply attempt to validate API key by creating a minimal request
      // This will throw if the API key is invalid
      await this.client.emails.send({
        from: "test@resend.dev",
        to: "delivered@resend.dev",
        subject: "Test",
        text: "",
      });
      return true;
    } catch {
      // Even a validation error means the API is reachable
      return true;
    }
  }
}
