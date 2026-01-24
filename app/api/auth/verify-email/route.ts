/**
 * POST /api/auth/verify-email
 *
 * Request a new verification email for the authenticated user.
 *
 * Rate limited to 3 requests per email per hour to prevent abuse.
 * Requires authentication.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { sendVerificationEmail } from "@/lib/auth/email-verification";
import { RateLimiter } from "@/lib/security/rate-limit";
import { AuditLogger } from "@/lib/security/audit-logger";
import { headers } from "next/headers";

// Rate limit: 3 requests per hour per email
const rateLimiter = RateLimiter.get("verification-email", {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
});

interface VerificationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<VerificationResponse>> {
  try {
    // Require authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Check if already verified - return success (no need to send another email)
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified",
      });
    }

    // Check rate limit by email
    const rateLimitKey = `verification:${user.email.toLowerCase()}`;
    if (rateLimiter.isRateLimited(rateLimitKey)) {
      // Get IP for logging
      const headersList = await headers();
      const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

      await AuditLogger.log({
        event: "verification.rate_limited",
        userId: user.id,
        email: user.email,
        ip,
        metadata: {
          remaining: rateLimiter.getRemaining(rateLimitKey),
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: "Too many verification requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Build base URL from request
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    // Send verification email
    const result = await sendVerificationEmail(user.id, user.email, user.username, baseUrl);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Verification email sent",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to send verification email",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Verification email request error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
