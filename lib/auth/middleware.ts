import { getSession } from "./session";
import { getUserById } from "../storage/users";
import type { PublicUser } from "../types/user";

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

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    characters: user.characters,
  };
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

