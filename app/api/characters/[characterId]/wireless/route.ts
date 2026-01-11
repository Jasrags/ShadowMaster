/**
 * API Route: /api/characters/[characterId]/wireless
 *
 * GET - Get all wireless states and active bonuses
 * PATCH - Toggle individual item wireless or global wireless
 * POST - Toggle all wireless (respects global flag)
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import {
  toggleWireless,
  toggleAugmentationWireless,
  setAllWireless,
  getEquipmentStateSummary,
} from "@/lib/rules/inventory";
import { isGlobalWirelessEnabled, getWirelessBonusSummary } from "@/lib/rules/wireless";
import type { Weapon, ArmorItem, GearItem, CyberwareItem } from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

interface WirelessStateResponse {
  success: boolean;
  wirelessState?: {
    globalEnabled: boolean;
    bonusSummary: ReturnType<typeof getWirelessBonusSummary>;
    equipmentSummary: {
      wirelessEnabled: number;
      wirelessDisabled: number;
    };
    items: {
      weapons: { id: string; name: string; wirelessEnabled: boolean }[];
      armor: { id: string; name: string; wirelessEnabled: boolean }[];
      cyberware: { id: string; name: string; wirelessEnabled: boolean }[];
      bioware: { id: string; name: string; wirelessEnabled: boolean }[];
    };
  };
  error?: string;
}

interface ToggleWirelessRequest {
  itemId?: string;
  itemType?: "weapon" | "armor" | "gear" | "cyberware" | "bioware";
  enabled: boolean;
  global?: boolean; // If true, toggle global wireless
}

interface ToggleWirelessResponse {
  success: boolean;
  previousState?: boolean;
  newState?: boolean;
  error?: string;
}

interface ToggleAllWirelessRequest {
  enabled: boolean;
}

interface ToggleAllWirelessResponse {
  success: boolean;
  globalEnabled?: boolean;
  error?: string;
}

// =============================================================================
// GET - Get all wireless states
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<WirelessStateResponse>> {
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

    // Get global wireless state
    const globalEnabled = isGlobalWirelessEnabled(character);

    // Get wireless bonuses
    const bonusSummary = getWirelessBonusSummary(character);

    // Get equipment summary
    const equipmentSummary = getEquipmentStateSummary(character);

    // Collect wireless states for each item type (filter out items without IDs)
    const weaponStates = (character.weapons || [])
      .filter((w): w is typeof w & { id: string } => !!w.id)
      .map((w) => ({
        id: w.id,
        name: w.name,
        wirelessEnabled: w.state?.wirelessEnabled !== false,
      }));

    const armorStates = (character.armor || [])
      .filter((a): a is typeof a & { id: string } => !!a.id)
      .map((a) => ({
        id: a.id,
        name: a.name,
        wirelessEnabled: a.state?.wirelessEnabled !== false,
      }));

    const cyberwareStates = (character.cyberware || [])
      .filter((c): c is typeof c & { id: string } => !!c.id)
      .map((c) => ({
        id: c.id,
        name: c.name,
        wirelessEnabled: c.wirelessEnabled !== false,
      }));

    const biowareStates = (character.bioware || [])
      .filter((b): b is typeof b & { id: string } => !!b.id)
      .map((b) => ({
        id: b.id,
        name: b.name,
        wirelessEnabled: (b as { wirelessEnabled?: boolean }).wirelessEnabled !== false,
      }));

    return NextResponse.json({
      success: true,
      wirelessState: {
        globalEnabled,
        bonusSummary,
        equipmentSummary: {
          wirelessEnabled: equipmentSummary.wirelessEnabled,
          wirelessDisabled: equipmentSummary.wirelessDisabled,
        },
        items: {
          weapons: weaponStates,
          armor: armorStates,
          cyberware: cyberwareStates,
          bioware: biowareStates,
        },
      },
    });
  } catch (error) {
    console.error("Failed to get wireless state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get wireless state" },
      { status: 500 }
    );
  }
}

// =============================================================================
// PATCH - Toggle individual item wireless
// =============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<ToggleWirelessResponse>> {
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
    const body: ToggleWirelessRequest = await request.json();
    const { itemId, itemType, enabled, global } = body;

    // Handle global toggle
    if (global) {
      const previousState = isGlobalWirelessEnabled(character);
      const updatedCharacter = setAllWireless(character, enabled);
      await updateCharacter(userId, characterId, {
        wirelessBonusesEnabled: updatedCharacter.wirelessBonusesEnabled,
      });

      return NextResponse.json({
        success: true,
        previousState,
        newState: enabled,
      });
    }

    // Validate required fields for item toggle
    if (!itemId || !itemType) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: itemId, itemType",
        },
        { status: 400 }
      );
    }

    let previousState: boolean;
    let newState: boolean = enabled;

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
        const { item, result } = toggleWireless(weapon, enabled, "weapon");
        previousState = result.previousState;
        newState = result.newState;

        const updatedWeapons = [...character.weapons!];
        updatedWeapons[weaponIndex] = item as Weapon;
        await updateCharacter(userId, characterId, { weapons: updatedWeapons });
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
        const { item, result } = toggleWireless(armorItem, enabled, "armor");
        previousState = result.previousState;
        newState = result.newState;

        const updatedArmor = [...character.armor!];
        updatedArmor[armorIndex] = item as ArmorItem;
        await updateCharacter(userId, characterId, { armor: updatedArmor });
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
        const { item, result } = toggleWireless(gearWithState, enabled, "gear");
        previousState = result.previousState;
        newState = result.newState;

        const updatedGear = [...character.gear!];
        updatedGear[gearIndex] = item as GearItem;
        await updateCharacter(userId, characterId, { gear: updatedGear });
        break;
      }

      case "cyberware": {
        const cyberIndex = character.cyberware?.findIndex((c) => c.id === itemId) ?? -1;
        if (cyberIndex === -1) {
          return NextResponse.json(
            { success: false, error: `Cyberware not found: ${itemId}` },
            { status: 404 }
          );
        }

        const cyberItem = character.cyberware![cyberIndex];
        const { item, result } = toggleAugmentationWireless(cyberItem, enabled);
        previousState = result.previousState;
        newState = result.newState;

        const updatedCyberware = [...character.cyberware!];
        updatedCyberware[cyberIndex] = item as CyberwareItem;
        await updateCharacter(userId, characterId, { cyberware: updatedCyberware });
        break;
      }

      case "bioware": {
        const bioIndex = character.bioware?.findIndex((b) => b.id === itemId) ?? -1;
        if (bioIndex === -1) {
          return NextResponse.json(
            { success: false, error: `Bioware not found: ${itemId}` },
            { status: 404 }
          );
        }

        const bioItem = character.bioware![bioIndex];
        const { item, result } = toggleAugmentationWireless(
          bioItem as { wirelessEnabled?: boolean },
          enabled
        );
        previousState = result.previousState;
        newState = result.newState;

        const updatedBioware = [...character.bioware!];
        updatedBioware[bioIndex] = item as typeof bioItem;
        await updateCharacter(userId, characterId, { bioware: updatedBioware });
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: `Invalid item type: ${itemType}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      previousState,
      newState,
    });
  } catch (error) {
    console.error("Failed to toggle wireless:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle wireless" },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Toggle all wireless (global toggle)
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<ToggleAllWirelessResponse>> {
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
    const body: ToggleAllWirelessRequest = await request.json();
    const { enabled } = body;

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Missing required field: enabled (boolean)" },
        { status: 400 }
      );
    }

    // Update global wireless state
    const updatedCharacter = setAllWireless(character, enabled);
    await updateCharacter(userId, characterId, {
      wirelessBonusesEnabled: updatedCharacter.wirelessBonusesEnabled,
    });

    return NextResponse.json({
      success: true,
      globalEnabled: enabled,
    });
  } catch (error) {
    console.error("Failed to toggle all wireless:", error);
    return NextResponse.json(
      { success: false, error: "Failed to toggle all wireless" },
      { status: 500 }
    );
  }
}
