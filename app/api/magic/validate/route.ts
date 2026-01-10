/**
 * API Route: /api/magic/validate
 *
 * POST - Validate magic configuration (tradition, spells, powers)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacterById } from "@/lib/storage/characters";
import {
  validateTraditionEligibility,
  validateSpellAllocation,
  validateAdeptPowerAllocation,
  getEssenceMagicState,
} from "@/lib/rules/magic";
import { extractAugmentationRules } from "@/lib/rules/loader";
import type { EditionCode, MagicalPath, Character } from "@/lib/types";

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
      editionCode,
      traditionId,
      spellIds,
      adeptPowers, // Array of { id, rating, specification }
      magicalPath,
      spellLimit,
      powerPointBudget,
    } = body;

    let character: Character | null = null;
    let finalEditionCode: EditionCode = editionCode;
    let finalMagicalPath: MagicalPath = magicalPath;

    // Load character if ID provided
    if (characterId) {
      character = await getCharacterById(characterId);
      if (!character) {
        return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
      }
      finalEditionCode = character.editionCode;
      finalMagicalPath = character.magicalPath;
    }

    if (!finalEditionCode) {
      return NextResponse.json(
        { success: false, error: "Edition code is required" },
        { status: 400 }
      );
    }

    // Load ruleset
    const { loadRuleset } = await import("@/lib/rules/loader");
    const loadResult = await loadRuleset({
      editionCode: finalEditionCode,
      bookIds: character?.attachedBookIds,
    });

    if (!loadResult.success || !loadResult.ruleset) {
      return NextResponse.json(
        { success: false, error: loadResult.error || "Failed to load ruleset" },
        { status: 500 }
      );
    }

    const ruleset = loadResult.ruleset;
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Tradition Validation
    if (traditionId) {
      const traditionResult = validateTraditionEligibility(
        character || { magicalPath: finalMagicalPath },
        traditionId,
        ruleset
      );
      if (!traditionResult.valid) {
        errors.push(...traditionResult.errors.map((e) => e.message));
      }
    }

    // 2. Spell Validation
    if (spellIds && Array.isArray(spellIds)) {
      const spellResult = validateSpellAllocation(
        character || { magicalPath: finalMagicalPath },
        spellIds,
        spellLimit || 6, // Fallback to 6 if not provided
        ruleset
      );
      if (!spellResult.valid) {
        errors.push(...spellResult.errors.map((e) => e.message));
      }
      if (spellResult.warnings) {
        warnings.push(...spellResult.warnings.map((w) => (typeof w === "string" ? w : w.message)));
      }
    }

    // 3. Adept Power Validation
    if (adeptPowers && Array.isArray(adeptPowers)) {
      const powerResult = validateAdeptPowerAllocation(
        character || { magicalPath: finalMagicalPath },
        adeptPowers,
        powerPointBudget || 6, // Fallback to 6 if not provided
        ruleset
      );
      if (!powerResult.valid) {
        errors.push(...powerResult.errors.map((e) => e.message));
      }
    }

    // 4. Essence-Magic State (if character data available)
    let essenceMagicStatus = null;
    if (character) {
      const augmentationRules = extractAugmentationRules(ruleset);
      const state = getEssenceMagicState(character, augmentationRules);
      essenceMagicStatus = {
        effectiveMagic: state.effectiveMagicRating,
        magicLost: state.magicLostToEssence,
        isBurnedOut: state.effectiveMagicRating === 0,
      };
    }

    return NextResponse.json({
      success: true,
      valid: errors.length === 0,
      errors,
      warnings,
      essenceMagicStatus,
    });
  } catch (error) {
    console.error("Magic validation error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
