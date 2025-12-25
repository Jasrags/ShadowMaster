/**
 * API Route: /api/characters/[characterId]/advancement/specializations
 *
 * POST - Learn a skill specialization (costs karma, requires training)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { getCampaignEvents, getCampaignById } from "@/lib/storage/campaigns";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { advanceSpecialization, type AdvanceSpecializationOptions } from "@/lib/rules/advancement/specializations";
import { requiresGMApproval } from "@/lib/rules/advancement/approval";

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
        { success: false, error: "Cannot learn specializations during character creation" },
        { status: 400 }
      );
    }

    // Parse body
    const body = await request.json();
    const {
      skillId,
      specializationName,
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

    if (!specializationName || typeof specializationName !== "string" || !specializationName.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid specializationName" },
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

    // Load campaign and settings if character is in a campaign
    let campaign;
    if (character.campaignId) {
      try {
        campaign = await getCampaignById(character.campaignId);
      } catch (error) {
        console.warn("Failed to load campaign for settings:", error);
      }
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

    // Enforce GM approval requirement for campaign characters
    const needsApproval = requiresGMApproval(character, campaign?.advancementSettings);
    if (needsApproval && gmApproved) {
      // Players cannot self-approve - only GM can approve via approval endpoint
      return NextResponse.json(
        { success: false, error: "GM approval is required for campaign characters. Please request approval from your GM." },
        { status: 403 }
      );
    }

    // Prepare options (gmApproved will be false for campaign characters)
    const options: AdvanceSpecializationOptions = {
      downtimePeriodId,
      campaignSessionId,
      gmApproved: needsApproval ? false : gmApproved, // Force false if approval required
      instructorBonus,
      timeModifier,
      notes,
      campaignEvents,
      settings: campaign?.advancementSettings,
    };

    // Advance specialization
    try {
      const result = advanceSpecialization(
        character,
        skillId,
        specializationName.trim(),
        mergeResult.ruleset,
        options
      );

      // Persist the fully updated character state from the ledger
      const { saveCharacter } = await import("@/lib/storage/characters");
      const updatedCharacter = await saveCharacter(result.updatedCharacter);

      return NextResponse.json({
        success: true,
        character: updatedCharacter,
        advancementRecord: result.advancementRecord,
        trainingPeriod: result.trainingPeriod,
        cost: result.advancementRecord.karmaCost,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to learn specialization";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to learn specialization:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to learn specialization";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

