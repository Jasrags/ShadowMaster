import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/auth/session";
import { getCampaignById, updateCampaign } from "@/lib/storage/campaigns";
import { getCharacterById, awardKarma, awardNuyen } from "@/lib/storage/characters";
import type { MidSessionAward } from "@/lib/types/campaign";

/**
 * POST /api/campaigns/[id]/sessions/[sessionId]/awards
 * Gives an individual mid-session karma/nuyen award to a character.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sessionId: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: campaignId, sessionId } = await params;
    const campaign = await getCampaignById(campaignId);

    if (!campaign) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    // Only GM can give awards
    if (campaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can give awards" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { characterId, karma, nuyen, reason } = body as {
      characterId: string;
      karma: number;
      nuyen: number;
      reason: string;
    };

    // Validate reason
    if (!reason || reason.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Reason is required" }, { status: 400 });
    }

    // Validate at least one reward
    const karmaAmount = karma || 0;
    const nuyenAmount = nuyen || 0;
    if (karmaAmount <= 0 && nuyenAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "At least one of karma or nuyen must be greater than 0" },
        { status: 400 }
      );
    }

    // Find the session
    const sessions = campaign.sessions || [];
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

    if (sessionIndex === -1) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    const session = sessions[sessionIndex];

    // Reject if session is completed or cancelled
    if (session.status === "completed" || session.status === "cancelled") {
      return NextResponse.json(
        { success: false, error: "Cannot award during a completed or cancelled session" },
        { status: 400 }
      );
    }

    // Fetch and validate character
    const character = await getCharacterById(characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Distribute rewards
    if (karmaAmount > 0) {
      await awardKarma(character.ownerId, character.id, karmaAmount);
    }
    if (nuyenAmount > 0) {
      await awardNuyen(character.ownerId, character.id, nuyenAmount);
    }

    // Build the award record
    const award: MidSessionAward = {
      id: uuidv4(),
      characterId: character.id,
      characterName: character.name,
      karma: karmaAmount,
      nuyen: nuyenAmount,
      reason: reason.trim(),
      awardedBy: userId,
      awardedAt: new Date().toISOString(),
    };

    // Append to session's midSessionAwards
    const existingAwards = session.midSessionAwards || [];
    const updatedSession = {
      ...session,
      midSessionAwards: [...existingAwards, award],
      updatedAt: new Date().toISOString(),
    };

    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex] = updatedSession;

    // Save campaign
    const updatedCampaign = await updateCampaign(campaignId, {
      sessions: updatedSessions,
    });

    // Log activity and notify asynchronously
    try {
      const { logActivity } = await import("@/lib/storage/activity");
      const { createNotification } = await import("@/lib/storage/notifications");

      await logActivity({
        campaignId,
        type: "mid_session_award",
        actorId: userId,
        targetId: character.id,
        targetType: "character",
        targetName: character.name,
        description: `Quick Award: ${character.name} received ${karmaAmount > 0 ? `${karmaAmount} Karma` : ""}${karmaAmount > 0 && nuyenAmount > 0 ? " and " : ""}${nuyenAmount > 0 ? `${nuyenAmount}¥` : ""} — ${reason.trim()}`,
      });

      await createNotification({
        userId: character.ownerId,
        campaignId,
        type: "karma_awarded",
        title: "Quick Award Received",
        message: `${character.name} received ${karmaAmount > 0 ? `${karmaAmount} Karma` : ""}${karmaAmount > 0 && nuyenAmount > 0 ? " and " : ""}${nuyenAmount > 0 ? `${nuyenAmount}¥` : ""} for: ${reason.trim()}`,
        actionUrl: `/characters/${character.id}`,
      });
    } catch (activityError) {
      console.error("Failed to log mid-session award activity:", activityError);
    }

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
      session: updatedSession,
      award,
    });
  } catch (error) {
    console.error("Mid-session award error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
