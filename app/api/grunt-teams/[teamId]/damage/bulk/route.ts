/**
 * Bulk Damage API
 *
 * POST /api/grunt-teams/[teamId]/damage/bulk - Apply damage to multiple grunts
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
  saveIndividualGrunts,
} from "@/lib/storage/grunts";
import { applyDamage, applySimplifiedDamage, checkMorale } from "@/lib/rules/grunts";
import type { BulkDamageResponse, BulkDamageRequest, DamageResult } from "@/lib/types/grunts";

/**
 * POST /api/grunt-teams/[teamId]/damage/bulk
 *
 * Apply damage to multiple grunts at once. GM only.
 * Useful for area-effect attacks or automated combat resolution.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
): Promise<NextResponse<BulkDamageResponse>> {
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

    const body: BulkDamageRequest = await request.json();

    // Validate request
    if (!body.gruntIds || !Array.isArray(body.gruntIds) || body.gruntIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "gruntIds must be a non-empty array" },
        { status: 400 }
      );
    }

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
    const monitorSize = team.baseGrunts.conditionMonitorSize;
    const useSimplified = team.options?.useSimplifiedRules ?? false;

    // Build allowlist of valid grunt IDs to prevent property injection attacks
    const validGruntIds = new Set<string>([
      ...Object.keys(individualGrunts.grunts),
      ...(individualGrunts.lieutenant ? [individualGrunts.lieutenant.id] : []),
      ...(individualGrunts.specialists ? Object.keys(individualGrunts.specialists) : []),
    ]);

    const results: DamageResult[] = [];
    let newDeaths = 0;

    // Process each grunt
    for (const gruntId of body.gruntIds) {
      // Validate gruntId against allowlist to prevent property injection
      if (!validGruntIds.has(gruntId)) {
        continue;
      }

      // Find grunt in grunts, lieutenant, or specialists
      let grunt = individualGrunts.grunts[gruntId];
      let gruntLocation: "grunts" | "lieutenant" | "specialists" = "grunts";

      if (!grunt && individualGrunts.lieutenant?.id === gruntId) {
        grunt = individualGrunts.lieutenant;
        gruntLocation = "lieutenant";
      } else if (!grunt && individualGrunts.specialists?.[gruntId]) {
        grunt = individualGrunts.specialists[gruntId];
        gruntLocation = "specialists";
      }

      if (!grunt) {
        // Skip unknown grunts
        continue;
      }

      if (grunt.isDead) {
        // Skip already dead grunts
        continue;
      }

      // Apply damage
      const result = useSimplified
        ? applySimplifiedDamage(grunt, monitorSize)
        : applyDamage(grunt, body.damage, body.damageType, monitorSize);

      results.push(result);

      // Update grunt in memory
      const updatedGrunt = {
        ...grunt,
        conditionMonitor: result.conditionMonitor,
        currentDamage: result.newDamage,
        isStunned: result.isStunned,
        isDead: result.isDead,
        lastDamageType: body.damageType,
      };

      if (gruntLocation === "grunts") {
        individualGrunts.grunts[gruntId] = updatedGrunt;
      } else if (gruntLocation === "lieutenant") {
        individualGrunts.lieutenant = updatedGrunt;
      } else if (gruntLocation === "specialists" && individualGrunts.specialists) {
        individualGrunts.specialists[gruntId] = updatedGrunt;
      }

      // Track new deaths
      if (result.isDead && !grunt.isDead) {
        newDeaths++;
      }
    }

    // Save all updated grunt states
    await saveIndividualGrunts(teamId, team.campaignId, individualGrunts);

    // Update team casualties if any died
    let updatedTeamState = team.state;
    if (newDeaths > 0) {
      const newCasualties = team.state.casualties + newDeaths;
      const newActiveCount = Math.max(0, team.state.activeCount - newDeaths);

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
      results,
      teamState: updatedTeamState,
    });
  } catch (error) {
    console.error("Bulk damage error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
