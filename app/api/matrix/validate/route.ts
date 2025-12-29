/**
 * API Route: /api/matrix/validate
 *
 * POST - Validate matrix configuration (deck config + programs)
 *
 * Satisfies:
 * - Requirement: "The system MUST enforce mandatory hardware-specific attribute requirements"
 * - Requirement: "Active program slots MUST be constrained by hardware-specific limits"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { loadRuleset } from "@/lib/rules/loader";
import type {
  ValidateMatrixConfigRequest,
  ValidateMatrixConfigResponse,
  CyberdeckAttributeConfig,
} from "@/lib/types/matrix";
import {
  validateCyberdeckConfig,
  getCharacterCyberdecks,
} from "@/lib/rules/matrix/cyberdeck-validator";
import { validateProgramAllocation } from "@/lib/rules/matrix/program-validator";

// =============================================================================
// POST - Validate Matrix Configuration
// =============================================================================

export async function POST(
  request: NextRequest
): Promise<NextResponse<ValidateMatrixConfigResponse | { error: string }>> {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse request
    const body: ValidateMatrixConfigRequest = await request.json();
    const { characterId, deckId, programIds, config } = body;

    // Validate required fields
    if (!characterId) {
      return NextResponse.json(
        { error: "characterId is required" },
        { status: 400 }
      );
    }

    if (!deckId) {
      return NextResponse.json(
        { error: "deckId is required" },
        { status: 400 }
      );
    }

    if (!config) {
      return NextResponse.json(
        { error: "config is required" },
        { status: 400 }
      );
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to validate this character's config" },
        { status: 403 }
      );
    }

    // Find the specified deck
    const cyberdecks = getCharacterCyberdecks(character);
    const deck = cyberdecks.find(
      (d) => d.id === deckId || d.catalogId === deckId
    );

    if (!deck) {
      return NextResponse.json(
        { error: "Cyberdeck not found" },
        { status: 404 }
      );
    }

    // Validate deck configuration
    const deckValidation = validateCyberdeckConfig(config, deck.attributeArray);

    // Validate program allocation (if programs specified)
    let programValidation = null;
    if (programIds && programIds.length > 0) {
      // Load ruleset to check programs exist
      const editionCode = character.editionCode ?? "sr5";
      const loadResult = await loadRuleset({
        editionCode,
        bookIds: character.attachedBookIds,
      });

      if (!loadResult.success || !loadResult.ruleset) {
        return NextResponse.json(
          { error: loadResult.error || "Failed to load ruleset" },
          { status: 500 }
        );
      }

      programValidation = validateProgramAllocation(
        character,
        programIds,
        loadResult.ruleset
      );
    }

    // Combine results
    const allErrors = [
      ...deckValidation.errors,
      ...(programValidation?.errors ?? []),
    ];

    const allWarnings = [
      ...deckValidation.warnings,
      ...(programValidation?.warnings ?? []),
    ];

    const response: ValidateMatrixConfigResponse = {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      effectiveStats: config,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to validate matrix config:", error);
    return NextResponse.json(
      { error: "Failed to validate matrix configuration" },
      { status: 500 }
    );
  }
}
