import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById, updateUser, incrementSessionVersion } from "@/lib/storage/users";
import { verifyCredentials, hashPassword } from "@/lib/auth/password";
import { isStrongPassword, getPasswordStrengthError } from "@/lib/auth/validation";
import { sendPasswordChangedEmail } from "@/lib/email/security-alerts";

/**
 * POST: Secure password transition requiring current password verification
 * Aligned with ADR-001 for atomic session revocation.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    // Validate new password is provided (currentPassword validated by verifyCredentials)
    if (!newPassword) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Verify current password using timing-safe verification
    // verifyCredentials ALWAYS runs bcrypt first, satisfying CodeQL
    const { valid, error } = await verifyCredentials(currentPassword, user.passwordHash);
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Incorrect current password" },
        { status: 401 }
      );
    }

    // Validate new password strength (defense-in-depth)
    if (!isStrongPassword(newPassword)) {
      const errorMessage = getPasswordStrengthError(newPassword);
      return NextResponse.json(
        { success: false, error: errorMessage || "Password does not meet strength requirements" },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password and increment session version to invalidate other sessions (ADR-001)
    await updateUser(userId, { passwordHash: newPasswordHash });
    await incrementSessionVersion(userId);

    // Send password changed notification email (fire-and-forget)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    sendPasswordChangedEmail(user.id, user.email, user.username, new Date(), baseUrl).catch((err) =>
      console.error("Failed to send password changed email:", err)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
