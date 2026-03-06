/**
 * Tests for /api/editions/[editionCode]/rule-reference endpoint
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as editionsStorage from "@/lib/storage/editions";
import type { Edition, EditionCode, RuleReferenceData } from "@/lib/types";

vi.mock("@/lib/storage/editions");

function createMockRequest(url: string): NextRequest {
  return new NextRequest(url);
}

describe("GET /api/editions/[editionCode]/rule-reference", () => {
  const mockEdition: Edition = {
    id: "sr5",
    name: "Shadowrun 5th Edition",
    shortCode: "sr5" as EditionCode,
    version: "1.0.0",
    releaseYear: 2013,
    bookIds: ["core-rulebook"],
    creationMethodIds: ["priority"],
    createdAt: new Date().toISOString(),
  };

  const mockRuleReference: RuleReferenceData = {
    version: "1.0.0",
    editionCode: "sr5",
    entries: [
      {
        id: "defense-modifiers",
        title: "Defense Modifiers",
        category: "combat",
        subcategory: "ranged",
        tags: ["defense", "dodge"],
        summary: "Dice pool modifiers for defense tests.",
        tables: [
          {
            headers: ["Situation", "Modifier"],
            rows: [["Defender prone", "-2"]],
          },
        ],
        source: { book: "SR5 Core", page: 188 },
      },
      {
        id: "noise-table",
        title: "Noise Table",
        category: "matrix",
        tags: ["noise", "distance"],
        summary: "Noise levels based on distance.",
        tables: [
          {
            headers: ["Distance", "Noise"],
            rows: [["Up to 100m", "0"]],
          },
        ],
        source: { book: "SR5 Core", page: 230 },
      },
      {
        id: "assensing-table",
        title: "Assensing Table",
        category: "magic",
        tags: ["assensing", "astral"],
        summary: "Information gained from assensing.",
        tables: [
          {
            headers: ["Hits", "Info"],
            rows: [["1", "General health"]],
          },
        ],
        source: { book: "SR5 Core", page: 312 },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all rule reference entries", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getRuleReference).mockResolvedValue(mockRuleReference);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/rule-reference");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.entries).toHaveLength(3);
    expect(data.data.version).toBe("1.0.0");
  });

  it("should filter entries by category", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getRuleReference).mockResolvedValue(mockRuleReference);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/rule-reference?category=combat"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.entries).toHaveLength(1);
    expect(data.data.entries[0].id).toBe("defense-modifiers");
  });

  it("should return 404 for unknown edition", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/editions/invalid/rule-reference");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "invalid" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
  });

  it("should return 400 for invalid category", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/rule-reference?category=invalid"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Invalid category");
  });

  it("should return 404 when no rule reference data exists", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getRuleReference).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/rule-reference");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toContain("No rule reference data found");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(editionsStorage.getEdition).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/rule-reference");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
