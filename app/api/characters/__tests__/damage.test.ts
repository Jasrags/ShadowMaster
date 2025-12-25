/**
 * Tests for the Damage API endpoint
 * /api/characters/[characterId]/damage
 *
 * Verifies damage application, healing, overflow logic, and wound modifier calculation.
 */

import { NextRequest } from "next/server";
import { POST } from "../[characterId]/damage/route";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

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
import type { Character, User } from "@/lib/types";

// Helper to create mock request
function createMockRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/characters/char-1/damage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Sample test data
const mockUser: Partial<User> = {
  id: "user-1",
  username: "testuser",
  email: "test@example.com",
};

const mockCharacter: Partial<Character> = {
  id: "char-1",
  ownerId: "user-1",
  name: "Test Character",
  status: "active",
  attributes: {
    body: 4, // Physical monitor: 8 + ceil(4/2) = 10
    willpower: 4, // Stun monitor: 8 + ceil(4/2) = 10
  },
  condition: {
    physicalDamage: 0,
    stunDamage: 0,
    overflowDamage: 0,
  },
};

describe("POST /api/characters/[characterId]/damage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Authentication", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest({ type: "physical", amount: 3 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unauthorized");
    });

    it("returns 404 if user not found", async () => {
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(null);

      const request = createMockRequest({ type: "physical", amount: 3 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("User not found");
    });
  });

  describe("Authorization", () => {
    it("returns 404 if character not found", async () => {
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest({ type: "physical", amount: 3 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });
  });

  describe("Validation", () => {
    it("returns 400 for invalid damage type", async () => {
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter as Character);

      const request = createMockRequest({ type: "invalid", amount: 3 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Invalid damage type");
    });

    it("returns 400 if amount is not a number", async () => {
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter as Character);

      const request = createMockRequest({ type: "physical", amount: "three" });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Amount must be a number");
    });
  });

  describe("Damage Application", () => {
    it("applies physical damage correctly", async () => {
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter as Character);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue({
        ...mockCharacter,
        condition: { physicalDamage: 3, stunDamage: 0, overflowDamage: 0 },
      } as Character);

      const request = createMockRequest({ type: "physical", amount: 3 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.physicalDamage).toBe(3);
      expect(data.character.woundModifier).toBe(-1); // 3 boxes = -1
    });

    it("applies stun damage correctly", async () => {
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter as Character);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue({
        ...mockCharacter,
        condition: { physicalDamage: 0, stunDamage: 6, overflowDamage: 0 },
      } as Character);

      const request = createMockRequest({ type: "stun", amount: 6 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.stunDamage).toBe(6);
      expect(data.character.woundModifier).toBe(-2); // 6 boxes = -2
    });

    it("calculates wound modifier from both tracks", async () => {
      const charWithDamage = {
        ...mockCharacter,
        condition: { physicalDamage: 3, stunDamage: 0, overflowDamage: 0 },
      };
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(charWithDamage as Character);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue({
        ...charWithDamage,
        condition: { physicalDamage: 3, stunDamage: 3, overflowDamage: 0 },
      } as Character);

      const request = createMockRequest({ type: "stun", amount: 3 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.woundModifier).toBe(-2); // 3 physical + 3 stun = -2 total
    });
  });

  describe("Healing", () => {
    it("heals physical damage with negative amount", async () => {
      const wounded = {
        ...mockCharacter,
        condition: { physicalDamage: 5, stunDamage: 0, overflowDamage: 0 },
      };
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(wounded as Character);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue({
        ...wounded,
        condition: { physicalDamage: 2, stunDamage: 0, overflowDamage: 0 },
      } as Character);

      const request = createMockRequest({ type: "physical", amount: -3 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.physicalDamage).toBe(2);
    });

    it("does not heal below zero", async () => {
      const wounded = {
        ...mockCharacter,
        condition: { physicalDamage: 2, stunDamage: 0, overflowDamage: 0 },
      };
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(wounded as Character);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue({
        ...wounded,
        condition: { physicalDamage: 0, stunDamage: 0, overflowDamage: 0 },
      } as Character);

      const request = createMockRequest({ type: "physical", amount: -5 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.condition.physicalDamage).toBe(0);
    });
  });

  describe("Overflow Logic", () => {
    it("overflows physical damage to overflow track", async () => {
      // Physical monitor = 10 boxes
      // Applying 12 damage should fill physical and add 2 to overflow
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter as Character);

      // The actual overflow logic is in applyDamageWithOverflow
      // We capture the condition passed to updateCharacterWithAudit
      let capturedCondition: unknown;
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_userId, _charId, updates) => {
        capturedCondition = updates.condition;
        return {
          ...mockCharacter,
          condition: updates.condition,
        } as Character;
      });

      const request = createMockRequest({ type: "physical", amount: 12 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // Physical should be capped at max (10)
      expect((capturedCondition as { physicalDamage: number }).physicalDamage).toBe(10);
      // Overflow should have 2
      expect((capturedCondition as { overflowDamage: number }).overflowDamage).toBe(2);
      // Should report overflow
      expect(data.overflow).toBeDefined();
      expect(data.overflow.physical).toBe(2);
    });

    it("converts excess stun to physical damage", async () => {
      // Stun monitor = 10 boxes
      // Applying 12 stun should fill stun and add 2 physical
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter as Character);

      let capturedCondition: unknown;
      vi.mocked(updateCharacterWithAudit).mockImplementation(async (_userId, _charId, updates) => {
        capturedCondition = updates.condition;
        return {
          ...mockCharacter,
          condition: updates.condition,
        } as Character;
      });

      const request = createMockRequest({ type: "stun", amount: 12 });
      const response = await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // Stun should be capped at max (10)
      expect((capturedCondition as { stunDamage: number }).stunDamage).toBe(10);
      // Physical should have 2
      expect((capturedCondition as { physicalDamage: number }).physicalDamage).toBe(2);
      // Should report overflow
      expect(data.overflow).toBeDefined();
      expect(data.overflow.stun).toBe(2);
    });
  });

  describe("Audit Logging", () => {
    it("creates audit entry with correct action for damage", async () => {
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter as Character);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue({
        ...mockCharacter,
        condition: { physicalDamage: 3, stunDamage: 0, overflowDamage: 0 },
      } as Character);

      const request = createMockRequest({ type: "physical", amount: 3, source: "Ares Predator" });
      await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        "user-1",
        "char-1",
        expect.any(Object),
        expect.objectContaining({
          action: "damage_applied",
          actor: expect.objectContaining({
            userId: "user-1",
            role: "owner",
          }),
          details: expect.objectContaining({
            damageType: "physical",
            amount: 3,
            source: "Ares Predator",
          }),
          note: "Damage: Ares Predator",
        })
      );
    });

    it("creates audit entry with correct action for healing", async () => {
      const wounded = {
        ...mockCharacter,
        condition: { physicalDamage: 5, stunDamage: 0, overflowDamage: 0 },
      };
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(wounded as Character);
      vi.mocked(updateCharacterWithAudit).mockResolvedValue({
        ...wounded,
        condition: { physicalDamage: 2, stunDamage: 0, overflowDamage: 0 },
      } as Character);

      const request = createMockRequest({ type: "physical", amount: -3, source: "First Aid" });
      await POST(request, { params: Promise.resolve({ characterId: "char-1" }) });

      expect(updateCharacterWithAudit).toHaveBeenCalledWith(
        "user-1",
        "char-1",
        expect.any(Object),
        expect.objectContaining({
          action: "damage_healed",
          note: "Healing: First Aid",
        })
      );
    });
  });
});
