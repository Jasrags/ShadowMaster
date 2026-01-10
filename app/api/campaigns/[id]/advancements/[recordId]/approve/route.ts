import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById } from "@/lib/storage/campaigns";
import { getCharacterById, updateCharacter } from "@/lib/storage/characters";
import { approveAdvancement } from "@/lib/rules/advancement/approval";

/**
 * POST /api/campaigns/[id]/advancements/[recordId]/approve - Approve an advancement
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
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    // Authorization: Only GM can approve
    if (campaign.gmId !== gmUserId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can approve advancements" },
        { status: 403 }
      );
    }

    // Find the character associated with this campaign or just find by record?
    // Finding character by record is hard without knowing character ID.
    // Usually, the UI will provide the characterId.
    // Let's assume the request body contains characterId.
    const { characterId } = await request.json();

    if (!characterId) {
      return NextResponse.json(
        { success: false, error: "characterId is required" },
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
    const { updatedCharacter } = approveAdvancement(character, recordId, gmUserId);

    // Persist
    await updateCharacter(character.ownerId, character.id, updatedCharacter);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approve advancement error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
