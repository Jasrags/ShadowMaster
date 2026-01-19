/**
 * Tests for /api/location-templates endpoint
 *
 * Tests listing (GET) and creating (POST) location templates.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as locationsStorage from "@/lib/storage/locations";
import type { LocationTemplate } from "@/lib/types";

vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/locations");

function createMockRequest(url: string, body?: unknown, method = "GET"): NextRequest {
  const headers = new Headers();
  if (body) headers.set("Content-Type", "application/json");
  const urlObj = new URL(url);
  const request = new NextRequest(urlObj, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });
  Object.defineProperty(request, "nextUrl", { value: urlObj, writable: false });
  if (body) (request as { json: () => Promise<unknown> }).json = async () => body;
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

describe("GET /api/location-templates", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest("http://localhost:3000/api/location-templates");
    const response = await GET(request);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Authentication required");
    expect(data.templates).toEqual([]);
  });

  it("should return all accessible templates", async () => {
    const templates = [
      createMockLocationTemplate({
        id: "template-1",
        name: "My Template",
        createdBy: "test-user-id",
      }),
      createMockLocationTemplate({
        id: "template-2",
        name: "Public Template",
        isPublic: true,
        createdBy: "other-user",
      }),
    ];
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplates).mockResolvedValue(templates);

    const request = createMockRequest("http://localhost:3000/api/location-templates");
    const response = await GET(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.templates).toHaveLength(2);
  });

  it("should filter by type", async () => {
    const templates = [createMockLocationTemplate({ type: "matrix-host" })];
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplates).mockResolvedValue(templates);

    const request = createMockRequest(
      "http://localhost:3000/api/location-templates?type=matrix-host"
    );
    const response = await GET(request);
    expect(response.status).toBe(200);
    expect(locationsStorage.getLocationTemplates).toHaveBeenCalledWith({
      userId: "test-user-id",
      type: "matrix-host",
      search: undefined,
      public: undefined,
    });
  });

  it("should filter by search query", async () => {
    const templates = [createMockLocationTemplate({ name: "Corporate HQ" })];
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplates).mockResolvedValue(templates);

    const request = createMockRequest(
      "http://localhost:3000/api/location-templates?search=Corporate"
    );
    const response = await GET(request);
    expect(response.status).toBe(200);
    expect(locationsStorage.getLocationTemplates).toHaveBeenCalledWith({
      userId: "test-user-id",
      type: undefined,
      search: "Corporate",
      public: undefined,
    });
  });

  it("should filter by public only", async () => {
    const templates = [createMockLocationTemplate({ isPublic: true })];
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplates).mockResolvedValue(templates);

    const request = createMockRequest("http://localhost:3000/api/location-templates?public=true");
    const response = await GET(request);
    expect(response.status).toBe(200);
    expect(locationsStorage.getLocationTemplates).toHaveBeenCalledWith({
      userId: "test-user-id",
      type: undefined,
      search: undefined,
      public: true,
    });
  });

  it("should combine multiple filters", async () => {
    const templates = [createMockLocationTemplate({ type: "physical", isPublic: true })];
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplates).mockResolvedValue(templates);

    const request = createMockRequest(
      "http://localhost:3000/api/location-templates?type=physical&search=bar&public=true"
    );
    const response = await GET(request);
    expect(response.status).toBe(200);
    expect(locationsStorage.getLocationTemplates).toHaveBeenCalledWith({
      userId: "test-user-id",
      type: "physical",
      search: "bar",
      public: true,
    });
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.getLocationTemplates).mockRejectedValue(new Error("Database error"));

    const request = createMockRequest("http://localhost:3000/api/location-templates");
    const response = await GET(request);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.templates).toEqual([]);
    consoleErrorSpy.mockRestore();
  });
});

describe("POST /api/location-templates", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);
    const request = createMockRequest(
      "http://localhost:3000/api/location-templates",
      { name: "New Template", type: "physical" },
      "POST"
    );
    const response = await POST(request);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Authentication required");
  });

  it("should return 400 when name is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    const request = createMockRequest(
      "http://localhost:3000/api/location-templates",
      { type: "physical" },
      "POST"
    );
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Name");
  });

  it("should return 400 when type is missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    const request = createMockRequest(
      "http://localhost:3000/api/location-templates",
      { name: "New Template" },
      "POST"
    );
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Type");
  });

  it("should create template successfully", async () => {
    const mockTemplate = createMockLocationTemplate({ name: "New Template" });
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.createLocationTemplate).mockResolvedValue(mockTemplate);

    const request = createMockRequest(
      "http://localhost:3000/api/location-templates",
      { name: "New Template", type: "physical", description: "A new template" },
      "POST"
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.template).toBeDefined();
    expect(locationsStorage.createLocationTemplate).toHaveBeenCalledWith("test-user-id", {
      name: "New Template",
      type: "physical",
      description: "A new template",
    });
  });

  it("should create template with all fields", async () => {
    const mockTemplate = createMockLocationTemplate();
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.createLocationTemplate).mockResolvedValue(mockTemplate);

    const templateData = {
      name: "Full Template",
      type: "physical",
      description: "A complete template",
      tags: ["downtown", "corporate"],
      templateData: {
        securityRating: 7,
        visibility: "players",
      },
      isPublic: true,
    };
    const request = createMockRequest(
      "http://localhost:3000/api/location-templates",
      templateData,
      "POST"
    );
    const response = await POST(request);
    expect(response.status).toBe(200);
    expect(locationsStorage.createLocationTemplate).toHaveBeenCalledWith(
      "test-user-id",
      templateData
    );
  });

  it("should return 500 on error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(locationsStorage.createLocationTemplate).mockRejectedValue(
      new Error("Database error")
    );

    const request = createMockRequest(
      "http://localhost:3000/api/location-templates",
      { name: "New Template", type: "physical" },
      "POST"
    );
    const response = await POST(request);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.success).toBe(false);
    consoleErrorSpy.mockRestore();
  });
});
