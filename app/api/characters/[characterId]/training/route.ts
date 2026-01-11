/**
 * API Route: /api/characters/[characterId]/training
 *
 * GET - Get active and completed training periods for a character
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { getActiveTraining, getCompletedTraining } from "@/lib/rules/advancement/completion";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
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

    const { characterId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Get active and completed training
    const activeTraining = getActiveTraining(character);
    const completedTraining = getCompletedTraining(character);

    return NextResponse.json({
      success: true,
      activeTraining,
      completedTraining,
    });
  } catch (error) {
    console.error("Failed to get training:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to get training";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
