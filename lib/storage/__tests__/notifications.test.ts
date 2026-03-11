/**
 * Unit tests for notifications.ts storage module
 *
 * Tests notification CRUD operations with isolated temp directories.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import type { CampaignNotification } from "@/lib/types/campaign";

let testDir: string;

// Dynamic imports so we can set NOTIFICATION_DATA_DIR before module evaluation
let createNotification: typeof import("../notifications").createNotification;
let getUserNotifications: typeof import("../notifications").getUserNotifications;
let updateNotification: typeof import("../notifications").updateNotification;
let markAllRead: typeof import("../notifications").markAllRead;
let getUnreadCount: typeof import("../notifications").getUnreadCount;

const TEST_USER_ID = "test-user-notifications";

// =============================================================================
// SETUP & TEARDOWN
// =============================================================================

beforeEach(async () => {
  testDir = await fs.mkdtemp(path.join(os.tmpdir(), "notification-storage-test-"));
  process.env.NOTIFICATION_DATA_DIR = testDir;

  vi.resetModules();
  const mod = await import("../notifications");
  createNotification = mod.createNotification;
  getUserNotifications = mod.getUserNotifications;
  updateNotification = mod.updateNotification;
  markAllRead = mod.markAllRead;
  getUnreadCount = mod.getUnreadCount;
});

afterEach(async () => {
  delete process.env.NOTIFICATION_DATA_DIR;
  try {
    await fs.rm(testDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createMockNotificationData(
  overrides: Partial<Omit<CampaignNotification, "id" | "createdAt" | "read" | "dismissed">> = {}
): Omit<CampaignNotification, "id" | "createdAt" | "read" | "dismissed"> {
  return {
    userId: TEST_USER_ID,
    campaignId: "campaign-1",
    type: "post_created",
    title: "Character Joined",
    message: "A new character has joined the campaign",
    ...overrides,
  };
}

// =============================================================================
// CREATE NOTIFICATION TESTS
// =============================================================================

describe("createNotification", () => {
  it("should create a new notification with generated ID", async () => {
    const notificationData = createMockNotificationData();

    const result = await createNotification(notificationData);

    expect(result.id).toBeDefined();
    expect(result.userId).toBe(TEST_USER_ID);
    expect(result.title).toBe("Character Joined");
    expect(result.read).toBe(false);
    expect(result.dismissed).toBe(false);
  });

  it("should set createdAt timestamp", async () => {
    const beforeTime = new Date().toISOString();

    const result = await createNotification(createMockNotificationData());

    const afterTime = new Date().toISOString();

    expect(result.createdAt >= beforeTime).toBe(true);
    expect(result.createdAt <= afterTime).toBe(true);
  });

  it("should add new notifications to the beginning", async () => {
    await createNotification(createMockNotificationData({ title: "First" }));
    await createNotification(createMockNotificationData({ title: "Second" }));

    const notifications = await getUserNotifications(TEST_USER_ID);

    expect(notifications[0].title).toBe("Second");
    expect(notifications[1].title).toBe("First");
  });

  it("should limit notifications to 100", async () => {
    // Create 100 existing notifications
    const existingNotifications: CampaignNotification[] = [];
    for (let i = 0; i < 100; i++) {
      existingNotifications.push({
        id: `existing-${i}`,
        userId: TEST_USER_ID,
        campaignId: "campaign-1",
        type: "post_created",
        title: `Notification ${i}`,
        message: `Message ${i}`,
        createdAt: new Date().toISOString(),
        read: false,
        dismissed: false,
      });
    }

    const filePath = path.join(testDir, `${TEST_USER_ID}.json`);
    await fs.writeFile(filePath, JSON.stringify(existingNotifications, null, 2), "utf-8");

    // Add one more
    await createNotification(createMockNotificationData({ title: "New beyond limit" }));

    const notifications = await getUserNotifications(TEST_USER_ID, {
      limit: 150,
    });

    expect(notifications.length).toBe(100);
    expect(notifications[0].title).toBe("New beyond limit");
  });
});

// =============================================================================
// GET USER NOTIFICATIONS TESTS
// =============================================================================

describe("getUserNotifications", () => {
  it("should return empty array for user with no notifications", async () => {
    const result = await getUserNotifications("non-existent-user");
    expect(result).toEqual([]);
  });

  it("should return notifications with default pagination", async () => {
    for (let i = 0; i < 60; i++) {
      await createNotification(createMockNotificationData({ title: `Notification ${i}` }));
    }

    const result = await getUserNotifications(TEST_USER_ID);

    // Default limit is 50
    expect(result.length).toBe(50);
  });

  it("should filter by campaignId", async () => {
    await createNotification(
      createMockNotificationData({ campaignId: "campaign-1", title: "Campaign 1" })
    );
    await createNotification(
      createMockNotificationData({ campaignId: "campaign-2", title: "Campaign 2" })
    );

    const result = await getUserNotifications(TEST_USER_ID, {
      campaignId: "campaign-1",
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Campaign 1");
  });

  it("should filter unreadOnly", async () => {
    const n1 = await createNotification(createMockNotificationData({ title: "Unread" }));
    await createNotification(createMockNotificationData({ title: "To be read" }));

    // Mark the first one as read
    await updateNotification(TEST_USER_ID, n1.id, { read: true });

    const result = await getUserNotifications(TEST_USER_ID, {
      unreadOnly: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("To be read");
  });

  it("should respect limit parameter", async () => {
    for (let i = 0; i < 20; i++) {
      await createNotification(createMockNotificationData());
    }

    const result = await getUserNotifications(TEST_USER_ID, { limit: 5 });

    expect(result.length).toBe(5);
  });

  it("should respect offset parameter", async () => {
    for (let i = 0; i < 10; i++) {
      await createNotification(createMockNotificationData({ title: `Notification ${i}` }));
    }

    const result = await getUserNotifications(TEST_USER_ID, {
      offset: 5,
      limit: 5,
    });

    expect(result.length).toBe(5);
  });
});

// =============================================================================
// UPDATE NOTIFICATION TESTS
// =============================================================================

describe("updateNotification", () => {
  it("should mark notification as read and set readAt", async () => {
    const notification = await createNotification(createMockNotificationData());

    const beforeTime = new Date().toISOString();
    const result = await updateNotification(TEST_USER_ID, notification.id, {
      read: true,
    });
    const afterTime = new Date().toISOString();

    expect(result?.read).toBe(true);
    expect(result?.readAt).toBeDefined();
    expect(result!.readAt! >= beforeTime).toBe(true);
    expect(result!.readAt! <= afterTime).toBe(true);
  });

  it("should dismiss notification", async () => {
    const notification = await createNotification(createMockNotificationData());

    const result = await updateNotification(TEST_USER_ID, notification.id, {
      dismissed: true,
    });

    expect(result?.dismissed).toBe(true);
  });

  it("should return null for non-existent notification", async () => {
    const result = await updateNotification(TEST_USER_ID, "non-existent", {
      read: true,
    });

    expect(result).toBeNull();
  });

  it("should return null for non-existent user", async () => {
    const result = await updateNotification("non-existent-user", "non-existent", { read: true });

    expect(result).toBeNull();
  });
});

// =============================================================================
// MARK ALL READ TESTS
// =============================================================================

describe("markAllRead", () => {
  it("should mark all notifications as read", async () => {
    await createNotification(createMockNotificationData({ title: "First" }));
    await createNotification(createMockNotificationData({ title: "Second" }));

    const count = await markAllRead(TEST_USER_ID);

    expect(count).toBe(2);

    const notifications = await getUserNotifications(TEST_USER_ID);
    expect(notifications.every((n) => n.read)).toBe(true);
  });

  it("should filter by campaign when marking all read", async () => {
    await createNotification(createMockNotificationData({ campaignId: "campaign-1" }));
    await createNotification(createMockNotificationData({ campaignId: "campaign-2" }));

    const count = await markAllRead(TEST_USER_ID, "campaign-1");

    expect(count).toBe(1);

    const notifications = await getUserNotifications(TEST_USER_ID);
    const campaign1 = notifications.find((n) => n.campaignId === "campaign-1");
    const campaign2 = notifications.find((n) => n.campaignId === "campaign-2");

    expect(campaign1?.read).toBe(true);
    expect(campaign2?.read).toBe(false);
  });

  it("should return count of marked notifications", async () => {
    // Create 3 unread notifications
    await createNotification(createMockNotificationData());
    await createNotification(createMockNotificationData());
    const n3 = await createNotification(createMockNotificationData());

    // Mark one as already read
    await updateNotification(TEST_USER_ID, n3.id, { read: true });

    const count = await markAllRead(TEST_USER_ID);

    // Only 2 were unread
    expect(count).toBe(2);
  });

  it("should return 0 for non-existent user", async () => {
    const count = await markAllRead("non-existent-user");
    expect(count).toBe(0);
  });
});

// =============================================================================
// GET UNREAD COUNT TESTS
// =============================================================================

describe("getUnreadCount", () => {
  it("should return count of unread notifications", async () => {
    await createNotification(createMockNotificationData());
    await createNotification(createMockNotificationData());

    const count = await getUnreadCount(TEST_USER_ID);

    expect(count).toBe(2);
  });

  it("should filter by campaign", async () => {
    await createNotification(createMockNotificationData({ campaignId: "campaign-1" }));
    await createNotification(createMockNotificationData({ campaignId: "campaign-2" }));
    await createNotification(createMockNotificationData({ campaignId: "campaign-1" }));

    const count = await getUnreadCount(TEST_USER_ID, "campaign-1");

    expect(count).toBe(2);
  });

  it("should return 0 for non-existent user", async () => {
    const count = await getUnreadCount("non-existent-user");
    expect(count).toBe(0);
  });

  it("should not count read notifications", async () => {
    const n1 = await createNotification(createMockNotificationData());
    await createNotification(createMockNotificationData());

    // Mark one as read
    await updateNotification(TEST_USER_ID, n1.id, { read: true });

    const count = await getUnreadCount(TEST_USER_ID);

    expect(count).toBe(1);
  });
});
