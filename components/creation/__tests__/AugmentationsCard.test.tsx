/**
 * AugmentationsCard Component Tests
 *
 * Tests the augmentation selection card in character creation.
 * Tests include locked state, essence/nuyen bars, add/remove augmentations,
 * magic/resonance loss warnings, validation status, and grouped display.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AugmentationsCard } from "../AugmentationsCard";

// Mock hooks
vi.mock("@/lib/rules/RulesetContext", () => ({
  useAugmentationRules: vi.fn(),
  calculateMagicLoss: vi.fn(),
}));

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

vi.mock("@/lib/rules/augmentations/grades", () => ({
  applyGradeToAvailability: vi.fn((avail: number) => avail),
}));

vi.mock("@/lib/types/cyberlimb", () => ({
  LOCATION_SIDE: {},
  wouldReplaceExisting: vi.fn(() => false),
  isCyberlimb: vi.fn(() => false),
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
  SummaryFooter: ({ count, total, label }: { count: number; total: number; label?: string }) => (
    <div data-testid="summary-footer">
      {count} {label}(s) — {total}
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

// Mock augmentation sub-components
vi.mock("../augmentations", () => ({
  AugmentationModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="augmentation-modal">Modal Open</div> : null,
  AugmentationItem: ({
    item,
    type,
    onRemove,
  }: {
    item: { id?: string; catalogId: string; name: string };
    type: string;
    onRemove: () => void;
  }) => (
    <div data-testid={`aug-item-${item.id || item.catalogId}`}>
      <span>{item.name}</span>
      <span data-testid="aug-type">{type}</span>
      <button onClick={onRemove}>Remove</button>
    </div>
  ),
  CyberlimbAugmentationItem: () => null,
  CyberwareEnhancementModal: () => null,
  CyberlimbAccessoryModal: () => null,
  CyberlimbWeaponModal: () => null,
  formatCurrency: (v: number) => v.toLocaleString(),
  formatEssence: (v: number) => v.toFixed(2),
  DISPLAY_CATEGORIES: [
    { id: "headware", label: "Headware", type: "cyberware" },
    { id: "bodyware", label: "Bodyware", type: "cyberware" },
    { id: "basic", label: "Basic Bioware", type: "bioware" },
  ],
}));

// Mock UI components
vi.mock("@/components/ui", () => ({
  InfoTooltip: () => null,
}));

import { useAugmentationRules, calculateMagicLoss } from "@/lib/rules/RulesetContext";
import { useCreationBudgets } from "@/lib/contexts";

const mockAugmentationRules = {
  maxEssence: 6,
  magicReductionFormula: "roundUp",
  maxAttributeBonus: 4,
  maxAvailabilityAtCreation: 12,
  trackEssenceHoles: false,
};

const makeCyberware = (overrides = {}) => ({
  id: "datajack-1",
  catalogId: "datajack",
  name: "Datajack",
  category: "headware",
  grade: "standard",
  baseEssenceCost: 0.1,
  essenceCost: 0.1,
  cost: 1000,
  availability: 2,
  ...overrides,
});

const makeBioware = (overrides = {}) => ({
  id: "synaptic-1",
  catalogId: "synaptic-booster",
  name: "Synaptic Booster",
  category: "basic",
  grade: "standard",
  baseEssenceCost: 0.5,
  essenceCost: 0.5,
  cost: 95000,
  availability: 12,
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
    "magical-path": "mundane",
    cyberware: [],
    bioware: [],
    specialAttributes: {},
    ...overrides.selections,
  },
  budgets: {
    ...overrides.budgets,
  },
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("AugmentationsCard", () => {
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

    vi.mocked(useAugmentationRules).mockReturnValue(
      mockAugmentationRules as unknown as ReturnType<typeof useAugmentationRules>
    );
    vi.mocked(calculateMagicLoss).mockReturnValue(0);
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
      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Set priorities first")).toBeInTheDocument();
    });

    it("shows pending status when locked", () => {
      const state = createBaseState({ priorities: {} });
      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });
  });

  describe("rendering", () => {
    it("renders card with correct title", () => {
      const state = createBaseState();
      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("card-title")).toHaveTextContent("Augmentations");
    });

    it("renders essence bar with max essence", () => {
      const state = createBaseState();
      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Essence")).toBeInTheDocument();
      expect(screen.getByText(/0\.00 \/ 6/)).toBeInTheDocument();
    });

    it("renders nuyen bar", () => {
      const state = createBaseState();
      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Nuyen")).toBeInTheDocument();
    });

    it("shows empty state when no augmentations", () => {
      const state = createBaseState();
      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("No augmentations installed")).toBeInTheDocument();
    });

    it("renders Add button in header", () => {
      const state = createBaseState();
      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByRole("button", { name: /Add/ })).toBeInTheDocument();
    });

    it("renders footer summary", () => {
      const state = createBaseState();
      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("summary-footer")).toBeInTheDocument();
    });

    it("opens augmentation modal when Add button is clicked", () => {
      const state = createBaseState();
      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByTestId("augmentation-modal")).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /Add/ }));
      expect(screen.getByTestId("augmentation-modal")).toBeInTheDocument();
    });
  });

  describe("augmentation display", () => {
    it("renders installed cyberware items", () => {
      const state = createBaseState({
        selections: { cyberware: [makeCyberware()], bioware: [] },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("aug-item-datajack-1")).toBeInTheDocument();
      expect(screen.getByText("Datajack")).toBeInTheDocument();
    });

    it("renders installed bioware items", () => {
      const state = createBaseState({
        selections: { cyberware: [], bioware: [makeBioware()] },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("aug-item-synaptic-1")).toBeInTheDocument();
      expect(screen.getByText("Synaptic Booster")).toBeInTheDocument();
    });

    it("renders category headers for grouped items", () => {
      const state = createBaseState({
        selections: {
          cyberware: [makeCyberware()],
          bioware: [makeBioware()],
        },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Headware")).toBeInTheDocument();
      expect(screen.getByText("Basic Bioware")).toBeInTheDocument();
    });
  });

  describe("remove augmentation", () => {
    it("removes cyberware when remove button is clicked", () => {
      const state = createBaseState({
        selections: { cyberware: [makeCyberware()], bioware: [] },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);
      fireEvent.click(screen.getByText("Remove"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          cyberware: [],
        }),
      });
    });

    it("removes bioware when remove button is clicked", () => {
      const state = createBaseState({
        selections: { cyberware: [], bioware: [makeBioware()] },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);
      fireEvent.click(screen.getByText("Remove"));

      expect(mockUpdateState).toHaveBeenCalledWith({
        selections: expect.objectContaining({
          bioware: [],
        }),
      });
    });
  });

  describe("magic/resonance warnings", () => {
    it("shows magic loss warning for awakened characters", () => {
      vi.mocked(calculateMagicLoss).mockReturnValue(1);

      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          specialAttributes: { magic: 6 },
          cyberware: [makeCyberware()],
          bioware: [],
        },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Magic reduced by 1/)).toBeInTheDocument();
    });

    it("shows resonance loss warning for technomancers", () => {
      vi.mocked(calculateMagicLoss).mockReturnValue(1);

      const state = createBaseState({
        selections: {
          "magical-path": "technomancer",
          specialAttributes: { resonance: 6 },
          cyberware: [makeCyberware()],
          bioware: [],
        },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Resonance reduced by 1/)).toBeInTheDocument();
    });

    it("does not show magic warning for mundane characters", () => {
      const state = createBaseState({
        selections: { cyberware: [makeCyberware()], bioware: [] },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.queryByText(/Magic reduced/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Resonance reduced/)).not.toBeInTheDocument();
    });
  });

  describe("attribute bonuses", () => {
    it("displays attribute bonuses from augmentations", () => {
      const state = createBaseState({
        selections: {
          cyberware: [
            makeCyberware({
              id: "muscle-1",
              catalogId: "muscle-replacement",
              name: "Muscle Replacement",
              category: "bodyware",
              essenceCost: 1,
              attributeBonuses: { strength: 1, agility: 1 },
            }),
          ],
          bioware: [],
        },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/STRENGTH: \+1/)).toBeInTheDocument();
      expect(screen.getByText(/AGILITY: \+1/)).toBeInTheDocument();
    });
  });

  describe("validation status", () => {
    it("shows pending status when no augmentations", () => {
      const state = createBaseState();
      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "pending");
    });

    it("shows valid status when augmentations installed", () => {
      const state = createBaseState({
        selections: { cyberware: [makeCyberware()], bioware: [] },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "valid");
    });

    it("shows warning status when magic loss occurs", () => {
      vi.mocked(calculateMagicLoss).mockReturnValue(1);

      const state = createBaseState({
        selections: {
          "magical-path": "magician",
          specialAttributes: { magic: 6 },
          cyberware: [makeCyberware()],
          bioware: [],
        },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "warning");
    });

    it("shows error status when essence goes negative", () => {
      const state = createBaseState({
        selections: {
          cyberware: [makeCyberware({ essenceCost: 7 })],
          bioware: [],
        },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });

    it("shows error status when nuyen budget is negative", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "nuyen")
          return { total: 6000, spent: 7000, remaining: -1000, label: "Nuyen" };
        if (budgetId === "karma") return { total: 25, spent: 0, remaining: 25, label: "Karma" };
        return null;
      });

      const state = createBaseState({
        selections: { cyberware: [makeCyberware()], bioware: [] },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByTestId("creation-card")).toHaveAttribute("data-status", "error");
    });
  });

  describe("essence calculation", () => {
    it("shows combined essence from cyberware and bioware", () => {
      const state = createBaseState({
        selections: {
          cyberware: [makeCyberware({ essenceCost: 0.1 })],
          bioware: [makeBioware({ essenceCost: 0.5 })],
        },
      });

      render(<AugmentationsCard state={state} updateState={mockUpdateState} />);

      // 0.1 + 0.5 = 0.6, formatted as "0.60"
      expect(screen.getByText(/0\.60 \/ 6/)).toBeInTheDocument();
    });
  });
});
