/**
 * POST /api/auth/forgot-password
 *
 * Request a password reset email.
 *
 * Rate limited to 3 requests per email per hour to prevent abuse.
 * Always returns success to prevent email enumeration.
 */

import { NextRequest, NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/auth/password-reset";
import { isValidEmail } from "@/lib/auth/validation";
import { RateLimiter } from "@/lib/security/rate-limit";
import { AuditLogger } from "@/lib/security/audit-logger";
import { headers } from "next/headers";

// Rate limit: 3 requests per hour per email
const rateLimiter = RateLimiter.get("password-reset", {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
});

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ForgotPasswordResponse>> {
  try {
    // Get IP for logging
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    // Parse request body
    let body: ForgotPasswordRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    const { email } = body;

    // Validate email format
    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }

    // Check rate limit by email (lowercase for consistency)
    const rateLimitKey = `password-reset:${email.toLowerCase()}`;
    if (rateLimiter.isRateLimited(rateLimitKey)) {
      // Log rate limit hit
      await AuditLogger.log({
        event: "password_reset.rate_limited",
        email,
        ip,
        metadata: {
          remaining: rateLimiter.getRemaining(rateLimitKey),
        },
      });

      // Still return success to prevent email enumeration
      // The rate limit is applied silently
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    // Build base URL from request
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    // Request password reset (always returns success)
    await requestPasswordReset(email, baseUrl, ip);

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password request error:", error);
    // Still return success to prevent information leakage
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    });
  }
}
