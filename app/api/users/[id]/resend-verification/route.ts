import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { getUserById } from "@/lib/storage/users";
import { sendVerificationEmail } from "@/lib/auth/email-verification";
import { createUserAuditEntry } from "@/lib/storage/user-audit";
import { RateLimiter } from "@/lib/security/rate-limit";

interface ResendVerificationResponse {
  success: boolean;
  error?: string;
}

// Rate limiter: 3 requests per hour per target email
const resendVerificationLimiter = RateLimiter.get("admin-resend-verification", {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
});

/**
 * POST /api/users/[id]/resend-verification
 * Resend email verification for a user (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ResendVerificationResponse>> {
  try {
    // Require administrator role and get admin user
    const adminUser = await requireAdmin();

    const { id } = await params;

    // Validate user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Check if email is already verified
    if (existingUser.emailVerified) {
      return NextResponse.json(
        { success: false, error: "User email is already verified" },
        { status: 400 }
      );
    }

    // Rate limit check (by target email)
    if (resendVerificationLimiter.isRateLimited(existingUser.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many verification emails sent. Please wait before trying again.",
        },
        { status: 429 }
      );
    }

    // Get base URL for verification link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Send verification email
    const result = await sendVerificationEmail(
      existingUser.id,
      existingUser.email,
      existingUser.username,
      baseUrl
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send verification email" },
        { status: 500 }
      );
    }

    // Create audit entry
    await createUserAuditEntry({
      action: "user_verification_admin_resent",
      actor: { userId: adminUser.id, role: "admin" },
      targetUserId: id,
      details: {
        targetEmail: existingUser.email,
        reason: "Admin triggered verification email resend",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";

    // Check if it's an authentication/authorization error
    if (
      errorMessage === "Authentication required" ||
      errorMessage === "Administrator access required"
    ) {
      return NextResponse.json({ success: false, error: errorMessage }, { status: 403 });
    }

    console.error("Resend verification error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while resending verification email" },
      { status: 500 }
    );
  }
}
