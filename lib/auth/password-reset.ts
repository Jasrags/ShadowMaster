/**
 * Password Reset Service
 *
 * Handles token generation, email sending, validation, and password reset for users.
 *
 * Token Security:
 * - 32 bytes (256 bits) of entropy
 * - URL-safe base64 encoding
 * - Stored as bcrypt hash (not plain text)
 * - 1-hour expiration (shorter than verification for security)
 * - Single-use (deleted after reset)
 */

import crypto from "crypto";
import bcrypt from "bcryptjs";
import {
  getUserByPasswordResetToken,
  setPasswordResetToken,
  clearPasswordResetToken,
  updateUserPassword,
  getUserById,
  getUserByEmail,
} from "@/lib/storage/users";
import { sendEmail, renderTemplate } from "@/lib/email";
import { PasswordResetEmailTemplate } from "@/lib/email/templates/password-reset-email";
import { AuditLogger } from "@/lib/security/audit-logger";

/** Token size in bytes (32 bytes = 256 bits of entropy) */
const TOKEN_BYTES = 32;

/** Token expiration time in hours */
const TOKEN_EXPIRY_HOURS = 1;

/** bcrypt rounds for token hashing */
const BCRYPT_ROUNDS = 10;

/**
 * Result of token generation
 */
export interface GeneratedResetToken {
  /** Plain text token (URL-safe base64) - sent to user */
  token: string;
  /** bcrypt hash of the token - stored in database */
  tokenHash: string;
  /** Expiration timestamp (ISO 8601) */
  expiresAt: string;
}

/**
 * Result of token validation (without consuming)
 */
export interface ValidateTokenResult {
  valid: boolean;
  reason?: "invalid" | "expired";
  userId?: string;
}

/**
 * Result of password reset attempt
 */
export interface ResetPasswordResult {
  success: boolean;
  error?: "invalid_token" | "expired_token" | "user_not_found" | "weak_password";
  userId?: string;
}

/**
 * Generate a secure password reset token
 *
 * Creates a cryptographically random token with:
 * - 32 bytes of entropy (256 bits)
 * - URL-safe base64 encoding
 * - bcrypt hash for storage
 * - 1-hour expiration
 *
 * @returns Object containing token, hash, and expiration
 */
export async function generatePasswordResetToken(): Promise<GeneratedResetToken> {
  // Generate 32 random bytes
  const tokenBuffer = crypto.randomBytes(TOKEN_BYTES);

  // Encode as URL-safe base64
  const token = tokenBuffer.toString("base64url");

  // Hash the token for storage (don't store plain text)
  const tokenHash = await bcrypt.hash(token, BCRYPT_ROUNDS);

  // Calculate expiration time (1 hour)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

  return {
    token,
    tokenHash,
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Send a password reset email to a user
 *
 * Clears any existing token, generates a new one, stores the hash, and sends the email.
 *
 * @param userId - The user's ID
 * @param email - The user's email address
 * @param username - The user's username (for personalization)
 * @param baseUrl - The application base URL (e.g., http://localhost:3000)
 * @returns The email send result
 */
export async function sendPasswordResetEmail(
  userId: string,
  email: string,
  username: string,
  baseUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Clear any existing token first
    await clearPasswordResetToken(userId);

    // Generate a new token
    const { token, tokenHash, expiresAt } = await generatePasswordResetToken();

    // Store the token hash in the user record
    await setPasswordResetToken(userId, tokenHash, expiresAt);

    // Build the reset URL
    const resetUrl = `${baseUrl}/reset-password/${token}`;

    // Render the email template
    const { html, text } = await renderTemplate(PasswordResetEmailTemplate({ username, resetUrl }));

    // Send the email
    const result = await sendEmail({
      to: { email, name: username },
      subject: "Reset your Shadow Master password",
      html,
      text,
    });

    if (result.success) {
      // Log successful send
      await AuditLogger.log({
        event: "password_reset.sent",
        userId,
        email,
        metadata: { expiresAt },
      });

      return { success: true };
    } else {
      console.error("Failed to send password reset email:", result.error);
      return { success: false, error: result.error || "Failed to send email" };
    }
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Request a password reset for an email address
 *
 * Looks up the user, clears existing token, generates new token, and sends email.
 * Always returns success to prevent email enumeration.
 *
 * @param email - The email address to send reset to
 * @param baseUrl - The application base URL
 * @param ip - The requester's IP address (for audit logging)
 * @returns Always returns success (to prevent email enumeration)
 */
export async function requestPasswordReset(
  email: string,
  baseUrl: string,
  ip?: string
): Promise<{ success: boolean }> {
  // Log the request
  await AuditLogger.log({
    event: "password_reset.requested",
    email,
    ip,
  });

  // Look up user by email
  const user = await getUserByEmail(email);

  if (user) {
    // Send reset email (errors are logged but not returned)
    await sendPasswordResetEmail(user.id, user.email, user.username, baseUrl);
  }

  // Always return success to prevent email enumeration
  return { success: true };
}

/**
 * Validate a password reset token without consuming it
 *
 * Used to check if a token is valid before showing the reset form.
 *
 * @param token - The plain text reset token from the URL
 * @returns Validation result with valid status and reason if invalid
 */
export async function validateResetToken(token: string): Promise<ValidateTokenResult> {
  try {
    // Find user by token (bcrypt compare)
    const user = await getUserByPasswordResetToken(token);

    if (!user) {
      return { valid: false, reason: "invalid" };
    }

    // Check token expiration
    if (user.passwordResetTokenExpiresAt) {
      const expiresAt = new Date(user.passwordResetTokenExpiresAt);
      if (expiresAt < new Date()) {
        return { valid: false, reason: "expired", userId: user.id };
      }
    }

    return { valid: true, userId: user.id };
  } catch (error) {
    console.error("Error in validateResetToken:", error);
    return { valid: false, reason: "invalid" };
  }
}

/**
 * Reset a user's password using a reset token
 *
 * Validates the token, updates the password, invalidates all sessions, and clears the token.
 *
 * @param token - The plain text reset token from the URL
 * @param newPassword - The new password (plain text, will be hashed)
 * @returns Reset result with success status and any errors
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  try {
    // Find user by token (bcrypt compare)
    const user = await getUserByPasswordResetToken(token);

    if (!user) {
      await AuditLogger.log({
        event: "password_reset.failed",
        metadata: { reason: "invalid_token" },
      });
      return { success: false, error: "invalid_token" };
    }

    // Check token expiration
    if (user.passwordResetTokenExpiresAt) {
      const expiresAt = new Date(user.passwordResetTokenExpiresAt);
      if (expiresAt < new Date()) {
        await AuditLogger.log({
          event: "password_reset.failed",
          userId: user.id,
          email: user.email,
          metadata: { reason: "expired_token" },
        });
        return { success: false, error: "expired_token", userId: user.id };
      }
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    // Update password and invalidate all sessions
    await updateUserPassword(user.id, passwordHash);

    // Log successful reset
    await AuditLogger.log({
      event: "password_reset.success",
      userId: user.id,
      email: user.email,
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Error in resetPassword:", error);
    await AuditLogger.log({
      event: "password_reset.failed",
      metadata: {
        reason: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
    return { success: false, error: "invalid_token" };
  }
}

/**
 * Check if a user has a pending password reset token
 *
 * @param userId - The user's ID
 * @returns true if user has a valid (non-expired) reset token
 */
export async function hasPendingReset(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user || !user.passwordResetTokenHash || !user.passwordResetTokenExpiresAt) {
    return false;
  }

  const expiresAt = new Date(user.passwordResetTokenExpiresAt);
  return expiresAt > new Date();
}
