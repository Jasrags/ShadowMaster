import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
    updateCampaign,
    deleteCampaign
} from "@/lib/storage/campaigns";
import { authorizeCampaign } from "@/lib/auth/campaign";
import type {
    UpdateCampaignRequest,
    CampaignResponse,
    Campaign
} from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";

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
        const { authorized, campaign, role: userRole, error, status } = await authorizeCampaign(id, userId, { allowPublic: true });

        if (!authorized) {
            return NextResponse.json({ success: false, error }, { status });
        }

        return NextResponse.json({
            success: true,
            campaign: campaign!,
            userRole,
        } as CampaignResponse);
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
        const { authorized, campaign, error, status } = await authorizeCampaign(id, userId, { requireGM: true });

        if (!authorized) {
            return NextResponse.json({ success: false, error }, { status });
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

        if (body.maxPlayers !== undefined && body.maxPlayers < campaign!.playerIds.length) {
            return NextResponse.json(
                { success: false, error: "Max players cannot be less than current player count" },
                { status: 400 }
            );
        }

        if (body.advancementSettings) {
            const settings = body.advancementSettings;
            if (
                (settings.attributeKarmaMultiplier !== undefined && settings.attributeKarmaMultiplier < 1) ||
                (settings.skillKarmaMultiplier !== undefined && settings.skillKarmaMultiplier < 1) ||
                (settings.skillGroupKarmaMultiplier !== undefined && settings.skillGroupKarmaMultiplier < 1)
            ) {
                return NextResponse.json(
                    { success: false, error: "Karma multipliers must be at least 1" },
                    { status: 400 }
                );
            }
        }

        // Merge advancement settings if present
        const { advancementSettings, ...restBody } = body;
        const updateData: Partial<Campaign> = { ...restBody };
        
        if (advancementSettings && campaign!.advancementSettings) {
            updateData.advancementSettings = {
                ...campaign!.advancementSettings,
                ...advancementSettings
            } as CampaignAdvancementSettings;
        }

        // Update campaign
        const updatedCampaign = await updateCampaign(id, updateData);

        // Log activity asynchronously
        try {
            const { logActivity } = await import("@/lib/storage/activity");
            
            await logActivity({
                campaignId: id,
                type: "campaign_updated",
                actorId: userId,
                targetId: id,
                targetType: "campaign",
                targetName: updatedCampaign.title,
                description: `Campaign settings were updated by the GM.`,
            });
        } catch (activityError) {
            console.error("Failed to log campaign update activity:", activityError);
        }

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
        const { authorized, campaign, error, status } = await authorizeCampaign(id, userId, { requireGM: true });

        if (!authorized) {
            return NextResponse.json({ success: false, error }, { status });
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
