/**
 * MoveToContainerControl Component Tests
 *
 * Tests the shared container select control that allows moving items
 * into containers. Used by GearDisplay, WeaponsDisplay, and ArmorDisplay.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createSheetCharacter } from "./test-helpers";
import type { Character, GearItem } from "@/lib/types";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockIsContainer = vi.fn();
const mockCanAddToContainer = vi.fn();
const mockAddItemToContainer = vi.fn();

vi.mock("@/lib/rules/inventory", () => ({
  isContainer: (...args: unknown[]) => mockIsContainer(...args),
  canAddToContainer: (...args: unknown[]) => mockCanAddToContainer(...args),
  addItemToContainer: (...args: unknown[]) => mockAddItemToContainer(...args),
}));

import { MoveToContainerControl } from "../MoveToContainerControl";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeContainer(overrides?: Partial<GearItem>): GearItem {
  return {
    name: "Backpack",
    category: "miscellaneous",
    quantity: 1,
    cost: 50,
    id: "container-1",
    containerProperties: { weightCapacity: 40 },
    ...overrides,
  };
}

function renderControl(character: Character, itemId: string, onCharacterUpdate = vi.fn()) {
  return render(
    <MoveToContainerControl
      character={character}
      itemId={itemId}
      onCharacterUpdate={onCharacterUpdate}
    />
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("MoveToContainerControl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsContainer.mockReturnValue(false);
  });

  it("returns null when no containers exist", () => {
    const character = createSheetCharacter({
      gear: [{ name: "Medkit", category: "medical", quantity: 1, cost: 100, id: "item-1" }],
    });
    const { container } = renderControl(character, "item-1");
    expect(container.innerHTML).toBe("");
  });

  it("returns null when only container is the item itself", () => {
    const container1 = makeContainer({ id: "container-1" });
    mockIsContainer.mockImplementation((g: GearItem) => g.id === "container-1");

    const character = createSheetCharacter({ gear: [container1] });
    const { container } = renderControl(character, "container-1");
    expect(container.innerHTML).toBe("");
  });

  it("renders container select when containers exist", () => {
    const item = { name: "Medkit", category: "medical", quantity: 1, cost: 100, id: "item-1" };
    const bag = makeContainer({ id: "bag-1", name: "Duffel Bag" });

    mockIsContainer.mockImplementation((g: GearItem) => g.id === "bag-1");
    mockCanAddToContainer.mockReturnValue({ allowed: true });

    const character = createSheetCharacter({ gear: [item, bag] });
    renderControl(character, "item-1");

    expect(screen.getByTestId("move-to-container")).toBeInTheDocument();
    expect(screen.getByTestId("container-select")).toBeInTheDocument();
    expect(screen.getByText("Duffel Bag")).toBeInTheDocument();
  });

  it("shows disabled option with reason when canAddToContainer fails", () => {
    const item = { name: "Medkit", category: "medical", quantity: 1, cost: 100, id: "item-1" };
    const bag = makeContainer({ id: "bag-1", name: "Small Pouch" });

    mockIsContainer.mockImplementation((g: GearItem) => g.id === "bag-1");
    mockCanAddToContainer.mockReturnValue({ allowed: false, reason: "Too heavy" });

    const character = createSheetCharacter({ gear: [item, bag] });
    renderControl(character, "item-1");

    const option = screen.getByText("Small Pouch (Too heavy)");
    expect(option).toBeInTheDocument();
    expect(option).toBeDisabled();
  });

  it("calls addItemToContainer and onCharacterUpdate on selection", () => {
    const item = { name: "Medkit", category: "medical", quantity: 1, cost: 100, id: "item-1" };
    const bag = makeContainer({ id: "bag-1", name: "Duffel Bag" });

    mockIsContainer.mockImplementation((g: GearItem) => g.id === "bag-1");
    mockCanAddToContainer.mockReturnValue({ allowed: true });

    const updatedChar = createSheetCharacter();
    mockAddItemToContainer.mockReturnValue({ success: true, character: updatedChar });

    const onUpdate = vi.fn();
    const character = createSheetCharacter({ gear: [item, bag] });
    renderControl(character, "item-1", onUpdate);

    fireEvent.change(screen.getByTestId("container-select"), { target: { value: "bag-1" } });

    expect(mockAddItemToContainer).toHaveBeenCalledWith(character, "item-1", "bag-1");
    expect(onUpdate).toHaveBeenCalledWith(updatedChar);
  });

  it("does not call onCharacterUpdate when addItemToContainer fails", () => {
    const item = { name: "Medkit", category: "medical", quantity: 1, cost: 100, id: "item-1" };
    const bag = makeContainer({ id: "bag-1", name: "Duffel Bag" });

    mockIsContainer.mockImplementation((g: GearItem) => g.id === "bag-1");
    mockCanAddToContainer.mockReturnValue({ allowed: true });
    mockAddItemToContainer.mockReturnValue({ success: false, error: "Container full" });

    const onUpdate = vi.fn();
    const character = createSheetCharacter({ gear: [item, bag] });
    renderControl(character, "item-1", onUpdate);

    fireEvent.change(screen.getByTestId("container-select"), { target: { value: "bag-1" } });

    expect(mockAddItemToContainer).toHaveBeenCalled();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("renders multiple containers as options", () => {
    const item = { name: "Medkit", category: "medical", quantity: 1, cost: 100, id: "item-1" };
    const bag1 = makeContainer({ id: "bag-1", name: "Backpack" });
    const bag2 = makeContainer({ id: "bag-2", name: "Duffel Bag" });

    mockIsContainer.mockImplementation((g: GearItem) => g.id === "bag-1" || g.id === "bag-2");
    mockCanAddToContainer.mockReturnValue({ allowed: true });

    const character = createSheetCharacter({ gear: [item, bag1, bag2] });
    renderControl(character, "item-1");

    expect(screen.getByText("Backpack")).toBeInTheDocument();
    expect(screen.getByText("Duffel Bag")).toBeInTheDocument();
  });
});
