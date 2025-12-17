import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
    getCampaignById,
    getCampaignByInviteCode,
    addPlayerToCampaign
} from "@/lib/storage/campaigns";
import type { CampaignResponse, JoinCampaignRequest } from "@/lib/types";

/**
 * POST /api/campaigns/[id]/join - Join a campaign
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<CampaignResponse>> {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body: JoinCampaignRequest = await request.json();

        let campaign = await getCampaignById(id);

        // If not found by ID, try finding by invite code
        if (!campaign && body.inviteCode) {
            campaign = await getCampaignByInviteCode(body.inviteCode);
        }

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Check if user is already a member
        if (campaign.gmId === userId) {
            return NextResponse.json(
                { success: false, error: "You are the GM of this campaign" },
                { status: 400 }
            );
        }

        if (campaign.playerIds.includes(userId)) {
            return NextResponse.json(
                { success: false, error: "You are already a member of this campaign" },
                { status: 400 }
            );
        }

        // Check visibility and invite code
        if (campaign.visibility === "private") {
            return NextResponse.json(
                { success: false, error: "This campaign is private" },
                { status: 403 }
            );
        }

        if (campaign.visibility === "invite-only") {
            if (!body.inviteCode) {
                return NextResponse.json(
                    { success: false, error: "Invite code required" },
                    { status: 400 }
                );
            }

            if (campaign.inviteCode?.toUpperCase() !== body.inviteCode.toUpperCase()) {
                return NextResponse.json(
                    { success: false, error: "Invalid invite code" },
                    { status: 400 }
                );
            }
        }

        // Add player to campaign
        const updatedCampaign = await addPlayerToCampaign(campaign.id, userId);

        return NextResponse.json({
            success: true,
            campaign: updatedCampaign,
            userRole: "player",
        });
    } catch (error) {
        console.error("Join campaign error:", error);
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
