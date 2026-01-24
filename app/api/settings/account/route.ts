import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateUser, getUserById, getUserByEmail, getUserByUsername } from "@/lib/storage/users";
import { AuditLogger } from "@/lib/security/audit-logger";
import { sendEmailChangedEmail } from "@/lib/email/security-alerts";

// PUT: Update user account (email/username)
// DELETE: Delete user account
export async function PUT(request: NextRequest) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();
    const { email, username } = updates;

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validation
    if (email && email !== user.email) {
      const existingEmail = await getUserByEmail(email);
      if (existingEmail && existingEmail.id !== userId) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }

    if (username && username !== user.username) {
      const existingUsername = await getUserByUsername(username);
      if (existingUsername && existingUsername.id !== userId) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
    }

    // Capture old email before update
    const oldEmail = user.email;
    const emailChanged = email && email !== oldEmail;

    const updatedUser = await updateUser(userId, {
      ...(email && { email }),
      ...(username && { username }),
    });

    // If email changed, log and send notification to OLD email address
    if (emailChanged) {
      const ip = request.headers.get("x-forwarded-for") || "unknown";
      await AuditLogger.log({
        event: "email.change",
        userId,
        email: oldEmail,
        ip,
        metadata: { newEmail: email },
      });

      // Send notification to old email (fire-and-forget)
      const baseUrl =
        request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      sendEmailChangedEmail(userId, oldEmail, user.username, email, new Date(), baseUrl).catch(
        (err) => console.error("Failed to send email changed notification:", err)
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _unused, ...safeUser } = updatedUser;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Failed to update account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { deleteUser } = await import("@/lib/storage/users");
    // Also need to implement logout/cleanup logic typically, but for now just delete the user record.
    // Ideally we should also delete the session cookie.

    await deleteUser(userId);

    const response = NextResponse.json({ success: true });
    // Clear session cookie
    response.cookies.delete("session");

    return response;
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
