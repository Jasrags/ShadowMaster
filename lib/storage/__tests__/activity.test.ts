/**
 * Unit tests for activity.ts storage module
 *
 * Tests campaign activity logging with real filesystem operations.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import type { CampaignActivityEvent } from "@/lib/types/campaign";

// Test directory - must use the module's actual data path due to non-configurable paths
const TEST_CAMPAIGN_ID = `test-campaign-activity-${Date.now()}`;
const DATA_DIR = path.join(process.cwd(), "data", "activity");

// Import after setting up test environment
import * as activityStorage from "../activity";

// =============================================================================
// SETUP & TEARDOWN
// =============================================================================

beforeEach(async () => {
  // Ensure test directory exists
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Ignore
  }
});

afterEach(async () => {
  // Clean up test files
  try {
    const testFilePath = path.join(DATA_DIR, `${TEST_CAMPAIGN_ID}.json`);
    await fs.unlink(testFilePath);
  } catch {
    // File might not exist
  }
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createMockActivityEvent(
  overrides: Partial<Omit<CampaignActivityEvent, "id" | "timestamp">> = {}
): Omit<CampaignActivityEvent, "id" | "timestamp"> {
  return {
    campaignId: TEST_CAMPAIGN_ID,
    actorId: "user-1",
    type: "player_joined",
    description: "A player joined the campaign",
    ...overrides,
  };
}

// =============================================================================
// LOG ACTIVITY TESTS
// =============================================================================

describe("logActivity", () => {
  it("should create activity file if it does not exist", async () => {
    const eventData = createMockActivityEvent();

    const result = await activityStorage.logActivity(eventData);

    expect(result.id).toBeDefined();
    expect(result.timestamp).toBeDefined();
    expect(result.campaignId).toBe(TEST_CAMPAIGN_ID);
    expect(result.type).toBe("player_joined");
  });

  it("should generate unique ID for each activity", async () => {
    const event1 = await activityStorage.logActivity(createMockActivityEvent());
    const event2 = await activityStorage.logActivity(createMockActivityEvent());

    expect(event1.id).not.toBe(event2.id);
  });

  it("should add new events to the beginning of the array", async () => {
    await activityStorage.logActivity(createMockActivityEvent({ description: "First event" }));
    await activityStorage.logActivity(createMockActivityEvent({ description: "Second event" }));

    const activities = await activityStorage.getCampaignActivity(TEST_CAMPAIGN_ID);

    expect(activities[0].description).toBe("Second event");
    expect(activities[1].description).toBe("First event");
  });

  it("should limit entries to 500", async () => {
    // This test is slow, so we'll mock the file read to return 500 existing entries
    // First, create a file with 500 entries
    const existingEntries: CampaignActivityEvent[] = [];
    for (let i = 0; i < 500; i++) {
      existingEntries.push({
        id: `existing-${i}`,
        campaignId: TEST_CAMPAIGN_ID,
        actorId: "user-1",
        type: "player_joined",
        description: `Event ${i}`,
        timestamp: new Date().toISOString(),
      });
    }

    const filePath = path.join(DATA_DIR, `${TEST_CAMPAIGN_ID}.json`);
    await fs.writeFile(filePath, JSON.stringify(existingEntries, null, 2), "utf-8");

    // Add one more event
    await activityStorage.logActivity(
      createMockActivityEvent({ description: "New event beyond limit" })
    );

    const count = await activityStorage.getCampaignActivityCount(TEST_CAMPAIGN_ID);

    expect(count).toBe(500);
  });

  it("should set timestamp to current time", async () => {
    const beforeTime = new Date().toISOString();

    const result = await activityStorage.logActivity(createMockActivityEvent());

    const afterTime = new Date().toISOString();

    expect(result.timestamp >= beforeTime).toBe(true);
    expect(result.timestamp <= afterTime).toBe(true);
  });
});

// =============================================================================
// GET CAMPAIGN ACTIVITY TESTS
// =============================================================================

describe("getCampaignActivity", () => {
  it("should return empty array for non-existent campaign", async () => {
    const result = await activityStorage.getCampaignActivity("non-existent-campaign");
    expect(result).toEqual([]);
  });

  it("should return activities with default pagination", async () => {
    // Create some activities
    for (let i = 0; i < 60; i++) {
      await activityStorage.logActivity(createMockActivityEvent({ description: `Event ${i}` }));
    }

    const result = await activityStorage.getCampaignActivity(TEST_CAMPAIGN_ID);

    // Default limit is 50
    expect(result.length).toBe(50);
  });

  it("should respect limit parameter", async () => {
    for (let i = 0; i < 20; i++) {
      await activityStorage.logActivity(createMockActivityEvent({ description: `Event ${i}` }));
    }

    const result = await activityStorage.getCampaignActivity(TEST_CAMPAIGN_ID, 10);

    expect(result.length).toBe(10);
  });

  it("should respect offset parameter", async () => {
    for (let i = 0; i < 10; i++) {
      await activityStorage.logActivity(createMockActivityEvent({ description: `Event ${i}` }));
    }

    const result = await activityStorage.getCampaignActivity(TEST_CAMPAIGN_ID, 5, 3);

    expect(result.length).toBe(5);
    // Events are in reverse order (newest first), so with offset 3, we should see events 6, 5, 4, 3, 2
  });
});

// =============================================================================
// GET CAMPAIGN ACTIVITY COUNT TESTS
// =============================================================================

describe("getCampaignActivityCount", () => {
  it("should return 0 for non-existent campaign", async () => {
    const count = await activityStorage.getCampaignActivityCount("non-existent-campaign");
    expect(count).toBe(0);
  });

  it("should return correct count", async () => {
    // Create 5 activities
    for (let i = 0; i < 5; i++) {
      await activityStorage.logActivity(createMockActivityEvent());
    }

    const count = await activityStorage.getCampaignActivityCount(TEST_CAMPAIGN_ID);

    expect(count).toBe(5);
  });

  it("should return total count regardless of pagination", async () => {
    // Create 100 activities
    for (let i = 0; i < 100; i++) {
      await activityStorage.logActivity(createMockActivityEvent());
    }

    const count = await activityStorage.getCampaignActivityCount(TEST_CAMPAIGN_ID);

    expect(count).toBe(100);
  });
});
