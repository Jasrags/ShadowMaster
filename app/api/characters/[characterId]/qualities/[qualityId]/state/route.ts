/**
 * API Route: /api/characters/[characterId]/qualities/[qualityId]/state
 *
 * PATCH - Update the dynamic state of a quality (e.g., addiction doses, allergy exposure)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateQualityDynamicState } from "@/lib/storage/characters";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; qualityId: string }> }
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

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { characterId, qualityId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Parse body for state updates
    const data = await request.json();
    const updates = data.updates || data; // Flexible: handle both {updates: {...}} and {...}

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid updates format" },
        { status: 400 }
      );
    }

    // Update quality dynamic state
    try {
      const updatedCharacter = await updateQualityDynamicState(
        userId,
        characterId,
        qualityId,
        updates
      );

      return NextResponse.json({
        success: true,
        character: updatedCharacter,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update quality state";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to update quality state:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update quality state";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
