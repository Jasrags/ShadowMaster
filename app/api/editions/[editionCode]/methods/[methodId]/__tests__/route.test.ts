/**
 * Tests for /api/editions/[editionCode]/methods/[methodId] endpoint
 *
 * Tests creation method details including summary, complexity,
 * estimated time, and tradeoffs.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as editionsStorage from "@/lib/storage/editions";
import type { Edition, EditionCode, CreationMethod } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/storage/editions");

// Helper to create mock request
function createMockRequest(url: string): NextRequest {
  return new NextRequest(url);
}

describe("GET /api/editions/[editionCode]/methods/[methodId]", () => {
  const mockEdition: Edition = {
    id: "sr5",
    name: "Shadowrun 5th Edition",
    shortCode: "sr5" as EditionCode,
    version: "1.0.0",
    releaseYear: 2013,
    bookIds: ["core-rulebook"],
    creationMethodIds: ["priority", "sum-to-ten", "karma-build"],
    createdAt: new Date().toISOString(),
  };

  const mockPriorityMethod: CreationMethod = {
    id: "priority",
    editionId: "sr5",
    editionCode: "sr5" as EditionCode,
    name: "Priority System",
    type: "priority" as const,
    description: "Classic priority-based character creation",
    version: "1.0.0",
    steps: [],
    budgets: [],
    constraints: [],
    createdAt: new Date().toISOString(),
  };

  const mockSumToTenMethod: CreationMethod = {
    id: "sum-to-ten",
    editionId: "sr5",
    editionCode: "sr5" as EditionCode,
    name: "Sum-to-Ten",
    type: "sum-to-ten" as const,
    description: "Flexible priority variant",
    version: "1.0.0",
    steps: [],
    budgets: [],
    constraints: [],
    createdAt: new Date().toISOString(),
  };

  const mockKarmaBuildMethod: CreationMethod = {
    id: "karma-build",
    editionId: "sr5",
    editionCode: "sr5" as EditionCode,
    name: "Karma Build",
    type: "point-buy" as const,
    description: "Point-buy character creation",
    version: "1.0.0",
    steps: [],
    budgets: [],
    constraints: [],
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return method with summary (priority)", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getCreationMethod).mockResolvedValue(mockPriorityMethod);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/methods/priority");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5", methodId: "priority" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.method).toBeDefined();
    expect(data.method.id).toBe("priority");
    expect(data.method.name).toBe("Priority System");
    expect(data.method.description).toBeDefined();
    expect(data.method.resourceAllocationImpact).toContain("priority");
  });

  it("should return method with rawMethod included", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getCreationMethod).mockResolvedValue(mockPriorityMethod);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/methods/priority");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5", methodId: "priority" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.rawMethod).toBeDefined();
    expect(data.rawMethod.id).toBe("priority");
    expect(data.rawMethod.editionCode).toBe("sr5");
  });

  it("should include complexity assessment (beginner for priority)", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getCreationMethod).mockResolvedValue(mockPriorityMethod);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/methods/priority");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5", methodId: "priority" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.method.complexity).toBe("beginner");
  });

  it("should include complexity assessment (intermediate for sum-to-ten)", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getCreationMethod).mockResolvedValue(mockSumToTenMethod);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/methods/sum-to-ten");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5", methodId: "sum-to-ten" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.method.complexity).toBe("intermediate");
  });

  it("should include complexity assessment (advanced for karma-build)", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getCreationMethod).mockResolvedValue(mockKarmaBuildMethod);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/methods/karma-build");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5", methodId: "karma-build" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.method.complexity).toBe("advanced");
  });

  it("should include estimated time", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getCreationMethod).mockResolvedValue(mockPriorityMethod);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/methods/priority");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5", methodId: "priority" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.method.estimatedTimeMinutes).toBeDefined();
    expect(data.method.estimatedTimeMinutes).toBe(60); // Priority is 60 minutes
  });

  it("should include tradeoffs", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getCreationMethod).mockResolvedValue(mockPriorityMethod);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/methods/priority");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5", methodId: "priority" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.method.tradeoffs).toBeDefined();
    expect(Array.isArray(data.method.tradeoffs)).toBe(true);
    expect(data.method.tradeoffs.length).toBeGreaterThan(0);
  });

  it("should return 404 when edition not found", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(null);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/invalid/methods/priority"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "invalid", methodId: "priority" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Edition not found: invalid");
  });

  it("should return 404 when method not found", async () => {
    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getCreationMethod).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/methods/nonexistent");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5", methodId: "nonexistent" }),
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Creation method not found: nonexistent");
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(editionsStorage.getEdition).mockRejectedValue(new Error("Storage error"));

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/methods/priority");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5", methodId: "priority" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to fetch creation method");

    consoleErrorSpy.mockRestore();
  });

  it("should handle method with missing description by generating default", async () => {
    const methodWithoutDescription: CreationMethod = {
      ...mockPriorityMethod,
      description: undefined,
    };

    vi.mocked(editionsStorage.getEdition).mockResolvedValue(mockEdition);
    vi.mocked(editionsStorage.getCreationMethod).mockResolvedValue(methodWithoutDescription);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/methods/priority");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5", methodId: "priority" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.method.description).toBeDefined();
    expect(data.method.description).toContain("Priority System");
  });
});
