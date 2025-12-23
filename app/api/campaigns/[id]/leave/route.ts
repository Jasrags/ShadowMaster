import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById, removePlayerFromCampaign } from "@/lib/storage/campaigns";

/**
 * POST /api/campaigns/[id]/leave - Leave a campaign
 */
export async function POST(
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

        // GM cannot leave their own campaign
        if (campaign.gmId === userId) {
            return NextResponse.json(
                { success: false, error: "GM cannot leave the campaign. Delete it instead." },
                { status: 400 }
            );
        }

        // Check if user is actually a player
        if (!campaign.playerIds.includes(userId)) {
            return NextResponse.json(
                { success: false, error: "You are not a member of this campaign" },
                { status: 400 }
            );
        }

        await removePlayerFromCampaign(id, userId);

        // Log activity and notify GM asynchronously
        try {
            const { getUserById } = await import("@/lib/storage/users");
            const { logActivity } = await import("@/lib/storage/activity");
            const { createNotification } = await import("@/lib/storage/notifications");
            
            const user = await getUserById(userId);
            
            await logActivity({
                campaignId: id,
                type: "player_left",
                actorId: userId,
                targetId: userId,
                targetType: "player",
                targetName: user?.username || "A player",
                description: `${user?.username || "A player"} left the campaign.`,
            });

            await createNotification({
                userId: campaign.gmId,
                campaignId: id,
                type: "mentioned",
                title: "Player Left",
                message: `${user?.username || "A player"} has left your campaign "${campaign.title}".`,
                actionUrl: `/campaigns/${id}?tab=roster`,
            });
        } catch (activityError) {
            console.error("Failed to log leave activity:", activityError);
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("Leave campaign error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}
