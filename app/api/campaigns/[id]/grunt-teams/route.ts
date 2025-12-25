/**
 * Campaign Grunt Teams API
 *
 * GET /api/campaigns/[id]/grunt-teams - List grunt teams for a campaign
 * POST /api/campaigns/[id]/grunt-teams - Create a new grunt team
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeCampaign } from "@/lib/auth/campaign";
import {
  createGruntTeam,
  getGruntTeamsByCampaign,
} from "@/lib/storage/grunts";
import { getGruntTemplate } from "@/lib/storage/grunt-templates";
import { validateGruntTeam } from "@/lib/rules/grunts";
import type {
  GruntTeamsListResponse,
  GruntTeamResponse,
  CreateGruntTeamRequest,
  ProfessionalRating,
} from "@/lib/types/grunts";

/**
 * GET /api/campaigns/[id]/grunt-teams
 *
 * List all grunt teams for a campaign with optional filters.
 *
 * Query Parameters:
 * - professionalRating: Filter by PR (0-6)
 * - search: Search by name/description
 * - encounterId: Filter by encounter
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GruntTeamsListResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, teams: [], error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: campaignId } = await params;
    const { authorized, campaign, role, error, status } = await authorizeCampaign(
      campaignId,
      userId,
      { requireMember: true }
    );

    if (!authorized) {
      return NextResponse.json(
        { success: false, teams: [], error },
        { status }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const prParam = searchParams.get("professionalRating");
    const search = searchParams.get("search") || undefined;
    const encounterId = searchParams.get("encounterId") || undefined;

    const professionalRating = prParam
      ? (parseInt(prParam, 10) as ProfessionalRating)
      : undefined;

    // Get teams with filters
    let teams = await getGruntTeamsByCampaign(campaignId, {
      professionalRating,
      search,
      encounterId,
    });

    // Filter visibility for players
    if (role === "player") {
      teams = teams.filter((team) => team.visibility?.showToPlayers);
    }

    return NextResponse.json({
      success: true,
      teams,
    });
  } catch (error) {
    console.error("Get grunt teams error:", error);
    return NextResponse.json(
      { success: false, teams: [], error: "An error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/campaigns/[id]/grunt-teams
 *
 * Create a new grunt team. GM only.
 *
 * Request Body: CreateGruntTeamRequest
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GruntTeamResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: campaignId } = await params;
    const { authorized, campaign, error, status } = await authorizeCampaign(
      campaignId,
      userId,
      { requireGM: true }
    );

    if (!authorized) {
      return NextResponse.json({ success: false, error }, { status });
    }

    const body: CreateGruntTeamRequest = await request.json();

    // If templateId provided, populate baseGrunts from template
    if (body.templateId && !body.baseGrunts) {
      const template = await getGruntTemplate(campaign!.editionCode, body.templateId);
      if (!template) {
        return NextResponse.json(
          { success: false, error: "Template not found" },
          { status: 404 }
        );
      }
      body.baseGrunts = template.baseGrunts;
      body.professionalRating = template.professionalRating;
    }

    // Ensure baseGrunts is provided (either directly or via template)
    if (!body.baseGrunts) {
      return NextResponse.json(
        { success: false, error: "Either baseGrunts or templateId must be provided" },
        { status: 400 }
      );
    }

    // Validate team configuration (add temporary IDs for validation)
    const validationData = {
      ...body,
      campaignId,
      specialists: body.specialists?.map((s, i) => ({ ...s, id: `temp-${i}` })),
    };
    const validation = validateGruntTeam(validationData);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join("; ") },
        { status: 400 }
      );
    }

    // Create the team
    const team = await createGruntTeam(campaignId, body);

    // TODO: Log activity when grunt activity types are added to CampaignActivityType
    // For now, skip activity logging to avoid type errors

    return NextResponse.json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("Create grunt team error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
