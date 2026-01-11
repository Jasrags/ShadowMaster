import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById, updateCampaign } from "@/lib/storage/campaigns";
import { getCharacterById, awardKarma, awardNuyen } from "@/lib/storage/characters";
import type { CampaignSession, SessionRewardData } from "@/lib/types/campaign";

/**
 * PUT /api/campaigns/[id]/sessions/[sessionId]/complete
 * Marks a session as complete and optionally distributes rewards.
 */
export async function PUT(
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

    // Only GM can complete sessions
    if (campaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can complete sessions" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as SessionRewardData;
    const { participantCharacterIds, karmaAward, nuyenAward, recap, distributeRewards } = body;

    // Find the session
    const sessions = campaign.sessions || [];
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

    if (sessionIndex === -1) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    const session = sessions[sessionIndex];

    // Update session object
    const updatedSession: CampaignSession = {
      ...session,
      status: "completed",
      participantCharacterIds,
      karmaAwarded: karmaAward,
      nuyenAwarded: nuyenAward,
      recap: recap || session.recap,
      rewardsDistributed: distributeRewards ? true : session.rewardsDistributed,
      updatedAt: new Date().toISOString(),
    };

    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex] = updatedSession;

    // Distribute rewards if requested
    if (distributeRewards && participantCharacterIds.length > 0) {
      for (const charId of participantCharacterIds) {
        const character = await getCharacterById(charId);
        if (character) {
          if (karmaAward > 0) {
            await awardKarma(character.ownerId, character.id, karmaAward);
          }
          if (nuyenAward > 0) {
            await awardNuyen(character.ownerId, character.id, nuyenAward);
          }
        }
      }
    }

    // Save campaign
    const updatedCampaign = await updateCampaign(campaignId, {
      sessions: updatedSessions,
    });

    // Log activity and notify participants asynchronously
    try {
      const { logActivity } = await import("@/lib/storage/activity");
      const { createNotification } = await import("@/lib/storage/notifications");

      // Log session completion
      await logActivity({
        campaignId,
        type: "session_completed",
        actorId: userId,
        targetId: sessionId,
        targetType: "session",
        targetName: updatedSession.title,
        description: `Session "${updatedSession.title}" was completed.`,
      });

      if (distributeRewards && (karmaAward > 0 || nuyenAward > 0)) {
        await logActivity({
          campaignId,
          type: "karma_awarded",
          actorId: userId,
          targetId: sessionId,
          targetType: "session",
          targetName: updatedSession.title,
          description: `Rewards distributed for session "${updatedSession.title}": ${karmaAward} Karma, ${nuyenAward}¥.`,
        });

        // Notify all participants
        for (const charId of participantCharacterIds) {
          const character = await getCharacterById(charId);
          if (character) {
            await createNotification({
              userId: character.ownerId,
              campaignId,
              type: "karma_awarded",
              title: "Session Rewards Distributed",
              message: `You received ${karmaAward} Karma and ${nuyenAward}¥ for your participation in "${updatedSession.title}" with ${character.name}.`,
              actionUrl: `/characters/${character.id}`,
            });
          }
        }
      }
    } catch (activityError) {
      console.error("Failed to log session rewards activity:", activityError);
    }

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
      session: updatedSession,
    });
  } catch (error) {
    console.error("Complete session error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
