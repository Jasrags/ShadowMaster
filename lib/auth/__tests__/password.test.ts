/**
 * Tests for password hashing and verification
 */

import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, verifyCredentials } from "../password";

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

  describe("verifyCredentials", () => {
    it("should return valid=true for correct password and hash", async () => {
      const password = "correct-password";
      const hash = await hashPassword(password);

      const result = await verifyCredentials(password, hash);

      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should return valid=false for wrong password", async () => {
      const hash = await hashPassword("correct-password");

      const result = await verifyCredentials("wrong-password", hash);

      expect(result.valid).toBe(false);
      expect(result.error).toBeNull();
    });

    it("should return error for empty password", async () => {
      const hash = await hashPassword("some-password");

      const result = await verifyCredentials("", hash);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Password is required");
    });

    it("should return error for null password", async () => {
      const hash = await hashPassword("some-password");

      const result = await verifyCredentials(null, hash);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Password is required");
    });

    it("should return error for undefined password", async () => {
      const hash = await hashPassword("some-password");

      const result = await verifyCredentials(undefined, hash);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Password is required");
    });

    it("should return valid=false with no error for null hash (user not found)", async () => {
      const result = await verifyCredentials("any-password", null);

      expect(result.valid).toBe(false);
      expect(result.error).toBeNull(); // No specific error to prevent enumeration
    });

    it("should return valid=false with no error for undefined hash", async () => {
      const result = await verifyCredentials("any-password", undefined);

      expect(result.valid).toBe(false);
      expect(result.error).toBeNull();
    });

    it("should prioritize password validation error over hash missing", async () => {
      // When both password and hash are missing, password error takes precedence
      const result = await verifyCredentials("", null);

      expect(result.valid).toBe(false);
      expect(result.error).toBe("Password is required");
    });

    it("should always run bcrypt for timing safety", async () => {
      // This test verifies the timing-safe property by measuring execution times.
      // All paths should take similar time (~100ms for bcrypt with 12 rounds).
      const hash = await hashPassword("test-password");

      const measureTime = async (fn: () => Promise<unknown>) => {
        const start = performance.now();
        await fn();
        return performance.now() - start;
      };

      // Valid credentials
      const validTime = await measureTime(() => verifyCredentials("test-password", hash));
      // Invalid password
      const invalidTime = await measureTime(() => verifyCredentials("wrong-password", hash));
      // Empty password (should still run bcrypt)
      const emptyPasswordTime = await measureTime(() => verifyCredentials("", hash));
      // Null hash (should still run bcrypt against dummy)
      const nullHashTime = await measureTime(() => verifyCredentials("any-password", null));

      // All times should be within same order of magnitude (bcrypt dominates)
      // We use a generous threshold since bcrypt timing can vary
      const times = [validTime, invalidTime, emptyPasswordTime, nullHashTime];
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);

      // All paths should take meaningful time (bcrypt is ~50-200ms with 12 rounds)
      expect(minTime).toBeGreaterThan(10); // At least 10ms indicates bcrypt ran

      // Max time shouldn't be more than 5x min time (generous threshold for CI variance)
      expect(maxTime / minTime).toBeLessThan(5);
    }, 30000); // Extended timeout for multiple bcrypt operations
  });
});
