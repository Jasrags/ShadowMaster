/**
 * Email Transport Factory
 *
 * Creates the appropriate transport based on configuration.
 */

import type { EmailConfig, EmailTransport } from "../types";
import { SmtpTransport } from "./smtp";
import { ResendTransport } from "./resend";
import { FileTransport } from "./file";
import { MockTransport, setMockTransport } from "./mock";

// Re-export transports and utilities
export { SmtpTransport } from "./smtp";
export { ResendTransport } from "./resend";
export { FileTransport } from "./file";
export { MockTransport, getMockTransport, clearMockTransport } from "./mock";
export type { SentEmail } from "./mock";

/**
 * Create a transport based on configuration
 *
 * @param config - Email configuration
 * @returns Configured transport instance
 * @throws Error if transport configuration is invalid
 */
export function createTransport(config: EmailConfig): EmailTransport {
  switch (config.transport) {
    case "smtp": {
      if (!config.smtp) {
        throw new Error("SMTP configuration is required for smtp transport");
      }
      return new SmtpTransport(config.smtp, config.from);
    }

    case "resend": {
      if (!config.resend) {
        throw new Error("Resend configuration is required for resend transport");
      }
      return new ResendTransport(config.resend, config.from);
    }

    case "file": {
      const fileConfig = config.file || { outputDir: "data/emails" };
      return new FileTransport(fileConfig, config.from);
    }

    case "mock": {
      const mockTransport = new MockTransport(config.from);
      setMockTransport(mockTransport);
      return mockTransport;
    }

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = config.transport;
      throw new Error(`Unknown transport type: ${_exhaustive}`);
    }
  }
}
