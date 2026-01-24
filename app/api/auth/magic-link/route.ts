/**
 * POST /api/auth/magic-link
 *
 * Request a magic link sign-in email.
 *
 * Rate limited to 5 requests per email per hour to prevent abuse.
 * Always returns success to prevent email enumeration.
 */

import { NextRequest, NextResponse } from "next/server";
import { requestMagicLink } from "@/lib/auth/magic-link";
import { isValidEmail } from "@/lib/auth/validation";
import { RateLimiter } from "@/lib/security/rate-limit";
import { AuditLogger } from "@/lib/security/audit-logger";
import { headers } from "next/headers";

// Rate limit: 5 requests per hour per email
const rateLimiter = RateLimiter.get("magic-link", {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
});

interface MagicLinkRequest {
  email: string;
}

interface MagicLinkResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<MagicLinkResponse>> {
  try {
    // Get IP for logging
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    // Parse request body
    let body: MagicLinkRequest;
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
    const rateLimitKey = `magic-link:${email.toLowerCase()}`;
    if (rateLimiter.isRateLimited(rateLimitKey)) {
      // Log rate limit hit
      await AuditLogger.log({
        event: "magic_link.rate_limited",
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
        message: "If an account exists with this email, you will receive a sign-in link.",
      });
    }

    // Build base URL from request
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    // Request magic link (always returns success)
    await requestMagicLink(email, baseUrl, ip);

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a sign-in link.",
    });
  } catch (error) {
    console.error("Magic link request error:", error);
    // Still return success to prevent information leakage
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a sign-in link.",
    });
  }
}
