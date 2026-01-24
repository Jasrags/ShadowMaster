/**
 * Tests for GET /api/auth/magic-link/[token] endpoint
 *
 * Tests magic link verification including:
 * - Token validation
 * - Successful verification and session creation
 * - Error handling for various failure cases
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
        // Create a response with a cookies property that can be accessed
        const response = new actual.NextResponse(null, {
          status: 307,
          headers: { location: urlString },
        });
        return response;
      }),
      json: actual.NextResponse.json,
    },
  };
});

// Mock dependencies
vi.mock("@/lib/auth/magic-link", () => ({
  verifyMagicLink: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  createSession: vi.fn(),
}));

// Import after mocks
import { GET } from "../route";
import * as magicLinkModule from "@/lib/auth/magic-link";
import * as sessionModule from "@/lib/auth/session";

// Helper to create a mock request
function createMockRequest(token: string, host = "localhost:3000", proto = "http"): NextRequest {
  return new NextRequest(`${proto}://${host}/api/auth/magic-link/${token}`, {
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

describe("GET /api/auth/magic-link/[token]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lastRedirectUrl = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Token validation", () => {
    it("redirects with invalid_link error for short token", async () => {
      const shortToken = "abc"; // Less than 32 characters

      const request = createMockRequest(shortToken);
      const response = await GET(request, createParams(shortToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=invalid_link");
    });

    it("redirects with invalid_link error for empty token", async () => {
      const request = createMockRequest("");
      const response = await GET(request, createParams(""));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=invalid_link");
    });

    it("redirects with invalid_link error for token shorter than 32 chars", async () => {
      const shortToken = "a".repeat(31);

      const request = createMockRequest(shortToken);
      const response = await GET(request, createParams(shortToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=invalid_link");
    });
  });

  describe("Successful verification", () => {
    it("redirects to home and creates session on success", async () => {
      const validToken = "a".repeat(43); // URL-safe base64 of 32 bytes

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: true,
        userId: "test-user-id",
        sessionVersion: 1,
      });

      const request = createMockRequest(validToken);
      const response = await GET(request, createParams(validToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/");
      expect(magicLinkModule.verifyMagicLink).toHaveBeenCalledWith(validToken);
      expect(sessionModule.createSession).toHaveBeenCalledWith(
        "test-user-id",
        expect.any(Object),
        1
      );
    });

    it("passes correct session version to createSession", async () => {
      const validToken = "b".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: true,
        userId: "test-user-id",
        sessionVersion: 5,
      });

      const request = createMockRequest(validToken);
      await GET(request, createParams(validToken));

      expect(sessionModule.createSession).toHaveBeenCalledWith(
        "test-user-id",
        expect.any(Object),
        5
      );
    });
  });

  describe("Invalid token", () => {
    it("redirects with invalid_link error for invalid token", async () => {
      const invalidToken = "c".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: false,
        error: "invalid_link",
      });

      const request = createMockRequest(invalidToken);
      const response = await GET(request, createParams(invalidToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=invalid_link");
      expect(sessionModule.createSession).not.toHaveBeenCalled();
    });
  });

  describe("Expired token", () => {
    it("redirects with link_expired error for expired token", async () => {
      const expiredToken = "d".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: false,
        error: "link_expired",
        userId: "test-user-id",
      });

      const request = createMockRequest(expiredToken);
      const response = await GET(request, createParams(expiredToken));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=link_expired");
    });
  });

  describe("Account status errors", () => {
    it("redirects with account_locked error for locked accounts", async () => {
      const token = "e".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: false,
        error: "account_locked",
        userId: "test-user-id",
      });

      const request = createMockRequest(token);
      const response = await GET(request, createParams(token));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=account_locked");
    });

    it("redirects with email_not_verified error for unverified email", async () => {
      const token = "f".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: false,
        error: "email_not_verified",
        userId: "test-user-id",
      });

      const request = createMockRequest(token);
      const response = await GET(request, createParams(token));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=email_not_verified");
    });

    it("redirects with account_suspended error for suspended accounts", async () => {
      const token = "g".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: false,
        error: "account_suspended",
        userId: "test-user-id",
      });

      const request = createMockRequest(token);
      const response = await GET(request, createParams(token));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=account_suspended");
    });
  });

  describe("Edge cases", () => {
    it("redirects with invalid_link when verifyMagicLink returns success but no userId", async () => {
      const token = "h".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: true,
        // Missing userId
        sessionVersion: 1,
      });

      const request = createMockRequest(token);
      const response = await GET(request, createParams(token));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=invalid_link");
      expect(sessionModule.createSession).not.toHaveBeenCalled();
    });

    it("redirects with invalid_link when verifyMagicLink returns success but undefined sessionVersion", async () => {
      const token = "i".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: true,
        userId: "test-user-id",
        // sessionVersion is undefined
      });

      const request = createMockRequest(token);
      const response = await GET(request, createParams(token));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=invalid_link");
      expect(sessionModule.createSession).not.toHaveBeenCalled();
    });

    it("redirects with invalid_link when error is undefined in failure response", async () => {
      const token = "j".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: false,
        // No error specified
      });

      const request = createMockRequest(token);
      const response = await GET(request, createParams(token));

      expect(response.status).toBe(307);
      expect(lastRedirectUrl).toBe("http://localhost:3000/signin?error=invalid_link");
    });
  });

  describe("URL handling", () => {
    it("uses x-forwarded-proto for protocol", async () => {
      const token = "k".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: true,
        userId: "test-user-id",
        sessionVersion: 1,
      });

      const request = createMockRequest(token, "example.com", "https");
      await GET(request, createParams(token));

      expect(lastRedirectUrl).toBe("https://example.com/");
    });

    it("defaults to http when no x-forwarded-proto", async () => {
      const token = "l".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: true,
        userId: "test-user-id",
        sessionVersion: 1,
      });

      // Create request without x-forwarded-proto
      const request = new NextRequest(`http://localhost:3000/api/auth/magic-link/${token}`, {
        method: "GET",
        headers: {
          host: "localhost:3000",
        },
      });

      await GET(request, createParams(token));

      expect(lastRedirectUrl).toBe("http://localhost:3000/");
    });

    it("uses custom host from headers", async () => {
      const token = "m".repeat(43);

      vi.mocked(magicLinkModule.verifyMagicLink).mockResolvedValue({
        success: false,
        error: "invalid_link",
      });

      const request = createMockRequest(token, "myapp.example.com", "https");
      await GET(request, createParams(token));

      expect(lastRedirectUrl).toBe("https://myapp.example.com/signin?error=invalid_link");
    });
  });
});
