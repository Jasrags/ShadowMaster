/**
 * SpellsCard Component Tests
 *
 * Tests the spell selection card in character creation.
 * Tests include rendering, locked states for non-casters,
 * spell add/remove, karma tracking, grouped display, and validation.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SpellsCard } from "../SpellsCard";

// Mock hooks
vi.mock("@/lib/rules", () => ({
  useSpells: vi.fn(),
  usePriorityTable: vi.fn(),
}));

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

// Mock sub-components from ./spells
vi.mock("../spells", () => ({
  SpellModal: ({
    isOpen,
    onAdd,
    allSpells,
  }: {
    isOpen: boolean;
    onAdd: (id: string, attr?: string) => void;
    allSpells: Array<{ id: string }>;
  }) =>
    isOpen ? (
      <div data-testid="spell-modal">
        {allSpells.map((s) => (
          <button key={s.id} data-testid={`modal-add-${s.id}`} onClick={() => onAdd(s.id)}>
            Add {s.id}
          </button>
        ))}
      </div>
    ) : null,
  SpellListItem: ({
    displayName,
    isFree,
    karmaCost,
    onRemove,
  }: {
    displayName: string;
    isFree: boolean;
    karmaCost?: number;
    onRemove: () => void;
  }) => (
    <div data-testid={`spell-item-${displayName}`}>
      <span>{displayName}</span>
      {isFree ? <span>Free</span> : <span>{karmaCost} karma</span>}
      <button data-testid={`remove-${displayName}`} onClick={onRemove}>
        Remove
      </button>
    </div>
  ),
}));

// Mock shared components
vi.mock("../shared", () => ({
  CreationCard: ({
    title,
    description,
    status,
    headerAction,
    children,
  }: {
    title: string;
    description?: string;
    status: string;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      {description && <div data-testid="card-description">{description}</div>}
      {headerAction && <div data-testid="card-header-action">{headerAction}</div>}
      {children}
    </div>
  ),
  BudgetIndicator: ({
    label,
    spent,
    total,
    note,
  }: {
    label: string;
    spent: number;
    total: number;
    note?: string;
  }) => (
    <div data-testid={`budget-${label}`}>
      {spent}/{total} {note && <span>{note}</span>}
    </div>
  ),
  SummaryFooter: ({ count, total, label }: { count: number; total: string; label: string }) => (
    <div data-testid="summary-footer">
      {count} {label}(s) • {total}
    </div>
  ),
}));

import { useSpells, usePriorityTable } from "@/lib/rules";
import { useCreationBudgets } from "@/lib/contexts";

// Mock spell catalog
const mockSpellsCatalog = {
  combat: [
    {
      id: "manabolt",
      name: "Manabolt",
      category: "combat" as const,
      type: "mana" as const,
      range: "LOS",
      duration: "Instant",
      drain: "F-3",
    },
    {
      id: "powerbolt",
      name: "Powerbolt",
      category: "combat" as const,
      type: "physical" as const,
      range: "LOS",
      duration: "Instant",
      drain: "F-3",
    },
  ],
  detection: [
    {
      id: "detect-life",
      name: "Detect Life",
      category: "detection" as const,
      type: "mana" as const,
      range: "Touch",
      duration: "Sustained",
      drain: "F-3",
    },
  ],
  health: [
    {
      id: "heal",
      name: "Heal",
      category: "health" as const,
      type: "mana" as const,
      range: "Touch",
      duration: "Permanent",
      drain: "F-4",
    },
  ],
  illusion: [],
  manipulation: [
    {
      id: "increase-attribute",
      name: "Increase [Attribute]",
      category: "manipulation" as const,
      type: "physical" as const,
      range: "Touch",
      duration: "Sustained",
      drain: "F-3",
      requiresAttributeSelection: true,
      validAttributes: ["body", "agility", "strength"],
      attributeSelectionLabel: "Choose Attribute",
    },
  ],
};

const mockPriorityTable = {
  table: {
    A: {
      magic: {
        options: [
          { path: "magician", spells: 10, magicRating: 6 },
          { path: "mystic-adept", spells: 7, magicRating: 6 },
        ],
      },
    },
    B: {
      magic: {
        options: [
          { path: "magician", spells: 7, magicRating: 4 },
          { path: "technomancer", resonanceRating: 4, complexForms: 5 },
        ],
      },
    },
    C: {
      magic: {
        options: [{ path: "magician", spells: 5, magicRating: 3 }],
      },
    },
    D: { magic: { options: [] } },
    E: { magic: { options: [] } },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 3,
  priorities: {
    metatype: "C",
    attributes: "B",
    magic: "A",
    skills: "D",
    resources: "E",
    ...overrides.priorities,
  },
  selections: {
    metatype: "human",
    "magical-path": "magician",
    spells: [],
    ...overrides.selections,
  },
  budgets: {
    ...overrides.budgets,
  },
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("SpellsCard", () => {
  let mockUpdateState: Mock;
  let mockGetBudget: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUpdateState = vi.fn();
    mockGetBudget = vi.fn((budgetId: string) => {
      if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
      return null;
    });

    vi.mocked(useSpells).mockReturnValue(mockSpellsCatalog);
    vi.mocked(usePriorityTable).mockReturnValue(
      mockPriorityTable as unknown as ReturnType<typeof usePriorityTable>
    );
    vi.mocked(useCreationBudgets).mockReturnValue({
      getBudget: mockGetBudget,
      budgets: {},
      updateSpent: vi.fn(),
      errors: [],
      warnings: [],
      isComplete: false,
    } as unknown as ReturnType<typeof useCreationBudgets>);
  });

  describe("locked states", () => {
    it("shows locked state for mundane characters", () => {
      const state = createBaseState({
        selections: { "magical-path": "mundane" },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/No spells available — Mundane character/)).toBeInTheDocument();
      expect(
        screen.getByText("Change your Magic/Resonance path to unlock spells.")
      ).toBeInTheDocument();
    });

    it("shows locked state for technomancers", () => {
      const state = createBaseState({
        selections: { "magical-path": "technomancer" },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/No spells available — Mundane character/)).toBeInTheDocument();
    });

    it("shows locked state for adepts (not in spell paths)", () => {
      const state = createBaseState({
        selections: { "magical-path": "adept" },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      // Adept is not in SPELL_PATHS, so it falls through to the mundane locked state
      expect(screen.getByText(/No spells available — Mundane character/)).toBeInTheDocument();
    });

    it("shows blocked state for non-sorcery aspected mage", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "aspected-mage",
          "aspected-mage-group": "conjuring",
        },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/No spells available — conjuring Aspected Mage/)).toBeInTheDocument();
    });
  });

  describe("rendering for magicians", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Spells");
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Add")).toBeInTheDocument();
    });

    it("renders budget indicator with free spell count", () => {
      const state = createBaseState();
      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      // Magician at priority A gets 10 free spells
      const budget = screen.getByTestId("budget-Spells");
      expect(budget).toHaveTextContent("0/10");
    });

    it("renders empty state when no spells selected", () => {
      const state = createBaseState();
      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No spells selected")).toBeInTheDocument();
    });

    it("renders summary footer", () => {
      const state = createBaseState();
      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("summary-footer")).toHaveTextContent("0 spell(s)");
      expect(screen.getByTestId("summary-footer")).toHaveTextContent("10 free remaining");
    });
  });

  describe("spell selection", () => {
    it("opens modal when Add button is clicked", () => {
      const state = createBaseState();
      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("spell-modal")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("Add"));
      expect(screen.getByTestId("spell-modal")).toBeInTheDocument();
    });

    it("adds a spell from the modal", () => {
      const state = createBaseState();
      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));
      fireEvent.click(screen.getByTestId("modal-add-manabolt"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          spells: ["manabolt"],
        }),
        budgets: expect.objectContaining({
          "karma-spent-spells": 0, // Still within free count
        }),
      });
    });

    it("removes a selected spell", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          spells: ["manabolt", "heal"],
        },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("remove-Manabolt"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          spells: ["heal"],
        }),
        budgets: expect.objectContaining({
          "karma-spent-spells": 0,
        }),
      });
    });

    it("displays selected spells grouped by category", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          spells: ["manabolt", "heal"],
        },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Selected Spells (2)")).toBeInTheDocument();
      expect(screen.getByText("combat")).toBeInTheDocument();
      expect(screen.getByText("health")).toBeInTheDocument();
    });
  });

  describe("karma tracking", () => {
    it("shows no karma cost when spells are within free count", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          spells: ["manabolt", "heal"],
        },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("summary-footer")).toHaveTextContent("8 free remaining");
    });

    it("shows karma cost when spells exceed free count", () => {
      // Use priority C for magician (5 free spells) and add 6
      const state = createBaseState({
        priorities: { magic: "C", metatype: "A", attributes: "B", skills: "D", resources: "E" },
        selections: {
          "magical-path": "magician",
          spells: [
            "manabolt",
            "powerbolt",
            "detect-life",
            "heal",
            "increase-attribute",
            "manabolt-2",
          ],
        },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      // 6 spells, 5 free = 1 beyond free * 5 karma = 5 karma
      const budget = screen.getByTestId("budget-Spells");
      expect(budget).toHaveTextContent("+5 via karma");
    });

    it("calculates karma on add when beyond free count", () => {
      // Priority C: 5 free spells, already have 5 selected
      const state = createBaseState({
        priorities: { magic: "C", metatype: "A", attributes: "B", skills: "D", resources: "E" },
        selections: {
          "magical-path": "magician",
          spells: ["manabolt", "powerbolt", "detect-life", "heal", "increase-attribute"],
        },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));
      fireEvent.click(screen.getByTestId("modal-add-manabolt"));

      // Now 6 spells, 5 free = 1 * 5 = 5 karma
      expect(mockUpdateState).toHaveBeenCalledWith(
        expect.objectContaining({
          budgets: expect.objectContaining({
            "karma-spent-spells": 5,
          }),
        })
      );
    });

    it("prevents adding spell when not enough karma", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "karma") return { total: 25, spent: 25, remaining: 0, label: "Karma" };
        return null;
      });

      // Already at free limit
      const state = createBaseState({
        priorities: { magic: "C", metatype: "A", attributes: "B", skills: "D", resources: "E" },
        selections: {
          "magical-path": "magician",
          spells: ["manabolt", "powerbolt", "detect-life", "heal", "increase-attribute"],
        },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));
      fireEvent.click(screen.getByTestId("modal-add-manabolt"));

      // Should not call updateState
      expect(mockUpdateState).not.toHaveBeenCalled();
    });
  });

  describe("validation status", () => {
    it("shows warning when magician has free spells but none selected", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", spells: [] },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });

    it("shows valid when spells reach or exceed free count", () => {
      // Priority A magician gets 10 free spells
      const spells = Array.from({ length: 10 }, (_, i) => `spell-${i}`);
      const state = createBaseState({
        selections: { "magical-path": "magician", spells },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows pending for non-spell paths", () => {
      const state = createBaseState({
        selections: { "magical-path": "mundane" },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });
  });

  describe("aspected mage with sorcery", () => {
    it("allows spell selection for sorcery aspected mages", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "aspected-mage",
          "aspected-mage-group": "sorcery",
          spells: [],
        },
      });

      render(<SpellsCard state={state} updateState={mockUpdateState} />);

      // Should show Add button, not blocked message
      expect(screen.getByText("Add")).toBeInTheDocument();
      expect(screen.queryByText(/No spells available/)).not.toBeInTheDocument();
    });
  });
});
