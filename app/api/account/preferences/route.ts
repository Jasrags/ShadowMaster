import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById, updateUser } from "@/lib/storage/users";
import { UserSettings } from "@/lib/types/user";

/**
 * GET: Fetch current user preferences
 */
export async function GET() {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, preferences: user.preferences });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH: Update user preferences
 */
export async function PATCH(req: NextRequest) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { preferences } = await req.json();
    if (!preferences) {
      return NextResponse.json({ success: false, error: "Missing preferences" }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Merge preferences
    const updatedPreferences: UserSettings = {
      ...user.preferences,
      ...preferences,
    };

    await updateUser(userId, { preferences: updatedPreferences });

    return NextResponse.json({ success: true, preferences: updatedPreferences });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
