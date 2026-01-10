/**
 * Character Migration API
 *
 * Provides endpoints for applying and rolling back migrations.
 *
 * POST /api/characters/[characterId]/sync/migrate
 *   Applies a migration plan to the character
 *
 * DELETE /api/characters/[characterId]/sync/migrate
 *   Rolls back the last migration (if available)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacterById, rollbackMigration } from "@/lib/storage/characters";
import { executeMigration, validateMigrationPlan } from "@/lib/rules/sync/migration-engine";
import {
  recordMigrationStart,
  recordMigrationComplete,
  recordMigrationRollback,
} from "@/lib/rules/sync/sync-audit";
import type { MigrationPlan } from "@/lib/types";

interface RouteParams {
  params: Promise<{
    characterId: string;
  }>;
}

/**
 * POST /api/characters/[characterId]/sync/migrate
 *
 * Applies a migration plan to the character
 */
export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    // Verify session
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    // Get character
    const character = await getCharacterById(characterId);
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    // Verify ownership
    if (character.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const plan = body.plan as MigrationPlan;

    if (!plan) {
      return NextResponse.json({ error: "Migration plan is required" }, { status: 400 });
    }

    // Validate plan
    const validation = validateMigrationPlan(character, plan);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid migration plan",
          errors: validation.errors,
          warnings: validation.warnings,
        },
        { status: 400 }
      );
    }

    // Record migration start
    await recordMigrationStart(userId, character, plan);

    // Execute migration
    const result = await executeMigration(userId, character, plan);

    if (result.success) {
      // Record completion
      await recordMigrationComplete(userId, character, plan, result);

      return NextResponse.json({
        success: true,
        character: result.character,
        appliedSteps: result.appliedSteps.length,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          appliedSteps: result.appliedSteps.length,
          rollbackAvailable: result.rollbackAvailable,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error applying migration:", error);
    return NextResponse.json({ error: "Failed to apply migration" }, { status: 500 });
  }
}

/**
 * DELETE /api/characters/[characterId]/sync/migrate
 *
 * Rolls back the last migration if available
 */
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Verify session
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    // Get character
    const character = await getCharacterById(characterId);
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    // Verify ownership
    if (character.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Attempt rollback
    const rolledBackCharacter = await rollbackMigration(userId, characterId);

    if (rolledBackCharacter) {
      // Record rollback - create a minimal plan for the audit trail
      const rollbackPlan: MigrationPlan = {
        id: "rollback",
        characterId,
        sourceVersion: character.rulesetVersion || {
          editionCode: character.editionCode,
          editionVersion: "1.0.0",
          bookVersions: {},
          snapshotId: character.rulesetSnapshotId,
          createdAt: character.createdAt,
        },
        targetVersion: rolledBackCharacter.rulesetVersion || {
          editionCode: rolledBackCharacter.editionCode,
          editionVersion: "1.0.0",
          bookVersions: {},
          snapshotId: rolledBackCharacter.rulesetSnapshotId,
          createdAt: rolledBackCharacter.createdAt,
        },
        steps: [],
        isComplete: true,
        estimatedKarmaDelta: 0,
      };

      await recordMigrationRollback(userId, character, rollbackPlan, "User requested rollback");

      return NextResponse.json({
        success: true,
        character: rolledBackCharacter,
      });
    } else {
      return NextResponse.json({ error: "No rollback available" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error rolling back migration:", error);
    return NextResponse.json({ error: "Failed to rollback migration" }, { status: 500 });
  }
}
