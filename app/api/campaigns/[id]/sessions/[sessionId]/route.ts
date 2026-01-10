import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById, updateCampaign } from "@/lib/storage/campaigns";
import type { CampaignSession } from "@/lib/types";

/**
 * PUT /api/campaigns/[id]/sessions/[sessionId] - Update a session
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

    const { id, sessionId } = await params;
    const campaign = await getCampaignById(id);

    if (!campaign) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    // Only GM can update sessions
    if (campaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can update sessions" },
        { status: 403 }
      );
    }

    const sessions = campaign.sessions || [];
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

    if (sessionIndex === -1) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, scheduledAt, durationMinutes, status, attendeeIds, notes, karmaAwarded } = body;

    const updatedSession: CampaignSession = {
      ...sessions[sessionIndex],
      ...(title !== undefined && { title }),
      ...(scheduledAt !== undefined && { scheduledAt }),
      ...(durationMinutes !== undefined && { durationMinutes }),
      ...(status !== undefined && { status }),
      ...(attendeeIds !== undefined && { attendeeIds }),
      ...(notes !== undefined && { notes }),
      ...(karmaAwarded !== undefined && { karmaAwarded }),
      updatedAt: new Date().toISOString(),
    };

    sessions[sessionIndex] = updatedSession;
    await updateCampaign(id, { sessions });

    return NextResponse.json({
      success: true,
      session: updatedSession,
    });
  } catch (error) {
    console.error("Update session error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}

/**
 * DELETE /api/campaigns/[id]/sessions/[sessionId]
 */
export async function DELETE(
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

    const { id, sessionId } = await params;
    const campaign = await getCampaignById(id);

    if (!campaign) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    // Only GM can delete sessions
    if (campaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can delete sessions" },
        { status: 403 }
      );
    }

    const sessions = campaign.sessions || [];
    const filteredSessions = sessions.filter((s) => s.id !== sessionId);

    if (filteredSessions.length === sessions.length) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    await updateCampaign(id, { sessions: filteredSessions });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete session error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
