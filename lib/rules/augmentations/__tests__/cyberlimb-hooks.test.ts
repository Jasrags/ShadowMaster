/**
 * Tests for cyberlimb hooks
 *
 * Tests React hooks for cyberlimb management including:
 * - Fetching installed cyberlimbs
 * - Installing, removing cyberlimbs
 * - Toggling wireless mode
 * - Adding/removing enhancements and accessories
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import {
  useCharacterCyberlimbs,
  useInstallCyberlimb,
  useRemoveCyberlimb,
  useToggleCyberlimbWireless,
  useCyberlimbDetails,
  useAddCyberlimbEnhancement,
  useRemoveCyberlimbEnhancement,
  useAddCyberlimbAccessory,
  useRemoveCyberlimbAccessory,
  type CyberlimbSummary,
  type CyberlimbDetail,
} from "../cyberlimb-hooks";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockCyberlimbSummary(overrides: Partial<CyberlimbSummary> = {}): CyberlimbSummary {
  return {
    id: "limb-1",
    catalogId: "synthetic-full-arm",
    name: "Synthetic Full Arm",
    location: "left-arm",
    limbType: "full",
    appearance: "synthetic",
    grade: "standard",
    essenceCost: 1.0,
    strength: 3,
    agility: 3,
    capacity: { total: 15, used: 5, remaining: 10 },
    enhancementCount: 1,
    accessoryCount: 0,
    wirelessEnabled: true,
    condition: "functional",
    ...overrides,
  };
}

function createMockCyberlimbDetail(overrides: Partial<CyberlimbDetail> = {}): CyberlimbDetail {
  return {
    id: "limb-1",
    catalogId: "synthetic-full-arm",
    name: "Synthetic Full Arm",
    location: "left-arm",
    limbType: "full",
    appearance: "synthetic",
    grade: "standard",
    essenceCost: 1.0,
    cost: 15000,
    availability: 4,
    baseStrength: 3,
    baseAgility: 3,
    customStrength: 0,
    customAgility: 0,
    effectiveStrength: 3,
    effectiveAgility: 3,
    capacity: {
      total: 15,
      usedByEnhancements: 3,
      usedByAccessories: 2,
      usedByWeapons: 0,
      remaining: 10,
    },
    enhancements: [],
    accessories: [],
    weapons: [],
    wirelessEnabled: true,
    condition: "functional",
    installedAt: new Date().toISOString(),
    ...overrides,
  };
}

// =============================================================================
// useCharacterCyberlimbs TESTS
// =============================================================================

describe("useCharacterCyberlimbs", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize with empty state when no characterId", () => {
    const { result } = renderHook(() => useCharacterCyberlimbs(null));

    expect(result.current.cyberlimbs).toEqual([]);
    expect(result.current.totalCMBonus).toBe(0);
    expect(result.current.totalEssenceLost).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should fetch cyberlimbs on mount when characterId provided", async () => {
    const mockCyberlimbs = [createMockCyberlimbSummary()];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        cyberlimbs: mockCyberlimbs,
        totalCMBonus: 4,
        totalEssenceLost: 1.0,
      }),
    });

    const { result } = renderHook(() => useCharacterCyberlimbs("char-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/characters/char-1/augmentations/cyberlimbs");
    expect(result.current.cyberlimbs).toEqual(mockCyberlimbs);
    expect(result.current.totalCMBonus).toBe(4);
    expect(result.current.totalEssenceLost).toBe(1.0);
  });

  it("should set error on fetch failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: "Character not found",
      }),
    });

    const { result } = renderHook(() => useCharacterCyberlimbs("char-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Character not found");
  });

  it("should provide refetch function", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          cyberlimbs: [],
          totalCMBonus: 0,
          totalEssenceLost: 0,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          cyberlimbs: [createMockCyberlimbSummary()],
          totalCMBonus: 4,
          totalEssenceLost: 1.0,
        }),
      });

    const { result } = renderHook(() => useCharacterCyberlimbs("char-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cyberlimbs).toHaveLength(0);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.cyberlimbs).toHaveLength(1);
  });
});

// =============================================================================
// useInstallCyberlimb TESTS
// =============================================================================

describe("useInstallCyberlimb", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error when no characterId", async () => {
    const { result } = renderHook(() => useInstallCyberlimb(null));

    let installResult;
    await act(async () => {
      installResult = await result.current.install({
        catalogId: "synthetic-full-arm",
        location: "left-arm",
        grade: "standard",
      });
    });

    expect(installResult).toEqual({
      success: false,
      error: "No character ID provided",
    });
    expect(result.current.error).toBe("No character ID provided");
  });

  it("should call install API and return result", async () => {
    const installedLimb = createMockCyberlimbSummary();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        installedLimb,
        essenceChange: -1.0,
      }),
    });

    const { result } = renderHook(() => useInstallCyberlimb("char-1"));

    let installResult;
    await act(async () => {
      installResult = await result.current.install({
        catalogId: "synthetic-full-arm",
        location: "left-arm",
        grade: "standard",
      });
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/characters/char-1/augmentations/cyberlimbs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        catalogId: "synthetic-full-arm",
        location: "left-arm",
        grade: "standard",
      }),
    });
    expect(installResult!.success).toBe(true);
    expect(result.current.data).toEqual(installResult);
  });

  it("should handle install with customization", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useInstallCyberlimb("char-1"));

    await act(async () => {
      await result.current.install({
        catalogId: "synthetic-full-arm",
        location: "left-arm",
        grade: "alpha",
        customization: {
          strengthCustomization: 2,
          agilityCustomization: 1,
        },
      });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/characters/char-1/augmentations/cyberlimbs",
      expect.objectContaining({
        body: JSON.stringify({
          catalogId: "synthetic-full-arm",
          location: "left-arm",
          grade: "alpha",
          customization: {
            strengthCustomization: 2,
            agilityCustomization: 1,
          },
        }),
      })
    );
  });

  it("should provide reset function", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useInstallCyberlimb("char-1"));

    await act(async () => {
      await result.current.install({
        catalogId: "test",
        location: "left-arm",
        grade: "standard",
      });
    });

    expect(result.current.data).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

// =============================================================================
// useRemoveCyberlimb TESTS
// =============================================================================

describe("useRemoveCyberlimb", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error when no characterId", async () => {
    const { result } = renderHook(() => useRemoveCyberlimb(null));

    let removeResult;
    await act(async () => {
      removeResult = await result.current.remove("limb-1");
    });

    expect(removeResult).toEqual({
      success: false,
      error: "No character ID provided",
    });
  });

  it("should call remove API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        removedLimb: "limb-1",
        essenceRestored: 1.0,
      }),
    });

    const { result } = renderHook(() => useRemoveCyberlimb("char-1"));

    let removeResult;
    await act(async () => {
      removeResult = await result.current.remove("limb-1");
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/characters/char-1/augmentations/cyberlimbs/limb-1",
      { method: "DELETE" }
    );
    expect(removeResult!.success).toBe(true);
    expect(removeResult!.essenceRestored).toBe(1.0);
  });
});

// =============================================================================
// useToggleCyberlimbWireless TESTS
// =============================================================================

describe("useToggleCyberlimbWireless", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error when no characterId", async () => {
    const { result } = renderHook(() => useToggleCyberlimbWireless(null));

    let toggleResult;
    await act(async () => {
      toggleResult = await result.current.toggle("limb-1", false);
    });

    expect(toggleResult).toEqual({
      success: false,
      error: "No character ID provided",
    });
  });

  it("should call toggle API with enabled=true", async () => {
    const updatedLimb = createMockCyberlimbDetail({ wirelessEnabled: true });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        limb: updatedLimb,
      }),
    });

    const { result } = renderHook(() => useToggleCyberlimbWireless("char-1"));

    let toggleResult;
    await act(async () => {
      toggleResult = await result.current.toggle("limb-1", true);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/characters/char-1/augmentations/cyberlimbs/limb-1",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wirelessEnabled: true }),
      }
    );
    expect(toggleResult!.success).toBe(true);
  });

  it("should call toggle API with enabled=false", async () => {
    const updatedLimb = createMockCyberlimbDetail({ wirelessEnabled: false });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        limb: updatedLimb,
      }),
    });

    const { result } = renderHook(() => useToggleCyberlimbWireless("char-1"));

    await act(async () => {
      await result.current.toggle("limb-1", false);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/characters/char-1/augmentations/cyberlimbs/limb-1",
      expect.objectContaining({
        body: JSON.stringify({ wirelessEnabled: false }),
      })
    );
  });
});

// =============================================================================
// useCyberlimbDetails TESTS
// =============================================================================

describe("useCyberlimbDetails", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should not fetch when no characterId or limbId", () => {
    const { result } = renderHook(() => useCyberlimbDetails(null, null));

    expect(result.current.limb).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should fetch limb details on mount", async () => {
    const mockLimb = createMockCyberlimbDetail();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        limb: mockLimb,
      }),
    });

    const { result } = renderHook(() => useCyberlimbDetails("char-1", "limb-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/characters/char-1/augmentations/cyberlimbs/limb-1"
    );
    expect(result.current.limb).toEqual(mockLimb);
  });

  it("should set error on fetch failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: "Cyberlimb not found",
      }),
    });

    const { result } = renderHook(() => useCyberlimbDetails("char-1", "limb-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Cyberlimb not found");
  });

  it("should provide refetch function", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          limb: createMockCyberlimbDetail({ effectiveStrength: 3 }),
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          limb: createMockCyberlimbDetail({ effectiveStrength: 5 }),
        }),
      });

    const { result } = renderHook(() => useCyberlimbDetails("char-1", "limb-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.limb?.effectiveStrength).toBe(3);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.limb?.effectiveStrength).toBe(5);
  });
});

// =============================================================================
// useAddCyberlimbEnhancement TESTS
// =============================================================================

describe("useAddCyberlimbEnhancement", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error when no characterId", async () => {
    const { result } = renderHook(() => useAddCyberlimbEnhancement(null));

    let addResult;
    await act(async () => {
      addResult = await result.current.add("limb-1", {
        catalogId: "enhanced-agility",
        rating: 2,
      });
    });

    expect(addResult).toEqual({
      success: false,
      error: "No character ID provided",
    });
  });

  it("should call add enhancement API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        enhancement: {
          id: "enh-1",
          catalogId: "enhanced-agility",
          name: "Enhanced Agility",
          enhancementType: "agility",
          rating: 2,
          capacityUsed: 4,
          cost: 6500,
        },
        limbCapacityRemaining: 6,
      }),
    });

    const { result } = renderHook(() => useAddCyberlimbEnhancement("char-1"));

    let addResult;
    await act(async () => {
      addResult = await result.current.add("limb-1", {
        catalogId: "enhanced-agility",
        rating: 2,
      });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/characters/char-1/augmentations/cyberlimbs/limb-1/enhancements",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          catalogId: "enhanced-agility",
          rating: 2,
        }),
      }
    );
    expect(addResult!.success).toBe(true);
    expect(addResult!.enhancement?.name).toBe("Enhanced Agility");
  });

  it("should handle add enhancement failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: "Insufficient capacity",
      }),
    });

    const { result } = renderHook(() => useAddCyberlimbEnhancement("char-1"));

    let addResult;
    await act(async () => {
      addResult = await result.current.add("limb-1", {
        catalogId: "enhanced-agility",
        rating: 5,
      });
    });

    expect(addResult!.success).toBe(false);
    expect(result.current.error).toBe("Insufficient capacity");
  });
});

// =============================================================================
// useRemoveCyberlimbEnhancement TESTS
// =============================================================================

describe("useRemoveCyberlimbEnhancement", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error when no characterId", async () => {
    const { result } = renderHook(() => useRemoveCyberlimbEnhancement(null));

    let removeResult;
    await act(async () => {
      removeResult = await result.current.remove("limb-1", "enh-1");
    });

    expect(removeResult).toEqual({
      success: false,
      error: "No character ID provided",
    });
  });

  it("should call remove enhancement API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        removedEnhancement: "enh-1",
        capacityRestored: 4,
        limbCapacityRemaining: 14,
      }),
    });

    const { result } = renderHook(() => useRemoveCyberlimbEnhancement("char-1"));

    let removeResult;
    await act(async () => {
      removeResult = await result.current.remove("limb-1", "enh-1");
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/characters/char-1/augmentations/cyberlimbs/limb-1/enhancements/enh-1",
      { method: "DELETE" }
    );
    expect(removeResult!.success).toBe(true);
    expect(removeResult!.capacityRestored).toBe(4);
  });
});

// =============================================================================
// useAddCyberlimbAccessory TESTS
// =============================================================================

describe("useAddCyberlimbAccessory", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error when no characterId", async () => {
    const { result } = renderHook(() => useAddCyberlimbAccessory(null));

    let addResult;
    await act(async () => {
      addResult = await result.current.add("limb-1", {
        catalogId: "armor-limb",
      });
    });

    expect(addResult).toEqual({
      success: false,
      error: "No character ID provided",
    });
  });

  it("should call add accessory API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        accessory: {
          id: "acc-1",
          catalogId: "armor-limb",
          name: "Armor (Limb)",
          rating: 2,
          capacityUsed: 2,
          cost: 2000,
        },
        limbCapacityRemaining: 8,
      }),
    });

    const { result } = renderHook(() => useAddCyberlimbAccessory("char-1"));

    let addResult;
    await act(async () => {
      addResult = await result.current.add("limb-1", {
        catalogId: "armor-limb",
        rating: 2,
      });
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/characters/char-1/augmentations/cyberlimbs/limb-1/accessories",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          catalogId: "armor-limb",
          rating: 2,
        }),
      }
    );
    expect(addResult!.success).toBe(true);
    expect(addResult!.accessory?.name).toBe("Armor (Limb)");
  });
});

// =============================================================================
// useRemoveCyberlimbAccessory TESTS
// =============================================================================

describe("useRemoveCyberlimbAccessory", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error when no characterId", async () => {
    const { result } = renderHook(() => useRemoveCyberlimbAccessory(null));

    let removeResult;
    await act(async () => {
      removeResult = await result.current.remove("limb-1", "acc-1");
    });

    expect(removeResult).toEqual({
      success: false,
      error: "No character ID provided",
    });
  });

  it("should call remove accessory API", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        removedAccessory: "acc-1",
        capacityRestored: 2,
        limbCapacityRemaining: 12,
      }),
    });

    const { result } = renderHook(() => useRemoveCyberlimbAccessory("char-1"));

    let removeResult;
    await act(async () => {
      removeResult = await result.current.remove("limb-1", "acc-1");
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/characters/char-1/augmentations/cyberlimbs/limb-1/accessories/acc-1",
      { method: "DELETE" }
    );
    expect(removeResult!.success).toBe(true);
    expect(removeResult!.capacityRestored).toBe(2);
  });

  it("should provide reset function", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useRemoveCyberlimbAccessory("char-1"));

    await act(async () => {
      await result.current.remove("limb-1", "acc-1");
    });

    expect(result.current.data).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
