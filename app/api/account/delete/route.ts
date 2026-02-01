import { NextRequest, NextResponse } from "next/server";
import { getSession, clearSession } from "@/lib/auth/session";
import { getUserById, deleteUser } from "@/lib/storage/users";
import { verifyCredentials } from "@/lib/auth/password";

/**
 * POST: Explicitly confirmed account deletion protocol.
 * Results in the atomic removal of the user record and all orphaned character data.
 * Satisfies Requirement 4.3.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { password } = await req.json();

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Verify password using timing-safe verification
    // verifyCredentials ALWAYS runs bcrypt first, satisfying CodeQL
    const { valid, error } = await verifyCredentials(password, user.passwordHash);
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }
    if (!valid) {
      return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
    }

    // Perform deletion (this also cleans up characters via storage layer logic)
    await deleteUser(userId);

    // Clear session
    const response = NextResponse.json({ success: true });
    clearSession(response);

    return response;
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
