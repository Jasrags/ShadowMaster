/**
 * Tests that all storage modules use atomic writes (write-to-temp-then-rename)
 * instead of direct fs.writeFile calls.
 *
 * Issue: #633 — Non-atomic writes in storage layer
 *
 * These tests verify that logActivity, createNotification, updateNotification,
 * markAllRead, createLocationTemplate, incrementTemplateUsage,
 * createLocationConnection, and saveCampaignAsTemplate all use writeJsonFile
 * (which performs atomic writes) instead of raw fs.writeFile.
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import { promises as fs } from "fs";

// Mock fs before importing modules under test
vi.mock("fs", () => {
  const actual = vi.importActual("fs");
  return {
    ...actual,
    promises: {
      ...(actual as typeof import("fs")).promises,
      mkdir: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn(),
      writeFile: vi.fn().mockResolvedValue(undefined),
      rename: vi.fn().mockResolvedValue(undefined),
      unlink: vi.fn().mockResolvedValue(undefined),
      readdir: vi.fn().mockResolvedValue([]),
      access: vi.fn().mockResolvedValue(undefined),
      stat: vi.fn().mockResolvedValue({ isDirectory: () => true }),
    },
  };
});

vi.mock("uuid", () => ({
  v4: () => "test-uuid-1234",
}));

// Mock validation module used by locations and campaigns
vi.mock("@/lib/storage/validation", () => ({
  validateLocationData: vi.fn().mockReturnValue({ valid: true, errors: [] }),
  validateLocationTemplateData: vi.fn().mockReturnValue({ valid: true, errors: [] }),
  validateCampaignTemplateData: vi.fn().mockReturnValue({ valid: true, errors: [] }),
  assertValid: vi.fn(),
}));

// Mock campaign dependencies
vi.mock("@/lib/storage/characters", () => ({
  getAllCharacters: vi.fn().mockResolvedValue([]),
  updateCharacter: vi.fn(),
}));

vi.mock("@/lib/storage/editions", () => ({
  getEdition: vi.fn().mockResolvedValue({ id: "sr5", code: "sr5" }),
}));

vi.mock("@/lib/rules/campaign-validation", () => ({
  validateCharacterCampaignCompliance: vi.fn(),
}));

const mockedFs = vi.mocked(fs);

/**
 * Helper: assert that a write operation used the atomic pattern
 * (writeFile to .tmp path, then rename to final path).
 */
function assertAtomicWrite(finalPath: string): void {
  const tmpPath = `${finalPath}.tmp`;

  // Find the writeFile call that wrote to the .tmp path
  const writeCall = mockedFs.writeFile.mock.calls.find(
    (call) => typeof call[0] === "string" && (call[0] as string).endsWith(".tmp")
  );
  expect(writeCall, `Expected writeFile to a .tmp file for atomic write to ${finalPath}`).toBeDefined();
  expect(writeCall![0]).toBe(tmpPath);

  // Find the rename call from .tmp to final
  const renameCall = mockedFs.rename.mock.calls.find(
    (call) => call[0] === tmpPath && call[1] === finalPath
  );
  expect(renameCall, `Expected rename from ${tmpPath} to ${finalPath}`).toBeDefined();

  // Ensure no direct writeFile to the final path
  const directWrite = mockedFs.writeFile.mock.calls.find(
    (call) => call[0] === finalPath
  );
  expect(directWrite, `Found non-atomic direct write to ${finalPath}`).toBeUndefined();
}

describe("Atomic writes in storage modules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock: readFile returns ENOENT (file not found)
    mockedFs.readFile.mockRejectedValue(
      Object.assign(new Error("ENOENT"), { code: "ENOENT" })
    );
    mockedFs.mkdir.mockResolvedValue(undefined);
    mockedFs.writeFile.mockResolvedValue(undefined);
    mockedFs.rename.mockResolvedValue(undefined);
  });

  describe("activity.ts — logActivity", () => {
    test("uses atomic write pattern", async () => {
      const { logActivity } = await import("@/lib/storage/activity");

      await logActivity({
        campaignId: "campaign-1",
        type: "character_joined",
        userId: "user-1",
        details: "Test activity",
      });

      // Should have written to a .tmp file and renamed
      const writeCalls = mockedFs.writeFile.mock.calls;
      expect(writeCalls.length).toBeGreaterThan(0);

      const tmpWrite = writeCalls.find(
        (call) => typeof call[0] === "string" && (call[0] as string).endsWith(".tmp")
      );
      expect(tmpWrite, "logActivity should write to .tmp file for atomic write").toBeDefined();
      expect(mockedFs.rename).toHaveBeenCalled();
    });
  });

  describe("notifications.ts — createNotification", () => {
    test("uses atomic write pattern", async () => {
      const { createNotification } = await import("@/lib/storage/notifications");

      await createNotification({
        userId: "user-1",
        campaignId: "campaign-1",
        type: "invite",
        title: "Test",
        message: "Test notification",
      });

      const writeCalls = mockedFs.writeFile.mock.calls;
      const tmpWrite = writeCalls.find(
        (call) => typeof call[0] === "string" && (call[0] as string).endsWith(".tmp")
      );
      expect(tmpWrite, "createNotification should write to .tmp file for atomic write").toBeDefined();
      expect(mockedFs.rename).toHaveBeenCalled();
    });
  });

  describe("notifications.ts — updateNotification", () => {
    test("uses atomic write pattern", async () => {
      const { updateNotification } = await import("@/lib/storage/notifications");

      // Mock readFile to return existing notifications
      mockedFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            id: "notif-1",
            userId: "user-1",
            campaignId: "campaign-1",
            type: "invite",
            title: "Test",
            message: "msg",
            read: false,
            dismissed: false,
            createdAt: "2024-01-01",
          },
        ]) as never
      );

      await updateNotification("user-1", "notif-1", { read: true });

      const writeCalls = mockedFs.writeFile.mock.calls;
      const tmpWrite = writeCalls.find(
        (call) => typeof call[0] === "string" && (call[0] as string).endsWith(".tmp")
      );
      expect(tmpWrite, "updateNotification should write to .tmp file for atomic write").toBeDefined();
      expect(mockedFs.rename).toHaveBeenCalled();
    });
  });

  describe("notifications.ts — markAllRead", () => {
    test("uses atomic write pattern", async () => {
      const { markAllRead } = await import("@/lib/storage/notifications");

      mockedFs.readFile.mockResolvedValue(
        JSON.stringify([
          {
            id: "notif-1",
            userId: "user-1",
            campaignId: "campaign-1",
            type: "invite",
            title: "Test",
            message: "msg",
            read: false,
            dismissed: false,
            createdAt: "2024-01-01",
          },
        ]) as never
      );

      await markAllRead("user-1");

      const writeCalls = mockedFs.writeFile.mock.calls;
      const tmpWrite = writeCalls.find(
        (call) => typeof call[0] === "string" && (call[0] as string).endsWith(".tmp")
      );
      expect(tmpWrite, "markAllRead should write to .tmp file for atomic write").toBeDefined();
      expect(mockedFs.rename).toHaveBeenCalled();
    });
  });

  describe("locations.ts — createLocationTemplate", () => {
    test("uses atomic write pattern", async () => {
      const { createLocationTemplate } = await import("@/lib/storage/locations");

      await createLocationTemplate("user-1", {
        name: "Test Template",
        type: "building",
        templateData: {},
        isPublic: false,
      });

      const writeCalls = mockedFs.writeFile.mock.calls;
      const tmpWrite = writeCalls.find(
        (call) => typeof call[0] === "string" && (call[0] as string).endsWith(".tmp")
      );
      expect(tmpWrite, "createLocationTemplate should write to .tmp file for atomic write").toBeDefined();
      expect(mockedFs.rename).toHaveBeenCalled();
    });
  });

  describe("locations.ts — incrementTemplateUsage", () => {
    test("uses atomic write pattern", async () => {
      const { incrementTemplateUsage } = await import("@/lib/storage/locations");

      mockedFs.readFile.mockResolvedValue(
        JSON.stringify({
          id: "template-1",
          name: "Test",
          type: "building",
          templateData: {},
          createdBy: "user-1",
          isPublic: false,
          usageCount: 0,
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        }) as never
      );

      await incrementTemplateUsage("template-1");

      const writeCalls = mockedFs.writeFile.mock.calls;
      const tmpWrite = writeCalls.find(
        (call) => typeof call[0] === "string" && (call[0] as string).endsWith(".tmp")
      );
      expect(tmpWrite, "incrementTemplateUsage should write to .tmp file for atomic write").toBeDefined();
      expect(mockedFs.rename).toHaveBeenCalled();
    });
  });

  describe("locations.ts — createLocationConnection", () => {
    test("uses atomic write pattern", async () => {
      const { createLocationConnection } = await import("@/lib/storage/locations");

      await createLocationConnection("campaign-1", {
        fromLocationId: "loc-1",
        toLocationId: "loc-2",
        type: "road",
      });

      const writeCalls = mockedFs.writeFile.mock.calls;
      const tmpWrite = writeCalls.find(
        (call) => typeof call[0] === "string" && (call[0] as string).endsWith(".tmp")
      );
      expect(tmpWrite, "createLocationConnection should write to .tmp file for atomic write").toBeDefined();
      expect(mockedFs.rename).toHaveBeenCalled();
    });
  });

  describe("campaigns.ts — saveCampaignAsTemplate", () => {
    test("uses atomic write pattern", async () => {
      const { saveCampaignAsTemplate } = await import("@/lib/storage/campaigns");

      // Mock readFile to return an existing campaign
      mockedFs.readFile.mockResolvedValue(
        JSON.stringify({
          id: "campaign-1",
          gmId: "user-1",
          title: "Test Campaign",
          description: "A test",
          status: "active",
          editionId: "sr5",
          editionCode: "sr5",
          enabledBookIds: ["core-rulebook"],
          enabledCreationMethodIds: ["priority"],
          gameplayLevel: "street",
          visibility: "private",
          playerIds: [],
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        }) as never
      );

      await saveCampaignAsTemplate("campaign-1", "My Template", "user-1");

      const writeCalls = mockedFs.writeFile.mock.calls;
      const tmpWrite = writeCalls.find(
        (call) => typeof call[0] === "string" && (call[0] as string).endsWith(".tmp")
      );
      expect(tmpWrite, "saveCampaignAsTemplate should write to .tmp file for atomic write").toBeDefined();
      expect(mockedFs.rename).toHaveBeenCalled();
    });
  });
});
