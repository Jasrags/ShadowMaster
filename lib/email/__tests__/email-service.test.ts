/**
 * Email Service Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { EmailService, sendEmail, sendEmailWithRetry } from "../email-service";
import { MockTransport, getMockTransport, clearMockTransport } from "../transports/mock";
import { clearConfigCache } from "../config";
import type { EmailConfig, EmailMessage } from "../types";

describe("EmailService", () => {
  const mockConfig: EmailConfig = {
    transport: "mock",
    from: { email: "test@example.com", name: "Test" },
  };

  const testMessage: EmailMessage = {
    to: { email: "recipient@example.com", name: "Recipient" },
    subject: "Test Email",
    text: "Hello, this is a test email.",
    html: "<p>Hello, this is a test email.</p>",
  };

  beforeEach(() => {
    EmailService.resetInstance();
    clearConfigCache();
    clearMockTransport();
  });

  afterEach(() => {
    EmailService.resetInstance();
    clearMockTransport();
  });

  describe("getInstance", () => {
    it("creates singleton instance", () => {
      const instance1 = EmailService.getInstance(mockConfig);
      const instance2 = EmailService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it("uses provided config", () => {
      const service = EmailService.getInstance(mockConfig);

      expect(service.getTransportType()).toBe("mock");
    });

    it("returns same instance after resetInstance", () => {
      const instance1 = EmailService.getInstance(mockConfig);
      EmailService.resetInstance();
      const instance2 = EmailService.getInstance(mockConfig);

      expect(instance1).not.toBe(instance2);
    });
  });

  describe("create", () => {
    it("creates independent instance", () => {
      const service1 = EmailService.create(mockConfig);
      const service2 = EmailService.create(mockConfig);

      expect(service1).not.toBe(service2);
    });
  });

  describe("send", () => {
    it("sends email successfully", async () => {
      const service = EmailService.create(mockConfig);

      const result = await service.send(testMessage);

      expect(result.success).toBe(true);
      expect(result.transport).toBe("mock");
      expect(result.messageId).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it("captures sent email in mock transport", async () => {
      const service = EmailService.create(mockConfig);

      await service.send(testMessage);

      const transport = service.getTransport() as MockTransport;
      const sent = transport.getSentEmails();

      expect(sent).toHaveLength(1);
      expect(sent[0].message.subject).toBe("Test Email");
      expect(sent[0].message.to).toEqual({ email: "recipient@example.com", name: "Recipient" });
    });

    it("uses default from address when not specified in message", async () => {
      const service = EmailService.create(mockConfig);

      await service.send(testMessage);

      const transport = service.getTransport() as MockTransport;
      const sent = transport.getLastEmail();

      expect(sent?.message.from).toEqual({ email: "test@example.com", name: "Test" });
    });

    it("uses message from address when specified", async () => {
      const service = EmailService.create(mockConfig);
      const messageWithFrom: EmailMessage = {
        ...testMessage,
        from: { email: "custom@example.com", name: "Custom" },
      };

      await service.send(messageWithFrom);

      const transport = service.getTransport() as MockTransport;
      const sent = transport.getLastEmail();

      expect(sent?.message.from).toEqual({ email: "custom@example.com", name: "Custom" });
    });

    it("handles send failure", async () => {
      const service = EmailService.create(mockConfig);
      const transport = service.getTransport() as MockTransport;
      transport.simulateFailure("Connection failed");

      const result = await service.send(testMessage);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection failed");
    });

    it("sends email with cc and bcc", async () => {
      const service = EmailService.create(mockConfig);
      const message: EmailMessage = {
        ...testMessage,
        cc: [{ email: "cc@example.com" }],
        bcc: { email: "bcc@example.com" },
      };

      await service.send(message);

      const transport = service.getTransport() as MockTransport;
      const sent = transport.getLastEmail();

      expect(sent?.message.cc).toEqual([{ email: "cc@example.com" }]);
      expect(sent?.message.bcc).toEqual({ email: "bcc@example.com" });
    });

    it("sends email with attachments", async () => {
      const service = EmailService.create(mockConfig);
      const message: EmailMessage = {
        ...testMessage,
        attachments: [
          {
            filename: "test.txt",
            content: "Hello, World!",
            contentType: "text/plain",
          },
        ],
      };

      await service.send(message);

      const transport = service.getTransport() as MockTransport;
      const sent = transport.getLastEmail();

      expect(sent?.message.attachments).toHaveLength(1);
      expect(sent?.message.attachments?.[0].filename).toBe("test.txt");
    });
  });

  describe("sendWithRetry", () => {
    it("succeeds on first attempt", async () => {
      const service = EmailService.create(mockConfig);

      const result = await service.sendWithRetry(testMessage, 3);

      expect(result.success).toBe(true);

      const transport = service.getTransport() as MockTransport;
      expect(transport.getEmailCount()).toBe(1);
    });

    it("retries on failure and eventually succeeds", async () => {
      const service = EmailService.create(mockConfig);
      const transport = service.getTransport() as MockTransport;

      // Fail first two attempts, succeed on third
      let attempts = 0;
      const originalSend = transport.send.bind(transport);
      vi.spyOn(transport, "send").mockImplementation(async (msg) => {
        attempts++;
        if (attempts < 3) {
          return {
            success: false,
            error: "Temporary failure",
            transport: "mock",
            timestamp: new Date().toISOString(),
          };
        }
        return originalSend(msg);
      });

      const result = await service.sendWithRetry(testMessage, 3, 10);

      expect(result.success).toBe(true);
      expect(attempts).toBe(3);
    });

    it("returns failure after max retries exceeded", async () => {
      const service = EmailService.create(mockConfig);
      const transport = service.getTransport() as MockTransport;
      transport.simulateFailure("Permanent failure");

      const result = await service.sendWithRetry(testMessage, 2, 10);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Permanent failure");
    });

    it("uses exponential backoff", async () => {
      const service = EmailService.create(mockConfig);
      const transport = service.getTransport() as MockTransport;
      transport.simulateFailure("Failure");

      const start = Date.now();
      await service.sendWithRetry(testMessage, 2, 50);
      const elapsed = Date.now() - start;

      // Should have waited ~50ms + ~100ms = ~150ms minimum
      expect(elapsed).toBeGreaterThanOrEqual(140);
    });
  });

  describe("verify", () => {
    it("returns true for working transport", async () => {
      const service = EmailService.create(mockConfig);

      const result = await service.verify();

      expect(result).toBe(true);
    });

    it("returns false when transport is in failure mode", async () => {
      const service = EmailService.create(mockConfig);
      const transport = service.getTransport() as MockTransport;
      transport.simulateFailure();

      const result = await service.verify();

      expect(result).toBe(false);
    });
  });

  describe("getConfig", () => {
    it("returns copy of configuration", () => {
      const service = EmailService.create(mockConfig);

      const config = service.getConfig();

      expect(config).toEqual(mockConfig);
      expect(config).not.toBe(mockConfig);
    });
  });
});

describe("Convenience Functions", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.EMAIL_TRANSPORT = "mock";
    EmailService.resetInstance();
    clearConfigCache();
    clearMockTransport();
  });

  afterEach(() => {
    process.env = originalEnv;
    EmailService.resetInstance();
    clearMockTransport();
  });

  describe("sendEmail", () => {
    it("sends email using singleton instance", async () => {
      const result = await sendEmail({
        to: { email: "test@example.com" },
        subject: "Test",
        text: "Hello",
      });

      expect(result.success).toBe(true);
      expect(result.transport).toBe("mock");
    });
  });

  describe("sendEmailWithRetry", () => {
    it("sends email with retry using singleton instance", async () => {
      const result = await sendEmailWithRetry(
        {
          to: { email: "test@example.com" },
          subject: "Test",
          text: "Hello",
        },
        2
      );

      expect(result.success).toBe(true);
    });
  });
});
