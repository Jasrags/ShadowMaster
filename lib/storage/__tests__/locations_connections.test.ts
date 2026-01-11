/**
 * Tests for location connection storage
 */

import { promises as fs } from "fs";
import path from "path";
import { describe, it, expect, afterEach } from "vitest";
import {
  createLocationConnection,
  getLocationConnections,
  deleteLocationConnection,
} from "../locations";

const TEST_DATA_DIR = path.join(process.cwd(), "data", "campaigns");

describe("Location Connection Storage", () => {
  const timestamp = Date.now();
  const campaignId = `test-campaign-conn-${timestamp}`;

  afterEach(async () => {
    // Clean up test directory
    try {
      const campaignDir = path.join(TEST_DATA_DIR, campaignId);
      await fs.rm(campaignDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  it("should create and retrieve a location connection", async () => {
    const conn = await createLocationConnection(campaignId, {
      fromLocationId: "loc-1",
      toLocationId: "loc-2",
      connectionType: "physical",
      bidirectional: true,
      description: "A heavy blast door connection",
    });

    expect(conn).toBeDefined();
    expect(conn.id).toBeDefined();
    expect(conn.fromLocationId).toBe("loc-1");
    expect(conn.toLocationId).toBe("loc-2");
    expect(conn.connectionType).toBe("physical");

    const connections = await getLocationConnections(campaignId);
    expect(connections.length).toBe(1);
    expect(connections[0].id).toBe(conn.id);
  });

  it("should filter connections by locationId", async () => {
    await createLocationConnection(campaignId, {
      fromLocationId: "loc-1",
      toLocationId: "loc-2",
      connectionType: "physical",
      bidirectional: true,
    });
    await createLocationConnection(campaignId, {
      fromLocationId: "loc-2",
      toLocationId: "loc-3",
      connectionType: "astral",
      bidirectional: false,
    });
    await createLocationConnection(campaignId, {
      fromLocationId: "loc-4",
      toLocationId: "loc-5",
      connectionType: "matrix",
      bidirectional: false,
    });

    const loc2Connections = await getLocationConnections(campaignId, "loc-2");
    expect(loc2Connections.length).toBe(2);

    const loc4Connections = await getLocationConnections(campaignId, "loc-4");
    expect(loc4Connections.length).toBe(1);
    expect(loc4Connections[0].connectionType).toBe("matrix");
  });

  it("should delete a connection", async () => {
    const conn = await createLocationConnection(campaignId, {
      fromLocationId: "loc-1",
      toLocationId: "loc-2",
      connectionType: "physical",
      bidirectional: true,
    });

    await deleteLocationConnection(campaignId, conn.id);
    const connections = await getLocationConnections(campaignId);
    expect(connections.length).toBe(0);
  });
});
