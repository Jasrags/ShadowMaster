/**
 * Tests for user storage layer
 *
 * Tests user CRUD operations and validation.
 * Uses a temporary directory via USER_DATA_DIR env var for full isolation.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { UserRole } from "../../types/user";

let testDir: string;

// Dynamic imports so we can set USER_DATA_DIR before module evaluation
let getUserById: typeof import("../users").getUserById;
let getUserByEmail: typeof import("../users").getUserByEmail;
let getAllUsers: typeof import("../users").getAllUsers;
let createUser: typeof import("../users").createUser;
let updateUser: typeof import("../users").updateUser;
let deleteUser: typeof import("../users").deleteUser;
let suspendUser: typeof import("../users").suspendUser;
let reactivateUser: typeof import("../users").reactivateUser;
let updateUserRoles: typeof import("../users").updateUserRoles;
let countAdmins: typeof import("../users").countAdmins;
let isLastAdmin: typeof import("../users").isLastAdmin;

describe("User Storage", () => {
  beforeEach(async () => {
    // Create isolated temp directory for each test
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), "user-storage-test-"));
    process.env.USER_DATA_DIR = testDir;

    // Reset module cache so users.ts picks up the new env var
    vi.resetModules();
    const users = await import("../users");
    getUserById = users.getUserById;
    getUserByEmail = users.getUserByEmail;
    getAllUsers = users.getAllUsers;
    createUser = users.createUser;
    updateUser = users.updateUser;
    deleteUser = users.deleteUser;
    suspendUser = users.suspendUser;
    reactivateUser = users.reactivateUser;
    updateUserRoles = users.updateUserRoles;
    countAdmins = users.countAdmins;
    isLastAdmin = users.isLastAdmin;
  });

  afterEach(async () => {
    delete process.env.USER_DATA_DIR;
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const userData = {
        email: "test@example.com",
        passwordHash: "hashed-password",
        username: "Test User",
        role: ["user" as UserRole],
      };

      const user = await createUser(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.username).toBe("Test User");
      expect(user.passwordHash).toBe("hashed-password");
      expect(user.createdAt).toBeDefined();
      expect(user.lastLogin).toBeNull();
      expect(user.characters).toEqual([]);
    });

    it("should assign administrator role to first user", async () => {
      const user = await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["user" as UserRole],
      });

      // First user always gets administrator role
      expect(user.role).toContain("administrator");
    });

    it("should assign user role to subsequent users", async () => {
      // Create first user (admin)
      await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      // Create second user (regular user)
      const user = await createUser({
        email: "user@example.com",
        passwordHash: "hash",
        username: "User",
        role: ["user" as UserRole],
      });

      expect(user.role).toContain("user");
      expect(user.role).not.toContain("administrator");
    });

    it("should generate unique IDs", async () => {
      const user1 = await createUser({
        email: "user1@example.com",
        passwordHash: "hash",
        username: "User1",
        role: ["user" as UserRole],
      });

      const user2 = await createUser({
        email: "user2@example.com",
        passwordHash: "hash",
        username: "User2",
        role: ["user" as UserRole],
      });

      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe("getUserById", () => {
    it("should retrieve user by ID", async () => {
      const created = await createUser({
        email: "test@example.com",
        passwordHash: "hash",
        username: "Test",
        role: ["user" as UserRole],
      });

      const retrieved = await getUserById(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.email).toBe("test@example.com");
    });

    it("should return null for non-existent user", async () => {
      const result = await getUserById("nonexistent-id");
      expect(result).toBeNull();
    });

    it("should normalize role to array", async () => {
      const user = await createUser({
        email: "test@example.com",
        passwordHash: "hash",
        username: "Test",
        role: ["user" as UserRole],
      });

      const retrieved = await getUserById(user.id);
      expect(Array.isArray(retrieved?.role)).toBe(true);
    });
  });

  describe("getUserByEmail", () => {
    it("should retrieve user by email", async () => {
      await createUser({
        email: "test@example.com",
        passwordHash: "hash",
        username: "Test",
        role: ["user" as UserRole],
      });

      const retrieved = await getUserByEmail("test@example.com");

      expect(retrieved).toBeDefined();
      expect(retrieved?.email).toBe("test@example.com");
    });

    it("should be case-insensitive", async () => {
      await createUser({
        email: "Test@Example.com",
        passwordHash: "hash",
        username: "Test",
        role: ["user" as UserRole],
      });

      const retrieved = await getUserByEmail("test@example.com");
      expect(retrieved).toBeDefined();
    });

    it("should return null for non-existent email", async () => {
      const result = await getUserByEmail("nonexistent@example.com");
      expect(result).toBeNull();
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const user1 = await createUser({
        email: "user1@example.com",
        passwordHash: "hash",
        username: "User1",
        role: ["user" as UserRole],
      });

      const user2 = await createUser({
        email: "user2@example.com",
        passwordHash: "hash",
        username: "User2",
        role: ["user" as UserRole],
      });

      const users = await getAllUsers();

      // First user gets admin role, so there are 2 users total
      expect(users.length).toBe(2);
      expect(users.map((u) => u.email)).toContain(user1.email);
      expect(users.map((u) => u.email)).toContain(user2.email);
    });

    it("should return empty array when no users exist", async () => {
      const users = await getAllUsers();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(0);
    });

    it("should skip invalid JSON files", async () => {
      // Create a valid user
      await createUser({
        email: "valid@example.com",
        passwordHash: "hash",
        username: "Valid",
        role: ["user" as UserRole],
      });

      // Create an invalid JSON file manually in the test data dir
      const invalidPath = path.join(testDir, "invalid.json");
      await fs.writeFile(invalidPath, "invalid json", "utf-8");

      const users = await getAllUsers();
      expect(users.length).toBe(1);
      expect(users[0].email).toBe("valid@example.com");
    });
  });

  describe("updateUser", () => {
    it("should update user fields", async () => {
      const user = await createUser({
        email: "test@example.com",
        passwordHash: "hash",
        username: "Original",
        role: ["user" as UserRole],
      });

      const updated = await updateUser(user.id, {
        username: "Updated",
        email: "updated@example.com",
      });

      expect(updated.username).toBe("Updated");
      expect(updated.email).toBe("updated@example.com");
      expect(updated.id).toBe(user.id);
    });

    it("should preserve ID", async () => {
      const user = await createUser({
        email: "test@example.com",
        passwordHash: "hash",
        username: "Test",
        role: ["user" as UserRole],
      });

      const updated = await updateUser(user.id, {
        id: "new-id",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      expect(updated.id).toBe(user.id);
    });

    it("should throw error for non-existent user", async () => {
      await expect(updateUser("nonexistent-id", { username: "Test" })).rejects.toThrow("not found");
    });
  });

  describe("deleteUser", () => {
    it("should delete user", async () => {
      const user = await createUser({
        email: "test@example.com",
        passwordHash: "hash",
        username: "Test",
        role: ["user" as UserRole],
      });

      await deleteUser(user.id);

      const retrieved = await getUserById(user.id);
      expect(retrieved).toBeNull();
    });

    it("should throw error for non-existent user", async () => {
      await expect(deleteUser("nonexistent-id")).rejects.toThrow("not found");
    });

    it("should propagate error when deleteUserCharacters fails", async () => {
      const user = await createUser({
        email: "char-fail@example.com",
        passwordHash: "hash",
        username: "CharFail",
        role: ["user" as UserRole],
      });

      // Mock the characters module to make deleteUserCharacters throw
      vi.doMock("../characters", () => ({
        deleteUserCharacters: vi.fn().mockRejectedValue(new Error("disk failure")),
      }));

      await expect(deleteUser(user.id)).rejects.toThrow("disk failure");

      // User file should NOT have been deleted (no orphan)
      const stillExists = await getUserById(user.id);
      expect(stillExists).not.toBeNull();
    });
  });

  describe("atomic writes", () => {
    it("should write atomically (temp file then rename)", async () => {
      const user = await createUser({
        email: "test@example.com",
        passwordHash: "hash",
        username: "Test",
        role: ["user" as UserRole],
      });

      const updated = await updateUser(user.id, { username: "Updated" });

      expect(updated.username).toBe("Updated");
      const retrieved = await getUserById(user.id);
      expect(retrieved?.username).toBe("Updated");
    });
  });

  describe("suspendUser", () => {
    it("should suspend an active user", async () => {
      // Create admin first so test user isn't last admin
      await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      const user = await createUser({
        email: "suspend-test@example.com",
        passwordHash: "hash",
        username: "SuspendTest",
        role: ["user" as UserRole],
      });

      const suspended = await suspendUser(user.id, "admin-id", "Test suspension");

      expect(suspended.accountStatus).toBe("suspended");
      expect(suspended.statusReason).toBe("Test suspension");
      expect(suspended.statusChangedBy).toBe("admin-id");
      expect(suspended.statusChangedAt).toBeDefined();
    });

    it("should increment sessionVersion on suspension", async () => {
      // Create admin first so test user isn't last admin
      await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      const user = await createUser({
        email: "session-test@example.com",
        passwordHash: "hash",
        username: "SessionTest",
        role: ["user" as UserRole],
      });

      const originalVersion = user.sessionVersion;
      const suspended = await suspendUser(user.id, "admin-id", "Session test");

      expect(suspended.sessionVersion).toBe(originalVersion + 1);
    });

    it("should throw error for non-existent user", async () => {
      await expect(suspendUser("nonexistent-id", "admin-id", "Test")).rejects.toThrow("not found");
    });
  });

  describe("reactivateUser", () => {
    it("should reactivate a suspended user", async () => {
      // Create admin first so test user isn't last admin
      await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      const user = await createUser({
        email: "reactivate-test@example.com",
        passwordHash: "hash",
        username: "ReactivateTest",
        role: ["user" as UserRole],
      });

      await suspendUser(user.id, "admin-id", "Testing");
      const reactivated = await reactivateUser(user.id, "admin-id");

      expect(reactivated.accountStatus).toBe("active");
      expect(reactivated.statusReason).toBeNull();
      expect(reactivated.statusChangedBy).toBe("admin-id");
    });

    it("should throw error for non-existent user", async () => {
      await expect(reactivateUser("nonexistent-id", "admin-id")).rejects.toThrow("not found");
    });
  });

  describe("updateUserRoles", () => {
    it("should update user roles", async () => {
      // Create admin first so test user isn't last admin
      await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      const user = await createUser({
        email: "role-test@example.com",
        passwordHash: "hash",
        username: "RoleTest",
        role: ["user" as UserRole],
      });

      const updated = await updateUserRoles(user.id, ["user", "gamemaster"], "admin-id");

      expect(updated.role).toContain("user");
      expect(updated.role).toContain("gamemaster");
      expect(updated.lastRoleChangeBy).toBe("admin-id");
      expect(updated.lastRoleChangeAt).toBeDefined();
    });

    it("should increment sessionVersion on role demotion", async () => {
      // Create admin first so test user isn't last admin
      await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      const user = await createUser({
        email: "demotion-test@example.com",
        passwordHash: "hash",
        username: "DemotionTest",
        role: ["user" as UserRole],
      });

      // First promote
      const promoted = await updateUserRoles(user.id, ["user", "gamemaster"], "admin-id");
      const versionAfterPromotion = promoted.sessionVersion;

      // Then demote
      const demoted = await updateUserRoles(user.id, ["user"], "admin-id");

      expect(demoted.sessionVersion).toBe(versionAfterPromotion + 1);
    });

    it("should reject empty role array", async () => {
      const user = await createUser({
        email: "empty-role-test@example.com",
        passwordHash: "hash",
        username: "EmptyRoleTest",
        role: ["user" as UserRole],
      });

      await expect(updateUserRoles(user.id, [], "admin-id")).rejects.toThrow();
    });
  });

  describe("countAdmins", () => {
    it("should count administrators", async () => {
      // Empty directory — no admins
      const count = await countAdmins();
      expect(count).toBe(0);
    });

    it("should count after creating admin", async () => {
      // First user gets administrator role
      await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      const count = await countAdmins();
      expect(count).toBe(1);
    });
  });

  describe("isLastAdmin", () => {
    it("should return true for the only admin", async () => {
      const admin = await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      // First user gets admin role automatically
      const result = await isLastAdmin(admin.id);
      expect(result).toBe(true);
    });

    it("should return false for non-admin", async () => {
      // Create first user (admin)
      await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      // Create second user (regular user)
      const user = await createUser({
        email: "user@example.com",
        passwordHash: "hash",
        username: "User",
        role: ["user" as UserRole],
      });

      const result = await isLastAdmin(user.id);
      expect(result).toBe(false);
    });
  });

  describe("last-admin protection", () => {
    it("should prevent suspending the last administrator", async () => {
      // First user automatically gets admin role
      const admin = await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      await expect(suspendUser(admin.id, "some-other-admin", "Test")).rejects.toThrow(
        /last administrator/i
      );
    });

    it("should prevent demoting the last administrator", async () => {
      const admin = await createUser({
        email: "admin@example.com",
        passwordHash: "hash",
        username: "Admin",
        role: ["administrator" as UserRole],
      });

      await expect(updateUserRoles(admin.id, ["user"], "some-other-admin")).rejects.toThrow(
        /last administrator/i
      );
    });
  });
});
