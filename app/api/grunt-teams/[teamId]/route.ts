/**
 * Individual Grunt Team API
 *
 * GET /api/grunt-teams/[teamId] - Get grunt team details
 * PUT /api/grunt-teams/[teamId] - Update grunt team (GM only)
 * DELETE /api/grunt-teams/[teamId] - Delete grunt team (GM only)
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeCampaign } from "@/lib/auth/campaign";
import {
  getGruntTeam,
  updateGruntTeam,
  deleteGruntTeam,
  getOrInitializeIndividualGrunts,
} from "@/lib/storage/grunts";
import { validateGruntTeam } from "@/lib/rules/grunts";
import type {
  GruntTeamDetailResponse,
  GruntTeamResponse,
  UpdateGruntTeamRequest,
} from "@/lib/types/grunts";

/**
 * GET /api/grunt-teams/[teamId]
 *
 * Get grunt team details with optional combat tracking state.
 *
 * Query Parameters:
 * - includeCombatState: Include individual grunt tracking (default: false)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
): Promise<NextResponse<GruntTeamDetailResponse>> {
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
      return NextResponse.json(
        { success: false, error: "Grunt team not found" },
        { status: 404 }
      );
    }

    // Authorize access to the campaign
    const { authorized, role, error, status } = await authorizeCampaign(
      team.campaignId,
      userId,
      { requireMember: true }
    );

    if (!authorized) {
      return NextResponse.json({ success: false, error }, { status });
    }

    // Check visibility for players
    if (role === "player" && !team.visibility?.showToPlayers) {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }

    // Include combat state if requested
    const searchParams = request.nextUrl.searchParams;
    const includeCombatState = searchParams.get("includeCombatState") === "true";

    let individualGrunts;
    if (includeCombatState && role === "gm") {
      individualGrunts = await getOrInitializeIndividualGrunts(team);
    }

    return NextResponse.json({
      success: true,
      team,
      individualGrunts,
    });
  } catch (error) {
    console.error("Get grunt team error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/grunt-teams/[teamId]
 *
 * Update grunt team configuration. GM only.
 *
 * Request Body: UpdateGruntTeamRequest
 */
export async function PUT(
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
      return NextResponse.json(
        { success: false, error: "Grunt team not found" },
        { status: 404 }
      );
    }

    // Authorize GM access
    const { authorized, error, status } = await authorizeCampaign(
      team.campaignId,
      userId,
      { requireGM: true }
    );

    if (!authorized) {
      return NextResponse.json({ success: false, error }, { status });
    }

    const body: UpdateGruntTeamRequest = await request.json();

    // Validate updated configuration
    // Handle null values by converting to undefined for validation
    // Merge baseGrunts carefully to preserve required nested properties
    const mergedBaseGrunts = body.baseGrunts
      ? { ...team.baseGrunts, ...body.baseGrunts }
      : team.baseGrunts;

    const validationData = {
      ...team,
      name: body.name ?? team.name,
      description: body.description ?? team.description,
      professionalRating: body.professionalRating ?? team.professionalRating,
      initialSize: body.initialSize ?? team.initialSize,
      baseGrunts: mergedBaseGrunts,
      encounterId: body.encounterId === null ? undefined : (body.encounterId ?? team.encounterId),
      lieutenant: body.lieutenant === null ? undefined : (body.lieutenant ?? team.lieutenant),
      specialists: body.specialists ?? team.specialists,
      options: body.options ?? team.options,
      visibility: body.visibility ?? team.visibility,
    };
    const validation = validateGruntTeam(validationData);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join("; ") },
        { status: 400 }
      );
    }

    // Update the team
    const updatedTeam = await updateGruntTeam(teamId, body, team.campaignId);

    // TODO: Log activity when grunt activity types are added to CampaignActivityType

    return NextResponse.json({
      success: true,
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Update grunt team error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/grunt-teams/[teamId]
 *
 * Delete a grunt team. GM only.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
): Promise<NextResponse<{ success: boolean; error?: string }>> {
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
      return NextResponse.json(
        { success: false, error: "Grunt team not found" },
        { status: 404 }
      );
    }

    // Authorize GM access
    const { authorized, error, status } = await authorizeCampaign(
      team.campaignId,
      userId,
      { requireGM: true }
    );

    if (!authorized) {
      return NextResponse.json({ success: false, error }, { status });
    }

    await deleteGruntTeam(teamId, team.campaignId);

    // TODO: Log activity when grunt activity types are added to CampaignActivityType

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete grunt team error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
