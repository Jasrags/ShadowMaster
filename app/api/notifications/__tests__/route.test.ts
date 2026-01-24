/**
 * Tests for /api/notifications endpoint
 *
 * Tests listing notifications (GET) and marking all as read (POST).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "../route";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as notificationsModule from "@/lib/storage/notifications";
import type { CampaignNotification } from "@/lib/types/campaign";
import type { User } from "@/lib/types/user";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/notifications");

describe("GET /api/notifications", () => {
  const mockUser: User = {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
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
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
  };

  const mockNotifications: CampaignNotification[] = [
    {
      id: "notification-1",
      userId: "test-user-id",
      campaignId: "campaign-1",
      type: "campaign_invite",
      title: "Notification 1",
      message: "Message 1",
      read: false,
      dismissed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "notification-2",
      userId: "test-user-id",
      campaignId: "campaign-1",
      type: "session_reminder",
      title: "Notification 2",
      message: "Message 2",
      read: true,
      dismissed: false,
      createdAt: new Date().toISOString(),
    },
  ];

  const createMockRequest = (params?: Record<string, string>): NextRequest => {
    const url = new URL("http://localhost:3000/api/notifications");
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    const request = new NextRequest(url);
    // Add nextUrl property that the route handler expects
    Object.defineProperty(request, "nextUrl", {
      value: url,
      writable: false,
    });
    return request;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(usersModule.getUserById).not.toHaveBeenCalled();
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("User not found");
  });

  it("should return notifications for authenticated user", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(notificationsModule.getUserNotifications).mockResolvedValue(mockNotifications);
    vi.mocked(notificationsModule.getUnreadCount).mockResolvedValue(1);

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.notifications).toHaveLength(2);
    expect(data.unreadCount).toBe(1);
  });

  it("should filter by campaignId", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(notificationsModule.getUserNotifications).mockResolvedValue(mockNotifications);
    vi.mocked(notificationsModule.getUnreadCount).mockResolvedValue(1);

    const request = createMockRequest({ campaignId: "campaign-1" });
    await GET(request);

    expect(notificationsModule.getUserNotifications).toHaveBeenCalledWith(
      "test-user-id",
      expect.objectContaining({ campaignId: "campaign-1" })
    );
  });

  it("should filter by unreadOnly=true", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(notificationsModule.getUserNotifications).mockResolvedValue([mockNotifications[0]]);
    vi.mocked(notificationsModule.getUnreadCount).mockResolvedValue(1);

    const request = createMockRequest({ unreadOnly: "true" });
    await GET(request);

    expect(notificationsModule.getUserNotifications).toHaveBeenCalledWith(
      "test-user-id",
      expect.objectContaining({ unreadOnly: true })
    );
  });

  it("should apply limit and offset pagination", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(notificationsModule.getUserNotifications).mockResolvedValue([mockNotifications[0]]);
    vi.mocked(notificationsModule.getUnreadCount).mockResolvedValue(1);

    const request = createMockRequest({ limit: "10", offset: "5" });
    await GET(request);

    expect(notificationsModule.getUserNotifications).toHaveBeenCalledWith(
      "test-user-id",
      expect.objectContaining({ limit: 10, offset: 5 })
    );
  });

  it("should return unreadCount in response", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(notificationsModule.getUserNotifications).mockResolvedValue([]);
    vi.mocked(notificationsModule.getUnreadCount).mockResolvedValue(5);

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(data.unreadCount).toBe(5);
    expect(notificationsModule.getUnreadCount).toHaveBeenCalledWith("test-user-id", undefined);
  });

  it("should return 500 on server error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.getUserById).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest();
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");

    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/notifications", () => {
  const createMockRequest = (body: object): NextRequest => {
    return {
      json: async () => body,
    } as NextRequest;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest({});
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(notificationsModule.markAllRead).not.toHaveBeenCalled();
  });

  it("should mark all notifications as read", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(notificationsModule.markAllRead).mockResolvedValue(5);

    const request = createMockRequest({});
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.updatedCount).toBe(5);
    expect(notificationsModule.markAllRead).toHaveBeenCalledWith("test-user-id", undefined);
  });

  it("should mark only campaign-specific when campaignId provided", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(notificationsModule.markAllRead).mockResolvedValue(3);

    const request = createMockRequest({ campaignId: "campaign-1" });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.updatedCount).toBe(3);
    expect(notificationsModule.markAllRead).toHaveBeenCalledWith("test-user-id", "campaign-1");
  });

  it("should return updatedCount in response", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(notificationsModule.markAllRead).mockResolvedValue(10);

    const request = createMockRequest({});
    const response = await POST(request);
    const data = await response.json();

    expect(data.updatedCount).toBe(10);
  });

  it("should return 500 on server error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(notificationsModule.markAllRead).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest({});
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");

    consoleErrorSpy.mockRestore();
  });
});
