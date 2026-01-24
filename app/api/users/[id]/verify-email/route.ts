import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, toPublicUser } from "@/lib/auth/middleware";
import { getUserById, markEmailVerified } from "@/lib/storage/users";
import { createUserAuditEntry } from "@/lib/storage/user-audit";
import type { PublicUser } from "@/lib/types/user";

interface VerifyEmailResponse {
  success: boolean;
  user?: PublicUser;
  error?: string;
}

/**
 * POST /api/users/[id]/verify-email
 * Manually mark a user's email as verified (admin only)
 *
 * This bypasses the normal verification flow. Use with caution.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<VerifyEmailResponse>> {
  try {
    // Require administrator role and get admin user
    const adminUser = await requireAdmin();

    const { id } = await params;

    // Validate user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Check if email is already verified (return success gracefully)
    if (existingUser.emailVerified) {
      return NextResponse.json({
        success: true,
        user: toPublicUser(existingUser),
      });
    }

    // Mark email as verified
    const updatedUser = await markEmailVerified(id);

    // Create audit entry
    await createUserAuditEntry({
      action: "user_email_admin_verified",
      actor: { userId: adminUser.id, role: "admin" },
      targetUserId: id,
      details: {
        targetEmail: existingUser.email,
        reason: "Admin manually verified email",
      },
    });

    return NextResponse.json({
      success: true,
      user: toPublicUser(updatedUser),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";

    // Check if it's an authentication/authorization error
    if (
      errorMessage === "Authentication required" ||
      errorMessage === "Administrator access required"
    ) {
      return NextResponse.json({ success: false, error: errorMessage }, { status: 403 });
    }

    console.error("Manual verify email error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while verifying user email" },
      { status: 500 }
    );
  }
}
