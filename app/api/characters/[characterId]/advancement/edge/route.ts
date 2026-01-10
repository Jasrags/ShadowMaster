/**
 * API Route: /api/characters/[characterId]/advancement/edge
 *
 * POST - Advance character Edge (costs karma, no training time required)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { advanceEdge, type AdvanceEdgeOptions } from "@/lib/rules/advancement/edge";
import { requiresGMApproval } from "@/lib/rules/advancement/approval";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { characterId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Character must be active (not draft)
    if (character.status === "draft") {
      return NextResponse.json(
        { success: false, error: "Cannot advance Edge during character creation" },
        { status: 400 }
      );
    }

    // Parse body
    const body = await request.json();
    const { newRating, campaignSessionId, gmApproved, notes } = body;

    if (typeof newRating !== "number" || newRating < 1) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid newRating (must be >= 1)" },
        { status: 400 }
      );
    }

    // Load ruleset for character's edition
    const mergeResult = await loadAndMergeRuleset(character.editionCode, character.attachedBookIds);

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

    // Enforce GM approval requirement for campaign characters
    const needsApproval = requiresGMApproval(character, campaign?.advancementSettings);
    if (needsApproval && gmApproved) {
      // Players cannot self-approve - only GM can approve via approval endpoint
      return NextResponse.json(
        {
          success: false,
          error:
            "GM approval is required for campaign characters. Please request approval from your GM.",
        },
        { status: 403 }
      );
    }

    // Prepare options (gmApproved will be false for campaign characters)
    const options: AdvanceEdgeOptions = {
      campaignSessionId,
      gmApproved: needsApproval ? false : gmApproved, // Force false if approval required
      notes,
      settings: campaign?.advancementSettings,
    };

    // Advance Edge
    try {
      const result = advanceEdge(character, newRating, mergeResult.ruleset, options);

      // Persist the fully updated character state from the ledger
      const { saveCharacter } = await import("@/lib/storage/characters");
      const updatedCharacter = await saveCharacter(result.updatedCharacter);

      return NextResponse.json({
        success: true,
        character: updatedCharacter,
        advancementRecord: result.advancementRecord,
        cost: result.advancementRecord.karmaCost,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to advance Edge";
      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to advance Edge:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to advance Edge";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
