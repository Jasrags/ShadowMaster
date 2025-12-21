/**
 * API Route: /api/characters/[characterId]/advancement/skills
 *
 * POST - Advance a character skill (costs karma, requires training)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, addAdvancementRecord } from "@/lib/storage/characters";
import { getCampaignEvents } from "@/lib/storage/campaigns";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { advanceSkill, type AdvanceSkillOptions } from "@/lib/rules/advancement/skills";

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
        { success: false, error: "Cannot advance skills during character creation" },
        { status: 400 }
      );
    }

    // Parse body
    const body = await request.json();
    const {
      skillId,
      newRating,
      downtimePeriodId,
      campaignSessionId,
      gmApproved,
      instructorBonus,
      timeModifier,
      notes,
    } = body;

    if (!skillId || typeof skillId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid skillId" },
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
    const options: AdvanceSkillOptions = {
      downtimePeriodId,
      campaignSessionId,
      gmApproved,
      instructorBonus,
      timeModifier,
      notes,
      campaignEvents,
    };

    // Advance skill
    try {
      const result = advanceSkill(
        character,
        skillId,
        newRating,
        mergeResult.ruleset,
        options
      );

      // Persist advancement record and training period using storage helper
      const updatedCharacter = await addAdvancementRecord(
        userId,
        characterId,
        result.advancementRecord,
        result.trainingPeriod,
        result.advancementRecord.karmaCost
      );

      return NextResponse.json({
        success: true,
        character: updatedCharacter,
        advancementRecord: result.advancementRecord,
        trainingPeriod: result.trainingPeriod,
        cost: result.advancementRecord.karmaCost,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to advance skill";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to advance skill:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to advance skill";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

