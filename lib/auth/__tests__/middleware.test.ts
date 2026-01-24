import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { toPublicUser, getCurrentUser, requireAuth, isAdmin, requireAdmin } from "../middleware";
import { getSession } from "../session";
import { getUserById } from "../../storage/users";
import type { User, PublicUser } from "../../types/user";

vi.mock("../session", () => ({
  getSession: vi.fn(),
}));

vi.mock("../../storage/users", () => ({
  getUserById: vi.fn(),
}));

const mockGetSession = getSession as Mock;
const mockGetUserById = getUserById as Mock;

describe("middleware", () => {
  const mockUser: User = {
    id: "user-123",
    email: "test@example.com",
    username: "testuser",
    passwordHash: "hashedpassword123",
    role: ["user"],
    preferences: {
      theme: "dark",
      navigationCollapsed: false,
    },
    createdAt: "2024-01-01T00:00:00.000Z",
    lastLogin: "2024-06-01T00:00:00.000Z",
    characters: ["char-1", "char-2"],
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    emailVerified: true,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
    passwordResetTokenHash: null,
    passwordResetTokenExpiresAt: null,
    magicLinkTokenHash: null,
    magicLinkTokenExpiresAt: null,
  };

  const mockAdminUser: User = {
    ...mockUser,
    id: "admin-123",
    email: "admin@example.com",
    username: "adminuser",
    role: ["user", "administrator"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("toPublicUser", () => {
    it("strips passwordHash from user object", () => {
      const publicUser = toPublicUser(mockUser);

      expect(publicUser).not.toHaveProperty("passwordHash");
    });

    it("preserves all other fields", () => {
      const publicUser = toPublicUser(mockUser);

      expect(publicUser.id).toBe(mockUser.id);
      expect(publicUser.email).toBe(mockUser.email);
      expect(publicUser.username).toBe(mockUser.username);
      expect(publicUser.role).toEqual(mockUser.role);
      expect(publicUser.preferences).toEqual(mockUser.preferences);
      expect(publicUser.createdAt).toBe(mockUser.createdAt);
      expect(publicUser.lastLogin).toBe(mockUser.lastLogin);
      expect(publicUser.characters).toEqual(mockUser.characters);
      expect(publicUser.failedLoginAttempts).toBe(mockUser.failedLoginAttempts);
      expect(publicUser.lockoutUntil).toBe(mockUser.lockoutUntil);
      expect(publicUser.sessionVersion).toBe(mockUser.sessionVersion);
      expect(publicUser.accountStatus).toBe(mockUser.accountStatus);
    });

    it("returns correct PublicUser type", () => {
      const publicUser: PublicUser = toPublicUser(mockUser);

      // Type check - this should compile without errors
      expect(publicUser).toBeDefined();
    });
  });

  describe("getCurrentUser", () => {
    it("returns null when no session exists", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await getCurrentUser();

      expect(result).toBeNull();
      expect(mockGetSession).toHaveBeenCalled();
      expect(mockGetUserById).not.toHaveBeenCalled();
    });

    it("returns null when user not found", async () => {
      mockGetSession.mockResolvedValue("user-123");
      mockGetUserById.mockResolvedValue(null);

      const result = await getCurrentUser();

      expect(result).toBeNull();
      expect(mockGetSession).toHaveBeenCalled();
      expect(mockGetUserById).toHaveBeenCalledWith("user-123");
    });

    it("returns public user when session and user exist", async () => {
      mockGetSession.mockResolvedValue("user-123");
      mockGetUserById.mockResolvedValue(mockUser);

      const result = await getCurrentUser();

      expect(result).not.toBeNull();
      expect(result?.id).toBe("user-123");
      expect(result?.email).toBe("test@example.com");
      expect(result).not.toHaveProperty("passwordHash");
    });
  });

  describe("requireAuth", () => {
    it("throws error when no session exists", async () => {
      mockGetSession.mockResolvedValue(null);

      await expect(requireAuth()).rejects.toThrow("Authentication required");
    });

    it("throws error when user not found", async () => {
      mockGetSession.mockResolvedValue("user-123");
      mockGetUserById.mockResolvedValue(null);

      await expect(requireAuth()).rejects.toThrow("Authentication required");
    });

    it("returns public user when authenticated", async () => {
      mockGetSession.mockResolvedValue("user-123");
      mockGetUserById.mockResolvedValue(mockUser);

      const result = await requireAuth();

      expect(result.id).toBe("user-123");
      expect(result.email).toBe("test@example.com");
      expect(result).not.toHaveProperty("passwordHash");
    });
  });

  describe("isAdmin", () => {
    it("returns false when no session exists", async () => {
      mockGetSession.mockResolvedValue(null);

      const result = await isAdmin();

      expect(result).toBe(false);
    });

    it("returns false when user not found", async () => {
      mockGetSession.mockResolvedValue("user-123");
      mockGetUserById.mockResolvedValue(null);

      const result = await isAdmin();

      expect(result).toBe(false);
    });

    it("returns false when user has only user role", async () => {
      mockGetSession.mockResolvedValue("user-123");
      mockGetUserById.mockResolvedValue(mockUser);

      const result = await isAdmin();

      expect(result).toBe(false);
    });

    it("returns true when user has administrator role", async () => {
      mockGetSession.mockResolvedValue("admin-123");
      mockGetUserById.mockResolvedValue(mockAdminUser);

      const result = await isAdmin();

      expect(result).toBe(true);
    });

    it("returns true when user has multiple roles including administrator", async () => {
      const multiRoleUser: User = {
        ...mockUser,
        role: ["user", "gamemaster", "administrator"],
      };
      mockGetSession.mockResolvedValue("user-123");
      mockGetUserById.mockResolvedValue(multiRoleUser);

      const result = await isAdmin();

      expect(result).toBe(true);
    });
  });

  describe("requireAdmin", () => {
    it("throws error when no session exists", async () => {
      mockGetSession.mockResolvedValue(null);

      await expect(requireAdmin()).rejects.toThrow("Authentication required");
    });

    it("throws error when user not found", async () => {
      mockGetSession.mockResolvedValue("user-123");
      mockGetUserById.mockResolvedValue(null);

      await expect(requireAdmin()).rejects.toThrow("Authentication required");
    });

    it("throws error when user is not admin", async () => {
      mockGetSession.mockResolvedValue("user-123");
      mockGetUserById.mockResolvedValue(mockUser);

      await expect(requireAdmin()).rejects.toThrow("Administrator access required");
    });

    it("returns public user when user is admin", async () => {
      mockGetSession.mockResolvedValue("admin-123");
      mockGetUserById.mockResolvedValue(mockAdminUser);

      const result = await requireAdmin();

      expect(result.id).toBe("admin-123");
      expect(result.role).toContain("administrator");
      expect(result).not.toHaveProperty("passwordHash");
    });

    it("returns public user when user has multiple roles including administrator", async () => {
      const multiRoleUser: User = {
        ...mockUser,
        id: "multi-123",
        role: ["user", "gamemaster", "administrator"],
      };
      mockGetSession.mockResolvedValue("multi-123");
      mockGetUserById.mockResolvedValue(multiRoleUser);

      const result = await requireAdmin();

      expect(result.id).toBe("multi-123");
      expect(result.role).toContain("administrator");
    });
  });
});
