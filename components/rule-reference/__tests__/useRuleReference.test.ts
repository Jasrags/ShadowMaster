/**
 * Tests for useRuleReference hook
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useRuleReference } from "../useRuleReference";
import type { RuleReferenceData } from "@/lib/types";

const mockData: RuleReferenceData = {
  version: "1.0.0",
  editionCode: "sr5",
  entries: [
    {
      id: "defense-modifiers",
      title: "Defense Modifiers",
      category: "combat",
      subcategory: "ranged",
      tags: ["defense", "dodge", "cover"],
      summary: "Dice pool modifiers for defense.",
      tables: [{ headers: ["Situation", "Mod"], rows: [["Prone", "-2"]] }],
      source: { book: "SR5 Core", page: 188 },
    },
    {
      id: "noise-table",
      title: "Noise Table",
      category: "matrix",
      tags: ["noise", "distance"],
      summary: "Noise levels based on distance.",
      tables: [{ headers: ["Distance", "Noise"], rows: [["100m", "0"]] }],
      source: { book: "SR5 Core", page: 230 },
    },
    {
      id: "healing-modifiers",
      title: "Healing Modifiers",
      category: "tests",
      tags: ["healing", "first aid"],
      summary: "Modifiers for healing tests.",
      tables: [{ headers: ["Situation", "Mod"], rows: [["Good conditions", "+0"]] }],
      source: { book: "SR5 Core", page: 205 },
    },
  ],
};

describe("useRuleReference", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: mockData }),
    });
  });

  it("should load entries from API", async () => {
    const { result } = renderHook(() => useRuleReference(null));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.entries).toHaveLength(3);
    expect(result.current.filteredEntries).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });

  it("should filter entries by category", async () => {
    const { result } = renderHook(() => useRuleReference(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSelectedCategory("combat");
    });

    expect(result.current.filteredEntries).toHaveLength(1);
    expect(result.current.filteredEntries[0].id).toBe("defense-modifiers");
  });

  it("should filter entries by search query", async () => {
    const { result } = renderHook(() => useRuleReference(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSearchQuery("noise");
    });

    expect(result.current.filteredEntries).toHaveLength(1);
    expect(result.current.filteredEntries[0].id).toBe("noise-table");
  });

  it("should search tags", async () => {
    const { result } = renderHook(() => useRuleReference(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSearchQuery("cover");
    });

    expect(result.current.filteredEntries).toHaveLength(1);
    expect(result.current.filteredEntries[0].id).toBe("defense-modifiers");
  });

  it("should apply default category", async () => {
    const { result } = renderHook(() => useRuleReference("matrix"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.selectedCategory).toBe("matrix");
    expect(result.current.filteredEntries).toHaveLength(1);
  });

  it("should extract unique categories", async () => {
    const { result } = renderHook(() => useRuleReference(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.categories).toEqual(["combat", "matrix", "tests"]);
  });

  it("should handle fetch error", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useRuleReference(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.entries).toHaveLength(0);
  });

  it("should clear selected entry when search changes", async () => {
    const { result } = renderHook(() => useRuleReference(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.setSelectedEntry(result.current.entries[0]);
    });

    expect(result.current.selectedEntry).not.toBeNull();

    act(() => {
      result.current.setSearchQuery("noise");
    });

    expect(result.current.selectedEntry).toBeNull();
  });
});
