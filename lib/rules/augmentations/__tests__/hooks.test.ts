/**
 * Tests for augmentation hooks
 *
 * Tests React hooks for augmentation management including:
 * - API hooks for fetching, installing, removing, upgrading augmentations
 * - Computed hooks for calculating bonuses and capacities
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { CyberwareItem, BiowareItem } from "@/lib/types";
import {
  useCharacterAugmentations,
  useInstallAugmentation,
  useRemoveAugmentation,
  useUpgradeAugmentation,
  useValidateAugmentation,
  useAugmentationBonuses,
  useInitiativeDiceBonus,
  useCyberwareWithCapacity,
  useRemainingCapacity,
} from "../hooks";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createMockCyberware(overrides: Partial<CyberwareItem> = {}): CyberwareItem {
  return {
    id: "cyber-1",
    catalogId: "wired-reflexes-1",
    name: "Wired Reflexes 1",
    category: "bodyware",
    grade: "standard",
    baseEssenceCost: 2.0,
    essenceCost: 2.0,
    cost: 39000,
    availability: 8,
    ...overrides,
  } as CyberwareItem;
}

function createMockBioware(overrides: Partial<BiowareItem> = {}): BiowareItem {
  return {
    id: "bio-1",
    catalogId: "muscle-toner-1",
    name: "Muscle Toner 1",
    grade: "standard",
    baseEssenceCost: 0.2,
    essenceCost: 0.2,
    cost: 16000,
    availability: 8,
    ...overrides,
  } as BiowareItem;
}

// =============================================================================
// API HOOKS TESTS
// =============================================================================

describe("useCharacterAugmentations", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should initialize with empty state when no characterId", () => {
    const { result } = renderHook(() => useCharacterAugmentations(null));

    expect(result.current.cyberware).toEqual([]);
    expect(result.current.bioware).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should fetch augmentations on mount when characterId provided", async () => {
    const mockCyberware = [createMockCyberware()];
    const mockBioware = [createMockBioware()];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        cyberware: mockCyberware,
        bioware: mockBioware,
        essenceSummary: { current: 4, lost: 2, fromCyberware: 2, fromBioware: 0 },
      }),
    });

    const { result } = renderHook(() => useCharacterAugmentations("char-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/characters/char-1/augmentations");
    expect(result.current.cyberware).toEqual(mockCyberware);
    expect(result.current.bioware).toEqual(mockBioware);
    expect(result.current.essenceSummary.current).toBe(4);
  });

  it("should set error on fetch failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: "Character not found",
      }),
    });

    const { result } = renderHook(() => useCharacterAugmentations("char-1"));

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
          cyberware: [],
          bioware: [],
          essenceSummary: { current: 6, lost: 0, fromCyberware: 0, fromBioware: 0 },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          cyberware: [createMockCyberware()],
          bioware: [],
          essenceSummary: { current: 4, lost: 2, fromCyberware: 2, fromBioware: 0 },
        }),
      });

    const { result } = renderHook(() => useCharacterAugmentations("char-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cyberware).toHaveLength(0);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.cyberware).toHaveLength(1);
  });
});

describe("useInstallAugmentation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error when no characterId", async () => {
    const { result } = renderHook(() => useInstallAugmentation(null));

    let installResult;
    await act(async () => {
      installResult = await result.current.install({
        type: "cyberware",
        catalogId: "wired-reflexes-1",
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
    const installedItem = createMockCyberware();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        installedItem,
        essenceChange: -2.0,
      }),
    });

    const { result } = renderHook(() => useInstallAugmentation("char-1"));

    let installResult;
    await act(async () => {
      installResult = await result.current.install({
        type: "cyberware",
        catalogId: "wired-reflexes-1",
        grade: "standard",
      });
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/characters/char-1/augmentations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "cyberware",
        catalogId: "wired-reflexes-1",
        grade: "standard",
      }),
    });
    expect(installResult!.success).toBe(true);
    expect(result.current.data).toEqual(installResult);
  });

  it("should handle install failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: "Insufficient essence",
      }),
    });

    const { result } = renderHook(() => useInstallAugmentation("char-1"));

    let installResult;
    await act(async () => {
      installResult = await result.current.install({
        type: "cyberware",
        catalogId: "wired-reflexes-1",
        grade: "standard",
      });
    });

    expect(installResult!.success).toBe(false);
    expect(result.current.error).toBe("Insufficient essence");
  });

  it("should provide reset function", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const { result } = renderHook(() => useInstallAugmentation("char-1"));

    await act(async () => {
      await result.current.install({
        type: "cyberware",
        catalogId: "test",
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

describe("useRemoveAugmentation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error when no characterId", async () => {
    const { result } = renderHook(() => useRemoveAugmentation(null));

    let removeResult;
    await act(async () => {
      removeResult = await result.current.remove("aug-1");
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
        essenceRestored: 2.0,
      }),
    });

    const { result } = renderHook(() => useRemoveAugmentation("char-1"));

    let removeResult;
    await act(async () => {
      removeResult = await result.current.remove("aug-1");
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/characters/char-1/augmentations/aug-1", {
      method: "DELETE",
    });
    expect(removeResult!.success).toBe(true);
    expect(removeResult!.essenceRestored).toBe(2.0);
  });

  it("should handle remove failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: "Cannot remove implanted cyberware",
      }),
    });

    const { result } = renderHook(() => useRemoveAugmentation("char-1"));

    let removeResult;
    await act(async () => {
      removeResult = await result.current.remove("aug-1");
    });

    expect(removeResult!.success).toBe(false);
    expect(result.current.error).toBe("Cannot remove implanted cyberware");
  });
});

describe("useUpgradeAugmentation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return error when no characterId", async () => {
    const { result } = renderHook(() => useUpgradeAugmentation(null));

    let upgradeResult;
    await act(async () => {
      upgradeResult = await result.current.upgrade("aug-1", "alpha");
    });

    expect(upgradeResult).toEqual({
      success: false,
      error: "No character ID provided",
    });
  });

  it("should call upgrade API", async () => {
    const upgradedItem = createMockCyberware({ grade: "alpha", essenceCost: 1.6 });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        augmentation: upgradedItem,
        essenceRefund: 0.4,
      }),
    });

    const { result } = renderHook(() => useUpgradeAugmentation("char-1"));

    let upgradeResult;
    await act(async () => {
      upgradeResult = await result.current.upgrade("aug-1", "alpha");
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/characters/char-1/augmentations/aug-1", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newGrade: "alpha" }),
    });
    expect(upgradeResult!.success).toBe(true);
    expect(upgradeResult!.essenceRefund).toBe(0.4);
  });
});

describe("useValidateAugmentation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return validation error when no characterId", async () => {
    const { result } = renderHook(() => useValidateAugmentation(null));

    let validateResult;
    await act(async () => {
      validateResult = await result.current.validate({
        type: "cyberware",
        catalogId: "test",
        grade: "standard",
      });
    });

    expect(validateResult!.valid).toBe(false);
    expect(validateResult!.errors).toContainEqual({
      code: "NO_CHARACTER",
      message: "No character ID provided",
    });
  });

  it("should call validate API and return projection", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        valid: true,
        errors: [],
        warnings: [{ code: "MAGIC_LOSS", message: "Will reduce Magic by 1" }],
        projection: {
          essenceCost: 2.0,
          currentEssence: 6,
          projectedEssence: 4,
          projectedMagicLoss: 1,
          catalogItem: {
            id: "wired-reflexes-1",
            name: "Wired Reflexes 1",
            category: "bodyware",
            essenceCost: 2.0,
            cost: 39000,
            availability: 8,
          },
        },
      }),
    });

    const { result } = renderHook(() => useValidateAugmentation("char-1"));

    let validateResult;
    await act(async () => {
      validateResult = await result.current.validate({
        type: "cyberware",
        catalogId: "wired-reflexes-1",
        grade: "standard",
      });
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/characters/char-1/augmentations/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "cyberware",
        catalogId: "wired-reflexes-1",
        grade: "standard",
      }),
    });
    expect(validateResult!.valid).toBe(true);
    expect(validateResult!.projection?.projectedEssence).toBe(4);
    expect(validateResult!.warnings).toHaveLength(1);
  });

  it("should handle validation errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        valid: false,
        errors: [{ code: "INSUFFICIENT_ESSENCE", message: "Not enough essence" }],
        warnings: [],
      }),
    });

    const { result } = renderHook(() => useValidateAugmentation("char-1"));

    let validateResult;
    await act(async () => {
      validateResult = await result.current.validate({
        type: "cyberware",
        catalogId: "test",
        grade: "standard",
      });
    });

    expect(validateResult!.valid).toBe(false);
    expect(validateResult!.errors).toContainEqual({
      code: "INSUFFICIENT_ESSENCE",
      message: "Not enough essence",
    });
  });
});

// =============================================================================
// COMPUTED HOOKS TESTS
// =============================================================================

describe("useAugmentationBonuses", () => {
  it("should return empty object when no augmentations", () => {
    const { result } = renderHook(() => useAugmentationBonuses([], []));
    expect(result.current).toEqual({});
  });

  it("should aggregate bonuses from cyberware", () => {
    const cyberware: CyberwareItem[] = [
      createMockCyberware({
        attributeBonuses: { agility: 1, reaction: 1 },
      }),
      createMockCyberware({
        id: "cyber-2",
        attributeBonuses: { agility: 1 },
      }),
    ];

    const { result } = renderHook(() => useAugmentationBonuses(cyberware, []));

    expect(result.current.agility).toBe(2);
    expect(result.current.reaction).toBe(1);
  });

  it("should aggregate bonuses from bioware", () => {
    const bioware: BiowareItem[] = [
      createMockBioware({
        attributeBonuses: { strength: 2 },
      }),
    ];

    const { result } = renderHook(() => useAugmentationBonuses([], bioware));

    expect(result.current.strength).toBe(2);
  });

  it("should combine cyberware and bioware bonuses", () => {
    const cyberware: CyberwareItem[] = [
      createMockCyberware({
        attributeBonuses: { agility: 1 },
      }),
    ];
    const bioware: BiowareItem[] = [
      createMockBioware({
        attributeBonuses: { agility: 1, strength: 2 },
      }),
    ];

    const { result } = renderHook(() => useAugmentationBonuses(cyberware, bioware));

    expect(result.current.agility).toBe(2);
    expect(result.current.strength).toBe(2);
  });

  it("should handle items without attributeBonuses", () => {
    const cyberware: CyberwareItem[] = [createMockCyberware()];
    const bioware: BiowareItem[] = [createMockBioware()];

    const { result } = renderHook(() => useAugmentationBonuses(cyberware, bioware));

    expect(result.current).toEqual({});
  });
});

describe("useInitiativeDiceBonus", () => {
  it("should return 0 when no cyberware", () => {
    const { result } = renderHook(() => useInitiativeDiceBonus([]));
    expect(result.current).toBe(0);
  });

  it("should sum initiative dice bonuses", () => {
    const cyberware: CyberwareItem[] = [
      createMockCyberware({ initiativeDiceBonus: 1 }),
      createMockCyberware({ id: "cyber-2", initiativeDiceBonus: 2 }),
    ];

    const { result } = renderHook(() => useInitiativeDiceBonus(cyberware));

    expect(result.current).toBe(3);
  });

  it("should handle items without initiativeDiceBonus", () => {
    const cyberware: CyberwareItem[] = [
      createMockCyberware({ initiativeDiceBonus: 1 }),
      createMockCyberware({ id: "cyber-2" }), // No bonus
    ];

    const { result } = renderHook(() => useInitiativeDiceBonus(cyberware));

    expect(result.current).toBe(1);
  });
});

describe("useCyberwareWithCapacity", () => {
  it("should return empty array when no cyberware", () => {
    const { result } = renderHook(() => useCyberwareWithCapacity([]));
    expect(result.current).toEqual([]);
  });

  it("should filter cyberware with capacity > 0", () => {
    const cyberware: CyberwareItem[] = [
      createMockCyberware({ id: "cyberlimb", capacity: 15 }),
      createMockCyberware({ id: "datajack" }), // No capacity
      createMockCyberware({ id: "empty-limb", capacity: 0 }),
      createMockCyberware({ id: "cybereyes", capacity: 8 }),
    ];

    const { result } = renderHook(() => useCyberwareWithCapacity(cyberware));

    expect(result.current).toHaveLength(2);
    expect(result.current.map((c) => c.id)).toEqual(["cyberlimb", "cybereyes"]);
  });
});

describe("useRemainingCapacity", () => {
  it("should return full capacity when nothing used", () => {
    const item = createMockCyberware({ capacity: 15, capacityUsed: 0 });
    const { result } = renderHook(() => useRemainingCapacity(item));
    expect(result.current).toBe(15);
  });

  it("should calculate remaining capacity", () => {
    const item = createMockCyberware({ capacity: 15, capacityUsed: 7 });
    const { result } = renderHook(() => useRemainingCapacity(item));
    expect(result.current).toBe(8);
  });

  it("should return 0 when fully used", () => {
    const item = createMockCyberware({ capacity: 15, capacityUsed: 15 });
    const { result } = renderHook(() => useRemainingCapacity(item));
    expect(result.current).toBe(0);
  });

  it("should return 0 when over-used (clamped)", () => {
    const item = createMockCyberware({ capacity: 15, capacityUsed: 20 });
    const { result } = renderHook(() => useRemainingCapacity(item));
    expect(result.current).toBe(0);
  });

  it("should handle undefined capacity", () => {
    const item = createMockCyberware();
    delete (item as Partial<CyberwareItem>).capacity;
    const { result } = renderHook(() => useRemainingCapacity(item));
    expect(result.current).toBe(0);
  });

  it("should handle undefined capacityUsed", () => {
    const item = createMockCyberware({ capacity: 15 });
    delete (item as Partial<CyberwareItem>).capacityUsed;
    const { result } = renderHook(() => useRemainingCapacity(item));
    expect(result.current).toBe(15);
  });
});
