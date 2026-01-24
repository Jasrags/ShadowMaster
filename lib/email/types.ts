/**
 * Email Infrastructure Types
 *
 * Core type definitions for the email service abstraction layer.
 */

/**
 * Available email transport types
 */
export type EmailTransportType = "smtp" | "resend" | "file" | "mock";

/**
 * Email address with optional display name
 */
export interface EmailAddress {
  email: string;
  name?: string;
}

/**
 * Email attachment
 */
export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
  encoding?: "base64" | "utf-8";
}

/**
 * Email message to be sent
 */
export interface EmailMessage {
  /** Sender address (defaults to configured from address) */
  from?: EmailAddress;
  /** Recipient(s) */
  to: EmailAddress | EmailAddress[];
  /** CC recipient(s) */
  cc?: EmailAddress | EmailAddress[];
  /** BCC recipient(s) */
  bcc?: EmailAddress | EmailAddress[];
  /** Reply-to address */
  replyTo?: EmailAddress;
  /** Email subject line */
  subject: string;
  /** Plain text body */
  text?: string;
  /** HTML body */
  html?: string;
  /** File attachments */
  attachments?: EmailAttachment[];
  /** Custom headers */
  headers?: Record<string, string>;
  /** Tags for categorization (Resend feature) */
  tags?: Array<{ name: string; value: string }>;
}

/**
 * Result of sending an email
 */
export interface EmailResult {
  /** Whether the send was successful */
  success: boolean;
  /** Message ID from the transport */
  messageId?: string;
  /** Error message if failed */
  error?: string;
  /** Which transport was used */
  transport: EmailTransportType;
  /** ISO timestamp of the send attempt */
  timestamp: string;
}

/**
 * Email transport interface
 *
 * All transports must implement this interface to be usable by EmailService.
 */
export interface EmailTransport {
  /** Transport type identifier */
  readonly type: EmailTransportType;

  /**
   * Send an email message
   * @param message The email to send
   * @returns Result of the send operation
   */
  send(message: EmailMessage): Promise<EmailResult>;

  /**
   * Verify transport connection (optional)
   * @returns true if connection is valid
   */
  verify?(): Promise<boolean>;

  /**
   * Close transport connection and cleanup (optional)
   */
  close?(): Promise<void>;
}

/**
 * SMTP transport configuration
 */
export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

/**
 * Resend transport configuration
 */
export interface ResendConfig {
  apiKey: string;
}

/**
 * File transport configuration
 */
export interface FileTransportConfig {
  outputDir: string;
}

/**
 * Complete email configuration
 */
export interface EmailConfig {
  /** Which transport to use */
  transport: EmailTransportType;
  /** Default sender address */
  from: EmailAddress;
  /** SMTP-specific configuration */
  smtp?: SmtpConfig;
  /** Resend-specific configuration */
  resend?: ResendConfig;
  /** File transport configuration */
  file?: FileTransportConfig;
}

/**
 * Stored email record (for file transport)
 */
export interface StoredEmail {
  id: string;
  message: EmailMessage;
  result: EmailResult;
  sentAt: string;
}
