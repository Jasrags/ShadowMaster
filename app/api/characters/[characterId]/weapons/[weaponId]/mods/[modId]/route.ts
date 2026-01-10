/**
 * API Route: /api/characters/[characterId]/weapons/[weaponId]/mods/[modId]
 *
 * DELETE - Remove a modification from a weapon
 *
 * Satisfies:
 * - Guarantee: "Modifications flagged as 'built-in' MUST NOT be removable"
 * - Guarantee: "Any manual modification MUST be reversible, resulting in the
 *   immediate restoration of the occupied mount point"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";
import type { Weapon, InstalledWeaponMod } from "@/lib/types/character";
import { removeModification } from "@/lib/rules/gear/weapon-customization";

// =============================================================================
// TYPES
// =============================================================================

interface ModRemovalResponse {
  success: boolean;
  weapon?: {
    id: string;
    name: string;
    modifications: InstalledWeaponMod[];
    occupiedMounts: string[];
  };
  restoredMounts?: string[];
  nuyenRefunded?: number;
  error?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

function findWeaponById(weapons: Weapon[] | undefined, weaponId: string): Weapon | null {
  if (!weapons) return null;
  return weapons.find((w) => w.id === weaponId) || null;
}

function updateWeaponInArray(weapons: Weapon[], updatedWeapon: Weapon): Weapon[] {
  return weapons.map((w) => (w.id === updatedWeapon.id ? updatedWeapon : w));
}

// =============================================================================
// ROUTE HANDLER
// =============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; weaponId: string; modId: string }> }
): Promise<NextResponse<ModRemovalResponse>> {
  try {
    const { characterId, weaponId, modId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Validate permission: Owner or campaign GM
    let isOwner = true;
    if (character.ownerId !== userId) {
      if (character.campaignId) {
        const campaign = await getCampaignById(character.campaignId);
        if (!campaign || campaign.gmId !== userId) {
          return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
        }
        isOwner = false;
      } else {
        return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
      }
    }

    // Find the weapon
    const weapon = findWeaponById(character.weapons, weaponId);
    if (!weapon) {
      return NextResponse.json({ success: false, error: "Weapon not found" }, { status: 404 });
    }

    // Find the modification to get its cost for potential refund
    const modToRemove = weapon.modifications?.find((m) => m.catalogId === modId);
    if (!modToRemove) {
      return NextResponse.json(
        { success: false, error: "Modification not found on weapon" },
        { status: 404 }
      );
    }

    // Attempt removal
    const result = removeModification(weapon, modId);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to remove modification",
        },
        { status: 400 }
      );
    }

    // Calculate nuyen refund (optional: could be a campaign setting)
    // For now, we refund 50% of the original cost
    const refundAmount = Math.floor(modToRemove.cost * 0.5);
    const newNuyen = character.nuyen + refundAmount;

    // Update character
    const updatedWeapons = updateWeaponInArray(character.weapons || [], result.weapon);

    await updateCharacterWithAudit(
      character.ownerId,
      characterId,
      {
        weapons: updatedWeapons,
        nuyen: newNuyen,
      },
      {
        action: "gear_modified",
        actor: { userId, role: isOwner ? "owner" : "gm" },
        details: {
          type: "weapon_mod_removed",
          weaponId,
          weaponName: weapon.name,
          modId,
          modName: modToRemove.name,
          refundAmount,
          restoredMounts: result.restoredMounts,
          actorName: user.username,
        },
        note: `Removed ${modToRemove.name} from ${weapon.name}, refunded ${refundAmount}¥`,
      }
    );

    return NextResponse.json({
      success: true,
      weapon: {
        id: result.weapon.id || "",
        name: result.weapon.name,
        modifications: result.weapon.modifications || [],
        occupiedMounts: result.weapon.occupiedMounts || [],
      },
      restoredMounts: result.restoredMounts,
      nuyenRefunded: refundAmount,
    });
  } catch (error) {
    console.error("Failed to remove modification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove modification" },
      { status: 500 }
    );
  }
}
