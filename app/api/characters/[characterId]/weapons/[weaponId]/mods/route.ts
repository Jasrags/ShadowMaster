/**
 * API Route: /api/characters/[characterId]/weapons/[weaponId]/mods
 *
 * POST - Install a modification on a weapon
 * GET - List installed modifications on a weapon
 *
 * Satisfies:
 * - Guarantee: "Weapon modifications MUST be validated against the authoritative
 *   mount point registry for the weapon's subcategory"
 * - Guarantee: "The system MUST enforce exclusive occupancy for mount points"
 * - Constraint: "Resource costs for manual modifications MUST be accurately
 *   deducted from the participant's character records"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";
import type { Weapon, InstalledWeaponMod } from "@/lib/types/character";
import type { WeaponModificationCatalogItem } from "@/lib/types/edition";
import {
  validateModInstallation,
  installModification,
  DEFAULT_MOUNT_REGISTRY,
} from "@/lib/rules/gear/weapon-customization";

// =============================================================================
// TYPES
// =============================================================================

interface InstallModRequest {
  /** Catalog ID of the modification to install */
  modId: string;
  /** Rating selection (if applicable) */
  rating?: number;
  /** Override cost (for GM adjustments) */
  customCost?: number;
}

interface ModResponse {
  success: boolean;
  weapon?: {
    id: string;
    name: string;
    modifications: InstalledWeaponMod[];
    occupiedMounts: string[];
  };
  nuyenRemaining?: number;
  error?: string;
  validationErrors?: string[];
}

// =============================================================================
// MOCK DATA (Replace with actual catalog loading)
// =============================================================================

/**
 * Temporary mock catalog. In production, this would be loaded from the edition's
 * modification catalog via the ruleset loader.
 */
const MOCK_MOD_CATALOG: Record<string, WeaponModificationCatalogItem> = {
  "smartgun-internal": {
    id: "smartgun-internal",
    name: "Smartgun System (Internal)",
    mount: "internal",
    cost: 200,
    availability: 4,
    legality: "restricted",
    accuracyModifier: 2,
    description: "Provides targeting assistance via DNI or image link.",
  },
  "silencer": {
    id: "silencer",
    name: "Silencer/Suppressor",
    mount: "barrel",
    cost: 500,
    availability: 9,
    legality: "restricted",
    description: "Reduces sound signature of weapon fire.",
  },
  "laser-sight": {
    id: "laser-sight",
    name: "Laser Sight",
    mount: "under",
    cost: 125,
    availability: 2,
    description: "Visible laser for improved targeting.",
  },
  "foregrip": {
    id: "foregrip",
    name: "Foregrip",
    mount: "under",
    cost: 100,
    availability: 2,
    recoilCompensation: 1,
    description: "Provides additional stability for automatic fire.",
  },
  "scope-imaging": {
    id: "scope-imaging",
    name: "Imaging Scope",
    mount: "top",
    cost: 300,
    availability: 4,
    description: "Magnified optic with image enhancement.",
  },
  "bipod": {
    id: "bipod",
    name: "Bipod",
    mount: "under",
    cost: 200,
    availability: 4,
    recoilCompensation: 2,
    minimumWeaponSize: "rifle",
    description: "Stabilizing mount for prone or supported shooting.",
  },
};

// =============================================================================
// HELPERS
// =============================================================================

function getModFromCatalog(modId: string): WeaponModificationCatalogItem | null {
  return MOCK_MOD_CATALOG[modId] || null;
}

function findWeaponById(weapons: Weapon[] | undefined, weaponId: string): Weapon | null {
  if (!weapons) return null;
  return weapons.find((w) => w.id === weaponId) || null;
}

function updateWeaponInArray(weapons: Weapon[], updatedWeapon: Weapon): Weapon[] {
  return weapons.map((w) => (w.id === updatedWeapon.id ? updatedWeapon : w));
}

// =============================================================================
// ROUTE HANDLERS
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; weaponId: string }> }
): Promise<NextResponse<ModResponse>> {
  try {
    const { characterId, weaponId } = await params;

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

    // Find the weapon
    const weapon = findWeaponById(character.weapons, weaponId);
    if (!weapon) {
      return NextResponse.json({ success: false, error: "Weapon not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      weapon: {
        id: weapon.id || "",
        name: weapon.name,
        modifications: weapon.modifications || [],
        occupiedMounts: weapon.occupiedMounts || [],
      },
    });
  } catch (error) {
    console.error("Failed to get weapon modifications:", error);
    return NextResponse.json({ success: false, error: "Failed to get modifications" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; weaponId: string }> }
): Promise<NextResponse<ModResponse>> {
  try {
    const { characterId, weaponId } = await params;

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

    // Parse request
    const body: InstallModRequest = await request.json();
    const { modId, rating, customCost } = body;

    if (!modId) {
      return NextResponse.json({ success: false, error: "modId is required" }, { status: 400 });
    }

    // Get modification from catalog
    const mod = getModFromCatalog(modId);
    if (!mod) {
      return NextResponse.json({ success: false, error: `Modification "${modId}" not found in catalog` }, { status: 404 });
    }

    // Validate installation
    const validation = validateModInstallation(weapon, mod, DEFAULT_MOUNT_REGISTRY);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: "Modification cannot be installed",
        validationErrors: validation.errors,
      }, { status: 400 });
    }

    // Calculate cost
    const modCost = customCost ?? mod.cost;

    // Check if character has enough nuyen
    if (character.nuyen < modCost) {
      return NextResponse.json({
        success: false,
        error: `Insufficient nuyen. Need ${modCost}¥, have ${character.nuyen}¥`,
      }, { status: 400 });
    }

    // Install the modification
    const updatedWeapon = installModification(weapon, mod, { rating, cost: modCost });

    // Update character with new weapon and deducted nuyen
    const updatedWeapons = updateWeaponInArray(character.weapons || [], updatedWeapon);
    const newNuyen = character.nuyen - modCost;

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
          type: "weapon_mod_installed",
          weaponId,
          weaponName: weapon.name,
          modId: mod.id,
          modName: mod.name,
          cost: modCost,
          mount: mod.mount,
          actorName: user.username,
        },
        note: `Installed ${mod.name} on ${weapon.name} for ${modCost}¥`,
      }
    );

    return NextResponse.json({
      success: true,
      weapon: {
        id: updatedWeapon.id || "",
        name: updatedWeapon.name,
        modifications: updatedWeapon.modifications || [],
        occupiedMounts: updatedWeapon.occupiedMounts || [],
      },
      nuyenRemaining: newNuyen,
    });
  } catch (error) {
    console.error("Failed to install modification:", error);
    return NextResponse.json({ success: false, error: "Failed to install modification" }, { status: 500 });
  }
}
