/**
 * API Route: /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]/enhancements
 *
 * POST - Add enhancement to cyberlimb
 *
 * Satisfies:
 * - Requirement: "Cybernetic limbs MUST manage internal capacity constraints"
 * - Guarantee #4: "auditable record of modifications"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { loadRuleset, extractCyberware } from "@/lib/rules/loader";
import {
  validateEnhancementInstall,
  addEnhancement,
} from "@/lib/rules/augmentations/cyberlimb";
import type { CyberwareGrade } from "@/lib/types";
import type { CyberwareCatalogItem } from "@/lib/types/edition";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";

// =============================================================================
// TYPES
// =============================================================================

interface AddEnhancementRequest {
  catalogId: string;
  rating: number;
  grade?: CyberwareGrade;
}

interface AddEnhancementResponse {
  success: boolean;
  enhancement?: {
    id: string;
    catalogId: string;
    name: string;
    enhancementType: string;
    rating: number;
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
 * POST - Add enhancement to cyberlimb
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; limbId: string }> }
): Promise<NextResponse<AddEnhancementResponse>> {
  try {
    const { characterId, limbId } = await params;

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

    // Parse request body
    const body: AddEnhancementRequest = await request.json();
    const { catalogId, rating, grade } = body;

    // Validate required fields
    if (!catalogId) {
      return NextResponse.json(
        { success: false, error: "catalogId is required" },
        { status: 400 }
      );
    }
    if (rating === undefined || rating < 1) {
      return NextResponse.json(
        { success: false, error: "rating is required and must be >= 1" },
        { status: 400 }
      );
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

    // Find the enhancement catalog item
    const cyberwareData = extractCyberware(loadResult.ruleset);
    const catalogItem = cyberwareData?.catalog?.find(
      (item) => item.id === catalogId && item.category === "cyberlimb-enhancement"
    );

    if (!catalogItem) {
      return NextResponse.json(
        { success: false, error: `Cyberlimb enhancement not found: ${catalogId}` },
        { status: 404 }
      );
    }

    // Validate the enhancement can be installed
    const validationResult = validateEnhancementInstall(limb, catalogItem, rating);
    if (!validationResult.valid) {
      return NextResponse.json(
        { success: false, error: validationResult.error },
        { status: 400 }
      );
    }

    // Add the enhancement
    const effectiveGrade = grade ?? limb.grade;
    const updatedLimb = addEnhancement(limb, catalogItem, rating, effectiveGrade);

    // Get the newly added enhancement
    const newEnhancement = updatedLimb.enhancements[updatedLimb.enhancements.length - 1];

    // Update cyberlimbs array
    const updatedLimbs = [...(character.cyberlimbs ?? [])];
    updatedLimbs[limbIndex] = updatedLimb;

    // Save with audit trail
    await updateCharacterWithAudit(
      userId,
      characterId,
      { cyberlimbs: updatedLimbs },
      {
        action: "cyberlimb_enhancement_added",
        actor: { userId, role: "owner" },
        details: {
          limbId,
          limbName: limb.name,
          enhancementId: newEnhancement.id,
          enhancementName: newEnhancement.name,
          rating,
          capacityUsed: newEnhancement.capacityUsed,
        },
        note: `Added ${newEnhancement.name} R${rating} to ${limb.name}`,
      }
    );

    return NextResponse.json({
      success: true,
      enhancement: {
        id: newEnhancement.id,
        catalogId: newEnhancement.catalogId,
        name: newEnhancement.name,
        enhancementType: newEnhancement.enhancementType,
        rating: newEnhancement.rating,
        capacityUsed: newEnhancement.capacityUsed,
        cost: newEnhancement.cost,
      },
      limbCapacityRemaining: updatedLimb.baseCapacity - updatedLimb.capacityUsed,
    });
  } catch (error) {
    console.error("Failed to add enhancement:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add enhancement" },
      { status: 500 }
    );
  }
}
