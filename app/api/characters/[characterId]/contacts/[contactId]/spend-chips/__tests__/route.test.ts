/**
 * Tests for Spend Chips API endpoint
 *
 * Tests:
 * - POST /api/characters/[characterId]/contacts/[contactId]/spend-chips
 *   - dice-bonus action: validation, balance check, max cap, success
 *   - loyalty-improvement action: validation, blocked, family discount, success
 *   - shared: auth, resource lookups, org rejection, invalid action, errors
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
}));

vi.mock("@/lib/storage/contacts", () => ({
  getCharacterContact: vi.fn(),
  updateCharacterContact: vi.fn(),
}));

vi.mock("@/lib/storage/favor-ledger", () => ({
  addFavorTransaction: vi.fn(),
}));

vi.mock("@/lib/rules/chips", () => ({
  calculateChipDiceBonus: vi.fn(),
  calculateLoyaltyImprovementCost: vi.fn(),
}));

vi.mock("@/lib/rules/relationship-qualities", () => ({
  getChipCostModifier: vi.fn(),
}));

vi.mock("@/lib/rules/group-contacts", () => ({
  canOrganizationCallFavor: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { getCharacterContact, updateCharacterContact } from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import { calculateChipDiceBonus, calculateLoyaltyImprovementCost } from "@/lib/rules/chips";
import { getChipCostModifier } from "@/lib/rules/relationship-qualities";
import { canOrganizationCallFavor } from "@/lib/rules/group-contacts";
import { POST } from "../route";
import type { Character, User } from "@/lib/types";
import type { SocialContact, FavorTransaction } from "@/lib/types/contacts";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_CHARACTER_ID = "test-char-456";
const TEST_CONTACT_ID = "contact-789";

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: TEST_USER_ID,
    username: "testuser",
    email: "test@example.com",
    passwordHash: "hashedpassword",
    role: "player",
    createdAt: new Date().toISOString(),
    ...overrides,
  } as User;
}

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Test Runner",
    status: "active",
    editionCode: "sr5",
    nuyen: 5000,
    karmaCurrent: 10,
    karmaTotal: 10,
    createdAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

function createMockContact(overrides: Partial<SocialContact> = {}): SocialContact {
  return {
    id: TEST_CONTACT_ID,
    characterId: TEST_CHARACTER_ID,
    name: "Fixer",
    connection: 4,
    loyalty: 3,
    archetype: "Fixer",
    status: "active",
    favorBalance: 5,
    group: "personal",
    visibility: {
      playerVisible: true,
      showConnection: true,
      showLoyalty: true,
      showFavorBalance: true,
      showSpecializations: true,
    },
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockTransaction(overrides: Partial<FavorTransaction> = {}): FavorTransaction {
  return {
    id: "trans-001",
    characterId: TEST_CHARACTER_ID,
    contactId: TEST_CONTACT_ID,
    type: "chip_spent_dice_bonus",
    description: "Spent chips",
    favorChange: -2,
    requiresGmApproval: false,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function createMockRequest(body: unknown) {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/contacts/${TEST_CONTACT_ID}/spend-chips`;
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function createParams() {
  return Promise.resolve({
    characterId: TEST_CHARACTER_ID,
    contactId: TEST_CONTACT_ID,
  });
}

/** Set up all mocks for a successful request path */
function setupSuccessfulMocks(contactOverrides: Partial<SocialContact> = {}) {
  const mockContact = createMockContact(contactOverrides);
  vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
  vi.mocked(getUserById).mockResolvedValue(createMockUser());
  vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
  vi.mocked(getCharacterContact).mockResolvedValue(mockContact);
  vi.mocked(canOrganizationCallFavor).mockReturnValue({ allowed: true });
  return mockContact;
}

// =============================================================================
// TESTS
// =============================================================================

describe("POST /api/characters/[characterId]/contacts/[contactId]/spend-chips", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Auth/Resource Tests
  // ---------------------------------------------------------------------------

  describe("Auth/Resource Tests", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 2 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(null);

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 2 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });

    it("should return 404 when character not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(null);

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 2 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Character not found");
    });

    it("should return 404 when contact not found", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockResolvedValue(createMockCharacter());
      vi.mocked(getCharacterContact).mockResolvedValue(null);

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 2 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Contact not found");
    });

    it("should return 400 for organization contacts", async () => {
      setupSuccessfulMocks({ group: "organization" });
      vi.mocked(canOrganizationCallFavor).mockReturnValue({
        allowed: false,
        reason: "Organization contacts cannot use favors or chips",
      });

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 2 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Organization");
    });

    it("should return 400 for invalid action", async () => {
      setupSuccessfulMocks();

      const response = await POST(createMockRequest({ action: "invalid-action" }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Invalid action");
    });

    it("should return 500 on unexpected error", async () => {
      vi.mocked(getSession).mockResolvedValue(TEST_USER_ID);
      vi.mocked(getUserById).mockResolvedValue(createMockUser());
      vi.mocked(getCharacter).mockRejectedValue(new Error("Storage error"));

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 2 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to spend chips");
    });
  });

  // ---------------------------------------------------------------------------
  // Dice Bonus Tests
  // ---------------------------------------------------------------------------

  describe("Dice Bonus Action", () => {
    it("should return 400 when chipsToSpend is missing", async () => {
      setupSuccessfulMocks();

      const response = await POST(createMockRequest({ action: "dice-bonus" }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("positive integer");
    });

    it("should return 400 when chipsToSpend is zero", async () => {
      setupSuccessfulMocks();

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 0 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("positive integer");
    });

    it("should return 400 when chipsToSpend is negative", async () => {
      setupSuccessfulMocks();

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: -1 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("positive integer");
    });

    it("should return 400 when chipsToSpend is not an integer", async () => {
      setupSuccessfulMocks();

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 1.5 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("positive integer");
    });

    it("should return 400 when chipsToSpend exceeds max of 4", async () => {
      setupSuccessfulMocks();

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 5 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Cannot spend more than 4");
    });

    it("should return 400 when insufficient chip balance", async () => {
      setupSuccessfulMocks({ favorBalance: 1 });

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 3 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Insufficient chip balance");
    });

    it("should succeed and return dice bonus", async () => {
      const mockContact = setupSuccessfulMocks({ favorBalance: 5 });
      const updatedContact = createMockContact({ favorBalance: 3 });
      const mockTransaction = createMockTransaction();

      vi.mocked(calculateChipDiceBonus).mockReturnValue(2);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const response = await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 2 }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.diceBonus).toBe(2);
      expect(data.chipsSpent).toBe(2);
      expect(data.contact).toBeDefined();
      expect(data.transaction).toBeDefined();
    });

    it("should deduct chips from contact favor balance", async () => {
      setupSuccessfulMocks({ favorBalance: 5 });
      const updatedContact = createMockContact({ favorBalance: 2 });

      vi.mocked(calculateChipDiceBonus).mockReturnValue(3);
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(createMockTransaction());

      await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 3 }), {
        params: createParams(),
      });

      expect(updateCharacterContact).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        TEST_CONTACT_ID,
        expect.objectContaining({ favorBalance: 2 })
      );
    });

    it("should record chip_spent_dice_bonus transaction", async () => {
      setupSuccessfulMocks({ favorBalance: 5 });

      vi.mocked(calculateChipDiceBonus).mockReturnValue(2);
      vi.mocked(updateCharacterContact).mockResolvedValue(createMockContact());
      vi.mocked(addFavorTransaction).mockResolvedValue(createMockTransaction());

      await POST(createMockRequest({ action: "dice-bonus", chipsToSpend: 2 }), {
        params: createParams(),
      });

      expect(addFavorTransaction).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          contactId: TEST_CONTACT_ID,
          type: "chip_spent_dice_bonus",
          favorChange: -2,
        })
      );
    });

    it("should include notes in transaction description", async () => {
      setupSuccessfulMocks({ favorBalance: 5 });

      vi.mocked(calculateChipDiceBonus).mockReturnValue(2);
      vi.mocked(updateCharacterContact).mockResolvedValue(createMockContact());
      vi.mocked(addFavorTransaction).mockResolvedValue(createMockTransaction());

      await POST(
        createMockRequest({
          action: "dice-bonus",
          chipsToSpend: 2,
          notes: "Negotiating with Mr. Johnson",
        }),
        { params: createParams() }
      );

      expect(addFavorTransaction).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          description: expect.stringContaining("Negotiating with Mr. Johnson"),
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Loyalty Improvement Tests
  // ---------------------------------------------------------------------------

  describe("Loyalty Improvement Action", () => {
    it("should return 400 when targetLoyalty is missing", async () => {
      setupSuccessfulMocks();

      const response = await POST(createMockRequest({ action: "loyalty-improvement" }), {
        params: createParams(),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("targetLoyalty is required");
    });

    it("should return 400 when loyalty improvement is blocked", async () => {
      setupSuccessfulMocks({ loyaltyImprovementBlocked: true });

      const response = await POST(
        createMockRequest({ action: "loyalty-improvement", targetLoyalty: 4 }),
        { params: createParams() }
      );
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("permanently blocked");
    });

    it("should return 400 when loyalty improvement is invalid", async () => {
      setupSuccessfulMocks({ loyalty: 3 });
      vi.mocked(calculateLoyaltyImprovementCost).mockReturnValue({
        valid: false,
        chipsRequired: 0,
        downtimeWeeks: 0,
        reason: "Loyalty can only be improved one level at a time (3 → 4)",
      });

      const response = await POST(
        createMockRequest({ action: "loyalty-improvement", targetLoyalty: 6 }),
        { params: createParams() }
      );
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("one level at a time");
    });

    it("should return 400 when insufficient balance after family discount", async () => {
      setupSuccessfulMocks({ loyalty: 3, favorBalance: 2 });
      vi.mocked(calculateLoyaltyImprovementCost).mockReturnValue({
        valid: true,
        chipsRequired: 4,
        downtimeWeeks: 4,
      });
      vi.mocked(getChipCostModifier).mockReturnValue({
        adjustedCost: 3,
        reason: "Family discount: −1 chip",
      });

      const response = await POST(
        createMockRequest({ action: "loyalty-improvement", targetLoyalty: 4 }),
        { params: createParams() }
      );
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Insufficient chip balance");
      expect(data.error).toContain("have 2, need 3");
    });

    it("should succeed with standard cost", async () => {
      setupSuccessfulMocks({ loyalty: 3, favorBalance: 5 });
      const updatedContact = createMockContact({ loyalty: 4, favorBalance: 1 });
      const mockTransaction = createMockTransaction({ type: "chip_spent_loyalty" });

      vi.mocked(calculateLoyaltyImprovementCost).mockReturnValue({
        valid: true,
        chipsRequired: 4,
        downtimeWeeks: 4,
      });
      vi.mocked(getChipCostModifier).mockReturnValue({
        adjustedCost: 4,
        reason: "No quality modifier",
      });
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const response = await POST(
        createMockRequest({ action: "loyalty-improvement", targetLoyalty: 4 }),
        { params: createParams() }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.newLoyalty).toBe(4);
      expect(data.chipsSpent).toBe(4);
    });

    it("should apply family discount to chip cost", async () => {
      setupSuccessfulMocks({
        loyalty: 3,
        favorBalance: 5,
        relationshipQualities: ["family"],
      });
      const updatedContact = createMockContact({ loyalty: 4, favorBalance: 2 });
      const mockTransaction = createMockTransaction({ type: "chip_spent_loyalty" });

      vi.mocked(calculateLoyaltyImprovementCost).mockReturnValue({
        valid: true,
        chipsRequired: 4,
        downtimeWeeks: 4,
      });
      vi.mocked(getChipCostModifier).mockReturnValue({
        adjustedCost: 3, // 4 - 1 family discount
        reason: "Family discount: −1 chip",
      });
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(mockTransaction);

      const response = await POST(
        createMockRequest({ action: "loyalty-improvement", targetLoyalty: 4 }),
        { params: createParams() }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.chipsSpent).toBe(3);
    });

    it("should update contact loyalty and deduct chips", async () => {
      setupSuccessfulMocks({ loyalty: 3, favorBalance: 5 });
      const updatedContact = createMockContact({ loyalty: 4, favorBalance: 1 });

      vi.mocked(calculateLoyaltyImprovementCost).mockReturnValue({
        valid: true,
        chipsRequired: 4,
        downtimeWeeks: 4,
      });
      vi.mocked(getChipCostModifier).mockReturnValue({
        adjustedCost: 4,
        reason: "No quality modifier",
      });
      vi.mocked(updateCharacterContact).mockResolvedValue(updatedContact);
      vi.mocked(addFavorTransaction).mockResolvedValue(createMockTransaction());

      await POST(createMockRequest({ action: "loyalty-improvement", targetLoyalty: 4 }), {
        params: createParams(),
      });

      expect(updateCharacterContact).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        TEST_CONTACT_ID,
        expect.objectContaining({
          favorBalance: 1, // 5 - 4
          loyalty: 4,
        })
      );
    });

    it("should record chip_spent_loyalty transaction", async () => {
      setupSuccessfulMocks({ loyalty: 3, favorBalance: 5 });

      vi.mocked(calculateLoyaltyImprovementCost).mockReturnValue({
        valid: true,
        chipsRequired: 4,
        downtimeWeeks: 4,
      });
      vi.mocked(getChipCostModifier).mockReturnValue({
        adjustedCost: 4,
        reason: "No quality modifier",
      });
      vi.mocked(updateCharacterContact).mockResolvedValue(createMockContact());
      vi.mocked(addFavorTransaction).mockResolvedValue(createMockTransaction());

      await POST(createMockRequest({ action: "loyalty-improvement", targetLoyalty: 4 }), {
        params: createParams(),
      });

      expect(addFavorTransaction).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          contactId: TEST_CONTACT_ID,
          type: "chip_spent_loyalty",
          favorChange: -4,
          loyaltyChange: 1,
        })
      );
    });

    it("should include family discount reason in description when cost adjusted", async () => {
      setupSuccessfulMocks({
        loyalty: 3,
        favorBalance: 5,
        relationshipQualities: ["family"],
      });

      vi.mocked(calculateLoyaltyImprovementCost).mockReturnValue({
        valid: true,
        chipsRequired: 4,
        downtimeWeeks: 4,
      });
      vi.mocked(getChipCostModifier).mockReturnValue({
        adjustedCost: 3,
        reason: "Family discount: −1 chip",
      });
      vi.mocked(updateCharacterContact).mockResolvedValue(createMockContact());
      vi.mocked(addFavorTransaction).mockResolvedValue(createMockTransaction());

      await POST(createMockRequest({ action: "loyalty-improvement", targetLoyalty: 4 }), {
        params: createParams(),
      });

      expect(addFavorTransaction).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          description: expect.stringContaining("Family discount"),
        })
      );
    });

    it("should include notes in loyalty improvement description", async () => {
      setupSuccessfulMocks({ loyalty: 3, favorBalance: 5 });

      vi.mocked(calculateLoyaltyImprovementCost).mockReturnValue({
        valid: true,
        chipsRequired: 4,
        downtimeWeeks: 4,
      });
      vi.mocked(getChipCostModifier).mockReturnValue({
        adjustedCost: 4,
        reason: "No quality modifier",
      });
      vi.mocked(updateCharacterContact).mockResolvedValue(createMockContact());
      vi.mocked(addFavorTransaction).mockResolvedValue(createMockTransaction());

      await POST(
        createMockRequest({
          action: "loyalty-improvement",
          targetLoyalty: 4,
          notes: "Earned trust during the run",
        }),
        { params: createParams() }
      );

      expect(addFavorTransaction).toHaveBeenCalledWith(
        TEST_USER_ID,
        TEST_CHARACTER_ID,
        expect.objectContaining({
          description: expect.stringContaining("Earned trust during the run"),
        })
      );
    });
  });
});
