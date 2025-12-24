/**
 * API Route: GET /api/editions/[editionCode]/methods/[methodId]
 *
 * Returns detailed information about a specific creation method,
 * including its impact on resource allocation.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCreationMethod, getEdition } from "@/lib/storage/editions";
import type { CreationMethodSummary } from "@/lib/types";
import type { EditionCode } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionCode: string; methodId: string }> }
) {
  try {
    const { editionCode, methodId } = await params;

    // Validate edition exists
    const edition = await getEdition(editionCode as EditionCode);
    if (!edition) {
      return NextResponse.json(
        { success: false, error: `Edition not found: ${editionCode}` },
        { status: 404 }
      );
    }

    // Get the creation method
    const method = await getCreationMethod(editionCode as EditionCode, methodId);
    if (!method) {
      return NextResponse.json(
        { success: false, error: `Creation method not found: ${methodId}` },
        { status: 404 }
      );
    }

    // Build detailed summary with resource allocation explanation
    const summary: CreationMethodSummary = {
      id: method.id,
      name: method.name,
      description: method.description || `${method.name} character creation method`,
      resourceAllocationImpact: buildResourceAllocationExplanation(method),
      complexity: determineComplexity(method),
      estimatedTimeMinutes: estimateCreationTime(method),
      tradeoffs: getMethodTradeoffs(method),
    };

    return NextResponse.json({
      success: true,
      method: summary,
      rawMethod: method, // Include raw data for advanced users
    });
  } catch (error) {
    console.error("Failed to fetch creation method:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch creation method" },
      { status: 500 }
    );
  }
}

/**
 * Generate explanation of resource allocation for a creation method
 */
function buildResourceAllocationExplanation(method: {
  id: string;
  name: string;
  type?: string;
}): string {
  // Build explanation based on method type
  if (method.id === "priority" || method.type === "priority") {
    return "Priority-based creation uses five priority levels (A through E) assigned to five categories: Metatype, Attributes, Magic/Resonance, Skills, and Resources. Each priority can only be used once, creating meaningful trade-offs. High priority in one area means lower priority elsewhere.";
  }
  
  if (method.id === "sum-to-ten" || method.type === "sum-to-ten") {
    return "Sum-to-Ten is a variant of Priority creation where priority levels are assigned point values (A=4, B=3, C=2, D=1, E=0) and must total exactly 10. This allows for more flexible combinations than standard Priority.";
  }
  
  if (method.id === "karma-build" || method.type === "karma") {
    return "Karma Build provides a pool of Karma points to spend directly on all character aspects. Every attribute point, skill rank, and enhancement has a Karma cost. This method offers maximum flexibility but requires careful planning.";
  }
  
  if (method.id === "life-modules" || method.type === "life-modules") {
    return "Life Modules create characters through narrative choices representing life stages. Each module (nationality, formative years, education, career) provides skills, contacts, and backgrounds while telling your character's story.";
  }

  return `The ${method.name} method allocates resources based on its specific rules. Consult the rulebook for detailed allocation guidelines.`;
}

/**
 * Determine complexity level based on method characteristics
 */
function determineComplexity(method: {
  id: string;
  type?: string;
}): "beginner" | "intermediate" | "advanced" {
  if (method.id === "priority") return "beginner";
  if (method.id === "sum-to-ten") return "intermediate";
  if (method.id === "karma-build" || method.type === "karma") return "advanced";
  if (method.id === "life-modules") return "intermediate";
  return "intermediate";
}

/**
 * Estimate character creation time in minutes
 */
function estimateCreationTime(method: { id: string }): number {
  switch (method.id) {
    case "priority":
      return 60; // 1 hour for beginners
    case "sum-to-ten":
      return 75;
    case "karma-build":
      return 120; // 2 hours for point-buy
    case "life-modules":
      return 90;
    default:
      return 90;
  }
}

/**
 * Get key tradeoffs for a creation method
 */
function getMethodTradeoffs(method: { id: string }): string[] {
  switch (method.id) {
    case "priority":
      return [
        "Simple and fast but limits optimization",
        "Priority A-E choices create clear character archetypes",
        "Less flexible than point-buy systems",
      ];
    case "sum-to-ten":
      return [
        "More flexible than standard Priority",
        "Can create unique priority combinations",
        "Still constrained to total of 10 points",
      ];
    case "karma-build":
      return [
        "Maximum flexibility in character design",
        "Requires careful math and planning",
        "Can create highly optimized or unbalanced characters",
      ];
    case "life-modules":
      return [
        "Narrative-driven character creation",
        "Less mathematical optimization",
        "Great for developing character backstory",
      ];
    default:
      return [];
  }
}
