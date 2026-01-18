/**
 * Tests for /api/editions endpoint
 *
 * Tests listing all available editions including success and error cases.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import * as editionsStorage from "@/lib/storage/editions";
import type { Edition, EditionCode } from "@/lib/types";

// Mock dependencies
vi.mock("@/lib/storage/editions");

describe("GET /api/editions", () => {
  const mockEditions: Edition[] = [
    {
      id: "sr5",
      name: "Shadowrun 5th Edition",
      shortCode: "sr5" as EditionCode,
      version: "1.0.0",
      releaseYear: 2013,
      bookIds: ["core-rulebook"],
      creationMethodIds: ["priority", "sum-to-ten"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "sr6",
      name: "Shadowrun 6th Edition",
      shortCode: "sr6" as EditionCode,
      version: "1.0.0",
      releaseYear: 2019,
      bookIds: ["core-rulebook"],
      creationMethodIds: ["priority"],
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return all editions successfully", async () => {
    vi.mocked(editionsStorage.getAllEditions).mockResolvedValue(mockEditions);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.editions).toBeDefined();
    expect(data.editions).toHaveLength(2);
    expect(data.editions[0].id).toBe("sr5");
    expect(data.editions[0].name).toBe("Shadowrun 5th Edition");
    expect(data.editions[1].id).toBe("sr6");
    expect(editionsStorage.getAllEditions).toHaveBeenCalledTimes(1);
  });

  it("should return empty array when no editions exist", async () => {
    vi.mocked(editionsStorage.getAllEditions).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.editions).toBeDefined();
    expect(data.editions).toHaveLength(0);
  });

  it("should return 500 on storage error", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.mocked(editionsStorage.getAllEditions).mockRejectedValue(new Error("Storage error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe("Failed to load editions");

    consoleErrorSpy.mockRestore();
  });
});
