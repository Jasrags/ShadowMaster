/**
 * API Route: /api/characters/[characterId]
 * 
 * GET - Get a specific character
 * PATCH - Update a character
 * DELETE - Delete a character
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  getCharacter,
  updateCharacter,
  deleteCharacter,
} from "@/lib/storage/characters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { characterId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      character,
    });
  } catch (error) {
    console.error("Failed to get character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get character" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { characterId } = await params;

    // Check character exists and belongs to user
    const existing = await getCharacter(userId, characterId);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Parse body
    const updates = await request.json();

    // Prevent changing certain fields
    delete updates.id;
    delete updates.ownerId;
    delete updates.createdAt;

    // Update character
    const character = await updateCharacter(userId, characterId, updates);

    return NextResponse.json({
      success: true,
      character,
    });
  } catch (error) {
    console.error("Failed to update character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update character" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { characterId } = await params;

    // Check character exists and belongs to user
    const existing = await getCharacter(userId, characterId);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Delete character
    await deleteCharacter(userId, characterId);

    return NextResponse.json({
      success: true,
      message: "Character deleted",
    });
  } catch (error) {
    console.error("Failed to delete character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete character" },
      { status: 500 }
    );
  }
}

