/**
 * WeaponsPanel Component Tests
 *
 * Tests the weapon purchasing panel in character creation.
 * Tests include locked state, grouped weapon display by category,
 * add/remove weapons, nuyen budget tracking, and validation status.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeaponsPanel } from "../WeaponsPanel";

// Mock hooks
vi.mock("@/lib/rules/RulesetContext", () => ({
  useGear: vi.fn(),
  useWeaponModifications: vi.fn(),
  useRuleset: vi.fn(),
}));

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

vi.mock("@/lib/rules/gear/weapon-customization", () => ({
  applyBuiltInModifications: vi.fn((weapon: { id: string; name: string }) => weapon),
}));

// Mock shared components
vi.mock("../shared", () => ({
  CreationCard: ({
    title,
    status,
    children,
    headerAction,
  }: {
    title: string;
    status: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      {headerAction && <div data-testid="header-action">{headerAction}</div>}
      {children}
    </div>
  ),
  SummaryFooter: ({ count, total }: { count: number; total: number }) => (
    <div data-testid="summary-footer">
      {count} weapon(s) — {total}
    </div>
  ),
  KarmaConversionModal: () => null,
  useKarmaConversionPrompt: () => ({
    checkPurchase: vi.fn(() => null),
    promptConversion: vi.fn(),
    modalState: { isOpen: false, itemName: "", itemCost: 0, karmaToConvert: 0 },
    closeModal: vi.fn(),
    confirmConversion: vi.fn(),
    currentRemaining: 0,
    karmaAvailable: 0,
    currentKarmaConversion: 0,
    maxKarmaConversion: 10,
  }),
  LegalityWarnings: ({ items }: { items: unknown[] }) =>
    items.length > 0 ? <div data-testid="legality-warnings">{items.length} warnings</div> : null,
}));

// Mock weapon sub-components
vi.mock("../weapons", () => ({
  WeaponRow: ({
    weapon,
    onRemove,
  }: {
    weapon: { id: string; name: string };
    onRemove: (id: string) => void;
  }) => (
    <div data-testid={`weapon-row-${weapon.id}`}>
      <span>{weapon.name}</span>
      <button onClick={() => onRemove(weapon.id)} data-testid={`remove-${weapon.id}`}>
        Remove
      </button>
    </div>
  ),
  WeaponPurchaseModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="purchase-modal">Modal Open</div> : null,
  WeaponModificationModal: () => null,
  AmmunitionModal: () => null,
}));

// Mock UI components
vi.mock("@/components/ui", () => ({
  InfoTooltip: () => null,
}));

import { useGear, useWeaponModifications, useRuleset } from "@/lib/rules/RulesetContext";
import { useCreationBudgets } from "@/lib/contexts";

const makeRangedWeapon = (overrides = {}) => ({
  id: "ares-1",
  catalogId: "ares-predator",
  name: "Ares Predator V",
  category: "pistol",
  subcategory: "heavy-pistol",
  damage: "8P",
  ap: -1,
  mode: ["SA"],
  recoil: 0,
  accuracy: 5,
  cost: 725,
  availability: 5,
  quantity: 1,
  modifications: [],
  occupiedMounts: [],
  ...overrides,
});

const makeMeleeWeapon = (overrides = {}) => ({
  id: "katana-1",
  catalogId: "katana",
  name: "Katana",
  category: "blade",
  subcategory: "blade",
  damage: "10P",
  ap: -3,
  mode: [],
  reach: 1,
  accuracy: 7,
  cost: 1000,
  availability: 9,
  quantity: 1,
  modifications: [],
  occupiedMounts: [],
  ...overrides,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 4,
  priorities: {
    metatype: "A",
    attributes: "B",
    magic: "C",
    skills: "D",
    resources: "E",
    ...overrides.priorities,
  },
  selections: {
    metatype: "human",
    weapons: [],
    ...overrides.selections,
  },
  budgets: {
    ...overrides.budgets,
  },
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("WeaponsPanel", () => {
  let mockUpdateState: Mock;
  let mockGetBudget: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();
    mockGetBudget = vi.fn((budgetId: string) => {
      if (budgetId === "nuyen")
        return { total: 450000, spent: 0, remaining: 450000, label: "Nuyen" };
      if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
      return null;
    });

    vi.mocked(useGear).mockReturnValue(null as unknown as ReturnType<typeof useGear>);
    vi.mocked(useWeaponModifications).mockReturnValue([]);
    vi.mocked(useRuleset).mockReturnValue({
      ruleset: null,
    } as unknown as ReturnType<typeof useRuleset>);
    vi.mocked(useCreationBudgets).mockReturnValue({
      getBudget: mockGetBudget,
      budgets: {},
      updateSpent: vi.fn(),
      errors: [],
      warnings: [],
      isComplete: false,
    } as unknown as ReturnType<typeof useCreationBudgets>);
  });

  describe("locked state", () => {
    it("shows locked state when priorities not set", () => {
      const state = createBaseState({ priorities: {} });
      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Set priorities first")).toBeInTheDocument();
    });

    it("shows pending status when locked", () => {
      const state = createBaseState({ priorities: {} });
      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });
  });

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Weapons");
    });

    it("shows empty state when no weapons", () => {
      const state = createBaseState();
      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No weapons selected")).toBeInTheDocument();
    });

    it("renders nuyen bar", () => {
      const state = createBaseState();
      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Nuyen")).toBeInTheDocument();
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByRole("button", { name: /Add/ })).toBeInTheDocument();
    });

    it("renders footer summary", () => {
      const state = createBaseState();
      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("summary-footer")).toBeInTheDocument();
    });

    it("opens purchase modal when Add button is clicked", () => {
      const state = createBaseState();
      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("purchase-modal")).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      expect(screen.getByTestId("purchase-modal")).toBeInTheDocument();
    });
  });

  describe("weapon display", () => {
    it("shows Selected Weapons count header", () => {
      const state = createBaseState({
        selections: { weapons: [makeRangedWeapon()] },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Selected Weapons (1)")).toBeInTheDocument();
    });

    it("renders weapons grouped under Ranged category", () => {
      const state = createBaseState({
        selections: { weapons: [makeRangedWeapon()] },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Ranged")).toBeInTheDocument();
      expect(screen.getByText("Ares Predator V")).toBeInTheDocument();
    });

    it("renders weapons grouped under Melee category", () => {
      const state = createBaseState({
        selections: { weapons: [makeMeleeWeapon()] },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Melee")).toBeInTheDocument();
      expect(screen.getByText("Katana")).toBeInTheDocument();
    });

    it("renders both ranged and melee categories", () => {
      const state = createBaseState({
        selections: { weapons: [makeRangedWeapon(), makeMeleeWeapon()] },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Ranged")).toBeInTheDocument();
      expect(screen.getByText("Melee")).toBeInTheDocument();
      expect(screen.getByText("Selected Weapons (2)")).toBeInTheDocument();
    });

    it("renders weapon via WeaponRow stub", () => {
      const state = createBaseState({
        selections: { weapons: [makeRangedWeapon()] },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("weapon-row-ares-1")).toBeInTheDocument();
    });
  });

  describe("remove weapon", () => {
    it("removes weapon when remove button is clicked", () => {
      const state = createBaseState({
        selections: { weapons: [makeRangedWeapon()] },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);
      fireEvent.click(screen.getByTestId("remove-ares-1"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          weapons: [],
        }),
      });
    });

    it("removes only the targeted weapon", () => {
      const state = createBaseState({
        selections: { weapons: [makeRangedWeapon(), makeMeleeWeapon()] },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);
      fireEvent.click(screen.getByTestId("remove-katana-1"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          weapons: [expect.objectContaining({ id: "ares-1" })],
        }),
      });
    });
  });

  describe("validation status", () => {
    it("shows pending status when no weapons", () => {
      const state = createBaseState();
      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when weapons present", () => {
      const state = createBaseState({
        selections: { weapons: [makeRangedWeapon()] },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows error status when over budget", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen")
          return { total: 500, spent: 1000, remaining: -500, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      const state = createBaseState({
        selections: { weapons: [makeRangedWeapon()] },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });
  });

  describe("nuyen budget", () => {
    it("shows nuyen spent and total", () => {
      const state = createBaseState();
      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("0 / 450,000")).toBeInTheDocument();
    });
  });

  describe("legality warnings", () => {
    it("shows legality warnings for restricted weapons", () => {
      const state = createBaseState({
        selections: {
          weapons: [makeRangedWeapon({ legality: "restricted", availability: 8 })],
        },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("legality-warnings")).toBeInTheDocument();
    });

    it("includes weapon modifications in legality items", () => {
      const state = createBaseState({
        selections: {
          weapons: [
            makeRangedWeapon({
              legality: "restricted",
              modifications: [
                {
                  catalogId: "silencer",
                  name: "Silencer",
                  legality: "forbidden",
                  cost: 500,
                  availability: 10,
                },
              ],
            }),
          ],
        },
      });

      render(<WeaponsPanel state={state} updateState={mockUpdateState} />);

      // Both weapon + mod are passed to LegalityWarnings (2 items)
      expect(screen.getByTestId("legality-warnings")).toHaveTextContent("2 warnings");
    });
  });
});
