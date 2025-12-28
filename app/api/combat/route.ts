/**
 * API Route: /api/combat
 *
 * GET - List combat sessions for the authenticated user
 * POST - Create a new combat session
 *
 * Satisfies:
 * - Requirement: "maintain a persistent and auditable history of all action attempts"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import {
  createCombatSession,
  listCombatSessions,
  type CombatSessionQuery,
} from "@/lib/storage/combat";
import type { CombatSessionStatus, EnvironmentConditions } from "@/lib/types";

/**
 * GET /api/combat
 *
 * Query Parameters:
 * - campaignId: Filter by campaign
 * - status: Filter by status (active, paused, completed, abandoned)
 * - includeCompleted: Include completed sessions (default: false)
 * - limit: Number of results (default: 20, max: 50)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");
    const status = searchParams.get("status") as CombatSessionStatus | null;
    const includeCompleted = searchParams.get("includeCompleted") === "true";
    const limitParam = searchParams.get("limit");

    // Build query
    const query: CombatSessionQuery = {
      ownerId: user.id,
      includeCompleted,
      limit: Math.min(parseInt(limitParam || "20", 10), 50),
    };

    if (campaignId) {
      query.campaignId = campaignId;
    }

    if (status) {
      query.status = status;
    }

    // Execute query
    const sessions = await listCombatSessions(query);

    return NextResponse.json({
      success: true,
      sessions,
      total: sessions.length,
    });
  } catch (error) {
    console.error("Failed to list combat sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to list combat sessions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/combat
 *
 * Create a new combat session.
 *
 * Body:
 * - name: Optional session name
 * - campaignId: Optional campaign ID
 * - editionCode: Edition code (required)
 * - environment: Optional environment conditions
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Parse body
    const body = await request.json();
    const { name, campaignId, editionCode, environment } = body;

    // Validate required fields
    if (!editionCode) {
      return NextResponse.json(
        { success: false, error: "Missing required field: editionCode" },
        { status: 400 }
      );
    }

    // Default environment
    const defaultEnvironment: EnvironmentConditions = {
      lighting: "normal",
      weather: "clear",
      terrain: "urban",
      visibility: 100,
      backgroundCount: 0,
      noise: 0,
      ...environment,
    };

    // Create session
    const session = await createCombatSession({
      name: name || `Combat Session - ${new Date().toLocaleDateString()}`,
      ownerId: user.id,
      campaignId,
      editionCode,
      status: "active",
      round: 1,
      currentTurn: 0,
      currentPhase: "initiative",
      participants: [],
      initiativeOrder: [],
      environment: defaultEnvironment,
    });

    return NextResponse.json(
      {
        success: true,
        session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create combat session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create combat session" },
      { status: 500 }
    );
  }
}
