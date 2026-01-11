/**
 * Tests for /api/characters/[characterId]/advancement/[recordId]/approve endpoint
 *
 * Tests GM approval of character advancements including authentication,
 * authorization, and approval workflow.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../approve/route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as userStorageModule from "@/lib/storage/users";
import * as characterStorageModule from "@/lib/storage/characters";
import * as campaignStorageModule from "@/lib/storage/campaigns";
import * as approvalModule from "@/lib/rules/advancement/approval";

import type { Character, Campaign, AdvancementRecord } from "@/lib/types";
import { createMockCharacter, createMockUser, createMockCampaign } from "@/__tests__/mocks/storage";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/rules/advancement/approval");

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = "POST"): NextRequest {
  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { "Content-Type": "application/json" } : undefined,
  });

  // Mock json() method if body is provided
  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

describe("POST /api/characters/[characterId]/advancement/[recordId]/approve", () => {
  const gmUserId = "gm-user-id";
  const playerUserId = "player-user-id";
  const characterId = "test-character-id";
  const recordId = "advancement-record-id";
  const campaignId = "campaign-id";
  let mockCharacter: Character;
  let mockCampaign: Campaign;
  let mockAdvancementRecord: AdvancementRecord;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAdvancementRecord = {
      id: recordId,
      type: "attribute",
      targetId: "body",
      targetName: "Body",
      previousValue: 3,
      newValue: 4,
      karmaCost: 20,
      karmaSpentAt: new Date().toISOString(),
      trainingRequired: true,
      trainingStatus: "pending",
      gmApproved: false,
      createdAt: new Date().toISOString(),
    };

    mockCharacter = createMockCharacter({
      id: characterId,
      ownerId: playerUserId,
      campaignId,
      status: "active",
      advancementHistory: [mockAdvancementRecord],
    });

    mockCampaign = createMockCampaign({
      id: campaignId,
      gmId: gmUserId,
      title: "Test Campaign",
      editionCode: "sr5",
      description: "Test",
      createdAt: new Date().toISOString(),
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(gmUserId);
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(
      createMockUser({
        id: gmUserId,
        email: "gm@example.com",
        username: "gm",
      })
    );
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null); // GM accessing as non-owner
    vi.mocked(characterStorageModule.getCharacterById).mockResolvedValue(mockCharacter);
    vi.mocked(campaignStorageModule.getCampaignById).mockResolvedValue(mockCampaign);
    vi.mocked(approvalModule.requiresGMApproval).mockReturnValue(true);
    vi.mocked(approvalModule.isCampaignGM).mockReturnValue(true);
  });

  it("should successfully approve an advancement", async () => {
    const approvedRecord: AdvancementRecord = {
      ...mockAdvancementRecord,
      gmApproved: true,
      gmApprovedBy: gmUserId,
      gmApprovedAt: new Date().toISOString(),
    };

    const updatedCharacter: Character = {
      ...mockCharacter,
      advancementHistory: [approvedRecord],
    };

    vi.mocked(approvalModule.approveAdvancement).mockReturnValue({
      updatedCharacter,
      updatedAdvancementRecord: approvedRecord,
    });

    vi.mocked(characterStorageModule.saveCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/${recordId}/approve`
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, recordId }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.advancementRecord.gmApproved).toBe(true);
    expect(data.advancementRecord.gmApprovedBy).toBe(gmUserId);
    expect(data.advancementRecord.gmApprovedAt).toBeDefined();

    expect(approvalModule.approveAdvancement).toHaveBeenCalledWith(
      mockCharacter,
      recordId,
      gmUserId
    );
    expect(characterStorageModule.saveCharacter).toHaveBeenCalled();
  });

  it("should return 401 if user is not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/${recordId}/approve`
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, recordId }),
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 if character is not found", async () => {
    vi.mocked(characterStorageModule.getCharacterById).mockResolvedValue(null);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/${recordId}/approve`
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, recordId }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 400 if character is not in a campaign", async () => {
    const nonCampaignCharacter = {
      ...mockCharacter,
      campaignId: undefined,
    };
    vi.mocked(characterStorageModule.getCharacterById).mockResolvedValue(nonCampaignCharacter);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/${recordId}/approve`
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, recordId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character is not in a campaign");
  });

  it("should return 403 if user is not the GM", async () => {
    vi.mocked(approvalModule.isCampaignGM).mockReturnValue(false);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/${recordId}/approve`
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, recordId }),
    });

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Only the GM can approve advancements");
  });

  it("should return 400 if advancement record is not found", async () => {
    vi.mocked(approvalModule.approveAdvancement).mockImplementation(() => {
      throw new Error("Advancement record advancement-record-id not found");
    });

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/${recordId}/approve`
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, recordId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("not found");
  });

  it("should return 400 if advancement is already approved", async () => {
    vi.mocked(approvalModule.approveAdvancement).mockImplementation(() => {
      throw new Error("Advancement record advancement-record-id is already approved");
    });

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/${recordId}/approve`
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, recordId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("already approved");
  });

  it("should work when character owner is the requester", async () => {
    // Character found as owner
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);

    const approvedRecord: AdvancementRecord = {
      ...mockAdvancementRecord,
      gmApproved: true,
      gmApprovedBy: gmUserId,
      gmApprovedAt: new Date().toISOString(),
    };

    const updatedCharacter: Character = {
      ...mockCharacter,
      advancementHistory: [approvedRecord],
    };

    vi.mocked(approvalModule.approveAdvancement).mockReturnValue({
      updatedCharacter,
      updatedAdvancementRecord: approvedRecord,
    });

    vi.mocked(characterStorageModule.saveCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/${recordId}/approve`
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, recordId }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it("should return 400 if character does not require approval", async () => {
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(approvalModule.requiresGMApproval).mockReturnValue(false);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/${recordId}/approve`
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId, recordId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character does not require GM approval");
  });
});
