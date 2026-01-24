/**
 * Tests for /api/characters/[characterId]/weapons/[weaponId]/mods endpoint
 *
 * Tests weapon modification listing (GET) and installation (POST).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
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
    modifications: [],
    occupiedMounts: [],
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

// =============================================================================
// REQUEST HELPERS
// =============================================================================

function createMockRequest(url: string, body?: unknown, method = "GET"): NextRequest {
  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { "Content-Type": "application/json" } : undefined,
  });

  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

function createRouteParams(characterId: string, weaponId: string) {
  return { params: Promise.resolve({ characterId, weaponId }) };
}

// =============================================================================
// GET TESTS
// =============================================================================

describe("GET /api/characters/[characterId]/weapons/[weaponId]/mods", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`
    );

    const response = await GET(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`
    );

    const response = await GET(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
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
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`
    );

    const response = await GET(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Character not found");
  });

  it("should return 404 when weapon not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({ weapons: [] })
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`
    );

    const response = await GET(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Weapon not found");
  });

  it("should return 200 with weapon modifications", async () => {
    const mockMod = createInstalledMod();
    const mockWeapon = createMockWeapon({
      modifications: [mockMod],
      occupiedMounts: ["under"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({ weapons: [mockWeapon] })
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`
    );

    const response = await GET(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.weapon).toBeDefined();
    expect(data.weapon.id).toBe(TEST_WEAPON_ID);
    expect(data.weapon.name).toBe("Ares Predator V");
    expect(data.weapon.modifications).toHaveLength(1);
    expect(data.weapon.modifications[0].catalogId).toBe(TEST_MOD_ID);
    expect(data.weapon.occupiedMounts).toContain("under");
  });

  it("should return 500 on internal error", async () => {
    vi.mocked(sessionModule.getSession).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`
    );

    const response = await GET(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to get modifications");
  });
});

// =============================================================================
// POST TESTS
// =============================================================================

describe("POST /api/characters/[characterId]/weapons/[weaponId]/mods", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
  });

  it("should return 404 when user not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(null);

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
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
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
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
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
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
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
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
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Weapon not found");
  });

  it("should return 400 when modId is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      {},
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("modId is required");
  });

  it("should return 404 when mod not in catalog", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(createMockCharacter());

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: "nonexistent-mod" },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toContain("not found in catalog");
  });

  it("should return 400 when mount validation fails", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(createMockCharacter());
    vi.mocked(weaponCustomizationModule.validateModInstallation).mockReturnValue({
      valid: false,
      errors: ["Mount point is not available on this weapon type."],
      warnings: [],
    });

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Modification cannot be installed");
    expect(data.validationErrors).toContain("Mount point is not available on this weapon type.");
  });

  it("should return 400 when mount is already occupied", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({
        weapons: [createMockWeapon({ occupiedMounts: ["under"] })],
      })
    );
    vi.mocked(weaponCustomizationModule.validateModInstallation).mockReturnValue({
      valid: false,
      errors: ['Mount point "under" is already occupied.'],
      warnings: [],
    });

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.validationErrors).toContain('Mount point "under" is already occupied.');
  });

  it("should return 400 when insufficient nuyen", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({ nuyen: 50 }) // Not enough for 125¥ mod
    );
    vi.mocked(weaponCustomizationModule.validateModInstallation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Insufficient nuyen");
  });

  it("should return 200 on successful installation", async () => {
    const mockWeapon = createMockWeapon();
    const installedMod = createInstalledMod();
    const updatedWeapon = createMockWeapon({
      modifications: [installedMod],
      occupiedMounts: ["under"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({ weapons: [mockWeapon], nuyen: 5000 })
    );
    vi.mocked(weaponCustomizationModule.validateModInstallation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(weaponCustomizationModule.installModification).mockReturnValue(updatedWeapon);
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.weapon).toBeDefined();
    expect(data.weapon.modifications).toHaveLength(1);
    expect(data.weapon.occupiedMounts).toContain("under");
    expect(data.nuyenRemaining).toBe(4875); // 5000 - 125
  });

  it("should deduct nuyen correctly", async () => {
    const mockWeapon = createMockWeapon();
    const installedMod = createInstalledMod();
    const updatedWeapon = createMockWeapon({
      modifications: [installedMod],
      occupiedMounts: ["under"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({ weapons: [mockWeapon], nuyen: 1000 })
    );
    vi.mocked(weaponCustomizationModule.validateModInstallation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(weaponCustomizationModule.installModification).mockReturnValue(updatedWeapon);
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.nuyenRemaining).toBe(875); // 1000 - 125

    // Verify the audit call includes correct nuyen
    expect(characterStorageModule.updateCharacterWithAudit).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.objectContaining({
        nuyen: 875,
      }),
      expect.any(Object)
    );
  });

  it("should update occupied mounts", async () => {
    const mockWeapon = createMockWeapon({ occupiedMounts: ["top"] });
    const installedMod = createInstalledMod();
    const updatedWeapon = createMockWeapon({
      modifications: [installedMod],
      occupiedMounts: ["top", "under"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({ weapons: [mockWeapon], nuyen: 5000 })
    );
    vi.mocked(weaponCustomizationModule.validateModInstallation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(weaponCustomizationModule.installModification).mockReturnValue(updatedWeapon);
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.weapon.occupiedMounts).toContain("top");
    expect(data.weapon.occupiedMounts).toContain("under");
  });

  it("should create audit entry", async () => {
    const mockWeapon = createMockWeapon();
    const installedMod = createInstalledMod();
    const updatedWeapon = createMockWeapon({
      modifications: [installedMod],
      occupiedMounts: ["under"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({ weapons: [mockWeapon], nuyen: 5000 })
    );
    vi.mocked(weaponCustomizationModule.validateModInstallation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(weaponCustomizationModule.installModification).mockReturnValue(updatedWeapon);
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));

    expect(characterStorageModule.updateCharacterWithAudit).toHaveBeenCalledWith(
      TEST_USER_ID,
      TEST_CHARACTER_ID,
      expect.any(Object),
      expect.objectContaining({
        action: "gear_modified",
        actor: { userId: TEST_USER_ID, role: "owner" },
        details: expect.objectContaining({
          type: "weapon_mod_installed",
          weaponId: TEST_WEAPON_ID,
          modId: TEST_MOD_ID,
        }),
      })
    );
  });

  it("should handle custom cost", async () => {
    const mockWeapon = createMockWeapon();
    const installedMod = createInstalledMod({ cost: 50 });
    const updatedWeapon = createMockWeapon({
      modifications: [installedMod],
      occupiedMounts: ["under"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_USER_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser());
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({ weapons: [mockWeapon], nuyen: 5000 })
    );
    vi.mocked(weaponCustomizationModule.validateModInstallation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(weaponCustomizationModule.installModification).mockReturnValue(updatedWeapon);
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID, customCost: 50 },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.nuyenRemaining).toBe(4950); // 5000 - 50 (custom cost)
  });

  it("should allow GM to install mods on campaign character", async () => {
    const mockWeapon = createMockWeapon();
    const installedMod = createInstalledMod();
    const updatedWeapon = createMockWeapon({
      modifications: [installedMod],
      occupiedMounts: ["under"],
    });

    vi.mocked(sessionModule.getSession).mockResolvedValue(TEST_GM_ID);
    vi.mocked(usersModule.getUserById).mockResolvedValue(createMockUser({ id: TEST_GM_ID }));
    vi.mocked(characterStorageModule.getCharacter).mockResolvedValue(
      createMockCharacter({
        weapons: [mockWeapon],
        nuyen: 5000,
        campaignId: TEST_CAMPAIGN_ID,
      })
    );
    vi.mocked(campaignsModule.getCampaignById).mockResolvedValue(createMockCampaign());
    vi.mocked(weaponCustomizationModule.validateModInstallation).mockReturnValue({
      valid: true,
      errors: [],
      warnings: [],
    });
    vi.mocked(weaponCustomizationModule.installModification).mockReturnValue(updatedWeapon);
    vi.mocked(characterStorageModule.updateCharacterWithAudit).mockResolvedValue(
      createMockCharacter()
    );

    const request = createMockRequest(
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
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
      `http://localhost:3000/api/characters/${TEST_CHARACTER_ID}/weapons/${TEST_WEAPON_ID}/mods`,
      { modId: TEST_MOD_ID },
      "POST"
    );

    const response = await POST(request, createRouteParams(TEST_CHARACTER_ID, TEST_WEAPON_ID));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to install modification");
  });
});
