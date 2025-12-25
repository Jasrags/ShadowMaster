/**
 * Tests for the Quality Dynamic State API endpoint
 * /api/characters/[characterId]/qualities/[qualityId]/state
 */

import { NextRequest } from "next/server";
import { PATCH } from "../[qualityId]/state/route";
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
  updateQualityDynamicState: vi.fn(),
}));

import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateQualityDynamicState } from "@/lib/storage/characters";
import type { Character, User } from "@/lib/types";

// Helper to create mock request
function createMockRequest(characterId: string, qualityId: string, body: unknown): NextRequest {
  return new NextRequest(`http://localhost/api/characters/${characterId}/qualities/${qualityId}/state`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Sample test data
const mockUser: Partial<User> = {
  id: "user-1",
  username: "testuser",
};

const mockCharacter: Partial<Character> = {
  id: "char-1",
  ownerId: "user-1",
  name: "Test Character",
  status: "active",
  negativeQualities: [
    {
      qualityId: "addiction",
      id: "addiction-1",
      source: "creation",
      dynamicState: {
        type: "addiction",
        state: {
          substance: "Cram",
          substanceType: "physiological",
          severity: "moderate",
          originalSeverity: "mild",
          lastDose: new Date().toISOString(),
          nextCravingCheck: new Date().toISOString(),
          cravingActive: false,
          withdrawalActive: false,
          withdrawalPenalty: 0,
          daysClean: 0,
          recoveryAttempts: 0,
        }
      }
    }
  ]
};

describe("PATCH /api/characters/[characterId]/qualities/[qualityId]/state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Authentication & Authorization", () => {
    it("returns 401 if not authenticated", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const request = createMockRequest("char-1", "addiction", { severity: "severe" });
      const response = await PATCH(request, { 
        params: Promise.resolve({ characterId: "char-1", qualityId: "addiction" }) 
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it("returns 404 if character not found", async () => {
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(null);

      const request = createMockRequest("char-1", "addiction", { severity: "severe" });
      const response = await PATCH(request, { 
        params: Promise.resolve({ characterId: "char-1", qualityId: "addiction" }) 
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Character not found");
    });
  });

  describe("Update Logic", () => {
    it("updates quality dynamic state successfully", async () => {
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter as Character);
      
      const updatedChar = { ...mockCharacter };
      vi.mocked(updateQualityDynamicState).mockResolvedValue(updatedChar as Character);

      const request = createMockRequest("char-1", "addiction", { severity: "severe" });
      const response = await PATCH(request, { 
        params: Promise.resolve({ characterId: "char-1", qualityId: "addiction" }) 
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(updateQualityDynamicState).toHaveBeenCalledWith(
        "user-1",
        "char-1",
        "addiction",
        { severity: "severe" }
      );
    });

    it("returns 400 if update fails (e.g. quality not found)", async () => {
      vi.mocked(getSession).mockResolvedValue("user-1");
      vi.mocked(getUserById).mockResolvedValue(mockUser as User);
      vi.mocked(getCharacter).mockResolvedValue(mockCharacter as Character);
      
      vi.mocked(updateQualityDynamicState).mockRejectedValue(new Error("Quality not found or has no dynamic state"));

      const request = createMockRequest("char-1", "wrong-id", { severity: "severe" });
      const response = await PATCH(request, { 
        params: Promise.resolve({ characterId: "char-1", qualityId: "wrong-id" }) 
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Quality not found or has no dynamic state");
    });
  });
});
