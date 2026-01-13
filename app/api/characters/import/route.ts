/**
 * API Route: /api/characters/import
 *
 * POST - Import a character from JSON
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { importCharacter } from "@/lib/storage/characters";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Parse body
    const body = await request.json();
    const { character } = body;

    if (!character) {
      return NextResponse.json(
        { success: false, error: "Missing character data" },
        { status: 400 }
      );
    }

    // Validations
    if (!character.editionCode) {
      return NextResponse.json(
        { success: false, error: "Invalid character: missing edition code" },
        { status: 400 }
      );
    }

    // Import character
    const newCharacter = await importCharacter(user.id, character);

    return NextResponse.json(
      {
        success: true,
        character: newCharacter,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to import character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import character" },
      { status: 500 }
    );
  }
}
