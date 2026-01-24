/**
 * Tests for /api/audit/users endpoint
 *
 * Tests system-wide user audit log retrieval including authentication,
 * authorization, filtering, and pagination.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "../route";
import * as middlewareModule from "@/lib/auth/middleware";
import * as auditModule from "@/lib/storage/user-audit";
import type { User } from "@/lib/types/user";
import type { UserAuditEntry } from "@/lib/types/audit";

// Mock dependencies
vi.mock("@/lib/auth/middleware");
vi.mock("@/lib/storage/user-audit");

describe("GET /api/audit/users", () => {
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
  };

  const mockAuditEntries: UserAuditEntry[] = [
    {
      id: "audit-1",
      timestamp: "2024-01-03T00:00:00Z",
      action: "user_suspended",
      actor: { userId: "admin-id", role: "admin" },
      targetUserId: "user-1",
      details: { reason: "Violation" },
    },
    {
      id: "audit-2",
      timestamp: "2024-01-02T00:00:00Z",
      action: "user_role_granted",
      actor: { userId: "admin-id", role: "admin" },
      targetUserId: "user-2",
      details: { newValue: ["user", "gamemaster"] },
    },
    {
      id: "audit-3",
      timestamp: "2024-01-01T00:00:00Z",
      action: "user_created",
      actor: { userId: "system", role: "system" },
      targetUserId: "user-1",
      details: {},
    },
  ];

  const createMockRequest = (searchParams: Record<string, string> = {}): NextRequest => {
    const url = new URL("http://localhost:3000/api/audit/users");
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return {
      nextUrl: url,
    } as NextRequest;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return system-wide audit log", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(auditModule.getAllUserAuditEntries).mockResolvedValue({
      entries: mockAuditEntries,
      total: 3,
    });

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.entries).toHaveLength(3);
    expect(data.total).toBe(3);
  });

  it("should filter by action type", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(auditModule.getAllUserAuditEntries).mockResolvedValue({
      entries: [mockAuditEntries[0]],
      total: 1,
    });

    const request = createMockRequest({ action: "user_suspended" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.entries).toHaveLength(1);
    expect(auditModule.getAllUserAuditEntries).toHaveBeenCalledWith(
      expect.objectContaining({ actions: ["user_suspended"] })
    );
  });

  it("should filter by actor ID", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(auditModule.getAllUserAuditEntries).mockResolvedValue({
      entries: mockAuditEntries.slice(0, 2),
      total: 2,
    });

    const request = createMockRequest({ actorId: "admin-id" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(auditModule.getAllUserAuditEntries).toHaveBeenCalledWith(
      expect.objectContaining({ actorId: "admin-id" })
    );
  });

  it("should filter by target user ID", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(auditModule.getAllUserAuditEntries).mockResolvedValue({
      entries: [mockAuditEntries[0], mockAuditEntries[2]],
      total: 2,
    });

    const request = createMockRequest({ targetUserId: "user-1" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(auditModule.getAllUserAuditEntries).toHaveBeenCalledWith(
      expect.objectContaining({ targetUserId: "user-1" })
    );
  });

  it("should filter by date range", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(auditModule.getAllUserAuditEntries).mockResolvedValue({
      entries: [mockAuditEntries[1]],
      total: 1,
    });

    const request = createMockRequest({
      fromDate: "2024-01-02T00:00:00Z",
      toDate: "2024-01-02T23:59:59Z",
    });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(auditModule.getAllUserAuditEntries).toHaveBeenCalledWith(
      expect.objectContaining({
        fromDate: "2024-01-02T00:00:00Z",
        toDate: "2024-01-02T23:59:59Z",
      })
    );
  });

  it("should respect pagination parameters", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockResolvedValue(mockAdminUser);
    vi.mocked(auditModule.getAllUserAuditEntries).mockResolvedValue({
      entries: [mockAuditEntries[1]],
      total: 3,
    });

    const request = createMockRequest({ limit: "1", offset: "1", order: "asc" });
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(auditModule.getAllUserAuditEntries).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 1, offset: 1, order: "asc" })
    );
  });

  it("should return 403 if not admin", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
      new Error("Administrator access required")
    );

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
  });

  it("should return 403 if not authenticated", async () => {
    vi.mocked(middlewareModule.requireAdmin).mockRejectedValue(
      new Error("Authentication required")
    );

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
  });
});
