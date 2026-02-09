/**
 * API Route: /api/characters/[characterId]/finalize
 *
 * POST - Finalize a character draft (change status from draft to active)
 *
 * Uses the validation engine and state machine to:
 * - Validate the character is complete and rule-compliant
 * - Enforce the draft → active transition rules
 * - Handle campaign approval requirements
 * - Create an audit trail entry
 *
 * Satisfies:
 * - Constraint: "Validation failures MUST prevent character finalization"
 * - Guarantee: "Every character transition to an active state MUST satisfy
 *   the full set of ruleset-defined validation criteria"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCharacter } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import {
  executeTransition,
  createAuditEntry,
  appendAuditEntry,
  type TransitionContext,
} from "@/lib/rules/character/state-machine";
import { validateForFinalization, materializeFromCreationState } from "@/lib/rules/validation";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { loadCreationMethod } from "@/lib/rules/loader";
import type { CreationState } from "@/lib/types/creation";
import type { Campaign } from "@/lib/types/campaign";

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

    // Authorize the finalize action
    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "finalize");

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    // Check character is a draft
    if (character.status !== "draft") {
      return NextResponse.json(
        { success: false, error: "Character is not a draft" },
        { status: 400 }
      );
    }

    // Load ruleset for validation
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

    // Get creation state from character metadata if available
    const creationState = character.metadata?.creationState as CreationState | undefined;

    // Materialize creation selections to top-level character fields.
    // During creation, all data lives in metadata.creationState.selections;
    // top-level fields (metatype, attributes, skills, etc.) remain at defaults.
    // Materializing ensures validators and post-creation systems find the data.
    const materializedCharacter = (
      creationState ? materializeFromCreationState(character, creationState) : character
    ) as typeof character;

    // Load campaign if character is in one
    let campaign: Campaign | undefined;
    if (materializedCharacter.campaignId) {
      campaign = (await getCampaignById(materializedCharacter.campaignId)) || undefined;
    }

    // Run comprehensive validation
    const validationResult = await validateForFinalization(
      materializedCharacter,
      ruleset,
      creationMethod,
      creationState,
      campaign
    );

    if (!validationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Character validation failed",
          validation: {
            errors: validationResult.errors,
            warnings: validationResult.warnings,
            completeness: validationResult.completeness,
          },
        },
        { status: 400 }
      );
    }

    // Check campaign approval requirement
    if (campaign && validationResult.campaign?.requiresApproval) {
      // Character needs GM approval - set to pending instead of active
      const auditEntry = createAuditEntry({
        action: "approval_requested",
        actor: { userId, role: authResult.role },
        details: {
          campaignId: campaign.id,
          campaignName: campaign.title,
        },
        note: "Character submitted for GM approval",
      });

      const characterWithApproval = appendAuditEntry(
        {
          ...materializedCharacter,
          approvalStatus: "pending",
          updatedAt: new Date().toISOString(),
        },
        auditEntry
      );

      const updatedCharacter = await updateCharacter(userId, characterId, characterWithApproval);

      return NextResponse.json({
        success: true,
        character: updatedCharacter,
        requiresApproval: true,
        message: "Character submitted for GM approval",
        warnings: validationResult.warnings,
      });
    }

    // Execute the state transition using the state machine
    const transitionContext: TransitionContext = {
      actor: {
        userId,
        role: authResult.role,
      },
      note: "Character finalized via API",
    };

    const transitionResult = await executeTransition(
      materializedCharacter,
      "active",
      transitionContext
    );

    if (!transitionResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "State transition failed",
          errors: transitionResult.errors,
          warnings: transitionResult.warnings,
        },
        { status: 400 }
      );
    }

    // Persist the updated character with new status and audit entry
    const updatedCharacter = await updateCharacter(
      userId,
      characterId,
      transitionResult.character!
    );

    return NextResponse.json({
      success: true,
      character: updatedCharacter,
      warnings: [...(validationResult.warnings || []), ...(transitionResult.warnings || [])],
    });
  } catch (error) {
    console.error("Failed to finalize character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to finalize character" },
      { status: 500 }
    );
  }
}
