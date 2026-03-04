import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/auth/session";
import { getCampaignById, updateCampaign } from "@/lib/storage/campaigns";
import {
  getCharacterById,
  getUserCharacters,
  getCurrentEdge,
  getMaxEdge,
  restoreFullEdge,
} from "@/lib/storage/characters";
import type { EdgeRefreshEvent } from "@/lib/types/campaign";
import type { Character } from "@/lib/types";

/**
 * POST /api/campaigns/[id]/sessions/[sessionId]/edge-refresh
 * Refreshes Edge for all party characters or an individual character.
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

    // Only GM can refresh Edge
    if (campaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can refresh Edge" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { scope, characterId, reason } = body as {
      scope: "party" | "individual";
      characterId?: string;
      reason: string;
    };

    // Validate scope
    if (scope !== "party" && scope !== "individual") {
      return NextResponse.json(
        { success: false, error: "Scope must be 'party' or 'individual'" },
        { status: 400 }
      );
    }

    // Validate reason
    if (!reason || reason.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Reason is required" }, { status: 400 });
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
        { success: false, error: "Cannot refresh Edge during a completed or cancelled session" },
        { status: 400 }
      );
    }

    // Determine target characters
    let targets: Character[] = [];

    if (scope === "party") {
      // Fetch all campaign characters
      const allMemberIds = [campaign.gmId, ...campaign.playerIds];
      const characterPromises = allMemberIds.map((memberId) => getUserCharacters(memberId));
      const allCharacterArrays = await Promise.all(characterPromises);
      targets = allCharacterArrays
        .flat()
        .filter((char) => char.campaignId === campaignId && char.status === "active");
    } else {
      // Individual scope
      if (!characterId) {
        return NextResponse.json(
          { success: false, error: "characterId is required for individual scope" },
          { status: 400 }
        );
      }
      const character = await getCharacterById(characterId);
      if (!character) {
        return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
      }
      targets = [character];
    }

    if (targets.length === 0) {
      return NextResponse.json(
        { success: false, error: "No eligible characters found" },
        { status: 400 }
      );
    }

    // Refresh Edge for each character and collect results
    const results: {
      characterId: string;
      characterName: string;
      previousEdge: number;
      newEdge: number;
      maxEdge: number;
    }[] = [];

    for (const character of targets) {
      const previousEdge = getCurrentEdge(character);
      const maxEdge = getMaxEdge(character);

      await restoreFullEdge(character.ownerId, character.id);

      results.push({
        characterId: character.id,
        characterName: character.name,
        previousEdge,
        newEdge: maxEdge,
        maxEdge,
      });
    }

    // Build the Edge refresh record
    const edgeRefresh: EdgeRefreshEvent = {
      id: uuidv4(),
      scope,
      characterIds: targets.map((c) => c.id),
      characterNames: targets.map((c) => c.name),
      reason: reason.trim(),
      refreshedBy: userId,
      refreshedAt: new Date().toISOString(),
    };

    // Append to session's edgeRefreshes
    const existingRefreshes = session.edgeRefreshes || [];
    const updatedSession = {
      ...session,
      edgeRefreshes: [...existingRefreshes, edgeRefresh],
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

      const namesStr = targets.map((c) => c.name).join(", ");
      await logActivity({
        campaignId,
        type: "edge_refresh",
        actorId: userId,
        targetId: sessionId,
        targetType: "session",
        targetName: session.title,
        description: `Edge Refresh: ${scope === "party" ? "All characters" : namesStr} — ${reason.trim()}`,
      });

      // Notify each affected character's owner
      const notifiedOwnerIds = new Set<string>();
      for (const character of targets) {
        if (notifiedOwnerIds.has(character.ownerId)) continue;
        notifiedOwnerIds.add(character.ownerId);

        const ownerChars = targets.filter((c) => c.ownerId === character.ownerId);
        const charNames = ownerChars.map((c) => c.name).join(", ");

        await createNotification({
          userId: character.ownerId,
          campaignId,
          type: "edge_refreshed",
          title: "Edge Refreshed",
          message: `${charNames} had Edge restored to maximum — ${reason.trim()}`,
          actionUrl: `/characters/${ownerChars[0].id}`,
        });
      }
    } catch (activityError) {
      console.error("Failed to log edge refresh activity:", activityError);
    }

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
      session: updatedSession,
      edgeRefresh,
      results,
    });
  } catch (error) {
    console.error("Edge refresh error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
