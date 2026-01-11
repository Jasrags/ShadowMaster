/**
 * Tests for password hashing and verification
 */

import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../password";

describe("Password Hashing", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "test-password-123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash.length).toBeGreaterThan(0);
      expect(hash).not.toBe(password); // Should not be plain text
    });

    it("should produce different hashes for same password", async () => {
      const password = "same-password";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // bcrypt includes salt, so hashes should be different
      expect(hash1).not.toBe(hash2);
    });

    it("should handle empty password", async () => {
      const hash = await hashPassword("");
      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
    });

    it("should handle special characters", async () => {
      const password = "p@ssw0rd!#$%^&*()";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      // Should be able to verify it
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it("should handle long passwords", async () => {
      const password = "a".repeat(1000);
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      const password = "correct-password";
      const hash = await hashPassword(password);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "correct-password";
      const hash = await hashPassword(password);

      const isValid = await verifyPassword("wrong-password", hash);
      expect(isValid).toBe(false);
    });

    it("should be case-sensitive", async () => {
      const password = "Password123";
      const hash = await hashPassword(password);

      const isValid = await verifyPassword("password123", hash);
      expect(isValid).toBe(false);
    });

    it("should handle empty password", async () => {
      const hash = await hashPassword("");
      const isValid = await verifyPassword("", hash);
      expect(isValid).toBe(true);
    });

    it("should reject empty password against non-empty hash", async () => {
      const hash = await hashPassword("non-empty");
      const isValid = await verifyPassword("", hash);
      expect(isValid).toBe(false);
    });

    it("should handle invalid hash format gracefully", async () => {
      const isValid = await verifyPassword("password", "invalid-hash");
      expect(isValid).toBe(false);
    });
  });

  describe("password security", () => {
    it("should use sufficient salt rounds", async () => {
      // This is more of a documentation test
      // The actual salt rounds are set in the implementation
      const password = "test";
      const hash = await hashPassword(password);

      // bcrypt hashes start with $2a$, $2b$, or $2y$ followed by cost parameter
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);

      // Extract cost parameter (should be 12 based on SALT_ROUNDS)
      const costMatch = hash.match(/^\$2[aby]\$(\d{2})\$/);
      expect(costMatch).toBeDefined();
      if (costMatch) {
        const cost = parseInt(costMatch[1], 10);
        expect(cost).toBeGreaterThanOrEqual(10); // Should be at least 10
      }
    });

    it("should produce consistent verification results", async () => {
      const password = "consistent-password";
      const hash = await hashPassword(password);

      // Verify multiple times
      const results = await Promise.all([
        verifyPassword(password, hash),
        verifyPassword(password, hash),
        verifyPassword(password, hash),
      ]);

      expect(results.every((r) => r === true)).toBe(true);
    }, 15000); // bcrypt with 12 salt rounds is intentionally slow
  });
});
