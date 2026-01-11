/**
 * API Route: /api/combat/quick-start
 *
 * POST - Create a quick combat session with a character already added
 *
 * This is a convenience endpoint that:
 * 1. Creates a new combat session
 * 2. Adds the specified character as a participant
 * 3. Optionally rolls initiative
 * 4. Returns the ready-to-use session
 *
 * Phase 5.3.6: Quick Combat Mode API
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacterById } from "@/lib/storage/characters";
import {
  createCombatSession,
  addParticipant,
  setInitiativeScore,
  updateCombatSession,
} from "@/lib/storage/combat";
import type { EnvironmentConditions, ActionAllocation } from "@/lib/types";

/** Default action allocation for a new combat round */
const DEFAULT_ACTIONS: ActionAllocation = {
  free: 999,
  simple: 2,
  complex: 1,
  interrupt: true,
};

/**
 * Roll initiative dice
 */
function rollInitiative(baseDice: number): { total: number; dice: number[] } {
  const dice: number[] = [];
  for (let i = 0; i < baseDice; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1);
  }
  const total = dice.reduce((sum, d) => sum + d, 0);
  return { total, dice };
}

/**
 * POST /api/combat/quick-start
 *
 * Create a quick combat session with character already added.
 *
 * Body:
 * - characterId: Character to add (required)
 * - name: Optional session name
 * - editionCode: Edition code (optional, defaults to character's edition)
 * - rollInitiative: Whether to auto-roll initiative (default: true)
 * - environment: Optional environment conditions
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Parse body
    const body = await request.json();
    const {
      characterId,
      name,
      editionCode,
      rollInitiative: shouldRollInit = true,
      environment,
    } = body;

    // Validate required fields
    if (!characterId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: characterId" },
        { status: 400 }
      );
    }

    // Fetch the character
    const character = await getCharacterById(characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Check character ownership
    if (character.ownerId !== user.id) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    // Determine edition code
    const sessionEdition = editionCode || character.editionCode || "sr5";

    // Default environment
    const defaultEnvironment: EnvironmentConditions = {
      lighting: "normal",
      weather: "clear",
      terrain: "urban",
      visibility: 100,
      backgroundCount: 0,
      noise: 0,
      ...environment,
    };

    // Step 1: Create combat session
    const session = await createCombatSession({
      name: name || `Quick Combat - ${character.name}`,
      ownerId: user.id,
      editionCode: sessionEdition,
      status: "active",
      round: 1,
      currentTurn: 0,
      currentPhase: "initiative",
      participants: [],
      initiativeOrder: [],
      environment: defaultEnvironment,
    });

    // Step 2: Calculate and optionally roll initiative
    const attrs = character.attributes || {};
    const reaction = attrs.reaction || 1;
    const intuition = attrs.intuition || 1;
    const initiativeBase = reaction + intuition;

    let initiativeScore = initiativeBase;
    let initiativeDice: number[] = [];

    if (shouldRollInit) {
      // Roll 1d6 for base initiative
      // TODO: Add support for additional dice from cyberware/powers
      const roll = rollInitiative(1);
      initiativeDice = roll.dice;
      initiativeScore = initiativeBase + roll.total;
    }

    // Calculate wound modifier
    const physicalDamage = character.condition?.physicalDamage || 0;
    const stunDamage = character.condition?.stunDamage || 0;
    const woundModifier = -Math.floor(physicalDamage / 3) - Math.floor(stunDamage / 3);

    // Step 3: Add character as participant
    const participant = {
      type: "character" as const,
      entityId: character.id,
      name: character.name,
      initiativeScore,
      initiativeDice,
      actionsRemaining: { ...DEFAULT_ACTIONS },
      interruptsPending: [],
      status: "active" as const,
      controlledBy: user.id,
      isGMControlled: false,
      woundModifier,
      conditions: [],
    };

    const updatedSession = await addParticipant(session.id, participant);
    if (!updatedSession) {
      return NextResponse.json(
        { success: false, error: "Failed to add participant" },
        { status: 500 }
      );
    }

    // Step 4: Set the initiative (to update order)
    const addedParticipant = updatedSession.participants[0];
    await setInitiativeScore(session.id, addedParticipant.id, initiativeScore, initiativeDice);

    // Step 5: Update phase to action
    const finalSession = await updateCombatSession(session.id, {
      currentPhase: "action",
    });

    return NextResponse.json(
      {
        success: true,
        session: finalSession,
        participant: addedParticipant,
        initiative: {
          base: initiativeBase,
          dice: initiativeDice,
          total: initiativeScore,
        },
        message: `Quick combat started with ${character.name}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to start quick combat:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start quick combat" },
      { status: 500 }
    );
  }
}
