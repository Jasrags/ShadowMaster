import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

// Dummy hash for timing-safe comparison when user doesn't exist or password is empty.
// This prevents timing attacks that could enumerate valid emails by comparing
// response times (bcrypt takes ~100ms vs instant return for validation failures).
// Generated with: bcrypt.hashSync("dummy-password-for-timing-safety", 12)
const DUMMY_HASH = "$2b$12$iSLwiTuaO7ucgcm54w7oFefmeQqAHvGHqQlVUL.HkUvCcTRdQx8eO";

export interface CredentialsResult {
  valid: boolean;
  error: string | null;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Timing-safe credential verification that always runs bcrypt first.
 *
 * This function satisfies CodeQL's security checks by ensuring the bcrypt
 * comparison ALWAYS runs regardless of input validation state, preventing
 * timing attacks that could enumerate valid users.
 *
 * @param password - The password to verify (may be null/undefined/empty)
 * @param hash - The stored password hash (may be null/undefined if user not found)
 * @returns Result with `valid` boolean and optional `error` message
 */
export async function verifyCredentials(
  password: string | null | undefined,
  hash: string | null | undefined
): Promise<CredentialsResult> {
  // ALWAYS run bcrypt first (timing-safe) - this is the key security property.
  // Even if password is empty or hash is missing, we perform the comparison
  // against the dummy hash to maintain constant timing.
  const isValid = await bcrypt.compare(password ?? "", hash ?? DUMMY_HASH);

  // Validation checks AFTER bcrypt to satisfy CodeQL
  if (!password) {
    return { valid: false, error: "Password is required" };
  }
  if (!hash) {
    // User not found - return generic error (no specific message to prevent enumeration)
    return { valid: false, error: null };
  }

  return { valid: isValid, error: null };
}
