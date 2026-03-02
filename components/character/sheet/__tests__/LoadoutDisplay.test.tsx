/**
 * LoadoutDisplay Tests
 *
 * Tests CRUD operations: create, edit, delete, apply button opens modal.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { setupDisplayCardMock, LUCIDE_MOCK, createSheetCharacter } from "./test-helpers";
import type { Character } from "@/lib/types";
import type { Loadout } from "@/lib/types/gear-state";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

setupDisplayCardMock();
vi.mock("lucide-react", () => LUCIDE_MOCK);

const mockSaveCurrentAsLoadout = vi.fn();
const mockDeleteLoadout = vi.fn();
const mockUpdateLoadout = vi.fn();

vi.mock("@/lib/rules/inventory", () => ({
  saveCurrentAsLoadout: (...args: unknown[]) => mockSaveCurrentAsLoadout(...args),
  deleteLoadout: (...args: unknown[]) => mockDeleteLoadout(...args),
  updateLoadout: (...args: unknown[]) => mockUpdateLoadout(...args),
  getLoadoutDiff: () => ({
    itemsToStash: [],
    itemsToBring: [],
    itemsToMove: [],
    encumbranceChange: 0,
  }),
  applyLoadout: (char: Character) => ({
    success: true,
    character: char,
    diff: { itemsToStash: [], itemsToBring: [], itemsToMove: [], encumbranceChange: 0 },
    errors: [],
  }),
  findGearItemById: () => ({ name: "Test Item" }),
}));

vi.mock("../readiness-helpers", () => ({
  getReadinessLabel: (r: string) => r.charAt(0).toUpperCase() + r.slice(1),
  getReadinessColor: () => "text-zinc-400",
  READINESS_BY_EQUIPMENT: {
    gear: ["worn", "holstered", "pocketed", "carried", "stashed"],
    weapon: ["readied", "holstered", "carried", "stashed"],
    armor: ["worn", "carried", "stashed"],
    electronics: ["holstered", "pocketed", "carried", "stashed"],
  },
}));

vi.mock("@/components/ui/BaseModal", () => ({
  BaseModal: ({
    title,
    children,
    isOpen,
  }: {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
  }) =>
    isOpen ? (
      <div data-testid="base-modal">
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}));

import { LoadoutDisplay } from "../LoadoutDisplay";

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

describe("LoadoutDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state when no loadouts", () => {
    const char = createSheetCharacter();
    render(<LoadoutDisplay character={char} editable onCharacterUpdate={vi.fn()} />);
    expect(screen.getByText("No loadouts saved")).toBeInTheDocument();
  });

  it("renders loadout rows", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout(), makeLoadout({ id: "loadout-2", name: "Combat Kit" })],
    } as Partial<Character>);
    render(<LoadoutDisplay character={char} editable onCharacterUpdate={vi.fn()} />);
    const rows = screen.getAllByTestId("loadout-row");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("Stealth Run");
    expect(rows[1]).toHaveTextContent("Combat Kit");
  });

  it("shows Active badge for active loadout", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
      activeLoadoutId: "loadout-1",
    } as Partial<Character>);
    render(<LoadoutDisplay character={char} editable onCharacterUpdate={vi.fn()} />);
    expect(screen.getByTestId("active-badge")).toHaveTextContent("Active");
  });

  it("opens new loadout form on + New click", () => {
    const char = createSheetCharacter();
    render(<LoadoutDisplay character={char} editable onCharacterUpdate={vi.fn()} />);
    fireEvent.click(screen.getByTestId("new-loadout-button"));
    expect(screen.getByTestId("new-loadout-form")).toBeInTheDocument();
  });

  it("calls saveCurrentAsLoadout on Save Current", () => {
    const onUpdate = vi.fn();
    const char = createSheetCharacter();
    const updatedChar = createSheetCharacter({ name: "Updated" });
    mockSaveCurrentAsLoadout.mockReturnValue({
      character: updatedChar,
      loadout: makeLoadout(),
    });

    render(<LoadoutDisplay character={char} editable onCharacterUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("new-loadout-button"));

    const nameInput = screen.getByTestId("new-loadout-name");
    fireEvent.change(nameInput, { target: { value: "New Config" } });
    fireEvent.click(screen.getByTestId("save-current-button"));

    expect(mockSaveCurrentAsLoadout).toHaveBeenCalledWith(char, "New Config", undefined);
    expect(onUpdate).toHaveBeenCalledWith(updatedChar);
  });

  it("deletes loadout after confirmation", () => {
    const onUpdate = vi.fn();
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
    } as Partial<Character>);
    const updatedChar = createSheetCharacter({ loadouts: [] } as Partial<Character>);
    mockDeleteLoadout.mockReturnValue(updatedChar);

    render(<LoadoutDisplay character={char} editable onCharacterUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("delete-loadout-button"));
    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    expect(mockDeleteLoadout).toHaveBeenCalledWith(char, "loadout-1");
    expect(onUpdate).toHaveBeenCalledWith(updatedChar);
  });

  it("opens diff modal on Apply click", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
    } as Partial<Character>);

    render(<LoadoutDisplay character={char} editable onCharacterUpdate={vi.fn()} />);
    fireEvent.click(screen.getByTestId("apply-loadout-button"));

    expect(screen.getByTestId("base-modal")).toBeInTheDocument();
  });

  it("hides controls when not editable", () => {
    const char = createSheetCharacter({
      loadouts: [makeLoadout()],
    } as Partial<Character>);
    render(<LoadoutDisplay character={char} />);
    expect(screen.queryByTestId("new-loadout-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("apply-loadout-button")).not.toBeInTheDocument();
  });
});
