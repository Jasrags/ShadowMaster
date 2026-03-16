/**
 * AdeptPowersCard Component Tests
 *
 * Tests the adept power selection card in character creation.
 * Tests include rendering, locked states, power add/remove,
 * level adjustment, mystic adept allocation, karma purchase,
 * validation status, and budget tracking.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdeptPowersCard } from "../AdeptPowersCard";

// Mock hooks
vi.mock("@/lib/rules", () => ({
  useAdeptPowers: vi.fn(),
  usePriorityTable: vi.fn(),
}));

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
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
      <div data-testid="header-action">{headerAction}</div>
      {children}
    </div>
  ),
  BudgetIndicator: ({
    label,
    spent,
    total,
    tooltip,
  }: {
    label: string;
    spent: number;
    total: number;
    tooltip?: string;
  }) => (
    <div
      data-testid="budget-indicator"
      data-label={label}
      data-spent={spent}
      data-total={total}
      data-tooltip={tooltip}
    >
      {spent}/{total} {label}
    </div>
  ),
  SummaryFooter: ({ count, total, label }: { count: number; total: string; label: string }) => (
    <div data-testid="summary-footer" data-count={count} data-total={total} data-label={label} />
  ),
}));

// Mock adept-powers sub-components
vi.mock("../adept-powers", () => ({
  AdeptPowerModal: ({
    isOpen,
    onAdd,
    ppRemaining,
  }: {
    isOpen: boolean;
    onAdd: (powerId: string, level: number, spec?: string) => void;
    ppRemaining: number;
  }) =>
    isOpen ? (
      <div data-testid="adept-power-modal" data-pp-remaining={ppRemaining}>
        <button data-testid="modal-add-killing-hands" onClick={() => onAdd("killing-hands", 1)}>
          Add Killing Hands
        </button>
        <button
          data-testid="modal-add-improved-reflexes"
          onClick={() => onAdd("improved-reflexes", 1)}
        >
          Add Improved Reflexes
        </button>
        <button
          data-testid="modal-add-improved-ability"
          onClick={() => onAdd("improved-ability", 1, "unarmed-combat")}
        >
          Add Improved Ability
        </button>
      </div>
    ) : null,
  AdeptPowerListItem: ({
    displayName,
    powerPointCost,
    isLeveled,
    level,
    canIncrease,
    canDecrease,
    onIncrease,
    onDecrease,
    needsSpec,
    specification,
    onRemove,
  }: {
    displayName: string;
    powerPointCost: number;
    isLeveled: boolean;
    level?: number;
    canIncrease: boolean;
    canDecrease: boolean;
    onIncrease: () => void;
    onDecrease: () => void;
    needsSpec: boolean;
    specification?: string;
    onRemove: () => void;
  }) => (
    <div data-testid={`power-item-${displayName}`} data-cost={powerPointCost}>
      <span>{displayName}</span>
      {isLeveled && <span data-testid={`power-level-${displayName}`}>Level {level}</span>}
      {needsSpec && <span data-testid={`power-needs-spec-${displayName}`}>Needs Spec</span>}
      {specification && <span data-testid={`power-spec-${displayName}`}>{specification}</span>}
      {canIncrease && (
        <button data-testid={`power-increase-${displayName}`} onClick={onIncrease}>
          +
        </button>
      )}
      {canDecrease && (
        <button data-testid={`power-decrease-${displayName}`} onClick={onDecrease}>
          -
        </button>
      )}
      <button data-testid={`power-remove-${displayName}`} onClick={onRemove}>
        Remove
      </button>
    </div>
  ),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Lock: ({ className }: { className?: string }) => (
    <span data-testid="icon-lock" className={className} />
  ),
  Plus: ({ className }: { className?: string }) => (
    <span data-testid="icon-plus" className={className} />
  ),
  AlertTriangle: ({ className }: { className?: string }) => (
    <span data-testid="icon-alert" className={className} />
  ),
}));

// Mock constants
vi.mock("@/lib/constants/magic", () => ({
  ACTIVATION_ORDER: ["free", "simple", "complex", "interrupt"],
  ACTIVATION_LABELS: {
    free: "Free Action",
    simple: "Simple Action",
    complex: "Complex Action",
    interrupt: "Interrupt",
  } as Record<string, string>,
}));

import { useAdeptPowers, usePriorityTable } from "@/lib/rules";
import { useCreationBudgets } from "@/lib/contexts";

// Mock catalog data
const mockAdeptPowers = [
  {
    id: "killing-hands",
    name: "Killing Hands",
    powerPointCost: 0.5,
    hasRating: false,
    activation: "free",
  },
  {
    id: "improved-reflexes",
    name: "Improved Reflexes",
    hasRating: true,
    maxRating: 3,
    activation: "free",
    ratings: {
      1: { powerPointCost: 1.5 },
      2: { powerPointCost: 2.5 },
      3: { powerPointCost: 3.5 },
    },
  },
  {
    id: "improved-ability",
    name: "Improved Ability",
    hasRating: true,
    maxRating: 6,
    requiresSkill: true,
    validSkills: ["unarmed-combat", "blades"],
    activation: "free",
    ratings: {
      1: { powerPointCost: 0.5 },
      2: { powerPointCost: 1.0 },
    },
  },
  {
    id: "critical-strike",
    name: "Critical Strike",
    powerPointCost: 0.5,
    hasRating: false,
    requiresSkill: true,
    validSkills: ["unarmed-combat"],
    activation: "free",
  },
];

const mockPriorityTable = {
  table: {
    A: {
      magic: {
        options: [
          { path: "adept", magicRating: 6 },
          { path: "mystic-adept", magicRating: 6 },
        ],
      },
    },
    B: {
      magic: {
        options: [{ path: "adept", magicRating: 4 }],
      },
    },
  },
};

const createMockGetBudget = (karmaRemaining = 25) => {
  return vi.fn((budgetId: string) => {
    if (budgetId === "karma")
      return { total: 25, spent: 25 - karmaRemaining, remaining: karmaRemaining, label: "Karma" };
    return null;
  });
};

// Factory to create test state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 1,
  priorities: { magic: "A" },
  selections: {
    "magical-path": "adept",
    adeptPowers: [],
    ...overrides.selections,
  },
  budgets: {
    "power-points-spent": 0,
    "karma-spent-power-points": 0,
    ...overrides.budgets,
  },
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("AdeptPowersCard", () => {
  let mockUpdateState: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();

    (useAdeptPowers as Mock).mockReturnValue(mockAdeptPowers);
    (usePriorityTable as Mock).mockReturnValue(mockPriorityTable);
    (useCreationBudgets as Mock).mockReturnValue({
      getBudget: createMockGetBudget(),
      budgets: {},
      updateSpent: vi.fn(),
      errors: [],
      warnings: [],
      isValid: true,
      canFinalize: false,
      qualityModifiers: {},
    });
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Adept Powers");
    });

    it("shows lock state for non-adept paths", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", adeptPowers: [] },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/not an Adept or Mystic Adept/)).toBeInTheDocument();
      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows lock state for mundane path", () => {
      const state = createBaseState({
        selections: { "magical-path": "mundane", adeptPowers: [] },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/not an Adept or Mystic Adept/)).toBeInTheDocument();
    });

    it("shows Add button for adept", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Add")).toBeInTheDocument();
    });

    it("shows empty state when no powers selected", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No adept powers selected")).toBeInTheDocument();
    });

    it("shows budget indicator with power points", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      const budget = screen.getByTestId("budget-indicator");
      expect(budget).toHaveAttribute("data-label", "Power Points");
      expect(budget).toHaveAttribute("data-total", "6");
    });

    it("shows selected powers", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "adept",
          adeptPowers: [
            {
              id: "killing-hands-1",
              catalogId: "killing-hands",
              name: "Killing Hands",
              powerPointCost: 0.5,
            },
          ],
        },
        budgets: { "power-points-spent": 0.5 },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("power-item-Killing Hands")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  describe("validation status", () => {
    it("returns pending for non-adept path", () => {
      const state = createBaseState({
        selections: { "magical-path": "magician", adeptPowers: [] },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("returns warning when adept has PP budget but no powers", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });

    it("returns valid when powers are selected", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "adept",
          adeptPowers: [
            {
              id: "killing-hands-1",
              catalogId: "killing-hands",
              name: "Killing Hands",
              powerPointCost: 0.5,
            },
          ],
        },
        budgets: { "power-points-spent": 0.5 },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("returns warning when powers have missing specifications", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "adept",
          adeptPowers: [
            {
              id: "improved-ability-1",
              catalogId: "improved-ability",
              name: "Improved Ability",
              rating: 1,
              powerPointCost: 0.5,
              // No specification - should trigger warning
            },
          ],
        },
        budgets: { "power-points-spent": 0.5 },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });
  });

  // ===========================================================================
  // ADD/REMOVE INTERACTIONS
  // ===========================================================================

  describe("add/remove interactions", () => {
    it("opens modal when Add button clicked", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("adept-power-modal")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("Add"));

      expect(screen.getByTestId("adept-power-modal")).toBeInTheDocument();
    });

    it("adds power via modal callback", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));
      fireEvent.click(screen.getByTestId("modal-add-killing-hands"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          adeptPowers: expect.arrayContaining([
            expect.objectContaining({
              catalogId: "killing-hands",
              name: "Killing Hands",
              powerPointCost: 0.5,
            }),
          ]),
        }),
        budgets: expect.objectContaining({
          "power-points-spent": 0.5,
        }),
      });
    });

    it("adds rated power with correct cost", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));
      fireEvent.click(screen.getByTestId("modal-add-improved-reflexes"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          adeptPowers: expect.arrayContaining([
            expect.objectContaining({
              catalogId: "improved-reflexes",
              name: "Improved Reflexes",
              rating: 1,
              powerPointCost: 1.5,
            }),
          ]),
        }),
        budgets: expect.objectContaining({
          "power-points-spent": 1.5,
        }),
      });
    });

    it("adds power with specification", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));
      fireEvent.click(screen.getByTestId("modal-add-improved-ability"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          adeptPowers: expect.arrayContaining([
            expect.objectContaining({
              catalogId: "improved-ability",
              specification: "unarmed-combat",
            }),
          ]),
        }),
        budgets: expect.any(Object),
      });
    });

    it("removes power when remove button clicked", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "adept",
          adeptPowers: [
            {
              id: "killing-hands-1",
              catalogId: "killing-hands",
              name: "Killing Hands",
              powerPointCost: 0.5,
            },
          ],
        },
        budgets: { "power-points-spent": 0.5 },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("power-remove-Killing Hands"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          adeptPowers: [],
        }),
        budgets: expect.objectContaining({
          "power-points-spent": 0,
        }),
      });
    });

    it("increases power level", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "adept",
          adeptPowers: [
            {
              id: "improved-reflexes-1",
              catalogId: "improved-reflexes",
              name: "Improved Reflexes",
              rating: 1,
              powerPointCost: 1.5,
            },
          ],
        },
        budgets: { "power-points-spent": 1.5 },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("power-increase-Improved Reflexes"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          adeptPowers: [
            expect.objectContaining({
              rating: 2,
              powerPointCost: 2.5,
            }),
          ],
        }),
        budgets: expect.objectContaining({
          "power-points-spent": 2.5,
        }),
      });
    });

    it("decreases power level", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "adept",
          adeptPowers: [
            {
              id: "improved-reflexes-1",
              catalogId: "improved-reflexes",
              name: "Improved Reflexes",
              rating: 2,
              powerPointCost: 2.5,
            },
          ],
        },
        budgets: { "power-points-spent": 2.5 },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("power-decrease-Improved Reflexes"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          adeptPowers: [
            expect.objectContaining({
              rating: 1,
              powerPointCost: 1.5,
            }),
          ],
        }),
        budgets: expect.objectContaining({
          "power-points-spent": 1.5,
        }),
      });
    });
  });

  // ===========================================================================
  // MYSTIC ADEPT
  // ===========================================================================

  describe("mystic adept", () => {
    it("shows PP allocation slider for mystic adept", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "mystic-adept",
          adeptPowers: [],
        },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("PP Allocation")).toBeInTheDocument();
      expect(screen.getByText("Split Magic between spells and powers")).toBeInTheDocument();
    });

    it("does not show allocation slider for pure adept", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("PP Allocation")).not.toBeInTheDocument();
    });

    it("shows karma purchase button for mystic adept with available karma", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "mystic-adept",
          "power-points-allocation": 3,
          adeptPowers: [],
        },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Purchase \+1 PP/)).toBeInTheDocument();
    });

    it("updates PP allocation on slider change", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "mystic-adept",
          "power-points-allocation": 2,
          adeptPowers: [],
        },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      const slider = screen.getByRole("slider");
      fireEvent.change(slider, { target: { value: "4" } });

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          "power-points-allocation": 4,
        }),
      });
    });

    it("purchases PP with karma when button clicked", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "mystic-adept",
          "power-points-allocation": 3,
          adeptPowers: [],
        },
        budgets: { "karma-spent-power-points": 0, "power-points-spent": 0 },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText(/Purchase \+1 PP/));

      expect(mockUpdateState).toHaveBeenCalledWith({
        budgets: expect.objectContaining({
          "karma-spent-power-points": 5,
        }),
      });
    });
  });

  // ===========================================================================
  // BUDGET TRACKING
  // ===========================================================================

  describe("budget tracking", () => {
    it("shows correct PP total for adept", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      const budget = screen.getByTestId("budget-indicator");
      expect(budget).toHaveAttribute("data-total", "6"); // magicRating from priority A
    });

    it("shows correct PP spent", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "adept",
          adeptPowers: [
            {
              id: "killing-hands-1",
              catalogId: "killing-hands",
              name: "Killing Hands",
              powerPointCost: 0.5,
            },
          ],
        },
        budgets: { "power-points-spent": 0.5 },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      const budget = screen.getByTestId("budget-indicator");
      expect(budget).toHaveAttribute("data-spent", "0.5");
    });

    it("passes PP remaining to modal", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "adept",
          adeptPowers: [
            {
              id: "killing-hands-1",
              catalogId: "killing-hands",
              name: "Killing Hands",
              powerPointCost: 0.5,
            },
            {
              id: "improved-reflexes-1",
              catalogId: "improved-reflexes",
              name: "Improved Reflexes",
              rating: 1,
              powerPointCost: 1.5,
            },
          ],
        },
        budgets: { "power-points-spent": 2 },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));

      const modal = screen.getByTestId("adept-power-modal");
      expect(modal).toHaveAttribute("data-pp-remaining", "4");
    });
  });

  // ===========================================================================
  // SUMMARY FOOTER
  // ===========================================================================

  describe("summary footer", () => {
    it("shows zero count when no powers selected", () => {
      const state = createBaseState();
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-count", "0");
      expect(footer).toHaveAttribute("data-total", "0.00 PP");
    });

    it("shows correct count and total for selected powers", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "adept",
          adeptPowers: [
            {
              id: "killing-hands-1",
              catalogId: "killing-hands",
              name: "Killing Hands",
              powerPointCost: 0.5,
            },
            {
              id: "improved-reflexes-1",
              catalogId: "improved-reflexes",
              name: "Improved Reflexes",
              rating: 1,
              powerPointCost: 1.5,
            },
          ],
        },
        budgets: { "power-points-spent": 2 },
      });
      render(<AdeptPowersCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-count", "2");
      expect(footer).toHaveAttribute("data-total", "2.00 PP");
    });
  });
});
