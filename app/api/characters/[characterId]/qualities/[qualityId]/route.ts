/**
 * API Route: /api/characters/[characterId]/qualities/[qualityId]
 *
 * DELETE - Buy off a negative quality (costs 2× original karma bonus)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { removeQuality } from "@/lib/rules/qualities/advancement";

export async function DELETE(
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

    // Character must be active (not draft)
    if (character.status === "draft") {
      return NextResponse.json(
        { success: false, error: "Cannot buy off qualities during character creation" },
        { status: 400 }
      );
    }

    // Parse body for optional reason
    let reason: string | undefined;
    try {
      const body = await request.json().catch(() => ({}));
      reason = body.reason;
    } catch {
      // Body is optional
    }

    // Load ruleset for character's edition
    const mergeResult = await loadAndMergeRuleset(
      character.editionCode,
      character.attachedBookIds
    );

    if (!mergeResult.success || !mergeResult.ruleset) {
      return NextResponse.json(
        { success: false, error: mergeResult.error || "Failed to load ruleset" },
        { status: 500 }
      );
    }

    // Remove quality (buy off)
    try {
      const result = removeQuality(character, qualityId, mergeResult.ruleset, reason);

      // Update character with audit trail
      const updatedCharacter = await updateCharacterWithAudit(
        userId,
        characterId,
        {
          positiveQualities: result.updatedCharacter.positiveQualities,
          negativeQualities: result.updatedCharacter.negativeQualities,
          karmaCurrent: result.updatedCharacter.karmaCurrent,
          advancementHistory: result.updatedCharacter.advancementHistory,
        },
        {
          action: "updated",
          actor: { userId, role: "owner" },
          details: {
            qualityId,
            action: "remove_quality",
            cost: result.cost,
          },
          note: reason,
        }
      );

      return NextResponse.json({
        success: true,
        character: updatedCharacter,
        advancementRecord: result.advancementRecord,
        cost: result.cost,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to buy off quality";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to buy off quality:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to buy off quality";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

