/**
 * API Route: /api/characters/[characterId]/admin/transition
 *
 * Admin-only character status transitions with validation override capability
 * and dual audit logging (character audit + admin audit).
 *
 * POST - Execute a status transition on any character
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { getCharacterById, updateCharacter } from "@/lib/storage/characters";
import {
  executeTransition,
  validateCharacterComplete,
  type TransitionContext,
} from "@/lib/rules/character/state-machine";
import { createUserAuditEntry } from "@/lib/storage/user-audit";
import type { CharacterStatus } from "@/lib/types";

/**
 * Request body for admin status transition
 */
interface AdminTransitionRequest {
  targetStatus: CharacterStatus;
  note: string; // Required for audit trail
  skipValidation?: boolean; // Admin override for validation failures
}

/**
 * POST /api/characters/[characterId]/admin/transition
 *
 * Execute a status transition as an administrator.
 * - Requires administrator role
 * - Requires a note/reason for audit trail
 * - Can optionally skip validation (admin override)
 * - Logs to both character audit and admin audit
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    // Require admin role
    const adminUser = await requireAdmin();

    // Parse params and body
    const { characterId } = await params;
    const body: AdminTransitionRequest = await request.json();
    const { targetStatus, note, skipValidation } = body;

    // Validate request
    if (!targetStatus) {
      return NextResponse.json(
        { success: false, error: "targetStatus is required" },
        { status: 400 }
      );
    }

    if (!note || note.trim() === "") {
      return NextResponse.json(
        { success: false, error: "A note/reason is required for admin status transitions" },
        { status: 400 }
      );
    }

    // Get character (admin can access any character)
    const character = await getCharacterById(characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // For draft -> active, run validation first to show errors even if skipping
    let validationResult = null;
    if (character.status === "draft" && targetStatus === "active") {
      validationResult = validateCharacterComplete(character);

      // If validation fails and not skipping, return errors
      if (!validationResult.valid && !skipValidation) {
        return NextResponse.json(
          {
            success: false,
            error: "Character validation failed",
            errors: validationResult.errors,
            warnings: validationResult.warnings,
            canOverride: true, // Tell UI that admin can override
          },
          { status: 400 }
        );
      }
    }

    // Execute transition via state machine
    const context: TransitionContext = {
      actor: { userId: adminUser.id, role: "admin" },
      note: note.trim(),
      skipValidation: skipValidation === true,
    };

    const result = await executeTransition(character, targetStatus, context);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Status transition failed",
          errors: result.errors,
          warnings: result.warnings,
        },
        { status: 400 }
      );
    }

    // Save the updated character
    // The state machine returns an updated character with new status and audit entry
    const savedCharacter = await updateCharacter(character.ownerId, characterId, result.character!);

    // Log to admin audit trail (separate from character audit)
    await createUserAuditEntry({
      action: "admin_character_status_changed",
      actor: { userId: adminUser.id, role: "admin" },
      targetUserId: character.ownerId,
      details: {
        characterId: character.id,
        characterName: character.name,
        fromStatus: character.status,
        toStatus: targetStatus,
        validationSkipped: skipValidation === true,
        validationErrors: validationResult?.errors?.map((e) => e.message),
        note: note.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      character: savedCharacter,
      auditEntry: result.auditEntry,
      warnings: result.warnings,
      transition: {
        from: character.status,
        to: targetStatus,
        validationSkipped: skipValidation === true,
      },
    });
  } catch (error) {
    // Handle auth errors from requireAdmin()
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }

    console.error("Admin status transition failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to transition status",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/characters/[characterId]/admin/transition
 *
 * Get available transitions for a character (for UI)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    // Require admin role
    await requireAdmin();

    const { characterId } = await params;

    // Get character
    const character = await getCharacterById(characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Define all possible transitions for admin (bidirectional)
    // Admins can move characters to any status
    const allStatuses: Array<{
      status: CharacterStatus;
      label: string;
      description: string;
    }> = [
      {
        status: "draft",
        label: "Revert to Draft",
        description: "Return this character to draft status for editing",
      },
      {
        status: "active",
        label: "Activate",
        description: "Set this character as active for play",
      },
      {
        status: "retired",
        label: "Retire",
        description: "Retire this character from active play",
      },
      {
        status: "deceased",
        label: "Mark Deceased",
        description: "Mark this character as deceased",
      },
    ];

    // Filter out current status and map to transition format
    const transitions = allStatuses
      .filter((s) => s.status !== character.status)
      .map((s) => ({
        to: s.status,
        label: s.label,
        description: s.description,
      }));

    // For draft, also get validation status
    let validation = null;
    if (character.status === "draft") {
      const validationResult = validateCharacterComplete(character);
      validation = {
        valid: validationResult.valid,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
      };
    }

    return NextResponse.json({
      success: true,
      characterId: character.id,
      characterName: character.name,
      currentStatus: character.status,
      ownerId: character.ownerId,
      transitions,
      validation,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("required")) {
      return NextResponse.json({ success: false, error: error.message }, { status: 403 });
    }

    console.error("Failed to get transitions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get transitions" },
      { status: 500 }
    );
  }
}
