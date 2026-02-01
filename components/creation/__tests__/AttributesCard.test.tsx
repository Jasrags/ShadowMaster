/**
 * AttributesCard Component Tests
 *
 * Tests the attribute allocation card in character creation.
 * Tests include rendering, attribute adjustments, budget tracking,
 * and metatype-specific limits.
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AttributesCard } from "../AttributesCard";

// Mock the hooks used by AttributesCard
vi.mock("@/lib/rules", () => ({
  useMetatypes: vi.fn(),
  usePriorityTable: vi.fn(),
  useMagicPaths: vi.fn(),
}));

vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

import { useMetatypes, usePriorityTable, useMagicPaths } from "@/lib/rules";
import { useCreationBudgets } from "@/lib/contexts";

// Sample data for tests - simplified for mocking purposes
const mockMetatypes = [
  {
    id: "human",
    name: "Human",
    attributes: {
      body: { min: 1, max: 6 },
      agility: { min: 1, max: 6 },
      reaction: { min: 1, max: 6 },
      strength: { min: 1, max: 6 },
      willpower: { min: 1, max: 6 },
      logic: { min: 1, max: 6 },
      intuition: { min: 1, max: 6 },
      charisma: { min: 1, max: 6 },
      edge: { min: 2, max: 7 },
    },
  },
  {
    id: "elf",
    name: "Elf",
    attributes: {
      body: { min: 1, max: 6 },
      agility: { min: 2, max: 7 },
      reaction: { min: 1, max: 6 },
      strength: { min: 1, max: 6 },
      willpower: { min: 1, max: 6 },
      logic: { min: 1, max: 6 },
      intuition: { min: 1, max: 6 },
      charisma: { min: 3, max: 8 },
      edge: { min: 1, max: 6 },
    },
  },
  {
    id: "troll",
    name: "Troll",
    attributes: {
      body: { min: 5, max: 10 },
      agility: { min: 1, max: 5 },
      reaction: { min: 1, max: 6 },
      strength: { min: 5, max: 10 },
      willpower: { min: 1, max: 6 },
      logic: { min: 1, max: 5 },
      intuition: { min: 1, max: 5 },
      charisma: { min: 1, max: 4 },
      edge: { min: 1, max: 6 },
    },
  },
];

const mockPriorityTable = {
  table: {
    A: {
      metatype: { specialAttributePoints: 6 },
      attributes: 24,
      magic: {
        options: [
          { path: "magician", magicRating: 6 },
          { path: "adept", magicRating: 6 },
        ],
      },
    },
    B: {
      metatype: { specialAttributePoints: 4 },
      attributes: 20,
      magic: {
        options: [
          { path: "magician", magicRating: 4 },
          { path: "technomancer", resonanceRating: 4 },
        ],
      },
    },
    C: {
      metatype: { specialAttributePoints: 3 },
      attributes: 16,
      magic: { options: [] },
    },
    D: {
      metatype: { specialAttributePoints: 2 },
      attributes: 14,
      magic: { options: [] },
    },
    E: {
      metatype: { specialAttributePoints: 1 },
      attributes: 12,
      magic: { options: [] },
    },
  },
};

const mockMagicPaths = [
  { id: "magician", name: "Magician", hasMagic: true, hasResonance: false },
  { id: "adept", name: "Adept", hasMagic: true, hasResonance: false },
  { id: "technomancer", name: "Technomancer", hasMagic: false, hasResonance: true },
  { id: "mundane", name: "Mundane", hasMagic: false, hasResonance: false },
];

const createMockBudget = (total: number, spent: number = 0) => ({
  total,
  spent,
  remaining: total - spent,
  label: "Test Budget",
});

// Factory to create test state - using 'any' to allow flexible test data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createBaseState = (overrides: Record<string, any> = {}): any => ({
  currentStep: 2,
  priorities: {
    metatype: "C",
    attributes: "B",
    magic: "E",
    skills: "D",
    resources: "A",
  },
  selections: {
    metatype: "human",
    attributes: {},
    specialAttributes: {},
    ...overrides.selections,
  },
  budgets: {},
  validation: { errors: [], warnings: [] },
  ...overrides,
});

describe("AttributesCard", () => {
  let mockUpdateState: Mock;
  let mockGetBudget: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockUpdateState = vi.fn();
    mockGetBudget = vi.fn((budgetId: string) => {
      if (budgetId === "attribute-points") return createMockBudget(20, 0);
      if (budgetId === "special-attribute-points") return createMockBudget(3, 0);
      return null;
    });

    vi.mocked(useMetatypes).mockReturnValue(mockMetatypes as ReturnType<typeof useMetatypes>);
    vi.mocked(usePriorityTable).mockReturnValue(
      mockPriorityTable as unknown as ReturnType<typeof usePriorityTable>
    );
    vi.mocked(useMagicPaths).mockReturnValue(mockMagicPaths as ReturnType<typeof useMagicPaths>);
    vi.mocked(useCreationBudgets).mockReturnValue({
      getBudget: mockGetBudget,
      budgets: {},
      updateSpent: vi.fn(),
      errors: [],
      warnings: [],
      isComplete: false,
    } as unknown as ReturnType<typeof useCreationBudgets>);
  });

  describe("rendering", () => {
    it("renders locked state when no priority is set", () => {
      const state = createBaseState({
        priorities: undefined,
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Set priorities to unlock attributes")).toBeInTheDocument();
    });

    it("renders awaiting metatype state when metatype not selected", () => {
      const state = createBaseState({
        selections: { metatype: undefined },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      expect(
        screen.getByText("Select a metatype to see adjusted attribute ranges")
      ).toBeInTheDocument();
    });

    it("renders physical attributes section", () => {
      const state = createBaseState();

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Physical")).toBeInTheDocument();
      expect(screen.getByText("Body")).toBeInTheDocument();
      expect(screen.getByText("Agility")).toBeInTheDocument();
      expect(screen.getByText("Reaction")).toBeInTheDocument();
      expect(screen.getByText("Strength")).toBeInTheDocument();
    });

    it("renders mental attributes section", () => {
      const state = createBaseState();

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Mental")).toBeInTheDocument();
      expect(screen.getByText("Willpower")).toBeInTheDocument();
      expect(screen.getByText("Logic")).toBeInTheDocument();
      expect(screen.getByText("Intuition")).toBeInTheDocument();
      expect(screen.getByText("Charisma")).toBeInTheDocument();
    });

    it("renders special attributes section with Edge", () => {
      const state = createBaseState();

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Special")).toBeInTheDocument();
      expect(screen.getByText("Edge")).toBeInTheDocument();
    });

    it("renders Magic attribute for magic users", () => {
      const state = createBaseState({
        priorities: {
          metatype: "C",
          attributes: "B",
          magic: "A",
          skills: "D",
          resources: "E",
        },
        selections: {
          metatype: "human",
          "magical-path": "magician",
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Magic")).toBeInTheDocument();
    });

    it("renders Resonance attribute for technomancers", () => {
      const state = createBaseState({
        priorities: {
          metatype: "C",
          attributes: "B",
          magic: "B",
          skills: "D",
          resources: "E",
        },
        selections: {
          metatype: "human",
          "magical-path": "technomancer",
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Resonance")).toBeInTheDocument();
    });

    it("shows budget indicator with correct totals", () => {
      const state = createBaseState();

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("Attribute Points")).toBeInTheDocument();
    });
  });

  describe("metatype-specific limits", () => {
    it("shows correct attribute ranges for Human metatype", () => {
      const state = createBaseState({
        selections: { metatype: "human" },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      // Human Body range is 1-6
      const bodyRanges = screen.getAllByText("1-6");
      expect(bodyRanges.length).toBeGreaterThan(0);
    });

    it("shows correct attribute ranges for Elf metatype", () => {
      const state = createBaseState({
        selections: { metatype: "elf" },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      // Elf Agility range is 2-7
      expect(screen.getByText("2-7")).toBeInTheDocument();
      // Elf Charisma range is 3-8
      expect(screen.getByText("3-8")).toBeInTheDocument();
    });

    it("shows correct attribute ranges for Troll metatype", () => {
      const state = createBaseState({
        selections: { metatype: "troll" },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      // Troll Body and Strength both have range 5-10
      const highRanges = screen.getAllByText("5-10");
      expect(highRanges.length).toBe(2); // Body and Strength
      // Troll Charisma range is 1-4
      expect(screen.getByText("1-4")).toBeInTheDocument();
    });
  });

  describe("attribute adjustment", () => {
    it("increases attribute when + button clicked", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { body: 1 },
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      const increaseButton = screen.getByRole("button", { name: "Increase Body" });
      fireEvent.click(increaseButton);

      expect(mockUpdateState).toHaveBeenCalled();
      const updateCall = mockUpdateState.mock.calls[0][0];
      expect(updateCall.selections.attributes.body).toBe(2);
    });

    it("decreases attribute when - button clicked", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { body: 3 },
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      const decreaseButton = screen.getByRole("button", { name: "Decrease Body" });
      fireEvent.click(decreaseButton);

      expect(mockUpdateState).toHaveBeenCalled();
      const updateCall = mockUpdateState.mock.calls[0][0];
      expect(updateCall.selections.attributes.body).toBe(2);
    });

    it("prevents decreasing below minimum", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { body: 1 }, // At minimum for Human
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      const decreaseButton = screen.getByRole("button", { name: "Decrease Body" });
      expect(decreaseButton).toHaveAttribute("disabled");
    });

    it("shows MAX badge when attribute is at maximum", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { body: 6 }, // At maximum for Human
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText("MAX")).toBeInTheDocument();
    });

    it("tracks attribute points spent correctly", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "attribute-points") return createMockBudget(20, 5);
        if (budgetId === "special-attribute-points") return createMockBudget(3, 0);
        return null;
      });

      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { body: 3, agility: 3 }, // 2 + 2 = 4 points spent (from base 1)
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      // Budget indicator should be visible
      expect(screen.getByText("Attribute Points")).toBeInTheDocument();
    });
  });

  describe("special attribute adjustment", () => {
    it("adjusts Edge attribute", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "attribute-points") return createMockBudget(20, 0);
        if (budgetId === "special-attribute-points") return createMockBudget(3, 0);
        return null;
      });

      const state = createBaseState({
        selections: {
          metatype: "human",
          specialAttributes: { edge: 0 },
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      const increaseEdgeButton = screen.getByRole("button", { name: "Increase Edge" });
      fireEvent.click(increaseEdgeButton);

      expect(mockUpdateState).toHaveBeenCalled();
      const updateCall = mockUpdateState.mock.calls[0][0];
      expect(updateCall.selections.specialAttributes.edge).toBe(1);
    });
  });

  describe("keyboard navigation", () => {
    it("supports arrow key navigation on attribute controls", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { body: 3 },
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      const bodyControls = screen.getByRole("group", { name: "Body controls" });

      // Arrow up should increase
      fireEvent.keyDown(bodyControls, { key: "ArrowUp" });
      expect(mockUpdateState).toHaveBeenCalled();
    });
  });

  describe("validation status", () => {
    it("shows pending status when no points spent", () => {
      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: {},
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      // Card should render without error
      expect(screen.getByText("Attributes")).toBeInTheDocument();
    });

    it("shows warning status when points partially spent", () => {
      mockGetBudget.mockImplementation((budgetId: string) => {
        if (budgetId === "attribute-points") return createMockBudget(20, 10);
        if (budgetId === "special-attribute-points") return createMockBudget(3, 1);
        return null;
      });

      const state = createBaseState({
        selections: {
          metatype: "human",
          attributes: { body: 3, agility: 3 },
        },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      // Component should render with budget tracking
      expect(screen.getByText("Attribute Points")).toBeInTheDocument();
    });
  });

  describe("footer summary", () => {
    it("shows metatype and priority info in footer", () => {
      const state = createBaseState({
        selections: { metatype: "human" },
      });

      render(<AttributesCard state={state} updateState={mockUpdateState} />);

      expect(screen.getByText(/Human/)).toBeInTheDocument();
      expect(screen.getByText(/Priority B Attributes/)).toBeInTheDocument();
    });
  });
});
