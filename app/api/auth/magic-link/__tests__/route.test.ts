/**
 * Tests for POST /api/auth/magic-link endpoint
 *
 * Tests magic link request functionality including:
 * - Email validation
 * - Rate limiting
 * - Email enumeration prevention (always returns success)
 * - Request handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock rate limiter state (shared across mocks)
let mockIsRateLimited = false;
let mockRemaining = 5;

// Mock dependencies before importing the route
vi.mock("@/lib/auth/magic-link", () => ({
  requestMagicLink: vi.fn(),
}));

vi.mock("@/lib/auth/validation", () => ({
  isValidEmail: vi.fn((email: string) => {
    // Simple validation for testing
    return typeof email === "string" && email.includes("@") && email.includes(".");
  }),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  RateLimiter: {
    get: vi.fn(() => ({
      isRateLimited: vi.fn(() => mockIsRateLimited),
      getRemaining: vi.fn(() => mockRemaining),
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
      get: vi.fn((name: string) => {
        if (name === "x-forwarded-for") return "127.0.0.1";
        if (name === "x-real-ip") return null;
        return null;
      }),
    })
  ),
}));

// Import after mocks are set up
import { POST } from "../route";
import * as magicLinkModule from "@/lib/auth/magic-link";
import { AuditLogger } from "@/lib/security/audit-logger";

// Helper to create a mock request
function createMockRequest(body: unknown): NextRequest {
  const request = new NextRequest("http://localhost:3000/api/auth/magic-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      host: "localhost:3000",
      "x-forwarded-proto": "http",
    },
    body: JSON.stringify(body),
  });
  return request;
}

describe("POST /api/auth/magic-link", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsRateLimited = false;
    mockRemaining = 5;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Request validation", () => {
    it("returns 400 for invalid JSON body", async () => {
      const request = new NextRequest("http://localhost:3000/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          host: "localhost:3000",
        },
        body: "not valid json",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid request body");
    });

    it("returns 400 when email is missing", async () => {
      const request = createMockRequest({});

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Email is required");
    });

    it("returns 400 when email is not a string", async () => {
      const request = createMockRequest({ email: 123 });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Email is required");
    });

    it("returns 400 for invalid email format", async () => {
      const request = createMockRequest({ email: "notanemail" });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid email format");
    });
  });

  describe("Successful requests", () => {
    it("returns success and calls requestMagicLink for valid email", async () => {
      vi.mocked(magicLinkModule.requestMagicLink).mockResolvedValue({ success: true });

      const request = createMockRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe(
        "If an account exists with this email, you will receive a sign-in link."
      );
      expect(magicLinkModule.requestMagicLink).toHaveBeenCalledWith(
        "test@example.com",
        "http://localhost:3000",
        "127.0.0.1"
      );
    });

    it("uses x-forwarded-proto for building base URL", async () => {
      vi.mocked(magicLinkModule.requestMagicLink).mockResolvedValue({ success: true });

      const request = new NextRequest("https://example.com/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          host: "example.com",
          "x-forwarded-proto": "https",
        },
        body: JSON.stringify({ email: "test@example.com" }),
      });

      await POST(request);

      expect(magicLinkModule.requestMagicLink).toHaveBeenCalledWith(
        "test@example.com",
        "https://example.com",
        expect.any(String)
      );
    });
  });

  describe("Rate limiting", () => {
    it("returns success but logs rate limit when rate limited (email enumeration prevention)", async () => {
      mockIsRateLimited = true;
      mockRemaining = 0;

      const request = createMockRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      // Should still return success to prevent email enumeration
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe(
        "If an account exists with this email, you will receive a sign-in link."
      );

      // Should log rate limit event
      expect(AuditLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          event: "magic_link.rate_limited",
          email: "test@example.com",
        })
      );

      // Should NOT call requestMagicLink when rate limited
      expect(magicLinkModule.requestMagicLink).not.toHaveBeenCalled();
    });
  });

  describe("Email enumeration prevention", () => {
    it("returns success even when requestMagicLink succeeds", async () => {
      vi.mocked(magicLinkModule.requestMagicLink).mockResolvedValue({ success: true });

      const request = createMockRequest({ email: "exists@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("returns success even when an error is thrown", async () => {
      vi.mocked(magicLinkModule.requestMagicLink).mockRejectedValue(new Error("Something failed"));

      const request = createMockRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      // Should still return success to prevent information leakage
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe(
        "If an account exists with this email, you will receive a sign-in link."
      );
    });
  });

  describe("Case normalization", () => {
    it("handles mixed case emails for rate limiting", async () => {
      vi.mocked(magicLinkModule.requestMagicLink).mockResolvedValue({ success: true });

      const request = createMockRequest({ email: "Test@EXAMPLE.com" });
      const response = await POST(request);

      expect(response.status).toBe(200);
      // The actual email is passed as-is to requestMagicLink
      expect(magicLinkModule.requestMagicLink).toHaveBeenCalledWith(
        "Test@EXAMPLE.com",
        expect.any(String),
        expect.any(String)
      );
    });
  });
});
