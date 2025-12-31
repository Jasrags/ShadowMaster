/**
 * API Route: /api/characters/[characterId]/weapons/[weaponId]/ammo
 *
 * GET - Get weapon ammo state
 * POST - Load weapon with ammo
 * DELETE - Unload weapon
 * PATCH - Swap magazine
 *
 * @see ADR-010: Inventory State Management
 * @see Capability: character.inventory-management
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import {
  getWeaponAmmoState,
  loadWeapon,
  unloadWeapon,
  swapMagazine,
  weaponUsesAmmo,
  getAmmoDisplayString,
} from "@/lib/rules/action-resolution/combat/ammunition-manager";
import type { AmmunitionItem, MagazineItem } from "@/lib/types/gear-state";
import type { Weapon } from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

interface AmmoStateResponse {
  success: boolean;
  ammoState?: {
    loadedAmmoTypeId: string | null;
    currentRounds: number;
    magazineCapacity: number;
    displayString: string;
    usesAmmo: boolean;
  };
  error?: string;
}

interface LoadAmmoRequest {
  ammoItemId: string;
  quantity?: number;
}

interface LoadAmmoResponse {
  success: boolean;
  roundsLoaded?: number;
  weapon?: Weapon;
  remainingAmmo?: number;
  error?: string;
}

interface UnloadAmmoResponse {
  success: boolean;
  roundsUnloaded?: number;
  returnedAmmo?: AmmunitionItem;
  error?: string;
}

interface SwapMagazineRequest {
  magazineId: string;
}

interface SwapMagazineResponse {
  success: boolean;
  oldMagazine?: MagazineItem;
  error?: string;
}

// =============================================================================
// GET - Get weapon ammo state
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; weaponId: string }> }
): Promise<NextResponse<AmmoStateResponse>> {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { characterId, weaponId } = await params;

    // Authorize view access
    const authResult = await authorizeOwnerAccess(
      userId,
      userId,
      characterId,
      "view"
    );

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    // Find the weapon
    const weapon = character.weapons?.find((w) => w.id === weaponId);
    if (!weapon) {
      return NextResponse.json(
        { success: false, error: `Weapon not found: ${weaponId}` },
        { status: 404 }
      );
    }

    const ammoState = getWeaponAmmoState(weapon);
    const usesAmmo = weaponUsesAmmo(weapon);

    return NextResponse.json({
      success: true,
      ammoState: {
        ...ammoState,
        displayString: getAmmoDisplayString(weapon, character.ammunition),
        usesAmmo,
      },
    });
  } catch (error) {
    console.error("Failed to get weapon ammo state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get weapon ammo state" },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST - Load weapon with ammo
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; weaponId: string }> }
): Promise<NextResponse<LoadAmmoResponse>> {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { characterId, weaponId } = await params;

    // Authorize edit access
    const authResult = await authorizeOwnerAccess(
      userId,
      userId,
      characterId,
      "edit"
    );

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    // Parse request body
    const body: LoadAmmoRequest = await request.json();
    const { ammoItemId, quantity } = body;

    if (!ammoItemId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: ammoItemId" },
        { status: 400 }
      );
    }

    // Find the weapon
    const weaponIndex = character.weapons?.findIndex((w) => w.id === weaponId) ?? -1;
    if (weaponIndex === -1) {
      return NextResponse.json(
        { success: false, error: `Weapon not found: ${weaponId}` },
        { status: 404 }
      );
    }

    const weapon = character.weapons![weaponIndex];

    // Find the ammo item
    const ammoIndex = character.ammunition?.findIndex((a) => a.id === ammoItemId) ?? -1;
    if (ammoIndex === -1) {
      return NextResponse.json(
        { success: false, error: `Ammunition not found: ${ammoItemId}` },
        { status: 404 }
      );
    }

    const ammoItem = character.ammunition![ammoIndex];

    // Load the weapon
    const result = loadWeapon(weapon, ammoItem, quantity);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Update character with new weapon and ammo state
    const updatedWeapons = [...character.weapons!];
    updatedWeapons[weaponIndex] = result.weapon;

    const updatedAmmunition = [...character.ammunition!];
    if (result.ammoItem) {
      if (result.ammoItem.quantity <= 0) {
        // Remove empty ammo item
        updatedAmmunition.splice(ammoIndex, 1);
      } else {
        updatedAmmunition[ammoIndex] = result.ammoItem;
      }
    }

    await updateCharacter(userId, characterId, {
      weapons: updatedWeapons,
      ammunition: updatedAmmunition,
    });

    return NextResponse.json({
      success: true,
      roundsLoaded: result.roundsLoaded,
      weapon: result.weapon,
      remainingAmmo: result.ammoItem?.quantity ?? 0,
    });
  } catch (error) {
    console.error("Failed to load weapon:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load weapon" },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE - Unload weapon
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; weaponId: string }> }
): Promise<NextResponse<UnloadAmmoResponse>> {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { characterId, weaponId } = await params;

    // Authorize edit access
    const authResult = await authorizeOwnerAccess(
      userId,
      userId,
      characterId,
      "edit"
    );

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    // Find the weapon
    const weaponIndex = character.weapons?.findIndex((w) => w.id === weaponId) ?? -1;
    if (weaponIndex === -1) {
      return NextResponse.json(
        { success: false, error: `Weapon not found: ${weaponId}` },
        { status: 404 }
      );
    }

    const weapon = character.weapons![weaponIndex];
    const ammoState = getWeaponAmmoState(weapon);

    // Find existing ammo item to consolidate
    const existingAmmoItem = character.ammunition?.find(
      (a) => a.catalogId === ammoState.loadedAmmoTypeId
    );

    // Unload the weapon
    const result = unloadWeapon(weapon, existingAmmoItem);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Failed to unload weapon" },
        { status: 400 }
      );
    }

    // Update character with new weapon and ammo state
    const updatedWeapons = [...character.weapons!];
    updatedWeapons[weaponIndex] = result.weapon;

    const updatedAmmunition = [...(character.ammunition || [])];
    if (result.returnedAmmo && result.roundsUnloaded > 0) {
      if (existingAmmoItem) {
        // Update existing ammo item
        const existingIndex = updatedAmmunition.findIndex(
          (a) => a.catalogId === ammoState.loadedAmmoTypeId
        );
        if (existingIndex !== -1) {
          updatedAmmunition[existingIndex] = result.returnedAmmo;
        }
      } else {
        // Add new ammo item
        updatedAmmunition.push(result.returnedAmmo);
      }
    }

    await updateCharacter(userId, characterId, {
      weapons: updatedWeapons,
      ammunition: updatedAmmunition,
    });

    return NextResponse.json({
      success: true,
      roundsUnloaded: result.roundsUnloaded,
      returnedAmmo: result.returnedAmmo,
    });
  } catch (error) {
    console.error("Failed to unload weapon:", error);
    return NextResponse.json(
      { success: false, error: "Failed to unload weapon" },
      { status: 500 }
    );
  }
}

// =============================================================================
// PATCH - Swap magazine
// =============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; weaponId: string }> }
): Promise<NextResponse<SwapMagazineResponse>> {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { characterId, weaponId } = await params;

    // Authorize edit access
    const authResult = await authorizeOwnerAccess(
      userId,
      userId,
      characterId,
      "edit"
    );

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    // Parse request body
    const body: SwapMagazineRequest = await request.json();
    const { magazineId } = body;

    if (!magazineId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: magazineId" },
        { status: 400 }
      );
    }

    // Find the weapon
    const weaponIndex = character.weapons?.findIndex((w) => w.id === weaponId) ?? -1;
    if (weaponIndex === -1) {
      return NextResponse.json(
        { success: false, error: `Weapon not found: ${weaponId}` },
        { status: 404 }
      );
    }

    const weapon = character.weapons![weaponIndex];

    // Find the magazine in spare magazines
    const magazineIndex = weapon.spareMagazines?.findIndex((m) => m.id === magazineId) ?? -1;
    if (magazineIndex === -1) {
      return NextResponse.json(
        { success: false, error: `Magazine not found: ${magazineId}` },
        { status: 404 }
      );
    }

    const newMagazine = weapon.spareMagazines![magazineIndex];

    // Swap magazines
    const result = swapMagazine(weapon, newMagazine);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Update spare magazines - remove new mag, add old mag
    const updatedSpareMags = [...weapon.spareMagazines!];
    updatedSpareMags.splice(magazineIndex, 1);
    if (result.oldMagazine) {
      updatedSpareMags.push(result.oldMagazine);
    }

    const updatedWeapon: Weapon = {
      ...result.weapon,
      spareMagazines: updatedSpareMags,
    };

    // Update character
    const updatedWeapons = [...character.weapons!];
    updatedWeapons[weaponIndex] = updatedWeapon;

    await updateCharacter(userId, characterId, {
      weapons: updatedWeapons,
    });

    return NextResponse.json({
      success: true,
      oldMagazine: result.oldMagazine,
    });
  } catch (error) {
    console.error("Failed to swap magazine:", error);
    return NextResponse.json(
      { success: false, error: "Failed to swap magazine" },
      { status: 500 }
    );
  }
}
