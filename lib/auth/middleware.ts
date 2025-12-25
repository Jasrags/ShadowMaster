import { getSession } from "./session";
import { getUserById } from "../storage/users";
import type { User, PublicUser } from "../types/user";

/**
 * Convert a User to PublicUser by stripping sensitive fields
 */
export function toPublicUser(user: User): PublicUser {
  // Destructure to remove passwordHash, spread the rest
  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}

/**
 * Get the current authenticated user from the session
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<PublicUser | null> {
  const userId = await getSession();
  if (!userId) {
    return null;
  }

  const user = await getUserById(userId);
  if (!user) {
    return null;
  }

  return toPublicUser(user);
}

/**
 * Require authentication - throws error if not authenticated
 * Use in Server Components or Server Actions
 */
export async function requireAuth(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Check if the current user is an administrator
 * Returns false if not authenticated
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role.includes("administrator") ?? false;
}

/**
 * Require administrator role - throws error if not authenticated or not admin
 * Use in Server Components or Server Actions
 */
export async function requireAdmin(): Promise<PublicUser> {
  const user = await requireAuth();
  if (!user.role.includes("administrator")) {
    throw new Error("Administrator access required");
  }
  return user;
}

