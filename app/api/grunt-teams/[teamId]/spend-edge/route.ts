/**
 * Group Edge API
 *
 * POST /api/grunt-teams/[teamId]/spend-edge - Spend Group Edge
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeCampaign } from "@/lib/auth/campaign";
import { getGruntTeam, spendGroupEdge } from "@/lib/storage/grunts";
import { canSpendEdge } from "@/lib/rules/grunts";
import type { GruntTeamResponse, SpendEdgeRequest } from "@/lib/types/grunts";
import { apiLogger } from "@/lib/logging";

/**
 * POST /api/grunt-teams/[teamId]/spend-edge
 *
 * Spend Group Edge from the team pool. GM only.
 */
export async function POST(
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

    const body: SpendEdgeRequest = await request.json();

    // Validate amount
    if (body.amount === undefined || body.amount < 1) {
      return NextResponse.json(
        { success: false, error: "Amount must be at least 1" },
        { status: 400 }
      );
    }

    // Check if team can spend this much Edge
    if (!canSpendEdge(team, body.amount)) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient Group Edge: have ${team.groupEdge}, need ${body.amount}`,
        },
        { status: 400 }
      );
    }

    // Spend Edge
    const updatedTeam = await spendGroupEdge(teamId, body.amount, team.campaignId);

    return NextResponse.json({
      success: true,
      team: updatedTeam,
    });
  } catch (error) {
    const { teamId } = await params;
    apiLogger.error({ error, teamId }, "Spend Edge error");
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
