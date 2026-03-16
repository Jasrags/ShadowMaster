import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeGM } from "@/lib/auth/campaign";
import { getUserCharacters } from "@/lib/storage/characters";
import type { Character, AdvancementRecord, ID } from "@/lib/types";

/**
 * Pending advancement with character context for GM review
 */
interface PendingAdvancement {
  advancement: AdvancementRecord;
  characterId: ID;
  characterName: string;
  characterOwnerId: ID;
}

/**
 * GET /api/campaigns/[id]/advancements/pending - Get all pending advancements for campaign characters
 *
 * Returns all advancement records where gmApproved === false for characters in this campaign.
 * GM-only endpoint.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<
  NextResponse<{
    success: boolean;
    pendingAdvancements?: PendingAdvancement[];
    count?: number;
    error?: string;
  }>
> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const auth = await authorizeGM(id, userId);
    if (!auth.authorized || !auth.campaign) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const campaign = auth.campaign;

    // Get all characters for the campaign
    const allMemberIds = [campaign.gmId, ...campaign.playerIds];
    const characterPromises = allMemberIds.map((memberId) => getUserCharacters(memberId));
    const allCharacterArrays = await Promise.all(characterPromises);

    // Flatten and filter by campaignId
    const campaignCharacters: Character[] = allCharacterArrays
      .flat()
      .filter((char) => char.campaignId === id);

    // Collect all pending advancements with character context
    const pendingAdvancements: PendingAdvancement[] = [];

    for (const character of campaignCharacters) {
      const history = character.advancementHistory || [];
      const pending = history.filter((a) => a.gmApproved === false);

      for (const advancement of pending) {
        pendingAdvancements.push({
          advancement,
          characterId: character.id,
          characterName: character.name,
          characterOwnerId: character.ownerId,
        });
      }
    }

    // Sort by creation date (newest first)
    pendingAdvancements.sort(
      (a, b) =>
        new Date(b.advancement.createdAt).getTime() - new Date(a.advancement.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      pendingAdvancements,
      count: pendingAdvancements.length,
    });
  } catch (error) {
    console.error("Get pending advancements error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
