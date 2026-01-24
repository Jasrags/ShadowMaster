/**
 * Integration tests for Admin Character Transition API endpoint
 *
 * Tests:
 * - GET /api/characters/[characterId]/admin/transition - Get available transitions
 * - POST /api/characters/[characterId]/admin/transition - Execute admin transition
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock dependencies
vi.mock("@/lib/auth/middleware", () => ({
  requireAdmin: vi.fn(),
}));

vi.mock("@/lib/storage/characters", () => ({
  getCharacterById: vi.fn(),
  updateCharacter: vi.fn(),
}));

vi.mock("@/lib/rules/character/state-machine", () => ({
  executeTransition: vi.fn(),
  validateCharacterComplete: vi.fn(),
}));

vi.mock("@/lib/storage/user-audit", () => ({
  createUserAuditEntry: vi.fn(),
}));

import { requireAdmin } from "@/lib/auth/middleware";
import { getCharacterById, updateCharacter } from "@/lib/storage/characters";
import { executeTransition, validateCharacterComplete } from "@/lib/rules/character/state-machine";
import { createUserAuditEntry } from "@/lib/storage/user-audit";
import { GET, POST } from "../route";
import type { Character } from "@/lib/types";
import type { PublicUser } from "@/lib/types/user";
import type { AuditEntry } from "@/lib/types/audit";
import type { ValidationWarning } from "@/lib/rules/character/state-machine";

// =============================================================================
// TEST DATA
// =============================================================================

const TEST_ADMIN_ID = "test-admin-123";
const TEST_OWNER_ID = "test-owner-456";
const TEST_CHARACTER_ID = "test-char-789";

function createMockAdmin(): PublicUser {
  return {
    id: TEST_ADMIN_ID,
    username: "admin",
    email: "admin@example.com",
    role: ["administrator"],
    preferences: {
      theme: "dark",
      navigationCollapsed: false,
    },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    characters: [],
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
  };
}

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_OWNER_ID,
    name: "Test Runner",
    status: "draft",
    editionCode: "sr5",
    editionId: "sr5-edition-id",
    creationMethodId: "priority",
    attachedBookIds: ["core-rulebook"],
    metatype: "Human",
    attributes: {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      willpower: 3,
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
    ...overrides,
  } as Character;
}

function createMockAuditEntry(action: AuditEntry["action"] = "finalized"): AuditEntry {
  return {
    id: "audit-1",
    timestamp: new Date().toISOString(),
    action,
    actor: { userId: TEST_ADMIN_ID, role: "admin" },
    details: {},
  };
}

function createMockWarning(code: string, message: string): ValidationWarning {
  return { code, message };
}

function createMockPostRequest(body: Record<string, unknown>): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/admin/transition`;
  return new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function createMockGetRequest(): NextRequest {
  const url = `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/admin/transition`;
  return new NextRequest(url, {
    method: "GET",
  });
}

// =============================================================================
// POST /api/characters/[characterId]/admin/transition
// =============================================================================

describe("POST /api/characters/[characterId]/admin/transition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // AUTHENTICATION TESTS
  // ===========================================================================

  describe("Authentication", () => {
    it("should return 403 when not admin", async () => {
      vi.mocked(requireAdmin).mockRejectedValue(new Error("Administrator access required"));

      const request = createMockPostRequest({ targetStatus: "active", note: "Test transition" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
      expect(data.error).toContain("required");
    });

    it("should return 403 when not authenticated", async () => {
      vi.mocked(requireAdmin).mockRejectedValue(new Error("Authentication required"));

      const request = createMockPostRequest({ targetStatus: "active", note: "Test transition" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  // ===========================================================================
  // VALIDATION TESTS
  // ===========================================================================

  describe("Validation", () => {
    it("should return 400 when targetStatus is missing", async () => {
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());

      const request = createMockPostRequest({ note: "Test transition" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("targetStatus is required");
    });

    it("should return 400 when note is missing", async () => {
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());

      const request = createMockPostRequest({ targetStatus: "active" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("note/reason is required");
    });

    it("should return 400 when note is empty", async () => {
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());

      const request = createMockPostRequest({ targetStatus: "active", note: "   " });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("note/reason is required");
    });
  });

  // ===========================================================================
  // CHARACTER NOT FOUND TESTS
  // ===========================================================================

  describe("Character lookup", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(null);

      const request = createMockPostRequest({ targetStatus: "active", note: "Test transition" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });
  });

  // ===========================================================================
  // VALIDATION OVERRIDE TESTS
  // ===========================================================================

  describe("Validation override", () => {
    it("should return 400 with canOverride when draft→active fails validation", async () => {
      const mockChar = createMockCharacter({ status: "draft" });
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(mockChar);
      vi.mocked(validateCharacterComplete).mockReturnValue({
        valid: false,
        errors: [{ code: "ATTR_INCOMPLETE", message: "Attributes incomplete" }],
        warnings: [],
      });

      const request = createMockPostRequest({ targetStatus: "active", note: "Force activation" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character validation failed");
      expect(data.canOverride).toBe(true);
      expect(data.errors).toHaveLength(1);
    });

    it("should allow transition with skipValidation when validation fails", async () => {
      const mockChar = createMockCharacter({ status: "draft" });
      const updatedChar = { ...mockChar, status: "active" as const };
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(mockChar);
      vi.mocked(validateCharacterComplete).mockReturnValue({
        valid: false,
        errors: [{ code: "ATTR_INCOMPLETE", message: "Attributes incomplete" }],
        warnings: [],
      });
      vi.mocked(executeTransition).mockResolvedValue({
        success: true,
        character: updatedChar,
        auditEntry: createMockAuditEntry("finalized"),
        warnings: [],
      });
      vi.mocked(updateCharacter).mockResolvedValue(updatedChar);
      vi.mocked(createUserAuditEntry).mockResolvedValue({
        id: "user-audit-1",
        timestamp: new Date().toISOString(),
        action: "admin_character_status_changed",
        actor: { userId: TEST_ADMIN_ID, role: "admin" },
        targetUserId: TEST_OWNER_ID,
        details: {},
      });

      const request = createMockPostRequest({
        targetStatus: "active",
        note: "Force activation",
        skipValidation: true,
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.transition.validationSkipped).toBe(true);
    });
  });

  // ===========================================================================
  // TRANSITION TESTS
  // ===========================================================================

  describe("Transition execution", () => {
    it("should return 400 when transition fails", async () => {
      const mockChar = createMockCharacter({ status: "active" });
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(mockChar);
      vi.mocked(executeTransition).mockResolvedValue({
        success: false,
        errors: [{ code: "INVALID_TRANSITION", message: "Cannot transition from active to draft" }],
        warnings: [],
      });

      const request = createMockPostRequest({ targetStatus: "draft", note: "Revert to draft" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Status transition failed");
      expect(data.errors).toBeDefined();
    });

    it("should return 200 on successful transition with audit entry", async () => {
      const mockChar = createMockCharacter({ status: "active" });
      const updatedChar = { ...mockChar, status: "retired" as const };
      const auditEntry = createMockAuditEntry("retired");
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(mockChar);
      vi.mocked(executeTransition).mockResolvedValue({
        success: true,
        character: updatedChar,
        auditEntry,
        warnings: [createMockWarning("WARN_TEST", "Some warning")],
      });
      vi.mocked(updateCharacter).mockResolvedValue(updatedChar);
      vi.mocked(createUserAuditEntry).mockResolvedValue({
        id: "user-audit-1",
        timestamp: new Date().toISOString(),
        action: "admin_character_status_changed",
        actor: { userId: TEST_ADMIN_ID, role: "admin" },
        targetUserId: TEST_OWNER_ID,
        details: {},
      });

      const request = createMockPostRequest({ targetStatus: "retired", note: "Character retired" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.character.status).toBe("retired");
      expect(data.auditEntry).toBeDefined();
      expect(data.transition.from).toBe("active");
      expect(data.transition.to).toBe("retired");
    });

    it("should create admin audit entry on successful transition", async () => {
      const mockChar = createMockCharacter({ status: "active" });
      const updatedChar = { ...mockChar, status: "deceased" as const };
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(mockChar);
      vi.mocked(executeTransition).mockResolvedValue({
        success: true,
        character: updatedChar,
        auditEntry: createMockAuditEntry("deceased"),
        warnings: [],
      });
      vi.mocked(updateCharacter).mockResolvedValue(updatedChar);
      vi.mocked(createUserAuditEntry).mockResolvedValue({
        id: "user-audit-1",
        timestamp: new Date().toISOString(),
        action: "admin_character_status_changed",
        actor: { userId: TEST_ADMIN_ID, role: "admin" },
        targetUserId: TEST_OWNER_ID,
        details: {},
      });

      const request = createMockPostRequest({
        targetStatus: "deceased",
        note: "Character death",
      });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      await POST(request, { params });

      expect(createUserAuditEntry).toHaveBeenCalledWith({
        action: "admin_character_status_changed",
        actor: { userId: TEST_ADMIN_ID, role: "admin" },
        targetUserId: TEST_OWNER_ID,
        details: expect.objectContaining({
          characterId: TEST_CHARACTER_ID,
          fromStatus: "active",
          toStatus: "deceased",
          note: "Character death",
        }),
      });
    });
  });

  // ===========================================================================
  // RESPONSE FORMAT TESTS
  // ===========================================================================

  describe("Response format", () => {
    it("should include transition from/to in response", async () => {
      const mockChar = createMockCharacter({ status: "draft" });
      const updatedChar = { ...mockChar, status: "active" as const };
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(mockChar);
      vi.mocked(validateCharacterComplete).mockReturnValue({
        valid: true,
        errors: [],
        warnings: [],
      });
      vi.mocked(executeTransition).mockResolvedValue({
        success: true,
        character: updatedChar,
        auditEntry: createMockAuditEntry("finalized"),
        warnings: [],
      });
      vi.mocked(updateCharacter).mockResolvedValue(updatedChar);
      vi.mocked(createUserAuditEntry).mockResolvedValue({
        id: "user-audit-1",
        timestamp: new Date().toISOString(),
        action: "admin_character_status_changed",
        actor: { userId: TEST_ADMIN_ID, role: "admin" },
        targetUserId: TEST_OWNER_ID,
        details: {},
      });

      const request = createMockPostRequest({ targetStatus: "active", note: "Activate character" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(data.transition).toEqual({
        from: "draft",
        to: "active",
        validationSkipped: false,
      });
    });
  });

  // ===========================================================================
  // ERROR HANDLING TESTS
  // ===========================================================================

  describe("Error handling", () => {
    it("should return 500 on unexpected error", async () => {
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockRejectedValue(new Error("Database error"));

      const request = createMockPostRequest({ targetStatus: "active", note: "Test" });
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await POST(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });
});

// =============================================================================
// GET /api/characters/[characterId]/admin/transition
// =============================================================================

describe("GET /api/characters/[characterId]/admin/transition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // AUTHENTICATION TESTS
  // ===========================================================================

  describe("Authentication", () => {
    it("should return 403 when not admin", async () => {
      vi.mocked(requireAdmin).mockRejectedValue(new Error("Administrator access required"));

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.success).toBe(false);
    });
  });

  // ===========================================================================
  // CHARACTER NOT FOUND TESTS
  // ===========================================================================

  describe("Character lookup", () => {
    it("should return 404 when character not found", async () => {
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(null);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Character not found");
    });
  });

  // ===========================================================================
  // TRANSITION LISTING TESTS
  // ===========================================================================

  describe("Available transitions", () => {
    it("should return available transitions for draft character", async () => {
      const mockChar = createMockCharacter({ status: "draft" });
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(mockChar);
      vi.mocked(validateCharacterComplete).mockReturnValue({
        valid: true,
        errors: [],
        warnings: [],
      });

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.currentStatus).toBe("draft");
      expect(data.transitions).toBeDefined();
      // Should have active, retired, deceased but not draft
      expect(data.transitions.find((t: { to: string }) => t.to === "draft")).toBeUndefined();
      expect(data.transitions.find((t: { to: string }) => t.to === "active")).toBeDefined();
    });

    it("should return available transitions for active character", async () => {
      const mockChar = createMockCharacter({ status: "active" });
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(mockChar);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.currentStatus).toBe("active");
      // Should have draft, retired, deceased but not active
      expect(data.transitions.find((t: { to: string }) => t.to === "active")).toBeUndefined();
      expect(data.transitions.find((t: { to: string }) => t.to === "draft")).toBeDefined();
      expect(data.transitions.find((t: { to: string }) => t.to === "retired")).toBeDefined();
    });

    it("should include validation info for draft characters", async () => {
      const mockChar = createMockCharacter({ status: "draft" });
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(mockChar);
      vi.mocked(validateCharacterComplete).mockReturnValue({
        valid: false,
        errors: [{ code: "INCOMPLETE", message: "Not complete" }],
        warnings: [createMockWarning("WARN_TEST", "Some warning")],
      });

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.validation).toBeDefined();
      expect(data.validation.valid).toBe(false);
      expect(data.validation.errors).toHaveLength(1);
      expect(data.validation.warnings).toHaveLength(1);
    });

    it("should exclude current status from transitions", async () => {
      const mockChar = createMockCharacter({ status: "retired" });
      vi.mocked(requireAdmin).mockResolvedValue(createMockAdmin());
      vi.mocked(getCharacterById).mockResolvedValue(mockChar);

      const request = createMockGetRequest();
      const params = Promise.resolve({ characterId: TEST_CHARACTER_ID });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.transitions.find((t: { to: string }) => t.to === "retired")).toBeUndefined();
    });
  });
});
