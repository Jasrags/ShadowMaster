/**
 * Tests for /api/campaigns/[id]/validate endpoint
 *
 * Tests campaign-wide character validation (POST) functionality
 * including authentication, authorization, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as campaignAuth from "@/lib/auth/campaign";
import * as campaignStorage from "@/lib/storage/campaigns";
import type { Campaign } from "@/lib/types";
import type { ValidationResult } from "@/lib/rules/validation";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/auth/campaign");
vi.mock("@/lib/storage/campaigns");

// Helper to create a NextRequest
function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method: "POST",
  });

  Object.defineProperty(request, "nextUrl", {
    value: urlObj,
    writable: false,
  });

  return request;
}

// Mock campaign factory
function createMockCampaign(overrides?: Partial<Campaign>): Campaign {
  return {
    id: "test-campaign-id",
    gmId: "test-gm-id",
    title: "Test Campaign",
    description: "A test campaign",
    status: "active",
    editionId: "sr5-edition-id",
    editionCode: "sr5",
    enabledBookIds: ["core-rulebook"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "street",
    visibility: "public",
    playerIds: ["player-1"],
    advancementSettings: {
      trainingTimeMultiplier: 1.0,
      attributeKarmaMultiplier: 5,
      skillKarmaMultiplier: 2,
      skillGroupKarmaMultiplier: 5,
      knowledgeSkillKarmaMultiplier: 1,
      specializationKarmaCost: 7,
      spellKarmaCost: 5,
      complexFormKarmaCost: 4,
      attributeRatingCap: 10,
      skillRatingCap: 13,
      allowInstantAdvancement: false,
      requireApproval: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("POST /api/campaigns/[id]/validate", () => {
  const mockCampaign = createMockCampaign();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/validate"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
  });

  it("should trigger validation successfully", async () => {
    const mockValidationResults: ValidationResult[] = [
      { valid: true, errors: [], warnings: [] },
      { valid: true, errors: [], warnings: [] },
      {
        valid: false,
        errors: [{ constraintId: "INVALID_STAT", message: "Test error", severity: "error" }],
        warnings: [],
      },
    ];

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.triggerCampaignCharacterValidation).mockResolvedValue(
      mockValidationResults
    );

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/validate"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.results.total).toBe(3);
    expect(data.results.invalidCount).toBe(1);
    expect(campaignStorage.triggerCampaignCharacterValidation).toHaveBeenCalledWith(
      "test-campaign-id"
    );
  });

  it("should return all valid results", async () => {
    const mockValidationResults: ValidationResult[] = [
      { valid: true, errors: [], warnings: [] },
      { valid: true, errors: [], warnings: [] },
    ];

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.triggerCampaignCharacterValidation).mockResolvedValue(
      mockValidationResults
    );

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/validate"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.results.total).toBe(2);
    expect(data.results.invalidCount).toBe(0);
  });

  it("should return 403 when user is not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("player-1");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: mockCampaign,
      role: "player",
      error: "Only the GM can perform this action",
      status: 403,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/validate"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can perform this action");
    expect(campaignStorage.triggerCampaignCharacterValidation).not.toHaveBeenCalled();
  });

  it("should return 404 when campaign not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: false,
      campaign: null,
      role: null,
      error: "Campaign not found",
      status: 404,
    });

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/nonexistent-id/validate"
    );
    const response = await POST(request, { params: Promise.resolve({ id: "nonexistent-id" }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Campaign not found");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-gm-id");
    vi.mocked(campaignAuth.authorizeCampaign).mockResolvedValue({
      authorized: true,
      campaign: mockCampaign,
      role: "gm",
      status: 200,
    });
    vi.mocked(campaignStorage.triggerCampaignCharacterValidation).mockRejectedValue(
      new Error("Validation failed")
    );

    const request = createMockRequest(
      "http://localhost:3000/api/campaigns/test-campaign-id/validate"
    );
    const response = await POST(request, {
      params: Promise.resolve({ id: "test-campaign-id" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred during bulk validation");

    consoleErrorSpy.mockRestore();
  });
});
