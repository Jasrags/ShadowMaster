/**
 * Weapon Customization Validation Tests
 *
 * Tests for mount point governance, compatibility checking,
 * built-in modification handling, and modification lifecycle.
 */

import { describe, it, expect } from "vitest";
import type { Weapon } from "@/lib/types/character";
import type { WeaponModificationCatalogItem } from "@/lib/types/edition";
import {
  validateModInstallation,
  getAvailableMounts,
  applyBuiltInModifications,
  removeModification,
  installModification,
  calculateModificationCost,
  canBeCustomized,
  DEFAULT_MOUNT_REGISTRY,
} from "../weapon-customization";

// =============================================================================
// TEST FIXTURES
// =============================================================================

const createBaseWeapon = (overrides: Partial<Weapon> = {}): Weapon => ({
  id: "test-weapon-1",
  name: "Test Weapon",
  category: "weapons",
  quantity: 1,
  cost: 500,
  damage: "8P",
  ap: -1,
  mode: ["SA", "BF"],
  subcategory: "assault-rifle",
  ...overrides,
});

const createBaseMod = (
  overrides: Partial<WeaponModificationCatalogItem> = {}
): WeaponModificationCatalogItem => ({
  id: "test-mod-1",
  name: "Test Modification",
  cost: 100,
  availability: 4,
  ...overrides,
});

// =============================================================================
// VALIDATION TESTS
// =============================================================================

describe("validateModInstallation", () => {
  describe("mount point validation", () => {
    it("accepts mods for available mount points", () => {
      const weapon = createBaseWeapon({ subcategory: "assault-rifle" });
      const mod = createBaseMod({ mount: "top" });

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects mods for unavailable mount points", () => {
      const weapon = createBaseWeapon({ subcategory: "hold-out-pistol" });
      const mod = createBaseMod({ mount: "stock" }); // Hold-outs don't have stocks

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Mount point "stock" is not available on hold-out-pistol weapons.'
      );
    });

    it("rejects mods for occupied mount points", () => {
      const weapon = createBaseWeapon({
        subcategory: "assault-rifle",
        occupiedMounts: ["top"],
      });
      const mod = createBaseMod({ mount: "top" });

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Mount point "top" is already occupied.');
    });

    it("handles multi-mount accessories correctly", () => {
      const weapon = createBaseWeapon({ subcategory: "assault-rifle" });
      const mod = createBaseMod({
        mount: "under",
        occupiedMounts: ["side"], // Bipod that uses both
      });

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(true);
    });

    it("rejects multi-mount mods when any mount is occupied", () => {
      const weapon = createBaseWeapon({
        subcategory: "assault-rifle",
        occupiedMounts: ["side"],
      });
      const mod = createBaseMod({
        mount: "under",
        occupiedMounts: ["side"],
      });

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Mount point "side" is already occupied.');
    });
  });

  describe("weapon size compatibility", () => {
    it("accepts mods when weapon meets minimum size", () => {
      const weapon = createBaseWeapon({ subcategory: "assault-rifle" });
      const mod = createBaseMod({ minimumWeaponSize: "smg" });

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(true);
    });

    it("rejects mods when weapon is too small", () => {
      const weapon = createBaseWeapon({ subcategory: "light-pistol" });
      const mod = createBaseMod({ minimumWeaponSize: "rifle" });

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'This modification requires a minimum weapon size of "rifle".'
      );
    });
  });

  describe("subcategory compatibility", () => {
    it("accepts mods in compatibleWeapons list", () => {
      const weapon = createBaseWeapon({ subcategory: "assault-rifle" });
      const mod = createBaseMod({
        compatibleWeapons: ["assault-rifle", "sniper-rifle"],
      });

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(true);
    });

    it("rejects mods not in compatibleWeapons list", () => {
      const weapon = createBaseWeapon({ subcategory: "assault-rifle" });
      const mod = createBaseMod({
        compatibleWeapons: ["shotgun", "sniper-rifle"],
      });

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "This modification is not compatible with assault-rifle weapons."
      );
    });

    it("rejects mods in incompatibleWeapons list", () => {
      const weapon = createBaseWeapon({ subcategory: "assault-rifle" });
      const mod = createBaseMod({
        incompatibleWeapons: ["assault-rifle"],
      });

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "This modification is explicitly incompatible with assault-rifle weapons."
      );
    });
  });

  describe("unsupported weapons", () => {
    it("rejects mods for weapons not in registry", () => {
      const weapon = createBaseWeapon({ subcategory: "throwing-knife" });
      const mod = createBaseMod({ mount: "top" });

      const result = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        'Weapon subcategory "throwing-knife" does not support modifications.'
      );
    });
  });
});

// =============================================================================
// MOUNT AVAILABILITY TESTS
// =============================================================================

describe("getAvailableMounts", () => {
  it("returns all mounts for weapon with none occupied", () => {
    const weapon = createBaseWeapon({ subcategory: "assault-rifle" });

    const available = getAvailableMounts(weapon, DEFAULT_MOUNT_REGISTRY);

    expect(available).toContain("top");
    expect(available).toContain("under");
    expect(available).toContain("barrel");
  });

  it("excludes occupied mounts", () => {
    const weapon = createBaseWeapon({
      subcategory: "assault-rifle",
      occupiedMounts: ["top", "under"],
    });

    const available = getAvailableMounts(weapon, DEFAULT_MOUNT_REGISTRY);

    expect(available).not.toContain("top");
    expect(available).not.toContain("under");
    expect(available).toContain("barrel");
  });

  it("returns empty array for unsupported weapons", () => {
    const weapon = createBaseWeapon({ subcategory: "throwing-knife" });

    const available = getAvailableMounts(weapon, DEFAULT_MOUNT_REGISTRY);

    expect(available).toHaveLength(0);
  });
});

// =============================================================================
// BUILT-IN MODIFICATION TESTS
// =============================================================================

describe("applyBuiltInModifications", () => {
  it("adds built-in mods with isBuiltIn flag", () => {
    const weapon = createBaseWeapon();
    const builtInMods: WeaponModificationCatalogItem[] = [
      createBaseMod({
        id: "smartgun-internal",
        name: "Smartgun System (Internal)",
        mount: "internal",
      }),
    ];

    const result = applyBuiltInModifications(weapon, builtInMods);

    expect(result.modifications).toHaveLength(1);
    expect(result.modifications![0].isBuiltIn).toBe(true);
    expect(result.modifications![0].catalogId).toBe("smartgun-internal");
  });

  it("sets cost to 0 for built-in mods", () => {
    const weapon = createBaseWeapon();
    const builtInMods: WeaponModificationCatalogItem[] = [
      createBaseMod({ id: "laser-sight", name: "Laser Sight", cost: 125, mount: "under" }),
    ];

    const result = applyBuiltInModifications(weapon, builtInMods);

    expect(result.modifications![0].cost).toBe(0);
  });

  it("marks mount points as occupied", () => {
    const weapon = createBaseWeapon();
    const builtInMods: WeaponModificationCatalogItem[] = [
      createBaseMod({ id: "scope", name: "Scope", mount: "top" }),
    ];

    const result = applyBuiltInModifications(weapon, builtInMods);

    expect(result.occupiedMounts).toContain("top");
  });

  it("returns unchanged weapon when no built-in mods", () => {
    const weapon = createBaseWeapon();

    const result = applyBuiltInModifications(weapon, []);

    expect(result).toBe(weapon);
  });
});

// =============================================================================
// MODIFICATION REMOVAL TESTS
// =============================================================================

describe("removeModification", () => {
  it("rejects removal of built-in mods", () => {
    const weapon = createBaseWeapon({
      modifications: [
        {
          catalogId: "smartgun-internal",
          name: "Smartgun System (Internal)",
          cost: 0,
          availability: 4,
          isBuiltIn: true,
          capacityUsed: 0,
        },
      ],
      occupiedMounts: ["internal"],
    });

    const result = removeModification(weapon, "smartgun-internal");

    expect(result.success).toBe(false);
    expect(result.error).toContain("Cannot remove built-in modification");
  });

  it("successfully removes non-built-in mods", () => {
    const weapon = createBaseWeapon({
      modifications: [
        {
          catalogId: "silencer",
          name: "Silencer",
          mount: "barrel",
          cost: 500,
          availability: 8,
          isBuiltIn: false,
          capacityUsed: 0,
        },
      ],
      occupiedMounts: ["barrel"],
    });

    const result = removeModification(weapon, "silencer");

    expect(result.success).toBe(true);
    expect(result.weapon.modifications).toHaveLength(0);
    expect(result.restoredMounts).toContain("barrel");
    expect(result.weapon.occupiedMounts).not.toContain("barrel");
  });

  it("returns error for non-existent mod", () => {
    const weapon = createBaseWeapon();

    const result = removeModification(weapon, "non-existent");

    expect(result.success).toBe(false);
    expect(result.error).toContain("not found");
  });
});

// =============================================================================
// MODIFICATION INSTALLATION TESTS
// =============================================================================

describe("installModification", () => {
  it("adds mod to modifications array", () => {
    const weapon = createBaseWeapon();
    const mod = createBaseMod({ id: "scope", name: "Scope", mount: "top" });

    const result = installModification(weapon, mod);

    expect(result.modifications).toHaveLength(1);
    expect(result.modifications![0].catalogId).toBe("scope");
    expect(result.modifications![0].isBuiltIn).toBe(false);
  });

  it("marks mount points as occupied", () => {
    const weapon = createBaseWeapon();
    const mod = createBaseMod({ mount: "top" });

    const result = installModification(weapon, mod);

    expect(result.occupiedMounts).toContain("top");
  });

  it("uses custom cost when provided", () => {
    const weapon = createBaseWeapon();
    const mod = createBaseMod({ cost: 100 });

    const result = installModification(weapon, mod, { cost: 150 });

    expect(result.modifications![0].cost).toBe(150);
  });
});

// =============================================================================
// UTILITY FUNCTION TESTS
// =============================================================================

describe("calculateModificationCost", () => {
  it("sums costs of non-built-in mods", () => {
    const weapon = createBaseWeapon({
      modifications: [
        {
          catalogId: "mod1",
          name: "Mod 1",
          cost: 100,
          availability: 4,
          isBuiltIn: false,
          capacityUsed: 0,
        },
        {
          catalogId: "mod2",
          name: "Mod 2",
          cost: 200,
          availability: 6,
          isBuiltIn: false,
          capacityUsed: 0,
        },
      ],
    });

    const cost = calculateModificationCost(weapon);

    expect(cost).toBe(300);
  });

  it("excludes built-in mods from cost calculation", () => {
    const weapon = createBaseWeapon({
      modifications: [
        {
          catalogId: "mod1",
          name: "Mod 1",
          cost: 100,
          availability: 4,
          isBuiltIn: false,
          capacityUsed: 0,
        },
        {
          catalogId: "mod2",
          name: "Mod 2",
          cost: 0,
          availability: 4,
          isBuiltIn: true,
          capacityUsed: 0,
        },
      ],
    });

    const cost = calculateModificationCost(weapon);

    expect(cost).toBe(100);
  });
});

describe("canBeCustomized", () => {
  it("returns true for weapons with available mounts", () => {
    const weapon = createBaseWeapon({ subcategory: "assault-rifle" });

    expect(canBeCustomized(weapon, DEFAULT_MOUNT_REGISTRY)).toBe(true);
  });

  it("returns false for unsupported weapons", () => {
    const weapon = createBaseWeapon({ subcategory: "throwing-knife" });

    expect(canBeCustomized(weapon, DEFAULT_MOUNT_REGISTRY)).toBe(false);
  });

  it("returns false when all mounts are occupied", () => {
    const weapon = createBaseWeapon({
      subcategory: "hold-out-pistol",
      occupiedMounts: ["barrel"], // Only mount on hold-outs
    });

    expect(canBeCustomized(weapon, DEFAULT_MOUNT_REGISTRY)).toBe(false);
  });
});
