/**
 * Shared test utilities for augmentation API route tests
 *
 * Provides common mock data and helpers for testing cyberlimb routes.
 */

import { NextRequest } from "next/server";
import type { Character, CyberwareGrade } from "@/lib/types";
import type {
  CyberlimbItem,
  CyberlimbLocation,
  CyberlimbType,
  CyberlimbEnhancement,
  CyberlimbAccessory,
  CyberlimbAppearance,
} from "@/lib/types/cyberlimb";
import type { CyberwareCatalogItem, CyberlimbCatalogItem } from "@/lib/types/edition";

// =============================================================================
// TEST CONSTANTS
// =============================================================================

export const TEST_USER_ID = "test-user-123";
export const TEST_CHARACTER_ID = "test-char-456";
export const TEST_LIMB_ID = "limb-789";
export const TEST_ENHANCEMENT_ID = "enh-101";
export const TEST_ACCESSORY_ID = "acc-202";

// =============================================================================
// MOCK CHARACTER
// =============================================================================

export function createMockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    name: "Test Runner",
    status: "active",
    editionCode: "sr5",
    editionId: "sr5-edition-id",
    creationMethodId: "priority",
    attachedBookIds: ["core-rulebook"],
    metatype: "Human",
    attributes: {
      body: 3,
      agility: 4,
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
    nuyen: 50000,
    startingNuyen: 50000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    specialAttributes: {
      edge: 3,
      essence: 6,
    },
    cyberware: [],
    bioware: [],
    cyberlimbs: [],
    ...overrides,
  } as Character;
}

// =============================================================================
// MOCK CYBERLIMB
// =============================================================================

export function createMockCyberlimb(overrides: Partial<CyberlimbItem> = {}): CyberlimbItem {
  return {
    id: TEST_LIMB_ID,
    catalogId: "obvious-full-arm",
    name: "Obvious Full Arm",
    category: "cyberlimb",
    location: "right-arm" as CyberlimbLocation,
    limbType: "full-arm" as CyberlimbType,
    appearance: "obvious" as CyberlimbAppearance,
    grade: "standard" as CyberwareGrade,
    baseEssenceCost: 1.0,
    essenceCost: 1.0,
    cost: 15000,
    availability: 4,
    baseStrength: 3,
    baseAgility: 3,
    customStrength: 0,
    customAgility: 0,
    baseCapacity: 15,
    capacityUsed: 0,
    enhancements: [],
    accessories: [],
    weapons: [],
    wirelessEnabled: true,
    condition: "working",
    installedAt: new Date().toISOString(),
    modificationHistory: [],
    ...overrides,
  };
}

// =============================================================================
// MOCK ENHANCEMENT
// =============================================================================

export function createMockEnhancement(
  overrides: Partial<CyberlimbEnhancement> = {}
): CyberlimbEnhancement {
  return {
    id: TEST_ENHANCEMENT_ID,
    catalogId: "cyberlimb-agility",
    name: "Agility Enhancement",
    enhancementType: "agility",
    rating: 1,
    capacityUsed: 1,
    cost: 6500,
    availability: 4,
    ...overrides,
  };
}

// =============================================================================
// MOCK ACCESSORY
// =============================================================================

export function createMockAccessory(
  overrides: Partial<CyberlimbAccessory> = {}
): CyberlimbAccessory {
  return {
    id: TEST_ACCESSORY_ID,
    catalogId: "cyberarm-gyromount",
    name: "Cyberarm Gyromount",
    capacityUsed: 5,
    cost: 6500,
    availability: 8,
    ...overrides,
  };
}

// =============================================================================
// MOCK CATALOG ITEMS
// =============================================================================

export const mockCyberlimbCatalog: CyberlimbCatalogItem[] = [
  {
    id: "obvious-full-arm",
    name: "Obvious Full Arm",
    category: "cyberlimb",
    limbType: "full-arm",
    appearance: "obvious",
    essenceCost: 1.0,
    cost: 15000,
    availability: 4,
    capacity: 15,
    baseStrength: 3,
    baseAgility: 3,
    physicalCMBonus: 1,
    description: "A visibly mechanical arm replacement",
  },
  {
    id: "obvious-full-leg",
    name: "Obvious Full Leg",
    category: "cyberlimb",
    limbType: "full-leg",
    appearance: "obvious",
    essenceCost: 1.0,
    cost: 15000,
    availability: 4,
    capacity: 20,
    baseStrength: 3,
    baseAgility: 3,
    physicalCMBonus: 1,
    description: "A visibly mechanical leg replacement",
  },
  {
    id: "synthetic-full-arm",
    name: "Synthetic Full Arm",
    category: "cyberlimb",
    limbType: "full-arm",
    appearance: "synthetic",
    essenceCost: 1.0,
    cost: 20000,
    availability: 6,
    capacity: 10,
    baseStrength: 3,
    baseAgility: 3,
    physicalCMBonus: 1,
    description: "A realistic-looking arm replacement",
  },
  {
    id: "obvious-hand",
    name: "Obvious Hand",
    category: "cyberlimb",
    limbType: "hand",
    appearance: "obvious",
    essenceCost: 0.25,
    cost: 5000,
    availability: 2,
    capacity: 4,
    baseStrength: 3,
    baseAgility: 3,
    physicalCMBonus: 0,
    description: "A visibly mechanical hand replacement",
  },
];

export const mockEnhancementCatalog: CyberwareCatalogItem[] = [
  {
    id: "cyberlimb-agility",
    name: "Agility Enhancement",
    category: "cyberlimb-enhancement",
    essenceCost: 0,
    cost: 6500,
    availability: 4,
    capacity: 1,
    hasRating: true,
    maxRating: 3,
    description: "Increases limb agility per rating",
  },
  {
    id: "cyberlimb-strength",
    name: "Strength Enhancement",
    category: "cyberlimb-enhancement",
    essenceCost: 0,
    cost: 6500,
    availability: 4,
    capacity: 1,
    hasRating: true,
    maxRating: 3,
    description: "Increases limb strength per rating",
  },
  {
    id: "cyberlimb-armor",
    name: "Armor Enhancement",
    category: "cyberlimb-enhancement",
    essenceCost: 0,
    cost: 3000,
    availability: 4,
    capacity: 1,
    hasRating: true,
    maxRating: 3,
    description: "Adds armor protection to limb",
  },
];

export const mockAccessoryCatalog: CyberwareCatalogItem[] = [
  {
    id: "cyberarm-gyromount",
    name: "Cyberarm Gyromount",
    category: "cyberlimb-accessory",
    essenceCost: 0,
    cost: 6500,
    availability: 8,
    capacity: 5,
    description: "Stabilizes weapon fire",
  },
  {
    id: "cyberarm-holster",
    name: "Cyberarm Holster",
    category: "cyberlimb-accessory",
    essenceCost: 0,
    cost: 2000,
    availability: 4,
    capacity: 2,
    description: "Internal weapon storage",
  },
  {
    id: "hydraulic-jacks",
    name: "Hydraulic Jacks",
    category: "cyberlimb-accessory",
    essenceCost: 0,
    cost: 2500,
    availability: 6,
    capacity: 2,
    hasRating: true,
    maxRating: 6,
    description: "Enhances jumping ability",
  },
];

export function createMockRuleset() {
  return {
    edition: { code: "sr5", name: "Shadowrun 5th Edition" },
    cyberware: {
      catalog: [...mockCyberlimbCatalog, ...mockEnhancementCatalog, ...mockAccessoryCatalog],
    },
  };
}

// =============================================================================
// MOCK REQUEST FACTORY
// =============================================================================

export function createMockRequest(
  method: string,
  urlPath: string,
  body?: Record<string, unknown>
): NextRequest {
  const url = `http://localhost:3000${urlPath}`;
  const request = new NextRequest(url, {
    method,
    ...(body && { body: JSON.stringify(body) }),
  });
  return request;
}
