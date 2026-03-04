/**
 * API Route: /api/characters/[characterId]/loadouts/[loadoutId]
 *
 * PATCH  - Update a loadout
 * DELETE - Delete a loadout
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import { updateLoadout, deleteLoadout } from "@/lib/rules/inventory/loadout-manager";

// =============================================================================
// PATCH - Update loadout
// =============================================================================

export async function PATCH(
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

    const body = await request.json();
    const { name, description, icon, gearAssignments, defaultReadiness } = body;

    if (!name && description === undefined && !icon && !gearAssignments && !defaultReadiness) {
      return NextResponse.json(
        { success: false, error: "At least one field to update is required" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (icon) updates.icon = icon;
    if (gearAssignments) updates.gearAssignments = gearAssignments;
    if (defaultReadiness) updates.defaultReadiness = defaultReadiness;

    const updated = updateLoadout(character, loadoutId, updates);
    const updatedLoadout = (updated.loadouts || []).find((l) => l.id === loadoutId);

    await updateCharacter(userId, characterId, { loadouts: updated.loadouts });

    return NextResponse.json({
      success: true,
      loadout: updatedLoadout,
    });
  } catch (error) {
    console.error("Failed to update loadout:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update loadout" },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Delete loadout
// =============================================================================

export async function DELETE(
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

    const updated = deleteLoadout(character, loadoutId);

    await updateCharacter(userId, characterId, {
      loadouts: updated.loadouts,
      activeLoadoutId: updated.activeLoadoutId,
    });

    return NextResponse.json({
      success: true,
      deletedLoadoutId: loadoutId,
    });
  } catch (error) {
    console.error("Failed to delete loadout:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete loadout" },
      { status: 500 }
    );
  }
}
