/**
 * Tests for /api/matrix/validate endpoint
 *
 * Tests matrix configuration validation (cyberdeck ASDF + programs)
 * including authentication, validation, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as charactersModule from "@/lib/storage/characters";
import * as cyberdeckValidator from "@/lib/rules/matrix/cyberdeck-validator";
import * as programValidator from "@/lib/rules/matrix/program-validator";
import type { Character } from "@/lib/types";
import type { User } from "@/lib/types/user";
import type { CyberdeckAttributeConfig, CharacterCyberdeck } from "@/lib/types/matrix";
import type { LoadedRuleset } from "@/lib/rules/loader-types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/loader", () => ({
  loadRuleset: vi.fn(),
}));
vi.mock("@/lib/rules/matrix/cyberdeck-validator");
vi.mock("@/lib/rules/matrix/program-validator");

// Helper to create a NextRequest with JSON body
function createMockRequest(body?: unknown): NextRequest {
  const headers = new Headers();
  if (body) {
    headers.set("Content-Type", "application/json");
  }

  const request = new NextRequest("http://localhost:3000/api/matrix/validate", {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
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
    cyberdecks: [
      {
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
      },
    ],
    programs: [
      { catalogId: "browse", name: "Browse" },
      { catalogId: "edit", name: "Edit" },
    ],
    ...overrides,
  } as Character;
}

function createMockRuleset(): LoadedRuleset {
  return {
    edition: {} as LoadedRuleset["edition"],
    books: [],
    creationMethods: [],
  };
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
    ...overrides,
  };
}

describe("POST /api/matrix/validate", () => {
  const mockUserId = "test-user-id";
  const mockUser = createMockUser({ id: mockUserId });
  const mockCharacter = createMockCharacter();
  const mockDeck = createMockCyberdeck();
  const mockRuleset = createMockRuleset();

  const validConfig: CyberdeckAttributeConfig = {
    attack: 1,
    sleaze: 2,
    dataProcessing: 4,
    firewall: 3,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default successful mocks
    vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([mockDeck]);
    vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
      effectiveAttributes: validConfig,
    });
    vi.mocked(programValidator.validateProgramAllocation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
      slotsUsed: 0,
      slotsRemaining: 2,
      slotsMax: 2,
    });
  });

  // =============================================================================
  // Authentication Tests
  // =============================================================================

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
      config: validConfig,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
      config: validConfig,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("User not found");
  });

  // =============================================================================
  // Validation Tests - Missing Fields
  // =============================================================================

  it("should return 400 when characterId missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);

    const request = createMockRequest({
      deckId: "deck-1",
      config: validConfig,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("characterId is required");
  });

  it("should return 400 when deckId missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);

    const request = createMockRequest({
      characterId: "test-char-id",
      config: validConfig,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("deckId is required");
  });

  it("should return 400 when config missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);

    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("config is required");
  });

  // =============================================================================
  // Authorization Tests
  // =============================================================================

  it("should return 404 when character not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacter).mockResolvedValue(null);

    const request = createMockRequest({
      characterId: "non-existent-id",
      deckId: "deck-1",
      config: validConfig,
    });
    const response = await POST(request);
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

    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
      config: validConfig,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe("Not authorized to validate this character's config");
  });

  it("should return 404 when deck not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([mockDeck]);

    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "non-existent-deck",
      config: validConfig,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Cyberdeck not found");
  });

  // =============================================================================
  // Success Tests
  // =============================================================================

  it("should return valid=true for valid config without programs", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([mockDeck]);
    vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
      effectiveAttributes: validConfig,
    });

    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
      config: validConfig,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(true);
    expect(data.errors).toEqual([]);
    expect(data.warnings).toEqual([]);
    expect(data.effectiveStats).toEqual(validConfig);
  });

  it("should return valid=true for valid config with programs", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([mockDeck]);
    vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
      effectiveAttributes: validConfig,
    });

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(programValidator.validateProgramAllocation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
      slotsUsed: 2,
      slotsRemaining: 0,
      slotsMax: 2,
    });

    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
      config: validConfig,
      programIds: ["browse", "edit"],
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(true);
    expect(data.errors).toEqual([]);
    expect(programValidator.validateProgramAllocation).toHaveBeenCalledWith(
      mockCharacter,
      ["browse", "edit"],
      mockRuleset
    );
  });

  // =============================================================================
  // Validation Error Tests
  // =============================================================================

  it("should return errors for invalid ASDF config", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([mockDeck]);
    vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
      valid: false,
      errors: [
        {
          code: "ATTRIBUTE_MISMATCH",
          message:
            "Configuration values [5, 3, 2, 1] do not match attribute array [4, 3, 2, 1]. Each array value must be assigned to exactly one attribute.",
        },
      ],
      warnings: [],
      effectiveAttributes: { attack: 5, sleaze: 3, dataProcessing: 2, firewall: 1 },
    });

    const invalidConfig = { attack: 5, sleaze: 3, dataProcessing: 2, firewall: 1 };
    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
      config: invalidConfig,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(false);
    expect(data.errors).toHaveLength(1);
    expect(data.errors[0].code).toBe("ATTRIBUTE_MISMATCH");
  });

  it("should return warnings for high attributes", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([
      { ...mockDeck, attributeArray: [12, 10, 8, 6] },
    ]);
    vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [
        {
          code: "HIGH_ATTRIBUTE",
          message: "attack value of 12 is unusually high",
          field: "attack",
        },
      ],
      effectiveAttributes: { attack: 12, sleaze: 10, dataProcessing: 8, firewall: 6 },
    });

    const highConfig = { attack: 12, sleaze: 10, dataProcessing: 8, firewall: 6 };
    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
      config: highConfig,
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(true);
    expect(data.warnings).toHaveLength(1);
    expect(data.warnings[0].code).toBe("HIGH_ATTRIBUTE");
  });

  // =============================================================================
  // Program Validation Tests
  // =============================================================================

  it("should return 500 when ruleset fails to load", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([mockDeck]);
    vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
      effectiveAttributes: validConfig,
    });

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: false,
      error: "Failed to load ruleset",
    });

    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
      config: validConfig,
      programIds: ["browse"],
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to load ruleset");
  });

  it("should return errors for invalid program allocation", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([mockDeck]);
    vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
      effectiveAttributes: validConfig,
    });

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(programValidator.validateProgramAllocation).mockReturnValue({
      valid: false,
      errors: [
        {
          code: "EXCEEDS_PROGRAM_SLOTS",
          message: "Cannot load 5 programs. Cyberdeck only has 2 program slots.",
        },
      ],
      warnings: [],
      slotsUsed: 5,
      slotsRemaining: 0,
      slotsMax: 2,
    });

    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
      config: validConfig,
      programIds: ["browse", "edit", "toolbox", "encryption", "signal-scrub"],
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(false);
    expect(data.errors).toHaveLength(1);
    expect(data.errors[0].code).toBe("EXCEEDS_PROGRAM_SLOTS");
  });

  it("should return warnings for duplicate programs", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUserId);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(charactersModule.getCharacter).mockResolvedValue(mockCharacter);
    vi.mocked(cyberdeckValidator.getCharacterCyberdecks).mockReturnValue([mockDeck]);
    vi.mocked(cyberdeckValidator.validateCyberdeckConfig).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
      effectiveAttributes: validConfig,
    });

    const { loadRuleset } = await import("@/lib/rules/loader");
    vi.mocked(loadRuleset).mockResolvedValue({
      success: true,
      ruleset: mockRuleset,
    });
    vi.mocked(programValidator.validateProgramAllocation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [
        {
          code: "DUPLICATE_PROGRAMS",
          message: "Duplicate programs detected. Each program can only be loaded once.",
        },
      ],
      slotsUsed: 2,
      slotsRemaining: 0,
      slotsMax: 2,
    });

    const request = createMockRequest({
      characterId: "test-char-id",
      deckId: "deck-1",
      config: validConfig,
      programIds: ["browse", "browse"],
    });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.valid).toBe(true);
    expect(data.warnings).toHaveLength(1);
    expect(data.warnings[0].code).toBe("DUPLICATE_PROGRAMS");
  });
});
