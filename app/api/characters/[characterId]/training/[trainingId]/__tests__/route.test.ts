/**
 * Integration tests for Training API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/training/[trainingId] - Complete, interrupt, or resume training
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/storage/users", () => ({
  getUserById: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacter: vi.fn(),
  updateCharacter: vi.fn(),
  updateTrainingPeriod: vi.fn(),
  updateAdvancementRecord: vi.fn(),
  removeTrainingPeriod: vi.fn(),
}));

vi.mock("@/lib/rules/advancement", () => ({
  completeTraining: vi.fn(),
  interruptTraining: vi.fn(),
  resumeTraining: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import {
  getCharacter,
  updateCharacter,
  updateTrainingPeriod,
  updateAdvancementRecord,
  removeTrainingPeriod,
} from "@/lib/storage/characters";
import { completeTraining, interruptTraining, resumeTraining } from "@/lib/rules/advancement";
import { POST } from "../route";
import type { User, Character } from "@/lib/types";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-789";
const TEST_TRAINING_ID = "training-456";

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: TEST_USER_ID,
    username: "testrunner",
    email: "test@example.com",
    passwordHash: "hashed_password",
    role: ["user"],
    preferences: { theme: "dark", navigationCollapsed: false },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    characters: [TEST_CHARACTER_ID],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    emailVerified: true,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    ...overrides,
  };
}

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Test Runner",
    status: "active",
    editionCode: "sr5",
    editionId: "sr5-edition-id",
    creationMethodId: "priority",
    attachedBookIds: ["core-rulebook"],
    metatype: "Human",
    attributes: {
      body: 4,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 4,
      logic: 3,
      intuition: 3,
      charisma: 3,
    },
    skills: { automatics: 4 },
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: {
      edge: 4,
      essence: 6,
    },
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
      overflowDamage: 0,
    },
    activeTraining: [
      {
        id: TEST_TRAINING_ID,
        advancementRecordId: "adv-record-123",
        type: "skill",
        targetId: "automatics",
        fromValue: 4,
        toValue: 5,
        startDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
        endDate: new Date().toISOString(),
        status: "in-progress",
      },
    ],
    advancementHistory: [
      {
        id: "adv-record-123",
        type: "skill",
        targetId: "automatics",
        fromValue: 4,
        toValue: 5,
        karmaCost: 10,
        trainingStatus: "in-progress",
        requestedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
    ],
    ...overrides,
  } as Character;
}

function createMockRequest(body: Record<string, unknown>): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/training/${TEST_TRAINING_ID}`;
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const mockUser = createMockUser();

// =============================================================================
// TESTS
// =============================================================================

describe("POST /api/characters/[characterId]/training/[trainingId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({ action: "complete" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(null);

      const request = createMockRequest({ action: "complete" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });
  });

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest({ action: "complete" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });

    it("should return 400 when character is a draft", async () => {
      const draftCharacter = createMockCharacter({ status: "draft" });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(draftCharacter);

      const request = createMockRequest({ action: "complete" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Cannot manage training during character creation");
    });
  });

  describe("Validation", () => {
    it("should return 400 when action is missing", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest({});
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Missing or invalid action");
    });

    it("should return 400 for invalid action", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);

      const request = createMockRequest({ action: "invalid" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid action");
    });
  });

  describe("Complete action", () => {
    it("should complete training successfully", async () => {
      const mockCharacter = createMockCharacter();
      const updatedCharacter = createMockCharacter({
        skills: { automatics: 5 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(completeTraining).mockReturnValue({
        completedTrainingPeriod: {
          id: TEST_TRAINING_ID,
          advancementRecordId: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          requiredTime: 7,
          timeSpent: 7,
          startDate: new Date(Date.now() - 86400000 * 7).toISOString(),
          status: "completed",
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
        completedAdvancementRecord: {
          id: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          newValue: 5,
          karmaCost: 10,
          karmaSpentAt: new Date().toISOString(),
          trainingRequired: true,
          trainingStatus: "completed",
          gmApproved: false,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        },
        updatedCharacter,
      });
      vi.mocked(updateAdvancementRecord).mockResolvedValue(updatedCharacter);
      vi.mocked(removeTrainingPeriod).mockResolvedValue(updatedCharacter);
      vi.mocked(updateCharacter).mockResolvedValue(updatedCharacter);

      const request = createMockRequest({ action: "complete" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character).toBeDefined();
      expect(data.completedTrainingPeriod).toBeDefined();
      expect(data.completedAdvancementRecord).toBeDefined();
      expect(completeTraining).toHaveBeenCalledWith(mockCharacter, TEST_TRAINING_ID);
    });

    it("should update character stats on completion", async () => {
      const mockCharacter = createMockCharacter();
      const updatedCharacter = createMockCharacter({
        skills: { automatics: 5 },
      });

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(completeTraining).mockReturnValue({
        completedTrainingPeriod: {
          id: TEST_TRAINING_ID,
          advancementRecordId: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          requiredTime: 7,
          timeSpent: 7,
          startDate: new Date(Date.now() - 86400000 * 7).toISOString(),
          status: "completed",
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
        completedAdvancementRecord: {
          id: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          newValue: 5,
          karmaCost: 10,
          karmaSpentAt: new Date().toISOString(),
          trainingRequired: true,
          trainingStatus: "completed",
          gmApproved: false,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        },
        updatedCharacter,
      });
      vi.mocked(updateAdvancementRecord).mockResolvedValue(updatedCharacter);
      vi.mocked(removeTrainingPeriod).mockResolvedValue(updatedCharacter);
      vi.mocked(updateCharacter).mockResolvedValue(updatedCharacter);

      const request = createMockRequest({ action: "complete" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      await POST(request, { params });

      expect(updateCharacter).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          skills: { automatics: 5 },
        })
      );
    });

    it("should return 400 when completion fails", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(completeTraining).mockImplementation(() => {
        throw new Error("Training not found");
      });

      const request = createMockRequest({ action: "complete" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Training not found");
    });
  });

  describe("Interrupt action", () => {
    it("should interrupt training successfully", async () => {
      const mockCharacter = createMockCharacter();
      const updatedCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter)
        .mockResolvedValue(mockCharacter)
        .mockResolvedValueOnce(mockCharacter)
        .mockResolvedValueOnce(updatedCharacter);
      vi.mocked(interruptTraining).mockReturnValue({
        updatedCharacter,
        interruptedTrainingPeriod: {
          id: TEST_TRAINING_ID,
          advancementRecordId: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          requiredTime: 7,
          timeSpent: 3,
          startDate: new Date(Date.now() - 86400000 * 7).toISOString(),
          status: "interrupted",
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          interruptionDate: new Date().toISOString(),
          interruptionReason: "Mission started",
        },
        updatedAdvancementRecord: {
          id: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          newValue: 5,
          karmaCost: 10,
          karmaSpentAt: new Date().toISOString(),
          trainingRequired: true,
          trainingStatus: "interrupted",
          gmApproved: false,
          createdAt: new Date().toISOString(),
        },
      });
      vi.mocked(updateTrainingPeriod).mockResolvedValue(updatedCharacter);
      vi.mocked(updateAdvancementRecord).mockResolvedValue(updatedCharacter);

      const request = createMockRequest({ action: "interrupt", reason: "Mission started" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.interruptedTrainingPeriod).toBeDefined();
      expect(data.updatedAdvancementRecord).toBeDefined();
      expect(interruptTraining).toHaveBeenCalledWith(
        mockCharacter,
        TEST_TRAINING_ID,
        "Mission started"
      );
    });

    it("should update training period status on interrupt", async () => {
      const mockCharacter = createMockCharacter();
      const updatedCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter)
        .mockResolvedValue(mockCharacter)
        .mockResolvedValueOnce(mockCharacter)
        .mockResolvedValueOnce(updatedCharacter);
      vi.mocked(interruptTraining).mockReturnValue({
        updatedCharacter,
        interruptedTrainingPeriod: {
          id: TEST_TRAINING_ID,
          advancementRecordId: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          requiredTime: 7,
          timeSpent: 3,
          startDate: new Date(Date.now() - 86400000 * 7).toISOString(),
          status: "interrupted",
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          interruptionDate: "2024-01-15T12:00:00.000Z",
          interruptionReason: "Emergency",
        },
        updatedAdvancementRecord: {
          id: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          newValue: 5,
          karmaCost: 10,
          karmaSpentAt: new Date().toISOString(),
          trainingRequired: true,
          trainingStatus: "interrupted",
          gmApproved: false,
          createdAt: new Date().toISOString(),
        },
      });
      vi.mocked(updateTrainingPeriod).mockResolvedValue(updatedCharacter);
      vi.mocked(updateAdvancementRecord).mockResolvedValue(updatedCharacter);

      const request = createMockRequest({ action: "interrupt", reason: "Emergency" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      await POST(request, { params });

      expect(updateTrainingPeriod).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        TEST_TRAINING_ID,
        expect.objectContaining({
          status: "interrupted",
        })
      );
    });

    it("should return 400 when interrupt fails", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(interruptTraining).mockImplementation(() => {
        throw new Error("Cannot interrupt completed training");
      });

      const request = createMockRequest({ action: "interrupt" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Cannot interrupt completed training");
    });
  });

  describe("Resume action", () => {
    it("should resume training successfully", async () => {
      const mockCharacter = createMockCharacter({
        activeTraining: [
          {
            id: TEST_TRAINING_ID,
            advancementRecordId: "adv-record-123",
            type: "skill",
            targetId: "automatics",
            targetName: "Automatics",
            requiredTime: 7,
            timeSpent: 3,
            startDate: new Date().toISOString(),
            expectedCompletionDate: new Date(Date.now() + 86400000 * 7).toISOString(),
            status: "interrupted",
            createdAt: new Date().toISOString(),
          },
        ],
      });
      const updatedCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter)
        .mockResolvedValue(mockCharacter)
        .mockResolvedValueOnce(mockCharacter)
        .mockResolvedValueOnce(updatedCharacter);
      vi.mocked(resumeTraining).mockReturnValue({
        updatedCharacter,
        resumedTrainingPeriod: {
          id: TEST_TRAINING_ID,
          advancementRecordId: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          requiredTime: 7,
          timeSpent: 3,
          startDate: new Date().toISOString(),
          status: "in-progress",
          createdAt: new Date().toISOString(),
        },
        updatedAdvancementRecord: {
          id: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          newValue: 5,
          karmaCost: 10,
          karmaSpentAt: new Date().toISOString(),
          trainingRequired: true,
          trainingStatus: "in-progress",
          gmApproved: false,
          createdAt: new Date().toISOString(),
        },
      });
      vi.mocked(updateTrainingPeriod).mockResolvedValue(updatedCharacter);
      vi.mocked(updateAdvancementRecord).mockResolvedValue(updatedCharacter);

      const request = createMockRequest({ action: "resume" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.resumedTrainingPeriod).toBeDefined();
      expect(data.updatedAdvancementRecord).toBeDefined();
      expect(resumeTraining).toHaveBeenCalledWith(mockCharacter, TEST_TRAINING_ID);
    });

    it("should update training period status on resume", async () => {
      const mockCharacter = createMockCharacter();
      const updatedCharacter = createMockCharacter();

      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter)
        .mockResolvedValue(mockCharacter)
        .mockResolvedValueOnce(mockCharacter)
        .mockResolvedValueOnce(updatedCharacter);
      vi.mocked(resumeTraining).mockReturnValue({
        updatedCharacter,
        resumedTrainingPeriod: {
          id: TEST_TRAINING_ID,
          advancementRecordId: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          requiredTime: 7,
          timeSpent: 3,
          startDate: new Date().toISOString(),
          status: "in-progress",
          createdAt: new Date().toISOString(),
        },
        updatedAdvancementRecord: {
          id: "adv-record-123",
          type: "skill",
          targetId: "automatics",
          targetName: "Automatics",
          newValue: 5,
          karmaCost: 10,
          karmaSpentAt: new Date().toISOString(),
          trainingRequired: true,
          trainingStatus: "in-progress",
          gmApproved: false,
          createdAt: new Date().toISOString(),
        },
      });
      vi.mocked(updateTrainingPeriod).mockResolvedValue(updatedCharacter);
      vi.mocked(updateAdvancementRecord).mockResolvedValue(updatedCharacter);

      const request = createMockRequest({ action: "resume" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      await POST(request, { params });

      expect(updateTrainingPeriod).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        TEST_TRAINING_ID,
        { status: "in-progress" }
      );
    });

    it("should return 400 when resume fails", async () => {
      const mockCharacter = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(resumeTraining).mockImplementation(() => {
        throw new Error("Training is not interrupted");
      });

      const request = createMockRequest({ action: "resume" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Training is not interrupted");
    });
  });

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockRejectedValue(new Error("Database error"));

      const request = createMockRequest({ action: "complete" });
      const params = Promise.resolve({
        characterId: TEST_CHARACTER_ID,
        trainingId: TEST_TRAINING_ID,
      });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Database error");
    });
  });
});
