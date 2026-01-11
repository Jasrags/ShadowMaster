/**
 * API Route: /api/characters/[characterId]/inventory
 *
 * GET - Get full inventory state with encumbrance
 * PATCH - Update equipment readiness state
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import {
  setEquipmentReadiness,
  getEquipmentStateSummary,
  type StateTransitionResult,
} from "@/lib/rules/inventory";
import { calculateEncumbrance, getEncumbranceStatus } from "@/lib/rules/encumbrance";
import type { EquipmentReadiness } from "@/lib/types/gear-state";
import type { Weapon, ArmorItem, GearItem } from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

interface InventoryStateResponse {
  success: boolean;
  inventory?: {
    weapons: Weapon[];
    armor: ArmorItem[];
    gear: GearItem[];
    encumbrance: {
      currentWeight: number;
      maxCapacity: number;
      isEncumbered: boolean;
      overweightPenalty: number;
      status: string;
      color: string;
      description: string;
    };
    summary: ReturnType<typeof getEquipmentStateSummary>;
  };
  error?: string;
}

interface UpdateStateRequest {
  itemId: string;
  itemType: "weapon" | "armor" | "gear";
  newState: EquipmentReadiness;
}

interface UpdateStateResponse {
  success: boolean;
  result?: StateTransitionResult;
  error?: string;
}

// =============================================================================
// GET - Get full inventory state
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<InventoryStateResponse>> {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    // Authorize view access
    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "view");

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    // Calculate encumbrance
    const encumbranceState = calculateEncumbrance(character);
    const encumbranceStatus = getEncumbranceStatus(encumbranceState);

    // Get equipment summary
    const summary = getEquipmentStateSummary(character);

    return NextResponse.json({
      success: true,
      inventory: {
        weapons: character.weapons || [],
        armor: character.armor || [],
        gear: character.gear || [],
        encumbrance: {
          ...encumbranceState,
          ...encumbranceStatus,
        },
        summary,
      },
    });
  } catch (error) {
    console.error("Failed to get inventory state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get inventory state" },
      { status: 500 }
    );
  }
}

// =============================================================================
// PATCH - Update equipment readiness state
// =============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<UpdateStateResponse>> {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    // Authorize edit access
    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "edit");

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    // Parse request body
    const body: UpdateStateRequest = await request.json();
    const { itemId, itemType, newState } = body;

    // Validate required fields
    if (!itemId || !itemType || !newState) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: itemId, itemType, newState",
        },
        { status: 400 }
      );
    }

    // Find and update the item
    let result: StateTransitionResult | null = null;

    switch (itemType) {
      case "weapon": {
        const weaponIndex = character.weapons?.findIndex((w) => w.id === itemId) ?? -1;
        if (weaponIndex === -1) {
          return NextResponse.json(
            { success: false, error: `Weapon not found: ${itemId}` },
            { status: 404 }
          );
        }

        const weapon = character.weapons![weaponIndex];
        result = setEquipmentReadiness(weapon, newState, "weapon");

        if (result.success) {
          const updatedWeapons = [...character.weapons!];
          updatedWeapons[weaponIndex] = result.item as Weapon;
          await updateCharacter(userId, characterId, { weapons: updatedWeapons });
        }
        break;
      }

      case "armor": {
        const armorIndex = character.armor?.findIndex((a) => a.id === itemId) ?? -1;
        if (armorIndex === -1) {
          return NextResponse.json(
            { success: false, error: `Armor not found: ${itemId}` },
            { status: 404 }
          );
        }

        const armorItem = character.armor![armorIndex];
        result = setEquipmentReadiness(armorItem, newState, "armor");

        if (result.success) {
          const updatedArmor = [...character.armor!];
          updatedArmor[armorIndex] = result.item as ArmorItem;
          // Also update legacy equipped field
          (updatedArmor[armorIndex] as ArmorItem).equipped = newState === "worn";
          await updateCharacter(userId, characterId, { armor: updatedArmor });
        }
        break;
      }

      case "gear": {
        const gearIndex = character.gear?.findIndex((g) => g.id === itemId) ?? -1;
        if (gearIndex === -1) {
          return NextResponse.json(
            { success: false, error: `Gear not found: ${itemId}` },
            { status: 404 }
          );
        }

        const gearItem = character.gear![gearIndex];
        // Cast to include state property for state management
        const gearWithState = gearItem as GearItem & {
          state?: import("@/lib/types/gear-state").GearState;
        };
        result = setEquipmentReadiness(gearWithState, newState, "gear");

        if (result.success) {
          const updatedGear = [...character.gear!];
          updatedGear[gearIndex] = result.item as GearItem;
          await updateCharacter(userId, characterId, { gear: updatedGear });
        }
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: `Invalid item type: ${itemType}` },
          { status: 400 }
        );
    }

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Failed to update item state" },
        { status: 500 }
      );
    }

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error, result }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Failed to update inventory state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inventory state" },
      { status: 500 }
    );
  }
}
