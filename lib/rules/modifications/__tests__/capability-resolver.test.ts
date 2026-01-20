/**
 * Tests for Modification Capability Resolver
 *
 * Tests the hierarchical resolution of modification capabilities:
 * 1. Item-level capability
 * 2. Category defaults
 * 3. None (fallback)
 */

import { describe, it, expect } from "vitest";
import {
  resolveModificationCapability,
  getModificationCapability,
  canAcceptModifications,
  getAvailableMounts,
  getModificationCapacity,
  getModificationSlots,
  isModificationAllowed,
  canInstallInSlot,
  isMountBased,
  isCapacityBased,
  isSlotBased,
  getCategoryModificationDefaults,
  type ModifiableItem,
} from "../capability-resolver";
import type { MergedRuleset, ModificationCapability, ModificationSlot } from "@/lib/types";

// =============================================================================
// TEST FIXTURES
// =============================================================================

/**
 * Create a minimal merged ruleset for testing
 */
function createTestRuleset(
  categoryDefaults?: Record<string, ModificationCapability>
): MergedRuleset {
  return {
    snapshotId: "test-snapshot",
    editionId: "sr5",
    editionCode: "sr5",
    bookIds: ["core-rulebook"],
    modules: {
      categoryModificationDefaults: categoryDefaults,
    },
    createdAt: new Date().toISOString(),
  };
}

/**
 * Create a test item
 */
function createTestItem(
  subcategory: string,
  modificationCapability?: ModificationCapability,
  capacity?: number
): ModifiableItem {
  return {
    subcategory,
    modificationCapability,
    capacity,
  };
}

// =============================================================================
// RESOLUTION TESTS
// =============================================================================

describe("resolveModificationCapability", () => {
  describe("item-level capability", () => {
    it("should return item capability when explicitly set", () => {
      const ruleset = createTestRuleset({
        melee: { capabilityMode: "none" },
      });
      const item = createTestItem("melee", {
        capabilityMode: "slot-based",
        slots: [{ slotId: "grip", slotType: "grip", label: "Grip" }],
      });

      const result = resolveModificationCapability(item, ruleset);

      expect(result.capability).not.toBeNull();
      expect(result.capability?.capabilityMode).toBe("slot-based");
      expect(result.source).toBe("item");
      expect(result.subcategory).toBe("melee");
    });

    it("should return null when item capability is 'none'", () => {
      const ruleset = createTestRuleset({
        melee: {
          capabilityMode: "slot-based",
          slots: [],
        },
      });
      const item = createTestItem("melee", { capabilityMode: "none" });

      const result = resolveModificationCapability(item, ruleset);

      expect(result.capability).toBeNull();
      expect(result.source).toBe("item");
    });
  });

  describe("category defaults", () => {
    it("should fall back to category defaults when no item capability", () => {
      const ruleset = createTestRuleset({
        "heavy-pistol": {
          capabilityMode: "mount-based",
          availableMounts: ["top", "under", "barrel"],
        },
      });
      const item = createTestItem("heavy-pistol");

      const result = resolveModificationCapability(item, ruleset);

      expect(result.capability).not.toBeNull();
      expect(result.capability?.capabilityMode).toBe("mount-based");
      expect(result.capability?.availableMounts).toEqual(["top", "under", "barrel"]);
      expect(result.source).toBe("category-default");
    });

    it("should return null when category default is 'none'", () => {
      const ruleset = createTestRuleset({
        melee: { capabilityMode: "none" },
      });
      const item = createTestItem("melee");

      const result = resolveModificationCapability(item, ruleset);

      expect(result.capability).toBeNull();
      expect(result.source).toBe("category-default");
    });
  });

  describe("no capability", () => {
    it("should return null when no item capability and no category default", () => {
      const ruleset = createTestRuleset({});
      const item = createTestItem("unknown-category");

      const result = resolveModificationCapability(item, ruleset);

      expect(result.capability).toBeNull();
      expect(result.source).toBe("none");
    });

    it("should return null when ruleset has no categoryModificationDefaults", () => {
      const ruleset = createTestRuleset(undefined);
      const item = createTestItem("heavy-pistol");

      const result = resolveModificationCapability(item, ruleset);

      expect(result.capability).toBeNull();
      expect(result.source).toBe("none");
    });
  });
});

describe("getModificationCapability", () => {
  it("should return capability directly without resolution metadata", () => {
    const ruleset = createTestRuleset({
      armor: { capabilityMode: "capacity-based", capacity: 12 },
    });
    const item = createTestItem("armor");

    const capability = getModificationCapability(item, ruleset);

    expect(capability).not.toBeNull();
    expect(capability?.capabilityMode).toBe("capacity-based");
    expect(capability?.capacity).toBe(12);
  });
});

describe("canAcceptModifications", () => {
  it("should return true for items with modification support", () => {
    const ruleset = createTestRuleset({
      smg: { capabilityMode: "mount-based", availableMounts: ["top", "under"] },
    });
    const item = createTestItem("smg");

    expect(canAcceptModifications(item, ruleset)).toBe(true);
  });

  it("should return false for items without modification support", () => {
    const ruleset = createTestRuleset({
      melee: { capabilityMode: "none" },
    });
    const item = createTestItem("melee");

    expect(canAcceptModifications(item, ruleset)).toBe(false);
  });
});

// =============================================================================
// MODE-SPECIFIC HELPER TESTS
// =============================================================================

describe("getAvailableMounts", () => {
  it("should return mounts for mount-based items", () => {
    const ruleset = createTestRuleset({
      "assault-rifle": {
        capabilityMode: "mount-based",
        availableMounts: ["top", "under", "side", "barrel", "stock"],
      },
    });
    const item = createTestItem("assault-rifle");

    const mounts = getAvailableMounts(item, ruleset);

    expect(mounts).toEqual(["top", "under", "side", "barrel", "stock"]);
  });

  it("should return empty array for non-mount-based items", () => {
    const ruleset = createTestRuleset({
      armor: { capabilityMode: "capacity-based" },
    });
    const item = createTestItem("armor");

    expect(getAvailableMounts(item, ruleset)).toEqual([]);
  });

  it("should return empty array for items with no mod support", () => {
    const ruleset = createTestRuleset({
      melee: { capabilityMode: "none" },
    });
    const item = createTestItem("melee");

    expect(getAvailableMounts(item, ruleset)).toEqual([]);
  });
});

describe("getModificationCapacity", () => {
  it("should return capacity from capability definition", () => {
    const ruleset = createTestRuleset({
      armor: { capabilityMode: "capacity-based", capacity: 12 },
    });
    const item = createTestItem("armor");

    expect(getModificationCapacity(item, ruleset)).toBe(12);
  });

  it("should fall back to item capacity when capability has none", () => {
    const ruleset = createTestRuleset({
      armor: { capabilityMode: "capacity-based" },
    });
    const item = createTestItem("armor", undefined, 8);

    expect(getModificationCapacity(item, ruleset)).toBe(8);
  });

  it("should return 0 for non-capacity-based items", () => {
    const ruleset = createTestRuleset({
      "heavy-pistol": { capabilityMode: "mount-based", availableMounts: ["top"] },
    });
    const item = createTestItem("heavy-pistol", undefined, 10);

    expect(getModificationCapacity(item, ruleset)).toBe(0);
  });
});

describe("getModificationSlots", () => {
  const testSlots: ModificationSlot[] = [
    { slotId: "grip", slotType: "grip", label: "Grip" },
    { slotId: "blade", slotType: "blade-coating", label: "Blade Coating" },
    { slotId: "guard", slotType: "guard", label: "Guard" },
  ];

  it("should return slots for slot-based items", () => {
    const ruleset = createTestRuleset({
      blades: { capabilityMode: "slot-based", slots: testSlots },
    });
    const item = createTestItem("blades");

    const slots = getModificationSlots(item, ruleset);

    expect(slots).toHaveLength(3);
    expect(slots[0].slotId).toBe("grip");
    expect(slots[1].slotId).toBe("blade");
    expect(slots[2].slotId).toBe("guard");
  });

  it("should return empty array for non-slot-based items", () => {
    const ruleset = createTestRuleset({
      "heavy-pistol": { capabilityMode: "mount-based", availableMounts: ["top"] },
    });
    const item = createTestItem("heavy-pistol");

    expect(getModificationSlots(item, ruleset)).toEqual([]);
  });
});

// =============================================================================
// COMPATIBILITY TESTS
// =============================================================================

describe("isModificationAllowed", () => {
  it("should return true when no restrictions", () => {
    const ruleset = createTestRuleset({
      "heavy-pistol": { capabilityMode: "mount-based", availableMounts: ["top"] },
    });
    const item = createTestItem("heavy-pistol");

    expect(isModificationAllowed(item, ruleset, "smartgun-system")).toBe(true);
  });

  it("should return false when mod is blacklisted", () => {
    const ruleset = createTestRuleset({
      blades: {
        capabilityMode: "slot-based",
        slots: [],
        disallowedModifications: ["blade-coating-corrosive"],
      },
    });
    const item = createTestItem("blades");

    expect(isModificationAllowed(item, ruleset, "blade-coating-corrosive")).toBe(false);
    expect(isModificationAllowed(item, ruleset, "blade-coating-shock")).toBe(true);
  });

  it("should only allow whitelisted mods when whitelist is defined", () => {
    const ruleset = createTestRuleset({
      holdout: {
        capabilityMode: "mount-based",
        availableMounts: ["top"],
        allowedModifications: ["laser-sight", "smartgun-system"],
      },
    });
    const item = createTestItem("holdout");

    expect(isModificationAllowed(item, ruleset, "laser-sight")).toBe(true);
    expect(isModificationAllowed(item, ruleset, "smartgun-system")).toBe(true);
    expect(isModificationAllowed(item, ruleset, "bipod")).toBe(false);
  });

  it("should check category restrictions", () => {
    const ruleset = createTestRuleset({
      blades: {
        capabilityMode: "slot-based",
        slots: [],
        allowedModCategories: ["melee-enhancement", "grip"],
      },
    });
    const item = createTestItem("blades");

    expect(isModificationAllowed(item, ruleset, "custom-grip", "grip")).toBe(true);
    expect(isModificationAllowed(item, ruleset, "scope", "weapon-optics")).toBe(false);
  });

  it("should return false when no modification support", () => {
    const ruleset = createTestRuleset({
      melee: { capabilityMode: "none" },
    });
    const item = createTestItem("melee");

    expect(isModificationAllowed(item, ruleset, "any-mod")).toBe(false);
  });
});

describe("canInstallInSlot", () => {
  it("should allow any mod when no restrictions on slot", () => {
    const slot: ModificationSlot = {
      slotId: "grip",
      slotType: "grip",
      label: "Grip",
    };

    expect(canInstallInSlot(slot, "custom-grip")).toBe(true);
    expect(canInstallInSlot(slot, "any-mod")).toBe(true);
  });

  it("should enforce specific mod whitelist", () => {
    const slot: ModificationSlot = {
      slotId: "grip",
      slotType: "grip",
      label: "Grip",
      acceptsModifications: ["rubber-grip", "wooden-grip", "composite-grip"],
    };

    expect(canInstallInSlot(slot, "rubber-grip")).toBe(true);
    expect(canInstallInSlot(slot, "metal-grip")).toBe(false);
  });

  it("should enforce category whitelist", () => {
    const slot: ModificationSlot = {
      slotId: "blade",
      slotType: "blade-coating",
      label: "Blade Coating",
      acceptsCategories: ["elemental-coating", "material-coating"],
    };

    expect(canInstallInSlot(slot, "shock-coating", "elemental-coating")).toBe(true);
    expect(canInstallInSlot(slot, "ceramic-coating", "material-coating")).toBe(true);
    expect(canInstallInSlot(slot, "laser-sight", "weapon-optics")).toBe(false);
  });
});

// =============================================================================
// MODE CHECK TESTS
// =============================================================================

describe("mode check functions", () => {
  const mountBasedRuleset = createTestRuleset({
    "heavy-pistol": { capabilityMode: "mount-based", availableMounts: ["top"] },
  });
  const capacityBasedRuleset = createTestRuleset({
    armor: { capabilityMode: "capacity-based" },
  });
  const slotBasedRuleset = createTestRuleset({
    blades: { capabilityMode: "slot-based", slots: [] },
  });

  describe("isMountBased", () => {
    it("should return true for mount-based items", () => {
      expect(isMountBased(createTestItem("heavy-pistol"), mountBasedRuleset)).toBe(true);
    });

    it("should return false for other modes", () => {
      expect(isMountBased(createTestItem("armor"), capacityBasedRuleset)).toBe(false);
      expect(isMountBased(createTestItem("blades"), slotBasedRuleset)).toBe(false);
    });
  });

  describe("isCapacityBased", () => {
    it("should return true for capacity-based items", () => {
      expect(isCapacityBased(createTestItem("armor"), capacityBasedRuleset)).toBe(true);
    });

    it("should return false for other modes", () => {
      expect(isCapacityBased(createTestItem("heavy-pistol"), mountBasedRuleset)).toBe(false);
      expect(isCapacityBased(createTestItem("blades"), slotBasedRuleset)).toBe(false);
    });
  });

  describe("isSlotBased", () => {
    it("should return true for slot-based items", () => {
      expect(isSlotBased(createTestItem("blades"), slotBasedRuleset)).toBe(true);
    });

    it("should return false for other modes", () => {
      expect(isSlotBased(createTestItem("heavy-pistol"), mountBasedRuleset)).toBe(false);
      expect(isSlotBased(createTestItem("armor"), capacityBasedRuleset)).toBe(false);
    });
  });
});

// =============================================================================
// CATEGORY DEFAULTS ACCESSOR TESTS
// =============================================================================

describe("getCategoryModificationDefaults", () => {
  it("should return category defaults when present", () => {
    const defaults = {
      melee: { capabilityMode: "none" as const },
      armor: { capabilityMode: "capacity-based" as const },
    };
    const ruleset = createTestRuleset(defaults);

    const result = getCategoryModificationDefaults(ruleset);

    expect(result).toBeDefined();
    expect(result?.melee.capabilityMode).toBe("none");
    expect(result?.armor.capabilityMode).toBe("capacity-based");
  });

  it("should return undefined when no category defaults", () => {
    const ruleset = createTestRuleset(undefined);

    const result = getCategoryModificationDefaults(ruleset);

    expect(result).toBeUndefined();
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe("integration: sourcebook enabling melee mods", () => {
  it("should support melee mods after sourcebook merge", () => {
    // Simulate core rulebook: melee has no mod support
    const coreDefaults = {
      melee: { capabilityMode: "none" as const },
      blades: { capabilityMode: "none" as const },
    };

    // Simulate sourcebook enabling melee mods
    const sourcebookDefaults = {
      melee: {
        capabilityMode: "slot-based" as const,
        slots: [{ slotId: "grip", slotType: "grip", label: "Grip", maxCount: 1 }],
      },
      blades: {
        capabilityMode: "slot-based" as const,
        slots: [
          { slotId: "grip", slotType: "grip", label: "Grip", maxCount: 1 },
          { slotId: "blade", slotType: "blade-coating", label: "Blade Coating", maxCount: 1 },
          { slotId: "guard", slotType: "guard", label: "Guard", maxCount: 1 },
        ],
      },
    };

    // Before sourcebook: no mod support
    const coreRuleset = createTestRuleset(coreDefaults);
    const meleeWeapon = createTestItem("blades");

    expect(canAcceptModifications(meleeWeapon, coreRuleset)).toBe(false);
    expect(getModificationSlots(meleeWeapon, coreRuleset)).toEqual([]);

    // After sourcebook merge: slot-based support
    const mergedRuleset = createTestRuleset(sourcebookDefaults);

    expect(canAcceptModifications(meleeWeapon, mergedRuleset)).toBe(true);
    expect(isSlotBased(meleeWeapon, mergedRuleset)).toBe(true);
    expect(getModificationSlots(meleeWeapon, mergedRuleset)).toHaveLength(3);
  });
});

describe("integration: item-level override of category default", () => {
  it("should allow special items to override category behavior", () => {
    const ruleset = createTestRuleset({
      blades: {
        capabilityMode: "slot-based",
        slots: [
          { slotId: "grip", slotType: "grip", label: "Grip" },
          { slotId: "blade", slotType: "blade-coating", label: "Blade Coating" },
        ],
      },
    });

    // Regular blade uses category defaults
    const regularBlade = createTestItem("blades");
    expect(getModificationSlots(regularBlade, ruleset)).toHaveLength(2);

    // Monofilament sword has restrictions (item-level override)
    const monofilamentSword = createTestItem("blades", {
      capabilityMode: "slot-based",
      slots: [{ slotId: "grip", slotType: "grip", label: "Grip" }],
      disallowedModifications: ["blade-coating-corrosive"],
    });

    expect(getModificationSlots(monofilamentSword, ruleset)).toHaveLength(1);
    expect(isModificationAllowed(monofilamentSword, ruleset, "blade-coating-corrosive")).toBe(
      false
    );
    expect(isModificationAllowed(monofilamentSword, ruleset, "custom-grip")).toBe(true);
  });
});
