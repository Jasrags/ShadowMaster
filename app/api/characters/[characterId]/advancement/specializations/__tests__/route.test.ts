/**
 * Tests for /api/characters/[characterId]/advancement/specializations endpoint
 *
 * Tests specialization advancement including authentication, validation,
 * karma spending, and advancement record creation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as userStorageModule from "@/lib/storage/users";
import * as characterStorageModule from "@/lib/storage/characters";
import * as rulesModule from "@/lib/rules/merge";
import * as advancementModule from "@/lib/rules/advancement/specializations";

import type { Character, MergedRuleset, AdvancementRecord } from "@/lib/types";
import { createMockCharacter, createMockUser } from "@/__tests__/mocks/storage";
import { createMockMergedRuleset } from "@/__tests__/mocks/rulesets";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/merge");
vi.mock("@/lib/rules/advancement/specializations");

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

describe("POST /api/characters/[characterId]/advancement/specializations", () => {
  const userId = "test-user-id";
  const characterId = "test-character-id";
  let mockCharacter: Character;
  let mockRuleset: MergedRuleset;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCharacter = createMockCharacter({
      id: characterId,
      ownerId: userId,
      status: "active",
      karmaCurrent: 50,
      skills: {
        pistols: 4, // Minimum rating for specializations
      },
    });

    mockRuleset = createMockMergedRuleset({
      modules: {
        ...createMockMergedRuleset().modules,
        skills: {
          pistols: {
            id: "pistols",
            name: "Pistols",
            linkedAttribute: "agility",
            group: "combat",
            canDefault: true,
          },
        },
      },
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(
      createMockUser({
        id: userId,
        email: "test@example.com",
        username: "testuser",
      })
    );
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(rulesModule.loadAndMergeRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
  });

  it("should successfully learn a specialization", async () => {
    const mockAdvancementRecord: AdvancementRecord = {
      id: "advancement-1",
      type: "specialization",
      targetId: "pistols",
      targetName: "Pistols (Semi-Automatics)",
      previousValue: 4,
      newValue: 4,
      karmaCost: 7,
      karmaSpentAt: new Date().toISOString(),
      trainingRequired: true,
      trainingStatus: "pending",
      gmApproved: false,
      notes: "Specialization: Semi-Automatics",
      createdAt: new Date().toISOString(),
    };

    const mockTrainingPeriod = {
      id: "training-1",
      advancementRecordId: "advancement-1",
      type: "specialization" as const,
      targetId: "pistols",
      targetName: "Pistols (Semi-Automatics)",
      requiredTime: 30,
      timeSpent: 0,
      startDate: new Date().toISOString(),
      expectedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };

    const updatedCharacter: Character = {
      ...mockCharacter,
      karmaCurrent: 43,
      advancementHistory: [mockAdvancementRecord],
      activeTraining: [mockTrainingPeriod],
    };

    vi.mocked(advancementModule.advanceSpecialization).mockReturnValue({
      advancementRecord: mockAdvancementRecord,
      trainingPeriod: mockTrainingPeriod,
      updatedCharacter,
    });

    vi.mocked(characterStorageModule.saveCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        skillId: "pistols",
        specializationName: "Semi-Automatics",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.advancementRecord).toEqual(mockAdvancementRecord);
    expect(data.trainingPeriod).toEqual(mockTrainingPeriod);
    expect(data.cost).toBe(7);

    expect(advancementModule.advanceSpecialization).toHaveBeenCalledWith(
      mockCharacter,
      "pistols",
      "Semi-Automatics",
      mockRuleset,
      expect.objectContaining({
        downtimePeriodId: undefined,
        campaignSessionId: undefined,
        gmApproved: undefined,
        notes: undefined,
      })
    );
    expect(characterStorageModule.saveCharacter).toHaveBeenCalled();
  });

  it("should return 401 if user is not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        skillId: "pistols",
        specializationName: "Semi-Automatics",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 if user is not found", async () => {
    vi.mocked(userStorageModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        skillId: "pistols",
        specializationName: "Semi-Automatics",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 404 if character is not found", async () => {
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        skillId: "pistols",
        specializationName: "Semi-Automatics",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 400 if character is draft", async () => {
    const draftCharacter = {
      ...mockCharacter,
      status: "draft" as const,
    };
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(draftCharacter);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        skillId: "pistols",
        specializationName: "Semi-Automatics",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Cannot learn specializations during character creation");
  });

  it("should return 400 if skillId is missing", async () => {
    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        specializationName: "Semi-Automatics",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("skillId");
  });

  it("should return 400 if specializationName is missing", async () => {
    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        skillId: "pistols",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("specializationName");
  });

  it("should return 400 if specializationName is empty", async () => {
    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        skillId: "pistols",
        specializationName: "   ",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("specializationName");
  });

  it("should return 500 if ruleset loading fails", async () => {
    vi.mocked(rulesModule.loadAndMergeRuleset).mockResolvedValue({
      success: false,
      error: "Failed to load ruleset",
    });

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        skillId: "pistols",
        specializationName: "Semi-Automatics",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to load ruleset");
  });

  it("should return 400 if advancement validation fails", async () => {
    vi.mocked(advancementModule.advanceSpecialization).mockImplementation(() => {
      throw new Error("Cannot learn specialization: Skill rating must be at least 4");
    });

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        skillId: "pistols",
        specializationName: "Semi-Automatics",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Cannot learn specialization");
  });

  it("should handle options (downtimePeriodId, campaignSessionId, gmApproved, notes)", async () => {
    const mockAdvancementRecord: AdvancementRecord = {
      id: "advancement-1",
      type: "specialization",
      targetId: "pistols",
      targetName: "Pistols (Semi-Automatics)",
      previousValue: 4,
      newValue: 4,
      karmaCost: 7,
      karmaSpentAt: new Date().toISOString(),
      trainingRequired: true,
      trainingStatus: "pending",
      downtimePeriodId: "downtime-123",
      campaignSessionId: "session-123",
      gmApproved: true,
      notes: "Custom note",
      createdAt: new Date().toISOString(),
    };

    const mockTrainingPeriod = {
      id: "training-1",
      advancementRecordId: "advancement-1",
      type: "specialization" as const,
      targetId: "pistols",
      targetName: "Pistols (Semi-Automatics)",
      requiredTime: 30,
      timeSpent: 0,
      startDate: new Date().toISOString(),
      expectedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending" as const,
      downtimePeriodId: "downtime-123",
      createdAt: new Date().toISOString(),
    };

    const updatedCharacter: Character = {
      ...mockCharacter,
      karmaCurrent: 43,
      advancementHistory: [mockAdvancementRecord],
      activeTraining: [mockTrainingPeriod],
    };

    vi.mocked(advancementModule.advanceSpecialization).mockReturnValue({
      advancementRecord: mockAdvancementRecord,
      trainingPeriod: mockTrainingPeriod,
      updatedCharacter,
    });

    vi.mocked(characterStorageModule.saveCharacter).mockResolvedValue(updatedCharacter);

    const request = createMockRequest(
      `/api/characters/${characterId}/advancement/specializations`,
      {
        skillId: "pistols",
        specializationName: "Semi-Automatics",
        downtimePeriodId: "downtime-123",
        campaignSessionId: "session-123",
        gmApproved: true,
        notes: "Custom note",
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ characterId }),
    });

    expect(response.status).toBe(200);
    expect(advancementModule.advanceSpecialization).toHaveBeenCalledWith(
      mockCharacter,
      "pistols",
      "Semi-Automatics",
      mockRuleset,
      expect.objectContaining({
        downtimePeriodId: "downtime-123",
        campaignSessionId: "session-123",
        gmApproved: true,
        notes: "Custom note",
      })
    );
  });
});
