import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCampaignById } from "@/lib/storage/campaigns";
import { getUserCharacters } from "@/lib/storage/characters";
import type { Character, ID } from "@/lib/types";

/**
 * Pending character with context for GM review
 */
interface PendingCharacter {
  character: Character;
  characterId: ID;
  characterName: string;
  characterOwnerId: ID;
  submittedAt: string;
}

/**
 * GET /api/campaigns/[id]/characters/pending-review
 *
 * Get all characters in pending-review status for a campaign.
 * GM-only endpoint.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<
  NextResponse<{
    success: boolean;
    pendingCharacters?: PendingCharacter[];
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

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { id } = await params;
    const campaign = await getCampaignById(id);

    if (!campaign) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    // Only GMs can view pending characters
    const isGM = campaign.gmId === userId;
    if (!isGM) {
      return NextResponse.json(
        { success: false, error: "Only GMs can view pending characters" },
        { status: 403 }
      );
    }

    // Get all characters for the campaign
    const allMemberIds = [campaign.gmId, ...campaign.playerIds];
    const characterPromises = allMemberIds.map((memberId) => getUserCharacters(memberId));
    const allCharacterArrays = await Promise.all(characterPromises);

    // Flatten, filter by campaignId and pending-review status
    const pendingCharacters: PendingCharacter[] = allCharacterArrays
      .flat()
      .filter((char) => char.campaignId === id && char.status === "pending-review")
      .map((char) => ({
        character: char,
        characterId: char.id,
        characterName: char.name,
        characterOwnerId: char.ownerId,
        submittedAt: char.updatedAt || char.createdAt,
      }));

    // Sort by submission date (newest first)
    pendingCharacters.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      pendingCharacters,
      count: pendingCharacters.length,
    });
  } catch (error) {
    console.error("Get pending characters error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
