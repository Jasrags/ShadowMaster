/**
 * LoadoutDiffModal Tests
 *
 * Tests diff display: stash/bring/move sections, confirm/cancel.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";
import type { Character } from "@/lib/types";
import type { Loadout, LoadoutDiff } from "@/lib/types/gear-state";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("lucide-react", () => LUCIDE_MOCK);

const mockGetLoadoutDiff = vi.fn();
const mockApplyLoadout = vi.fn();
const mockFindGearItemById = vi.fn();

vi.mock("@/lib/rules/inventory", () => ({
  getLoadoutDiff: (...args: unknown[]) => mockGetLoadoutDiff(...args),
  applyLoadout: (...args: unknown[]) => mockApplyLoadout(...args),
  findGearItemById: (...args: unknown[]) => mockFindGearItemById(...args),
}));

vi.mock("@/components/ui/BaseModal", () => ({
  BaseModal: ({
    title,
    children,
    isOpen,
    onClose,
  }: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="base-modal">
        <h2>{title}</h2>
        {children}
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

import { LoadoutDiffModal } from "../LoadoutDiffModal";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeLoadout(overrides?: Partial<Loadout>): Loadout {
  return {
    id: "loadout-1",
    name: "Stealth Run",
    gearAssignments: {},
    defaultReadiness: "carried",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    ...overrides,
  };
}

function makeDiff(overrides?: Partial<LoadoutDiff>): LoadoutDiff {
  return {
    itemsToStash: [],
    itemsToBring: [],
    itemsToMove: [],
    containerChanges: [],
    encumbranceChange: 0,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LoadoutDiffModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFindGearItemById.mockImplementation((_char: Character, id: string) => ({
      name: `Item ${id}`,
    }));
  });

  it("shows no-changes message when diff is empty", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
    } as Partial<Character>);
    mockGetLoadoutDiff.mockReturnValue(makeDiff());

    render(
      <LoadoutDiffModal
        isOpen
        onClose={vi.fn()}
        character={char}
        loadoutId="loadout-1"
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByTestId("no-changes")).toBeInTheDocument();
  });

  it("shows items to stash", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
    } as Partial<Character>);
    mockGetLoadoutDiff.mockReturnValue(makeDiff({ itemsToStash: ["weapon-1", "gear-2"] }));

    render(
      <LoadoutDiffModal
        isOpen
        onClose={vi.fn()}
        character={char}
        loadoutId="loadout-1"
        onConfirm={vi.fn()}
      />
    );

    const section = screen.getByTestId("items-to-stash");
    expect(section).toHaveTextContent("Item weapon-1");
    expect(section).toHaveTextContent("Item gear-2");
  });

  it("shows items to bring", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
    } as Partial<Character>);
    mockGetLoadoutDiff.mockReturnValue(makeDiff({ itemsToBring: ["item-3"] }));

    render(
      <LoadoutDiffModal
        isOpen
        onClose={vi.fn()}
        character={char}
        loadoutId="loadout-1"
        onConfirm={vi.fn()}
      />
    );

    expect(screen.getByTestId("items-to-bring")).toHaveTextContent("Item item-3");
  });

  it("shows items to move with from→to using readiness labels", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
    } as Partial<Character>);
    mockGetLoadoutDiff.mockReturnValue(
      makeDiff({
        itemsToMove: [{ itemId: "item-4", from: "holstered", to: "readied" }],
      })
    );

    render(
      <LoadoutDiffModal
        isOpen
        onClose={vi.fn()}
        character={char}
        loadoutId="loadout-1"
        onConfirm={vi.fn()}
      />
    );

    const section = screen.getByTestId("items-to-move");
    expect(section).toHaveTextContent("Holstered → Readied");
  });

  it("shows container changes section", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
    } as Partial<Character>);
    mockGetLoadoutDiff.mockReturnValue(
      makeDiff({
        containerChanges: [
          { itemId: "item-5", fromContainer: "Backpack", toContainer: undefined },
          { itemId: "item-6", fromContainer: undefined, toContainer: "Belt Pouch" },
        ],
      })
    );

    render(
      <LoadoutDiffModal
        isOpen
        onClose={vi.fn()}
        character={char}
        loadoutId="loadout-1"
        onConfirm={vi.fn()}
      />
    );

    const section = screen.getByTestId("container-changes");
    expect(section).toHaveTextContent("Backpack → loose");
    expect(section).toHaveTextContent("→ Belt Pouch");
  });

  it("calls applyLoadout and onConfirm on Apply button", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
    } as Partial<Character>);
    const updatedChar = createSheetCharacter({ name: "Updated" });
    mockGetLoadoutDiff.mockReturnValue(makeDiff({ itemsToBring: ["item-1"] }));
    mockApplyLoadout.mockReturnValue({
      success: true,
      character: updatedChar,
    });
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    render(
      <LoadoutDiffModal
        isOpen
        onClose={onClose}
        character={char}
        loadoutId="loadout-1"
        onConfirm={onConfirm}
      />
    );

    fireEvent.click(screen.getByTestId("apply-button"));
    expect(mockApplyLoadout).toHaveBeenCalledWith(char, "loadout-1");
    expect(onConfirm).toHaveBeenCalledWith(updatedChar);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose on Cancel button", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
    } as Partial<Character>);
    mockGetLoadoutDiff.mockReturnValue(makeDiff());
    const onClose = vi.fn();

    render(
      <LoadoutDiffModal
        isOpen
        onClose={onClose}
        character={char}
        loadoutId="loadout-1"
        onConfirm={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId("cancel-button"));
    expect(onClose).toHaveBeenCalled();
  });
});
