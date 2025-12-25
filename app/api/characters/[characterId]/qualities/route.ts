/**
 * API Route: /api/characters/[characterId]/qualities
 *
 * POST - Acquire a new quality post-creation (costs 2× karma)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { acquireQuality, type AcquireQualityOptions } from "@/lib/rules/qualities/advancement";

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

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { characterId } = await params;

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
        { success: false, error: "Cannot acquire qualities during character creation" },
        { status: 400 }
      );
    }

    // Parse body
    const body = await request.json();
    const {
      qualityId,
      rating,
      specification,
      specificationId,
      variant,
      notes,
      gmApproved,
      acquisitionDate,
    } = body;

    if (!qualityId || typeof qualityId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid qualityId" },
        { status: 400 }
      );
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

    // Prepare options
    const options: AcquireQualityOptions = {
      rating,
      specification,
      specificationId,
      variant,
      notes,
      gmApproved,
      acquisitionDate,
    };

    // Acquire quality
    try {
      const result = acquireQuality(character, qualityId, mergeResult.ruleset, options);

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
          actor: { userId, role: "owner" }, // Simplified role for now
          details: {
            qualityId,
            action: "acquire_quality",
            cost: result.cost,
          },
          note: notes,
        }
      );

      return NextResponse.json({
        success: true,
        character: updatedCharacter,
        quality: result.selection,
        advancementRecord: result.advancementRecord,
        cost: result.cost,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to acquire quality";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to acquire quality:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to acquire quality";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

