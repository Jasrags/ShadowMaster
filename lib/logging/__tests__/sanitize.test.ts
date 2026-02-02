import { describe, it, expect } from "vitest";
import { sanitizeLogValue } from "../sanitize";

describe("sanitizeLogValue", () => {
  describe("safe values pass through unchanged", () => {
    it("returns normal strings unchanged", () => {
      expect(sanitizeLogValue("hello world")).toBe("hello world");
    });

    it("returns alphanumeric strings unchanged", () => {
      expect(sanitizeLogValue("user123")).toBe("user123");
    });

    it("returns paths unchanged", () => {
      expect(sanitizeLogValue("/api/characters/abc-123")).toBe("/api/characters/abc-123");
    });

    it("returns emails unchanged", () => {
      expect(sanitizeLogValue("user@example.com")).toBe("user@example.com");
    });

    it("preserves unicode characters", () => {
      expect(sanitizeLogValue("日本語テスト")).toBe("日本語テスト");
      expect(sanitizeLogValue("émojis 🎮")).toBe("émojis 🎮");
    });
  });

  describe("handles null and undefined", () => {
    it("converts null to string", () => {
      expect(sanitizeLogValue(null)).toBe("null");
    });

    it("converts undefined to string", () => {
      expect(sanitizeLogValue(undefined)).toBe("undefined");
    });
  });

  describe("handles non-string values", () => {
    it("converts numbers to string", () => {
      expect(sanitizeLogValue(42)).toBe("42");
      expect(sanitizeLogValue(3.14)).toBe("3.14");
    });

    it("converts booleans to string", () => {
      expect(sanitizeLogValue(true)).toBe("true");
      expect(sanitizeLogValue(false)).toBe("false");
    });

    it("converts objects to string", () => {
      expect(sanitizeLogValue({ key: "value" })).toBe("[object Object]");
    });
  });

  describe("escapes newlines (CWE-117 primary vector)", () => {
    it("escapes LF (\\n)", () => {
      expect(sanitizeLogValue("line1\nline2")).toBe("line1\\nline2");
    });

    it("escapes CR (\\r)", () => {
      expect(sanitizeLogValue("line1\rline2")).toBe("line1\\rline2");
    });

    it("escapes CRLF (\\r\\n)", () => {
      expect(sanitizeLogValue("line1\r\nline2")).toBe("line1\\r\\nline2");
    });

    it("escapes multiple newlines", () => {
      expect(sanitizeLogValue("a\nb\nc")).toBe("a\\nb\\nc");
    });
  });

  describe("escapes other control characters", () => {
    it("escapes tab (\\t)", () => {
      expect(sanitizeLogValue("col1\tcol2")).toBe("col1\\tcol2");
    });

    it("escapes null byte (\\0)", () => {
      expect(sanitizeLogValue("before\x00after")).toBe("before\\0after");
    });

    it("escapes ESC as hex", () => {
      expect(sanitizeLogValue("test\x1bcolor")).toBe("test\\x1bcolor");
    });

    it("escapes backspace as hex", () => {
      expect(sanitizeLogValue("test\x08back")).toBe("test\\x08back");
    });

    it("escapes form feed as hex", () => {
      expect(sanitizeLogValue("page\x0cnew")).toBe("page\\x0cnew");
    });

    it("escapes vertical tab as hex", () => {
      expect(sanitizeLogValue("line\x0bdown")).toBe("line\\x0bdown");
    });

    it("escapes DEL (0x7F) as hex", () => {
      expect(sanitizeLogValue("test\x7fdel")).toBe("test\\x7fdel");
    });
  });

  describe("neutralizes log injection attack payloads", () => {
    it("prevents fake log entry injection", () => {
      const malicious = "attacker\n[INFO] User admin logged in successfully";
      const sanitized = sanitizeLogValue(malicious);
      expect(sanitized).toBe("attacker\\n[INFO] User admin logged in successfully");
      expect(sanitized).not.toContain("\n");
    });

    it("prevents multiline injection with CRLF", () => {
      const malicious = "value\r\n[CRITICAL] System compromised\r\n[INFO] Normal";
      const sanitized = sanitizeLogValue(malicious);
      expect(sanitized).toBe("value\\r\\n[CRITICAL] System compromised\\r\\n[INFO] Normal");
      expect(sanitized).not.toContain("\r");
      expect(sanitized).not.toContain("\n");
    });

    it("prevents ANSI escape sequence injection", () => {
      const malicious = "normal\x1b[31mRED_TEXT\x1b[0m";
      const sanitized = sanitizeLogValue(malicious);
      expect(sanitized).toBe("normal\\x1b[31mRED_TEXT\\x1b[0m");
      expect(sanitized).not.toContain("\x1b");
    });

    it("prevents null byte injection", () => {
      const malicious = "visible\x00hidden";
      const sanitized = sanitizeLogValue(malicious);
      expect(sanitized).toBe("visible\\0hidden");
      expect(sanitized).not.toContain("\x00");
    });
  });
});
