/**
 * API Route: /api/combat/[sessionId]/turn
 *
 * GET - Get current turn state
 * POST - Advance turn or round
 *
 * Satisfies:
 * - Requirement: "The system MUST track and display whose turn it is at all times"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import {
  getCombatSession,
  getCurrentParticipant,
  advanceTurn,
  advanceRound,
  setInitiativeScore,
  updateCombatSession,
} from "@/lib/storage/combat";

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

/**
 * GET /api/combat/[sessionId]/turn
 *
 * Get the current turn state.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    // Check access
    if (session.ownerId !== user.id) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    // Get current participant
    const currentParticipant = await getCurrentParticipant(sessionId);

    return NextResponse.json({
      success: true,
      round: session.round,
      phase: session.currentPhase,
      turn: session.currentTurn,
      initiativeOrder: session.initiativeOrder,
      currentParticipant: currentParticipant
        ? {
            id: currentParticipant.id,
            name: currentParticipant.name,
            initiativeScore: currentParticipant.initiativeScore,
            actionsRemaining: currentParticipant.actionsRemaining,
            status: currentParticipant.status,
          }
        : null,
      totalParticipants: session.participants.length,
      activeParticipants: session.participants.filter(
        (p) => p.status === "active" || p.status === "waiting"
      ).length,
    });
  } catch (error) {
    console.error("Failed to get turn state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get turn state" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/combat/[sessionId]/turn
 *
 * Advance the turn or round.
 *
 * Body:
 * - action: 'next' (next turn), 'round' (advance round), 'phase' (change phase), 'initiative' (set initiative)
 * - phase: New phase (for 'phase' action)
 * - participantId: Participant ID (for 'initiative' action)
 * - initiativeScore: New initiative score (for 'initiative' action)
 * - initiativeDice: Dice rolls (for 'initiative' action)
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
    let session = await getCombatSession(sessionId);

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
    const { action, phase, participantId, initiativeScore, initiativeDice } = body;

    // Validate action
    if (!action || !["next", "round", "phase", "initiative"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Must be one of: next, round, phase, initiative",
        },
        { status: 400 }
      );
    }

    let message = "";

    switch (action) {
      case "next":
        // Advance to next turn
        session = await advanceTurn(sessionId);
        if (!session) {
          throw new Error("Failed to advance turn");
        }
        message = `Advanced to turn ${session.currentTurn + 1} of round ${session.round}`;
        break;

      case "round":
        // Advance to next round
        session = await advanceRound(sessionId);
        if (!session) {
          throw new Error("Failed to advance round");
        }
        message = `Advanced to round ${session.round}`;
        break;

      case "phase":
        // Change phase
        if (!phase || !["initiative", "action", "resolution"].includes(phase)) {
          return NextResponse.json(
            {
              success: false,
              error: "Invalid phase. Must be one of: initiative, action, resolution",
            },
            { status: 400 }
          );
        }
        session = await updateCombatSession(sessionId, { currentPhase: phase });
        if (!session) {
          throw new Error("Failed to update phase");
        }
        message = `Changed phase to ${phase}`;
        break;

      case "initiative":
        // Set initiative for a participant
        if (!participantId || initiativeScore === undefined) {
          return NextResponse.json(
            {
              success: false,
              error: "Missing required fields: participantId, initiativeScore",
            },
            { status: 400 }
          );
        }
        session = await setInitiativeScore(
          sessionId,
          participantId,
          initiativeScore,
          initiativeDice
        );
        if (!session) {
          throw new Error("Failed to set initiative");
        }
        message = `Set initiative for participant`;
        break;
    }

    // Get updated current participant
    const currentParticipant = await getCurrentParticipant(sessionId);

    return NextResponse.json({
      success: true,
      message,
      round: session!.round,
      phase: session!.currentPhase,
      turn: session!.currentTurn,
      initiativeOrder: session!.initiativeOrder,
      currentParticipant: currentParticipant
        ? {
            id: currentParticipant.id,
            name: currentParticipant.name,
            initiativeScore: currentParticipant.initiativeScore,
            actionsRemaining: currentParticipant.actionsRemaining,
            status: currentParticipant.status,
          }
        : null,
    });
  } catch (error) {
    console.error("Failed to advance turn:", error);
    return NextResponse.json({ success: false, error: "Failed to advance turn" }, { status: 500 });
  }
}
