/**
 * Tests for /api/characters/[characterId]/weapons/[weaponId]/mods/[modId] endpoint
 *
 * Tests weapon modification removal (DELETE).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { DELETE } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as characterStorageModule from "@/lib/storage/characters";
import * as campaignsModule from "@/lib/storage/campaigns";
import * as weaponCustomizationModule from "@/lib/rules/gear/weapon-customization";

import type { Character, Weapon, InstalledWeaponMod, Campaign } from "@/lib/types";
import type { User } from "@/lib/types/user";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/characters");
vi.mock("@/lib/storage/campaigns");
vi.mock("@/lib/rules/gear/weapon-customization");

// =============================================================================
// TEST CONSTANTS
// =============================================================================

const TEST_USER_ID = "test-user-123";
const TEST_GM_ID = "test-gm-456";
const TEST_OTHER_USER_ID = "test-other-789";
const TEST_CHARACTER_ID = "test-char-001";
const TEST_WEAPON_ID = "weapon-001";
const TEST_CAMPAIGN_ID = "test-campaign-111";
const TEST_MOD_ID = "laser-sight";

// =============================================================================
// MOCK DATA FACTORIES
// =============================================================================

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: TEST_USER_ID,
    username: "testuser",
    email: "test@example.com",
    passwordHash: "hashed-password",
    role: ["user"],
    preferences: { theme: "dark", navigationCollapsed: false },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    characters: [],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    sessionSecretHash: null,
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

function createInstalledMod(overrides: Partial<InstalledWeaponMod> = {}): InstalledWeaponMod {
  return {
    catalogId: TEST_MOD_ID,
    name: "Laser Sight",
    mount: "under",
    cost: 125,
    availability: 2,
    isBuiltIn: false,
    capacityUsed: 0,
    ...overrides,
  };
}

function createMockWeapon(overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: TEST_WEAPON_ID,
    name: "Ares Predator V",
    damage: "8P",
    ap: -1,
    mode: ["SA"],
    subcategory: "heavy-pistol",
    category: "ranged",
    quantity: 1,
    cost: 725,
    modifications: [createInstalledMod()],
    occupiedMounts: ["under"],
    ...overrides,
  } as Weapon;
}

function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "priority",
    rulesetSnapshotId: "snapshot-1",
    name: "Test Character",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attributes: { strength: 4 },
    weapons: [createMockWeapon()],
    armor: [],
    gear: [],
    ammunition: [],
    karmaCurrent: 10,
    karmaTotal: 10,
    nuyen: 5000,
    startingNuyen: 10000,
    ...overrides,
  } as Character;
}

function createMockCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: TEST_CAMPAIGN_ID,
    name: "Test Campaign",
    gmId: TEST_GM_ID,
    editionId: "sr5",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "active",
    players: [],
    characters: [TEST_CHARACTER_ID],
    ...overrides,
  } as Campaign;
}

// =============================================================================
// REQUEST HELPERS
// =============================================================================

function createMockRequest(url: string, method = "DELETE"): NextRequest {
  return new NextRequest(url, { method });
}

function createRouteParams(characterId: string, weaponId: string, modId: string) {
  return { params: Promise.resolve({ characterId, weaponId, modId }) };
}

// =============================================================================
// DELETE TESTS
// =============================================================================

describe("DELETE /api/characters/[characterId]/weapons/[weaponId]/mods/[modId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("User not found");
  });

  it("should return 404 when character not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 403 when not owner and not in campaign", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_OTHER_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(
      createMockUser({ id: TEST_OTHER_USER_ID })
    );
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Not authorized");
  });

  it("should return 403 when in campaign but user is not GM", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_OTHER_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(
      createMockUser({ id: TEST_OTHER_USER_ID })
    );
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({ campaignId: TEST_CAMPAIGN_ID })
    );
    vi.mocked(campaignsModule.getCampaignById).mockResolvedValue(createMockCampaign());

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Not authorized");
  });

  it("should return 404 when weapon not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({ weapons: [] })
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Weapon not found");
  });

  it("should return 404 when mod not found on weapon", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({
        weapons: [createMockWeapon({ modifications: [] })],
      })
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Modification not found on weapon");
  });

  it("should return 400 when removing built-in mod", async () => {
    const builtInMod = createInstalledMod({ isBuiltIn: true, catalogId: "smartgun-internal" });
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({
        weapons: [
          createMockWeapon({
            modifications: [builtInMod],
            occupiedMounts: ["internal"],
          }),
        ],
      })
    );
    vi.mocked(weaponCustomizationModule.removeModification).mockReturnValue({
      success: false,
      weapon: createMockWeapon(),
      restoredMounts: [],
      error: 'Cannot remove built-in modification "Smartgun System (Internal)".',
    });

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/smartgun-internal`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, "smartgun-internal")
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Cannot remove built-in modification");
  });

  it("should return 200 on successful removal", async () => {
    const mockMod = createInstalledMod();
    const weaponAfterRemoval = createMockWeapon({
      modifications: [],
      occupiedMounts: [],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({
        weapons: [createMockWeapon({ modifications: [mockMod] })],
        nuyen: 5000,
      })
    );
    vi.mocked(weaponCustomizationModule.removeModification).mockReturnValue({
      success: true,
      weapon: weaponAfterRemoval,
      restoredMounts: ["under"],
    });
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.weapon).toBeDefined();
    expect(data.weapon.modifications).toHaveLength(0);
    expect(data.restoredMounts).toContain("under");
  });

  it("should refund 50% of cost", async () => {
    const mockMod = createInstalledMod({ cost: 200 }); // Will refund 100
    const weaponAfterRemoval = createMockWeapon({
      modifications: [],
      occupiedMounts: [],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({
        weapons: [createMockWeapon({ modifications: [mockMod] })],
        nuyen: 5000,
      })
    );
    vi.mocked(weaponCustomizationModule.removeModification).mockReturnValue({
      success: true,
      weapon: weaponAfterRemoval,
      restoredMounts: ["under"],
    });
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.nuyenRefunded).toBe(100); // 50% of 200

    // Verify the audit call includes correct nuyen
    expect(characterStorageModule.updateCharacterWithAudit).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.objectContaining({
        nuyen: 5100, // 5000 + 100 refund
      }),
      expect.any(Object)
    );
  });

  it("should restore mount points", async () => {
    const mockMod = createInstalledMod({ mount: "under" });
    const weaponAfterRemoval = createMockWeapon({
      modifications: [],
      occupiedMounts: [],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({
        weapons: [createMockWeapon({ modifications: [mockMod], occupiedMounts: ["under"] })],
        nuyen: 5000,
      })
    );
    vi.mocked(weaponCustomizationModule.removeModification).mockReturnValue({
      success: true,
      weapon: weaponAfterRemoval,
      restoredMounts: ["under"],
    });
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.restoredMounts).toContain("under");
    expect(data.weapon.occupiedMounts).not.toContain("under");
  });

  it("should create audit entry", async () => {
    const mockMod = createInstalledMod();
    const weaponAfterRemoval = createMockWeapon({
      modifications: [],
      occupiedMounts: [],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({
        weapons: [createMockWeapon({ modifications: [mockMod] })],
        nuyen: 5000,
      })
    );
    vi.mocked(weaponCustomizationModule.removeModification).mockReturnValue({
      success: true,
      weapon: weaponAfterRemoval,
      restoredMounts: ["under"],
    });
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    await DELETE(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID));

    expect(characterStorageModule.updateCharacterWithAudit).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.any(Object),
      expect.objectContaining({
        action: "gear_modified",
        actor: { userId: TEST_USER_ID, role: "owner" },
        details: expect.objectContaining({
          type: "weapon_mod_removed",
          weaponId: TEST_WEAPON_ID,
          modId: TEST_MOD_ID,
        }),
      })
    );
  });

  it("should allow GM to remove mods from campaign character", async () => {
    const mockMod = createInstalledMod();
    const weaponAfterRemoval = createMockWeapon({
      modifications: [],
      occupiedMounts: [],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_GM_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser({ id: TEST_GM_ID }));
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({
        weapons: [createMockWeapon({ modifications: [mockMod] })],
        nuyen: 5000,
        campaignId: TEST_CAMPAIGN_ID,
      })
    );
    vi.mocked(campaignsModule.getCampaignById).mockResolvedValue(createMockCampaign());
    vi.mocked(weaponCustomizationModule.removeModification).mockReturnValue({
      success: true,
      weapon: weaponAfterRemoval,
      restoredMounts: ["under"],
    });
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);

    // Verify GM role is recorded in audit
    expect(characterStorageModule.updateCharacterWithAudit).toHaveBeenCalledWith(
      TEST_USER_ID, // character owner
      TEST_CHARACTER_ID,
      expect.any(Object),
      expect.objectContaining({
        actor: { userId: TEST_GM_ID, role: "gm" },
      })
    );
  });

  it("should return 500 on internal error", async () => {
    vi.mocked(sessionModule.getSession).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods/${TEST_MOD_ID}`
    );

    const response = await DELETE(
      request,
      createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID, TEST_MOD_ID)
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to remove modification");
  });
});
