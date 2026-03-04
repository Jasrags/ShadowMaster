/**
 * API Route: /api/characters/[characterId]/inventory/containers
 *
 * POST  - Add item to container
 * DELETE - Remove item from container
 * PATCH  - Move item between containers
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import {
  addItemToContainer,
  removeItemFromContainer,
  moveItemBetweenContainers,
  findGearItemById,
} from "@/lib/rules/inventory/container-manager";

// =============================================================================
// POST - Add item to container
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "edit");
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    const body = await request.json();
    const { itemId, containerId, slot } = body;

    if (!itemId || !containerId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: itemId, containerId" },
        { status: 400 }
      );
    }

    const result = addItemToContainer(character, itemId, containerId, slot);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const updated = result.character!;
    await updateCharacter(userId, characterId, {
      gear: updated.gear,
      weapons: updated.weapons,
      armor: updated.armor,
    });

    return NextResponse.json({
      success: true,
      container: { containerId, slot },
    });
  } catch (error) {
    console.error("Failed to add item to container:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add item to container" },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Remove item from container
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "edit");
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: itemId" },
        { status: 400 }
      );
    }

    // Capture current containment before removal
    const item = findGearItemById(character, itemId);
    const previousContainedIn = item?.state?.containedIn;

    const result = removeItemFromContainer(character, itemId);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const updated = result.character!;
    await updateCharacter(userId, characterId, {
      gear: updated.gear,
      weapons: updated.weapons,
      armor: updated.armor,
    });

    return NextResponse.json({
      success: true,
      removedFrom: previousContainedIn
        ? { containerId: previousContainedIn.containerId, slot: previousContainedIn.slot }
        : undefined,
    });
  } catch (error) {
    console.error("Failed to remove item from container:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove item from container" },
      { status: 500 }
    );
  }
}

// =============================================================================
// PATCH - Move item between containers
// =============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "edit");
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    const body = await request.json();
    const { itemId, newContainerId, slot } = body;

    if (!itemId || !newContainerId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: itemId, newContainerId" },
        { status: 400 }
      );
    }

    const result = moveItemBetweenContainers(character, itemId, newContainerId, slot);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const updated = result.character!;
    await updateCharacter(userId, characterId, {
      gear: updated.gear,
      weapons: updated.weapons,
      armor: updated.armor,
    });

    return NextResponse.json({
      success: true,
      container: { containerId: newContainerId, slot },
    });
  } catch (error) {
    console.error("Failed to move item between containers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to move item between containers" },
      { status: 500 }
    );
  }
}
