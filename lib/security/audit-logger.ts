import { promises as fs } from "fs";
import path from "path";
import { securityLogger } from "@/lib/logging";

const LOGS_DIR = path.join(process.cwd(), "data", "security", "logs");

export type SecurityEvent =
  | "signin.success"
  | "signin.failure"
  | "signout.success"
  | "signup.success"
  | "signup.rate_limited"
  | "session.created"
  | "session.invalidated"
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
  | "magic_link.requested"
  | "magic_link.sent"
  | "magic_link.success"
  | "magic_link.failed"
  | "magic_link.rate_limited"
  | "authorization.denied"
  | "email.delivery_failed"
  | "security_email.lockout_sent"
  | "security_email.password_changed_sent"
  | "security_email.email_changed_sent"
  | "admin_notification.new_user_sent"
  | "admin_notification.lockout_sent"
  | "admin_notification.password_reset_sent";

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

      securityLogger.info(
        { event: record.event, userId: record.userId, email: record.email, ip: record.ip },
        "Security event logged"
      );
    } catch (error) {
      securityLogger.error({ error, event: record.event }, "Failed to write to audit log");
    }
  }
}
