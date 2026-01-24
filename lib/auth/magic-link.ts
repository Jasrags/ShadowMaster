/**
 * Magic Link Authentication Service
 *
 * Handles token generation, email sending, validation, and session creation for passwordless sign-in.
 *
 * Token Security:
 * - 32 bytes (256 bits) of entropy
 * - URL-safe base64 encoding
 * - Stored as bcrypt hash (not plain text)
 * - 15-minute expiration (shorter than password reset for security)
 * - Single-use (deleted after verification)
 */

import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
  getUserByMagicLinkToken,
  setMagicLinkToken,
  clearMagicLinkToken,
  getUserById,
  getUserByEmail,
  resetFailedAttempts,
  updateUser,
} from "@/lib/storage/users";
import { sendEmail, renderTemplate } from "@/lib/email";
import { MagicLinkEmailTemplate } from "@/lib/email/templates/magic-link-email";
import { AuditLogger } from "@/lib/security/audit-logger";

/** Token size in bytes (32 bytes = 256 bits of entropy) */
const TOKEN_BYTES = 32;

/** Token expiration time in minutes */
const TOKEN_EXPIRY_MINUTES = 15;

/** bcrypt rounds for token hashing */
const BCRYPT_ROUNDS = 10;

/**
 * Result of token generation
 */
export interface GeneratedMagicLinkToken {
  /** Plain text token (URL-safe base64) - sent to user */
  token: string;
  /** bcrypt hash of the token - stored in database */
  tokenHash: string;
  /** Expiration timestamp (ISO 8601) */
  expiresAt: string;
}

/**
 * Result of magic link verification
 */
export interface VerifyMagicLinkResult {
  success: boolean;
  error?:
    | "invalid_link"
    | "link_expired"
    | "account_locked"
    | "email_not_verified"
    | "account_suspended";
  userId?: string;
  sessionVersion?: number;
}

/**
 * Generate a secure magic link token
 *
 * Creates a cryptographically random token with:
 * - 32 bytes of entropy (256 bits)
 * - URL-safe base64 encoding
 * - bcrypt hash for storage
 * - 15-minute expiration
 *
 * @returns Object containing token, hash, and expiration
 */
export async function generateMagicLinkToken(): Promise<GeneratedMagicLinkToken> {
  // Generate 32 random bytes
  const tokenBuffer = crypto.randomBytes(TOKEN_BYTES);

  // Encode as URL-safe base64
  const token = tokenBuffer.toString("base64url");

  // Hash the token for storage (don't store plain text)
  const tokenHash = await bcrypt.hash(token, BCRYPT_ROUNDS);

  // Calculate expiration time (15 minutes)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + TOKEN_EXPIRY_MINUTES);

  return {
    token,
    tokenHash,
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Send a magic link email to a user
 *
 * Clears any existing token, generates a new one, stores the hash, and sends the email.
 * Checks account status before sending (locked, unverified email, suspended).
 *
 * @param userId - The user's ID
 * @param email - The user's email address
 * @param username - The user's username (for personalization)
 * @param baseUrl - The application base URL (e.g., http://localhost:3000)
 * @returns The email send result
 */
export async function sendMagicLinkEmail(
  userId: string,
  email: string,
  username: string,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get fresh user data to check account status
    const user = await getUserById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Check if email is verified (required for magic links)
    if (!user.emailVerified) {
      await AuditLogger.log({
        event: "magic_link.failed",
        userId,
        email,
        metadata: { reason: "email_not_verified" },
      });
      return { success: false, error: "email_not_verified" };
    }

    // Check if account is locked
    if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
      await AuditLogger.log({
        event: "magic_link.failed",
        userId,
        email,
        metadata: { reason: "account_locked" },
      });
      return { success: false, error: "account_locked" };
    }

    // Check if account is suspended
    if (user.accountStatus === "suspended") {
      await AuditLogger.log({
        event: "magic_link.failed",
        userId,
        email,
        metadata: { reason: "account_suspended" },
      });
      return { success: false, error: "account_suspended" };
    }

    // Clear any existing token first
    await clearMagicLinkToken(userId);

    // Generate a new token
    const { token, tokenHash, expiresAt } = await generateMagicLinkToken();

    // Store the token hash in the user record
    await setMagicLinkToken(userId, tokenHash, expiresAt);

    // Build the magic link URL
    const magicLinkUrl = `${baseUrl}/api/auth/magic-link/${token}`;

    // Render the email template
    const { html, text } = await renderTemplate(MagicLinkEmailTemplate({ username, magicLinkUrl }));

    // Send the email
    const result = await sendEmail({
      to: { email, name: username },
      subject: "Sign in to Shadow Master",
      html,
      text,
    });

    if (result.success) {
      // Log successful send
      await AuditLogger.log({
        event: "magic_link.sent",
        userId,
        email,
        metadata: { expiresAt },
      });

      return { success: true };
    } else {
      console.error("Failed to send magic link email:", result.error);
      return { success: false, error: result.error || "Failed to send email" };
    }
  } catch (error) {
    console.error("Error in sendMagicLinkEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Request a magic link for an email address
 *
 * Looks up the user, checks account status, generates token, and sends email.
 * Always returns success to prevent email enumeration.
 *
 * @param email - The email address to send magic link to
 * @param baseUrl - The application base URL
 * @param ip - The requester's IP address (for audit logging)
 * @returns Always returns success (to prevent email enumeration)
 */
export async function requestMagicLink(
  email: string,
  baseUrl: string,
  ip?: string
): Promise<{ success: boolean }> {
  // Log the request
  await AuditLogger.log({
    event: "magic_link.requested",
    email,
    ip,
  });

  // Look up user by email
  const user = await getUserByEmail(email);

  if (user) {
    // Send magic link email (errors are logged but not returned)
    await sendMagicLinkEmail(user.id, user.email, user.username, baseUrl);
  }

  // Always return success to prevent email enumeration
  return { success: true };
}

/**
 * Verify a magic link token and prepare for session creation
 *
 * Validates the token, checks expiration, verifies account status,
 * clears the token (single-use), and returns user info for session creation.
 *
 * @param token - The plain text magic link token from the URL
 * @returns Verification result with user ID and session version if successful
 */
export async function verifyMagicLink(token: string): Promise<VerifyMagicLinkResult> {
  try {
    // Find user by token (bcrypt compare)
    const user = await getUserByMagicLinkToken(token);

    if (!user) {
      await AuditLogger.log({
        event: "magic_link.failed",
        metadata: { reason: "invalid_link" },
      });
      return { success: false, error: "invalid_link" };
    }

    // Check token expiration
    if (user.magicLinkTokenExpiresAt) {
      const expiresAt = new Date(user.magicLinkTokenExpiresAt);
      if (expiresAt < new Date()) {
        await AuditLogger.log({
          event: "magic_link.failed",
          userId: user.id,
          email: user.email,
          metadata: { reason: "link_expired" },
        });
        // Clear expired token
        await clearMagicLinkToken(user.id);
        return { success: false, error: "link_expired", userId: user.id };
      }
    }

    // Check if email is verified (double-check at verification time)
    if (!user.emailVerified) {
      await AuditLogger.log({
        event: "magic_link.failed",
        userId: user.id,
        email: user.email,
        metadata: { reason: "email_not_verified" },
      });
      return { success: false, error: "email_not_verified", userId: user.id };
    }

    // Check if account is locked
    if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
      await AuditLogger.log({
        event: "magic_link.failed",
        userId: user.id,
        email: user.email,
        metadata: { reason: "account_locked" },
      });
      return { success: false, error: "account_locked", userId: user.id };
    }

    // Check if account is suspended
    if (user.accountStatus === "suspended") {
      await AuditLogger.log({
        event: "magic_link.failed",
        userId: user.id,
        email: user.email,
        metadata: { reason: "account_suspended" },
      });
      return { success: false, error: "account_suspended", userId: user.id };
    }

    // Clear the token (single-use)
    await clearMagicLinkToken(user.id);

    // Reset failed login attempts on successful magic link sign-in
    await resetFailedAttempts(user.id);

    // Update last login
    await updateUser(user.id, {
      lastLogin: new Date().toISOString(),
    });

    // Log successful verification
    await AuditLogger.log({
      event: "magic_link.success",
      userId: user.id,
      email: user.email,
    });

    return {
      success: true,
      userId: user.id,
      sessionVersion: user.sessionVersion,
    };
  } catch (error) {
    console.error("Error in verifyMagicLink:", error);
    await AuditLogger.log({
      event: "magic_link.failed",
      metadata: {
        reason: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
    return { success: false, error: "invalid_link" };
  }
}

/**
 * Check if a user has a pending magic link token
 *
 * @param userId - The user's ID
 * @returns true if user has a valid (non-expired) magic link token
 */
export async function hasPendingMagicLink(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user || !user.magicLinkTokenHash || !user.magicLinkTokenExpiresAt) {
    return false;
  }

  const expiresAt = new Date(user.magicLinkTokenExpiresAt);
  return expiresAt > new Date();
}
