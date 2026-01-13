/**
 * Initiative API
 *
 * POST /api/grunt-teams/[teamId]/initiative - Roll initiative
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeCampaign } from "@/lib/auth/campaign";
import {
  getGruntTeam,
  updateGruntTeamState,
  getOrInitializeIndividualGrunts,
  saveIndividualGrunts,
} from "@/lib/storage/grunts";
import {
  rollGroupInitiative,
  rollLieutenantInitiative,
  rollSpecialistInitiative,
  rollD6,
  rollDice,
} from "@/lib/rules/grunts";
import type { InitiativeResponse, RollInitiativeRequest } from "@/lib/types/grunts";
import type { ID } from "@/lib/types";

/**
 * POST /api/grunt-teams/[teamId]/initiative
 *
 * Roll initiative for the grunt team. GM only.
 *
 * Supports:
 * - Group initiative: All grunts share one initiative
 * - Individual initiative: Each grunt rolls separately
 *
 * Lieutenants always roll individually.
 * Augmented specialists may roll individually.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
): Promise<NextResponse<InitiativeResponse>> {
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

    const body: RollInitiativeRequest = await request.json();

    // Validate initiative type
    if (!body.type || !["group", "individual"].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: "Type must be 'group' or 'individual'" },
        { status: 400 }
      );
    }

    const baseModifier = body.baseModifier ?? 0;
    const individualInitiatives: Record<ID, number> = {};

    // Roll group initiative
    const groupDieRoll = rollD6();
    const groupInitiative = rollGroupInitiative(team.baseGrunts, groupDieRoll) + baseModifier;

    // Update team state with group initiative
    await updateGruntTeamState(teamId, { groupInitiative }, team.campaignId);

    // If individual initiative requested or we have special units
    if (body.type === "individual" || team.lieutenant || team.specialists?.length) {
      const individualGrunts = await getOrInitializeIndividualGrunts(team);

      // Roll for each grunt if individual mode
      if (body.type === "individual") {
        for (const [gruntId, grunt] of Object.entries(individualGrunts.grunts)) {
          if (!grunt.isDead) {
            const dieRoll = rollD6();
            const init = rollGroupInitiative(team.baseGrunts, dieRoll) + baseModifier;
            individualGrunts.grunts[gruntId].initiative = init;
            individualInitiatives[gruntId] = init;
          }
        }
      } else {
        // In group mode, grunts use group initiative
        for (const [gruntId, grunt] of Object.entries(individualGrunts.grunts)) {
          if (!grunt.isDead) {
            individualGrunts.grunts[gruntId].initiative = groupInitiative;
            individualInitiatives[gruntId] = groupInitiative;
          }
        }
      }

      // Lieutenant always rolls individually
      if (team.lieutenant && individualGrunts.lieutenant && !individualGrunts.lieutenant.isDead) {
        const ltDieRoll = rollD6();
        const ltInit = rollLieutenantInitiative(team.lieutenant, ltDieRoll) + baseModifier;
        individualGrunts.lieutenant.initiative = ltInit;
        individualInitiatives[individualGrunts.lieutenant.id] = ltInit;
      }

      // Specialists may roll individually if augmented
      if (team.specialists && individualGrunts.specialists) {
        for (const specialist of team.specialists) {
          const specGrunt = individualGrunts.specialists[specialist.id];
          if (specGrunt && !specGrunt.isDead) {
            if (specialist.usesIndividualInitiative) {
              // Augmented specialist rolls individual initiative
              // Assume 1 die unless they have augmentations (future: check cyberware)
              const specDieRolls = rollDice(1);
              const specInit =
                rollSpecialistInitiative(specialist, team.baseGrunts, specDieRolls) + baseModifier;
              specGrunt.initiative = specInit;
              individualInitiatives[specialist.id] = specInit;
            } else {
              // Use group initiative
              specGrunt.initiative = groupInitiative;
              individualInitiatives[specialist.id] = groupInitiative;
            }
          }
        }
      }

      // Save updated individual grunts
      await saveIndividualGrunts(teamId, team.campaignId, individualGrunts);
    }

    return NextResponse.json({
      success: true,
      groupInitiative,
      individualInitiatives:
        Object.keys(individualInitiatives).length > 0 ? individualInitiatives : undefined,
    });
  } catch (error) {
    console.error("Roll initiative error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
