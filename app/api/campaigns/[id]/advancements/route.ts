import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById } from "@/lib/storage/campaigns";
import { getCharactersByCampaign, getAdvancementHistory } from "@/lib/storage/characters";
import type { AdvancementRecord } from "@/lib/types";

interface PendingAdvancementRecord extends AdvancementRecord {
  characterId: string;
  characterName: string;
}

/**
 * GET /api/campaigns/[id]/advancements - List all pending advancement requests for a campaign
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<
  NextResponse<{ success: boolean; advancements?: PendingAdvancementRecord[]; error?: string }>
> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: campaignId } = await params;
    const campaign = await getCampaignById(campaignId);

    if (!campaign) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    // Authorization: Only GM can view the full pending list for the campaign
    if (campaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can view the pending advancement list" },
        { status: 403 }
      );
    }

    // Get all characters in the campaign
    const characters = await getCharactersByCampaign(userId, campaignId);

    // Collate all pending advancements
    const allPending: PendingAdvancementRecord[] = [];

    for (const character of characters) {
      const pending = getAdvancementHistory(character, { gmApproved: false, rejected: false });

      pending.forEach((record) => {
        allPending.push({
          ...record,
          characterId: character.id,
          characterName: character.name,
        });
      });
    }

    return NextResponse.json({
      success: true,
      advancements: allPending,
    });
  } catch (error) {
    console.error("List pending advancements error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
