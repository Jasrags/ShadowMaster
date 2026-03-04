/**
 * API Route: /api/characters/[characterId]/loadouts/[loadoutId]/apply
 *
 * POST - Apply a loadout to the character's gear
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import { applyLoadout } from "@/lib/rules/inventory/loadout-manager";

// =============================================================================
// POST - Apply loadout
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; loadoutId: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId, loadoutId } = await params;

    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "edit");
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    // Check loadout exists
    const loadout = (character.loadouts || []).find((l) => l.id === loadoutId);
    if (!loadout) {
      return NextResponse.json({ success: false, error: "Loadout not found" }, { status: 404 });
    }

    const result = applyLoadout(character, loadoutId);

    // Always persist if we got a character back (partial apply with errors possible)
    if (result.character) {
      await updateCharacter(userId, characterId, {
        gear: result.character.gear,
        weapons: result.character.weapons,
        armor: result.character.armor,
        activeLoadoutId: result.character.activeLoadoutId,
      });
    }

    return NextResponse.json({
      success: result.success,
      diff: result.diff,
      activeLoadoutId: loadoutId,
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    console.error("Failed to apply loadout:", error);
    return NextResponse.json({ success: false, error: "Failed to apply loadout" }, { status: 500 });
  }
}
