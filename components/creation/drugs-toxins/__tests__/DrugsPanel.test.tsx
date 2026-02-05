/**
 * DrugsPanel Component Tests
 *
 * Tests the drugs & toxins purchasing card in character creation.
 * Covers: locked state, empty state, rendering with items, and footer totals.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { DrugsPanel } from "../DrugsPanel";

// Mock the hooks used by DrugsPanel
vi.mock("@/lib/rules/RulesetContext", () => ({
  useDrugs: vi.fn(),
  useToxins: vi.fn(),
}));

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Lock: () => <span data-testid="lock-icon" />,
  Plus: () => <span data-testid="plus-icon" />,
  Pill: () => <span data-testid="pill-icon" />,
  FlaskConical: () => <span data-testid="flask-icon" />,
  ChevronDown: () => <span data-testid="chevron-down" />,
  ChevronRight: () => <span data-testid="chevron-right" />,
  X: () => <span data-testid="x-icon" />,
  Search: () => <span data-testid="search-icon" />,
  Check: () => <span data-testid="check-icon" />,
  AlertTriangle: () => <span data-testid="alert-icon" />,
  Package: () => <span data-testid="package-icon" />,
  Info: () => <span data-testid="info-icon" />,
}));

// Mock the shared components
vi.mock("@/components/creation/shared", () => ({
  CreationCard: ({
    children,
    title,
    status,
    headerAction,
  }: {
    children: React.ReactNode;
    title: string;
    description?: string;
    status?: string;
    headerAction?: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <h3>{title}</h3>
      {headerAction}
      {children}
    </div>
  ),
  EmptyState: ({ message }: { message: string }) => <div data-testid="empty-state">{message}</div>,
  SummaryFooter: ({ count, total }: { count: number; total: number; format?: string }) => (
    <div data-testid="summary-footer">
      {count} items • {total}¥
    </div>
  ),
  KarmaConversionModal: () => null,
  useKarmaConversionPrompt: () => ({
    modalState: { isOpen: false, itemName: "", itemCost: 0, karmaToConvert: 0 },
    closeModal: vi.fn(),
    confirmConversion: vi.fn(),
    checkPurchase: vi.fn(),
    promptConversion: vi.fn(),
    currentRemaining: 0,
    karmaAvailable: 0,
    currentKarmaConversion: 0,
    maxKarmaConversion: 0,
  }),
  LegalityWarnings: () => null,
}));

// Mock UI components
vi.mock("@/components/ui", () => ({
  InfoTooltip: () => null,
  BaseModalRoot: () => null,
  ModalFooter: () => null,
}));

// Mock child components that have their own hook dependencies
vi.mock("../DrugsPurchaseModal", () => ({
  DrugsPurchaseModal: () => null,
}));

vi.mock("../DrugRow", () => ({
  DrugRow: ({ drug }: { drug: { name: string } }) => <div data-testid="drug-row">{drug.name}</div>,
}));

vi.mock("../ToxinRow", () => ({
  ToxinRow: ({ toxin }: { toxin: { name: string } }) => (
    <div data-testid="toxin-row">{toxin.name}</div>
  ),
}));

import { useCreationBudgets } from "@/lib/contexts";
import type { CreationState } from "@/lib/types";

// =============================================================================
// TEST DATA
// =============================================================================

const mockBudgets = {
  getBudget: (id: string) => {
    if (id === "nuyen") return { total: 50000, spent: 10000, remaining: 40000 };
    if (id === "karma") return { total: 25, spent: 0, remaining: 25 };
    return undefined;
  },
  budgets: {
    nuyen: { total: 50000, spent: 10000, remaining: 40000 },
    karma: { total: 25, spent: 0, remaining: 25 },
  },
};

function makeState(overrides: Partial<CreationState> = {}): CreationState {
  return {
    editionCode: "sr5",
    method: "priority",
    step: "sheet",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    selections: {},
    priorities: {
      metatype: "A",
      attributes: "B",
      magic: "C",
      skills: "D",
      resources: "E",
    },
    budgets: {},
    ...overrides,
  } as CreationState;
}

// =============================================================================
// TESTS
// =============================================================================

describe("DrugsPanel", () => {
  beforeEach(() => {
    (useCreationBudgets as Mock).mockReturnValue(mockBudgets);
  });

  it("shows locked state when priorities not set", () => {
    const state = makeState({ priorities: undefined });
    const updateState = vi.fn();

    render(<DrugsPanel state={state} updateState={updateState} />);

    expect(screen.getByText("Set priorities first")).toBeDefined();
  });

  it("shows empty state with no items", () => {
    const state = makeState();
    const updateState = vi.fn();

    render(<DrugsPanel state={state} updateState={updateState} />);

    expect(screen.getByTestId("empty-state")).toBeDefined();
    expect(screen.getByText("No drugs or toxins purchased")).toBeDefined();
  });

  it("renders drug rows when drugs are selected", () => {
    const state = makeState({
      selections: {
        drugs: [
          {
            id: "bliss-123",
            name: "Bliss",
            category: "drug",
            cost: 15,
            quantity: 3,
            availability: 3,
            legality: "forbidden" as const,
          },
          {
            id: "jazz-456",
            name: "Jazz",
            category: "drug",
            cost: 75,
            quantity: 1,
            availability: 2,
            legality: "restricted" as const,
          },
        ],
      },
    });
    const updateState = vi.fn();

    render(<DrugsPanel state={state} updateState={updateState} />);

    expect(screen.getByText("Bliss")).toBeDefined();
    expect(screen.getByText("Jazz")).toBeDefined();
    expect(screen.getByText(/Drugs \(2\)/)).toBeDefined();
  });

  it("renders toxin rows when toxins are selected", () => {
    const state = makeState({
      selections: {
        toxins: [
          {
            id: "narcoject-789",
            name: "Narcoject",
            category: "toxin",
            cost: 50,
            quantity: 2,
            availability: 8,
            legality: "restricted" as const,
          },
        ],
      },
    });
    const updateState = vi.fn();

    render(<DrugsPanel state={state} updateState={updateState} />);

    expect(screen.getByText("Narcoject")).toBeDefined();
    expect(screen.getByText(/Toxins \(1\)/)).toBeDefined();
  });

  it("shows correct totals in footer", () => {
    const state = makeState({
      selections: {
        drugs: [{ id: "bliss-1", name: "Bliss", category: "drug", cost: 15, quantity: 5 }],
        toxins: [
          { id: "narcoject-1", name: "Narcoject", category: "toxin", cost: 50, quantity: 2 },
        ],
      },
    });
    const updateState = vi.fn();

    render(<DrugsPanel state={state} updateState={updateState} />);

    // 2 items total (1 drug + 1 toxin), cost = 75 + 100 = 175
    expect(screen.getByTestId("summary-footer")).toBeDefined();
    expect(screen.getByText("2 items • 175¥")).toBeDefined();
  });

  it("has Add button in header when priorities are set", () => {
    const state = makeState();
    const updateState = vi.fn();

    render(<DrugsPanel state={state} updateState={updateState} />);

    expect(screen.getByText("Add")).toBeDefined();
  });
});
