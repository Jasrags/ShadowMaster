import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, toPublicUser } from "@/lib/auth/middleware";
import { getUserById, resetFailedAttempts } from "@/lib/storage/users";
import { createUserAuditEntry } from "@/lib/storage/user-audit";
import type { PublicUser } from "@/lib/types/user";

interface UnlockUserResponse {
  success: boolean;
  user?: PublicUser;
  error?: string;
}

/**
 * DELETE /api/users/[id]/lockout
 * Clear a user's login lockout (admin only)
 *
 * This clears the temporary lockout caused by failed login attempts.
 * It does NOT change the accountStatus (that's what suspend/reactivate are for).
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UnlockUserResponse>> {
  try {
    // Require administrator role and get admin user
    const adminUser = await requireAdmin();

    const { id } = await params;

    // Validate user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Check if user is actually locked out
    const isLockedOut =
      existingUser.lockoutUntil && new Date(existingUser.lockoutUntil) > new Date();

    if (!isLockedOut) {
      // User is not locked out, return success gracefully
      return NextResponse.json({
        success: true,
        user: toPublicUser(existingUser),
      });
    }

    // Clear the lockout
    const updatedUser = await resetFailedAttempts(id);

    // Create audit entry
    await createUserAuditEntry({
      action: "user_lockout_admin_cleared",
      actor: { userId: adminUser.id, role: "admin" },
      targetUserId: id,
      details: {
        previousValue: {
          lockoutUntil: existingUser.lockoutUntil,
          failedLoginAttempts: existingUser.failedLoginAttempts,
        },
        reason: "Admin manually cleared lockout",
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

    console.error("Unlock user error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while unlocking user" },
      { status: 500 }
    );
  }
}
