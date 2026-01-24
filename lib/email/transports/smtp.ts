/**
 * SMTP Email Transport
 *
 * Uses nodemailer to send emails via SMTP.
 * Ideal for local development with Mailpit or production with services like Mailtrap.
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { EmailAddress, EmailMessage, EmailResult, EmailTransport, SmtpConfig } from "../types";

/**
 * Format an email address for nodemailer
 */
function formatAddress(addr: EmailAddress): string {
  if (addr.name) {
    return `"${addr.name}" <${addr.email}>`;
  }
  return addr.email;
}

/**
 * Format addresses (single or array) for nodemailer
 */
function formatAddresses(addrs: EmailAddress | EmailAddress[] | undefined): string | undefined {
  if (!addrs) return undefined;
  if (Array.isArray(addrs)) {
    return addrs.map(formatAddress).join(", ");
  }
  return formatAddress(addrs);
}

/**
 * SMTP Transport implementation
 */
export class SmtpTransport implements EmailTransport {
  readonly type = "smtp" as const;
  private transporter: Transporter;
  private defaultFrom: EmailAddress;

  constructor(config: SmtpConfig, defaultFrom: EmailAddress) {
    this.defaultFrom = defaultFrom;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
      // Disable certificate validation for local dev (Mailpit)
      tls: config.secure ? undefined : { rejectUnauthorized: false },
    });
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const timestamp = new Date().toISOString();

    try {
      const from = message.from || this.defaultFrom;

      const info = await this.transporter.sendMail({
        from: formatAddress(from),
        to: formatAddresses(message.to),
        cc: formatAddresses(message.cc),
        bcc: formatAddresses(message.bcc),
        replyTo: message.replyTo ? formatAddress(message.replyTo) : undefined,
        subject: message.subject,
        text: message.text,
        html: message.html,
        headers: message.headers,
        attachments: message.attachments?.map((att) => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
          encoding: att.encoding,
        })),
      });

      return {
        success: true,
        messageId: info.messageId,
        transport: this.type,
        timestamp,
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown SMTP error";
      return {
        success: false,
        error,
        transport: this.type,
        timestamp,
      };
    }
  }

  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    this.transporter.close();
  }
}
