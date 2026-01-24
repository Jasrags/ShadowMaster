/**
 * Tests for /api/auth/signup endpoint
 *
 * Tests user registration functionality including validation,
 * password hashing, session creation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as storageModule from "@/lib/storage/users";
import * as passwordModule from "@/lib/auth/password";
import * as sessionModule from "@/lib/auth/session";
import * as validationModule from "@/lib/auth/validation";
import type { User } from "@/lib/types/user";

// Mock dependencies
vi.mock("@/lib/storage/users");
vi.mock("@/lib/auth/password");
vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/validation");

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

describe("POST /api/auth/signup", () => {
  const mockUser: User = {
    id: "new-user-id",
    email: "newuser@example.com",
    username: "newuser",
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
    emailVerified: true,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default validation mocks (passing)
    vi.mocked(validationModule.isValidEmail).mockReturnValue(true);
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(true);
    vi.mocked(validationModule.getPasswordStrengthError).mockReturnValue(null);
  });

  it("should create user successfully with valid data", async () => {
    const requestBody = {
      email: "newuser@example.com",
      username: "newuser",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(null);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(storageModule.createUser).mockResolvedValue(mockUser);

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe(mockUser.id);
    expect(data.user.email).toBe(mockUser.email);
    expect(data.user.username).toBe(mockUser.username);

    expect(storageModule.getUserByEmail).toHaveBeenCalledWith("newuser@example.com");
    expect(passwordModule.hashPassword).toHaveBeenCalledWith("ValidPass123!");
    expect(storageModule.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "newuser@example.com",
        username: "newuser",
        passwordHash: "hashed-password",
        role: ["user"],
      })
    );
    expect(sessionModule.createSession).toHaveBeenCalledWith(mockUser.id, expect.any(Object));
  });

  it("should return 400 when email is missing", async () => {
    const requestBody = {
      username: "newuser",
      password: "ValidPass123!",
    };

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Email, username, and password are required");
    expect(storageModule.getUserByEmail).not.toHaveBeenCalled();
    expect(storageModule.createUser).not.toHaveBeenCalled();
  });

  it("should return 400 when username is missing", async () => {
    const requestBody = {
      email: "newuser@example.com",
      password: "ValidPass123!",
    };

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Email, username, and password are required");
    expect(storageModule.getUserByEmail).not.toHaveBeenCalled();
    expect(storageModule.createUser).not.toHaveBeenCalled();
  });

  it("should return 400 when password is missing", async () => {
    const requestBody = {
      email: "newuser@example.com",
      username: "newuser",
    };

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Email, username, and password are required");
    expect(storageModule.getUserByEmail).not.toHaveBeenCalled();
    expect(storageModule.createUser).not.toHaveBeenCalled();
  });

  it("should return 400 when email format is invalid", async () => {
    vi.mocked(validationModule.isValidEmail).mockReturnValue(false);

    const requestBody = {
      email: "invalid-email",
      username: "newuser",
      password: "ValidPass123!",
    };

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid email format");
    expect(validationModule.isValidEmail).toHaveBeenCalledWith("invalid-email");
    expect(storageModule.getUserByEmail).not.toHaveBeenCalled();
    expect(storageModule.createUser).not.toHaveBeenCalled();
  });

  it("should return 400 when password is too weak", async () => {
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(false);
    vi.mocked(validationModule.getPasswordStrengthError).mockReturnValue(
      "Password must be at least 8 characters long"
    );

    const requestBody = {
      email: "newuser@example.com",
      username: "newuser",
      password: "weak",
    };

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Password must be at least 8 characters long");
    expect(validationModule.isStrongPassword).toHaveBeenCalledWith("weak");
    expect(validationModule.getPasswordStrengthError).toHaveBeenCalledWith("weak");
    expect(storageModule.getUserByEmail).not.toHaveBeenCalled();
    expect(storageModule.createUser).not.toHaveBeenCalled();
  });

  it("should return 400 with missing requirements message for weak password", async () => {
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(false);
    vi.mocked(validationModule.getPasswordStrengthError).mockReturnValue(
      "Password must contain at least one uppercase letter, number"
    );

    const requestBody = {
      email: "newuser@example.com",
      username: "newuser",
      password: "weakpass!",
    };

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Password must contain at least one uppercase letter, number");
  });

  it("should return default message when getPasswordStrengthError returns null", async () => {
    vi.mocked(validationModule.isStrongPassword).mockReturnValue(false);
    vi.mocked(validationModule.getPasswordStrengthError).mockReturnValue(null);

    const requestBody = {
      email: "newuser@example.com",
      username: "newuser",
      password: "weakpass",
    };

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Password does not meet strength requirements");
  });

  it("should return 409 when email already exists", async () => {
    const existingUser: User = {
      ...mockUser,
      id: "existing-user-id",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(existingUser);

    const requestBody = {
      email: "existing@example.com",
      username: "newuser",
      password: "ValidPass123!",
    };

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User with this email already exists");
    expect(storageModule.getUserByEmail).toHaveBeenCalledWith("existing@example.com");
    expect(storageModule.createUser).not.toHaveBeenCalled();
  });

  it("should return 500 when database error occurs", async () => {
    // Suppress console.error output for this test
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const requestBody = {
      email: "newuser@example.com",
      username: "newuser",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockRejectedValue(
      new Error("Database connection failed")
    );

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred during signup");

    consoleErrorSpy.mockRestore();
  });

  it("should normalize email to lowercase and trim", async () => {
    const requestBody = {
      email: "  NewUser@Example.COM  ",
      username: "newuser",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(null);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(storageModule.createUser).mockResolvedValue(mockUser);

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    await POST(request);

    expect(storageModule.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "newuser@example.com",
      })
    );
  });

  it("should trim username", async () => {
    const requestBody = {
      email: "newuser@example.com",
      username: "  newuser  ",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(null);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(storageModule.createUser).mockResolvedValue(mockUser);

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    await POST(request);

    expect(storageModule.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        username: "newuser",
      })
    );
  });

  it("should not include passwordHash in response", async () => {
    const requestBody = {
      email: "newuser@example.com",
      username: "newuser",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(null);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(storageModule.createUser).mockResolvedValue(mockUser);

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    const response = await POST(request);
    const data = await response.json();

    expect(data.user.passwordHash).toBeUndefined();
  });

  it("should assign user role to new users", async () => {
    const requestBody = {
      email: "newuser@example.com",
      username: "newuser",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(null);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(storageModule.createUser).mockResolvedValue(mockUser);

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    await POST(request);

    expect(storageModule.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        role: ["user"],
      })
    );
  });

  it("should create session after user creation", async () => {
    const requestBody = {
      email: "newuser@example.com",
      username: "newuser",
      password: "ValidPass123!",
    };

    vi.mocked(storageModule.getUserByEmail).mockResolvedValue(null);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(storageModule.createUser).mockResolvedValue(mockUser);

    const request = createMockRequest("http://localhost:3000/api/auth/signup", requestBody, "POST");

    await POST(request);

    expect(sessionModule.createSession).toHaveBeenCalledWith(mockUser.id, expect.any(Object));
  });
});
