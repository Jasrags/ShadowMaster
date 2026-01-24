/**
 * Integration tests for Damage API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/damage - Apply or heal damage
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
  updateCharacterWithAudit: vi.fn(),
}));

vi.mock("@/lib/storage/campaigns", () => ({
  getCampaignById: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";
import { POST } from "../route";
import type { Character } from "@/lib/types";
import type { Campaign } from "@/lib/types/campaign";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_GM_ID = "test-gm-456";
const TEST_CHARACTER_ID = "test-char-789";
const TEST_CAMPAIGN_ID = "test-campaign-111";

import type { User } from "@/lib/types";

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
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
    ...overrides,
  };
}

const mockUser = createMockUser();

const mockGm = createMockUser({
  id: TEST_GM_ID,
  username: "testgm",
  email: "gm@example.com",
  role: ["gamemaster"],
});

const mockCampaign: Campaign = {
  id: TEST_CAMPAIGN_ID,
  title: "Test Campaign",
  gmId: TEST_GM_ID,
  editionId: "sr5-edition-id",
  editionCode: "sr5",
  enabledBookIds: ["core-rulebook"],
  enabledCreationMethodIds: ["priority"],
  gameplayLevel: "street",
  status: "active",
  playerIds: [TEST_USER_ID],
  visibility: "private",
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
};

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
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: {
      edge: 3,
      essence: 6,
    },
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
      overflowDamage: 0,
    },
    ...overrides,
  } as Character;
}

function createMockRequest(body: Record<string, unknown>): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/damage`;
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// =============================================================================
// AUTHENTICATION TESTS
// =============================================================================

describe("POST /api/characters/[characterId]/damage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(null);

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });
  });

  // ===========================================================================
  // AUTHORIZATION TESTS
  // ===========================================================================

  describe("Authorization", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user is not owner and not GM", async () => {
      vi.mocked(getSession).mockResolvedValue("other-user-id");
      vi.mocked(getUserById).mockResolvedValue({ ...mockUser, id: "other-user-id" });
      vi.mocked(getCharacter).mockResolvedValue(null); // Not found for other user

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it("should return 403 when not owner and campaign GM doesn't match", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(
        createMockCharacter({
          ownerId: "other-owner",
          campaignId: TEST_CAMPAIGN_ID,
        })
      );
      vi.mocked(getCampaignById).mockResolvedValue({
        ...mockCampaign,
        gmId: "different-gm",
      });

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Not authorized to modify this character");
    });

    it("should allow owner to apply damage", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockChar);

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should allow campaign GM to apply damage", async () => {
      const mockChar = createMockCharacter({
        ownerId: "other-owner",
        campaignId: TEST_CAMPAIGN_ID,
      });
      vi.mocked(getSession).mockResolvedValue(TEST_GM_ID);
      vi.mocked(getUserById).mockResolvedValue(mockGm);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(getCampaignById).mockResolvedValue(mockCampaign);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue(mockChar);

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  // ===========================================================================
  // VALIDATION TESTS
  // ===========================================================================

  describe("Validation", () => {
    it("should return 400 when damage type is missing", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);

      const request = createMockRequest({ amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid damage type");
    });

    it("should return 400 when damage type is invalid", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);

      const request = createMockRequest({ type: "invalid", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid damage type");
    });

    it("should return 400 when amount is not a number", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);

      const request = createMockRequest({ type: "physical", amount: "three" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Amount must be a number");
    });
  });

  // ===========================================================================
  // PHYSICAL DAMAGE TESTS
  // ===========================================================================

  describe("Physical damage", () => {
    it("should apply physical damage correctly", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.physicalDamage).toBe(3);
    });

    it("should heal physical damage correctly (negative amount)", async () => {
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 5, stunDamage: 0, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "physical", amount: -2 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.physicalDamage).toBe(3);
    });

    it("should floor physical damage at 0 when healing", async () => {
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 2, stunDamage: 0, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "physical", amount: -10 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.physicalDamage).toBe(0);
    });

    it("should overflow excess physical damage", async () => {
      // Body 4 = 8 + ceil(4/2) = 10 physical boxes
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 8, stunDamage: 0, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "physical", amount: 5 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.physicalDamage).toBe(10); // Max
      expect(data.character.condition.overflowDamage).toBe(3); // 8+5=13, 13-10=3 overflow
      expect(data.overflow?.physical).toBe(3);
    });
  });

  // ===========================================================================
  // STUN DAMAGE TESTS
  // ===========================================================================

  describe("Stun damage", () => {
    it("should apply stun damage correctly", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "stun", amount: 4 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.stunDamage).toBe(4);
    });

    it("should heal stun damage correctly", async () => {
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 0, stunDamage: 6, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "stun", amount: -3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.stunDamage).toBe(3);
    });

    it("should floor stun damage at 0 when healing", async () => {
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 0, stunDamage: 2, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "stun", amount: -10 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.stunDamage).toBe(0);
    });

    it("should convert excess stun to physical damage", async () => {
      // Willpower 4 = 8 + ceil(4/2) = 10 stun boxes
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 0, stunDamage: 8, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "stun", amount: 5 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.stunDamage).toBe(10); // Max
      expect(data.character.condition.physicalDamage).toBe(3); // Overflow stun
      expect(data.overflow?.stun).toBe(3);
    });
  });

  // ===========================================================================
  // OVERFLOW DAMAGE TESTS
  // ===========================================================================

  describe("Overflow damage", () => {
    it("should apply overflow damage directly", async () => {
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 10, stunDamage: 0, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "overflow", amount: 2 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.overflowDamage).toBe(2);
    });

    it("should cap overflow damage at body attribute", async () => {
      // Body 4 = 4 overflow boxes max
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 10, stunDamage: 0, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "overflow", amount: 10 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.overflowDamage).toBe(4); // Capped at body
    });

    it("should heal overflow damage correctly", async () => {
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 10, stunDamage: 0, overflowDamage: 3 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "overflow", amount: -2 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.overflowDamage).toBe(1);
    });
  });

  // ===========================================================================
  // WOUND MODIFIER TESTS
  // ===========================================================================

  describe("Wound modifiers", () => {
    it("should calculate wound modifier correctly", async () => {
      // 6 physical damage = -2 modifier (floor(6/3))
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 3, stunDamage: 0, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // 3+3=6 physical, floor(6/3) = -2
      expect(data.character.woundModifier).toBe(-2);
    });

    it("should return 0 wound modifier with no damage", async () => {
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 2, stunDamage: 0, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "physical", amount: -2 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // Use Math.abs to handle -0 vs 0 comparison
      expect(Math.abs(data.character.woundModifier)).toBe(0);
    });

    it("should combine wound modifiers from both tracks", async () => {
      // 3 physical + 3 stun = -1 + -1 = -2 combined
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 0, stunDamage: 3, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // 3 physical (-1) + 3 stun (-1) = -2
      expect(data.character.woundModifier).toBe(-2);
    });
  });

  // ===========================================================================
  // AUDIT TESTS
  // ===========================================================================

  describe("Audit logging", () => {
    it("should create audit entry for damage", async () => {
      const mockChar = createMockCharacter();
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "physical", amount: 3, source: "Combat" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.any(Object),
        expect.objectContaining({
          action: "damage_applied",
          actor: { userId: TEST_USER_ID, role: "owner" },
          details: expect.objectContaining({
            damageType: "physical",
            amount: 3,
            source: "Combat",
          }),
        })
      );
    });

    it("should create audit entry for healing", async () => {
      const mockChar = createMockCharacter({
        condition: { physicalDamage: 5, stunDamage: 0, overflowDamage: 0 },
      });
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "physical", amount: -3, source: "First Aid" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.any(Object),
        expect.objectContaining({
          action: "damage_healed",
          details: expect.objectContaining({
            damageType: "physical",
            amount: -3,
            source: "First Aid",
          }),
        })
      );
    });

    it("should include GM role in audit when GM applies damage", async () => {
      const mockChar = createMockCharacter({
        ownerId: "other-owner",
        campaignId: TEST_CAMPAIGN_ID,
      });
      vi.mocked(getSession).mockResolvedValue(TEST_GM_ID);
      vi.mocked(getUserById).mockResolvedValue(mockGm);
      vi.mocked(getCharacter).mockResolvedValue(mockChar);
      vi.mocked(getCampaignById).mockResolvedValue(mockCampaign);
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_, __, updates) => ({
        ...mockChar,
        ...updates,
      }));

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        "other-owner",
        TEST_CHARACTER_ID,
        expect.any(Object),
        expect.objectContaining({
          actor: { userId: TEST_GM_ID, role: "gm" },
        })
      );
    });
  });

  // ===========================================================================
  // ERROR HANDLING TESTS
  // ===========================================================================

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(mockUser);
      vi.mocked(getCharacter).mockRejectedValue(new Error("Database error"));

      const request = createMockRequest({ type: "physical", amount: 3 });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to apply damage");
    });
  });
});
