/**
 * API Route: /api/combat/[sessionId]/participants/[participantId]
 *
 * DELETE - Remove a participant from a combat session
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCombatSession, removeParticipant } from "@/lib/storage/combat";

interface RouteParams {
  params: Promise<{ sessionId: string; participantId: string }>;
}

/**
 * DELETE /api/combat/[sessionId]/participants/[participantId]
 *
 * Remove a participant from the combat session.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { sessionId, participantId } = await params;
    const session = await getCombatSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Combat session not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (session.ownerId !== user.id) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    // Find the participant
    const participant = session.participants.find((p) => p.id === participantId);
    if (!participant) {
      return NextResponse.json({ success: false, error: "Participant not found" }, { status: 404 });
    }

    // Remove participant
    const updated = await removeParticipant(sessionId, participantId);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Failed to remove participant" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Removed ${participant.name} from combat`,
      session: updated,
    });
  } catch (error) {
    console.error("Failed to remove participant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove participant" },
      { status: 500 }
    );
  }
}
