/**
 * Tests for /api/account/delete endpoint
 *
 * Tests account deletion functionality including password verification,
 * session clearing, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as storageModule from "@/lib/storage/users";
import * as passwordModule from "@/lib/auth/password";
import type { User } from "@/lib/types/user";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/auth/password");

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

describe("POST /api/account/delete", () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/account/delete", {
      password: "password123",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
    expect(storageModule.getUserById).not.toHaveBeenCalled();
  });

  it("should return 400 when password missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyCredentials).mockResolvedValue({
      valid: false,
      error: "Password is required",
    });

    const request = createMockRequest("http://localhost:3000/api/account/delete", {});

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Password is required");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/account/delete", {
      password: "password123",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 401 when password incorrect", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyCredentials).mockResolvedValue({ valid: false, error: null });

    const request = createMockRequest("http://localhost:3000/api/account/delete", {
      password: "wrongpassword",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Incorrect password");
    expect(passwordModule.verifyCredentials).toHaveBeenCalledWith(
      "wrongpassword",
      "hashed-password"
    );
    expect(storageModule.deleteUser).not.toHaveBeenCalled();
  });

  it("should delete user and clear session on success", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyCredentials).mockResolvedValue({ valid: true, error: null });
    vi.mocked(storageModule.deleteUser).mockResolvedValue(undefined);

    const request = createMockRequest("http://localhost:3000/api/account/delete", {
      password: "correctpassword",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(storageModule.deleteUser).toHaveBeenCalledWith("test-user-id");
    expect(sessionModule.clearSession).toHaveBeenCalled();
  });

  it("should call deleteUser with correct userId", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("specific-user-id");
    const specificUser = { ...mockUser, id: "specific-user-id" };
    vi.mocked(storageModule.getUserById).mockResolvedValue(specificUser);
    vi.mocked(passwordModule.verifyCredentials).mockResolvedValue({ valid: true, error: null });
    vi.mocked(storageModule.deleteUser).mockResolvedValue(undefined);

    const request = createMockRequest("http://localhost:3000/api/account/delete", {
      password: "correctpassword",
    });

    await POST(request);

    expect(storageModule.deleteUser).toHaveBeenCalledWith("specific-user-id");
  });

  it("should return 500 on server error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyCredentials).mockResolvedValue({ valid: true, error: null });
    vi.mocked(storageModule.deleteUser).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest("http://localhost:3000/api/account/delete", {
      password: "correctpassword",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Internal server error");

    consoleErrorSpy.mockRestore();
  });
});
