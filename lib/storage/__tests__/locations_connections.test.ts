/**
 * Tests for location connection storage
 *
 * Uses isolated temp directories via LOCATIONS_CAMPAIGNS_DATA_DIR env var.
 */

import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

let testDir: string;

// Dynamic imports so we can set LOCATIONS_CAMPAIGNS_DATA_DIR before module evaluation
let createLocationConnection: typeof import("../locations").createLocationConnection;
let getLocationConnections: typeof import("../locations").getLocationConnections;
let deleteLocationConnection: typeof import("../locations").deleteLocationConnection;

describe("Location Connection Storage", () => {
  const campaignId = "test-campaign-conn";

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), "locations-conn-storage-test-"));
    process.env.LOCATIONS_CAMPAIGNS_DATA_DIR = testDir;

    vi.resetModules();
    const mod = await import("../locations");
    createLocationConnection = mod.createLocationConnection;
    getLocationConnections = mod.getLocationConnections;
    deleteLocationConnection = mod.deleteLocationConnection;
  });

  afterEach(async () => {
    delete process.env.LOCATIONS_CAMPAIGNS_DATA_DIR;
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
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
