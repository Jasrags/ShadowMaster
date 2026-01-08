/**
 * API Route: /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/enhancements/[enhancementId]
 *
 * DELETE - Remove enhancement from cyberlimb
 *
 * Satisfies:
 * - Guarantee #4: "auditable record of modifications"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { removeEnhancement } from "@/lib/rules/augmentations/cyberlimb";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";

// =============================================================================
// TYPES
// =============================================================================

interface RemoveEnhancementResponse {
  success: boolean;
  removedEnhancement?: string;
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
 * DELETE - Remove enhancement from cyberlimb
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; limbId: string; enhancementId: string }> }
): Promise<NextResponse<RemoveEnhancementResponse>> {
  try {
    const { characterId, limbId, enhancementId } = await params;

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

    // Find the enhancement
    const enhancement = limb.enhancements.find(
      (e) => e.id === enhancementId || e.catalogId === enhancementId
    );
    if (!enhancement) {
      return NextResponse.json(
        { success: false, error: "Enhancement not found in this cyberlimb" },
        { status: 404 }
      );
    }

    const capacityRestored = enhancement.capacityUsed;
    const enhancementName = enhancement.name;

    // Remove the enhancement
    const updatedLimb = removeEnhancement(limb, enhancement.id);

    // Update cyberlimbs array
    const updatedLimbs = [...(character.cyberlimbs ?? [])];
    updatedLimbs[limbIndex] = updatedLimb;

    // Save with audit trail
    await updateCharacterWithAudit(
      userId,
      characterId,
      { cyberlimbs: updatedLimbs },
      {
        action: "cyberlimb_enhancement_removed",
        actor: { userId, role: "owner" },
        details: {
          limbId,
          limbName: limb.name,
          enhancementId,
          enhancementName,
          capacityRestored,
        },
        note: `Removed ${enhancementName} from ${limb.name}`,
      }
    );

    return NextResponse.json({
      success: true,
      removedEnhancement: enhancementName,
      capacityRestored,
      limbCapacityRemaining: updatedLimb.baseCapacity - updatedLimb.capacityUsed,
    });
  } catch (error) {
    console.error("Failed to remove enhancement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove enhancement" },
      { status: 500 }
    );
  }
}
