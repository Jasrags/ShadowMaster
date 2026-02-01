import { NextRequest, NextResponse } from "next/server";
import {
  getUserByEmail,
  updateUser,
  incrementFailedAttempts,
  resetFailedAttempts,
} from "@/lib/storage/users";
import { verifyCredentials } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/middleware";
import { RateLimiter } from "@/lib/security/rate-limit";
import { AuditLogger } from "@/lib/security/audit-logger";
import type { SigninRequest, AuthResponse } from "@/lib/types/user";

// Rate limit configuration
const IP_LIMIT = { windowMs: 15 * 60 * 1000, max: 20 }; // 20 attempts per 15 mins per IP
const ACCOUNT_LIMIT = { windowMs: 15 * 60 * 1000, max: 5 }; // 5 attempts per 15 mins per Email

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    const body: SigninRequest = await request.json();
    const { email, password } = body;

    // 1. Rate Limiting (IP)
    const ipLimiter = RateLimiter.get("signin-ip", IP_LIMIT);
    if (ipLimiter.isRateLimited(ip)) {
      await AuditLogger.log({ event: "signin.failure", ip, metadata: { reason: "rate_limit_ip" } });
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Validate email (required for rate limiting - password validated by verifyCredentials)
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 2. Rate Limiting (Account)
    const accountLimiter = RateLimiter.get("signin-account", ACCOUNT_LIMIT);
    if (accountLimiter.isRateLimited(email)) {
      await AuditLogger.log({
        event: "signin.failure",
        email,
        ip,
        metadata: { reason: "rate_limit_account" },
      });
      return NextResponse.json(
        { success: false, error: "Too many attempts for this account. Please try again later." },
        { status: 429 }
      );
    }

    // 3. Find user (may be null)
    const user = await getUserByEmail(email);

    // Unified failure response to prevent enumeration
    const failResponse = () =>
      NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });

    // 4. Timing-safe credential verification
    // verifyCredentials ALWAYS runs bcrypt first, then validates inputs.
    // This satisfies CodeQL by ensuring the security check cannot be bypassed.
    const { valid, error } = await verifyCredentials(password, user?.passwordHash);

    // 5. Handle validation errors (password empty/missing)
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    // 6. Check if user exists (after bcrypt to maintain constant timing)
    if (!user) {
      await AuditLogger.log({
        event: "signin.failure",
        email,
        ip,
        metadata: { reason: "user_not_found" },
      });
      return failResponse();
    }

    // 7. Check lockout status
    if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
      await AuditLogger.log({ event: "lockout.triggered", userId: user.id, email, ip });
      return NextResponse.json(
        { success: false, error: "Account is temporarily locked. Please try again in 15 minutes." },
        { status: 403 }
      );
    }

    // 8. Check password validity
    if (!valid) {
      await incrementFailedAttempts(user.id);
      await AuditLogger.log({
        event: "signin.failure",
        userId: user.id,
        email,
        ip,
        metadata: { reason: "invalid_password" },
      });
      return failResponse();
    }

    // 9. Success - Reset attempts and create session
    await resetFailedAttempts(user.id);
    const updatedUser = await updateUser(user.id, {
      lastLogin: new Date().toISOString(),
    });

    await AuditLogger.log({ event: "signin.success", userId: user.id, email, ip });

    const response = NextResponse.json({
      success: true,
      user: toPublicUser(updatedUser),
    });

    await createSession(user.id, response, updatedUser.sessionVersion);

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during signin" },
      { status: 500 }
    );
  }
}
