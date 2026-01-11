/**
 * API Route: /api/magic/drain
 *
 * POST - Calculate drain for a magical action
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacterById } from "@/lib/storage/characters";
import { calculateDrain } from "@/lib/rules/magic";
import type { Character, DrainAction } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      characterId,
      action, // "cast", "summoning", "binding", "ritual", "preparation"
      force,
      spellId,
      spiritType,
      traditionId,
    } = body;

    if (!action || force === undefined) {
      return NextResponse.json(
        { success: false, error: "Action and force are required" },
        { status: 400 }
      );
    }

    // Load character if ID provided (preferred)
    let character = null;
    let editionCode = body.editionCode;

    if (characterId) {
      character = await getCharacterById(characterId);
      if (!character) {
        return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
      }
      editionCode = character.editionCode;
    }

    if (!editionCode) {
      return NextResponse.json(
        { success: false, error: "Edition code is required" },
        { status: 400 }
      );
    }

    // Load ruleset
    const { loadRuleset } = await import("@/lib/rules/loader");
    const loadResult = await loadRuleset({
      editionCode: editionCode,
      bookIds: character?.attachedBookIds,
    });

    if (!loadResult.success || !loadResult.ruleset) {
      return NextResponse.json(
        { success: false, error: loadResult.error || "Failed to load ruleset" },
        { status: 500 }
      );
    }

    const ruleset = loadResult.ruleset;

    // 1. Calculate Drain Value and Formula
    // Correct signature: calculateDrain(character, input, ruleset)
    const drainResult = calculateDrain(
      character || ({ tradition: traditionId } as Partial<Character>),
      {
        action: action as DrainAction,
        force,
        spellId,
        spiritType,
      },
      ruleset
    );

    // 2. Calculate Resistance Pool
    // resistancePool is already included in DrainResult from calculateDrain
    const resistancePool = drainResult.resistancePool;

    // 3. Determine Drain Type (Physical or Stun) based on force and Magic rating
    // Note: getDrainType is also called inside calculateDrain, but we can re-evaluate here if needed
    // In our implementation, calculateDrain returns it.
    const drainType = drainResult.drainType;

    return NextResponse.json({
      success: true,
      drainValue: drainResult.drainValue,
      drainType,
      resistancePool: resistancePool,
      formula: drainResult.drainFormula,
      details: {
        // Since we don't return full breakdown in simple DrainResult, we provide what we have
        formData: drainResult.drainFormula,
      },
    });
  } catch (error) {
    console.error("Drain calculation error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
