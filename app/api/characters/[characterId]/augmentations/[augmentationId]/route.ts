/**
 * API Route: /api/characters/[characterId]/augmentations/[augmentationId]
 *
 * GET - Get specific augmentation details
 * PUT - Update augmentation (grade upgrade)
 * DELETE - Remove augmentation
 *
 * Satisfies:
 * - Guarantee #4: "auditable record of modifications"
 * - Requirement: "Post-creation management MUST support removal and grade-level upgrading"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import {
  removeCyberware,
  removeBioware,
  upgradeAugmentationGrade,
} from "@/lib/rules/augmentations/management";
import type {
  Character,
  CyberwareGrade,
  BiowareGrade,
  CyberwareItem,
  BiowareItem,
} from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

interface UpdateAugmentationRequest {
  newGrade?: string;
}

interface AugmentationDetailResponse {
  success: boolean;
  augmentation?: CyberwareItem | BiowareItem;
  type?: "cyberware" | "bioware";
  error?: string;
}

interface UpdateAugmentationResponse {
  success: boolean;
  augmentation?: CyberwareItem | BiowareItem;
  essenceRefund?: number;
  error?: string;
}

interface RemoveAugmentationResponse {
  success: boolean;
  removedItem?: CyberwareItem | BiowareItem;
  essenceRestored?: number;
  error?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Find an augmentation by ID in a character's installed augmentations
 */
function findAugmentation(
  character: Character,
  augmentationId: string
): { item: CyberwareItem | BiowareItem; type: "cyberware" | "bioware" } | null {
  // Check cyberware first
  const cyberwareItem = (character.cyberware ?? []).find(
    (item) => item.id === augmentationId || item.catalogId === augmentationId
  );
  if (cyberwareItem) {
    return { item: cyberwareItem, type: "cyberware" };
  }

  // Check bioware
  const biowareItem = (character.bioware ?? []).find(
    (item) => item.id === augmentationId || item.catalogId === augmentationId
  );
  if (biowareItem) {
    return { item: biowareItem, type: "bioware" };
  }

  return null;
}

// =============================================================================
// ROUTE HANDLERS
// =============================================================================

/**
 * GET - Get specific augmentation details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; augmentationId: string }> }
): Promise<NextResponse<AugmentationDetailResponse>> {
  try {
    const { characterId, augmentationId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to view this character" },
        { status: 403 }
      );
    }

    // Find the augmentation
    const found = findAugmentation(character, augmentationId);
    if (!found) {
      return NextResponse.json(
        { success: false, error: "Augmentation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      augmentation: found.item,
      type: found.type,
    });
  } catch (error) {
    console.error("Failed to get augmentation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get augmentation" },
      { status: 500 }
    );
  }
}

/**
 * PUT - Update augmentation (grade upgrade)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; augmentationId: string }> }
): Promise<NextResponse<UpdateAugmentationResponse>> {
  try {
    const { characterId, augmentationId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to modify this character" },
        { status: 403 }
      );
    }

    // Find the augmentation to determine type
    const found = findAugmentation(character, augmentationId);
    if (!found) {
      return NextResponse.json(
        { success: false, error: "Augmentation not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body: UpdateAugmentationRequest = await request.json();
    const { newGrade } = body;

    if (!newGrade) {
      return NextResponse.json(
        { success: false, error: "newGrade is required for update" },
        { status: 400 }
      );
    }

    // Perform grade upgrade
    const isCyberware = found.type === "cyberware";
    const result = upgradeAugmentationGrade(
      character,
      augmentationId,
      newGrade as CyberwareGrade | BiowareGrade,
      isCyberware
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error ?? "Upgrade failed" },
        { status: 400 }
      );
    }

    // Save the updated character with audit trail
    await updateCharacterWithAudit(
      userId,
      characterId,
      {
        cyberware: result.character.cyberware,
        bioware: result.character.bioware,
        specialAttributes: result.character.specialAttributes,
      },
      {
        action: "augmentation_upgraded",
        actor: { userId, role: "owner" },
        details: {
          augmentationId,
          name: found.item.name,
          previousGrade: found.item.grade,
          newGrade,
          essenceRefund: result.essenceRefund,
        },
        note: `Upgraded ${found.item.name} to ${newGrade} grade`,
      }
    );

    return NextResponse.json({
      success: true,
      augmentation: result.upgradedItem,
      essenceRefund: result.essenceRefund,
    });
  } catch (error) {
    console.error("Failed to update augmentation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update augmentation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove augmentation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; augmentationId: string }> }
): Promise<NextResponse<RemoveAugmentationResponse>> {
  try {
    const { characterId, augmentationId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to modify this character" },
        { status: 403 }
      );
    }

    // Find the augmentation to determine type
    const found = findAugmentation(character, augmentationId);
    if (!found) {
      return NextResponse.json(
        { success: false, error: "Augmentation not found" },
        { status: 404 }
      );
    }

    // Remove the augmentation
    let result;
    if (found.type === "cyberware") {
      result = removeCyberware(character, augmentationId);
    } else {
      result = removeBioware(character, augmentationId);
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error ?? "Removal failed" },
        { status: 400 }
      );
    }

    // Save the updated character with audit trail
    await updateCharacterWithAudit(
      userId,
      characterId,
      {
        cyberware: result.character.cyberware,
        bioware: result.character.bioware,
        specialAttributes: result.character.specialAttributes,
        essenceHole: result.character.essenceHole,
      },
      {
        action: "augmentation_removed",
        actor: { userId, role: "owner" },
        details: {
          augmentationId,
          type: found.type,
          name: found.item.name,
          grade: found.item.grade,
          essenceRestored: result.essenceRestored,
        },
        note: `Removed ${found.item.name}`,
      }
    );

    return NextResponse.json({
      success: true,
      removedItem: result.removedItem,
      essenceRestored: result.essenceRestored,
    });
  } catch (error) {
    console.error("Failed to remove augmentation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove augmentation" },
      { status: 500 }
    );
  }
}
