/**
 * Unit tests for activity.ts storage module
 *
 * Tests campaign activity logging with isolated temp directories.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import type { CampaignActivityEvent } from "@/lib/types/campaign";

let testDir: string;

// Dynamic imports so we can set ACTIVITY_DATA_DIR before module evaluation
let logActivity: typeof import("../activity").logActivity;
let getCampaignActivity: typeof import("../activity").getCampaignActivity;
let getCampaignActivityCount: typeof import("../activity").getCampaignActivityCount;

const TEST_CAMPAIGN_ID = "test-campaign-activity";

// =============================================================================
// SETUP & TEARDOWN
// =============================================================================

beforeEach(async () => {
  testDir = await fs.mkdtemp(path.join(os.tmpdir(), "activity-storage-test-"));
  process.env.ACTIVITY_DATA_DIR = testDir;

  vi.resetModules();
  const mod = await import("../activity");
  logActivity = mod.logActivity;
  getCampaignActivity = mod.getCampaignActivity;
  getCampaignActivityCount = mod.getCampaignActivityCount;
});

afterEach(async () => {
  delete process.env.ACTIVITY_DATA_DIR;
  try {
    await fs.rm(testDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
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

    const result = await logActivity(eventData);

    expect(result.id).toBeDefined();
    expect(result.timestamp).toBeDefined();
    expect(result.campaignId).toBe(TEST_CAMPAIGN_ID);
    expect(result.type).toBe("player_joined");
  });

  it("should generate unique ID for each activity", async () => {
    const event1 = await logActivity(createMockActivityEvent());
    const event2 = await logActivity(createMockActivityEvent());

    expect(event1.id).not.toBe(event2.id);
  });

  it("should add new events to the beginning of the array", async () => {
    await logActivity(createMockActivityEvent({ description: "First event" }));
    await logActivity(createMockActivityEvent({ description: "Second event" }));

    const activities = await getCampaignActivity(TEST_CAMPAIGN_ID);

    expect(activities[0].description).toBe("Second event");
    expect(activities[1].description).toBe("First event");
  });

  it("should limit entries to 500", async () => {
    // Create a file with 500 entries directly
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

    const filePath = path.join(testDir, `${TEST_CAMPAIGN_ID}.json`);
    await fs.writeFile(filePath, JSON.stringify(existingEntries, null, 2), "utf-8");

    // Add one more event
    await logActivity(createMockActivityEvent({ description: "New event beyond limit" }));

    const count = await getCampaignActivityCount(TEST_CAMPAIGN_ID);

    expect(count).toBe(500);
  });

  it("should set timestamp to current time", async () => {
    const beforeTime = new Date().toISOString();

    const result = await logActivity(createMockActivityEvent());

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
    const result = await getCampaignActivity("non-existent-campaign");
    expect(result).toEqual([]);
  });

  it("should return activities with default pagination", async () => {
    // Create some activities
    for (let i = 0; i < 60; i++) {
      await logActivity(createMockActivityEvent({ description: `Event ${i}` }));
    }

    const result = await getCampaignActivity(TEST_CAMPAIGN_ID);

    // Default limit is 50
    expect(result.length).toBe(50);
  });

  it("should respect limit parameter", async () => {
    for (let i = 0; i < 20; i++) {
      await logActivity(createMockActivityEvent({ description: `Event ${i}` }));
    }

    const result = await getCampaignActivity(TEST_CAMPAIGN_ID, 10);

    expect(result.length).toBe(10);
  });

  it("should respect offset parameter", async () => {
    for (let i = 0; i < 10; i++) {
      await logActivity(createMockActivityEvent({ description: `Event ${i}` }));
    }

    const result = await getCampaignActivity(TEST_CAMPAIGN_ID, 5, 3);

    expect(result.length).toBe(5);
  });
});

// =============================================================================
// GET CAMPAIGN ACTIVITY COUNT TESTS
// =============================================================================

describe("getCampaignActivityCount", () => {
  it("should return 0 for non-existent campaign", async () => {
    const count = await getCampaignActivityCount("non-existent-campaign");
    expect(count).toBe(0);
  });

  it("should return correct count", async () => {
    // Create 5 activities
    for (let i = 0; i < 5; i++) {
      await logActivity(createMockActivityEvent());
    }

    const count = await getCampaignActivityCount(TEST_CAMPAIGN_ID);

    expect(count).toBe(5);
  });

  it("should return total count regardless of pagination", async () => {
    // Create 100 activities
    for (let i = 0; i < 100; i++) {
      await logActivity(createMockActivityEvent());
    }

    const count = await getCampaignActivityCount(TEST_CAMPAIGN_ID);

    expect(count).toBe(100);
  });
});
