/**
 * API Route: /api/characters/[characterId]/advancement/attributes
 *
 * POST - Advance a character attribute (costs karma, requires training)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateCharacter } from "@/lib/storage/characters";
import { getCampaignById, getCampaignEvents } from "@/lib/storage/campaigns";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { advanceAttribute, type AdvanceAttributeOptions } from "@/lib/rules/advancement/attributes";

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
        { success: false, error: "Cannot advance attributes during character creation" },
        { status: 400 }
      );
    }

    // Parse body
    const body = await request.json();
    const {
      attributeId,
      newRating,
      downtimePeriodId,
      campaignSessionId,
      gmApproved,
      instructorBonus,
      timeModifier,
      notes,
    } = body;

    if (!attributeId || typeof attributeId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid attributeId" },
        { status: 400 }
      );
    }

    if (typeof newRating !== "number" || newRating < 1) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid newRating (must be >= 1)" },
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

    // Load campaign events if character is in a campaign and downtime period is specified
    let campaignEvents;
    if (character.campaignId && downtimePeriodId) {
      try {
        campaignEvents = await getCampaignEvents(character.campaignId);
      } catch (error) {
        // Campaign events not found - continue without downtime validation
        console.warn("Failed to load campaign events:", error);
      }
    }

    // Prepare options
    const options: AdvanceAttributeOptions = {
      downtimePeriodId,
      campaignSessionId,
      gmApproved,
      instructorBonus,
      timeModifier,
      notes,
      campaignEvents,
    };

    // Advance attribute
    try {
      const result = advanceAttribute(
        character,
        attributeId,
        newRating,
        mergeResult.ruleset,
        options
      );

      // Update character with advancement record and training period
      const updatedCharacter = await updateCharacter(userId, characterId, {
        karmaCurrent: result.updatedCharacter.karmaCurrent,
        advancementHistory: result.updatedCharacter.advancementHistory,
        activeTraining: result.updatedCharacter.activeTraining,
        // Note: attribute value is NOT updated yet - that happens when training completes
      });

      return NextResponse.json({
        success: true,
        character: updatedCharacter,
        advancementRecord: result.advancementRecord,
        trainingPeriod: result.trainingPeriod,
        cost: result.advancementRecord.karmaCost,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to advance attribute";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to advance attribute:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to advance attribute";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

