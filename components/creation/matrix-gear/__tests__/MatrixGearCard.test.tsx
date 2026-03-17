/**
 * MatrixGearCard Component Tests
 *
 * Tests the matrix gear selection card in character creation.
 * Tests include locked state, nuyen budget bar, add/remove items (commlinks,
 * cyberdecks, software), purchase callbacks, karma conversion, validation
 * status, grouped display, and footer summary.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MatrixGearCard } from "../MatrixGearCard";
import type {
  CreationState,
  CharacterCommlink,
  CharacterCyberdeck,
  CharacterDataSoftware,
} from "@/lib/types";
import type { CommlinkData, CyberdeckData } from "@/lib/rules/RulesetContext";

// =============================================================================
// MOCK STATE FOR KARMA CONVERSION
// =============================================================================

let mockCheckPurchase: Mock;
let mockPromptConversion: Mock;

// =============================================================================
// MOCKS
// =============================================================================

vi.mock("@/lib/rules/RulesetContext", () => ({
  useCommlinks: vi.fn(() => []),
  useCyberdecks: vi.fn(() => []),
  useCreationMethod: vi.fn(() => ({ type: "priority", name: "Priority" })),
}));

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

// Mock shared components — LegalityWarnings is opaque; filtering is its own
// component's responsibility
vi.mock("../../shared", () => ({
  CreationCard: ({
    title,
    status,
    description,
    children,
    headerAction,
  }: {
    title: string;
    status: string;
    description?: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
  }) => (
    <div data-testid="creation-card" data-status={status}>
      <div data-testid="card-title">{title}</div>
      {description && <div data-testid="card-description">{description}</div>}
      {headerAction && <div data-testid="header-action">{headerAction}</div>}
      {children}
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
  LegalityBadge: ({ legality, availability }: { legality?: string; availability?: number }) =>
    legality && legality !== "legal" ? (
      <span data-testid="legality-badge">
        {availability}
        {legality === "restricted" ? "R" : "F"}
      </span>
    ) : null,
}));

// Mock MatrixGearModal — expose purchase callbacks so tests can invoke them
vi.mock("../MatrixGearModal", () => ({
  MatrixGearModal: ({
    isOpen,
    onPurchaseCommlink,
    onPurchaseCyberdeck,
    onPurchaseSoftware,
  }: {
    isOpen: boolean;
    onPurchaseCommlink: (c: CommlinkData) => void;
    onPurchaseCyberdeck: (d: CyberdeckData) => void;
    onPurchaseSoftware: (s: CharacterDataSoftware) => void;
  }) =>
    isOpen ? (
      <div data-testid="matrix-gear-modal">
        <button
          data-testid="buy-commlink"
          onClick={() =>
            onPurchaseCommlink({
              id: "meta-link",
              name: "Meta Link",
              category: "commlinks",
              deviceRating: 1,
              cost: 100,
              availability: 2,
            } as CommlinkData)
          }
        >
          Buy Commlink
        </button>
        <button
          data-testid="buy-cyberdeck"
          onClick={() =>
            onPurchaseCyberdeck({
              id: "erika-mk1",
              name: "Erika MCD-1",
              category: "cyberdecks",
              deviceRating: 1,
              attributes: { attack: 4, sleaze: 3, dataProcessing: 2, firewall: 1 },
              programs: 1,
              cost: 49500,
              availability: 3,
            } as CyberdeckData)
          }
        >
          Buy Cyberdeck
        </button>
        <button
          data-testid="buy-software"
          onClick={() =>
            onPurchaseSoftware({
              id: "seattle-map-1",
              catalogId: "seattle-map",
              displayName: "Seattle Mapsoft",
              type: "mapsoft",
              cost: 100,
            } as CharacterDataSoftware)
          }
        >
          Buy Software
        </button>
      </div>
    ) : null,
}));

// Mock UI components
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

const makeCommlink = (overrides: Partial<CharacterCommlink> = {}): CharacterCommlink =>
  ({
    id: "meta-link-1",
    catalogId: "meta-link",
    name: "Meta Link",
    deviceRating: 1,
    dataProcessing: 1,
    firewall: 1,
    cost: 100,
    availability: 2,
    ...overrides,
  }) as CharacterCommlink;

const makeCyberdeck = (overrides: Partial<CharacterCyberdeck> = {}): CharacterCyberdeck =>
  ({
    id: "erika-mk1-1",
    catalogId: "erika-mk1",
    name: "Erika MCD-1",
    deviceRating: 1,
    attributeArray: [4, 3, 2, 1],
    currentConfig: {
      attack: 4,
      sleaze: 3,
      dataProcessing: 2,
      firewall: 1,
    },
    programSlots: 1,
    loadedPrograms: [],
    cost: 49500,
    availability: 3,
    ...overrides,
  }) as CharacterCyberdeck;

const makeSoftware = (overrides: Partial<CharacterDataSoftware> = {}): CharacterDataSoftware =>
  ({
    id: "seattle-map-1",
    catalogId: "seattle-map",
    displayName: "Seattle Mapsoft",
    type: "mapsoft" as const,
    cost: 100,
    ...overrides,
  }) as CharacterDataSoftware;

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
      commlinks: [],
      cyberdecks: [],
      software: [],
      gear: [],
      weapons: [],
      armor: [],
      foci: [],
      cyberware: [],
      bioware: [],
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

describe("MatrixGearCard", () => {
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
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Set priorities first")).toBeInTheDocument();
    });

    it("shows pending status when locked", () => {
      const state = createBaseState({ priorities: {} });
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("does not show locked state for point-buy creation method", () => {
      vi.mocked(useCreationMethod).mockReturnValue({
        type: "point-buy",
        name: "Point Buy",
      } as ReturnType<typeof useCreationMethod>);

      const state = createBaseState({ priorities: {} });
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("Set priorities first")).not.toBeInTheDocument();
    });

    it("does not show locked state for life-modules creation method", () => {
      vi.mocked(useCreationMethod).mockReturnValue({
        type: "life-modules",
        name: "Life Modules",
      } as ReturnType<typeof useCreationMethod>);

      const state = createBaseState({ priorities: {} });
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText("Set priorities first")).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // RENDERING
  // ===========================================================================

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Matrix Gear");
    });

    it("renders nuyen budget bar", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Nuyen")).toBeInTheDocument();
      expect(screen.getByText("0 / 450,000")).toBeInTheDocument();
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByRole("button", { name: /Add/ })).toBeInTheDocument();
    });

    it("shows empty state when no matrix gear selected", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No matrix gear selected")).toBeInTheDocument();
    });

    it("opens matrix gear modal when Add button is clicked", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("matrix-gear-modal")).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      expect(screen.getByTestId("matrix-gear-modal")).toBeInTheDocument();
    });

    it("renders footer summary with item count and cost", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Total: 0 items/)).toBeInTheDocument();
      expect(screen.getByText("0¥")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // COMMLINK DISPLAY
  // ===========================================================================

  describe("commlink display", () => {
    it("renders commlink with name and device rating", () => {
      const state = createBaseState({
        selections: { commlinks: [makeCommlink()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Meta Link")).toBeInTheDocument();
      expect(screen.getByText("DR 1")).toBeInTheDocument();
    });

    it("renders commlink with custom name when set", () => {
      const state = createBaseState({
        selections: {
          commlinks: [makeCommlink({ customName: "My Burner" })],
        },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("My Burner")).toBeInTheDocument();
    });

    it("renders commlink cost in the item row", () => {
      const state = createBaseState({
        selections: { commlinks: [makeCommlink({ cost: 1000 })] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      // Cost appears in both row and footer
      const matches = screen.getAllByText("1,000¥");
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("renders Commlinks category header", () => {
      const state = createBaseState({
        selections: { commlinks: [makeCommlink()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Commlinks")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // CYBERDECK DISPLAY
  // ===========================================================================

  describe("cyberdeck display", () => {
    it("renders cyberdeck with name and device rating", () => {
      const state = createBaseState({
        selections: { cyberdecks: [makeCyberdeck()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Erika MCD-1")).toBeInTheDocument();
      expect(screen.getByText("DR 1")).toBeInTheDocument();
    });

    it("renders cyberdeck ASDF attributes", () => {
      const state = createBaseState({
        selections: { cyberdecks: [makeCyberdeck()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/ASDF: 4\/3\/2\/1/)).toBeInTheDocument();
    });

    it("renders cyberdeck program slots", () => {
      const state = createBaseState({
        selections: { cyberdecks: [makeCyberdeck({ programSlots: 4 })] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Programs: 4/)).toBeInTheDocument();
    });

    it("renders Cyberdecks category header", () => {
      const state = createBaseState({
        selections: { cyberdecks: [makeCyberdeck()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Cyberdecks")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // SOFTWARE DISPLAY
  // ===========================================================================

  describe("software display", () => {
    it("renders software with display name", () => {
      const state = createBaseState({
        selections: { software: [makeSoftware()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Seattle Mapsoft")).toBeInTheDocument();
    });

    it("renders software cost in the item row", () => {
      const state = createBaseState({
        selections: { software: [makeSoftware({ cost: 250 })] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      // Cost appears in both row and footer
      const matches = screen.getAllByText("250¥");
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it("renders Software category header", () => {
      const state = createBaseState({
        selections: { software: [makeSoftware()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Software")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // REMOVE ITEMS (using aria-label selectors)
  // ===========================================================================

  describe("remove items", () => {
    it("removes commlink when remove button is clicked", () => {
      const state = createBaseState({
        selections: { commlinks: [makeCommlink()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: "Remove Meta Link" }));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          commlinks: [],
        }),
      });
    });

    it("removes cyberdeck when remove button is clicked", () => {
      const state = createBaseState({
        selections: { cyberdecks: [makeCyberdeck()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: "Remove Erika MCD-1" }));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          cyberdecks: [],
        }),
      });
    });

    it("removes software when remove button is clicked", () => {
      const state = createBaseState({
        selections: { software: [makeSoftware()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: "Remove Seattle Mapsoft" }));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          software: [],
        }),
      });
    });

    it("only removes the targeted commlink from multiple", () => {
      const commlink1 = makeCommlink({ id: "meta-link-1", name: "Meta Link" });
      const commlink2 = makeCommlink({
        id: "hermes-ikon-1",
        catalogId: "hermes-ikon",
        name: "Hermes Ikon",
        cost: 3000,
      });

      const state = createBaseState({
        selections: { commlinks: [commlink1, commlink2] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: "Remove Meta Link" }));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          commlinks: [commlink2],
        }),
      });
    });

    it("uses custom name in remove button aria-label when set", () => {
      const state = createBaseState({
        selections: { commlinks: [makeCommlink({ customName: "My Burner" })] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByRole("button", { name: "Remove My Burner" })).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // ADD ITEMS (purchase callbacks via modal)
  // ===========================================================================

  describe("add items", () => {
    it("adds commlink to state when purchased via modal", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      // Open modal
      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      // Purchase commlink via mock modal button
      fireEvent.click(screen.getByTestId("buy-commlink"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          commlinks: [
            expect.objectContaining({
              catalogId: "meta-link",
              name: "Meta Link",
              deviceRating: 1,
              cost: 100,
            }),
          ],
        }),
      });
    });

    it("adds cyberdeck to state when purchased via modal", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-cyberdeck"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          cyberdecks: [
            expect.objectContaining({
              catalogId: "erika-mk1",
              name: "Erika MCD-1",
              deviceRating: 1,
              programSlots: 1,
              cost: 49500,
            }),
          ],
        }),
      });
    });

    it("adds software to state when purchased via modal", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-software"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          software: [
            expect.objectContaining({
              displayName: "Seattle Mapsoft",
              type: "mapsoft",
              cost: 100,
            }),
          ],
        }),
      });
    });

    it("generates unique id for added commlink", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-commlink"));

      const call = mockUpdateState.mock.calls[0][0];
      const addedCommlink = call.selections.commlinks[0];
      expect(addedCommlink.id).toMatch(/^meta-link-/);
      expect(addedCommlink.id).not.toBe("meta-link");
    });

    it("sets cyberdeck currentConfig from catalog attributes", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-cyberdeck"));

      const call = mockUpdateState.mock.calls[0][0];
      const addedDeck = call.selections.cyberdecks[0];
      expect(addedDeck.currentConfig).toEqual({
        attack: 4,
        sleaze: 3,
        dataProcessing: 2,
        firewall: 1,
      });
      expect(addedDeck.attributeArray).toEqual([4, 3, 2, 1]);
      expect(addedDeck.loadedPrograms).toEqual([]);
    });

    it("triggers karma conversion prompt when item exceeds remaining budget", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen") return { total: 50, spent: 0, remaining: 50, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      mockCheckPurchase.mockReturnValue({ canConvert: true, karmaNeeded: 1 });

      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      // Commlink costs 100, but only 50 remaining
      fireEvent.click(screen.getByTestId("buy-commlink"));

      expect(mockPromptConversion).toHaveBeenCalledWith("Meta Link", 100, expect.any(Function));
      // Should NOT have directly added to state
      expect(mockUpdateState).not.toHaveBeenCalled();
    });

    it("does not add item when over budget and karma conversion unavailable", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen") return { total: 50, spent: 0, remaining: 50, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      mockCheckPurchase.mockReturnValue(null);

      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      fireEvent.click(screen.getByTestId("buy-commlink"));

      expect(mockUpdateState).not.toHaveBeenCalled();
      expect(mockPromptConversion).not.toHaveBeenCalled();
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

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      // 2 * 2000 = 4000
      expect(screen.getByText(/\+4,000¥ karma/)).toBeInTheDocument();
    });

    it("does not show karma conversion label when no karma converted", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText(/karma/)).not.toBeInTheDocument();
    });

    it("shows total nuyen including karma conversion", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen") return { total: 6000, spent: 0, remaining: 6000, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      const state = createBaseState({
        budgets: { "karma-spent-gear": 1 },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      // Base 6000 + 1*2000 = 8000
      expect(screen.getByText(/0 \/ 8,000/)).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // FOOTER SUMMARY
  // ===========================================================================

  describe("footer summary", () => {
    it("shows correct item count across all categories", () => {
      const state = createBaseState({
        selections: {
          commlinks: [makeCommlink()],
          cyberdecks: [makeCyberdeck()],
          software: [makeSoftware()],
        },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Total: 3 items/)).toBeInTheDocument();
    });

    it("shows singular 'item' for single item", () => {
      const state = createBaseState({
        selections: { commlinks: [makeCommlink()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Total: 1 item")).toBeInTheDocument();
    });

    it("shows combined matrix gear cost", () => {
      const state = createBaseState({
        selections: {
          commlinks: [makeCommlink({ cost: 100 })],
          cyberdecks: [makeCyberdeck({ cost: 49500 })],
          software: [makeSoftware({ cost: 200 })],
        },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      // 100 + 49500 + 200 = 49800
      expect(screen.getByText("49,800¥")).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // GROUPED DISPLAY
  // ===========================================================================

  describe("grouped display", () => {
    it("shows Selected Matrix Gear header with total count", () => {
      const state = createBaseState({
        selections: {
          commlinks: [makeCommlink()],
          cyberdecks: [makeCyberdeck()],
        },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Selected Matrix Gear \(2\)/)).toBeInTheDocument();
    });

    it("does not show category headers for empty categories", () => {
      const state = createBaseState({
        selections: { commlinks: [makeCommlink()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Commlinks")).toBeInTheDocument();
      expect(screen.queryByText("Cyberdecks")).not.toBeInTheDocument();
      expect(screen.queryByText("Software")).not.toBeInTheDocument();
    });
  });

  // ===========================================================================
  // VALIDATION STATUS
  // ===========================================================================

  describe("validation status", () => {
    it("shows pending status when no items selected", () => {
      const state = createBaseState();
      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when items are selected", () => {
      const state = createBaseState({
        selections: { commlinks: [makeCommlink()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

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
        selections: { commlinks: [makeCommlink()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });
  });

  // ===========================================================================
  // LEGALITY WARNINGS
  // ===========================================================================

  describe("legality warnings", () => {
    it("passes commlinks and cyberdecks to LegalityWarnings", () => {
      const state = createBaseState({
        selections: {
          commlinks: [makeCommlink()],
          cyberdecks: [makeCyberdeck()],
        },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      // The component passes all commlinks + cyberdecks to LegalityWarnings
      expect(screen.getByTestId("legality-warnings")).toHaveTextContent("2 warnings");
    });

    it("does not show legality warnings when no hardware selected", () => {
      const state = createBaseState({
        selections: { software: [makeSoftware()] },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      // Software is not passed to LegalityWarnings
      expect(screen.queryByTestId("legality-warnings")).not.toBeInTheDocument();
    });

    it("renders legality badge for restricted items", () => {
      const state = createBaseState({
        selections: {
          commlinks: [makeCommlink({ legality: "restricted", availability: 8 })],
        },
      });

      render(<MatrixGearCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("legality-badge")).toHaveTextContent("8R");
    });
  });
});
