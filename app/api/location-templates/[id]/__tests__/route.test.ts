/**
 * Tests for /api/location-templates/[id] endpoint
 *
 * Tests retrieving a single location template (GET).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as locationsStorage from "@/lib/storage/locations";
import type { LocationTemplate } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/locations");

function createMockRequest(url: string): NextRequest {
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, { method: "GET" });
  Object.defineProperty(request, "nextUrl", { value: urlObj, writable: false });
  return request;
}

function createMockLocationTemplate(overrides?: Partial<LocationTemplate>): LocationTemplate {
  return {
    id: "template-id",
    name: "Test Template",
    description: "A test template",
    type: "physical",
    createdBy: "test-user-id",
    isPublic: false,
    tags: ["downtown", "corporate"],
    templateData: {
      name: "Test Location",
      type: "physical",
      visibility: "players",
      description: "A test location",
      securityRating: 5,
      tags: ["downtown", "corporate"],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as LocationTemplate;
}

describe("GET /api/location-templates/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/location-templates/template-id");
    const response = await GET(request, { params: Promise.resolve({ id: "template-id" }) });
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Authentication required");
  });

  it("should return 404 when template not found", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplate).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/location-templates/nonexistent");
    const response = await GET(request, { params: Promise.resolve({ id: "nonexistent" }) });
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe("Template not found");
  });

  it("should return own private template", async () => {
    const mockTemplate = createMockLocationTemplate({
      createdBy: "test-user-id",
      isPublic: false,
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest("http://localhost:3000/api/location-templates/template-id");
    const response = await GET(request, { params: Promise.resolve({ id: "template-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.template).toBeDefined();
    expect(data.template.id).toBe("template-id");
  });

  it("should return public template owned by other user", async () => {
    const mockTemplate = createMockLocationTemplate({
      createdBy: "other-user-id",
      isPublic: true,
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest("http://localhost:3000/api/location-templates/template-id");
    const response = await GET(request, { params: Promise.resolve({ id: "template-id" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.template).toBeDefined();
  });

  it("should return 403 for private template owned by other user", async () => {
    const mockTemplate = createMockLocationTemplate({
      createdBy: "other-user-id",
      isPublic: false,
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest("http://localhost:3000/api/location-templates/template-id");
    const response = await GET(request, { params: Promise.resolve({ id: "template-id" }) });
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe("Access denied");
  });

  it("should include all template data in response", async () => {
    const mockTemplate = createMockLocationTemplate({
      id: "full-template",
      name: "Full Template",
      description: "Complete template",
      type: "matrix-host",
      tags: ["matrix", "host"],
      templateData: {
        name: "Matrix Host",
        type: "matrix-host",
        visibility: "gm-only",
        description: "A matrix host",
        securityRating: 8,
      },
      createdBy: "test-user-id",
      isPublic: true,
    });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest("http://localhost:3000/api/location-templates/full-template");
    const response = await GET(request, { params: Promise.resolve({ id: "full-template" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.template.name).toBe("Full Template");
    expect(data.template.type).toBe("matrix-host");
    expect(data.template.tags).toContain("matrix");
    expect(data.template.templateData).toBeDefined();
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplate).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest("http://localhost:3000/api/location-templates/template-id");
    const response = await GET(request, { params: Promise.resolve({ id: "template-id" }) });
    expect(response.status).toBe(500);
    consoleErrorSpy.mockRestore();
  });
});
