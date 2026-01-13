/**
 * Tests for /api/auth/signin endpoint
 *
 * Tests sign-in functionality including validation, authentication,
 * session creation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../signin/route";
import { NextRequest } from "next/server";
import * as storageModule from "@/lib/storage/users";
import * as passwordModule from "@/lib/auth/password";
import * as sessionModule from "@/lib/auth/session";
import { RateLimiter } from "@/lib/security/rate-limit";
import { AuditLogger } from "@/lib/security/audit-logger";
import type { User } from "@/lib/types/user";

// Mock dependencies
vi.mock("@/lib/storage/users");
vi.mock("@/lib/auth/password");
vi.mock("@/lib/auth/session");
vi.mock("@/lib/security/rate-limit");
vi.mock("@/lib/security/audit-logger");

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = "GET"): NextRequest {
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

describe("POST /api/auth/signin", () => {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks for security modules
    const mockLimiter = {
      isRateLimited: vi.fn().mockReturnValue(false),
      reset: vi.fn(),
    };
    vi.spyOn(RateLimiter, "get").mockReturnValue(mockLimiter as unknown as RateLimiter);
    vi.spyOn(AuditLogger, "log").mockResolvedValue(undefined);
  });

  it("should sign in successfully with valid credentials", async () => {
    const requestBody = {
      email: "test@example.com",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyPassword).mockResolvedValue(true);
    vi.mocked(storageModule.updateUser).mockResolvedValue({
      ...mockUser,
      lastLogin: new Date().toISOString(),
    });

    const request = createMockRequest("http://localhost:3000/api/auth/signin", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe(mockUser.id);
    expect(data.user.email).toBe(mockUser.email);
    expect(data.user.username).toBe(mockUser.username);
    expect(data.user.role).toEqual(mockUser.role);
    expect(data.user.lastLogin).toBeDefined();

    expect(storageModule.getUserByEmail).toHaveBeenCalledWith("test@example.com");
    expect(passwordModule.verifyPassword).toHaveBeenCalledWith("ValidPass123!", "hashed-password");
    expect(storageModule.updateUser).toHaveBeenCalledWith(
      mockUser.id,
      expect.objectContaining({
        lastLogin: expect.any(String),
      })
    );
    expect(sessionModule.createSession).toHaveBeenCalledWith(mockUser.id, expect.any(Object), 1);
  });

  it("should return 400 when email is missing", async () => {
    const requestBody = {
      password: "ValidPass123!",
    };

    const request = createMockRequest("http://localhost:3000/api/auth/signin", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Email and password are required");
    expect(storageModule.getUserByEmail).not.toHaveBeenCalled();
  });

  it("should return 400 when password is missing", async () => {
    const requestBody = {
      email: "test@example.com",
    };

    const request = createMockRequest("http://localhost:3000/api/auth/signin", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Email and password are required");
    expect(storageModule.getUserByEmail).not.toHaveBeenCalled();
  });

  it("should return 401 when user does not exist", async () => {
    const requestBody = {
      email: "nonexistent@example.com",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/auth/signin", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid email or password");
    expect(passwordModule.verifyPassword).not.toHaveBeenCalled();
    expect(sessionModule.createSession).not.toHaveBeenCalled();
  });

  it("should return 401 when password is incorrect", async () => {
    const requestBody = {
      email: "test@example.com",
      password: "WrongPassword123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyPassword).mockResolvedValue(false);

    const request = createMockRequest("http://localhost:3000/api/auth/signin", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid email or password");
    expect(passwordModule.verifyPassword).toHaveBeenCalledWith(
      "WrongPassword123!",
      "hashed-password"
    );
    expect(sessionModule.createSession).not.toHaveBeenCalled();
    expect(storageModule.updateUser).not.toHaveBeenCalled();
  });

  it("should return 500 when an error occurs", async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const requestBody = {
      email: "test@example.com",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest("http://localhost:3000/api/auth/signin", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred during signin");

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it("should update lastLogin timestamp on successful sign-in", async () => {
    const requestBody = {
      email: "test@example.com",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyPassword).mockResolvedValue(true);
    vi.mocked(storageModule.updateUser).mockResolvedValue({
      ...mockUser,
      lastLogin: new Date().toISOString(),
    });

    const request = createMockRequest("http://localhost:3000/api/auth/signin", requestBody, "POST");

    await POST(request);

    expect(storageModule.updateUser).toHaveBeenCalledWith(
      mockUser.id,
      expect.objectContaining({
        lastLogin: expect.any(String),
      })
    );
  });
});
