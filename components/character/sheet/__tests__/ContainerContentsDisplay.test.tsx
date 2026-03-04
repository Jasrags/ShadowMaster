/**
 * ContainerContentsDisplay Tests
 *
 * Tests the container contents display: items, capacity bar, remove button,
 * empty state, and depth limit.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";
import type { Character, GearItem } from "@/lib/types";
import type { ContainerProperties } from "@/lib/types/gear-state";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("lucide-react", () => LUCIDE_MOCK);

const mockGetContainerContents = vi.fn();
const mockGetContainerContentWeight = vi.fn();
const mockRemoveItemFromContainer = vi.fn();
const mockIsContainer = vi.fn();
const mockGetEffectiveReadiness = vi.fn();

vi.mock("@/lib/rules/inventory", () => ({
  getContainerContents: (...args: unknown[]) => mockGetContainerContents(...args),
  getContainerContentWeight: (...args: unknown[]) => mockGetContainerContentWeight(...args),
  removeItemFromContainer: (...args: unknown[]) => mockRemoveItemFromContainer(...args),
  getEffectiveReadiness: (...args: unknown[]) => mockGetEffectiveReadiness(...args),
  MAX_CONTAINER_DEPTH: 3,
  isContainer: (...args: unknown[]) => mockIsContainer(...args),
}));

vi.mock("../readiness-helpers", () => ({
  getReadinessLabel: (r: string) => r.charAt(0).toUpperCase() + r.slice(1),
  getReadinessColor: () => "text-zinc-400",
}));

import { ContainerContentsDisplay } from "../ContainerContentsDisplay";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeContainer(): ContainerProperties {
  return { weightCapacity: 10 };
}

function makeCharacter(overrides?: Partial<Character>): Character {
  return createSheetCharacter(overrides);
}

function makeGearItem(overrides: Partial<GearItem> & { name: string; id?: string }): GearItem {
  return {
    category: "miscellaneous",
    quantity: 1,
    cost: 100,
    ...overrides,
  } as GearItem;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ContainerContentsDisplay", () => {
  it("renders empty state when no contents", () => {
    mockGetContainerContents.mockReturnValue([]);
    mockGetContainerContentWeight.mockReturnValue(0);

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={makeContainer()}
      />
    );

    expect(screen.getByTestId("container-empty")).toHaveTextContent("Empty");
  });

  it("renders contained items", () => {
    const items = [
      makeGearItem({ name: "Medkit", id: "item-1" }),
      makeGearItem({ name: "Stim Patch", id: "item-2" }),
    ];
    mockGetContainerContents.mockReturnValue(items);
    mockGetContainerContentWeight.mockReturnValue(2.5);
    mockIsContainer.mockReturnValue(false);
    mockGetEffectiveReadiness.mockReturnValue("carried");

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={makeContainer()}
      />
    );

    const rows = screen.getAllByTestId("contained-item");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("Medkit");
    expect(rows[1]).toHaveTextContent("Stim Patch");
  });

  it("renders capacity bar with correct weight", () => {
    mockGetContainerContents.mockReturnValue([]);
    mockGetContainerContentWeight.mockReturnValue(3.2);

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={{ weightCapacity: 10 }}
      />
    );

    const bar = screen.getByTestId("capacity-bar");
    expect(bar).toHaveTextContent("3.2 / 10 kg");
  });

  it("shows remove button when editable", () => {
    const items = [makeGearItem({ name: "Medkit", id: "item-1" })];
    mockGetContainerContents.mockReturnValue(items);
    mockGetContainerContentWeight.mockReturnValue(1);
    mockIsContainer.mockReturnValue(false);
    mockGetEffectiveReadiness.mockReturnValue("carried");

    const onUpdate = vi.fn();
    mockRemoveItemFromContainer.mockReturnValue({
      success: true,
      character: makeCharacter(),
    });

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={makeContainer()}
        onCharacterUpdate={onUpdate}
        editable
      />
    );

    const removeBtn = screen.getByTestId("remove-from-container");
    expect(removeBtn).toBeInTheDocument();

    fireEvent.click(removeBtn);
    expect(mockRemoveItemFromContainer).toHaveBeenCalledWith(expect.anything(), "item-1");
    expect(onUpdate).toHaveBeenCalled();
  });

  it("hides remove button when not editable", () => {
    const items = [makeGearItem({ name: "Medkit", id: "item-1" })];
    mockGetContainerContents.mockReturnValue(items);
    mockGetContainerContentWeight.mockReturnValue(1);
    mockIsContainer.mockReturnValue(false);
    mockGetEffectiveReadiness.mockReturnValue("carried");

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={makeContainer()}
      />
    );

    expect(screen.queryByTestId("remove-from-container")).not.toBeInTheDocument();
  });

  // =========================================================================
  // Effective readiness badge
  // =========================================================================

  it("shows effective readiness badge when container restricts item", () => {
    const items = [
      makeGearItem({
        name: "Pistol",
        id: "item-1",
        state: { readiness: "readied" as const, wirelessEnabled: false },
      }),
    ];
    mockGetContainerContents.mockReturnValue(items);
    mockGetContainerContentWeight.mockReturnValue(1);
    mockIsContainer.mockReturnValue(false);
    // Container restricts item from "readied" to "carried"
    mockGetEffectiveReadiness.mockReturnValue("carried");

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={makeContainer()}
      />
    );

    expect(screen.getByTestId("effective-readiness")).toHaveTextContent("eff: Carried");
  });

  it("hides effective readiness badge when not restricted", () => {
    const items = [
      makeGearItem({
        name: "Medkit",
        id: "item-1",
        state: { readiness: "carried" as const, wirelessEnabled: false },
      }),
    ];
    mockGetContainerContents.mockReturnValue(items);
    mockGetContainerContentWeight.mockReturnValue(1);
    mockIsContainer.mockReturnValue(false);
    // Effective readiness matches item readiness → no restriction
    mockGetEffectiveReadiness.mockReturnValue("carried");

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={makeContainer()}
      />
    );

    expect(screen.queryByTestId("effective-readiness")).not.toBeInTheDocument();
  });

  // =========================================================================
  // Capacity warning
  // =========================================================================

  it("shows capacity warning when at 90%+", () => {
    mockGetContainerContents.mockReturnValue([]);
    mockGetContainerContentWeight.mockReturnValue(9.5);

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={{ weightCapacity: 10 }}
      />
    );

    expect(screen.getByTestId("capacity-warning")).toHaveTextContent("Near capacity");
  });

  it("shows over capacity warning when overweight", () => {
    mockGetContainerContents.mockReturnValue([]);
    mockGetContainerContentWeight.mockReturnValue(11);

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={{ weightCapacity: 10 }}
      />
    );

    expect(screen.getByTestId("capacity-warning")).toHaveTextContent("Over capacity!");
  });

  it("hides capacity warning when under 90%", () => {
    mockGetContainerContents.mockReturnValue([]);
    mockGetContainerContentWeight.mockReturnValue(5);

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={{ weightCapacity: 10 }}
      />
    );

    expect(screen.queryByTestId("capacity-warning")).not.toBeInTheDocument();
  });

  // =========================================================================
  // Slot count display
  // =========================================================================

  it("shows slot count when slotCapacity is set", () => {
    const items = [makeGearItem({ name: "Medkit", id: "item-1" })];
    mockGetContainerContents.mockReturnValue(items);
    mockGetContainerContentWeight.mockReturnValue(1);
    mockIsContainer.mockReturnValue(false);
    mockGetEffectiveReadiness.mockReturnValue("carried");

    render(
      <ContainerContentsDisplay
        character={makeCharacter()}
        containerId="bag-1"
        containerProperties={{ weightCapacity: 10, slotCapacity: 5 }}
      />
    );

    expect(screen.getByTestId("capacity-bar")).toHaveTextContent(/1\/5 slots/);
  });
});
