/**
 * API Route: /api/characters/[characterId]/magic
 *
 * GET - Get character's magical state
 * PATCH - Update character's magical state (runtime)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { loadRuleset, extractAugmentationRules } from "@/lib/rules/loader";
import {
  getEssenceMagicState,
  getSpellDefinition,
  getAdeptPowerDefinition,
} from "@/lib/rules/magic";
import type { Character } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Load ruleset
    const loadResult = await loadRuleset({
      editionCode: character.editionCode,
      bookIds: character.attachedBookIds,
    });

    if (!loadResult.success || !loadResult.ruleset) {
      return NextResponse.json(
        { success: false, error: "Failed to load ruleset" },
        { status: 500 }
      );
    }

    const ruleset = loadResult.ruleset;
    const augmentationRules = extractAugmentationRules(ruleset);
    const magicState = getEssenceMagicState(character, augmentationRules);

    // Enrich spells with metadata
    const spellsDetailed = (character.spells || []).map((spellId) => {
      const def = getSpellDefinition(spellId, undefined, ruleset);
      return def
        ? { id: spellId, name: def.name, category: def.category, drain: def.drain }
        : { id: spellId, unknown: true };
    });

    // Enrich adept powers with metadata
    const powersDetailed = (character.adeptPowers || []).map((p) => {
      const def = getAdeptPowerDefinition(p.catalogId, ruleset);
      return def ? { ...p, name: def.name, baseCost: def.cost } : { ...p, unknown: true };
    });

    return NextResponse.json({
      success: true,
      magicState: {
        ...magicState,
        initiateGrade: character.initiateGrade || 0,
        metamagics: character.metamagics || [],
      },
      spellsKnown: spellsDetailed,
      powersKnown: powersDetailed,
      sustainedSpells: character.sustainedSpells || [],
      boundSpirits: character.spirits || [],
      activeFoci: character.activeFoci || [],
    });
  } catch (error) {
    console.error("Fetch magic state error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    const body = await request.json();
    const { sustainedSpells, spirits, activeFoci, metamagics, initiateGrade } = body;

    // Apply updates
    const updates: Partial<Character> = {};
    if (sustainedSpells !== undefined) updates.sustainedSpells = sustainedSpells;
    if (spirits !== undefined) updates.spirits = spirits;
    if (activeFoci !== undefined) updates.activeFoci = activeFoci;
    if (metamagics !== undefined) updates.metamagics = metamagics;
    if (initiateGrade !== undefined) updates.initiateGrade = initiateGrade;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true, message: "No changes applied" });
    }

    const updatedCharacter = {
      ...character,
      ...updates,
    };

    await saveCharacter(updatedCharacter);

    return NextResponse.json({
      success: true,
      character: {
        id: updatedCharacter.id,
        magicState: updates, // Return updated fields
      },
    });
  } catch (error) {
    console.error("Update magic state error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
