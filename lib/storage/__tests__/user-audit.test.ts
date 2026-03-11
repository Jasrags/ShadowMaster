/**
 * Tests for user audit log storage layer
 *
 * Tests user governance audit logging functionality with isolated temp directories.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import type { UserAuditAction } from "@/lib/types/audit";

let testDir: string;

// Dynamic imports so we can set USER_AUDIT_DATA_DIR before module evaluation
let createUserAuditEntry: typeof import("../user-audit").createUserAuditEntry;
let getUserAuditLog: typeof import("../user-audit").getUserAuditLog;
let getAllUserAuditEntries: typeof import("../user-audit").getAllUserAuditEntries;
let archiveUserAuditLog: typeof import("../user-audit").archiveUserAuditLog;
let deleteUserAuditLog: typeof import("../user-audit").deleteUserAuditLog;

describe("User Audit Storage", () => {
  const testUserId = "test-user-audit";
  const testActorId = "test-actor-audit";

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), "user-audit-storage-test-"));
    process.env.USER_AUDIT_DATA_DIR = testDir;

    vi.resetModules();
    const mod = await import("../user-audit");
    createUserAuditEntry = mod.createUserAuditEntry;
    getUserAuditLog = mod.getUserAuditLog;
    getAllUserAuditEntries = mod.getAllUserAuditEntries;
    archiveUserAuditLog = mod.archiveUserAuditLog;
    deleteUserAuditLog = mod.deleteUserAuditLog;
  });

  afterEach(async () => {
    delete process.env.USER_AUDIT_DATA_DIR;
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("createUserAuditEntry", () => {
    it("should create an audit entry with correct timestamp and actor", async () => {
      const entry = await createUserAuditEntry({
        action: "user_created",
        actor: { userId: testActorId, role: "admin" },
        targetUserId: testUserId,
        details: {},
      });

      expect(entry.id).toBeDefined();
      expect(entry.timestamp).toBeDefined();
      expect(new Date(entry.timestamp).getTime()).toBeLessThanOrEqual(Date.now());
      expect(entry.actor.userId).toBe(testActorId);
      expect(entry.actor.role).toBe("admin");
      expect(entry.action).toBe("user_created");
      expect(entry.targetUserId).toBe(testUserId);
    });

    it("should store previous and new values in details", async () => {
      const entry = await createUserAuditEntry({
        action: "user_role_granted",
        actor: { userId: testActorId, role: "admin" },
        targetUserId: testUserId,
        details: {
          previousValue: ["user"],
          newValue: ["user", "gamemaster"],
        },
      });

      expect(entry.details.previousValue).toEqual(["user"]);
      expect(entry.details.newValue).toEqual(["user", "gamemaster"]);
    });

    it("should store reason for suspension/reactivation", async () => {
      const entry = await createUserAuditEntry({
        action: "user_suspended",
        actor: { userId: testActorId, role: "admin" },
        targetUserId: testUserId,
        details: {
          reason: "Violation of terms of service",
        },
      });

      expect(entry.details.reason).toBe("Violation of terms of service");
    });
  });

  describe("getUserAuditLog", () => {
    beforeEach(async () => {
      // Create test entries
      await createUserAuditEntry({
        action: "user_created",
        actor: { userId: testActorId, role: "system" },
        targetUserId: testUserId,
        details: {},
      });

      // Small delay to ensure different timestamps
      await new Promise((r) => setTimeout(r, 10));

      await createUserAuditEntry({
        action: "user_role_granted",
        actor: { userId: testActorId, role: "admin" },
        targetUserId: testUserId,
        details: { newValue: ["user", "gamemaster"] },
      });

      await new Promise((r) => setTimeout(r, 10));

      await createUserAuditEntry({
        action: "user_suspended",
        actor: { userId: testActorId, role: "admin" },
        targetUserId: testUserId,
        details: { reason: "Testing" },
      });
    });

    it("should return entries in descending order by default", async () => {
      const { entries } = await getUserAuditLog(testUserId);

      expect(entries.length).toBe(3);
      expect(entries[0].action).toBe("user_suspended");
      expect(entries[2].action).toBe("user_created");

      // Verify chronological order (most recent first)
      for (let i = 0; i < entries.length - 1; i++) {
        expect(new Date(entries[i].timestamp).getTime()).toBeGreaterThanOrEqual(
          new Date(entries[i + 1].timestamp).getTime()
        );
      }
    });

    it("should return entries in ascending order when specified", async () => {
      const { entries } = await getUserAuditLog(testUserId, { order: "asc" });

      expect(entries[0].action).toBe("user_created");
      expect(entries[entries.length - 1].action).toBe("user_suspended");
    });

    it("should respect pagination limits", async () => {
      const { entries, total } = await getUserAuditLog(testUserId, { limit: 2 });

      expect(entries.length).toBe(2);
      expect(total).toBe(3);
    });

    it("should respect pagination offset", async () => {
      const { entries, total } = await getUserAuditLog(testUserId, { limit: 2, offset: 1 });

      expect(entries.length).toBe(2);
      expect(total).toBe(3);
      // First entry should be the second one (offset 1)
      expect(entries[0].action).toBe("user_role_granted");
    });

    it("should return empty array for user with no audit log", async () => {
      const { entries, total } = await getUserAuditLog("nonexistent-user");

      expect(entries).toEqual([]);
      expect(total).toBe(0);
    });
  });

  describe("getAllUserAuditEntries", () => {
    const anotherUserId = "another-user-audit";

    beforeEach(async () => {
      // Create entries for multiple users
      await createUserAuditEntry({
        action: "user_created",
        actor: { userId: testActorId, role: "system" },
        targetUserId: testUserId,
        details: {},
      });

      await createUserAuditEntry({
        action: "user_created",
        actor: { userId: testActorId, role: "system" },
        targetUserId: anotherUserId,
        details: {},
      });

      await createUserAuditEntry({
        action: "user_suspended",
        actor: { userId: testActorId, role: "admin" },
        targetUserId: testUserId,
        details: { reason: "Test" },
      });
    });

    it("should return entries from all users", async () => {
      const { entries, total } = await getAllUserAuditEntries();

      expect(total).toBe(3);

      const userIds = new Set(entries.map((e) => e.targetUserId));
      expect(userIds.has(testUserId)).toBe(true);
      expect(userIds.has(anotherUserId)).toBe(true);
    });

    it("should filter by action type", async () => {
      const { entries } = await getAllUserAuditEntries({ actions: ["user_suspended"] });

      expect(entries.length).toBe(1);
      expect(entries.every((e) => e.action === "user_suspended")).toBe(true);
    });

    it("should filter by target user ID", async () => {
      const { entries } = await getAllUserAuditEntries({ targetUserId: testUserId });

      expect(entries.length).toBe(2);
      expect(entries.every((e) => e.targetUserId === testUserId)).toBe(true);
    });

    it("should filter by actor ID", async () => {
      const { entries } = await getAllUserAuditEntries({ actorId: testActorId });

      expect(entries.length).toBe(3);
      expect(entries.every((e) => e.actor.userId === testActorId)).toBe(true);
    });
  });

  describe("archiveUserAuditLog", () => {
    beforeEach(async () => {
      await createUserAuditEntry({
        action: "user_created",
        actor: { userId: testActorId, role: "system" },
        targetUserId: testUserId,
        details: {},
      });
    });

    it("should archive audit log and remove active entries", async () => {
      // Verify entries exist before archiving
      const { entries: beforeEntries } = await getUserAuditLog(testUserId);
      expect(beforeEntries.length).toBeGreaterThan(0);

      // Archive the audit log
      await archiveUserAuditLog(testUserId, testActorId, {
        email: "test@example.com",
        username: "testuser",
      });

      // Verify active log is now empty (entries moved to archive)
      const { entries: afterEntries, total } = await getUserAuditLog(testUserId);
      expect(afterEntries).toHaveLength(0);
      expect(total).toBe(0);
    });
  });
});
