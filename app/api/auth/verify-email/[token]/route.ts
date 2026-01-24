/**
 * GET /api/auth/verify-email/[token]
 *
 * Verify an email verification token and mark the user's email as verified.
 * Redirects to /settings with success or error query parameters.
 *
 * This endpoint is accessed via the link in the verification email.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/auth/email-verification";

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { token } = await params;

  // Get base URL for redirect
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // Validate token is present and has minimum length
  if (!token || token.length < 32) {
    return NextResponse.redirect(new URL("/settings?verification=error&reason=invalid", baseUrl));
  }

  // Verify the token
  const result = await verifyEmailToken(token);

  if (result.success) {
    // Redirect to settings with success message
    return NextResponse.redirect(new URL("/settings?verified=true", baseUrl));
  }

  // Handle specific error cases
  switch (result.error) {
    case "expired_token":
      return NextResponse.redirect(new URL("/settings?verification=error&reason=expired", baseUrl));

    case "already_verified":
      // Not really an error - user already verified, just redirect successfully
      return NextResponse.redirect(new URL("/settings?verification=already_verified", baseUrl));

    case "invalid_token":
    case "user_not_found":
    default:
      return NextResponse.redirect(new URL("/settings?verification=error&reason=invalid", baseUrl));
  }
}
