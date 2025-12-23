/**
 * Campaign Activity Storage
 * 
 * Stores activity logs for campaigns in data/activity/{campaignId}.json
 */

import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { CampaignActivityEvent } from "../types/campaign";

const DATA_DIR = path.join(process.cwd(), "data", "activity");

/**
 * Ensures the activity directory exists
 */
async function ensureDataDirectory(): Promise<void> {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
            throw error;
        }
    }
}

/**
 * Get the file path for a campaign's activity log
 */
function getFilePath(campaignId: string): string {
    return path.join(DATA_DIR, `${campaignId}.json`);
}

/**
 * Log a new activity event
 */
export async function logActivity(
    activity: Omit<CampaignActivityEvent, "id" | "timestamp">
): Promise<CampaignActivityEvent> {
    await ensureDataDirectory();
    const campaignId = activity.campaignId;
    const filePath = getFilePath(campaignId);
    
    let entries: CampaignActivityEvent[] = [];
    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        entries = JSON.parse(fileContent) as CampaignActivityEvent[];
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            // Re-throw if it's not a "file not found" error
            throw error;
        }
    }

    const newEvent: CampaignActivityEvent = {
        ...activity,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
    };

    // Add to the beginning of the array (most recent first)
    entries.unshift(newEvent);
    
    // Limit to 500 entries to prevent files growing too large
    if (entries.length > 500) {
        entries = entries.slice(0, 500);
    }

    await fs.writeFile(filePath, JSON.stringify(entries, null, 2), "utf-8");
    return newEvent;
}

/**
 * Get activity log for a campaign
 */
export async function getCampaignActivity(
    campaignId: string,
    limit: number = 50,
    offset: number = 0
): Promise<CampaignActivityEvent[]> {
    try {
        const filePath = getFilePath(campaignId);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const entries = JSON.parse(fileContent) as CampaignActivityEvent[];
        return entries.slice(offset, offset + limit);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return [];
        }
        throw error;
    }
}

/**
 * Get total activity count for a campaign
 */
export async function getCampaignActivityCount(campaignId: string): Promise<number> {
    try {
        const filePath = getFilePath(campaignId);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const entries = JSON.parse(fileContent) as CampaignActivityEvent[];
        return entries.length;
    } catch {
        return 0;
    }
}
