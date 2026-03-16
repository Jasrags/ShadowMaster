import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeGM } from "@/lib/auth/campaign";
import { getUserCharacters, getAdvancementHistory } from "@/lib/storage/characters";
import type { AdvancementRecord, Character } from "@/lib/types";

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
    const auth = await authorizeGM(campaignId, userId);
    if (!auth.authorized || !auth.campaign) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const campaign = auth.campaign;

    // Get all characters from all campaign members (GM + players)
    const allMemberIds = [campaign.gmId, ...campaign.playerIds];
    const characterArrays = await Promise.all(
      allMemberIds.map((memberId) => getUserCharacters(memberId))
    );
    const characters: Character[] = characterArrays
      .flat()
      .filter((c) => c.campaignId === campaignId);

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
