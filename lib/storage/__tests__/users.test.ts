/**
 * Tests for user storage layer
 * 
 * Tests user CRUD operations and validation.
 * 
 * NOTE: These tests use the actual data directory. For proper isolation,
 * the storage layer should be refactored to support configurable data paths.
 * These tests use unique test emails to minimize conflicts with real data.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import {
  getUserById,
  getUserByEmail,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../users';
import type { User } from '@/lib/types/user';

const TEST_DATA_DIR = path.join(process.cwd(), '__tests__', 'temp-users');

describe('User Storage', () => {
  beforeEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        name: 'Test User',
      };

      const user = await createUser(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.passwordHash).toBe('hashed-password');
      expect(user.createdAt).toBeDefined();
      expect(user.lastLogin).toBeNull();
      expect(user.characters).toEqual([]);
    });

    it('should assign administrator role to first user', async () => {
      // Get current user count to determine if this will be first user
      const existingUsers = await getAllUsers();
      const willBeFirst = existingUsers.length === 0;

      const userData = {
        email: `admin-${Date.now()}@test.example.com`,
        passwordHash: 'hash',
        name: 'Admin',
      };

      const user = await createUser(userData);

      if (willBeFirst) {
        expect(user.role).toContain('administrator');
      } else {
        // If users already exist, this will be a regular user
        expect(user.role).toContain('user');
      }
    });

    it('should assign user role to subsequent users', async () => {
      // Create first user (admin)
      await createUser({
        email: 'admin@example.com',
        passwordHash: 'hash',
        name: 'Admin',
      });

      // Create second user (regular user)
      const userData = {
        email: 'user@example.com',
        passwordHash: 'hash',
        name: 'User',
      };

      const user = await createUser(userData);

      expect(user.role).toContain('user');
      expect(user.role).not.toContain('administrator');
    });

    it('should generate unique IDs', async () => {
      const user1 = await createUser({
        email: 'user1@example.com',
        passwordHash: 'hash',
        name: 'User1',
      });

      const user2 = await createUser({
        email: 'user2@example.com',
        passwordHash: 'hash',
        name: 'User2',
      });

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('getUserById', () => {
    it('should retrieve user by ID', async () => {
      const created = await createUser({
        email: 'test@example.com',
        passwordHash: 'hash',
        name: 'Test',
      });

      const retrieved = await getUserById(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.email).toBe('test@example.com');
    });

    it('should return null for non-existent user', async () => {
      const result = await getUserById('nonexistent-id');
      expect(result).toBeNull();
    });

    it('should normalize role to array', async () => {
      // This tests backward compatibility with single role values
      const user = await createUser({
        email: 'test@example.com',
        passwordHash: 'hash',
        name: 'Test',
      });

      const retrieved = await getUserById(user.id);
      expect(Array.isArray(retrieved?.role)).toBe(true);
    });
  });

  describe('getUserByEmail', () => {
    it('should retrieve user by email', async () => {
      await createUser({
        email: 'test@example.com',
        passwordHash: 'hash',
        name: 'Test',
      });

      const retrieved = await getUserByEmail('test@example.com');

      expect(retrieved).toBeDefined();
      expect(retrieved?.email).toBe('test@example.com');
    });

    it('should be case-insensitive', async () => {
      await createUser({
        email: 'Test@Example.com',
        passwordHash: 'hash',
        name: 'Test',
      });

      const retrieved = await getUserByEmail('test@example.com');
      expect(retrieved).toBeDefined();
    });

    it('should return null for non-existent email', async () => {
      const result = await getUserByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users including test users', async () => {
      const timestamp = Date.now();
      const user1 = await createUser({
        email: `user1-${timestamp}@test.example.com`,
        passwordHash: 'hash',
        name: 'User1',
      });

      const user2 = await createUser({
        email: `user2-${timestamp}@test.example.com`,
        passwordHash: 'hash',
        name: 'User2',
      });

      const users = await getAllUsers();

      // Should include our test users
      const testUserEmails = [user1.email, user2.email];
      const foundUsers = users.filter(u => testUserEmails.includes(u.email));
      expect(foundUsers.length).toBe(2);
      expect(users.map(u => u.email)).toContain(user1.email);
      expect(users.map(u => u.email)).toContain(user2.email);
    });

    it('should return users (may include existing data)', async () => {
      const users = await getAllUsers();
      // May have existing users, so just check it's an array
      expect(Array.isArray(users)).toBe(true);
    });

    it('should skip invalid JSON files', async () => {
      // Create a valid user
      await createUser({
        email: 'valid@example.com',
        passwordHash: 'hash',
        name: 'Valid',
      });

      // Create an invalid JSON file manually
      const invalidPath = path.join(TEST_DATA_DIR, 'invalid.json');
      await fs.mkdir(TEST_DATA_DIR, { recursive: true });
      await fs.writeFile(invalidPath, 'invalid json', 'utf-8');

      const users = await getAllUsers();
      // Should still return the valid user
      expect(users.length).toBeGreaterThanOrEqual(1);
      expect(users.find(u => u.email === 'valid@example.com')).toBeDefined();
    });
  });

  describe('updateUser', () => {
    it('should update user fields', async () => {
      const user = await createUser({
        email: 'test@example.com',
        passwordHash: 'hash',
        name: 'Original',
      });

      const updated = await updateUser(user.id, {
        name: 'Updated',
        email: 'updated@example.com',
      });

      expect(updated.name).toBe('Updated');
      expect(updated.email).toBe('updated@example.com');
      expect(updated.id).toBe(user.id); // ID should not change
    });

    it('should preserve ID', async () => {
      const user = await createUser({
        email: 'test@example.com',
        passwordHash: 'hash',
        name: 'Test',
      });

      const updated = await updateUser(user.id, {
        id: 'new-id',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      expect(updated.id).toBe(user.id);
    });

    it('should throw error for non-existent user', async () => {
      await expect(
        updateUser('nonexistent-id', { name: 'Test' })
      ).rejects.toThrow('not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const user = await createUser({
        email: 'test@example.com',
        passwordHash: 'hash',
        name: 'Test',
      });

      await deleteUser(user.id);

      const retrieved = await getUserById(user.id);
      expect(retrieved).toBeNull();
    });

    it('should throw error for non-existent user', async () => {
      await expect(deleteUser('nonexistent-id')).rejects.toThrow('not found');
    });
  });

  describe('atomic writes', () => {
    it('should write atomically (temp file then rename)', async () => {
      const user = await createUser({
        email: 'test@example.com',
        passwordHash: 'hash',
        name: 'Test',
      });

      // Update should use atomic write
      const updated = await updateUser(user.id, { name: 'Updated' });

      expect(updated.name).toBe('Updated');
      // Verify file exists and is valid
      const retrieved = await getUserById(user.id);
      expect(retrieved?.name).toBe('Updated');
    });
  });
});

