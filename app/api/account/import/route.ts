import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { importCharacter } from "@/lib/storage/characters";
import { updateUser } from "@/lib/storage/users";
import { UserSettings } from "@/lib/types/user";

/**
 * POST: Import user data and characters from a JSON file.
 * Satisfies Requirement 4.2 for data portability.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    if (!data || !data.user || !Array.isArray(data.characters)) {
      return NextResponse.json({ success: false, error: "Invalid import format" }, { status: 400 });
    }

    // 1. Update user preferences if present
    if (data.user.preferences) {
      await updateUser(userId, { preferences: data.user.preferences as UserSettings });
    }

    // 2. Import characters
    const importedCharacters = [];
    for (const charData of data.characters) {
      try {
        const imported = await importCharacter(userId, charData);
        importedCharacters.push(imported.id);
      } catch (err) {
        console.error("Failed to import character:", err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: importedCharacters.length,
      message: `Successfully imported ${importedCharacters.length} characters.`
    });
  } catch (error) {
    console.error("Error importing data:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
