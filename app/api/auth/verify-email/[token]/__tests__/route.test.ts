/**
 * Tests for GET /api/auth/verify-email/[token] endpoint
 *
 * Tests email verification confirmation including:
 * - Valid token verification
 * - Expired token handling
 * - Invalid token handling
 * - Already verified handling
 * - Redirect behavior
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

// Track redirects
let lastRedirectUrl: string | null = null;

// Mock next/server to provide a working redirect
vi.mock("next/server", async () => {
  const actual = await vi.importActual<typeof import("next/server")>("next/server");
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      redirect: vi.fn((url: URL | string) => {
        const urlString = url instanceof URL ? url.toString() : url;
        lastRedirectUrl = urlString;
        return new actual.NextResponse(null, {
          status: 307,
          headers: { location: urlString },
        });
      }),
      json: actual.NextResponse.json,
    },
  };
});

// Mock dependencies
vi.mock("@/lib/auth/email-verification", () => ({
  verifyEmailToken: vi.fn(),
}));

// Import after mocks
import { GET } from "../route";
import * as verificationModule from "@/lib/auth/email-verification";

// Helper to create a mock request
function createMockRequest(token: string, host = "localhost:3000", proto = "http"): NextRequest {
  return new NextRequest(`${proto}://${host}/api/auth/verify-email/${token}`, {
    method: "GET",
    headers: {
      host,
      "x-forwarded-proto": proto,
    },
  });
}

// Helper to create route params
function createParams(token: string): { params: Promise<{ token: string }> } {
  return {
    params: Promise.resolve({ token }),
  };
}

describe("GET /api/auth/verify-email/[token]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastRedirectUrl = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Token validation", () => {
    it("redirects with invalid error for short token", async () => {
      const shortToken = "abc"; // Less than 32 characters

      const request = createMockRequest(shortToken);
      const response = await GET(request, createParams(shortToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe(
        "http://localhost:3000/settings?verification=error&reason=invalid"
      );
    });

    it("redirects with invalid error for empty token", async () => {
      const request = createMockRequest("");
      const response = await GET(request, createParams(""));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe(
        "http://localhost:3000/settings?verification=error&reason=invalid"
      );
    });
  });

  describe("Successful verification", () => {
    it("redirects to settings with verified=true on success", async () => {
      const validToken = "a".repeat(43); // URL-safe base64 of 32 bytes

      vi.mocked(verificationModule.verifyEmailToken).mockResolvedValue({
        success: true,
        userId: "test-user-id",
      });

      const request = createMockRequest(validToken);
      const response = await GET(request, createParams(validToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/settings?verified=true");
      expect(verificationModule.verifyEmailToken).toHaveBeenCalledWith(validToken);
    });
  });

  describe("Expired token", () => {
    it("redirects with expired error for expired token", async () => {
      const expiredToken = "b".repeat(43);

      vi.mocked(verificationModule.verifyEmailToken).mockResolvedValue({
        success: false,
        error: "expired_token",
        userId: "test-user-id",
      });

      const request = createMockRequest(expiredToken);
      const response = await GET(request, createParams(expiredToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe(
        "http://localhost:3000/settings?verification=error&reason=expired"
      );
    });
  });

  describe("Invalid token", () => {
    it("redirects with invalid error for invalid token", async () => {
      const invalidToken = "c".repeat(43);

      vi.mocked(verificationModule.verifyEmailToken).mockResolvedValue({
        success: false,
        error: "invalid_token",
      });

      const request = createMockRequest(invalidToken);
      const response = await GET(request, createParams(invalidToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe(
        "http://localhost:3000/settings?verification=error&reason=invalid"
      );
    });

    it("redirects with invalid error for user_not_found", async () => {
      const orphanToken = "d".repeat(43);

      vi.mocked(verificationModule.verifyEmailToken).mockResolvedValue({
        success: false,
        error: "user_not_found",
      });

      const request = createMockRequest(orphanToken);
      const response = await GET(request, createParams(orphanToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe(
        "http://localhost:3000/settings?verification=error&reason=invalid"
      );
    });
  });

  describe("Already verified", () => {
    it("redirects with already_verified for previously verified user", async () => {
      const usedToken = "e".repeat(43);

      vi.mocked(verificationModule.verifyEmailToken).mockResolvedValue({
        success: false,
        error: "already_verified",
        userId: "test-user-id",
      });

      const request = createMockRequest(usedToken);
      const response = await GET(request, createParams(usedToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/settings?verification=already_verified");
    });
  });

  describe("URL handling", () => {
    it("uses x-forwarded-proto for protocol", async () => {
      const token = "f".repeat(43);

      vi.mocked(verificationModule.verifyEmailToken).mockResolvedValue({
        success: true,
        userId: "test-user-id",
      });

      const request = createMockRequest(token, "example.com", "https");
      const response = await GET(request, createParams(token));

      expect(lastRedirectUrl).toBe("https://example.com/settings?verified=true");
    });

    it("defaults to http when no x-forwarded-proto", async () => {
      const token = "g".repeat(43);

      vi.mocked(verificationModule.verifyEmailToken).mockResolvedValue({
        success: true,
        userId: "test-user-id",
      });

      // Create request without x-forwarded-proto
      const request = new NextRequest(`http://localhost:3000/api/auth/verify-email/${token}`, {
        method: "GET",
        headers: {
          host: "localhost:3000",
        },
      });

      const response = await GET(request, createParams(token));

      expect(lastRedirectUrl).toBe("http://localhost:3000/settings?verified=true");
    });
  });
});
