/**
 * Tests for /api/auth/reset-password/validate endpoint
 *
 * Tests token validation without consuming the token.
 * Used to check if a token is valid before showing the reset form.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as passwordResetModule from "@/lib/auth/password-reset";

// Mock dependencies
vi.mock("@/lib/auth/password-reset");

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = "POST"): NextRequest {
  const headers = new Headers();
  if (body) {
    headers.set("Content-Type", "application/json");
  }

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

describe("POST /api/auth/reset-password/validate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return valid: true for a valid token", async () => {
    vi.mocked(passwordResetModule.validateResetToken).mockResolvedValue({
      valid: true,
      userId: "user-123",
    });

    const requestBody = { token: "valid-reset-token" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/reset-password/validate",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(true);
    expect(data.reason).toBeUndefined();
    expect(passwordResetModule.validateResetToken).toHaveBeenCalledWith("valid-reset-token");
  });

  it("should return valid: false with reason 'invalid' for invalid token", async () => {
    vi.mocked(passwordResetModule.validateResetToken).mockResolvedValue({
      valid: false,
      reason: "invalid",
    });

    const requestBody = { token: "invalid-token" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/reset-password/validate",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(false);
    expect(data.reason).toBe("invalid");
  });

  it("should return valid: false with reason 'expired' for expired token", async () => {
    vi.mocked(passwordResetModule.validateResetToken).mockResolvedValue({
      valid: false,
      reason: "expired",
      userId: "user-123",
    });

    const requestBody = { token: "expired-token" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/reset-password/validate",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(false);
    expect(data.reason).toBe("expired");
  });

  it("should return 400 with invalid reason when token is missing", async () => {
    const requestBody = {};
    const request = createMockRequest(
      "http://localhost:3000/api/auth/reset-password/validate",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.valid).toBe(false);
    expect(data.reason).toBe("invalid");
    expect(passwordResetModule.validateResetToken).not.toHaveBeenCalled();
  });

  it("should return 400 with invalid reason when token is not a string", async () => {
    const requestBody = { token: 12345 };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/reset-password/validate",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.valid).toBe(false);
    expect(data.reason).toBe("invalid");
    expect(passwordResetModule.validateResetToken).not.toHaveBeenCalled();
  });

  it("should return 400 with invalid reason when token is null", async () => {
    const requestBody = { token: null };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/reset-password/validate",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.valid).toBe(false);
    expect(data.reason).toBe("invalid");
  });

  it("should return 400 with invalid reason when token is empty string", async () => {
    const requestBody = { token: "" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/reset-password/validate",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.valid).toBe(false);
    expect(data.reason).toBe("invalid");
    expect(passwordResetModule.validateResetToken).not.toHaveBeenCalled();
  });

  it("should return 400 with invalid reason for invalid JSON body", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/reset-password/validate", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    (request as { json: () => Promise<unknown> }).json = async () => {
      throw new Error("Invalid JSON");
    };

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.valid).toBe(false);
    expect(data.reason).toBe("invalid");
  });

  it("should return 500 with invalid reason when validateResetToken throws", async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(passwordResetModule.validateResetToken).mockRejectedValue(
      new Error("Database error")
    );

    const requestBody = { token: "valid-token" };
    const request = createMockRequest(
      "http://localhost:3000/api/auth/reset-password/validate",
      requestBody
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.valid).toBe(false);
    expect(data.reason).toBe("invalid");

    consoleErrorSpy.mockRestore();
  });

  it("should not consume the token (can be validated multiple times)", async () => {
    vi.mocked(passwordResetModule.validateResetToken).mockResolvedValue({
      valid: true,
      userId: "user-123",
    });

    const requestBody = { token: "valid-token" };

    // Validate the same token multiple times
    const request1 = createMockRequest(
      "http://localhost:3000/api/auth/reset-password/validate",
      requestBody
    );
    const request2 = createMockRequest(
      "http://localhost:3000/api/auth/reset-password/validate",
      requestBody
    );

    const response1 = await POST(request1);
    const response2 = await POST(request2);

    const data1 = await response1.json();
    const data2 = await response2.json();

    // Both validations should succeed (token not consumed)
    expect(data1.valid).toBe(true);
    expect(data2.valid).toBe(true);
    expect(passwordResetModule.validateResetToken).toHaveBeenCalledTimes(2);
  });
});
