/**
 * GearPanel Component Tests
 *
 * Tests the general gear selection card in character creation.
 * Tests include locked state, nuyen budget bar, add/remove gear,
 * purchase callbacks, karma conversion, category grouping,
 * validation status, and footer summary.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GearPanel } from "../GearPanel";
import type { CreationState, GearItem } from "@/lib/types";
import type { GearItemData } from "@/lib/rules/RulesetContext";

// =============================================================================
// MOCK STATE FOR KARMA CONVERSION
// =============================================================================

let mockCheckPurchase: Mock;
let mockPromptConversion: Mock;

// =============================================================================
// MOCKS
// =============================================================================

vi.mock("@/lib/rules/RulesetContext", () => ({
  useGear: vi.fn(() => null),
  useCreationMethod: vi.fn(() => ({ type: "priority", name: "Priority" })),
}));

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

vi.mock("@/lib/types/ratings", () => ({
  hasUnifiedRatings: vi.fn(() => false),
  getRatingTableValue: vi.fn(() => null),
}));

vi.mock("@/lib/rules/gear/catalog-helpers", () => ({
  GEAR_BROWSABLE_KEYS: [
    "electronics",
    "tools",
    "survival",
    "medical",
    "security",
    "explosives",
    "miscellaneous",
    "rfidTags",
  ],
  GEAR_BROWSABLE_LABELS: {
    electronics: "Electronics",
    tools: "Tools",
    survival: "Survival",
    medical: "Medical",
    security: "Security",
    explosives: "Explosives",
    miscellaneous: "Miscellaneous",
    rfidTags: "RFID Tags",
  },
  mapItemCategoryToKey: vi.fn((category: string) => {
    const normalized = (category ?? "").toLowerCase();
    if (normalized === "electronics") return "electronics";
    if (normalized === "tools") return "tools";
    return "miscellaneous";
  }),
}));

vi.mock("../../shared", () => ({
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
  EmptyState: ({ message }: { message: string }) => <div data-testid="empty-state">{message}</div>,
  SummaryFooter: ({ count, total }: { count: number; total: number }) => (
    <div data-testid="summary-footer">
      {count} item{count !== 1 ? "s" : ""} — {total.toLocaleString()}¥
    </div>
  ),
  KarmaConversionModal: () => null,
  useKarmaConversionPrompt: () => ({
    checkPurchase: mockCheckPurchase,
    promptConversion: mockPromptConversion,
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

vi.mock("../GearRow", () => ({
  GearRow: ({ gear, onRemove }: { gear: GearItem; onRemove: (id: string) => void }) => (
    <div data-testid={`gear-item-${gear.id ?? gear.catalogId}`}>
      <span>{gear.name}</span>
      <span data-testid="gear-cost">{gear.cost}¥</span>
      <button aria-label={`Remove ${gear.name}`} onClick={() => onRemove(gear.id ?? "")}>
        Remove
      </button>
    </div>
  ),
}));

vi.mock("../GearPurchaseModal", () => ({
  GearPurchaseModal: ({
    isOpen,
    onPurchase,
  }: {
    isOpen: boolean;
    onPurchase: (data: GearItemData, rating?: number, quantity?: number) => void;
  }) =>
    isOpen ? (
      <div data-testid="gear-purchase-modal">
        <button
          data-testid="buy-gear"
          onClick={() =>
            onPurchase({
              id: "flashlight",
              name: "Flashlight",
              category: "electronics",
              cost: 25,
              availability: 2,
            } as GearItemData)
          }
        >
          Buy Gear
        </button>
      </div>
    ) : null,
}));

vi.mock("../GearModificationModal", () => ({
  GearModificationModal: () => null,
}));

vi.mock("@/components/ui", () => ({
  InfoTooltip: () => null,
}));

import { useCreationBudgets } from "@/lib/contexts";
import { useCreationMethod } from "@/lib/rules/RulesetContext";

// =============================================================================
// FACTORIES
// =============================================================================

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

const makeGear = (overrides: Partial<GearItem> = {}): GearItem =>
  ({
    id: "flashlight-1",
    catalogId: "flashlight",
    name: "Flashlight",
    category: "electronics",
    cost: 25,
    availability: 2,
    quantity: 1,
    capacityUsed: 0,
    modifications: [],
    ...overrides,
  }) as GearItem;

const createBaseState = (overrides: DeepPartial<CreationState> = {}): CreationState =>
  ({
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
      gear: [],
      weapons: [],
      armor: [],
      foci: [],
      cyberware: [],
      bioware: [],
      commlinks: [],
      cyberdecks: [],
      software: [],
      ...overrides.selections,
    },
    budgets: {
      ...overrides.budgets,
    },
    validation: { errors: [], warnings: [] },
    ...overrides,
  }) as unknown as CreationState;

// =============================================================================
// TESTS
// =============================================================================

describe("GearPanel", () => {
  let mockUpdateState: Mock;
  let mockGetBudget: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateState = vi.fn();
    mockCheckPurchase = vi.fn(() => null);
    mockPromptConversion = vi.fn();
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
  // LOCKED STATE
  // ===========================================================================

  describe("locked state", () => {
    it("shows locked state when priorities not set", () => {
      const state = createBaseState({ priorities: {} });
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Set priorities first")).toBeInTheDocument();
    });

    it("shows pending status when locked", () => {
      const state = createBaseState({ priorities: {} });
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("does not show locked state for point-buy creation method", () => {
      vi.mocked(useCreationMethod).mockReturnValue({
        type: "point-buy",
        name: "Point Buy",
      } as ReturnType<typeof useCreationMethod>);

      const state = createBaseState({ priorities: {} });
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("Set priorities first")).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Gear");
    });

    it("renders nuyen budget bar", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Nuyen")).toBeInTheDocument();
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByRole("button", { name: /Add/ })).toBeInTheDocument();
    });

    it("shows empty state when no gear selected", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("empty-state")).toHaveTextContent("No gear purchased");
    });

    it("opens purchase modal when Add button is clicked", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("gear-purchase-modal")).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      expect(screen.getByTestId("gear-purchase-modal")).toBeInTheDocument();
    });

    it("renders summary footer", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("summary-footer")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // GEAR DISPLAY
  // ===========================================================================

  describe("gear display", () => {
    it("renders gear items", () => {
      const state = createBaseState({
        selections: { gear: [makeGear()] },
      });

      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Flashlight")).toBeInTheDocument();
    });

    it("shows selected gear count header", () => {
      const state = createBaseState({
        selections: {
          gear: [makeGear(), makeGear({ id: "rope-1", name: "Rope", category: "survival" })],
        },
      });

      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Selected Gear \(2\)/)).toBeInTheDocument();
    });

    it("groups gear by category", () => {
      const state = createBaseState({
        selections: {
          gear: [
            makeGear({ category: "electronics" }),
            makeGear({ id: "medkit-1", name: "Medkit", category: "tools" }),
          ],
        },
      });

      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Electronics")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // REMOVE GEAR
  // ===========================================================================

  describe("remove gear", () => {
    it("removes gear when remove button is clicked", () => {
      const state = createBaseState({
        selections: { gear: [makeGear()] },
      });

      render(<GearPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: "Remove Flashlight" }));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          gear: [],
        }),
      });
    });

    it("only removes the targeted item from multiple", () => {
      const gear1 = makeGear();
      const gear2 = makeGear({ id: "rope-1", name: "Rope", category: "survival" });

      const state = createBaseState({
        selections: { gear: [gear1, gear2] },
      });

      render(<GearPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: "Remove Flashlight" }));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          gear: [gear2],
        }),
      });
    });
  });

  // ===========================================================================
  // ADD GEAR (purchase callbacks)
  // ===========================================================================

  describe("add gear", () => {
    it("adds gear to state when purchased via modal", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-gear"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          gear: [
            expect.objectContaining({
              catalogId: "flashlight",
              name: "Flashlight",
              category: "electronics",
              cost: 25,
            }),
          ],
        }),
      });
    });

    it("generates unique id for added gear", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-gear"));

      const call = mockUpdateState.mock.calls[0][0];
      const addedGear = call.selections.gear[0];
      expect(addedGear.id).toMatch(/^flashlight-/);
      expect(addedGear.id).not.toBe("flashlight");
    });

    it("triggers karma conversion prompt when item exceeds remaining budget", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen") return { total: 10, spent: 0, remaining: 10, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      mockCheckPurchase.mockReturnValue({ canConvert: true, karmaNeeded: 1 });

      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-gear"));

      expect(mockPromptConversion).toHaveBeenCalledWith("Flashlight", 25, expect.any(Function));
      expect(mockUpdateState).not.toHaveBeenCalled();
    });

    it("does not add item when over budget and karma conversion unavailable", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen") return { total: 10, spent: 0, remaining: 10, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      mockCheckPurchase.mockReturnValue(null);

      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-gear"));

      expect(mockUpdateState).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // BUDGET DISPLAY
  // ===========================================================================

  describe("budget display", () => {
    it("shows karma conversion amount when karma has been converted", () => {
      const state = createBaseState({
        budgets: { "karma-spent-gear": 2 },
      });

      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/\+4,000¥ karma/)).toBeInTheDocument();
    });

    it("does not show karma conversion label when no karma converted", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText(/karma/)).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // FOOTER SUMMARY
  // ===========================================================================

  describe("footer summary", () => {
    it("shows correct item count and total cost", () => {
      const state = createBaseState({
        selections: {
          gear: [
            makeGear({ cost: 25, quantity: 1 }),
            makeGear({ id: "rope-1", name: "Rope", cost: 50, quantity: 2 }),
          ],
        },
      });

      render(<GearPanel state={state} updateState={mockUpdateState} />);

      // 25*1 + 50*2 = 125
      expect(screen.getByTestId("summary-footer")).toHaveTextContent("2 items");
      expect(screen.getByTestId("summary-footer")).toHaveTextContent("125¥");
    });
  });

  // ===========================================================================
  // VALIDATION STATUS
  // ===========================================================================

  describe("validation status", () => {
    it("shows pending status when no gear selected", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when gear is selected", () => {
      const state = createBaseState({
        selections: { gear: [makeGear()] },
      });

      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows error status when over budget", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen")
          return { total: 6000, spent: 7000, remaining: -1000, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      const state = createBaseState({
        selections: { gear: [makeGear()] },
      });

      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });
  });

  // ===========================================================================
  // LEGALITY WARNINGS
  // ===========================================================================

  describe("legality warnings", () => {
    it("passes selected gear to LegalityWarnings", () => {
      const state = createBaseState({
        selections: { gear: [makeGear(), makeGear({ id: "rope-1" })] },
      });

      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("legality-warnings")).toHaveTextContent("2 warnings");
    });

    it("does not show legality warnings when no gear selected", () => {
      const state = createBaseState();
      render(<GearPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("legality-warnings")).not.toBeInTheDocument();
    });
  });
});
