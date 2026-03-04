/**
 * API Route: /api/characters/[characterId]/loadouts
 *
 * GET  - List all loadouts
 * POST - Create a new loadout
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import { createLoadout, type CreateLoadoutConfig } from "@/lib/rules/inventory/loadout-manager";

// =============================================================================
// GET - List loadouts
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "view");
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    return NextResponse.json({
      success: true,
      loadouts: character.loadouts || [],
      activeLoadoutId: character.activeLoadoutId,
    });
  } catch (error) {
    console.error("Failed to list loadouts:", error);
    return NextResponse.json({ success: false, error: "Failed to list loadouts" }, { status: 500 });
  }
}

// =============================================================================
// POST - Create loadout
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "edit");
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    const body: CreateLoadoutConfig = await request.json();

    if (!body.name || !body.defaultReadiness) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, defaultReadiness" },
        { status: 400 }
      );
    }

    const result = createLoadout(character, body);

    await updateCharacter(userId, characterId, {
      loadouts: result.character.loadouts,
    });

    return NextResponse.json({ success: true, loadout: result.loadout }, { status: 201 });
  } catch (error) {
    console.error("Failed to create loadout:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create loadout" },
      { status: 500 }
    );
  }
}
