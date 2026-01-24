/**
 * Tests for /api/settings/password endpoint
 *
 * Tests password change functionality including current password verification,
 * new password hashing, session version increment, audit logging, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../route";
import * as sessionModule from "@/lib/auth/session";
import * as storageModule from "@/lib/storage/users";
import * as passwordModule from "@/lib/auth/password";
import * as auditModule from "@/lib/security/audit-logger";
import type { User } from "@/lib/types/user";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/auth/password");
vi.mock("@/lib/security/audit-logger");

// Helper to create a NextRequest with JSON body
function createMockRequest(body?: unknown): NextRequest {
  const headers = new Headers();
  headers.set("x-forwarded-for", "127.0.0.1");
  if (body) {
    headers.set("Content-Type", "application/json");
  }

  const request = new NextRequest("http://localhost:3000/api/settings/password", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  // Mock json() method if body is provided
  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

describe("POST /api/settings/password", () => {
  const mockUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "old-hashed-password",
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
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock clearSession to just return without modifying response
    vi.mocked(sessionModule.clearSession).mockImplementation(() => {});
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest({
      currentPassword: "oldpassword",
      newPassword: "NewPassword123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(storageModule.getUserById).not.toHaveBeenCalled();
  });

  it("should return 400 when currentPassword missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");

    const request = createMockRequest({
      newPassword: "NewPassword123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing required fields");
  });

  it("should return 400 when newPassword missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");

    const request = createMockRequest({
      currentPassword: "oldpassword",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Missing required fields");
  });

  it("should return 400 when newPassword is too weak (defense-in-depth)", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");

    const request = createMockRequest({
      currentPassword: "oldpassword",
      newPassword: "short",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Password must");
  });

  it("should return 400 when newPassword is missing required characters", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");

    const request = createMockRequest({
      currentPassword: "oldpassword",
      newPassword: "verylongbutnospecialchars1",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("uppercase");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest({
      currentPassword: "oldpassword",
      newPassword: "NewPassword123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("User not found");
  });

  it("should return 400 when current password incorrect", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyPassword).mockResolvedValue(false);

    const request = createMockRequest({
      currentPassword: "wrongpassword",
      newPassword: "NewPassword123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Incorrect current password");
    expect(passwordModule.verifyPassword).toHaveBeenCalledWith(
      "wrongpassword",
      "old-hashed-password"
    );
    expect(storageModule.updateUser).not.toHaveBeenCalled();
  });

  it("should log signin.failure audit when password wrong", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyPassword).mockResolvedValue(false);

    const request = createMockRequest({
      currentPassword: "wrongpassword",
      newPassword: "NewPassword123!",
    });

    await POST(request);

    expect(auditModule.AuditLogger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "signin.failure",
        userId: "test-user-id",
        metadata: expect.objectContaining({
          context: "password_change",
          reason: "invalid_current_password",
        }),
      })
    );
  });

  it("should update password hash on success", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyPassword).mockResolvedValue(true);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("new-hashed-password");
    vi.mocked(storageModule.updateUser).mockResolvedValue(undefined as unknown as never);
    vi.mocked(storageModule.incrementSessionVersion).mockResolvedValue(
      undefined as unknown as never
    );

    const request = createMockRequest({
      currentPassword: "correctoldpassword",
      newPassword: "NewPassword123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(passwordModule.hashPassword).toHaveBeenCalledWith("NewPassword123!");
    expect(storageModule.updateUser).toHaveBeenCalledWith("test-user-id", {
      passwordHash: "new-hashed-password",
    });
  });

  it("should increment session version on success", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyPassword).mockResolvedValue(true);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("new-hashed-password");
    vi.mocked(storageModule.updateUser).mockResolvedValue(undefined as unknown as never);
    vi.mocked(storageModule.incrementSessionVersion).mockResolvedValue(
      undefined as unknown as never
    );

    const request = createMockRequest({
      currentPassword: "correctoldpassword",
      newPassword: "NewPassword123!",
    });

    await POST(request);

    expect(storageModule.incrementSessionVersion).toHaveBeenCalledWith("test-user-id");
  });

  it("should log password.change audit on success", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyPassword).mockResolvedValue(true);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("new-hashed-password");
    vi.mocked(storageModule.updateUser).mockResolvedValue(undefined as unknown as never);
    vi.mocked(storageModule.incrementSessionVersion).mockResolvedValue(
      undefined as unknown as never
    );

    const request = createMockRequest({
      currentPassword: "correctoldpassword",
      newPassword: "NewPassword123!",
    });

    await POST(request);

    expect(auditModule.AuditLogger.log).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "password.change",
        userId: "test-user-id",
      })
    );
  });

  it("should clear session cookie after change", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyPassword).mockResolvedValue(true);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("new-hashed-password");
    vi.mocked(storageModule.updateUser).mockResolvedValue(undefined as unknown as never);
    vi.mocked(storageModule.incrementSessionVersion).mockResolvedValue(
      undefined as unknown as never
    );

    const request = createMockRequest({
      currentPassword: "correctoldpassword",
      newPassword: "NewPassword123!",
    });

    await POST(request);

    expect(sessionModule.clearSession).toHaveBeenCalled();
  });

  it("should return 500 on server error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(passwordModule.verifyPassword).mockResolvedValue(true);
    vi.mocked(passwordModule.hashPassword).mockResolvedValue("new-hashed-password");
    vi.mocked(storageModule.updateUser).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest({
      currentPassword: "correctoldpassword",
      newPassword: "NewPassword123!",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");

    consoleErrorSpy.mockRestore();
  });
});
