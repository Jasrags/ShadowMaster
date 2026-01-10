/**
 * API Route: /api/characters/[characterId]/augmentations/cyberlimbs
 *
 * GET - List all installed cyberlimbs
 * POST - Install a new cyberlimb
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
  createCyberlimb,
  validateCyberlimbInstallation,
  checkLocationConflicts,
  validateCustomization,
  calculateCyberlimbCosts,
  calculateTotalCMBonus,
  getCyberlimbStrength,
  getCyberlimbAgility,
  getCapacityBreakdown,
  isCyberlimbCatalogItem,
} from "@/lib/rules/augmentations/cyberlimb";
import { calculateTotalEssenceLoss, roundEssence } from "@/lib/rules/augmentations/essence";
import {
  shouldTrackEssenceHole,
  updateEssenceHoleOnInstall,
  getCharacterEssenceHole,
} from "@/lib/rules/augmentations/essence-hole";
import type { Character, CyberwareGrade } from "@/lib/types";
import type { CyberlimbCatalogItem } from "@/lib/types/edition";
import type { CyberlimbItem, CyberlimbLocation } from "@/lib/types/cyberlimb";

// =============================================================================
// TYPES
// =============================================================================

interface InstallCyberlimbRequest {
  catalogId: string;
  location: CyberlimbLocation;
  grade: CyberwareGrade;
  customization?: {
    strengthCustomization?: number;
    agilityCustomization?: number;
  };
  confirmReplacement?: boolean;
}

interface CyberlimbSummary {
  id?: string;
  catalogId: string;
  name: string;
  location: CyberlimbLocation;
  limbType: string;
  appearance: string;
  grade: CyberwareGrade;
  essenceCost: number;
  strength: number;
  agility: number;
  capacity: {
    total: number;
    used: number;
    remaining: number;
  };
  enhancementCount: number;
  accessoryCount: number;
  wirelessEnabled: boolean;
  condition: string;
}

interface CyberlimbListResponse {
  success: boolean;
  cyberlimbs: CyberlimbSummary[];
  totalCMBonus: number;
  totalEssenceLost: number;
  error?: string;
}

interface InstallCyberlimbResponse {
  success: boolean;
  installedLimb?: CyberlimbSummary;
  removedLimbs?: string[];
  essenceChange?: number;
  magicLoss?: number;
  warnings?: string[];
  error?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

function limbToSummary(limb: CyberlimbItem): CyberlimbSummary {
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
    strength: getCyberlimbStrength(limb),
    agility: getCyberlimbAgility(limb),
    capacity: {
      total: breakdown.totalCapacity,
      used: breakdown.usedByEnhancements + breakdown.usedByAccessories + breakdown.usedByWeapons,
      remaining: breakdown.remainingCapacity,
    },
    enhancementCount: limb.enhancements.length,
    accessoryCount: limb.accessories.length,
    wirelessEnabled: limb.wirelessEnabled,
    condition: limb.condition,
  };
}

// =============================================================================
// ROUTE HANDLERS
// =============================================================================

/**
 * GET - List all installed cyberlimbs
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<CyberlimbListResponse>> {
  try {
    const { characterId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          cyberlimbs: [],
          totalCMBonus: 0,
          totalEssenceLost: 0,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        {
          success: false,
          cyberlimbs: [],
          totalCMBonus: 0,
          totalEssenceLost: 0,
          error: "Character not found",
        },
        { status: 404 }
      );
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        {
          success: false,
          cyberlimbs: [],
          totalCMBonus: 0,
          totalEssenceLost: 0,
          error: "Not authorized",
        },
        { status: 403 }
      );
    }

    const cyberlimbs = character.cyberlimbs ?? [];
    const summaries = cyberlimbs.map(limbToSummary);
    const totalEssenceLost = cyberlimbs.reduce((sum, limb) => sum + limb.essenceCost, 0);

    return NextResponse.json({
      success: true,
      cyberlimbs: summaries,
      totalCMBonus: calculateTotalCMBonus(character),
      totalEssenceLost: roundEssence(totalEssenceLost),
    });
  } catch (error) {
    console.error("Failed to get cyberlimbs:", error);
    return NextResponse.json(
      {
        success: false,
        cyberlimbs: [],
        totalCMBonus: 0,
        totalEssenceLost: 0,
        error: "Failed to get cyberlimbs",
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Install a new cyberlimb
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<InstallCyberlimbResponse>> {
  try {
    const { characterId } = await params;

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

    // Parse request body
    const body: InstallCyberlimbRequest = await request.json();
    const { catalogId, location, grade, customization, confirmReplacement } = body;

    // Validate required fields
    if (!catalogId) {
      return NextResponse.json({ success: false, error: "catalogId is required" }, { status: 400 });
    }
    if (!location) {
      return NextResponse.json({ success: false, error: "location is required" }, { status: 400 });
    }
    if (!grade) {
      return NextResponse.json({ success: false, error: "grade is required" }, { status: 400 });
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

    // Find the cyberlimb catalog item
    const cyberwareData = extractCyberware(loadResult.ruleset);
    const rawCatalogItem = cyberwareData?.catalog?.find((item) => item.id === catalogId);

    if (!rawCatalogItem || !isCyberlimbCatalogItem(rawCatalogItem)) {
      return NextResponse.json(
        { success: false, error: `Cyberlimb not found in catalog: ${catalogId}` },
        { status: 404 }
      );
    }

    const catalogItem = rawCatalogItem as CyberlimbCatalogItem;

    // Validate customization if provided
    if (customization) {
      const customResult = validateCustomization(character, customization);
      if (!customResult.valid) {
        return NextResponse.json({ success: false, error: customResult.error }, { status: 400 });
      }
    }

    // Check for location conflicts
    const conflicts = checkLocationConflicts(character, location, catalogItem.limbType);
    if (conflicts.blockingLimb) {
      return NextResponse.json({ success: false, error: conflicts.error }, { status: 400 });
    }

    // If there are limbs to replace, require confirmation
    if (conflicts.limbsToReplace.length > 0 && !confirmReplacement) {
      return NextResponse.json(
        {
          success: false,
          error: `Installing this cyberlimb will replace: ${conflicts.limbsToReplace.map((l) => l.name).join(", ")}. Set confirmReplacement: true to proceed.`,
          warnings: [`Will replace: ${conflicts.limbsToReplace.map((l) => l.name).join(", ")}`],
        },
        { status: 400 }
      );
    }

    // Validate full installation
    const lifecycleStage = character.status === "draft" ? "creation" : "active";
    const validationResult = validateCyberlimbInstallation(
      character,
      catalogItem,
      location,
      grade,
      customization,
      { lifecycleStage, maxAvailability: lifecycleStage === "creation" ? 12 : undefined }
    );

    if (!validationResult.valid) {
      return NextResponse.json({ success: false, error: validationResult.error }, { status: 400 });
    }

    // Create the cyberlimb
    const newLimb = createCyberlimb(catalogItem, location, grade, customization);
    newLimb.id = `limb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Remove replaced limbs
    const existingLimbs = character.cyberlimbs ?? [];
    const limbsToRemoveIds = conflicts.limbsToReplace.map((l) => l.id ?? l.catalogId);
    const updatedLimbs = existingLimbs.filter(
      (l) => !limbsToRemoveIds.includes(l.id ?? l.catalogId)
    );
    updatedLimbs.push(newLimb);

    // Calculate new essence
    const cyberwareEssence = (character.cyberware ?? []).reduce(
      (sum, item) => sum + item.essenceCost,
      0
    );
    const biowareEssence = (character.bioware ?? []).reduce(
      (sum, item) => sum + item.essenceCost,
      0
    );
    const cyberlimbEssence = updatedLimbs.reduce((sum, limb) => sum + limb.essenceCost, 0);
    const totalEssenceLoss = cyberwareEssence + biowareEssence + cyberlimbEssence;
    const newEssence = roundEssence(6 - totalEssenceLoss);

    // Update essence hole for magical characters
    let updatedEssenceHole = character.essenceHole;
    let magicLoss: number | undefined;

    if (shouldTrackEssenceHole(character)) {
      const holeResult = updateEssenceHoleOnInstall(
        getCharacterEssenceHole(character),
        newLimb.essenceCost
      );
      updatedEssenceHole = holeResult.essenceHole;
      if (holeResult.additionalMagicLost > 0) {
        magicLoss = holeResult.additionalMagicLost;
      }
    }

    // Build updated character
    const updatedSpecialAttributes = {
      ...character.specialAttributes,
      essence: newEssence,
      ...(magicLoss &&
        character.specialAttributes?.magic !== undefined && {
          magic: Math.max(0, character.specialAttributes.magic - magicLoss),
        }),
      ...(magicLoss &&
        character.specialAttributes?.resonance !== undefined && {
          resonance: Math.max(0, character.specialAttributes.resonance - magicLoss),
        }),
    };

    // Save the updated character with audit trail
    await updateCharacterWithAudit(
      userId,
      characterId,
      {
        cyberlimbs: updatedLimbs,
        specialAttributes: updatedSpecialAttributes,
        essenceHole: updatedEssenceHole,
      },
      {
        action: "cyberlimb_installed",
        actor: { userId, role: "owner" },
        details: {
          catalogId,
          name: catalogItem.name,
          location,
          grade,
          customization,
          essenceChange: -newLimb.essenceCost,
          magicLoss,
          replacedLimbs: conflicts.limbsToReplace.map((l) => l.name),
        },
        note: `Installed ${catalogItem.name} at ${location} (${grade} grade)`,
      }
    );

    const warnings: string[] = [];
    if (conflicts.limbsToReplace.length > 0) {
      warnings.push(`Replaced: ${conflicts.limbsToReplace.map((l) => l.name).join(", ")}`);
    }

    return NextResponse.json({
      success: true,
      installedLimb: limbToSummary(newLimb),
      removedLimbs: conflicts.limbsToReplace.map((l) => l.name),
      essenceChange: -newLimb.essenceCost,
      magicLoss,
      warnings: warnings.length > 0 ? warnings : undefined,
    });
  } catch (error) {
    console.error("Failed to install cyberlimb:", error);
    return NextResponse.json(
      { success: false, error: "Failed to install cyberlimb" },
      { status: 500 }
    );
  }
}
