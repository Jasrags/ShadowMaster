/**
 * ArmorPanel Component Tests
 *
 * Tests the armor selection card in character creation.
 * Tests include locked state, nuyen budget bar, add/remove armor,
 * purchase callbacks, karma conversion, category grouping,
 * armor stacking warnings, validation status, and footer summary.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ArmorPanel } from "../ArmorPanel";
import type { CreationState, ArmorItem } from "@/lib/types";
import type { ArmorData } from "@/lib/rules/RulesetContext";

// =============================================================================
// MOCK STATE FOR KARMA CONVERSION
// =============================================================================

let mockCheckPurchase: Mock;
let mockPromptConversion: Mock;

// =============================================================================
// MOCKS
// =============================================================================

vi.mock("@/lib/rules/RulesetContext", () => ({
  useGear: vi.fn(() => ({ armor: [] })),
  useCreationMethod: vi.fn(() => ({ type: "priority", name: "Priority" })),
}));

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
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

vi.mock("../ArmorRow", () => ({
  ArmorRow: ({ armor, onRemove }: { armor: ArmorItem; onRemove: (id: string) => void }) => (
    <div data-testid={`armor-item-${armor.id ?? armor.catalogId}`}>
      <span>{armor.name}</span>
      <span data-testid="armor-rating">AR {armor.armorRating}</span>
      <button aria-label={`Remove ${armor.name}`} onClick={() => onRemove(armor.id ?? "")}>
        Remove
      </button>
    </div>
  ),
}));

vi.mock("../ArmorPurchaseModal", () => ({
  ArmorPurchaseModal: ({
    isOpen,
    onPurchase,
    onPurchaseCustom,
  }: {
    isOpen: boolean;
    onPurchase: (data: ArmorData) => void;
    onPurchaseCustom: (item: { name: string; cost: number }) => void;
  }) =>
    isOpen ? (
      <div data-testid="armor-purchase-modal">
        <button
          data-testid="buy-armor"
          onClick={() =>
            onPurchase({
              id: "armor-jacket",
              name: "Armor Jacket",
              category: "armor",
              armorRating: 12,
              capacity: 12,
              cost: 1000,
              availability: 2,
            } as ArmorData)
          }
        >
          Buy Armor
        </button>
        <button
          data-testid="buy-custom-clothing"
          onClick={() => onPurchaseCustom({ name: "Designer Suit", cost: 500 })}
        >
          Buy Custom
        </button>
      </div>
    ) : null,
}));

vi.mock("../ArmorModificationModal", () => ({
  ArmorModificationModal: () => null,
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

const makeArmor = (overrides: Partial<ArmorItem> = {}): ArmorItem =>
  ({
    id: "armor-jacket-1",
    catalogId: "armor-jacket",
    name: "Armor Jacket",
    category: "armor",
    armorRating: 12,
    capacity: 12,
    capacityUsed: 0,
    cost: 1000,
    availability: 2,
    quantity: 1,
    modifications: [],
    equipped: false,
    ...overrides,
  }) as ArmorItem;

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

describe("ArmorPanel", () => {
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
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Set priorities first")).toBeInTheDocument();
    });

    it("shows pending status when locked", () => {
      const state = createBaseState({ priorities: {} });
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("does not show locked state for point-buy creation method", () => {
      vi.mocked(useCreationMethod).mockReturnValue({
        type: "point-buy",
        name: "Point Buy",
      } as ReturnType<typeof useCreationMethod>);

      const state = createBaseState({ priorities: {} });
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("Set priorities first")).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Armor");
    });

    it("renders nuyen budget bar", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Nuyen")).toBeInTheDocument();
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByRole("button", { name: /Add/ })).toBeInTheDocument();
    });

    it("shows empty state when no armor selected", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("empty-state")).toHaveTextContent("No armor purchased");
    });

    it("opens purchase modal when Add button is clicked", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("armor-purchase-modal")).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      expect(screen.getByTestId("armor-purchase-modal")).toBeInTheDocument();
    });

    it("renders summary footer", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("summary-footer")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // ARMOR DISPLAY
  // ===========================================================================

  describe("armor display", () => {
    it("renders armor items", () => {
      const state = createBaseState({
        selections: { armor: [makeArmor()] },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Armor Jacket")).toBeInTheDocument();
    });

    it("shows selected armor count header", () => {
      const state = createBaseState({
        selections: {
          armor: [makeArmor(), makeArmor({ id: "vest-1", name: "Armor Vest" })],
        },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Selected Armor \(2\)/)).toBeInTheDocument();
    });

    it("groups armor by category - body armor", () => {
      const state = createBaseState({
        selections: { armor: [makeArmor()] },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Body Armor")).toBeInTheDocument();
    });

    it("groups helmets separately", () => {
      const state = createBaseState({
        selections: {
          armor: [makeArmor({ id: "helmet-1", name: "Ballistic Helmet", subcategory: "helmet" })],
        },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Helmets")).toBeInTheDocument();
    });

    it("groups shields separately", () => {
      const state = createBaseState({
        selections: {
          armor: [makeArmor({ id: "shield-1", name: "Riot Shield", subcategory: "shield" })],
        },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Shields")).toBeInTheDocument();
    });

    it("groups custom clothing items", () => {
      const state = createBaseState({
        selections: {
          armor: [
            makeArmor({
              id: "custom-1",
              name: "Designer Suit",
              isCustom: true,
              armorRating: 0,
            }),
          ],
        },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Clothing")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // ARMOR STACKING WARNING
  // ===========================================================================

  describe("armor stacking warning", () => {
    it("shows warning when multiple main armor pieces selected", () => {
      const state = createBaseState({
        selections: {
          armor: [
            makeArmor({ id: "jacket-1", name: "Armor Jacket" }),
            makeArmor({ id: "vest-1", name: "Armor Vest" }),
          ],
        },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Multiple main armor pieces/)).toBeInTheDocument();
      expect(screen.getByText(/Armor Jacket, Armor Vest/)).toBeInTheDocument();
    });

    it("does not show warning with single main armor piece", () => {
      const state = createBaseState({
        selections: { armor: [makeArmor()] },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText(/Multiple main armor pieces/)).not.toBeInTheDocument();
    });

    it("does not count helmets as main armor", () => {
      const state = createBaseState({
        selections: {
          armor: [
            makeArmor({ id: "jacket-1", name: "Armor Jacket" }),
            makeArmor({ id: "helmet-1", name: "Ballistic Helmet", subcategory: "helmet" }),
          ],
        },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText(/Multiple main armor pieces/)).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // REMOVE ARMOR
  // ===========================================================================

  describe("remove armor", () => {
    it("removes armor when remove button is clicked", () => {
      const state = createBaseState({
        selections: { armor: [makeArmor()] },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: "Remove Armor Jacket" }));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          armor: [],
        }),
      });
    });

    it("only removes the targeted item from multiple", () => {
      const armor1 = makeArmor();
      const armor2 = makeArmor({ id: "vest-1", name: "Armor Vest" });

      const state = createBaseState({
        selections: { armor: [armor1, armor2] },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: "Remove Armor Jacket" }));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          armor: [armor2],
        }),
      });
    });
  });

  // ===========================================================================
  // ADD ARMOR (purchase callbacks)
  // ===========================================================================

  describe("add armor", () => {
    it("adds armor to state when purchased via modal", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-armor"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          armor: [
            expect.objectContaining({
              catalogId: "armor-jacket",
              name: "Armor Jacket",
              armorRating: 12,
              cost: 1000,
            }),
          ],
        }),
      });
    });

    it("adds custom clothing to state", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-custom-clothing"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          armor: [
            expect.objectContaining({
              name: "Designer Suit",
              cost: 500,
              isCustom: true,
              armorRating: 0,
              subcategory: "clothing",
            }),
          ],
        }),
      });
    });

    it("generates unique id for added armor", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-armor"));

      const call = mockUpdateState.mock.calls[0][0];
      const addedArmor = call.selections.armor[0];
      expect(addedArmor.id).toMatch(/^armor-jacket-/);
    });

    it("triggers karma conversion prompt when item exceeds remaining budget", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen") return { total: 500, spent: 0, remaining: 500, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      mockCheckPurchase.mockReturnValue({ canConvert: true, karmaNeeded: 1 });

      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-armor"));

      expect(mockPromptConversion).toHaveBeenCalledWith("Armor Jacket", 1000, expect.any(Function));
      expect(mockUpdateState).not.toHaveBeenCalled();
    });

    it("does not add item when over budget and karma conversion unavailable", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen") return { total: 500, spent: 0, remaining: 500, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      mockCheckPurchase.mockReturnValue(null);

      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-armor"));

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

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/\+4,000¥ karma/)).toBeInTheDocument();
    });

    it("does not show karma conversion label when no karma converted", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText(/karma/)).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // FOOTER SUMMARY
  // ===========================================================================

  describe("footer summary", () => {
    it("shows correct item count and total cost including mods", () => {
      const state = createBaseState({
        selections: {
          armor: [
            makeArmor({
              cost: 1000,
              quantity: 1,
              modifications: [
                { catalogId: "mod1", name: "Mod", cost: 200, capacityUsed: 1, availability: 0 },
              ],
            }),
          ],
        },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      // 1000*1 + 200 = 1200
      expect(screen.getByTestId("summary-footer")).toHaveTextContent("1 item");
      expect(screen.getByTestId("summary-footer")).toHaveTextContent("1,200¥");
    });
  });

  // ===========================================================================
  // VALIDATION STATUS
  // ===========================================================================

  describe("validation status", () => {
    it("shows pending status when no armor selected", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when armor is selected", () => {
      const state = createBaseState({
        selections: { armor: [makeArmor()] },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

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
        selections: { armor: [makeArmor()] },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });
  });

  // ===========================================================================
  // LEGALITY WARNINGS
  // ===========================================================================

  describe("legality warnings", () => {
    it("passes selected armor to LegalityWarnings", () => {
      const state = createBaseState({
        selections: { armor: [makeArmor()] },
      });

      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("legality-warnings")).toHaveTextContent("1 warnings");
    });

    it("does not show legality warnings when no armor selected", () => {
      const state = createBaseState();
      render(<ArmorPanel state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("legality-warnings")).not.toBeInTheDocument();
    });
  });
});
