/**
 * Tests for POST /api/auth/verify-email endpoint
 *
 * Tests verification email request functionality including:
 * - Authentication requirement
 * - Already verified users
 * - Rate limiting
 * - Email sending
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import type { User } from "@/lib/types";

// Mock rate limiter state (shared across mocks)
let mockIsRateLimited = false;
let mockRemaining = 3;

// Mock dependencies before importing the route
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/users", () => ({
  getUserById: vi.fn(),
}));

vi.mock("@/lib/auth/email-verification", () => ({
  sendVerificationEmail: vi.fn(),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  RateLimiter: {
    get: vi.fn(() => ({
      isRateLimited: vi.fn((key: string) => mockIsRateLimited),
      getRemaining: vi.fn((key: string) => mockRemaining),
      reset: vi.fn(),
    })),
  },
}));

vi.mock("@/lib/security/audit-logger", () => ({
  AuditLogger: {
    log: vi.fn(),
  },
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(() =>
    Promise.resolve({
      get: vi.fn(() => "127.0.0.1"),
    })
  ),
}));

// Import after mocks are set up
import { POST } from "../route";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as verificationModule from "@/lib/auth/email-verification";

// Helper to create a mock request
function createMockRequest(): NextRequest {
  return new NextRequest("http://localhost:3000/api/auth/verify-email", {
    method: "POST",
    headers: {
      host: "localhost:3000",
      "x-forwarded-proto": "http",
    },
  });
}

// Mock user factory
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "mock-hash",
    role: ["user"],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
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
    emailVerified: false,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    ...overrides,
  };
}

describe("POST /api/auth/verify-email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsRateLimited = false;
    mockRemaining = 3;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Authentication", () => {
    it("returns 401 when not authenticated", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(null);

      const request = createMockRequest();
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Authentication required");
    });

    it("returns 404 when user not found", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
      vi.mocked(usersModule.getUserById).mockResolvedValue(null);

      const request = createMockRequest();
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });
  });

  describe("Already verified users", () => {
    it("returns success without sending email when already verified", async () => {
      const verifiedUser = createMockUser({
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
      });

      vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
      vi.mocked(usersModule.getUserById).mockResolvedValue(verifiedUser);

      const request = createMockRequest();
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Email is already verified");
      expect(verificationModule.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe("Rate limiting", () => {
    it("returns 429 when rate limited", async () => {
      const unverifiedUser = createMockUser({ emailVerified: false });

      vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
      vi.mocked(usersModule.getUserById).mockResolvedValue(unverifiedUser);
      mockIsRateLimited = true;
      mockRemaining = 0;

      const request = createMockRequest();
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Too many verification requests");
    });
  });

  describe("Email sending", () => {
    it("sends verification email successfully", async () => {
      const unverifiedUser = createMockUser({ emailVerified: false });

      vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
      vi.mocked(usersModule.getUserById).mockResolvedValue(unverifiedUser);
      vi.mocked(verificationModule.sendVerificationEmail).mockResolvedValue({ success: true });

      const request = createMockRequest();
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Verification email sent");
      expect(verificationModule.sendVerificationEmail).toHaveBeenCalledWith(
        unverifiedUser.id,
        unverifiedUser.email,
        unverifiedUser.username,
        "http://localhost:3000"
      );
    });

    it("returns 500 when email sending fails", async () => {
      const unverifiedUser = createMockUser({ emailVerified: false });

      vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
      vi.mocked(usersModule.getUserById).mockResolvedValue(unverifiedUser);
      vi.mocked(verificationModule.sendVerificationEmail).mockResolvedValue({
        success: false,
        error: "SMTP connection failed",
      });

      const request = createMockRequest();
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("SMTP connection failed");
    });

    it("returns generic error when email sending throws", async () => {
      const unverifiedUser = createMockUser({ emailVerified: false });

      vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
      vi.mocked(usersModule.getUserById).mockResolvedValue(unverifiedUser);
      vi.mocked(verificationModule.sendVerificationEmail).mockRejectedValue(
        new Error("Unexpected error")
      );

      const request = createMockRequest();
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("An error occurred while processing your request");
    });
  });
});
