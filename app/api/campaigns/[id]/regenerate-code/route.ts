import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById, regenerateInviteCode } from "@/lib/storage/campaigns";
import type { Campaign } from "@/lib/types";

/**
 * POST /api/campaigns/[id]/regenerate-code - Regenerate invite code (GM only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean; campaign?: Campaign; error?: string }>> {
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

    // Only GM can regenerate code
    if (campaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can regenerate the invite code" },
        { status: 403 }
      );
    }

    const updatedCampaign = await regenerateInviteCode(id);

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
    });
  } catch (error) {
    console.error("Regenerate code error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
