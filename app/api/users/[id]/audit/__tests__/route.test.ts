/**
 * Tests for /api/users/[id]/audit endpoint
 *
 * Tests user-specific audit log retrieval including authentication,
 * authorization, and pagination.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";
import * as middlewareModule from "@/lib/auth/middleware";
import * as storageModule from "@/lib/storage/users";
import * as auditModule from "@/lib/storage/user-audit";
import type { User } from "@/lib/types/user";
import type { UserAuditEntry } from "@/lib/types/audit";

// Mock dependencies
vi.mock("@/lib/auth/middleware");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/user-audit");

describe("GET /api/users/[id]/audit", () => {
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
  };

  const mockAuditEntries: UserAuditEntry[] = [
    {
      id: "audit-1",
      timestamp: "2024-01-02T00:00:00Z",
      action: "user_role_granted",
      actor: { userId: "admin-id", role: "admin" },
      targetUserId: "target-user-id",
      details: { newValue: ["user", "gamemaster"] },
    },
    {
      id: "audit-2",
      timestamp: "2024-01-01T00:00:00Z",
      action: "user_created",
      actor: { userId: "system", role: "system" },
      targetUserId: "target-user-id",
      details: {},
    },
  ];

  const createMockRequest = (searchParams: Record<string, string> = {}): NextRequest => {
    const url = new URL("http://localhost:3000/api/users/target-user-id/audit");
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return {
      nextUrl: url,
    } as NextRequest;
  };

  const createMockParams = (id: string) => ({
    params: Promise.resolve({ id }),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return audit log for a user", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(auditModule.getUserAuditLog).mockResolvedValue({
      entries: mockAuditEntries,
      total: 2,
    });

    const request = createMockRequest();
    const { params } = createMockParams("target-user-id");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.entries).toHaveLength(2);
    expect(data.total).toBe(2);
    expect(auditModule.getUserAuditLog).toHaveBeenCalledWith(
      "target-user-id",
      expect.objectContaining({ limit: 50, offset: 0, order: "desc" })
    );
  });

  it("should respect pagination parameters", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(storageModule.getUserById).mockResolvedValue(mockTargetUser);
    vi.mocked(auditModule.getUserAuditLog).mockResolvedValue({
      entries: [mockAuditEntries[0]],
      total: 2,
    });

    const request = createMockRequest({ limit: "1", offset: "1", order: "asc" });
    const { params } = createMockParams("target-user-id");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.entries).toHaveLength(1);
    expect(auditModule.getUserAuditLog).toHaveBeenCalledWith(
      "target-user-id",
      expect.objectContaining({ limit: 1, offset: 1, order: "asc" })
    );
  });

  it("should return 404 if user not found", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(storageModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest();
    const { params } = createMockParams("nonexistent-id");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toContain("not found");
  });

  it("should return 403 if not admin", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
      new Error("Administrator access required")
    );

    const request = createMockRequest();
    const { params } = createMockParams("target-user-id");
    const response = await GET(request, { params });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
  });
});
