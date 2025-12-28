/**
 * API Route: /api/combat/[sessionId]
 *
 * GET - Get combat session details
 * PATCH - Update combat session (pause, resume, environment)
 * DELETE - End/delete combat session
 *
 * Satisfies:
 * - Requirement: "maintain a persistent and auditable history of all action attempts"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import {
  getCombatSession,
  updateCombatSession,
  endCombatSession,
  deleteCombatSession,
  updateEnvironment,
} from "@/lib/storage/combat";
import type { CombatSessionStatus, EnvironmentConditions } from "@/lib/types";

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

/**
 * GET /api/combat/[sessionId]
 *
 * Get full combat session state including participants and history.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { sessionId } = await params;
    const session = await getCombatSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Combat session not found" },
        { status: 404 }
      );
    }

    // Check access (owner or campaign member)
    // For now, just check ownership - campaign access would require campaign membership check
    if (session.ownerId !== user.id) {
      // TODO: Add campaign membership check for multiplayer support
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Failed to get combat session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get combat session" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/combat/[sessionId]
 *
 * Update combat session state.
 *
 * Body:
 * - status: New status (active, paused)
 * - environment: Updated environment conditions
 * - name: Updated session name
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
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
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Parse body
    const body = await request.json();
    const { status, environment, name } = body;

    // Validate status if provided
    if (status && !["active", "paused"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Use 'active' or 'paused'" },
        { status: 400 }
      );
    }

    // Build updates
    const updates: {
      status?: CombatSessionStatus;
      environment?: EnvironmentConditions;
      name?: string;
    } = {};

    if (status) {
      updates.status = status;
    }

    if (name) {
      updates.name = name;
    }

    // Update environment separately if provided
    if (environment) {
      await updateEnvironment(sessionId, {
        ...session.environment,
        ...environment,
      });
    }

    // Apply other updates
    const updated =
      Object.keys(updates).length > 0
        ? await updateCombatSession(sessionId, updates)
        : await getCombatSession(sessionId);

    return NextResponse.json({
      success: true,
      session: updated,
    });
  } catch (error) {
    console.error("Failed to update combat session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update combat session" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/combat/[sessionId]
 *
 * End or permanently delete a combat session.
 *
 * Query Parameters:
 * - action: 'end' (mark as completed) or 'delete' (permanently remove)
 * - reason: 'completed' or 'abandoned' (for 'end' action)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
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
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "end";
    const reason = searchParams.get("reason") as
      | "completed"
      | "abandoned"
      | null;

    if (action === "delete") {
      // Permanently delete
      await deleteCombatSession(sessionId);
      return NextResponse.json({
        success: true,
        message: "Combat session deleted",
      });
    } else {
      // End session (mark as completed/abandoned)
      const endReason = reason || "completed";
      const ended = await endCombatSession(sessionId, endReason);

      return NextResponse.json({
        success: true,
        session: ended,
        message: `Combat session ${endReason}`,
      });
    }
  } catch (error) {
    console.error("Failed to delete combat session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete combat session" },
      { status: 500 }
    );
  }
}
