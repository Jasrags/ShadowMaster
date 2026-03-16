import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeGM } from "@/lib/auth/campaign";
import { removePlayerFromCampaign } from "@/lib/storage/campaigns";

/**
 * DELETE /api/campaigns/[id]/players/[playerId] - Remove a player (GM only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; playerId: string }> }
): Promise<NextResponse<{ success: boolean; error?: string }>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id, playerId } = await params;
    const auth = await authorizeGM(id, userId);
    if (!auth.authorized || !auth.campaign) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const campaign = auth.campaign;

    // Check if player is actually in the campaign
    if (!campaign.playerIds.includes(playerId)) {
      return NextResponse.json(
        { success: false, error: "Player is not in this campaign" },
        { status: 400 }
      );
    }

    await removePlayerFromCampaign(id, playerId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Remove player error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
