/**
 * Storage layer mocks for testing
 *
 * Provides mock implementations of file-based storage operations
 * for testing without touching the actual file system.
 */

import type { Character, User, Campaign } from "@/lib/types";

/**
 * Mock file system storage
 */
export class MockFileStorage {
  private files: Map<string, unknown> = new Map();
  private directories: Set<string> = new Set();

  /**
   * Read a file (returns stored data or null)
   */
  async readFile<T>(path: string): Promise<T | null> {
    return (this.files.get(path) as T) || null;
  }

  /**
   * Write a file
   */
  async writeFile<T>(path: string, data: T): Promise<void> {
    this.files.set(path, data);
    // Ensure parent directory exists
    const dir = path.substring(0, path.lastIndexOf("/"));
    if (dir) {
      this.directories.add(dir);
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(path: string): Promise<boolean> {
    const existed = this.files.has(path);
    this.files.delete(path);
    return existed;
  }

  /**
   * List files in a directory
   */
  async listFiles(dir: string): Promise<string[]> {
    const prefix = dir.endsWith("/") ? dir : `${dir}/`;
    const files: string[] = [];

    for (const path of this.files.keys()) {
      if (path.startsWith(prefix)) {
        const relativePath = path.substring(prefix.length);
        // Remove .json extension
        files.push(relativePath.replace(/\.json$/, ""));
      }
    }

    return files;
  }

  /**
   * Check if directory exists
   */
  directoryExists(dir: string): boolean {
    return this.directories.has(dir);
  }

  /**
   * Clear all stored data
   */
  clear(): void {
    this.files.clear();
    this.directories.clear();
  }
}

/**
 * Create mock storage with test data
 */
export function createMockStorage() {
  const storage = new MockFileStorage();
  return storage;
}

/**
 * Helper to create mock user data
 */
export function createMockUser(overrides?: Partial<User>): User {
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
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
    // Governance fields
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    // Email verification fields
    emailVerified: true,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    emailVerificationTokenPrefix: null,
    // Password reset fields
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    passwordResetTokenPrefix: null,
    // Magic link fields
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
    magicLinkTokenPrefix: null,
    ...overrides,
  };
}

/**
 * Helper to create mock character data
 */
export function createMockCharacter(overrides?: Partial<Character>): Character {
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
    status: "draft",
    attributes: {},
    specialAttributes: {
      edge: 1,
      essence: 6,
    },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 0,
    startingNuyen: 0,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
    },
    karmaTotal: 0,
    karmaCurrent: 0,
    karmaSpentAtCreation: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Helper to create mock campaign data
 */
export function createMockCampaign(overrides?: Partial<Campaign>): Campaign {
  return {
    id: "test-campaign-id",
    gmId: "test-gm-id",
    title: "Test Campaign",
    status: "active",
    editionId: "test-edition-id",
    editionCode: "sr5",
    enabledBookIds: ["sr5-core"],
    enabledCreationMethodIds: ["priority"],
    gameplayLevel: "experienced",
    playerIds: [],
    visibility: "private",
    advancementSettings: {
      trainingTimeMultiplier: 1.0,
      attributeKarmaMultiplier: 5,
      skillKarmaMultiplier: 2,
      skillGroupKarmaMultiplier: 5,
      knowledgeSkillKarmaMultiplier: 1,
      specializationKarmaCost: 7,
      spellKarmaCost: 5,
      complexFormKarmaCost: 4,
      attributeRatingCap: 10,
      skillRatingCap: 13,
      allowInstantAdvancement: false,
      requireApproval: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}
