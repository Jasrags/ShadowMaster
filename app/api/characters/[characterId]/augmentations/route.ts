/**
 * API Route: /api/characters/[characterId]/augmentations
 *
 * GET - List installed augmentations
 * POST - Install new augmentation
 *
 * Satisfies:
 * - Guarantee #4: "auditable record of modifications"
 * - Requirement: "Post-creation management MUST support addition"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { loadRuleset, extractCyberware, extractBioware } from "@/lib/rules/loader";
import {
  installCyberware,
  installBioware,
} from "@/lib/rules/augmentations/management";
import {
  validateAugmentationInstall,
  DEFAULT_AUGMENTATION_RULES,
} from "@/lib/rules/augmentations/validation";
import type {
  Character,
  CyberwareGrade,
  BiowareGrade,
  CyberwareItem,
  BiowareItem,
} from "@/lib/types";
import type {
  CyberwareCatalogItem,
  BiowareCatalogItem,
} from "@/lib/types/edition";

// =============================================================================
// TYPES
// =============================================================================

interface InstallAugmentationRequest {
  type: "cyberware" | "bioware";
  catalogId: string;
  grade: string;
  rating?: number;
}

interface AugmentationListResponse {
  success: boolean;
  cyberware: CyberwareItem[];
  bioware: BiowareItem[];
  essenceSummary: {
    current: number;
    lost: number;
    fromCyberware: number;
    fromBioware: number;
  };
  error?: string;
}

interface InstallAugmentationResponse {
  success: boolean;
  installedItem?: CyberwareItem | BiowareItem;
  essenceChange?: number;
  magicLoss?: number;
  warnings?: string[];
  error?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

function calculateEssenceSummary(character: Character): AugmentationListResponse["essenceSummary"] {
  const baseEssence = 6; // Standard maximum essence
  const current = character.specialAttributes?.essence ?? baseEssence;

  const fromCyberware = (character.cyberware ?? []).reduce(
    (sum, item) => sum + (item.essenceCost ?? 0),
    0
  );

  const fromBioware = (character.bioware ?? []).reduce(
    (sum, item) => sum + (item.essenceCost ?? 0),
    0
  );

  return {
    current: Math.round(current * 100) / 100,
    lost: Math.round((fromCyberware + fromBioware) * 100) / 100,
    fromCyberware: Math.round(fromCyberware * 100) / 100,
    fromBioware: Math.round(fromBioware * 100) / 100,
  };
}

// =============================================================================
// ROUTE HANDLERS
// =============================================================================

/**
 * GET - List all installed augmentations for a character
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<AugmentationListResponse>> {
  try {
    const { characterId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          cyberware: [],
          bioware: [],
          essenceSummary: { current: 6, lost: 0, fromCyberware: 0, fromBioware: 0 },
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
          cyberware: [],
          bioware: [],
          essenceSummary: { current: 6, lost: 0, fromCyberware: 0, fromBioware: 0 },
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
          cyberware: [],
          bioware: [],
          essenceSummary: { current: 6, lost: 0, fromCyberware: 0, fromBioware: 0 },
          error: "Not authorized to view this character",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      cyberware: character.cyberware ?? [],
      bioware: character.bioware ?? [],
      essenceSummary: calculateEssenceSummary(character),
    });
  } catch (error) {
    console.error("Failed to get augmentations:", error);
    return NextResponse.json(
      {
        success: false,
        cyberware: [],
        bioware: [],
        essenceSummary: { current: 6, lost: 0, fromCyberware: 0, fromBioware: 0 },
        error: "Failed to get augmentations",
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Install a new augmentation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<InstallAugmentationResponse>> {
  try {
    const { characterId } = await params;

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
        { success: false, error: "Not authorized to modify this character" },
        { status: 403 }
      );
    }

    // Parse request body
    const body: InstallAugmentationRequest = await request.json();
    const { type, catalogId, grade, rating } = body;

    // Validate request
    if (!type || !["cyberware", "bioware"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid type. Must be 'cyberware' or 'bioware'" },
        { status: 400 }
      );
    }

    if (!catalogId) {
      return NextResponse.json(
        { success: false, error: "catalogId is required" },
        { status: 400 }
      );
    }

    if (!grade) {
      return NextResponse.json(
        { success: false, error: "grade is required" },
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
    const ruleset = loadResult.ruleset;

    // Find the catalog item
    let catalogItem: CyberwareCatalogItem | BiowareCatalogItem | undefined;

    if (type === "cyberware") {
      const cyberwareData = extractCyberware(ruleset);
      catalogItem = cyberwareData?.catalog?.find((item) => item.id === catalogId);
    } else {
      const biowareData = extractBioware(ruleset);
      catalogItem = biowareData?.catalog?.find((item) => item.id === catalogId);
    }

    if (!catalogItem) {
      return NextResponse.json(
        { success: false, error: `${type} item not found in catalog: ${catalogId}` },
        { status: 404 }
      );
    }

    // Determine lifecycle stage based on character status
    const lifecycleStage = character.status === "draft" ? "creation" : "active";

    // Validate installation
    const validationResult = validateAugmentationInstall(
      character,
      catalogItem,
      grade as CyberwareGrade | BiowareGrade,
      rating,
      { lifecycleStage, rules: DEFAULT_AUGMENTATION_RULES }
    );

    if (!validationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.errors[0]?.message ?? "Validation failed",
          warnings: validationResult.warnings.map((w) => w.message),
        },
        { status: 400 }
      );
    }

    // Install the augmentation
    const result = type === "cyberware"
      ? installCyberware(
          character,
          catalogItem as CyberwareCatalogItem,
          grade as CyberwareGrade,
          rating
        )
      : installBioware(
          character,
          catalogItem as BiowareCatalogItem,
          grade as BiowareGrade,
          rating
        );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error ?? "Installation failed" },
        { status: 400 }
      );
    }

    const updatedCharacter = result.character;

    // Save the updated character with audit trail
    await updateCharacterWithAudit(
      userId,
      characterId,
      {
        cyberware: updatedCharacter.cyberware,
        bioware: updatedCharacter.bioware,
        specialAttributes: updatedCharacter.specialAttributes,
        essenceHole: updatedCharacter.essenceHole,
      },
      {
        action: "augmentation_installed",
        actor: { userId, role: "owner" },
        details: {
          type,
          catalogId,
          name: catalogItem.name,
          grade,
          rating,
          essenceChange: result.essenceChange,
          magicLoss: result.magicLoss,
        },
        note: `Installed ${catalogItem.name} (${grade} grade)`,
      }
    );

    return NextResponse.json({
      success: true,
      installedItem: result.installedItem,
      essenceChange: result.essenceChange,
      magicLoss: result.magicLoss,
      warnings: validationResult.warnings.map((w) => w.message),
    });
  } catch (error) {
    console.error("Failed to install augmentation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to install augmentation" },
      { status: 500 }
    );
  }
}
