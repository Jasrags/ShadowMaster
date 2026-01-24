import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomBytes, createHash, timingSafeEqual } from "crypto";
import { getUserById, setSessionSecretHash } from "../storage/users";

const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_DAYS = 7;
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

// 256-bit secret = 32 bytes
const SECRET_BYTES = 32;

/**
 * Generate a cryptographically random session secret and its SHA-256 hash
 *
 * @returns Object containing base64url-encoded secret and hex-encoded hash
 */
export function generateSessionSecret(): { secret: string; secretHash: string } {
  // Generate 32 random bytes (256 bits)
  const secretBuffer = randomBytes(SECRET_BYTES);

  // Encode as base64url (43 characters for 32 bytes)
  const secret = secretBuffer.toString("base64url");

  // Hash with SHA-256 for storage
  const secretHash = createHash("sha256").update(secretBuffer).digest("hex");

  return { secret, secretHash };
}

/**
 * Hash a session secret for comparison
 *
 * @param secret - The base64url-encoded secret from the cookie
 * @returns Hex-encoded SHA-256 hash
 */
function hashSecret(secret: string): string {
  // Decode base64url to buffer, then hash
  const secretBuffer = Buffer.from(secret, "base64url");
  return createHash("sha256").update(secretBuffer).digest("hex");
}

/**
 * Timing-safe comparison of two hex strings
 *
 * @param a - First hex string
 * @param b - Second hex string
 * @returns True if equal, false otherwise
 */
function timingSafeCompare(a: string, b: string): boolean {
  // Convert hex strings to buffers for timing-safe comparison
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");

  // Buffers must be same length for timingSafeEqual
  if (bufA.length !== bufB.length) {
    return false;
  }

  return timingSafeEqual(bufA, bufB);
}

/**
 * Create a session by setting a cookie with the user ID, version, and secret.
 * Also stores the secret hash server-side for validation.
 *
 * Cookie format: userId:version:secret
 * - userId: UUID
 * - version: number
 * - secret: base64url encoded 256-bit random value (43 chars)
 *
 * @param userId - The user ID to create a session for
 * @param response - The NextResponse to set the cookie on
 * @param sessionVersion - The session version number (default 1)
 */
export async function createSession(
  userId: string,
  response: NextResponse,
  sessionVersion: number = 1
): Promise<void> {
  const expires = new Date(Date.now() + SESSION_DURATION_MS);

  // Generate cryptographic secret
  const { secret, secretHash } = generateSessionSecret();

  // Store hash server-side
  await setSessionSecretHash(userId, secretHash);

  // Create cookie value: userId:version:secret
  const sessionValue = `${userId}:${sessionVersion}:${secret}`;

  response.cookies.set(SESSION_COOKIE_NAME, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });
}

/**
 * Get the current session (user ID) from cookies and verify cryptographically.
 *
 * Validates:
 * 1. Cookie format is userId:version:secret
 * 2. User exists
 * 3. Session version matches
 * 4. Secret hash matches (timing-safe comparison)
 *
 * @returns The user ID if valid, null otherwise
 */
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) return null;

  // Parse cookie: userId:version:secret
  const parts = sessionCookie.value.split(":");
  if (parts.length < 2) return null;

  // Handle both old format (userId:version) and new format (userId:version:secret)
  const [userId, versionStr, secret] = parts;
  if (!userId || !versionStr) return null;

  // Verify user exists
  const user = await getUserById(userId);
  if (!user) return null;

  // Verify session version
  if (user.sessionVersion !== parseInt(versionStr, 10)) {
    return null;
  }

  // If secret is present, verify it cryptographically
  if (secret) {
    // User must have a stored secret hash
    if (!user.sessionSecretHash) {
      return null;
    }

    // Hash the provided secret and compare
    const providedHash = hashSecret(secret);
    if (!timingSafeCompare(providedHash, user.sessionSecretHash)) {
      return null;
    }
  } else {
    // Old format without secret - reject for security
    // Existing users will need to re-login once
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
