/**
 * API Route: /api/combat/[sessionId]/participants
 *
 * GET - List participants in a combat session
 * POST - Add a participant to the combat session
 *
 * Satisfies:
 * - Requirement: "maintain a persistent and auditable history of all action attempts"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacterById } from "@/lib/storage/characters";
import { getCombatSession, addParticipant, setInitiativeScore } from "@/lib/storage/combat";
import type { ParticipantType, ActionAllocation } from "@/lib/types";

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

/** Default action allocation for a new combat round */
const DEFAULT_ACTIONS: ActionAllocation = {
  free: 999,
  simple: 2,
  complex: 1,
  interrupt: true,
};

/**
 * GET /api/combat/[sessionId]/participants
 *
 * List all participants in the combat session.
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
    const currentParticipantId = session.initiativeOrder[session.currentTurn];

    return NextResponse.json({
      success: true,
      participants: session.participants,
      initiativeOrder: session.initiativeOrder,
      currentTurn: session.currentTurn,
      currentParticipantId,
    });
  } catch (error) {
    console.error("Failed to get participants:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get participants" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/combat/[sessionId]/participants
 *
 * Add a participant to the combat session.
 *
 * Body:
 * - type: Participant type (character, npc, grunt, spirit, drone, device)
 * - entityId: ID of the entity (character ID, NPC ID, etc.)
 * - name: Display name (optional, will use entity name if not provided)
 * - initiativeScore: Pre-rolled initiative score (optional)
 * - initiativeDice: Dice rolls used for initiative (optional)
 * - isGMControlled: Whether this is GM controlled (default: false)
 * - woundModifier: Starting wound modifier (default: 0)
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

    // Parse body
    const body = await request.json();
    const {
      type,
      entityId,
      name,
      initiativeScore,
      initiativeDice,
      isGMControlled = false,
      woundModifier = 0,
    } = body;

    // Validate required fields
    if (!type || !entityId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: type, entityId" },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes: ParticipantType[] = [
      "character",
      "npc",
      "grunt",
      "spirit",
      "drone",
      "device",
    ];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if entity already in combat
    const existingParticipant = session.participants.find(
      (p) => p.entityId === entityId && p.type === type
    );
    if (existingParticipant) {
      return NextResponse.json(
        { success: false, error: "Entity is already participating in this combat" },
        { status: 400 }
      );
    }

    // Resolve entity name if not provided
    let displayName = name;
    if (!displayName && type === "character") {
      const character = await getCharacterById(entityId);
      if (character) {
        displayName = character.name;
      }
    }
    displayName = displayName || `Unknown ${type}`;

    // Create participant
    const participant = {
      type: type as ParticipantType,
      entityId,
      name: displayName,
      initiativeScore: initiativeScore ?? 0,
      initiativeDice: initiativeDice ?? [],
      actionsRemaining: { ...DEFAULT_ACTIONS },
      interruptsPending: [],
      status: "active" as const,
      controlledBy: isGMControlled ? session.ownerId : user.id,
      isGMControlled,
      woundModifier,
      conditions: [],
    };

    // Add participant
    const updated = await addParticipant(sessionId, participant);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Failed to add participant" },
        { status: 500 }
      );
    }

    // Get the newly added participant (last in list)
    const newParticipant = updated.participants[updated.participants.length - 1];

    // Set initiative if provided (this will also update the order)
    if (initiativeScore !== undefined) {
      await setInitiativeScore(sessionId, newParticipant.id, initiativeScore, initiativeDice);
    }

    return NextResponse.json(
      {
        success: true,
        participant: newParticipant,
        message: `Added ${displayName} to combat`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add participant:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add participant" },
      { status: 500 }
    );
  }
}
