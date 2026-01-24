/**
 * Tests for /api/characters/[characterId]/matrix endpoint
 *
 * Tests getting and updating character's matrix equipment (cyberdecks, commlinks, programs)
 * including authentication, validation, and audit trail creation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PATCH } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as charactersModule from "@/lib/storage/characters";
import * as cyberdeckValidator from "@/lib/rules/matrix/cyberdeck-validator";
import type { Character } from "@/lib/types";
import type { User } from "@/lib/types/user";
import type { CharacterProgram } from "@/lib/types/programs";
import type {
  CyberdeckAttributeConfig,
  CharacterCyberdeck,
  CharacterCommlink,
} from "@/lib/types/matrix";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/matrix/cyberdeck-validator");

// Helper to create a NextRequest for PATCH
function createPatchRequest(characterId: string, body?: unknown): NextRequest {
  const headers = new Headers();
  if (body) {
    headers.set("Content-Type", "application/json");
  }

  const request = new NextRequest(`http://localhost:3000/api/characters/${characterId}/matrix`, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

// Helper to create a NextRequest for GET
function createGetRequest(characterId: string): NextRequest {
  return new NextRequest(`http://localhost:3000/api/characters/${characterId}/matrix`, {
    method: "GET",
  });
}

// Mock data factories
function createMockCharacter(overrides?: Partial<Character>): Character {
  return {
    id: "test-char-id",
    ownerId: "test-user-id",
    name: "Test Decker",
    editionCode: "sr5",
    creationMethod: "priority",
    attributesPurchased: {
      body: 3,
      agility: 3,
      reaction: 4,
      strength: 2,
      willpower: 4,
      logic: 6,
      intuition: 4,
      charisma: 2,
      edge: 3,
    },
    attributesAugmented: {},
    skills: {},
    qualities: [],
    contacts: [],
    inventory: [],
    karma: { available: 0, spent: 0, total: 0 },
    nuyen: 5000,
    essence: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    cyberdecks: [],
    commlinks: [],
    programs: [],
    ...overrides,
  } as Character;
}

function createMockCyberdeck(overrides?: Partial<CharacterCyberdeck>): CharacterCyberdeck {
  return {
    id: "deck-1",
    catalogId: "erika-mcd-1",
    name: "Erika MCD-1",
    deviceRating: 1,
    attributeArray: [4, 3, 2, 1],
    currentConfig: { attack: 1, sleaze: 2, dataProcessing: 4, firewall: 3 },
    programSlots: 2,
    loadedPrograms: [],
    cost: 49500,
    availability: 3,
    ...overrides,
  };
}

function createMockCommlink(overrides?: Partial<CharacterCommlink>): CharacterCommlink {
  return {
    id: "commlink-1",
    catalogId: "meta-link",
    name: "Meta Link",
    deviceRating: 1,
    dataProcessing: 1,
    firewall: 1,
    cost: 100,
    availability: 2,
    ...overrides,
  };
}

// Helper to create mock programs
function createMockProgram(overrides?: Partial<CharacterProgram>): CharacterProgram {
  return {
    catalogId: "browse",
    name: "Browse",
    category: "common",
    cost: 80,
    availability: 1,
    ...overrides,
  };
}

// Helper to create full User mock
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "hashed-password",
    role: ["user"],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
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

describe("/api/characters/[characterId]/matrix", () => {
  const mockUserId = "test-user-id";
  const mockUser = createMockUser({ id: mockUserId });
  const mockDeck = createMockCyberdeck();
  const mockCommlink = createMockCommlink();
  const mockCharacter = createMockCharacter({
    cyberdecks: [mockDeck],
    commlinks: [mockCommlink],
    programs: [
      createMockProgram({ catalogId: "browse", name: "Browse" }),
      createMockProgram({ catalogId: "edit", name: "Edit" }),
    ],
  });

  const validConfig: CyberdeckAttributeConfig = {
    attack: 4,
    sleaze: 3,
    dataProcessing: 2,
    firewall: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([mockDeck]);
    vi.mocked(cyberdeckValidator.getCharacterCommlinks).mockReturnValue([mockCommlink]);
    vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue(mockDeck);
    vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
      effectiveAttributes: validConfig,
    });
  });

  // =============================================================================
  // GET - Get Matrix Equipment
  // =============================================================================

  describe("GET /api/characters/[characterId]/matrix", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(null);

      const request = createGetRequest("test-char-id");
      const response = await GET(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(null);

      const request = createGetRequest("test-char-id");
      const response = await GET(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });

    it("should return 404 when character not found", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(null);

      const request = createGetRequest("non-existent-id");
      const response = await GET(request, {
        params: Promise.resolve({ characterId: "non-existent-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user doesn't own character", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue({
        ...mockCharacter,
        ownerId: "different-user-id",
      });

      const request = createGetRequest("test-char-id");
      const response = await GET(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized to view this character");
    });

    it("should return empty arrays when no matrix equipment", async () => {
      const emptyCharacter = createMockCharacter({
        cyberdecks: [],
        commlinks: [],
        programs: [],
      });

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(emptyCharacter);
      vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([]);
      vi.mocked(cyberdeckValidator.getCharacterCommlinks).mockReturnValue([]);
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue(null);

      const request = createGetRequest("test-char-id");
      const response = await GET(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cyberdecks).toEqual([]);
      expect(data.commlinks).toEqual([]);
      expect(data.programs).toEqual([]);
    });

    it("should return cyberdecks with current config", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);

      const request = createGetRequest("test-char-id");
      const response = await GET(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cyberdecks).toHaveLength(1);
      expect(data.cyberdecks[0].name).toBe("Erika MCD-1");
      expect(data.cyberdecks[0].currentConfig).toEqual({
        attack: 1,
        sleaze: 2,
        dataProcessing: 4,
        firewall: 3,
      });
    });

    it("should return commlinks with derived stats", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);

      const request = createGetRequest("test-char-id");
      const response = await GET(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.commlinks).toHaveLength(1);
      expect(data.commlinks[0].name).toBe("Meta Link");
      expect(data.commlinks[0].dataProcessing).toBe(1); // Derived from device rating
      expect(data.commlinks[0].firewall).toBe(1);
    });

    it("should return programs with loaded status", async () => {
      const deckWithLoaded = createMockCyberdeck({
        loadedPrograms: ["browse"],
      });
      const charWithLoadedPrograms = createMockCharacter({
        cyberdecks: [deckWithLoaded],
        programs: [
          createMockProgram({ catalogId: "browse", name: "Browse" }),
          createMockProgram({ catalogId: "edit", name: "Edit" }),
        ],
      });

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(charWithLoadedPrograms);
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue(deckWithLoaded);

      const request = createGetRequest("test-char-id");
      const response = await GET(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.programs).toHaveLength(2);
      expect(
        data.programs.find((p: { catalogId: string }) => p.catalogId === "browse").loaded
      ).toBe(true);
      expect(data.programs.find((p: { catalogId: string }) => p.catalogId === "edit").loaded).toBe(
        false
      );
    });

    it("should use first deck as active when no active device set", async () => {
      const charWithoutActiveDevice = createMockCharacter({
        cyberdecks: [mockDeck],
        activeMatrixDeviceId: undefined,
      });

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(charWithoutActiveDevice);
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue(mockDeck);

      const request = createGetRequest("test-char-id");
      const response = await GET(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.cyberdecks[0].id).toBe("deck-1");
    });
  });

  // =============================================================================
  // PATCH - Update Matrix State
  // =============================================================================

  describe("PATCH /api/characters/[characterId]/matrix", () => {
    it("should return 401 when not authenticated", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(null);

      const request = createPatchRequest("test-char-id", { deckConfig: validConfig });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(null);

      const request = createPatchRequest("test-char-id", { deckConfig: validConfig });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("User not found");
    });

    it("should return 404 when character not found", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(null);

      const request = createPatchRequest("non-existent-id", { deckConfig: validConfig });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "non-existent-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Character not found");
    });

    it("should return 403 when user doesn't own character", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue({
        ...mockCharacter,
        ownerId: "different-user-id",
      });

      const request = createPatchRequest("test-char-id", { deckConfig: validConfig });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe("Not authorized to modify this character");
    });

    it("should return 400 when no active cyberdeck for deckConfig update", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(
        createMockCharacter({ cyberdecks: [] })
      );
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue(null);

      const request = createPatchRequest("test-char-id", { deckConfig: validConfig });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("No active cyberdeck to configure");
    });

    it("should return 400 for invalid deck config", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue(mockDeck);
      vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
        valid: false,
        errors: [
          {
            code: "ATTRIBUTE_MISMATCH",
            message: "Configuration values do not match attribute array",
          },
        ],
        warnings: [],
        effectiveAttributes: validConfig,
      });

      const invalidConfig = { attack: 5, sleaze: 5, dataProcessing: 5, firewall: 5 };
      const request = createPatchRequest("test-char-id", { deckConfig: invalidConfig });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid deck configuration");
      expect(data.validationErrors).toContain("Configuration values do not match attribute array");
    });

    it("should update deck config successfully", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue(mockDeck);
      vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
        valid: true,
        errors: [],
        warnings: [],
        effectiveAttributes: validConfig,
      });
      vi.mocked(charactersModule.updateCharacterWithAudit).mockResolvedValue({
        ...mockCharacter,
        cyberdecks: [{ ...mockDeck, currentConfig: validConfig }],
      });
      vi.mocked(charactersModule.getCharacter)
        .mockResolvedValueOnce(mockCharacter) // First call
        .mockResolvedValueOnce({
          ...mockCharacter,
          cyberdecks: [{ ...mockDeck, currentConfig: validConfig }],
        }); // Second call after update

      const request = createPatchRequest("test-char-id", { deckConfig: validConfig });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(charactersModule.updateCharacterWithAudit).toHaveBeenCalled();
    });

    it("should return 400 when program slots exceeded", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue({
        ...mockDeck,
        programSlots: 2,
        loadedPrograms: [],
      });

      const request = createPatchRequest("test-char-id", {
        loadPrograms: ["prog1", "prog2", "prog3", "prog4"],
      });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Cannot load");
      expect(data.error).toContain("slots available");
    });

    it("should load programs successfully", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue({
        ...mockDeck,
        programSlots: 4,
        loadedPrograms: [],
      });
      vi.mocked(charactersModule.updateCharacterWithAudit).mockResolvedValue({
        ...mockCharacter,
        cyberdecks: [{ ...mockDeck, loadedPrograms: ["browse", "edit"] }],
      });
      vi.mocked(charactersModule.getCharacter)
        .mockResolvedValueOnce(mockCharacter)
        .mockResolvedValueOnce({
          ...mockCharacter,
          cyberdecks: [{ ...mockDeck, loadedPrograms: ["browse", "edit"] }],
        });

      const request = createPatchRequest("test-char-id", {
        loadPrograms: ["browse", "edit"],
      });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(charactersModule.updateCharacterWithAudit).toHaveBeenCalled();
    });

    it("should unload programs successfully", async () => {
      const deckWithLoadedPrograms = {
        ...mockDeck,
        loadedPrograms: ["browse", "edit"],
      };
      const charWithLoadedPrograms = {
        ...mockCharacter,
        cyberdecks: [deckWithLoadedPrograms],
      };

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(charWithLoadedPrograms);
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue(deckWithLoadedPrograms);
      vi.mocked(charactersModule.updateCharacterWithAudit).mockResolvedValue({
        ...mockCharacter,
        cyberdecks: [{ ...mockDeck, loadedPrograms: ["browse"] }],
      });
      vi.mocked(charactersModule.getCharacter)
        .mockResolvedValueOnce(charWithLoadedPrograms)
        .mockResolvedValueOnce({
          ...mockCharacter,
          cyberdecks: [{ ...mockDeck, loadedPrograms: ["browse"] }],
        });

      const request = createPatchRequest("test-char-id", {
        unloadPrograms: ["edit"],
      });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(charactersModule.updateCharacterWithAudit).toHaveBeenCalled();
    });

    it("should skip already-loaded programs when loading", async () => {
      const deckWithSomeLoaded = {
        ...mockDeck,
        programSlots: 3,
        loadedPrograms: ["browse"],
      };
      const charWithSomeLoaded = {
        ...mockCharacter,
        cyberdecks: [deckWithSomeLoaded],
      };

      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(charWithSomeLoaded);
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue(deckWithSomeLoaded);
      vi.mocked(charactersModule.updateCharacterWithAudit).mockResolvedValue({
        ...mockCharacter,
        cyberdecks: [{ ...mockDeck, loadedPrograms: ["browse", "edit"] }],
      });
      vi.mocked(charactersModule.getCharacter)
        .mockResolvedValueOnce(charWithSomeLoaded)
        .mockResolvedValueOnce({
          ...mockCharacter,
          cyberdecks: [{ ...mockDeck, loadedPrograms: ["browse", "edit"] }],
        });

      const request = createPatchRequest("test-char-id", {
        loadPrograms: ["browse", "edit"], // browse is already loaded
      });
      const response = await PATCH(request, {
        params: Promise.resolve({ characterId: "test-char-id" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("should create audit trail for changes", async () => {
      vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
      vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
      vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
      vi.mocked(cyberdeckValidator.getActiveCyberdeck).mockReturnValue(mockDeck);
      vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
        valid: true,
        errors: [],
        warnings: [],
        effectiveAttributes: validConfig,
      });
      vi.mocked(charactersModule.updateCharacterWithAudit).mockResolvedValue(mockCharacter);

      const request = createPatchRequest("test-char-id", { deckConfig: validConfig });
      await PATCH(request, { params: Promise.resolve({ characterId: "test-char-id" }) });

      expect(charactersModule.updateCharacterWithAudit).toHaveBeenCalledWith(
        mockUserId,
        "test-char-id",
        expect.objectContaining({
          cyberdecks: expect.any(Array),
        }),
        expect.objectContaining({
          action: "updated",
          actor: { userId: mockUserId, role: "owner" },
          details: expect.objectContaining({
            deckConfigChange: expect.any(Object),
          }),
          note: "Matrix equipment configuration updated",
        })
      );
    });
  });
});
