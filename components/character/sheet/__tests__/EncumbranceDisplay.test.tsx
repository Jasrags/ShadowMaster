/**
 * EncumbranceDisplay Component Tests
 *
 * Tests the encumbrance card showing weight, capacity, status,
 * progress bar, penalty warnings, and category breakdown.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

import { EncumbranceDisplay } from "../EncumbranceDisplay";

// Default character: STR=4 → capacity = 40kg
const baseCharacter = createSheetCharacter();

describe("EncumbranceDisplay", () => {
  it("renders card with Encumbrance title", () => {
    render(<EncumbranceDisplay character={baseCharacter} />);
    expect(screen.getByText("Encumbrance")).toBeInTheDocument();
  });

  it("shows weight and capacity text", () => {
    // STR=4 → 40.0kg capacity; no gear → 0.0kg
    render(<EncumbranceDisplay character={baseCharacter} />);
    expect(screen.getByText("0.0kg / 40.0kg")).toBeInTheDocument();
  });

  it('shows "Light load" when under 50% capacity', () => {
    // 10kg weapons on a 40kg capacity → 25% → light
    const char = createSheetCharacter({
      weapons: [
        {
          name: "Heavy Pistol",
          category: "Pistols",
          subcategory: "Heavy Pistols",
          damage: "8P",
          ap: -1,
          mode: ["SA"],
          accuracy: 5,
          cost: 700,
          quantity: 1,
          weight: 10,
          state: { readiness: "holstered" as const, wirelessEnabled: false },
        },
      ],
    });
    render(<EncumbranceDisplay character={char} />);
    expect(screen.getByText("Light load")).toBeInTheDocument();
  });

  it('shows "Normal load" when 50-75% capacity', () => {
    // 25kg on 40kg capacity → 62.5% → normal
    const char = createSheetCharacter({
      gear: [
        {
          name: "Heavy Kit",
          category: "survival-gear",
          subcategory: "kits",
          cost: 500,
          quantity: 1,
          weight: 25,
          state: { readiness: "worn" as const, wirelessEnabled: false },
        },
      ],
    });
    render(<EncumbranceDisplay character={char} />);
    expect(screen.getByText("Normal load")).toBeInTheDocument();
  });

  it('shows "Heavy load" when 75-100% capacity', () => {
    // 35kg on 40kg capacity → 87.5% → heavy
    const char = createSheetCharacter({
      gear: [
        {
          name: "Very Heavy Kit",
          category: "survival-gear",
          subcategory: "kits",
          cost: 500,
          quantity: 1,
          weight: 35,
          state: { readiness: "worn" as const, wirelessEnabled: false },
        },
      ],
    });
    render(<EncumbranceDisplay character={char} />);
    expect(screen.getByText("Heavy load")).toBeInTheDocument();
  });

  it("shows overloaded status and penalty when over capacity", () => {
    // 50kg on 40kg capacity → 125% → overloaded
    const char = createSheetCharacter({
      gear: [
        {
          name: "Massive Kit",
          category: "survival-gear",
          subcategory: "kits",
          cost: 500,
          quantity: 1,
          weight: 50,
          state: { readiness: "worn" as const, wirelessEnabled: false },
        },
      ],
    });
    render(<EncumbranceDisplay character={char} />);
    // getEncumbranceStatus returns description like "Overloaded (-10 penalty)"
    expect(screen.getByText(/Overloaded/)).toBeInTheDocument();
    // Penalty warning should appear
    expect(screen.getByText(/over capacity/)).toBeInTheDocument();
  });

  it("shows weight breakdown rows for categories with weight > 0", () => {
    const char = createSheetCharacter({
      weapons: [
        {
          name: "Pistol",
          category: "Pistols",
          subcategory: "Heavy Pistols",
          damage: "8P",
          ap: -1,
          mode: ["SA"],
          accuracy: 5,
          cost: 700,
          quantity: 1,
          weight: 2,
          state: { readiness: "holstered" as const, wirelessEnabled: false },
        },
      ],
      armor: [
        {
          name: "Jacket",
          category: "armor",
          subcategory: "armor",
          armorRating: 12,
          equipped: true,
          cost: 1000,
          quantity: 1,
          weight: 5,
          state: { readiness: "worn" as const, wirelessEnabled: false },
        },
      ],
    });
    render(<EncumbranceDisplay character={char} />);
    expect(screen.getByText("Weight Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Weapons")).toBeInTheDocument();
    expect(screen.getByText("Armor")).toBeInTheDocument();
    // Gear and Ammo should NOT appear (weight=0)
    expect(screen.queryByText("Gear")).not.toBeInTheDocument();
    expect(screen.queryByText("Ammo")).not.toBeInTheDocument();
  });

  it("handles character with no gear", () => {
    const char = createSheetCharacter({
      weapons: [],
      armor: [],
      gear: [],
      ammunition: [],
    });
    render(<EncumbranceDisplay character={char} />);
    expect(screen.getByText("Light load")).toBeInTheDocument();
    expect(screen.getByText("0.0kg / 40.0kg")).toBeInTheDocument();
    // No breakdown when everything is 0
    expect(screen.queryByText("Weight Breakdown")).not.toBeInTheDocument();
  });
});
