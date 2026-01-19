/**
 * Tests for /api/notifications/[id] endpoint
 *
 * Tests updating individual notification status (read/dismissed).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { PATCH } from "../route";
import * as sessionModule from "@/lib/auth/session";
import * as notificationsModule from "@/lib/storage/notifications";
import type { CampaignNotification } from "@/lib/types/campaign";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/notifications");

describe("PATCH /api/notifications/[id]", () => {
  const mockNotification: CampaignNotification = {
    id: "notification-1",
    userId: "test-user-id",
    campaignId: "campaign-1",
    type: "campaign_invite",
    title: "Test Notification",
    message: "This is a test notification",
    read: false,
    dismissed: false,
    createdAt: new Date().toISOString(),
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

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest({ read: true });
    const { params } = createMockParams("notification-1");
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
    expect(notificationsModule.updateNotification).not.toHaveBeenCalled();
  });

  it("should return 404 when notification not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(notificationsModule.updateNotification).mockResolvedValue(null);

    const request = createMockRequest({ read: true });
    const { params } = createMockParams("nonexistent-id");
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Notification not found");
  });

  it("should mark notification as read", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(notificationsModule.updateNotification).mockResolvedValue({
      ...mockNotification,
      read: true,
      readAt: new Date().toISOString(),
    });

    const request = createMockRequest({ read: true });
    const { params } = createMockParams("notification-1");
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.notification.read).toBe(true);
    expect(notificationsModule.updateNotification).toHaveBeenCalledWith(
      "test-user-id",
      "notification-1",
      { read: true, dismissed: undefined }
    );
  });

  it("should mark notification as dismissed", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(notificationsModule.updateNotification).mockResolvedValue({
      ...mockNotification,
      dismissed: true,
    });

    const request = createMockRequest({ dismissed: true });
    const { params } = createMockParams("notification-1");
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.notification.dismissed).toBe(true);
    expect(notificationsModule.updateNotification).toHaveBeenCalledWith(
      "test-user-id",
      "notification-1",
      { read: undefined, dismissed: true }
    );
  });

  it("should set readAt timestamp when marking as read", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    const readAt = new Date().toISOString();
    vi.mocked(notificationsModule.updateNotification).mockResolvedValue({
      ...mockNotification,
      read: true,
      readAt,
    });

    const request = createMockRequest({ read: true });
    const { params } = createMockParams("notification-1");
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.notification.readAt).toBe(readAt);
  });

  it("should not overwrite readAt if already set", async () => {
    const originalReadAt = "2024-01-01T00:00:00.000Z";
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(notificationsModule.updateNotification).mockResolvedValue({
      ...mockNotification,
      read: true,
      readAt: originalReadAt,
    });

    const request = createMockRequest({ read: true });
    const { params } = createMockParams("notification-1");
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.notification.readAt).toBe(originalReadAt);
  });

  it("should return 500 on server error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(notificationsModule.updateNotification).mockRejectedValue(
      new Error("Database error")
    );

    const request = createMockRequest({ read: true });
    const { params } = createMockParams("notification-1");
    const response = await PATCH(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");

    consoleErrorSpy.mockRestore();
  });
});
