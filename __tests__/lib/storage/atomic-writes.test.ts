/**
 * Tests that storage modules delegate writes to writeJsonFile (atomic writes)
 * and that path segments are sanitized to prevent path traversal.
 *
 * Issue: #633 — Non-atomic writes in storage layer
 */

import { describe, test, expect, vi, beforeEach } from "vitest";

// Mock base storage to spy on writeJsonFile and sanitizePathSegment
vi.mock("@/lib/storage/base", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/storage/base")>();
  return {
    ...actual,
    writeJsonFile: vi.fn().mockResolvedValue(undefined),
    ensureDirectory: vi.fn().mockResolvedValue(undefined),
  };
});

// Must use vi.hoisted() so mockPromises is available inside vi.mock (which is hoisted)
const mockPromises = vi.hoisted(() => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  readFile: vi.fn(),
  writeFile: vi.fn().mockResolvedValue(undefined),
  rename: vi.fn().mockResolvedValue(undefined),
  unlink: vi.fn().mockResolvedValue(undefined),
  readdir: vi.fn().mockResolvedValue([]),
  access: vi.fn().mockResolvedValue(undefined),
  stat: vi.fn().mockResolvedValue({ isDirectory: () => true }),
}));
vi.mock("fs", async () => {
  const actual = await vi.importActual<typeof import("fs")>("fs");
  return { ...actual, default: { ...actual, promises: mockPromises }, promises: mockPromises };
});

vi.mock("uuid", () => ({
  v4: () => "test-uuid-1234",
}));

vi.mock("@/lib/storage/validation", () => ({
  validateLocationData: vi.fn().mockReturnValue({ valid: true, errors: [] }),
  validateLocationTemplateData: vi.fn().mockReturnValue({ valid: true, errors: [] }),
  validateCampaignTemplateData: vi.fn().mockReturnValue({ valid: true, errors: [] }),
  assertValid: vi.fn(),
}));

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

import { writeJsonFile, sanitizePathSegment } from "@/lib/storage/base";

const mockedWriteJsonFile = vi.mocked(writeJsonFile);

describe("Atomic writes via writeJsonFile delegation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPromises.readFile.mockRejectedValue(Object.assign(new Error("ENOENT"), { code: "ENOENT" }));
    mockPromises.mkdir.mockResolvedValue(undefined);
  });

  test("activity.logActivity delegates to writeJsonFile", async () => {
    const { logActivity } = await import("@/lib/storage/activity");

    await logActivity({
      campaignId: "campaign-1",
      type: "player_joined",
      actorId: "user-1",
      description: "Test activity",
    });

    expect(mockedWriteJsonFile).toHaveBeenCalledTimes(1);
    expect(mockedWriteJsonFile.mock.calls[0][0]).toMatch(/campaign-1\.json$/);
  });

  test("notifications.createNotification delegates to writeJsonFile", async () => {
    const { createNotification } = await import("@/lib/storage/notifications");

    await createNotification({
      userId: "user-1",
      campaignId: "campaign-1",
      type: "campaign_invite",
      title: "Test",
      message: "Test notification",
    });

    expect(mockedWriteJsonFile).toHaveBeenCalledTimes(1);
    expect(mockedWriteJsonFile.mock.calls[0][0]).toMatch(/user-1\.json$/);
  });

  test("notifications.updateNotification delegates to writeJsonFile", async () => {
    const { updateNotification } = await import("@/lib/storage/notifications");

    mockPromises.readFile.mockResolvedValue(
      JSON.stringify([
        {
          id: "notif-1",
          userId: "user-1",
          campaignId: "campaign-1",
          type: "campaign_invite",
          title: "Test",
          message: "msg",
          read: false,
          dismissed: false,
          createdAt: "2024-01-01",
        },
      ]) as never
    );

    await updateNotification("user-1", "notif-1", { read: true });

    expect(mockedWriteJsonFile).toHaveBeenCalledTimes(1);
  });

  test("notifications.markAllRead delegates to writeJsonFile", async () => {
    const { markAllRead } = await import("@/lib/storage/notifications");

    mockPromises.readFile.mockResolvedValue(
      JSON.stringify([
        {
          id: "notif-1",
          userId: "user-1",
          campaignId: "campaign-1",
          type: "campaign_invite",
          title: "Test",
          message: "msg",
          read: false,
          dismissed: false,
          createdAt: "2024-01-01",
        },
      ]) as never
    );

    await markAllRead("user-1");

    expect(mockedWriteJsonFile).toHaveBeenCalledTimes(1);
  });

  test("locations.createLocationTemplate delegates to writeJsonFile", async () => {
    const { createLocationTemplate } = await import("@/lib/storage/locations");

    await createLocationTemplate("user-1", {
      name: "Test Template",
      type: "physical",
      templateData: {
        name: "Test",
        type: "physical",
        visibility: "public",
      },
      isPublic: false,
    });

    expect(mockedWriteJsonFile).toHaveBeenCalledTimes(1);
  });

  test("locations.incrementTemplateUsage delegates to writeJsonFile", async () => {
    const { incrementTemplateUsage } = await import("@/lib/storage/locations");

    mockPromises.readFile.mockResolvedValue(
      JSON.stringify({
        id: "template-1",
        name: "Test",
        type: "physical",
        templateData: {},
        createdBy: "user-1",
        isPublic: false,
        usageCount: 0,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      }) as never
    );

    await incrementTemplateUsage("template-1");

    expect(mockedWriteJsonFile).toHaveBeenCalledTimes(1);
  });

  test("locations.createLocationConnection delegates to writeJsonFile", async () => {
    const { createLocationConnection } = await import("@/lib/storage/locations");

    await createLocationConnection("campaign-1", {
      fromLocationId: "loc-1",
      toLocationId: "loc-2",
      connectionType: "physical",
      bidirectional: true,
    });

    expect(mockedWriteJsonFile).toHaveBeenCalledTimes(1);
  });

  test("campaigns.saveCampaignAsTemplate delegates to writeJsonFile", async () => {
    const { saveCampaignAsTemplate } = await import("@/lib/storage/campaigns");

    mockPromises.readFile.mockResolvedValue(
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

    expect(mockedWriteJsonFile).toHaveBeenCalledTimes(1);
  });
});

describe("sanitizePathSegment", () => {
  test("strips path separators", () => {
    expect(sanitizePathSegment("../../../etc/passwd")).toBe("etcpasswd");
  });

  test("strips backslashes", () => {
    expect(sanitizePathSegment("..\\..\\windows\\system32")).toBe("windowssystem32");
  });

  test("strips null bytes", () => {
    expect(sanitizePathSegment("file\0name")).toBe("filename");
  });

  test("passes through valid UUIDs unchanged", () => {
    expect(sanitizePathSegment("550e8400-e29b-41d4-a716-446655440000")).toBe(
      "550e8400-e29b-41d4-a716-446655440000"
    );
  });

  test("throws on empty result", () => {
    expect(() => sanitizePathSegment("../..")).toThrow("Invalid path segment");
  });
});
