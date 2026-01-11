/**
 * Character Sync Status API
 *
 * Provides endpoints for checking and analyzing character sync status.
 *
 * GET /api/characters/[characterId]/sync
 *   Returns the current sync status and legality status
 *
 * POST /api/characters/[characterId]/sync/analyze
 *   Triggers drift analysis and returns a drift report
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter } from "@/lib/storage/characters";
import { analyzeCharacterDrift } from "@/lib/rules/sync/drift-analyzer";
import {
  getLegalityShield,
  getQuickSyncStatus,
  getQuickLegalityStatus,
} from "@/lib/rules/sync/legality-validator";
import { generateMigrationPlan } from "@/lib/rules/sync/migration-engine";
import { SnapshotCache } from "@/lib/storage/snapshot-cache";

interface RouteParams {
  params: Promise<{
    characterId: string;
  }>;
}

/**
 * GET /api/characters/[characterId]/sync
 *
 * Returns the current sync status for a character
 */
export async function GET(_request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    // Verify session
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    // Get character (fast path using userId)
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    // Get quick status
    const syncStatus = getQuickSyncStatus(character);
    const legalityStatus = getQuickLegalityStatus(character);

    // Create request-scoped cache to avoid redundant disk reads
    const cache = new SnapshotCache();

    // Get shield for UI
    const shield = await getLegalityShield(character, cache);

    return NextResponse.json({
      syncStatus,
      legalityStatus,
      shield,
      lastSyncCheck: character.lastSyncCheck,
      lastSyncAt: character.lastSyncAt,
      pendingMigration: character.pendingMigration,
    });
  } catch (error) {
    console.error("Error getting sync status:", error);
    return NextResponse.json({ error: "Failed to get sync status" }, { status: 500 });
  }
}

/**
 * POST /api/characters/[characterId]/sync
 *
 * Triggers drift analysis and returns a report with migration plan
 */
export async function POST(_request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    // Verify session
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    // Get character (fast path using userId)
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    // Create request-scoped cache to avoid redundant disk reads
    const cache = new SnapshotCache();

    // Analyze drift
    const report = await analyzeCharacterDrift(character, cache);

    // Generate migration plan
    const plan = generateMigrationPlan(report);

    return NextResponse.json({
      report,
      plan,
      syncStatus: report.changes.length > 0 ? "outdated" : "synchronized",
    });
  } catch (error) {
    console.error("Error analyzing drift:", error);
    return NextResponse.json({ error: "Failed to analyze drift" }, { status: 500 });
  }
}
