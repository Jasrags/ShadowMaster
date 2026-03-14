/**
 * Tests for WeaponsDisplay ammo error surfacing (#675)
 *
 * Covers: reload, unload, and swap-magazine error messages shown to user
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import type { Character, Weapon } from "@/lib/types";
import {
  setupDisplayCardMock,
  LUCIDE_MOCK,
  createSheetCharacter,
} from "@/components/character/sheet/__tests__/test-helpers";

// Setup mocks BEFORE imports
setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/rules", () => ({
  useGear: () => null,
}));

vi.mock("@/lib/rules/wireless", () => ({
  isGlobalWirelessEnabled: () => false,
}));

vi.mock("@/lib/combat", () => ({
  useCombatReadiness: () => ({
    canChangeReadiness: () => ({ allowed: true }),
    performReadinessChange: vi.fn((_from, _to, fn) => fn()),
  }),
}));

vi.mock("@/lib/rules/inventory", () => ({
  getTransitionActionCost: () => "free",
}));

vi.mock("@/components/character/sheet/WeaponAmmoDisplay", () => ({
  WeaponAmmoDisplay: ({
    onReload,
    onUnload,
    onSwapMagazine,
  }: {
    onReload: (id: string) => void;
    onUnload: () => void;
    onSwapMagazine: (id: string) => void;
  }) => (
    <div data-testid="weapon-ammo-display">
      <button data-testid="reload-btn" onClick={() => onReload("ammo-1")}>
        Reload
      </button>
      <button data-testid="unload-btn" onClick={() => onUnload()}>
        Unload
      </button>
      <button data-testid="swap-btn" onClick={() => onSwapMagazine("mag-1")}>
        Swap
      </button>
    </div>
  ),
}));

vi.mock("@/components/character/sheet/MoveToContainerControl", () => ({
  MoveToContainerControl: () => null,
}));

import { WeaponsDisplay } from "@/components/character/sheet/WeaponsDisplay";

const mockFetch = vi.fn();
global.fetch = mockFetch;

function makeWeaponWithAmmo(): Weapon {
  return {
    id: "pred-v",
    name: "Ares Predator V",
    category: "Pistols",
    subcategory: "Heavy Pistols",
    damage: "8P",
    ap: -1,
    mode: ["SA"],
    accuracy: 5,
    cost: 725,
    quantity: 1,
    equipped: true,
    ammoState: {
      currentRounds: 10,
      magazineCapacity: 15,
      loadedAmmoTypeId: "regular-ammo",
    },
  } as Weapon;
}

function makeCharacterWithAmmo(overrides?: Partial<Character>): Character {
  return createSheetCharacter({
    id: "char-1",
    weapons: [makeWeaponWithAmmo()],
    ammunition: [],
    ...overrides,
  });
}

async function expandWeaponRow() {
  const row = screen.getByTestId("weapon-row");
  await act(async () => {
    fireEvent.click(row);
  });
}

describe("WeaponsDisplay ammo error surfacing (#675)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("shows error message when reload API returns non-success response", async () => {
    const character = makeCharacterWithAmmo();
    const onUpdate = vi.fn();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: "No compatible ammo found" }),
    });

    render(<WeaponsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    await expandWeaponRow();
    const reloadBtn = screen.getByTestId("reload-btn");
    await act(async () => {
      fireEvent.click(reloadBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("ammo-error")).toBeInTheDocument();
    });
    expect(screen.getByTestId("ammo-error")).toHaveTextContent("No compatible ammo found");
  });

  test("shows error message when reload API throws network error", async () => {
    const character = makeCharacterWithAmmo();
    const onUpdate = vi.fn();

    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    render(<WeaponsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    await expandWeaponRow();
    const reloadBtn = screen.getByTestId("reload-btn");
    await act(async () => {
      fireEvent.click(reloadBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("ammo-error")).toBeInTheDocument();
    });
    expect(screen.getByTestId("ammo-error")).toHaveTextContent("Failed to reload weapon");
  });

  test("shows error message when unload API returns non-success response", async () => {
    const character = makeCharacterWithAmmo();
    const onUpdate = vi.fn();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: "Weapon is not loaded" }),
    });

    render(<WeaponsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    await expandWeaponRow();
    const unloadBtn = screen.getByTestId("unload-btn");
    await act(async () => {
      fireEvent.click(unloadBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("ammo-error")).toBeInTheDocument();
    });
    expect(screen.getByTestId("ammo-error")).toHaveTextContent("Weapon is not loaded");
  });

  test("shows error message when unload API throws network error", async () => {
    const character = makeCharacterWithAmmo();
    const onUpdate = vi.fn();

    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    render(<WeaponsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    await expandWeaponRow();
    const unloadBtn = screen.getByTestId("unload-btn");
    await act(async () => {
      fireEvent.click(unloadBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("ammo-error")).toBeInTheDocument();
    });
    expect(screen.getByTestId("ammo-error")).toHaveTextContent("Failed to unload weapon");
  });

  test("shows error message when swap magazine API returns non-success response", async () => {
    const character = makeCharacterWithAmmo();
    const onUpdate = vi.fn();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: "Magazine not found" }),
    });

    render(<WeaponsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    await expandWeaponRow();
    const swapBtn = screen.getByTestId("swap-btn");
    await act(async () => {
      fireEvent.click(swapBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("ammo-error")).toBeInTheDocument();
    });
    expect(screen.getByTestId("ammo-error")).toHaveTextContent("Magazine not found");
  });

  test("shows error message when swap magazine API throws network error", async () => {
    const character = makeCharacterWithAmmo();
    const onUpdate = vi.fn();

    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    render(<WeaponsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    await expandWeaponRow();
    const swapBtn = screen.getByTestId("swap-btn");
    await act(async () => {
      fireEvent.click(swapBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("ammo-error")).toBeInTheDocument();
    });
    expect(screen.getByTestId("ammo-error")).toHaveTextContent("Failed to swap magazine");
  });

  test("clears error on successful subsequent operation", async () => {
    const character = makeCharacterWithAmmo();
    const onUpdate = vi.fn();

    // First call fails
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    render(<WeaponsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    await expandWeaponRow();

    // Trigger error
    const reloadBtn = screen.getByTestId("reload-btn");
    await act(async () => {
      fireEvent.click(reloadBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId("ammo-error")).toBeInTheDocument();
    });

    // Second call succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        weapon: {
          ammoState: { currentRounds: 15, magazineCapacity: 15, loadedAmmoTypeId: "regular-ammo" },
        },
        ammunition: [],
      }),
    });

    await act(async () => {
      fireEvent.click(reloadBtn);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("ammo-error")).not.toBeInTheDocument();
    });
  });
});
