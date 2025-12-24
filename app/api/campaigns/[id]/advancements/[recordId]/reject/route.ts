import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById } from "@/lib/storage/campaigns";
import { getCharacterById, updateCharacter } from "@/lib/storage/characters";
import { rejectAdvancement } from "@/lib/rules/advancement/approval";

/**
 * POST /api/campaigns/[id]/advancements/[recordId]/reject - Reject an advancement
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; recordId: string }> }
): Promise<NextResponse<{ success: boolean; error?: string }>> {
    try {
        const gmUserId = await getSession();
        if (!gmUserId) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        const { id: campaignId, recordId } = await params;
        const campaign = await getCampaignById(campaignId);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Authorization: Only GM can reject
        if (campaign.gmId !== gmUserId) {
            return NextResponse.json(
                { success: false, error: "Only the GM can reject advancements" },
                { status: 403 }
            );
        }

        const { characterId, reason } = await request.json();
        
        if (!characterId) {
            return NextResponse.json(
                { success: false, error: "characterId is required" },
                { status: 400 }
            );
        }

        if (!reason) {
            return NextResponse.json(
                { success: false, error: "Rejection reason is mandatory" },
                { status: 400 }
            );
        }

        const character = await getCharacterById(characterId);
        if (!character || character.campaignId !== campaignId) {
            return NextResponse.json(
                { success: false, error: "Character not found or not in this campaign" },
                { status: 404 }
            );
        }

        // Core logic
        const { updatedCharacter } = rejectAdvancement(character, recordId, gmUserId, reason);

        // Persist
        await updateCharacter(character.ownerId, character.id, updatedCharacter);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Reject advancement error:", error);
        const errorMessage = error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
