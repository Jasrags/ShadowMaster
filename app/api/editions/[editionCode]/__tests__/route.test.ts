/**
 * Tests for /api/editions/[editionCode] endpoint
 *
 * Tests edition data loading including books, creation methods,
 * and optional content summary.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as editionsStorage from "@/lib/storage/editions";
import type { Edition, EditionCode, Book, ContentSummary, CreationMethod } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/storage/editions");

// Helper to create mock request
function createMockRequest(url: string): NextRequest {
  return new NextRequest(url);
}

describe("GET /api/editions/[editionCode]", () => {
  const mockEdition: Edition = {
    id: "sr5",
    name: "Shadowrun 5th Edition",
    shortCode: "sr5" as EditionCode,
    version: "1.0.0",
    releaseYear: 2013,
    bookIds: ["core-rulebook", "run-faster"],
    creationMethodIds: ["priority", "sum-to-ten"],
    createdAt: new Date().toISOString(),
  };

  const mockBooks: Book[] = [
    {
      id: "core-rulebook",
      editionId: "sr5",
      title: "Core Rulebook",
      version: "1.0.0",
      isCore: true,
      categories: ["core"],
      payloadRef: "core-rulebook.json",
      createdAt: new Date().toISOString(),
    },
    {
      id: "run-faster",
      editionId: "sr5",
      title: "Run Faster",
      version: "1.0.0",
      isCore: false,
      categories: ["sourcebook"],
      payloadRef: "run-faster.json",
      createdAt: new Date().toISOString(),
    },
  ];

  const mockCreationMethods: CreationMethod[] = [
    {
      id: "priority",
      editionId: "sr5",
      editionCode: "sr5" as EditionCode,
      name: "Priority System",
      type: "priority" as const,
      version: "1.0.0",
      steps: [],
      budgets: [],
      constraints: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: "sum-to-ten",
      editionId: "sr5",
      editionCode: "sr5" as EditionCode,
      name: "Sum-to-Ten",
      type: "sum-to-ten" as const,
      version: "1.0.0",
      steps: [],
      budgets: [],
      constraints: [],
      createdAt: new Date().toISOString(),
    },
  ];

  const mockContentSummary: ContentSummary = {
    editionCode: "sr5" as EditionCode,
    metatypeCount: 5,
    skillCount: 50,
    qualityCount: 100,
    spellCount: 200,
    gearCount: 500,
    augmentationCount: 150,
    vehicleCount: 30,
    categories: [],
    generatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return edition with all books when no bookIds param", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getAllBooks).mockResolvedValue(mockBooks);
    vi.mocked(editionsStorage.getAllCreationMethods).mockResolvedValue(mockCreationMethods);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.edition).toBeDefined();
    expect(data.edition.id).toBe("sr5");
    expect(data.books).toHaveLength(2);
    expect(data.creationMethods).toHaveLength(2);
    expect(editionsStorage.getEdition).toHaveBeenCalledWith("sr5");
    expect(editionsStorage.getAllBooks).toHaveBeenCalledWith("sr5");
    expect(editionsStorage.getAllCreationMethods).toHaveBeenCalledWith("sr5");
  });

  it("should return edition with specific books when bookIds param provided", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getBook).mockResolvedValue(mockBooks[0]);
    vi.mocked(editionsStorage.getAllCreationMethods).mockResolvedValue(mockCreationMethods);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5?bookIds=core-rulebook"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.books).toHaveLength(1);
    expect(data.books[0].id).toBe("core-rulebook");
    expect(editionsStorage.getBook).toHaveBeenCalledWith("sr5", "core-rulebook");
    expect(editionsStorage.getAllBooks).not.toHaveBeenCalled();
  });

  it("should include content summary when include=summary", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getAllBooks).mockResolvedValue(mockBooks);
    vi.mocked(editionsStorage.getAllCreationMethods).mockResolvedValue(mockCreationMethods);
    vi.mocked(editionsStorage.getEditionContentSummary).mockResolvedValue(mockContentSummary);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5?include=summary");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.contentSummary).toBeDefined();
    expect(data.contentSummary.metatypeCount).toBe(5);
    expect(data.contentSummary.skillCount).toBe(50);
    expect(editionsStorage.getEditionContentSummary).toHaveBeenCalledWith("sr5");
  });

  it("should return 404 when edition not found", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/editions/invalid");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "invalid" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Edition not found: invalid");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(editionsStorage.getEdition).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest("http://localhost:3000/api/editions/sr5");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to load edition data");

    consoleErrorSpy.mockRestore();
  });

  it("should filter out null books when some bookIds not found", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getBook)
      .mockResolvedValueOnce(mockBooks[0])
      .mockResolvedValueOnce(null);
    vi.mocked(editionsStorage.getAllCreationMethods).mockResolvedValue(mockCreationMethods);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5?bookIds=core-rulebook,nonexistent"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.books).toHaveLength(1);
    expect(data.books[0].id).toBe("core-rulebook");
  });
});
