/**
 * API Route: GET /api/rulesets/[editionCode]
 * 
 * Returns merged ruleset for an edition.
 */

import { NextRequest, NextResponse } from "next/server";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import { loadRuleset, extractMetatypes, extractSkills, extractQualities, extractPriorityTable, extractMagicPaths, extractLifestyles } from "@/lib/rules/loader";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionCode: string }> }
) {
  try {
    const { editionCode } = await params;
    const { searchParams } = new URL(request.url);
    const bookIds = searchParams.get("bookIds")?.split(",").filter(Boolean);

    // Load and merge ruleset
    const result = await loadAndMergeRuleset(editionCode as "sr5" | "sr6" | "sr4a" | "sr4" | "sr3" | "sr2" | "sr1" | "anarchy", bookIds);

    if (!result.success || !result.ruleset) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to load ruleset" },
        { status: 500 }
      );
    }

    // Also load raw ruleset for creation methods and extracted data
    const loadResult = await loadRuleset({
      editionCode: editionCode as "sr5" | "sr6" | "sr4a" | "sr4" | "sr3" | "sr2" | "sr1" | "anarchy",
      bookIds,
    });

    const loadedRuleset = loadResult.ruleset;

    // Extract data for convenience
    const extractedData = loadedRuleset
      ? {
          metatypes: extractMetatypes(loadedRuleset),
          skills: extractSkills(loadedRuleset),
          qualities: extractQualities(loadedRuleset),
          priorityTable: extractPriorityTable(loadedRuleset),
          magicPaths: extractMagicPaths(loadedRuleset),
          lifestyles: extractLifestyles(loadedRuleset),
        }
      : null;

    return NextResponse.json({
      success: true,
      ruleset: result.ruleset,
      creationMethods: loadedRuleset?.creationMethods || [],
      extractedData,
    });
  } catch (error) {
    console.error("Failed to load ruleset:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load ruleset" },
      { status: 500 }
    );
  }
}

