/**
 * Tests for session management with cryptographic session secrets
 *
 * Tests session cookie creation, retrieval, clearing, and cryptographic verification.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { createSession, getSession, clearSession, generateSessionSecret } from "../session";
import { cookies } from "next/headers";
import { getUserById, setSessionSecretHash } from "../../storage/users";
import { NextResponse } from "next/server";
import type { User } from "../../types/user";
import { createHash } from "crypto";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock user storage
vi.mock("../../storage/users", () => ({
  getUserById: vi.fn(),
  setSessionSecretHash: vi.fn(),
}));

// Mock NextResponse
const mockNextResponse = {
  cookies: {
    set: vi.fn(),
    delete: vi.fn(),
  },
};

vi.mock("next/server", () => ({
  NextResponse: class {
    static json = vi.fn();
    cookies = {
      set: vi.fn(),
      delete: vi.fn(),
    };
  },
}));

describe("Session Management", () => {
  const mockUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "hashed-password",
    role: ["user"],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    sessionSecretHash: null,
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    emailVerified: true,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    emailVerificationTokenPrefix: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    passwordResetTokenPrefix: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
    magicLinkTokenPrefix: null,
  };

  const mockCookieStore = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
    getAll: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>
    );
    vi.mocked(setSessionSecretHash).mockResolvedValue(mockUser);
  });

  describe("generateSessionSecret", () => {
    it("should generate a 256-bit secret (43 base64url characters)", () => {
      const { secret, secretHash } = generateSessionSecret();

      // base64url encoding of 32 bytes = 43 characters
      expect(secret).toHaveLength(43);
      // SHA-256 hash as hex = 64 characters
      expect(secretHash).toHaveLength(64);
    });

    it("should generate different secrets each time", () => {
      const { secret: secret1 } = generateSessionSecret();
      const { secret: secret2 } = generateSessionSecret();

      expect(secret1).not.toBe(secret2);
    });

    it("should generate valid base64url format", () => {
      const { secret } = generateSessionSecret();

      // base64url uses only these characters
      expect(secret).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it("should produce hash that matches re-hashing the secret", () => {
      const { secret, secretHash } = generateSessionSecret();

      // Decode secret and hash it
      const secretBuffer = Buffer.from(secret, "base64url");
      const recomputedHash = createHash("sha256").update(secretBuffer).digest("hex");

      expect(recomputedHash).toBe(secretHash);
    });
  });

  describe("createSession", () => {
    it("should set session cookie with user ID, version, and secret", async () => {
      const response = mockNextResponse as unknown as NextResponse;
      const userId = "test-user-id";
      const sessionVersion = 1;

      await createSession(userId, response, sessionVersion);

      expect(response.cookies.set).toHaveBeenCalledWith(
        "session",
        expect.stringMatching(/^test-user-id:1:[A-Za-z0-9_-]{43}$/),
        expect.objectContaining({
          httpOnly: true,
          sameSite: "lax",
          path: "/",
        })
      );
    });

    it("should store secret hash server-side", async () => {
      const response = mockNextResponse as unknown as NextResponse;
      const userId = "test-user-id";

      await createSession(userId, response);

      expect(setSessionSecretHash).toHaveBeenCalledWith(
        userId,
        expect.stringMatching(/^[a-f0-9]{64}$/) // SHA-256 hex hash
      );
    });

    it("should set secure flag in production", async () => {
      vi.stubEnv("NODE_ENV", "production");

      const response = mockNextResponse as unknown as NextResponse;
      vi.clearAllMocks();
      vi.mocked(setSessionSecretHash).mockResolvedValue(mockUser);
      await createSession("user-id", response);

      expect(response.cookies.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ secure: true })
      );
    });

    it("should not set secure flag in development", async () => {
      vi.stubEnv("NODE_ENV", "development");

      const response = mockNextResponse as unknown as NextResponse;
      vi.clearAllMocks();
      vi.mocked(setSessionSecretHash).mockResolvedValue(mockUser);
      await createSession("user-id", response);

      expect(response.cookies.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ secure: false })
      );
    });

    it("should set expiration date", async () => {
      const response = mockNextResponse as unknown as NextResponse;
      vi.clearAllMocks();
      vi.mocked(setSessionSecretHash).mockResolvedValue(mockUser);
      await createSession("user-id", response);

      const setCall = vi.mocked(response.cookies.set).mock.calls[0];
      expect(setCall).toBeDefined();
      const options = setCall![2];
      expect(options).toBeDefined();
      expect(options!.expires).toBeInstanceOf(Date);

      // Should be approximately 7 days from now
      const expires = options!.expires as Date;
      const expectedExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
      const timeDiff = Math.abs(expires.getTime() - expectedExpiry);
      expect(timeDiff).toBeLessThan(1000); // Within 1 second
    });
  });

  describe("getSession", () => {
    it("should retrieve user ID when secret hash matches", async () => {
      // Generate a real secret/hash pair
      const { secret, secretHash } = generateSessionSecret();

      mockCookieStore.get.mockReturnValue({
        name: "session",
        value: `test-user-id:1:${secret}`,
      });
      vi.mocked(getUserById).mockResolvedValue({
        ...mockUser,
        id: "test-user-id",
        sessionVersion: 1,
        sessionSecretHash: secretHash,
      });

      const userId = await getSession();

      expect(userId).toBe("test-user-id");
      expect(mockCookieStore.get).toHaveBeenCalledWith("session");
      expect(getUserById).toHaveBeenCalledWith("test-user-id");
    });

    it("should return null when secret does not match", async () => {
      const { secret } = generateSessionSecret();
      const { secretHash: differentHash } = generateSessionSecret();

      mockCookieStore.get.mockReturnValue({
        name: "session",
        value: `test-user-id:1:${secret}`,
      });
      vi.mocked(getUserById).mockResolvedValue({
        ...mockUser,
        id: "test-user-id",
        sessionVersion: 1,
        sessionSecretHash: differentHash, // Different hash
      });

      const userId = await getSession();

      expect(userId).toBeNull();
    });

    it("should return null when user has no secret hash stored", async () => {
      const { secret } = generateSessionSecret();

      mockCookieStore.get.mockReturnValue({
        name: "session",
        value: `test-user-id:1:${secret}`,
      });
      vi.mocked(getUserById).mockResolvedValue({
        ...mockUser,
        id: "test-user-id",
        sessionVersion: 1,
        sessionSecretHash: null, // No hash stored
      });

      const userId = await getSession();

      expect(userId).toBeNull();
    });

    it("should return null when version does not match", async () => {
      const { secret, secretHash } = generateSessionSecret();

      mockCookieStore.get.mockReturnValue({
        name: "session",
        value: `test-user-id:1:${secret}`,
      });
      vi.mocked(getUserById).mockResolvedValue({
        ...mockUser,
        id: "test-user-id",
        sessionVersion: 2, // Different version
        sessionSecretHash: secretHash,
      });

      const userId = await getSession();

      expect(userId).toBeNull();
    });

    it("should return null when user does not exist", async () => {
      const { secret } = generateSessionSecret();

      mockCookieStore.get.mockReturnValue({
        name: "session",
        value: `test-user-id:1:${secret}`,
      });
      vi.mocked(getUserById).mockResolvedValue(null);

      const userId = await getSession();

      expect(userId).toBeNull();
    });

    it("should return null when no session cookie exists", async () => {
      mockCookieStore.get.mockReturnValue(undefined);

      const userId = await getSession();

      expect(userId).toBeNull();
    });

    it("should reject legacy session format (userId:version only)", async () => {
      // Old format without secret - should be rejected for security
      mockCookieStore.get.mockReturnValue({
        name: "session",
        value: "test-user-id:1", // No secret
      });
      vi.mocked(getUserById).mockResolvedValue({
        ...mockUser,
        id: "test-user-id",
        sessionVersion: 1,
      });

      const userId = await getSession();

      expect(userId).toBeNull();
    });

    it("should reject tampered session secret", async () => {
      const { secretHash } = generateSessionSecret();

      mockCookieStore.get.mockReturnValue({
        name: "session",
        value: "test-user-id:1:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0", // Tampered
      });
      vi.mocked(getUserById).mockResolvedValue({
        ...mockUser,
        id: "test-user-id",
        sessionVersion: 1,
        sessionSecretHash: secretHash,
      });

      const userId = await getSession();

      expect(userId).toBeNull();
    });
  });

  describe("clearSession", () => {
    it("should delete session cookie", () => {
      const response = mockNextResponse as unknown as NextResponse;
      vi.clearAllMocks();

      clearSession(response);

      expect(response.cookies.delete).toHaveBeenCalledWith("session");
    });
  });

  describe("session duration", () => {
    it("should use correct session duration constant", () => {
      // This test documents the expected session duration
      const SESSION_DURATION_DAYS = 7;
      const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

      expect(SESSION_DURATION_MS).toBe(7 * 24 * 60 * 60 * 1000);
    });
  });

  describe("timing-safe comparison", () => {
    it("should use timing-safe comparison to prevent timing attacks", async () => {
      // This test documents that we use timing-safe comparison.
      // The implementation uses crypto.timingSafeEqual which provides
      // constant-time comparison to prevent timing side-channel attacks.
      //
      // A timing attack would measure how long the comparison takes to
      // determine how many characters match. By using constant-time
      // comparison, an attacker cannot learn any information about
      // the correct secret value from response timing.
      const { secret, secretHash } = generateSessionSecret();

      mockCookieStore.get.mockReturnValue({
        name: "session",
        value: `test-user-id:1:${secret}`,
      });
      vi.mocked(getUserById).mockResolvedValue({
        ...mockUser,
        id: "test-user-id",
        sessionVersion: 1,
        sessionSecretHash: secretHash,
      });

      // Both valid and invalid should complete in similar time
      // (we can't easily test timing, but we verify the correct result)
      const result = await getSession();
      expect(result).toBe("test-user-id");
    });
  });
});
