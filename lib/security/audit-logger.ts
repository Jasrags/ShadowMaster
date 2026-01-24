import { promises as fs } from "fs";
import path from "path";

const LOGS_DIR = path.join(process.cwd(), "data", "security", "logs");

export type SecurityEvent =
  | "signin.success"
  | "signin.failure"
  | "signup.success"
  | "lockout.triggered"
  | "lockout.expired"
  | "password.change"
  | "email.change"
  | "verification.sent"
  | "verification.success"
  | "verification.failed"
  | "verification.rate_limited"
  | "password_reset.requested"
  | "password_reset.sent"
  | "password_reset.success"
  | "password_reset.failed"
  | "password_reset.rate_limited"
  | "security_email.lockout_sent"
  | "security_email.password_changed_sent"
  | "security_email.email_changed_sent";

export interface SecurityRecord {
  timestamp: string;
  event: SecurityEvent;
  userId?: string;
  email?: string;
  ip?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

/**
 * Service for recording security-critical events
 */
export class AuditLogger {
  private static async ensureDirectory(): Promise<void> {
    await fs.mkdir(LOGS_DIR, { recursive: true });
  }

  /**
   * Record a security event to the daily audit log
   */
  public static async log(record: Omit<SecurityRecord, "timestamp">): Promise<void> {
    try {
      await this.ensureDirectory();

      const fullRecord: SecurityRecord = {
        ...record,
        timestamp: new Date().toISOString(),
      };

      const dateStr = new Date().toISOString().split("T")[0];
      const logFilePath = path.join(LOGS_DIR, `${dateStr}.jsonl`);

      const line = JSON.stringify(fullRecord) + "\n";
      await fs.appendFile(logFilePath, line, "utf-8");

      console.log(`[AuditLog] ${record.event}: ${record.userId || record.email || record.ip}`);
    } catch (error) {
      console.error("Failed to write to audit log:", error);
    }
  }
}
