/**
 * Unit tests for notifications.ts storage module
 *
 * Tests notification CRUD operations with real filesystem.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import type { CampaignNotification } from "@/lib/types/campaign";

// Test identifiers
const TEST_USER_ID = `test-user-notifications-${Date.now()}`;
const DATA_DIR = path.join(process.cwd(), "data", "notifications");

// Import the storage module
import * as notificationStorage from "../notifications";

// =============================================================================
// SETUP & TEARDOWN
// =============================================================================

beforeEach(async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Ignore
  }
});

afterEach(async () => {
  try {
    const testFilePath = path.join(DATA_DIR, `${TEST_USER_ID}.json`);
    await fs.unlink(testFilePath);
  } catch {
    // File might not exist
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

    const result = await notificationStorage.createNotification(notificationData);

    expect(result.id).toBeDefined();
    expect(result.userId).toBe(TEST_USER_ID);
    expect(result.title).toBe("Character Joined");
    expect(result.read).toBe(false);
    expect(result.dismissed).toBe(false);
  });

  it("should set createdAt timestamp", async () => {
    const beforeTime = new Date().toISOString();

    const result = await notificationStorage.createNotification(createMockNotificationData());

    const afterTime = new Date().toISOString();

    expect(result.createdAt >= beforeTime).toBe(true);
    expect(result.createdAt <= afterTime).toBe(true);
  });

  it("should add new notifications to the beginning", async () => {
    await notificationStorage.createNotification(createMockNotificationData({ title: "First" }));
    await notificationStorage.createNotification(createMockNotificationData({ title: "Second" }));

    const notifications = await notificationStorage.getUserNotifications(TEST_USER_ID);

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

    const filePath = path.join(DATA_DIR, `${TEST_USER_ID}.json`);
    await fs.writeFile(filePath, JSON.stringify(existingNotifications, null, 2), "utf-8");

    // Add one more
    await notificationStorage.createNotification(
      createMockNotificationData({ title: "New beyond limit" })
    );

    const notifications = await notificationStorage.getUserNotifications(TEST_USER_ID, {
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
    const result = await notificationStorage.getUserNotifications("non-existent-user");
    expect(result).toEqual([]);
  });

  it("should return notifications with default pagination", async () => {
    for (let i = 0; i < 60; i++) {
      await notificationStorage.createNotification(
        createMockNotificationData({ title: `Notification ${i}` })
      );
    }

    const result = await notificationStorage.getUserNotifications(TEST_USER_ID);

    // Default limit is 50
    expect(result.length).toBe(50);
  });

  it("should filter by campaignId", async () => {
    await notificationStorage.createNotification(
      createMockNotificationData({ campaignId: "campaign-1", title: "Campaign 1" })
    );
    await notificationStorage.createNotification(
      createMockNotificationData({ campaignId: "campaign-2", title: "Campaign 2" })
    );

    const result = await notificationStorage.getUserNotifications(TEST_USER_ID, {
      campaignId: "campaign-1",
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Campaign 1");
  });

  it("should filter unreadOnly", async () => {
    const n1 = await notificationStorage.createNotification(
      createMockNotificationData({ title: "Unread" })
    );
    await notificationStorage.createNotification(
      createMockNotificationData({ title: "To be read" })
    );

    // Mark the second one as read
    await notificationStorage.updateNotification(TEST_USER_ID, n1.id, { read: true });

    const result = await notificationStorage.getUserNotifications(TEST_USER_ID, {
      unreadOnly: true,
    });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("To be read");
  });

  it("should respect limit parameter", async () => {
    for (let i = 0; i < 20; i++) {
      await notificationStorage.createNotification(createMockNotificationData());
    }

    const result = await notificationStorage.getUserNotifications(TEST_USER_ID, { limit: 5 });

    expect(result.length).toBe(5);
  });

  it("should respect offset parameter", async () => {
    for (let i = 0; i < 10; i++) {
      await notificationStorage.createNotification(
        createMockNotificationData({ title: `Notification ${i}` })
      );
    }

    const result = await notificationStorage.getUserNotifications(TEST_USER_ID, {
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
    const notification = await notificationStorage.createNotification(createMockNotificationData());

    const beforeTime = new Date().toISOString();
    const result = await notificationStorage.updateNotification(TEST_USER_ID, notification.id, {
      read: true,
    });
    const afterTime = new Date().toISOString();

    expect(result?.read).toBe(true);
    expect(result?.readAt).toBeDefined();
    expect(result!.readAt! >= beforeTime).toBe(true);
    expect(result!.readAt! <= afterTime).toBe(true);
  });

  it("should dismiss notification", async () => {
    const notification = await notificationStorage.createNotification(createMockNotificationData());

    const result = await notificationStorage.updateNotification(TEST_USER_ID, notification.id, {
      dismissed: true,
    });

    expect(result?.dismissed).toBe(true);
  });

  it("should return null for non-existent notification", async () => {
    const result = await notificationStorage.updateNotification(TEST_USER_ID, "non-existent", {
      read: true,
    });

    expect(result).toBeNull();
  });

  it("should return null for non-existent user", async () => {
    const result = await notificationStorage.updateNotification(
      "non-existent-user",
      "non-existent",
      { read: true }
    );

    expect(result).toBeNull();
  });
});

// =============================================================================
// MARK ALL READ TESTS
// =============================================================================

describe("markAllRead", () => {
  it("should mark all notifications as read", async () => {
    await notificationStorage.createNotification(createMockNotificationData({ title: "First" }));
    await notificationStorage.createNotification(createMockNotificationData({ title: "Second" }));

    const count = await notificationStorage.markAllRead(TEST_USER_ID);

    expect(count).toBe(2);

    const notifications = await notificationStorage.getUserNotifications(TEST_USER_ID);
    expect(notifications.every((n) => n.read)).toBe(true);
  });

  it("should filter by campaign when marking all read", async () => {
    await notificationStorage.createNotification(
      createMockNotificationData({ campaignId: "campaign-1" })
    );
    await notificationStorage.createNotification(
      createMockNotificationData({ campaignId: "campaign-2" })
    );

    const count = await notificationStorage.markAllRead(TEST_USER_ID, "campaign-1");

    expect(count).toBe(1);

    const notifications = await notificationStorage.getUserNotifications(TEST_USER_ID);
    const campaign1 = notifications.find((n) => n.campaignId === "campaign-1");
    const campaign2 = notifications.find((n) => n.campaignId === "campaign-2");

    expect(campaign1?.read).toBe(true);
    expect(campaign2?.read).toBe(false);
  });

  it("should return count of marked notifications", async () => {
    // Create 3 unread notifications
    await notificationStorage.createNotification(createMockNotificationData());
    await notificationStorage.createNotification(createMockNotificationData());
    const n3 = await notificationStorage.createNotification(createMockNotificationData());

    // Mark one as already read
    await notificationStorage.updateNotification(TEST_USER_ID, n3.id, { read: true });

    const count = await notificationStorage.markAllRead(TEST_USER_ID);

    // Only 2 were unread
    expect(count).toBe(2);
  });

  it("should return 0 for non-existent user", async () => {
    const count = await notificationStorage.markAllRead("non-existent-user");
    expect(count).toBe(0);
  });
});

// =============================================================================
// GET UNREAD COUNT TESTS
// =============================================================================

describe("getUnreadCount", () => {
  it("should return count of unread notifications", async () => {
    await notificationStorage.createNotification(createMockNotificationData());
    await notificationStorage.createNotification(createMockNotificationData());

    const count = await notificationStorage.getUnreadCount(TEST_USER_ID);

    expect(count).toBe(2);
  });

  it("should filter by campaign", async () => {
    await notificationStorage.createNotification(
      createMockNotificationData({ campaignId: "campaign-1" })
    );
    await notificationStorage.createNotification(
      createMockNotificationData({ campaignId: "campaign-2" })
    );
    await notificationStorage.createNotification(
      createMockNotificationData({ campaignId: "campaign-1" })
    );

    const count = await notificationStorage.getUnreadCount(TEST_USER_ID, "campaign-1");

    expect(count).toBe(2);
  });

  it("should return 0 for non-existent user", async () => {
    const count = await notificationStorage.getUnreadCount("non-existent-user");
    expect(count).toBe(0);
  });

  it("should not count read notifications", async () => {
    const n1 = await notificationStorage.createNotification(createMockNotificationData());
    await notificationStorage.createNotification(createMockNotificationData());

    // Mark one as read
    await notificationStorage.updateNotification(TEST_USER_ID, n1.id, { read: true });

    const count = await notificationStorage.getUnreadCount(TEST_USER_ID);

    expect(count).toBe(1);
  });
});
