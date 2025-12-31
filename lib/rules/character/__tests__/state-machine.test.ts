/**
 * Tests for Character State Machine
 *
 * Tests lifecycle transitions, validation, and audit trail creation.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  VALID_TRANSITIONS,
  validateCharacterComplete,
  findTransition,
  isValidTransition,
  canActorPerformTransition,
  canTransition,
  executeTransition,
  createAuditEntry,
  appendAuditEntry,
  determineActorRole,
  type ValidationResult,
  type TransitionContext,
} from "../state-machine";
import type { Character, CharacterStatus } from "@/lib/types/character";

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-123",
    ownerId: "user-456",
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "priority",
    rulesetSnapshotId: "test-snapshot-id",
    attachedBookIds: ["sr5-core"],
    name: "Test Runner",
    metatype: "Human",
    status: "draft",
    attributes: {
      bod: 3,
      agi: 4,
      rea: 3,
      str: 2,
      wil: 3,
      log: 4,
      int: 3,
      cha: 3,
    },
    specialAttributes: {
      edge: 2,
      essence: 6,
    },
    skills: {
      pistols: 4,
      sneaking: 3,
    },
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
    },
    nuyen: 5000,
    startingNuyen: 50000,
    karmaTotal: 25,
    karmaCurrent: 0,
    karmaSpentAtCreation: 25,
    identities: [
      {
        id: "id-1",
        name: "John Smith",
        sin: { type: "fake", rating: 4 },
        licenses: [],
      },
    ],
    lifestyles: [
      {
        id: "ls-1",
        type: "low",
        monthlyCost: 2000,
      },
    ],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// =============================================================================
// TRANSITION TABLE TESTS
// =============================================================================

describe("VALID_TRANSITIONS", () => {
  it("should define all expected transitions", () => {
    expect(VALID_TRANSITIONS.length).toBeGreaterThan(0);

    // Check key transitions exist
    const draftToActive = VALID_TRANSITIONS.find(
      (t) => t.from === "draft" && t.to === "active"
    );
    expect(draftToActive).toBeDefined();
    expect(draftToActive?.validator).toBeDefined();

    const activeToRetired = VALID_TRANSITIONS.find(
      (t) => t.from === "active" && t.to === "retired"
    );
    expect(activeToRetired).toBeDefined();

    const activeToDeceased = VALID_TRANSITIONS.find(
      (t) => t.from === "active" && t.to === "deceased"
    );
    expect(activeToDeceased).toBeDefined();

    const retiredToActive = VALID_TRANSITIONS.find(
      (t) => t.from === "retired" && t.to === "active"
    );
    expect(retiredToActive).toBeDefined();

    const deceasedToActive = VALID_TRANSITIONS.find(
      (t) => t.from === "deceased" && t.to === "active"
    );
    expect(deceasedToActive).toBeDefined();
  });

  it("should not allow draft to retired transition", () => {
    const draftToRetired = VALID_TRANSITIONS.find(
      (t) => t.from === "draft" && t.to === "retired"
    );
    expect(draftToRetired).toBeUndefined();
  });

  it("should not allow draft to deceased transition", () => {
    const draftToDeceased = VALID_TRANSITIONS.find(
      (t) => t.from === "draft" && t.to === "deceased"
    );
    expect(draftToDeceased).toBeUndefined();
  });
});

// =============================================================================
// VALIDATION TESTS
// =============================================================================

describe("validateCharacterComplete", () => {
  it("should pass for complete character", () => {
    const character = createMockCharacter();
    const result = validateCharacterComplete(character);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail when name is missing", () => {
    const character = createMockCharacter({ name: "" });
    const result = validateCharacterComplete(character);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "MISSING_NAME")).toBe(true);
  });

  it("should fail when metatype is missing", () => {
    const character = createMockCharacter({ metatype: "" });
    const result = validateCharacterComplete(character);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "MISSING_METATYPE")).toBe(true);
  });

  it("should fail when attributes are missing", () => {
    const character = createMockCharacter({ attributes: {} });
    const result = validateCharacterComplete(character);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "MISSING_ATTRIBUTES")).toBe(
      true
    );
  });

  it("should fail when lifestyle is missing", () => {
    const character = createMockCharacter({ lifestyles: [] });
    const result = validateCharacterComplete(character);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "MISSING_LIFESTYLE")).toBe(
      true
    );
  });

  it("should fail when identity is missing", () => {
    const character = createMockCharacter({ identities: [] });
    const result = validateCharacterComplete(character);

    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === "MISSING_IDENTITY")).toBe(true);
  });

  it("should warn when skills are empty", () => {
    const character = createMockCharacter({ skills: {} });
    const result = validateCharacterComplete(character);

    // Still valid but with warning
    expect(result.valid).toBe(true);
    expect(result.warnings.some((w) => w.code === "NO_SKILLS")).toBe(true);
  });

  it("should warn when full-mage has no tradition", () => {
    const character = createMockCharacter({
      magicalPath: "full-mage",
      tradition: undefined,
    });
    const result = validateCharacterComplete(character);

    expect(result.warnings.some((w) => w.code === "MISSING_TRADITION")).toBe(
      true
    );
  });
});

// =============================================================================
// TRANSITION LOOKUP TESTS
// =============================================================================

describe("findTransition", () => {
  it("should find valid transition", () => {
    const transition = findTransition("draft", "active");
    expect(transition).toBeDefined();
    expect(transition?.from).toBe("draft");
    expect(transition?.to).toBe("active");
  });

  it("should return undefined for invalid transition", () => {
    const transition = findTransition("draft", "retired");
    expect(transition).toBeUndefined();
  });
});

describe("isValidTransition", () => {
  it("should return true for valid transitions", () => {
    expect(isValidTransition("draft", "active")).toBe(true);
    expect(isValidTransition("active", "retired")).toBe(true);
    expect(isValidTransition("active", "deceased")).toBe(true);
    expect(isValidTransition("retired", "active")).toBe(true);
    expect(isValidTransition("deceased", "active")).toBe(true);
  });

  it("should return false for invalid transitions", () => {
    // Draft can only go to active (not directly to retired or deceased)
    expect(isValidTransition("draft", "retired")).toBe(false);
    expect(isValidTransition("draft", "deceased")).toBe(false);
  });

  it("should return true for admin-only backward transitions", () => {
    // Admin can revert any status to draft
    expect(isValidTransition("active", "draft")).toBe(true);
    expect(isValidTransition("retired", "draft")).toBe(true);
    expect(isValidTransition("deceased", "draft")).toBe(true);
    // Admin can transition between retired and deceased
    expect(isValidTransition("retired", "deceased")).toBe(true);
    expect(isValidTransition("deceased", "retired")).toBe(true);
  });
});

// =============================================================================
// AUTHORIZATION TESTS
// =============================================================================

describe("canActorPerformTransition", () => {
  it("should allow owner to finalize draft", () => {
    const transition = findTransition("draft", "active")!;
    expect(canActorPerformTransition(transition, "owner")).toBe(true);
  });

  it("should allow owner to retire character", () => {
    const transition = findTransition("active", "retired")!;
    expect(canActorPerformTransition(transition, "owner")).toBe(true);
  });

  it("should allow GM to resurrect character", () => {
    const transition = findTransition("deceased", "active")!;
    expect(canActorPerformTransition(transition, "gm")).toBe(true);
  });

  it("should not allow owner to resurrect character", () => {
    const transition = findTransition("deceased", "active")!;
    expect(canActorPerformTransition(transition, "owner")).toBe(false);
  });

  it("should allow admin for all transitions", () => {
    for (const transition of VALID_TRANSITIONS) {
      expect(canActorPerformTransition(transition, "admin")).toBe(true);
    }
  });
});

// =============================================================================
// CAN TRANSITION TESTS
// =============================================================================

describe("canTransition", () => {
  it("should allow valid transition with passing validation", async () => {
    const character = createMockCharacter({ status: "draft" });
    const result = await canTransition(character, "active", "owner");

    expect(result.allowed).toBe(true);
  });

  it("should reject same state transition", async () => {
    const character = createMockCharacter({ status: "active" });
    const result = await canTransition(character, "active", "owner");

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("already in this state");
  });

  it("should reject invalid transition path", async () => {
    const character = createMockCharacter({ status: "draft" });
    const result = await canTransition(character, "retired", "owner");

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Invalid transition");
  });

  it("should reject unauthorized transition", async () => {
    const character = createMockCharacter({ status: "deceased" });
    const result = await canTransition(character, "active", "owner");

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("not authorized");
  });

  it("should reject when validation fails", async () => {
    const character = createMockCharacter({
      status: "draft",
      name: "", // Invalid
    });
    const result = await canTransition(character, "active", "owner");

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("validation failed");
    expect(result.validation?.errors.length).toBeGreaterThan(0);
  });
});

// =============================================================================
// EXECUTE TRANSITION TESTS
// =============================================================================

describe("executeTransition", () => {
  it("should successfully transition valid character", async () => {
    const character = createMockCharacter({ status: "draft" });
    const context: TransitionContext = {
      actor: { userId: "user-456", role: "owner" },
      note: "Test finalization",
    };

    const result = await executeTransition(character, "active", context);

    expect(result.success).toBe(true);
    expect(result.character?.status).toBe("active");
    expect(result.auditEntry).toBeDefined();
    expect(result.auditEntry?.action).toBe("finalized");
  });

  it("should add audit entry to character", async () => {
    const character = createMockCharacter({ status: "draft", auditLog: [] });
    const context: TransitionContext = {
      actor: { userId: "user-456", role: "owner" },
    };

    const result = await executeTransition(character, "active", context);

    expect(result.character?.auditLog).toHaveLength(1);
    expect(result.character?.auditLog?.[0].action).toBe("finalized");
    expect(result.character?.auditLog?.[0].stateTransition?.fromStatus).toBe(
      "draft"
    );
    expect(result.character?.auditLog?.[0].stateTransition?.toStatus).toBe(
      "active"
    );
  });

  it("should fail when character is incomplete", async () => {
    const character = createMockCharacter({
      status: "draft",
      name: "",
      metatype: "",
    });
    const context: TransitionContext = {
      actor: { userId: "user-456", role: "owner" },
    };

    const result = await executeTransition(character, "active", context);

    expect(result.success).toBe(false);
    expect(result.errors?.length).toBeGreaterThan(0);
    expect(result.character).toBeUndefined();
  });

  it("should allow skip validation for admin", async () => {
    const character = createMockCharacter({
      status: "draft",
      name: "", // Invalid but should be allowed
    });
    const context: TransitionContext = {
      actor: { userId: "admin-user", role: "admin" },
      skipValidation: true,
    };

    const result = await executeTransition(character, "active", context);

    expect(result.success).toBe(true);
    expect(result.character?.status).toBe("active");
  });

  it("should set correct audit action for retirement", async () => {
    const character = createMockCharacter({ status: "active" });
    const context: TransitionContext = {
      actor: { userId: "user-456", role: "owner" },
    };

    const result = await executeTransition(character, "retired", context);

    expect(result.success).toBe(true);
    expect(result.auditEntry?.action).toBe("retired");
  });

  it("should set correct audit action for reactivation", async () => {
    const character = createMockCharacter({ status: "retired" });
    const context: TransitionContext = {
      actor: { userId: "user-456", role: "owner" },
    };

    const result = await executeTransition(character, "active", context);

    expect(result.success).toBe(true);
    expect(result.auditEntry?.action).toBe("reactivated");
  });

  it("should update updatedAt timestamp", async () => {
    const oldDate = "2024-01-01T00:00:00.000Z";
    const character = createMockCharacter({
      status: "draft",
      updatedAt: oldDate,
    });
    const context: TransitionContext = {
      actor: { userId: "user-456", role: "owner" },
    };

    const result = await executeTransition(character, "active", context);

    expect(result.success).toBe(true);
    expect(result.character?.updatedAt).not.toBe(oldDate);
  });
});

// =============================================================================
// AUDIT HELPER TESTS
// =============================================================================

describe("createAuditEntry", () => {
  it("should create entry with required fields", () => {
    const entry = createAuditEntry({
      action: "finalized",
      actor: { userId: "user-123", role: "owner" },
    });

    expect(entry.id).toBeDefined();
    expect(entry.timestamp).toBeDefined();
    expect(entry.action).toBe("finalized");
    expect(entry.actor.userId).toBe("user-123");
    expect(entry.actor.role).toBe("owner");
  });

  it("should include optional fields when provided", () => {
    const entry = createAuditEntry({
      action: "retired",
      actor: { userId: "user-123", role: "owner" },
      details: { reason: "Retirement" },
      note: "Player retiring character",
    });

    expect(entry.details).toEqual({ reason: "Retirement" });
    expect(entry.note).toBe("Player retiring character");
  });
});

describe("appendAuditEntry", () => {
  it("should append entry to existing audit log", () => {
    const character = createMockCharacter({
      auditLog: [
        createAuditEntry({
          action: "created",
          actor: { userId: "user-123", role: "owner" },
        }),
      ],
    });

    const newEntry = createAuditEntry({
      action: "finalized",
      actor: { userId: "user-123", role: "owner" },
    });

    const updated = appendAuditEntry(character, newEntry);

    expect(updated.auditLog).toHaveLength(2);
    expect(updated.auditLog?.[1].action).toBe("finalized");
  });

  it("should create audit log if none exists", () => {
    const character = createMockCharacter({ auditLog: undefined });
    const entry = createAuditEntry({
      action: "created",
      actor: { userId: "user-123", role: "owner" },
    });

    const updated = appendAuditEntry(character, entry);

    expect(updated.auditLog).toHaveLength(1);
  });

  it("should not mutate original character", () => {
    const character = createMockCharacter({ auditLog: [] });
    const entry = createAuditEntry({
      action: "finalized",
      actor: { userId: "user-123", role: "owner" },
    });

    const updated = appendAuditEntry(character, entry);

    expect(character.auditLog).toHaveLength(0);
    expect(updated.auditLog).toHaveLength(1);
  });
});

// =============================================================================
// ROLE DETERMINATION TESTS
// =============================================================================

describe("determineActorRole", () => {
  it("should return admin when isAdmin is true", () => {
    const character = createMockCharacter({ ownerId: "user-123" });
    const role = determineActorRole("other-user", character, undefined, true);
    expect(role).toBe("admin");
  });

  it("should return owner for character owner", () => {
    const character = createMockCharacter({ ownerId: "user-123" });
    const role = determineActorRole("user-123", character);
    expect(role).toBe("owner");
  });

  it("should return gm when user is campaign GM", () => {
    const character = createMockCharacter({
      ownerId: "player-user",
      campaignId: "campaign-1",
    });
    const role = determineActorRole("gm-user", character, "gm-user");
    expect(role).toBe("gm");
  });

  it("should return owner as default for non-owner non-gm", () => {
    const character = createMockCharacter({ ownerId: "user-123" });
    const role = determineActorRole("other-user", character);
    expect(role).toBe("owner");
  });
});
