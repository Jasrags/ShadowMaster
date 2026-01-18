/**
 * GearCard Component Tests
 *
 * Tests for the gear purchasing card in character creation.
 * Covers:
 * - Unit tests for helper functions (formatCurrency, getAvailabilityDisplay, etc.)
 * - Integration tests for component behavior (tabs, search, add/remove items, budgets)
 */

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GearCard } from "../GearCard";
import type { CreationState } from "@/lib/types";
import type {
  GearCatalogData,
  GearItemData,
  WeaponData,
  ArmorData,
} from "@/lib/rules/RulesetContext";
import type { FocusCatalogItemData } from "@/lib/rules/loader-types";

// =============================================================================
// MOCKS
// =============================================================================

// Mock RulesetContext hooks
vi.mock("@/lib/rules/RulesetContext", () => ({
  useGear: vi.fn(),
  useFoci: vi.fn(),
}));

// Mock CreationBudgetContext
vi.mock("@/lib/contexts", () => ({
  useCreationBudgets: vi.fn(),
}));

// Mock ratings utilities
vi.mock("@/lib/types/ratings", () => ({
  hasUnifiedRatings: vi.fn(() => false),
}));

vi.mock("@/lib/rules/ratings", () => ({
  getRatedItemValuesUnified: vi.fn(() => ({ cost: 100, availability: 2 })),
}));

// Import mocked functions for control
import { useGear, useFoci } from "@/lib/rules/RulesetContext";
import { useCreationBudgets } from "@/lib/contexts";

// =============================================================================
// TEST FIXTURES
// =============================================================================

const createMockWeapon = (overrides?: Partial<WeaponData>): WeaponData => ({
  id: "combat-knife",
  name: "Combat Knife",
  category: "melee",
  subcategory: "Blades",
  cost: 300,
  availability: 4,
  damage: "6P",
  ap: -1,
  reach: 0,
  accuracy: 6,
  ...overrides,
});

const createMockArmor = (overrides?: Partial<ArmorData>): ArmorData => ({
  id: "armor-jacket",
  name: "Armor Jacket",
  category: "Armor",
  cost: 1000,
  availability: 2,
  armorRating: 12,
  ...overrides,
});

const createMockGearItem = (overrides?: Partial<GearItemData>): GearItemData => ({
  id: "flashlight",
  name: "Flashlight",
  category: "Tools",
  cost: 25,
  availability: 2,
  ...overrides,
});

const createMockRatedGearItem = (overrides?: Partial<GearItemData>): GearItemData => ({
  id: "medkit",
  name: "Medkit",
  category: "Medical",
  cost: 100,
  availability: 3,
  hasRating: true,
  minRating: 1,
  maxRating: 6,
  ratingSpec: {
    rating: { hasRating: true, minRating: 1, maxRating: 6 },
    costScaling: { perRating: true, baseValue: 100 },
    availabilityScaling: { perRating: true, baseValue: 0 },
  },
  ...overrides,
});

const createMockStackableGearItem = (overrides?: Partial<GearItemData>): GearItemData => ({
  id: "ammo-regular",
  name: "Regular Ammo",
  category: "Ammunition",
  cost: 20,
  availability: 2,
  stackable: true,
  quantity: 10,
  ...overrides,
});

const createMockFocus = (overrides?: Partial<FocusCatalogItemData>): FocusCatalogItemData => ({
  id: "power-focus",
  name: "Power Focus",
  type: "power",
  costMultiplier: 6000,
  bondingKarmaMultiplier: 3,
  availability: 4,
  ...overrides,
});

const createMockGearCatalog = (overrides?: Partial<GearCatalogData>): GearCatalogData => ({
  categories: [
    { id: "weapons", name: "Weapons" },
    { id: "armor", name: "Armor" },
    { id: "tools", name: "Tools" },
    { id: "medical", name: "Medical" },
  ],
  weapons: {
    melee: [createMockWeapon()],
    pistols: [
      createMockWeapon({
        id: "light-pistol",
        name: "Ares Light Fire 70",
        category: "pistols",
        subcategory: "Light Pistols",
        cost: 200,
        availability: 3,
        damage: "6P",
        ap: 0,
        mode: ["SA"],
        ammo: 16,
      }),
    ],
    smgs: [],
    rifles: [],
    shotguns: [],
    sniperRifles: [],
    throwingWeapons: [],
    grenades: [],
  },
  armor: [createMockArmor()],
  commlinks: [],
  cyberdecks: [],
  electronics: [],
  tools: [createMockGearItem()],
  survival: [],
  medical: [createMockRatedGearItem()],
  security: [],
  miscellaneous: [],
  ammunition: [createMockStackableGearItem()],
  rfidTags: [],
  industrialChemicals: [],
  ...overrides,
});

const createMockCreationState = (overrides?: Partial<CreationState>): CreationState => ({
  characterId: "test-char-123",
  creationMethodId: "priority",
  currentStep: 0,
  completedSteps: [],
  priorities: {
    metatype: "A",
    attributes: "B",
    magic: "C",
    skills: "D",
    resources: "E",
  },
  selections: {
    metatype: "human",
    "magical-path": "mundane",
    weapons: [],
    armor: [],
    gear: [],
    foci: [],
    cyberware: [],
    bioware: [],
  },
  budgets: {},
  errors: [],
  warnings: [],
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const createMockBudgetState = (total: number, spent: number = 0) => ({
  total,
  spent,
  remaining: total - spent,
  label: "Test Budget",
});

// =============================================================================
// UNIT TESTS - HELPER FUNCTIONS
// =============================================================================

describe("GearCard Helper Functions", () => {
  // We need to test the helper functions that are internal to GearCard
  // Since they're not exported, we test them indirectly through the component
  // or extract them for testing. For now, we'll test the behavior.

  describe("formatCurrency", () => {
    it("formats numbers with thousand separators", () => {
      // Tested indirectly through component rendering
      // formatCurrency(1000) should render as "1,000"
      const mockState = createMockCreationState();
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(6000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);

      // The budget display should show formatted currency (multiple occurrences expected)
      const matches = screen.getAllByText(/6,000/);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe("getAvailabilityDisplay", () => {
    it("adds R suffix for restricted items", () => {
      const mockState = createMockCreationState();
      const mockCatalog = createMockGearCatalog({
        armor: [createMockArmor({ availability: 8, legality: "restricted" })],
      });
      (useGear as Mock).mockReturnValue(mockCatalog);
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);

      // Switch to armor tab
      fireEvent.click(screen.getByText("Armor"));

      // Should show 8R for restricted
      expect(screen.getByText("8R")).toBeInTheDocument();
    });

    it("adds F suffix for forbidden items", () => {
      const mockState = createMockCreationState();
      const mockCatalog = createMockGearCatalog({
        armor: [createMockArmor({ availability: 10, legality: "forbidden" })],
      });
      (useGear as Mock).mockReturnValue(mockCatalog);
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);
      fireEvent.click(screen.getByText("Armor"));

      expect(screen.getByText("10F")).toBeInTheDocument();
    });
  });

  describe("isItemAvailable", () => {
    it("filters out items with availability > 12", () => {
      const mockState = createMockCreationState();
      const mockCatalog = createMockGearCatalog({
        armor: [
          createMockArmor({ id: "low-avail", name: "Low Avail Armor", availability: 8 }),
          createMockArmor({ id: "high-avail", name: "High Avail Armor", availability: 15 }),
        ],
      });
      (useGear as Mock).mockReturnValue(mockCatalog);
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);
      fireEvent.click(screen.getByText("Armor"));

      // Low availability armor should be visible
      expect(screen.getByText("Low Avail Armor")).toBeInTheDocument();
      // High availability armor should be filtered out
      expect(screen.queryByText("High Avail Armor")).not.toBeInTheDocument();
    });
  });

  describe("getAllWeapons", () => {
    it("extracts weapons from all subcategories", () => {
      const mockState = createMockCreationState();
      const mockCatalog = createMockGearCatalog();
      (useGear as Mock).mockReturnValue(mockCatalog);
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);
      fireEvent.click(screen.getByText("Weapons"));

      // Should show both melee and pistol weapons
      expect(screen.getByText("Combat Knife")).toBeInTheDocument();
      expect(screen.getByText("Ares Light Fire 70")).toBeInTheDocument();
    });
  });
});

// =============================================================================
// INTEGRATION TESTS - COMPONENT BEHAVIOR
// =============================================================================

describe("GearCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("shows locked state when priorities not set", () => {
      const mockState = createMockCreationState({
        priorities: {},
      });
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: () => undefined,
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);

      expect(screen.getByText("Set priorities first")).toBeInTheDocument();
    });

    it("renders when priorities are set", () => {
      const mockState = createMockCreationState();
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(6000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);

      // Should show the card title (use getByRole for heading)
      expect(screen.getByRole("heading", { name: "Gear" })).toBeInTheDocument();
      // Should show nuyen budget label
      expect(screen.getByText("Nuyen")).toBeInTheDocument();
    });

    it("shows nuyen budget progress bar", () => {
      const mockState = createMockCreationState();
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(6000, 3000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      const { container } = render(<GearCard state={mockState} updateState={vi.fn()} />);

      // Should show progress bar
      const progressBar = container.querySelector(".h-2.overflow-hidden.rounded-full");
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe("tab navigation", () => {
    beforeEach(() => {
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([createMockFocus()]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });
    });

    it("defaults to gear tab", () => {
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      // Gear tab should be active (has amber background)
      // Find all buttons with "Gear" text and get the one in the tab bar
      const gearButtons = screen.getAllByRole("button", { name: /Gear/i });
      // The tab button is the one with the amber class
      const gearTab = gearButtons.find((btn) => btn.classList.contains("bg-amber-500"));
      expect(gearTab).toBeDefined();
    });

    it("switches to weapons tab", () => {
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      fireEvent.click(screen.getByText("Weapons"));

      const weaponsTab = screen.getByText("Weapons").closest("button");
      expect(weaponsTab).toHaveClass("bg-amber-500");
    });

    it("switches to armor tab", () => {
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      fireEvent.click(screen.getByText("Armor"));

      const armorTab = screen.getByText("Armor").closest("button");
      expect(armorTab).toHaveClass("bg-amber-500");
    });

    it("hides foci tab for non-magical characters", () => {
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          "magical-path": "mundane",
        },
      });
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      expect(screen.queryByText("Foci")).not.toBeInTheDocument();
    });

    it("shows foci tab for magical characters", () => {
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          "magical-path": "magician",
        },
      });
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      expect(screen.getByText("Foci")).toBeInTheDocument();
    });
  });

  describe("search functionality", () => {
    beforeEach(() => {
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });
    });

    it("filters items by search query", async () => {
      const user = userEvent.setup();
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      fireEvent.click(screen.getByText("Weapons"));

      // Both weapons should be visible initially
      expect(screen.getByText("Combat Knife")).toBeInTheDocument();
      expect(screen.getByText("Ares Light Fire 70")).toBeInTheDocument();

      // Search for "knife"
      const searchInput = screen.getByPlaceholderText("Search weapons...");
      await user.type(searchInput, "knife");

      // Only knife should be visible
      expect(screen.getByText("Combat Knife")).toBeInTheDocument();
      expect(screen.queryByText("Ares Light Fire 70")).not.toBeInTheDocument();
    });

    it("clears search when switching tabs", async () => {
      const user = userEvent.setup();
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      fireEvent.click(screen.getByText("Weapons"));

      const searchInput = screen.getByPlaceholderText("Search weapons...");
      await user.type(searchInput, "knife");

      // Switch to armor tab
      fireEvent.click(screen.getByText("Armor"));

      // Search should be cleared
      const armorSearchInput = screen.getByPlaceholderText("Search armor...");
      expect(armorSearchInput).toHaveValue("");
    });
  });

  describe("adding items", () => {
    beforeEach(() => {
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([createMockFocus()]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });
    });

    it("calls updateState when adding a weapon", () => {
      const updateState = vi.fn();
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={updateState} />);

      fireEvent.click(screen.getByText("Weapons"));

      // Find and click the add button for Combat Knife
      const catalogSection = screen.getByText("Catalog").closest("div")?.parentElement;
      const knifeRow = screen.getByText("Combat Knife").closest("div");
      const addButton = knifeRow?.querySelector("button[title='Add to cart']");

      if (addButton) {
        fireEvent.click(addButton);
      }

      expect(updateState).toHaveBeenCalled();
      const updateCall = updateState.mock.calls[0][0];
      expect(updateCall.selections.weapons).toHaveLength(1);
      expect(updateCall.selections.weapons[0].name).toBe("Combat Knife");
    });

    it("calls updateState when adding armor", () => {
      const updateState = vi.fn();
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={updateState} />);

      fireEvent.click(screen.getByText("Armor"));

      const armorRow = screen.getByText("Armor Jacket").closest("div");
      const addButton = armorRow?.querySelector("button[title='Add to cart']");

      if (addButton) {
        fireEvent.click(addButton);
      }

      expect(updateState).toHaveBeenCalled();
      const updateCall = updateState.mock.calls[0][0];
      expect(updateCall.selections.armor).toHaveLength(1);
      expect(updateCall.selections.armor[0].name).toBe("Armor Jacket");
    });

    it("calls updateState when adding gear", () => {
      const updateState = vi.fn();
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={updateState} />);

      // Gear tab is default
      const gearRow = screen.getByText("Flashlight").closest("div");
      const addButton = gearRow?.querySelector("button[title='Add to cart']");

      if (addButton) {
        fireEvent.click(addButton);
      }

      expect(updateState).toHaveBeenCalled();
      const updateCall = updateState.mock.calls[0][0];
      expect(updateCall.selections.gear).toHaveLength(1);
      expect(updateCall.selections.gear[0].name).toBe("Flashlight");
    });

    it("disables add button when item costs more than remaining budget", () => {
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(100); // Only 100 nuyen
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      fireEvent.click(screen.getByText("Weapons"));

      // Combat Knife costs 300, but we only have 100
      const knifeRow = screen.getByText("Combat Knife").closest("div");
      const addButton = knifeRow?.querySelector("button[title='Cannot afford']");

      expect(addButton).toBeInTheDocument();
      expect(addButton).toBeDisabled();
    });
  });

  describe("removing items", () => {
    it("calls updateState when removing a purchased weapon", () => {
      const updateState = vi.fn();
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          weapons: [
            {
              id: "combat-knife-123",
              catalogId: "combat-knife",
              name: "Combat Knife",
              category: "melee",
              subcategory: "Blades",
              cost: 300,
              availability: 4,
              damage: "6P",
              ap: -1,
              mode: [],
              quantity: 1,
              modifications: [],
              occupiedMounts: [],
            },
          ],
        },
      });

      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000, 300);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      const { container } = render(<GearCard state={mockState} updateState={updateState} />);

      fireEvent.click(screen.getByText("Weapons"));

      // Find the remove button in the purchased section (marked by title="Remove")
      const removeButtons = container.querySelectorAll("button[title='Remove']");
      expect(removeButtons.length).toBeGreaterThan(0);

      fireEvent.click(removeButtons[0]);

      expect(updateState).toHaveBeenCalled();
      const updateCall = updateState.mock.calls[0][0];
      expect(updateCall.selections.weapons).toHaveLength(0);
    });
  });

  describe("karma conversion", () => {
    beforeEach(() => {
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(6000);
          if (id === "karma") return createMockBudgetState(25, 0);
          return undefined;
        },
      });
    });

    it("shows karma conversion section", () => {
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      expect(screen.getByText("Karma \u2192 Nuyen")).toBeInTheDocument();
      expect(screen.getByText(/2,000\u00A5\/karma/)).toBeInTheDocument();
    });

    it("increments karma conversion", () => {
      const updateState = vi.fn();
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={updateState} />);

      // Find the increment button for karma conversion
      const incrementButton = screen.getByLabelText("Increase karma to nuyen conversion");
      fireEvent.click(incrementButton);

      expect(updateState).toHaveBeenCalled();
      const updateCall = updateState.mock.calls[0][0];
      expect(updateCall.budgets["karma-spent-gear"]).toBe(1);
    });

    it("disables increment when at max (10)", () => {
      const mockState = createMockCreationState({
        budgets: { "karma-spent-gear": 10 },
      });
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      const incrementButton = screen.getByLabelText("Increase karma to nuyen conversion");
      expect(incrementButton).toBeDisabled();
    });

    it("disables decrement when at 0", () => {
      const mockState = createMockCreationState({
        budgets: { "karma-spent-gear": 0 },
      });
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      const decrementButton = screen.getByLabelText("Decrease karma to nuyen conversion");
      expect(decrementButton).toBeDisabled();
    });
  });

  describe("rated items", () => {
    beforeEach(() => {
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });
    });

    it("shows rating badge for rated items", () => {
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      // Medkit is a rated item
      expect(screen.getByText("Medkit")).toBeInTheDocument();
      expect(screen.getByText("R1-6")).toBeInTheDocument();
    });

    it("expands to show rating picker when clicked", () => {
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      // Click the settings button or expand for Medkit
      const medkitRow = screen.getByText("Medkit").closest("div");
      const expandButton = medkitRow?.querySelector("button[title='Configure rating']");

      if (expandButton) {
        fireEvent.click(expandButton);
      }

      // Should show rating selector
      expect(screen.getByText("Rating:")).toBeInTheDocument();
    });
  });

  describe("stackable items", () => {
    beforeEach(() => {
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });
    });

    it("shows quantity badge for stackable items", () => {
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      // Regular Ammo is stackable with quantity 10
      expect(screen.getByText("Regular Ammo")).toBeInTheDocument();
      expect(screen.getByText("\u00D710")).toBeInTheDocument();
    });

    it("expands to show quantity picker when clicked", () => {
      const mockState = createMockCreationState();
      render(<GearCard state={mockState} updateState={vi.fn()} />);

      // Click the expand button for Regular Ammo
      const ammoRow = screen.getByText("Regular Ammo").closest("div");
      const expandButton = ammoRow?.querySelector("button[title='Select quantity']");

      if (expandButton) {
        fireEvent.click(expandButton);
      }

      // Should show quantity selector
      expect(screen.getByText("Qty:")).toBeInTheDocument();
    });

    it("merges quantities when adding same stackable item twice", () => {
      const updateState = vi.fn();
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          gear: [
            {
              id: "ammo-regular-123",
              name: "Regular Ammo",
              category: "Ammunition",
              cost: 20,
              availability: 2,
              quantity: 1,
              modifications: [],
              metadata: { catalogId: "ammo-regular", stackable: true },
            },
          ],
        },
      });

      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000, 20);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      const { container } = render(<GearCard state={mockState} updateState={updateState} />);

      // Find the "Select quantity" button in the Catalog section (not Purchased)
      // The catalog section comes after the purchased section
      const selectQuantityButtons = container.querySelectorAll("button[title='Select quantity']");
      expect(selectQuantityButtons.length).toBeGreaterThan(0);

      // Click the expand button (last one is in catalog)
      fireEvent.click(selectQuantityButtons[selectQuantityButtons.length - 1]);

      // Click add button
      const addButton = screen.getByLabelText("Add Regular Ammo to cart");
      fireEvent.click(addButton);

      expect(updateState).toHaveBeenCalled();
      const updateCall = updateState.mock.calls[0][0];
      // Should have merged quantities (1 + 1 = 2)
      expect(updateCall.selections.gear[0].quantity).toBe(2);
    });
  });

  describe("purchased items display", () => {
    it("shows purchased items in the purchased section", () => {
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          weapons: [
            {
              id: "combat-knife-123",
              catalogId: "combat-knife",
              name: "Combat Knife",
              category: "melee",
              subcategory: "Blades",
              cost: 300,
              availability: 4,
              damage: "6P",
              ap: -1,
              mode: [],
              quantity: 1,
              modifications: [],
              occupiedMounts: [],
            },
          ],
        },
      });

      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000, 300);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);

      fireEvent.click(screen.getByText("Weapons"));

      // Should show "Purchased" section with the weapon
      expect(screen.getByText("Purchased")).toBeInTheDocument();
      // The purchased Combat Knife (with font-medium class for purchased items)
      const purchasedKnife = screen.getAllByText("Combat Knife")[0];
      expect(purchasedKnife).toBeInTheDocument();
    });

    it("shows quantity badge for purchased stackable items", () => {
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          gear: [
            {
              id: "ammo-regular-123",
              name: "Regular Ammo",
              category: "Ammunition",
              cost: 20,
              availability: 2,
              quantity: 5,
              modifications: [],
              metadata: { catalogId: "ammo-regular", stackable: true },
            },
          ],
        },
      });

      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000, 100);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);

      // Should show x5 badge for the purchased item
      expect(screen.getByText("\u00D75")).toBeInTheDocument();
    });
  });

  describe("footer summary", () => {
    it("shows total item count", () => {
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          weapons: [
            {
              id: "weapon1",
              catalogId: "combat-knife",
              name: "Combat Knife",
              category: "melee",
              subcategory: "Blades",
              cost: 300,
              availability: 4,
              damage: "6P",
              ap: -1,
              mode: [],
              quantity: 1,
              modifications: [],
              occupiedMounts: [],
            },
          ],
          armor: [
            {
              id: "armor1",
              catalogId: "armor-jacket",
              name: "Armor Jacket",
              category: "Armor",
              cost: 1000,
              availability: 2,
              armorRating: 12,
              quantity: 1,
              equipped: false,
              modifications: [],
            },
          ],
        },
      });

      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000, 1300);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);

      expect(screen.getByText("Total: 2 items")).toBeInTheDocument();
    });

    it("shows total cost of all gear", () => {
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          weapons: [
            {
              id: "weapon1",
              catalogId: "combat-knife",
              name: "Combat Knife",
              category: "melee",
              subcategory: "Blades",
              cost: 300,
              availability: 4,
              damage: "6P",
              ap: -1,
              mode: [],
              quantity: 1,
              modifications: [],
              occupiedMounts: [],
            },
          ],
          armor: [
            {
              id: "armor1",
              catalogId: "armor-jacket",
              name: "Armor Jacket",
              category: "Armor",
              cost: 1000,
              availability: 2,
              armorRating: 12,
              quantity: 1,
              equipped: false,
              modifications: [],
            },
          ],
        },
      });

      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(10000, 1300);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);

      // 300 + 1000 = 1,300
      expect(screen.getByText("1,300\u00A5")).toBeInTheDocument();
    });
  });

  describe("budget validation", () => {
    it("shows error state when over budget", () => {
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          weapons: [
            {
              id: "weapon1",
              catalogId: "combat-knife",
              name: "Expensive Weapon",
              category: "melee",
              subcategory: "Blades",
              cost: 7000,
              availability: 4,
              damage: "6P",
              ap: -1,
              mode: [],
              quantity: 1,
              modifications: [],
              occupiedMounts: [],
            },
          ],
        },
      });

      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(6000, 7000); // Over budget
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });

      const { container } = render(<GearCard state={mockState} updateState={vi.fn()} />);

      // Progress bar should be red when over budget
      const progressBar = container.querySelector(".bg-red-500");
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe("foci tab (magical characters)", () => {
    beforeEach(() => {
      (useGear as Mock).mockReturnValue(createMockGearCatalog());
      (useFoci as Mock).mockReturnValue([createMockFocus()]);
      (useCreationBudgets as Mock).mockReturnValue({
        getBudget: (id: string) => {
          if (id === "nuyen") return createMockBudgetState(50000);
          if (id === "karma") return createMockBudgetState(25);
          return undefined;
        },
      });
    });

    it("shows foci catalog for magicians", () => {
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          "magical-path": "magician",
        },
      });

      render(<GearCard state={mockState} updateState={vi.fn()} />);

      fireEvent.click(screen.getByText("Foci"));

      expect(screen.getByText("Power Focus")).toBeInTheDocument();
    });

    it("calls updateState when adding a focus", () => {
      const updateState = vi.fn();
      const mockState = createMockCreationState({
        selections: {
          ...createMockCreationState().selections,
          "magical-path": "magician",
        },
      });

      render(<GearCard state={mockState} updateState={updateState} />);

      fireEvent.click(screen.getByText("Foci"));

      const focusRow = screen.getByText("Power Focus").closest("div");
      const addButton = focusRow?.querySelector("button[title='Add to cart']");

      if (addButton) {
        fireEvent.click(addButton);
      }

      expect(updateState).toHaveBeenCalled();
      const updateCall = updateState.mock.calls[0][0];
      expect(updateCall.selections.foci).toHaveLength(1);
      expect(updateCall.selections.foci[0].name).toBe("Power Focus");
    });
  });
});
