/**
 * API Route: /api/characters/[characterId]/rigging/drones
 *
 * GET - Get owned drones with their details
 *
 * Returns list of character's drones with installed autosofts.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import type { CharacterDrone } from "@/lib/types/character";

// =============================================================================
// Response Types
// =============================================================================

interface DroneListResponse {
  drones: CharacterDrone[];
  count: number;
}

// =============================================================================
// GET - Get Drones
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<DroneListResponse | { error: string }>> {
  try {
    const { characterId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to view this character" },
        { status: 403 }
      );
    }

    const drones = character.drones ?? [];

    return NextResponse.json({
      drones,
      count: drones.length,
    });
  } catch (error) {
    console.error("Failed to get drones:", error);
    return NextResponse.json(
      { error: "Failed to get drones" },
      { status: 500 }
    );
  }
}
