/**
 * FociCard Component Tests
 *
 * Tests the magical foci management card in character creation.
 * Tests include rendering, locked/unlocked states, empty states,
 * foci display, nuyen/karma budget tracking, validation status,
 * add/remove interactions, and summary footer.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FociCard } from "../FociCard";

// Mock contexts
vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

// Mock shared components
vi.mock("../../shared", () => ({
  CreationCard: ({
    title,
    description,
    status,
    children,
    headerAction,
  }: {
    title: string;
    description?: string;
    status: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      <div data-testid="card-description">{description}</div>
      {headerAction && <div data-testid="header-action">{headerAction}</div>}
      {children}
    </div>
  ),
  SummaryFooter: ({
    count,
    total,
    format,
    label,
  }: {
    count: number;
    total: number;
    format?: string;
    label?: string;
  }) => (
    <div
      data-testid="summary-footer"
      data-count={count}
      data-total={total}
      data-format={format}
      data-label={label}
    >
      {count} {label}(s) - {total}
    </div>
  ),
}));

// Mock FocusModal
vi.mock("../FocusModal", () => ({
  FocusModal: ({
    isOpen,
    onAdd,
    onClose,
  }: {
    isOpen: boolean;
    onAdd: (focus: unknown) => void;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="focus-modal">
        <button
          data-testid="modal-add-focus"
          onClick={() =>
            onAdd({
              catalogId: "power-focus",
              name: "Power Focus",
              type: "power",
              force: 3,
              cost: 54000,
              karmaToBond: 18,
              availability: 9,
            })
          }
        >
          Add Focus
        </button>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

import { useCreationBudgets } from "@/lib/contexts";

// =============================================================================
// FACTORY HELPERS
// =============================================================================

const makeFocus = (overrides = {}) => ({
  catalogId: "power-focus",
  name: "Power Focus",
  type: "power",
  force: 3,
  cost: 54000,
  karmaToBond: 18,
  availability: 9,
  bonded: false,
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
    "magical-path": "magician",
    foci: [],
    spells: [],
    ...overrides.selections,
  },
  budgets: {
    "karma-spent-foci": 0,
    ...overrides.budgets,
  },
  validation: { errors: [], warnings: [] },
  ...overrides,
});

// =============================================================================
// TESTS
// =============================================================================

describe("FociCard", () => {
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

    vi.mocked(useCreationBudgets).mockReturnValue({
      getBudget: mockGetBudget,
      budgets: {},
      updateSpent: vi.fn(),
      errors: [],
      warnings: [],
      isComplete: false,
      qualityModifiers: {
        karmaToNuyenCap: 10,
        knowledgeCostMultipliers: { academic: 1, street: 1, professional: 1, interests: 1 },
        languageCostMultiplier: 1,
        jackOfAllTrades: false,
      },
    } as unknown as ReturnType<typeof useCreationBudgets>);
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Foci");
    });

    it("shows default description when no foci selected", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent(
        "Optional magical enhancements"
      );
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("header-action")).toBeInTheDocument();
      expect(screen.getByText("Add")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // NON-MAGICAL CHARACTER (LOCKED STATE)
  // ===========================================================================

  describe("non-magical character", () => {
    it("shows locked state when no magical path", () => {
      const state = createBaseState({
        selections: { "magical-path": undefined, foci: [], spells: [] },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Foci are only available to magical characters")).toBeInTheDocument();
    });

    it("shows pending status when no magical path", () => {
      const state = createBaseState({
        selections: { "magical-path": undefined, foci: [], spells: [] },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows locked state for mundane path", () => {
      const state = createBaseState({
        selections: { "magical-path": "mundane", foci: [], spells: [] },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Foci are only available to magical characters")).toBeInTheDocument();
    });

    it("shows description about requiring magical tradition", () => {
      const state = createBaseState({
        selections: { "magical-path": undefined, foci: [], spells: [] },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent(
        "Requires magical tradition"
      );
    });
  });

  // ===========================================================================
  // EMPTY STATE
  // ===========================================================================

  describe("empty state", () => {
    it("shows empty state message when no foci purchased", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No foci purchased")).toBeInTheDocument();
    });

    it("does not show karma summary when no foci", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("Bonding Karma")).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // FOCI DISPLAY
  // ===========================================================================

  describe("foci display", () => {
    it("renders focus items when foci are selected", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus()],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Power Focus")).toBeInTheDocument();
    });

    it("displays focus force rating", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus({ force: 4 })],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("F4")).toBeInTheDocument();
    });

    it("displays focus cost with currency symbol", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus({ cost: 54000 })],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("54,000¥")).toBeInTheDocument();
    });

    it("displays bonding karma cost", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus({ karmaToBond: 18 })],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Bonding: 18 karma")).toBeInTheDocument();
    });

    it("renders multiple foci", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [
            makeFocus({ catalogId: "power-focus", name: "Power Focus" }),
            makeFocus({ catalogId: "weapon-focus", name: "Weapon Focus", type: "weapon" }),
          ],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Power Focus")).toBeInTheDocument();
      expect(screen.getByText("Weapon Focus")).toBeInTheDocument();
    });

    it("shows bonded status for bonded focus", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus({ bonded: true })],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Bonded")).toBeInTheDocument();
    });

    it("shows not bonded status for unbonded focus", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus({ bonded: false })],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Not Bonded")).toBeInTheDocument();
    });

    it("shows description with count and bonded karma", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus({ bonded: true, karmaToBond: 18 })],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent("1 focus, 18 karma bonded");
    });

    it("pluralizes foci in description", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [
            makeFocus({ bonded: false }),
            makeFocus({ catalogId: "weapon-focus", name: "Weapon Focus", bonded: false }),
          ],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-description")).toHaveTextContent("2 foci");
    });
  });

  // ===========================================================================
  // NUYEN / KARMA BUDGET TRACKING
  // ===========================================================================

  describe("budget tracking", () => {
    it("shows bonding karma summary when foci exist", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus({ karmaToBond: 18 })],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Bonding Karma")).toBeInTheDocument();
    });

    it("displays bonded vs total karma correctly", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [
            makeFocus({ bonded: true, karmaToBond: 18 }),
            makeFocus({
              catalogId: "weapon-focus",
              name: "Weapon Focus",
              bonded: false,
              karmaToBond: 12,
            }),
          ],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("18 / 30 karma")).toBeInTheDocument();
    });

    it("shows 0 bonded karma when no foci bonded", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus({ bonded: false, karmaToBond: 18 })],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("0 / 18 karma")).toBeInTheDocument();
    });

    it("calls getBudget for nuyen", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(mockGetBudget).toHaveBeenCalledWith("nuyen");
    });
  });

  // ===========================================================================
  // VALIDATION STATUS
  // ===========================================================================

  describe("validation status", () => {
    it("shows pending status when no foci selected", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when foci are selected", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus()],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });
  });

  // ===========================================================================
  // ADD / REMOVE INTERACTIONS
  // ===========================================================================

  describe("add interactions", () => {
    it("opens modal when Add button is clicked", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("focus-modal")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("Add"));

      expect(screen.getByTestId("focus-modal")).toBeInTheDocument();
    });

    it("adds focus via modal and updates state", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));
      fireEvent.click(screen.getByTestId("modal-add-focus"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          foci: [
            expect.objectContaining({
              catalogId: "power-focus",
              name: "Power Focus",
              bonded: false,
            }),
          ],
        }),
        budgets: expect.objectContaining({
          "karma-spent-foci": 0,
        }),
      });
    });

    it("closes modal when close is clicked", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));
      expect(screen.getByTestId("focus-modal")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("modal-close"));
      expect(screen.queryByTestId("focus-modal")).not.toBeInTheDocument();
    });
  });

  describe("remove interactions", () => {
    it("removes a focus when remove button is clicked", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus()],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      // The X button is the remove button inside FocusItem
      const removeButtons = screen.getAllByRole("button");
      // Find the remove button (has the X icon, appears after the focus item)
      const removeButton = removeButtons.find(
        (btn) => btn.querySelector(".lucide-x") !== null || btn.textContent === ""
      );
      // The remove button is the one that is not "Add", "Bonded"/"Not Bonded"
      const nonAddButtons = removeButtons.filter(
        (btn) => btn.textContent !== "Add" && !btn.textContent?.includes("Bonded")
      );
      fireEvent.click(nonAddButtons[0]);

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          foci: [],
        }),
        budgets: expect.objectContaining({
          "karma-spent-foci": 0,
        }),
      });
    });

    it("updates bonded karma when bonded focus is removed", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [
            makeFocus({ bonded: true, karmaToBond: 18 }),
            makeFocus({
              catalogId: "weapon-focus",
              name: "Weapon Focus",
              type: "weapon",
              bonded: true,
              karmaToBond: 12,
            }),
          ],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      // Remove the first focus (Power Focus) - find its remove button
      const removeButtons = screen
        .getAllByRole("button")
        .filter((btn) => btn.textContent !== "Add" && !btn.textContent?.includes("Bonded"));
      fireEvent.click(removeButtons[0]);

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          foci: [
            expect.objectContaining({
              catalogId: "weapon-focus",
              bonded: true,
            }),
          ],
        }),
        budgets: expect.objectContaining({
          "karma-spent-foci": 12,
        }),
      });
    });
  });

  describe("toggle bonded", () => {
    it("toggles bonded status and updates karma budget", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus({ bonded: false, karmaToBond: 18 })],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Not Bonded"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          foci: [expect.objectContaining({ bonded: true })],
        }),
        budgets: expect.objectContaining({
          "karma-spent-foci": 18,
        }),
      });
    });

    it("unbonds focus and updates karma budget", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [makeFocus({ bonded: true, karmaToBond: 18 })],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Bonded"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          foci: [expect.objectContaining({ bonded: false })],
        }),
        budgets: expect.objectContaining({
          "karma-spent-foci": 0,
        }),
      });
    });
  });

  // ===========================================================================
  // SUMMARY FOOTER
  // ===========================================================================

  describe("summary footer", () => {
    it("renders summary footer with zero count when empty", () => {
      const state = createBaseState();
      render(<FociCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-count", "0");
      expect(footer).toHaveAttribute("data-total", "0");
      expect(footer).toHaveAttribute("data-format", "currency");
      expect(footer).toHaveAttribute("data-label", "focus");
    });

    it("renders summary footer with correct totals", () => {
      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          foci: [
            makeFocus({ cost: 54000 }),
            makeFocus({ catalogId: "weapon-focus", name: "Weapon Focus", cost: 12000 }),
          ],
          spells: [],
        },
      });
      render(<FociCard state={state} updateState={mockUpdateState} />);

      const footer = screen.getByTestId("summary-footer");
      expect(footer).toHaveAttribute("data-count", "2");
      expect(footer).toHaveAttribute("data-total", "66000");
    });
  });

  // ===========================================================================
  // MAGICAL PATH VARIANTS
  // ===========================================================================

  describe("magical path variants", () => {
    it.each(["magician", "aspected-mage", "mystic-adept", "adept"])(
      "renders for %s path",
      (path) => {
        const state = createBaseState({
          selections: { "magical-path": path, foci: [], spells: [] },
        });
        render(<FociCard state={state} updateState={mockUpdateState} />);

        expect(screen.getByTestId("card-title")).toHaveTextContent("Foci");
        expect(
          screen.queryByText("Foci are only available to magical characters")
        ).not.toBeInTheDocument();
      }
    );
  });
});
