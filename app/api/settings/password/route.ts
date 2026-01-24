import { NextRequest, NextResponse } from "next/server";
import { getSession, clearSession } from "@/lib/auth/session";
import { getUserById, updateUser, incrementSessionVersion } from "@/lib/storage/users";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { AuditLogger } from "@/lib/security/audit-logger";
import { sendPasswordChangedEmail } from "@/lib/email/security-alerts";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      await AuditLogger.log({
        event: "signin.failure",
        userId,
        ip,
        metadata: { context: "password_change", reason: "invalid_current_password" },
      });
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    // Update password and increment session version to revoke all existing sessions
    const hashedPassword = await hashPassword(newPassword);
    await updateUser(userId, { passwordHash: hashedPassword });
    await incrementSessionVersion(userId);

    await AuditLogger.log({ event: "password.change", userId, ip });

    // Send password changed notification email (fire-and-forget)
    const baseUrl =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    sendPasswordChangedEmail(userId, user.email, user.username, new Date(), baseUrl).catch((err) =>
      console.error("Failed to send password changed email:", err)
    );

    const response = NextResponse.json({ success: true });

    // Optional: clear the current session so the user must re-login
    clearSession(response);

    return response;
  } catch (error) {
    console.error("Failed to change password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
