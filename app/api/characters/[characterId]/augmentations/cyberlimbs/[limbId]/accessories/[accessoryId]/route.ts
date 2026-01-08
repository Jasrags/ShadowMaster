/**
 * API Route: /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/accessories/[accessoryId]
 *
 * DELETE - Remove accessory from cyberlimb
 *
 * Satisfies:
 * - Guarantee #4: "auditable record of modifications"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { removeAccessory } from "@/lib/rules/augmentations/cyberlimb";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";

// =============================================================================
// TYPES
// =============================================================================

interface RemoveAccessoryResponse {
  success: boolean;
  removedAccessory?: string;
  capacityRestored?: number;
  limbCapacityRemaining?: number;
  error?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

function findLimb(
  character: { cyberlimbs?: CyberlimbItem[] },
  limbId: string
): { limb: CyberlimbItem; index: number } | undefined {
  const limbs = character.cyberlimbs ?? [];
  const index = limbs.findIndex((l) => l.id === limbId || l.catalogId === limbId);
  if (index === -1) return undefined;
  return { limb: limbs[index], index };
}

// =============================================================================
// ROUTE HANDLERS
// =============================================================================

/**
 * DELETE - Remove accessory from cyberlimb
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; limbId: string; accessoryId: string }> }
): Promise<NextResponse<RemoveAccessoryResponse>> {
  try {
    const { characterId, limbId, accessoryId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 }
      );
    }

    // Find the limb
    const limbResult = findLimb(character, limbId);
    if (!limbResult) {
      return NextResponse.json(
        { success: false, error: "Cyberlimb not found" },
        { status: 404 }
      );
    }
    const { limb, index: limbIndex } = limbResult;

    // Find the accessory
    const accessory = limb.accessories.find(
      (a) => a.id === accessoryId || a.catalogId === accessoryId
    );
    if (!accessory) {
      return NextResponse.json(
        { success: false, error: "Accessory not found in this cyberlimb" },
        { status: 404 }
      );
    }

    const capacityRestored = accessory.capacityUsed;
    const accessoryName = accessory.name;

    // Remove the accessory
    const updatedLimb = removeAccessory(limb, accessory.id);

    // Update cyberlimbs array
    const updatedLimbs = [...(character.cyberlimbs ?? [])];
    updatedLimbs[limbIndex] = updatedLimb;

    // Save with audit trail
    await updateCharacterWithAudit(
      userId,
      characterId,
      { cyberlimbs: updatedLimbs },
      {
        action: "cyberlimb_accessory_removed",
        actor: { userId, role: "owner" },
        details: {
          limbId,
          limbName: limb.name,
          accessoryId,
          accessoryName,
          capacityRestored,
        },
        note: `Removed ${accessoryName} from ${limb.name}`,
      }
    );

    return NextResponse.json({
      success: true,
      removedAccessory: accessoryName,
      capacityRestored,
      limbCapacityRemaining: updatedLimb.baseCapacity - updatedLimb.capacityUsed,
    });
  } catch (error) {
    console.error("Failed to remove accessory:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove accessory" },
      { status: 500 }
    );
  }
}
