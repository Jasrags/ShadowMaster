import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import type { AuthResponse } from "@/lib/types/user";

export async function GET(): Promise<NextResponse<AuthResponse>> {
  try {
    const userId = await getSession();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        characters: user.characters,
        failedLoginAttempts: user.failedLoginAttempts,
        lockoutUntil: user.lockoutUntil,
        sessionVersion: user.sessionVersion,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

