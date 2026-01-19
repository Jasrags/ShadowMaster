/**
 * Shared test utilities for qualities API route tests
 *
 * Provides factories for creating mock data consistent across all quality route tests.
 */

import { NextRequest } from "next/server";
import type { Character, User, Quality, MergedRuleset, AdvancementRecord } from "@/lib/types";

// =============================================================================
// Test Constants
// =============================================================================

export const TEST_USER_ID = "test-user-123";
export const TEST_CHARACTER_ID = "test-char-456";
export const TEST_QUALITY_ID = "test-quality-789";

// =============================================================================
// Request Factories
// =============================================================================

/**
 * Create a mock NextRequest for testing
 */
export function createMockRequest(url: string, body?: unknown, method = "POST"): NextRequest {
  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { "Content-Type": "application/json" } : undefined,
  });

  // Mock json() method for easier testing
  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

/**
 * Create a POST request for acquiring a quality
 */
export function createAcquireQualityRequest(
  characterId: string,
  body: {
    qualityId: string;
    rating?: number;
    specification?: string;
    notes?: string;
    gmApproved?: boolean;
  }
): NextRequest {
  return createMockRequest(
    `http://localhost/api/characters/${characterId}/qualities`,
    body,
    "POST"
  );
}

/**
 * Create a DELETE request for buying off a quality
 */
export function createRemoveQualityRequest(
  characterId: string,
  qualityId: string,
  body?: { reason?: string }
): NextRequest {
  return createMockRequest(
    `http://localhost/api/characters/${characterId}/qualities/${qualityId}`,
    body || {},
    "DELETE"
  );
}

/**
 * Create a PATCH request for updating quality state
 */
export function createUpdateStateRequest(
  characterId: string,
  qualityId: string,
  updates: Record<string, unknown>
): NextRequest {
  return createMockRequest(
    `http://localhost/api/characters/${characterId}/qualities/${qualityId}/state`,
    updates,
    "PATCH"
  );
}

// =============================================================================
// Mock Data Factories
// =============================================================================

/**
 * Create a mock user
 */
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: TEST_USER_ID,
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
    ...overrides,
  };
}

/**
 * Create a mock character with qualities
 */
export function createMockCharacter(overrides?: Partial<Character>): Character {
  return {
    id: TEST_CHARACTER_ID,
    ownerId: TEST_USER_ID,
    editionId: "sr5",
    editionCode: "sr5",
    creationMethodId: "priority",
    rulesetSnapshotId: "test-snapshot-id",
    attachedBookIds: ["core-rulebook"],
    name: "Test Character",
    metatype: "Human",
    status: "active",
    attributes: {
      body: 3,
      agility: 4,
      reaction: 3,
      strength: 3,
      willpower: 4,
      logic: 3,
      intuition: 3,
      charisma: 3,
    },
    specialAttributes: {
      edge: 3,
      essence: 6,
    },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 5000,
    startingNuyen: 5000,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
    },
    karmaTotal: 50,
    karmaCurrent: 25,
    karmaSpentAtCreation: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a mock positive quality definition
 */
export function createMockPositiveQuality(overrides?: Partial<Quality>): Quality {
  return {
    id: "quick-healer",
    name: "Quick Healer",
    type: "positive",
    karmaCost: 3,
    summary: "Heal faster from injuries",
    description: "You heal faster than normal.",
    tags: ["physical", "healing"],
    ...overrides,
  };
}

/**
 * Create a mock negative quality definition
 */
export function createMockNegativeQuality(overrides?: Partial<Quality>): Quality {
  return {
    id: "addiction",
    name: "Addiction",
    type: "negative",
    karmaBonus: 4,
    summary: "Addicted to a substance",
    description: "You are addicted to a substance.",
    hasRating: true,
    minRating: 1,
    maxRating: 3,
    dynamicState: "addiction",
    requiresSpecification: true,
    specificationLabel: "Substance",
    tags: ["social", "psychological"],
    ...overrides,
  };
}

/**
 * Create a mock ruleset with qualities catalog
 */
export function createMockRuleset(overrides?: Partial<MergedRuleset>): MergedRuleset {
  const defaultRuleset: MergedRuleset = {
    snapshotId: "test-snapshot-id",
    editionId: "sr5",
    editionCode: "sr5",
    bookIds: ["core-rulebook"],
    modules: {
      metatypes: {
        metatypes: [
          {
            id: "human",
            name: "Human",
            attributes: {
              body: { min: 1, max: 6 },
              agility: { min: 1, max: 6 },
              reaction: { min: 1, max: 6 },
              strength: { min: 1, max: 6 },
              willpower: { min: 1, max: 6 },
              logic: { min: 1, max: 6 },
              intuition: { min: 1, max: 6 },
              charisma: { min: 1, max: 6 },
              edge: { min: 2, max: 7 },
              essence: { base: 6 },
            },
            racialTraits: [],
          },
        ],
      } as unknown as Record<string, unknown>,
      qualities: {
        positive: [
          createMockPositiveQuality(),
          createMockPositiveQuality({
            id: "ambidextrous",
            name: "Ambidextrous",
            karmaCost: 4,
            summary: "Use either hand equally well",
          }),
          createMockPositiveQuality({
            id: "catlike",
            name: "Catlike",
            karmaCost: 7,
            summary: "+2 to Balance tests",
          }),
        ],
        negative: [
          createMockNegativeQuality(),
          createMockNegativeQuality({
            id: "bad-luck",
            name: "Bad Luck",
            karmaBonus: 12,
            summary: "Edge costs double for you",
          }),
          createMockNegativeQuality({
            id: "gremlins",
            name: "Gremlins",
            karmaBonus: 4,
            hasRating: true,
            minRating: 1,
            maxRating: 4,
            summary: "Electronics malfunction around you",
          }),
        ],
      } as unknown as Record<string, unknown>,
    },
    createdAt: new Date().toISOString(),
  };

  if (overrides) {
    return {
      ...defaultRuleset,
      ...overrides,
      modules: {
        ...defaultRuleset.modules,
        ...overrides.modules,
      },
    };
  }

  return defaultRuleset;
}

/**
 * Create a mock advancement record for quality acquisition
 */
export function createMockAdvancementRecord(
  overrides?: Partial<AdvancementRecord>
): AdvancementRecord {
  const now = new Date().toISOString();
  return {
    id: "adv-record-123",
    type: "quality",
    targetId: "quick-healer",
    targetName: "Quick Healer",
    newValue: 1,
    karmaCost: 6, // 2× the 3 karma cost
    karmaSpentAt: now,
    trainingRequired: false,
    trainingStatus: "completed",
    gmApproved: false,
    createdAt: now,
    completedAt: now,
    ...overrides,
  };
}
