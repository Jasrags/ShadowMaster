/**
 * Email Verification Service
 *
 * Handles token generation, email sending, and verification for new user accounts.
 *
 * Token Security:
 * - 32 bytes (256 bits) of entropy
 * - URL-safe base64 encoding
 * - Stored as bcrypt hash (not plain text)
 * - 24-hour expiration
 * - Single-use (deleted after verification)
 */

import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
  getUserByVerificationToken,
  markEmailVerified,
  setVerificationToken,
  getUserById,
} from "@/lib/storage/users";
import { sendEmail, renderTemplate } from "@/lib/email";
import { VerificationEmailTemplate } from "@/lib/email/templates/verification-email";
import { AuditLogger } from "@/lib/security/audit-logger";

/** Token size in bytes (32 bytes = 256 bits of entropy) */
const TOKEN_BYTES = 32;

/** Token expiration time in hours */
const TOKEN_EXPIRY_HOURS = 24;

/** bcrypt rounds for token hashing */
const BCRYPT_ROUNDS = 10;

/**
 * Result of token generation
 */
export interface GeneratedToken {
  /** Plain text token (URL-safe base64) - sent to user */
  token: string;
  /** bcrypt hash of the token - stored in database */
  tokenHash: string;
  /** Expiration timestamp (ISO 8601) */
  expiresAt: string;
  /** First 6 chars of token for O(1) prefix filtering */
  tokenPrefix: string;
}

/**
 * Result of verification attempt
 */
export interface VerificationResult {
  success: boolean;
  error?: "invalid_token" | "expired_token" | "user_not_found" | "already_verified";
  userId?: string;
}

/**
 * Generate a secure verification token
 *
 * Creates a cryptographically random token with:
 * - 32 bytes of entropy (256 bits)
 * - URL-safe base64 encoding
 * - bcrypt hash for storage
 * - 24-hour expiration
 *
 * @returns Object containing token, hash, and expiration
 */
export async function generateVerificationToken(): Promise<GeneratedToken> {
  // Generate 32 random bytes
  const tokenBuffer = crypto.randomBytes(TOKEN_BYTES);

  // Encode as URL-safe base64
  const token = tokenBuffer.toString("base64url");

  // Hash the token for storage (don't store plain text)
  const tokenHash = await bcrypt.hash(token, BCRYPT_ROUNDS);

  // Calculate expiration time
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

  // Extract prefix for O(1) filtering (non-secret, just for fast lookup)
  const tokenPrefix = token.substring(0, 6);

  return {
    token,
    tokenHash,
    expiresAt: expiresAt.toISOString(),
    tokenPrefix,
  };
}

/**
 * Send a verification email to a user
 *
 * Generates a new token, stores the hash, and sends the email.
 *
 * @param userId - The user's ID
 * @param email - The user's email address
 * @param username - The user's username (for personalization)
 * @param baseUrl - The application base URL (e.g., http://localhost:3000)
 * @returns The email send result
 */
export async function sendVerificationEmail(
  userId: string,
  email: string,
  username: string,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate a new token
    const { token, tokenHash, expiresAt, tokenPrefix } = await generateVerificationToken();

    // Store the token hash and prefix in the user record
    await setVerificationToken(userId, tokenHash, expiresAt, tokenPrefix);

    // Build the verification URL
    const verifyUrl = `${baseUrl}/api/auth/verify-email/${token}`;

    // Render the email template
    const { html, text } = await renderTemplate(VerificationEmailTemplate({ username, verifyUrl }));

    // Send the email
    const result = await sendEmail({
      to: { email, name: username },
      subject: "Verify your Shadow Master account",
      html,
      text,
    });

    if (result.success) {
      // Log successful send
      await AuditLogger.log({
        event: "verification.sent",
        userId,
        email,
        metadata: { expiresAt },
      });

      return { success: true };
    } else {
      console.error("Failed to send verification email:", result.error);
      return { success: false, error: result.error || "Failed to send email" };
    }
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Verify an email verification token
 *
 * Validates the token, checks expiration, and marks the email as verified.
 *
 * @param token - The plain text verification token from the URL
 * @returns Verification result with success status and any errors
 */
export async function verifyEmailToken(token: string): Promise<VerificationResult> {
  try {
    // Find user by token (bcrypt compare)
    const user = await getUserByVerificationToken(token);

    if (!user) {
      await AuditLogger.log({
        event: "verification.failed",
        metadata: { reason: "invalid_token" },
      });
      return { success: false, error: "invalid_token" };
    }

    // Check if already verified
    if (user.emailVerified) {
      return { success: false, error: "already_verified", userId: user.id };
    }

    // Check token expiration
    if (user.emailVerificationTokenExpiresAt) {
      const expiresAt = new Date(user.emailVerificationTokenExpiresAt);
      if (expiresAt < new Date()) {
        await AuditLogger.log({
          event: "verification.failed",
          userId: user.id,
          email: user.email,
          metadata: { reason: "expired_token" },
        });
        return { success: false, error: "expired_token", userId: user.id };
      }
    }

    // Mark email as verified (also clears the token)
    await markEmailVerified(user.id);

    // Log successful verification
    await AuditLogger.log({
      event: "verification.success",
      userId: user.id,
      email: user.email,
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Error in verifyEmailToken:", error);
    await AuditLogger.log({
      event: "verification.failed",
      metadata: {
        reason: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
    return { success: false, error: "invalid_token" };
  }
}

/**
 * Check if a user's email is verified
 *
 * @param userId - The user's ID
 * @returns true if email is verified, false otherwise
 */
export async function isEmailVerified(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.emailVerified ?? false;
}
