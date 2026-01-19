/**
 * Tests for /api/account/import endpoint
 *
 * Tests user data import functionality including authentication,
 * validation, character import, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import * as sessionModule from "@/lib/auth/session";
import * as usersModule from "@/lib/storage/users";
import * as charactersModule from "@/lib/storage/characters";

// Mock dependencies
vi.mock("@/lib/auth/session");
vi.mock("@/lib/storage/users");
vi.mock("@/lib/storage/characters");

// Helper to create a NextRequest with JSON body
function createMockRequest(url: string, body?: unknown, method = "POST"): NextRequest {
  const headers = new Headers();
  if (body) {
    headers.set("Content-Type", "application/json");
  }

  const request = new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  // Mock json() method if body is provided
  if (body) {
    (request as { json: () => Promise<unknown> }).json = async () => body;
  }

  return request;
}

describe("POST /api/account/import", () => {
  const validImportData = {
    version: "1.0",
    exportedAt: "2024-01-01T00:00:00.000Z",
    user: {
      id: "original-user-id",
      email: "original@example.com",
      username: "originaluser",
      preferences: {
        theme: "dark",
        navigationCollapsed: true,
      },
    },
    characters: [
      {
        id: "char-1",
        name: "Imported Runner",
        editionCode: "sr5",
        state: "active",
      },
      {
        id: "char-2",
        name: "Second Import",
        editionCode: "sr5",
        state: "draft",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 when not authenticated", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue(null);

    const request = createMockRequest("http://localhost:3000/api/account/import", validImportData);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Unauthorized");
    expect(usersModule.updateUser).not.toHaveBeenCalled();
  });

  it("should return 400 when data.user missing", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");

    const request = createMockRequest("http://localhost:3000/api/account/import", {
      characters: [],
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid import format");
  });

  it("should return 400 when data.characters not an array", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");

    const request = createMockRequest("http://localhost:3000/api/account/import", {
      user: { id: "test" },
      characters: "not-an-array",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Invalid import format");
  });

  it("should update user preferences when present", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.updateUser).mockResolvedValue(undefined as unknown as never);
    vi.mocked(charactersModule.importCharacter).mockResolvedValue({ id: "new-char-id" } as never);

    const request = createMockRequest("http://localhost:3000/api/account/import", validImportData);

    await POST(request);

    expect(usersModule.updateUser).toHaveBeenCalledWith("test-user-id", {
      preferences: {
        theme: "dark",
        navigationCollapsed: true,
      },
    });
  });

  it("should not update preferences when not present", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(charactersModule.importCharacter).mockResolvedValue({ id: "new-char-id" } as never);

    const dataWithoutPrefs = {
      user: { id: "test" },
      characters: [{ id: "char-1", name: "Test" }],
    };

    const request = createMockRequest("http://localhost:3000/api/account/import", dataWithoutPrefs);

    await POST(request);

    expect(usersModule.updateUser).not.toHaveBeenCalled();
  });

  it("should import characters successfully", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.updateUser).mockResolvedValue(undefined as unknown as never);
    vi.mocked(charactersModule.importCharacter)
      .mockResolvedValueOnce({ id: "imported-1" } as never)
      .mockResolvedValueOnce({ id: "imported-2" } as never);

    const request = createMockRequest("http://localhost:3000/api/account/import", validImportData);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.count).toBe(2);
    expect(data.message).toBe("Successfully imported 2 characters.");

    expect(charactersModule.importCharacter).toHaveBeenCalledTimes(2);
    expect(charactersModule.importCharacter).toHaveBeenCalledWith(
      "test-user-id",
      validImportData.characters[0]
    );
    expect(charactersModule.importCharacter).toHaveBeenCalledWith(
      "test-user-id",
      validImportData.characters[1]
    );
  });

  it("should return count of imported characters", async () => {
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.updateUser).mockResolvedValue(undefined as unknown as never);
    vi.mocked(charactersModule.importCharacter).mockResolvedValue({ id: "imported" } as never);

    const dataWithThreeChars = {
      ...validImportData,
      characters: [
        { id: "1", name: "One" },
        { id: "2", name: "Two" },
        { id: "3", name: "Three" },
      ],
    };

    const request = createMockRequest(
      "http://localhost:3000/api/account/import",
      dataWithThreeChars
    );

    const response = await POST(request);
    const data = await response.json();

    expect(data.count).toBe(3);
    expect(data.message).toBe("Successfully imported 3 characters.");
  });

  it("should continue importing on individual character failure", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockResolvedValue("test-user-id");
    vi.mocked(usersModule.updateUser).mockResolvedValue(undefined as unknown as never);
    vi.mocked(charactersModule.importCharacter)
      .mockResolvedValueOnce({ id: "imported-1" } as never)
      .mockRejectedValueOnce(new Error("Character import failed"))
      .mockResolvedValueOnce({ id: "imported-3" } as never);

    const dataWithThreeChars = {
      ...validImportData,
      characters: [
        { id: "1", name: "One" },
        { id: "2", name: "Two - will fail" },
        { id: "3", name: "Three" },
      ],
    };

    const request = createMockRequest(
      "http://localhost:3000/api/account/import",
      dataWithThreeChars
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.count).toBe(2); // Only 2 succeeded
    expect(charactersModule.importCharacter).toHaveBeenCalledTimes(3);

    consoleErrorSpy.mockRestore();
  });

  it("should return 500 on server error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(sessionModule.getSession).mockRejectedValue(new Error("Session error"));

    const request = createMockRequest("http://localhost:3000/api/account/import", validImportData);

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Internal server error");

    consoleErrorSpy.mockRestore();
  });
});
