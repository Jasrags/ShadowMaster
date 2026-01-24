/**
 * POST /api/auth/reset-password
 *
 * Reset a user's password using a valid reset token.
 * Validates the token and password strength, then updates the password.
 * Invalidates all existing sessions after successful reset.
 */

import { NextRequest, NextResponse } from "next/server";
import { resetPassword } from "@/lib/auth/password-reset";
import { isStrongPassword, getPasswordStrengthError } from "@/lib/auth/validation";

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface ResetPasswordResponse {
  success: boolean;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ResetPasswordResponse>> {
  try {
    // Parse request body
    let body: ResetPasswordRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
    }

    const { token, password } = body;

    // Validate token is provided
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Reset token is required" },
        { status: 400 }
      );
    }

    // Validate password is provided
    if (!password || typeof password !== "string") {
      return NextResponse.json({ success: false, error: "Password is required" }, { status: 400 });
    }

    // Check password strength
    if (!isStrongPassword(password)) {
      const strengthError = getPasswordStrengthError(password);
      return NextResponse.json(
        { success: false, error: strengthError || "Password does not meet strength requirements" },
        { status: 400 }
      );
    }

    // Attempt to reset the password
    const result = await resetPassword(token, password);

    if (result.success) {
      return NextResponse.json({
        success: true,
      });
    }

    // Map error codes to user-friendly messages
    let errorMessage: string;
    let statusCode: number;

    switch (result.error) {
      case "expired_token":
        errorMessage = "This password reset link has expired. Please request a new one.";
        statusCode = 400;
        break;
      case "invalid_token":
        errorMessage = "This password reset link is invalid or has already been used.";
        statusCode = 400;
        break;
      case "user_not_found":
        errorMessage = "Unable to reset password. Please try again.";
        statusCode = 400;
        break;
      default:
        errorMessage = "An error occurred while resetting your password. Please try again.";
        statusCode = 500;
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: statusCode });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while resetting your password" },
      { status: 500 }
    );
  }
}
