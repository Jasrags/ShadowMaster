import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getUserCharacters } from "@/lib/storage/characters";

/**
 * GET: Generate a structured JSON export of all user data and characters.
 * Satisfies Requirement 4.1 for data portability.
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

    const characters = await getUserCharacters(userId);

    // Filter sensitive info from user record
    const safeUser = JSON.parse(JSON.stringify(user));
    delete safeUser.passwordHash;

    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      user: safeUser,
      characters: characters,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="shadow-master-export-${userId}.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
