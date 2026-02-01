/**
 * Tests for /api/auth/reset-password endpoint
 *
 * Tests the password reset execution flow including token validation,
 * password strength requirements, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as passwordResetModule from "@/lib/auth/password-reset";
import * as validationModule from "@/lib/auth/validation";

// Mock dependencies
vi.mock("@/lib/auth/password-reset");
vi.mock("@/lib/auth/validation");

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

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(true);
    vi.mocked(validationModule.getPasswordStrengthError).mockReturnValue(null);
    vi.mocked(passwordResetModule.resetPassword).mockResolvedValue({
      success: true,
      userId: "user-123",
    });
  });

  it("should reset password successfully with valid token and password", async () => {
    const requestBody = {
      token: "valid-reset-token-abc123",
      password: "NewSecurePass123!",
    };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(passwordResetModule.resetPassword).toHaveBeenCalledWith(
      "valid-reset-token-abc123",
      "NewSecurePass123!"
    );
  });

  it("should return 400 when token is missing", async () => {
    const requestBody = { password: "NewSecurePass123!" };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Reset token is required");
    expect(passwordResetModule.resetPassword).not.toHaveBeenCalled();
  });

  it("should return 400 when token is not a string", async () => {
    const requestBody = { token: 12345, password: "NewSecurePass123!" };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Reset token is required");
  });

  it("should return 400 when password is missing", async () => {
    const requestBody = { token: "valid-token" };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Password is required");
    expect(passwordResetModule.resetPassword).not.toHaveBeenCalled();
  });

  it("should return 400 when password is not a string", async () => {
    const requestBody = { token: "valid-token", password: null };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Password is required");
  });

  it("should return 400 when password does not meet strength requirements", async () => {
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(false);
    vi.mocked(validationModule.getPasswordStrengthError).mockReturnValue(
      "Password must be at least 8 characters"
    );

    const requestBody = { token: "valid-token", password: "weak" };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Password must be at least 8 characters");
    expect(passwordResetModule.resetPassword).not.toHaveBeenCalled();
  });

  it("should return default error message when password strength error is null", async () => {
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(false);
    vi.mocked(validationModule.getPasswordStrengthError).mockReturnValue(null);

    const requestBody = { token: "valid-token", password: "weak" };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Password does not meet strength requirements");
  });

  it("should return 400 for invalid JSON body", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/reset-password", {
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
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid request body");
  });

  it("should return 400 with user-friendly message for expired token", async () => {
    vi.mocked(passwordResetModule.resetPassword).mockResolvedValue({
      success: false,
      error: "expired_token",
      userId: "user-123",
    });

    const requestBody = { token: "expired-token", password: "NewSecurePass123!" };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("This password reset link has expired. Please request a new one.");
  });

  it("should return 400 with user-friendly message for invalid token", async () => {
    vi.mocked(passwordResetModule.resetPassword).mockResolvedValue({
      success: false,
      error: "invalid_token",
    });

    const requestBody = { token: "invalid-token", password: "NewSecurePass123!" };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("This password reset link is invalid or has already been used.");
  });

  it("should return 400 with generic message for user_not_found error", async () => {
    vi.mocked(passwordResetModule.resetPassword).mockResolvedValue({
      success: false,
      error: "user_not_found",
    });

    const requestBody = { token: "valid-token", password: "NewSecurePass123!" };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unable to reset password. Please try again.");
  });

  it("should return 500 with generic message for unknown error", async () => {
    vi.mocked(passwordResetModule.resetPassword).mockResolvedValue({
      success: false,
      error: "unknown_error" as "invalid_token",
    });

    const requestBody = { token: "valid-token", password: "NewSecurePass123!" };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred while resetting your password. Please try again.");
  });

  it("should return 500 when resetPassword throws an error", async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(passwordResetModule.resetPassword).mockRejectedValue(new Error("Database error"));

    const requestBody = { token: "valid-token", password: "NewSecurePass123!" };
    const request = createMockRequest("http://localhost:3000/api/auth/reset-password", requestBody);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred while resetting your password");

    consoleErrorSpy.mockRestore();
  });
});
