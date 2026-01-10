import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { toPublicUser } from "@/lib/auth/middleware";
import type { AuthResponse } from "@/lib/types/user";

export async function GET(): Promise<NextResponse<AuthResponse>> {
  try {
    const userId = await getSession();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
