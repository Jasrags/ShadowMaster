/**
 * Tests for /api/auth/forgot-password endpoint
 *
 * Tests the password reset request flow including validation,
 * rate limiting, and email enumeration prevention.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Define mocks using vi.hoisted so they're available before vi.mock runs
const { mockRateLimiterInstance, mockAuditLogger } = vi.hoisted(() => ({
  mockRateLimiterInstance: {
    isRateLimited: vi.fn().mockReturnValue(false),
    getRemaining: vi.fn().mockReturnValue(3),
    reset: vi.fn(),
  },
  mockAuditLogger: {
    log: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock dependencies
vi.mock("@/lib/auth/password-reset");
vi.mock("@/lib/auth/validation");
vi.mock("@/lib/security/rate-limit", () => ({
  RateLimiter: {
    get: vi.fn(() => mockRateLimiterInstance),
  },
}));
vi.mock("@/lib/security/audit-logger", () => ({
  AuditLogger: mockAuditLogger,
}));
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue("127.0.0.1"),
  }),
}));

// Import after mocks are set up
import { POST } from "../route";
import * as passwordResetModule from "@/lib/auth/password-reset";
import * as validationModule from "@/lib/auth/validation";

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = "POST"): NextRequest {
  const headers = new Headers();
  if (body) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("host", "localhost:3000");
  headers.set("x-forwarded-proto", "http");

  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  // Mock json() method if body is provided
  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock implementations
    mockRateLimiterInstance.isRateLimited.mockReturnValue(false);
    mockRateLimiterInstance.getRemaining.mockReturnValue(3);

    vi.mocked(validationModule.isValidEmail).mockReturnValue(true);
    vi.mocked(passwordResetModule.requestPasswordReset).mockResolvedValue({ success: true });
  });

  it("should return success for valid email", async () => {
    const requestBody = { email: "test@example.com" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/forgot-password",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe(
      "If an account exists with this email, you will receive a password reset link."
    );
    expect(passwordResetModule.requestPasswordReset).toHaveBeenCalledWith(
      "test@example.com",
      "http://localhost:3000",
      "127.0.0.1"
    );
  });

  it("should return 400 when email is missing", async () => {
    const requestBody = {};
    const request = createMockRequest(
      "http://localhost:3000/api/auth/forgot-password",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Email is required");
    expect(passwordResetModule.requestPasswordReset).not.toHaveBeenCalled();
  });

  it("should return 400 when email is not a string", async () => {
    const requestBody = { email: 12345 };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/forgot-password",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Email is required");
  });

  it("should return 400 for invalid email format", async () => {
    vi.mocked(validationModule.isValidEmail).mockReturnValue(false);

    const requestBody = { email: "invalid-email" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/forgot-password",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid email format");
    expect(passwordResetModule.requestPasswordReset).not.toHaveBeenCalled();
  });

  it("should return 400 for invalid JSON body", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        host: "localhost:3000",
      }),
    });
    (request as { json: () => Promise<unknown> }).json = async () => {
      throw new Error("Invalid JSON");
    };

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid request body");
  });

  it("should still return success when rate limited (prevents email enumeration)", async () => {
    mockRateLimiterInstance.isRateLimited.mockReturnValue(true);

    const requestBody = { email: "test@example.com" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/forgot-password",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    // Still returns success to prevent email enumeration
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe(
      "If an account exists with this email, you will receive a password reset link."
    );
    // But the actual reset request is NOT made
    expect(passwordResetModule.requestPasswordReset).not.toHaveBeenCalled();
  });

  it("should log rate limit events", async () => {
    mockRateLimiterInstance.isRateLimited.mockReturnValue(true);
    mockRateLimiterInstance.getRemaining.mockReturnValue(0);

    const requestBody = { email: "test@example.com" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/forgot-password",
      requestBody
    );

    await POST(request);

    expect(mockAuditLogger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "password_reset.rate_limited",
        email: "test@example.com",
        ip: "127.0.0.1",
      })
    );
  });

  it("should normalize email to lowercase for rate limiting", async () => {
    const requestBody = { email: "TEST@EXAMPLE.COM" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/forgot-password",
      requestBody
    );

    await POST(request);

    // Rate limiter should check with lowercase email
    expect(mockRateLimiterInstance.isRateLimited).toHaveBeenCalledWith(
      "password-reset:test@example.com"
    );
  });

  it("should still return success when requestPasswordReset throws (prevents information leakage)", async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(passwordResetModule.requestPasswordReset).mockRejectedValue(
      new Error("Database error")
    );

    const requestBody = { email: "test@example.com" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/forgot-password",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    // Still returns success to prevent information leakage
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe(
      "If an account exists with this email, you will receive a password reset link."
    );

    consoleErrorSpy.mockRestore();
  });

  it("should build correct base URL from request headers", async () => {
    const request = createMockRequest("http://localhost:3000/api/auth/forgot-password", {
      email: "test@example.com",
    });
    // Override headers for custom host/protocol
    Object.defineProperty(request.headers, "get", {
      value: (name: string) => {
        if (name === "x-forwarded-proto") return "https";
        if (name === "host") return "example.com";
        return null;
      },
    });

    await POST(request);

    expect(passwordResetModule.requestPasswordReset).toHaveBeenCalledWith(
      "test@example.com",
      "https://example.com",
      "127.0.0.1"
    );
  });
});
