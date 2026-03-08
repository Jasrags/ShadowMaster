/**
 * API Route: /api/combat/[sessionId]/spend-action
 *
 * POST - Spend an action from a participant's action economy.
 * Used for readiness changes and other non-combat-roll actions
 * that still cost an action during combat.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCombatSession, updateParticipantActions } from "@/lib/storage/combat";
import { consumeAction } from "@/lib/rules/action-resolution/action-executor";
import type { ActionAllocation } from "@/lib/types";

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

/**
 * POST /api/combat/[sessionId]/spend-action
 *
 * Spend an action from a participant's action economy.
 *
 * Body:
 * - participantId: ID of the participant spending the action
 * - actionType: "free" | "simple" | "complex"
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    const { sessionId } = await params;
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

    // Check session is active
    if (session.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Combat session is not active" },
        { status: 400 }
      );
    }

    // Parse body
    const body = await request.json();
    const { participantId, actionType } = body;

    if (!participantId || !actionType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: participantId, actionType" },
        { status: 400 }
      );
    }

    if (!["free", "simple", "complex"].includes(actionType)) {
      return NextResponse.json(
        { success: false, error: "Invalid actionType. Must be free, simple, or complex" },
        { status: 400 }
      );
    }

    // Find participant
    const participant = session.participants.find((p) => p.id === participantId);
    if (!participant) {
      return NextResponse.json({ success: false, error: "Participant not found" }, { status: 404 });
    }

    // Consume the action
    const before = participant.actionsRemaining;
    const after = consumeAction(before, actionType);

    // Validate something was actually consumed
    if (!wasActionConsumed(before, after, actionType)) {
      return NextResponse.json(
        { success: false, error: `No ${actionType} actions remaining` },
        { status: 400 }
      );
    }

    // Persist
    await updateParticipantActions(sessionId, participantId, after);

    return NextResponse.json({
      success: true,
      actionsRemaining: after,
    });
  } catch (error) {
    console.error("Failed to spend action:", error);
    return NextResponse.json({ success: false, error: "Failed to spend action" }, { status: 500 });
  }
}

function wasActionConsumed(
  before: ActionAllocation,
  after: ActionAllocation,
  actionType: string
): boolean {
  switch (actionType) {
    case "free":
      return after.free < before.free || before.free === 0;
    case "simple":
      return after.simple < before.simple;
    case "complex":
      return after.complex < before.complex || after.simple < before.simple;
    default:
      return false;
  }
}
