/**
 * Tests for /api/users/[id]/suspend endpoint
 *
 * Tests user suspension and reactivation including authentication,
 * authorization, and last-admin protection.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, DELETE } from "../route";
import * as middlewareModule from "@/lib/auth/middleware";
import * as storageModule from "@/lib/storage/users";
import type { User } from "@/lib/types/user";

// Helper to create public user (strips passwordHash)
function stripPasswordHash(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}

// Mock dependencies
vi.mock("@/lib/auth/middleware", async (importOriginal) => {
  const actual = await importOriginal<typeof middlewareModule>();
  return {
    ...actual,
    requireAdmin: vi.fn(),
    toPublicUser: (user: User) => stripPasswordHash(user),
  };
});
vi.mock("@/lib/storage/users");

describe("User Suspend API", () => {
  const mockAdminUser: User = {
    id: "admin-user-id",
    email: "admin@example.com",
    username: "admin",
    passwordHash: "hashed",
    role: ["administrator"],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    preferences: { theme: "system", navigationCollapsed: false },
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
  };

  const mockTargetUser: User = {
    id: "target-user-id",
    email: "target@example.com",
    username: "target",
    passwordHash: "hashed",
    role: ["user"],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    preferences: { theme: "system", navigationCollapsed: false },
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
  };

  const createMockRequest = (body: object): NextRequest => {
    return {
      json: async () => body,
    } as NextRequest;
  };

  const createMockParams = (id: string) => ({
    params: Promise.resolve({ id }),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/users/[id]/suspend", () => {
    it("should suspend a user with valid reason", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
      vi.mocked(storageModule.getUserById).mockResolvedValue(mockTargetUser);
      vi.mocked(storageModule.suspendUser).mockResolvedValue({
        ...mockTargetUser,
        accountStatus: "suspended",
        statusReason: "Violation of terms",
        statusChangedAt: new Date().toISOString(),
        statusChangedBy: mockAdminUser.id,
      });

      const request = createMockRequest({ reason: "Violation of terms" });
      const { params } = createMockParams("target-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.accountStatus).toBe("suspended");
      expect(storageModule.suspendUser).toHaveBeenCalledWith(
        "target-user-id",
        mockAdminUser.id,
        "Violation of terms"
      );
    });

    it("should return 400 if reason is not provided", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);

      const request = createMockRequest({});
      const { params } = createMockParams("target-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("reason");
    });

    it("should return 400 if reason is empty", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);

      const request = createMockRequest({ reason: "   " });
      const { params } = createMockParams("target-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it("should return 404 if user not found", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
      vi.mocked(storageModule.getUserById).mockResolvedValue(null);

      const request = createMockRequest({ reason: "Test" });
      const { params } = createMockParams("nonexistent-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain("not found");
    });

    it("should return 400 if user is already suspended", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
      vi.mocked(storageModule.getUserById).mockResolvedValue({
        ...mockTargetUser,
        accountStatus: "suspended",
      });

      const request = createMockRequest({ reason: "Test" });
      const { params } = createMockParams("target-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("already suspended");
    });

    it("should return 403 if not admin", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
        new Error("Administrator access required")
      );

      const request = createMockRequest({ reason: "Test" });
      const { params } = createMockParams("target-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });

    it("should return 400 if trying to suspend last admin", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
      vi.mocked(storageModule.getUserById).mockResolvedValue({
        ...mockTargetUser,
        role: ["administrator"],
      });
      vi.mocked(storageModule.suspendUser).mockRejectedValue(
        new Error("Cannot suspend the last administrator")
      );

      const request = createMockRequest({ reason: "Test" });
      const { params } = createMockParams("target-user-id");
      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("last administrator");
    });
  });

  describe("DELETE /api/users/[id]/suspend", () => {
    it("should reactivate a suspended user", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
      vi.mocked(storageModule.getUserById).mockResolvedValue({
        ...mockTargetUser,
        accountStatus: "suspended",
      });
      vi.mocked(storageModule.reactivateUser).mockResolvedValue({
        ...mockTargetUser,
        accountStatus: "active",
        statusReason: null,
        statusChangedAt: new Date().toISOString(),
        statusChangedBy: mockAdminUser.id,
      });

      const request = {} as NextRequest;
      const { params } = createMockParams("target-user-id");
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.user.accountStatus).toBe("active");
      expect(storageModule.reactivateUser).toHaveBeenCalledWith("target-user-id", mockAdminUser.id);
    });

    it("should return 404 if user not found", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
      vi.mocked(storageModule.getUserById).mockResolvedValue(null);

      const request = {} as NextRequest;
      const { params } = createMockParams("nonexistent-id");
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it("should return 400 if user is already active", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
      vi.mocked(storageModule.getUserById).mockResolvedValue(mockTargetUser);

      const request = {} as NextRequest;
      const { params } = createMockParams("target-user-id");
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("already active");
    });

    it("should return 403 if not admin", async () => {
      vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
        new Error("Administrator access required")
      );

      const request = {} as NextRequest;
      const { params } = createMockParams("target-user-id");
      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });
});
