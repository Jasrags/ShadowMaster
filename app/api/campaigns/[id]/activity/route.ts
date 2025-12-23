import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCampaignById } from "@/lib/storage/campaigns";
import { getCampaignActivity, getCampaignActivityCount } from "@/lib/storage/activity";

/**
 * GET /api/campaigns/[id]/activity - Get campaign activity feed
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: campaignId } = await params;
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await getUserById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const campaign = await getCampaignById(campaignId);
        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        // Check if user is a member of the campaign
        const isGm = campaign.gmId === user.id;
        const isPlayer = campaign.playerIds.includes(user.id);

        if (!isGm && !isPlayer && campaign.visibility !== "public") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
            total,
        });
    } catch (error) {
        console.error("Error fetching campaign activity:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
