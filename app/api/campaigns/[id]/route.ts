import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
    getCampaignById,
    updateCampaign,
    deleteCampaign
} from "@/lib/storage/campaigns";
import type {
    UpdateCampaignRequest,
    CampaignResponse
} from "@/lib/types";

/**
 * GET /api/campaigns/[id] - Get campaign details
 */
export async function GET(
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
        const campaign = await getCampaignById(id);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Determine user's role
        let userRole: "gm" | "player" | null = null;
        if (campaign.gmId === userId) {
            userRole = "gm";
        } else if (campaign.playerIds.includes(userId)) {
            userRole = "player";
        }

        // Check access for private campaigns
        if (campaign.visibility === "private" && userRole === null) {
            return NextResponse.json(
                { success: false, error: "Access denied" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            campaign,
            userRole,
        });
    } catch (error) {
        console.error("Get campaign error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/campaigns/[id] - Update campaign (GM only)
 */
export async function PUT(
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
        const campaign = await getCampaignById(id);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Only GM can update
        if (campaign.gmId !== userId) {
            return NextResponse.json(
                { success: false, error: "Only the GM can update this campaign" },
                { status: 403 }
            );
        }

        const body: UpdateCampaignRequest = await request.json();

        // Validation
        if (body.title !== undefined && (body.title.length < 3 || body.title.length > 100)) {
            return NextResponse.json(
                { success: false, error: "Title must be between 3 and 100 characters" },
                { status: 400 }
            );
        }

        if (body.enabledBookIds !== undefined && body.enabledBookIds.length === 0) {
            return NextResponse.json(
                { success: false, error: "At least one book must be enabled" },
                { status: 400 }
            );
        }

        if (body.enabledCreationMethodIds !== undefined && body.enabledCreationMethodIds.length === 0) {
            return NextResponse.json(
                { success: false, error: "At least one creation method must be enabled" },
                { status: 400 }
            );
        }

        if (body.maxPlayers !== undefined && body.maxPlayers < campaign.playerIds.length) {
            return NextResponse.json(
                { success: false, error: "Max players cannot be less than current player count" },
                { status: 400 }
            );
        }

        // Update campaign
        const updatedCampaign = await updateCampaign(id, body);

        return NextResponse.json({
            success: true,
            campaign: updatedCampaign,
            userRole: "gm",
        });
    } catch (error) {
        console.error("Update campaign error:", error);
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/campaigns/[id] - Delete campaign (GM only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean; error?: string }>> {
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
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Only GM can delete
        if (campaign.gmId !== userId) {
            return NextResponse.json(
                { success: false, error: "Only the GM can delete this campaign" },
                { status: 403 }
            );
        }

        await deleteCampaign(id);

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("Delete campaign error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}
