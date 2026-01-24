import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { User, UserRole, AccountStatus } from "../types/user";

export type NewUserData = Omit<
  User,
  | "id"
  | "createdAt"
  | "lastLogin"
  | "characters"
  | "failedLoginAttempts"
  | "lockoutUntil"
  | "sessionVersion"
  | "preferences"
  | "accountStatus"
  | "statusChangedAt"
  | "statusChangedBy"
  | "statusReason"
  | "lastRoleChangeAt"
  | "lastRoleChangeBy"
  | "emailVerified"
  | "emailVerifiedAt"
  | "emailVerificationTokenHash"
  | "emailVerificationTokenExpiresAt"
>;

const DATA_DIR = path.join(process.cwd(), "data", "users");

/**
 * Ensures the data directory exists, creating it if necessary
 */
async function ensureDataDirectory(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, which is fine
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
}

/**
 * Get the file path for a user by ID
 */
function getUserFilePath(userId: string): string {
  return path.join(DATA_DIR, `${userId}.json`);
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const filePath = getUserFilePath(userId);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const user = JSON.parse(fileContent) as User;
    // Normalize role to array for backward compatibility
    user.role = normalizeUserRole(user.role);
    // Ensure security fields have defaults
    return normalizeUserDefaults(user);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await getAllUsers();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    // If directory doesn't exist, return null
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const users = await getAllUsers();
    return users.find((user) => user.username.toLowerCase() === username.toLowerCase()) || null;
  } catch (error) {
    // If directory doesn't exist, return null
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}
/**
 * Normalize user role to always be an array (for backward compatibility)
 */
function normalizeUserRole(role: UserRole | UserRole[]): UserRole[] {
  if (Array.isArray(role)) {
    return role;
  }
  return [role];
}

/**
 * Ensure user has default values for security and governance fields (for backward compatibility)
 */
function normalizeUserDefaults(user: User): User {
  return {
    ...user,
    preferences: user.preferences ?? {
      theme: "system",
      navigationCollapsed: false,
    },
    failedLoginAttempts: user.failedLoginAttempts ?? 0,
    lockoutUntil: user.lockoutUntil ?? null,
    sessionVersion: user.sessionVersion ?? 1,
    // Governance fields (participant governance capability)
    accountStatus: user.accountStatus ?? "active",
    statusChangedAt: user.statusChangedAt ?? null,
    statusChangedBy: user.statusChangedBy ?? null,
    statusReason: user.statusReason ?? null,
    lastRoleChangeAt: user.lastRoleChangeAt ?? null,
    lastRoleChangeBy: user.lastRoleChangeBy ?? null,
    // Email verification fields (existing users are grandfathered as verified)
    emailVerified: user.emailVerified ?? true,
    emailVerifiedAt: user.emailVerifiedAt ?? null,
    emailVerificationTokenHash: user.emailVerificationTokenHash ?? null,
    emailVerificationTokenExpiresAt: user.emailVerificationTokenExpiresAt ?? null,
  };
}

/**
 * Get all users (for checking if first user)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    await ensureDataDirectory();
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const users: User[] = [];
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(DATA_DIR, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const user = JSON.parse(fileContent) as User;
        // Normalize role to array for backward compatibility
        user.role = normalizeUserRole(user.role);
        users.push(normalizeUserDefaults(user));
      } catch (error) {
        // Skip invalid files
        console.error(`Error reading user file ${file}:`, error);
      }
    }
    return users;
  } catch (error) {
    // If directory doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Check if this is the first user (for role assignment)
 */
async function isFirstUser(): Promise<boolean> {
  const users = await getAllUsers();
  return users.length === 0;
}

/**
 * Create a new user
 */
export async function createUser(userData: NewUserData): Promise<User> {
  await ensureDataDirectory();

  const isFirst = await isFirstUser();
  const role: UserRole[] = isFirst ? ["administrator"] : ["user"];

  const user: User = {
    id: uuidv4(),
    ...userData,
    role,
    preferences: {
      theme: "system",
      navigationCollapsed: false,
    },
    createdAt: new Date().toISOString(),
    lastLogin: null,
    characters: [],
    // Initialize security fields
    failedLoginAttempts: 0,
    lockoutUntil: null,
    sessionVersion: 1,
    // Initialize governance fields
    accountStatus: "active",
    statusChangedAt: null,
    statusChangedBy: null,
    statusReason: null,
    lastRoleChangeAt: null,
    lastRoleChangeBy: null,
    // Initialize email verification fields (new users start unverified)
    emailVerified: false,
    emailVerifiedAt: null,
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
  };

  // Atomic write: write to temp file, then rename
  const filePath = getUserFilePath(user.id);
  const tempFilePath = `${filePath}.tmp`;

  try {
    await fs.writeFile(tempFilePath, JSON.stringify(user, null, 2), "utf-8");
    await fs.rename(tempFilePath, filePath);
  } catch (error) {
    // Clean up temp file if rename fails
    try {
      await fs.unlink(tempFilePath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }

  return user;
}

/**
 * Update user
 */
export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const updatedUser: User = {
    ...user,
    ...updates,
    id: user.id, // Ensure ID cannot be changed
  };

  // Atomic write: write to temp file, then rename
  const filePath = getUserFilePath(userId);
  const tempFilePath = `${filePath}.tmp`;

  try {
    await fs.writeFile(tempFilePath, JSON.stringify(updatedUser, null, 2), "utf-8");
    await fs.rename(tempFilePath, filePath);
  } catch (error) {
    // Clean up temp file if rename fails
    try {
      await fs.unlink(tempFilePath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }

  return updatedUser;
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId: string): Promise<void> {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  // Delete all characters owned by the user first (Requirement 4.3)
  try {
    const { deleteUserCharacters } = await import("./characters");
    await deleteUserCharacters(userId);
  } catch (error) {
    console.error(`Error deleting characters for user ${userId}:`, error);
  }

  const filePath = getUserFilePath(userId);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    // File doesn't exist, which is fine
  }
}

/**
 * Increment failed login attempts and set lockout if threshold reached
 */
export async function incrementFailedAttempts(userId: string): Promise<User> {
  const LOCKOUT_THRESHOLD = 5;
  const LOCKOUT_DURATION_MINS = 15;

  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const newAttempts = (user.failedLoginAttempts || 0) + 1;
  let lockoutUntil = user.lockoutUntil;

  if (newAttempts >= LOCKOUT_THRESHOLD) {
    const unlockTime = new Date();
    unlockTime.setMinutes(unlockTime.getMinutes() + LOCKOUT_DURATION_MINS);
    lockoutUntil = unlockTime.toISOString();
  }

  return updateUser(userId, {
    failedLoginAttempts: newAttempts,
    lockoutUntil,
  });
}

/**
 * Reset failed login attempts and clear lockout
 */
export async function resetFailedAttempts(userId: string): Promise<User> {
  return updateUser(userId, {
    failedLoginAttempts: 0,
    lockoutUntil: null,
  });
}

/**
 * Increment session version to invalidate all active sessions
 */
export async function incrementSessionVersion(userId: string): Promise<User> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  return updateUser(userId, {
    sessionVersion: (user.sessionVersion || 0) + 1,
  });
}

// =============================================================================
// PARTICIPANT GOVERNANCE FUNCTIONS
// =============================================================================

/**
 * Count the number of administrators in the system
 */
export async function countAdmins(): Promise<number> {
  const users = await getAllUsers();
  return users.filter((u) => u.role.includes("administrator")).length;
}

/**
 * Check if a user is the last administrator
 */
export async function isLastAdmin(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user || !user.role.includes("administrator")) {
    return false;
  }
  const adminCount = await countAdmins();
  return adminCount === 1;
}

/**
 * Suspend a user account
 *
 * @param userId - The user to suspend
 * @param actorId - The admin performing the suspension
 * @param reason - The reason for suspension
 * @throws Error if user is the last administrator
 */
export async function suspendUser(userId: string, actorId: string, reason: string): Promise<User> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  // Prevent suspending the last administrator
  if (await isLastAdmin(userId)) {
    throw new Error("Cannot suspend the last administrator");
  }

  const now = new Date().toISOString();

  // Update user status and invalidate sessions
  const updatedUser = await updateUser(userId, {
    accountStatus: "suspended" as AccountStatus,
    statusChangedAt: now,
    statusChangedBy: actorId,
    statusReason: reason,
    sessionVersion: (user.sessionVersion || 0) + 1, // Force logout
  });

  // Create audit entry
  const { createUserAuditEntry } = await import("./user-audit");
  await createUserAuditEntry({
    action: "user_suspended",
    actor: { userId: actorId, role: "admin" },
    targetUserId: userId,
    details: {
      previousValue: user.accountStatus,
      newValue: "suspended",
      reason,
    },
  });

  return updatedUser;
}

/**
 * Reactivate a suspended user account
 *
 * @param userId - The user to reactivate
 * @param actorId - The admin performing the reactivation
 */
export async function reactivateUser(userId: string, actorId: string): Promise<User> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  if (user.accountStatus === "active") {
    throw new Error("User is already active");
  }

  const now = new Date().toISOString();
  const previousStatus = user.accountStatus;

  const updatedUser = await updateUser(userId, {
    accountStatus: "active" as AccountStatus,
    statusChangedAt: now,
    statusChangedBy: actorId,
    statusReason: null,
  });

  // Create audit entry
  const { createUserAuditEntry } = await import("./user-audit");
  await createUserAuditEntry({
    action: "user_reactivated",
    actor: { userId: actorId, role: "admin" },
    targetUserId: userId,
    details: {
      previousValue: previousStatus,
      newValue: "active",
    },
  });

  return updatedUser;
}

/**
 * Update user roles with audit logging
 *
 * @param userId - The user to update
 * @param newRoles - The new set of roles
 * @param actorId - The admin performing the change
 * @throws Error if would leave user with no roles or demote last admin
 */
export async function updateUserRoles(
  userId: string,
  newRoles: UserRole[],
  actorId: string
): Promise<User> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  // Validate roles array is not empty
  if (!newRoles || newRoles.length === 0) {
    throw new Error("User must have at least one role");
  }

  const previousRoles = [...user.role];
  const hadAdmin = previousRoles.includes("administrator");
  const hasAdmin = newRoles.includes("administrator");

  // Prevent demoting the last administrator
  if (hadAdmin && !hasAdmin && (await isLastAdmin(userId))) {
    throw new Error("Cannot remove administrator role from the last administrator");
  }

  const now = new Date().toISOString();

  // Determine if this is a demotion (lost admin or gm role)
  const isDemotion =
    (hadAdmin && !hasAdmin) ||
    (previousRoles.includes("gamemaster") && !newRoles.includes("gamemaster"));

  const updatedUser = await updateUser(userId, {
    role: newRoles,
    lastRoleChangeAt: now,
    lastRoleChangeBy: actorId,
    // Force session invalidation on demotion for immediate propagation
    ...(isDemotion && { sessionVersion: (user.sessionVersion || 0) + 1 }),
  });

  // Create audit entries for role changes
  const { createUserAuditEntry } = await import("./user-audit");

  // Log granted roles
  const grantedRoles = newRoles.filter((r) => !previousRoles.includes(r));
  for (const role of grantedRoles) {
    await createUserAuditEntry({
      action: "user_role_granted",
      actor: { userId: actorId, role: "admin" },
      targetUserId: userId,
      details: {
        newValue: role,
        allRoles: newRoles,
      },
    });
  }

  // Log revoked roles
  const revokedRoles = previousRoles.filter((r) => !newRoles.includes(r));
  for (const role of revokedRoles) {
    await createUserAuditEntry({
      action: "user_role_revoked",
      actor: { userId: actorId, role: "admin" },
      targetUserId: userId,
      details: {
        previousValue: role,
        allRoles: newRoles,
      },
    });
  }

  return updatedUser;
}

/**
 * Update user email with audit logging
 */
export async function updateUserEmail(
  userId: string,
  newEmail: string,
  actorId: string
): Promise<User> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const previousEmail = user.email;

  const updatedUser = await updateUser(userId, {
    email: newEmail,
  });

  // Create audit entry
  const { createUserAuditEntry } = await import("./user-audit");
  await createUserAuditEntry({
    action: "user_email_changed",
    actor: { userId: actorId, role: "admin" },
    targetUserId: userId,
    details: {
      previousValue: previousEmail,
      newValue: newEmail,
    },
  });

  return updatedUser;
}

/**
 * Update username with audit logging
 */
export async function updateUsername(
  userId: string,
  newUsername: string,
  actorId: string
): Promise<User> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const previousUsername = user.username;

  const updatedUser = await updateUser(userId, {
    username: newUsername,
  });

  // Create audit entry
  const { createUserAuditEntry } = await import("./user-audit");
  await createUserAuditEntry({
    action: "user_username_changed",
    actor: { userId: actorId, role: "admin" },
    targetUserId: userId,
    details: {
      previousValue: previousUsername,
      newValue: newUsername,
    },
  });

  return updatedUser;
}

// =============================================================================
// EMAIL VERIFICATION FUNCTIONS
// =============================================================================

/**
 * Set email verification token for a user
 *
 * @param userId - The user to set the token for
 * @param tokenHash - The bcrypt hash of the verification token
 * @param expiresAt - When the token expires (ISO 8601 string)
 */
export async function setVerificationToken(
  userId: string,
  tokenHash: string,
  expiresAt: string
): Promise<User> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  return updateUser(userId, {
    emailVerificationTokenHash: tokenHash,
    emailVerificationTokenExpiresAt: expiresAt,
  });
}

/**
 * Mark a user's email as verified and clear the verification token
 *
 * @param userId - The user to mark as verified
 */
export async function markEmailVerified(userId: string): Promise<User> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  return updateUser(userId, {
    emailVerified: true,
    emailVerifiedAt: new Date().toISOString(),
    emailVerificationTokenHash: null,
    emailVerificationTokenExpiresAt: null,
  });
}

/**
 * Find a user by their email verification token
 * Iterates through all users and compares the token hash using bcrypt
 *
 * @param token - The plain text verification token
 * @returns The user if found and token matches, null otherwise
 */
export async function getUserByVerificationToken(token: string): Promise<User | null> {
  const bcrypt = await import("bcryptjs");
  const users = await getAllUsers();

  for (const user of users) {
    if (user.emailVerificationTokenHash) {
      const matches = await bcrypt.compare(token, user.emailVerificationTokenHash);
      if (matches) {
        return user;
      }
    }
  }

  return null;
}
