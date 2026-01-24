/**
 * POST /api/auth/reset-password/validate
 *
 * Validate a password reset token without consuming it.
 * Used to check if a token is valid before showing the reset form.
 */

import { NextRequest, NextResponse } from "next/server";
import { validateResetToken } from "@/lib/auth/password-reset";

interface ValidateRequest {
  token: string;
}

interface ValidateResponse {
  valid: boolean;
  reason?: "expired" | "invalid";
}

export async function POST(request: NextRequest): Promise<NextResponse<ValidateResponse>> {
  try {
    // Parse request body
    let body: ValidateRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ valid: false, reason: "invalid" }, { status: 400 });
    }

    const { token } = body;

    // Validate token is provided
    if (!token || typeof token !== "string") {
      return NextResponse.json({ valid: false, reason: "invalid" }, { status: 400 });
    }

    // Validate the token
    const result = await validateResetToken(token);

    return NextResponse.json({
      valid: result.valid,
      reason: result.reason,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json({ valid: false, reason: "invalid" }, { status: 500 });
  }
}
