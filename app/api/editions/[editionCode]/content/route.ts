/**
 * API Route: GET /api/editions/[editionCode]/content
 *
 * Returns paginated content previews for an edition.
 * Supports filtering by category.
 *
 * Query params:
 *   - category: Filter by content category (metatypes, skills, qualities, gear, etc.)
 *   - limit: Maximum number of items to return (default: 20, max: 100)
 *   - offset: Pagination offset (default: 0)
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllBookPayloads, getEdition } from "@/lib/storage/editions";
import type { ContentPreviewItem, ContentPreviewResponse } from "@/lib/types";
import type { EditionCode } from "@/lib/types";

// Valid content categories for filtering
const VALID_CATEGORIES = [
  "metatypes",
  "skills",
  "qualities",
  "gear",
  "magic",
  "cyberware",
  "bioware",
  "vehicles",
] as const;

type ContentCategoryType = (typeof VALID_CATEGORIES)[number];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionCode: string }> }
) {
  try {
    const { editionCode } = await params;
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get("category") as ContentCategoryType | null;
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Validate edition exists
    const edition = await getEdition(editionCode as EditionCode);
    if (!edition) {
      return NextResponse.json(
        { success: false, error: `Edition not found: ${editionCode}` },
        { status: 404 }
      );
    }

    // Validate category if provided
    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { success: false, error: `Invalid category: ${category}. Valid options: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    const payloads = await getAllBookPayloads(editionCode as EditionCode);
    const allItems: ContentPreviewItem[] = [];

    // Extract items based on category or all categories
    for (const payload of payloads) {
      const modules = payload.modules || {};
      const sourceBook = payload.meta.title;

      if (!category || category === "metatypes") {
        const metatypesPayload = modules.metatypes?.payload as { metatypes?: Array<{ id: string; name: string; description?: string }> } | undefined;
        if (metatypesPayload?.metatypes) {
          for (const item of metatypesPayload.metatypes) {
            allItems.push({
              id: item.id,
              name: item.name,
              category: "metatypes",
              summary: item.description?.slice(0, 100),
              source: sourceBook,
            });
          }
        }
      }

      if (!category || category === "skills") {
        const skillsPayload = modules.skills?.payload as { activeSkills?: Array<{ id: string; name: string; linkedAttribute?: string }> } | undefined;
        if (skillsPayload?.activeSkills) {
          for (const item of skillsPayload.activeSkills) {
            allItems.push({
              id: item.id,
              name: item.name,
              category: "skills",
              summary: item.linkedAttribute ? `Linked to ${item.linkedAttribute}` : undefined,
              source: sourceBook,
            });
          }
        }
      }

      if (!category || category === "qualities") {
        const qualitiesPayload = modules.qualities?.payload as { 
          positive?: Array<{ id: string; name: string; description?: string }>; 
          negative?: Array<{ id: string; name: string; description?: string }>; 
        } | undefined;
        if (qualitiesPayload) {
          for (const item of qualitiesPayload.positive || []) {
            allItems.push({
              id: item.id,
              name: item.name,
              category: "qualities",
              summary: item.description?.slice(0, 100),
              source: sourceBook,
            });
          }
          for (const item of qualitiesPayload.negative || []) {
            allItems.push({
              id: item.id,
              name: item.name,
              category: "qualities",
              summary: item.description?.slice(0, 100),
              source: sourceBook,
            });
          }
        }
      }

      if (!category || category === "gear") {
        // Gear structure: weapons/armor are objects with category keys (pistols, rifles, etc.)
        // Each category contains an array of items
        const gearPayload = modules.gear?.payload as Record<string, unknown> | undefined;
        if (gearPayload) {
          // Extract weapons (nested object with categories)
          const weapons = gearPayload.weapons as Record<string, Array<{ id?: string; name: string; damage?: string }>> | undefined;
          if (weapons && typeof weapons === "object") {
            for (const [weaponCategory, weaponList] of Object.entries(weapons)) {
              if (Array.isArray(weaponList)) {
                for (const item of weaponList) {
                  allItems.push({
                    id: item.id || item.name.toLowerCase().replace(/\s+/g, "-"),
                    name: item.name,
                    category: "gear",
                    summary: item.damage ? `${weaponCategory}: ${item.damage}` : weaponCategory,
                    source: sourceBook,
                  });
                }
              }
            }
          }

          // Extract armor (can be array or nested object)
          const armor = gearPayload.armor;
          if (Array.isArray(armor)) {
            for (const item of armor as Array<{ id?: string; name: string; armorRating?: number }>) {
              allItems.push({
                id: item.id || item.name.toLowerCase().replace(/\s+/g, "-"),
                name: item.name,
                category: "gear",
                summary: item.armorRating ? `Armor: ${item.armorRating}` : undefined,
                source: sourceBook,
              });
            }
          } else if (armor && typeof armor === "object") {
            // Handle nested armor categories
            for (const [, armorList] of Object.entries(armor as Record<string, unknown>)) {
              if (Array.isArray(armorList)) {
                for (const item of armorList as Array<{ id?: string; name: string; armorRating?: number }>) {
                  allItems.push({
                    id: item.id || item.name.toLowerCase().replace(/\s+/g, "-"),
                    name: item.name,
                    category: "gear",
                    summary: item.armorRating ? `Armor: ${item.armorRating}` : undefined,
                    source: sourceBook,
                  });
                }
              }
            }
          }
        }
      }
    }

    // Apply pagination
    const total = allItems.length;
    const items = allItems.slice(offset, offset + limit);

    const response: ContentPreviewResponse = {
      items,
      total,
      offset,
      limit,
      category: category || undefined,
    };

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
