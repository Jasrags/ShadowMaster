/**
 * API Route: /api/characters
 * 
 * GET - List characters for the authenticated user
 * POST - Create a new character draft
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import {
  getUserCharacters,
  createCharacterDraft,
  getCharactersByStatus,
} from "@/lib/storage/characters";
import type { CharacterStatus, EditionCode } from "@/lib/types";

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
    const status = searchParams.get("status") as CharacterStatus | null;
    const edition = searchParams.get("edition");

    // Get characters
    let characters = status
      ? await getCharactersByStatus(user.id, status)
      : await getUserCharacters(user.id);

    // Filter by edition if specified
    if (edition) {
      characters = characters.filter((c) => c.editionCode === edition);
    }

    // Sort by updated date, most recent first
    characters.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json({
      success: true,
      characters,
      count: characters.length,
    });
  } catch (error) {
    console.error("Failed to get characters:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get characters" },
      { status: 500 }
    );
  }
}

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
    const { editionId, editionCode, creationMethodId, name } = body;

    // Validate required fields
    if (!editionId || !editionCode || !creationMethodId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: editionId, editionCode, creationMethodId" },
        { status: 400 }
      );
    }

    // Create draft
    const draft = await createCharacterDraft(
      user.id,
      editionId,
      editionCode as EditionCode,
      creationMethodId,
      name
    );

    return NextResponse.json({
      success: true,
      character: draft,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create character" },
      { status: 500 }
    );
  }
}

