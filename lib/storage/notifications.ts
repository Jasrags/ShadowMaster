/**
 * Notification Storage
 *
 * Stores user notifications in data/notifications/{userId}.json
 */

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { CampaignNotification } from "../types/campaign";
import { sanitizePathSegment, withFileLock, writeJsonFile } from "./base";

function getDataDir(): string {
  return process.env.NOTIFICATION_DATA_DIR || path.join(process.cwd(), "data", "notifications");
}

/**
 * Ensures the notification directory exists
 */
async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.mkdir(getDataDir(), { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

/**
 * Get the file path for a user's notifications
 */
function getFilePath(userId: string): string {
  return path.join(getDataDir(), `${sanitizePathSegment(userId)}.json`);
}

/**
 * Create a new notification for a user
 */
export async function createNotification(
  notification: Omit<CampaignNotification, "id" | "createdAt" | "read" | "dismissed">
): Promise<CampaignNotification> {
  await ensureDataDirectory();
  const userId = notification.userId;
  const filePath = getFilePath(userId);

  return withFileLock(filePath, async () => {
    let notifications: CampaignNotification[] = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      notifications = JSON.parse(fileContent) as CampaignNotification[];
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }

    const newNotification: CampaignNotification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      read: false,
      dismissed: false,
    };

    // Add to the beginning of the array (most recent first)
    notifications.unshift(newNotification);

    // Limit to 100 notifications to keep files manageable
    if (notifications.length > 100) {
      notifications = notifications.slice(0, 100);
    }

    await writeJsonFile(filePath, notifications);
    return newNotification;
  });
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(
  userId: string,
  options: { campaignId?: string; unreadOnly?: boolean; limit?: number; offset?: number } = {}
): Promise<{ notifications: CampaignNotification[]; total: number }> {
  try {
    const filePath = getFilePath(userId);
    const fileContent = await fs.readFile(filePath, "utf-8");
    let notifications = JSON.parse(fileContent) as CampaignNotification[];

    if (options.campaignId) {
      notifications = notifications.filter((n) => n.campaignId === options.campaignId);
    }

    if (options.unreadOnly) {
      notifications = notifications.filter((n) => !n.read);
    }

    const total = notifications.length;
    const offset = options.offset || 0;
    const limit = options.limit || 50;

    return { notifications: notifications.slice(offset, offset + limit), total };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { notifications: [], total: 0 };
    }
    throw error;
  }
}

/**
 * Update a specific notification (mark read/dismiss)
 */
export async function updateNotification(
  userId: string,
  notificationId: string,
  updates: Partial<Pick<CampaignNotification, "read" | "dismissed">>
): Promise<CampaignNotification | null> {
  const filePath = getFilePath(userId);
  try {
    return await withFileLock(filePath, async () => {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const notifications = JSON.parse(fileContent) as CampaignNotification[];

      const index = notifications.findIndex((n) => n.id === notificationId);
      if (index === -1) return null;

      const now = new Date().toISOString();
      notifications[index] = {
        ...notifications[index],
        ...updates,
        readAt: updates.read && !notifications[index].read ? now : notifications[index].readAt,
      };

      await writeJsonFile(filePath, notifications);
      return notifications[index];
    });
  } catch {
    return null;
  }
}

/**
 * Mark all notifications for a user as read
 */
export async function markAllRead(userId: string, campaignId?: string): Promise<number> {
  const filePath = getFilePath(userId);
  try {
    return await withFileLock(filePath, async () => {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const notifications = JSON.parse(fileContent) as CampaignNotification[];

      const now = new Date().toISOString();
      let count = 0;

      const updated = notifications.map((n) => {
        if (!n.read && (!campaignId || n.campaignId === campaignId)) {
          count++;
          return { ...n, read: true, readAt: now };
        }
        return n;
      });

      if (count > 0) {
        await writeJsonFile(filePath, updated);
      }
      return count;
    });
  } catch {
    return 0;
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string, campaignId?: string): Promise<number> {
  try {
    const filePath = getFilePath(userId);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const notifications = JSON.parse(fileContent) as CampaignNotification[];

    return notifications.filter((n) => !n.read && (!campaignId || n.campaignId === campaignId))
      .length;
  } catch {
    return 0;
  }
}
