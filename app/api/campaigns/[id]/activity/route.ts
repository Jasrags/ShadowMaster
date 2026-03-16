import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeMember } from "@/lib/auth/campaign";
import { getCampaignActivity, getCampaignActivityCount } from "@/lib/storage/activity";

/**
 * GET /api/campaigns/[id]/activity - Get campaign activity feed
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: campaignId } = await params;
    const userId = await getSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth = await authorizeMember(campaignId, userId);
    if (!auth.authorized || !auth.campaign) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const activities = await getCampaignActivity(campaignId, limit, offset);
    const total = await getCampaignActivityCount(campaignId);

    return NextResponse.json({
      success: true,
      activities,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + activities.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching campaign activity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
