/**
 * API Route: /api/characters/[characterId]/finalize
 * 
 * POST - Finalize a character draft (change status from draft to active)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, finalizeCharacter } from "@/lib/storage/characters";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { characterId } = await params;

    // Check character exists and belongs to user
    const existing = await getCharacter(userId, characterId);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Check character is a draft
    if (existing.status !== "draft") {
      return NextResponse.json(
        { success: false, error: "Character is not a draft" },
        { status: 400 }
      );
    }

    // Finalize character
    const character = await finalizeCharacter(userId, characterId);

    return NextResponse.json({
      success: true,
      character,
    });
  } catch (error) {
    console.error("Failed to finalize character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to finalize character" },
      { status: 500 }
    );
  }
}

