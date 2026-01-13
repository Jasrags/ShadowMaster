/**
 * Individual Grunt Damage API
 *
 * POST /api/grunt-teams/[teamId]/grunts/[gruntId]/damage - Apply damage to a grunt
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeCampaign } from "@/lib/auth/campaign";
import {
  getGruntTeam,
  getOrInitializeIndividualGrunts,
  updateIndividualGrunt,
  updateGruntTeamState,
} from "@/lib/storage/grunts";
import { applyDamage, applySimplifiedDamage, checkMorale } from "@/lib/rules/grunts";
import type { DamageResponse, ApplyDamageRequest } from "@/lib/types/grunts";

/**
 * POST /api/grunt-teams/[teamId]/grunts/[gruntId]/damage
 *
 * Apply damage to an individual grunt. GM only.
 * Automatically updates team casualties and checks morale.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string; gruntId: string }> }
): Promise<NextResponse<DamageResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { teamId, gruntId } = await params;
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

    const body: ApplyDamageRequest = await request.json();

    // Validate damage
    if (body.damage === undefined || body.damage < 0) {
      return NextResponse.json(
        { success: false, error: "Damage must be a non-negative number" },
        { status: 400 }
      );
    }

    if (!body.damageType || !["physical", "stun"].includes(body.damageType)) {
      return NextResponse.json(
        { success: false, error: "Damage type must be 'physical' or 'stun'" },
        { status: 400 }
      );
    }

    // Get individual grunts
    const individualGrunts = await getOrInitializeIndividualGrunts(team);
    const grunt =
      individualGrunts.grunts[gruntId] ||
      (individualGrunts.lieutenant?.id === gruntId ? individualGrunts.lieutenant : null) ||
      individualGrunts.specialists?.[gruntId];

    if (!grunt) {
      return NextResponse.json({ success: false, error: "Grunt not found" }, { status: 404 });
    }

    if (grunt.isDead) {
      return NextResponse.json(
        { success: false, error: "Cannot apply damage to dead grunt" },
        { status: 400 }
      );
    }

    // Apply damage
    const monitorSize = team.baseGrunts.conditionMonitorSize;
    const useSimplified = team.options?.useSimplifiedRules ?? false;

    const result = useSimplified
      ? applySimplifiedDamage(grunt, monitorSize)
      : applyDamage(grunt, body.damage, body.damageType, monitorSize);

    // Update grunt state
    await updateIndividualGrunt(teamId, team.campaignId, gruntId, {
      conditionMonitor: result.conditionMonitor,
      currentDamage: result.newDamage,
      isStunned: result.isStunned,
      isDead: result.isDead,
      lastDamageType: body.damageType,
    });

    // Update team casualties if grunt died
    let updatedTeamState = team.state;
    if (result.isDead && !grunt.isDead) {
      const newCasualties = team.state.casualties + 1;
      const newActiveCount = Math.max(0, team.state.activeCount - 1);

      await updateGruntTeamState(
        teamId,
        { casualties: newCasualties, activeCount: newActiveCount },
        team.campaignId
      );

      updatedTeamState = {
        ...team.state,
        casualties: newCasualties,
        activeCount: newActiveCount,
      };

      // Check morale
      const updatedTeam = { ...team, state: updatedTeamState };
      const moraleState = checkMorale(updatedTeam);
      if (moraleState === "broken" || moraleState === "routed") {
        await updateGruntTeamState(teamId, { moraleBroken: true, moraleState }, team.campaignId);
        updatedTeamState.moraleBroken = true;
        updatedTeamState.moraleState = moraleState;
      }
    }

    return NextResponse.json({
      success: true,
      result,
      teamState: updatedTeamState,
    });
  } catch (error) {
    console.error("Apply damage error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
