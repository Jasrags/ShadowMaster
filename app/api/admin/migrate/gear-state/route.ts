/**
 * Admin API: Migrate Gear State
 *
 * Batch migration endpoint for adding gear state fields to existing characters.
 *
 * POST: Run migration on all characters (or specific characters by ID)
 * GET: Preview migration without applying changes
 *
 * Requires administrator role.
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import {
  getAllCharacters,
  getCharacterById,
  updateCharacter,
} from "@/lib/storage/characters";
import {
  needsGearStateMigration,
  migrateCharacterGearState,
  migrateCharactersGearState,
  getMigrationSummary,
} from "@/lib/migrations/add-gear-state";
import type { Character } from "@/lib/types";

// =============================================================================
// HELPERS
// =============================================================================

async function requireAdmin(): Promise<
  | { authorized: true; userId: string }
  | { authorized: false; response: NextResponse }
> {
  const userId = await getSession();

  if (!userId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  const user = await getUserById(userId);
  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "User not found" }, { status: 404 }),
    };
  }

  if (!user.role.includes("administrator")) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Administrator access required" },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, userId };
}

// =============================================================================
// GET: Preview Migration
// =============================================================================

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authResult = await requireAdmin();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const characterIdsParam = searchParams.get("characterIds");
    const characterIds = characterIdsParam?.split(",").filter(Boolean);

    let charactersToCheck: Character[];

    if (characterIds && characterIds.length > 0) {
      // Get specific characters
      const results = await Promise.all(
        characterIds.map((id) => getCharacterById(id.trim()))
      );
      charactersToCheck = results.filter((c): c is Character => c !== null);
    } else {
      // Get all characters
      charactersToCheck = await getAllCharacters();
    }

    // Check which need migration
    const migrationPreview = charactersToCheck.map((character) => ({
      characterId: character.id,
      characterName: character.name,
      ownerId: character.ownerId,
      needsMigration: needsGearStateMigration(character),
    }));

    const needingMigration = migrationPreview.filter((p) => p.needsMigration);

    return NextResponse.json({
      total: migrationPreview.length,
      needingMigration: needingMigration.length,
      alreadyMigrated: migrationPreview.length - needingMigration.length,
      characters: migrationPreview,
    });
  } catch (error) {
    console.error("Migration preview error:", error);
    return NextResponse.json(
      { error: "Failed to preview migration" },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST: Execute Migration
// =============================================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  const authResult = await requireAdmin();
  if (!authResult.authorized) {
    return authResult.response;
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { characterIds, dryRun = false } = body as {
      characterIds?: string[];
      dryRun?: boolean;
    };

    let charactersToMigrate: Character[];

    if (characterIds && characterIds.length > 0) {
      // Get specific characters
      const results = await Promise.all(
        characterIds.map((id) => getCharacterById(id.trim()))
      );
      charactersToMigrate = results.filter((c): c is Character => c !== null);
    } else {
      // Get all characters
      charactersToMigrate = await getAllCharacters();
    }

    // Run migration analysis
    const batchResult = migrateCharactersGearState(charactersToMigrate);

    // If not dry run, save migrated characters
    if (!dryRun) {
      const saveResults: { characterId: string; saved: boolean; error?: string }[] = [];

      for (const char of charactersToMigrate) {
        const migrationResult = batchResult.results.find(
          (r) => r.characterId === char.id
        );

        if (migrationResult?.success && migrationResult.changes.length > 0) {
          // Get the migrated character
          const { character: migratedChar } = migrateCharacterGearState(char);

          try {
            await updateCharacter(char.ownerId, char.id, migratedChar);
            saveResults.push({ characterId: char.id, saved: true });
          } catch (error) {
            saveResults.push({
              characterId: char.id,
              saved: false,
              error: error instanceof Error ? error.message : "Save failed",
            });
          }
        }
      }

      return NextResponse.json({
        ...batchResult,
        summary: getMigrationSummary(batchResult),
        saveResults,
        dryRun: false,
      });
    }

    return NextResponse.json({
      ...batchResult,
      summary: getMigrationSummary(batchResult),
      dryRun: true,
      message: "Dry run complete. No changes saved. Set dryRun=false to apply.",
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Failed to execute migration" },
      { status: 500 }
    );
  }
}
