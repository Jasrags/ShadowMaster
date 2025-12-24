import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserById } from "../storage/users";

const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_DAYS = 7;
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Create a session by setting a cookie with the user ID and session version
 */
export function createSession(userId: string, response: NextResponse, sessionVersion: number = 1): void {
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  const sessionValue = `${userId}:${sessionVersion}`;
  
  response.cookies.set(SESSION_COOKIE_NAME, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });
}

/**
 * Get the current session (user ID) from cookies
 */
/**
 * Get the current session (user ID) from cookies and verify its version
 */
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie?.value) return null;

  const [userId, versionStr] = sessionCookie.value.split(":");
  if (!userId || !versionStr) return null;

  // Verify session version against stored user data
  const user = await getUserById(userId);
  if (!user || user.sessionVersion !== parseInt(versionStr, 10)) {
    return null;
  }

  return userId;
}

/**
 * Clear the session cookie
 */
export function clearSession(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
}

