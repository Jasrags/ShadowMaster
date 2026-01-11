/**
 * Grunt Team State API
 *
 * PATCH /api/grunt-teams/[teamId]/state - Update combat state
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeCampaign } from "@/lib/auth/campaign";
import { getGruntTeam, updateGruntTeamState } from "@/lib/storage/grunts";
import { checkMorale } from "@/lib/rules/grunts";
import type { GruntTeamResponse, GruntTeamState } from "@/lib/types/grunts";

/**
 * Request body for state update
 */
interface UpdateStateRequest {
  activeCount?: number;
  casualties?: number;
  groupInitiative?: number;
  moraleBroken?: boolean;
}

/**
 * PATCH /api/grunt-teams/[teamId]/state
 *
 * Update grunt team combat state. GM only.
 * Automatically calculates morale state based on casualties.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
): Promise<NextResponse<GruntTeamResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { teamId } = await params;
    const team = await getGruntTeam(teamId);

    if (!team) {
      return NextResponse.json({ success: false, error: "Grunt team not found" }, { status: 404 });
    }

    // Authorize GM access
    const { authorized, error, status } = await authorizeCampaign(team.campaignId, userId, {
      requireGM: true,
    });

    if (!authorized) {
      return NextResponse.json({ success: false, error }, { status });
    }

    const body: UpdateStateRequest = await request.json();

    // Validate state values
    if (body.activeCount !== undefined && body.activeCount < 0) {
      return NextResponse.json(
        { success: false, error: "Active count cannot be negative" },
        { status: 400 }
      );
    }

    if (body.casualties !== undefined && body.casualties < 0) {
      return NextResponse.json(
        { success: false, error: "Casualties cannot be negative" },
        { status: 400 }
      );
    }

    // Build state update
    const stateUpdate: Partial<GruntTeamState> = {};

    if (body.activeCount !== undefined) {
      stateUpdate.activeCount = body.activeCount;
    }

    if (body.casualties !== undefined) {
      stateUpdate.casualties = body.casualties;
      // Auto-calculate active count if not provided
      if (body.activeCount === undefined) {
        stateUpdate.activeCount = Math.max(0, team.initialSize - body.casualties);
      }
    }

    if (body.groupInitiative !== undefined) {
      stateUpdate.groupInitiative = body.groupInitiative;
    }

    if (body.moraleBroken !== undefined) {
      stateUpdate.moraleBroken = body.moraleBroken;
    }

    // Update state
    const updatedTeam = await updateGruntTeamState(teamId, stateUpdate, team.campaignId);

    // Auto-calculate morale state
    const moraleState = checkMorale(updatedTeam);
    if (moraleState !== updatedTeam.state.moraleState) {
      await updateGruntTeamState(
        teamId,
        { moraleState, moraleBroken: moraleState === "broken" || moraleState === "routed" },
        team.campaignId
      );
      updatedTeam.state.moraleState = moraleState;
      updatedTeam.state.moraleBroken = moraleState === "broken" || moraleState === "routed";
    }

    return NextResponse.json({
      success: true,
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Update grunt team state error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
