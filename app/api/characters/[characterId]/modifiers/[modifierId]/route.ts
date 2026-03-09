/**
 * API Route: /api/characters/[characterId]/modifiers/[modifierId]
 *
 * DELETE - Remove an active modifier
 *
 * @see Issue #114
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCharacterWithAudit } from "@/lib/storage/characters";
import { resolveCharacterForGameplay, notifyOwnerOfGMEdit } from "@/lib/auth/gm-character-access";

// =============================================================================
// TYPES
// =============================================================================

interface RemoveModifierResponse {
  success: boolean;
  error?: string;
}

// =============================================================================
// ROUTE HANDLERS
// =============================================================================

/**
 * DELETE - Remove an active modifier from a character
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; modifierId: string }> }
): Promise<NextResponse<RemoveModifierResponse>> {
  try {
    const { characterId, modifierId } = await params;

    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Resolve character with GM cross-user support
    const resolution = await resolveCharacterForGameplay(userId, characterId, "gameplay_edit");
    if (!resolution.authorized) {
      return NextResponse.json(
        { success: false, error: resolution.error },
        { status: resolution.status }
      );
    }

    const { character, ownerId, actorRole, campaign, isGMAccess } = resolution;

    const existing = character.activeModifiers ?? [];
    const modifier = existing.find((m) => m.id === modifierId);
    if (!modifier) {
      return NextResponse.json({ success: false, error: "Modifier not found" }, { status: 404 });
    }

    const updated = existing.filter((m) => m.id !== modifierId);

    await updateCharacterWithAudit(
      ownerId,
      characterId,
      { activeModifiers: updated },
      {
        action: "modifier_removed",
        actor: { userId, role: actorRole },
        details: {
          modifierId: modifier.id,
          modifierName: modifier.name,
          source: modifier.source,
          effectType: modifier.effect.type,
        },
        note: `Removed modifier: ${modifier.name}`,
      }
    );

    // Notify owner if GM made the edit
    if (isGMAccess && campaign) {
      await notifyOwnerOfGMEdit(character, campaign, userId, `modifier removed: ${modifier.name}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove modifier:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove modifier" },
      { status: 500 }
    );
  }
}
