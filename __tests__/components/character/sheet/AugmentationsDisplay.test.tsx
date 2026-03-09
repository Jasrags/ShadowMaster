import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Character } from "@/lib/types";
import type { CyberlimbItem } from "@/lib/types/cyberlimb";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock all lucide-react icons — vi.hoisted ensures the helper is available in the hoisted vi.mock factory
const { mockIcon } = vi.hoisted(() => {
  function mockIcon(name: string) {
    const Icon = (props: Record<string, unknown>) => (
      <span data-testid={`icon-${name}`} {...props} />
    );
    Icon.displayName = name;
    return Icon;
  }
  return { mockIcon };
});

vi.mock("lucide-react", () => ({
  ChevronDown: mockIcon("ChevronDown"),
  ChevronRight: mockIcon("ChevronRight"),
  Cpu: mockIcon("Cpu"),
  Wifi: mockIcon("Wifi"),
  WifiOff: mockIcon("WifiOff"),
  CircuitBoard: mockIcon("CircuitBoard"),
  Plus: mockIcon("Plus"),
  Trash2: mockIcon("Trash2"),
  AlertCircle: mockIcon("AlertCircle"),
  Zap: mockIcon("Zap"),
  X: mockIcon("X"),
  Minus: mockIcon("Minus"),
  Target: mockIcon("Target"),
  Shield: mockIcon("Shield"),
  AlertTriangle: mockIcon("AlertTriangle"),
  Search: mockIcon("Search"),
  Package: mockIcon("Package"),
}));

vi.mock("@/lib/rules/RulesetContext", () => ({
  useCyberwareCatalog: vi.fn(() => []),
  useBiowareCatalog: vi.fn(() => []),
  useCyberware: vi.fn(() => ({ catalog: [] })),
}));

vi.mock("@/lib/rules/wireless", () => ({
  isGlobalWirelessEnabled: vi.fn(() => true),
}));

const mockAddEnhancement = vi.fn().mockResolvedValue({ success: false });
const mockRemoveEnhancement = vi.fn().mockResolvedValue({ success: false });
const mockAddAccessory = vi.fn().mockResolvedValue({ success: false });
const mockRemoveAccessory = vi.fn().mockResolvedValue({ success: false });
const mockToggleWireless = vi.fn().mockResolvedValue({ success: false });

vi.mock("@/lib/rules/augmentations/cyberlimb-hooks", () => ({
  useCharacterCyberlimbs: vi.fn(() => ({
    cyberlimbs: [],
    totalCMBonus: 0,
    totalEssenceLost: 0,
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useInstallCyberlimb: vi.fn(() => ({
    install: vi.fn(),
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useRemoveCyberlimb: vi.fn(() => ({
    remove: vi.fn(),
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useAddCyberlimbEnhancement: vi.fn(() => ({
    add: mockAddEnhancement,
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useRemoveCyberlimbEnhancement: vi.fn(() => ({
    remove: mockRemoveEnhancement,
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useAddCyberlimbAccessory: vi.fn(() => ({
    add: mockAddAccessory,
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useRemoveCyberlimbAccessory: vi.fn(() => ({
    remove: mockRemoveAccessory,
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useToggleCyberlimbWireless: vi.fn(() => ({
    toggle: mockToggleWireless,
    reset: vi.fn(),
    data: null,
    loading: false,
    error: null,
  })),
  useCyberlimbDetails: vi.fn(() => ({
    limb: null,
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock("@/components/cyberlimbs/CyberlimbEnhancementModal", () => ({
  CyberlimbEnhancementModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="enhancement-modal">
        <button data-testid="close-enhancement-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock("@/components/cyberlimbs/CyberlimbAccessoryModal", () => ({
  CyberlimbAccessoryModal: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="accessory-modal">
        <button data-testid="close-accessory-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

import { AugmentationsDisplay } from "@/components/character/sheet/AugmentationsDisplay";

// ---------------------------------------------------------------------------
// Test Factories
// ---------------------------------------------------------------------------

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "char-1",
    userId: "user-1",
    name: "Test Runner",
    edition: "sr5",
    creationMethod: "priority",
    status: "active",
    metatype: "human",
    magicalPath: "mundane",
    nuyen: 10000,
    startingNuyen: 50000,
    karmaCurrent: 10,
    karmaTotal: 25,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    attributes: {} as Character["attributes"],
    skills: [],
    positiveQualities: [],
    negativeQualities: [],
    gear: [],
    contacts: [],
    weapons: [],
    armor: [],
    lifestyles: [],
    identities: [],
    ...overrides,
  } as Character;
}

function makeCyberlimb(overrides: Partial<CyberlimbItem> = {}): CyberlimbItem {
  return {
    id: "limb-1",
    catalogId: "cyberlimb-full-arm",
    name: "Cyberarm",
    category: "cyberlimb",
    location: "left-arm",
    limbType: "full-arm",
    appearance: "obvious",
    grade: "standard",
    essenceCost: 1.0,
    baseStrength: 3,
    baseAgility: 3,
    customStrength: 2,
    customAgility: 1,
    baseCapacity: 15,
    capacityUsed: 3,
    enhancements: [
      {
        id: "enh-1",
        catalogId: "enhancement-strength",
        name: "Enhanced Strength",
        enhancementType: "strength",
        rating: 2,
        capacityUsed: 2,
        cost: 13000,
        availability: 16,
      },
    ],
    accessories: [
      {
        id: "acc-1",
        catalogId: "gyromount",
        name: "Gyromount",
        capacityUsed: 1,
        cost: 6000,
        availability: 12,
      },
    ],
    weapons: [],
    wirelessEnabled: true,
    condition: "working",
    installedAt: "2024-06-01T00:00:00Z",
    modificationHistory: [],
    ...overrides,
  } as CyberlimbItem;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("AugmentationsDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no cyberware, bioware, or cyberlimbs", () => {
    const character = makeCharacter();
    const { container } = render(<AugmentationsDisplay character={character} />);
    expect(container.innerHTML).toBe("");
  });

  it('renders "Cyberlimbs" section header when character has cyberlimbs', () => {
    const character = makeCharacter({
      cyberlimbs: [makeCyberlimb()],
    });
    render(<AugmentationsDisplay character={character} />);
    expect(screen.getByText("Cyberlimbs")).toBeInTheDocument();
  });

  it("shows limb name, location, STR/AGI, capacity in collapsed row", () => {
    const limb = makeCyberlimb();
    const character = makeCharacter({ cyberlimbs: [limb] });
    render(<AugmentationsDisplay character={character} />);

    const row = screen.getByTestId("cyberlimb-row");
    expect(within(row).getByText("Cyberarm")).toBeInTheDocument();
    expect(within(row).getByTestId("location-pill")).toHaveTextContent("L. Arm");
    // STR = 3 + 2 + 2(enh) = 7, AGI = 3 + 1 = 4
    expect(within(row).getByTestId("str-agi-display")).toHaveTextContent("S7 A4");
    expect(within(row).getByTestId("capacity-display")).toHaveTextContent("[3/15]");
  });

  it("expanding a limb row shows enhancements and accessories", () => {
    const limb = makeCyberlimb();
    const character = makeCharacter({ cyberlimbs: [limb] });
    render(<AugmentationsDisplay character={character} />);

    // Click to expand
    fireEvent.click(screen.getByTestId("cyberlimb-row"));

    expect(screen.getByTestId("cyberlimb-expanded")).toBeInTheDocument();
    expect(screen.getByTestId("enhancements-list")).toBeInTheDocument();
    expect(screen.getByText("Enhanced Strength")).toBeInTheDocument();
    expect(screen.getByTestId("accessories-list")).toBeInTheDocument();
    expect(screen.getByText("Gyromount")).toBeInTheDocument();
  });

  it("capacity bar renders with correct percentage", () => {
    const limb = makeCyberlimb({ capacityUsed: 12, baseCapacity: 15 });
    const character = makeCharacter({ cyberlimbs: [limb] });
    render(<AugmentationsDisplay character={character} />);

    fireEvent.click(screen.getByTestId("cyberlimb-row"));

    const bar = screen.getByTestId("capacity-bar");
    expect(bar).toBeInTheDocument();
    // 12/15 = 80% → amber color
    const fill = bar.querySelector("[style]");
    expect(fill).toHaveStyle({ width: "80%" });
  });

  it("+Enhancement button opens modal in editable mode", () => {
    const limb = makeCyberlimb();
    const character = makeCharacter({ cyberlimbs: [limb] });
    const onUpdate = vi.fn();
    render(<AugmentationsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    fireEvent.click(screen.getByTestId("cyberlimb-row"));
    fireEvent.click(screen.getByTestId("add-enhancement-btn"));
    expect(screen.getByTestId("enhancement-modal")).toBeInTheDocument();
  });

  it("+Accessory button opens modal in editable mode", () => {
    const limb = makeCyberlimb();
    const character = makeCharacter({ cyberlimbs: [limb] });
    const onUpdate = vi.fn();
    render(<AugmentationsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    fireEvent.click(screen.getByTestId("cyberlimb-row"));
    fireEvent.click(screen.getByTestId("add-accessory-btn"));
    expect(screen.getByTestId("accessory-modal")).toBeInTheDocument();
  });

  it("remove enhancement calls handler with correct IDs", async () => {
    mockRemoveEnhancement.mockResolvedValueOnce({ success: true });
    const limb = makeCyberlimb();
    const character = makeCharacter({ cyberlimbs: [limb] });
    const onUpdate = vi.fn();
    render(<AugmentationsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    fireEvent.click(screen.getByTestId("cyberlimb-row"));
    fireEvent.click(screen.getByTestId("remove-enhancement-enh-1"));

    expect(mockRemoveEnhancement).toHaveBeenCalledWith("limb-1", "enh-1");
  });

  it("action buttons hidden when editable is false", () => {
    const limb = makeCyberlimb();
    const character = makeCharacter({ cyberlimbs: [limb] });
    render(<AugmentationsDisplay character={character} />);

    fireEvent.click(screen.getByTestId("cyberlimb-row"));
    expect(screen.queryByTestId("add-enhancement-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("add-accessory-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("remove-enhancement-enh-1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("remove-accessory-acc-1")).not.toBeInTheDocument();
  });

  it("wireless toggle works for cyberlimbs", async () => {
    mockToggleWireless.mockResolvedValueOnce({ success: true });
    const limb = makeCyberlimb({ wirelessEnabled: true });
    const character = makeCharacter({ cyberlimbs: [limb] });
    const onUpdate = vi.fn();
    render(<AugmentationsDisplay character={character} onCharacterUpdate={onUpdate} editable />);

    fireEvent.click(screen.getByTestId("cyberlimb-row"));
    expect(screen.getByTestId("cyberlimb-wireless-toggle")).toBeInTheDocument();
  });
});
