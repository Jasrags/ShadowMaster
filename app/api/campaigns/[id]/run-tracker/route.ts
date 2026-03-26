import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCampaign } from "@/lib/storage/campaigns";
import { authorizeCampaign } from "@/lib/auth/campaign";
import type { RunTrackerSession, RunPhaseTransition } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

/**
 * GET /api/campaigns/[id]/run-tracker - Get run tracker sessions (GM-only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { authorized, campaign, error, status } = await authorizeCampaign(id, userId, {
      requireGM: true,
    });

    if (!authorized) {
      return NextResponse.json({ success: false, error }, { status });
    }

    return NextResponse.json({
      success: true,
      runTrackerSessions: campaign!.runTrackerSessions || [],
    });
  } catch (error) {
    console.error("Get run tracker sessions error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}

/**
 * POST /api/campaigns/[id]/run-tracker - Create a run tracker session (GM-only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { authorized, campaign, error, status } = await authorizeCampaign(id, userId, {
      requireGM: true,
    });

    if (!authorized) {
      return NextResponse.json({ success: false, error }, { status });
    }

    const body = await request.json();
    const { label, initialPhaseId } = body;

    const MAX_LABEL_LENGTH = 200;
    if (
      !label ||
      typeof label !== "string" ||
      label.trim().length === 0 ||
      label.trim().length > MAX_LABEL_LENGTH
    ) {
      return NextResponse.json(
        { success: false, error: `Label must be between 1 and ${MAX_LABEL_LENGTH} characters` },
        { status: 400 }
      );
    }

    if (!initialPhaseId || typeof initialPhaseId !== "string") {
      return NextResponse.json(
        { success: false, error: "Initial phase ID is required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const initialTransition: RunPhaseTransition = {
      phaseId: initialPhaseId,
      enteredAt: now,
    };

    const newSession: RunTrackerSession = {
      id: uuidv4(),
      label: label.trim(),
      activePhaseId: initialPhaseId,
      phaseTransitions: [initialTransition],
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    const existing = campaign!.runTrackerSessions || [];
    await updateCampaign(id, {
      runTrackerSessions: [...existing, newSession],
    });

    return NextResponse.json({ success: true, session: newSession }, { status: 201 });
  } catch (error) {
    console.error("Create run tracker session error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}

/**
 * PATCH /api/campaigns/[id]/run-tracker - Update a run tracker session (GM-only)
 *
 * Body: { sessionId, activePhaseId?, status? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { authorized, campaign, error, status } = await authorizeCampaign(id, userId, {
      requireGM: true,
    });

    if (!authorized) {
      return NextResponse.json({ success: false, error }, { status });
    }

    const body = await request.json();
    const { sessionId, activePhaseId, status: newStatus } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    const existing = campaign!.runTrackerSessions || [];
    const sessionIndex = existing.findIndex((s) => s.id === sessionId);

    if (sessionIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Run tracker session not found" },
        { status: 404 }
      );
    }

    const current = existing[sessionIndex];
    const now = new Date().toISOString();

    let updatedTransitions = current.phaseTransitions;
    let updatedPhaseId = current.activePhaseId;

    if (
      activePhaseId &&
      typeof activePhaseId === "string" &&
      activePhaseId !== current.activePhaseId
    ) {
      const newTransition: RunPhaseTransition = {
        phaseId: activePhaseId,
        enteredAt: now,
      };
      updatedTransitions = [...current.phaseTransitions, newTransition];
      updatedPhaseId = activePhaseId;
    }

    let updatedStatus = current.status;
    if (newStatus === "active" || newStatus === "completed") {
      updatedStatus = newStatus;
    }

    const updatedSession: RunTrackerSession = {
      ...current,
      activePhaseId: updatedPhaseId,
      phaseTransitions: updatedTransitions,
      status: updatedStatus,
      updatedAt: now,
    };

    const updatedSessions = existing.map((s, i) => (i === sessionIndex ? updatedSession : s));

    await updateCampaign(id, { runTrackerSessions: updatedSessions });

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error("Update run tracker session error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
