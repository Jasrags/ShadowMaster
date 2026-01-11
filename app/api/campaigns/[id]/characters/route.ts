import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById } from "@/lib/storage/campaigns";
import { getUserCharacters } from "@/lib/storage/characters";
import type { Character } from "@/lib/types";

/**
 * GET /api/campaigns/[id]/characters - Get characters in a campaign
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean; characters?: Character[]; error?: string }>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const campaign = await getCampaignById(id);

    if (!campaign) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    // Check access
    const isGM = campaign.gmId === userId;
    const isPlayer = campaign.playerIds.includes(userId);

    if (!isGM && !isPlayer) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    // Get all characters for the campaign
    // First get GM's characters, then all players' characters
    const allMemberIds = [campaign.gmId, ...campaign.playerIds];
    const characterPromises = allMemberIds.map((memberId) => getUserCharacters(memberId));
    const allCharacterArrays = await Promise.all(characterPromises);

    // Flatten and filter by campaignId
    let characters: Character[] = allCharacterArrays
      .flat()
      .filter((char) => char.campaignId === id);

    // If not GM, only show the user's own characters
    if (!isGM) {
      characters = characters.filter((char) => char.ownerId === userId);
    }

    return NextResponse.json({
      success: true,
      characters,
    });
  } catch (error) {
    console.error("Get campaign characters error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
