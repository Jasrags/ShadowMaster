/**
 * Tests for /api/editions/[editionCode]/grunt-templates endpoint
 *
 * Tests grunt template listing with authentication, filtering by
 * professional rating, and search functionality.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as gruntTemplatesStorage from "@/lib/storage/grunt-templates";
import type { GruntTemplate, ProfessionalRating, EditionCode } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/grunt-templates");

// Helper to create mock request with nextUrl properly set
function createMockRequest(url: string): NextRequest {
  const request = new NextRequest(url);
  // NextRequest needs nextUrl to be properly set for searchParams access
  Object.defineProperty(request, "nextUrl", {
    value: new URL(url),
    writable: false,
  });
  return request;
}

describe("GET /api/editions/[editionCode]/grunt-templates", () => {
  const mockTemplates: GruntTemplate[] = [
    {
      id: "street-thugs",
      editionCode: "sr5" as EditionCode,
      professionalRating: 1 as ProfessionalRating,
      name: "Street Thugs",
      description: "Low-level street gangers",
      category: "criminal",
      baseGrunts: {
        attributes: {
          body: 3,
          agility: 3,
          reaction: 3,
          strength: 3,
          willpower: 2,
          logic: 2,
          intuition: 2,
          charisma: 2,
        },
        essence: 6,
        skills: { firearms: 2, unarmed: 2 },
        gear: [],
        weapons: [],
        armor: [],
        conditionMonitorSize: 9,
      },
      moraleTier: { breakThreshold: 33, rallyCost: 0, canRally: false },
    },
    {
      id: "corp-security",
      editionCode: "sr5" as EditionCode,
      professionalRating: 3 as ProfessionalRating,
      name: "Corporate Security",
      description: "Standard corporate security guards",
      category: "corporate",
      baseGrunts: {
        attributes: {
          body: 4,
          agility: 4,
          reaction: 4,
          strength: 4,
          willpower: 3,
          logic: 3,
          intuition: 3,
          charisma: 3,
        },
        essence: 6,
        skills: { firearms: 4, perception: 3 },
        gear: [],
        weapons: [],
        armor: [],
        conditionMonitorSize: 10,
      },
      moraleTier: { breakThreshold: 50, rallyCost: 2, canRally: true },
    },
    {
      id: "htrt",
      editionCode: "sr5" as EditionCode,
      professionalRating: 5 as ProfessionalRating,
      name: "HTRT",
      description: "High Threat Response Team",
      category: "military",
      baseGrunts: {
        attributes: {
          body: 5,
          agility: 5,
          reaction: 5,
          strength: 5,
          willpower: 4,
          logic: 4,
          intuition: 4,
          charisma: 3,
        },
        essence: 5.5,
        skills: { firearms: 6, tactics: 5, perception: 5 },
        gear: [],
        weapons: [],
        armor: [],
        conditionMonitorSize: 11,
      },
      moraleTier: { breakThreshold: 75, rallyCost: 1, canRally: true },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return templates for authenticated user", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(gruntTemplatesStorage.getGruntTemplates).mockResolvedValue(mockTemplates);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/grunt-templates");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.templates).toBeDefined();
    expect(data.templates).toHaveLength(3);
    expect(gruntTemplatesStorage.getGruntTemplates).toHaveBeenCalledWith("sr5", undefined);
  });

  it("should filter by professionalRating", async () => {
    const filteredTemplates = mockTemplates.filter((t) => t.professionalRating === 3);
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(gruntTemplatesStorage.getGruntTemplates).mockResolvedValue(filteredTemplates);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/grunt-templates?professionalRating=3"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.templates).toHaveLength(1);
    expect(data.templates[0].name).toBe("Corporate Security");
    expect(gruntTemplatesStorage.getGruntTemplates).toHaveBeenCalledWith("sr5", 3);
  });

  it("should search by query", async () => {
    const searchResults = mockTemplates.filter((t) => t.name.toLowerCase().includes("htrt"));
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(gruntTemplatesStorage.searchTemplates).mockResolvedValue(searchResults);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/grunt-templates?search=htrt"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.templates).toHaveLength(1);
    expect(data.templates[0].name).toBe("HTRT");
    expect(gruntTemplatesStorage.searchTemplates).toHaveBeenCalledWith("sr5", "htrt");
    expect(gruntTemplatesStorage.getGruntTemplates).not.toHaveBeenCalled();
  });

  it("should return empty array when no templates exist", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(gruntTemplatesStorage.getGruntTemplates).mockResolvedValue([]);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/grunt-templates");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.templates).toHaveLength(0);
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/grunt-templates");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Authentication required");
    expect(gruntTemplatesStorage.getGruntTemplates).not.toHaveBeenCalled();
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(gruntTemplatesStorage.getGruntTemplates).mockRejectedValue(
      new Error("Storage error")
    );

    const request = createMockRequest("http://localhost:3000/api/editions/sr5/grunt-templates");
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("An error occurred");

    consoleErrorSpy.mockRestore();
  });

  it("should prioritize search query over professionalRating filter", async () => {
    const searchResults = [mockTemplates[0]];
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(gruntTemplatesStorage.searchTemplates).mockResolvedValue(searchResults);

    const request = createMockRequest(
      "http://localhost:3000/api/editions/sr5/grunt-templates?search=street&professionalRating=5"
    );
    const response = await GET(request, {
      params: Promise.resolve({ editionCode: "sr5" }),
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Search takes precedence, so searchTemplates is called, not getGruntTemplates
    expect(gruntTemplatesStorage.searchTemplates).toHaveBeenCalledWith("sr5", "street");
    expect(gruntTemplatesStorage.getGruntTemplates).not.toHaveBeenCalled();
  });
});
