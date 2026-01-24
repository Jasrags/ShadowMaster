/**
 * Email Configuration Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadEmailConfig, clearConfigCache, getCachedConfig, EmailConfigError } from "../config";

describe("Email Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment for each test
    vi.resetModules();
    clearConfigCache();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    clearConfigCache();
  });

  describe("loadEmailConfig", () => {
    it("loads default configuration when no environment variables set", () => {
      delete process.env.EMAIL_TRANSPORT;
      delete process.env.EMAIL_FROM;
      delete process.env.EMAIL_FROM_NAME;

      const config = loadEmailConfig();

      expect(config.transport).toBe("file");
      expect(config.from.email).toBe("noreply@localhost");
      expect(config.from.name).toBe("Shadow Master");
    });

    it("loads file transport configuration", () => {
      process.env.EMAIL_TRANSPORT = "file";
      process.env.EMAIL_FROM = "test@example.com";
      process.env.EMAIL_FROM_NAME = "Test App";

      const config = loadEmailConfig();

      expect(config.transport).toBe("file");
      expect(config.from.email).toBe("test@example.com");
      expect(config.from.name).toBe("Test App");
      expect(config.file).toBeDefined();
      expect(config.file?.outputDir).toBe("data/emails");
    });

    it("loads SMTP configuration", () => {
      process.env.EMAIL_TRANSPORT = "smtp";
      process.env.SMTP_HOST = "mail.example.com";
      process.env.SMTP_PORT = "465";
      process.env.SMTP_SECURE = "true";
      process.env.SMTP_USER = "user";
      process.env.SMTP_PASS = "pass";

      const config = loadEmailConfig();

      expect(config.transport).toBe("smtp");
      expect(config.smtp).toBeDefined();
      expect(config.smtp?.host).toBe("mail.example.com");
      expect(config.smtp?.port).toBe(465);
      expect(config.smtp?.secure).toBe(true);
      expect(config.smtp?.auth).toEqual({ user: "user", pass: "pass" });
    });

    it("loads SMTP without auth when credentials not provided", () => {
      process.env.EMAIL_TRANSPORT = "smtp";
      process.env.SMTP_HOST = "localhost";
      delete process.env.SMTP_USER;
      delete process.env.SMTP_PASS;

      const config = loadEmailConfig();

      expect(config.smtp?.auth).toBeUndefined();
    });

    it("throws error when SMTP host not provided", () => {
      process.env.EMAIL_TRANSPORT = "smtp";
      delete process.env.SMTP_HOST;

      expect(() => loadEmailConfig()).toThrow(EmailConfigError);
      expect(() => loadEmailConfig()).toThrow("SMTP_HOST is required");
    });

    it("loads Resend configuration", () => {
      process.env.EMAIL_TRANSPORT = "resend";
      process.env.RESEND_API_KEY = "re_test_key";

      const config = loadEmailConfig();

      expect(config.transport).toBe("resend");
      expect(config.resend).toBeDefined();
      expect(config.resend?.apiKey).toBe("re_test_key");
    });

    it("throws error when Resend API key not provided", () => {
      process.env.EMAIL_TRANSPORT = "resend";
      delete process.env.RESEND_API_KEY;

      expect(() => loadEmailConfig()).toThrow(EmailConfigError);
      expect(() => loadEmailConfig()).toThrow("RESEND_API_KEY is required");
    });

    it("loads mock transport configuration", () => {
      process.env.EMAIL_TRANSPORT = "mock";

      const config = loadEmailConfig();

      expect(config.transport).toBe("mock");
    });

    it("throws error for invalid transport type", () => {
      process.env.EMAIL_TRANSPORT = "invalid";

      expect(() => loadEmailConfig()).toThrow(EmailConfigError);
      expect(() => loadEmailConfig()).toThrow("Invalid EMAIL_TRANSPORT");
    });

    it("handles case-insensitive transport type", () => {
      process.env.EMAIL_TRANSPORT = "SMTP";
      process.env.SMTP_HOST = "localhost";

      const config = loadEmailConfig();

      expect(config.transport).toBe("smtp");
    });

    it("uses default SMTP port when not specified", () => {
      process.env.EMAIL_TRANSPORT = "smtp";
      process.env.SMTP_HOST = "localhost";
      delete process.env.SMTP_PORT;

      const config = loadEmailConfig();

      expect(config.smtp?.port).toBe(587);
    });

    it("uses default secure false when not specified", () => {
      process.env.EMAIL_TRANSPORT = "smtp";
      process.env.SMTP_HOST = "localhost";
      delete process.env.SMTP_SECURE;

      const config = loadEmailConfig();

      expect(config.smtp?.secure).toBe(false);
    });

    it("loads custom file output directory", () => {
      process.env.EMAIL_TRANSPORT = "file";
      process.env.EMAIL_OUTPUT_DIR = "/custom/path";

      const config = loadEmailConfig();

      expect(config.file?.outputDir).toBe("/custom/path");
    });
  });

  describe("Config Caching", () => {
    it("caches configuration after first load", () => {
      process.env.EMAIL_TRANSPORT = "file";
      process.env.EMAIL_FROM = "first@example.com";

      const config1 = loadEmailConfig();

      // Change environment
      process.env.EMAIL_FROM = "second@example.com";

      // Should return cached config
      const config2 = loadEmailConfig();

      expect(config1).toBe(config2);
      expect(config2.from.email).toBe("first@example.com");
    });

    it("reloads configuration when forceReload is true", () => {
      process.env.EMAIL_TRANSPORT = "file";
      process.env.EMAIL_FROM = "first@example.com";

      const config1 = loadEmailConfig();

      // Change environment
      process.env.EMAIL_FROM = "second@example.com";

      // Force reload
      const config2 = loadEmailConfig(true);

      expect(config2.from.email).toBe("second@example.com");
    });

    it("returns cached config via getCachedConfig", () => {
      expect(getCachedConfig()).toBeNull();

      const config = loadEmailConfig();

      expect(getCachedConfig()).toBe(config);
    });

    it("clears cache via clearConfigCache", () => {
      loadEmailConfig();
      expect(getCachedConfig()).not.toBeNull();

      clearConfigCache();

      expect(getCachedConfig()).toBeNull();
    });
  });
});
