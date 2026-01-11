/**
 * API Route: /api/matrix/overwatch
 *
 * POST - Record an overwatch event (illegal action performed)
 * DELETE - End overwatch session (jack out)
 *
 * Satisfies:
 * - Guarantee: "The accumulation of digital 'Overwatch Score' MUST be auditable
 *   and result in predictable system interventions"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession as getAuthSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import type {
  RecordOverwatchRequest,
  OverwatchResponse,
  OverwatchSession,
  ConvergenceResult,
} from "@/lib/types/matrix";
import {
  startOverwatchSession,
  recordOverwatchEvent,
  endOverwatchSession,
  getConvergenceProgress,
} from "@/lib/rules/matrix/overwatch-tracker";
import { handleConvergence } from "@/lib/rules/matrix/overwatch-calculator";
import { OVERWATCH_THRESHOLD } from "@/lib/types/matrix";

// =============================================================================
// IN-MEMORY SESSION STORAGE (for demo/development)
// In production, this would be stored in Redis or similar
// =============================================================================

// Session storage - in production, use Redis or similar
const activeSessions = new Map<string, OverwatchSession>();

/**
 * Get or create an overwatch session for a character
 */
function getOrCreateSession(characterId: string): OverwatchSession {
  const existing = activeSessions.get(characterId);
  if (existing && !existing.converged && !existing.endReason) {
    return existing;
  }

  // Create new session
  const session = startOverwatchSession(characterId, OVERWATCH_THRESHOLD);
  activeSessions.set(characterId, session);
  return session;
}

/**
 * Get existing session (without creating)
 */
function getOverwatchSession(characterId: string): OverwatchSession | null {
  return activeSessions.get(characterId) ?? null;
}

/**
 * Update session in storage
 */
function updateSession(session: OverwatchSession): void {
  activeSessions.set(session.characterId, session);
}

/**
 * Remove session from storage
 */
function removeSession(characterId: string): void {
  activeSessions.delete(characterId);
}

// =============================================================================
// POST - Record Overwatch Event
// =============================================================================

export async function POST(
  request: NextRequest
): Promise<NextResponse<OverwatchResponse | { error: string }>> {
  try {
    // Check authentication
    const userId = await getAuthSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request
    const body: RecordOverwatchRequest = await request.json();
    const { characterId, action, scoreAdded } = body;

    // Validate required fields
    if (!characterId) {
      return NextResponse.json({ error: "characterId is required" }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ error: "action is required" }, { status: 400 });
    }

    if (typeof scoreAdded !== "number" || scoreAdded < 0) {
      return NextResponse.json(
        { error: "scoreAdded must be a non-negative number" },
        { status: 400 }
      );
    }

    // Verify character ownership
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    if (character.ownerId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to record overwatch for this character" },
        { status: 403 }
      );
    }

    // Get or create session
    let session = getOrCreateSession(characterId);

    // Check if already converged
    if (session.converged) {
      return NextResponse.json(
        {
          error: "Session has already converged. Start a new session.",
        },
        { status: 400 }
      );
    }

    // Record the event
    session = recordOverwatchEvent(session, action, scoreAdded);
    updateSession(session);

    const response: OverwatchResponse = {
      currentScore: session.currentScore,
      threshold: session.threshold,
      convergenceTriggered: session.converged,
      events: session.events,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to record overwatch event:", error);
    return NextResponse.json({ error: "Failed to record overwatch event" }, { status: 500 });
  }
}

// =============================================================================
// DELETE - End Overwatch Session
// =============================================================================

interface EndSessionRequest {
  characterId: string;
  reason?: "jacked_out" | "converged" | "session_ended";
}

interface EndSessionResponse {
  success: boolean;
  session?: OverwatchSession;
  convergence?: ConvergenceResult;
  error?: string;
}

export async function DELETE(request: NextRequest): Promise<NextResponse<EndSessionResponse>> {
  try {
    // Check authentication
    const userId = await getAuthSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Parse request
    const body: EndSessionRequest = await request.json();
    const { characterId, reason = "jacked_out" } = body;

    // Validate required fields
    if (!characterId) {
      return NextResponse.json(
        { success: false, error: "characterId is required" },
        { status: 400 }
      );
    }

    // Verify character ownership
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    if (character.ownerId !== userId) {
      return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    }

    // Get session
    let session = getOverwatchSession(characterId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "No active session found" },
        { status: 404 }
      );
    }

    // End the session
    session = endOverwatchSession(session, reason);
    updateSession(session);

    // If converged, calculate convergence effects
    let convergence: ConvergenceResult | undefined;
    if (session.converged) {
      // Would need the matrix state for full convergence handling
      // For now, return a basic convergence result
      convergence = {
        osReset: true,
        dumpshockTriggered: false, // Would need connection mode
        personaDestroyed: true,
        icDispatched: [],
      };
    }

    // Clean up session after ending
    removeSession(characterId);

    return NextResponse.json({
      success: true,
      session,
      convergence,
    });
  } catch (error) {
    console.error("Failed to end overwatch session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to end overwatch session" },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Get Current Overwatch Status
// =============================================================================

export async function GET(
  request: NextRequest
): Promise<NextResponse<OverwatchResponse | { error: string }>> {
  try {
    // Check authentication
    const userId = await getAuthSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get characterId from query params
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get("characterId");

    if (!characterId) {
      return NextResponse.json(
        { error: "characterId query parameter is required" },
        { status: 400 }
      );
    }

    // Verify character ownership
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    if (character.ownerId !== userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Get session (without creating)
    const session = getOverwatchSession(characterId);

    if (!session) {
      // Return empty state
      return NextResponse.json({
        currentScore: 0,
        threshold: OVERWATCH_THRESHOLD,
        convergenceTriggered: false,
        events: [],
      });
    }

    return NextResponse.json({
      currentScore: session.currentScore,
      threshold: session.threshold,
      convergenceTriggered: session.converged,
      events: session.events,
    });
  } catch (error) {
    console.error("Failed to get overwatch status:", error);
    return NextResponse.json({ error: "Failed to get overwatch status" }, { status: 500 });
  }
}
