/**
 * API Route: /api/characters/[characterId]/augmentations/validate
 *
 * POST - Validate potential installation without committing
 *
 * Returns validation result, projected essence, and projected stats impact
 * to preview an augmentation installation before committing.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter } from "@/lib/storage/characters";
import { loadRuleset, extractCyberware, extractBioware } from "@/lib/rules/loader";
import {
  validateAugmentationInstall,
  DEFAULT_AUGMENTATION_RULES,
} from "@/lib/rules/augmentations/validation";
import {
  calculateCyberwareEssence,
  calculateBiowareEssence,
  calculateRemainingEssence,
} from "@/lib/rules/augmentations/essence";
import { calculateMagicLoss, shouldTrackEssenceHole } from "@/lib/rules/augmentations/essence-hole";
import type { CyberwareGrade, BiowareGrade } from "@/lib/types";
import type { CyberwareCatalogItem, BiowareCatalogItem } from "@/lib/types/edition";

// =============================================================================
// TYPES
// =============================================================================

interface ValidateAugmentationRequest {
  type: "cyberware" | "bioware";
  catalogId: string;
  grade: string;
  rating?: number;
}

interface ValidationResponse {
  success: boolean;
  valid: boolean;
  errors: Array<{ code: string; message: string }>;
  warnings: Array<{ code: string; message: string }>;
  projection?: {
    essenceCost: number;
    currentEssence: number;
    projectedEssence: number;
    projectedMagicLoss?: number;
    catalogItem: {
      id: string;
      name: string;
      category: string;
      description?: string;
      essenceCost: number;
      cost: number;
      availability: number;
    };
  };
  error?: string;
}

// =============================================================================
// ROUTE HANDLER
// =============================================================================

/**
 * POST - Validate potential augmentation installation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<ValidationResponse>> {
  try {
    const { characterId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, valid: false, errors: [], warnings: [], error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, valid: false, errors: [], warnings: [], error: "Character not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        { success: false, valid: false, errors: [], warnings: [], error: "Not authorized" },
        { status: 403 }
      );
    }

    // Parse request body
    const body: ValidateAugmentationRequest = await request.json();
    const { type, catalogId, grade, rating } = body;

    // Validate request parameters
    if (!type || !["cyberware", "bioware"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          errors: [{ code: "INVALID_TYPE", message: "Type must be 'cyberware' or 'bioware'" }],
          warnings: [],
        },
        { status: 400 }
      );
    }

    if (!catalogId) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          errors: [{ code: "MISSING_CATALOG_ID", message: "catalogId is required" }],
          warnings: [],
        },
        { status: 400 }
      );
    }

    if (!grade) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          errors: [{ code: "MISSING_GRADE", message: "grade is required" }],
          warnings: [],
        },
        { status: 400 }
      );
    }

    // Load ruleset to get catalog
    const editionCode = character.editionCode ?? "sr5";
    const loadResult = await loadRuleset({ editionCode });
    if (!loadResult.success || !loadResult.ruleset) {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          errors: [],
          warnings: [],
          error: `Failed to load ruleset for edition: ${editionCode}`,
        },
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
        {
          success: false,
          valid: false,
          errors: [{ code: "CATALOG_ITEM_NOT_FOUND", message: `${type} not found: ${catalogId}` }],
          warnings: [],
        },
        { status: 404 }
      );
    }

    // Determine lifecycle stage
    const lifecycleStage = character.status === "draft" ? "creation" : "active";

    // Run validation
    const validationResult = validateAugmentationInstall(
      character,
      catalogItem,
      grade as CyberwareGrade | BiowareGrade,
      rating,
      { lifecycleStage, rules: DEFAULT_AUGMENTATION_RULES }
    );

    // Calculate essence projection
    const currentEssence = character.specialAttributes?.essence ?? 6;
    let essenceCost: number;

    if (type === "cyberware") {
      essenceCost = calculateCyberwareEssence(
        catalogItem as CyberwareCatalogItem,
        grade as CyberwareGrade,
        rating
      );
    } else {
      essenceCost = calculateBiowareEssence(
        catalogItem as BiowareCatalogItem,
        grade as BiowareGrade,
        rating
      );
    }

    const projectedEssence = calculateRemainingEssence(currentEssence, essenceCost);

    // Calculate magic loss for awakened characters
    let projectedMagicLoss: number | undefined;
    if (shouldTrackEssenceHole(character)) {
      const currentEssenceHole = character.essenceHole ?? {
        peakEssenceLoss: 0,
        currentEssenceLoss: 0,
        essenceHole: 0,
        magicLost: 0,
      };
      // Calculate what magic loss would occur
      const totalCurrentLoss =
        (character.cyberware ?? []).reduce((sum, c) => sum + c.essenceCost, 0) +
        (character.bioware ?? []).reduce((sum, b) => sum + b.essenceCost, 0);
      const newTotalLoss = totalCurrentLoss + essenceCost;
      const newPeakLoss = Math.max(currentEssenceHole.peakEssenceLoss, newTotalLoss);
      // Magic loss is based on the peak essence loss (rounded up)
      projectedMagicLoss = calculateMagicLoss(newPeakLoss);
    }

    return NextResponse.json({
      success: true,
      valid: validationResult.valid,
      errors: validationResult.errors.map((e) => ({ code: e.code, message: e.message })),
      warnings: validationResult.warnings.map((w) => ({ code: w.code, message: w.message })),
      projection: {
        essenceCost: Math.round(essenceCost * 100) / 100,
        currentEssence: Math.round(currentEssence * 100) / 100,
        projectedEssence: Math.round(projectedEssence * 100) / 100,
        projectedMagicLoss,
        catalogItem: {
          id: catalogItem.id,
          name: catalogItem.name,
          category: catalogItem.category,
          description: catalogItem.description,
          essenceCost: catalogItem.essenceCost,
          cost: catalogItem.cost,
          availability: catalogItem.availability,
        },
      },
    });
  } catch (error) {
    console.error("Failed to validate augmentation:", error);
    return NextResponse.json(
      {
        success: false,
        valid: false,
        errors: [],
        warnings: [],
        error: "Failed to validate augmentation",
      },
      { status: 500 }
    );
  }
}
