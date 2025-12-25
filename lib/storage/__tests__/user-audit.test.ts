/**
 * Tests for user audit log storage layer
 *
 * Tests user governance audit logging functionality.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import {
  createUserAuditEntry,
  getUserAuditLog,
  getAllUserAuditEntries,
  archiveUserAuditLog,
  deleteUserAuditLog,
} from '../user-audit';
import type { UserAuditAction } from '@/lib/types/audit';

const TEST_AUDIT_DIR = path.join(process.cwd(), 'data', 'audit', 'users');

describe('User Audit Storage', () => {
  const testUserId = `test-user-${Date.now()}`;
  const testActorId = `test-actor-${Date.now()}`;

  afterEach(async () => {
    // Clean up test audit files
    try {
      await deleteUserAuditLog(testUserId);
    } catch {
      // Ignore cleanup errors
    }
  });

  describe('createUserAuditEntry', () => {
    it('should create an audit entry with correct timestamp and actor', async () => {
      const entry = await createUserAuditEntry({
        action: 'user_created',
        actor: { userId: testActorId, role: 'admin' },
        targetUserId: testUserId,
        details: {},
      });

      expect(entry.id).toBeDefined();
      expect(entry.timestamp).toBeDefined();
      expect(new Date(entry.timestamp).getTime()).toBeLessThanOrEqual(Date.now());
      expect(entry.actor.userId).toBe(testActorId);
      expect(entry.actor.role).toBe('admin');
      expect(entry.action).toBe('user_created');
      expect(entry.targetUserId).toBe(testUserId);
    });

    it('should store previous and new values in details', async () => {
      const entry = await createUserAuditEntry({
        action: 'user_role_granted',
        actor: { userId: testActorId, role: 'admin' },
        targetUserId: testUserId,
        details: {
          previousValue: ['user'],
          newValue: ['user', 'gamemaster'],
        },
      });

      expect(entry.details.previousValue).toEqual(['user']);
      expect(entry.details.newValue).toEqual(['user', 'gamemaster']);
    });

    it('should store reason for suspension/reactivation', async () => {
      const entry = await createUserAuditEntry({
        action: 'user_suspended',
        actor: { userId: testActorId, role: 'admin' },
        targetUserId: testUserId,
        details: {
          reason: 'Violation of terms of service',
        },
      });

      expect(entry.details.reason).toBe('Violation of terms of service');
    });
  });

  describe('getUserAuditLog', () => {
    beforeEach(async () => {
      // Create test entries
      await createUserAuditEntry({
        action: 'user_created',
        actor: { userId: testActorId, role: 'system' },
        targetUserId: testUserId,
        details: {},
      });

      // Small delay to ensure different timestamps
      await new Promise(r => setTimeout(r, 10));

      await createUserAuditEntry({
        action: 'user_role_granted',
        actor: { userId: testActorId, role: 'admin' },
        targetUserId: testUserId,
        details: { newValue: ['user', 'gamemaster'] },
      });

      await new Promise(r => setTimeout(r, 10));

      await createUserAuditEntry({
        action: 'user_suspended',
        actor: { userId: testActorId, role: 'admin' },
        targetUserId: testUserId,
        details: { reason: 'Testing' },
      });
    });

    it('should return entries in descending order by default', async () => {
      const { entries } = await getUserAuditLog(testUserId);

      expect(entries.length).toBe(3);
      expect(entries[0].action).toBe('user_suspended');
      expect(entries[2].action).toBe('user_created');

      // Verify chronological order (most recent first)
      for (let i = 0; i < entries.length - 1; i++) {
        expect(new Date(entries[i].timestamp).getTime())
          .toBeGreaterThanOrEqual(new Date(entries[i + 1].timestamp).getTime());
      }
    });

    it('should return entries in ascending order when specified', async () => {
      const { entries } = await getUserAuditLog(testUserId, { order: 'asc' });

      expect(entries[0].action).toBe('user_created');
      expect(entries[entries.length - 1].action).toBe('user_suspended');
    });

    it('should respect pagination limits', async () => {
      const { entries, total } = await getUserAuditLog(testUserId, { limit: 2 });

      expect(entries.length).toBe(2);
      expect(total).toBe(3);
    });

    it('should respect pagination offset', async () => {
      const { entries, total } = await getUserAuditLog(testUserId, { limit: 2, offset: 1 });

      expect(entries.length).toBe(2);
      expect(total).toBe(3);
      // First entry should be the second one (offset 1)
      expect(entries[0].action).toBe('user_role_granted');
    });

    it('should return empty array for user with no audit log', async () => {
      const { entries, total } = await getUserAuditLog('nonexistent-user');

      expect(entries).toEqual([]);
      expect(total).toBe(0);
    });
  });

  describe('getAllUserAuditEntries', () => {
    const anotherUserId = `another-user-${Date.now()}`;

    beforeEach(async () => {
      // Create entries for multiple users
      await createUserAuditEntry({
        action: 'user_created',
        actor: { userId: testActorId, role: 'system' },
        targetUserId: testUserId,
        details: {},
      });

      await createUserAuditEntry({
        action: 'user_created',
        actor: { userId: testActorId, role: 'system' },
        targetUserId: anotherUserId,
        details: {},
      });

      await createUserAuditEntry({
        action: 'user_suspended',
        actor: { userId: testActorId, role: 'admin' },
        targetUserId: testUserId,
        details: { reason: 'Test' },
      });
    });

    afterEach(async () => {
      try {
        await deleteUserAuditLog(anotherUserId);
      } catch {
        // Ignore cleanup errors
      }
    });

    it('should return entries from all users', async () => {
      const { entries, total } = await getAllUserAuditEntries();

      // Should have entries from both test users (at minimum)
      expect(total).toBeGreaterThanOrEqual(3);

      const userIds = new Set(entries.map(e => e.targetUserId));
      expect(userIds.has(testUserId)).toBe(true);
      expect(userIds.has(anotherUserId)).toBe(true);
    });

    it('should filter by action type', async () => {
      const { entries } = await getAllUserAuditEntries({ actions: ['user_suspended'] });

      expect(entries.length).toBeGreaterThanOrEqual(1);
      expect(entries.every(e => e.action === 'user_suspended')).toBe(true);
    });

    it('should filter by target user ID', async () => {
      const { entries } = await getAllUserAuditEntries({ targetUserId: testUserId });

      expect(entries.length).toBeGreaterThanOrEqual(2);
      expect(entries.every(e => e.targetUserId === testUserId)).toBe(true);
    });

    it('should filter by actor ID', async () => {
      const { entries } = await getAllUserAuditEntries({ actorId: testActorId });

      expect(entries.length).toBeGreaterThanOrEqual(3);
      expect(entries.every(e => e.actor.userId === testActorId)).toBe(true);
    });
  });

  describe('archiveUserAuditLog', () => {
    beforeEach(async () => {
      await createUserAuditEntry({
        action: 'user_created',
        actor: { userId: testActorId, role: 'system' },
        targetUserId: testUserId,
        details: {},
      });
    });

    it('should archive audit log and remove active entries', async () => {
      // Verify entries exist before archiving
      const { entries: beforeEntries } = await getUserAuditLog(testUserId);
      expect(beforeEntries.length).toBeGreaterThan(0);

      // Archive the audit log
      await archiveUserAuditLog(testUserId, testActorId, {
        email: 'test@example.com',
        username: 'testuser',
      });

      // Verify active log is now empty (entries moved to archive)
      const { entries: afterEntries, total } = await getUserAuditLog(testUserId);
      expect(afterEntries).toHaveLength(0);
      expect(total).toBe(0);
    });
  });
});
