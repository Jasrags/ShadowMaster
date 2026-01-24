/**
 * Email Transport Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs/promises";
import path from "path";
import {
  createTransport,
  MockTransport,
  FileTransport,
  getMockTransport,
  clearMockTransport,
} from "../transports";
import type { EmailConfig, EmailMessage, StoredEmail } from "../types";

const defaultFrom = { email: "test@example.com", name: "Test" };

const testMessage: EmailMessage = {
  to: { email: "recipient@example.com", name: "Recipient" },
  subject: "Test Email",
  text: "Hello, this is a test.",
  html: "<p>Hello, this is a test.</p>",
};

describe("MockTransport", () => {
  let transport: MockTransport;

  beforeEach(() => {
    transport = new MockTransport(defaultFrom);
  });

  describe("send", () => {
    it("sends email successfully", async () => {
      const result = await transport.send(testMessage);

      expect(result.success).toBe(true);
      expect(result.transport).toBe("mock");
      expect(result.messageId).toMatch(/^mock-\d+-\d+$/);
      expect(result.timestamp).toBeDefined();
    });

    it("stores sent emails", async () => {
      await transport.send(testMessage);
      await transport.send({ ...testMessage, subject: "Second Email" });

      expect(transport.getEmailCount()).toBe(2);
    });

    it("uses default from when not provided", async () => {
      await transport.send(testMessage);

      const sent = transport.getLastEmail();
      expect(sent?.message.from).toEqual(defaultFrom);
    });

    it("uses message from when provided", async () => {
      const customFrom = { email: "custom@example.com" };
      await transport.send({ ...testMessage, from: customFrom });

      const sent = transport.getLastEmail();
      expect(sent?.message.from).toEqual(customFrom);
    });
  });

  describe("failure simulation", () => {
    it("returns failure when simulateFailure is called", async () => {
      transport.simulateFailure("Test error");

      const result = await transport.send(testMessage);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Test error");
    });

    it("still records failed emails", async () => {
      transport.simulateFailure();

      await transport.send(testMessage);

      expect(transport.getEmailCount()).toBe(1);
    });

    it("clears failure mode", async () => {
      transport.simulateFailure();
      transport.clearFailure();

      const result = await transport.send(testMessage);

      expect(result.success).toBe(true);
    });

    it("reports failure mode status", () => {
      expect(transport.isFailureMode()).toBe(false);

      transport.simulateFailure();
      expect(transport.isFailureMode()).toBe(true);

      transport.clearFailure();
      expect(transport.isFailureMode()).toBe(false);
    });
  });

  describe("verify", () => {
    it("returns true when not in failure mode", async () => {
      expect(await transport.verify()).toBe(true);
    });

    it("returns false when in failure mode", async () => {
      transport.simulateFailure();
      expect(await transport.verify()).toBe(false);
    });
  });

  describe("query methods", () => {
    beforeEach(async () => {
      await transport.send({ ...testMessage, to: { email: "alice@example.com" } });
      await transport.send({
        ...testMessage,
        to: { email: "bob@example.com" },
        subject: "Hello Bob",
      });
      await transport.send({
        ...testMessage,
        to: [{ email: "alice@example.com" }, { email: "charlie@example.com" }],
      });
    });

    it("finds emails by recipient", () => {
      const aliceEmails = transport.findEmailsTo("alice@example.com");
      expect(aliceEmails).toHaveLength(2);
    });

    it("finds emails by subject", () => {
      const bobEmails = transport.findEmailsBySubject("Hello Bob");
      expect(bobEmails).toHaveLength(1);
    });

    it("returns all sent emails", () => {
      expect(transport.getSentEmails()).toHaveLength(3);
    });

    it("returns last email", () => {
      const last = transport.getLastEmail();
      expect(last?.message.to).toEqual([
        { email: "alice@example.com" },
        { email: "charlie@example.com" },
      ]);
    });

    it("clears all emails", () => {
      transport.clear();
      expect(transport.getEmailCount()).toBe(0);
      expect(transport.getLastEmail()).toBeUndefined();
    });
  });
});

describe("FileTransport", () => {
  const testOutputDir = "data/emails-test";
  let transport: FileTransport;

  beforeEach(async () => {
    transport = new FileTransport({ outputDir: testOutputDir }, defaultFrom);
    // Clean up test directory
    try {
      const files = await fs.readdir(testOutputDir);
      for (const file of files) {
        if (file.endsWith(".json")) {
          await fs.unlink(path.join(testOutputDir, file));
        }
      }
    } catch {
      // Directory might not exist yet
    }
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      const files = await fs.readdir(testOutputDir);
      for (const file of files) {
        if (file.endsWith(".json")) {
          await fs.unlink(path.join(testOutputDir, file));
        }
      }
      await fs.rmdir(testOutputDir);
    } catch {
      // Directory might not exist
    }
  });

  describe("send", () => {
    it("creates email file", async () => {
      const result = await transport.send(testMessage);

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();

      const files = await fs.readdir(testOutputDir);
      const emailFiles = files.filter((f) => f.startsWith("email-") && f.endsWith(".json"));
      expect(emailFiles).toHaveLength(1);
    });

    it("writes correct content to file", async () => {
      await transport.send(testMessage);

      const emails = await transport.listEmails();
      expect(emails).toHaveLength(1);

      const stored = emails[0];
      expect(stored.message.subject).toBe("Test Email");
      expect(stored.message.to).toEqual({ email: "recipient@example.com", name: "Recipient" });
      expect(stored.result.success).toBe(true);
    });

    it("creates output directory if it does not exist", async () => {
      const newDir = "data/emails-new-test";
      const newTransport = new FileTransport({ outputDir: newDir }, defaultFrom);

      const result = await newTransport.send(testMessage);

      expect(result.success).toBe(true);

      // Clean up
      const files = await fs.readdir(newDir);
      for (const file of files) {
        await fs.unlink(path.join(newDir, file));
      }
      await fs.rmdir(newDir);
    });

    it("generates unique filenames", async () => {
      await transport.send(testMessage);
      await transport.send(testMessage);
      await transport.send(testMessage);

      const emails = await transport.listEmails();
      const ids = emails.map((e) => e.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });
  });

  describe("verify", () => {
    it("returns true for valid directory", async () => {
      expect(await transport.verify()).toBe(true);
    });
  });

  describe("listEmails", () => {
    it("returns emails sorted by date (newest first)", async () => {
      await transport.send({ ...testMessage, subject: "First" });
      await new Promise((r) => setTimeout(r, 10));
      await transport.send({ ...testMessage, subject: "Second" });
      await new Promise((r) => setTimeout(r, 10));
      await transport.send({ ...testMessage, subject: "Third" });

      const emails = await transport.listEmails();

      expect(emails[0].message.subject).toBe("Third");
      expect(emails[2].message.subject).toBe("First");
    });

    it("returns empty array for non-existent directory", async () => {
      const emptyTransport = new FileTransport({ outputDir: "data/nonexistent" }, defaultFrom);

      const emails = await emptyTransport.listEmails();

      expect(emails).toEqual([]);
    });
  });

  describe("clearEmails", () => {
    it("removes all email files", async () => {
      await transport.send(testMessage);
      await transport.send(testMessage);

      await transport.clearEmails();

      const emails = await transport.listEmails();
      expect(emails).toHaveLength(0);
    });
  });
});

describe("createTransport", () => {
  beforeEach(() => {
    clearMockTransport();
  });

  it("creates mock transport", () => {
    const config: EmailConfig = {
      transport: "mock",
      from: defaultFrom,
    };

    const transport = createTransport(config);

    expect(transport.type).toBe("mock");
    expect(transport).toBeInstanceOf(MockTransport);
  });

  it("creates file transport", () => {
    const config: EmailConfig = {
      transport: "file",
      from: defaultFrom,
      file: { outputDir: "data/emails" },
    };

    const transport = createTransport(config);

    expect(transport.type).toBe("file");
    expect(transport).toBeInstanceOf(FileTransport);
  });

  it("creates file transport with default config", () => {
    const config: EmailConfig = {
      transport: "file",
      from: defaultFrom,
    };

    const transport = createTransport(config);

    expect(transport.type).toBe("file");
  });

  it("sets global mock transport reference", () => {
    expect(getMockTransport()).toBeNull();

    const config: EmailConfig = {
      transport: "mock",
      from: defaultFrom,
    };

    createTransport(config);

    expect(getMockTransport()).not.toBeNull();
  });

  it("throws error for smtp without config", () => {
    const config: EmailConfig = {
      transport: "smtp",
      from: defaultFrom,
    };

    expect(() => createTransport(config)).toThrow("SMTP configuration is required");
  });

  it("throws error for resend without config", () => {
    const config: EmailConfig = {
      transport: "resend",
      from: defaultFrom,
    };

    expect(() => createTransport(config)).toThrow("Resend configuration is required");
  });
});
