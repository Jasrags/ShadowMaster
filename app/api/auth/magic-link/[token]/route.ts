/**
 * GET /api/auth/magic-link/[token]
 *
 * Verify a magic link token and sign the user in.
 * Creates a session and redirects to the home page on success.
 * Redirects to /signin with error query parameters on failure.
 *
 * This endpoint is accessed via the link in the magic link email.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLink } from "@/lib/auth/magic-link";
import { createSession } from "@/lib/auth/session";

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { token } = await params;

  // Get base URL for redirect
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // Validate token is present and has minimum length (base64url encoded 32 bytes = 43 chars)
  if (!token || token.length < 32) {
    return NextResponse.redirect(new URL("/signin?error=invalid_link", baseUrl));
  }

  // Verify the token
  const result = await verifyMagicLink(token);

  if (result.success && result.userId && result.sessionVersion !== undefined) {
    // Create a redirect response
    const response = NextResponse.redirect(new URL("/", baseUrl));

    // Create session cookie
    await createSession(result.userId, response, result.sessionVersion);

    return response;
  }

  // Handle specific error cases by redirecting to signin with error parameter
  const errorParam = result.error || "invalid_link";
  return NextResponse.redirect(new URL(`/signin?error=${errorParam}`, baseUrl));
}
