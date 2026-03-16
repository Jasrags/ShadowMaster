/**
 * QualitiesCard Component Tests
 *
 * Tests the quality selection card in character creation.
 * Tests include rendering, selected qualities display, karma tracking,
 * validation status, add/remove quality, and summary footer.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QualitiesCard } from "../QualitiesCard";

// Mock @/lib/rules
vi.mock("@/lib/rules", () => ({
  useQualities: vi.fn(() => ({
    positive: [],
    negative: [],
  })),
  useSkills: vi.fn(() => ({
    skillGroups: [],
    activeSkills: [],
  })),
  useInfected: vi.fn(() => null),
}));

// Mock @/lib/contexts
const mockGetBudget = vi.fn(() => ({ total: 25, spent: 0, remaining: 25 }));
vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(() => ({
    getBudget: mockGetBudget,
  })),
}));

// Mock shared CreationCard, BudgetIndicator, SummaryFooter
vi.mock("../../shared", () => ({
  CreationCard: ({
    title,
    status,
    headerAction,
    children,
  }: {
    title: string;
    status: string;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      <div data-testid="header-action">{headerAction}</div>
      {children}
    </div>
  ),
  BudgetIndicator: ({
    label,
    spent,
    total,
    variant,
  }: {
    label: string;
    spent: number;
    total: number;
    variant: string;
  }) => (
    <div data-testid={`budget-${variant}`} data-spent={spent} data-total={total}>
      {label}: {spent}/{total}
    </div>
  ),
  SummaryFooter: ({ count, total, label }: { count: number; total: string; label: string }) => (
    <div data-testid="summary-footer">
      {count} {count !== 1 ? `${label.replace(/y$/, "ie")}s` : label} | {total}
    </div>
  ),
}));

// Mock child components
vi.mock("../SelectedQualityCard", () => ({
  SelectedQualityCard: ({
    quality,
    isPositive,
    cost,
    onRemove,
  }: {
    quality: { id: string; name: string };
    isPositive: boolean;
    cost: number;
    onRemove: () => void;
  }) => (
    <div data-testid={`selected-quality-${quality.id}`} data-positive={isPositive} data-cost={cost}>
      <span>{quality.name}</span>
      <button data-testid={`remove-${quality.id}`} onClick={onRemove}>
        Remove
      </button>
    </div>
  ),
}));

// Capture the onAdd callback from the modal mock
let capturedOnAdd:
  | ((id: string, isPositive: boolean, spec?: string, level?: number) => void)
  | null = null;

vi.mock("../QualitySelectionModal", () => ({
  QualitySelectionModal: ({
    isOpen,
    onAdd,
  }: {
    isOpen: boolean;
    onAdd: (id: string, isPositive: boolean, spec?: string, level?: number) => void;
  }) => {
    capturedOnAdd = onAdd;
    return isOpen ? <div data-testid="quality-modal">Modal Open</div> : null;
  },
}));

// Mock budget-modifiers
vi.mock("@/lib/rules/qualities/budget-modifiers", () => ({
  MADE_MAN: "made-man",
  SENSEI: "sensei",
  RESTRICTED_GEAR: "restricted-gear",
  buildFreeContact: vi.fn(() => ({
    name: "Free Contact",
    connection: 4,
    loyalty: 2,
    type: "shadow",
    qualityId: "made-man",
  })),
}));

// Mock @/lib/types/ratings
vi.mock("@/lib/types/ratings", () => ({
  hasUnifiedRatings: vi.fn(() => false),
  getRatingTableValue: vi.fn(() => null),
}));

import { useQualities, useSkills } from "@/lib/rules";

// Factory to create test state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 1,
  priorities: {},
  selections: {
    positiveQualities: [],
    negativeQualities: [],
    skills: {},
    skillGroups: {},
    contacts: [],
    ...overrides.selections,
  },
  budgets: {},
  validation: { errors: [], warnings: [] },
  ...overrides,
});

// Test quality data
const mockPositiveQualities = [
  { id: "toughness", name: "Toughness", karmaCost: 9, category: "physical" },
  { id: "ambidextrous", name: "Ambidextrous", karmaCost: 4, category: "physical" },
  { id: "quick-healer", name: "Quick Healer", karmaCost: 3, category: "physical" },
];

const mockNegativeQualities = [
  { id: "bad-luck", name: "Bad Luck", karmaBonus: 12, category: "mental" },
  { id: "gremlins", name: "Gremlins", karmaBonus: 4, category: "physical" },
  { id: "addiction-mild", name: "Addiction (Mild)", karmaBonus: 4, category: "mental" },
];

describe("QualitiesCard", () => {
  let mockUpdateState: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnAdd = null;
    mockUpdateState = vi.fn();
    mockGetBudget.mockReturnValue({ total: 25, spent: 0, remaining: 25 });
    (useQualities as Mock).mockReturnValue({
      positive: mockPositiveQualities,
      negative: mockNegativeQualities,
    });
    (useSkills as Mock).mockReturnValue({
      skillGroups: [],
      activeSkills: [],
    });
  });

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Qualities");
    });

    it("renders empty state messages when no qualities selected", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No positive qualities selected")).toBeInTheDocument();
      expect(screen.getByText("No negative qualities selected")).toBeInTheDocument();
    });

    it("renders budget indicators for both quality types", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("budget-positive")).toBeInTheDocument();
      expect(screen.getByTestId("budget-negative")).toBeInTheDocument();
    });

    it("renders budget indicators with correct totals", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("budget-positive")).toHaveAttribute("data-total", "25");
      expect(screen.getByTestId("budget-negative")).toHaveAttribute("data-total", "25");
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Add")).toBeInTheDocument();
    });
  });

  describe("selected qualities display", () => {
    it("renders selected positive qualities", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [{ id: "toughness" }, { id: "ambidextrous" }],
          negativeQualities: [],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("selected-quality-toughness")).toBeInTheDocument();
      expect(screen.getByTestId("selected-quality-ambidextrous")).toBeInTheDocument();
      expect(screen.getByText("Toughness")).toBeInTheDocument();
      expect(screen.getByText("Ambidextrous")).toBeInTheDocument();
    });

    it("renders selected negative qualities", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [],
          negativeQualities: [{ id: "bad-luck" }],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("selected-quality-bad-luck")).toBeInTheDocument();
      expect(screen.getByText("Bad Luck")).toBeInTheDocument();
    });

    it("passes correct cost to SelectedQualityCard", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [{ id: "toughness" }],
          negativeQualities: [],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("selected-quality-toughness")).toHaveAttribute("data-cost", "9");
    });

    it("hides empty state when qualities are selected", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [{ id: "toughness" }],
          negativeQualities: [{ id: "bad-luck" }],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("No positive qualities selected")).not.toBeInTheDocument();
      expect(screen.queryByText("No negative qualities selected")).not.toBeInTheDocument();
    });
  });

  describe("karma tracking", () => {
    it("tracks positive karma spent in budget indicator", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [{ id: "toughness" }, { id: "ambidextrous" }],
          negativeQualities: [],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      // toughness=9 + ambidextrous=4 = 13
      expect(screen.getByTestId("budget-positive")).toHaveAttribute("data-spent", "13");
    });

    it("tracks negative karma gained in budget indicator", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [],
          negativeQualities: [{ id: "bad-luck" }, { id: "gremlins" }],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      // bad-luck=12 + gremlins=4 = 16
      expect(screen.getByTestId("budget-negative")).toHaveAttribute("data-spent", "16");
    });

    it("shows correct karma balance in summary footer", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [{ id: "toughness" }],
          negativeQualities: [{ id: "bad-luck" }],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      // balance = 25 (starting) + 12 (negative) - 9 (positive) = 28
      expect(screen.getByTestId("summary-footer")).toHaveTextContent("28 karma");
    });
  });

  describe("validation status", () => {
    it("shows pending status when no qualities selected", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when qualities are selected within budget", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [{ id: "ambidextrous" }],
          negativeQualities: [],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows error status when positive karma exceeds max", () => {
      // Create qualities that exceed 25 karma
      (useQualities as Mock).mockReturnValue({
        positive: [
          { id: "q1", name: "Quality 1", karmaCost: 14 },
          { id: "q2", name: "Quality 2", karmaCost: 14 },
        ],
        negative: mockNegativeQualities,
      });

      const state = createBaseState({
        selections: {
          positiveQualities: [{ id: "q1" }, { id: "q2" }],
          negativeQualities: [],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });

    it("shows error status when negative karma exceeds max", () => {
      (useQualities as Mock).mockReturnValue({
        positive: mockPositiveQualities,
        negative: [
          { id: "n1", name: "Negative 1", karmaBonus: 14 },
          { id: "n2", name: "Negative 2", karmaBonus: 14 },
        ],
      });

      const state = createBaseState({
        selections: {
          positiveQualities: [],
          negativeQualities: [{ id: "n1" }, { id: "n2" }],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });
  });

  describe("add quality via modal", () => {
    it("opens modal when Add button is clicked", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("quality-modal")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("Add"));

      expect(screen.getByTestId("quality-modal")).toBeInTheDocument();
    });

    it("adds positive quality via modal callback", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      // Open modal to capture onAdd
      fireEvent.click(screen.getByText("Add"));

      expect(capturedOnAdd).not.toBeNull();
      capturedOnAdd!("ambidextrous", true);

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          positiveQualities: [{ id: "ambidextrous", karma: 4 }],
          negativeQualities: [],
        }),
      });
    });

    it("adds negative quality via modal callback", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));

      capturedOnAdd!("gremlins", false);

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          positiveQualities: [],
          negativeQualities: [{ id: "gremlins", karma: 4 }],
        }),
      });
    });

    it("adds quality with specification", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByText("Add"));

      capturedOnAdd!("ambidextrous", true, "Combat");

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          positiveQualities: [{ id: "ambidextrous", specification: "Combat", karma: 4 }],
        }),
      });
    });
  });

  describe("remove quality", () => {
    it("removes a positive quality and updates state", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [{ id: "toughness" }, { id: "ambidextrous" }],
          negativeQualities: [],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("remove-toughness"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          positiveQualities: [{ id: "ambidextrous" }],
          negativeQualities: [],
        }),
      });
    });

    it("removes a negative quality and updates state", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [],
          negativeQualities: [{ id: "bad-luck" }, { id: "gremlins" }],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByTestId("remove-bad-luck"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          positiveQualities: [],
          negativeQualities: [{ id: "gremlins" }],
        }),
      });
    });
  });

  describe("summary footer", () => {
    it("shows count and karma balance for no selections", () => {
      const state = createBaseState();
      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("summary-footer")).toHaveTextContent("0 qualities");
      expect(screen.getByTestId("summary-footer")).toHaveTextContent("25 karma");
    });

    it("shows count and karma balance with selections", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [{ id: "toughness" }],
          negativeQualities: [{ id: "bad-luck" }],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      // 2 qualities total
      expect(screen.getByTestId("summary-footer")).toHaveTextContent("2 qualities");
      // balance = 25 + 12 - 9 = 28
      expect(screen.getByTestId("summary-footer")).toHaveTextContent("28 karma");
    });

    it("shows singular label for single quality", () => {
      const state = createBaseState({
        selections: {
          positiveQualities: [{ id: "ambidextrous" }],
          negativeQualities: [],
        },
      });

      render(<QualitiesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("summary-footer")).toHaveTextContent("1 quality |");
    });
  });
});
