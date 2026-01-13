/**
 * API Route: /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/accessories
 *
 * POST - Add accessory to cyberlimb
 *
 * Satisfies:
 * - Requirement: "Cybernetic limbs MUST manage internal capacity constraints"
 * - Guarantee #4: "auditable record of modifications"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { loadRuleset, extractCyberware } from "@/lib/rules/loader";
import { validateAccessoryInstall, addAccessory } from "@/lib/rules/augmentations/cyberlimb";
import type { CyberwareCatalogItem } from "@/lib/types/edition";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";

// =============================================================================
// TYPES
// =============================================================================

interface AddAccessoryRequest {
  catalogId: string;
  rating?: number;
}

interface AddAccessoryResponse {
  success: boolean;
  accessory?: {
    id: string;
    catalogId: string;
    name: string;
    rating?: number;
    capacityUsed: number;
    cost: number;
  };
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
 * POST - Add accessory to cyberlimb
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; limbId: string }> }
): Promise<NextResponse<AddAccessoryResponse>> {
  try {
    const { characterId, limbId } = await params;

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
      return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
    }

    // Find the limb
    const limbResult = findLimb(character, limbId);
    if (!limbResult) {
      return NextResponse.json({ success: false, error: "Cyberlimb not found" }, { status: 404 });
    }
    const { limb, index: limbIndex } = limbResult;

    // Parse request body
    const body: AddAccessoryRequest = await request.json();
    const { catalogId, rating } = body;

    // Validate required fields
    if (!catalogId) {
      return NextResponse.json({ success: false, error: "catalogId is required" }, { status: 400 });
    }

    // Load ruleset to get catalog
    const editionCode = character.editionCode ?? "sr5";
    const loadResult = await loadRuleset({ editionCode });
    if (!loadResult.success || !loadResult.ruleset) {
      return NextResponse.json(
        { success: false, error: `Failed to load ruleset for edition: ${editionCode}` },
        { status: 500 }
      );
    }

    // Find the accessory catalog item
    const cyberwareData = extractCyberware(loadResult.ruleset);
    const catalogItem = cyberwareData?.catalog?.find(
      (item) => item.id === catalogId && item.category === "cyberlimb-accessory"
    );

    if (!catalogItem) {
      return NextResponse.json(
        { success: false, error: `Cyberlimb accessory not found: ${catalogId}` },
        { status: 404 }
      );
    }

    // Validate the accessory can be installed
    const validationResult = validateAccessoryInstall(limb, catalogItem, character);
    if (!validationResult.valid) {
      return NextResponse.json({ success: false, error: validationResult.error }, { status: 400 });
    }

    // Add the accessory
    const updatedLimb = addAccessory(limb, catalogItem, rating);

    // Get the newly added accessory
    const newAccessory = updatedLimb.accessories[updatedLimb.accessories.length - 1];

    // Update cyberlimbs array
    const updatedLimbs = [...(character.cyberlimbs ?? [])];
    updatedLimbs[limbIndex] = updatedLimb;

    // Save with audit trail
    await updateCharacterWithAudit(
      userId,
      characterId,
      { cyberlimbs: updatedLimbs },
      {
        action: "cyberlimb_accessory_added",
        actor: { userId, role: "owner" },
        details: {
          limbId,
          limbName: limb.name,
          accessoryId: newAccessory.id,
          accessoryName: newAccessory.name,
          rating: newAccessory.rating,
          capacityUsed: newAccessory.capacityUsed,
        },
        note: `Added ${newAccessory.name}${newAccessory.rating ? ` R${newAccessory.rating}` : ""} to ${limb.name}`,
      }
    );

    return NextResponse.json({
      success: true,
      accessory: {
        id: newAccessory.id,
        catalogId: newAccessory.catalogId,
        name: newAccessory.name,
        rating: newAccessory.rating,
        capacityUsed: newAccessory.capacityUsed,
        cost: newAccessory.cost,
      },
      limbCapacityRemaining: updatedLimb.baseCapacity - updatedLimb.capacityUsed,
    });
  } catch (error) {
    console.error("Failed to add accessory:", error);
    return NextResponse.json({ success: false, error: "Failed to add accessory" }, { status: 500 });
  }
}
