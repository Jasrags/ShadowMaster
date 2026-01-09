/**
 * API Route: /api/characters/[characterId]/augmentations/cyberlimbs/[limbId]
 *
 * GET - Get details of a specific cyberlimb
 * PATCH - Update cyberlimb settings (wireless toggle)
 * DELETE - Remove cyberlimb
 *
 * Satisfies:
 * - ADR-010: Wireless state management
 * - Guarantee #4: "auditable record of modifications"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import {
  toggleCyberlimbWireless,
  getCyberlimbStrength,
  getCyberlimbAgility,
  getCapacityBreakdown,
} from "@/lib/rules/augmentations/cyberlimb";
import {
  shouldTrackEssenceHole,
  updateEssenceHoleOnRemoval,
} from "@/lib/rules/augmentations/essence-hole";
import { roundEssence } from "@/lib/rules/augmentations/essence";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";

// =============================================================================
// TYPES
// =============================================================================

interface CyberlimbDetailResponse {
  success: boolean;
  limb?: {
    id?: string;
    catalogId: string;
    name: string;
    location: string;
    limbType: string;
    appearance: string;
    grade: string;
    essenceCost: number;
    cost: number;
    availability: number;
    baseStrength: number;
    baseAgility: number;
    customStrength: number;
    customAgility: number;
    effectiveStrength: number;
    effectiveAgility: number;
    capacity: {
      total: number;
      usedByEnhancements: number;
      usedByAccessories: number;
      usedByWeapons: number;
      remaining: number;
    };
    enhancements: Array<{
      id: string;
      catalogId: string;
      name: string;
      enhancementType: string;
      rating: number;
      capacityUsed: number;
    }>;
    accessories: Array<{
      id: string;
      catalogId: string;
      name: string;
      rating?: number;
      capacityUsed: number;
    }>;
    weapons: Array<{
      id: string;
      catalogId: string;
      name: string;
      damage: string;
      ap: number;
      capacityUsed: number;
    }>;
    wirelessEnabled: boolean;
    condition: string;
    installedAt: string;
  };
  error?: string;
}

interface UpdateCyberlimbRequest {
  wirelessEnabled?: boolean;
}

interface UpdateCyberlimbResponse {
  success: boolean;
  limb?: CyberlimbDetailResponse["limb"];
  error?: string;
}

interface RemoveCyberlimbResponse {
  success: boolean;
  removedLimb?: string;
  essenceRestored?: number;
  error?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

function limbToDetail(limb: CyberlimbItem): NonNullable<CyberlimbDetailResponse["limb"]> {
  const breakdown = getCapacityBreakdown(limb);
  return {
    id: limb.id,
    catalogId: limb.catalogId,
    name: limb.name,
    location: limb.location,
    limbType: limb.limbType,
    appearance: limb.appearance,
    grade: limb.grade,
    essenceCost: limb.essenceCost,
    cost: limb.cost,
    availability: limb.availability,
    baseStrength: limb.baseStrength,
    baseAgility: limb.baseAgility,
    customStrength: limb.customStrength,
    customAgility: limb.customAgility,
    effectiveStrength: getCyberlimbStrength(limb),
    effectiveAgility: getCyberlimbAgility(limb),
    capacity: {
      total: breakdown.totalCapacity,
      usedByEnhancements: breakdown.usedByEnhancements,
      usedByAccessories: breakdown.usedByAccessories,
      usedByWeapons: breakdown.usedByWeapons,
      remaining: breakdown.remainingCapacity,
    },
    enhancements: limb.enhancements.map((e) => ({
      id: e.id,
      catalogId: e.catalogId,
      name: e.name,
      enhancementType: e.enhancementType,
      rating: e.rating,
      capacityUsed: e.capacityUsed,
    })),
    accessories: limb.accessories.map((a) => ({
      id: a.id,
      catalogId: a.catalogId,
      name: a.name,
      rating: a.rating,
      capacityUsed: a.capacityUsed,
    })),
    weapons: limb.weapons.map((w) => ({
      id: w.id,
      catalogId: w.catalogId,
      name: w.name,
      damage: w.damage,
      ap: w.ap,
      capacityUsed: w.capacityUsed,
    })),
    wirelessEnabled: limb.wirelessEnabled,
    condition: limb.condition,
    installedAt: limb.installedAt,
  };
}

function findLimb(
  character: { cyberlimbs?: CyberlimbItem[] },
  limbId: string
): CyberlimbItem | undefined {
  return (character.cyberlimbs ?? []).find(
    (l) => l.id === limbId || l.catalogId === limbId
  );
}

// =============================================================================
// ROUTE HANDLERS
// =============================================================================

/**
 * GET - Get details of a specific cyberlimb
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; limbId: string }> }
): Promise<NextResponse<CyberlimbDetailResponse>> {
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
    const limb = findLimb(character, limbId);
    if (!limb) {
      return NextResponse.json(
        { success: false, error: "Cyberlimb not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      limb: limbToDetail(limb),
    });
  } catch (error) {
    console.error("Failed to get cyberlimb:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get cyberlimb" },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update cyberlimb settings (wireless toggle)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; limbId: string }> }
): Promise<NextResponse<UpdateCyberlimbResponse>> {
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
    const limbIndex = (character.cyberlimbs ?? []).findIndex(
      (l) => l.id === limbId || l.catalogId === limbId
    );
    if (limbIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Cyberlimb not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body: UpdateCyberlimbRequest = await request.json();

    // Currently only wireless toggle is supported
    if (body.wirelessEnabled === undefined) {
      return NextResponse.json(
        { success: false, error: "No valid update fields provided. Supported: wirelessEnabled" },
        { status: 400 }
      );
    }

    // Update the limb
    const existingLimb = character.cyberlimbs![limbIndex];
    const updatedLimb = toggleCyberlimbWireless(existingLimb, body.wirelessEnabled);

    // Update cyberlimbs array
    const updatedLimbs = [...(character.cyberlimbs ?? [])];
    updatedLimbs[limbIndex] = updatedLimb;

    // Save with audit trail
    await updateCharacterWithAudit(
      userId,
      characterId,
      { cyberlimbs: updatedLimbs },
      {
        action: "cyberlimb_wireless_toggled",
        actor: { userId, role: "owner" },
        details: {
          limbId,
          name: existingLimb.name,
          wirelessEnabled: body.wirelessEnabled,
        },
        note: `${body.wirelessEnabled ? "Enabled" : "Disabled"} wireless on ${existingLimb.name}`,
      }
    );

    return NextResponse.json({
      success: true,
      limb: limbToDetail(updatedLimb),
    });
  } catch (error) {
    console.error("Failed to update cyberlimb:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cyberlimb" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove a cyberlimb
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; limbId: string }> }
): Promise<NextResponse<RemoveCyberlimbResponse>> {
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
    const limbIndex = (character.cyberlimbs ?? []).findIndex(
      (l) => l.id === limbId || l.catalogId === limbId
    );
    if (limbIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Cyberlimb not found" },
        { status: 404 }
      );
    }

    const removedLimb = character.cyberlimbs![limbIndex];
    const essenceRestored = removedLimb.essenceCost;

    // Remove the limb
    const updatedLimbs = (character.cyberlimbs ?? []).filter((_, i) => i !== limbIndex);

    // Calculate new essence
    const cyberwareEssence = (character.cyberware ?? []).reduce((sum, item) => sum + item.essenceCost, 0);
    const biowareEssence = (character.bioware ?? []).reduce((sum, item) => sum + item.essenceCost, 0);
    const cyberlimbEssence = updatedLimbs.reduce((sum, limb) => sum + limb.essenceCost, 0);
    const totalEssenceLoss = cyberwareEssence + biowareEssence + cyberlimbEssence;
    const newEssence = roundEssence(6 - totalEssenceLoss);

    // Update essence hole (peak stays, current decreases)
    let updatedEssenceHole = character.essenceHole;
    if (shouldTrackEssenceHole(character) && character.essenceHole) {
      const holeResult = updateEssenceHoleOnRemoval(character.essenceHole, essenceRestored);
      updatedEssenceHole = holeResult.essenceHole;
    }

    // Save with audit trail
    await updateCharacterWithAudit(
      userId,
      characterId,
      {
        cyberlimbs: updatedLimbs,
        specialAttributes: {
          ...character.specialAttributes,
          essence: newEssence,
        },
        essenceHole: updatedEssenceHole,
      },
      {
        action: "cyberlimb_removed",
        actor: { userId, role: "owner" },
        details: {
          limbId,
          name: removedLimb.name,
          location: removedLimb.location,
          essenceRestored,
        },
        note: `Removed ${removedLimb.name} from ${removedLimb.location}`,
      }
    );

    return NextResponse.json({
      success: true,
      removedLimb: removedLimb.name,
      essenceRestored,
    });
  } catch (error) {
    console.error("Failed to remove cyberlimb:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove cyberlimb" },
      { status: 500 }
    );
  }
}
