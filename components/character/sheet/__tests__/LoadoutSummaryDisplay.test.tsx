/**
 * LoadoutSummaryDisplay Tests
 *
 * Tests read-only loadout summary: active loadout name, stats, encumbrance bar.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";
import type { Character } from "@/lib/types";
import type { Loadout } from "@/lib/types/gear-state";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

vi.mock("@/lib/rules/inventory", () => ({
  getEquipmentStateSummary: () => ({
    readiedWeapons: 1,
    holsteredWeapons: 2,
    carriedWeapons: 0,
    storedWeapons: 0,
    stashedWeapons: 0,
    wornArmor: 1,
    carriedArmor: 0,
    storedArmor: 0,
    stashedArmor: 0,
    pocketedItems: 3,
    containedItems: 0,
    wirelessEnabled: 5,
    wirelessDisabled: 1,
    brickedDevices: 0,
  }),
}));

vi.mock("@/lib/rules/encumbrance/calculator", () => ({
  calculateEncumbrance: () => ({
    currentWeight: 12.5,
    maxCapacity: 40,
    overweightPenalty: 0,
    isEncumbered: false,
  }),
}));

import { LoadoutSummaryDisplay } from "../LoadoutSummaryDisplay";

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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("LoadoutSummaryDisplay", () => {
  it('shows "Manual Configuration" when no active loadout', () => {
    const char = createSheetCharacter();
    render(<LoadoutSummaryDisplay character={char} />);
    expect(screen.getByTestId("active-loadout-name")).toHaveTextContent("Manual Configuration");
  });

  it("shows active loadout name when one is set", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
      activeLoadoutId: "loadout-1",
    } as Partial<Character>);
    render(<LoadoutSummaryDisplay character={char} />);
    expect(screen.getByTestId("active-loadout-name")).toHaveTextContent("Stealth Run");
  });

  it("shows encumbrance mini bar", () => {
    const char = createSheetCharacter();
    render(<LoadoutSummaryDisplay character={char} />);
    expect(screen.getByTestId("encumbrance-mini")).toHaveTextContent("12.5kg");
  });

  it("shows stat badges for non-zero equipment counts", () => {
    const char = createSheetCharacter();
    render(<LoadoutSummaryDisplay character={char} />);
    const stats = screen.getByTestId("loadout-stats");
    expect(stats).toHaveTextContent("1 Readied");
    expect(stats).toHaveTextContent("2 Holstered");
    expect(stats).toHaveTextContent("1 Worn");
    expect(stats).toHaveTextContent("3 Pocketed");
  });
});
