/**
 * Tests for POST /api/notifications/mark-all-read
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "../route";
import * as sessionModule from "@/lib/auth/session";
import * as notificationsModule from "@/lib/storage/notifications";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/notifications");

describe("POST /api/notifications/mark-all-read", () => {
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
