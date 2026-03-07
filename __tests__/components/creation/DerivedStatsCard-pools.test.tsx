import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DerivedStatsCard } from "@/components/creation/DerivedStatsCard";
import type { CreationState } from "@/lib/types";

// Mock lucide-react icons
vi.mock("lucide-react", () => {
  const createIcon = (name: string) => {
    const Icon = (props: Record<string, unknown>) => (
      <span data-testid={`icon-${name}`} {...props} />
    );
    Icon.displayName = name;
    return Icon;
  };
  return {
    Activity: createIcon("Activity"),
    Shield: createIcon("Shield"),
    Heart: createIcon("Heart"),
    Brain: createIcon("Brain"),
    Footprints: createIcon("Footprints"),
    Sparkles: createIcon("Sparkles"),
    ChevronDown: createIcon("ChevronDown"),
    ChevronUp: createIcon("ChevronUp"),
    Dice5: createIcon("Dice5"),
  };
});

// Mock CreationCard to render children directly
vi.mock("@/components/creation/shared", () => ({
  CreationCard: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div data-testid={`creation-card-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

// Mock the augmented attributes hook
const mockAugmentedAttributes: Record<string, number> = {
  body: 3,
  agility: 5,
  reaction: 4,
  strength: 3,
  willpower: 3,
  logic: 4,
  intuition: 4,
  charisma: 2,
};

vi.mock("@/components/creation/hooks/useAugmentedAttributes", () => ({
  useAugmentedAttributes: vi.fn(() => ({
    attributes: { ...mockAugmentedAttributes },
    augmentationEffects: {
      essenceLoss: 0,
      remainingEssence: 6,
      initiativeDiceBonus: 0,
      attributeBonuses: {},
    },
    unifiedAttributeBonuses: {},
    effectSources: [],
    passiveEffects: null,
    unifiedInitiativeBonus: 0,
  })),
}));

// Mock useSkills
vi.mock("@/lib/rules", () => ({
  useSkills: vi.fn(() => ({
    activeSkills: [
      { id: "firearms", name: "Firearms", linkedAttribute: "agility", group: "firearms-group" },
      {
        id: "perception",
        name: "Perception",
        linkedAttribute: "intuition",
        group: "outdoors-group",
      },
      {
        id: "spellcasting",
        name: "Spellcasting",
        linkedAttribute: "magic",
        group: "sorcery-group",
      },
      { id: "sneaking", name: "Sneaking", linkedAttribute: "agility", group: "stealth-group" },
    ],
    skillGroups: [
      { id: "firearms-group", name: "Firearms Group", skills: ["firearms"] },
      {
        id: "stealth-group",
        name: "Stealth Group",
        skills: ["sneaking", "palming", "disguise"],
      },
    ],
  })),
}));

// Mock Tooltip to render children directly
vi.mock("@/components/ui", () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <span title={typeof content === "string" ? content : "tooltip"}>{children}</span>
  ),
}));

// Mock skill utils
vi.mock("@/lib/rules/skills/group-utils", () => ({
  getGroupRating: vi.fn((value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value === "object" && value !== null && "rating" in value)
      return (value as { rating: number }).rating;
    return 0;
  }),
  isGroupBroken: vi.fn((value: unknown) => {
    if (typeof value === "object" && value !== null && "isBroken" in value)
      return (value as { isBroken: boolean }).isBroken;
    return false;
  }),
}));

// Helper to create a minimal state
function makeState(
  overrides: Partial<CreationState["selections"]> = {},
  priorities: Record<string, string> = {}
): CreationState {
  return {
    editionCode: "sr5",
    method: "priority",
    priorities,
    selections: {
      metatype: "human",
      attributes: {
        body: 3,
        agility: 5,
        reaction: 4,
        strength: 3,
        willpower: 3,
        logic: 4,
        intuition: 4,
        charisma: 2,
      },
      ...overrides,
    },
  } as unknown as CreationState;
}

describe("DerivedStatsCard - Dice Pools", () => {
  const mockUpdateState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Dice Pools section with defense pool when attributes are set", () => {
    const state = makeState();
    render(<DerivedStatsCard state={state} updateState={mockUpdateState} />);

    // Defense pool should be visible in the collapsed button text
    expect(screen.getByText("Dice Pools")).toBeInTheDocument();
    expect(screen.getByText("Def 8")).toBeInTheDocument(); // REA(4) + INT(4) = 8
  });

  it("shows skill pools when expanded", () => {
    const state = makeState({
      skills: { firearms: 4, perception: 3 },
    });

    render(<DerivedStatsCard state={state} updateState={mockUpdateState} />);

    // Click to expand dice pools
    const poolsButton = screen.getByText("Dice Pools").closest("button");
    expect(poolsButton).toBeTruthy();
    fireEvent.click(poolsButton!);

    // Defense pool should show
    expect(screen.getByText("Defense")).toBeInTheDocument();

    // Skill pools should show
    expect(screen.getByText("Firearms")).toBeInTheDocument();
    expect(screen.getByText("Perception")).toBeInTheDocument();
  });

  it("shows correct pool values for skills", () => {
    const state = makeState({
      skills: { firearms: 4 },
    });

    render(<DerivedStatsCard state={state} updateState={mockUpdateState} />);

    // Expand pools
    const poolsButton = screen.getByText("Dice Pools").closest("button");
    fireEvent.click(poolsButton!);

    // Firearms pool: AGI(5) + Firearms(4) = 9
    expect(screen.getByText("9d")).toBeInTheDocument();
  });

  it("shows defense pool formula as title", () => {
    const state = makeState();
    render(<DerivedStatsCard state={state} updateState={mockUpdateState} />);

    // Expand pools
    const poolsButton = screen.getByText("Dice Pools").closest("button");
    fireEvent.click(poolsButton!);

    const defenseRow = screen.getByText("Defense").closest("div");
    expect(defenseRow?.getAttribute("title")).toBe("Reaction (4) + Intuition (4)");
  });

  it("shows prompt to add skills when no skills selected", () => {
    const state = makeState();
    render(<DerivedStatsCard state={state} updateState={mockUpdateState} />);

    // Expand pools
    const poolsButton = screen.getByText("Dice Pools").closest("button");
    fireEvent.click(poolsButton!);

    expect(screen.getByText("Add skills to see skill pools")).toBeInTheDocument();
  });

  it("sorts pools by value descending", () => {
    const state = makeState({
      skills: { firearms: 4, perception: 3, sneaking: 1 },
    });

    render(<DerivedStatsCard state={state} updateState={mockUpdateState} />);

    // Expand pools
    const poolsButton = screen.getByText("Dice Pools").closest("button");
    fireEvent.click(poolsButton!);

    const poolTexts = screen.getAllByText(/^\d+d$/);
    const poolValues = poolTexts.map((el) => parseInt(el.textContent!));
    // First value is defense pool (8), then sorted skill pools: 9, 7, 6
    expect(poolValues).toEqual([8, 9, 7, 6]);
  });

  it("includes group skill pools from non-broken groups", () => {
    const state = makeState({
      skillGroups: { "stealth-group": 3 },
    });

    render(<DerivedStatsCard state={state} updateState={mockUpdateState} />);

    // Expand pools
    const poolsButton = screen.getByText("Dice Pools").closest("button");
    fireEvent.click(poolsButton!);

    // Sneaking (from stealth group): AGI(5) + rating(3) = 8
    expect(screen.getByText("Sneaking")).toBeInTheDocument();
  });
});
