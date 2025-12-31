/**
 * Character Stability Shield API
 *
 * Returns the stability shield status for a character.
 *
 * GET /api/characters/[characterId]/sync/shield
 *   Returns shield status for UI display
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacterById } from "@/lib/storage/characters";
import { getLegalityShield } from "@/lib/rules/sync/legality-validator";
import { SnapshotCache } from "@/lib/storage/snapshot-cache";

interface RouteParams {
  params: Promise<{
    characterId: string;
  }>;
}

/**
 * GET /api/characters/[characterId]/sync/shield
 *
 * Returns the stability shield status for UI display
 */
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Verify session
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { characterId } = await params;

    // Get character
    const character = await getCharacterById(characterId);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Create request-scoped cache to avoid redundant disk reads
    const cache = new SnapshotCache();

    // Get shield status
    const shield = await getLegalityShield(character, cache);

    return NextResponse.json(shield);
  } catch (error) {
    console.error("Error getting shield status:", error);
    return NextResponse.json(
      { error: "Failed to get shield status" },
      { status: 500 }
    );
  }
}
