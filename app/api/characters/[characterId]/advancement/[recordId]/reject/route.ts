/**
 * API Route: /api/characters/[characterId]/advancement/[recordId]/reject
 *
 * POST - Reject an advancement record (GM only)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";
import { rejectAdvancement, isCampaignGM, requiresGMApproval } from "@/lib/rules/advancement/approval";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; recordId: string }> }
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

    const { characterId, recordId } = await params;

    // Parse body for rejection reason
    let reason: string;
    try {
      const body = await request.json();
      reason = body.reason;
      if (!reason || reason.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "Rejection reason is mandatory" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Rejection reason is mandatory" },
        { status: 400 }
      );
    }

    // Get character (allow GM to access any character in their campaign)
    const character = await getCharacter(userId, characterId);
    if (!character) {
      // If not found as owner, try to get by ID (for GM access)
      const { getCharacterById } = await import("@/lib/storage/characters");
      const characterById = await getCharacterById(characterId);
      if (!characterById) {
        return NextResponse.json(
          { success: false, error: "Character not found" },
          { status: 404 }
        );
      }

      // Verify character is in a campaign and user is the GM
      if (!characterById.campaignId) {
        return NextResponse.json(
          { success: false, error: "Character is not in a campaign" },
          { status: 400 }
        );
      }

      const campaign = await getCampaignById(characterById.campaignId);
      if (!campaign) {
        return NextResponse.json(
          { success: false, error: "Campaign not found" },
          { status: 404 }
        );
      }

      if (!isCampaignGM(campaign, userId)) {
        return NextResponse.json(
          { success: false, error: "Only the GM can reject advancements" },
          { status: 403 }
        );
      }

      // Use the character found by ID
      const result = rejectAdvancement(characterById, recordId, userId, reason);
      const { saveCharacter } = await import("@/lib/storage/characters");
      const updatedCharacter = await saveCharacter(result.updatedCharacter);

      return NextResponse.json({
        success: true,
        character: updatedCharacter,
        advancementRecord: result.updatedAdvancementRecord,
      });
    }

    // Character found as owner - check if it requires approval
    if (!requiresGMApproval(character)) {
      return NextResponse.json(
        { success: false, error: "Character does not require GM approval" },
        { status: 400 }
      );
    }

    // Verify user is the GM
    if (!character.campaignId) {
      return NextResponse.json(
        { success: false, error: "Character is not in a campaign" },
        { status: 400 }
      );
    }

    const campaign = await getCampaignById(character.campaignId);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    if (!isCampaignGM(campaign, userId)) {
      return NextResponse.json(
        { success: false, error: "Only the GM can reject advancements" },
        { status: 403 }
      );
    }

    // Reject the advancement
    const result = rejectAdvancement(character, recordId, userId, reason);
    const { saveCharacter } = await import("@/lib/storage/characters");
    const updatedCharacter = await saveCharacter(result.updatedCharacter);

    return NextResponse.json({
      success: true,
      character: updatedCharacter,
      advancementRecord: result.updatedAdvancementRecord,
    });
  } catch (error) {
    console.error("Failed to reject advancement:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to reject advancement";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 400 }
    );
  }
}

