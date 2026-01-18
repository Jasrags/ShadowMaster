/**
 * Tests for /api/editions/[editionCode]/content endpoint
 *
 * Tests paginated content previews with category filtering.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as editionsStorage from "@/lib/storage/editions";
import type { Edition, EditionCode, BookPayload } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/storage/editions");

// Helper to create mock request
function createMockRequest(url: string): NextRequest {
  return new NextRequest(url);
}

describe("GET /api/editions/[editionCode]/content", () => {
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

  const mockBookPayload: BookPayload = {
    meta: {
      bookId: "core-rulebook",
      title: "Core Rulebook",
      edition: "sr5" as EditionCode,
      version: "1.0.0",
      category: "core" as const,
    },
    modules: {
      metatypes: {
        mergeStrategy: "replace" as const,
        payload: {
          metatypes: [
            { id: "human", name: "Human", description: "The most common metatype" },
            { id: "elf", name: "Elf", description: "Graceful and long-lived" },
            { id: "dwarf", name: "Dwarf", description: "Stout and hardy" },
          ],
        },
      },
      skills: {
        mergeStrategy: "replace" as const,
        payload: {
          activeSkills: [
            { id: "firearms", name: "Firearms", linkedAttribute: "agility" },
            { id: "stealth", name: "Stealth", linkedAttribute: "agility" },
          ],
        },
      },
      qualities: {
        mergeStrategy: "replace" as const,
        payload: {
          positive: [
            { id: "ambidextrous", name: "Ambidextrous", description: "Use both hands equally" },
          ],
          negative: [{ id: "addiction", name: "Addiction", description: "Dependent on substance" }],
        },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return paginated content with default limit/offset", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getAllBookPayloads).mockResolvedValue([mockBookPayload]);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/content");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.items).toBeDefined();
    expect(data.total).toBeGreaterThan(0);
    expect(data.offset).toBe(0);
    expect(data.limit).toBe(20);
    expect(editionsStorage.getEdition).toHaveBeenCalledWith("sr5");
    expect(editionsStorage.getAllBookPayloads).toHaveBeenCalledWith("sr5");
  });

  it("should filter by category (metatypes)", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getAllBookPayloads).mockResolvedValue([mockBookPayload]);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/content?category=metatypes"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.items).toBeDefined();
    expect(data.items.length).toBe(3); // Human, Elf, Dwarf
    expect(data.category).toBe("metatypes");
    data.items.forEach((item: { category: string }) => {
      expect(item.category).toBe("metatypes");
    });
  });

  it("should filter by category (skills)", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getAllBookPayloads).mockResolvedValue([mockBookPayload]);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/content?category=skills"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.items.length).toBe(2); // Firearms, Stealth
    expect(data.category).toBe("skills");
  });

  it("should filter by category (qualities)", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getAllBookPayloads).mockResolvedValue([mockBookPayload]);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/content?category=qualities"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.items.length).toBe(2); // Ambidextrous + Addiction
    expect(data.category).toBe("qualities");
  });

  it("should respect limit parameter", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getAllBookPayloads).mockResolvedValue([mockBookPayload]);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/content?limit=2");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.items.length).toBe(2);
    expect(data.limit).toBe(2);
  });

  it("should cap limit at 100", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getAllBookPayloads).mockResolvedValue([mockBookPayload]);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/content?limit=500");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.limit).toBe(100);
  });

  it("should respect offset parameter", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getAllBookPayloads).mockResolvedValue([mockBookPayload]);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/content?category=metatypes&offset=1"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.offset).toBe(1);
    // With 3 metatypes and offset 1, should return 2 items
    expect(data.items.length).toBe(2);
    // First item should be "elf" (second metatype)
    expect(data.items[0].id).toBe("elf");
  });

  it("should return 404 when edition not found", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/editions/invalid/content");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "invalid" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Edition not found: invalid");
  });

  it("should return 400 for invalid category", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/content?category=invalid"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Invalid category");
    expect(data.error).toContain("invalid");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(editionsStorage.getEdition).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/content");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to fetch content");

    consoleErrorSpy.mockRestore();
  });

  it("should handle empty book payloads", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getAllBookPayloads).mockResolvedValue([]);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/content");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.items).toHaveLength(0);
    expect(data.total).toBe(0);
  });
});
