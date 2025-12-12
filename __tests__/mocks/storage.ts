/**
 * Storage layer mocks for testing
 * 
 * Provides mock implementations of file-based storage operations
 * for testing without touching the actual file system.
 */

import { vi } from 'vitest';
import type { Character, User, EditionCode } from '@/lib/types';

/**
 * Mock file system storage
 */
export class MockFileStorage {
  private files: Map<string, any> = new Map();
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
    const dir = path.substring(0, path.lastIndexOf('/'));
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
    const prefix = dir.endsWith('/') ? dir : `${dir}/`;
    const files: string[] = [];
    
    for (const path of this.files.keys()) {
      if (path.startsWith(prefix)) {
        const relativePath = path.substring(prefix.length);
        // Remove .json extension
        files.push(relativePath.replace(/\.json$/, ''));
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
    id: 'test-user-id',
    email: 'test@example.com',
    passwordHash: 'mock-hash',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Helper to create mock character data
 */
export function createMockCharacter(overrides?: Partial<Character>): Character {
  return {
    id: 'test-character-id',
    userId: 'test-user-id',
    name: 'Test Character',
    editionCode: 'sr5',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

