import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById } from "@/lib/storage/campaigns";
import { getCharacterById, updateCharacter } from "@/lib/storage/characters";
import type { CharacterApprovalStatus } from "@/lib/types";

/**
 * POST /api/campaigns/[id]/characters/[characterId]/approve
 * Approve or reject a character for the campaign (GM-only)
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; characterId: string }> }
): Promise<NextResponse> {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        const { id, characterId } = await params;
        const campaign = await getCampaignById(id);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Only GM can approve characters
        if (campaign.gmId !== userId) {
            return NextResponse.json(
                { success: false, error: "Only the GM can approve characters" },
                { status: 403 }
            );
        }

        // Get the character
        const character = await getCharacterById(characterId);
        if (!character) {
            return NextResponse.json(
                { success: false, error: "Character not found" },
                { status: 404 }
            );
        }

        // Verify character belongs to this campaign
        if (character.campaignId !== id) {
            return NextResponse.json(
                { success: false, error: "Character does not belong to this campaign" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { action, feedback } = body;

        if (!action || !["approve", "reject"].includes(action)) {
            return NextResponse.json(
                { success: false, error: "Invalid action. Use 'approve' or 'reject'" },
                { status: 400 }
            );
        }

        const approvalStatus: CharacterApprovalStatus = action === "approve" ? "approved" : "rejected";

        // Update the character
        const updatedCharacter = await updateCharacter(character.ownerId, characterId, {
            approvalStatus,
            approvalFeedback: feedback || undefined,
        });

        // Log activity and notify player asynchronously
        try {
            const { logActivity } = await import("@/lib/storage/activity");
            const { createNotification } = await import("@/lib/storage/notifications");
            
            if (action === "approve") {
                await logActivity({
                    campaignId: id,
                    type: "character_approved",
                    actorId: userId,
                    targetId: characterId,
                    targetType: "character",
                    targetName: character.name,
                    description: `Character "${character.name}" was approved for the campaign.`,
                });
                
                await createNotification({
                    userId: character.ownerId,
                    campaignId: id,
                    type: "character_approved",
                    title: "Character Approved",
                    message: `Your character "${character.name}" has been approved for "${campaign.title}".`,
                    actionUrl: `/characters/${characterId}`,
                });
            } else {
                await logActivity({
                    campaignId: id,
                    type: "character_rejected",
                    actorId: userId,
                    targetId: characterId,
                    targetType: "character",
                    targetName: character.name,
                    description: `Character "${character.name}" was not approved for the campaign.`,
                });

                await createNotification({
                    userId: character.ownerId,
                    campaignId: id,
                    type: "character_rejected",
                    title: "Character Rejected",
                    message: `Your character "${character.name}" was not approved for "${campaign.title}". Feedback: ${feedback || "No feedback provided."}`,
                    actionUrl: `/characters/${characterId}`,
                });
            }
        } catch (activityError) {
            console.error("Failed to log character approval activity:", activityError);
        }

        return NextResponse.json({
            success: true,
            character: updatedCharacter,
        });
    } catch (error) {
        console.error("Character approval error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}
