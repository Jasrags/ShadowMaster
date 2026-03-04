/**
 * Tests for ammunition consumption in combat actions
 *
 * Tests ammo validation, consumption, thrown weapon handling,
 * reload actions, and magazine swaps during combat.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as combatModule from "@/lib/storage/combat";
import * as charactersModule from "@/lib/storage/characters";
import * as loaderModule from "@/lib/rules/loader";
import * as actionResolutionModule from "@/lib/rules/action-resolution";
import type {
  User,
  CombatSession,
  CombatParticipant,
  Character,
  ActionDefinition,
  Weapon,
} from "@/lib/types";
import type { LoadedRuleset } from "@/lib/rules/loader-types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/combat");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/rules/loader");
vi.mock("@/lib/rules/action-resolution");

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body: unknown): NextRequest {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  const request = new NextRequest(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });

  (request as { json: () => Promise<unknown> }).json = async () => body;

  return request;
}

// Route params helper
function createRouteParams(sessionId: string) {
  return { params: Promise.resolve({ sessionId }) };
}

// Mock data factories
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: "test-user-id",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "mock-hash",
    role: ["user"],
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    sessionSecretHash: null,
    preferences: { theme: "system", navigationCollapsed: false },
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
    emailVerificationTokenPrefix: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    passwordResetTokenPrefix: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
    magicLinkTokenPrefix: null,
    ...overrides,
  };
}

function createMockParticipant(overrides?: Partial<CombatParticipant>): CombatParticipant {
  return {
    id: "test-participant-id",
    type: "character",
    entityId: "test-character-id",
    name: "Test Character",
    initiativeScore: 10,
    initiativeDice: [4],
    actionsRemaining: { free: 999, simple: 2, complex: 1, interrupt: true },
    interruptsPending: [],
    status: "active",
    controlledBy: "test-user-id",
    isGMControlled: false,
    woundModifier: 0,
    conditions: [],
    ...overrides,
  };
}

function createMockCombatSession(overrides?: Partial<CombatSession>): CombatSession {
  return {
    id: "test-session-id",
    ownerId: "test-user-id",
    editionCode: "sr5",
    participants: [],
    initiativeOrder: [],
    currentTurn: 0,
    currentPhase: "action",
    round: 1,
    status: "active",
    environment: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockWeapon(overrides?: Partial<Weapon>): Weapon {
  return {
    id: "weapon-1",
    name: "Ares Predator V",
    category: "weapon",
    subcategory: "heavy-pistol",
    damage: "8P",
    ap: -1,
    mode: ["SA", "BF"],
    quantity: 1,
    cost: 725,
    ammoState: {
      loadedAmmoTypeId: "regular-ammo",
      currentRounds: 15,
      magazineCapacity: 15,
    },
    ...overrides,
  };
}

function createMockCharacter(overrides?: Partial<Character>): Character {
  return {
    id: "test-character-id",
    ownerId: "test-user-id",
    editionId: "test-edition-id",
    editionCode: "sr5",
    creationMethodId: "test-creation-method-id",
    rulesetSnapshotId: "test-snapshot-id",
    attachedBookIds: [],
    name: "Test Character",
    metatype: "Human",
    status: "active",
    attributes: {
      agility: 4,
      reaction: 4,
      intuition: 3,
      strength: 3,
      body: 3,
      willpower: 3,
      logic: 3,
      charisma: 3,
    },
    specialAttributes: { edge: 1, essence: 6 },
    skills: { firearms: 4 },
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 0,
    startingNuyen: 0,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: { physicalDamage: 0, stunDamage: 0 },
    karmaTotal: 0,
    karmaCurrent: 0,
    karmaSpentAtCreation: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockAction(overrides?: Partial<ActionDefinition>): ActionDefinition {
  return {
    id: "test-action",
    name: "Test Action",
    description: "A test action",
    type: "simple",
    domain: "combat",
    cost: { actionType: "simple" },
    prerequisites: [],
    modifiers: [],
    ...overrides,
  } as ActionDefinition;
}

function createFireWeaponAction(
  id: string,
  ammoCount: number,
  overrides?: Partial<ActionDefinition>
): ActionDefinition {
  return createMockAction({
    id,
    name: `Fire Weapon (${id})`,
    type: "simple",
    cost: {
      actionType: "simple",
      resourceCosts: [
        { type: "ammunition", amount: ammoCount, description: `${ammoCount} round(s)` },
      ],
    },
    ...overrides,
  });
}

function createRulesetWithActions(actions: ActionDefinition[]): LoadedRuleset {
  return {
    edition: {
      id: "sr5",
      code: "sr5",
      name: "Shadowrun 5th Edition",
      version: "1.0.0",
      releaseYear: 2013,
      supportLevel: "active",
      books: ["sr5-core"],
      creationMethods: [],
    },
    books: [
      {
        id: "sr5-core",
        title: "Core Rulebook",
        isCore: true,
        loadOrder: 1,
        payload: {
          modules: {
            actions: {
              payload: {
                combat: actions,
              },
            },
          },
        },
      },
    ],
    creationMethods: [],
  } as unknown as LoadedRuleset;
}

// =============================================================================
// TESTS
// =============================================================================

describe("Ammunition consumption in combat actions", () => {
  const mockUser = createMockUser();
  const mockParticipant = createMockParticipant();
  const mockWeapon = createMockWeapon();
  const mockCharacter = createMockCharacter({ weapons: [mockWeapon] });

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(sessionModule.getSession).mockResolvedValue(mockUser.id);
    vi.mocked(usersModule.getUserById).mockResolvedValue(mockUser);
    vi.mocked(combatModule.updateParticipantActions).mockResolvedValue(mockParticipant);
    vi.mocked(charactersModule.updateCharacter).mockResolvedValue(mockCharacter);

    vi.mocked(actionResolutionModule.validateAction).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(actionResolutionModule.consumeAction).mockReturnValue({
      free: 999,
      simple: 1,
      complex: 1,
      interrupt: true,
    });
  });

  function setupSession(
    character: Character,
    actions: ActionDefinition[],
    participant?: CombatParticipant
  ) {
    const part = participant ?? mockParticipant;
    const session = createMockCombatSession({
      participants: [part],
      status: "active",
    });

    vi.mocked(combatModule.getCombatSession).mockResolvedValue(session);
    vi.mocked(combatModule.getCurrentParticipant).mockResolvedValue(part);
    vi.mocked(loaderModule.loadRuleset).mockResolvedValue({
      success: true,
      ruleset: createRulesetWithActions(actions),
    });
    vi.mocked(charactersModule.getCharacterById).mockResolvedValue(character);

    return session;
  }

  describe("fire weapon actions", () => {
    it("should decrement ammo by action resourceCosts amount (SS = 1 round)", async () => {
      const fireSSAction = createFireWeaponAction("fire-weapon-ss", 1);
      setupSession(mockCharacter, [fireSSAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "fire-weapon-ss", weaponId: "weapon-1" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.ammoConsumed).toBe(1);
      expect(data.ammoRemaining).toBe(14);
      expect(data.weaponId).toBe("weapon-1");
      expect(charactersModule.updateCharacter).toHaveBeenCalledWith(
        "test-user-id",
        "test-character-id",
        expect.objectContaining({
          weapons: expect.arrayContaining([
            expect.objectContaining({
              id: "weapon-1",
              ammoState: expect.objectContaining({ currentRounds: 14 }),
            }),
          ]),
        })
      );
    });

    it("should decrement ammo by 3 for burst fire", async () => {
      const fireBFAction = createFireWeaponAction("fire-weapon-bf", 3);
      setupSession(mockCharacter, [fireBFAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "fire-weapon-bf", weaponId: "weapon-1" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ammoConsumed).toBe(3);
      expect(data.ammoRemaining).toBe(12);
    });

    it("should decrement ammo by 6 for full auto", async () => {
      const fireFAAction = createFireWeaponAction("fire-weapon-fa", 6, {
        cost: {
          actionType: "complex",
          resourceCosts: [{ type: "ammunition", amount: 6, description: "6 rounds" }],
        },
      });
      setupSession(mockCharacter, [fireFAAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "fire-weapon-fa", weaponId: "weapon-1" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.ammoConsumed).toBe(6);
      expect(data.ammoRemaining).toBe(9);
    });

    it("should return 400 when insufficient ammo", async () => {
      const fireFAAction = createFireWeaponAction("fire-weapon-fa", 6, {
        cost: {
          actionType: "complex",
          resourceCosts: [{ type: "ammunition", amount: 6, description: "6 rounds" }],
        },
      });
      const lowAmmoWeapon = createMockWeapon({
        ammoState: { loadedAmmoTypeId: "regular-ammo", currentRounds: 3, magazineCapacity: 15 },
      });
      const characterWithLowAmmo = createMockCharacter({ weapons: [lowAmmoWeapon] });
      setupSession(characterWithLowAmmo, [fireFAAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "fire-weapon-fa", weaponId: "weapon-1" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Insufficient ammunition");
      // Should NOT have consumed action economy
      expect(combatModule.updateParticipantActions).not.toHaveBeenCalled();
    });

    it("should return 404 when weapon not found", async () => {
      const fireSSAction = createFireWeaponAction("fire-weapon-ss", 1);
      setupSession(mockCharacter, [fireSSAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "fire-weapon-ss", weaponId: "nonexistent-weapon" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toContain("Weapon not found");
    });
  });

  describe("actions without weapon", () => {
    it("should work normally without weaponId (no ammo change)", async () => {
      const shootAction = createMockAction({
        id: "shoot",
        name: "Shoot",
        type: "simple",
        cost: { actionType: "simple" },
      });
      setupSession(mockCharacter, [shootAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "shoot" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.ammoConsumed).toBeUndefined();
      expect(data.ammoRemaining).toBeUndefined();
      expect(data.weaponId).toBeUndefined();
    });

    it("should ignore ammo logic for non-firearm actions", async () => {
      const meleeAction = createMockAction({
        id: "melee-attack",
        name: "Melee Attack",
        type: "complex",
        cost: { actionType: "complex" },
      });
      setupSession(mockCharacter, [meleeAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "melee-attack" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.ammoConsumed).toBeUndefined();
    });
  });

  describe("thrown weapons", () => {
    it("should decrement quantity when throwing a weapon with quantity > 1", async () => {
      const throwAction = createMockAction({
        id: "throw-weapon",
        name: "Throw Weapon",
        type: "simple",
        cost: { actionType: "simple" },
      });
      const grenades = createMockWeapon({
        id: "grenade-1",
        name: "Fragmentation Grenade",
        subcategory: "grenade",
        quantity: 3,
        ammoState: undefined,
        ammoCapacity: 0,
      });
      const charWithGrenades = createMockCharacter({ weapons: [grenades] });
      setupSession(charWithGrenades, [throwAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "throw-weapon", weaponId: "grenade-1" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.consumableUsed).toBe(true);
      expect(charactersModule.updateCharacter).toHaveBeenCalledWith(
        "test-user-id",
        "test-character-id",
        expect.objectContaining({
          weapons: expect.arrayContaining([
            expect.objectContaining({
              id: "grenade-1",
              quantity: 2,
            }),
          ]),
        })
      );
    });

    it("should remove weapon when throwing last one", async () => {
      const throwAction = createMockAction({
        id: "throw-weapon",
        name: "Throw Weapon",
        type: "simple",
        cost: { actionType: "simple" },
      });
      const lastGrenade = createMockWeapon({
        id: "grenade-1",
        name: "Fragmentation Grenade",
        subcategory: "grenade",
        quantity: 1,
        ammoState: undefined,
        ammoCapacity: 0,
      });
      const charWithOneGrenade = createMockCharacter({ weapons: [lastGrenade] });
      setupSession(charWithOneGrenade, [throwAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "throw-weapon", weaponId: "grenade-1" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.consumableUsed).toBe(true);
      expect(charactersModule.updateCharacter).toHaveBeenCalledWith(
        "test-user-id",
        "test-character-id",
        expect.objectContaining({
          weapons: [],
        })
      );
    });
  });

  describe("reload actions", () => {
    it("should swap magazine with insert-clip + magazineId", async () => {
      const insertClipAction = createMockAction({
        id: "insert-clip",
        name: "Insert Clip",
        type: "simple",
        cost: { actionType: "simple" },
      });
      const weaponWithSpares = createMockWeapon({
        ammoState: {
          loadedAmmoTypeId: "regular-ammo",
          currentRounds: 2,
          magazineCapacity: 15,
        },
        spareMagazines: [
          {
            id: "spare-mag-1",
            weaponCompatibility: ["heavy-pistol"],
            capacity: 15,
            loadedAmmoTypeId: "apds-ammo",
            currentRounds: 15,
            cost: 5,
          },
        ],
      });
      const charWithSpares = createMockCharacter({ weapons: [weaponWithSpares] });
      setupSession(charWithSpares, [insertClipAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "insert-clip", weaponId: "weapon-1", magazineId: "spare-mag-1" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.reloadResult).toBeDefined();
      expect(data.reloadResult.magazineSwapped).toBe(true);
      expect(data.weaponId).toBe("weapon-1");
      expect(charactersModule.updateCharacter).toHaveBeenCalled();
    });

    it("should unload weapon with remove-clip", async () => {
      const removeClipAction = createMockAction({
        id: "remove-clip",
        name: "Remove Clip",
        type: "simple",
        cost: { actionType: "simple" },
      });
      const loadedWeapon = createMockWeapon({
        ammoState: {
          loadedAmmoTypeId: "regular-ammo",
          currentRounds: 8,
          magazineCapacity: 15,
        },
      });
      const charWithLoaded = createMockCharacter({ weapons: [loadedWeapon] });
      setupSession(charWithLoaded, [removeClipAction]);

      const request = createMockRequest(
        "http://localhost:3000/api/combat/test-session-id/actions",
        { actionId: "remove-clip", weaponId: "weapon-1" }
      );
      const response = await POST(request, createRouteParams("test-session-id"));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.reloadResult).toBeDefined();
      expect(data.weaponId).toBe("weapon-1");
      expect(charactersModule.updateCharacter).toHaveBeenCalledWith(
        "test-user-id",
        "test-character-id",
        expect.objectContaining({
          weapons: expect.arrayContaining([
            expect.objectContaining({
              ammoState: expect.objectContaining({ currentRounds: 0 }),
            }),
          ]),
        })
      );
    });
  });
});
