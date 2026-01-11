/**
 * API Route: /api/characters/[characterId]/validate
 *
 * POST - Validate a character without finalizing
 *
 * Allows the creation wizard to perform server-side validation
 * in real-time without committing any state changes.
 *
 * Satisfies:
 * - Requirement: "Real-time validation MUST be enforced throughout
 *   the creation process, providing feedback on budget allocations
 *   and rule compliance"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";
import { validateCharacter } from "@/lib/rules/validation";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { loadCreationMethod } from "@/lib/rules/loader";
import type { CreationState } from "@/lib/types/creation";
import type { Campaign } from "@/lib/types/campaign";
import type { ValidationMode } from "@/lib/rules/validation/types";

interface ValidateRequestBody {
  /** Partial character updates to validate (merged with saved character) */
  updates?: Record<string, unknown>;
  /** Specific step to validate (optional) */
  stepId?: string;
  /** Validation mode */
  mode?: ValidationMode;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Parse request body
    let body: ValidateRequestBody = {};
    try {
      body = await request.json();
    } catch {
      // No body or invalid JSON - use defaults
    }

    const mode: ValidationMode = body.mode || "creation";

    // Merge updates if provided (for validating pending changes)
    const characterToValidate = body.updates ? { ...character, ...body.updates } : character;

    // Load ruleset
    const rulesetResult = await loadAndMergeRuleset(character.editionCode);
    if (!rulesetResult.success || !rulesetResult.ruleset) {
      return NextResponse.json(
        { success: false, error: rulesetResult.error || "Failed to load ruleset" },
        { status: 500 }
      );
    }
    const ruleset = rulesetResult.ruleset;

    // Load creation method if available
    let creationMethod;
    try {
      const loadedMethod = await loadCreationMethod(
        character.editionCode,
        character.creationMethodId
      );
      creationMethod = loadedMethod || undefined;
    } catch {
      // Creation method not found - continue without it
    }

    // Get creation state from character metadata
    const creationState = characterToValidate.metadata?.creationState as CreationState | undefined;

    // Load campaign if character is in one
    let campaign: Campaign | undefined;
    if (character.campaignId) {
      campaign = (await getCampaignById(character.campaignId)) || undefined;
    }

    // Run validation
    const validationResult = await validateCharacter({
      character: characterToValidate,
      ruleset,
      creationMethod,
      creationState,
      campaign,
      mode,
    });

    return NextResponse.json({
      success: true,
      validation: {
        valid: validationResult.valid,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
        completeness: validationResult.completeness,
        campaign: validationResult.campaign,
      },
    });
  } catch (error) {
    console.error("Failed to validate character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate character" },
      { status: 500 }
    );
  }
}
