/**
 * Tests for /api/health endpoint
 *
 * Tests health check functionality including status and timestamp.
 */

import { describe, it, expect } from "vitest";
import { GET } from "../route";

describe("GET /api/health", () => {
  it("should return 200 with status ok", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("ok");
  });

  it("should return valid ISO timestamp", async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.timestamp).toBeDefined();
    // Verify it's a valid ISO 8601 timestamp
    const timestamp = new Date(data.timestamp);
    expect(timestamp.toISOString()).toBe(data.timestamp);
    // Verify it's recent (within last minute)
    const now = Date.now();
    const timestampMs = timestamp.getTime();
    expect(now - timestampMs).toBeLessThan(60000);
  });
});
