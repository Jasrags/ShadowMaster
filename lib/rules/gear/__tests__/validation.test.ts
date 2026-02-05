/**
 * Tests for Gear Validation Engine
 *
 * Tests the SR5 creation constraints:
 * - Maximum Availability at creation: 12
 * - Maximum Device Rating at creation: 6
 * - Restricted items not allowed at creation
 * - Forbidden items never allowed at creation
 */

import { describe, it, expect } from "vitest";
import {
  validateAllGear,
  isAvailabilityValidForCreation,
  isDeviceRatingValidForCreation,
  CREATION_CONSTRAINTS,
} from "../validation";
import type { Character } from "@/lib/types";

// =============================================================================
// TEST HELPERS
// =============================================================================

function createTestCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "test-char",
    ownerId: "test-owner",
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "sr5-priority",
    rulesetSnapshotId: "snapshot-1",
    attachedBookIds: [],
    name: "Test Runner",
    metatype: "human",
    status: "draft", // Creation stage
    attributes: {},
    specialAttributes: {},
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    contacts: [],
    derivedStats: {},
    condition: { physicalDamage: 0, stunDamage: 0 },
    karmaTotal: 0,
    karmaCurrent: 25,
    karmaSpentAtCreation: 0,
    createdAt: new Date().toISOString(),
    ...overrides,
  } as Character;
}

// =============================================================================
// CONVENIENCE FUNCTION TESTS
// =============================================================================

describe("isAvailabilityValidForCreation", () => {
  it("should return true for availability <= 12", () => {
    expect(isAvailabilityValidForCreation(0)).toBe(true);
    expect(isAvailabilityValidForCreation(6)).toBe(true);
    expect(isAvailabilityValidForCreation(12)).toBe(true);
  });

  it("should return false for availability > 12", () => {
    expect(isAvailabilityValidForCreation(13)).toBe(false);
    expect(isAvailabilityValidForCreation(18)).toBe(false);
    expect(isAvailabilityValidForCreation(24)).toBe(false);
  });

  it("should return false for restricted items", () => {
    expect(isAvailabilityValidForCreation(8, true)).toBe(false);
    expect(isAvailabilityValidForCreation(12, true)).toBe(false);
  });

  it("should return false for forbidden items", () => {
    expect(isAvailabilityValidForCreation(4, false, true)).toBe(false);
    expect(isAvailabilityValidForCreation(12, false, true)).toBe(false);
  });
});

describe("isDeviceRatingValidForCreation", () => {
  it("should return true for device rating <= 6", () => {
    expect(isDeviceRatingValidForCreation(1)).toBe(true);
    expect(isDeviceRatingValidForCreation(4)).toBe(true);
    expect(isDeviceRatingValidForCreation(6)).toBe(true);
  });

  it("should return false for device rating > 6", () => {
    expect(isDeviceRatingValidForCreation(7)).toBe(false);
    expect(isDeviceRatingValidForCreation(8)).toBe(false);
    expect(isDeviceRatingValidForCreation(10)).toBe(false);
  });
});

// =============================================================================
// GEAR AVAILABILITY TESTS
// =============================================================================

describe("validateAllGear - Availability", () => {
  it("should pass for gear with availability <= 12", () => {
    const character = createTestCharacter({
      gear: [
        { name: "Flashlight", category: "electronics", quantity: 1, cost: 25, availability: 4 },
        { name: "Medkit", category: "medical", quantity: 1, cost: 500, availability: 12 },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail for gear with availability > 12 at creation", () => {
    const character = createTestCharacter({
      gear: [
        { name: "Rare Device", category: "electronics", quantity: 1, cost: 5000, availability: 18 },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].code).toBe("AVAILABILITY_EXCEEDED");
    expect(result.errors[0].itemName).toBe("Rare Device");
    expect(result.errors[0].message).toContain("18");
    expect(result.errors[0].message).toContain("12");
  });

  it("should pass for gear with high availability when character is active (not creation)", () => {
    const character = createTestCharacter({
      status: "active", // Post-creation
      gear: [
        { name: "Rare Device", category: "electronics", quantity: 1, cost: 5000, availability: 18 },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe("validateAllGear - Weapons", () => {
  it("should pass for weapons with availability <= 12", () => {
    const character = createTestCharacter({
      weapons: [
        {
          name: "Ares Predator V",
          category: "weapons",
          subcategory: "pistols",
          quantity: 1,
          cost: 725,
          availability: 5,
          damage: "8P",
          ap: -1,
          mode: ["SA"],
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
  });

  it("should fail for weapons with availability > 12 at creation", () => {
    const character = createTestCharacter({
      weapons: [
        {
          name: "Assault Cannon",
          category: "weapons",
          subcategory: "heavy",
          quantity: 1,
          cost: 15000,
          availability: 16,
          damage: "16P",
          ap: -6,
          mode: ["SA"],
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("AVAILABILITY_EXCEEDED");
    expect(result.errors[0].itemName).toBe("Assault Cannon");
  });

  it("should fail for weapon modifications with availability > 12", () => {
    const character = createTestCharacter({
      weapons: [
        {
          name: "Ares Predator V",
          category: "weapons",
          subcategory: "pistols",
          quantity: 1,
          cost: 725,
          availability: 5,
          damage: "8P",
          ap: -1,
          mode: ["SA"],
          modifications: [
            {
              catalogId: "rare-mod",
              name: "Rare Silencer",
              availability: 14,
              cost: 1000,
              capacityUsed: 1,
            },
          ],
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("MOD_AVAILABILITY_EXCEEDED");
    expect(result.errors[0].message).toContain("Rare Silencer");
    expect(result.errors[0].message).toContain("Ares Predator V");
  });
});

describe("validateAllGear - Armor", () => {
  it("should pass for armor with availability <= 12", () => {
    const character = createTestCharacter({
      armor: [
        {
          name: "Armor Jacket",
          category: "armor",
          quantity: 1,
          cost: 1000,
          availability: 2,
          armorRating: 12,
          equipped: true,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
  });

  it("should fail for armor modifications with availability > 12", () => {
    const character = createTestCharacter({
      armor: [
        {
          name: "Full Body Armor",
          category: "armor",
          quantity: 1,
          cost: 2000,
          availability: 8,
          armorRating: 15,
          equipped: true,
          modifications: [
            {
              catalogId: "rare-armor-mod",
              name: "Chemical Protection 6",
              availability: 14,
              cost: 1500,
              capacityUsed: 6,
            },
          ],
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("MOD_AVAILABILITY_EXCEEDED");
  });
});

// =============================================================================
// DEVICE RATING TESTS
// =============================================================================

describe("validateAllGear - Cyberdecks Device Rating", () => {
  it("should pass for cyberdecks with device rating <= 6", () => {
    const character = createTestCharacter({
      cyberdecks: [
        {
          catalogId: "erika-mcd-1",
          name: "Erika MCD-1",
          deviceRating: 1,
          attributeArray: [4, 3, 2, 1],
          currentConfig: { attack: 4, sleaze: 3, dataProcessing: 2, firewall: 1 },
          programSlots: 2,
          loadedPrograms: [],
          cost: 49500,
          availability: 3,
        },
        {
          catalogId: "fairlight-excalibur",
          name: "Fairlight Excalibur",
          deviceRating: 6,
          attributeArray: [8, 7, 6, 5],
          currentConfig: { attack: 8, sleaze: 7, dataProcessing: 6, firewall: 5 },
          programSlots: 6,
          loadedPrograms: [],
          cost: 823250,
          availability: 12,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
  });

  it("should fail for cyberdecks with device rating > 6 at creation", () => {
    const character = createTestCharacter({
      cyberdecks: [
        {
          catalogId: "prototype-deck",
          name: "Prototype Cyberdeck",
          deviceRating: 8,
          attributeArray: [10, 9, 8, 7],
          currentConfig: { attack: 10, sleaze: 9, dataProcessing: 8, firewall: 7 },
          programSlots: 8,
          loadedPrograms: [],
          cost: 2000000,
          availability: 10,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("DEVICE_RATING_EXCEEDED");
    expect(result.errors[0].itemName).toBe("Prototype Cyberdeck");
    expect(result.errors[0].message).toContain("8");
    expect(result.errors[0].message).toContain("6");
  });
});

describe("validateAllGear - Commlinks Device Rating", () => {
  it("should pass for commlinks with device rating <= 6", () => {
    const character = createTestCharacter({
      commlinks: [
        {
          catalogId: "meta-link",
          name: "Meta Link",
          deviceRating: 1,
          dataProcessing: 1,
          firewall: 1,
          cost: 100,
          availability: 2,
          loadedPrograms: [],
        },
        {
          catalogId: "transys-avalon",
          name: "Transys Avalon",
          deviceRating: 6,
          dataProcessing: 6,
          firewall: 6,
          cost: 5000,
          availability: 12,
          loadedPrograms: [],
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
  });

  it("should fail for commlinks with device rating > 6 at creation", () => {
    const character = createTestCharacter({
      commlinks: [
        {
          catalogId: "prototype-link",
          name: "Prototype Commlink",
          deviceRating: 7,
          dataProcessing: 7,
          firewall: 7,
          cost: 50000,
          availability: 8,
          loadedPrograms: [],
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("DEVICE_RATING_EXCEEDED");
    expect(result.errors[0].itemName).toBe("Prototype Commlink");
  });
});

describe("validateAllGear - RCCs Device Rating", () => {
  it("should pass for RCCs with device rating <= 6", () => {
    const character = createTestCharacter({
      rccs: [
        {
          catalogId: "mct-drone-web",
          name: "MCT Drone Web",
          deviceRating: 4,
          dataProcessing: 4,
          firewall: 4,
          cost: 19500,
          availability: 8,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
  });

  it("should fail for RCCs with device rating > 6 at creation", () => {
    const character = createTestCharacter({
      rccs: [
        {
          catalogId: "prototype-rcc",
          name: "Prototype RCC",
          deviceRating: 8,
          dataProcessing: 8,
          firewall: 8,
          cost: 100000,
          availability: 10,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("DEVICE_RATING_EXCEEDED");
    expect(result.errors[0].itemName).toBe("Prototype RCC");
  });
});

// =============================================================================
// RESTRICTED/FORBIDDEN TESTS
// =============================================================================

describe("validateAllGear - Restricted Items", () => {
  it("should fail for restricted items at creation", () => {
    const character = createTestCharacter({
      cyberdecks: [
        {
          catalogId: "restricted-deck",
          name: "Restricted Cyberdeck",
          deviceRating: 4,
          attributeArray: [6, 5, 4, 3],
          currentConfig: { attack: 6, sleaze: 5, dataProcessing: 4, firewall: 3 },
          programSlots: 4,
          loadedPrograms: [],
          cost: 100000,
          availability: 8,
          legality: "restricted",
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("AVAILABILITY_RESTRICTED");
    expect(result.errors[0].message).toContain("restricted");
  });
});

describe("validateAllGear - Forbidden Items", () => {
  it("should fail for forbidden items at creation", () => {
    const character = createTestCharacter({
      cyberdecks: [
        {
          catalogId: "forbidden-deck",
          name: "Military Cyberdeck",
          deviceRating: 5,
          attributeArray: [7, 6, 5, 4],
          currentConfig: { attack: 7, sleaze: 6, dataProcessing: 5, firewall: 4 },
          programSlots: 5,
          loadedPrograms: [],
          cost: 500000,
          availability: 10,
          legality: "forbidden",
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("AVAILABILITY_FORBIDDEN");
    expect(result.errors[0].message).toContain("forbidden");
  });
});

// =============================================================================
// COMBINED VALIDATION TESTS
// =============================================================================

describe("validateAllGear - Multiple Issues", () => {
  it("should report all validation errors found", () => {
    const character = createTestCharacter({
      gear: [
        { name: "Rare Gear", category: "electronics", quantity: 1, cost: 5000, availability: 14 },
      ],
      weapons: [
        {
          name: "Restricted Weapon",
          category: "weapons",
          subcategory: "heavy",
          quantity: 1,
          cost: 10000,
          availability: 10,
          damage: "10P",
          ap: -4,
          mode: ["SA"],
          modifications: [
            {
              catalogId: "illegal-mod",
              name: "Illegal Suppressor",
              availability: 16,
              cost: 2000,
              capacityUsed: 1,
              legality: "forbidden",
            },
          ],
        },
      ],
      cyberdecks: [
        {
          catalogId: "high-rating-deck",
          name: "High Rating Deck",
          deviceRating: 8,
          attributeArray: [10, 9, 8, 7],
          currentConfig: { attack: 10, sleaze: 9, dataProcessing: 8, firewall: 7 },
          programSlots: 8,
          loadedPrograms: [],
          cost: 2000000,
          availability: 6,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    // Should have 3 errors:
    // 1. Rare Gear availability > 12
    // 2. Illegal Suppressor forbidden
    // 3. High Rating Deck device rating > 6
    expect(result.errors.length).toBeGreaterThanOrEqual(3);

    const errorCodes = result.errors.map((e) => e.code);
    expect(errorCodes).toContain("AVAILABILITY_EXCEEDED");
    expect(errorCodes).toContain("MOD_FORBIDDEN");
    expect(errorCodes).toContain("DEVICE_RATING_EXCEEDED");
  });
});

// =============================================================================
// CONSTANTS TESTS
// =============================================================================

// =============================================================================
// DRONE VALIDATION TESTS
// =============================================================================

describe("validateAllGear - Drones", () => {
  it("should pass for drones with availability <= 12", () => {
    const character = createTestCharacter({
      drones: [
        {
          catalogId: "mct-fly-spy",
          name: "MCT Fly-Spy",
          size: "mini",
          handling: 4,
          speed: 3,
          acceleration: 3,
          body: 1,
          armor: 0,
          pilot: 3,
          sensor: 3,
          cost: 2000,
          availability: 8,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail for drones with availability > 12 at creation", () => {
    const character = createTestCharacter({
      drones: [
        {
          catalogId: "ares-paladin",
          name: "Ares Paladin",
          size: "large",
          handling: 3,
          speed: 4,
          acceleration: 3,
          body: 6,
          armor: 12,
          pilot: 4,
          sensor: 4,
          cost: 75000,
          availability: 18,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("AVAILABILITY_EXCEEDED");
    expect(result.errors[0].itemType).toBe("drone");
    expect(result.errors[0].itemName).toBe("Ares Paladin");
  });

  it("should fail for drones with restricted legality at creation", () => {
    const character = createTestCharacter({
      drones: [
        {
          catalogId: "steel-lynx",
          name: "Steel Lynx",
          size: "medium",
          handling: 5,
          speed: 4,
          acceleration: 3,
          body: 4,
          armor: 6,
          pilot: 3,
          sensor: 3,
          cost: 25000,
          availability: 10,
          legality: "restricted",
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("AVAILABILITY_RESTRICTED");
    expect(result.errors[0].itemType).toBe("drone");
  });

  it("should fail for drones with forbidden legality at creation", () => {
    const character = createTestCharacter({
      drones: [
        {
          catalogId: "military-drone",
          name: "Military Drone",
          size: "large",
          handling: 5,
          speed: 5,
          acceleration: 4,
          body: 8,
          armor: 15,
          pilot: 5,
          sensor: 5,
          cost: 200000,
          availability: 10,
          legality: "forbidden",
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("AVAILABILITY_FORBIDDEN");
    expect(result.errors[0].itemType).toBe("drone");
  });

  it("should pass for active character with high availability drones", () => {
    const character = createTestCharacter({
      status: "active",
      drones: [
        {
          catalogId: "ares-paladin",
          name: "Ares Paladin",
          size: "large",
          handling: 3,
          speed: 4,
          acceleration: 3,
          body: 6,
          armor: 12,
          pilot: 4,
          sensor: 4,
          cost: 75000,
          availability: 18,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// =============================================================================
// AUTOSOFT VALIDATION TESTS
// =============================================================================

describe("validateAllGear - Autosofts", () => {
  it("should pass for autosofts with availability <= 12", () => {
    const character = createTestCharacter({
      autosofts: [
        {
          catalogId: "clearsight",
          name: "Clearsight",
          category: "perception",
          rating: 4,
          cost: 2000,
          availability: 8,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail for autosofts with availability > 12 at creation", () => {
    const character = createTestCharacter({
      autosofts: [
        {
          catalogId: "targeting-r6",
          name: "Targeting (Assault Rifles) 6",
          category: "combat",
          rating: 6,
          target: "assault-rifles",
          cost: 6000,
          availability: 18,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("AVAILABILITY_EXCEEDED");
    expect(result.errors[0].itemType).toBe("autosoft");
    expect(result.errors[0].itemName).toBe("Targeting (Assault Rifles) 6");
  });

  it("should pass for active character with high availability autosofts", () => {
    const character = createTestCharacter({
      status: "active",
      autosofts: [
        {
          catalogId: "targeting-r6",
          name: "Targeting 6",
          category: "combat",
          rating: 6,
          cost: 6000,
          availability: 18,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// =============================================================================
// VEHICLE VALIDATION TESTS
// =============================================================================

describe("validateAllGear - Vehicles", () => {
  it("should pass for vehicles with availability <= 12", () => {
    const character = createTestCharacter({
      vehicles: [
        {
          catalogId: "dodge-scoot",
          name: "Dodge Scoot",
          type: "ground",
          handling: 4,
          speed: 3,
          acceleration: 1,
          body: 4,
          armor: 4,
          pilot: 1,
          sensor: 1,
          seats: 1,
          cost: 3000,
          availability: 0,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should fail for vehicles with availability > 12 at creation", () => {
    const character = createTestCharacter({
      vehicles: [
        {
          catalogId: "ares-roadmaster",
          name: "Ares Roadmaster",
          type: "ground",
          handling: 3,
          speed: 3,
          acceleration: 1,
          body: 18,
          armor: 14,
          pilot: 1,
          sensor: 2,
          seats: 8,
          cost: 52000,
          availability: 14,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("AVAILABILITY_EXCEEDED");
    expect(result.errors[0].itemType).toBe("vehicle");
    expect(result.errors[0].itemName).toBe("Ares Roadmaster");
  });

  it("should fail for vehicles with restricted legality at creation", () => {
    const character = createTestCharacter({
      vehicles: [
        {
          catalogId: "gmc-bulldog-stepvan",
          name: "GMC Bulldog Step-Van",
          type: "ground",
          handling: 4,
          speed: 3,
          acceleration: 2,
          body: 16,
          armor: 12,
          pilot: 1,
          sensor: 2,
          seats: 4,
          cost: 35000,
          availability: 8,
          legality: "restricted",
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("AVAILABILITY_RESTRICTED");
    expect(result.errors[0].itemType).toBe("vehicle");
  });

  it("should fail for vehicles with forbidden legality at creation", () => {
    const character = createTestCharacter({
      vehicles: [
        {
          catalogId: "ares-citymaster",
          name: "Ares Citymaster",
          type: "ground",
          handling: 2,
          speed: 2,
          acceleration: 1,
          body: 20,
          armor: 20,
          pilot: 1,
          sensor: 3,
          seats: 6,
          cost: 330000,
          availability: 10,
          legality: "forbidden",
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(false);
    expect(result.errors[0].code).toBe("AVAILABILITY_FORBIDDEN");
    expect(result.errors[0].itemType).toBe("vehicle");
  });

  it("should pass for active character with high availability vehicles", () => {
    const character = createTestCharacter({
      status: "active",
      vehicles: [
        {
          catalogId: "ares-roadmaster",
          name: "Ares Roadmaster",
          type: "ground",
          handling: 3,
          speed: 3,
          acceleration: 1,
          body: 18,
          armor: 14,
          pilot: 1,
          sensor: 2,
          seats: 8,
          cost: 52000,
          availability: 14,
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should pass for active character with restricted vehicles", () => {
    const character = createTestCharacter({
      status: "active",
      vehicles: [
        {
          catalogId: "gmc-bulldog-stepvan",
          name: "GMC Bulldog Step-Van",
          type: "ground",
          handling: 4,
          speed: 3,
          acceleration: 2,
          body: 16,
          armor: 12,
          pilot: 1,
          sensor: 2,
          seats: 4,
          cost: 35000,
          availability: 8,
          legality: "restricted",
        },
      ],
    });

    const result = validateAllGear(character);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// =============================================================================
// CONSTANTS TESTS
// =============================================================================

describe("CREATION_CONSTRAINTS", () => {
  it("should have correct default values per SR5 rules", () => {
    expect(CREATION_CONSTRAINTS.maxAvailabilityAtCreation).toBe(12);
    expect(CREATION_CONSTRAINTS.maxDeviceRatingAtCreation).toBe(6);
    expect(CREATION_CONSTRAINTS.allowRestrictedAtCreation).toBe(false);
    expect(CREATION_CONSTRAINTS.allowForbiddenAtCreation).toBe(false);
  });
});
