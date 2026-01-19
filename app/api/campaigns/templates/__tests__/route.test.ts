/**
 * Tests for /api/campaigns/templates endpoint
 *
 * Tests campaign template listing (GET) functionality including
 * authentication and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import * as sessionModule from "@/lib/auth/session";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { CampaignTemplate } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/campaigns");

// Mock template factory
function createMockTemplate(overrides?: Partial<CampaignTemplate>): CampaignTemplate {
  return {
    id: "test-template-id",
    name: "Test Template",
    description: "A test template",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "street",
    createdBy: "test-user-id",
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("GET /api/campaigns/templates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
    expect(campaignStorage.getCampaignTemplates).not.toHaveBeenCalled();
  });

  it("should list user templates successfully", async () => {
    const mockTemplates = [
      createMockTemplate({ id: "template-1", name: "Template 1" }),
      createMockTemplate({ id: "template-2", name: "Template 2" }),
    ];

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignTemplates).mockResolvedValue(mockTemplates);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.templates).toHaveLength(2);
    expect(campaignStorage.getCampaignTemplates).toHaveBeenCalledWith("test-user-id");
  });

  it("should return empty array when no templates exist", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignTemplates).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.templates).toEqual([]);
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(campaignStorage.getCampaignTemplates).mockRejectedValue(new Error("Storage error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });
});
