/**
 * File Email Transport
 *
 * Writes emails to JSON files in a directory.
 * Ideal as a fallback when no email service is configured.
 */

import fs from "fs/promises";
import path from "path";
import type {
  EmailAddress,
  EmailMessage,
  EmailResult,
  EmailTransport,
  FileTransportConfig,
  StoredEmail,
} from "../types";

/**
 * Generate a unique filename for the email
 */
function generateFilename(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const random = Math.random().toString(36).substring(2, 8);
  return `email-${timestamp}-${random}.json`;
}

/**
 * Format addresses for display
 */
function formatRecipients(addrs: EmailAddress | EmailAddress[]): string {
  if (Array.isArray(addrs)) {
    return addrs.map((a) => a.email).join(", ");
  }
  return addrs.email;
}

/**
 * File Transport implementation
 */
export class FileTransport implements EmailTransport {
  readonly type = "file" as const;
  private outputDir: string;
  private defaultFrom: EmailAddress;

  constructor(config: FileTransportConfig, defaultFrom: EmailAddress) {
    this.outputDir = config.outputDir;
    this.defaultFrom = defaultFrom;
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    const timestamp = new Date().toISOString();
    const filename = generateFilename();
    const filepath = path.join(this.outputDir, filename);

    try {
      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true });

      // Create stored email record
      const storedEmail: StoredEmail = {
        id: filename.replace(".json", ""),
        message: {
          ...message,
          from: message.from || this.defaultFrom,
        },
        result: {
          success: true,
          messageId: filename.replace(".json", ""),
          transport: this.type,
          timestamp,
        },
        sentAt: timestamp,
      };

      // Write email to file
      await fs.writeFile(filepath, JSON.stringify(storedEmail, null, 2), "utf-8");

      // Log for visibility during development
      const recipients = formatRecipients(message.to);
      console.log(`[Email] Saved to ${filepath}`);
      console.log(`  To: ${recipients}`);
      console.log(`  Subject: ${message.subject}`);

      return {
        success: true,
        messageId: storedEmail.id,
        transport: this.type,
        timestamp,
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown file transport error";
      console.error(`[Email] Failed to save email: ${error}`);
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
      await fs.mkdir(this.outputDir, { recursive: true });
      // Try to write and delete a test file
      const testFile = path.join(this.outputDir, ".verify-test");
      await fs.writeFile(testFile, "test", "utf-8");
      await fs.unlink(testFile);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * List all stored emails in the output directory
   */
  async listEmails(): Promise<StoredEmail[]> {
    try {
      const files = await fs.readdir(this.outputDir);
      const emails: StoredEmail[] = [];

      for (const file of files) {
        if (file.endsWith(".json") && file.startsWith("email-")) {
          const content = await fs.readFile(path.join(this.outputDir, file), "utf-8");
          emails.push(JSON.parse(content));
        }
      }

      return emails.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    } catch {
      return [];
    }
  }

  /**
   * Clear all stored emails
   */
  async clearEmails(): Promise<void> {
    try {
      const files = await fs.readdir(this.outputDir);
      for (const file of files) {
        if (file.endsWith(".json") && file.startsWith("email-")) {
          await fs.unlink(path.join(this.outputDir, file));
        }
      }
    } catch {
      // Directory might not exist, that's fine
    }
  }
}
